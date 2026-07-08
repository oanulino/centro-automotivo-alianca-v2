/* Tracking GTM — emite eventos no dataLayer para o GTM processar */
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  function detectLocation(link) {
    if (link.classList.contains('wpp-float')) return 'floating-button';
    var node = link;
    while (node && node !== document.body) {
      if (node.classList) {
        if (node.classList.contains('header'))     return 'header';
        if (node.classList.contains('hero'))        return 'hero';
        if (node.classList.contains('diferenciais'))return 'diferenciais';
        if (node.classList.contains('servicos'))    return 'servicos';
        if (node.classList.contains('sobre'))       return 'sobre';
        if (node.classList.contains('cta-final'))   return 'cta-final';
        if (node.classList.contains('footer'))      return 'footer';
      }
      if (node.dataset && node.dataset.section) return node.dataset.section;
      node = node.parentElement;
    }
    return 'unknown';
  }

  // WhatsApp click
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    var text = (link.textContent || '').trim().substring(0, 50);
    var message = '';
    try { message = new URL(href).searchParams.get('text') || ''; } catch (err) {}
    window.dataLayer.push({
      event: 'whatsapp_click',
      cta_text: text,
      cta_location: detectLocation(link),
      link_url: href,
      message_template: message,
      page_location: window.location.href,
      page_title: document.title,
      ab_variant: 'v2-dm'
    });
  }, true);

  // Phone click
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="tel:"]');
    if (!link) return;
    window.dataLayer.push({
      event: 'phone_click',
      phone_number: (link.getAttribute('href') || '').replace(/^tel:/i, '').trim(),
      cta_text: (link.textContent || '').trim().substring(0, 50),
      cta_location: detectLocation(link),
      ab_variant: 'v2-dm'
    });
  }, true);

  // Scroll depth
  var scrollMarks = { 25: false, 50: false, 75: false, 100: false };
  function checkScroll() {
    var docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    var viewHeight = window.innerHeight;
    var scrollY = window.scrollY || window.pageYOffset;
    var percent = Math.round(((scrollY + viewHeight) / docHeight) * 100);
    [25, 50, 75, 100].forEach(function (mark) {
      if (!scrollMarks[mark] && percent >= mark) {
        scrollMarks[mark] = true;
        window.dataLayer.push({
          event: 'scroll_depth',
          percent: mark,
          ab_variant: 'v2-dm'
        });
      }
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () { checkScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('load', checkScroll);
})();
