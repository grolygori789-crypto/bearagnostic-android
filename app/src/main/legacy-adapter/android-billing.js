(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  const ENT = window.BearagnosticEntitlement;
  if (!NATIVE || !ENT) return;

  const byId = (id) => document.getElementById(id);
  const parse = (value, fallback = {}) => {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  };
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

  let refreshTimer = null;
  let pendingPoll = null;
  let sandboxPoll = null;
  let observerQueued = false;
  let lastBillingState = {};
  let lastSandboxState = {};
  let lastSandboxSignature = '';

  function language() {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
  }

  const COPY = {
    en: {
      activeTitle:'Bearagnostic Pro is active', activeSub:'Google Play ownership is recognized for this installation.', activeButton:'PRO ACTIVE',
      debugTitle:'Development Pro override is active', debugSub:'This is a debug-only entitlement override, not a Google Play purchase.', debugButton:'PRO TEST MODE',
      readyTitle:'Unlock Bearagnostic Pro', readySub:'One-time lifetime purchase through Google Play. No subscription, no ads, no Bearagnostic account.',
      buy:'Unlock Pro', restore:'Restore purchase', retry:'Retry Google Play',
      connectingTitle:'Connecting to Google Play', connectingSub:'Checking the local Play product and ownership state. No price is guessed or hard-coded.',
      unavailableTitle:'Purchase is not available in this install yet', unavailableSub:'The Play product or test-track setup is not available here yet. This is expected before Play Console integration is completed.',
      pendingTitle:'Purchase pending', pendingSub:'Google Play has not completed the payment yet. Pro unlocks only after Play reports PURCHASED.',
      openingTitle:'Opening Google Play', openingSub:'Complete or cancel the purchase in the Google Play sheet.',
      errorTitle:'Google Play could not confirm billing', errorSub:'Nothing was charged by Bearagnostic. Retry when Google Play is available, or restore an existing purchase.',
      ownershipCached:'Previously verified Play ownership is cached on this device. Bearagnostic will refresh it when Google Play is reachable.',
      pricePrefix:'Lifetime · ', localPrice:'Local Play price',
      testTrack:'Real purchase testing requires the product and app build to be available through a Google Play test track.',
      sandboxLabel:'TEST PURCHASE · DEBUG ONLY', sandboxTitle:'Billing Sandbox',
      sandboxBody:'Simulates the client-visible Google Play purchase lifecycle so Pro unlock, pending, restore and failure states can be tested before Play integration. No real payment is made.',
      sandboxScenario:'Test outcome', sandboxSuccess:'Successful purchase', sandboxPending:'Pending payment', sandboxCancel:'User cancels', sandboxError:'Payment error', sandboxAlreadyOwned:'Already owned', sandboxNetwork:'Network error', sandboxUnavailable:'Billing unavailable',
      sandboxUsePlay:'Use Google Play path', sandboxEnable:'Enable test purchase', sandboxCompletePending:'Complete pending payment', sandboxForgetLocal:'Clear local Pro access', sandboxReset:'Erase mock purchase',
      sandboxTestPrice:'TEST PRICE', sandboxActiveTitle:'Test purchase verified · Pro unlocked', sandboxActiveSub:'The sandbox returned a PURCHASED-style confirmation. Bearagnostic granted Pro through the same entitlement gates used by the app.',
      sandboxReadyTitle:'Test the Pro purchase flow', sandboxReadySub:'Run a realistic one-time purchase simulation. The sandbox is isolated to Debug builds and never charges money.',
      sandboxPendingTitle:'Test payment is pending', sandboxPendingSub:'Pro stays locked until you explicitly complete this pending test payment.',
      sandboxProcessingTitle:'Confirming test payment', sandboxProcessingSub:'The sandbox is moving through the same client-visible states used by the real billing flow.',
      sandboxErrorTitle:'Test purchase did not complete', sandboxErrorSub:'No Pro access was granted. Change the test outcome or try again.',
      sandboxRestore:'Restore test purchase', sandboxBuy:'Buy Pro (test)',
      checkoutTitle:'Test purchase', checkoutBody:'This is a simulated Google Play purchase for QA. No card, account or real money is involved.', checkoutConfirm:'Confirm test purchase', checkoutCancel:'Cancel', checkoutPaymentLabel:'TEST PAYMENT METHOD', checkoutTestCard:'Test card ·•••• 4242', checkoutNoRecurring:'No subscription · No recurring charge',
      stateReady:'Ready', stateCheckout:'Checkout open', stateProcessing:'Processing', stateOwned:'Owned', statePending:'Pending', stateCancelled:'Cancelled', stateError:'Error', stateChecking:'Checking ownership', stateNotOwned:'Not owned'
    },
    th: {
      activeTitle:'Bearagnostic Pro เปิดใช้งานแล้ว', activeSub:'ระบบรับรู้สิทธิ์จาก Google Play สำหรับการติดตั้งนี้แล้ว', activeButton:'PRO เปิดใช้งาน',
      debugTitle:'กำลังใช้สิทธิ์ Pro สำหรับ Development', debugSub:'นี่เป็นสิทธิ์ทดสอบเฉพาะ Debug ไม่ใช่การซื้อผ่าน Google Play', debugButton:'โหมดทดสอบ PRO',
      readyTitle:'ปลดล็อก Bearagnostic Pro', readySub:'ซื้อครั้งเดียว ใช้ได้ตลอดชีพผ่าน Google Play ไม่มีรายเดือน ไม่มีโฆษณา และไม่ต้องมีบัญชี Bearagnostic',
      buy:'ปลดล็อก Pro', restore:'กู้คืนการซื้อ', retry:'ลองเชื่อม Google Play อีกครั้ง',
      connectingTitle:'กำลังเชื่อมต่อ Google Play', connectingSub:'กำลังตรวจสินค้า ราคาในประเทศ และสถานะสิทธิ์จริง โดยไม่เดาหรือกำหนดราคาเอง',
      unavailableTitle:'ยังซื้อไม่ได้จากการติดตั้งนี้', unavailableSub:'สินค้าใน Play หรือ test track ยังไม่พร้อมสำหรับ build นี้ ซึ่งเป็นสถานะที่คาดไว้ก่อนเชื่อม Play Console เสร็จสมบูรณ์',
      pendingTitle:'การซื้อกำลังรอดำเนินการ', pendingSub:'Google Play ยังชำระเงินไม่เสร็จ Pro จะปลดล็อกเมื่อ Play รายงานสถานะ PURCHASED เท่านั้น',
      openingTitle:'กำลังเปิด Google Play', openingSub:'ดำเนินการซื้อหรือยกเลิกได้จากหน้าต่างของ Google Play',
      errorTitle:'Google Play ยังยืนยัน Billing ไม่ได้', errorSub:'Bearagnostic ไม่ได้เรียกเก็บเงิน ลองใหม่เมื่อ Google Play พร้อม หรือกู้คืนการซื้อเดิม',
      ownershipCached:'เครื่องนี้มีสิทธิ์จาก Play ที่เคยตรวจยืนยันไว้ ระบบจะตรวจใหม่เมื่อเชื่อม Google Play ได้',
      pricePrefix:'ตลอดชีพ · ', localPrice:'ราคาจริงจาก Google Play',
      testTrack:'การทดสอบซื้อจริงต้องให้สินค้าและ build ของแอปพร้อมใช้งานผ่าน Google Play test track ก่อน',
      sandboxLabel:'การซื้อทดสอบ · DEBUG เท่านั้น', sandboxTitle:'Billing Sandbox',
      sandboxBody:'จำลองลำดับการซื้อที่แอปจะได้รับจาก Google Play เพื่อทดสอบการปลดล็อก Pro, Pending, Restore และกรณีผิดพลาดก่อนเชื่อมระบบจริง โดยไม่มีการเรียกเก็บเงินจริง',
      sandboxScenario:'ผลลัพธ์ที่ต้องการทดสอบ', sandboxSuccess:'ซื้อสำเร็จ', sandboxPending:'รอชำระเงิน', sandboxCancel:'ผู้ใช้ยกเลิก', sandboxError:'ชำระเงินไม่สำเร็จ', sandboxAlreadyOwned:'ซื้อไว้แล้ว', sandboxNetwork:'เครือข่ายขัดข้อง', sandboxUnavailable:'Billing ใช้งานไม่ได้',
      sandboxUsePlay:'ใช้เส้นทาง Google Play', sandboxEnable:'เปิดระบบซื้อทดสอบ', sandboxCompletePending:'ชำระรายการ Pending ให้เสร็จ', sandboxForgetLocal:'ล้างสิทธิ์ Pro ในเครื่อง', sandboxReset:'ล้างข้อมูลซื้อจำลองทั้งหมด',
      sandboxTestPrice:'ราคาทดสอบ', sandboxActiveTitle:'ยืนยันการซื้อทดสอบแล้ว · ปลดล็อก Pro สำเร็จ', sandboxActiveSub:'Sandbox ส่งสถานะแบบ PURCHASED แล้ว Bearagnostic จึงเปิด Pro ผ่าน entitlement gate เดียวกับที่แอปใช้งานจริง',
      sandboxReadyTitle:'ทดสอบขั้นตอนซื้อ Bearagnostic Pro', sandboxReadySub:'จำลองการซื้อแบบครั้งเดียวให้ใกล้เคียงการใช้งานจริง ระบบนี้อยู่เฉพาะ Debug build และไม่มีการเรียกเก็บเงินจริง',
      sandboxPendingTitle:'รายการทดสอบกำลังรอชำระ', sandboxPendingSub:'Pro จะยังไม่ถูกปลดล็อก จนกว่าจะสั่งให้การชำระเงินทดสอบรายการนี้เสร็จสมบูรณ์',
      sandboxProcessingTitle:'กำลังยืนยันการชำระเงินทดสอบ', sandboxProcessingSub:'Sandbox กำลังจำลองลำดับสถานะที่ฝั่งแอปจะได้รับจาก Billing จริง',
      sandboxErrorTitle:'การซื้อทดสอบไม่สำเร็จ', sandboxErrorSub:'ยังไม่มีการปลดล็อก Pro สามารถเปลี่ยนผลลัพธ์ที่ต้องการทดสอบแล้วลองใหม่ได้',
      sandboxRestore:'กู้คืนการซื้อทดสอบ', sandboxBuy:'ซื้อ Pro (ทดสอบ)',
      checkoutTitle:'การซื้อทดสอบ', checkoutBody:'นี่คือการจำลอง Google Play purchase สำหรับ QA เท่านั้น ไม่มีบัตร ไม่มีบัญชีที่ถูกเรียกเก็บ และไม่มีเงินจริงถูกตัด', checkoutConfirm:'ยืนยันการซื้อทดสอบ', checkoutCancel:'ยกเลิก', checkoutPaymentLabel:'วิธีชำระเงินทดสอบ', checkoutTestCard:'บัตรทดสอบ ·•••• 4242', checkoutNoRecurring:'ไม่มีรายเดือน · ไม่มีการเรียกเก็บซ้ำ',
      stateReady:'พร้อมทดสอบ', stateCheckout:'เปิดหน้าชำระแล้ว', stateProcessing:'กำลังดำเนินการ', stateOwned:'เป็นเจ้าของแล้ว', statePending:'รอดำเนินการ', stateCancelled:'ยกเลิกแล้ว', stateError:'เกิดข้อผิดพลาด', stateChecking:'กำลังตรวจสิทธิ์', stateNotOwned:'ยังไม่มีสิทธิ์'
    },
    ja: {
      activeTitle:'Bearagnostic Pro は有効です', activeSub:'このインストールで Google Play の所有権を確認しています。', activeButton:'PRO 有効',
      debugTitle:'Development 用 Pro オーバーライドが有効です', debugSub:'Debug 専用のテスト権限で、Google Play の購入ではありません。', debugButton:'PRO TEST MODE',
      readyTitle:'Bearagnostic Pro を解除', readySub:'Google Play で一度購入すれば買い切り。サブスク・広告・Bearagnostic アカウントは不要です。',
      buy:'Pro を解除', restore:'購入を復元', retry:'Google Play を再確認',
      connectingTitle:'Google Play に接続中', connectingSub:'商品、地域価格、所有権を確認しています。価格を推測・固定表示しません。',
      unavailableTitle:'このインストールではまだ購入できません', unavailableSub:'Play の商品または test track がまだ利用できません。Play Console 連携前は想定された状態です。',
      pendingTitle:'購入処理中', pendingSub:'支払いはまだ完了していません。Play が PURCHASED を返した後にだけ Pro を有効化します。',
      openingTitle:'Google Play を開いています', openingSub:'Google Play の画面で購入を完了またはキャンセルしてください。',
      errorTitle:'Google Play で Billing を確認できません', errorSub:'Bearagnostic から請求は行われていません。後で再試行するか、既存の購入を復元してください。',
      ownershipCached:'以前確認した Play 所有権を端末内に保持しています。Google Play に接続できた時点で再確認します。',
      pricePrefix:'買い切り · ', localPrice:'Google Play の地域価格',
      testTrack:'実際の購入テストには、商品とアプリ build を Google Play test track で利用可能にする必要があります。',
      sandboxLabel:'テスト購入 · DEBUG専用', sandboxTitle:'購入シミュレーター',
      sandboxBody:'Google Play 購入時にアプリ側で見える状態遷移を再現し、Pro の解除、Pending、復元、エラー処理を Play 連携前に確認できます。実際の決済は行いません。',
      sandboxScenario:'テスト結果', sandboxSuccess:'購入成功', sandboxPending:'支払い保留', sandboxCancel:'ユーザーがキャンセル', sandboxError:'支払いエラー', sandboxAlreadyOwned:'購入済み', sandboxNetwork:'ネットワークエラー', sandboxUnavailable:'Billing 利用不可',
      sandboxUsePlay:'Google Play 経路を使う', sandboxEnable:'テスト購入を有効化', sandboxCompletePending:'保留中の支払いを完了', sandboxForgetLocal:'端末内の Pro 権限を消去', sandboxReset:'模擬購入をすべてリセット',
      sandboxTestPrice:'テスト価格', sandboxActiveTitle:'テスト購入を確認 · Pro を解除しました', sandboxActiveSub:'Sandbox が PURCHASED 相当の確認を返したため、実際のアプリと同じ entitlement gate を通して Pro を有効化しました。',
      sandboxReadyTitle:'Bearagnostic Pro の購入フローをテスト', sandboxReadySub:'買い切り購入を本番に近い流れで再現します。Debug build 専用で、実際の請求は発生しません。',
      sandboxPendingTitle:'テスト支払いは保留中です', sandboxPendingSub:'この保留中のテスト支払いを完了するまで Pro は解除されません。',
      sandboxProcessingTitle:'テスト支払いを確認中', sandboxProcessingSub:'実際の Billing でアプリ側が受け取る状態遷移に沿って処理しています。',
      sandboxErrorTitle:'テスト購入は完了しませんでした', sandboxErrorSub:'Pro 権限は付与されていません。テスト結果を変更してもう一度確認できます。',
      sandboxRestore:'テスト購入を復元', sandboxBuy:'Pro を購入（テスト）',
      checkoutTitle:'テスト購入', checkoutBody:'QA 用の Google Play 購入シミュレーションです。カード、アカウント、実際のお金は使用しません。', checkoutConfirm:'テスト購入を確定', checkoutCancel:'キャンセル', checkoutPaymentLabel:'テスト用支払い方法', checkoutTestCard:'テストカード ·•••• 4242', checkoutNoRecurring:'サブスクなし · 継続課金なし',
      stateReady:'準備完了', stateCheckout:'購入画面を表示中', stateProcessing:'処理中', stateOwned:'購入済み', statePending:'保留中', stateCancelled:'キャンセル済み', stateError:'エラー', stateChecking:'所有権を確認中', stateNotOwned:'未購入'
    }
  };

  function c() { return COPY[language()] || COPY.en; }

  function billingState() {
    try { return parse(NATIVE.getBillingState?.(), {}); }
    catch (_) { return {}; }
  }

  function entitlementState() {
    try { return parse(NATIVE.getEntitlementState?.(), ENT.getState?.() || {}); }
    catch (_) { return ENT.getState?.() || {}; }
  }

  function sandboxState() {
    try { return parse(NATIVE.getDebugBillingSandboxState?.(), {available:false}); }
    catch (_) { return {available:false}; }
  }

  function ensureStyle() {
    if (byId('androidBillingStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidBillingStyle';
    style.textContent = `
      .ba-pro-purchase[data-billing-ready]{position:relative;overflow:hidden}
      .ba-pro-purchase[data-billing-ready]:before{content:"";position:absolute;inset:0 auto auto 0;width:100%;height:2px;background:linear-gradient(90deg,rgba(112,96,216,.75),rgba(37,155,221,.65),rgba(64,193,165,.45));opacity:.75}
      .ba-billing-price{display:inline-flex;align-items:center;min-height:24px;margin-top:8px;padding:4px 9px;border-radius:999px;background:linear-gradient(145deg,#f0ecff,#edf7ff);border:1px solid rgba(102,89,190,.08);color:#6159ad;font-size:8px;font-weight:800;letter-spacing:.015em}
      .ba-billing-actions{display:grid;grid-template-columns:1fr auto;gap:7px;margin-top:9px}.ba-billing-actions .ba-pro-primary{margin-top:0!important}.ba-billing-secondary{min-width:104px;height:45px;padding:0 11px;border-radius:16px;background:#f7fafc;border:1px solid rgba(86,116,145,.10);color:#5c7185;font-size:8.5px;font-weight:770;box-shadow:inset 0 1px #fff}
      .ba-billing-note{display:block;margin-top:7px!important;color:#8996a4!important;font-size:7.4px!important;line-height:1.38!important}.ba-billing-note.is-mint{color:#5c8c80!important}
      .ba-billing-primary.is-ready{background:linear-gradient(118deg,#7764d5,#258fdc)!important;color:#fff!important;box-shadow:0 10px 21px rgba(81,78,176,.17)!important}.ba-billing-primary:disabled{cursor:default}
      .ba-billing-spinner{display:inline-block;width:10px;height:10px;margin-right:6px;border:1.6px solid rgba(255,255,255,.45);border-top-color:#fff;border-radius:50%;vertical-align:-1px;animation:baBillingSpin .8s linear infinite}@keyframes baBillingSpin{to{transform:rotate(360deg)}}
      @media(max-width:360px){.ba-billing-actions{grid-template-columns:1fr}.ba-billing-secondary{width:100%}}
      html[data-billing-sandbox-available="true"] .ba-pro-debug{display:none!important}
      .ba-billing-sandbox{margin-top:10px;padding:12px;border-radius:19px;background:linear-gradient(145deg,#f8f6ff,#f1f8ff);border:1px solid rgba(106,94,196,.10);box-shadow:inset 0 1px #fff}
      .ba-billing-sandbox__head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.ba-billing-sandbox__head strong{font-size:11px;color:#3a3a69}.ba-billing-sandbox__label{display:inline-flex;align-items:center;min-height:22px;padding:3px 7px;border-radius:999px;background:#5e5ab7;color:#fff;font-size:7px;font-weight:850;letter-spacing:.07em;white-space:nowrap}.ba-billing-sandbox__body{margin:6px 0 0;font-size:9px;line-height:1.5;color:#6f7187}
      .ba-billing-sandbox__grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:end;margin-top:9px}.ba-billing-sandbox__field label{display:block;margin:0 0 5px;font-size:7.5px;font-weight:800;color:#797890;letter-spacing:.04em}.ba-billing-sandbox__field select{width:100%;height:37px;border-radius:12px;border:1px solid rgba(93,92,162,.12);background:#fff;color:#424d62;padding:0 28px 0 10px;font-size:9px;font-weight:700}.ba-billing-sandbox__state{min-width:86px;min-height:37px;padding:0 9px;border-radius:12px;display:grid;place-items:center;text-align:center;background:#fff;border:1px solid rgba(77,115,145,.09);color:#5a7085;font-size:8px;font-weight:800}
      .ba-billing-sandbox__actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:8px}.ba-billing-sandbox__actions button{min-height:36px;border-radius:12px;padding:6px 8px;background:#fff;border:1px solid rgba(88,104,145,.10);color:#586c80;font-size:8px;font-weight:760}.ba-billing-sandbox__actions button.is-strong{background:linear-gradient(118deg,#7465cf,#358fd7);color:#fff;border-color:transparent}.ba-billing-sandbox__actions button.is-warn{color:#a3663e;background:#fff8ef}.ba-billing-sandbox__actions button:disabled{opacity:.45}
      .ba-sandbox-checkout{position:fixed;inset:0;z-index:3600;display:grid;place-items:end;padding:12px 12px calc(12px + env(safe-area-inset-bottom));background:rgba(15,27,43,.38);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}.ba-sandbox-checkout[hidden]{display:none!important}.ba-sandbox-checkout__card{width:min(100%,460px);margin:0 auto;border-radius:27px;background:linear-gradient(180deg,#fff,#f8fbfe);box-shadow:0 28px 78px rgba(17,37,62,.28);padding:11px 16px 16px}.ba-sandbox-checkout__handle{width:42px;height:4px;margin:0 auto 12px;border-radius:99px;background:#d5dfe9}.ba-sandbox-checkout__label{display:inline-flex;padding:4px 8px;border-radius:999px;background:#5f5ab6;color:#fff;font-size:7px;font-weight:850;letter-spacing:.08em}.ba-sandbox-checkout h3{margin:10px 0 0;font-size:20px;line-height:1.16;color:#1c3046}.ba-sandbox-checkout p{margin:7px 0 0;font-size:10px;line-height:1.52;color:#697b8d}.ba-sandbox-checkout__product{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:13px;padding:12px;border-radius:17px;background:#f3f7fb}.ba-sandbox-checkout__product strong{font-size:11.5px;color:#283e55}.ba-sandbox-checkout__product span{font-size:12px;font-weight:850;color:#5e5bb1}.ba-sandbox-checkout__payment{margin-top:8px;padding:11px 12px;border-radius:16px;background:#fff;border:1px solid rgba(79,108,136,.08)}.ba-sandbox-checkout__payment>span{display:block;font-size:7px;font-weight:850;letter-spacing:.12em;color:#8a98a6}.ba-sandbox-checkout__payment>strong{display:block;margin-top:5px;font-size:10.5px;color:#31475c}.ba-sandbox-checkout__payment>small{display:block;margin-top:4px;font-size:8.5px;color:#7d8b98}.ba-sandbox-checkout__actions{display:grid;grid-template-columns:.8fr 1.2fr;gap:8px;margin-top:12px}.ba-sandbox-checkout__actions button{min-height:44px;border-radius:14px;font-size:9px;font-weight:790}.ba-sandbox-checkout__cancel{background:#eef3f7;color:#5d7082}.ba-sandbox-checkout__confirm{background:linear-gradient(118deg,#7563d2,#288fdc);color:#fff;box-shadow:0 10px 22px rgba(83,78,178,.16)}
      @media(max-width:360px){.ba-billing-sandbox__grid{grid-template-columns:1fr}.ba-billing-sandbox__state{min-width:0}.ba-billing-sandbox__actions{grid-template-columns:1fr}.ba-sandbox-checkout__actions{grid-template-columns:1fr}}
      @media(prefers-reduced-motion:reduce){.ba-billing-spinner{animation:none}}
    `;
    document.head.appendChild(style);
  }

  function renderPurchaseBlock() {
    ensureStyle();
    const block = document.querySelector('.ba-pro-purchase');
    if (!block) return;

    const t = c();
    const ent = entitlementState();
    const billing = billingState();
    const sandbox = sandboxState();
    lastBillingState = billing;
    lastSandboxState = sandbox;
    const sandboxAvailable = sandbox.available === true && sandbox.debugOnly === true;
    const sandboxEnabled = sandboxAvailable && sandbox.enabled === true;
    document.documentElement.dataset.billingSandboxAvailable = sandboxAvailable ? 'true' : 'false';
    const debugOverride = ent.source === 'debug_override';
    const isPro = ent.isPro === true;
    const playOwned = ent.playOwnershipCached === true || billing.playOwnershipCached === true;
    const status = String(billing.status || ent.billingStatus || 'initializing');
    const price = typeof billing.formattedPrice === 'string' && billing.formattedPrice.trim() ? billing.formattedPrice.trim() : null;
    const signature = JSON.stringify([language(), ent.isPro === true, ent.source || '', ent.playOwnershipCached === true, billing.connected === true, billing.connecting === true, billing.productAvailable === true, billing.canPurchase === true, billing.purchasePending === true, status, price || '', sandboxAvailable, sandboxEnabled, sandbox.status || '', sandbox.scenario || '', sandbox.accountOwned === true, sandbox.purchasePending === true, sandbox.checkoutOpen === true]);
    if (block.dataset.billingSignature === signature) { syncPendingPolling(); return; }

    let title = t.connectingTitle;
    let sub = t.connectingSub;
    let primary = t.retry;
    let primaryIsHtml = false;
    let primaryDisabled = false;
    let primaryAction = 'refresh';
    let note = t.testTrack;
    let noteClass = '';
    let showRestore = true;
    let priceHtml = '';

    if (sandboxEnabled) {
      const sandboxStatus = String(sandbox.status || 'ready');
      const sandboxPrice = typeof sandbox.formattedPrice === 'string' ? sandbox.formattedPrice : '';
      const sandboxOwned = sandbox.accountOwned === true && ent.source === 'billing_sandbox' && isPro;
      priceHtml = sandboxPrice ? `<span class="ba-billing-price">${esc(t.sandboxTestPrice + ' · ' + sandboxPrice)}</span>` : '';
      note = t.sandboxLabel;
      if (sandboxOwned || sandboxStatus === 'owned') {
        title = t.sandboxActiveTitle; sub = t.sandboxActiveSub; primary = t.activeButton; primaryDisabled = true; primaryAction = ''; showRestore = false; noteClass = ' is-mint';
      } else if (sandbox.purchasePending === true || sandboxStatus === 'pending') {
        title = t.sandboxPendingTitle; sub = t.sandboxPendingSub; primary = t.sandboxPendingTitle; primaryDisabled = true; primaryAction = ''; showRestore = true;
      } else if (['processing_payment','purchased_unacknowledged','checking_ownership'].includes(sandboxStatus)) {
        title = t.sandboxProcessingTitle; sub = t.sandboxProcessingSub; primary = `<span class="ba-billing-spinner"></span>${esc(t.sandboxProcessingTitle)}`; primaryIsHtml = true; primaryDisabled = true; primaryAction = ''; showRestore = false;
      } else if (sandboxStatus === 'checkout_open') {
        title = t.sandboxReadyTitle; sub = t.sandboxReadySub; primary = t.sandboxBuy; primaryDisabled = true; primaryAction = ''; showRestore = false;
      } else if (['error','network_error','billing_unavailable','cancelled'].includes(sandboxStatus)) {
        title = t.sandboxErrorTitle; sub = t.sandboxErrorSub; primary = sandboxPrice ? `${t.sandboxBuy} · ${sandboxPrice}` : t.sandboxBuy; primaryDisabled = false; primaryAction = 'purchase'; showRestore = true;
      } else {
        title = t.sandboxReadyTitle; sub = t.sandboxReadySub; primary = sandboxPrice ? `${t.sandboxBuy} · ${sandboxPrice}` : t.sandboxBuy; primaryDisabled = false; primaryAction = 'purchase'; showRestore = true;
      }
    } else if (isPro && debugOverride) {
      title = t.debugTitle; sub = t.debugSub; primary = t.debugButton; primaryDisabled = true; primaryAction = ''; showRestore = true;
      note = playOwned ? t.ownershipCached : t.testTrack;
    } else if (isPro && playOwned) {
      title = t.activeTitle; sub = t.activeSub; primary = t.activeButton; primaryDisabled = true; primaryAction = ''; showRestore = false;
      note = t.ownershipCached; noteClass = ' is-mint';
    } else if (billing.purchasePending === true || status === 'pending') {
      title = t.pendingTitle; sub = t.pendingSub; primary = t.pendingTitle; primaryDisabled = true; primaryAction = ''; showRestore = true;
    } else if (['launching_purchase','purchase_flow_open'].includes(status)) {
      title = t.openingTitle; sub = t.openingSub; primary = `<span class="ba-billing-spinner"></span>${esc(t.openingTitle)}`; primaryIsHtml = true; primaryDisabled = true; primaryAction = ''; showRestore = false;
    } else if (billing.canPurchase === true && price) {
      title = t.readyTitle; sub = t.readySub; primary = `${t.buy} · ${price}`; primaryDisabled = false; primaryAction = 'purchase'; showRestore = true;
      priceHtml = `<span class="ba-billing-price">${esc(t.pricePrefix + price)}</span>`;
      note = t.localPrice;
    } else if (billing.connecting === true || status === 'connecting' || status === 'initializing') {
      title = t.connectingTitle; sub = t.connectingSub; primary = t.retry; primaryAction = 'refresh'; showRestore = true;
    } else if (status === 'product_unavailable' || billing.productAvailable === false && billing.billingReady === true) {
      title = t.unavailableTitle; sub = t.unavailableSub; primary = t.retry; primaryAction = 'refresh'; showRestore = true;
    } else {
      title = t.errorTitle; sub = t.errorSub; primary = t.retry; primaryAction = 'refresh'; showRestore = true;
    }

    block.dataset.billingReady = '1';
    block.dataset.billingSignature = signature;
    block.innerHTML = `<strong>${esc(title)}</strong><small>${esc(sub)}</small>${priceHtml}<div class="ba-billing-actions"><button class="ba-pro-primary ba-billing-primary${primaryAction === 'purchase' ? ' is-ready' : ''}" type="button" ${primaryDisabled ? 'disabled' : ''} ${primaryAction ? `data-billing-action="${primaryAction}"` : ''}>${primaryIsHtml ? primary : esc(primary)}</button>${showRestore ? `<button class="ba-billing-secondary" type="button" data-billing-action="restore">${esc(sandboxEnabled ? t.sandboxRestore : t.restore)}</button>` : ''}</div><small class="ba-billing-note${noteClass}">${esc(note)}</small>`;

    renderSandboxPanel();
    renderSandboxCheckout();
    syncPendingPolling();
  }

  function sandboxStatusLabel(status) {
    const t = c();
    return ({
      ready:t.stateReady, checkout_open:t.stateCheckout, processing_payment:t.stateProcessing,
      purchased_unacknowledged:t.stateProcessing, owned:t.stateOwned, pending:t.statePending,
      cancelled:t.stateCancelled, error:t.stateError, network_error:t.stateError,
      billing_unavailable:t.stateError, checking_ownership:t.stateChecking,
      not_owned:t.stateNotOwned, disabled:t.stateNotOwned
    })[String(status || '')] || t.stateReady;
  }

  function sandboxScenarioOptions(current) {
    const t = c();
    const options = [
      ['success',t.sandboxSuccess],['pending',t.sandboxPending],['cancel',t.sandboxCancel],
      ['error',t.sandboxError],['already_owned',t.sandboxAlreadyOwned],['network_error',t.sandboxNetwork],
      ['billing_unavailable',t.sandboxUnavailable]
    ];
    return options.map(([value,label]) => `<option value="${value}" ${value === current ? 'selected' : ''}>${esc(label)}</option>`).join('');
  }

  function renderSandboxPanel() {
    const purchase = document.querySelector('.ba-pro-purchase');
    if (!purchase) return;
    const t = c();
    const sandbox = sandboxState();
    lastSandboxState = sandbox;
    let panel = byId('baBillingSandboxPanel');
    if (sandbox.available !== true || sandbox.debugOnly !== true) {
      panel?.remove();
      document.documentElement.dataset.billingSandboxAvailable = 'false';
      return;
    }
    document.documentElement.dataset.billingSandboxAvailable = 'true';
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'baBillingSandboxPanel';
      panel.className = 'ba-billing-sandbox';
      purchase.insertAdjacentElement('afterend', panel);
    } else if (panel.previousElementSibling !== purchase) {
      purchase.insertAdjacentElement('afterend', panel);
    }
    const enabled = sandbox.enabled === true;
    const pending = sandbox.purchasePending === true;
    const accountOwned = sandbox.accountOwned === true;
    const entitlementApplied = sandbox.entitlementApplied === true;
    panel.innerHTML = `<div class="ba-billing-sandbox__head"><div><strong>${esc(t.sandboxTitle)}</strong><p class="ba-billing-sandbox__body">${esc(t.sandboxBody)}</p></div><span class="ba-billing-sandbox__label">${esc(t.sandboxLabel)}</span></div>` +
      (enabled
        ? `<div class="ba-billing-sandbox__grid"><div class="ba-billing-sandbox__field"><label>${esc(t.sandboxScenario)}</label><select data-sandbox-scenario>${sandboxScenarioOptions(String(sandbox.scenario || 'success'))}</select></div><div class="ba-billing-sandbox__state">${esc(sandboxStatusLabel(sandbox.status))}</div></div><div class="ba-billing-sandbox__actions">${pending ? `<button class="is-strong" type="button" data-sandbox-action="complete-pending">${esc(t.sandboxCompletePending)}</button>` : ''}<button type="button" data-sandbox-action="restore">${esc(t.sandboxRestore)}</button>${accountOwned && entitlementApplied ? `<button type="button" data-sandbox-action="forget-local">${esc(t.sandboxForgetLocal)}</button>` : ''}<button class="is-warn" type="button" data-sandbox-action="reset">${esc(t.sandboxReset)}</button><button type="button" data-sandbox-action="disable">${esc(t.sandboxUsePlay)}</button></div>`
        : `<div class="ba-billing-sandbox__actions"><button class="is-strong" type="button" data-sandbox-action="enable">${esc(t.sandboxEnable)}</button></div>`);
  }

  function ensureSandboxCheckout() {
    let overlay = byId('baSandboxCheckout');
    if (overlay) return overlay;
    overlay = document.createElement('section');
    overlay.id = 'baSandboxCheckout';
    overlay.className = 'ba-sandbox-checkout';
    overlay.hidden = true;
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    document.body.appendChild(overlay);
    return overlay;
  }

  function renderSandboxCheckout() {
    const overlay = ensureSandboxCheckout();
    const sandbox = sandboxState();
    if (sandbox.available !== true || sandbox.enabled !== true || sandbox.checkoutOpen !== true) {
      overlay.hidden = true;
      return;
    }
    const t = c();
    const price = typeof sandbox.formattedPrice === 'string' ? sandbox.formattedPrice : '—';
    overlay.hidden = false;
    overlay.innerHTML = `<div class="ba-sandbox-checkout__card"><div class="ba-sandbox-checkout__handle"></div><span class="ba-sandbox-checkout__label">${esc(t.sandboxLabel)}</span><h3>${esc(t.checkoutTitle)}</h3><p>${esc(t.checkoutBody)}</p><div class="ba-sandbox-checkout__product"><strong>Bearagnostic Pro · Lifetime</strong><span>${esc(price)}</span></div><div class="ba-sandbox-checkout__payment"><span>${esc(t.checkoutPaymentLabel)}</span><strong>${esc(t.checkoutTestCard)}</strong><small>${esc(t.checkoutNoRecurring)}</small></div><div class="ba-sandbox-checkout__actions"><button class="ba-sandbox-checkout__cancel" type="button" data-sandbox-checkout="cancel">${esc(t.checkoutCancel)}</button><button class="ba-sandbox-checkout__confirm" type="button" data-sandbox-checkout="confirm">${esc(t.checkoutConfirm)}</button></div></div>`;
  }

  function syncPendingPolling() {
    const shouldPoll = lastBillingState?.purchasePending === true && !document.hidden && lastSandboxState?.enabled !== true;
    if (shouldPoll && pendingPoll == null) {
      pendingPoll = setInterval(() => {
        try { NATIVE.refreshBilling?.(); } catch (_) {}
        scheduleRefresh(250);
      }, 15000);
    } else if (!shouldPoll && pendingPoll != null) {
      clearInterval(pendingPoll); pendingPoll = null;
    }

    const sandboxStatus = String(lastSandboxState?.status || '');
    const sandboxBusy = lastSandboxState?.enabled === true && ['checkout_open','processing_payment','purchased_unacknowledged','checking_ownership'].includes(sandboxStatus) && !document.hidden;
    if (sandboxBusy && sandboxPoll == null) {
      sandboxPoll = setInterval(() => {
        const next = sandboxState();
        const signature = JSON.stringify([next.status,next.accountOwned,next.entitlementApplied,next.acknowledged,next.purchasePending,next.checkoutOpen,next.lastEvent,next.lastSyncAtMs]);
        if (signature !== lastSandboxSignature) {
          lastSandboxSignature = signature;
          try { ENT.refresh?.(); } catch (_) {}
          try { NATIVE.refreshNativeState?.(); } catch (_) {}
          renderPurchaseBlock();
          renderSandboxPanel();
          renderSandboxCheckout();
        }
      }, 260);
    } else if (!sandboxBusy && sandboxPoll != null) {
      clearInterval(sandboxPoll); sandboxPoll = null;
    }
  }

  function sandboxPerform(action, value = null) {
    let result = {};
    try {
      if (action === 'enable') result = parse(NATIVE.setDebugBillingSandboxEnabled?.(true), {});
      else if (action === 'disable') result = parse(NATIVE.setDebugBillingSandboxEnabled?.(false), {});
      else if (action === 'scenario') result = parse(NATIVE.setDebugBillingSandboxScenario?.(String(value || 'success')), {});
      else if (action === 'purchase') result = parse(NATIVE.launchDebugBillingSandboxPurchase?.(), {});
      else if (action === 'confirm') result = parse(NATIVE.confirmDebugBillingSandboxPurchase?.(), {});
      else if (action === 'cancel') result = parse(NATIVE.cancelDebugBillingSandboxPurchase?.(), {});
      else if (action === 'complete-pending') result = parse(NATIVE.completeDebugBillingSandboxPending?.(), {});
      else if (action === 'restore') result = parse(NATIVE.restoreDebugBillingSandboxPurchase?.(), {});
      else if (action === 'forget-local') result = parse(NATIVE.forgetDebugBillingSandboxLocalEntitlement?.(), {});
      else if (action === 'reset') result = parse(NATIVE.resetDebugBillingSandboxPurchase?.(), {});
    } catch (_) { result = {accepted:false}; }
    try { ENT.refresh?.(); } catch (_) {}
    try { NATIVE.refreshNativeState?.(); } catch (_) {}
    scheduleRefresh(action === 'purchase' || action === 'confirm' || action === 'restore' || action === 'complete-pending' ? 120 : 30);
    return result;
  }

  function perform(action) {
    const sandbox = sandboxState();
    if (sandbox.available === true && sandbox.enabled === true) {
      if (action === 'purchase') return sandboxPerform('purchase');
      if (action === 'restore') return sandboxPerform('restore');
    }
    let result = {};
    try {
      if (action === 'purchase') result = parse(NATIVE.purchasePro?.(), {});
      else if (action === 'restore') result = parse(NATIVE.restoreProPurchase?.(), {});
      else result = parse(NATIVE.refreshBilling?.(), {});
    } catch (_) { result = {accepted:false}; }
    scheduleRefresh(action === 'purchase' ? 700 : 350);
    if (result?.accepted === false && action === 'purchase' && ['product_unavailable','offer_unavailable','billing_not_ready'].includes(result.reason)) {
      try { NATIVE.refreshBilling?.(); } catch (_) {}
      scheduleRefresh(600);
    }
  }

  function scheduleRefresh(delay = 80) {
    if (refreshTimer != null) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      refreshTimer = null;
      try { ENT.refresh?.(); } catch (_) {}
      renderPurchaseBlock();
      renderSandboxPanel();
      renderSandboxCheckout();
    }, delay);
  }

  document.addEventListener('click', (event) => {
    const sandboxButton = event.target?.closest?.('[data-sandbox-action]');
    if (sandboxButton) {
      event.preventDefault();
      event.stopPropagation();
      sandboxPerform(sandboxButton.dataset.sandboxAction);
      return;
    }
    const checkoutButton = event.target?.closest?.('[data-sandbox-checkout]');
    if (checkoutButton) {
      event.preventDefault();
      event.stopPropagation();
      sandboxPerform(checkoutButton.dataset.sandboxCheckout === 'confirm' ? 'confirm' : 'cancel');
      return;
    }
    const button = event.target?.closest?.('[data-billing-action]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    perform(button.dataset.billingAction);
  }, true);

  document.addEventListener('change', (event) => {
    const select = event.target?.closest?.('[data-sandbox-scenario]');
    if (!select) return;
    sandboxPerform('scenario', select.value);
  }, true);

  window.addEventListener('bearagnostic:entitlementchange', () => scheduleRefresh(0));
  window.addEventListener('focus', () => {
    try { NATIVE.refreshBilling?.(); } catch (_) {}
    scheduleRefresh(220);
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      try { NATIVE.refreshBilling?.(); } catch (_) {}
      scheduleRefresh(220);
    } else {
      syncPendingPolling();
    }
  });

  const observer = new MutationObserver(() => {
    if (observerQueued) return;
    observerQueued = true;
    queueMicrotask(() => {
      observerQueued = false;
      if (document.querySelector('.ba-pro-purchase')) renderPurchaseBlock();
    });
  });
  observer.observe(document.body, {childList:true, subtree:true});

  window.BearagnosticBilling = Object.freeze({
    refresh: () => { try { NATIVE.refreshBilling?.(); } catch (_) {}; scheduleRefresh(120); },
    getState: () => ({...lastBillingState}),
    getSandboxState: () => ({...lastSandboxState}),
    sandboxAction: sandboxPerform
  });

  try { NATIVE.refreshBilling?.(); } catch (_) {}
  scheduleRefresh(180);
})();

