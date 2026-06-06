/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    const contentPages = [
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

    const htmlRedirects = contentPages.map(slug => ({
      source: `/${slug}.html`,
      destination: `/${slug}`,
      permanent: true,
    }))

    const coreRedirects = [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/tools.html', destination: '/tools', permanent: true },
      { source: '/blog.html', destination: '/blog', permanent: true },
      { source: '/what-is-omoggle.html', destination: '/what-is-omoggle', permanent: true },
    ]

    const langs = ['ja', 'pt', 'ru']
    const i18nRedirects = []
    langs.forEach(lang => {
      contentPages.forEach(page => {
        i18nRedirects.push({
          source: `/${lang}/${page}`,
          destination: `/${lang}/${page}.html`,
          permanent: false,
        })
      })
      ;['tools','blog','what-is-omoggle'].forEach(p => {
        i18nRedirects.push({
          source: `/${lang}/${p}`,
          destination: p === 'what-is-omoggle' ? `/${lang}/${p}.html` : `/${lang}/${p}.html`,
          permanent: false,
        })
      })
    })

    return [...coreRedirects, ...htmlRedirects, ...i18nRedirects]
  },
}

module.exports = nextConfig
