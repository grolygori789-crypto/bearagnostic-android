(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const BUILD = 18;
  const RING_LENGTH = 289.03;
  const PHASES = ['preparing','file_details','file_sizes','duplicates','modified_dates','finalizing'];
  const PHASE_RANGES = {
    preparing:[0,8], file_details:[8,28], file_sizes:[28,45],
    duplicates:[45,80], modified_dates:[80,94], finalizing:[94,100]
  };
  const TILE_KINDS = ['doc','image','video','audio','folder'];
  const FILE_TILE_ICONS = Object.freeze({
    doc:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/><path d="M10 12h5M10 15h5"/>',
    image:'<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.4"/><path d="m6 17 4-4 3 3 2-2 3 3"/>',
    video:'<rect x="4" y="6" width="16" height="12" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    audio:'<path d="M9 18V7l9-2v11"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="15.5" cy="16" r="2.5"/>',
    folder:'<path d="M3.5 7h6l2-2H20a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V8A1 1 0 0 1 3.5 7Z"/>'
  });

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
  let sessionDeletedCount = 0;
  let sessionReclaimedBytes = 0;
  let sessionDuplicateCopiesRemoved = 0;
  let sessionProtectedCopiesKept = 0;
  let scanStartStorage = null;
  let latestStorageSnapshot = null;
  let initialLowRiskCount = null;
  let initialLowRiskBytes = null;

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
      quick:'Quick Scan', quickSub:'All accessible shared storage using metadata and lightweight rules. Fast by design.',
      deep:'Deep Scan', deepSub:'All accessible shared storage, full streaming content read and exact duplicate verification.',
      custom:'Custom Scan', customSub:'Choose shared-storage categories and duplicate verification.',
      cancel:'Cancel', customTitle:'Custom Scan', downloads:'Downloads', photos:'Photos', videos:'Videos', documents:'Documents', music:'Music', verify:'Verify exact duplicates', start:'Start Custom Scan',
      permission:'Allow storage access in Android settings to start this scan.', busy:'A scan is already running.', failed:'Bearagnostic could not finish this checkup.', cancelled:'Checkup cancelled.',
      ready:'READY', scanning:'SCANNING', complete:'COMPLETE', idleTitle:'Ready for a checkup', idleSub:'Choose a scan mode. Dr. Bear checks only storage Android allows.', runningTitle:'Checking things out', runningSub:'A cleaner device leads to brighter days.', doneTitle:'Checkup complete', doneSub:'The accessible scope for this scan has been reviewed locally.',
      quoteIdle:'Your files. Your choice.', quoteRunning:'Looking carefully. Bears don’t rush diagnostics.', quoteDone:'All done. The numbers shown come from the native scan.',
      tip:'Bearagnostic analyzes accessible files locally on this device.',
      home:'Home', nextSteps:'Cleanup plan', nextLead:'Your scan is complete. Nothing changes until you choose it.',
      reviewClean:'Review & Clean', reviewCleanSub:'Low-risk cleanup candidates only', noLowRisk:'No low-risk automatic cleanup was found. Review the categories below instead.',
      duplicatesAction:'Exact duplicates', largeAction:'Large files', oldAction:'Older files', tempAction:'Temporary files', installersAction:'APK installers', archivesAction:'Archives',
      review:'Review', scanAgain:'Scan again', close:'Close', viewResults:'View recommendations',
      reviewTitle:'Review files', selected:'selected', deleteSelected:'Delete selected', deleteTitle:'Delete selected files?', deleteBody:'Bearagnostic will permanently delete only the files you selected. This cannot be undone.', deleteNow:'Delete files',
      keep:'Keep', lowRisk:'Low risk', needsReview:'Review', protectedCopy:'Keep one copy', loadMore:'Load more', resultsUpdated:'Cleanup finished', reclaimed:'reclaimed', deleted:'files deleted', rescanNote:'Results are updated now. Scan again only when you want a fresh whole-device check.', backResults:'Back to results',
      resultHeroTitle:'Your storage, clarified.', resultHeroLow:'Low-risk items are ready for review. Bearagnostic still asks before anything is deleted.', resultHeroReview:'There is no one-tap cleanup here—and that is intentional. Review only the categories that matter to you.', resultHeroClear:'Nothing in this scan currently needs cleanup review.', overviewTitle:'At a glance', readyNow:'Ready to clean', reviewItems:'Items to review', categoriesFound:'Categories', items:'items', sessionTitle:'This session', sessionEmpty:'Nothing removed yet', safetyTitle:'Protected by design', safetyBody:'Large, old, APK and archive files stay review-only. Exact duplicates always keep at least one copy.', zeroAction:'Zero-byte files', resultKicker:'SCAN COMPLETE', reviewByCategory:'Review by category', scanFacts:'Scan facts', filesReviewedLabel:'Files reviewed', localLabel:'On device', modeLabel:'Mode', recommendFirst:'RECOMMENDED FIRST', startHere:'Start here', spaceReclaimed:'Space reclaimed',
      reason_stale_incomplete_download:'Stale incomplete download', reason_temporary_artifact:'Temporary artifact — review first', reason_verified_duplicate:'Identical copy confirmed', reason_large_file:'Large file — size alone is not junk', reason_old_file:'Older file — age alone is not junk', reason_apk_installer:'Downloaded APK installer', reason_archive_file:'Archive — may be the only copy', reason_zero_byte:'Zero-byte file — review context'
    },
    th:{
      eyebrow:'ระดับการสแกน', title:'เลือกความละเอียดในการสแกน', lead:'หน้าตา Bearagnostic ต้นฉบับยังคงเดิม เลือกเฉพาะระดับการวิเคราะห์จริงของตัวสแกน Android',
      smart:'Smart Scan', smartSub:'ตรวจ shared storage ที่เข้าถึงได้ อ่านตัวอย่างเนื้อหา และยืนยันไฟล์ซ้ำในจุดสำคัญ', smartBadge:'แนะนำ',
      quick:'Quick Scan', quickSub:'ตรวจ shared storage ที่เข้าถึงได้ทั้งหมดด้วย metadata และกฎที่ใช้ทรัพยากรต่ำ เน้นความเร็ว',
      deep:'Deep Scan', deepSub:'ตรวจ shared storage ที่เข้าถึงได้ทั้งหมด อ่านเนื้อหาแบบ streaming จนครบ และยืนยันไฟล์ซ้ำแบบ exact',
      custom:'Custom Scan', customSub:'เลือกหมวด shared storage และกำหนดว่าจะยืนยันไฟล์ซ้ำหรือไม่',
      cancel:'ยกเลิก', customTitle:'Custom Scan', downloads:'ดาวน์โหลด', photos:'รูปภาพ', videos:'วิดีโอ', documents:'เอกสาร', music:'เพลง', verify:'ยืนยันไฟล์ซ้ำแบบ exact', start:'เริ่ม Custom Scan',
      permission:'ต้องอนุญาตสิทธิ์เข้าถึงไฟล์ใน Settings ของ Android ก่อนเริ่มสแกน', busy:'มีการสแกนทำงานอยู่แล้ว', failed:'Bearagnostic ตรวจไม่สำเร็จ', cancelled:'ยกเลิกการตรวจแล้ว',
      ready:'พร้อม', scanning:'กำลังตรวจ', complete:'เสร็จแล้ว', idleTitle:'พร้อมตรวจเครื่องแล้ว', idleSub:'เลือกโหมดสแกน คุณหมอแบร์จะตรวจเฉพาะพื้นที่ที่ Android อนุญาต', runningTitle:'กำลังตรวจอย่างละเอียด', runningSub:'เครื่องที่เป็นระเบียบขึ้น ก็ทำให้ทุกอย่างลื่นขึ้น', doneTitle:'ตรวจเครื่องเรียบร้อย', doneSub:'ตรวจพื้นที่ที่ Android อนุญาตสำหรับรอบนี้แล้วภายในเครื่อง',
      quoteIdle:'ไฟล์ของคุณ คุณเป็นคนเลือก', quoteRunning:'กำลังดูให้ละเอียด การตรวจที่ดีไม่ต้องรีบ', quoteDone:'เรียบร้อย ตัวเลขทั้งหมดมาจากการสแกนจริง',
      tip:'Bearagnostic วิเคราะห์ไฟล์ที่เข้าถึงได้ภายในเครื่องนี้',
      home:'หน้าหลัก', nextSteps:'แผนทำความสะอาด', nextLead:'ผลสแกนพร้อมแล้ว ทุกอย่างยังคงเดิมจนกว่าคุณจะเป็นคนเลือก',
      reviewClean:'ตรวจและทำความสะอาด', reviewCleanSub:'เฉพาะรายการความเสี่ยงต่ำที่ตรวจพบจริง', noLowRisk:'ไม่พบรายการที่เหมาะกับการลบอัตโนมัติแบบความเสี่ยงต่ำ ให้ตรวจหมวดด้านล่างแทน',
      duplicatesAction:'ไฟล์ซ้ำตรงกัน', largeAction:'ไฟล์ขนาดใหญ่', oldAction:'ไฟล์เก่า', tempAction:'ไฟล์ชั่วคราว', installersAction:'ไฟล์ติดตั้ง APK', archivesAction:'ไฟล์บีบอัด',
      review:'ตรวจรายการ', scanAgain:'สแกนอีกครั้ง', close:'ปิด', viewResults:'ดูคำแนะนำ',
      reviewTitle:'ตรวจรายการไฟล์', selected:'เลือกแล้ว', deleteSelected:'ลบที่เลือก', deleteTitle:'ลบไฟล์ที่เลือก?', deleteBody:'Bearagnostic จะลบถาวรเฉพาะไฟล์ที่คุณเลือก การลบนี้ย้อนกลับไม่ได้', deleteNow:'ลบไฟล์',
      keep:'เก็บไว้', lowRisk:'ความเสี่ยงต่ำ', needsReview:'ต้องตรวจ', protectedCopy:'เก็บอย่างน้อยหนึ่งสำเนา', loadMore:'โหลดเพิ่ม', resultsUpdated:'ทำความสะอาดเรียบร้อย', reclaimed:'คืนพื้นที่', deleted:'ไฟล์ที่ลบ', rescanNote:'ผลลัพธ์อัปเดตแล้ว สแกนใหม่เฉพาะเมื่ออยากตรวจทั้งเครื่องอีกครั้ง', backResults:'กลับผลลัพธ์',
      resultHeroTitle:'เห็นภาพพื้นที่ชัดขึ้นแล้ว', resultHeroLow:'พบรายการความเสี่ยงต่ำที่พร้อมให้ตรวจ และ Bearagnostic จะถามยืนยันก่อนลบเสมอ', resultHeroReview:'รอบนี้ไม่มีรายการที่ควรลบแบบคลิกเดียว ซึ่งเป็นสิ่งที่ตั้งใจไว้ เลือกตรวจเฉพาะหมวดที่คุณต้องการได้', resultHeroClear:'ผลสแกนนี้ยังไม่มีรายการที่ต้องตรวจเพื่อทำความสะอาด', overviewTitle:'ภาพรวม', readyNow:'พร้อมทำความสะอาด', reviewItems:'รายการให้ตรวจ', categoriesFound:'หมวดที่พบ', items:'รายการ', sessionTitle:'รอบนี้', sessionEmpty:'ยังไม่ได้ลบไฟล์', safetyTitle:'ปกป้องข้อมูลเป็นหลัก', safetyBody:'ไฟล์ใหญ่ ไฟล์เก่า APK และไฟล์บีบอัดจะไม่ถูกเลือกลบอัตโนมัติ ส่วนไฟล์ซ้ำจะเก็บไว้อย่างน้อยหนึ่งสำเนา', zeroAction:'ไฟล์ขนาด 0 ไบต์', resultKicker:'สแกนเสร็จแล้ว', reviewByCategory:'ตรวจตามหมวด', scanFacts:'ข้อมูลการสแกน', filesReviewedLabel:'ไฟล์ที่ตรวจแล้ว', localLabel:'ทำงานบนเครื่อง', modeLabel:'โหมด', recommendFirst:'แนะนำให้เริ่มตรงนี้', startHere:'เริ่มตรวจ', spaceReclaimed:'พื้นที่ที่คืนได้',
      reason_stale_incomplete_download:'ไฟล์ดาวน์โหลดไม่สมบูรณ์ที่ค้างมานาน', reason_temporary_artifact:'ไฟล์ชั่วคราว — ควรตรวจก่อน', reason_verified_duplicate:'ยืนยันแล้วว่าเป็นสำเนาที่ตรงกัน', reason_large_file:'ไฟล์ใหญ่ — ขนาดไม่ได้แปลว่าเป็นขยะ', reason_old_file:'ไฟล์เก่า — อายุไฟล์ไม่ได้แปลว่าเป็นขยะ', reason_apk_installer:'ไฟล์ติดตั้ง APK ที่ดาวน์โหลดไว้', reason_archive_file:'ไฟล์บีบอัด — อาจเป็นสำเนาเดียว', reason_zero_byte:'ไฟล์ขนาด 0 ไบต์ — ควรดูบริบท'
    },
    ja:{
      eyebrow:'スキャン深度', title:'スキャンの深さを選択', lead:'元の Bearagnostic 画面はそのままに、Android の実際の解析量だけを選びます。',
      smart:'Smart Scan', smartSub:'アクセス可能な共有ストレージ、内容サンプル、重要場所の重複検証。', smartBadge:'おすすめ',
      quick:'Quick Scan', quickSub:'アクセス可能な共有ストレージ全体をメタデータと軽量ルールで高速確認。',
      deep:'Deep Scan', deepSub:'アクセス可能な共有ストレージ全体を最後まで読み、重複も完全一致で検証。',
      custom:'Custom Scan', customSub:'共有ストレージのカテゴリと重複検証を選択。',
      cancel:'キャンセル', customTitle:'Custom Scan', downloads:'ダウンロード', photos:'写真', videos:'動画', documents:'書類', music:'音楽', verify:'完全一致の重複を検証', start:'Custom Scan を開始',
      permission:'スキャンには Android のストレージアクセス許可が必要です。', busy:'すでにスキャン中です。', failed:'チェックを完了できませんでした。', cancelled:'チェックを中止しました。',
      ready:'準備完了', scanning:'チェック中', complete:'完了', idleTitle:'チェックの準備ができました', idleSub:'スキャン方法を選択してください。Android が許可する範囲のみ確認します。', runningTitle:'丁寧に確認中', runningSub:'端末をすっきり。毎日を軽やかに。', doneTitle:'チェック完了', doneSub:'アクセス可能な範囲を端末内で確認しました。',
      quoteIdle:'選ぶのは、あなた。', quoteRunning:'丁寧に確認中。診断は急ぎません。', quoteDone:'完了しました。表示値は実際のネイティブスキャン結果です。',
      tip:'Bearagnostic はアクセス可能なファイルを端末内で解析します。',
      home:'ホーム', nextSteps:'クリーンアッププラン', nextLead:'スキャン結果を整理しました。選択するまで何も削除されません。',
      reviewClean:'確認してクリーンアップ', reviewCleanSub:'実際に見つかった低リスク候補のみ', noLowRisk:'自動クリーンアップ向けの低リスク候補はありません。下のカテゴリを確認してください。',
      duplicatesAction:'完全一致の重複', largeAction:'大きいファイル', oldAction:'古いファイル', tempAction:'一時ファイル', installersAction:'APK インストーラー', archivesAction:'アーカイブ',
      review:'確認', scanAgain:'再スキャン', close:'閉じる', viewResults:'おすすめを見る',
      reviewTitle:'ファイルを確認', selected:'選択済み', deleteSelected:'選択項目を削除', deleteTitle:'選択したファイルを削除しますか？', deleteBody:'選択したファイルだけを完全に削除します。この操作は元に戻せません。', deleteNow:'削除',
      keep:'保持', lowRisk:'低リスク', needsReview:'要確認', protectedCopy:'1つは保持', loadMore:'さらに表示', resultsUpdated:'クリーンアップ完了', reclaimed:'解放', deleted:'削除したファイル', rescanNote:'結果は更新済みです。端末全体を改めて確認したい場合のみ再スキャンしてください。', backResults:'結果へ戻る',
      resultHeroTitle:'ストレージの状況が見えました', resultHeroLow:'低リスク項目を確認できます。削除前には Bearagnostic が必ず確認します。', resultHeroReview:'今回はワンタップ削除に適した項目はありません。必要なカテゴリだけ確認できます。', resultHeroClear:'このスキャンには現在クリーンアップ確認が必要な項目はありません。', overviewTitle:'概要', readyNow:'クリーンアップ候補', reviewItems:'確認項目', categoriesFound:'カテゴリ', items:'項目', sessionTitle:'今回', sessionEmpty:'まだ削除していません', safetyTitle:'保護を優先した設計', safetyBody:'大容量・古い・APK・アーカイブは自動選択しません。重複ファイルも必ず1つ以上残します。', zeroAction:'0 バイトファイル', resultKicker:'スキャン完了', reviewByCategory:'カテゴリ別に確認', scanFacts:'スキャン情報', filesReviewedLabel:'確認済みファイル', localLabel:'端末内処理', modeLabel:'モード', recommendFirst:'最初におすすめ', startHere:'ここから確認', spaceReclaimed:'解放した容量',
      reason_stale_incomplete_download:'古い未完了ダウンロード', reason_temporary_artifact:'一時ファイル — 要確認', reason_verified_duplicate:'同一コピーを確認済み', reason_large_file:'大きいファイル — サイズだけでは不要とは限りません', reason_old_file:'古いファイル — 日付だけでは不要とは限りません', reason_apk_installer:'ダウンロード済み APK', reason_archive_file:'アーカイブ — 唯一のコピーかもしれません', reason_zero_byte:'0 バイトファイル — 状況を確認'
    }
  };
  const text = (key) => COPY[currentLanguage()]?.[key] || COPY.en[key] || key;

  function trustCopy() {
    const lang=currentLanguage();
    if(lang==='th') return {
      moreTitle:'การตั้งค่าและการสนับสนุน', moreSub:'ความเป็นส่วนตัว ความช่วยเหลือ การสนับสนุน และข้อมูลแอพ',
      safe:'ลบได้อย่างมั่นใจ', review:'ตรวจสอบก่อนลบ', protected:'ปกป้องไว้',
      lowriskTitle:'รายการความเสี่ยงต่ำ', lowriskBody:'รายการเหล่านี้ผ่านกฎความเสี่ยงต่ำของ Bearagnostic แล้ว ระบบยังให้คุณตรวจและยืนยันก่อนลบเสมอ',
      duplicatesTitle:'ไฟล์ซ้ำตรงกัน', duplicatesBody:'เป็นสำเนาที่ตรวจยืนยันแล้ว ระบบจะเก็บไว้อย่างน้อยหนึ่งสำเนาเสมอ',
      largeTitle:'ไฟล์ขนาดใหญ่', largeBody:'ขนาดใหญ่ไม่ได้แปลว่าเป็นขยะ อาจเป็นวิดีโอ งาน หรือไฟล์สำรองสำคัญ ควรเปิดดูบริบทก่อนลบ',
      oldTitle:'ไฟล์เก่า', oldBody:'อายุไฟล์เพียงอย่างเดียวไม่ใช่เหตุผลให้ลบ ตรวจว่าไฟล์ยังมีคุณค่าหรือเป็นสำเนาที่ต้องเก็บไว้หรือไม่',
      temporaryTitle:'ไฟล์ชั่วคราว', temporaryBody:'บางรายการอาจเป็นไฟล์ดาวน์โหลดที่ไม่สมบูรณ์ แต่ไฟล์ชั่วคราวบางชนิดยังมีประโยชน์ ควรตรวจรายการที่ไม่ได้ถูกจัดเป็นความเสี่ยงต่ำ',
      installersTitle:'ไฟล์ติดตั้ง APK', installersBody:'ลบไฟล์ APK จะไม่ถอนแอปที่ติดตั้งแล้ว แต่จะลบตัวติดตั้งออกจากเครื่อง เก็บไว้ถ้ายังต้องใช้ติดตั้งซ้ำ',
      archivesTitle:'ไฟล์บีบอัด', archivesBody:'ไฟล์ ZIP หรือ archive อาจเป็นสำเนาเดียวของข้อมูลที่รวมไว้ ควรตรวจเนื้อหาหรือที่มาของไฟล์ก่อนลบ',
      zeroTitle:'ไฟล์ 0 ไบต์', zeroBody:'ไฟล์ว่างอาจไม่มีข้อมูล แต่บางแอปใช้เป็นตัวบ่งชี้หรือ placeholder จึงควรดูตำแหน่งก่อนลบ',
      reviewTitle:'คำแนะนำจาก Dr. Bear', destructiveTitle:'ตรวจอีกครั้งก่อนลบ', destructiveBody:'การลบครั้งนี้เป็นการลบถาวรเฉพาะรายการที่เลือก ตรวจชื่อ ตำแหน่ง และผลกระทบให้แน่ใจก่อนยืนยัน',
      impactTitle:'ผลหลังทำความสะอาด', verifiedSpace:'พื้นที่ที่คืนได้จริง', freeStorage:'พื้นที่ว่าง', filesRemoved:'ไฟล์ที่ลบ', duplicatesResolved:'สำเนาซ้ำที่จัดการ', protectedKept:'สำเนาที่ปกป้องไว้', lowRiskResolved:'งานความเสี่ยงต่ำที่จัดการแล้ว',
      share:'แชร์ผลลัพธ์', shareTitle:'ผลการทำความสะอาด Bearagnostic', shareIntro:'Bearagnostic ทำความสะอาดโดยใช้ผลลัพธ์ที่ยืนยันได้จากเครื่องนี้',
      shareUnavailable:'ยังไม่สามารถเปิดหน้าต่างแชร์ได้', proof:'นับเฉพาะไฟล์ที่ Android ยืนยันว่าลบสำเร็จแล้ว',
      supportOnline:'QR PromptPay ต้องใช้อินเทอร์เน็ตเฉพาะตอนเปิดหน้าสนับสนุน ข้อมูลไฟล์และผลสแกนยังคงอยู่ในเครื่อง',
      planFree:'Bearagnostic Free', planComing:'โครงสร้าง Pro จะเพิ่มในขั้นถัดไป โดยความปลอดภัยและคำเตือนจะไม่ถูกล็อกหลัง Paywall'
    };
    if(lang==='ja') return {
      moreTitle:'設定とサポート', moreSub:'プライバシー、ヘルプ、サポート、アプリ情報',
      safe:'安心して削除', review:'削除前に確認', protected:'保護',
      lowriskTitle:'低リスク項目', lowriskBody:'Bearagnostic の低リスクルールを満たしています。それでも削除前には必ず内容を確認して承認できます。',
      duplicatesTitle:'完全一致の重複', duplicatesBody:'同一コピーとして検証済みです。Bearagnostic は必ず1つ以上のコピーを残します。',
      largeTitle:'大きいファイル', largeBody:'大きいだけで不要とは限りません。動画、仕事用データ、バックアップの可能性があるため内容を確認してください。',
      oldTitle:'古いファイル', oldBody:'古さだけでは削除理由になりません。まだ必要か、唯一のコピーではないか確認してください。',
      temporaryTitle:'一時ファイル', temporaryBody:'未完了ダウンロードなど低リスクのものもありますが、すべての一時ファイルが不要とは限りません。',
      installersTitle:'APK インストーラー', installersBody:'APK を削除してもインストール済みアプリは削除されません。再インストール用に必要なら残してください。',
      archivesTitle:'アーカイブ', archivesBody:'ZIP などのアーカイブは唯一の保管コピーかもしれません。中身や保存元を確認してから削除してください。',
      zeroTitle:'0 バイトファイル', zeroBody:'中身がなくても、一部のアプリが目印として使う場合があります。場所を確認してから削除してください。',
      reviewTitle:'Dr. Bear のアドバイス', destructiveTitle:'削除前にもう一度確認', destructiveBody:'選択した項目は完全に削除されます。名前、場所、影響を確認してから実行してください。',
      impactTitle:'クリーンアップ結果', verifiedSpace:'実際に解放した容量', freeStorage:'空き容量', filesRemoved:'削除ファイル', duplicatesResolved:'整理した重複コピー', protectedKept:'保護したコピー', lowRiskResolved:'低リスク項目の完了率',
      share:'結果を共有', shareTitle:'Bearagnostic クリーンアップ結果', shareIntro:'Bearagnostic は端末上で確認できた結果だけを集計しました。',
      shareUnavailable:'共有画面を開けませんでした', proof:'Android が削除成功を確認したファイルだけを集計しています。',
      supportOnline:'PromptPay QR の表示時のみネット接続を使用します。ファイル解析とスキャン結果は端末内のままです。',
      planFree:'Bearagnostic Free', planComing:'Pro は次の段階で追加予定です。安全説明や警告は有料化しません。'
    };
    return {
      moreTitle:'Settings & Support', moreSub:'Privacy, help, support and app details',
      safe:'Safe to clean', review:'Review first', protected:'Protected',
      lowriskTitle:'Low-risk cleanup', lowriskBody:'These items meet Bearagnostic’s low-risk rules. You still review and confirm before anything is permanently deleted.',
      duplicatesTitle:'Exact duplicates', duplicatesBody:'These copies were verified as identical. Bearagnostic always protects at least one copy.',
      largeTitle:'Large files', largeBody:'Large does not mean junk. This may be a video, project file or backup, so review the context before deleting.',
      oldTitle:'Older files', oldBody:'Age alone is not a reason to delete a file. Check whether it is still useful or the only copy you have.',
      temporaryTitle:'Temporary files', temporaryBody:'Some stale incomplete downloads are low risk, but not every temporary-looking file is disposable. Review anything not marked low risk.',
      installersTitle:'APK installers', installersBody:'Deleting an APK does not uninstall an app that is already installed. Keep the installer if you may need it again.',
      archivesTitle:'Archives', archivesBody:'A ZIP or archive can contain the only packaged copy of important files. Review its contents or source before deleting.',
      zeroTitle:'Zero-byte files', zeroBody:'An empty file has no payload, but some apps use placeholders or marker files. Review its location before deleting.',
      reviewTitle:'Dr. Bear’s advice', destructiveTitle:'One last check before deleting', destructiveBody:'This permanently removes only the selected items. Review the names, locations and consequences before confirming.',
      impactTitle:'Cleanup impact', verifiedSpace:'Verified space reclaimed', freeStorage:'Free storage', filesRemoved:'Files removed', duplicatesResolved:'Duplicate copies resolved', protectedKept:'Protected copies kept', lowRiskResolved:'Low-risk cleanup resolved',
      share:'Share result', shareTitle:'Bearagnostic cleanup result', shareIntro:'Bearagnostic counted only results verified on this device.',
      shareUnavailable:'The Android share sheet could not be opened.', proof:'Only files Android confirmed as deleted are counted here.',
      supportOnline:'PromptPay QR uses the internet only when you open Support. File analysis and scan results remain on device.',
      planFree:'Bearagnostic Free', planComing:'Pro architecture arrives next. Safety guidance and warnings will never be paywalled.'
    };
  }

  function adviceFor(category) {
    const c=trustCopy();
    const map={
      lowrisk:{level:'safe',title:c.lowriskTitle,body:c.lowriskBody,mascot:'success'},
      duplicates:{level:'safe',title:c.duplicatesTitle,body:c.duplicatesBody,mascot:'success'},
      large:{level:'review',title:c.largeTitle,body:c.largeBody,mascot:'review'},
      old:{level:'review',title:c.oldTitle,body:c.oldBody,mascot:'review'},
      temporary:{level:'review',title:c.temporaryTitle,body:c.temporaryBody,mascot:'review'},
      installers:{level:'review',title:c.installersTitle,body:c.installersBody,mascot:'review'},
      archives:{level:'review',title:c.archivesTitle,body:c.archivesBody,mascot:'caution'},
      zero:{level:'review',title:c.zeroTitle,body:c.zeroBody,mascot:'review'}
    };
    return map[category]||{level:'review',title:c.reviewTitle,body:c.destructiveBody,mascot:'review'};
  }

  function mascotPath(name) { return `./assets/native/mascot/drbear-${name}.png`; }
  function getStorageSnapshot() { return parseJson(NATIVE.getStorageSnapshot?.(),{}); }
  function percent(value) { const n=Number(value); return Number.isFinite(n)?`${n.toFixed(1)}%`:'—'; }

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
      .native-home-button{width:40px;height:40px;border:0;background:transparent;box-shadow:none;display:grid;place-items:center;padding:3px;flex:0 0 auto;color:#8797a7}.native-home-button svg{width:29px;height:29px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 2px 2px rgba(55,81,107,.09))}.native-home-button[hidden]{display:none!important}
      #browserFullscreenRow{display:none!important}
      .preferences-scroll{padding-bottom:12px!important}
      .native-pref-extension{display:grid;gap:10px;margin-top:11px;padding-bottom:10px}
      .native-pref-card{border-radius:24px;background:rgba(255,255,255,.88);border:1px solid rgba(96,126,155,.09);box-shadow:0 10px 28px rgba(64,96,128,.055),inset 0 1px 0 rgba(255,255,255,.96);overflow:hidden}
      .native-pref-card__head{display:flex;gap:11px;align-items:center;padding:13px 15px 10px}.native-pref-orb{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(145deg,#edf8ff,#e9f3fb);color:#278fd4;flex:0 0 auto}.native-pref-orb.mint{background:linear-gradient(145deg,#ecfaf6,#e8f7f2);color:#28997f}.native-pref-orb.violet{background:linear-gradient(145deg,#f2effc,#edeafd);color:#7668c2}.native-pref-orb svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.native-pref-card__head strong{display:block;font-size:13px;color:#20354b}.native-pref-card__head small{display:block;margin-top:3px;font-size:9px;line-height:1.3;color:#8493a3}
      .native-pref-rows{padding:0 15px 7px}.native-pref-row{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:44px;border-top:1px solid rgba(104,132,160,.09)}.native-pref-row:first-child{border-top:0}.native-pref-row span{font-size:10px;color:#4d6175}.native-pref-row b{font-size:9px;color:#2c8ec8;font-weight:750;text-align:right}.native-pref-row b.mint{color:#1b9276}.native-pref-row b.slate{color:#718397}
      .native-pref-action{border:0;background:transparent;padding:0;color:inherit;font:inherit;text-align:right}

      .native-results-sheet,.native-review-sheet,.native-confirm-sheet,.native-clean-summary{position:fixed;inset:0;z-index:1450;background:rgba(236,245,252,.96);backdrop-filter:blur(18px);padding:max(14px,env(safe-area-inset-top)) 14px max(14px,env(safe-area-inset-bottom));overflow:hidden}.native-results-sheet[hidden],.native-review-sheet[hidden],.native-confirm-sheet[hidden],.native-clean-summary[hidden]{display:none!important}
      .native-results-panel,.native-review-panel,.native-clean-panel{height:100%;max-width:560px;margin:0 auto;background:linear-gradient(180deg,rgba(255,255,255,.985),rgba(247,251,255,.985));border:1px solid rgba(255,255,255,.98);border-radius:30px;box-shadow:0 18px 55px rgba(41,76,113,.15);overflow:hidden;display:grid;grid-template-rows:auto auto minmax(0,1fr) auto}.native-sheet-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 17px 10px}.native-sheet-head h2{font-size:22px;letter-spacing:-.03em;margin:0}.native-sheet-head p{margin:3px 0 0;color:#8794a2;font-size:11px}.native-icon-button{width:40px;height:40px;border-radius:14px;background:#eef5fa;color:#4e6479;font-size:20px;display:grid;place-items:center}.native-result-hero{margin:0 16px 12px;padding:15px;border-radius:22px;background:linear-gradient(135deg,#eaf8ff,#f4fbff 54%,#edf9f6);border:1px solid #fff}.native-result-hero strong{display:block;font-size:15px}.native-result-hero p{font-size:11px;line-height:1.42;color:#718398;margin:5px 0 0}.native-results-scroll{overflow:auto;padding:0 16px 12px;overscroll-behavior:contain}.native-primary-action{width:100%;min-height:70px;border-radius:22px;padding:12px 14px;text-align:left;color:white;background:linear-gradient(118deg,#21b9ed,#0b80ec);box-shadow:0 12px 24px rgba(11,132,232,.18);display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center}.native-primary-action strong{font-size:17px}.native-primary-action small{display:block;color:rgba(255,255,255,.82);font-size:10px;margin-top:4px}.native-primary-action b{font-size:18px}.native-action-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px}.native-result-action{min-height:74px;border-radius:20px;background:#fff;border:1px solid rgba(95,125,154,.11);box-shadow:0 7px 20px rgba(67,101,136,.06);padding:11px;text-align:left}.native-result-action strong{display:block;font-size:13px}.native-result-action small{display:block;font-size:10px;color:#8b97a5;margin-top:5px}.native-results-footer{display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:11px 16px 16px}.native-secondary{height:46px;border-radius:17px;background:#edf4f9;color:#51657a;font-weight:700}.native-secondary--blue{background:#e8f6fe;color:#087ed8}.native-review-panel{grid-template-rows:auto auto minmax(0,1fr) auto}.native-review-summary{padding:0 17px 10px;color:#73859a;font-size:11px;display:flex;justify-content:space-between}.native-review-list{overflow:auto;padding:0 14px 14px;overscroll-behavior:contain}.native-file-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;background:#fff;border:1px solid rgba(91,120,149,.10);border-radius:17px;padding:11px;margin-bottom:8px}.native-file-row input{width:19px;height:19px;accent-color:#128fe9}.native-file-copy{min-width:0}.native-file-copy strong{display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.native-file-copy small{display:block;font-size:9px;color:#8d99a7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px}.native-file-meta{text-align:right}.native-file-meta b{display:block;font-size:10px}.native-risk{display:inline-block;font-size:8px;border-radius:99px;padding:3px 6px;margin-top:4px;background:#eef4f8;color:#6a7b8f}.native-risk.low{background:#e5f8f2;color:#16896f}.native-risk.keep{background:#edf5ff;color:#3477b5}.native-load-more{width:100%;height:42px;border-radius:15px;background:#edf4f9;color:#51657a;font-weight:700}.native-review-footer{padding:10px 14px 14px;background:rgba(250,253,255,.97);border-top:1px solid rgba(91,120,149,.08);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px;align-items:center}.native-selection-copy strong{display:block;font-size:13px}.native-selection-copy small{font-size:9px;color:#8794a2}.native-delete-button{height:46px;border-radius:17px;background:#162b44;color:white;padding:0 16px;font-weight:700}.native-delete-button:disabled{opacity:.42}.native-confirm-sheet{display:grid;place-items:center;background:rgba(13,28,48,.34)}.native-confirm-panel{width:min(92%,430px);background:#fff;border-radius:26px;padding:18px;box-shadow:0 20px 60px rgba(20,42,67,.23)}.native-confirm-panel h3{margin:0;font-size:19px}.native-confirm-panel p{font-size:11px;line-height:1.5;color:#76879a}.native-confirm-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.native-danger{height:46px;border-radius:16px;background:#c94650;color:white;font-weight:750}.native-clean-panel{grid-template-rows:1fr;place-items:center;text-align:center;padding:24px}.native-clean-card{max-width:420px}.native-clean-card .native-clean-check{width:74px;height:74px;border-radius:50%;display:grid;place-items:center;margin:0 auto 15px;background:linear-gradient(145deg,#dffbf5,#eaf8ff);color:#159d82;font-size:34px}.native-clean-card h2{font-size:23px;margin:0}.native-clean-metric{font-size:32px;font-weight:800;color:#128fe9;margin:12px 0 2px}.native-clean-card p{font-size:11px;color:#7d8c9e;line-height:1.45}.native-clean-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}.native-empty{padding:30px 14px;text-align:center;color:#8695a5;font-size:12px}
      .native-results-scroll{display:flex;flex-direction:column;min-height:0}.native-results-section-label{font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#7890a8;font-weight:800;margin:14px 2px 7px}.native-overview-card{margin-top:12px;padding:13px;border-radius:21px;background:linear-gradient(145deg,#f5faff,#eef8fc);border:1px solid rgba(110,145,177,.10)}.native-overview-card>strong{display:block;font-size:13px;margin-bottom:9px}.native-overview-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.native-overview-metric{min-width:0;border-radius:15px;background:rgba(255,255,255,.82);padding:9px 7px;text-align:center;border:1px solid rgba(255,255,255,.95)}.native-overview-metric b{display:block;font-size:14px;color:#17304b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.native-overview-metric span{display:block;font-size:8px;color:#8292a4;margin-top:3px;line-height:1.2}.native-session-card,.native-safety-card{margin-top:9px;border-radius:18px;padding:11px 12px;display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:center}.native-session-card{background:linear-gradient(135deg,#eefbf7,#f7fcff);border:1px solid rgba(53,168,138,.10)}.native-safety-card{background:#fff;border:1px solid rgba(95,125,154,.10);box-shadow:0 6px 18px rgba(67,101,136,.04);margin-bottom:2px}.native-result-icon{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;font-size:16px;background:#e9f8f4;color:#169578}.native-safety-card .native-result-icon{background:#edf6fd;color:#2589d6}.native-session-card strong,.native-safety-card strong{display:block;font-size:11px}.native-session-card small,.native-safety-card small{display:block;font-size:9px;color:#8290a1;line-height:1.35;margin-top:2px}.native-results-footer{background:rgba(250,253,255,.94);border-top:1px solid rgba(91,120,149,.06)}\n      /* Premium results cockpit — final override layer */\n      .native-results-sheet,.native-review-sheet,.native-clean-summary{background:radial-gradient(circle at 78% 2%,rgba(129,213,255,.22),transparent 34%),linear-gradient(180deg,#edf6fc 0%,#e8f2f9 100%);padding:max(10px,env(safe-area-inset-top)) 10px max(10px,env(safe-area-inset-bottom));}\n      .native-results-panel{height:100%;max-width:560px;margin:0 auto;border-radius:34px;background:linear-gradient(180deg,rgba(253,254,255,.992),rgba(247,251,254,.992));border:1px solid rgba(255,255,255,.94);box-shadow:0 24px 70px rgba(29,59,91,.18),inset 0 1px 0 rgba(255,255,255,.95);overflow:hidden;display:grid;grid-template-rows:auto minmax(0,1fr) auto;}\n      .native-results-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:18px 18px 10px;}\n      .native-results-eyebrow{display:block;font-size:8px;line-height:1;letter-spacing:.22em;text-transform:uppercase;color:#4c93c4;font-weight:800;margin-bottom:8px;}\n      .native-results-header h2{font-size:24px;line-height:1.05;letter-spacing:-.038em;color:#14243a;margin:0;font-weight:760;}\n      .native-results-header p{font-size:10px;line-height:1.35;color:#8694a3;margin:6px 0 0;max-width:270px;}\n      .native-icon-button{width:40px;height:40px;border-radius:15px;background:rgba(239,246,251,.94);border:1px solid rgba(113,145,174,.09);box-shadow:0 5px 14px rgba(57,91,123,.06);color:#536b80;font-size:19px;}\n      .native-results-scroll{overflow:auto;min-height:0;padding:0 18px 14px;overscroll-behavior:contain;scrollbar-width:none;display:block}.native-results-scroll::-webkit-scrollbar{display:none}\n      .native-result-hero{position:relative;overflow:hidden;margin:0;padding:16px;border-radius:26px;background:linear-gradient(135deg,#f0f9ff 0%,#f8fcff 52%,#eef9f6 100%);border:1px solid rgba(255,255,255,.96);box-shadow:0 10px 30px rgba(63,105,142,.07),inset 0 1px 0 rgba(255,255,255,.96);}\n      .native-result-hero:after{content:'';position:absolute;right:-28px;top:-36px;width:128px;height:128px;border-radius:50%;background:radial-gradient(circle,rgba(25,159,231,.14),rgba(25,159,231,0) 67%);pointer-events:none}\n      .native-result-kicker{font-size:7px;letter-spacing:.2em;text-transform:uppercase;color:#6d8da8;font-weight:850;position:relative;z-index:1}\n      .native-result-hero strong{display:block;font-size:18px;line-height:1.12;letter-spacing:-.025em;color:#172b43;margin-top:7px;position:relative;z-index:1}\n      .native-result-hero p{font-size:10px;line-height:1.45;color:#718398;margin:6px 0 0;max-width:92%;position:relative;z-index:1}\n      .native-hero-metrics{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:13px;position:relative;z-index:1}\n      .native-hero-metric{background:rgba(255,255,255,.78);border:1px solid rgba(255,255,255,.94);border-radius:17px;padding:10px 11px;min-width:0}\n      .native-hero-metric b{display:block;font-size:16px;line-height:1;color:#15324f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.native-hero-metric span{display:block;font-size:8px;color:#8795a4;margin-top:5px}\n      .native-primary-action{width:100%;min-height:66px;margin-top:10px;border-radius:22px;padding:11px 13px;color:white;background:linear-gradient(118deg,#23b5e7 0%,#138dde 48%,#147be9 100%);box-shadow:0 13px 26px rgba(17,132,222,.19),inset 0 1px 0 rgba(255,255,255,.22);display:grid;grid-template-columns:36px minmax(0,1fr) auto;align-items:center;gap:10px;text-align:left}\n      .native-primary-orb{width:36px;height:36px;border-radius:13px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);display:grid;place-items:center}.native-primary-orb svg{width:19px;height:19px;fill:none;stroke:white;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}\n      .native-primary-action strong{font-size:15px;line-height:1.1}.native-primary-action small{display:block;color:rgba(255,255,255,.78);font-size:9px;line-height:1.3;margin-top:4px}.native-primary-action b{font-size:17px;font-weight:500;opacity:.85}\n      .native-results-section-head{display:flex;align-items:end;justify-content:space-between;gap:10px;margin:14px 2px 7px}.native-results-section-head strong{font-size:12px;color:#253a50}.native-results-section-head small{font-size:8px;color:#8a98a7}\n      .native-action-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:0}\n      .native-result-action{position:relative;min-height:88px;border-radius:20px;background:rgba(255,255,255,.91);border:1px solid rgba(91,126,158,.09);box-shadow:0 7px 22px rgba(60,94,128,.05),inset 0 1px 0 rgba(255,255,255,.95);padding:11px;text-align:left;display:grid;grid-template-columns:31px minmax(0,1fr);grid-template-rows:auto auto;column-gap:9px;align-content:center;overflow:hidden}\n      .native-result-action:after{content:'';position:absolute;inset:auto 0 0;height:2px;background:var(--accent,#35a9e5);opacity:.65}.native-category-icon{grid-row:1/3;width:31px;height:31px;border-radius:11px;display:grid;place-items:center;background:rgba(53,169,229,.09);color:var(--accent,#35a9e5)}.native-category-icon svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}\n      .native-result-action:last-child:nth-child(odd){grid-column:1/-1;min-height:72px}.native-result-action strong{font-size:11px;line-height:1.18;color:#1d3046;align-self:end}.native-result-action small{display:block;font-size:8px;line-height:1.25;color:#8996a4;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;align-self:start}.native-result-action[data-tone='amber']{--accent:#c9952d}.native-result-action[data-tone='violet']{--accent:#7d70ce}.native-result-action[data-tone='mint']{--accent:#35a889}.native-result-action[data-tone='slate']{--accent:#6d88a5}.native-result-action[data-tone='sand']{--accent:#a87e54}.native-result-action[data-tone='gray']{--accent:#8594a3}\n      .native-facts-card{margin-top:10px;border-radius:20px;padding:11px 12px;background:linear-gradient(145deg,#f5f9fc,#f0f6fa);border:1px solid rgba(95,125,154,.08)}.native-facts-title{display:block;font-size:10px;color:#32475c;margin-bottom:8px}.native-facts-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.native-fact{min-width:0;padding:8px 7px;border-radius:13px;background:rgba(255,255,255,.78);text-align:center}.native-fact b{display:block;font-size:12px;color:#20364e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.native-fact span{display:block;font-size:7px;color:#8d99a7;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n      .native-bottom-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.native-session-card,.native-safety-card{margin:0;border-radius:18px;padding:10px 11px;display:block;min-height:78px}.native-session-card{background:linear-gradient(145deg,#eefaf6,#f7fcff);border:1px solid rgba(49,163,137,.09)}.native-safety-card{background:#fff;border:1px solid rgba(95,125,154,.09);box-shadow:0 6px 18px rgba(67,101,136,.035)}.native-session-card strong,.native-safety-card strong{display:block;font-size:10px;color:#253b50}.native-session-card small,.native-safety-card small{display:block;font-size:8px;line-height:1.35;color:#8391a0;margin-top:5px}.native-mini-symbol{width:24px;height:24px;border-radius:9px;display:grid;place-items:center;margin-bottom:7px;background:#e7f7f2;color:#178f75;font-size:12px;font-weight:800}.native-safety-card .native-mini-symbol{background:#eef6fc;color:#3688c6}\n      .native-results-footer{display:grid;grid-template-columns:.86fr 1.14fr;gap:9px;padding:10px 18px 17px;background:linear-gradient(180deg,rgba(249,252,254,.82),#fbfdff 40%);border-top:1px solid rgba(91,120,149,.06)}.native-secondary{height:47px;border-radius:17px;background:#edf3f7;color:#54687a;font-weight:720;font-size:11px}.native-secondary--blue{background:linear-gradient(145deg,#e8f6fe,#edf9ff);color:#087ed8;border:1px solid rgba(29,145,221,.06)}\n      .native-review-panel{background:linear-gradient(180deg,#fbfdff,#f4f9fc);border-radius:32px}.native-review-list{padding:0 14px 14px}.native-file-row{border-radius:18px;box-shadow:0 5px 18px rgba(64,96,126,.04);padding:12px}.native-review-footer{background:rgba(250,253,255,.96);backdrop-filter:blur(14px)}\n      .native-clean-card{padding:8px}.native-clean-card .native-clean-check{box-shadow:0 10px 26px rgba(44,160,132,.12)}.native-clean-metric{letter-spacing:-.04em}\n
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
    scanStartStorage = getStorageSnapshot();
    latestStorageSnapshot = scanStartStorage;
    sessionDeletedCount = 0;
    sessionReclaimedBytes = 0;
    sessionDuplicateCopiesRemoved = 0;
    sessionProtectedCopiesKept = 0;
    initialLowRiskCount = null;
    initialLowRiskBytes = null;
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
    const header=document.querySelector('.app-header'); if(!header)return;
    const settings=byId('settingsButton');
    let actions=byId('nativeHeaderActions');
    if(!actions){
      actions=document.createElement('div'); actions.id='nativeHeaderActions'; actions.className='native-header-actions';
      header.appendChild(actions);
      if(settings) actions.appendChild(settings);
    }else if(settings && settings.parentElement!==actions){actions.appendChild(settings);}
    let button=byId('nativeHomeButton');
    if(!button){
      button=document.createElement('button'); button.id='nativeHomeButton'; button.className='native-home-button'; button.type='button'; button.hidden=true; button.setAttribute('aria-label',text('home'));
      button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 10.8 12 4.7l7.5 6.1"/><path d="M6.8 9.5v9h10.4v-9"/><path d="M9.8 18.5v-5.2h4.4v5.2"/></svg>';
      actions.insertBefore(button,settings||null);
    }
  }
  function syncHomeButton(screenName=window.BearagnosticAppAPI?.getCurrentScreen?.()||'home') {
    ensureNavigationButton(); const button=byId('nativeHomeButton'); if(button)button.hidden=screenName!=='checkup';
  }
  function goHome(){ closeResults(); closeReview(); closeConfirm(); const clean=byId('nativeCleanSummary'); if(clean)clean.hidden=true; window.BearagnosticAppAPI?.switchScreen?.('home'); }

  function preferenceCopy(){
    const lang=currentLanguage();
    if(lang==='th') return {
      intro:'การสแกน ความปลอดภัย ความเป็นส่วนตัว และการทำงานของแอพ',
      scanTitle:'การสแกนและการวิเคราะห์',scanSub:'ตั้งค่าพฤติกรรมหลักของ Bearagnostic',
      smart:'โหมดแนะนำ',smartValue:'Smart Scan',scope:'ขอบเขต Quick Scan',scopeValue:'พื้นที่ shared storage ที่เข้าถึงได้',
      safetyTitle:'ความปลอดภัยในการทำความสะอาด',safetySub:'กฎป้องกันข้อมูลสำคัญที่ปิดไม่ได้',
      confirm:'ยืนยันก่อนลบ',confirmValue:'เสมอ',duplicate:'การป้องกันไฟล์ซ้ำ',duplicateValue:'เก็บไว้อย่างน้อย 1 สำเนา',
      privacyTitle:'ความเป็นส่วนตัวและสิทธิ์',privacySub:'วิเคราะห์ไฟล์ภายในเครื่องโดยไม่อัปโหลด',
      local:'การวิเคราะห์ไฟล์',localValue:'บนเครื่องเท่านั้น',access:'สิทธิ์เข้าถึงไฟล์',allowed:'อนุญาตแล้ว',needs:'ต้องอนุญาต',
      aboutTitle:'Bearagnostic for Android',aboutSub:'Benedict Interactive',version:'เวอร์ชัน'
    };
    if(lang==='ja') return {
      intro:'スキャン、安全性、プライバシー、アプリ動作',
      scanTitle:'スキャンと解析',scanSub:'Bearagnostic の基本動作',
      smart:'推奨モード',smartValue:'Smart Scan',scope:'Quick Scan の範囲',scopeValue:'アクセス可能な共有ストレージ',
      safetyTitle:'クリーンアップの安全性',safetySub:'重要なデータを守る必須ルール',
      confirm:'削除前の確認',confirmValue:'常に確認',duplicate:'重複保護',duplicateValue:'最低1コピーを保持',
      privacyTitle:'プライバシーとアクセス',privacySub:'ファイルは端末内で解析し、アップロードしません',
      local:'ファイル解析',localValue:'端末内のみ',access:'ストレージアクセス',allowed:'許可済み',needs:'許可が必要',
      aboutTitle:'Bearagnostic for Android',aboutSub:'Benedict Interactive',version:'バージョン'
    };
    return {
      intro:'Scan, safety, privacy and app behavior',
      scanTitle:'Scan & analysis',scanSub:'Core Bearagnostic behavior',
      smart:'Recommended mode',smartValue:'Smart Scan',scope:'Quick Scan scope',scopeValue:'All accessible shared storage',
      safetyTitle:'Cleanup safety',safetySub:'Non-negotiable protection for your files',
      confirm:'Confirm before delete',confirmValue:'Always',duplicate:'Duplicate protection',duplicateValue:'Keep at least 1 copy',
      privacyTitle:'Privacy & access',privacySub:'Files are analyzed locally and are not uploaded',
      local:'File analysis',localValue:'On device only',access:'Storage access',allowed:'Allowed',needs:'Permission needed',
      aboutTitle:'Bearagnostic for Android',aboutSub:'Benedict Interactive',version:'Version'
    };
  }

  function ensureNativePreferences(){
    const screen=byId('preferencesScreen'), scroll=screen?.querySelector('.preferences-scroll');
    if(!screen||!scroll) return;
    const c=preferenceCopy();
    const intro=screen.querySelector('.preferences-intro'); if(intro) intro.textContent=c.intro;
    const browser=byId('browserFullscreenRow'); if(browser) browser.hidden=true;
    let ext=byId('nativePreferencesExtension');
    if(!ext){
      ext=document.createElement('section'); ext.id='nativePreferencesExtension'; ext.className='native-pref-extension';
      scroll.appendChild(ext);
    }
    const access=Boolean(nativeState?.broadStorageAccess);
    const version=String(nativeState?.versionName||'0.18.0-alpha18').replace('-debug','');
    ext.innerHTML=`
      <section class="native-pref-card">
        <div class="native-pref-card__head"><span class="native-pref-orb"><svg viewBox="0 0 24 24"><path d="M4 12h3l2-5 4 10 2-5h5"/></svg></span><div><strong>${c.scanTitle}</strong><small>${c.scanSub}</small></div></div>
        <div class="native-pref-rows"><div class="native-pref-row"><span>${c.smart}</span><b>${c.smartValue}</b></div><div class="native-pref-row"><span>${c.scope}</span><b>${c.scopeValue}</b></div></div>
      </section>
      <section class="native-pref-card">
        <div class="native-pref-card__head"><span class="native-pref-orb mint"><svg viewBox="0 0 24 24"><path d="m6 12 4 4 8-9"/><path d="M12 3 5 6v5c0 4.5 2.8 8.1 7 10 4.2-1.9 7-5.5 7-10V6z"/></svg></span><div><strong>${c.safetyTitle}</strong><small>${c.safetySub}</small></div></div>
        <div class="native-pref-rows"><div class="native-pref-row"><span>${c.confirm}</span><b class="mint">${c.confirmValue}</b></div><div class="native-pref-row"><span>${c.duplicate}</span><b class="mint">${c.duplicateValue}</b></div></div>
      </section>
      <section class="native-pref-card">
        <div class="native-pref-card__head"><span class="native-pref-orb violet"><svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.5 2.8 8.1 7 10 4.2-1.9 7-5.5 7-10V6z"/><path d="M9 12h6"/></svg></span><div><strong>${c.privacyTitle}</strong><small>${c.privacySub}</small></div></div>
        <div class="native-pref-rows"><div class="native-pref-row"><span>${c.local}</span><b>${c.localValue}</b></div><div class="native-pref-row"><span>${c.access}</span><b class="${access?'mint':'slate'}">${access?c.allowed:c.needs}</b></div></div>
      </section>
      <section class="native-pref-card">
        <div class="native-pref-card__head"><span class="native-pref-orb"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 11v5M12 8h.01"/></svg></span><div><strong>${c.aboutTitle}</strong><small>${c.aboutSub}</small></div></div>
        <div class="native-pref-rows"><div class="native-pref-row"><span>${c.version}</span><b class="slate">${version} · B18</b></div></div>
      </section>`;
  }


  function ensureTrustStyle() {
    if(byId('nativeTrustStyle')) return;
    const style=document.createElement('style'); style.id='nativeTrustStyle'; style.textContent=`
      .native-header-actions{margin-left:auto;display:flex;align-items:center;justify-content:flex-end;gap:10px;flex:0 0 auto}
      .native-header-actions .header-settings{margin:0}
      .native-home-button{width:42px!important;height:42px!important;padding:5px!important}
      .native-home-button svg{width:27px!important;height:27px!important}
      .native-mode-guide{display:grid;grid-template-columns:54px minmax(0,1fr);gap:10px;align-items:center;margin:8px 0 11px;padding:7px 10px;border-radius:18px;background:linear-gradient(135deg,#f3f9fd,#edf7fb);border:1px solid rgba(91,126,158,.08)}
      .native-mode-guide img{width:54px;height:54px;object-fit:contain;object-position:center bottom;filter:drop-shadow(0 5px 8px rgba(39,70,100,.08))}
      .native-mode-guide strong{display:block;font-size:10px;color:#2c4359}.native-mode-guide small{display:block;font-size:8px;line-height:1.35;color:#8392a1;margin-top:3px}
      .native-trust-advice{display:grid;grid-template-columns:58px minmax(0,1fr);gap:10px;align-items:center;margin-top:11px;padding:9px 10px;border-radius:18px;background:rgba(255,255,255,.76);border:1px solid rgba(255,255,255,.96);position:relative;z-index:2}
      .native-trust-advice[data-level='safe']{box-shadow:inset 3px 0 0 #41b49a}.native-trust-advice[data-level='review']{box-shadow:inset 3px 0 0 #d4a14a}.native-trust-advice[data-level='protected']{box-shadow:inset 3px 0 0 #738ca6}
      .native-trust-advice img{width:58px;height:58px;object-fit:contain;object-position:center bottom}
      .native-trust-copy b{display:inline-flex;padding:3px 7px;border-radius:99px;background:#edf7f3;color:#258d76;font-size:7px;letter-spacing:.04em;margin-bottom:4px}.native-trust-advice[data-level='review'] .native-trust-copy b{background:#fff6e6;color:#a97522}.native-trust-advice[data-level='protected'] .native-trust-copy b{background:#eef3f7;color:#667d94}
      .native-trust-copy strong{display:block!important;font-size:10px!important;line-height:1.2!important;margin:0!important}.native-trust-copy small{display:block;font-size:8px;line-height:1.36;color:#7f8e9d;margin-top:4px}
      .native-review-advice{margin:0 14px 10px;padding:9px 10px;border-radius:18px;background:linear-gradient(135deg,#f7fbfe,#f0f7fb);border:1px solid rgba(91,126,158,.08);display:grid;grid-template-columns:50px minmax(0,1fr);gap:9px;align-items:center}
      .native-review-advice img{width:50px;height:50px;object-fit:contain}.native-review-advice b{display:block;font-size:9px;color:#2c4258}.native-review-advice small{display:block;font-size:8px;line-height:1.35;color:#81909f;margin-top:3px}
      .native-confirm-panel{max-width:430px!important;border-radius:28px!important;padding:18px!important;background:linear-gradient(180deg,#fff,#fbfcfe)!important}
      .native-confirm-mascot{width:92px;height:92px;object-fit:contain;display:block;margin:-3px auto 5px;filter:drop-shadow(0 8px 14px rgba(42,66,89,.10))}
      .native-confirm-note{margin:8px 0 0;padding:9px 10px;border-radius:14px;background:#fff6e9;color:#8b651f;font-size:8px;line-height:1.4}
      .native-clean-card{position:relative;overflow:auto!important;padding:15px 15px 13px!important}
      .native-clean-check{display:none!important}
      .native-impact-hero{display:grid;grid-template-columns:minmax(0,1fr) 112px;gap:8px;align-items:center;margin:-2px 0 8px;padding:10px 12px;border-radius:22px;background:linear-gradient(135deg,#edf9f5,#f7fcff);border:1px solid rgba(255,255,255,.96)}
      .native-impact-hero img{width:112px;height:100px;object-fit:contain;object-position:center bottom;align-self:end}
      .native-impact-kicker{font-size:7px;letter-spacing:.18em;text-transform:uppercase;color:#4c9a84;font-weight:800}.native-impact-copy strong{display:block;font-size:13px;color:#1c364d;margin-top:5px}.native-impact-copy small{display:block;font-size:8px;line-height:1.4;color:#7e8f9e;margin-top:5px}
      .native-impact-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}.native-impact-item{padding:10px;border-radius:17px;background:#f4f8fb;border:1px solid rgba(96,126,155,.08)}.native-impact-item b{display:block;font-size:13px;color:#17344d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.native-impact-item span{display:block;font-size:7.5px;color:#8493a2;margin-top:4px}
      .native-impact-proof{font-size:8px!important;line-height:1.4!important;color:#758797!important;margin:8px 1px!important}
      .native-share-button{height:46px;border-radius:17px;background:linear-gradient(118deg,#21b6e9,#147fe8);color:white;font-weight:750;font-size:11px;box-shadow:0 10px 20px rgba(17,132,222,.16);width:100%;margin:4px 0 8px}
      .native-clean-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important}
      .more-screen .panel-head h2{letter-spacing:-.03em}.native-more-sub{margin:5px 0 0;font-size:10px;color:#8795a3}
      .more-screen [data-close-app]{display:none!important}
      @media(max-width:360px){.native-header-actions{gap:7px}.native-home-button{width:39px!important;height:39px!important}.native-impact-hero{grid-template-columns:minmax(0,1fr) 92px}.native-impact-hero img{width:92px;height:88px}}
    `; document.head.appendChild(style);
  }

  function polishMoreScreen() {
    const screen=byId('moreScreen'); if(!screen)return;
    const c=trustCopy();
    const head=screen.querySelector('.panel-head'); const title=head?.querySelector('h2');
    if(title) title.textContent=c.moreTitle;
    let sub=head?.querySelector('.native-more-sub');
    if(head&&!sub){sub=document.createElement('p');sub.className='native-more-sub';head.appendChild(sub);}
    if(sub) sub.textContent=c.moreSub;
    const close=screen.querySelector('[data-close-app]'); if(close) close.hidden=true;
    const about=screen.querySelector('[data-open="about"] small');
    const version=String(nativeState?.versionName||'0.18.0-alpha18').replace('-debug','');
    if(about) about.textContent=`Benedict Interactive · ${version} · B18`;
  }

  function ensureTrustSurfaces() {
    ensureTrustStyle();
    const modePanel=byId('nativeModeSheet')?.querySelector('.native-mode-panel');
    if(modePanel){
      let guide=byId('nativeModeGuide');
      if(!guide){ guide=document.createElement('div'); guide.id='nativeModeGuide'; guide.className='native-mode-guide'; byId('nativeModeLead')?.insertAdjacentElement('afterend',guide); }
      const guideBody=currentLanguage()==='th'?'เลือกความลึกให้เหมาะกับเวลาที่มี และสิ่งที่ต้องการตรวจจริง':currentLanguage()==='ja'?'時間と目的に合う深さを選べます。':'Choose the depth that fits your time and what you actually want to inspect.';
      guide.innerHTML=`<img src="${mascotPath('inspect')}" alt=""><div><strong>${trustCopy().reviewTitle}</strong><small>${guideBody}</small></div>`;
    }
    const hero=document.querySelector('.native-result-hero');
    if(hero&&!byId('nativeTrustAdvice')){
      const card=document.createElement('section'); card.id='nativeTrustAdvice'; card.className='native-trust-advice'; hero.appendChild(card);
    }
    const reviewSummary=document.querySelector('.native-review-summary');
    if(reviewSummary&&!byId('nativeReviewAdvice')){
      const card=document.createElement('section');card.id='nativeReviewAdvice';card.className='native-review-advice';reviewSummary.insertAdjacentElement('afterend',card);
    }
    const confirm=byId('nativeConfirmSheet')?.querySelector('.native-confirm-panel');
    if(confirm&&!byId('nativeConfirmMascot')){
      const img=document.createElement('img');img.id='nativeConfirmMascot';img.className='native-confirm-mascot';img.src=mascotPath('caution');img.alt='';confirm.insertBefore(img,confirm.firstChild);
      const note=document.createElement('div');note.id='nativeConfirmNote';note.className='native-confirm-note';confirm.querySelector('#nativeConfirmBody')?.insertAdjacentElement('afterend',note);
    }
    const cleanCard=byId('nativeCleanSummary')?.querySelector('.native-clean-card');
    if(cleanCard&&!byId('nativeImpactHero')){
      const hero=document.createElement('section');hero.id='nativeImpactHero';hero.className='native-impact-hero';
      hero.innerHTML=`<div class="native-impact-copy"><span class="native-impact-kicker">${trustCopy().impactTitle}</span><strong id="nativeImpactHeadline"></strong><small id="nativeImpactSub"></small></div><img src="${mascotPath('success')}" alt="">`;
      cleanCard.insertBefore(hero,cleanCard.firstChild);
      const metric=byId('nativeCleanBytes');
      metric?.insertAdjacentHTML('afterend',`<div class="native-impact-grid"><div class="native-impact-item"><b id="nativeImpactFree">—</b><span id="nativeImpactFreeLabel"></span></div><div class="native-impact-item"><b id="nativeImpactFiles">0</b><span id="nativeImpactFilesLabel"></span></div><div class="native-impact-item"><b id="nativeImpactDuplicates">0</b><span id="nativeImpactDuplicatesLabel"></span></div><div class="native-impact-item"><b id="nativeImpactResolved">—</b><span id="nativeImpactResolvedLabel"></span></div></div><p class="native-impact-proof" id="nativeImpactProof"></p><button class="native-share-button" id="nativeShareResult" type="button"></button>`);
    }
  }

  function renderAdvice(category) {
    ensureTrustSurfaces();
    const advice=adviceFor(category); const c=trustCopy();
    const card=byId('nativeTrustAdvice'); if(card){
      card.dataset.level=advice.level;
      card.innerHTML=`<img src="${mascotPath(advice.mascot)}" alt=""><div class="native-trust-copy"><b>${advice.level==='safe'?c.safe:advice.level==='protected'?c.protected:c.review}</b><strong>${escapeHtml(advice.title)}</strong><small>${escapeHtml(advice.body)}</small></div>`;
    }
  }

  function renderReviewAdvice(category) {
    ensureTrustSurfaces(); const advice=adviceFor(category); const c=trustCopy(); const card=byId('nativeReviewAdvice'); if(!card)return;
    card.innerHTML=`<img src="${mascotPath(advice.mascot)}" alt=""><div><b>${escapeHtml(advice.title)} · ${advice.level==='safe'?c.safe:c.review}</b><small>${escapeHtml(advice.body)}</small></div>`;
  }

  function renderCleanupImpact(count,reclaimed,result,liveReview,beforeStorage,afterStorage) {
    ensureTrustSurfaces(); const c=trustCopy();
    const beforePct=Number(beforeStorage?.freePercent), afterPct=Number(afterStorage?.freePercent);
    const resolved=initialLowRiskCount>0?Math.max(0,Math.min(100,((initialLowRiskCount-(Number(liveReview?.lowriskCount)||0))/initialLowRiskCount)*100)):null;
    byId('nativeImpactHeadline').textContent=`${formatBytes(reclaimed)} · ${count} ${c.filesRemoved}`;
    byId('nativeImpactSub').textContent=c.verifiedSpace;
    byId('nativeImpactFree').textContent=Number.isFinite(beforePct)&&Number.isFinite(afterPct)?`${percent(beforePct)} → ${percent(afterPct)}`:(Number.isFinite(afterPct)?percent(afterPct):'—');
    byId('nativeImpactFreeLabel').textContent=c.freeStorage;
    byId('nativeImpactFiles').textContent=String(count); byId('nativeImpactFilesLabel').textContent=c.filesRemoved;
    byId('nativeImpactDuplicates').textContent=String(sessionDuplicateCopiesRemoved); byId('nativeImpactDuplicatesLabel').textContent=c.duplicatesResolved;
    byId('nativeImpactResolved').textContent=resolved==null?(currentLanguage()==='th'?'ตรวจเอง':currentLanguage()==='ja'?'手動確認':'Manual review'):`${Math.round(resolved)}%`;
    byId('nativeImpactResolvedLabel').textContent=c.lowRiskResolved;
    byId('nativeImpactProof').textContent=`${c.proof}${sessionProtectedCopiesKept>0?` · ${c.protectedKept}: ${sessionProtectedCopiesKept}`:''}`;
    byId('nativeShareResult').textContent=c.share;
  }

  function shareCleanupResult() {
    const c=trustCopy(); const snapshot=latestStorageSnapshot||getStorageSnapshot();
    const body=[
      c.shareIntro,
      `${c.verifiedSpace}: ${formatBytes(sessionReclaimedBytes)}`,
      `${c.filesRemoved}: ${sessionDeletedCount}`,
      `${c.duplicatesResolved}: ${sessionDuplicateCopiesRemoved}`,
      Number.isFinite(Number(snapshot?.freePercent))?`${c.freeStorage}: ${percent(snapshot.freePercent)}`:null,
      'Bearagnostic · Benedict Interactive'
    ].filter(Boolean).join('\n');
    const result=parseJson(NATIVE.shareText?.(c.shareTitle,body),{});
    if(!result.accepted) toast(c.shareUnavailable);
  }

  function ensureActionSurfaces() {
    ensureStyle(); ensureTrustStyle(); ensureNavigationButton();
    if(!byId('nativeResultsSheet')) document.body.insertAdjacentHTML('beforeend',`<section class="native-results-sheet" id="nativeResultsSheet" hidden><div class="native-results-panel"><header class="native-results-header"><div><span class="native-results-eyebrow" id="nativeResultsKicker"></span><h2 id="nativeResultsTitle"></h2><p id="nativeResultsLead"></p></div><button class="native-icon-button" id="nativeResultsClose" type="button">×</button></header><div class="native-results-scroll"><section class="native-result-hero"><span class="native-result-kicker" id="nativeResultKicker"></span><strong id="nativeRecommendationTitle"></strong><p id="nativeRecommendationBody"></p><div class="native-hero-metrics"><div class="native-hero-metric"><b id="nativeReadyMetric"></b><span id="nativeReadyLabel"></span></div><div class="native-hero-metric"><b id="nativeReviewMetric"></b><span id="nativeReviewLabel"></span></div></div></section><button class="native-primary-action" id="nativeLowRiskAction" type="button"><span class="native-primary-orb"><svg viewBox="0 0 24 24"><path d="M5 12h14M14 7l5 5-5 5"/></svg></span><span><strong id="nativeLowRiskTitle"></strong><small id="nativeLowRiskSub"></small></span><b>›</b></button><div class="native-results-section-head"><strong id="nativeCategoriesLabel"></strong><small id="nativeCategoryMeta"></small></div><div class="native-action-grid" id="nativeActionGrid"></div><section class="native-facts-card"><strong class="native-facts-title" id="nativeFactsTitle"></strong><div class="native-facts-grid"><div class="native-fact"><b id="nativeFilesFact"></b><span id="nativeFilesFactLabel"></span></div><div class="native-fact"><b id="nativeModeFact"></b><span id="nativeModeFactLabel"></span></div><div class="native-fact"><b id="nativeDurationFact"></b><span id="nativeDurationFactLabel"></span></div><div class="native-fact"><b id="nativeCoverageFact"></b><span id="nativeCoverageFactLabel"></span></div></div></section><div class="native-bottom-grid"><section class="native-session-card"><span class="native-mini-symbol">✓</span><strong id="nativeSessionTitle"></strong><small id="nativeSessionBody"></small></section><section class="native-safety-card"><span class="native-mini-symbol">◇</span><strong id="nativeSafetyTitle"></strong><small id="nativeSafetyBody"></small></section></div></div><footer class="native-results-footer"><button class="native-secondary" id="nativeResultsHome" type="button"></button><button class="native-secondary native-secondary--blue" id="nativeResultsRescan" type="button"></button></footer></div></section>`);
    if(!byId('nativeReviewSheet')) document.body.insertAdjacentHTML('beforeend',`<section class="native-review-sheet" id="nativeReviewSheet" hidden><div class="native-review-panel"><div class="native-sheet-head"><button class="native-icon-button" id="nativeReviewBack" type="button">‹</button><div style="min-width:0;flex:1"><h2 id="nativeReviewTitle"></h2><p id="nativeReviewSubtitle"></p></div><button class="native-icon-button" id="nativeReviewHome" type="button">⌂</button></div><div class="native-review-summary"><span id="nativeReviewCount"></span><span id="nativeReviewBytes"></span></div><div class="native-review-list" id="nativeReviewList"></div><div class="native-review-footer"><div class="native-selection-copy"><strong id="nativeSelectedCount"></strong><small id="nativeSelectedBytes"></small></div><button class="native-delete-button" id="nativeDeleteSelected" type="button"></button></div></div></section>`);
    if(!byId('nativeConfirmSheet')) document.body.insertAdjacentHTML('beforeend',`<section class="native-confirm-sheet" id="nativeConfirmSheet" hidden><div class="native-confirm-panel"><h3 id="nativeConfirmTitle"></h3><p id="nativeConfirmBody"></p><div class="native-confirm-actions"><button class="native-secondary" id="nativeConfirmCancel" type="button"></button><button class="native-danger" id="nativeConfirmDelete" type="button"></button></div></div></section>`);
    if(!byId('nativeCleanSummary')) document.body.insertAdjacentHTML('beforeend',`<section class="native-clean-summary" id="nativeCleanSummary" hidden><div class="native-clean-panel"><div class="native-clean-card"><div class="native-clean-check">✓</div><h2 id="nativeCleanTitle"></h2><div class="native-clean-metric" id="nativeCleanBytes"></div><p id="nativeCleanDetails"></p><div class="native-clean-actions"><button class="native-secondary" id="nativeCleanBack" type="button"></button><button class="native-secondary native-secondary--blue" id="nativeCleanHome" type="button"></button></div></div></div></section>`);
    ensureTrustSurfaces();
  }

  function recommendation(review) {
    const low=Number(review?.lowriskCount)||0;
    const candidates=Number(review?.candidateCount)||0;
    if(low>0)return {title:text('resultHeroTitle'),body:`${low} ${text('items')} · ${text('resultHeroLow')}`};
    if(candidates>0)return {title:text('resultHeroTitle'),body:text('resultHeroReview')};
    return {title:text('resultHeroTitle'),body:text('resultHeroClear')};
  }

  function resultCounts(review,data) {
    const available=Boolean(review?.available);
    const get=(summaryKey,dataKey)=>available?(Number(review?.[summaryKey])||0):(Number(data?.[dataKey])||0);
    return {
      lowCount:get('lowriskCount','autoCleanCandidateCount'), lowBytes:get('lowriskBytes','autoCleanCandidateBytes'),
      duplicatesCount:get('duplicatesCount','duplicateCopies'), duplicatesBytes:get('duplicatesBytes','duplicateReclaimableBytes'),
      largeCount:get('largeCount','largeFiles'), largeBytes:get('largeBytes','largeFileBytes'),
      oldCount:get('oldCount','olderFiles'), oldBytes:get('oldBytes','olderFileBytes'),
      temporaryCount:get('temporaryCount','temporaryArtifactFiles'), temporaryBytes:get('temporaryBytes','temporaryArtifactBytes'),
      installersCount:get('installersCount','apkInstallerFiles'), installersBytes:get('installersBytes','apkInstallerBytes'),
      archivesCount:get('archivesCount','archiveFiles'), archivesBytes:get('archivesBytes','archiveBytes'),
      zeroCount:get('zeroCount','zeroByteFiles'), zeroBytes:get('zeroBytes','zeroByteFiles'),
      candidateCount:Number(review?.candidateCount)||0
    };
  }

  function syncLiveResultFromReview(review) {
    if(!lastCompleteResult||!review?.available)return;
    lastCompleteResult.autoCleanCandidateCount=Number(review.lowriskCount)||0;
    lastCompleteResult.autoCleanCandidateBytes=Number(review.lowriskBytes)||0;
    lastCompleteResult.reviewCandidateCount=Number(review.candidateCount)||0;
    lastCompleteResult.duplicateCopies=Number(review.duplicatesCount)||0;
    lastCompleteResult.duplicateReclaimableBytes=Number(review.duplicatesBytes)||0;
    lastCompleteResult.largeFiles=Number(review.largeCount)||0;
    lastCompleteResult.largeFileBytes=Number(review.largeBytes)||0;
    lastCompleteResult.olderFiles=Number(review.oldCount)||0;
    lastCompleteResult.olderFileBytes=Number(review.oldBytes)||0;
    lastCompleteResult.temporaryArtifactFiles=Number(review.temporaryCount)||0;
    lastCompleteResult.temporaryArtifactBytes=Number(review.temporaryBytes)||0;
    lastCompleteResult.apkInstallerFiles=Number(review.installersCount)||0;
    lastCompleteResult.apkInstallerBytes=Number(review.installersBytes)||0;
    lastCompleteResult.archiveFiles=Number(review.archivesCount)||0;
    lastCompleteResult.archiveBytes=Number(review.archivesBytes)||0;
    lastCompleteResult.zeroByteFiles=Number(review.zeroCount)||0;
    const set=(id,value)=>{const el=byId(id);if(el)el.textContent=String(Math.max(0,Number(value)||0));};
    set('scanDuplicates',lastCompleteResult.duplicateCopies);
    set('scanLarge',lastCompleteResult.largeFiles);
    set('scanOlder',lastCompleteResult.olderFiles);
  }

  function categoryVisual(category) {
    const visuals={
      duplicates:{tone:'cyan',svg:'<svg viewBox="0 0 24 24"><rect x="5" y="5" width="11" height="11" rx="2"/><rect x="8" y="8" width="11" height="11" rx="2"/></svg>'},
      large:{tone:'amber',svg:'<svg viewBox="0 0 24 24"><path d="M4 19h16M6 16V9M12 16V5M18 16v-4"/></svg>'},
      old:{tone:'violet',svg:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>'},
      temporary:{tone:'mint',svg:'<svg viewBox="0 0 24 24"><path d="M7 7h10M9 7V5h6v2M9 10v7M15 10v7M6 7l1 13h10l1-13"/></svg>'},
      installers:{tone:'slate',svg:'<svg viewBox="0 0 24 24"><path d="M12 4v10M8 10l4 4 4-4M5 19h14"/></svg>'},
      archives:{tone:'sand',svg:'<svg viewBox="0 0 24 24"><path d="M5 7h14v12H5zM4 4h16v3H4zM10 11h4"/></svg>'},
      zero:{tone:'gray',svg:'<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7zM14 3v5h5M9 15h6"/></svg>'},
      lowrisk:{tone:'mint',svg:'<svg viewBox="0 0 24 24"><path d="m6 12 4 4 8-9"/></svg>'}
    };
    return visuals[category]||visuals.zero;
  }

  function actionCard(category,title,count,bytes=0) {
    if(!(Number(count)>0))return '';
    const visual=categoryVisual(category);
    return `<button class="native-result-action" data-tone="${visual.tone}" type="button" data-review-category="${category}"><span class="native-category-icon">${visual.svg}</span><strong>${title}</strong><small>${Number(count)} ${text('items')}${bytes?` · ${formatBytes(bytes)}`:''}</small></button>`;
  }

  function bestCategory(counts) {
    if(counts.lowCount>0)return 'lowrisk';
    if(counts.duplicatesCount>0)return 'duplicates';
    if(counts.temporaryCount>0)return 'temporary';
    if(counts.installersCount>0)return 'installers';
    if(counts.archivesCount>0)return 'archives';
    if(counts.largeCount>0)return 'large';
    if(counts.oldCount>0)return 'old';
    if(counts.zeroCount>0)return 'zero';
    return null;
  }

  function openResults(data=lastCompleteResult) {
    ensureActionSurfaces(); if(!data)return;
    lastCompleteResult=data;
    const review=parseJson(NATIVE.getReviewSummary?.(),{});
    syncLiveResultFromReview(review);
    const counts=resultCounts(review,lastCompleteResult);
    if(initialLowRiskCount===null){initialLowRiskCount=counts.lowCount;initialLowRiskBytes=counts.lowBytes;}
    const mode=String(lastCompleteResult.scanMode||activeMode).toUpperCase();
    const files=Number(lastCompleteResult.reviewedFiles)||0;
    byId('nativeResultsKicker').textContent=`${mode} · ${text('resultKicker')}`;
    byId('nativeResultsTitle').textContent=text('nextSteps');
    byId('nativeResultsLead').textContent=text('nextLead');
    const rec=recommendation(review); byId('nativeResultKicker').textContent=text('overviewTitle'); byId('nativeRecommendationTitle').textContent=rec.title; byId('nativeRecommendationBody').textContent=rec.body;
    byId('nativeReadyMetric').textContent=counts.lowCount>0?formatBytes(counts.lowBytes):'0 B';
    byId('nativeReadyLabel').textContent=`${text('readyNow')} · ${counts.lowCount}`;
    byId('nativeReviewMetric').textContent=String(counts.candidateCount);
    byId('nativeReviewLabel').textContent=text('reviewItems');

    const best=bestCategory(counts);
    const primary=byId('nativeLowRiskAction');
    if(best){
      primary.hidden=false; primary.dataset.reviewCategory=best;
      byId('nativeLowRiskTitle').textContent=categoryTitle(best);
      const bestCount=best==='lowrisk'?counts.lowCount:best==='duplicates'?counts.duplicatesCount:best==='temporary'?counts.temporaryCount:best==='installers'?counts.installersCount:best==='archives'?counts.archivesCount:best==='large'?counts.largeCount:best==='old'?counts.oldCount:counts.zeroCount;
      const bestBytes=best==='lowrisk'?counts.lowBytes:best==='duplicates'?counts.duplicatesBytes:best==='temporary'?counts.temporaryBytes:best==='installers'?counts.installersBytes:best==='archives'?counts.archivesBytes:best==='large'?counts.largeBytes:best==='old'?counts.oldBytes:counts.zeroBytes;
      byId('nativeLowRiskSub').textContent=`${text('startHere')} · ${bestCount} ${text('items')}${bestBytes?` · ${formatBytes(bestBytes)}`:''}`;
    }else{ primary.hidden=true; }
    renderAdvice(best||(counts.candidateCount>0?'large':'lowrisk'));

    const cards=[
      ['duplicates',text('duplicatesAction'),counts.duplicatesCount,counts.duplicatesBytes],
      ['large',text('largeAction'),counts.largeCount,counts.largeBytes],
      ['old',text('oldAction'),counts.oldCount,counts.oldBytes],
      ['temporary',text('tempAction'),counts.temporaryCount,counts.temporaryBytes],
      ['installers',text('installersAction'),counts.installersCount,counts.installersBytes],
      ['archives',text('archivesAction'),counts.archivesCount,counts.archivesBytes],
      ['zero',text('zeroAction'),counts.zeroCount,counts.zeroBytes]
    ];
    byId('nativeActionGrid').innerHTML=cards.map(([category,title,count,bytes])=>actionCard(category,title,count,bytes)).join('');
    const categories=cards.filter(([, ,count])=>Number(count)>0).length;
    byId('nativeCategoriesLabel').textContent=text('reviewByCategory');
    byId('nativeCategoryMeta').textContent=`${categories} ${text('categoriesFound')}`;
    byId('nativeFactsTitle').textContent=text('scanFacts');
    byId('nativeFilesFact').textContent=String(files);
    byId('nativeFilesFactLabel').textContent=text('filesReviewedLabel');
    byId('nativeModeFact').textContent=mode;
    byId('nativeModeFactLabel').textContent=text('modeLabel');
    const durationMs=Math.max(0,Number(lastCompleteResult.durationMs)||0);
    byId('nativeDurationFact').textContent=durationMs<1000?`${Math.round(durationMs)} ms`:`${(durationMs/1000).toFixed(durationMs<10000?1:0)} s`;
    byId('nativeDurationFactLabel').textContent=currentLanguage()==='th'?'เวลาสแกน':currentLanguage()==='ja'?'所要時間':'Duration';
    const coverage=String(lastCompleteResult.coverageStatus||'').toLowerCase();
    const full=coverage==='complete_accessible_scope';
    byId('nativeCoverageFact').textContent=full?'FULL':'PARTIAL';
    byId('nativeCoverageFact').style.color=full?'#249879':'#b07a2b';
    byId('nativeCoverageFactLabel').textContent=currentLanguage()==='th'?'ความครอบคลุม':currentLanguage()==='ja'?'カバレッジ':'Coverage';
    byId('nativeSessionTitle').textContent=text('sessionTitle');
    byId('nativeSessionBody').textContent=sessionDeletedCount>0?`${sessionDeletedCount} ${text('deleted')} · ${formatBytes(sessionReclaimedBytes)} ${text('spaceReclaimed')}`:text('sessionEmpty');
    byId('nativeSafetyTitle').textContent=text('safetyTitle'); byId('nativeSafetyBody').textContent=text('safetyBody');
    byId('nativeResultsHome').textContent=text('home'); byId('nativeResultsRescan').textContent=text('scanAgain'); byId('nativeResultsClose').setAttribute('aria-label',text('close'));
    byId('nativeResultsSheet').hidden=false;
  }
  function closeResults(){const el=byId('nativeResultsSheet');if(el)el.hidden=true;}

  function categoryTitle(category){return ({lowrisk:text('reviewClean'),duplicates:text('duplicatesAction'),large:text('largeAction'),old:text('oldAction'),temporary:text('tempAction'),installers:text('installersAction'),archives:text('archivesAction'),zero:text('zeroAction'),all:text('review')})[category]||text('reviewTitle');}
  function reasonText(code){return text(`reason_${code}`);}

  function openReview(category) {
    ensureActionSurfaces(); reviewCategory=category; reviewOffset=0; reviewTotal=0; reviewItems.clear(); selectedReviewIds.clear();
    byId('nativeReviewTitle').textContent=categoryTitle(category); byId('nativeReviewSubtitle').textContent=text('reviewTitle'); byId('nativeDeleteSelected').textContent=text('deleteSelected');
    renderReviewAdvice(category);
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
  function openDeleteConfirm(){
    if(!selectedReviewIds.size)return; ensureActionSurfaces(); const c=trustCopy();
    const selected=[...selectedReviewIds].map(id=>reviewItems.get(id)).filter(Boolean);
    const bytes=selected.reduce((sum,item)=>sum+(Number(item.sizeBytes)||0),0);
    byId('nativeConfirmTitle').textContent=c.destructiveTitle;
    byId('nativeConfirmBody').textContent=`${selected.length} ${text('selected')} · ${formatBytes(bytes)}. ${c.destructiveBody}`;
    byId('nativeConfirmNote').textContent=adviceFor(reviewCategory||'all').body;
    byId('nativeConfirmCancel').textContent=text('cancel'); byId('nativeConfirmDelete').textContent=text('deleteNow'); byId('nativeConfirmSheet').hidden=false;
  }

  function performDelete(){
    const ids=[...selectedReviewIds]; const selectedBefore=ids.map(id=>reviewItems.get(id)).filter(Boolean); closeConfirm();
    const beforeStorage=latestStorageSnapshot||scanStartStorage||getStorageSnapshot();
    const result=parseJson(NATIVE.deleteReviewCandidates?.(JSON.stringify(ids)),{});
    if(!result.accepted){toast(text('failed'));return;}
    const reclaimed=Number(result.reclaimedBytes)||0, count=Number(result.deletedCount)||0;
    const deletedIds=new Set(Array.isArray(result.deletedIds)?result.deletedIds:[]);
    const duplicateDeleted=selectedBefore.filter(item=>deletedIds.has(item.id)&&item.reasonCode==='verified_duplicate').length;
    sessionDeletedCount+=count; sessionReclaimedBytes+=reclaimed; sessionDuplicateCopiesRemoved+=duplicateDeleted;
    sessionProtectedCopiesKept+=Array.isArray(result.protectedIds)?result.protectedIds.length:0;
    const liveReview=result.reviewSummary||parseJson(NATIVE.getReviewSummary?.(),{});
    syncLiveResultFromReview(liveReview);
    latestStorageSnapshot=getStorageSnapshot();
    byId('nativeReviewSheet').hidden=true; closeResults();
    byId('nativeCleanTitle').textContent=trustCopy().impactTitle; byId('nativeCleanBytes').textContent=formatBytes(reclaimed);
    byId('nativeCleanDetails').textContent=text('rescanNote'); byId('nativeCleanBack').textContent=text('backResults'); byId('nativeCleanHome').textContent=text('home');
    renderCleanupImpact(count,reclaimed,result,liveReview,beforeStorage,latestStorageSnapshot);
    byId('nativeCleanSummary').hidden=false;
  }

  function progressEvent(raw) {
    const data=parseJson(raw,{}); lastProgress=data; running=true; setScanState('running');
    setStage(data.phase||'preparing',phasePercent(data)); updateCounters(data);
  }

  function completeEvent(raw) {
    const data=parseJson(raw,{}); running=false; lastProgress=data; lastCompleteResult=data; latestStorageSnapshot=getStorageSnapshot(); stopFileStream(); updateCounters(data); setScanState('complete');
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
    const tile=document.createElement('span'); tile.className='scan-file-tile'; tile.dataset.kind=kind; tile.style.setProperty('--lane',String(Math.floor(Math.random()*4))); tile.innerHTML=`<svg viewBox="0 0 24 24">${FILE_TILE_ICONS[kind]}</svg>`; stream.appendChild(tile);
    tile.addEventListener('animationend',()=>tile.remove(),{once:true}); setTimeout(()=>tile.remove(),2500);
  }
  function startFileStream(){stopFileStream();makeTile();streamTimer=setInterval(makeTile,260);}
  function stopFileStream(){if(streamTimer){clearInterval(streamTimer);streamTimer=null;}const stream=byId('scanFileStream');if(stream)stream.innerHTML='';}

  function onNativeStateChanged(raw) {
    nativeState=parseJson(raw,{});
    ensureNativePreferences(); polishMoreScreen();
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
    if(target.id==='nativeShareResult'){event.preventDefault();event.stopImmediatePropagation();shareCleanupResult();return;}
    if(target.id==='openKofi'){event.preventDefault();event.stopImmediatePropagation();NATIVE.openExternalUrl?.('https://ko-fi.com/benedictinteractive');return;}
    if(target.id==='openPromptPayQr'){event.preventDefault();event.stopImmediatePropagation();NATIVE.openExternalUrl?.('https://raw.githubusercontent.com/grolygori789-crypto/little-ganesha-tarot/main/assets/support/promptpay-qr.png');return;}
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

  window.addEventListener('bearagnostic:screenchange',(event)=>{const screen=event.detail?.screen||'home';syncHomeButton(screen);if(screen==='preferences')ensureNativePreferences();if(screen==='more')polishMoreScreen();});

  document.addEventListener('DOMContentLoaded',()=>{
    renderModeSheet(); ensureActionSurfaces();
    parseNativeState(); syncHomeButton('home'); ensureNativePreferences(); ensureTrustSurfaces(); polishMoreScreen();
    const buildLabel=document.querySelector('.app-footer__build'); if(buildLabel) buildLabel.textContent='v0.18 · B18';
    // Keep the original browser file picker hidden in native Android; its visual Checkup
    // surface and flying-file animation remain the approved legacy implementation.
    const picker=byId('scanPicker'); if(picker){picker.hidden=true;picker.classList.remove('is-open');}
    setScanState('idle'); setPercent(0);
    NATIVE.refreshNativeState?.();
  },{once:true});

  window.addEventListener('bearagnostic:languagechange',()=>{if(!byId('nativeModeSheet')?.hidden)renderModeSheet();setScanState(running?'running':lastProgress?.state==='complete'?'complete':'idle');syncHomeButton();ensureNativePreferences();polishMoreScreen();ensureTrustSurfaces();if(reviewCategory)renderReviewAdvice(reviewCategory);if(lastCompleteResult&&!byId('nativeResultsSheet')?.hidden)openResults(lastCompleteResult);});
})();
