(() => {
  'use strict';

  const byId = (id) => document.getElementById(id);
  const parseJson = (value, fallback={}) => {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  };

  function language() {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
  }

  const COPY = {
    en: {
      preparing:'Discovering', file_details:'Reading', file_sizes:'Measuring', duplicates:'Verifying', modified_dates:'Checking date', finalizing:'Finalizing',
      waiting:'Starting local scan…', final:'Building verified results…', local:'LOCAL · LIVE',
      folder:'Folder', image:'Photo', video:'Video', audio:'Audio', document:'Document', apk:'APK', archive:'Archive', other:'File'
    },
    th: {
      preparing:'กำลังค้นหา', file_details:'กำลังอ่าน', file_sizes:'กำลังวัดขนาด', duplicates:'กำลังยืนยันไฟล์ซ้ำ', modified_dates:'กำลังตรวจวันที่', finalizing:'กำลังสรุปผล',
      waiting:'กำลังเริ่มสแกนภายในเครื่อง…', final:'กำลังสร้างผลลัพธ์ที่ยืนยันแล้ว…', local:'ภายในเครื่อง · เรียลไทม์',
      folder:'โฟลเดอร์', image:'รูปภาพ', video:'วิดีโอ', audio:'เสียง', document:'เอกสาร', apk:'APK', archive:'ไฟล์บีบอัด', other:'ไฟล์'
    },
    ja: {
      preparing:'探索中', file_details:'読み取り中', file_sizes:'サイズ確認中', duplicates:'重複確認中', modified_dates:'日付確認中', finalizing:'結果をまとめています',
      waiting:'端末内スキャンを開始しています…', final:'検証済みの結果を作成しています…', local:'端末内 · リアルタイム',
      folder:'フォルダ', image:'写真', video:'動画', audio:'音声', document:'書類', apk:'APK', archive:'アーカイブ', other:'ファイル'
    }
  };
  const text = (key) => COPY[language()]?.[key] || COPY.en[key] || key;

  const ICONS = {
    folder:'<path d="M3.5 7h6l2-2H20a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V8A1 1 0 0 1 3.5 7Z"/>',
    image:'<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.3"/><path d="m6 17 4-4 3 3 2-2 3 3"/>',
    video:'<rect x="4" y="6" width="16" height="12" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    audio:'<path d="M9 18V7l9-2v11"/><circle cx="6.5" cy="18" r="2.3"/><circle cx="15.5" cy="16" r="2.3"/>',
    document:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M10 12h5M10 15h5"/>',
    apk:'<path d="M7 8h10v10H7zM9 5l-1.2-2M15 5l1.2-2M9.5 12h.01M14.5 12h.01"/>',
    archive:'<path d="M5 7h14v12H5zM4 4h16v3H4zM10 11h4"/>',
    other:'<path d="M7 3h7l4 4v14H7zM14 3v5h5"/>'
  };

  function ensureStyle() {
    if (byId('androidLiveScanStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidLiveScanStyle';
    style.textContent = `
      .native-live-activity{position:absolute;z-index:7;left:clamp(20px,5vw,34px);right:clamp(20px,5vw,34px);bottom:clamp(8px,1.25dvh,14px);height:clamp(46px,5.8dvh,54px);display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:9px;align-items:center;padding:0 12px;border-radius:16px;background:linear-gradient(135deg,rgba(252,254,255,.86),rgba(240,248,253,.80));border:1px solid rgba(255,255,255,.92);box-shadow:0 8px 24px rgba(46,83,119,.10),inset 0 1px 0 rgba(255,255,255,.94);backdrop-filter:blur(13px);-webkit-backdrop-filter:blur(13px);opacity:0;transform:translateY(5px);pointer-events:none;transition:opacity .18s ease,transform .18s ease}
      .scan-screen[data-state='running'] .native-live-activity{opacity:1;transform:translateY(0)}
      .native-live-activity__icon{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;color:#168bd8;background:linear-gradient(145deg,#e5f6ff,#edf8fd);border:1px solid rgba(57,145,205,.08);box-shadow:inset 0 1px rgba(255,255,255,.95);position:relative}
      .native-live-activity__icon:after{content:'';position:absolute;right:-2px;bottom:-2px;width:7px;height:7px;border-radius:50%;background:#29b6e9;border:2px solid #f4faff;box-shadow:0 0 0 2px rgba(41,182,233,.09);animation:nativeLivePulse 1.45s ease-in-out infinite}
      .native-live-activity__icon svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      .native-live-activity__copy{min-width:0;display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:7px;row-gap:1px;align-items:center}
      .native-live-activity__verb{font-size:clamp(10px,2.6vw,11.5px);font-weight:800;letter-spacing:.055em;text-transform:uppercase;color:#2a6f9e;white-space:nowrap}
      .native-live-activity__path{font-size:clamp(11.5px,3vw,13.5px);font-weight:620;color:#263e56;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
      .native-live-activity__meta{grid-column:1/-1;font-size:clamp(9.5px,2.5vw,11px);line-height:1.15;color:#6b8195;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .native-live-activity__percent{min-width:43px;text-align:center;padding:5px 7px;border-radius:11px;background:rgba(255,255,255,.72);border:1px solid rgba(79,123,158,.08);font-size:clamp(10.5px,2.75vw,12.5px);font-weight:790;color:#1f78b5;font-variant-numeric:tabular-nums}
      @keyframes nativeLivePulse{0%,100%{transform:scale(.78);opacity:.58}50%{transform:scale(1);opacity:1}}
      @media(max-width:350px){.native-live-activity{left:15px;right:15px;padding:0 9px;gap:7px}.native-live-activity__icon{width:27px;height:27px}.native-live-activity__percent{min-width:38px;padding:4px 5px}.native-live-activity__copy{column-gap:5px}}
      @media(prefers-reduced-motion:reduce){.native-live-activity,.native-live-activity__icon:after{transition:none!important;animation:none!important}}
      html[data-motion='reduced'] .native-live-activity,html[data-motion='reduced'] .native-live-activity__icon:after{transition:none!important;animation:none!important}
    `;
    document.head.appendChild(style);
  }

  function ensureActivity() {
    ensureStyle();
    const hero = document.querySelector('#checkupScreen .scan-hero');
    if (!hero) return null;
    let activity = byId('nativeLiveScanActivity');
    if (!activity) {
      activity = document.createElement('div');
      activity.id = 'nativeLiveScanActivity';
      activity.className = 'native-live-activity';
      activity.setAttribute('aria-hidden', 'true');
      activity.innerHTML = `
        <span class="native-live-activity__icon"><svg viewBox="0 0 24 24" aria-hidden="true" id="nativeLiveScanIcon"></svg></span>
        <span class="native-live-activity__copy">
          <b class="native-live-activity__verb" id="nativeLiveScanVerb"></b>
          <strong class="native-live-activity__path" id="nativeLiveScanPath"></strong>
          <small class="native-live-activity__meta" id="nativeLiveScanMeta"></small>
        </span>
        <b class="native-live-activity__percent" id="nativeLiveScanPercent">—</b>`;
      hero.appendChild(activity);
    }
    return activity;
  }

  function kindIcon(kind) {
    const normalized = ICONS[kind] ? kind : 'other';
    return {kind: normalized, svg: ICONS[normalized]};
  }

  function renderProgress(data) {
    const activity = ensureActivity();
    if (!activity) return;
    const phase = String(data.phase || 'preparing');
    const name = String(data.activeItemName || '').trim();
    const location = String(data.activeItemLocation || '').trim();
    const icon = kindIcon(String(data.activeItemKind || (phase === 'preparing' ? 'folder' : 'other')));
    const percentText = String(byId('scanPercent')?.textContent || '').trim();

    byId('nativeLiveScanIcon').innerHTML = icon.svg;
    byId('nativeLiveScanVerb').textContent = text(phase);
    byId('nativeLiveScanPercent').textContent = /^\d+$/.test(percentText) ? `${percentText}%` : '—';

    if (phase === 'finalizing') {
      byId('nativeLiveScanPath').textContent = text('final');
      byId('nativeLiveScanMeta').textContent = text('local');
      return;
    }

    if (name) {
      byId('nativeLiveScanPath').textContent = name;
      const typeLabel = text(icon.kind);
      byId('nativeLiveScanMeta').textContent = location ? `${typeLabel} · ${location}` : `${typeLabel} · ${text('local')}`;
    } else {
      byId('nativeLiveScanPath').textContent = text('waiting');
      byId('nativeLiveScanMeta').textContent = text('local');
    }
  }

  function clearActivity() {
    const activity = byId('nativeLiveScanActivity');
    if (!activity) return;
    byId('nativeLiveScanPath').textContent = '';
    byId('nativeLiveScanMeta').textContent = '';
    byId('nativeLiveScanPercent').textContent = '—';
  }

  function wrapCallbacks() {
    const base = window.BearagnosticAndroid;
    if (!base || base.__liveScanWrapped) return;
    window.BearagnosticAndroid = Object.freeze({
      __scanTrustWrapped: Boolean(base.__scanTrustWrapped),
      __liveScanWrapped: true,
      onNativeStateChanged(raw) { base.onNativeStateChanged?.(raw); },
      onScanProgress(raw) {
        base.onScanProgress?.(raw);
        renderProgress(parseJson(raw, {}));
      },
      onScanComplete(raw) { base.onScanComplete?.(raw); clearActivity(); },
      onScanCancelled(raw) { base.onScanCancelled?.(raw); clearActivity(); },
      onScanError(raw) { base.onScanError?.(raw); clearActivity(); },
    });
  }

  ensureStyle();
  ensureActivity();
  wrapCallbacks();

  document.addEventListener('DOMContentLoaded', () => {
    ensureActivity();
    wrapCallbacks();
  }, {once:true});

  window.addEventListener('bearagnostic:languagechange', () => {
    ensureActivity();
  });
})();
