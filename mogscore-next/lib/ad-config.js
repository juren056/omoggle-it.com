const SENSITIVE_PREFIXES = [
  '/tools', '/psl-test', '/mog-score', '/face-shape-detector',
  '/omoggle-practice-test', '/account', '/billing', '/history',
  '/sign-in', '/sign-up', '/api',
]

const NON_MONETIZED_SLUGS = new Set([
  'about', 'acceptable-use', 'contact', 'pricing', 'privacy-policy',
  'refund-policy', 'terms-of-service',
])

const BANNER_SIZES = [
  ['728x90', 728, 90],
  ['468x60', 468, 60],
  ['160x300', 160, 300],
  ['320x50', 320, 50],
  ['300x250', 300, 250],
  ['160x600', 160, 600],
]

// Adsterra placement values are public by design: browsers receive them with each ad request.
const ADSTERRA_DEFAULTS = {
  nativeScriptUrl: 'https://closurenosy.com/30d1e9da68b6cd846fe5fd165823a924/invoke.js',
  nativeContainerId: 'container-30d1e9da68b6cd846fe5fd165823a924',
  popunderScriptUrl: 'https://closurenosy.com/fc/14/98/fc149815a30d80a9494ec2e0d91f3d2d.js',
  socialBarScriptUrl: 'https://closurenosy.com/f1/5c/9f/f15c9f8241358b2ecaf6d89e2bdb40d7.js',
  smartlinkUrl: 'https://closurenosy.com/abpjn7bp?key=cd0f90ef11b7f8543cd8358659dac3af',
  banners: {
    '728x90': { key: '680836f1cbcf44f0d1cbf77d891a65e2', scriptUrl: 'https://closurenosy.com/680836f1cbcf44f0d1cbf77d891a65e2/invoke.js' },
    '468x60': { key: '7f5bee8fdee82a64c0fc03ac2f06dc8d', scriptUrl: 'https://closurenosy.com/7f5bee8fdee82a64c0fc03ac2f06dc8d/invoke.js' },
    '160x300': { key: '01ac14e8b7afb00bbeacdd2d867fd266', scriptUrl: 'https://closurenosy.com/01ac14e8b7afb00bbeacdd2d867fd266/invoke.js' },
    '320x50': { key: '2652e5314c6b5121bfa9cc7b8883f682', scriptUrl: 'https://closurenosy.com/2652e5314c6b5121bfa9cc7b8883f682/invoke.js' },
    '300x250': { key: '67ab336e541d272982c2126592cb4abe', scriptUrl: 'https://closurenosy.com/67ab336e541d272982c2126592cb4abe/invoke.js' },
    '160x600': { key: 'f28a0d10af5aa4c4c203e9d556587ed8', scriptUrl: 'https://closurenosy.com/f28a0d10af5aa4c4c203e9d556587ed8/invoke.js' },
  },
}

function httpsUrl(value = '') {
  try {
    const parsed = new URL(value.startsWith('//') ? `https:${value}` : value)
    return parsed.protocol === 'https:' ? parsed.href : ''
  } catch { return '' }
}

function publicKey(value = '') {
  return /^[a-zA-Z0-9_-]+$/.test(value) ? value : ''
}

export function isSensitiveRoute(pathname) {
  return SENSITIVE_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export function isAdExcludedRoute(pathname = '/') {
  if (isSensitiveRoute(pathname)) return true
  const segments = pathname.split('/').filter(Boolean)
  return segments.some(segment => NON_MONETIZED_SLUGS.has(segment))
}

export function getAdsterraConfig() {
  const allowedTypes = (process.env.AD_PAGE_TYPES || 'home,content,troubleshooting')
    .split(',').map(value => value.trim()).filter(Boolean)
  const productionEnabled = process.env.ADSTERRA_ENABLED !== 'false' && process.env.NODE_ENV === 'production'

  const nativeScriptUrl = httpsUrl(process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_URL || ADSTERRA_DEFAULTS.nativeScriptUrl)
  const nativeContainerId = publicKey(process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID || ADSTERRA_DEFAULTS.nativeContainerId)
  const native = {
    enabled: productionEnabled && Boolean(nativeScriptUrl && nativeContainerId),
    scriptUrl: nativeScriptUrl,
    containerId: nativeContainerId,
  }

  const banners = Object.fromEntries(BANNER_SIZES.map(([name, width, height]) => {
    const prefix = `NEXT_PUBLIC_ADSTERRA_BANNER_${name.toUpperCase()}_`
    const key = publicKey(process.env[`${prefix}KEY`] || ADSTERRA_DEFAULTS.banners[name].key)
    const scriptUrl = httpsUrl(process.env[`${prefix}SCRIPT_URL`] || ADSTERRA_DEFAULTS.banners[name].scriptUrl)
    return [name, { name, width, height, key, scriptUrl, enabled: productionEnabled && Boolean(key && scriptUrl) }]
  }))

  const popunderScriptUrl = httpsUrl(process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_SCRIPT_URL || ADSTERRA_DEFAULTS.popunderScriptUrl)
  const socialBarScriptUrl = httpsUrl(process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_SCRIPT_URL || ADSTERRA_DEFAULTS.socialBarScriptUrl)
  const smartlinkUrl = httpsUrl(process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_URL || ADSTERRA_DEFAULTS.smartlinkUrl)

  return {
    provider: 'adsterra',
    enabled: productionEnabled,
    allowedTypes,
    native,
    banners,
    popunder: { enabled: productionEnabled && Boolean(popunderScriptUrl), scriptUrl: popunderScriptUrl },
    socialBar: { enabled: productionEnabled && Boolean(socialBarScriptUrl), scriptUrl: socialBarScriptUrl },
    smartlink: { enabled: productionEnabled && Boolean(smartlinkUrl), url: smartlinkUrl },
  }
}
