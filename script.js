const galleryImages = [
  { src: 'assets/local1.jpeg',    alt: 'Estúdio de pilates moderno e elegante' },
  { src: 'assets/local2.jpeg',    alt: 'Exercício de pilates no solo' },
 { src: 'assets/exercicio1.jpeg', alt: 'Pilates reformer em detalhe',  objPos: 'center top' },
  { src: 'assets/exercicio2.jpeg',alt: 'Sessão de alongamento' },
  { src: 'assets/galeria.jpeg',    alt: 'Clínica de fisioterapia',      objPos: 'center 35%' },
  { src: 'assets/exercicio4.jpeg',alt: 'Pilates com bola' },
  { src: 'assets/exercicio5.jpeg',alt: 'Pilates com bola' },
  { src: 'assets/exercicio6.jpeg',alt: 'Pilates com bola' },
  { src: 'assets/exercicio7.jpeg',alt: 'Pilates com bola' },
];
document.querySelectorAll('.gallery-grid .gallery-item img').forEach((img, i) => {
  if (galleryImages[i]?.objPos) {
    img.style.objectPosition = galleryImages[i].objPos;
  }
});

/* ==============================
   ESTADO GLOBAL
============================== */
let mobileOpen    = false;
let lightboxIndex = 0;
let lightboxOpen  = false;

/* ==============================
   REFERÊNCIAS DOM
============================== */
const loader       = document.getElementById('loader');
const siteHeader   = document.getElementById('siteHeader');
const mobileNav    = document.getElementById('mobileNav');
const scrollBar    = document.getElementById('scrollProgress');
const contactModal = document.getElementById('contactModal');
const galleryModal = document.getElementById('galleryModal');
const lightboxImg  = document.getElementById('lightboxImage');
const heroBg       = document.querySelector('.hero-bg');

/* ==============================
   SCROLL SUAVE
============================== */
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ==============================
   MENU MOBILE
============================== */
function toggleMenu() {
  mobileOpen = !mobileOpen;
  const menuBtn = document.getElementById('menuBtn');
  mobileNav.classList.toggle('open', mobileOpen);
  document.getElementById('mobileOverlay').classList.toggle('active', mobileOpen);
  if (menuBtn) menuBtn.classList.toggle('active', mobileOpen);
  document.body.style.overflow = mobileOpen ? 'hidden' : '';
}

function closeMenu() {
  mobileOpen = false;
  const menuBtn = document.getElementById('menuBtn');
  mobileNav.classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('active');
  if (menuBtn) menuBtn.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==============================
   MODAL DE CONTATO
============================== */
function openContact() {
  contactModal.classList.add('open');
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeContact() {
  contactModal.classList.remove('open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==============================
   LIGHTBOX
============================== */
function openLightbox(index) {
  lightboxIndex = index;
  lightboxOpen  = true;
  lightboxImg.src = galleryImages[index].src;
  lightboxImg.alt = galleryImages[index].alt;
  galleryModal.classList.add('open');
  galleryModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxOpen = false;
  galleryModal.classList.remove('open');
  galleryModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[lightboxIndex].src;
  lightboxImg.alt = galleryImages[lightboxIndex].alt;
}

/* ==============================
   TECLADO
============================== */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeContact(); closeLightbox(); closeMenu(); }
  if (lightboxOpen) {
    if (e.key === 'ArrowLeft')  navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  }
});

/* ==============================
   SCROLL: header + barra + parallax
============================== */
window.addEventListener('scroll', function() {
  siteHeader.classList.toggle('scrolled', window.scrollY > 50);
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
  scrollBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  if (heroBg) {
    const offset = Math.min(window.scrollY * 0.2, 160);
    heroBg.style.backgroundPosition = 'center ' + offset + 'px';
  }
}, { passive: true });

/* ==============================
   CONTADORES ANIMADOS
============================== */
function setupCounters() {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      const card    = entry.target;
      const valueEl = card.querySelector('[data-counter-value]');
      const end     = Number(card.getAttribute('data-counter'));
      const suffix  = card.getAttribute('data-suffix') || '';
      if (isNaN(end) || !valueEl) { observer.unobserve(card); return; }
      const start = performance.now();
      const dur   = 1400;
      (function tick(now) {
        const p      = Math.min((now - start) / dur, 1);
        const eased  = 1 - Math.pow(1 - p, 3);
        valueEl.textContent = Math.floor(end * eased) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(tick);
      })(start);
      observer.unobserve(card);
    });
  }, { threshold: 0.45 });
  document.querySelectorAll('.stat-card').forEach(function(c) { observer.observe(c); });
}

/* ==============================
   REVEAL AO SCROLL
============================== */
function setupReveal() {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
}

/* ==============================
   CARROSSEL DE SERVIÇOS
============================== */
var SVC_TOTAL    = 4;
var SVC_INTERVAL = 6000;
var svcCurrent   = 0;
var svcProgress  = 0;
var svcProgTimer = null;

function goToSlide(n, dir) {
  var slides   = document.querySelectorAll('.svc-slide');
  var barItems = document.querySelectorAll('.svc-bar-item');
  if (n === svcCurrent || !slides.length) return;

  var exitClass = (dir === 'prev' || (dir === undefined && n < svcCurrent))
    ? 'exit-right' : 'exit-left';

  slides[svcCurrent].classList.remove('active');
  slides[svcCurrent].classList.add(exitClass);
  barItems[svcCurrent].classList.remove('active');

  var prev = svcCurrent;
  svcCurrent = n;

  setTimeout(function() {
    if (slides[prev]) slides[prev].classList.remove(exitClass);
  }, 800);

  slides[svcCurrent].classList.add('active');
  barItems[svcCurrent].classList.add('active');
  resetSvcProgress();
}

function nextSlide() {
  goToSlide((svcCurrent + 1) % SVC_TOTAL, 'next');
}

function prevSlide() {
  goToSlide((svcCurrent - 1 + SVC_TOTAL) % SVC_TOTAL, 'prev');
}

function resetSvcProgress() {
  clearInterval(svcProgTimer);
  svcProgress = 0;
  for (var i = 0; i < SVC_TOTAL; i++) {
    var p = document.getElementById('prog' + i);
    if (p) p.style.width = '0%';
  }
  startSvcProgress();
}

function startSvcProgress() {
  var step = 100 / (SVC_INTERVAL / 80);
  svcProgTimer = setInterval(function() {
    svcProgress += step;
    var p = document.getElementById('prog' + svcCurrent);
    if (p) p.style.width = Math.min(svcProgress, 100) + '%';
    if (svcProgress >= 100) {
      clearInterval(svcProgTimer);
      nextSlide();
    }
  }, 80);
}

function setupSvcCarousel() {
  var slides = document.querySelectorAll('.svc-slide');
  if (!slides.length) return;

  var track = document.getElementById('svcTrack');
  if (track) {
    var touchStartX = 0;
    track.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function(e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); }
    });
  }

  startSvcProgress();
}

/* ==============================
   INICIALIZAÇÃO
============================== */
function init() {
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
  }
  setupCounters();
  setupReveal();
  setupSvcCarousel();
  setTimeout(function() {
    loader.classList.add('hidden');
    document.body.classList.add('app-ready');
  }, 1600);
}

document.addEventListener('DOMContentLoaded', init);