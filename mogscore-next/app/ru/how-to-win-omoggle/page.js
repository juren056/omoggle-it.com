import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Как побеждать в Omoggle: 7 советов для улучшения счёта | MogScore',
  description: 'Угол камеры, освещение, фон — факторы настройки, которые повышают ваш счёт в Omoggle на 1,5–2 пункта. 7 проверенных советов.',
}

const articleContent = `<img src="/images/how-to-win-omoggle.jpg" alt="Before and after camera setup showing how angle and lighting affect Omoggle score" width="900" height="500" style="width:100%;border-radius:var(--r-lg);margin-bottom:var(--sp-md);border:1px solid var(--border);" loading="eager">
      <h2>Why Setup Matters More Than Your Face</h2>
      <p><a href="what-is-omoggle.html">Omoggle's AI</a> processes a webcam image — not your actual face. The same person can score 1.5–2.0 points higher with an optimized setup.</p>
      <h2>7 Tips</h2>
      <h3>1. Camera above eye level</h3>
      <p>Position webcam 15–25cm above your eyes, angled slightly down. Emphasizes <a href="canthal-tilt-guide.html">canthal tilt</a> and sharpens jawline appearance. The #1 single change you can make.</p>
      <h3>2. Natural side lighting</h3>
      <p>Sit facing a window at 45 degrees. Adds facial dimension that highlights cheekbones and jawline.</p>
      <h3>3. Dark neutral background</h3>
      <p>Plain dark background reduces visual noise and forces the AI to focus on your face.</p>
      <h3>4. Camera distance 60–80cm</h3>
      <p>Too close distorts proportions. Too far loses landmark detail. Face should fill 40–60% of the frame.</p>
      <h3>5. Skin prep</h3>
      <p>Wash face, apply light moisturizer before each session. See: <a href="skincare-looksmaxxing.html">skincare guide</a>.</p>
      <h3>6. Neutral expression</h3>
      <p>Slight relaxed smile. Avoid wide grins that distort facial landmarks.</p>
      <h3>7. Play in the morning</h3>
      <p>Post-sleep faces have less puffiness and better skin clarity. See: <a href="sleep-looksmaxxing.html">sleep and looksmaxxing</a>.</p>
      <div class="highlight-box"><p>Test your setup with our <a href="tools.html"><strong>free AI Face Analyzer</strong></a> before going live on Omoggle.</p></div>`

export default function Page() {
  return (
    <>
      <Navbar />
      <header style={{padding:'var(--sp-lg) 0 var(--sp-sm)',borderBottom:'1px solid var(--border)'}}>
        <div className="container-sm">
          <nav style={{fontSize:'.82rem',color:'var(--text-muted)',marginBottom:'.75rem'}}>
            <Link href="/ru" style={{color:'var(--gold)'}}>Home</Link>
            <span style={{margin:'0 .5rem'}}>›</span>
            <a href="/blog" style={{color:'var(--gold)'}}>Blog</a>
          </nav>
          <h1 style={{marginTop:'.75rem'}}>Как побеждать в Omoggle: 7 проверенных советов</h1>
        </div>
      </header>
      <main className="section">
        <div className="container-sm">
          <article className="article-content" dangerouslySetInnerHTML={{ __html: articleContent }} />
          <aside style={{marginTop:'var(--sp-lg)',paddingTop:'var(--sp-md)',borderTop:'1px solid var(--border)'}}>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
              <Link href="/ru" className="tag">Home</Link>
              <Link href="/tools" className="tag">AI Tool →</Link>
              <a href="/ru/what-is-omoggle" className="tag">What is Omoggle</a>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
