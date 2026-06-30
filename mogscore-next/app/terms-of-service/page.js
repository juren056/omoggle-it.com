import LegalLayout from '@/components/LegalLayout'
import { getContactEmail } from '@/lib/contact'

export const metadata = {
  title: 'Terms of Service',
  description: 'MogScore Terms of Service — rules for using our AI face analysis tools, subscriptions, and website.',
  alternates: { canonical: 'https://omoggle-it.com/terms-of-service' },
}

export default function TermsOfServicePage() {
  const supportEmail = getContactEmail()
  return (
    <LegalLayout title="Terms of Service" updated="June 30, 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of MogScore.wiki and related services at{' '}
        <strong>omoggle-it.com</strong> (&quot;MogScore&quot;, &quot;we&quot;, &quot;us&quot;). By using our website or tools, you agree to these Terms.
      </p>

      <h2>1. Service Description</h2>
      <p>
        MogScore provides AI-powered facial analysis tools, Omoggle guides, and looksmaxxing content for{' '}
        <strong>entertainment purposes only</strong>. Scores and recommendations are not medical, psychological,
        or professional advice. MogScore is an independent product and is <strong>not affiliated with Omoggle LLC</strong> or any AI model provider.
      </p>

      <h2>2. Eligibility</h2>
      <p>You must be at least <strong>18 years old</strong> to use MogScore. By using the service, you confirm you meet this requirement.</p>

      <h2>3. Account & Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Upload photos of minors or anyone without their consent</li>
        <li>Upload explicit, pornographic, or sexually suggestive content</li>
        <li>Use the service for harassment, discrimination, or illegal purposes</li>
        <li>Attempt to reverse-engineer, scrape, or abuse rate limits or payment systems</li>
        <li>Generate, request, or distribute deepfakes, face-swaps, or manipulated likenesses of real people</li>
      </ul>
      <p>See our <a href="/acceptable-use">Acceptable Use Policy</a> for full details.</p>

      <h2>4. Free & Paid Plans</h2>
      <h3>Free Tier</h3>
      <p>Guest users receive 3 AI analyses per day. Signed-in users receive 10 analyses per day plus optional bonus uses earned through our points system.</p>
      <h3>Pro Subscription</h3>
      <p>
        Pro plans (monthly or yearly) provide unlimited AI analyses during an active subscription period.
        Current pricing is listed on our <a href="/pricing">Pricing page</a>.
      </p>

      <h2>5. Payments & Billing</h2>
      <p>
        Paid subscriptions are processed by <strong>Stripe</strong> (or, where applicable, Creem as Merchant of Record).
        By subscribing, you authorize recurring charges at the displayed price until you cancel.
      </p>
      <ul>
        <li>Prices are shown in USD unless otherwise stated</li>
        <li>Subscriptions auto-renew at the end of each billing period</li>
        <li>You may cancel anytime via <strong>Manage Subscription</strong> in your account menu or on the <a href="/pricing">Pricing page</a></li>
        <li>After cancellation, Pro access continues until the end of the current paid period</li>
      </ul>
      <p>Refunds are governed by our <a href="/refund-policy">Refund Policy</a>.</p>

      <h2>6. Photo Processing</h2>
      <p>
        Photos you upload are processed in real time for analysis and are not stored on our servers after processing completes.
        We do not use your photos to train AI models. See our <a href="/privacy-policy">Privacy Policy</a> for details.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        MogScore content, branding, and website design are owned by MogScore. You may not copy, redistribute, or commercially exploit our content without permission.
      </p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        The service is provided &quot;as is&quot; without warranties of any kind. AI scores may be inaccurate due to lighting,
        camera quality, and other factors. We do not guarantee uninterrupted or error-free service.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, MogScore shall not be liable for indirect, incidental, or consequential damages
        arising from your use of the service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update these Terms. Material changes will be reflected in the &quot;Last updated&quot; date.
        Continued use after changes constitutes acceptance.
      </p>

      <h2>11. Contact</h2>
      <div className="highlight-box">
        <p>
          📧 <strong>Support:</strong> {supportEmail ? (
            <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
          ) : (
            <em>Not configured — set SUPPORT_EMAIL in environment variables</em>
          )}<br />
          🌐 <strong>Website:</strong> <a href="https://omoggle-it.com">omoggle-it.com</a><br />
          📋 <strong>Contact form:</strong> <a href="/contact">Contact Us</a>
        </p>
      </div>
    </LegalLayout>
  )
}
