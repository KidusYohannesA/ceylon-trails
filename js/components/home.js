/**
 * Ceylon Trails — Home Page Initializer
 * 
 * Dynamically renders the home page sections:
 * - Why Sri Lanka strip
 * - Featured destinations carousel
 * - Popular activities grid
 * - Testimonials carousel
 * - Newsletter CTA
 */

import { initHeroCarousel } from './hero.js';

// ---- Testimonial Data ----
const testimonials = [
  {
    text: "Sri Lanka exceeded every expectation. The warmth of the people, the incredible wildlife, and the food — oh, the food! Ceylon Trails made every moment magical.",
    name: "Sarah Mitchell",
    origin: "London, United Kingdom",
    avatar: "👩‍🦰",
    rating: 5
  },
  {
    text: "Watching the sunrise from Sigiriya was a spiritual experience. Our guide's knowledge of the ancient history brought every stone to life. Absolutely unforgettable.",
    name: "Marcus Chen",
    origin: "Vancouver, Canada",
    avatar: "👨",
    rating: 5
  },
  {
    text: "We came for the beaches but fell in love with the hill country. The train ride from Kandy to Ella is genuinely the most beautiful journey I've ever taken.",
    name: "Julia & Thomas Weber",
    origin: "Munich, Germany",
    avatar: "👫",
    rating: 5
  },
  {
    text: "The Yala safari was extraordinary — we saw three leopards in one morning! Ceylon Trails picked the perfect time and route. Worth every penny.",
    name: "Aisha Nakamura",
    origin: "Tokyo, Japan",
    avatar: "👩",
    rating: 5
  },
  {
    text: "My wife and I spent two weeks exploring with Ceylon Trails and it was the trip of a lifetime. The cooking class in Kandy alone was worth the flight!",
    name: "David Okonkwo",
    origin: "Lagos, Nigeria",
    avatar: "👨‍🍳",
    rating: 5
  }
];

// ---- Activity-to-image Mapping ----
const activityImages = {
  'yala-safari': '/assets/images/activities/safari.png',
  'sigiriya-climb': '/assets/images/activities/safari.png',
  'whale-watching': '/assets/images/activities/whale-watching.png',
  'ella-rock-hike': '/assets/images/activities/scenic-train.png',
  'cooking-class': '/assets/images/activities/cooking.png',
  'scenic-train': '/assets/images/activities/scenic-train.png',
  'surf-lessons': '/assets/images/activities/surfing.png',
  'scuba-diving': '/assets/images/activities/diving.png',
  'hot-air-balloon': '/assets/images/activities/safari.png',
  'ayurveda-spa': '/assets/images/activities/cooking.png'
};

// ---- Destination-to-image Mapping ----
const destImages = {
  'sigiriya': '/assets/images/destinations/sigiriya.png',
  'galle-fort': '/assets/images/destinations/galle-fort.png',
  'ella': '/assets/images/destinations/ella.png',
  'yala': '/assets/images/destinations/yala.png',
  'mirissa': '/assets/images/destinations/mirissa.png',
  'kandy': '/assets/images/destinations/kandy.png'
};

// ---- Featured destination IDs to display ----
const featuredDestIds = ['sigiriya', 'galle-fort', 'ella', 'yala', 'mirissa', 'kandy'];
// ---- Featured activity IDs to display ----
const featuredActivityIds = ['yala-safari', 'whale-watching', 'scenic-train', 'cooking-class', 'surf-lessons', 'scuba-diving'];


export async function initHomePage() {
  const app = document.getElementById('app');
  if (!app || !document.querySelector('.hero-home')) return;

  // Load data
  const [destinations, activities] = await Promise.all([
    fetch('/js/data/destinations.json').then(r => r.json()),
    fetch('/js/data/activities.json').then(r => r.json())
  ]);

  // Filter featured items
  const featuredDests = featuredDestIds
    .map(id => destinations.find(d => d.id === id))
    .filter(Boolean);

  const featuredActivities = featuredActivityIds
    .map(id => activities.find(a => a.id === id))
    .filter(Boolean);

  // Build sections HTML
  const sectionsHTML = `
    ${renderWhyStrip()}
    ${renderDestinations(featuredDests)}
    ${renderActivities(featuredActivities)}
    ${renderTestimonials()}
    ${renderNewsletter()}
  `;

  // Insert after hero section
  const hero = document.querySelector('.hero-home');
  hero.insertAdjacentHTML('afterend', sectionsHTML);

  // Init interactivity
  initHeroCarousel();
  initDestinationsCarousel();
  initTestimonialsCarousel();
  initCountUpAnimation();

  // Re-observe newly added elements for scroll reveal
  initNewRevealElements();
}


