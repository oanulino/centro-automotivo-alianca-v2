/* Scroll reveal — anima seções ao entrar na tela (uma vez só) */
(function () {
  'use strict';

  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function (el) { io.observe(el); });
})();

/* Tracking — emite eventos no dataLayer para o GTM processar */
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  /**
   * Detecta em qual seção o link está, percorrendo ancestrais
   * por classes/data attributes conhecidas.
   */
  function detectLocation(link) {
    if (link.classList.contains('wpp-float')) return 'floating-button';
    var node = link;
    while (node && node !== document.body) {
      if (node.classList) {
        if (node.classList.contains('header'))     return 'header';
        if (node.classList.contains('hero'))        return 'hero';
        if (node.classList.contains('servicos'))    return 'servicos';
        if (node.classList.contains('diferenciais'))return 'diferenciais';
        if (node.classList.contains('equipe'))      return 'equipe';
        if (node.classList.contains('como-funciona')) return 'como-funciona';
        if (node.classList.contains('avaliacoes'))  return 'avaliacoes';
        if (node.classList.contains('localizacao')) return 'localizacao';
        if (node.classList.contains('faq'))         return 'faq';
        if (node.classList.contains('footer'))      return 'footer';
        if (node.classList.contains('cta-final'))   return 'cta-final';
      }
      if (node.dataset && node.dataset.section) return node.dataset.section;
      node = node.parentElement;
    }
    return 'unknown';
  }

  // ====== WHATSAPP CLICK TRACKING ======
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"], a[href*="api.whatsapp"]');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    var text = (link.textContent || '').trim().substring(0, 50);
    var location = detectLocation(link);

    var message = '';
    try {
      var url = new URL(href);
      message = url.searchParams.get('text') || '';
    } catch (err) {}

    window.dataLayer.push({
      event: 'whatsapp_click',
      cta_text: text,
      cta_location: location,
      link_url: href,
      message_template: message,
      page_location: window.location.href,
      page_title: document.title
    });
  }, true);

  // ====== PHONE CLICK TRACKING ======
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="tel:"]');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    var phone = href.replace(/^tel:/i, '').trim();
    var text = (link.textContent || '').trim().substring(0, 50);
    var location = detectLocation(link);

    window.dataLayer.push({
      event: 'phone_click',
      phone_number: phone,
      cta_text: text,
      cta_location: location,
      page_location: window.location.href,
      page_title: document.title
    });
  }, true);

  // ====== VIEW SECTION TRACKING (IntersectionObserver) ======
  if ('IntersectionObserver' in window) {
    // Seções com ID ou classe que fazem sentido trackear
    var sections = document.querySelectorAll('section[id], .hero, .servicos, .diferenciais, .equipe, .como-funciona, .avaliacoes, .localizacao, .faq, footer, .cta-final');
    var seen = {}; // garante que cada seção emite 1x só

    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen[entry.target.id || entry.target.className]) {
          var id = entry.target.id || '';
          var name = id || entry.target.className.split(' ')[0] || 'unknown';
          seen[entry.target.id || entry.target.className] = true;
          io2.unobserve(entry.target);

          window.dataLayer.push({
            event: 'view_section',
            section_name: name,
            section_id: id,
            page_location: window.location.href,
            page_title: document.title
          });
        }
      });
    }, { threshold: 0.4, rootMargin: '0px 0px -10% 0px' });

    sections.forEach(function (s) { io2.observe(s); });
  }

  // ====== SCROLL DEPTH TRACKING (25/50/75/100%) ======
  var scrollMarks = { 25: false, 50: false, 75: false, 100: false };
  function checkScroll() {
    var docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    var viewHeight = window.innerHeight;
    var scrollY = window.scrollY || window.pageYOffset;
    var percent = Math.round(((scrollY + viewHeight) / docHeight) * 100);

    [25, 50, 75, 100].forEach(function (mark) {
      if (!scrollMarks[mark] && percent >= mark) {
        scrollMarks[mark] = true;
        window.dataLayer.push({
          event: 'scroll_depth',
          percent: mark,
          page_location: window.location.href,
          page_title: document.title
        });
      }
    });
  }
  // Throttle com requestAnimationFrame
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        checkScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  // Checa no load (caso a página já esteja rolada)
  window.addEventListener('load', checkScroll);
})();
