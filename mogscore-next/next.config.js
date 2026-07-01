/** @type {import('next').NextConfig} */

// Duplicated from lib/i18n-routes.js — next.config must stay CommonJS-compatible
const SUPPORTED_LANGS = ['ja', 'pt', 'ru']
const LANG_STATIC_HTML_SLUGS = ['tools', 'what-is-omoggle']
const ENGLISH_CONTENT_SLUGS = [
  'agent00-omoggle', 'asmongold-omoggle', 'best-angle-for-photos', 'canthal-tilt-guide',
  'clavicular-mogged', 'face-fat-loss-guide', 'facial-features-guide', 'facial-symmetry-guide',
  'facial-symmetry-improvement', 'gym-face-guide', 'haircut-looksmaxxing', 'how-to-win-omoggle',
  'hunter-eyes-guide', 'is-omoggle-ai', 'jasontheween-omoggle', 'jawline-guide', 'jynxzi-omoggle',
  'looksmaxxing-for-women', 'looksmaxxing-glossary', 'looksmaxxing-guide', 'looksmaxxing-results-timeline',
  'mewing-guide', 'omoggle-beginner-guide', 'omoggle-camera-setup', 'omoggle-elo-system', 'omoggle-fake-sites',
  'omoggle-faq', 'omoggle-tier-list-2026', 'omoggle-tier-list', 'omoggle-top-players', 'omoggle-tricks-hacks',
  'omoggle-updates', 'omoggle-viral-moments', 'omoggle-vs-omegle', 'privacy-policy', 'psl-scale-explained',
  'skincare-looksmaxxing', 'sleep-looksmaxxing', 'softmaxxing-vs-hardmaxxing', 'streamers-omoggle-scores',
  'twitch-omoggle-rules', 'what-is-mogging', 'xqc-omoggle', 'is-omoggle-safe', 'quin69-soda-omoggle',
  'psl-scale-test', 'omegle-alternative-2026', 'looksmaxxing-for-women-guide', 'omoggle-camera-angle',
  'looksmaxxing-supplements', 'mogging-meaning', 'how-to-get-hunter-eyes', 'jawline-exercises',
  'face-shape-guide', 'mogger-meaning', 'looksmaxxing-before-after',
]

const nextConfig = {
  async redirects() {
    const htmlRedirects = ENGLISH_CONTENT_SLUGS.map(slug => ({
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

    const langRedirects = []
    for (const lang of SUPPORTED_LANGS) {
      langRedirects.push({
        source: `/${lang}/index.html`,
        destination: `/${lang}`,
        permanent: true,
      })

      for (const slug of LANG_STATIC_HTML_SLUGS) {
        langRedirects.push({
          source: `/${lang}/${slug}`,
          destination: `/${lang}/${slug}.html`,
          permanent: false,
        })
      }
    }

    return [...coreRedirects, ...htmlRedirects, ...langRedirects]
  },
}

module.exports = nextConfig