// ============================================================
//  RENDERERS
// ============================================================

function renderWhyStrip() {
  return `
  <section class="why-strip section-sm" id="why-sri-lanka">
    <div class="container">
      <div class="why-stat reveal">
        <div class="why-stat-icon">🏖️</div>
        <div class="why-stat-value" data-count="1340">0</div>
        <div class="why-stat-label">km of Coastline</div>
      </div>
      <div class="why-stat reveal">
        <div class="why-stat-icon">🏛️</div>
        <div class="why-stat-value" data-count="8">0</div>
        <div class="why-stat-label">UNESCO World Heritage Sites</div>
      </div>
      <div class="why-stat reveal">
        <div class="why-stat-icon">🐘</div>
        <div class="why-stat-value" data-count="26">0</div>
        <div class="why-stat-label">National Parks</div>
      </div>
      <div class="why-stat reveal">
        <div class="why-stat-icon">🌶️</div>
        <div class="why-stat-value" data-count="12">0</div>
        <div class="why-stat-label">Major Spice & Herb Varieties</div>
      </div>
    </div>
  </section>
  `;
}


function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}


function renderDestinations(dests) {
  const cards = dests.map(d => `
    <a href="/destinations.html#${d.id}" class="dest-card" id="dest-card-${d.id}">
      <img src="${destImages[d.id] || '/assets/images/destinations/sigiriya.png'}" alt="${d.name}" loading="lazy" />
      <div class="dest-card-overlay">
        <span class="dest-card-region">${d.region}</span>
        <h3 class="dest-card-name">${d.name}</h3>
        <p class="dest-card-tagline">${d.tagline}</p>
        <div class="dest-card-rating">
          <span class="stars">${renderStars(d.rating)}</span>
          <span>${d.rating}</span>
          <span style="opacity:0.6">(${d.reviews.toLocaleString()})</span>
        </div>
      </div>
    </a>
  `).join('');

  return `
  <section class="featured-destinations section" id="featured-destinations">
    <div class="container">
      <div class="section-header reveal">
        <p class="overline">Explore the Island</p>
        <h2>Featured Destinations</h2>
        <hr class="divider" />
        <p class="lead">From ancient kingdoms to pristine coastlines — discover the diverse wonders that make Sri Lanka unforgettable.</p>
      </div>

      <div class="destinations-scroll-wrapper">
        <div class="destinations-carousel" id="destinations-carousel">
          ${cards}
        </div>
      </div>

      <div class="carousel-nav">
        <button class="carousel-btn" id="dest-prev" aria-label="Previous destination">
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button class="carousel-btn" id="dest-next" aria-label="Next destination">
          <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>
    </div>
  </section>
  `;
}


function renderActivities(acts) {
  const cards = acts.map(a => `
    <div class="activity-card reveal" id="activity-card-${a.id}">
      <div class="activity-card-img">
        <img src="${activityImages[a.id] || '/assets/images/activities/safari.png'}" alt="${a.name}" loading="lazy" />
        <span class="badge badge-primary activity-card-badge">${a.category}</span>
      </div>
      <div class="activity-card-body">
        <span class="activity-card-category">${a.destination}</span>
        <h3 class="activity-card-title">${a.name}</h3>
        <p class="activity-card-description">${a.description}</p>
        <div class="activity-card-meta">
          <span class="activity-meta-item">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            ${a.duration}
          </span>
          <span class="activity-meta-item">
            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01z"/></svg>
            ${a.rating}
          </span>
          <span class="activity-card-price">
            <span>from </span>$${a.priceFrom}
          </span>
        </div>
      </div>
    </div>
  `).join('');

  return `
  <section class="popular-activities section" id="popular-activities">
    <div class="container">
      <div class="section-header center reveal">
        <p class="overline">Unforgettable Experiences</p>
        <h2>Popular Activities</h2>
        <hr class="divider divider-center" />
        <p class="lead">Handpicked adventures that showcase the very best of Sri Lanka — from wildlife safaris to culinary journeys.</p>
      </div>

      <div class="activities-grid stagger">
        ${cards}
      </div>

      <div class="text-center" style="margin-top: var(--space-2xl);">
        <a href="/activities.html" class="btn btn-ghost btn-lg" id="view-all-activities">View All Activities</a>
      </div>
    </div>
  </section>
  `;
}


