/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    const contentPages = [
      'agent00-omoggle','asmongold-omoggle','best-angle-for-photos',
      'canthal-tilt-guide','clavicular-mogged','contact',
      'face-fat-loss-guide','facial-features-guide','facial-symmetry-guide',
      'facial-symmetry-improvement','gym-face-guide','haircut-looksmaxxing',
      'how-to-win-omoggle','hunter-eyes-guide','is-omoggle-ai',
      'jasontheween-omoggle','jawline-guide','jynxzi-omoggle',
      'looksmaxxing-for-women','looksmaxxing-glossary','looksmaxxing-guide',
      'looksmaxxing-results-timeline','mewing-guide','omoggle-beginner-guide',
      'omoggle-camera-setup','omoggle-elo-system','omoggle-fake-sites',
      'omoggle-faq','omoggle-tier-list-2026','omoggle-tier-list',
      'omoggle-top-players','omoggle-tricks-hacks','omoggle-updates',
      'omoggle-viral-moments','omoggle-vs-omegle','privacy-policy',
      'psl-scale-explained','skincare-looksmaxxing','sleep-looksmaxxing',
      'softmaxxing-vs-hardmaxxing','streamers-omoggle-scores',
      'twitch-omoggle-rules','what-is-mogging','xqc-omoggle',
    ]

    // .html → clean URL redirects for English
    const htmlRedirects = contentPages.map(slug => ({
      source: `/${slug}.html`,
      destination: `/${slug}`,
      permanent: true,
    }))

    // Core pages
    const coreRedirects = [
      { source: '/omegle-alternative-2026.html', destination: '/omegle-alternative-2026', permanent: true },
      { source: '/looksmaxxing-for-women-guide.html', destination: '/looksmaxxing-for-women-guide', permanent: true },
      { source: '/omoggle-camera-angle.html', destination: '/omoggle-camera-angle', permanent: true },
      { source: '/looksmaxxing-supplements.html', destination: '/looksmaxxing-supplements', permanent: true },
      { source: '/mogging-meaning.html', destination: '/mogging-meaning', permanent: true },
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/psl-scale-test.html', destination: '/psl-scale-test', permanent: true },
      { source: '/tools.html', destination: '/tools', permanent: true },
      { source: '/blog.html', destination: '/blog', permanent: true },
      { source: '/what-is-omoggle.html', destination: '/what-is-omoggle', permanent: true },
    ]

    // Multilingual content page redirects (slug → slug.html since they're static)
    const i18nRedirects = []
    const langs = ['ja', 'pt', 'ru']
    langs.forEach(lang => {
      contentPages.forEach(page => {
        i18nRedirects.push({
          source: `/${lang}/${page}`,
          destination: `/${lang}/${page}.html`,
          permanent: false,
        })
      })
      // Special pages
      ;['tools','blog'].forEach(p => {
        i18nRedirects.push({
          source: `/${lang}/${p}`,
          destination: `/${lang}/${p}.html`,
          permanent: false,
        })
      })
      // what-is-omoggle for i18n
      i18nRedirects.push({
        source: `/${lang}/what-is-omoggle`,
        destination: `/${lang}/what-is-omoggle.html`,
        permanent: false,
      })
    })

    return [...coreRedirects, ...htmlRedirects, ...i18nRedirects]
  },
}

module.exports = nextConfig
