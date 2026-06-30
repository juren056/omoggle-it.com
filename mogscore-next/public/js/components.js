// FAQ accordion
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      item.classList.toggle('open');
      q.setAttribute('aria-expanded', item.classList.contains('open'));
    });
  });
}

async function hydrateContactEmail() {
  var els = document.querySelectorAll('[data-env-contact-email]');
  if (!els.length) return;

  var email = window.__SITE_CONTACT_EMAIL__ || window.__CONTACT_EMAIL__;
  if (!email) {
    try {
      var res = await fetch('/api/site-config');
      var data = await res.json();
      email = data.contactEmail;
    } catch (_) {}
  }
  if (!email) return;

  window.__SITE_CONTACT_EMAIL__ = email;
  window.__CONTACT_EMAIL__ = email;

  els.forEach(function (el) {
    el.textContent = email;
    if (el.tagName === 'A') el.href = 'mailto:' + email;
  });

  document.querySelectorAll('script[data-contact-email-script]').forEach(function (script) {
    try { eval(script.textContent); } catch (_) {}
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initFAQ();
  hydrateContactEmail();
});
