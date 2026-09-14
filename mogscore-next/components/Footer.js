import { getContactEmail } from '@/lib/contact'
import Link from 'next/link'

export default function Footer() {
  const email = getContactEmail()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <span className="footer-brand-name">Omoggle IT</span>
            <p className="footer-desc">Omoggle practice, PSL and looksmaxxing tools for entertainment and educational use. Not affiliated with Omoggle LLC.</p>
          </div>
          <div>
            <div className="footer-col-title">Wiki</div>
            <ul className="footer-links">
              <li><Link href="/omoggle-practice-test">Omoggle Practice</Link></li>
              <li><Link href="/psl-test">PSL Test</Link></li>
              <li><Link href="/psl-scale">PSL Scale</Link></li>
              <li><Link href="/mog-score">Mog Score</Link></li>
              <li><Link href="/face-shape-detector">Face Shape Detector</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Guides</div>
            <ul className="footer-links">
              <li><Link href="/looksmaxxing-guide">Looksmaxxing 101</Link></li>
              <li><Link href="/how-to-win-omoggle">How to Win</Link></li>
              <li><Link href="/hunter-eyes-guide">Hunter Eyes</Link></li>
              <li><Link href="/face-shape-guide">Face Shape</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            <ul className="footer-links">
              <li><Link href="/terms-of-service">Terms of Service</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/refund-policy">Refund Policy</Link></li>
              <li><Link href="/acceptable-use">Acceptable Use</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/about">About</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Omoggle IT — Not affiliated with Omoggle LLC. For entertainment and educational use only.</span>
          <span className="footer-copy">
            {email ? (
              <>
                <a href={`mailto:${email}`}>{email}</a>
                {' · '}
              </>
            ) : null}
            <Link href="/account">Existing member account</Link> · <Link href="/privacy-policy">Privacy</Link> · <Link href="/terms-of-service">Terms</Link> · <Link href="/contact">Contact</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
