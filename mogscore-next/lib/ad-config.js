const SENSITIVE_PREFIXES = [
  '/tools', '/psl-test', '/mog-score', '/face-shape-detector',
  '/omoggle-practice-test', '/account', '/billing', '/history',
  '/sign-in', '/sign-up', '/api',
]

export function isSensitiveRoute(pathname) {
  return SENSITIVE_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export function getAdsterraConfig() {
  const scriptUrl = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_URL || ''
  const containerId = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID || ''
  const allowedTypes = (process.env.AD_PAGE_TYPES || 'home,content,troubleshooting')
    .split(',').map(value => value.trim()).filter(Boolean)
  let validUrl = false
  try { validUrl = new URL(scriptUrl).protocol === 'https:' } catch {}

  return {
    provider: 'adsterra',
    enabled: process.env.ADSTERRA_ENABLED === 'true' && process.env.NODE_ENV === 'production' && validUrl && Boolean(containerId),
    scriptUrl: validUrl ? scriptUrl : '',
    containerId,
    allowedTypes,
  }
}
