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

import { LANG_MIRROR_SLUGS, SUPPORTED_LANGS } from '@/lib/i18n-routes'

const LANG_UI = {
  ja: {
    home: 'ホーム', blog: 'ブログ', wiki: 'Wiki', tools: 'ツール',
    updated: '更新日', readMore: '続きを読む', related: '関連記事',
    disclaimer: 'エンターテインメント目的のみ。',
    backToHome: '← ホームに戻る',
    langName: '日本語',
  },
  pt: {
    home: 'Início', blog: 'Blog', wiki: 'Wiki', tools: 'Ferramentas',
    updated: 'Atualizado', readMore: 'Leia mais', related: 'Artigos Relacionados',
    disclaimer: 'Apenas para entretenimento.',
    backToHome: '← Voltar ao Início',
    langName: 'Português',
  },
  ru: {
    home: 'Главная', blog: 'Блог', wiki: 'Вики', tools: 'Инструменты',
    updated: 'Обновлено', readMore: 'Читать далее', related: 'Похожие статьи',
    disclaimer: 'Только для развлечения.',
    backToHome: '← На главную',
    langName: 'Русский',
  },
}

const ALL_SLUGS = LANG_MIRROR_SLUGS

export async function generateStaticParams() {
  const params = []
  for (const lang of SUPPORTED_LANGS) {
    for (const slug of ALL_SLUGS) {
      params.push({ lang, slug })
    }
  }
  return params
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  const htmlPath = path.join(process.cwd(), 'public', `${slug}.html`)
  if (!fs.existsSync(htmlPath)) return {}
  const html = fs.readFileSync(htmlPath, 'utf-8')
  const $ = cheerio.load(html)
  const ui = LANG_UI[lang] || LANG_UI.ja
  return {
    title: $('title').text() + ` | ${ui.langName}`,
    description: $('meta[name="description"]').attr('content') || '',
    alternates: {
      canonical: `https://omoggle-it.com/${lang}/${slug}`,
      languages: {
        'en': `https://omoggle-it.com/${slug}`,
        [lang]: `https://omoggle-it.com/${lang}/${slug}`,
      }
    }
  }
}

export default async function LangSlugPage({ params }) {
  const { lang, slug } = await params
  if (!SUPPORTED_LANGS.includes(lang)) notFound()
  if (!ALL_SLUGS.includes(slug)) notFound()

  const htmlPath = path.join(process.cwd(), 'public', `${slug}.html`)
  if (!fs.existsSync(htmlPath)) notFound()

  const html = fs.readFileSync(htmlPath, 'utf-8')
  const $ = cheerio.load(html)
  const ui = LANG_UI[lang]

  // Extract content
  const articleContent = prepareHtmlContent(
    $('article.article-content, .article-content').first().html()
    || $('main .container-sm').first().html()
    || '<p>Content not found.</p>'
  )

  const cat = $('.card-tag').first().text() || 'Guide'
  const h1 = $('h1').first().text() || slug.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase())

  const related = []
  $('aside a.tag').each((_, el) => {
    related.push({ href: $(el).attr('href'), text: $(el).text() })
  })

  return (
    <>
      <Navbar />
      {/* Language notice banner */}
      <div style={{background:'rgba(212,168,67,0.08)',borderBottom:'1px solid var(--border)',padding:'.6rem 0',textAlign:'center'}}>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'1rem',flexWrap:'wrap',fontSize:'.82rem',color:'var(--text-muted)'}}>
          <span>📖 This article is in English</span>
          <a href={`/${slug}`} style={{color:'var(--gold)',textDecoration:'none',border:'1px solid var(--border-md)',padding:'2px 10px',borderRadius:'3px',fontSize:'.78rem'}}>
            English version →
          </a>
        </div>
      </div>
      <header style={{padding:'var(--sp-lg) 0 var(--sp-sm)',borderBottom:'1px solid var(--border)'}}>
        <div className="container-sm">
          <nav style={{fontSize:'.82rem',color:'var(--text-muted)',marginBottom:'.75rem'}}>
            <a href={`/${lang}`} style={{color:'var(--gold)'}}>
              {ui.home}
            </a>
            <span style={{margin:'0 .5rem'}}>›</span>
            <a href="/blog" style={{color:'var(--gold)'}}>
              {ui.blog}
            </a>
            <span style={{margin:'0 .5rem'}}>›</span>
            <span>{cat}</span>
          </nav>
          <span className="card-tag">{cat}</span>
          <h1 style={{marginTop:'.75rem'}}>{h1}</h1>
          <p style={{color:'var(--text-muted)',fontSize:'.85rem',marginTop:'.5rem'}}>{ui.updated} May 2026</p>
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
              <h2 style={{fontSize:'1.2rem',marginBottom:'var(--sp-sm)'}}>{ui.related}</h2>
              <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
                {related.map(r => (
                  <a key={r.href} href={r.href} className="tag">{r.text}</a>
                ))}
              </div>
            </aside>
          )}
          <div style={{marginTop:'var(--sp-lg)',paddingTop:'var(--sp-sm)',borderTop:'1px solid var(--border)',textAlign:'center'}}>
            <a href={`/${lang}`} style={{color:'var(--text-muted)',fontSize:'.85rem',textDecoration:'none'}}>
              {ui.backToHome}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
