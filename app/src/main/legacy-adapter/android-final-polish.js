(() => {
  'use strict';

  /*
   * Bearagnostic Android Final Polish (v82 corrective candidate)
   *
   * Cross-build Final Polish hardening:
   * - preserves debug entitlement controls only when the native debug contract exposes them;
   * - premium Help & Support gateway with dedicated FAQ/contact surfaces;
   * - safe bulk-selection convenience through each tool's existing handlers;
   * - zero-byte truth fallback to the proven generic native review;
   * - scroll-cue, Insights and EN/TH/JA layout hardening;
   * - no scanner, delete, entitlement, restore, history or payment-truth mutation.
   */
  const STYLE_ID = 'androidFinalPolishStyle';
  const SUPPORT_OVERLAY_ID = 'baFinalSupportOverlay';
  const SNAPSHOT_MAX_AGE_MS = 15 * 60 * 1000;
  const SUPPORT_EMAIL = 'benedict.support@gmail.com';

  const HELP_ICONS = Object.freeze({
    faq:'<circle cx="12" cy="12" r="8"/><path d="M9.7 9.5a2.5 2.5 0 1 1 4.4 1.6c-1.3 1.2-2.1 1.5-2.1 3"/><path d="M12 17h.01"/>',
    contact:'<rect x="4" y="5" width="16" height="14" rx="3"/><path d="m5.5 7 6.5 5 6.5-5"/>',
    purchase:'<path d="M5 8h14v11H5z"/><path d="m8 8 1.5-4h5L16 8"/><path d="M9 13h6M12 10v6"/>',
    report:'<path d="M6 3h9l3 3v15H6z"/><path d="M9 10h6M9 14h4"/><path d="M14.5 4v3H18"/>',
    feedback:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    diagnostics:'<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.1 2.2 3.2 4.9 3.2 8S14.1 17.8 12 20c-2.1-2.2-3.2-4.9-3.2-8S9.9 6.2 12 4"/>'
  });

  const COPY = Object.freeze({
    en: {
      helpKicker:'SUPPORT',
      helpTitle:'Help & Support',
      helpSub:'Help, purchase & restore, feedback, and problem reports.',
      helpLead:'Help with Bearagnostic, Pro access, feedback, and support in one place.',
      helpGroup:'HELP & ACCESS',
      contactGroup:'FEEDBACK & DIAGNOSTICS',
      faq:'Help / FAQ', faqSub:'Quick answers about privacy, cleanup safety, and Pro restore.',
      contact:'Contact Benedict Interactive', contactSub:'Talk to Benedict Interactive Support by email.',
      purchase:'Purchase & Restore help', purchaseSub:'Buy Pro, restore a verified purchase, or check access.',
      report:'Report a Problem', reportSub:'Tell us what happened inside Bearagnostic.',
      feedback:'Send Feedback', feedbackSub:'Share an idea or tell us what could be better.',
      diagnostics:'Copy Diagnostic Info', diagnosticsSub:'Copy non-sensitive app and device details.',
      faqEyebrow:'HELP / FAQ', faqTitle:'Quick answers, clearly explained.',
      faqLead:'Privacy, cleanup safety, and Pro restore — without digging through settings.',
      faqPrivacyQ:'Does Bearagnostic upload my files?',
      faqPrivacyA:'No. Selected file contents are analyzed locally and are not uploaded by the current app.',
      faqDeleteQ:'Will Bearagnostic delete files automatically?',
      faqDeleteA:'No. Deletion requires your selection, review, and confirmation. Existing protection and keep-one-copy safeguards still apply.',
      faqRestoreQ:'How do I restore Pro?',
      faqRestoreA:'Open Purchase & Restore, enter the email used for the verified Ko-fi purchase, complete email verification, then restore the lifetime entitlement.',
      contactEyebrow:'BENEDICT SUPPORT', contactTitle:'Contact Benedict Interactive',
      contactLead:'Need help from a person? Start a support email here and send it only when you are ready.',
      contactEmailLabel:'SUPPORT EMAIL',
      contactTipTitle:'For faster help',
      contactTipBody:'For an app problem, Report a Problem can prepare an email with safe technical details. Never include passwords, payment details, private file names, or file paths.',
      contactOpen:'Open email app', contactCopy:'Copy email', contactCopied:'Support email copied.',
      contactFallback:'Could not open an email app. The support address was copied instead.',
      close:'Close',
      diagnosticsCopied:'Diagnostic info copied.', copyFailed:'Could not copy automatically.',
      proTitle:'Lifetime Pro · 249 THB',
      proBody:'Buy or restore Bearagnostic Pro through the verified Ko-fi purchase flow. One-time purchase. No subscription.',
      proActiveTitle:'Bearagnostic Pro is active', proActiveBody:'Lifetime Pro is verified for this installation.',
      selectAll:'Select all', clearAll:'Clear all', selectExtras:'Select all extras',
      privacyTitle:'Privacy',
      privacyBody:'Bearagnostic is local-first. File analysis, previews, and aggregate Insights history stay on your device, and selected file contents are not uploaded. Purchase and restore contact the Benedict entitlement service only when you start those actions; Ko-fi handles checkout. Support links use the network only when you choose to open them.',
      thirdPartyTitle:'Third-Party Notices',
      thirdPartyBody:'Android and other third-party components, services, fonts, libraries, marks, and materials remain subject to their own licences and terms. Bearagnostic does not claim ownership of third-party or public-domain material. A valid third-party licence controls for its component where applicable.'
    },
    th: {
      helpKicker:'ช่วยเหลือ',
      helpTitle:'ช่วยเหลือและสนับสนุน',
      helpSub:'คู่มือ การซื้อและกู้คืน Pro ข้อเสนอแนะ และแจ้งปัญหา',
      helpLead:'รวมคู่มือ การจัดการสิทธิ์ Pro ข้อเสนอแนะ และช่องทางขอความช่วยเหลือไว้ในที่เดียว',
      helpGroup:'คู่มือและสิทธิ์การใช้งาน',
      contactGroup:'ติดต่อและข้อมูลวินิจฉัย',
      faq:'คู่มือ / คำถามที่พบบ่อย', faqSub:'คำตอบสั้นๆ เรื่องความเป็นส่วนตัว ความปลอดภัยในการลบ และการกู้คืน Pro',
      contact:'ติดต่อ Benedict Interactive', contactSub:'ติดต่อฝ่ายสนับสนุน Benedict Interactive ทางอีเมล',
      purchase:'ช่วยเหลือเรื่องซื้อและกู้คืน Pro', purchaseSub:'ซื้อ Pro กู้คืนรายการซื้อที่ยืนยันแล้ว หรือตรวจสอบสิทธิ์',
      report:'รายงานปัญหา', reportSub:'บอกเราว่าเกิดอะไรขึ้นภายใน Bearagnostic',
      feedback:'ส่งข้อเสนอแนะ', feedbackSub:'แบ่งปันไอเดียหรือบอกว่าส่วนไหนควรปรับปรุง',
      diagnostics:'คัดลอกข้อมูลทางเทคนิค', diagnosticsSub:'คัดลอกเฉพาะข้อมูลแอปและอุปกรณ์ที่ไม่ละเอียดอ่อน',
      faqEyebrow:'คู่มือ / FAQ', faqTitle:'คำตอบสำคัญที่อ่านเข้าใจง่าย',
      faqLead:'เรื่องความเป็นส่วนตัว ความปลอดภัยในการลบ และการกู้คืน Pro รวมไว้ให้หาได้ทันที',
      faqPrivacyQ:'Bearagnostic อัปโหลดไฟล์ของฉันหรือไม่?',
      faqPrivacyA:'ไม่ เนื้อหาไฟล์ที่เลือกจะถูกวิเคราะห์ภายในอุปกรณ์ และแอปเวอร์ชันปัจจุบันไม่อัปโหลดเนื้อหาไฟล์เหล่านั้น',
      faqDeleteQ:'Bearagnostic จะลบไฟล์ให้อัตโนมัติหรือไม่?',
      faqDeleteA:'ไม่ การลบต้องผ่านการเลือก ตรวจทาน และยืนยันจากคุณ โดยระบบ Protected และการเก็บไฟล์ซ้ำไว้อย่างน้อยหนึ่งสำเนายังคงทำงานตามเดิม',
      faqRestoreQ:'จะกู้คืน Pro ได้อย่างไร?',
      faqRestoreA:'เปิดเมนูซื้อและกู้คืน ใช้อีเมลเดียวกับรายการซื้อ Ko-fi ที่ยืนยันแล้ว ยืนยันอีเมล จากนั้นกู้คืนสิทธิ์ Pro แบบตลอดชีพ',
      contactEyebrow:'BENEDICT SUPPORT', contactTitle:'ติดต่อ Benedict Interactive',
      contactLead:'ต้องการคุยกับฝ่ายสนับสนุนโดยตรง? เปิดอีเมลจากหน้านี้ แล้วกดส่งเมื่อคุณตรวจข้อความเรียบร้อยแล้ว',
      contactEmailLabel:'อีเมลฝ่ายสนับสนุน',
      contactTipTitle:'เพื่อให้ช่วยได้เร็วขึ้น',
      contactTipBody:'ถ้าเป็นปัญหาการใช้งาน เมนูรายงานปัญหาจะช่วยเตรียมอีเมลพร้อมข้อมูลทางเทคนิคที่ปลอดภัย กรุณาอย่าใส่รหัสผ่าน ข้อมูลการชำระเงิน ชื่อไฟล์ส่วนตัว หรือพาธไฟล์',
      contactOpen:'เปิดแอปอีเมล', contactCopy:'คัดลอกอีเมล', contactCopied:'คัดลอกอีเมลฝ่ายสนับสนุนแล้ว',
      contactFallback:'เปิดแอปอีเมลไม่ได้ ระบบจึงคัดลอกอีเมลฝ่ายสนับสนุนไว้ให้แล้ว',
      close:'ปิด',
      diagnosticsCopied:'คัดลอกข้อมูลทางเทคนิคแล้ว', copyFailed:'ไม่สามารถคัดลอกให้อัตโนมัติได้',
      proTitle:'Lifetime Pro · 249 บาท',
      proBody:'ซื้อหรือกู้คืน Bearagnostic Pro ผ่านขั้นตอนการซื้อ Ko-fi ที่ตรวจสอบสิทธิ์แล้ว ซื้อครั้งเดียว ไม่มีค่าสมาชิกรายเดือน',
      proActiveTitle:'Bearagnostic Pro เปิดใช้งานแล้ว', proActiveBody:'สิทธิ์ Lifetime Pro ได้รับการยืนยันสำหรับการติดตั้งนี้แล้ว',
      selectAll:'เลือกทั้งหมด', clearAll:'ล้างที่เลือกทั้งหมด', selectExtras:'เลือกไฟล์ซ้ำส่วนเกินทั้งหมด',
      privacyTitle:'ความเป็นส่วนตัว',
      privacyBody:'Bearagnostic ออกแบบแบบ local-first การวิเคราะห์ไฟล์ พรีวิว และประวัติ Insights แบบสรุปอยู่บนอุปกรณ์ และไม่มีการอัปโหลดเนื้อหาไฟล์ที่เลือก การซื้อและกู้คืนจะติดต่อบริการสิทธิ์ของ Benedict เฉพาะเมื่อคุณเริ่มขั้นตอนนั้น โดย Ko-fi เป็นผู้ดูแลการชำระเงิน ส่วนลิงก์ช่วยเหลือจะใช้อินเทอร์เน็ตเมื่อคุณเลือกเปิดเท่านั้น',
      thirdPartyTitle:'ประกาศเกี่ยวกับบุคคลที่สาม',
      thirdPartyBody:'Android และ component บริการ ฟอนต์ ไลบรารี เครื่องหมาย และวัสดุของบุคคลที่สาม อยู่ภายใต้ licence และเงื่อนไขของเจ้าของแต่ละราย Bearagnostic ไม่อ้างกรรมสิทธิ์เหนือวัสดุของบุคคลที่สามหรือสาธารณสมบัติ และ licence ที่มีผลใช้บังคับย่อมมีผลกับ component นั้น'
    },
    ja: {
      helpKicker:'サポート',
      helpTitle:'ヘルプとサポート',
      helpSub:'ヘルプ、購入・復元、フィードバック、問題報告。',
      helpLead:'Bearagnostic の使い方、Pro の購入・復元、フィードバック、サポートを一か所にまとめています。',
      helpGroup:'ヘルプとアクセス',
      contactGroup:'連絡・診断',
      faq:'ヘルプ / FAQ', faqSub:'プライバシー、削除の安全性、Pro の復元について確認できます。',
      contact:'Benedict Interactive に連絡', contactSub:'Benedict Interactive Support へメールで連絡します。',
      purchase:'購入・復元のヘルプ', purchaseSub:'Pro の購入、確認済み購入の復元、アクセス状態の確認。',
      report:'問題を報告', reportSub:'Bearagnostic で起きたことをお知らせください。',
      feedback:'フィードバックを送る', feedbackSub:'アイデアや改善してほしい点を共有してください。',
      diagnostics:'診断情報をコピー', diagnosticsSub:'機密性のないアプリと端末の情報をコピーします。',
      faqEyebrow:'ヘルプ / FAQ', faqTitle:'必要な答えを、分かりやすく。',
      faqLead:'プライバシー、削除の安全性、Pro の復元をすぐに確認できます。',
      faqPrivacyQ:'Bearagnostic はファイルをアップロードしますか？',
      faqPrivacyA:'いいえ。選択したファイル内容は端末内で解析され、現在のアプリはその内容をアップロードしません。',
      faqDeleteQ:'Bearagnostic が自動でファイルを削除することはありますか？',
      faqDeleteA:'ありません。削除には選択、確認、最終確認が必要です。Protected 判定と最低1コピーを残す保護もそのまま適用されます。',
      faqRestoreQ:'Pro を復元するには？',
      faqRestoreA:'「購入・復元」を開き、確認済み Ko-fi 購入で使ったメールアドレスを入力し、メール認証後に買い切り Pro 権限を復元します。',
      contactEyebrow:'BENEDICT SUPPORT', contactTitle:'Benedict Interactive に連絡',
      contactLead:'担当者のサポートが必要ですか？ここからメールアプリを開き、内容を確認してから送信できます。',
      contactEmailLabel:'サポートメール',
      contactTipTitle:'より早いサポートのために',
      contactTipBody:'アプリの問題は「問題を報告」から安全な技術情報を添えたメールを準備できます。パスワード、決済情報、個人的なファイル名やパスは記載しないでください。',
      contactOpen:'メールアプリを開く', contactCopy:'メールをコピー', contactCopied:'サポートメールをコピーしました。',
      contactFallback:'メールアプリを開けなかったため、サポート用メールアドレスをコピーしました。',
      close:'閉じる',
      diagnosticsCopied:'診断情報をコピーしました。', copyFailed:'自動でコピーできませんでした。',
      proTitle:'Lifetime Pro · 249 THB',
      proBody:'確認済みの Ko-fi 購入フローから Bearagnostic Pro を購入または復元できます。買い切りで、サブスクリプションではありません。',
      proActiveTitle:'Bearagnostic Pro は有効です', proActiveBody:'このインストールでは Lifetime Pro の権限が確認済みです。',
      selectAll:'すべて選択', clearAll:'選択をすべて解除', selectExtras:'余分なコピーをすべて選択',
      privacyTitle:'プライバシー',
      privacyBody:'Bearagnostic はローカル優先で設計されています。ファイル解析、プレビュー、集計された Insights 履歴は端末内で扱い、選択したファイル内容をアップロードしません。購入・復元は、利用者がその操作を開始した場合にのみ Benedict の権限サービスへ接続し、決済は Ko-fi が処理します。サポート用リンクも、利用者が選んで開いた場合にのみネットワークを使用します。',
      thirdPartyTitle:'第三者ライセンス',
      thirdPartyBody:'Android、および第三者のコンポーネント、サービス、フォント、ライブラリ、商標、素材には、それぞれのライセンスと利用条件が適用されます。Bearagnostic は第三者素材やパブリックドメイン素材の所有権を主張しません。該当コンポーネントに有効な第三者ライセンスがある場合は、その条件が優先されます。'
    }
  });

  const STALE_PRO_MARKERS = Object.freeze([
    'Google Play purchase setup is intentionally not active in this development build yet.',
    'The next Billing batch will supply the local Play price, purchase, restore and ownership lifecycle to this entitlement layer.',
    'ระบบซื้อผ่าน Google Play ยังไม่เปิดใน development build นี้โดยตั้งใจ',
    'Batch Billing ถัดไปจะเชื่อมราคาตามประเทศ การซื้อ การกู้คืนสิทธิ์ และวงจรสถานะเจ้าของเข้ากับ entitlement layer นี้',
    'この開発ビルドでは Google Play の購入処理を意図的にまだ有効化していません。',
    '次の Billing バッチで、地域別価格・購入・復元・所有権ライフサイクルをこの entitlement layer に接続します。'
  ]);

  const STALE_ACTIVE_MARKERS = Object.freeze([
    'This build currently has access to Pro capabilities.',
    'Build นี้มีสิทธิ์ใช้ความสามารถ Pro แล้ว',
    'このビルドでは Pro 機能を利用できます。'
  ]);

  const CTA_BLOCKERS = [
    '.native-review-footer', '.native-results-footer', '.native-clean-summary-actions',
    '.ba-qc-footer', '.ba-qc-result-actions',
    '.ba-dup-footer', '.ba-dup-result-actions',
    '.ba-large-footer', '.ba-large-result-actions',
    '.ba-old-footer', '.ba-old-result-actions',
    '#baDownloadsSelection > *', '.ba-downloads-result-actions',
    '#baInstallersSelection > *', '.ba-installers-result-actions',
    '#baArchivesSelection > *', '.ba-archives-result-actions',
    '#baZeroSelection > *', '.ba-zero-result-actions',
    '#baEmptySelection > *', '.ba-empty-result-actions',
    '.ba-billing-actions'
  ].join(',');

  const BULK_SPECS = Object.freeze({
    large: {surface:'#baLargeFiles', checkbox:'[data-large-id]', dataKey:'largeId', more:'#baLargeMore', clear:'#baLargeClear', cap:500},
    old: {surface:'#baOldFiles', checkbox:'[data-old-id]', dataKey:'oldId', more:'#baOldMore', clear:'#baOldClear', cap:500},
    downloads: {surface:'#baDownloadsSurface', checkbox:'[data-download-id]', dataKey:'downloadId', more:'[data-download-action="more"]', clear:'[data-download-action="clear"]', cap:500},
    installers: {surface:'#baInstallersSurface', checkbox:'[data-installer-id]', dataKey:'installerId', more:'[data-installer-action="more"]', clear:'[data-installer-action="clear"]', cap:500},
    archives: {surface:'#baArchivesSurface', checkbox:'[data-archive-id]', dataKey:'archiveId', more:'[data-archive-action="more"]', clear:'[data-archive-action="clear"]', cap:500},
    zero: {surface:'#baZeroSurface', checkbox:'[data-zero-id]', dataKey:'zeroId', more:'[data-zero-action="more"]', clear:'[data-zero-action="clear"]', cap:500},
    empty: {surface:'#baEmptySurface', checkbox:'[data-empty-id]', dataKey:'emptyId', more:'[data-empty-action="more"]', clear:'[data-empty-action="clear"]', cap:100, empty:true}
  });

  function language() {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
  }
  function c() { return COPY[language()] || COPY.en; }
  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function parse(value, fallback = {}) {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  }
  function isVisible(element) {
    if (!element || element.hidden) return false;
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }
  function nextFrame() { return new Promise((resolve) => requestAnimationFrame(() => resolve())); }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* #1: the legacy PWA launch surface is additionally guarded in generated HTML. */

      /* #2: informational scan tip must never imply a tap target. */
      .scan-tip{cursor:default!important;user-select:text!important}
      .scan-tip__arrow{display:none!important}
      .scan-tip:active{transform:none!important}

      /* #6: What Changed copy stays readable rather than ellipsized. */
      .ba-insights-delta{min-height:72px!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
      .ba-insights-delta b{
        white-space:normal!important;overflow:visible!important;text-overflow:clip!important;
        overflow-wrap:anywhere!important;line-height:1.3!important;font-size:clamp(11px,3vw,14px)!important
      }


      /* #8: robust unified-detail header geometry; no kicker clipping behind Back. */
      #baUnifiedSettingsDetail[data-detail-kind="help"] .settings-title-row{
        display:grid!important;
        grid-template-columns:72px minmax(0,1fr)!important;
        column-gap:22px!important;
        align-items:start!important;
        min-height:94px!important;
        height:auto!important;
        margin-bottom:18px!important;
        overflow:visible!important
      }
      #baUnifiedSettingsDetail[data-detail-kind="help"] .settings-title-row>.back-button{
        grid-column:1!important;
        align-self:start!important;
        margin:0!important
      }
      #baUnifiedSettingsDetail[data-detail-kind="help"] .settings-title-row>div:last-child{
        grid-column:2!important;
        min-width:0!important;
        padding-top:0!important;
        overflow:visible!important
      }
      #baUnifiedSettingsDetail[data-detail-kind="help"] #baUnifiedDetailKicker{
        display:block!important;
        min-height:16px!important;
        padding:2px 1px!important;
        line-height:1.42!important;
        overflow:visible!important;
        white-space:normal!important
      }
      #baUnifiedSettingsDetail[data-detail-kind="help"] #baUnifiedDetailTitle{
        margin-top:7px!important;
        overflow:visible!important
      }

      /* #8: premium Help & Support hierarchy. */
      #baUnifiedSettingsDetail[data-detail-kind="help"] .settings-scroll{
        padding-bottom:max(34px,env(safe-area-inset-bottom))!important
      }
      #baUnifiedSettingsDetail .ba-final-help-group{
        margin-top:13px!important;
        padding:9px 14px 7px!important;
        overflow:hidden!important;
        background:
          radial-gradient(circle at 92% 0%,rgba(116,91,222,.075),transparent 28%),
          linear-gradient(145deg,rgba(255,255,255,.985),rgba(247,249,255,.965))!important;
        border:1px solid rgba(112,102,188,.10)!important;
        box-shadow:0 15px 34px rgba(62,83,122,.075),inset 0 1px 0 rgba(255,255,255,.98)!important
      }
      #baUnifiedSettingsDetail .ba-final-help-group.is-contact{
        background:
          radial-gradient(circle at 94% 4%,rgba(38,175,228,.07),transparent 28%),
          linear-gradient(145deg,rgba(255,255,255,.985),rgba(243,250,253,.965))!important;
        border-color:rgba(49,150,196,.10)!important
      }
      #baUnifiedSettingsDetail .ba-final-help-group__label{
        display:flex!important;align-items:center!important;gap:8px!important;
        min-height:28px!important;padding:2px 1px 7px!important;
        color:#7362bd!important;font-size:9.5px!important;line-height:1.25!important;
        font-weight:850!important;letter-spacing:.14em!important;text-transform:uppercase!important
      }
      #baUnifiedSettingsDetail .ba-final-help-group.is-contact .ba-final-help-group__label{color:#2688b6!important}
      html[lang^="th"] #baUnifiedSettingsDetail .ba-final-help-group__label,
      html[lang^="ja"] #baUnifiedSettingsDetail .ba-final-help-group__label{
        letter-spacing:.04em!important;text-transform:none!important
      }
      #baUnifiedSettingsDetail .ba-final-help-group .setting-link{
        grid-template-columns:46px minmax(0,1fr) 18px!important;
        gap:13px!important;
        min-height:76px!important;
        padding:12px 1px!important;
        border-top:1px solid rgba(99,124,153,.105)!important
      }
      #baUnifiedSettingsDetail .ba-final-help-group__label+.setting-link{border-top:0!important}
      #baUnifiedSettingsDetail .ba-final-help-group .ba-action-icon{
        width:44px!important;height:44px!important;border-radius:15px!important;
        display:grid!important;place-items:center!important;color:#fff!important;
        box-shadow:0 9px 20px rgba(62,83,125,.15),inset 0 1px 0 rgba(255,255,255,.38)!important
      }
      #baUnifiedSettingsDetail .ba-final-help-group .ba-action-icon svg{
        width:21px!important;height:21px!important;fill:none!important;stroke:currentColor!important;
        stroke-width:1.7!important;stroke-linecap:round!important;stroke-linejoin:round!important
      }
      #baUnifiedSettingsDetail .ba-final-help-group .setting-link strong{
        font-size:13.8px!important;line-height:1.26!important
      }
      #baUnifiedSettingsDetail .ba-final-help-group .setting-link small{
        font-size:10.65px!important;line-height:1.43!important;margin-top:4px!important
      }
      #baUnifiedSettingsDetail .ba-action-icon.tone-faq{background:linear-gradient(145deg,#b795ff,#805ee5 52%,#4d8ee5)!important}
      #baUnifiedSettingsDetail .ba-action-icon.tone-contact{background:linear-gradient(145deg,#6eddf3,#2eb6de 50%,#2486d9)!important}
      #baUnifiedSettingsDetail .ba-action-icon.tone-purchase{background:linear-gradient(145deg,#ffd878,#f0ae3f 47%,#a779d9)!important}
      #baUnifiedSettingsDetail .ba-action-icon.tone-report{background:linear-gradient(145deg,#ff9f92,#ef6680)!important}
      #baUnifiedSettingsDetail .ba-action-icon.tone-feedback{background:linear-gradient(145deg,#b391f6,#795be0)!important}
      #baUnifiedSettingsDetail .ba-action-icon.tone-diagnostics{background:linear-gradient(145deg,#67d8f2,#2b9ae3)!important}

      /* Help sub-surfaces sit above bottom navigation and respect safe areas. */
      .ba-final-support-overlay{
        position:fixed;inset:0;z-index:3200;display:grid;align-items:end;
        padding:20px 10px max(10px,env(safe-area-inset-bottom));
        background:rgba(18,29,48,.36);
        backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)
      }
      .ba-final-support-overlay[hidden]{display:none!important}
      .ba-final-support-panel{
        width:min(100%,560px);max-height:min(88dvh,850px);margin:0 auto;
        overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;
        border-radius:31px 31px 25px 25px;
        background:
          radial-gradient(circle at 91% 2%,rgba(78,187,235,.11),transparent 24%),
          radial-gradient(circle at 5% 16%,rgba(130,95,229,.105),transparent 28%),
          linear-gradient(180deg,#fdfefe,#f5f9fd);
        border:1px solid rgba(255,255,255,.98);
        box-shadow:0 -25px 72px rgba(22,45,75,.28),inset 0 1px 0 #fff;
        color:#21384f;padding:11px 15px max(18px,env(safe-area-inset-bottom))
      }
      .ba-final-support-handle{width:44px;height:4px;margin:0 auto 13px;border-radius:99px;background:linear-gradient(90deg,#dfe7ef,#c9d5e3,#dfe7ef)}
      .ba-final-support-head{display:grid;grid-template-columns:52px minmax(0,1fr) 38px;gap:11px;align-items:center}
      .ba-final-support-mark{
        width:52px;height:52px;border-radius:18px;display:grid;place-items:center;color:#fff;
        background:linear-gradient(145deg,#a581f1,#7159dc 52%,#369ce1);
        box-shadow:0 12px 27px rgba(85,72,176,.22),inset 0 1px 0 rgba(255,255,255,.38)
      }
      .ba-final-support-mark.is-contact{background:linear-gradient(145deg,#69d9ef,#31afe0 52%,#307ed2)}
      .ba-final-support-mark svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}
      .ba-final-support-eyebrow{display:block;color:#7663c1;font-size:8.5px;line-height:1.25;font-weight:860;letter-spacing:.17em}
      .ba-final-support-head h2{margin:4px 0 0;font-size:21px;line-height:1.12;letter-spacing:-.028em;color:#20374f}
      .ba-final-support-close{width:38px;height:38px;border-radius:14px;background:#edf3f8;color:#6f8295;font-size:20px;line-height:1}
      .ba-final-support-lead{margin:11px 2px 13px;font-size:11.5px;line-height:1.52;color:#687d91}
      .ba-final-faq-list{display:grid;gap:8px}
      .ba-final-faq-card{
        overflow:hidden;border-radius:19px;background:rgba(255,255,255,.86);
        border:1px solid rgba(95,116,153,.09);
        box-shadow:0 7px 20px rgba(55,78,111,.045),inset 0 1px 0 rgba(255,255,255,.95)
      }
      .ba-final-faq-question{
        width:100%;display:grid;grid-template-columns:36px minmax(0,1fr) 24px;gap:10px;align-items:center;
        padding:12px;text-align:left;background:transparent;color:#263e56
      }
      .ba-final-faq-qicon{
        width:36px;height:36px;border-radius:12px;display:grid;place-items:center;color:#6b5fba;
        background:linear-gradient(145deg,#f1edff,#eef6ff)
      }
      .ba-final-faq-qicon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      .ba-final-faq-question strong{font-size:12.3px;line-height:1.35}
      .ba-final-faq-chevron{font-size:21px;line-height:1;color:#846fd0;transform:rotate(0);transition:transform .18s ease}
      .ba-final-faq-question[aria-expanded="true"] .ba-final-faq-chevron{transform:rotate(90deg)}
      .ba-final-faq-answer{padding:0 15px 14px 58px;font-size:10.8px;line-height:1.55;color:#718397}
      .ba-final-faq-answer[hidden]{display:none!important}

      .ba-final-contact-card{
        display:grid;grid-template-columns:44px minmax(0,1fr);gap:12px;align-items:center;
        padding:13px;border-radius:20px;background:linear-gradient(145deg,#fff,#f1f9fd);
        border:1px solid rgba(49,147,198,.10);box-shadow:0 8px 22px rgba(52,92,120,.055)
      }
      .ba-final-contact-card__icon{
        width:44px;height:44px;border-radius:15px;display:grid;place-items:center;color:#fff;
        background:linear-gradient(145deg,#69d9ef,#2ba8df);box-shadow:0 8px 18px rgba(44,145,195,.16)
      }
      .ba-final-contact-card__icon svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      .ba-final-contact-card small{display:block;font-size:8.5px;line-height:1.25;font-weight:830;letter-spacing:.10em;color:#4f8aaa}
      .ba-final-contact-card strong{display:block;margin-top:4px;font-size:12.8px;line-height:1.35;color:#263f57;overflow-wrap:anywhere}
      .ba-final-contact-note{
        margin-top:10px;padding:12px 13px;border-radius:18px;background:linear-gradient(135deg,#f6f4ff,#f4faff);
        border:1px solid rgba(112,91,198,.09)
      }
      .ba-final-contact-note strong{display:block;font-size:11.5px;color:#514b87}
      .ba-final-contact-note p{margin:5px 0 0;font-size:10.4px;line-height:1.52;color:#747f96}
      .ba-final-contact-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:11px}
      .ba-final-contact-actions button{min-height:44px;border-radius:15px;font-size:10.7px;font-weight:790}
      .ba-final-contact-primary{color:#fff;background:linear-gradient(118deg,#7962d7,#2997df);box-shadow:0 10px 21px rgba(76,76,173,.17)}
      .ba-final-contact-secondary{color:#527087;background:#edf5fa;border:1px solid rgba(72,120,150,.10)}

      /* #9: Japanese/CJK uses CJK geometry for labels and prose, while file names may still ellipsize intentionally. */
      html[lang^="ja"] body{
        font-family:system-ui,"Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif!important;
        line-break:strict;word-break:normal
      }
      html[lang^="ja"] .checkup-cta{min-height:76px!important;height:auto!important}
      html[lang^="ja"] .checkup-cta__copy{min-width:0!important}
      html[lang^="ja"] .checkup-cta__copy strong,
      html[lang^="ja"] .checkup-cta__copy small,
      html[lang^="ja"] .setting-link strong,
      html[lang^="ja"] .setting-link small,
      html[lang^="ja"] .utility-list strong,
      html[lang^="ja"] .utility-list small,
      html[lang^="ja"] .ba-detail-section>p,
      html[lang^="ja"] .ba-insights-delta b,
      html[lang^="ja"] .ba-insights-delta span,
      html[lang^="ja"] .ba-final-faq-question strong,
      html[lang^="ja"] .ba-final-faq-answer,
      html[lang^="ja"] .ba-final-support-lead{
        white-space:normal!important;overflow:visible!important;text-overflow:clip!important;
        overflow-wrap:anywhere!important;line-height:1.48!important
      }
      html[lang^="ja"] .checkup-cta__copy strong{line-height:1.25!important;letter-spacing:-.02em!important}
      html[lang^="ja"] .checkup-cta__copy small{display:block!important;margin-top:4px!important;line-height:1.45!important}

      /* #4: bulk controls use each tool's existing visual language. */
      [data-final-select-all]{white-space:nowrap!important}

      @media(max-width:420px){
        #baUnifiedSettingsDetail[data-detail-kind="help"] .settings-title-row{grid-template-columns:66px minmax(0,1fr)!important;column-gap:16px!important;min-height:90px!important}
        #baUnifiedSettingsDetail .ba-final-help-group{padding-inline:12px!important}
        #baUnifiedSettingsDetail .ba-final-help-group .setting-link{grid-template-columns:43px minmax(0,1fr) 16px!important;gap:11px!important}
        #baUnifiedSettingsDetail .ba-final-help-group .ba-action-icon{width:42px!important;height:42px!important}
        .ba-final-contact-actions{grid-template-columns:1fr!important}
        .ba-empty-selection .ba-empty-secondary{display:inline-flex!important}
        .ba-empty-selection__inner{grid-template-columns:minmax(0,1fr) auto!important;gap:7px!important}
        .ba-empty-selection__inner>div:first-child{grid-column:1/-1!important}
      }
      @media(prefers-reduced-motion:reduce){
        .ba-final-faq-chevron{transition:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function neutralizeScanTip() {
    const tip = document.querySelector('.scan-tip');
    if (!tip) return;
    tip.removeAttribute('role');
    tip.removeAttribute('tabindex');
    tip.removeAttribute('aria-haspopup');
    tip.removeAttribute('aria-expanded');
    const arrow = tip.querySelector('.scan-tip__arrow');
    if (arrow && !arrow.hidden) arrow.hidden = true;
  }

  function cueOverlaps(a, b) {
    return a.right > b.left + 4 && a.left < b.right - 4 && a.bottom > b.top + 2 && a.top < b.bottom - 2;
  }

  let cueFrame = 0;
  let cueTimer = 0;
  function protectScrollCue() {
    cancelAnimationFrame(cueFrame);
    cueFrame = requestAnimationFrame(() => {
      cueFrame = 0;
      const cue = document.getElementById('baScrollCue');
      if (!cue || !cue.classList.contains('is-visible') || !isVisible(cue)) return;

      const current = Number.parseFloat(cue.style.bottom || '0') || 0;
      const lastApplied = Number.parseFloat(cue.dataset.finalPolishApplied || 'NaN');
      const storedBase = Number.parseFloat(cue.dataset.finalPolishBase || 'NaN');
      const base = Number.isFinite(lastApplied) && Math.abs(current - lastApplied) < 0.5
        ? (Number.isFinite(storedBase) ? storedBase : current)
        : current;

      // Measure from the shell-owned base position every pass. This prevents our
      // own correction from accumulating while still allowing android-shell-ux
      // to change its legitimate base value.
      cue.style.bottom = `${Math.max(0, base)}px`;
      const baseRect = cue.getBoundingClientRect();
      let extraBottom = 0;

      document.querySelectorAll(CTA_BLOCKERS).forEach((blocker) => {
        if (!isVisible(blocker)) return;
        const rect = blocker.getBoundingClientRect();
        if (cueOverlaps(baseRect, rect)) {
          extraBottom = Math.max(extraBottom, Math.max(0, baseRect.bottom - rect.top) + 12);
        }
      });

      const finalBottom = Math.max(0, base) + extraBottom;
      cue.dataset.finalPolishBase = String(Math.max(0, base));
      cue.dataset.finalPolishApplied = String(finalBottom);
      cue.style.bottom = `${finalBottom}px`;
    });
  }

  function scheduleCueProtection() {
    clearTimeout(cueTimer);
    // Shell UX schedules its own requestAnimationFrame from the scroll handler.
    // A zero-delay task runs after that frame and reapplies collision protection.
    cueTimer = window.setTimeout(protectScrollCue, 0);
  }

  function snapshotSafe(spec) {
    const native = window.BearagnosticNative;
    if (!native) return false;
    const state = parse(native.getNativeState?.(), {});
    if (state?.scannerRunning) return false;
    const summary = spec.empty
      ? parse(native.getEmptyFolderSummary?.(), {})
      : parse(native.getReviewSummary?.(), {});
    if (!summary?.available || summary?.running) return false;
    const generated = Number(summary.generatedAtMs || 0);
    const now = Date.now();
    return generated > 0 && now >= generated && now - generated <= SNAPSHOT_MAX_AGE_MS;
  }

  function eligibleBoxes(spec) {
    const surface = document.querySelector(spec.surface);
    if (!surface || surface.hidden) return [];
    return Array.from(surface.querySelectorAll(spec.checkbox)).filter((box) => !box.disabled);
  }

  function syncBulkControls() {
    const t = c();
    Object.entries(BULK_SPECS).forEach(([key, spec]) => {
      const surface = document.querySelector(spec.surface);
      if (!surface || surface.hidden) return;
      const clear = surface.querySelector(spec.clear);
      if (!clear) return;

      if (clear.textContent !== t.clearAll) clear.textContent = t.clearAll;
      clear.setAttribute('aria-label', t.clearAll);

      let select = surface.querySelector(`[data-final-select-all="${key}"]`);
      if (!select) {
        select = document.createElement('button');
        select.type = 'button';
        select.className = clear.className;
        select.dataset.finalSelectAll = key;
        clear.insertAdjacentElement('beforebegin', select);
      }
      if (select.textContent !== t.selectAll) select.textContent = t.selectAll;
      select.setAttribute('aria-label', t.selectAll);

      const boxes = eligibleBoxes(spec);
      const selectedCount = boxes.filter((box) => box.checked).length;
      const more = surface.querySelector(spec.more);
      const hasMore = Boolean(more && !more.disabled && isVisible(more));
      const capReached = selectedCount >= spec.cap;
      const allSelected = boxes.length > 0 && boxes.every((box) => box.checked) && !hasMore;
      select.disabled = !snapshotSafe(spec) || boxes.length === 0 || capReached || allSelected;
    });

    // Generic native review already owns safe select-all / clear-selection
    // semantics, including keep-one-copy. Normalize wording only.
    const nativeSelect = document.getElementById('nativeSelectAll');
    if (nativeSelect) {
      const pressed = nativeSelect.getAttribute('aria-pressed') === 'true';
      const current = String(nativeSelect.textContent || '');
      if (pressed && !current.match(/\d/)) nativeSelect.textContent = t.clearAll;
      else if (!pressed && !current.match(/\d/)) nativeSelect.textContent = t.selectAll;
    }

    // Duplicates already owns a safe keep-one-copy bulk selector. Relabel only
    // when the capability is actually available; never convert it to raw select-all.
    const dupClear = document.getElementById('baDupClearAll');
    if (dupClear && dupClear.textContent !== t.clearAll) dupClear.textContent = t.clearAll;
    const dup = document.getElementById('baDupBulk');
    if (dup && window.BearagnosticEntitlement?.can?.('advanced_exact_duplicates')) {
      if (dup.textContent !== t.selectExtras) dup.textContent = t.selectExtras;
    }
  }

  async function selectAllThroughExistingHandlers(key) {
    const spec = BULK_SPECS[key];
    if (!spec || !snapshotSafe(spec)) return;

    // Expand with the tool's own existing "more" action first.
    for (let i = 0; i < 100; i += 1) {
      const surface = document.querySelector(spec.surface);
      if (!surface || surface.hidden) return;
      if (eligibleBoxes(spec).length >= spec.cap) break;
      const more = surface.querySelector(spec.more);
      if (!more || more.disabled || !isVisible(more)) break;
      more.click();
      await nextFrame();
      if (!snapshotSafe(spec)) return;
    }

    const surface = document.querySelector(spec.surface);
    if (!surface || surface.hidden || !snapshotSafe(spec)) return;
    const ids = Array.from(surface.querySelectorAll(spec.checkbox))
      .filter((box) => !box.disabled)
      .map((box) => String(box.dataset[spec.dataKey] || ''))
      .filter(Boolean)
      .slice(0, spec.cap);

    for (let i = 0; i < ids.length; i += 1) {
      if (!snapshotSafe(spec)) break;
      const currentSurface = document.querySelector(spec.surface);
      if (!currentSurface || currentSurface.hidden) break;
      const box = Array.from(currentSurface.querySelectorAll(spec.checkbox))
        .find((node) => String(node.dataset[spec.dataKey] || '') === ids[i]);
      if (!box || box.disabled || box.checked) continue;
      box.checked = true;
      box.dispatchEvent(new Event('change', {bubbles:true}));
      if ((i + 1) % 20 === 0) await nextFrame();
    }
    schedulePatch();
  }

  function staleProCopy(text) {
    const value = String(text || '');
    return STALE_PRO_MARKERS.some((marker) => value.includes(marker));
  }


  function patchProCopy() {
    const t = c();
    [
      document.getElementById('bearagnosticProOverlay'),
      document.querySelector('#baUnifiedSettingsDetail[data-detail-kind="pro"]')
    ].filter(Boolean).forEach((root) => {
      // Production release: do not advertise roadmap / unfinished features.
      root.querySelector('.ba-pro-roadmap')?.closest('.ba-pro-section')?.remove();
      root.querySelectorAll('.ba-pro-purchase').forEach((card) => {
        const strong = card.querySelector('strong');
        const small = card.querySelector('small');
        if (staleProCopy(card.textContent)) {
          if (strong && strong.textContent !== t.proTitle) strong.textContent = t.proTitle;
          if (small && small.textContent !== t.proBody) small.textContent = t.proBody;
          return;
        }
        if (small && STALE_ACTIVE_MARKERS.some((marker) => small.textContent.includes(marker))) {
          if (strong && strong.textContent !== t.proActiveTitle) strong.textContent = t.proActiveTitle;
          if (small.textContent !== t.proActiveBody) small.textContent = t.proActiveBody;
        }
      });
    });
  }

  function patchLegalCopy() {
    const t = c();
    [
      document.querySelector('#baUnifiedSettingsDetail[data-detail-kind="legal"]'),
      document.getElementById('baLegalOverlay')
    ].filter(Boolean).forEach((root) => {
      root.querySelectorAll('.ba-detail-section,.ba-legal-card').forEach((section) => {
        const title = section.querySelector('strong')?.textContent?.trim() || '';
        const body = section.querySelector('p');
        if (!body || !body.textContent.includes('Google Play')) return;
        if (title === t.privacyTitle && body.textContent !== t.privacyBody) body.textContent = t.privacyBody;
        else if (title === t.thirdPartyTitle && body.textContent !== t.thirdPartyBody) body.textContent = t.thirdPartyBody;
      });
    });
  }

  function helpActionMarkup(action, title, sub, tone, iconKey = action) {
    const icon = HELP_ICONS[iconKey] || HELP_ICONS.faq;
    return `<button class="setting-link ba-final-help-action has-icon" type="button" data-final-help-action="${esc(action)}">` +
      `<span class="ba-action-icon tone-${esc(tone)}" aria-hidden="true"><svg viewBox="0 0 24 24">${icon}</svg></span>` +
      `<span class="ba-action-copy"><strong>${esc(title)}</strong><small>${esc(sub)}</small></span><b>›</b></button>`;
  }

  function helpGroupMarkup(label, extraClass, actions) {
    return `<section class="settings-group ba-detail-action-group ba-final-help-group${extraClass ? ` ${esc(extraClass)}` : ''}">` +
      `<div class="ba-final-help-group__label">${esc(label)}</div>${actions.join('')}</section>`;
  }

  function patchHelpGateway() {
    const t = c();
    const row = document.getElementById('helpFeedbackHub');
    if (row) {
      const title = row.querySelector('strong');
      const sub = row.querySelector('small');
      if (title && title.textContent !== t.helpTitle) title.textContent = t.helpTitle;
      if (sub && sub.textContent !== t.helpSub) sub.textContent = t.helpSub;
      const aria = `${t.helpTitle}. ${t.helpSub}`;
      if (row.getAttribute('aria-label') !== aria) row.setAttribute('aria-label', aria);
    }

    const detail = document.querySelector('#baUnifiedSettingsDetail[data-detail-kind="help"]');
    if (!detail || detail.hidden) return;

    const kicker = document.getElementById('baUnifiedDetailKicker');
    const title = document.getElementById('baUnifiedDetailTitle');
    if (kicker && kicker.textContent !== t.helpKicker) kicker.textContent = t.helpKicker;
    if (title && title.textContent !== t.helpTitle) title.textContent = t.helpTitle;

    const principleCopy = detail.querySelector('.ba-detail-principle .privacy-principle-card__copy p');
    if (principleCopy && principleCopy.textContent !== t.helpLead) principleCopy.textContent = t.helpLead;

    const scroll = document.getElementById('baUnifiedDetailScroll');
    const principle = detail.querySelector('.ba-detail-principle');
    if (!scroll || !principle) return;

    const ready = detail.dataset.finalHelpSignature === language() &&
      scroll.querySelectorAll('.ba-final-help-group').length === 2;
    if (ready) return;

    scroll.querySelectorAll('.ba-detail-action-group,.ba-final-help-faq').forEach((node) => node.remove());

    const helpActions = [
      helpActionMarkup('faq', t.faq, t.faqSub, 'faq', 'faq'),
      helpActionMarkup('contact', t.contact, t.contactSub, 'contact', 'contact'),
      helpActionMarkup('purchase', t.purchase, t.purchaseSub, 'purchase', 'purchase')
    ];
    const contactActions = [
      helpActionMarkup('report', t.report, t.reportSub, 'report', 'report'),
      helpActionMarkup('feedback', t.feedback, t.feedbackSub, 'feedback', 'feedback'),
      helpActionMarkup('diagnostics', t.diagnostics, t.diagnosticsSub, 'diagnostics', 'diagnostics')
    ];

    principle.insertAdjacentHTML(
      'afterend',
      helpGroupMarkup(t.helpGroup, '', helpActions) +
      helpGroupMarkup(t.contactGroup, 'is-contact', contactActions)
    );
    detail.dataset.finalHelpSignature = language();
  }

  function ensureSupportOverlay() {
    let overlay = document.getElementById(SUPPORT_OVERLAY_ID);
    if (overlay) return overlay;
    overlay = document.createElement('section');
    overlay.id = SUPPORT_OVERLAY_ID;
    overlay.className = 'ba-final-support-overlay';
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay || event.target?.closest?.('[data-final-overlay-close]')) closeSupportOverlay();
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  function closeSupportOverlay() {
    const overlay = document.getElementById(SUPPORT_OVERLAY_ID);
    if (!overlay) return;
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function openSupportOverlay(kind) {
    const overlay = ensureSupportOverlay();
    const t = c();
    overlay.dataset.kind = kind;

    if (kind === 'contact') {
      overlay.innerHTML = `<section class="ba-final-support-panel" role="dialog" aria-modal="true" aria-labelledby="baFinalSupportTitle">` +
        `<div class="ba-final-support-handle"></div>` +
        `<header class="ba-final-support-head"><span class="ba-final-support-mark is-contact"><svg viewBox="0 0 24 24">${HELP_ICONS.contact}</svg></span>` +
        `<div><span class="ba-final-support-eyebrow">${esc(t.contactEyebrow)}</span><h2 id="baFinalSupportTitle">${esc(t.contactTitle)}</h2></div>` +
        `<button class="ba-final-support-close" type="button" data-final-overlay-close aria-label="${esc(t.close)}">×</button></header>` +
        `<p class="ba-final-support-lead">${esc(t.contactLead)}</p>` +
        `<section class="ba-final-contact-card"><span class="ba-final-contact-card__icon"><svg viewBox="0 0 24 24">${HELP_ICONS.contact}</svg></span>` +
        `<div><small>${esc(t.contactEmailLabel)}</small><strong>${esc(SUPPORT_EMAIL)}</strong></div></section>` +
        `<section class="ba-final-contact-note"><strong>${esc(t.contactTipTitle)}</strong><p>${esc(t.contactTipBody)}</p></section>` +
        `<div class="ba-final-contact-actions"><button class="ba-final-contact-primary" type="button" data-final-contact-open>${esc(t.contactOpen)}</button>` +
        `<button class="ba-final-contact-secondary" type="button" data-final-contact-copy>${esc(t.contactCopy)}</button></div></section>`;
    } else {
      const questions = [
        [t.faqPrivacyQ, t.faqPrivacyA],
        [t.faqDeleteQ, t.faqDeleteA],
        [t.faqRestoreQ, t.faqRestoreA]
      ];
      const cards = questions.map(([question, answer], index) => {
        const expanded = index === 0;
        return `<article class="ba-final-faq-card"><button class="ba-final-faq-question" type="button" data-final-faq-toggle aria-expanded="${expanded ? 'true' : 'false'}">` +
          `<span class="ba-final-faq-qicon"><svg viewBox="0 0 24 24">${HELP_ICONS.faq}</svg></span>` +
          `<strong>${esc(question)}</strong><span class="ba-final-faq-chevron" aria-hidden="true">›</span></button>` +
          `<div class="ba-final-faq-answer"${expanded ? '' : ' hidden'}>${esc(answer)}</div></article>`;
      }).join('');
      overlay.innerHTML = `<section class="ba-final-support-panel" role="dialog" aria-modal="true" aria-labelledby="baFinalSupportTitle">` +
        `<div class="ba-final-support-handle"></div>` +
        `<header class="ba-final-support-head"><span class="ba-final-support-mark"><svg viewBox="0 0 24 24">${HELP_ICONS.faq}</svg></span>` +
        `<div><span class="ba-final-support-eyebrow">${esc(t.faqEyebrow)}</span><h2 id="baFinalSupportTitle">${esc(t.faqTitle)}</h2></div>` +
        `<button class="ba-final-support-close" type="button" data-final-overlay-close aria-label="${esc(t.close)}">×</button></header>` +
        `<p class="ba-final-support-lead">${esc(t.faqLead)}</p><div class="ba-final-faq-list">${cards}</div></section>`;
    }

    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const panel = overlay.querySelector('.ba-final-support-panel');
    if (panel) panel.scrollTop = 0;
    window.requestAnimationFrame(() => overlay.querySelector('[data-final-overlay-close]')?.focus?.({preventScroll:true}));
  }

  async function copySupportEmail(showToast = true) {
    const t = c();
    let copied = false;
    try { copied = Boolean(await window.BearagnosticAppAPI?.copyText?.(SUPPORT_EMAIL)); } catch (_) {}
    if (showToast) window.BearagnosticAppAPI?.showToast?.(copied ? t.contactCopied : t.copyFailed);
    return copied;
  }

  async function openContactEmail() {
    const t = c();
    const native = window.BearagnosticNative;
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Bearagnostic Support')}`;
    const result = parse(native?.openExternalUrl?.(url), {});
    if (result?.accepted) return;
    const copied = await copySupportEmail(false);
    window.BearagnosticAppAPI?.showToast?.(copied ? t.contactFallback : SUPPORT_EMAIL);
  }

  async function copyDiagnostics() {
    const t = c();
    let ok = false;
    try {
      const api = window.BearagnosticAppAPI;
      ok = Boolean(await api?.copyText?.(api?.diagnostics?.() || ''));
    } catch (_) {}
    window.BearagnosticAppAPI?.showToast?.(ok ? t.diagnosticsCopied : t.copyFailed);
  }

  function nativeZeroSnapshotAvailable() {
    const native = window.BearagnosticNative;
    if (!native) return false;
    if (!snapshotSafe(BULK_SPECS.zero)) return false;
    const page = parse(native.getReviewCandidates?.('zero', 0, 1), {});
    return Boolean(page?.available && Number(page.totalCount || 0) > 0);
  }

  function openGenericZeroReview() {
    if (!nativeZeroSnapshotAvailable()) return false;
    try { window.BearagnosticZeroFiles?.close?.(); } catch (_) {}
    let trigger = document.querySelector('[data-review-category="zero"]');
    let temporary = false;
    if (!trigger) {
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.hidden = true;
      trigger.dataset.reviewCategory = 'zero';
      document.body.appendChild(trigger);
      temporary = true;
    }
    trigger.click();
    if (temporary) trigger.remove();
    return true;
  }

  function recoverContradictoryZeroError() {
    const surface = document.getElementById('baZeroSurface');
    if (!surface || surface.hidden || surface.dataset.finalZeroRecovering === '1') return;
    const retry = surface.querySelector('[data-zero-action="retry"]');
    if (!retry || !nativeZeroSnapshotAvailable()) return;
    surface.dataset.finalZeroRecovering = '1';
    try { openGenericZeroReview(); }
    finally { delete surface.dataset.finalZeroRecovering; }
  }

  let patchFrame = 0;
  function schedulePatch() {
    if (patchFrame) return;
    patchFrame = requestAnimationFrame(() => {
      patchFrame = 0;
      patchAll();
    });
  }

  function patchAll() {
    ensureStyle();
    neutralizeScanTip();
    patchHelpGateway();
    patchProCopy();
    patchLegalCopy();
    syncBulkControls();
    recoverContradictoryZeroError();
    scheduleCueProtection();
  }

  function handleHelpAction(action) {
    if (action === 'faq') { openSupportOverlay('faq'); return; }
    if (action === 'contact') { openSupportOverlay('contact'); return; }
    if (action === 'purchase') {
      closeSupportOverlay();
      window.dispatchEvent(new CustomEvent('bearagnostic:prorequest', {detail:{source:'more'}}));
      return;
    }
    if (action === 'report') { window.BearagnosticHelp?.openComposer?.('report'); return; }
    if (action === 'feedback') { window.BearagnosticHelp?.openComposer?.('feedback'); return; }
    if (action === 'diagnostics') copyDiagnostics();
  }

  function bindActions() {
    document.addEventListener('click', (event) => {
      const bulk = event.target?.closest?.('[data-final-select-all]');
      if (bulk) {
        event.preventDefault();
        event.stopPropagation();
        selectAllThroughExistingHandlers(String(bulk.dataset.finalSelectAll || ''));
        return;
      }

      const help = event.target?.closest?.('[data-final-help-action]');
      if (help) {
        event.preventDefault();
        event.stopPropagation();
        handleHelpAction(String(help.dataset.finalHelpAction || ''));
        return;
      }

      const faqToggle = event.target?.closest?.('[data-final-faq-toggle]');
      if (faqToggle) {
        event.preventDefault();
        const expanded = faqToggle.getAttribute('aria-expanded') === 'true';
        faqToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        const answer = faqToggle.parentElement?.querySelector('.ba-final-faq-answer');
        if (answer) answer.hidden = expanded;
        return;
      }

      if (event.target?.closest?.('[data-final-contact-open]')) {
        event.preventDefault();
        openContactEmail();
        return;
      }
      if (event.target?.closest?.('[data-final-contact-copy]')) {
        event.preventDefault();
        copySupportEmail(true);
      }
    });

    // Intercept only the contradictory Zero-byte Retry case. All genuine error
    // states continue through android-zero.js unchanged.
    document.addEventListener('click', (event) => {
      const retry = event.target?.closest?.('#baZeroSurface [data-zero-action="retry"]');
      if (!retry || !nativeZeroSnapshotAvailable()) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      openGenericZeroReview();
    }, true);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !document.getElementById(SUPPORT_OVERLAY_ID)?.hidden) closeSupportOverlay();
    });
  }

  function initialize() {
    ensureStyle();
    bindActions();
    patchAll();

    const observer = new MutationObserver(schedulePatch);
    observer.observe(document.documentElement, {
      childList:true,
      subtree:true,
      attributes:true,
      attributeFilter:['hidden','class','lang','data-detail-kind']
    });

    // android-shell-ux recalculates cue position from scroll; run after it.
    document.addEventListener('scroll', scheduleCueProtection, {capture:true, passive:true});
    window.addEventListener('resize', scheduleCueProtection, {passive:true});

    window.addEventListener('bearagnostic:screenchange', schedulePatch);
    window.addEventListener('bearagnostic:hiddenitemschange', schedulePatch);
    window.addEventListener('bearagnostic:entitlementchange', schedulePatch);
    window.addEventListener('bearagnostic:languagechange', () => {
      const overlay = document.getElementById(SUPPORT_OVERLAY_ID);
      const kind = overlay && !overlay.hidden ? overlay.dataset.kind : '';
      if (kind) openSupportOverlay(kind);
      schedulePatch();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();

  window.BearagnosticFinalPolish = Object.freeze({refresh:schedulePatch});
})();
