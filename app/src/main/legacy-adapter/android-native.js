(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const BUILD = 15;
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
  let lastCompleteResult = null;
  let reviewCategory = null;
  let reviewOffset = 0;
  let reviewTotal = 0;
  let reviewItems = new Map();
  let selectedReviewIds = new Set();

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
      tip:'Bearagnostic analyzes accessible files locally on this device.',
      home:'Home', nextSteps:'Recommended next steps', nextLead:'The scan is only the diagnosis. Review the findings below and choose what you want Bearagnostic to do next.',
      reviewClean:'Review & Clean', reviewCleanSub:'Low-risk cleanup candidates only', noLowRisk:'No low-risk automatic cleanup was found. Review the categories below instead.',
      duplicatesAction:'Verified duplicates', largeAction:'Large files', oldAction:'Older files', tempAction:'Temporary files', installersAction:'APK installers', archivesAction:'Archives',
      review:'Review', scanAgain:'Scan again', close:'Close', viewResults:'View recommendations',
      reviewTitle:'Review files', selected:'selected', deleteSelected:'Delete selected', deleteTitle:'Delete selected files?', deleteBody:'Bearagnostic will permanently delete only the files you selected. This cannot be undone.', deleteNow:'Delete files',
      keep:'Keep', lowRisk:'Low risk', needsReview:'Review', protectedCopy:'Keep one copy', loadMore:'Load more', resultsUpdated:'Cleanup finished', reclaimed:'reclaimed', deleted:'files deleted', rescanNote:'Run another checkup to refresh all findings after cleanup.', backResults:'Back to results',
      reason_stale_incomplete_download:'Stale incomplete download', reason_temporary_artifact:'Temporary artifact — review first', reason_verified_duplicate:'SHA-256 verified duplicate', reason_large_file:'Large file — size alone is not junk', reason_old_file:'Older file — age alone is not junk', reason_apk_installer:'Downloaded APK installer', reason_archive_file:'Archive — may be the only copy', reason_zero_byte:'Zero-byte file — review context'
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
      tip:'Bearagnostic วิเคราะห์ไฟล์ที่เข้าถึงได้ภายในเครื่องนี้',
      home:'หน้าหลัก', nextSteps:'สิ่งที่แนะนำให้ทำต่อ', nextLead:'การสแกนเป็นเพียงขั้นวินิจฉัย เลือกตรวจรายการด้านล่างแล้วตัดสินใจว่าจะให้ Bearagnostic ทำอะไรต่อ',
      reviewClean:'ตรวจและทำความสะอาด', reviewCleanSub:'เฉพาะรายการความเสี่ยงต่ำที่ตรวจพบจริง', noLowRisk:'ไม่พบรายการที่เหมาะกับการลบอัตโนมัติแบบความเสี่ยงต่ำ ให้ตรวจหมวดด้านล่างแทน',
      duplicatesAction:'ไฟล์ซ้ำที่ยืนยันแล้ว', largeAction:'ไฟล์ขนาดใหญ่', oldAction:'ไฟล์เก่า', tempAction:'ไฟล์ชั่วคราว', installersAction:'ไฟล์ติดตั้ง APK', archivesAction:'ไฟล์บีบอัด',
      review:'ตรวจรายการ', scanAgain:'สแกนอีกครั้ง', close:'ปิด', viewResults:'ดูคำแนะนำ',
      reviewTitle:'ตรวจรายการไฟล์', selected:'เลือกแล้ว', deleteSelected:'ลบที่เลือก', deleteTitle:'ลบไฟล์ที่เลือก?', deleteBody:'Bearagnostic จะลบถาวรเฉพาะไฟล์ที่พี่เลือก การลบนี้ย้อนกลับไม่ได้', deleteNow:'ลบไฟล์',
      keep:'เก็บไว้', lowRisk:'ความเสี่ยงต่ำ', needsReview:'ต้องตรวจ', protectedCopy:'เก็บอย่างน้อยหนึ่งสำเนา', loadMore:'โหลดเพิ่ม', resultsUpdated:'ทำความสะอาดเรียบร้อย', reclaimed:'คืนพื้นที่', deleted:'ไฟล์ที่ลบ', rescanNote:'สแกนอีกครั้งเพื่ออัปเดตผลทั้งหมดหลังการลบ', backResults:'กลับผลลัพธ์',
      reason_stale_incomplete_download:'ไฟล์ดาวน์โหลดไม่สมบูรณ์ที่ค้างมานาน', reason_temporary_artifact:'ไฟล์ชั่วคราว — ควรตรวจก่อน', reason_verified_duplicate:'ไฟล์ซ้ำที่ยืนยันด้วย SHA-256', reason_large_file:'ไฟล์ใหญ่ — ขนาดไม่ได้แปลว่าเป็นขยะ', reason_old_file:'ไฟล์เก่า — อายุไฟล์ไม่ได้แปลว่าเป็นขยะ', reason_apk_installer:'ไฟล์ติดตั้ง APK ที่ดาวน์โหลดไว้', reason_archive_file:'ไฟล์บีบอัด — อาจเป็นสำเนาเดียว', reason_zero_byte:'ไฟล์ขนาด 0 ไบต์ — ควรดูบริบท'
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
      tip:'Bearagnostic はアクセス可能なファイルを端末内で解析します。',
      home:'ホーム', nextSteps:'おすすめの次の操作', nextLead:'スキャンは診断です。下の結果を確認し、次に何をするか選んでください。',
      reviewClean:'確認してクリーンアップ', reviewCleanSub:'実際に見つかった低リスク候補のみ', noLowRisk:'自動クリーンアップ向けの低リスク候補はありません。下のカテゴリを確認してください。',
      duplicatesAction:'確認済み重複', largeAction:'大きいファイル', oldAction:'古いファイル', tempAction:'一時ファイル', installersAction:'APK インストーラー', archivesAction:'アーカイブ',
      review:'確認', scanAgain:'再スキャン', close:'閉じる', viewResults:'おすすめを見る',
      reviewTitle:'ファイルを確認', selected:'選択済み', deleteSelected:'選択項目を削除', deleteTitle:'選択したファイルを削除しますか？', deleteBody:'選択したファイルだけを完全に削除します。この操作は元に戻せません。', deleteNow:'削除',
      keep:'保持', lowRisk:'低リスク', needsReview:'要確認', protectedCopy:'1つは保持', loadMore:'さらに表示', resultsUpdated:'クリーンアップ完了', reclaimed:'解放', deleted:'削除したファイル', rescanNote:'削除後の結果を更新するには再スキャンしてください。', backResults:'結果へ戻る',
      reason_stale_incomplete_download:'古い未完了ダウンロード', reason_temporary_artifact:'一時ファイル — 要確認', reason_verified_duplicate:'SHA-256 で確認済みの重複', reason_large_file:'大きいファイル — サイズだけでは不要とは限りません', reason_old_file:'古いファイル — 日付だけでは不要とは限りません', reason_apk_installer:'ダウンロード済み APK', reason_archive_file:'アーカイブ — 唯一のコピーかもしれません', reason_zero_byte:'0 バイトファイル — 状況を確認'
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
      .native-home-button{width:42px;height:42px;border:0;border-radius:15px;background:rgba(255,255,255,.86);box-shadow:0 7px 18px rgba(60,91,124,.09);display:grid;place-items:center;padding:7px;flex:0 0 auto}.native-home-button img{width:100%;height:100%;object-fit:contain}.native-home-button[hidden]{display:none!important}
      .native-results-sheet,.native-review-sheet,.native-confirm-sheet,.native-clean-summary{position:fixed;inset:0;z-index:1450;background:rgba(236,245,252,.96);backdrop-filter:blur(18px);padding:max(14px,env(safe-area-inset-top)) 14px max(14px,env(safe-area-inset-bottom));overflow:hidden}.native-results-sheet[hidden],.native-review-sheet[hidden],.native-confirm-sheet[hidden],.native-clean-summary[hidden]{display:none!important}
      .native-results-panel,.native-review-panel,.native-clean-panel{height:100%;max-width:560px;margin:0 auto;background:linear-gradient(180deg,rgba(255,255,255,.985),rgba(247,251,255,.985));border:1px solid rgba(255,255,255,.98);border-radius:30px;box-shadow:0 18px 55px rgba(41,76,113,.15);overflow:hidden;display:grid;grid-template-rows:auto auto minmax(0,1fr) auto}.native-sheet-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 17px 10px}.native-sheet-head h2{font-size:22px;letter-spacing:-.03em;margin:0}.native-sheet-head p{margin:3px 0 0;color:#8794a2;font-size:11px}.native-icon-button{width:40px;height:40px;border-radius:14px;background:#eef5fa;color:#4e6479;font-size:20px;display:grid;place-items:center}.native-result-hero{margin:0 16px 12px;padding:15px;border-radius:22px;background:linear-gradient(135deg,#eaf8ff,#f4fbff 54%,#edf9f6);border:1px solid #fff}.native-result-hero strong{display:block;font-size:15px}.native-result-hero p{font-size:11px;line-height:1.42;color:#718398;margin:5px 0 0}.native-results-scroll{overflow:auto;padding:0 16px 12px;overscroll-behavior:contain}.native-primary-action{width:100%;min-height:70px;border-radius:22px;padding:12px 14px;text-align:left;color:white;background:linear-gradient(118deg,#21b9ed,#0b80ec);box-shadow:0 12px 24px rgba(11,132,232,.18);display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center}.native-primary-action strong{font-size:17px}.native-primary-action small{display:block;color:rgba(255,255,255,.82);font-size:10px;margin-top:4px}.native-primary-action b{font-size:18px}.native-action-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px}.native-result-action{min-height:74px;border-radius:20px;background:#fff;border:1px solid rgba(95,125,154,.11);box-shadow:0 7px 20px rgba(67,101,136,.06);padding:11px;text-align:left}.native-result-action strong{display:block;font-size:13px}.native-result-action small{display:block;font-size:10px;color:#8b97a5;margin-top:5px}.native-results-footer{display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:11px 16px 16px}.native-secondary{height:46px;border-radius:17px;background:#edf4f9;color:#51657a;font-weight:700}.native-secondary--blue{background:#e8f6fe;color:#087ed8}.native-review-panel{grid-template-rows:auto auto minmax(0,1fr) auto}.native-review-summary{padding:0 17px 10px;color:#73859a;font-size:11px;display:flex;justify-content:space-between}.native-review-list{overflow:auto;padding:0 14px 14px;overscroll-behavior:contain}.native-file-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;background:#fff;border:1px solid rgba(91,120,149,.10);border-radius:17px;padding:11px;margin-bottom:8px}.native-file-row input{width:19px;height:19px;accent-color:#128fe9}.native-file-copy{min-width:0}.native-file-copy strong{display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.native-file-copy small{display:block;font-size:9px;color:#8d99a7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px}.native-file-meta{text-align:right}.native-file-meta b{display:block;font-size:10px}.native-risk{display:inline-block;font-size:8px;border-radius:99px;padding:3px 6px;margin-top:4px;background:#eef4f8;color:#6a7b8f}.native-risk.low{background:#e5f8f2;color:#16896f}.native-risk.keep{background:#edf5ff;color:#3477b5}.native-load-more{width:100%;height:42px;border-radius:15px;background:#edf4f9;color:#51657a;font-weight:700}.native-review-footer{padding:10px 14px 14px;background:rgba(250,253,255,.97);border-top:1px solid rgba(91,120,149,.08);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px;align-items:center}.native-selection-copy strong{display:block;font-size:13px}.native-selection-copy small{font-size:9px;color:#8794a2}.native-delete-button{height:46px;border-radius:17px;background:#162b44;color:white;padding:0 16px;font-weight:700}.native-delete-button:disabled{opacity:.42}.native-confirm-sheet{display:grid;place-items:center;background:rgba(13,28,48,.34)}.native-confirm-panel{width:min(92%,430px);background:#fff;border-radius:26px;padding:18px;box-shadow:0 20px 60px rgba(20,42,67,.23)}.native-confirm-panel h3{margin:0;font-size:19px}.native-confirm-panel p{font-size:11px;line-height:1.5;color:#76879a}.native-confirm-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.native-danger{height:46px;border-radius:16px;background:#c94650;color:white;font-weight:750}.native-clean-panel{grid-template-rows:1fr;place-items:center;text-align:center;padding:24px}.native-clean-card{max-width:420px}.native-clean-card .native-clean-check{width:74px;height:74px;border-radius:50%;display:grid;place-items:center;margin:0 auto 15px;background:linear-gradient(145deg,#dffbf5,#eaf8ff);color:#159d82;font-size:34px}.native-clean-card h2{font-size:23px;margin:0}.native-clean-metric{font-size:32px;font-weight:800;color:#128fe9;margin:12px 0 2px}.native-clean-card p{font-size:11px;color:#7d8c9e;line-height:1.45}.native-clean-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}.native-empty{padding:30px 14px;text-align:center;color:#8695a5;font-size:12px}
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
    if(action){ action.disabled=state==='running'; action.textContent=state==='running'?(currentLanguage()==='th'?'กำลังตรวจไฟล์…':currentLanguage()==='ja'?'チェック中…':'Scanning in progress…'):(state==='complete'?text('viewResults'):(currentLanguage()==='th'?'เลือกโหมดสแกน':currentLanguage()==='ja'?'スキャン方法を選ぶ':'Choose scan mode')); }
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

  function formatBytes(value) {
    const bytes=Math.max(0,Number(value)||0); if(bytes<1024)return `${Math.round(bytes)} B`;
    const units=['KB','MB','GB','TB']; let n=bytes/1024, i=0; while(n>=1024&&i<units.length-1){n/=1024;i++;}
    return `${n>=100?n.toFixed(0):n>=10?n.toFixed(1):n.toFixed(2)} ${units[i]}`;
  }

  function formatDate(value) {
    const n=Number(value)||0; if(!n)return '';
    try{return new Intl.DateTimeFormat(currentLanguage()==='th'?'th-TH':currentLanguage()==='ja'?'ja-JP':'en-US',{year:'numeric',month:'short',day:'numeric'}).format(new Date(n));}catch(_){return '';}
  }

  function ensureNavigationButton() {
    const header=document.querySelector('.app-header'); if(!header||byId('nativeHomeButton'))return;
    const button=document.createElement('button'); button.id='nativeHomeButton'; button.className='native-home-button'; button.type='button'; button.hidden=true; button.setAttribute('aria-label',text('home'));
    button.innerHTML='<img src="./assets/ui/glass-icons/home.webp" alt="">';
    const settings=byId('settingsButton'); header.insertBefore(button,settings||null);
  }
  function syncHomeButton(screenName=window.BearagnosticAppAPI?.getCurrentScreen?.()||'home') {
    ensureNavigationButton(); const button=byId('nativeHomeButton'); if(button)button.hidden=screenName==='home';
  }
  function goHome(){ closeResults(); closeReview(); closeConfirm(); const clean=byId('nativeCleanSummary'); if(clean)clean.hidden=true; window.BearagnosticAppAPI?.switchScreen?.('home'); }

  function ensureActionSurfaces() {
    ensureStyle(); ensureNavigationButton();
    if(!byId('nativeResultsSheet')) document.body.insertAdjacentHTML('beforeend',`<section class="native-results-sheet" id="nativeResultsSheet" hidden><div class="native-results-panel"><div class="native-sheet-head"><div><h2 id="nativeResultsTitle"></h2><p id="nativeResultsMode"></p></div><button class="native-icon-button" id="nativeResultsClose" type="button">×</button></div><div class="native-result-hero"><strong id="nativeRecommendationTitle"></strong><p id="nativeRecommendationBody"></p></div><div class="native-results-scroll"><button class="native-primary-action" id="nativeLowRiskAction" type="button"><span><strong id="nativeLowRiskTitle"></strong><small id="nativeLowRiskSub"></small></span><b>›</b></button><div class="native-action-grid" id="nativeActionGrid"></div></div><div class="native-results-footer"><button class="native-secondary" id="nativeResultsHome" type="button"></button><button class="native-secondary native-secondary--blue" id="nativeResultsRescan" type="button"></button></div></div></section>`);
    if(!byId('nativeReviewSheet')) document.body.insertAdjacentHTML('beforeend',`<section class="native-review-sheet" id="nativeReviewSheet" hidden><div class="native-review-panel"><div class="native-sheet-head"><button class="native-icon-button" id="nativeReviewBack" type="button">‹</button><div style="min-width:0;flex:1"><h2 id="nativeReviewTitle"></h2><p id="nativeReviewSubtitle"></p></div><button class="native-icon-button" id="nativeReviewHome" type="button">⌂</button></div><div class="native-review-summary"><span id="nativeReviewCount"></span><span id="nativeReviewBytes"></span></div><div class="native-review-list" id="nativeReviewList"></div><div class="native-review-footer"><div class="native-selection-copy"><strong id="nativeSelectedCount"></strong><small id="nativeSelectedBytes"></small></div><button class="native-delete-button" id="nativeDeleteSelected" type="button"></button></div></div></section>`);
    if(!byId('nativeConfirmSheet')) document.body.insertAdjacentHTML('beforeend',`<section class="native-confirm-sheet" id="nativeConfirmSheet" hidden><div class="native-confirm-panel"><h3 id="nativeConfirmTitle"></h3><p id="nativeConfirmBody"></p><div class="native-confirm-actions"><button class="native-secondary" id="nativeConfirmCancel" type="button"></button><button class="native-danger" id="nativeConfirmDelete" type="button"></button></div></div></section>`);
    if(!byId('nativeCleanSummary')) document.body.insertAdjacentHTML('beforeend',`<section class="native-clean-summary" id="nativeCleanSummary" hidden><div class="native-clean-panel"><div class="native-clean-card"><div class="native-clean-check">✓</div><h2 id="nativeCleanTitle"></h2><div class="native-clean-metric" id="nativeCleanBytes"></div><p id="nativeCleanDetails"></p><div class="native-clean-actions"><button class="native-secondary" id="nativeCleanBack" type="button"></button><button class="native-secondary native-secondary--blue" id="nativeCleanHome" type="button"></button></div></div></div></section>`);
  }

  function recommendation(data,review) {
    const dup=Number(data?.duplicateCopies)||0, dupBytes=Number(data?.duplicateReclaimableBytes)||0;
    const low=Number(review?.lowriskCount)||0, lowBytes=Number(review?.lowriskBytes)||0;
    const large=Number(data?.largeFiles)||0, old=Number(data?.olderFiles)||0;
    if(low>0)return {title:text('reviewClean'),body:`${low} · ${formatBytes(lowBytes)} — ${text('reviewCleanSub')}`};
    if(dup>0)return {title:text('duplicatesAction'),body:`${dup} · ${formatBytes(dupBytes)} — ${text('reason_verified_duplicate')}`};
    if(large>0)return {title:text('largeAction'),body:`${large} — ${text('reason_large_file')}`};
    if(old>0)return {title:text('oldAction'),body:`${old} — ${text('reason_old_file')}`};
    return {title:text('nextSteps'),body:text('noLowRisk')};
  }

  function actionCard(category,title,count,bytes=0) {
    if(!(Number(count)>0))return '';
    return `<button class="native-result-action" type="button" data-review-category="${category}"><strong>${title}</strong><small>${Number(count)}${bytes?` · ${formatBytes(bytes)}`:''} · ${text('review')}</small></button>`;
  }

  function openResults(data=lastCompleteResult) {
    ensureActionSurfaces(); if(!data)return;
    lastCompleteResult=data;
    const review=parseJson(NATIVE.getReviewSummary?.(),{});
    byId('nativeResultsTitle').textContent=text('nextSteps');
    byId('nativeResultsMode').textContent=`${String(data.scanMode||activeMode).toUpperCase()} · ${Number(data.reviewedFiles)||0} ${currentLanguage()==='th'?'ไฟล์':currentLanguage()==='ja'?'ファイル':'files'}`;
    const rec=recommendation(data,review); byId('nativeRecommendationTitle').textContent=rec.title; byId('nativeRecommendationBody').textContent=rec.body;
    const lowCount=Number(review.lowriskCount)||0, lowBytes=Number(review.lowriskBytes)||0;
    byId('nativeLowRiskTitle').textContent=lowCount>0?text('reviewClean'):text('review');
    byId('nativeLowRiskSub').textContent=lowCount>0?`${lowCount} · ${formatBytes(lowBytes)} · ${text('reviewCleanSub')}`:text('noLowRisk');
    byId('nativeLowRiskAction').dataset.reviewCategory=lowCount>0?'lowrisk':(Number(data.duplicateCopies)>0?'duplicates':Number(data.largeFiles)>0?'large':Number(data.olderFiles)>0?'old':'all');
    byId('nativeActionGrid').innerHTML=[
      actionCard('duplicates',text('duplicatesAction'),data.duplicateCopies,data.duplicateReclaimableBytes),
      actionCard('large',text('largeAction'),data.largeFiles,data.largeFileBytes),
      actionCard('old',text('oldAction'),data.olderFiles,data.olderFileBytes),
      actionCard('temporary',text('tempAction'),data.temporaryArtifactFiles,data.temporaryArtifactBytes),
      actionCard('installers',text('installersAction'),data.apkInstallerFiles,data.apkInstallerBytes),
      actionCard('archives',text('archivesAction'),data.archiveFiles,data.archiveBytes)
    ].join('');
    byId('nativeResultsHome').textContent=text('home'); byId('nativeResultsRescan').textContent=text('scanAgain'); byId('nativeResultsClose').setAttribute('aria-label',text('close'));
    byId('nativeResultsSheet').hidden=false;
  }
  function closeResults(){const el=byId('nativeResultsSheet');if(el)el.hidden=true;}

  function categoryTitle(category){return ({lowrisk:text('reviewClean'),duplicates:text('duplicatesAction'),large:text('largeAction'),old:text('oldAction'),temporary:text('tempAction'),installers:text('installersAction'),archives:text('archivesAction'),zero:'Zero-byte files',all:text('review')})[category]||text('reviewTitle');}
  function reasonText(code){return text(`reason_${code}`);}

  function openReview(category) {
    ensureActionSurfaces(); reviewCategory=category; reviewOffset=0; reviewTotal=0; reviewItems.clear(); selectedReviewIds.clear();
    byId('nativeReviewTitle').textContent=categoryTitle(category); byId('nativeReviewSubtitle').textContent=text('reviewTitle'); byId('nativeDeleteSelected').textContent=text('deleteSelected');
    byId('nativeReviewSheet').hidden=false; loadReviewPage(true);
  }
  function closeReview(){const el=byId('nativeReviewSheet');if(el)el.hidden=true; reviewCategory=null;}

  function loadReviewPage(reset=false) {
    if(!reviewCategory)return; if(reset){reviewOffset=0;reviewItems.clear();selectedReviewIds.clear();byId('nativeReviewList').innerHTML='';}
    const page=parseJson(NATIVE.getReviewCandidates?.(reviewCategory,reviewOffset,120),{}); reviewTotal=Number(page.totalCount)||0;
    const items=Array.isArray(page.items)?page.items:[];
    for(const item of items){reviewItems.set(item.id,item); if(item.suggestedSelected&&!item.duplicateKeepSuggested)selectedReviewIds.add(item.id);}
    reviewOffset+=items.length; renderReviewList(page.hasMore);
  }

  function renderReviewList(hasMore=false) {
    const list=byId('nativeReviewList'); if(!list)return;
    if(!reviewItems.size){list.innerHTML=`<div class="native-empty">${text('noLowRisk')}</div>`;}else{
      list.innerHTML=[...reviewItems.values()].map(item=>{const checked=selectedReviewIds.has(item.id)?'checked':'';const disabled=item.duplicateKeepSuggested?'':'';const risk=item.autoCleanEligible?`<span class="native-risk low">${text('lowRisk')}</span>`:item.duplicateKeepSuggested?`<span class="native-risk keep">${text('protectedCopy')}</span>`:`<span class="native-risk">${text('needsReview')}</span>`;return `<label class="native-file-row"><input type="checkbox" data-review-id="${item.id}" ${checked} ${disabled}><span class="native-file-copy"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.location||'')} · ${escapeHtml(reasonText(item.reasonCode))}${item.modifiedMs?` · ${escapeHtml(formatDate(item.modifiedMs))}`:''}</small></span><span class="native-file-meta"><b>${formatBytes(item.sizeBytes)}</b>${risk}</span></label>`;}).join('')+(hasMore?`<button class="native-load-more" id="nativeLoadMore" type="button">${text('loadMore')}</button>`:'');
    }
    const bytes=[...selectedReviewIds].reduce((sum,id)=>sum+(Number(reviewItems.get(id)?.sizeBytes)||0),0);
    byId('nativeReviewCount').textContent=`${reviewTotal} ${text('review')}`; byId('nativeReviewBytes').textContent=formatBytes([...reviewItems.values()].reduce((sum,item)=>sum+(Number(item.sizeBytes)||0),0));
    byId('nativeSelectedCount').textContent=`${selectedReviewIds.size} ${text('selected')}`; byId('nativeSelectedBytes').textContent=formatBytes(bytes); byId('nativeDeleteSelected').disabled=selectedReviewIds.size===0;
  }

  function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function closeConfirm(){const el=byId('nativeConfirmSheet');if(el)el.hidden=true;}
  function openDeleteConfirm(){if(!selectedReviewIds.size)return;ensureActionSurfaces();byId('nativeConfirmTitle').textContent=text('deleteTitle');byId('nativeConfirmBody').textContent=text('deleteBody');byId('nativeConfirmCancel').textContent=text('cancel');byId('nativeConfirmDelete').textContent=text('deleteNow');byId('nativeConfirmSheet').hidden=false;}

  function performDelete(){
    const ids=[...selectedReviewIds]; closeConfirm();
    const result=parseJson(NATIVE.deleteReviewCandidates?.(JSON.stringify(ids)),{});
    if(!result.accepted){toast(text('failed'));return;}
    const reclaimed=Number(result.reclaimedBytes)||0, count=Number(result.deletedCount)||0;
    byId('nativeReviewSheet').hidden=true; closeResults();
    byId('nativeCleanTitle').textContent=text('resultsUpdated'); byId('nativeCleanBytes').textContent=formatBytes(reclaimed);
    byId('nativeCleanDetails').textContent=`${count} ${text('deleted')} · ${text('rescanNote')}`; byId('nativeCleanBack').textContent=text('backResults'); byId('nativeCleanHome').textContent=text('home'); byId('nativeCleanSummary').hidden=false;
  }

  function progressEvent(raw) {
    const data=parseJson(raw,{}); lastProgress=data; running=true; setScanState('running');
    setStage(data.phase||'preparing',phasePercent(data)); updateCounters(data);
  }

  function completeEvent(raw) {
    const data=parseJson(raw,{}); running=false; lastProgress=data; lastCompleteResult=data; stopFileStream(); updateCounters(data); setScanState('complete');
    qsa('[data-scan-stage]',byId('checkupScreen')).forEach(el=>{el.classList.add('is-done');el.classList.remove('is-active');});
    const rail=byId('scanRailProgress');if(rail)rail.style.width='100%'; setPercent(100);
    try{localStorage.setItem('bearagnostic.lastCheckupSummary',JSON.stringify({at:Date.now(),reviewed:Number(data.reviewedFiles)||0,duplicateCandidates:Number(data.duplicateCopies)||0,largeFiles:Number(data.largeFiles)||0,olderFiles:Number(data.olderFiles)||0,scanMode:data.scanMode||activeMode,durationMs:Number(data.durationMs)||0}));}catch(_){}
    setTimeout(()=>openResults(data),260);
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
    if(target.id==='startCheckup'){event.preventDefault();event.stopImmediatePropagation();if(running){NATIVE.cancelOneTapScan?.();return;}openModeSheet();return;}
    if(target.id==='scanAction'){event.preventDefault();event.stopImmediatePropagation();if(running){NATIVE.cancelOneTapScan?.();return;}if(lastCompleteResult){openResults(lastCompleteResult);return;}openModeSheet();return;}
    if(target.id==='nativeHomeButton'||target.id==='nativeResultsHome'||target.id==='nativeReviewHome'||target.id==='nativeCleanHome'){event.preventDefault();event.stopImmediatePropagation();goHome();return;}
    if(target.id==='nativeResultsClose'){event.preventDefault();event.stopImmediatePropagation();closeResults();return;}
    if(target.id==='nativeResultsRescan'){event.preventDefault();event.stopImmediatePropagation();closeResults();openModeSheet();return;}
    if(target.id==='nativeLowRiskAction'||target.matches?.('[data-review-category]')){event.preventDefault();event.stopImmediatePropagation();const category=target.dataset.reviewCategory||target.closest?.('[data-review-category]')?.dataset.reviewCategory;if(category){closeResults();openReview(category);}return;}
    if(target.id==='nativeReviewBack'){event.preventDefault();event.stopImmediatePropagation();closeReview();openResults();return;}
    if(target.id==='nativeLoadMore'){event.preventDefault();event.stopImmediatePropagation();loadReviewPage(false);return;}
    if(target.id==='nativeDeleteSelected'){event.preventDefault();event.stopImmediatePropagation();openDeleteConfirm();return;}
    if(target.id==='nativeConfirmCancel'){event.preventDefault();event.stopImmediatePropagation();closeConfirm();return;}
    if(target.id==='nativeConfirmDelete'){event.preventDefault();event.stopImmediatePropagation();performDelete();return;}
    if(target.id==='nativeCleanBack'){event.preventDefault();event.stopImmediatePropagation();byId('nativeCleanSummary').hidden=true;openResults();return;}
    const modeButton=target.closest?.('[data-native-mode]');
    if(modeButton){event.preventDefault();event.stopImmediatePropagation();const mode=modeButton.dataset.nativeMode;if(mode==='custom')openCustomSheet();else requestScan(mode,[],mode!=='quick');return;}
    if(target.id==='nativeModeCancel'){event.preventDefault();event.stopImmediatePropagation();closeModeSheet();return;}
    if(target.id==='nativeCustomStart'){
      event.preventDefault();event.stopImmediatePropagation();
      const scopes=qsa('[data-native-scope]:checked').map(el=>el.dataset.nativeScope); const verify=Boolean(byId('nativeVerifyDuplicates')?.checked);requestScan('custom',scopes,verify);return;
    }
  },true);

  document.addEventListener('change',(event)=>{
    const box=event.target?.closest?.('[data-review-id]'); if(!box)return;
    const id=box.dataset.reviewId; if(box.checked)selectedReviewIds.add(id);else selectedReviewIds.delete(id); renderReviewList(reviewOffset<reviewTotal);
  },true);

  window.addEventListener('bearagnostic:screenchange',(event)=>syncHomeButton(event.detail?.screen||'home'));

  document.addEventListener('DOMContentLoaded',()=>{
    renderModeSheet(); ensureActionSurfaces();
    parseNativeState(); syncHomeButton('home');
    const buildLabel=document.querySelector('.app-footer__build'); if(buildLabel) buildLabel.textContent='v0.15 · B15';
    // Keep the original browser file picker hidden in native Android; its visual Checkup
    // surface and flying-file animation remain the approved legacy implementation.
    const picker=byId('scanPicker'); if(picker){picker.hidden=true;picker.classList.remove('is-open');}
    setScanState('idle'); setPercent(0);
    NATIVE.refreshNativeState?.();
  },{once:true});

  window.addEventListener('bearagnostic:languagechange',()=>{if(!byId('nativeModeSheet')?.hidden)renderModeSheet();setScanState(running?'running':lastProgress?.state==='complete'?'complete':'idle');syncHomeButton();if(lastCompleteResult&&!byId('nativeResultsSheet')?.hidden)openResults(lastCompleteResult);});
})();
