export const metadata = {
  title: 'Free Local Face Analyzer & Photo Setup Comparison',
  description: 'Analyze face landmarks, lighting, framing and camera setup locally in your browser. No signup and no photo upload in the free flow.',
  openGraph: {
    title: 'Free Local Face & Camera Tools',
    description: 'Private browser-based face landmark, framing and camera setup checks.',
    images: [{ url: 'https://omoggle-it.com/images/og-tools.jpg' }],
  },
  alternates: { canonical: 'https://omoggle-it.com/tools' },
}

export default function ToolsLayout({ children }) {
  return children
}
