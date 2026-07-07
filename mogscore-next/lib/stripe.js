import Stripe from 'stripe'
import { PLANS } from './plans'

export { PLANS }

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

export { CONTACT_EMAIL, SUPPORT_EMAIL, mailtoLink } from './contact'
