import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { needsClerk } from '../lib/auth-route-scope.mjs'

const root = process.cwd()
const publicSeoPaths = [
  '/', '/blog', '/tools', '/robots.txt', '/sitemap.xml', '/what-is-omoggle',
  '/hunter-eyes-guide', '/ja', '/pt/what-is-omoggle', '/ru/tools',
  '/omoggle-practice-test', '/psl-test', '/psl-scale', '/mog-score',
]
const privatePaths = ['/dashboard', '/account/settings', '/profile', '/history/1', '/billing', '/api/analyze', '/api/points']
for (const pathname of publicSeoPaths) assert.equal(needsClerk(pathname), false, `${pathname} must bypass Clerk`)
for (const pathname of privatePaths) assert.equal(needsClerk(pathname), true, `${pathname} must use Clerk`)

const newRoutes = ['omoggle-practice-test', 'psl-test', 'psl-scale', 'mog-score']
for (const route of newRoutes) {
  const file = path.join(root, 'app', route, 'page.js')
  assert.equal(fs.existsSync(file), true, `missing /${route}`)
  const source = fs.readFileSync(file, 'utf8')
  assert.match(source, /canonical:/, `/${route} needs a canonical`)
  assert.match(source, new RegExp(`/${route}`), `/${route} canonical path is missing`)
}

const sitemap = fs.readFileSync(path.join(root, 'app', 'sitemap.js'), 'utf8')
for (const route of newRoutes) assert.match(sitemap, new RegExp(`/${route}`), `sitemap missing /${route}`)
assert.doesNotMatch(sitemap, /new Date\(\).*lastModified|const today/, 'sitemap must not refresh every date automatically')

const robots = fs.readFileSync(path.join(root, 'app', 'robots.js'), 'utf8')
for (const route of ['/dashboard/', '/account/', '/profile/', '/billing/', '/api/']) assert.match(robots, new RegExp(route.replaceAll('/', '\\/')))

const textExtensions = new Set(['.js', '.mjs', '.html', '.css', '.xml', '.txt', '.webmanifest'])
const oldBrandHits = []
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (textExtensions.has(path.extname(entry.name)) && /MogScore\.wiki|@mogscorewiki/.test(fs.readFileSync(file, 'utf8'))) oldBrandHits.push(file)
  }
}
for (const directory of ['app', 'components', 'lib', 'public']) walk(path.join(root, directory))
assert.deepEqual(oldBrandHits, [], `old brand remains in: ${oldBrandHits.join(', ')}`)

console.log('first-phase structural tests passed')
