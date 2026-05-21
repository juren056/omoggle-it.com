import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'MogScore — Omoggle Guide, Looksmaxxing & PSL Scale Wiki',
  description: 'Free AI face analyzer, PSL Scale explained, Omoggle tier rankings and tips to win. Used by 10,000+ looksmaxxers worldwide.',
}

const featuredArticles = [
  {href:'/what-is-omoggle',tag:'Wiki',title:'What is Omoggle? Complete 2026 Guide',desc:'The viral AI face-rating platform explained — how it works, tier list, streamers and how to win.'},
  {href:'/psl-scale-explained',tag:'Reference',title:'PSL Scale Explained: Ranks 1–10',desc:"The 1–10 scale Omoggle uses as its AI scoring backbone. What each number means."},
  {href:'/how-to-win-omoggle',tag:'Strategy',title:'How to Win on Omoggle: 7 Tips',desc:'Camera angle, lighting and background — setup factors that raise your score by 1.5–2 points.'},
  {href:'/hunter-eyes-guide',tag:'Guide',title:'Hunter Eyes: What They Are and How to Get Them',desc:'The most discussed looksmaxxing feature — what you can realistically do to improve your eye area.'},
  {href:'/face-fat-loss-guide',tag:'Guide',title:'Face Fat Loss: Reveal Your Jawline',desc:'Highest-ROI looksmaxxing intervention. Timeline and most effective approach.'},
  {href:'/looksmaxxing-results-timeline',tag:'Guide',title:'Looksmaxxing Results Timeline',desc:'Honest timelines: Skincare 4–6 weeks. Face fat 8–16 weeks. Mewing months to years.'},
]

