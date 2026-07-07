import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getStripe, getPaymentLink, buildPaymentLinkUrl } from '@/lib/stripe'
import { PLANS } from '@/lib/plans'
import { getSubscription, upsertSubscription } from '@/lib/subscription'

function emailFromSessionClaims(sessionClaims) {
  if (!sessionClaims) return undefined
  const email = sessionClaims.email ?? sessionClaims.primary_email_address
  return typeof email === 'string' ? email : undefined
}

export async function POST(req) {
  const { userId, sessionClaims } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  const planId = body.plan === 'yearly' ? 'pro_yearly' : 'pro_monthly'
  const plan = PLANS[planId]
  const planKey = body.plan === 'yearly' ? 'yearly' : 'monthly'
  const priceId = process.env[plan.priceEnvKey]
  const paymentLink = getPaymentLink(planKey)
  const checkoutMode = process.env.STRIPE_CHECKOUT_MODE || 'auto'
  const usePaymentLink = paymentLink && (
    checkoutMode === 'payment_link' || (checkoutMode === 'auto' && !priceId)
  )

  if (!usePaymentLink && !priceId) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  // Payment Link: instant redirect — no Supabase/Clerk API round-trips
  if (usePaymentLink) {
    const url = buildPaymentLinkUrl(paymentLink, {
      userId,
      email: emailFromSessionClaims(sessionClaims),
    })
    return NextResponse.json({ url })
  }

  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  const existing = await getSubscription(userId)
  if (existing?.status === 'active' && existing?.stripe_subscription_id) {
    return NextResponse.json({ error: 'You already have an active subscription. Manage it from your account.' }, { status: 400 })
  }

  let customerId = existing?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: emailFromSessionClaims(sessionClaims),
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
