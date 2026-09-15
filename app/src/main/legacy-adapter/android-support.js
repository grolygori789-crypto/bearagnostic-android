(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const KOFI_URL = 'https://ko-fi.com/benedictinteractive';
  const toast = (message) => window.BearagnosticAppAPI?.showToast?.(message);

  const KOFI_ICON = '<path class="ba-kofi-cup" d="M5.2 8.4h10.7v4.8a5 5 0 0 1-5 5h-.7a5 5 0 0 1-5-5Z"/><path class="ba-kofi-cup" d="M15.9 10h1.55a2.45 2.45 0 0 1 0 4.9H15.9"/><path class="ba-kofi-heart" d="M8.45 11.65c.68-.93 2.1-.72 2.55.28.45-1 1.87-1.21 2.55-.28.88 1.2-.24 2.55-2.55 3.98-2.31-1.43-3.43-2.78-2.55-3.98Z"/>';
  const SPARK_ICON = '<path d="M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21M5.7 5.7l2.3 2.3M16 16l2.3 2.3M18.3 5.7 16 8M8 16l-2.3 2.3"/><circle cx="12" cy="12" r="2.65"/>';

  const COPY = {
  "en": {
    "rowTitle": "Support Bearagnostic",
    "rowSub": "Independent support via Ko-fi",
    "openFailed": "No compatible browser was available for this link.",
    "close": "Close",
    "kicker": "SUPPORT BEARAGNOSTIC",
    "title": "Keep Bearagnostic moving forward.",
    "lead": "Bearagnostic is built independently and refined with care.",
    "panelTitle": "Built slowly. Maintained thoughtfully.",
    "panelBody": "If Bearagnostic has earned a place on your phone, support at any level gives us more room to maintain it, improve it and keep each release careful, useful and independent.",
    "provider": "Ko-fi · Benedict Interactive",
    "providerBody": "Ko-fi opens securely in your browser. Payment and account details stay with Ko-fi, outside Bearagnostic.",
    "cta": "Support on Ko-fi",
    "boundary": "Completely optional and separate from Free and Pro. Support never changes scan quality, safety or your existing access.",
    "signoff": "Thank you for helping independent software stay independent."
  },
  "th": {
    "rowTitle": "สนับสนุน Bearagnostic",
    "rowSub": "สนับสนุนการพัฒนาอิสระผ่าน Ko-fi",
    "openFailed": "ไม่พบเบราว์เซอร์ที่รองรับสำหรับเปิดลิงก์นี้",
    "close": "ปิด",
    "kicker": "สนับสนุน BEARAGNOSTIC",
    "title": "ช่วยให้ Bearagnostic เดินหน้าต่อไป",
    "lead": "Bearagnostic ถูกพัฒนาขึ้นอย่างอิสระ และขัดเกลาทุกรายละเอียดด้วยความตั้งใจ",
    "panelTitle": "ค่อยๆ สร้าง ค่อยๆ ดูแล ให้ดีขึ้นทุกเวอร์ชัน",
    "panelBody": "ถ้ามันเป็นแอปที่คุณอยากเก็บไว้บนเครื่อง การสนับสนุนตามกำลังจะช่วยให้เรามีพื้นที่ดูแล พัฒนา และพาแต่ละเวอร์ชันไปข้างหน้าอย่างรอบคอบ มีประโยชน์ และยังคงความเป็นอิสระของโปรเจกต์เอาไว้",
    "provider": "Ko-fi · Benedict Interactive",
    "providerBody": "ระบบจะเปิด Ko-fi ในเบราว์เซอร์อย่างปลอดภัย การชำระเงินและข้อมูลบัญชีดำเนินการโดย Ko-fi โดยตรง ไม่ได้อยู่ใน Bearagnostic",
    "cta": "สนับสนุนผ่าน Ko-fi",
    "boundary": "เป็นทางเลือกโดยสมบูรณ์และแยกจาก Free กับ Pro การสนับสนุนไม่มีผลต่อคุณภาพการตรวจ ความปลอดภัย หรือสิทธิ์ที่คุณมีอยู่",
    "signoff": "ขอบคุณที่ช่วยให้งานอิสระยังคงเดินหน้าต่อได้อย่างอิสระ"
  },
  "ja": {
    "rowTitle": "Bearagnostic を支援",
    "rowSub": "Ko-fi から独立開発を応援",
    "openFailed": "このリンクを開けるブラウザが見つかりませんでした。",
    "close": "閉じる",
    "kicker": "BEARAGNOSTIC を支援",
    "title": "Bearagnostic の次の一歩を支える",
    "lead": "Bearagnostic は独立して開発し、細かな部分まで丁寧に磨き続けています。",
    "panelTitle": "丁寧につくり、丁寧に育てる。",
    "panelBody": "このアプリを手元に置いておきたいと感じたときだけ、無理のない範囲での支援が、保守・改善・次のリリースを落ち着いて進める余力につながります。",
    "provider": "Ko-fi · Benedict Interactive",
    "providerBody": "Ko-fi はブラウザで安全に開きます。支払い・アカウント情報は Ko-fi 側で扱われ、Bearagnostic には送られません。",
    "cta": "Ko-fi で支援",
    "boundary": "支援は完全に任意で、Free / Pro とは別です。解析品質、安全性、現在の利用権には影響しません。",
    "signoff": "独立したソフトウェアづくりを支えていただき、ありがとうございます。"
  },
  "es": {
    "rowTitle": "Apoyar Bearagnostic",
    "rowSub": "Apoyo independiente mediante Ko-fi",
    "openFailed": "No había ningún navegador compatible disponible para este enlace.",
    "close": "Cerrar",
    "kicker": "APOYAR BEARAGNOSTIC",
    "title": "Ayuda a que Bearagnostic siga avanzando.",
    "lead": "Bearagnostic se desarrolla de forma independiente y se perfecciona con cuidado.",
    "panelTitle": "Creado sin prisas. Mantenido con cuidado.",
    "panelBody": "Si Bearagnostic se ha ganado un lugar en tu teléfono, cualquier nivel de apoyo nos da más margen para mantenerlo, mejorarlo y conservar cada versión cuidadosa, útil e independiente.",
    "provider": "Ko-fi · Benedict Interactive",
    "providerBody": "Ko-fi se abre de forma segura en tu navegador. Los datos de pago y de la cuenta permanecen en Ko-fi, fuera de Bearagnostic.",
    "cta": "Apoyar en Ko-fi",
    "boundary": "Totalmente opcional y separado de Free y Pro. El apoyo nunca cambia la calidad del análisis, la seguridad ni tu acceso actual.",
    "signoff": "Gracias por ayudar a que el software independiente siga siendo independiente."
  },
  "pt-BR": {
    "rowTitle": "Apoiar o Bearagnostic",
    "rowSub": "Apoio independente via Ko-fi",
    "openFailed": "Nenhum navegador compatível estava disponível para este link.",
    "close": "Fechar",
    "kicker": "APOIAR O BEARAGNOSTIC",
    "title": "Ajude o Bearagnostic a continuar evoluindo.",
    "lead": "O Bearagnostic é desenvolvido de forma independente e refinado com cuidado.",
    "panelTitle": "Criado sem pressa. Mantido com cuidado.",
    "panelBody": "Se o Bearagnostic conquistou um lugar no seu celular, apoio em qualquer nível nos dá mais espaço para mantê-lo, melhorá-lo e manter cada versão cuidadosa, útil e independente.",
    "provider": "Ko-fi · Benedict Interactive",
    "providerBody": "O Ko-fi abre com segurança no seu navegador. Dados de pagamento e da conta permanecem no Ko-fi, fora do Bearagnostic.",
    "cta": "Apoiar no Ko-fi",
    "boundary": "Totalmente opcional e separado do Free e do Pro. O apoio nunca altera a qualidade do scan, a segurança ou seu acesso atual.",
    "signoff": "Obrigado por ajudar o software independente a continuar independente."
  }
};

  let overlay = null;
  let previousFocus = null;

  function parse(value) {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || {}); }
    catch (_) { return {}; }
  }

  function lang() {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : value.startsWith('es') ? 'es' : (value === 'pt-br' || value.startsWith('pt-br') || value.startsWith('pt_')) ? 'pt-BR' : 'en';
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
      .ba-support-overlay{position:fixed;inset:0;z-index:2200;display:grid;align-items:end;padding:0 10px max(10px,env(safe-area-inset-bottom));background:rgba(14,25,44,.34);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);opacity:0;pointer-events:none;transition:opacity .18s ease;font-family:var(--ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif)}
      .ba-support-overlay.is-open{opacity:1;pointer-events:auto}
      .ba-support-panel{width:min(100%,540px);max-height:min(88dvh,790px);margin:0 auto;overflow:auto;overscroll-behavior:contain;border-radius:31px 31px 24px 24px;background:radial-gradient(circle at 88% 0%,rgba(40,188,233,.12),transparent 27%),radial-gradient(circle at 4% 18%,rgba(103,95,208,.06),transparent 24%),linear-gradient(180deg,#fdfefe,#f5f9fd);border:1px solid rgba(255,255,255,.98);box-shadow:0 -24px 70px rgba(24,48,78,.25),inset 0 1px 0 #fff;padding:11px 15px 16px;color:#172a40;transform:translateY(12px);transition:transform .22s cubic-bezier(.2,.8,.2,1)}
      .ba-support-overlay.is-open .ba-support-panel{transform:translateY(0)}
      .ba-support-handle{width:43px;height:4px;margin:0 auto 12px;border-radius:999px;background:linear-gradient(90deg,#dfe7ef,#c8d5e2,#dfe7ef)}
      .ba-support-head{display:grid;grid-template-columns:50px minmax(0,1fr) 36px;gap:10px;align-items:center}
      .ba-support-mark{position:relative;width:50px;height:50px;border-radius:17px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#39c2ee 0%,#28a7e4 52%,#2388d8 100%);box-shadow:0 12px 28px rgba(45,118,187,.21),inset 0 1px 0 rgba(255,255,255,.36);overflow:visible}
      .ba-support-mark::before{content:"";position:absolute;inset:1px 4px auto;height:46%;border-radius:15px 15px 50% 50%;background:linear-gradient(180deg,rgba(255,255,255,.30),rgba(255,255,255,0));pointer-events:none}
      .ba-support-mark svg{position:relative;z-index:1;width:27px;height:27px;filter:drop-shadow(0 1px 1px rgba(21,73,122,.18))}
      .ba-support-mark .ba-kofi-cup{fill:none;stroke:#fff;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}.ba-support-mark .ba-kofi-heart{fill:#ff5f73;stroke:#fff;stroke-width:.42;stroke-linejoin:round}
      .ba-support-kicker{display:block;font-size:8px;line-height:1.15;letter-spacing:.19em;color:#527f9d;font-weight:850;text-transform:uppercase}
      .ba-support-title{margin:4px 0 0;font-size:20px;line-height:1.1;letter-spacing:-.032em;font-weight:760;color:#172b43;text-wrap:balance}
      .ba-support-close{width:36px;height:36px;border:0;border-radius:13px;background:#edf3f8;color:#718294;font-size:19px;line-height:1;display:grid;place-items:center}
      .ba-support-lead{font-size:10.8px;line-height:1.52;color:#6e8091;margin:11px 2px 12px}
      .ba-support-surface{display:grid;grid-template-columns:58px minmax(0,1fr);gap:13px;align-items:start;padding:16px 15px 17px;border-radius:24px;background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(244,249,253,.92));border:1px solid rgba(141,167,191,.13);box-shadow:0 12px 28px rgba(56,89,122,.06),inset 0 1px 0 rgba(255,255,255,.98)}
      .ba-support-surface-icon{width:52px;height:52px;border-radius:18px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#34c8d6 0%,#1fbba4 52%,#1aa8b6 100%);box-shadow:0 11px 24px rgba(39,183,169,.18),inset 0 1px 0 rgba(255,255,255,.30)}
      .ba-support-surface-icon svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
      .ba-support-surface-copy strong{display:block;font-size:11.9px;line-height:1.3;color:#20364e}
      .ba-support-surface-copy p{margin:6px 0 0;font-size:10px;line-height:1.58;color:#6e8192}
      .ba-support-divider{height:1px;margin:14px 8px 10px;background:linear-gradient(90deg,rgba(188,202,214,0),rgba(188,202,214,.7),rgba(188,202,214,0))}
      .ba-support-action{width:100%;display:grid;grid-template-columns:46px minmax(0,1fr) 18px;gap:12px;align-items:center;padding:12px 6px 12px 4px;border:0;background:transparent;color:inherit;text-align:left}
      .ba-support-action:active{transform:translateY(1px)}
      .ba-support-action-icon{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#39c2ee,#2388d8);box-shadow:0 8px 20px rgba(33,132,203,.16),inset 0 1px 0 rgba(255,255,255,.30)}
      .ba-support-action-icon svg{width:23px;height:23px;filter:drop-shadow(0 1px 1px rgba(21,73,122,.16))}
      .ba-support-action-icon .ba-kofi-cup{fill:none;stroke:#fff;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}.ba-support-action-icon .ba-kofi-heart{fill:#ff5f73;stroke:#fff;stroke-width:.42;stroke-linejoin:round}
      .ba-support-action-copy{min-width:0}
      .ba-support-action-copy strong{display:block;font-size:11.6px;line-height:1.22;color:#213248}
      .ba-support-action-copy small{display:block;margin-top:4px;font-size:8.8px;line-height:1.42;color:#7a8d9d}
      .ba-support-action-chevron{justify-self:end;color:#9aaaba;font-size:18px;line-height:1}
      .ba-support-provider-note{margin:2px 4px 0 58px;font-size:8.6px;line-height:1.45;color:#7e8f9e}
      .ba-support-boundary{margin:12px 4px 0;font-size:8.4px;line-height:1.44;color:#8899a8}
      .ba-support-signoff{margin:8px 4px 0;font-size:9.2px;line-height:1.4;color:#526b82;font-weight:700}

      #kofiSupportRow{--tone:39,145,215!important;background:linear-gradient(112deg,#fff 34%,rgba(39,145,215,.105) 79%,rgba(103,95,208,.06) 100%)!important;border-color:rgba(39,145,215,.13)!important;box-shadow:0 11px 28px rgba(44,103,153,.085),inset 0 1px 0 #fff!important}
      #kofiSupportRow:after{background:radial-gradient(circle,rgba(39,145,215,.15),transparent 68%)!important}
      #kofiSupportRow .ba-support-row-icon{position:relative;overflow:visible;background:linear-gradient(145deg,#39c2ee 0%,#28a7e4 52%,#2388d8 100%)!important;color:#fff!important;box-shadow:0 10px 22px rgba(38,126,198,.20),inset 0 1px 0 rgba(255,255,255,.35)!important}
      #kofiSupportRow .ba-support-row-icon::before{content:"";position:absolute;inset:1px 3px auto;height:43%;border-radius:12px 12px 50% 50%;background:linear-gradient(180deg,rgba(255,255,255,.34),rgba(255,255,255,0));pointer-events:none}
      #kofiSupportRow .ba-support-row-icon svg{position:relative;z-index:1;width:23px;height:23px;filter:drop-shadow(0 1px 1px rgba(20,72,119,.18))}
      #kofiSupportRow .ba-support-row-icon .ba-kofi-cup{fill:none!important;stroke:#fff!important;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}#kofiSupportRow .ba-support-row-icon .ba-kofi-heart{fill:#ff5f73!important;stroke:#fff!important;stroke-width:.42;stroke-linejoin:round}
      #kofiSupportRow strong{color:#213248!important}
      #kofiSupportRow small{color:#6f8193!important}
      #kofiSupportRow>b{color:#4f86b5!important}
      #kofiSupportRow:active{transform:translateY(1px) scale(.994)}

      html[lang^="th"] .ba-support-kicker{letter-spacing:.055em}
      html[lang^="ja"] .ba-support-kicker{letter-spacing:.09em}
      html[lang^="th"] .ba-support-title,html[lang^="ja"] .ba-support-title{line-height:1.22;letter-spacing:-.018em}
      html[lang^="th"] .ba-support-lead,html[lang^="ja"] .ba-support-lead{line-height:1.58}
      @media(max-width:360px){.ba-support-panel{padding-left:12px;padding-right:12px}.ba-support-title{font-size:18px}.ba-support-lead{font-size:10.2px}.ba-support-surface{grid-template-columns:48px minmax(0,1fr);padding:14px}.ba-support-surface-icon{width:46px;height:46px;border-radius:16px}.ba-support-surface-copy p{font-size:9.4px}.ba-support-provider-note{margin-left:52px}}
      @media(max-height:690px){.ba-support-panel{max-height:92dvh}.ba-support-lead{margin:8px 2px 10px}.ba-support-surface{padding:14px 13px 15px}.ba-support-divider{margin-top:12px}.ba-support-action{padding-top:10px;padding-bottom:10px}.ba-support-boundary{margin-top:10px}}
      @media(prefers-reduced-motion:reduce){.ba-support-overlay,.ba-support-panel{transition:none!important}}
      html[data-motion="reduced"] .ba-support-overlay,html[data-motion="reduced"] .ba-support-panel{transition:none!important}
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
      <section class="ba-support-panel" role="dialog" aria-modal="true" aria-labelledby="baSupportTitle">
        <div class="ba-support-handle" aria-hidden="true"></div>
        <div class="ba-support-head">
          <div class="ba-support-mark" aria-hidden="true"><svg viewBox="0 0 24 24">${KOFI_ICON}</svg></div>
          <div>
            <span class="ba-support-kicker">${t.kicker}</span>
            <h2 class="ba-support-title" id="baSupportTitle">${t.title}</h2>
          </div>
          <button class="ba-support-close" type="button" data-ba-support-close aria-label="${t.close}">×</button>
        </div>
        <p class="ba-support-lead">${t.lead}</p>
        <section class="ba-support-surface" aria-label="${t.panelTitle}">
          <span class="ba-support-surface-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${SPARK_ICON}</svg></span>
          <div class="ba-support-surface-copy"><strong>${t.panelTitle}</strong><p>${t.panelBody}</p></div>
        </section>
        <div class="ba-support-divider" aria-hidden="true"></div>
        <button class="ba-support-action" type="button" data-ba-open-kofi>
          <span class="ba-support-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${KOFI_ICON}</svg></span>
          <span class="ba-support-action-copy"><strong>${t.cta}</strong><small>${t.provider}</small></span>
          <span class="ba-support-action-chevron" aria-hidden="true">›</span>
        </button>
        <p class="ba-support-provider-note">${t.providerBody}</p>
        <p class="ba-support-boundary">${t.boundary}</p>
        <p class="ba-support-signoff">${t.signoff}</p>
      </section>`;
    overlay.querySelector('[data-ba-support-close]')?.addEventListener('click', closeOverlay);
    overlay.querySelector('[data-ba-open-kofi]')?.addEventListener('click', () => openExternal(KOFI_URL));
    openOverlay();
  }

  function supportRowMarkup() {
    return `<span class="soft-icon ba-support-row-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${KOFI_ICON}</svg></span><span><strong id="kofiSupportTitle"></strong><small id="kofiSupportSub"></small></span><b>›</b>`;
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
  setTimeout(ensureSupportRow, 0);
})();
