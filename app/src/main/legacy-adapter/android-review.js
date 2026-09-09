(() => {
  'use strict';

  // The review surface is an action workspace, not a mascot/marketing surface.
  // Keep the underlying checkup scene completely hidden and give the file list
  // the full remaining viewport after the compact title + summary.
  const style = document.createElement('style');
  style.id = 'androidReviewSurfaceStyle';
  style.textContent = `
    .native-review-sheet{
      background:#edf5fa !important;
      backdrop-filter:none !important;
      -webkit-backdrop-filter:none !important;
      padding:max(10px,env(safe-area-inset-top)) 10px max(10px,env(safe-area-inset-bottom)) !important;
    }
    .native-review-panel{
      grid-template-rows:auto auto minmax(0,1fr) auto !important;
      background:linear-gradient(180deg,#fbfdff 0%,#f5f9fc 100%) !important;
      border:1px solid rgba(255,255,255,.98) !important;
      border-radius:32px !important;
      box-shadow:0 22px 64px rgba(35,67,99,.16) !important;
      overflow:hidden !important;
    }
    #nativeReviewAdvice{display:none !important;}
    .native-review-panel .native-sheet-head{
      padding:15px 16px 7px !important;
      background:rgba(252,254,255,.98) !important;
    }
    .native-review-panel .native-sheet-head h2{
      font-size:22px !important;
      line-height:1.08 !important;
      letter-spacing:-.035em !important;
      color:#172b43 !important;
    }
    .native-review-panel .native-sheet-head p{
      font-size:10px !important;
      line-height:1.25 !important;
      color:#8795a3 !important;
      margin-top:4px !important;
    }
    .native-review-panel .native-review-summary{
      min-height:30px !important;
      padding:0 17px 7px !important;
      background:rgba(252,254,255,.98) !important;
      color:#7b8c9c !important;
      font-size:10px !important;
      align-items:center !important;
      border-bottom:1px solid rgba(91,120,149,.06) !important;
    }
    .native-review-panel .native-review-list{
      min-height:0 !important;
      overflow:auto !important;
      padding:9px 13px 14px !important;
      background:linear-gradient(180deg,#f4f9fc 0%,#eef5fa 100%) !important;
      overscroll-behavior:contain !important;
    }
    .native-review-panel .native-file-row{
      min-height:72px !important;
      margin-bottom:8px !important;
      padding:11px 12px !important;
      border-radius:19px !important;
      border:1px solid rgba(93,123,151,.10) !important;
      background:#fff !important;
      box-shadow:0 6px 18px rgba(50,83,116,.055) !important;
    }
    .native-review-panel .native-file-copy strong{
      font-size:12px !important;
      line-height:1.2 !important;
      color:#1c3047 !important;
    }
    .native-review-panel .native-file-copy small{
      font-size:8.5px !important;
      line-height:1.25 !important;
      color:#8a98a6 !important;
    }
    .native-review-panel .native-file-meta b{font-size:10px !important;color:#1d3046 !important;}
    .native-review-panel .native-risk{font-size:7.5px !important;padding:3px 7px !important;}
    .native-review-panel .native-review-footer{
      min-height:74px !important;
      padding:9px 13px 13px !important;
      background:#fbfdff !important;
      backdrop-filter:none !important;
      -webkit-backdrop-filter:none !important;
      border-top:1px solid rgba(91,120,149,.08) !important;
      box-shadow:0 -8px 24px rgba(57,88,118,.035) !important;
    }
    .native-review-panel .native-delete-button{
      min-width:145px !important;
      height:48px !important;
      border-radius:18px !important;
      background:#162d48 !important;
      box-shadow:0 8px 18px rgba(22,45,72,.12) !important;
      font-size:11px !important;
    }
    @media(max-width:360px){
      .native-review-panel .native-file-row{min-height:66px !important;padding:10px !important;}
      .native-review-panel .native-delete-button{min-width:132px !important;}
    }
  `;
  document.head.appendChild(style);


  function syncBuildLabels() {
    const version = '0.19.0-alpha19';
    const footer = document.querySelector('.app-footer__build');
    const footerValue = 'v0.19 · B19';
    if (footer && footer.textContent !== footerValue) footer.textContent = footerValue;

    const about = document.querySelector('.more-screen [data-open="about"] small');
    const aboutValue = `Benedict Interactive · ${version} · B19`;
    if (about && about.textContent !== aboutValue) about.textContent = aboutValue;

    const pref = document.getElementById('nativePreferencesExtension');
    if (pref) {
      pref.querySelectorAll('b').forEach((node) => {
        if (node.textContent?.includes('B18')) node.textContent = node.textContent.replace('B18','B19');
      });
    }
  }

  // The B18 adapter can recreate this card whenever a category is opened.
  // CSS keeps it out of layout, and this observer removes stale nodes so the
  // grid always gives its flexible row to the actual file list.
  const removeAdvice = () => document.getElementById('nativeReviewAdvice')?.remove();
  removeAdvice();
  const observer = new MutationObserver(() => { removeAdvice(); syncBuildLabels(); });
  observer.observe(document.body, { childList:true, subtree:true, characterData:true });
  syncBuildLabels();
})();
