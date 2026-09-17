(() => {
  'use strict';

  // Release-safe customer commerce + debug-only QA adapter.
  //
  // IMPORTANT:
  // - no startup purchase call;
  // - no startup polling loop;
  // - no MutationObserver;
  // - customer commerce activates only after the existing Pro sheet is opened;
  // - QA controls render only when native getCommerceQaState() reports available=true.

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
      buy:'Continue to buy · ฿249',
      restore:'Restore Pro',
      sending:'Sending verification code…',
      otp:'Enter the 6-digit code from Benedict Interactive',
      verify:'Verify code',
      waiting:'Waiting for verified Ko-fi payment confirmation…',
      active:'Bearagnostic Pro is active',
      activeSub:'Lifetime access is verified for this installation.',
      retry:'Check again',
      reset:'Start over',
      invalidEmail:'Enter a valid email address.',
      invalidCode:'Enter the 6-digit verification code.',
      generic:'Benedict could not complete this step.',
      qa:'Developer QA',
      qaSuccess:'Success',
      qaPending:'Pending',
      qaFailed:'Failed',
      qaRestore:'Restore',
      qaRevoke:'Revoke',
      qaReset:'Reset'
    },
    th: {
      title:'ปลดล็อก Bearagnostic Pro',
      sub:'อัปเกรดตลอดชีพครั้งเดียวผ่าน Benedict Interactive · ฿249 · ไม่มีรายเดือน',
      email:'อีเมลสำหรับซื้อหรือกู้คืนสิทธิ์',
      buy:'ดำเนินการซื้อ · ฿249',
      restore:'กู้คืน Pro',
      sending:'กำลังส่งรหัสยืนยัน…',
      otp:'กรอกรหัส 6 หลักจาก Benedict Interactive',
      verify:'ยืนยันรหัส',
      waiting:'กำลังรอการยืนยันการชำระเงินจาก Ko-fi…',
      active:'Bearagnostic Pro เปิดใช้งานแล้ว',
      activeSub:'ยืนยันสิทธิ์ตลอดชีพสำหรับการติดตั้งนี้แล้ว',
      retry:'ตรวจสอบอีกครั้ง',
      reset:'เริ่มใหม่',
      invalidEmail:'กรุณากรอกอีเมลให้ถูกต้อง',
      invalidCode:'กรุณากรอกรหัสยืนยัน 6 หลัก',
      generic:'Benedict ไม่สามารถดำเนินขั้นตอนนี้ได้',
      qa:'Developer QA',
      qaSuccess:'สำเร็จ',
      qaPending:'รอดำเนินการ',
      qaFailed:'ล้มเหลว',
      qaRestore:'กู้คืน',
      qaRevoke:'เพิกถอน',
      qaReset:'รีเซ็ต'
    },
    ja: {
      title:'Bearagnostic Pro を解除',
      sub:'Benedict Interactive 経由の買い切りアップグレード · ฿249 · サブスクなし',
      email:'購入または復元に使うメール',
      buy:'購入へ進む · ฿249',
      restore:'Pro を復元',
      sending:'確認コードを送信中…',
      otp:'Benedict Interactive から届いた6桁コードを入力',
      verify:'コードを確認',
      waiting:'Ko-fi の検証済み支払い確認を待っています…',
      active:'Bearagnostic Pro は有効です',
      activeSub:'このインストールの買い切り権利を確認しました。',
      retry:'再確認',
      reset:'最初から',
      invalidEmail:'有効なメールアドレスを入力してください。',
      invalidCode:'6桁の確認コードを入力してください。',
      generic:'Benedict でこの処理を完了できませんでした',
      qa:'Developer QA',
      qaSuccess:'成功',
      qaPending:'保留',
      qaFailed:'失敗',
      qaRestore:'復元',
      qaRevoke:'取消',
      qaReset:'リセット'
    }
  };

  let active = false;
  let timer = null;
  let selectedEmail = '';
  let localError = '';
  let qaMessage = '';
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

  function qaState() {
    try { return parse(NATIVE.getCommerceQaState?.(), { available:false }); }
    catch (_) { return { available:false }; }
  }

  function overlayOpen() {
    const overlay = $('#bearagnosticProOverlay');
    return !!overlay && overlay.hidden !== true;
  }

  function purchaseBlock() {
    return overlayOpen() ? $('#bearagnosticProOverlay .ba-pro-purchase') : null;
  }

  function ensureStyle() {
    if ($('#androidReleaseSafeCommerceStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidReleaseSafeCommerceStyle';
    style.textContent = `
      #bearagnosticProOverlay .ba-k3-input{width:100%;height:44px;box-sizing:border-box;margin-top:9px;padding:0 12px;border-radius:14px;border:1px solid rgba(91,119,147,.14);background:#fff;color:#233a52;font:650 11px/1.2 system-ui,-apple-system,sans-serif;outline:none}
      #bearagnosticProOverlay .ba-k3-input:focus{border-color:rgba(96,86,190,.38);box-shadow:0 0 0 3px rgba(96,86,190,.07)}
      #bearagnosticProOverlay .ba-k3-actions{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;margin-top:8px}
      #bearagnosticProOverlay .ba-k3-actions .ba-pro-primary{margin-top:0}
      #bearagnosticProOverlay .ba-k3-secondary{min-height:45px;padding:0 11px;border-radius:16px;background:#f3f7fa;border:1px solid rgba(91,119,147,.09);color:#65798c;font-size:9px;font-weight:780}
      #bearagnosticProOverlay .ba-k3-error{display:block;margin-top:7px;color:#a5535b!important}
      #bearagnosticProOverlay .ba-k3-qa{margin-top:9px;padding:9px;border:1px dashed rgba(102,91,176,.18);border-radius:14px;background:rgba(246,244,255,.72)}
      #bearagnosticProOverlay .ba-k3-qa strong{font-size:8px;color:#655dbd}
      #bearagnosticProOverlay .ba-k3-qa-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:7px}
      #bearagnosticProOverlay .ba-k3-qa button{min-height:33px;border-radius:10px;background:#fff;border:1px solid rgba(102,91,176,.09);color:#5d5a85;font-size:7.5px;font-weight:760}
      #bearagnosticProOverlay .ba-k3-qa small{margin-top:6px!important}
      @media(max-width:360px){#bearagnosticProOverlay .ba-k3-actions{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function mapError(code) {
    const text = t();
    const value = String(code || '');
    if (value === 'valid_email_required') return text.invalidEmail;
    if (value === 'invalid_verification_code' || value === 'verification_code_incorrect') return text.invalidCode;
    return value ? `${text.generic} (${value.replaceAll('_',' ')})` : text.generic;
  }

  function qaHtml() {
    if (qaState().available !== true) return '';
    const text = t();
    return `<div class="ba-k3-qa"><strong>${esc(text.qa)}</strong>` +
      `<div class="ba-k3-qa-grid">` +
      `<button type="button" data-k3-qa="success">${esc(text.qaSuccess)}</button>` +
      `<button type="button" data-k3-qa="pending">${esc(text.qaPending)}</button>` +
      `<button type="button" data-k3-qa="failed">${esc(text.qaFailed)}</button>` +
      `<button type="button" data-k3-qa="restore">${esc(text.qaRestore)}</button>` +
      `<button type="button" data-k3-qa="revoked">${esc(text.qaRevoke)}</button>` +
      `<button type="button" data-k3-qa="reset">${esc(text.qaReset)}</button>` +
      `</div>${qaMessage ? `<small>${esc(qaMessage)}</small>` : ''}</div>`;
  }

  function setHtml(block, html, signature) {
    block.innerHTML = html + qaHtml();
    block.dataset.k3Signature = signature;
  }

  function refreshFacade() {
    try { window.BearagnosticEntitlement?.refresh?.(); } catch (_) {}
    try { NATIVE.refreshNativeState?.(); } catch (_) {}
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
    const signature = JSON.stringify([
      language(), phase, isPro, ent.source || '', error,
      selectedEmail, qaState().available === true, qaMessage
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
          `<input class="ba-k3-input" data-k3-email type="email" inputmode="email" autocomplete="email" maxlength="254" placeholder="${esc(text.email)}" value="${esc(selectedEmail)}">` +
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
        `<strong>${esc(text.otp)}</strong>` +
          `<input class="ba-k3-input" data-k3-code type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="••••••"${disabled}>` +
          `<div class="ba-k3-actions"><button class="ba-pro-primary" type="button" data-k3-action="verify"${disabled}>${esc(text.verify)}</button>` +
          `<button class="ba-k3-secondary" type="button" data-k3-action="reset">${esc(text.reset)}</button></div>`,
        signature
      );
      return;
    }

    if (phase === 'opening_kofi' || phase === 'waiting_payment') {
      setHtml(
        block,
        `<strong>${esc(text.waiting)}</strong><small>${esc(text.sub)}</small>` +
          (error ? `<small class="ba-k3-error">${esc(mapError(error))}</small>` : '') +
          `<div class="ba-k3-actions"><button class="ba-pro-primary" type="button" data-k3-action="refresh">${esc(text.retry)}</button>` +
          `<button class="ba-k3-secondary" type="button" data-k3-action="reset">${esc(text.reset)}</button></div>`,
        signature
      );
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

  function handleCommerceAction(action) {
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

  function handleQaAction(scenario) {
    if (qaState().available !== true) return;
    try {
      const result = parse(NATIVE.runCommerceQaScenario(String(scenario || '')), {});
      qaMessage = result.accepted === true
        ? `${result.scenario}: ${result.isPro === true ? 'PRO' : 'FREE'}`
        : String(result.reason || 'qa_failed');
      refreshFacade();
      lastSignature = '';
      render(true);
    } catch (_) {
      qaMessage = 'qa_failed';
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
    [0, 80, 220].forEach((delay) => setTimeout(() => render(true), delay));
  }

  document.addEventListener('click', (event) => {
    if (!active) return;

    const qaButton = event.target?.closest?.('[data-k3-qa]');
    if (qaButton) {
      event.preventDefault();
      event.stopPropagation();
      handleQaAction(String(qaButton.dataset.k3Qa || ''));
      return;
    }

    const button = event.target?.closest?.('[data-k3-action]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    handleCommerceAction(String(button.dataset.k3Action || ''));
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

  // User-driven activation only. Nothing here opens commerce during application startup.
  window.addEventListener('bearagnostic:prorequest', () => setTimeout(activate, 0));

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
