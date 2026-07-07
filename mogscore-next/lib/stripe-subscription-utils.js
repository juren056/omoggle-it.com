/** Read billing period end from Stripe subscription (handles API version field changes). */
export function subscriptionPeriodEndIso(stripeSub) {
  const candidates = [
    stripeSub?.current_period_end,
    stripeSub?.items?.data?.[0]?.current_period_end,
  ]
  for (const ts of candidates) {
    if (typeof ts === 'number' && ts > 0) {
      const d = new Date(ts * 1000)
      if (!Number.isNaN(d.getTime())) return d.toISOString()
    }
  }
  return null
}

export function subscriptionPayload(stripeSub, clerkUserId, plan) {
  return {
    user_id: clerkUserId,
    stripe_customer_id: typeof stripeSub.customer === 'string' ? stripeSub.customer : stripeSub.customer?.id,
    stripe_subscription_id: stripeSub.id,
    status: stripeSub.status,
    plan,
    current_period_end: subscriptionPeriodEndIso(stripeSub),
    cancel_at_period_end: stripeSub.cancel_at_period_end ?? false,
  }
}
