(() => {
  'use strict';

  /*
   * Bearagnostic Android B85 premium visual & localization polish.
   * Narrow compatibility layer for the physically observed v84 design/localization defects:
   * - premium Tool action hierarchy and consistent header anatomy;
   * - intentional Older Files date typography and Empty Folders action anatomy;
   * - first-class EN/TH/JA responsive typography with Japanese semantic line breaks;
   * - compact FAQ and Purchase & Restore single-open accordions;
   * - preserved low-latency bulk selection through existing tool handlers.
   *
   * No scanner, deletion, entitlement, Restore, history or payment truth is changed.
   */
  const BUILD = 85;
  const STYLE_ID = 'androidHomePolish85Style';
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
      purchaseLead:'Choose the situation that matches what you need. This page only explains the next step; nothing changes until you choose an action.',
      purchaseOpen:'Open Purchase & Restore',
      purchaseContact:'Contact purchase support',
      purchaseCards:[
        ['Already paid for Pro?','Restore with your Ko-fi checkout email.','Use the exact email used at Ko-fi checkout. Verify that email, then choose Restore. If a different email was entered in the app, use the Ko-fi checkout email instead.'],
        ['Reinstalled or changed device?','Restore access — no need to buy again.','Your Lifetime Pro purchase is not tied to one installation. Open Purchase & Restore and restore with the same verified purchase email.'],
        ['Verification email not arriving?','Check the address, spam folder, then retry carefully.','Confirm the email address first, then check spam or junk. Avoid repeated requests in a short period because verification can be temporarily rate-limited for account protection.'],
        ['Paid, but Pro is still locked?','Restore first. Do not purchase again.','Use Restore with the Ko-fi checkout email. If access still cannot be verified, contact purchase support with the purchase email and a short description of what happened.'],
        ['Buying Pro?','249 THB once. No subscription.','Lifetime Pro is a one-time 249 THB purchase with no subscription. Ko-fi handles checkout; Benedict verifies entitlement after the purchase flow.'],
      ],
    },
    th: {
      selecting:'กำลังเลือก…',
      purchaseLead:'เลือกหัวข้อที่ตรงกับสิ่งที่ต้องการ หน้านี้มีไว้แนะนำขั้นตอนเท่านั้น จะไม่มีการเปลี่ยนสิทธิ์จนกว่าคุณจะเลือกดำเนินการเอง',
      purchaseOpen:'เปิดการซื้อและกู้คืน',
      purchaseContact:'ติดต่อฝ่ายช่วยเหลือการซื้อ',
      purchaseCards:[
        ['ชำระเงินซื้อ Pro แล้ว?','กู้คืนด้วยอีเมลที่ใช้ชำระเงินบน Ko-fi','ใช้อีเมลเดียวกับที่ใช้ชำระเงินบน Ko-fi ยืนยันอีเมลนั้นแล้วเลือกกู้คืน หากเคยกรอกอีเมลอื่นในแอป ให้ใช้อีเมลจากรายการซื้อ Ko-fi แทน'],
        ['ติดตั้งใหม่หรือเปลี่ยนเครื่อง?','กู้คืนสิทธิ์ได้ ไม่ต้องซื้อซ้ำ','สิทธิ์ Lifetime Pro ไม่ได้ผูกกับการติดตั้งครั้งเดียว เปิดการซื้อและกู้คืน แล้วกู้คืนด้วยอีเมลรายการซื้อเดิมที่ยืนยันแล้ว'],
        ['ไม่ได้รับอีเมลยืนยัน?','ตรวจอีเมล โฟลเดอร์สแปม แล้วค่อยลองใหม่','ตรวจสอบอีเมลที่กรอกก่อน แล้วดูโฟลเดอร์สแปมหรือจดหมายขยะ หลีกเลี่ยงการขอรหัสซ้ำถี่ๆ เพราะระบบอาจจำกัดคำขอชั่วคราวเพื่อความปลอดภัย'],
        ['จ่ายเงินแล้วแต่ Pro ยังไม่ปลดล็อก?','กู้คืนก่อน และไม่ต้องซื้อซ้ำ','กู้คืนด้วยอีเมลที่ใช้ชำระเงินบน Ko-fi หากยังยืนยันสิทธิ์ไม่ได้ ให้ติดต่อฝ่ายช่วยเหลือพร้อมอีเมลรายการซื้อและรายละเอียดสั้นๆ'],
        ['กำลังจะซื้อ Pro?','249 บาทครั้งเดียว ไม่มีค่าสมาชิก','Lifetime Pro ราคา 249 บาท ซื้อครั้งเดียว ไม่มีค่าสมาชิก Ko-fi ดูแลการชำระเงิน และ Benedict ยืนยันสิทธิ์หลังขั้นตอนการซื้อ'],
      ],
    },
    ja: {
      selecting:'選択中…',
      purchaseLead:'状況に合う項目を選んでください。この画面は次の手順を案内するだけで、操作を選ぶまで利用権は変更されません。',
      purchaseOpen:'購入・復元を開く',
      purchaseContact:'購入サポートに連絡',
      purchaseCards:[
        ['Pro を購入済みですか？','Ko-fi の購入メールで復元します。','Ko-fi の決済に使用したメールアドレスをそのまま使って認証し、「復元」を選択してください。アプリで別のメールを入力していた場合も、Ko-fi の購入メールを使用します。'],
        ['再インストール・機種変更をしましたか？','再購入せずに復元できます。','Lifetime Pro は1回のインストールだけに固定されません。「購入・復元」を開き、確認済みの購入メールで復元してください。'],
        ['認証メールが届きませんか？','入力先と迷惑メールを確認してから再試行します。','まず入力したメールアドレスを確認し、迷惑メールフォルダーも確認してください。短時間に何度も要求すると、安全のため一時的に制限される場合があります。'],
        ['支払い済みなのに Pro が有効になりませんか？','先に復元してください。再購入は不要です。','Ko-fi の決済メールで復元してください。それでも確認できない場合は、購入メールと状況を添えて購入サポートへ連絡してください。'],
        ['Pro を購入しますか？','249 THB の買い切り。サブスクなし。','Lifetime Pro は 249 THB の買い切りで、サブスクリプションではありません。決済は Ko-fi が処理し、購入後に Benedict が利用権を確認します。'],
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

      /* B85 Tool anatomy: descriptive copy owns a full row; controls never squeeze it into a narrow column. */
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
      #baFinalSupportSurface .ba-final-purchase-stack.ba-b85-purchase-stack{gap:8px!important}
      #baFinalSupportSurface .ba-final-purchase-stack.ba-b85-purchase-stack .ba-final-purchase-card{grid-template-columns:36px minmax(0,1fr)!important;gap:10px!important;padding:11px 12px!important;border-radius:17px!important}
      #baFinalSupportSurface .ba-final-purchase-stack.ba-b85-purchase-stack .ba-final-purchase-icon{width:36px!important;height:36px!important;border-radius:12px!important}
      #baFinalSupportSurface .ba-final-purchase-stack.ba-b85-purchase-stack .ba-final-purchase-icon svg{width:17px!important;height:17px!important}
      #baFinalSupportSurface .ba-final-purchase-stack.ba-b85-purchase-stack strong{font-size:11.6px!important;line-height:1.38!important}
      #baFinalSupportSurface .ba-final-purchase-stack.ba-b85-purchase-stack p{font-size:10px!important;line-height:1.52!important;margin-top:4px!important}
      html[lang^="th"] #baFinalSupportSurface .ba-final-purchase-stack.ba-b85-purchase-stack p,html[lang^="ja"] #baFinalSupportSurface .ba-final-purchase-stack.ba-b85-purchase-stack p{line-height:1.64!important}

      [data-final-select-all].ba-b85-working{cursor:progress!important;opacity:.78!important}
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

      /* B85 — premium Tool control hierarchy: sort owns a row; utilities are a balanced pair. */
      #baLargeFiles .ba-large-control-row,#baOldFiles .ba-old-control-row{
        display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;align-items:stretch!important
      }
      #baLargeFiles .ba-large-selection,#baOldFiles .ba-old-selection{grid-column:1/-1!important;margin:0 0 4px!important}
      #baLargeFiles .ba-large-sort,#baOldFiles .ba-old-sort{
        grid-column:1/-1!important;width:100%!important;max-width:none!important;height:44px!important;padding-inline:14px 34px!important;
        border-radius:15px!important;background:linear-gradient(180deg,#f7f9fc,#f1f5f9)!important;border:1px solid rgba(77,107,137,.10)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.96)!important;font-size:11.2px!important
      }
      #baLargeFiles [data-final-select-all="large"],#baOldFiles [data-final-select-all="old"],#baLargeFiles .ba-large-clear,#baOldFiles .ba-old-clear{
        grid-column:auto!important;width:100%!important;min-width:0!important;height:44px!important;padding-inline:12px!important;border-radius:15px!important;
        background:linear-gradient(180deg,rgba(249,251,253,.98),rgba(241,245,249,.98))!important;border:1px solid rgba(78,108,137,.10)!important;
        color:#607489!important;font-size:11px!important;font-weight:780!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.96),0 4px 14px rgba(54,80,105,.035)!important
      }
      #baLargeFiles [data-final-select-all="large"]:not(:disabled),#baOldFiles [data-final-select-all="old"]:not(:disabled){color:#4d6780!important;background:linear-gradient(180deg,#fff,#f5f8fb)!important}
      #baLargeFiles .ba-large-clear:disabled,#baOldFiles .ba-old-clear:disabled{opacity:.46!important;box-shadow:none!important}

      /* B85 — Tool hero headers: identity icon anchors to the title zone; close control owns the top-right safe corner. */
      #baLargeFiles .ba-large-head,#baOldFiles .ba-old-head,.ba-qc .ba-qc-head,.ba-dup .ba-dup-head{
        align-items:start!important
      }
      #baLargeFiles .ba-large-mark,#baOldFiles .ba-old-mark,.ba-qc .ba-qc-mark,.ba-dup .ba-dup-mark{align-self:start!important;margin-top:2px!important}
      #baLargeFiles .ba-large-close,#baOldFiles .ba-old-close,.ba-qc .ba-qc-close,.ba-dup .ba-dup-close{
        align-self:start!important;justify-self:end!important;margin-top:-4px!important;display:grid!important;place-items:center!important
      }
      #baLargeFiles .ba-large-head>div,#baOldFiles .ba-old-head>div,.ba-qc .ba-qc-head-copy,.ba-dup .ba-dup-head-copy{min-width:0!important}

      /* B85 — compact Tool headers use one consistent optical edge and touch target. */
      .ba-downloads-head,.ba-installers-head,.ba-archives-head,.ba-zero-head,.ba-empty-head,.ba-media-head{
        padding-top:max(10px,env(safe-area-inset-top))!important;padding-right:14px!important;padding-left:14px!important
      }
      .ba-downloads-close,.ba-installers-close,.ba-archives-close,.ba-zero-close,.ba-empty-close,.ba-media-close{justify-self:end!important}

      /* B85 — intentional Older Files date hierarchy, not accidental wrapping. */
      #baOldFiles .ba-old-metric:nth-child(3){display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important}
      #baOldFiles .ba-v85-oldest-value{display:flex!important;min-height:42px!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:1px!important;white-space:normal!important}
      #baOldFiles .ba-v85-date-main{display:block;font-size:clamp(17px,4.75vw,21px)!important;line-height:1.04!important;font-weight:540!important;letter-spacing:-.025em!important;white-space:nowrap!important}
      #baOldFiles .ba-v85-date-year{display:block;font-size:clamp(12.5px,3.65vw,15.5px)!important;line-height:1.1!important;font-weight:610!important;letter-spacing:.01em!important;white-space:nowrap!important;color:#40566c!important}
      #baOldFiles .ba-v85-oldest-value.is-single{display:grid!important;place-items:center!important;font-size:clamp(15.5px,4.25vw,19px)!important;line-height:1.15!important;white-space:nowrap!important}

      /* B85 — Empty Folders action bar: summary, paired utilities, then one clear primary decision. */
      #baEmptySelection .ba-empty-selection__inner{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;align-items:stretch!important}
      #baEmptySelection .ba-empty-selection__inner>div:first-child{grid-column:1/-1!important;padding:0 2px 2px!important}
      #baEmptySelection [data-final-select-all="empty"],#baEmptySelection [data-empty-action="clear"]{grid-column:auto!important}
      #baEmptySelection [data-empty-action="review"]{grid-column:1/-1!important;min-height:48px!important}
      #baEmptySelection button{min-height:44px!important;border-radius:15px!important}

      /* B85 — Japanese Home has designed line breaks and aligned card anatomy rather than Latin geometry. */
      html[lang^="ja"] #homeScreen .checkup-cta__copy small{word-break:keep-all!important;overflow-wrap:normal!important;line-break:strict!important;text-wrap:pretty!important}
      html[lang^="ja"] #homeScreen .ba-v85-ja-unit{white-space:nowrap!important}
      html[lang^="ja"] #homeScreen .quick-tools{align-items:stretch!important}
      html[lang^="ja"] #homeScreen .tool-card{
        display:grid!important;grid-template-rows:58px minmax(2.85em,auto) minmax(1.55em,auto)!important;align-content:start!important;align-items:start!important;justify-items:center!important;
        min-height:150px!important;height:100%!important;padding:12px 5px 10px!important
      }
      html[lang^="ja"] #homeScreen .tool-card__icon{align-self:start!important;justify-self:center!important;margin:0 auto 7px!important}
      html[lang^="ja"] #homeScreen .tool-card>strong{align-self:start!important;width:100%!important;margin:0!important;text-align:center!important;font-size:clamp(10.8px,3vw,12.8px)!important;line-height:1.42!important;font-weight:720!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;word-break:keep-all!important;overflow-wrap:normal!important;line-break:strict!important}
      html[lang^="ja"] #homeScreen .tool-card>small{align-self:end!important;width:100%!important;margin:4px 0 0!important;text-align:center!important;font-size:clamp(9px,2.48vw,10.6px)!important;line-height:1.45!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;word-break:keep-all!important;overflow-wrap:normal!important;line-break:strict!important}
      html[lang^="ja"] #homeScreen .editorial-card__quote{width:61%!important;padding-left:clamp(15px,4vw,21px)!important;padding-right:4px!important}
      html[lang^="ja"] #homeScreen .editorial-card blockquote{font-size:clamp(14.2px,3.95vw,17px)!important;line-height:1.5!important;letter-spacing:0!important;word-break:keep-all!important;overflow-wrap:normal!important;line-break:strict!important;text-wrap:pretty!important}
      html[lang^="ja"] #homeScreen .editorial-card small{margin-top:7px!important;line-height:1.25!important}
      html[lang^="ja"] .nav-button span{font-size:clamp(9.4px,2.55vw,10.8px)!important;line-height:1.25!important;letter-spacing:0!important;white-space:nowrap!important}

      /* B85 — customer-facing multilingual copy expands vertically; filenames/paths keep their intentional ellipsis. */
      html[lang^="ja"] .utility-head h2,html[lang^="ja"] .utility-head p,html[lang^="ja"] .settings-title-row h2,html[lang^="ja"] .settings-title-row p,
      html[lang^="ja"] .ba-final-support-head h2,html[lang^="ja"] .ba-final-support-lead,html[lang^="ja"] .ba-final-faq-question strong,html[lang^="ja"] .ba-final-faq-answer,
      html[lang^="ja"] .ba-final-purchase-card strong,html[lang^="ja"] .ba-final-purchase-card small,html[lang^="ja"] .ba-final-purchase-card p,
      html[lang^="ja"] .ba-large-head h2,html[lang^="ja"] .ba-large-head p,html[lang^="ja"] .ba-old-head h2,html[lang^="ja"] .ba-old-head p,
      html[lang^="ja"] .ba-empty-title,html[lang^="ja"] .ba-empty-lead,html[lang^="ja"] .ba-media-title,html[lang^="ja"] .ba-media-lead{
        white-space:normal!important;overflow:visible!important;text-overflow:clip!important;word-break:normal!important;overflow-wrap:normal!important;line-break:strict!important;height:auto!important;max-height:none!important
      }
      html[lang^="th"] .utility-head h2,html[lang^="th"] .utility-head p,html[lang^="th"] .settings-title-row h2,html[lang^="th"] .settings-title-row p,
      html[lang^="th"] .ba-final-support-head h2,html[lang^="th"] .ba-final-support-lead,html[lang^="th"] .ba-final-faq-question strong,html[lang^="th"] .ba-final-faq-answer,
      html[lang^="th"] .ba-final-purchase-card strong,html[lang^="th"] .ba-final-purchase-card small,html[lang^="th"] .ba-final-purchase-card p{
        white-space:normal!important;overflow:visible!important;text-overflow:clip!important;overflow-wrap:break-word!important;height:auto!important;max-height:none!important;letter-spacing:0!important
      }

      /* B85 — FAQ/Purchase support are calm, compact single-open accordions. */
      #baFinalSupportSurface .ba-final-faq-list{gap:9px!important}
      #baFinalSupportSurface .ba-final-faq-card{border-radius:18px!important;background:rgba(255,255,255,.91)!important;border:1px solid rgba(92,113,151,.085)!important;box-shadow:0 7px 20px rgba(54,79,109,.04),inset 0 1px 0 rgba(255,255,255,.98)!important}
      #baFinalSupportSurface .ba-final-faq-question{min-height:58px!important;padding:11px 12px!important;grid-template-columns:36px minmax(0,1fr) 22px!important}
      #baFinalSupportSurface .ba-final-faq-answer{padding:0 15px 14px 58px!important}
      #baFinalSupportSurface .ba-final-purchase-stack.ba-b85-purchase-stack{display:grid!important;gap:8px!important;margin-top:10px!important}
      #baFinalSupportSurface .ba-b85-purchase-card{overflow:hidden!important;border-radius:18px!important;background:rgba(255,255,255,.92)!important;border:1px solid rgba(94,113,148,.085)!important;box-shadow:0 7px 20px rgba(54,77,108,.04),inset 0 1px 0 rgba(255,255,255,.98)!important}
      #baFinalSupportSurface .ba-b85-purchase-toggle{width:100%!important;display:grid!important;grid-template-columns:38px minmax(0,1fr) 20px!important;gap:10px!important;align-items:center!important;padding:11px 12px!important;text-align:left!important;background:transparent!important;color:#334c62!important}
      #baFinalSupportSurface .ba-b85-purchase-toggle .ba-final-purchase-icon{width:38px!important;height:38px!important;border-radius:13px!important}
      #baFinalSupportSurface .ba-b85-purchase-toggle strong{display:block!important;font-size:11.7px!important;line-height:1.36!important;color:#354e63!important}
      #baFinalSupportSurface .ba-b85-purchase-toggle small{display:block!important;margin-top:3px!important;font-size:9.6px!important;line-height:1.42!important;color:#8492a0!important}
      #baFinalSupportSurface .ba-b85-purchase-chevron{font-size:20px!important;line-height:1!important;color:#8a77cd!important;transition:transform .18s ease!important}
      #baFinalSupportSurface .ba-b85-purchase-toggle[aria-expanded="true"] .ba-b85-purchase-chevron{transform:rotate(90deg)!important}
      #baFinalSupportSurface .ba-b85-purchase-answer{padding:0 14px 13px 60px!important;font-size:10px!important;line-height:1.56!important;color:#728497!important}
      #baFinalSupportSurface .ba-b85-purchase-answer[hidden]{display:none!important}
      #baFinalSupportSurface .ba-final-purchase-boundary{display:none!important}
      #baFinalSupportSurface .ba-final-purchase-actions{grid-template-columns:1fr!important;gap:8px!important;margin-top:11px!important}
      #baFinalSupportSurface .ba-final-purchase-actions button{min-height:46px!important;border-radius:15px!important}
      @media(max-width:390px){
        #baLargeFiles .ba-large-head,#baOldFiles .ba-old-head{padding-top:16px!important;padding-left:14px!important;padding-right:14px!important}
        #baLargeFiles .ba-large-mark,#baOldFiles .ba-old-mark{margin-top:1px!important}
        #baLargeFiles .ba-large-close,#baOldFiles .ba-old-close{margin-top:-3px!important}
        html[lang^="ja"] #homeScreen .tool-card{min-height:146px!important;padding-inline:4px!important}
        html[lang^="ja"] #homeScreen .editorial-card__quote{width:62%!important;padding-left:14px!important}
      }
      @media(max-width:350px){
        #baLargeFiles .ba-large-control-row,#baOldFiles .ba-old-control-row{grid-template-columns:1fr 1fr!important}
        #baLargeFiles [data-final-select-all="large"],#baOldFiles [data-final-select-all="old"],#baLargeFiles .ba-large-clear,#baOldFiles .ba-old-clear{font-size:10.4px!important;padding-inline:8px!important}
        html[lang^="ja"] #homeScreen .tool-card{min-height:142px!important}
      }
      @media(prefers-reduced-motion:reduce){#baFinalSupportSurface .ba-b85-purchase-chevron{transition:none!important}}

    `;
    document.head.appendChild(style);
  }

  function purchaseIcon() {
    return '<span class="ba-final-purchase-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14v11H5z"></path><path d="m8 8 1.5-4h5L16 8"></path><path d="M9 13h6M12 10v6"></path></svg></span>';
  }

  function enrichPurchaseHelp() {
    const surface = byId('baFinalSupportSurface');
    if (!surface || surface.hidden || surface.dataset.kind !== 'purchase') return;
    const stack = surface.querySelector('.ba-final-purchase-stack');
    if (!stack || stack.dataset.b85Language === language()) return;
    const t = copy();
    const lead = surface.querySelector('.ba-final-support-lead');
    if (lead) lead.textContent = t.purchaseLead;
    const open = surface.querySelector('[data-final-purchase-open]');
    const contact = surface.querySelector('[data-final-purchase-contact]');
    if (open) open.textContent = t.purchaseOpen;
    if (contact) contact.textContent = t.purchaseContact;
    stack.classList.add('ba-b85-purchase-stack');
    stack.innerHTML = t.purchaseCards.map(([title, summary, body], index) =>
      `<article class="ba-b85-purchase-card"><button class="ba-b85-purchase-toggle" type="button" data-b85-purchase-toggle aria-expanded="false" aria-controls="baV85PurchaseAnswer${index}">` +
      `${purchaseIcon()}<span><strong>${esc(title)}</strong><small>${esc(summary)}</small></span><span class="ba-b85-purchase-chevron" aria-hidden="true">›</span></button>` +
      `<div class="ba-b85-purchase-answer" id="baV85PurchaseAnswer${index}" hidden>${esc(body)}</div></article>`
    ).join('');
    stack.dataset.b85Language = language();
  }

  function ensureFaqCollapsed() {
    const surface = byId('baFinalSupportSurface');
    if (!surface || surface.hidden || surface.dataset.kind !== 'faq') return;
    const list = surface.querySelector('.ba-final-faq-list');
    if (!list || list.dataset.b85Initialized === language()) return;
    list.querySelectorAll('[data-final-faq-toggle]').forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
      const answer = button.parentElement?.querySelector('.ba-final-faq-answer');
      if (answer) answer.hidden = true;
    });
    list.dataset.b85Initialized = language();
  }

  function visibleBoxes(spec) {
    const surface = document.querySelector(spec.surface);
    if (!surface || surface.hidden) return [];
    return Array.from(surface.querySelectorAll(spec.checkbox)).filter((box) => !box.disabled);
  }

  function fastSelectAll(button, key) {
    const spec = BULK[key];
    if (!spec || button.disabled || button.dataset.b85Busy === '1') return;
    const boxes = visibleBoxes(spec).slice(0, spec.cap);
    if (!boxes.length) return;

    button.dataset.b85Busy = '1';
    button.classList.add('ba-b85-working');
    const original = button.textContent;
    button.textContent = copy().selecting;
    button.disabled = true;

    /* Let the pressed/busy state paint first. Existing per-tool change handlers remain
       the single source of selection truth; B85 only removes v83's artificial frame waits. */
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
          current.dataset.b85Busy = '0';
          current.classList.remove('ba-b85-working');
          current.textContent = original;
        }
        window.dispatchEvent(new Event('resize'));
      });
    });
  }

  function closeSiblingAccordions(button, selector, answerSelector) {
    const scope = button.closest('.ba-final-faq-list,.ba-final-purchase-stack');
    if (!scope) return;
    scope.querySelectorAll(selector).forEach((other) => {
      if (other === button) return;
      other.setAttribute('aria-expanded', 'false');
      const answer = other.closest('article')?.querySelector(answerSelector);
      if (answer) answer.hidden = true;
    });
  }

  function onCaptureClick(event) {
    const faq = event.target?.closest?.('[data-final-faq-toggle]');
    if (faq) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const wasOpen = faq.getAttribute('aria-expanded') === 'true';
      closeSiblingAccordions(faq, '[data-final-faq-toggle]', '.ba-final-faq-answer');
      faq.setAttribute('aria-expanded', wasOpen ? 'false' : 'true');
      const answer = faq.parentElement?.querySelector('.ba-final-faq-answer');
      if (answer) answer.hidden = wasOpen;
      return;
    }

    const purchase = event.target?.closest?.('[data-b85-purchase-toggle]');
    if (purchase) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const wasOpen = purchase.getAttribute('aria-expanded') === 'true';
      closeSiblingAccordions(purchase, '[data-b85-purchase-toggle]', '.ba-b85-purchase-answer');
      purchase.setAttribute('aria-expanded', wasOpen ? 'false' : 'true');
      const answer = purchase.closest('article')?.querySelector('.ba-b85-purchase-answer');
      if (answer) answer.hidden = wasOpen;
      return;
    }

    const button = event.target?.closest?.('[data-final-select-all]');
    if (!button) return;
    const key = String(button.dataset.finalSelectAll || '');
    if (!BULK[key]) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    fastSelectAll(button, key);
  }

  function setClearState(surfaceSelector, checkboxSelector, clearSelector, summarySelector) {
    const surface = document.querySelector(surfaceSelector);
    if (!surface || surface.hidden) return;
    const clear = surface.querySelector(clearSelector);
    if (!clear) return;
    const visibleSelected = Array.from(surface.querySelectorAll(checkboxSelector)).some((box) => box.checked && !box.disabled);
    const summaryText = String(surface.querySelector(summarySelector)?.textContent || '');
    const countMatch = summaryText.match(/[0-9０-９]+/);
    const normalized = countMatch ? countMatch[0].replace(/[０-９]/g, (digit) => String('０１２３４５６７８９'.indexOf(digit))) : '0';
    const anySelected = visibleSelected || Number(normalized) > 0;
    clear.disabled = !anySelected;
    clear.setAttribute('aria-disabled', anySelected ? 'false' : 'true');
  }

  function syncUtilityStates() {
    setClearState('#baLargeFiles','[data-large-id]','#baLargeClear','#baLargeFooterSelected');
    setClearState('#baOldFiles','[data-old-id]','#baOldClear','#baOldFooterSelected');
  }

  function splitDateValue(raw) {
    const value = String(raw || '').trim();
    const lang = language();
    if (!value) return {main:'',year:'',single:true};
    if (lang === 'en') {
      const match = value.match(/^(.*?)[,]?\s+(\d{4})$/);
      if (match) return {main:match[1].replace(/,$/,''),year:match[2],single:false};
    }
    if (lang === 'th') {
      const match = value.match(/^(.*?)\s+(\d{4})$/);
      if (match && match[1]) return {main:match[1],year:match[2],single:false};
    }
    return {main:value,year:'',single:true};
  }

  function polishOldestMetric() {
    const value = document.querySelector('#baOldFiles .ba-old-overview .ba-old-metric:nth-child(3) b');
    if (!value || value.dataset.b85Date === language()) return;
    const raw = value.textContent;
    const parts = splitDateValue(raw);
    value.classList.add('ba-v85-oldest-value');
    value.classList.toggle('is-single', parts.single);
    value.innerHTML = parts.single
      ? `<span class="ba-v85-date-main">${esc(parts.main)}</span>`
      : `<span class="ba-v85-date-main">${esc(parts.main)}</span><span class="ba-v85-date-year">${esc(parts.year)}</span>`;
    value.dataset.b85Date = language();
  }

  function setSemanticJapanese(node, parts) {
    if (!node || language() !== 'ja') return;
    const signature = parts.join('|');
    if (node.dataset.b85Japanese === signature) return;
    node.innerHTML = parts.map((part, index) => `${index ? '<wbr>' : ''}<span class="ba-v85-ja-unit">${esc(part)}</span>`).join('');
    node.dataset.b85Japanese = signature;
  }

  function polishJapaneseHome() {
    if (language() !== 'ja') return;
    setSemanticJapanese(document.querySelector('#homeScreen .checkup-cta__copy small'), ['ファイルやフォルダを選んで','解析。']);
    setSemanticJapanese(document.querySelector('#homeScreen .editorial-card blockquote'), ['デバイスが整うと、','気持ちにも少し','余白が生まれる。']);
  }

  let refreshQueued = false;
  function refresh() {
    refreshQueued = false;
    ensureStyle();
    ensureFaqCollapsed();
    enrichPurchaseHelp();
    polishOldestMetric();
    polishJapaneseHome();
    syncUtilityStates();
  }
  function queueRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(refresh);
  }

  function initialize() {
    ensureStyle();
    document.addEventListener('click', onCaptureClick, true);
    document.addEventListener('change', queueRefresh, true);
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
