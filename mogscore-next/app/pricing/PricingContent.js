'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PricingCards from '@/components/PricingCards'
import { getContactEmail } from '@/lib/contact'

export default function PricingContent() {
  const supportEmail = getContactEmail()
  const { isSignedIn } = useUser()
  const searchParams = useSearchParams()
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    fetch('/api/subscription')
      .then(r => r.json())
      .then(setSubscription)
      .catch(() => {})
  }, [isSignedIn])

  // Payment Link returns before webhook finishes — poll until Pro is active
  useEffect(() => {
    if (!success || !isSignedIn) return undefined
    let attempts = 0
    const poll = setInterval(async () => {
      try {
        const r = await fetch('/api/subscription')
        const data = await r.json()
        setSubscription(data)
        if (data.isPro || ++attempts >= 15) clearInterval(poll)
      } catch {
        attempts += 1
        if (attempts >= 15) clearInterval(poll)
      }
    }, 2000)
    return () => clearInterval(poll)
  }, [success, isSignedIn])

  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  return (
    <>
      <Navbar />
      <header className="hero" style={{ paddingBottom: 'var(--sp-md)' }}>
        <div className="container">
          <span className="hero-eyebrow">Simple Pricing</span>
          <h1>MogScore <em>Pro</em> Plans</h1>
          <p className="hero-sub">
            AI face analysis for entertainment and looksmaxxing. Free tier included — upgrade for unlimited daily analyses.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {success && (
            <div className="highlight-box" style={{ marginBottom: 'var(--sp-md)', textAlign: 'center' }}>
              <p style={{ margin: 0, color: 'var(--green)' }}>Payment successful! Your Pro access is now active.</p>
            </div>
          )}
          {canceled && (
            <div className="highlight-box" style={{ marginBottom: 'var(--sp-md)', textAlign: 'center' }}>
              <p style={{ margin: 0 }}>Checkout canceled. You can upgrade anytime.</p>
            </div>
          )}

          <PricingCards subscription={subscription} />

          <div className="article-content" style={{ marginTop: 'var(--sp-xl)' }}>
            <h2>What You Get</h2>
            <p>
              MogScore Pro unlocks unlimited AI face analyses on our{' '}
              <a href="/tools">Face Analyzer</a> and <a href="/tools#battle">1v1 Mog Battle</a> tools.
              All scores are for entertainment only — not medical or professional assessments.
            </p>

            <h2>Billing & Cancellation</h2>
            <ul>
              <li>Payments are processed securely by <strong>Stripe</strong>.</li>
              <li>Subscriptions renew automatically until canceled.</li>
              <li>Cancel anytime from your account menu or the Manage Subscription button above.</li>
              <li>See our <a href="/refund-policy">Refund Policy</a> for refund eligibility.</li>
            </ul>

            <h2>Support</h2>
            <p>
              Questions about billing? Email{' '}
              {supportEmail ? (
                <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
              ) : (
                <em>support email not configured</em>
              )}{' '}
              or visit our{' '}
              <a href="/contact">Contact page</a>. We respond within 3 business days.
            </p>

            <p style={{ fontSize: '.85rem', color: 'var(--text-dim)', marginTop: 'var(--sp-lg)' }}>
              MogScore.wiki is an independent product and is not affiliated with Omoggle LLC or any AI model provider.
              Prices shown in USD. Taxes may apply depending on your location.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
