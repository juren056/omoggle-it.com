'use client'
import { useState } from 'react'
import { useUser, SignInButton } from '@clerk/nextjs'
import { PLANS } from '@/lib/plans'
import { buildPaymentLinkUrl } from '@/lib/checkout-url'

async function startCheckoutSession(plan) {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  })
  const data = await res.json()
  if (data.url) window.location.href = data.url
  else throw new Error(data.error || 'Checkout failed')
}

async function openPortal() {
  const res = await fetch('/api/stripe/portal', { method: 'POST' })
  const data = await res.json()
  if (data.url) window.location.href = data.url
  else throw new Error(data.error || 'Could not open billing portal')
}

export default function PricingCards({ subscription, checkoutConfig, compact = false }) {
  const { isSignedIn, user } = useUser()
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')

  const isPro = subscription?.isPro
  const hasBilling = subscription?.hasBillingAccount

  const hasDirectPaymentLinks = Boolean(
    checkoutConfig?.paymentLinks?.monthly && checkoutConfig?.paymentLinks?.yearly
  )

  function redirectToPaymentLink(plan) {
    const link = plan === 'yearly'
      ? checkoutConfig.paymentLinks.yearly
      : checkoutConfig.paymentLinks.monthly
    const email = user?.emailAddresses?.[0]?.emailAddress
    window.location.assign(buildPaymentLinkUrl(link, { userId: user?.id, email }))
  }

  async function handleUpgrade(plan) {
    setError('')

    // Any available Payment Link should redirect immediately.
    // This avoids slow API fallback when env mode is mis-set or user hydration lags.
    if (hasDirectPaymentLinks) {
      redirectToPaymentLink(plan)
      return
    }

    setLoading(plan)
    try {
      await startCheckoutSession(plan)
    } catch (e) {
      setError(e.message)
      setLoading('')
    }
  }

  async function handleManage() {
    setError('')
    setLoading('portal')
    try {
      await openPortal()
    } catch (e) {
      setError(e.message)
      setLoading('')
    }
  }

  const cards = [
    { key: 'free', plan: PLANS.free, cta: null },
    { key: 'monthly', plan: PLANS.pro_monthly, cta: 'monthly' },
    { key: 'yearly', plan: PLANS.pro_yearly, cta: 'yearly', highlight: true },
  ]

  return (
    <div>
      {error && (
        <div style={{ background: 'rgba(248,81,73,.1)', border: '1px solid rgba(248,81,73,.3)', borderRadius: 'var(--r-md)', padding: '1rem', marginBottom: 'var(--sp-md)', color: '#F85149', fontSize: '.9rem', textAlign: 'center' }}>
          {error}
        </div>
      )}
      <div className="grid-3" style={compact ? { gap: 'var(--sp-sm)' } : undefined}>
        {cards.map(({ key, plan, cta, highlight }) => (
          <article key={key} className="tool-card" style={{
            borderColor: highlight ? 'var(--border-md)' : undefined,
            position: 'relative',
          }}>
            {highlight && (
              <span className="tool-badge new" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>Best Value</span>
            )}
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '.5rem' }}>{plan.name}</h3>
            <div style={{ marginBottom: '1rem' }}>
              {plan.price === 0 ? (
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--gold)' }}>Free</span>
              ) : (
                <>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--gold)' }}>${plan.price}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}> / {plan.interval}</span>
                </>
              )}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', flex: 1 }}>
              {plan.features.map(f => (
                <li key={f} style={{ fontSize: '.88rem', color: 'var(--text-muted)', marginBottom: '.5rem', paddingLeft: '1.2rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--gold)' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            {!cta ? (
              <span style={{ fontSize: '.82rem', color: 'var(--text-dim)', textAlign: 'center' }}>Current tier for new users</span>
            ) : isPro ? (
              <button onClick={handleManage} disabled={!!loading} className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>
                {loading === 'portal' ? 'Opening…' : 'Manage Subscription'}
              </button>
            ) : !isSignedIn ? (
              <SignInButton mode="modal">
                <button className="btn btn-primary" style={{ width: '100%' }}>Sign In to Upgrade</button>
              </SignInButton>
            ) : (
              <button
                onClick={() => handleUpgrade(cta)}
                disabled={!!loading}
                className={highlight ? 'btn btn-primary' : 'btn btn-outline'}
                style={{ width: '100%', textAlign: 'center' }}
              >
                {loading === cta ? 'Redirecting…' : `Upgrade — ${plan.name}`}
              </button>
            )}
          </article>
        ))}
      </div>
      {isPro && hasBilling && (
        <p style={{ textAlign: 'center', marginTop: 'var(--sp-md)', fontSize: '.85rem', color: 'var(--text-muted)' }}>
          Cancel anytime from{' '}
          <button onClick={handleManage} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', textDecoration: 'underline', padding: 0, font: 'inherit' }}>
            Manage Subscription
          </button>
          . Access continues until the end of your billing period.
        </p>
      )}
    </div>
  )
}
