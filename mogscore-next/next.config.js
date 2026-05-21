/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Redirect all old .html URLs to clean Next.js routes
    const pages = [
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

    const htmlRedirects = pages.map(slug => ({
      source: `/${slug}.html`,
      destination: `/${slug}`,
      permanent: true,
    }))

    return [
      // Core page redirects
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/tools.html', destination: '/tools', permanent: true },
      { source: '/blog.html', destination: '/blog', permanent: true },
      { source: '/what-is-omoggle.html', destination: '/what-is-omoggle', permanent: true },
      // Content page redirects
      ...htmlRedirects,
    ]
  },
}

module.exports = nextConfig
