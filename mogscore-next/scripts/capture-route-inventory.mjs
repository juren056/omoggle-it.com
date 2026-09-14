import fs from 'node:fs/promises'
import path from 'node:path'

const base = process.argv[2] || 'http://127.0.0.1:3000'
const output = process.argv[3] || 'docs/seo-ad-rebuild/routes.json'

function text(html, pattern) {
  return html.match(pattern)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || null
}

const sitemapResponse = await fetch(`${base}/sitemap.xml`, { redirect: 'manual' })
if (!sitemapResponse.ok) throw new Error(`sitemap returned ${sitemapResponse.status}`)
const sitemap = await sitemapResponse.text()
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname)
const sourceSlugs = new Set(urls)
const routes = []

for (const pathname of urls) {
  const response = await fetch(`${base}${pathname}`, { redirect: 'follow' })
  const html = await response.text()
  const headerRobots = response.headers.get('x-robots-tag')
  routes.push({
    url: pathname,
    pageType: pathname === '/' ? 'home' : pathname.startsWith('/ja/') || pathname.startsWith('/pt/') || pathname.startsWith('/ru/') ? 'localized' : pathname.includes('test') || pathname === '/tools' || pathname === '/mog-score' ? 'tool-or-tool-guide' : 'content',
    language: pathname.match(/^\/(ja|pt|ru)(?:\/|$)/)?.[1] || 'en',
    status: response.status,
    finalUrl: new URL(response.url).pathname,
    title: text(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    h1: text(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i),
    canonical: html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1] || null,
    robots: headerRobots || html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)/i)?.[1] || 'index,follow (default)',
    inSitemap: sourceSlugs.has(pathname),
    source: 'Next.js route or public HTML; see source route map',
    plannedAction: 'preserve unless documented otherwise',
    measuredFrom: base,
  })
}

await fs.mkdir(path.dirname(output), { recursive: true })
await fs.writeFile(output, `${JSON.stringify({ capturedAt: new Date().toISOString(), base, count: routes.length, routes }, null, 2)}\n`)
console.log(`Captured ${routes.length} routes to ${output}`)
