import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

import { IMAGE_CACHE_VERSION } from '@/lib/images'
import { injectContactEmail } from '@/lib/contact'

function prepareHtmlContent(html) {
  if (!html) return html
  return injectContactEmail(fixArticleImagePaths(html))
}

function fixArticleImagePaths(html) {
  if (!html) return html
  return html
    .replace(/\bsrc="images\//g, 'src="/images/')
    .replace(/\bsrc="\/images\/([^"?]+)(?:\?[^"]*)?"/g, (_, name) => `src="/images/${name}?v=${IMAGE_CACHE_VERSION}"`)
}

import { ENGLISH_CONTENT_SLUGS } from '@/lib/i18n-routes'

const STATIC_PAGES = ENGLISH_CONTENT_SLUGS

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
  const articleContent = prepareHtmlContent(
    $('article.article-content, main .container-sm article, .article-content').first().html()
    || $('main').first().html()
    || '<p>Content not found.</p>'
  )

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
