// Galeria — comportamento da página (grid de fotos + lightbox)
document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Fecha o menu mobile ao clicar em um link ou fora dele
  if (toggle && nav) {
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Animações de entrada ao rolar a página.
  // O conteúdo já é visível por padrão (ver base.css) — aqui só
  // adicionamos o estado "pendente" quando dá pra garantir que ele
  // será revertido, para nunca esconder conteúdo permanentemente.
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    revealEls.forEach(function (el) { el.classList.add('reveal-pending'); });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });

    // Rede de segurança: garante que nada fique invisível para sempre.
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.remove('reveal-pending'); });
    }, 4000);
  }

  // ---- Lightbox ----
  var items = Array.prototype.slice.call(document.querySelectorAll('.galeria-item'));
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    var item = items[currentIndex];
    lightboxImg.src = item.getAttribute('data-full');
    lightboxImg.alt = item.querySelector('img').alt;
    lightboxCaption.textContent = item.getAttribute('data-caption') || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNext(step) {
    currentIndex = (currentIndex + step + items.length) % items.length;
    openLightbox(currentIndex);
  }

  items.forEach(function (item, index) {
    item.addEventListener('click', function () { openLightbox(index); });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', function () { showNext(-1); });
  nextBtn.addEventListener('click', function () { showNext(1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showNext(-1);
    if (e.key === 'ArrowRight') showNext(1);
  });
});
