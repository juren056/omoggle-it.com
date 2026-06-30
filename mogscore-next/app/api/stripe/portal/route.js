import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getStripe } from '@/lib/stripe'
import { getSubscription } from '@/lib/subscription'

export async function POST() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  const sub = await getSubscription(userId)
  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account found. Subscribe to Pro first.' }, { status: 400 })
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://omoggle-it.com'

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${origin}/pricing`,
  })

  return NextResponse.json({ url: session.url })
}
