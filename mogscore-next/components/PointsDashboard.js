'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

const TASKS = [
  { id: 'daily_checkin', label: '每日签到', desc: '每天登录签到', points: 5, icon: '📅', daily: true },
  { id: 'share_result', label: '分享结果', desc: '分享你的分析结果', points: 10, icon: '🔗', daily: true },
  { id: 'complete_profile', label: '完善资料', desc: '完成个人资料设置', points: 10, icon: '👤', oneTime: true },
]

export default function PointsDashboard({ onClose }) {
  const { isSignedIn } = useUser()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isSignedIn) fetchPoints()
  }, [isSignedIn])

  async function fetchPoints() {
    setLoading(true)
    try {
      const res = await fetch('/api/points')
      if (res.ok) setData(await res.json())
    } catch {}
    setLoading(false)
  }

  async function doAction(action) {
    setActionLoading(action)
    setMessage('')
    try {
      const res = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      const result = await res.json()
      if (res.ok) {
        setMessage(result.description || result.message || '操作成功！')
        await fetchPoints()
      } else {
        setMessage(result.error === 'Already checked in today' ? '今天已经签到过了' :
                   result.error === 'Already shared today' ? '今天已经分享过了' :
                   result.error === 'Already completed' ? '已经完成过了' :
                   result.error === 'Insufficient points (need 10)' ? '积分不足（需要10分）' :
                   result.error || '操作失败')
      }
    } catch {
      setMessage('网络错误，请重试')
    }
    setActionLoading('')
  }

  if (!isSignedIn) {
    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.box} onClick={e => e.stopPropagation()}>
          <div style={styles.header}>
            <h2 style={styles.title}>积分系统</h2>
            <button onClick={onClose} style={styles.closeBtn}>✕</button>
          </div>
          <div style={{padding:'2rem',textAlign:'center'}}>
            <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🔒</div>
            <p style={{color:'var(--text-muted)',marginBottom:'1.5rem'}}>登录后可使用积分系统，获得更多分析次数</p>
            <a href="/sign-up" style={{...styles.btn, display:'inline-block', textDecoration:'none'}}>免费注册</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.box} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>◈ 积分中心</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {loading ? (
          <div style={{padding:'3rem',textAlign:'center',color:'var(--text-muted)'}}>加载中...</div>
        ) : (
          <div style={{padding:'1.25rem',overflowY:'auto',maxHeight:'70vh'}}>
            {/* Points summary */}
            <div style={styles.pointsCard}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:'.75rem',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'.5rem'}}>当前积分</div>
                <div style={{fontFamily:'var(--font-display)',fontSize:'3.5rem',color:'var(--gold)',lineHeight:1}}>{data?.points || 0}</div>
                <div style={{fontSize:'.82rem',color:'var(--text-muted)',marginTop:'.35rem'}}>累计获得 {data?.total_earned || 0} 分</div>
              </div>
              <div style={styles.divider} />
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',textAlign:'center'}}>
                <div>
                  <div style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',color:'var(--green)'}}>{data?.extra_uses || 0}</div>
                  <div style={{fontSize:'.78rem',color:'var(--text-muted)'}}>额外分析次数</div>
                </div>
                <div>
                  <div style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',color:'var(--gold)'}}>10</div>
                  <div style={{fontSize:'.78rem',color:'var(--text-muted)'}}>积分换1次</div>
                </div>
              </div>
            </div>

            {/* Redeem button */}
            <button
              onClick={() => doAction('redeem_use')}
              disabled={actionLoading === 'redeem_use' || (data?.points || 0) < 10}
              style={{
                ...styles.btn,
                width:'100%',
                marginBottom:'1rem',
                opacity: (data?.points || 0) < 10 ? .4 : 1,
                cursor: (data?.points || 0) < 10 ? 'not-allowed' : 'pointer',
              }}
            >
              {actionLoading === 'redeem_use' ? '兑换中...' : '⚡ 用10分兑换1次额外分析'}
            </button>

            {/* Message */}
            {message && (
              <div style={{background:'rgba(212,168,67,.1)',border:'1px solid var(--border-md)',borderRadius:'var(--r-md)',padding:'.75rem 1rem',fontSize:'.85rem',color:'var(--gold)',marginBottom:'1rem',textAlign:'center'}}>
                {message}
              </div>
            )}

            {/* Tasks */}
            <div style={{marginBottom:'1rem'}}>
              <div style={{fontSize:'.72rem',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'.75rem'}}>完成任务获取积分</div>
              {TASKS.map(task => {
                const isDone = task.id === 'daily_checkin' ? data?.checked_in_today :
                               task.oneTime ? data?.logs?.some(l => l.action === task.id) : false
                return (
                  <div key={task.id} style={styles.taskRow}>
                    <div style={{fontSize:'1.5rem'}}>{task.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'.9rem',fontWeight:500,color:'var(--text)'}}>{task.label}</div>
                      <div style={{fontSize:'.78rem',color:'var(--text-muted)'}}>{task.desc}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'.5rem',flexShrink:0}}>
                      <span style={{fontSize:'.82rem',color:'var(--gold)',fontWeight:500}}>+{task.points}分</span>
                      <button
                        onClick={() => doAction(task.id)}
                        disabled={isDone || actionLoading === task.id}
                        style={{
                          ...styles.taskBtn,
                          background: isDone ? 'var(--bg3)' : 'var(--gold)',
                          color: isDone ? 'var(--text-muted)' : '#0D1117',
                          cursor: isDone ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {actionLoading === task.id ? '...' : isDone ? '✓ 已完成' : '领取'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recent log */}
            {data?.logs?.filter(l => l.points !== 0).length > 0 && (
              <div>
                <div style={{fontSize:'.72rem',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'.75rem'}}>最近记录</div>
                {data.logs.filter(l => l.points !== 0).slice(0,5).map((log, i) => (
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.5rem 0',borderBottom:'1px solid var(--border)',fontSize:'.82rem'}}>
                    <span style={{color:'var(--text-muted)'}}>{log.description}</span>
                    <span style={{color: log.points > 0 ? 'var(--green)' : 'var(--red)', fontWeight:500}}>
                      {log.points > 0 ? '+' : ''}{log.points}
                    </span>
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

const styles = {
  overlay: {
    position:'fixed',inset:0,background:'rgba(0,0,0,.75)',zIndex:200,
    display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'
  },
  box: {
    background:'var(--bg2)',border:'1px solid var(--border-md)',
    borderRadius:'var(--r-lg)',width:'100%',maxWidth:'460px',
    maxHeight:'90vh',display:'flex',flexDirection:'column'
  },
  header: {
    display:'flex',alignItems:'center',justifyContent:'space-between',
    padding:'1.25rem 1.25rem 1rem',borderBottom:'1px solid var(--border)'
  },
  title: { fontFamily:'var(--font-display)',fontSize:'1.6rem',letterSpacing:'.05em',color:'var(--gold)',margin:0 },
  closeBtn: { background:'none',border:'none',color:'var(--text-muted)',fontSize:'1.2rem',cursor:'pointer',padding:'.25rem' },
  pointsCard: {
    background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',
    padding:'1.25rem',marginBottom:'1rem'
  },
  divider: { height:'1px',background:'var(--border)',margin:'1rem 0' },
  btn: {
    padding:'.85rem',background:'var(--gold)',color:'#0D1117',border:'none',
    borderRadius:'var(--r-sm)',fontFamily:'var(--font-display)',fontSize:'1rem',
    letterSpacing:'.1em',cursor:'pointer',textAlign:'center'
  },
  taskRow: {
    display:'flex',alignItems:'center',gap:'.75rem',
    padding:'.75rem',background:'var(--bg3)',borderRadius:'var(--r-md)',marginBottom:'.5rem'
  },
  taskBtn: {
    padding:'.3rem .75rem',border:'none',borderRadius:'var(--r-sm)',
    fontFamily:'var(--font-body)',fontSize:'.8rem',fontWeight:500
  },
}
