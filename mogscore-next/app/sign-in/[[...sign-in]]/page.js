import { SignIn } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '80vh', padding: 'var(--sp-lg)',
        flexDirection: 'column', gap: 'var(--sp-md)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--sp-sm)' }}>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '.5rem' }}>Sign In</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Sign in to get <strong style={{ color: 'var(--gold)' }}>10 analyses/day</strong> instead of 3
          </p>
        </div>
        <div style={{ transform: 'scale(1.1)', transformOrigin: 'top center' }}>
          <SignIn />
        </div>
      </div>
      <Footer />
    </>
  )
}
