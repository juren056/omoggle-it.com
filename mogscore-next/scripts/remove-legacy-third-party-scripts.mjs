import fs from 'node:fs/promises'
import path from 'node:path'
import * as cheerio from 'cheerio'

const publicDir = path.join(process.cwd(), 'public')
let changed = 0

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) await walk(file)
    else if (entry.name.endsWith('.html')) await clean(file)
  }
}

async function clean(file) {
  const source = await fs.readFile(file, 'utf8')
  const $ = cheerio.load(source, { decodeEntities: false })
  $('script').each((_, element) => {
    const script = $(element)
    const src = script.attr('src') || ''
    const body = script.html() || ''
    if (
      src.includes('googletagmanager.com/gtag/') ||
      src.includes('googlesyndication.com/pagead/') ||
      body.includes('function gtag()') ||
      body.includes("gtag('config'")
    ) script.remove()
  })
  $('*').contents().filter((_, node) => node.type === 'comment' && /Google AdSense/i.test(node.data || '')).remove()
  const next = $.html()
  if (next !== source) {
    await fs.writeFile(file, next)
    changed += 1
  }
}

await walk(publicDir)
console.log(`Removed legacy analytics/AdSense injection from ${changed} HTML files.`)
