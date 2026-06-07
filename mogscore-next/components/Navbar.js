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

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tools', label: 'Tools' },
  { href: '/blog', label: 'Blog' },
  { href: '/what-is-omoggle', label: 'Wiki' },
  { href: '/psl-scale-test', label: 'PSL Test' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { isSignedIn } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('en')

  useEffect(() => {
    const parts = pathname.split('/').filter(Boolean)
    if (['ja','pt','ru'].includes(parts[0])) setCurrentLang(parts[0])
    else setCurrentLang('en')
  }, [pathname])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  function getLangUrl(langCode) {
    const parts = pathname.split('/').filter(Boolean)
    let page = pathname
    if (['ja','pt','ru'].includes(parts[0])) page = '/' + parts.slice(1).join('/')
    if (!page || page === '/') page = '/'
    if (langCode === 'en') return page || '/'
    return `/${langCode}${page === '/' ? '' : page}`
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" aria-label="MogScore home">
          MogScore<span>.wiki</span>
        </Link>

        {/* Desktop nav */}
        <ul className="navbar-nav" role="list">
          {NAV_LINKS.map(l => (
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
            <>
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
            </>
          )}

          <Link href="/tools" className="btn btn-primary nav-cta" style={{ fontSize: '.8rem', padding: '.4rem .85rem' }}>
            Try AI →
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
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} className={pathname === l.href ? 'active' : ''}>
                  {l.label}
                </Link>
              </li>
            ))}
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
