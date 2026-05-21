import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'MogScore — Omoggle Guide, Looksmaxxing & PSL Scale Wiki',
  description: 'Free AI face analyzer, PSL Scale explained, Omoggle tier rankings and tips to win. Used by 10,000+ looksmaxxers worldwide.',
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <header className="hero">
        <div className="container">
          <span className="hero-eyebrow">🔥 Trending on Twitch 2026</span>
          <h1>Your Ultimate Guide to <em>Omoggle</em>,<br/>Mogging & Looksmaxxing</h1>
          <p className="hero-sub">Free AI face analyzer, complete PSL Scale wiki, tier rankings, and expert tips to help you win on Omoggle. Used by 10,000+ looksmaxxers worldwide.</p>
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
            <p style={{color:'var(--text-muted)',maxWidth:'500px',margin:'0 auto'}}>Upload your photo and get an instant AI score — the same analysis Omoggle uses.</p>
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
          <div className="highlight-box" style={{marginTop:'var(--sp-md)'}}>
            <p>📖 New to looksmaxxing? Start with our <a href="/looksmaxxing-guide"><strong>Looksmaxxing 101 Guide</strong></a> before you analyze.</p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Wiki</span>
            <h2>Everything You Need to Know</h2>
          </div>
          <div className="grid-3">
            {[
              {href:'/what-is-omoggle',tag:'Beginner',title:'What is Omoggle? Complete 2026 Guide',desc:'The viral AI face-rating platform where strangers compete webcam-to-webcam on the PSL Scale.'},
              {href:'/psl-scale-explained',tag:'Reference',title:'PSL Scale Explained: Ranks 1–10',desc:"Omoggle uses the PSL Scale as its scoring backbone. Here's what each number means."},
              {href:'/how-to-win-omoggle',tag:'Strategy',title:'How to Win on Omoggle: 7 Tips',desc:'Camera angle, lighting, background — setup factors can raise your score by 1.5–2 points.'},
            ].map(c => (
              <article className="card" key={c.href}>
                <div className="card-body">
                  <span className="card-tag">{c.tag}</span>
                  <a href={c.href} className="card-title">{c.title}</a>
                  <p className="card-excerpt">{c.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'var(--sp-lg)'}}>
            <Link href="/blog" className="btn btn-outline">View All Articles →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
