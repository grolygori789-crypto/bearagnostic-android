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
  let observerQueued = false;
  let lastBillingState = {};

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
      testTrack:'Real purchase testing requires the product and app build to be available through a Google Play test track.'
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
      testTrack:'การทดสอบซื้อจริงต้องให้สินค้าและ build ของแอปพร้อมใช้งานผ่าน Google Play test track ก่อน'
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
      testTrack:'実際の購入テストには、商品とアプリ build を Google Play test track で利用可能にする必要があります。'
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
    lastBillingState = billing;
    const debugOverride = ent.source === 'debug_override';
    const isPro = ent.isPro === true;
    const playOwned = ent.playOwnershipCached === true || billing.playOwnershipCached === true;
    const status = String(billing.status || ent.billingStatus || 'initializing');
    const price = typeof billing.formattedPrice === 'string' && billing.formattedPrice.trim() ? billing.formattedPrice.trim() : null;
    const signature = JSON.stringify([language(), ent.isPro === true, ent.source || '', ent.playOwnershipCached === true, billing.connected === true, billing.connecting === true, billing.productAvailable === true, billing.canPurchase === true, billing.purchasePending === true, status, price || '']);
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

    if (isPro && debugOverride) {
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
    block.innerHTML = `<strong>${esc(title)}</strong><small>${esc(sub)}</small>${priceHtml}<div class="ba-billing-actions"><button class="ba-pro-primary ba-billing-primary${primaryAction === 'purchase' ? ' is-ready' : ''}" type="button" ${primaryDisabled ? 'disabled' : ''} ${primaryAction ? `data-billing-action="${primaryAction}"` : ''}>${primaryIsHtml ? primary : esc(primary)}</button>${showRestore ? `<button class="ba-billing-secondary" type="button" data-billing-action="restore">${esc(t.restore)}</button>` : ''}</div><small class="ba-billing-note${noteClass}">${esc(note)}</small>`;

    syncPendingPolling();
  }

  function syncPendingPolling() {
    const shouldPoll = lastBillingState?.purchasePending === true && !document.hidden;
    if (shouldPoll && pendingPoll == null) {
      pendingPoll = setInterval(() => {
        try { NATIVE.refreshBilling?.(); } catch (_) {}
        scheduleRefresh(250);
      }, 15000);
    } else if (!shouldPoll && pendingPoll != null) {
      clearInterval(pendingPoll); pendingPoll = null;
    }
  }

  function perform(action) {
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
    }, delay);
  }

  document.addEventListener('click', (event) => {
    const button = event.target?.closest?.('[data-billing-action]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    perform(button.dataset.billingAction);
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
    getState: () => ({...lastBillingState})
  });

  try { NATIVE.refreshBilling?.(); } catch (_) {}
  scheduleRefresh(180);
})();
