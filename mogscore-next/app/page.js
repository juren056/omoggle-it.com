import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Omoggle, PSL & Looksmaxxing Tools',
  description: 'Practice Omoggle-style comparisons, take a free PSL test, calculate your Mog Score and explore AI-powered face analysis and looksmaxxing guides.',
  alternates: { canonical: 'https://omoggle-it.com/' },
}

const toolEntries = [
  { href: '/omoggle-practice-test', icon: '⚔', title: 'Omoggle Practice', description: 'Practice Omoggle-style face comparisons before playing.', action: 'Start Practice' },
  { href: '/psl-test', icon: '◎', title: 'PSL Test', description: 'Upload a photo for an entertainment-only PSL face rating.', action: 'Take the PSL Test' },
  { href: '/mog-score', icon: '◆', title: 'Mog Score', description: 'Check your mog rating, facial strengths and harmony score.', action: 'Get My Mog Score' },
  { href: '/tools', icon: '◈', title: 'AI Face Analyzer', description: 'Use the existing six-metric analyzer or start a 1v1 Mog Battle.', action: 'Analyze a Face' },
]

const latestUpdates = [
  { href: '/omoggle-practice-test', title: 'Omoggle Practice Test', description: 'A new interactive way to practice choosing the stronger Omoggle setup.', updated: 'Aug 17, 2026' },
  { href: '/psl-test', title: 'Free PSL Test', description: 'A dedicated PSL rating tool with symmetry, jawline, eye-area and harmony results.', updated: 'Aug 17, 2026' },
  { href: '/mog-score', title: 'Mog Score Test', description: 'Get an entertainment-focused mog rating with readable facial-strength labels.', updated: 'Aug 17, 2026' },
  { href: '/psl-scale', title: 'PSL Scale Guide', description: 'Understand every PSL band, what affects a rating and where the scale falls short.', updated: 'Aug 17, 2026' },
  { href: '/is-omoggle-banned', title: 'Is Omoggle Banned?', description: 'Country restrictions, safety context and ways to check current access.', updated: 'Jul 20, 2026' },
  { href: '/why-omoggle-score-changes', title: 'Why Omoggle Scores Change', description: 'Lighting, angle, distance and camera factors that can change a result.', updated: 'Jul 20, 2026' },
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
          <span className="hero-eyebrow">Omoggle practice · PSL ratings · Mog tools</span>
          <h1><em>Omoggle, PSL</em> & Looksmaxxing Tools</h1>
          <p className="hero-sub">Practice for Omoggle, calculate your PSL score, compare mog ratings, and explore AI-powered face analysis tools.</p>
          <div className="hero-actions">
            <Link href="/omoggle-practice-test" className="btn btn-primary">Practice Omoggle</Link>
            <Link href="/psl-test" className="btn btn-outline">Take the Free PSL Test</Link>
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

        <section className="section" aria-labelledby="latest-updates-heading">
          <div className="container">
            <div className="section-header"><span className="section-label">Fresh & Useful</span><h2 id="latest-updates-heading">Latest Omoggle & Looksmaxxing Updates</h2></div>
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
              <div className="stat-item"><span className="stat-num">Fast</span><span className="stat-label">Instant results</span></div>
              <div className="stat-item"><span className="stat-num">Private</span><span className="stat-label">No public profile required</span></div>
              <div className="stat-item"><span className="stat-num">Honest</span><span className="stat-label">Entertainment-only ratings</span></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
