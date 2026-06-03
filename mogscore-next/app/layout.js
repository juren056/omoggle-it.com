import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata = {
  title: {
    default: 'MogScore — Free PSL Scale Test, Omoggle Guide & Looksmaxxing Wiki',
    template: '%s | MogScore'
  },
  description: 'Free AI PSL Scale test and face analyzer. Score your face on 6 metrics — symmetry, canthal tilt, jawline, cheekbones and skin. Omoggle guide and looksmaxxing tips.',
  metadataBase: new URL('https://omoggle-it.com'),
  openGraph: {
    type: 'website',
    siteName: 'MogScore',
    images: [{ url: '/images/og-home.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mogscore',
  },
  icons: { icon: '/favicon.ico' },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-6YC3XR4ZRC"></script>
          <script dangerouslySetInnerHTML={{__html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-6YC3XR4ZRC');`}} />
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2031710024449901" crossOrigin="anonymous"></script>
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
