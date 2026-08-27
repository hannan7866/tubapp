/**
 * TUBA KHAN PORTFOLIO — 2026 3D INTERACTIVITY & ANIMATION ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initCustomCursor();
  initBackgroundCanvas();
  init3DTilt();
  initScrollReveal();
  initParallax();
  initNavigation();
});

/* ==========================================================================
   1. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener(
    'scroll',
    () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    },
    { passive: true }
  );
}

/* ==========================================================================
   2. CUSTOM 3D CURSOR (DESKTOP)
   ========================================================================== */
function initCustomCursor() {
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorDot || !cursorGlow) return;

  let mouseX = -100;
  let mouseY = -100;
  let dotX = -100;
  let dotY = -100;
  let glowX = -100;
  let glowY = -100;
  let hasMoved = false;

  window.addEventListener(
    'mousemove',
    (e) => {
      if (!hasMoved) {
        hasMoved = true;
        cursorDot.style.opacity = '1';
        cursorGlow.style.opacity = '1';
        dotX = glowX = e.clientX;
        dotY = glowY = e.clientY;
      }
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true }
  );

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorGlow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (hasMoved) {
      cursorDot.style.opacity = '1';
      cursorGlow.style.opacity = '1';
    }
  });

  function animateCursor() {
    if (hasMoved) {
      dotX += (mouseX - dotX) * 0.45;
      dotY += (mouseY - dotY) * 0.45;
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;

      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
    }

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Hover states on interactive elements
  const hoverables = document.querySelectorAll('a, button, [data-tilt], input, textarea');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => cursorGlow.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorGlow.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   3. 3D INTERACTIVE PARTICLE CANVAS
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: width / 2, y: height / 2, radius: 120 };
  let scrollSpeed = 0;
  let lastScrollY = window.pageYOffset;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  window.addEventListener(
    'mousemove',
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    'scroll',
    () => {
      const currentScrollY = window.pageYOffset;
      scrollSpeed = (currentScrollY - lastScrollY) * 0.1;
      lastScrollY = currentScrollY;
    },
    { passive: true }
  );

  // Particle constellation
  let particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 20000), 65);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.z = Math.random() * 2 + 0.5; // 3D depth
      this.vx = (Math.random() - 0.5) * 0.35 * this.z;
      this.vy = (Math.random() - 0.5) * 0.35 * this.z;
      this.radius = Math.random() * 1.6 * this.z + 0.5;
      this.color = Math.random() > 0.4 ? 'rgba(99, 102, 241,' : 'rgba(6, 182, 212,';
      this.alpha = Math.random() * 0.4 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy + scrollSpeed * 0.08 * this.z;

      // Mouse subtle repulsion
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (1 - dist / mouse.radius) * 1.2;
        this.x -= (dx / dist) * force;
        this.y -= (dy / dist) * force;
      }

      // Wrap boundaries
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.alpha * 0.7})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  createParticles();

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Fade scroll speed decay
    scrollSpeed *= 0.92;

    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   4. 3D CARD TILT PHYSICS
   ========================================================================== */
function init3DTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt degrees (Max 6 deg for subtle high-end feel)
      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   5. SCROLL-TRIGGERED 3D REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   6. 3D PARALLAX DEPTH ON SCROLL
   ========================================================================== */
function initParallax() {
  const backdropText = document.getElementById('heroBackdrop');

  window.addEventListener(
    'scroll',
    () => {
      const scrolled = window.pageYOffset;
      if (backdropText && scrolled < window.innerHeight) {
        backdropText.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.22}px))`;
        backdropText.style.opacity = `${Math.max(0, 1 - scrolled / (window.innerHeight * 0.65))}`;
      }
    },
    { passive: true }
  );
}

/* ==========================================================================
   7. NAVIGATION & ACTIVE SECTION HIGHLIGHTER
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav__link');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('nav__links--open');
      mobileToggle.classList.toggle('nav__mobile-toggle--active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking a link
    navItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav__links--open');
        mobileToggle.classList.remove('nav__mobile-toggle--active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu when tapping outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('nav__links--open')) {
        if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
          navLinks.classList.remove('nav__links--open');
          mobileToggle.classList.remove('nav__mobile-toggle--active');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // Active section tracking with scroll position
  const sections = [
    { id: 'contact', el: document.getElementById('contact') },
    { id: 'beat', el: document.getElementById('beat') },
    { id: 'portfolio', el: document.getElementById('portfolio') },
    { id: 'about', el: document.getElementById('about') },
    { id: 'home', el: document.getElementById('home') },
  ].filter(s => s.el !== null);

  function updateActiveNav() {
    const scrollPosition = window.pageYOffset + 220;

    for (const section of sections) {
      const top = section.el.offsetTop;
      if (scrollPosition >= top) {
        navItems.forEach((link) => {
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('nav__link--active');
          } else {
            link.classList.remove('nav__link--active');
          }
        });
        break;
      }
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}
