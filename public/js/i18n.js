// i18n.js — Language detection and switcher
(function() {
  const LANGS = {
    en: { label: 'EN', name: 'English',    path: '' },
    ja: { label: 'JP', name: '日本語',      path: '/ja' },
    pt: { label: 'PT', name: 'Português',  path: '/pt' },
    ru: { label: 'RU', name: 'Русский',    path: '/ru' },
  };

  const PAGES = {
    'index.html':              { ja: 'index.html', pt: 'index.html', ru: 'index.html' },
    'what-is-omoggle.html':    { ja: 'what-is-omoggle.html', pt: 'what-is-omoggle.html', ru: 'what-is-omoggle.html' },
    'tools.html':              { ja: 'tools.html', pt: 'tools.html', ru: 'tools.html' },
  };

  function getCurrentPage() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    if (['ja','pt','ru'].includes(parts[0])) {
      return { lang: parts[0], page: parts[1] || 'index.html' };
    }
    return { lang: 'en', page: parts[parts.length-1] || 'index.html' };
  }

  function getLangUrl(targetLang) {
    const { page } = getCurrentPage();
    const pageName = page || 'index.html';
    if (targetLang === 'en') return '/' + pageName;
    return '/' + targetLang + '/' + pageName;
  }

  function setStoredLang(lang) {
    try { localStorage.setItem('preferred_lang', lang); } catch(e) {}
  }

  function getStoredLang() {
    try { return localStorage.getItem('preferred_lang'); } catch(e) { return null; }
  }

  // Build language switcher UI
  function buildSwitcher() {
    const { lang: currentLang } = getCurrentPage();
    const wrap = document.getElementById('lang-switcher');
    if (!wrap) return;

    wrap.innerHTML = Object.entries(LANGS).map(([code, info]) => {
      const active = code === currentLang ? 'lang-btn-active' : '';
      return `<a href="${getLangUrl(code)}" class="lang-btn ${active}" onclick="setLang('${code}')">${info.label}</a>`;
    }).join('');
  }

  // Auto-detect on first visit
  async function autoDetect() {
    const stored = getStoredLang();
    if (stored) return; // user already chose

    const { lang: currentLang } = getCurrentPage();

    try {
      const res = await fetch('/api/detect-lang');
      const data = await res.json();
      const detectedLang = data.lang || 'en';

      if (detectedLang !== 'en' && detectedLang !== currentLang) {
        setStoredLang(detectedLang);
        window.location.href = getLangUrl(detectedLang);
      }
    } catch(e) {}
  }

  window.setLang = function(lang) {
    setStoredLang(lang);
  };

  document.addEventListener('DOMContentLoaded', function() {
    buildSwitcher();
    autoDetect();
  });
})();
