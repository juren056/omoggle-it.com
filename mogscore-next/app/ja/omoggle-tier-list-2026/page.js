import Navbar from '@/components/Navbar'
import { cleanInternalHtmlLinks } from '@/lib/html-links'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Omoggle完全ティアリスト2026：Adamを含む全9ランク | MogScore',
  description: '2026年5月時点でのOmoggleティアリスト完全版。MoleculeからAdamまでの全9ELOランクをELO要件と現在の状況付きで解説。',
}

const articleContent = `<img src="/images/tier-list.jpg" alt="Complete Omoggle tier list 2026 from Molecule to Adam" width="900" height="500" style="width:100%;border-radius:var(--r-lg);margin-bottom:var(--sp-md);border:1px solid var(--border);" loading="eager">

      <h2>The Complete 2026 Tier List</h2>
      <p>As of May 2026, <a href="what-is-omoggle.html">Omoggle</a> has 9 official ELO tiers — one more than commonly reported. The "Adam" tier was confirmed in updated ladder documentation this month.</p>

      <div style="overflow-x:auto;background:var(--bg2);border:1px solid var(--border);border-radius:var(--r-md);">
        <table class="tier-table" aria-label="Complete Omoggle tier list May 2026">
          <thead><tr><th>ELO Range</th><th>Tier</th><th>PSL Score</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>20,001+</td><td><span class="tier-name text-gold">Adam</span></td><td>9.5+</td><td style="color:var(--text-muted);">Theoretical. Vacant.</td></tr>
            <tr><td>5,001–20,000</td><td><span class="tier-name" style="color:#D4A843;">Slayer</span></td><td>9.0–9.4</td><td style="color:var(--text-muted);">Vacant as of May 2026.</td></tr>
            <tr><td>3,501–5,000</td><td><span class="tier-name" style="color:#B8943C;">Chad</span></td><td>8.0–8.9</td><td style="color:var(--text-muted);">Vacant. Top player at 3,210.</td></tr>
            <tr><td>3,001–3,500</td><td><span class="tier-name" style="color:#A07C2A;">Chadlite</span></td><td>7.0–7.9</td><td style="color:var(--green);">Highest occupied tier.</td></tr>
            <tr><td>2,001–3,000</td><td><span class="tier-name" style="color:#7CA0D0;">HTN</span></td><td>6.0–6.9</td><td style="color:var(--green);">Top 10–15% of players.</td></tr>
            <tr><td>1,501–2,000</td><td><span class="tier-name text-muted">MTN</span></td><td>5.0–5.9</td><td style="color:var(--text-muted);">Most common tier.</td></tr>
            <tr><td>1,001–1,500</td><td><span class="tier-name" style="color:#777;">LTN</span></td><td>4.0–4.9</td><td style="color:var(--text-muted);">Below average.</td></tr>
            <tr><td>501–1,000</td><td><span class="tier-name" style="color:#C06060;">Sub3</span></td><td>&lt;4.0</td><td style="color:var(--text-muted);">Usually poor setup.</td></tr>
            <tr><td>0–500</td><td><span class="tier-name" style="color:#888;">Molecule</span></td><td>&lt;3.0</td><td style="color:var(--text-muted);">Starting tier / no face detected.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Why the Top 3 Tiers Are Empty</h2>
      <p>Chad (3,501+), Slayer (5,001+), and Adam (20,001+) have zero confirmed players as of May 2026. The highest-ranked player in the world sits at approximately 3,210 ELO — Chadlite tier, still 291 points short of Chad.</p>
      <p>The reason is the AI itself. As Dexerto reported, the scoring system is highly sensitive to camera conditions. Even players with excellent facial structure can be knocked down by lighting changes, props, or low-quality webcam frames. Consistent high scoring is nearly impossible in live conditions.</p>

      <h2>Where Most Players Actually Land</h2>
      <p><strong>MTN (Mid Tier Normie)</strong> is by far the most populated tier, reflecting the mathematical reality that most faces score in the 5.0–5.9 range. Streamers like <a href="xqc-omoggle.html">xQc</a> (5.2–5.8) sit here.</p>
      <p><strong>HTN</strong> represents the top 10–15% — streamers like <a href="asmongold-omoggle.html">Asmongold</a> (6.0–6.4) land here.</p>
      <p><strong>Chadlite</strong> is genuinely rare — <a href="clavicular-mogged.html">Clavicular</a> is one of the few streamers who reaches it consistently.</p>

      <div class="highlight-box"><p>Curious which tier you'd reach? Try our <a href="tools.html"><strong>free AI Face Analyzer</strong></a> for an instant estimate — all 6 metrics scored and explained.</p></div>`

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
          <h1 style={{marginTop:'.75rem'}}>Omoggleティアリスト2026：Adamランク含む全9ランク解説</h1>
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
