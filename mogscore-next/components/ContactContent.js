'use client'

import { useState } from 'react'

const SUBJECT_LABELS = {
  general: 'General Question',
  tool: 'AI Tool Issue',
  content: 'Content / Article Feedback',
  advertising: 'Advertising Inquiry',
  privacy: 'Privacy / Data Request',
  other: 'Other',
}

function EmailCard({ icon, title, desc, email }) {
  return (
    <div className="contact-card" style={{
      background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
      padding: 'var(--sp-lg)', textAlign: 'center',
    }}>
      <span style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-sm)', display: 'block' }}>{icon}</span>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '.5rem', color: 'var(--gold)' }}>{title}</h3>
      <p style={{ fontSize: '.9rem', color: 'var(--text-muted)', marginBottom: 'var(--sp-sm)' }}>{desc}</p>
      <a href={`mailto:${email}`} style={{ color: 'var(--gold)', wordBreak: 'break-all' }}>{email}</a>
    </div>
  )
}

export default function ContactContent({ email }) {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const name = form.name.value.trim()
    const userEmail = form.email.value.trim()
    const subject = form.subject.value
    const message = form.message.value.trim()

    if (!name || !userEmail || !subject || !message) {
      alert('Please fill in all required fields.')
      return
    }

    const label = SUBJECT_LABELS[subject] || subject
    const mailSubject = encodeURIComponent('[MogScore] ' + label)
    const mailBody = encodeURIComponent(`Name: ${name}\nReply-to: ${userEmail}\n\n${message}`)
    window.location.href = `mailto:${email}?subject=${mailSubject}&body=${mailBody}`

    setLoading(true)
    setSent(true)

    if (typeof gtag !== 'undefined') {
      gtag('event', 'contact_form_submit', { event_category: 'engagement', event_label: subject })
    }
  }

  const cards = [
    { icon: '📧', title: 'General Inquiries', desc: 'Questions about our tools, content, or anything else.' },
    { icon: '💼', title: 'Advertising & Partnerships', desc: 'Interested in advertising or collaborating with MogScore?' },
    { icon: '🔒', title: 'Privacy & Data', desc: 'Questions about your data, privacy policy, or GDPR requests.' },
    { icon: '✍️', title: 'Content Submissions', desc: 'Want to contribute a guide, article, or streamer score update?' },
  ]

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--sp-lg)', marginTop: 'var(--sp-lg)' }}>
        {cards.map(c => (
          <EmailCard key={c.title} {...c} email={email} />
        ))}
      </div>

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-lg)', marginTop: 'var(--sp-lg)' }}>
        <h2 style={{ marginBottom: 'var(--sp-sm)' }}>Send Us a Message</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: 'var(--sp-md)' }}>
          Fill out the form below and we&apos;ll get back to you within 48 hours.
        </p>

        <form onSubmit={handleSubmit} style={{ opacity: sent ? 0.5 : 1, pointerEvents: sent ? 'none' : 'auto' }}>
          <div style={{ marginBottom: 'var(--sp-sm)' }}>
            <label htmlFor="name" style={{ display: 'block', fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '.4rem' }}>Your Name *</label>
            <input type="text" id="name" name="name" placeholder="John Smith" required style={inputStyle} />
          </div>
          <div style={{ marginBottom: 'var(--sp-sm)' }}>
            <label htmlFor="email" style={{ display: 'block', fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '.4rem' }}>Email Address *</label>
            <input type="email" id="email" name="email" placeholder="you@example.com" required style={inputStyle} />
          </div>
          <div style={{ marginBottom: 'var(--sp-sm)' }}>
            <label htmlFor="subject" style={{ display: 'block', fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '.4rem' }}>Subject *</label>
            <select id="subject" name="subject" required style={inputStyle}>
              <option value="">Select a topic...</option>
              <option value="general">General Question</option>
              <option value="tool">AI Tool Issue</option>
              <option value="content">Content / Article Feedback</option>
              <option value="advertising">Advertising Inquiry</option>
              <option value="privacy">Privacy / Data Request</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={{ marginBottom: 'var(--sp-sm)' }}>
            <label htmlFor="message" style={{ display: 'block', fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '.4rem' }}>Message *</label>
            <textarea id="message" name="message" placeholder="Tell us what's on your mind..." required style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            Send Message →
          </button>
          {sent && (
            <div style={{ display: 'block', background: 'rgba(63,185,80,.1)', border: '1px solid rgba(63,185,80,.3)', borderRadius: 'var(--r-md)', padding: 'var(--sp-md)', textAlign: 'center', color: 'var(--green)', marginTop: 'var(--sp-sm)' }}>
              Message sent! We&apos;ll get back to you within 48 hours.
            </div>
          )}
          <p style={{ fontSize: '.78rem', color: 'var(--text-dim)', marginTop: 'var(--sp-sm)', lineHeight: 1.6 }}>
            By submitting this form you agree to our <a href="/privacy-policy">Privacy Policy</a>. We do not share your information with third parties.
          </p>
        </form>
      </div>

      <div className="highlight-box" style={{ marginTop: 'var(--sp-lg)' }}>
        <p>Before contacting us, check our <a href="/omoggle-faq"><strong>FAQ page</strong></a> — most common questions are already answered there.</p>
      </div>
    </>
  )
}

const inputStyle = {
  width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
  padding: '.75rem 1rem', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '.9rem', outline: 'none',
}
