'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export default function PointsDashboard({ onClose }) {
  const { isSignedIn, user } = useUser()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState('')
  const [message, setMessage] = useState({ text: '', ok: true })
  const [displayName, setDisplayName] = useState('')
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [authError, setAuthError] = useState(false)

  useEffect(() => {
    if (isSignedIn) fetchPoints()
  }, [isSignedIn])

  async function fetchPoints() {
    setLoading(true)
    setAuthError(false)
    try {
      const res = await fetch('/api/points')
      const json = await res.json()
      if (res.status === 401) {
        setAuthError(true)
      } else if (res.ok) {
        setData(json)
        if (json.display_name) setDisplayName(json.display_name)
      }
    } catch {}
    setLoading(false)
  }

  async function doAction(action, payload = {}) {
    setActionLoading(action)
    setMessage({ text: '', ok: true })
    try {
      const res = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      })
      const result = await res.json()
      if (res.ok && result.success) {
        setMessage({ text: result.message || '✅ 操作成功', ok: true })
        if (action === 'complete_profile') setShowProfileForm(false)
        await fetchPoints()
      } else {
        setMessage({ text: result.error || '操作失败', ok: false })
      }
    } catch {
      setMessage({ text: '网络错误，请重试', ok: false })
    }
    setActionLoading('')
  }

  // Share result — opens share dialog then awards points
  async function handleShare() {
    const shareText = `I just got scored on MogScore.wiki — the free AI face analyzer! Check your own score 👀`
    const shareUrl = 'https://omoggle-it.com/tools'

    // Try native share API first
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My MogScore', text: shareText, url: shareUrl })
        await doAction('share_result')
      } catch (e) {
        if (e.name !== 'AbortError') {
          // User cancelled or share failed, open Twitter instead
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
          await doAction('share_result')
        }
      }
    } else {
      // Fallback: open Twitter
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
      // Award points after a short delay (assume they shared)
      setTimeout(() => doAction('share_result'), 1500)
    }
  }

  if (!isSignedIn) {
    return (
      <div style={S.overlay} onClick={onClose}>
        <div style={S.box} onClick={e => e.stopPropagation()}>
          <div style={S.header}>
            <h2 style={S.title}>◈ 积分中心</h2>
            <button onClick={onClose} style={S.closeBtn}>✕</button>
          </div>
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>登录后可使用积分系统，获得更多分析次数</p>
            <a href="/sign-up" style={{ ...S.btn, display: 'inline-block', textDecoration: 'none' }}>免费注册 →</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.box} onClick={e => e.stopPropagation()}>
        <div style={S.header}>
          <h2 style={S.title}>◈ 积分中心</h2>
          <button onClick={onClose} style={S.closeBtn}>✕</button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>
        ) : authError ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Session 验证失败，请重新登录</p>
            <button onClick={fetchPoints} style={S.btn}>重试</button>
          </div>
        ) : (
          <div style={{ padding: '1.25rem', overflowY: 'auto', maxHeight: '72vh' }}>

            {/* Points card */}
            <div style={S.pointsCard}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.4rem' }}>当前积分</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', color: 'var(--gold)', lineHeight: 1 }}>{data?.points ?? 0}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: '.3rem' }}>累计获得 {data?.total_earned ?? 0} 分</div>
              </div>
              <div style={S.divider} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--green)' }}>{data?.extra_uses ?? 0}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>额外分析次数</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--gold)' }}>10</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>积分换1次</div>
                </div>
              </div>
            </div>

            {/* Redeem */}
            <button
              onClick={() => doAction('redeem_use')}
              disabled={!!actionLoading || (data?.points ?? 0) < 10}
              style={{ ...S.btn, width: '100%', marginBottom: '1rem', opacity: (data?.points ?? 0) < 10 ? .4 : 1, cursor: (data?.points ?? 0) < 10 ? 'not-allowed' : 'pointer' }}>
              {actionLoading === 'redeem_use' ? '兑换中...' : '⚡ 用10分兑换1次额外分析'}
            </button>

            {/* Message */}
            {message.text && (
              <div style={{ background: message.ok ? 'rgba(63,185,80,.1)' : 'rgba(248,81,73,.1)', border: `1px solid ${message.ok ? 'rgba(63,185,80,.3)' : 'rgba(248,81,73,.3)'}`, borderRadius: 'var(--r-md)', padding: '.75rem 1rem', fontSize: '.85rem', color: message.ok ? 'var(--green)' : '#F85149', marginBottom: '1rem', textAlign: 'center' }}>
                {message.text}
              </div>
            )}

            {/* Tasks */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.75rem' }}>完成任务获取积分</div>

              {/* Daily checkin */}
              <div style={S.taskRow}>
                <div style={{ fontSize: '1.4rem' }}>📅</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.9rem', fontWeight: 500, color: 'var(--text)' }}>每日签到</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>每天登录签到一次</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '.82rem', color: 'var(--gold)', fontWeight: 500 }}>+5分</span>
                  <button
                    onClick={() => doAction('daily_checkin')}
                    disabled={!!actionLoading || data?.checked_in_today}
                    style={{ ...S.taskBtn, background: data?.checked_in_today ? 'var(--bg3)' : 'var(--gold)', color: data?.checked_in_today ? 'var(--text-muted)' : '#0D1117', cursor: data?.checked_in_today ? 'not-allowed' : 'pointer' }}>
                    {actionLoading === 'daily_checkin' ? '...' : data?.checked_in_today ? '✓ 已签到' : '签到'}
                  </button>
                </div>
              </div>

              {/* Share result */}
              <div style={S.taskRow}>
                <div style={{ fontSize: '1.4rem' }}>🔗</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.9rem', fontWeight: 500, color: 'var(--text)' }}>分享结果</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>分享到 Twitter/X（每天一次）</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '.82rem', color: 'var(--gold)', fontWeight: 500 }}>+10分</span>
                  <button
                    onClick={handleShare}
                    disabled={!!actionLoading || data?.shared_today}
                    style={{ ...S.taskBtn, background: data?.shared_today ? 'var(--bg3)' : 'var(--gold)', color: data?.shared_today ? 'var(--text-muted)' : '#0D1117', cursor: data?.shared_today ? 'not-allowed' : 'pointer' }}>
                    {actionLoading === 'share_result' ? '...' : data?.shared_today ? '✓ 已分享' : '分享'}
                  </button>
                </div>
              </div>

              {/* Complete profile */}
              <div style={{ ...S.taskRow, flexDirection: 'column', alignItems: 'stretch', gap: '.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                  <div style={{ fontSize: '1.4rem' }}>👤</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '.9rem', fontWeight: 500, color: 'var(--text)' }}>完善个人资料</div>
                    <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>设置你的昵称（一次性）</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '.82rem', color: 'var(--gold)', fontWeight: 500 }}>+10分</span>
                    <button
                      onClick={() => !data?.profile_complete && setShowProfileForm(f => !f)}
                      disabled={data?.profile_complete}
                      style={{ ...S.taskBtn, background: data?.profile_complete ? 'var(--bg3)' : 'var(--gold)', color: data?.profile_complete ? 'var(--text-muted)' : '#0D1117', cursor: data?.profile_complete ? 'not-allowed' : 'pointer' }}>
                      {data?.profile_complete ? '✓ 已完成' : showProfileForm ? '取消' : '设置'}
                    </button>
                  </div>
                </div>

                {showProfileForm && !data?.profile_complete && (
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="输入你的昵称（2-20字）"
                      maxLength={20}
                      style={{ flex: 1, padding: '.5rem .75rem', background: 'var(--bg)', border: '1px solid var(--border-md)', borderRadius: 'var(--r-sm)', color: 'var(--text)', fontSize: '.88rem', outline: 'none' }}
                    />
                    <button
                      onClick={() => doAction('complete_profile', { display_name: displayName })}
                      disabled={actionLoading === 'complete_profile' || displayName.trim().length < 2}
                      style={{ ...S.taskBtn, padding: '.5rem 1rem', background: 'var(--gold)', color: '#0D1117', opacity: displayName.trim().length < 2 ? .4 : 1 }}>
                      {actionLoading === 'complete_profile' ? '...' : '确认'}
                    </button>
                  </div>
                )}

                {data?.display_name && (
                  <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', paddingLeft: '2.25rem' }}>当前昵称：<span style={{ color: 'var(--gold)' }}>{data.display_name}</span></div>
                )}
              </div>
            </div>

            {/* Recent log */}
            {data?.logs?.filter(l => l.points !== 0).length > 0 && (
              <div>
                <div style={{ fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.75rem' }}>最近记录</div>
                {data.logs.filter(l => l.points !== 0).slice(0, 6).map((log, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.45rem 0', borderBottom: '1px solid var(--border)', fontSize: '.82rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{log.description}</span>
                    <span style={{ color: log.points > 0 ? 'var(--green)' : '#F85149', fontWeight: 500 }}>{log.points > 0 ? '+' : ''}{log.points}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const S = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' },
  box: { background: 'var(--bg2)', border: '1px solid var(--border-md)', borderRadius: 'var(--r-lg)', width: '100%', maxWidth: '520px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', margin: 'auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 1.5rem 1.1rem', borderBottom: '1px solid var(--border)' },
  title: { fontFamily: 'var(--font-display)', fontSize: '1.9rem', letterSpacing: '.05em', color: 'var(--gold)', margin: 0 },
  closeBtn: { background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text-muted)', fontSize: '1.1rem', cursor: 'pointer', padding: '.3rem .7rem', lineHeight: 1 },
  pointsCard: { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '1.25rem', marginBottom: '1rem' },
  divider: { height: '1px', background: 'var(--border)', margin: '1rem 0' },
  btn: { padding: '1rem', background: 'var(--gold)', color: '#0D1117', border: 'none', borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '.1em', cursor: 'pointer', textAlign: 'center' },
  taskRow: { display: 'flex', alignItems: 'center', gap: '.85rem', padding: '1rem', background: 'var(--bg3)', borderRadius: 'var(--r-md)', marginBottom: '.6rem' },
  taskBtn: { padding: '.45rem 1rem', border: 'none', borderRadius: 'var(--r-sm)', fontSize: '.88rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' },
}