const allArticles = [
  {href:'/softmaxxing-vs-hardmaxxing',tag:'Guide',title:'Softmaxxing vs Hardmaxxing: Which First?',date:'May 17'},
  {href:'/facial-symmetry-improvement',tag:'Guide',title:'How to Improve Facial Symmetry',date:'May 17'},
  {href:'/is-omoggle-ai',tag:'Investigation',title:"Is Omoggle Actually AI? Developer's Answer",date:'May 14'},
  {href:'/omoggle-fake-sites',tag:'Warning',title:'Fake Omoggle Sites: How to Spot Them',date:'May 14'},
  {href:'/omoggle-tier-list-2026',tag:'Updated',title:'Full Tier List 2026: All 9 Ranks Including Adam',date:'May 14'},
  {href:'/agent00-omoggle',tag:'News',title:'Agent00 Wore a Prosthetic Forehead and Still Won',date:'May 14'},
  {href:'/jasontheween-omoggle',tag:'News',title:'Jasontheween & CORE Boys Omoggle Battles',date:'May 14'},
  {href:'/xqc-omoggle',tag:'News',title:'xQc on Omoggle: He Lost 6 in a Row',date:'May 5'},
  {href:'/asmongold-omoggle',tag:'News',title:'Asmongold Omoggle Score & Highlights',date:'May 5'},
  {href:'/clavicular-mogged',tag:'News',title:'Clavicular Ragequit After Getting Mogged',date:'May 5'},
  {href:'/omoggle-elo-system',tag:'Wiki',title:'Omoggle ELO System Explained',date:'May 3'},
  {href:'/omoggle-vs-omegle',tag:'Wiki',title:'Omoggle vs Omegle: What is the Difference?',date:'May 3'},
  {href:'/looksmaxxing-guide',tag:'Guide',title:'Looksmaxxing Guide for Beginners',date:'May 1'},
  {href:'/canthal-tilt-guide',tag:'Guide',title:'Canthal Tilt Guide: What It Is and How to Improve',date:'May 1'},
  {href:'/mewing-guide',tag:'Guide',title:'Mewing Guide: Does It Actually Work?',date:'May 1'},
  {href:'/jawline-guide',tag:'Guide',title:'Jawline Guide: How to Get a Sharper Jaw',date:'May 1'},
  {href:'/skincare-looksmaxxing',tag:'Guide',title:'Skincare for Looksmaxxing: Complete Routine',date:'Apr 28'},
  {href:'/gym-face-guide',tag:'Guide',title:'Gym Face Guide: How Training Changes Your Face',date:'Apr 28'},
  {href:'/sleep-looksmaxxing',tag:'Guide',title:'Sleep and Looksmaxxing: Why It Matters',date:'Apr 28'},
  {href:'/haircut-looksmaxxing',tag:'Guide',title:'Best Haircut for Looksmaxxing',date:'Apr 25'},
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <header className="hero">
        <div className="container">
          <span className="hero-eyebrow">🔥 Trending on Twitch 2026</span>
          <h1>Your Ultimate Guide to <em>Omoggle</em>,<br/>Mogging & Looksmaxxing</h1>
          <p className="hero-sub">Free AI face analyzer, complete PSL Scale wiki, tier rankings, and expert tips to win on Omoggle. Used by 10,000+ looksmaxxers worldwide.</p>
          <div className="hero-actions">
            <Link href="/tools" className="btn btn-primary">Try AI Face Analyzer</Link>
            <Link href="/what-is-omoggle" className="btn btn-outline">What is Omoggle? →</Link>
          </div>
        </div>
      </header>

      <section className="section-alt section">
        <div className="container">
          <div className="stats-row">
            <div className="stat-item"><span className="stat-num">50K+</span><span className="stat-label">Monthly Visitors</span></div>
            <div className="stat-item"><span className="stat-num">54</span><span className="stat-label">Guides & Articles</span></div>
            <div className="stat-item"><span className="stat-num">9</span><span className="stat-label">ELO Tiers Explained</span></div>
            <div className="stat-item"><span className="stat-num">Free</span><span className="stat-label">AI Face Analyzer</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Free Tools</span>
            <h2>AI-Powered Looksmaxxing Tools</h2>
          </div>
          <div className="grid-2">
            <article className="tool-card">
              <div className="tool-icon">◈</div>
              <span className="tool-badge free">Free</span>
              <h3>AI Face Analyzer</h3>
              <p style={{fontSize:'.88rem',color:'var(--text-muted)',flex:1}}>Upload your photo and get a detailed MogScore with ratings for all 6 facial metrics plus personalized looksmaxxing tips.</p>
              <Link href="/tools" className="btn btn-primary" style={{textAlign:'center',marginTop:'1rem'}}>Analyze My Face →</Link>
            </article>
            <article className="tool-card">
              <div className="tool-icon">⚡</div>
              <span className="tool-badge new">New</span>
              <h3>1v1 Mog Battle</h3>
              <p style={{fontSize:'.88rem',color:'var(--text-muted)',flex:1}}>Upload two photos and let the AI decide who mogs whom. Perfect for settling debates with friends.</p>
              <Link href="/tools#battle" className="btn btn-outline" style={{textAlign:'center',marginTop:'1rem'}}>Start a Battle →</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Latest Articles</span>
            <h2>Featured Guides & News</h2>
          </div>
          <div className="grid-3" style={{marginBottom:'var(--sp-lg)'}}>
            {featuredArticles.map(a => (
              <article className="card" key={a.href}>
                <div className="card-body">
                  <span className="card-tag">{a.tag}</span>
                  <a href={a.href} className="card-title">{a.title}</a>
                  <p className="card-excerpt">{a.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'var(--sp-lg)'}}>
            {allArticles.map(a => (
              <div key={a.href} style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:'.75rem 1rem',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'.75rem',minWidth:0}}>
                  <span className="card-tag" style={{marginBottom:0,flexShrink:0}}>{a.tag}</span>
                  <a href={a.href} style={{fontSize:'.9rem',color:'var(--text)',textDecoration:'none',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}
>{a.title}</a>
                </div>
                <span style={{fontSize:'.78rem',color:'var(--text-dim)',flexShrink:0}}>{a.date}</span>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center'}}>
            <Link href="/blog" className="btn btn-outline">View All Articles →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
