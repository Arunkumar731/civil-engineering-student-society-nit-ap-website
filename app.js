/* ============================================================
   CESS — NITAP  |  app.js
   ============================================================ */

/* ── MOBILE NAV ── */
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
const navItems  = document.querySelectorAll('.nav-links li');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
}

// Close nav on link click
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }
});


/* ── ACTIVE NAV HIGHLIGHT on SCROLL ── */
const sections = document.querySelectorAll('section[id], div[id]');
const navAs    = document.querySelectorAll('.nav-a');

const onScroll = () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 100) current = sec.getAttribute('id');
  });
  navAs.forEach(a => {
    a.style.background = '';
    a.style.color      = '';
    if (a.getAttribute('href') === '#' + current) {
      a.style.background = 'var(--orange)';
      a.style.color      = '#fff';
    }
  });
};
window.addEventListener('scroll', onScroll, { passive: true });


/* ── IMAGE SLIDESHOW ── */
let slideIdx = 0;
const slides    = document.querySelectorAll('.slide');
const dotsWrap  = document.getElementById('slideDots');
let autoTimer   = null;

// Build dots
if (slides.length && dotsWrap) {
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
}

function goToSlide(n) {
  if (!slides.length) return;
  slides[slideIdx].classList.remove('active');
  dotsWrap.querySelectorAll('.dot')[slideIdx].classList.remove('active');
  slideIdx = (n + slides.length) % slides.length;
  slides[slideIdx].classList.add('active', 'fade-slide');
  dotsWrap.querySelectorAll('.dot')[slideIdx].classList.add('active');
  // Remove animation class after it runs so it can replay
  setTimeout(() => slides[slideIdx].classList.remove('fade-slide'), 900);
}

function changeSlide(dir) {
  clearInterval(autoTimer);
  goToSlide(slideIdx + dir);
  startAuto();
}

function startAuto() {
  autoTimer = setInterval(() => goToSlide(slideIdx + 1), 5000);
}

if (slides.length) {
  slides[0].classList.add('active');
  startAuto();
}

// Make changeSlide globally available (called inline from HTML)
window.changeSlide = changeSlide;


/* ── FOOTER YEAR ── */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();


/* ── SCROLL REVEAL (lightweight, no library) ── */
const revealEls = document.querySelectorAll(
  '.feature-card, .obj-item, .team-card, .message-card'
);
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el, i) => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.08}s, transform 0.5s ease ${(i % 4) * 0.08}s`;
  observer.observe(el);
});
