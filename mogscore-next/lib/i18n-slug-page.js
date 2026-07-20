import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { IMAGE_CACHE_VERSION } from '@/lib/images'
import { injectContactEmail } from '@/lib/contact'
import { LANG_MIRROR_SLUGS } from '@/lib/i18n-routes'
import { cleanInternalHtmlLinks, cleanHref } from '@/lib/html-links'

function fixArticleImagePaths(html) {
  if (!html) return html
  return html
    .replace(/\bsrc="images\//g, 'src="/images/')
    .replace(/\bsrc="\/images\/([^"?]+)(?:\?[^"]*)?"/g, (_, name) => `src="/images/${name}?v=${IMAGE_CACHE_VERSION}"`)
}

function prepareHtmlContent(html) {
  if (!html) return html
  return cleanInternalHtmlLinks(injectContactEmail(fixArticleImagePaths(html)))
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

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

export function createI18nSlugPage(lang) {
  async function generateStaticParams() {
    return LANG_MIRROR_SLUGS.map(slug => ({ slug }))
  }

  async function generateMetadata({ params }) {
    const { slug } = await params
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
          en: `https://omoggle-it.com/${slug}`,
          [lang]: `https://omoggle-it.com/${lang}/${slug}`,
        },
      },
    }
  }

  async function LangSlugPage({ params }) {
    const { slug } = await params
    if (!LANG_MIRROR_SLUGS.includes(slug)) notFound()

    const htmlPath = path.join(process.cwd(), 'public', `${slug}.html`)
    if (!fs.existsSync(htmlPath)) notFound()

    const html = fs.readFileSync(htmlPath, 'utf-8')
    const $ = cheerio.load(html)
    const ui = LANG_UI[lang]

    const articleContent = prepareHtmlContent(
      $('article.article-content, .article-content').first().html()
      || $('main .container-sm').first().html()
      || '<p>Content not found.</p>'
    )

    const cat = $('.card-tag').first().text() || 'Guide'
    const h1 = $('h1').first().text() || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

    const related = []
    $('aside a.tag').each((_, el) => {
      related.push({ href: cleanHref($(el).attr('href')), text: $(el).text() })
    })

    const { published, modified } = extractArticleDates($)
    const updatedLabel = formatDate(modified) || '2026'
    const description = $('meta[name="description"]').attr('content') || ''
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: h1,
      description,
      url: `https://omoggle-it.com/${lang}/${slug}`,
      inLanguage: lang,
      ...(published ? { datePublished: published } : {}),
      ...(modified ? { dateModified: modified } : {}),
      author: { '@type': 'Organization', name: 'MogScore Editorial Team' },
      publisher: { '@type': 'Organization', name: 'MogScore', url: 'https://omoggle-it.com' },
    }

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <Navbar />
        <div style={{ background: 'rgba(212,168,67,0.08)', borderBottom: '1px solid var(--border)', padding: '.6rem 0', textAlign: 'center' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '.82rem', color: 'var(--text-muted)' }}>
            <span>📖 This article is in English</span>
            <a href={`/${slug}`} style={{ color: 'var(--gold)', textDecoration: 'none', border: '1px solid var(--border-md)', padding: '2px 10px', borderRadius: '3px', fontSize: '.78rem' }}>
              English version →
            </a>
          </div>
        </div>
        <header style={{ padding: 'var(--sp-lg) 0 var(--sp-sm)', borderBottom: '1px solid var(--border)' }}>
          <div className="container-sm">
            <nav style={{ fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '.75rem' }}>
              <a href={`/${lang}`} style={{ color: 'var(--gold)' }}>{ui.home}</a>
              <span style={{ margin: '0 .5rem' }}>›</span>
              <a href="/blog" style={{ color: 'var(--gold)' }}>{ui.blog}</a>
              <span style={{ margin: '0 .5rem' }}>›</span>
              <span>{cat}</span>
            </nav>
            <span className="card-tag">{cat}</span>
            <h1 style={{ marginTop: '.75rem' }}>{h1}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', marginTop: '.5rem' }}>{ui.updated} {updatedLabel} · MogScore Editorial Team</p>
          </div>
        </header>
        <main className="section">
          <div className="container-sm">
            <article className="article-content" dangerouslySetInnerHTML={{ __html: articleContent }} />
            {related.length > 0 && (
              <aside style={{ marginTop: 'var(--sp-lg)', paddingTop: 'var(--sp-md)', borderTop: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--sp-sm)' }}>{ui.related}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                  {related.map(r => (
                    <a key={r.href} href={r.href} className="tag">{r.text}</a>
                  ))}
                </div>
              </aside>
            )}
            <p style={{ marginTop: 'var(--sp-md)', fontSize: '.78rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              {ui.disclaimer} MogScore — not affiliated with Omoggle LLC.
            </p>
            <div style={{ marginTop: 'var(--sp-lg)', paddingTop: 'var(--sp-sm)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <a href={`/${lang}`} style={{ color: 'var(--text-muted)', fontSize: '.85rem', textDecoration: 'none' }}>
                {ui.backToHome}
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return { generateStaticParams, generateMetadata, default: LangSlugPage }
}
