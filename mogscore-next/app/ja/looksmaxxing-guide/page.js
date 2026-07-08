import Navbar from '@/components/Navbar'
import { cleanInternalHtmlLinks } from '@/lib/html-links'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: '初心者のためのルックスマックスガイド：基本と始め方 | MogScore',
  description: 'ルックスマックスとは何か、なぜ機能するのか、そして今日から始めるための方法。外見の改善に関する科学的根拠に基づいた入門ガイド。',
}

const articleContent = `<img src="/images/looksmaxxing-guide.jpg" alt="Before and after comparison illustrating looksmaxxing techniques" width="900" height="500" style="width:100%;border-radius:var(--r-lg);margin-bottom:var(--sp-md);border:1px solid var(--border);" loading="eager">
      <h2>What is Looksmaxxing?</h2>
      <p>Looksmaxxing is the practice of systematically maximizing your physical appearance to improve your <a href="psl-scale-explained.html">PSL Score</a> — the same metrics <a href="what-is-omoggle.html">Omoggle's AI</a> measures when you compete.</p>
      <h2>The 5 Most Impactful Techniques</h2>
      <h3>1. Skincare routine</h3>
      <p>Skin clarity is directly scored by Omoggle. A basic routine — gentle cleanser, niacinamide serum, SPF 50 — produces visible results in 4–6 weeks. Full guide: <a href="skincare-looksmaxxing.html">skincare for looksmaxxers</a>.</p>
      <h3>2. Mewing</h3>
      <p>Keeping your tongue flat on the roof of your mouth. Claimed to reshape jaw structure over time. Free, no downsides. Full guide: <a href="mewing-guide.html">mewing guide</a>.</p>
      <h3>3. Gym training</h3>
      <p>Reducing body fat reveals jawline and cheekbones — both heavily weighted by Omoggle. See: <a href="gym-face-guide.html">gym face guide</a>.</p>
      <h3>4. Camera optimization</h3>
      <p>For immediate Omoggle improvement. Camera above eye level, natural side lighting, neutral background. See: <a href="how-to-win-omoggle.html">how to win Omoggle</a>.</p>
      <h3>5. Hairstyle</h3>
      <p>The right cut frames facial structure and exposes symmetry. See: <a href="haircut-looksmaxxing.html">haircut guide</a>.</p>
      <div class="highlight-box"><p>Get your baseline score with our <a href="tools.html"><strong>free AI Face Analyzer</strong></a> to see which metrics need the most improvement.</p></div>`

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
          <h1 style={{marginTop:'.75rem'}}>ルックスマックス101：初心者のための完全ガイド</h1>
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
