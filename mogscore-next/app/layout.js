import './globals.css'
import { getContactEmail } from '@/lib/contact'
import ThirdPartyScripts from '@/components/ThirdPartyScripts'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0D1117',
}

export const metadata = {
  title: {
    default: 'Omoggle IT — Omoggle, PSL & Looksmaxxing Tools',
    template: '%s | Omoggle IT'
  },
  description: 'Free, private browser-based Omoggle camera checks, PSL presentation tools, Mog Score comparisons and practical guides.',
  metadataBase: new URL('https://omoggle-it.com'),
  openGraph: {
    type: 'website',
    siteName: 'Omoggle IT',
    images: [{ url: '/images/og-home.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.ico' },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  const contactEmail = getContactEmail()
  return (
    <html lang="en">
        <head>
          {contactEmail ? (
            <script dangerouslySetInnerHTML={{ __html: `window.__SITE_CONTACT_EMAIL__=${JSON.stringify(contactEmail)};` }} />
          ) : null}
        </head>
        <body>
          {children}
          <ThirdPartyScripts
            analyticsId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-6YC3XR4ZRC'}
            analyticsEnabled={process.env.ANALYTICS_ENABLED === 'true'}
          />
        </body>
    </html>
  )
}
