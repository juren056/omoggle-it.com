'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JP' },
  { code: 'pt', label: 'PT' },
  { code: 'ru', label: 'RU' },
]

// Localized labels per language; only routes that have a localized version are
// prefixed with /{lang} (see LOCALIZED_ROUTES). Others stay on the English route.
const NAV_LABELS = {
  en: { omoggle: 'Omoggle', pslTest: 'PSL Test', mogScore: 'Mog Score', analyzer: 'Face Analyzer', guides: 'Guides', blog: 'Blog', tryAi: 'Try AI →' },
  ja: { omoggle: 'Omoggle', pslTest: 'PSLテスト', mogScore: 'Mog Score', analyzer: '顔分析', guides: 'ガイド', blog: 'ブログ', tryAi: 'AIを試す →' },
  pt: { omoggle: 'Omoggle', pslTest: 'Teste PSL', mogScore: 'Mog Score', analyzer: 'Analisador', guides: 'Guias', blog: 'Blog', tryAi: 'Testar IA →' },
  ru: { omoggle: 'Omoggle', pslTest: 'PSL тест', mogScore: 'Mog Score', analyzer: 'Анализ лица', guides: 'Гайды', blog: 'Блог', tryAi: 'Попробовать ИИ →' },
}

const NAV_ITEMS = [
  { key: 'omoggle', href: '/what-is-omoggle' },
  { key: 'pslTest', href: '/psl-test' },
  { key: 'mogScore', href: '/mog-score' },
  { key: 'analyzer', href: '/tools' },
  { key: 'guides', href: '/looksmaxxing-guide' },
  { key: 'blog', href: '/blog' },
]

// Routes that have a localized (/{lang}/...) counterpart.
const LOCALIZED_ROUTES = new Set(['/', '/tools', '/what-is-omoggle'])

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Derive language synchronously from the path so the SSR/SSG HTML already
  // contains the correct localized links (important for SEO crawlers).
  const parts = pathname.split('/').filter(Boolean)
  const currentLang = ['ja', 'pt', 'ru'].includes(parts[0]) ? parts[0] : 'en'
  const labels = NAV_LABELS[currentLang] || NAV_LABELS.en

  function localize(href) {
    if (currentLang === 'en') return href
    if (!LOCALIZED_ROUTES.has(href)) return href
    return href === '/' ? `/${currentLang}` : `/${currentLang}${href}`
  }

  const navLinks = NAV_ITEMS.map(item => ({
    href: localize(item.href),
    label: labels[item.key],
  }))
  const toolsHref = localize('/tools')

  function getLangUrl(langCode) {
    let page = pathname
    if (['ja','pt','ru'].includes(parts[0])) page = '/' + parts.slice(1).join('/')
    if (!page || page === '/') page = '/'
    if (langCode === 'en') return page || '/'
    return `/${langCode}${page === '/' ? '' : page}`
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link href={localize('/')} className="navbar-logo" aria-label="Omoggle IT home">
          Omoggle<span> IT</span>
        </Link>

        {/* Desktop nav */}
        <ul className="navbar-nav" role="list">
          {navLinks.map(l => (
            <li key={l.href}>
              <Link href={l.href} className={pathname === l.href ? 'active' : ''}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }} className="nav-auth-wrap">
          {/* Language switcher — desktop only */}
          <div style={{ display: 'flex', gap: '2px' }} className="lang-switcher-desktop">
            {LANGS.map(l => (
              <Link key={l.code} href={getLangUrl(l.code)}
                style={{
                  fontSize: '.68rem', letterSpacing: '.08em', padding: '3px 6px',
                  border: `1px solid ${currentLang === l.code ? 'var(--gold)' : 'var(--border)'}`,
                  borderRadius: '3px',
                  color: currentLang === l.code ? 'var(--gold)' : 'var(--text-muted)',
                  background: currentLang === l.code ? 'rgba(212,168,67,.1)' : 'none',
                  textDecoration: 'none',
                }}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="nav-guest-actions" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <Link href="/sign-in" style={{ fontSize: '.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Sign In</Link>
            <Link href="/sign-up" style={{ fontSize: '.8rem', border: '1px solid var(--border-md)', color: 'var(--gold)', padding: '.35rem .85rem', borderRadius: 'var(--r-sm)', whiteSpace: 'nowrap' }}>Sign Up</Link>
          </div>

          <Link href={toolsHref} className="btn btn-primary nav-cta nav-cta-desktop" style={{ fontSize: '.8rem', padding: '.4rem .85rem' }}>
            {labels.tryAi}
          </Link>

          {/* Hamburger button — mobile only */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <ul className={`navbar-nav mobile-open`} role="list">
            {navLinks.map(l => (
              <li key={l.href}>
                <Link href={l.href} className={pathname === l.href ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li style={{ padding: '.75rem 0 .5rem' }}>
              <Link href={toolsHref} className="btn btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center' }} onClick={() => setMenuOpen(false)}>
                {labels.tryAi}
              </Link>
            </li>
            {/* Language switcher in mobile menu */}
            <li style={{ display: 'flex', gap: '.4rem', padding: '.65rem 0', borderBottom: '1px solid var(--border)' }}>
              {LANGS.map(l => (
                <Link key={l.code} href={getLangUrl(l.code)}
                  style={{
                    fontSize: '.75rem', padding: '4px 10px',
                    border: `1px solid ${currentLang === l.code ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius: '3px',
                    color: currentLang === l.code ? 'var(--gold)' : 'var(--text-muted)',
                    background: currentLang === l.code ? 'rgba(212,168,67,.1)' : 'none',
                    textDecoration: 'none',
                  }}>
                  {l.label}
                </Link>
              ))}
            </li>
            <li style={{ display: 'flex', gap: '.5rem', padding: '.65rem 0' }}>
              <Link href="/sign-in" style={{ flex: 1, padding: '.65rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text-muted)', fontSize: '.9rem', textAlign: 'center' }}>Sign In</Link>
              <Link href="/sign-up" style={{ flex: 1, padding: '.65rem', background: 'var(--gold)', borderRadius: 'var(--r-sm)', color: '#0D1117', fontSize: '.9rem', fontWeight: 600, textAlign: 'center' }}>Sign Up Free</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  )
}
