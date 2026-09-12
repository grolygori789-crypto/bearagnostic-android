(() => {
  'use strict';

  const SCRIPT_STATE = '__bearagnosticShareCard65';
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

  function splitArrowPair(value) {
    const normalized = String(value || '').replace(/\s+/g, ' ').trim();
    const parts = normalized.split(/\s*[→➜➡]\s*/);
    if (parts.length >= 2) {
      return { before: parts[0].trim(), after: parts[1].trim() };
    }
    return { before: normalized, after: normalized };
  }

  function buildCleanupPayload() {
    const language = (document.documentElement.lang || 'en').toLowerCase();
    const title = text('nativeCleanTitle', language.startsWith('th') ? 'ผลการทำความสะอาด' : language.startsWith('ja') ? 'クリーンアップ結果' : 'Cleanup impact');
    const reclaimed = text('nativeCleanBytes', '—');
    const verifiedSpace = text('nativeImpactSub', language.startsWith('th') ? 'พื้นที่ที่คืนได้ซึ่งยืนยันแล้ว' : language.startsWith('ja') ? '確認済みの解放容量' : 'Verified space reclaimed');
    const freeValueRaw = text('nativeImpactFree', '—');
    const freeSplit = splitArrowPair(freeValueRaw);
    const freeChanged = Boolean(freeSplit.before && freeSplit.after && freeSplit.before !== freeSplit.after);
    const filesValue = text('nativeImpactFiles', '0');
    const duplicatesValue = text('nativeImpactDuplicates', '0');
    const methodValue = text('nativeImpactResolved', '—');

    return {
      language,
      shareTitle: `Bearagnostic — ${title}`,
      title,
      kicker: text('nativeImpactKicker', language.startsWith('th') ? 'ผลการทำความสะอาด' : language.startsWith('ja') ? 'クリーンアップ結果' : 'Cleanup impact'),
      reclaimed,
      verifiedSpace,
      freeValue: freeValueRaw,
      freeBefore: freeSplit.before,
      freeAfter: freeSplit.after,
      freeChanged,
      freeLabel: text('nativeImpactFreeLabel', language.startsWith('th') ? 'พื้นที่ว่าง' : language.startsWith('ja') ? '空き容量' : 'Free storage'),
      filesValue,
      filesLabel: text('nativeImpactFilesLabel', language.startsWith('th') ? 'ไฟล์ที่ลบ' : language.startsWith('ja') ? '削除したファイル' : 'Files removed'),
      duplicatesValue,
      duplicatesLabel: text('nativeImpactDuplicatesLabel', language.startsWith('th') ? 'สำเนาซ้ำที่จัดการแล้ว' : language.startsWith('ja') ? '解決した重複コピー' : 'Duplicate copies resolved'),
      methodValue,
      methodLabel: text('nativeImpactResolvedLabel', language.startsWith('th') ? 'วิธีการจัดการ' : language.startsWith('ja') ? '処理方法' : 'Cleanup method'),
      proof: text('nativeImpactProof', language.startsWith('th') ? 'นับเฉพาะไฟล์ที่ Android ยืนยันว่าลบแล้วเท่านั้น' : language.startsWith('ja') ? 'Android が削除を確認したファイルのみを集計します。' : 'Only files Android confirmed as deleted are counted.'),
      brandLine: language.startsWith('th') ? 'สุขภาพไฟล์ที่ชัดเจนขึ้น' : language.startsWith('ja') ? 'ファイルを、もっと健やかに。' : 'FILE HEALTH • BRIGHTER DAYS',
      generatedAt: new Date().toLocaleString(),
      resultLine: filesValue === '1'
        ? (language.startsWith('th') ? 'ลบสำเร็จ 1 ไฟล์' : language.startsWith('ja') ? '1 件のファイルを削除' : '1 file removed')
        : (language.startsWith('th') ? `ลบสำเร็จ ${filesValue} ไฟล์` : language.startsWith('ja') ? `${filesValue} 件のファイルを削除` : `${filesValue} files removed`),
      detailsLine: duplicatesValue === '1'
        ? (language.startsWith('th') ? 'จัดการสำเนาซ้ำได้ 1 รายการ' : language.startsWith('ja') ? '重複コピーを 1 件解決' : '1 duplicate copy resolved')
        : (language.startsWith('th') ? `จัดการสำเนาซ้ำได้ ${duplicatesValue} รายการ` : language.startsWith('ja') ? `重複コピーを ${duplicatesValue} 件解決` : `${duplicatesValue} duplicate copies resolved`),
      deltaNote: freeChanged
        ? (language.startsWith('th') ? 'พื้นที่ว่างก่อนทำความสะอาด → หลังทำความสะอาด' : language.startsWith('ja') ? 'クリーンアップ前 → 後の空き容量' : 'Before cleanup → after cleanup')
        : (language.startsWith('th') ? 'เปอร์เซ็นต์พื้นที่ว่างยังไม่เปลี่ยนอย่างเห็นได้ชัดหลังทำความสะอาด' : language.startsWith('ja') ? 'クリーンアップ後も空き容量比率に目立つ変化はありません。' : 'No visible percentage change after cleanup')
    };
  }

  function onShareClick(event) {
    const target = event.target instanceof Element ? event.target.closest('button') : null;
    if (!target || target.id !== 'nativeShareResult') return;

    const bridge = window.BearagnosticShareBridge;
    if (!bridge || typeof bridge.shareCleanupCard !== 'function') return;

    let result = {};
    try {
      result = parse(bridge.shareCleanupCard(JSON.stringify(buildCleanupPayload())), {});
    } catch (_) {
      return;
    }

    if (!result.accepted) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  window.addEventListener('click', onShareClick, true);
})();
