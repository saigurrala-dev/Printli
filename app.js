/* ==========================================================================
   Printli Architecture Documentation Portal - Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Always lock dark mode
  document.documentElement.setAttribute('data-theme', 'dark');

  // ==========================================================================
  // Sidebar Controller (Desktop Collapse + Mobile Drawer)
  // ==========================================================================
  const layoutWrapper = document.getElementById('layout-wrapper');
  const tocSidebar = document.getElementById('toc-sidebar');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  function isMobile() {
    return window.innerWidth <= 1100;
  }

  function closeMobileSidebar() {
    tocSidebar.classList.remove('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMobileSidebar() {
    tocSidebar.classList.add('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function setSidebarState(collapsed) {
    if (isMobile()) {
      if (collapsed) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    } else {
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
  }

  // Restore saved desktop sidebar state if any
  if (!isMobile() && localStorage.getItem('printli-sidebar-collapsed') === 'true') {
    setSidebarState(true);
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', () => {
      setSidebarState(true);
    });
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      if (isMobile()) {
        const isOpen = tocSidebar.classList.contains('mobile-open');
        setSidebarState(isOpen);
      } else {
        const isCurrentlyCollapsed = tocSidebar.classList.contains('collapsed');
        setSidebarState(!isCurrentlyCollapsed);
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => {
      closeMobileSidebar();
    });
  }

  // Close mobile sidebar upon clicking any TOC link
  document.querySelectorAll('.toc-list a, .toc-group-title').forEach(link => {
    link.addEventListener('click', () => {
      if (isMobile()) {
        closeMobileSidebar();
      }
    });
  });

  // Handle window resize between mobile and desktop
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      closeMobileSidebar();
      if (localStorage.getItem('printli-sidebar-collapsed') === 'true') {
        layoutWrapper.classList.add('sidebar-collapsed');
        tocSidebar.classList.add('collapsed');
      } else {
        layoutWrapper.classList.remove('sidebar-collapsed');
        tocSidebar.classList.remove('collapsed');
      }
    }
  });

  function initMermaid() {
    const nat = { useMaxWidth: false };
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
      er: nat,
      state: nat,
      class: nat,
      pie: nat,
      gantt: nat,
      journey: nat,
      timeline: nat,
      gitGraph: nat,
      mindmap: nat,
      xyChart: nat,
      quadrantChart: nat,
      sankey: nat,
      c4: nat,
      requirement: nat,
      block: nat,
      packet: nat,
      kanban: nat,
      architecture: nat,
      radar: nat,
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
        fontSize: '16px',
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
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
  // Diagram Search with Interactive Suggestions
  // ==========================================================================
  const searchInput = document.getElementById('diagram-search');
  const searchCount = document.getElementById('search-count');
  const searchSuggestions = document.getElementById('search-suggestions');
  const cards = Array.from(document.querySelectorAll('.diagram-card'));
  const batchDividers = document.querySelectorAll('.batch-divider');

  // Pre-build searchable index of all 53 diagrams
  const diagramIndex = cards.map(card => {
    const id = card.id;
    const numEl = card.querySelector('.diagram-number');
    const num = numEl ? numEl.textContent.trim() : '';
    const titleEl = card.querySelector('h2, h3');
    const title = titleEl ? titleEl.textContent.replace(num, '').trim() : '';
    const fullTitle = titleEl ? titleEl.textContent.trim() : '';
    const explanation = (card.querySelector('.card-explanation')?.textContent || '').trim();
    const mermaid = (card.querySelector('.mermaid')?.textContent || '').trim();
    
    // Find closest preceding batch header for context
    let prev = card.previousElementSibling;
    let batchName = 'System Architecture';
    while (prev) {
      if (prev.classList.contains('batch-divider')) {
        const h = prev.querySelector('h2, h3');
        if (h) batchName = h.textContent.trim();
        break;
      }
      prev = prev.previousElementSibling;
    }

    return {
      card,
      id,
      num,
      title,
      fullTitle,
      batchName,
      explanation,
      mermaid,
      searchCorpus: `${num} ${title} ${batchName} ${explanation} ${mermaid}`.toLowerCase()
    };
  });

  const popularTopics = [
    { label: 'Payment & Escrow', query: 'payment' },
    { label: 'Print Station & WebSockets', query: 'print station' },
    { label: 'Authentication & RBAC', query: 'rbac' },
    { label: 'Multi-Tenancy', query: 'tenancy' },
    { label: 'Routing & Auto-Assignment', query: 'routing' },
    { label: 'Offline Resilience', query: 'offline' },
    { label: 'Order State Machine', query: 'order state' },
    { label: 'Refund & Disputes', query: 'refund' },
    { label: 'Audit Logging', query: 'audit' }
  ];

  let selectedSuggestionIndex = -1;

  function jumpToDiagram(cardId) {
    const targetCard = document.getElementById(cardId);
    if (!targetCard) return;

    // Reset all cards to visible so scroll works smoothly
    cards.forEach(c => c.style.display = 'block');
    batchDividers.forEach(b => b.style.display = 'block');
    searchCount.textContent = `53 diagrams`;
    
    // Close suggestions
    hideSuggestions();

    // Smooth scroll to target
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Trigger visual glow highlight
    targetCard.classList.remove('highlight-target');
    void targetCard.offsetWidth; // Force reflow
    targetCard.classList.add('highlight-target');
  }

  function hideSuggestions() {
    if (!searchSuggestions) return;
    searchSuggestions.hidden = true;
    searchSuggestions.innerHTML = '';
    selectedSuggestionIndex = -1;
  }

  function escapeHtml(str) {
    return (str || '').replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  function highlightMatches(text, query) {
    if (!query) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escaped.replace(regex, '<span class="suggestion-highlight">$1</span>');
  }

  function renderSuggestions(query) {
    if (!searchSuggestions) return;
    query = (query || '').trim().toLowerCase();

    if (!query) {
      // Render popular topics suggestions
      let html = `
        <div class="suggestion-header">Popular Topics & Concepts</div>
        <div class="suggestion-pills">
      `;
      popularTopics.forEach(t => {
        html += `<button type="button" class="suggestion-pill" data-query="${escapeHtml(t.query)}">${escapeHtml(t.label)}</button>`;
      });
      html += `</div>`;
      searchSuggestions.innerHTML = html;
      searchSuggestions.hidden = false;

      searchSuggestions.querySelectorAll('.suggestion-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const q = btn.getAttribute('data-query');
          searchInput.value = q;
          filterDiagrams();
          renderSuggestions(q);
        });
      });
      return;
    }

    // Filter index for query
    const matches = diagramIndex.filter(item => item.searchCorpus.includes(query)).slice(0, 8);

    if (matches.length === 0) {
      searchSuggestions.innerHTML = `<div class="suggestion-empty">No diagrams found matching "${escapeHtml(query)}"</div>`;
      searchSuggestions.hidden = false;
      return;
    }

    let html = `<div class="suggestion-header">Suggested Diagrams (${matches.length})</div>`;
    matches.forEach((item, index) => {
      html += `
        <div class="suggestion-item" data-id="${item.id}" data-index="${index}">
          <div class="suggestion-item-main">
            <span class="suggestion-num">${escapeHtml(item.num || '#')}</span>
            <span class="suggestion-title">${highlightMatches(item.title || item.fullTitle, query)}</span>
          </div>
          <span class="suggestion-batch">${escapeHtml(item.batchName.split(':')[0] || 'Diagram')}</span>
        </div>
      `;
    });

    searchSuggestions.innerHTML = html;
    searchSuggestions.hidden = false;
    selectedSuggestionIndex = -1;

    // Attach click handlers
    searchSuggestions.querySelectorAll('.suggestion-item').forEach(itemEl => {
      itemEl.addEventListener('click', (e) => {
        e.preventDefault();
        const id = itemEl.getAttribute('data-id');
        jumpToDiagram(id);
      });
    });
  }

  function filterDiagrams() {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    diagramIndex.forEach(item => {
      const matchesSearch = !query || item.searchCorpus.includes(query);
      if (matchesSearch) {
        item.card.style.display = 'block';
        visibleCount++;
      } else {
        item.card.style.display = 'none';
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

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterDiagrams();
      renderSuggestions(searchInput.value);
    });

    searchInput.addEventListener('focus', () => {
      renderSuggestions(searchInput.value);
    });

    // Keyboard Navigation inside suggestions
    searchInput.addEventListener('keydown', (e) => {
      if (!searchSuggestions || searchSuggestions.hidden) return;

      const items = searchSuggestions.querySelectorAll('.suggestion-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedSuggestionIndex = (selectedSuggestionIndex + 1) % items.length;
        updateSuggestionSelection(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedSuggestionIndex = (selectedSuggestionIndex - 1 + items.length) % items.length;
        updateSuggestionSelection(items);
      } else if (e.key === 'Enter') {
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < items.length) {
          e.preventDefault();
          const id = items[selectedSuggestionIndex].getAttribute('data-id');
          jumpToDiagram(id);
        }
      } else if (e.key === 'Escape') {
        hideSuggestions();
      }
    });
  }

  function updateSuggestionSelection(items) {
    items.forEach((item, idx) => {
      if (idx === selectedSuggestionIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  // Click outside to close suggestions
  document.addEventListener('click', (e) => {
    if (searchInput && searchSuggestions && !searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
      hideSuggestions();
    }
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
