'use client'
import { useState, useEffect } from 'react'

export default function TosModal() {
  const [show, setShow] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('tos_accepted')) {
      setShow(true)
    }
  }, [])

  function accept() {
    localStorage.setItem('tos_accepted', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
      <div style={{background:'var(--bg2)',border:'1px solid var(--border-md)',borderRadius:'var(--r-lg)',maxWidth:'520px',width:'100%',maxHeight:'85vh',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'1.5rem 1.5rem 1rem',borderBottom:'1px solid var(--border)'}}>
          <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',color:'var(--gold)'}}>Terms of Use</h2>
          <p style={{fontSize:'.82rem',color:'var(--text-muted)',marginTop:'.35rem',marginBottom:0}}>Please read and accept before using MogScore AI tools</p>
        </div>
        <div style={{padding:'1rem 1.5rem',overflowY:'auto',flex:1,fontSize:'.85rem',color:'var(--text-muted)',lineHeight:1.8}}>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>1. Entertainment Only</h3>
          <p>MogScore's AI face analyzer is for entertainment purposes only. Scores are not scientifically validated assessments of attractiveness, health, or any personal characteristic.</p>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>2. Your Photos</h3>
          <p>Photos you upload are processed instantly and never stored on our servers. We do not use your images to train AI models.</p>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>3. Usage Limits</h3>
          <p>Free users get 3 analyses per day. Signed-in users get 10 per day. Limits reset at midnight UTC.</p>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>4. Appropriate Use</h3>
          <p>You agree not to upload images of minors, explicit content, or images you do not have rights to use.</p>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>5. Age Requirement</h3>
          <p>You must be 18 or older to use this service.</p>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>6. Paid Plans</h3>
          <p>Pro subscriptions are billed via Stripe. See our <a href="/pricing" target="_blank" rel="noopener" style={{color:'var(--gold)'}}>Pricing</a>, <a href="/refund-policy" target="_blank" rel="noopener" style={{color:'var(--gold)'}}>Refund Policy</a>, and <a href="/terms-of-service" target="_blank" rel="noopener" style={{color:'var(--gold)'}}>Terms of Service</a>.</p>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>7. Disclaimer</h3>
          <p>MogScore.wiki is not affiliated with Omoggle LLC. AI scores may be inaccurate due to lighting, camera quality, and other technical factors.</p>
          <p style={{fontSize:'.8rem',marginTop:'1rem'}}>Full policies: <a href="/terms-of-service" target="_blank" rel="noopener" style={{color:'var(--gold)'}}>Terms</a> · <a href="/privacy-policy" target="_blank" rel="noopener" style={{color:'var(--gold)'}}>Privacy</a> · <a href="/acceptable-use" target="_blank" rel="noopener" style={{color:'var(--gold)'}}>Acceptable Use</a></p>
        </div>
        <div style={{padding:'1rem 1.5rem',borderTop:'1px solid var(--border)'}}>
          <label style={{display:'flex',alignItems:'flex-start',gap:'.75rem',cursor:'pointer',fontSize:'.83rem',color:'var(--text-muted)',marginBottom:'.75rem'}}>
            <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)}
              style={{width:16,height:16,marginTop:2,accentColor:'var(--gold)',flexShrink:0,cursor:'pointer'}} />
            I have read and agree to the <a href="/terms-of-service" target="_blank" rel="noopener" style={{ color: 'var(--gold)' }}>Terms of Service</a>, <a href="/privacy-policy" target="_blank" rel="noopener" style={{ color: 'var(--gold)' }}>Privacy Policy</a>, and <a href="/acceptable-use" target="_blank" rel="noopener" style={{ color: 'var(--gold)' }}>Acceptable Use Policy</a>. I confirm I am 18 or older.
          </label>
          <button onClick={accept} disabled={!checked}
            style={{width:'100%',padding:'.85rem',background:checked?'var(--gold)':'var(--bg3)',color:checked?'#0D1117':'var(--text-muted)',border:'none',borderRadius:'var(--r-sm)',fontFamily:'var(--font-display)',fontSize:'1rem',letterSpacing:'.15em',cursor:checked?'pointer':'not-allowed',transition:'all .2s'}}>
            I Agree — Continue to MogScore →
          </button>
        </div>
      </div>
    </div>
  )
}
