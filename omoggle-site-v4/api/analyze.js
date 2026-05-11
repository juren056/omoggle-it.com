// api/analyze.js — Vercel Serverless Function
// Uses OpenAI-compatible API via gptsapi.net

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
      ? 'You are a fun face rating AI for entertainment. Rate this face on a scale of 4.0 to 8.5. Return ONLY JSON: {"score":<number>}. No explanation.'
      : 'You are a fun looksmaxxing AI for MogScore entertainment website. Analyze this face photo for entertainment purposes only. Return ONLY valid JSON, no markdown: {"overall":<4.5-8.5>,"tier":"<Molecule|Sub3|LTN|MTN|HTN|Chadlite|Chad|Slayer>","metrics":[{"name":"Facial Symmetry","score":<1-10>},{"name":"Canthal Tilt","score":<1-10>},{"name":"Jawline Definition","score":<1-10>},{"name":"Cheekbone Prominence","score":<1-10>},{"name":"Skin Clarity","score":<1-10>},{"name":"Overall Harmony","score":<1-10>}],"advice":["<fun looksmaxxing tip 1>","<tip 2>","<tip 3>","<tip 4>"]} Keep overall between 4.5 and 8.5. Be encouraging and fun.'

    const apiKey = process.env.GPTSAPI_KEY
    if (!apiKey) return res.status(500).json({ error: 'API not configured' })

    // Use OpenAI-compatible endpoint with GPT-4o mini
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
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: 'low'
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }]
      })
    })

    const data = await response.json()

    if (data.error) {
      console.error('API error:', data.error)
      return res.status(500).json({ error: data.error.message || 'API error' })
    }

    const text = data.choices?.[0]?.message?.content || ''

    // Check if model refused
    const refusalKeywords = [
      "i can't", "i cannot", "i'm not able", "i am not able",
      "i'm not comfortable", "i don't feel comfortable",
      "i'm unable", "i am unable", "i won't", "i will not",
      "not appropriate", "violates", "against my"
    ]
    const lowerText = text.toLowerCase()
    if (refusalKeywords.some(kw => lowerText.includes(kw))) {
      return res.status(200).json({ error: 'inappropriate_image' })
    }

    // Check JSON error field
    try {
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      if (parsed.error === 'inappropriate_image') {
        return res.status(200).json({ error: 'inappropriate_image' })
      }
    } catch { }

    return res.status(200).json({ result: text })

  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: 'Analysis failed, please try again' })
  }
}
