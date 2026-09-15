(() => {
  'use strict';

  const ENT = window.BearagnosticEntitlement;
  if (!ENT) return;

  const byId = (id) => document.getElementById(id);
  let lastRequestSource = 'more';
  let observerQueued = false;

  const ICONS = Object.freeze({
    pro: '<path d="M12 3.2 15 9l5.8 3-5.8 3-3 5.8L9 15l-5.8-3L9 9z"/><circle cx="12" cy="12" r="2.1"/>',
    deep: '<path d="m12 3 8 4-8 4-8-4z"/><path d="m4 12 8 4 8-4M4 17l8 4 8-4"/>',
    custom: '<path d="M4 6h10M18 6h2M10 12h10M4 12h2M4 18h10M18 18h2"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>',
    shield: '<path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6Z"/><path d="m9 12 2 2 4-4"/>',
    roadmap: '<path d="M5 18V8M12 18V4M19 18v-7"/><path d="M3 18h18"/>'
  });

  const COPY = {
    en: {
      rowTitle: 'Bearagnostic Pro', rowFree: 'Free plan · Explore the Pro toolkit', rowPro: 'Lifetime access · Active',
      eyebrow: 'BEARAGNOSTIC PRO', title: 'Go deeper. See more. Stay in control.',
      lead: 'Free stays genuinely useful. Pro adds deeper diagnostics and advanced control without ads, accounts, or a subscription.',
      freeBadge: 'FREE PLAN', proBadge: 'PRO ACTIVE',
      available: 'Available in the current app', deep: 'Deep Scan', deepSub: 'Full streaming reads of readable files plus exact duplicate verification across the accessible scope.',
      custom: 'Custom Scan', customSub: 'Choose Downloads, Photos, Videos, Documents or Music and decide whether to verify exact duplicates.',
      planned: 'Planned Pro toolkit', plannedSub: 'These are roadmap capabilities, not claimed as finished in this build.',
      planned1: 'Advanced exact duplicate workflow', planned2: 'Advanced media review & filters', planned3: 'Historical Insights & What Changed', planned4: 'Full cleanup history', planned5: 'Custom exclusions', planned6: 'Scheduled checkup reminders',
      safetyTitle: 'Safety stays free', safetyBody: 'Risk explanations, Protected logic, confirmation, keep-one-copy safeguards and truthful scan coverage remain available to everyone.',
      modelTitle: 'Simple ownership', modelBody: 'One-time lifetime upgrade · No subscription · No ads · No Bearagnostic account required.',
      billingPending: 'Google Play purchase setup is intentionally not active in this development build yet.',
      billingPendingSub: 'The next Billing batch will supply the local Play price, purchase, restore and ownership lifecycle to this entitlement layer.',
      activeTitle: 'Bearagnostic Pro is active', activeSub: 'This build currently has access to Pro capabilities.',
      close: 'Close',
      debugTitle: 'DEVELOPMENT ENTITLEMENT TEST', debugBody: 'Debug build only. This control never appears in a release build.', debugFree: 'Test as FREE', debugPro: 'Test as PRO', debugReset: 'Reset',
      planTitle: 'Plan', planSub: 'Access level for this installation', planFree: 'Free', planPro: 'Pro · Lifetime', planExplore: 'Explore Pro', planView: 'View Pro',
      proTag: 'PRO', proUnlocked: 'PRO ✓'
    },
    th: {
      rowTitle: 'Bearagnostic Pro', rowFree: 'แผน Free · ดูเครื่องมือ Pro', rowPro: 'สิทธิ์ตลอดชีพ · เปิดใช้งานแล้ว',
      eyebrow: 'BEARAGNOSTIC PRO', title: 'ตรวจได้ลึกขึ้น เห็นมากขึ้น และยังควบคุมทุกอย่างเอง',
      lead: 'Free ยังคงใช้งานได้จริง ส่วน Pro เพิ่มการตรวจเชิงลึกและเครื่องมือควบคุมขั้นสูง โดยไม่มีโฆษณา ไม่ต้องสมัครบัญชี และไม่มีค่าสมาชิกรายเดือน',
      freeBadge: 'แผน FREE', proBadge: 'PRO เปิดใช้งานแล้ว',
      available: 'ความสามารถที่มีอยู่ในแอปตอนนี้', deep: 'Deep Scan', deepSub: 'อ่านเนื้อหาไฟล์ที่อ่านได้แบบ streaming จนครบ และยืนยันไฟล์ซ้ำแบบ exact ทั่วขอบเขตที่เข้าถึงได้',
      custom: 'Custom Scan', customSub: 'เลือก Downloads, Photos, Videos, Documents หรือ Music และกำหนดว่าจะยืนยันไฟล์ซ้ำแบบ exact หรือไม่',
      planned: 'เครื่องมือ Pro ในแผนพัฒนา', plannedSub: 'รายการด้านล่างเป็น roadmap และยังไม่อ้างว่าเสร็จแล้วใน build นี้',
      planned1: 'ระบบจัดการไฟล์ซ้ำแบบ exact ขั้นสูง', planned2: 'Media Review และตัวกรองขั้นสูง', planned3: 'Insights ย้อนหลังและ What Changed', planned4: 'ประวัติการทำความสะอาดแบบเต็ม', planned5: 'กำหนดตำแหน่งที่ไม่ต้องตรวจเอง', planned6: 'การเตือนให้ตรวจเครื่องตามกำหนด',
      safetyTitle: 'ความปลอดภัยใช้ฟรีเสมอ', safetyBody: 'คำอธิบายความเสี่ยง ระบบ Protected การยืนยันก่อนลบ การเก็บไฟล์ซ้ำไว้อย่างน้อยหนึ่งสำเนา และสถานะขอบเขตการสแกนที่ตรงจริง จะไม่ถูกล็อกหลัง Pro',
      modelTitle: 'ซื้อครั้งเดียว เข้าใจง่าย', modelBody: 'อัปเกรดตลอดชีพครั้งเดียว · ไม่มีรายเดือน · ไม่มีโฆษณา · ไม่ต้องมีบัญชี Bearagnostic',
      billingPending: 'ระบบซื้อผ่าน Google Play ยังไม่เปิดใน development build นี้โดยตั้งใจ',
      billingPendingSub: 'Batch Billing ถัดไปจะเชื่อมราคาตามประเทศ การซื้อ การกู้คืนสิทธิ์ และวงจรสถานะเจ้าของเข้ากับ entitlement layer นี้',
      activeTitle: 'Bearagnostic Pro เปิดใช้งานแล้ว', activeSub: 'Build นี้มีสิทธิ์ใช้ความสามารถ Pro แล้ว',
      close: 'ปิด',
      debugTitle: 'ทดสอบสิทธิ์สำหรับ DEVELOPMENT', debugBody: 'มีเฉพาะ Debug build เท่านั้น Release build จะไม่มีตัวควบคุมนี้', debugFree: 'ทดสอบแบบ FREE', debugPro: 'ทดสอบแบบ PRO', debugReset: 'รีเซ็ต',
      planTitle: 'แผนการใช้งาน', planSub: 'ระดับสิทธิ์ของการติดตั้งนี้', planFree: 'Free', planPro: 'Pro · ตลอดชีพ', planExplore: 'ดู Pro', planView: 'ดูสิทธิ์ Pro',
      proTag: 'PRO', proUnlocked: 'PRO ✓'
    },
    ja: {
      rowTitle: 'Bearagnostic Pro', rowFree: 'Free プラン · Pro ツールを見る', rowPro: '買い切りアクセス · 有効',
      eyebrow: 'BEARAGNOSTIC PRO', title: 'より深く確認し、もっと把握し、操作は自分の手に。',
      lead: 'Free でも実用性は保ちます。Pro は広告・独自アカウント・サブスクリプションなしで、より深い診断と高度なコントロールを追加します。',
      freeBadge: 'FREE プラン', proBadge: 'PRO 有効',
      available: '現在のアプリで利用できる機能', deep: 'Deep Scan', deepSub: '読み取り可能なファイルをストリーミングで最後まで読み、アクセス可能範囲で完全一致の重複を検証します。',
      custom: 'Custom Scan', customSub: 'Downloads、Photos、Videos、Documents、Music を選び、完全一致の重複検証を行うか指定できます。',
      planned: 'Pro の開発ロードマップ', plannedSub: '以下は今後の予定で、このビルドで完成済みとは表示しません。',
      planned1: '高度な完全一致重複ワークフロー', planned2: '高度なメディアレビューとフィルター', planned3: '履歴 Insights と What Changed', planned4: '完全なクリーンアップ履歴', planned5: 'カスタム除外設定', planned6: '定期チェック通知',
      safetyTitle: '安全機能は常に無料', safetyBody: 'リスク説明、Protected 判定、削除確認、最低1コピーを残す保護、正確なスキャン範囲表示はすべてのユーザーに提供します。',
      modelTitle: 'シンプルな所有モデル', modelBody: '一度の買い切り · サブスクなし · 広告なし · Bearagnostic アカウント不要',
      billingPending: 'この開発ビルドでは Google Play の購入処理を意図的にまだ有効化していません。',
      billingPendingSub: '次の Billing バッチで、地域別価格・購入・復元・所有権ライフサイクルをこの entitlement layer に接続します。',
      activeTitle: 'Bearagnostic Pro は有効です', activeSub: 'このビルドでは Pro 機能を利用できます。',
      close: '閉じる',
      debugTitle: 'DEVELOPMENT 権限テスト', debugBody: 'Debug build 専用です。Release build には表示されません。', debugFree: 'FREE としてテスト', debugPro: 'PRO としてテスト', debugReset: 'リセット',
      planTitle: 'プラン', planSub: 'このインストールのアクセスレベル', planFree: 'Free', planPro: 'Pro · 買い切り', planExplore: 'Pro を見る', planView: 'Pro を確認',
      proTag: 'PRO', proUnlocked: 'PRO ✓'
    }
  };

  function lang() {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
  }

  function c() { return COPY[lang()] || COPY.en; }
  function icon(path) { return `<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`; }

  function ensureStyle() {
    if (byId('androidProUiStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidProUiStyle';
    style.textContent = `
      /* Pro entry: premium indigo/cyan with a restrained champagne glint. */
      #supportProjectRow[data-pro-entry]{--tone:104,94,205!important;background:linear-gradient(112deg,#fff 32%,rgba(104,94,205,.092) 78%,rgba(37,177,226,.075) 100%)!important;border-color:rgba(104,94,205,.13)!important;box-shadow:0 12px 30px rgba(71,68,132,.085),inset 0 1px 0 #fff!important}
      #supportProjectRow[data-pro-entry]:after{background:radial-gradient(circle,rgba(109,94,211,.14),transparent 68%)!important}
      #supportProjectRow[data-pro-entry] .soft-icon{background:linear-gradient(145deg,#7c6cda,#4e8ed9)!important;color:#fff!important;box-shadow:0 10px 22px rgba(89,83,185,.17),inset 0 1px 0 rgba(255,255,255,.34)!important}
      #supportProjectRow[data-pro-entry] .soft-icon svg{width:22px;height:22px;color:#fff!important;fill:none;stroke:currentColor;stroke-width:1.55;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 1px rgba(45,45,105,.20))}
      #supportProjectRow[data-pro-entry] .ba-pro-row-badge{display:inline-flex;align-items:center;height:19px;margin-top:5px;padding:0 7px;border-radius:999px;background:linear-gradient(145deg,#fff7df,#f7ecd0);border:1px solid rgba(183,139,64,.12);color:#9a7130;font-size:7px;font-weight:820;letter-spacing:.09em;line-height:1}
      #supportProjectRow[data-pro-entry] small{color:#748095!important}#supportProjectRow[data-pro-entry] b{color:#7569bd!important}

      .native-mode-option .ba-pro-mode-badge{display:inline-flex!important;align-items:center;height:23px;margin-left:auto;padding:0 7px;border-radius:999px;background:linear-gradient(145deg,#f1edff,#eef6ff)!important;border:1px solid rgba(103,95,208,.11)!important;color:#6659b9!important;font-size:8px!important;font-weight:820!important;letter-spacing:.075em!important;line-height:1!important;white-space:nowrap;box-shadow:inset 0 1px 0 #fff}
      .native-mode-option.is-ba-pro-locked{cursor:pointer}.native-mode-option.is-ba-pro-locked:before{content:'';position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1px rgba(103,95,208,.055);pointer-events:none}
      .native-mode-option.is-ba-pro-unlocked .ba-pro-mode-badge{background:linear-gradient(145deg,#e9f8f2,#eefafa)!important;border-color:rgba(47,169,141,.12)!important;color:#23836f!important}

      .ba-pro-overlay{position:fixed;inset:0;z-index:2200;display:grid;align-items:end;padding:0 10px max(10px,env(safe-area-inset-bottom));background:rgba(14,25,44,.34);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}
      .ba-pro-overlay[hidden]{display:none!important}.ba-pro-panel{width:min(100%,540px);max-height:min(91vh,850px);margin:0 auto;overflow:auto;overscroll-behavior:contain;border-radius:31px 31px 24px 24px;background:radial-gradient(circle at 86% 0%,rgba(66,184,235,.13),transparent 26%),radial-gradient(circle at 5% 18%,rgba(118,90,214,.09),transparent 24%),linear-gradient(180deg,#fdfefe,#f5f9fd);border:1px solid rgba(255,255,255,.98);box-shadow:0 -24px 70px rgba(24,48,78,.25),inset 0 1px 0 #fff;padding:11px 15px 16px;color:#172a40}
      .ba-pro-handle{width:43px;height:4px;margin:0 auto 12px;border-radius:999px;background:linear-gradient(90deg,#dfe7ef,#c8d5e2,#dfe7ef)}
      .ba-pro-head{display:grid;grid-template-columns:50px minmax(0,1fr) 36px;gap:10px;align-items:center}.ba-pro-mark{width:50px;height:50px;border-radius:17px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#7c65d8,#368edc);box-shadow:0 12px 28px rgba(80,77,173,.20),inset 0 1px 0 rgba(255,255,255,.35)}.ba-pro-mark svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.55;stroke-linecap:round;stroke-linejoin:round}.ba-pro-kicker{display:block;font-size:8px;letter-spacing:.19em;color:#6d68b9;font-weight:850}.ba-pro-title{margin:4px 0 0;font-size:20px;line-height:1.08;letter-spacing:-.035em;color:#172b43}.ba-pro-close{width:36px;height:36px;border-radius:13px;background:#edf3f8;color:#718294;font-size:19px;line-height:1}
      .ba-pro-lead{font-size:10.5px;line-height:1.47;color:#6e8091;margin:10px 2px 11px}.ba-pro-status{display:inline-flex;align-items:center;height:25px;padding:0 9px;border-radius:999px;background:#eef3fa;color:#64758a;font-size:8px;font-weight:850;letter-spacing:.08em}.ba-pro-status.is-pro{background:linear-gradient(145deg,#e8f8f2,#eefaf8);color:#23836e}
      .ba-pro-section{margin-top:11px}.ba-pro-section-head{display:flex;align-items:end;justify-content:space-between;gap:10px;margin:0 2px 7px}.ba-pro-section-head strong{font-size:11px;color:#243a52}.ba-pro-section-head small{font-size:7.5px;color:#8a99a7;text-align:right;line-height:1.3}
      .ba-pro-feature-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ba-pro-feature{min-width:0;padding:11px;border-radius:19px;background:linear-gradient(145deg,#fff,#f2f7fc);border:1px solid rgba(87,117,149,.09);box-shadow:0 7px 20px rgba(55,87,119,.055)}.ba-pro-feature__icon{width:31px;height:31px;border-radius:10px;display:grid;place-items:center;margin-bottom:8px;color:#5f5bc0;background:linear-gradient(145deg,#f0ecff,#eef5ff)}.ba-pro-feature__icon svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.ba-pro-feature strong{display:block;font-size:11px;color:#20364e}.ba-pro-feature small{display:block;margin-top:5px;font-size:8px;line-height:1.4;color:#7a8a99}
      .ba-pro-roadmap{padding:10px 11px;border-radius:19px;background:linear-gradient(135deg,#f6f3ff,#f3f9fd);border:1px solid rgba(109,94,201,.08)}.ba-pro-roadmap p{margin:0 0 8px;font-size:8px;line-height:1.4;color:#7b7898}.ba-pro-roadmap__chips{display:flex;flex-wrap:wrap;gap:6px}.ba-pro-roadmap__chips span{display:inline-flex;align-items:center;min-height:24px;padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.84);border:1px solid rgba(102,91,174,.08);color:#635e86;font-size:7.5px;line-height:1.25}
      .ba-pro-trust{display:grid;grid-template-columns:36px minmax(0,1fr);gap:9px;align-items:center;padding:10px 11px;border-radius:19px;background:linear-gradient(130deg,#eaf9f4,#f8fcff);border:1px solid rgba(47,169,141,.09)}.ba-pro-trust__icon{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;color:#278e78;background:#dcf5ed}.ba-pro-trust__icon svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.ba-pro-trust strong{display:block;font-size:10px;color:#255044}.ba-pro-trust small{display:block;margin-top:3px;font-size:8px;line-height:1.38;color:#718d86}
      .ba-pro-model{margin-top:8px;padding:10px 11px;border-radius:19px;background:linear-gradient(135deg,#fff9e9,#fffdf8);border:1px solid rgba(186,139,60,.09)}.ba-pro-model strong{display:block;font-size:10px;color:#6f562a}.ba-pro-model small{display:block;margin-top:3px;font-size:8px;line-height:1.4;color:#8d8068}
      .ba-pro-purchase{margin-top:10px;padding:11px;border-radius:20px;background:#fff;border:1px solid rgba(91,119,147,.09);box-shadow:0 8px 22px rgba(53,83,114,.05)}.ba-pro-purchase strong{display:block;font-size:10px;color:#233a52}.ba-pro-purchase small{display:block;margin-top:4px;font-size:8px;line-height:1.4;color:#7d8d9d}.ba-pro-primary{width:100%;height:45px;margin-top:9px;border-radius:16px;background:linear-gradient(118deg,#7764d5,#258fdc);color:#fff;font-size:10.5px;font-weight:800;box-shadow:0 10px 21px rgba(81,78,176,.17)}.ba-pro-primary:disabled{background:linear-gradient(118deg,#d8e0e8,#cbd7e2);color:#758596;box-shadow:none;opacity:1}
      .ba-pro-debug{margin-top:10px;padding:10px;border-radius:18px;border:1px dashed rgba(104,94,205,.22);background:rgba(245,243,255,.72)}.ba-pro-debug__head strong{display:block;font-size:8px;letter-spacing:.08em;color:#665cb0}.ba-pro-debug__head small{display:block;margin-top:3px;font-size:7.5px;line-height:1.35;color:#8986a0}.ba-pro-debug__actions{display:grid;grid-template-columns:1fr 1fr auto;gap:6px;margin-top:8px}.ba-pro-debug button{height:36px;border-radius:12px;background:#fff;border:1px solid rgba(102,91,176,.10);color:#5d5a85;font-size:8px;font-weight:750}.ba-pro-debug button.is-active{background:linear-gradient(145deg,#ede9ff,#edf6ff);color:#5c52ad;box-shadow:inset 0 0 0 1px rgba(100,85,190,.07)}
      .ba-plan-card{--tone:103,95,208!important}.ba-plan-card .native-pref-orb{background:linear-gradient(145deg,#efebff,#eef6ff)!important;color:#655dbd!important}.ba-plan-cta{height:31px;padding:0 10px;border-radius:11px;background:linear-gradient(145deg,#efecff,#eef6ff);border:1px solid rgba(101,91,190,.09);color:#6159ad;font-size:8px;font-weight:790}.ba-plan-status.is-pro{color:#25856f!important}
      @media(max-width:360px){.ba-pro-panel{padding-left:12px;padding-right:12px}.ba-pro-feature-grid{grid-template-columns:1fr}.ba-pro-title{font-size:18px}.ba-pro-debug__actions{grid-template-columns:1fr 1fr}.ba-pro-debug__actions button:last-child{grid-column:1/-1}}
      @media(prefers-reduced-motion:reduce){.ba-pro-overlay *{scroll-behavior:auto!important}}
    `;
    document.head.appendChild(style);
  }

  function ensureSheet() {
    ensureStyle();
    let overlay = byId('bearagnosticProOverlay');
    if (overlay) return overlay;
    overlay = document.createElement('section');
    overlay.id = 'bearagnosticProOverlay';
    overlay.className = 'ba-pro-overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay || event.target.closest?.('[data-pro-close]')) closeSheet();
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  function closeSheet() {
    const overlay = byId('bearagnosticProOverlay');
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove('modal-open');
  }

  function renderSheet() {
    const overlay = ensureSheet();
    const t = c();
    const state = ENT.getState();
    const isPro = state.isPro === true;
    const debug = state.debugControlsAvailable === true;
    const roadmap = [t.planned1,t.planned2,t.planned3,t.planned4,t.planned5,t.planned6]
      .map((item) => `<span>${item}</span>`).join('');

    const purchaseBlock = isPro
      ? `<div class="ba-pro-purchase"><strong>${t.activeTitle}</strong><small>${t.activeSub}</small><button class="ba-pro-primary" type="button" disabled>${t.proBadge}</button></div>`
      : `<div class="ba-pro-purchase"><strong>${t.billingPending}</strong><small>${t.billingPendingSub}</small><button class="ba-pro-primary" type="button" disabled>${t.billingPending}</button></div>`;

    const debugBlock = debug ? `<section class="ba-pro-debug"><div class="ba-pro-debug__head"><strong>${t.debugTitle}</strong><small>${t.debugBody}</small></div><div class="ba-pro-debug__actions"><button type="button" data-debug-tier="free" class="${!isPro?'is-active':''}">${t.debugFree}</button><button type="button" data-debug-tier="pro" class="${isPro?'is-active':''}">${t.debugPro}</button><button type="button" data-debug-reset>${t.debugReset}</button></div></section>` : '';

    overlay.innerHTML = `<div class="ba-pro-panel"><div class="ba-pro-handle"></div><header class="ba-pro-head"><span class="ba-pro-mark">${icon(ICONS.pro)}</span><div><span class="ba-pro-kicker">${t.eyebrow}</span><h2 class="ba-pro-title">${t.title}</h2></div><button class="ba-pro-close" data-pro-close type="button" aria-label="${t.close}">×</button></header><p class="ba-pro-lead">${t.lead}</p><span class="ba-pro-status ${isPro?'is-pro':''}">${isPro?t.proBadge:t.freeBadge}</span>
      <section class="ba-pro-section"><div class="ba-pro-section-head"><strong>${t.available}</strong></div><div class="ba-pro-feature-grid"><article class="ba-pro-feature"><span class="ba-pro-feature__icon">${icon(ICONS.deep)}</span><strong>${t.deep}</strong><small>${t.deepSub}</small></article><article class="ba-pro-feature"><span class="ba-pro-feature__icon">${icon(ICONS.custom)}</span><strong>${t.custom}</strong><small>${t.customSub}</small></article></div></section>
      <section class="ba-pro-section"><div class="ba-pro-section-head"><strong>${t.planned}</strong></div><div class="ba-pro-roadmap"><p>${t.plannedSub}</p><div class="ba-pro-roadmap__chips">${roadmap}</div></div></section>
      <section class="ba-pro-section"><div class="ba-pro-trust"><span class="ba-pro-trust__icon">${icon(ICONS.shield)}</span><div><strong>${t.safetyTitle}</strong><small>${t.safetyBody}</small></div></div><div class="ba-pro-model"><strong>${t.modelTitle}</strong><small>${t.modelBody}</small></div></section>${purchaseBlock}${debugBlock}</div>`;

    overlay.querySelectorAll('[data-debug-tier]').forEach((button) => {
      button.addEventListener('click', () => {
        ENT.setDebugTier(button.dataset.debugTier);
        renderSheet();
        decorateAll();
      });
    });
    overlay.querySelector('[data-debug-reset]')?.addEventListener('click', () => {
      ENT.clearDebugTier();
      renderSheet();
      decorateAll();
    });
  }

  function openSheet(source = 'more') {
    lastRequestSource = source;
    if (source.startsWith('scan_') || source === 'custom_start') {
      const modeSheet = byId('nativeModeSheet');
      if (modeSheet) modeSheet.hidden = true;
    }
    renderSheet();
    const overlay = byId('bearagnosticProOverlay');
    if (!overlay) return;
    overlay.hidden = false;
    document.body.classList.add('modal-open');
    const panel = overlay.querySelector('.ba-pro-panel');
    if (panel) panel.scrollTop = 0;
  }

  function decorateModeCards() {
    const state = ENT.getState();
    const t = c();
    ['deep','custom'].forEach((mode) => {
      const button = document.querySelector(`.native-mode-option[data-native-mode="${mode}"]`);
      if (!button) return;
      button.classList.toggle('is-ba-pro-locked', !state.isPro);
      button.classList.toggle('is-ba-pro-unlocked', state.isPro);
      let badge = button.querySelector('.ba-pro-mode-badge');
      const head = button.querySelector('.premium-mode-head');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'ba-pro-mode-badge';
        (head || button).appendChild(badge);
      } else if (head && badge.parentElement !== head) {
        head.appendChild(badge);
      }
      const badgeText = state.isPro ? t.proUnlocked : t.proTag;
      if (badge.textContent !== badgeText) badge.textContent = badgeText;
      button.setAttribute('data-pro-capability', mode === 'deep' ? 'deep_scan' : 'custom_scan');
    });
  }

  function decorateMore() {
    const row = byId('supportProjectRow');
    if (!row) return;
    const state = ENT.getState();
    const t = c();
    row.dataset.proEntry = 'true';
    row.removeAttribute('data-open');
    const iconNode = row.querySelector('.soft-icon');
    if (iconNode && iconNode.dataset.proIcon !== 'true') {
      iconNode.dataset.proIcon = 'true';
      iconNode.innerHTML = icon(ICONS.pro);
    }
    const title = byId('supportProjectTitle') || row.querySelector('strong');
    const sub = byId('supportProjectSub') || row.querySelector('small');
    if (title && title.textContent !== t.rowTitle) title.textContent = t.rowTitle;
    if (sub) {
      const value = state.isPro ? t.rowPro : t.rowFree;
      if (sub.textContent !== value) sub.textContent = value;
    }
    const copyWrap = title?.parentElement;
    let badge = copyWrap?.querySelector('.ba-pro-row-badge');
    if (copyWrap && !badge) {
      badge = document.createElement('span');
      badge.className = 'ba-pro-row-badge';
      copyWrap.appendChild(badge);
    }
    if (badge) {
      const badgeText = state.isPro ? t.proBadge : t.proTag;
      if (badge.textContent !== badgeText) badge.textContent = badgeText;
    }
  }

  function decoratePreferences() {
    const ext = byId('nativePreferencesExtension');
    if (!ext) return;
    const state = ENT.getState();
    const t = c();
    let card = byId('nativePlanCard');
    if (!card) {
      card = document.createElement('section');
      card.id = 'nativePlanCard';
      card.className = 'native-pref-card ba-plan-card';
      ext.appendChild(card);
    }
    const signature = `${lang()}|${state.isPro ? 'pro' : 'free'}`;
    if (card.dataset.proSignature !== signature) {
      card.dataset.proSignature = signature;
      card.innerHTML = `<div class="native-pref-card__head"><span class="native-pref-orb">${icon(ICONS.pro)}</span><div><strong>${t.planTitle}</strong><small>${t.planSub}</small></div></div><div class="native-pref-rows"><div class="native-pref-row"><span>${t.rowTitle}</span><b class="ba-plan-status ${state.isPro?'is-pro':'slate'}">${state.isPro?t.planPro:t.planFree}</b></div><div class="native-pref-row"><span>${t.modelTitle}</span><button class="ba-plan-cta" data-pro-entry type="button">${state.isPro?t.planView:t.planExplore}</button></div></div>`;
    }
  }

  function decorateAll() {
    ensureStyle();
    decorateModeCards();
    decorateMore();
    decoratePreferences();
  }

  function queueDecorate() {
    if (observerQueued) return;
    observerQueued = true;
    requestAnimationFrame(() => {
      observerQueued = false;
      decorateAll();
    });
  }

  window.addEventListener('bearagnostic:prorequest', (event) => openSheet(event.detail?.source || 'more'));
  window.addEventListener('bearagnostic:entitlementchange', () => { decorateAll(); if (!byId('bearagnosticProOverlay')?.hidden) renderSheet(); });
  window.addEventListener('bearagnostic:screenchange', () => setTimeout(decorateAll, 0));
  window.addEventListener('bearagnostic:languagechange', () => setTimeout(() => { decorateAll(); if (!byId('bearagnosticProOverlay')?.hidden) renderSheet(); }, 0));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !byId('bearagnosticProOverlay')?.hidden) closeSheet(); });

  const observer = new MutationObserver(queueDecorate);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', decorateAll, { once: true });
  else decorateAll();

  window.BearagnosticProUI = Object.freeze({ open: openSheet, close: closeSheet, refresh: decorateAll, lastSource: () => lastRequestSource });
})();
