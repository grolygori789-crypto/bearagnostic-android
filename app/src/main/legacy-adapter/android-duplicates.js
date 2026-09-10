(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  const ENT = window.BearagnosticEntitlement;
  if (!NATIVE) return;

  const BUILD = 30;
  const REVIEW_PAGE_SIZE = 250;
  const RENDER_BATCH = 14;
  const MAX_DELETE_SELECTION = 500;
  const STALE_REVIEW_MS = 15 * 60 * 1000;
  const POLL_MS = 350;

  const byId = (id) => document.getElementById(id);
  const parse = (value, fallback={}) => {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  };
  const n = (value) => Math.max(0, Number(value) || 0);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  const ICONS = Object.freeze({
    duplicate: '<rect x="4" y="6" width="11" height="13" rx="2"/><rect x="9" y="3" width="11" height="13" rx="2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    shield: '<path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6Z"/><path d="m9 12 2 2 4-4"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>',
    file: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/>',
    image: '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.3"/><path d="m6 17 4-4 3 3 2-2 3 3"/>',
    video: '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    audio: '<path d="M9 18V7l9-2v11"/><circle cx="6.5" cy="18" r="2.3"/><circle cx="15.5" cy="16" r="2.3"/>',
    document: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M10 12h5M10 15h5"/>',
    apk: '<path d="M7 8h10v10H7zM9 5l-1.2-2M15 5l1.2-2M9.5 12h.01M14.5 12h.01"/>',
    archive: '<path d="M5 7h14v12H5zM4 4h16v3H4zM10 11h4"/>',
    lock: '<rect x="6" y="10" width="12" height="10" rx="2"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10"/>',
  });

  const COPY = {
    en: {
      kicker:'EXACT DUPLICATES', title:'Keep one. Remove the extras.',
      lead:'Bearagnostic groups only copies that were verified as identical. You choose what stays before anything is removed.',
      noAccessTitle:'Storage access is needed', noAccessBody:'Android must allow shared-storage access before Bearagnostic can verify duplicate files.', openSettings:'Open Android settings',
      noSnapshotTitle:'Verify duplicates with Smart Checkup', noSnapshotBody:'There is no current duplicate-verification snapshot yet. Smart Checkup verifies exact matches in priority shared folders without deleting anything.', runSmart:'Run Smart Checkup',
      quickTitle:'This Quick Scan did not verify duplicates', quickBody:'Quick Scan intentionally avoids duplicate hashing. Run Smart Checkup for exact duplicate verification.',
      customTitle:'Refresh duplicate verification', customBody:'This Custom Scan did not surface a verified duplicate group. Run Smart Checkup to verify exact matches in the recommended shared folders.',
      scanningTitle:'Verifying exact duplicate evidence', scanningBody:'This follows the scanner’s real work. No waiting time is added for appearance.',
      source:'SOURCE', scope:'COVERAGE', evidence:'EVIDENCE', sourceLive:'Live checkup', focused:'Priority shared folders', full:'All accessible shared storage', selectedScope:'Selected Custom Scan locations', exact:'Exact match verification',
      phasePreparing:'Discovering files', phaseDetails:'Reading file details', phaseSizes:'Matching file sizes', phaseDuplicates:'Verifying identical content', phaseDates:'Checking modified dates', phaseFinalizing:'Building verified groups',
      filesReviewed:'Files reviewed', hashedFiles:'Files verified', hashedBytes:'Verification data read', waiting:'Preparing the next item…', localLive:'LOCAL · LIVE',
      groups:'Duplicate groups', extras:'Removable copies', reclaimable:'Reclaimable', checked:'Checked', current:'just now', minAgo:'min ago',
      trustTitle:'Why these are duplicates', trustBody:'Bearagnostic first matches exact file size, then verifies the file content byte-for-byte on this device. Similar-looking files are not enough.',
      focusedTitle:'Focused duplicate coverage', focusedBody:'Smart Checkup checks priority shared folders for exact duplicates. Pro can run Deep Scan to check across all accessible shared storage.', fullTitle:'Full duplicate coverage', fullBody:'This result came from Deep Scan, which checks for exact duplicates across the accessible shared-storage scope.', customCoverageTitle:'Custom duplicate coverage', customCoverageBody:'This result contains verified duplicates from the selected Custom Scan locations.',
      verifyAll:'Verify all accessible storage', pro:'PRO',
      noDupTitle:'No exact duplicate groups verified', noDupBody:'No byte-for-byte duplicate group was verified in this scan’s duplicate coverage. Similar files are intentionally not treated as duplicates.', checkAgain:'Check again', done:'Done',
      loadingGroups:'Preparing duplicate groups', loadingBody:'Grouping verified copies from the current review snapshot.', loaded:'loaded',
      group:'Group', copies:'identical copies', canReclaim:'can be reclaimed', exactBadge:'EXACT MATCH', keep:'KEEP', keepThis:'Keep this', remove:'Remove',
      removeExtras:'Select extras', clearGroup:'Clear group', selected:'selected', clearAll:'Clear', bulkSelect:'Select recommended', bulkPro:'Select recommended · PRO',
      bulkFreeHint:'Pro can select the recommended extra copies across all groups at once. Free users can still review and select every group manually.',
      loadMore:'Load more groups', showing:'Showing {shown} of {total} groups', staleTitle:'Refresh before deleting', staleBody:'This review snapshot is more than 15 minutes old. Re-verify duplicates before permanent deletion.',
      reviewSelected:'Review selected', selectedSummary:'{count} copies · {bytes}', limit:'Up to 500 selected files can be deleted in one verified batch.',
      confirmKicker:'FINAL REVIEW', confirmTitle:'Remove the selected duplicate copies?', confirmBody:'Only the selected copies will be permanently deleted. The copy marked Keep in every group remains unselected.', groupsAffected:'groups affected', protection:'Keep-one-copy protection remains active in the native deletion layer too.', cancel:'Cancel', deleteVerify:'Delete & verify', deleting:'Deleting and verifying…',
      resultKicker:'VERIFIED DUPLICATE CLEANUP', resultTitle:'Duplicate cleanup complete', reclaimedLabel:'verified space reclaimed', removedLabel:'copies removed', resolvedLabel:'groups resolved', nativeProtected:'native protections', failed:'not removed', resultBody:'Only files Android confirmed as gone are counted as removed or reclaimed.', reviewRemaining:'Review remaining',
      errorTitle:'Duplicates could not continue', retry:'Try again', scanFailed:'The duplicate check could not start.', scanRunning:'Another checkup is already running. Bearagnostic will use its review snapshot when it finishes.',
      homeFound:'{groups} groups · {extras} extras', toolsFound:'{groups} verified groups · {extras} removable copies', homeClear:'No exact repeats', toolsClear:'No exact duplicate groups', homeNeeds:'Run Smart check', toolsNeeds:'Run Smart Checkup to verify duplicates',
      kindImage:'Photo', kindVideo:'Video', kindAudio:'Audio', kindDocument:'Document', kindApk:'APK', kindArchive:'Archive', kindOther:'File',
      dateUnknown:'Date unavailable', moreGroups:'More verified groups are available below.', partial:'Review details reached the safety display limit. Only groups present in this current verified snapshot are shown.'
    },
    th: {
      kicker:'ไฟล์ซ้ำแบบ EXACT', title:'เก็บหนึ่งสำเนา ลบเฉพาะส่วนเกิน',
      lead:'Bearagnostic จัดกลุ่มเฉพาะไฟล์ที่ยืนยันแล้วว่าเหมือนกันจริง คุณเป็นคนเลือกว่าจะเก็บอะไรไว้ก่อนมีการลบ',
      noAccessTitle:'ต้องอนุญาตการเข้าถึงพื้นที่จัดเก็บ', noAccessBody:'Android ต้องอนุญาต shared storage ก่อนที่ Bearagnostic จะตรวจยืนยันไฟล์ซ้ำได้', openSettings:'เปิดการตั้งค่า Android',
      noSnapshotTitle:'ตรวจไฟล์ซ้ำด้วย Smart Checkup', noSnapshotBody:'ยังไม่มี snapshot ปัจจุบันที่ผ่านการยืนยันไฟล์ซ้ำ Smart Checkup จะตรวจ exact match ในโฟลเดอร์ shared ที่สำคัญโดยยังไม่ลบอะไร', runSmart:'เริ่ม Smart Checkup',
      quickTitle:'Quick Scan รอบนี้ไม่ได้ตรวจยืนยันไฟล์ซ้ำ', quickBody:'Quick Scan ตั้งใจไม่ทำ duplicate hashing เพื่อเน้นความเร็ว ให้ใช้ Smart Checkup เพื่อยืนยันไฟล์ซ้ำแบบ exact',
      customTitle:'ตรวจไฟล์ซ้ำใหม่', customBody:'Custom Scan รอบนี้ยังไม่แสดงกลุ่มไฟล์ซ้ำที่ยืนยันแล้ว ให้ใช้ Smart Checkup เพื่อตรวจ exact match ในตำแหน่ง shared ที่แนะนำ',
      scanningTitle:'กำลังยืนยันหลักฐานไฟล์ซ้ำ', scanningBody:'หน้านี้เดินตามงานจริงของตัวสแกน ไม่มีการหน่วงเวลาเพื่อให้ดูนาน',
      source:'แหล่งข้อมูล', scope:'ขอบเขต', evidence:'หลักฐาน', sourceLive:'การตรวจที่กำลังทำงาน', focused:'โฟลเดอร์ shared สำคัญ', full:'shared storage ที่เข้าถึงได้ทั้งหมด', selectedScope:'ตำแหน่ง Custom Scan ที่เลือก', exact:'ยืนยันว่าเหมือนกันจริง',
      phasePreparing:'กำลังค้นหาไฟล์', phaseDetails:'กำลังอ่านรายละเอียดไฟล์', phaseSizes:'กำลังจับคู่ขนาดไฟล์', phaseDuplicates:'กำลังยืนยันเนื้อหาที่ตรงกัน', phaseDates:'กำลังตรวจวันที่แก้ไข', phaseFinalizing:'กำลังสร้างกลุ่มที่ยืนยันแล้ว',
      filesReviewed:'ไฟล์ที่ตรวจแล้ว', hashedFiles:'ไฟล์ที่ยืนยันแล้ว', hashedBytes:'ข้อมูลที่อ่านเพื่อยืนยัน', waiting:'กำลังเตรียมรายการถัดไป…', localLive:'บนเครื่อง · เรียลไทม์',
      groups:'กลุ่มไฟล์ซ้ำ', extras:'สำเนาที่ลบได้', reclaimable:'พื้นที่ที่คืนได้', checked:'ตรวจเมื่อ', current:'เมื่อสักครู่', minAgo:'นาทีที่แล้ว',
      trustTitle:'ทำไมจึงถือว่าเป็นไฟล์ซ้ำ', trustBody:'Bearagnostic จับคู่ขนาดไฟล์ที่ตรงกันก่อน แล้วตรวจเนื้อหาแบบ byte-for-byte ภายในเครื่อง ไฟล์ที่เพียงดูคล้ายกันจะไม่ถูกนับเป็นไฟล์ซ้ำ',
      focusedTitle:'ขอบเขตไฟล์ซ้ำแบบ Focused', focusedBody:'Smart Checkup ตรวจหาไฟล์ซ้ำแบบ exact ในโฟลเดอร์ shared สำคัญ ส่วน Pro สามารถใช้ Deep Scan เพื่อตรวจทั่ว shared storage ที่เข้าถึงได้', fullTitle:'ขอบเขตไฟล์ซ้ำเต็มพื้นที่', fullBody:'ผลนี้มาจาก Deep Scan ซึ่งตรวจหาไฟล์ซ้ำแบบ exact ทั่วขอบเขต shared storage ที่เข้าถึงได้', customCoverageTitle:'ขอบเขตไฟล์ซ้ำแบบ Custom', customCoverageBody:'ผลนี้เป็นไฟล์ซ้ำที่ยืนยันแล้วจากตำแหน่ง Custom Scan ที่เลือก',
      verifyAll:'ตรวจทั่วพื้นที่ที่เข้าถึงได้', pro:'PRO',
      noDupTitle:'ไม่มีกลุ่มไฟล์ซ้ำแบบ exact ที่ยืนยันได้', noDupBody:'ไม่พบกลุ่มไฟล์ที่ยืนยันว่าเหมือนกันทุกไบต์ภายในขอบเขตการตรวจรอบนี้ ไฟล์ที่แค่ดูคล้ายกันจะไม่ถูกเหมารวมเป็นไฟล์ซ้ำ', checkAgain:'ตรวจอีกครั้ง', done:'เสร็จสิ้น',
      loadingGroups:'กำลังเตรียมกลุ่มไฟล์ซ้ำ', loadingBody:'กำลังจัดกลุ่มสำเนาที่ผ่านการยืนยันจาก review snapshot ปัจจุบัน', loaded:'โหลดแล้ว',
      group:'กลุ่ม', copies:'สำเนาที่เหมือนกัน', canReclaim:'คืนพื้นที่ได้', exactBadge:'ตรงกันจริง', keep:'เก็บไว้', keepThis:'เก็บไฟล์นี้', remove:'ลบ',
      removeExtras:'เลือกสำเนาส่วนเกิน', clearGroup:'ล้างกลุ่ม', selected:'เลือกแล้ว', clearAll:'ล้างทั้งหมด', bulkSelect:'เลือกตามคำแนะนำ', bulkPro:'เลือกตามคำแนะนำ · PRO',
      bulkFreeHint:'Pro เลือกสำเนาส่วนเกินตามคำแนะนำให้ทุกกลุ่มได้ในครั้งเดียว ส่วน Free ยังตรวจและเลือกแต่ละกลุ่มเองได้ครบ',
      loadMore:'แสดงกลุ่มเพิ่ม', showing:'กำลังแสดง {shown} จาก {total} กลุ่ม', staleTitle:'ตรวจใหม่ก่อนลบ', staleBody:'review snapshot นี้เกิน 15 นาทีแล้ว ให้ตรวจยืนยันไฟล์ซ้ำใหม่ก่อนลบแบบถาวร',
      reviewSelected:'ตรวจรายการที่เลือก', selectedSummary:'{count} สำเนา · {bytes}', limit:'หนึ่งรอบที่ยืนยันแล้วสามารถลบได้สูงสุด 500 ไฟล์',
      confirmKicker:'ตรวจครั้งสุดท้าย', confirmTitle:'ลบสำเนาไฟล์ซ้ำที่เลือก?', confirmBody:'จะลบถาวรเฉพาะสำเนาที่เลือก และไฟล์ที่ทำเครื่องหมายว่า “เก็บไว้” ในแต่ละกลุ่มจะไม่ถูกเลือก', groupsAffected:'กลุ่มที่ได้รับผล', protection:'Native deletion layer ยังมีกฎป้องกันการลบสำเนาสุดท้ายอีกชั้นหนึ่ง', cancel:'ยกเลิก', deleteVerify:'ลบและตรวจยืนยัน', deleting:'กำลังลบและตรวจยืนยัน…',
      resultKicker:'ผลการจัดการไฟล์ซ้ำที่ยืนยันแล้ว', resultTitle:'จัดการไฟล์ซ้ำเรียบร้อย', reclaimedLabel:'พื้นที่ที่คืนได้จริง', removedLabel:'สำเนาที่ลบแล้ว', resolvedLabel:'กลุ่มที่จัดการจบ', nativeProtected:'รายการที่ระบบปกป้อง', failed:'รายการที่ลบไม่สำเร็จ', resultBody:'นับเป็นไฟล์ที่ลบและพื้นที่ที่คืนได้เฉพาะรายการที่ Android ยืนยันแล้วว่าหายจริง', reviewRemaining:'ดูรายการที่เหลือ',
      errorTitle:'ระบบไฟล์ซ้ำทำงานต่อไม่ได้', retry:'ลองอีกครั้ง', scanFailed:'ไม่สามารถเริ่มการตรวจไฟล์ซ้ำได้', scanRunning:'มีการตรวจเครื่องทำงานอยู่แล้ว Bearagnostic จะใช้ review snapshot เมื่อการตรวจนั้นเสร็จ',
      homeFound:'{groups} กลุ่ม · {extras} ซ้ำ', toolsFound:'{groups} กลุ่มที่ยืนยันแล้ว · ลบได้ {extras} สำเนา', homeClear:'ไม่มีไฟล์ซ้ำแบบ exact', toolsClear:'ไม่มีกลุ่มไฟล์ซ้ำแบบ exact', homeNeeds:'ใช้ Smart Scan', toolsNeeds:'ใช้ Smart Checkup เพื่อตรวจไฟล์ซ้ำ',
      kindImage:'รูปภาพ', kindVideo:'วิดีโอ', kindAudio:'เสียง', kindDocument:'เอกสาร', kindApk:'APK', kindArchive:'ไฟล์บีบอัด', kindOther:'ไฟล์',
      dateUnknown:'ไม่มีข้อมูลวันที่', moreGroups:'ยังมีกลุ่มที่ยืนยันแล้วให้ดูต่อด้านล่าง', partial:'รายละเอียด review แตะขีดจำกัดเพื่อความปลอดภัย จะแสดงเฉพาะกลุ่มที่อยู่ใน snapshot ที่ยืนยันแล้วนี้'
    },
    ja: {
      kicker:'完全一致の重複', title:'1つ残して、余分なコピーだけ整理',
      lead:'Bearagnostic が同一と検証したコピーだけをグループ化します。削除前に残すファイルを自分で選べます。',
      noAccessTitle:'ストレージへのアクセスが必要です', noAccessBody:'重複を検証するには Android の共有ストレージアクセスが必要です。', openSettings:'Android 設定を開く',
      noSnapshotTitle:'Smart Checkup で重複を検証', noSnapshotBody:'現在の重複検証スナップショットがありません。Smart Checkup は重要な共有フォルダで完全一致を確認し、この時点では削除しません。', runSmart:'Smart Checkup を実行',
      quickTitle:'この Quick Scan は重複を検証していません', quickBody:'Quick Scan は速度を優先して重複ハッシュを行いません。完全一致の確認には Smart Checkup を使ってください。',
      customTitle:'重複検証を更新', customBody:'この Custom Scan では検証済み重複グループが確認できません。Smart Checkup で推奨共有フォルダを検証してください。',
      scanningTitle:'完全一致の証拠を検証中', scanningBody:'実際のスキャン処理に連動します。見せかけの待ち時間は追加しません。',
      source:'ソース', scope:'範囲', evidence:'証拠', sourceLive:'実行中のチェック', focused:'重要な共有フォルダ', full:'アクセス可能な共有ストレージ全体', selectedScope:'選択した Custom Scan 場所', exact:'完全一致を検証',
      phasePreparing:'ファイルを探索中', phaseDetails:'ファイル情報を確認中', phaseSizes:'同サイズを照合中', phaseDuplicates:'同一内容を検証中', phaseDates:'更新日を確認中', phaseFinalizing:'検証済みグループを作成中',
      filesReviewed:'確認済みファイル', hashedFiles:'検証済みファイル', hashedBytes:'検証で読み取った量', waiting:'次の項目を準備中…', localLive:'端末内 · リアルタイム',
      groups:'重複グループ', extras:'削除可能コピー', reclaimable:'解放可能', checked:'確認時刻', current:'たった今', minAgo:'分前',
      trustTitle:'なぜ重複と判断できるのか', trustBody:'まずファイルサイズを一致させ、その後端末内で内容をバイト単位で照合します。見た目が似ているだけでは重複扱いしません。',
      focusedTitle:'重点範囲の重複検証', focusedBody:'Smart Checkup は重要な共有フォルダで完全一致の重複を確認します。Pro の Deep Scan ではアクセス可能な共有ストレージ全体を確認できます。', fullTitle:'全範囲の重複検証', fullBody:'Deep Scan の結果で、アクセス可能な共有ストレージ全体から完全一致の重複を確認しています。', customCoverageTitle:'Custom の重複検証', customCoverageBody:'選択した Custom Scan 場所で検証された重複です。',
      verifyAll:'アクセス可能範囲をすべて検証', pro:'PRO',
      noDupTitle:'検証できた完全一致の重複グループはありません', noDupBody:'この検証範囲ではバイト単位で同一の重複グループは確認されませんでした。似ているだけのファイルは重複扱いしません。', checkAgain:'再チェック', done:'完了',
      loadingGroups:'重複グループを準備中', loadingBody:'現在のレビュースナップショットから検証済みコピーをまとめています。', loaded:'読込済み',
      group:'グループ', copies:'同一コピー', canReclaim:'解放可能', exactBadge:'完全一致', keep:'残す', keepThis:'これを残す', remove:'削除',
      removeExtras:'余分を選択', clearGroup:'グループ解除', selected:'選択済み', clearAll:'すべて解除', bulkSelect:'推奨を一括選択', bulkPro:'推奨を一括選択 · PRO',
      bulkFreeHint:'Pro は全グループの推奨余分コピーを一括選択できます。Free でも各グループを手動で確認・選択できます。',
      loadMore:'さらにグループを表示', showing:'{total} 組中 {shown} 組を表示', staleTitle:'削除前に再検証', staleBody:'このレビュースナップショットは15分以上前です。完全削除の前に重複を再検証してください。',
      reviewSelected:'選択内容を確認', selectedSummary:'{count} コピー · {bytes}', limit:'検証済み1バッチで削除できるのは最大500ファイルです。',
      confirmKicker:'最終確認', confirmTitle:'選択した重複コピーを削除しますか？', confirmBody:'選択したコピーだけを完全に削除します。各グループで「残す」と表示されたコピーは選択されません。', groupsAffected:'対象グループ', protection:'Native 削除層でも最低1コピーを残す保護が有効です。', cancel:'キャンセル', deleteVerify:'削除して検証', deleting:'削除して確認中…',
      resultKicker:'検証済み重複整理', resultTitle:'重複整理が完了しました', reclaimedLabel:'実際に解放した容量', removedLabel:'削除したコピー', resolvedLabel:'解決したグループ', nativeProtected:'Native 保護', failed:'削除できず', resultBody:'Android が実際に削除を確認したファイルだけを削除数と解放容量に含めます。', reviewRemaining:'残りを確認',
      errorTitle:'重複整理を続行できません', retry:'もう一度試す', scanFailed:'重複チェックを開始できませんでした。', scanRunning:'別のチェックが実行中です。完了後のレビュースナップショットを使用します。',
      homeFound:'{groups}組 · 余分{extras}', toolsFound:'検証済み{groups}組 · 削除可能{extras}', homeClear:'完全一致なし', toolsClear:'完全一致の重複なし', homeNeeds:'Smart で確認', toolsNeeds:'Smart Checkup で重複を検証',
      kindImage:'写真', kindVideo:'動画', kindAudio:'音声', kindDocument:'書類', kindApk:'APK', kindArchive:'アーカイブ', kindOther:'ファイル',
      dateUnknown:'日付情報なし', moreGroups:'下に追加の検証済みグループがあります。', partial:'安全上のレビュー詳細上限に達しました。この検証済みスナップショット内のグループだけを表示します。'
    }
  };

  const state = {
    open:false, source:'home', ownsScan:false, pendingPermissionScan:false,
    summary:null, rawItems:[], groups:[], selected:new Set(), keepByGroup:new Map(),
    visibleGroups:RENDER_BATCH, loadToken:0, polling:null, permissionPolling:null,
    permissionStartedAt:0, lastProgress:null, deleting:false, cachedActiveCandidateCount:null,
    mediaPending:new Map(), mediaCache:new Map(), mediaSeq:0,
  };

  function lang() {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
  }
  function t(key, vars={}) {
    let value = (COPY[lang()] || COPY.en)[key] || COPY.en[key] || key;
    Object.entries(vars).forEach(([name,replacement]) => { value = value.split(`{${name}}`).join(String(replacement)); });
    return value;
  }
  function svg(name) { return `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.file}</svg>`; }
  function formatCount(value) {
    try { return new Intl.NumberFormat(lang()==='th'?'th-TH':lang()==='ja'?'ja-JP':'en-US').format(Math.round(n(value))); }
    catch (_) { return String(Math.round(n(value))); }
  }
  function formatBytes(value) {
    const bytes=n(value); if (bytes<1024) return `${Math.round(bytes)} B`;
    const units=['KB','MB','GB','TB']; let amount=bytes/1024,index=0;
    while(amount>=1024&&index<units.length-1){amount/=1024;index++;}
    return `${amount.toFixed(amount>=100?0:amount>=10?1:2)} ${units[index]}`;
  }
  function formatDate(ms) {
    const value=n(ms); if(!value) return t('dateUnknown');
    try { return new Intl.DateTimeFormat(lang()==='th'?'th-TH':lang()==='ja'?'ja-JP':'en-US',{year:'numeric',month:'short',day:'numeric'}).format(new Date(value)); }
    catch (_) { return new Date(value).toLocaleDateString(); }
  }
  function ageText(ms) {
    const value=n(ms); if(!value) return t('current');
    const minutes=Math.floor(Math.max(0,Date.now()-value)/60000);
    if(minutes<1) return t('current');
    if(minutes<60) return `${minutes} ${t('minAgo')}`;
    const hours=Math.floor(minutes/60); if(hours<24) return lang()==='th'?`${hours} ชม.ที่แล้ว`:lang()==='ja'?`${hours}時間前`:`${hours}h ago`;
    const days=Math.floor(hours/24); return lang()==='th'?`${days} วันที่แล้ว`:lang()==='ja'?`${days}日前`:`${days}d ago`;
  }
  function reviewSummary(){ return parse(NATIVE.getReviewSummary?.(),{available:false}); }
  function nativeState(){ return parse(NATIVE.getNativeState?.(),{}); }
  function snapshotStale(){ return n(state.summary?.generatedAtMs)>0 && Date.now()-n(state.summary.generatedAtMs)>STALE_REVIEW_MS; }
  function scanMode(){ return String(state.summary?.scanMode||'').toLowerCase(); }
  function verificationIsTrustworthyForZero(){ return ['smart','deep'].includes(scanMode()); }
  function coverageLabel(){ return scanMode()==='deep'?t('full'):scanMode()==='custom'?t('selectedScope'):t('focused'); }
  function phaseLabel(phase){
    const p=String(phase||'preparing');
    return p==='file_details'?t('phaseDetails'):p==='file_sizes'?t('phaseSizes'):p==='duplicates'?t('phaseDuplicates'):p==='modified_dates'?t('phaseDates'):p==='finalizing'?t('phaseFinalizing'):t('phasePreparing');
  }
  function kindName(kind){ return t(kind==='image'?'kindImage':kind==='video'?'kindVideo':kind==='audio'?'kindAudio':kind==='document'?'kindDocument':kind==='apk'?'kindApk':kind==='archive'?'kindArchive':'kindOther'); }
  function memberKind(member){ const kind=String(member?.fileKind||'other'); return ICONS[kind]?kind:'file'; }

  function ensureStyle(){
    if(byId('androidDuplicates30Style')) return;
    const style=document.createElement('style'); style.id='androidDuplicates30Style';
    style.textContent=`
      .ba-dup{position:fixed;inset:0;z-index:1880;padding:max(10px,env(safe-area-inset-top)) 10px max(10px,env(safe-area-inset-bottom));background:radial-gradient(circle at 84% 2%,rgba(118,90,223,.13),transparent 29%),radial-gradient(circle at 12% 0%,rgba(32,184,239,.10),transparent 26%),linear-gradient(180deg,#edf5fb,#eaf2f8);color:#1b3046;overflow:hidden}.ba-dup[hidden]{display:none!important}
      .ba-dup-panel{height:100%;width:min(100%,580px);margin:0 auto;border-radius:34px;background:linear-gradient(180deg,rgba(255,255,255,.995),rgba(248,250,255,.995));border:1px solid rgba(255,255,255,.98);box-shadow:0 26px 78px rgba(44,52,105,.17),inset 0 1px 0 #fff;display:grid;grid-template-rows:auto minmax(0,1fr);overflow:hidden}
      .ba-dup-head{display:grid;grid-template-columns:52px minmax(0,1fr) 42px;gap:12px;align-items:center;padding:17px 17px 12px;background:linear-gradient(180deg,#fff,rgba(253,253,255,.97));border-bottom:1px solid rgba(92,90,158,.07)}
      .ba-dup-mark{width:52px;height:52px;border-radius:18px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#9a77ef,#5f5ed6);box-shadow:0 11px 25px rgba(100,83,190,.19),inset 0 1px rgba(255,255,255,.36)}.ba-dup-mark svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}
      .ba-dup-kicker{display:block;font-size:9.5px;line-height:1.1;letter-spacing:.18em;font-weight:850;color:#7064bb;margin-bottom:5px}.ba-dup-head h2{margin:0;font-size:23px;line-height:1.08;letter-spacing:-.035em;color:#172a40}.ba-dup-head p{margin:6px 0 0;font-size:12.5px;line-height:1.45;color:#5c7084;max-width:44ch}.ba-dup-close{width:42px;height:42px;border-radius:15px;background:#f0f2f8;color:#5c6c81;font-size:23px;display:grid;place-items:center;border:1px solid rgba(93,103,148,.08)}
      .ba-dup-scroll{min-height:0;overflow:auto;overscroll-behavior:contain;padding:13px 16px 18px;scrollbar-width:none}.ba-dup-scroll::-webkit-scrollbar{display:none}
      .ba-dup-state{min-height:100%;display:grid;align-content:center;justify-items:center;text-align:center;padding:22px 7px}.ba-dup-state-icon{width:74px;height:74px;border-radius:25px;display:grid;place-items:center;margin-bottom:17px;background:linear-gradient(145deg,#f0ebff,#eaf5ff);color:#6a60ce;box-shadow:0 12px 30px rgba(77,77,143,.09),inset 0 1px #fff}.ba-dup-state-icon svg{width:35px;height:35px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}.ba-dup-state h3{font-size:22px;line-height:1.14;letter-spacing:-.03em;margin:0;color:#1a3047}.ba-dup-state p{font-size:13px;line-height:1.55;color:#5b7083;max-width:39ch;margin:9px auto 0}.ba-dup-state-actions{display:grid;grid-template-columns:auto auto;gap:9px;margin-top:18px}.ba-dup-state-actions.one{grid-template-columns:auto}
      .ba-dup-primary,.ba-dup-secondary,.ba-dup-danger{min-height:48px;border-radius:17px;font-size:13px;font-weight:770;border:0;padding:0 18px}.ba-dup-primary{color:#fff;background:linear-gradient(115deg,#8065df,#4f68d9 56%,#258edc);box-shadow:0 11px 24px rgba(82,82,190,.18)}.ba-dup-primary:disabled{opacity:.42;box-shadow:none}.ba-dup-secondary{color:#465d72;background:#eef3f8;border:1px solid rgba(91,121,149,.07)}.ba-dup-danger{color:#fff;background:linear-gradient(120deg,#b84550,#d15862);box-shadow:0 10px 22px rgba(184,69,80,.16)}
      .ba-dup-spinner{width:74px;height:74px;border-radius:50%;position:relative;margin-bottom:17px;background:linear-gradient(145deg,#f1edff,#ecf8ff);box-shadow:inset 0 0 0 1px rgba(92,86,167,.07)}.ba-dup-spinner:before{content:'';position:absolute;inset:10px;border-radius:50%;border:4px solid rgba(103,91,203,.14);border-top-color:#7161d2;animation:baDupSpin .82s linear infinite}.ba-dup-spinner:after{content:'';position:absolute;inset:25px;border-radius:50%;background:#fff;box-shadow:0 3px 10px rgba(73,72,122,.08)}@keyframes baDupSpin{to{transform:rotate(360deg)}}
      .ba-dup-evidence{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:17px;width:100%;max-width:520px}.ba-dup-evidence>div{min-width:0;padding:11px 10px;border-radius:18px;background:linear-gradient(145deg,#f7f5ff,#f3f8fe);border:1px solid rgba(103,91,191,.075);text-align:left}.ba-dup-evidence span{display:block;font-size:9.5px;letter-spacing:.09em;font-weight:820;color:#748398}.ba-dup-evidence strong{display:block;margin-top:5px;font-size:11.5px;line-height:1.3;color:#263d56}
      .ba-dup-live{width:100%;max-width:520px;margin-top:10px;padding:13px;border-radius:22px;background:#fff;border:1px solid rgba(87,103,161,.08);box-shadow:0 9px 24px rgba(53,74,112,.055);text-align:left}.ba-dup-live-top{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:10px;align-items:center}.ba-dup-live-icon{width:40px;height:40px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(145deg,#eeeaff,#edf7ff);color:#6a60ca}.ba-dup-live-icon svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7}.ba-dup-live-copy{min-width:0}.ba-dup-live-copy span{display:block;font-size:9.5px;font-weight:840;letter-spacing:.09em;color:#6b75b7}.ba-dup-live-copy strong{display:block;margin-top:3px;font-size:12.5px;color:#283d55;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-dup-live-pill{font-size:9.5px;color:#4a8d7d;background:#e8f7f2;border-radius:99px;padding:6px 8px;white-space:nowrap}.ba-dup-live-location{display:block;margin:7px 0 0 50px;font-size:11px;color:#75879a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-dup-live-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px}.ba-dup-live-metrics div{padding:9px 7px;border-radius:15px;background:#f5f8fc;text-align:center}.ba-dup-live-metrics b{display:block;font-size:13px;color:#263d56}.ba-dup-live-metrics span{display:block;margin-top:4px;font-size:9.5px;line-height:1.2;color:#7a8998}
      .ba-dup-overview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.ba-dup-metric{min-width:0;padding:12px 9px;border-radius:19px;background:linear-gradient(145deg,#f6f3ff,#f4f7ff);border:1px solid rgba(102,91,190,.08);text-align:center}.ba-dup-metric:nth-child(2){background:linear-gradient(145deg,#eef7ff,#f4f9fd)}.ba-dup-metric:nth-child(3){background:linear-gradient(145deg,#eefaf7,#f5fcfa)}.ba-dup-metric b{display:block;font-size:16px;line-height:1.08;color:#213850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-dup-metric span{display:block;margin-top:5px;font-size:10px;line-height:1.25;color:#64788b}
      .ba-dup-trust{display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:10px;align-items:center;margin-top:10px;padding:12px 13px;border-radius:20px;background:linear-gradient(135deg,#f3efff,#f4faff);border:1px solid rgba(103,91,190,.08)}.ba-dup-trust i{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;background:#e9e5fb;color:#6a60c8}.ba-dup-trust i svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7}.ba-dup-trust strong{display:block;font-size:12.5px;line-height:1.3;color:#30395e}.ba-dup-trust small{display:block;margin-top:4px;font-size:11px;line-height:1.45;color:#66738e}.ba-dup-pro-scan{min-height:36px;padding:0 10px;border-radius:12px;background:linear-gradient(145deg,#ede9ff,#edf6ff);border:1px solid rgba(101,91,190,.09);color:#6159ad;font-size:10px;font-weight:790;white-space:nowrap}.ba-dup-pro-scan b{font-size:9.5px;margin-left:3px;color:#8b6bc0}
      .ba-dup-toolbar{display:flex;align-items:center;gap:7px;margin:13px 1px 9px}.ba-dup-toolbar-copy{flex:1;min-width:0}.ba-dup-toolbar-copy strong{display:block;font-size:14px;color:#21384f}.ba-dup-toolbar-copy small{display:block;margin-top:3px;font-size:10.5px;color:#687c90}.ba-dup-chip{min-height:34px;padding:0 10px;border-radius:12px;background:#f0f3f8;border:1px solid rgba(91,115,145,.07);color:#607489;font-size:10px;font-weight:770;white-space:nowrap}.ba-dup-chip.bulk{background:linear-gradient(145deg,#efebff,#eef6ff);color:#6159ae;border-color:rgba(101,91,190,.09)}
      .ba-dup-pro-note{margin:-2px 1px 9px;padding:9px 11px;border-radius:15px;background:#faf7ff;color:#716b91;font-size:10.5px;line-height:1.42;border:1px solid rgba(111,96,188,.06)}
      .ba-dup-groups{display:grid;gap:10px}.ba-dup-group{padding:12px;border-radius:23px;background:#fff;border:1px solid rgba(91,102,154,.09);box-shadow:0 7px 20px rgba(58,72,111,.05)}.ba-dup-group-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:start}.ba-dup-group-title span{display:block;font-size:9.5px;letter-spacing:.1em;font-weight:850;color:#736bb5}.ba-dup-group-title strong{display:block;margin-top:4px;font-size:14px;color:#21364e}.ba-dup-group-save{text-align:right}.ba-dup-group-save b{display:block;font-size:13px;color:#168b78}.ba-dup-group-save small{display:block;margin-top:3px;font-size:9.5px;color:#718397}.ba-dup-exact{display:inline-flex;margin-top:6px;padding:4px 7px;border-radius:99px;background:#eeeaff;color:#655ab8;font-size:9.5px;font-weight:850;letter-spacing:.06em}
      .ba-dup-members{display:grid;gap:7px;margin-top:10px}.ba-dup-member{display:grid;grid-template-columns:auto 46px minmax(0,1fr) auto;gap:9px;align-items:center;padding:9px;border-radius:17px;background:#f7f9fc;border:1px solid rgba(91,119,151,.065)}.ba-dup-member.is-selected{background:linear-gradient(145deg,#f7f4ff,#f0f7ff);border-color:rgba(107,90,201,.15)}.ba-dup-member.is-keep{background:linear-gradient(145deg,#f0faf6,#f6fcfa);border-color:rgba(42,157,130,.11)}.ba-dup-member input{width:19px;height:19px;accent-color:#6a5fd0}.ba-dup-member input:disabled{opacity:.35}.ba-dup-visual{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;overflow:hidden;background:linear-gradient(145deg,#eef2ff,#edf7fc);color:#6670c7;border:1px solid rgba(91,102,161,.07)}.ba-dup-visual svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}.ba-dup-visual img{width:100%;height:100%;object-fit:cover;display:block}.ba-dup-file{min-width:0}.ba-dup-file strong{display:block;font-size:12.5px;line-height:1.25;color:#24384e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-dup-file small{display:block;margin-top:3px;font-size:10.5px;line-height:1.3;color:#6f8294;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-dup-file-meta{display:flex;gap:6px;align-items:center;margin-top:5px;font-size:9.5px;color:#82909e}.ba-dup-side{text-align:right;min-width:74px}.ba-dup-side b{display:block;font-size:11.5px;color:#2c4056}.ba-dup-keep-pill{display:inline-flex;align-items:center;gap:4px;margin-top:5px;padding:4px 7px;border-radius:99px;background:#e2f6ef;color:#17806b;font-size:10px;font-weight:850}.ba-dup-keep-pill svg{width:11px;height:11px;fill:none;stroke:currentColor;stroke-width:2}.ba-dup-keep-btn{min-height:32px;margin-top:5px;padding:0 9px;border-radius:10px;background:#edf1f7;color:#566b80;font-size:10px;font-weight:760}
      .ba-dup-group-actions{display:flex;justify-content:flex-end;gap:7px;margin-top:9px}.ba-dup-group-actions button{min-height:34px;padding:0 10px;border-radius:11px;font-size:10px;font-weight:770}.ba-dup-group-clear{background:#f1f4f8;color:#687a8c}.ba-dup-group-select{background:linear-gradient(145deg,#efebff,#eef5ff);color:#6058ad}
      .ba-dup-alert{margin-top:10px;padding:10px 11px;border-radius:16px;background:#fff7e8;border:1px solid rgba(198,145,48,.10);color:#745b2d;font-size:11px;line-height:1.45}.ba-dup-alert.info{background:#eff7fd;border-color:rgba(45,138,192,.08);color:#456b83}
      .ba-dup-more{width:100%;min-height:44px;margin-top:10px;border-radius:15px;background:#f0f4f9;color:#586e84;font-size:11.5px;font-weight:760;border:1px solid rgba(91,121,149,.07)}
      .ba-dup-footer{position:sticky;bottom:-18px;margin:12px -16px -18px;padding:10px 16px calc(15px + env(safe-area-inset-bottom,0px));background:linear-gradient(180deg,rgba(250,251,255,.82),#fbfcff 28%);border-top:1px solid rgba(91,105,153,.07);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}.ba-dup-footer-copy{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px}.ba-dup-footer-copy strong{font-size:12.5px;color:#283e55}.ba-dup-footer-copy small{font-size:10.5px;color:#6d7d91;text-align:right}.ba-dup-footer-actions{display:grid;grid-template-columns:.78fr 1.22fr;gap:9px}.ba-dup-footer button{width:100%}
      .ba-dup-confirm{position:fixed;inset:0;z-index:1900;display:grid;place-items:center;padding:20px;background:rgba(14,30,48,.38);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}.ba-dup-confirm[hidden]{display:none!important}.ba-dup-confirm-card{width:min(100%,440px);padding:19px;border-radius:27px;background:#fff;box-shadow:0 24px 70px rgba(21,46,72,.24)}.ba-dup-confirm-kicker{font-size:9px;letter-spacing:.18em;font-weight:850;color:#8a6ac1}.ba-dup-confirm-card h3{margin:6px 0 0;font-size:21px;line-height:1.12;color:#1b3046;letter-spacing:-.025em}.ba-dup-confirm-card>p{margin:8px 0 0;font-size:12.5px;line-height:1.52;color:#596f83}.ba-dup-confirm-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:12px}.ba-dup-confirm-metrics div{padding:10px 7px;border-radius:15px;background:#f5f5fb;text-align:center}.ba-dup-confirm-metrics b{display:block;font-size:13px;color:#293e56}.ba-dup-confirm-metrics span{display:block;margin-top:4px;font-size:10px;color:#748397}.ba-dup-proof{display:grid;grid-template-columns:24px minmax(0,1fr);gap:8px;margin-top:11px;padding:10px 11px;border-radius:15px;background:#eefaf6;color:#3d6e60;font-size:11px;line-height:1.45}.ba-dup-proof svg{width:20px;height:20px;fill:none;stroke:#188f77;stroke-width:1.8}.ba-dup-confirm-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px}
      .ba-dup-result{padding:8px 0}.ba-dup-result-card{text-align:center;padding:20px 14px 18px;border-radius:25px;background:linear-gradient(145deg,#f3efff,#eff9ff 58%,#f0fbf7);border:1px solid rgba(98,91,184,.08)}.ba-dup-result-check{width:70px;height:70px;border-radius:24px;display:grid;place-items:center;margin:0 auto 14px;background:linear-gradient(145deg,#e9e3ff,#e8f6ff);color:#665bcc;box-shadow:0 11px 27px rgba(85,79,172,.11)}.ba-dup-result-check svg{width:34px;height:34px;fill:none;stroke:currentColor;stroke-width:2}.ba-dup-result-kicker{display:block;font-size:9px;letter-spacing:.17em;font-weight:850;color:#7567b8}.ba-dup-result h3{font-size:22px;line-height:1.12;margin:6px 0 0;color:#1c334a}.ba-dup-result-bytes{font-size:34px;line-height:1;font-weight:820;letter-spacing:-.05em;color:#5e5bd0;margin-top:15px}.ba-dup-result-label{font-size:11px;color:#647a8d;margin-top:5px}.ba-dup-result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:13px}.ba-dup-result-grid div{padding:10px 6px;border-radius:15px;background:rgba(255,255,255,.74)}.ba-dup-result-grid b{display:block;font-size:14px;color:#263c54}.ba-dup-result-grid span{display:block;margin-top:4px;font-size:10px;color:#758597}.ba-dup-result p{font-size:12px;line-height:1.5;color:#5a7083;max-width:37ch;margin:11px auto 0}.ba-dup-result-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px}
      @media(max-width:360px){.ba-dup-head{grid-template-columns:46px minmax(0,1fr) 38px;padding-left:13px;padding-right:13px;gap:9px}.ba-dup-mark{width:46px;height:46px;border-radius:16px}.ba-dup-head h2{font-size:20px}.ba-dup-head p{font-size:11.5px}.ba-dup-scroll{padding-left:12px;padding-right:12px}.ba-dup-evidence,.ba-dup-overview{gap:5px}.ba-dup-trust{grid-template-columns:36px minmax(0,1fr)}.ba-dup-pro-scan{grid-column:1/-1}.ba-dup-toolbar{flex-wrap:wrap}.ba-dup-toolbar-copy{flex-basis:100%}.ba-dup-member{grid-template-columns:auto 42px minmax(0,1fr);}.ba-dup-visual{width:42px;height:42px}.ba-dup-side{grid-column:3;text-align:left;display:flex;align-items:center;gap:7px;min-width:0}.ba-dup-side b{font-size:10.5px}.ba-dup-footer{margin-left:-12px;margin-right:-12px;padding-left:12px;padding-right:12px}}
      @media(prefers-reduced-motion:reduce){.ba-dup-spinner:before{animation:none!important}}html[data-motion='reduced'] .ba-dup-spinner:before{animation:none!important}
    `;
    document.head.appendChild(style);
  }

  function ensureSurface(){
    ensureStyle(); let surface=byId('baDuplicates'); if(surface) return surface;
    surface=document.createElement('section'); surface.id='baDuplicates'; surface.className='ba-dup'; surface.hidden=true; surface.setAttribute('role','dialog'); surface.setAttribute('aria-modal','true');
    surface.innerHTML=`<div class="ba-dup-panel"><header class="ba-dup-head"><span class="ba-dup-mark">${svg('duplicate')}</span><div><span class="ba-dup-kicker" id="baDupKicker"></span><h2 id="baDupTitle"></h2><p id="baDupLead"></p></div><button class="ba-dup-close" id="baDupClose" type="button">×</button></header><main class="ba-dup-scroll" id="baDupBody"></main></div><section class="ba-dup-confirm" id="baDupConfirm" hidden role="dialog" aria-modal="true"><div class="ba-dup-confirm-card" id="baDupConfirmCard"></div></section>`;
    document.body.appendChild(surface); byId('baDupClose').addEventListener('click',closeSurface); byId('baDupConfirm').addEventListener('click',(event)=>{if(event.target===byId('baDupConfirm'))hideConfirm();}); refreshHeader(); return surface;
  }
  function refreshHeader(){ if(!byId('baDuplicates')) return; byId('baDupKicker').textContent=t('kicker'); byId('baDupTitle').textContent=t('title'); byId('baDupLead').textContent=t('lead'); byId('baDupClose').setAttribute('aria-label',t('done')); }
  function renderState(iconName,title,body,actions=''){ byId('baDupBody').innerHTML=`<section class="ba-dup-state"><div class="ba-dup-state-icon">${svg(iconName)}</div><h3>${esc(title)}</h3><p>${esc(body)}</p>${actions}</section>`; }

  function renderNeedVerification(){
    const ns=nativeState(); if(!ns.broadStorageAccess){
      renderState('shield',t('noAccessTitle'),t('noAccessBody'),`<div class="ba-dup-state-actions one"><button class="ba-dup-primary" id="baDupPermission" type="button">${esc(t('openSettings'))}</button></div>`); byId('baDupPermission').addEventListener('click',requestPermission); return;
    }
    const mode=scanMode(); const quick=mode==='quick'; const custom=mode==='custom';
    renderState('refresh',quick?t('quickTitle'):custom?t('customTitle'):t('noSnapshotTitle'),quick?t('quickBody'):custom?t('customBody'):t('noSnapshotBody'),`<div class="ba-dup-state-actions one"><button class="ba-dup-primary" id="baDupRunSmart" type="button">${esc(t('runSmart'))}</button></div>`); byId('baDupRunSmart').addEventListener('click',()=>startScan('smart'));
  }

  function renderScanning(existing=false){
    const p=state.lastProgress||{}; const mode=String(p.scanMode||'').toLowerCase();
    byId('baDupBody').innerHTML=`<section class="ba-dup-state"><div class="ba-dup-spinner"></div><h3>${esc(t('scanningTitle'))}</h3><p>${esc(existing?t('scanRunning'):t('scanningBody'))}</p><div class="ba-dup-evidence"><div><span>${esc(t('source'))}</span><strong>${esc(t('sourceLive'))}</strong></div><div><span>${esc(t('scope'))}</span><strong id="baDupLiveScope">${esc(mode==='deep'?t('full'):t('focused'))}</strong></div><div><span>${esc(t('evidence'))}</span><strong>${esc(t('exact'))}</strong></div></div><section class="ba-dup-live"><div class="ba-dup-live-top"><span class="ba-dup-live-icon">${svg('duplicate')}</span><div class="ba-dup-live-copy"><span id="baDupLivePhase">${esc(phaseLabel(p.phase))}</span><strong id="baDupLiveItem">${esc(t('waiting'))}</strong></div><b class="ba-dup-live-pill">${esc(t('localLive'))}</b></div><small class="ba-dup-live-location" id="baDupLiveLocation">${esc(mode==='deep'?t('full'):t('focused'))}</small><div class="ba-dup-live-metrics"><div><b id="baDupLiveReviewed">0</b><span>${esc(t('filesReviewed'))}</span></div><div><b id="baDupLiveHashed">0</b><span>${esc(t('hashedFiles'))}</span></div><div><b id="baDupLiveHashBytes">0 B</b><span>${esc(t('hashedBytes'))}</span></div></div></section><div class="ba-dup-state-actions one"><button class="ba-dup-secondary" id="baDupScanClose" type="button">${esc(t('done'))}</button></div></section>`;
    byId('baDupScanClose').addEventListener('click',closeSurface); updateLive();
  }
  function updateLive(){
    if(!state.open||!byId('baDupLivePhase')) return; const p=state.lastProgress||{}; const mode=String(p.scanMode||'').toLowerCase();
    byId('baDupLivePhase').textContent=phaseLabel(p.phase); byId('baDupLiveItem').textContent=String(p.activeItemName||'').trim()||t('waiting'); byId('baDupLiveLocation').textContent=String(p.activeItemLocation||'').trim()||(mode==='deep'?t('full'):t('focused'));
    byId('baDupLiveReviewed').textContent=formatCount(p.reviewedFiles); byId('baDupLiveHashed').textContent=formatCount(p.hashedFiles); byId('baDupLiveHashBytes').textContent=formatBytes(p.hashedBytes); if(byId('baDupLiveScope')) byId('baDupLiveScope').textContent=mode==='deep'?t('full'):mode==='custom'?t('selectedScope'):t('focused');
  }
  function renderLoading(loaded=0,total=n(state.summary?.duplicatesCount)){
    byId('baDupBody').innerHTML=`<section class="ba-dup-state"><div class="ba-dup-spinner"></div><h3>${esc(t('loadingGroups'))}</h3><p>${esc(t('loadingBody'))}</p><div class="ba-dup-evidence"><div><span>${esc(t('checked'))}</span><strong>${esc(ageText(state.summary?.generatedAtMs))}</strong></div><div><span>${esc(t('scope'))}</span><strong>${esc(coverageLabel())}</strong></div><div><span>${esc(t('loaded'))}</span><strong id="baDupLoadedCount">${esc(`${formatCount(loaded)} / ${formatCount(total)}`)}</strong></div></div></section>`;
  }

  function buildGroups(items){
    const map=new Map();
    items.forEach((item)=>{ const gid=String(item?.duplicateGroupId||'').trim(); if(!gid) return; if(!map.has(gid)) map.set(gid,[]); map.get(gid).push(item); });
    const groups=[];
    for(const [id,members] of map){
      if(members.length<2) continue;
      const suggested=members.find((m)=>m.duplicateKeepSuggested===true)||members[0];
      const size=n(members[0]?.sizeBytes); const reclaim=members.reduce((sum,m)=>m.id===suggested.id?sum:sum+n(m.sizeBytes),0);
      groups.push({id,members,defaultKeepId:String(suggested.id),reclaimableBytes:reclaim,sizeBytes:size});
    }
    groups.sort((a,b)=>b.reclaimableBytes-a.reclaimableBytes||b.members.length-a.members.length||a.id.localeCompare(b.id));
    return groups;
  }
  function loadAllDuplicateCandidates(){
    const token=++state.loadToken; state.rawItems=[]; renderLoading();
    const step=(offset)=>{
      if(!state.open||token!==state.loadToken) return;
      const payload=parse(NATIVE.getReviewCandidates?.('duplicates',offset,REVIEW_PAGE_SIZE),{available:false,items:[],totalCount:0});
      if(!payload.available){renderNeedVerification();return;}
      const items=Array.isArray(payload.items)?payload.items:[]; state.rawItems.push(...items); byId('baDupLoadedCount')&&(byId('baDupLoadedCount').textContent=`${formatCount(state.rawItems.length)} / ${formatCount(payload.totalCount)}`);
      if(payload.hasMore&&items.length){window.setTimeout(()=>step(offset+items.length),0);return;}
      state.groups=buildGroups(state.rawItems); state.keepByGroup=new Map(state.groups.map((g)=>[g.id,g.defaultKeepId])); state.selected.clear(); state.visibleGroups=RENDER_BATCH; state.cachedActiveCandidateCount=state.groups.reduce((sum,g)=>sum+g.members.length,0); updateHomeStatus(); renderGroups(Boolean(payload.detailsTruncated||state.summary?.detailsTruncated));
    };
    step(0);
  }
  function totalExtras(){ return state.groups.reduce((sum,g)=>sum+Math.max(0,g.members.length-1),0); }
  function totalReclaimable(){ return state.groups.reduce((sum,g)=>sum+g.reclaimableBytes,0); }
  function selectedMembers(){ const ids=state.selected; return state.groups.flatMap((g)=>g.members).filter((m)=>ids.has(String(m.id))); }
  function selectedBytes(){ return selectedMembers().reduce((sum,m)=>sum+n(m.sizeBytes),0); }
  function groupsAffected(){ return state.groups.filter((g)=>g.members.some((m)=>state.selected.has(String(m.id)))).length; }

  function coverageTrust(){
    const mode=scanMode(); if(mode==='deep') return {title:t('fullTitle'),body:t('fullBody'),button:false}; if(mode==='custom') return {title:t('customCoverageTitle'),body:t('customCoverageBody'),button:true}; return {title:t('focusedTitle'),body:t('focusedBody'),button:true};
  }
  function renderEmpty(){
    updateHomeStatus(true); const trust=coverageTrust();
    byId('baDupBody').innerHTML=`<section class="ba-dup-state"><div class="ba-dup-state-icon">${svg('check')}</div><h3>${esc(t('noDupTitle'))}</h3><p>${esc(t('noDupBody'))}</p><div class="ba-dup-evidence"><div><span>${esc(t('groups'))}</span><strong>0</strong></div><div><span>${esc(t('checked'))}</span><strong>${esc(ageText(state.summary?.generatedAtMs))}</strong></div><div><span>${esc(t('scope'))}</span><strong>${esc(coverageLabel())}</strong></div></div><section class="ba-dup-trust"><i>${svg('shield')}</i><div><strong>${esc(trust.title)}</strong><small>${esc(trust.body)}</small></div>${trust.button?`<button class="ba-dup-pro-scan" id="baDupVerifyAll" type="button">${esc(t('verifyAll'))}${ENT?.isPro?.()?'':` <b>${esc(t('pro'))}</b>`}</button>`:''}</section><div class="ba-dup-state-actions"><button class="ba-dup-secondary" id="baDupEmptyAgain" type="button">${esc(t('checkAgain'))}</button><button class="ba-dup-primary" id="baDupEmptyDone" type="button">${esc(t('done'))}</button></div></section>`;
    byId('baDupEmptyAgain').addEventListener('click',()=>startScan(scanMode()==='deep'&&ENT?.can?.('deep_scan')?'deep':'smart')); byId('baDupEmptyDone').addEventListener('click',closeSurface); byId('baDupVerifyAll')?.addEventListener('click',verifyAllAccessible);
  }
  function groupHtml(group,index){
    const keepId=state.keepByGroup.get(group.id)||group.defaultKeepId; const selectedCount=group.members.filter((m)=>state.selected.has(String(m.id))).length;
    const members=group.members.map((member)=>{
      const id=String(member.id); const isKeep=id===keepId; const checked=state.selected.has(id); const kind=memberKind(member);
      return `<div class="ba-dup-member${isKeep?' is-keep':''}${checked?' is-selected':''}" data-dup-member="${esc(id)}" data-dup-group="${esc(group.id)}"><input type="checkbox" data-dup-id="${esc(id)}"${checked?' checked':''}${isKeep?' disabled':''} aria-label="${esc(t('remove'))}"><span class="ba-dup-visual" data-dup-preview="${esc(id)}" data-kind="${esc(String(member.fileKind||'other'))}">${svg(kind)}</span><span class="ba-dup-file"><strong>${esc(member.name||id)}</strong><small>${esc(member.location||'Shared storage')}</small><span class="ba-dup-file-meta"><span>${esc(kindName(String(member.fileKind||'other')))}</span><span>·</span><span>${esc(formatDate(member.modifiedMs))}</span></span></span><span class="ba-dup-side"><b>${esc(formatBytes(member.sizeBytes))}</b>${isKeep?`<span class="ba-dup-keep-pill">${svg('shield')}${esc(t('keep'))}</span>`:`<button class="ba-dup-keep-btn" data-dup-keep="${esc(id)}" data-group="${esc(group.id)}" type="button">${esc(t('keepThis'))}</button>`}</span></div>`;
    }).join('');
    return `<article class="ba-dup-group" data-dup-group-card="${esc(group.id)}"><header class="ba-dup-group-head"><div class="ba-dup-group-title"><span>${esc(t('group'))} ${formatCount(index+1)}</span><strong>${formatCount(group.members.length)} ${esc(t('copies'))}</strong><em class="ba-dup-exact">${esc(t('exactBadge'))}</em></div><div class="ba-dup-group-save"><b>${esc(formatBytes(group.reclaimableBytes))}</b><small>${esc(t('canReclaim'))}</small></div></header><div class="ba-dup-members">${members}</div><div class="ba-dup-group-actions"><button class="ba-dup-group-clear" data-dup-clear-group="${esc(group.id)}" type="button">${esc(t('clearGroup'))}</button><button class="ba-dup-group-select" data-dup-select-group="${esc(group.id)}" type="button">${esc(t('removeExtras'))}${selectedCount?` · ${formatCount(selectedCount)}`:''}</button></div></article>`;
  }
  function renderGroups(detailsTruncated=false){
    if(!state.groups.length){renderEmpty();return;}
    const trust=coverageTrust(); const stale=snapshotStale(); const isPro=Boolean(ENT?.can?.('advanced_exact_duplicates')); const shown=Math.min(state.visibleGroups,state.groups.length);
    const groupsHtml=state.groups.slice(0,shown).map(groupHtml).join(''); const selectedCount=state.selected.size; const bytes=selectedBytes();
    byId('baDupBody').innerHTML=`<section class="ba-dup-overview"><div class="ba-dup-metric"><b>${esc(formatCount(state.groups.length))}</b><span>${esc(t('groups'))}</span></div><div class="ba-dup-metric"><b>${esc(formatCount(totalExtras()))}</b><span>${esc(t('extras'))}</span></div><div class="ba-dup-metric"><b>${esc(formatBytes(totalReclaimable()))}</b><span>${esc(t('reclaimable'))}</span></div></section><section class="ba-dup-trust"><i>${svg('shield')}</i><div><strong>${esc(trust.title)}</strong><small>${esc(trust.body)}</small></div>${trust.button?`<button class="ba-dup-pro-scan" id="baDupVerifyAll" type="button">${esc(t('verifyAll'))}${ENT?.isPro?.()?'':` <b>${esc(t('pro'))}</b>`}</button>`:''}</section><section class="ba-dup-trust"><i>${svg('duplicate')}</i><div><strong>${esc(t('trustTitle'))}</strong><small>${esc(t('trustBody'))}</small></div></section>${stale?`<div class="ba-dup-alert"><strong>${esc(t('staleTitle'))}</strong><br>${esc(t('staleBody'))}</div>`:''}${detailsTruncated?`<div class="ba-dup-alert info">${esc(t('partial'))}</div>`:''}<div class="ba-dup-toolbar"><div class="ba-dup-toolbar-copy"><strong id="baDupToolbarSelected">${esc(t('selectedSummary',{count:formatCount(selectedCount),bytes:formatBytes(bytes)}))}</strong><small>${esc(t('showing',{shown:formatCount(shown),total:formatCount(state.groups.length)}))}</small></div><button class="ba-dup-chip" id="baDupClearAll" type="button">${esc(t('clearAll'))}</button><button class="ba-dup-chip bulk" id="baDupBulk" type="button">${esc(t(isPro?'bulkSelect':'bulkPro'))}</button></div>${!isPro?`<div class="ba-dup-pro-note">${esc(t('bulkFreeHint'))}</div>`:''}<div class="ba-dup-groups">${groupsHtml}</div>${shown<state.groups.length?`<button class="ba-dup-more" id="baDupMore" type="button">${esc(t('loadMore'))}</button>`:''}<div class="ba-dup-alert info">${esc(t('limit'))}</div><footer class="ba-dup-footer"><div class="ba-dup-footer-copy"><strong id="baDupFooterSelected">${esc(t('selectedSummary',{count:formatCount(selectedCount),bytes:formatBytes(bytes)}))}</strong><small>${esc(ageText(state.summary?.generatedAtMs))}</small></div><div class="ba-dup-footer-actions"><button class="ba-dup-secondary" id="baDupRefresh" type="button">${esc(stale?t('staleTitle'):t('checkAgain'))}</button><button class="ba-dup-primary" id="baDupReview" type="button"${selectedCount===0||stale?' disabled':''}>${esc(t('reviewSelected'))}</button></div></footer>`;
    bindGroupUi(); schedulePreviews();
  }
  function bindGroupUi(){
    byId('baDupVerifyAll')?.addEventListener('click',verifyAllAccessible); byId('baDupClearAll')?.addEventListener('click',()=>{state.selected.clear();updateSelectionUi();});
    byId('baDupBulk')?.addEventListener('click',()=>{ if(!ENT?.can?.('advanced_exact_duplicates')){ENT?.requestPro?.('duplicates_bulk_select','advanced_exact_duplicates');return;} selectAllRecommended(); });
    byId('baDupRefresh')?.addEventListener('click',()=>startScan(scanMode()==='deep'&&ENT?.can?.('deep_scan')?'deep':'smart')); byId('baDupReview')?.addEventListener('click',showConfirm); byId('baDupMore')?.addEventListener('click',()=>{state.visibleGroups+=RENDER_BATCH;renderGroups(Boolean(state.summary?.detailsTruncated));});
    byId('baDupBody')?.querySelectorAll('[data-dup-id]').forEach((box)=>box.addEventListener('change',()=>toggleMember(box)));
    byId('baDupBody')?.querySelectorAll('[data-dup-keep]').forEach((button)=>button.addEventListener('click',()=>setKeep(String(button.dataset.group||''),String(button.dataset.dupKeep||''))));
    byId('baDupBody')?.querySelectorAll('[data-dup-select-group]').forEach((button)=>button.addEventListener('click',()=>selectGroup(String(button.dataset.dupSelectGroup||''))));
    byId('baDupBody')?.querySelectorAll('[data-dup-clear-group]').forEach((button)=>button.addEventListener('click',()=>clearGroup(String(button.dataset.dupClearGroup||''))));
  }
  function groupById(id){ return state.groups.find((g)=>g.id===id); }
  function toggleMember(box){
    const id=String(box.dataset.dupId||''); const group=state.groups.find((g)=>g.members.some((m)=>String(m.id)===id)); if(!group) return; const keep=state.keepByGroup.get(group.id)||group.defaultKeepId;
    if(id===keep){box.checked=false;state.selected.delete(id);updateSelectionUi();return;} if(box.checked){if(state.selected.size>=MAX_DELETE_SELECTION){box.checked=false;return;}state.selected.add(id);}else state.selected.delete(id); updateSelectionUi();
  }
  function setKeep(groupId,id){ const group=groupById(groupId); if(!group||!group.members.some((m)=>String(m.id)===id))return; state.keepByGroup.set(groupId,id);state.selected.delete(id);renderGroups(Boolean(state.summary?.detailsTruncated)); }
  function selectGroup(groupId){ const group=groupById(groupId); if(!group)return; const keep=state.keepByGroup.get(groupId)||group.defaultKeepId; for(const member of group.members){const id=String(member.id);if(id===keep){state.selected.delete(id);continue;}if(state.selected.size<MAX_DELETE_SELECTION)state.selected.add(id);}updateSelectionUi(); }
  function clearGroup(groupId){ const group=groupById(groupId); if(!group)return; group.members.forEach((m)=>state.selected.delete(String(m.id)));updateSelectionUi(); }
  function updateSelectionUi(){
    const count=state.selected.size; const bytes=selectedBytes(); const summary=t('selectedSummary',{count:formatCount(count),bytes:formatBytes(bytes)});
    if(byId('baDupToolbarSelected'))byId('baDupToolbarSelected').textContent=summary;
    if(byId('baDupFooterSelected'))byId('baDupFooterSelected').textContent=summary;
    const review=byId('baDupReview');if(review)review.disabled=count===0||snapshotStale();
    byId('baDupBody')?.querySelectorAll('[data-dup-member]').forEach((row)=>{const box=row.querySelector('[data-dup-id]');if(!box)return;const id=String(box.dataset.dupId||'');const group=groupById(String(row.dataset.dupGroup||''));const keep=group?(state.keepByGroup.get(group.id)||group.defaultKeepId):'';box.checked=state.selected.has(id);box.disabled=id===keep;row.classList.toggle('is-selected',box.checked);row.classList.toggle('is-keep',id===keep);});
    byId('baDupBody')?.querySelectorAll('[data-dup-select-group]').forEach((button)=>{const group=groupById(String(button.dataset.dupSelectGroup||''));if(!group)return;const selectedCount=group.members.filter((m)=>state.selected.has(String(m.id))).length;button.textContent=`${t('removeExtras')}${selectedCount?` · ${formatCount(selectedCount)}`:''}`;});
  }
  function selectAllRecommended(){ state.selected.clear(); for(const group of state.groups){const keep=group.defaultKeepId;state.keepByGroup.set(group.id,keep);for(const member of group.members){const id=String(member.id);if(id!==keep&&state.selected.size<MAX_DELETE_SELECTION)state.selected.add(id);}}renderGroups(Boolean(state.summary?.detailsTruncated)); }

  function safeSelectionIds(){
    const safe=[]; for(const group of state.groups){const keep=state.keepByGroup.get(group.id)||group.defaultKeepId;for(const member of group.members){const id=String(member.id);if(id!==keep&&state.selected.has(id)&&safe.length<MAX_DELETE_SELECTION)safe.push(id);}} return safe;
  }
  function showConfirm(){
    if(state.deleting||snapshotStale())return; const ids=safeSelectionIds(); if(!ids.length)return; const idSet=new Set(ids); const bytes=state.groups.flatMap((g)=>g.members).filter((m)=>idSet.has(String(m.id))).reduce((s,m)=>s+n(m.sizeBytes),0); const affected=state.groups.filter((g)=>g.members.some((m)=>idSet.has(String(m.id)))).length;
    byId('baDupConfirmCard').innerHTML=`<span class="ba-dup-confirm-kicker">${esc(t('confirmKicker'))}</span><h3>${esc(t('confirmTitle'))}</h3><p>${esc(t('confirmBody'))}</p><div class="ba-dup-confirm-metrics"><div><b>${esc(formatCount(ids.length))}</b><span>${esc(t('remove'))}</span></div><div><b>${esc(formatCount(affected))}</b><span>${esc(t('groupsAffected'))}</span></div><div><b>${esc(formatBytes(bytes))}</b><span>${esc(t('reclaimable'))}</span></div></div><div class="ba-dup-proof">${svg('shield')}<span>${esc(t('protection'))}</span></div><div class="ba-dup-confirm-actions"><button class="ba-dup-secondary" id="baDupConfirmCancel" type="button">${esc(t('cancel'))}</button><button class="ba-dup-danger" id="baDupDelete" type="button">${esc(t('deleteVerify'))}</button></div>`; byId('baDupConfirm').hidden=false; byId('baDupConfirmCancel').addEventListener('click',hideConfirm); byId('baDupDelete').addEventListener('click',deleteSelected);
  }
  function hideConfirm(){byId('baDupConfirm')&&(byId('baDupConfirm').hidden=true);}
  function deleteSelected(){
    if(state.deleting||snapshotStale()){hideConfirm();refreshWorkspace();return;} const ids=safeSelectionIds(); if(!ids.length){hideConfirm();return;} state.deleting=true; const before=new Set(state.groups.map((g)=>g.id)); const button=byId('baDupDelete'); if(button){button.disabled=true;button.textContent=t('deleting');}
    window.requestAnimationFrame(()=>window.setTimeout(()=>{let result;try{result=parse(NATIVE.deleteReviewCandidates?.(JSON.stringify(ids)),{accepted:false});}catch(_){result={accepted:false,reason:'bridge_error'};}state.deleting=false;hideConfirm();if(!result.accepted){renderError(t('errorTitle'));return;}reloadAfterDelete(result,before);},0));
  }
  function reloadAfterDelete(result,beforeGroups){
    const token=++state.loadToken; const items=[]; const step=(offset)=>{const payload=parse(NATIVE.getReviewCandidates?.('duplicates',offset,REVIEW_PAGE_SIZE),{available:false,items:[],totalCount:0});if(payload.available)items.push(...(Array.isArray(payload.items)?payload.items:[]));if(payload.available&&payload.hasMore&&payload.items?.length){window.setTimeout(()=>step(offset+payload.items.length),0);return;}const remaining=buildGroups(items);const remainingIds=new Set(remaining.map((g)=>g.id));let resolved=0;beforeGroups.forEach((id)=>{if(!remainingIds.has(id))resolved++;});state.rawItems=items;state.groups=remaining;state.keepByGroup=new Map(remaining.map((g)=>[g.id,g.defaultKeepId]));state.selected.clear();state.summary=reviewSummary();state.cachedActiveCandidateCount=remaining.reduce((sum,g)=>sum+g.members.length,0);updateHomeStatus(remaining.length===0);renderResult(result,resolved);}; step(0);
  }
  function renderResult(result,resolved){
    const deleted=n(result.deletedCount), reclaimed=n(result.reclaimedBytes), protectedCount=Array.isArray(result.protectedIds)?result.protectedIds.length:0, failedCount=Array.isArray(result.failed)?result.failed.length:0;
    byId('baDupBody').innerHTML=`<section class="ba-dup-result"><div class="ba-dup-result-card"><div class="ba-dup-result-check">${svg('check')}</div><span class="ba-dup-result-kicker">${esc(t('resultKicker'))}</span><h3>${esc(t('resultTitle'))}</h3><div class="ba-dup-result-bytes">${esc(formatBytes(reclaimed))}</div><div class="ba-dup-result-label">${esc(t('reclaimedLabel'))}</div><div class="ba-dup-result-grid"><div><b>${esc(formatCount(deleted))}</b><span>${esc(t('removedLabel'))}</span></div><div><b>${esc(formatCount(resolved))}</b><span>${esc(t('resolvedLabel'))}</span></div><div><b>${esc(formatCount(protectedCount))}</b><span>${esc(t('nativeProtected'))}</span></div></div><p>${esc(t('resultBody'))}${failedCount?` · ${formatCount(failedCount)} ${esc(t('failed'))}`:''}</p></div><div class="ba-dup-result-actions"><button class="ba-dup-secondary" id="baDupResultDone" type="button">${esc(t('done'))}</button><button class="ba-dup-primary" id="baDupRemaining" type="button">${esc(t('reviewRemaining'))}</button></div></section>`;byId('baDupResultDone').addEventListener('click',closeSurface);byId('baDupRemaining').addEventListener('click',refreshWorkspace);
  }

  function renderError(message){renderState('file',t('errorTitle'),message||t('scanFailed'),`<div class="ba-dup-state-actions"><button class="ba-dup-secondary" id="baDupErrDone" type="button">${esc(t('done'))}</button><button class="ba-dup-primary" id="baDupRetry" type="button">${esc(t('retry'))}</button></div>`);byId('baDupErrDone').addEventListener('click',closeSurface);byId('baDupRetry').addEventListener('click',refreshWorkspace);}
  function refreshWorkspace(){
    if(!state.open)return;refreshHeader();suppressGenericResults();const ns=nativeState();if(ns.scannerRunning){renderScanning(!state.ownsScan);startPolling();return;}stopPolling();state.summary=reviewSummary();if(!state.summary?.available){renderNeedVerification();return;}const mode=scanMode();if(mode==='quick'){renderNeedVerification();return;}const duplicates=n(state.summary.duplicatesCount);if(mode==='custom'&&duplicates===0){renderNeedVerification();return;}if(duplicates===0&&verificationIsTrustworthyForZero()){state.groups=[];state.cachedActiveCandidateCount=0;renderEmpty();return;}if(duplicates===0){renderNeedVerification();return;}loadAllDuplicateCandidates();
  }
  function startScan(mode){
    const ns=nativeState();if(!ns.broadStorageAccess){renderNeedVerification();return;}if(ns.scannerRunning){state.ownsScan=false;renderScanning(true);startPolling();return;}state.ownsScan=true;state.lastProgress=null;const result=parse(NATIVE.startScan?.(mode,'[]',true),{accepted:false});if(!result.accepted){if(result.reason==='pro_required'){ENT?.requestPro?.('duplicates_full_scope','deep_scan');return;}renderError(t('scanFailed'));return;}renderScanning(false);startPolling();
  }
  function verifyAllAccessible(){if(!ENT?.can?.('deep_scan')){ENT?.requestPro?.('duplicates_full_scope','deep_scan');return;}startScan('deep');}
  function suppressGenericResults(){const results=byId('nativeResultsSheet');if(state.open&&results&&!results.hidden)results.hidden=true;}
  function startPolling(){if(state.polling)return;state.polling=window.setInterval(()=>{if(!state.open){stopPolling();return;}suppressGenericResults();if(nativeState().scannerRunning)return;stopPolling();state.summary=reviewSummary();window.setTimeout(refreshWorkspace,0);},POLL_MS);}
  function stopPolling(){if(state.polling){window.clearInterval(state.polling);state.polling=null;}}
  function requestPermission(){state.pendingPermissionScan=true;startPermissionPolling();try{NATIVE.requestBroadStorageAccess?.();}catch(_){renderError(t('noAccessBody'));}}
  function startPermissionPolling(){if(state.permissionPolling)return;state.permissionStartedAt=Date.now();state.permissionPolling=window.setInterval(()=>{if(!state.open||!state.pendingPermissionScan){stopPermissionPolling();return;}if(nativeState().broadStorageAccess){state.pendingPermissionScan=false;stopPermissionPolling();startScan('smart');return;}if(Date.now()-state.permissionStartedAt>90000)stopPermissionPolling();},700);}
  function stopPermissionPolling(){if(state.permissionPolling){window.clearInterval(state.permissionPolling);state.permissionPolling=null;}}

  function updateHomeStatus(forceClear=false){
    const summary=reviewSummary(); const valid=summary?.available&&['smart','deep'].includes(String(summary.scanMode||'').toLowerCase())||state.groups.length>0; const groups=forceClear?0:state.groups.length; const extras=forceClear?0:totalExtras();
    document.querySelectorAll('[data-tool="duplicates"] small').forEach((node)=>{const compact=Boolean(node.closest('.home-screen')); if(!valid&&groups===0) node.textContent=t(compact?'homeNeeds':'toolsNeeds'); else if(groups>0) node.textContent=t(compact?'homeFound':'toolsFound',{groups:formatCount(groups),extras:formatCount(extras)}); else node.textContent=t(compact?'homeClear':'toolsClear'); node.dataset.duplicateStatus='1';});
  }
  function restoreHomeStatusIfNeeded(){const summary=reviewSummary();if(summary?.available)return;document.querySelectorAll('[data-tool="duplicates"] small[data-duplicate-status="1"]').forEach((node)=>{node.removeAttribute('data-duplicate-status');node.textContent=lang()==='th'?'ค้นหาไฟล์ซ้ำ':lang()==='ja'?'重複を探す':'Find repeats';});}
  function activeCandidateCount(){if(state.cachedActiveCandidateCount!=null)return state.cachedActiveCandidateCount;const summary=reviewSummary();return n(summary?.duplicatesCount);}

  function sourceFor(button){if(button.closest('#toolsScreen'))return 'tools';if(button.closest('#nativeResultsSheet'))return 'results';if(button.closest('.home-screen'))return 'home';return 'home';}
  function openSurface(source='home'){ensureSurface();state.open=true;state.source=source;state.ownsScan=false;state.pendingPermissionScan=false;state.loadToken++;byId('baDuplicates').hidden=false;refreshWorkspace();}
  function closeSurface(){state.open=false;state.pendingPermissionScan=false;state.loadToken++;stopPolling();stopPermissionPolling();hideConfirm();byId('baDuplicates')&&(byId('baDuplicates').hidden=true);if(state.source==='results'){const results=byId('nativeResultsSheet');if(results)results.hidden=false;return;}suppressGenericResults();const destination=state.source==='tools'?'tools':'home';document.querySelector(`[data-nav="${destination}"]`)?.click?.();}

  function schedulePreviews(){
    const cells=[...document.querySelectorAll('#baDupBody [data-dup-preview]')].filter((el)=>!el.dataset.previewRequested&&['image','video'].includes(el.dataset.kind)).slice(0,36);cells.forEach((cell,index)=>{cell.dataset.previewRequested='1';window.setTimeout(()=>requestPreview(cell),index*28);});
  }
  function requestPreview(cell){
    if(!state.open||!cell?.isConnected)return;
    const id=String(cell.dataset.dupPreview||'');if(!id)return;
    const cached=state.mediaCache.get(id);
    if(cached){const img=document.createElement('img');img.alt='';img.decoding='async';img.src=cached;cell.replaceChildren(img);return;}
    const token=`b30d${++state.mediaSeq}`;state.mediaPending.set(token,cell);let result={};
    try{result=parse(NATIVE.requestReviewMedia?.(id,'preview',token),{});}catch(_){}
    if(!result.accepted)state.mediaPending.delete(token);
  }
  function onDuplicateMedia(token,raw){
    const cell=state.mediaPending.get(String(token||''));if(!cell)return;
    state.mediaPending.delete(String(token||''));const media=parse(raw,{});if(!media?.available)return;
    const url=String(media.previewDataUrl||'');if(!/^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(url))return;
    const id=String(cell.dataset.dupPreview||'');if(id)state.mediaCache.set(id,url);
    if(!cell.isConnected)return;
    const img=document.createElement('img');img.alt='';img.decoding='async';img.src=url;cell.replaceChildren(img);
  }
  function wrapMediaCallback(){const base=window.BearagnosticReviewMedia;if(!base||base.__duplicates30Wrapped)return false;window.BearagnosticReviewMedia=Object.freeze({...base,__duplicates30Wrapped:true,onMediaReady(token,raw){base.onMediaReady?.(token,raw);onDuplicateMedia(token,raw);}});return true;}
  function scheduleMediaWrap(){if(wrapMediaCallback())return;let attempts=0;const timer=window.setInterval(()=>{attempts++;if(wrapMediaCallback()||attempts>=30)window.clearInterval(timer);},60);}

  function wrapScanCallbacks(){const base=window.BearagnosticAndroid;if(!base||base.__duplicates30Wrapped)return false;window.BearagnosticAndroid=Object.freeze({...base,__duplicates30Wrapped:true,onNativeStateChanged(raw){base.onNativeStateChanged?.(raw);},onScanProgress(raw){base.onScanProgress?.(raw);state.lastProgress=parse(raw,{});if(state.open&&byId('baDupLivePhase'))updateLive();},onScanComplete(raw){base.onScanComplete?.(raw);if(!state.open)return;state.lastProgress=parse(raw,state.lastProgress||{});window.setTimeout(refreshWorkspace,0);},onScanCancelled(raw){base.onScanCancelled?.(raw);if(state.open&&state.ownsScan)window.setTimeout(()=>renderError(t('scanFailed')),0);},onScanError(raw){base.onScanError?.(raw);if(state.open&&state.ownsScan)window.setTimeout(()=>renderError(t('scanFailed')),0);}});return true;}
  function scheduleScanWrap(){if(wrapScanCallbacks())return;let attempts=0;const timer=window.setInterval(()=>{attempts++;if(wrapScanCallbacks()||attempts>=30)window.clearInterval(timer);},50);}

  document.addEventListener('click',(event)=>{
    const target=event.target?.closest?.('[data-tool="duplicates"],[data-review-category="duplicates"]');if(!target)return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();const results=byId('nativeResultsSheet');if(results)results.hidden=true;openSurface(sourceFor(target));
  },true);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&state.open)refreshWorkspace();});window.addEventListener('focus',()=>{if(state.open)refreshWorkspace();});
  window.addEventListener('bearagnostic:languagechange',()=>{if(state.open)refreshWorkspace();else if(state.groups.length)updateHomeStatus();else restoreHomeStatusIfNeeded();});
  window.addEventListener('bearagnostic:entitlementchange',()=>{if(state.open&&state.groups.length)renderGroups(Boolean(state.summary?.detailsTruncated));});
  document.addEventListener('DOMContentLoaded',()=>{ensureSurface();scheduleScanWrap();scheduleMediaWrap();restoreHomeStatusIfNeeded();},{once:true});
  ensureSurface();scheduleScanWrap();scheduleMediaWrap();restoreHomeStatusIfNeeded();

  window.BearagnosticDuplicates=Object.freeze({build:BUILD,open:()=>openSurface('external'),refresh:refreshWorkspace,activeCandidateCount});
})();
