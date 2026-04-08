/* =============================================
   THE HAIR COMPANY — MAIN JS
   ============================================= */

'use strict';

// ---- HEADER SCROLL ----
const header = document.querySelector('.site-header');
function handleHeaderScroll() {
  if (window.scrollY > 60) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll();

// ---- MOBILE NAV ----
const hamburger  = document.querySelector('.nav-hamburger');
const navDrawer  = document.querySelector('.nav-drawer');
const drawerClose = document.querySelector('.drawer-close');
const drawerLinks = document.querySelectorAll('.nav-drawer a');

function openDrawer() {
  navDrawer?.classList.add('open');
  navDrawer.style.display = 'flex';
  hamburger?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  navDrawer?.classList.remove('open');
  hamburger?.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { if (navDrawer && !navDrawer.classList.contains('open')) navDrawer.style.display = 'none'; }, 300);
}

hamburger?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

// ---- ACTIVE NAV LINK ----
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ---- TESTIMONIAL SLIDER ----
const track = document.querySelector('.testimonial-track');
const slides = document.querySelectorAll('.testimonial-slide');
const dots   = document.querySelectorAll('.slider-dot');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');
let currentSlide = 0;
let autoSlide;

function goToSlide(n) {
  currentSlide = (n + slides.length) % slides.length;
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}
function startAutoSlide() {
  autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
}
function stopAutoSlide() { clearInterval(autoSlide); }

if (slides.length > 0) {
  prevBtn?.addEventListener('click', () => { stopAutoSlide(); goToSlide(currentSlide - 1); startAutoSlide(); });
  nextBtn?.addEventListener('click', () => { stopAutoSlide(); goToSlide(currentSlide + 1); startAutoSlide(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAutoSlide(); goToSlide(i); startAutoSlide(); }));
  goToSlide(0);
  startAutoSlide();

  // Touch swipe on slider
  let touchStartX = 0;
  track?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { stopAutoSlide(); goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1); startAutoSlide(); }
  }, { passive: true });
}

// ---- FAQ ACCORDION ----
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ---- SCROLL ANIMATIONS ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.service-card, .team-card, .blog-card, .gallery-item, .faq-item, .stat-item, .feature-item, .testimonial-text').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  observer.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  // Add visible class via style on intersection
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.service-card, .team-card, .blog-card, .gallery-item, .faq-item, .stat-item, .feature-item').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    revealObserver.observe(el);
  });
});

// ---- BACK TO TOP ----
const btt = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  btt?.classList.toggle('show', window.scrollY > 600);
}, { passive: true });
btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- COOKIE BANNER ----
const cookieBanner = document.querySelector('.cookie-banner');
const cookieAccept = document.querySelector('.cookie-accept');
const cookieDecline = document.querySelector('.cookie-decline');

if (!localStorage.getItem('thc-cookie-consent')) {
  setTimeout(() => cookieBanner?.classList.add('show'), 1500);
}
cookieAccept?.addEventListener('click', () => {
  localStorage.setItem('thc-cookie-consent', 'accepted');
  cookieBanner?.classList.remove('show');
});
cookieDecline?.addEventListener('click', () => {
  localStorage.setItem('thc-cookie-consent', 'declined');
  cookieBanner?.classList.remove('show');
});

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ---- GALLERY LIGHTBOX ----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
let galleryImages = [];
let lightboxIndex = 0;

document.querySelectorAll('.gallery-item').forEach((item, i) => {
  const img = item.querySelector('img');
  if (img) galleryImages.push(img.src);
  item.addEventListener('click', () => openLightbox(i));
});

function openLightbox(idx) {
  if (!lightbox) return;
  lightboxIndex = idx;
  lightboxImg.src = galleryImages[idx];
  lightbox.style.display = 'flex';
  setTimeout(() => lightbox.style.opacity = '1', 10);
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (!lightbox) return;
  lightbox.style.opacity = '0';
  setTimeout(() => { lightbox.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
}
function lightboxNavigate(dir) {
  lightboxIndex = (lightboxIndex + dir + galleryImages.length) % galleryImages.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = galleryImages[lightboxIndex];
    lightboxImg.style.opacity = '1';
  }, 200);
}

lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', () => lightboxNavigate(-1));
lightboxNext?.addEventListener('click', () => lightboxNavigate(1));
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox || lightbox.style.display !== 'flex') return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxNavigate(-1);
  if (e.key === 'ArrowRight') lightboxNavigate(1);
});

// ---- SMOOTH HASH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = header ? header.offsetHeight + 20 : 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// ---- FORM VALIDATION ----
document.querySelectorAll('form[data-validate]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e53e3e';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    if (valid) {
      const successMsg = form.querySelector('.form-success');
      if (successMsg) {
        form.style.display = 'none';
        successMsg.style.display = 'block';
      }
    }
  });
});
