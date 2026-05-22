import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'カンタールチルト解説：OmoggleのAIスコアリングで最重要の目の指標 | MogScore',
  description: 'カンタールチルトとは何か、なぜOmoggleのAIが最大18%の重みで評価するのか、そして実際に改善できることは何かを解説。',
}

const articleContent = `<img src="/images/canthal-tilt.jpg" alt="Diagram showing positive versus negative canthal tilt and its effect on Omoggle scores" width="900" height="500" style="width:100%;border-radius:var(--r-lg);margin-bottom:var(--sp-md);border:1px solid var(--border);" loading="eager">
      <h2>What is Canthal Tilt?</h2>
      <p>Canthal tilt is the angle from the inner corner (medial canthus) to the outer corner (lateral canthus) of each eye. It's one of six metrics measured by <a href="what-is-omoggle.html">Omoggle's AI</a> and accounts for roughly 18% of your total score.</p>
      <h2>Positive vs. Negative</h2>
      <h3>Positive canthal tilt</h3>
      <p>Outer corner sits <em>higher</em> than inner corner. Associated with a sharper, more angular appearance. Scores higher on <a href="psl-scale-explained.html">Omoggle's PSL system</a>.</p>
      <h3>Negative canthal tilt</h3>
      <p>Outer corner sits <em>lower</em>. Creates a drooping appearance. Scored lower by the AI.</p>
      <h2>Can You Improve It?</h2>
      <p>Canthal tilt is largely genetic. However, shooting from slightly above eye level naturally emphasizes whatever positive tilt you have — the most effective immediate fix. See: <a href="best-angle-for-photos.html">best camera angle guide</a>.</p>
      <div class="highlight-box"><p>Test your canthal tilt score with our <a href="tools.html"><strong>free AI Face Analyzer</strong></a>.</p></div>`

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
          <h1 style={{marginTop:'.75rem'}}>カンタールチルト解説：OmoggleのAIが重視する目の指標</h1>
        </div>
      </header>
      <main className="section">
        <div className="container-sm">
          <article className="article-content" dangerouslySetInnerHTML={{ __html: articleContent }} />
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
