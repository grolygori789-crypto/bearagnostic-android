(() => {
  'use strict';

  const COPY = {
    en: {
      doctorIn:'Dr. Bear is in.', heroTitle:'<em>A cleaner device</em><br><em>for a smoother you.</em>', startCheckup:'Start Checkup', startCheckupBody:'Choose how deeply Bearagnostic should check.',
      cleanup:'Cleanup', cleanupSub:'Review candidates', duplicates:'Duplicates', duplicatesSub:'Find repeats', largeFiles:'Large Files', largeFilesSub:'Biggest files', olderFiles:'Older Files', olderFilesSub:'Older edits', fileHealth:'File Health', fileHealthSub:'Your checkup summary will appear here.', editorialQuote:'A cleaner device leads to a calmer mind.',
      scanKicker:'SCANNING YOUR FILES', scanIdleTitle:'Ready for a checkup', scanIdleSub:'Choose a scan mode. Bearagnostic only reports work the native scanner actually completes.', scanRunningTitle:'Checking things out', scanRunningSub:'Every stage below is real native work.', scanDoneTitle:'Checkup complete', scanDoneSub:'Accessible storage was reviewed locally.', scanCancelledTitle:'Checkup cancelled', scanCancelledSub:'Nothing was deleted.', scanErrorTitle:'Checkup could not finish', scanErrorSub:'Bearagnostic will not invent a successful result.',
      stagePreparing:'Preparing', stagePreparingSub:'Discovering files', stageDetails:'File Details', stageDetailsSub:'Reading info', stageSizes:'File Sizes', stageSizesSub:'Analyzing', stageDuplicates:'Duplicates', stageDuplicatesSub:'Finding matches', stageDates:'Modified Dates', stageDatesSub:'Checking dates', stageFinalizing:'Finalizing', stageFinalizingSub:'Almost there',
      ready:'READY', scanning:'SCANNING', verifying:'VERIFYING', filesReviewed:'files reviewed', duplicateCandidates:'duplicate candidates', exactDuplicates:'exact duplicate copies', largeNoted:'large files noted', olderFound:'older files found', quoteIdle:'Your files. Your choice.', quoteRunning:'Looking carefully. Bears don’t rush diagnostics.', quoteDone:'All done. These numbers come from the native scan.', quoteCancelled:'Stopped safely. No files were deleted.', quoteError:'No guesswork. An incomplete scan is never called complete.',
      tipTitle:'Did you know?', tipBody:'Bearagnostic analyzes accessible files locally on this device.', chooseMode:'Choose scan mode', scanDepth:'SCAN DEPTH', chooseHow:'Choose how deeply to scan', recommended:'Recommended', smartDesc:'Full metadata scan with focused duplicate verification.', quickDesc:'Fast scan of high-value shared locations.', deepDesc:'Multi-pass full accessible-storage scan with content probes and exact duplicates.', customDesc:'Choose locations and duplicate verification.', customTitle:'Choose what to scan', downloads:'Downloads', photos:'Photos', videos:'Videos', documents:'Documents', music:'Music', verifyExact:'Verify exact duplicates', useCustom:'Use Custom Scan',
      toolsTitle:'Focused file review', toolsBody:'Cleaner tools will use the same native evidence.', insightsTitle:'Real results only', insightsBody:'Insights remain empty until real scans create real data.', privacyBody:'Local-first file health by Benedict Interactive.', preferences:'Preferences', back:'Back', navHome:'Home', navCheckup:'Checkup', navTools:'Tools', navInsights:'Insights', navMore:'More', allowAccess:'Allow storage access', cancelScan:'Cancel Scan', runAgain:'Run Checkup Again', comingSoon:'This surface is not wired yet. No fake result is shown.', selectOne:'Choose at least one location'
    },
    th: {
      doctorIn:'คุณหมอแบร์พร้อมแล้ว', heroTitle:'<em>เครื่องสะอาดขึ้น</em><br><em>ทุกอย่างก็ลื่นขึ้น</em>', startCheckup:'เริ่มตรวจเครื่อง', startCheckupBody:'เลือกความละเอียดที่ต้องการให้ Bearagnostic ตรวจ',
      cleanup:'ทำความสะอาด', cleanupSub:'ตรวจรายการก่อนลบ', duplicates:'ไฟล์ซ้ำ', duplicatesSub:'หาไฟล์ที่ซ้ำจริง', largeFiles:'ไฟล์ขนาดใหญ่', largeFilesSub:'ดูไฟล์ที่กินพื้นที่', olderFiles:'ไฟล์เก่า', olderFilesSub:'ตรวจตามอายุไฟล์', fileHealth:'สุขภาพไฟล์', fileHealthSub:'ผลตรวจล่าสุดจะแสดงตรงนี้', editorialQuote:'เครื่องที่เป็นระเบียบขึ้น ชีวิตดิจิทัลก็เบาขึ้น',
      scanKicker:'กำลังตรวจไฟล์ในเครื่อง', scanIdleTitle:'พร้อมตรวจแล้ว', scanIdleSub:'เลือกโหมดสแกน Bearagnostic จะแสดงเฉพาะงานที่ native scanner ทำจริง', scanRunningTitle:'กำลังตรวจอย่างละเอียด', scanRunningSub:'ทุกขั้นด้านล่างคืองานจริงของ native scanner', scanDoneTitle:'ตรวจเรียบร้อยแล้ว', scanDoneSub:'ตรวจพื้นที่ที่ Android อนุญาตให้เข้าถึงภายในเครื่องแล้ว', scanCancelledTitle:'ยกเลิกการตรวจแล้ว', scanCancelledSub:'ไม่มีการลบไฟล์', scanErrorTitle:'ตรวจไม่สำเร็จ', scanErrorSub:'Bearagnostic จะไม่สร้างผลสำเร็จปลอมขึ้นมา',
      stagePreparing:'เตรียมระบบ', stagePreparingSub:'ค้นหาไฟล์', stageDetails:'รายละเอียดไฟล์', stageDetailsSub:'อ่านข้อมูล', stageSizes:'ขนาดไฟล์', stageSizesSub:'วิเคราะห์', stageDuplicates:'ไฟล์ซ้ำ', stageDuplicatesSub:'ยืนยันไฟล์', stageDates:'วันที่แก้ไข', stageDatesSub:'ตรวจเวลา', stageFinalizing:'สรุปผล', stageFinalizingSub:'ใกล้เสร็จแล้ว',
      ready:'พร้อม', scanning:'กำลังตรวจ', verifying:'กำลังยืนยัน', filesReviewed:'ไฟล์ที่ตรวจแล้ว', duplicateCandidates:'ไฟล์ที่อาจซ้ำ', exactDuplicates:'สำเนาซ้ำที่ยืนยันแล้ว', largeNoted:'ไฟล์ขนาดใหญ่', olderFound:'ไฟล์เก่าที่พบ', quoteIdle:'ไฟล์ของคุณ คุณเป็นคนเลือก', quoteRunning:'กำลังตรวจให้ละเอียด การตรวจที่ดีไม่ต้องรีบ', quoteDone:'เรียบร้อย ตัวเลขทั้งหมดมาจากการสแกนจริง', quoteCancelled:'หยุดอย่างปลอดภัย ไม่มีไฟล์ถูกลบ', quoteError:'ไม่เดาผล การตรวจที่ไม่จบจะไม่ถูกเรียกว่าเสร็จ',
      tipTitle:'รู้หรือไม่?', tipBody:'Bearagnostic วิเคราะห์ไฟล์ที่เข้าถึงได้ภายในเครื่องนี้', chooseMode:'เลือกโหมดสแกน', scanDepth:'ระดับการสแกน', chooseHow:'เลือกความละเอียดในการสแกน', recommended:'แนะนำ', smartDesc:'ตรวจ metadata ทั้งพื้นที่ และยืนยันไฟล์ซ้ำในจุดสำคัญ', quickDesc:'ตรวจเร็วในตำแหน่ง shared storage สำคัญ', deepDesc:'ตรวจหลายขั้นทั่วพื้นที่ที่เข้าถึงได้ อ่านข้อมูลจริงของทุกไฟล์ และยืนยันไฟล์ซ้ำ', customDesc:'เลือกตำแหน่งและการยืนยันไฟล์ซ้ำเอง', customTitle:'เลือกสิ่งที่ต้องการตรวจ', downloads:'ดาวน์โหลด', photos:'รูปภาพ', videos:'วิดีโอ', documents:'เอกสาร', music:'เพลง', verifyExact:'ยืนยันไฟล์ซ้ำแบบตรงกันจริง', useCustom:'ใช้ Custom Scan',
      toolsTitle:'ตรวจไฟล์แบบเจาะจง', toolsBody:'เครื่องมือ Cleaner จะใช้หลักฐานจาก native scanner เดียวกัน', insightsTitle:'ใช้เฉพาะข้อมูลจริง', insightsBody:'ข้อมูลเชิงลึกจะยังว่างจนกว่าจะมีผลสแกนจริง', privacyBody:'File Health แบบ local-first โดย Benedict Interactive', preferences:'การตั้งค่า', back:'ย้อนกลับ', navHome:'หน้าหลัก', navCheckup:'ตรวจเครื่อง', navTools:'เครื่องมือ', navInsights:'ข้อมูล', navMore:'เพิ่มเติม', allowAccess:'อนุญาตสิทธิ์เข้าถึงไฟล์', cancelScan:'ยกเลิกการสแกน', runAgain:'ตรวจอีกครั้ง', comingSoon:'ส่วนนี้ยังไม่ได้เชื่อมการทำงาน จึงไม่แสดงผลปลอม', selectOne:'เลือกอย่างน้อย 1 ตำแหน่ง'
    },
    ja: {
      doctorIn:'Dr. Bearが準備できました', heroTitle:'<em>端末をすっきり</em><br><em>毎日をもっと軽やかに。</em>', startCheckup:'チェックを開始', startCheckupBody:'スキャンの深さを選択します',
      cleanup:'クリーンアップ', cleanupSub:'候補を確認', duplicates:'重複ファイル', duplicatesSub:'完全一致を確認', largeFiles:'大きなファイル', largeFilesSub:'容量順に確認', olderFiles:'古いファイル', olderFilesSub:'更新日で確認', fileHealth:'ファイルヘルス', fileHealthSub:'最新のチェック結果がここに表示されます', editorialQuote:'端末が整うと、デジタル生活も軽くなる。',
      scanKicker:'ファイルをスキャン中', scanIdleTitle:'チェックの準備完了', scanIdleSub:'スキャンモードを選択してください。実際に完了した処理だけを表示します。', scanRunningTitle:'詳しく確認しています', scanRunningSub:'下の各段階は実際のネイティブ処理です。', scanDoneTitle:'チェック完了', scanDoneSub:'アクセス可能なストレージを端末内で確認しました。', scanCancelledTitle:'チェックを中止しました', scanCancelledSub:'ファイルは削除されていません。', scanErrorTitle:'チェックを完了できませんでした', scanErrorSub:'未完了の処理を完了扱いにはしません。',
      stagePreparing:'準備', stagePreparingSub:'ファイル検出', stageDetails:'ファイル情報', stageDetailsSub:'情報を読取', stageSizes:'ファイルサイズ', stageSizesSub:'分析中', stageDuplicates:'重複', stageDuplicatesSub:'一致確認', stageDates:'更新日時', stageDatesSub:'日時確認', stageFinalizing:'最終処理', stageFinalizingSub:'まもなく完了',
      ready:'準備完了', scanning:'スキャン中', verifying:'検証中', filesReviewed:'確認済みファイル', duplicateCandidates:'重複候補', exactDuplicates:'確認済み重複コピー', largeNoted:'大きなファイル', olderFound:'古いファイル', quoteIdle:'あなたのファイル。選ぶのもあなた。', quoteRunning:'丁寧に確認中。診断は急ぎません。', quoteDone:'完了しました。数値は実際のスキャン結果です。', quoteCancelled:'安全に停止しました。削除はありません。', quoteError:'推測はしません。未完了は未完了のまま表示します。',
      tipTitle:'ご存じですか？', tipBody:'Bearagnosticはアクセス可能なファイルを端末内で分析します。', chooseMode:'スキャンモードを選択', scanDepth:'スキャン深度', chooseHow:'スキャンの深さを選択', recommended:'おすすめ', smartDesc:'全体のメタデータを確認し、重要な場所で重複を検証します。', quickDesc:'重要な共有フォルダをすばやく確認します。', deepDesc:'アクセス可能な領域を複数工程で確認し、内容を読み取り、重複を完全検証します。', customDesc:'場所と重複検証を選択します。', customTitle:'スキャン対象を選択', downloads:'ダウンロード', photos:'写真', videos:'動画', documents:'書類', music:'音楽', verifyExact:'完全一致の重複を検証', useCustom:'Custom Scanを使用',
      toolsTitle:'目的別ファイル確認', toolsBody:'同じネイティブスキャンの証拠を利用します。', insightsTitle:'実データのみ', insightsBody:'実際のスキャン結果ができるまで表示しません。', privacyBody:'Benedict Interactiveによるローカル優先のFile Health', preferences:'設定', back:'戻る', navHome:'ホーム', navCheckup:'チェック', navTools:'ツール', navInsights:'分析', navMore:'その他', allowAccess:'ストレージへのアクセスを許可', cancelScan:'スキャンを中止', runAgain:'もう一度チェック', comingSoon:'この機能はまだ接続されていないため、仮の結果は表示しません。', selectOne:'1つ以上選択してください'
    }
  };

  const $ = id => document.getElementById(id);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const STORAGE='bearagnostic.android.';
  const LAUNCH_KEY=`${STORAGE}launch.seen.b10`;
  const LANG_KEY=`${STORAGE}language`;
  const RING=289.03;
  const STAGES=['preparing','file_details','file_sizes','duplicates','modified_dates','finalizing'];
  const MODE_LABELS={smart:'Smart',quick:'Quick',deep:'Deep',custom:'Custom'};

  let language='en', selectedMode='smart', scanState='idle', currentScreen='home', lastResult=null;
  let nativeState={broadStorageAccess:false,scannerReady:false,scannerRunning:false};
  let pendingStart=null;

  const launch=$('launch'), appRoot=$('appRoot'), studioStage=document.querySelector('[data-launch-stage="studio"]'), productStage=document.querySelector('[data-launch-stage="product"]');
  const modeSheet=$('modeSheet'), customSheet=$('customSheet'), modalScrim=$('modalScrim');
  const scanRing=$('scanRing'), scanRingValue=$('scanRingValue'), scanPercent=$('scanPercent'), scanRingLabel=$('scanRingLabel'), scanRailProgress=$('scanRailProgress');
  const scanTitleText=$('scanTitleText'), scanSubtitle=$('scanSubtitle'), scanReviewed=$('scanReviewed'), scanDuplicates=$('scanDuplicates'), scanDuplicatesLabel=$('scanDuplicatesLabel'), scanLarge=$('scanLarge'), scanOlder=$('scanOlder'), scanQuote=$('scanQuote'), scanTipTitle=$('scanTipTitle'), scanTipBody=$('scanTipBody'), scanAction=$('scanAction'), scanActionLabel=$('scanActionLabel'), healthSummary=$('healthSummary');

  function storageGet(k,f=null){try{const v=localStorage.getItem(k);return v==null?f:v}catch(_){return f}}
  function storageSet(k,v){try{localStorage.setItem(k,String(v))}catch(_){}}
  function detectLanguage(){const saved=storageGet(LANG_KEY);if(COPY[saved])return saved;const raw=(navigator.languages?.[0]||navigator.language||'en').toLowerCase();return raw.startsWith('th')?'th':raw.startsWith('ja')?'ja':'en'}
  const t=k=>COPY[language]?.[k]??COPY.en[k]??k;
  function applyLanguage(next,persist=true){if(!COPY[next])next='en';language=next;document.documentElement.lang=next;$$('[data-i18n]').forEach(el=>{const v=COPY[next][el.dataset.i18n];if(v!=null)el.textContent=v});$$('[data-i18n-html]').forEach(el=>{const v=COPY[next][el.dataset.i18nHtml];if(v!=null)el.innerHTML=v});if(persist)storageSet(LANG_KEY,next);renderScanCopy();renderScanAction();}
  function formatNumber(v){return new Intl.NumberFormat(language==='th'?'th-TH':language==='ja'?'ja-JP':'en-US').format(Number(v||0))}
  function formatBytes(v){let n=Number(v||0);if(!Number.isFinite(n)||n<=0)return'0 B';const u=['B','KB','MB','GB','TB'];let i=0;while(n>=1024&&i<u.length-1){n/=1024;i++}return`${n.toFixed(i>=3?2:i>=2?1:0)} ${u[i]}`}
  function showToast(msg){const toast=$('toast');if(!toast)return;toast.textContent=msg;toast.hidden=false;requestAnimationFrame(()=>toast.classList.add('is-visible'));clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>{toast.classList.remove('is-visible');setTimeout(()=>toast.hidden=true,180)},2200)}
  function wait(ms){return new Promise(r=>setTimeout(r,ms))}

  async function runOpening(){
    let done=false;const first=storageGet(LAUNCH_KEY)!=='1';const timings=first?{studio:2400,product:2600,fade:300}:{studio:1100,product:1300,fade:220};
    const finish=()=>{if(done)return;done=true;if(appRoot)appRoot.hidden=false;if(launch)launch.classList.add('is-leaving');setTimeout(()=>{if(launch)launch.hidden=true;storageSet(LAUNCH_KEY,'1');readNativeState()},timings.fade)};
    const watchdog=setTimeout(finish,first?6200:3400);
    try{if(appRoot)appRoot.hidden=false;if(launch)launch.hidden=false;studioStage?.classList.add('is-active');productStage?.classList.remove('is-active');await wait(timings.studio);studioStage?.classList.remove('is-active');productStage?.classList.add('is-active');await wait(timings.product);clearTimeout(watchdog);finish()}catch(_){clearTimeout(watchdog);finish()}
  }

  function switchScreen(name){const target=document.querySelector(`[data-screen="${name}"]`);if(!target)return;$$('.screen').forEach(s=>{const a=s===target;s.hidden=!a;s.classList.toggle('is-active',a)});currentScreen=name;appRoot?.classList.toggle('is-checkup',name==='checkup');$$('.nav-button').forEach(b=>b.classList.toggle('is-active',b.dataset.nav===name));if(name==='checkup')renderScanAction()}
  function openSheet(sheet){[modeSheet,customSheet].forEach(s=>{if(s)s.hidden=true});if(modalScrim)modalScrim.hidden=false;if(sheet)sheet.hidden=false}
  function closeSheets(){[modeSheet,customSheet].forEach(s=>{if(s)s.hidden=true});if(modalScrim)modalScrim.hidden=true}
  function customScopes(){return $$('.scope-grid input[type="checkbox"]:checked').map(i=>i.value)}

  function resetProgress(){
    scanState='idle';lastResult=null;scanReviewed.textContent='0';scanDuplicates.textContent='0';scanDuplicatesLabel.textContent=t('duplicateCandidates');scanLarge.textContent='0';scanOlder.textContent='0';scanPercent.textContent='0';scanRingLabel.textContent=t('ready');scanRing?.classList.remove('is-indeterminate');if(scanRingValue)scanRingValue.style.strokeDashoffset=String(RING);if(scanRailProgress)scanRailProgress.style.width='0%';$$('.scan-stage').forEach(s=>s.classList.remove('is-done','is-active','is-skipped'));renderScanCopy();renderScanAction();renderTip(null)
  }
  function setScanState(s){scanState=s;$('checkupScreen')?.setAttribute('data-state',s);renderScanCopy();renderScanAction()}
  function renderScanCopy(){if(!scanTitleText)return;if(scanState==='running'){scanTitleText.textContent=t('scanRunningTitle');scanSubtitle.textContent=t('scanRunningSub');scanQuote.textContent=t('quoteRunning')}else if(scanState==='complete'){scanTitleText.textContent=t('scanDoneTitle');scanSubtitle.textContent=t('scanDoneSub');scanQuote.textContent=t('quoteDone')}else if(scanState==='cancelled'){scanTitleText.textContent=t('scanCancelledTitle');scanSubtitle.textContent=t('scanCancelledSub');scanQuote.textContent=t('quoteCancelled')}else if(scanState==='error'){scanTitleText.textContent=t('scanErrorTitle');scanSubtitle.textContent=t('scanErrorSub');scanQuote.textContent=t('quoteError')}else{scanTitleText.textContent=t('scanIdleTitle');scanSubtitle.textContent=t('scanIdleSub');scanQuote.textContent=t('quoteIdle')}}
  function renderScanAction(){if(!scanActionLabel)return;if(scanState==='running'){scanActionLabel.textContent=t('cancelScan');scanAction.disabled=false;return}if(!nativeState.broadStorageAccess){scanActionLabel.textContent=t('allowAccess');scanAction.disabled=false;return}if(scanState==='complete'||scanState==='cancelled'||scanState==='error'){scanActionLabel.textContent=t('runAgain');scanAction.disabled=false;return}scanActionLabel.textContent=t('chooseMode');scanAction.disabled=false}
  function setStage(phase){const idx=Math.max(0,STAGES.indexOf(phase));$$('.scan-stage').forEach((s,i)=>{s.classList.toggle('is-done',i<idx);s.classList.toggle('is-active',i===idx);if(s.dataset.stage==='duplicates')s.classList.toggle('is-skipped',selectedMode==='quick'&&i<=idx)});if(scanRailProgress)scanRailProgress.style.width=`${(idx/(STAGES.length-1))*100}%`}
  function renderMeasuredProgress(p){
    const phase=p.phase||'preparing',idx=Math.max(0,STAGES.indexOf(phase));let local=null;
    if(phase==='duplicates'&&Number(p.duplicateCandidateBytes)>0){local=Math.min(1,Number(p.hashedBytes||0)/Number(p.duplicateCandidateBytes));scanRingLabel.textContent=t('verifying')}
    else if(Number(p.phaseTotalFiles)>0){local=Math.min(1,Number(p.phaseProcessedFiles||0)/Number(p.phaseTotalFiles));scanRingLabel.textContent=t('scanning')}
    if(local==null){scanRing?.classList.add('is-indeterminate');scanPercent.textContent='—';return}
    scanRing?.classList.remove('is-indeterminate');const overall=Math.min(.999,(idx+local)/STAGES.length);scanPercent.textContent=String(Math.round(overall*100));if(scanRingValue)scanRingValue.style.strokeDashoffset=String(RING*(1-overall))
  }
  function renderProgress(p){if(currentScreen!=='checkup')switchScreen('checkup');if(scanState!=='running')setScanState('running');setStage(p.phase||'preparing');renderMeasuredProgress(p);scanReviewed.textContent=formatNumber(p.reviewedFiles||p.discoveredFiles||0);scanLarge.textContent=formatNumber(p.largeFiles||0);scanOlder.textContent=formatNumber(p.olderFiles||0);if(p.phase==='duplicates'){scanDuplicates.textContent=formatNumber(p.duplicateCandidateFiles||0);scanDuplicatesLabel.textContent=t('duplicateCandidates')}renderTip(p)}
  function renderComplete(p){lastResult=p;selectedMode=p.scanMode||selectedMode;setScanState('complete');scanReviewed.textContent=formatNumber(p.reviewedFiles||0);scanLarge.textContent=formatNumber(p.largeFiles||0);scanOlder.textContent=formatNumber(p.olderFiles||0);scanDuplicates.textContent=p.duplicateVerificationPerformed?formatNumber(p.duplicateCopies||0):'—';scanDuplicatesLabel.textContent=p.duplicateVerificationPerformed?t('exactDuplicates'):t('duplicateCandidates');scanPercent.textContent='100';scanRingLabel.textContent='COMPLETE';scanRing?.classList.remove('is-indeterminate');if(scanRingValue)scanRingValue.style.strokeDashoffset='0';if(scanRailProgress)scanRailProgress.style.width='100%';$$('.scan-stage').forEach(s=>{s.classList.remove('is-active');s.classList.add('is-done')});healthSummary.textContent=`${formatNumber(p.reviewedFiles)} ${t('filesReviewed')} · ${formatBytes(p.duplicateReclaimableBytes)} verified`;renderTip(p)}
  function renderTip(p){if(!scanTipTitle||!scanTipBody)return;if(p&&p.state==='complete'){if(p.scanMode==='deep'){scanTipTitle.textContent='Deep Scan';scanTipBody.textContent=`${formatNumber(p.directoriesVisited)} dirs · ${formatNumber(p.contentProbedFiles)} content probes · ${formatBytes(p.contentProbeBytes)} read · ${p.coverageStatus||''}`}else{scanTipTitle.textContent=t('tipTitle');scanTipBody.textContent=`${formatNumber(p.directoriesVisited||0)} dirs · ${formatNumber(p.reviewedFiles||0)} ${t('filesReviewed')}`}}else if(p&&p.scanMode==='deep'){scanTipTitle.textContent='Deep Scan';scanTipBody.textContent=`${formatNumber(p.directoriesVisited||0)} dirs · ${formatNumber(p.contentProbedFiles||0)} content probes`}else{scanTipTitle.textContent=t('tipTitle');scanTipBody.textContent=t('tipBody')}}
  function renderTerminal(kind){setScanState(kind);scanRing?.classList.remove('is-indeterminate');scanPercent.textContent=kind==='cancelled'?'×':'!';scanRingLabel.textContent=kind.toUpperCase()}

  function parseNative(raw){if(!raw)return null;if(typeof raw==='object')return raw;try{return JSON.parse(raw)}catch(_){return null}}
  function readNativeState(){try{const p=parseNative(window.BearagnosticNative?.getNativeState?.());if(p)applyNativeState(p)}catch(_){}}
  function applyNativeState(s){nativeState={...nativeState,...(s||{})};if(nativeState.versionName)$('footerBuild').textContent=nativeState.versionName;if(pendingStart&&nativeState.broadStorageAccess&&!nativeState.scannerRunning){const p=pendingStart;pendingStart=null;setTimeout(()=>startNativeScan(p.mode,p.scopes,p.verify),120)}renderScanAction()}
  function startNativeScan(mode=selectedMode,scopes=[],verify=true){if(!nativeState.broadStorageAccess){pendingStart={mode,scopes,verify};try{window.BearagnosticNative?.requestBroadStorageAccess?.()}catch(_){}return}let response=null;try{response=parseNative(window.BearagnosticNative?.startScan?.(mode,JSON.stringify(scopes),verify))}catch(_){}if(response?.accepted){selectedMode=mode;setScanState('running');renderProgress({phase:'preparing',scanMode:mode,discoveredFiles:0,reviewedFiles:0})}else if(response?.reason==='storage_access_required'){nativeState.broadStorageAccess=false;pendingStart={mode,scopes,verify};renderScanAction();try{window.BearagnosticNative?.requestBroadStorageAccess?.()}catch(_){}}else if(response?.reason==='scan_already_running'){setScanState('running')}else{renderTerminal('error')}}
  function beginMode(mode){selectedMode=mode;switchScreen('checkup');resetProgress();closeSheets();if(mode==='custom'){openSheet(customSheet);return}startNativeScan(mode,[],mode!=='quick')}

  window.BearagnosticAndroid=Object.freeze({
    onNativeStateChanged(state){const p=parseNative(state);if(p)applyNativeState(p)},
    onScanProgress(payload){const p=parseNative(payload);if(p)renderProgress(p)},
    onScanComplete(payload){const p=parseNative(payload);if(p)renderComplete(p)},
    onScanCancelled(){renderTerminal('cancelled')},
    onScanError(){renderTerminal('error')},
    forceOpen(){if(appRoot)appRoot.hidden=false;if(launch)launch.hidden=true;readNativeState()}
  });

  function bind(){
    $('homeBrandButton')?.addEventListener('click',()=>switchScreen('home'));
    $('settingsButton')?.addEventListener('click',()=>switchScreen('preferences'));
    $('preferencesBack')?.addEventListener('click',()=>switchScreen('home'));
    $$('.nav-button').forEach(b=>b.addEventListener('click',()=>switchScreen(b.dataset.nav)));
    $('startCheckup')?.addEventListener('click',()=>{switchScreen('checkup');resetProgress();openSheet(modeSheet)});
    $('healthCard')?.addEventListener('click',()=>switchScreen('checkup'));
    scanAction?.addEventListener('click',()=>{if(scanState==='running'){try{window.BearagnosticNative?.cancelOneTapScan?.()}catch(_){}scanAction.disabled=true;return}if(!nativeState.broadStorageAccess){try{window.BearagnosticNative?.requestBroadStorageAccess?.()}catch(_){}return}if(scanState==='complete'||scanState==='cancelled'||scanState==='error'){resetProgress();startNativeScan(selectedMode,selectedMode==='custom'?customScopes():[],selectedMode!=='quick');return}openSheet(modeSheet)});
    $('modeClose')?.addEventListener('click',closeSheets);$('customClose')?.addEventListener('click',closeSheets);modalScrim?.addEventListener('click',closeSheets);
    $$('.mode-option').forEach(b=>b.addEventListener('click',()=>beginMode(b.dataset.mode)));
    $('customSave')?.addEventListener('click',()=>{const scopes=customScopes();if(!scopes.length){showToast(t('selectOne'));return}closeSheets();selectedMode='custom';startNativeScan('custom',scopes,$('verifyDuplicates')?.checked!==false)});
    $$('.tool-card').forEach(b=>b.addEventListener('click',()=>showToast(t('comingSoon'))));
    $$('[data-lang]').forEach(b=>b.addEventListener('click',()=>applyLanguage(b.dataset.lang,true)));
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)readNativeState()});
  }

  function boot(){language=detectLanguage();applyLanguage(language,false);bind();resetProgress();switchScreen('home');runOpening();setTimeout(()=>{if(appRoot)appRoot.hidden=false;if(launch&&!launch.hidden){launch.hidden=true;readNativeState()}},7000)}
  boot();
})();
