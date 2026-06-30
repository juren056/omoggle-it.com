import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { upsertSubscription, getSubscriptionByStripeSubscriptionId } from '@/lib/subscription'

export const runtime = 'nodejs'

function planFromPriceId(priceId) {
  if (priceId === process.env.STRIPE_PRICE_ID_MONTHLY) return 'pro_monthly'
  if (priceId === process.env.STRIPE_PRICE_ID_YEARLY) return 'pro_yearly'
  return null
}

async function syncSubscription(stripeSub, clerkUserId) {
  const priceId = stripeSub.items?.data?.[0]?.price?.id
  await upsertSubscription({
    user_id: clerkUserId,
    stripe_customer_id: typeof stripeSub.customer === 'string' ? stripeSub.customer : stripeSub.customer?.id,
    stripe_subscription_id: stripeSub.id,
    status: stripeSub.status,
    plan: planFromPriceId(priceId),
    current_period_end: new Date(stripeSub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: stripeSub.cancel_at_period_end,
  })
}

export async function POST(req) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Stripe webhook signature failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        if (session.mode !== 'subscription' || !session.subscription) break
        const clerkUserId = session.metadata?.clerk_user_id
        if (!clerkUserId) break
        const stripeSub = await stripe.subscriptions.retrieve(session.subscription)
        await syncSubscription(stripeSub, clerkUserId)
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const stripeSub = event.data.object
        let clerkUserId = stripeSub.metadata?.clerk_user_id
        if (!clerkUserId) {
          const existing = await getSubscriptionByStripeSubscriptionId(stripeSub.id)
          clerkUserId = existing?.user_id
        }
        if (!clerkUserId) break
        if (event.type === 'customer.subscription.deleted') {
          await upsertSubscription({
            user_id: clerkUserId,
            stripe_customer_id: typeof stripeSub.customer === 'string' ? stripeSub.customer : stripeSub.customer?.id,
            stripe_subscription_id: stripeSub.id,
            status: 'canceled',
            plan: planFromPriceId(stripeSub.items?.data?.[0]?.price?.id),
            current_period_end: new Date(stripeSub.current_period_end * 1000).toISOString(),
            cancel_at_period_end: true,
          })
        } else {
          await syncSubscription(stripeSub, clerkUserId)
        }
        break
      }
      default:
        break
    }
  } catch (err) {
    console.error('Stripe webhook handler error:', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