/* B48 — dual-sided Billing Sandbox developer console. Customer purchase UX remains in the
   normal Pro surface above; owner/store controls stay hidden behind 7 taps on build metadata. */
(() => {
  'use strict';
  const NATIVE = window.BearagnosticNative;
  const ENT = window.BearagnosticEntitlement;
  if (!NATIVE || !ENT || typeof NATIVE.getDebugBillingSandboxState !== 'function') return;

  const $ = (s, r=document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const parse = (v, f={}) => { try { return typeof v === 'string' ? JSON.parse(v) : (v || f); } catch (_) { return f; } };
  const lang = () => { const v=(document.documentElement.lang||'en').toLowerCase(); return v.startsWith('th')?'th':v.startsWith('ja')?'ja':'en'; };
  const state = () => parse(NATIVE.getDebugBillingSandboxState?.(), {available:false});
  let tapCount=0, tapTimer=null, poll=null, activeTab='overview';

  const COPY = {
    en:{
      dev:'Developer Tools',devSub:'Debug build · Billing Sandbox & QA',enabled:'Developer mode enabled',tap:'Keep tapping build number…',
      title:'Billing QA Console',subtitle:'Dual-sided customer + store simulation',debug:'DEBUG ONLY',close:'Close',
      overview:'Overview',store:'Store',transactions:'Transactions',events:'Events',
      customer:'CUSTOMER APP',storeSide:'SANDBOX STORE',entitlement:'Entitlement',ownership:'Store ownership',status:'Status',currentTx:'Current transaction',
      openCustomer:'Open customer purchase flow',restore:'Restore purchase',sync:'Sync ownership',reinstall:'Simulate reinstall',clearLocal:'Clear local entitlement',
      provider:'Sandbox provider',providerOn:'Enabled',providerOff:'Disabled',market:'Market / test price',network:'Network',payment:'Payment behavior',ack:'Acknowledgement',availability:'Store availability',
      online:'Online',slow:'Slow',offline:'Offline',approve:'Approve immediately',pending:'Pending / manual decision',decline:'Decline',chargebackLater:'Approve then charge back',ackOk:'Succeed',ackOnce:'Fail once, retry',ackAlways:'Always fail',available:'Available',unavailable:'Unavailable',
      pendingActions:'Pending payment decision',confirmPending:'Confirm payment',declinePending:'Cancel / decline',ownershipActions:'Ownership lifecycle',retryAck:'Retry acknowledgement',refundKeep:'Refund · keep access',refundRevoke:'Refund + revoke',revoke:'Revoke access',chargeback:'Chargeback / void',expireAck:'Simulate 3-day unacknowledged refund',
      reset:'Reset sandbox',disable:'Disable developer mode',noTx:'No transactions yet',noEvents:'No events yet',clearEvents:'Clear events',
      testOnly:'No real money · no Google account · local QA ledger only',free:'FREE',pro:'PRO',yes:'Yes',no:'No',none:'—'
    },
    th:{
      dev:'เครื่องมือนักพัฒนา',devSub:'Debug build · Billing Sandbox และ QA',enabled:'เปิด Developer mode แล้ว',tap:'แตะเลข Build ต่ออีก…',
      title:'Billing QA Console',subtitle:'จำลองฝั่งลูกค้า + ฝั่ง Store เชื่อมกันจริง',debug:'DEBUG เท่านั้น',close:'ปิด',
      overview:'ภาพรวม',store:'Store',transactions:'ธุรกรรม',events:'เหตุการณ์',
      customer:'ฝั่งแอปลูกค้า',storeSide:'ฝั่ง SANDBOX STORE',entitlement:'สิทธิ์ในแอป',ownership:'สิทธิ์ที่ Store',status:'สถานะ',currentTx:'ธุรกรรมปัจจุบัน',
      openCustomer:'เปิดหน้าซื้อแบบลูกค้า',restore:'กู้คืนการซื้อ',sync:'ซิงก์สิทธิ์จาก Store',reinstall:'จำลองติดตั้งแอปใหม่',clearLocal:'ล้างสิทธิ์เฉพาะในแอป',
      provider:'Sandbox provider',providerOn:'เปิดใช้งาน',providerOff:'ปิดใช้งาน',market:'ประเทศ / ราคาทดสอบ',network:'เครือข่าย',payment:'พฤติกรรมการชำระ',ack:'การ Acknowledge',availability:'สถานะ Store',
      online:'ออนไลน์',slow:'ช้า',offline:'ออฟไลน์',approve:'อนุมัติทันที',pending:'Pending รอเจ้าของตัดสิน',decline:'ปฏิเสธ',chargebackLater:'อนุมัติแล้ว Chargeback',ackOk:'สำเร็จ',ackOnce:'ล้มเหลว 1 ครั้งแล้ว Retry',ackAlways:'ล้มเหลวตลอด',available:'พร้อมใช้งาน',unavailable:'ใช้งานไม่ได้',
      pendingActions:'ตัดสินรายการ Pending',confirmPending:'ยืนยันรับเงิน',declinePending:'ยกเลิก / ปฏิเสธ',ownershipActions:'จัดการวงจรสิทธิ์',retryAck:'Retry Acknowledgement',refundKeep:'Refund · คงสิทธิ์',refundRevoke:'Refund + ถอนสิทธิ์',revoke:'ถอนสิทธิ์',chargeback:'Chargeback / Void',expireAck:'จำลองครบ 3 วันไม่ Acknowledge',
      reset:'รีเซ็ต Sandbox',disable:'ปิด Developer mode',noTx:'ยังไม่มีธุรกรรม',noEvents:'ยังไม่มีเหตุการณ์',clearEvents:'ล้าง Event log',
      testOnly:'ไม่มีเงินจริง · ไม่มีบัญชี Google · ใช้ Ledger จำลองในเครื่องเท่านั้น',free:'FREE',pro:'PRO',yes:'ใช่',no:'ไม่',none:'—'
    },
    ja:{
      dev:'Developer Tools',devSub:'Debug build · Billing Sandbox / QA',enabled:'Developer mode を有効にしました',tap:'Build 番号を続けてタップ…',
      title:'Billing QA Console',subtitle:'顧客側 + Store 側を連動して再現',debug:'DEBUG専用',close:'閉じる',
      overview:'概要',store:'Store',transactions:'取引',events:'イベント',
      customer:'顧客アプリ側',storeSide:'SANDBOX STORE側',entitlement:'アプリ権限',ownership:'Store 所有権',status:'状態',currentTx:'現在の取引',
      openCustomer:'顧客の購入画面を開く',restore:'購入を復元',sync:'所有権を同期',reinstall:'再インストールを再現',clearLocal:'端末側権限を消去',
      provider:'Sandbox provider',providerOn:'有効',providerOff:'無効',market:'市場 / テスト価格',network:'ネットワーク',payment:'支払い動作',ack:'Acknowledgement',availability:'Store 状態',
      online:'オンライン',slow:'低速',offline:'オフライン',approve:'即時承認',pending:'Pending / 手動確定',decline:'拒否',chargebackLater:'承認後に Chargeback',ackOk:'成功',ackOnce:'1回失敗して再試行',ackAlways:'常に失敗',available:'利用可能',unavailable:'利用不可',
      pendingActions:'Pending 支払い',confirmPending:'支払い確定',declinePending:'キャンセル / 拒否',ownershipActions:'所有権ライフサイクル',retryAck:'Acknowledgement 再試行',refundKeep:'返金 · 権限維持',refundRevoke:'返金 + 権限取消',revoke:'権限を取消',chargeback:'Chargeback / Void',expireAck:'未承認3日経過を再現',
      reset:'Sandbox をリセット',disable:'Developer mode を無効化',noTx:'取引はまだありません',noEvents:'イベントはまだありません',clearEvents:'イベントを消去',
      testOnly:'実課金なし · Google アカウントなし · 端末内QA台帳のみ',free:'FREE',pro:'PRO',yes:'はい',no:'いいえ',none:'—'
    }
  };
  const c=()=>COPY[lang()]||COPY.en;

  function call(name, value, kind='none') {
    try {
      const fn=NATIVE[name]; if(typeof fn!=='function') return {accepted:false,reason:'bridge_unavailable'};
      const raw = kind==='bool' ? fn(Boolean(value)) : kind==='string' ? fn(String(value)) : fn();
      const result=parse(raw,{accepted:false});
      ENT.refresh?.(); NATIVE.refreshNativeState?.(); setTimeout(refreshAll,60); return result;
    } catch (_) { return {accepted:false,reason:'bridge_error'}; }
  }

  function ensureStyle(){
    if($('#baDevBillingStyle')) return;
    const style=document.createElement('style'); style.id='baDevBillingStyle'; style.textContent=`
      /* Scenario selectors never appear in customer-facing Pro UI. */
      #baBillingSandboxPanel{display:none!important}
      .ba-dev-row .soft-icon{background:linear-gradient(145deg,#dfe8ff,#8b8de7 62%,#5e62b9)!important;color:#fff!important}
      .ba-dev-console{position:fixed;inset:0;z-index:4900;background:linear-gradient(180deg,#f4f8fc,#eaf2f8);display:grid;grid-template-rows:auto auto minmax(0,1fr);color:#1b3047}.ba-dev-console[hidden]{display:none!important}
      .ba-dev-head{padding:calc(14px + env(safe-area-inset-top)) 16px 12px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;background:rgba(252,254,255,.97);border-bottom:1px solid rgba(62,91,122,.08)}.ba-dev-head__kicker{font-size:8px;font-weight:900;letter-spacing:.14em;color:#6a64bb}.ba-dev-head h2{margin:4px 0 0;font-size:22px;line-height:1.15;color:#1b3046}.ba-dev-head p{margin:4px 0 0;font-size:10.5px;line-height:1.4;color:#718294}.ba-dev-close{width:42px;height:42px;border-radius:14px;background:#eef3f8;color:#627487;font-size:23px}
      .ba-dev-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:8px 12px;background:rgba(249,252,254,.96);border-bottom:1px solid rgba(72,101,128,.06)}.ba-dev-tab{min-height:35px;border-radius:11px;background:#eef3f7;color:#657789;font-size:9px;font-weight:780}.ba-dev-tab.is-active{background:linear-gradient(135deg,#675fcb,#3e86d8);color:#fff;box-shadow:0 6px 15px rgba(77,76,171,.16)}
      .ba-dev-scroll{overflow:auto;padding:12px 12px calc(26px + env(safe-area-inset-bottom));scrollbar-width:none}.ba-dev-scroll::-webkit-scrollbar{display:none}.ba-dev-wrap{max-width:680px;margin:0 auto;display:grid;gap:10px}.ba-dev-card{padding:13px;border-radius:21px;background:#fff;border:1px solid rgba(69,102,132,.07);box-shadow:0 8px 24px rgba(48,75,101,.045)}.ba-dev-card h3{margin:0;font-size:13px;line-height:1.28;color:#2a4157}.ba-dev-card>p{margin:5px 0 0;font-size:9.5px;line-height:1.5;color:#7b8997}.ba-dev-eyebrow{display:block;margin-bottom:6px;font-size:7.5px;font-weight:900;letter-spacing:.13em;color:#7a74be}
      .ba-dev-metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:10px}.ba-dev-metric{padding:10px;border-radius:15px;background:#f5f8fb;min-width:0}.ba-dev-metric span{display:block;font-size:8px;color:#82909d}.ba-dev-metric b{display:block;margin-top:4px;font-size:11.5px;line-height:1.25;color:#294157;overflow-wrap:anywhere}.ba-dev-metric b.is-pro{color:#2d8c76}.ba-dev-metric b.is-warn{color:#a06933}
      .ba-dev-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:10px}.ba-dev-actions button{min-height:40px;padding:7px 9px;border-radius:13px;background:#eef3f7;color:#536b80;font-size:9px;font-weight:760}.ba-dev-actions button.primary{background:linear-gradient(120deg,#6960cd,#398ad9);color:#fff}.ba-dev-actions button.mint{background:#e9f8f3;color:#247d69}.ba-dev-actions button.warn{background:#fff4e5;color:#946127}.ba-dev-actions button.danger{background:#fff0f1;color:#a34b54}.ba-dev-actions button:disabled{opacity:.38}
      .ba-dev-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.ba-dev-field label{display:block;margin-bottom:4px;font-size:8px;font-weight:780;color:#7c8996}.ba-dev-field select{width:100%;height:40px;border-radius:13px;border:1px solid rgba(72,105,135,.10);background:#f8fafc;color:#3d5368;padding:0 28px 0 10px;font-size:9.5px;font-weight:700}
      .ba-dev-tx,.ba-dev-event{padding:10px 11px;border-radius:15px;background:#f7f9fc;border:1px solid rgba(72,103,132,.055)}.ba-dev-tx+.ba-dev-tx,.ba-dev-event+.ba-dev-event{margin-top:7px}.ba-dev-tx__top,.ba-dev-event__top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.ba-dev-tx strong,.ba-dev-event strong{font-size:10.5px;color:#31485e}.ba-dev-tx small,.ba-dev-event small{font-size:8.5px;color:#8795a2}.ba-dev-tx p,.ba-dev-event p{margin:5px 0 0;font-size:9px;line-height:1.45;color:#708193}.ba-dev-pill{display:inline-flex;align-items:center;padding:4px 7px;border-radius:999px;background:#edf2f7;color:#62768a;font-size:7.5px;font-weight:850}.ba-dev-pill.pro{background:#e8f7f1;color:#26806c}.ba-dev-pill.pending{background:#fff3dd;color:#9d6c25}.ba-dev-pill.void{background:#fff0f1;color:#a44f58}
      .ba-dev-note{padding:10px 11px;border-radius:15px;background:linear-gradient(135deg,#f4f2ff,#eff8fd);color:#69748c;font-size:9px;line-height:1.5}.ba-dev-empty{text-align:center;padding:24px 12px;color:#8996a2;font-size:10px}
      @media(max-width:370px){.ba-dev-fields,.ba-dev-actions{grid-template-columns:1fr}.ba-dev-head h2{font-size:20px}}
    `; document.head.appendChild(style);
  }

  function ensureRow(s=state()){
    const about=$('#moreScreen [data-open="about"]'); if(!about) return null;
    let row=$('#baDeveloperToolsRow');
    if(s.devModeEnabled!==true){ row?.remove(); return null; }
    if(!row){
      // Match the production More rows exactly. A div avoids browser button defaults and
      // stays compatible with the existing setting-link layout/animation rules.
      row=document.createElement('div'); row.id='baDeveloperToolsRow'; row.className='setting-link ba-dev-row';
      row.setAttribute('role','button'); row.setAttribute('tabindex','0'); row.setAttribute('aria-label',c().dev);
      row.innerHTML=`<span class="soft-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9 5 12l3 3M16 9l3 3-3 3M14 6l-4 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span><strong></strong><small></small></span><b>›</b>`;
      about.parentElement?.insertBefore(row,about);
      row.addEventListener('click',openConsole);
      row.addEventListener('keydown',(event)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openConsole();}});
    }
    const t=c(); row.setAttribute('aria-label',t.dev); $('strong',row).textContent=t.dev; $('small',row).textContent=t.devSub;
    return row;
  }

  function revealDeveloperTools(s, { open = false } = {}){
    const confirmed=s?.devModeEnabled===true ? s : state();
    if(confirmed?.devModeEnabled!==true) return false;
    ensureStyle();
    const row=ensureRow(confirmed);
    if(row){
      try { row.scrollIntoView({behavior:'smooth',block:'center'}); } catch (_) { row.scrollIntoView?.(); }
    }
    if(open) openConsole();
    return true;
  }

  function activateTap(event){
    const target=event.target?.closest?.('#moreScreen [data-open="about"] small'); if(!target) return;
    const s=state(); if(s.available!==true || s.devModeEnabled===true) return;
    event.preventDefault(); event.stopPropagation();
    tapCount++; clearTimeout(tapTimer); tapTimer=setTimeout(()=>{tapCount=0},2600);
    if(tapCount>=7){
      tapCount=0;
      const result=call('setDebugBillingDeveloperMode',true,'bool');
      const confirmed=result?.accepted===true && result?.state?.devModeEnabled===true;
      if(!confirmed){
        const reason=String(result?.reason||'developer_mode_activation_failed').replaceAll('_',' ');
        toast(`Developer mode unavailable · ${reason}`);
        return;
      }
      toast(c().enabled);
      // Open the console immediately so successful activation always produces a visible,
      // testable result. Re-assert the More entry after other adapters finish repainting.
      revealDeveloperTools(result.state,{open:true});
      [80,220,600,1200].forEach(delay=>setTimeout(()=>revealDeveloperTools(state()),delay));
    }
    else if(tapCount>=4) toast(`${c().tap} ${7-tapCount}`);
  }

  function toast(text){
    let el=$('#baDevToast'); if(!el){el=document.createElement('div');el.id='baDevToast';el.style.cssText='position:fixed;z-index:6000;left:50%;bottom:92px;transform:translateX(-50%);max-width:84vw;padding:9px 13px;border-radius:999px;background:rgba(25,43,61,.92);color:#fff;font:600 10px/1.3 system-ui;text-align:center;box-shadow:0 8px 22px rgba(20,36,52,.2);';document.body.appendChild(el);} el.textContent=text;el.hidden=false;clearTimeout(el._t);el._t=setTimeout(()=>el.hidden=true,1500);
  }

  function ensureConsole(){
    ensureStyle(); let el=$('#baDevBillingConsole'); if(el) return el;
    el=document.createElement('section');el.id='baDevBillingConsole';el.className='ba-dev-console';el.hidden=true;el.innerHTML='<header class="ba-dev-head"></header><nav class="ba-dev-tabs"></nav><div class="ba-dev-scroll"><div class="ba-dev-wrap"></div></div>';document.body.appendChild(el);return el;
  }
  function openConsole(){const el=ensureConsole();el.hidden=false;document.body.classList.add('modal-open');renderConsole();startPoll();}
  function closeConsole(){const el=$('#baDevBillingConsole');if(el)el.hidden=true;document.body.classList.remove('modal-open');stopPoll();}

  const opt=(v,l,cur)=>`<option value="${esc(v)}" ${v===cur?'selected':''}>${esc(l)}</option>`;
  const fmtTime=(ms)=>{if(!Number(ms))return '—';try{return new Intl.DateTimeFormat(lang()==='th'?'th-TH':lang()==='ja'?'ja-JP':'en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date(Number(ms)));}catch(_){return '—';}};
  const pill=(value)=>{const v=String(value||'');const cls=/owned|purchased|confirmed|pro/i.test(v)?'pro':/pending|processing/i.test(v)?'pending':/void|refund|revok|charge|cancel|declin/i.test(v)?'void':'';return `<span class="ba-dev-pill ${cls}">${esc(v||'—')}</span>`;};

  function renderConsole(){
    const el=ensureConsole(),s=state(),t=c(); if(s.devModeEnabled!==true){closeConsole();ensureRow(s);return;}
    $('.ba-dev-head',el).innerHTML=`<div><span class="ba-dev-head__kicker">${esc(t.debug)} · B48</span><h2>${esc(t.title)}</h2><p>${esc(t.subtitle)}</p></div><button class="ba-dev-close" type="button" data-dev-close aria-label="${esc(t.close)}">×</button>`;
    $('.ba-dev-tabs',el).innerHTML=[['overview',t.overview],['store',t.store],['transactions',t.transactions],['events',t.events]].map(([id,label])=>`<button class="ba-dev-tab ${activeTab===id?'is-active':''}" type="button" data-dev-tab="${id}">${esc(label)}</button>`).join('');
    const wrap=$('.ba-dev-wrap',el); wrap.innerHTML=activeTab==='store'?renderStore(s,t):activeTab==='transactions'?renderTransactions(s,t):activeTab==='events'?renderEvents(s,t):renderOverview(s,t);
  }

  function renderOverview(s,t){
    const ent=parse(NATIVE.getEntitlementState?.(),{}),tx=s.currentTransaction&&typeof s.currentTransaction==='object'?s.currentTransaction:null;
    return `<div class="ba-dev-note">${esc(t.testOnly)}</div>
      <section class="ba-dev-card"><span class="ba-dev-eyebrow">${esc(t.customer)}</span><h3>Bearagnostic Pro</h3><div class="ba-dev-metrics"><div class="ba-dev-metric"><span>${esc(t.entitlement)}</span><b class="${ent.isPro?'is-pro':''}">${ent.isPro?t.pro:t.free}</b></div><div class="ba-dev-metric"><span>${esc(t.status)}</span><b>${esc(String(s.status||'—'))}</b></div></div><div class="ba-dev-actions"><button class="primary" data-dev-action="customer-flow">${esc(t.openCustomer)}</button><button data-dev-action="restore">${esc(t.restore)}</button><button data-dev-action="clear-local">${esc(t.clearLocal)}</button><button data-dev-action="reinstall">${esc(t.reinstall)}</button></div></section>
      <section class="ba-dev-card"><span class="ba-dev-eyebrow">${esc(t.storeSide)}</span><h3>${esc(s.productId||'Bearagnostic Pro')}</h3><div class="ba-dev-metrics"><div class="ba-dev-metric"><span>${esc(t.ownership)}</span><b class="${s.storeOwned?'is-pro':''}">${s.storeOwned?t.yes:t.no}</b></div><div class="ba-dev-metric"><span>${esc(t.currentTx)}</span><b>${esc(tx?.id||t.none)}</b></div><div class="ba-dev-metric"><span>${esc(t.market)}</span><b>${esc(`${String(s.market||'').toUpperCase()} · ${s.formattedPrice||'—'}`)}</b></div><div class="ba-dev-metric"><span>${esc(t.provider)}</span><b>${s.enabled?esc(t.providerOn):esc(t.providerOff)}</b></div></div><div class="ba-dev-actions"><button class="mint" data-dev-action="sync">${esc(t.sync)}</button>${s.purchasePending?`<button class="primary" data-dev-action="pending-confirm">${esc(t.confirmPending)}</button><button class="warn" data-dev-action="pending-decline">${esc(t.declinePending)}</button>`:''}</div></section>`;
  }

  function renderStore(s,t){
    const ackPending=['owned_ack_pending','purchased_unacknowledged','acknowledging'].includes(String(s.status||''));
    return `<section class="ba-dev-card"><span class="ba-dev-eyebrow">STORE CONFIGURATION</span><h3>Sandbox Store</h3><p>${esc(t.testOnly)}</p><div class="ba-dev-fields">
      <div class="ba-dev-field"><label>${esc(t.market)}</label><select data-dev-setting="market">${[['th','Thailand · ฿199'],['us','United States · $5.99'],['jp','Japan · ¥900'],['eu','Eurozone · €5.99'],['br','Brazil · R$ 29,90']].map(x=>opt(x[0],x[1],s.market)).join('')}</select></div>
      <div class="ba-dev-field"><label>${esc(t.network)}</label><select data-dev-setting="network">${[['online',t.online],['slow',t.slow],['offline',t.offline]].map(x=>opt(x[0],x[1],s.networkMode)).join('')}</select></div>
      <div class="ba-dev-field"><label>${esc(t.payment)}</label><select data-dev-setting="payment">${[['approve',t.approve],['pending',t.pending],['decline',t.decline],['chargeback',t.chargebackLater]].map(x=>opt(x[0],x[1],s.paymentBehavior)).join('')}</select></div>
      <div class="ba-dev-field"><label>${esc(t.ack)}</label><select data-dev-setting="ack">${[['success',t.ackOk],['fail_once',t.ackOnce],['fail_always',t.ackAlways]].map(x=>opt(x[0],x[1],s.acknowledgeMode)).join('')}</select></div>
      <div class="ba-dev-field"><label>${esc(t.availability)}</label><select data-dev-setting="availability">${opt('true',t.available,String(s.storeAvailable))+opt('false',t.unavailable,String(s.storeAvailable))}</select></div>
      <div class="ba-dev-field"><label>${esc(t.provider)}</label><select data-dev-setting="provider">${opt('true',t.providerOn,String(s.enabled))+opt('false',t.providerOff,String(s.enabled))}</select></div>
      </div></section>
      ${s.purchasePending?`<section class="ba-dev-card"><span class="ba-dev-eyebrow">PENDING</span><h3>${esc(t.pendingActions)}</h3><div class="ba-dev-actions"><button class="primary" data-dev-action="pending-confirm">${esc(t.confirmPending)}</button><button class="warn" data-dev-action="pending-decline">${esc(t.declinePending)}</button></div></section>`:''}
      <section class="ba-dev-card"><span class="ba-dev-eyebrow">LIFECYCLE</span><h3>${esc(t.ownershipActions)}</h3><div class="ba-dev-actions"><button class="mint" data-dev-action="sync">${esc(t.sync)}</button><button data-dev-action="reinstall">${esc(t.reinstall)}</button><button data-dev-action="clear-local">${esc(t.clearLocal)}</button><button ${ackPending?'':'disabled'} data-dev-action="retry-ack">${esc(t.retryAck)}</button><button ${s.storeOwned?'':'disabled'} data-dev-action="refund-keep">${esc(t.refundKeep)}</button><button ${s.storeOwned?'':'disabled'} class="warn" data-dev-action="refund-revoke">${esc(t.refundRevoke)}</button><button ${s.storeOwned?'':'disabled'} class="danger" data-dev-action="revoke">${esc(t.revoke)}</button><button ${s.storeOwned?'':'disabled'} class="danger" data-dev-action="chargeback">${esc(t.chargeback)}</button><button ${ackPending?'':'disabled'} class="danger" data-dev-action="expire-ack">${esc(t.expireAck)}</button><button class="warn" data-dev-action="reset">${esc(t.reset)}</button><button class="danger" data-dev-action="disable-dev">${esc(t.disable)}</button></div></section>`;
  }

  function renderTransactions(s,t){
    const arr=Array.isArray(s.transactions)?[...s.transactions].reverse():[]; if(!arr.length)return `<div class="ba-dev-empty">${esc(t.noTx)}</div>`;
    return arr.map(tx=>`<article class="ba-dev-tx"><div class="ba-dev-tx__top"><div><strong>${esc(tx.id||'Transaction')}</strong><small> · ${esc(tx.formattedPrice||'')}</small></div>${pill(tx.purchaseState)}</div><p>${esc(`payment=${tx.paymentState||'—'} · acknowledged=${tx.acknowledged?'yes':'no'} · entitlement=${tx.entitlement||'free'} · ${fmtTime(tx.updatedAtMs)}`)}</p></article>`).join('');
  }

  function renderEvents(s,t){
    const arr=Array.isArray(s.events)?[...s.events].reverse():[];return `${arr.length?arr.map(ev=>`<article class="ba-dev-event"><div class="ba-dev-event__top"><strong>${esc(ev.type||'EVENT')}</strong><small>${esc(fmtTime(ev.atMs))}</small></div><p>${esc(ev.message||'')}</p></article>`).join(''):`<div class="ba-dev-empty">${esc(t.noEvents)}</div>`}<div class="ba-dev-actions"><button data-dev-action="clear-events">${esc(t.clearEvents)}</button></div>`;
  }

  const ACTIONS={
    restore:['restoreDebugBillingSandboxPurchase'],sync:['syncDebugBillingSandboxOwnership'],['clear-local']:['forgetDebugBillingSandboxLocalEntitlement'],reinstall:['simulateDebugBillingSandboxReinstall'],['pending-confirm']:['completeDebugBillingSandboxPending'],['pending-decline']:['declineDebugBillingSandboxPending'],['retry-ack']:['retryDebugBillingSandboxAcknowledgement'],['refund-keep']:['refundDebugBillingSandboxKeepAccess'],['refund-revoke']:['refundDebugBillingSandboxAndRevoke'],revoke:['revokeDebugBillingSandbox'],chargeback:['chargebackDebugBillingSandbox'],['expire-ack']:['expireDebugBillingSandboxUnacknowledged'],reset:['resetDebugBillingSandboxPurchase'],['clear-events']:['clearDebugBillingSandboxEvents']
  };
  function handleAction(action){
    if(action==='customer-flow'){closeConsole();window.BearagnosticProUI?.open?.('developer_customer');return;}
    if(action==='disable-dev'){call('setDebugBillingDeveloperMode',false,'bool');closeConsole();ensureRow(state());return;}
    const spec=ACTIONS[action];if(spec)call(spec[0]);
  }
  function handleSetting(key,value){
    if(key==='market')call('setDebugBillingSandboxMarket',value,'string');
    else if(key==='network')call('setDebugBillingSandboxNetwork',value,'string');
    else if(key==='payment')call('setDebugBillingSandboxPaymentBehavior',value,'string');
    else if(key==='ack')call('setDebugBillingSandboxAcknowledgeMode',value,'string');
    else if(key==='availability')call('setDebugBillingSandboxStoreAvailable',value==='true','bool');
    else if(key==='provider')call('setDebugBillingSandboxEnabled',value==='true','bool');
  }

  function refreshAll(){const s=state();if(s.devModeEnabled===true)revealDeveloperTools(s);else ensureRow(s);if(!$('#baDevBillingConsole')?.hidden)renderConsole();window.BearagnosticBilling?.refresh?.();}
  function startPoll(){stopPoll();poll=setInterval(refreshAll,420)} function stopPoll(){if(poll){clearInterval(poll);poll=null}}

  document.addEventListener('click',e=>{
    activateTap(e);
    const close=e.target?.closest?.('[data-dev-close]');if(close){e.preventDefault();closeConsole();return;}
    const tab=e.target?.closest?.('[data-dev-tab]');if(tab){e.preventDefault();activeTab=tab.dataset.devTab;renderConsole();return;}
    const action=e.target?.closest?.('[data-dev-action]');if(action){e.preventDefault();handleAction(action.dataset.devAction);return;}
  },true);
  document.addEventListener('change',e=>{const field=e.target?.closest?.('[data-dev-setting]');if(field)handleSetting(field.dataset.devSetting,field.value)},true);
  window.addEventListener('bearagnostic:languagechange',()=>setTimeout(refreshAll,0));
  window.addEventListener('bearagnostic:screenchange',()=>setTimeout(refreshAll,0));
  window.addEventListener('bearagnostic:entitlementchange',()=>setTimeout(refreshAll,0));
  const observer=new MutationObserver(()=>{const s=state();if(s.available===true)ensureRow(s)});observer.observe(document.body,{childList:true,subtree:true});
  ensureStyle();setTimeout(refreshAll,160);
})();
