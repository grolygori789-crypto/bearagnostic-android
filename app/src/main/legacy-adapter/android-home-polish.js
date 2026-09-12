(() => {
  'use strict';

  const STYLE_ID = 'androidHomePolish55Style';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* B55 — keep the full touch target, remove the visible tile around the approved silver gear. */
      .header-settings.header-settings--premium{
        background:transparent!important;
        border:0!important;
        box-shadow:none!important;
        border-radius:0!important;
        padding:0!important;
        overflow:visible!important;
      }
      .header-settings.header-settings--premium::before,
      .header-settings.header-settings--premium::after{
        content:none!important;
        display:none!important;
      }
      .header-settings.header-settings--premium .header-premium-gear{
        display:block!important;
        width:clamp(31px,8.6vw,39px)!important;
        height:auto!important;
        max-width:none!important;
        filter:drop-shadow(0 3px 7px rgba(41,62,86,.15))!important;
        transition:transform .16s ease,filter .16s ease!important;
      }
      .header-settings.header-settings--premium:active .header-premium-gear{
        transform:scale(.94)!important;
        filter:drop-shadow(0 2px 5px rgba(41,62,86,.13))!important;
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureStyle, { once: true });
  } else {
    ensureStyle();
  }
})();
