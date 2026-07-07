import { resolveCheckoutMode } from './checkout-url'

/** Server-side checkout config passed to pricing UI. */
export function getCheckoutConfig() {
  return resolveCheckoutMode()
}
