/**
 * Intellij Lorapok — Premium Website JavaScript
 * Loading screen, scroll reveal, FAQ, navigation
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
    const duration = 2200; // ms
    const startTime = performance.now();

    function updateCounter(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Eased progress (ease-out cubic)
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

        // Brief pause at 100, then reveal
        setTimeout(function () {
          loader.classList.add('done');
          siteContent.classList.add('visible');
          siteContent.setAttribute('aria-hidden', 'false');

          // Remove loader from DOM after transition
          setTimeout(function () {
            loader.remove();
          }, 700);
        }, 400);
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
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /** FAQ Accordion */
  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');

    items.forEach(function (item) {
      var trigger = item.querySelector('.faq-question');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        toggleFAQ(item, items);
      });

      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFAQ(item, items);
        }
      });
    });
  }

  function toggleFAQ(item, allItems) {
    var isActive = item.classList.contains('active');

    // Close all
    allItems.forEach(function (i) {
      i.classList.remove('active');
      var btn = i.querySelector('.faq-question');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });

    // Open if wasn't active
    if (!isActive) {
      item.classList.add('active');
      var btn = item.querySelector('.faq-question');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }

  /** Navigation */
  function initNavigation() {
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');

    // Scroll effect
    var scrolled = false;
    window.addEventListener('scroll', function () {
      var shouldBeScrolled = window.scrollY > 80;
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
          if (links) links.classList.remove('open');
          if (toggle) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });

    // Mobile toggle
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var isOpen = links.classList.toggle('open');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  }

  /** Initialize */
  // Start loader immediately
  initLoader();

  // Init rest on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initFAQ();
    initNavigation();
  });
})();
