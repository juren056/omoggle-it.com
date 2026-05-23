import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ipStore = new Map()

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function checkIPRateLimit(ip, limit) {
  const today = getToday()
  const key = `${ip}:${today}`
  const count = ipStore.get(key) || 0
  if (count >= limit) return { allowed: false, count, limit }
  ipStore.set(key, count + 1)
  if (ipStore.size > 20000) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    for (const [k] of ipStore) {
      if (k.includes(yesterday)) ipStore.delete(k)
    }
  }
  return { allowed: true, count: count + 1, limit, remaining: limit - (count + 1) }
}

async function getUserId() {
  try {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId } = await auth()
    return userId || null
  } catch { return null }
}

async function checkUserRateLimit(userId, supabase) {
  const today = getToday()
  
  // Get user points record
  let { data } = await supabase
    .from('user_points')
    .select('extra_uses')
    .eq('user_id', userId)
    .single()

  const extraUses = data?.extra_uses || 0
  const baseLimit = 10 // logged in users get 10/day
  const totalLimit = baseLimit + extraUses

  // Check today's usage in log
  const { count } = await supabase
    .from('points_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', 'analyze_use')
    .gte('created_at', `${today}T00:00:00.000Z`)

  const usedToday = count || 0

  if (usedToday >= totalLimit) {
    return { allowed: false, used: usedToday, limit: totalLimit, extraUses }
  }

  // Log this usage
  await supabase.from('points_log').insert({
    user_id: userId,
    points: 0,
    action: 'analyze_use',
    description: `分析使用 (${usedToday + 1}/${totalLimit})`
  })

  return { allowed: true, used: usedToday + 1, limit: totalLimit, 
           remaining: totalLimit - (usedToday + 1), extraUses }
}

export async function POST(req) {
  const userId = await getUserId()
  const isLoggedIn = !!userId
  const supabase = isLoggedIn ? getSupabase() : null

  // Rate limiting
  let rateLimit
  if (isLoggedIn && supabase) {
    try {
      rateLimit = await checkUserRateLimit(userId, supabase)
    } catch {
      // Fall back to IP limiting if DB fails
      const forwarded = req.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
      rateLimit = checkIPRateLimit(ip, 10)
    }
  } else {
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
    rateLimit = checkIPRateLimit(ip, 3)
  }

  if (!rateLimit.allowed) {
    return NextResponse.json({
      error: 'rate_limit_exceeded',
      limit: rateLimit.limit,
      isLoggedIn,
      extraUses: rateLimit.extraUses || 0,
      resetAt: 'midnight UTC'
    }, { status: 429 })
  }

  try {
    const { imageBase64, mode } = await req.json()
    if (!imageBase64) return NextResponse.json({ error: 'No image provided' }, { status: 400 })

    const isCompare = mode === 'compare'
    const prompt = isCompare
      ? 'Rate this image for a fun entertainment app. Score from 4.0 to 8.5. Always return a score even if unclear. ONLY return {"error":"no_face"} if 100% certain there is no human at all. Return ONLY JSON: {"score":<number>}.'
      : 'You are a fun AI for MogScore entertainment. Score any image with a possible person. Even if blurry or filtered — always score it. ONLY return {"error":"no_face"} if 100% certain zero humans. Return ONLY valid JSON: {"overall":<4.5-8.5>,"tier":"<Molecule|Sub3|LTN|MTN|HTN|Chadlite|Chad|Slayer>","metrics":[{"name":"Facial Symmetry","score":<1-10>},{"name":"Canthal Tilt","score":<1-10>},{"name":"Jawline Definition","score":<1-10>},{"name":"Cheekbone Prominence","score":<1-10>},{"name":"Skin Clarity","score":<1-10>},{"name":"Overall Harmony","score":<1-10>}],"advice":["<tip1>","<tip2>","<tip3>","<tip4>"]} Keep overall 4.5-8.5.'

    const apiKey = process.env.GPTSAPI_KEY
    if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 })

    const response = await fetch('https://api.gptsapi.net/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: isCompare ? 80 : 900,
        messages: [{ role: 'user', content: [
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: 'low' } },
          { type: 'text', text: prompt }
        ]}]
      })
    })

    if (!response.ok) {
      return NextResponse.json({ error: `API returned ${response.status}` }, { status: 500 })
    }

    const data = await response.json()
    if (data.error) return NextResponse.json({ error: data.error.message || 'API error' }, { status: 500 })

    const text = data.choices?.[0]?.message?.content || ''

    const refusalKeywords = ["i can't", "i cannot", "i'm not able", "i won't", "not appropriate", "violates"]
    if (refusalKeywords.some(kw => text.toLowerCase().includes(kw))) {
      return NextResponse.json({ error: 'inappropriate_image' })
    }

    try {
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      if (parsed.error) return NextResponse.json({ error: parsed.error })
    } catch {}

    return NextResponse.json({
      result: text,
      remaining: rateLimit.remaining || 0,
      limit: rateLimit.limit,
      isLoggedIn,
      extraUses: rateLimit.extraUses || 0,
    })

  } catch (err) {
    console.error('Handler error:', err)
    return NextResponse.json({ error: 'Analysis failed: ' + err.message }, { status: 500 })
  }
}
