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
    if (language.startsWith('es')) return {
      whatChanged: 'Qué cambió', scanContext: 'Contexto del análisis', sessionNotes: 'Detalles del resultado', cleanupMethod: 'Método de limpieza',
      verification: 'Verificación', generated: 'Generado', privacy: 'Límite de privacidad', privateByDesign: 'Privacidad desde el diseño',
      onDeviceVerified: 'Verificado en el dispositivo', filesReviewed: 'Archivos revisados', scanMode: 'Modo de análisis', coverage: 'Cobertura',
      privacyValue: 'Analizado en el dispositivo · no se sube el contenido de los archivos', androidConfirmed: 'Eliminación confirmada por Android',
      noDuplicateRemoved: 'No se eliminó ninguna copia duplicada en esta limpieza', freeAfter: 'Espacio libre tras la limpieza',
      noVisibleChange: 'Sin cambio porcentual visible tras la limpieza', beforeCleanup: 'Antes de la limpieza'
    };
    if (language === 'pt-br' || language.startsWith('pt-br') || language.startsWith('pt_')) return {
      whatChanged: 'O que mudou', scanContext: 'Contexto da verificação', sessionNotes: 'Detalhes do resultado', cleanupMethod: 'Método de limpeza',
      verification: 'Verificação', generated: 'Gerado', privacy: 'Limite de privacidade', privateByDesign: 'Privacidade desde o design',
      onDeviceVerified: 'Verificado no dispositivo', filesReviewed: 'Arquivos revisados', scanMode: 'Modo de verificação', coverage: 'Cobertura',
      privacyValue: 'Analisado no dispositivo · nenhum conteúdo de arquivo é enviado', androidConfirmed: 'Exclusão confirmada pelo Android',
      noDuplicateRemoved: 'Nenhuma cópia duplicada foi removida nesta limpeza', freeAfter: 'Espaço livre após a limpeza',
      noVisibleChange: 'Sem alteração percentual visível após a limpeza', beforeCleanup: 'Antes da limpeza'
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
    const locale = language.startsWith('th') ? 'th-TH' : language.startsWith('ja') ? 'ja-JP' : language.startsWith('es') ? 'es-ES' : (language === 'pt-br' || language.startsWith('pt-br') || language.startsWith('pt_')) ? 'pt-BR' : 'en-GB';
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
    const isTh = language.startsWith('th');
    const isJa = language.startsWith('ja');
    const isEs = language.startsWith('es');
    const isPt = language === 'pt-br' || language.startsWith('pt-br') || language.startsWith('pt_');
    const localized = (en, th, ja, es, pt) => isTh ? th : isJa ? ja : isEs ? es : isPt ? pt : en;
    const title = text('nativeCleanTitle', localized('Cleanup impact', 'ผลการทำความสะอาด', 'クリーンアップ結果', 'Impacto de la limpieza', 'Impacto da limpeza'));
    const reclaimed = text('nativeCleanBytes', '—');
    const verifiedSpace = text('nativeImpactSub', localized('Verified space reclaimed', 'พื้นที่ที่คืนได้ซึ่งยืนยันแล้ว', '確認済みの解放容量', 'Espacio recuperado verificado', 'Espaço recuperado verificado'));
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
      kicker: text('nativeImpactKicker', localized('Cleanup impact', 'ผลการทำความสะอาด', 'クリーンアップ結果', 'Impacto de la limpieza', 'Impacto da limpeza')),
      reclaimed,
      verifiedSpace,
      filesValue,
      filesLabel: text('nativeImpactFilesLabel', localized('Files removed', 'ไฟล์ที่ลบ', '削除したファイル', 'Archivos eliminados', 'Arquivos removidos')),
      filesDetail: c.androidConfirmed,
      duplicatesValue,
      duplicatesLabel: text('nativeImpactDuplicatesLabel', localized('Duplicate copies resolved', 'สำเนาซ้ำที่จัดการแล้ว', '解決した重複コピー', 'Copias duplicadas resueltas', 'Cópias duplicadas resolvidas')),
      duplicatesDetail: duplicatesValue === '0' ? c.noDuplicateRemoved : c.androidConfirmed,
      freeValue: freeRaw,
      freeBefore: freeSplit.before,
      freeAfter: freeSplit.after,
      freeChanged,
      freeLabel: c.freeAfter,
      freeDetail: freeChanged && freeSplit.before ? `${c.beforeCleanup}: ${freeSplit.before}` : c.noVisibleChange,
      methodValue,
      methodLabel: c.cleanupMethod,
      proof: text('nativeImpactProof', localized('Only files Android confirmed as deleted are counted.', 'นับเฉพาะไฟล์ที่ Android ยืนยันว่าลบแล้วเท่านั้น', 'Android が削除を確認したファイルのみを集計します。', 'Solo se cuentan los archivos cuya eliminación confirmó Android.', 'Só são contabilizados os arquivos cuja exclusão foi confirmada pelo Android.')),
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
      brandLine: localized('FILE HEALTH • BRIGHTER DAYS', 'สุขภาพไฟล์ที่ชัดเจนขึ้น', 'ファイルを、もっと健やかに。', 'SALUD DE ARCHIVOS • DÍAS MÁS LIGEROS', 'SAÚDE DOS ARQUIVOS • DIAS MAIS LEVES'),
      generatedAt: formatGeneratedAt(language),
      resultLine: filesValue === '1'
        ? localized('1 file removed', 'ลบสำเร็จ 1 ไฟล์', '1 件のファイルを削除', '1 archivo eliminado', '1 arquivo removido')
        : localized(`${filesValue} files removed`, `ลบสำเร็จ ${filesValue} ไฟล์`, `${filesValue} 件のファイルを削除`, `${filesValue} archivos eliminados`, `${filesValue} arquivos removidos`)
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
