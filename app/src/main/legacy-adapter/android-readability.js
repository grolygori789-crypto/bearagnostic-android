(() => {
  'use strict';

  const STYLE_ID = 'androidReadability27Style';
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    :root{
      --ba-readable-ink:#1c3046;
      --ba-readable-body:#53687c;
      --ba-readable-muted:#687d90;
      --ba-readable-soft:#778a9b;
    }

    html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
    body{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}

    /* -------------------------------------------------------
       HOME — preserve the approved zero-scroll composition,
       but stop using faint micro-copy for functional labels.
       ------------------------------------------------------- */
    .checkup-cta__copy small{
      font-size:clamp(10.5px,2.9vw,13px)!important;
      line-height:1.25!important;
      color:rgba(255,255,255,.92)!important;
    }
    .tool-card strong{
      font-size:clamp(11px,3vw,13.5px)!important;
      line-height:1.12!important;
      color:#24374c!important;
    }
    .tool-card small{
      font-size:clamp(9.5px,2.45vw,11px)!important;
      line-height:1.22!important;
      color:#6f7f8f!important;
      font-weight:530!important;
    }
    .health-card__copy small{
      font-size:clamp(10.5px,2.8vw,12.5px)!important;
      line-height:1.3!important;
      color:#63778a!important;
    }
    .editorial-card small{
      font-size:clamp(9px,2.3vw,10.5px)!important;
      line-height:1.25!important;
      color:#65778a!important;
    }
    .nav-button span{
      font-size:clamp(9.5px,2.65vw,12px)!important;
      line-height:1.15!important;
      color:currentColor!important;
      font-weight:590!important;
    }

    /* -------------------------------------------------------
       SECONDARY SCREENS — utility / tools / more / settings.
       ------------------------------------------------------- */
    .utility-head>span,.panel-head>span,.settings-title-row>div>span{
      font-size:10px!important;
      line-height:1.2!important;
      color:#58758e!important;
      font-weight:760!important;
    }
    .utility-head p,.panel-head p{
      font-size:13px!important;
      line-height:1.5!important;
      color:#5c7083!important;
    }
    .utility-list strong,.setting-link strong{
      font-size:14px!important;
      line-height:1.24!important;
      color:#22374d!important;
    }
    .utility-list small,.setting-link small{
      font-size:12px!important;
      line-height:1.42!important;
      color:#64778a!important;
      margin-top:4px!important;
    }
    .more-screen .native-more-sub{
      font-size:12.5px!important;
      line-height:1.48!important;
      color:#5a7084!important;
      margin-top:6px!important;
    }
    .settings-group h3{
      font-size:11.5px!important;
      line-height:1.25!important;
      color:#5d748a!important;
      letter-spacing:.1em!important;
    }
    .setting-row strong{font-size:14px!important;line-height:1.25!important;color:#22384e!important}
    .setting-row small{font-size:11.5px!important;line-height:1.42!important;color:#63778a!important;margin-top:4px!important}
    .segmented button{font-size:11px!important;line-height:1.15!important}
    .setting-row select{font-size:11.5px!important}
    .about-box strong{font-size:15.5px!important;line-height:1.24!important}
    .about-box span{font-size:11px!important;line-height:1.3!important;color:#61758a!important}
    .about-box small{font-size:11.5px!important;line-height:1.48!important;color:#66798b!important;margin-top:7px!important}

    /* Preferences / Privacy native extensions. */
    .preferences-intro{
      font-size:12.5px!important;
      line-height:1.52!important;
      color:#5d7185!important;
      margin-top:6px!important;
    }
    .privacy-principle-card>div>strong{font-size:15px!important;line-height:1.25!important;color:#183049!important}
    .privacy-principle-card__copy{font-size:12.5px!important;line-height:1.6!important;color:#596f83!important}
    .about-sheet-brand span{font-size:11.5px!important;line-height:1.35!important;color:#63768a!important}
    .native-pref-card__head{padding:14px 15px 11px!important}
    .native-pref-card__head strong{font-size:14px!important;line-height:1.25!important;color:#1b3148!important}
    .native-pref-card__head small{font-size:11.5px!important;line-height:1.48!important;color:#5d7184!important;margin-top:4px!important}
    .native-pref-row{min-height:46px!important}
    .native-pref-row span{font-size:12px!important;line-height:1.3!important;color:#40566c!important}
    .native-pref-row b{font-size:11.5px!important;line-height:1.3!important;color:#2c7fae!important}
    .native-pref-row b.slate{color:#536b80!important}
    .ba-plan-cta{font-size:10.5px!important;min-height:34px!important}

    /* Help & Feedback / information sheets. */
    .bx-eyebrow{font-size:10px!important;line-height:1.2!important;color:#147fc5!important}
    .bx-lead{font-size:13px!important;line-height:1.58!important;color:#596f84!important}
    .bx-action-card strong{font-size:14px!important;line-height:1.25!important;color:#22374d!important}
    .bx-action-card small{font-size:11.5px!important;line-height:1.45!important;color:#63778a!important;margin-top:4px!important}
    .bx-field-label{font-size:12.5px!important;line-height:1.3!important}
    .bx-char-count{font-size:10.5px!important;color:#6d8092!important}
    .bx-toggle-row strong{font-size:12.5px!important;line-height:1.3!important}
    .bx-toggle-row small{font-size:11px!important;line-height:1.45!important;color:#63778a!important}
    .bx-privacy-note{font-size:11.5px!important;line-height:1.55!important;color:#705b35!important}
    .bx-mail-note{font-size:11px!important;line-height:1.5!important;color:#6f8091!important}
    .bx-provider p{font-size:12px!important;line-height:1.55!important;color:#5f7489!important}
    .bx-support-disclaimer{font-size:11px!important;line-height:1.5!important;color:#697c8f!important}

    /* -------------------------------------------------------
       SCAN DEPTH / CUSTOM — body copy must read like normal UI,
       not disclaimer micro-text.
       ------------------------------------------------------- */
    .native-mode-eyebrow{font-size:10.5px!important;line-height:1.2!important;color:#426e89!important}
    .native-mode-lead{font-size:13px!important;line-height:1.55!important;color:#53687b!important}
    .native-mode-guide strong{font-size:12.5px!important;line-height:1.3!important;color:#203a52!important}
    .native-mode-guide small{font-size:11px!important;line-height:1.5!important;color:#5a6f82!important}
    .native-mode-option>strong{font-size:15px!important;line-height:1.16!important;color:#1b3046!important}
    .native-mode-option>small{font-size:11.5px!important;line-height:1.48!important;color:#586e82!important;margin-top:7px!important}
    .native-mode-option .native-mode-badge,.native-mode-option .ba-pro-mode-badge{
      font-size:9.5px!important;
      line-height:1!important;
    }
    .native-check>span:last-child{font-size:12px!important;line-height:1.35!important;color:#314a61!important}
    .native-custom-start,.native-mode-cancel{font-size:12.5px!important}

    /* -------------------------------------------------------
       CHECKUP — keep the clinical single-screen composition,
       but improve actual information hierarchy and contrast.
       ------------------------------------------------------- */
    .scan-kicker{font-size:clamp(9px,2.35vw,11.5px)!important;color:#6c86a0!important}
    .scan-subtitle{font-size:clamp(12px,3.05vw,15px)!important;line-height:1.38!important;color:#657c94!important}
    .scan-stage strong{
      font-size:clamp(8.2px,2.25vw,10.5px)!important;
      line-height:1.18!important;
      color:#29405c!important;
      font-weight:710!important;
    }
    .scan-stage small{
      font-size:clamp(7.7px,2vw,9.4px)!important;
      line-height:1.2!important;
      color:#70879e!important;
      margin-top:3px!important;
    }
    .scan-ring__copy>span{font-size:clamp(8.5px,2.15vw,10px)!important;color:#657f99!important}
    .scan-finding span{font-size:clamp(9.5px,2.35vw,11.5px)!important;line-height:1.22!important;color:#5e7690!important}
    .scan-quote blockquote{font-size:clamp(10.5px,2.8vw,14px)!important;line-height:1.28!important;color:#60788f!important}
    .scan-quote small{font-size:clamp(8.7px,2.05vw,9.8px)!important;line-height:1.25!important;color:#778b9f!important}
    .scan-tip__copy strong{font-size:clamp(11px,2.95vw,14px)!important;line-height:1.25!important;color:#263e5d!important}
    .scan-tip__copy span{font-size:clamp(10px,2.4vw,11.5px)!important;line-height:1.38!important;color:#617a92!important;margin-top:3px!important}
    .scan-action{font-size:clamp(11.5px,3vw,15px)!important}
    .native-live-activity__verb{font-size:clamp(10.5px,2.65vw,12px)!important;color:#25678f!important}
    .native-live-activity__path{font-size:clamp(12px,3.05vw,13.8px)!important;line-height:1.2!important;color:#213a52!important}
    .native-live-activity__meta{font-size:clamp(10px,2.55vw,11.2px)!important;line-height:1.25!important;color:#5d7489!important}
    .native-live-activity__percent{font-size:clamp(11px,2.8vw,12.8px)!important}

    /* -------------------------------------------------------
       RESULTS / EVIDENCE — increase dense micro-data without
       turning the dashboard into oversized cards.
       ------------------------------------------------------- */
    .native-results-eyebrow{font-size:10px!important;color:#347faa!important}
    .native-results-header p{font-size:12.5px!important;line-height:1.5!important;color:#53697d!important;max-width:330px!important}
    .native-result-kicker{font-size:9.5px!important;color:#53748f!important}
    .native-result-hero p{font-size:12.5px!important;line-height:1.52!important;color:#51697f!important}
    .native-hero-metric span{font-size:10.5px!important;line-height:1.28!important;color:#5a6f83!important}
    .native-primary-action small{font-size:11.5px!important;line-height:1.4!important;color:rgba(255,255,255,.95)!important}
    .native-results-section-head strong{font-size:13.5px!important;line-height:1.25!important;color:#1f354b!important}
    .native-results-section-head small{font-size:10.5px!important;line-height:1.3!important;color:#607487!important}
    .native-result-action strong{font-size:13px!important;line-height:1.22!important;color:#193047!important}
    .native-result-action small{font-size:11px!important;line-height:1.4!important;color:#586d80!important;margin-top:5px!important}
    .native-facts-title{font-size:12px!important;color:#263f56!important}
    .native-fact b{font-size:14px!important;color:#18334d!important}
    .native-fact span{font-size:10px!important;line-height:1.3!important;color:#5f7183!important;margin-top:4px!important}
    .native-session-card strong,.native-safety-card strong{font-size:12.5px!important;line-height:1.25!important;color:#1f374e!important}
    .native-session-card small,.native-safety-card small{font-size:10.5px!important;line-height:1.48!important;color:#596e82!important}
    .native-secondary{font-size:12.5px!important}

    .native-scan-evidence__head strong{font-size:13px!important;line-height:1.25!important}
    .native-scan-evidence__badge{font-size:10px!important}
    .native-scan-evidence__metric b{font-size:13.5px!important}
    .native-scan-evidence__metric span{font-size:10.5px!important;line-height:1.35!important;color:#586d80!important}
    .native-scan-evidence__note{font-size:11px!important;line-height:1.52!important;color:#51687c!important}
    .native-scan-evidence__issues{font-size:10.5px!important;line-height:1.4!important;color:#5f7488!important}
    .native-scan-evidence__types>strong{font-size:11px!important;line-height:1.3!important}
    .native-scan-evidence__typechip{font-size:10px!important;line-height:1.25!important}
    .native-scan-evidence__typechip b{font-size:10.5px!important}
    .native-scan-speed-details summary{font-size:11.5px!important;line-height:1.42!important}
    .native-scan-speed-details__body{font-size:11.5px!important;line-height:1.55!important;color:#4f667a!important}
    .native-scan-speed-details__footer{font-size:10.5px!important;line-height:1.4!important;color:#60798e!important}

    /* -------------------------------------------------------
       FILE REVIEW / MEDIA REVIEW — already strong; only lift
       auxiliary labels enough to remove squinting.
       ------------------------------------------------------- */
    .native-review-panel .native-sheet-head p{font-size:12.5px!important;line-height:1.42!important;color:#536a7e!important}
    .native-review-panel .native-review-summary{font-size:12px!important;line-height:1.3!important;color:#536b80!important}
    .native-review-panel .native-file-copy strong{font-size:13.5px!important;line-height:1.28!important;color:#1b3148!important}
    .native-review-panel .native-file-copy small{font-size:11px!important;line-height:1.4!important;color:#586d80!important}
    .native-review-panel .native-file-meta b{font-size:12px!important;color:#1f374e!important}
    .native-review-panel .native-risk{font-size:10px!important;line-height:1.2!important}
    .native-selection-copy small{font-size:11px!important;line-height:1.35!important;color:#596f83!important}
    .native-review-displaybar>strong{font-size:12.5px!important;color:#3f586e!important}
    .native-view-option{font-size:11.5px!important}
    .native-media-type{font-size:10px!important;line-height:1.2!important}
    .native-media-detail{font-size:11px!important;line-height:1.38!important;color:#586e82!important}

    /* Destructive + post-clean surfaces. */
    .native-confirm-panel p{font-size:12.5px!important;line-height:1.55!important;color:#536a7f!important}
    .native-confirm-note{font-size:11.5px!important;line-height:1.55!important;color:#755619!important}
    .native-clean-card p{font-size:12.5px!important;line-height:1.55!important;color:#566d82!important}
    .native-impact-copy small{font-size:11px!important;line-height:1.5!important;color:#566d82!important}
    .native-impact-item span{font-size:10px!important;line-height:1.3!important;color:#586e82!important}
    .native-impact-proof{font-size:11px!important;line-height:1.52!important;color:#536a7f!important}

    /* -------------------------------------------------------
       PRO — priority-one pass. Content-heavy surfaces are
       intentionally allowed to scroll rather than shrink type.
       ------------------------------------------------------- */
    .ba-pro-panel{
      max-height:min(93vh,880px)!important;
      padding:12px 17px 20px!important;
      scrollbar-width:none;
    }
    .ba-pro-panel::-webkit-scrollbar{display:none}
    .ba-pro-head{grid-template-columns:54px minmax(0,1fr) 40px!important;gap:11px!important}
    .ba-pro-mark{width:54px!important;height:54px!important}
    .ba-pro-kicker{font-size:10px!important;line-height:1.2!important;letter-spacing:.16em!important;color:#625cae!important}
    .ba-pro-title{font-size:22px!important;line-height:1.14!important;letter-spacing:-.032em!important;color:#172b43!important;margin-top:5px!important}
    .ba-pro-close{width:40px!important;height:40px!important}
    .ba-pro-lead{font-size:13px!important;line-height:1.58!important;color:#53697d!important;margin:13px 2px 14px!important}
    .ba-pro-status{height:28px!important;padding:0 10px!important;font-size:9.5px!important;line-height:1!important}
    .ba-pro-section{margin-top:16px!important}
    .ba-pro-section-head{margin:0 2px 9px!important;align-items:flex-end!important}
    .ba-pro-section-head strong{font-size:13.5px!important;line-height:1.3!important;color:#22384f!important}
    .ba-pro-section-head small{font-size:10.5px!important;line-height:1.4!important;color:#63778a!important}
    .ba-pro-feature-grid{gap:10px!important}
    .ba-pro-feature{padding:13px!important;border-radius:20px!important}
    .ba-pro-feature__icon{width:34px!important;height:34px!important;margin-bottom:9px!important}
    .ba-pro-feature strong{font-size:14px!important;line-height:1.28!important;color:#20364e!important}
    .ba-pro-feature small{font-size:11.5px!important;line-height:1.5!important;color:#596f83!important;margin-top:6px!important}
    .ba-pro-roadmap{padding:13px!important;border-radius:20px!important}
    .ba-pro-roadmap p{font-size:11.5px!important;line-height:1.52!important;color:#625f80!important;margin-bottom:10px!important}
    .ba-pro-roadmap__chips{gap:7px!important}
    .ba-pro-roadmap__chips span{min-height:29px!important;padding:5px 9px!important;font-size:10.5px!important;line-height:1.35!important;color:#5c587d!important}
    .ba-pro-trust{grid-template-columns:40px minmax(0,1fr)!important;gap:11px!important;padding:12px 13px!important;border-radius:20px!important}
    .ba-pro-trust__icon{width:40px!important;height:40px!important}
    .ba-pro-trust strong,.ba-pro-model strong,.ba-pro-purchase strong{font-size:13.5px!important;line-height:1.3!important}
    .ba-pro-trust small,.ba-pro-model small,.ba-pro-purchase small{font-size:11.5px!important;line-height:1.52!important;color:#596f83!important;margin-top:5px!important}
    .ba-pro-model{margin-top:10px!important;padding:12px 13px!important;border-radius:20px!important}
    .ba-pro-purchase{margin-top:13px!important;padding:13px!important;border-radius:20px!important}
    .ba-pro-primary{height:auto!important;min-height:47px!important;padding:10px 13px!important;font-size:11.5px!important;line-height:1.35!important}
    .ba-pro-debug{margin-top:13px!important;padding:12px!important;border-radius:19px!important}
    .ba-pro-debug__head strong{font-size:10px!important;line-height:1.3!important;color:#5d52a7!important}
    .ba-pro-debug__head small{font-size:10.5px!important;line-height:1.5!important;color:#686580!important;margin-top:4px!important}
    .ba-pro-debug__actions{gap:7px!important;margin-top:9px!important}
    .ba-pro-debug button{height:39px!important;font-size:10.5px!important;line-height:1.2!important}
    #supportProjectRow[data-pro-entry] .ba-pro-row-badge{height:22px!important;font-size:9px!important;letter-spacing:.07em!important}
    #supportProjectRow[data-pro-entry] small{font-size:12px!important;line-height:1.42!important;color:#5e7185!important}

    /* Thai/Japanese need extra vertical air for marks and dense glyphs. */
    html[lang^='th'] .ba-pro-lead,
    html[lang^='th'] .ba-pro-feature small,
    html[lang^='th'] .ba-pro-roadmap p,
    html[lang^='th'] .ba-pro-trust small,
    html[lang^='th'] .ba-pro-model small,
    html[lang^='th'] .ba-pro-purchase small,
    html[lang^='th'] .native-mode-option>small,
    html[lang^='th'] .native-result-hero p,
    html[lang^='th'] .native-scan-evidence__note,
    html[lang^='th'] .native-scan-speed-details__body,
    html[lang^='th'] .privacy-principle-card__copy,
    html[lang^='ja'] .ba-pro-lead,
    html[lang^='ja'] .ba-pro-feature small,
    html[lang^='ja'] .ba-pro-roadmap p,
    html[lang^='ja'] .ba-pro-trust small,
    html[lang^='ja'] .ba-pro-model small,
    html[lang^='ja'] .ba-pro-purchase small{
      line-height:1.62!important;
    }

    /* Short devices: protect zero-scroll screens by using the lower edge of
       the readable range, never the old 6–8 px functional micro-text. */
    @media(max-height:700px){
      .tool-card strong{font-size:10.5px!important}
      .tool-card small{font-size:9.3px!important;line-height:1.18!important}
      .health-card__copy small{font-size:10px!important}
      .nav-button span{font-size:9.3px!important}
      .scan-stage strong{font-size:8px!important}
      .scan-stage small{font-size:7.5px!important}
      .scan-finding span{font-size:9px!important}
      .scan-tip__copy span{font-size:9.7px!important}
    }

    @media(max-width:360px){
      .ba-pro-panel{padding-left:14px!important;padding-right:14px!important}
      .ba-pro-title{font-size:20px!important}
      .ba-pro-feature-grid{grid-template-columns:1fr!important}
      .ba-pro-feature small{font-size:11.5px!important}
      .ba-pro-roadmap__chips span{font-size:10.3px!important}
      .utility-list small,.setting-link small{font-size:11.5px!important}
      .native-view-option{font-size:10.5px!important}
    }
  `;

  document.head.appendChild(style);
})();
