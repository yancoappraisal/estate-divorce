/* =====================================================
   YANCO APPRAISAL SERVICE — Site Interactions
   ===================================================== */

// --- Preloader ---
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('loaded'), 400);
    setTimeout(() => { preloader.style.display = 'none'; }, 900);
  }
});
// Fallback if load takes too long
setTimeout(() => {
  const preloader = document.getElementById('preloader');
  if (preloader && !preloader.classList.contains('loaded')) {
    preloader.classList.add('loaded');
    setTimeout(() => { preloader.style.display = 'none'; }, 500);
  }
}, 4000);

// --- Navbar scroll effect ---
const nav = document.getElementById('mainNav');
if (nav && !nav.classList.contains('scrolled')) {
  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --- Mobile nav toggle ---
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
  // Close on link click
  navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

// --- Scroll animations (IntersectionObserver) ---
const animElements = document.querySelectorAll('.anim-on-scroll');
if (animElements.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '-40px 0px' });
  animElements.forEach(el => observer.observe(el));
}

// --- Counter animation ---
const statNumbers = document.querySelectorAll('.stat-number[data-count]');
if (statNumbers.length && 'IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  statNumbers.forEach(el => counterObserver.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 2000;
  const start = performance.now();
  const suffix = el.dataset.count === '100' ? '%' : '+';

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// --- Smooth anchor scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- Active nav link highlighting ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
if (sections.length && navLinks.length) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id ||
              link.getAttribute('href') === 'index.html#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}

// --- Contact form handler (mailto) ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = {
      'Name': document.getElementById('fullName')?.value,
      'Phone': document.getElementById('phone')?.value,
      'Email': document.getElementById('email')?.value,
      'Role': document.getElementById('role')?.value,
      'Appraisal Type': document.getElementById('serviceType')?.value,
      'Timeline': document.getElementById('timeline')?.value,
      'Property Address': document.getElementById('propertyAddress')?.value,
      'Property Type': document.getElementById('propertyType')?.value,
      'County': document.getElementById('county')?.value,
      'Appraisal Date': document.getElementById('dateNeeded')?.value,
      'Referral Source': document.getElementById('referral')?.value,
      'Details': document.getElementById('details')?.value,
    };

    const subject = encodeURIComponent(
      `Appraisal Request: ${fields['Appraisal Type'] || 'General'} — ${fields['Name'] || 'New Client'}`
    );

    let body = 'NEW APPRAISAL REQUEST\n';
    body += '═══════════════════════════\n\n';
    Object.entries(fields).forEach(([key, val]) => {
      if (val) body += `${key}: ${val}\n`;
    });
    body += '\n═══════════════════════════\n';
    body += 'Submitted via YancoAppraisal.com';

    const mailtoUrl = `mailto:info@yancoappraisal.com?subject=${subject}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    // Show success state
    setTimeout(() => {
      contactForm.style.display = 'none';
      const formTitle = document.querySelector('.form-title');
      if (formTitle) formTitle.style.display = 'none';
      const success = document.getElementById('formSuccess');
      if (success) success.classList.add('active');
    }, 500);
  });
}
