'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TosModal() {
  const [show, setShow] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('tos_accepted')) {
      const timer = window.setTimeout(() => setShow(true), 0)
      return () => window.clearTimeout(timer)
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
          <p style={{fontSize:'.82rem',color:'var(--text-muted)',marginTop:'.35rem',marginBottom:0}}>Please read and accept before using Omoggle IT tools</p>
        </div>
        <div style={{padding:'1rem 1.5rem',overflowY:'auto',flex:1,fontSize:'.85rem',color:'var(--text-muted)',lineHeight:1.8}}>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>1. Entertainment Only</h3>
          <p>Omoggle IT&apos;s AI face analyzer is for entertainment purposes only. Scores are not scientifically validated assessments of attractiveness, health, or any personal characteristic.</p>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>2. Your Photos</h3>
          <p>Photos selected in the free tools are processed locally in your browser and are not uploaded to our servers. We do not use them to train AI models.</p>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>3. Local Processing</h3>
          <p>The free local tools do not require an account or consume a paid AI request.</p>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>4. Appropriate Use</h3>
          <p>You agree not to upload images of minors, explicit content, or images you do not have rights to use.</p>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>5. Age Requirement</h3>
          <p>You must be 18 or older to use this service.</p>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>6. Existing Paid Plans</h3>
          <p>New subscriptions are currently closed by default. Existing subscriptions remain billed via Stripe and can be managed from the member account area.</p>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text)',margin:'1rem 0 .35rem',fontSize:'1rem'}}>7. Disclaimer</h3>
          <p>Omoggle IT is not affiliated with Omoggle LLC. AI scores may be inaccurate due to lighting, camera quality, and other technical factors.</p>
          <p style={{fontSize:'.8rem',marginTop:'1rem'}}>Full policies: <Link href="/terms-of-service" target="_blank" rel="noopener" style={{color:'var(--gold)'}}>Terms</Link> · <Link href="/privacy-policy" target="_blank" rel="noopener" style={{color:'var(--gold)'}}>Privacy</Link> · <Link href="/acceptable-use" target="_blank" rel="noopener" style={{color:'var(--gold)'}}>Acceptable Use</Link></p>
        </div>
        <div style={{padding:'1rem 1.5rem',borderTop:'1px solid var(--border)'}}>
          <label style={{display:'block',cursor:'pointer',fontSize:'.83rem',color:'var(--text-muted)',marginBottom:'.75rem',lineHeight:1.7,overflowWrap:'anywhere'}}>
            <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)}
              style={{width:16,height:16,marginRight:'.75rem',verticalAlign:'middle',accentColor:'var(--gold)',cursor:'pointer'}} />
            I have read and agree to the <Link href="/terms-of-service" target="_blank" rel="noopener" style={{ color: 'var(--gold)' }}>Terms of Service</Link>, <Link href="/privacy-policy" target="_blank" rel="noopener" style={{ color: 'var(--gold)' }}>Privacy Policy</Link>, and <Link href="/acceptable-use" target="_blank" rel="noopener" style={{ color: 'var(--gold)' }}>Acceptable Use Policy</Link>. I confirm I am 18 or older.
          </label>
          <button onClick={accept} disabled={!checked}
            style={{width:'100%',padding:'.85rem',background:checked?'var(--gold)':'var(--bg3)',color:checked?'#0D1117':'var(--text-muted)',border:'none',borderRadius:'var(--r-sm)',fontFamily:'var(--font-display)',fontSize:'1rem',letterSpacing:'.15em',cursor:checked?'pointer':'not-allowed',transition:'all .2s'}}>
            I Agree — Continue to Omoggle IT →
          </button>
        </div>
      </div>
    </div>
  )
}
