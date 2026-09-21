(() => {
  'use strict';

  /*
   * Bearagnostic Android B90 — final release trust integration.
   *
   * This module is the final presentation owner for the customer-facing Pro
   * catalogue, Lifetime ownership emphasis, pre-permission trust explanation,
   * and About authenticity guidance. It intentionally does not mutate scanner,
   * deletion, entitlement, OTP, commerce, history or support-routing logic.
   */
  const BUILD = 90;
  const STYLE_ID = 'androidReleaseTrust90Style';
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

  const FEATURE_ICONS = Object.freeze({
    deep:'<path d="m12 3 8 4-8 4-8-4z"/><path d="m4 12 8 4 8-4M4 17l8 4 8-4"/>',
    custom:'<path d="M4 6h10M18 6h2M10 12h10M4 12h2M4 18h10M18 18h2"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>',
    duplicates:'<rect x="5" y="5" width="11" height="11" rx="2"/><rect x="8" y="8" width="11" height="11" rx="2"/><path d="m11 13 2 2 4-4"/>',
    media:'<rect x="4" y="5" width="16" height="14" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="m6.8 16 3.2-3 2.3 2 2.4-2.6 2.7 3.6"/>',
    insights:'<path d="M5 19V9M10 19V5M15 19v-7M20 19V3"/><path d="M3 19h19"/>',
    cleanup:'<path d="M7 7h10M9 7V5h6v2M8 10l.7 8h6.6l.7-8"/><path d="m10.2 13 1.2 1.2 2.5-2.5"/>'
  });

  const COPY = Object.freeze({
    en: {
      ownerTitle:'Lifetime Pro · 249 THB',
      ownerBody:'Buy or restore Bearagnostic Pro through the verified Ko-fi purchase flow.',
      ownerMeta:'One-time purchase · No subscription',
      valueBadge:'LIFETIME',
      valueTitle:'Lifetime Pro. One payment.',
      valueBody:'No subscription · No ads · No Bearagnostic account required.',
      available:'Available in the current app',
      features:[
        ['deep','Deep Scan','Full streaming reads of readable files plus exact duplicate verification across the accessible scope.'],
        ['custom','Custom Scan','Choose Downloads, Photos, Videos, Documents or Music and decide whether to verify exact duplicates.'],
        ['duplicates','Advanced Duplicates','Full-scope verification with Deep Scan plus one-tap recommended selection across duplicate groups.'],
        ['media','Advanced Media Review','Review surfaced photos, videos and audio with richer local previews and filters.'],
        ['insights','Insights & Local History','Historical checkups, What Changed, real storage trends and local patterns from completed scans.'],
        ['cleanup','Verified Cleanup History','A local history built only from deletions that Bearagnostic verified as completed.']
      ],
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
      officialLabel:'Official website', officialValue:'benedictinteractive.com',
      authorizedLabel:'Authorized distribution', authorizedValue:'Uptodown',
      warningTitle:'Official sources only',
      warningBody:'For your safety, install Bearagnostic only from benedictinteractive.com or Uptodown.',
      privacyTitle:'Privacy',
      privacyBody:'Bearagnostic is local-first. File analysis, previews, and aggregate Insights history stay on your device, and selected file contents are not uploaded. Purchase and restore contact the Benedict entitlement service only when you start those actions; Ko-fi handles checkout. Support links use the network only when you choose to open them.',
      thirdPartyTitle:'Third-Party Notices',
      thirdPartyBody:'Android and other third-party components, services, fonts, libraries, marks, and materials remain subject to their own licences and terms. Bearagnostic does not claim ownership of third-party or public-domain material. A valid third-party licence controls for its component where applicable.'
    },
    th: {
      ownerTitle:'Lifetime Pro · 249 บาท',
      ownerBody:'ซื้อหรือกู้คืน Bearagnostic Pro ผ่านขั้นตอนการซื้อ Ko-fi ที่ตรวจสอบสิทธิ์แล้ว',
      ownerMeta:'ซื้อครั้งเดียว · ไม่มีค่าสมาชิกรายเดือน',
      valueBadge:'ตลอดชีพ',
      valueTitle:'Pro ตลอดชีพ จ่ายครั้งเดียว',
      valueBody:'ไม่มีค่าสมาชิกรายเดือน · ไม่มีโฆษณา · ไม่ต้องมีบัญชี Bearagnostic',
      available:'ความสามารถที่มีอยู่ในแอปตอนนี้',
      features:[
        ['deep','Deep Scan','อ่านเนื้อหาไฟล์ที่อ่านได้แบบ streaming จนครบ และยืนยันไฟล์ซ้ำแบบ exact ทั่วขอบเขตที่เข้าถึงได้'],
        ['custom','Custom Scan','เลือก Downloads, Photos, Videos, Documents หรือ Music และกำหนดว่าจะยืนยันไฟล์ซ้ำแบบ exact หรือไม่'],
        ['duplicates','Advanced Duplicates','ตรวจยืนยันไฟล์ซ้ำทั่วขอบเขตด้วย Deep Scan พร้อมเลือกสำเนาส่วนเกินที่แนะนำในทุกกลุ่มได้ในครั้งเดียว'],
        ['media','Advanced Media Review','ตรวจรูป วิดีโอ และเสียงที่ถูกคัดขึ้นมาจาก Checkup พร้อม preview และตัวกรองบนเครื่องที่ละเอียดขึ้น'],
        ['insights','Insights และ Local History','ดูประวัติ Checkup, What Changed, แนวโน้มพื้นที่จริง และรูปแบบที่สรุปจากการตรวจที่เสร็จสมบูรณ์'],
        ['cleanup','ประวัติการลบที่ยืนยันแล้ว','เก็บประวัติบนเครื่องเฉพาะรายการที่ Bearagnostic ตรวจยืนยันแล้วว่าลบสำเร็จจริง']
      ],
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
      officialLabel:'เว็บไซต์ทางการ', officialValue:'benedictinteractive.com',
      authorizedLabel:'ช่องทางเผยแพร่ที่ได้รับอนุญาต', authorizedValue:'Uptodown',
      warningTitle:'ติดตั้งจากแหล่งทางการเท่านั้น',
      warningBody:'เพื่อความปลอดภัย ให้ติดตั้ง Bearagnostic จาก benedictinteractive.com หรือ Uptodown เท่านั้น',
      privacyTitle:'ความเป็นส่วนตัว',
      privacyBody:'Bearagnostic ออกแบบแบบ local-first การวิเคราะห์ไฟล์ พรีวิว และประวัติ Insights แบบสรุปอยู่บนอุปกรณ์ และไม่มีการอัปโหลดเนื้อหาไฟล์ที่เลือก การซื้อและกู้คืนจะติดต่อบริการสิทธิ์ของ Benedict เฉพาะเมื่อคุณเริ่มขั้นตอนนั้น โดย Ko-fi เป็นผู้ดูแลการชำระเงิน ส่วนลิงก์ช่วยเหลือจะใช้อินเทอร์เน็ตเมื่อคุณเลือกเปิดเท่านั้น',
      thirdPartyTitle:'ประกาศเกี่ยวกับบุคคลที่สาม',
      thirdPartyBody:'Android และ component บริการ ฟอนต์ ไลบรารี เครื่องหมาย และวัสดุของบุคคลที่สาม อยู่ภายใต้ licence และเงื่อนไขของเจ้าของแต่ละราย Bearagnostic ไม่อ้างกรรมสิทธิ์เหนือวัสดุของบุคคลที่สามหรือสาธารณสมบัติ และ licence ที่มีผลใช้บังคับย่อมมีผลกับ component นั้น'
    },
    ja: {
      ownerTitle:'Lifetime Pro · 249 THB',
      ownerBody:'検証済みの Ko-fi 購入フローから Bearagnostic Pro を購入・復元できます。',
      ownerMeta:'買い切り · サブスクリプションなし',
      valueBadge:'買い切り',
      valueTitle:'Pro は一度の購入でずっと使えます',
      valueBody:'サブスクなし · 広告なし · Bearagnostic アカウント不要',
      available:'現在のアプリで利用できる機能',
      features:[
        ['deep','Deep Scan','読み取り可能なファイルをストリーミングで最後まで読み、アクセス可能範囲で完全一致の重複を検証します。'],
        ['custom','Custom Scan','Downloads、Photos、Videos、Documents、Music を選び、完全一致の重複検証を行うか指定できます。'],
        ['duplicates','高度な重複整理','Deep Scan の全範囲検証に加え、各重複グループの推奨余分コピーを一括選択できます。'],
        ['media','高度なメディアレビュー','チェックで抽出された写真・動画・音声を、端末内の詳細プレビューとフィルターで確認できます。'],
        ['insights','Insights とローカル履歴','過去のチェック、What Changed、実ストレージ推移、完了したチェックから得たローカル傾向を確認できます。'],
        ['cleanup','検証済みクリーンアップ履歴','Bearagnostic が削除完了を確認できた操作だけを端末内履歴として記録します。']
      ],
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
      officialLabel:'公式サイト', officialValue:'benedictinteractive.com',
      authorizedLabel:'正規配布', authorizedValue:'Uptodown',
      warningTitle:'公式配布元のみ',
      warningBody:'安全のため、Bearagnostic は benedictinteractive.com または Uptodown からのみインストールしてください。',
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
      /* Keep the approved B89 close geometry. */
      #bearagnosticProOverlay .ba-pro-head{align-items:start!important}
      #bearagnosticProOverlay .ba-pro-close{align-self:start!important;justify-self:end!important;margin-top:-4px!important;display:grid!important;place-items:center!important}

      /* Final Pro catalogue: one component anatomy, two columns, three rows. */
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-feature-group{padding:14px!important}
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-feature-group>h3{margin:0 1px 10px!important;color:#6659bd!important;font-size:10px!important;letter-spacing:.12em!important}
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-feature-grid{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:10px!important}
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-feature-card{min-width:0!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;padding:14px 13px 15px!important;border-radius:21px!important;background:linear-gradient(145deg,rgba(255,255,255,.98),rgba(246,246,255,.96))!important;border:1px solid rgba(99,91,181,.10)!important;box-shadow:0 9px 22px rgba(64,72,122,.055),inset 0 1px 0 rgba(255,255,255,.98)!important}
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-feature-icon{width:39px!important;height:39px!important;border-radius:13px!important;display:grid!important;place-items:center!important;margin:0 0 10px!important;color:#655bc1!important;background:linear-gradient(145deg,#f1edff,#edf5ff)!important;box-shadow:inset 0 1px 0 #fff!important}
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-feature-icon svg{width:20px!important;height:20px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.65!important;stroke-linecap:round!important;stroke-linejoin:round!important}
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-feature-card strong{display:block!important;margin:0!important;color:#253950!important;font-size:13.6px!important;line-height:1.27!important;letter-spacing:-.014em!important}
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-feature-card p{margin:7px 0 0!important;color:#718397!important;font-size:10.55px!important;line-height:1.48!important}

      /* The scrolling Pro sheet uses the same six-card anatomy as the Settings-detail view. */
      #bearagnosticProOverlay .ba-pro-feature-grid.ba-r90-overlay-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:10px!important}
      #bearagnosticProOverlay .ba-pro-feature-grid.ba-r90-overlay-grid .ba-pro-feature{display:flex!important;flex-direction:column!important;align-items:flex-start!important;padding:13px!important;border-radius:20px!important;background:linear-gradient(145deg,#fff,#f4f7fd)!important;border:1px solid rgba(94,96,170,.10)!important;box-shadow:0 8px 20px rgba(55,72,116,.05)!important}
      #bearagnosticProOverlay .ba-pro-feature-grid.ba-r90-overlay-grid .ba-pro-feature__icon{grid-column:auto!important;grid-row:auto!important;width:36px!important;height:36px!important;border-radius:12px!important;display:grid!important;place-items:center!important;margin:0 0 9px!important;color:#6259be!important;background:linear-gradient(145deg,#f1edff,#eef5ff)!important}
      #bearagnosticProOverlay .ba-pro-feature-grid.ba-r90-overlay-grid .ba-pro-feature__icon svg{width:19px!important;height:19px!important}
      #bearagnosticProOverlay .ba-pro-feature-grid.ba-r90-overlay-grid .ba-pro-feature>strong{grid-column:auto!important;display:block!important;color:#263950!important;font-size:13.2px!important;line-height:1.28!important;letter-spacing:-.012em!important}
      #bearagnosticProOverlay .ba-pro-feature-grid.ba-r90-overlay-grid .ba-pro-feature>small{grid-column:auto!important;display:block!important;margin-top:6px!important;color:#718397!important;font-size:10.45px!important;line-height:1.46!important}

      /* Lifetime value statement: more visual weight, still subordinate to purchase action. */
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-lifetime-value,#bearagnosticProOverlay .ba-r90-lifetime-value{position:relative!important;margin:0!important;padding:15px 15px 14px!important;border:0!important;border-radius:20px!important;overflow:hidden!important;background:radial-gradient(circle at 95% 0%,rgba(255,210,112,.18),transparent 36%),linear-gradient(140deg,#fff8e8 0%,#fffdf8 64%,#f8f4ff 100%)!important;box-shadow:0 12px 27px rgba(116,90,40,.075),inset 0 1px 0 rgba(255,255,255,.98)!important}
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-lifetime-value::before,#bearagnosticProOverlay .ba-r90-lifetime-value::before{content:"";position:absolute;left:0;top:14px;bottom:14px;width:3px;border-radius:999px;background:linear-gradient(180deg,#f1c65f,#9e82da)}
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-value-badge,#bearagnosticProOverlay .ba-r90-value-badge{display:inline-flex!important;align-items:center!important;min-height:22px!important;padding:0 8px!important;border-radius:999px!important;background:linear-gradient(145deg,#fff0bd,#f8e8c3)!important;border:1px solid rgba(174,128,48,.10)!important;color:#8a6425!important;font-size:8.6px!important;font-weight:900!important;letter-spacing:.09em!important;line-height:1!important}
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-lifetime-value strong,#bearagnosticProOverlay .ba-r90-lifetime-value strong{display:block!important;margin-top:9px!important;color:#57401d!important;font-size:15.4px!important;line-height:1.25!important;letter-spacing:-.02em!important;font-weight:800!important}
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-lifetime-value p,#bearagnosticProOverlay .ba-r90-lifetime-value p{margin:7px 0 0!important;color:#796d59!important;font-size:10.8px!important;line-height:1.48!important}
      #bearagnosticProOverlay .ba-r90-lifetime-value{margin-top:10px!important}

      /* Dynamic commerce card: robust CSS diamond; no SVG/data-URI dependency. */
      #bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner,
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r90-pro-owner{position:relative!important;display:grid!important;grid-template-columns:52px minmax(0,1fr)!important;column-gap:13px!important;row-gap:4px!important;margin-top:13px!important;padding:15px!important;border-radius:22px!important;overflow:hidden!important;background:radial-gradient(circle at 94% 4%,rgba(71,183,239,.19),transparent 34%),radial-gradient(circle at 8% 100%,rgba(119,91,221,.17),transparent 42%),linear-gradient(145deg,rgba(252,250,255,.995),rgba(239,248,255,.985))!important;border:1px solid rgba(101,89,204,.18)!important;box-shadow:0 16px 36px rgba(62,72,142,.12),inset 0 1px 0 rgba(255,255,255,.99)!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner::before,
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r90-pro-owner::before{content:"◇"!important;position:relative!important;inset:auto!important;grid-column:1!important;grid-row:1/span 2!important;width:52px!important;height:52px!important;box-sizing:border-box!important;border-radius:17px!important;display:grid!important;place-items:center!important;align-self:start!important;color:#fff!important;font-family:Georgia,"Times New Roman",serif!important;font-size:31px!important;font-weight:400!important;line-height:1!important;background:linear-gradient(145deg,#9b88ef 0%,#6e5ed8 48%,#319be1 100%)!important;box-shadow:0 11px 25px rgba(77,72,177,.23),inset 0 1px 0 rgba(255,255,255,.38)!important;text-shadow:0 1px 2px rgba(41,39,104,.20)!important;pointer-events:none!important;z-index:1!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner>*:not(.ba-k3-input):not(.ba-k3-actions):not(.ba-k3-recovery):not(.ba-k3-recovery-action):not(.ba-k3-error):not(.ba-pro-primary),
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r90-pro-owner>*:not(.ba-k3-input):not(.ba-k3-actions):not(.ba-k3-recovery):not(.ba-k3-recovery-action):not(.ba-k3-error):not(.ba-pro-primary){grid-column:2!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner>.ba-k3-input,#bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner>.ba-k3-actions,#bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner>.ba-k3-recovery,#bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner>.ba-k3-recovery-action,#bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner>.ba-k3-error,#bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner>.ba-pro-primary,
      #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r90-pro-owner>.ba-k3-input,#baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r90-pro-owner>.ba-k3-actions,#baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r90-pro-owner>.ba-k3-recovery,#baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r90-pro-owner>.ba-k3-recovery-action,#baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r90-pro-owner>.ba-k3-error,#baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r90-pro-owner>.ba-pro-primary{grid-column:1/-1!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner>strong,#baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r90-pro-owner>strong{color:#342d72!important;font-size:14.2px!important;line-height:1.27!important;letter-spacing:-.016em!important;font-weight:820!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner>small,#baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r90-pro-owner>small{color:#5e7186!important;font-size:11.25px!important;line-height:1.5!important;margin-top:2px!important}
      .ba-r90-owner-meta{display:block!important;margin-top:6px!important;color:#7164b7!important;font-size:9.4px!important;line-height:1.35!important;font-weight:820!important;letter-spacing:.015em!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner .ba-k3-input{border-color:rgba(105,93,202,.19)!important;background:rgba(255,255,255,.94)!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner .ba-k3-input:focus{border-color:rgba(91,88,202,.44)!important;box-shadow:0 0 0 3px rgba(106,91,205,.10)!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner .ba-k3-actions .ba-pro-primary{background:linear-gradient(118deg,#7865da,#2b92df)!important;color:#fff!important;box-shadow:0 10px 21px rgba(81,78,176,.18)!important}
      #bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner .ba-k3-secondary{background:rgba(255,255,255,.92)!important;border-color:rgba(104,93,190,.13)!important;color:#615d86!important}

      /* Pre-permission trust card. */
      #permissionSheet{max-height:calc(100dvh - max(14px,env(safe-area-inset-top)))!important;overflow-y:auto!important;overscroll-behavior:contain!important}
      #permissionSheet .ba-r90-permission-trust{display:grid;grid-template-columns:46px minmax(0,1fr);gap:12px;align-items:start;margin:12px 0 14px;padding:14px;border-radius:21px;background:radial-gradient(circle at 95% 0%,rgba(76,196,220,.16),transparent 34%),linear-gradient(145deg,#f1fbfb,#f5f9ff);border:1px solid rgba(41,159,173,.14);box-shadow:0 14px 30px rgba(45,99,120,.09),inset 0 1px 0 rgba(255,255,255,.97)}
      #permissionSheet .ba-r90-trust-icon{width:46px;height:46px;border-radius:16px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#63d8d0,#2ca8c9 52%,#388ed8);box-shadow:0 10px 22px rgba(39,137,161,.20),inset 0 1px 0 rgba(255,255,255,.34)}
      #permissionSheet .ba-r90-trust-icon svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      #permissionSheet .ba-r90-permission-copy{min-width:0}
      #permissionSheet .ba-r90-permission-copy>strong{display:block;color:#244d59;font-size:13.6px;line-height:1.28;letter-spacing:-.012em}
      #permissionSheet .ba-r90-permission-copy>p{margin:5px 0 0;color:#617c88;font-size:10.5px;line-height:1.5}
      #permissionSheet .ba-r90-permission-points{display:grid;gap:6px;margin-top:10px;grid-column:1/-1}
      #permissionSheet .ba-r90-permission-point{display:grid;grid-template-columns:18px minmax(0,1fr);gap:7px;align-items:start;color:#526f7a;font-size:10px;line-height:1.4}
      #permissionSheet .ba-r90-permission-point::before{content:"✓";width:18px;height:18px;border-radius:999px;display:grid;place-items:center;background:#dcf5ef;color:#238a76;font-size:10px;font-weight:900;line-height:1}

      /* About authenticity: stronger safety hierarchy without alarm styling. */
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-card{display:grid;grid-template-columns:48px minmax(0,1fr);gap:12px;align-items:start;margin:0 0 14px;padding:14px;border-radius:21px;background:radial-gradient(circle at 100% 0%,rgba(63,165,224,.13),transparent 36%),linear-gradient(145deg,rgba(250,253,255,.99),rgba(242,248,253,.98));border:1px solid rgba(70,129,170,.13);box-shadow:0 14px 30px rgba(59,88,117,.075),inset 0 1px 0 rgba(255,255,255,.98)}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-icon{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#8fd4ee,#4ca9da 48%,#587fd2);box-shadow:0 10px 22px rgba(64,127,172,.19),inset 0 1px 0 rgba(255,255,255,.34)}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-icon svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.55;stroke-linecap:round;stroke-linejoin:round}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-copy>strong{display:block;color:#284c67;font-size:14.2px;line-height:1.28;letter-spacing:-.012em;font-weight:800}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-copy>p{margin:5px 0 0;color:#687f91;font-size:10.5px;line-height:1.5}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-rows{grid-column:1/-1;display:grid;gap:7px;margin-top:2px}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-row{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:10px;align-items:center;padding:9px 10px;border-radius:14px;background:rgba(255,255,255,.78);border:1px solid rgba(76,119,153,.09)}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-row span{color:#7a8c9d!important;font-size:9.1px!important;line-height:1.3!important;letter-spacing:0!important;text-transform:none!important}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-row b{min-width:0;color:#325b7a;font-size:10.8px;line-height:1.3;text-align:right;overflow-wrap:anywhere}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-warning{grid-column:1/-1;display:grid;grid-template-columns:28px minmax(0,1fr);gap:9px;align-items:center;margin-top:3px;padding:10px 11px;border-radius:15px;background:linear-gradient(140deg,#fff6db,#fffaf0 62%,#f7f5ff);border:1px solid rgba(190,145,60,.14);box-shadow:inset 0 1px 0 rgba(255,255,255,.96)}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-warning-icon{width:28px;height:28px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(145deg,#f3d278,#dca94f);color:#fff;font-size:15px;font-weight:900;box-shadow:0 6px 14px rgba(151,111,38,.14),inset 0 1px 0 rgba(255,255,255,.35)}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-warning strong{display:block;color:#684c1f;font-size:10.7px;line-height:1.28;font-weight:850}
      #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-warning p{margin:3px 0 0;color:#806f54;font-size:9.5px;line-height:1.42}

      @media(max-width:360px){
        #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-feature-grid,#bearagnosticProOverlay .ba-pro-feature-grid.ba-r90-overlay-grid{gap:8px!important}
        #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-feature-card{padding:12px 11px 13px!important}
        #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-feature-card strong{font-size:12.7px!important}
        #baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-feature-card p{font-size:9.9px!important}
        #bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner,#baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r90-pro-owner{grid-template-columns:46px minmax(0,1fr)!important;padding:13px!important;column-gap:10px!important}
        #bearagnosticProOverlay .ba-pro-purchase.ba-r90-pro-owner::before,#baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-pro-purchase.ba-r90-pro-owner::before{width:46px!important;height:46px!important;border-radius:15px!important;font-size:27px!important}
        #permissionSheet .ba-r90-permission-trust{grid-template-columns:42px minmax(0,1fr);padding:12px;gap:10px}
        #permissionSheet .ba-r90-trust-icon{width:42px;height:42px;border-radius:14px}
        #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-card{grid-template-columns:43px minmax(0,1fr);padding:12px;gap:10px}
        #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-icon{width:43px;height:43px;border-radius:14px}
        #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-row{grid-template-columns:1fr;gap:3px}
        #baUnifiedSettingsDetail[data-detail-kind="about"] .ba-r90-auth-row b{text-align:left}
      }
      @media(max-width:319px){#baUnifiedSettingsDetail[data-detail-kind="pro"] .ba-r90-feature-grid,#bearagnosticProOverlay .ba-pro-feature-grid.ba-r90-overlay-grid{grid-template-columns:1fr!important}}
      @media(prefers-reduced-motion:reduce){#permissionSheet .ba-r90-permission-trust,#baUnifiedSettingsDetail .ba-r90-auth-card{scroll-behavior:auto!important}}
    `;
    document.head.appendChild(style);
  }

  function rewriteStaleProCard(card) {
    const t = copy();
    const strong = card.querySelector(':scope > strong');
    const small = card.querySelector(':scope > small');
    if (strong) strong.textContent = t.ownerTitle;
    if (small) small.innerHTML = `${esc(t.ownerBody)}<span class="ba-r90-owner-meta">${esc(t.ownerMeta)}</span>`;
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
    const looksLikeOwnerCopy = strong.textContent.trim() === t.ownerTitle ||
      (text.includes('Ko-fi') && (text.includes('249') || text.includes('ซื้อครั้งเดียว') || text.includes('買い切り')));
    if (!looksLikeOwnerCopy) return;
    if (!small.querySelector('.ba-r90-owner-meta')) {
      small.innerHTML = `${esc(t.ownerBody)}<span class="ba-r90-owner-meta">${esc(t.ownerMeta)}</span>`;
    }
    const placeholder = card.querySelector(':scope > .ba-pro-primary[disabled]');
    if (placeholder && !placeholder.dataset.k3Action && !/^PRO(?:\s|$)/i.test(String(placeholder.textContent || '').trim())) placeholder.remove();
  }

  function polishProPurchase() {
    const roots = [byId('bearagnosticProOverlay'), document.querySelector('#baUnifiedSettingsDetail[data-detail-kind="pro"]')].filter(Boolean);
    roots.forEach((root) => {
      const cards = $$('.ba-pro-purchase', root);
      const stale = cards.filter((card) => staleGoogleCopy(card.textContent));
      const clean = cards.filter((card) => !staleGoogleCopy(card.textContent));
      if (clean.length) stale.forEach((card) => card.remove());
      else stale.forEach(rewriteStaleProCard);
      $$('.ba-pro-purchase', root).forEach((card) => {
        card.classList.remove('ba-r89-pro-owner');
        card.classList.add('ba-r90-pro-owner');
        splitStaticOwnerCopy(card);
      });
    });
  }

  function featureAttributes(key) {
    if (key === 'media') return ' data-b45-feature="media"';
    if (key === 'insights') return ' data-b45-feature="insights" data-b42-insights="1"';
    if (key === 'cleanup') return ' data-b45-feature="cleanup-history"';
    return '';
  }

  function detailFeatureGridMarkup() {
    const t = copy();
    return `<div class="ba-r90-feature-grid" data-r90-feature-grid="${language()}">` +
      t.features.map(([key,title,body]) => `<article class="ba-r90-feature-card" data-r90-feature="${esc(key)}"><span class="ba-r90-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${FEATURE_ICONS[key]}</svg></span><strong>${esc(title)}</strong><p>${esc(body)}</p></article>`).join('') +
      `</div>`;
  }

  function overlayFeatureGridMarkup() {
    const t = copy();
    return t.features.map(([key,title,body]) => `<article class="ba-pro-feature ba-r90-overlay-feature" data-r90-feature="${esc(key)}"${featureAttributes(key)}><span class="ba-pro-feature__icon" aria-hidden="true"><svg viewBox="0 0 24 24">${FEATURE_ICONS[key]}</svg></span><strong>${esc(title)}</strong><small>${esc(body)}</small></article>`).join('');
  }

  function normalizeProCatalogue() {
    const t = copy();

    const overlay = byId('bearagnosticProOverlay');
    const overlayGrid = overlay?.querySelector('.ba-pro-feature-grid');
    if (overlayGrid) {
      overlayGrid.classList.add('ba-r90-overlay-grid');
      const signature = language();
      if (overlayGrid.dataset.r90FeatureGrid !== signature || overlayGrid.querySelectorAll(':scope > .ba-r90-overlay-feature').length !== t.features.length || overlayGrid.children.length !== t.features.length) {
        overlayGrid.innerHTML = overlayFeatureGridMarkup();
        overlayGrid.dataset.r90FeatureGrid = signature;
      }
      const heading = overlayGrid.closest('.ba-pro-section')?.querySelector('.ba-pro-section-head strong');
      if (heading && heading.textContent !== t.available) heading.textContent = t.available;
    }

    const detail = document.querySelector('#baUnifiedSettingsDetail[data-detail-kind="pro"]');
    if (!detail || detail.hidden) return;
    const group = detail.querySelector('.ba-pro-feature-group');
    if (!group) return;
    const heading = group.querySelector(':scope > h3');
    if (heading && heading.textContent !== t.available) heading.textContent = t.available;
    const signature = language();
    const existing = group.querySelector(':scope > .ba-r90-feature-grid');
    if (existing?.dataset.r90FeatureGrid === signature && existing.children.length === t.features.length && group.children.length === 2) return;
    Array.from(group.children).filter((node) => node !== heading).forEach((node) => node.remove());
    group.insertAdjacentHTML('beforeend', detailFeatureGridMarkup());
  }

  function lifetimeMarkup(tag = 'div') {
    const t = copy();
    return `<span class="ba-r90-value-badge">${esc(t.valueBadge)}</span><strong>${esc(t.valueTitle)}</strong><p>${esc(t.valueBody)}</p>`;
  }

  function polishLifetimeValue() {
    const t = copy();
    const overlayModel = byId('bearagnosticProOverlay')?.querySelector('.ba-pro-model');
    if (overlayModel) {
      overlayModel.classList.add('ba-r90-lifetime-value');
      const signature = language();
      if (overlayModel.dataset.r90Lifetime !== signature) {
        overlayModel.innerHTML = lifetimeMarkup();
        overlayModel.dataset.r90Lifetime = signature;
      }
    }

    const detail = document.querySelector('#baUnifiedSettingsDetail[data-detail-kind="pro"]');
    if (!detail || detail.hidden) return;
    const candidates = $$('.ba-trust-group .ba-detail-section', detail);
    const ownership = candidates.find((section) => {
      const title = String(section.querySelector('strong')?.textContent || '').toLowerCase();
      const body = String(section.querySelector('p')?.textContent || '').toLowerCase();
      return title.includes('ownership') || title.includes('ซื้อครั้งเดียว') || title.includes('所有') || title.includes('買い切り') || body.includes('no subscription') || body.includes('ไม่มีรายเดือน') || body.includes('サブスクなし');
    });
    if (!ownership) return;
    ownership.classList.add('ba-r90-lifetime-value');
    const signature = language();
    if (ownership.dataset.r90Lifetime !== signature) {
      ownership.innerHTML = lifetimeMarkup();
      ownership.dataset.r90Lifetime = signature;
    }
  }

  function permissionMarkup() {
    const t = copy();
    return `<section class="ba-r90-permission-trust" id="baR90PermissionTrust" aria-label="${esc(t.permissionTitle)}"><span class="ba-r90-trust-icon">${SHIELD_ICON}</span><div class="ba-r90-permission-copy"><strong>${esc(t.permissionTitle)}</strong><p>${esc(t.permissionIntro)}</p></div><div class="ba-r90-permission-points">${t.permissionPoints.map((point) => `<div class="ba-r90-permission-point">${esc(point)}</div>`).join('')}</div></section>`;
  }

  function ensurePermissionTrust() {
    const sheet = byId('permissionSheet');
    const grant = byId('grantStorage');
    if (!sheet || !grant) return;
    byId('baR89PermissionTrust')?.remove();
    const existing = byId('baR90PermissionTrust');
    if (existing) existing.outerHTML = permissionMarkup();
    else grant.insertAdjacentHTML('beforebegin', permissionMarkup());
  }

  function authenticityMarkup() {
    const t = copy();
    return `<section class="ba-r90-auth-card" id="baR90AuthenticityCard" aria-label="${esc(t.authenticityTitle)}"><span class="ba-r90-auth-icon">${VERIFIED_ICON}</span><div class="ba-r90-auth-copy"><strong>${esc(t.authenticityTitle)}</strong><p>${esc(t.authenticityIntro)}</p></div><div class="ba-r90-auth-rows"><div class="ba-r90-auth-row"><span>${esc(t.officialLabel)}</span><b>${esc(t.officialValue)}</b></div><div class="ba-r90-auth-row"><span>${esc(t.authorizedLabel)}</span><b>${esc(t.authorizedValue)}</b></div></div><div class="ba-r90-auth-warning"><span class="ba-r90-auth-warning-icon" aria-hidden="true">✓</span><div><strong>${esc(t.warningTitle)}</strong><p>${esc(t.warningBody)}</p></div></div></section>`;
  }

  function ensureAuthenticityCard() {
    const detail = document.querySelector('#baUnifiedSettingsDetail[data-detail-kind="about"]');
    if (!detail || detail.hidden) return;
    const scroll = byId('baUnifiedDetailScroll');
    if (!scroll) return;
    byId('baR89AuthenticityCard')?.remove();
    const existing = byId('baR90AuthenticityCard');
    if (existing) existing.outerHTML = authenticityMarkup();
    else {
      const principle = scroll.querySelector('.ba-detail-about-principle,.ba-detail-principle');
      if (principle) principle.insertAdjacentHTML('afterend', authenticityMarkup());
      else scroll.insertAdjacentHTML('afterbegin', authenticityMarkup());
    }
  }

  function scrubVisibleLegalGoogleCopy() {
    const t = copy();
    [document.querySelector('#baUnifiedSettingsDetail[data-detail-kind="legal"]'), byId('baLegalOverlay')].filter(Boolean).forEach((root) => {
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
      polishProPurchase();
      normalizeProCatalogue();
      polishLifetimeValue();
      ensureAuthenticityCard();
      scrubVisibleLegalGoogleCopy();
    });
  }

  function initialize() {
    ensureStyle();
    ensurePermissionTrust();
    scheduleRefresh();

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
    document.addEventListener('click', (event) => {
      if (event.target?.closest?.('[data-k3-action]')) {
        scheduleRefresh(120);
        scheduleRefresh(340);
        scheduleRefresh(820);
      }
    }, true);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) scheduleRefresh(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();

  window.BearagnosticReleaseTrust = Object.freeze({build:BUILD, refresh:scheduleRefresh});
})();
