import { Suspense } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { getCheckoutConfig } from '@/lib/checkout-config'
import PricingContent from './PricingContent'

export const metadata = {
  title: 'Existing Member Billing',
  description: 'Existing Omoggle IT members can review legacy plan information and manage billing. New subscriptions are closed by default.',
  alternates: { canonical: 'https://omoggle-it.com/pricing' },
}

// Reads only env (no auth/DB I/O) so the page renders instantly.
// Subscription status is loaded on the client to avoid blocking navigation.
export default function PricingPage() {
  const checkoutConfig = getCheckoutConfig()

  return (
    <ClerkProvider>
      <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading pricing…</div>}>
        <PricingContent checkoutConfig={checkoutConfig} />
      </Suspense>
    </ClerkProvider>
  )
}
