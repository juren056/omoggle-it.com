import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AdSlot from '@/components/AdSlot'

export const metadata = {
  title: 'Omoggle, PSL & Looksmaxxing Tools',
  description: 'Check camera setup, run private local face-presentation tools and read independent Omoggle troubleshooting and PSL guides.',
  alternates: { canonical: 'https://omoggle-it.com/' },
}

const toolEntries = [
  { href: '/omoggle-practice-test', icon: '◉', title: 'Omoggle Practice', description: 'Check lighting, framing and head direction from one local camera frame.', action: 'Check My Camera' },
  { href: '/psl-test', icon: '◎', title: 'PSL Test', description: 'Run an entertainment-only geometry and presentation check in your browser.', action: 'Take the Local Test' },
  { href: '/mog-score', icon: '◆', title: 'Mog Score', description: 'Compare controllable photo setup factors without uploading either photo.', action: 'Compare Photos' },
  { href: '/face-shape-detector', icon: '◈', title: 'Face Shape Detector', description: 'Estimate a closest and secondary face shape with measurement notes.', action: 'Detect Face Shape' },
]

const latestUpdates = [
  { href: '/omoggle-practice-test', title: 'Omoggle Camera Practice', description: 'Now checks one camera frame locally and explains permission failures.', updated: 'Sep 14, 2026' },
  { href: '/psl-test', title: 'Private Local PSL Test', description: 'Now uses disclosed browser rules instead of the paid cloud path.', updated: 'Sep 14, 2026' },
  { href: '/mog-score', title: 'Mog Photo Comparison', description: 'Now compares two authorized photos locally with controllable setup advice.', updated: 'Sep 14, 2026' },
  { href: '/face-shape-detector', title: 'Face Shape Detector', description: 'New local shape estimate with a second match and uncertainty notes.', updated: 'Sep 14, 2026' },
  { href: '/omoggle-troubleshooting', title: 'Omoggle Troubleshooting', description: 'New branching help for access, camera, mobile and connection problems.', updated: 'Sep 14, 2026' },
]

const popularGuides = [
  ['/psl-scale', 'PSL Scale Explained', 'A practical guide to subjective PSL ratings from low to high.'],
  ['/mogging-meaning', 'What Does Mog Mean?', 'Mogging, mogged and mogger explained without duplicate definitions.'],
  ['/hunter-eyes-guide', 'Hunter Eyes Guide', 'What the term means and realistic ways to improve eye-area presentation.'],
  ['/canthal-tilt-guide', 'Canthal Tilt Guide', 'How eye-corner angle affects photos and face-rating tools.'],
  ['/face-shape-guide', 'Face Shape Guide', 'Identify common face shapes and choose complementary styling.'],
  ['/jawline-guide', 'Jawline Guide', 'Evidence-aware ways to improve jawline definition and presentation.'],
  ['/looksmaxxing-guide', 'Looksmaxxing Guide', 'Start with practical, non-invasive changes that have broad value.'],
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <header className="hero">
        <div className="container">
          <span className="hero-eyebrow">Independent help · Private local tools</span>
          <h1><em>Omoggle Camera Help</em> & Local Face Tools</h1>
          <p className="hero-sub">Check your camera setup, compare photos and explore entertainment-only presentation rules. Photos stay on your device.</p>
          <div className="hero-actions">
            <Link href="/omoggle-practice-test" className="btn btn-primary">Check Camera Setup</Link>
            <Link href="/tools" className="btn btn-outline">See All Free Tools</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="section section-alt" aria-labelledby="tool-entry-heading">
          <div className="container">
            <div className="section-header"><span className="section-label">Choose a Tool</span><h2 id="tool-entry-heading">Four Ways to Start</h2></div>
            <div className="home-entry-grid">
              {toolEntries.map(entry => (
                <article className="tool-card home-entry-card" key={entry.href}>
                  <div className="tool-icon" aria-hidden="true">{entry.icon}</div>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                  <Link href={entry.href} className="btn btn-outline">{entry.action} →</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <AdSlot pageType="home" slotName="home-after-tools" />

        <section className="section" aria-labelledby="latest-updates-heading">
          <div className="container">
            <div className="section-header"><span className="section-label">Verified site changes</span><h2 id="latest-updates-heading">Recently Updated</h2></div>
            <div className="grid-3">
              {latestUpdates.map(update => (
                <article className="card" key={update.href}>
                  <div className="card-body">
                    <Link href={update.href} className="card-title">{update.title}</Link>
                    <p className="card-excerpt">{update.description}</p>
                    <span className="card-meta">Updated {update.updated}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-alt" aria-labelledby="popular-guides-heading">
          <div className="container">
            <div className="section-header"><span className="section-label">Evergreen Library</span><h2 id="popular-guides-heading">Popular Guides</h2></div>
            <div className="popular-guide-list">
              {popularGuides.map(([href, title, description]) => (
                <Link href={href} className="popular-guide-item" key={href}>
                  <span><strong>{title}</strong><small>{description}</small></span><span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="trust-heading">
          <div className="container">
            <div className="section-header"><span className="section-label">Clear Expectations</span><h2 id="trust-heading">Useful Tools, No Inflated Claims</h2></div>
            <div className="stats-row">
              <div className="stat-item"><span className="stat-num">Free</span><span className="stat-label">Guest access</span></div>
              <div className="stat-item"><span className="stat-num">Local</span><span className="stat-label">Browser processing</span></div>
              <div className="stat-item"><span className="stat-num">Private</span><span className="stat-label">Photos are not uploaded</span></div>
              <div className="stat-item"><span className="stat-num">Honest</span><span className="stat-label">Entertainment-only ratings</span></div>
            </div>
          </div>
        </section>

        <section className="section section-alt" aria-labelledby="example-heading"><div className="container-sm"><div className="section-header"><span className="section-label">Illustrative output</span><h2 id="example-heading">Example Result</h2></div><div className="highlight-box"><p><strong>Example only:</strong> “Lighting: adjust — add soft light in front. Framing: pass. Head direction: adjust — keep eyes level.” This is a static demonstration, not a real user result or platform score.</p></div><h2>Common Questions</h2><div className="faq-list"><details><summary>Why does the camera not work?</summary><p>Permission may be blocked, another app may hold the camera, or the browser may not support the required API. Follow the <Link href="/omoggle-troubleshooting">branching troubleshooting guide</Link>.</p></details><details><summary>Why does a result change?</summary><p>Lighting, distance, lens perspective and head direction change the detected geometry. Use the same setup for a meaningful comparison.</p></details><details><summary>Does this predict an official Omoggle result?</summary><p>No. Omoggle IT is independent and cannot access or verify any private Omoggle scoring rules.</p></details><details><summary>Are photos uploaded?</summary><p>The new free tools process selected images and camera frames locally. Optional analytics and advertising are disabled on those tool routes.</p></details></div></div></section>
      </main>
      <Footer />
    </>
  )
}
