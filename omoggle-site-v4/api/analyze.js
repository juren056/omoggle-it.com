// api/analyze.js — Vercel Serverless Function
// API Key stored in GPTSAPI_KEY environment variable — never exposed to users

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { imageBase64, mode } = req.body
    if (!imageBase64) return res.status(400).json({ error: 'No image provided' })

    const isCompare = mode === 'compare'
    const prompt = isCompare
      ? 'Rate this face for looksmaxxing entertainment. Return ONLY JSON, no markdown: {"score":<number 4.0-8.5>}. If the image contains inappropriate, explicit, or non-face content, return: {"error":"inappropriate_image"}'
      : 'You are a looksmaxxing AI analyzer for MogScore entertainment website. Analyze this face photo. Be encouraging. Return ONLY valid JSON, no markdown, no backticks: {"overall":<4.5-8.5>,"tier":"<Molecule|Sub3|LTN|MTN|HTN|Chadlite|Chad|Slayer>","metrics":[{"name":"Facial Symmetry","score":<1-10>},{"name":"Canthal Tilt","score":<1-10>},{"name":"Jawline Definition","score":<1-10>},{"name":"Cheekbone Prominence","score":<1-10>},{"name":"Skin Clarity","score":<1-10>},{"name":"Overall Harmony","score":<1-10>}],"advice":["<real looksmaxxing tip using culture terms>","<tip2>","<tip3>","<tip4>"]} Keep overall 4.5-8.5. If the image contains inappropriate, explicit, nudity, or non-face content, return: {"error":"inappropriate_image"}'

    const apiKey = process.env.GPTSAPI_KEY
    if (!apiKey) return res.status(500).json({ error: 'API not configured' })

    const response = await fetch('https://api.gptsapi.net/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: isCompare ? 80 : 900,
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
          { type: 'text', text: prompt }
        ]}]
      })
    })

    const data = await response.json()
    if (data.error) return res.status(500).json({ error: data.error.message || 'API error' })

    const text = (data.content || []).map(i => i.text || '').join('')

    // NSFW / refusal detection
    const refusalKeywords = [
      "i can't", "i cannot", "i'm not able", "i am not able",
      "inappropriate", "explicit", "nudity", "sexual",
      "i'm unable", "i am unable", "not appropriate",
      "violates", "against my", "i won't", "i will not",
      "harmful", "i don't feel comfortable"
    ]
    const lowerText = text.toLowerCase()
    const isRefusal = refusalKeywords.some(kw => lowerText.includes(kw))

    if (isRefusal) {
      return res.status(200).json({ error: 'inappropriate_image' })
    }

    // Check if JSON result itself contains error field
    try {
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      if (parsed.error === 'inappropriate_image') {
        return res.status(200).json({ error: 'inappropriate_image' })
      }
    } catch {
      // Not valid JSON — handled by frontend
    }

    return res.status(200).json({ result: text })

  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: 'Analysis failed, please try again' })
  }
}
