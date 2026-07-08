import Navbar from '@/components/Navbar'
import { cleanInternalHtmlLinks } from '@/lib/html-links'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'PSLスケール解説：すべての評価が意味すること（1〜10）| MogScore',
  description: 'OmoggleがAIスコアリングの基盤として使用するPSLスケール（1〜10）の完全解説。各ランクが実際に意味することと、実際のプレイヤーがどこに位置するかを解説。',
}

const articleContent = `<img src="/images/psl-scale.jpg" alt="Visual breakdown of the PSL Scale from 1 to 10 with tier descriptions" width="900" height="500" style="width:100%;border-radius:var(--r-lg);margin-bottom:var(--sp-md);border:1px solid var(--border);" loading="eager">
      <h2>What is the PSL Scale?</h2>
      <p>PSL stands for <strong>Physical, Status, Looks</strong> — a 1–10 rating system from <a href="looksmaxxing-guide.html">looksmaxxing communities</a> used to score facial attractiveness based on measurable features. <a href="what-is-omoggle.html">Omoggle</a> adapts this scale for its AI scoring.</p>
      <h2>Score Breakdown</h2>
      <h3>1–3: Below Average (Sub3 / Molecule)</h3>
      <p>Significant asymmetry, weak jawline, or negative canthal tilt. On Omoggle, these scores usually reflect poor camera setup rather than genuine facial features.</p>
      <h3>4–5: Low to Mid Tier Normie</h3>
      <p>The most common range. Average features, decent symmetry. A strong foundation for <a href="looksmaxxing-guide.html">looksmaxxing</a>.</p>
      <h3>6–7: HTN to Chadlite</h3>
      <p>Clearly above average. Strong positive <a href="canthal-tilt-guide.html">canthal tilt</a>, defined jawline, high symmetry. Chadlite (7.0+) is the highest occupied tier on Omoggle's leaderboard.</p>
      <h3>8–10: Chad and Slayer</h3>
      <p>Theoretical upper bounds. No confirmed Chad or Slayer player exists on Omoggle as of May 2026.</p>
      <div class="highlight-box"><p>Find your PSL score with our <a href="tools.html"><strong>free AI Face Analyzer</strong></a>.</p></div>`

export default function Page() {
  return (
    <>
      <Navbar />
      <header style={{padding:'var(--sp-lg) 0 var(--sp-sm)',borderBottom:'1px solid var(--border)'}}>
        <div className="container-sm">
          <nav style={{fontSize:'.82rem',color:'var(--text-muted)',marginBottom:'.75rem'}}>
            <Link href="/ja" style={{color:'var(--gold)'}}>Home</Link>
            <span style={{margin:'0 .5rem'}}>›</span>
            <a href="/blog" style={{color:'var(--gold)'}}>Blog</a>
          </nav>
          <h1 style={{marginTop:'.75rem'}}>PSLスケール解説：1〜10の各評価の意味</h1>
        </div>
      </header>
      <main className="section">
        <div className="container-sm">
          <article className="article-content" dangerouslySetInnerHTML={{ __html: cleanInternalHtmlLinks(articleContent) }} />
          <aside style={{marginTop:'var(--sp-lg)',paddingTop:'var(--sp-md)',borderTop:'1px solid var(--border)'}}>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
              <Link href="/ja" className="tag">Home</Link>
              <Link href="/tools" className="tag">AI Tool →</Link>
              <a href="/ja/what-is-omoggle" className="tag">What is Omoggle</a>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
