/* ==========================================================================
   Printli Architecture Documentation Portal - Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Always lock dark mode
  document.documentElement.setAttribute('data-theme', 'dark');

  // ==========================================================================
  // Mermaid Initialization (Clean Natural Scale & No Box Clipping)
  // ==========================================================================
  function initMermaid() {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: 'loose',
      theme: 'dark',
      themeVariables: {
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        fontSize: '13.5px',
        primaryColor: '#1e293b',
        primaryTextColor: '#f1f5f9',
        primaryBorderColor: '#3b82f6',
        lineColor: '#60a5fa',
        secondaryColor: '#0f172a',
        tertiaryColor: '#1e293b',
        mainBkg: '#131c2e',
        nodeBorder: '#3b82f6',
        clusterBkg: 'rgba(30, 41, 59, 0.45)',
        clusterBorder: '#334155',
        titleColor: '#f8fafc',
        edgeLabelBackground: '#0f172a',
        actorBkg: '#1e293b',
        actorBorder: '#3b82f6',
        actorTextColor: '#f1f5f9',
        actorLineColor: '#475569',
        signalColor: '#60a5fa',
        signalTextColor: '#f1f5f9',
        labelBoxBkgColor: '#1e293b',
        labelBoxBorderColor: '#3b82f6',
        labelTextColor: '#f1f5f9',
        loopTextColor: '#94a3b8',
        noteBorderColor: '#d97706',
        noteBkgColor: '#2e1d05',
        noteTextColor: '#fde68a'
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
  // Copy Mermaid Code
  // ==========================================================================
  const toast = document.getElementById('toast');
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2400);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.diagram-card');
      const mermaidPre = card.querySelector('pre.mermaid');
      if (mermaidPre) {
        const code = mermaidPre.getAttribute('data-source') || mermaidPre.textContent.trim();
        navigator.clipboard.writeText(code).then(() => {
          showToast('Mermaid code copied to clipboard');
        }).catch(() => {
          showToast('Failed to copy code');
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
