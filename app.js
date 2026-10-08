/* ==========================================================================
   Printli Architecture Documentation Portal - Interactive Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Theme Management
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn.querySelector('.theme-icon');
  
  const getPreferredTheme = () => {
    const saved = localStorage.getItem('printli-theme');
    // Default to dark mode as requested
    return saved ? saved : 'dark';
  };

  const applyTheme = (theme, reRenderMermaid = false) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('printli-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    
    if (reRenderMermaid && window.mermaid) {
      initMermaid(theme);
    }
  };

  // Initial Theme
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme, false);

  themeToggleBtn.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = active === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  });

  // Listen for OS theme changes only if user hasn't set preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('printli-theme')) {
      applyTheme(e.matches ? 'dark' : 'light', true);
    }
  });

  // ==========================================================================
  // Mermaid Initialization (Clean Natural Scale & No Box Clipping)
  // ==========================================================================
  function initMermaid(theme = 'dark') {
    const isDark = theme === 'dark';
    
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: 'loose',
      theme: isDark ? 'dark' : 'default',
      themeVariables: {
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        fontSize: '13.5px',
        primaryColor: isDark ? '#1e293b' : '#eff6ff',
        primaryTextColor: isDark ? '#f1f5f9' : '#0f172a',
        primaryBorderColor: isDark ? '#3b82f6' : '#2563eb',
        lineColor: isDark ? '#60a5fa' : '#3b82f6',
        secondaryColor: isDark ? '#0f172a' : '#f8fafc',
        tertiaryColor: isDark ? '#1e293b' : '#f1f5f9',
        mainBkg: isDark ? '#131c2e' : '#ffffff',
        nodeBorder: isDark ? '#3b82f6' : '#2563eb',
        clusterBkg: isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(239, 246, 255, 0.55)',
        clusterBorder: isDark ? '#334155' : '#cbd5e1',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        edgeLabelBackground: isDark ? '#0f172a' : '#ffffff',
        actorBkg: isDark ? '#1e293b' : '#eff6ff',
        actorBorder: isDark ? '#3b82f6' : '#2563eb',
        actorTextColor: isDark ? '#f1f5f9' : '#0f172a',
        actorLineColor: isDark ? '#475569' : '#94a3b8',
        signalColor: isDark ? '#60a5fa' : '#2563eb',
        signalTextColor: isDark ? '#f1f5f9' : '#0f172a',
        labelBoxBkgColor: isDark ? '#1e293b' : '#eff6ff',
        labelBoxBorderColor: isDark ? '#3b82f6' : '#93c5fd',
        labelTextColor: isDark ? '#f1f5f9' : '#0f172a',
        loopTextColor: isDark ? '#94a3b8' : '#64748b',
        noteBorderColor: isDark ? '#d97706' : '#b45309',
        noteBkgColor: isDark ? '#2e1d05' : '#fef3c7',
        noteTextColor: isDark ? '#fde68a' : '#92400e'
      },
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis',
        nodeSpacing: 35,
        rankSpacing: 35,
        padding: 16
      },
      sequence: {
        useMaxWidth: false,
        wrap: true,
        width: 170,
        actorMargin: 50,
        noteMargin: 12,
        messageMargin: 35
      },
      themeCSS: `
        .node rect, .node circle, .node polygon, .node path {
          stroke-width: 1.5px !important;
          rx: 6px;
          ry: 6px;
        }
        .node foreignObject {
          overflow: visible !important;
        }
        .label foreignObject {
          overflow: visible !important;
        }
        .node .label {
          line-height: 1.4 !important;
          padding: 4px 8px !important;
        }
        .edgeLabel {
          padding: 2px 6px !important;
          border-radius: 4px;
        }
        .cluster rect {
          stroke-width: 1.5px !important;
          rx: 8px;
          ry: 8px;
        }
      `
    });

    // Re-run mermaid on all diagrams
    mermaid.run({
      nodes: document.querySelectorAll('.mermaid')
    }).catch(err => {
      console.warn('Mermaid rendering notice:', err);
    });
  }

  // Initialize Mermaid with current theme
  initMermaid(currentTheme);

  // ==========================================================================
  // Diagram Search & Category Filter
  // ==========================================================================
  const searchInput = document.getElementById('diagram-search');
  const searchCount = document.getElementById('search-count');
  const filterPills = document.querySelectorAll('.filter-pill');
  const cards = Array.from(document.querySelectorAll('.diagram-card'));
  const batchDividers = document.querySelectorAll('.batch-divider');

  let activeFilter = 'all';

  function filterDiagrams() {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(card => {
      const title = (card.querySelector('h2, h3')?.textContent || '').toLowerCase();
      const why = (card.querySelector('.card-why')?.textContent || '').toLowerCase();
      const mermaidCode = (card.querySelector('.mermaid')?.textContent || '').toLowerCase();
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();

      const matchesSearch = !query || title.includes(query) || why.includes(query) || mermaidCode.includes(query);
      const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);

      if (matchesSearch && matchesFilter) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update search count badge
    searchCount.textContent = `${visibleCount} diagram${visibleCount === 1 ? '' : 's'}`;

    // Hide empty batch dividers if all children are hidden
    batchDividers.forEach(divider => {
      let nextElem = divider.nextElementSibling;
      let hasVisibleChild = false;
      while (nextElem && !nextElem.classList.contains('batch-divider') && !nextElem.classList.contains('site-footer')) {
        if (nextElem.classList.contains('diagram-card') && nextElem.style.display !== 'none') {
          hasVisibleChild = true;
          break;
        }
        nextElem = nextElem.nextElementSibling;
      }
      divider.style.display = hasVisibleChild ? 'block' : 'none';
    });
  }

  searchInput.addEventListener('input', filterDiagrams);

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.getAttribute('data-filter');
      filterDiagrams();
    });
  });

  // ==========================================================================
  // Copy Mermaid Code
  // ==========================================================================
  const toast = document.getElementById('toast');
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2400);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const card = btn.closest('.diagram-card');
      const mermaidPre = card.querySelector('pre.mermaid');
      if (mermaidPre) {
        // Find raw source or textContent
        const code = mermaidPre.getAttribute('data-source') || mermaidPre.textContent.trim();
        navigator.clipboard.writeText(code).then(() => {
          showToast('📋 Mermaid code copied to clipboard!');
        }).catch(() => {
          showToast('Failed to copy code.');
        });
      }
    });
  });

  // Store raw mermaid sources before render
  document.querySelectorAll('pre.mermaid').forEach(pre => {
    pre.setAttribute('data-source', pre.textContent.trim());
  });

  // ==========================================================================
  // Zoom & Fullscreen Modal (with Panzoom)
  // ==========================================================================
  const zoomModal = document.getElementById('zoom-modal');
  const zoomTitle = document.getElementById('zoom-modal-title');
  const zoomTarget = document.getElementById('zoom-target');
  const zoomCanvas = document.getElementById('zoom-canvas');
  const zoomCloseBtn = document.getElementById('zoom-close');
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const zoomResetBtn = document.getElementById('zoom-reset');

  let panzoomInstance = null;

  document.querySelectorAll('.zoom-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.diagram-card');
      const title = card.querySelector('h2, h3')?.textContent || 'Diagram';
      const svg = card.querySelector('.diagram-viewport svg');

      if (!svg) {
        showToast('Diagram is still rendering...');
        return;
      }

      zoomTitle.textContent = title;
      zoomTarget.innerHTML = '';
      
      // Clone SVG
      const clonedSvg = svg.cloneNode(true);
      clonedSvg.style.maxWidth = 'none';
      clonedSvg.style.width = 'auto';
      clonedSvg.style.height = 'auto';
      zoomTarget.appendChild(clonedSvg);

      zoomModal.classList.add('active');
      zoomModal.setAttribute('aria-hidden', 'false');

      // Initialize Panzoom
      if (window.Panzoom) {
        if (panzoomInstance) panzoomInstance.destroy();
        panzoomInstance = Panzoom(zoomTarget, {
          maxScale: 6,
          minScale: 0.4,
          contain: 'outside',
          cursor: 'grab'
        });
        zoomCanvas.addEventListener('wheel', panzoomInstance.zoomWithWheel);
      }
    });
  });

  function closeZoomModal() {
    zoomModal.classList.remove('active');
    zoomModal.setAttribute('aria-hidden', 'true');
    if (panzoomInstance) {
      panzoomInstance.reset();
      panzoomInstance.destroy();
      panzoomInstance = null;
    }
  }

  zoomCloseBtn.addEventListener('click', closeZoomModal);
  document.querySelector('.zoom-modal-backdrop').addEventListener('click', closeZoomModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && zoomModal.classList.contains('active')) {
      closeZoomModal();
    }
  });

  zoomInBtn.addEventListener('click', () => panzoomInstance && panzoomInstance.zoomIn());
  zoomOutBtn.addEventListener('click', () => panzoomInstance && panzoomInstance.zoomOut());
  zoomResetBtn.addEventListener('click', () => panzoomInstance && panzoomInstance.reset());

  // ==========================================================================
  // Table of Contents ScrollSpy
  // ==========================================================================
  const tocLinks = document.querySelectorAll('.toc-list a, .toc-group-title');
  const sections = Array.from(document.querySelectorAll('section[id], article[id]'));

  function updateActiveToc() {
    const scrollY = window.scrollY;
    let currentId = '';

    for (const section of sections) {
      const top = section.offsetTop - 160;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.getAttribute('id');
        break;
      }
    }

    if (currentId) {
      tocLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveToc, { passive: true });
});
