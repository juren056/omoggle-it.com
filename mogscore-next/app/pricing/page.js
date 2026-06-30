import { Suspense } from 'react'
import PricingContent from './PricingContent'

export const metadata = {
  title: 'Pricing — MogScore Pro Plans',
  description: 'MogScore pricing: Free AI face analyzer with daily limits, or Pro for unlimited analyses. Cancel anytime.',
  alternates: { canonical: 'https://omoggle-it.com/pricing' },
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading pricing…</div>}>
      <PricingContent />
    </Suspense>
  )
}
