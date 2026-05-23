/**
 * Intellij Lorapok — Website JavaScript
 * Scroll reveal, FAQ accordion, navigation, marquee interactions
 */

(function () {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Scroll Reveal System */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
      observer.observe(el);
    });
  }

  /** FAQ Accordion */
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');

    items.forEach(item => {
      const trigger = item.querySelector('.faq-question');
      if (!trigger) return;

      trigger.addEventListener('click', () => toggleFAQ(item, items));
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFAQ(item, items);
        }
      });
    });
  }

  function toggleFAQ(item, allItems) {
    const isActive = item.classList.contains('active');

    // Close all items
    allItems.forEach(i => {
      i.classList.remove('active');
      const btn = i.querySelector('.faq-question');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });

    // Open clicked item if it wasn't already active
    if (!isActive) {
      item.classList.add('active');
      const btn = item.querySelector('.faq-question');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }

  /** Navigation */
  function initNavigation() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    // Scroll effect
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          // Close mobile menu if open
          if (links) links.classList.remove('open');
          if (toggle) toggle.classList.remove('active');
        }
      });
    });

    // Mobile toggle
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  }

  /** Initialize all */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initFAQ();
    initNavigation();
  });
})();
