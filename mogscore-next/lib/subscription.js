import { getSupabase } from './supabase'

export async function getSubscription(userId) {
  const supabase = getSupabase()
  if (!supabase || !userId) return null

  try {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .abortSignal(AbortSignal.timeout(8000))
      .maybeSingle()

    return data
  } catch {
    // Supabase unreachable/paused: fail fast instead of hanging the request
    return null
  }
}

export function isProActive(subscription) {
  if (!subscription) return false
  if (subscription.status !== 'active' && subscription.status !== 'trialing') return false
  if (subscription.current_period_end) {
    return new Date(subscription.current_period_end) > new Date()
  }
  return true
}

export async function upsertSubscription(record) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Database not configured')

  const { error } = await supabase.from('subscriptions').upsert(
    { ...record, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  )
  if (error) throw error
}

export async function getSubscriptionByStripeCustomer(stripeCustomerId) {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_customer_id', stripeCustomerId)
    .maybeSingle()

  return data
}

export async function getSubscriptionByStripeSubscriptionId(stripeSubscriptionId) {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .maybeSingle()

  return data
}
