/**
 * Ceylon Trails — Footer Component
 */

export function initFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  const currentYear = new Date().getFullYear();

  footer.innerHTML = `
    <div class="footer-main section-dark">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand Column -->
          <div class="footer-brand">
            <a href="/" class="footer-logo">
              <span class="logo-icon">🌿</span>
              <span class="logo-name">Ceylon Trails</span>
            </a>
            <p class="footer-tagline lead">
              Discover the pearl of the Indian Ocean. Unforgettable experiences, authentic culture, and breathtaking landscapes await.
            </p>
            <div class="footer-social flex gap-sm">
              <a href="#" class="social-link" aria-label="Facebook" id="social-facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="Instagram" id="social-instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="Twitter" id="social-twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="YouTube" id="social-youtube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          <!-- Explore Column -->
          <div class="footer-col">
            <h4 class="footer-heading">Explore</h4>
            <ul class="footer-links">
              <li><a href="/destinations.html">Destinations</a></li>
              <li><a href="/activities.html">Activities</a></li>
              <li><a href="/booking.html">Book a Trip</a></li>
              <li><a href="#">Travel Guide</a></li>
              <li><a href="#">Gallery</a></li>
            </ul>
          </div>

          <!-- Company Column -->
          <div class="footer-col">
            <h4 class="footer-heading">Company</h4>
            <ul class="footer-links">
              <li><a href="/about.html">About Us</a></li>
              <li><a href="/contact.html">Contact</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Partners</a></li>
            </ul>
          </div>

          <!-- Newsletter Column -->
          <div class="footer-col footer-newsletter-col">
            <h4 class="footer-heading">Stay Updated</h4>
            <p class="text-sm text-muted">Get travel tips, exclusive deals, and inspiration delivered to your inbox.</p>
            <form class="footer-newsletter" id="footer-newsletter-form">
              <div class="newsletter-input-group">
                <input 
                  type="email" 
                  class="form-input" 
                  placeholder="Your email address" 
                  aria-label="Email for newsletter"
                  id="footer-newsletter-email"
                  required
                />
                <button type="submit" class="btn btn-primary btn-sm" id="footer-newsletter-btn">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <div class="container flex-between">
        <p class="text-xs text-muted">
          © ${currentYear} Ceylon Trails. All rights reserved.
        </p>
        <div class="footer-legal flex gap-md">
          <a href="#" class="text-xs text-muted">Privacy Policy</a>
          <a href="#" class="text-xs text-muted">Terms of Service</a>
          <a href="#" class="text-xs text-muted">Cookies</a>
        </div>
      </div>
    </div>
  `;

  // Newsletter form handler
  const form = document.getElementById('footer-newsletter-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('footer-newsletter-email');
    if (email?.value) {
      // TODO: Hook up to email service
      email.value = '';
      alert('Thanks for subscribing! 🌿');
    }
  });
}
