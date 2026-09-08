(() => {
  'use strict';

  const COPY = {
    en: {
      scanInfo:'Scan information', close:'Close', kicker:'SMART FILE HEALTH', idleTitle:'Ready when you are', runningTitle:'Checking things out', doneTitle:'Checkup complete', cancelledTitle:'Scan cancelled', errorTitle:'Something interrupted the scan',
      idleSub:'Choose the scan depth, then let Dr. Bear check the files Android allows Bearagnostic to access.', runningSub:'A cleaner device starts with a clear picture of what is actually there.', doneSub:'Your accessible files were reviewed locally. Nothing was deleted.', cancelledSub:'No files were deleted. Start again whenever you are ready.', errorSub:'Your files were left untouched. You can try the scan again.',
      stagePreparing:'Preparing',stagePreparingSub:'Getting ready',stageFiles:'Files',stageFilesSub:'Reading details',stageDuplicates:'Duplicates',stageDuplicatesSub:'Verifying matches',stageFinalizing:'Finalizing',stageFinalizingSub:'Wrapping up',skipped:'Skipped',
      ready:'READY',scanning:'SCANNING',verify:'VERIFY',final:'FINAL',done:'DONE',errorLabel:'ERROR',stopLabel:'STOP',filesReviewed:'files reviewed',duplicatesPending:'duplicate verification',duplicateCandidates:'duplicate candidates',exactDuplicates:'exact duplicate copies',notChecked:'not checked',largeFiles:'large files noted',olderFiles:'older files found',
      quoteIdle:'Your files. Your choice. Bearagnostic just helps you see clearly.',quoteRunning:'Looking carefully. Bears don’t rush diagnostics.',quoteDone:'All done. The numbers shown came from this device.',quoteCancelled:'Stopped safely. Nothing was deleted.',quoteError:'No guessing. If a scan cannot finish, Bearagnostic says so.',
      localTitle:'Local by design',localBody:'File analysis stays on this device. Protected app-private areas remain outside the scan.',checkingAccess:'Checking access',accessReady:'Storage access ready',accessNeeded:'Storage access needed',
      allowAccess:'Allow storage access',startSmart:'Start Smart Scan',startQuick:'Start Quick Scan',startDeep:'Start Deep Scan',startCustom:'Start Custom Scan',cancelScan:'Cancel scan',runAgain:'Run this scan again',tryAgain:'Try again',
      scanDepth:'SCAN DEPTH',chooseMode:'Choose how deeply to scan',smart:'Smart',smartDesc:'Full metadata scan with focused duplicate verification.',quick:'Quick',quickDesc:'Fast scan of high-value shared locations. Exact duplicates are not verified.',deep:'Deep',deepDesc:'Most thorough accessible-storage scan and exact duplicate verification.',custom:'Custom',customDesc:'Choose locations and whether exact duplicates should be verified.',recommended:'Recommended',
      smartChip:'Smart Scan',smartChipSub:'Recommended balance',quickChip:'Quick Scan',quickChipSub:'Fast priority check',deepChip:'Deep Scan',deepChipSub:'Most thorough',customChip:'Custom Scan',customChipSub:'Your locations and rules',
      customTitle:'Choose what to scan',downloads:'Downloads',photos:'Photos',videos:'Videos',documents:'Documents',music:'Music',verifyExact:'Verify exact duplicates',verifyExactDesc:'SHA-256 is used only after cheap same-size filtering.',useCustom:'Use Custom Scan',selectOne:'Choose at least one location.',
      privacy:'PRIVACY & SCOPE',aboutScan:'About this scan',infoLocal:'Files are analyzed on this device and are not uploaded by the current architecture.',accessibleOnly:'Accessible storage only',accessibleOnlyDesc:'Android-protected app-private and root-only areas remain out of scope.',readOnly:'Read-only scan',readOnlyDesc:'This build scans and reports. It does not delete files.',
      duplicateSpace:'Verified duplicate space',duplicateSpaceBody:'{bytes} may be reclaimable after review. No deletion has been performed.',quickResult:'Quick Scan finished without exact duplicate verification.',runningTip:'{mode} is scanning locally. {count} files reviewed so far.',completeTip:'Scan complete',cancelledTip:'Stopped safely',errorTip:'Scan could not finish'
    },
    th: {
      scanInfo:'ข้อมูลการสแกน', close:'ปิด', kicker:'SMART FILE HEALTH', idleTitle:'พร้อมเมื่อคุณพร้อม', runningTitle:'กำลังตรวจให้ละเอียด', doneTitle:'สแกนเสร็จแล้ว', cancelledTitle:'ยกเลิกการสแกนแล้ว', errorTitle:'การสแกนถูกขัดจังหวะ',
      idleSub:'เลือกระดับการสแกน แล้วให้ Dr. Bear ตรวจเฉพาะไฟล์ที่ Android อนุญาตให้ Bearagnostic เข้าถึงได้', runningSub:'เริ่มจากดูข้อมูลจริงในเครื่องให้ชัดก่อน แล้วค่อยตัดสินใจว่าจะจัดการอะไร', doneSub:'ตรวจไฟล์ที่เข้าถึงได้ภายในเครื่องเรียบร้อยแล้ว และยังไม่มีการลบไฟล์', cancelledSub:'ไม่มีไฟล์ถูกลบ พร้อมเมื่อไรก็เริ่มใหม่ได้', errorSub:'ไฟล์ยังคงอยู่เหมือนเดิม สามารถลองสแกนใหม่ได้',
      stagePreparing:'เตรียมระบบ',stagePreparingSub:'กำลังเตรียม',stageFiles:'ตรวจไฟล์',stageFilesSub:'อ่านรายละเอียด',stageDuplicates:'ไฟล์ซ้ำ',stageDuplicatesSub:'ยืนยันไฟล์ที่ตรงกัน',stageFinalizing:'สรุปผล',stageFinalizingSub:'กำลังสรุป',skipped:'ข้าม',
      ready:'พร้อม',scanning:'กำลังตรวจ',verify:'ยืนยัน',final:'สรุป',done:'เสร็จแล้ว',errorLabel:'ผิดพลาด',stopLabel:'หยุด',filesReviewed:'ไฟล์ที่ตรวจแล้ว',duplicatesPending:'การยืนยันไฟล์ซ้ำ',duplicateCandidates:'ไฟล์ที่อาจซ้ำ',exactDuplicates:'สำเนาซ้ำที่ยืนยันแล้ว',notChecked:'ไม่ได้ตรวจ',largeFiles:'ไฟล์ขนาดใหญ่',olderFiles:'ไฟล์เก่าที่พบ',
      quoteIdle:'ไฟล์ของคุณ คุณเป็นคนเลือก Bearagnostic ช่วยให้เห็นข้อมูลชัดขึ้นเท่านั้น',quoteRunning:'ค่อยๆ ตรวจให้ชัด การตรวจที่ดีไม่จำเป็นต้องรีบ',quoteDone:'เรียบร้อย ตัวเลขที่เห็นมาจากการตรวจจริงบนเครื่องนี้',quoteCancelled:'หยุดอย่างปลอดภัย ไม่มีไฟล์ถูกลบ',quoteError:'ไม่เดา ถ้าตรวจไม่สำเร็จ Bearagnostic จะบอกตรงๆ',
      localTitle:'ทำงานในเครื่องเป็นหลัก',localBody:'วิเคราะห์ไฟล์ภายในเครื่อง พื้นที่ส่วนตัวของแอพที่ Android ป้องกันยังอยู่นอกขอบเขต',checkingAccess:'กำลังตรวจสิทธิ์',accessReady:'สิทธิ์พร้อม',accessNeeded:'ต้องอนุญาตสิทธิ์',
      allowAccess:'อนุญาตสิทธิ์เข้าถึงไฟล์',startSmart:'เริ่ม Smart Scan',startQuick:'เริ่ม Quick Scan',startDeep:'เริ่ม Deep Scan',startCustom:'เริ่ม Custom Scan',cancelScan:'ยกเลิกการสแกน',runAgain:'สแกนแบบเดิมอีกครั้ง',tryAgain:'ลองอีกครั้ง',
      scanDepth:'ระดับการสแกน',chooseMode:'เลือกความละเอียดที่ต้องการ',smart:'Smart',smartDesc:'ตรวจ metadata ทั่วพื้นที่ที่เข้าถึงได้ และยืนยันไฟล์ซ้ำเฉพาะตำแหน่งสำคัญ',quick:'Quick',quickDesc:'ตรวจเร็วเฉพาะตำแหน่งสำคัญ และไม่ยืนยันไฟล์ซ้ำแบบตรงกันจริง',deep:'Deep',deepDesc:'ตรวจละเอียดที่สุดในพื้นที่ที่เข้าถึงได้ พร้อมยืนยันไฟล์ซ้ำแบบตรงกันจริง',custom:'Custom',customDesc:'เลือกตำแหน่งที่จะตรวจและกำหนดการยืนยันไฟล์ซ้ำเอง',recommended:'แนะนำ',
      smartChip:'Smart Scan',smartChipSub:'สมดุลที่แนะนำ',quickChip:'Quick Scan',quickChipSub:'เร็ว เน้นจุดสำคัญ',deepChip:'Deep Scan',deepChipSub:'ละเอียดที่สุด',customChip:'Custom Scan',customChipSub:'เลือกตำแหน่งเอง',
      customTitle:'เลือกสิ่งที่ต้องการตรวจ',downloads:'ดาวน์โหลด',photos:'รูปภาพ',videos:'วิดีโอ',documents:'เอกสาร',music:'เพลง',verifyExact:'ยืนยันไฟล์ซ้ำแบบตรงกันจริง',verifyExactDesc:'ใช้ SHA-256 หลังคัดกรองไฟล์ที่มีขนาดเท่ากันแล้วเท่านั้น',useCustom:'ใช้ Custom Scan',selectOne:'เลือกอย่างน้อย 1 ตำแหน่ง',
      privacy:'ความเป็นส่วนตัวและขอบเขต',aboutScan:'เกี่ยวกับการสแกน',infoLocal:'ไฟล์ถูกวิเคราะห์บนเครื่องนี้ และสถาปัตยกรรมปัจจุบันไม่มีการอัปโหลดไฟล์',accessibleOnly:'ตรวจเฉพาะพื้นที่ที่เข้าถึงได้',accessibleOnlyDesc:'พื้นที่ส่วนตัวของแอพที่ Android ป้องกันและพื้นที่ที่ต้องใช้ root อยู่นอกขอบเขต',readOnly:'สแกนแบบอ่านอย่างเดียว',readOnlyDesc:'Build นี้ตรวจและรายงานผลเท่านั้น ยังไม่มีการลบไฟล์',
      duplicateSpace:'พื้นที่ไฟล์ซ้ำที่ยืนยันแล้ว',duplicateSpaceBody:'{bytes} อาจเรียกคืนได้หลังตรวจทาน และยังไม่มีการลบไฟล์',quickResult:'Quick Scan เสร็จแล้ว โดยไม่ได้ยืนยันไฟล์ซ้ำแบบตรงกันจริง',runningTip:'{mode} กำลังตรวจภายในเครื่อง ตอนนี้ตรวจแล้ว {count} ไฟล์',completeTip:'สแกนเสร็จแล้ว',cancelledTip:'หยุดอย่างปลอดภัย',errorTip:'สแกนไม่สำเร็จ'
    },
    ja: {
      scanInfo:'スキャン情報', close:'閉じる', kicker:'SMART FILE HEALTH', idleTitle:'準備ができたら開始', runningTitle:'丁寧に確認中', doneTitle:'スキャン完了', cancelledTitle:'スキャンをキャンセルしました', errorTitle:'スキャンが中断されました',
      idleSub:'スキャンの深さを選び、Android が Bearagnostic に許可している範囲だけを確認します。', runningSub:'まず端末内の実データを正確に把握し、その後で整理する内容を判断します。', doneSub:'アクセス可能なファイルを端末内で確認しました。ファイルは削除していません。', cancelledSub:'ファイルは削除されていません。いつでも再開できます。', errorSub:'ファイルは変更されていません。もう一度スキャンできます。',
      stagePreparing:'準備',stagePreparingSub:'準備中',stageFiles:'ファイル',stageFilesSub:'情報を確認',stageDuplicates:'重複',stageDuplicatesSub:'完全一致を確認',stageFinalizing:'仕上げ',stageFinalizingSub:'結果を整理',skipped:'スキップ',
      ready:'準備完了',scanning:'スキャン中',verify:'検証中',final:'仕上げ',done:'完了',errorLabel:'エラー',stopLabel:'停止',filesReviewed:'確認済みファイル',duplicatesPending:'重複の検証',duplicateCandidates:'重複候補',exactDuplicates:'完全一致の重複コピー',notChecked:'未確認',largeFiles:'大きなファイル',olderFiles:'古いファイル',
      quoteIdle:'ファイルはあなたのもの。Bearagnostic は判断材料を見やすくするだけです。',quoteRunning:'丁寧に確認中。良い診断は急ぎません。',quoteDone:'完了しました。表示している数値はこの端末で実際に確認した結果です。',quoteCancelled:'安全に停止しました。ファイルは削除していません。',quoteError:'推測はしません。完了できなければ、そのままお伝えします。',
      localTitle:'端末内で完結',localBody:'ファイル解析はこの端末内で行います。Android が保護するアプリ専用領域は対象外です。',checkingAccess:'アクセス確認中',accessReady:'アクセス準備完了',accessNeeded:'アクセス許可が必要',
      allowAccess:'ストレージアクセスを許可',startSmart:'Smart スキャンを開始',startQuick:'Quick スキャンを開始',startDeep:'Deep スキャンを開始',startCustom:'Custom スキャンを開始',cancelScan:'スキャンをキャンセル',runAgain:'同じスキャンをもう一度',tryAgain:'もう一度試す',
      scanDepth:'スキャンの深さ',chooseMode:'スキャンの詳しさを選択',smart:'Smart',smartDesc:'全体のメタデータを確認し、重要な場所で重複を検証します。',quick:'Quick',quickDesc:'重要な共有領域をすばやく確認し、完全一致の重複検証は行いません。',deep:'Deep',deepDesc:'アクセス可能な範囲を最も詳しく確認し、完全一致の重複を検証します。',custom:'Custom',customDesc:'対象の場所と重複検証の有無を自分で選べます。',recommended:'推奨',
      smartChip:'Smart Scan',smartChipSub:'おすすめのバランス',quickChip:'Quick Scan',quickChipSub:'重要箇所を高速確認',deepChip:'Deep Scan',deepChipSub:'最も詳細',customChip:'Custom Scan',customChipSub:'対象を自分で選択',
      customTitle:'確認する場所を選択',downloads:'ダウンロード',photos:'写真',videos:'動画',documents:'書類',music:'音楽',verifyExact:'完全一致の重複を検証',verifyExactDesc:'同じサイズの候補に絞ってから SHA-256 を使用します。',useCustom:'Custom Scan を使用',selectOne:'1つ以上選択してください。',
      privacy:'プライバシーと範囲',aboutScan:'このスキャンについて',infoLocal:'ファイルはこの端末内で解析され、現在の構成ではアップロードされません。',accessibleOnly:'アクセス可能な範囲のみ',accessibleOnlyDesc:'Android が保護するアプリ専用領域や root が必要な領域は対象外です。',readOnly:'読み取り専用スキャン',readOnlyDesc:'このビルドは確認と結果表示のみで、ファイル削除は行いません。',
      duplicateSpace:'検証済み重複容量',duplicateSpaceBody:'{bytes} は確認後に削減できる可能性があります。まだ削除は行っていません。',quickResult:'Quick Scan は完了しました。完全一致の重複検証は行っていません。',runningTip:'{mode} を端末内で実行中。現在 {count} ファイルを確認済みです。',completeTip:'スキャン完了',cancelledTip:'安全に停止しました',errorTip:'スキャンを完了できませんでした'
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
  const fmt = (template, vars={}) => Object.keys(vars).reduce((out,key)=>out.replaceAll(`{${key}}`, String(vars[key])), template);
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });

  const $ = id => document.getElementById(id);
  const appShell=$('appShell'), modeChip=$('modeChip'), modeChipTitle=$('modeChipTitle'), modeChipSub=$('modeChipSub');
  const primaryButton=$('primaryButton'), primaryTitle=$('primaryTitle'), buildLabel=$('buildLabel'), accessPill=$('accessPill');
  const titleText=$('scanTitleText'), subtitle=$('scanSubtitle'), scanKicker=$('scanKicker'), scanQuote=$('scanQuote');
  const ring=$('scanRing'), ringValue=$('ringValue'), ringLabel=$('ringLabel'), ringStroke=$('scanRingValue'), railProgress=$('scanRailProgress');
  const reviewed=$('reviewedFiles'), duplicateFiles=$('duplicateFiles'), duplicateLabel=$('duplicateLabel'), large=$('largeFiles'), older=$('olderFiles');
  const tipTitle=$('tipTitle'), tipBody=$('tipBody'), duplicateStageSub=$('duplicateStageSub');
  const sheetBackdrop=$('sheetBackdrop'), modeSheet=$('modeSheet'), customSheet=$('customSheet'), infoSheet=$('infoSheet');
  const verifyDuplicates=$('verifyDuplicates');
  const stageEls=[...document.querySelectorAll('.scan-stage')];
  const scopeInputs=[...document.querySelectorAll('.scope-grid input[type="checkbox"]')];

  let nativeState={broadStorageAccess:false,scannerReady:false,scannerRunning:false};
  let selectedMode='smart';
  let lastResult=null;
  let terminal='idle';
  const RING=289.03;

  function modeMeta(mode=selectedMode){
    const map={
      smart:[t('smartChip'),t('smartChipSub'),'SMART',true],
      quick:[t('quickChip'),t('quickChipSub'),'QUICK',false],
      deep:[t('deepChip'),t('deepChipSub'),'DEEP',true],
      custom:[t('customChip'),t('customChipSub'),'CUSTOM',Boolean(verifyDuplicates.checked)]
    };
    return map[mode] || map.smart;
  }
  function formatNumber(v){ return new Intl.NumberFormat(lang==='th'?'th-TH':lang==='ja'?'ja-JP':'en-US').format(Number(v||0)); }
  function formatBytes(v){
    let n=Number(v||0); if(!Number.isFinite(n)||n<=0) return '0 B';
    const u=['B','KB','MB','GB','TB']; let i=0; while(n>=1024&&i<u.length-1){n/=1024;i++;}
    return `${n.toFixed(i>=3?2:i>=2?1:0)} ${u[i]}`;
  }
  function parse(raw){ if(!raw)return null;if(typeof raw==='object')return raw;try{return JSON.parse(raw)}catch(_){return null} }

  function setMode(mode){
    selectedMode=mode;
    appShell.dataset.mode=mode;
    const m=modeMeta();
    modeChipTitle.textContent=m[0]; modeChipSub.textContent=m[1];
    ringValue.textContent=m[2]; ringLabel.textContent=t('ready');
    duplicateStageSub.textContent=m[3]?t('stageDuplicatesSub'):t('skipped');
    stageEls.find(el=>el.dataset.stage==='duplicates')?.classList.toggle('is-skipped',!m[3]);
    document.querySelectorAll('.mode-option').forEach(el=>el.classList.toggle('is-selected',el.dataset.mode===mode));
    if(terminal==='idle') renderIdle();
  }

  function openSheet(sheet){
    [modeSheet,customSheet,infoSheet].forEach(s=>s.hidden=true);
    sheetBackdrop.hidden=false; sheet.hidden=false;
  }
  function closeSheets(){ sheetBackdrop.hidden=true; [modeSheet,customSheet,infoSheet].forEach(s=>s.hidden=true); }

  function resetStages(){
    stageEls.forEach(el=>{el.classList.remove('is-done','is-active');});
    const verify=modeMeta()[3];
    stageEls.find(el=>el.dataset.stage==='duplicates')?.classList.toggle('is-skipped',!verify);
    railProgress.style.width='0%';
  }
  function stageIndex(phase){
    return {preparing:0,files:1,duplicates:2,finalizing:3}[phase] ?? 0;
  }
  function renderStage(phase){
    const idx=stageIndex(phase);
    const verify=modeMeta()[3];
    stageEls.forEach((el,i)=>{
      const isDup=el.dataset.stage==='duplicates';
      const skipped=isDup&&!verify;
      el.classList.toggle('is-skipped',skipped);
      el.classList.toggle('is-active',i===idx&&!skipped);
      el.classList.toggle('is-done',i<idx&&!skipped);
    });
    railProgress.style.width=`${[0,33.333,66.666,100][idx]}%`;
  }

  function ringIndeterminate(label=t('scanning')){
    ring.classList.add('is-indeterminate'); ringStroke.style.strokeDashoffset='220';
    ringValue.textContent='•••'; ringLabel.textContent=label;
  }
  function ringMeasured(pct){
    const p=Math.max(0,Math.min(100,Number(pct)||0)); ring.classList.remove('is-indeterminate');
    ringStroke.style.strokeDashoffset=String(RING*(1-p/100)); ringValue.textContent=`${Math.round(p)}%`; ringLabel.textContent=t('verify');
  }
  function ringComplete(){
    ring.classList.remove('is-indeterminate'); ringStroke.style.strokeDashoffset='0'; ringValue.textContent='✓'; ringLabel.textContent=t('done');
  }

  function setAccessUI(){
    const granted=Boolean(nativeState.broadStorageAccess);
    accessPill.textContent=granted?t('accessReady'):t('accessNeeded');
    accessPill.classList.toggle('good',granted);
  }

  function renderIdle(){
    terminal='idle'; appShell.dataset.state='idle'; modeChip.disabled=false; resetStages(); setAccessUI();
    scanKicker.textContent=t('kicker'); titleText.textContent=t('idleTitle'); subtitle.textContent=t('idleSub'); scanQuote.textContent=t('quoteIdle');
    reviewed.textContent='0'; large.textContent='0'; older.textContent='0'; duplicateFiles.textContent='—'; duplicateLabel.textContent=t('duplicatesPending');
    tipTitle.textContent=t('localTitle'); tipBody.textContent=t('localBody');
    const m=modeMeta(); ring.classList.remove('is-indeterminate'); ringStroke.style.strokeDashoffset='220'; ringValue.textContent=m[2]; ringLabel.textContent=t('ready');
    primaryTitle.textContent=nativeState.broadStorageAccess?({smart:t('startSmart'),quick:t('startQuick'),deep:t('startDeep'),custom:t('startCustom')}[selectedMode]):t('allowAccess');
  }

  function renderProgress(payload){
    terminal='running'; appShell.dataset.state='running'; modeChip.disabled=true; setAccessUI();
    titleText.textContent=t('runningTitle'); subtitle.textContent=t('runningSub'); scanQuote.textContent=t('quoteRunning');
    reviewed.textContent=formatNumber(payload.reviewedFiles); large.textContent=formatNumber(payload.largeFiles); older.textContent=formatNumber(payload.olderFiles);
    renderStage(payload.phase||'preparing');
    const verify=modeMeta()[3];
    if(verify){
      duplicateFiles.textContent=formatNumber(payload.duplicateCandidateFiles||0);
      duplicateLabel.textContent=t('duplicateCandidates');
    }else{
      duplicateFiles.textContent='—'; duplicateLabel.textContent=t('notChecked');
    }
    const candidate=Number(payload.duplicateCandidateBytes||0), hashed=Number(payload.hashedBytes||0);
    if(payload.phase==='duplicates'&&candidate>0) ringMeasured((hashed/candidate)*100);
    else if(payload.phase==='finalizing'){ ringIndeterminate(t('final')); }
    else ringIndeterminate(t('scanning'));
    tipTitle.textContent=modeMeta()[0]; tipBody.textContent=fmt(t('runningTip'),{mode:modeMeta()[0],count:formatNumber(payload.reviewedFiles)});
    primaryTitle.textContent=t('cancelScan');
  }

  function renderComplete(payload){
    terminal='complete'; lastResult=payload; appShell.dataset.state='complete'; modeChip.disabled=false; setAccessUI();
    titleText.textContent=t('doneTitle'); subtitle.textContent=t('doneSub'); scanQuote.textContent=t('quoteDone');
    reviewed.textContent=formatNumber(payload.reviewedFiles); large.textContent=formatNumber(payload.largeFiles); older.textContent=formatNumber(payload.olderFiles);
    stageEls.forEach(el=>{el.classList.remove('is-active'); if(!el.classList.contains('is-skipped')) el.classList.add('is-done');}); railProgress.style.width='100%'; ringComplete();
    if(payload.duplicateVerificationPerformed){
      duplicateFiles.textContent=formatNumber(payload.duplicateCopies); duplicateLabel.textContent=t('exactDuplicates');
      tipTitle.textContent=t('duplicateSpace'); tipBody.textContent=fmt(t('duplicateSpaceBody'),{bytes:formatBytes(payload.duplicateReclaimableBytes)});
    }else{
      duplicateFiles.textContent='—'; duplicateLabel.textContent=t('notChecked'); tipTitle.textContent=t('completeTip'); tipBody.textContent=t('quickResult');
    }
    primaryTitle.textContent=t('runAgain');
  }

  function renderTerminal(kind){
    terminal=kind; appShell.dataset.state=kind; modeChip.disabled=false; setAccessUI(); resetStages();
    const error=kind==='error';
    titleText.textContent=t(error?'errorTitle':'cancelledTitle'); subtitle.textContent=t(error?'errorSub':'cancelledSub'); scanQuote.textContent=t(error?'quoteError':'quoteCancelled');
    ring.classList.remove('is-indeterminate'); ringStroke.style.strokeDashoffset='220'; ringValue.textContent=error?'!':'■'; ringLabel.textContent=t(error?'errorLabel':'stopLabel');
    tipTitle.textContent=t(error?'errorTip':'cancelledTip'); tipBody.textContent=t('localBody'); primaryTitle.textContent=t('tryAgain');
  }

  function setNativeState(state){
    nativeState={...nativeState,...(state||{})}; setAccessUI();
    if(nativeState.versionName) buildLabel.textContent=`BEARAGNOSTIC · ${nativeState.versionName} · BRIDGE ${nativeState.bridgeVersion??3}`;
    if(!nativeState.scannerRunning&&terminal==='idle') renderIdle();
  }
  function readNative(){
    try{ const state=parse(window.BearagnosticNative?.getNativeState?.()); if(state)setNativeState(state); }
    catch(_){ setNativeState({broadStorageAccess:false,scannerReady:false}); }
  }

  window.BearagnosticAndroid=Object.freeze({
    onNativeStateChanged(state){ const p=parse(state); if(p)setNativeState(p); },
    onScanProgress(payload){ const p=parse(payload); if(p){ if(p.scanMode)selectedMode=p.scanMode; renderProgress(p); } },
    onScanComplete(payload){ const p=parse(payload); if(p){ if(p.scanMode)selectedMode=p.scanMode; renderComplete(p); } },
    onScanCancelled(){ renderTerminal('cancelled'); },
    onScanError(){ renderTerminal('error'); }
  });

  modeChip.addEventListener('click',()=>{ if(terminal!=='running')openSheet(modeSheet); });
  $('modeClose').addEventListener('click',closeSheets); $('customClose').addEventListener('click',closeSheets); $('infoClose').addEventListener('click',closeSheets); sheetBackdrop.addEventListener('click',closeSheets);
  $('infoButton').addEventListener('click',()=>openSheet(infoSheet));
  document.querySelectorAll('.mode-option').forEach(btn=>btn.addEventListener('click',()=>{
    const mode=btn.dataset.mode;
    if(mode==='custom'){ closeSheets(); openSheet(customSheet); return; }
    setMode(mode); closeSheets();
  }));
  $('customSave').addEventListener('click',()=>{
    const scopes=scopeInputs.filter(i=>i.checked);
    if(!scopes.length){ $('customSave').textContent=t('selectOne'); setTimeout(()=>$('customSave').textContent=t('useCustom'),1200); return; }
    setMode('custom'); closeSheets();
  });
  verifyDuplicates.addEventListener('change',()=>{ if(selectedMode==='custom')setMode('custom'); });

  primaryButton.addEventListener('click',()=>{
    try{
      if(terminal==='running'){ window.BearagnosticNative?.cancelOneTapScan?.(); return; }
      if(!nativeState.broadStorageAccess){ window.BearagnosticNative?.requestBroadStorageAccess?.(); return; }
      const scopes=selectedMode==='custom'?scopeInputs.filter(i=>i.checked).map(i=>i.value):[];
      const verify=selectedMode==='custom'?Boolean(verifyDuplicates.checked):selectedMode!=='quick';
      const response=parse(window.BearagnosticNative?.startScan?.(selectedMode,JSON.stringify(scopes),verify));
      if(response?.accepted){
        lastResult=null; renderProgress({state:'running',phase:'preparing',scanMode:selectedMode,reviewedFiles:0,largeFiles:0,olderFiles:0,duplicateCandidateFiles:0});
      }else if(response?.reason==='storage_access_required'){
        nativeState.broadStorageAccess=false; renderIdle();
      }
    }catch(_){ renderTerminal('error'); }
  });

  document.addEventListener('visibilitychange',()=>{if(!document.hidden)readNative();});
  setMode('smart'); readNative();
})();
