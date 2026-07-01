document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation Menu ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    if (!isExpanded) {
      mobileMenu.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      mobileMenu.classList.add('translate-x-full');
      document.body.style.overflow = '';
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  if (mobileMenuCloseBtn) {
    mobileMenuCloseBtn.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu on clicking any link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });


  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
  });

  revealElements.forEach(el => revealOnScroll.observe(el));


  // --- Animated Statistics Counters ---
  const counterElements = document.querySelectorAll('.counter-val');

  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';

    const updateCounter = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing out quadratic function
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);

      element.textContent = prefix + currentValue.toLocaleString('en-IN') + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = prefix + target.toLocaleString('en-IN') + suffix;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const statsSection = document.querySelector('#why-choose-us, #trust-stats');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counterElements.forEach(counter => animateCounter(counter));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  if (statsSection) {
    counterObserver.observe(statsSection);
  } else {
    // Fallback: observe individual counters
    const individualObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    counterElements.forEach(counter => individualObserver.observe(counter));
  }


  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-toggle');
    const content = item.querySelector('.faq-content');

    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs first (Accordion behavior)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-toggle').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-content').style.maxHeight = null;
        }
      });

      // Toggle current FAQ
      if (!isActive) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      }
    });
  });


  // --- Sticky Navigation Scroll Effect ---
  const navbar = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-md', 'bg-white/95', 'backdrop-blur-md');
      navbar.classList.remove('bg-white');
    } else {
      navbar.classList.remove('shadow-md', 'bg-white/95', 'backdrop-blur-md');
      navbar.classList.add('bg-white');
    }
  });


  // --- Back to Top & Mobile Sticky Bottom Bar visibility ---
  const mobileStickyBar = document.getElementById('mobile-sticky-cta');
  const desktopFloatButtons = document.getElementById('desktop-float-buttons');

  window.addEventListener('scroll', () => {
    // Show sticky bottom bar on mobile after scrolling past hero section (say 400px)
    if (window.scrollY > 300) {
      if (mobileStickyBar) mobileStickyBar.classList.remove('translate-y-full');
      if (desktopFloatButtons) desktopFloatButtons.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      if (mobileStickyBar) mobileStickyBar.classList.add('translate-y-full');
      if (desktopFloatButtons) desktopFloatButtons.classList.add('opacity-0', 'pointer-events-none');
    }
  });
});
