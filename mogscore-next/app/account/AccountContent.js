'use client'

import { useEffect, useState } from 'react'

export default function AccountContent() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [opening, setOpening] = useState(false)
  useEffect(() => { fetch('/api/subscription').then(async response => {
    const body = await response.json(); if (!response.ok) throw new Error(body.error || 'Could not load account')
    setData(body)
  }).catch(failure => setError(failure.message)) }, [])
  async function billing() {
    setOpening(true); setError('')
    try { const response = await fetch('/api/stripe/portal', { method: 'POST' }); const body = await response.json(); if (!response.ok) throw new Error(body.error || 'Could not open billing'); window.location.assign(body.url) }
    catch (failure) { setError(failure.message); setOpening(false) }
  }
  if (error) return <p className="rating-error" role="alert">{error}</p>
  if (!data) return <p role="status">Loading membership…</p>
  return <section className="card"><div className="card-body"><h2>{data.isPro ? 'Legacy Pro access active' : 'No active legacy subscription'}</h2><p>Status: <strong>{data.status || 'inactive'}</strong></p>{data.isPro || data.hasBillingAccount ? <button type="button" className="btn btn-primary" onClick={billing} disabled={opening}>{opening ? 'Opening…' : 'Manage billing or cancel'}</button> : <p>New subscriptions are currently closed. The free local tools do not require a plan.</p>}</div></section>
}
