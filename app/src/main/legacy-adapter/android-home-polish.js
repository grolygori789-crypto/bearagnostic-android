(() => {
  'use strict';

  /*
   * Bearagnostic Android B84 corrective polish.
   * Narrow compatibility layer for the physically observed v83 defects:
   * - responsive Tool selection geometry;
   * - Empty Folders bottom-action anatomy;
   * - first-class EN/TH/JA text expansion and Japanese line breaking;
   * - richer Purchase & Restore self-service guidance;
   * - lower-latency bulk selection through existing tool handlers.
   *
   * No scanner, deletion, entitlement, Restore, history or payment truth is changed.
   */
  const BUILD = 84;
  const STYLE_ID = 'androidHomePolish84Style';
  const byId = (id) => document.getElementById(id);

  const BULK = Object.freeze({
    large:      {surface:'#baLargeFiles',       checkbox:'[data-large-id]',     dataKey:'largeId',     cap:500},
    old:        {surface:'#baOldFiles',         checkbox:'[data-old-id]',       dataKey:'oldId',       cap:500},
    downloads:  {surface:'#baDownloadsSurface', checkbox:'[data-download-id]',  dataKey:'downloadId',  cap:500},
    installers: {surface:'#baInstallersSurface',checkbox:'[data-installer-id]', dataKey:'installerId', cap:500},
    archives:   {surface:'#baArchivesSurface',  checkbox:'[data-archive-id]',   dataKey:'archiveId',   cap:500},
    zero:       {surface:'#baZeroSurface',      checkbox:'[data-zero-id]',      dataKey:'zeroId',      cap:500},
    empty:      {surface:'#baEmptySurface',     checkbox:'[data-empty-id]',     dataKey:'emptyId',     cap:100},
    media:      {surface:'#baMediaSurface',     checkbox:'[data-media-id]',     dataKey:'mediaId',     cap:500},
  });

  const COPY = {
    en: {
      selecting:'Selecting…',
      purchaseCards:[
        ['Already paid for Pro?','Use the exact email used at Ko-fi checkout. Verify that email, then choose Restore. If a different email was entered in the app, use the Ko-fi checkout email instead.'],
        ['Reinstalled or changed device?','Your Lifetime Pro purchase is not tied to one installation. Open Purchase & Restore and restore with the same verified purchase email.'],
        ['Verification email not arriving?','Check the email address first, then spam or junk. Avoid repeated requests in a short period; verification can be rate-limited for account protection.'],
        ['Paid but Pro is still locked?','Do not purchase again. Restore with the Ko-fi checkout email. If access still cannot be verified, contact purchase support with the purchase email and a short description.'],
        ['Buying Pro?','Lifetime Pro is a one-time 249 THB purchase with no subscription. Ko-fi handles checkout; Benedict verifies the entitlement after the purchase flow.'],
      ],
    },
    th: {
      selecting:'กำลังเลือก…',
      purchaseCards:[
        ['ชำระเงินซื้อ Pro แล้ว?','ใช้อีเมลเดียวกับที่ใช้ชำระเงินบน Ko-fi ยืนยันอีเมลนั้นแล้วเลือกกู้คืน หากเคยกรอกอีเมลอื่นในแอป ให้ใช้อีเมลจากรายการซื้อ Ko-fi แทน'],
        ['ติดตั้งใหม่หรือเปลี่ยนเครื่อง?','สิทธิ์ Lifetime Pro ไม่ได้ผูกกับการติดตั้งครั้งเดียว เปิดการซื้อและกู้คืน แล้วกู้คืนด้วยอีเมลรายการซื้อเดิมที่ยืนยันแล้ว'],
        ['ไม่ได้รับอีเมลยืนยัน?','ตรวจสอบอีเมลที่กรอกก่อน แล้วดูโฟลเดอร์สแปมหรือจดหมายขยะ หลีกเลี่ยงการขอรหัสซ้ำถี่ๆ เพราะระบบอาจจำกัดคำขอชั่วคราวเพื่อความปลอดภัย'],
        ['จ่ายเงินแล้วแต่ Pro ยังไม่ปลดล็อก?','อย่าซื้อซ้ำ ให้กู้คืนด้วยอีเมลที่ใช้ชำระเงินบน Ko-fi หากยังยืนยันสิทธิ์ไม่ได้ ให้ติดต่อฝ่ายช่วยเหลือพร้อมอีเมลรายการซื้อและรายละเอียดสั้นๆ'],
        ['กำลังจะซื้อ Pro?','Lifetime Pro ราคา 249 บาท ซื้อครั้งเดียว ไม่มีค่าสมาชิก Ko-fi ดูแลการชำระเงิน และ Benedict ยืนยันสิทธิ์หลังขั้นตอนการซื้อ'],
      ],
    },
    ja: {
      selecting:'選択中…',
      purchaseCards:[
        ['Pro を購入済みですか？','Ko-fi の決済に使用したメールアドレスをそのまま使って認証し、「復元」を選択してください。アプリで別のメールを入力していた場合も、Ko-fi の購入メールを使用します。'],
        ['再インストール・機種変更をしましたか？','Lifetime Pro は1回のインストールだけに固定されません。「購入・復元」を開き、確認済みの購入メールで復元してください。'],
        ['認証メールが届きませんか？','まず入力したメールアドレスを確認し、迷惑メールフォルダーも確認してください。短時間に何度も要求すると、安全のため一時的に制限される場合があります。'],
        ['支払い済みなのに Pro が有効になりませんか？','再購入しないでください。Ko-fi の決済メールで復元してください。それでも確認できない場合は、購入メールと状況を添えて購入サポートへ連絡してください。'],
        ['Pro を購入しますか？','Lifetime Pro は 249 THB の買い切りで、サブスクリプションではありません。決済は Ko-fi が処理し、購入後に Benedict が利用権を確認します。'],
      ],
    },
  };

  function language() {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
  }
  function copy() { return COPY[language()] || COPY.en; }
  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function ensureStyle() {
    if (byId(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Keep the approved silver gear clean while preserving its full touch target. */
      .header-settings.header-settings--premium{background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;padding:0!important;overflow:visible!important}
      .header-settings.header-settings--premium::before,.header-settings.header-settings--premium::after{content:none!important;display:none!important}
      .header-settings.header-settings--premium .header-premium-gear{display:block!important;width:clamp(31px,8.6vw,39px)!important;height:auto!important;max-width:none!important;filter:drop-shadow(0 3px 7px rgba(41,62,86,.15))!important;transition:transform .16s ease,filter .16s ease!important}
      .header-settings.header-settings--premium:active .header-premium-gear{transform:scale(.94)!important;filter:drop-shadow(0 2px 5px rgba(41,62,86,.13))!important}

      /* B84 Tool anatomy: descriptive copy owns a full row; controls never squeeze it into a narrow column. */
      #baLargeFiles .ba-large-control-row,#baOldFiles .ba-old-control-row{display:grid!important;grid-template-columns:minmax(0,1fr) auto auto!important;align-items:center!important;gap:8px!important}
      #baLargeFiles .ba-large-selection,#baOldFiles .ba-old-selection{grid-column:1/-1!important;width:100%!important;min-width:0!important;margin:0 0 3px!important}
      #baLargeFiles .ba-large-selection strong,#baOldFiles .ba-old-selection strong{max-width:38ch!important;font-size:13.5px!important;line-height:1.38!important;text-wrap:pretty!important;overflow-wrap:normal!important;word-break:normal!important}
      #baLargeFiles .ba-large-selection small,#baOldFiles .ba-old-selection small{margin-top:4px!important;line-height:1.35!important}
      #baLargeFiles .ba-large-sort,#baOldFiles .ba-old-sort{grid-column:1!important;width:100%!important;max-width:none!important;min-width:0!important}
      #baLargeFiles [data-final-select-all="large"],#baOldFiles [data-final-select-all="old"],#baLargeFiles .ba-large-clear,#baOldFiles .ba-old-clear{min-width:96px!important;padding-inline:13px!important;white-space:nowrap!important}

      /* Older Files metric dates: keep the value visually coherent instead of orphaning the year. */
      #baOldFiles .ba-old-overview{grid-template-columns:repeat(3,minmax(0,1fr))!important}
      #baOldFiles .ba-old-metric{min-width:0!important;padding-inline:8px!important}
      #baOldFiles .ba-old-metric b{font-size:clamp(16px,4.65vw,22px)!important;line-height:1.12!important;white-space:normal!important;text-wrap:balance!important;overflow:visible!important;text-overflow:clip!important;font-variant-numeric:tabular-nums!important}
      #baOldFiles .ba-old-metric span{line-height:1.28!important}

      /* Empty Folders: one intentional premium action bar, no giant accidental Select-all slab. */
      #baEmptySelection .ba-empty-selection{padding:10px 14px calc(10px + env(safe-area-inset-bottom))!important}
      #baEmptySelection .ba-empty-selection__inner{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1.18fr)!important;gap:8px!important;align-items:stretch!important}
      #baEmptySelection .ba-empty-selection__inner>div:first-child{grid-column:1/-1!important;padding:0 2px 2px!important}
      #baEmptySelection button{display:inline-flex!important;width:100%!important;min-width:0!important;min-height:46px!important;align-items:center!important;justify-content:center!important;padding:0 10px!important;border-radius:15px!important;font-size:11px!important;line-height:1.15!important;font-weight:780!important;white-space:nowrap!important}
      #baEmptySelection .ba-empty-secondary{background:rgba(255,255,255,.94)!important;border:1px solid rgba(73,108,137,.12)!important;color:#526d82!important;box-shadow:0 4px 14px rgba(51,82,108,.035)!important}
      #baEmptySelection .ba-empty-primary{background:linear-gradient(135deg,#6471d8,#27a1dc)!important;color:#fff!important;border:0!important;box-shadow:0 9px 22px rgba(64,91,184,.16)!important}
      #baEmptySelection button:disabled{opacity:.48!important;box-shadow:none!important}

      /* Shared list headings: important guidance must wrap naturally, never be ellipsized. */
      .ba-downloads-sectionhead,.ba-installers-sectionhead,.ba-archives-sectionhead,.ba-zero-sectionhead,.ba-empty-sectionhead,.ba-media-sectionhead{align-items:flex-start!important;gap:10px!important}
      .ba-downloads-sectionhead strong,.ba-installers-sectionhead strong,.ba-archives-sectionhead strong,.ba-zero-sectionhead strong,.ba-empty-sectionhead strong,.ba-media-sectionhead strong{min-width:0!important;max-width:42ch!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;text-wrap:pretty!important;overflow-wrap:normal!important;word-break:normal!important;line-height:1.42!important}
      .ba-downloads-sectionhead small,.ba-installers-sectionhead small,.ba-archives-sectionhead small,.ba-zero-sectionhead small,.ba-empty-sectionhead small,.ba-media-sectionhead small{flex:0 0 auto!important;line-height:1.35!important}

      /* First-class Japanese typography: no clipped ordinary UI copy and no English-derived fixed geometry. */
      html[lang^="ja"] body{font-family:system-ui,"Noto Sans JP","Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic UI","Yu Gothic",Meiryo,sans-serif!important;font-feature-settings:"palt" 0!important}
      html[lang^="ja"] #homeScreen .checkup-cta,html[lang^="ja"] #homeScreen .tool-card,html[lang^="ja"] #homeScreen .health-card,html[lang^="ja"] #homeScreen .editorial-card{height:auto!important;min-height:0!important}
      html[lang^="ja"] #homeScreen .checkup-cta{min-height:92px!important;padding-block:13px!important}
      html[lang^="ja"] #homeScreen .checkup-cta__copy{min-width:0!important;overflow:visible!important}
      html[lang^="ja"] #homeScreen .checkup-cta__copy strong{font-size:clamp(16px,4.5vw,20px)!important;line-height:1.34!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;word-break:keep-all!important;overflow-wrap:anywhere!important;line-break:strict!important}
      html[lang^="ja"] #homeScreen .checkup-cta__copy small{display:block!important;margin-top:5px!important;font-size:clamp(10.5px,3vw,12.5px)!important;line-height:1.62!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;word-break:normal!important;overflow-wrap:normal!important;line-break:strict!important}
      html[lang^="ja"] #homeScreen .tool-card{padding-block:12px!important}
      html[lang^="ja"] #homeScreen .tool-card strong,html[lang^="ja"] #homeScreen .tool-card small,html[lang^="ja"] #homeScreen .health-card strong,html[lang^="ja"] #homeScreen .health-card small,html[lang^="ja"] .setting-link strong,html[lang^="ja"] .setting-link small,html[lang^="ja"] .utility-list strong,html[lang^="ja"] .utility-list small{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;word-break:normal!important;overflow-wrap:normal!important;line-break:strict!important;height:auto!important;max-height:none!important}
      html[lang^="ja"] #homeScreen .tool-card strong{font-size:clamp(10.8px,3vw,13px)!important;line-height:1.42!important}
      html[lang^="ja"] #homeScreen .tool-card small{font-size:clamp(9px,2.55vw,11px)!important;line-height:1.52!important;margin-top:4px!important}
      html[lang^="ja"] .nav-button span{font-size:clamp(9px,2.55vw,11px)!important;line-height:1.35!important;white-space:nowrap!important;letter-spacing:0!important}
      html[lang^="ja"] .ba-large-selection strong,html[lang^="ja"] .ba-old-selection strong,html[lang^="ja"] .ba-downloads-sectionhead strong,html[lang^="ja"] .ba-installers-sectionhead strong,html[lang^="ja"] .ba-archives-sectionhead strong,html[lang^="ja"] .ba-zero-sectionhead strong,html[lang^="ja"] .ba-empty-sectionhead strong,html[lang^="ja"] .ba-media-sectionhead strong{line-height:1.58!important;letter-spacing:0!important;word-break:normal!important;overflow-wrap:normal!important;line-break:strict!important}

      /* Thai and English receive the same no-clipping guarantee for ordinary UI copy. */
      html[lang^="th"] .ba-large-selection strong,html[lang^="th"] .ba-old-selection strong,html[lang^="th"] .ba-downloads-sectionhead strong,html[lang^="th"] .ba-installers-sectionhead strong,html[lang^="th"] .ba-archives-sectionhead strong,html[lang^="th"] .ba-zero-sectionhead strong,html[lang^="th"] .ba-empty-sectionhead strong,html[lang^="th"] .ba-media-sectionhead strong{line-height:1.62!important;letter-spacing:0!important}

      /* Purchase help: compact self-service troubleshooting without turning the sheet into a wall of text. */
      #baFinalSupportSurface .ba-final-purchase-stack.ba-b84-purchase-stack{gap:8px!important}
      #baFinalSupportSurface .ba-final-purchase-stack.ba-b84-purchase-stack .ba-final-purchase-card{grid-template-columns:36px minmax(0,1fr)!important;gap:10px!important;padding:11px 12px!important;border-radius:17px!important}
      #baFinalSupportSurface .ba-final-purchase-stack.ba-b84-purchase-stack .ba-final-purchase-icon{width:36px!important;height:36px!important;border-radius:12px!important}
      #baFinalSupportSurface .ba-final-purchase-stack.ba-b84-purchase-stack .ba-final-purchase-icon svg{width:17px!important;height:17px!important}
      #baFinalSupportSurface .ba-final-purchase-stack.ba-b84-purchase-stack strong{font-size:11.6px!important;line-height:1.38!important}
      #baFinalSupportSurface .ba-final-purchase-stack.ba-b84-purchase-stack p{font-size:10px!important;line-height:1.52!important;margin-top:4px!important}
      html[lang^="th"] #baFinalSupportSurface .ba-final-purchase-stack.ba-b84-purchase-stack p,html[lang^="ja"] #baFinalSupportSurface .ba-final-purchase-stack.ba-b84-purchase-stack p{line-height:1.64!important}

      [data-final-select-all].ba-b84-working{cursor:progress!important;opacity:.78!important}
      @media(max-width:390px){
        #baLargeFiles .ba-large-control-row,#baOldFiles .ba-old-control-row{grid-template-columns:minmax(0,1fr) minmax(86px,auto)!important}
        #baLargeFiles .ba-large-sort,#baOldFiles .ba-old-sort{grid-column:1!important}
        #baLargeFiles [data-final-select-all="large"],#baOldFiles [data-final-select-all="old"]{grid-column:2!important;min-width:0!important}
        #baLargeFiles .ba-large-clear,#baOldFiles .ba-old-clear{grid-column:1/-1!important;width:100%!important}
        #baEmptySelection .ba-empty-selection__inner{grid-template-columns:1fr 1fr!important}
        #baEmptySelection .ba-empty-primary{grid-column:1/-1!important}
        html[lang^="ja"] #homeScreen .checkup-cta{min-height:98px!important}
      }
      @media(max-width:350px){
        #baEmptySelection .ba-empty-selection__inner{grid-template-columns:1fr!important}
        #baEmptySelection .ba-empty-selection__inner>div:first-child,#baEmptySelection .ba-empty-primary{grid-column:1!important}
        #baOldFiles .ba-old-metric b{font-size:15px!important}
      }
      @media(prefers-reduced-motion:reduce){[data-final-select-all]{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function purchaseIcon() {
    return '<span class="ba-final-purchase-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14v11H5z"></path><path d="m8 8 1.5-4h5L16 8"></path><path d="M9 13h6M12 10v6"></path></svg></span>';
  }

  function enrichPurchaseHelp() {
    const surface = byId('baFinalSupportSurface');
    if (!surface || surface.hidden) return;
    const stack = surface.querySelector('.ba-final-purchase-stack');
    if (!stack || stack.dataset.b84Language === language()) return;
    const cards = copy().purchaseCards;
    stack.classList.add('ba-b84-purchase-stack');
    stack.innerHTML = cards.map(([title, body]) =>
      `<article class="ba-final-purchase-card">${purchaseIcon()}<div><strong>${esc(title)}</strong><p>${esc(body)}</p></div></article>`
    ).join('');
    stack.dataset.b84Language = language();
  }

  function visibleBoxes(spec) {
    const surface = document.querySelector(spec.surface);
    if (!surface || surface.hidden) return [];
    return Array.from(surface.querySelectorAll(spec.checkbox)).filter((box) => !box.disabled);
  }

  function fastSelectAll(button, key) {
    const spec = BULK[key];
    if (!spec || button.disabled || button.dataset.b84Busy === '1') return;
    const boxes = visibleBoxes(spec).slice(0, spec.cap);
    if (!boxes.length) return;

    button.dataset.b84Busy = '1';
    button.classList.add('ba-b84-working');
    const original = button.textContent;
    button.textContent = copy().selecting;
    button.disabled = true;

    /* Let the pressed/busy state paint first. Existing per-tool change handlers remain
       the single source of selection truth; B84 only removes v83's artificial frame waits. */
    requestAnimationFrame(() => {
      const ids = boxes.map((box) => String(box.dataset[spec.dataKey] || '')).filter(Boolean);
      for (const id of ids) {
        const surface = document.querySelector(spec.surface);
        if (!surface || surface.hidden) break;
        const box = Array.from(surface.querySelectorAll(spec.checkbox)).find((node) => String(node.dataset[spec.dataKey] || '') === id);
        if (!box || box.disabled || box.checked) continue;
        box.checked = true;
        box.dispatchEvent(new Event('change', {bubbles:true}));
      }
      requestAnimationFrame(() => {
        const current = document.querySelector(`[data-final-select-all="${key}"]`);
        if (current) {
          current.dataset.b84Busy = '0';
          current.classList.remove('ba-b84-working');
          current.textContent = original;
        }
        window.dispatchEvent(new Event('resize'));
      });
    });
  }

  function onCaptureClick(event) {
    const button = event.target?.closest?.('[data-final-select-all]');
    if (!button) return;
    const key = String(button.dataset.finalSelectAll || '');
    if (!BULK[key]) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    fastSelectAll(button, key);
  }

  let refreshQueued = false;
  function refresh() {
    refreshQueued = false;
    ensureStyle();
    enrichPurchaseHelp();
  }
  function queueRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(refresh);
  }

  function initialize() {
    ensureStyle();
    document.addEventListener('click', onCaptureClick, true);
    const observer = new MutationObserver(queueRefresh);
    observer.observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['hidden','class','lang']});
    window.addEventListener('bearagnostic:languagechange', queueRefresh);
    window.addEventListener('bearagnostic:screenchange', queueRefresh);
    window.addEventListener('resize', queueRefresh, {passive:true});
    queueRefresh();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();

  window.BearagnosticHomePolish = Object.freeze({build:BUILD, refresh:queueRefresh});
})();
