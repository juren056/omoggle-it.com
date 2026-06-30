import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { getStripe, PLANS } from '@/lib/stripe'
import { getSubscription, upsertSubscription } from '@/lib/subscription'

export async function POST(req) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  const planId = body.plan === 'yearly' ? 'pro_yearly' : 'pro_monthly'
  const plan = PLANS[planId]
  const priceId = process.env[plan.priceEnvKey]
  if (!priceId) {
    return NextResponse.json({ error: 'Price not configured' }, { status: 503 })
  }

  const existing = await getSubscription(userId)
  if (existing?.status === 'active' && existing?.stripe_subscription_id) {
    return NextResponse.json({ error: 'You already have an active subscription. Manage it from your account.' }, { status: 400 })
  }

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress

  let customerId = existing?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: email || undefined,
      metadata: { clerk_user_id: userId },
    })
    customerId = customer.id
    await upsertSubscription({
      user_id: userId,
      stripe_customer_id: customerId,
      status: 'inactive',
    })
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://omoggle-it.com'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/pricing?success=1`,
    cancel_url: `${origin}/pricing?canceled=1`,
    metadata: { clerk_user_id: userId, plan: planId },
    subscription_data: {
      metadata: { clerk_user_id: userId, plan: planId },
    },
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: session.url })
}
