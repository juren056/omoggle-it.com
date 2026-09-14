import { resolveCheckoutMode } from './checkout-url'

/** Server-side checkout config passed to pricing UI. */
export function getCheckoutConfig() {
  return { ...resolveCheckoutMode(), newSubscriptionsEnabled: process.env.NEW_SUBSCRIPTIONS_ENABLED === 'true' }
}
