import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LocalFaceTool from '@/components/LocalFaceTool'
import LocalCompareTool from '@/components/LocalCompareTool'

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <header style={{ padding: 'var(--sp-lg) 0 var(--sp-sm)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <h1>Free Looksmaxxing Tools</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '.5rem' }}>
            Private face analysis and photo comparisons in the familiar Omoggle IT layout. Photos are processed locally on your device.
          </p>
        </div>
      </header>

      <main className="section">
        <div className="container-sm">
          <section className="tool-section" id="analyzer">
            <div className="tool-section-heading">
              <div className="tool-icon">◈</div>
              <div>
                <span className="tool-badge free">Free · Local</span>
                <h2 id="analyzer-tool-heading">AI Face Analyzer</h2>
                <p>Facial geometry · Pose · Lighting · Framing · Photo readiness</p>
              </div>
            </div>
            <LocalFaceTool variant="analyzer" showHeading={false} />
          </section>

          <section className="tool-section" id="battle">
            <div className="tool-section-heading">
              <div className="tool-icon">⚡</div>
              <div>
                <span className="tool-badge new">Local</span>
                <h2 id="compare-heading">1v1 Photo Comparison</h2>
                <p>Compare two authorized photos of the same person and find the stronger camera setup.</p>
              </div>
            </div>
            <LocalCompareTool showHeading={false} />
          </section>

          <section className="tool-section" aria-labelledby="more-tools-heading">
            <div className="tool-section-heading">
              <div className="tool-icon">◎</div>
              <div><span className="tool-badge free">More tools</span><h2 id="more-tools-heading">Focused Tests</h2></div>
            </div>
            <div className="grid-2">
              <Link className="tool-card" href="/omoggle-practice-test"><h3>Omoggle Practice</h3><p>Check camera permission, lighting, framing and head direction.</p></Link>
              <Link className="tool-card" href="/psl-test"><h3>PSL Test</h3><p>See a local geometry and presentation breakdown.</p></Link>
              <Link className="tool-card" href="/mog-score"><h3>Mog Score</h3><p>Generate a playful presentation score and photo-free result card.</p></Link>
              <Link className="tool-card" href="/face-shape-detector"><h3>Face Shape Detector</h3><p>Estimate a closest face-shape category with visible ratios.</p></Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
