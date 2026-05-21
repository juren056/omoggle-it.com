import { NextResponse } from 'next/server'

export async function GET(req) {
  const country = req.headers.get('x-vercel-ip-country') || ''
  const map = {
    JP: 'ja', BR: 'pt', PT: 'pt', RU: 'ru', BY: 'ru', KZ: 'ru',
    US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en',
  }
  const lang = map[country] || 'en'
  return NextResponse.json({ lang, country })
}
