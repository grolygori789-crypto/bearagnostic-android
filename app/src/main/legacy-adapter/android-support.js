(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const KOFI_URL = 'https://ko-fi.com/benedictinteractive';
  const toast = (message) => window.BearagnosticAppAPI?.showToast?.(message);

  const COPY = {
    en: {
      rowTitle: 'Support Bearagnostic',
      rowSub: 'Support independent development via Ko-fi',
      openFailed: 'No compatible browser was available for this link.',
      close: 'Close',
      eyebrow: 'INDEPENDENTLY BUILT · WITH CARE',
      title: 'If Bearagnostic makes things a little lighter, you can help us keep making it better.',
      lead: 'Bearagnostic is built independently, with a lot of care for the little things that make software useful, trustworthy, and pleasant to live with. If it has earned a place on your phone, support at any level gives us more room to keep refining it — thoughtfully, independently, and one good release at a time.',
      note: 'Give what feels right. There is no pressure, and no feature is held back for supporters.',
      provider: 'Ko-fi · Benedict Interactive',
      providerBody: 'Ko-fi opens securely in your browser. Payment and account details are handled there, outside Bearagnostic.',
      cta: 'Support on Ko-fi',
      boundary: 'Support is completely separate from Free and Pro. It never changes scan quality, safety, or your existing access.',
      optional: 'Completely optional. Always appreciated.'
    },
    th: {
      rowTitle: 'สนับสนุน Bearagnostic',
      rowSub: 'ร่วมสนับสนุนการพัฒนาอย่างอิสระผ่าน Ko-fi',
      openFailed: 'ไม่พบเบราว์เซอร์ที่รองรับสำหรับเปิดลิงก์นี้',
      close: 'ปิด',
      eyebrow: 'สร้างอย่างอิสระ · ใส่ใจทุกดีเทล',
      title: 'ถ้า Bearagnostic ช่วยให้ชีวิตดิจิทัลของคุณเบาลงอีกนิด คุณก็ช่วยให้เราพามันไปได้ไกลขึ้นอีกหน่อย',
      lead: 'Bearagnostic ถูกพัฒนาขึ้นอย่างอิสระ ด้วยความตั้งใจในรายละเอียดเล็กๆ ที่ทำให้ซอฟต์แวร์หนึ่งตัวน่าใช้ น่าไว้วางใจ และอยู่กับเราได้อย่างสบายใจ ถ้ามันมีประโยชน์กับคุณ การสนับสนุนตามกำลังจะช่วยให้เรามีพื้นที่ดูแล ขัดเกลา และพามันไปสู่เวอร์ชันถัดไปอย่างที่ควรเป็น',
      note: 'สนับสนุนเท่าที่รู้สึกสบายใจ ไม่มีแรงกดดัน และไม่มีฟีเจอร์ใดถูกกั๊กไว้เพื่อแลกกับการสนับสนุน',
      provider: 'Ko-fi · Benedict Interactive',
      providerBody: 'ระบบจะเปิด Ko-fi อย่างปลอดภัยในเบราว์เซอร์ การชำระเงินและข้อมูลบัญชีดำเนินการบน Ko-fi โดยตรง ไม่ได้อยู่ใน Bearagnostic',
      cta: 'สนับสนุนผ่าน Ko-fi',
      boundary: 'การสนับสนุนแยกจาก Free และ Pro โดยสิ้นเชิง ไม่มีผลต่อคุณภาพการตรวจ ความปลอดภัย หรือสิทธิ์ที่คุณมีอยู่',
      optional: 'ไม่จำเป็นเลย แต่เราขอบคุณจากใจเสมอ'
    },
    ja: {
      rowTitle: 'Bearagnostic を支援',
      rowSub: 'Ko-fi から独立開発を応援',
      openFailed: 'このリンクを開けるブラウザが見つかりませんでした。',
      close: '閉じる',
      eyebrow: '独立開発 · 細部まで丁寧に',
      title: 'Bearagnostic が少しでも毎日を軽くできたなら、その先の改善を支えていただけます。',
      lead: 'Bearagnostic は、使いやすさと信頼につながる小さなディテールを大切にしながら、独立して開発しています。役に立ったと感じたときだけ、無理のない範囲でのサポートが、丁寧な改善と次のリリースに取り組む余力につながります。',
      note: '支援は無理のない範囲で。支援の有無によって機能を制限することはありません。',
      provider: 'Ko-fi · Benedict Interactive',
      providerBody: 'Ko-fi はブラウザで安全に開きます。支払い・アカウント情報は Ko-fi 側で扱われ、Bearagnostic には送られません。',
      cta: 'Ko-fi で支援',
      boundary: '支援は Free / Pro とは完全に別です。解析品質、安全性、現在の利用権には影響しません。',
      optional: '完全に任意です。いつも感謝しています。'
    }
  };

  let overlay = null;
  let previousFocus = null;

  function parse(value) {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || {}); }
    catch (_) { return {}; }
  }

  function lang() {
    const v = (document.documentElement.lang || 'en').toLowerCase();
    return v.startsWith('th') ? 'th' : v.startsWith('ja') ? 'ja' : 'en';
  }

  function c() { return COPY[lang()] || COPY.en; }

  function openExternal(url) {
    const result = parse(NATIVE.openExternalUrl(url));
    if (!result.accepted) toast(c().openFailed);
  }

  function addStyles() {
    if (document.getElementById('baPremiumSupportStyles')) return;
    const style = document.createElement('style');
    style.id = 'baPremiumSupportStyles';
    style.textContent = `
      .ba-support-overlay{position:fixed;inset:0;z-index:1720;display:grid;align-items:end;padding:14px 14px calc(14px + env(safe-area-inset-bottom,0px));background:rgba(12,25,42,.34);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);opacity:0;pointer-events:none;transition:opacity .22s ease}
      .ba-support-overlay.is-open{opacity:1;pointer-events:auto}
      .ba-support-sheet{position:relative;isolation:isolate;width:min(100%,540px);max-height:min(90dvh,790px);margin:0 auto;overflow:auto;overscroll-behavior:contain;padding:10px 18px 18px;border-radius:30px;background:linear-gradient(180deg,rgba(255,255,255,.995) 0%,rgba(249,252,255,.995) 68%,rgba(247,250,252,.995) 100%);border:1px solid rgba(255,255,255,.96);box-shadow:0 30px 80px rgba(15,39,65,.26),inset 0 1px 0 rgba(255,255,255,1);transform:translateY(16px) scale(.988);transition:transform .26s cubic-bezier(.2,.82,.2,1)}
      .ba-support-overlay.is-open .ba-support-sheet{transform:translateY(0) scale(1)}
      .ba-support-sheet::before{content:"";position:absolute;z-index:-1;right:-70px;top:-95px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(206,174,112,.18),rgba(77,173,232,.06) 45%,transparent 70%);pointer-events:none}
      .ba-support-handle{width:42px;height:4px;margin:1px auto 14px;border-radius:99px;background:linear-gradient(90deg,#dce4eb,#cbd6e0,#dce4eb)}
      .ba-support-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
      .ba-support-eyebrow{margin:0 0 7px;font-size:9px;line-height:1.2;font-weight:820;letter-spacing:.18em;text-transform:uppercase;color:#9a7942}
      .ba-support-head h2{margin:0;max-width:14.5ch;font-family:"Iowan Old Style",Baskerville,"Palatino Linotype","Book Antiqua",Georgia,serif;font-size:clamp(25px,7vw,33px);line-height:1.04;letter-spacing:-.035em;font-weight:500;color:#122a43;text-wrap:balance}
      .ba-support-close{flex:0 0 auto;width:40px;height:40px;border:0;border-radius:50%;display:grid;place-items:center;background:rgba(232,241,248,.88);color:#506980;font-size:23px;line-height:1}
      .ba-support-lead{margin:16px 0 0;max-width:46em;font-size:12.5px;line-height:1.62;color:#6f8091}
      .ba-support-note{position:relative;margin:14px 0 0;padding:13px 14px 13px 38px;border-radius:17px;background:linear-gradient(135deg,#fffaf0,#fbfdff 64%);border:1px solid rgba(185,145,75,.14);color:#6f6352;font-size:11px;line-height:1.5}
      .ba-support-note::before{content:"✦";position:absolute;left:15px;top:12px;color:#b68b45;font-size:14px}
      .ba-support-provider{margin-top:15px;padding:15px 16px;border-radius:19px;background:linear-gradient(145deg,#fbfdff,#f1f8fc);border:1px solid rgba(47,136,197,.12);box-shadow:0 9px 24px rgba(53,83,114,.05)}
      .ba-support-provider strong{display:block;font-size:14px;color:#213b55}
      .ba-support-provider p{margin:5px 0 0;font-size:11px;line-height:1.52;color:#7a8998}
      .ba-support-primary{width:100%;min-height:52px;margin-top:14px;border:0;border-radius:17px;color:#fff;background:linear-gradient(120deg,#258fd8,#176fb7);box-shadow:0 11px 24px rgba(24,112,183,.20);font-size:13px;font-weight:780}
      .ba-support-primary:active{transform:scale(.992)}
      .ba-support-boundary{margin:12px 2px 0;font-size:9.8px;line-height:1.48;text-align:center;color:#97a3af}
      .ba-support-signoff{margin:9px 0 0;text-align:center;font-size:11px;font-weight:720;letter-spacing:.01em;color:#61788e}
      #kofiSupportRow .soft-icon{background:linear-gradient(145deg,#fff9ee,#eef9fb)!important;color:#a57c3f!important}
      #kofiSupportRow .soft-icon::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1px rgba(183,145,76,.08);pointer-events:none}
      #kofiSupportRow{--tone:181,143,73!important;background:linear-gradient(112deg,#fff 34%,rgba(202,169,104,.085) 78%,rgba(69,174,203,.052) 100%)!important;border-color:rgba(181,143,73,.115)!important;box-shadow:0 10px 26px rgba(95,79,52,.065),inset 0 1px 0 #fff!important}
      #kofiSupportRow:after{background:radial-gradient(circle,rgba(200,168,104,.12),transparent 68%)!important}
      #kofiSupportRow b{color:#9c7a42!important}
      #kofiSupportRow small{color:#7c8998!important}
      #kofiSupportRow:active{transform:translateY(1px) scale(.994)}
      @media (prefers-reduced-motion:reduce){.ba-support-overlay,.ba-support-sheet{transition:none!important}}
      html[data-motion="reduced"] .ba-support-overlay,html[data-motion="reduced"] .ba-support-sheet{transition:none!important}
    `;
    document.head.appendChild(style);
  }

  function ensureOverlay() {
    if (overlay) return overlay;
    addStyles();
    overlay = document.createElement('div');
    overlay.id = 'androidPremiumSupportOverlay';
    overlay.className = 'ba-support-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeOverlay();
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  function openOverlay() {
    if (!overlay?.classList.contains('is-open')) {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    ensureOverlay();
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => overlay.querySelector('.ba-support-close')?.focus());
  }

  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    previousFocus?.focus?.();
    previousFocus = null;
  }

  function renderSupport() {
    const t = c();
    ensureOverlay();
    overlay.innerHTML = `
      <section class="ba-support-sheet" role="dialog" aria-modal="true" aria-labelledby="baSupportTitle">
        <div class="ba-support-handle" aria-hidden="true"></div>
        <div class="ba-support-head">
          <div>
            <div class="ba-support-eyebrow">${t.eyebrow}</div>
            <h2 id="baSupportTitle">${t.title}</h2>
          </div>
          <button class="ba-support-close" type="button" data-ba-support-close aria-label="${t.close}">×</button>
        </div>
        <p class="ba-support-lead">${t.lead}</p>
        <div class="ba-support-note">${t.note}</div>
        <div class="ba-support-provider"><strong>${t.provider}</strong><p>${t.providerBody}</p></div>
        <button class="ba-support-primary" type="button" data-ba-open-kofi>${t.cta} <span aria-hidden="true">↗</span></button>
        <p class="ba-support-boundary">${t.boundary}</p>
        <p class="ba-support-signoff">${t.optional}</p>
      </section>`;
    overlay.querySelector('[data-ba-support-close]')?.addEventListener('click', closeOverlay);
    overlay.querySelector('[data-ba-open-kofi]')?.addEventListener('click', () => openExternal(KOFI_URL));
    openOverlay();
  }

  function supportRowMarkup() {
    return `<span class="soft-icon amber" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/><path d="M17.5 4.2v3.2M15.9 5.8h3.2"/></svg></span><span><strong id="kofiSupportTitle"></strong><small id="kofiSupportSub"></small></span><b>›</b>`;
  }

  function ensureSupportRow() {
    const list = document.querySelector('#moreScreen .settings-list');
    if (!list) return null;

    let row = document.getElementById('kofiSupportRow');
    if (!row) {
      row = document.createElement('button');
      row.className = 'setting-link ba-kofi-support-row';
      row.id = 'kofiSupportRow';
      row.type = 'button';
      row.innerHTML = supportRowMarkup();

      // The legacy #supportProjectRow is intentionally owned by Bearagnostic Pro
      // on Android. Keep voluntary support as a separate sibling so entitlement
      // interception can never steal this action.
      const proRow = document.getElementById('supportProjectRow');
      const aboutRow = list.querySelector('[data-open="about"]');
      if (proRow?.parentElement === list) proRow.insertAdjacentElement('afterend', row);
      else if (aboutRow?.parentElement === list) list.insertBefore(row, aboutRow);
      else list.appendChild(row);
    }

    localizeRow();
    return row;
  }

  function localizeRow() {
    const t = c();
    const title = document.getElementById('kofiSupportTitle');
    const sub = document.getElementById('kofiSupportSub');
    if (title) title.textContent = t.rowTitle;
    if (sub) sub.textContent = t.rowSub;
  }

  // Ko-fi support owns a dedicated row. Never reuse #supportProjectRow: Android
  // entitlement intentionally repurposes that legacy element for Bearagnostic Pro.
  document.addEventListener('click', (event) => {
    const target = event.target?.closest?.('#kofiSupportRow,#openKofi');
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (target.id === 'openKofi') openExternal(KOFI_URL);
    else renderSupport();
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay?.classList.contains('is-open')) closeOverlay();
  });

  const langObserver = new MutationObserver(() => {
    ensureSupportRow();
    if (overlay?.classList.contains('is-open')) renderSupport();
  });
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  window.BearagnosticSupport = Object.freeze({
    open: renderSupport,
    openKofi: () => openExternal(KOFI_URL)
  });

  addStyles();
  ensureSupportRow();
  // Pro UI runs after this adapter in the Android overlay order. Re-assert the
  // independent sibling once the current script turn completes, without polling.
  setTimeout(ensureSupportRow, 0);
})();
