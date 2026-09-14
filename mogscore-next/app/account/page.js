import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AccountContent from './AccountContent'

export const metadata = { title: 'Member Account', robots: { index: false, follow: false } }

export default async function AccountPage() {
  const { userId, redirectToSignIn } = await auth()
  if (!userId) return redirectToSignIn({ returnBackUrl: '/account' })
  return <ClerkProvider><Navbar /><main className="section"><div className="container-sm"><span className="section-label">Private area</span><h1>Member Account</h1><p>Existing members can verify legacy benefits and open Stripe’s secure billing portal. Personal account pages are excluded from search and advertising.</p><AccountContent /><p><Link href="/tools">Use the free local tools</Link></p></div></main><Footer /></ClerkProvider>
}
