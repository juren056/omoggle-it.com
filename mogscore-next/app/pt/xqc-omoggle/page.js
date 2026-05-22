import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'xQc no Omoggle: Pontuação, Reação e O Que Aconteceu | MogScore',
  description: 'A análise completa das pontuações de xQc no Omoggle, sua reação ao perder 6 rodadas seguidas e por que o clipe foi viral.',
}

const articleContent = `<img src="/images/xqc-omoggle.jpg" alt="xQc with shocked expression after being mogged multiple times on Omoggle" width="900" height="500" style="width:100%;border-radius:var(--r-lg);margin-bottom:var(--sp-md);border:1px solid var(--border);" loading="eager">
      <h2>What Happened?</h2>
      <p>On May 1st, 2026, xQc tried <a href="what-is-omoggle.html">Omoggle</a> live on stream and lost round after round. Jesse reacted with: <em>"They're literally giggling and you're still losing somehow. You might be chopped!"</em> The clip accumulated 24,000+ likes on X within five days.</p>
      <h2>What Was His Score?</h2>
      <p>xQc consistently scored in the <strong>MTN range</strong> — roughly 5.2–5.8 on the <a href="psl-scale-explained.html">PSL Scale</a>. He blamed the AI being broken, though most observers noted his camera setup was the main issue.</p>
      <h3>Why did he score low?</h3>
      <p>His studio camera is at approximately eye level rather than above, and his lighting creates unflattering shadows. As our <a href="how-to-win-omoggle.html">winning guide</a> shows, setup accounts for a significant portion of your score.</p>
      <div class="highlight-box"><p>Curious if you'd do better than xQc? Use our <a href="tools.html"><strong>free AI Face Analyzer</strong></a>.</p></div>`

export default function Page() {
  return (
    <>
      <Navbar />
      <header style={{padding:'var(--sp-lg) 0 var(--sp-sm)',borderBottom:'1px solid var(--border)'}}>
        <div className="container-sm">
          <nav style={{fontSize:'.82rem',color:'var(--text-muted)',marginBottom:'.75rem'}}>
            <Link href="/pt" style={{color:'var(--gold)'}}>Home</Link>
            <span style={{margin:'0 .5rem'}}>›</span>
            <a href="/blog" style={{color:'var(--gold)'}}>Blog</a>
          </nav>
          <h1 style={{marginTop:'.75rem'}}>xQc é Mogado no Omoggle — Análise Completa do Score</h1>
        </div>
      </header>
      <main className="section">
        <div className="container-sm">
          <article className="article-content" dangerouslySetInnerHTML={{ __html: articleContent }} />
          <aside style={{marginTop:'var(--sp-lg)',paddingTop:'var(--sp-md)',borderTop:'1px solid var(--border)'}}>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
              <Link href="/pt" className="tag">Home</Link>
              <Link href="/tools" className="tag">AI Tool →</Link>
              <a href="/pt/what-is-omoggle" className="tag">What is Omoggle</a>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
