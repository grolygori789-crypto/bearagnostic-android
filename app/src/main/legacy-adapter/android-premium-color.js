(() => {
  'use strict';

  const BUILD = 26;
  const byId = (id) => document.getElementById(id);

  const MODE_ICONS = Object.freeze({
    smart:'<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.2"/>',
    quick:'<path d="m13 2-7 11h6l-1 9 7-12h-6z"/>',
    deep:'<path d="m12 3 8 4-8 4-8-4z"/><path d="m4 12 8 4 8-4M4 17l8 4 8-4"/>',
    custom:'<path d="M4 6h10M18 6h2M10 12h10M4 12h2M4 18h10M18 18h2"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>'
  });

  const SCOPE_ICONS = Object.freeze({
    downloads:'<path d="M12 3v11M8 10l4 4 4-4"/><path d="M5 18h14v3H5z"/>',
    photos:'<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.3"/><path d="m6 17 4-4 3 3 2-2 3 3"/>',
    videos:'<rect x="4" y="6" width="16" height="12" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    documents:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M10 12h5M10 15h5"/>',
    music:'<path d="M9 18V7l9-2v11"/><circle cx="6.5" cy="18" r="2.3"/><circle cx="15.5" cy="16" r="2.3"/>',
    verify:'<path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6Z"/><path d="m9 12 2 2 4-4"/>'
  });

  function ensureStyle() {
    if (byId('androidPremiumColorStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidPremiumColorStyle';
    style.textContent = `
      :root{
        --ba-azure:#168fea;--ba-cyan:#28bce9;--ba-indigo:#675fd0;--ba-violet:#8263d8;
        --ba-mint:#2fa98d;--ba-teal:#1a9f92;--ba-amber:#d59a31;--ba-gold:#bd8a3f;
        --ba-slate:#66829d;--ba-coral:#d45d67;--ba-ink:#172a40;
      }

      /* Global shell: richer light without losing the clinical/editorial base. */
      .app-shell{background:
        radial-gradient(circle at 84% 6%,rgba(40,188,233,.14),transparent 25%),
        radial-gradient(circle at 8% 88%,rgba(103,95,208,.055),transparent 29%),
        linear-gradient(180deg,#f8fbfe 0%,#f4f8fc 50%,#edf5fb 100%)!important}
      .header-settings{box-shadow:0 10px 25px rgba(61,92,125,.10),inset 0 1px 0 rgba(255,255,255,.96)!important}

      /* Home: keep the approved composition, enrich only the surfaces. */
      .home-screen .tool-card{position:relative;isolation:isolate;overflow:hidden}
      .home-screen .tool-card:after{content:'';position:absolute;z-index:-1;inset:auto -18% -52% 18%;height:86%;border-radius:50%;opacity:.42;filter:blur(12px);pointer-events:none}
      .home-screen .tool-card[data-tool='cleanup']{background:linear-gradient(145deg,#fff 35%,#edf9ff 100%)!important;border-color:rgba(36,164,225,.10)!important}
      .home-screen .tool-card[data-tool='cleanup']:after{background:rgba(40,188,233,.18)}
      .home-screen .tool-card[data-tool='duplicates']{background:linear-gradient(145deg,#fff 35%,#f3efff 100%)!important;border-color:rgba(116,91,211,.10)!important}
      .home-screen .tool-card[data-tool='duplicates']:after{background:rgba(126,99,216,.17)}
      .home-screen .tool-card[data-tool='large']{background:linear-gradient(145deg,#fff 35%,#fff7e8 100%)!important;border-color:rgba(213,154,49,.11)!important}
      .home-screen .tool-card[data-tool='large']:after{background:rgba(220,166,66,.18)}
      .home-screen .tool-card[data-tool='older']{background:linear-gradient(145deg,#fff 35%,#ebfaf6 100%)!important;border-color:rgba(47,169,141,.10)!important}
      .home-screen .tool-card[data-tool='older']:after{background:rgba(47,169,141,.17)}
      .health-card{background:linear-gradient(118deg,rgba(255,255,255,.96),rgba(238,251,248,.94))!important;border-color:rgba(47,169,141,.09)!important}

      /* Bottom nav: one brand accent, never a rainbow navigation bar. */
      .bottom-nav{background:rgba(255,255,255,.925)!important;border-color:rgba(255,255,255,.98)!important}
      .nav-button{border-radius:17px;transition:background .16s ease,color .16s ease,transform .16s ease}
      .nav-button.is-active{background:linear-gradient(145deg,rgba(231,247,255,.92),rgba(242,250,255,.72));box-shadow:inset 0 0 0 1px rgba(37,157,226,.055)}
      .nav-button:active{transform:scale(.97)}

      /* Scan-depth sheet: premium semantic color system. */
      .native-mode-sheet{background:radial-gradient(circle at 70% 18%,rgba(66,184,235,.13),transparent 30%),rgba(12,27,47,.31)!important}
      .native-mode-panel{position:relative;overflow:hidden;background:
        radial-gradient(circle at 88% 0%,rgba(63,192,236,.105),transparent 29%),
        radial-gradient(circle at 2% 82%,rgba(112,93,211,.045),transparent 31%),
        linear-gradient(180deg,rgba(253,254,255,.995),rgba(247,251,254,.99))!important;
        border-color:rgba(255,255,255,.99)!important;box-shadow:0 -22px 64px rgba(28,55,85,.22),inset 0 1px 0 #fff!important}
      .native-mode-handle{background:linear-gradient(90deg,#dce6ee,#c6d7e3,#dce6ee)!important}
      .native-mode-eyebrow{color:#4d829f!important}
      .native-mode-guide{position:relative;overflow:hidden;background:linear-gradient(125deg,#edf9ff 0%,#f8fcff 52%,#eef9f6 100%)!important;border-color:rgba(62,157,202,.10)!important;box-shadow:0 8px 20px rgba(50,100,137,.055),inset 0 1px 0 #fff}
      .native-mode-guide:after{content:'';position:absolute;right:-25px;top:-35px;width:105px;height:105px;border-radius:50%;background:radial-gradient(circle,rgba(42,183,229,.17),transparent 68%);pointer-events:none}
      .native-mode-guide img{position:relative;z-index:1;filter:drop-shadow(0 7px 11px rgba(35,76,110,.11))!important}
      .native-mode-guide strong{color:#173851!important}.native-mode-guide small{color:#60798d!important}

      .native-mode-grid{gap:10px!important}
      .native-mode-option{--tone:22,143,234;position:relative;isolation:isolate;overflow:hidden;display:block!important;min-height:116px!important;padding:11px 12px 12px!important;background:linear-gradient(148deg,#fff 28%,rgba(var(--tone),.075) 100%)!important;border:1px solid rgba(var(--tone),.145)!important;box-shadow:0 9px 24px rgba(57,90,122,.075),inset 0 1px 0 rgba(255,255,255,.98)!important;transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease!important}
      .native-mode-option:after{content:'';position:absolute;z-index:-1;right:-32px;bottom:-47px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(var(--tone),.13),transparent 66%);pointer-events:none}
      .native-mode-option[data-native-mode='smart']{--tone:22,143,234}
      .native-mode-option[data-native-mode='quick']{--tone:59,171,220}
      .native-mode-option[data-native-mode='deep']{--tone:103,95,208}
      .native-mode-option[data-native-mode='custom']{--tone:50,157,145}
      .native-mode-option:active{transform:translateY(1px) scale(.988);box-shadow:0 5px 14px rgba(57,90,122,.07),inset 0 1px 0 rgba(255,255,255,.98)!important}
      .native-mode-option:focus-visible{outline:3px solid rgba(var(--tone),.18)!important;outline-offset:2px!important}
      .premium-mode-head{height:34px;display:flex;align-items:center;justify-content:space-between;gap:7px;margin:0 0 7px}
      .premium-mode-icon{width:32px;height:32px;flex:0 0 auto;border-radius:11px;display:grid;place-items:center;color:rgb(var(--tone));background:linear-gradient(145deg,rgba(var(--tone),.12),rgba(var(--tone),.055));border:1px solid rgba(var(--tone),.09);box-shadow:inset 0 1px 0 rgba(255,255,255,.88)}
      .premium-mode-icon svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      .native-mode-option .native-mode-badge{position:static!important;display:inline-flex!important;align-items:center;height:24px;max-width:calc(100% - 39px);padding:0 8px!important;margin:0!important;border-radius:999px!important;background:linear-gradient(145deg,#e7f6ff,#eefaff)!important;border:1px solid rgba(22,143,234,.08)!important;color:#177fbf!important;font-size:8.5px!important;line-height:1!important;letter-spacing:.065em!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:inset 0 1px 0 #fff}
      .native-mode-option>strong{position:relative;z-index:1;display:block!important;font-size:15px!important;line-height:1.12!important;color:#1c3046!important;margin:0!important;white-space:normal!important;overflow:visible!important}
      .native-mode-option>small{position:relative;z-index:1;display:block!important;font-size:11.2px!important;line-height:1.38!important;color:#607588!important;margin-top:6px!important}

      /* Custom mode: same system, clear selected states. */
      .native-custom-list{gap:9px!important}
      .native-check{--tone:22,143,234;position:relative;overflow:hidden;display:grid!important;grid-template-columns:auto auto minmax(0,1fr);gap:8px!important;align-items:center!important;min-height:48px;padding:9px 10px!important;background:linear-gradient(145deg,#fff,rgba(var(--tone),.055))!important;border:1px solid rgba(var(--tone),.11)!important;color:#2b4359!important;box-shadow:0 5px 15px rgba(56,88,119,.045)}
      .native-check[data-premium-scope='downloads']{--tone:40,188,233}.native-check[data-premium-scope='photos']{--tone:22,143,234}.native-check[data-premium-scope='videos']{--tone:103,95,208}.native-check[data-premium-scope='documents']{--tone:102,130,157}.native-check[data-premium-scope='music']{--tone:130,99,216}.native-check[data-premium-scope='verify']{--tone:47,169,141}
      .native-check.is-premium-selected{border-color:rgba(var(--tone),.24)!important;background:linear-gradient(145deg,#fff 20%,rgba(var(--tone),.105))!important;box-shadow:0 7px 19px rgba(var(--tone),.08),inset 0 0 0 1px rgba(var(--tone),.035)}
      .premium-scope-icon{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:rgb(var(--tone));background:rgba(var(--tone),.09)}
      .premium-scope-icon svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      .native-check input{accent-color:rgb(var(--tone))!important;width:17px;height:17px;margin:0}
      .native-check>span:last-child{min-width:0;line-height:1.25}
      .native-custom-start{background:linear-gradient(118deg,#25b9e9 0%,#128fdc 48%,#1878e8 100%)!important;box-shadow:0 12px 24px rgba(17,132,222,.19),inset 0 1px 0 rgba(255,255,255,.24)}
      .native-mode-cancel{background:linear-gradient(145deg,#eef4f8,#eaf2f7)!important;color:#53697d!important;border:1px solid rgba(96,127,155,.055)}

      /* Checkup: semantic stages and findings. */
      .scan-stage.is-done .scan-stage__dot{background:linear-gradient(145deg,#42bba0,#279c83)!important;border-color:rgba(37,151,126,.15)!important;box-shadow:0 4px 11px rgba(47,169,141,.15)!important}
      .scan-stage.is-active:nth-child(1) .scan-stage__dot,.scan-stage.is-active:nth-child(2) .scan-stage__dot{color:#158edb!important;box-shadow:0 0 0 5px rgba(40,188,233,.09)!important}
      .scan-stage.is-active:nth-child(3) .scan-stage__dot{color:#d0962d!important;box-shadow:0 0 0 5px rgba(213,154,49,.09)!important}
      .scan-stage.is-active:nth-child(4) .scan-stage__dot{color:#715fd0!important;box-shadow:0 0 0 5px rgba(103,95,208,.09)!important}
      .scan-stage.is-active:nth-child(5) .scan-stage__dot{color:#3d829f!important;box-shadow:0 0 0 5px rgba(80,133,161,.08)!important}
      .scan-stage.is-active:nth-child(6) .scan-stage__dot{color:#299f87!important;box-shadow:0 0 0 5px rgba(47,169,141,.09)!important}
      .scan-finding{border-radius:15px;transition:background .15s ease,border-color .15s ease}
      .scan-finding:nth-child(1){background:linear-gradient(145deg,rgba(234,247,255,.78),rgba(255,255,255,.45));color:#2b84bd}
      .scan-finding:nth-child(2){background:linear-gradient(145deg,rgba(243,239,255,.76),rgba(255,255,255,.45));color:#6e63c5}
      .scan-finding:nth-child(3){background:linear-gradient(145deg,rgba(255,246,226,.80),rgba(255,255,255,.45));color:#a97825}
      .scan-finding:nth-child(4){background:linear-gradient(145deg,rgba(237,248,247,.80),rgba(247,244,255,.46));color:#4f8587}
      .scan-tip{background:linear-gradient(120deg,rgba(255,250,238,.93),rgba(249,253,255,.94))!important;border-color:rgba(210,159,64,.10)!important}
      .scan-tip__bulb{color:#c79330!important;background:#fff3d7!important}

      /* Live scan: richer glass and real file-type tint. */
      .native-live-activity{background:linear-gradient(135deg,rgba(253,254,255,.91),rgba(238,248,253,.86))!important;border-color:rgba(255,255,255,.96)!important;box-shadow:0 10px 27px rgba(38,78,115,.12),inset 0 1px 0 rgba(255,255,255,.98)!important}
      .native-live-activity[data-kind='image'] .native-live-activity__icon{color:#2b86d9!important;background:linear-gradient(145deg,#edf7ff,#e6f2fd)!important}
      .native-live-activity[data-kind='video'] .native-live-activity__icon{color:#625ec7!important;background:linear-gradient(145deg,#f1f1fd,#eaedfb)!important}
      .native-live-activity[data-kind='audio'] .native-live-activity__icon{color:#8562c4!important;background:linear-gradient(145deg,#f7f0fb,#f0ebf8)!important}
      .native-live-activity[data-kind='document'] .native-live-activity__icon{color:#5d7d99!important;background:linear-gradient(145deg,#f0f5f8,#e9f1f5)!important}
      .native-live-activity[data-kind='apk'] .native-live-activity__icon{color:#298e76!important;background:linear-gradient(145deg,#edf9f5,#e5f5ef)!important}
      .native-live-activity[data-kind='archive'] .native-live-activity__icon{color:#a7793d!important;background:linear-gradient(145deg,#fbf5e9,#f6eddf)!important}

      /* Tools: category color belongs to the task, not decoration. */
      #toolsScreen .utility-list button{--tone:22,143,234;position:relative;overflow:hidden;background:linear-gradient(112deg,#fff 35%,rgba(var(--tone),.065) 100%)!important;border-color:rgba(var(--tone),.09)!important;box-shadow:0 8px 23px rgba(67,101,136,.065),inset 0 1px 0 #fff!important}
      #toolsScreen .utility-list button:after{content:'';position:absolute;left:0;top:16%;bottom:16%;width:3px;border-radius:0 9px 9px 0;background:rgb(var(--tone));opacity:.65}
      #toolsScreen .utility-list button[data-tool='cleanup']{--tone:40,188,233}#toolsScreen .utility-list button[data-tool='duplicates']{--tone:115,91,211}#toolsScreen .utility-list button[data-tool='large']{--tone:213,154,49}#toolsScreen .utility-list button[data-tool='older']{--tone:47,169,141}
      #toolsScreen .utility-head>span{color:#3f89b5!important}

      /* Insights: intelligent violet/cyan rather than an empty gray page. */
      #insightsScreen:before{content:'';position:absolute;left:10%;right:4%;top:14%;height:68%;pointer-events:none;background:radial-gradient(circle at 62% 32%,rgba(40,188,233,.13),transparent 31%),radial-gradient(circle at 34% 60%,rgba(113,95,208,.10),transparent 34%);filter:blur(3px)}
      #insightsScreen .utility-head>span{color:#675fc0!important}
      #insightsScreen .utility-empty{position:relative;margin-top:4px;border-radius:28px;background:linear-gradient(145deg,rgba(255,255,255,.66),rgba(243,248,254,.64));border:1px solid rgba(255,255,255,.84);box-shadow:0 13px 34px rgba(66,91,132,.07),inset 0 1px 0 rgba(255,255,255,.94)}
      #insightsScreen .utility-empty:after{content:'';position:absolute;inset:18% 14%;z-index:-1;border-radius:50%;background:radial-gradient(circle,rgba(113,95,208,.10),rgba(40,188,233,.055) 44%,transparent 72%)}

      /* More, privacy and preferences: distinct semantic sections. */
      #moreScreen .panel-head>span{color:#527f9d!important}
      #moreScreen .setting-link{--tone:102,130,157;position:relative;overflow:hidden;background:linear-gradient(112deg,#fff 43%,rgba(var(--tone),.055) 100%)!important;border-color:rgba(var(--tone),.085)!important}
      #moreScreen .setting-link:after{content:'';position:absolute;right:-28px;top:-38px;width:98px;height:98px;border-radius:50%;background:radial-gradient(circle,rgba(var(--tone),.09),transparent 68%)}
      #privacyHubRow{--tone:47,169,141!important}#helpFeedbackHub{--tone:126,99,216!important}#supportProjectRow{--tone:183,84,112!important}#moreScreen [data-open='about']{--tone:72,126,171!important}
      #supportProjectRow{background:linear-gradient(112deg,#fff 34%,rgba(183,84,112,.088) 100%)!important;border-color:rgba(183,84,112,.12)!important;box-shadow:0 12px 28px rgba(115,65,93,.08),inset 0 1px 0 rgba(255,255,255,.97)!important}
      #supportProjectRow:after{background:radial-gradient(circle,rgba(183,84,112,.145),transparent 68%)!important}
      #supportProjectRow .soft-icon{background:linear-gradient(145deg,#f7c0cb,#d96a89)!important;color:#fff!important;box-shadow:0 10px 22px rgba(183,84,112,.16),inset 0 1px 0 rgba(255,255,255,.38)!important}
      #supportProjectRow .soft-icon svg,#supportProjectRow .soft-icon i{filter:drop-shadow(0 1px 1px rgba(111,40,63,.18))}
      #supportProjectRow h3,#supportProjectRow strong{color:#213248!important}
      #supportProjectRow p,#supportProjectRow small{color:#8c7080!important}
      #supportProjectRow .icon-button,#supportProjectRow .chevron,#supportProjectRow [aria-hidden='true']{color:#a05a74!important}

      .privacy-principle-card{background:linear-gradient(128deg,#edf9f5 0%,#f8fcff 58%,#eef8fb 100%)!important;border-color:rgba(47,169,141,.11)!important;box-shadow:0 10px 28px rgba(51,107,99,.065),inset 0 1px 0 #fff!important}
      .privacy-principle-card__icon{background:linear-gradient(145deg,#dff7f0,#edfafa)!important;color:#218f79!important;box-shadow:0 6px 16px rgba(47,169,141,.08),inset 0 1px 0 #fff}
      #privacyScreen .settings-title-row>div>span{color:#3a967f!important}

      .native-pref-card{position:relative;overflow:hidden;--tone:22,143,234;background:linear-gradient(120deg,rgba(255,255,255,.96),rgba(var(--tone),.045))!important;border-color:rgba(var(--tone),.085)!important}
      .native-pref-card:nth-child(2){--tone:47,169,141}.native-pref-card:nth-child(3){--tone:126,99,216}.native-pref-card:nth-child(4){--tone:102,130,157}
      .native-pref-card:after{content:'';position:absolute;right:-38px;top:-46px;width:118px;height:118px;border-radius:50%;background:radial-gradient(circle,rgba(var(--tone),.08),transparent 67%);pointer-events:none}
      .native-pref-card__head,.native-pref-rows{position:relative;z-index:1}

      /* Results/evidence: color only where it communicates meaning. */
      .native-scan-evidence{background:linear-gradient(135deg,#f2faff 0%,#f8fcff 52%,#eef9f6 100%)!important;border-color:rgba(55,151,196,.09)!important}
      .native-scan-evidence__metric{position:relative;overflow:hidden}
      .native-scan-evidence__metric:after{content:'';position:absolute;left:0;right:0;bottom:0;height:2px;opacity:.62}
      .native-scan-evidence__metric:nth-child(1):after{background:#2b9fdd}.native-scan-evidence__metric:nth-child(2):after{background:#66829d}.native-scan-evidence__metric:nth-child(3):after{background:#675fd0}.native-scan-evidence__metric:nth-child(4):after{background:#2fa98d}
      .native-scan-evidence__badge:not(.partial){background:linear-gradient(145deg,#e1f7ef,#ecfaf6)!important;color:#187d68!important}.native-scan-evidence__badge.partial{background:linear-gradient(145deg,#fff0d8,#fff7e9)!important;color:#94651c!important}
      .native-result-action{background:linear-gradient(145deg,#fff 40%,#f5faff 100%)!important}
      .native-result-action[data-tone='amber']{background:linear-gradient(145deg,#fff 40%,#fff8ea 100%)!important}.native-result-action[data-tone='violet']{background:linear-gradient(145deg,#fff 40%,#f5f2ff 100%)!important}.native-result-action[data-tone='mint']{background:linear-gradient(145deg,#fff 40%,#eefaf6 100%)!important}.native-result-action[data-tone='slate']{background:linear-gradient(145deg,#fff 40%,#f1f6fa 100%)!important}.native-result-action[data-tone='sand']{background:linear-gradient(145deg,#fff 40%,#faf4eb 100%)!important}.native-result-action[data-tone='gray']{background:linear-gradient(145deg,#fff 40%,#f3f6f8 100%)!important}
      .native-safety-card{background:linear-gradient(145deg,#fff,#f2f8fc)!important}.native-session-card{background:linear-gradient(135deg,#eaf9f4,#f7fcff)!important}

      /* Review: selected files should feel intentional, not merely checked. */
      .native-file-row.is-premium-selected{border-color:rgba(22,143,234,.20)!important;background:linear-gradient(112deg,#fff 42%,rgba(34,160,226,.075))!important;box-shadow:0 7px 20px rgba(39,105,151,.07),inset 3px 0 0 rgba(22,143,234,.48)!important}
      .native-select-all{background:linear-gradient(145deg,#edf8ff,#f7fbfe)!important;color:#197fba!important;border:1px solid rgba(35,148,211,.09)!important}
      .native-review-footer{background:linear-gradient(180deg,rgba(250,253,255,.96),rgba(245,250,253,.985))!important}

      /* Destructive and success states: reserve strong color for meaning. */
      .native-confirm-panel{border:1px solid rgba(213,154,49,.10)!important;box-shadow:0 23px 66px rgba(27,49,71,.24),inset 0 1px 0 #fff!important}
      .native-confirm-note{background:linear-gradient(145deg,#fff3dd,#fff9ef)!important;border:1px solid rgba(213,154,49,.10)!important}
      .native-danger{background:linear-gradient(118deg,#d85e68,#c74450)!important;box-shadow:0 10px 21px rgba(196,68,80,.18)!important}
      .native-impact-hero{background:linear-gradient(125deg,#e8f9f3,#f8fcff 55%,#eaf7ff)!important;border-color:rgba(47,169,141,.10)!important}
      .native-clean-metric{background:linear-gradient(90deg,#168fea,#2fa98d);-webkit-background-clip:text;background-clip:text;color:transparent!important}

      @media(max-width:360px){
        .native-mode-option{min-height:112px!important;padding:10px!important}.premium-mode-head{height:31px;margin-bottom:6px}.premium-mode-icon{width:29px;height:29px}.native-mode-option .native-mode-badge{height:22px;padding:0 6px!important;font-size:7.8px!important}.native-mode-option>strong{font-size:14px!important}.native-mode-option>small{font-size:10.5px!important}
      }
      @media(prefers-reduced-motion:reduce){.nav-button,.native-mode-option{transition:none!important}}
      html[data-motion='reduced'] .nav-button,html[data-motion='reduced'] .native-mode-option{transition:none!important}
    `;
    document.head.appendChild(style);
  }

  function icon(svg) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${svg}</svg>`;
  }

  function decorateModeSheet() {
    const sheet = byId('nativeModeSheet');
    if (!sheet) return;

    sheet.querySelectorAll('.native-mode-option[data-native-mode]').forEach((button) => {
      const mode = button.dataset.nativeMode;
      if (!MODE_ICONS[mode]) return;
      let head = button.querySelector(':scope > .premium-mode-head');
      if (!head) {
        head = document.createElement('span');
        head.className = 'premium-mode-head';
        const modeIcon = document.createElement('span');
        modeIcon.className = 'premium-mode-icon';
        modeIcon.innerHTML = icon(MODE_ICONS[mode]);
        head.appendChild(modeIcon);
        const badge = button.querySelector(':scope > .native-mode-badge');
        if (badge) head.appendChild(badge);
        button.insertBefore(head, button.firstChild);
      }
    });

    sheet.querySelectorAll('.native-check').forEach((label) => {
      const input = label.querySelector('input');
      if (!input) return;
      const scope = input.dataset.nativeScope || (input.id === 'nativeVerifyDuplicates' ? 'verify' : '');
      if (!scope) return;
      label.dataset.premiumScope = scope;
      label.classList.toggle('is-premium-selected', Boolean(input.checked));
      if (!label.querySelector('.premium-scope-icon') && SCOPE_ICONS[scope]) {
        const itemIcon = document.createElement('span');
        itemIcon.className = 'premium-scope-icon';
        itemIcon.innerHTML = icon(SCOPE_ICONS[scope]);
        input.insertAdjacentElement('afterend', itemIcon);
      }
    });
  }

  function syncReviewSelection() {
    document.querySelectorAll('.native-file-row').forEach((row) => {
      const checkbox = row.querySelector('[data-review-id]');
      row.classList.toggle('is-premium-selected', Boolean(checkbox?.checked));
    });
  }

  // Runtime version labels are owned by android-review.js. This visual-only
  // module must never write build metadata or fight the runtime label synchronizer.

  let scheduled = false;
  function scheduleRefresh() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      decorateModeSheet();
      syncReviewSelection();
    });
  }

  ensureStyle();
  scheduleRefresh();

  const observer = new MutationObserver(scheduleRefresh);
  if (document.body) observer.observe(document.body, {childList:true, subtree:true});
  else document.addEventListener('DOMContentLoaded', () => observer.observe(document.body, {childList:true, subtree:true}), {once:true});

  document.addEventListener('change', (event) => {
    const input = event.target;
    if (input?.matches?.('[data-native-scope],#nativeVerifyDuplicates,[data-review-id]')) scheduleRefresh();
  }, true);

  document.addEventListener('click', (event) => {
    if (event.target?.closest?.('.native-select-all')) setTimeout(scheduleRefresh, 0);
  }, true);

  document.addEventListener('DOMContentLoaded', scheduleRefresh, {once:true});
  window.addEventListener('bearagnostic:languagechange', () => setTimeout(scheduleRefresh, 0));
})();
