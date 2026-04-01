/**
 * Ceylon Trails — Multi-Activity Booking Form Component
 */

export async function initBookingForm() {
  const formWrapper = document.getElementById('booking-form');
  if (!formWrapper) return;

  // Form Elements
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4')
  ];
  const stepperIndicators = document.querySelectorAll('.booking-stepper .step');
  const btnNext1 = document.getElementById('btn-next-1');
  
  // Containers
  const activityGrid = document.getElementById('activity-grid');
  const detailsContainer = document.getElementById('details-container');
  const summaryItemsContainer = document.getElementById('summary-items-container');
  const sumTotal = document.getElementById('sum-total');

  // Inputs
  const universalGuestCheck = document.getElementById('universal-guest-check');
  const universalGuestWrap = document.getElementById('universal-guest-input-wrap');
  const universalGuests = document.getElementById('universal-guests');

  // State
  let activitiesData = [];
  let selectedActivities = []; // Array of ids
  let draftData = {}; 
  let currentStep = 1;
  let flatpickrInstances = [];

  // --- 1. Initialization ---
  try {
    const response = await fetch('/js/data/activities.json');
    activitiesData = await response.json();
    renderActivityGrid();
    handleQueryParam();
    hydrateFromStorage();
  } catch (e) {
    console.error('Failed to load activities', e);
  }

  // --- 2. Step 1: Activity Selection ---

  function renderActivityGrid() {
    activityGrid.innerHTML = activitiesData.map(act => `
      <div class="activity-chip" data-id="${act.id}">
        <strong>${act.name}</strong>
        <span class="text-secondary">$${act.priceFrom} pp</span>
      </div>
    `).join('');

    // Add listeners
    activityGrid.querySelectorAll('.activity-chip').forEach(chip => {
      chip.addEventListener('click', () => toggleActivity(chip.dataset.id));
    });
    updateActivityUI();
  }

  function toggleActivity(id) {
    if (selectedActivities.includes(id)) {
      selectedActivities = selectedActivities.filter(a => a !== id);
    } else {
      if (selectedActivities.length >= 4) return; // limit
      selectedActivities.push(id);
    }
    updateActivityUI();
    saveToStorage();
    
    // If Step 2 components exist, update summary too
    if (detailsContainer.innerHTML !== '') updateSummary();
  }

  function updateActivityUI() {
    const chips = activityGrid.querySelectorAll('.activity-chip');
    const isMaxedOut = selectedActivities.length >= 4;

    chips.forEach(chip => {
      const id = chip.dataset.id;
      if (selectedActivities.includes(id)) {
        chip.classList.add('selected');
        chip.classList.remove('disabled');
      } else {
        chip.classList.remove('selected');
        if (isMaxedOut) {
          chip.classList.add('disabled');
        } else {
          chip.classList.remove('disabled');
        }
      }
    });

    // Disable Next if none
    btnNext1.disabled = selectedActivities.length === 0;
  }

  // --- 3. Step 2: Dynamic Form Generation ---

  function generateDetailForms() {
    // Clear old instances explicitly to avoid memory leaks
    if (flatpickrInstances.length) {
      flatpickrInstances.forEach(fp => fp.destroy());
      flatpickrInstances = [];
    }

    if (selectedActivities.length === 0) {
      detailsContainer.innerHTML = '';
      return;
    }

    const universalToggleContainer = document.getElementById('universal-guest-toggle-container');
    if (selectedActivities.length <= 1) {
      universalToggleContainer.classList.add('hidden');
      universalGuestCheck.checked = false;
      universalGuestWrap.classList.add('hidden');
    } else {
      universalToggleContainer.classList.remove('hidden');
    }

    const useUniversal = universalGuestCheck.checked;
    let html = '';

    selectedActivities.forEach(id => {
      const act = activitiesData.find(a => a.id === id);
      const savedDate = draftData[`date_${id}`] || '';
      const savedGuests = draftData[`guests_${id}`] || 2;

      html += `
        <div class="detail-block">
          <h3 class="h4" style="margin-bottom: var(--space-md);">${act.name}</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="date_${id}">Select Date</label>
              <input type="text" id="date_${id}" data-type="dynamic-date" class="form-input" placeholder="Select a date" value="${savedDate}" required>
            </div>
            <div class="form-group ${useUniversal ? 'hidden' : ''}">
              <label class="form-label" for="guests_${id}">Guests for this activity</label>
              <input type="number" id="guests_${id}" data-type="dynamic-guest" data-id="${id}" class="form-input" min="1" max="20" value="${savedGuests}" ${useUniversal ? '' : 'required'}>
            </div>
          </div>
        </div>
      `;
    });

    detailsContainer.innerHTML = html;

    // Init flatpickrs
    const dateInputs = detailsContainer.querySelectorAll('[data-type="dynamic-date"]');
    dateInputs.forEach(input => {
      if (window.flatpickr) {
        flatpickrInstances.push(flatpickr(input, {
          minDate: "today",
          dateFormat: "Y-m-d",
          altInput: true,
          altFormat: "F j, Y",
          onChange: updateSummary
        }));
      }
    });

    // Add listeners to dynamic guests
    detailsContainer.querySelectorAll('[data-type="dynamic-guest"]').forEach(input => {
      input.addEventListener('input', updateSummary);
    });

    updateSummary();
  }

  universalGuestCheck.addEventListener('change', (e) => {
    if (e.target.checked) {
      universalGuestWrap.classList.remove('hidden');
    } else {
      universalGuestWrap.classList.add('hidden');
    }
    saveToStorage();
    generateDetailForms();
  });

  universalGuests.addEventListener('input', updateSummary);

  // --- 4. Validation & Navigation ---

  function validateStep(stepIndex) {
    let isValid = true;
    const stepEl = steps[stepIndex - 1];
    
    // Check built-in validation for nested inputs that are visible
    const requiredInputs = stepEl.querySelectorAll('input[required], select[required]');
    
    requiredInputs.forEach(input => {
      // Avoid validating hidden fields
      if (input.closest('.hidden')) return;

      if (!input.checkValidity()) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
    });
    
    if (!isValid) {
      stepEl.classList.add('shake');
      setTimeout(() => stepEl.classList.remove('shake'), 400);
    }
    return isValid;
  }

  function goToStep(stepIndex) {
    if (stepIndex === 2 && currentStep === 1) {
      generateDetailForms(); 
    }

    steps.forEach(s => s.classList.add('hidden'));
    stepperIndicators.forEach(i => i.classList.remove('active', 'completed'));
    steps[stepIndex - 1].classList.remove('hidden');

    for(let i=1; i <= stepIndex; i++) {
       const indicator = document.querySelector(`.booking-stepper .step[data-step="${i}"]`);
       if (i === stepIndex) indicator.classList.add('active');
       else indicator.classList.add('completed');
    }
    currentStep = stepIndex;
  }

  // Button binding
  document.getElementById('btn-next-1').addEventListener('click', () => { if(selectedActivities.length > 0) goToStep(2); });
  document.getElementById('btn-next-2').addEventListener('click', () => { if(validateStep(2)) goToStep(3); });
  document.getElementById('btn-next-3').addEventListener('click', () => { if(validateStep(3)) goToStep(4); });

  document.getElementById('btn-prev-2').addEventListener('click', () => goToStep(1));
  document.getElementById('btn-prev-3').addEventListener('click', () => goToStep(2));
  document.getElementById('btn-prev-4').addEventListener('click', () => goToStep(3));


  // --- 5. Summary & Storage Updates ---

  function updateSummary() {
    let grandTotal = 0;
    const useUniversal = universalGuestCheck.checked;
    const uCount = parseInt(universalGuests.value) || 1;

    let summaryHtml = '';

    if (selectedActivities.length === 0) {
      summaryItemsContainer.innerHTML = '<div class="text-muted mt-3">No activities selected.</div>';
      sumTotal.textContent = '$0';
      return;
    }

    selectedActivities.forEach(id => {
      const act = activitiesData.find(a => a.id === id);
      if (!act) return;

      const dateInput = document.getElementById(`date_${id}`);
      const guestInput = document.getElementById(`guests_${id}`);

      let dateVal = dateInput ? dateInput.value : '';
      let guestCount = useUniversal ? uCount : (guestInput ? parseInt(guestInput.value) : 1);
      if (isNaN(guestCount)) guestCount = 1;

      const subTotal = act.priceFrom * guestCount;
      grandTotal += subTotal;

      // Ensure we keep track of valid inputs in memory layout
      draftData[`date_${id}`] = dateVal;
      if (!useUniversal) draftData[`guests_${id}`] = guestCount;

      summaryHtml += `
        <div style="margin-top: 1.5rem;">
          <strong>${act.name}</strong>
          <div class="summary-item mt-1">
            <span class="text-muted">${dateVal || 'Date TBA'}</span>
            <span class="text-muted">${guestCount} ${guestCount === 1 ? 'Guest' : 'Guests'}</span>
          </div>
          <div class="summary-item mt-1">
            <span class="text-muted text-sm">$${act.priceFrom} × ${guestCount}</span>
            <span class="fw-bold">$${subTotal.toLocaleString()}</span>
          </div>
        </div>
      `;
    });

    summaryItemsContainer.innerHTML = summaryHtml;
    sumTotal.textContent = `$${grandTotal.toLocaleString()}`;

    saveToStorage();
  }

  function handleQueryParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const actId = urlParams.get('activityId');
    if (actId && activitiesData.find(a => a.id === actId)) {
      toggleActivity(actId);
    }
  }

  function saveToStorage() {
    draftData.selectedActivities = selectedActivities;
    draftData.useUniversal = universalGuestCheck.checked;
    draftData.universalGuests = universalGuests.value;
    
    // Add text fields
    const textFields = ['book-name', 'book-email', 'book-phone'];
    textFields.forEach(tf => {
      const el = document.getElementById(tf);
      if (el) draftData[tf] = el.value;
    });

    localStorage.setItem('booking-draft-multi', JSON.stringify(draftData));
  }

  function hydrateFromStorage() {
    const json = localStorage.getItem('booking-draft-multi');
    if (json) {
      try {
        const loadedDraft = JSON.parse(json);
        draftData = loadedDraft;
        
        if (loadedDraft.selectedActivities && loadedDraft.selectedActivities.length > 0) {
           loadedDraft.selectedActivities.forEach(id => {
             if (!selectedActivities.includes(id) && selectedActivities.length < 4) {
               selectedActivities.push(id);
             }
           });
        }
        
        if (loadedDraft.useUniversal) {
          universalGuestCheck.checked = true;
          universalGuestWrap.classList.remove('hidden');
        }
        if (loadedDraft.universalGuests) {
          universalGuests.value = loadedDraft.universalGuests;
        }

        const textFields = ['book-name', 'book-email', 'book-phone'];
        textFields.forEach(tf => {
          const el = document.getElementById(tf);
          if (el && loadedDraft[tf]) el.value = loadedDraft[tf];
        });

      } catch(e) { /* ignore */ }
    }
    
    updateActivityUI();
    if (selectedActivities.length > 0) {
      generateDetailForms();
      // Reset visibility back to Step 1 explicitly
      goToStep(1);
    }
  }

  // Adding input listeners for text fields
  ['book-name', 'book-email', 'book-phone'].forEach(tf => {
    document.getElementById(tf).addEventListener('input', saveToStorage);
  });

  // --- 6. Mock Payment Submission ---
  formWrapper.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const submitBtn = document.getElementById('btn-submit');
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    setTimeout(() => {
      formWrapper.classList.add('hidden');
      document.querySelector('.booking-stepper').classList.add('hidden');
      
      const successBlock = document.getElementById('booking-success');
      successBlock.classList.remove('hidden');
      
      document.getElementById('ref-id').textContent = 'CT-' + Math.floor(100000 + Math.random() * 900000);
      localStorage.removeItem('booking-draft-multi');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  });
}
