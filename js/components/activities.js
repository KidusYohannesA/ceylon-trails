/**
 * Ceylon Trails — Activities Page Component
 */

// ---- Activity-to-image Mapping ----
const activityImages = {
  'yala-safari': '/assets/images/activities/safari.png',
  'sigiriya-climb': '/assets/images/activities/safari.png', // Temporary fallback
  'whale-watching': '/assets/images/activities/whale-watching.png',
  'ella-rock-hike': '/assets/images/activities/scenic-train.png', // Temporary fallback
  'cooking-class': '/assets/images/activities/cooking.png',
  'galle-walking-tour': '/assets/images/activities/cooking.png', // Temporary fallback
  'surf-lessons': '/assets/images/activities/surfing.png',
  'tea-plantation-tour': '/assets/images/activities/scenic-train.png', // Temporary fallback
  'cultural-dance': '/assets/images/activities/cooking.png', // Temporary fallback
  'scuba-diving': '/assets/images/activities/diving.png',
  'hot-air-balloon': '/assets/images/activities/safari.png', // Temporary fallback
  'turtle-hatchery': '/assets/images/activities/whale-watching.png', // Temporary fallback
  'ayurveda-spa': '/assets/images/activities/cooking.png', // Temporary fallback
  'scenic-train': '/assets/images/activities/scenic-train.png',
  'stilt-fishing': '/assets/images/activities/surfing.png' // Temporary fallback
};

export async function initActivitiesPage() {
  const container = document.getElementById('act-grid');
  if (!container) return; // Only run on activities page

  try {
    const response = await fetch('/js/data/activities.json');
    if (!response.ok) throw new Error('Failed to fetch activities');
    const activities = await response.json();

    // Elements
    const filterBar = document.getElementById('act-filter-bar');
    const countDisplay = document.getElementById('act-count');
    const sortSelect = document.getElementById('act-sort');

    // State
    let currentCategory = 'All';
    let currentSort = sortSelect.value; // 'recommended', 'price-low', 'price-high', 'rating'

    // Extract unique categories
    const categories = ['All', ...new Set(activities.map(a => a.category))];

    // 1. Render Filters
    function renderFilters() {
      filterBar.innerHTML = categories.map(cat => `
        <button class="filter-pill ${currentCategory === cat ? 'active' : ''}" data-category="${cat}">
          ${cat}
        </button>
      `).join('');

      // Add listeners
      filterBar.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          currentCategory = btn.getAttribute('data-category');
          renderFilters();
          renderGrid();
        });
      });
    }

    // 2. Render Grid
    function renderGrid() {
      // Filter
      let filtered = currentCategory === 'All' 
        ? [...activities]
        : activities.filter(a => a.category === currentCategory);

      // Sort
      if (currentSort === 'price-low') {
        filtered.sort((a, b) => a.priceFrom - b.priceFrom);
      } else if (currentSort === 'price-high') {
        filtered.sort((a, b) => b.priceFrom - a.priceFrom);
      } else if (currentSort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else {
        // 'recommended' - sort by rating * reviews
        filtered.sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews));
      }

      // Update Count
      countDisplay.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'activity' : 'activities'}`;

      if (filtered.length === 0) {
        container.innerHTML = `<p class="text-muted text-center" style="grid-column: 1/-1; padding: 3rem;">No activities found for this category.</p>`;
        return;
      }

      container.innerHTML = filtered.map(a => `
        <div class="activity-card" id="activity-card-${a.id}">
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
                ${a.rating} (${a.reviews})
              </span>
              <span class="activity-card-price">
                <span>from </span>$${a.priceFrom}
              </span>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 3. Setup Sort Listener
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderGrid();
    });

    // Initialize
    renderFilters();
    renderGrid();

  } catch (err) {
    console.error('Error loading activities:', err);
    container.innerHTML = '<p class="text-error" style="grid-column: 1/-1; padding: 3rem; text-align: center;">Failed to load activities. Please try again later.</p>';
  }
}
