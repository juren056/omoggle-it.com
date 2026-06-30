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
