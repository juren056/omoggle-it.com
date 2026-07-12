'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import UserMenu from './UserMenu'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JP' },
  { code: 'pt', label: 'PT' },
  { code: 'ru', label: 'RU' },
]

// Localized labels per language; only routes that have a localized version are
// prefixed with /{lang} (see LOCALIZED_ROUTES). Others stay on the English route.
const NAV_LABELS = {
  en: { home: 'Home', tools: 'Tools', pricing: 'Pricing', blog: 'Blog', wiki: 'Wiki', pslTest: 'PSL Test', tryAi: 'Try AI →' },
  ja: { home: 'ホーム', tools: 'ツール', pricing: '料金', blog: 'ブログ', wiki: 'Wiki', pslTest: 'PSLテスト', tryAi: 'AIを試す →' },
  pt: { home: 'Início', tools: 'Ferramentas', pricing: 'Preços', blog: 'Blog', wiki: 'Wiki', pslTest: 'Teste PSL', tryAi: 'Testar IA →' },
  ru: { home: 'Главная', tools: 'Инструменты', pricing: 'Цены', blog: 'Блог', wiki: 'Вики', pslTest: 'PSL тест', tryAi: 'Попробовать ИИ →' },
}

const NAV_ITEMS = [
  { key: 'home', href: '/' },
  { key: 'tools', href: '/tools' },
  { key: 'pricing', href: '/pricing' },
  { key: 'blog', href: '/blog' },
  { key: 'wiki', href: '/what-is-omoggle' },
  { key: 'pslTest', href: '/psl-scale-test' },
]

// Routes that have a localized (/{lang}/...) counterpart.
const LOCALIZED_ROUTES = new Set(['/', '/tools', '/what-is-omoggle'])

export default function Navbar() {
  const pathname = usePathname()
  const { isSignedIn } = useUser()
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

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

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
        <Link href={localize('/')} className="navbar-logo" aria-label="MogScore home">
          MogScore<span>.wiki</span>
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

          {/* Auth */}
          {isSignedIn ? (
            <UserMenu />
          ) : (
            <div className="nav-guest-actions" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <SignInButton mode="modal">
                <button style={{ fontSize: '.8rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{ fontSize: '.8rem', background: 'none', border: '1px solid var(--border-md)', color: 'var(--gold)', padding: '.35rem .85rem', borderRadius: 'var(--r-sm)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}

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
                <Link href={l.href} className={pathname === l.href ? 'active' : ''}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li style={{ padding: '.75rem 0 .5rem' }}>
              <Link href={toolsHref} className="btn btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center' }}>
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
            {!isSignedIn && (
              <li style={{ display: 'flex', gap: '.5rem', padding: '.65rem 0' }}>
                <SignInButton mode="modal">
                  <button style={{ flex: 1, padding: '.65rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '.9rem' }}>
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button style={{ flex: 1, padding: '.65rem', background: 'var(--gold)', border: 'none', borderRadius: 'var(--r-sm)', color: '#0D1117', cursor: 'pointer', fontSize: '.9rem', fontWeight: 600 }}>
                    Sign Up Free
                  </button>
                </SignUpButton>
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  )
}
