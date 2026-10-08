// bookmarks.js - LocalStorage Bookmarking System

class BookmarkManager {
  constructor() {
    this.storageKey = 'lumera_bookmarks_v1';
    this.bookmarks = {
      content: [],
      collections: [],
      routines: [],
      places: []
    };
    this.loadBookmarks();
    this.updateUI();
  }

  loadBookmarks() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.bookmarks = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage not available, falling back to in-memory bookmarks.');
    }
  }

  saveBookmarks() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.bookmarks));
    } catch (e) {
      console.warn('Could not save to LocalStorage.');
    }
    this.updateUI();
    this.renderBookmarksSection();
  }

  toggle(type, id) {
    const list = this.bookmarks[type];
    if (!list) return false;
    
    const index = list.indexOf(id);
    let isSaved = false;
    
    if (index > -1) {
      list.splice(index, 1);
      this.showToast('Removed from bookmarks');
    } else {
      list.push(id);
      isSaved = true;
      this.showToast('Added to bookmarks');
    }
    
    this.saveBookmarks();
    return isSaved;
  }

  isSaved(type, id) {
    return this.bookmarks[type] && this.bookmarks[type].includes(id);
  }

  getTotalCount() {
    return Object.values(this.bookmarks).reduce((acc, curr) => acc + curr.length, 0);
  }

  clearAll() {
    if (confirm('Are you sure you want to clear all bookmarks on this device?')) {
      this.bookmarks = { content: [], collections: [], routines: [], places: [] };
      this.saveBookmarks();
      this.showToast('All bookmarks cleared');
      
      // Reset all buttons in UI
      document.querySelectorAll('.bookmark-toggle').forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.classList.remove('ph-fill');
          icon.classList.add('ph');
        }
      });
    }
  }

  updateUI() {
    const count = this.getTotalCount();
    document.querySelectorAll('.bookmark-count').forEach(el => el.textContent = count);
    document.querySelectorAll('.bookmark-nav-btn').forEach(btn => {
      btn.setAttribute('aria-label', `Bookmarks, ${count} items`);
    });
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    
    // Clear existing timeout
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  renderBookmarksSection() {
    const container = document.getElementById('bookmark-panels');
    if (!container || !window.LumeraData) return;
    
    container.innerHTML = '';
    
    const tabs = [
      { id: 'bm-content', type: 'content', data: window.LumeraData.content },
      { id: 'bm-collections', type: 'collections', data: window.LumeraData.collections },
      { id: 'bm-routines', type: 'routines', data: window.LumeraData.routines },
      { id: 'bm-places', type: 'places', data: window.LumeraData.venues }
    ];
    
    let activeTabId = document.querySelector('.bookmark-tabs .active')?.dataset.target || 'bm-content';
    
    tabs.forEach(tab => {
      const panel = document.createElement('div');
      panel.id = tab.id;
      panel.className = `bookmark-panel ${tab.id === activeTabId ? 'active' : ''}`;
      
      const savedIds = this.bookmarks[tab.type];
      
      if (savedIds.length === 0) {
        panel.innerHTML = `
          <div class="empty-state">
            <i class="ph ph-bookmark-simple"></i>
            <h3>No saved ${tab.type}</h3>
            <p>Items you save will appear here.</p>
          </div>
        `;
      } else {
        const grid = document.createElement('div');
        
        if (tab.type === 'routines' || tab.type === 'places') {
          grid.className = 'map-list'; // Reusing simple list styles
        } else {
          grid.className = 'content-grid';
        }
        
        savedIds.forEach(id => {
          const item = tab.data.find(d => d.id === id);
          if (item) {
            if (tab.type === 'content') {
              grid.appendChild(this.createContentCard(item));
            } else if (tab.type === 'collections') {
              grid.appendChild(this.createCollectionCard(item));
            } else {
              grid.appendChild(this.createListItem(item, tab.type));
            }
          }
        });
        panel.appendChild(grid);
      }
      
      container.appendChild(panel);
    });
    
    // Re-bind listeners for newly generated remove buttons
    this.bindPanelButtons();
  }

  createContentCard(item) {
    const el = document.createElement('div');
    el.className = 'content-card';
    el.innerHTML = `
      <div class="card-thumb">
        <img src="${item.thumb}" alt="${item.title}" loading="lazy">
      </div>
      <div class="card-info">
        <h3 class="card-title">${item.title}</h3>
        <button class="btn btn-sm btn-outline remove-bm-btn" data-type="content" data-id="${item.id}">Remove</button>
      </div>
    `;
    return el;
  }
  
  createCollectionCard(item) {
    const el = document.createElement('div');
    el.className = 'collection-card';
    el.innerHTML = `
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="collection-info">
        <h3>${item.title}</h3>
        <button class="btn btn-sm btn-secondary remove-bm-btn" data-type="collections" data-id="${item.id}" style="margin-top:8px">Remove</button>
      </div>
    `;
    return el;
  }
  
  createListItem(item, type) {
    const el = document.createElement('div');
    el.className = 'map-list-item';
    el.style.display = 'flex';
    el.style.justifyContent = 'space-between';
    el.style.alignItems = 'center';
    el.innerHTML = `
      <div>
        <h3 class="map-item-title">${item.title || item.name}</h3>
        <p class="map-item-desc">${type === 'routines' ? item.author : item.type}</p>
      </div>
      <button class="btn btn-sm btn-outline remove-bm-btn" data-type="${type}" data-id="${item.id}">Remove</button>
    `;
    return el;
  }

  bindPanelButtons() {
    document.querySelectorAll('.remove-bm-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle(btn.dataset.type, btn.dataset.id);
        
        // Also update any toggles on the main page
        const mainToggle = document.querySelector(`.bookmark-toggle[data-id="${btn.dataset.id}"]`);
        if (mainToggle) {
          mainToggle.setAttribute('aria-pressed', 'false');
          mainToggle.querySelector('i').classList.replace('ph-fill', 'ph');
        }
      });
    });
  }
}

window.Bookmarks = new BookmarkManager();

// Setup UI elements for bookmarks on load
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clear-bookmarks-btn')?.addEventListener('click', () => {
    window.Bookmarks.clearAll();
  });
  
  // Tabs
  const tabs = document.querySelectorAll('.bookmark-tabs .tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      document.querySelectorAll('.bookmark-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });
  
  // Initial render
  setTimeout(() => window.Bookmarks.renderBookmarksSection(), 500);
});
