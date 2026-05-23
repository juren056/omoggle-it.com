export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/sign-in', '/sign-up'],
      },
    ],
    sitemap: 'https://omoggle-it.com/sitemap.xml',
    host: 'https://omoggle-it.com',
  }
}
