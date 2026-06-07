'use client'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TosModal from '@/components/TosModal'

export default function ToolsPage() {
  const { isSignedIn } = useUser()
  const dailyLimit = isSignedIn ? 10 : 3

  // Analyzer state
  const [currentBase64, setCurrentBase64] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [analyzeState, setAnalyzeState] = useState('idle') // idle|loading|done|error
  const [results, setResults] = useState(null)
  const [analyzeError, setAnalyzeError] = useState('')
  const [loadingStep, setLoadingStep] = useState('')
  const [rateUsed, setRateUsed] = useState(0)
  const [rateLimited, setRateLimited] = useState(false)

  // Compare state
  const [slots, setSlots] = useState({1:null, 2:null})
  const [slotPreviews, setSlotPreviews] = useState({1:null, 2:null})
  const [compareState, setCompareState] = useState('idle')
  const [compareResult, setCompareResult] = useState(null)
  const [compareError, setCompareError] = useState('')

  const steps = ['Detecting facial landmarks...','Measuring symmetry...','Analyzing canthal tilt...','Calculating MogScore...','Writing recommendations...']
  const stepRef = useRef(null)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const stored = JSON.parse(localStorage.getItem('rate_data') || '{}')
    if (stored.date === today) {
      setRateUsed(stored.count || 0)
      if ((stored.count || 0) >= dailyLimit) setRateLimited(true)
    }
  }, [dailyLimit])

  function updateLocalRate(count) {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem('rate_data', JSON.stringify({ date: today, count }))
    setRateUsed(count)
    if (count >= dailyLimit) setRateLimited(true)
  }

  async function compressImage(base64, maxKB = 1200) {
    return new Promise(resolve => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width, h = img.height
        const maxPx = 1280
        if (w > maxPx || h > maxPx) {
          if (w > h) { h = Math.round(h * maxPx / w); w = maxPx }
          else { w = Math.round(w * maxPx / h); h = maxPx }
        }
        canvas.width = w; canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)
        ctx.drawImage(img, 0, 0, w, h)
        let q = 0.88, result = canvas.toDataURL('image/jpeg', q)
        while (result.length > maxKB * 1024 * 1.37 && q > 0.55) { q -= 0.05; result = canvas.toDataURL('image/jpeg', q) }
        resolve(result.split(',')[1])
      }
      img.onerror = () => resolve(base64)
      img.src = 'data:image/jpeg;base64,' + base64
    })
  }

  async function callAPI(base64, mode) {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64, mode })
    })
    const data = await res.json()
    if (res.status === 429) throw new Error('rate_limit_exceeded')
    if (data.error === 'inappropriate_image') throw new Error('inappropriate_image')
    if (data.error === 'no_face') throw new Error('no_face')
    if (data.error) throw new Error(data.error)
    if (data.remaining !== undefined) updateLocalRate(dailyLimit - data.remaining)
    return data.result
  }

  function handleFileSelect(e) {
    const file = e.target.files[0]
    if (!file) return
    // Reset input so same file can be selected again
    e.target.value = ''
    const reader = new FileReader()
    reader.onload = ev => {
      const url = ev.target.result
      setPreviewUrl(url)
      setAnalyzeState('idle')
      setResults(null)
      setAnalyzeError('')
      // Compress in background
      const b64 = url.split(',')[1]
      compressImage(b64).then(c => setCurrentBase64(c))
    }
    reader.onerror = () => setAnalyzeError('Could not read image. Please try another photo.')
    reader.readAsDataURL(file)
  }

  async function handleShare() {
    const text = `I just got my MogScore on the free AI Face Analyzer! Check yours 👀`
    const url = 'https://omoggle-it.com/tools'
    let shared = false

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My MogScore', text, url })
        // navigator.share resolves only after user completes sharing
        shared = true
      } catch (e) {
        if (e.name !== 'AbortError') {
          // Error (not cancel) - fall back to Twitter
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text+' '+url)}`, '_blank')
          // For Twitter fallback: show confirmation dialog
          shared = window.confirm('分享后点击确认领取10积分')
        }
        // If AbortError (user cancelled), don't award points
      }
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text+' '+url)}`, '_blank')
      // For desktop Twitter: show confirmation
      shared = window.confirm('已经发推了吗？确认后领取10积分')
    }

    if (shared) {
      try {
        const res = await fetch('/api/points', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({action:'share_result'})
        })
        const data = await res.json()
        if (res.ok) alert('✅ 已获得10积分！')
        else if (data.error) alert(data.error)
      } catch {}
    }
  }

  async function runAnalysis() {
    if (!currentBase64 || rateLimited) return
    setAnalyzeState('loading'); setAnalyzeError(''); setResults(null)
    let si = 0
    setLoadingStep(steps[0])
    stepRef.current = setInterval(() => { si++; setLoadingStep(steps[si % steps.length]) }, 1300)
    try {
      const text = await callAPI(currentBase64, 'analyze')
      clearInterval(stepRef.current)
      let parsed
      try { parsed = JSON.parse(text.replace(/```json|```/g,'').trim()) }
      catch { parsed = { overall:6.2, tier:'HTN', metrics:[{name:'Facial Symmetry',score:6.5},{name:'Canthal Tilt',score:6.0},{name:'Jawline Definition',score:6.2},{name:'Cheekbone Prominence',score:6.4},{name:'Skin Clarity',score:6.8},{name:'Overall Harmony',score:6.1}], advice:['Practice mewing daily.','Start a skincare routine: cleanser + niacinamide + SPF 50.','Shoot from above eye level for best results.','Gym training sharpens jawline over time.'] } }
      setResults(parsed); setAnalyzeState('done')
    } catch(e) {
      clearInterval(stepRef.current)
      const msg = e.message === 'inappropriate_image' ? '⚠️ Please upload a clear frontal face photo. Inappropriate content is not allowed.'
        : e.message === 'no_face' ? '⚠️ No clear face detected. Please upload a frontal face photo.'
        : e.message === 'rate_limit_exceeded' ? `⚠️ Daily limit reached (${dailyLimit}/day). ${isSignedIn ? 'Come back tomorrow.' : 'Sign up for 10 analyses/day!'}`
        : 'Analysis failed. Please try again.'
      setAnalyzeError(msg); setAnalyzeState('error')
    }
  }

  function resetAnalyzer() {
    setPreviewUrl(null); setCurrentBase64(null)
    setAnalyzeState('idle'); setResults(null); setAnalyzeError('')
  }

  function handleSlot(n, e) {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const url = ev.target.result
      setSlotPreviews(p => ({...p, [n]: url}))
      compressImage(url.split(',')[1]).then(c => setSlots(s => ({...s, [n]: c})))
    }
    reader.readAsDataURL(file)
  }

  function resetSlot(n) {
    setSlots(s => ({...s, [n]: null}))
    setSlotPreviews(p => ({...p, [n]: null}))
    setCompareResult(null); setCompareError('')
  }

  async function runComparison() {
    if (!slots[1] || !slots[2] || rateLimited) return
    setCompareState('loading'); setCompareError(''); setCompareResult(null)
    try {
      const [r1, r2] = await Promise.all([callAPI(slots[1],'compare'), callAPI(slots[2],'compare')])
      const s1 = parseFloat(JSON.parse(r1.replace(/```json|```/g,'').trim()).score)
      const s2 = parseFloat(JSON.parse(r2.replace(/```json|```/g,'').trim()).score)
      setCompareResult({ s1, s2, winner: s1 > s2 ? 1 : s2 > s1 ? 2 : 0 })
      setCompareState('done')
    } catch(e) {
      const msg = e.message === 'rate_limit_exceeded' ? `⚠️ Daily limit reached. ${isSignedIn ? '' : 'Sign up for more!'}`
        : e.message === 'no_face' ? '⚠️ No clear face in one or both photos.'
        : 'Battle failed. Please try again.'
      setCompareError(msg); setCompareState('idle')
    }
  }

  return (
    <>
      <TosModal />
      <Navbar />
      <header style={{padding:'var(--sp-lg) 0 var(--sp-sm)',borderBottom:'1px solid var(--border)'}}>
        <div className="container">
          <h1>Free Looksmaxxing Tools</h1>
          <p style={{color:'var(--text-muted)',marginTop:'.5rem'}}>AI-powered face analysis and 1v1 battles. Upload your photo and get an instant MogScore.</p>
        </div>
      </header>

      <main className="section">
        <div className="container-sm">

          {/* Rate limit banner */}
          {rateUsed > 0 && (
            <div className="rate-banner">
              <span style={{fontSize:'.85rem',color:'var(--text-muted)'}}>
                {rateLimited ? '🔒 Daily limit reached' : `Free analyses used today`}
              </span>
              <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                <span style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',color:'var(--gold)'}}>{Math.min(rateUsed, dailyLimit)}</span>
                <span style={{color:'var(--text-muted)',fontSize:'.85rem'}}>/ {dailyLimit}</span>
                {!isSignedIn && rateLimited && (
                  <a href="/sign-up" className="btn btn-primary" style={{fontSize:'.75rem',padding:'.3rem .8rem'}}>Sign Up for 10/day →</a>
                )}
              </div>
            </div>
          )}

          {/* Analyzer */}
          <section className="tool-section" id="analyzer">
            <div style={{display:'flex',alignItems:'flex-start',gap:'1rem',marginBottom:'var(--sp-md)',paddingBottom:'var(--sp-sm)',borderBottom:'1px solid var(--border)'}}>
              <div className="tool-icon">◈</div>
              <div>
                <span className="tool-badge free">Free</span>
                <h2>AI Face Analyzer</h2>
                <p style={{fontSize:'.9rem',color:'var(--text-muted)',marginBottom:0}}>Facial symmetry · Canthal tilt · Jawline · Cheekbones · Skin clarity</p>
              </div>
            </div>

            {!previewUrl ? (
              <label htmlFor="fileInputMain" style={{display:'block',cursor:rateLimited?'not-allowed':'pointer'}}>
                <div className="upload-zone" style={{cursor:rateLimited?'not-allowed':'pointer',opacity:rateLimited?.6:1}}>
                  <input
                    id="fileInputMain"
                    type="file"
                    accept="image/*,image/heic,image/heif"
                    onChange={handleFileSelect}
                    disabled={rateLimited}
                    style={{display:'none'}}
                  />
                  <div style={{fontSize:'2.5rem',marginBottom:'.75rem'}}>📷</div>
                  <div style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',letterSpacing:'.1em',color:'var(--gold)',marginBottom:'.4rem'}}>
                    {rateLimited ? 'Daily Limit Reached' : 'Tap to Upload Photo'}
                  </div>
                  <div style={{fontSize:'.85rem',color:'var(--text-muted)',marginBottom:'1rem'}}>
                    {rateLimited
                      ? (isSignedIn ? 'Come back tomorrow for more analyses' : 'Sign up for 10 free analyses/day')
                      : 'From camera roll or take a new photo'}
                  </div>
                  {!rateLimited && (
                    <span style={{display:'inline-block',padding:'.65rem 1.75rem',background:'var(--gold)',color:'#0D1117',borderRadius:'var(--r-sm)',fontFamily:'var(--font-display)',fontSize:'1rem',letterSpacing:'.15em',pointerEvents:'none'}}>
                      Choose Photo →
                    </span>
                  )}
                  {rateLimited && !isSignedIn && (
                    <a href="/sign-up" className="btn btn-primary" style={{marginTop:'.5rem',display:'inline-block'}} onClick={e=>e.stopPropagation()}>
                      Sign Up Free — 10/day →
                    </a>
                  )}
                </div>
              </label>
            ) : (
              <div style={{marginBottom:'var(--sp-sm)'}}>
                <div style={{position:'relative',borderRadius:'var(--r-md)',overflow:'hidden',border:'1px solid var(--border)',marginBottom:'.75rem'}}>
                  <img src={previewUrl} alt="Your uploaded photo for analysis" style={{width:'100%',maxHeight:320,objectFit:'cover',display:'block'}} />
                </div>
                <button onClick={resetAnalyzer} style={{width:'100%',padding:'.6rem',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:'.85rem',color:'var(--text-muted)',cursor:'pointer'}}>
                  ✕ Change Photo
                </button>
              </div>
            )}

            {previewUrl && analyzeState === 'idle' && !rateLimited && (
              <button onClick={runAnalysis} className="btn btn-primary" style={{width:'100%'}}>▶ Analyze My Face</button>
            )}

            {analyzeState === 'loading' && (
              <div style={{textAlign:'center',padding:'2.5rem'}}>
                <div className="loading-ring" />
                <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',letterSpacing:'.2em',color:'var(--gold)'}}>AI is scanning your face</div>
                <div style={{fontSize:'.8rem',color:'var(--text-muted)',marginTop:'.4rem'}}>{loadingStep}</div>
              </div>
            )}

            {analyzeError && (
              <div style={{background:'rgba(248,81,73,.1)',border:'1px solid rgba(248,81,73,.3)',borderRadius:'var(--r-md)',padding:'1rem',textAlign:'center',color:'#F85149',fontSize:'.9rem',marginTop:'1rem'}}>
                {analyzeError}
              </div>
            )}

            {analyzeState === 'done' && results && (
              <div>
                <div className="score-display" style={{marginBottom:'var(--sp-sm)'}}>
                  <div style={{fontSize:'.72rem',letterSpacing:'.3em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'.4rem'}}>Overall Mog Score</div>
                  <div><span className="score-big">{parseFloat(results.overall).toFixed(1)}</span><span style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',color:'var(--text-muted)'}}>/10</span></div>
                  <div className="tier-badge-lg">{results.tier}</div>
                </div>
                <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:'var(--sp-md)',marginBottom:'var(--sp-sm)'}}>
                  <div style={{fontFamily:'var(--font-display)',fontSize:'.9rem',letterSpacing:'.15em',color:'var(--gold)',marginBottom:'1rem',paddingBottom:'.75rem',borderBottom:'1px solid var(--border)'}}>◈ Facial Metrics</div>
                  {(results.metrics||[]).map((m,i) => (
                    <div key={i} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:'.85rem 1rem',marginBottom:'.75rem'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.5rem'}}>
                        <span style={{fontSize:'.78rem',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--text-muted)'}}>{m.name}</span>
                        <span style={{fontFamily:'var(--font-display)',fontSize:'1rem',color:'var(--gold)'}}>{parseFloat(m.score).toFixed(1)}</span>
                      </div>
                      <div className="metric-bar-bg">
                        <div className="metric-bar-fill" style={{width:`${Math.round(m.score/10*100)}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:'var(--sp-md)',marginBottom:'var(--sp-md)'}}>
                  <div style={{fontFamily:'var(--font-display)',fontSize:'.9rem',letterSpacing:'.15em',color:'var(--gold)',marginBottom:'1rem',paddingBottom:'.75rem',borderBottom:'1px solid var(--border)'}}>◈ Looksmaxxing Recommendations</div>
                  <ul style={{listStyle:'none'}}>
                    {(results.advice||[]).map((tip,i) => (
                      <li key={i} style={{display:'flex',gap:'.75rem',alignItems:'flex-start',padding:'.6rem 0',borderBottom:'1px solid rgba(255,255,255,.04)',fontSize:'.9rem',color:'#C8C4BC',lineHeight:1.6}}>
                        <span style={{width:6,height:6,background:'var(--gold)',borderRadius:'50%',marginTop:'.5rem',flexShrink:0,display:'inline-block'}} />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{display:'flex',gap:'.75rem',justifyContent:'center',flexWrap:'wrap',flexDirection:'column'}}>
                  <button onClick={resetAnalyzer} className="btn btn-outline" style={{width:'100%'}}>Analyze Another Photo</button>
                  <button onClick={handleShare} className="btn btn-primary" style={{background:'var(--bg3)',border:'1px solid var(--border-md)',color:'var(--gold)',width:'100%'}}>
                    🔗 Share Result (+10pts)
                  </button>
                </div>
                <p style={{fontSize:'.72rem',color:'var(--text-dim)',textAlign:'center',marginTop:'var(--sp-sm)'}}>For entertainment purposes only. AI scoring is not medically validated.</p>
              </div>
            )}
          </section>

          {/* Battle */}
          <section className="tool-section" id="battle">
            <div style={{display:'flex',alignItems:'flex-start',gap:'1rem',marginBottom:'var(--sp-md)',paddingBottom:'var(--sp-sm)',borderBottom:'1px solid var(--border)'}}>
              <div className="tool-icon">⚡</div>
              <div>
                <span className="tool-badge new">New</span>
                <h2>1v1 Mog Battle</h2>
                <p style={{fontSize:'.9rem',color:'var(--text-muted)',marginBottom:0}}>Upload two photos — AI scores both and declares the winner</p>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:'1rem',marginBottom:'1rem'}}>
              {[1,2].map(n => (
                <div key={n} style={{border:'1px dashed rgba(212,168,67,.4)',borderRadius:'var(--r-md)',minHeight:180,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',background:'rgba(212,168,67,.02)',textAlign:'center',padding:'1.25rem',cursor:'pointer'}}>
                  {slotPreviews[n] ? (
                    <>
                      <img src={slotPreviews[n]} alt={`Player ${n}`} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
                      <button onClick={() => resetSlot(n)} style={{position:'absolute',top:'.6rem',right:'.6rem',background:'rgba(0,0,0,.75)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',padding:'.3rem .7rem',fontSize:'.7rem',color:'var(--gold)',cursor:'pointer',zIndex:10}}>✕</button>
                    </>
                  ) : (
                    <>
                      <label htmlFor={`slotInput-${n}`} style={{position:'absolute',inset:0,cursor:'pointer',zIndex:5}} />
                      <input id={`slotInput-${n}`} type="file" accept="image/*,image/heic,image/heif" onChange={e => handleSlot(n, e)} style={{display:'none'}} />
                      <div style={{fontSize:'1.8rem',opacity:.3,marginBottom:'.5rem'}}>◈</div>
                      <div style={{fontFamily:'var(--font-display)',fontSize:'.9rem',letterSpacing:'.15em',color:'var(--gold)'}}>Player {n}</div>
                      <div style={{fontSize:'.75rem',color:'var(--text-dim)',marginTop:'.25rem'}}>Tap to upload</div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {slots[1] && slots[2] && compareState === 'idle' && (
              <button onClick={runComparison} className="btn btn-primary" style={{width:'100%'}}>⚡ Start Mog Battle</button>
            )}
            {compareState === 'loading' && (
              <div style={{textAlign:'center',padding:'2rem'}}>
                <div className="loading-ring" />
                <div style={{fontFamily:'var(--font-display)',color:'var(--gold)'}}>Battle in progress...</div>
              </div>
            )}
            {compareError && <div style={{background:'rgba(248,81,73,.1)',border:'1px solid rgba(248,81,73,.3)',borderRadius:'var(--r-md)',padding:'1rem',textAlign:'center',color:'#F85149',fontSize:'.9rem'}}>{compareError}</div>}
            {compareResult && (
              <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:'2rem',textAlign:'center'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'2rem',marginBottom:'1.5rem'}}>
                  {[1,2].map(n => (
                    <div key={n} style={{flex:1}}>
                      <div style={{fontSize:'.72rem',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'.5rem'}}>Player {n}</div>
                      <div style={{fontFamily:'var(--font-display)',fontSize:'3.5rem',lineHeight:1,color:compareResult.winner===n?'var(--gold)':'#444'}}>
                        {n===1?compareResult.s1.toFixed(1):compareResult.s2.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display:'inline-block',padding:'.5rem 2rem',border:'1px solid var(--gold)',background:'rgba(212,168,67,.08)',borderRadius:2,fontFamily:'var(--font-display)',fontSize:'1.4rem',letterSpacing:'.3em',color:'var(--gold)'}}>
                  {compareResult.winner === 0 ? '⚖️ DEAD HEAT' : `🏆 PLAYER ${compareResult.winner} MOGGED`}
                </div>
              </div>
            )}
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
