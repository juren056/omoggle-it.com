// api/detect-lang.js — IP-based language detection
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Vercel provides country via request headers
  const country = req.headers['x-vercel-ip-country'] || ''

  const countryToLang = {
    // Japanese
    'JP': 'ja',
    // Portuguese
    'BR': 'pt', 'PT': 'pt', 'AO': 'pt', 'MZ': 'pt',
    // Russian
    'RU': 'ru', 'BY': 'ru', 'KZ': 'ru', 'UA': 'ru',
    // English (default)
    'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en',
    'NZ': 'en', 'IE': 'en', 'ZA': 'en',
  }

  const lang = countryToLang[country] || 'en'
  res.status(200).json({ lang, country })
}
