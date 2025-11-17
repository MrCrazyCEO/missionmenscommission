/**
 * MISSION MEN'S COMMISSION - MAIN JAVASCRIPT
 * Modern, Interactive,  JS
 */

// ========== UTILITY FUNCTIONS ==========

/**
 * Debounce function to limit function execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if element is in viewport
 * @param {Element} element - DOM element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Check if element is partially in viewport
 * @param {Element} element - DOM element to check
 * @param {number} offset - Offset from top in pixels
 * @returns {boolean} True if element is partially visible
 */
function isPartiallyInViewport(element, offset = 100) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top <= windowHeight - offset && rect.bottom >= offset;
}

// ========== MOBILE NAVIGATION ==========

class MobileNavigation {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.navToggle = document.querySelector('.nav__toggle');
    this.navLinks = document.querySelectorAll('.nav__link');
    
    if (this.nav && this.navToggle) {
      this.init();
    }
  }

  init() {
    // Toggle mobile menu
    this.navToggle.addEventListener('click', () => this.toggleMenu());

    // Close menu when clicking on a link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          this.closeMenu();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target) && !this.navToggle.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.nav.classList.toggle('nav--open');
    this.navToggle.classList.toggle('nav__toggle--active');
  }

  closeMenu() {
    this.nav.classList.remove('nav--open');
    this.navToggle.classList.remove('nav__toggle--active');
  }
}

// ========== SMOOTH SCROLLING ==========

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Add smooth scrolling to all links with hash
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        
        // Ignore empty hash or just '#'
        if (!href || href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// ========== ACTIVE NAVIGATION ==========

class ActiveNavigation {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav__link');
    this.sections = document.querySelectorAll('.section[id]');
    
    if (this.navLinks.length && this.sections.length) {
      this.init();
    }
  }

  init() {
    window.addEventListener('scroll', debounce(() => this.updateActiveLink(), 100));
  }

  updateActiveLink() {
    const scrollPosition = window.pageYOffset + 100;

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }
}

// ========== HEADER SCROLL EFFECT ==========

class HeaderScroll {
  constructor() {
    this.header = document.querySelector('.header');
    
    if (this.header) {
      this.init();
    }
  }

  init() {
    window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));
  }

  handleScroll() {
    if (window.pageYOffset > 50) {
      this.header.classList.add('header--scrolled');
    } else {
      this.header.classList.remove('header--scrolled');
    }
  }
}

// ========== SCROLL ANIMATIONS ==========

class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('.card, .feature, .timeline-item, .team-member, .stat');
    
    if (this.animatedElements.length) {
      this.init();
    }
  }

  init() {
    // Initial check for elements already in viewport
    this.checkElements();

    // Check on scroll
    window.addEventListener('scroll', debounce(() => this.checkElements(), 100));
  }

  checkElements() {
    this.animatedElements.forEach((element, index) => {
      if (isPartiallyInViewport(element, 100) && !element.classList.contains('fade-in-up')) {
        setTimeout(() => {
          element.classList.add('fade-in-up');
        }, index * 100); // Stagger animation
      }
    });
  }
}

// ========== SCROLL TO TOP BUTTON ==========

class ScrollToTop {
  constructor() {
    this.button = document.querySelector('.scroll-top');
    
    if (this.button) {
      this.init();
    }
  }

  init() {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', debounce(() => this.handleScroll(), 100));

    // Scroll to top on click
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  handleScroll() {
    if (window.pageYOffset > 300) {
      this.button.classList.add('scroll-top--visible');
    } else {
      this.button.classList.remove('scroll-top--visible');
    }
  }
}

// ========== FORM VALIDATION ==========

class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Real-time validation on blur
    const inputs = this.form.querySelectorAll('.form__input, .form__textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('form__group--error')) {
          this.validateField(input);
        }
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    // Remove previous success message
    const successMessage = this.form.querySelector('.form__success');
    if (successMessage) {
      successMessage.classList.remove('form__success--visible');
    }

