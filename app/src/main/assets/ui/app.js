(() => {
  'use strict';

  const BUILD = 11;
  const STORAGE = 'bearagnostic.';
  const FIRST_LAUNCH_KEY = `${STORAGE}launch.seen.b${BUILD}`;
  const LANG_KEY = `${STORAGE}language`;
  const MOTION_KEY = `${STORAGE}motion`;
  const RING_LENGTH = 289.03;
  const PHASES = ['preparing','file_details','file_sizes','duplicates','modified_dates','finalizing'];
  const TILE_KINDS = ['doc','image','video','audio','folder'];

  const COPY = {
    en: {
      doctorIn:'Dr. Bear is in.', brandFileHealth:'FILE HEALTH', brandBrighterDays:'BRIGHTER DAYS',
      heroTitle:'<em>A cleaner device</em><br><em>for a smoother you.</em>', startCheckup:'Start Checkup', startCheckupBody:'Choose how deeply Bearagnostic should check.',
      cleanup:'Cleanup', cleanupSub:'Review candidates', duplicates:'Duplicates', duplicatesSub:'Find repeats', largeFiles:'Large Files', largeFilesSub:'Biggest files', olderFiles:'Older Files', olderFilesSub:'Older edits', fileHealth:'File Health', fileHealthSub:'Your checkup summary will appear here.', editorialQuote:'A cleaner device leads to a calmer mind.',
      navHome:'Home', navCheckup:'Checkup', navTools:'Tools', navInsights:'Insights', navMore:'More', preferences:'Preferences', preferencesKicker:'PREFERENCES', preferencesSub:'Language and motion', language:'Language', languageSub:'Choose the interface language', motion:'Motion', motionSub:'Choose how much interface motion you want',
      scanKicker:'SCANNING YOUR FILES', scanIdleTitle:'Ready for a checkup', scanIdleSub:'Choose a scan mode. Every stage reflects real native work.', scanRunningTitle:'Checking things out', scanRunningSub:'A cleaner device leads to brighter days.', scanDoneTitle:'Checkup complete', scanDoneSub:'The accessible scope for this scan has been reviewed.',
      stagePreparing:'Preparing', stagePreparingSub:'Getting ready', stageDetails:'File Details', stageDetailsSub:'Reading info', stageSizes:'File Sizes', stageSizesSub:'Analyzing', stageDuplicates:'Duplicates', stageDuplicatesSub:'Finding matches', stageDates:'Modified Dates', stageDatesSub:'Checking dates', stageFinalizing:'Finalizing', stageFinalizingSub:'Almost there',
      filesReviewed:'files reviewed', duplicateCandidates:'verified duplicate copies', largeNoted:'large files noted', olderFound:'older files found', ready:'READY', scanning:'SCANNING', complete:'COMPLETE', quoteIdle:'Your files. Your choice.', quoteRunning:'Looking carefully. Bears don’t rush diagnostics.', quoteDone:'All done. Only accessible shared storage was checked.', tipTitle:'Did you know?', tipBody:'Bearagnostic analyzes accessible files locally on this device.', chooseMode:'Choose scan mode', cancelScan:'Cancel scan', runAgain:'Run another checkup',
      toolsKicker:'TOOLS', toolsTitle:'Focused file review', toolsBody:'Each tool uses the same truthful native evidence.', insightsKicker:'INSIGHTS', insightsTitle:'Useful patterns, once they exist', insightsBody:'Insights stay empty until real checkups create honest local history.', noInsights:'No insights yet', noInsightsSub:'Run a real checkup first. Bearagnostic will never invent a score.', moreKicker:'MORE', privacyBody:'Local-first file health by Benedict Interactive.', privacyLocal:'Privacy & local data', privacyLocalSub:'What stays on your device',
      scanDepth:'SCAN DEPTH', chooseHow:'Choose how deeply to scan', modeLead:'Automatic scope and scan depth are separate. Choose the amount of real work you want Bearagnostic to perform.', smart:'Smart Scan', smartDesc:'All accessible shared storage, real metadata, content sampling, and focused verified duplicates.', recommended:'Recommended', quick:'Quick Scan', quickDesc:'Priority folders and metadata rules only. Fast by design.', deep:'Deep Scan', deepDesc:'All accessible shared storage with a full streaming content read plus exact duplicate verification.', custom:'Custom Scan', customDesc:'Choose locations and whether exact duplicate verification runs.', customTitle:'Choose what to scan', downloads:'Downloads', photos:'Photos', videos:'Videos', documents:'Documents', music:'Music', verifyDuplicates:'Verify exact duplicates', verifyDuplicatesSub:'Uses streaming SHA-256 after exact-size filtering.', startCustom:'Start Custom Scan',
      storageAccess:'STORAGE ACCESS', permissionTitle:'Allow Bearagnostic to inspect shared storage', permissionBody:'Android controls this permission. Bearagnostic still cannot enter protected app-private storage.', openSettings:'Open Android settings', permissionNeeded:'Storage access is required before this scan can start.', scanBusy:'A scan is already running.', scanFailed:'Bearagnostic could not finish this checkup.', scanCancelled:'Checkup cancelled.', toolLater:'This tool will use the scan results in a later cleanup batch.'
    },
    ja: {
      doctorIn:'Dr. Bear が診察します。', brandFileHealth:'ファイルヘルス', brandBrighterDays:'より軽やかな毎日', heroTitle:'<em>端末をすっきり。</em><br><em>毎日をもっと軽やかに。</em>', startCheckup:'チェックを開始', startCheckupBody:'どこまで詳しく調べるか選べます。',
      cleanup:'クリーンアップ', cleanupSub:'候補を確認', duplicates:'重複ファイル', duplicatesSub:'同一ファイルを確認', largeFiles:'大きいファイル', largeFilesSub:'容量の大きい順', olderFiles:'古いファイル', olderFilesSub:'更新日が古いもの', fileHealth:'ファイルヘルス', fileHealthSub:'チェック結果がここに表示されます。', editorialQuote:'端末が整うと、気持ちも少し軽くなる。',
      navHome:'ホーム', navCheckup:'チェック', navTools:'ツール', navInsights:'インサイト', navMore:'その他', preferences:'設定', preferencesKicker:'設定', preferencesSub:'言語とモーション', language:'言語', languageSub:'表示言語を選択', motion:'モーション', motionSub:'画面の動き方を選択',
      scanKicker:'ファイルをチェック中', scanIdleTitle:'チェックの準備ができました', scanIdleSub:'スキャン方法を選んでください。表示される工程は実際の処理だけです。', scanRunningTitle:'丁寧に確認中', scanRunningSub:'端末をすっきり。毎日を軽やかに。', scanDoneTitle:'チェック完了', scanDoneSub:'このスキャンでアクセスできる範囲を確認しました。',
      stagePreparing:'準備', stagePreparingSub:'準備中', stageDetails:'ファイル情報', stageDetailsSub:'情報を確認', stageSizes:'ファイル容量', stageSizesSub:'容量を解析', stageDuplicates:'重複ファイル', stageDuplicatesSub:'一致を確認', stageDates:'更新日時', stageDatesSub:'日付を確認', stageFinalizing:'仕上げ', stageFinalizingSub:'もう少し',
      filesReviewed:'確認済みファイル', duplicateCandidates:'確認済み重複コピー', largeNoted:'大容量ファイル', olderFound:'古いファイル', ready:'準備完了', scanning:'チェック中', complete:'完了', quoteIdle:'選ぶのは、あなた。', quoteRunning:'丁寧に確認中。診断は急ぎません。', quoteDone:'完了しました。アクセス可能な共有ストレージだけを確認しました。', tipTitle:'ご存じですか？', tipBody:'Bearagnostic はアクセス可能なファイルを端末内で解析します。', chooseMode:'スキャン方法を選ぶ', cancelScan:'スキャンを中止', runAgain:'もう一度チェック',
      toolsKicker:'ツール', toolsTitle:'目的別ファイル確認', toolsBody:'各ツールは同じ実データを使います。', insightsKicker:'インサイト', insightsTitle:'実データができてから表示', insightsBody:'実際のチェック履歴ができるまで、推測の情報は表示しません。', noInsights:'まだインサイトはありません', noInsightsSub:'まず実際のチェックを実行してください。架空のスコアは表示しません。', moreKicker:'その他', privacyBody:'Benedict Interactive によるローカル優先のファイルヘルス。', privacyLocal:'プライバシーとローカルデータ', privacyLocalSub:'端末内に残る情報',
      scanDepth:'スキャンの深さ', chooseHow:'どこまで詳しく調べますか？', modeLead:'スキャン範囲と深さは別です。Bearagnostic に実行させる処理量を選んでください。', smart:'スマートスキャン', smartDesc:'アクセス可能な共有ストレージ全体を確認し、内容を一部読み取り、重要な場所の重複を検証します。', recommended:'おすすめ', quick:'クイックスキャン', quickDesc:'主要フォルダとメタデータ規則だけを確認。速度優先です。', deep:'ディープスキャン', deepDesc:'アクセス可能な共有ストレージ全体をストリームで最後まで読み、重複も正確に検証します。', custom:'カスタムスキャン', customDesc:'確認する場所と重複検証の有無を選べます。', customTitle:'確認する場所を選ぶ', downloads:'ダウンロード', photos:'写真', videos:'動画', documents:'書類', music:'音楽', verifyDuplicates:'完全一致の重複を検証', verifyDuplicatesSub:'同じサイズの候補だけを SHA-256 で確認します。', startCustom:'カスタムスキャンを開始',
      storageAccess:'ストレージアクセス', permissionTitle:'共有ストレージへのアクセスを許可してください', permissionBody:'権限は Android が管理します。保護された他アプリの内部領域にはアクセスできません。', openSettings:'Android の設定を開く', permissionNeeded:'スキャンを始めるにはストレージアクセスが必要です。', scanBusy:'すでにスキャン中です。', scanFailed:'チェックを完了できませんでした。', scanCancelled:'チェックを中止しました。', toolLater:'このツールは今後のクリーンアップ機能でスキャン結果を利用します。'
    },
    th: {
      doctorIn:'คุณหมอแบร์พร้อมแล้ว', brandFileHealth:'สุขภาพไฟล์', brandBrighterDays:'วันที่ลื่นไหลกว่าเดิม', heroTitle:'<em>เครื่องสะอาดขึ้น</em><br><em>ทุกอย่างก็ลื่นขึ้น</em>', startCheckup:'เริ่มตรวจเครื่อง', startCheckupBody:'เลือกได้ว่าจะให้ Bearagnostic ตรวจละเอียดแค่ไหน',
      cleanup:'ทำความสะอาด', cleanupSub:'ตรวจรายการก่อนลบ', duplicates:'ไฟล์ซ้ำ', duplicatesSub:'หาไฟล์ที่เหมือนกัน', largeFiles:'ไฟล์ขนาดใหญ่', largeFilesSub:'ดูไฟล์ที่กินพื้นที่', olderFiles:'ไฟล์เก่า', olderFilesSub:'ดูไฟล์ที่ไม่ได้แก้นาน', fileHealth:'สุขภาพไฟล์', fileHealthSub:'ผลการตรวจจะปรากฏตรงนี้', editorialQuote:'เครื่องที่เป็นระเบียบขึ้น ใจก็เบาลงได้เหมือนกัน',
      navHome:'หน้าหลัก', navCheckup:'ตรวจเครื่อง', navTools:'เครื่องมือ', navInsights:'ข้อมูลเชิงลึก', navMore:'เพิ่มเติม', preferences:'การตั้งค่า', preferencesKicker:'การตั้งค่า', preferencesSub:'ภาษาและการเคลื่อนไหว', language:'ภาษา', languageSub:'เลือกภาษาของแอพ', motion:'การเคลื่อนไหว', motionSub:'เลือกระดับแอนิเมชันของหน้าจอ',
      scanKicker:'กำลังตรวจไฟล์ของคุณ', scanIdleTitle:'พร้อมตรวจเครื่องแล้ว', scanIdleSub:'เลือกโหมดสแกน ทุกขั้นที่แสดงคือการทำงานจริงของตัวสแกน', scanRunningTitle:'กำลังตรวจอย่างละเอียด', scanRunningSub:'เครื่องที่เป็นระเบียบขึ้น ก็ทำให้ทุกอย่างลื่นขึ้น', scanDoneTitle:'ตรวจเครื่องเรียบร้อย', scanDoneSub:'ตรวจพื้นที่จัดเก็บที่ Android อนุญาตสำหรับรอบนี้แล้ว',
      stagePreparing:'เตรียมการ', stagePreparingSub:'กำลังเตรียม', stageDetails:'รายละเอียดไฟล์', stageDetailsSub:'อ่านข้อมูล', stageSizes:'ขนาดไฟล์', stageSizesSub:'กำลังวิเคราะห์', stageDuplicates:'ไฟล์ซ้ำ', stageDuplicatesSub:'ตรวจความเหมือน', stageDates:'วันที่แก้ไข', stageDatesSub:'ตรวจวันที่', stageFinalizing:'สรุปผล', stageFinalizingSub:'ใกล้เสร็จแล้ว',
      filesReviewed:'ไฟล์ที่ตรวจแล้ว', duplicateCandidates:'สำเนาซ้ำที่ยืนยันแล้ว', largeNoted:'ไฟล์ขนาดใหญ่', olderFound:'ไฟล์เก่าที่พบ', ready:'พร้อม', scanning:'กำลังตรวจ', complete:'เสร็จแล้ว', quoteIdle:'ไฟล์ของคุณ คุณเป็นคนเลือก', quoteRunning:'กำลังดูให้ละเอียด การตรวจที่ดีไม่ต้องรีบ', quoteDone:'เรียบร้อย ตรวจเฉพาะพื้นที่จัดเก็บร่วมที่ Android อนุญาตเท่านั้น', tipTitle:'รู้หรือไม่?', tipBody:'Bearagnostic วิเคราะห์ไฟล์ที่เข้าถึงได้ภายในเครื่อง ไม่อัปโหลดไฟล์ออกไป', chooseMode:'เลือกโหมดสแกน', cancelScan:'ยกเลิกการสแกน', runAgain:'ตรวจอีกครั้ง',
      toolsKicker:'เครื่องมือ', toolsTitle:'ตรวจไฟล์แบบเจาะจง', toolsBody:'ทุกเครื่องมือใช้ข้อมูลจริงจากตัวสแกนชุดเดียวกัน', insightsKicker:'ข้อมูลเชิงลึก', insightsTitle:'แสดงเมื่อมีข้อมูลจริง', insightsBody:'หน้านี้จะไม่สร้างคะแนนหรือสถิติขึ้นมาเองก่อนมีผลสแกนจริง', noInsights:'ยังไม่มีข้อมูลเชิงลึก', noInsightsSub:'ลองตรวจเครื่องก่อน Bearagnostic จะไม่สร้างคะแนนปลอมขึ้นมา', moreKicker:'เพิ่มเติม', privacyBody:'ระบบดูแลสุขภาพไฟล์แบบ Local-first โดย Benedict Interactive', privacyLocal:'ความเป็นส่วนตัวและข้อมูลในเครื่อง', privacyLocalSub:'ดูว่าข้อมูลใดเก็บอยู่บนเครื่อง',
      scanDepth:'ระดับการสแกน', chooseHow:'ต้องการตรวจละเอียดแค่ไหน?', modeLead:'ขอบเขตที่ตรวจและระดับความลึกเป็นคนละเรื่อง เลือกปริมาณการตรวจจริงที่ต้องการให้ Bearagnostic ทำ', smart:'Smart Scan', smartDesc:'ตรวจพื้นที่จัดเก็บร่วมทั้งหมดที่เข้าถึงได้ อ่านข้อมูลจริงบางส่วน และยืนยันไฟล์ซ้ำในตำแหน่งสำคัญ', recommended:'แนะนำ', quick:'Quick Scan', quickDesc:'ตรวจโฟลเดอร์สำคัญและข้อมูลเมตา เน้นความรวดเร็วโดยตั้งใจ', deep:'Deep Scan', deepDesc:'ตรวจพื้นที่จัดเก็บร่วมทั้งหมดที่เข้าถึงได้ พร้อมอ่านเนื้อหาไฟล์จริงแบบสตรีมจนจบและยืนยันไฟล์ซ้ำแบบเต็ม', custom:'Custom Scan', customDesc:'เลือกตำแหน่งที่ต้องการตรวจและเลือกได้ว่าจะยืนยันไฟล์ซ้ำหรือไม่', customTitle:'เลือกสิ่งที่ต้องการตรวจ', downloads:'ดาวน์โหลด', photos:'รูปภาพ', videos:'วิดีโอ', documents:'เอกสาร', music:'เพลง', verifyDuplicates:'ยืนยันไฟล์ซ้ำแบบตรงกันทุกไบต์', verifyDuplicatesSub:'ใช้ SHA-256 หลังคัดกรองจากขนาดไฟล์ที่เท่ากันแล้ว', startCustom:'เริ่ม Custom Scan',
      storageAccess:'สิทธิ์เข้าถึงพื้นที่จัดเก็บ', permissionTitle:'อนุญาตให้ Bearagnostic ตรวจพื้นที่จัดเก็บร่วม', permissionBody:'Android เป็นผู้ควบคุมสิทธิ์นี้ Bearagnostic ยังไม่สามารถเข้าไปในพื้นที่ส่วนตัวที่ระบบป้องกันของแอพอื่นได้', openSettings:'เปิดการตั้งค่า Android', permissionNeeded:'ต้องอนุญาตสิทธิ์พื้นที่จัดเก็บก่อนจึงจะเริ่มสแกนได้', scanBusy:'มีการสแกนทำงานอยู่แล้ว', scanFailed:'Bearagnostic ไม่สามารถตรวจรอบนี้จนจบได้', scanCancelled:'ยกเลิกการตรวจแล้ว', toolLater:'เครื่องมือนี้จะใช้ผลสแกนในชุดฟังก์ชันทำความสะอาดถัดไป'
    }
  };

  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const appRoot = $('appRoot');
  const launch = $('launch');
  const studioStage = document.querySelector('[data-launch-stage="studio"]');
  const productStage = document.querySelector('[data-launch-stage="product"]');
  const modeSheet = $('modeSheet');
  const customSheet = $('customSheet');
  const permissionSheet = $('permissionSheet');
  const modalScrim = $('modalScrim');
  const checkupScreen = $('checkupScreen');
  const stream = $('scanFileStream');

  let lang = localStorage.getItem(LANG_KEY) || detectLanguage();
  let nativeState = null;
  let scanRunning = false;
  let scanState = 'idle';
  let streamTimer = null;
  let tileIndex = 0;
  let currentScreen = 'home';
  let returnFromPreferences = 'home';
  let currentMode = 'smart';
  let toastTimer = null;

  function detectLanguage(){
    const value=(navigator.language||'en').toLowerCase();
    return value.startsWith('th')?'th':value.startsWith('ja')?'ja':'en';
  }
  function t(key){ return COPY[lang]?.[key] ?? COPY.en[key] ?? key; }
  function applyLanguage(next=lang){
    if(!COPY[next]) next='en'; lang=next; localStorage.setItem(LANG_KEY,lang);
    document.documentElement.lang=lang;
    $$('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(COPY[lang]?.[k]!=null)el.textContent=COPY[lang][k];});
    $$('[data-i18n-html]').forEach(el=>{const k=el.dataset.i18nHtml;if(COPY[lang]?.[k]!=null)el.innerHTML=COPY[lang][k];});
    $$('[data-language-group] [data-lang]').forEach(b=>b.classList.toggle('is-active',b.dataset.lang===lang));
  }
  function showToast(message){
    const el=$('toast'); if(!el)return; clearTimeout(toastTimer); el.textContent=message; el.hidden=false;
    toastTimer=setTimeout(()=>{el.hidden=true;},2600);
  }
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}
  async function runOpening(){
    let done=false;
    const first=localStorage.getItem(FIRST_LAUNCH_KEY)!=='1';
    const timing=first?{studio:3000,product:3000,fade:360}:{studio:1800,product:1800,fade:240};
    const finish=()=>{
      if(done)return;done=true;
      appRoot.hidden=false;launch.classList.add('is-leaving');
      setTimeout(()=>{launch.hidden=true;localStorage.setItem(FIRST_LAUNCH_KEY,'1');},timing.fade);
    };
    studioStage.classList.add('is-active');productStage.classList.remove('is-active');
    await wait(timing.studio);studioStage.classList.remove('is-active');productStage.classList.add('is-active');
    await wait(timing.product);finish();
  }

  function switchScreen(name){
    const target=document.querySelector(`[data-screen="${name}"]`); if(!target)return;
    $$('.screen').forEach(screen=>{const on=screen===target;screen.hidden=!on;screen.classList.toggle('is-active',on);});
    currentScreen=name;
    const navName=['home','checkup','tools','insights','more'].includes(name)?name:(name==='preferences'?null:'home');
    if(navName){$$('.nav-button[data-nav]').forEach(b=>b.classList.toggle('is-active',b.dataset.nav===navName));}
    appRoot.classList.toggle('is-checkup',name==='checkup');
  }
  function openSheet(sheet){
    [modeSheet,customSheet,permissionSheet].forEach(s=>{if(s)s.hidden=true;});
    modalScrim.hidden=false; sheet.hidden=false;
  }
  function closeSheets(){[modeSheet,customSheet,permissionSheet].forEach(s=>{if(s)s.hidden=true;});modalScrim.hidden=true;}

  function getBridge(){return window.BearagnosticNative || null;}
  function parseJSON(raw){try{return typeof raw==='string'?JSON.parse(raw):raw||null;}catch(_){return null;}}
  function refreshNativeState(){
    try{ const bridge=getBridge(); if(bridge?.getNativeState) onNativeStateChanged(parseJSON(bridge.getNativeState())); }catch(_){ }
  }
  function onNativeStateChanged(state){nativeState=state||nativeState;}

  function resetScanUI(){
    scanState='idle';scanRunning=false;checkupScreen.dataset.state='idle';stopStream();
    $('scanReviewed').textContent='0';$('scanDuplicates').textContent='0';$('scanLarge').textContent='0';$('scanOlder').textContent='0';
    setProgress(0);setStages(-1);$('scanTitleText').textContent=t('scanIdleTitle');$('scanSubtitle').textContent=t('scanIdleSub');$('scanRingLabel').textContent=t('ready');$('scanQuote').textContent=t('quoteIdle');$('scanActionLabel').textContent=t('chooseMode');$('scanAction').disabled=false;
  }
  function beginScanUI(mode){
    currentMode=mode;scanState='running';scanRunning=true;checkupScreen.dataset.state='running';
    $('scanTitleText').textContent=t('scanRunningTitle');$('scanSubtitle').textContent=t('scanRunningSub');$('scanRingLabel').textContent=t('scanning');$('scanQuote').textContent=t('quoteRunning');$('scanActionLabel').textContent=t('cancelScan');$('scanAction').disabled=false;
    $('scanReviewed').textContent='0';$('scanDuplicates').textContent='0';$('scanLarge').textContent='0';$('scanOlder').textContent='0';
    setProgress(0);setStages(0);startStream();
  }
  function completeScanUI(data){
    scanRunning=false;scanState='complete';checkupScreen.dataset.state='complete';stopStream();setProgress(100);setStages(PHASES.length);
    $('scanTitleText').textContent=t('scanDoneTitle');$('scanSubtitle').textContent=t('scanDoneSub');$('scanRingLabel').textContent=t('complete');$('scanQuote').textContent=t('quoteDone');$('scanActionLabel').textContent=t('runAgain');
    updateCounters(data,true);
    const reviewed=Number(data.reviewedFiles||0); const duration=Number(data.durationMs||0);
    $('healthSummary').textContent = lang==='th' ? `ตรวจแล้ว ${reviewed.toLocaleString()} ไฟล์ · ${(duration/1000).toFixed(1)} วินาที` : lang==='ja' ? `${reviewed.toLocaleString()} ファイル確認 · ${(duration/1000).toFixed(1)}秒` : `${reviewed.toLocaleString()} files reviewed · ${(duration/1000).toFixed(1)}s`;
    try{localStorage.setItem(`${STORAGE}lastScan`,JSON.stringify({reviewed,duration,mode:data.scanMode||currentMode,at:Date.now()}));}catch(_){ }
  }

  function setProgress(value){
    const v=Math.max(0,Math.min(100,Number(value)||0));
    $('scanPercent').textContent=String(Math.round(v));
    $('scanRingValue').style.strokeDashoffset=String(RING_LENGTH*(1-v/100));
    $('scanRailProgress').style.width=`${v}%`;
  }
  function setStages(index){
    $$('[data-scan-stage]',checkupScreen).forEach((el,i)=>{el.classList.toggle('is-done',i<index||index>=PHASES.length);el.classList.toggle('is-active',i===index&&index<PHASES.length);});
  }
  function progressFor(data){
    const idx=Math.max(0,PHASES.indexOf(data.phase));
    let fraction=0;
    const processed=Number(data.phaseProcessedFiles||0), total=Number(data.phaseTotalFiles||0);
    if(total>0) fraction=Math.max(0,Math.min(1,processed/total));
    if(data.phase==='duplicates'){
      const bytes=Number(data.hashedBytes||0), candidate=Number(data.duplicateCandidateBytes||0);
      if(candidate>0) fraction=Math.max(0,Math.min(1,bytes/candidate));
      else if(data.duplicateVerificationEnabled===false) fraction=1;
    }
    if(data.phase==='preparing') fraction=0;
    if(data.phase==='finalizing') fraction=.35;
    return ((idx+fraction)/PHASES.length)*100;
  }
  function updateCounters(data,complete=false){
    $('scanReviewed').textContent=String(Number(data.reviewedFiles||data.discoveredFiles||0).toLocaleString());
    $('scanDuplicates').textContent=String(Number((complete?data.duplicateCopies:data.duplicateCandidateFiles)||0).toLocaleString());
    $('scanLarge').textContent=String(Number(data.largeFiles||0).toLocaleString());
    $('scanOlder').textContent=String(Number(data.olderFiles||0).toLocaleString());
  }
  function onScanProgress(data){
    if(!data)return; if(!scanRunning)beginScanUI(data.scanMode||currentMode);
    updateCounters(data,false);
    const idx=PHASES.indexOf(data.phase); if(idx>=0)setStages(idx);
    setProgress(progressFor(data));
  }
  function onScanComplete(data){if(data)completeScanUI(data);}
  function onScanCancelled(){scanRunning=false;scanState='idle';stopStream();resetScanUI();showToast(t('scanCancelled'));}
  function onScanError(){scanRunning=false;scanState='idle';stopStream();resetScanUI();showToast(t('scanFailed'));}

  const iconPaths={
    doc:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/><path d="M10 12h5M10 15h5"/>',
    image:'<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.4"/><path d="m6 17 4-4 3 3 2-2 3 3"/>',
    video:'<rect x="4" y="6" width="16" height="12" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    audio:'<path d="M9 18V7l9-2v11"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="15.5" cy="16" r="2.5"/>',
    folder:'<path d="M3.5 7h6l2-2H20a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V8A1 1 0 0 1 3.5 7Z"/>'
  };
  function reducedMotion(){const mode=document.documentElement.dataset.motion||'system';return mode==='reduced'||(mode==='system'&&matchMedia('(prefers-reduced-motion: reduce)').matches);}
  function spawnTile(){
    if(!stream||!scanRunning||reducedMotion())return;
    const kind=TILE_KINDS[tileIndex++%TILE_KINDS.length];const tile=document.createElement('span');tile.className='scan-file-tile';tile.dataset.kind=kind;tile.style.setProperty('--lane',String(tileIndex%4));tile.innerHTML=`<svg viewBox="0 0 24 24">${iconPaths[kind]}</svg>`;stream.appendChild(tile);setTimeout(()=>tile.remove(),1900);
  }
  function startStream(){stopStream();if(reducedMotion())return;spawnTile();streamTimer=setInterval(spawnTile,430);}
  function stopStream(){if(streamTimer){clearInterval(streamTimer);streamTimer=null;}if(stream)stream.replaceChildren();}

  function ensurePermissionThen(mode,scopes=[],verify=true){
    refreshNativeState();
    if(!nativeState?.broadStorageAccess){openSheet(permissionSheet);showToast(t('permissionNeeded'));return;}
    startNativeScan(mode,scopes,verify);
  }
  function startNativeScan(mode,scopes=[],verify=true){
    closeSheets();switchScreen('checkup');beginScanUI(mode);
    try{
      const result=parseJSON(getBridge()?.startScan?.(mode,JSON.stringify(scopes),Boolean(verify)));
      if(!result?.accepted){
        if(result?.reason==='storage_access_required'){scanRunning=false;resetScanUI();openSheet(permissionSheet);}
        else{scanRunning=false;resetScanUI();showToast(t('scanBusy'));}
      }
    }catch(_){scanRunning=false;resetScanUI();showToast(t('scanFailed'));}
  }
  function chooseMode(mode){
    if(mode==='custom'){openSheet(customSheet);return;}
    ensurePermissionThen(mode,[],mode!=='quick');
  }

  window.BearagnosticAndroid={
    onNativeStateChanged:(data)=>onNativeStateChanged(data),
    onScanProgress:(data)=>onScanProgress(data),
    onScanComplete:(data)=>onScanComplete(data),
    onScanCancelled:(data)=>onScanCancelled(data),
    onScanError:(data)=>onScanError(data)
  };

  function bind(){
    $('homeBrandButton').addEventListener('click',()=>switchScreen('home'));
    $('settingsButton').addEventListener('click',()=>{returnFromPreferences=currentScreen;switchScreen('preferences');});
    $('preferencesBack').addEventListener('click',()=>switchScreen(returnFromPreferences||'home'));
    $$('.nav-button[data-nav]').forEach(b=>b.addEventListener('click',()=>switchScreen(b.dataset.nav)));
    $('startCheckup').addEventListener('click',()=>openSheet(modeSheet));
    $('healthCard').addEventListener('click',()=>switchScreen('checkup'));
    $('scanAction').addEventListener('click',()=>{
      if(scanRunning){try{getBridge()?.cancelOneTapScan?.();}catch(_){}} else openSheet(modeSheet);
    });
    $$('.mode-option[data-mode]').forEach(b=>b.addEventListener('click',()=>chooseMode(b.dataset.mode)));
    $('modeClose').addEventListener('click',closeSheets);$('customClose').addEventListener('click',closeSheets);$('permissionClose').addEventListener('click',closeSheets);modalScrim.addEventListener('click',closeSheets);
    $('customStart').addEventListener('click',()=>{const scopes=$$('.scope-grid input:checked').map(i=>i.value);ensurePermissionThen('custom',scopes,$('customVerify').checked);});
    $('grantStorage').addEventListener('click',()=>{try{getBridge()?.requestBroadStorageAccess?.();closeSheets();}catch(_){showToast(t('scanFailed'));}});
    $$('[data-language-group] [data-lang]').forEach(b=>b.addEventListener('click',()=>applyLanguage(b.dataset.lang)));
    $('motionSelect').value=localStorage.getItem(MOTION_KEY)||'system'; document.documentElement.dataset.motion=$('motionSelect').value;
    $('motionSelect').addEventListener('change',e=>{localStorage.setItem(MOTION_KEY,e.target.value);document.documentElement.dataset.motion=e.target.value;if(reducedMotion())stopStream();else if(scanRunning)startStream();});
    $$('[data-tool]').forEach(b=>b.addEventListener('click',()=>showToast(t('toolLater'))));
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshNativeState();});
  }
  function boot(){applyLanguage(lang);bind();resetScanUI();refreshNativeState();runOpening();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
