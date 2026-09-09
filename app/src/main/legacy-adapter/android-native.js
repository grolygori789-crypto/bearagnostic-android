(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const BUILD = 14;
  const RING_LENGTH = 289.03;
  const PHASES = ['preparing','file_details','file_sizes','duplicates','modified_dates','finalizing'];
  const PHASE_RANGES = {
    preparing:[0,8], file_details:[8,28], file_sizes:[28,45],
    duplicates:[45,80], modified_dates:[80,94], finalizing:[94,100]
  };
  const TILE_KINDS = ['doc','image','video','audio','folder'];

  let nativeState = {};
  let running = false;
  let pendingRequest = null;
  let activeMode = 'smart';
  let lastProgress = null;
  let streamTimer = null;

  // Native Android is already installed. Prevent the legacy browser/PWA install sheet
  // without changing any of the approved launch, Home, navigation or Checkup markup.
  try { localStorage.setItem('bearagnostic.install.dismissed.b11', '1'); } catch (_) {}

  const byId = (id) => document.getElementById(id);
  const qsa = (sel, root=document) => [...root.querySelectorAll(sel)];
  const toast = (message) => window.BearagnosticAppAPI?.showToast?.(message);

  function parseJson(value, fallback={}) {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  }

  function currentLanguage() {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
  }

  const COPY = {
    en:{
      eyebrow:'SCAN DEPTH', title:'Choose how deeply to scan', lead:'The original Bearagnostic experience stays unchanged. Choose only how much native analysis to perform.',
      smart:'Smart Scan', smartSub:'All accessible shared storage, content sampling and focused verified duplicates.', smartBadge:'RECOMMENDED',
      quick:'Quick Scan', quickSub:'Priority shared folders and metadata. Fast by design.',
      deep:'Deep Scan', deepSub:'All accessible shared storage, full streaming content read and exact duplicate verification.',
      custom:'Custom Scan', customSub:'Choose shared-storage categories and duplicate verification.',
      cancel:'Cancel', customTitle:'Custom Scan', downloads:'Downloads', photos:'Photos', videos:'Videos', documents:'Documents', music:'Music', verify:'Verify exact duplicates', start:'Start Custom Scan',
      permission:'Allow storage access in Android settings to start this scan.', busy:'A scan is already running.', failed:'Bearagnostic could not finish this checkup.', cancelled:'Checkup cancelled.',
      ready:'READY', scanning:'SCANNING', complete:'COMPLETE', idleTitle:'Ready for a checkup', idleSub:'Choose a scan mode. Dr. Bear checks only storage Android allows.', runningTitle:'Checking things out', runningSub:'A cleaner device leads to brighter days.', doneTitle:'Checkup complete', doneSub:'The accessible scope for this scan has been reviewed locally.',
      quoteIdle:'Your files. Your choice.', quoteRunning:'Looking carefully. Bears don’t rush diagnostics.', quoteDone:'All done. The numbers shown come from the native scan.',
      tip:'Bearagnostic analyzes accessible files locally on this device.'
    },
    th:{
      eyebrow:'ระดับการสแกน', title:'เลือกความละเอียดในการสแกน', lead:'หน้าตา Bearagnostic ต้นฉบับยังคงเดิม เลือกเฉพาะระดับการวิเคราะห์จริงของตัวสแกน Android',
      smart:'Smart Scan', smartSub:'ตรวจ shared storage ที่เข้าถึงได้ อ่านตัวอย่างเนื้อหา และยืนยันไฟล์ซ้ำในจุดสำคัญ', smartBadge:'แนะนำ',
      quick:'Quick Scan', quickSub:'ตรวจโฟลเดอร์สำคัญและ metadata เน้นความเร็ว',
      deep:'Deep Scan', deepSub:'ตรวจ shared storage ที่เข้าถึงได้ทั้งหมด อ่านเนื้อหาแบบ streaming จนครบ และยืนยันไฟล์ซ้ำแบบ exact',
      custom:'Custom Scan', customSub:'เลือกหมวด shared storage และกำหนดว่าจะยืนยันไฟล์ซ้ำหรือไม่',
      cancel:'ยกเลิก', customTitle:'Custom Scan', downloads:'ดาวน์โหลด', photos:'รูปภาพ', videos:'วิดีโอ', documents:'เอกสาร', music:'เพลง', verify:'ยืนยันไฟล์ซ้ำแบบ exact', start:'เริ่ม Custom Scan',
      permission:'ต้องอนุญาตสิทธิ์เข้าถึงไฟล์ใน Settings ของ Android ก่อนเริ่มสแกน', busy:'มีการสแกนทำงานอยู่แล้ว', failed:'Bearagnostic ตรวจไม่สำเร็จ', cancelled:'ยกเลิกการตรวจแล้ว',
      ready:'พร้อม', scanning:'กำลังตรวจ', complete:'เสร็จแล้ว', idleTitle:'พร้อมตรวจเครื่องแล้ว', idleSub:'เลือกโหมดสแกน คุณหมอแบร์จะตรวจเฉพาะพื้นที่ที่ Android อนุญาต', runningTitle:'กำลังตรวจอย่างละเอียด', runningSub:'เครื่องที่เป็นระเบียบขึ้น ก็ทำให้ทุกอย่างลื่นขึ้น', doneTitle:'ตรวจเครื่องเรียบร้อย', doneSub:'ตรวจพื้นที่ที่ Android อนุญาตสำหรับรอบนี้แล้วภายในเครื่อง',
      quoteIdle:'ไฟล์ของคุณ คุณเป็นคนเลือก', quoteRunning:'กำลังดูให้ละเอียด การตรวจที่ดีไม่ต้องรีบ', quoteDone:'เรียบร้อย ตัวเลขทั้งหมดมาจากการสแกนจริง',
      tip:'Bearagnostic วิเคราะห์ไฟล์ที่เข้าถึงได้ภายในเครื่องนี้'
    },
    ja:{
      eyebrow:'スキャン深度', title:'スキャンの深さを選択', lead:'元の Bearagnostic 画面はそのままに、Android の実際の解析量だけを選びます。',
      smart:'Smart Scan', smartSub:'アクセス可能な共有ストレージ、内容サンプル、重要場所の重複検証。', smartBadge:'おすすめ',
      quick:'Quick Scan', quickSub:'主要フォルダとメタデータを高速確認。',
      deep:'Deep Scan', deepSub:'アクセス可能な共有ストレージ全体を最後まで読み、重複も完全一致で検証。',
      custom:'Custom Scan', customSub:'共有ストレージのカテゴリと重複検証を選択。',
      cancel:'キャンセル', customTitle:'Custom Scan', downloads:'ダウンロード', photos:'写真', videos:'動画', documents:'書類', music:'音楽', verify:'完全一致の重複を検証', start:'Custom Scan を開始',
      permission:'スキャンには Android のストレージアクセス許可が必要です。', busy:'すでにスキャン中です。', failed:'チェックを完了できませんでした。', cancelled:'チェックを中止しました。',
      ready:'準備完了', scanning:'チェック中', complete:'完了', idleTitle:'チェックの準備ができました', idleSub:'スキャン方法を選択してください。Android が許可する範囲のみ確認します。', runningTitle:'丁寧に確認中', runningSub:'端末をすっきり。毎日を軽やかに。', doneTitle:'チェック完了', doneSub:'アクセス可能な範囲を端末内で確認しました。',
      quoteIdle:'選ぶのは、あなた。', quoteRunning:'丁寧に確認中。診断は急ぎません。', quoteDone:'完了しました。表示値は実際のネイティブスキャン結果です。',
      tip:'Bearagnostic はアクセス可能なファイルを端末内で解析します。'
    }
  };
  const text = (key) => COPY[currentLanguage()]?.[key] || COPY.en[key] || key;

  function ensureStyle() {
    if (byId('androidNativeStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidNativeStyle';
    style.textContent = `
      .native-mode-sheet{position:fixed;inset:0;z-index:1400;display:grid;align-items:end;background:rgba(13,28,48,.28);backdrop-filter:blur(7px);padding:0 12px max(12px,env(safe-area-inset-bottom));}
      .native-mode-panel{width:min(100%,520px);margin:0 auto;background:rgba(250,253,255,.985);border:1px solid rgba(255,255,255,.98);border-radius:30px 30px 24px 24px;box-shadow:0 -18px 55px rgba(31,58,88,.18);padding:12px 16px 16px;color:#142238;}
      .native-mode-handle{width:42px;height:4px;border-radius:99px;background:#d5e0ea;margin:0 auto 13px;}
      .native-mode-eyebrow{display:block;font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:#7290aa;font-weight:750;margin-bottom:5px;}
      .native-mode-panel h2{font-size:22px;letter-spacing:-.025em;margin:0}.native-mode-lead{font-size:12px;line-height:1.4;color:#7f8a9a;margin:6px 0 12px;}
      .native-mode-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.native-mode-option{position:relative;text-align:left;padding:12px;border-radius:20px;background:#fff;border:1px solid rgba(98,129,158,.12);box-shadow:0 8px 22px rgba(70,105,140,.07);min-height:88px;}
      .native-mode-option strong{display:block;font-size:14px}.native-mode-option small{display:block;font-size:10px;line-height:1.32;color:#8794a2;margin-top:4px}.native-mode-badge{position:absolute;right:9px;top:8px;font-size:7px;letter-spacing:.08em;color:#168fdf;background:#eaf7fe;padding:4px 6px;border-radius:99px;font-weight:750;}
      .native-mode-cancel,.native-custom-start{width:100%;height:46px;border-radius:18px;margin-top:10px;font-weight:700}.native-mode-cancel{background:#edf3f8;color:#506276}.native-custom-start{background:linear-gradient(118deg,#22b6ed,#0b78ea);color:white;}
      .native-custom-list{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.native-check{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid rgba(98,129,158,.12);border-radius:15px;padding:10px;font-size:12px}.native-check input{accent-color:#138fec}.native-check--wide{grid-column:1/-1;}
      .scan-ring.is-native-indeterminate .scan-ring__value{animation:nativeRingSpin 1.05s linear infinite;stroke-dasharray:88 201!important;stroke-dashoffset:0!important;transform-origin:55px 55px}@keyframes nativeRingSpin{to{transform:rotate(360deg)}}
      .native-mode-sheet[hidden]{display:none!important}
    `;
    document.head.appendChild(style);
  }

  function sheetMarkup() {
    return `<section class="native-mode-sheet" id="nativeModeSheet" hidden aria-modal="true" role="dialog"><div class="native-mode-panel"><div class="native-mode-handle"></div><span class="native-mode-eyebrow" id="nativeModeEyebrow"></span><h2 id="nativeModeTitle"></h2><p class="native-mode-lead" id="nativeModeLead"></p><div class="native-mode-grid" id="nativeModeGrid"></div><button class="native-mode-cancel" id="nativeModeCancel" type="button"></button></div></section>`;
  }

  function renderModeSheet() {
    ensureStyle();
    if (!byId('nativeModeSheet')) document.body.insertAdjacentHTML('beforeend', sheetMarkup());
    byId('nativeModeEyebrow').textContent = text('eyebrow');
    byId('nativeModeTitle').textContent = text('title');
    byId('nativeModeLead').textContent = text('lead');
    byId('nativeModeCancel').textContent = text('cancel');
    const grid = byId('nativeModeGrid');
    grid.innerHTML = ['smart','quick','deep','custom'].map((mode) => `<button class="native-mode-option" type="button" data-native-mode="${mode}">${mode==='smart'?`<span class="native-mode-badge">${text('smartBadge')}</span>`:''}<strong>${text(mode)}</strong><small>${text(mode+'Sub')}</small></button>`).join('');
  }

  function openModeSheet() {
    if (running) return;
    renderModeSheet();
    byId('nativeModeSheet').hidden = false;
  }
  function closeModeSheet() { const sheet=byId('nativeModeSheet'); if(sheet) sheet.hidden=true; }

  function openCustomSheet() {
    renderModeSheet();
    byId('nativeModeTitle').textContent = text('customTitle');
    byId('nativeModeLead').textContent = text('customSub');
    byId('nativeModeGrid').innerHTML = `<div class="native-custom-list">${['downloads','photos','videos','documents','music'].map((scope)=>`<label class="native-check"><input type="checkbox" data-native-scope="${scope}" ${scope==='downloads'||scope==='photos'||scope==='videos'||scope==='documents'?'checked':''}><span>${text(scope)}</span></label>`).join('')}<label class="native-check native-check--wide"><input id="nativeVerifyDuplicates" type="checkbox" checked><span>${text('verify')}</span></label></div><button class="native-custom-start" id="nativeCustomStart" type="button">${text('start')}</button>`;
  }

  function parseNativeState() {
    nativeState = parseJson(NATIVE.getNativeState?.(), {});
    return nativeState;
  }

  function requestScan(mode, scopes=[], verify=true) {
    if (running) { toast(text('busy')); return; }
    const state = parseNativeState();
    pendingRequest = {mode, scopes, verify};
    if (!state.broadStorageAccess) {
      closeModeSheet();
      toast(text('permission'));
      NATIVE.requestBroadStorageAccess?.();
      return;
    }
    startNativeScan(mode, scopes, verify);
  }

  function startNativeScan(mode, scopes, verify) {
    pendingRequest = null;
    activeMode = mode;
    window.BearagnosticAppAPI?.switchScreen?.('checkup');
    closeModeSheet();
    const accepted = parseJson(NATIVE.startScan?.(mode, JSON.stringify(scopes || []), Boolean(verify)), {});
    if (!accepted.accepted) { toast(accepted.reason==='scan_already_running'?text('busy'):text('failed')); return; }
    running = true;
    setScanState('running');
    startFileStream();
  }

  function setScanState(state) {
    const screen=byId('checkupScreen'); if(screen) screen.dataset.state=state;
    const action=byId('scanAction');
    if(action){ action.disabled=state==='running'; action.textContent=state==='running'?(currentLanguage()==='th'?'กำลังตรวจไฟล์…':currentLanguage()==='ja'?'チェック中…':'Scanning in progress…'):(state==='complete'?(currentLanguage()==='th'?'ตรวจอีกครั้ง':currentLanguage()==='ja'?'もう一度チェック':'Run another checkup'):(currentLanguage()==='th'?'เลือกโหมดสแกน':currentLanguage()==='ja'?'スキャン方法を選ぶ':'Choose scan mode')); }
    byId('scanTitleText').textContent = text(state==='running'?'runningTitle':state==='complete'?'doneTitle':'idleTitle');
    byId('scanSubtitle').textContent = text(state==='running'?'runningSub':state==='complete'?'doneSub':'idleSub');
    byId('scanQuote').textContent = text(state==='running'?'quoteRunning':state==='complete'?'quoteDone':'quoteIdle');
    byId('scanTipBody').textContent = text('tip');
  }

  function setStage(phase, progress=null) {
    const index=Math.max(0,PHASES.indexOf(phase));
    qsa('[data-scan-stage]',byId('checkupScreen')).forEach((el,i)=>{el.classList.toggle('is-done',i<index);el.classList.toggle('is-active',i===index&&running);});
    const rail=byId('scanRailProgress'); if(rail) rail.style.width=`${Math.max(0,Math.min(100,(index/(PHASES.length-1))*100))}%`;
    if(progress!=null) setPercent(progress); else setIndeterminate();
  }

  function setPercent(value) {
    const pct=Math.max(0,Math.min(100,Number(value)||0));
    const ring=byId('scanRingValue'), wrap=ring?.closest('.scan-ring');
    wrap?.classList.remove('is-native-indeterminate');
    if(ring) ring.style.strokeDashoffset=String(RING_LENGTH*(1-pct/100));
    if(byId('scanPercent')) byId('scanPercent').textContent=String(Math.round(pct));
    if(byId('scanRingLabel')) byId('scanRingLabel').textContent=running?text('scanning'):pct>=100?text('complete'):text('ready');
  }

  function setIndeterminate() {
    const ring=byId('scanRingValue'), wrap=ring?.closest('.scan-ring');
    wrap?.classList.add('is-native-indeterminate');
    if(byId('scanPercent')) byId('scanPercent').textContent='—';
    if(byId('scanRingLabel')) byId('scanRingLabel').textContent=text('scanning');
  }

  function phasePercent(data) {
    const range=PHASE_RANGES[data.phase]; if(!range) return null;
    const total=Number(data.phaseTotalFiles)||0, done=Number(data.phaseProcessedFiles)||0;
    if(total<=0) return data.phase==='finalizing'?range[1]:null;
    const local=Math.max(0,Math.min(1,done/total));
    return range[0]+(range[1]-range[0])*local;
  }

  function updateCounters(data) {
    const set=(id,value)=>{const el=byId(id);if(el)el.textContent=String(Math.max(0,Number(value)||0));};
    set('scanReviewed',data.reviewedFiles);
    set('scanDuplicates',data.duplicateCopies ?? data.duplicateCandidateFiles ?? 0);
    set('scanLarge',data.largeFiles);
    set('scanOlder',data.olderFiles);
  }

  function progressEvent(raw) {
    const data=parseJson(raw,{}); lastProgress=data; running=true; setScanState('running');
    setStage(data.phase||'preparing',phasePercent(data)); updateCounters(data);
  }

  function completeEvent(raw) {
    const data=parseJson(raw,{}); running=false; lastProgress=data; stopFileStream(); updateCounters(data); setScanState('complete');
    qsa('[data-scan-stage]',byId('checkupScreen')).forEach(el=>{el.classList.add('is-done');el.classList.remove('is-active');});
    const rail=byId('scanRailProgress');if(rail)rail.style.width='100%'; setPercent(100);
    try{localStorage.setItem('bearagnostic.lastCheckupSummary',JSON.stringify({at:Date.now(),reviewed:Number(data.reviewedFiles)||0,duplicateCandidates:Number(data.duplicateCopies)||0,largeFiles:Number(data.largeFiles)||0,olderFiles:Number(data.olderFiles)||0,scanMode:data.scanMode||activeMode,durationMs:Number(data.durationMs)||0}));}catch(_){}
  }

  function cancelledEvent(){running=false;stopFileStream();setScanState('idle');setPercent(0);toast(text('cancelled'));}
  function errorEvent(){running=false;stopFileStream();setScanState('idle');setPercent(0);toast(text('failed'));}

  function makeTile() {
    const stream=byId('scanFileStream'); if(!stream)return;
    const kind=TILE_KINDS[Math.floor(Math.random()*TILE_KINDS.length)];
    const tile=document.createElement('span'); tile.className=`scan-file-tile scan-file-tile--${kind}`; tile.style.setProperty('--lane',String(Math.floor(Math.random()*4))); tile.innerHTML='<i></i>'; stream.appendChild(tile);
    tile.addEventListener('animationend',()=>tile.remove(),{once:true}); setTimeout(()=>tile.remove(),2500);
  }
  function startFileStream(){stopFileStream();makeTile();streamTimer=setInterval(makeTile,260);}
  function stopFileStream(){if(streamTimer){clearInterval(streamTimer);streamTimer=null;}const stream=byId('scanFileStream');if(stream)stream.innerHTML='';}

  function onNativeStateChanged(raw) {
    nativeState=parseJson(raw,{});
    if(pendingRequest && nativeState.broadStorageAccess && !running){const req=pendingRequest;startNativeScan(req.mode,req.scopes,req.verify);}
  }

  window.BearagnosticAndroid = Object.freeze({
    onNativeStateChanged,
    onScanProgress:progressEvent,
    onScanComplete:completeEvent,
    onScanCancelled:cancelledEvent,
    onScanError:errorEvent
  });

  // Capture only the controls whose behavior differs on Android. Everything else is
  // handled by the byte-for-byte legacy app scripts without reinterpretation.
  document.addEventListener('click',(event)=>{
    const target=event.target?.closest?.('button'); if(!target)return;
    if(target.id==='startCheckup'||target.id==='scanAction'){
      event.preventDefault(); event.stopImmediatePropagation();
      if(running){NATIVE.cancelOneTapScan?.();return;}
      openModeSheet(); return;
    }
    const modeButton=target.closest?.('[data-native-mode]');
    if(modeButton){event.preventDefault();event.stopImmediatePropagation();const mode=modeButton.dataset.nativeMode;if(mode==='custom')openCustomSheet();else requestScan(mode,[],mode!=='quick');return;}
    if(target.id==='nativeModeCancel'){event.preventDefault();event.stopImmediatePropagation();closeModeSheet();return;}
    if(target.id==='nativeCustomStart'){
      event.preventDefault();event.stopImmediatePropagation();
      const scopes=qsa('[data-native-scope]:checked').map(el=>el.dataset.nativeScope); const verify=Boolean(byId('nativeVerifyDuplicates')?.checked);requestScan('custom',scopes,verify);return;
    }
  },true);

  document.addEventListener('DOMContentLoaded',()=>{
    renderModeSheet();
    parseNativeState();
    const buildLabel=document.querySelector('.app-footer__build'); if(buildLabel) buildLabel.textContent='v0.14 · B14';
    // Keep the original browser file picker hidden in native Android; its visual Checkup
    // surface and flying-file animation remain the approved legacy implementation.
    const picker=byId('scanPicker'); if(picker){picker.hidden=true;picker.classList.remove('is-open');}
    setScanState('idle'); setPercent(0);
    NATIVE.refreshNativeState?.();
  },{once:true});

  window.addEventListener('bearagnostic:languagechange',()=>{if(!byId('nativeModeSheet')?.hidden)renderModeSheet();setScanState(running?'running':lastProgress?.state==='complete'?'complete':'idle');});
})();
