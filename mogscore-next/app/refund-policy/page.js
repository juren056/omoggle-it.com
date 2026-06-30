import LegalLayout from '@/components/LegalLayout'
import { SUPPORT_EMAIL } from '@/lib/stripe'

export const metadata = {
  title: 'Refund Policy',
  description: 'MogScore refund policy for Pro subscriptions and digital services.',
  alternates: { canonical: 'https://omoggle-it.com/refund-policy' },
}

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund Policy" updated="June 30, 2026">
      <p>
        This Refund Policy applies to paid subscriptions and digital services purchased through MogScore.wiki at{' '}
        <strong>omoggle-it.com</strong>.
      </p>

      <h2>1. Subscription Refunds</h2>
      <h3>7-Day Satisfaction Guarantee</h3>
      <p>
        If you subscribe to MogScore Pro and are not satisfied, you may request a <strong>full refund within 7 days</strong> of your initial purchase,
        provided you have not substantially used the unlimited analysis feature (defined as more than 50 analyses during that period).
      </p>
      <h3>Renewals</h3>
      <p>
        Subscription renewals are generally <strong>non-refundable</strong>. If you do not wish to be charged again, cancel before your renewal date
        via <strong>Manage Subscription</strong> in your account or on the <a href="/pricing">Pricing page</a>.
      </p>

      <h2>2. Cancellation Policy</h2>
      <ul>
        <li>You may cancel your subscription at any time</li>
        <li>Cancellation takes effect at the <strong>end of the current billing period</strong></li>
        <li>You retain Pro access until the period ends — no partial refunds for unused days within a billing cycle</li>
        <li>After cancellation, your account reverts to the Free tier automatically</li>
      </ul>
      <p>
        To cancel: sign in → open your account menu → <strong>Manage Subscription</strong> → cancel in the Stripe billing portal.
      </p>

      <h2>3. How to Request a Refund</h2>
      <p>Email us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with:</p>
      <ul>
        <li>Your account email address</li>
        <li>Date of purchase</li>
        <li>Reason for the refund request</li>
      </ul>
      <p>We respond within <strong>3 business days</strong>. Approved refunds are processed within 5–10 business days to your original payment method.</p>

      <h2>4. Chargebacks</h2>
      <p>
        Please contact us before initiating a chargeback. Unauthorized chargebacks may result in account suspension.
      </p>

      <h2>5. Free Tier</h2>
      <p>The Free tier involves no payment and is not subject to refunds.</p>

      <h2>6. Contact</h2>
      <div className="highlight-box">
        <p>
          📧 <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a><br />
          📋 <a href="/contact">Contact form</a>
        </p>
      </div>
    </LegalLayout>
  )
}
