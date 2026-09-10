(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const VERSION_PATTERN = /(?:^|\s)(?:v?\d+\.\d+(?:\.\d+)?(?:-[A-Za-z0-9.-]+)?|B\d+)(?:\s|$|·)/;

  const parse = (value, fallback = {}) => {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  };

  function nativeBuild() {
    const state = parse(NATIVE.getNativeState?.(), {});
    const versionName = String(state.versionName || '').replace(/-debug$/, '').trim();
    const versionCode = Number(state.versionCode);
    if (!versionName || !Number.isFinite(versionCode) || versionCode <= 0) return null;
    return { versionName, versionCode };
  }

  function syncBuildLabels() {
    const build = nativeBuild();
    if (!build) return;

    const shortVersion = build.versionName.split('-')[0];
    const footer = document.querySelector('.app-footer__build');
    const footerValue = `v${shortVersion} · B${build.versionCode}`;
    if (footer && footer.textContent !== footerValue) footer.textContent = footerValue;

    document.querySelectorAll('.native-pref-row b.slate').forEach((el) => {
      const current = String(el.textContent || '').trim();
      if (!VERSION_PATTERN.test(` ${current} `)) return;
      const next = `${build.versionName} · B${build.versionCode}`;
      if (current !== next) el.textContent = next;
    });

    document.querySelectorAll('[data-open="about"] small').forEach((el) => {
      const current = String(el.textContent || '').trim();
      if (!VERSION_PATTERN.test(` ${current} `)) return;
      const next = `Benedict Interactive · ${build.versionName} · B${build.versionCode}`;
      if (current !== next) el.textContent = next;
    });
  }

  function wrapNativeCallbacks() {
    const base = window.BearagnosticAndroid;
    if (!base || base.__buildTruthWrapped) return;

    window.BearagnosticAndroid = Object.freeze({
      ...base,
      __buildTruthWrapped: true,
      onNativeStateChanged(raw) {
        base.onNativeStateChanged?.(raw);
        setTimeout(syncBuildLabels, 0);
      },
      onScanProgress(raw) { base.onScanProgress?.(raw); },
      onScanComplete(raw) {
        base.onScanComplete?.(raw);
        setTimeout(syncBuildLabels, 0);
      },
      onScanCancelled(raw) {
        base.onScanCancelled?.(raw);
        setTimeout(syncBuildLabels, 0);
      },
      onScanError(raw) {
        base.onScanError?.(raw);
        setTimeout(syncBuildLabels, 0);
      },
    });
  }

  wrapNativeCallbacks();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      wrapNativeCallbacks();
      syncBuildLabels();
      setTimeout(syncBuildLabels, 100);
    }, { once: true });
  } else {
    syncBuildLabels();
  }

  window.addEventListener('bearagnostic:languagechange', () => setTimeout(syncBuildLabels, 0));
})();
