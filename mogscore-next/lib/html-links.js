/**
 * Rewrites legacy ".html" internal links to clean canonical paths.
 *
 * The historical static site used links like `href="tools.html"` and
 * `href="what-is-omoggle.html"`. When rendered inside Next.js article content
 * these resolve to `/tools.html`, `/what-is-omoggle.html`, etc., which 301 to
 * the clean routes. Google then reports them as "Page with redirect / not
 * indexed". Cleaning the links at render time stops that discovery loop while
 * the 301 redirects remain as a safety net for old/external references.
 */

const OWN_DOMAIN = 'omoggle-it.com'

/** Convert a single href to its clean canonical form. */
export function cleanHref(href) {
  if (!href || typeof href !== 'string') return href

  const trimmed = href.trim()

  // Leave anchors, protocols we don't route, and non-links untouched.
  if (
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('data:')
  ) {
    return href
  }

  // Split off query/hash so we only touch the path.
  const sepIdx = trimmed.search(/[?#]/)
  let pathPart = sepIdx >= 0 ? trimmed.slice(0, sepIdx) : trimmed
  const suffix = sepIdx >= 0 ? trimmed.slice(sepIdx) : ''

  // Absolute URL: only rewrite if it points at our own domain.
  const urlMatch = pathPart.match(/^(https?:)?\/\/([^/]+)(\/.*)?$/i)
  let wasAbsoluteOwnDomain = false
  if (urlMatch) {
    const host = urlMatch[2].toLowerCase()
    if (host !== OWN_DOMAIN && !host.endsWith(`.${OWN_DOMAIN}`)) return href // external link — leave alone
    wasAbsoluteOwnDomain = true
    pathPart = urlMatch[3] || '/'
  }

  // Nothing to do if there's no .html anywhere in the path.
  if (!/\.html$/i.test(pathPart) && !/index\.html$/i.test(pathPart)) {
    return href
  }

  // Normalize: strip a leading "./"
  pathPart = pathPart.replace(/^\.\//, '')

  // "index.html" (root or nested) -> directory root
  pathPart = pathPart.replace(/(^|\/)index\.html$/i, '$1')

  // Strip trailing ".html"
  pathPart = pathPart.replace(/\.html$/i, '')

  // Preserve relative-link semantics. This is important for localized pages:
  // `tools.html` on `/ja/an-article` must become `tools` (=> `/ja/tools`),
  // not `/tools` (the English route).
  if (pathPart === '') pathPart = './'

  // Collapse a trailing slash (except for the bare root).
  if (pathPart !== './' && pathPart.length > 1) pathPart = pathPart.replace(/\/+$/, '')

  // For own-domain absolute links, return canonical absolute https URL.
  if (wasAbsoluteOwnDomain) {
    return `https://${OWN_DOMAIN}${pathPart === '/' ? '' : pathPart}` + suffix || `https://${OWN_DOMAIN}/`
  }

  return pathPart + suffix
}

/** Rewrite every href="...html..." occurrence in an HTML string. */
export function cleanInternalHtmlLinks(html) {
  if (!html || typeof html !== 'string') return html
  return html.replace(/(href=)(["'])([^"']*)\2/gi, (match, attr, quote, href) => {
    const cleaned = cleanHref(href)
    return `${attr}${quote}${cleaned}${quote}`
  })
}
