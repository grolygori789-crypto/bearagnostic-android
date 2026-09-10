(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const MODE_CAPABILITY = Object.freeze({
    deep: 'deep_scan',
    custom: 'custom_scan'
  });

  const FALLBACK = Object.freeze({
    tier: 'free',
    isPro: false,
    source: 'fallback',
    debugControlsAvailable: false,
    billingReady: false,
    canPurchase: false,
    purchaseModel: 'one_time_lifetime',
    productId: 'bearagnostic_pro_lifetime',
    formattedPrice: null,
    noAccountRequired: true,
    ads: false,
    safetyAlwaysFree: true,
    capabilities: {
      quick_scan: true,
      smart_scan: true,
      basic_cleanup: true,
      safety_guidance: true,
      basic_review: true,
      scan_evidence: true,
      share_result: true,
      deep_scan: false,
      custom_scan: false
    }
  });

  let state = { ...FALLBACK, capabilities: { ...FALLBACK.capabilities } };

  function parse(value, fallback = {}) {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  }

  function normalize(raw) {
    const next = raw && typeof raw === 'object' ? raw : {};
    return {
      ...FALLBACK,
      ...next,
      tier: next.tier === 'pro' ? 'pro' : 'free',
      isPro: next.tier === 'pro' || next.isPro === true,
      capabilities: {
        ...FALLBACK.capabilities,
        ...(next.capabilities && typeof next.capabilities === 'object' ? next.capabilities : {})
      }
    };
  }

  function emit() {
    window.dispatchEvent(new CustomEvent('bearagnostic:entitlementchange', {
      detail: { state: snapshot() }
    }));
  }

  function refresh({ notify = false } = {}) {
    const before = JSON.stringify(state);
    const raw = typeof NATIVE.getEntitlementState === 'function'
      ? parse(NATIVE.getEntitlementState(), FALLBACK)
      : FALLBACK;
    state = normalize(raw);
    if (notify && JSON.stringify(state) !== before) emit();
    return snapshot();
  }

  function snapshot() {
    return JSON.parse(JSON.stringify(state));
  }

  function can(capability) {
    refresh();
    return state.capabilities?.[capability] === true;
  }

  function requestPro(source, capability = null) {
    refresh();
    window.dispatchEvent(new CustomEvent('bearagnostic:prorequest', {
      detail: { source: source || 'unknown', capability, state: snapshot() }
    }));
  }

  function setDebugTier(tier) {
    if (typeof NATIVE.setDebugEntitlement !== 'function') return { accepted: false, reason: 'bridge_unavailable' };
    const result = parse(NATIVE.setDebugEntitlement(tier), { accepted: false });
    refresh({ notify: true });
    return result;
  }

  function clearDebugTier() {
    if (typeof NATIVE.clearDebugEntitlement !== 'function') return { accepted: false, reason: 'bridge_unavailable' };
    const result = parse(NATIVE.clearDebugEntitlement(), { accepted: false });
    refresh({ notify: true });
    return result;
  }

  // Register before android-native.js. This capture guard prevents the legacy/native
  // mode handler from starting a Pro-only scan in Free state. NativeBridge enforces
  // the same boundary again, so the UI is never the sole protection layer.
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target?.closest) return;

    const proEntry = target.closest('[data-pro-entry],#supportProjectRow');
    if (proEntry) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      requestPro('more');
      return;
    }

    const modeButton = target.closest('[data-native-mode]');
    if (modeButton) {
      const mode = String(modeButton.dataset.nativeMode || '').toLowerCase();
      const capability = MODE_CAPABILITY[mode];
      if (capability && !can(capability)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        requestPro(`scan_${mode}`, capability);
        return;
      }
    }

    if (target.closest('#nativeCustomStart') && !can('custom_scan')) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      requestPro('custom_start', 'custom_scan');
    }
  }, true);

  window.addEventListener('focus', () => refresh({ notify: true }));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refresh({ notify: true });
  });

  refresh();

  window.BearagnosticEntitlement = Object.freeze({
    getState: () => snapshot(),
    refresh: () => refresh({ notify: true }),
    isPro: () => { refresh(); return state.isPro === true; },
    can,
    requestPro,
    setDebugTier,
    clearDebugTier
  });
})();
