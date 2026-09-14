import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LocalFaceTool from '@/components/LocalFaceTool'
import LocalCompareTool from '@/components/LocalCompareTool'

export default function ToolsPage() {
  return <>
    <Navbar />
    <header className="seo-page-header"><div className="container-sm"><span className="hero-eyebrow">Free · private · no signup</span><h1>Free Face & Camera Tools</h1><p>Run face-landmark, framing and photo-quality checks in your browser. Your photo stays on this device and the free flow does not call a paid AI API.</p></div></header>
    <main>
      <section className="section"><div className="container"><LocalFaceTool variant="analyzer" /></div></section>
      <section className="section section-alt"><div className="container"><LocalCompareTool /></div></section>
      <section className="section"><div className="container"><div className="section-header"><span className="section-label">Choose a focused tool</span><h2>More Free Tools</h2></div><div className="home-entry-grid">
        <Link className="tool-card" href="/omoggle-practice-test"><h3>Omoggle Camera Practice</h3><p>Check camera permission, lighting, framing and head direction.</p></Link>
        <Link className="tool-card" href="/psl-test"><h3>PSL Test</h3><p>See the local geometry and presentation rule breakdown.</p></Link>
        <Link className="tool-card" href="/mog-score"><h3>Mog Score</h3><p>Get a playful photo-presentation result and photo-free share card.</p></Link>
        <Link className="tool-card" href="/face-shape-detector"><h3>Face Shape Detector</h3><p>Estimate a face-shape category with visible ratio explanations.</p></Link>
      </div></div></section>
    </main>
    <Footer />
  </>
}
