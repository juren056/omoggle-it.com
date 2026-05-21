import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'What is Omoggle? Complete 2026 Guide | MogScore',
  description: 'Omoggle is the viral AI face-rating platform where strangers compete webcam-to-webcam on the PSL Scale. Complete guide: how it works, tiers, streamers, and how to win.',
}

export default function WhatIsOmoggle() {
  return (
    <>
      <Navbar />
      <header style={{padding:'var(--sp-lg) 0 var(--sp-sm)',borderBottom:'1px solid var(--border)'}}>
        <div className="container-sm">
          <nav style={{fontSize:'.82rem',color:'var(--text-muted)',marginBottom:'.75rem'}}>
            <Link href="/">Home</Link><span style={{margin:'0 .5rem'}}>›</span>
            <Link href="/blog">Blog</Link><span style={{margin:'0 .5rem'}}>›</span>
            <span>Wiki</span>
          </nav>
          <span className="card-tag">Wiki</span>
          <h1 style={{marginTop:'.75rem'}}>What is Omoggle? Complete 2026 Guide</h1>
          <p style={{color:'var(--text-muted)',fontSize:'.85rem',marginTop:'.5rem'}}>Updated May 17, 2026 · 8 min read</p>
        </div>
      </header>
      <main className="section">
        <div className="container-sm">
          <article style={{lineHeight:1.8}}>
            <img src="/images/what-is-omoggle.jpg" alt="Omoggle AI face rating interface" style={{width:'100%',borderRadius:'var(--r-lg)',marginBottom:'var(--sp-md)',border:'1px solid var(--border)'}} loading="eager" />

            <h2>What is Omoggle?</h2>
            <p>Omoggle is a webcam-based platform that pairs two random strangers and uses AI to score both faces on the <Link href="/psl-scale-explained">PSL Scale</Link> (0–10). The higher scorer wins and is declared the "Mogger." The loser gets "Mogged."</p>
            <p>The name combines <em>Omegle</em> (the defunct random chat site) and <em>mogging</em> — looksmaxxing slang for outclassing someone in appearance. The platform launched in late March 2026 and went viral in May.</p>

            <h2>How Does Omoggle Work?</h2>
            <p>You enter Omoggle, complete a camera check, and get matched with a random opponent. The AI scans both faces for approximately 10–15 seconds and outputs a score. Each match updates your <Link href="/omoggle-elo-system">ELO rating</Link> which determines your global rank.</p>

            <h3>The 6 Scoring Metrics</h3>
            <p>Omoggle's computer vision system measures six key metrics:</p>
            <ul style={{paddingLeft:'1.5rem',marginBottom:'1rem',color:'var(--text-muted)'}}>
              <li style={{marginBottom:'.5rem'}}><strong style={{color:'var(--text)'}}>Facial Symmetry</strong> — ~22% of score</li>
              <li style={{marginBottom:'.5rem'}}><strong style={{color:'var(--text)'}}>Canthal Tilt</strong> — ~18%</li>
              <li style={{marginBottom:'.5rem'}}><strong style={{color:'var(--text)'}}>Jawline Definition</strong> — ~18%</li>
              <li style={{marginBottom:'.5rem'}}><strong style={{color:'var(--text)'}}>Cheekbone Prominence</strong> — ~16%</li>
              <li style={{marginBottom:'.5rem'}}><strong style={{color:'var(--text)'}}>Skin Clarity</strong> — ~14%</li>
              <li><strong style={{color:'var(--text)'}}>Overall Harmony</strong> — ~12%</li>
            </ul>

            <h2>Why Did Omoggle Go Viral?</h2>
            <p>The platform exploded in May 2026 when xQc lost six consecutive rounds while Jesse laughed in the background — the clip got 24,000+ likes on X. Looksmaxxing streamer Clavicular ragequit his stream after being out-scored, generating 68,000 likes. On May 5th, 2026, Twitch officially updated its rules to allow Omoggle streams.</p>

            <h2>Is Omoggle Actually AI?</h2>
            <p>Developer Pablo Rogers clarified in May 2026 that the platform uses <strong>computer vision and facial landmark analysis</strong> — not large language models. The system maps geometric relationships between facial points rather than judging attractiveness like a human would.</p>
            <p>This explains why camera angle and lighting have such a large impact on scores. See: <Link href="/is-omoggle-ai">Is Omoggle Actually AI?</Link></p>

            <h2>The ELO Tier System</h2>
            <p>Omoggle uses an ELO rating system with 9 tiers:</p>
            <div style={{overflowX:'auto',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',margin:'var(--sp-md) 0'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{borderBottom:'1px solid var(--border)'}}>
                    {['ELO Range','Tier','PSL Score'].map(h => (
                      <th key={h} style={{padding:'.85rem 1.25rem',textAlign:'left',fontSize:'.78rem',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--text-muted)',fontFamily:'var(--font-display)'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['20,001+','Adam','9.5+'],
                    ['5,001–20,000','Slayer','9.0–9.4'],
                    ['3,501–5,000','Chad','8.0–8.9'],
                    ['3,001–3,500','Chadlite','7.0–7.9'],
                    ['2,001–3,000','HTN','6.0–6.9'],
                    ['1,501–2,000','MTN','5.0–5.9'],
                    ['1,001–1,500','LTN','4.0–4.9'],
                    ['501–1,000','Sub3','<4.0'],
                    ['0–500','Molecule','<3.0'],
                  ].map(([elo,tier,psl]) => (
                    <tr key={tier} style={{borderBottom:'1px solid var(--border)'}}>
                      <td style={{padding:'.85rem 1.25rem',fontSize:'.9rem',color:'var(--text-muted)'}}>{elo}</td>
                      <td style={{padding:'.85rem 1.25rem',fontFamily:'var(--font-display)',fontSize:'1rem',color:'var(--gold)'}}>{tier}</td>
                      <td style={{padding:'.85rem 1.25rem',fontSize:'.9rem',color:'var(--text-muted)'}}>{psl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>Is Omoggle Free?</h2>
            <p>Basic access is free. Omoggle Pro ($10/month) unlocks analytics and priority matchmaking. The platform had 209,000+ monthly visits as of May 2026.</p>

            <div className="highlight-box">
              <p>Practice without a live opponent — use our <Link href="/tools"><strong>free AI Face Analyzer</strong></Link> to score all 6 metrics and get personalized looksmaxxing tips.</p>
            </div>
          </article>

          <aside style={{marginTop:'var(--sp-lg)',paddingTop:'var(--sp-md)',borderTop:'1px solid var(--border)'}}>
            <h2 style={{fontSize:'1.2rem',marginBottom:'var(--sp-sm)'}}>Related Articles</h2>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
              {[
                ['/psl-scale-explained','PSL Scale'],
                ['/how-to-win-omoggle','How to Win'],
                ['/omoggle-tier-list','Tier List'],
                ['/is-omoggle-ai','Is Omoggle AI?'],
                ['/tools','AI Tool →'],
              ].map(([href,label]) => (
                <a key={href} href={href} className="tag">{label}</a>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
