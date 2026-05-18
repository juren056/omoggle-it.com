import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// In-memory rate limit store
const ipStore = new Map()

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function checkRateLimit(key, limit) {
  const today = getToday()
  const storeKey = `${key}:${today}`
  const count = ipStore.get(storeKey) || 0
  if (count >= limit) return { allowed: false, count, limit }
  ipStore.set(storeKey, count + 1)
  if (ipStore.size > 20000) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    for (const [k] of ipStore) {
      if (k.includes(yesterday)) ipStore.delete(k)
    }
  }
  return { allowed: true, count: count + 1, limit, remaining: limit - (count + 1) }
}

export async function POST(req) {
  // Check auth
  const { userId } = await auth()
  const isLoggedIn = !!userId
  const dailyLimit = isLoggedIn ? 10 : 3

  // Get IP
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  const rateLimitKey = isLoggedIn ? `user:${userId}` : `ip:${ip}`

  const rateLimit = checkRateLimit(rateLimitKey, dailyLimit)
  if (!rateLimit.allowed) {
    return NextResponse.json({
      error: 'rate_limit_exceeded',
      limit: dailyLimit,
      isLoggedIn,
      resetAt: 'midnight UTC'
    }, { status: 429 })
  }

  try {
    const { imageBase64, mode } = await req.json()
    if (!imageBase64) return NextResponse.json({ error: 'No image provided' }, { status: 400 })

    const isCompare = mode === 'compare'
    const prompt = isCompare
      ? 'Rate this image for a fun entertainment app. Score from 4.0 to 8.5. ONLY return {"error":"no_face"} if 100% certain no human present. Return ONLY JSON: {"score":<number>}.'
      : 'You are a fun AI for MogScore entertainment. Score any image with a possible person. ONLY return {"error":"no_face"} if 100% certain zero humans (pure landscape, food, objects). Return ONLY valid JSON, no markdown: {"overall":<4.5-8.5>,"tier":"<Molecule|Sub3|LTN|MTN|HTN|Chadlite|Chad|Slayer>","metrics":[{"name":"Facial Symmetry","score":<1-10>},{"name":"Canthal Tilt","score":<1-10>},{"name":"Jawline Definition","score":<1-10>},{"name":"Cheekbone Prominence","score":<1-10>},{"name":"Skin Clarity","score":<1-10>},{"name":"Overall Harmony","score":<1-10>}],"advice":["<tip1>","<tip2>","<tip3>","<tip4>"]} Keep overall 4.5-8.5.'

    const apiKey = process.env.GPTSAPI_KEY
    if (!apiKey) return NextResponse.json({ error: 'API not configured' }, { status: 500 })

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

    const data = await response.json()
    if (data.error) return NextResponse.json({ error: data.error.message || 'API error' }, { status: 500 })

    const text = data.choices?.[0]?.message?.content || ''

    const refusalKeywords = ["i can't", "i cannot", "i'm not able", "i'm not comfortable", "i won't", "not appropriate", "violates"]
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
      limit: dailyLimit,
      isLoggedIn
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
