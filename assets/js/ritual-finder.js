// ritual-finder.js - Interactive 3-step quiz that matches a guide + routine

document.addEventListener('DOMContentLoaded', () => {
  if (!window.LumeraData) return;
  initRitualFinder();
});

const FINDER_LABELS = {
  focus: { skin: ['Skin', 'ph-drop-half'], hair: ['Hair', 'ph-wave-sine'], makeup: ['Makeup', 'ph-paint-brush'], wellness: ['Wellness', 'ph-moon-stars'] },
  time: { quick: ['5–10 min', 'ph-lightning'], mid: ['15–20 min', 'ph-timer'], slow: ['30 min +', 'ph-hourglass-medium'] },
  mood: { glow: ['Radiant', 'ph-sun'], calm: ['Calm', 'ph-flower-lotus'], define: ['Defined', 'ph-shapes'], repair: ['Restored', 'ph-first-aid-kit'] }
};

// Orb palette per mood (light, mid, deep)
const FINDER_ORB = {
  default: ['#E8C8BA', '#A9825A', '#6E4B3A'],
  glow: ['#FFE6C2', '#E3A869', '#9C5E2E'],
  calm: ['#D8D5EC', '#9C93C4', '#4F4775'],
  define: ['#F2C9C2', '#C77D72', '#7A3A35'],
  repair: ['#D4E4D2', '#8DB08A', '#41603F']
};

const FINDER_RULES = {
  focus: {
    skin: { categories: ['wellness', 'makeup'], tags: ['hydration', 'glow', 'sensitive skin', 'repair'] },
    hair: { categories: ['hair'], tags: ['curls', 'moisture', 'styling'] },
    makeup: { categories: ['makeup'], tags: ['quick looks', 'minimalist', 'glow'] },
    wellness: { categories: ['wellness', 'body'], tags: ['sleep', 'relaxation'] }
  },
  mood: {
    glow: ['glow', 'hydration'],
    calm: ['sleep', 'relaxation', 'sensitive skin'],
    define: ['curls', 'styling', 'minimalist', 'quick looks'],
    repair: ['repair', 'moisture', 'sensitive skin']
  },
  time: { quick: [0, 10], mid: [10, 20], slow: [15, 999] }
};

