// routines.js - Tabbed Routine Guides

document.addEventListener('DOMContentLoaded', () => {
  if (!window.LumeraData) return;
  initRoutines();
});

let activeRoutineId = null;
let currentSkinHairType = 'all';

function initRoutines() {
  const tabsContainer = document.getElementById('routine-tabs');
  const typeSelect = document.getElementById('skin-hair-type');
  
  if (!tabsContainer || !typeSelect) return;
  
  // Initial active routine
  if (window.LumeraData.routines.length > 0) {
    activeRoutineId = window.LumeraData.routines[0].id;
  }
  
  // Type Selector
  typeSelect.addEventListener('change', (e) => {
    currentSkinHairType = e.target.value;
    renderRoutineTabs();
    
    // Auto-select first available routine for this type
    const available = window.LumeraData.routines.filter(r => r.typeTarget.includes(currentSkinHairType));
    if (available.length > 0 && !available.find(r => r.id === activeRoutineId)) {
      activeRoutineId = available[0].id;
    } else if (available.length === 0) {
      activeRoutineId = null; // None available
    }
    
    renderRoutineContent();
  });
  
  renderRoutineTabs();
  renderRoutineContent();
}

function renderRoutineTabs() {
  const tabsContainer = document.getElementById('routine-tabs');
  tabsContainer.innerHTML = '';
  
  const availableRoutines = window.LumeraData.routines.filter(r => r.typeTarget.includes(currentSkinHairType));
  
  availableRoutines.forEach(routine => {
    const btn = document.createElement('button');
    btn.className = `tab-btn ${routine.id === activeRoutineId ? 'active' : ''}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', routine.id === activeRoutineId ? 'true' : 'false');
    btn.textContent = routine.title;
    
    btn.addEventListener('click', () => {
      activeRoutineId = routine.id;
      renderRoutineTabs();
      renderRoutineContent();
    });
    
    tabsContainer.appendChild(btn);
  });
  
  if (availableRoutines.length === 0) {
    tabsContainer.innerHTML = '<span style="color:var(--c-text-light)">No routines matched for this type.</span>';
  }
}

function renderRoutineContent() {
  const contentContainer = document.getElementById('routine-content');
  if (!activeRoutineId) {
    contentContainer.innerHTML = '<div class="empty-state"><h3>No routine selected</h3></div>';
    return;
  }
  
  const routine = window.LumeraData.routines.find(r => r.id === activeRoutineId);
  if (!routine) return;
  
  const stepsHtml = routine.steps.map(step => `
    <div class="routine-step">
      <div class="step-number">0${step.num}</div>
      <div class="step-content">
        <span class="step-meta">${step.type} &bull; ${step.time}</span>
        <h4>${step.title}</h4>
        <p class="step-note">${step.note}</p>
      </div>
    </div>
  `).join('');
  
  contentContainer.innerHTML = `
    <div class="routine-details-header">
      <div>
        <h3 style="font-family:var(--font-heading); font-size: 2rem; margin-bottom: 4px;">${routine.title}</h3>
        <div class="routine-meta">Expert Byline: ${routine.author} &bull; Last Updated: ${routine.date}</div>
      </div>
      <button class="btn btn-outline bookmark-toggle" id="routine-bookmark-btn" data-id="${routine.id}">
        <i class="ph ph-bookmark-simple"></i> Save Routine
      </button>
    </div>
    <div class="routine-steps">
      ${stepsHtml}
    </div>
  `;
  
  // Setup Bookmark
  const bmBtn = document.getElementById('routine-bookmark-btn');
  window.setupBookmarkToggle(bmBtn, 'routines', routine.id);
}
