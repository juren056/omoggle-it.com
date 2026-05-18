'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, SignOutButton, SignIn, useUser } from '@clerk/nextjs'

export default function Navbar() {
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">MogScore<span>.wiki</span></Link>
        <ul className="navbar-nav">
          <li><Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link></li>
          <li><Link href="/tools" className={pathname === '/tools' ? 'active' : ''}>Tools</Link></li>
          <li><Link href="/blog" className={pathname === '/blog' ? 'active' : ''}>Blog</Link></li>
          <li><Link href="/what-is-omoggle" className={pathname === '/what-is-omoggle' ? 'active' : ''}>Wiki</Link></li>
        </ul>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          {isSignedIn ? (
            <>
              <span className="user-limit-badge">10/day ✓</span>
              <span style={{fontSize:'.82rem',color:'var(--text-muted)'}}>
                {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
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
                <button style={{fontSize:'.82rem',color:'var(--text-muted)',background:'none',border:'none',cursor:'pointer',letterSpacing:'.05em'}}>
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
          <Link href="/tools" className="btn btn-primary" style={{fontSize:'.85rem',padding:'.45rem 1rem'}}>
            Try AI →
          </Link>
        </div>
      </div>
    </nav>
  )
}
