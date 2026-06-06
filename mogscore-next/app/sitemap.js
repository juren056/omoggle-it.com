export default function sitemap() {
  const baseUrl = 'https://omoggle-it.com'
  const today = new Date().toISOString().split('T')[0]

  const corePages = [
    { url: baseUrl, lastModified: today, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: today, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/psl-scale-test`, lastModified: today, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/blog`, lastModified: today, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/what-is-omoggle`, lastModified: today, changeFrequency: 'monthly', priority: 0.9 },
  ]

  const contentSlugs = [
    'agent00-omoggle',
    'asmongold-omoggle',
    'best-angle-for-photos',
    'canthal-tilt-guide',
    'clavicular-mogged',
    'contact',
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

  const contentPages = contentSlugs.map(slug => ({
    url: `${baseUrl}/${slug}`,
    lastModified: today,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const langs = ['ja', 'pt', 'ru']
  const i18nPages = langs.flatMap(lang => [
    { url: `${baseUrl}/${lang}`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/${lang}/tools`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/${lang}/what-is-omoggle`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/${lang}/how-to-win-omoggle`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/${lang}/psl-scale-explained`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/${lang}/looksmaxxing-guide`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/${lang}/xqc-omoggle`, lastModified: today, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/${lang}/canthal-tilt-guide`, lastModified: today, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/${lang}/omoggle-tier-list-2026`, lastModified: today, changeFrequency: 'monthly', priority: 0.65 },
  ])

  return [...corePages, ...contentPages, ...i18nPages]
}
