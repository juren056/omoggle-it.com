import { Suspense } from 'react'
import { getCheckoutConfig } from '@/lib/checkout-config'
import PricingContent from './PricingContent'

export const metadata = {
  title: 'Pricing — MogScore Pro Plans',
  description: 'MogScore pricing: Free AI face analyzer with daily limits, or Pro for unlimited analyses. Cancel anytime.',
  alternates: { canonical: 'https://omoggle-it.com/pricing' },
}

// Reads only env (no auth/DB I/O) so the page renders instantly.
// Subscription status is loaded on the client to avoid blocking navigation.
export default function PricingPage() {
  const checkoutConfig = getCheckoutConfig()

  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading pricing…</div>}>
      <PricingContent checkoutConfig={checkoutConfig} />
    </Suspense>
  )
}
