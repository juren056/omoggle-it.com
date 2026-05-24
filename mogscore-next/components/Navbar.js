'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import UserMenu from './UserMenu'

const LANGS = [
  { code: 'en', label: 'EN', path: '' },
  { code: 'ja', label: 'JP', path: '/ja' },
  { code: 'pt', label: 'PT', path: '/pt' },
  { code: 'ru', label: 'RU', path: '/ru' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { isSignedIn } = useUser()
  const [currentLang, setCurrentLang] = useState('en')

  useEffect(() => {
    const parts = pathname.split('/').filter(Boolean)
    if (['ja','pt','ru'].includes(parts[0])) setCurrentLang(parts[0])
    else setCurrentLang('en')
  }, [pathname])

  function getLangUrl(langCode) {
    const parts = pathname.split('/').filter(Boolean)
    let page = pathname
    if (['ja','pt','ru'].includes(parts[0])) {
      page = '/' + parts.slice(1).join('/')
    }
    if (!page || page === '/') page = '/'
    if (langCode === 'en') return page || '/'
    return `/${langCode}${page === '/' ? '' : page}`
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">MogScore<span>.wiki</span></Link>

        <ul className="navbar-nav">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/tools">Tools</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/what-is-omoggle">Wiki</Link></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          {/* Language switcher */}
          <div style={{ display: 'flex', gap: '2px' }}>
            {LANGS.map(l => (
              <Link key={l.code} href={getLangUrl(l.code)}
                style={{
                  fontSize: '.68rem', letterSpacing: '.08em', padding: '3px 7px',
                  border: `1px solid ${currentLang === l.code ? 'var(--gold)' : 'var(--border)'}`,
                  borderRadius: '3px',
                  color: currentLang === l.code ? 'var(--gold)' : 'var(--text-muted)',
                  background: currentLang === l.code ? 'rgba(212,168,67,.1)' : 'none',
                  textDecoration: 'none', transition: 'all .15s'
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
                <button style={{ fontSize: '.82rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{ fontSize: '.82rem', background: 'none', border: '1px solid var(--border-md)', color: 'var(--gold)', padding: '.38rem .9rem', borderRadius: 'var(--r-sm)', cursor: 'pointer' }}>
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}

          <Link href="/tools" className="btn btn-primary" style={{ fontSize: '.82rem', padding: '.4rem .9rem' }}>
            Try AI →
          </Link>
        </div>
      </div>
    </nav>
  )
}
