import { Suspense } from 'react'
import { auth } from '@clerk/nextjs/server'
import { getCheckoutConfig } from '@/lib/checkout-config'
import { getSubscriptionSnapshot } from '@/lib/subscription-snapshot'
import PricingContent from './PricingContent'

export const metadata = {
  title: 'Pricing — MogScore Pro Plans',
  description: 'MogScore pricing: Free AI face analyzer with daily limits, or Pro for unlimited analyses. Cancel anytime.',
  alternates: { canonical: 'https://omoggle-it.com/pricing' },
}

export default async function PricingPage() {
  const { userId } = await auth()
  const [initialSubscription, checkoutConfig] = await Promise.all([
    getSubscriptionSnapshot(userId),
    Promise.resolve(getCheckoutConfig()),
  ])

  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading pricing…</div>}>
      <PricingContent initialSubscription={initialSubscription} checkoutConfig={checkoutConfig} />
    </Suspense>
  )
}
