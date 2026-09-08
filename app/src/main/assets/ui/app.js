(() => {
  'use strict';

  const COPY = {
    en: {
      doctorIn:'Dr. Bear is in.',preferences:'Preferences',heroTitle:'<em>A cleaner device</em><br><em>for a smoother you.</em>',startCheckup:'Start Checkup',startCheckupBody:'Smart scan of accessible storage',
      duplicates:'Duplicates',duplicatesSub:'Find exact copies',largeFiles:'Large Files',largeFilesSub:'See the biggest',olderFiles:'Old Files',olderFilesSub:'Review by age',downloads:'Downloads',downloadsSub:'Review clutter',fileHealth:'File Health',fileHealthSub:'Your latest checkup summary will appear here.',editorialQuote:'A cleaner device leads to a calmer mind.',
      scanKicker:'SCANNING YOUR FILES',scanIdleTitle:'Ready for a checkup',scanIdleSub:'Choose a scan mode or start with Smart.',scanRunningTitle:'Checking things out',scanRunningSub:'A cleaner device leads to brighter days.',scanDoneTitle:'Checkup complete',scanDoneSub:'Accessible files have been reviewed locally.',scanCancelledTitle:'Checkup cancelled',scanCancelledSub:'Nothing was deleted. You can run the checkup again.',scanErrorTitle:'Checkup could not finish',scanErrorSub:'Try again. If storage changed during the scan, Bearagnostic will re-check it.',recommendedBalance:'Recommended balance',
      stagePreparing:'Preparing',stagePreparingSub:'Getting ready',stageFiles:'File Details',stageFilesSub:'Reading info',stageDuplicates:'Duplicates',stageDuplicatesSub:'Finding matches',stageDuplicatesSkipped:'Skipped in Quick',stageFinalizing:'Finalizing',stageFinalizingSub:'Almost there',
      ready:'READY',scanning:'SCANNING',hashing:'VERIFYING',complete:'COMPLETE',cancelled:'CANCELLED',error:'ERROR',filesReviewed:'files reviewed',duplicateCopies:'exact duplicate copies',duplicatesNotChecked:'not checked',largeNoted:'large files noted',olderFound:'older files found',quoteIdle:'Your files. Your choice.',quoteRunning:'Looking carefully. Bears don’t rush diagnostics.',quoteDone:'All done. The numbers above come from the native scan.',quoteCancelled:'Stopped safely. No files were deleted.',quoteError:'No guesswork. If a scan cannot finish, Bearagnostic says so.',tipTitle:'Did you know?',tipBody:'Bearagnostic analyzes accessible files locally on this device.',local:'LOCAL',verifiedSpace:'Verified duplicate space',noDuplicateCheck:'Quick Scan does not claim exact duplicates.',
      checkingAccess:'Checking access…',allowAccess:'Allow storage access',startSmart:'Start Smart Scan',startQuick:'Start Quick Scan',startDeep:'Start Deep Scan',startCustom:'Start Custom Scan',cancelScan:'Cancel Scan',runAgain:'Run Checkup Again',
      toolsKicker:'TOOLS',toolsTitle:'Focused file review',toolsBody:'Cleaner tools will plug into the same native scan engine.',insightsKicker:'INSIGHTS',insightsTitle:'Useful patterns, once they exist',insightsBody:'Insights stay empty until real checkups create honest local history.',noInsights:'No insights yet',noInsightsSub:'Run a real checkup first. Bearagnostic will never invent a score.',moreKicker:'MORE',privacyLocal:'Privacy & local data',privacyLocalSub:'What stays on your device',aboutBearagnostic:'About Bearagnostic',
      preferencesKicker:'PREFERENCES',preferencesSub:'Language, motion and Android display behavior',language:'Language',languageSub:'Choose the interface language',motion:'Motion',motionSub:'Choose interface motion',motionSystem:'System',motionFull:'Full',motionReduced:'Reduced',fullScreen:'Full screen',fullScreenSub:'Android immersive mode is always enabled',on:'ON',navHome:'Home',navCheckup:'Checkup',navTools:'Tools',navInsights:'Insights',navMore:'More',
      scanDepth:'SCAN DEPTH',chooseMode:'Choose how deeply to scan',recommended:'Recommended',smartDesc:'Full metadata scan with focused duplicate verification.',quickDesc:'Fast scan of high-value shared locations.',deepDesc:'Most thorough accessible-storage scan and exact duplicate verification.',customDesc:'Choose locations and duplicate verification.',customTitle:'Choose what to scan',photos:'Photos',videos:'Videos',documents:'Documents',music:'Music',verifyExact:'Verify exact duplicates',verifyExactDesc:'Streaming SHA-256 only after same-size filtering.',useCustom:'Use Custom Scan',
      privacyKicker:'PRIVACY & LOCAL DATA',privacyTitle:'Local-first by design',privacyBody:'Bearagnostic analyzes user-accessible shared storage on this device. Files are not uploaded by the current architecture, and this build does not delete files. Android-protected app-private and root-only areas remain outside the scan.',aboutKicker:'ABOUT',aboutBody:'Bearagnostic for Android is a premium, privacy-first file-health cleaner by Benedict Interactive.',comingSoon:'This cleaner surface is not wired yet. No fake result will be shown.'
    },
    th: {
      doctorIn:'คุณหมอแบร์พร้อมแล้ว',preferences:'การตั้งค่า',heroTitle:'<em>เครื่องสะอาดขึ้น</em><br><em>ทุกอย่างก็ลื่นขึ้น</em>',startCheckup:'เริ่มตรวจเครื่อง',startCheckupBody:'Smart Scan พื้นที่ที่ Android อนุญาตให้เข้าถึง',
      duplicates:'ไฟล์ซ้ำ',duplicatesSub:'หาไฟล์ที่ตรงกันจริง',largeFiles:'ไฟล์ขนาดใหญ่',largeFilesSub:'ดูไฟล์ที่กินพื้นที่',olderFiles:'ไฟล์เก่า',olderFilesSub:'ตรวจตามอายุไฟล์',downloads:'ดาวน์โหลด',downloadsSub:'ตรวจไฟล์ค้างสะสม',fileHealth:'สุขภาพไฟล์',fileHealthSub:'ผลตรวจล่าสุดของคุณจะแสดงตรงนี้',editorialQuote:'เครื่องที่เป็นระเบียบขึ้น ชีวิตดิจิทัลก็เบาขึ้น',
      scanKicker:'กำลังตรวจไฟล์ในเครื่อง',scanIdleTitle:'พร้อมตรวจแล้ว',scanIdleSub:'เลือกวิธีสแกน หรือเริ่มด้วย Smart ได้ทันที',scanRunningTitle:'กำลังตรวจอย่างละเอียด',scanRunningSub:'เครื่องที่สะอาดขึ้น ช่วยให้ทุกอย่างทำงานได้คล่องขึ้น',scanDoneTitle:'ตรวจเรียบร้อยแล้ว',scanDoneSub:'ตรวจไฟล์ที่เข้าถึงได้ภายในเครื่องเรียบร้อยแล้ว',scanCancelledTitle:'ยกเลิกการตรวจแล้ว',scanCancelledSub:'ไม่มีการลบไฟล์ คุณเริ่มตรวจใหม่ได้ทุกเมื่อ',scanErrorTitle:'ตรวจไม่สำเร็จ',scanErrorSub:'ลองอีกครั้ง หาก storage มีการเปลี่ยนแปลง Bearagnostic จะตรวจใหม่ตามจริง',recommendedBalance:'สมดุลที่แนะนำ',
      stagePreparing:'เตรียมระบบ',stagePreparingSub:'กำลังเตรียม',stageFiles:'รายละเอียดไฟล์',stageFilesSub:'กำลังอ่านข้อมูล',stageDuplicates:'ไฟล์ซ้ำ',stageDuplicatesSub:'กำลังยืนยัน',stageDuplicatesSkipped:'Quick ไม่ตรวจ',stageFinalizing:'สรุปผล',stageFinalizingSub:'ใกล้เสร็จแล้ว',
      ready:'พร้อม',scanning:'กำลังตรวจ',hashing:'กำลังยืนยัน',complete:'เสร็จแล้ว',cancelled:'ยกเลิก',error:'ผิดพลาด',filesReviewed:'ไฟล์ที่ตรวจแล้ว',duplicateCopies:'สำเนาซ้ำที่ยืนยันแล้ว',duplicatesNotChecked:'ไม่ได้ตรวจ',largeNoted:'ไฟล์ขนาดใหญ่',olderFound:'ไฟล์เก่าที่พบ',quoteIdle:'ไฟล์ของคุณ คุณเป็นคนเลือก',quoteRunning:'กำลังดูให้ละเอียด การตรวจที่ดีไม่ต้องรีบ',quoteDone:'เรียบร้อย ตัวเลขทั้งหมดมาจากการสแกนจริง',quoteCancelled:'หยุดอย่างปลอดภัย ไม่มีไฟล์ถูกลบ',quoteError:'ไม่เดาผล หากตรวจไม่จบ Bearagnostic จะบอกตามจริง',tipTitle:'รู้หรือไม่?',tipBody:'Bearagnostic วิเคราะห์ไฟล์ที่เข้าถึงได้ภายในเครื่องนี้',local:'ในเครื่อง',verifiedSpace:'พื้นที่ไฟล์ซ้ำที่ยืนยันแล้ว',noDuplicateCheck:'Quick Scan จะไม่อ้างว่าไฟล์ใดซ้ำแบบตรงกันจริง',
      checkingAccess:'กำลังตรวจสิทธิ์…',allowAccess:'อนุญาตสิทธิ์เข้าถึงไฟล์',startSmart:'เริ่ม Smart Scan',startQuick:'เริ่ม Quick Scan',startDeep:'เริ่ม Deep Scan',startCustom:'เริ่ม Custom Scan',cancelScan:'ยกเลิกการสแกน',runAgain:'ตรวจอีกครั้ง',
      toolsKicker:'เครื่องมือ',toolsTitle:'ตรวจไฟล์แบบเจาะจง',toolsBody:'เครื่องมือ Cleaner จะใช้ native scan engine เดียวกัน',insightsKicker:'ข้อมูลเชิงลึก',insightsTitle:'ดูรูปแบบที่มีข้อมูลจริงรองรับ',insightsBody:'ส่วนนี้จะยังว่างจนกว่าการตรวจจริงจะสร้างประวัติในเครื่อง',noInsights:'ยังไม่มีข้อมูล',noInsightsSub:'ตรวจเครื่องจริงก่อน Bearagnostic จะไม่สร้างคะแนนหรือข้อมูลปลอม',moreKicker:'เพิ่มเติม',privacyLocal:'ความเป็นส่วนตัวและข้อมูลในเครื่อง',privacyLocalSub:'ข้อมูลอะไรอยู่บนเครื่องของคุณ',aboutBearagnostic:'เกี่ยวกับ Bearagnostic',
      preferencesKicker:'การตั้งค่า',preferencesSub:'ภาษา การเคลื่อนไหว และการแสดงผลบน Android',language:'ภาษา',languageSub:'เลือกภาษาของแอป',motion:'การเคลื่อนไหว',motionSub:'เลือกระดับการเคลื่อนไหวของ UI',motionSystem:'ตามระบบ',motionFull:'เต็มรูปแบบ',motionReduced:'ลดการเคลื่อนไหว',fullScreen:'เต็มหน้าจอ',fullScreenSub:'Android Immersive Mode เปิดใช้งานตลอด',on:'เปิด',navHome:'หน้าหลัก',navCheckup:'ตรวจเครื่อง',navTools:'เครื่องมือ',navInsights:'ข้อมูล',navMore:'เพิ่มเติม',
      scanDepth:'ระดับการสแกน',chooseMode:'เลือกความละเอียดในการสแกน',recommended:'แนะนำ',smartDesc:'ตรวจ metadata ทั้งพื้นที่ และยืนยันไฟล์ซ้ำเฉพาะจุดสำคัญ',quickDesc:'ตรวจเร็วในตำแหน่ง shared storage ที่มีประโยชน์สูง',deepDesc:'ตรวจพื้นที่ที่เข้าถึงได้ละเอียดที่สุด พร้อมยืนยันไฟล์ซ้ำแบบตรงกันจริง',customDesc:'เลือกตำแหน่งและการยืนยันไฟล์ซ้ำเอง',customTitle:'เลือกสิ่งที่ต้องการตรวจ',photos:'รูปภาพ',videos:'วิดีโอ',documents:'เอกสาร',music:'เพลง',verifyExact:'ยืนยันไฟล์ซ้ำแบบตรงกันจริง',verifyExactDesc:'ใช้ SHA-256 แบบ streaming หลังกรองด้วยขนาดไฟล์แล้วเท่านั้น',useCustom:'ใช้ Custom Scan',
      privacyKicker:'ความเป็นส่วนตัว',privacyTitle:'ออกแบบให้ทำงานในเครื่องเป็นหลัก',privacyBody:'Bearagnostic วิเคราะห์ shared storage ที่ผู้ใช้เข้าถึงได้ภายในเครื่องนี้ สถาปัตยกรรมปัจจุบันไม่อัปโหลดไฟล์ และ build นี้ยังไม่ลบไฟล์ พื้นที่ส่วนตัวของแอปอื่นและพื้นที่ที่ต้องใช้ root ยังคงอยู่นอกขอบเขต',aboutKicker:'เกี่ยวกับแอป',aboutBody:'Bearagnostic for Android คือแอป Cleaner และ File Health ที่เน้นความเป็นส่วนตัว พัฒนาโดย Benedict Interactive',comingSoon:'เครื่องมือนี้ยังไม่ได้เชื่อมระบบ Cleaner จริง จึงจะไม่แสดงผลปลอม'
    },
    ja: {
      doctorIn:'Dr. Bear が診察します。',preferences:'設定',heroTitle:'<em>端末をすっきり。</em><br><em>毎日をもっと軽やかに。</em>',startCheckup:'チェックを開始',startCheckupBody:'Android でアクセス可能な領域を Smart Scan',
      duplicates:'重複ファイル',duplicatesSub:'完全一致を確認',largeFiles:'大きなファイル',largeFilesSub:'容量の大きい順に確認',olderFiles:'古いファイル',olderFilesSub:'更新日で確認',downloads:'ダウンロード',downloadsSub:'たまったファイルを確認',fileHealth:'ファイルヘルス',fileHealthSub:'最新のチェック結果がここに表示されます。',editorialQuote:'端末が整うと、デジタルな毎日も軽くなる。',
      scanKicker:'ファイルをチェック中',scanIdleTitle:'チェックの準備完了',scanIdleSub:'スキャン方法を選ぶか、Smart ですぐに開始できます。',scanRunningTitle:'丁寧に確認中',scanRunningSub:'端末をすっきり。毎日を軽やかに。',scanDoneTitle:'チェック完了',scanDoneSub:'アクセス可能なファイルを端末内で確認しました。',scanCancelledTitle:'チェックをキャンセルしました',scanCancelledSub:'ファイルは削除されていません。いつでも再開できます。',scanErrorTitle:'チェックを完了できませんでした',scanErrorSub:'もう一度お試しください。ストレージが変化した場合は再確認します。',recommendedBalance:'おすすめのバランス',
      stagePreparing:'準備',stagePreparingSub:'準備中',stageFiles:'ファイル情報',stageFilesSub:'情報を確認',stageDuplicates:'重複確認',stageDuplicatesSub:'一致を検証',stageDuplicatesSkipped:'Quick では省略',stageFinalizing:'仕上げ',stageFinalizingSub:'もう少し',
      ready:'準備完了',scanning:'チェック中',hashing:'検証中',complete:'完了',cancelled:'キャンセル',error:'エラー',filesReviewed:'確認済みファイル',duplicateCopies:'確認済み重複コピー',duplicatesNotChecked:'未確認',largeNoted:'大きなファイル',olderFound:'古いファイル',quoteIdle:'ファイルはあなたのもの。選ぶのもあなた。',quoteRunning:'丁寧に確認中。診断は急ぎません。',quoteDone:'完了しました。表示値はネイティブスキャンの実測です。',quoteCancelled:'安全に停止しました。ファイルは削除されていません。',quoteError:'推測はしません。完了できない場合はそのままお伝えします。',tipTitle:'ご存じですか？',tipBody:'アクセス可能なファイルはこの端末内で解析されます。',local:'ローカル',verifiedSpace:'確認済み重複容量',noDuplicateCheck:'Quick Scan では完全一致の重複を判定しません。',
      checkingAccess:'アクセスを確認中…',allowAccess:'ストレージアクセスを許可',startSmart:'Smart Scan を開始',startQuick:'Quick Scan を開始',startDeep:'Deep Scan を開始',startCustom:'Custom Scan を開始',cancelScan:'スキャンをキャンセル',runAgain:'もう一度チェック',
      toolsKicker:'ツール',toolsTitle:'目的別ファイル確認',toolsBody:'Cleaner ツールは同じネイティブスキャンエンジンを使用します。',insightsKicker:'インサイト',insightsTitle:'実データがあるときだけ表示',insightsBody:'実際のチェック履歴ができるまで、ここには何も作りません。',noInsights:'まだインサイトはありません',noInsightsSub:'まず実際のチェックを実行してください。Bearagnostic はスコアを捏造しません。',moreKicker:'その他',privacyLocal:'プライバシーと端末内データ',privacyLocalSub:'端末内に残る情報',aboutBearagnostic:'Bearagnostic について',
      preferencesKicker:'設定',preferencesSub:'言語、モーション、Android 表示',language:'言語',languageSub:'表示言語を選択',motion:'モーション',motionSub:'UI の動きを選択',motionSystem:'システム',motionFull:'フル',motionReduced:'少なめ',fullScreen:'全画面',fullScreenSub:'Android の没入モードは常に有効です',on:'オン',navHome:'ホーム',navCheckup:'チェック',navTools:'ツール',navInsights:'インサイト',navMore:'その他',
      scanDepth:'スキャンの深さ',chooseMode:'スキャン方法を選択',recommended:'おすすめ',smartDesc:'全体のメタデータ確認＋重要箇所の重複検証',quickDesc:'重要な共有領域をすばやく確認',deepDesc:'アクセス可能な領域を最も詳しく確認し、完全一致の重複を検証',customDesc:'対象と重複検証を自分で選択',customTitle:'チェック対象を選択',photos:'写真',videos:'動画',documents:'書類',music:'音楽',verifyExact:'完全一致の重複を検証',verifyExactDesc:'同じサイズで絞り込んだ後だけストリーミング SHA-256 を使用します。',useCustom:'Custom Scan を使用',
      privacyKicker:'プライバシー',privacyTitle:'ローカルファースト設計',privacyBody:'Bearagnostic はユーザーがアクセス可能な共有ストレージを端末内で解析します。現在の構成ではファイルをアップロードせず、このビルドでは削除も行いません。Android が保護する他アプリの専用領域や root 専用領域は対象外です。',aboutKicker:'情報',aboutBody:'Bearagnostic for Android は Benedict Interactive による、プライバシー重視の Cleaner / File Health アプリです。',comingSoon:'この Cleaner 画面はまだ実処理に接続されていないため、架空の結果は表示しません。'
    }
  };

  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const STORAGE = 'bearagnostic.android.';
  const BUILD_LAUNCH_KEY = `${STORAGE}launch.seen.b6`;
  const LANG_KEY = `${STORAGE}language`;
  const MOTION_KEY = `${STORAGE}motion`;
  const RING_LENGTH = 289.03;

  const launch = $('launch'), appRoot = $('appRoot');
  const studioStage = document.querySelector('[data-launch-stage="studio"]');
  const productStage = document.querySelector('[data-launch-stage="product"]');
  const modalScrim = $('modalScrim'), modeSheet = $('modeSheet'), customSheet = $('customSheet'), infoSheet = $('infoSheet'), toast = $('toast');
  const modeChip = $('modeChip'), modeChipTitle = $('modeChipTitle'), modeChipSub = $('modeChipSub'), verifyDuplicates = $('verifyDuplicates');
  const scanScreen = $('checkupScreen'), scanAction = $('scanAction'), scanActionLabel = $('scanActionLabel'), scanTitleText = $('scanTitleText'), scanSubtitle = $('scanSubtitle'), scanKicker = $('scanKicker');
  const scanRing = $('scanRing'), scanRingValue = $('scanRingValue'), scanRingValueText = $('scanRingValueText'), scanRingLabel = $('scanRingLabel'), scanRailProgress = $('scanRailProgress');
  const scanReviewed = $('scanReviewed'), scanDuplicates = $('scanDuplicates'), scanDuplicatesLabel = $('scanDuplicatesLabel'), scanLarge = $('scanLarge'), scanOlder = $('scanOlder'), scanQuote = $('scanQuote');
  const scanTipTitle = $('scanTipTitle'), scanTipBody = $('scanTipBody'), scanTipBadge = $('scanTipBadge'), duplicateStageSub = $('duplicateStageSub');
  const healthSummary = $('healthSummary'), footerBuild = $('footerBuild'), aboutBuild = $('aboutBuild');

  let language = 'en';
  let currentScreen = 'home';
  let selectedMode = 'smart';
  let nativeState = { broadStorageAccess:false, scannerReady:false, scannerRunning:false };
  let lastResult = null;
  let pendingSmartStart = false;
  let scanState = 'idle';
  let streamTimer = null;
  let launchFinished = false;

  function storageGet(key, fallback = null) { try { const v = localStorage.getItem(key); return v == null ? fallback : v; } catch (_) { return fallback; } }
  function storageSet(key, value) { try { localStorage.setItem(key, String(value)); } catch (_) {} }
  function detectLanguage() {
    const saved = storageGet(LANG_KEY); if (saved && COPY[saved]) return saved;
    const raw = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
    if (raw.startsWith('th')) return 'th'; if (raw.startsWith('ja')) return 'ja'; return 'en';
  }
  const t = (key) => COPY[language]?.[key] ?? COPY.en[key] ?? key;
  function applyLanguage(next, persist = true) {
    if (!COPY[next]) next = 'en'; language = next; document.documentElement.lang = next;
    $$('[data-i18n]').forEach((el) => { const key = el.dataset.i18n; if (COPY[next][key] != null) el.textContent = COPY[next][key]; });
    $$('[data-i18n-html]').forEach((el) => { const key = el.dataset.i18nHtml; if (COPY[next][key] != null) el.innerHTML = COPY[next][key]; });
    $$('[data-i18n-aria]').forEach((el) => { const key = el.dataset.i18nAria; if (COPY[next][key] != null) el.setAttribute('aria-label', COPY[next][key]); });
    $$('[data-language-group] [data-lang]').forEach((button) => button.classList.toggle('is-active', button.dataset.lang === next));
    if (persist) storageSet(LANG_KEY, next);
    renderModeChip(); renderScanCopy(); renderScanAction(); renderResultTip();
  }
  function formatNumber(value) { return new Intl.NumberFormat(language === 'th' ? 'th-TH' : language === 'ja' ? 'ja-JP' : 'en-US').format(Number(value || 0)); }
  function formatBytes(value) { let bytes = Number(value || 0); if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'; const units=['B','KB','MB','GB','TB']; let u=0; while(bytes>=1024&&u<units.length-1){bytes/=1024;u++;} return `${bytes.toFixed(u>=3?2:u>=2?1:0)} ${units[u]}`; }
  function showToast(message) { if (!toast) return; toast.textContent = message; toast.hidden = false; requestAnimationFrame(() => toast.classList.add('is-visible')); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => { toast.classList.remove('is-visible'); setTimeout(() => { toast.hidden = true; }, 180); }, 2400); }

  function wait(ms){return new Promise((resolve)=>setTimeout(resolve,ms));}
  async function runOpening() {
    let done = false;
    const first = storageGet(BUILD_LAUNCH_KEY) !== '1';
    const timings = first ? { studio:3000, product:3000, fade:360 } : { studio:1800, product:1800, fade:240 };
    const finish = () => {
      if (done) return; done = true; launchFinished = true;
      if (appRoot) appRoot.hidden = false; launch?.classList.add('is-leaving');
      setTimeout(() => { if (launch) launch.hidden = true; storageSet(BUILD_LAUNCH_KEY,'1'); readNativeState(); }, timings.fade);
    };
    const fail = setTimeout(finish, first ? 7600 : 5000);
    try {
      if (appRoot) appRoot.hidden = true; if (launch) launch.hidden = false;
      studioStage?.classList.add('is-active'); productStage?.classList.remove('is-active');
      await wait(timings.studio); studioStage?.classList.remove('is-active'); productStage?.classList.add('is-active');
      await wait(timings.product); clearTimeout(fail); finish();
    } catch (_) { clearTimeout(fail); finish(); }
  }

  function switchScreen(name) {
    const target = document.querySelector(`[data-screen="${name}"]`); if (!target) return;
    $$('.screen').forEach((screen) => { const active = screen === target; screen.hidden = !active; screen.classList.toggle('is-active', active); });
    currentScreen = name;
    appRoot.classList.toggle('is-checkup', name === 'checkup');
    $$('.nav-button[data-nav]').forEach((button) => { const active = button.dataset.nav === name; button.classList.toggle('is-active', active); active ? button.setAttribute('aria-current','page') : button.removeAttribute('aria-current'); });
    if (name === 'checkup') renderScanAction();
  }

  function openSheet(sheet) { [modeSheet,customSheet,infoSheet].forEach((s)=>{if(s)s.hidden=true;}); if (modalScrim) modalScrim.hidden=false; sheet.hidden=false; }
  function closeSheets() { [modeSheet,customSheet,infoSheet].forEach((s)=>{if(s)s.hidden=true;}); if (modalScrim) modalScrim.hidden=true; }
  function openInfo(kind) {
    if (kind === 'privacy') { $('infoKicker').textContent=t('privacyKicker'); $('infoTitle').textContent=t('privacyTitle'); $('infoContent').innerHTML=`<p>${escapeHtml(t('privacyBody'))}</p>`; }
    else { $('infoKicker').textContent=t('aboutKicker'); $('infoTitle').textContent='Bearagnostic'; $('infoContent').innerHTML=`<div class="info-hero"><img src="../media/bearagnostic-master-logo.webp" alt=""><div><strong>Bearagnostic</strong><span>${escapeHtml(nativeState.versionName || '0.6.0-alpha06-debug')} · Benedict Interactive</span></div></div><p>${escapeHtml(t('aboutBody'))}</p>`; }
    openSheet(infoSheet);
  }
  function escapeHtml(v){return String(v).replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  const MODE_LABELS = { smart:'Smart', quick:'Quick', deep:'Deep', custom:'Custom' };
  function renderModeChip() {
    modeChipTitle.textContent = `${MODE_LABELS[selectedMode]} Scan`;
    const subKey = selectedMode === 'smart' ? 'recommendedBalance' : selectedMode === 'quick' ? 'quickDesc' : selectedMode === 'deep' ? 'deepDesc' : 'customDesc';
    modeChipSub.textContent = t(subKey);
    $$('.mode-option').forEach((button)=>button.classList.toggle('is-selected',button.dataset.mode===selectedMode));
    if (scanState === 'idle') scanRingValueText.textContent = MODE_LABELS[selectedMode].toUpperCase();
    duplicateStageSub.textContent = selectedMode === 'quick' ? t('stageDuplicatesSkipped') : t('stageDuplicatesSub');
  }
  function customScopes(){ return $$('.scope-grid input[type="checkbox"]:checked').map((input)=>input.value); }

  function setScanState(next) { scanState = next; scanScreen.dataset.state = next; nativeState.scannerRunning = next === 'running'; renderScanCopy(); renderScanAction(); }
  function renderScanCopy() {
    if (!scanTitleText) return;
    if (scanState === 'running') { scanKicker.textContent=t('scanKicker'); scanTitleText.textContent=t('scanRunningTitle'); scanSubtitle.textContent=t('scanRunningSub'); scanQuote.textContent=t('quoteRunning'); }
    else if (scanState === 'complete') { scanKicker.textContent=t('scanKicker'); scanTitleText.textContent=t('scanDoneTitle'); scanSubtitle.textContent=t('scanDoneSub'); scanQuote.textContent=t('quoteDone'); }
    else if (scanState === 'cancelled') { scanKicker.textContent=t('scanKicker'); scanTitleText.textContent=t('scanCancelledTitle'); scanSubtitle.textContent=t('scanCancelledSub'); scanQuote.textContent=t('quoteCancelled'); }
    else if (scanState === 'error') { scanKicker.textContent=t('scanKicker'); scanTitleText.textContent=t('scanErrorTitle'); scanSubtitle.textContent=t('scanErrorSub'); scanQuote.textContent=t('quoteError'); }
    else { scanKicker.textContent=t('scanKicker'); scanTitleText.textContent=t('scanIdleTitle'); scanSubtitle.textContent=t('scanIdleSub'); scanQuote.textContent=t('quoteIdle'); }
  }
  function renderScanAction() {
    if (!scanActionLabel) return;
    if (scanState === 'running') { scanActionLabel.textContent=t('cancelScan'); scanAction.disabled=false; return; }
    if (!nativeState.broadStorageAccess) { scanActionLabel.textContent=t('allowAccess'); scanAction.disabled=false; return; }
    if (scanState === 'complete' || scanState === 'cancelled' || scanState === 'error') { scanActionLabel.textContent=t('runAgain'); scanAction.disabled=false; return; }
    scanActionLabel.textContent=t(`start${selectedMode[0].toUpperCase()}${selectedMode.slice(1)}`); scanAction.disabled=false;
  }
  function renderResultTip() {
    if (lastResult && scanState === 'complete') {
      if (lastResult.duplicateVerificationPerformed) { scanTipTitle.textContent=t('verifiedSpace'); scanTipBody.textContent=`${formatBytes(lastResult.duplicateReclaimableBytes)} · ${formatNumber(lastResult.duplicateCopies)} ${t('duplicateCopies')}`; scanTipBadge.textContent='SHA-256'; }
      else { scanTipTitle.textContent='Quick Scan'; scanTipBody.textContent=t('noDuplicateCheck'); scanTipBadge.textContent=t('local'); }
    } else { scanTipTitle.textContent=t('tipTitle'); scanTipBody.textContent=t('tipBody'); scanTipBadge.textContent=t('local'); }
  }

  function resetProgressUI() {
    scanReviewed.textContent='0'; scanDuplicates.textContent='—'; scanLarge.textContent='0'; scanOlder.textContent='0';
    scanDuplicatesLabel.textContent=t('duplicateCopies'); scanRailProgress.style.width='0%';
    scanRing.classList.remove('is-indeterminate'); scanRingValue.style.strokeDashoffset=String(RING_LENGTH); scanRingValueText.textContent=MODE_LABELS[selectedMode].toUpperCase(); scanRingLabel.textContent=t('ready');
    $$('.scan-stage').forEach((stage)=>stage.classList.remove('is-done','is-active','is-skipped'));
    if (selectedMode === 'quick') document.querySelector('[data-stage="duplicates"]')?.classList.add('is-skipped');
    renderResultTip();
  }
  function setStage(phase) {
    const order=['preparing','files','duplicates','finalizing']; const index=Math.max(0,order.indexOf(phase));
    $$('.scan-stage').forEach((stage,i)=>{ stage.classList.toggle('is-done',i<index); stage.classList.toggle('is-active',i===index); if(stage.dataset.stage==='duplicates') stage.classList.toggle('is-skipped',selectedMode==='quick'); });
    scanRailProgress.style.width=`${index/(order.length-1)*100}%`;
  }
  function renderProgress(payload) {
    if (currentScreen !== 'checkup') switchScreen('checkup');
    if (scanState !== 'running') setScanState('running');
    const phase=payload.phase||'preparing'; setStage(phase);
    scanReviewed.textContent=formatNumber(payload.reviewedFiles); scanLarge.textContent=formatNumber(payload.largeFiles); scanOlder.textContent=formatNumber(payload.olderFiles);
    if (phase === 'duplicates' && Number(payload.duplicateCandidateBytes) > 0) {
      const total=Number(payload.duplicateCandidateBytes||0), done=Math.min(total,Number(payload.hashedBytes||0)), pct=total>0?Math.max(0,Math.min(100,done/total*100)):0;
      scanRing.classList.remove('is-indeterminate'); scanRingValue.style.strokeDashoffset=String(RING_LENGTH*(1-pct/100)); scanRingValueText.textContent=`${Math.round(pct)}%`; scanRingLabel.textContent=t('hashing');
      scanDuplicates.textContent=formatNumber(payload.duplicateCandidateFiles); scanDuplicatesLabel.textContent=language==='th'?'ไฟล์ที่กำลังยืนยัน':language==='ja'?'検証候補':'candidates being verified';
    } else {
      scanRing.classList.add('is-indeterminate'); scanRingValueText.textContent=MODE_LABELS[selectedMode].toUpperCase(); scanRingLabel.textContent=t('scanning');
      if (selectedMode==='quick') { scanDuplicates.textContent='—'; scanDuplicatesLabel.textContent=t('duplicatesNotChecked'); }
    }
  }
  function renderComplete(payload) {
    lastResult=payload; selectedMode=payload.scanMode||selectedMode; setScanState('complete'); stopFileStream();
    scanReviewed.textContent=formatNumber(payload.reviewedFiles); scanLarge.textContent=formatNumber(payload.largeFiles); scanOlder.textContent=formatNumber(payload.olderFiles);
    scanDuplicates.textContent=payload.duplicateVerificationPerformed?formatNumber(payload.duplicateCopies):'—'; scanDuplicatesLabel.textContent=payload.duplicateVerificationPerformed?t('duplicateCopies'):t('duplicatesNotChecked');
    scanRing.classList.remove('is-indeterminate'); scanRingValue.style.strokeDashoffset='0'; scanRingValueText.textContent='✓'; scanRingLabel.textContent=t('complete'); scanRailProgress.style.width='100%';
    $$('.scan-stage').forEach((stage)=>{ stage.classList.remove('is-active'); stage.classList.add('is-done'); if(stage.dataset.stage==='duplicates' && !payload.duplicateVerificationPerformed){stage.classList.remove('is-done');stage.classList.add('is-skipped');} });
    healthSummary.textContent=`${formatNumber(payload.reviewedFiles)} ${t('filesReviewed')} · ${formatBytes(payload.duplicateReclaimableBytes)} ${t('verifiedSpace').toLowerCase()}`;
    renderModeChip(); renderResultTip();
  }
  function renderTerminal(kind) {
    stopFileStream(); setScanState(kind); scanRing.classList.remove('is-indeterminate'); scanRingValue.style.strokeDashoffset=String(RING_LENGTH); scanRingValueText.textContent=kind==='cancelled'?'×':'!'; scanRingLabel.textContent=t(kind==='cancelled'?'cancelled':'error'); renderResultTip();
  }

  function startFileStream(){ stopFileStream(); if(document.documentElement.dataset.motion==='reduced')return; const stream=$('scanFileStream'); const spawn=()=>{if(scanState!=='running')return; const tile=document.createElement('span'); tile.className=`scan-file-tile${Math.random()>.76?' folder':''}`; tile.style.setProperty('--lane',String(Math.floor(Math.random()*3))); stream.appendChild(tile); setTimeout(()=>tile.remove(),1900);}; spawn(); streamTimer=setInterval(spawn,460); }
  function stopFileStream(){ if(streamTimer){clearInterval(streamTimer);streamTimer=null;} $('scanFileStream')?.replaceChildren(); }

  function parseNative(raw){ if(!raw)return null;if(typeof raw==='object')return raw;try{return JSON.parse(raw);}catch(_){return null;} }
  function readNativeState(){ try{const parsed=parseNative(window.BearagnosticNative?.getNativeState?.());if(parsed)applyNativeState(parsed);}catch(_){applyNativeState({broadStorageAccess:false,scannerReady:false,scannerRunning:false});} }
  function applyNativeState(state){ nativeState={...nativeState,...(state||{})}; if(nativeState.versionName){footerBuild.textContent=`${nativeState.versionName}`;aboutBuild.textContent=`Benedict Interactive · ${nativeState.versionName}`;} if(nativeState.scannerRunning && scanState!=='running')setScanState('running'); else if(!nativeState.scannerRunning && scanState==='running'&&!lastResult)renderScanAction(); if(pendingSmartStart&&nativeState.broadStorageAccess&&!nativeState.scannerRunning){pendingSmartStart=false;setTimeout(()=>startNativeScan('smart'),120);} else renderScanAction(); }

  function startNativeScan(mode=selectedMode){
    selectedMode=mode; renderModeChip(); lastResult=null; resetProgressUI();
    if(!nativeState.broadStorageAccess){pendingSmartStart=mode==='smart'; try{window.BearagnosticNative?.requestBroadStorageAccess?.();}catch(_){} renderScanAction(); return;}
    const scopes=selectedMode==='custom'?customScopes():[]; const verify=selectedMode==='quick'?false:(selectedMode==='custom'?Boolean(verifyDuplicates.checked):true);
    let response=null; try{response=parseNative(window.BearagnosticNative?.startScan?.(selectedMode,JSON.stringify(scopes),verify));}catch(_){}
    if(response?.accepted){setScanState('running');startFileStream();renderProgress({phase:'preparing',reviewedFiles:0,largeFiles:0,olderFiles:0,duplicateCandidateFiles:0,duplicateCandidateBytes:0,hashedBytes:0});}
    else if(response?.reason==='storage_access_required'){nativeState.broadStorageAccess=false;pendingSmartStart=selectedMode==='smart';renderScanAction();try{window.BearagnosticNative?.requestBroadStorageAccess?.();}catch(_){} }
    else if(response?.reason==='scan_already_running'){setScanState('running');}
    else {setScanState('error');}
  }
  function cancelScan(){ try{window.BearagnosticNative?.cancelOneTapScan?.();}catch(_){} scanAction.disabled=true; }

  window.BearagnosticAndroid = Object.freeze({
    onNativeStateChanged(state){const parsed=parseNative(state);if(parsed)applyNativeState(parsed);},
    onScanProgress(payload){const parsed=parseNative(payload);if(parsed)renderProgress(parsed);},
    onScanComplete(payload){const parsed=parseNative(payload);if(parsed)renderComplete(parsed);},
    onScanCancelled(){renderTerminal('cancelled');},
    onScanError(){renderTerminal('error');}
  });

  function bindEvents(){
    $('homeBrandButton').addEventListener('click',()=>switchScreen('home'));
    $('settingsButton').addEventListener('click',()=>switchScreen('preferences'));
    $('preferencesBack').addEventListener('click',()=>switchScreen('home'));
    $$('.nav-button[data-nav]').forEach((button)=>button.addEventListener('click',()=>switchScreen(button.dataset.nav)));
    $('startCheckup').addEventListener('click',()=>{selectedMode='smart';pendingSmartStart=true;switchScreen('checkup');resetProgressUI();renderModeChip();if(nativeState.broadStorageAccess){pendingSmartStart=false;setTimeout(()=>startNativeScan('smart'),120);}else{try{window.BearagnosticNative?.requestBroadStorageAccess?.();}catch(_){}}});
    $('healthCard').addEventListener('click',()=>switchScreen('checkup'));
    scanAction.addEventListener('click',()=>{if(scanState==='running'){cancelScan();return;}if(!nativeState.broadStorageAccess){try{window.BearagnosticNative?.requestBroadStorageAccess?.();}catch(_){}return;}startNativeScan(selectedMode);});
    modeChip.addEventListener('click',()=>{if(scanState!=='running')openSheet(modeSheet);});
    $('modeClose').addEventListener('click',closeSheets);$('customClose').addEventListener('click',closeSheets);$('infoClose').addEventListener('click',closeSheets);modalScrim.addEventListener('click',closeSheets);
    $$('.mode-option').forEach((button)=>button.addEventListener('click',()=>{const mode=button.dataset.mode;if(mode==='custom'){selectedMode='custom';renderModeChip();openSheet(customSheet);}else{selectedMode=mode;renderModeChip();resetProgressUI();closeSheets();}}));
    $('customSave').addEventListener('click',()=>{if(customScopes().length===0){showToast(language==='th'?'เลือกอย่างน้อย 1 ตำแหน่ง':language==='ja'?'1つ以上選択してください':'Choose at least one location');return;}selectedMode='custom';renderModeChip();resetProgressUI();closeSheets();});
    $('privacyRow').addEventListener('click',()=>openInfo('privacy'));$('aboutRow').addEventListener('click',()=>openInfo('about'));
    $$('.tool-card,.utility-list button[data-tool]').forEach((button)=>button.addEventListener('click',()=>showToast(t('comingSoon'))));
    $$('[data-language-group] [data-lang]').forEach((button)=>button.addEventListener('click',()=>applyLanguage(button.dataset.lang,true)));
    $('motionSelect').addEventListener('change',(event)=>{const mode=event.target.value;document.documentElement.dataset.motion=mode;storageSet(MOTION_KEY,mode);});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden&&launchFinished)readNativeState();});
  }

  function boot(){
    language=detectLanguage();applyLanguage(language,false);const motion=storageGet(MOTION_KEY,'system');document.documentElement.dataset.motion=motion;$('motionSelect').value=motion;bindEvents();renderModeChip();resetProgressUI();switchScreen('home');runOpening();
  }
  boot();
})();
