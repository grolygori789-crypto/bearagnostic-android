(() => {
  'use strict';

  const COPY = {
    en: {
      kicker:'SMART FILE HEALTH',headline:'Choose the depth.<br><em>Keep the control.</em>',intro:'Scan locally with the balance of speed and detail that fits what you need.',
      scanDepth:'SCAN DEPTH',chooseScan:'Choose how Bearagnostic scans',smartRecommended:'SMART RECOMMENDED',smart:'Smart',smartSub:'Full metadata scan, focused duplicate verification',quick:'Quick',quickSub:'Fast check of high-value locations',deep:'Deep',deepSub:'Most thorough scan and exact duplicate verification',custom:'Custom',customSub:'Choose locations and duplicate verification',
      customLocations:'Locations',customHint:'Select at least one',downloads:'Downloads',photos:'Photos',videos:'Videos',documents:'Documents',music:'Music',verifyExact:'Verify exact duplicates',verifyExactSub:'Uses streaming SHA-256 only on same-size candidates',
      systemStatus:'SYSTEM STATUS',nativeReady:'Native scanner ready',nativeBridge:'Native bridge',nativeBridgeSub:'Local UI ↔ Android communication',ready:'Ready',storageAccess:'Storage access',storageAccessSub:'Permission for user-accessible shared files',notGranted:'Not granted',granted:'Granted',scannerEngine:'Scanner engine',scannerEngineSub:'Metadata + optional SHA-256 verification',scanningState:'Scanning',
      checkup:'CHECKUP',scanning:'Scanning accessible files',complete:'Scan complete',cancelled:'Scan cancelled',error:'Scan could not finish',progressTruth:'Discovery stays indeterminate; measured progress appears only when duplicate hashing has a known byte total.',filesReviewed:'files reviewed',largeFiles:'large files',olderFiles:'older files',duplicateCopies:'exact duplicate copies',duplicateSpace:'verified duplicate space that may be reclaimable after review',duplicatesNotChecked:'Exact duplicates were not checked in this scan.',notChecked:'Not checked',cancelScan:'Cancel scan',
      privacyTitle:'Local by design',privacyBody:'File analysis stays on this device. This scanner does not upload or delete files.',prepareAccess:'Prepare device access',prepareAccessSub:'Android will show the system permission screen',startSmart:'Start Smart Scan',startQuick:'Start Quick Scan',startDeep:'Start Deep Scan',startCustom:'Start Custom Scan',scanSelectedSub:'Run the selected scan locally now',scanningButton:'Scan in progress…',scanningButtonSub:'Bearagnostic is working locally on this device',runAgain:'Run this scan again',runAgainSub:'Refresh these file-health results',scopeNote:'Scope: user-accessible shared storage only. Android-protected app-private areas remain out of scope.',
      phasePreparing:'PREPARING',phaseFiles:'FILES',phaseDuplicates:'DUPLICATES',phaseFinalizing:'FINALIZING',phaseComplete:'COMPLETE',phaseCancelled:'CANCELLED',phaseError:'ERROR'
    },
    ja: {
      kicker:'スマート・ファイルヘルス',headline:'深さを選ぶ。<br><em>操作はあなたの手に。</em>',intro:'必要に合わせて、速さと詳しさのバランスを選び、端末内でスキャンします。',
      scanDepth:'スキャンの深さ',chooseScan:'スキャン方法を選択',smartRecommended:'SMART 推奨',smart:'Smart',smartSub:'全体のメタデータ確認＋重要箇所の重複検証',quick:'Quick',quickSub:'重要な場所をすばやく確認',deep:'Deep',deepSub:'最も詳細な確認＋完全一致の重複検証',custom:'Custom',customSub:'対象と重複検証を自分で選択',
      customLocations:'対象',customHint:'1つ以上選択',downloads:'ダウンロード',photos:'写真',videos:'動画',documents:'書類',music:'音楽',verifyExact:'完全一致の重複を検証',verifyExactSub:'同じサイズの候補だけをストリーミング SHA-256 で確認します',
      systemStatus:'SYSTEM STATUS',nativeReady:'ネイティブスキャナー準備完了',nativeBridge:'ネイティブブリッジ',nativeBridgeSub:'ローカル UI ↔ Android 通信',ready:'準備完了',storageAccess:'ストレージアクセス',storageAccessSub:'ユーザーがアクセス可能な共有ファイルへの権限',notGranted:'未許可',granted:'許可済み',scannerEngine:'スキャンエンジン',scannerEngineSub:'メタデータ解析＋必要に応じた SHA-256 検証',scanningState:'スキャン中',
      checkup:'CHECKUP',scanning:'アクセス可能なファイルをスキャン中',complete:'スキャン完了',cancelled:'スキャンをキャンセルしました',error:'スキャンを完了できませんでした',progressTruth:'探索中は総量が不明なため割合を表示せず、重複ハッシュの総バイト数が分かる場合だけ実測進捗を表示します。',filesReviewed:'確認済みファイル',largeFiles:'大きなファイル',olderFiles:'古いファイル',duplicateCopies:'完全一致の重複コピー',duplicateSpace:'確認後に削減できる可能性がある検証済み重複容量',duplicatesNotChecked:'このスキャンでは完全一致の重複確認を行っていません。',notChecked:'未確認',cancelScan:'スキャンをキャンセル',
      privacyTitle:'ローカル設計',privacyBody:'ファイル解析はこの端末内で行います。このスキャナーはファイルをアップロードも削除もしません。',prepareAccess:'端末アクセスを準備',prepareAccessSub:'Android のシステム権限画面を開きます',startSmart:'Smart スキャンを開始',startQuick:'Quick スキャンを開始',startDeep:'Deep スキャンを開始',startCustom:'Custom スキャンを開始',scanSelectedSub:'選択した方法で端末内スキャンを開始',scanningButton:'スキャン中…',scanningButtonSub:'Bearagnostic がこの端末内で処理しています',runAgain:'同じスキャンをもう一度',runAgainSub:'ファイルヘルス結果を更新します',scopeNote:'対象はユーザーがアクセス可能な共有ストレージのみです。Android が保護するアプリ専用領域は対象外です。',
      phasePreparing:'準備中',phaseFiles:'ファイル',phaseDuplicates:'重複確認',phaseFinalizing:'最終処理',phaseComplete:'完了',phaseCancelled:'キャンセル',phaseError:'エラー'
    },
    th: {
      kicker:'SMART FILE HEALTH',headline:'เลือกความละเอียด<br><em>ควบคุมได้ตามต้องการ</em>',intro:'เลือกสมดุลระหว่างความเร็วและความละเอียด แล้วให้ Bearagnostic ตรวจไฟล์ภายในเครื่อง',
      scanDepth:'ระดับการสแกน',chooseScan:'เลือกวิธีที่ต้องการสแกน',smartRecommended:'แนะนำ SMART',smart:'Smart',smartSub:'ตรวจ metadata ทั้งพื้นที่ พร้อมยืนยันไฟล์ซ้ำในจุดสำคัญ',quick:'Quick',quickSub:'ตรวจเร็วในตำแหน่งที่มีโอกาสพบไฟล์ขยะสูง',deep:'Deep',deepSub:'ตรวจละเอียดที่สุด พร้อมยืนยันไฟล์ซ้ำแบบตรงกันจริง',custom:'Custom',customSub:'เลือกตำแหน่งและการยืนยันไฟล์ซ้ำเอง',
      customLocations:'ตำแหน่งที่ตรวจ',customHint:'เลือกอย่างน้อย 1 รายการ',downloads:'ดาวน์โหลด',photos:'รูปภาพ',videos:'วิดีโอ',documents:'เอกสาร',music:'เพลง',verifyExact:'ยืนยันไฟล์ซ้ำแบบตรงกันจริง',verifyExactSub:'ใช้ SHA-256 แบบ streaming เฉพาะไฟล์ที่มีขนาดเท่ากัน',
      systemStatus:'SYSTEM STATUS',nativeReady:'Native scanner พร้อมแล้ว',nativeBridge:'Native bridge',nativeBridgeSub:'เชื่อม UI ในเครื่อง ↔ Android',ready:'พร้อม',storageAccess:'สิทธิ์เข้าถึงไฟล์',storageAccessSub:'สิทธิ์สำหรับ shared storage ที่ผู้ใช้เข้าถึงได้',notGranted:'ยังไม่อนุญาต',granted:'อนุญาตแล้ว',scannerEngine:'Scanner engine',scannerEngineSub:'วิเคราะห์ metadata + ยืนยัน SHA-256 เมื่อจำเป็น',scanningState:'กำลังสแกน',
      checkup:'CHECKUP',scanning:'กำลังสแกนไฟล์ที่เข้าถึงได้',complete:'สแกนเสร็จแล้ว',cancelled:'ยกเลิกการสแกนแล้ว',error:'สแกนไม่สำเร็จ',progressTruth:'ช่วงค้นหาไฟล์ไม่แสดงเปอร์เซ็นต์ปลอม และจะแสดงความคืบหน้าแบบวัดจริงเมื่อทราบจำนวนไบต์ที่ต้อง hash',filesReviewed:'ไฟล์ที่ตรวจแล้ว',largeFiles:'ไฟล์ขนาดใหญ่',olderFiles:'ไฟล์เก่า',duplicateCopies:'สำเนาซ้ำที่ตรงกันจริง',duplicateSpace:'พื้นที่ไฟล์ซ้ำที่ยืนยันแล้วและอาจเรียกคืนได้หลังตรวจทาน',duplicatesNotChecked:'การสแกนครั้งนี้ไม่ได้ตรวจยืนยันไฟล์ซ้ำแบบตรงกันจริง',notChecked:'ไม่ได้ตรวจ',cancelScan:'ยกเลิกการสแกน',
      privacyTitle:'ทำงานในเครื่องเป็นหลัก',privacyBody:'การวิเคราะห์ไฟล์อยู่ภายในเครื่องนี้ Scanner ไม่อัปโหลดหรือลบไฟล์',prepareAccess:'เตรียมสิทธิ์เข้าถึงไฟล์',prepareAccessSub:'Android จะเปิดหน้าสิทธิ์ของระบบให้อนุญาต',startSmart:'เริ่ม Smart Scan',startQuick:'เริ่ม Quick Scan',startDeep:'เริ่ม Deep Scan',startCustom:'เริ่ม Custom Scan',scanSelectedSub:'เริ่มสแกนตามรูปแบบที่เลือกภายในเครื่อง',scanningButton:'กำลังสแกน…',scanningButtonSub:'Bearagnostic กำลังทำงานภายในเครื่องนี้',runAgain:'สแกนแบบเดิมอีกครั้ง',runAgainSub:'อัปเดตผลสุขภาพไฟล์ล่าสุด',scopeNote:'ขอบเขต: shared storage ที่ผู้ใช้เข้าถึงได้เท่านั้น พื้นที่ส่วนตัวของแอพที่ Android ป้องกันยังอยู่นอกขอบเขต',
      phasePreparing:'เตรียมระบบ',phaseFiles:'ตรวจไฟล์',phaseDuplicates:'ตรวจไฟล์ซ้ำ',phaseFinalizing:'สรุปผล',phaseComplete:'เสร็จแล้ว',phaseCancelled:'ยกเลิก',phaseError:'ผิดพลาด'
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

  const $ = (id) => document.getElementById(id);
  const storageState=$('storageState'),scannerState=$('scannerState'),primaryButton=$('primaryButton'),primaryTitle=$('primaryTitle'),primarySub=$('primarySub'),buildLabel=$('buildLabel');
  const scanCard=$('scanCard'),scanTitle=$('scanTitle'),scanPhase=$('scanPhase'),scanModeLabel=$('scanModeLabel'),progressTrack=$('progressTrack'),progressFill=$('progressFill');
  const reviewedFiles=$('reviewedFiles'),largeFiles=$('largeFiles'),olderFiles=$('olderFiles'),duplicateCopies=$('duplicateCopies'),resultLine=$('resultLine'),reclaimable=$('reclaimable'),resultDescription=$('resultDescription'),cancelButton=$('cancelButton');
  const customPanel=$('customPanel'),verifyDuplicates=$('verifyDuplicates');
  const modeButtons=[...document.querySelectorAll('.mode-choice')];
  const scopeInputs=[...document.querySelectorAll('.scope-grid input[type="checkbox"]')];

  let nativeState={broadStorageAccess:false,scannerReady:false,scannerRunning:false};
  let selectedMode='smart';
  let lastResult=null;

  function formatNumber(value){return new Intl.NumberFormat(lang==='th'?'th-TH':lang==='ja'?'ja-JP':'en-US').format(Number(value||0));}
  function formatBytes(value){let bytes=Number(value||0);if(!Number.isFinite(bytes)||bytes<=0)return'0 B';const units=['B','KB','MB','GB','TB'];let unit=0;while(bytes>=1024&&unit<units.length-1){bytes/=1024;unit+=1;}const digits=unit>=3?2:unit>=2?1:0;return`${bytes.toFixed(digits)} ${units[unit]}`;}
  function modeText(mode){return t({smart:'smart',quick:'quick',deep:'deep',custom:'custom'}[mode]||'smart');}
  function startKey(mode){return{smart:'startSmart',quick:'startQuick',deep:'startDeep',custom:'startCustom'}[mode]||'startSmart';}

  function selectMode(mode){
    if(nativeState.scannerRunning)return;
    selectedMode=['smart','quick','deep','custom'].includes(mode)?mode:'smart';
    modeButtons.forEach((button)=>{const selected=button.dataset.mode===selectedMode;button.classList.toggle('is-selected',selected);button.setAttribute('aria-pressed',String(selected));});
    customPanel.hidden=selectedMode!=='custom';
    lastResult=null;
    setPrimaryMode();
  }

  function selectedScopes(){return scopeInputs.filter((input)=>input.checked).map((input)=>input.value);}
  function ensureCustomScope(){if(selectedMode!=='custom')return true;if(selectedScopes().length>0)return true;scopeInputs[0].checked=true;return true;}

  function setPrimaryMode(){
    const granted=Boolean(nativeState.broadStorageAccess),running=Boolean(nativeState.scannerRunning);
    primaryButton.disabled=running;primaryButton.classList.toggle('is-ready',granted&&!running);primaryButton.classList.toggle('is-busy',running);
    modeButtons.forEach((button)=>{button.disabled=running;});
    if(running){primaryTitle.textContent=t('scanningButton');primarySub.textContent=t('scanningButtonSub');}
    else if(!granted){primaryTitle.textContent=t('prepareAccess');primarySub.textContent=t('prepareAccessSub');}
    else if(lastResult){primaryTitle.textContent=t('runAgain');primarySub.textContent=t('runAgainSub');}
    else{primaryTitle.textContent=t(startKey(selectedMode));primarySub.textContent=t('scanSelectedSub');}
  }

  function setState(state){
    nativeState={...nativeState,...(state||{})};const granted=Boolean(nativeState.broadStorageAccess),running=Boolean(nativeState.scannerRunning);
    storageState.textContent=granted?t('granted'):t('notGranted');storageState.classList.toggle('good',granted);
    scannerState.textContent=running?t('scanningState'):t('ready');scannerState.classList.toggle('busy',running);
    if(nativeState.versionName)buildLabel.textContent=`Bearagnostic for Android · ${nativeState.versionName} · Bridge ${nativeState.bridgeVersion??3}`;
    setPrimaryMode();
  }

  function phaseLabel(phase){const key={preparing:'phasePreparing',files:'phaseFiles',duplicates:'phaseDuplicates',finalizing:'phaseFinalizing',complete:'phaseComplete',cancelled:'phaseCancelled',error:'phaseError'}[phase];return key?t(key):String(phase||'').toUpperCase();}
  function showScan(payload){scanCard.hidden=false;reviewedFiles.textContent=formatNumber(payload.reviewedFiles);largeFiles.textContent=formatNumber(payload.largeFiles);olderFiles.textContent=formatNumber(payload.olderFiles);scanPhase.textContent=phaseLabel(payload.phase||payload.state);scanModeLabel.textContent=modeText(payload.scanMode||selectedMode).toUpperCase();}

  function renderProgress(payload){
    nativeState.scannerRunning=true;scanTitle.textContent=t('scanning');resultLine.hidden=true;cancelButton.hidden=false;cancelButton.disabled=false;duplicateCopies.textContent='—';showScan(payload);
    const hashing=payload.phase==='duplicates'&&Number(payload.duplicateCandidateBytes)>0&&payload.duplicateVerificationEnabled!==false;
    progressTrack.classList.toggle('is-indeterminate',!hashing);
    if(hashing){const total=Number(payload.duplicateCandidateBytes||0),done=Math.min(total,Number(payload.hashedBytes||0));const pct=total>0?Math.max(0,Math.min(100,(done/total)*100)):0;progressFill.style.width=`${pct}%`;}
    else progressFill.style.width='34%';
    setPrimaryMode();
  }

  function renderComplete(payload){
    nativeState.scannerRunning=false;lastResult=payload;selectedMode=payload.scanMode||selectedMode;scanTitle.textContent=t('complete');showScan({...payload,phase:'complete'});cancelButton.hidden=true;progressTrack.classList.remove('is-indeterminate');progressFill.style.width='100%';
    if(payload.duplicateVerificationPerformed===false){duplicateCopies.textContent=t('notChecked');reclaimable.textContent='—';resultDescription.textContent=t('duplicatesNotChecked');resultLine.hidden=false;}
    else{duplicateCopies.textContent=formatNumber(payload.duplicateCopies);reclaimable.textContent=formatBytes(payload.duplicateReclaimableBytes);resultDescription.textContent=t('duplicateSpace');resultLine.hidden=false;}
    setPrimaryMode();
  }

  function renderTerminal(titleKey,phase){nativeState.scannerRunning=false;scanCard.hidden=false;scanTitle.textContent=t(titleKey);scanPhase.textContent=phaseLabel(phase);cancelButton.hidden=true;progressTrack.classList.remove('is-indeterminate');progressFill.style.width='0%';setPrimaryMode();}
  function parseNativeResult(raw){if(!raw)return null;if(typeof raw==='object')return raw;try{return JSON.parse(raw);}catch(_){return null;}}
  function readNativeState(){try{const raw=window.BearagnosticNative?.getNativeState?.();const state=parseNativeResult(raw);if(state)setState(state);}catch(_){setState({broadStorageAccess:false,scannerReady:false});}}

  window.BearagnosticAndroid=Object.freeze({
    onNativeStateChanged(state){const parsed=parseNativeResult(state);if(parsed)setState(parsed);},
    onScanProgress(payload){const parsed=parseNativeResult(payload);if(parsed)renderProgress(parsed);},
    onScanComplete(payload){const parsed=parseNativeResult(payload);if(parsed)renderComplete(parsed);},
    onScanCancelled(){renderTerminal('cancelled','cancelled');},
    onScanError(){renderTerminal('error','error');}
  });

  modeButtons.forEach((button)=>button.addEventListener('click',()=>selectMode(button.dataset.mode)));
  scopeInputs.forEach((input)=>input.addEventListener('change',()=>{lastResult=null;setPrimaryMode();}));
  verifyDuplicates.addEventListener('change',()=>{lastResult=null;setPrimaryMode();});

  primaryButton.addEventListener('click',()=>{
    try{
      if(!nativeState.broadStorageAccess){window.BearagnosticNative?.requestBroadStorageAccess?.();return;}
      ensureCustomScope();
      const scopes=selectedMode==='custom'?selectedScopes():[];
      const verify=selectedMode==='custom'?Boolean(verifyDuplicates.checked):selectedMode!=='quick';
      const bridge=window.BearagnosticNative;
      const raw=bridge?.startScan?bridge.startScan(selectedMode,JSON.stringify(scopes),verify):bridge?.startOneTapScan?.();
      const response=parseNativeResult(raw);
      if(response?.accepted){nativeState.scannerRunning=true;renderProgress({state:'running',phase:'preparing',scanMode:selectedMode,reviewedFiles:0,largeFiles:0,olderFiles:0,duplicateVerificationEnabled:verify});}
      else if(response?.reason==='storage_access_required'){nativeState.broadStorageAccess=false;setPrimaryMode();}
    }catch(_){}
  });

  cancelButton.addEventListener('click',()=>{try{window.BearagnosticNative?.cancelOneTapScan?.();}catch(_){}cancelButton.disabled=true;});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)readNativeState();});
  selectMode('smart');readNativeState();
})();
