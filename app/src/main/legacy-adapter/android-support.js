(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const KOFI_URL = 'https://ko-fi.com/benedictinteractive';
  const toast = (message) => window.BearagnosticAppAPI?.showToast?.(message);

  const ICON = '<path d="M5 8.5h11v4.7a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5Z"/><path d="M16 10h1.6a2.5 2.5 0 0 1 0 5H16"/><path d="M8.5 11.7c.7-.9 2.1-.55 2.5.35.4-.9 1.8-1.25 2.5-.35.8 1.05-.25 2.35-2.5 3.7-2.25-1.35-3.3-2.65-2.5-3.7Z"/>';

  const COPY = {
    en: {
      rowTitle: 'Support Bearagnostic',
      rowSub: 'Independent support via Ko-fi',
      openFailed: 'No compatible browser was available for this link.',
      close: 'Close',
      kicker: 'SUPPORT BEARAGNOSTIC',
      title: 'Keep Bearagnostic moving forward.',
      lead: 'Bearagnostic is built independently and refined with care. If it has earned a place on your phone, support at any level gives us more room to maintain it, improve it and keep each release thoughtful.',
      storyTitle: 'A little support goes a long way.',
      storyBody: 'Give whatever feels right. Every contribution helps create the time and space to polish the details, solve the next problem well and keep the project growing on its own terms.',
      provider: 'Ko-fi · Benedict Interactive',
      providerBody: 'Opens securely in your browser. Payment and account details are handled by Ko-fi, outside Bearagnostic.',
      cta: 'Support on Ko-fi',
      boundary: 'Completely optional and separate from Free and Pro. Support never changes scan quality, safety or your existing access.',
      signoff: 'Thank you for helping independent software stay independent.'
    },
    th: {
      rowTitle: 'สนับสนุน Bearagnostic',
      rowSub: 'สนับสนุนการพัฒนาอิสระผ่าน Ko-fi',
      openFailed: 'ไม่พบเบราว์เซอร์ที่รองรับสำหรับเปิดลิงก์นี้',
      close: 'ปิด',
      kicker: 'สนับสนุน BEARAGNOSTIC',
      title: 'ช่วยให้ Bearagnostic เดินหน้าต่อไป',
      lead: 'Bearagnostic ถูกพัฒนาขึ้นอย่างอิสระ และขัดเกลาทุกรายละเอียดด้วยความตั้งใจ ถ้ามันเป็นแอปที่คุณอยากเก็บไว้บนเครื่อง การสนับสนุนตามกำลังจะช่วยให้เรามีพื้นที่ดูแล พัฒนา และทำทุกเวอร์ชันให้ดีขึ้นอย่างที่ควรเป็น',
      storyTitle: 'ทุกการสนับสนุนมีความหมาย',
      storyBody: 'สนับสนุนเท่าที่รู้สึกสบายใจ ทุกการสนับสนุนช่วยเพิ่มเวลาและพื้นที่ให้เราเก็บรายละเอียด แก้ปัญหาถัดไปให้ดี และพาโปรเจกต์เติบโตต่อในแบบของตัวเอง',
      provider: 'Ko-fi · Benedict Interactive',
      providerBody: 'ระบบจะเปิด Ko-fi ในเบราว์เซอร์อย่างปลอดภัย การชำระเงินและข้อมูลบัญชีดำเนินการโดย Ko-fi โดยตรง ไม่ได้อยู่ใน Bearagnostic',
      cta: 'สนับสนุนผ่าน Ko-fi',
      boundary: 'เป็นทางเลือกโดยสมบูรณ์และแยกจาก Free กับ Pro การสนับสนุนไม่มีผลต่อคุณภาพการตรวจ ความปลอดภัย หรือสิทธิ์ที่คุณมีอยู่',
      signoff: 'ขอบคุณที่ช่วยให้งานอิสระยังคงเดินหน้าต่อได้อย่างอิสระ'
    },
    ja: {
      rowTitle: 'Bearagnostic を支援',
      rowSub: 'Ko-fi から独立開発を応援',
      openFailed: 'このリンクを開けるブラウザが見つかりませんでした。',
      close: '閉じる',
      kicker: 'BEARAGNOSTIC を支援',
      title: 'Bearagnostic の次の一歩を支える',
      lead: 'Bearagnostic は独立して開発し、細かな部分まで丁寧に磨き続けています。手元に置いておきたいアプリだと感じたときだけ、無理のない範囲での支援が、保守・改善・次のリリースに取り組む余力につながります。',
      storyTitle: '小さな支援も、大きな力になります。',
      storyBody: '金額は無理のない範囲で十分です。いただいた支援は、細部を整え、次の課題をきちんと解決し、このプロジェクトを独立したまま育てていく時間につながります。',
      provider: 'Ko-fi · Benedict Interactive',
      providerBody: 'Ko-fi はブラウザで安全に開きます。支払い・アカウント情報は Ko-fi 側で扱われ、Bearagnostic には送られません。',
      cta: 'Ko-fi で支援',
      boundary: '支援は完全に任意で、Free / Pro とは別です。解析品質、安全性、現在の利用権には影響しません。',
      signoff: '独立したソフトウェアづくりを支えていただき、ありがとうございます。'
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
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
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
      .ba-support-mark{position:relative;width:50px;height:50px;border-radius:17px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#31b9e8 0%,#258edc 58%,#645fd0 118%);box-shadow:0 12px 28px rgba(45,118,187,.21),inset 0 1px 0 rgba(255,255,255,.36);overflow:visible}
      .ba-support-mark::before{content:"";position:absolute;inset:1px 4px auto;height:46%;border-radius:15px 15px 50% 50%;background:linear-gradient(180deg,rgba(255,255,255,.30),rgba(255,255,255,0));pointer-events:none}
      .ba-support-mark::after{content:"";position:absolute;right:-3px;top:-3px;width:13px;height:13px;border-radius:50%;background:linear-gradient(145deg,#ff9a73,#e65b79);box-shadow:0 0 0 3px rgba(255,255,255,.94),0 4px 10px rgba(190,73,103,.22)}
      .ba-support-mark svg{position:relative;z-index:1;width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 1px rgba(21,73,122,.18))}
      .ba-support-kicker{display:block;font-size:8px;line-height:1.15;letter-spacing:.19em;color:#527f9d;font-weight:850;text-transform:uppercase}
      .ba-support-title{margin:4px 0 0;font-size:20px;line-height:1.1;letter-spacing:-.032em;font-weight:760;color:#172b43;text-wrap:balance}
      .ba-support-close{width:36px;height:36px;border:0;border-radius:13px;background:#edf3f8;color:#718294;font-size:19px;line-height:1;display:grid;place-items:center}
      .ba-support-lead{font-size:10.8px;line-height:1.5;color:#6e8091;margin:11px 2px 12px}
      .ba-support-story{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;align-items:start;padding:12px;border-radius:19px;background:linear-gradient(135deg,#fffaf0 0%,#fffefb 48%,#f5fbfe 100%);border:1px solid rgba(190,146,65,.10);box-shadow:0 7px 20px rgba(78,75,58,.045),inset 0 1px 0 #fff}
      .ba-support-story-icon{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;color:#a97528;background:linear-gradient(145deg,#fff3cc,#fffaee);box-shadow:inset 0 0 0 1px rgba(180,130,49,.08)}
      .ba-support-story-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      .ba-support-story strong{display:block;font-size:11.5px;line-height:1.25;color:#4d4029}
      .ba-support-story p{margin:4px 0 0;font-size:9.2px;line-height:1.5;color:#82745e}
      .ba-support-provider{margin-top:9px;padding:11px;border-radius:19px;background:linear-gradient(145deg,#fff,#eff8fd);border:1px solid rgba(39,145,210,.10);box-shadow:0 7px 20px rgba(53,83,114,.05)}
      .ba-support-provider-row{display:grid;grid-template-columns:37px minmax(0,1fr);gap:10px;align-items:center}
      .ba-support-provider-mark{width:37px;height:37px;border-radius:12px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#35b9ea,#2087dc);box-shadow:0 7px 16px rgba(33,132,203,.18),inset 0 1px 0 rgba(255,255,255,.30)}
      .ba-support-provider-mark svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}
      .ba-support-provider strong{display:block;font-size:11.5px;color:#233a52}
      .ba-support-provider p{margin:3px 0 0;font-size:8.8px;line-height:1.42;color:#7b8c9b}
      .ba-support-primary{width:100%;height:46px;margin-top:10px;border:0;border-radius:16px;background:linear-gradient(118deg,#24b6e8 0%,#168fdc 48%,#1878e8 100%);color:#fff;font-size:11px;font-weight:800;letter-spacing:.005em;box-shadow:0 10px 22px rgba(17,132,222,.19),inset 0 1px 0 rgba(255,255,255,.24)}
      .ba-support-primary:active{transform:translateY(1px) scale(.995)}
      .ba-support-boundary{margin:9px 4px 0;font-size:8.3px;line-height:1.42;text-align:center;color:#8b9aa8}
      .ba-support-signoff{margin:7px 4px 0;font-size:9.2px;line-height:1.4;text-align:center;color:#526b82;font-weight:700}

      #kofiSupportRow{--tone:39,145,215!important;background:linear-gradient(112deg,#fff 34%,rgba(39,145,215,.105) 79%,rgba(103,95,208,.06) 100%)!important;border-color:rgba(39,145,215,.13)!important;box-shadow:0 11px 28px rgba(44,103,153,.085),inset 0 1px 0 #fff!important}
      #kofiSupportRow:after{background:radial-gradient(circle,rgba(39,145,215,.15),transparent 68%)!important}
      #kofiSupportRow .ba-support-row-icon{position:relative;overflow:visible;background:linear-gradient(145deg,#38bceb 0%,#2489dc 58%,#665fd0 118%)!important;color:#fff!important;box-shadow:0 10px 22px rgba(38,126,198,.20),inset 0 1px 0 rgba(255,255,255,.35)!important}
      #kofiSupportRow .ba-support-row-icon::before{content:"";position:absolute;inset:1px 3px auto;height:43%;border-radius:12px 12px 50% 50%;background:linear-gradient(180deg,rgba(255,255,255,.34),rgba(255,255,255,0));pointer-events:none}
      #kofiSupportRow .ba-support-row-icon::after{content:"";position:absolute;right:-3px;top:-3px;width:11px;height:11px;border-radius:50%;background:linear-gradient(145deg,#ff9972,#e75c78);box-shadow:0 0 0 2px rgba(255,255,255,.95),0 3px 8px rgba(184,69,99,.20);pointer-events:none}
      #kofiSupportRow .ba-support-row-icon svg{position:relative;z-index:1;width:23px;height:23px;fill:none!important;stroke:#fff!important;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 1px rgba(20,72,119,.18))}
      #kofiSupportRow strong{color:#213248!important}
      #kofiSupportRow small{color:#6f8193!important}
      #kofiSupportRow>b{color:#4f86b5!important}
      #kofiSupportRow:active{transform:translateY(1px) scale(.994)}

      html[lang^="th"] .ba-support-kicker{letter-spacing:.055em}html[lang^="ja"] .ba-support-kicker{letter-spacing:.09em}
      html[lang^="th"] .ba-support-title,html[lang^="ja"] .ba-support-title{line-height:1.22;letter-spacing:-.018em}
      html[lang^="th"] .ba-support-lead,html[lang^="ja"] .ba-support-lead{line-height:1.58}
      @media(max-width:360px){.ba-support-panel{padding-left:12px;padding-right:12px}.ba-support-title{font-size:18px}.ba-support-lead{font-size:10.2px}.ba-support-story p,.ba-support-provider p{font-size:8.3px}}
      @media(max-height:690px){.ba-support-panel{max-height:92dvh}.ba-support-lead{margin:8px 2px 9px}.ba-support-story{padding:10px}.ba-support-provider{padding:10px}.ba-support-primary{height:43px;margin-top:8px}.ba-support-boundary{margin-top:7px}.ba-support-signoff{margin-top:5px}}
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
          <div class="ba-support-mark" aria-hidden="true"><svg viewBox="0 0 24 24">${ICON}</svg></div>
          <div>
            <span class="ba-support-kicker">${t.kicker}</span>
            <h2 class="ba-support-title" id="baSupportTitle">${t.title}</h2>
          </div>
          <button class="ba-support-close" type="button" data-ba-support-close aria-label="${t.close}">×</button>
        </div>
        <p class="ba-support-lead">${t.lead}</p>
        <div class="ba-support-story">
          <span class="ba-support-story-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/><circle cx="12" cy="12" r="2.5"/></svg></span>
          <div><strong>${t.storyTitle}</strong><p>${t.storyBody}</p></div>
        </div>
        <div class="ba-support-provider">
          <div class="ba-support-provider-row">
            <span class="ba-support-provider-mark" aria-hidden="true"><svg viewBox="0 0 24 24">${ICON}</svg></span>
            <div><strong>${t.provider}</strong><p>${t.providerBody}</p></div>
          </div>
        </div>
        <button class="ba-support-primary" type="button" data-ba-open-kofi>${t.cta} <span aria-hidden="true">↗</span></button>
        <p class="ba-support-boundary">${t.boundary}</p>
        <p class="ba-support-signoff">${t.signoff}</p>
      </section>`;
    overlay.querySelector('[data-ba-support-close]')?.addEventListener('click', closeOverlay);
    overlay.querySelector('[data-ba-open-kofi]')?.addEventListener('click', () => openExternal(KOFI_URL));
    openOverlay();
  }

  function supportRowMarkup() {
    return `<span class="soft-icon ba-support-row-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${ICON}</svg></span><span><strong id="kofiSupportTitle"></strong><small id="kofiSupportSub"></small></span><b>›</b>`;
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

      // Android uses the legacy #supportProjectRow for Bearagnostic Pro.
      // Voluntary Ko-fi support is deliberately a separate sibling.
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
