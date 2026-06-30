import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactContent from '@/components/ContactContent'
import { getContactEmail } from '@/lib/contact'

export const metadata = {
  title: 'Contact MogScore.wiki | Omoggle Guide & PSL Scale',
  description: 'Contact the MogScore team for questions about our free AI face analyzer, PSL Scale content, looksmaxxing guides, advertising, or partnership inquiries.',
  alternates: { canonical: 'https://omoggle-it.com/contact' },
}

export default function ContactPage() {
  const email = getContactEmail()

  return (
    <>
      <Navbar />
      <header style={{ padding: 'var(--sp-lg) 0 var(--sp-sm)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-sm">
          <nav style={{ fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '.75rem' }}>
            <a href="/" style={{ color: 'var(--gold)' }}>Home</a>
            <span style={{ margin: '0 .5rem' }}>›</span>
            <span>Contact</span>
          </nav>
          <h1>Contact Us</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '.5rem', maxWidth: 500 }}>
            Have a question, suggestion, or want to work with us? We&apos;d love to hear from you.
          </p>
        </div>
      </header>
      <main className="section">
        <div className="container-sm">
          {email ? (
            <ContactContent email={email} />
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>
              Contact email is not configured. Please set <code>SUPPORT_EMAIL</code> or{' '}
              <code>NEXT_PUBLIC_CONTACT_EMAIL</code> in your environment variables.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
