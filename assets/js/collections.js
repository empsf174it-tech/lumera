// collections.js - Collections Grid and Trending List

document.addEventListener('DOMContentLoaded', () => {
  if (!window.LumeraData) return;
  renderTrending();
  renderCollections();
});

function renderTrending() {
  const list = document.getElementById('trending-list');
  if (!list) return;
  
  // Sort content by saves, take top 5
  const top = [...window.LumeraData.content].sort((a,b) => b.saves - a.saves).slice(0, 5);
  
  list.innerHTML = top.map(item => `
    <li class="trending-item" tabindex="0" onclick="window.openContentModal('${item.id}')" onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); window.openContentModal('${item.id}'); }">
      ${item.title}
    </li>
  `).join('');
}

function renderCollections() {
  const grid = document.getElementById('collections-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  window.LumeraData.collections.forEach(col => {
    const card = document.createElement('div');
    card.className = 'collection-card';
    card.setAttribute('tabindex', '0');
    
    card.innerHTML = `
      <img src="${col.image}" alt="${col.title}" loading="lazy">
      <button class="col-card-bookmark bookmark-toggle" data-id="${col.id}" aria-label="Save collection">
        <i class="ph ph-bookmark-simple"></i>
      </button>
      <div class="collection-info">
        <h3>${col.title}</h3>
        <span class="collection-meta">${col.items.length} items</span>
      </div>
    `;
    
    // Open modal
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.bookmark-toggle')) {
        openCollectionModal(col.id);
      }
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!e.target.closest('.bookmark-toggle')) {
          openCollectionModal(col.id);
        }
      }
    });
    
    grid.appendChild(card);
    
    // Setup Bookmark
    const bmBtn = card.querySelector('.bookmark-toggle');
    window.setupBookmarkToggle(bmBtn, 'collections', col.id);
  });
}

function openCollectionModal(id) {
  const col = window.LumeraData.collections.find(c => c.id === id);
  if (!col) return;
  
  const modal = document.getElementById('collection-modal');
  document.getElementById('collection-modal-title').textContent = col.title;
  document.getElementById('collection-modal-desc').textContent = col.desc;
  
  const bmBtn = document.getElementById('col-modal-bookmark-btn');
  window.setupBookmarkToggle(bmBtn, 'collections', col.id);
  
  const grid = document.getElementById('collection-modal-items');
  grid.innerHTML = '';
  
  // Re-use content card creation logic from discover.js
  col.items.forEach(itemId => {
    const item = window.LumeraData.content.find(c => c.id === itemId);
    if (item) {
      // Create a simplified card for the modal
      const creator = window.LumeraData.creators.find(c => c.id === item.creatorId);
      const el = document.createElement('div');
      el.className = 'content-card';
      el.style.cursor = 'pointer';
      
      el.innerHTML = `
        <div class="card-thumb" style="aspect-ratio:16/9">
          <img src="${item.thumb}" alt="${item.title}" loading="lazy">
        </div>
        <div class="card-info" style="padding:12px">
          <h3 class="card-title" style="font-size:1rem">${item.title}</h3>
          <p class="card-creator" style="font-size:0.8rem; margin:0">By ${creator ? creator.name : ''}</p>
        </div>
      `;
      
      el.addEventListener('click', () => {
        modal.hidden = true; // close collection modal
        window.openContentModal(item.id); // open content modal
      });
      
      grid.appendChild(el);
    }
  });
  
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}