    // Validate all fields
    let isValid = true;
    const inputs = this.form.querySelectorAll('.form__input, .form__textarea');
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (isValid) {
      this.handleSuccess();
    }
  }

  validateField(field) {
    const fieldGroup = field.parentElement;
    const fieldName = field.getAttribute('name');
    const fieldValue = field.value.trim();
    
    // Remove previous error
    fieldGroup.classList.remove('form__group--error');
    
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !fieldValue) {
      errorMessage = 'This field is required';
    }

    // Email validation
    if (fieldName === 'email' && fieldValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fieldValue)) {
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Name validation (at least 2 characters)
    if (fieldName === 'name' && fieldValue && fieldValue.length < 2) {
      errorMessage = 'Name must be at least 2 characters long';
    }

    // Message validation (at least 10 characters)
    if (fieldName === 'message' && fieldValue && fieldValue.length < 10) {
      errorMessage = 'Message must be at least 10 characters long';
    }

    // Display error if validation failed
    if (errorMessage) {
      fieldGroup.classList.add('form__group--error');
      const errorElement = fieldGroup.querySelector('.form__error');
      if (errorElement) {
        errorElement.textContent = errorMessage;
      }
      return false;
    }

    return true;
  }

  handleSuccess() {
    // Show success message
    const successMessage = this.form.querySelector('.form__success');
    if (successMessage) {
      successMessage.classList.add('form__success--visible');
    }

    // Reset form
    this.form.reset();

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Hide success message after 5 seconds
    setTimeout(() => {
      successMessage.classList.remove('form__success--visible');
    }, 5000);
  }
}

// ========== COUNTER ANIMATION ==========

class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.stat__number');
    this.animated = false;
    
    if (this.counters.length) {
      this.init();
    }
  }

  init() {
    window.addEventListener('scroll', debounce(() => this.checkAndAnimate(), 100));
  }

  checkAndAnimate() {
    if (this.animated) return;

    const firstCounter = this.counters[0];
    if (isPartiallyInViewport(firstCounter, 100)) {
      this.animateCounters();
      this.animated = true;
    }
  }

  animateCounters() {
    this.counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  }
}

// ========== NEWSLETTER FORM ==========

class NewsletterForm {
  constructor() {
    this.form = document.querySelector('#newsletter-form');
    
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const emailInput = this.form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      this.showMessage('Please enter a valid email address', 'error');
      return;
    }

    // Simulate form submission
    this.showMessage('Thank you for subscribing! We will keep you updated.', 'success');
    this.form.reset();
  }

  showMessage(message, type) {
    // Remove any existing message
    const existingMessage = this.form.querySelector('.newsletter-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `newsletter-message newsletter-message--${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
      ${type === 'success' 
        ? 'background-color: rgba(0, 184, 148, 0.1); color: #00b894; border: 2px solid #00b894;' 
        : 'background-color: rgba(214, 48, 49, 0.1); color: #d63031; border: 2px solid #d63031;'}
    `;

    this.form.appendChild(messageElement);

    // Remove message after 5 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }
}

// ========== PARALLAX EFFECT ==========

class ParallaxEffect {
  constructor() {
    this.heroSection = document.querySelector('.hero');
    
    if (this.heroSection) {
      this.init();
    }
  }

  init() {
    window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));
  }

  handleScroll() {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    if (this.heroSection) {
      this.heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
  }
}

// ========== LAZY LOADING IMAGES ==========

class LazyLoadImages {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    
    if (this.images.length) {
      this.init();
    }
  }

  init() {
    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });

      this.images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers that don't support Intersection Observer
      this.images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }
}

// ========== KEYBOARD ACCESSIBILITY ==========

class KeyboardAccessibility {
  constructor() {
    this.init();
  }

  init() {
    // Add keyboard navigation for cards and clickable elements
    const clickableElements = document.querySelectorAll('.card, .feature, .team-member');
    
    clickableElements.forEach(element => {
      // Make elements focusable
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }

      // Add keyboard interaction
      element.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          element.click();
        }
      });
    });

    // Skip to main content link
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.querySelector('main') || document.querySelector('.hero');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }
}

// ========== INITIALIZATION ==========

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  new MobileNavigation();
  new SmoothScroll();
  new ActiveNavigation();
  new HeaderScroll();
  new ScrollAnimations();
  new ScrollToTop();
  new FormValidator('#contact-form');
  new FormValidator('#join-form');
  new CounterAnimation();
  new NewsletterForm();
  new ParallaxEffect();
  new LazyLoadImages();
  new KeyboardAccessibility();

  // Remove no-js class if JavaScript is enabled
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  // Add loaded class to body for CSS transitions
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden
    console.log('Page hidden - pausing animations if needed');
  } else {
    // Page is visible
    console.log('Page visible - resuming animations if needed');
  }
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
  // Close mobile menu on resize to desktop
  if (window.innerWidth > 768) {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav__toggle');
    
    if (nav) nav.classList.remove('nav--open');
    if (navToggle) navToggle.classList.remove('nav__toggle--active');
  }
}, 250));

// Performance optimization: Reduce animations on slow devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
  document.documentElement.classList.add('reduced-animations');
}

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MobileNavigation,
    SmoothScroll,
    ActiveNavigation,
    HeaderScroll,
    ScrollAnimations,
    ScrollToTop,
    FormValidator,
    CounterAnimation,
    NewsletterForm,
    ParallaxEffect,
    LazyLoadImages,
    KeyboardAccessibility
  };
}
