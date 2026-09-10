(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const BUILD = 30;
  const MAX_BATCH = 500;
  const STALE_REVIEW_MS = 15 * 60 * 1000;
  const POLL_MS = 350;

  const byId = (id) => document.getElementById(id);
  const parse = (value, fallback={}) => {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  };
  const safeNumber = (value) => Math.max(0, Number(value) || 0);

  const ICONS = Object.freeze({
    clean: '<path d="M4 15.5 10.5 9l4.5 4.5L8.5 20H4z"/><path d="m13.5 6.5 1-2.5 1 2.5L18 7.5l-2.5 1-1 2.5-1-2.5-2.5-1z"/><path d="m19 13 .7-1.7.8 1.7 1.7.8-1.7.7-.8 1.8-.7-1.8-1.8-.7z"/>',
    shield: '<path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6Z"/><path d="m9 12 2 2 4-4"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>',
    file: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  });

  const COPY = {
    en: {
      kicker: 'QUICK CLEAN', title: 'Clean the low-risk clutter first',
      lead: 'Bearagnostic shows only cleanup candidates that already meet its low-risk rules. You stay in control before anything is removed.',
      noSnapshotTitle: 'Run a Smart Checkup first',
      noSnapshotBody: 'Quick Clean uses the latest real review snapshot. A Smart Checkup creates that snapshot locally without deleting anything.',
      scanNow: 'Run Smart Checkup', permissionTitle: 'Storage access is needed',
      permissionBody: 'Android controls access to shared storage. Bearagnostic cannot review cleanup candidates until that permission is available.',
      openSettings: 'Open Android settings', scanningTitle: 'Checking for safe cleanup candidates',
      scanningBody: 'Smart Checkup is running on this device. No artificial waiting is added; this finishes when the real scan work finishes.',
      scanElsewhere: 'A checkup is already running. Quick Clean will use its verified review snapshot when it finishes.',
      liveSource: 'SOURCE', liveSourceSmart: 'Live Smart Checkup', liveSourceActive: 'Active checkup', snapshotSource: 'RESULT SOURCE',
      scopeLabel: 'SCOPE', scopeAccessible: 'Accessible shared storage', scopeCustom: 'Selected Custom Scan scope', safetyLabel: 'SAFETY', lowRiskOnly: 'Low-risk only',
      phasePreparing: 'Discovering storage', phaseDetails: 'Reviewing file details', phaseSizes: 'Measuring file sizes', phaseDuplicates: 'Verifying duplicates', phaseDates: 'Checking modified dates', phaseFinalizing: 'Building safe results',
      filesReviewedLive: 'Files reviewed', foldersVisited: 'Folders visited', dataSeen: 'Data seen', contentSampled: 'Content sampled', storageMeasured: 'Storage measured', verificationRead: 'Verification read', localLive: 'LOCAL · LIVE', nowChecking: 'Now checking', waitingItem: 'Preparing the next item…',
      realWorkNote: 'This view follows the scan’s real work. It finishes when that work finishes — no padded waiting.',
      emptyKicker: 'QUICK CLEAN RESULT', lowRiskResult: 'Low-risk result', checkedAt: 'Checked', zeroItems: '0 items',
      reviewFirstTitle: 'Review-first opportunities', reviewFirstBody: 'These stay separate because they need your judgement before anything is removed.',
      duplicatesNext: 'Duplicates', largeNext: 'Large files', olderNext: 'Older files', reviewCount: '{count} to review', noneReviewFirst: 'No duplicate, large-file or older-file review items were surfaced in this snapshot.', openReview: 'Review', checkAgain: 'Check again',
      safeItems: 'Safe candidates', reclaimable: 'Selected size', fromCheckup: 'Review snapshot',
      current: 'Current', refreshRecommended: 'Refresh recommended', minutesAgo: 'min ago', justNow: 'just now',
      safeTitle: 'Safety boundary',
      safeBody: 'Quick Clean includes only low-risk candidates. Large files, older files, APKs, archives and exact duplicates stay out of this one-tap cleanup list.',
      selectAll: 'Select all shown', clear: 'Clear', selected: 'selected', of: 'of',
      safeBadge: 'SAFE TO CLEAN', staleReason: 'Stale incomplete download', genericReason: 'Low-risk cleanup candidate',
      partialList: 'Showing the first {shown} of {total} safe candidates. Clean this batch, then continue with the remaining items.',
      truncated: 'The scanner reached its review-detail safety limit. Only candidates present in this verified snapshot are shown.',
      noCandidatesTitle: 'Nothing low-risk needs cleaning',
      noCandidatesBody: 'Bearagnostic found no items that meet the Quick Clean safety rules. Review-first categories remain separate so nothing ambiguous is deleted here.',
      refresh: 'Refresh Smart Checkup', close: 'Close', reviewSelected: 'Review selected',
      staleBlockTitle: 'Refresh before deleting',
      staleBlockBody: 'This review snapshot is more than 15 minutes old. Run a fresh Smart Checkup before deleting so the decision is based on current files.',
      confirmKicker: 'FINAL REVIEW', confirmTitle: 'Delete the selected files?',
      confirmBody: 'Only the selected low-risk files from the current review snapshot will be sent to Android for permanent deletion. This cannot be undone.',
      proof: 'Space is counted only after Android confirms each file is actually gone.',
      cancel: 'Cancel', deleteVerify: 'Delete & verify', deleting: 'Deleting and verifying…',
      doneKicker: 'VERIFIED CLEANUP', doneTitle: 'Cleanup complete',
      reclaimed: 'reclaimed', removed: 'files removed', verifiedBody: 'Only successfully verified deletions are included in the result.',
      failedTitle: 'Some files were not removed', failedBody: '{count} item(s) could not be deleted and were not counted as reclaimed space.',
      protectedTitle: 'Safety protection applied', protectedBody: '{count} item(s) were retained by native safeguards.',
      reviewRemaining: 'Review remaining', done: 'Done',
      errorTitle: 'Quick Clean could not continue', retry: 'Try again',
      noAccess: 'Storage access is still unavailable.', scanFailed: 'Smart Checkup could not start.',
      scanModeSmart: 'Smart Checkup', scanModeQuick: 'Quick Scan', scanModeDeep: 'Deep Scan', scanModeCustom: 'Custom Scan',
      homeReady: '{count} safe candidates ready', homeClear: 'No low-risk cleanup waiting', homeReadyShort: '{count} safe · review', homeClearShort: 'No safe clutter',
      itemAge: '{age}', unknownLocation: 'Shared storage', selectedSummary: '{count} selected · {bytes}',
      pageLimit: 'Up to 500 files can be deleted in one reviewed batch.',
    },
    th: {
      kicker: 'ทำความสะอาดด่วน', title: 'เริ่มจากไฟล์ที่เสี่ยงต่ำก่อน',
      lead: 'Bearagnostic จะแสดงเฉพาะรายการที่ผ่านกฎความเสี่ยงต่ำของระบบแล้ว และคุณยังเป็นคนตัดสินใจก่อนลบทุกครั้ง',
      noSnapshotTitle: 'ตรวจด้วย Smart Checkup ก่อน',
      noSnapshotBody: 'Quick Clean ใช้รายการตรวจล่าสุดจากการสแกนจริง Smart Checkup จะสร้างรายการนี้ภายในเครื่องโดยยังไม่ลบอะไร',
      scanNow: 'เริ่ม Smart Checkup', permissionTitle: 'ต้องอนุญาตการเข้าถึงพื้นที่จัดเก็บ',
      permissionBody: 'Android เป็นผู้ควบคุมสิทธิ์เข้าถึง shared storage และ Bearagnostic จะยังตรวจรายการทำความสะอาดไม่ได้จนกว่าจะได้รับสิทธิ์',
      openSettings: 'เปิดการตั้งค่า Android', scanningTitle: 'กำลังหารายการที่เหมาะกับ Quick Clean',
      scanningBody: 'Smart Checkup กำลังตรวจบนเครื่องนี้ ไม่มีการหน่วงเวลาเพื่อให้ดูนาน ระบบจะจบเมื่อการตรวจจริงเสร็จ',
      scanElsewhere: 'มีการตรวจเครื่องทำงานอยู่แล้ว Quick Clean จะใช้รายการตรวจจริงเมื่อการสแกนเสร็จ',
      liveSource: 'แหล่งข้อมูล', liveSourceSmart: 'Smart Checkup ที่กำลังทำงาน', liveSourceActive: 'การตรวจที่กำลังทำงาน', snapshotSource: 'แหล่งผลลัพธ์',
      scopeLabel: 'ขอบเขต', scopeAccessible: 'shared storage ที่เข้าถึงได้', scopeCustom: 'ขอบเขต Custom Scan ที่เลือก', safetyLabel: 'ความปลอดภัย', lowRiskOnly: 'เฉพาะความเสี่ยงต่ำ',
      phasePreparing: 'กำลังค้นหาพื้นที่จัดเก็บ', phaseDetails: 'กำลังตรวจรายละเอียดไฟล์', phaseSizes: 'กำลังวัดขนาดไฟล์', phaseDuplicates: 'กำลังยืนยันไฟล์ซ้ำ', phaseDates: 'กำลังตรวจวันที่แก้ไข', phaseFinalizing: 'กำลังสร้างผลลัพธ์ที่ปลอดภัย',
      filesReviewedLive: 'ไฟล์ที่ตรวจแล้ว', foldersVisited: 'โฟลเดอร์ที่ตรวจ', dataSeen: 'ข้อมูลที่พบ', contentSampled: 'เนื้อหาที่อ่านตัวอย่าง', storageMeasured: 'พื้นที่ที่วัดแล้ว', verificationRead: 'ข้อมูลที่อ่านเพื่อยืนยัน', localLive: 'บนเครื่อง · เรียลไทม์', nowChecking: 'กำลังตรวจ', waitingItem: 'กำลังเตรียมรายการถัดไป…',
      realWorkNote: 'หน้านี้แสดงงานจากการสแกนจริง และจะจบเมื่องานจริงเสร็จ ไม่มีการหน่วงเวลาเพื่อให้ดูนาน',
      emptyKicker: 'ผล QUICK CLEAN', lowRiskResult: 'ผลความเสี่ยงต่ำ', checkedAt: 'ตรวจเมื่อ', zeroItems: '0 รายการ',
      reviewFirstTitle: 'รายการที่ควรตรวจต่อ', reviewFirstBody: 'รายการเหล่านี้ถูกแยกไว้ เพราะต้องให้คุณพิจารณาก่อนมีการลบ',
      duplicatesNext: 'ไฟล์ซ้ำ', largeNext: 'ไฟล์ขนาดใหญ่', olderNext: 'ไฟล์เก่า', reviewCount: '{count} รายการให้ตรวจ', noneReviewFirst: 'ไม่พบไฟล์ซ้ำ ไฟล์ขนาดใหญ่ หรือไฟล์เก่าที่ต้องตรวจต่อใน snapshot นี้', openReview: 'ตรวจรายการ', checkAgain: 'ตรวจอีกครั้ง',
      safeItems: 'รายการเสี่ยงต่ำ', reclaimable: 'ขนาดที่เลือก', fromCheckup: 'ข้อมูลจากการตรวจ',
      current: 'ล่าสุด', refreshRecommended: 'แนะนำให้ตรวจใหม่', minutesAgo: 'นาทีที่แล้ว', justNow: 'เมื่อสักครู่',
      safeTitle: 'ขอบเขตความปลอดภัย',
      safeBody: 'Quick Clean รับเฉพาะรายการความเสี่ยงต่ำ ไฟล์ขนาดใหญ่ ไฟล์เก่า APK ไฟล์บีบอัด และไฟล์ซ้ำแบบ exact จะไม่ถูกรวมไว้ในรายการลบด่วนนี้',
      selectAll: 'เลือกทั้งหมดที่แสดง', clear: 'ล้างที่เลือก', selected: 'เลือกแล้ว', of: 'จาก',
      safeBadge: 'ปลอดภัยระดับต่ำ', staleReason: 'ไฟล์ดาวน์โหลดไม่สมบูรณ์ที่ค้างไว้นาน', genericReason: 'รายการทำความสะอาดความเสี่ยงต่ำ',
      partialList: 'กำลังแสดง {shown} จาก {total} รายการความเสี่ยงต่ำ ทำความสะอาดชุดนี้ก่อน แล้วจึงจัดการรายการที่เหลือต่อได้',
      truncated: 'ตัวสแกนแตะขีดจำกัดรายละเอียดเพื่อความปลอดภัย จะแสดงเฉพาะรายการที่อยู่ใน snapshot ที่ยืนยันแล้วนี้เท่านั้น',
      noCandidatesTitle: 'ยังไม่มีรายการความเสี่ยงต่ำที่ต้องลบ',
      noCandidatesBody: 'Bearagnostic ไม่พบรายการที่ผ่านกฎ Quick Clean ในรอบนี้ หมวดที่ต้องพิจารณาก่อนจะถูกแยกไว้ต่างหาก เพื่อไม่ให้ไฟล์ที่กำกวมถูกลบจากหน้านี้',
      refresh: 'ตรวจ Smart Checkup ใหม่', close: 'ปิด', reviewSelected: 'ตรวจรายการที่เลือก',
      staleBlockTitle: 'ตรวจใหม่ก่อนลบ',
      staleBlockBody: 'รายการตรวจนี้เกิน 15 นาทีแล้ว ให้ทำ Smart Checkup ใหม่ก่อนลบ เพื่อให้การตัดสินใจอ้างอิงไฟล์ปัจจุบัน',
      confirmKicker: 'ตรวจครั้งสุดท้าย', confirmTitle: 'ลบไฟล์ที่เลือก?',
      confirmBody: 'เฉพาะไฟล์ความเสี่ยงต่ำที่คุณเลือกจากรายการตรวจปัจจุบันเท่านั้นที่จะถูกส่งให้ Android ลบแบบถาวร การลบนี้ย้อนกลับไม่ได้',
      proof: 'พื้นที่จะถูกนับคืนก็ต่อเมื่อ Android ยืนยันแล้วว่าไฟล์นั้นหายจริง',
      cancel: 'ยกเลิก', deleteVerify: 'ลบและตรวจยืนยัน', deleting: 'กำลังลบและตรวจยืนยัน…',
      doneKicker: 'ผลการลบที่ยืนยันแล้ว', doneTitle: 'ทำความสะอาดเรียบร้อย',
      reclaimed: 'พื้นที่ที่คืนได้', removed: 'ไฟล์ที่ลบแล้ว', verifiedBody: 'ผลลัพธ์นับเฉพาะไฟล์ที่ลบสำเร็จและตรวจยืนยันแล้วเท่านั้น',
      failedTitle: 'มีบางไฟล์ที่ลบไม่สำเร็จ', failedBody: 'ลบไม่สำเร็จ {count} รายการ และจะไม่นับพื้นที่ของรายการเหล่านี้เป็นพื้นที่ที่คืนได้',
      protectedTitle: 'ระบบความปลอดภัยทำงาน', protectedBody: 'มี {count} รายการที่ระบบ Native เก็บไว้ตามกฎป้องกันการลบ',
      reviewRemaining: 'ดูรายการที่เหลือ', done: 'เสร็จสิ้น',
      errorTitle: 'Quick Clean ทำงานต่อไม่ได้', retry: 'ลองอีกครั้ง',
      noAccess: 'ยังไม่มีสิทธิ์เข้าถึงพื้นที่จัดเก็บ', scanFailed: 'ไม่สามารถเริ่ม Smart Checkup ได้',
      scanModeSmart: 'Smart Checkup', scanModeQuick: 'Quick Scan', scanModeDeep: 'Deep Scan', scanModeCustom: 'Custom Scan',
      homeReady: 'มี {count} รายการเสี่ยงต่ำพร้อมตรวจ', homeClear: 'ไม่มีรายการความเสี่ยงต่ำค้างอยู่', homeReadyShort: '{count} รายการ · ตรวจ', homeClearShort: 'ไม่มีไฟล์เสี่ยงต่ำ',
      itemAge: '{age}', unknownLocation: 'พื้นที่จัดเก็บร่วม', selectedSummary: 'เลือก {count} รายการ · {bytes}',
      pageLimit: 'หนึ่งรอบที่ตรวจแล้วสามารถลบได้สูงสุด 500 ไฟล์',
    },
    ja: {
      kicker: 'クイッククリーン', title: '低リスクの不要候補から整理',
      lead: 'Bearagnostic の低リスク規則を満たした候補だけを表示します。削除前の最終判断は常にあなたが行います。',
      noSnapshotTitle: 'まず Smart Checkup を実行',
      noSnapshotBody: 'Quick Clean は最新の実スキャンによるレビュースナップショットを使います。Smart Checkup は端末内で候補を作成し、この時点では何も削除しません。',
      scanNow: 'Smart Checkup を実行', permissionTitle: 'ストレージへのアクセスが必要です',
      permissionBody: '共有ストレージへのアクセスは Android が管理します。権限がない状態では cleanup 候補を確認できません。',
      openSettings: 'Android 設定を開く', scanningTitle: '安全に整理できる候補を確認中',
      scanningBody: 'Smart Checkup を端末内で実行しています。見せかけの待ち時間は追加せず、実際の処理が終わると完了します。',
      scanElsewhere: 'チェックはすでに実行中です。完了後の検証済みレビュースナップショットを Quick Clean が使用します。',
      liveSource: 'ソース', liveSourceSmart: '実行中の Smart Checkup', liveSourceActive: '実行中のチェック', snapshotSource: '結果ソース',
      scopeLabel: '範囲', scopeAccessible: 'アクセス可能な共有ストレージ', scopeCustom: '選択した Custom Scan 範囲', safetyLabel: '安全性', lowRiskOnly: '低リスクのみ',
      phasePreparing: 'ストレージを探索中', phaseDetails: 'ファイル情報を確認中', phaseSizes: 'ファイルサイズを確認中', phaseDuplicates: '重複を検証中', phaseDates: '更新日を確認中', phaseFinalizing: '安全な結果を作成中',
      filesReviewedLive: '確認済みファイル', foldersVisited: '確認フォルダ', dataSeen: '確認データ', contentSampled: 'サンプル読取量', storageMeasured: '計測済み容量', verificationRead: '検証読取量', localLive: '端末内 · リアルタイム', nowChecking: '確認中', waitingItem: '次の項目を準備中…',
      realWorkNote: 'この画面は実際のスキャン処理に連動します。見せかけの待ち時間は追加しません。',
      emptyKicker: 'QUICK CLEAN 結果', lowRiskResult: '低リスク結果', checkedAt: '確認時刻', zeroItems: '0 件',
      reviewFirstTitle: '確認が必要な候補', reviewFirstBody: '削除前に判断が必要なため、Quick Clean とは分けて表示します。',
      duplicatesNext: '重複ファイル', largeNext: '大きいファイル', olderNext: '古いファイル', reviewCount: '{count} 件を確認', noneReviewFirst: 'このスナップショットでは重複・大容量・古いファイルの確認候補もありません。', openReview: '確認', checkAgain: '再チェック',
      safeItems: '低リスク候補', reclaimable: '選択サイズ', fromCheckup: 'レビュースナップショット',
      current: '最新', refreshRecommended: '再チェック推奨', minutesAgo: '分前', justNow: 'たった今',
      safeTitle: '安全境界',
      safeBody: 'Quick Clean は低リスク候補だけを扱います。大容量、古いファイル、APK、アーカイブ、完全一致重複はこの一括整理リストに含めません。',
      selectAll: '表示分をすべて選択', clear: '選択解除', selected: '選択', of: '/',
      safeBadge: '低リスク', staleReason: '古い未完了ダウンロード', genericReason: '低リスク cleanup 候補',
      partialList: '{total} 件中、最初の {shown} 件を表示しています。このバッチを整理した後、残りを続けられます。',
      truncated: '安全のためレビュー詳細上限に達しました。この検証済みスナップショット内の候補だけを表示します。',
      noCandidatesTitle: '低リスクで整理できる項目はありません',
      noCandidatesBody: '今回の Quick Clean 規則を満たす候補は見つかりませんでした。判断が必要なカテゴリは別に残し、ここでは曖昧なファイルを削除しません。',
      refresh: 'Smart Checkup を更新', close: '閉じる', reviewSelected: '選択内容を確認',
      staleBlockTitle: '削除前に再チェック',
      staleBlockBody: 'このレビュースナップショットは15分以上前のものです。現在のファイルに基づいて判断するため、削除前に Smart Checkup を更新してください。',
      confirmKicker: '最終確認', confirmTitle: '選択したファイルを削除しますか？',
      confirmBody: '現在のレビュースナップショットから選択した低リスクファイルだけを Android に送り、完全に削除します。元に戻せません。',
      proof: 'Android が実際に削除を確認したファイルだけ、空き容量として計上します。',
      cancel: 'キャンセル', deleteVerify: '削除して検証', deleting: '削除して確認中…',
      doneKicker: '検証済みクリーンアップ', doneTitle: 'クリーンアップ完了',
      reclaimed: '解放', removed: '削除済みファイル', verifiedBody: '削除成功を確認できたファイルだけを結果に含めています。',
      failedTitle: '削除できなかったファイルがあります', failedBody: '{count} 件は削除できず、解放容量にも含めていません。',
      protectedTitle: '安全保護が適用されました', protectedBody: '{count} 件は Native の安全ルールにより保持されました。',
      reviewRemaining: '残りを確認', done: '完了',
      errorTitle: 'Quick Clean を続行できません', retry: 'もう一度試す',
      noAccess: 'ストレージへのアクセスがまだありません。', scanFailed: 'Smart Checkup を開始できませんでした。',
      scanModeSmart: 'Smart Checkup', scanModeQuick: 'Quick Scan', scanModeDeep: 'Deep Scan', scanModeCustom: 'Custom Scan',
      homeReady: '{count} 件の低リスク候補', homeClear: '低リスク候補はありません', homeReadyShort: '{count}件 · 確認', homeClearShort: '低リスクなし',
      itemAge: '{age}', unknownLocation: '共有ストレージ', selectedSummary: '{count} 件選択 · {bytes}',
      pageLimit: '確認済みの1バッチで削除できるのは最大500ファイルです。',
    },
  };

  const state = {
    open: false,
    source: 'home',
    ownsScan: false,
    pendingPermissionScan: false,
    items: [],
    selected: new Set(),
    page: null,
    summary: null,
    polling: null,
    permissionPolling: null,
    permissionPollStartedAt: 0,
    deleting: false,
    lastDelete: null,
    liveProgress: null,
    scanStartedAt: 0,
    callbackWrapped: false,
  };

  function lang() {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
  }
  function t(key, vars={}) {
    let value = (COPY[lang()] || COPY.en)[key] || COPY.en[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => {
      value = value.split(`{${name}}`).join(String(replacement));
    });
    return value;
  }
  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }
  function svg(name) { return `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.file}</svg>`; }
  function formatBytes(value) {
    const bytes = safeNumber(value);
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    const units = ['KB','MB','GB','TB'];
    let n = bytes / 1024;
    let index = 0;
    while (n >= 1024 && index < units.length - 1) { n /= 1024; index += 1; }
    const digits = n >= 100 ? 0 : n >= 10 ? 1 : 2;
    return `${n.toFixed(digits)} ${units[index]}`;
  }
  function formatAge(ms) {
    const time = safeNumber(ms);
    if (!time) return '';
    const delta = Math.max(0, Date.now() - time);
    const minutes = Math.floor(delta / 60000);
    if (minutes < 1) return t('justNow');
    if (minutes < 60) return `${minutes} ${t('minutesAgo')}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return lang() === 'th' ? `${hours} ชม.ที่แล้ว` : lang() === 'ja' ? `${hours}時間前` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return lang() === 'th' ? `${days} วันที่แล้ว` : lang() === 'ja' ? `${days}日前` : `${days}d ago`;
  }
  function scanModeLabel(mode) {
    const normalized = String(mode || '').toLowerCase();
    return t(normalized === 'quick' ? 'scanModeQuick' : normalized === 'deep' ? 'scanModeDeep' : normalized === 'custom' ? 'scanModeCustom' : 'scanModeSmart');
  }
  function snapshotAgeMs() {
    const generated = safeNumber(state.summary?.generatedAtMs);
    return generated ? Math.max(0, Date.now() - generated) : 0;
  }
  function snapshotIsStale() { return snapshotAgeMs() > STALE_REVIEW_MS; }
  function selectedItems() { return state.items.filter((item) => state.selected.has(String(item.id))); }
  function selectedBytes() { return selectedItems().reduce((sum, item) => sum + safeNumber(item.sizeBytes), 0); }


  function formatCount(value) {
    const number = safeNumber(value);
    try {
      const locale = lang() === 'th' ? 'th-TH' : lang() === 'ja' ? 'ja-JP' : 'en-US';
      return new Intl.NumberFormat(locale, {maximumFractionDigits:0}).format(number);
    } catch (_) { return String(Math.round(number)); }
  }
  function phaseLabel(phase) {
    const normalized = String(phase || 'preparing');
    const key = normalized === 'file_details' ? 'phaseDetails'
      : normalized === 'file_sizes' ? 'phaseSizes'
      : normalized === 'duplicates' ? 'phaseDuplicates'
      : normalized === 'modified_dates' ? 'phaseDates'
      : normalized === 'finalizing' ? 'phaseFinalizing'
      : 'phasePreparing';
    return t(key);
  }
  function scopeText(scanMode) {
    return String(scanMode || '').toLowerCase() === 'custom' ? t('scopeCustom') : t('scopeAccessible');
  }
  function categoryTotal(category) {
    if (category === 'duplicates' && typeof window.BearagnosticDuplicates?.activeCandidateCount === 'function') {
      const active = safeNumber(window.BearagnosticDuplicates.activeCandidateCount());
      return active;
    }
    const payload = parse(NATIVE.getReviewCandidates?.(category, 0, 1), {available:false,totalCount:0});
    return payload.available ? safeNumber(payload.totalCount) : 0;
  }
  function reviewOpportunityTotals() {
    return {
      duplicates: categoryTotal('duplicates'),
      large: categoryTotal('large'),
      older: categoryTotal('old'),
    };
  }

  function ensureStyle() {
    if (byId('androidQuickClean30Style')) return;
    const style = document.createElement('style');
    style.id = 'androidQuickClean30Style';
    style.textContent = `
      .ba-qc{position:fixed;inset:0;z-index:1860;padding:max(10px,env(safe-area-inset-top)) 10px max(10px,env(safe-area-inset-bottom));background:radial-gradient(circle at 18% 0%,rgba(52,194,232,.16),transparent 31%),linear-gradient(180deg,#edf7fc 0%,#e9f3f9 100%);color:#1b3046;overflow:hidden}.ba-qc[hidden]{display:none!important}
      .ba-qc-panel{height:100%;width:min(100%,560px);margin:0 auto;border-radius:34px;background:linear-gradient(180deg,rgba(254,255,255,.995),rgba(247,251,253,.995));border:1px solid rgba(255,255,255,.98);box-shadow:0 26px 76px rgba(29,62,94,.18),inset 0 1px 0 #fff;display:grid;grid-template-rows:auto minmax(0,1fr);overflow:hidden}
      .ba-qc-head{display:grid;grid-template-columns:52px minmax(0,1fr) 42px;gap:12px;align-items:center;padding:17px 17px 12px;background:linear-gradient(180deg,#fff,rgba(252,254,255,.96));border-bottom:1px solid rgba(84,118,148,.07)}
      .ba-qc-mark{width:52px;height:52px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(145deg,#35c2e7,#1689e9);color:#fff;box-shadow:0 10px 24px rgba(24,145,220,.18),inset 0 1px 0 rgba(255,255,255,.35)}.ba-qc-mark svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      .ba-qc-head-copy{min-width:0}.ba-qc-kicker{display:block;font-size:9.5px;line-height:1.1;letter-spacing:.19em;font-weight:850;color:#2785b4;margin-bottom:5px}.ba-qc-head h2{margin:0;font-size:23px;line-height:1.08;letter-spacing:-.035em;color:#172a40}.ba-qc-head p{margin:6px 0 0;font-size:12.5px;line-height:1.45;color:#5a7083;max-width:42ch}
      .ba-qc-close{width:42px;height:42px;border-radius:15px;background:#eef5f9;color:#536b80;font-size:23px;display:grid;place-items:center;border:1px solid rgba(89,121,150,.08)}
      .ba-qc-scroll{min-height:0;overflow:auto;overscroll-behavior:contain;padding:13px 16px 18px;scrollbar-width:none}.ba-qc-scroll::-webkit-scrollbar{display:none}
      .ba-qc-state{min-height:100%;display:grid;align-content:center;justify-items:center;text-align:center;padding:20px 6px}.ba-qc-state-icon{width:74px;height:74px;border-radius:25px;display:grid;place-items:center;margin-bottom:17px;background:linear-gradient(145deg,#e5f9f4,#eaf7ff);color:#159a82;box-shadow:0 12px 30px rgba(61,115,136,.09),inset 0 1px 0 #fff}.ba-qc-state-icon svg{width:35px;height:35px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}.ba-qc-state h3{font-size:22px;line-height:1.12;letter-spacing:-.03em;margin:0;color:#1a3047}.ba-qc-state p{font-size:13px;line-height:1.55;color:#5b7083;max-width:38ch;margin:9px auto 0}
      .ba-qc-primary,.ba-qc-secondary{min-height:48px;border-radius:17px;font-size:13px;font-weight:760;border:0;padding:0 18px}.ba-qc-primary{color:#fff;background:linear-gradient(115deg,#23b9e9,#0d82e8);box-shadow:0 11px 24px rgba(12,132,226,.19)}.ba-qc-primary:disabled{opacity:.42;box-shadow:none}.ba-qc-secondary{color:#3f596f;background:#edf4f8;border:1px solid rgba(91,121,149,.07)}.ba-qc-state-actions{display:grid;grid-template-columns:auto auto;gap:9px;margin-top:18px}.ba-qc-state-actions.one{grid-template-columns:auto}
      .ba-qc-spinner{width:74px;height:74px;border-radius:50%;position:relative;margin-bottom:17px;background:linear-gradient(145deg,#e8f8ff,#eef9f5);box-shadow:inset 0 0 0 1px rgba(78,134,166,.07)}.ba-qc-spinner:before{content:'';position:absolute;inset:10px;border-radius:50%;border:4px solid rgba(23,145,219,.14);border-top-color:#1a9be2;animation:baQcSpin .85s linear infinite}.ba-qc-spinner:after{content:'';position:absolute;inset:25px;border-radius:50%;background:#fff;box-shadow:0 3px 10px rgba(53,91,124,.08)}@keyframes baQcSpin{to{transform:rotate(360deg)}}
      .ba-qc-overview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.ba-qc-metric{min-width:0;padding:12px 9px;border-radius:19px;background:linear-gradient(145deg,#f6fbfe,#eef8fc);border:1px solid rgba(81,126,158,.08);text-align:center}.ba-qc-metric:nth-child(2){background:linear-gradient(145deg,#f0fbf7,#f5fcfa)}.ba-qc-metric:nth-child(3){background:linear-gradient(145deg,#f6f4ff,#f8f8fe)}.ba-qc-metric b{display:block;font-size:16px;line-height:1.08;color:#19354e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-qc-metric span{display:block;margin-top:5px;font-size:10px;line-height:1.25;color:#61788b}
      .ba-qc-safety{display:grid;grid-template-columns:38px minmax(0,1fr);gap:11px;align-items:start;margin-top:10px;padding:12px 13px;border-radius:20px;background:linear-gradient(135deg,#eefbf7,#f7fcff);border:1px solid rgba(38,158,129,.09)}.ba-qc-safety-icon{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;background:#ddf7ef;color:#15937a}.ba-qc-safety-icon svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.ba-qc-safety strong{display:block;font-size:12.5px;line-height:1.3;color:#21443d}.ba-qc-safety p{margin:4px 0 0;font-size:11.5px;line-height:1.48;color:#58756d}
      .ba-qc-alert{margin-top:10px;padding:11px 12px;border-radius:17px;background:#fff7e8;border:1px solid rgba(198,145,48,.10);color:#755b2b}.ba-qc-alert strong{display:block;font-size:12px}.ba-qc-alert p{margin:4px 0 0;font-size:11px;line-height:1.45}.ba-qc-alert.info{background:#eff8fd;border-color:rgba(45,138,192,.09);color:#426b85}
      .ba-qc-toolbar{display:flex;align-items:center;gap:8px;margin:14px 1px 8px}.ba-qc-toolbar-label{min-width:0;flex:1}.ba-qc-toolbar-label strong{display:block;font-size:14px;color:#1f354b}.ba-qc-toolbar-label small{display:block;margin-top:3px;font-size:10.5px;color:#667b8e}.ba-qc-chip{min-height:34px;padding:0 11px;border-radius:12px;background:#edf6fb;color:#2776a4;border:1px solid rgba(49,124,169,.08);font-size:10.5px;font-weight:760;white-space:nowrap}.ba-qc-chip.secondary{background:#f3f6f8;color:#617486}
      .ba-qc-list{display:grid;gap:8px}.ba-qc-row{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;padding:11px 11px;border-radius:19px;background:#fff;border:1px solid rgba(88,121,151,.09);box-shadow:0 6px 19px rgba(53,87,120,.045)}.ba-qc-row.is-selected{border-color:rgba(23,157,130,.18);background:linear-gradient(145deg,#fff,#f4fcf9)}.ba-qc-row input{width:20px;height:20px;accent-color:#159d83}.ba-qc-file{min-width:0}.ba-qc-file strong{display:block;font-size:13.5px;line-height:1.25;color:#1b3046;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-qc-location{display:block;margin-top:3px;font-size:10.5px;line-height:1.3;color:#687d90;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-qc-reason{display:flex;align-items:center;gap:5px;margin-top:5px;font-size:10px;line-height:1.3;color:#347966}.ba-qc-reason:before{content:'✓';width:16px;height:16px;border-radius:50%;display:grid;place-items:center;background:#e3f7f0;color:#13866f;font-size:10px;font-weight:850;flex:0 0 auto}.ba-qc-meta{text-align:right;min-width:72px}.ba-qc-meta b{display:block;font-size:12.5px;color:#21374d;white-space:nowrap}.ba-qc-meta small{display:block;margin-top:4px;font-size:9.5px;color:#718599;white-space:nowrap}.ba-qc-badge{display:inline-flex;margin-top:6px;padding:4px 7px;border-radius:999px;background:#e4f7f0;color:#187e6a;font-size:8px;line-height:1;font-weight:850;letter-spacing:.035em;white-space:nowrap}
      .ba-qc-footer{position:sticky;bottom:-18px;margin:12px -16px -18px;padding:10px 16px calc(15px + env(safe-area-inset-bottom,0px));background:linear-gradient(180deg,rgba(249,252,254,.82),#fbfdff 28%);border-top:1px solid rgba(86,119,149,.07);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}.ba-qc-footer-copy{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:8px}.ba-qc-footer-copy strong{font-size:12.5px;color:#263e55}.ba-qc-footer-copy small{font-size:10.5px;color:#64798d;text-align:right}.ba-qc-footer-actions{display:grid;grid-template-columns:.78fr 1.22fr;gap:9px}.ba-qc-footer .ba-qc-primary,.ba-qc-footer .ba-qc-secondary{width:100%}
      .ba-qc-confirm{position:fixed;inset:0;z-index:1890;display:grid;place-items:center;padding:20px;background:rgba(14,30,48,.38);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}.ba-qc-confirm[hidden]{display:none!important}.ba-qc-confirm-card{width:min(100%,430px);padding:19px;border-radius:27px;background:#fff;box-shadow:0 24px 70px rgba(21,46,72,.24)}.ba-qc-confirm-kicker{font-size:9px;letter-spacing:.18em;font-weight:850;color:#b17a25}.ba-qc-confirm-card h3{margin:6px 0 0;font-size:21px;line-height:1.12;color:#1b3046;letter-spacing:-.025em}.ba-qc-confirm-card>p{margin:8px 0 0;font-size:12.5px;line-height:1.52;color:#596f83}.ba-qc-confirm-metric{margin-top:12px;padding:12px;border-radius:18px;background:linear-gradient(145deg,#f6fbfe,#edf8fc);display:flex;align-items:center;justify-content:space-between;gap:12px}.ba-qc-confirm-metric strong{font-size:14px;color:#1f374e}.ba-qc-confirm-metric b{font-size:16px;color:#1189d5}.ba-qc-proof{display:grid;grid-template-columns:24px minmax(0,1fr);gap:8px;margin-top:11px;padding:10px 11px;border-radius:15px;background:#eefaf6;color:#3d6e60;font-size:11px;line-height:1.45}.ba-qc-proof svg{width:20px;height:20px;fill:none;stroke:#188f77;stroke-width:1.8}.ba-qc-confirm-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px}.ba-qc-danger{min-height:48px;border-radius:17px;background:linear-gradient(120deg,#b84550,#d15862);color:#fff;font-size:13px;font-weight:780;box-shadow:0 10px 22px rgba(184,69,80,.16)}.ba-qc-danger:disabled{opacity:.55}
      .ba-qc-result{padding:8px 0}.ba-qc-result-card{text-align:center;padding:20px 14px 18px;border-radius:25px;background:linear-gradient(145deg,#f0fbf7,#f4fbff);border:1px solid rgba(42,155,132,.09)}.ba-qc-result-check{width:70px;height:70px;border-radius:24px;display:grid;place-items:center;margin:0 auto 14px;background:linear-gradient(145deg,#dff8ef,#e7f7ff);color:#15977e;box-shadow:0 11px 27px rgba(49,148,124,.11)}.ba-qc-result-check svg{width:34px;height:34px;fill:none;stroke:currentColor;stroke-width:2}.ba-qc-result-kicker{display:block;font-size:9px;letter-spacing:.18em;font-weight:850;color:#3f8a74}.ba-qc-result h3{font-size:22px;line-height:1.12;margin:6px 0 0;color:#1c334a}.ba-qc-result-bytes{font-size:34px;line-height:1;font-weight:820;letter-spacing:-.05em;color:#128fd7;margin-top:15px}.ba-qc-result-label{font-size:11px;color:#647a8d;margin-top:5px}.ba-qc-result p{font-size:12px;line-height:1.5;color:#5a7083;max-width:36ch;margin:11px auto 0}.ba-qc-result-notes{display:grid;gap:8px;margin-top:11px;text-align:left}.ba-qc-result-note{padding:10px 11px;border-radius:15px;background:#fff7e8;color:#745c30;font-size:11px;line-height:1.45}.ba-qc-result-note strong{display:block;font-size:11.5px;margin-bottom:3px}.ba-qc-result-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px}
      .ba-qc-scan-state{min-height:100%;display:grid;align-content:center;padding:clamp(20px,3dvh,34px) 1px 18px;animation:baQcResolve .24s ease-out}.ba-qc-scan-hero{text-align:center}.ba-qc-scan-state .ba-qc-spinner{margin:0 auto 15px}.ba-qc-scan-state h3{font-size:22px;line-height:1.12;letter-spacing:-.03em;margin:0;color:#1a3047}.ba-qc-scan-lead{font-size:13px;line-height:1.52;color:#5a7083;max-width:39ch;margin:8px auto 0}
      .ba-qc-evidence-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:22px}.ba-qc-evidence{min-width:0;text-align:left;padding:12px 11px;border-radius:18px;background:linear-gradient(145deg,#f5fbfe,#edf7fc);border:1px solid rgba(72,126,160,.08);box-shadow:0 7px 20px rgba(49,88,119,.045)}.ba-qc-evidence:nth-child(2){background:linear-gradient(145deg,#f4fbf8,#eefaf6)}.ba-qc-evidence:nth-child(3){background:linear-gradient(145deg,#f7f5ff,#f4f6fc)}.ba-qc-evidence span{display:block;font-size:9.5px;line-height:1.18;letter-spacing:.085em;font-weight:820;color:#6e8497;text-transform:uppercase}.ba-qc-evidence strong{display:block;margin-top:5px;font-size:11.5px;line-height:1.3;color:#254159}
      .ba-qc-live-card{margin-top:10px;padding:13px;border-radius:21px;background:#fff;border:1px solid rgba(76,117,148,.09);box-shadow:0 8px 24px rgba(47,82,115,.055);text-align:left}.ba-qc-live-top{display:grid;grid-template-columns:36px minmax(0,1fr) auto;gap:10px;align-items:center}.ba-qc-live-icon{width:36px;height:36px;border-radius:13px;display:grid;place-items:center;background:linear-gradient(145deg,#e2f7ff,#edf9f5);color:#168fd2}.ba-qc-live-icon svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ba-qc-live-copy{min-width:0}.ba-qc-live-copy span{display:block;font-size:10px;line-height:1.1;letter-spacing:.09em;font-weight:820;color:#2d7fae;text-transform:uppercase}.ba-qc-live-copy strong{display:block;margin-top:4px;font-size:13px;line-height:1.25;color:#223c53;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-qc-live-pill{padding:6px 8px;border-radius:999px;background:#eaf8f4;color:#197f6a;font-size:9.5px;line-height:1;font-weight:820;white-space:nowrap}.ba-qc-live-location{display:block;margin:8px 0 0 46px;font-size:10.5px;line-height:1.35;color:#667c8f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ba-qc-live-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:11px}.ba-qc-live-metric{padding:9px 8px;border-radius:14px;background:#f6fafc;text-align:center}.ba-qc-live-metric b{display:block;font-size:13px;line-height:1.1;color:#203a51}.ba-qc-live-metric span{display:block;margin-top:4px;font-size:10px;line-height:1.25;color:#6d8294}.ba-qc-real-work{display:flex;align-items:flex-start;gap:8px;margin:10px 2px 0;padding:10px 11px;border-radius:16px;background:linear-gradient(135deg,#eef9f6,#f6fbfd);color:#557469;text-align:left;font-size:10.5px;line-height:1.45}.ba-qc-real-work svg{flex:0 0 auto;width:18px;height:18px;fill:none;stroke:#188e77;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      .ba-qc-empty{min-height:100%;display:grid;align-content:center;padding:clamp(16px,2.5dvh,26px) 0 16px;animation:baQcResolve .26s ease-out}.ba-qc-empty-hero{text-align:center;padding:0 7px}.ba-qc-empty-hero .ba-qc-state-icon{width:66px;height:66px;border-radius:22px;margin:0 auto 13px}.ba-qc-empty-kicker{display:block;font-size:9px;line-height:1.1;letter-spacing:.16em;font-weight:850;color:#278b78}.ba-qc-empty h3{font-size:22px;line-height:1.12;letter-spacing:-.03em;margin:6px 0 0;color:#1b3147}.ba-qc-empty-hero p{font-size:13px;line-height:1.53;color:#5a7083;max-width:39ch;margin:9px auto 0}
      .ba-qc-empty-proof{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:19px}.ba-qc-empty-metric{min-width:0;padding:12px 9px;border-radius:18px;background:linear-gradient(145deg,#f1fbf7,#f6fcfa);border:1px solid rgba(41,151,127,.08);text-align:center}.ba-qc-empty-metric:nth-child(2){background:linear-gradient(145deg,#f3f9fd,#edf7fc);border-color:rgba(41,132,187,.08)}.ba-qc-empty-metric:nth-child(3){background:linear-gradient(145deg,#f7f5ff,#f5f7fc);border-color:rgba(112,91,194,.07)}.ba-qc-empty-metric b{display:block;font-size:13.5px;line-height:1.18;color:#214057;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-qc-empty-metric span{display:block;margin-top:4px;font-size:10px;line-height:1.25;color:#6a8092}
      .ba-qc-empty-trust{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;align-items:center;margin-top:10px;padding:11px 12px;border-radius:18px;background:linear-gradient(135deg,#ecfaf5,#f7fcfb);border:1px solid rgba(39,158,130,.08);text-align:left}.ba-qc-empty-trust i{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:#dff7ef;color:#168b74;font-style:normal}.ba-qc-empty-trust svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.8}.ba-qc-empty-trust strong{display:block;font-size:11.8px;line-height:1.25;color:#24473e}.ba-qc-empty-trust small{display:block;margin-top:3px;font-size:11px;line-height:1.45;color:#5d776e}
      .ba-qc-next{margin-top:11px;padding:13px;border-radius:21px;background:#fff;border:1px solid rgba(77,116,146,.09);box-shadow:0 8px 24px rgba(47,82,115,.045);text-align:left}.ba-qc-next-head strong{display:block;font-size:13.5px;line-height:1.25;color:#233d54}.ba-qc-next-head p{margin:4px 0 0;font-size:11.5px;line-height:1.48;color:#667b8e}.ba-qc-next-list{display:grid;gap:7px;margin-top:10px}.ba-qc-next-button{width:100%;min-height:48px;display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center;padding:9px 11px;border-radius:15px;background:#f6fafc;border:1px solid rgba(83,123,153,.07);text-align:left;color:#243e55}.ba-qc-next-button strong{font-size:12.5px;line-height:1.25}.ba-qc-next-button span{font-size:11px;color:#667c8e;white-space:nowrap}.ba-qc-next-button b{width:25px;height:25px;border-radius:9px;display:grid;place-items:center;background:#e9f4fa;color:#2581b4;font-size:15px}.ba-qc-none-review{margin-top:10px;padding:11px 12px;border-radius:16px;background:#f4f8fb;color:#64798c;font-size:11.5px;line-height:1.48;text-align:left}.ba-qc-empty-actions{display:grid;grid-template-columns:.78fr 1.22fr;gap:9px;margin-top:12px}
      @keyframes baQcResolve{from{opacity:.25;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
      @media(max-width:360px){.ba-qc-evidence-grid,.ba-qc-empty-proof{gap:6px}.ba-qc-evidence{padding:10px 8px}.ba-qc-evidence strong{font-size:10.5px}.ba-qc-live-card{padding:11px}.ba-qc-live-location{margin-left:0;margin-top:8px}.ba-qc-live-metrics{gap:5px}.ba-qc-next{padding:11px}.ba-qc-head{grid-template-columns:46px minmax(0,1fr) 38px;padding-left:13px;padding-right:13px;gap:9px}.ba-qc-mark{width:46px;height:46px;border-radius:16px}.ba-qc-head h2{font-size:20px}.ba-qc-head p{font-size:11.5px}.ba-qc-scroll{padding-left:12px;padding-right:12px}.ba-qc-overview{gap:6px}.ba-qc-metric{padding:10px 6px}.ba-qc-metric b{font-size:14px}.ba-qc-row{padding:10px 9px;gap:8px}.ba-qc-meta{min-width:64px}.ba-qc-toolbar{flex-wrap:wrap}.ba-qc-toolbar-label{flex-basis:100%}.ba-qc-footer{margin-left:-12px;margin-right:-12px;padding-left:12px;padding-right:12px}}
      @media(prefers-reduced-motion:reduce){.ba-qc-spinner:before,.ba-qc-scan-state,.ba-qc-empty{animation:none!important}}
      html[data-motion='reduced'] .ba-qc-spinner:before,html[data-motion='reduced'] .ba-qc-scan-state,html[data-motion='reduced'] .ba-qc-empty{animation:none!important}
    `;
    document.head.appendChild(style);
  }

  function ensureSurface() {
    ensureStyle();
    let surface = byId('baQuickClean');
    if (surface) return surface;
    surface = document.createElement('section');
    surface.id = 'baQuickClean';
    surface.className = 'ba-qc';
    surface.hidden = true;
    surface.setAttribute('role', 'dialog');
    surface.setAttribute('aria-modal', 'true');
    surface.innerHTML = `
      <div class="ba-qc-panel">
        <header class="ba-qc-head">
          <span class="ba-qc-mark">${svg('clean')}</span>
          <div class="ba-qc-head-copy"><span class="ba-qc-kicker" id="baQcKicker"></span><h2 id="baQcTitle"></h2><p id="baQcLead"></p></div>
          <button class="ba-qc-close" id="baQcClose" type="button" aria-label="Close">×</button>
        </header>
        <main class="ba-qc-scroll" id="baQcBody"></main>
      </div>
      <section class="ba-qc-confirm" id="baQcConfirm" hidden aria-modal="true" role="dialog"><div class="ba-qc-confirm-card" id="baQcConfirmCard"></div></section>`;
    document.body.appendChild(surface);
    byId('baQcClose').addEventListener('click', closeSurface);
    byId('baQcConfirm').addEventListener('click', (event) => { if (event.target === byId('baQcConfirm')) hideConfirm(); });
    refreshHeaderCopy();
    return surface;
  }

  function refreshHeaderCopy() {
    if (!byId('baQuickClean')) return;
    byId('baQcKicker').textContent = t('kicker');
    byId('baQcTitle').textContent = t('title');
    byId('baQcLead').textContent = t('lead');
    byId('baQcClose').setAttribute('aria-label', t('close'));
  }

  function suppressAutoResults() {
    if (!state.open || !state.ownsScan) return;
    const results = byId('nativeResultsSheet');
    if (results && !results.hidden) results.hidden = true;
  }

  function nativeState() { return parse(NATIVE.getNativeState?.(), {}); }
  function reviewSummary() { return parse(NATIVE.getReviewSummary?.(), {available:false}); }

  function updateHomeCard(totalCount) {
    const count = safeNumber(totalCount);
    document.querySelectorAll('[data-tool="cleanup"] small').forEach((node) => {
      const compact = Boolean(node.closest('.home-screen'));
      node.textContent = count > 0
        ? t(compact ? 'homeReadyShort' : 'homeReady', {count})
        : t(compact ? 'homeClearShort' : 'homeClear');
      node.dataset.quickCleanStatus = '1';
    });
  }

  function restoreHomeCardIfNoSnapshot() {
    const summary = reviewSummary();
    if (summary?.available) return;
    document.querySelectorAll('[data-tool="cleanup"] small[data-quick-clean-status="1"]').forEach((node) => {
      node.removeAttribute('data-quick-clean-status');
      const language = lang();
      node.textContent = language === 'th' ? 'ตรวจรายการก่อนลบ' : language === 'ja' ? '候補を確認' : 'Review candidates';
    });
  }

  function renderState(iconName, title, body, actionsHtml='') {
    byId('baQcBody').innerHTML = `<section class="ba-qc-state"><div class="ba-qc-state-icon">${svg(iconName)}</div><h3>${esc(title)}</h3><p>${esc(body)}</p>${actionsHtml}</section>`;
  }

  function renderNeedScan(ns) {
    const hasAccess = Boolean(ns?.broadStorageAccess);
    if (!hasAccess) {
      renderState('shield', t('permissionTitle'), t('permissionBody'), `<div class="ba-qc-state-actions one"><button class="ba-qc-primary" id="baQcPermission" type="button">${esc(t('openSettings'))}</button></div>`);
      byId('baQcPermission').addEventListener('click', requestPermissionAndContinue);
      return;
    }
    renderState('refresh', t('noSnapshotTitle'), t('noSnapshotBody'), `<div class="ba-qc-state-actions one"><button class="ba-qc-primary" id="baQcStartScan" type="button">${esc(t('scanNow'))}</button></div>`);
    byId('baQcStartScan').addEventListener('click', startSmartCheckup);
  }

  function renderScanning(existing=false) {
    const sourceValue = existing ? t('liveSourceActive') : t('liveSourceSmart');
    byId('baQcBody').innerHTML = `<section class="ba-qc-scan-state"><div class="ba-qc-scan-hero"><div class="ba-qc-spinner" aria-hidden="true"></div><h3>${esc(t('scanningTitle'))}</h3><p class="ba-qc-scan-lead">${esc(existing ? t('scanElsewhere') : t('scanningBody'))}</p></div><div class="ba-qc-evidence-grid"><div class="ba-qc-evidence"><span>${esc(t('liveSource'))}</span><strong id="baQcLiveSource">${esc(sourceValue)}</strong></div><div class="ba-qc-evidence"><span>${esc(t('scopeLabel'))}</span><strong id="baQcLiveScope">${esc(t('scopeAccessible'))}</strong></div><div class="ba-qc-evidence"><span>${esc(t('safetyLabel'))}</span><strong>${esc(t('lowRiskOnly'))}</strong></div></div><section class="ba-qc-live-card"><div class="ba-qc-live-top"><span class="ba-qc-live-icon">${svg('file')}</span><div class="ba-qc-live-copy"><span id="baQcLivePhase">${esc(phaseLabel(state.liveProgress?.phase))}</span><strong id="baQcLiveItem">${esc(t('waitingItem'))}</strong></div><b class="ba-qc-live-pill">${esc(t('localLive'))}</b></div><small class="ba-qc-live-location" id="baQcLiveLocation">${esc(t('scopeAccessible'))}</small><div class="ba-qc-live-metrics"><div class="ba-qc-live-metric"><b id="baQcLiveReviewed">0</b><span>${esc(t('filesReviewedLive'))}</span></div><div class="ba-qc-live-metric"><b id="baQcLiveFolders">0</b><span>${esc(t('foldersVisited'))}</span></div><div class="ba-qc-live-metric"><b id="baQcLiveBytes">—</b><span id="baQcLiveBytesLabel">${esc(t('storageMeasured'))}</span></div></div></section><div class="ba-qc-real-work">${svg('check')}<span>${esc(t('realWorkNote'))}</span></div><div class="ba-qc-state-actions one"><button class="ba-qc-secondary" id="baQcScanningClose" type="button">${esc(t('close'))}</button></div></section>`;
    byId('baQcScanningClose').addEventListener('click', closeSurface);
    updateScanningEvidence();
  }

  function updateScanningEvidence() {
    if (!state.open || !byId('baQcLivePhase')) return;
    const progress = state.liveProgress || {};
    const mode = String(progress.scanMode || (state.ownsScan ? 'smart' : '')).toLowerCase();
    const itemName = String(progress.activeItemName || '').trim();
    const itemLocation = String(progress.activeItemLocation || '').trim();
    byId('baQcLivePhase').textContent = phaseLabel(progress.phase);
    byId('baQcLiveItem').textContent = itemName || t('waitingItem');
    byId('baQcLiveLocation').textContent = itemLocation || scopeText(mode);
    byId('baQcLiveReviewed').textContent = formatCount(progress.reviewedFiles);
    byId('baQcLiveFolders').textContent = formatCount(progress.directoriesVisited);
    const phase = String(progress.phase || 'preparing');
    const bytesNode = byId('baQcLiveBytes');
    const bytesLabel = byId('baQcLiveBytesLabel');
    if (phase === 'file_details') {
      if (bytesNode) bytesNode.textContent = formatBytes(progress.contentProbeBytes);
      if (bytesLabel) bytesLabel.textContent = t('contentSampled');
    } else if (phase === 'duplicates') {
      if (bytesNode) bytesNode.textContent = formatBytes(progress.hashedBytes);
      if (bytesLabel) bytesLabel.textContent = t('verificationRead');
    } else if (phase === 'preparing') {
      if (bytesNode) bytesNode.textContent = '—';
      if (bytesLabel) bytesLabel.textContent = t('storageMeasured');
    } else {
      if (bytesNode) bytesNode.textContent = formatBytes(progress.totalBytes);
      if (bytesLabel) bytesLabel.textContent = t('storageMeasured');
    }
    if (byId('baQcLiveScope')) byId('baQcLiveScope').textContent = scopeText(mode);
    if (byId('baQcLiveSource')) byId('baQcLiveSource').textContent = mode ? `${scanModeLabel(mode)} · ${t('localLive')}` : (state.ownsScan ? t('liveSourceSmart') : t('liveSourceActive'));
  }

  function renderError(message) {
    renderState('info', t('errorTitle'), message || t('scanFailed'), `<div class="ba-qc-state-actions"><button class="ba-qc-secondary" id="baQcErrorClose" type="button">${esc(t('close'))}</button><button class="ba-qc-primary" id="baQcRetry" type="button">${esc(t('retry'))}</button></div>`);
    byId('baQcErrorClose').addEventListener('click', closeSurface);
    byId('baQcRetry').addEventListener('click', refreshWorkspace);
  }

  function renderEmpty() {
    updateHomeCard(0);
    const opportunities = reviewOpportunityTotals();
    const cards = [
      ['duplicates', opportunities.duplicates, t('duplicatesNext')],
      ['large', opportunities.large, t('largeNext')],
      ['old', opportunities.older, t('olderNext')],
    ].filter(([,count]) => count > 0).map(([category,count,label]) => `<button class="ba-qc-next-button" type="button" data-qc-next="${esc(category)}"><strong>${esc(label)}</strong><span>${esc(t('reviewCount',{count:formatCount(count)}))}</span><b>›</b></button>`).join('');
    const age = formatAge(state.summary?.generatedAtMs) || t('justNow');
    const mode = scanModeLabel(state.summary?.scanMode || 'smart');
    byId('baQcBody').innerHTML = `<section class="ba-qc-empty"><div class="ba-qc-empty-hero"><div class="ba-qc-state-icon">${svg('check')}</div><span class="ba-qc-empty-kicker">${esc(t('emptyKicker'))}</span><h3>${esc(t('noCandidatesTitle'))}</h3><p>${esc(t('noCandidatesBody'))}</p></div><div class="ba-qc-empty-proof"><div class="ba-qc-empty-metric"><b>${esc(t('zeroItems'))}</b><span>${esc(t('lowRiskResult'))}</span></div><div class="ba-qc-empty-metric"><b>${esc(age)}</b><span>${esc(t('checkedAt'))}</span></div><div class="ba-qc-empty-metric"><b>${esc(mode)}</b><span>${esc(t('snapshotSource'))}</span></div></div><div class="ba-qc-empty-trust"><i>${svg('shield')}</i><div><strong>${esc(t('safeTitle'))}</strong><small>${esc(t('safeBody'))}</small></div></div>${cards ? `<section class="ba-qc-next"><div class="ba-qc-next-head"><strong>${esc(t('reviewFirstTitle'))}</strong><p>${esc(t('reviewFirstBody'))}</p></div><div class="ba-qc-next-list">${cards}</div></section>` : `<div class="ba-qc-none-review">${esc(t('noneReviewFirst'))}</div>`}<div class="ba-qc-empty-actions"><button class="ba-qc-secondary" id="baQcRefreshEmpty" type="button">${esc(t('checkAgain'))}</button><button class="ba-qc-primary" id="baQcEmptyClose" type="button">${esc(t('done'))}</button></div></section>`;
    byId('baQcEmptyClose').addEventListener('click', closeSurface);
    byId('baQcRefreshEmpty').addEventListener('click', startSmartCheckup);
    byId('baQcBody').querySelectorAll('[data-qc-next]').forEach((button) => {
      button.addEventListener('click', () => openNextReview(String(button.dataset.qcNext || '')));
    });
  }

  function openNextReview(category) {
    if (!['duplicates','large','old'].includes(category)) return;
    const source = state.source;
    state.open = false;
    state.pendingPermissionScan = false;
    stopPolling();
    stopPermissionPolling();
    hideConfirm();
    const surface = byId('baQuickClean');
    if (surface) surface.hidden = true;
    window.requestAnimationFrame(() => {
      if (category === 'duplicates' && typeof window.BearagnosticDuplicates?.open === 'function') {
        window.BearagnosticDuplicates.open();
        return;
      }
      const reviewButton = document.querySelector(`[data-review-category="${category}"]`);
      if (reviewButton) { reviewButton.click(); return; }
      const toolName = category === 'old' ? 'older' : category;
      const scopeSelector = source === 'tools' ? '#toolsScreen' : '.home-screen';
      const toolButton = document.querySelector(`${scopeSelector} [data-tool="${toolName}"]`) || document.querySelector(`[data-tool="${toolName}"]`);
      toolButton?.click();
    });
  }

  function renderCandidates() {
    const page = state.page || {};
    const total = safeNumber(page.totalCount);
    if (!state.items.length || total === 0) { renderEmpty(); return; }
    updateHomeCard(total);

    const stale = snapshotIsStale();
    const age = formatAge(state.summary?.generatedAtMs) || t('current');
    const selectedCount = state.selected.size;
    const bytes = selectedBytes();
    const shown = state.items.length;
    const listNote = page.hasMore ? `<div class="ba-qc-alert info"><p>${esc(t('partialList',{shown,total}))}</p></div>` : '';
    const truncNote = page.detailsTruncated || state.summary?.detailsTruncated ? `<div class="ba-qc-alert info"><p>${esc(t('truncated'))}</p></div>` : '';
    const staleNote = stale ? `<div class="ba-qc-alert"><strong>${esc(t('staleBlockTitle'))}</strong><p>${esc(t('staleBlockBody'))}</p></div>` : '';

    const rows = state.items.map((item) => {
      const id = String(item.id || '');
      const checked = state.selected.has(id);
      const reason = item.reasonCode === 'stale_incomplete_download' ? t('staleReason') : t('genericReason');
      const itemAge = formatAge(item.modifiedMs);
      return `<label class="ba-qc-row${checked ? ' is-selected' : ''}" data-qc-row="${esc(id)}"><input type="checkbox" data-qc-id="${esc(id)}"${checked ? ' checked' : ''}><span class="ba-qc-file"><strong>${esc(item.name || id)}</strong><small class="ba-qc-location">${esc(item.location || t('unknownLocation'))}</small><span class="ba-qc-reason">${esc(reason)}</span></span><span class="ba-qc-meta"><b>${esc(formatBytes(item.sizeBytes))}</b>${itemAge ? `<small>${esc(itemAge)}</small>` : ''}<span class="ba-qc-badge">${esc(t('safeBadge'))}</span></span></label>`;
    }).join('');

    byId('baQcBody').innerHTML = `
      <section class="ba-qc-overview">
        <div class="ba-qc-metric"><b>${esc(total)}</b><span>${esc(t('safeItems'))}</span></div>
        <div class="ba-qc-metric"><b id="baQcSelectedBytes">${esc(formatBytes(bytes))}</b><span>${esc(t('reclaimable'))}</span></div>
        <div class="ba-qc-metric"><b>${esc(stale ? t('refreshRecommended') : age)}</b><span>${esc(scanModeLabel(state.summary?.scanMode))}</span></div>
      </section>
      <section class="ba-qc-safety"><span class="ba-qc-safety-icon">${svg('shield')}</span><div><strong>${esc(t('safeTitle'))}</strong><p>${esc(t('safeBody'))}</p></div></section>
      ${staleNote}${listNote}${truncNote}
      <div class="ba-qc-toolbar"><div class="ba-qc-toolbar-label"><strong>${esc(t('safeItems'))}</strong><small id="baQcSelectionLine">${esc(t('selectedSummary',{count:selectedCount,bytes:formatBytes(bytes)}))}</small></div><button class="ba-qc-chip secondary" id="baQcClear" type="button">${esc(t('clear'))}</button><button class="ba-qc-chip" id="baQcSelectAll" type="button">${esc(t('selectAll'))}</button></div>
      <div class="ba-qc-list">${rows}</div>
      <div class="ba-qc-alert info"><p>${esc(t('pageLimit'))}</p></div>
      <footer class="ba-qc-footer"><div class="ba-qc-footer-copy"><strong id="baQcFooterCount">${esc(t('selectedSummary',{count:selectedCount,bytes:formatBytes(bytes)}))}</strong><small>${esc(stale ? t('refreshRecommended') : t('current'))}</small></div><div class="ba-qc-footer-actions"><button class="ba-qc-secondary" id="baQcRefresh" type="button">${esc(t('refresh'))}</button><button class="ba-qc-primary" id="baQcReview" type="button"${selectedCount === 0 || stale ? ' disabled' : ''}>${esc(stale ? t('staleBlockTitle') : t('reviewSelected'))}</button></div></footer>`;

    byId('baQcClear').addEventListener('click', () => { state.selected.clear(); updateSelectionUi(); });
    byId('baQcSelectAll').addEventListener('click', () => {
      state.selected = new Set(state.items.filter((item) => item.autoCleanEligible !== false).slice(0, MAX_BATCH).map((item) => String(item.id)));
      updateSelectionUi();
    });
    byId('baQcRefresh').addEventListener('click', startSmartCheckup);
    byId('baQcReview').addEventListener('click', showConfirm);
    byId('baQcBody').querySelectorAll('[data-qc-id]').forEach((input) => {
      input.addEventListener('change', () => {
        const id = String(input.dataset.qcId || '');
        if (input.checked) {
          if (state.selected.size >= MAX_BATCH) { input.checked = false; return; }
          state.selected.add(id);
        } else state.selected.delete(id);
        updateSelectionUi();
      });
    });
  }

  function updateSelectionUi() {
    const count = state.selected.size;
    const bytes = selectedBytes();
    byId('baQcSelectionLine') && (byId('baQcSelectionLine').textContent = t('selectedSummary',{count,bytes:formatBytes(bytes)}));
    byId('baQcFooterCount') && (byId('baQcFooterCount').textContent = t('selectedSummary',{count,bytes:formatBytes(bytes)}));
    byId('baQcSelectedBytes') && (byId('baQcSelectedBytes').textContent = formatBytes(bytes));
    const review = byId('baQcReview');
    if (review) review.disabled = count === 0 || snapshotIsStale();
    byId('baQcBody')?.querySelectorAll('[data-qc-row]').forEach((row) => {
      const input = row.querySelector('[data-qc-id]');
      if (!input) return;
      const id = String(input.dataset.qcId || '');
      input.checked = state.selected.has(id);
      row.classList.toggle('is-selected', input.checked);
    });
  }

  function loadCandidates() {
    const payload = parse(NATIVE.getReviewCandidates?.('lowrisk', 0, MAX_BATCH), {available:false,items:[],totalCount:0});
    if (!payload.available) { renderNeedScan(nativeState()); return; }
    state.page = payload;
    state.items = Array.isArray(payload.items) ? payload.items.filter((item) => item && item.autoCleanEligible !== false) : [];
    state.selected = new Set(state.items.filter((item) => item.suggestedSelected !== false).slice(0, MAX_BATCH).map((item) => String(item.id)));
    renderCandidates();
  }

  function refreshWorkspace() {
    if (!state.open) return;
    refreshHeaderCopy();
    const ns = nativeState();
    suppressAutoResults();
    if (ns.scannerRunning) {
      renderScanning(!state.ownsScan);
      startPolling();
      return;
    }
    stopPolling();
    state.summary = reviewSummary();
    if (!state.summary?.available) {
      restoreHomeCardIfNoSnapshot();
      renderNeedScan(ns);
      return;
    }
    loadCandidates();
  }

  function requestPermissionAndContinue() {
    state.pendingPermissionScan = true;
    startPermissionPolling();
    try { NATIVE.requestBroadStorageAccess?.(); }
    catch (_) { stopPermissionPolling(); renderError(t('noAccess')); }
  }

  function startPermissionPolling() {
    if (state.permissionPolling) return;
    state.permissionPollStartedAt = Date.now();
    state.permissionPolling = window.setInterval(() => {
      if (!state.open || !state.pendingPermissionScan) { stopPermissionPolling(); return; }
      const ns = nativeState();
      if (ns.broadStorageAccess) {
        state.pendingPermissionScan = false;
        stopPermissionPolling();
        startSmartCheckup();
        return;
      }
      if (Date.now() - state.permissionPollStartedAt > 90_000) stopPermissionPolling();
    }, 700);
  }

  function stopPermissionPolling() {
    if (!state.permissionPolling) return;
    window.clearInterval(state.permissionPolling);
    state.permissionPolling = null;
  }

  function startSmartCheckup() {
    const ns = nativeState();
    if (!ns.broadStorageAccess) {
      renderNeedScan(ns);
      return;
    }
    if (ns.scannerRunning) {
      state.ownsScan = false;
      renderScanning(true);
      startPolling();
      return;
    }
    state.ownsScan = true;
    state.pendingPermissionScan = false;
    state.liveProgress = null;
    state.scanStartedAt = Date.now();
    state.items = [];
    state.selected.clear();
    const result = parse(NATIVE.startScan?.('smart', '[]', true), {accepted:false});
    if (!result.accepted) {
      if (result.reason === 'storage_access_required') { renderNeedScan(nativeState()); return; }
      if (result.reason === 'scan_already_running') {
        state.ownsScan = false;
        renderScanning(true);
        startPolling();
        return;
      }
      renderError(t('scanFailed'));
      return;
    }
    renderScanning(false);
    startPolling();
  }

  function startPolling() {
    if (state.polling) return;
    state.polling = window.setInterval(() => {
      if (!state.open) { stopPolling(); return; }
      suppressAutoResults();
      const ns = nativeState();
      if (ns.scannerRunning) return;
      stopPolling();
      suppressAutoResults();
      state.summary = reviewSummary();
      if (state.summary?.available) loadCandidates();
      else renderError(t('scanFailed'));
    }, POLL_MS);
  }
  function stopPolling() {
    if (!state.polling) return;
    window.clearInterval(state.polling);
    state.polling = null;
  }

  function showConfirm() {
    if (state.deleting || state.selected.size === 0 || snapshotIsStale()) return;
    const count = state.selected.size;
    const bytes = selectedBytes();
    const sheet = byId('baQcConfirm');
    const card = byId('baQcConfirmCard');
    card.innerHTML = `<span class="ba-qc-confirm-kicker">${esc(t('confirmKicker'))}</span><h3>${esc(t('confirmTitle'))}</h3><p>${esc(t('confirmBody'))}</p><div class="ba-qc-confirm-metric"><strong>${esc(t('selectedSummary',{count,bytes:formatBytes(bytes)}))}</strong><b>${esc(formatBytes(bytes))}</b></div><div class="ba-qc-proof">${svg('shield')}<span>${esc(t('proof'))}</span></div><div class="ba-qc-confirm-actions"><button class="ba-qc-secondary" id="baQcConfirmCancel" type="button">${esc(t('cancel'))}</button><button class="ba-qc-danger" id="baQcDelete" type="button">${esc(t('deleteVerify'))}</button></div>`;
    sheet.hidden = false;
    byId('baQcConfirmCancel').addEventListener('click', hideConfirm);
    byId('baQcDelete').addEventListener('click', deleteSelected);
  }
  function hideConfirm() { const sheet = byId('baQcConfirm'); if (sheet) sheet.hidden = true; }

  function deleteSelected() {
    if (state.deleting || state.selected.size === 0 || snapshotIsStale()) { hideConfirm(); refreshWorkspace(); return; }
    state.deleting = true;
    const button = byId('baQcDelete');
    if (button) { button.disabled = true; button.textContent = t('deleting'); }
    const ids = [...state.selected].slice(0, MAX_BATCH);
    window.requestAnimationFrame(() => window.setTimeout(() => {
      let result;
      try { result = parse(NATIVE.deleteReviewCandidates?.(JSON.stringify(ids)), {accepted:false}); }
      catch (_) { result = {accepted:false, reason:'bridge_error'}; }
      state.deleting = false;
      hideConfirm();
      if (!result.accepted) {
        renderError(result.reason === 'scan_running' ? t('scanElsewhere') : t('errorTitle'));
        return;
      }
      state.lastDelete = result;
      state.summary = result.reviewSummary || reviewSummary();
      renderDeleteResult(result);
      refreshHomeFromNative();
    }, 0));
  }

  function renderDeleteResult(result) {
    const deleted = safeNumber(result.deletedCount);
    const reclaimed = safeNumber(result.reclaimedBytes);
    const failedCount = Array.isArray(result.failed) ? result.failed.length : safeNumber(result.failed?.length);
    const protectedCount = Array.isArray(result.protectedIds) ? result.protectedIds.length : safeNumber(result.protectedIds?.length);
    const notes = [
      failedCount > 0 ? `<div class="ba-qc-result-note"><strong>${esc(t('failedTitle'))}</strong>${esc(t('failedBody',{count:failedCount}))}</div>` : '',
      protectedCount > 0 ? `<div class="ba-qc-result-note"><strong>${esc(t('protectedTitle'))}</strong>${esc(t('protectedBody',{count:protectedCount}))}</div>` : '',
    ].filter(Boolean).join('');
    byId('baQcBody').innerHTML = `<section class="ba-qc-result"><div class="ba-qc-result-card"><div class="ba-qc-result-check">${svg('check')}</div><span class="ba-qc-result-kicker">${esc(t('doneKicker'))}</span><h3>${esc(t('doneTitle'))}</h3><div class="ba-qc-result-bytes">${esc(formatBytes(reclaimed))}</div><div class="ba-qc-result-label">${esc(t('reclaimed'))} · ${esc(deleted)} ${esc(t('removed'))}</div><p>${esc(t('verifiedBody'))}</p>${notes ? `<div class="ba-qc-result-notes">${notes}</div>` : ''}</div><div class="ba-qc-result-actions"><button class="ba-qc-secondary" id="baQcResultDone" type="button">${esc(t('done'))}</button><button class="ba-qc-primary" id="baQcRemaining" type="button">${esc(t('reviewRemaining'))}</button></div></section>`;
    byId('baQcResultDone').addEventListener('click', closeSurface);
    byId('baQcRemaining').addEventListener('click', refreshWorkspace);
  }

  function refreshHomeFromNative() {
    const payload = parse(NATIVE.getReviewCandidates?.('lowrisk', 0, 1), {available:false,totalCount:0});
    if (payload.available) updateHomeCard(payload.totalCount);
  }

  function openSurface(source='home') {
    ensureSurface();
    state.open = true;
    state.source = source;
    state.ownsScan = false;
    state.pendingPermissionScan = false;
    byId('baQuickClean').hidden = false;
    refreshWorkspace();
  }

  function closeSurface() {
    state.open = false;
    state.pendingPermissionScan = false;
    stopPolling();
    stopPermissionPolling();
    hideConfirm();
    const surface = byId('baQuickClean');
    if (surface) surface.hidden = true;
    if (state.source === 'results') return;
    if (nativeState().scannerRunning) return;
    const results = byId('nativeResultsSheet');
    if (results) results.hidden = true;
    const destination = state.source === 'tools' ? 'tools' : 'home';
    const nav = document.querySelector(`[data-nav="${destination}"]`);
    if (nav && !nav.classList.contains('is-active')) nav.click();
  }

  function sourceFor(button) {
    if (button.closest('#toolsScreen')) return 'tools';
    return 'home';
  }

  document.addEventListener('click', (event) => {
    const button = event.target?.closest?.('[data-tool="cleanup"]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openSurface(sourceFor(button));
  }, true);

  function handleForegroundReturn() {
    if (!state.open) return;
    if (state.pendingPermissionScan) {
      const ns = nativeState();
      if (ns.broadStorageAccess) {
        state.pendingPermissionScan = false;
        stopPermissionPolling();
        startSmartCheckup();
      } else renderNeedScan(ns);
      return;
    }
    refreshWorkspace();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') handleForegroundReturn();
  });
  window.addEventListener('focus', handleForegroundReturn);
  window.addEventListener('pageshow', handleForegroundReturn);

  function wrapNativeCallbacks() {
    const base = window.BearagnosticAndroid;
    if (!base || base.__quickCleanTrustWrapped) return false;
    window.BearagnosticAndroid = Object.freeze({
      ...base,
      __quickCleanTrustWrapped: true,
      onNativeStateChanged(raw) { base.onNativeStateChanged?.(raw); },
      onScanProgress(raw) {
        base.onScanProgress?.(raw);
        state.liveProgress = parse(raw, {});
        if (state.open && byId('baQcLivePhase')) updateScanningEvidence();
      },
      onScanComplete(raw) {
        base.onScanComplete?.(raw);
        if (!state.open) return;
        state.liveProgress = parse(raw, state.liveProgress || {});
        window.setTimeout(refreshWorkspace, 0);
      },
      onScanCancelled(raw) {
        base.onScanCancelled?.(raw);
        if (state.open && state.ownsScan) window.setTimeout(() => renderError(t('scanFailed')), 0);
      },
      onScanError(raw) {
        base.onScanError?.(raw);
        if (state.open && state.ownsScan) window.setTimeout(() => renderError(t('scanFailed')), 0);
      },
    });
    state.callbackWrapped = true;
    return true;
  }

  function scheduleCallbackWrap() {
    if (wrapNativeCallbacks()) return;
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (wrapNativeCallbacks() || attempts >= 20) window.clearInterval(timer);
    }, 50);
  }

  window.addEventListener('bearagnostic:languagechange', () => {
    if (state.open) refreshWorkspace();
    else refreshHomeFromNative();
  });

  document.addEventListener('DOMContentLoaded', () => {
    ensureSurface();
    refreshHomeFromNative();
  }, {once:true});

  ensureSurface();
  refreshHomeFromNative();
  scheduleCallbackWrap();

  window.BearagnosticQuickClean = Object.freeze({
    build: BUILD,
    open: () => openSurface('external'),
    refresh: refreshWorkspace,
  });
})();
