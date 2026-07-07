import { PLANS } from '@/lib/plans'
import { getSubscription, isProActive } from '@/lib/subscription'

export async function getSubscriptionSnapshot(userId) {
  if (!userId) {
    return { isPro: false, plan: 'free', status: 'guest', hasBillingAccount: false, dailyLimit: PLANS.free.dailyLimit }
  }

  const subscription = await getSubscription(userId)
  const isPro = isProActive(subscription)

  return {
    isPro,
    plan: isPro ? subscription.plan : 'free',
    status: subscription?.status || 'inactive',
    currentPeriodEnd: subscription?.current_period_end || null,
    cancelAtPeriodEnd: subscription?.cancel_at_period_end || false,
    dailyLimit: isPro ? null : PLANS.free.dailyLimit,
    hasBillingAccount: !!subscription?.stripe_customer_id,
  }
}
