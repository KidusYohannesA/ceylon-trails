/**
 * Ceylon Trails — Hero Carousel Component
 * 
 * Auto-advancing image carousel for the home page hero section.
 * Features: Ken Burns effect, indicator dots, auto-play with pause on hover.
 */

const HERO_INTERVAL = 6000; // ms between slides

export function initHeroCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.hero-indicator');
  
  if (slides.length <= 1) return;

  let currentIndex = 0;
  let intervalId = null;
  let isPaused = false;

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    indicators[currentIndex]?.classList.remove('active');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('active');
    indicators[currentIndex]?.classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function startAutoPlay() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      if (!isPaused) nextSlide();
    }, HERO_INTERVAL);
  }

  // Click indicators to jump to slide
  indicators.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      startAutoPlay(); // Reset timer
    });
  });

  // Pause on hover
  const heroSection = document.querySelector('.hero-home');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => { isPaused = true; });
    heroSection.addEventListener('mouseleave', () => { isPaused = false; });
  }

  // Initialize
  slides[0].classList.add('active');
  indicators[0]?.classList.add('active');
  startAutoPlay();
}
