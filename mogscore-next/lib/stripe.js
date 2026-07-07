import Stripe from 'stripe'

let stripeClient = null

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!stripeClient) {
    stripeClient = new Stripe(key)
  }
  return stripeClient
}

/** Stripe Payment Link URLs (sandbox or live) — used when Price IDs are not set. */
export function getPaymentLink(plan) {
  const envKey = plan === 'yearly' ? 'STRIPE_PAYMENT_LINK_YEARLY' : 'STRIPE_PAYMENT_LINK_MONTHLY'
  return process.env[envKey] || null
}

export function buildPaymentLinkUrl(linkUrl, { userId, email }) {
  const url = new URL(linkUrl)
  if (userId) url.searchParams.set('client_reference_id', userId)
  if (email) url.searchParams.set('prefilled_email', email)
  return url.toString()
}

export function planFromSubscription(stripeSub) {
  const priceId = stripeSub.items?.data?.[0]?.price?.id
  if (priceId && priceId === process.env.STRIPE_PRICE_ID_MONTHLY) return 'pro_monthly'
  if (priceId && priceId === process.env.STRIPE_PRICE_ID_YEARLY) return 'pro_yearly'
  const interval = stripeSub.items?.data?.[0]?.price?.recurring?.interval
  if (interval === 'year') return 'pro_yearly'
  if (interval === 'month') return 'pro_monthly'
  return null
}

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: null,
    dailyLimit: 10,
    guestLimit: 3,
    features: [
      '10 AI face analyses per day (signed in)',
      '3 analyses per day (guest)',
      'Full 6-metric MogScore breakdown',
      'Earn bonus uses via points',
    ],
  },
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: 9.99,
    interval: 'month',
    priceEnvKey: 'STRIPE_PRICE_ID_MONTHLY',
    dailyLimit: null,
    features: [
      'Unlimited AI face analyses',
      '1v1 Mog Battle — no daily cap',
      'Priority processing',
      'Cancel anytime from your account',
    ],
  },
  pro_yearly: {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    price: 79.99,
    interval: 'year',
    priceEnvKey: 'STRIPE_PRICE_ID_YEARLY',
    dailyLimit: null,
    features: [
      'Everything in Pro Monthly',
      'Save ~33% vs monthly billing',
      'Unlimited analyses all year',
      'Cancel anytime — access until period end',
    ],
  },
}

export { CONTACT_EMAIL, SUPPORT_EMAIL, mailtoLink } from './contact'
