// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileToggle = document.querySelector('.nav__mobile-toggle');
  const navLinks = document.querySelector('.nav__links');
  const navLinkItems = document.querySelectorAll('.nav__link');
  
  // Toggle mobile menu
  mobileToggle.addEventListener('click', function() {
    navLinks.classList.toggle('nav__links--mobile-open');
    mobileToggle.classList.toggle('nav__mobile-toggle--active');
    
    // Prevent body scroll when menu is open
    if (navLinks.classList.contains('nav__links--mobile-open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close mobile menu when clicking on a link
  navLinkItems.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.classList.remove('nav__links--mobile-open');
      mobileToggle.classList.remove('nav__mobile-toggle--active');
      document.body.style.overflow = '';
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!mobileToggle.contains(event.target) && !navLinks.contains(event.target)) {
      navLinks.classList.remove('nav__links--mobile-open');
      mobileToggle.classList.remove('nav__mobile-toggle--active');
      document.body.style.overflow = '';
    }
  });
  
  // Handle resize events
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768) {
        navLinks.classList.remove('nav__links--mobile-open');
        mobileToggle.classList.remove('nav__mobile-toggle--active');
        document.body.style.overflow = '';
      }
    }, 250);
  });

  // Show/hide navigation on scroll for mobile
  let lastScrollTop = 0;
  let scrollTimer;
  
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimer);
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    scrollTimer = setTimeout(function() {
      if (window.innerWidth <= 768) {
        if (currentScrollTop > lastScrollTop) {
          // Scrolling down - hide navigation
          document.querySelector('.nav').style.transform = 'translateY(-100%)';
        } else {
          // Scrolling up - show navigation
          document.querySelector('.nav').style.transform = 'translateY(0)';
        }
      }
      lastScrollTop = currentScrollTop;
    }, 10);
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for sticky nav
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Update active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    rootMargin: '-80px 0px -50% 0px',
    threshold: 0
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkItems.forEach(link => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Add touch feedback for mobile
  const touchElements = document.querySelectorAll('.btn, .project-feature, .beat-card, .contact__detail');
  touchElements.forEach(element => {
    element.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    element.addEventListener('touchend', function() {
      this.style.transform = '';
    });
  });
  
  // Scroll-triggered animations
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.hero__content, .about__content-column, .project-feature, .beat-card, .contact__inner');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      const isVisible = (elementTop < window.innerHeight && elementBottom > 0);
      
      if (isVisible && !element.classList.contains('animated')) {
        element.classList.add('animated');
        element.style.animation = 'fadeInUp 0.8s ease-out forwards';
      }
    });
  };
  
  // Parallax effect for background elements
  const parallaxElements = document.querySelectorAll('.orb, .particle');
  const parallaxScroll = function() {
    const scrolled = window.pageYOffset;
    const speed = 0.5;
    
    parallaxElements.forEach((element, index) => {
      const yPos = -(scrolled * speed * (index % 2 === 0 ? 1 : -1));
      element.style.transform = `translateY(${yPos}px)`;
    });
  };
  
  // Floating animation for hero elements
  const floatElements = document.querySelectorAll('.hero__eyebrow, .hero__headline, .hero__subheadline, .hero__description');
  floatElements.forEach((element, index) => {
    element.style.animation = `fadeInUp 0.8s ease-out ${0.2 + index * 0.2}s both, float 6s ease-in-out ${index * 0.5}s infinite`;
  });
  
  // Enhanced button interactions
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Interactive cursor effect (desktop only)
  if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    
    const interactiveElements = document.querySelectorAll('a, button, .project-feature, .beat-card');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
      });
    });
  }
  
  // Scroll events
  window.addEventListener('scroll', function() {
    animateOnScroll();
    parallaxScroll();
  });
  
  // Initial animations
  animateOnScroll();
  
  // Add loading animation
  document.body.classList.add('loaded');
  
  // Dynamic particle generation
  const generateParticles = function() {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;
    
    setInterval(() => {
      const particle = document.createElement('div');
      particle.className = 'particle dynamic-particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: linear-gradient(135deg, var(--accent), #8b92ff);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        animation: floatParticle ${Math.random() * 10 + 15}s linear;
        opacity: 0.8;
      `;
      
      particlesContainer.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 25000);
    }, 3000);
  };
  
  generateParticles();
  
  // Page visibility optimization
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      // Pause animations when page is not visible
      document.querySelectorAll('.orb, .particle').forEach(el => {
        el.style.animationPlayState = 'paused';
      });
    } else {
      // Resume animations when page is visible
      document.querySelectorAll('.orb, .particle').forEach(el => {
        el.style.animationPlayState = 'running';
      });
    }
  });
});

// Add CSS for custom cursor and ripple effects
const style = document.createElement('style');
style.textContent = `
  .custom-cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid var(--accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    transform: translate(-50%, -50%);
  }
  
  .custom-cursor.cursor-hover {
    transform: translate(-50%, -50%) scale(1.5);
    background: rgba(92, 103, 255, 0.1);
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  body.loaded {
    animation: pageLoad 1s ease-out;
  }
  
  @keyframes pageLoad {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animated {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    .custom-cursor {
      display: none;
    }
  }
`;
document.head.appendChild(style);
