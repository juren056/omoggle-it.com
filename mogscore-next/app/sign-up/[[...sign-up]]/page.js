import { SignUp } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'70vh',padding:'var(--sp-lg)'}}>
        <div>
          <div style={{textAlign:'center',marginBottom:'var(--sp-md)'}}>
            <h1 style={{fontSize:'2rem',marginBottom:'.5rem'}}>Create Account</h1>
            <p style={{color:'var(--text-muted)',fontSize:'.9rem'}}>Sign up free — get <strong style={{color:'var(--gold)'}}>10 AI analyses per day</strong> vs 3 for guests</p>
          </div>
          <SignUp />
        </div>
      </div>
    </>
  )
}
