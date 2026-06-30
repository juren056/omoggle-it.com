import LegalLayout from '@/components/LegalLayout'
import { SUPPORT_EMAIL } from '@/lib/stripe'

export const metadata = {
  title: 'Acceptable Use Policy',
  description: 'MogScore Acceptable Use Policy — prohibited content and behavior for AI face analysis tools.',
  alternates: { canonical: 'https://omoggle-it.com/acceptable-use' },
}

export default function AcceptableUsePage() {
  return (
    <LegalLayout title="Acceptable Use Policy" updated="June 30, 2026">
      <p>
        This Acceptable Use Policy (&quot;AUP&quot;) defines permitted and prohibited uses of MogScore.wiki (&quot;MogScore&quot;).
        It supplements our <a href="/terms-of-service">Terms of Service</a>.
      </p>

      <h2>1. Purpose of MogScore</h2>
      <p>
        MogScore provides <strong>AI facial analysis for entertainment</strong> — scoring facial metrics, comparing photos,
        and offering looksmaxxing tips. It is <strong>not</strong> a face-generation, face-swap, or deepfake tool.
        MogScore is independent and not affiliated with Omoggle LLC or any AI model provider.
      </p>

      <h2>2. Permitted Use</h2>
      <ul>
        <li>Analyzing your own photos or photos you have explicit permission to use</li>
        <li>Entertainment, self-improvement, and looksmaxxing research</li>
        <li>Comparing two photos in the 1v1 Mog Battle feature with consent from all parties</li>
      </ul>

      <h2>3. Prohibited Content</h2>
      <p>You must <strong>not</strong> upload or process:</p>
      <ul>
        <li>Images of minors (anyone under 18)</li>
        <li>Pornographic, sexually explicit, or sexually suggestive content</li>
        <li>NSFW, nude, or partially nude images</li>
        <li>Violent, hateful, or harassing imagery</li>
        <li>Images used to create deepfakes, face-swaps, or manipulated likenesses of real people</li>
        <li>Content you do not have the legal right to use</li>
      </ul>

      <h2>4. Prohibited Behavior</h2>
      <ul>
        <li>Using MogScore to harass, bully, or publicly shame individuals based on appearance</li>
        <li>Automated scraping, bot abuse, or circumventing rate limits</li>
        <li>Reselling or redistributing MogScore analysis as a commercial service without authorization</li>
        <li>Attempting to extract, reverse-engineer, or replicate our AI systems</li>
        <li>Any illegal activity under applicable law</li>
      </ul>

      <h2>5. AI Analysis Limitations</h2>
      <p>
        MogScore analyzes existing photos — it does <strong>not</strong> generate new images from text prompts.
        Scores are algorithmic estimates for entertainment and may be inaccurate. Do not use results for employment,
        medical, insurance, or legal decisions.
      </p>

      <h2>6. Enforcement</h2>
      <p>
        Violations may result in immediate suspension or termination of your account without refund.
        We may report illegal activity to authorities where required by law.
      </p>

      <h2>7. Reporting Violations</h2>
      <p>
        To report abuse, contact <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>

      <h2>8. Changes</h2>
      <p>We may update this AUP. Continued use after changes constitutes acceptance.</p>
    </LegalLayout>
  )
}
