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

  const FEATURE_ICONS = Object.freeze([
    '<path d="m12 3 8 4-8 4-8-4z"/><path d="m4 12 8 4 8-4M4 17l8 4 8-4"/>',
    '<path d="M4 6h10M18 6h2M10 12h10M4 12h2M4 18h10M18 18h2"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>',
    '<rect x="4" y="5" width="16" height="14" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="m6.8 16 3.2-3 2.3 2 2.4-2.6 2.7 3.6"/>',
    '<path d="M5 19V9M10 19V5M15 19v-7M20 19V3"/><path d="M3 19h19"/>',
    '<path d="M7 7h10M9 7V5h6v2M8 10l.7 8h6.6l.7-8"/><path d="m10.2 13 1.2 1.2 2.5-2.5"/>'
  ]);
  const ACTION_ICONS = Object.freeze({
    'help-report':'<path d="M6 3h9l3 3v15H6z"/><path d="M9 10h6M9 14h4"/><path d="M14.5 4v3H18"/>',
    'help-feedback':'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    'help-diagnostics':'<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.1 2.2 3.2 4.9 3.2 8S14.1 17.8 12 20c-2.1-2.2-3.2-4.9-3.2-8S9.9 6.2 12 4"/>'
  });

  const COPY = Object.freeze({
    en: {
      back:'Back',
      supportFallbackKicker:'INDEPENDENT', supportFallbackTitle:'Support Bearagnostic', supportIntro:'Keep Bearagnostic moving forward.',
      helpFallbackKicker:'SUPPORT', helpFallbackTitle:'Help & Feedback', helpIntro:'How can Dr. Bear help?',
      proFallbackKicker:'PLAN', proFallbackTitle:'Bearagnostic Pro', proIntro:'Go deeper. See more. Stay in control.',
      legalFallbackKicker:'INFORMATION', legalFallbackTitle:'Legal & Licenses', legalIntro:'Clear ownership. Clear terms.',
      aboutFallbackKicker:'APP', aboutFallbackTitle:'About Bearagnostic',
      supportAction:'Support on Ko-fi', supportActionSub:'Ko-fi · Benedict Interactive',
      helpReport:'Report a Problem', helpReportSub:'Tell us what happened inside Bearagnostic.',
      helpFeedback:'Send Feedback', helpFeedbackSub:'Share an idea or tell us what could be better.',
      helpDiagnostics:'Copy Diagnostic Info', helpDiagnosticsSub:'Copy non-sensitive app and device details.',
      diagnosticsCopied:'Diagnostic info copied.', copyFailed:'Could not copy automatically.',
      proAvailable:'Available in the current app', proSafety:'Safety & ownership',
      aboutPrivacy:'Selected files are analyzed locally by Bearagnostic and are not uploaded by the app in the current version.'
    },
    th: {
      back:'ย้อนกลับ',
      supportFallbackKicker:'การพัฒนาอิสระ', supportFallbackTitle:'สนับสนุน Bearagnostic', supportIntro:'ช่วยให้ Bearagnostic เดินหน้าต่อไป',
      helpFallbackKicker:'ช่วยเหลือ', helpFallbackTitle:'ช่วยเหลือและข้อเสนอแนะ', helpIntro:'ให้ Dr. Bear ช่วยอะไรดี?',
      proFallbackKicker:'แผน', proFallbackTitle:'Bearagnostic Pro', proIntro:'ตรวจได้ลึกขึ้น เห็นมากขึ้น และยังควบคุมทุกอย่างเอง',
      legalFallbackKicker:'ข้อมูล', legalFallbackTitle:'กฎหมายและสิทธิ์การใช้งาน', legalIntro:'สิทธิ์ชัดเจน เงื่อนไขชัดเจน',
      aboutFallbackKicker:'แอป', aboutFallbackTitle:'เกี่ยวกับ Bearagnostic',
      supportAction:'สนับสนุนผ่าน Ko-fi', supportActionSub:'Ko-fi · Benedict Interactive',
      helpReport:'แจ้งปัญหา', helpReportSub:'บอกเราว่าเกิดอะไรขึ้นภายใน Bearagnostic',
      helpFeedback:'ส่งข้อเสนอแนะ', helpFeedbackSub:'แบ่งปันไอเดียหรือสิ่งที่อยากให้เราปรับปรุง',
      helpDiagnostics:'คัดลอกข้อมูลวินิจฉัย', helpDiagnosticsSub:'คัดลอกข้อมูลแอปและอุปกรณ์ที่ไม่ละเอียดอ่อน',
      diagnosticsCopied:'คัดลอกข้อมูลทางเทคนิคแล้ว', copyFailed:'ไม่สามารถคัดลอกให้อัตโนมัติได้',
      proAvailable:'ความสามารถที่มีอยู่ในแอปตอนนี้', proSafety:'ความปลอดภัยและสิทธิ์การใช้งาน',
      aboutPrivacy:'ไฟล์ที่เลือกจะถูกวิเคราะห์บนอุปกรณ์โดย Bearagnostic และแอปเวอร์ชันปัจจุบันจะไม่อัปโหลดเนื้อหาไฟล์เหล่านั้น'
    },
    ja: {
      back:'戻る',
      supportFallbackKicker:'独立開発', supportFallbackTitle:'Bearagnostic を支援', supportIntro:'Bearagnostic の次の一歩を支える',
      helpFallbackKicker:'サポート', helpFallbackTitle:'ヘルプ・フィードバック', helpIntro:'Dr. Bear にご相談ください',
      proFallbackKicker:'プラン', proFallbackTitle:'Bearagnostic Pro', proIntro:'より深く確認し、もっと把握し、操作は自分の手に。',
      legalFallbackKicker:'情報', legalFallbackTitle:'法的情報とライセンス', legalIntro:'権利と条件を、分かりやすく。',
      aboutFallbackKicker:'アプリ', aboutFallbackTitle:'Bearagnostic について',
      supportAction:'Ko-fi で支援', supportActionSub:'Ko-fi · Benedict Interactive',
      helpReport:'問題を報告', helpReportSub:'Bearagnostic で起きたことをお知らせください。',
      helpFeedback:'フィードバックを送る', helpFeedbackSub:'アイデアや改善してほしい点を共有してください。',
      helpDiagnostics:'診断情報をコピー', helpDiagnosticsSub:'機密性のないアプリと端末の情報をコピーします。',
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
      #baUnifiedSettingsDetail{padding-top:clamp(8px,1.2dvh,14px);padding-bottom:clamp(8px,1.2dvh,14px);overflow:hidden;--ba-detail-accent:#25a9e6;--ba-detail-accent2:#765adf;--ba-detail-deep:#233a52}
      #baUnifiedSettingsDetail[data-detail-kind=help]{--ba-detail-accent:#7a5ce0;--ba-detail-accent2:#d8669b;--ba-detail-deep:#382d69}
      #baUnifiedSettingsDetail[data-detail-kind=pro]{--ba-detail-accent:#6759d7;--ba-detail-accent2:#2ca9e8;--ba-detail-deep:#322d70}
      #baUnifiedSettingsDetail[data-detail-kind=support]{--ba-detail-accent:#138fe8;--ba-detail-accent2:#28bfe9;--ba-detail-deep:#174a72}
      #baUnifiedSettingsDetail[data-detail-kind=legal]{--ba-detail-accent:#219bc7;--ba-detail-accent2:#3bb9df;--ba-detail-deep:#214d62}
      #baUnifiedSettingsDetail[data-detail-kind=about]{--ba-detail-accent:#d69820;--ba-detail-accent2:#25a7db;--ba-detail-deep:#63491d}

      #baUnifiedSettingsDetail .settings-title-row{align-items:flex-start!important;height:auto!important;min-height:70px!important;margin-bottom:16px!important}
      #baUnifiedSettingsDetail .settings-title-row>div:last-child{min-width:0!important;padding-top:5px!important}
      #baUnifiedSettingsDetail .settings-title-row span{display:block!important;color:var(--ba-detail-accent)!important;font-size:9.4px!important;line-height:1.15!important;font-weight:850!important;letter-spacing:.18em!important;text-transform:uppercase!important}
      #baUnifiedSettingsDetail .settings-title-row h2{margin:6px 0 0!important;font-size:clamp(28px,6.8vw,32px)!important;line-height:1.055!important;letter-spacing:-.037em!important;max-width:100%!important;white-space:normal!important;text-wrap:balance!important;overflow-wrap:normal!important}
      html[lang^=th] #baUnifiedSettingsDetail .settings-title-row span{letter-spacing:.035em!important;text-transform:none!important}
      html[lang^=ja] #baUnifiedSettingsDetail .settings-title-row span{letter-spacing:.10em!important;text-transform:none!important}
      html[lang^=th] #baUnifiedSettingsDetail .settings-title-row h2{letter-spacing:-.02em!important;line-height:1.14!important}
      html[lang^=ja] #baUnifiedSettingsDetail .settings-title-row h2{letter-spacing:-.025em!important;line-height:1.12!important}
      #baUnifiedSettingsDetail .settings-scroll{padding-top:0!important}

      #baUnifiedSettingsDetail .ba-detail-principle{position:relative;margin-bottom:14px!important;border:1px solid rgba(112,140,170,.11)!important;box-shadow:0 14px 32px rgba(68,91,124,.075),inset 0 1px 0 rgba(255,255,255,.95)!important;overflow:hidden}
      #baUnifiedSettingsDetail[data-detail-kind=pro] .ba-detail-principle{background:linear-gradient(135deg,rgba(250,248,255,.98),rgba(238,250,255,.96))!important;border-color:rgba(105,91,211,.13)!important}
      #baUnifiedSettingsDetail[data-detail-kind=help] .ba-detail-principle{background:linear-gradient(135deg,rgba(250,247,255,.98),rgba(247,251,255,.97))!important;border-color:rgba(126,91,220,.12)!important}
      #baUnifiedSettingsDetail[data-detail-kind=support] .ba-detail-principle{background:linear-gradient(135deg,rgba(242,252,255,.98),rgba(250,252,255,.97))!important;border-color:rgba(27,159,228,.13)!important}
      #baUnifiedSettingsDetail[data-detail-kind=legal] .ba-detail-principle{background:linear-gradient(135deg,rgba(242,251,255,.98),rgba(250,253,255,.97))!important;border-color:rgba(38,158,201,.12)!important}
      #baUnifiedSettingsDetail[data-detail-kind=about] .ba-detail-principle{background:linear-gradient(135deg,rgba(255,250,239,.98),rgba(246,252,255,.97))!important;border-color:rgba(215,154,36,.13)!important}
      #baUnifiedSettingsDetail .ba-detail-principle>div>strong{display:block!important;color:var(--ba-detail-deep)!important;font-size:14.3px!important;line-height:1.28!important;letter-spacing:-.015em!important}
      #baUnifiedSettingsDetail .privacy-principle-card__copy{margin-top:6px!important;color:#697d91!important;font-size:11px!important;line-height:1.54!important}
      #baUnifiedSettingsDetail .privacy-principle-card__copy p{margin:0!important}
      #baUnifiedSettingsDetail .privacy-principle-card__copy p+p{margin-top:8px!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon{flex:none;box-shadow:0 10px 22px rgba(56,89,132,.13),inset 0 1px 0 rgba(255,255,255,.34)!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon.is-support{background:linear-gradient(145deg,#64d8fa 0%,#2ca9ec 48%,#1686e2 100%)!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon.is-help{background:linear-gradient(145deg,#c6a6ff 0%,#956feb 48%,#6c4dd7 100%)!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon.is-pro{background:linear-gradient(145deg,#9d8df1 0%,#6f60d8 48%,#3d94df 100%)!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon.is-legal{background:linear-gradient(145deg,#83ddf3 0%,#3fb7d9 48%,#248dbb 100%)!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon.is-about{background:linear-gradient(145deg,#ffe7a0 0%,#ffc657 48%,#e89a15 100%)!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon svg{width:23px!important;height:23px!important;fill:none!important;stroke:#fff!important;stroke-width:1.75!important;stroke-linecap:round;stroke-linejoin:round}
      #baUnifiedSettingsDetail .ba-detail-principle__icon .ba-detail-kofi-cup{fill:none!important;stroke:#fff!important;stroke-width:1.75!important}
      #baUnifiedSettingsDetail .ba-detail-principle__icon .ba-detail-kofi-heart{fill:#ff5f73!important;stroke:#fff!important;stroke-width:.42!important}

      #baUnifiedSettingsDetail .settings-group>h3{color:var(--ba-detail-accent)!important;letter-spacing:.14em!important;font-size:9.8px!important;line-height:1.2!important;font-weight:850!important;text-transform:uppercase!important}
      html[lang^=th] #baUnifiedSettingsDetail .settings-group>h3{letter-spacing:.035em!important;text-transform:none!important}
      html[lang^=ja] #baUnifiedSettingsDetail .settings-group>h3{letter-spacing:.08em!important;text-transform:none!important}

      #baUnifiedSettingsDetail .ba-detail-action-group{margin-top:12px!important;overflow:hidden!important;background:linear-gradient(145deg,rgba(255,255,255,.95),rgba(246,249,255,.91))!important;border:1px solid rgba(111,135,168,.10)!important;box-shadow:0 12px 28px rgba(66,92,125,.06),inset 0 1px 0 rgba(255,255,255,.96)!important}
      #baUnifiedSettingsDetail[data-detail-kind=help] .ba-detail-action-group{background:linear-gradient(145deg,rgba(255,255,255,.97),rgba(249,245,255,.94) 52%,rgba(243,250,255,.94))!important;border-color:rgba(126,91,220,.10)!important}
      #baUnifiedSettingsDetail[data-detail-kind=support] .ba-detail-action-group{background:linear-gradient(145deg,rgba(255,255,255,.97),rgba(240,250,255,.94))!important;border-color:rgba(24,145,232,.10)!important}
      #baUnifiedSettingsDetail .ba-detail-action-group .setting-link{display:grid!important;grid-template-columns:minmax(0,1fr) 18px!important;gap:10px!important;align-items:center!important;box-shadow:none!important;border:0!important;border-top:1px solid rgba(99,124,153,.12)!important;border-radius:0!important;background:transparent!important;padding:11px 2px!important;min-height:58px!important;text-align:left!important}
      #baUnifiedSettingsDetail .ba-detail-action-group .setting-link.has-icon{grid-template-columns:38px minmax(0,1fr) 18px!important;gap:11px!important}
      #baUnifiedSettingsDetail .ba-detail-action-group .setting-link:first-child{border-top:0!important}
      #baUnifiedSettingsDetail .ba-detail-action-group .setting-link>span.ba-action-copy{display:flex!important;flex-direction:column!important;min-width:0!important}
      #baUnifiedSettingsDetail .ba-detail-action-group .setting-link strong{font-size:13.4px!important;line-height:1.25!important;color:#263c54!important;letter-spacing:-.012em!important}
      #baUnifiedSettingsDetail .ba-detail-action-group .setting-link small{font-size:10.4px!important;line-height:1.4!important;color:#758699!important;margin-top:4px!important}
      #baUnifiedSettingsDetail .ba-detail-action-group .setting-link b{color:var(--ba-detail-accent)!important;font-size:19px!important;font-weight:500!important;opacity:.78!important}
      #baUnifiedSettingsDetail .ba-action-icon{width:35px;height:35px;border-radius:12px;display:grid;place-items:center;color:#fff;box-shadow:0 7px 16px rgba(62,83,125,.13),inset 0 1px 0 rgba(255,255,255,.34)}
      #baUnifiedSettingsDetail .ba-action-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      #baUnifiedSettingsDetail .ba-action-icon.action-report{background:linear-gradient(145deg,#ff9e91,#ec6583)}
      #baUnifiedSettingsDetail .ba-action-icon.action-feedback{background:linear-gradient(145deg,#ae91f4,#795ce0)}
      #baUnifiedSettingsDetail .ba-action-icon.action-diagnostics{background:linear-gradient(145deg,#61d2f1,#278ee1)}

      #baUnifiedSettingsDetail .ba-pro-feature-group{padding:14px 16px 5px!important;background:linear-gradient(145deg,rgba(255,255,255,.96),rgba(247,244,255,.94) 52%,rgba(238,250,255,.95))!important;border:1px solid rgba(103,89,211,.12)!important;box-shadow:0 14px 30px rgba(73,77,139,.07),inset 0 1px 0 rgba(255,255,255,.98)!important;overflow:hidden!important}
      #baUnifiedSettingsDetail .ba-pro-feature-group>h3{margin:0 0 3px!important;color:#6759d7!important}
      #baUnifiedSettingsDetail .ba-feature-row{display:grid;grid-template-columns:40px minmax(0,1fr);gap:12px;align-items:center;padding:13px 0;border-top:1px solid rgba(97,111,151,.11)}
      #baUnifiedSettingsDetail .ba-pro-feature-group>h3+.ba-feature-row{border-top:0!important}
      #baUnifiedSettingsDetail .ba-feature-icon{width:37px;height:37px;border-radius:13px;display:grid;place-items:center;color:#fff;box-shadow:0 8px 18px rgba(61,79,130,.14),inset 0 1px 0 rgba(255,255,255,.34)}
      #baUnifiedSettingsDetail .ba-feature-icon svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}
      #baUnifiedSettingsDetail .ba-feature-icon.tone-0{background:linear-gradient(145deg,#9a88ee,#6658d8)}
      #baUnifiedSettingsDetail .ba-feature-icon.tone-1{background:linear-gradient(145deg,#6cd6ee,#2b99df)}
      #baUnifiedSettingsDetail .ba-feature-icon.tone-2{background:linear-gradient(145deg,#ff9db4,#c96ad5)}
      #baUnifiedSettingsDetail .ba-feature-icon.tone-3{background:linear-gradient(145deg,#55cfbd,#258fc4)}
      #baUnifiedSettingsDetail .ba-feature-icon.tone-4{background:linear-gradient(145deg,#7bd9c3,#37a889)}
      #baUnifiedSettingsDetail .ba-feature-copy{min-width:0}
      #baUnifiedSettingsDetail .ba-feature-copy strong{display:block;color:#293d55;font-size:13.2px;line-height:1.27;letter-spacing:-.012em}
      #baUnifiedSettingsDetail .ba-feature-copy p{margin:5px 0 0;color:#718398;font-size:10.35px;line-height:1.47}

      #baUnifiedSettingsDetail .ba-detail-section{padding:11px 1px;border-top:1px solid rgba(95,121,150,.11)}
      #baUnifiedSettingsDetail .ba-detail-section:first-child{border-top:0;padding-top:4px}
      #baUnifiedSettingsDetail .ba-detail-section>strong{display:block;font-size:13.3px;line-height:1.3;color:#263d55}
      #baUnifiedSettingsDetail .ba-detail-section>p{margin:6px 0 0;font-size:10.55px;line-height:1.54;color:#718398;white-space:normal}
      #baUnifiedSettingsDetail .ba-legal-group{background:linear-gradient(145deg,rgba(255,255,255,.96),rgba(242,250,254,.94))!important;border:1px solid rgba(40,156,199,.10)!important;box-shadow:0 12px 28px rgba(55,91,116,.06),inset 0 1px 0 rgba(255,255,255,.96)!important}
      #baUnifiedSettingsDetail .ba-legal-group .ba-detail-section>strong{position:relative;padding-left:10px}
      #baUnifiedSettingsDetail .ba-legal-group .ba-detail-section>strong::before{content:"";position:absolute;left:0;top:.19em;width:3px;height:1.02em;border-radius:999px;background:linear-gradient(180deg,#42c1df,#278dbc)}
      #baUnifiedSettingsDetail .ba-trust-group{background:linear-gradient(145deg,rgba(255,255,255,.96),rgba(244,252,249,.94))!important;border:1px solid rgba(37,154,128,.09)!important;box-shadow:0 12px 28px rgba(49,91,91,.05),inset 0 1px 0 rgba(255,255,255,.96)!important}

      #baUnifiedSettingsDetail .ba-detail-footnote{margin:10px 6px 0;font-size:9.35px;line-height:1.48;color:#8998a8}
      #baUnifiedSettingsDetail .ba-detail-footnote strong{color:var(--ba-detail-deep);font-weight:720}
      #baUnifiedSettingsDetail .ba-detail-status{display:inline-flex!important;align-items:center!important;margin-top:10px!important;height:24px!important;padding:0 9px!important;border-radius:999px!important;background:linear-gradient(145deg,#e9f9f4,#eefbf8)!important;border:1px solid rgba(35,150,121,.10)!important;color:#24846e!important;font-size:8px!important;font-weight:850!important;letter-spacing:.07em!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.92)!important}

      #baUnifiedSettingsDetail .ba-pro-purchase{margin:0!important;padding:11px 1px!important;border-radius:0!important;background:transparent!important;border:0!important;border-top:1px solid rgba(95,121,150,.11)!important;box-shadow:none!important}
      #baUnifiedSettingsDetail .ba-pro-purchase strong{font-size:13.3px!important;color:#263d55!important}
      #baUnifiedSettingsDetail .ba-pro-purchase small{font-size:10.55px!important;line-height:1.45!important;color:#718398!important}
      #baUnifiedSettingsDetail .ba-billing-actions{margin-top:9px!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:7px!important}
      #baUnifiedSettingsDetail .ba-pro-primary,#baUnifiedSettingsDetail .ba-billing-secondary{min-height:40px!important;border-radius:13px!important;font-size:10.5px!important}
      #baUnifiedSettingsDetail .ba-pro-debug{margin:10px 0 0!important;border-radius:16px!important}

      #baUnifiedSettingsDetail .ba-detail-about-appicon{padding:0!important;background:transparent!important;overflow:hidden!important;box-shadow:0 10px 22px rgba(76,89,106,.12)!important}
      #baUnifiedSettingsDetail .ba-detail-about-appicon::before{display:none!important}
      #baUnifiedSettingsDetail .ba-detail-about-appicon img{width:100%;height:100%;object-fit:cover;border-radius:inherit}

      @media(max-width:360px){
        #baUnifiedSettingsDetail .settings-title-row h2{font-size:29px!important}
        #baUnifiedSettingsDetail .privacy-principle-card{padding:14px!important;grid-template-columns:43px minmax(0,1fr)!important;gap:11px!important}
        #baUnifiedSettingsDetail .privacy-principle-card__icon{width:43px!important;height:43px!important}
        #baUnifiedSettingsDetail .ba-pro-feature-group{padding-inline:14px!important}
        #baUnifiedSettingsDetail .ba-feature-row{grid-template-columns:37px minmax(0,1fr);gap:10px}
      }
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

  function actionGroup(actions, options = {}) {
    const showIcons = options.showIcons !== false;
    const extraClass = options.extraClass ? ` ${esc(options.extraClass)}` : '';
    return `<section class="settings-group ba-detail-action-group${extraClass}">${actions.map((a) => {
      const iconPath = showIcons ? ACTION_ICONS[a.action] : '';
      const iconClass = a.action === 'help-report' ? 'action-report' : a.action === 'help-feedback' ? 'action-feedback' : 'action-diagnostics';
      const iconHtml = iconPath ? `<span class="ba-action-icon ${iconClass}" aria-hidden="true"><svg viewBox="0 0 24 24">${iconPath}</svg></span>` : '';
      return `<button class="setting-link${iconPath ? ' has-icon' : ''}" type="button" data-ba-detail-action="${esc(a.action)}">${iconHtml}<span class="ba-action-copy"><strong>${esc(a.title)}</strong>${a.sub ? `<small>${esc(a.sub)}</small>` : ''}</span><b>›</b></button>`;
    }).join('')}</section>`;
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
    let lead = '';
    let panelBody = '';
    let provider = t.supportActionSub;
    let providerBody = '';
    let boundary = '';
    let signoff = '';
    try {
      window.BearagnosticSupport?.open?.();
      const overlay = byId('androidPremiumSupportOverlay');
      if (overlay) {
        lead = $('.ba-support-lead', overlay)?.textContent?.trim() || '';
        panelBody = $('.ba-support-surface-copy p', overlay)?.textContent?.trim() || '';
        provider = $('.ba-support-action-copy small', overlay)?.textContent?.trim() || provider;
        providerBody = $('.ba-support-provider-note', overlay)?.textContent?.trim() || '';
        boundary = $('.ba-support-boundary', overlay)?.textContent?.trim() || '';
        signoff = $('.ba-support-signoff', overlay)?.textContent?.trim() || '';
      }
      closeLegacyOverlay('#androidPremiumSupportOverlay', '[data-ba-support-close]');
    } catch (_) {}
    const body = `${lead ? `<p>${esc(lead)}</p>` : ''}${panelBody ? `<p>${esc(panelBody)}</p>` : ''}`;
    const html = principle('support', t.supportIntro, body) + actionGroup(
      [{action:'support-kofi', title:t.supportAction, sub:provider}],
      {showIcons:false, extraClass:'ba-support-action-group'}
    ) +
      (providerBody ? `<p class="ba-detail-footnote">${esc(providerBody)}</p>` : '') +
      (boundary ? `<p class="ba-detail-footnote">${esc(boundary)}</p>` : '') +
      (signoff ? `<p class="ba-detail-footnote"><strong>${esc(signoff)}</strong></p>` : '');
    showDetail('support', t.supportFallbackKicker, t.supportFallbackTitle, html);
  }

  function renderHelp() {
    const t = c();
    let lead = '';
    const actions = [];
    try {
      window.BearagnosticHelp?.openHub?.();
      const overlay = byId('helpFeedbackOverlay');
      if (overlay) {
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
    const intro = principle('help', t.helpIntro, lead ? `<p>${esc(lead)}</p>` : '');
    const html = intro + actionGroup(actions.length ? actions : [
      {action:'help-report', title:t.helpReport, sub:t.helpReportSub},
      {action:'help-feedback', title:t.helpFeedback, sub:t.helpFeedbackSub},
      {action:'help-diagnostics', title:t.helpDiagnostics, sub:t.helpDiagnosticsSub}
    ]);
    showDetail('help', t.helpFallbackKicker, t.helpFallbackTitle, html);
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
    const html = principleHtml + `<section class="settings-group ba-legal-group">${sections}</section>` + (data.footer ? `<p class="ba-detail-footnote">${esc(data.footer)}</p>` : '');
    showDetail('legal', c().legalFallbackKicker, c().legalFallbackTitle, html);
  }

  function renderAbout(row) {
    const t = c();
    let privacy = t.aboutPrivacy;
    let location = 'Bangkok, Thailand';
    try {
      bypassCapture = true;
      row?.click?.();
      const info = byId('infoSheet');
      if (info && !info.hidden) {
        privacy = $('.info-content p', info)?.textContent?.trim() || privacy;
        const spans = $$('.about-sheet-brand span', info).map((node) => node.textContent?.trim()).filter(Boolean);
        if (spans[1]) location = spans[1].replace(/^Benedict Interactive\s*·\s*/i, '');
      }
      byId('closeInfo')?.click?.();
    } catch (_) {} finally { bypassCapture = false; }
    const build = $('.app-footer__build')?.textContent?.trim() || row?.querySelector('small')?.textContent?.trim() || '';
    const brandCopy = `${build ? `<p><strong>${esc(build)}</strong></p>` : ''}<p>${esc(location)}</p><p>${esc(privacy)}</p>`;
    const html = `<section class="privacy-principle-card ba-detail-principle ba-detail-about-principle"><span class="privacy-principle-card__icon ba-detail-about-appicon" aria-hidden="true"><img src="./assets/icons/app-icon-192.png" alt=""></span><div><strong>Benedict Interactive</strong><div class="privacy-principle-card__copy">${brandCopy}</div></div></section>`;
    showDetail('about', t.aboutFallbackKicker, t.aboutFallbackTitle, html);
  }

  function renderPro(source = 'more') {
    const t = c();
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

    const introBody = `${lead ? `<p>${esc(lead)}</p>` : ''}${status ? `<span class="ba-detail-status is-pro">${esc(status)}</span>` : ''}`;
    const intro = principle('pro', t.proIntro, introBody);
    const featureSections = features.map((f, index) => {
      const icon = FEATURE_ICONS[index] || FEATURE_ICONS[0];
      return `<article class="ba-feature-row"><span class="ba-feature-icon tone-${index % 5}" aria-hidden="true"><svg viewBox="0 0 24 24">${icon}</svg></span><div class="ba-feature-copy"><strong>${esc(f.title)}</strong><p>${esc(f.body)}</p></div></article>`;
    }).join('');
    const trustSections = trust.map((f) => `<article class="ba-detail-section"><strong>${esc(f.title)}</strong><p>${esc(f.body)}</p></article>`).join('');
    const html = intro +
      (featureSections ? `<section class="settings-group ba-pro-feature-group"><h3>${esc(t.proAvailable)}</h3>${featureSections}</section>` : '') +
      (trustSections || purchaseNode || debugNode ? `<section class="settings-group ba-trust-group" id="baUnifiedProActions"><h3>${esc(t.proSafety)}</h3>${trustSections}</section>` : '');
    showDetail('pro', t.proFallbackKicker, t.proFallbackTitle, html);
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
