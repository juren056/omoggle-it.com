/** Supported non-English locales */
export const SUPPORTED_LANGS = ['ja', 'pt', 'ru']

/**
 * Articles with dedicated translated pages at app/{lang}/{slug}/page.js
 * Do NOT also serve these via [lang]/[slug] English fallback.
 */
export const TRANSLATED_ARTICLE_SLUGS = [
  'canthal-tilt-guide',
  'how-to-win-omoggle',
  'looksmaxxing-guide',
  'psl-scale-explained',
  'xqc-omoggle',
  'omoggle-tier-list-2026',
]

/**
 * Locale pages served only from public/{lang}/{slug}.html (no app route).
 * Clean URLs redirect to these .html paths in next.config.js.
 */
export const LANG_STATIC_HTML_SLUGS = ['tools', 'what-is-omoggle']

/** English article slugs served via app/[slug] from public/{slug}.html */
export const ENGLISH_CONTENT_SLUGS = [
  'agent00-omoggle',
  'asmongold-omoggle',
  'best-angle-for-photos',
  'canthal-tilt-guide',
  'clavicular-mogged',
  'face-fat-loss-guide',
  'facial-features-guide',
  'facial-symmetry-guide',
  'facial-symmetry-improvement',
  'gym-face-guide',
  'haircut-looksmaxxing',
  'how-to-win-omoggle',
  'hunter-eyes-guide',
  'is-omoggle-ai',
  'jasontheween-omoggle',
  'jawline-guide',
  'jynxzi-omoggle',
  'looksmaxxing-for-women',
  'looksmaxxing-glossary',
  'looksmaxxing-guide',
  'looksmaxxing-results-timeline',
  'mewing-guide',
  'omoggle-beginner-guide',
  'omoggle-camera-setup',
  'omoggle-elo-system',
  'omoggle-fake-sites',
  'omoggle-faq',
  'omoggle-tier-list-2026',
  'omoggle-tier-list',
  'omoggle-top-players',
  'omoggle-tricks-hacks',
  'omoggle-updates',
  'omoggle-viral-moments',
  'omoggle-vs-omegle',
  'privacy-policy',
  'psl-scale-explained',
  'skincare-looksmaxxing',
  'sleep-looksmaxxing',
  'softmaxxing-vs-hardmaxxing',
  'streamers-omoggle-scores',
  'twitch-omoggle-rules',
  'what-is-mogging',
  'xqc-omoggle',
  'is-omoggle-safe',
  'quin69-soda-omoggle',
  'psl-scale-test',
  'omegle-alternative-2026',
  'looksmaxxing-for-women-guide',
  'omoggle-camera-angle',
  'looksmaxxing-supplements',
  'mogging-meaning',
  'how-to-get-hunter-eyes',
  'jawline-exercises',
  'face-shape-guide',
  'mogger-meaning',
  'looksmaxxing-before-after',
]

/** English slugs for [lang]/[slug] English-fallback mirror pages */
export const LANG_MIRROR_SLUGS = ENGLISH_CONTENT_SLUGS.filter(
  slug => !TRANSLATED_ARTICLE_SLUGS.includes(slug)
)

export function getI18nSitemapEntries(baseUrl, today) {
  const entries = []

  for (const lang of SUPPORTED_LANGS) {
    entries.push({
      url: `${baseUrl}/${lang}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    for (const slug of TRANSLATED_ARTICLE_SLUGS) {
      entries.push({
        url: `${baseUrl}/${lang}/${slug}`,
        lastModified: today,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }

    for (const slug of LANG_STATIC_HTML_SLUGS) {
      entries.push({
        url: `${baseUrl}/${lang}/${slug}`,
        lastModified: today,
        changeFrequency: slug === 'tools' ? 'weekly' : 'monthly',
        priority: slug === 'tools' ? 0.8 : 0.7,
      })
    }
  }

  return entries
}
