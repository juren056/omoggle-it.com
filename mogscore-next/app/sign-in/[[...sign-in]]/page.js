import { SignIn } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'70vh',padding:'var(--sp-lg)'}}>
        <div>
          <div style={{textAlign:'center',marginBottom:'var(--sp-md)'}}>
            <h1 style={{fontSize:'2rem',marginBottom:'.5rem'}}>Sign In</h1>
            <p style={{color:'var(--text-muted)',fontSize:'.9rem'}}>Sign in to get <strong style={{color:'var(--gold)'}}>10 analyses/day</strong> instead of 3</p>
          </div>
          <SignIn />
        </div>
      </div>
    </>
  )
}
