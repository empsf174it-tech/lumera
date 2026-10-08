// main.js - Core UI Logic (Nav, scroll-spy, modals, reveals, forms)

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initModals();
  initForms();
  initAccordion();
  initBackToTop();
  initScrollProgress();
  initCounters();
  initSpotlight();
});

function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const dropdowns = document.querySelectorAll('.dropdown');
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
  
  // Hamburger Toggle
  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile nav on link click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Mobile Dropdown Toggle
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 1100) {
        e.preventDefault();
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !expanded);
        dropdown.classList.toggle('active');
      }
    });
  });

  // Sticky Nav & Scroll Spy
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    updateActiveLink();
  }, { passive: true });

  // Scroll spy: highlight the link for the section in view. Sections without
  // their own link keep the previous one; dropdown links also light up "Explore".
  const spyLinks = navbar.querySelectorAll('.nav-links a[href^="#"], .nav-cta');
  function updateActiveLink() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 40;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    let current = 'home';

    sections.forEach(section => {
      const id = section.getAttribute('id');
      if (!id || !navLinks.querySelector(`a[href="#${id}"]`)) return;
      if (section.offsetTop <= scrollPos || atBottom) current = id;
    });

    spyLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    dropdowns.forEach(dropdown => {
      const hasActive = !!dropdown.querySelector('.dropdown-item.active');
      dropdown.querySelector('.dropdown-toggle').classList.toggle('active', hasActive);
    });
  }
  updateActiveLink();
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Some sections render .reveal blocks after load (e.g. creators), so observe those too
  new MutationObserver(mutations => {
    mutations.forEach(m => m.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      if (node.classList.contains('reveal')) observer.observe(node);
      node.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }));
  }).observe(document.getElementById('main-content'), { childList: true, subtree: true });
}

function initModals() {
  const closeBtns = document.querySelectorAll('[data-close]');
  
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(m => m.hidden = true);
      document.body.style.overflow = ''; // Restore scroll
    });
  });
  
  // Esc key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal:not([hidden])').forEach(m => {
        m.hidden = true;
        document.body.style.overflow = '';
      });
    }
  });
}

function initForms() {
  const forms = document.querySelectorAll('.validate-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('input, textarea');
      
      inputs.forEach(input => {
        if (!input.checkValidity()) {
          isValid = false;
          input.parentElement.classList.add('error');
        } else {
          input.parentElement.classList.remove('error');
        }
      });
      
      if (isValid) {
        // Simulate success
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Sending...';
        btn.disabled = true;
        
        setTimeout(() => {
          form.querySelector('.form-success').classList.remove('hidden');
          form.reset();
          btn.innerHTML = originalText;
          btn.disabled = false;
          
          setTimeout(() => {
            form.querySelector('.form-success').classList.add('hidden');
          }, 3000);
        }, 1500);
      }
    });
    
    // Clear error on input
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.parentElement.classList.remove('error');
      });
    });
  });
}

function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      
      // Optional: close others
      // triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
      
      trigger.setAttribute('aria-expanded', !expanded);
    });
  });
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initCounters() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      observer.unobserve(el);
      if (reduced) { el.textContent = target; return; }
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / 1600, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

function initSpotlight() {
  document.querySelectorAll('.spotlight').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

// Global utility for setting up bookmark buttons
window.setupBookmarkToggle = function(button, type, id) {
  const isSaved = window.Bookmarks.isSaved(type, id);
  button.setAttribute('aria-pressed', isSaved);
  const icon = button.querySelector('i');
  if (isSaved) {
    icon.classList.remove('ph');
    icon.classList.add('ph-fill');
  }
  
  // Need to clone and replace to avoid multiple event listeners if called multiple times
  const newBtn = button.cloneNode(true);
  button.parentNode.replaceChild(newBtn, button);
  
  newBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const nowSaved = window.Bookmarks.toggle(type, id);
    newBtn.setAttribute('aria-pressed', nowSaved);
    const newIcon = newBtn.querySelector('i');
    if (nowSaved) {
      newIcon.classList.remove('ph');
      newIcon.classList.add('ph-fill');
    } else {
      newIcon.classList.remove('ph-fill');
      newIcon.classList.add('ph');
    }
  });
}
