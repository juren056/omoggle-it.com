import assert from 'node:assert/strict'
import fs from 'node:fs'

const source = fs.readFileSync(new URL('../lib/html-links.js', import.meta.url), 'utf8')
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
const { cleanHref, cleanInternalHtmlLinks } = await import(moduleUrl)

assert.equal(cleanHref('tools.html'), 'tools')
assert.equal(new URL(cleanHref('tools.html'), 'https://omoggle-it.com/ja/article').pathname, '/ja/tools')
assert.equal(new URL(cleanHref('tools.html'), 'https://omoggle-it.com/article').pathname, '/tools')
assert.equal(cleanHref('index.html'), './')
assert.equal(new URL(cleanHref('index.html'), 'https://omoggle-it.com/ja/article').pathname, '/ja/')
assert.equal(cleanHref('/ja/tools.html?tab=face#result'), '/ja/tools?tab=face#result')
assert.equal(cleanHref('https://omoggle-it.com/ja/tools.html'), 'https://omoggle-it.com/ja/tools')
assert.equal(cleanHref('https://www.omoggle-it.com/tools.html'), 'https://omoggle-it.com/tools')
assert.equal(cleanHref('https://evilomoggle-it.com/tools.html'), 'https://evilomoggle-it.com/tools.html')
assert.equal(cleanHref('https://omoggle-it.com.evil.example/tools.html'), 'https://omoggle-it.com.evil.example/tools.html')
assert.equal(
  cleanInternalHtmlLinks('<a href="tools.html">Tool</a><a href="https://example.com/page.html">External</a>'),
  '<a href="tools">Tool</a><a href="https://example.com/page.html">External</a>',
)

console.log('html-links tests passed')
