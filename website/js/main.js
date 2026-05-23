/**
 * Intellij Lorapok — Lucien-Inspired Website JavaScript
 * Loading screen, scroll reveal, FAQ accordion, navigation
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Loading Screen with Counter */
  function initLoader() {
    const loader = document.querySelector('.loader');
    const counter = document.querySelector('.loader-counter');
    const barFill = document.querySelector('.loader-bar-fill');
    const siteContent = document.querySelector('.site-content');

    if (!loader || !counter || !siteContent) {
      if (siteContent) {
        siteContent.classList.add('visible');
        siteContent.setAttribute('aria-hidden', 'false');
      }
      return;
    }

    if (prefersReducedMotion) {
      loader.style.display = 'none';
      siteContent.classList.add('visible');
      siteContent.setAttribute('aria-hidden', 'false');
      return;
    }

    let current = 0;
    const target = 100;
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(eased * target);

      counter.textContent = current;
      if (barFill) {
        barFill.style.width = current + '%';
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = '100';
        if (barFill) barFill.style.width = '100%';

        setTimeout(function () {
          loader.classList.add('done');
          siteContent.classList.add('visible');
          siteContent.setAttribute('aria-hidden', 'false');

          setTimeout(function () {
            loader.remove();
          }, 700);
        }, 350);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  /** Scroll Reveal */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /** FAQ Accordion */
  function initFAQ() {
    var cards = document.querySelectorAll('.faq-card');

    cards.forEach(function (card) {
      var trigger = card.querySelector('.faq-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        toggleFAQ(card, cards);
      });

      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFAQ(card, cards);
        }
      });
    });
  }

  function toggleFAQ(card, allCards) {
    var isActive = card.classList.contains('active');

    // Close all
    allCards.forEach(function (c) {
      c.classList.remove('active');
      var btn = c.querySelector('.faq-trigger');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });

    // Open if wasn't active
    if (!isActive) {
      card.classList.add('active');
      var btn = card.querySelector('.faq-trigger');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }

  /** Navigation */
  function initNavigation() {
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    // Scroll effect
    var scrolled = false;
    window.addEventListener('scroll', function () {
      var shouldBeScrolled = window.scrollY > 60;
      if (shouldBeScrolled !== scrolled) {
        scrolled = shouldBeScrolled;
        nav.classList.toggle('scrolled', scrolled);
      }
    }, { passive: true });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          // Close mobile menu
          if (mobileNav) {
            mobileNav.classList.remove('open');
            mobileNav.setAttribute('aria-hidden', 'true');
          }
          if (toggle) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });

    // Mobile toggle
    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        var isOpen = mobileNav.classList.toggle('open');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      });
    }
  }

  /** Parallax-like subtle effects on scroll */
  function initParallax() {
    if (prefersReducedMotion) return;

    var heroGradient = document.querySelector('.hero-gradient');
    var footerText = document.querySelector('.footer-giant-text');

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;

      if (heroGradient && scrollY < window.innerHeight) {
        heroGradient.style.transform = 'translate(-50%, calc(-50% + ' + (scrollY * 0.1) + 'px))';
      }

      if (footerText) {
        var rect = footerText.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          var progress = 1 - (rect.top / window.innerHeight);
          footerText.style.transform = 'translateY(' + (20 - progress * 25) + '%)';
        }
      }
    }, { passive: true });
  }

  /** Initialize */
  initLoader();

  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initFAQ();
    initNavigation();
    initParallax();
  });
})();
