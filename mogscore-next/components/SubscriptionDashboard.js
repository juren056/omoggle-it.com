'use client'
import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import Modal from './Modal'
import { PLANS } from '@/lib/plans'

const PLAN_LABEL = {
  free: 'Free',
  pro_monthly: 'Pro Monthly',
  pro_yearly: 'Pro Yearly',
}

const STATUS_LABEL = {
  active: { text: '已生效', color: 'var(--green)' },
  trialing: { text: '试用中', color: 'var(--green)' },
  canceled: { text: '已取消', color: '#F85149' },
  inactive: { text: '未订阅', color: 'var(--text-muted)' },
  guest: { text: '未登录', color: 'var(--text-muted)' },
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function SubscriptionDashboard({ onClose }) {
  const { isSignedIn, isLoaded } = useUser()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionLoading, setActionLoading] = useState('')

  const fetchSubscription = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const res = await fetch('/api/subscription', { signal: controller.signal, credentials: 'same-origin' })
      clearTimeout(timeout)
      const json = await res.json().catch(() => ({}))
      if (!res.ok) setLoadError(json.error || `加载失败 (${res.status})`)
      else setData(json)
    } catch (err) {
      setLoadError(err.name === 'AbortError' ? '请求超时，请重试' : '网络错误，请重试')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) { setLoading(false); return }
    fetchSubscription()
  }, [isLoaded, isSignedIn, fetchSubscription])

  async function openPortal() {
    setActionLoading('portal')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST', credentials: 'same-origin' })
      const json = await res.json().catch(() => ({}))
      if (json.url) window.location.href = json.url
      else { setLoadError(json.error || '无法打开管理页面'); setActionLoading('') }
    } catch {
      setLoadError('网络错误，请重试'); setActionLoading('')
    }
  }

  const isPro = !!data?.isPro
  const planName = PLAN_LABEL[data?.plan] || PLANS[data?.plan]?.name || 'Free'
  const statusInfo = STATUS_LABEL[data?.status] || STATUS_LABEL.inactive

  if (!isLoaded || loading) {
    return (
      <Modal onClose={onClose} maxWidth={460}>
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>
      </Modal>
    )
  }

  if (!isSignedIn) {
    return (
      <Modal onClose={onClose} maxWidth={460}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }}>套餐状态</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>登录后可查看订阅状态</p>
          <a href="/sign-up" style={{ display: 'inline-block', padding: '1rem 2rem', background: 'var(--gold)', color: '#0D1117', borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '.1em', textDecoration: 'none' }}>免费注册 →</a>
        </div>
      </Modal>
    )
  }

  return (
    <Modal onClose={onClose} maxWidth={480}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 1.5rem 1.1rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '.05em', color: 'var(--gold)', margin: 0 }}>💳 套餐状态</h2>
        <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '.3rem .8rem', lineHeight: 1 }}>✕</button>
      </div>

      <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
        {loadError ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#F85149', marginBottom: '1rem', lineHeight: 1.6 }}>{loadError}</p>
            <button onClick={fetchSubscription} style={{ padding: '.75rem 1.5rem', background: 'var(--gold)', border: 'none', borderRadius: 'var(--r-sm)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#0D1117' }}>重试</button>
          </div>
        ) : (
          <>
            <div style={{ background: 'var(--bg3)', border: `1px solid ${isPro ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 'var(--r-lg)', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '.72rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.35rem' }}>当前套餐</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: isPro ? 'var(--gold)' : 'var(--text)', lineHeight: 1 }}>{planName}</div>
                </div>
                {isPro && <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--green)', border: '1px solid var(--green)', borderRadius: 'var(--r-sm)', padding: '.25rem .7rem' }}>PRO</span>}
              </div>

              <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginBottom: '.3rem' }}>状态</div>
                  <div style={{ fontSize: '1rem', color: statusInfo.color, fontWeight: 600 }}>{statusInfo.text}</div>
                </div>
                <div>
                  <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginBottom: '.3rem' }}>每日分析次数</div>
                  <div style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: 600 }}>{data?.dailyLimit === null || isPro ? '无限' : `${data?.dailyLimit ?? PLANS.free.dailyLimit} 次/天`}</div>
                </div>
                {isPro && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginBottom: '.3rem' }}>
                      {data?.cancelAtPeriodEnd ? '有效期至（到期后取消）' : '下次续费日期'}
                    </div>
                    <div style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: 600 }}>{formatDate(data?.currentPeriodEnd)}</div>
                  </div>
                )}
              </div>
            </div>

            {isPro && data?.cancelAtPeriodEnd && (
              <div style={{ padding: '.85rem', borderRadius: 'var(--r-md)', background: 'rgba(248,81,73,.1)', border: '1px solid rgba(248,81,73,.3)', color: '#F85149', fontSize: '.88rem', marginBottom: '1rem', textAlign: 'center' }}>
                订阅将在有效期结束后停止续费
              </div>
            )}

            {isPro || data?.hasBillingAccount ? (
              <button onClick={openPortal} disabled={!!actionLoading}
                style={{ width: '100%', padding: '1rem', background: 'var(--gold)', color: '#0D1117', border: 'none', borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-display)', fontSize: '1.05rem', letterSpacing: '.1em', cursor: 'pointer' }}>
                {actionLoading === 'portal' ? '打开中...' : '⚙ 管理订阅 / 账单'}
              </button>
            ) : (
              <a href="/pricing"
                style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: '1rem', background: 'var(--gold)', color: '#0D1117', border: 'none', borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-display)', fontSize: '1.05rem', letterSpacing: '.1em', cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>
                ⭐ 升级到 Pro — 解锁无限次
              </a>
            )}

            <p style={{ fontSize: '.78rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '1rem', lineHeight: 1.6 }}>
              账单由 Stripe 安全处理。可随时在管理页面取消，有效期内仍可使用。
            </p>
          </>
        )}
      </div>
    </Modal>
  )
}
