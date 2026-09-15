(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  const HIDDEN = window.BearagnosticHiddenItems;
  if (!NATIVE) return;

  const BUILD = 39;
  const CATEGORY = 'zero';
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
      toolTitle: 'Zero-byte Files',
      toolSub: 'Review empty files',
      kicker: 'ZERO-BYTE FILES',
      title: 'Review empty files before removing them.',
      lead: 'A zero-byte file is empty, but it can still be an intentional placeholder, export stub, or sync marker. Bearagnostic treats every zero-byte file as Review first.',
      close: 'Close',
      source: 'SOURCE', coverage: 'COVERAGE', safety: 'SAFETY',
      sourceSnapshot: 'Current checkup', fullCoverage: 'Accessible storage', customCoverage: 'Selected Custom scope', reviewFirst: 'Review first',
      accessTitle: 'Storage access is needed',
      accessBody: 'Android must allow shared-storage access before Bearagnostic can review zero-byte files.',
      openSettings: 'Open Android settings',
      noSnapshotTitle: 'Check for zero-byte files first',
      noSnapshotBody: 'Run a Quick Scan to locate zero-byte files in accessible shared storage. Quick reads filesystem metadata only and does not delete anything.',
      runQuick: 'Run Quick Scan',
      scanningTitle: 'Checking for zero-byte files',
      scanningBody: 'Bearagnostic is using real filesystem work. No fake delay or cosmetic progress is added.',
      scanningHint: 'Zero-byte files will appear when the current checkup finishes.',
      files: 'Zero-byte files', totalSize: 'Total size', largest: 'Largest', checked: 'Checked', justNow: 'just now', minAgo: 'min ago',
      cautionTitle: 'An empty file can still be intentional',
      cautionBody: 'Placeholders, export stubs, sync markers, or app-created sentinel files can legitimately be 0 B. Nothing here is selected automatically.',
      partialTitle: 'Review list is partial',
      partialBody: 'The current safety snapshot reached its review-detail limit. Only zero-byte files represented in this snapshot can be selected.',
      customTitle: 'Custom scope',
      customBody: 'This snapshot came from selected Custom Scan locations. Zero-byte files outside those selected locations are not represented.',
      checkAll: 'Check all accessible storage',
      filterAll: 'All', filterDocuments: 'Documents', filterMedia: 'Media', filterApk: 'APK', filterArchives: 'Archives', filterOther: 'Other',
      sortNewest: 'Newest first', sortOldest: 'Oldest first', sortName: 'Name A–Z', sortLocation: 'Location A–Z',
      selectionTitle: 'Choose only empty files you recognize and no longer need',
      showing: 'Showing {shown} of {total}', selected: '{count} selected · {bytes}', clear: 'Clear', reviewSelected: 'Review selected',
      noFilesTitle: 'No zero-byte files surfaced in this snapshot',
      noFilesBody: 'No zero-byte file identities are available in the current review snapshot. Nothing was removed.',
      noFilter: 'No zero-byte files match this filter.', showMore: 'Show more empty files', dateUnknown: 'Date unavailable',
      hiddenOff: 'Hidden-item privacy is on. Hidden identities stay out of this list.',
      staleTitle: 'Refresh before deleting',
      staleBody: 'This review snapshot is more than 15 minutes old. Run a fresh Quick Scan before permanent deletion.',
      refresh: 'Refresh', limit: 'Up to 500 files can be removed in one verified batch.', limitReached: 'The 500-file safety limit has been reached.',
      finalKicker: 'FINAL REVIEW',
      finalTitle: 'Remove the selected empty files?',
      finalBody: 'This permanently removes only the empty files you selected. Bearagnostic does not assume every 0 B file is disposable.',
      selectedFiles: 'files selected', selectedBytes: 'selected size',
      protection: 'Native deletion safety remains active. If a selected empty file is also part of a verified duplicate group, keep-one protection still applies.',
      back: 'Back', deleteVerify: 'Delete & verify', deleting: 'Deleting and verifying…',
      resultKicker: 'VERIFIED CLEANUP', resultTitle: 'Zero-byte cleanup complete', reclaimed: 'verified space reclaimed', removed: 'files removed', protected: 'kept by safety', failed: 'not removed',
      resultBody: 'Only zero-byte files Android confirmed as gone are counted as removed.', reviewRemaining: 'Review remaining', done: 'Done',
      errorTitle: 'Zero-byte review could not continue', retry: 'Try again', scanFailed: 'The Quick Scan could not start.', anotherScan: 'Another checkup is already running. Zero-byte files will refresh when it finishes.',
      kindDocuments: 'DOC', kindMedia: 'MEDIA', kindApk: 'APK', kindArchives: 'ARCHIVE', kindOther: 'OTHER'
    },
    th: {
      toolTitle: 'ไฟล์ 0 ไบต์',
      toolSub: 'ตรวจไฟล์ว่างเปล่า',
      kicker: 'ตรวจไฟล์ 0 ไบต์',
      title: 'ดูไฟล์ 0 ไบต์ให้ชัดก่อนตัดสินใจลบ',
      lead: 'ไฟล์ 0 ไบต์เป็นไฟล์ว่างเปล่า แต่บางครั้งอาจตั้งใจสร้างไว้เป็น placeholder ไฟล์ส่งออกชั่วคราว หรือ marker ของระบบ Bearagnostic จัดทุกไฟล์ไว้ในกลุ่มตรวจดูก่อน',
      close: 'ปิด',
      source: 'แหล่งข้อมูล', coverage: 'ขอบเขต', safety: 'ความปลอดภัย',
      sourceSnapshot: 'ผลตรวจปัจจุบัน', fullCoverage: 'พื้นที่ที่เข้าถึงได้', customCoverage: 'ขอบเขต Custom ที่เลือก', reviewFirst: 'ตรวจดูก่อน',
      accessTitle: 'ต้องอนุญาตการเข้าถึงพื้นที่จัดเก็บ',
      accessBody: 'Android ต้องอนุญาต shared storage ก่อนที่ Bearagnostic จะตรวจไฟล์บีบอัดได้',
      openSettings: 'เปิดการตั้งค่า Android',
      noSnapshotTitle: 'ตรวจหาไฟล์ 0 ไบต์ก่อน',
      noSnapshotBody: 'เริ่ม Quick Scan เพื่อค้นหาไฟล์ 0 ไบต์ใน shared storage ที่เข้าถึงได้ Quick อ่านเฉพาะข้อมูลระบบไฟล์และไม่ลบอะไร',
      runQuick: 'เริ่ม Quick Scan',
      scanningTitle: 'กำลังตรวจหาไฟล์ 0 ไบต์',
      scanningBody: 'Bearagnostic แสดงตามงานจริงของระบบไฟล์ ไม่มีการหน่วงเวลาหรือสร้างความคืบหน้าปลอม',
      scanningHint: 'รายการไฟล์ 0 ไบต์จะปรากฏเมื่อการตรวจปัจจุบันเสร็จสิ้น',
      files: 'ไฟล์ 0 ไบต์', totalSize: 'ขนาดรวม', largest: 'ใหญ่ที่สุด', checked: 'ตรวจเมื่อ', justNow: 'เมื่อสักครู่', minAgo: 'นาทีที่แล้ว',
      cautionTitle: 'ไฟล์ว่างเปล่าอาจถูกสร้างไว้โดยตั้งใจ',
      cautionBody: 'placeholder ไฟล์ส่งออกชั่วคราว sync marker หรือ sentinel file จากบางแอป อาจมีขนาด 0 B อย่างตั้งใจ Bearagnostic จะไม่เลือกไฟล์เหล่านี้ให้ลบอัตโนมัติ',
      partialTitle: 'รายการตรวจแสดงได้ไม่ครบทั้งหมด',
      partialBody: 'snapshot ปัจจุบันถึงขีดจำกัดรายละเอียดเพื่อความปลอดภัย เลือกได้เฉพาะไฟล์ 0 ไบต์ที่อยู่ใน snapshot นี้เท่านั้น',
      customTitle: 'ขอบเขต Custom',
      customBody: 'snapshot นี้มาจากตำแหน่ง Custom Scan ที่เลือก จึงไม่รวมไฟล์ 0 ไบต์นอกตำแหน่งที่เลือกไว้',
      checkAll: 'ตรวจทั่วพื้นที่ที่เข้าถึงได้',
      filterAll: 'ทั้งหมด', filterDocuments: 'เอกสาร', filterMedia: 'สื่อ', filterApk: 'APK', filterArchives: 'Archive', filterOther: 'อื่นๆ',
      sortNewest: 'ใหม่สุดก่อน', sortOldest: 'เก่าสุดก่อน', sortName: 'ชื่อ A–Z', sortLocation: 'ตำแหน่ง A–Z',
      selectionTitle: 'เลือกเฉพาะไฟล์ 0 ไบต์ที่รู้จักและไม่ต้องการแล้ว',
      showing: 'แสดง {shown} จาก {total}', selected: 'เลือก {count} ไฟล์ · {bytes}', clear: 'ล้างที่เลือก', reviewSelected: 'ตรวจรายการที่เลือก',
      noFilesTitle: 'ไม่พบไฟล์ 0 ไบต์ใน snapshot นี้',
      noFilesBody: 'ไม่พบตัวตนไฟล์ 0 ไบต์ใน snapshot ปัจจุบัน และไม่มีการลบอะไร',
      noFilter: 'ไม่มีไฟล์ 0 ไบต์ในตัวกรองนี้', showMore: 'แสดงไฟล์ว่างเพิ่ม', dateUnknown: 'ไม่มีข้อมูลวันที่',
      hiddenOff: 'การปกป้องรายการที่ซ่อนอยู่เปิดใช้งานอยู่ ตัวตนไฟล์ที่ซ่อนจะไม่ปรากฏในรายการนี้',
      staleTitle: 'ตรวจใหม่ก่อนลบ',
      staleBody: 'snapshot นี้เก่ากว่า 15 นาที กรุณาเริ่ม Quick Scan ใหม่ก่อนลบถาวร',
      refresh: 'ตรวจใหม่', limit: 'ลบได้สูงสุด 500 ไฟล์ต่อหนึ่ง batch ที่มีการตรวจยืนยัน', limitReached: 'เลือกครบขีดจำกัดความปลอดภัย 500 ไฟล์แล้ว',
      finalKicker: 'ตรวจครั้งสุดท้าย',
      finalTitle: 'ลบไฟล์ 0 ไบต์ที่เลือกหรือไม่',
      finalBody: 'ระบบจะลบถาวรเฉพาะไฟล์ 0 ไบต์ที่เลือก Bearagnostic จะไม่สมมติว่าไฟล์ 0 B ทุกไฟล์สามารถลบทิ้งได้เสมอ',
      selectedFiles: 'ไฟล์ที่เลือก', selectedBytes: 'ขนาดที่เลือก',
      protection: 'ระบบความปลอดภัย Native ยังทำงานอยู่ ถ้าไฟล์ว่างที่เลือกเป็นสมาชิกของกลุ่มไฟล์ซ้ำที่ยืนยันแล้ว ระบบยังคงเก็บไว้อย่างน้อยหนึ่งไฟล์',
      back: 'ย้อนกลับ', deleteVerify: 'ลบและตรวจยืนยัน', deleting: 'กำลังลบและตรวจยืนยัน…',
      resultKicker: 'ยืนยันผลแล้ว', resultTitle: 'จัดการไฟล์ 0 ไบต์เสร็จแล้ว', reclaimed: 'พื้นที่ที่คืนได้จริง', removed: 'ไฟล์ที่ลบแล้ว', protected: 'ไฟล์ที่ระบบป้องกันไว้', failed: 'ไฟล์ที่ลบไม่สำเร็จ',
      resultBody: 'นับเฉพาะไฟล์ 0 ไบต์ที่ Android ยืนยันว่าหายไปแล้วเท่านั้น', reviewRemaining: 'ตรวจไฟล์ที่เหลือ', done: 'เสร็จสิ้น',
      errorTitle: 'ไม่สามารถดำเนินการตรวจไฟล์ 0 ไบต์ต่อได้', retry: 'ลองอีกครั้ง', scanFailed: 'ไม่สามารถเริ่ม Quick Scan ได้', anotherScan: 'มีการตรวจอื่นกำลังทำงานอยู่ รายการไฟล์ 0 ไบต์จะอัปเดตเมื่อการตรวจนั้นเสร็จ',
      kindDocuments: 'DOC', kindMedia: 'MEDIA', kindApk: 'APK', kindArchives: 'ARCHIVE', kindOther: 'OTHER'
    },
    ja: {
      toolTitle: '0 バイトファイル',
      toolSub: '空のファイルを確認',
      kicker: '0 バイトファイル',
      title: '空のファイルを削除前に確認。',
      lead: '0 バイトのファイルは空ですが、プレースホルダー、書き出し用の仮ファイル、同期マーカーとして意図的に作られている場合があります。Bearagnostic はすべて確認優先として扱います。',
      close: '閉じる',
      source: 'ソース', coverage: '範囲', safety: '安全性',
      sourceSnapshot: '現在のチェック', fullCoverage: 'アクセス可能な領域', customCoverage: '選択した Custom 範囲', reviewFirst: '要確認',
      accessTitle: 'ストレージへのアクセスが必要です',
      accessBody: 'アーカイブを確認するには、Android で共有ストレージへのアクセスを許可してください。',
      openSettings: 'Android 設定を開く',
      noSnapshotTitle: 'まず 0 バイトファイルを確認',
      noSnapshotBody: 'Quick Scan でアクセス可能な共有ストレージ内の 0 バイトファイルを探します。ファイルシステムのメタデータのみを読み取り、削除は行いません。',
      runQuick: 'Quick Scan を開始',
      scanningTitle: '0 バイトファイルを確認中',
      scanningBody: '実際のファイルシステム処理に従って進みます。見せるための待ち時間や偽の進捗は追加しません。',
      scanningHint: '現在のチェックが完了すると 0 バイトファイルが表示されます。',
      files: '0 バイトファイル', totalSize: '合計サイズ', largest: '最大', checked: '確認', justNow: 'たった今', minAgo: '分前',
      cautionTitle: '空のファイルでも意図的な場合があります',
      cautionBody: 'プレースホルダー、書き出しスタブ、同期マーカー、アプリが作る sentinel ファイルなどが 0 B で存在することがあります。自動選択は行いません。',
      partialTitle: 'レビュー一覧は一部のみです',
      partialBody: '現在の安全 snapshot は詳細表示上限に達しています。この snapshot に含まれる 0 バイトファイルだけを選択できます。',
      customTitle: 'Custom 範囲',
      customBody: 'この snapshot は選択した Custom Scan の場所から作成されています。選択外の 0 バイトファイルは含まれません。',
      checkAll: 'アクセス可能な全領域を確認',
      filterAll: 'すべて', filterDocuments: '書類', filterMedia: 'メディア', filterApk: 'APK', filterArchives: 'Archive', filterOther: 'その他',
      sortNewest: '新しい順', sortOldest: '古い順', sortName: '名前 A–Z', sortLocation: '場所 A–Z',
      selectionTitle: '内容を把握し、不要だと判断した 0 バイトファイルだけを選択してください',
      showing: '{total} 件中 {shown} 件を表示', selected: '{count} 件選択 · {bytes}', clear: '選択解除', reviewSelected: '選択内容を確認',
      noFilesTitle: 'この snapshot には 0 バイトファイルがありません',
      noFilesBody: '現在の review snapshot に 0 バイトファイルはありません。削除は行われていません。',
      noFilter: 'このフィルターに一致する 0 バイトファイルはありません。', showMore: '空のファイルをさらに表示', dateUnknown: '日付情報なし',
      hiddenOff: '非表示項目のプライバシー保護が有効です。非表示の識別情報はこの一覧に表示されません。',
      staleTitle: '削除前に再確認', staleBody: 'この review snapshot は 15 分以上前のものです。完全削除の前に新しい Quick Scan を実行してください。',
      refresh: '再確認', limit: '1 回の検証済みバッチで削除できるのは最大 500 ファイルです。', limitReached: '500 ファイルの安全上限に達しました。',
      finalKicker: '最終確認', finalTitle: '選択した 0 バイトファイルを削除しますか？', finalBody: '選択した 0 バイトファイルだけを完全に削除します。Bearagnostic は 0 B だから不要だとは判断しません。',
      selectedFiles: '選択ファイル', selectedBytes: '選択サイズ', protection: 'Native の削除保護は引き続き有効です。選択した空ファイルが検証済み重複グループに属する場合は、1 つを残す保護も維持されます。',
      back: '戻る', deleteVerify: '削除して確認', deleting: '削除して確認中…',
      resultKicker: '検証済みクリーンアップ', resultTitle: '0 バイトファイルの整理が完了しました', reclaimed: '確認済み空き容量', removed: '削除済み', protected: '安全保護', failed: '未削除',
      resultBody: 'Android が実際に消えたと確認した 0 バイトファイルだけを削除件数に数えます。', reviewRemaining: '残りを確認', done: '完了',
      errorTitle: '0 バイトファイルを続行できません', retry: '再試行', scanFailed: 'Quick Scan を開始できませんでした。', anotherScan: '別のチェックが実行中です。完了後に 0 バイトファイルを更新します。',
      kindDocuments: 'DOC', kindMedia: 'MEDIA', kindApk: 'APK', kindArchives: 'ARCHIVE', kindOther: 'OTHER'
    }
  };
  const c = () => COPY[language()] || COPY.en;

  const ICONS = Object.freeze({
    zero: '<path d="M7 4h8l3 3v13H7z"/><path d="M15 4v4h4"/><path d="M9 14h6"/><path d="M10.5 10.5h3"/>',
    file: '<path d="M7 4h8l3 3v13H7z"/><path d="M15 4v4h4"/><path d="M9 14h6"/><path d="M10.5 10.5h3"/>',
    shield: '<path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6Z"/><path d="m9 12 2 2 4-4"/>',
    warning: '<path d="M12 4 21 20H3Z"/><path d="M12 9v5M12 17h.01"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>'
  });
  const svgIcon = (name, className = '') => `<svg${className ? ` class="${className}"` : ''} viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.other}</svg>`;
  const icon = (name) => svgIcon(name);
  function zeroBadge(variant = 'tool') {
    const className = variant === 'header' ? 'ba-zero-badge ba-zero-badge--header' : 'ba-zero-badge';
    return `<span class="${className}" aria-hidden="true"><span class="ba-zero-badge__shadow"></span><span class="ba-zero-badge__plate"></span><span class="ba-zero-badge__glow"></span><span class="ba-zero-badge__shine"></span>${svgIcon('zero', 'ba-zero-badge__glyph')}</span>`;
  }

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

  function locationLabel(item) {
    const raw = String(item?.location || '').trim();
    if (!raw) return 'Shared storage';
    const normalized = raw.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\/storage\/emulated\/0\//i, '').replace(/^0\//, '').replace(/\/$/, '');
    if (/^downloads?$/i.test(normalized)) return language() === 'th' ? 'ดาวน์โหลด' : language() === 'ja' ? 'ダウンロード' : 'Downloads';
    return normalized || 'Shared storage';
  }

  function zeroKind(item) {
    const ext = String(item?.extension || '').toLowerCase();
    if (!ext) return 'other';
    if (['apk'].includes(ext)) return 'apk';
    if (['zip','rar','7z','tar','gz','tgz','bz2','xz'].includes(ext)) return 'archives';
    if (['pdf','txt','rtf','doc','docx','xls','xlsx','ppt','pptx','csv','md','json','xml'].includes(ext)) return 'documents';
    if (['jpg','jpeg','png','webp','gif','bmp','heic','heif','svg','mp4','m4v','mov','mkv','avi','webm','3gp','mp3','wav','m4a','aac','ogg','flac'].includes(ext)) return 'media';
    return 'other';
  }

  function kindLabel(kind) {
    const key = {
      documents: 'kindDocuments', media: 'kindMedia', apk: 'kindApk', archives: 'kindArchives', other: 'kindOther'
    }[kind] || 'kindOther';
    return c()[key] || kind.toUpperCase();
  }

  function visibleItems() {
    const list = HIDDEN?.filter ? HIDDEN.filter(state.items) : state.items.slice();
    return list
      .filter((item) => {
        if (state.filter === 'all') return true;
        return zeroKind(item) === state.filter;
      })
      .sort((a, b) => {
        if (state.sort === 'oldest') return n(a.modifiedMs) - n(b.modifiedMs);
        if (state.sort === 'name') return String(a.name || '').localeCompare(String(b.name || ''), undefined, {sensitivity: 'base'});
        if (state.sort === 'location') return locationLabel(a).localeCompare(locationLabel(b), undefined, {sensitivity: 'base'});
        return n(b.modifiedMs) - n(a.modifiedMs);
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
    if (byId('androidZeroStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidZeroStyle';
    style.textContent = `
      #toolsScreen.ba-tools-expandable{overflow-y:auto!important;overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch;padding-bottom:24px!important;scrollbar-width:none}
      #toolsScreen.ba-tools-expandable::-webkit-scrollbar{display:none}
      #toolsScreen.ba-tools-expandable .utility-list{padding-bottom:10px}
      body.ba-zero-open{overflow:hidden!important}
      .ba-zero-entry{--tone:118,141,160!important}
      .ba-zero-entry .mini-icon{background:transparent!important;border:0!important;box-shadow:none!important;padding:0;display:grid;place-items:center;overflow:visible}
      .ba-zero-entry .mini-icon svg{fill:none;stroke-linecap:round;stroke-linejoin:round}
      .ba-zero-tool-icon{width:40px;height:40px}
      .ba-zero-badge{position:relative;display:inline-grid;place-items:center;width:38px;height:38px;border-radius:13px;isolation:isolate}
      .ba-zero-badge--header{width:24px;height:24px;border-radius:9px}
      .ba-zero-badge__shadow,.ba-zero-badge__plate,.ba-zero-badge__glow,.ba-zero-badge__shine{position:absolute;inset:0;border-radius:inherit}
      .ba-zero-badge__shadow{inset:1px;box-shadow:0 8px 18px rgba(97,113,132,.18),0 2px 5px rgba(83,100,118,.12)}
      .ba-zero-badge__plate{background:linear-gradient(180deg,#f8fbff 0%,#e6eef7 18%,#cbd8e7 48%,#9db4cc 77%,#7692af 100%);border:1px solid rgba(198,213,228,.98);box-shadow:inset 0 1px 0 rgba(255,255,255,.96),inset 0 -8px 12px rgba(78,97,120,.16),inset 0 0 0 1px rgba(255,255,255,.13)}
      .ba-zero-badge__glow{inset:3px;background:radial-gradient(115% 90% at 22% 16%,rgba(255,255,255,.96) 0%,rgba(255,255,255,.48) 26%,rgba(255,255,255,0) 58%),linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,0) 68%)}
      .ba-zero-badge__shine{inset:4px 5px auto 5px;height:12px;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(255,255,255,.18));opacity:.96;filter:blur(.15px)}
      .ba-zero-badge__glyph{position:relative;z-index:1;width:18px;height:18px;stroke:#68829d;stroke-width:1.95;filter:drop-shadow(0 1px 0 rgba(255,255,255,.35))}
      .ba-zero-badge--header .ba-zero-badge__glyph{width:12px;height:12px;stroke-width:2.05}
      .ba-zero-surface{position:fixed;z-index:128;inset:0;background:linear-gradient(180deg,#f8fbfd 0%,#f4f8fb 100%);color:#27394a;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);font-family:inherit}
      .ba-zero-surface[hidden]{display:none!important}
      .ba-zero-head{min-height:60px;padding:10px 15px;display:grid;grid-template-columns:42px minmax(0,1fr) 42px;align-items:center;gap:8px;background:rgba(250,253,255,.96);border-bottom:1px solid rgba(70,105,130,.08);backdrop-filter:blur(16px)}
      .ba-zero-head__icon,.ba-zero-close{width:40px;height:40px;border-radius:14px;border:1px solid rgba(63,104,134,.09);background:#fff;display:grid;place-items:center;color:#278cc5;box-shadow:0 5px 16px rgba(54,83,108,.07)}
      .ba-zero-head__icon svg,.ba-zero-close svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      .ba-zero-head__icon{color:inherit}
      .ba-zero-close{color:#5f7486;font-size:24px;line-height:1}
      .ba-zero-head__copy{min-width:0;text-align:center}.ba-zero-head__copy strong{display:block;font-size:14px;line-height:1.25;color:#2c4052}.ba-zero-head__copy small{display:block;margin-top:2px;font-size:10.5px;line-height:1.2;color:#7b8b99;letter-spacing:.035em}
      .ba-zero-scroll{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:18px 15px 110px}
      .ba-zero-wrap{max-width:720px;margin:0 auto}
      .ba-zero-kicker{font-size:10px;font-weight:820;letter-spacing:.14em;color:#6e8499;text-transform:uppercase}
      .ba-zero-title{margin:6px 0 7px;font-size:24px;line-height:1.16;letter-spacing:-.025em;color:#243a4c;font-weight:760}.ba-zero-lead{margin:0;color:#677d90;font-size:12.5px;line-height:1.55}
      .ba-zero-triad{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:15px 0 12px}.ba-zero-chip{padding:9px 9px;border-radius:14px;background:#fff;border:1px solid rgba(70,113,145,.08);box-shadow:0 5px 16px rgba(57,90,116,.045)}.ba-zero-chip small{display:block;font-size:8.5px;font-weight:820;letter-spacing:.10em;color:#8a9aa7}.ba-zero-chip strong{display:block;margin-top:3px;font-size:10.5px;line-height:1.24;color:#445d70;white-space:normal;overflow:visible;text-overflow:clip;min-height:2.48em}
      .ba-zero-notice{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;padding:11px 12px;margin:12px 0;border-radius:17px;background:linear-gradient(135deg,#fffaf0,#fffdf9);border:1px solid rgba(196,145,65,.12)}.ba-zero-notice--info{background:linear-gradient(135deg,#f2f9fd,#f8fcfe);border-color:rgba(48,139,192,.10)}.ba-zero-notice__icon{width:34px;height:34px;border-radius:12px;background:#fff7e6;color:#a87531;display:grid;place-items:center}.ba-zero-notice--info .ba-zero-notice__icon{background:#edf8fd;color:#2a8fc3}.ba-zero-notice__icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ba-zero-notice strong{display:block;font-size:11.8px;line-height:1.35;color:#4b5360}.ba-zero-notice small{display:block;margin-top:3px;font-size:10.7px;line-height:1.48;color:#7a7f87}
      .ba-zero-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:13px 0}.ba-zero-stat{padding:10px 8px;border-radius:15px;background:#fff;border:1px solid rgba(66,107,137,.07);min-width:0}.ba-zero-stat b{display:block;font-size:13px;line-height:1.25;color:#2c526b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-zero-stat span{display:block;margin-top:3px;font-size:9px;line-height:1.25;color:#8796a3}
      .ba-zero-controls{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;margin:14px 0 10px}.ba-zero-select{height:40px;border-radius:13px;border:1px solid rgba(69,111,143,.10);background:#fff;color:#465f73;padding:0 32px 0 11px;font:inherit;font-size:11px;font-weight:680;min-width:0;outline:none}
      .ba-zero-sectionhead{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin:13px 1px 8px}.ba-zero-sectionhead strong{font-size:12.5px;color:#40586b;line-height:1.3}.ba-zero-sectionhead small{font-size:10px;color:#8997a3;white-space:nowrap}
      .ba-zero-list{display:grid;gap:7px}.ba-zero-file{display:grid;grid-template-columns:24px 42px minmax(0,1fr) auto;gap:9px;align-items:center;min-height:68px;padding:9px 10px;border-radius:17px;background:#fff;border:1px solid rgba(70,111,142,.075);box-shadow:0 5px 18px rgba(52,86,111,.035);transition:border-color .15s ease,box-shadow .15s ease,transform .15s ease}.ba-zero-file.is-selected{border-color:rgba(185,132,53,.24);box-shadow:0 7px 20px rgba(135,94,35,.08)}.ba-zero-file input{width:19px;height:19px;margin:0;accent-color:#b07d31}.ba-zero-file__icon{width:42px;height:42px;border-radius:13px;background:linear-gradient(145deg,#f7fbff,#e7eef7);color:#6f8598;display:grid;place-items:center}.ba-zero-file__icon svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ba-zero-file__copy{min-width:0}.ba-zero-file__type{display:inline-block;margin-bottom:3px;padding:2px 6px;border-radius:99px;background:#edf3f9;color:#5e7a95;font-size:8.5px;line-height:1.25;font-weight:800;letter-spacing:.04em;text-transform:uppercase}.ba-zero-file__copy strong{display:block;font-size:11.6px;line-height:1.32;color:#354b5c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-zero-file__copy small{display:block;margin-top:3px;font-size:9.7px;line-height:1.3;color:#8795a1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-zero-file__meta{text-align:right;min-width:68px}.ba-zero-file__meta b{display:block;font-size:10.8px;color:#526a7c}.ba-zero-file__meta small{display:block;margin-top:3px;font-size:9px;color:#939faa;white-space:nowrap}
      .ba-zero-empty,.ba-zero-state{padding:28px 18px;margin-top:16px;border-radius:22px;background:#fff;border:1px solid rgba(67,108,139,.07);text-align:center;box-shadow:0 10px 28px rgba(52,84,108,.045)}.ba-zero-state__icon{width:54px;height:54px;margin:0 auto 12px;border-radius:18px;background:linear-gradient(145deg,#f7fbff,#e8eff7);color:#6d8398;display:grid;place-items:center}.ba-zero-state__icon svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}.ba-zero-state h3,.ba-zero-empty h3{margin:0;font-size:17px;line-height:1.25;color:#30495c}.ba-zero-state p,.ba-zero-empty p{max-width:520px;margin:8px auto 0;font-size:11.5px;line-height:1.55;color:#778b9a}.ba-zero-state__spinner{width:34px;height:34px;margin:0 auto 13px;border-radius:50%;border:3px solid #edf3f8;border-top-color:#7891ad;animation:baZeroSpin .8s linear infinite}
      .ba-zero-primary,.ba-zero-secondary{min-height:44px;border-radius:14px;padding:0 16px;font:inherit;font-size:11.5px;font-weight:760}.ba-zero-primary{background:linear-gradient(135deg,#90a7c1,#6f88a4);color:#fff;box-shadow:0 8px 20px rgba(98,120,146,.18)}.ba-zero-primary:disabled{opacity:.45;box-shadow:none}.ba-zero-secondary{background:#fff;color:#557084;border:1px solid rgba(69,111,143,.12)}.ba-zero-actions{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:15px}
      .ba-zero-selection{position:fixed;z-index:130;left:0;right:0;bottom:0;padding:9px 14px calc(9px + env(safe-area-inset-bottom));background:rgba(249,252,254,.96);border-top:1px solid rgba(63,104,134,.09);backdrop-filter:blur(18px)}.ba-zero-selection__inner{max-width:720px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center}.ba-zero-selection__copy{min-width:0}.ba-zero-selection__copy strong{display:block;font-size:11.7px;color:#40596c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-zero-selection__copy small{display:block;margin-top:2px;font-size:9.3px;color:#8a98a4}
      .ba-zero-confirm-list{display:grid;gap:6px;margin:13px 0}.ba-zero-confirm-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;padding:9px 11px;border-radius:13px;background:#f8fbfd;border:1px solid rgba(68,108,139,.06)}.ba-zero-confirm-item strong{font-size:10.8px;color:#455d70;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-zero-confirm-item span{font-size:10px;color:#778a99;white-space:nowrap}
      .ba-zero-result-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:16px 0}.ba-zero-result-card{padding:12px 8px;border-radius:16px;background:#f7fbfd;border:1px solid rgba(65,111,143,.07)}.ba-zero-result-card b{display:block;font-size:15px;color:#2c5f7c}.ba-zero-result-card span{display:block;margin-top:3px;font-size:9.5px;line-height:1.3;color:#7f909e}
      .ba-zero-inline{margin:9px 1px 0;font-size:10px;line-height:1.45;color:#8a785f}.ba-zero-inline.is-error{color:#a55050}
      @keyframes baZeroSpin{to{transform:rotate(360deg)}}
      @media(max-width:390px){.ba-zero-scroll{padding-left:12px;padding-right:12px}.ba-zero-title{font-size:21px}.ba-zero-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.ba-zero-file{grid-template-columns:22px 38px minmax(0,1fr);gap:8px}.ba-zero-file__icon{width:38px;height:38px}.ba-zero-file__meta{grid-column:3;text-align:left;display:flex;gap:8px;align-items:center}.ba-zero-file__meta small{margin-top:0}.ba-zero-selection__inner{grid-template-columns:minmax(0,1fr) auto}.ba-zero-selection .ba-zero-secondary{display:none}}
      @media(prefers-reduced-motion:reduce){.ba-zero-file{transition:none!important}.ba-zero-state__spinner{animation:none!important}}
      html[data-motion="reduced"] .ba-zero-file{transition:none!important}html[data-motion="reduced"] .ba-zero-state__spinner{animation:none!important}
    `;
    document.head.appendChild(style);
  }

  function ensureToolsGrowth() {
    const tools = byId('toolsScreen');
    if (tools) tools.classList.add('ba-tools-expandable');
  }

  function ensureEntry() {
    ensureToolsGrowth();
    const list = document.querySelector('#toolsScreen .utility-list');
    if (!list) return null;
    let entry = list.querySelector('[data-tool="zero"]');
    if (!entry) {
      entry = document.createElement('button');
      entry.type = 'button';
      entry.dataset.tool = 'zero';
      entry.className = 'ba-zero-entry';
      list.appendChild(entry);
    }
    const anchor = list.querySelector('[data-tool="archives"]') || list.querySelector('[data-tool="installers"]') || list.querySelector('[data-tool="downloads"]');
    if (anchor && anchor.nextElementSibling !== entry) anchor.insertAdjacentElement('afterend', entry);
    else if (!anchor && !entry.isConnected) list.appendChild(entry);
    entry.classList.add('ba-zero-entry');
    updateEntryCopy(entry);
    return entry;
  }

  function updateEntryCopy(entry = document.querySelector('#toolsScreen [data-tool="zero"]')) {
    if (!entry) return;
    const copy = c();
    const summary = parse(NATIVE.getReviewSummary?.(), {});
    const status = summary?.available && Number.isFinite(Number(summary.zeroCount))
      ? `${n(summary.zeroCount)} ${copy.files} · ${formatBytes(summary.zeroBytes)}`
      : copy.toolSub;
    const signature = `${language()}|${copy.toolTitle}|${status}`;
    if (entry.dataset.zeroSignature !== signature) {
      entry.dataset.zeroSignature = signature;
      entry.innerHTML = `<span class="mini-icon ba-zero-tool-icon">${zeroBadge('tool')}</span><span><strong>${esc(copy.toolTitle)}</strong><small>${esc(status)}</small></span><b>›</b>`;
      entry.setAttribute('aria-label', `${copy.toolTitle}. ${status}`);
    }
  }

  function ensureSurface() {
    ensureStyle();
    let surface = byId('baZeroSurface');
    if (surface) return surface;
    surface = document.createElement('section');
    surface.id = 'baZeroSurface';
    surface.className = 'ba-zero-surface';
    surface.hidden = true;
    surface.setAttribute('role', 'dialog');
    surface.setAttribute('aria-modal', 'true');
    surface.setAttribute('aria-labelledby', 'baZeroSurfaceTitle');
    surface.innerHTML = `
      <header class="ba-zero-head">
        <span class="ba-zero-head__icon">${zeroBadge('header')}</span>
        <div class="ba-zero-head__copy"><strong id="baZeroSurfaceTitle"></strong><small>BEARAGNOSTIC · LOCAL REVIEW</small></div>
        <button class="ba-zero-close" type="button" data-zero-action="close" aria-label="Close">×</button>
      </header>
      <div class="ba-zero-scroll"><div class="ba-zero-wrap" id="baZeroContent"></div></div>
      <div id="baZeroSelection"></div>
    `;
    document.body.appendChild(surface);
    bindSurface(surface);
    return surface;
  }

  function baseIntro() {
    const copy = c();
    return `<div class="ba-zero-kicker">${esc(copy.kicker)}</div><h2 class="ba-zero-title">${esc(copy.title)}</h2><p class="ba-zero-lead">${esc(copy.lead)}</p>`;
  }

  function triad() {
    const copy = c();
    const custom = state.summary?.scanMode === 'custom';
    return `<div class="ba-zero-triad">
      <div class="ba-zero-chip"><small>${esc(copy.source)}</small><strong>${esc(copy.sourceSnapshot)}</strong></div>
      <div class="ba-zero-chip"><small>${esc(copy.coverage)}</small><strong>${esc(custom ? copy.customCoverage : copy.fullCoverage)}</strong></div>
      <div class="ba-zero-chip"><small>${esc(copy.safety)}</small><strong>${esc(copy.reviewFirst)}</strong></div>
    </div>`;
  }

  function stateCard(iconName, title, body, actions = '') {
    return `<div class="ba-zero-state"><span class="ba-zero-state__icon">${icon(iconName)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p>${actions ? `<div class="ba-zero-actions">${actions}</div>` : ''}</div>`;
  }

  function renderAccess() {
    const copy = c();
    return `${baseIntro()}${stateCard('shield', copy.accessTitle, copy.accessBody, `<button class="ba-zero-primary" type="button" data-zero-action="permission">${esc(copy.openSettings)}</button>`)}`;
  }

  function renderNoSnapshot() {
    const copy = c();
    return `${baseIntro()}${stateCard('zero', copy.noSnapshotTitle, copy.noSnapshotBody, `<button class="ba-zero-primary" type="button" data-zero-action="scan">${esc(copy.runQuick)}</button>`)}`;
  }

  function renderScanning() {
    const copy = c();
    return `${baseIntro()}<div class="ba-zero-state"><div class="ba-zero-state__spinner" aria-hidden="true"></div><h3>${esc(copy.scanningTitle)}</h3><p>${esc(copy.scanningBody)}</p><p>${esc(copy.scanningHint)}</p></div>`;
  }

  function renderError() {
    const copy = c();
    return `${baseIntro()}${stateCard('warning', copy.errorTitle, state.error || copy.scanFailed, `<button class="ba-zero-primary" type="button" data-zero-action="retry">${esc(copy.retry)}</button>`)}`;
  }

  function renderEmpty() {
    const copy = c();
    const custom = state.summary?.scanMode === 'custom';
    const customNotice = custom ? `<div class="ba-zero-notice ba-zero-notice--info"><span class="ba-zero-notice__icon">${icon('zero')}</span><div><strong>${esc(copy.customTitle)}</strong><small>${esc(copy.customBody)}</small><div class="ba-zero-actions" style="justify-content:flex-start;margin-top:8px"><button class="ba-zero-secondary" type="button" data-zero-action="scan">${esc(copy.checkAll)}</button></div></div></div>` : '';
    const partialState = state.summary?.detailsTruncated
      ? stateCard('warning', copy.partialTitle, copy.partialBody, `<button class="ba-zero-secondary" type="button" data-zero-action="scan">${esc(copy.refresh)}</button>`)
      : stateCard('zero', copy.noFilesTitle, copy.noFilesBody, `<button class="ba-zero-secondary" type="button" data-zero-action="scan">${esc(copy.refresh)}</button>`);
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
    const aggregateCount = Number.isFinite(Number(state.summary?.zeroCount)) ? n(state.summary.zeroCount) : allVisible.length;
    const aggregateBytes = Number.isFinite(Number(state.summary?.zeroBytes)) ? n(state.summary.zeroBytes) : totalBytes;
    const typeCount = new Set(allVisible.map((item) => zeroKind(item))).size;
    const custom = state.summary?.scanMode === 'custom';
    const stale = !isFresh();
    const hiddenNotice = HIDDEN?.isEnabled && !HIDDEN.isEnabled()
      ? `<div class="ba-zero-inline">${esc(copy.hiddenOff)}</div>` : '';
    const partial = state.summary?.detailsTruncated
      ? `<div class="ba-zero-notice"><span class="ba-zero-notice__icon">${icon('warning')}</span><div><strong>${esc(copy.partialTitle)}</strong><small>${esc(copy.partialBody)}</small></div></div>` : '';
    const customNotice = custom
      ? `<div class="ba-zero-notice ba-zero-notice--info"><span class="ba-zero-notice__icon">${icon('zero')}</span><div><strong>${esc(copy.customTitle)}</strong><small>${esc(copy.customBody)}</small><div class="ba-zero-actions" style="justify-content:flex-start;margin-top:8px"><button class="ba-zero-secondary" type="button" data-zero-action="scan">${esc(copy.checkAll)}</button></div></div></div>` : '';
    const staleNotice = stale
      ? `<div class="ba-zero-notice"><span class="ba-zero-notice__icon">${icon('refresh')}</span><div><strong>${esc(copy.staleTitle)}</strong><small>${esc(copy.staleBody)}</small><div class="ba-zero-actions" style="justify-content:flex-start;margin-top:8px"><button class="ba-zero-secondary" type="button" data-zero-action="scan">${esc(copy.refresh)}</button></div></div></div>` : '';
    const runningNotice = state.scannerRunning
      ? `<div class="ba-zero-notice ba-zero-notice--info"><span class="ba-zero-notice__icon">${icon('refresh')}</span><div><strong>${esc(copy.scanningTitle)}</strong><small>${esc(copy.anotherScan)}</small></div></div>` : '';
    const rows = items.length ? items.map((item) => {
      const kind = zeroKind(item);
      const checked = state.selected.has(item.id);
      return `<label class="ba-zero-file${checked ? ' is-selected' : ''}" data-kind="${esc(kind)}">
        <input type="checkbox" data-zero-id="${esc(item.id)}"${checked ? ' checked' : ''}${state.scannerRunning ? ' disabled' : ''}>
        <span class="ba-zero-file__icon">${icon('file')}</span>
        <span class="ba-zero-file__copy"><span class="ba-zero-file__type">${esc(kindLabel(kind))}</span><strong>${esc(item.name || '(unnamed)')}</strong><small>${esc(locationLabel(item))}</small></span>
        <span class="ba-zero-file__meta"><b>${esc(formatBytes(item.sizeBytes))}</b><small>${esc(ageLabel(item.modifiedMs))}</small></span>
      </label>`;
    }).join('') : `<div class="ba-zero-empty"><h3>${esc(copy.noFilter)}</h3></div>`;
    return `${baseIntro()}${triad()}
      <div class="ba-zero-stats">
        <div class="ba-zero-stat"><b>${aggregateCount}</b><span>${esc(copy.files)}</span></div>
        <div class="ba-zero-stat"><b>${esc(formatBytes(aggregateBytes))}</b><span>${esc(copy.totalSize)}</span></div>
        <div class="ba-zero-stat"><b>${typeCount}</b><span>${esc(language() === 'th' ? 'ประเภท' : language() === 'ja' ? '種類' : 'Types')}</span></div>
        <div class="ba-zero-stat"><b>${esc(checkedLabel(state.summary?.generatedAtMs))}</b><span>${esc(copy.checked)}</span></div>
      </div>
      <div class="ba-zero-notice"><span class="ba-zero-notice__icon">${icon('warning')}</span><div><strong>${esc(copy.cautionTitle)}</strong><small>${esc(copy.cautionBody)}</small></div></div>
      ${runningNotice}${staleNotice}${partial}${customNotice}${hiddenNotice}
      <div class="ba-zero-controls">
        <select class="ba-zero-select" data-zero-control="filter" aria-label="Filter">
          <option value="all"${state.filter === 'all' ? ' selected' : ''}>${esc(copy.filterAll)}</option>
          <option value="documents"${state.filter === 'documents' ? ' selected' : ''}>${esc(copy.filterDocuments)}</option>
          <option value="media"${state.filter === 'media' ? ' selected' : ''}>${esc(copy.filterMedia)}</option>
          <option value="apk"${state.filter === 'apk' ? ' selected' : ''}>${esc(copy.filterApk)}</option>
          <option value="archives"${state.filter === 'archives' ? ' selected' : ''}>${esc(copy.filterArchives)}</option>
          <option value="other"${state.filter === 'other' ? ' selected' : ''}>${esc(copy.filterOther)}</option>
        </select>
        <select class="ba-zero-select" data-zero-control="sort" aria-label="Sort">
          <option value="newest"${state.sort === 'newest' ? ' selected' : ''}>${esc(copy.sortNewest)}</option>
          <option value="oldest"${state.sort === 'oldest' ? ' selected' : ''}>${esc(copy.sortOldest)}</option>
          <option value="name"${state.sort === 'name' ? ' selected' : ''}>${esc(copy.sortName)}</option>
          <option value="location"${state.sort === 'location' ? ' selected' : ''}>${esc(copy.sortLocation)}</option>
        </select>
      </div>
      <div class="ba-zero-sectionhead"><strong>${esc(copy.selectionTitle)}</strong><small>${esc(copy.showing.replace('{shown}', items.length).replace('{total}', filteredItems.length))}</small></div>
      <div class="ba-zero-list">${rows}</div>
      ${items.length < filteredItems.length ? `<div class="ba-zero-actions"><button class="ba-zero-secondary" type="button" data-zero-action="more">${esc(copy.showMore)} · ${filteredItems.length - items.length}</button></div>` : ''}
      ${state.message ? `<div class="ba-zero-inline${state.message === copy.limitReached ? ' is-error' : ''}">${esc(state.message)}</div>` : ''}`;
  }

  function renderConfirm() {
    const copy = c();
    const chosen = selectedItems();
    const bytes = chosen.reduce((sum, item) => sum + n(item.sizeBytes), 0);
    const preview = chosen.slice(0, 8).map((item) => `<div class="ba-zero-confirm-item"><strong>${esc(item.name || '(unnamed)')}</strong><span>${esc(formatBytes(item.sizeBytes))}</span></div>`).join('');
    const remaining = chosen.length > 8 ? `<div class="ba-zero-inline">+${chosen.length - 8}</div>` : '';
    return `<div class="ba-zero-kicker">${esc(copy.finalKicker)}</div><h2 class="ba-zero-title">${esc(copy.finalTitle)}</h2><p class="ba-zero-lead">${esc(copy.finalBody)}</p>
      <div class="ba-zero-result-grid">
        <div class="ba-zero-result-card"><b>${chosen.length}</b><span>${esc(copy.selectedFiles)}</span></div>
        <div class="ba-zero-result-card"><b>${esc(formatBytes(bytes))}</b><span>${esc(copy.selectedBytes)}</span></div>
        <div class="ba-zero-result-card"><b>${isFresh() ? 'LIVE' : 'STALE'}</b><span>${esc(copy.safety)}</span></div>
      </div>
      <div class="ba-zero-notice"><span class="ba-zero-notice__icon">${icon('shield')}</span><div><strong>${esc(copy.reviewFirst)}</strong><small>${esc(copy.protection)}</small></div></div>
      <div class="ba-zero-confirm-list">${preview}${remaining}</div>
      <div class="ba-zero-inline">${esc(copy.limit)}</div>
      <div class="ba-zero-actions">
        <button class="ba-zero-secondary" type="button" data-zero-action="back">${esc(copy.back)}</button>
        <button class="ba-zero-primary" type="button" data-zero-action="delete"${!chosen.length || !isFresh() || state.scannerRunning ? ' disabled' : ''}>${esc(copy.deleteVerify)}</button>
      </div>`;
  }

  function renderDeleting() {
    const copy = c();
    return `${baseIntro()}<div class="ba-zero-state"><div class="ba-zero-state__spinner" aria-hidden="true"></div><h3>${esc(copy.deleting)}</h3><p>${esc(copy.resultBody)}</p></div>`;
  }

  function renderResult() {
    const copy = c();
    const result = state.result || {};
    const failedCount = Array.isArray(result.failed) ? result.failed.length : 0;
    const protectedCount = Array.isArray(result.protectedIds) ? result.protectedIds.length : 0;
    return `<div class="ba-zero-kicker">${esc(copy.resultKicker)}</div><h2 class="ba-zero-title">${esc(copy.resultTitle)}</h2><p class="ba-zero-lead">${esc(copy.resultBody)}</p>
      <div class="ba-zero-result-grid">
        <div class="ba-zero-result-card"><b>${esc(formatBytes(result.reclaimedBytes))}</b><span>${esc(copy.reclaimed)}</span></div>
        <div class="ba-zero-result-card"><b>${n(result.deletedCount)}</b><span>${esc(copy.removed)}</span></div>
        <div class="ba-zero-result-card"><b>${protectedCount}</b><span>${esc(copy.protected)}</span></div>
      </div>
      ${failedCount ? `<div class="ba-zero-notice"><span class="ba-zero-notice__icon">${icon('warning')}</span><div><strong>${failedCount} ${esc(copy.failed)}</strong><small>${esc(copy.resultBody)}</small></div></div>` : ''}
      <div class="ba-zero-actions">
        <button class="ba-zero-secondary" type="button" data-zero-action="remaining">${esc(copy.reviewRemaining)}</button>
        <button class="ba-zero-primary" type="button" data-zero-action="close">${esc(copy.done)}</button>
      </div>`;
  }

  function renderSelection() {
    const host = byId('baZeroSelection');
    if (!host) return;
    const copy = c();
    const chosen = selectedItems();
    if (!state.open || state.view !== 'results' || !state.summary?.available || state.items.length === 0) {
      host.innerHTML = '';
      return;
    }
    const bytes = chosen.reduce((sum, item) => sum + n(item.sizeBytes), 0);
    host.innerHTML = `<div class="ba-zero-selection"><div class="ba-zero-selection__inner">
      <div class="ba-zero-selection__copy"><strong>${esc(copy.selected.replace('{count}', chosen.length).replace('{bytes}', formatBytes(bytes)))}</strong><small>${esc(copy.limit)}</small></div>
      <button class="ba-zero-secondary" type="button" data-zero-action="clear"${chosen.length ? '' : ' disabled'}>${esc(copy.clear)}</button>
      <button class="ba-zero-primary" type="button" data-zero-action="review"${chosen.length && isFresh() && !state.scannerRunning ? '' : ' disabled'}>${esc(copy.reviewSelected)}</button>
    </div></div>`;
  }

  function render() {
    const surface = ensureSurface();
    const title = byId('baZeroSurfaceTitle');
    if (title) title.textContent = c().toolTitle;
    const close = surface.querySelector('[data-zero-action="close"]');
    if (close) close.setAttribute('aria-label', c().close);
    const host = byId('baZeroContent');
    if (!host) return;

    if (state.loading) host.innerHTML = `${baseIntro()}<div class="ba-zero-state"><div class="ba-zero-state__spinner"></div></div>`;
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
      if (target?.matches?.('[data-zero-control="filter"]')) {
        state.filter = target.value || 'all';
        state.renderLimit = RENDER_BATCH;
        render();
        return;
      }
      if (target?.matches?.('[data-zero-control="sort"]')) {
        state.sort = target.value || 'newest';
        state.renderLimit = RENDER_BATCH;
        render();
        return;
      }
      if (target?.matches?.('[data-zero-id]')) {
        toggleSelection(target.dataset.zeroId, Boolean(target.checked));
      }
    });

    surface.addEventListener('click', async (event) => {
      const button = event.target?.closest?.('[data-zero-action]');
      if (!button) return;
      const action = button.dataset.zeroAction;
      if (action === 'close') close();
      else if (action === 'permission') {
        try { NATIVE.requestBroadStorageAccess?.(); } catch (_) {}
      } else if (action === 'scan') startQuickScan();
      else if (action === 'retry') await refresh();
      else if (action === 'clear') { state.selected.clear(); state.message = ''; render(); }
      else if (action === 'more') { state.renderLimit += RENDER_BATCH; render(); }
      else if (action === 'review') {
        if (selectedItems().length && isFresh() && !state.scannerRunning) { state.view = 'confirm'; render(); surface.querySelector('.ba-zero-scroll')?.scrollTo?.({top: 0}); }
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
    document.body.classList.add('ba-zero-open');
    await refresh();
    window.requestAnimationFrame(() => surface.querySelector('[data-zero-action="close"]')?.focus?.());
  }

  function close() {
    const surface = byId('baZeroSurface');
    state.open = false;
    stopPolling();
    if (surface) surface.hidden = true;
    document.body.classList.remove('ba-zero-open');
    state.selected.clear();
    state.message = '';
    state.error = '';
    updateEntryCopy();
    document.querySelector('#toolsScreen [data-tool="zero"]')?.focus?.();
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
    const trigger = event.target?.closest?.('[data-tool="zero"]');
    if (!trigger || trigger.closest('#baZeroSurface')) return;
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

  window.BearagnosticZeroFiles = Object.freeze({
    build: BUILD,
    open,
    close,
    refresh: () => refresh(),
    category: CATEGORY
  });
})();
