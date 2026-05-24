'use client'
import { useState, useRef, useEffect } from 'react'
import { SignOutButton, useUser } from '@clerk/nextjs'
import PointsDashboard from './PointsDashboard'

export default function UserMenu() {
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const [showPoints, setShowPoints] = useState(false)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [userPoints, setUserPoints] = useState(0)
  const menuRef = useRef(null)

  const name = displayName || user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'

  useEffect(() => {
    // Load points on mount
    fetch('/api/points').then(r => r.json()).then(d => {
      if (d.points !== undefined) {
        setUserPoints(d.points)
        if (d.display_name) setDisplayName(d.display_name)
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function saveProfile() {
    if (displayName.trim().length < 2) return
    setSaving(true)
    setMsg('')
    const res = await fetch('/api/points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'complete_profile', payload: { display_name: displayName.trim() } })
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setMsg('✅ 保存成功！获得10积分')
      setShowProfileEdit(false)
      setUserPoints(p => p + 10)
    } else {
      setMsg(data.error || '保存失败')
    }
  }

  return (
    <>
      <div style={{ position: 'relative' }} ref={menuRef}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: '.5rem', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '.35rem .75rem', cursor: 'pointer', color: 'var(--text)' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 700, color: '#0D1117', flexShrink: 0 }}>
            {name[0].toUpperCase()}
          </div>
          <span style={{ fontSize: '.82rem', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
          <span style={{ fontSize: '.7rem', color: 'var(--gold)' }}>▾</span>
        </button>

        {open && (
          <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: 'var(--bg2)', border: '1px solid var(--border-md)', borderRadius: 'var(--r-lg)', minWidth: 200, zIndex: 300, overflow: 'hidden' }}>
            {/* Points summary */}
            <div style={{ padding: '.85rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>积分</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)' }}>{userPoints}</span>
            </div>

            {/* Menu items */}
            {[
              { label: '◈ 积分中心', onClick: () => { setShowPoints(true); setOpen(false) } },
              { label: '👤 编辑资料', onClick: () => { setShowProfileEdit(true); setOpen(false) } },
            ].map(item => (
              <button key={item.label} onClick={item.onClick}
                style={{ width: '100%', padding: '.75rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '.88rem', color: 'var(--text)', borderBottom: '1px solid var(--border)', display: 'block' }}
                onMouseEnter={e => e.target.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.target.style.background = 'none'}>
                {item.label}
              </button>
            ))}

            <SignOutButton>
              <button style={{ width: '100%', padding: '.75rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '.88rem', color: '#F85149' }}
                onMouseEnter={e => e.target.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.target.style.background = 'none'}>
                退出登录
              </button>
            </SignOutButton>
          </div>
        )}
      </div>

      {/* Points Dashboard */}
      {showPoints && <PointsDashboard onClose={() => setShowPoints(false)} />}

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setShowProfileEdit(false)}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border-md)', borderRadius: 'var(--r-lg)', maxWidth: 400, width: '100%', padding: '1.5rem' }}
            onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold)', marginBottom: '1.25rem' }}>👤 编辑资料</h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '.4rem' }}>昵称</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="输入你的昵称（2-20字）"
                maxLength={20}
                style={{ width: '100%', padding: '.65rem .85rem', background: 'var(--bg)', border: '1px solid var(--border-md)', borderRadius: 'var(--r-sm)', color: 'var(--text)', fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '.75rem' }}>
              <label style={{ fontSize: '.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '.4rem' }}>登录邮箱</label>
              <div style={{ padding: '.65rem .85rem', background: 'var(--bg3)', borderRadius: 'var(--r-sm)', fontSize: '.88rem', color: 'var(--text-muted)' }}>
                {user?.emailAddresses?.[0]?.emailAddress || '—'}
              </div>
            </div>

            {msg && (
              <div style={{ padding: '.65rem', borderRadius: 'var(--r-sm)', background: msg.startsWith('✅') ? 'rgba(63,185,80,.1)' : 'rgba(248,81,73,.1)', color: msg.startsWith('✅') ? 'var(--green)' : '#F85149', fontSize: '.85rem', marginBottom: '.75rem', textAlign: 'center' }}>
                {msg}
              </div>
            )}

            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button onClick={() => setShowProfileEdit(false)}
                style={{ flex: 1, padding: '.7rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '.88rem' }}>
                取消
              </button>
              <button onClick={saveProfile}
                disabled={saving || displayName.trim().length < 2}
                style={{ flex: 1, padding: '.7rem', background: displayName.trim().length < 2 ? 'var(--bg3)' : 'var(--gold)', border: 'none', borderRadius: 'var(--r-sm)', cursor: displayName.trim().length < 2 ? 'not-allowed' : 'pointer', color: displayName.trim().length < 2 ? 'var(--text-muted)' : '#0D1117', fontSize: '.88rem', fontFamily: 'var(--font-display)', letterSpacing: '.1em' }}>
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
