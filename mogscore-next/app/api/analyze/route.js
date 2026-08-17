import { createHmac } from 'crypto'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabase } from '@/lib/supabase'
import { getSubscription, isProActive } from '@/lib/subscription'
import {
  MAX_REQUEST_BYTES,
  parseModelResult,
  validateAnalyzeRequest,
} from '@/lib/analyze-validation.mjs'

export const runtime = 'nodejs'

const PROMPTS = {
  compare: 'Rate this image for a fun entertainment app. Score from 4.0 to 8.5. Always return a score even if unclear. ONLY return {"error":"no_face"} if 100% certain there is no human at all. Return ONLY JSON: {"score":<number>}.',
  analyze: 'You are a fun AI for Mog Score entertainment. Score any image with a possible person. Even if blurry or filtered — always score it. ONLY return {"error":"no_face"} if 100% certain zero humans. Return ONLY valid JSON: {"overall":<4.5-8.5>,"tier":"<Molecule|Sub3|LTN|MTN|HTN|Chadlite|Chad|Slayer>","metrics":[{"name":"Facial Symmetry","score":<1-10>},{"name":"Canthal Tilt","score":<1-10>},{"name":"Jawline Definition","score":<1-10>},{"name":"Cheekbone Prominence","score":<1-10>},{"name":"Skin Clarity","score":<1-10>},{"name":"Overall Harmony","score":<1-10>}],"advice":["<tip1>","<tip2>","<tip3>","<tip4>"]} Keep overall 4.5-8.5.',
}

function requestError(error) {
  const messages = {
    invalid_request: 'Invalid request body',
    invalid_mode: 'Invalid analysis mode',
    invalid_image: 'Invalid image data',
    image_too_large: 'Image must be 4 MB or smaller',
    unsupported_image: 'Unsupported image format',
  }
  return messages[error.message] || null
}

async function readJsonBody(req) {
  if (!req.body) throw new Error('invalid_request')
  const reader = req.body.getReader()
  const chunks = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > MAX_REQUEST_BYTES) throw new Error('request_too_large')
      chunks.push(Buffer.from(value))
    }
  } finally {
    reader.releaseLock()
  }
  try {
    return JSON.parse(Buffer.concat(chunks, total).toString('utf8'))
  } catch (error) {
    if (error.message === 'request_too_large') throw error
    throw new Error('invalid_request')
  }
}

function clientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for')
  return (forwarded?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown').trim().slice(0, 128)
}

function quotaSubject(req, userId) {
  if (userId) return `user:${userId}`
  const secret = process.env.RATE_LIMIT_SECRET || process.env.SUPABASE_SERVICE_KEY
  if (!secret) throw new Error('quota_not_configured')
  return `guest:${createHmac('sha256', secret).update(clientIp(req)).digest('hex')}`
}

async function reserveQuota(supabase, { subject, userId, isPro }) {
  const { data, error } = await supabase.rpc('reserve_analysis_use', {
    p_subject: subject,
    p_user_id: userId,
    p_base_limit: userId ? 10 : 3,
    p_minute_limit: isPro ? 60 : userId ? 20 : 6,
    p_is_pro: isPro,
  })
  if (error) throw new Error(`quota_reservation_failed:${error.message}`)
  return data
}

async function updateReservation(supabase, functionName, reservationId) {
  if (!reservationId) return false
  const { data, error } = await supabase.rpc(functionName, { p_reservation_id: reservationId })
  if (error) throw new Error(`${functionName}_failed:${error.message}`)
  return data === true
}

async function callVisionModel({ apiKey, imageBase64, mime, mode }) {
  const response = await fetch('https://api.gptsapi.net/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(30_000),
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: mode === 'compare' ? 80 : 900,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mime};base64,${imageBase64}`, detail: 'low' } },
          { type: 'text', text: PROMPTS[mode] },
        ],
      }],
    }),
  })

  if (!response.ok) throw new Error(`upstream_${response.status}`)
  const data = await response.json()
  if (data.error) throw new Error('upstream_error')
  const text = data.choices?.[0]?.message?.content || ''
  const refusalKeywords = ["i can't", 'i cannot', "i'm not able", "i won't", 'not appropriate', 'violates']
  if (refusalKeywords.some(keyword => text.toLowerCase().includes(keyword))) return { error: 'inappropriate_image' }
  return parseModelResult(text, mode)
}

async function getValidatedModelResult(input) {
  try {
    return await callVisionModel(input)
  } catch (error) {
    if (error.message !== 'invalid_model_response') throw error
    return callVisionModel(input)
  }
}

export async function POST(req) {
  if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 })
  }
  const contentLength = Number(req.headers.get('content-length') || 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
  }

  let input
  try {
    input = validateAnalyzeRequest(await readJsonBody(req))
  } catch (error) {
    if (error.message === 'request_too_large') {
      return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
    }
    const message = requestError(error)
    return NextResponse.json({ error: message || 'Invalid request' }, { status: message ? 400 : 500 })
  }

  const apiKey = process.env.GPTSAPI_KEY
  const supabase = getSupabase()
  if (!apiKey || !supabase) {
    return NextResponse.json({ error: 'Analysis service not configured' }, { status: 503 })
  }

  const { userId } = await auth()
  const isLoggedIn = Boolean(userId)
  let isPro = false
  if (userId) {
    try {
      isPro = isProActive(await getSubscription(userId))
    } catch (error) {
      console.error('[analyze subscription]', error)
      return NextResponse.json({ error: 'Could not verify subscription' }, { status: 503 })
    }
  }

  let quota
  try {
    quota = await reserveQuota(supabase, {
      subject: quotaSubject(req, userId),
      userId,
      isPro,
    })
  } catch (error) {
    console.error('[analyze quota]', error)
    return NextResponse.json({ error: 'Usage limit service unavailable' }, { status: 503 })
  }

  if (!quota?.allowed) {
    const minuteLimited = quota?.reason === 'minute_limit'
    return NextResponse.json({
      error: minuteLimited ? 'too_many_requests' : 'rate_limit_exceeded',
      limit: quota?.limit ?? (userId ? 10 : 3),
      remaining: quota?.remaining ?? 0,
      isLoggedIn,
      extraUses: quota?.extraUses || 0,
      isPro,
      resetAt: minuteLimited ? 'next minute' : 'midnight UTC',
    }, { status: 429 })
  }

  const reservationId = quota.reservationId
  try {
    const result = await getValidatedModelResult({ apiKey, ...input })
    if (result.error) {
      await updateReservation(supabase, 'release_analysis_use', reservationId)
      return NextResponse.json({ error: result.error }, { status: 422 })
    }
    const finalized = await updateReservation(supabase, 'finalize_analysis_use', reservationId)
    if (!finalized) throw new Error('reservation_finalize_rejected')
    return NextResponse.json({
      result,
      used: quota.used,
      remaining: quota.remaining,
      limit: quota.limit,
      isLoggedIn,
      extraUses: quota.extraUses || 0,
      isPro,
    })
  } catch (error) {
    try {
      await updateReservation(supabase, 'release_analysis_use', reservationId)
    } catch (releaseError) {
      console.error('[analyze quota release]', releaseError)
    }
    console.error('[analyze model]', error)
    const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError'
    return NextResponse.json(
      { error: timedOut ? 'Analysis timed out' : 'Analysis failed, please try again' },
      { status: timedOut ? 504 : 502 }
    )
  }
}
