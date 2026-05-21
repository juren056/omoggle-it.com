// api/analyze.js — Vercel Serverless Function
// With IP-based rate limiting: 3 requests/day for anonymous users

const ipStore = new Map(); // In-memory store (resets on cold start)

function getToday() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function checkRateLimit(ip) {
  const today = getToday();
  const key = `${ip}:${today}`;
  const count = ipStore.get(key) || 0;
  
  if (count >= 3) {
    return { allowed: false, count, limit: 3 };
  }
  
  ipStore.set(key, count + 1);
  
  // Clean old entries (keep map small)
  if (ipStore.size > 10000) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    for (const [k] of ipStore) {
      if (k.includes(yesterday)) ipStore.delete(k);
    }
  }
  
  return { allowed: true, count: count + 1, limit: 3, remaining: 3 - (count + 1) };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Get real IP
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim()

  // Check rate limit
  const rateLimit = checkRateLimit(ip)
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'rate_limit_exceeded',
      message: 'Daily limit reached',
      limit: 3,
      resetAt: 'midnight UTC'
    })
  }

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', '3')
  res.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining || 0))

  try {
    const { imageBase64, mode } = req.body
    if (!imageBase64) return res.status(400).json({ error: 'No image provided' })

    const isCompare = mode === 'compare'
    const prompt = isCompare
      ? 'Rate this image for a fun entertainment app. Score from 4.0 to 8.5. Always return a score even if the image is unclear or low quality — just do your best estimate. ONLY return {"error":"no_face"} if it is 100% certain there is no human at all (e.g. a photo of a car or tree). Return ONLY JSON: {"score":<number>}.'
      : 'You are a fun AI for MogScore entertainment. Your job is to always provide a score for any image that might contain a person. Even if the face is partially visible, blurry, has filters, beauty effects, low resolution, unusual lighting, or is a selfie — always score it. Be very generous in detecting humans. ONLY return {"error":"no_face"} if you are 100% certain the image contains zero humans (e.g. pure landscape, food, car, chess pieces). For any image where a human MIGHT be present, always return scores. Return ONLY valid JSON, no markdown: {"overall":<4.5-8.5>,"tier":"<Molecule|Sub3|LTN|MTN|HTN|Chadlite|Chad|Slayer>","metrics":[{"name":"Facial Symmetry","score":<1-10>},{"name":"Canthal Tilt","score":<1-10>},{"name":"Jawline Definition","score":<1-10>},{"name":"Cheekbone Prominence","score":<1-10>},{"name":"Skin Clarity","score":<1-10>},{"name":"Overall Harmony","score":<1-10>}],"advice":["<encouraging looksmaxxing tip>","<tip 2>","<tip 3>","<tip 4>"]} Keep overall 4.5-8.5. Always be encouraging.'

    const apiKey = process.env.GPTSAPI_KEY
    if (!apiKey) return res.status(500).json({ error: 'API not configured' })

    const response = await fetch('https://api.gptsapi.net/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: isCompare ? 80 : 900,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: 'low' } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    })

    const data = await response.json()
    if (data.error) return res.status(500).json({ error: data.error.message || 'API error' })

    const text = data.choices?.[0]?.message?.content || ''

    const refusalKeywords = ["i can\'t", "i cannot", "i\'m not able", "i\'m not comfortable", "i don\'t feel comfortable", "i\'m unable", "i won\'t", "not appropriate", "violates", "against my"]
    if (refusalKeywords.some(kw => text.toLowerCase().includes(kw))) {
      return res.status(200).json({ error: 'inappropriate_image' })
    }

    try {
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      if (parsed.error === 'inappropriate_image') return res.status(200).json({ error: 'inappropriate_image' })
      if (parsed.error === 'no_face') return res.status(200).json({ error: 'no_face' })
    } catch {}

    return res.status(200).json({ result: text, remaining: rateLimit.remaining || 0 })

  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: 'Analysis failed, please try again' })
  }
}
