import {
  ENGLISH_CONTENT_SLUGS,
  getI18nSitemapEntries,
  SUPPORTED_LANGS,
  LANG_STATIC_HTML_SLUGS,
} from '@/lib/i18n-routes'

export default function sitemap() {
  const baseUrl = 'https://omoggle-it.com'
  const today = new Date().toISOString().split('T')[0]

  const corePages = [
    { url: baseUrl, lastModified: today, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: today, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/psl-scale-test`, lastModified: today, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/blog`, lastModified: today, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/what-is-omoggle`, lastModified: today, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: today, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/pricing`, lastModified: today, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy-policy`, lastModified: today, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms-of-service`, lastModified: today, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/refund-policy`, lastModified: today, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const contentPages = ENGLISH_CONTENT_SLUGS.map(slug => ({
    url: `${baseUrl}/${slug}`,
    lastModified: today,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...corePages, ...contentPages, ...getI18nSitemapEntries(baseUrl, today)]
}
