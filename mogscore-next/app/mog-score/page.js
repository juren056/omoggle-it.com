import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FaceRatingTool from '@/components/FaceRatingTool'
import { StructuredData, breadcrumbSchema, webApplicationSchema } from '@/components/StructuredData'

const path = '/mog-score'
const description = 'Take a free Mog Score test to get an entertainment-only mog rating for eye area, jawline, harmony and facial structure.'

export const metadata = {
  title: 'Mog Score Test – Find Your Mog Rating',
  description,
  alternates: { canonical: `https://omoggle-it.com${path}` },
  openGraph: { title: 'Mog Score Test – Find Your Mog Rating', description, url: `https://omoggle-it.com${path}` },
}

export default function MogScorePage() {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Mogging', href: '/mogging-meaning' }, { name: 'Mog Score', href: path }]
  return (
    <>
      <StructuredData data={webApplicationSchema({ name: 'Mog Score Test', description, path })} />
      <StructuredData data={breadcrumbSchema(crumbs)} />
      <Navbar />
      <header className="seo-page-header"><div className="container-sm">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/mogging-meaning">Mogging</Link><span>›</span><span>Mog Score</span></nav>
        <span className="hero-eyebrow">Mog rating · AI face analysis</span><h1>Mog Score</h1>
        <p>Upload a photo for a playful, local presentation score based on framing, light, pose and visible landmark geometry.</p>
      </div></header>
      <main>
        <section className="section"><div className="container"><FaceRatingTool variant="mog" /></div></section>
        <section className="section section-alt"><article className="content-section container-sm">
          <h2>What Is a Mog Score?</h2>
          <p>A Mog Score is an entertainment-oriented summary of visible facial and photo characteristics. Online, <Link href="/mogging-meaning">mogging</Link> means visually outclassing someone, but a single AI score cannot objectively decide that.</p>
          <h2>How the Mog Rating Works</h2>
          <p>This page uses the same local landmark engine as our <Link href="/tools">Face Analyzer</Link>, but focuses on controllable photo presentation. It does not reuse a cloud report under a different title and does not infer skin health or population ranking.</p>
          <h2>Mog Score vs PSL Rating</h2>
          <p>The Mog Score uses playful comparison language. The <Link href="/psl-test">PSL Test</Link> provides a more detailed category breakdown, while the <Link href="/psl-scale">PSL Scale guide</Link> explains the informal 1–10 convention.</p>
          <div className="highlight-box"><p>Want a better camera setup before comparing again? Take the <Link href="/omoggle-practice-test">Omoggle Practice Test</Link> or start with the <Link href="/looksmaxxing-guide">Looksmaxxing Guide</Link>.</p></div>
          <p><strong>Disclaimer:</strong> Mog ratings are subjective, camera-dependent and provided only for entertainment and self-improvement. They are not medical, psychological or professional assessments.</p>
        </article></section>
      </main>
      <Footer />
    </>
  )
}
