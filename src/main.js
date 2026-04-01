/**
 * Ceylon Trails — Main Entry Point
 * 
 * Initializes shared components and utilities across all pages.
 */

import '../css/design-system.css';
import '../css/components.css';
import '../css/layouts.css';
import '../css/pages/nav-footer.css';
import '../css/pages/home.css';
import '../css/pages/destinations.css';

import { initNavbar } from '../js/components/navbar.js';
import { initFooter } from '../js/components/footer.js';
import { initHomePage } from '../js/components/home.js';
import { initDestinationsPage } from '../js/components/destinations.js';
import { initActivitiesPage } from '../js/components/activities.js';
import { initBookingForm } from '../js/components/booking-form.js';

// ---- Initialize Core Components ----
document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  initFooter();
  initScrollReveal();
  initSmoothScroll();

  // Initialize page-specific logic
  const path = window.location.pathname;
  if (path === '/' || path.includes('index.html')) {
    await initHomePage();
  } else if (path.includes('destinations.html')) {
    await initDestinationsPage();
  } else if (path.includes('activities.html')) {
    await initActivitiesPage();
  } else if (path.includes('booking.html')) {
    await initBookingForm();
  }

  // Enable theme transitions only after initial paint is complete
  // This prevents the white→dark animation on page load
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add('loaded');
    });
  });
});


/**
 * Intersection Observer for scroll-triggered reveal animations.
 * Add class 'reveal', 'reveal-left', 'reveal-right', or 'reveal-scale'
 * to any element you want to animate in on scroll.
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}


/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}
