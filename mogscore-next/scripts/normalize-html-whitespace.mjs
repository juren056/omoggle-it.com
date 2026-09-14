import fs from 'node:fs/promises'
import path from 'node:path'

async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) await walk(file)
    else if (entry.name.endsWith('.html')) {
      const source = await fs.readFile(file, 'utf8')
      const normalized = source.replace(/[ \t]+$/gm, '').replace(/\r?\n/g, '\n')
      if (normalized !== source) await fs.writeFile(file, normalized)
    }
  }
}

await walk(path.join(process.cwd(), 'public'))
console.log('Normalized trailing whitespace in public HTML.')
