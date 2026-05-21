import { redirect } from 'next/navigation'

export default function LangPage() {
  // Serve the static HTML from public/ja/index.html via iframe-like approach
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0;url=/ja/index.html" />
      </head>
      <body>
        <p>Redirecting...</p>
      </body>
    </html>
  )
}
