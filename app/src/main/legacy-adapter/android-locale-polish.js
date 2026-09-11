(() => {
  'use strict';

  const BUILD = 46;
  const byId = (id) => document.getElementById(id);
  let refreshQueued = false;

  function language() {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    if (value.startsWith('th')) return 'th';
    if (value.startsWith('ja')) return 'ja';
    return 'en';
  }

  function ensureStyle() {
    if (byId('androidLocalePolish46Style')) return;
    const style = document.createElement('style');
    style.id = 'androidLocalePolish46Style';
    style.textContent = `
      /* B46 — locale-safe geometry. Secondary headers grow with their real text. */
      #privacyScreen.is-active:not([hidden]){
        display:grid!important;
        grid-template-rows:auto minmax(0,1fr)!important;
        row-gap:clamp(8px,1.2dvh,12px)!important;
        overflow:hidden!important;
      }
      #privacyScreen .settings-title-row{
        height:auto!important;
        min-height:56px!important;
        align-items:flex-start!important;
        gap:12px!important;
      }
      #privacyScreen .settings-title-row>div{
        min-width:0!important;
        padding-top:2px!important;
      }
      #privacyScreen .settings-title-row h2{
        max-width:100%!important;
        margin:2px 0 0!important;
        line-height:1.12!important;
        overflow-wrap:break-word!important;
        word-break:normal!important;
        text-wrap:pretty;
      }
      #privacyScreen .settings-scroll{
        height:auto!important;
        min-height:0!important;
        padding-top:0!important;
      }

      /* Privacy is a trust surface. The shield must read immediately, not fade into the card. */
      #privacyScreen .privacy-principle-card__icon{
        width:48px!important;
        height:48px!important;
        border-radius:16px!important;
        color:#fff!important;
        background:linear-gradient(145deg,#65e3c7 0%,#22c5a5 52%,#0b987e 100%)!important;
        border:1px solid rgba(255,255,255,.90)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.78),inset 0 -8px 14px rgba(5,104,84,.13),0 8px 18px rgba(26,137,113,.18)!important;
      }
      #privacyScreen .privacy-principle-card__icon::before{
        background:linear-gradient(180deg,rgba(255,255,255,.72),rgba(255,255,255,.06))!important;
        opacity:.72!important;
      }
      #privacyScreen .privacy-principle-card__icon svg{
        width:25px!important;
        height:25px!important;
        fill:none!important;
        stroke:#fff!important;
        stroke-width:2.05!important;
        filter:drop-shadow(0 2px 2px rgba(5,84,70,.24))!important;
      }

      /* Legal uses a stronger slate-blue glass tile so the document glyph is unmistakable. */
      #baLegalRow .soft-icon{
        width:46px!important;
        height:46px!important;
        border-radius:15px!important;
        color:#fff!important;
        background:linear-gradient(145deg,#8fc9e5 0%,#5aa3ca 50%,#397a9f 100%)!important;
        border:1px solid rgba(255,255,255,.88)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.76),inset 0 -7px 13px rgba(40,92,124,.14),0 8px 18px rgba(52,101,132,.17)!important;
      }
      #baLegalRow .soft-icon::before{
        background:linear-gradient(180deg,rgba(255,255,255,.72),rgba(255,255,255,.07))!important;
        opacity:.72!important;
      }
      #baLegalRow .soft-icon svg{
        width:25px!important;
        height:25px!important;
        fill:none!important;
        stroke:#fff!important;
        stroke-width:2!important;
        filter:drop-shadow(0 2px 2px rgba(34,73,98,.26))!important;
      }

      /* Shared multilingual text safety. Never solve expansion by shrinking critical copy. */
      #homeScreen .home-hero h1,
      #homeScreen .editorial-card blockquote,
      #privacyScreen .settings-title-row h2,
      #privacyScreen .privacy-principle-card__copy,
      #moreScreen .setting-link strong,
      #moreScreen .setting-link small{
        overflow-wrap:break-word;
        word-break:normal;
      }

      /* English keeps the editorial character but receives more breathing room. */
      html[lang^="en"] #homeScreen .home-hero h1{
        line-height:1.20!important;
      }
      html[lang^="en"] #homeScreen .editorial-card blockquote{
        line-height:1.30!important;
      }

      /* Thai: native reading rhythm, taller line boxes, no faux-tight Latin tracking. */
      html[lang^="th"] #homeScreen .home-hero__copy{
        width:46%!important;
      }
      html[lang^="th"] #homeScreen .home-hero h1{
        font-size:clamp(18px,4.95vw,21.5px)!important;
        line-height:1.34!important;
        letter-spacing:0!important;
      }
      html[lang^="th"] #homeScreen .home-hero h1 em{
        white-space:nowrap!important;
      }
      html[lang^="th"] #homeScreen .home-hero h1 br+em{
        top:.12em!important;
      }
      html[lang^="th"] #homeScreen .editorial-card__quote{
        width:58%!important;
        padding-left:clamp(14px,3.8vw,20px)!important;
      }
      html[lang^="th"] #homeScreen .editorial-card blockquote{
        font-size:clamp(14.5px,4.05vw,18px)!important;
        line-height:1.42!important;
        letter-spacing:0!important;
        text-wrap:pretty;
      }
      html[lang^="th"] #homeScreen .editorial-card small{
        margin-top:7px!important;
        line-height:1.3!important;
      }
      html[lang^="th"] #privacyScreen .settings-title-row h2{
        font-family:var(--ui)!important;
        font-size:clamp(23px,6.35vw,28px)!important;
        font-weight:620!important;
        letter-spacing:0!important;
        line-height:1.30!important;
      }
      html[lang^="th"] #privacyScreen .settings-title-row>div>span{
        line-height:1.35!important;
      }
      html[lang^="th"] #privacyScreen .privacy-principle-card>div>strong{
        font-size:15.5px!important;
        line-height:1.38!important;
        letter-spacing:0!important;
      }
      html[lang^="th"] #privacyScreen .privacy-principle-card__copy{
        font-size:11.8px!important;
        line-height:1.72!important;
      }
      html[lang^="th"] #privacyScreen .privacy-principle-card__copy p{
        margin-bottom:10px!important;
      }
      html[lang^="th"] .setting-link strong,
      html[lang^="th"] .setting-link small,
      html[lang^="th"] .tool-card strong,
      html[lang^="th"] .tool-card small,
      html[lang^="th"] .nav-button span{
        letter-spacing:0!important;
        line-height:1.34!important;
      }

      /* Japanese: system-native glyph rhythm and comfortable vertical metrics. */
      html[lang^="ja"] #homeScreen .home-hero h1{
        font-family:var(--ui)!important;
        font-size:clamp(16.5px,4.55vw,20px)!important;
        font-weight:540!important;
        line-height:1.38!important;
        letter-spacing:.005em!important;
      }
      html[lang^="ja"] #homeScreen .editorial-card blockquote{
        font-family:var(--ui)!important;
        font-style:normal!important;
        line-height:1.46!important;
        letter-spacing:.005em!important;
      }
      html[lang^="ja"] #privacyScreen .settings-title-row h2{
        font-family:var(--ui)!important;
        font-size:clamp(23px,6.2vw,28px)!important;
        font-weight:580!important;
        line-height:1.30!important;
        letter-spacing:0!important;
      }
      html[lang^="ja"] #privacyScreen .privacy-principle-card__copy{
        line-height:1.68!important;
      }

      /* Narrow-device guard: preserve readability and let headers grow vertically. */
      @media(max-width:360px){
        #privacyScreen.is-active:not([hidden]){row-gap:8px!important}
        #privacyScreen .settings-title-row{gap:10px!important}
        html[lang^="th"] #privacyScreen .settings-title-row h2{font-size:22px!important;line-height:1.30!important}
        html[lang^="th"] #homeScreen .home-hero h1{font-size:17px!important;line-height:1.34!important}
        html[lang^="th"] #homeScreen .editorial-card blockquote{font-size:13.8px!important;line-height:1.42!important}
        html[lang^="ja"] #privacyScreen .settings-title-row h2{font-size:22px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function strengthenSemanticIcons() {
    const legalIcon = document.querySelector('#baLegalRow .soft-icon');
    if (legalIcon) legalIcon.setAttribute('data-b46-contrast', 'strong');
    const privacyIcon = document.querySelector('#privacyScreen .privacy-principle-card__icon');
    if (privacyIcon) privacyIcon.setAttribute('data-b46-contrast', 'strong');
  }

  function protectPrivacyGeometry() {
    const screen = byId('privacyScreen');
    const title = screen?.querySelector('.settings-title-row');
    const scroll = screen?.querySelector('.settings-scroll');
    if (!screen || !title || !scroll) return;
    screen.dataset.b46LocaleSafe = 'true';
    title.style.removeProperty('height');
    scroll.style.removeProperty('height');
  }

  function refresh() {
    ensureStyle();
    document.documentElement.dataset.b46Language = language();
    strengthenSemanticIcons();
    protectPrivacyGeometry();
  }

  function queueRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(() => {
      refreshQueued = false;
      refresh();
    });
  }

  window.addEventListener('bearagnostic:languagechange', queueRefresh);
  window.addEventListener('bearagnostic:screenchange', queueRefresh);
  window.addEventListener('resize', queueRefresh, { passive: true });

  const observer = new MutationObserver(queueRefresh);
  if (document.body) observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, { once: true });
  else refresh();

  window.BearagnosticLocalePolish = Object.freeze({ build: BUILD, refresh, language });
})();
