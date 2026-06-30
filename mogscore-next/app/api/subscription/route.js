import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSubscription, isProActive } from '@/lib/subscription'
import { PLANS } from '@/lib/stripe'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ isPro: false, plan: 'free', status: 'guest' })
  }

  const subscription = await getSubscription(userId)
  const isPro = isProActive(subscription)

  return NextResponse.json({
    isPro,
    plan: isPro ? subscription.plan : 'free',
    status: subscription?.status || 'inactive',
    currentPeriodEnd: subscription?.current_period_end || null,
    cancelAtPeriodEnd: subscription?.cancel_at_period_end || false,
    dailyLimit: isPro ? null : PLANS.free.dailyLimit,
    hasBillingAccount: !!subscription?.stripe_customer_id,
  })
}
