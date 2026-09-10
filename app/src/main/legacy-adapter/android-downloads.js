(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  const HIDDEN = window.BearagnosticHiddenItems;
  if (!NATIVE) return;

  const BUILD = 35;
  const CATEGORY = 'downloads';
  const REVIEW_PAGE_SIZE = 250;
  const RENDER_BATCH = 80;
  const MAX_DELETE_SELECTION = 500;
  const STALE_REVIEW_MS = 15 * 60 * 1000;
  const POLL_MS = 350;

  const byId = (id) => document.getElementById(id);
  const parse = (value, fallback = {}) => {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  };
  const n = (value) => Math.max(0, Number(value) || 0);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const language = () => {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
  };

  const COPY = {
    en: {
      toolTitle: 'Downloads',
      toolSub: 'Review downloaded files',
      kicker: 'DOWNLOADS REVIEW',
      title: 'See what has collected in Downloads.',
      lead: 'Downloads is a location, not a junk verdict. Review each file before deciding what to remove.',
      close: 'Close',
      source: 'SOURCE',
      coverage: 'COVERAGE',
      safety: 'SAFETY',
      sourceSnapshot: 'Current checkup',
      fullCoverage: 'Accessible Downloads',
      customCoverage: 'Selected Custom scope',
      reviewFirst: 'Review first',
      accessTitle: 'Storage access is needed',
      accessBody: 'Android must allow shared-storage access before Bearagnostic can review files in Downloads.',
      openSettings: 'Open Android settings',
      noSnapshotTitle: 'Check Downloads first',
      noSnapshotBody: 'Run a Quick Scan to build a current local review snapshot. Quick reads file metadata only and does not delete anything.',
      runQuick: 'Run Quick Scan',
      scanningTitle: 'Checking Downloads',
      scanningBody: 'Bearagnostic is using the scanner’s real filesystem work. No waiting time or fake progress is added.',
      scanningHint: 'Results will appear when the current checkup finishes.',
      files: 'Files',
      totalSize: 'Total size',
      largest: 'Largest',
      checked: 'Checked',
      justNow: 'just now',
      minAgo: 'min ago',
      cautionTitle: 'A downloaded file can still be important',
      cautionBody: 'Documents, photos, videos, installers and archives can all belong here. Nothing in Downloads is selected automatically.',
      partialTitle: 'Review list is partial',
      partialBody: 'The current safety snapshot reached its review-detail limit. Only the files represented in this snapshot can be selected.',
      customTitle: 'Custom scope',
      customBody: 'This snapshot came from selected Custom Scan locations. Files outside those selected locations are not represented.',
      checkAll: 'Check all accessible storage',
      filterAll: 'All',
      filterPhotos: 'Photos',
      filterVideos: 'Videos',
      filterDocs: 'Documents',
      filterPackages: 'APK & archives',
      filterAudio: 'Audio',
      filterOther: 'Other',
      sortLargest: 'Largest first',
      sortNewest: 'Newest first',
      sortOldest: 'Oldest first',
      sortName: 'Name A–Z',
      selectionTitle: 'Choose only files you recognize and no longer need',
      showing: 'Showing {shown} of {total}',
      selected: '{count} selected · {bytes}',
      clear: 'Clear',
      reviewSelected: 'Review selected',
      noFilesTitle: 'No Downloads files surfaced in this snapshot',
      noFilesBody: 'No downloadable-file identities are available in this current review snapshot. Nothing was removed.',
      noFilter: 'No files match this filter.',
      showMore: 'Show more files',
      dateUnknown: 'Date unavailable',
      hiddenOff: 'Hidden-item privacy is on. Hidden identities stay out of this list.',
      staleTitle: 'Refresh before deleting',
      staleBody: 'This review snapshot is more than 15 minutes old. Run a fresh Quick Scan before permanent deletion.',
      refresh: 'Refresh',
      limit: 'Up to 500 files can be removed in one verified batch.',
      limitReached: 'The 500-file safety limit has been reached.',
      finalKicker: 'FINAL REVIEW',
      finalTitle: 'Remove the selected downloaded files?',
      finalBody: 'This permanently removes only the files you selected. Being in Downloads does not mean a file is safe to delete.',
      selectedFiles: 'files selected',
      selectedBytes: 'selected size',
      protection: 'Native safety checks remain active, including keep-one protection when a selected file also belongs to a verified duplicate group.',
      back: 'Back',
      deleteVerify: 'Delete & verify',
      deleting: 'Deleting and verifying…',
      resultKicker: 'VERIFIED CLEANUP',
      resultTitle: 'Downloads cleanup complete',
      reclaimed: 'verified space reclaimed',
      removed: 'files removed',
      protected: 'kept by safety',
      failed: 'not removed',
      resultBody: 'Only files Android confirmed as gone are counted as removed or reclaimed.',
      reviewRemaining: 'Review remaining',
      done: 'Done',
      errorTitle: 'Downloads Review could not continue',
      retry: 'Try again',
      scanFailed: 'The Quick Scan could not start.',
      anotherScan: 'Another checkup is already running. Downloads Review will refresh when it finishes.',
      kindImage: 'Photo',
      kindVideo: 'Video',
      kindAudio: 'Audio',
      kindDocument: 'Document',
      kindApk: 'APK',
      kindArchive: 'Archive',
      kindOther: 'File'
    },
    th: {
      toolTitle: 'ดาวน์โหลด',
      toolSub: 'ตรวจไฟล์ที่ดาวน์โหลดไว้',
      kicker: 'ตรวจไฟล์ดาวน์โหลด',
      title: 'ดูให้ชัดว่าใน Downloads มีอะไรสะสมอยู่',
      lead: 'Downloads เป็นเพียงตำแหน่งเก็บไฟล์ ไม่ได้แปลว่าเป็นขยะ ควรตรวจแต่ละไฟล์ก่อนตัดสินใจลบ',
      close: 'ปิด',
      source: 'แหล่งข้อมูล',
      coverage: 'ขอบเขต',
      safety: 'ความปลอดภัย',
      sourceSnapshot: 'ผลตรวจปัจจุบัน',
      fullCoverage: 'Downloads ที่เข้าถึงได้',
      customCoverage: 'ขอบเขต Custom ที่เลือก',
      reviewFirst: 'ตรวจดูก่อน',
      accessTitle: 'ต้องอนุญาตการเข้าถึงพื้นที่จัดเก็บ',
      accessBody: 'Android ต้องอนุญาต shared storage ก่อนที่ Bearagnostic จะตรวจไฟล์ใน Downloads ได้',
      openSettings: 'เปิดการตั้งค่า Android',
      noSnapshotTitle: 'ตรวจ Downloads ก่อน',
      noSnapshotBody: 'เริ่ม Quick Scan เพื่อสร้างรายการตรวจปัจจุบันภายในเครื่อง Quick จะอ่านเฉพาะข้อมูลไฟล์และไม่ลบอะไร',
      runQuick: 'เริ่ม Quick Scan',
      scanningTitle: 'กำลังตรวจ Downloads',
      scanningBody: 'Bearagnostic แสดงตามงานจริงของระบบไฟล์ ไม่มีการหน่วงเวลาหรือสร้างความคืบหน้าปลอม',
      scanningHint: 'รายการจะปรากฏเมื่อการตรวจปัจจุบันเสร็จสิ้น',
      files: 'ไฟล์',
      totalSize: 'ขนาดรวม',
      largest: 'ใหญ่ที่สุด',
      checked: 'ตรวจเมื่อ',
      justNow: 'เมื่อสักครู่',
      minAgo: 'นาทีที่แล้ว',
      cautionTitle: 'ไฟล์ที่ดาวน์โหลดมาอาจยังสำคัญ',
      cautionBody: 'เอกสาร รูปภาพ วิดีโอ ไฟล์ติดตั้ง และไฟล์บีบอัดล้วนอยู่ที่นี่ได้ Bearagnostic จะไม่เลือกไฟล์ใน Downloads ให้ลบอัตโนมัติ',
      partialTitle: 'รายการตรวจแสดงได้ไม่ครบทั้งหมด',
      partialBody: 'snapshot ปัจจุบันถึงขีดจำกัดรายละเอียดเพื่อความปลอดภัย เลือกได้เฉพาะไฟล์ที่อยู่ใน snapshot นี้เท่านั้น',
      customTitle: 'ขอบเขต Custom',
      customBody: 'snapshot นี้มาจากตำแหน่ง Custom Scan ที่เลือก จึงไม่รวมไฟล์นอกตำแหน่งที่เลือกไว้',
      checkAll: 'ตรวจทั่วพื้นที่ที่เข้าถึงได้',
      filterAll: 'ทั้งหมด',
      filterPhotos: 'รูปภาพ',
      filterVideos: 'วิดีโอ',
      filterDocs: 'เอกสาร',
      filterPackages: 'APK และไฟล์บีบอัด',
      filterAudio: 'เสียง',
      filterOther: 'อื่นๆ',
      sortLargest: 'ใหญ่สุดก่อน',
      sortNewest: 'ใหม่สุดก่อน',
      sortOldest: 'เก่าสุดก่อน',
      sortName: 'ชื่อ A–Z',
      selectionTitle: 'เลือกเฉพาะไฟล์ที่รู้จักและไม่ต้องการแล้ว',
      showing: 'แสดง {shown} จาก {total}',
      selected: 'เลือก {count} ไฟล์ · {bytes}',
      clear: 'ล้างที่เลือก',
      reviewSelected: 'ตรวจรายการที่เลือก',
      noFilesTitle: 'ไม่พบรายการ Downloads ใน snapshot นี้',
      noFilesBody: 'ไม่พบตัวตนไฟล์ดาวน์โหลดใน snapshot ปัจจุบัน และไม่มีการลบอะไร',
      noFilter: 'ไม่มีไฟล์ในตัวกรองนี้',
      showMore: 'แสดงไฟล์เพิ่ม',
      dateUnknown: 'ไม่มีข้อมูลวันที่',
      hiddenOff: 'การปกป้องรายการที่ซ่อนอยู่เปิดใช้งานอยู่ ตัวตนไฟล์ที่ซ่อนจะไม่ปรากฏในรายการนี้',
      staleTitle: 'ตรวจใหม่ก่อนลบ',
      staleBody: 'snapshot นี้เก่ากว่า 15 นาที กรุณาเริ่ม Quick Scan ใหม่ก่อนลบถาวร',
      refresh: 'ตรวจใหม่',
      limit: 'ลบได้สูงสุด 500 ไฟล์ต่อหนึ่ง batch ที่มีการตรวจยืนยัน',
      limitReached: 'เลือกครบขีดจำกัดความปลอดภัย 500 ไฟล์แล้ว',
      finalKicker: 'ตรวจครั้งสุดท้าย',
      finalTitle: 'ลบไฟล์ดาวน์โหลดที่เลือกหรือไม่',
      finalBody: 'ระบบจะลบถาวรเฉพาะไฟล์ที่เลือกไว้ การอยู่ใน Downloads ไม่ได้แปลว่าไฟล์นั้นปลอดภัยที่จะลบ',
      selectedFiles: 'ไฟล์ที่เลือก',
      selectedBytes: 'ขนาดที่เลือก',
      protection: 'ระบบความปลอดภัย Native ยังทำงานอยู่ รวมถึงการเก็บอย่างน้อยหนึ่งไฟล์ไว้เมื่อรายการที่เลือกเป็นสมาชิกของกลุ่มไฟล์ซ้ำที่ยืนยันแล้ว',
      back: 'ย้อนกลับ',
      deleteVerify: 'ลบและตรวจยืนยัน',
      deleting: 'กำลังลบและตรวจยืนยัน…',
      resultKicker: 'ยืนยันผลแล้ว',
      resultTitle: 'จัดการ Downloads เสร็จแล้ว',
      reclaimed: 'พื้นที่ที่คืนได้จริง',
      removed: 'ไฟล์ที่ลบแล้ว',
      protected: 'ไฟล์ที่ระบบป้องกันไว้',
      failed: 'ไฟล์ที่ลบไม่สำเร็จ',
      resultBody: 'นับเฉพาะไฟล์ที่ Android ยืนยันว่าหายไปแล้วเท่านั้น ทั้งจำนวนไฟล์และพื้นที่ที่คืนได้',
      reviewRemaining: 'ตรวจไฟล์ที่เหลือ',
      done: 'เสร็จสิ้น',
      errorTitle: 'ไม่สามารถดำเนินการตรวจ Downloads ต่อได้',
      retry: 'ลองอีกครั้ง',
      scanFailed: 'ไม่สามารถเริ่ม Quick Scan ได้',
      anotherScan: 'มีการตรวจอื่นกำลังทำงานอยู่ Downloads Review จะอัปเดตเมื่อการตรวจนั้นเสร็จ',
      kindImage: 'รูปภาพ',
      kindVideo: 'วิดีโอ',
      kindAudio: 'เสียง',
      kindDocument: 'เอกสาร',
      kindApk: 'APK',
      kindArchive: 'ไฟล์บีบอัด',
      kindOther: 'ไฟล์'
    },
    ja: {
      toolTitle: 'ダウンロード',
      toolSub: 'ダウンロード済みファイルを確認',
      kicker: 'DOWNLOADS REVIEW',
      title: 'Downloads にたまったファイルを確認。',
      lead: 'Downloads は保存場所であり、不要ファイルという意味ではありません。削除前に各ファイルを確認してください。',
      close: '閉じる',
      source: 'ソース',
      coverage: '範囲',
      safety: '安全性',
      sourceSnapshot: '現在のチェック',
      fullCoverage: 'アクセス可能な Downloads',
      customCoverage: '選択した Custom 範囲',
      reviewFirst: '要確認',
      accessTitle: 'ストレージへのアクセスが必要です',
      accessBody: 'Downloads を確認するには、Android で共有ストレージへのアクセスを許可してください。',
      openSettings: 'Android 設定を開く',
      noSnapshotTitle: 'まず Downloads を確認',
      noSnapshotBody: 'Quick Scan で現在のローカルレビューを作成します。ファイル情報のみを読み取り、削除は行いません。',
      runQuick: 'Quick Scan を開始',
      scanningTitle: 'Downloads を確認中',
      scanningBody: '実際のファイルシステム処理に従って進みます。見せるための待ち時間や偽の進捗は追加しません。',
      scanningHint: '現在のチェックが完了すると結果が表示されます。',
      files: 'ファイル',
      totalSize: '合計サイズ',
      largest: '最大',
      checked: '確認',
      justNow: 'たった今',
      minAgo: '分前',
      cautionTitle: 'ダウンロード済みでも重要なファイルがあります',
      cautionBody: '書類、写真、動画、インストーラー、アーカイブなどが含まれます。Downloads のファイルを自動選択することはありません。',
      partialTitle: 'レビュー一覧は一部のみです',
      partialBody: '安全上の詳細表示上限に達しました。現在の snapshot に含まれるファイルだけを選択できます。',
      customTitle: 'Custom 範囲',
      customBody: 'この snapshot は選択した Custom Scan の場所から作成されています。選択外の場所は含まれません。',
      checkAll: 'アクセス可能な全領域を確認',
      filterAll: 'すべて',
      filterPhotos: '写真',
      filterVideos: '動画',
      filterDocs: '書類',
      filterPackages: 'APK・アーカイブ',
      filterAudio: '音声',
      filterOther: 'その他',
      sortLargest: 'サイズが大きい順',
      sortNewest: '新しい順',
      sortOldest: '古い順',
      sortName: '名前 A–Z',
      selectionTitle: '内容が分かり、不要と判断したファイルだけを選択',
      showing: '{total} 件中 {shown} 件を表示',
      selected: '{count} 件選択 · {bytes}',
      clear: '選択解除',
      reviewSelected: '選択内容を確認',
      noFilesTitle: 'この snapshot に Downloads のファイルはありません',
      noFilesBody: '現在のレビュー snapshot にダウンロード済みファイルの詳細はありません。削除は行われていません。',
      noFilter: 'このフィルターに一致するファイルはありません。',
      showMore: 'さらに表示',
      dateUnknown: '日付情報なし',
      hiddenOff: '非表示項目の保護が有効です。非表示ファイルの詳細は一覧に表示されません。',
      staleTitle: '削除前に再確認',
      staleBody: 'このレビュー snapshot は15分以上前のものです。完全削除の前に Quick Scan を更新してください。',
      refresh: '更新',
      limit: '1回の検証済み削除は最大500ファイルです。',
      limitReached: '安全上限の500ファイルに達しました。',
      finalKicker: '最終確認',
      finalTitle: '選択したダウンロード済みファイルを削除しますか？',
      finalBody: '選択したファイルだけを完全に削除します。Downloads にあること自体は安全な削除理由ではありません。',
      selectedFiles: '選択ファイル',
      selectedBytes: '選択サイズ',
      protection: '検証済み重複グループに属する場合の「1つは残す」保護を含め、Native の安全確認は引き続き有効です。',
      back: '戻る',
      deleteVerify: '削除して確認',
      deleting: '削除して確認中…',
      resultKicker: '検証済みクリーンアップ',
      resultTitle: 'Downloads の整理が完了しました',
      reclaimed: '確認済み空き容量',
      removed: '削除済み',
      protected: '安全保護',
      failed: '未削除',
      resultBody: 'Android が実際に消えたと確認したファイルだけを、削除件数と回収容量に数えます。',
      reviewRemaining: '残りを確認',
      done: '完了',
      errorTitle: 'Downloads Review を続行できません',
      retry: '再試行',
      scanFailed: 'Quick Scan を開始できませんでした。',
      anotherScan: '別のチェックが実行中です。完了後に Downloads Review を更新します。',
      kindImage: '写真',
      kindVideo: '動画',
      kindAudio: '音声',
      kindDocument: '書類',
      kindApk: 'APK',
      kindArchive: 'アーカイブ',
      kindOther: 'ファイル'
    }
  };
  const c = () => COPY[language()] || COPY.en;

  const ICONS = Object.freeze({
    downloads: '<path d="M12 3v11"/><path d="m8 10 4 4 4-4"/><path d="M5 18h14v3H5z"/>',
    shield: '<path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6Z"/><path d="m9 12 2 2 4-4"/>',
    image: '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.3"/><path d="m6 17 4-4 3 3 2-2 3 3"/>',
    video: '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    audio: '<path d="M9 18V7l9-2v11"/><circle cx="6.5" cy="18" r="2.3"/><circle cx="15.5" cy="16" r="2.3"/>',
    document: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M10 12h5M10 15h5"/>',
    apk: '<path d="M7 8h10v10H7zM9 5l-1.2-2M15 5l1.2-2M9.5 12h.01M14.5 12h.01"/>',
    archive: '<path d="M5 7h14v12H5zM4 4h16v3H4zM10 11h4"/>',
    other: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/>',
    warning: '<path d="M12 4 21 20H3Z"/><path d="M12 9v5M12 17h.01"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>'
  });
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.other}</svg>`;

  const state = {
    open: false,
    loading: false,
    scannerRunning: false,
    view: 'results',
    summary: null,
    native: null,
    items: [],
    selected: new Set(),
    filter: 'all',
    sort: 'newest',
    renderLimit: RENDER_BATCH,
    message: '',
    error: '',
    result: null,
    pollTimer: null,
    loadToken: 0
  };

  function formatBytes(value) {
    const bytes = n(value);
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let size = bytes / 1024;
    let index = 0;
    while (size >= 1024 && index < units.length - 1) { size /= 1024; index++; }
    const digits = size >= 100 ? 0 : size >= 10 ? 1 : 2;
    return `${size.toFixed(digits)} ${units[index]}`;
  }

  function ageLabel(ms) {
    const value = n(ms);
    if (!value) return c().dateUnknown;
    try {
      return new Intl.DateTimeFormat(language() === 'th' ? 'th-TH' : language() === 'ja' ? 'ja-JP' : 'en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      }).format(new Date(value));
    } catch (_) {
      return new Date(value).toLocaleDateString();
    }
  }

  function checkedLabel(ms) {
    const value = n(ms);
    if (!value) return '—';
    const minutes = Math.max(0, Math.floor((Date.now() - value) / 60000));
    return minutes < 1 ? c().justNow : `${minutes} ${c().minAgo}`;
  }

  function kindFor(item) {
    const direct = String(item?.fileKind || '').toLowerCase();
    if (['image', 'video', 'audio', 'document', 'apk', 'archive'].includes(direct)) return direct;
    const ext = String(item?.extension || '').toLowerCase();
    if (['jpg','jpeg','png','webp','gif','bmp','heic','heif','avif','dng'].includes(ext)) return 'image';
    if (['mp4','mkv','mov','avi','webm','m4v','3gp','ts','mts','m2ts'].includes(ext)) return 'video';
    if (['mp3','m4a','aac','wav','flac','ogg','opus','wma','amr'].includes(ext)) return 'audio';
    if (ext === 'apk') return 'apk';
    if (['zip','rar','7z','tar','gz','tgz','bz2','xz'].includes(ext)) return 'archive';
    if (['pdf','txt','rtf','md','doc','docx','xls','xlsx','ppt','pptx','csv','json','xml','epub','odt','ods','odp'].includes(ext)) return 'document';
    return 'other';
  }

  function kindLabel(kind) {
    const key = {
      image: 'kindImage', video: 'kindVideo', audio: 'kindAudio',
      document: 'kindDocument', apk: 'kindApk', archive: 'kindArchive', other: 'kindOther'
    }[kind] || 'kindOther';
    return c()[key];
  }

  function isFresh(summary = state.summary) {
    const generated = n(summary?.generatedAtMs);
    if (!generated || generated > Date.now()) return false;
    return Date.now() - generated <= STALE_REVIEW_MS;
  }

  function visibleItems() {
    const base = HIDDEN?.filter ? HIDDEN.filter(state.items) : state.items.slice();
    const filtered = base.filter((item) => {
      const kind = kindFor(item);
      switch (state.filter) {
        case 'photos': return kind === 'image';
        case 'videos': return kind === 'video';
        case 'audio': return kind === 'audio';
        case 'docs': return kind === 'document';
        case 'packages': return kind === 'apk' || kind === 'archive';
        case 'other': return kind === 'other';
        default: return true;
      }
    });
    return filtered.sort((a, b) => {
      if (state.sort === 'largest') return n(b.sizeBytes) - n(a.sizeBytes);
      if (state.sort === 'oldest') {
        const av = n(a.modifiedMs) || Number.MAX_SAFE_INTEGER;
        const bv = n(b.modifiedMs) || Number.MAX_SAFE_INTEGER;
        return av - bv || n(b.sizeBytes) - n(a.sizeBytes);
      }
      if (state.sort === 'name') return String(a.name || '').localeCompare(String(b.name || ''), language());
      return n(b.modifiedMs) - n(a.modifiedMs) || n(b.sizeBytes) - n(a.sizeBytes);
    });
  }

  function selectedItems() {
    const allowed = new Set((HIDDEN?.filter ? HIDDEN.filter(state.items) : state.items).map((item) => item.id));
    return state.items.filter((item) => state.selected.has(item.id) && allowed.has(item.id));
  }

  function syncSelectionPrivacy() {
    if (!HIDDEN?.filter) return;
    const visible = new Set(HIDDEN.filter(state.items).map((item) => item.id));
    for (const id of [...state.selected]) if (!visible.has(id)) state.selected.delete(id);
  }

  function ensureStyle() {
    if (byId('androidDownloadsStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidDownloadsStyle';
    style.textContent = `
      body.ba-downloads-open{overflow:hidden!important}
      .ba-downloads-entry{--tone:43,151,203!important}
      .ba-downloads-entry .mini-icon{background:linear-gradient(145deg,#eef8ff,#e6f4fc)!important;color:#248cc7!important;border:1px solid rgba(48,145,199,.10);box-shadow:inset 0 1px rgba(255,255,255,.96)}
      .ba-downloads-entry .mini-icon svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
      .ba-downloads-surface{position:fixed;z-index:120;inset:0;background:linear-gradient(180deg,#f8fbfd 0%,#f4f8fb 100%);color:#27394a;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);font-family:inherit}
      .ba-downloads-surface[hidden]{display:none!important}
      .ba-downloads-head{min-height:60px;padding:10px 15px;display:grid;grid-template-columns:42px minmax(0,1fr) 42px;align-items:center;gap:8px;background:rgba(250,253,255,.96);border-bottom:1px solid rgba(70,105,130,.08);backdrop-filter:blur(16px)}
      .ba-downloads-head__icon,.ba-downloads-close{width:40px;height:40px;border-radius:14px;border:1px solid rgba(63,104,134,.09);background:#fff;display:grid;place-items:center;color:#278cc5;box-shadow:0 5px 16px rgba(54,83,108,.07)}
      .ba-downloads-head__icon svg,.ba-downloads-close svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      .ba-downloads-close{color:#5f7486;font-size:24px;line-height:1}
      .ba-downloads-head__copy{min-width:0;text-align:center}.ba-downloads-head__copy strong{display:block;font-size:14px;line-height:1.25;color:#2c4052}.ba-downloads-head__copy small{display:block;margin-top:2px;font-size:10.5px;line-height:1.2;color:#7b8b99;letter-spacing:.035em}
      .ba-downloads-scroll{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:18px 15px 110px}
      .ba-downloads-wrap{max-width:720px;margin:0 auto}
      .ba-downloads-kicker{font-size:10px;font-weight:820;letter-spacing:.14em;color:#348dbd;text-transform:uppercase}
      .ba-downloads-title{margin:6px 0 7px;font-size:24px;line-height:1.16;letter-spacing:-.025em;color:#243a4c;font-weight:760}.ba-downloads-lead{margin:0;color:#677d90;font-size:12.5px;line-height:1.55}
      .ba-downloads-triad{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:15px 0 12px}.ba-downloads-chip{padding:9px 9px;border-radius:14px;background:#fff;border:1px solid rgba(70,113,145,.08);box-shadow:0 5px 16px rgba(57,90,116,.045)}.ba-downloads-chip small{display:block;font-size:8.5px;font-weight:820;letter-spacing:.10em;color:#8a9aa7}.ba-downloads-chip strong{display:block;margin-top:3px;font-size:10.8px;line-height:1.25;color:#445d70;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ba-downloads-notice{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;padding:11px 12px;margin:12px 0;border-radius:17px;background:linear-gradient(135deg,#fffaf0,#fffdf9);border:1px solid rgba(196,145,65,.12)}.ba-downloads-notice--info{background:linear-gradient(135deg,#f2f9fd,#f8fcfe);border-color:rgba(48,139,192,.10)}.ba-downloads-notice__icon{width:34px;height:34px;border-radius:12px;background:#fff7e6;color:#a87531;display:grid;place-items:center}.ba-downloads-notice--info .ba-downloads-notice__icon{background:#edf8fd;color:#2a8fc3}.ba-downloads-notice__icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ba-downloads-notice strong{display:block;font-size:11.8px;line-height:1.35;color:#4b5360}.ba-downloads-notice small{display:block;margin-top:3px;font-size:10.7px;line-height:1.48;color:#7a7f87}
      .ba-downloads-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:13px 0}.ba-downloads-stat{padding:10px 8px;border-radius:15px;background:#fff;border:1px solid rgba(66,107,137,.07);min-width:0}.ba-downloads-stat b{display:block;font-size:13px;line-height:1.25;color:#2c526b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-downloads-stat span{display:block;margin-top:3px;font-size:9px;line-height:1.25;color:#8796a3}
      .ba-downloads-controls{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;margin:14px 0 10px}.ba-downloads-select{height:40px;border-radius:13px;border:1px solid rgba(69,111,143,.10);background:#fff;color:#465f73;padding:0 32px 0 11px;font:inherit;font-size:11px;font-weight:680;min-width:0;outline:none}
      .ba-downloads-sectionhead{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin:13px 1px 8px}.ba-downloads-sectionhead strong{font-size:12.5px;color:#40586b;line-height:1.3}.ba-downloads-sectionhead small{font-size:10px;color:#8997a3;white-space:nowrap}
      .ba-downloads-list{display:grid;gap:7px}.ba-downloads-file{display:grid;grid-template-columns:24px 42px minmax(0,1fr) auto;gap:9px;align-items:center;min-height:68px;padding:9px 10px;border-radius:17px;background:#fff;border:1px solid rgba(70,111,142,.075);box-shadow:0 5px 18px rgba(52,86,111,.035);transition:border-color .15s ease,box-shadow .15s ease,transform .15s ease}.ba-downloads-file.is-selected{border-color:rgba(38,142,197,.24);box-shadow:0 7px 20px rgba(37,125,173,.09)}.ba-downloads-file input{width:19px;height:19px;margin:0;accent-color:#278fc7}.ba-downloads-file__icon{width:42px;height:42px;border-radius:13px;background:linear-gradient(145deg,#eff8fc,#e9f4f8);color:#348ebd;display:grid;place-items:center}.ba-downloads-file__icon svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ba-downloads-file[data-kind="image"] .ba-downloads-file__icon{color:#2f86de;background:linear-gradient(145deg,#edf7ff,#e7f2fd)}.ba-downloads-file[data-kind="video"] .ba-downloads-file__icon{color:#5a69c8;background:linear-gradient(145deg,#f1f2fd,#eceffd)}.ba-downloads-file[data-kind="audio"] .ba-downloads-file__icon{color:#9369b5;background:linear-gradient(145deg,#f7f0fb,#f1ecf8)}.ba-downloads-file[data-kind="apk"] .ba-downloads-file__icon{color:#2b987d;background:linear-gradient(145deg,#edf9f5,#e7f5f0)}.ba-downloads-file[data-kind="archive"] .ba-downloads-file__icon{color:#a37943;background:linear-gradient(145deg,#faf4ea,#f5eee3)}.ba-downloads-file__copy{min-width:0}.ba-downloads-file__type{display:inline-block;margin-bottom:3px;padding:2px 6px;border-radius:99px;background:#eef6fb;color:#377ea6;font-size:8.5px;line-height:1.25;font-weight:800;letter-spacing:.04em;text-transform:uppercase}.ba-downloads-file__copy strong{display:block;font-size:11.6px;line-height:1.32;color:#354b5c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-downloads-file__copy small{display:block;margin-top:3px;font-size:9.7px;line-height:1.3;color:#8795a1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-downloads-file__meta{text-align:right;min-width:68px}.ba-downloads-file__meta b{display:block;font-size:10.8px;color:#526a7c}.ba-downloads-file__meta small{display:block;margin-top:3px;font-size:9px;color:#939faa;white-space:nowrap}
      .ba-downloads-empty,.ba-downloads-state{padding:28px 18px;margin-top:16px;border-radius:22px;background:#fff;border:1px solid rgba(67,108,139,.07);text-align:center;box-shadow:0 10px 28px rgba(52,84,108,.045)}.ba-downloads-state__icon{width:54px;height:54px;margin:0 auto 12px;border-radius:18px;background:linear-gradient(145deg,#edf8fd,#e8f4fa);color:#2e91c6;display:grid;place-items:center}.ba-downloads-state__icon svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}.ba-downloads-state h3,.ba-downloads-empty h3{margin:0;font-size:17px;line-height:1.25;color:#30495c}.ba-downloads-state p,.ba-downloads-empty p{max-width:520px;margin:8px auto 0;font-size:11.5px;line-height:1.55;color:#778b9a}.ba-downloads-state__spinner{width:34px;height:34px;margin:0 auto 13px;border-radius:50%;border:3px solid #e5f0f6;border-top-color:#2c91c8;animation:baDownloadsSpin .8s linear infinite}
      .ba-downloads-primary,.ba-downloads-secondary{min-height:44px;border-radius:14px;padding:0 16px;font:inherit;font-size:11.5px;font-weight:760}.ba-downloads-primary{background:linear-gradient(135deg,#2aa3d9,#247fc5);color:#fff;box-shadow:0 8px 20px rgba(30,126,184,.18)}.ba-downloads-primary:disabled{opacity:.45;box-shadow:none}.ba-downloads-secondary{background:#fff;color:#557084;border:1px solid rgba(69,111,143,.12)}.ba-downloads-actions{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:15px}
      .ba-downloads-selection{position:fixed;z-index:122;left:0;right:0;bottom:0;padding:9px 14px calc(9px + env(safe-area-inset-bottom));background:rgba(249,252,254,.96);border-top:1px solid rgba(63,104,134,.09);backdrop-filter:blur(18px)}.ba-downloads-selection__inner{max-width:720px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center}.ba-downloads-selection__copy{min-width:0}.ba-downloads-selection__copy strong{display:block;font-size:11.7px;color:#40596c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-downloads-selection__copy small{display:block;margin-top:2px;font-size:9.3px;color:#8a98a4}
      .ba-downloads-confirm-list{display:grid;gap:6px;margin:13px 0}.ba-downloads-confirm-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;padding:9px 11px;border-radius:13px;background:#f8fbfd;border:1px solid rgba(68,108,139,.06)}.ba-downloads-confirm-item strong{font-size:10.8px;color:#455d70;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-downloads-confirm-item span{font-size:10px;color:#778a99;white-space:nowrap}
      .ba-downloads-result-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:16px 0}.ba-downloads-result-card{padding:12px 8px;border-radius:16px;background:#f7fbfd;border:1px solid rgba(65,111,143,.07)}.ba-downloads-result-card b{display:block;font-size:15px;color:#2c5f7c}.ba-downloads-result-card span{display:block;margin-top:3px;font-size:9.5px;line-height:1.3;color:#7f909e}
      .ba-downloads-inline{margin:9px 1px 0;font-size:10px;line-height:1.45;color:#8a785f}.ba-downloads-inline.is-error{color:#a55050}
      @keyframes baDownloadsSpin{to{transform:rotate(360deg)}}
      @media(max-width:390px){.ba-downloads-scroll{padding-left:12px;padding-right:12px}.ba-downloads-title{font-size:21px}.ba-downloads-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.ba-downloads-file{grid-template-columns:22px 38px minmax(0,1fr);gap:8px}.ba-downloads-file__icon{width:38px;height:38px}.ba-downloads-file__meta{grid-column:3;text-align:left;display:flex;gap:8px;align-items:center}.ba-downloads-file__meta small{margin-top:0}.ba-downloads-selection__inner{grid-template-columns:minmax(0,1fr) auto}.ba-downloads-selection .ba-downloads-secondary{display:none}}
      @media(prefers-reduced-motion:reduce){.ba-downloads-file{transition:none!important}.ba-downloads-state__spinner{animation:none!important}}
      html[data-motion="reduced"] .ba-downloads-file{transition:none!important}html[data-motion="reduced"] .ba-downloads-state__spinner{animation:none!important}
    `;
    document.head.appendChild(style);
  }

  function ensureEntry() {
    const list = document.querySelector('#toolsScreen .utility-list');
    if (!list) return null;
    let entry = list.querySelector('[data-tool="downloads"]');
    if (!entry) {
      entry = document.createElement('button');
      entry.type = 'button';
      entry.dataset.tool = 'downloads';
      entry.className = 'ba-downloads-entry';
      const older = list.querySelector('[data-tool="older"]');
      if (older?.nextSibling) list.insertBefore(entry, older.nextSibling);
      else list.appendChild(entry);
    }
    entry.classList.add('ba-downloads-entry');
    updateEntryCopy(entry);
    return entry;
  }

  function updateEntryCopy(entry = document.querySelector('#toolsScreen [data-tool="downloads"]')) {
    if (!entry) return;
    const copy = c();
    const summary = parse(NATIVE.getReviewSummary?.(), {});
    const status = summary?.available && Number.isFinite(Number(summary.downloadsCount))
      ? `${n(summary.downloadsCount)} ${copy.files} · ${formatBytes(summary.downloadsBytes)}`
      : copy.toolSub;
    const signature = `${language()}|${copy.toolTitle}|${status}`;
    if (entry.dataset.downloadsSignature !== signature) {
      entry.dataset.downloadsSignature = signature;
      entry.innerHTML = `<span class="mini-icon">${icon('downloads')}</span><span><strong>${esc(copy.toolTitle)}</strong><small>${esc(status)}</small></span><b>›</b>`;
      entry.setAttribute('aria-label', `${copy.toolTitle}. ${status}`);
    }
  }

  function ensureSurface() {
    ensureStyle();
    let surface = byId('baDownloadsSurface');
    if (surface) return surface;
    surface = document.createElement('section');
    surface.id = 'baDownloadsSurface';
    surface.className = 'ba-downloads-surface';
    surface.hidden = true;
    surface.setAttribute('role', 'dialog');
    surface.setAttribute('aria-modal', 'true');
    surface.setAttribute('aria-labelledby', 'baDownloadsSurfaceTitle');
    surface.innerHTML = `
      <header class="ba-downloads-head">
        <span class="ba-downloads-head__icon">${icon('downloads')}</span>
        <div class="ba-downloads-head__copy"><strong id="baDownloadsSurfaceTitle"></strong><small>BEARAGNOSTIC · LOCAL REVIEW</small></div>
        <button class="ba-downloads-close" type="button" data-download-action="close" aria-label="Close">×</button>
      </header>
      <div class="ba-downloads-scroll"><div class="ba-downloads-wrap" id="baDownloadsContent"></div></div>
      <div id="baDownloadsSelection"></div>
    `;
    document.body.appendChild(surface);
    bindSurface(surface);
    return surface;
  }

  function baseIntro() {
    const copy = c();
    return `<div class="ba-downloads-kicker">${esc(copy.kicker)}</div><h2 class="ba-downloads-title">${esc(copy.title)}</h2><p class="ba-downloads-lead">${esc(copy.lead)}</p>`;
  }

  function triad() {
    const copy = c();
    const custom = state.summary?.scanMode === 'custom';
    return `<div class="ba-downloads-triad">
      <div class="ba-downloads-chip"><small>${esc(copy.source)}</small><strong>${esc(copy.sourceSnapshot)}</strong></div>
      <div class="ba-downloads-chip"><small>${esc(copy.coverage)}</small><strong>${esc(custom ? copy.customCoverage : copy.fullCoverage)}</strong></div>
      <div class="ba-downloads-chip"><small>${esc(copy.safety)}</small><strong>${esc(copy.reviewFirst)}</strong></div>
    </div>`;
  }

  function stateCard(iconName, title, body, actions = '') {
    return `<div class="ba-downloads-state"><span class="ba-downloads-state__icon">${icon(iconName)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p>${actions ? `<div class="ba-downloads-actions">${actions}</div>` : ''}</div>`;
  }

  function renderAccess() {
    const copy = c();
    return `${baseIntro()}${stateCard('shield', copy.accessTitle, copy.accessBody, `<button class="ba-downloads-primary" type="button" data-download-action="permission">${esc(copy.openSettings)}</button>`)}`;
  }

  function renderNoSnapshot() {
    const copy = c();
    return `${baseIntro()}${stateCard('downloads', copy.noSnapshotTitle, copy.noSnapshotBody, `<button class="ba-downloads-primary" type="button" data-download-action="scan">${esc(copy.runQuick)}</button>`)}`;
  }

  function renderScanning() {
    const copy = c();
    return `${baseIntro()}<div class="ba-downloads-state"><div class="ba-downloads-state__spinner" aria-hidden="true"></div><h3>${esc(copy.scanningTitle)}</h3><p>${esc(copy.scanningBody)}</p><p>${esc(copy.scanningHint)}</p></div>`;
  }

  function renderError() {
    const copy = c();
    return `${baseIntro()}${stateCard('warning', copy.errorTitle, state.error || copy.scanFailed, `<button class="ba-downloads-primary" type="button" data-download-action="retry">${esc(copy.retry)}</button>`)}`;
  }

  function renderEmpty() {
    const copy = c();
    const custom = state.summary?.scanMode === 'custom';
    const customNotice = custom ? `<div class="ba-downloads-notice ba-downloads-notice--info"><span class="ba-downloads-notice__icon">${icon('downloads')}</span><div><strong>${esc(copy.customTitle)}</strong><small>${esc(copy.customBody)}</small><div class="ba-downloads-actions" style="justify-content:flex-start;margin-top:8px"><button class="ba-downloads-secondary" type="button" data-download-action="scan">${esc(copy.checkAll)}</button></div></div></div>` : '';
    const partialState = state.summary?.detailsTruncated
      ? stateCard('warning', copy.partialTitle, copy.partialBody, `<button class="ba-downloads-secondary" type="button" data-download-action="scan">${esc(copy.refresh)}</button>`)
      : stateCard('downloads', copy.noFilesTitle, copy.noFilesBody, `<button class="ba-downloads-secondary" type="button" data-download-action="scan">${esc(copy.refresh)}</button>`);
    return `${baseIntro()}${triad()}${customNotice}${partialState}`;
  }

  function renderResults() {
    const copy = c();
    syncSelectionPrivacy();
    const filteredItems = visibleItems();
    const items = filteredItems.slice(0, state.renderLimit);
    const allVisible = HIDDEN?.filter ? HIDDEN.filter(state.items) : state.items.slice();
    const totalBytes = allVisible.reduce((sum, item) => sum + n(item.sizeBytes), 0);
    const largest = allVisible.reduce((max, item) => Math.max(max, n(item.sizeBytes)), 0);
    const aggregateCount = Number.isFinite(Number(state.summary?.downloadsCount)) ? n(state.summary.downloadsCount) : allVisible.length;
    const aggregateBytes = Number.isFinite(Number(state.summary?.downloadsBytes)) ? n(state.summary.downloadsBytes) : totalBytes;
    const custom = state.summary?.scanMode === 'custom';
    const stale = !isFresh();
    const hiddenNotice = HIDDEN?.isEnabled && !HIDDEN.isEnabled()
      ? `<div class="ba-downloads-inline">${esc(copy.hiddenOff)}</div>` : '';
    const partial = state.summary?.detailsTruncated
      ? `<div class="ba-downloads-notice"><span class="ba-downloads-notice__icon">${icon('warning')}</span><div><strong>${esc(copy.partialTitle)}</strong><small>${esc(copy.partialBody)}</small></div></div>` : '';
    const customNotice = custom
      ? `<div class="ba-downloads-notice ba-downloads-notice--info"><span class="ba-downloads-notice__icon">${icon('downloads')}</span><div><strong>${esc(copy.customTitle)}</strong><small>${esc(copy.customBody)}</small><div class="ba-downloads-actions" style="justify-content:flex-start;margin-top:8px"><button class="ba-downloads-secondary" type="button" data-download-action="scan">${esc(copy.checkAll)}</button></div></div></div>` : '';
    const staleNotice = stale
      ? `<div class="ba-downloads-notice"><span class="ba-downloads-notice__icon">${icon('refresh')}</span><div><strong>${esc(copy.staleTitle)}</strong><small>${esc(copy.staleBody)}</small><div class="ba-downloads-actions" style="justify-content:flex-start;margin-top:8px"><button class="ba-downloads-secondary" type="button" data-download-action="scan">${esc(copy.refresh)}</button></div></div></div>` : '';
    const runningNotice = state.scannerRunning
      ? `<div class="ba-downloads-notice ba-downloads-notice--info"><span class="ba-downloads-notice__icon">${icon('refresh')}</span><div><strong>${esc(copy.scanningTitle)}</strong><small>${esc(copy.anotherScan)}</small></div></div>` : '';
    const rows = items.length ? items.map((item) => {
      const kind = kindFor(item);
      const checked = state.selected.has(item.id);
      return `<label class="ba-downloads-file${checked ? ' is-selected' : ''}" data-kind="${esc(kind)}">
        <input type="checkbox" data-download-id="${esc(item.id)}"${checked ? ' checked' : ''}${state.scannerRunning ? ' disabled' : ''}>
        <span class="ba-downloads-file__icon">${icon(kind)}</span>
        <span class="ba-downloads-file__copy"><span class="ba-downloads-file__type">${esc(kindLabel(kind))}</span><strong>${esc(item.name || '(unnamed)')}</strong><small>${esc(item.location || 'Downloads')}</small></span>
        <span class="ba-downloads-file__meta"><b>${esc(formatBytes(item.sizeBytes))}</b><small>${esc(ageLabel(item.modifiedMs))}</small></span>
      </label>`;
    }).join('') : `<div class="ba-downloads-empty"><h3>${esc(copy.noFilter)}</h3></div>`;
    return `${baseIntro()}${triad()}
      <div class="ba-downloads-stats">
        <div class="ba-downloads-stat"><b>${aggregateCount}</b><span>${esc(copy.files)}</span></div>
        <div class="ba-downloads-stat"><b>${esc(formatBytes(aggregateBytes))}</b><span>${esc(copy.totalSize)}</span></div>
        <div class="ba-downloads-stat"><b>${esc(formatBytes(largest))}</b><span>${esc(copy.largest)}</span></div>
        <div class="ba-downloads-stat"><b>${esc(checkedLabel(state.summary?.generatedAtMs))}</b><span>${esc(copy.checked)}</span></div>
      </div>
      <div class="ba-downloads-notice"><span class="ba-downloads-notice__icon">${icon('warning')}</span><div><strong>${esc(copy.cautionTitle)}</strong><small>${esc(copy.cautionBody)}</small></div></div>
      ${runningNotice}${staleNotice}${partial}${customNotice}${hiddenNotice}
      <div class="ba-downloads-controls">
        <select class="ba-downloads-select" data-download-control="filter" aria-label="Filter">
          <option value="all"${state.filter === 'all' ? ' selected' : ''}>${esc(copy.filterAll)}</option>
          <option value="photos"${state.filter === 'photos' ? ' selected' : ''}>${esc(copy.filterPhotos)}</option>
          <option value="videos"${state.filter === 'videos' ? ' selected' : ''}>${esc(copy.filterVideos)}</option>
          <option value="docs"${state.filter === 'docs' ? ' selected' : ''}>${esc(copy.filterDocs)}</option>
          <option value="packages"${state.filter === 'packages' ? ' selected' : ''}>${esc(copy.filterPackages)}</option>
          <option value="audio"${state.filter === 'audio' ? ' selected' : ''}>${esc(copy.filterAudio)}</option>
          <option value="other"${state.filter === 'other' ? ' selected' : ''}>${esc(copy.filterOther)}</option>
        </select>
        <select class="ba-downloads-select" data-download-control="sort" aria-label="Sort">
          <option value="newest"${state.sort === 'newest' ? ' selected' : ''}>${esc(copy.sortNewest)}</option>
          <option value="largest"${state.sort === 'largest' ? ' selected' : ''}>${esc(copy.sortLargest)}</option>
          <option value="oldest"${state.sort === 'oldest' ? ' selected' : ''}>${esc(copy.sortOldest)}</option>
          <option value="name"${state.sort === 'name' ? ' selected' : ''}>${esc(copy.sortName)}</option>
        </select>
      </div>
      <div class="ba-downloads-sectionhead"><strong>${esc(copy.selectionTitle)}</strong><small>${esc(copy.showing.replace('{shown}', items.length).replace('{total}', filteredItems.length))}</small></div>
      <div class="ba-downloads-list">${rows}</div>
      ${items.length < filteredItems.length ? `<div class="ba-downloads-actions"><button class="ba-downloads-secondary" type="button" data-download-action="more">${esc(copy.showMore)} · ${filteredItems.length - items.length}</button></div>` : ''}
      ${state.message ? `<div class="ba-downloads-inline${state.message === copy.limitReached ? ' is-error' : ''}">${esc(state.message)}</div>` : ''}`;
  }

  function renderConfirm() {
    const copy = c();
    const chosen = selectedItems();
    const bytes = chosen.reduce((sum, item) => sum + n(item.sizeBytes), 0);
    const preview = chosen.slice(0, 8).map((item) => `<div class="ba-downloads-confirm-item"><strong>${esc(item.name || '(unnamed)')}</strong><span>${esc(formatBytes(item.sizeBytes))}</span></div>`).join('');
    const remaining = chosen.length > 8 ? `<div class="ba-downloads-inline">+${chosen.length - 8}</div>` : '';
    return `<div class="ba-downloads-kicker">${esc(copy.finalKicker)}</div><h2 class="ba-downloads-title">${esc(copy.finalTitle)}</h2><p class="ba-downloads-lead">${esc(copy.finalBody)}</p>
      <div class="ba-downloads-result-grid">
        <div class="ba-downloads-result-card"><b>${chosen.length}</b><span>${esc(copy.selectedFiles)}</span></div>
        <div class="ba-downloads-result-card"><b>${esc(formatBytes(bytes))}</b><span>${esc(copy.selectedBytes)}</span></div>
        <div class="ba-downloads-result-card"><b>${isFresh() ? 'LIVE' : 'STALE'}</b><span>${esc(copy.safety)}</span></div>
      </div>
      <div class="ba-downloads-notice"><span class="ba-downloads-notice__icon">${icon('shield')}</span><div><strong>${esc(copy.reviewFirst)}</strong><small>${esc(copy.protection)}</small></div></div>
      <div class="ba-downloads-confirm-list">${preview}${remaining}</div>
      <div class="ba-downloads-inline">${esc(copy.limit)}</div>
      <div class="ba-downloads-actions">
        <button class="ba-downloads-secondary" type="button" data-download-action="back">${esc(copy.back)}</button>
        <button class="ba-downloads-primary" type="button" data-download-action="delete"${!chosen.length || !isFresh() || state.scannerRunning ? ' disabled' : ''}>${esc(copy.deleteVerify)}</button>
      </div>`;
  }

  function renderDeleting() {
    const copy = c();
    return `${baseIntro()}<div class="ba-downloads-state"><div class="ba-downloads-state__spinner" aria-hidden="true"></div><h3>${esc(copy.deleting)}</h3><p>${esc(copy.resultBody)}</p></div>`;
  }

  function renderResult() {
    const copy = c();
    const result = state.result || {};
    const failedCount = Array.isArray(result.failed) ? result.failed.length : 0;
    const protectedCount = Array.isArray(result.protectedIds) ? result.protectedIds.length : 0;
    return `<div class="ba-downloads-kicker">${esc(copy.resultKicker)}</div><h2 class="ba-downloads-title">${esc(copy.resultTitle)}</h2><p class="ba-downloads-lead">${esc(copy.resultBody)}</p>
      <div class="ba-downloads-result-grid">
        <div class="ba-downloads-result-card"><b>${esc(formatBytes(result.reclaimedBytes))}</b><span>${esc(copy.reclaimed)}</span></div>
        <div class="ba-downloads-result-card"><b>${n(result.deletedCount)}</b><span>${esc(copy.removed)}</span></div>
        <div class="ba-downloads-result-card"><b>${protectedCount}</b><span>${esc(copy.protected)}</span></div>
      </div>
      ${failedCount ? `<div class="ba-downloads-notice"><span class="ba-downloads-notice__icon">${icon('warning')}</span><div><strong>${failedCount} ${esc(copy.failed)}</strong><small>${esc(copy.resultBody)}</small></div></div>` : ''}
      <div class="ba-downloads-actions">
        <button class="ba-downloads-secondary" type="button" data-download-action="remaining">${esc(copy.reviewRemaining)}</button>
        <button class="ba-downloads-primary" type="button" data-download-action="close">${esc(copy.done)}</button>
      </div>`;
  }

  function renderSelection() {
    const host = byId('baDownloadsSelection');
    if (!host) return;
    const copy = c();
    const chosen = selectedItems();
    if (!state.open || state.view !== 'results' || !state.summary?.available || state.items.length === 0) {
      host.innerHTML = '';
      return;
    }
    const bytes = chosen.reduce((sum, item) => sum + n(item.sizeBytes), 0);
    host.innerHTML = `<div class="ba-downloads-selection"><div class="ba-downloads-selection__inner">
      <div class="ba-downloads-selection__copy"><strong>${esc(copy.selected.replace('{count}', chosen.length).replace('{bytes}', formatBytes(bytes)))}</strong><small>${esc(copy.limit)}</small></div>
      <button class="ba-downloads-secondary" type="button" data-download-action="clear"${chosen.length ? '' : ' disabled'}>${esc(copy.clear)}</button>
      <button class="ba-downloads-primary" type="button" data-download-action="review"${chosen.length && isFresh() && !state.scannerRunning ? '' : ' disabled'}>${esc(copy.reviewSelected)}</button>
    </div></div>`;
  }

  function render() {
    const surface = ensureSurface();
    const title = byId('baDownloadsSurfaceTitle');
    if (title) title.textContent = c().toolTitle;
    const close = surface.querySelector('[data-download-action="close"]');
    if (close) close.setAttribute('aria-label', c().close);
    const host = byId('baDownloadsContent');
    if (!host) return;

    if (state.loading) host.innerHTML = `${baseIntro()}<div class="ba-downloads-state"><div class="ba-downloads-state__spinner"></div></div>`;
    else if (state.error) host.innerHTML = renderError();
    else if (!state.native?.broadStorageAccess) host.innerHTML = renderAccess();
    else if (state.view === 'deleting') host.innerHTML = renderDeleting();
    else if (state.view === 'result') host.innerHTML = renderResult();
    else if (state.view === 'confirm') host.innerHTML = renderConfirm();
    else if (!state.summary?.available && state.scannerRunning) host.innerHTML = renderScanning();
    else if (!state.summary?.available) host.innerHTML = renderNoSnapshot();
    else if (!state.items.length && state.scannerRunning) host.innerHTML = renderScanning();
    else if (!state.items.length) host.innerHTML = renderEmpty();
    else host.innerHTML = renderResults();

    renderSelection();
  }

  async function loadCandidates() {
    const token = ++state.loadToken;
    const items = [];
    const seen = new Set();
    let offset = 0;
    let detailsTruncated = Boolean(state.summary?.detailsTruncated);
    for (let pageIndex = 0; pageIndex < 48; pageIndex++) {
      const page = parse(NATIVE.getReviewCandidates?.(CATEGORY, offset, REVIEW_PAGE_SIZE), {});
      if (token !== state.loadToken) return;
      if (!page?.available) break;
      detailsTruncated = detailsTruncated || Boolean(page.detailsTruncated);
      const pageItems = Array.isArray(page.items) ? page.items : [];
      for (const item of pageItems) {
        if (!item?.id || seen.has(item.id)) continue;
        seen.add(item.id);
        items.push(item);
      }
      const returned = n(page.returnedCount || pageItems.length);
      if (!page.hasMore || returned <= 0) break;
      offset += returned;
    }
    if (token !== state.loadToken) return;
    state.items = items;
    if (state.summary) state.summary.detailsTruncated = detailsTruncated;
    syncSelectionPrivacy();
  }

  function readNative() {
    state.native = parse(NATIVE.getNativeState?.(), {});
    state.scannerRunning = Boolean(state.native?.scannerRunning);
    state.summary = parse(NATIVE.getReviewSummary?.(), {});
  }

  async function refresh({keepView = false} = {}) {
    const previousSnapshotAt = n(state.summary?.generatedAtMs);
    state.loading = true;
    state.error = '';
    state.message = '';
    if (!keepView) state.view = 'results';
    render();
    try {
      readNative();
      const currentSnapshotAt = n(state.summary?.generatedAtMs);
      if (previousSnapshotAt && currentSnapshotAt && previousSnapshotAt !== currentSnapshotAt) {
        state.selected.clear();
        state.view = 'results';
        state.renderLimit = RENDER_BATCH;
      }
      if (state.native?.broadStorageAccess && state.summary?.available) await loadCandidates();
      else state.items = [];
      state.loading = false;
      render();
      updateEntryCopy();
      if (state.scannerRunning) startPolling();
      else stopPolling();
    } catch (_) {
      state.loading = false;
      state.error = c().errorTitle;
      render();
    }
  }

  function startPolling() {
    if (state.pollTimer) return;
    state.pollTimer = window.setInterval(async () => {
      if (!state.open) { stopPolling(); return; }
      const native = parse(NATIVE.getNativeState?.(), {});
      const wasRunning = state.scannerRunning;
      state.native = native;
      state.scannerRunning = Boolean(native?.scannerRunning);
      if (wasRunning && !state.scannerRunning) {
        stopPolling();
        await refresh();
      } else if (state.scannerRunning !== wasRunning) {
        render();
      }
    }, POLL_MS);
  }

  function stopPolling() {
    if (!state.pollTimer) return;
    clearInterval(state.pollTimer);
    state.pollTimer = null;
  }

  function startQuickScan() {
    state.error = '';
    state.message = '';
    const native = parse(NATIVE.getNativeState?.(), {});
    if (!native?.broadStorageAccess) {
      try { NATIVE.requestBroadStorageAccess?.(); } catch (_) {}
      return;
    }
    const result = parse(NATIVE.startScan?.('quick', '[]', false), {});
    if (result?.accepted) {
      state.scannerRunning = true;
      state.summary = null;
      state.items = [];
      state.selected.clear();
      state.renderLimit = RENDER_BATCH;
      state.view = 'results';
      render();
      startPolling();
      return;
    }
    if (result?.reason === 'scan_running') {
      state.scannerRunning = true;
      state.message = c().anotherScan;
      render();
      startPolling();
      return;
    }
    state.error = result?.reason ? `${c().scanFailed} (${result.reason})` : c().scanFailed;
    render();
  }

  async function performDelete() {
    const chosen = selectedItems();
    if (!chosen.length || chosen.length > MAX_DELETE_SELECTION || !isFresh() || state.scannerRunning) return;
    state.view = 'deleting';
    state.error = '';
    render();
    try {
      const result = parse(NATIVE.deleteReviewCandidates?.(JSON.stringify(chosen.map((item) => item.id))), {});
      if (!result?.accepted) {
        if (result?.reason === 'stale_review_snapshot') {
          state.view = 'results';
          state.message = c().staleBody;
          await refresh({keepView: true});
          return;
        }
        state.view = 'results';
        state.error = result?.reason || c().errorTitle;
        render();
        return;
      }
      state.result = result;
      state.selected.clear();
      state.summary = result.reviewSummary || parse(NATIVE.getReviewSummary?.(), {});
      await loadCandidates();
      state.view = 'result';
      render();
      updateEntryCopy();
    } catch (_) {
      state.view = 'results';
      state.error = c().errorTitle;
      render();
    }
  }

  function toggleSelection(id, checked) {
    if (!id) return;
    if (checked) {
      if (state.selected.size >= MAX_DELETE_SELECTION && !state.selected.has(id)) {
        state.message = c().limitReached;
        render();
        return;
      }
      state.selected.add(id);
    } else {
      state.selected.delete(id);
    }
    state.message = '';
    render();
  }

  function bindSurface(surface) {
    surface.addEventListener('change', (event) => {
      const target = event.target;
      if (target?.matches?.('[data-download-control="filter"]')) {
        state.filter = target.value || 'all';
        state.renderLimit = RENDER_BATCH;
        render();
        return;
      }
      if (target?.matches?.('[data-download-control="sort"]')) {
        state.sort = target.value || 'newest';
        state.renderLimit = RENDER_BATCH;
        render();
        return;
      }
      if (target?.matches?.('[data-download-id]')) {
        toggleSelection(target.dataset.downloadId, Boolean(target.checked));
      }
    });

    surface.addEventListener('click', async (event) => {
      const button = event.target?.closest?.('[data-download-action]');
      if (!button) return;
      const action = button.dataset.downloadAction;
      if (action === 'close') close();
      else if (action === 'permission') {
        try { NATIVE.requestBroadStorageAccess?.(); } catch (_) {}
      } else if (action === 'scan') startQuickScan();
      else if (action === 'retry') await refresh();
      else if (action === 'clear') { state.selected.clear(); state.message = ''; render(); }
      else if (action === 'more') { state.renderLimit += RENDER_BATCH; render(); }
      else if (action === 'review') {
        if (selectedItems().length && isFresh() && !state.scannerRunning) { state.view = 'confirm'; render(); surface.querySelector('.ba-downloads-scroll')?.scrollTo?.({top: 0}); }
      } else if (action === 'back') { state.view = 'results'; render(); }
      else if (action === 'delete') await performDelete();
      else if (action === 'remaining') { state.view = 'results'; state.result = null; render(); }
    });
  }

  async function open() {
    ensureEntry();
    const surface = ensureSurface();
    state.open = true;
    state.view = 'results';
    state.error = '';
    state.message = '';
    state.result = null;
    state.renderLimit = RENDER_BATCH;
    surface.hidden = false;
    document.body.classList.add('ba-downloads-open');
    await refresh();
    window.requestAnimationFrame(() => surface.querySelector('[data-download-action="close"]')?.focus?.());
  }

  function close() {
    const surface = byId('baDownloadsSurface');
    state.open = false;
    stopPolling();
    if (surface) surface.hidden = true;
    document.body.classList.remove('ba-downloads-open');
    state.selected.clear();
    state.message = '';
    state.error = '';
    updateEntryCopy();
    document.querySelector('#toolsScreen [data-tool="downloads"]')?.focus?.();
  }

  function initialize() {
    ensureStyle();
    ensureEntry();
    updateEntryCopy();
    const observer = new MutationObserver(() => ensureEntry());
    const tools = byId('toolsScreen');
    if (tools) observer.observe(tools, {childList: true, subtree: true});
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target?.closest?.('[data-tool="downloads"]');
    if (!trigger || trigger.closest('#baDownloadsSurface')) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    open();
  }, true);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.open && state.view !== 'deleting') close();
  });
  window.addEventListener('bearagnostic:hiddenitemschange', () => {
    syncSelectionPrivacy();
    if (state.open) render();
  });
  window.addEventListener('bearagnostic:languagechange', () => {
    updateEntryCopy();
    if (state.open) render();
  });
  window.addEventListener('focus', () => {
    if (state.open) refresh({keepView: true});
    else updateEntryCopy();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once: true});
  else initialize();

  window.BearagnosticDownloads = Object.freeze({
    build: BUILD,
    open,
    close,
    refresh: () => refresh(),
    category: CATEGORY
  });
})();
