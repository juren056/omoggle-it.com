'use client'
import { useState, useRef, useEffect } from 'react'
import { SignOutButton, useUser } from '@clerk/nextjs'
import { createPortal } from 'react-dom'
import PointsDashboard from './PointsDashboard'

function ProfileModal({ onClose, user }) {
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    // Load current display name
    fetch('/api/points').then(r => r.json()).then(d => {
      if (d.display_name) setDisplayName(d.display_name)
    }).catch(() => {})
    return () => { document.body.style.overflow = '' }
  }, [])

  async function save() {
    if (displayName.trim().length < 2) return
    setSaving(true); setMsg('')
    const res = await fetch('/api/points', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'complete_profile', payload: { display_name: displayName.trim() } })
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) { setMsg('✅ 保存成功！首次设置获得10积分') }
    else { setMsg(data.error || '保存失败') }
  }

  if (!mounted) return null

  return createPortal(
    <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,.85)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', boxSizing: 'border-box' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg2)', border: '1px solid var(--border-md)', borderRadius: 'var(--r-lg)', width: '100%', maxWidth: 500, padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--gold)', margin: 0, letterSpacing: '.05em' }}>👤 编辑资料</h2>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '.3rem .8rem' }}>✕</button>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '.88rem', color: 'var(--text-muted)', display: 'block', marginBottom: '.5rem' }}>昵称</label>
          <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
            placeholder="输入你的昵称（2-20字）" maxLength={20}
            style={{ width: '100%', padding: '.85rem 1rem', background: 'var(--bg)', border: '1px solid var(--border-md)', borderRadius: 'var(--r-sm)', color: 'var(--text)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '.88rem', color: 'var(--text-muted)', display: 'block', marginBottom: '.5rem' }}>登录邮箱</label>
          <div style={{ padding: '.85rem 1rem', background: 'var(--bg3)', borderRadius: 'var(--r-sm)', fontSize: '.95rem', color: 'var(--text-muted)' }}>
            {user?.emailAddresses?.[0]?.emailAddress || '—'}
          </div>
        </div>

        {msg && (
          <div style={{ padding: '.85rem', borderRadius: 'var(--r-md)', background: msg.startsWith('✅') ? 'rgba(63,185,80,.1)' : 'rgba(248,81,73,.1)', color: msg.startsWith('✅') ? 'var(--green)' : '#F85149', fontSize: '.9rem', marginBottom: '1rem', textAlign: 'center' }}>
            {msg}
          </div>
        )}

        <div style={{ display: 'flex', gap: '.75rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '1rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem' }}>取消</button>
          <button onClick={save} disabled={saving || displayName.trim().length < 2}
            style={{ flex: 1, padding: '1rem', background: displayName.trim().length < 2 ? 'var(--bg3)' : 'var(--gold)', border: 'none', borderRadius: 'var(--r-sm)', cursor: displayName.trim().length < 2 ? 'not-allowed' : 'pointer', color: displayName.trim().length < 2 ? 'var(--text-muted)' : '#0D1117', fontSize: '1rem', fontFamily: 'var(--font-display)', letterSpacing: '.1em', opacity: saving ? .7 : 1 }}>
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function UserMenu() {
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const [showPoints, setShowPoints] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [userPoints, setUserPoints] = useState(0)
  const [subscription, setSubscription] = useState(null)
  const menuRef = useRef(null)

  const email = user?.emailAddresses?.[0]?.emailAddress || ''
  const name = user?.firstName || email.split('@')[0] || 'User'
  const initial = name[0]?.toUpperCase() || 'U'

  useEffect(() => {
    fetch('/api/points').then(r => r.json()).then(d => {
      if (d.points !== undefined) setUserPoints(d.points)
    }).catch(() => {})
    fetch('/api/subscription').then(r => r.json()).then(setSubscription).catch(() => {})
  }, [showPoints, open])

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function openBilling() {
    setOpen(false)
    if (subscription?.isPro || subscription?.hasBillingAccount) {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } else {
      window.location.href = '/pricing'
    }
  }

  return (
    <>
      <div style={{ position: 'relative' }} ref={menuRef}>
        <button onClick={() => setOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: '.5rem', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '.35rem .75rem', cursor: 'pointer', color: 'var(--text)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.82rem', fontWeight: 700, color: '#0D1117', flexShrink: 0 }}>{initial}</div>
          <span style={{ fontSize: '.82rem', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
          <span style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>▾</span>
        </button>

        {open && (
          <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', background: 'var(--bg2)', border: '1px solid var(--border-md)', borderRadius: 'var(--r-lg)', minWidth: 200, zIndex: 500, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.4)' }}>
            <div style={{ padding: '.85rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>{subscription?.isPro ? 'Pro' : '积分'}</span>
              {subscription?.isPro ? (
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--green)' }}>PRO ✓</span>
              ) : (
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)' }}>{userPoints}</span>
              )}
            </div>
            {[
              { label: subscription?.isPro ? '⚙ Manage Subscription' : '⭐ Upgrade to Pro', fn: openBilling },
              { label: '◈ 积分中心', fn: () => { setShowPoints(true); setOpen(false) } },
              { label: '👤 编辑资料', fn: () => { setShowProfile(true); setOpen(false) } },
            ].map(item => (
              <button key={item.label} onClick={item.fn}
                style={{ width: '100%', padding: '.8rem 1rem', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', textAlign: 'left', cursor: 'pointer', fontSize: '.9rem', color: 'var(--text)', display: 'block' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                {item.label}
              </button>
            ))}
            <SignOutButton>
              <button style={{ width: '100%', padding: '.8rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '.9rem', color: '#F85149' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                退出登录
              </button>
            </SignOutButton>
          </div>
        )}
      </div>

      {showPoints && <PointsDashboard onClose={() => setShowPoints(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} user={user} />}
    </>
  )
}
