import fs from 'fs'
import path from 'path'
import { ENGLISH_CONTENT_SLUGS, getI18nSitemapEntries } from '@/lib/i18n-routes'

const BASE_URL = 'https://omoggle-it.com'
const FIRST_PHASE_UPDATED = '2026-08-17'
const NON_CANONICAL_ALIASES = new Set(['psl-scale-explained', 'psl-scale-test'])

const CORE_PAGES = [
  { path: '', lastModified: FIRST_PHASE_UPDATED, changeFrequency: 'weekly', priority: 1 },
  { path: '/tools', lastModified: '2026-08-06', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/blog', lastModified: '2026-07-20', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/what-is-omoggle', lastModified: '2026-05-23', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/omoggle-practice-test', lastModified: FIRST_PHASE_UPDATED, changeFrequency: 'weekly', priority: 0.95 },
  { path: '/psl-test', lastModified: FIRST_PHASE_UPDATED, changeFrequency: 'weekly', priority: 0.95 },
  { path: '/psl-scale', lastModified: FIRST_PHASE_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
  { path: '/mog-score', lastModified: FIRST_PHASE_UPDATED, changeFrequency: 'weekly', priority: 0.95 },
  { path: '/contact', lastModified: '2026-06-04', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/pricing', lastModified: FIRST_PHASE_UPDATED, changeFrequency: 'monthly', priority: 0.5 },
  { path: '/terms-of-service', lastModified: '2026-06-04', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/refund-policy', lastModified: '2026-06-04', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/acceptable-use', lastModified: '2026-06-04', changeFrequency: 'yearly', priority: 0.4 },
]

function articleLastModified(slug) {
  try {
    const html = fs.readFileSync(path.join(process.cwd(), 'public', `${slug}.html`), 'utf8')
    return html.match(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"/)?.[1]
      || html.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"/)?.[1]
      || '2026-05-07'
  } catch {
    return '2026-05-07'
  }
}

export default function sitemap() {
  const coreEntries = CORE_PAGES.map(page => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
  const corePaths = new Set(CORE_PAGES.map(page => page.path.slice(1)))
  const contentEntries = ENGLISH_CONTENT_SLUGS
    .filter(slug => !NON_CANONICAL_ALIASES.has(slug) && !corePaths.has(slug))
    .map(slug => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: articleLastModified(slug),
      changeFrequency: 'monthly',
      priority: 0.75,
    }))

  return [...coreEntries, ...contentEntries, ...getI18nSitemapEntries(BASE_URL, '2026-05-23')]
}
