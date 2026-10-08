// map.js - Schematic Map and Venues

document.addEventListener('DOMContentLoaded', () => {
  if (!window.LumeraData) return;
  initMap();
});

let activeVenueId = null;
let currentMapFilter = 'all';
let mapSearchQuery = '';

function initMap() {
  const typeChips = document.querySelectorAll('.map-type-filters .filter-chip');
  const searchInput = document.getElementById('map-search');
  
  typeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      typeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentMapFilter = chip.dataset.type;
      renderMapAndList();
    });
  });
  
  searchInput.addEventListener('input', (e) => {
    mapSearchQuery = e.target.value.toLowerCase().trim();
    renderMapAndList();
  });
  
  renderMapAndList();
}

function renderMapAndList() {
  const listContainer = document.getElementById('map-list');
  const mapContainer = document.getElementById('schematic-map');
  const emptyState = document.getElementById('map-no-results');
  const countEl = document.getElementById('map-result-count');
  
  let data = window.LumeraData.venues;
  
  if (currentMapFilter !== 'all') {
    data = data.filter(v => v.type === currentMapFilter);
  }
  
  if (mapSearchQuery) {
    data = data.filter(v => 
      v.name.toLowerCase().includes(mapSearchQuery) || 
      v.address.toLowerCase().includes(mapSearchQuery)
    );
  }
  
  listContainer.innerHTML = '';
  mapContainer.innerHTML = ''; // In a real map, clear markers. Here we clear DOM elements.
  
  countEl.textContent = `Showing ${data.length} venue${data.length !== 1 ? 's' : ''}`;
  
  if (data.length === 0) {
    listContainer.classList.add('hidden');
    emptyState.classList.remove('hidden');
  } else {
    listContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    // Bounds normalization for schematic map demo
    // We map lat (40.71 to 40.75) -> top (80% to 20%)
    // We map lng (-74.01 to -73.98) -> left (20% to 80%)
    const minLat = 40.70, maxLat = 40.76;
    const minLng = -74.02, maxLng = -73.97;
    
    data.forEach(venue => {
      // 1. Create List Item
      const listItem = document.createElement('div');
      listItem.className = `map-list-item ${venue.id === activeVenueId ? 'active' : ''}`;
      listItem.setAttribute('tabindex', '0');
      listItem.id = `list-${venue.id}`;
      
      const bmIconClass = window.Bookmarks.isSaved('places', venue.id) ? 'ph-fill ph-bookmark-simple' : 'ph ph-bookmark-simple';
      
      listItem.innerHTML = `
        <div class="map-item-header">
          <div>
             <span class="map-item-type">${venue.type}</span>
             <h3 class="map-item-title">${venue.name}</h3>
          </div>
          <button class="btn-icon btn-sm bookmark-toggle" style="padding:4px" data-id="${venue.id}" aria-label="Save venue">
            <i class="${bmIconClass}"></i>
          </button>
        </div>
        <p class="map-item-desc"><i class="ph ph-map-pin"></i> ${venue.address}</p>
        <p class="map-item-desc"><i class="ph ph-clock"></i> ${venue.time}</p>
        ${venue.id === activeVenueId ? `<p class="map-item-desc" style="margin-top:8px;font-weight:500;">${venue.desc}</p>` : ''}
      `;
      
      // Select logic
      const selectVenue = (e) => {
        if (e && e.target.closest('.bookmark-toggle')) return; // Ignore bookmark clicks
        activeVenueId = venue.id;
        renderMapAndList();
        
        // Scroll map slightly? In a real map, we'd panTo(). Here we just highlight.
        if (window.innerWidth <= 1024) {
          // On mobile, scroll map into view if clicking list
          document.querySelector('.map-canvas-container').scrollIntoView({behavior: 'smooth', block: 'center'});
        }
      };
      
      listItem.addEventListener('click', selectVenue);
      listItem.addEventListener('keydown', (e) => { if(e.key==='Enter') selectVenue(e); });
      
      listContainer.appendChild(listItem);
      
      // Setup Bookmark
      const bmBtn = listItem.querySelector('.bookmark-toggle');
      window.setupBookmarkToggle(bmBtn, 'places', venue.id);
      
      // 2. Create Map Pin
      const topPct = 100 - ((venue.lat - minLat) / (maxLat - minLat) * 100);
      const leftPct = ((venue.lng - minLng) / (maxLng - minLng) * 100);
      
      const pin = document.createElement('button');
      pin.className = `map-pin ${venue.type} ${venue.id === activeVenueId ? 'active' : ''}`;
      pin.style.top = `${topPct}%`;
      pin.style.left = `${leftPct}%`;
      pin.setAttribute('aria-label', `${venue.name}, ${venue.type}`);
      
      // Icon mapping
      let iconHtml = '<i class="ph ph-scissors"></i>'; // Salon
      if (venue.type === 'store') iconHtml = '<i class="ph ph-shopping-bag"></i>';
      if (venue.type === 'event') iconHtml = '<i class="ph ph-calendar-star"></i>';
      
      pin.innerHTML = `
        <div class="pin-icon">${iconHtml}</div>
        <div class="pin-label">${venue.name}</div>
      `;
      
      pin.addEventListener('click', () => {
        activeVenueId = venue.id;
        renderMapAndList();
        
        // Scroll list to show item
        setTimeout(() => {
          const el = document.getElementById(`list-${venue.id}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      });
      
      mapContainer.appendChild(pin);
    });
  }
}
