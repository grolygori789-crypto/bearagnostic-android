(() => {
  'use strict';

  const SCRIPT_STATE = '__bearagnosticShareCard63';
  if (window[SCRIPT_STATE]) return;
  window[SCRIPT_STATE] = true;

  const byId = (id) => document.getElementById(id);
  const text = (id, fallback = '') => {
    const value = byId(id)?.textContent;
    return String(value == null ? fallback : value).replace(/\s+/g, ' ').trim();
  };
  const parse = (value, fallback = {}) => {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  };

  function buildCleanupPayload() {
    const language = (document.documentElement.lang || 'en').toLowerCase();
    const title = text('nativeCleanTitle', language.startsWith('th') ? 'ผลการทำความสะอาด' : language.startsWith('ja') ? 'クリーンアップ結果' : 'Cleanup impact');
    const reclaimed = text('nativeCleanBytes', '—');
    const heroHeadline = text('nativeImpactHeadline', reclaimed);
    const verifiedSpace = text('nativeImpactSub', language.startsWith('th') ? 'พื้นที่ที่คืนได้ซึ่งยืนยันแล้ว' : language.startsWith('ja') ? '確認済みの解放容量' : 'Verified space reclaimed');

    return {
      language,
      shareTitle: `Bearagnostic — ${title}`,
      title,
      kicker: text('nativeImpactKicker', language.startsWith('th') ? 'ผลการทำความสะอาด' : language.startsWith('ja') ? 'クリーンアップ結果' : 'CLEANUP IMPACT'),
      reclaimed,
      heroHeadline,
      verifiedSpace,
      freeValue: text('nativeImpactFree', '—'),
      freeLabel: text('nativeImpactFreeLabel', language.startsWith('th') ? 'พื้นที่ว่าง' : language.startsWith('ja') ? '空き容量' : 'Free storage'),
      filesValue: text('nativeImpactFiles', '0'),
      filesLabel: text('nativeImpactFilesLabel', language.startsWith('th') ? 'ไฟล์ที่ลบ' : language.startsWith('ja') ? '削除したファイル' : 'Files removed'),
      duplicatesValue: text('nativeImpactDuplicates', '0'),
      duplicatesLabel: text('nativeImpactDuplicatesLabel', language.startsWith('th') ? 'สำเนาซ้ำที่จัดการแล้ว' : language.startsWith('ja') ? '解決した重複コピー' : 'Duplicate copies resolved'),
      resolvedValue: text('nativeImpactResolved', '—'),
      resolvedLabel: text('nativeImpactResolvedLabel', language.startsWith('th') ? 'การจัดการความเสี่ยงต่ำ' : language.startsWith('ja') ? '低リスクの解決' : 'Low-risk cleanup resolved'),
      proof: text('nativeImpactProof', language.startsWith('th') ? 'นับเฉพาะไฟล์ที่ Android ยืนยันว่าลบแล้วเท่านั้น' : language.startsWith('ja') ? 'Android が削除を確認したファイルのみを集計します。' : 'Only files Android confirmed as deleted are counted.'),
      brandLine: language.startsWith('th') ? 'สุขภาพไฟล์ที่ชัดเจนขึ้น' : language.startsWith('ja') ? 'ファイルを、もっと健やかに。' : 'FILE HEALTH • BRIGHTER DAYS'
    };
  }

  function onShareClick(event) {
    const target = event.target instanceof Element ? event.target.closest('button') : null;
    if (!target || target.id !== 'nativeShareResult') return;

    const bridge = window.BearagnosticShareBridge;
    if (!bridge || typeof bridge.shareCleanupCard !== 'function') return;

    let result = {};
    try {
      // Synchronous bridge call: only suppress the legacy text-share path after
      // native rendering confirms the image share has been accepted.
      result = parse(bridge.shareCleanupCard(JSON.stringify(buildCleanupPayload())), {});
    } catch (_) {
      return;
    }

    if (!result.accepted) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  // Window capture is intentionally narrow: only #nativeShareResult is handled.
  // No mutation observers, canvas nodes, button disabling, or layout changes.
  window.addEventListener('click', onShareClick, true);
})();
