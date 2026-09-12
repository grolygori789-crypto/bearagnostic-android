(() => {
  'use strict';

  const SCRIPT_STATE = '__bearagnosticShareCard66';
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
    if (parts.length >= 2) return { before: parts[0].trim(), after: parts[1].trim() };
    return { before: normalized, after: normalized };
  }

  function localeCopy(language) {
    if (language.startsWith('th')) return {
      whatChanged: 'สิ่งที่เปลี่ยนไป', scanContext: 'บริบทการตรวจ', sessionNotes: 'รายละเอียดผลลัพธ์',
      cleanupMethod: 'วิธีการทำความสะอาด', verification: 'การยืนยันผล', generated: 'สร้างผลเมื่อ',
      privacy: 'ความเป็นส่วนตัว', privateByDesign: 'ออกแบบเพื่อความเป็นส่วนตัว', onDeviceVerified: 'ยืนยันบนอุปกรณ์',
      filesReviewed: 'ไฟล์ที่ตรวจ', scanMode: 'โหมดสแกน', coverage: 'ความครอบคลุม',
      privacyValue: 'วิเคราะห์บนอุปกรณ์ · ไม่อัปโหลดเนื้อหาไฟล์', androidConfirmed: 'Android ยืนยันการลบแล้ว',
      noDuplicateRemoved: 'ไม่มีสำเนาซ้ำถูกลบในรอบนี้', freeAfter: 'พื้นที่ว่างหลังทำความสะอาด',
      noVisibleChange: 'เปอร์เซ็นต์พื้นที่ว่างไม่เปลี่ยนอย่างเห็นได้ชัด', beforeCleanup: 'ก่อนทำความสะอาด'
    };
    if (language.startsWith('ja')) return {
      whatChanged: '変更内容', scanContext: 'スキャン情報', sessionNotes: '結果の詳細', cleanupMethod: 'クリーンアップ方法',
      verification: '検証', generated: '生成日時', privacy: 'プライバシー', privateByDesign: 'Privacy by design',
      onDeviceVerified: '端末内で検証', filesReviewed: '確認したファイル', scanMode: 'スキャンモード', coverage: 'カバレッジ',
      privacyValue: '端末内で解析 · ファイル内容はアップロードしません', androidConfirmed: 'Android が削除を確認済み',
      noDuplicateRemoved: 'この処理では重複コピーを削除していません', freeAfter: '処理後の空き容量',
      noVisibleChange: '空き容量率に目立つ変化はありません', beforeCleanup: '処理前'
    };
    return {
      whatChanged: 'What changed', scanContext: 'Scan context', sessionNotes: 'Result details', cleanupMethod: 'Cleanup method',
      verification: 'Verification', generated: 'Generated', privacy: 'Privacy boundary', privateByDesign: 'Private by design',
      onDeviceVerified: 'On-device verified', filesReviewed: 'Files reviewed', scanMode: 'Scan mode', coverage: 'Coverage',
      privacyValue: 'Analyzed on device · no file content uploaded', androidConfirmed: 'Android-confirmed deletion',
      noDuplicateRemoved: 'No duplicate copy removed in this cleanup', freeAfter: 'Free storage after cleanup',
      noVisibleChange: 'No visible percentage change after cleanup', beforeCleanup: 'Before cleanup'
    };
  }

  function formatGeneratedAt(language) {
    const locale = language.startsWith('th') ? 'th-TH' : language.startsWith('ja') ? 'ja-JP' : 'en-GB';
    try {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(new Date());
    } catch (_) {
      return new Date().toLocaleString();
    }
  }

  function buildCleanupPayload() {
    const language = (document.documentElement.lang || 'en').toLowerCase();
    const c = localeCopy(language);
    const title = text('nativeCleanTitle', language.startsWith('th') ? 'ผลการทำความสะอาด' : language.startsWith('ja') ? 'クリーンアップ結果' : 'Cleanup impact');
    const reclaimed = text('nativeCleanBytes', '—');
    const verifiedSpace = text('nativeImpactSub', language.startsWith('th') ? 'พื้นที่ที่คืนได้ซึ่งยืนยันแล้ว' : language.startsWith('ja') ? '確認済みの解放容量' : 'Verified space reclaimed');
    const freeRaw = text('nativeImpactFree', '—');
    const freeSplit = splitArrowPair(freeRaw);
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
      filesValue,
      filesLabel: text('nativeImpactFilesLabel', language.startsWith('th') ? 'ไฟล์ที่ลบ' : language.startsWith('ja') ? '削除したファイル' : 'Files removed'),
      filesDetail: c.androidConfirmed,
      duplicatesValue,
      duplicatesLabel: text('nativeImpactDuplicatesLabel', language.startsWith('th') ? 'สำเนาซ้ำที่จัดการแล้ว' : language.startsWith('ja') ? '解決した重複コピー' : 'Duplicate copies resolved'),
      duplicatesDetail: duplicatesValue === '0' ? c.noDuplicateRemoved : c.androidConfirmed,
      freeValue: freeRaw,
      freeBefore: freeSplit.before,
      freeAfter: freeSplit.after,
      freeChanged,
      freeLabel: c.freeAfter,
      freeDetail: freeChanged && freeSplit.before ? `${c.beforeCleanup}: ${freeSplit.before}` : c.noVisibleChange,
      methodValue,
      methodLabel: c.cleanupMethod,
      proof: text('nativeImpactProof', language.startsWith('th') ? 'นับเฉพาะไฟล์ที่ Android ยืนยันว่าลบแล้วเท่านั้น' : language.startsWith('ja') ? 'Android が削除を確認したファイルのみを集計します。' : 'Only files Android confirmed as deleted are counted.'),
      filesReviewed: text('nativeFilesFact', ''),
      scanMode: text('nativeModeFact', ''),
      coverage: text('nativeCoverageFact', ''),
      whatChangedLabel: c.whatChanged,
      scanContextLabel: c.scanContext,
      sessionNotesLabel: c.sessionNotes,
      verificationLabel: c.verification,
      generatedLabel: c.generated,
      privacyLabel: c.privacy,
      privacyValue: c.privacyValue,
      privateByDesign: c.privateByDesign,
      onDeviceVerified: c.onDeviceVerified,
      filesReviewedLabel: c.filesReviewed,
      scanModeLabel: c.scanMode,
      coverageLabel: c.coverage,
      brandLine: language.startsWith('th') ? 'สุขภาพไฟล์ที่ชัดเจนขึ้น' : language.startsWith('ja') ? 'ファイルを、もっと健やかに。' : 'FILE HEALTH • BRIGHTER DAYS',
      generatedAt: formatGeneratedAt(language),
      resultLine: filesValue === '1'
        ? (language.startsWith('th') ? 'ลบสำเร็จ 1 ไฟล์' : language.startsWith('ja') ? '1 件のファイルを削除' : '1 file removed')
        : (language.startsWith('th') ? `ลบสำเร็จ ${filesValue} ไฟล์` : language.startsWith('ja') ? `${filesValue} 件のファイルを削除` : `${filesValue} files removed`)
    };
  }

  function onShareClick(event) {
    const target = event.target instanceof Element ? event.target.closest('button') : null;
    if (!target || target.id !== 'nativeShareResult') return;
    const bridge = window.BearagnosticShareBridge;
    if (!bridge || typeof bridge.shareCleanupCard !== 'function') return;
    let result = {};
    try { result = parse(bridge.shareCleanupCard(JSON.stringify(buildCleanupPayload())), {}); }
    catch (_) { return; }
    if (!result.accepted) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  window.addEventListener('click', onShareClick, true);
})();
