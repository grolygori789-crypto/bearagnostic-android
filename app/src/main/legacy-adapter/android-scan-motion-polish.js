(() => {
  'use strict';

  const STYLE_ID = 'androidScanMotionPolish60Style';
  const TILE_SELECTOR = '.scan-file-tile';
  const STREAM_ID = 'scanFileStream';
  const FLIGHT_MS = 1640;

  let stream = null;
  let streamObserver = null;
  let resizeObserver = null;
  let streamWidth = 0;
  let streamHeight = 0;

  function reducedMotion() {
    const mode = document.documentElement.dataset.motion;
    return mode === 'reduced' ||
      (mode === 'system' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      ${TILE_SELECTOR}{
        animation:none!important;
        opacity:0;
        transform:translate3d(0,8px,0) rotate(-7deg) scale(.82);
        transform-origin:50% 50%;
        will-change:transform,opacity!important;
        backface-visibility:hidden;
        -webkit-backface-visibility:hidden;
        -webkit-font-smoothing:antialiased;
        contain:layout style;
      }
      @media(prefers-reduced-motion:reduce){
        ${TILE_SELECTOR}{animation:none!important;will-change:auto!important}
      }
      html[data-motion='reduced'] ${TILE_SELECTOR}{
        animation:none!important;
        will-change:auto!important;
      }
    `;
    document.head.appendChild(style);
  }

  function refreshMetrics() {
    if (!stream) return;
    streamWidth = stream.clientWidth || streamWidth || 1;
    streamHeight = stream.clientHeight || streamHeight || 1;
  }

  function laneFor(tile) {
    const raw = tile.style.getPropertyValue('--lane');
    const lane = Number.parseInt(raw || '0', 10);
    return Number.isFinite(lane) ? Math.max(0, Math.min(3, lane)) : 0;
  }

  function animateTile(tile) {
    if (!(tile instanceof HTMLElement) || tile.dataset.androidMotionPolished === '1') return;
    tile.dataset.androidMotionPolished = '1';

    if (reducedMotion()) {
      tile.style.opacity = '0';
      tile.style.willChange = 'auto';
      return;
    }

    if (!streamWidth || !streamHeight) refreshMetrics();

    const lane = laneFor(tile);
    const startTopPercent = 8 + (lane * 16);
    const dx = streamWidth * 0.73; // legacy left: -15% -> 58%
    const dy = streamHeight * ((63 - startTopPercent) / 100); // legacy top -> 63%

    const mid1X = dx * 0.39;
    const mid1Y = (dy * 0.24) - 7;
    const mid2X = dx * 0.73;
    const mid2Y = (dy * 0.62) - 5;

    if (typeof tile.animate !== 'function') {
      // Safe fallback: leave the tile hidden rather than re-enable layout-heavy left/top animation.
      tile.style.opacity = '0';
      tile.style.willChange = 'auto';
      return;
    }

    const animation = tile.animate([
      {
        offset: 0,
        opacity: 0,
        transform: 'translate3d(0,8px,0) rotate(-7deg) scale(.82)'
      },
      {
        offset: 0.14,
        opacity: 0.96,
        transform: `translate3d(${mid1X.toFixed(2)}px,${mid1Y.toFixed(2)}px,0) rotate(-2.4deg) scale(.92)`
      },
      {
        offset: 0.58,
        opacity: 0.98,
        transform: `translate3d(${mid2X.toFixed(2)}px,${mid2Y.toFixed(2)}px,0) rotate(1.2deg) scale(1)`
      },
      {
        offset: 0.88,
        opacity: 0.74,
        transform: `translate3d(${(dx * 0.94).toFixed(2)}px,${(dy * 0.88).toFixed(2)}px,0) rotate(3deg) scale(.68)`
      },
      {
        offset: 1,
        opacity: 0,
        transform: `translate3d(${dx.toFixed(2)}px,${(dy + 6).toFixed(2)}px,0) rotate(4deg) scale(.48)`
      }
    ], {
      duration: FLIGHT_MS,
      easing: 'cubic-bezier(.20,.72,.18,1)',
      fill: 'forwards'
    });

    animation.onfinish = () => {
      tile.style.opacity = '0';
      tile.style.willChange = 'auto';
    };
    animation.oncancel = () => {
      tile.style.willChange = 'auto';
    };
  }

  function attach() {
    ensureStyle();
    const nextStream = document.getElementById(STREAM_ID);
    if (!nextStream || nextStream === stream) return;

    streamObserver?.disconnect();
    resizeObserver?.disconnect();

    stream = nextStream;
    refreshMetrics();

    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(refreshMetrics);
      resizeObserver.observe(stream);
    } else {
      window.addEventListener('resize', refreshMetrics, { passive: true });
    }

    streamObserver = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches?.(TILE_SELECTOR)) animateTile(node);
          node.querySelectorAll?.(TILE_SELECTOR).forEach(animateTile);
        }
      }
    });
    streamObserver.observe(stream, { childList: true });

    stream.querySelectorAll(TILE_SELECTOR).forEach(animateTile);
  }

  attach();
  document.addEventListener('DOMContentLoaded', attach, { once: true });
  window.addEventListener('bearagnostic:navigation', attach);
})();
