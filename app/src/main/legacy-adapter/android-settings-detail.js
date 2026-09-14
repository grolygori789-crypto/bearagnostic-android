(() => {
  'use strict';

  const byId = (id) => document.getElementById(id);
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const KOFI_ICON = '<path class="ba-detail-kofi-cup" d="M5.2 8.4h10.7v4.8a5 5 0 0 1-5 5h-.7a5 5 0 0 1-5-5Z"/><path class="ba-detail-kofi-cup" d="M15.9 10h1.55a2.45 2.45 0 0 1 0 4.9H15.9"/><path class="ba-detail-kofi-heart" d="M8.45 11.65c.68-.93 2.1-.72 2.55.28.45-1 1.87-1.21 2.55-.28.88 1.2-.24 2.55-2.55 3.98-2.31-1.43-3.43-2.78-2.55-3.98Z"/>';
  const ICONS = Object.freeze({
    support: KOFI_ICON,
    help: '<circle cx="12" cy="12" r="8"/><path d="M9.7 9.5a2.5 2.5 0 1 1 4.4 1.6c-1.3 1.2-2.1 1.5-2.1 3"/><path d="M12 17h.01"/>',
    pro: '<path d="M12 3.2 15 9l5.8 3-5.8 3-3 5.8L9 15l-5.8-3L9 9z"/><circle cx="12" cy="12" r="2.1"/>',
    legal: '<path d="M7 3h10l3 3v15H4V3z"/><path d="M8 9h8M8 13h8M8 17h5"/>',
    about: '<circle cx="12" cy="12" r="8"/><path d="M12 10v6"/><path d="M12 7h.01"/>'
  });

  const COPY = Object.freeze({
    en: {
      back:'Back',
      supportFallbackKicker:'SUPPORT', supportFallbackTitle:'Support Bearagnostic', supportIntro:'Keep Bearagnostic moving forward.',
      helpFallbackKicker:'HELP & FEEDBACK', helpFallbackTitle:'Help & Feedback', helpIntro:'How can Dr. Bear help?',
      proFallbackKicker:'BEARAGNOSTIC PRO', proFallbackTitle:'Bearagnostic Pro', proIntro:'Go deeper. See more. Stay in control.',
      legalFallbackKicker:'LEGAL', legalFallbackTitle:'Legal & Licenses', legalIntro:'Clear ownership. Clear terms.',
      aboutFallbackKicker:'ABOUT', aboutFallbackTitle:'About Bearagnostic',
      supportAction:'Support on Ko-fi', supportActionSub:'Ko-fi · Benedict Interactive',
      diagnosticsCopied:'Diagnostic info copied.', copyFailed:'Could not copy automatically.',
      proAvailable:'Available in the current app', proSafety:'Safety & ownership',
      aboutPrivacy:'Selected files are analyzed locally by Bearagnostic and are not uploaded by the app in the current version.'
    },
    th: {
      back:'ย้อนกลับ',
      supportFallbackKicker:'สนับสนุน', supportFallbackTitle:'สนับสนุน Bearagnostic', supportIntro:'ช่วยให้ Bearagnostic เดินหน้าต่อไป',
      helpFallbackKicker:'ช่วยเหลือและข้อเสนอแนะ', helpFallbackTitle:'ช่วยเหลือและข้อเสนอแนะ', helpIntro:'ให้ Dr. Bear ช่วยอะไรดี?',
      proFallbackKicker:'BEARAGNOSTIC PRO', proFallbackTitle:'Bearagnostic Pro', proIntro:'ตรวจได้ลึกขึ้น เห็นมากขึ้น และยังควบคุมทุกอย่างเอง',
      legalFallbackKicker:'LEGAL', legalFallbackTitle:'กฎหมายและสิทธิ์การใช้งาน', legalIntro:'สิทธิ์ชัดเจน เงื่อนไขชัดเจน',
      aboutFallbackKicker:'เกี่ยวกับ', aboutFallbackTitle:'เกี่ยวกับ Bearagnostic',
      supportAction:'สนับสนุนผ่าน Ko-fi', supportActionSub:'Ko-fi · Benedict Interactive',
      diagnosticsCopied:'คัดลอกข้อมูลทางเทคนิคแล้ว', copyFailed:'ไม่สามารถคัดลอกให้อัตโนมัติได้',
      proAvailable:'ความสามารถที่มีอยู่ในแอปตอนนี้', proSafety:'ความปลอดภัยและสิทธิ์การใช้งาน',
      aboutPrivacy:'ไฟล์ที่เลือกจะถูกวิเคราะห์บนอุปกรณ์โดย Bearagnostic และแอปเวอร์ชันปัจจุบันจะไม่อัปโหลดเนื้อหาไฟล์เหล่านั้น'
    },
    ja: {
      back:'戻る',
      supportFallbackKicker:'サポート', supportFallbackTitle:'Bearagnostic を支援', supportIntro:'Bearagnostic の次の一歩を支える',
      helpFallbackKicker:'ヘルプ・フィードバック', helpFallbackTitle:'ヘルプ・フィードバック', helpIntro:'Dr. Bear にご相談ください',
      proFallbackKicker:'BEARAGNOSTIC PRO', proFallbackTitle:'Bearagnostic Pro', proIntro:'より深く確認し、もっと把握し、操作は自分の手に。',
      legalFallbackKicker:'LEGAL', legalFallbackTitle:'法的情報とライセンス', legalIntro:'権利と条件を、分かりやすく。',
      aboutFallbackKicker:'ABOUT', aboutFallbackTitle:'Bearagnostic について',
      supportAction:'Ko-fi で支援', supportActionSub:'Ko-fi · Benedict Interactive',
      diagnosticsCopied:'診断情報をコピーしました。', copyFailed:'自動でコピーできませんでした。',
      proAvailable:'現在のアプリで利用できる機能', proSafety:'安全性と所有モデル',
      aboutPrivacy:'選択したファイルは Bearagnostic が端末内で解析し、現在のバージョンではその内容をアップロードしません。'
    }
  });

  let screen = null;
  let returnScreen = 'more';
  let activeKind = null;
  let bypassCapture = false;

  function lang() {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
  }
  function c() { return COPY[lang()] || COPY.en; }

  function addStyles() {
    if (byId('baUnifiedSettingsDetailStyles')) return;
    const style = document.createElement('style');
    style.id = 'baUnifiedSettingsDetailStyles';
    style.textContent = `
      #baUnifiedSettingsDetail{padding-top:clamp(8px,1.2dvh,14px);padding-bottom:clamp(8px,1.2dvh,14px);overflow:hidden;--ba-detail-accent:#25a9e6}
      #baUnifiedSettingsDetail[data-detail-kind=help]{--ba-detail-accent:#8064de}
      #baUnifiedSettingsDetail[data-detail-kind=pro]{--ba-detail-accent:#6f63d4}
      #baUnifiedSettingsDetail[data-detail-kind=support]{--ba-detail-accent:#199fe7}
      #baUnifiedSettingsDetail[data-detail-kind=legal]{--ba-detail-accent:#279dc7}
      #baUnifiedSettingsDetail[data-detail-kind=about]{--ba-detail-accent:#d79a24}
      #baUnifiedSettingsDetail .settings-title-row{align-items:flex-start!important;height:auto!important;min-height:74px!important;margin-bottom:14px!important}
      #baUnifiedSettingsDetail .settings-title-row>div:last-child{min-width:0!important;padding-top:4px!important}
      #baUnifiedSettingsDetail .settings-title-row span{color:var(--ba-detail-accent)!important;font-weight:820!important;letter-spacing:.19em!important}
      #baUnifiedSettingsDetail .settings-title-row h2{margin:5px 0 0!important;font-size:clamp(28px,7.1vw,34px)!important;line-height:1.06!important;letter-spacing:-.035em!important;max-width:100%!important;white-space:normal!important;text-wrap:balance!important;overflow-wrap:normal!important}
      #baUnifiedSettingsDetail .settings-scroll{padding-top:0!important}
      #baUnifiedSettingsDetail .settings-group>h3{color:var(--ba-detail-accent)!important;letter-spacing:.14em!important;font-size:10px!important;font-weight:820!important;text-transform:uppercase!important}
      #baUnifiedSettingsDetail .ba-detail-action-group .setting-link b{color:var(--ba-detail-accent)!important}
      #baUnifiedSettingsDetail .ba-detail-principle{margin-bottom:12px}
      #baUnifiedSettingsDetail .ba-detail-principle__icon{flex:none}
      #baUnifiedSettingsDetail .ba-detail-principle__icon.is-support{background:linear-gradient(145deg,#71dbff 0%,#299ff3 48%,#107be6 100%)!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon.is-help{background:linear-gradient(145deg,#d6b6ff 0%,#a47bf2 48%,#7651df 100%)!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon.is-pro{background:linear-gradient(145deg,#9f92f4 0%,#7567dc 48%,#438fdc 100%)!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon.is-legal{background:linear-gradient(145deg,#8edff4 0%,#43b6da 48%,#278ebf 100%)!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon.is-about{background:linear-gradient(145deg,#ffe89a 0%,#ffc64f 48%,#ee9e12 100%)!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon svg{width:23px!important;height:23px!important;fill:none!important;stroke:#fff!important;stroke-width:1.75!important;stroke-linecap:round;stroke-linejoin:round}
      #baUnifiedSettingsDetail .ba-detail-principle__icon .ba-detail-kofi-cup{fill:none!important;stroke:#fff!important;stroke-width:1.75!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon .ba-detail-kofi-heart{fill:#ff5f73!important;stroke:#fff!important;stroke-width:.42!important}
      #baUnifiedSettingsDetail .ba-detail-action-group{margin-top:12px;overflow:hidden}
      #baUnifiedSettingsDetail .ba-detail-action-group .setting-link{box-shadow:none;border:0;border-top:1px solid var(--line);border-radius:0;background:transparent;padding:10px 1px;min-height:55px}
      #baUnifiedSettingsDetail .ba-detail-action-group .setting-link:first-child{border-top:0}
      #baUnifiedSettingsDetail .ba-detail-action-group .setting-link>span:first-child{display:flex;flex-direction:column}
      #baUnifiedSettingsDetail .ba-detail-action-group .setting-link strong{font-size:13.5px}
      #baUnifiedSettingsDetail .ba-detail-action-group .setting-link small{font-size:10.8px;line-height:1.35;color:var(--muted);margin-top:3px}
      #baUnifiedSettingsDetail .ba-detail-section{padding:10px 1px;border-top:1px solid var(--line)}
      #baUnifiedSettingsDetail .ba-detail-section:first-child{border-top:0;padding-top:4px}
      #baUnifiedSettingsDetail .ba-detail-section>strong{display:block;font-size:13.5px;line-height:1.3;color:#243a52}
      #baUnifiedSettingsDetail .ba-detail-section>p{margin:6px 0 0;font-size:10.8px;line-height:1.55;color:#718196;white-space:normal}
      #baUnifiedSettingsDetail .ba-detail-footnote{margin:10px 4px 0;font-size:9.5px;line-height:1.45;color:#8a98a7}
      #baUnifiedSettingsDetail .ba-detail-status{display:inline-flex;align-items:center;margin-top:8px;height:24px;padding:0 9px;border-radius:999px;background:#eef3fa;color:#64758a;font-size:8px;font-weight:800;letter-spacing:.07em}
      #baUnifiedSettingsDetail .ba-detail-status.is-pro{background:linear-gradient(145deg,#e8f8f2,#eefaf8);color:#23836e}
      #baUnifiedSettingsDetail .ba-pro-purchase{margin:0!important;padding:10px 1px!important;border-radius:0!important;background:transparent!important;border:0!important;border-top:1px solid var(--line)!important;box-shadow:none!important}
      #baUnifiedSettingsDetail .ba-pro-purchase strong{font-size:13.5px!important;color:#243a52!important}
      #baUnifiedSettingsDetail .ba-pro-purchase small{font-size:10.8px!important;line-height:1.45!important;color:#718196!important}
      #baUnifiedSettingsDetail .ba-billing-actions{margin-top:9px!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:7px!important}
      #baUnifiedSettingsDetail .ba-pro-primary,#baUnifiedSettingsDetail .ba-billing-secondary{min-height:40px!important;border-radius:13px!important;font-size:10.5px!important}
      #baUnifiedSettingsDetail .ba-pro-debug{margin:10px 0 0!important;border-radius:16px!important}
      #baUnifiedSettingsDetail .ba-detail-about-appicon{padding:0!important;background:transparent!important;overflow:hidden!important}
      #baUnifiedSettingsDetail .ba-detail-about-appicon::before{display:none!important}
      #baUnifiedSettingsDetail .ba-detail-about-appicon img{width:100%;height:100%;object-fit:cover;border-radius:inherit}
      @media(max-width:360px){#baUnifiedSettingsDetail .settings-title-row h2{font-size:27px!important}#baUnifiedSettingsDetail .privacy-principle-card{padding:14px;grid-template-columns:43px minmax(0,1fr);gap:11px}#baUnifiedSettingsDetail .privacy-principle-card__icon{width:43px;height:43px}}
    `;
    document.head.appendChild(style);
  }

  function ensureScreen() {
    if (screen) return screen;
    addStyles();
    const main = $('.app-main');
    if (!main) return null;
    screen = document.createElement('section');
    screen.className = 'screen settings-screen ba-unified-detail-screen';
    screen.id = 'baUnifiedSettingsDetail';
    screen.dataset.screen = 'ba-detail';
    screen.hidden = true;
    screen.innerHTML = `
      <div class="settings-title-row">
        <button class="back-button" id="baUnifiedDetailBack" type="button" aria-label="${esc(c().back)}">‹</button>
        <div><span id="baUnifiedDetailKicker"></span><h2 id="baUnifiedDetailTitle"></h2></div>
      </div>
      <div class="settings-scroll" id="baUnifiedDetailScroll"></div>`;
    main.appendChild(screen);
    byId('baUnifiedDetailBack')?.addEventListener('click', closeDetail);
    return screen;
  }

  function currentVisibleScreen() {
    return $$('.screen').find((node) => node !== screen && !node.hidden && node.classList.contains('is-active')) ||
      $$('.screen').find((node) => node !== screen && !node.hidden) || null;
  }

  function showDetail(kind, kicker, title, html) {
    const s = ensureScreen();
    if (!s) return;
    const current = currentVisibleScreen();
    if (current?.dataset?.screen) returnScreen = current.dataset.screen;
    activeKind = kind;
    s.dataset.detailKind = kind || '';
    const back = byId('baUnifiedDetailBack');
    if (back) back.setAttribute('aria-label', c().back);
    byId('baUnifiedDetailKicker').textContent = kicker || '';
    byId('baUnifiedDetailTitle').textContent = title || '';
    const scroll = byId('baUnifiedDetailScroll');
    scroll.innerHTML = html;
    scroll.scrollTop = 0;
    $$('.screen').forEach((node) => {
      const active = node === s;
      node.hidden = !active;
      node.classList.toggle('is-active', active);
    });
    window.dispatchEvent(new CustomEvent('bearagnostic:screenchange', {detail:{screen:'ba-detail', kind}}));
    requestAnimationFrame(() => back?.focus?.({preventScroll:true}));
  }

  function clearDetailContent() {
    const scroll = byId('baUnifiedDetailScroll');
    if (scroll) scroll.replaceChildren();
  }

  function closeDetail() {
    if (!screen || screen.hidden) return;
    const target = $(`[data-screen="${CSS.escape(returnScreen || 'more')}"]`) || byId('moreScreen');
    screen.hidden = true;
    screen.classList.remove('is-active');
    clearDetailContent();
    if (target) {
      target.hidden = false;
      target.classList.add('is-active');
      window.dispatchEvent(new CustomEvent('bearagnostic:screenchange', {detail:{screen:target.dataset.screen || 'more'}}));
    }
    activeKind = null;
    delete screen.dataset.detailKind;
  }

  function principle(kind, heading, bodyHtml, extra = '') {
    return `<section class="privacy-principle-card ba-detail-principle"><span class="privacy-principle-card__icon ba-detail-principle__icon is-${kind}" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[kind] || ICONS.about}</svg></span><div><strong>${esc(heading)}</strong><div class="privacy-principle-card__copy">${bodyHtml}</div>${extra}</div></section>`;
  }

  function actionGroup(actions) {
    return `<section class="settings-group ba-detail-action-group">${actions.map((a) => `<button class="setting-link" type="button" data-ba-detail-action="${esc(a.action)}"><span><strong>${esc(a.title)}</strong>${a.sub ? `<small>${esc(a.sub)}</small>` : ''}</span><b>›</b></button>`).join('')}</section>`;
  }

  function closeLegacyOverlay(selector, closeSelector) {
    const overlay = $(selector);
    if (!overlay) return;
    const close = $(closeSelector, overlay);
    if (close) close.click();
    else {
      overlay.classList.remove('is-open');
      overlay.hidden = true;
      document.body.classList.remove('modal-open');
    }
  }

  function renderSupport() {
    const t = c();
    let kicker = t.supportFallbackKicker;
    let title = t.supportFallbackTitle;
    let lead = '';
    let panelTitle = title;
    let panelBody = '';
    let provider = t.supportActionSub;
    let providerBody = '';
    let boundary = '';
    let signoff = '';
    try {
      window.BearagnosticSupport?.open?.();
      const overlay = byId('androidPremiumSupportOverlay');
      if (overlay) {
        kicker = $('.ba-support-kicker', overlay)?.textContent?.trim() || kicker;
        title = $('.ba-support-title', overlay)?.textContent?.trim() || title;
        lead = $('.ba-support-lead', overlay)?.textContent?.trim() || '';
        panelTitle = $('.ba-support-surface-copy strong', overlay)?.textContent?.trim() || panelTitle;
        panelBody = $('.ba-support-surface-copy p', overlay)?.textContent?.trim() || '';
        provider = $('.ba-support-action-copy small', overlay)?.textContent?.trim() || provider;
        providerBody = $('.ba-support-provider-note', overlay)?.textContent?.trim() || '';
        boundary = $('.ba-support-boundary', overlay)?.textContent?.trim() || '';
        signoff = $('.ba-support-signoff', overlay)?.textContent?.trim() || '';
      }
      closeLegacyOverlay('#androidPremiumSupportOverlay', '[data-ba-support-close]');
    } catch (_) {}
    const legacyTagline = title && title !== t.supportFallbackTitle ? title : t.supportIntro;
    const body = `${lead ? `<p>${esc(lead)}</p>` : ''}${panelBody ? `<p>${esc(panelBody)}</p>` : ''}`;
    const html = principle('support', legacyTagline || panelTitle, body) + actionGroup([{action:'support-kofi', title:t.supportAction, sub:provider}]) +
      (providerBody ? `<p class="ba-detail-footnote">${esc(providerBody)}</p>` : '') +
      (boundary ? `<p class="ba-detail-footnote">${esc(boundary)}</p>` : '') +
      (signoff ? `<p class="ba-detail-footnote"><strong>${esc(signoff)}</strong></p>` : '');
    showDetail('support', kicker, t.supportFallbackTitle, html);
  }

  function renderHelp() {
    const t = c();
    let kicker = t.helpFallbackKicker;
    let title = t.helpFallbackTitle;
    let lead = '';
    const actions = [];
    try {
      window.BearagnosticHelp?.openHub?.();
      const overlay = byId('helpFeedbackOverlay');
      if (overlay) {
        kicker = $('.bx-eyebrow', overlay)?.textContent?.trim() || kicker;
        title = $('.bx-head h2', overlay)?.textContent?.trim() || title;
        lead = $('.bx-lead', overlay)?.textContent?.trim() || '';
        $$('.bx-action-card', overlay).forEach((button) => {
          actions.push({
            action: `help-${button.dataset.helpAction || ''}`,
            title: $('strong', button)?.textContent?.trim() || '',
            sub: $('small', button)?.textContent?.trim() || ''
          });
        });
      }
      closeLegacyOverlay('#helpFeedbackOverlay', '[data-bx-close]');
    } catch (_) {}
    const introHeading = title && title !== t.helpFallbackTitle ? title : t.helpIntro;
    const intro = principle('help', introHeading, lead ? `<p>${esc(lead)}</p>` : '');
    const html = intro + actionGroup(actions.length ? actions : [
      {action:'help-report', title:'Report a Problem'},
      {action:'help-feedback', title:'Send Feedback'},
      {action:'help-diagnostics', title:'Copy Diagnostic Info'}
    ]);
    showDetail('help', kicker, t.helpFallbackTitle, html);
  }

  function extractLegacyLegal() {
    const result = {kicker:c().legalFallbackKicker, title:c().legalFallbackTitle, lead:'', cards:[], footer:''};
    try {
      window.BearagnosticStabilization?.openLegal?.();
      const overlay = byId('baLegalOverlay');
      if (overlay) {
        result.kicker = $('.ba-legal-kicker', overlay)?.textContent?.trim() || result.kicker;
        result.title = $('.ba-legal-title', overlay)?.textContent?.trim() || result.title;
        result.lead = $('.ba-legal-lead', overlay)?.textContent?.trim() || '';
        result.cards = $$('.ba-legal-card', overlay).map((card) => ({title:$('strong', card)?.textContent?.trim() || '', body:$('p', card)?.textContent?.trim() || ''}));
        result.footer = $('.ba-legal-footer', overlay)?.textContent?.trim() || '';
      }
      window.BearagnosticStabilization?.closeLegal?.();
    } catch (_) {}
    return result;
  }

  function renderLegal() {
    const data = extractLegacyLegal();
    const principleHtml = principle('legal', c().legalIntro, data.lead ? `<p>${esc(data.lead)}</p>` : '');
    const sections = data.cards.map((card) => `<article class="ba-detail-section"><strong>${esc(card.title)}</strong><p>${esc(card.body)}</p></article>`).join('');
    const html = principleHtml + `<section class="settings-group">${sections}</section>` + (data.footer ? `<p class="ba-detail-footnote">${esc(data.footer)}</p>` : '');
    showDetail('legal', data.kicker, c().legalFallbackTitle, html);
  }

  function renderAbout(row) {
    const t = c();
    let kicker = t.aboutFallbackKicker;
    let title = row?.querySelector('strong')?.textContent?.trim() || t.aboutFallbackTitle;
    let privacy = t.aboutPrivacy;
    let location = 'Benedict Interactive · Bangkok, Thailand';
    try {
      bypassCapture = true;
      row?.click?.();
      const info = byId('infoSheet');
      if (info && !info.hidden) {
        kicker = byId('infoKicker')?.textContent?.trim() || kicker;
        title = byId('infoTitle')?.textContent?.trim() || title;
        privacy = $('.info-content p', info)?.textContent?.trim() || privacy;
        const spans = $$('.about-sheet-brand span', info).map((node) => node.textContent?.trim()).filter(Boolean);
        if (spans[1]) location = spans[1];
      }
      byId('closeInfo')?.click?.();
    } catch (_) {} finally { bypassCapture = false; }
    const build = $('.app-footer__build')?.textContent?.trim() || row?.querySelector('small')?.textContent?.trim() || '';
    const brandCopy = `${build ? `<p><strong>${esc(build)}</strong></p>` : ''}<p>${esc(location)}</p><p>${esc(privacy)}</p>`;
    const html = `<section class="privacy-principle-card ba-detail-principle ba-detail-about-principle"><span class="privacy-principle-card__icon ba-detail-about-appicon" aria-hidden="true"><img src="./assets/icons/app-icon-192.png" alt=""></span><div><strong>Bearagnostic</strong><div class="privacy-principle-card__copy">${brandCopy}</div></div></section>`;
    showDetail('about', kicker, t.aboutFallbackTitle, html);
  }

  function renderPro(source = 'more') {
    const t = c();
    let kicker = t.proFallbackKicker;
    let title = t.proFallbackTitle;
    let lead = '';
    let status = '';
    const features = [];
    const trust = [];
    let purchaseNode = null;
    let debugNode = null;
    try {
      window.BearagnosticProUI?.open?.(source);
      window.BearagnosticStabilization?.refresh?.();
      const overlay = byId('bearagnosticProOverlay');
      if (overlay) {
        kicker = $('.ba-pro-kicker', overlay)?.textContent?.trim() || kicker;
        title = $('.ba-pro-title', overlay)?.textContent?.trim() || title;
        lead = $('.ba-pro-lead', overlay)?.textContent?.trim() || '';
        const statusNode = $('.ba-pro-status', overlay);
        status = statusNode?.textContent?.trim() || '';
        $$('.ba-pro-feature', overlay).forEach((feature) => features.push({title:$('strong', feature)?.textContent?.trim() || '', body:$('small', feature)?.textContent?.trim() || ''}));
        const trustNode = $('.ba-pro-trust', overlay); if (trustNode) trust.push({title:$('strong', trustNode)?.textContent?.trim() || '', body:$('small', trustNode)?.textContent?.trim() || ''});
        const modelNode = $('.ba-pro-model', overlay); if (modelNode) trust.push({title:$('strong', modelNode)?.textContent?.trim() || '', body:$('small', modelNode)?.textContent?.trim() || ''});
        purchaseNode = $('.ba-pro-purchase', overlay);
        debugNode = $('.ba-pro-debug', overlay);
      }
      window.BearagnosticProUI?.close?.();
    } catch (_) {}

    const legacyTagline = title && title !== t.proFallbackTitle ? title : t.proIntro;
    const introBody = `${lead ? `<p>${esc(lead)}</p>` : ''}${status ? `<p><strong>${esc(status)}</strong></p>` : ''}`;
    const intro = principle('pro', legacyTagline, introBody);
    const featureSections = features.map((f) => `<article class="ba-detail-section"><strong>${esc(f.title)}</strong><p>${esc(f.body)}</p></article>`).join('');
    const trustSections = trust.map((f) => `<article class="ba-detail-section"><strong>${esc(f.title)}</strong><p>${esc(f.body)}</p></article>`).join('');
    const html = intro +
      (featureSections ? `<section class="settings-group"><h3>${esc(t.proAvailable)}</h3>${featureSections}</section>` : '') +
      (trustSections || purchaseNode || debugNode ? `<section class="settings-group" id="baUnifiedProActions"><h3>${esc(t.proSafety)}</h3>${trustSections}</section>` : '');
    showDetail('pro', kicker, t.proFallbackTitle, html);
    const target = byId('baUnifiedProActions');
    if (target && purchaseNode) target.appendChild(purchaseNode);
    if (target && debugNode) target.appendChild(debugNode);
    try { window.BearagnosticBilling?.refresh?.(); } catch (_) {}
  }

  async function copyDiagnostics() {
    const t = c();
    const api = window.BearagnosticAppAPI;
    let ok = false;
    try { ok = Boolean(await api?.copyText?.(api?.diagnostics?.() || '')); } catch (_) {}
    api?.showToast?.(ok ? t.diagnosticsCopied : t.copyFailed);
  }

  function handleDetailAction(action) {
    if (action === 'support-kofi') { window.BearagnosticSupport?.openKofi?.(); return; }
    if (action === 'help-report') { window.BearagnosticHelp?.openComposer?.('report'); return; }
    if (action === 'help-feedback') { window.BearagnosticHelp?.openComposer?.('feedback'); return; }
    if (action === 'help-diagnostics') { copyDiagnostics(); }
  }

  document.addEventListener('click', (event) => {
    if (bypassCapture) return;
    const target = event.target?.closest?.('#kofiSupportRow,#helpFeedbackHub,#baLegalRow,#moreScreen [data-open="about"],[data-ba-detail-action]');
    if (!target) return;
    const action = target.dataset?.baDetailAction;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (action) { handleDetailAction(action); return; }
    if (target.id === 'kofiSupportRow') { renderSupport(); return; }
    if (target.id === 'helpFeedbackHub') { renderHelp(); return; }
    if (target.id === 'baLegalRow') { renderLegal(); return; }
    if (target.matches?.('#moreScreen [data-open="about"]')) renderAbout(target);
  }, true);

  // Registered before android-pro-ui.js. This converts every normal Pro request into
  // the same full Settings-detail structure used by Privacy, while preserving billing.
  window.addEventListener('bearagnostic:prorequest', (event) => {
    const source = event.detail?.source || 'more';
    if (source !== 'more') return;
    event.stopImmediatePropagation();
    renderPro(source);
  });

  window.addEventListener('bearagnostic:languagechange', () => {
    if (!screen || screen.hidden || !activeKind) return;
    if (activeKind === 'support') renderSupport();
    else if (activeKind === 'help') renderHelp();
    else if (activeKind === 'legal') renderLegal();
    else if (activeKind === 'about') renderAbout($('#moreScreen [data-open="about"]'));
    else if (activeKind === 'pro') renderPro('language_change');
  });

  window.addEventListener('bearagnostic:screenchange', (event) => {
    if (event.detail?.screen !== 'ba-detail' && screen && activeKind) {
      screen.hidden = true;
      screen.classList.remove('is-active');
      clearDetailContent();
      activeKind = null;
    }
  });

  addStyles();
  ensureScreen();
})();
