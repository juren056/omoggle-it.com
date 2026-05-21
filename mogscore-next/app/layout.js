import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata = {
  title: 'MogScore — Omoggle Guide, Looksmaxxing & PSL Scale Wiki',
  description: 'Free AI face analyzer, PSL Scale explained, Omoggle tier list and tips to win. Used by 10,000+ looksmaxxers worldwide.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
