(() => {
  'use strict';

  // K3 customer-facing server commerce adapter.
  // This QA build intentionally does not expose the legacy Billing Sandbox /
  // Developer Mode path. Payment truth comes only from Benedict server commerce.
  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const parse = (value, fallback = {}) => {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  };
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (ch) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[ch]));

  let poll = null;
  let lastSignature = '';
  let selectedEmail = '';
  let localMessage = '';
  let localMessageKind = '';

  const language = () => {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
  };

  const COPY = {
    en: {
      activeTitle:'Bearagnostic Pro is active',
      activeSub:'Lifetime access is verified for this installation.',
      activeBadge:'PRO ACTIVE',
      introTitle:'Unlock Bearagnostic Pro',
      introSub:'One-time lifetime upgrade through Benedict Interactive · ฿249 · No subscription.',
      emailLabel:'Email for purchase or restore',
      emailPlaceholder:'you@example.com',
      buy:'Continue to buy · ฿249',
      restore:'Restore Pro',
      sendingTitle:'Sending verification code',
      sendingSub:'Check the inbox for the email you entered.',
      otpTitle:'Verify your email',
      otpSub:'Enter the 6-digit code from Benedict Interactive.',
      otpLabel:'Verification code',
      otpPlaceholder:'6-digit code',
      verify:'Verify code',
      verifyingTitle:'Verifying code',
      verifyingSub:'Confirming this email with Benedict Interactive.',
      openingTitle:'Opening secure checkout',
      openingSub:'Ko-fi will open in your browser. Complete payment there only when we explicitly test a real purchase.',
      waitingTitle:'Waiting for payment confirmation',
      waitingSub:'Bearagnostic will unlock Pro only after Benedict receives a verified Ko-fi Shop Order.',
      offlineTitle:'Pro available from verified offline lease',
      offlineSub:'The last server-confirmed entitlement is still within its offline lease window.',
      errorTitle:'Could not continue',
      retry:'Try again',
      startOver:'Start over',
      refresh:'Check again',
      qaNote:'Controlled QA · Benedict server entitlement · No Bearagnostic password account',
      invalidEmail:'Enter a valid email address.',
      invalidCode:'Enter the 6-digit verification code.',
      networkError:'Could not reach Benedict. Check the connection and try again.',
      wrongCode:'That verification code is incorrect.',
      locked:'Too many incorrect attempts. Start again for a new code.',
      expired:'That verification code expired. Start again for a new code.',
      rateLimited:'Too many verification requests. Wait before requesting another code.',
      noEntitlement:'No active Pro purchase was found for that email.',
      genericError:'Benedict could not complete this step.'
    },
    th: {
      activeTitle:'Bearagnostic Pro เปิดใช้งานแล้ว',
      activeSub:'ยืนยันสิทธิ์ตลอดชีพสำหรับการติดตั้งนี้แล้ว',
      activeBadge:'PRO เปิดใช้งานแล้ว',
      introTitle:'ปลดล็อก Bearagnostic Pro',
      introSub:'อัปเกรดตลอดชีพครั้งเดียวผ่าน Benedict Interactive · ฿249 · ไม่มีรายเดือน',
      emailLabel:'อีเมลสำหรับซื้อหรือกู้คืนสิทธิ์',
      emailPlaceholder:'you@example.com',
      buy:'ดำเนินการซื้อ · ฿249',
      restore:'กู้คืน Pro',
      sendingTitle:'กำลังส่งรหัสยืนยัน',
      sendingSub:'ตรวจกล่องจดหมายของอีเมลที่กรอกไว้',
      otpTitle:'ยืนยันอีเมล',
      otpSub:'กรอกรหัส 6 หลักจาก Benedict Interactive',
      otpLabel:'รหัสยืนยัน',
      otpPlaceholder:'รหัส 6 หลัก',
      verify:'ยืนยันรหัส',
      verifyingTitle:'กำลังตรวจสอบรหัส',
      verifyingSub:'กำลังยืนยันอีเมลกับ Benedict Interactive',
      openingTitle:'กำลังเปิดหน้าชำระเงิน',
      openingSub:'Ko-fi จะเปิดในเบราว์เซอร์ ชำระเงินจริงเมื่อเราเริ่มทดสอบการซื้อจริงอย่างชัดเจนเท่านั้น',
      waitingTitle:'กำลังรอการยืนยันการชำระเงิน',
      waitingSub:'Bearagnostic จะปลดล็อก Pro หลัง Benedict ได้รับ Ko-fi Shop Order ที่ตรวจสอบแล้วเท่านั้น',
      offlineTitle:'Pro ใช้งานได้จากสิทธิ์ออฟไลน์ที่ยืนยันแล้ว',
      offlineSub:'สิทธิ์ล่าสุดที่เซิร์ฟเวอร์ยืนยันยังอยู่ภายในช่วง offline lease',
      errorTitle:'ยังดำเนินการต่อไม่ได้',
      retry:'ลองอีกครั้ง',
      startOver:'เริ่มใหม่',
      refresh:'ตรวจสอบอีกครั้ง',
      qaNote:'Controlled QA · สิทธิ์จาก Benedict server · ไม่ต้องมีรหัสผ่านบัญชี Bearagnostic',
      invalidEmail:'กรุณากรอกอีเมลให้ถูกต้อง',
      invalidCode:'กรุณากรอกรหัสยืนยัน 6 หลัก',
      networkError:'เชื่อมต่อ Benedict ไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองใหม่',
      wrongCode:'รหัสยืนยันไม่ถูกต้อง',
      locked:'กรอกรหัสผิดเกินจำนวนที่กำหนด กรุณาเริ่มใหม่เพื่อขอรหัสใหม่',
      expired:'รหัสยืนยันหมดอายุแล้ว กรุณาเริ่มใหม่เพื่อขอรหัสใหม่',
      rateLimited:'ขอรหัสยืนยันถี่เกินไป กรุณารอก่อนขอใหม่',
      noEntitlement:'ไม่พบสิทธิ์ Pro ที่ยังใช้งานอยู่สำหรับอีเมลนี้',
      genericError:'Benedict ไม่สามารถดำเนินขั้นตอนนี้ได้'
    },
    ja: {
      activeTitle:'Bearagnostic Pro は有効です',
      activeSub:'このインストールの買い切り権利を確認しました。',
      activeBadge:'PRO 有効',
      introTitle:'Bearagnostic Pro を解除',
      introSub:'Benedict Interactive 経由の買い切りアップグレード · ฿249 · サブスクなし',
      emailLabel:'購入または復元に使うメール',
      emailPlaceholder:'you@example.com',
      buy:'購入へ進む · ฿249',
      restore:'Pro を復元',
      sendingTitle:'確認コードを送信中',
      sendingSub:'入力したメールの受信箱を確認してください。',
      otpTitle:'メールを確認',
      otpSub:'Benedict Interactive から届いた6桁コードを入力してください。',
      otpLabel:'確認コード',
      otpPlaceholder:'6桁コード',
      verify:'コードを確認',
      verifyingTitle:'コードを確認中',
      verifyingSub:'Benedict Interactive でメールを確認しています。',
      openingTitle:'安全な購入ページを開いています',
      openingSub:'Ko-fi がブラウザで開きます。実決済テストを明示した時だけ支払いを完了してください。',
      waitingTitle:'支払い確認を待っています',
      waitingSub:'Benedict が検証済み Ko-fi Shop Order を受け取った後にだけ Pro を有効化します。',
      offlineTitle:'確認済みオフライン権利で Pro を利用中',
      offlineSub:'最後に確認したサーバー権利がオフライン lease の期間内です。',
      errorTitle:'続行できません',
      retry:'もう一度試す',
      startOver:'最初からやり直す',
      refresh:'再確認',
      qaNote:'Controlled QA · Benedict server entitlement · Bearagnostic パスワード不要',
      invalidEmail:'有効なメールアドレスを入力してください。',
      invalidCode:'6桁の確認コードを入力してください。',
      networkError:'Benedict に接続できません。接続を確認して再試行してください。',
      wrongCode:'確認コードが正しくありません。',
      locked:'入力回数の上限に達しました。新しいコードでやり直してください。',
      expired:'確認コードの有効期限が切れました。新しいコードでやり直してください。',
      rateLimited:'確認コードのリクエストが多すぎます。しばらく待ってください。',
      noEntitlement:'このメールに有効な Pro 購入が見つかりません。',
      genericError:'Benedict でこの処理を完了できませんでした。'
    }
  };

  const t = () => COPY[language()] || COPY.en;

  function serverState() {
    try { return parse(NATIVE.getServerCommerceState(), { configured:false, phase:'unconfigured' }); }
    catch (_) { return { configured:false, phase:'unconfigured', lastError:'bridge_state_error' }; }
  }

  function entitlementState() {
    try { return parse(NATIVE.getEntitlementState(), {}); }
    catch (_) { return {}; }
  }

  function mapError(code) {
    const text = t();
    switch (String(code || '')) {
      case 'valid_email_required': return text.invalidEmail;
      case 'invalid_verification_code': return text.invalidCode;
      case 'verification_code_incorrect': return text.wrongCode;
      case 'challenge_locked': return text.locked;
      case 'challenge_expired': return text.expired;
      case 'verification_rate_limited': return text.rateLimited;
      case 'active_entitlement_not_found': return text.noEntitlement;
      case 'network_error': return text.networkError;
      default: return code ? `${text.genericError} (${String(code).replaceAll('_',' ')})` : text.genericError;
    }
  }

  function ensureStyle() {
    if ($('#androidBillingStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidBillingStyle';
    style.textContent = `
      .ba-pro-debug,#baBillingSandboxPanel,#baSandboxCheckout,#baDevBillingConsole{display:none!important}
      .ba-pro-purchase[data-server-commerce]{position:relative;overflow:hidden}
      .ba-pro-purchase[data-server-commerce]:before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,rgba(111,94,210,.75),rgba(37,155,221,.68),rgba(54,190,158,.48))}
      .ba-k3-title{display:block!important;color:#273d53!important;font-size:13.5px!important;line-height:1.32!important}
      .ba-k3-sub{display:block!important;margin-top:5px!important;color:#607487!important;font-size:11.5px!important;line-height:1.5!important}
      .ba-k3-field{display:block;margin-top:11px}.ba-k3-field span{display:block;margin:0 0 6px;color:#65798c;font-size:9px;font-weight:780;line-height:1.3}
      .ba-k3-input{width:100%;height:46px;box-sizing:border-box;border-radius:15px;border:1px solid rgba(78,105,133,.14);background:#fff;color:#233a50;padding:0 13px;font:650 12px/1.2 system-ui,-apple-system,sans-serif;outline:none;box-shadow:inset 0 1px 0 rgba(255,255,255,.9)}
      .ba-k3-input:focus{border-color:rgba(78,94,195,.42);box-shadow:0 0 0 3px rgba(100,91,205,.08)}
      .ba-k3-input.ba-k3-otp{text-align:center;letter-spacing:.28em;font-size:17px;font-weight:800;font-variant-numeric:tabular-nums}
      .ba-k3-actions{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin-top:10px}
      .ba-k3-primary,.ba-k3-secondary{min-height:45px;border-radius:15px;padding:8px 12px;font-size:10px;line-height:1.25;font-weight:800}
      .ba-k3-primary{background:linear-gradient(118deg,#7764d5,#258fdc);color:#fff;box-shadow:0 10px 21px rgba(81,78,176,.16)}
      .ba-k3-secondary{background:#f3f7fa;color:#577087;border:1px solid rgba(86,116,145,.09)}
      .ba-k3-primary:disabled,.ba-k3-secondary:disabled{opacity:.5}
      .ba-k3-status{margin-top:9px;padding:9px 10px;border-radius:13px;background:#f3f7fa;color:#5e7488;font-size:9.5px;line-height:1.45}
      .ba-k3-status.is-error{background:#fff2f2;color:#99545a}.ba-k3-status.is-good{background:#eaf8f2;color:#397867}
      .ba-k3-note{display:block!important;margin-top:8px!important;color:#8795a3!important;font-size:8.5px!important;line-height:1.45!important}
      .ba-k3-spinner{display:inline-block;width:11px;height:11px;margin-right:7px;border:1.6px solid rgba(255,255,255,.45);border-top-color:#fff;border-radius:50%;vertical-align:-1px;animation:baK3Spin .8s linear infinite}
      @keyframes baK3Spin{to{transform:rotate(360deg)}}
      @media(max-width:360px){.ba-k3-actions{grid-template-columns:1fr}.ba-k3-secondary{width:100%}}
      @media(prefers-reduced-motion:reduce){.ba-k3-spinner{animation:none}}
    `;
    document.head.appendChild(style);
  }

  function actionResult(raw) {
    const result = parse(raw, {});
    if (result?.accepted === true) {
      localMessage = '';
      localMessageKind = '';
      return true;
    }
    localMessage = mapError(result?.reason || 'request_rejected');
    localMessageKind = 'error';
    lastSignature = '';
    render(true);
    return false;
  }

  function inputEmail() {
    return String($('[data-k3-email]')?.value || selectedEmail || '').trim().toLowerCase();
  }

  function inputCode() {
    return String($('[data-k3-code]')?.value || '').replace(/\D/g,'').slice(0,6);
  }

  function emailIsValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
  }

  function setBlock(html, signature) {
    const block = $('.ba-pro-purchase');
    if (!block) return false;
    block.dataset.serverCommerce = '1';
    block.dataset.billingSignature = '';
    block.innerHTML = html;
    block.dataset.k3Signature = signature;
    return true;
  }

  function render(force = false) {
    ensureStyle();
    const block = $('.ba-pro-purchase');
    if (!block) return;

    const state = serverState();
    const ent = entitlementState();
    const text = t();
    const phase = String(state.phase || 'unconfigured');
    const error = String(state.lastError || '');
    const isPro = ent.isPro === true;
    const source = String(ent.source || '');
    const signature = JSON.stringify([
      language(), state.configured === true, phase, state.purpose || '',
      error, state.hasPendingSession === true, state.hasLocalServerLease === true,
      isPro, source, localMessage, localMessageKind
    ]);

    if (!force && signature === lastSignature && block.dataset.k3Signature === signature) return;
    lastSignature = signature;

    let html = '';

    if (isPro && (source === 'benedict_server' || state.hasLocalServerLease === true)) {
      const offline = phase === 'offline_cached';
      html = `<strong class="ba-k3-title">${esc(offline ? text.offlineTitle : text.activeTitle)}</strong>` +
        `<small class="ba-k3-sub">${esc(offline ? text.offlineSub : text.activeSub)}</small>` +
        `<div class="ba-k3-status is-good">${esc(text.activeBadge)}</div>` +
        `<small class="ba-k3-note">${esc(text.qaNote)}</small>`;
      setBlock(html, signature); return;
    }

    if (isPro) {
      html = `<strong class="ba-k3-title">${esc(text.activeTitle)}</strong>` +
        `<small class="ba-k3-sub">${esc(text.activeSub)}</small>` +
        `<div class="ba-k3-status is-good">${esc(text.activeBadge)}</div>`;
      setBlock(html, signature); return;
    }

    if (state.configured !== true || phase === 'unconfigured') {
      html = `<strong class="ba-k3-title">${esc(text.errorTitle)}</strong>` +
        `<small class="ba-k3-sub">${esc(mapError(error || 'server_commerce_unconfigured'))}</small>` +
        `<div class="ba-k3-actions"><button class="ba-k3-primary" type="button" data-k3-action="refresh">${esc(text.refresh)}</button></div>`;
      setBlock(html, signature); return;
    }

    if (phase === 'ready') {
      html = `<strong class="ba-k3-title">${esc(text.introTitle)}</strong>` +
        `<small class="ba-k3-sub">${esc(text.introSub)}</small>` +
        `<label class="ba-k3-field"><span>${esc(text.emailLabel)}</span><input class="ba-k3-input" data-k3-email type="email" inputmode="email" autocomplete="email" autocapitalize="none" spellcheck="false" maxlength="254" placeholder="${esc(text.emailPlaceholder)}" value="${esc(selectedEmail)}"></label>` +
        `<div class="ba-k3-actions"><button class="ba-k3-primary" type="button" data-k3-action="purchase">${esc(text.buy)}</button><button class="ba-k3-secondary" type="button" data-k3-action="restore">${esc(text.restore)}</button></div>` +
        (localMessage ? `<div class="ba-k3-status ${localMessageKind === 'error' ? 'is-error' : ''}">${esc(localMessage)}</div>` : '') +
        `<small class="ba-k3-note">${esc(text.qaNote)}</small>`;
      setBlock(html, signature); return;
    }

    if (phase === 'sending_code') {
      html = `<strong class="ba-k3-title">${esc(text.sendingTitle)}</strong><small class="ba-k3-sub">${esc(text.sendingSub)}</small>` +
        `<div class="ba-k3-actions"><button class="ba-k3-primary" type="button" disabled><span class="ba-k3-spinner"></span>${esc(text.sendingTitle)}</button></div>`;
      setBlock(html, signature); return;
    }

    const otpRetryable = phase === 'otp_required' ||
      (phase === 'error' && ['verification_code_incorrect','network_error'].includes(error));

    if (otpRetryable) {
      const errorHtml = phase === 'error' ? `<div class="ba-k3-status is-error">${esc(mapError(error))}</div>` : '';
      html = `<strong class="ba-k3-title">${esc(text.otpTitle)}</strong>` +
        `<small class="ba-k3-sub">${esc(text.otpSub)}</small>` +
        `<label class="ba-k3-field"><span>${esc(text.otpLabel)}</span><input class="ba-k3-input ba-k3-otp" data-k3-code type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="${esc(text.otpPlaceholder)}"></label>` +
        errorHtml +
        `<div class="ba-k3-actions"><button class="ba-k3-primary" type="button" data-k3-action="verify">${esc(text.verify)}</button><button class="ba-k3-secondary" type="button" data-k3-action="reset">${esc(text.startOver)}</button></div>` +
        `<small class="ba-k3-note">${esc(text.qaNote)}</small>`;
      setBlock(html, signature);
      setTimeout(() => $('[data-k3-code]')?.focus(), 50);
      return;
    }

    if (phase === 'verifying_code') {
      html = `<strong class="ba-k3-title">${esc(text.verifyingTitle)}</strong><small class="ba-k3-sub">${esc(text.verifyingSub)}</small>` +
        `<div class="ba-k3-actions"><button class="ba-k3-primary" type="button" disabled><span class="ba-k3-spinner"></span>${esc(text.verifyingTitle)}</button></div>`;
      setBlock(html, signature); return;
    }

    if (phase === 'opening_kofi') {
      html = `<strong class="ba-k3-title">${esc(text.openingTitle)}</strong><small class="ba-k3-sub">${esc(text.openingSub)}</small>` +
        `<div class="ba-k3-actions"><button class="ba-k3-primary" type="button" disabled><span class="ba-k3-spinner"></span>${esc(text.openingTitle)}</button></div>` +
        `<small class="ba-k3-note">${esc(text.qaNote)}</small>`;
      setBlock(html, signature); return;
    }

    if (phase === 'waiting_payment') {
      html = `<strong class="ba-k3-title">${esc(text.waitingTitle)}</strong><small class="ba-k3-sub">${esc(text.waitingSub)}</small>` +
        (error ? `<div class="ba-k3-status is-error">${esc(mapError(error))}</div>` : '') +
        `<div class="ba-k3-actions"><button class="ba-k3-primary" type="button" data-k3-action="refresh">${esc(text.refresh)}</button><button class="ba-k3-secondary" type="button" data-k3-action="reset">${esc(text.startOver)}</button></div>` +
        `<small class="ba-k3-note">${esc(text.qaNote)}</small>`;
      setBlock(html, signature); return;
    }

    if (phase === 'active' || phase === 'offline_cached') {
      html = `<strong class="ba-k3-title">${esc(phase === 'offline_cached' ? text.offlineTitle : text.activeTitle)}</strong>` +
        `<small class="ba-k3-sub">${esc(phase === 'offline_cached' ? text.offlineSub : text.activeSub)}</small>` +
        `<div class="ba-k3-status is-good">${esc(text.activeBadge)}</div>`;
      setBlock(html, signature); return;
    }

    html = `<strong class="ba-k3-title">${esc(text.errorTitle)}</strong>` +
      `<small class="ba-k3-sub">${esc(mapError(error))}</small>` +
      `<div class="ba-k3-actions"><button class="ba-k3-primary" type="button" data-k3-action="reset">${esc(text.startOver)}</button><button class="ba-k3-secondary" type="button" data-k3-action="refresh">${esc(text.refresh)}</button></div>` +
      `<small class="ba-k3-note">${esc(text.qaNote)}</small>`;
    setBlock(html, signature);
  }

  function handleAction(action) {
    localMessage = '';
    localMessageKind = '';

    try {
      if (action === 'purchase' || action === 'restore') {
        const email = inputEmail();
        selectedEmail = email;
        if (!emailIsValid(email)) {
          localMessage = t().invalidEmail;
          localMessageKind = 'error';
          lastSignature = '';
          render(true);
          return;
        }
        const raw = action === 'purchase'
          ? NATIVE.startKoFiPurchase(email)
          : NATIVE.startKoFiRestore(email);
        actionResult(raw);
      } else if (action === 'verify') {
        const code = inputCode();
        if (!/^\d{6}$/.test(code)) {
          localMessage = t().invalidCode;
          localMessageKind = 'error';
          lastSignature = '';
          render(true);
          return;
        }
        actionResult(NATIVE.verifyKoFiCode(code));
      } else if (action === 'refresh') {
        actionResult(NATIVE.refreshServerEntitlement());
      } else if (action === 'reset') {
        actionResult(NATIVE.resetServerCommerce());
      }
    } catch (_) {
      localMessage = t().networkError;
      localMessageKind = 'error';
      lastSignature = '';
      render(true);
      return;
    }

    lastSignature = '';
    render(true);
    [120, 350, 800].forEach((delay) => setTimeout(() => render(true), delay));
  }

  document.addEventListener('click', (event) => {
    const button = event.target?.closest?.('[data-k3-action]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    handleAction(String(button.dataset.k3Action || ''));
  }, true);

  document.addEventListener('input', (event) => {
    const input = event.target;
    if (input?.matches?.('[data-k3-email]')) selectedEmail = String(input.value || '').trim().toLowerCase();
    if (input?.matches?.('[data-k3-code]')) {
      const clean = String(input.value || '').replace(/\D/g,'').slice(0,6);
      if (input.value !== clean) input.value = clean;
    }
  }, true);

  function tick() {
    if (document.hidden) return;
    render(false);
  }

  function start() {
    ensureStyle();
    render(true);
    if (poll == null) poll = setInterval(tick, 900);
    try { NATIVE.refreshServerEntitlement(); } catch (_) {}
    [80, 250, 700, 1400].forEach((delay) => setTimeout(() => render(true), delay));
  }

  window.BearagnosticServerCommerce = Object.freeze({
    refresh() { try { NATIVE.refreshServerEntitlement(); } catch (_) {} lastSignature=''; render(true); },
    state: serverState
  });

  window.addEventListener('bearagnostic:languagechange', () => { lastSignature=''; render(true); });
  window.addEventListener('bearagnostic:screenchange', () => setTimeout(() => render(true), 0));
  window.addEventListener('bearagnostic:entitlementchange', () => setTimeout(() => render(true), 0));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      try { NATIVE.refreshServerEntitlement(); } catch (_) {}
      lastSignature='';
      render(true);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once:true });
  } else {
    start();
  }
})();
