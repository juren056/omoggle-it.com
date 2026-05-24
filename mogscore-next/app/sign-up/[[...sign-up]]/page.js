import { SignUp } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '80vh', padding: 'var(--sp-lg)',
        flexDirection: 'column', gap: 'var(--sp-md)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--sp-sm)' }}>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Free signup — get <strong style={{ color: 'var(--gold)' }}>10 AI analyses per day</strong> vs 3 for guests
          </p>
        </div>
        <div style={{ transform: 'scale(1.1)', transformOrigin: 'top center' }}>
          <SignUp />
        </div>
      </div>
      <Footer />
    </>
  )
}
