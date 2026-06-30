export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <span className="footer-brand-name">MogScore</span>
            <p className="footer-desc">Your #1 Omoggle resource. Not affiliated with Omoggle LLC. For entertainment only.</p>
          </div>
          <div>
            <div className="footer-col-title">Wiki</div>
            <ul className="footer-links">
              <li><a href="/what-is-omoggle">What is Omoggle?</a></li>
              <li><a href="/psl-scale-explained">PSL Scale</a></li>
              <li><a href="/omoggle-tier-list">Tier List</a></li>
              <li><a href="/looksmaxxing-glossary">Glossary</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Guides</div>
            <ul className="footer-links">
              <li><a href="/looksmaxxing-guide">Looksmaxxing 101</a></li>
              <li><a href="/how-to-win-omoggle">How to Win</a></li>
              <li><a href="/hunter-eyes-guide">Hunter Eyes</a></li>
              <li><a href="/face-fat-loss-guide">Face Fat Loss</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            <ul className="footer-links">
              <li><a href="/terms-of-service">Terms of Service</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/refund-policy">Refund Policy</a></li>
              <li><a href="/acceptable-use">Acceptable Use</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 MogScore.wiki — Not affiliated with Omoggle LLC. For entertainment only.</span>
          <span className="footer-copy">
            <a href="/pricing">Pricing</a> · <a href="/privacy-policy">Privacy</a> · <a href="/terms-of-service">Terms</a> · <a href="/contact">Contact</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