function renderTestimonials() {
  const slides = testimonials.map((t, i) => `
    <div class="testimonial-slide" data-index="${i}">
      <div class="testimonial-quote-mark">"</div>
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">
        <div class="testimonial-author-avatar">${t.avatar}</div>
        <span class="testimonial-author-name">${t.name}</span>
        <span class="testimonial-author-origin">${t.origin}</span>
        <span class="testimonial-author-rating">${'★'.repeat(t.rating)}</span>
      </div>
    </div>
  `).join('');

  const dots = testimonials.map((_, i) =>
    `<button class="testimonial-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to testimonial ${i + 1}"></button>`
  ).join('');

  return `
  <section class="testimonials section" id="testimonials">
    <div class="container">
      <div class="section-header center reveal">
        <p class="overline">What Travelers Say</p>
        <h2>Stories from<br/>Our Guests</h2>
        <hr class="divider divider-center" />
      </div>

      <div class="testimonial-carousel reveal-scale" id="testimonial-carousel">
        <div class="testimonial-track" id="testimonial-track">
          ${slides}
        </div>
      </div>

      <div class="testimonial-nav">
        <button class="carousel-btn" id="testimonial-prev" aria-label="Previous testimonial">
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div class="testimonial-dots" id="testimonial-dots">
          ${dots}
        </div>
        <button class="carousel-btn" id="testimonial-next" aria-label="Next testimonial">
          <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>
    </div>
  </section>
  `;
}


function renderNewsletter() {
  return `
  <section class="newsletter-cta section" id="newsletter">
    <div class="container">
      <div class="newsletter-inner reveal">
        <p class="overline">Stay Inspired</p>
        <h2>Get Sri Lanka in<br/>Your Inbox</h2>
        <p class="lead">Join 12,000+ travelers. Receive curated destination guides, exclusive deals, and travel tips — straight to your inbox.</p>
        <form class="newsletter-form" id="newsletter-form" onsubmit="return false;">
          <input type="email" class="newsletter-input" placeholder="Your email address" aria-label="Email address" required id="newsletter-email" />
          <button type="submit" class="newsletter-submit" id="newsletter-submit-btn">Subscribe</button>
        </form>
        <p class="newsletter-disclaimer">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </div>
  </section>
  `;
}


// ============================================================
//  INTERACTIVITY
// ============================================================

function initDestinationsCarousel() {
  const carousel = document.getElementById('destinations-carousel');
  const prevBtn = document.getElementById('dest-prev');
  const nextBtn = document.getElementById('dest-next');
  if (!carousel || !prevBtn || !nextBtn) return;

  const scrollAmount = 320;

  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}


function initTestimonialsCarousel() {
  const track = document.getElementById('testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  if (!track || !dots.length) return;

  let current = 0;
  const total = testimonials.length;
  let autoPlayId = null;

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
      resetAutoPlay();
    });
  });

  prevBtn?.addEventListener('click', () => {
    goTo(current - 1);
    resetAutoPlay();
  });

  nextBtn?.addEventListener('click', () => {
    goTo(current + 1);
    resetAutoPlay();
  });

  // Auto-advance
  function startAutoPlay() {
    autoPlayId = setInterval(() => goTo(current + 1), 7000);
  }

  function resetAutoPlay() {
    if (autoPlayId) clearInterval(autoPlayId);
    startAutoPlay();
  }

  startAutoPlay();
}


function initCountUpAnimation() {
  const counters = document.querySelectorAll('.why-stat-value[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        animateCount(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}


function animateCount(el, target) {
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);

    el.textContent = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Add "+" suffix for large values
      el.textContent = target.toLocaleString() + (target >= 100 ? '+' : '');
    }
  }

  requestAnimationFrame(update);
}


function initNewRevealElements() {
  const revealElements = document.querySelectorAll(
    '.reveal:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed), .reveal-scale:not(.revealed)'
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
