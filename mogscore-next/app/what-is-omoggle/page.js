import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'What is Omoggle? Complete 2026 Guide',
  description: 'An independent guide to the Omoggle concept, camera preparation, uncertain scoring claims and safer troubleshooting.',
  alternates: { canonical: 'https://omoggle-it.com/what-is-omoggle' },
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
          <p style={{color:'var(--text-muted)',fontSize:'.85rem',marginTop:'.5rem'}}>Updated September 14, 2026 · Independent guide</p>
        </div>
      </header>
      <main className="section">
        <div className="container-sm">
          <article style={{lineHeight:1.8}}>
            <Image src="/images/what-is-omoggle.jpg" alt="Illustration accompanying the independent Omoggle guide" width={1200} height={675} priority sizes="(max-width: 760px) 100vw, 760px" style={{width:'100%',height:'auto',borderRadius:'var(--r-lg)',marginBottom:'var(--sp-md)',border:'1px solid var(--border)'}} />

            <h2>What is Omoggle?</h2>
            <p>Omoggle is commonly described as a webcam-based face-comparison experience using looksmaxxing slang such as “mogging.” Omoggle IT is an independent guide and cannot inspect the platform’s private scoring, matching or moderation code.</p>
            <p>Availability and behavior may change. Use the <Link href="/omoggle-troubleshooting">troubleshooting flow</Link> when the site or camera does not work; a failed cross-origin request from another website is not proof of an outage.</p>

            <h2>How Does Omoggle Work?</h2>
            <p>A typical session requires browser camera permission and a clear, front-facing image. Exact processing time, ranking behavior and match rules are controlled by Omoggle and are not independently verified here. Our <Link href="/omoggle-practice-test">practice tool</Link> checks only camera setup on your device.</p>

            <h3>What Can Be Observed</h3>
            <p>Lighting, framing, head direction and lens perspective visibly change a camera image. Published claims about exact Omoggle metric weights are not verifiable from its private implementation, so this guide does not present them as facts.</p>

            <h2>Why Did Omoggle Go Viral?</h2>
            <p>Clips and creator reactions can make a comparison format spread quickly, but social engagement counts and platform rules change. See the dated creator articles for their cited context rather than treating old counts as live facts.</p>

            <h2>Is Omoggle Actually AI?</h2>
            <p>“AI” can refer to many different systems. Without public technical documentation, this site cannot confirm Omoggle’s current model or exact feature set. Camera angle and lighting still affect the pixels any vision system receives. See: <Link href="/is-omoggle-ai">Is Omoggle Actually AI?</Link></p>

            <h2>The ELO Tier System</h2>
            <p>Community pages describe ELO-style tiers, but labels and thresholds may change and are not represented here as an official live specification. The table below is retained as a historical community reference, not a verified current rulebook:</p>
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
            <p>Check Omoggle itself for current availability and pricing. Omoggle IT does not sell access to Omoggle. This site’s own new subscriptions are closed by default; the local tools are free.</p>

            <div className="highlight-box">
              <p>Practice without a live opponent using the <Link href="/omoggle-practice-test"><strong>Omoggle Practice Test</strong></Link>, then compare the <Link href="/psl-test">PSL Test</Link> and <Link href="/mog-score">Mog Score</Link>.</p>
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
