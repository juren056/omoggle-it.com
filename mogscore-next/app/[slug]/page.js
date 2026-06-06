import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// All static pages that should be served via Next.js
const STATIC_PAGES = [
  'agent00-omoggle',
  'asmongold-omoggle',
  'best-angle-for-photos',
  'canthal-tilt-guide',
  'clavicular-mogged',
  'contact',
  'face-fat-loss-guide',
  'facial-features-guide',
  'facial-symmetry-guide',
  'facial-symmetry-improvement',
  'gym-face-guide',
  'haircut-looksmaxxing',
  'how-to-win-omoggle',
  'hunter-eyes-guide',
  'is-omoggle-ai',
  'jasontheween-omoggle',
  'jawline-guide',
  'jynxzi-omoggle',
  'looksmaxxing-for-women',
  'looksmaxxing-glossary',
  'looksmaxxing-guide',
  'looksmaxxing-results-timeline',
  'mewing-guide',
  'omoggle-beginner-guide',
  'omoggle-camera-setup',
  'omoggle-elo-system',
  'omoggle-fake-sites',
  'omoggle-faq',
  'omoggle-tier-list-2026',
  'omoggle-tier-list',
  'omoggle-top-players',
  'omoggle-tricks-hacks',
  'omoggle-updates',
  'omoggle-viral-moments',
  'omoggle-vs-omegle',
  'privacy-policy',
  'psl-scale-explained',
  'skincare-looksmaxxing',
  'sleep-looksmaxxing',
  'softmaxxing-vs-hardmaxxing',
  'streamers-omoggle-scores',
  'twitch-omoggle-rules',
  'what-is-mogging',
  'xqc-omoggle',
  'is-omoggle-safe',
  'quin69-soda-omoggle',
  'psl-scale-test',
  'omegle-alternative-2026',
  'looksmaxxing-for-women-guide',
  'omoggle-camera-angle',
  'looksmaxxing-supplements',
  'mogging-meaning',
  'how-to-get-hunter-eyes',
  'jawline-exercises',
  'face-shape-guide',
  'mogger-meaning',
  'looksmaxxing-before-after',
]

export async function generateStaticParams() {
  return STATIC_PAGES.map(slug => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const htmlPath = path.join(process.cwd(), 'public', `${slug}.html`)
  if (!fs.existsSync(htmlPath)) return {}
  const html = fs.readFileSync(htmlPath, 'utf-8')
  const $ = cheerio.load(html)
  return {
    title: $('title').text() || slug,
    description: $('meta[name="description"]').attr('content') || '',
  }
}

export default async function SlugPage({ params }) {
  const { slug } = await params
  if (!STATIC_PAGES.includes(slug)) notFound()

  const htmlPath = path.join(process.cwd(), 'public', `${slug}.html`)
  if (!fs.existsSync(htmlPath)) notFound()

  const html = fs.readFileSync(htmlPath, 'utf-8')
  const $ = cheerio.load(html)

  // Extract just the main content area
  const articleContent = $('article.article-content, main .container-sm article, .article-content').first().html()
    || $('main').first().html()
    || '<p>Content not found.</p>'

  // Extract breadcrumb category
  const cat = $('.card-tag, .breadcrumb span:last-child').first().text() || 'Guide'

  // Extract h1
  const h1 = $('h1').first().text() || slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())

  // Extract related tags
  const related = []
  $('aside a.tag').each((_, el) => {
    related.push({ href: $(el).attr('href'), text: $(el).text() })
  })

  return (
    <>
      <Navbar />
      <header style={{padding:'var(--sp-lg) 0 var(--sp-sm)',borderBottom:'1px solid var(--border)'}}>
        <div className="container-sm">
          <nav style={{fontSize:'.82rem',color:'var(--text-muted)',marginBottom:'.75rem'}}>
            <a href="/" style={{color:'var(--gold)'}}>Home</a>
            <span style={{margin:'0 .5rem'}}>›</span>
            <a href="/blog" style={{color:'var(--gold)'}}>Blog</a>
            <span style={{margin:'0 .5rem'}}>›</span>
            <span>{cat}</span>
          </nav>
          <span className="card-tag">{cat}</span>
          <h1 style={{marginTop:'.75rem'}}>{h1}</h1>
          <p style={{color:'var(--text-muted)',fontSize:'.85rem',marginTop:'.5rem'}}>Updated May 2026</p>
        </div>
      </header>
      <main className="section">
        <div className="container-sm">
          <article
            className="article-content"
            dangerouslySetInnerHTML={{ __html: articleContent }}
          />
          {related.length > 0 && (
            <aside style={{marginTop:'var(--sp-lg)',paddingTop:'var(--sp-md)',borderTop:'1px solid var(--border)'}}>
              <h2 style={{fontSize:'1.2rem',marginBottom:'var(--sp-sm)'}}>Related Articles</h2>
              <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
                {related.map(r => (
                  <a key={r.href} href={r.href} className="tag">{r.text}</a>
                ))}
              </div>
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
