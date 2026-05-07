// =============================================
// omoggle-it.com — Shared Components
// =============================================

function getNavbar(activePage) {
  const pages = [
    { href: 'index.html',      label: 'Home' },
    { href: 'tools.html',      label: 'Tools' },
    { href: 'blog.html',       label: 'Blog' },
    { href: 'what-is-omoggle.html', label: 'Wiki' },
  ];

  const navLinks = pages.map(p =>
    `<li><a href="${p.href}" class="${activePage === p.href ? 'active' : ''}">${p.label}</a></li>`
  ).join('\n');

  return `
<nav class="navbar" aria-label="Main navigation">
  <div class="navbar-inner">
    <a href="index.html" class="navbar-logo">MogScore<span>.wiki</span></a>
    <ul class="navbar-nav">
      ${navLinks}
      <li><a href="tools.html" class="nav-cta">Try Tools →</a></li>
    </ul>
  </div>
</nav>`;
}

function getFooter() {
  return `
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer-grid">
      <div>
        <span class="footer-brand-name">MogScore</span>
        <p class="footer-desc">Your #1 resource for Omoggle tips, looksmaxxing guides, and AI face analysis tools. For entertainment purposes only.</p>
      </div>
      <div>
        <div class="footer-col-title">Wiki</div>
        <ul class="footer-links">
          <li><a href="what-is-omoggle.html">What is Omoggle?</a></li>
          <li><a href="what-is-mogging.html">What is Mogging?</a></li>
          <li><a href="psl-scale-explained.html">PSL Scale Guide</a></li>
          <li><a href="looksmaxxing-guide.html">Looksmaxxing 101</a></li>
          <li><a href="omoggle-tier-list.html">Tier List</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Tools</div>
        <ul class="footer-links">
          <li><a href="tools.html">All Tools</a></li>
          <li><a href="tools.html#analyzer">AI Face Analyzer</a></li>
          <li><a href="tools.html#battle">1v1 Battle</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Blog</div>
        <ul class="footer-links">
          <li><a href="blog.html">All Articles</a></li>
          <li><a href="how-to-win-omoggle.html">How to Win</a></li>
          <li><a href="xqc-omoggle.html">xQc on Omoggle</a></li>
          <li><a href="twitch-omoggle-rules.html">Twitch Rules</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-copy">© 2026 MogScore.wiki — Not affiliated with Omoggle LLC. For entertainment only.</span>
      <span class="footer-copy">omoggle-it.com</span>
    </div>
  </div>
</footer>`;
}

// FAQ accordion toggle
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      item.classList.toggle('open');
    });
  });
}

document.addEventListener('DOMContentLoaded', initFAQ);
