(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  const HIDDEN = window.BearagnosticHiddenItems;
  if (!NATIVE) return;

  const BUILD = 37;
  const CATEGORY = 'installers';
  const REVIEW_PAGE_SIZE = 250;
  const RENDER_BATCH = 50;
  const MAX_DELETE_SELECTION = 500;
  const STALE_REVIEW_MS = 15 * 60 * 1000;
  const POLL_MS = 350;
  const MEDIA_HOOK_RETRY_MS = 60;
  const MEDIA_HOOK_RETRIES = 80;

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
      toolTitle: 'APK Installers',
      toolSub: 'Review installer files',
      kicker: 'APK INSTALLERS',
      title: 'Know what each installer file is for.',
      lead: 'An APK is an installer file, not the installed app. Removing an APK does not uninstall an app that is already installed.',
      close: 'Close',
      source: 'SOURCE', coverage: 'COVERAGE', safety: 'SAFETY',
      sourceSnapshot: 'Current checkup', fullCoverage: 'Accessible storage', customCoverage: 'Selected Custom scope', reviewFirst: 'Review first',
      accessTitle: 'Storage access is needed',
      accessBody: 'Android must allow shared-storage access before Bearagnostic can review APK installer files.',
      openSettings: 'Open Android settings',
      noSnapshotTitle: 'Check for APK installers first',
      noSnapshotBody: 'Run a Quick Scan to locate APK files in accessible shared storage. Quick reads filesystem metadata only and does not delete anything.',
      runQuick: 'Run Quick Scan',
      scanningTitle: 'Checking for APK installers',
      scanningBody: 'Bearagnostic is using real filesystem work. No fake delay or cosmetic progress is added.',
      scanningHint: 'Installer details will appear when the current checkup finishes.',
      installers: 'Installers', totalSize: 'Total size', installed: 'Installed', older: 'Older installers',
      metadataProgress: 'Reading local package metadata · {done}/{total}',
      metadataDone: 'Package metadata checked locally',
      cautionTitle: 'APK does not mean junk',
      cautionBody: 'Installers can be backups, update packages, or files you still need. Bearagnostic never selects APK files automatically.',
      visibilityTitle: 'Unknown does not mean not installed',
      visibilityBody: 'On Android 11 and newer, package-visibility rules can prevent Bearagnostic from confirming some installed apps. “Not confirmed” is intentionally conservative.',
      partialTitle: 'Review list is partial',
      partialBody: 'The current safety snapshot reached its review-detail limit. Only installer files represented in this snapshot can be selected.',
      customTitle: 'Custom scope',
      customBody: 'This snapshot came from selected Custom Scan locations. APK files outside those selected locations are not represented.',
      checkAll: 'Check all accessible storage',
      staleTitle: 'Refresh before deleting',
      staleBody: 'This review snapshot is more than 15 minutes old. Run a fresh Quick Scan before permanent deletion.',
      refresh: 'Refresh',
      filterAll: 'All', filterOlder: 'Older installer', filterInstalled: 'Installed', filterNewer: 'Newer installer', filterNotInstalled: 'Not installed', filterContext: 'Needs context',
      sortStatus: 'Status first', sortLargest: 'Largest first', sortNewest: 'Newest first', sortOldest: 'Oldest first', sortName: 'Name A–Z',
      selectionTitle: 'Choose only installer files you recognize and no longer need',
      showing: 'Showing {shown} of {total}',
      selected: '{count} selected · {bytes}', clear: 'Clear', reviewSelected: 'Review selected',
      noFilesTitle: 'No APK installers surfaced in this snapshot',
      noFilesBody: 'No APK installer identities are available in the current review snapshot. Nothing was removed.',
      noFilter: 'No installer files match this filter.', showMore: 'Show more installers', dateUnknown: 'Date unavailable',
      hiddenOff: 'Hidden-item privacy is on. Hidden identities stay out of this list.',
      limit: 'Up to 500 files can be removed in one verified batch.', limitReached: 'The 500-file safety limit has been reached.',
      finalKicker: 'FINAL REVIEW',
      finalTitle: 'Remove the selected APK installer files?',
      finalBody: 'This permanently removes only the selected APK files. It does not uninstall installed apps. Keep any installer you still want as a backup.',
      protection: 'Native deletion safety remains active. If a selected APK is also part of a verified duplicate group, keep-one protection still applies.',
      selectedFiles: 'files selected', selectedBytes: 'selected size', back: 'Back', deleteVerify: 'Delete & verify', deleting: 'Deleting and verifying…',
      resultKicker: 'VERIFIED CLEANUP', resultTitle: 'APK installer cleanup complete', reclaimed: 'verified space reclaimed', removed: 'files removed', protected: 'kept by safety', failed: 'not removed',
      resultBody: 'Only APK files Android confirmed as gone are counted as removed or reclaimed.', reviewRemaining: 'Review remaining', done: 'Done',
      errorTitle: 'APK Installers could not continue', retry: 'Try again', scanFailed: 'The Quick Scan could not start.', anotherScan: 'Another checkup is already running. APK Installers will refresh when it finishes.',
      statusLoading: 'Checking…', statusOlder: 'Older installer', statusOlderSub: 'The installed app is newer than this APK.',
      statusSame: 'Installed', statusSameSub: 'The installed app matches this APK version.',
      statusNewer: 'Newer installer', statusNewerSub: 'This APK is newer than the installed app and may be an update package.',
      statusInstalled: 'Installed', statusInstalledSub: 'An installed package with verified signing identity was found.',
      statusUnverified: 'Installed package found', statusUnverifiedSub: 'Package name matched, but signing identity could not be verified.',
      statusMismatch: 'Identity mismatch', statusMismatchSub: 'Package name matched an installed app, but the signing identity differs.',
      statusNotInstalled: 'Not installed', statusNotInstalledSub: 'No installed package was found on this Android version.',
      statusUnknown: 'Not confirmed', statusUnknownSub: 'Android package visibility may prevent a definitive installed-app check.',
      statusUnavailable: 'Metadata unavailable', statusUnavailableSub: 'Bearagnostic could not read reliable APK package metadata.',
      packageLabel: 'Package', versionLabel: 'APK version', installedVersionLabel: 'Installed version'
    },
    th: {
      toolTitle: 'ไฟล์ติดตั้ง APK',
      toolSub: 'ตรวจไฟล์ติดตั้งแอป',
      kicker: 'ตรวจไฟล์ติดตั้ง APK',
      title: 'ดูให้ชัดว่าไฟล์ติดตั้งแต่ละตัวมีไว้ทำอะไร',
      lead: 'APK คือไฟล์ติดตั้ง ไม่ใช่ตัวแอปที่ติดตั้งอยู่ การลบไฟล์ APK จะไม่ถอนการติดตั้งแอปที่ติดตั้งไว้แล้ว',
      close: 'ปิด',
      source: 'แหล่งข้อมูล', coverage: 'ขอบเขต', safety: 'ความปลอดภัย',
      sourceSnapshot: 'ผลตรวจปัจจุบัน', fullCoverage: 'พื้นที่ที่เข้าถึงได้', customCoverage: 'ขอบเขต Custom ที่เลือก', reviewFirst: 'ตรวจดูก่อน',
      accessTitle: 'ต้องอนุญาตการเข้าถึงพื้นที่จัดเก็บ',
      accessBody: 'Android ต้องอนุญาต shared storage ก่อนที่ Bearagnostic จะตรวจไฟล์ติดตั้ง APK ได้',
      openSettings: 'เปิดการตั้งค่า Android',
      noSnapshotTitle: 'ตรวจหาไฟล์ติดตั้ง APK ก่อน',
      noSnapshotBody: 'เริ่ม Quick Scan เพื่อค้นหาไฟล์ APK ใน shared storage ที่เข้าถึงได้ Quick อ่านเฉพาะข้อมูลระบบไฟล์และไม่ลบอะไร',
      runQuick: 'เริ่ม Quick Scan',
      scanningTitle: 'กำลังตรวจหาไฟล์ติดตั้ง APK',
      scanningBody: 'Bearagnostic แสดงตามงานจริงของระบบไฟล์ ไม่มีการหน่วงเวลาหรือสร้างความคืบหน้าปลอม',
      scanningHint: 'รายละเอียดไฟล์ติดตั้งจะปรากฏเมื่อการตรวจปัจจุบันเสร็จสิ้น',
      installers: 'ไฟล์ติดตั้ง', totalSize: 'ขนาดรวม', installed: 'ยืนยันว่าติดตั้งแล้ว', older: 'ตัวติดตั้งเวอร์ชันเก่า',
      metadataProgress: 'กำลังอ่านข้อมูลแพ็กเกจภายในเครื่อง · {done}/{total}',
      metadataDone: 'ตรวจข้อมูลแพ็กเกจภายในเครื่องแล้ว',
      cautionTitle: 'ไฟล์ APK ไม่ได้แปลว่าเป็นขยะ',
      cautionBody: 'ไฟล์ติดตั้งอาจเป็นไฟล์สำรอง แพ็กเกจอัปเดต หรือไฟล์ที่ยังต้องใช้ Bearagnostic จะไม่เลือกไฟล์ APK ให้ลบอัตโนมัติ',
      visibilityTitle: 'ไม่ยืนยัน ไม่ได้แปลว่ายังไม่ได้ติดตั้ง',
      visibilityBody: 'บน Android 11 ขึ้นไป กฎ package visibility อาจทำให้ Bearagnostic ยืนยันแอปที่ติดตั้งอยู่บางตัวไม่ได้ สถานะ “ยังยืนยันไม่ได้” จึงตั้งใจให้ระมัดระวัง',
      partialTitle: 'รายการตรวจแสดงได้ไม่ครบทั้งหมด',
      partialBody: 'snapshot ปัจจุบันถึงขีดจำกัดรายละเอียดเพื่อความปลอดภัย เลือกได้เฉพาะไฟล์ติดตั้งที่อยู่ใน snapshot นี้เท่านั้น',
      customTitle: 'ขอบเขต Custom',
      customBody: 'snapshot นี้มาจากตำแหน่ง Custom Scan ที่เลือก จึงไม่รวมไฟล์ APK นอกตำแหน่งที่เลือกไว้',
      checkAll: 'ตรวจทั่วพื้นที่ที่เข้าถึงได้',
      staleTitle: 'ตรวจใหม่ก่อนลบ',
      staleBody: 'snapshot นี้เก่ากว่า 15 นาที กรุณาเริ่ม Quick Scan ใหม่ก่อนลบถาวร',
      refresh: 'ตรวจใหม่',
      filterAll: 'ทั้งหมด', filterOlder: 'ตัวติดตั้งเก่า', filterInstalled: 'ติดตั้งแล้ว', filterNewer: 'ตัวติดตั้งใหม่กว่า', filterNotInstalled: 'ยังไม่ได้ติดตั้ง', filterContext: 'ต้องตรวจบริบท',
      sortStatus: 'เรียงตามสถานะ', sortLargest: 'ใหญ่สุดก่อน', sortNewest: 'ใหม่สุดก่อน', sortOldest: 'เก่าสุดก่อน', sortName: 'ชื่อ A–Z',
      selectionTitle: 'เลือกเฉพาะไฟล์ติดตั้งที่รู้จักและไม่ต้องการแล้ว',
      showing: 'แสดง {shown} จาก {total}',
      selected: 'เลือก {count} ไฟล์ · {bytes}', clear: 'ล้างที่เลือก', reviewSelected: 'ตรวจรายการที่เลือก',
      noFilesTitle: 'ไม่พบไฟล์ติดตั้ง APK ใน snapshot นี้',
      noFilesBody: 'ไม่พบรายการไฟล์ติดตั้ง APK ใน snapshot ปัจจุบัน และไม่มีการลบอะไร',
      noFilter: 'ไม่มีไฟล์ติดตั้งในตัวกรองนี้', showMore: 'แสดงไฟล์เพิ่ม', dateUnknown: 'ไม่มีข้อมูลวันที่',
      hiddenOff: 'การปกป้องรายการที่ซ่อนอยู่เปิดใช้งานอยู่ ตัวตนไฟล์ที่ซ่อนจะไม่ปรากฏในรายการนี้',
      limit: 'ลบได้สูงสุด 500 ไฟล์ต่อหนึ่ง batch ที่มีการตรวจยืนยัน', limitReached: 'เลือกครบขีดจำกัดความปลอดภัย 500 ไฟล์แล้ว',
      finalKicker: 'ตรวจครั้งสุดท้าย',
      finalTitle: 'ลบไฟล์ติดตั้ง APK ที่เลือกหรือไม่',
      finalBody: 'ระบบจะลบถาวรเฉพาะไฟล์ APK ที่เลือก และจะไม่ถอนการติดตั้งแอปที่ติดตั้งอยู่ เก็บไฟล์ที่ยังต้องการใช้เป็นตัวสำรองไว้',
      protection: 'ระบบความปลอดภัย Native ยังทำงานอยู่ และถ้า APK ที่เลือกเป็นสมาชิกของกลุ่มไฟล์ซ้ำที่ยืนยันแล้ว ระบบจะยังเก็บไว้อย่างน้อยหนึ่งสำเนา',
      selectedFiles: 'ไฟล์ที่เลือก', selectedBytes: 'ขนาดที่เลือก', back: 'ย้อนกลับ', deleteVerify: 'ลบและตรวจยืนยัน', deleting: 'กำลังลบและตรวจยืนยัน…',
      resultKicker: 'ยืนยันผลแล้ว', resultTitle: 'จัดการไฟล์ติดตั้ง APK เสร็จแล้ว', reclaimed: 'พื้นที่ที่คืนได้จริง', removed: 'ไฟล์ที่ลบแล้ว', protected: 'ไฟล์ที่ระบบป้องกันไว้', failed: 'ไฟล์ที่ลบไม่สำเร็จ',
      resultBody: 'นับเฉพาะไฟล์ APK ที่ Android ยืนยันว่าหายไปแล้วเท่านั้น ทั้งจำนวนไฟล์และพื้นที่ที่คืนได้', reviewRemaining: 'ตรวจไฟล์ที่เหลือ', done: 'เสร็จสิ้น',
      errorTitle: 'ไม่สามารถดำเนินการตรวจไฟล์ติดตั้ง APK ต่อได้', retry: 'ลองอีกครั้ง', scanFailed: 'ไม่สามารถเริ่ม Quick Scan ได้', anotherScan: 'มีการตรวจอื่นกำลังทำงานอยู่ APK Installers จะอัปเดตเมื่อการตรวจนั้นเสร็จ',
      statusLoading: 'กำลังตรวจ…', statusOlder: 'ตัวติดตั้งเวอร์ชันเก่า', statusOlderSub: 'แอปที่ติดตั้งอยู่เป็นเวอร์ชันใหม่กว่าไฟล์ APK นี้',
      statusSame: 'ติดตั้งแล้ว', statusSameSub: 'แอปที่ติดตั้งอยู่ตรงกับเวอร์ชันของไฟล์ APK นี้',
      statusNewer: 'ตัวติดตั้งใหม่กว่า', statusNewerSub: 'ไฟล์ APK นี้ใหม่กว่าแอปที่ติดตั้งอยู่ และอาจเป็นแพ็กเกจอัปเดต',
      statusInstalled: 'ติดตั้งแล้ว', statusInstalledSub: 'พบแพ็กเกจที่ติดตั้งอยู่และยืนยัน signing identity ตรงกัน',
      statusUnverified: 'พบแพ็กเกจที่ติดตั้งอยู่', statusUnverifiedSub: 'ชื่อแพ็กเกจตรงกัน แต่ยังยืนยัน signing identity ไม่ได้',
      statusMismatch: 'ตัวตนไม่ตรงกัน', statusMismatchSub: 'ชื่อแพ็กเกจตรงกับแอปที่ติดตั้งอยู่ แต่ signing identity ต่างกัน',
      statusNotInstalled: 'ยังไม่ได้ติดตั้ง', statusNotInstalledSub: 'ไม่พบแพ็กเกจที่ติดตั้งอยู่บน Android เวอร์ชันนี้',
      statusUnknown: 'ยังยืนยันไม่ได้', statusUnknownSub: 'กฎ package visibility ของ Android อาจจำกัดการตรวจสถานะแอปที่ติดตั้งอยู่',
      statusUnavailable: 'อ่านข้อมูลแพ็กเกจไม่ได้', statusUnavailableSub: 'Bearagnostic ไม่สามารถอ่านข้อมูลแพ็กเกจ APK ที่เชื่อถือได้',
      packageLabel: 'แพ็กเกจ', versionLabel: 'เวอร์ชัน APK', installedVersionLabel: 'เวอร์ชันที่ติดตั้ง'
    },
    ja: {
      toolTitle: 'APK インストーラー',
      toolSub: 'インストーラーファイルを確認',
      kicker: 'APK INSTALLERS',
      title: '各インストーラーファイルの意味を確認。',
      lead: 'APK はインストーラーファイルであり、インストール済みアプリ本体ではありません。APK を削除しても、すでにインストール済みのアプリはアンインストールされません。',
      close: '閉じる',
      source: 'ソース', coverage: '範囲', safety: '安全性',
      sourceSnapshot: '現在のチェック', fullCoverage: 'アクセス可能なストレージ', customCoverage: '選択した Custom 範囲', reviewFirst: '要確認',
      accessTitle: 'ストレージへのアクセスが必要です',
      accessBody: 'APK インストーラーファイルを確認するには、Android で共有ストレージへのアクセスを許可してください。',
      openSettings: 'Android 設定を開く',
      noSnapshotTitle: 'まず APK インストーラーを確認',
      noSnapshotBody: 'Quick Scan でアクセス可能な共有ストレージ内の APK を探します。Quick はファイルシステムのメタデータのみを読み取り、削除は行いません。',
      runQuick: 'Quick Scan を開始',
      scanningTitle: 'APK インストーラーを確認中',
      scanningBody: '実際のファイルシステム処理に従って進みます。見せるための待ち時間や偽の進捗は追加しません。',
      scanningHint: '現在のチェックが完了するとインストーラー情報が表示されます。',
      installers: 'インストーラー', totalSize: '合計サイズ', installed: 'インストール確認', older: '古いインストーラー',
      metadataProgress: '端末内のパッケージ情報を確認中 · {done}/{total}',
      metadataDone: '端末内のパッケージ情報を確認済み',
      cautionTitle: 'APK は不要ファイルという意味ではありません',
      cautionBody: 'バックアップ、更新パッケージ、まだ必要なファイルの場合があります。Bearagnostic は APK を自動選択しません。',
      visibilityTitle: '未確認は未インストールという意味ではありません',
      visibilityBody: 'Android 11 以降では package visibility の制限により、インストール済みアプリを確認できない場合があります。「未確認」は意図的に保守的な表示です。',
      partialTitle: 'レビュー一覧は一部のみです',
      partialBody: '現在の安全スナップショットは詳細表示上限に達しています。この snapshot に含まれるインストーラーだけを選択できます。',
      customTitle: 'Custom 範囲',
      customBody: 'この snapshot は選択した Custom Scan の場所から作成されています。選択外の場所にある APK は含まれません。',
      checkAll: 'アクセス可能な全領域を確認',
      staleTitle: '削除前に再確認',
      staleBody: 'この review snapshot は 15 分以上前のものです。完全削除の前に新しい Quick Scan を実行してください。',
      refresh: '再確認',
      filterAll: 'すべて', filterOlder: '古いインストーラー', filterInstalled: 'インストール済み', filterNewer: '新しいインストーラー', filterNotInstalled: '未インストール', filterContext: '要確認',
      sortStatus: '状態順', sortLargest: 'サイズが大きい順', sortNewest: '新しい順', sortOldest: '古い順', sortName: '名前 A–Z',
      selectionTitle: '内容を把握し、不要だと判断したインストーラーだけを選択してください',
      showing: '{total} 件中 {shown} 件を表示',
      selected: '{count} 件選択 · {bytes}', clear: '選択解除', reviewSelected: '選択内容を確認',
      noFilesTitle: 'この snapshot には APK インストーラーがありません',
      noFilesBody: '現在の review snapshot に APK インストーラーはありません。削除は行われていません。',
      noFilter: 'このフィルターに一致するインストーラーはありません。', showMore: 'さらに表示', dateUnknown: '日付情報なし',
      hiddenOff: '非表示項目のプライバシー保護が有効です。非表示の識別情報はこの一覧に表示されません。',
      limit: '1 回の検証済みバッチで削除できるのは最大 500 ファイルです。', limitReached: '500 ファイルの安全上限に達しました。',
      finalKicker: '最終確認',
      finalTitle: '選択した APK インストーラーを削除しますか？',
      finalBody: '選択した APK ファイルだけを完全に削除します。インストール済みアプリはアンインストールされません。バックアップとして必要な APK は残してください。',
      protection: 'Native の削除保護は引き続き有効です。選択した APK が検証済み重複グループに属する場合は、1 つを残す保護も維持されます。',
      selectedFiles: '選択ファイル', selectedBytes: '選択サイズ', back: '戻る', deleteVerify: '削除して確認', deleting: '削除して確認中…',
      resultKicker: '検証済みクリーンアップ', resultTitle: 'APK インストーラーの整理が完了しました', reclaimed: '確認済み空き容量', removed: '削除済み', protected: '安全保護', failed: '未削除',
      resultBody: 'Android が実際に消えたと確認した APK だけを、削除件数と回収容量に数えます。', reviewRemaining: '残りを確認', done: '完了',
      errorTitle: 'APK Installers を続行できません', retry: '再試行', scanFailed: 'Quick Scan を開始できませんでした。', anotherScan: '別のチェックが実行中です。完了後に APK Installers を更新します。',
      statusLoading: '確認中…', statusOlder: '古いインストーラー', statusOlderSub: 'インストール済みアプリのほうがこの APK より新しいバージョンです。',
      statusSame: 'インストール済み', statusSameSub: 'インストール済みアプリとこの APK のバージョンが一致します。',
      statusNewer: '新しいインストーラー', statusNewerSub: 'この APK はインストール済みアプリより新しく、更新パッケージの可能性があります。',
      statusInstalled: 'インストール済み', statusInstalledSub: '署名 ID が一致するインストール済みパッケージを確認しました。',
      statusUnverified: 'インストール済みパッケージを確認', statusUnverifiedSub: 'パッケージ名は一致しましたが、署名 ID を確認できませんでした。',
      statusMismatch: 'ID 不一致', statusMismatchSub: 'パッケージ名は一致しましたが、インストール済みアプリと署名 ID が異なります。',
      statusNotInstalled: '未インストール', statusNotInstalledSub: 'この Android バージョンではインストール済みパッケージが見つかりませんでした。',
      statusUnknown: '未確認', statusUnknownSub: 'Android の package visibility によりインストール状態を確定できない場合があります。',
      statusUnavailable: 'メタデータ利用不可', statusUnavailableSub: '信頼できる APK パッケージ情報を読み取れませんでした。',
      packageLabel: 'パッケージ', versionLabel: 'APK バージョン', installedVersionLabel: 'インストール済みバージョン'
    }
  };
  const c = () => COPY[language()] || COPY.en;

  const ICONS = Object.freeze({
    installer: '<rect x="6" y="7" width="12" height="11" rx="2.4"/><path d="M9 7V5.5h6V7"/><path d="M12 9.5v5"/><path d="m9.8 12.3 2.2 2.2 2.2-2.2"/>',
    shield: '<path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6Z"/><path d="m9 12 2 2 4-4"/>',
    warning: '<path d="M12 4 21 20H3Z"/><path d="M12 9v5M12 17h.01"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/>'
  });
  const svgIcon = (name, className = '') => `<svg${className ? ` class="${className}"` : ''} viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.installer}</svg>`;
  const icon = (name) => svgIcon(name);
  function installerBadge(variant = 'tool') {
    const className = variant === 'header' ? 'ba-installers-badge ba-installers-badge--header' : 'ba-installers-badge';
    return `<span class="${className}" aria-hidden="true"><span class="ba-installers-badge__shadow"></span><span class="ba-installers-badge__plate"></span><span class="ba-installers-badge__glow"></span><span class="ba-installers-badge__shine"></span>${svgIcon('installer', 'ba-installers-badge__glyph')}</span>`;
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
    details: new Map(),
    detailPending: new Map(),
    detailRequested: new Set(),
    detailSequence: 0,
    filter: 'all',
    sort: 'status',
    renderLimit: RENDER_BATCH,
    message: '',
    error: '',
    result: null,
    pollTimer: null,
    loadToken: 0,
    mediaHooked: false
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

  function dateLabel(ms) {
    const value = n(ms);
    if (!value) return c().dateUnknown;
    try {
      return new Intl.DateTimeFormat(language() === 'th' ? 'th-TH' : language() === 'ja' ? 'ja-JP' : 'en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      }).format(new Date(value));
    } catch (_) { return new Date(value).toLocaleDateString(); }
  }

  function isFresh(summary = state.summary) {
    const generated = n(summary?.generatedAtMs);
    if (!generated || generated > Date.now()) return false;
    return Date.now() - generated <= STALE_REVIEW_MS;
  }

  function visibleBaseItems() {
    return HIDDEN?.filter ? HIDDEN.filter(state.items) : state.items.slice();
  }

  function detailFor(item) {
    return state.details.get(item.id) || null;
  }

  function statusFor(item) {
    const detail = detailFor(item);
    if (!detail) return state.detailRequested.has(item.id) ? 'loading' : 'loading';
    if (!detail.available || detail.apkMetadataStatus === 'unavailable') return 'metadata_unavailable';
    return String(detail.installStatus || 'metadata_unavailable');
  }

  function statusText(status) {
    const copy = c();
    const map = {
      loading: [copy.statusLoading, copy.metadataProgress.replace('{done}', metadataResolved()).replace('{total}', metadataTarget())],
      older_installer: [copy.statusOlder, copy.statusOlderSub],
      same_version_installed: [copy.statusSame, copy.statusSameSub],
      newer_installer: [copy.statusNewer, copy.statusNewerSub],
      installed_confirmed: [copy.statusInstalled, copy.statusInstalledSub],
      installed_unverified_identity: [copy.statusUnverified, copy.statusUnverifiedSub],
      identity_mismatch: [copy.statusMismatch, copy.statusMismatchSub],
      not_installed: [copy.statusNotInstalled, copy.statusNotInstalledSub],
      not_confirmed: [copy.statusUnknown, copy.statusUnknownSub],
      metadata_unavailable: [copy.statusUnavailable, copy.statusUnavailableSub]
    };
    return map[status] || map.metadata_unavailable;
  }

  function statusTone(status) {
    if (status === 'older_installer') return 'mint';
    if (status === 'same_version_installed' || status === 'installed_confirmed') return 'teal';
    if (status === 'newer_installer') return 'blue';
    if (status === 'identity_mismatch') return 'danger';
    if (status === 'installed_unverified_identity') return 'amber';
    if (status === 'not_installed') return 'slate';
    if (status === 'not_confirmed' || status === 'metadata_unavailable') return 'slate';
    return 'loading';
  }

  function statusPriority(status) {
    return ({identity_mismatch: 0, older_installer: 1, installed_unverified_identity: 2, same_version_installed: 3, installed_confirmed: 4, newer_installer: 5, not_installed: 6, not_confirmed: 7, metadata_unavailable: 8, loading: 9})[status] ?? 10;
  }

  function itemMatchesFilter(item) {
    const status = statusFor(item);
    switch (state.filter) {
      case 'older': return status === 'older_installer';
      case 'installed': return ['older_installer','same_version_installed','installed_confirmed','newer_installer'].includes(status);
      case 'newer': return status === 'newer_installer';
      case 'notinstalled': return status === 'not_installed';
      case 'context': return ['identity_mismatch','installed_unverified_identity','not_confirmed','metadata_unavailable','loading'].includes(status);
      default: return true;
    }
  }

  function visibleItems() {
    const filtered = visibleBaseItems().filter(itemMatchesFilter);
    return filtered.sort((a, b) => {
      if (state.sort === 'largest') return n(b.sizeBytes) - n(a.sizeBytes);
      if (state.sort === 'newest') return n(b.modifiedMs) - n(a.modifiedMs) || n(b.sizeBytes) - n(a.sizeBytes);
      if (state.sort === 'oldest') {
        const av = n(a.modifiedMs) || Number.MAX_SAFE_INTEGER;
        const bv = n(b.modifiedMs) || Number.MAX_SAFE_INTEGER;
        return av - bv || n(b.sizeBytes) - n(a.sizeBytes);
      }
      if (state.sort === 'name') {
        const an = String(detailFor(a)?.appName || a.name || '');
        const bn = String(detailFor(b)?.appName || b.name || '');
        return an.localeCompare(bn, language());
      }
      return statusPriority(statusFor(a)) - statusPriority(statusFor(b)) || n(b.sizeBytes) - n(a.sizeBytes);
    });
  }

  function selectedItems() {
    const allowed = new Set(visibleBaseItems().map((item) => item.id));
    return state.items.filter((item) => state.selected.has(item.id) && allowed.has(item.id));
  }

  function syncSelectionPrivacy() {
    if (!HIDDEN?.filter) return;
    const visible = new Set(HIDDEN.filter(state.items).map((item) => item.id));
    for (const id of [...state.selected]) if (!visible.has(id)) state.selected.delete(id);
  }

  function metadataTarget() {
    return visibleBaseItems().length;
  }

  function metadataResolved() {
    return visibleBaseItems().filter((item) => state.details.has(item.id)).length;
  }

  function metadataComplete() {
    const total = metadataTarget();
    return total === 0 || metadataResolved() >= total;
  }

  function confirmedInstalledCount() {
    return visibleBaseItems().filter((item) => ['older_installer','same_version_installed','newer_installer','installed_confirmed'].includes(statusFor(item))).length;
  }

  function olderInstallerCount() {
    return visibleBaseItems().filter((item) => statusFor(item) === 'older_installer').length;
  }

  function ensureStyle() {
    if (byId('androidInstallersStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidInstallersStyle';
    style.textContent = `
      #toolsScreen.ba-tools-expandable{overflow-y:auto!important;overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch;padding-bottom:24px!important;scrollbar-width:none}
      #toolsScreen.ba-tools-expandable::-webkit-scrollbar{display:none}
      #toolsScreen.ba-tools-expandable .utility-list{padding-bottom:10px}
      .ba-installers-entry{--tone:39,169,143!important}
      .ba-installers-entry .mini-icon{background:transparent!important;border:0!important;box-shadow:none!important;padding:0;display:grid;place-items:center;overflow:visible}
      .ba-installers-tool-icon{width:40px;height:40px}
      .ba-installers-badge{position:relative;display:inline-grid;place-items:center;width:38px;height:38px;border-radius:13px;isolation:isolate}
      .ba-installers-badge--header{width:24px;height:24px;border-radius:9px}
      .ba-installers-badge__shadow,.ba-installers-badge__plate,.ba-installers-badge__glow,.ba-installers-badge__shine{position:absolute;inset:0;border-radius:inherit}
      .ba-installers-badge__shadow{inset:1px;box-shadow:0 8px 18px rgba(35,126,109,.20),0 2px 5px rgba(38,102,90,.12)}
      .ba-installers-badge__plate{background:linear-gradient(180deg,#e8fff9 0%,#c7f6eb 16%,#8fe6d3 45%,#51cbb0 76%,#2ba58e 100%);border:1px solid rgba(168,232,218,.98);box-shadow:inset 0 1px 0 rgba(255,255,255,.96),inset 0 -8px 12px rgba(25,116,99,.14),inset 0 0 0 1px rgba(255,255,255,.14)}
      .ba-installers-badge__glow{inset:3px;background:radial-gradient(115% 90% at 22% 16%,rgba(255,255,255,.98) 0%,rgba(255,255,255,.52) 27%,rgba(255,255,255,0) 60%),linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,0) 68%)}
      .ba-installers-badge__shine{inset:4px 5px auto 5px;height:12px;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(255,255,255,.18));opacity:.96}
      .ba-installers-badge__glyph{position:relative;z-index:1;width:18px;height:18px;fill:none;stroke:#218d79;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 0 rgba(255,255,255,.36))}
      .ba-installers-badge--header .ba-installers-badge__glyph{width:12px;height:12px;stroke-width:1.95}
      body.ba-installers-open{overflow:hidden!important}
      .ba-installers-surface{position:fixed;z-index:124;inset:0;background:linear-gradient(180deg,#f8fbfd 0%,#f3f8f8 100%);color:#27394a;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);font-family:inherit}
      .ba-installers-surface[hidden]{display:none!important}
      .ba-installers-head{min-height:60px;padding:10px 15px;display:grid;grid-template-columns:42px minmax(0,1fr) 42px;align-items:center;gap:8px;background:rgba(250,253,255,.96);border-bottom:1px solid rgba(70,105,130,.08);backdrop-filter:blur(16px)}
      .ba-installers-head__icon,.ba-installers-close{width:40px;height:40px;border-radius:14px;border:1px solid rgba(63,104,134,.09);background:#fff;display:grid;place-items:center;box-shadow:0 5px 16px rgba(54,83,108,.07)}
      .ba-installers-close{color:#5f7486;font-size:24px;line-height:1}.ba-installers-close svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      .ba-installers-head__copy{min-width:0;text-align:center}.ba-installers-head__copy strong{display:block;font-size:14px;line-height:1.25;color:#2c4052}.ba-installers-head__copy small{display:block;margin-top:2px;font-size:10.5px;line-height:1.2;color:#7b8b99;letter-spacing:.035em}
      .ba-installers-scroll{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:18px 15px 112px}
      .ba-installers-wrap{max-width:720px;margin:0 auto}
      .ba-installers-kicker{font-size:10px;font-weight:820;letter-spacing:.14em;color:#238e78;text-transform:uppercase}
      .ba-installers-title{margin:6px 0 7px;font-size:24px;line-height:1.16;letter-spacing:-.025em;color:#243a4c;font-weight:760}.ba-installers-lead{margin:0;color:#677d90;font-size:12.5px;line-height:1.55}
      .ba-installers-triad{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:15px 0 12px}.ba-installers-chip{padding:9px;border-radius:14px;background:#fff;border:1px solid rgba(70,113,145,.08);box-shadow:0 5px 16px rgba(57,90,116,.045)}.ba-installers-chip small{display:block;font-size:8.5px;font-weight:820;letter-spacing:.10em;color:#8a9aa7}.ba-installers-chip strong{display:block;margin-top:3px;font-size:10.5px;line-height:1.24;color:#445d70;white-space:normal;min-height:2.48em}
      .ba-installers-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:13px 0}.ba-installers-stat{padding:10px 8px;border-radius:15px;background:#fff;border:1px solid rgba(66,107,137,.07);min-width:0}.ba-installers-stat b{display:block;font-size:13px;line-height:1.25;color:#2c526b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-installers-stat span{display:block;margin-top:3px;font-size:9px;line-height:1.25;color:#8796a3}
      .ba-installers-notice{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;padding:11px 12px;margin:12px 0;border-radius:17px;background:linear-gradient(135deg,#fffaf0,#fffdf9);border:1px solid rgba(196,145,65,.12)}.ba-installers-notice--info{background:linear-gradient(135deg,#f0faf7,#f8fdfb);border-color:rgba(38,151,128,.10)}.ba-installers-notice__icon{width:34px;height:34px;border-radius:12px;background:#fff7e6;color:#a87531;display:grid;place-items:center}.ba-installers-notice--info .ba-installers-notice__icon{background:#e9f8f4;color:#278f7a}.ba-installers-notice__icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ba-installers-notice strong{display:block;font-size:11.8px;line-height:1.35;color:#4b5360}.ba-installers-notice small{display:block;margin-top:3px;font-size:10.7px;line-height:1.48;color:#7a7f87}
      .ba-installers-progress{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 11px;margin:10px 0;border-radius:14px;background:linear-gradient(135deg,#effaf7,#f8fcfb);border:1px solid rgba(40,147,125,.09);color:#57766f;font-size:10.6px}.ba-installers-progress i{display:block;height:5px;flex:1;border-radius:99px;background:#e1f0ec;overflow:hidden}.ba-installers-progress i span{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#69d3bd,#2ba58e);transition:width .2s ease}
      .ba-installers-controls{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;margin:14px 0 10px}.ba-installers-select{height:40px;border-radius:13px;border:1px solid rgba(69,111,143,.10);background:#fff;color:#465f73;padding:0 32px 0 11px;font:inherit;font-size:11px;font-weight:680;min-width:0;outline:none}
      .ba-installers-sectionhead{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin:13px 1px 8px}.ba-installers-sectionhead strong{font-size:12.5px;color:#40586b;line-height:1.3}.ba-installers-sectionhead small{font-size:10px;color:#8997a3;white-space:nowrap}
      .ba-installers-list{display:grid;gap:8px}.ba-installer-file{display:grid;grid-template-columns:24px 44px minmax(0,1fr) auto;gap:9px;align-items:center;min-height:88px;padding:10px;border-radius:18px;background:#fff;border:1px solid rgba(70,111,142,.075);box-shadow:0 5px 18px rgba(52,86,111,.035);transition:border-color .15s ease,box-shadow .15s ease}.ba-installer-file.is-selected{border-color:rgba(38,151,128,.26);box-shadow:0 7px 20px rgba(35,128,108,.09)}.ba-installer-file.is-danger{border-color:rgba(203,91,98,.18)}.ba-installer-file input{width:19px;height:19px;margin:0;accent-color:#259c84}.ba-installer-file__icon{width:44px;height:44px;border-radius:14px;background:linear-gradient(145deg,#edf9f5,#e6f5f0);color:#2c987f;display:grid;place-items:center}.ba-installer-file__icon svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
      .ba-installer-file__copy{min-width:0}.ba-installer-file__type{display:inline-block;margin-bottom:3px;padding:2px 6px;border-radius:99px;background:#eaf7f3;color:#2b816f;font-size:8.5px;line-height:1.25;font-weight:800;letter-spacing:.04em;text-transform:uppercase}.ba-installer-file__copy strong{display:block;font-size:11.8px;line-height:1.3;color:#354b5c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-installer-file__copy>small{display:block;margin-top:2px;font-size:9.6px;line-height:1.3;color:#8795a1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-installer-package{display:block;margin-top:4px;font-size:9px;line-height:1.25;color:#738899;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-installer-status{display:grid;grid-template-columns:auto minmax(0,1fr);gap:6px;align-items:start;margin-top:6px}.ba-installer-status b{display:inline-flex;width:max-content;max-width:100%;padding:3px 7px;border-radius:99px;font-size:8.8px;line-height:1.2;font-weight:800;white-space:nowrap}.ba-installer-status span{font-size:9.2px;line-height:1.3;color:#7e8d98}.ba-installer-status[data-tone='mint'] b,.ba-installer-status[data-tone='teal'] b{background:#e5f7f1;color:#247963}.ba-installer-status[data-tone='blue'] b{background:#eaf4fd;color:#347bb0}.ba-installer-status[data-tone='amber'] b{background:#fff4dc;color:#9b6c23}.ba-installer-status[data-tone='danger'] b{background:#fff0f1;color:#a54e57}.ba-installer-status[data-tone='slate'] b,.ba-installer-status[data-tone='loading'] b{background:#eef3f6;color:#637888}
      .ba-installer-file__meta{text-align:right;min-width:68px}.ba-installer-file__meta b{display:block;font-size:10.8px;color:#526a7c}.ba-installer-file__meta small{display:block;margin-top:3px;font-size:9px;color:#939faa;white-space:nowrap}
      .ba-installers-empty,.ba-installers-state{padding:28px 18px;margin-top:16px;border-radius:22px;background:#fff;border:1px solid rgba(67,108,139,.07);text-align:center;box-shadow:0 10px 28px rgba(52,84,108,.045)}.ba-installers-state__icon{width:54px;height:54px;margin:0 auto 12px;border-radius:18px;background:linear-gradient(145deg,#eaf9f5,#e3f4ef);color:#29927c;display:grid;place-items:center}.ba-installers-state__icon svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}.ba-installers-state h3,.ba-installers-empty h3{margin:0;font-size:17px;line-height:1.25;color:#30495c}.ba-installers-state p,.ba-installers-empty p{max-width:520px;margin:8px auto 0;font-size:11.5px;line-height:1.55;color:#778b9a}.ba-installers-state__spinner{width:34px;height:34px;margin:0 auto 13px;border-radius:50%;border:3px solid #e4f1ed;border-top-color:#2b9c84;animation:baInstallersSpin .8s linear infinite}
      .ba-installers-primary,.ba-installers-secondary{min-height:44px;border-radius:14px;padding:0 16px;font:inherit;font-size:11.5px;font-weight:760}.ba-installers-primary{background:linear-gradient(135deg,#33b99f,#228f79);color:#fff;box-shadow:0 8px 20px rgba(28,128,108,.18)}.ba-installers-primary:disabled{opacity:.45;box-shadow:none}.ba-installers-secondary{background:#fff;color:#557084;border:1px solid rgba(69,111,143,.12)}.ba-installers-actions{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:15px}
      .ba-installers-inline{margin:10px 1px 0;font-size:9.8px;line-height:1.45;color:#8b7d69}.ba-installers-inline.is-error{color:#a84f58}
      .ba-installers-selection{position:fixed;z-index:126;left:0;right:0;bottom:0;padding:9px 14px calc(9px + env(safe-area-inset-bottom));background:rgba(249,252,254,.96);border-top:1px solid rgba(63,104,134,.09);backdrop-filter:blur(18px)}.ba-installers-selection__inner{max-width:720px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center}.ba-installers-selection__copy{min-width:0}.ba-installers-selection__copy strong{display:block;font-size:11.7px;color:#40596c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-installers-selection__copy small{display:block;margin-top:2px;font-size:9.3px;color:#8a98a4}
      .ba-installers-result-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:16px 0}.ba-installers-result-card{padding:12px 10px;border-radius:17px;background:#fff;border:1px solid rgba(69,111,143,.08)}.ba-installers-result-card b{display:block;font-size:15px;color:#2e5369}.ba-installers-result-card span{display:block;margin-top:4px;font-size:9.3px;color:#8795a1}.ba-installers-confirm-list{display:grid;gap:6px;margin:13px 0}.ba-installers-confirm-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:9px 10px;border-radius:13px;background:rgba(255,255,255,.76);border:1px solid rgba(70,111,142,.07)}.ba-installers-confirm-item strong{font-size:10.6px;line-height:1.3;color:#455d70;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-installers-confirm-item span{font-size:9.8px;color:#84939f;white-space:nowrap}
      @keyframes baInstallersSpin{to{transform:rotate(360deg)}}
      @media(max-width:380px){.ba-installers-scroll{padding-left:11px;padding-right:11px}.ba-installers-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.ba-installer-file{grid-template-columns:22px 40px minmax(0,1fr);align-items:start}.ba-installer-file__icon{width:40px;height:40px}.ba-installer-file__meta{grid-column:3;text-align:left;display:flex;gap:8px;align-items:center;min-width:0}.ba-installer-status{grid-template-columns:1fr}.ba-installers-triad{gap:5px}.ba-installers-chip{padding:8px 7px}}
      @media(prefers-reduced-motion:reduce){.ba-installers-progress i span,.ba-installer-file{transition:none!important}.ba-installers-state__spinner{animation:none!important}}
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
    let entry = list.querySelector('[data-tool="installers"]');
    if (!entry) {
      entry = document.createElement('button');
      entry.type = 'button';
      entry.dataset.tool = 'installers';
      entry.className = 'ba-installers-entry';
    }
    const downloads = list.querySelector('[data-tool="downloads"]');
    if (downloads) {
      const next = downloads.nextElementSibling;
      if (next !== entry) downloads.insertAdjacentElement('afterend', entry);
    } else if (!entry.isConnected) {
      list.appendChild(entry);
    }
    entry.classList.add('ba-installers-entry');
    updateEntryCopy(entry);
    return entry;
  }

  function updateEntryCopy(entry = document.querySelector('#toolsScreen [data-tool="installers"]')) {
    if (!entry) return;
    const copy = c();
    const summary = parse(NATIVE.getReviewSummary?.(), {});
    const status = summary?.available && Number.isFinite(Number(summary.installersCount))
      ? `${n(summary.installersCount)} ${copy.installers} · ${formatBytes(summary.installersBytes)}`
      : copy.toolSub;
    const signature = `${language()}|${copy.toolTitle}|${status}`;
    if (entry.dataset.installersSignature !== signature) {
      entry.dataset.installersSignature = signature;
      entry.innerHTML = `<span class="mini-icon ba-installers-tool-icon">${installerBadge('tool')}</span><span><strong>${esc(copy.toolTitle)}</strong><small>${esc(status)}</small></span><b>›</b>`;
      entry.setAttribute('aria-label', `${copy.toolTitle}. ${status}`);
    }
  }

  function ensureSurface() {
    ensureStyle();
    let surface = byId('baInstallersSurface');
    if (surface) return surface;
    surface = document.createElement('section');
    surface.id = 'baInstallersSurface';
    surface.className = 'ba-installers-surface';
    surface.hidden = true;
    surface.setAttribute('role', 'dialog');
    surface.setAttribute('aria-modal', 'true');
    surface.setAttribute('aria-labelledby', 'baInstallersSurfaceTitle');
    surface.innerHTML = `
      <header class="ba-installers-head">
        <span class="ba-installers-head__icon">${installerBadge('header')}</span>
        <div class="ba-installers-head__copy"><strong id="baInstallersSurfaceTitle"></strong><small>BEARAGNOSTIC · LOCAL REVIEW</small></div>
        <button class="ba-installers-close" type="button" data-installer-action="close" aria-label="Close">×</button>
      </header>
      <div class="ba-installers-scroll"><div class="ba-installers-wrap" id="baInstallersContent"></div></div>
      <div id="baInstallersSelection"></div>
    `;
    document.body.appendChild(surface);
    bindSurface(surface);
    return surface;
  }

  function baseIntro() {
    const copy = c();
    const custom = state.summary?.scanMode === 'custom';
    return `<div class="ba-installers-kicker">${esc(copy.kicker)}</div><h2 class="ba-installers-title">${esc(copy.title)}</h2><p class="ba-installers-lead">${esc(copy.lead)}</p>
      <div class="ba-installers-triad">
        <div class="ba-installers-chip"><small>${esc(copy.source)}</small><strong>${esc(copy.sourceSnapshot)}</strong></div>
        <div class="ba-installers-chip"><small>${esc(copy.coverage)}</small><strong>${esc(custom ? copy.customCoverage : copy.fullCoverage)}</strong></div>
        <div class="ba-installers-chip"><small>${esc(copy.safety)}</small><strong>${esc(copy.reviewFirst)}</strong></div>
      </div>`;
  }

  function stateCard(iconName, title, body, actions = '') {
    return `<div class="ba-installers-state"><span class="ba-installers-state__icon">${icon(iconName)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p>${actions ? `<div class="ba-installers-actions">${actions}</div>` : ''}</div>`;
  }

  function renderAccess() {
    const copy = c();
    return `${baseIntro()}${stateCard('shield', copy.accessTitle, copy.accessBody, `<button class="ba-installers-primary" type="button" data-installer-action="permission">${esc(copy.openSettings)}</button>`)}`;
  }

  function renderNoSnapshot() {
    const copy = c();
    return `${baseIntro()}${stateCard('installer', copy.noSnapshotTitle, copy.noSnapshotBody, `<button class="ba-installers-primary" type="button" data-installer-action="scan">${esc(copy.runQuick)}</button>`)}`;
  }

  function renderScanning() {
    const copy = c();
    return `${baseIntro()}<div class="ba-installers-state"><div class="ba-installers-state__spinner" aria-hidden="true"></div><h3>${esc(copy.scanningTitle)}</h3><p>${esc(copy.scanningBody)}</p><p>${esc(copy.scanningHint)}</p></div>`;
  }

  function renderError() {
    const copy = c();
    return `${baseIntro()}${stateCard('warning', copy.errorTitle, state.error || copy.scanFailed, `<button class="ba-installers-primary" type="button" data-installer-action="retry">${esc(copy.retry)}</button>`)}`;
  }

  function renderEmpty() {
    const copy = c();
    const custom = state.summary?.scanMode === 'custom';
    const customNotice = custom ? `<div class="ba-installers-notice ba-installers-notice--info"><span class="ba-installers-notice__icon">${icon('info')}</span><div><strong>${esc(copy.customTitle)}</strong><small>${esc(copy.customBody)}</small><div class="ba-installers-actions" style="justify-content:flex-start;margin-top:8px"><button class="ba-installers-secondary" type="button" data-installer-action="scan">${esc(copy.checkAll)}</button></div></div></div>` : '';
    return `${baseIntro()}${customNotice}${state.summary?.detailsTruncated ? stateCard('warning', copy.partialTitle, copy.partialBody, `<button class="ba-installers-secondary" type="button" data-installer-action="scan">${esc(copy.refresh)}</button>`) : stateCard('installer', copy.noFilesTitle, copy.noFilesBody, `<button class="ba-installers-secondary" type="button" data-installer-action="scan">${esc(copy.refresh)}</button>`)}`;
  }

  function packageLine(item, detail) {
    const copy = c();
    if (!detail || !detail.available) return '';
    const pieces = [];
    if (detail.packageName) pieces.push(`${copy.packageLabel}: ${detail.packageName}`);
    if (detail.appVersion) pieces.push(`${copy.versionLabel}: ${detail.appVersion}`);
    if (detail.installedVersion) pieces.push(`${copy.installedVersionLabel}: ${detail.installedVersion}`);
    return pieces.join(' · ');
  }

  function renderResults() {
    const copy = c();
    const base = visibleBaseItems();
    if (!base.length) return renderEmpty();
    const allFiltered = visibleItems();
    const items = allFiltered.slice(0, state.renderLimit);
    const totalBytes = base.reduce((sum, item) => sum + n(item.sizeBytes), 0);
    const allMetaDone = metadataComplete();
    const custom = state.summary?.scanMode === 'custom';
    const stale = !isFresh();
    const hiddenNote = HIDDEN?.enabled === false ? `<div class="ba-installers-inline">${esc(copy.hiddenOff)}</div>` : '';
    const partialNote = state.summary?.detailsTruncated ? `<div class="ba-installers-notice"><span class="ba-installers-notice__icon">${icon('warning')}</span><div><strong>${esc(copy.partialTitle)}</strong><small>${esc(copy.partialBody)}</small></div></div>` : '';
    const customNote = custom ? `<div class="ba-installers-notice ba-installers-notice--info"><span class="ba-installers-notice__icon">${icon('info')}</span><div><strong>${esc(copy.customTitle)}</strong><small>${esc(copy.customBody)}</small><div class="ba-installers-actions" style="justify-content:flex-start;margin-top:8px"><button class="ba-installers-secondary" type="button" data-installer-action="scan">${esc(copy.checkAll)}</button></div></div></div>` : '';
    const staleNote = stale ? `<div class="ba-installers-notice"><span class="ba-installers-notice__icon">${icon('refresh')}</span><div><strong>${esc(copy.staleTitle)}</strong><small>${esc(copy.staleBody)}</small><div class="ba-installers-actions" style="justify-content:flex-start;margin-top:8px"><button class="ba-installers-secondary" type="button" data-installer-action="scan">${esc(copy.refresh)}</button></div></div></div>` : '';
    const runningNote = state.scannerRunning ? `<div class="ba-installers-notice ba-installers-notice--info"><span class="ba-installers-notice__icon">${icon('refresh')}</span><div><strong>${esc(copy.scanningTitle)}</strong><small>${esc(copy.anotherScan)}</small></div></div>` : '';
    const progress = metadataTarget() > 0 && !allMetaDone ? Math.round((metadataResolved() / metadataTarget()) * 100) : 100;
    const metadataBar = `<div class="ba-installers-progress"><span>${esc(allMetaDone ? copy.metadataDone : copy.metadataProgress.replace('{done}', metadataResolved()).replace('{total}', metadataTarget()))}</span><i aria-hidden="true"><span style="width:${progress}%"></span></i></div>`;
    const installedValue = allMetaDone ? confirmedInstalledCount() : '—';
    const olderValue = allMetaDone ? olderInstallerCount() : '—';

    const rows = items.length ? items.map((item) => {
      const detail = detailFor(item);
      const status = statusFor(item);
      const [statusLabel, statusSub] = statusText(status);
      const tone = statusTone(status);
      const title = detail?.appName || item.name || '(unnamed)';
      const secondary = detail?.appName ? item.name : (detail?.packageName || item.location || 'Shared storage');
      const packageMeta = packageLine(item, detail);
      const checked = state.selected.has(item.id);
      return `<label class="ba-installer-file${checked ? ' is-selected' : ''}${status === 'identity_mismatch' ? ' is-danger' : ''}">
        <input type="checkbox" data-installer-id="${esc(item.id)}"${checked ? ' checked' : ''}${state.scannerRunning ? ' disabled' : ''}>
        <span class="ba-installer-file__icon">${icon('installer')}</span>
        <span class="ba-installer-file__copy"><span class="ba-installer-file__type">APK</span><strong>${esc(title)}</strong><small>${esc(secondary)}</small>${packageMeta ? `<span class="ba-installer-package">${esc(packageMeta)}</span>` : ''}<span class="ba-installer-status" data-tone="${esc(tone)}"><b>${esc(statusLabel)}</b><span>${esc(statusSub)}</span></span></span>
        <span class="ba-installer-file__meta"><b>${esc(formatBytes(item.sizeBytes))}</b><small>${esc(dateLabel(item.modifiedMs))}</small></span>
      </label>`;
    }).join('') : `<div class="ba-installers-empty"><h3>${esc(copy.noFilter)}</h3></div>`;

    return `${baseIntro()}
      <div class="ba-installers-stats">
        <div class="ba-installers-stat"><b>${base.length}</b><span>${esc(copy.installers)}</span></div>
        <div class="ba-installers-stat"><b>${esc(formatBytes(totalBytes))}</b><span>${esc(copy.totalSize)}</span></div>
        <div class="ba-installers-stat"><b>${installedValue}</b><span>${esc(copy.installed)}</span></div>
        <div class="ba-installers-stat"><b>${olderValue}</b><span>${esc(copy.older)}</span></div>
      </div>
      ${metadataBar}
      <div class="ba-installers-notice"><span class="ba-installers-notice__icon">${icon('warning')}</span><div><strong>${esc(copy.cautionTitle)}</strong><small>${esc(copy.cautionBody)}</small></div></div>
      <div class="ba-installers-notice ba-installers-notice--info"><span class="ba-installers-notice__icon">${icon('info')}</span><div><strong>${esc(copy.visibilityTitle)}</strong><small>${esc(copy.visibilityBody)}</small></div></div>
      ${partialNote}${customNote}${staleNote}${runningNote}${hiddenNote}
      <div class="ba-installers-controls">
        <select class="ba-installers-select" data-installer-control="filter" aria-label="Filter">
          <option value="all"${state.filter === 'all' ? ' selected' : ''}>${esc(copy.filterAll)}</option>
          <option value="older"${state.filter === 'older' ? ' selected' : ''}>${esc(copy.filterOlder)}</option>
          <option value="installed"${state.filter === 'installed' ? ' selected' : ''}>${esc(copy.filterInstalled)}</option>
          <option value="newer"${state.filter === 'newer' ? ' selected' : ''}>${esc(copy.filterNewer)}</option>
          <option value="notinstalled"${state.filter === 'notinstalled' ? ' selected' : ''}>${esc(copy.filterNotInstalled)}</option>
          <option value="context"${state.filter === 'context' ? ' selected' : ''}>${esc(copy.filterContext)}</option>
        </select>
        <select class="ba-installers-select" data-installer-control="sort" aria-label="Sort">
          <option value="status"${state.sort === 'status' ? ' selected' : ''}>${esc(copy.sortStatus)}</option>
          <option value="largest"${state.sort === 'largest' ? ' selected' : ''}>${esc(copy.sortLargest)}</option>
          <option value="newest"${state.sort === 'newest' ? ' selected' : ''}>${esc(copy.sortNewest)}</option>
          <option value="oldest"${state.sort === 'oldest' ? ' selected' : ''}>${esc(copy.sortOldest)}</option>
          <option value="name"${state.sort === 'name' ? ' selected' : ''}>${esc(copy.sortName)}</option>
        </select>
      </div>
      <div class="ba-installers-sectionhead"><strong>${esc(copy.selectionTitle)}</strong><small>${esc(copy.showing.replace('{shown}', items.length).replace('{total}', allFiltered.length))}</small></div>
      <div class="ba-installers-list">${rows}</div>
      ${items.length < allFiltered.length ? `<div class="ba-installers-actions"><button class="ba-installers-secondary" type="button" data-installer-action="more">${esc(copy.showMore)} · ${allFiltered.length - items.length}</button></div>` : ''}
      ${state.message ? `<div class="ba-installers-inline${state.message === copy.limitReached ? ' is-error' : ''}">${esc(state.message)}</div>` : ''}`;
  }

  function renderConfirm() {
    const copy = c();
    const chosen = selectedItems();
    const bytes = chosen.reduce((sum, item) => sum + n(item.sizeBytes), 0);
    const preview = chosen.slice(0, 8).map((item) => {
      const detail = detailFor(item);
      return `<div class="ba-installers-confirm-item"><strong>${esc(detail?.appName || item.name || '(unnamed)')}</strong><span>${esc(formatBytes(item.sizeBytes))}</span></div>`;
    }).join('');
    const remaining = chosen.length > 8 ? `<div class="ba-installers-inline">+${chosen.length - 8}</div>` : '';
    return `<div class="ba-installers-kicker">${esc(copy.finalKicker)}</div><h2 class="ba-installers-title">${esc(copy.finalTitle)}</h2><p class="ba-installers-lead">${esc(copy.finalBody)}</p>
      <div class="ba-installers-result-grid">
        <div class="ba-installers-result-card"><b>${chosen.length}</b><span>${esc(copy.selectedFiles)}</span></div>
        <div class="ba-installers-result-card"><b>${esc(formatBytes(bytes))}</b><span>${esc(copy.selectedBytes)}</span></div>
        <div class="ba-installers-result-card"><b>${isFresh() ? 'LIVE' : 'STALE'}</b><span>${esc(copy.safety)}</span></div>
      </div>
      <div class="ba-installers-notice"><span class="ba-installers-notice__icon">${icon('shield')}</span><div><strong>${esc(copy.reviewFirst)}</strong><small>${esc(copy.protection)}</small></div></div>
      <div class="ba-installers-confirm-list">${preview}${remaining}</div>
      <div class="ba-installers-inline">${esc(copy.limit)}</div>
      <div class="ba-installers-actions">
        <button class="ba-installers-secondary" type="button" data-installer-action="back">${esc(copy.back)}</button>
        <button class="ba-installers-primary" type="button" data-installer-action="delete"${!chosen.length || !isFresh() || state.scannerRunning ? ' disabled' : ''}>${esc(copy.deleteVerify)}</button>
      </div>`;
  }

  function renderDeleting() {
    const copy = c();
    return `${baseIntro()}<div class="ba-installers-state"><div class="ba-installers-state__spinner" aria-hidden="true"></div><h3>${esc(copy.deleting)}</h3><p>${esc(copy.resultBody)}</p></div>`;
  }

  function renderResult() {
    const copy = c();
    const result = state.result || {};
    const protectedCount = Array.isArray(result.protectedIds) ? result.protectedIds.length : 0;
    const failedCount = Array.isArray(result.failed) ? result.failed.length : 0;
    return `<div class="ba-installers-kicker">${esc(copy.resultKicker)}</div><h2 class="ba-installers-title">${esc(copy.resultTitle)}</h2><p class="ba-installers-lead">${esc(copy.resultBody)}</p>
      <div class="ba-installers-result-grid">
        <div class="ba-installers-result-card"><b>${esc(formatBytes(result.reclaimedBytes))}</b><span>${esc(copy.reclaimed)}</span></div>
        <div class="ba-installers-result-card"><b>${n(result.deletedCount)}</b><span>${esc(copy.removed)}</span></div>
        <div class="ba-installers-result-card"><b>${protectedCount}</b><span>${esc(copy.protected)}</span></div>
      </div>
      ${failedCount ? `<div class="ba-installers-notice"><span class="ba-installers-notice__icon">${icon('warning')}</span><div><strong>${failedCount} ${esc(copy.failed)}</strong><small>${esc(copy.resultBody)}</small></div></div>` : ''}
      <div class="ba-installers-actions">
        <button class="ba-installers-secondary" type="button" data-installer-action="remaining">${esc(copy.reviewRemaining)}</button>
        <button class="ba-installers-primary" type="button" data-installer-action="close">${esc(copy.done)}</button>
      </div>`;
  }

  function renderSelection() {
    const host = byId('baInstallersSelection');
    if (!host) return;
    const chosen = selectedItems();
    if (!state.open || state.view !== 'results') { host.innerHTML = ''; return; }
    const copy = c();
    const bytes = chosen.reduce((sum, item) => sum + n(item.sizeBytes), 0);
    host.innerHTML = `<div class="ba-installers-selection"><div class="ba-installers-selection__inner">
      <div class="ba-installers-selection__copy"><strong>${esc(copy.selected.replace('{count}', chosen.length).replace('{bytes}', formatBytes(bytes)))}</strong><small>${esc(copy.limit)}</small></div>
      <button class="ba-installers-secondary" type="button" data-installer-action="clear"${chosen.length ? '' : ' disabled'}>${esc(copy.clear)}</button>
      <button class="ba-installers-primary" type="button" data-installer-action="review"${chosen.length && isFresh() && !state.scannerRunning ? '' : ' disabled'}>${esc(copy.reviewSelected)}</button>
    </div></div>`;
  }

  function render() {
    const surface = ensureSurface();
    const content = byId('baInstallersContent');
    const title = byId('baInstallersSurfaceTitle');
    if (title) title.textContent = c().toolTitle;
    if (!content) return;
    if (state.loading) content.innerHTML = `${baseIntro()}<div class="ba-installers-state"><div class="ba-installers-state__spinner"></div></div>`;
    else if (state.error) content.innerHTML = renderError();
    else if (!state.native?.broadStorageAccess) content.innerHTML = renderAccess();
    else if (state.scannerRunning && !state.summary?.available) content.innerHTML = renderScanning();
    else if (!state.summary?.available) content.innerHTML = renderNoSnapshot();
    else if (state.view === 'confirm') content.innerHTML = renderConfirm();
    else if (state.view === 'deleting') content.innerHTML = renderDeleting();
    else if (state.view === 'result') content.innerHTML = renderResult();
    else content.innerHTML = renderResults();
    renderSelection();
  }

  async function loadCandidates() {
    const token = ++state.loadToken;
    const items = [];
    let offset = 0;
    let total = 0;
    let truncated = false;
    while (true) {
      const page = parse(NATIVE.getReviewCandidates?.(CATEGORY, offset, REVIEW_PAGE_SIZE), {});
      if (token !== state.loadToken) return;
      if (!page?.available) break;
      const next = Array.isArray(page.items) ? page.items : [];
      items.push(...next);
      total = n(page.totalCount);
      truncated = Boolean(page.detailsTruncated);
      if (!page.hasMore || next.length === 0 || items.length >= total) break;
      offset += next.length;
    }
    if (token !== state.loadToken) return;
    state.items = items;
    if (state.summary) state.summary.detailsTruncated = Boolean(state.summary.detailsTruncated || truncated);
    syncSelectionPrivacy();
    queueMetadata();
  }

  async function refresh(options = {}) {
    state.loading = true;
    state.error = '';
    state.message = '';
    render();
    try {
      state.native = parse(NATIVE.getNativeState?.(), {});
      state.scannerRunning = Boolean(state.native?.scannerRunning);
      state.summary = parse(NATIVE.getReviewSummary?.(), {});
      if (!state.summary?.available) {
        state.items = [];
        if (state.scannerRunning) startPolling();
      } else {
        await loadCandidates();
        if (state.scannerRunning) startPolling();
      }
      if (!options.keepView) state.view = 'results';
    } catch (_) {
      state.error = c().errorTitle;
    } finally {
      state.loading = false;
      render();
      updateEntryCopy();
    }
  }

  function queueMetadata() {
    attachMediaBridge();
    for (const item of visibleBaseItems()) {
      if (!item?.id || state.details.has(item.id) || state.detailRequested.has(item.id)) continue;
      state.detailRequested.add(item.id);
      const requestId = `apk37_${++state.detailSequence}_${String(item.id).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 24)}`;
      state.detailPending.set(requestId, item.id);
      let result = {};
      try { result = parse(NATIVE.requestReviewMedia?.(item.id, 'compact', requestId), {}); } catch (_) {}
      if (!result?.accepted) {
        state.detailPending.delete(requestId);
        state.details.set(item.id, {available: false, kind: 'apk', apkMetadataStatus: 'unavailable', installStatus: 'metadata_unavailable'});
      }
    }
  }

  function handleMediaReady(requestId, payload) {
    const id = state.detailPending.get(String(requestId));
    if (!id) return;
    state.detailPending.delete(String(requestId));
    const detail = parse(payload, {});
    state.details.set(id, detail?.kind === 'apk' ? detail : {available: false, kind: 'apk', apkMetadataStatus: 'unavailable', installStatus: 'metadata_unavailable'});
    if (state.open && state.view === 'results') render();
  }

  function attachMediaBridge(attempt = 0) {
    if (state.mediaHooked) return;
    const base = window.BearagnosticReviewMedia;
    if (!base || typeof base.onMediaReady !== 'function') {
      if (attempt < MEDIA_HOOK_RETRIES) window.setTimeout(() => attachMediaBridge(attempt + 1), MEDIA_HOOK_RETRY_MS);
      return;
    }
    if (base.__installersWrapped === BUILD) { state.mediaHooked = true; return; }
    const original = base.onMediaReady.bind(base);
    window.BearagnosticReviewMedia = {
      ...base,
      __installersWrapped: BUILD,
      onMediaReady(requestId, payload) {
        try { original(requestId, payload); } finally { handleMediaReady(requestId, payload); }
      }
    };
    state.mediaHooked = true;
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
        state.details.clear(); state.detailPending.clear(); state.detailRequested.clear();
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
      state.details.clear(); state.detailPending.clear(); state.detailRequested.clear();
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
      const deletedIds = new Set(Array.isArray(result.deletedIds) ? result.deletedIds : []);
      for (const id of deletedIds) {
        state.details.delete(id);
        state.detailRequested.delete(id);
      }
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
      if (target?.matches?.('[data-installer-control="filter"]')) {
        state.filter = target.value || 'all';
        state.renderLimit = RENDER_BATCH;
        render();
        return;
      }
      if (target?.matches?.('[data-installer-control="sort"]')) {
        state.sort = target.value || 'status';
        state.renderLimit = RENDER_BATCH;
        render();
        return;
      }
      if (target?.matches?.('[data-installer-id]')) toggleSelection(target.dataset.installerId, Boolean(target.checked));
    });

    surface.addEventListener('click', async (event) => {
      const button = event.target?.closest?.('[data-installer-action]');
      if (!button) return;
      const action = button.dataset.installerAction;
      if (action === 'close') close();
      else if (action === 'permission') { try { NATIVE.requestBroadStorageAccess?.(); } catch (_) {} }
      else if (action === 'scan') startQuickScan();
      else if (action === 'retry') await refresh();
      else if (action === 'clear') { state.selected.clear(); state.message = ''; render(); }
      else if (action === 'more') { state.renderLimit += RENDER_BATCH; render(); }
      else if (action === 'review') {
        if (selectedItems().length && isFresh() && !state.scannerRunning) {
          state.view = 'confirm'; render(); surface.querySelector('.ba-installers-scroll')?.scrollTo?.({top: 0});
        }
      } else if (action === 'back') { state.view = 'results'; render(); }
      else if (action === 'delete') await performDelete();
      else if (action === 'remaining') { state.view = 'results'; state.result = null; render(); }
    });
  }

  async function open() {
    ensureEntry();
    attachMediaBridge();
    const surface = ensureSurface();
    state.open = true;
    state.view = 'results';
    state.error = '';
    state.message = '';
    state.result = null;
    state.renderLimit = RENDER_BATCH;
    surface.hidden = false;
    document.body.classList.add('ba-installers-open');
    await refresh();
    window.requestAnimationFrame(() => surface.querySelector('[data-installer-action="close"]')?.focus?.());
  }

  function close() {
    const surface = byId('baInstallersSurface');
    state.open = false;
    stopPolling();
    if (surface) surface.hidden = true;
    document.body.classList.remove('ba-installers-open');
    state.selected.clear();
    state.message = '';
    state.error = '';
    updateEntryCopy();
    document.querySelector('#toolsScreen [data-tool="installers"]')?.focus?.();
  }

  function initialize() {
    ensureStyle();
    ensureEntry();
    updateEntryCopy();
    attachMediaBridge();
    const observer = new MutationObserver(() => { ensureEntry(); ensureToolsGrowth(); });
    const tools = byId('toolsScreen');
    if (tools) observer.observe(tools, {childList: true, subtree: true});
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target?.closest?.('[data-tool="installers"]');
    if (!trigger || trigger.closest('#baInstallersSurface')) return;
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

  window.BearagnosticInstallers = Object.freeze({
    build: BUILD,
    open,
    close,
    refresh: () => refresh(),
    category: CATEGORY
  });
})();
