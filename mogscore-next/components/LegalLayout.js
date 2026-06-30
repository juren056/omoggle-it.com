import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LegalLayout({ title, updated, children }) {
  return (
    <>
      <Navbar />
      <header style={{ padding: 'var(--sp-lg) 0 var(--sp-sm)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-sm">
          <nav style={{ fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '.75rem' }}>
            <a href="/" style={{ color: 'var(--gold)' }}>Home</a>
            <span style={{ margin: '0 .5rem' }}>›</span>
            <span>{title}</span>
          </nav>
          <h1>{title}</h1>
          {updated && (
            <p style={{ color: 'var(--text-muted)', marginTop: '.5rem' }}>Last updated: {updated}</p>
          )}
        </div>
      </header>
      <main className="section">
        <div className="container-sm">
          <article className="article-content">{children}</article>
        </div>
      </main>
      <Footer />
    </>
  )
}
