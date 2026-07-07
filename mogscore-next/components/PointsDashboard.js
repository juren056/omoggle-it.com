'use client'
import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import Modal from './Modal'

export default function PointsDashboard({ onClose }) {
  const { isSignedIn, isLoaded } = useUser()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState('')
  const [message, setMessage] = useState({ text: '', ok: true })
  const [displayName, setDisplayName] = useState('')
  const [showProfileInput, setShowProfileInput] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [loadError, setLoadError] = useState('')

  const fetchPoints = useCallback(async () => {
    setLoading(true)
    setAuthError(false)
    setLoadError('')
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const res = await fetch('/api/points', { signal: controller.signal, credentials: 'same-origin' })
      clearTimeout(timeout)
      const json = await res.json().catch(() => ({}))
      if (res.status === 401) {
        setAuthError(true)
      } else if (!res.ok) {
        setLoadError(json.error || `Failed to load (${res.status})`)
      } else {
        setData(json)
        if (json.display_name) setDisplayName(json.display_name)
      }
    } catch (err) {
      setLoadError(err.name === 'AbortError' ? 'Request timed out. Please try again.' : 'Network error. Please try again.')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      setLoading(false)
      return
    }
    fetchPoints()
  }, [isLoaded, isSignedIn, fetchPoints])

  async function doAction(action, payload = {}) {
    setActionLoading(action)
    setMessage({ text: '', ok: true })
    try {
      const res = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ action, payload }),
      })
      const result = await res.json().catch(() => ({}))
      if (res.ok) {
        setMessage({ text: result.message || '✅ Success', ok: true })
        if (action === 'complete_profile') setShowProfileInput(false)
        await fetchPoints()
      } else {
        setMessage({ text: result.error || 'Action failed', ok: false })
      }
    } catch {
      setMessage({ text: 'Network error', ok: false })
    }
    setActionLoading('')
  }

  async function handleShare() {
    const text = 'I just got my MogScore on the free AI Face Analyzer! 👀'
    const url = 'https://omoggle-it.com/tools'
    let shared = false
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My MogScore', text, url })
        shared = true
      } catch (e) {
        if (e.name !== 'AbortError') {
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
          shared = window.confirm('Click OK after sharing to claim your points')
        }
      }
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
      shared = window.confirm('Did you post it? Click OK to claim 10 points')
    }
    if (shared) await doAction('share_result')
  }

  if (!isLoaded) {
    return (
      <Modal onClose={onClose} maxWidth={460}>
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      </Modal>
    )
  }

  if (!isSignedIn) {
    return (
      <Modal onClose={onClose} maxWidth={460}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }}>Points</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Sign in to use the points system</p>
          <a href="/sign-up" style={{ display: 'inline-block', padding: '1rem 2rem', background: 'var(--gold)', color: '#0D1117', borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '.1em', textDecoration: 'none' }}>Sign Up Free →</a>
        </div>
      </Modal>
    )
  }

  return (
    <Modal onClose={onClose} maxWidth={520}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 1.5rem 1.1rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '.05em', color: 'var(--gold)', margin: 0 }}>◈ Points Center</h2>
        <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '.3rem .8rem', lineHeight: 1 }}>✕</button>
      </div>

      <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
        ) : authError ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Your session has expired. Please refresh and try again.</p>
            <button onClick={fetchPoints} style={{ padding: '.75rem 1.5rem', background: 'var(--gold)', border: 'none', borderRadius: 'var(--r-sm)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#0D1117' }}>Retry</button>
          </div>
        ) : loadError ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#F85149', marginBottom: '1rem', lineHeight: 1.6 }}>{loadError}</p>
            <button onClick={fetchPoints} style={{ padding: '.75rem 1.5rem', background: 'var(--gold)', border: 'none', borderRadius: 'var(--r-sm)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#0D1117' }}>Retry</button>
          </div>
        ) : (
          <>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '.72rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.5rem' }}>Current Points</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', color: 'var(--gold)', lineHeight: 1 }}>{data?.points ?? 0}</div>
                <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginTop: '.4rem' }}>{data?.total_earned ?? 0} points earned in total</div>
              </div>
              <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--green)' }}>{data?.extra_uses ?? 0}</div>
                  <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>Extra Analyses</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--gold)' }}>10 pts</div>
                  <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>per analysis</div>
                </div>
              </div>
            </div>

            <button onClick={() => doAction('redeem_use')} disabled={!!actionLoading || (data?.points ?? 0) < 10}
              style={{ width: '100%', padding: '1rem', background: (data?.points ?? 0) < 10 ? 'var(--bg3)' : 'var(--gold)', color: (data?.points ?? 0) < 10 ? 'var(--text-muted)' : '#0D1117', border: 'none', borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '.1em', cursor: (data?.points ?? 0) < 10 ? 'not-allowed' : 'pointer', marginBottom: '1rem' }}>
              {actionLoading === 'redeem_use' ? 'Redeeming...' : '⚡ Redeem 10 points for 1 extra analysis'}
            </button>

            {message.text && (
              <div style={{ padding: '.85rem', borderRadius: 'var(--r-md)', background: message.ok ? 'rgba(63,185,80,.1)' : 'rgba(248,81,73,.1)', border: `1px solid ${message.ok ? 'rgba(63,185,80,.3)' : 'rgba(248,81,73,.3)'}`, color: message.ok ? 'var(--green)' : '#F85149', fontSize: '.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                {message.text}
              </div>
            )}

            <div style={{ fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.75rem' }}>Earn points by completing tasks</div>

            {[
              { id: 'daily_checkin', icon: '📅', label: 'Daily Check-in', desc: 'Check in once per day', pts: 5, done: data?.checked_in_today },
              { id: 'share_result', icon: '🔗', label: 'Share Result', desc: 'Share on Twitter/X (once per day)', pts: 10, done: data?.shared_today, customAction: handleShare },
              { id: 'complete_profile', icon: '👤', label: 'Complete Profile', desc: 'Set a display name (one-time)', pts: 10, done: data?.profile_complete },
            ].map(task => (
              <div key={task.id} style={{ background: 'var(--bg3)', borderRadius: 'var(--r-md)', padding: '1rem', marginBottom: '.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
                  <div style={{ fontSize: '1.6rem', flexShrink: 0 }}>{task.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '.95rem', fontWeight: 500, color: 'var(--text)' }}>{task.label}</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{task.desc}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '.88rem', color: 'var(--gold)', fontWeight: 600 }}>+{task.pts} pts</span>
                    <button
                      onClick={() => task.customAction ? task.customAction() : task.id === 'complete_profile' ? setShowProfileInput(v => !v) : doAction(task.id)}
                      disabled={task.done || !!actionLoading}
                      style={{ padding: '.5rem 1.1rem', border: 'none', borderRadius: 'var(--r-sm)', fontSize: '.88rem', fontWeight: 500, cursor: task.done ? 'not-allowed' : 'pointer', background: task.done ? 'var(--bg)' : 'var(--gold)', color: task.done ? 'var(--text-muted)' : '#0D1117', whiteSpace: 'nowrap' }}>
                      {actionLoading === task.id ? '...' : task.done ? '✓ Done' : task.id === 'complete_profile' ? (showProfileInput ? 'Cancel' : 'Set') : 'Claim'}
                    </button>
                  </div>
                </div>

                {task.id === 'complete_profile' && showProfileInput && !task.done && (
                  <div style={{ display: 'flex', gap: '.5rem', marginTop: '.75rem' }}>
                    <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                      placeholder="Enter name (2-20 chars)" maxLength={20}
                      style={{ flex: 1, padding: '.65rem .85rem', background: 'var(--bg)', border: '1px solid var(--border-md)', borderRadius: 'var(--r-sm)', color: 'var(--text)', fontSize: '.9rem', outline: 'none' }} />
                    <button onClick={() => doAction('complete_profile', { display_name: displayName })}
                      disabled={actionLoading === 'complete_profile' || displayName.trim().length < 2}
                      style={{ padding: '.65rem 1.1rem', background: 'var(--gold)', border: 'none', borderRadius: 'var(--r-sm)', cursor: 'pointer', color: '#0D1117', fontWeight: 600, fontSize: '.9rem', opacity: displayName.trim().length < 2 ? .5 : 1 }}>
                      {actionLoading === 'complete_profile' ? '...' : 'Confirm'}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {data?.logs?.filter(l => l.points !== 0).length > 0 && (
              <div style={{ marginTop: '.5rem' }}>
                <div style={{ fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.75rem' }}>Recent Activity</div>
                {data.logs.filter(l => l.points !== 0).slice(0, 5).map((log, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{log.description}</span>
                    <span style={{ color: log.points > 0 ? 'var(--green)' : '#F85149', fontWeight: 600 }}>{log.points > 0 ? '+' : ''}{log.points}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
