import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const files = []
function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, entry.name); if (entry.isDirectory()) walk(file); else files.push(file) } }
for (const dir of ['app', 'components', 'public']) walk(path.join(root, dir))
const textFiles = files.filter(file => /\.(?:js|mjs|html|txt)$/.test(file))
const legacy = textFiles.filter(file => /googlesyndication|adsbygoogle|ca-pub-|Google AdSense/.test(fs.readFileSync(file, 'utf8')))
assert.deepEqual(legacy, [], `legacy AdSense references: ${legacy.join(', ')}`)
assert.equal(fs.existsSync(path.join(root, 'public', 'ads.txt')), false, 'unverified ads.txt must remain absent')
for (const asset of ['public/mediapipe/models/face_landmarker_v1.task', 'public/mediapipe/wasm/vision_wasm_internal.wasm']) {
  assert.ok(fs.statSync(path.join(root, asset)).size > 1_000_000, `${asset} should be a real binary asset`)
}
const sitemap = fs.readFileSync(path.join(root, 'app', 'sitemap.js'), 'utf8')
for (const route of ['/face-shape-detector', '/omoggle-troubleshooting', '/about']) assert.ok(sitemap.includes(route), `${route} missing from sitemap`)
const layout = fs.readFileSync(path.join(root, 'app', 'layout.js'), 'utf8')
const toolsPage = fs.readFileSync(path.join(root, 'app', 'tools', 'page.js'), 'utf8')
assert.ok(!layout.includes('ThirdPartyScripts'), 'cookie/optional-services popup must not be mounted')
assert.ok(!toolsPage.includes('TosModal'), 'tools page must not show an entry modal')
assert.ok(!textFiles.some(file => fs.readFileSync(file, 'utf8').includes('omoggle_optional_services_consent')), 'obsolete consent storage key must be removed')
console.log(`Static rebuild checks passed across ${textFiles.length} text files.`)
