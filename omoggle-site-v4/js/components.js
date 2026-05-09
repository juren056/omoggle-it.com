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
document.addEventListener('DOMContentLoaded', initFAQ);
