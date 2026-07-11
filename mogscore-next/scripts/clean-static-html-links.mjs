import fs from 'node:fs'
import path from 'node:path'

const LANGS = ['ja', 'pt', 'ru']
const SLUGS = ['tools', 'what-is-omoggle']
const OWN_ORIGIN = 'https://omoggle-it.com'

function cleanPath(value) {
  const match = value.match(/^([^?#]*)([?#].*)?$/)
  let pathname = match?.[1] ?? value
  const suffix = match?.[2] ?? ''

  pathname = pathname.replace(/(^|\/)index\.html$/i, '$1')
  pathname = pathname.replace(/\.html$/i, '')
  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, '')
  if (pathname === '') pathname = '/'

  return pathname + suffix
}

function cleanUrl(value) {
  if (value.startsWith(OWN_ORIGIN)) {
    return OWN_ORIGIN + cleanPath(value.slice(OWN_ORIGIN.length))
  }
  if (value.startsWith('/')) return cleanPath(value)
  return value
}

function cleanHtml(html) {
  return html
    .replace(/(href=)(["'])([^"']*)\2/gi, (match, attr, quote, href) => {
      return `${attr}${quote}${cleanUrl(href)}${quote}`
    })
    .replace(/(<meta\s+property=["']og:url["']\s+content=)(["'])([^"']*)\2/gi, (match, attr, quote, content) => {
      return `${attr}${quote}${cleanUrl(content)}${quote}`
    })
}

const checkOnly = process.argv.includes('--check')
let dirty = false

for (const lang of LANGS) {
  for (const slug of SLUGS) {
    const file = path.join(process.cwd(), 'public', lang, `${slug}.html`)
    const current = fs.readFileSync(file, 'utf8')
    const cleaned = cleanHtml(current)
    if (cleaned === current) continue

    dirty = true
    if (!checkOnly) fs.writeFileSync(file, cleaned)
    else console.error(`${file} contains legacy internal .html URLs`)
  }
}

if (checkOnly && dirty) process.exitCode = 1
