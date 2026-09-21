(() => {
  'use strict';

  /*
   * Bearagnostic Android B86 physical-regression corrective layer.
   * This module is intentionally loaded LAST after android-final-polish.js.
   * It owns only the defects proven on the B85 physical-device screenshots:
   * - safe scroll-cue placement (never over an actionable control/footer);
   * - compact Tool surfaces starting at the true top edge;
   * - source-context return from the Zero-byte generic fallback;
   * - collapsed-by-default, single-open FAQ + Purchase/Restore help;
   * - Japanese Home geometry that respects the approved zero-scroll grid;
   * - the previously accepted Large/Older/Empty bulk-control polish.
   *
   * Scanner, deletion, entitlement, Restore, history and payment truth are untouched.
   */
  const BUILD = 86;
  const STYLE_ID = 'androidHomePolish86Style';
  const SUPPORT_ID = 'baFinalSupportOverlay';
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
      purchaseLead:'Choose the situation that matches what you need. Nothing changes until you choose an action.',
      purchaseOpen:'Open Purchase & Restore', purchaseContact:'Contact purchase support',
      purchaseCards:[
        ['Already paid for Pro?','Restore with your Ko-fi checkout email.','Use the exact email used at Ko-fi checkout. Verify that email, then choose Restore. If you entered another email in the app, use the Ko-fi checkout email instead.'],
        ['Reinstalled or changed device?','Restore access — no need to buy again.','Lifetime Pro is not tied to one installation. Open Purchase & Restore and restore with the same verified purchase email.'],
        ['Verification email not arriving?','Check the address and spam folder, then retry.','Confirm the email address first, then check spam or junk. Avoid repeated requests in a short period because verification can be temporarily rate-limited for account protection.'],
        ['Paid, but Pro is still locked?','Restore first. Do not purchase again.','Use Restore with the Ko-fi checkout email. If access still cannot be verified, contact purchase support with the purchase email and a short description of what happened.'],
        ['Buying Pro?','249 THB once. No subscription.','Lifetime Pro is a one-time 249 THB purchase with no subscription. Ko-fi handles checkout; Benedict verifies entitlement after the purchase flow.'],
      ],
    },
    th: {
      selecting:'กำลังเลือก…',
      purchaseLead:'เลือกหัวข้อที่ตรงกับสิ่งที่ต้องการ หน้านี้เป็นเพียงคำแนะนำ จะไม่มีการเปลี่ยนสิทธิ์จนกว่าคุณจะเลือกดำเนินการเอง',
      purchaseOpen:'เปิดการซื้อและกู้คืน', purchaseContact:'ติดต่อฝ่ายช่วยเหลือการซื้อ',
      purchaseCards:[
        ['ชำระเงินซื้อ Pro แล้ว?','กู้คืนด้วยอีเมลที่ใช้ชำระเงินบน Ko-fi','ใช้อีเมลเดียวกับที่ใช้ชำระเงินบน Ko-fi ยืนยันอีเมลนั้นแล้วเลือกกู้คืน หากเคยกรอกอีเมลอื่นในแอป ให้ใช้อีเมลจากรายการซื้อ Ko-fi แทน'],
        ['ติดตั้งใหม่หรือเปลี่ยนเครื่อง?','กู้คืนสิทธิ์ได้ ไม่ต้องซื้อซ้ำ','สิทธิ์ Lifetime Pro ไม่ได้ผูกกับการติดตั้งครั้งเดียว เปิดการซื้อและกู้คืน แล้วกู้คืนด้วยอีเมลรายการซื้อเดิมที่ยืนยันแล้ว'],
        ['ไม่ได้รับอีเมลยืนยัน?','ตรวจอีเมลและโฟลเดอร์สแปม แล้วค่อยลองใหม่','ตรวจสอบอีเมลที่กรอกก่อน แล้วดูโฟลเดอร์สแปมหรือจดหมายขยะ หลีกเลี่ยงการขอรหัสซ้ำถี่ๆ เพราะระบบอาจจำกัดคำขอชั่วคราวเพื่อความปลอดภัย'],
        ['จ่ายเงินแล้วแต่ Pro ยังไม่ปลดล็อก?','กู้คืนก่อน และไม่ต้องซื้อซ้ำ','กู้คืนด้วยอีเมลที่ใช้ชำระเงินบน Ko-fi หากยังยืนยันสิทธิ์ไม่ได้ ให้ติดต่อฝ่ายช่วยเหลือพร้อมอีเมลรายการซื้อและรายละเอียดสั้นๆ'],
        ['กำลังจะซื้อ Pro?','249 บาทครั้งเดียว ไม่มีค่าสมาชิก','Lifetime Pro ราคา 249 บาท ซื้อครั้งเดียว ไม่มีค่าสมาชิก Ko-fi ดูแลการชำระเงิน และ Benedict ยืนยันสิทธิ์หลังขั้นตอนการซื้อ'],
      ],
    },
    ja: {
      selecting:'選択中…',
      purchaseLead:'状況に合う項目を選んでください。操作を選ぶまで利用権は変更されません。',
      purchaseOpen:'購入・復元を開く', purchaseContact:'購入サポートに連絡',
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
  function visible(element) {
    if (!element || element.hidden) return false;
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function ensureStyle() {
    if (byId(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Preserve the approved premium gear. */
      .header-settings.header-settings--premium{background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;padding:0!important;overflow:visible!important}
      .header-settings.header-settings--premium::before,.header-settings.header-settings--premium::after{content:none!important;display:none!important}
      .header-settings.header-settings--premium .header-premium-gear{display:block!important;width:clamp(31px,8.6vw,39px)!important;height:auto!important;max-width:none!important;filter:drop-shadow(0 3px 7px rgba(41,62,86,.15))!important}

      /* Large / Older: guidance gets its own row, then sort, then balanced utility actions. */
      #baLargeFiles .ba-large-control-row,#baOldFiles .ba-old-control-row{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;align-items:stretch!important}
      #baLargeFiles .ba-large-selection,#baOldFiles .ba-old-selection{grid-column:1/-1!important;width:100%!important;min-width:0!important;margin:0 0 4px!important}
      #baLargeFiles .ba-large-selection strong,#baOldFiles .ba-old-selection strong{max-width:42ch!important;font-size:13.5px!important;line-height:1.38!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;word-break:normal!important}
      #baLargeFiles .ba-large-selection small,#baOldFiles .ba-old-selection small{margin-top:4px!important;line-height:1.35!important}
      #baLargeFiles .ba-large-sort,#baOldFiles .ba-old-sort{grid-column:1/-1!important;width:100%!important;max-width:none!important;min-width:0!important;height:44px!important;padding-inline:14px 34px!important;border-radius:15px!important;background:linear-gradient(180deg,#f7f9fc,#f1f5f9)!important;border:1px solid rgba(77,107,137,.10)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.96)!important;font-size:11.2px!important}
      #baLargeFiles [data-final-select-all="large"],#baOldFiles [data-final-select-all="old"],#baLargeFiles .ba-large-clear,#baOldFiles .ba-old-clear{grid-column:auto!important;width:100%!important;min-width:0!important;height:44px!important;padding-inline:12px!important;border-radius:15px!important;background:linear-gradient(180deg,rgba(249,251,253,.98),rgba(241,245,249,.98))!important;border:1px solid rgba(78,108,137,.10)!important;color:#607489!important;font-size:11px!important;font-weight:780!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.96),0 4px 14px rgba(54,80,105,.035)!important}
      #baLargeFiles .ba-large-clear:disabled,#baOldFiles .ba-old-clear:disabled{opacity:.46!important;box-shadow:none!important}

      /* Tool hero headers: icon belongs to the title zone; close owns the top-right corner. */
      #baLargeFiles .ba-large-head,#baOldFiles .ba-old-head,.ba-qc .ba-qc-head,.ba-dup .ba-dup-head{align-items:start!important}
      #baLargeFiles .ba-large-mark,#baOldFiles .ba-old-mark,.ba-qc .ba-qc-mark,.ba-dup .ba-dup-mark{align-self:start!important;margin-top:2px!important}
      #baLargeFiles .ba-large-close,#baOldFiles .ba-old-close,.ba-qc .ba-qc-close,.ba-dup .ba-dup-close{align-self:start!important;justify-self:end!important;margin-top:-4px!important;display:grid!important;place-items:center!important}

      /* Compact Tool surfaces: remove the detached top band. The header itself owns top spacing. */
      #baDownloadsSurface,#baInstallersSurface,#baArchivesSurface,#baZeroSurface,#baEmptySurface,#baMediaSurface{padding-top:0!important}
      .ba-downloads-head,.ba-installers-head,.ba-archives-head,.ba-zero-head,.ba-empty-head,.ba-media-head{box-sizing:border-box!important;min-height:64px!important;padding:12px 14px 10px!important;margin-top:0!important;align-items:center!important}
      .ba-downloads-close,.ba-installers-close,.ba-archives-close,.ba-zero-close,.ba-empty-close,.ba-media-close{justify-self:end!important}

      /* Older Files date is intentionally typeset rather than accidentally wrapped. */
      #baOldFiles .ba-old-metric:nth-child(3){display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important}
      #baOldFiles .ba-v86-oldest-value{display:flex!important;min-height:42px!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:1px!important;white-space:normal!important}
      #baOldFiles .ba-v86-date-main{display:block;font-size:clamp(17px,4.75vw,21px)!important;line-height:1.04!important;font-weight:540!important;letter-spacing:-.025em!important;white-space:nowrap!important}
      #baOldFiles .ba-v86-date-year{display:block;font-size:clamp(12.5px,3.65vw,15.5px)!important;line-height:1.1!important;font-weight:610!important;letter-spacing:.01em!important;white-space:nowrap!important;color:#40566c!important}
      #baOldFiles .ba-v86-oldest-value.is-single{display:grid!important;place-items:center!important;font-size:clamp(15.5px,4.25vw,19px)!important;line-height:1.15!important;white-space:nowrap!important}

      /* Empty Folders: summary, paired utilities, then one primary action. */
      #baEmptySelection .ba-empty-selection__inner{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;align-items:stretch!important}
      #baEmptySelection .ba-empty-selection__inner>div:first-child{grid-column:1/-1!important;padding:0 2px 2px!important}
      #baEmptySelection [data-final-select-all="empty"],#baEmptySelection [data-empty-action="clear"]{grid-column:auto!important}
      #baEmptySelection [data-empty-action="review"]{grid-column:1/-1!important;min-height:48px!important}
      #baEmptySelection button{width:100%!important;min-width:0!important;min-height:44px!important;border-radius:15px!important}

      /* Scroll affordance is retained only where it has neutral visual space. */
      #baScrollCue.ba-v86-collision-safe-hide{opacity:0!important;visibility:hidden!important}

      /* B86 Japanese Home: respect the fixed zero-scroll grid. Never grow a child beyond its row. */
      html[lang^="ja"] #homeScreen{overflow:hidden!important}
      html[lang^="ja"] #homeScreen .checkup-cta,html[lang^="ja"] #homeScreen .tool-card,html[lang^="ja"] #homeScreen .health-card,html[lang^="ja"] #homeScreen .editorial-card{height:100%!important;min-height:0!important;max-height:100%!important;box-sizing:border-box!important}
      html[lang^="ja"] #homeScreen .checkup-cta{padding-block:8px!important}
      html[lang^="ja"] #homeScreen .checkup-cta__copy{min-width:0!important;overflow:visible!important}
      html[lang^="ja"] #homeScreen .checkup-cta__copy strong{font-size:clamp(16.5px,4.55vw,20px)!important;line-height:1.22!important;white-space:nowrap!important;letter-spacing:0!important}
      html[lang^="ja"] #homeScreen .checkup-cta__copy small{display:block!important;margin-top:4px!important;font-size:clamp(9.6px,2.7vw,11.2px)!important;line-height:1.42!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;word-break:keep-all!important;overflow-wrap:normal!important;line-break:strict!important;letter-spacing:0!important}
      html[lang^="ja"] #homeScreen .quick-tools{min-height:0!important;height:100%!important;align-items:stretch!important}
      html[lang^="ja"] #homeScreen .tool-card{display:grid!important;grid-template-rows:44px 1.35em 1.3em!important;align-content:center!important;align-items:center!important;justify-items:center!important;gap:3px!important;padding:5px 3px!important;overflow:hidden!important}
      html[lang^="ja"] #homeScreen .tool-card__icon{width:44px!important;height:44px!important;align-self:center!important;justify-self:center!important;margin:0!important}
      html[lang^="ja"] #homeScreen .tool-card>strong{width:100%!important;margin:0!important;text-align:center!important;font-size:clamp(9.6px,2.65vw,11.2px)!important;line-height:1.22!important;font-weight:720!important;white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important;word-break:keep-all!important;letter-spacing:0!important}
      html[lang^="ja"] #homeScreen .tool-card>small{width:100%!important;margin:0!important;text-align:center!important;font-size:clamp(8.1px,2.25vw,9.5px)!important;line-height:1.24!important;white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important;word-break:keep-all!important;letter-spacing:0!important}
      html[lang^="ja"] #homeScreen .health-card{overflow:hidden!important}
      html[lang^="ja"] #homeScreen .health-card__copy strong{white-space:nowrap!important;font-size:clamp(15px,4.2vw,19px)!important;line-height:1.2!important}
      html[lang^="ja"] #homeScreen .health-card__copy small{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:clamp(9px,2.45vw,10.8px)!important}
      html[lang^="ja"] #homeScreen .editorial-card{overflow:hidden!important}
      html[lang^="ja"] #homeScreen .editorial-card__quote{width:58%!important;padding-left:clamp(13px,3.6vw,18px)!important;padding-right:3px!important}
      html[lang^="ja"] #homeScreen .editorial-card blockquote{font-size:clamp(12.5px,3.5vw,15.5px)!important;line-height:1.38!important;letter-spacing:0!important;white-space:normal!important;word-break:keep-all!important;overflow-wrap:normal!important;line-break:strict!important}
      html[lang^="ja"] #homeScreen .editorial-card small{margin-top:5px!important;font-size:clamp(7.6px,2.05vw,9px)!important;line-height:1.2!important}
      html[lang^="ja"] .nav-button span{font-size:clamp(9px,2.45vw,10.5px)!important;line-height:1.2!important;letter-spacing:0!important;white-space:nowrap!important}
      html[lang^="ja"] .ba-v86-ja-unit{white-space:nowrap!important}

      /* FAQ + Purchase/Restore: collapsed-by-default, compact and genuinely problem-oriented. */
      #${SUPPORT_ID} .ba-final-faq-list{gap:9px!important}
      #${SUPPORT_ID} .ba-final-faq-card{border-radius:18px!important;background:rgba(255,255,255,.91)!important;border:1px solid rgba(92,113,151,.085)!important;box-shadow:0 7px 20px rgba(54,79,109,.04),inset 0 1px 0 rgba(255,255,255,.98)!important}
      #${SUPPORT_ID} .ba-final-faq-question{min-height:58px!important;padding:11px 12px!important;grid-template-columns:36px minmax(0,1fr) 22px!important}
      #${SUPPORT_ID} .ba-final-faq-answer{padding:0 15px 14px 58px!important}
      #${SUPPORT_ID} .ba-v86-purchase-stack{display:grid!important;gap:8px!important;margin-top:10px!important}
      #${SUPPORT_ID} .ba-v86-purchase-card{overflow:hidden!important;border-radius:18px!important;background:rgba(255,255,255,.92)!important;border:1px solid rgba(94,113,148,.085)!important;box-shadow:0 7px 20px rgba(54,77,108,.04),inset 0 1px 0 rgba(255,255,255,.98)!important}
      #${SUPPORT_ID} .ba-v86-purchase-toggle{width:100%!important;display:grid!important;grid-template-columns:38px minmax(0,1fr) 20px!important;gap:10px!important;align-items:center!important;padding:11px 12px!important;text-align:left!important;background:transparent!important;color:#334c62!important}
      #${SUPPORT_ID} .ba-v86-purchase-toggle .ba-final-purchase-icon{width:38px!important;height:38px!important;border-radius:13px!important}
      #${SUPPORT_ID} .ba-v86-purchase-toggle strong{display:block!important;font-size:11.7px!important;line-height:1.36!important;color:#354e63!important}
      #${SUPPORT_ID} .ba-v86-purchase-toggle small{display:block!important;margin-top:3px!important;font-size:9.6px!important;line-height:1.42!important;color:#8492a0!important}
      #${SUPPORT_ID} .ba-v86-purchase-chevron{font-size:20px!important;line-height:1!important;color:#8a77cd!important;transition:transform .18s ease!important}
      #${SUPPORT_ID} .ba-v86-purchase-toggle[aria-expanded="true"] .ba-v86-purchase-chevron{transform:rotate(90deg)!important}
      #${SUPPORT_ID} .ba-v86-purchase-answer{padding:0 14px 13px 60px!important;font-size:10px!important;line-height:1.56!important;color:#728497!important}
      #${SUPPORT_ID} .ba-v86-purchase-answer[hidden]{display:none!important}
      #${SUPPORT_ID} .ba-final-purchase-boundary{display:none!important}
      #${SUPPORT_ID} .ba-final-purchase-actions{grid-template-columns:1fr!important;gap:8px!important;margin-top:11px!important}
      #${SUPPORT_ID} .ba-final-purchase-actions button{min-height:46px!important;border-radius:15px!important}
      html[lang^="th"] #${SUPPORT_ID} .ba-final-support-head h2,html[lang^="th"] #${SUPPORT_ID} .ba-final-support-lead,html[lang^="th"] #${SUPPORT_ID} .ba-final-faq-question strong,html[lang^="th"] #${SUPPORT_ID} .ba-final-faq-answer,
      html[lang^="ja"] #${SUPPORT_ID} .ba-final-support-head h2,html[lang^="ja"] #${SUPPORT_ID} .ba-final-support-lead,html[lang^="ja"] #${SUPPORT_ID} .ba-final-faq-question strong,html[lang^="ja"] #${SUPPORT_ID} .ba-final-faq-answer{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;height:auto!important;max-height:none!important;letter-spacing:0!important}

      [data-final-select-all].ba-v86-working{cursor:progress!important;opacity:.78!important}
      @media(max-width:390px){
        #baLargeFiles .ba-large-head,#baOldFiles .ba-old-head{padding-top:16px!important;padding-left:14px!important;padding-right:14px!important}
        html[lang^="ja"] #homeScreen .tool-card{grid-template-rows:42px 1.3em 1.25em!important;padding-inline:2px!important}
        html[lang^="ja"] #homeScreen .tool-card__icon{width:42px!important;height:42px!important}
      }
      @media(max-width:350px){
        #baEmptySelection .ba-empty-selection__inner{grid-template-columns:1fr!important}
        #baEmptySelection .ba-empty-selection__inner>div:first-child,#baEmptySelection [data-empty-action="review"]{grid-column:1!important}
        html[lang^="ja"] #homeScreen .tool-card{grid-template-rows:40px 1.25em 1.2em!important;gap:2px!important}
        html[lang^="ja"] #homeScreen .tool-card__icon{width:40px!important;height:40px!important}
        html[lang^="ja"] #homeScreen .tool-card>strong{font-size:9.2px!important}
        html[lang^="ja"] #homeScreen .tool-card>small{font-size:7.8px!important}
      }
      @media(prefers-reduced-motion:reduce){#${SUPPORT_ID} .ba-v86-purchase-chevron{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function purchaseIcon() {
    return '<span class="ba-final-purchase-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14v11H5z"></path><path d="m8 8 1.5-4h5L16 8"></path><path d="M9 13h6M12 10v6"></path></svg></span>';
  }

  function ensureFaqCollapsed() {
    const surface = byId(SUPPORT_ID);
    if (!surface || surface.hidden || surface.dataset.kind !== 'faq') return;
    const list = surface.querySelector('.ba-final-faq-list');
    if (!list || list.dataset.v86Initialized === language()) return;
    list.querySelectorAll('[data-final-faq-toggle]').forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
      const answer = button.closest('article')?.querySelector('.ba-final-faq-answer');
      if (answer) answer.hidden = true;
    });
    list.dataset.v86Initialized = language();
  }

  function enrichPurchaseHelp() {
    const surface = byId(SUPPORT_ID);
    if (!surface || surface.hidden || surface.dataset.kind !== 'purchase') return;
    const stack = surface.querySelector('.ba-final-purchase-stack');
    if (!stack || stack.dataset.v86Language === language()) return;
    const t = copy();
    const lead = surface.querySelector('.ba-final-support-lead');
    if (lead) lead.textContent = t.purchaseLead;
    const open = surface.querySelector('[data-final-purchase-open]');
    const contact = surface.querySelector('[data-final-purchase-contact]');
    if (open) open.textContent = t.purchaseOpen;
    if (contact) contact.textContent = t.purchaseContact;
    stack.classList.add('ba-v86-purchase-stack');
    stack.innerHTML = t.purchaseCards.map(([title, summary, body], index) =>
      `<article class="ba-v86-purchase-card"><button class="ba-v86-purchase-toggle" type="button" data-v86-purchase-toggle aria-expanded="false" aria-controls="baV86PurchaseAnswer${index}">` +
      `${purchaseIcon()}<span><strong>${esc(title)}</strong><small>${esc(summary)}</small></span><span class="ba-v86-purchase-chevron" aria-hidden="true">›</span></button>` +
      `<div class="ba-v86-purchase-answer" id="baV86PurchaseAnswer${index}" hidden>${esc(body)}</div></article>`
    ).join('');
    stack.dataset.v86Language = language();
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

  function visibleBoxes(spec) {
    const surface = document.querySelector(spec.surface);
    if (!surface || surface.hidden) return [];
    return Array.from(surface.querySelectorAll(spec.checkbox)).filter((box) => !box.disabled);
  }

  function fastSelectAll(button, key) {
    const spec = BULK[key];
    if (!spec || button.disabled || button.dataset.v86Busy === '1') return;
    const boxes = visibleBoxes(spec).slice(0, spec.cap);
    if (!boxes.length) return;
    button.dataset.v86Busy = '1';
    button.classList.add('ba-v86-working');
    const original = button.textContent;
    button.textContent = copy().selecting;
    button.disabled = true;
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
          current.dataset.v86Busy = '0';
          current.classList.remove('ba-v86-working');
          current.textContent = original;
        }
      });
    });
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
    if (!value) return {main:'',year:'',single:true};
    if (language() === 'en') {
      const match = value.match(/^(.*?)[,]?\s+(\d{4})$/);
      if (match) return {main:match[1].replace(/,$/,''),year:match[2],single:false};
    }
    if (language() === 'th') {
      const match = value.match(/^(.*?)\s+(\d{4})$/);
      if (match && match[1]) return {main:match[1],year:match[2],single:false};
    }
    return {main:value,year:'',single:true};
  }

  function polishOldestMetric() {
    const value = document.querySelector('#baOldFiles .ba-old-overview .ba-old-metric:nth-child(3) b');
    if (!value || value.dataset.v86Date === language()) return;
    const parts = splitDateValue(value.textContent);
    value.className = `${value.className || ''} ba-v86-oldest-value`.trim();
    value.classList.toggle('is-single', parts.single);
    value.innerHTML = parts.single
      ? `<span class="ba-v86-date-main">${esc(parts.main)}</span>`
      : `<span class="ba-v86-date-main">${esc(parts.main)}</span><span class="ba-v86-date-year">${esc(parts.year)}</span>`;
    value.dataset.v86Date = language();
  }

  function polishJapaneseHome() {
    if (language() !== 'ja') return;
    const cta = document.querySelector('#homeScreen .checkup-cta__copy small');
    if (cta && cta.dataset.v86Ja !== 'cta') {
      cta.innerHTML = '<span class="ba-v86-ja-unit">ファイルやフォルダを選んで</span><br><span class="ba-v86-ja-unit">解析。</span>';
      cta.dataset.v86Ja = 'cta';
    }
    const quote = document.querySelector('#homeScreen .editorial-card blockquote');
    if (quote && quote.dataset.v86Ja !== 'quote') {
      quote.innerHTML = '<span class="ba-v86-ja-unit">デバイスが整うと、</span><br><span class="ba-v86-ja-unit">気持ちにも少し</span><br><span class="ba-v86-ja-unit">余白が生まれる。</span>';
      quote.dataset.v86Ja = 'quote';
    }
  }

  /* Preserve origin when Final Polish falls back from the dedicated Zero-byte Tool
     to the generic native review. Default native-review navigation is untouched. */
  let zeroToolVisibleBefore = false;
  let zeroToolJourney = false;
  function trackZeroReturnContext() {
    const zero = byId('baZeroSurface');
    const zeroVisible = visible(zero);
    if (zeroVisible) {
      zeroToolVisibleBefore = true;
      zeroToolJourney = true;
    }
    const review = byId('nativeReviewSheet');
    const zeroReview = visible(review) && /zero|0\s*byte/i.test(String(byId('nativeReviewTitle')?.textContent || ''));
    if (zeroReview && zeroToolJourney) review.dataset.v86Return = 'tools';
    if (!zeroVisible && zeroToolVisibleBefore && !zeroReview) {
      zeroToolVisibleBefore = false;
      zeroToolJourney = false;
    }
  }

  function rectsNear(a, b, gap = 10) {
    return a.right + gap > b.left && a.left - gap < b.right && a.bottom + gap > b.top && a.top - gap < b.bottom;
  }

  let cueTimer = 0;
  function applyCueSafety() {
    cueTimer = 0;
    const cue = byId('baScrollCue');
    if (!cue) return;
    cue.classList.remove('ba-v86-collision-safe-hide');
    if (!cue.classList.contains('is-visible') || !visible(cue)) return;
    const cueRect = cue.getBoundingClientRect();
    const blockers = document.querySelectorAll([
      '.native-review-footer','.native-results-footer','.ba-qc-footer','.ba-dup-footer','.ba-large-footer','.ba-old-footer',
      '#baDownloadsSelection','#baInstallersSelection','#baArchivesSelection','#baZeroSelection','#baEmptySelection','#baMediaSelection',
      '#nativeModeSheet:not([hidden]) button','#nativeReviewSheet:not([hidden]) button','#nativeResultsSheet:not([hidden]) button',
      '.ba-qc:not([hidden]) button','.ba-dup:not([hidden]) button','.ba-large:not([hidden]) button','.ba-old:not([hidden]) button',
      '#baDownloadsSurface:not([hidden]) button','#baInstallersSurface:not([hidden]) button','#baArchivesSurface:not([hidden]) button',
      '#baZeroSurface:not([hidden]) button','#baEmptySurface:not([hidden]) button','#baMediaSurface:not([hidden]) button'
    ].join(','));
    const collision = Array.from(blockers).some((node) => {
      if (!visible(node) || node.closest('#baScrollCue')) return false;
      return rectsNear(cueRect, node.getBoundingClientRect(), 10);
    });
    cue.classList.toggle('ba-v86-collision-safe-hide', collision);
  }
  function scheduleCueSafety() {
    clearTimeout(cueTimer);
    cueTimer = window.setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(applyCueSafety)), 0);
  }

  function onPointerOrigin(event) {
    const zeroTool = event.target?.closest?.('[data-tool="zero"]');
    if (zeroTool && !zeroTool.closest?.('#baZeroSurface')) zeroToolJourney = true;
  }

  function onCaptureClick(event) {
    const nativeBack = event.target?.closest?.('#nativeReviewBack');
    if (nativeBack) {
      const review = byId('nativeReviewSheet');
      if (review?.dataset.v86Return === 'tools') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        review.hidden = true;
        delete review.dataset.v86Return;
        zeroToolJourney = false;
        zeroToolVisibleBefore = false;
        const tools = document.querySelector('.bottom-nav .nav-button[data-nav="tools"]');
        if (tools) tools.click();
        return;
      }
    }

    const faq = event.target?.closest?.('[data-final-faq-toggle]');
    if (faq && faq.closest(`#${SUPPORT_ID}`)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const wasOpen = faq.getAttribute('aria-expanded') === 'true';
      closeSiblingAccordions(faq, '[data-final-faq-toggle]', '.ba-final-faq-answer');
      faq.setAttribute('aria-expanded', wasOpen ? 'false' : 'true');
      const answer = faq.closest('article')?.querySelector('.ba-final-faq-answer');
      if (answer) answer.hidden = wasOpen;
      return;
    }

    const purchase = event.target?.closest?.('[data-v86-purchase-toggle]');
    if (purchase) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const wasOpen = purchase.getAttribute('aria-expanded') === 'true';
      closeSiblingAccordions(purchase, '[data-v86-purchase-toggle]', '.ba-v86-purchase-answer');
      purchase.setAttribute('aria-expanded', wasOpen ? 'false' : 'true');
      const answer = purchase.closest('article')?.querySelector('.ba-v86-purchase-answer');
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

  let refreshQueued = false;
  function refresh() {
    refreshQueued = false;
    ensureStyle();
    ensureFaqCollapsed();
    enrichPurchaseHelp();
    polishOldestMetric();
    polishJapaneseHome();
    syncUtilityStates();
    trackZeroReturnContext();
    scheduleCueSafety();
  }
  function queueRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(() => requestAnimationFrame(refresh));
  }

  function initialize() {
    ensureStyle();
    document.addEventListener('pointerdown', onPointerOrigin, true);
    document.addEventListener('click', onCaptureClick, true);
    document.addEventListener('change', queueRefresh, true);
    document.addEventListener('scroll', scheduleCueSafety, {capture:true, passive:true});
    const observer = new MutationObserver(queueRefresh);
    observer.observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['hidden','lang','data-kind']});
    window.addEventListener('bearagnostic:languagechange', queueRefresh);
    window.addEventListener('bearagnostic:screenchange', queueRefresh);
    window.addEventListener('resize', queueRefresh, {passive:true});
    queueRefresh();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();

  window.BearagnosticHomePolish = Object.freeze({build:BUILD, refresh:queueRefresh});
})();
