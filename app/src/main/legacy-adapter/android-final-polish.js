(() => {
  'use strict';

  /*
   * Bearagnostic Android Final Polish (v80 candidate)
   *
   * Scope is intentionally narrow:
   * - presentation/copy/localization polish;
   * - selection convenience through each existing tool's own checkbox handlers;
   * - zero-byte presentation fallback to the already-proven generic native review;
   * - no scanner, delete, entitlement, restore, history or payment-truth mutation.
   */
  const STYLE_ID = 'androidFinalPolishStyle';
  const SNAPSHOT_MAX_AGE_MS = 15 * 60 * 1000;
  const SUPPORT_EMAIL = 'benedict.support@gmail.com';

  const COPY = Object.freeze({
    en: {
      helpTitle: 'Help & Support',
      helpSub: 'Help, purchase & restore, feedback, and problem reports.',
      helpLead: 'Help with Bearagnostic, Pro access, feedback, and support in one place.',
      faq: 'Help / FAQ', faqSub: 'Quick answers about privacy, cleanup safety, and Pro restore.',
      contact: 'Contact Benedict Interactive', contactSub: 'Open your email app to contact support.',
      purchase: 'Purchase & Restore help', purchaseSub: 'Buy Pro, restore a verified purchase, or check access.',
      report: 'Report a Problem', feedback: 'Send Feedback', diagnostics: 'Copy Diagnostic Info',
      faqTitle: 'Quick answers',
      faqPrivacyQ: 'Does Bearagnostic upload my files?',
      faqPrivacyA: 'No. Selected file contents are analyzed locally and are not uploaded by the current app.',
      faqDeleteQ: 'Will Bearagnostic delete files automatically?',
      faqDeleteA: 'No. Deletion requires your selection, review, and confirmation. Existing protection and keep-one-copy safeguards still apply.',
      faqRestoreQ: 'How do I restore Pro?',
      faqRestoreA: 'Open Purchase & Restore, enter the email used for the verified Ko-fi purchase, complete email verification, then restore the lifetime entitlement.',
      contactFallback: 'Could not open an email app. The support address was copied instead.',
      proTitle: 'Lifetime Pro · 249 THB',
      proBody: 'Buy or restore Bearagnostic Pro through the verified Ko-fi purchase flow. One-time purchase. No subscription.',
      proActiveTitle: 'Bearagnostic Pro is active', proActiveBody: 'Lifetime Pro is verified for this installation.',
      selectAll: 'Select all',
      selectExtras: 'Select all extras',
      privacyTitle: 'Privacy',
      privacyBody: 'Bearagnostic is local-first. File analysis, previews, and aggregate Insights history stay on your device, and selected file contents are not uploaded. Purchase and restore contact the Benedict entitlement service only when you start those actions; Ko-fi handles checkout. Support links use the network only when you choose to open them.',
      thirdPartyTitle: 'Third-Party Notices',
      thirdPartyBody: 'Android and other third-party components, services, fonts, libraries, marks, and materials remain subject to their own licences and terms. Bearagnostic does not claim ownership of third-party or public-domain material. A valid third-party licence controls for its component where applicable.'
    },
    th: {
      helpTitle: 'ช่วยเหลือและสนับสนุน',
      helpSub: 'คู่มือ การซื้อและกู้คืน Pro ข้อเสนอแนะ และแจ้งปัญหา',
      helpLead: 'รวมคู่มือ การจัดการสิทธิ์ Pro ข้อเสนอแนะ และช่องทางขอความช่วยเหลือไว้ในที่เดียว',
      faq: 'คู่มือ / คำถามที่พบบ่อย', faqSub: 'คำตอบสั้นๆ เรื่องความเป็นส่วนตัว ความปลอดภัยในการลบ และการกู้คืน Pro',
      contact: 'ติดต่อ Benedict Interactive', contactSub: 'เปิดแอปอีเมลเพื่อติดต่อฝ่ายสนับสนุน',
      purchase: 'ช่วยเหลือเรื่องซื้อและกู้คืน Pro', purchaseSub: 'ซื้อ Pro กู้คืนรายการซื้อที่ยืนยันแล้ว หรือตรวจสอบสิทธิ์',
      report: 'รายงานปัญหา', feedback: 'ส่งข้อเสนอแนะ', diagnostics: 'คัดลอกข้อมูลทางเทคนิค',
      faqTitle: 'คำตอบแบบรวดเร็ว',
      faqPrivacyQ: 'Bearagnostic อัปโหลดไฟล์ของฉันหรือไม่?',
      faqPrivacyA: 'ไม่ เนื้อหาไฟล์ที่เลือกจะถูกวิเคราะห์ภายในอุปกรณ์ และแอปเวอร์ชันปัจจุบันไม่อัปโหลดเนื้อหาไฟล์เหล่านั้น',
      faqDeleteQ: 'Bearagnostic จะลบไฟล์ให้อัตโนมัติหรือไม่?',
      faqDeleteA: 'ไม่ การลบต้องผ่านการเลือก ตรวจทาน และยืนยันจากคุณ โดยระบบ Protected และการเก็บไฟล์ซ้ำไว้อย่างน้อยหนึ่งสำเนายังคงทำงานตามเดิม',
      faqRestoreQ: 'จะกู้คืน Pro ได้อย่างไร?',
      faqRestoreA: 'เปิดเมนูซื้อและกู้คืน ใช้อีเมลเดียวกับรายการซื้อ Ko-fi ที่ยืนยันแล้ว ยืนยันอีเมล จากนั้นกู้คืนสิทธิ์ Pro แบบตลอดชีพ',
      contactFallback: 'เปิดแอปอีเมลไม่ได้ ระบบจึงคัดลอกอีเมลฝ่ายสนับสนุนไว้ให้แล้ว',
      proTitle: 'Lifetime Pro · 249 บาท',
      proBody: 'ซื้อหรือกู้คืน Bearagnostic Pro ผ่านขั้นตอนการซื้อ Ko-fi ที่ตรวจสอบสิทธิ์แล้ว ซื้อครั้งเดียว ไม่มีค่าสมาชิกรายเดือน',
      proActiveTitle: 'Bearagnostic Pro เปิดใช้งานแล้ว', proActiveBody: 'สิทธิ์ Lifetime Pro ได้รับการยืนยันสำหรับการติดตั้งนี้แล้ว',
      selectAll: 'เลือกทั้งหมด',
      selectExtras: 'เลือกไฟล์ซ้ำส่วนเกินทั้งหมด',
      privacyTitle: 'ความเป็นส่วนตัว',
      privacyBody: 'Bearagnostic ออกแบบแบบ local-first การวิเคราะห์ไฟล์ พรีวิว และประวัติ Insights แบบสรุปอยู่บนอุปกรณ์ และไม่มีการอัปโหลดเนื้อหาไฟล์ที่เลือก การซื้อและกู้คืนจะติดต่อบริการสิทธิ์ของ Benedict เฉพาะเมื่อคุณเริ่มขั้นตอนนั้น โดย Ko-fi เป็นผู้ดูแลการชำระเงิน ส่วนลิงก์ช่วยเหลือจะใช้อินเทอร์เน็ตเมื่อคุณเลือกเปิดเท่านั้น',
      thirdPartyTitle: 'ประกาศเกี่ยวกับบุคคลที่สาม',
      thirdPartyBody: 'Android และ component บริการ ฟอนต์ ไลบรารี เครื่องหมาย และวัสดุของบุคคลที่สาม อยู่ภายใต้ licence และเงื่อนไขของเจ้าของแต่ละราย Bearagnostic ไม่อ้างกรรมสิทธิ์เหนือวัสดุของบุคคลที่สามหรือสาธารณสมบัติ และ licence ที่มีผลใช้บังคับย่อมมีผลกับ component นั้น'
    },
    ja: {
      helpTitle: 'ヘルプとサポート',
      helpSub: 'ヘルプ、購入・復元、フィードバック、問題報告。',
      helpLead: 'Bearagnostic の使い方、Pro の購入・復元、フィードバック、サポートを一か所にまとめています。',
      faq: 'ヘルプ / FAQ', faqSub: 'プライバシー、削除の安全性、Pro の復元について確認できます。',
      contact: 'Benedict Interactive に連絡', contactSub: 'メールアプリを開いてサポートへ連絡します。',
      purchase: '購入・復元のヘルプ', purchaseSub: 'Pro の購入、確認済み購入の復元、アクセス状態の確認。',
      report: '問題を報告', feedback: 'フィードバックを送る', diagnostics: '診断情報をコピー',
      faqTitle: 'よくある質問',
      faqPrivacyQ: 'Bearagnostic はファイルをアップロードしますか？',
      faqPrivacyA: 'いいえ。選択したファイル内容は端末内で解析され、現在のアプリはその内容をアップロードしません。',
      faqDeleteQ: 'Bearagnostic が自動でファイルを削除することはありますか？',
      faqDeleteA: 'ありません。削除には選択、確認、最終確認が必要です。Protected 判定と最低1コピーを残す保護もそのまま適用されます。',
      faqRestoreQ: 'Pro を復元するには？',
      faqRestoreA: '「購入・復元」を開き、確認済み Ko-fi 購入で使ったメールアドレスを入力し、メール認証後に買い切り Pro 権限を復元します。',
      contactFallback: 'メールアプリを開けなかったため、サポート用メールアドレスをコピーしました。',
      proTitle: 'Lifetime Pro · 249 THB',
      proBody: '確認済みの Ko-fi 購入フローから Bearagnostic Pro を購入または復元できます。買い切りで、サブスクリプションではありません。',
      proActiveTitle: 'Bearagnostic Pro は有効です', proActiveBody: 'このインストールでは Lifetime Pro の権限が確認済みです。',
      selectAll: 'すべて選択',
      selectExtras: '余分なコピーをすべて選択',
      privacyTitle: 'プライバシー',
      privacyBody: 'Bearagnostic はローカル優先で設計されています。ファイル解析、プレビュー、集計された Insights 履歴は端末内で扱い、選択したファイル内容をアップロードしません。購入・復元は、利用者がその操作を開始した場合にのみ Benedict の権限サービスへ接続し、決済は Ko-fi が処理します。サポート用リンクも、利用者が選んで開いた場合にのみネットワークを使用します。',
      thirdPartyTitle: '第三者ライセンス',
      thirdPartyBody: 'Android、および第三者のコンポーネント、サービス、フォント、ライブラリ、商標、素材には、それぞれのライセンスと利用条件が適用されます。Bearagnostic は第三者素材やパブリックドメイン素材の所有権を主張しません。該当コンポーネントに有効な第三者ライセンスがある場合は、その条件が優先されます。'
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
      /* #2: informational scan tip must not imply a tap target. */
      .scan-tip{cursor:default!important;user-select:text!important}
      .scan-tip__arrow{display:none!important}
      .scan-tip:active{transform:none!important}

      /* #6: What Changed copy stays readable rather than ellipsized. */
      .ba-insights-delta{min-height:68px!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
      .ba-insights-delta b{
        white-space:normal!important;overflow:visible!important;text-overflow:clip!important;
        overflow-wrap:anywhere!important;line-height:1.28!important;font-size:clamp(11px,3vw,14px)!important
      }

      /* #9: Japanese/CJK uses native wrapping, not English nowrap geometry. */
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
      html[lang^="ja"] .ba-insights-delta span{
        white-space:normal!important;overflow:visible!important;text-overflow:clip!important;
        overflow-wrap:anywhere!important;line-height:1.45!important
      }
      html[lang^="ja"] .checkup-cta__copy strong{line-height:1.2!important;letter-spacing:-.02em!important}
      html[lang^="ja"] .checkup-cta__copy small{display:block!important;margin-top:4px!important;line-height:1.4!important}

      /* #4: added bulk control uses the tool's existing secondary-button visual language. */
      [data-final-select-all]{white-space:nowrap!important}
      .ba-final-help-faq{margin-top:10px;padding:12px;border-radius:18px;background:linear-gradient(145deg,#fff,#f4f8fc);border:1px solid rgba(77,108,140,.10)}
      .ba-final-help-faq[hidden]{display:none!important}
      .ba-final-help-faq h3{margin:0 0 9px;font-size:12px;color:#223a53}
      .ba-final-help-faq article+article{margin-top:10px;padding-top:10px;border-top:1px solid rgba(79,105,132,.09)}
      .ba-final-help-faq strong{display:block;font-size:11px;line-height:1.35;color:#263d55}
      .ba-final-help-faq p{margin:4px 0 0;font-size:10px;line-height:1.5;color:#708194}
      @media(max-width:420px){
        .ba-empty-selection .ba-empty-secondary{display:inline-flex!important}
        .ba-empty-selection__inner{grid-template-columns:minmax(0,1fr) auto!important;gap:7px!important}
        .ba-empty-selection__inner>div:first-child{grid-column:1/-1!important}
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
  function protectScrollCue() {
    cancelAnimationFrame(cueFrame);
    cueFrame = requestAnimationFrame(() => {
      const cue = document.getElementById('baScrollCue');
      if (!cue || !cue.classList.contains('is-visible') || !isVisible(cue)) return;
      const cueRect = cue.getBoundingClientRect();
      let extraBottom = 0;
      document.querySelectorAll(CTA_BLOCKERS).forEach((blocker) => {
        if (!isVisible(blocker)) return;
        const rect = blocker.getBoundingClientRect();
        if (cueOverlaps(cueRect, rect)) extraBottom = Math.max(extraBottom, Math.max(0, cueRect.bottom - rect.top) + 10);
      });
      const current = Number.parseFloat(cue.style.bottom || '0') || 0;
      const lastApplied = Number.parseFloat(cue.dataset.finalPolishApplied || 'NaN');
      const storedBase = Number.parseFloat(cue.dataset.finalPolishBase || 'NaN');
      const base = Number.isFinite(lastApplied) && Math.abs(current - lastApplied) < 0.5
        ? (Number.isFinite(storedBase) ? storedBase : current)
        : current;
      const finalBottom = Math.max(0, base) + extraBottom;
      cue.dataset.finalPolishBase = String(Math.max(0, base));
      cue.dataset.finalPolishApplied = String(finalBottom);
      cue.style.bottom = `${finalBottom}px`;
    });
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
      let select = surface.querySelector(`[data-final-select-all="${key}"]`);
      if (!select) {
        select = document.createElement('button');
        select.type = 'button';
        select.className = clear.className;
        select.dataset.finalSelectAll = key;
        clear.insertAdjacentElement('beforebegin', select);
      }
      if (select.textContent !== t.selectAll) select.textContent = t.selectAll;
      const boxes = eligibleBoxes(spec);
      const selectedCount = boxes.filter((box) => box.checked).length;
      const more = surface.querySelector(spec.more);
      const hasMore = Boolean(more && !more.disabled && isVisible(more));
      const capReached = selectedCount >= spec.cap;
      const allSelected = boxes.length > 0 && boxes.every((box) => box.checked) && !hasMore;
      select.disabled = !snapshotSafe(spec) || boxes.length === 0 || capReached || allSelected;
    });

    // Duplicates already owns a safe keep-one-copy bulk selector. Relabel only
    // when the capability is actually available; never convert it to raw select-all.
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

  function helpActionMarkup(action, title, sub) {
    return `<button class="setting-link ba-final-help-action" type="button" data-final-help-action="${esc(action)}"><span class="ba-action-copy"><strong>${esc(title)}</strong><small>${esc(sub)}</small></span><b>›</b></button>`;
  }
  function faqMarkup(t) {
    return `<section class="ba-final-help-faq" id="baFinalHelpFaq" data-final-lang="${esc(language())}" hidden><h3>${esc(t.faqTitle)}</h3>` +
      `<article><strong>${esc(t.faqPrivacyQ)}</strong><p>${esc(t.faqPrivacyA)}</p></article>` +
      `<article><strong>${esc(t.faqDeleteQ)}</strong><p>${esc(t.faqDeleteA)}</p></article>` +
      `<article><strong>${esc(t.faqRestoreQ)}</strong><p>${esc(t.faqRestoreA)}</p></article></section>`;
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
    const title = document.getElementById('baUnifiedDetailTitle');
    if (title && title.textContent !== t.helpTitle) title.textContent = t.helpTitle;
    const principleCopy = detail.querySelector('.ba-detail-principle .privacy-principle-card__copy p');
    if (principleCopy && principleCopy.textContent !== t.helpLead) principleCopy.textContent = t.helpLead;
    const group = detail.querySelector('.ba-detail-action-group');
    if (!group) return;

    if (!group.querySelector('[data-final-help-action]')) {
      group.insertAdjacentHTML('afterbegin',
        helpActionMarkup('faq', t.faq, t.faqSub) +
        helpActionMarkup('contact', t.contact, t.contactSub) +
        helpActionMarkup('purchase', t.purchase, t.purchaseSub)
      );
    }
    let faq = document.getElementById('baFinalHelpFaq');
    if (faq && faq.dataset.finalLang !== language()) {
      const wasHidden = faq.hidden;
      faq.remove();
      group.insertAdjacentHTML('afterend', faqMarkup(t));
      faq = document.getElementById('baFinalHelpFaq');
      if (faq) faq.hidden = wasHidden;
    } else if (!faq) {
      group.insertAdjacentHTML('afterend', faqMarkup(t));
    }
  }

  async function contactSupport() {
    const t = c();
    const native = window.BearagnosticNative;
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Bearagnostic Support')}`;
    const result = parse(native?.openExternalUrl?.(url), {});
    if (result?.accepted) return;
    let copied = false;
    try { copied = Boolean(await window.BearagnosticAppAPI?.copyText?.(SUPPORT_EMAIL)); } catch (_) {}
    window.BearagnosticAppAPI?.showToast?.(copied ? t.contactFallback : SUPPORT_EMAIL);
  }

  function toggleFaq() {
    const panel = document.getElementById('baFinalHelpFaq');
    if (!panel) return;
    panel.hidden = !panel.hidden;
    if (!panel.hidden) panel.scrollIntoView?.({behavior:'smooth', block:'nearest'});
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
    protectScrollCue();
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
        const action = help.dataset.finalHelpAction;
        if (action === 'faq') toggleFaq();
        else if (action === 'contact') contactSupport();
        else if (action === 'purchase') {
          window.dispatchEvent(new CustomEvent('bearagnostic:prorequest', {detail:{source:'more'}}));
        }
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
    window.addEventListener('resize', protectScrollCue, {passive:true});
    window.addEventListener('bearagnostic:screenchange', schedulePatch);
    window.addEventListener('bearagnostic:languagechange', schedulePatch);
    window.addEventListener('bearagnostic:hiddenitemschange', schedulePatch);
    window.addEventListener('bearagnostic:entitlementchange', schedulePatch);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();

  window.BearagnosticFinalPolish = Object.freeze({refresh:schedulePatch});
})();
