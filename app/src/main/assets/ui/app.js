(() => {
  'use strict';

  const COPY = {
    en: {
      kicker: 'ONE-TAP NATIVE CHECKUP', headline: 'One tap.<br><em>Your files, checked locally.</em>', intro: 'Bearagnostic can now scan user-accessible shared storage directly on Android after you grant access.',
      systemStatus: 'SYSTEM STATUS', nativeReady: 'Native checkup ready', nativeBridge: 'Native bridge', nativeBridgeSub: 'Local UI ↔ Android communication', ready: 'Ready',
      storageAccess: 'Storage access', storageAccessSub: 'Permission for user-accessible shared files', notGranted: 'Not granted', granted: 'Granted',
      scannerEngine: 'Scanner engine', scannerEngineSub: 'Native metadata + SHA-256 duplicate verification', scanningState: 'Scanning',
      checkup: 'CHECKUP', scanning: 'Scanning accessible files', complete: 'Checkup complete', cancelled: 'Checkup cancelled', error: 'Checkup could not finish',
      progressTruth: 'File discovery is indeterminate; duplicate verification shows measured byte progress.', filesReviewed: 'files reviewed', largeFiles: 'large files', olderFiles: 'older files', duplicateCopies: 'exact duplicate copies',
      duplicateSpace: 'verified duplicate space that may be reclaimable after review', cancelScan: 'Cancel checkup', privacyTitle: 'Local by design',
      privacyBody: 'The scanner reads accessible shared-storage metadata and hashes duplicate candidates locally. It does not upload or delete files.',
      prepareAccess: 'Prepare device access', prepareAccessSub: 'Android will show the system permission screen', startCheckup: 'Start one-tap checkup', startCheckupSub: 'Scan accessible shared storage now', scanningButton: 'Checkup in progress…', scanningButtonSub: 'Bearagnostic is working locally on this device', runAgain: 'Run checkup again', runAgainSub: 'Refresh the file-health results',
      scopeNote: 'Scope: user-accessible shared storage only. Android-protected app-private areas remain out of scope.',
      phasePreparing: 'PREPARING', phaseFiles: 'FILES', phaseDuplicates: 'DUPLICATES', phaseFinalizing: 'FINALIZING', phaseComplete: 'COMPLETE', phaseCancelled: 'CANCELLED', phaseError: 'ERROR'
    },
    ja: {
      kicker: 'ワンタップ・ネイティブ診断', headline: 'ワンタップで。<br><em>端末内でファイルを診断。</em>', intro: 'アクセス許可後、Bearagnostic は Android 上のユーザーがアクセス可能な共有ストレージを直接診断できます。',
      systemStatus: 'SYSTEM STATUS', nativeReady: 'ネイティブ診断の準備完了', nativeBridge: 'ネイティブブリッジ', nativeBridgeSub: 'ローカル UI ↔ Android 通信', ready: '準備完了',
      storageAccess: 'ストレージアクセス', storageAccessSub: 'ユーザーがアクセス可能な共有ファイルへの権限', notGranted: '未許可', granted: '許可済み',
      scannerEngine: 'スキャンエンジン', scannerEngineSub: 'ネイティブ解析 + SHA-256 重複確認', scanningState: '診断中',
      checkup: 'CHECKUP', scanning: 'アクセス可能なファイルを診断中', complete: '診断完了', cancelled: '診断をキャンセルしました', error: '診断を完了できませんでした',
      progressTruth: 'ファイル探索は総数不明のため割合表示を行わず、重複確認では実際に読み取ったバイト数を表示します。', filesReviewed: '確認済みファイル', largeFiles: '大きなファイル', olderFiles: '古いファイル', duplicateCopies: '完全一致の重複コピー',
      duplicateSpace: '確認後に削減できる可能性がある、検証済み重複容量', cancelScan: '診断をキャンセル', privacyTitle: 'ローカル設計',
      privacyBody: 'アクセス可能な共有ストレージのメタデータを読み取り、重複候補を端末内でハッシュ確認します。アップロードや削除は行いません。',
      prepareAccess: '端末アクセスを準備', prepareAccessSub: 'Android のシステム権限画面を開きます', startCheckup: 'ワンタップ診断を開始', startCheckupSub: 'アクセス可能な共有ストレージを今すぐ診断', scanningButton: '診断中…', scanningButtonSub: 'この端末内で Bearagnostic が処理しています', runAgain: 'もう一度診断', runAgainSub: 'ファイル診断結果を更新します',
      scopeNote: '対象: ユーザーがアクセス可能な共有ストレージのみ。Android が保護するアプリ専用領域は対象外です。',
      phasePreparing: '準備中', phaseFiles: 'ファイル', phaseDuplicates: '重複確認', phaseFinalizing: '最終処理', phaseComplete: '完了', phaseCancelled: 'キャンセル', phaseError: 'エラー'
    },
    th: {
      kicker: 'ONE-TAP NATIVE CHECKUP', headline: 'แตะครั้งเดียว<br><em>ตรวจไฟล์จริงในเครื่อง</em>', intro: 'เมื่ออนุญาตสิทธิ์แล้ว Bearagnostic สามารถตรวจพื้นที่ไฟล์ส่วนกลางที่ผู้ใช้เข้าถึงได้บน Android โดยตรง',
      systemStatus: 'SYSTEM STATUS', nativeReady: 'Native checkup พร้อมแล้ว', nativeBridge: 'Native bridge', nativeBridgeSub: 'เชื่อม UI ในเครื่อง ↔ Android', ready: 'พร้อม',
      storageAccess: 'สิทธิ์เข้าถึงไฟล์', storageAccessSub: 'สิทธิ์สำหรับไฟล์ส่วนกลางที่ผู้ใช้เข้าถึงได้', notGranted: 'ยังไม่อนุญาต', granted: 'อนุญาตแล้ว',
      scannerEngine: 'Scanner engine', scannerEngineSub: 'วิเคราะห์ Native + ยืนยันไฟล์ซ้ำด้วย SHA-256', scanningState: 'กำลังตรวจ',
      checkup: 'CHECKUP', scanning: 'กำลังตรวจไฟล์ที่เข้าถึงได้', complete: 'ตรวจเสร็จแล้ว', cancelled: 'ยกเลิกการตรวจแล้ว', error: 'ตรวจไม่สำเร็จ',
      progressTruth: 'ช่วงค้นหาไฟล์ไม่แสดงเปอร์เซ็นต์ปลอม ส่วนการยืนยันไฟล์ซ้ำใช้จำนวนไบต์ที่อ่านจริง', filesReviewed: 'ไฟล์ที่ตรวจแล้ว', largeFiles: 'ไฟล์ขนาดใหญ่', olderFiles: 'ไฟล์เก่า', duplicateCopies: 'สำเนาซ้ำที่ตรงกันจริง',
      duplicateSpace: 'พื้นที่ไฟล์ซ้ำที่ยืนยันแล้วและอาจเรียกคืนได้หลังตรวจทาน', cancelScan: 'ยกเลิกการตรวจ', privacyTitle: 'ทำงานในเครื่องเป็นหลัก',
      privacyBody: 'Scanner อ่าน metadata ของ shared storage ที่เข้าถึงได้ และ hash เฉพาะไฟล์ที่เป็นผู้ต้องสงสัยว่าซ้ำภายในเครื่อง ไม่มีการอัปโหลดหรือลบไฟล์',
      prepareAccess: 'เตรียมสิทธิ์เข้าถึงไฟล์', prepareAccessSub: 'Android จะเปิดหน้าสิทธิ์ของระบบให้อนุญาต', startCheckup: 'เริ่ม One-Tap Checkup', startCheckupSub: 'ตรวจ shared storage ที่เข้าถึงได้ทันที', scanningButton: 'กำลังตรวจ…', scanningButtonSub: 'Bearagnostic กำลังทำงานภายในเครื่องนี้', runAgain: 'ตรวจอีกครั้ง', runAgainSub: 'อัปเดตผลสุขภาพไฟล์ล่าสุด',
      scopeNote: 'ขอบเขต: shared storage ที่ผู้ใช้เข้าถึงได้เท่านั้น พื้นที่ส่วนตัวของแอพที่ Android ป้องกันยังอยู่นอกขอบเขต',
      phasePreparing: 'เตรียมระบบ', phaseFiles: 'ตรวจไฟล์', phaseDuplicates: 'ตรวจไฟล์ซ้ำ', phaseFinalizing: 'สรุปผล', phaseComplete: 'เสร็จแล้ว', phaseCancelled: 'ยกเลิก', phaseError: 'ผิดพลาด'
    }
  };

  const lang = (() => {
    const raw = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
    if (raw.startsWith('th')) return 'th';
    if (raw.startsWith('ja')) return 'ja';
    return 'en';
  })();
  document.documentElement.lang = lang;

  const t = (key) => COPY[lang][key] ?? COPY.en[key] ?? key;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });

  const storageState = document.getElementById('storageState');
  const scannerState = document.getElementById('scannerState');
  const primaryButton = document.getElementById('primaryButton');
  const primaryTitle = document.getElementById('primaryTitle');
  const primarySub = document.getElementById('primarySub');
  const buildLabel = document.getElementById('buildLabel');
  const scanCard = document.getElementById('scanCard');
  const scanTitle = document.getElementById('scanTitle');
  const scanPhase = document.getElementById('scanPhase');
  const progressTrack = document.getElementById('progressTrack');
  const progressFill = document.getElementById('progressFill');
  const reviewedFiles = document.getElementById('reviewedFiles');
  const largeFiles = document.getElementById('largeFiles');
  const olderFiles = document.getElementById('olderFiles');
  const duplicateCopies = document.getElementById('duplicateCopies');
  const resultLine = document.getElementById('resultLine');
  const reclaimable = document.getElementById('reclaimable');
  const cancelButton = document.getElementById('cancelButton');

  let nativeState = { broadStorageAccess: false, scannerReady: false, scannerRunning: false };
  let lastResult = null;

  function formatNumber(value) {
    return new Intl.NumberFormat(lang === 'th' ? 'th-TH' : lang === 'ja' ? 'ja-JP' : 'en-US').format(Number(value || 0));
  }

  function formatBytes(value) {
    let bytes = Number(value || 0);
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unit = 0;
    while (bytes >= 1024 && unit < units.length - 1) { bytes /= 1024; unit += 1; }
    const digits = unit >= 3 ? 2 : unit >= 2 ? 1 : 0;
    return `${bytes.toFixed(digits)} ${units[unit]}`;
  }

  function setPrimaryMode() {
    const granted = Boolean(nativeState.broadStorageAccess);
    const running = Boolean(nativeState.scannerRunning);
    primaryButton.disabled = running;
    primaryButton.classList.toggle('is-ready', granted && !running);
    primaryButton.classList.toggle('is-busy', running);

    if (running) {
      primaryTitle.textContent = t('scanningButton');
      primarySub.textContent = t('scanningButtonSub');
    } else if (!granted) {
      primaryTitle.textContent = t('prepareAccess');
      primarySub.textContent = t('prepareAccessSub');
    } else if (lastResult) {
      primaryTitle.textContent = t('runAgain');
      primarySub.textContent = t('runAgainSub');
    } else {
      primaryTitle.textContent = t('startCheckup');
      primarySub.textContent = t('startCheckupSub');
    }
  }

  function setState(state) {
    nativeState = { ...nativeState, ...(state || {}) };
    const granted = Boolean(nativeState.broadStorageAccess);
    const running = Boolean(nativeState.scannerRunning);

    storageState.textContent = granted ? t('granted') : t('notGranted');
    storageState.classList.toggle('good', granted);
    scannerState.textContent = running ? t('scanningState') : t('ready');
    scannerState.classList.toggle('busy', running);

    if (nativeState.versionName) {
      buildLabel.textContent = `Bearagnostic for Android · ${nativeState.versionName} · Bridge ${nativeState.bridgeVersion ?? 2}`;
    }
    setPrimaryMode();
  }

  function phaseLabel(phase) {
    const key = {
      preparing: 'phasePreparing', files: 'phaseFiles', duplicates: 'phaseDuplicates', finalizing: 'phaseFinalizing',
      complete: 'phaseComplete', cancelled: 'phaseCancelled', error: 'phaseError'
    }[phase];
    return key ? t(key) : String(phase || '').toUpperCase();
  }

  function showScan(payload) {
    scanCard.hidden = false;
    reviewedFiles.textContent = formatNumber(payload.reviewedFiles);
    largeFiles.textContent = formatNumber(payload.largeFiles);
    olderFiles.textContent = formatNumber(payload.olderFiles);
    scanPhase.textContent = phaseLabel(payload.phase || payload.state);
  }

  function renderProgress(payload) {
    nativeState.scannerRunning = true;
    scanTitle.textContent = t('scanning');
    resultLine.hidden = true;
    cancelButton.hidden = false;
    duplicateCopies.textContent = '—';
    showScan(payload);

    const hashing = payload.phase === 'duplicates' && Number(payload.duplicateCandidateBytes) > 0;
    progressTrack.classList.toggle('is-indeterminate', !hashing);
    if (hashing) {
      const total = Number(payload.duplicateCandidateBytes || 0);
      const done = Math.min(total, Number(payload.hashedBytes || 0));
      const pct = total > 0 ? Math.max(0, Math.min(100, (done / total) * 100)) : 0;
      progressFill.style.width = `${pct}%`;
    } else {
      progressFill.style.width = '34%';
    }
    setPrimaryMode();
  }

  function renderComplete(payload) {
    nativeState.scannerRunning = false;
    lastResult = payload;
    scanTitle.textContent = t('complete');
    showScan({ ...payload, phase: 'complete' });
    duplicateCopies.textContent = formatNumber(payload.duplicateCopies);
    reclaimable.textContent = formatBytes(payload.duplicateReclaimableBytes);
    resultLine.hidden = false;
    cancelButton.hidden = true;
    progressTrack.classList.remove('is-indeterminate');
    progressFill.style.width = '100%';
    setPrimaryMode();
  }

  function renderTerminal(titleKey, phase) {
    nativeState.scannerRunning = false;
    scanCard.hidden = false;
    scanTitle.textContent = t(titleKey);
    scanPhase.textContent = phaseLabel(phase);
    cancelButton.hidden = true;
    progressTrack.classList.remove('is-indeterminate');
    progressFill.style.width = '0%';
    setPrimaryMode();
  }

  function parseNativeResult(raw) {
    if (!raw) return null;
    if (typeof raw === 'object') return raw;
    try { return JSON.parse(raw); } catch (_) { return null; }
  }

  function readNativeState() {
    try {
      const raw = window.BearagnosticNative?.getNativeState?.();
      const state = parseNativeResult(raw);
      if (state) setState(state);
    } catch (_) {
      setState({ broadStorageAccess: false, scannerReady: false });
    }
  }

  window.BearagnosticAndroid = Object.freeze({
    onNativeStateChanged(state) {
      const parsed = parseNativeResult(state);
      if (parsed) setState(parsed);
    },
    onScanProgress(payload) {
      const parsed = parseNativeResult(payload);
      if (parsed) renderProgress(parsed);
    },
    onScanComplete(payload) {
      const parsed = parseNativeResult(payload);
      if (parsed) renderComplete(parsed);
    },
    onScanCancelled() {
      renderTerminal('cancelled', 'cancelled');
    },
    onScanError() {
      renderTerminal('error', 'error');
    }
  });

  primaryButton.addEventListener('click', () => {
    try {
      if (!nativeState.broadStorageAccess) {
        window.BearagnosticNative?.requestBroadStorageAccess?.();
        return;
      }
      const response = parseNativeResult(window.BearagnosticNative?.startOneTapScan?.());
      if (response?.accepted) {
        nativeState.scannerRunning = true;
        renderProgress({ state: 'running', phase: 'preparing', reviewedFiles: 0, largeFiles: 0, olderFiles: 0 });
      } else if (response?.reason === 'storage_access_required') {
        nativeState.broadStorageAccess = false;
        setPrimaryMode();
      }
    } catch (_) {}
  });

  cancelButton.addEventListener('click', () => {
    try { window.BearagnosticNative?.cancelOneTapScan?.(); } catch (_) {}
    cancelButton.disabled = true;
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) readNativeState();
  });

  readNativeState();
})();
