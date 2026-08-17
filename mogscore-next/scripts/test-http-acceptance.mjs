import assert from 'node:assert/strict'
import http from 'node:http'

const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3127'
const publicPaths = [
  '/', '/blog', '/tools', '/what-is-omoggle', '/agent00-omoggle',
  '/omoggle-practice-test', '/psl-test', '/psl-scale', '/mog-score',
  '/ja', '/pt', '/ru', '/ja/what-is-omoggle', '/pt/tools', '/ru/tools',
]

for (const path of publicPaths) {
  const response = await fetch(`${origin}${path}`, {
    redirect: 'manual',
    headers: { 'user-agent': 'Googlebot', cookie: '__session=invalid-public-cookie' },
  })
  assert.equal(response.status, 200, `${path} should return 200 without an auth redirect`)
  const html = await response.text()
  assert.equal((html.match(/<link rel="canonical"/g) || []).length, 1, `${path} should have exactly one canonical`)
  assert.equal(/clerk|handshake/i.test(html), false, `${path} should not load Clerk or handshake markup`)
}

const signIn = await fetch(`${origin}/sign-in`, { redirect: 'manual' })
assert.equal(signIn.status, 200, '/sign-in should remain available')
assert.match(await signIn.text(), /clerk/i, '/sign-in should still load Clerk')

function requestWithHeaders(path, headers) {
  return new Promise((resolve, reject) => {
    const url = new URL(origin)
    const request = http.request({ hostname: url.hostname, port: url.port, path, headers }, response => {
      response.resume()
      response.on('end', () => resolve(response))
    })
    request.on('error', reject)
    request.end()
  })
}

for (const [headers, expected] of [
  [{ host: 'www.omoggle-it.com' }, 'https://omoggle-it.com/psl-test'],
  [{ host: 'omoggle-it.com', 'x-forwarded-proto': 'http' }, 'https://omoggle-it.com/psl-test'],
]) {
  const response = await requestWithHeaders('/psl-test', headers)
  assert.equal(response.statusCode, 301, 'non-canonical origin should use a permanent redirect')
  assert.equal(response.headers.location, expected, 'canonical redirect target should be exact and port-free')
}

const sitemapResponse = await fetch(`${origin}/sitemap.xml`)
assert.equal(sitemapResponse.status, 200)
const sitemap = await sitemapResponse.text()
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])
assert.equal(new Set(locations).size, locations.length, 'sitemap URLs should be unique')
for (const location of locations) {
  const path = new URL(location).pathname
  const response = await fetch(`${origin}${path}`, { redirect: 'manual', headers: { 'user-agent': 'Googlebot' } })
  assert.equal(response.status, 200, `indexed sitemap URL should remain 200: ${path}`)
}
for (const path of ['/omoggle-practice-test', '/psl-test', '/psl-scale', '/mog-score']) {
  assert(locations.includes(`https://omoggle-it.com${path}`), `sitemap missing ${path}`)
}
for (const forbidden of ['/psl-scale-explained', '/psl-scale-test', '/sign-in', '/sign-up']) {
  assert.equal(locations.includes(`https://omoggle-it.com${forbidden}`), false, `sitemap should exclude ${forbidden}`)
}
assert.equal(locations.some(url => new URL(url).pathname.startsWith('/api/')), false, 'sitemap should exclude APIs')

const robots = await (await fetch(`${origin}/robots.txt`)).text()
for (const path of ['/api/', '/dashboard', '/account', '/sign-in', '/sign-up']) {
  assert(robots.includes(`Disallow: ${path}`), `robots missing disallow for ${path}`)
}

console.log(JSON.stringify({ publicPagesChecked: publicPaths.length, sitemapUrls: locations.length, sitemapUrlsReturning200: locations.length }, null, 2))
