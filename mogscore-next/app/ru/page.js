import { redirect } from 'next/navigation'

export default function LangPage() {
  // Serve the static HTML from public/ru/index.html via iframe-like approach
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0;url=/ru/index.html" />
      </head>
      <body>
        <p>Redirecting...</p>
      </body>
    </html>
  )
}
