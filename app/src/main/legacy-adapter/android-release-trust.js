(() => {
  'use strict';

  /*
   * Bearagnostic Android B89 — customer trust & release presentation.
   *
   * Narrow scope only:
   * - premium Lifetime Pro ownership presentation with a diamond mark;
   * - clear, pre-permission file-access trust explanation;
   * - official distribution/authenticity guidance in About;
   * - defensive removal of stale customer-facing Google Play launch copy;
   * - Pro sheet close control anchored to the sheet's top-right corner.
   *
   * No scanner, deletion, entitlement, billing, OTP, commerce, history or
   * support-routing behavior is changed here.
   */
  const BUILD = 89;
  const STYLE_ID = 'androidReleaseTrust89Style';
  const byId = (id) => document.getElementById(id);
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));

  const STALE_PRO_MARKERS = Object.freeze([
    'Google Play purchase setup is intentionally not active in this development build yet.',
    'The next Billing batch will supply the local Play price, purchase, restore and ownership lifecycle to this entitlement layer.',
    'ระบบซื้อผ่าน Google Play ยังไม่เปิดใน development build นี้โดยตั้งใจ',
    'Batch Billing ถัดไปจะเชื่อมราคาตามประเทศ การซื้อ การกู้คืนสิทธิ์ และวงจรสถานะเจ้าของเข้ากับ entitlement layer นี้',
    'この開発ビルドでは Google Play の購入処理を意図的にまだ有効化していません。',
    '次の Billing バッチで、地域別価格・購入・復元・所有権ライフサイクルをこの entitlement layer に接続します。'
  ]);

  const COPY = Object.freeze({
    en: {
      ownerTitle:'Lifetime Pro · 249 THB',
      ownerBody:'Buy or restore Bearagnostic Pro through the verified Ko-fi purchase flow.',
      ownerMeta:'One-time purchase · No subscription',
      permissionTitle:'Your files stay in your control',
      permissionIntro:'Bearagnostic needs file access to review files on this device.',
      permissionPoints:[
        'Analysis stays on this device',
        'Nothing is deleted automatically',
        'You review and confirm before deletion',
        'Selected file contents are not uploaded for ordinary analysis'
      ],
      authenticityTitle:'Official & Authentic',
      authenticityIntro:'Install Bearagnostic only from Benedict Interactive’s official release channels.',
      officialLabel:'Official website',
      officialValue:'benedictinteractive.com',
      authorizedLabel:'Authorized distribution',
      authorizedValue:'Uptodown',
      authenticityNote:'Avoid installing Bearagnostic from other sources.',
      privacyTitle:'Privacy',
      privacyBody:'Bearagnostic is local-first. File analysis, previews, and aggregate Insights history stay on your device, and selected file contents are not uploaded. Purchase and restore contact the Benedict entitlement service only when you start those actions; Ko-fi handles checkout. Support links use the network only when you choose to open them.',
      thirdPartyTitle:'Third-Party Notices',
      thirdPartyBody:'Android and other third-party components, services, fonts, libraries, marks, and materials remain subject to their own licences and terms. Bearagnostic does not claim ownership of third-party or public-domain material. A valid third-party licence controls for its component where applicable.'
    },
    th: {
      ownerTitle:'Lifetime Pro · 249 บาท',
      ownerBody:'ซื้อหรือกู้คืน Bearagnostic Pro ผ่านขั้นตอนการซื้อ Ko-fi ที่ตรวจสอบสิทธิ์แล้ว',
      ownerMeta:'ซื้อครั้งเดียว · ไม่มีค่าสมาชิกรายเดือน',
      permissionTitle:'คุณควบคุมไฟล์ของคุณเสมอ',
      permissionIntro:'Bearagnostic ต้องใช้สิทธิ์เข้าถึงไฟล์เพื่อวิเคราะห์ไฟล์บนอุปกรณ์นี้',
      permissionPoints:[
        'วิเคราะห์ไฟล์ภายในอุปกรณ์นี้',
        'ไม่มีการลบไฟล์อัตโนมัติ',
        'คุณตรวจและยืนยันก่อนลบทุกครั้ง',
        'ไม่อัปโหลดเนื้อหาไฟล์ที่เลือกสำหรับการวิเคราะห์ตามปกติ'
      ],
      authenticityTitle:'เวอร์ชันทางการและตรวจสอบแหล่งที่มาได้',
      authenticityIntro:'ติดตั้ง Bearagnostic เฉพาะจากช่องทางเผยแพร่ทางการของ Benedict Interactive',
      officialLabel:'เว็บไซต์ทางการ',
      officialValue:'benedictinteractive.com',
      authorizedLabel:'ช่องทางเผยแพร่ที่ได้รับอนุญาต',
      authorizedValue:'Uptodown',
      authenticityNote:'หลีกเลี่ยงการติดตั้ง Bearagnostic จากแหล่งอื่น',
      privacyTitle:'ความเป็นส่วนตัว',
      privacyBody:'Bearagnostic ออกแบบแบบ local-first การวิเคราะห์ไฟล์ พรีวิว และประวัติ Insights แบบสรุปอยู่บนอุปกรณ์ และไม่มีการอัปโหลดเนื้อหาไฟล์ที่เลือก การซื้อและกู้คืนจะติดต่อบริการสิทธิ์ของ Benedict เฉพาะเมื่อคุณเริ่มขั้นตอนนั้น โดย Ko-fi เป็นผู้ดูแลการชำระเงิน ส่วนลิงก์ช่วยเหลือจะใช้อินเทอร์เน็ตเมื่อคุณเลือกเปิดเท่านั้น',
      thirdPartyTitle:'ประกาศเกี่ยวกับบุคคลที่สาม',
      thirdPartyBody:'Android และ component บริการ ฟอนต์ ไลบรารี เครื่องหมาย และวัสดุของบุคคลที่สาม อยู่ภายใต้ licence และเงื่อนไขของเจ้าของแต่ละราย Bearagnostic ไม่อ้างกรรมสิทธิ์เหนือวัสดุของบุคคลที่สามหรือสาธารณสมบัติ และ licence ที่มีผลใช้บังคับย่อมมีผลกับ component นั้น'
    },
    ja: {
      ownerTitle:'Lifetime Pro · 249 THB',
      ownerBody:'検証済みの Ko-fi 購入フローから Bearagnostic Pro を購入・復元できます。',
      ownerMeta:'買い切り · サブスクリプションなし',
      permissionTitle:'ファイルの管理は、いつでもあなたの手に。',
      permissionIntro:'Bearagnostic は、この端末上のファイルを確認するためにアクセス権限を必要とします。',
      permissionPoints:[
        '解析は端末内で行います',
        'ファイルを自動削除しません',
        '削除前に内容を確認し、あなたが実行を確定します',
        '通常の解析で選択したファイル内容をアップロードしません'
      ],
      authenticityTitle:'公式配布と真正性',
      authenticityIntro:'Bearagnostic は Benedict Interactive の公式配布元からインストールしてください。',
      officialLabel:'公式サイト',
      officialValue:'benedictinteractive.com',
      authorizedLabel:'正規配布',
      authorizedValue:'Uptodown',
      authenticityNote:'上記以外の配布元からはインストールしないでください。',
      privacyTitle:'プライバシー',
      privacyBody:'Bearagnostic はローカル優先で設計されています。ファイル解析、プレビュー、集計された Insights 履歴は端末内で扱い、選択したファイル内容をアップロードしません。購入・復元は、利用者がその操作を開始した場合にのみ Benedict の権限サービスへ接続し、決済は Ko-fi が処理します。サポート用リンクも、利用者が選んで開いた場合にのみネットワークを使用します。',
      thirdPartyTitle:'第三者ライセンス',
      thirdPartyBody:'Android、および第三者のコンポーネント、サービス、フォント、ライブラリ、商標、素材には、それぞれのライセンスと利用条件が適用されます。Bearagnostic は第三者素材やパブリックドメイン素材の所有権を主張しません。該当コンポーネントに有効な第三者ライセンスがある場合は、その条件が優先されます。'
    }
  });

  function language() {
    const value = String(document.documentElement.lang || 'en').toLowerCase();
    if (value.startsWith('th')) return 'th';
    if (value.startsWith('ja')) return 'ja';
    return 'en';
  }
  function copy() { return COPY[language()] || COPY.en; }
  function staleGoogleCopy(text) {
    const value = String(text || '');
    return STALE_PRO_MARKERS.some((marker) => value.includes(marker));
  }

  const SHIELD_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 5.4 6v5.1c0 4.5 2.7 7.7 6.6 9.7 3.9-2 6.6-5.2 6.6-9.7V6z"/><path d="m8.9 12 2 2 4.4-4.5"/></svg>';
  const VERIFIED_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 14.3 5l3-.1.9 2.8 2.4 1.8-1 2.8.8 2.9-2.5 1.6-.9 2.9-3-.1-2 1.8-2.3-1.8-3 .1-.9-2.9-2.4-1.6.8-2.9-1-2.8 2.5-1.8.9-2.8 3 .1z"/><path d="m8.7 12 2.1 2.1 4.6-4.7"/></svg>';

  function ensureStyle() {
    if (byId(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Pro ownership: one premium card family, stable across dynamic commerce states. */
      #bearagnosticProOverlay .ba-pro-head{align-items:start!important}
      #bearagnosticProOverlay .ba-pro-close{align-self:start!important;justify-self:end!important;margin-top:-4px!important;display:grid!important;place-items:center!important}

      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner,
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r89-pro-owner{
        position:relative!important;display:grid!important;grid-template-columns:50px minmax(0,1fr)!important;column-gap:12px!important;row-gap:4px!important;
        margin-top:13px!important;padding:14px!important;border-radius:22px!important;overflow:hidden!important;
        background:radial-gradient(circle at 94% 4%,rgba(83,184,237,.18),transparent 34%),radial-gradient(circle at 8% 100%,rgba(127,95,219,.14),transparent 42%),linear-gradient(145deg,rgba(252,250,255,.99),rgba(241,248,255,.98))!important;
        border:1px solid rgba(103,91,205,.16)!important;
        box-shadow:0 15px 34px rgba(65,74,139,.11),inset 0 1px 0 rgba(255,255,255,.98)!important;
      }
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner::before,
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r89-pro-owner::before{
        content:""!important;grid-column:1!important;grid-row:1/span 2!important;width:50px!important;height:50px!important;border-radius:17px!important;align-self:start!important;
        background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2.8 20 9.4 12 21.2 4 9.4Z' fill='none' stroke='%23ffffff' stroke-width='1.55' stroke-linejoin='round'/%3E%3Cpath d='M4 9.4h16M8.1 9.4 12 21.2l3.9-11.8M8.1 9.4 10.4 3h3.2l2.3 6.4' fill='none' stroke='%23ffffff' stroke-width='1.3' stroke-linejoin='round'/%3E%3C/svg%3E") center/27px 27px no-repeat,linear-gradient(145deg,%239b88ef 0%,%236f5ed8 48%,%233b9de2 100%)!important;
        box-shadow:0 10px 24px rgba(78,73,177,.22),inset 0 1px 0 rgba(255,255,255,.35)!important;
      }
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner>*:not(.ba-k3-input):not(.ba-k3-actions):not(.ba-k3-recovery):not(.ba-k3-recovery-action):not(.ba-k3-error):not(.ba-pro-primary),
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r89-pro-owner>*:not(.ba-k3-input):not(.ba-k3-actions):not(.ba-k3-recovery):not(.ba-k3-recovery-action):not(.ba-k3-error):not(.ba-pro-primary){grid-column:2!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner>.ba-k3-input,
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner>.ba-k3-actions,
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner>.ba-k3-recovery,
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner>.ba-k3-recovery-action,
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner>.ba-k3-error,
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner>.ba-pro-primary,
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r89-pro-owner>.ba-k3-input,
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r89-pro-owner>.ba-k3-actions,
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r89-pro-owner>.ba-k3-recovery,
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r89-pro-owner>.ba-k3-recovery-action,
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r89-pro-owner>.ba-k3-error,
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r89-pro-owner>.ba-pro-primary{grid-column:1/-1!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner>strong,
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r89-pro-owner>strong{color:#342d72!important;font-size:13.8px!important;line-height:1.28!important;letter-spacing:-.015em!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner>small,
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r89-pro-owner>small{color:#5d7185!important;font-size:11.2px!important;line-height:1.5!important;margin-top:2px!important}
      .ba-r89-owner-meta{display:block!important;margin-top:5px!important;color:#7468b5!important;font-size:9.2px!important;line-height:1.35!important;font-weight:790!important;letter-spacing:.015em!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner .ba-k3-input{border-color:rgba(105,93,202,.18)!important;background:rgba(255,255,255,.92)!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner .ba-k3-input:focus{border-color:rgba(91,88,202,.42)!important;box-shadow:0 0 0 3px rgba(106,91,205,.10)!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner .ba-k3-actions .ba-pro-primary{background:linear-gradient(118deg,#7865da,#2b92df)!important;color:#fff!important;box-shadow:0 10px 21px rgba(81,78,176,.18)!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner .ba-k3-secondary{background:rgba(255,255,255,.9)!important;border-color:rgba(104,93,190,.13)!important;color:#615d86!important}

      /* Pre-permission trust card: prominent, calm and non-alarmist. */
      #permissionSheet{max-height:calc(100dvh - max(14px,env(safe-area-inset-top)))!important;overflow-y:auto!important;overscroll-behavior:contain!important}
      #permissionSheet .ba-r89-permission-trust{display:grid;grid-template-columns:46px minmax(0,1fr);gap:12px;align-items:start;margin:12px 0 14px;padding:14px;border-radius:21px;background:radial-gradient(circle at 95% 0%,rgba(76,196,220,.16),transparent 34%),linear-gradient(145deg,#f1fbfb,#f5f9ff);border:1px solid rgba(41,159,173,.14);box-shadow:0 14px 30px rgba(45,99,120,.09),inset 0 1px 0 rgba(255,255,255,.97)}
      #permissionSheet .ba-r89-trust-icon{width:46px;height:46px;border-radius:16px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#63d8d0,#2ca8c9 52%,#388ed8);box-shadow:0 10px 22px rgba(39,137,161,.20),inset 0 1px 0 rgba(255,255,255,.34)}
      #permissionSheet .ba-r89-trust-icon svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      #permissionSheet .ba-r89-permission-copy{min-width:0}
      #permissionSheet .ba-r89-permission-copy>strong{display:block;color:#244d59;font-size:13.6px;line-height:1.28;letter-spacing:-.012em}
      #permissionSheet .ba-r89-permission-copy>p{margin:5px 0 0;color:#617c88;font-size:10.5px;line-height:1.5}
      #permissionSheet .ba-r89-permission-points{display:grid;gap:6px;margin-top:10px;grid-column:1/-1}
      #permissionSheet .ba-r89-permission-point{display:grid;grid-template-columns:18px minmax(0,1fr);gap:7px;align-items:start;color:#526f7a;font-size:10px;line-height:1.4}
      #permissionSheet .ba-r89-permission-point::before{content:"✓";width:18px;height:18px;border-radius:999px;display:grid;place-items:center;background:#dcf5ef;color:#238a76;font-size:10px;font-weight:900;line-height:1}

      /* About authenticity card: canonical source first, authorized mirror second. */
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-card{display:grid;grid-template-columns:48px minmax(0,1fr);gap:12px;align-items:start;margin:0 0 14px;padding:14px;border-radius:21px;background:radial-gradient(circle at 100% 0%,rgba(63,165,224,.13),transparent 36%),linear-gradient(145deg,rgba(250,253,255,.99),rgba(242,248,253,.98));border:1px solid rgba(70,129,170,.13);box-shadow:0 14px 30px rgba(59,88,117,.075),inset 0 1px 0 rgba(255,255,255,.98)}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-icon{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#8fd4ee,#4ca9da 48%,#587fd2);box-shadow:0 10px 22px rgba(64,127,172,.19),inset 0 1px 0 rgba(255,255,255,.34)}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-icon svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.55;stroke-linecap:round;stroke-linejoin:round}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-copy>strong{display:block;color:#284c67;font-size:13.8px;line-height:1.28;letter-spacing:-.012em}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-copy>p{margin:5px 0 0;color:#687f91;font-size:10.4px;line-height:1.5}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-rows{grid-column:1/-1;display:grid;gap:7px;margin-top:2px}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-row{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:10px;align-items:center;padding:9px 10px;border-radius:14px;background:rgba(255,255,255,.74);border:1px solid rgba(76,119,153,.085)}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-row span{color:#7d8e9e!important;font-size:9px!important;line-height:1.3!important;letter-spacing:0!important;text-transform:none!important}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-row b{min-width:0;color:#365d7b;font-size:10.5px;line-height:1.3;text-align:right;overflow-wrap:anywhere}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-note{grid-column:1/-1;margin:1px 2px 0;color:#788b9b;font-size:9.3px;line-height:1.45}

      @media(max-width:360px){
        #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner,#baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r89-pro-owner{grid-template-columns:44px minmax(0,1fr)!important;padding:12px!important;column-gap:10px!important}
        #bearagnosticProOverlay .ba-pro-purchase.ba-r89-pro-owner::before,#baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r89-pro-owner::before{width:44px!important;height:44px!important;border-radius:15px!important;background-size:24px 24px!important}
        #permissionSheet .ba-r89-permission-trust{grid-template-columns:42px minmax(0,1fr);padding:12px;gap:10px}
        #permissionSheet .ba-r89-trust-icon{width:42px;height:42px;border-radius:14px}
        #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-card{grid-template-columns:43px minmax(0,1fr);padding:12px;gap:10px}
        #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-icon{width:43px;height:43px;border-radius:14px}
        #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-row{grid-template-columns:1fr;gap:3px}
        #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r89-auth-row b{text-align:left}
      }
      @media(prefers-reduced-motion:reduce){#permissionSheet .ba-r89-permission-trust,#baUnifiedSettingsDetail .ba-r89-auth-card{scroll-behavior:auto!important}}
    `;
    document.head.appendChild(style);
  }

  function rewriteStaleProCard(card) {
    const t = copy();
    const strong = card.querySelector('strong');
    const small = card.querySelector('small');
    if (strong) strong.textContent = t.ownerTitle;
    if (small) small.innerHTML = `${esc(t.ownerBody)}<span class="ba-r89-owner-meta">${esc(t.ownerMeta)}</span>`;
    card.querySelectorAll('button').forEach((button) => {
      if (!button.dataset.k3Action && !button.dataset.debugTier && !button.dataset.k3DebugTier) button.remove();
    });
  }

  function splitStaticOwnerCopy(card) {
    const t = copy();
    const strong = card.querySelector(':scope > strong');
    const small = card.querySelector(':scope > small');
    if (!strong || !small) return;
    const text = `${strong.textContent || ''} ${small.textContent || ''}`;
    const looksLikeOwnerCopy =
      strong.textContent.trim() === t.ownerTitle ||
      (text.includes('Ko-fi') && (text.includes('249') || text.includes('ซื้อครั้งเดียว') || text.includes('買い切り')));
    if (!looksLikeOwnerCopy) return;
    if (!small.querySelector('.ba-r89-owner-meta')) {
      small.innerHTML = `${esc(t.ownerBody)}<span class="ba-r89-owner-meta">${esc(t.ownerMeta)}</span>`;
    }
    // The legacy Free placeholder used a disabled button only to repeat rollout
    // status. It is not an action and visually reads like a blocked CTA. Remove
    // it; genuine commerce actions injected by android-billing carry data-k3-action.
    const placeholder = card.querySelector(':scope > .ba-pro-primary[disabled]');
    if (placeholder && !placeholder.dataset.k3Action && !/^PRO(?:\s|$)/i.test(String(placeholder.textContent || '').trim())) {
      placeholder.remove();
    }
  }

  function polishPro() {
    const roots = [
      byId('bearagnosticProOverlay'),
      document.querySelector('#baUnifiedSettingsDetail[data-detail-kind="pro"]')
    ].filter(Boolean);
    roots.forEach((root) => {
      const cards = $$('.ba-pro-purchase', root);
      const stale = cards.filter((card) => staleGoogleCopy(card.textContent));
      const clean = cards.filter((card) => !staleGoogleCopy(card.textContent));
      if (clean.length) stale.forEach((card) => card.remove());
      else stale.forEach(rewriteStaleProCard);
      $$('.ba-pro-purchase', root).forEach((card) => {
        card.classList.add('ba-r89-pro-owner');
        splitStaticOwnerCopy(card);
      });
    });
  }

  function permissionMarkup() {
    const t = copy();
    return `<section class="ba-r89-permission-trust" id="baR89PermissionTrust" aria-label="${esc(t.permissionTitle)}">` +
      `<span class="ba-r89-trust-icon">${SHIELD_ICON}</span>` +
      `<div class="ba-r89-permission-copy"><strong>${esc(t.permissionTitle)}</strong><p>${esc(t.permissionIntro)}</p></div>` +
      `<div class="ba-r89-permission-points">${t.permissionPoints.map((point) => `<div class="ba-r89-permission-point">${esc(point)}</div>`).join('')}</div>` +
      `</section>`;
  }

  function ensurePermissionTrust() {
    const sheet = byId('permissionSheet');
    const grant = byId('grantStorage');
    if (!sheet || !grant) return;
    const existing = byId('baR89PermissionTrust');
    if (existing) existing.outerHTML = permissionMarkup();
    else grant.insertAdjacentHTML('beforebegin', permissionMarkup());
  }

  function authenticityMarkup() {
    const t = copy();
    return `<section class="ba-r89-auth-card" id="baR89AuthenticityCard" aria-label="${esc(t.authenticityTitle)}">` +
      `<span class="ba-r89-auth-icon">${VERIFIED_ICON}</span>` +
      `<div class="ba-r89-auth-copy"><strong>${esc(t.authenticityTitle)}</strong><p>${esc(t.authenticityIntro)}</p></div>` +
      `<div class="ba-r89-auth-rows">` +
        `<div class="ba-r89-auth-row"><span>${esc(t.officialLabel)}</span><b>${esc(t.officialValue)}</b></div>` +
        `<div class="ba-r89-auth-row"><span>${esc(t.authorizedLabel)}</span><b>${esc(t.authorizedValue)}</b></div>` +
      `</div><p class="ba-r89-auth-note">${esc(t.authenticityNote)}</p></section>`;
  }

  function ensureAuthenticityCard() {
    const detail = document.querySelector('#baUnifiedSettingsDetail[data-detail-kind="about"]');
    if (!detail || detail.hidden) return;
    const scroll = byId('baUnifiedDetailScroll');
    if (!scroll) return;
    const existing = byId('baR89AuthenticityCard');
    if (existing) existing.outerHTML = authenticityMarkup();
    else {
      const principle = scroll.querySelector('.ba-detail-about-principle,.ba-detail-principle');
      if (principle) principle.insertAdjacentHTML('afterend', authenticityMarkup());
      else scroll.insertAdjacentHTML('afterbegin', authenticityMarkup());
    }
  }

  function scrubVisibleLegalGoogleCopy() {
    const t = copy();
    [
      document.querySelector('#baUnifiedSettingsDetail[data-detail-kind="legal"]'),
      byId('baLegalOverlay')
    ].filter(Boolean).forEach((root) => {
      root.querySelectorAll('.ba-detail-section,.ba-legal-card').forEach((section) => {
        const title = section.querySelector('strong')?.textContent?.trim() || '';
        const body = section.querySelector('p');
        if (!body || !body.textContent.includes('Google Play')) return;
        if (title === t.privacyTitle) body.textContent = t.privacyBody;
        else if (title === t.thirdPartyTitle) body.textContent = t.thirdPartyBody;
      });
    });
  }

  let frame = 0;
  function scheduleRefresh(delay = 0) {
    if (delay > 0) {
      window.setTimeout(() => scheduleRefresh(0), delay);
      return;
    }
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      ensureStyle();
      ensurePermissionTrust();
      polishPro();
      ensureAuthenticityCard();
      scrubVisibleLegalGoogleCopy();
    });
  }

  function initialize() {
    ensureStyle();
    ensurePermissionTrust();
    scheduleRefresh();

    // Existing modules render these surfaces synchronously or on the next task.
    // A small bounded refresh fan-out avoids a global MutationObserver and keeps
    // this release layer deterministic.
    window.addEventListener('bearagnostic:prorequest', () => {
      scheduleRefresh();
      scheduleRefresh(40);
      scheduleRefresh(180);
    });
    window.addEventListener('bearagnostic:screenchange', () => {
      scheduleRefresh();
      scheduleRefresh(40);
    });
    window.addEventListener('bearagnostic:entitlementchange', () => {
      scheduleRefresh();
      scheduleRefresh(80);
    });
    window.addEventListener('bearagnostic:languagechange', () => {
      scheduleRefresh();
      scheduleRefresh(40);
    });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) scheduleRefresh(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();

  window.BearagnosticReleaseTrust = Object.freeze({build:BUILD, refresh:scheduleRefresh});
})();
