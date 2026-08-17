export const metadata = {
  title: 'Free AI Face Analyzer & 1v1 Mog Battle',
  description: 'Free AI face analyzer and PSL Scale test. Score 6 facial metrics: symmetry, canthal tilt, jawline, cheekbones, skin clarity. Upload any photo, no signup needed.',
  openGraph: {
    title: 'Free PSL Scale Test & AI Face Analyzer',
    description: 'Upload your photo and get your PSL score instantly. Scores all 6 Omoggle metrics free.',
    images: [{ url: 'https://omoggle-it.com/images/og-tools.jpg' }],
  },
  alternates: { canonical: 'https://omoggle-it.com/tools' },
}

export default function ToolsLayout({ children }) {
  return children
}
