'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, SignOutButton, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

const LANGS = [
  { code: 'en', label: 'EN', path: '' },
  { code: 'ja', label: 'JP', path: '/ja' },
  { code: 'pt', label: 'PT', path: '/pt' },
  { code: 'ru', label: 'RU', path: '/ru' },
]

const I18N_PAGES = ['', 'tools', 'what-is-omoggle']

export default function Navbar() {
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()
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
    if (page === '' || page === '/') page = '/'
    const slug = page.replace(/^\//, '') || ''
    const isI18nPage = I18N_PAGES.includes(slug) || slug === ''
    if (!isI18nPage) return langCode === 'en' ? page : page
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
        <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
          {/* Language switcher */}
          <div style={{display:'flex',gap:'3px'}}>
            {LANGS.map(l => (
              <Link key={l.code} href={getLangUrl(l.code)}
                onClick={() => { try { localStorage.setItem('preferred_lang', l.code) } catch(e){} }}
                style={{
                  fontSize:'.7rem',letterSpacing:'.1em',padding:'3px 7px',
                  border:`1px solid ${currentLang===l.code ? 'var(--gold)' : 'var(--border)'}`,
                  borderRadius:'3px',
                  color: currentLang===l.code ? 'var(--gold)' : 'var(--text-muted)',
                  background: currentLang===l.code ? 'rgba(212,168,67,.1)' : 'none',
                  textDecoration:'none',transition:'all .15s'
                }}>
                {l.label}
              </Link>
            ))}
          </div>
          {isSignedIn ? (
            <>
              <span className="user-limit-badge">10/day ✓</span>
              <span style={{fontSize:'.82rem',color:'var(--text-muted)'}}>
                {user?.firstName || 'User'}
              </span>
              <SignOutButton>
                <button style={{fontSize:'.78rem',color:'var(--text-muted)',background:'none',border:'1px solid var(--border)',padding:'.3rem .75rem',borderRadius:'var(--r-sm)',cursor:'pointer'}}>
                  Sign Out
                </button>
              </SignOutButton>
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button style={{fontSize:'.82rem',color:'var(--text-muted)',background:'none',border:'none',cursor:'pointer'}}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{fontSize:'.82rem',background:'none',border:'1px solid var(--border-md)',color:'var(--gold)',padding:'.4rem 1rem',borderRadius:'var(--r-sm)',cursor:'pointer'}}>
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
          <Link href="/tools" className="btn btn-primary" style={{fontSize:'.82rem',padding:'.4rem .9rem'}}>
            Try AI →
          </Link>
        </div>
      </div>
    </nav>
  )
}
