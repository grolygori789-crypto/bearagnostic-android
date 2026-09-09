(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

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
    en:{display:'Display',compact:'Text',preview:'Thumbnail',large:'Large',image:'Photo',video:'Video',audio:'Audio',document:'Document',apk:'APK',archive:'Archive',other:'File',local:'Local preview'},
    th:{display:'รูปแบบ',compact:'ข้อความ',preview:'รูปเล็ก',large:'รูปใหญ่',image:'รูปภาพ',video:'วิดีโอ',audio:'เสียง',document:'เอกสาร',apk:'APK',archive:'ไฟล์บีบอัด',other:'ไฟล์',local:'ตัวอย่างภายในเครื่อง'},
    ja:{display:'表示',compact:'テキスト',preview:'サムネイル',large:'大きく',image:'写真',video:'動画',audio:'音声',document:'書類',apk:'APK',archive:'アーカイブ',other:'ファイル',local:'端末内プレビュー'}
  };
  const text = (key) => COPY[language()]?.[key] || COPY.en[key] || key;

  const ICONS = {
    image:'<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.35"/><path d="m6 17 4-4 3 3 2-2 3 3"/>',
    video:'<rect x="4" y="6" width="16" height="12" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    audio:'<path d="M9 18V7l9-2v11"/><circle cx="6.5" cy="18" r="2.3"/><circle cx="15.5" cy="16" r="2.3"/>',
    document:'<path d="M7 3h7l4 4v14H7zM14 3v5h5M10 12h5M10 15h5"/>',
    apk:'<path d="M7 8h10v10H7zM9 5l-1.2-2M15 5l1.2-2M9.5 12h.01M14.5 12h.01"/>',
    archive:'<path d="M5 7h14v12H5zM4 4h16v3H4zM10 11h4"/>',
    other:'<path d="M7 3h7l4 4v14H7zM14 3v5h5"/>'
  };

  let viewMode = readViewMode();
  let intersectionObserver = null;
  let queueTimer = null;
  let requestTimer = null;
  let scanActive = false;
  let requestSequence = 0;
  const mediaQueue = [];
  const queuedKeys = new Set();
  const pendingRequests = new Map();
  const cache = new Map();

  function readViewMode() {
    try {
      const value = localStorage.getItem('bearagnostic.review.view.v1');
      return ['compact','preview','large'].includes(value) ? value : 'preview';
    } catch (_) { return 'preview'; }
  }

  function saveViewMode(value) {
    try { localStorage.setItem('bearagnostic.review.view.v1', value); } catch (_) {}
  }

  function ensureStyle() {
    if (byId('androidReviewMediaStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidReviewMediaStyle';
    style.textContent = `
      .native-review-panel{grid-template-rows:auto auto auto minmax(0,1fr) auto!important}
      .native-review-displaybar{min-height:44px;padding:6px 13px 8px;background:rgba(252,254,255,.98);border-bottom:1px solid rgba(91,120,149,.06);display:flex;align-items:center;justify-content:space-between;gap:10px}
      .native-review-displaybar>strong{font-size:12px;line-height:1;color:#455d72;font-weight:720;white-space:nowrap}
      .native-view-segment{display:grid;grid-template-columns:repeat(3,auto);gap:3px;padding:3px;border-radius:13px;background:#edf4f8;border:1px solid rgba(86,119,149,.08)}
      .native-view-option{height:30px;min-width:58px;padding:0 9px;border-radius:10px;background:transparent;color:#64798c;font-size:11.5px;font-weight:720;box-shadow:none;transition:background .16s ease,color .16s ease,box-shadow .16s ease}
      .native-view-option.is-active{background:#fff;color:#147fbf;box-shadow:0 4px 12px rgba(43,88,126,.09),inset 0 1px rgba(255,255,255,.95)}
      .native-review-panel .native-file-row.native-media-row{grid-template-columns:auto 36px minmax(0,1fr) auto!important;column-gap:10px!important;align-items:center!important;transition:min-height .16s ease,padding .16s ease}
      .native-file-visual{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;overflow:hidden;background:linear-gradient(145deg,#eef7fc,#e7f2f8);border:1px solid rgba(70,115,151,.08);color:#338fc9;box-shadow:inset 0 1px rgba(255,255,255,.96);position:relative}
      .native-file-visual svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.native-file-visual img{width:100%;height:100%;display:block;object-fit:cover;background:#eef4f8}
      .native-media-type{display:inline-flex;align-items:center;width:max-content;max-width:100%;margin:0 0 4px;padding:2px 6px;border-radius:99px;background:#eef6fb;color:#337da8;font-size:9.5px;font-weight:800;letter-spacing:.035em;text-transform:uppercase}
      .native-media-detail{display:block!important;margin-top:4px!important;font-size:10.5px!important;line-height:1.3!important;color:#607589!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
      .native-media-row[data-kind='image'] .native-file-visual{color:#2f86de;background:linear-gradient(145deg,#edf7ff,#e7f2fd)}
      .native-media-row[data-kind='video'] .native-file-visual{color:#5a69c8;background:linear-gradient(145deg,#f1f2fd,#eceffd)}
      .native-media-row[data-kind='audio'] .native-file-visual{color:#9b68bb;background:linear-gradient(145deg,#f7f0fb,#f1ecf8)}
      .native-media-row[data-kind='document'] .native-file-visual{color:#507a9d}.native-media-row[data-kind='apk'] .native-file-visual{color:#2b987d;background:linear-gradient(145deg,#edf9f5,#e7f5f0)}
      .native-media-row[data-kind='archive'] .native-file-visual{color:#a37943;background:linear-gradient(145deg,#faf4ea,#f5eee3)}
      .native-review-panel[data-media-view='preview'] .native-file-row.native-media-row{grid-template-columns:auto 58px minmax(0,1fr) auto!important;min-height:82px!important}.native-review-panel[data-media-view='preview'] .native-file-visual{width:58px;height:58px;border-radius:15px}
      .native-review-panel[data-media-view='large'] .native-file-row.native-media-row:not(.is-visual-media){grid-template-columns:auto 58px minmax(0,1fr) auto!important;min-height:82px!important}.native-review-panel[data-media-view='large'] .native-file-row.native-media-row:not(.is-visual-media) .native-file-visual{width:58px;height:58px;border-radius:15px}
      .native-review-panel[data-media-view='large'] .native-file-row.native-media-row.is-visual-media{grid-template-columns:auto minmax(0,1fr) auto!important;grid-template-rows:clamp(145px,21dvh,190px) auto!important;align-items:center!important;padding:10px!important}
      .native-review-panel[data-media-view='large'] .native-file-row.native-media-row.is-visual-media .native-file-visual{grid-column:1/-1;grid-row:1;width:100%;height:100%;border-radius:16px;background:#eaf2f7}
      .native-review-panel[data-media-view='large'] .native-file-row.native-media-row.is-visual-media>input{grid-column:1;grid-row:2}.native-review-panel[data-media-view='large'] .native-file-row.native-media-row.is-visual-media>.native-file-copy{grid-column:2;grid-row:2;min-width:0}.native-review-panel[data-media-view='large'] .native-file-row.native-media-row.is-visual-media>.native-file-meta{grid-column:3;grid-row:2}
      .native-review-panel[data-media-view='compact'] .native-file-visual img{display:none!important}
      @media(max-width:360px){.native-review-displaybar{padding-left:10px;padding-right:10px}.native-view-option{min-width:50px;padding:0 7px;font-size:10.5px}.native-review-panel .native-file-row.native-media-row{column-gap:8px!important}.native-review-panel[data-media-view='preview'] .native-file-row.native-media-row,.native-review-panel[data-media-view='large'] .native-file-row.native-media-row:not(.is-visual-media){grid-template-columns:auto 52px minmax(0,1fr) auto!important}.native-review-panel[data-media-view='preview'] .native-file-visual,.native-review-panel[data-media-view='large'] .native-file-row.native-media-row:not(.is-visual-media) .native-file-visual{width:52px;height:52px}}
      @media(prefers-reduced-motion:reduce){.native-view-option,.native-file-row.native-media-row{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function ensureToolbar() {
    ensureStyle();
    const panel = document.querySelector('.native-review-panel');
    const summary = panel?.querySelector('.native-review-summary');
    if (!panel || !summary) return null;
    panel.dataset.mediaView = viewMode;
    let bar = byId('nativeReviewDisplaybar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'nativeReviewDisplaybar';
      bar.className = 'native-review-displaybar';
      bar.innerHTML = `<strong id="nativeReviewDisplayLabel"></strong><div class="native-view-segment" role="group" aria-label="Review display"><button class="native-view-option" type="button" data-media-view="compact"></button><button class="native-view-option" type="button" data-media-view="preview"></button><button class="native-view-option" type="button" data-media-view="large"></button></div>`;
      summary.insertAdjacentElement('afterend', bar);
    }
    refreshToolbarCopy();
    return bar;
  }

  function refreshToolbarCopy() {
    const bar = byId('nativeReviewDisplaybar');
    if (!bar) return;
    const label = byId('nativeReviewDisplayLabel');
    const labelValue = text('display');
    if (label && label.textContent !== labelValue) label.textContent = labelValue;
    bar.querySelectorAll('[data-media-view]').forEach((button) => {
      const mode = button.dataset.mediaView;
      const buttonValue = text(mode);
      if (button.textContent !== buttonValue) button.textContent = buttonValue;
      button.classList.toggle('is-active', mode === viewMode);
      button.setAttribute('aria-pressed', mode === viewMode ? 'true' : 'false');
    });
    const segment = bar.querySelector('.native-view-segment');
    if (segment) segment.setAttribute('aria-label', text('display'));
    const panel = document.querySelector('.native-review-panel');
    if (panel) panel.dataset.mediaView = viewMode;
  }

  function inferKind(name) {
    const extension = String(name || '').split('.').pop()?.toLowerCase() || '';
    if (['jpg','jpeg','png','webp','gif','bmp','heic','heif','avif','dng'].includes(extension)) return 'image';
    if (['mp4','mkv','mov','avi','webm','m4v','3gp','ts','mts','m2ts'].includes(extension)) return 'video';
    if (['mp3','m4a','aac','wav','flac','ogg','opus','wma','amr'].includes(extension)) return 'audio';
    if (extension === 'apk') return 'apk';
    if (['zip','rar','7z','tar','gz','tgz','bz2','xz'].includes(extension)) return 'archive';
    if (['pdf','txt','rtf','md','doc','docx','xls','xlsx','ppt','pptx','csv','json','xml','epub','odt','ods','odp'].includes(extension)) return 'document';
    return 'other';
  }

  function iconSvg(kind) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[kind] || ICONS.other}</svg>`;
  }

  function ensureRowScaffold(row) {
    if (!row || row.dataset.mediaReady === '1') return;
    const checkbox = row.querySelector('[data-review-id]');
    const copy = row.querySelector('.native-file-copy');
    const title = copy?.querySelector('strong');
    if (!checkbox || !copy || !title) return;
    const kind = inferKind(title.textContent);
    row.classList.add('native-media-row');
    row.dataset.kind = kind;
    row.classList.toggle('is-visual-media', kind === 'image' || kind === 'video');

    const visual = document.createElement('span');
    visual.className = 'native-file-visual';
    visual.setAttribute('aria-hidden', 'true');
    visual.innerHTML = iconSvg(kind);
    checkbox.insertAdjacentElement('afterend', visual);

    const badge = document.createElement('span');
    badge.className = 'native-media-type';
    badge.textContent = text(kind);
    copy.insertBefore(badge, title);

    const detail = document.createElement('small');
    detail.className = 'native-media-detail';
    detail.hidden = true;
    copy.appendChild(detail);
    row.dataset.mediaReady = '1';
  }

  function formatDuration(value) {
    const total = Math.max(0, Math.round((Number(value) || 0) / 1000));
    if (!total) return '';
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${m}:${String(s).padStart(2,'0')}`;
  }

  function detailText(media) {
    const kind = media.kind || 'other';
    const parts = [];
    if (kind === 'image') {
      if (media.width && media.height) parts.push(`${media.width} × ${media.height}`);
    } else if (kind === 'video') {
      const duration = formatDuration(media.durationMs); if (duration) parts.push(duration);
      if (media.width && media.height) parts.push(`${media.width} × ${media.height}`);
    } else if (kind === 'audio') {
      if (media.title) parts.push(String(media.title));
      if (media.artist) parts.push(String(media.artist));
      const duration = formatDuration(media.durationMs); if (duration) parts.push(duration);
    } else if (kind === 'apk') {
      if (media.appName) parts.push(String(media.appName));
      if (media.appVersion) parts.push(`v${media.appVersion}`);
    } else if (kind === 'document' || kind === 'archive') {
      if (media.extension) parts.push(String(media.extension).toUpperCase());
    }
    return parts.slice(0, 3).join(' · ');
  }

  function safePreviewUrl(value) {
    const url = String(value || '');
    return /^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(url) ? url : '';
  }

  function applyMedia(row, media, variant) {
    if (!row?.isConnected || !media?.available) return;
    const kind = ['image','video','audio','document','apk','archive','other'].includes(media.kind) ? media.kind : (row.dataset.kind || 'other');
    row.dataset.kind = kind;
    row.classList.toggle('is-visual-media', kind === 'image' || kind === 'video');
    row.dataset.mediaVariant = variant;

    const badge = row.querySelector('.native-media-type');
    if (badge) badge.textContent = text(kind);
    const detail = row.querySelector('.native-media-detail');
    const detailValue = detailText(media);
    if (detail) { detail.textContent = detailValue; detail.hidden = !detailValue; }

    const visual = row.querySelector('.native-file-visual');
    if (!visual) return;
    visual.innerHTML = iconSvg(kind);
    const preview = variant === 'compact' ? '' : safePreviewUrl(media.previewDataUrl);
    if (preview) {
      const img = document.createElement('img');
      img.alt = '';
      img.decoding = 'async';
      img.src = preview;
      visual.replaceChildren(img);
    }
  }

  function cachePut(key, value) {
    if (cache.has(key)) cache.delete(key);
    cache.set(key, value);
    while (cache.size > 16) cache.delete(cache.keys().next().value);
  }

  function enqueueRow(row) {
    ensureRowScaffold(row);
    const id = row.querySelector('[data-review-id]')?.dataset.reviewId;
    if (!id) return;
    const variant = viewMode;
    const key = `${id}:${variant}`;
    if (row.dataset.mediaVariant === variant) return;
    if (cache.has(key)) { applyMedia(row, cache.get(key), variant); return; }
    if (queuedKeys.has(key)) return;
    queuedKeys.add(key);
    mediaQueue.push({row, id, variant, key});
    scheduleQueue();
  }

  function scheduleQueue() {
    if (queueTimer != null) return;
    queueTimer = setTimeout(processQueue, 18);
  }

  function processQueue() {
    queueTimer = null;
    if (pendingRequests.size > 0) return;
    const task = mediaQueue.shift();
    if (!task) return;
    queuedKeys.delete(task.key);
    if (!task.row?.isConnected || task.variant !== viewMode) { if (mediaQueue.length) scheduleQueue(); return; }

    const token = `m${++requestSequence}`;
    pendingRequests.set(token, task);
    let accepted = {};
    try { accepted = parseJson(NATIVE.requestReviewMedia?.(task.id, task.variant, token), {}); } catch (_) { accepted = {}; }
    if (!accepted?.accepted) {
      pendingRequests.delete(token);
      if (mediaQueue.length) scheduleQueue();
      return;
    }
    if (requestTimer != null) clearTimeout(requestTimer);
    requestTimer = setTimeout(() => finishMediaRequest(token, {}), 10_000);
  }

  function finishMediaRequest(token, media) {
    const task = pendingRequests.get(token);
    if (!task) return;
    pendingRequests.delete(token);
    if (requestTimer != null) { clearTimeout(requestTimer); requestTimer = null; }
    if (task.row?.isConnected && task.variant === viewMode && media?.available) {
      cachePut(task.key, media);
      applyMedia(task.row, media, task.variant);
    }
    if (mediaQueue.length) scheduleQueue();
  }

  function onMediaReady(token, raw) {
    finishMediaRequest(String(token || ''), parseJson(raw, {}));
  }

  function ensureIntersectionObserver() {
    const list = byId('nativeReviewList');
    if (!list) return null;
    if (intersectionObserver) return intersectionObserver;
    if (!('IntersectionObserver' in window)) return null;
    intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) enqueueRow(entry.target);
    }, {root:list, rootMargin:'120px 0px', threshold:0.01});
    return intersectionObserver;
  }

  function refreshRows() {
    ensureToolbar();
    const list = byId('nativeReviewList');
    if (!list) return;
    const observer = ensureIntersectionObserver();
    list.querySelectorAll('.native-file-row').forEach((row) => {
      ensureRowScaffold(row);
      if (observer) observer.observe(row); else enqueueRow(row);
    });
  }

  function setViewMode(mode) {
    if (!['compact','preview','large'].includes(mode) || mode === viewMode) return;
    viewMode = mode;
    saveViewMode(mode);
    mediaQueue.length = 0;
    queuedKeys.clear();
    refreshToolbarCopy();
    document.querySelectorAll('#nativeReviewList .native-file-row').forEach((row) => {
      delete row.dataset.mediaVariant;
      const visual = row.querySelector('.native-file-visual');
      const kind = row.dataset.kind || 'other';
      if (visual) visual.innerHTML = iconSvg(kind);
    });
    setTimeout(refreshRows, 0);
  }


  function resetTransientMedia() {
    mediaQueue.length = 0;
    queuedKeys.clear();
    pendingRequests.clear();
    cache.clear();
    if (queueTimer != null) { clearTimeout(queueTimer); queueTimer = null; }
    if (requestTimer != null) { clearTimeout(requestTimer); requestTimer = null; }
    if (intersectionObserver) { intersectionObserver.disconnect(); intersectionObserver = null; }
  }

  function wrapCallbacks() {
    const base = window.BearagnosticAndroid;
    if (!base || base.__reviewMediaWrapped) return;
    window.BearagnosticAndroid = Object.freeze({
      __scanTrustWrapped: Boolean(base.__scanTrustWrapped),
      __liveScanWrapped: Boolean(base.__liveScanWrapped),
      __reviewMediaWrapped: true,
      onNativeStateChanged(raw) { base.onNativeStateChanged?.(raw); },
      onScanProgress(raw) {
        if (!scanActive) { resetTransientMedia(); scanActive = true; }
        base.onScanProgress?.(raw);
      },
      onScanComplete(raw) { base.onScanComplete?.(raw); scanActive = false; },
      onScanCancelled(raw) { base.onScanCancelled?.(raw); scanActive = false; },
      onScanError(raw) { base.onScanError?.(raw); scanActive = false; },
    });
  }

  document.addEventListener('click', (event) => {
    const button = event.target?.closest?.('[data-media-view]');
    if (!button) return;
    event.preventDefault();
    setViewMode(button.dataset.mediaView);
  });

  window.BearagnosticReviewMedia = Object.freeze({ onMediaReady });

  ensureStyle();
  ensureToolbar();
  refreshRows();
  wrapCallbacks();

  const mutationObserver = new MutationObserver(() => {
    ensureToolbar();
    refreshRows();
  });
  mutationObserver.observe(document.body, {childList:true, subtree:true});

  document.addEventListener('DOMContentLoaded', () => {
    ensureToolbar();
    refreshRows();
    wrapCallbacks();
  }, {once:true});

  window.addEventListener('bearagnostic:languagechange', () => {
    refreshToolbarCopy();
    document.querySelectorAll('#nativeReviewList .native-file-row').forEach((row) => {
      const badge = row.querySelector('.native-media-type');
      if (badge) badge.textContent = text(row.dataset.kind || 'other');
    });
  });
})();
