import fs from 'node:fs/promises'
import path from 'node:path'

function sourceFor(url) {
  if (url === '/') return 'app/page.js'
  const pieces = url.split('/').filter(Boolean)
  const direct = path.join('app', ...pieces, 'page.js').replaceAll('\\', '/')
  if (pieces.length === 1) return `app/${pieces[0]}/page.js or public/${pieces[0]}.html via app/[slug]/page.js`
  if (['ja', 'pt', 'ru'].includes(pieces[0])) return `${direct} or app/${pieces[0]}/[slug]/page.js with public source`
  return direct
}

for (const filename of process.argv.slice(2)) {
  const record = JSON.parse(await fs.readFile(filename, 'utf8'))
  for (const route of record.routes) route.source = sourceFor(route.url)
  await fs.writeFile(filename, `${JSON.stringify(record, null, 2)}\n`)
  console.log(`Enriched ${record.routes.length} entries in ${filename}`)
}
