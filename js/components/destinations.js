/**
 * Ceylon Trails — Destinations Page Component
 */

export async function initDestinationsPage() {
  const container = document.getElementById('dest-grid');
  if (!container) return; // Only run on destinations page

  try {
    const response = await fetch('/js/data/destinations.json');
    if (!response.ok) throw new Error('Failed to fetch destinations');
    const destinations = await response.json();

    // Setup state
    let currentRegion = 'All';
    
    // Explicitly define all provinces so that even empty ones are clickable on the map
    const allProvinces = [
      'Northern Province', 'North Central Province', 'Eastern Province', 
      'Central Province', 'Southern Province', 'Uva (Southeast)', 
      'Western Province', 'North Western Province', 'Sabaragamuwa Province'
    ];
    
    // Merge predefined provinces with any dynamic regions/tags (like Cultural Triangle)
    const regions = ['All', 'Cultural Triangle', ...new Set([...allProvinces, ...destinations.map(d => d.region)])];

    // Elements
    const filterBar = document.getElementById('dest-filter-bar');
    const modal = document.getElementById('dest-modal');
    const modalContent = document.getElementById('dest-modal-content');
    const modalClose = document.getElementById('dest-modal-close');

    // 1. Render Map Interactions
    const mapRegions = document.querySelectorAll('.map-region, .map-overlay');
    mapRegions.forEach(el => {
      el.addEventListener('click', () => {
        const region = el.getAttribute('data-region');
        
        const filterMatch = regions.find(r => r === region);
        if (filterMatch) {
          setRegionFilter(filterMatch);
        }
      });
    });

    // 2. Render Filters
    function renderFilters() {
      filterBar.innerHTML = regions.map(region => `
        <button class="filter-pill ${currentRegion === region ? 'active' : ''}" data-region="${region}">
          ${region}
        </button>
      `).join('');

      // Add listeners
      filterBar.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          setRegionFilter(btn.getAttribute('data-region'));
        });
      });
    }

    function setRegionFilter(regionName) {
      currentRegion = regionName;
      renderFilters();
      renderGrid();
      
      // Update Map Active States
      mapRegions.forEach(mapEl => {
         const dRegion = mapEl.getAttribute('data-region');
         if (regionName === 'All') {
             mapEl.classList.remove('active');
         } else if (regionName === dRegion) {
             mapEl.classList.add('active');
         } else {
             mapEl.classList.remove('active');
         }
      });
    }

    // 3. Render Grid
    function renderGrid() {
      const filtered = currentRegion === 'All' 
        ? destinations 
        : destinations.filter(d => 
             d.region === currentRegion || 
             (d.tags && d.tags.includes(currentRegion))
          );

      if (filtered.length === 0) {
        container.innerHTML = `<p class="text-muted text-center" style="grid-column: 1/-1; padding: 3rem;">No destinations found for this region.</p>`;
        return;
      }

      container.innerHTML = filtered.map(d => `
        <article class="dest-card" data-id="${d.id}" role="button" tabindex="0" aria-label="View ${d.name}">
          <img src="/assets/images/destinations/${d.id}.png" alt="${d.name}" loading="lazy" />
          <div class="dest-card-overlay">
            <span class="dest-card-region">${d.region}</span>
            <h3 class="dest-card-name">${d.name}</h3>
            <p class="dest-card-tagline">${d.tagline}</p>
            <div class="dest-card-rating">
              <span class="stars">★★★★★</span>
              <span>${d.rating} (${d.reviews.toLocaleString()} views)</span>
            </div>
            <div class="dest-card-cta">
              <span class="btn btn-primary btn-sm" style="width: 100%;">Explore Focus</span>
            </div>
          </div>
        </article>
      `).join('');

      // Attach Modal Listeners
      container.querySelectorAll('.dest-card').forEach(card => {
        card.addEventListener('click', () => openModal(card.getAttribute('data-id')));
        card.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') openModal(card.getAttribute('data-id'));
        });
      });
    }

    // 4. Modal Logic
    function openModal(id) {
      const d = destinations.find(x => x.id === id);
      if (!d) return;

      modalContent.innerHTML = `
        <div class="modal-header">
           <img src="/assets/images/destinations/${d.id}.png" alt="${d.name}" class="modal-image" />
           <div class="dest-card-overlay" style="background: linear-gradient(0deg, var(--color-bg) 0%, transparent 100%);"></div>
        </div>
        <div class="modal-body">
           <span class="badge badge-primary">${d.region}</span>
           <h2 style="margin-top: var(--space-xs); font-family: var(--font-heading); font-size: var(--fs-h2); font-weight: var(--fw-bold);">${d.name}</h2>
           <p style="color: var(--color-text-muted); font-size: var(--fs-body-lg); margin-bottom: var(--space-xl);">${d.tagline}</p>
           
           <div class="modal-body-grid">
               <div>
                  <h3 style="font-family: var(--font-heading); font-weight: var(--fw-bold); font-size: var(--fs-h4); margin-bottom: var(--space-md);">About</h3>
                  <p style="color: var(--color-text-muted); line-height: var(--lh-relaxed);">${d.description}</p>
                  
                  <h3 style="font-family: var(--font-heading); font-weight: var(--fw-bold); font-size: var(--fs-h4); margin-top: var(--space-xl); margin-bottom: var(--space-md);">Highlights</h3>
                  <div class="modal-pills">
                     ${d.highlights.map(h => `<span class="badge" style="background: var(--color-bg-elevated); border: 1px solid var(--color-border);">${h}</span>`).join('')}
                  </div>
               </div>
               
               <aside class="modal-sidebar" style="display: flex; flex-direction: column; gap: var(--space-lg);">
                  <div>
                     <span style="font-size: var(--fs-caption); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: var(--ls-wider); display: block; margin-bottom: var(--space-2xs);">Best Time To Visit</span>
                     <p style="font-weight: var(--fw-semibold);">${d.bestTime}</p>
                  </div>
                  <div>
                     <span style="font-size: var(--fs-caption); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: var(--ls-wider); display: block; margin-bottom: var(--space-2xs);">Traveler Rating</span>
                     <div style="display: flex; align-items: center; gap: var(--space-xs);">
                         <span style="color: var(--color-secondary);">★</span> ${d.rating}
                     </div>
                  </div>
                  <a href="/activities.html" class="btn btn-primary" style="width: 100%; margin-top: auto;">Find Activities</a>
               </aside>
           </div>
        </div>
      `;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden'; // prevent background scrolling
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { modalContent.innerHTML = ''; }, 300); // clear after transition
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      // Close if clicking outside the container
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // Initialize
    renderFilters();
    renderGrid();

  } catch (err) {
    console.error('Error loading destinations:', err);
    container.innerHTML = '<p class="text-error">Failed to load destinations. Please try again later.</p>';
  }
}
