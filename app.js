/* ==========================================================================
   Printli Architecture Documentation Portal - Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Always lock dark mode
  document.documentElement.setAttribute('data-theme', 'dark');

  // ==========================================================================
  // Sidebar Collapse / Expand Controller
  // ==========================================================================
  const layoutWrapper = document.getElementById('layout-wrapper');
  const tocSidebar = document.getElementById('toc-sidebar');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');

  function setSidebarState(collapsed) {
    if (collapsed) {
      layoutWrapper.classList.add('sidebar-collapsed');
      tocSidebar.classList.add('collapsed');
      localStorage.setItem('printli-sidebar-collapsed', 'true');
    } else {
      layoutWrapper.classList.remove('sidebar-collapsed');
      tocSidebar.classList.remove('collapsed');
      localStorage.setItem('printli-sidebar-collapsed', 'false');
    }
  }

  // Restore saved sidebar state if any
  if (localStorage.getItem('printli-sidebar-collapsed') === 'true') {
    setSidebarState(true);
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', () => {
      setSidebarState(true);
    });
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      const isCurrentlyCollapsed = tocSidebar.classList.contains('collapsed');
      setSidebarState(!isCurrentlyCollapsed);
    });
  }
  function initMermaid() {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: 'loose',
      theme: 'base',
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
      themeVariables: {
        background: '#1f232b',
        mainBkg: '#262b34',
        primaryColor: '#262b34',
        primaryTextColor: '#f2f3f5',
        lineColor: '#a8adb8',
        primaryBorderColor: '#9aa4b8',
        nodeBorder: '#9aa4b8',
        clusterBorder: '#9aa4b8',
        edgeLabelBackground: '#1f232b',
        clusterBkg: 'rgba(127,127,127,0.07)',
        titleColor: '#f2f3f5',
        darkMode: true,
        rowOdd: '#1f232b',
        rowEven: 'rgba(127,127,127,0.07)',
        attributeBackgroundColorOdd: '#1f232b',
        attributeBackgroundColorEven: 'rgba(127,127,127,0.07)',
        fontSize: '15px',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        actorBkg: '#262b34',
        actorBorder: '#9aa4b8',
        actorTextColor: '#f2f3f5',
        actorLineColor: '#a8adb8',
        signalColor: '#a8adb8',
        signalTextColor: '#f2f3f5',
        labelBoxBkgColor: '#262b34',
        labelBoxBorderColor: '#9aa4b8',
        labelTextColor: '#f2f3f5',
        noteBorderColor: '#9aa4b8',
        noteBkgColor: '#262b34',
        noteTextColor: '#f2f3f5'
      },
      themeCSS: `
        .node rect, .node circle, .node polygon, .node path, .cluster rect {
          stroke-width: 2px !important;
          stroke: #9aa4b8 !important;
        }
        .node .label {
          color: #f2f3f5 !important;
          line-height: 1.4 !important;
        }
        .node foreignObject, .label foreignObject {
          overflow: visible !important;
        }
        .edgeLabel {
          background: #1f232b !important;
          color: #f2f3f5 !important;
          padding: 2px 6px !important;
        }
        .messageText {
          fill: #f2f3f5 !important;
          stroke: none !important;
        }
      `
    });

    // Run mermaid on all diagrams
    mermaid.run({
      nodes: document.querySelectorAll('.mermaid')
    }).catch(err => {
      console.warn('Mermaid rendering notice:', err);
    });
  }

  // Initialize Mermaid
  initMermaid();

  // ==========================================================================
  // Diagram Search
  // ==========================================================================
  const searchInput = document.getElementById('diagram-search');
  const searchCount = document.getElementById('search-count');
  const cards = Array.from(document.querySelectorAll('.diagram-card'));
  const batchDividers = document.querySelectorAll('.batch-divider');

  function filterDiagrams() {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(card => {
      const title = (card.querySelector('h2, h3')?.textContent || '').toLowerCase();
      const explanation = (card.querySelector('.card-explanation')?.textContent || '').toLowerCase();
      const mermaidCode = (card.querySelector('.mermaid')?.textContent || '').toLowerCase();

      const matchesSearch = !query || title.includes(query) || explanation.includes(query) || mermaidCode.includes(query);

      if (matchesSearch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update search count badge
    searchCount.textContent = `${visibleCount} diagram${visibleCount === 1 ? '' : 's'}`;

    // Hide empty batch dividers if all child cards are hidden
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
        showToast('Diagram is rendering...');
        return;
      }

      zoomTitle.textContent = title;
      zoomTarget.innerHTML = '';
      
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
          minScale: 0.3,
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
      const top = section.offsetTop - 120;
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
