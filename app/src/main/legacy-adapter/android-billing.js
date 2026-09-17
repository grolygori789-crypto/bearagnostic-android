(() => {
  'use strict';

  /*
   * Production Benedict commerce adapter.
   *
   * It is intentionally dormant at app startup. It activates only after the
   * existing Pro sheet is opened through bearagnostic:prorequest.
   *
   * Debug entitlement controls reuse the existing Pro surface and are shown
   * only when the native entitlement layer reports debugControlsAvailable.
   * Release builds report that flag as false and reject debug entitlement calls.
   */
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

  const COPY = {
    en: {
      title:'Unlock Bearagnostic Pro',
      sub:'One-time lifetime upgrade through Benedict Interactive · ฿249 · No subscription.',
      email:'Email for purchase or restore',
      emailPlaceholder:'you@example.com',
      buy:'Continue to buy · ฿249',
      restore:'Restore Pro',
      sending:'Sending verification code…',
      otp:'Verify your email',
      otpSub:'Enter the 6-digit code from Benedict Interactive.',
      verify:'Verify code',
      verifying:'Verifying code…',
      waiting:'Waiting for payment confirmation',
      waitingSub:'Bearagnostic unlocks Pro only after Benedict confirms a verified Ko-fi Shop Order.',
      active:'Bearagnostic Pro is active',
      activeSub:'Lifetime access is verified for this installation.',
      retry:'Check again',
      reset:'Start over',
      invalidEmail:'Enter a valid email address.',
      invalidCode:'Enter the 6-digit verification code.',
      noEntitlement:'No active Pro purchase was found for that email.',
      generic:'Benedict could not complete this step.',
      debugTitle:'DEVELOPMENT ENTITLEMENT TEST',
      debugBody:'Debug build only. This control never appears in a release build.',
      debugFree:'Test as FREE',
      debugPro:'Test as PRO',
      debugReset:'Reset'
    },
    th: {
      title:'ปลดล็อก Bearagnostic Pro',
      sub:'อัปเกรดตลอดชีพครั้งเดียวผ่าน Benedict Interactive · ฿249 · ไม่มีรายเดือน',
      email:'อีเมลสำหรับซื้อหรือกู้คืนสิทธิ์',
      emailPlaceholder:'you@example.com',
      buy:'ดำเนินการซื้อ · ฿249',
      restore:'กู้คืน Pro',
      sending:'กำลังส่งรหัสยืนยัน…',
      otp:'ยืนยันอีเมล',
      otpSub:'กรอกรหัส 6 หลักจาก Benedict Interactive',
      verify:'ยืนยันรหัส',
      verifying:'กำลังตรวจสอบรหัส…',
      waiting:'กำลังรอการยืนยันการชำระเงิน',
      waitingSub:'Bearagnostic จะปลดล็อก Pro หลัง Benedict ยืนยัน Ko-fi Shop Order ที่ตรวจสอบแล้วเท่านั้น',
      active:'Bearagnostic Pro เปิดใช้งานแล้ว',
      activeSub:'ยืนยันสิทธิ์ตลอดชีพสำหรับการติดตั้งนี้แล้ว',
      retry:'ตรวจสอบอีกครั้ง',
      reset:'เริ่มใหม่',
      invalidEmail:'กรุณากรอกอีเมลให้ถูกต้อง',
      invalidCode:'กรุณากรอกรหัสยืนยัน 6 หลัก',
      noEntitlement:'ไม่พบสิทธิ์ Pro ที่ยังใช้งานอยู่สำหรับอีเมลนี้',
      generic:'Benedict ไม่สามารถดำเนินขั้นตอนนี้ได้',
      debugTitle:'ทดสอบสิทธิ์สำหรับ DEVELOPMENT',
      debugBody:'มีเฉพาะ Debug build เท่านั้น Release build จะไม่มีตัวควบคุมนี้',
      debugFree:'ทดสอบแบบ FREE',
      debugPro:'ทดสอบแบบ PRO',
      debugReset:'รีเซ็ต'
    },
    ja: {
      title:'Bearagnostic Pro を解除',
      sub:'Benedict Interactive 経由の買い切りアップグレード · ฿249 · サブスクなし',
      email:'購入または復元に使うメール',
      emailPlaceholder:'you@example.com',
      buy:'購入へ進む · ฿249',
      restore:'Pro を復元',
      sending:'確認コードを送信中…',
      otp:'メールを確認',
      otpSub:'Benedict Interactive から届いた6桁コードを入力してください。',
      verify:'コードを確認',
      verifying:'コードを確認中…',
      waiting:'支払い確認を待っています',
      waitingSub:'Benedict が検証済み Ko-fi Shop Order を確認した後にだけ Pro を有効化します。',
      active:'Bearagnostic Pro は有効です',
      activeSub:'このインストールの買い切り権利を確認しました。',
      retry:'再確認',
      reset:'最初から',
      invalidEmail:'有効なメールアドレスを入力してください。',
      invalidCode:'6桁の確認コードを入力してください。',
      noEntitlement:'このメールに有効な Pro 購入が見つかりません。',
      generic:'Benedict でこの処理を完了できませんでした',
      debugTitle:'DEVELOPMENT 権限テスト',
      debugBody:'Debug build 専用です。Release build には表示されません。',
      debugFree:'FREE としてテスト',
      debugPro:'PRO としてテスト',
      debugReset:'リセット'
    }
  };

  let active = false;
  let timer = null;
  let selectedEmail = '';
  let localError = '';
  let lastSignature = '';

  const language = () => {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
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

  function overlayOpen() {
    const overlay = $('#bearagnosticProOverlay');
    return !!overlay && overlay.hidden !== true;
  }

  function purchaseBlock() {
    return overlayOpen() ? $('#bearagnosticProOverlay .ba-pro-purchase') : null;
  }

  function ensureStyle() {
    if ($('#androidServerCommerceStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidServerCommerceStyle';
    style.textContent = `
      #bearagnosticProOverlay .ba-k3-input{width:100%;height:44px;box-sizing:border-box;margin-top:9px;padding:0 12px;border-radius:14px;border:1px solid rgba(91,119,147,.14);background:#fff;color:#233a52;font:650 11px/1.2 system-ui,-apple-system,sans-serif;outline:none}
      #bearagnosticProOverlay .ba-k3-input:focus{border-color:rgba(96,86,190,.38);box-shadow:0 0 0 3px rgba(96,86,190,.07)}
      #bearagnosticProOverlay .ba-k3-actions{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;margin-top:8px}
      #bearagnosticProOverlay .ba-k3-actions .ba-pro-primary{margin-top:0}
      #bearagnosticProOverlay .ba-k3-secondary{min-height:45px;padding:0 11px;border-radius:16px;background:#f3f7fa;border:1px solid rgba(91,119,147,.09);color:#65798c;font-size:9px;font-weight:780}
      #bearagnosticProOverlay .ba-k3-error{display:block;margin-top:7px;color:#a5535b!important}
      @media(max-width:360px){#bearagnosticProOverlay .ba-k3-actions{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function mapError(code) {
    const text = t();
    const value = String(code || '');
    if (value === 'valid_email_required') return text.invalidEmail;
    if (value === 'invalid_verification_code' || value === 'verification_code_incorrect') return text.invalidCode;
    if (value === 'active_entitlement_not_found') return text.noEntitlement;
    return value ? `${text.generic} (${value.replaceAll('_',' ')})` : text.generic;
  }

  function setHtml(block, html, signature) {
    block.innerHTML = html;
    block.dataset.k3Signature = signature;
  }

  function refreshEntitlementFacade() {
    try { window.BearagnosticEntitlement?.refresh?.(); } catch (_) {}
  }

  function ensureDebugControls(ent) {
    const overlay = $('#bearagnosticProOverlay');
    if (!overlay) return;

    const owned = overlay.querySelector?.('[data-k3-debug-block]');
    const builtIn = Array.from(overlay.querySelectorAll?.('.ba-pro-debug') || [])
      .find((node) => !node.hasAttribute?.('data-k3-debug-block'));
    const available = ent?.debugControlsAvailable === true &&
      typeof NATIVE.setDebugEntitlement === 'function' &&
      typeof NATIVE.clearDebugEntitlement === 'function';

    if (!available || builtIn) {
      owned?.remove?.();
      return;
    }

    const purchase = purchaseBlock();
    if (!purchase) return;

    const text = t();
    let debug = owned;
    if (!debug) {
      debug = document.createElement('section');
      debug.className = 'ba-pro-debug';
      debug.setAttribute('data-k3-debug-block', 'true');
      purchase.insertAdjacentElement('afterend', debug);
    }

    const isPro = ent?.isPro === true;
    const signature = `${language()}|${isPro ? 'pro' : 'free'}|${ent?.source || ''}`;
    if (debug.dataset.k3DebugSignature === signature) return;
    debug.dataset.k3DebugSignature = signature;
    debug.innerHTML =
      `<div class="ba-pro-debug__head"><strong>${esc(text.debugTitle)}</strong><small>${esc(text.debugBody)}</small></div>` +
      `<div class="ba-pro-debug__actions">` +
      `<button type="button" data-k3-debug-tier="free" class="${!isPro ? 'is-active' : ''}">${esc(text.debugFree)}</button>` +
      `<button type="button" data-k3-debug-tier="pro" class="${isPro ? 'is-active' : ''}">${esc(text.debugPro)}</button>` +
      `<button type="button" data-k3-debug-reset>${esc(text.debugReset)}</button>` +
      `</div>`;
  }

  function handleDebugAction(target) {
    try {
      // The frozen Pro UI already owns data-debug-tier/data-debug-reset.
      // Commerce may inject its own data-k3-* controls only as a fallback.
      // Handle BOTH contracts here at capture phase so toggling remains reliable
      // even when the Pro sheet is re-rendered between entitlement changes.
      const tierButton = target?.closest?.('[data-k3-debug-tier],[data-debug-tier]');
      const resetButton = target?.closest?.('[data-k3-debug-reset],[data-debug-reset]');
      if (!tierButton && !resetButton) return false;

      const requestedTier = tierButton
        ? String(tierButton.dataset.k3DebugTier || tierButton.dataset.debugTier || '')
        : '';

      const raw = tierButton
        ? NATIVE.setDebugEntitlement(requestedTier)
        : NATIVE.clearDebugEntitlement();
      const result = parse(raw, { accepted:false });
      if (result?.accepted !== true) return true;

      localError = '';
      lastSignature = '';
      refreshEntitlementFacade();
      setTimeout(() => render(true), 0);
      return true;
    } catch (_) {
      return true;
    }
  }

  function render(force = false) {
    if (!active) return;
    const block = purchaseBlock();
    if (!block) {
      stopTimer();
      active = false;
      return;
    }

    ensureStyle();

    const state = serverState();
    const ent = entitlementState();
    const text = t();
    const phase = String(state.phase || 'unconfigured');
    const error = localError || String(state.lastError || '');
    const isPro = ent.isPro === true;
    ensureDebugControls(ent);
    const focused = document.activeElement;
    const editingEmail =
      !isPro && (phase === 'ready' || phase === 'error') &&
      focused?.matches?.('[data-k3-email]');
    const editingCode =
      !isPro && phase === 'otp_required' &&
      focused?.matches?.('[data-k3-code]');

    // Never replace an active text field while the user is typing.
    // Replacing innerHTML destroys focus in Android WebView and closes the keyboard.
    if (editingEmail || editingCode) return;

    const signature = JSON.stringify([
      language(), phase, isPro, ent.source || '', error,
      state.hasPendingSession === true, state.hasLocalServerLease === true
    ]);

    if (!force && signature === lastSignature && block.dataset.k3Signature === signature) return;
    lastSignature = signature;

    if (isPro) {
      setHtml(
        block,
        `<strong>${esc(text.active)}</strong><small>${esc(text.activeSub)}</small>` +
          `<button class="ba-pro-primary" type="button" disabled>PRO ✓</button>`,
        signature
      );
      refreshEntitlementFacade();
      return;
    }

    if (state.configured !== true || phase === 'unconfigured') {
      setHtml(
        block,
        `<strong>${esc(text.generic)}</strong><small>${esc(mapError(error || 'server_commerce_unconfigured'))}</small>` +
          `<button class="ba-pro-primary" type="button" data-k3-action="refresh">${esc(text.retry)}</button>`,
        signature
      );
      return;
    }

    if (phase === 'ready' || phase === 'error') {
      setHtml(
        block,
        `<strong>${esc(text.title)}</strong><small>${esc(text.sub)}</small>` +
          `<input class="ba-k3-input" data-k3-email type="email" inputmode="email" autocomplete="email" autocapitalize="none" spellcheck="false" maxlength="254" placeholder="${esc(text.emailPlaceholder)}" value="${esc(selectedEmail)}">` +
          (error ? `<small class="ba-k3-error">${esc(mapError(error))}</small>` : '') +
          `<div class="ba-k3-actions"><button class="ba-pro-primary" type="button" data-k3-action="purchase">${esc(text.buy)}</button>` +
          `<button class="ba-k3-secondary" type="button" data-k3-action="restore">${esc(text.restore)}</button></div>`,
        signature
      );
      return;
    }

    if (phase === 'sending_code') {
      setHtml(block, `<strong>${esc(text.sending)}</strong><small>${esc(text.email)}</small>`, signature);
      return;
    }

    if (phase === 'otp_required' || phase === 'verifying_code') {
      const disabled = phase === 'verifying_code' ? ' disabled' : '';
      setHtml(
        block,
        `<strong>${esc(phase === 'verifying_code' ? text.verifying : text.otp)}</strong>` +
          `<small>${esc(text.otpSub)}</small>` +
          `<input class="ba-k3-input" data-k3-code type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="••••••"${disabled}>` +
          `<div class="ba-k3-actions"><button class="ba-pro-primary" type="button" data-k3-action="verify"${disabled}>${esc(text.verify)}</button>` +
          `<button class="ba-k3-secondary" type="button" data-k3-action="reset">${esc(text.reset)}</button></div>`,
        signature
      );
      return;
    }

    if (phase === 'opening_kofi' || phase === 'waiting_payment') {
      setHtml(
        block,
        `<strong>${esc(text.waiting)}</strong><small>${esc(text.waitingSub)}</small>` +
          (error ? `<small class="ba-k3-error">${esc(mapError(error))}</small>` : '') +
          `<div class="ba-k3-actions"><button class="ba-pro-primary" type="button" data-k3-action="refresh">${esc(text.retry)}</button>` +
          `<button class="ba-k3-secondary" type="button" data-k3-action="reset">${esc(text.reset)}</button></div>`,
        signature
      );
      return;
    }

    if (phase === 'active' || phase === 'offline_cached') {
      setHtml(
        block,
        `<strong>${esc(text.active)}</strong><small>${esc(text.activeSub)}</small>` +
          `<button class="ba-pro-primary" type="button" disabled>PRO ✓</button>`,
        signature
      );
      refreshEntitlementFacade();
      return;
    }

    setHtml(
      block,
      `<strong>${esc(text.generic)}</strong><small>${esc(mapError(error))}</small>` +
        `<button class="ba-pro-primary" type="button" data-k3-action="reset">${esc(text.reset)}</button>`,
      signature
    );
  }

  function actionResult(raw) {
    const result = parse(raw, {});
    if (result?.accepted === true) {
      localError = '';
      lastSignature = '';
      render(true);
      [100, 300, 750].forEach((delay) => setTimeout(() => render(true), delay));
      return;
    }
    localError = String(result?.reason || 'request_rejected');
    lastSignature = '';
    render(true);
  }

  function handleAction(action) {
    try {
      if (action === 'purchase' || action === 'restore') {
        const email = String($('[data-k3-email]')?.value || selectedEmail || '').trim().toLowerCase();
        selectedEmail = email;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
          localError = 'valid_email_required';
          render(true);
          return;
        }
        actionResult(action === 'purchase'
          ? NATIVE.startKoFiPurchase(email)
          : NATIVE.startKoFiRestore(email));
      } else if (action === 'verify') {
        const code = String($('[data-k3-code]')?.value || '').replace(/\D/g, '').slice(0, 6);
        if (!/^\d{6}$/.test(code)) {
          localError = 'invalid_verification_code';
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
      localError = 'network_error';
      render(true);
    }
  }

  function startTimer() {
    if (timer != null) return;
    timer = setInterval(() => {
      if (!overlayOpen()) {
        stopTimer();
        active = false;
        return;
      }
      render(false);
    }, 1200);
  }

  function stopTimer() {
    if (timer != null) clearInterval(timer);
    timer = null;
  }

  function activate() {
    active = true;
    localError = '';
    lastSignature = '';
    try { NATIVE.refreshServerEntitlement(); } catch (_) {}
    render(true);
    startTimer();
  }

  document.addEventListener('click', (event) => {
    if (!active) return;

    if (handleDebugAction(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const button = event.target?.closest?.('[data-k3-action]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    handleAction(String(button.dataset.k3Action || ''));
  }, true);

  document.addEventListener('input', (event) => {
    if (!active) return;
    const input = event.target;
    if (input?.matches?.('[data-k3-email]')) {
      selectedEmail = String(input.value || '').trim().toLowerCase();
    }
    if (input?.matches?.('[data-k3-code]')) {
      const clean = String(input.value || '').replace(/\D/g, '').slice(0, 6);
      if (input.value !== clean) input.value = clean;
    }
  }, true);

  // The production commerce UI is activated only by the existing user-driven Pro request.
  window.addEventListener('bearagnostic:prorequest', () => setTimeout(activate, 0));

  window.addEventListener('bearagnostic:entitlementchange', () => {
    if (active) setTimeout(() => render(true), 0);
  });

  window.addEventListener('bearagnostic:languagechange', () => {
    if (active) {
      lastSignature = '';
      setTimeout(() => render(true), 0);
    }
  });

  window.addEventListener('focus', () => {
    if (!active || !overlayOpen()) return;
    try { NATIVE.refreshServerEntitlement(); } catch (_) {}
    setTimeout(() => render(true), 80);
  });

  document.addEventListener('visibilitychange', () => {
    if (!active || document.hidden || !overlayOpen()) return;
    try { NATIVE.refreshServerEntitlement(); } catch (_) {}
    setTimeout(() => render(true), 80);
  });
})();
