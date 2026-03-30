/**
 * Ceylon Trails — Navigation Bar Component
 * 
 * Features:
 * - Responsive hamburger menu for mobile
 * - Scroll-triggered glass effect background
 * - Active page highlighting
 * - Dark/light theme toggle
 * - Smooth show/hide on scroll direction
 */

export function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  // ---- Inject Navbar HTML ----
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

  nav.innerHTML = `
    <div class="nav-inner container flex-between">
      <a href="/" class="nav-logo" id="nav-logo">
        <span class="logo-icon">🌿</span>
        <span class="logo-text">
          <span class="logo-name">Ceylon Trails</span>
          <span class="logo-tagline">Discover Sri Lanka</span>
        </span>
      </a>

      <nav class="nav-menu" id="nav-menu" aria-label="Main navigation">
        <a href="/" class="nav-link ${currentPage === 'index' ? 'active' : ''}" id="nav-home">Home</a>
        <a href="/destinations.html" class="nav-link ${currentPage === 'destinations' ? 'active' : ''}" id="nav-destinations">Destinations</a>
        <a href="/activities.html" class="nav-link ${currentPage === 'activities' ? 'active' : ''}" id="nav-activities">Activities</a>
        <a href="/about.html" class="nav-link ${currentPage === 'about' ? 'active' : ''}" id="nav-about">About</a>
        <a href="/contact.html" class="nav-link ${currentPage === 'contact' ? 'active' : ''}" id="nav-contact">Contact</a>
      </nav>

      <div class="nav-actions flex gap-sm">
        <button class="nav-theme-toggle" id="theme-toggle" aria-label="Toggle theme">
          <span class="theme-icon-light">☀️</span>
          <span class="theme-icon-dark">🌙</span>
        </button>
        <a href="/booking.html" class="btn btn-primary btn-sm" id="nav-book-btn">Book Now</a>
        <button class="nav-hamburger hide-desktop" id="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Overlay -->
    <div class="nav-mobile-overlay" id="nav-mobile-overlay"></div>
  `;

  // ---- Scroll Effect ----
  let lastScroll = 0;
  const SCROLL_THRESHOLD = 60;

  function handleScroll() {
    const currentScroll = window.scrollY;
    
    // Add/remove scrolled class for glass effect
    if (currentScroll > SCROLL_THRESHOLD) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Hide/show on scroll direction
    if (currentScroll > lastScroll && currentScroll > 300) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ---- Mobile Menu Toggle ----
  const hamburger = document.getElementById('nav-hamburger');
  const mobileOverlay = document.getElementById('nav-mobile-overlay');
  const navMenu = document.getElementById('nav-menu');

  function toggleMobileMenu() {
    const isOpen = nav.classList.toggle('mobile-open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    nav.classList.remove('mobile-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', toggleMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);

  // Close on nav link click (mobile)
  navMenu?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // ---- Theme Toggle ----
  const themeToggle = document.getElementById('theme-toggle');
  
  function getPreferredTheme() {
    const saved = localStorage.getItem('ceylon-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ceylon-theme', theme);
  }

  // Initialize theme
  setTheme(getPreferredTheme());

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}
