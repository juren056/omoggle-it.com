import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

import { IMAGE_CACHE_VERSION } from '@/lib/images'
import { injectContactEmail } from '@/lib/contact'
import { cleanInternalHtmlLinks, cleanHref } from '@/lib/html-links'

function prepareHtmlContent(html) {
  if (!html) return html
  return cleanInternalHtmlLinks(injectContactEmail(fixArticleImagePaths(html)))
}

function fixArticleImagePaths(html) {
  if (!html) return html
  return html
    .replace(/\bsrc="images\//g, 'src="/images/')
    .replace(/\bsrc="\/images\/([^"?]+)(?:\?[^"]*)?"/g, (_, name) => `src="/images/${name}?v=${IMAGE_CACHE_VERSION}"`)
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

/** Pull datePublished/dateModified from any JSON-LD Article block in the source HTML. */
function extractArticleDates($) {
  let published = null
  let modified = null
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).text())
      const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data]
      for (const n of nodes) {
        if (n && n.dateModified && !modified) modified = n.dateModified
        if (n && n.datePublished && !published) published = n.datePublished
      }
    } catch {
      /* ignore malformed JSON-LD */
    }
  })
  return { published: published || modified, modified: modified || published }
}

function formatDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
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
    related.push({ href: cleanHref($(el).attr('href')), text: $(el).text() })
  })

  // E-E-A-T: real update date + Article schema (head JSON-LD is dropped when we extract body only)
  const { published, modified } = extractArticleDates($)
  const updatedLabel = formatDate(modified) || '2026'
  const description = $('meta[name="description"]').attr('content') || ''
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: h1,
    description,
    url: `https://omoggle-it.com/${slug}`,
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    author: { '@type': 'Organization', name: 'MogScore Editorial Team' },
    publisher: { '@type': 'Organization', name: 'MogScore', url: 'https://omoggle-it.com' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
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
          <p style={{color:'var(--text-muted)',fontSize:'.85rem',marginTop:'.5rem'}}>Updated {updatedLabel} · Reviewed by the MogScore Editorial Team</p>
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
          <p style={{marginTop:'var(--sp-md)',fontSize:'.78rem',color:'var(--text-dim)',lineHeight:1.6}}>
            Disclaimer: PSL scores and looksmaxxing metrics are a pseudoscientific approximation of facial aesthetics and are provided for entertainment only. MogScore is an independent resource and is not affiliated with Omoggle LLC.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
