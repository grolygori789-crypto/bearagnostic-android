(() => {
  'use strict';

  const BUILD = 40;
  const HINT_STORAGE_KEY = 'bearagnostic.scrollCue.seen.v1';
  const OVERFLOW_EPSILON = 8;
  const BOTTOM_EPSILON = 10;
  const FIRST_SCROLL_DISMISS_PX = 28;

  const byId = (id) => document.getElementById(id);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  let activeScroller = null;
  let hintDismissedThisSession = false;
  let framePending = false;
  let resizeObserver = null;

  const COPY = {
    en: 'More below',
    th: 'เลื่อนดูต่อด้านล่าง',
    ja: '下に続きます',
  };

  function language() {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
  }

  function hintWasSeen() {
    if (hintDismissedThisSession) return true;
    try { return localStorage.getItem(HINT_STORAGE_KEY) === '1'; }
    catch (_) { return false; }
  }

  function markHintSeen() {
    hintDismissedThisSession = true;
    try { localStorage.setItem(HINT_STORAGE_KEY, '1'); } catch (_) {}
  }

  function ensureStyle() {
    if (byId('androidShellUxStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidShellUxStyle';
    style.textContent = `
      /* B40 app-shell UX: root navigation stays consistent; focused tasks stay focused. */
      #nativeHomeButton{display:none!important}
      #toolsScreen.ba-tools-expandable{overflow-y:auto!important;overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch;padding-bottom:24px!important;scrollbar-width:none}
      #toolsScreen.ba-tools-expandable::-webkit-scrollbar{display:none}
      .app-shell.is-checkup.ba-checkup-root{grid-template-rows:auto minmax(0,1fr) auto!important}
      .app-shell.is-checkup.ba-checkup-root .bottom-nav{display:grid!important}
      .app-shell.is-checkup.ba-checkup-root .app-footer{display:none!important}
      .app-shell.is-checkup.ba-checkup-root .app-main{overflow:hidden!important}
      .app-shell.is-checkup.ba-checkup-root #checkupScreen.is-active:not([data-state="running"]){overflow-y:auto!important;overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch;padding-bottom:clamp(12px,1.6dvh,18px)!important}
      .app-shell.is-checkup.ba-checkup-root .bottom-nav .nav-button[data-nav="checkup"]{color:var(--blue)!important}
      #nativeModeSheet:not([hidden]) .native-mode-panel{max-height:calc(100dvh - max(24px,env(safe-area-inset-top)) - max(24px,env(safe-area-inset-bottom)));overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}

      .ba-scroll-cue{position:fixed;z-index:2100;left:50%;width:min(100%,760px);height:38px;transform:translateX(-50%);pointer-events:none;opacity:0;visibility:hidden;transition:opacity .16s ease,visibility .16s ease;display:flex;align-items:flex-end;justify-content:center}
      .ba-scroll-cue.is-visible{opacity:1;visibility:visible}
      .ba-scroll-cue__fade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(244,249,253,0),rgba(244,249,253,.76) 58%,rgba(244,249,253,.97));mask-image:linear-gradient(to bottom,transparent,#000 52%);-webkit-mask-image:linear-gradient(to bottom,transparent,#000 52%)}
      .ba-scroll-cue__chevron{position:relative;z-index:1;width:28px;height:18px;margin-bottom:2px;display:grid;place-items:center;color:#7895ad;filter:drop-shadow(0 1px 0 rgba(255,255,255,.9));opacity:.86}
      .ba-scroll-cue__chevron svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
      .ba-scroll-cue__hint{position:absolute;z-index:2;bottom:18px;left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;gap:5px;min-height:27px;padding:0 10px;border-radius:999px;background:rgba(255,255,255,.92);border:1px solid rgba(91,124,151,.10);box-shadow:0 7px 18px rgba(63,93,120,.09);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#607b91;font-size:10px;line-height:1;font-weight:720;letter-spacing:.005em;white-space:nowrap;opacity:0;visibility:hidden;transition:opacity .16s ease,visibility .16s ease}
      .ba-scroll-cue.show-hint .ba-scroll-cue__hint{opacity:1;visibility:visible}
      @media(max-width:390px){.ba-scroll-cue{height:34px}.ba-scroll-cue__hint{font-size:9.5px;min-height:25px}}
      @media(prefers-reduced-motion:reduce){.ba-scroll-cue,.ba-scroll-cue__hint{transition:none!important}}
      html[data-motion="reduced"] .ba-scroll-cue,html[data-motion="reduced"] .ba-scroll-cue__hint{transition:none!important}
    `;
    document.head.appendChild(style);
  }

  function ensureCue() {
    let cue = byId('baScrollCue');
    if (cue) return cue;
    cue = document.createElement('div');
    cue.id = 'baScrollCue';
    cue.className = 'ba-scroll-cue';
    cue.setAttribute('aria-hidden', 'true');
    cue.innerHTML = `<span class="ba-scroll-cue__fade"></span><span class="ba-scroll-cue__hint" id="baScrollHint"></span><span class="ba-scroll-cue__chevron"><svg viewBox="0 0 24 24"><path d="m7 9 5 5 5-5"/></svg></span>`;
    document.body.appendChild(cue);
    return cue;
  }

  function isVisible(element) {
    if (!element || element.hidden) return false;
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function isScrollable(element) {
    if (!element || !isVisible(element)) return false;
    const overflowY = getComputedStyle(element).overflowY;
    if (!['auto', 'scroll', 'overlay'].includes(overflowY)) return false;
    return element.scrollHeight > element.clientHeight + OVERFLOW_EPSILON;
  }

  function openFocusedSurface() {
    const selectors = [
      '#nativeModeSheet:not([hidden])',
      '#nativeResultsSheet:not([hidden])',
      '#nativeReviewSheet:not([hidden])',
      '#nativeCleanSummary:not([hidden])',
      '#nativeConfirmSheet:not([hidden])',
      '#scanPicker:not([hidden])',
      '#baDownloadsSurface:not([hidden])',
      '#baInstallersSurface:not([hidden])',
      '#baArchivesSurface:not([hidden])',
      '#baZeroSurface:not([hidden])',
      '#baEmptySurface:not([hidden])',
    ];
    return selectors.some((selector) => isVisible(document.querySelector(selector)));
  }

  function checkupIsRootSurface() {
    const appRoot = byId('appRoot');
    const screen = byId('checkupScreen');
    if (!appRoot || !screen || screen.hidden || !screen.classList.contains('is-active')) return false;
    const state = screen.dataset.state || 'idle';
    if (state === 'running') return false;
    if (openFocusedSurface()) return false;
    // Idle is the normal Checkup destination. Complete is also a root surface if the
    // user closes the focused result sheet, so removing the old header Home never traps them.
    return state === 'idle' || state === 'complete';
  }

  function syncCheckupNavigation() {
    const appRoot = byId('appRoot');
    if (!appRoot) return;
    const rootSurface = checkupIsRootSurface();
    appRoot.classList.toggle('ba-checkup-root', rootSurface);

    if (rootSurface) {
      qsa('.bottom-nav .nav-button').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.nav === 'checkup');
      });
    }
  }

  function visibleDedicatedScroller() {
    const selectors = [
      '#nativeModeSheet:not([hidden]) .native-mode-panel',
      '.ba-qc:not([hidden]) .ba-qc-scroll',
      '.ba-dup:not([hidden]) .ba-dup-scroll',
      '.ba-large:not([hidden]) .ba-large-scroll',
      '.ba-old:not([hidden]) .ba-old-scroll',
      '#baDownloadsSurface:not([hidden]) .ba-downloads-scroll',
      '#baInstallersSurface:not([hidden]) .ba-installers-scroll',
      '#baArchivesSurface:not([hidden]) .ba-archives-scroll',
      '#baZeroSurface:not([hidden]) .ba-zero-scroll',
      '#baEmptySurface:not([hidden]) .ba-empty-scroll',
      '#nativeResultsSheet:not([hidden]) .native-results-scroll',
      '#nativeReviewSheet:not([hidden]) .native-review-list',
      '.native-pro-surface:not([hidden]) .native-pro-scroll',
      '.settings-screen.is-active:not([hidden]) .settings-scroll',
    ];
    for (const selector of selectors) {
      const candidate = document.querySelector(selector);
      if (isScrollable(candidate)) return candidate;
    }
    // Future focused workspaces that follow the existing *-scroll naming convention
    // inherit the same affordance without another observer or per-feature implementation.
    const generic = qsa('[class*="-scroll"]').find((candidate) =>
      !candidate.closest?.('#baScrollCue') && candidate.clientHeight >= 120 && isScrollable(candidate)
    );
    return generic || null;
  }

  function visibleScreenScroller() {
    const active = document.querySelector('.screen.is-active:not([hidden])');
    if (!active) return null;
    if (active.id === 'homeScreen') return null;
    if (active.id === 'checkupScreen' && active.dataset.state !== 'idle') return null;
    return isScrollable(active) ? active : null;
  }

  function modalBlocksScrollCue() {
    return [
      '#nativeConfirmSheet:not([hidden])', '#scanPicker:not([hidden])',
      '.ba-qc-confirm:not([hidden])', '.ba-dup-confirm:not([hidden])',
      '.ba-large-confirm:not([hidden])', '.ba-old-confirm:not([hidden])'
    ].some((selector) => isVisible(document.querySelector(selector)));
  }

  function chooseScroller() {
    if (modalBlocksScrollCue()) return null;
    return visibleDedicatedScroller() || visibleScreenScroller();
  }

  function cueBottomPx(scrollerRect) {
    const selectors = [
      '#baDownloadsSelection > *', '#baDownloadsSelection',
      '#baInstallersSelection > *', '#baInstallersSelection',
      '#baArchivesSelection > *', '#baArchivesSelection',
      '#baZeroSelection > *', '#baZeroSelection',
      '#baEmptySelection > *', '#baEmptySelection',
      '.native-review-footer', '.native-results-footer',
      '.ba-qc-footer', '.ba-dup-footer', '.ba-large-footer', '.ba-old-footer',
    ];
    let overlap = 0;
    for (const selector of selectors) {
      qsa(selector).forEach((element) => {
        if (!isVisible(element)) return;
        const rect = element.getBoundingClientRect();
        const coversScrollerBottom = rect.top < scrollerRect.bottom - 1 && rect.bottom >= scrollerRect.bottom - 2;
        if (coversScrollerBottom) overlap = Math.max(overlap, Math.max(0, scrollerRect.bottom - rect.top));
      });
    }
    const viewportGap = Math.max(0, window.innerHeight - scrollerRect.bottom);
    return viewportGap + overlap;
  }

  function bindScroller(next) {
    if (activeScroller === next) return;
    if (activeScroller) activeScroller.removeEventListener('scroll', onScroll);
    if (resizeObserver && activeScroller) {
      try { resizeObserver.unobserve(activeScroller); } catch (_) {}
    }
    activeScroller = next;
    if (activeScroller) {
      activeScroller.addEventListener('scroll', onScroll, {passive: true});
      if (resizeObserver) {
        try { resizeObserver.observe(activeScroller); } catch (_) {}
      }
    }
  }

  function onScroll() {
    if (activeScroller && activeScroller.scrollTop >= FIRST_SCROLL_DISMISS_PX) markHintSeen();
    scheduleUpdate();
  }

  function updateCue() {
    framePending = false;
    ensureStyle();
    syncCheckupNavigation();

    const cue = ensureCue();
    const hint = byId('baScrollHint');
    const scroller = chooseScroller();
    bindScroller(scroller);

    if (!scroller || !isScrollable(scroller)) {
      cue.classList.remove('is-visible', 'show-hint');
      return;
    }

    const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - BOTTOM_EPSILON;
    cue.classList.toggle('is-visible', !atBottom);
    const scrollerRect = scroller.getBoundingClientRect();
    cue.style.left = `${scrollerRect.left + (scrollerRect.width / 2)}px`;
    cue.style.width = `${Math.max(1, scrollerRect.width)}px`;
    cue.style.bottom = `${cueBottomPx(scrollerRect)}px`;

    const showHint = !atBottom && !hintWasSeen() && scroller.scrollTop < FIRST_SCROLL_DISMISS_PX;
    cue.classList.toggle('show-hint', showHint);
    if (hint) hint.textContent = `${COPY[language()] || COPY.en} ↓`;
  }

  function scheduleUpdate() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateCue);
  }

  function initialize() {
    ensureStyle();
    ensureCue();
    resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(scheduleUpdate) : null;
    const appRoot = byId('appRoot');
    if (resizeObserver && appRoot) {
      try { resizeObserver.observe(appRoot); } catch (_) {}
    }
    scheduleUpdate();

    // A single observer owns app-shell scroll discoverability and Checkup shell state.
    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['hidden', 'class', 'data-state'],
    });

    window.addEventListener('resize', scheduleUpdate, {passive: true});
    window.addEventListener('bearagnostic:screenchange', scheduleUpdate);
    window.addEventListener('bearagnostic:languagechange', scheduleUpdate);
    window.addEventListener('bearagnostic:hiddenitemschange', scheduleUpdate);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once: true});
  else initialize();

  window.BearagnosticShellUx = Object.freeze({
    build: BUILD,
    refresh: scheduleUpdate,
  });
})();
