// discover.js - Content Grid & Filters

document.addEventListener('DOMContentLoaded', () => {
  if (!window.LumeraData) return;
  initDiscover();
});

let currentFilters = {
  category: 'all',
  type: '',
  search: '',
  sort: 'trending',
  creator: '' // optional
};

function initDiscover() {
  const catChips = document.querySelectorAll('.category-filters .filter-chip');
  const searchInput = document.getElementById('discover-search');
  const typeSelect = document.getElementById('type-filter');
  const sortSelect = document.getElementById('sort-filter');
  const resetBtn = document.getElementById('reset-filters');
  
  // Category
  catChips.forEach(chip => {
    chip.addEventListener('click', () => {
      catChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilters.category = chip.dataset.cat;
      renderContent();
    });
  });
  
  // Search
  searchInput.addEventListener('input', (e) => {
    currentFilters.search = e.target.value.toLowerCase().trim();
    renderContent();
  });
  
  // Type
  typeSelect.addEventListener('change', (e) => {
    currentFilters.type = e.target.value;
    renderContent();
  });
  
  // Sort
  sortSelect.addEventListener('change', (e) => {
    currentFilters.sort = e.target.value;
    renderContent();
  });
  
  // Reset
  resetBtn.addEventListener('click', () => {
    currentFilters = { category: 'all', type: '', search: '', sort: 'trending', creator: '' };
    catChips.forEach(c => c.classList.remove('active'));
    catChips[0].classList.add('active');
    searchInput.value = '';
    typeSelect.value = '';
    sortSelect.value = 'trending';
    renderContent();
  });
  
  // Global API to apply creator filter from other sections
  window.applyCreatorFilter = (creatorId) => {
    resetBtn.click();
    currentFilters.creator = creatorId;
    searchInput.value = `Creator Filter Active`;
    document.getElementById('discover').scrollIntoView({ behavior: 'smooth' });
    renderContent();
  };
  
  renderContent();
}

function renderContent() {
  const grid = document.getElementById('content-grid');
  const countEl = document.getElementById('results-count');
  const emptyState = document.getElementById('no-results-state');
  
  let data = [...window.LumeraData.content];
  
  // Filter Category
  if (currentFilters.category !== 'all') {
    data = data.filter(item => item.category === currentFilters.category);
  }
  
  // Filter Type
  if (currentFilters.type) {
    data = data.filter(item => item.type === currentFilters.type);
  }
  
  // Filter Creator
  if (currentFilters.creator) {
    data = data.filter(item => item.creatorId === currentFilters.creator);
  }
  
  // Filter Search
  if (currentFilters.search && !currentFilters.creator) {
    const q = currentFilters.search;
    data = data.filter(item => {
      const creator = window.LumeraData.creators.find(c => c.id === item.creatorId);
      return item.title.toLowerCase().includes(q) || 
             item.tags.some(t => t.toLowerCase().includes(q)) ||
             (creator && creator.name.toLowerCase().includes(q));
    });
  }
  
  // Sort
  if (currentFilters.sort === 'trending' || currentFilters.sort === 'saved') {
    data.sort((a, b) => b.saves - a.saves); // using saves as a proxy for both right now
  } else if (currentFilters.sort === 'newest') {
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  // Render
  grid.innerHTML = '';
  
  if (data.length === 0) {
    grid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    countEl.textContent = 'Showing 0 items';
  } else {
    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    countEl.textContent = `Showing ${data.length} item${data.length !== 1 ? 's' : ''}`;
    
    data.forEach(item => {
      grid.appendChild(createCard(item));
    });
  }
}

function createCard(item) {
  const creator = window.LumeraData.creators.find(c => c.id === item.creatorId);
  const card = document.createElement('div');
  card.className = 'content-card';
  card.setAttribute('tabindex', '0');
  
  const tagsHtml = item.tags.map(t => `<span class="card-tag">${t}</span>`).join('');
  
  card.innerHTML = `
    <div class="card-thumb">
      <div class="card-badges">
        <span class="badge">${item.type}</span>
        ${item.sponsored ? `<span class="badge badge-sponsored">Sponsored</span>` : ''}
      </div>
      <img src="${item.thumb}" alt="Thumbnail for ${item.title}" loading="lazy">
      ${item.type === 'video' || item.type === 'tutorial' ? `<div class="card-duration">${item.duration}</div>` : `<div class="card-duration"><i class="ph ph-book-open"></i> ${item.duration}</div>`}
      <button class="card-bookmark-btn bookmark-toggle" data-id="${item.id}" aria-label="Save ${item.title}">
        <i class="ph ph-bookmark-simple"></i>
      </button>
    </div>
    <div class="card-info">
      <h3 class="card-title">${item.title}</h3>
      <p class="card-creator">By ${creator ? creator.name : 'Unknown'}</p>
      <div class="card-tags">${tagsHtml}</div>
    </div>
  `;
  
  // Open modal on click (but not if clicking bookmark)
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.card-bookmark-btn')) {
      openContentModal(item.id);
    }
  });
  
  // Keyboard support for opening card
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!e.target.closest('.card-bookmark-btn')) {
        openContentModal(item.id);
      }
    }
  });
  
  // Setup bookmark toggle
  const bmBtn = card.querySelector('.card-bookmark-btn');
  window.setupBookmarkToggle(bmBtn, 'content', item.id);
  
  return card;
}

window.openContentModal = function(id) {
  const item = window.LumeraData.content.find(c => c.id === id);
  const creator = window.LumeraData.creators.find(c => c.id === item.creatorId);
  if (!item) return;
  
  const modal = document.getElementById('content-modal');
  
  document.getElementById('modal-image').src = item.thumb;
  document.getElementById('modal-type').textContent = item.type;
  
  const sponsoredBadge = document.getElementById('modal-sponsored');
  if (item.sponsored) sponsoredBadge.classList.remove('hidden');
  else sponsoredBadge.classList.add('hidden');
  
  document.getElementById('modal-title').textContent = item.title;
  
  const creatorLink = document.getElementById('modal-creator-link');
  creatorLink.textContent = creator ? creator.name : 'Unknown';
  
  document.getElementById('modal-desc').textContent = item.desc;
  
  const productsList = document.getElementById('modal-products-list');
  productsList.innerHTML = item.products.map(p => `<li>${p}</li>`).join('');
  
  document.getElementById('modal-tags').innerHTML = item.tags.map(t => `<span class="badge" style="background:var(--c-primary)">${t}</span>`).join('');
  
  // Setup bookmark toggle inside modal
  const modalBmBtn = document.getElementById('modal-bookmark-btn');
  modalBmBtn.dataset.id = item.id;
  window.setupBookmarkToggle(modalBmBtn, 'content', item.id);
  
  // Trap focus & Show
  modal.hidden = false;
  document.body.style.overflow = 'hidden'; // Prevent background scroll
  
  // Simple focus trap
  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) {
    setTimeout(() => focusable[0].focus(), 100); // Focus close button usually
  }
}
