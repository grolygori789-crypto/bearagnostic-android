(() => {
  'use strict';

  const STYLE_ID = 'androidCustomScanStyle';
  const PANEL_CLASS = 'ba-custom-panel';
  const GRID_CLASS = 'ba-custom-grid';
  const SUMMARY_ID = 'baCustomSelectionSummary';

  const byId = (id) => document.getElementById(id);

  function language() {
    const lang = String(document.documentElement.lang || 'en').toLowerCase();
    if (lang.startsWith('th')) return 'th';
    if (lang.startsWith('ja')) return 'ja';
    return 'en';
  }

  const COPY = Object.freeze({
    en: {
      locationsTitle: 'SCAN LOCATIONS',
      locationsSub: 'Choose one or more shared-storage locations.',
      duplicateTitle: 'DUPLICATE CHECK',
      duplicateSub: 'Choose whether exact duplicate verification is part of this scan.',
      verifyHelp: 'Checks file content only inside the locations you selected.',
      selectedOne: '1 location selected',
      selectedMany: '{count} locations selected',
      noneSelected: 'Select at least one location',
      verifyOn: 'Exact duplicates on',
      verifyOff: 'Exact duplicates off',
    },
    th: {
      locationsTitle: 'ตำแหน่งที่จะสแกน',
      locationsSub: 'เลือกอย่างน้อยหนึ่งตำแหน่งในพื้นที่จัดเก็บร่วม',
      duplicateTitle: 'ตรวจไฟล์ซ้ำ',
      duplicateSub: 'เลือกว่าจะรวมการยืนยันไฟล์ซ้ำแบบ exact ในการสแกนครั้งนี้หรือไม่',
      verifyHelp: 'ตรวจเนื้อหาไฟล์เฉพาะภายในตำแหน่งที่คุณเลือก',
      selectedOne: 'เลือกแล้ว 1 ตำแหน่ง',
      selectedMany: 'เลือกแล้ว {count} ตำแหน่ง',
      noneSelected: 'เลือกอย่างน้อย 1 ตำแหน่ง',
      verifyOn: 'ตรวจไฟล์ซ้ำแบบ exact: เปิด',
      verifyOff: 'ตรวจไฟล์ซ้ำแบบ exact: ปิด',
    },
    ja: {
      locationsTitle: 'スキャン対象',
      locationsSub: '共有ストレージから1つ以上選択してください。',
      duplicateTitle: '重複チェック',
      duplicateSub: '完全一致の重複確認をこのスキャンに含めるか選べます。',
      verifyHelp: '選択した場所の中だけでファイル内容を確認します。',
      selectedOne: '1か所を選択中',
      selectedMany: '{count}か所を選択中',
      noneSelected: '1か所以上選択してください',
      verifyOn: '完全一致の重複チェック: オン',
      verifyOff: '完全一致の重複チェック: オフ',
    },
  });

  function t() { return COPY[language()] || COPY.en; }

  function ensureStyle() {
    if (byId(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* B33 — Custom Scan is a single, deliberate mobile composition.
         This layer loads after general readability so it owns only the
         Custom Scan responsive arrangement without changing scan logic. */
      .native-mode-panel.${PANEL_CLASS}{
        max-height:calc(100dvh - max(18px,env(safe-area-inset-top)) - max(10px,env(safe-area-inset-bottom)))!important;
        overflow-y:auto!important;
        overscroll-behavior:contain!important;
        scrollbar-width:none;
      }
      .native-mode-panel.${PANEL_CLASS}::-webkit-scrollbar{display:none}
      .native-mode-panel.${PANEL_CLASS} .native-mode-lead{
        margin-bottom:9px!important;
      }
      .native-mode-panel.${PANEL_CLASS} #nativeModeGuide{
        grid-template-columns:46px minmax(0,1fr)!important;
        gap:10px!important;
        margin:7px 0 12px!important;
        padding:8px 10px!important;
        border-radius:17px!important;
      }
      .native-mode-panel.${PANEL_CLASS} #nativeModeGuide img{
        width:46px!important;
        height:46px!important;
      }
      .native-mode-panel.${PANEL_CLASS} #nativeModeGuide strong{
        font-size:12.5px!important;
        line-height:1.2!important;
      }
      .native-mode-panel.${PANEL_CLASS} #nativeModeGuide small{
        font-size:11.5px!important;
        line-height:1.38!important;
        margin-top:3px!important;
      }

      #nativeModeGrid.${GRID_CLASS}{
        display:flex!important;
        flex-direction:column!important;
        grid-template-columns:none!important;
        gap:11px!important;
        min-width:0!important;
      }
      #nativeModeGrid.${GRID_CLASS} .native-custom-list{
        display:grid!important;
        grid-template-columns:repeat(2,minmax(0,1fr))!important;
        gap:10px!important;
        width:100%!important;
        margin:0!important;
        min-width:0!important;
      }
      #nativeModeGrid.${GRID_CLASS} .ba-custom-section{
        grid-column:1/-1;
        min-width:0;
        padding:1px 2px 0;
      }
      #nativeModeGrid.${GRID_CLASS} .ba-custom-section--duplicates{
        margin-top:3px;
      }
      #nativeModeGrid.${GRID_CLASS} .ba-custom-section strong{
        display:block;
        margin:0;
        font-size:9.5px;
        line-height:1.15;
        letter-spacing:.18em;
        text-transform:uppercase;
        font-weight:820;
        color:#617b91;
      }
      html[lang^='th'] #nativeModeGrid.${GRID_CLASS} .ba-custom-section strong,
      html[lang^='ja'] #nativeModeGrid.${GRID_CLASS} .ba-custom-section strong{
        letter-spacing:.06em;
      }
      #nativeModeGrid.${GRID_CLASS} .ba-custom-section small{
        display:block;
        margin-top:4px;
        font-size:11.5px;
        line-height:1.38;
        color:#708396;
      }

      #nativeModeGrid.${GRID_CLASS} .native-check{
        width:100%!important;
        min-width:0!important;
        min-height:58px!important;
        box-sizing:border-box!important;
        grid-template-columns:auto auto minmax(0,1fr)!important;
        gap:9px!important;
        padding:10px 11px!important;
        border-radius:17px!important;
      }
      #nativeModeGrid.${GRID_CLASS} .native-check>span:last-child{
        min-width:0!important;
        overflow:visible!important;
        white-space:normal!important;
        text-overflow:clip!important;
        font-size:12.5px!important;
        line-height:1.28!important;
        font-weight:700!important;
        color:#294258!important;
      }
      #nativeModeGrid.${GRID_CLASS} .native-check[data-premium-scope='music']{
        grid-column:1/-1!important;
      }
      #nativeModeGrid.${GRID_CLASS} .native-check--wide{
        grid-column:1/-1!important;
        min-height:74px!important;
        grid-template-rows:auto auto!important;
        align-items:center!important;
        background:linear-gradient(145deg,#fff 20%,rgba(47,169,141,.085))!important;
        border-color:rgba(47,169,141,.15)!important;
      }
      #nativeModeGrid.${GRID_CLASS} .native-check--wide>input{
        grid-column:1!important;
        grid-row:1/3!important;
      }
      #nativeModeGrid.${GRID_CLASS} .native-check--wide>.premium-scope-icon{
        grid-column:2!important;
        grid-row:1/3!important;
      }
      #nativeModeGrid.${GRID_CLASS} .native-check--wide>span:last-of-type{
        grid-column:3!important;
        grid-row:1!important;
        align-self:end!important;
      }
      #nativeModeGrid.${GRID_CLASS} .ba-custom-verify-help{
        grid-column:3!important;
        grid-row:2!important;
        min-width:0;
        margin:2px 0 0!important;
        font-size:10.8px!important;
        line-height:1.35!important;
        color:#6d827e!important;
      }

      #nativeModeGrid.${GRID_CLASS} .ba-custom-summary{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        min-height:42px;
        padding:8px 11px;
        border-radius:15px;
        background:linear-gradient(112deg,rgba(239,248,253,.94),rgba(242,250,247,.96));
        border:1px solid rgba(77,133,166,.085);
        color:#526b80;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.95);
      }
      #nativeModeGrid.${GRID_CLASS} .ba-custom-summary b{
        min-width:0;
        font-size:11.5px;
        line-height:1.25;
        color:#28445b;
      }
      #nativeModeGrid.${GRID_CLASS} .ba-custom-summary span{
        flex:0 0 auto;
        font-size:10.5px;
        line-height:1.2;
        color:#2c8f7b;
        font-weight:760;
        white-space:nowrap;
      }
      #nativeModeGrid.${GRID_CLASS} .ba-custom-summary.is-empty b{
        color:#a36f28;
      }

      #nativeModeGrid.${GRID_CLASS} .native-custom-start{
        width:100%!important;
        min-width:0!important;
        height:52px!important;
        margin:0!important;
        border-radius:18px!important;
        font-size:13px!important;
        line-height:1!important;
        letter-spacing:.005em!important;
      }
      #nativeModeGrid.${GRID_CLASS} .native-custom-start:focus-visible{
        outline:3px solid rgba(22,143,234,.20)!important;
        outline-offset:2px!important;
      }
      #nativeModeGrid.${GRID_CLASS} .native-custom-start:disabled{
        opacity:.48!important;
        box-shadow:none!important;
        cursor:default!important;
      }
      .native-mode-panel.${PANEL_CLASS}>.native-mode-cancel{
        height:48px!important;
        margin-top:9px!important;
        border-radius:18px!important;
        font-size:12.5px!important;
      }

      @media(max-width:380px){
        #nativeModeGrid.${GRID_CLASS} .native-custom-list{gap:8px!important}
        #nativeModeGrid.${GRID_CLASS} .native-check{min-height:55px!important;padding:9px!important;gap:7px!important}
        #nativeModeGrid.${GRID_CLASS} .native-check>span:last-child{font-size:11.8px!important}
        #nativeModeGrid.${GRID_CLASS} .ba-custom-section small{font-size:11px}
        #nativeModeGrid.${GRID_CLASS} .ba-custom-summary{padding:8px 9px;gap:7px}
        #nativeModeGrid.${GRID_CLASS} .ba-custom-summary b{font-size:10.8px}
        #nativeModeGrid.${GRID_CLASS} .ba-custom-summary span{font-size:9.8px}
      }
      @media(max-height:720px){
        .native-mode-panel.${PANEL_CLASS} #nativeModeGuide{margin-top:5px!important;margin-bottom:9px!important;padding-top:6px!important;padding-bottom:6px!important}
        .native-mode-panel.${PANEL_CLASS} #nativeModeGuide img{width:40px!important;height:40px!important}
        #nativeModeGrid.${GRID_CLASS} .native-check{min-height:52px!important;padding-top:8px!important;padding-bottom:8px!important}
        #nativeModeGrid.${GRID_CLASS} .native-check--wide{min-height:66px!important}
        #nativeModeGrid.${GRID_CLASS} .native-custom-start{height:48px!important}
      }
      @media(prefers-reduced-motion:reduce){
        #nativeModeGrid.${GRID_CLASS} .native-check,
        #nativeModeGrid.${GRID_CLASS} .native-custom-start{transition:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function section(className, title, subtitle) {
    const node = document.createElement('div');
    node.className = `ba-custom-section ${className}`;
    node.innerHTML = `<strong></strong><small></small>`;
    node.querySelector('strong').textContent = title;
    node.querySelector('small').textContent = subtitle;
    return node;
  }

  function ensureDecorations() {
    const sheet = byId('nativeModeSheet');
    const panel = sheet?.querySelector('.native-mode-panel');
    const grid = byId('nativeModeGrid');
    const list = grid?.querySelector('.native-custom-list');

    const custom = Boolean(panel && grid && list);
    panel?.classList.toggle(PANEL_CLASS, custom);
    grid?.classList.toggle(GRID_CLASS, custom);
    if (!custom) return;

    const copy = t();
    const scopes = [...list.querySelectorAll('.native-check:not(.native-check--wide)')];
    const verify = list.querySelector('.native-check--wide');

    let locationsHeading = list.querySelector('.ba-custom-section--locations');
    if (!locationsHeading && scopes.length) {
      locationsHeading = section('ba-custom-section--locations', copy.locationsTitle, copy.locationsSub);
      list.insertBefore(locationsHeading, scopes[0]);
    } else if (locationsHeading) {
      locationsHeading.querySelector('strong').textContent = copy.locationsTitle;
      locationsHeading.querySelector('small').textContent = copy.locationsSub;
    }

    let duplicateHeading = list.querySelector('.ba-custom-section--duplicates');
    if (!duplicateHeading && verify) {
      duplicateHeading = section('ba-custom-section--duplicates', copy.duplicateTitle, copy.duplicateSub);
      list.insertBefore(duplicateHeading, verify);
    } else if (duplicateHeading) {
      duplicateHeading.querySelector('strong').textContent = copy.duplicateTitle;
      duplicateHeading.querySelector('small').textContent = copy.duplicateSub;
    }

    if (verify) {
      let help = verify.querySelector('.ba-custom-verify-help');
      if (!help) {
        help = document.createElement('small');
        help.className = 'ba-custom-verify-help';
        verify.appendChild(help);
      }
      help.textContent = copy.verifyHelp;
    }

    let summary = byId(SUMMARY_ID);
    const start = byId('nativeCustomStart');
    if (!summary && start) {
      summary = document.createElement('div');
      summary.id = SUMMARY_ID;
      summary.className = 'ba-custom-summary';
      summary.setAttribute('aria-live', 'polite');
      summary.innerHTML = '<b></b><span></span>';
      start.insertAdjacentElement('beforebegin', summary);
    }

    updateState();
  }

  function updateState() {
    const grid = byId('nativeModeGrid');
    if (!grid?.classList.contains(GRID_CLASS)) return;

    const copy = t();
    const scopeInputs = [...grid.querySelectorAll('input[data-native-scope]')];
    const selected = scopeInputs.filter((input) => input.checked).length;
    const verify = byId('nativeVerifyDuplicates');
    const start = byId('nativeCustomStart');
    const summary = byId(SUMMARY_ID);

    if (summary) {
      const selectedText = selected === 0
        ? copy.noneSelected
        : selected === 1
          ? copy.selectedOne
          : copy.selectedMany.replace('{count}', String(selected));
      summary.querySelector('b').textContent = selectedText;
      summary.querySelector('span').textContent = verify?.checked ? copy.verifyOn : copy.verifyOff;
      summary.classList.toggle('is-empty', selected === 0);
    }

    // Custom Scan means the user's chosen locations. Prevent an empty UI choice
    // from silently falling back to the scanner's legacy default scope set.
    if (start) {
      start.disabled = selected === 0;
      start.setAttribute('aria-disabled', selected === 0 ? 'true' : 'false');
    }
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      ensureDecorations();
    });
  }

  ensureStyle();
  schedule();

  const observer = new MutationObserver(schedule);
  if (document.body) observer.observe(document.body, {childList:true, subtree:true});
  else document.addEventListener('DOMContentLoaded', () => observer.observe(document.body, {childList:true, subtree:true}), {once:true});

  document.addEventListener('change', (event) => {
    if (event.target?.matches?.('[data-native-scope],#nativeVerifyDuplicates')) {
      updateState();
    }
  }, true);

  document.addEventListener('DOMContentLoaded', schedule, {once:true});
  window.addEventListener('bearagnostic:languagechange', () => setTimeout(schedule, 0));
})();
