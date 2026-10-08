// creators.js - Creator Profiles and Horizontal Feeds

document.addEventListener('DOMContentLoaded', () => {
  if (!window.LumeraData) return;
  renderCreators();
});

function renderCreators() {
  const list = document.getElementById('creator-list');
  list.innerHTML = '';
  
  window.LumeraData.creators.forEach((creator, index) => {
    // Get creator's content
    const creatorContent = window.LumeraData.content.filter(c => c.creatorId === creator.id);
    if (creatorContent.length === 0) return; // Skip if no content
    
    const block = document.createElement('div');
    block.className = `creator-section-block reveal delay-${index % 3}`;
    
    let feedHtml = creatorContent.map(item => `
      <div class="feed-item" tabindex="0" onclick="window.openContentModal('${item.id}')" onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); window.openContentModal('${item.id}'); }">
        <div class="card-thumb">
          <img src="${item.thumb}" alt="${item.title}" loading="lazy">
          ${item.type === 'video' || item.type === 'tutorial' ? `<div class="card-duration">${item.duration}</div>` : ''}
        </div>
        <h4 class="feed-item-title">${item.title}</h4>
      </div>
    `).join('');
    
    block.innerHTML = `
      <div class="creator-header">
        <div class="creator-avatar">${creator.initials}${creator.avatar ? `<img src="${creator.avatar}" alt="${creator.name}" loading="lazy" onerror="this.remove()">` : ''}</div>
        <div class="creator-info">
          <h3>${creator.name}</h3>
          <div class="creator-meta">
            <span>${creator.handle}</span>
            <span>&bull;</span>
            <span>${creator.specialty}</span>
            <span>&bull;</span>
            <span>${creator.followers} followers</span>
          </div>
          <p class="creator-bio">${creator.bio}</p>
        </div>
        <button class="btn btn-outline btn-sm follow-btn" data-id="${creator.id}" aria-pressed="false">Follow</button>
      </div>
      
      <div class="creator-feed-wrapper">
        <button class="feed-nav prev" aria-label="Previous items"><i class="ph ph-caret-left"></i></button>
        <div class="creator-feed">
          ${feedHtml}
        </div>
        <button class="feed-nav next" aria-label="Next items"><i class="ph ph-caret-right"></i></button>
      </div>
      <button class="see-all-creator" onclick="window.applyCreatorFilter('${creator.id}')">See all from ${creator.name} <i class="ph ph-arrow-right"></i></button>
    `;
    
    list.appendChild(block);
    
    // Setup Feed Scroll Buttons
    const feed = block.querySelector('.creator-feed');
    const prevBtn = block.querySelector('.prev');
    const nextBtn = block.querySelector('.next');
    
    // Scroll by one card (item width + gap) so arrows step cleanly on mobile/tablet
    const step = () => {
      const item = feed.querySelector('.feed-item');
      return item ? item.offsetWidth + 16 : feed.clientWidth;
    };
    prevBtn.addEventListener('click', () => feed.scrollBy({ left: -step(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => feed.scrollBy({ left: step(), behavior: 'smooth' }));

    // Disable arrows at the ends of the feed
    const updateNav = () => {
      const max = feed.scrollWidth - feed.clientWidth;
      prevBtn.disabled = feed.scrollLeft <= 4;
      nextBtn.disabled = feed.scrollLeft >= max - 4;
    };
    feed.addEventListener('scroll', updateNav, {passive: true});
    window.addEventListener('resize', updateNav, {passive: true});
    feed.querySelectorAll('img').forEach(img => img.addEventListener('load', updateNav, {once: true}));
    requestAnimationFrame(updateNav);
    
    // Setup Follow button with LocalStorage
    const followBtn = block.querySelector('.follow-btn');
    const isFollowing = localStorage.getItem(`lumera_follow_${creator.id}`) === 'true';
    if (isFollowing) {
      followBtn.textContent = 'Following';
      followBtn.setAttribute('aria-pressed', 'true');
      followBtn.classList.replace('btn-outline', 'btn-primary');
    }
    
    followBtn.addEventListener('click', () => {
      const currentlyFollowing = followBtn.getAttribute('aria-pressed') === 'true';
      if (currentlyFollowing) {
        localStorage.removeItem(`lumera_follow_${creator.id}`);
        followBtn.textContent = 'Follow';
        followBtn.setAttribute('aria-pressed', 'false');
        followBtn.classList.replace('btn-primary', 'btn-outline');
      } else {
        localStorage.setItem(`lumera_follow_${creator.id}`, 'true');
        followBtn.textContent = 'Following';
        followBtn.setAttribute('aria-pressed', 'true');
        followBtn.classList.replace('btn-outline', 'btn-primary');
        window.Bookmarks.showToast(`Following ${creator.name}`);
      }
    });
  });
}
