import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Blog — Omoggle Guides, Looksmaxxing & PSL News | MogScore',
  description: 'Omoggle guides, looksmaxxing tips, PSL Scale analysis, streamer scores and the latest news from the looksmaxxing community. Updated weekly with fresh content.',
  openGraph: {
    title: 'MogScore Blog — Omoggle & Looksmaxxing Guides',
    description: 'Omoggle guides, looksmaxxing tips, PSL Scale analysis and streamer news.',
  },
}


const articles = [
  { href:'/what-is-omoggle', tag:'Wiki', title:'What is Omoggle? Complete 2026 Guide', desc:'The viral AI face-rating platform where strangers compete webcam-to-webcam. Everything you need to know.', date:'May 17, 2026' },
  { href:'/how-to-win-omoggle', tag:'Strategy', title:'How to Win on Omoggle: 7 Tips That Actually Work', desc:'Camera angle, lighting, and background — setup factors can raise your score by 1.5–2 points immediately.', date:'May 14, 2026' },
  { href:'/hunter-eyes-guide', tag:'Guide', title:'Hunter Eyes: What They Are and How to Get Them', desc:'The most discussed looksmaxxing feature — what you can realistically do to improve your eye area.', date:'May 17, 2026' },
  { href:'/face-fat-loss-guide', tag:'Guide', title:'Face Fat Loss: Reveal Your Jawline', desc:"Highest-ROI looksmaxxing intervention. Here's the timeline and most effective approach.", date:'May 17, 2026' },
  { href:'/looksmaxxing-results-timeline', tag:'Guide', title:'Looksmaxxing Results Timeline', desc:'Honest timelines: Skincare 4–6 weeks. Face fat 8–16 weeks. Mewing months to years.', date:'May 17, 2026' },
  { href:'/softmaxxing-vs-hardmaxxing', tag:'Guide', title:'Softmaxxing vs Hardmaxxing: Which First?', desc:'Non-invasive vs surgical — when each makes sense and which to prioritize.', date:'May 17, 2026' },
  { href:'/facial-symmetry-improvement', tag:'Guide', title:'How to Improve Facial Symmetry', desc:"Symmetry is Omoggle's top metric at 22%. What causes asymmetry and what you can fix.", date:'May 17, 2026' },
  { href:'/is-omoggle-ai', tag:'Investigation', title:"Is Omoggle Actually AI? The Developer's Answer", desc:"Pablo Rogers clarified: computer vision not LLMs. Here's what that means for your score.", date:'May 14, 2026' },
  { href:'/omoggle-fake-sites', tag:'Warning', title:'Fake Omoggle Sites: How to Spot the Real One', desc:'Multiple clones appeared after the viral surge. How to stay safe.', date:'May 14, 2026' },
  { href:'/omoggle-tier-list-2026', tag:'Updated', title:'Full Tier List 2026: All 9 Ranks Including Adam', desc:"Complete updated tier list with the confirmed 'Adam' rank at 20,001+ ELO.", date:'May 14, 2026' },
  { href:'/psl-scale-explained', tag:'Reference', title:'PSL Scale Explained: What Every Score Means', desc:"What each number means and where people actually land.", date:'May 7, 2026' },
  { href:'/xqc-omoggle', tag:'News', title:"xQc on Omoggle: He Lost 6 in a Row", desc:"The clip that started it all and introduced millions to mogging.", date:'May 5, 2026' },
]

function ArticleCard({ a }) {
  return (
    <article className="card">
      <div className="card-body">
        <span className="card-tag">{a.tag}</span>
        <a href={a.href} className="card-title">{a.title}</a>
        <p className="card-excerpt">{a.desc}</p>
        <span className="card-meta">{a.date}</span>
      </div>
    </article>
  )
}

function ArticleRow({ a }) {
  return (
    <article style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'1rem 1.25rem',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'1rem'}}>
      <div>
        <span className="card-tag" style={{marginBottom:'.5rem'}}>{a.tag}</span>
        <a href={a.href} style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',color:'var(--text)',display:'block',marginBottom:'.35rem',textDecoration:'none'}}>{a.title}</a>
        <p style={{fontSize:'.88rem',color:'var(--text-muted)',margin:0,lineHeight:1.6}}>{a.desc}</p>
      </div>
      <span style={{fontSize:'.78rem',color:'var(--text-dim)',whiteSpace:'nowrap',marginTop:'.25rem'}}>{a.date}</span>
    </article>
  )
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <header style={{padding:'var(--sp-lg) 0 var(--sp-sm)',borderBottom:'1px solid var(--border)'}}>
        <div className="container">
          <h1>Blog</h1>
          <p style={{color:'var(--text-muted)',marginTop:'.5rem'}}>Omoggle guides, looksmaxxing tips, PSL Scale analysis and streamer news.</p>
        </div>
      </header>
      <main className="section">
        <div className="container">
          <div className="grid-3" style={{marginBottom:'var(--sp-lg)'}}>
            {articles.slice(0,3).map(a => <ArticleCard key={a.href} a={a} />)}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {articles.slice(3).map(a => <ArticleRow key={a.href} a={a} />)}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