function initRitualFinder() {
  const panel = document.getElementById('finder-panel');
  if (!panel) return;

  const steps = panel.querySelectorAll('.finder-step');
  const progressBar = document.getElementById('finder-progress-bar');
  const stepLabel = document.getElementById('finder-step-label');
  const backBtn = document.getElementById('finder-back');
  const restartBtn = document.getElementById('finder-restart');
  const picks = document.getElementById('finder-picks');
  const orb = document.getElementById('finder-orb');

  const answers = {};
  let current = 0;
  let resultTimer = null;

  const goTo = (index) => {
    current = index;
    steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === index));
    progressBar.style.width = `${Math.min(index + 1, 3) / 3 * 100}%`;
    stepLabel.textContent = index < 3 ? `Step ${index + 1} of 3` : 'Your ritual';
    backBtn.disabled = index === 0;
    backBtn.classList.toggle('hidden', index === 3);
    restartBtn.classList.toggle('hidden', index !== 3);

    // Keep keyboard users in place: focus the first option of the new step
    if (index < 3) {
      const firstOpt = steps[index].querySelector('.finder-option.selected') || steps[index].querySelector('.finder-option');
      if (firstOpt && panel.contains(document.activeElement)) firstOpt.focus({ preventScroll: true });
    }
  };

  const renderPicks = () => {
    picks.innerHTML = ['focus', 'time', 'mood']
      .filter(k => answers[k])
      .map(k => {
        const [label, icon] = FINDER_LABELS[k][answers[k]];
        return `<span class="finder-pick"><i class="ph ${icon}"></i>${label}</span>`;
      }).join('');
  };

  const setOrb = (mood) => {
    const [o1, o2, o3] = FINDER_ORB[mood] || FINDER_ORB.default;
    orb.style.setProperty('--o1', o1);
    orb.style.setProperty('--o2', o2);
    orb.style.setProperty('--o3', o3);
  };

  panel.querySelectorAll('.finder-option').forEach(opt => {
    opt.setAttribute('aria-pressed', 'false');
    opt.addEventListener('click', () => {
      const { key, value } = opt.dataset;
      answers[key] = value;
      opt.parentElement.querySelectorAll('.finder-option').forEach(o => {
        o.classList.toggle('selected', o === opt);
        o.setAttribute('aria-pressed', o === opt ? 'true' : 'false');
      });
      renderPicks();
      if (key === 'mood') setOrb(value);

      // Short pause so the selection state registers before advancing
      setTimeout(() => {
        if (current < 2) {
          goTo(current + 1);
        } else {
          showResult();
        }
      }, 320);
    });
  });

  backBtn.addEventListener('click', () => {
    if (current > 0) goTo(current - 1);
  });

  restartBtn.addEventListener('click', () => {
    clearTimeout(resultTimer);
    Object.keys(answers).forEach(k => delete answers[k]);
    panel.querySelectorAll('.finder-option').forEach(o => {
      o.classList.remove('selected');
      o.setAttribute('aria-pressed', 'false');
    });
    renderPicks();
    setOrb('default');
    goTo(0);
    steps[0].querySelector('.finder-option').focus({ preventScroll: true });
  });

  function showResult() {
    const body = document.getElementById('finder-result-body');
    goTo(3);
    body.innerHTML = `
      <div class="finder-loading">
        <div class="dots"><span></span><span></span><span></span></div>
        <p>Curating your ritual&hellip;</p>
      </div>`;
    clearTimeout(resultTimer);
    resultTimer = setTimeout(() => renderResult(body), 900);
  }

  function renderResult(body) {
    const ranked = rankContent(answers);
    const best = ranked[0];
    const item = best.item;
    const creator = window.LumeraData.creators.find(c => c.id === item.creatorId);
    const routine = pickRoutine(answers.focus);
    const match = Math.min(98, 74 + best.score * 3);
    const [moodLabel] = FINDER_LABELS.mood[answers.mood];

    body.innerHTML = `
      <div class="finder-result-card">
        <div class="finder-result-media">
          <img src="${item.thumb}" alt="${item.title}">
          <div class="finder-match"><strong>${match}%</strong>match for you</div>
        </div>
        <div class="finder-result-info">
          <span class="result-kicker">Your ${moodLabel.toLowerCase()} ritual</span>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
          <div class="finder-result-meta">
            <span><i class="ph ph-user"></i>${creator ? creator.name : ''}</span>
            <span><i class="ph ph-clock"></i>${item.duration}</span>
            ${routine ? `<span><i class="ph ph-list-checks"></i>Pairs with ${routine.title}</span>` : ''}
          </div>
          <div class="finder-result-actions">
            <button class="btn btn-light btn-sm" id="finder-open"><i class="ph ph-play"></i> Open guide</button>
            <button class="btn btn-outline btn-sm bookmark-toggle" id="finder-save" data-id="${item.id}" aria-pressed="false"><i class="ph ph-bookmark-simple"></i> Save</button>
            ${routine ? `<a href="#routines" class="btn btn-outline btn-sm" id="finder-routine" data-routine="${routine.id}">See routine</a>` : ''}
          </div>
        </div>
      </div>
      ${ranked.length > 1 ? `
      <div class="finder-alts">
        <h5>Also worth exploring</h5>
        ${ranked.slice(1, 3).map(r => `
          <button class="finder-alt" data-id="${r.item.id}">
            <img src="${r.item.thumb}" alt="">
            <span>${r.item.title}<br><small>${r.item.duration}</small></span>
            <i class="ph ph-arrow-up-right"></i>
          </button>`).join('')}
      </div>` : ''}
    `;

    body.querySelector('#finder-open').addEventListener('click', () => window.openContentModal(item.id));
    window.setupBookmarkToggle(body.querySelector('#finder-save'), 'content', item.id);
    body.querySelectorAll('.finder-alt').forEach(btn => {
      btn.addEventListener('click', () => window.openContentModal(btn.dataset.id));
    });

    // Jump the Routine Guides tabs to the matched routine
    const routineLink = body.querySelector('#finder-routine');
    if (routineLink) {
      routineLink.addEventListener('click', () => {
        const typeSelect = document.getElementById('skin-hair-type');
        if (typeSelect && typeSelect.value !== 'all') {
          typeSelect.value = 'all';
          typeSelect.dispatchEvent(new Event('change'));
        }
        const tab = [...document.querySelectorAll('#routine-tabs .tab-btn')].find(t => t.textContent === routine.title);
        if (tab) tab.click();
      });
    }
  }
}

function parseMinutes(duration) {
  const read = duration.match(/(\d+)\s*m/);
  if (read) return parseInt(read[1], 10);
  const [m, s] = duration.split(':').map(Number);
  return m + (s || 0) / 60;
}

function rankContent(answers) {
  const focusRule = FINDER_RULES.focus[answers.focus];
  const moodTags = FINDER_RULES.mood[answers.mood];
  const [minT, maxT] = FINDER_RULES.time[answers.time];

  return window.LumeraData.content
    .map(item => {
      let score = 0;
      if (focusRule.categories[0] === item.category) score += 6;
      else if (focusRule.categories.includes(item.category)) score += 4;
      score += item.tags.filter(t => focusRule.tags.includes(t)).length;
      score += item.tags.filter(t => moodTags.includes(t)).length * 2;
      const mins = parseMinutes(item.duration);
      if (mins >= minT && mins <= maxT) score += 2;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || b.item.saves - a.item.saves);
}

function pickRoutine(focus) {
  const routines = window.LumeraData.routines;
  if (focus === 'hair') return routines.find(r => r.typeTarget.includes('curly')) || routines[0];
  return routines[0];
}
