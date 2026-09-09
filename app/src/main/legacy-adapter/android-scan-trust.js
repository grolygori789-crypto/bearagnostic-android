(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const BUILD = 20;
  let lastComplete = null;

  const byId = (id) => document.getElementById(id);
  const parseJson = (value, fallback={}) => {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  };
  const number = (value) => Math.max(0, Number(value) || 0);

  function language() {
    const value = (document.documentElement.lang || 'en').toLowerCase();
    return value.startsWith('th') ? 'th' : value.startsWith('ja') ? 'ja' : 'en';
  }

  const COPY = {
    en: {
      title: 'Scan evidence', files: 'Files reviewed', folders: 'Folders visited',
      data: 'Data read', duration: 'Duration', coverage: 'Coverage', hashed: 'Hashed',
      full: 'Verified', partial: 'Partial', metadata: 'Metadata only', issues: 'Access/read issues',
      quick: 'Quick checks metadata across accessible shared storage. Bearagnostic never adds fake waiting.',
      smart: 'Smart samples up to 256 KB from each readable non-empty file and verifies focused duplicate candidates.',
      deep: 'Deep streams every readable non-empty file. FULL is shown only when the expected bytes match the bytes actually read.',
    },
    th: {
      title: 'หลักฐานการสแกน', files: 'ไฟล์ที่ตรวจ', folders: 'โฟลเดอร์ที่ตรวจ',
      data: 'ข้อมูลที่อ่าน', duration: 'ระยะเวลา', coverage: 'ความครอบคลุม', hashed: 'ข้อมูลที่แฮช',
      full: 'ยืนยันครบ', partial: 'ไม่ครบ', metadata: 'ตรวจ Metadata', issues: 'ปัญหาการเข้าถึง/อ่าน',
      quick: 'Quick ตรวจ metadata ทั่ว shared storage ที่เข้าถึงได้ และไม่มีการหน่วงเวลาให้ดูนาน',
      smart: 'Smart อ่านตัวอย่างสูงสุด 256 KB ต่อไฟล์ที่อ่านได้ และยืนยันไฟล์ซ้ำในตำแหน่งสำคัญ',
      deep: 'Deep อ่านเนื้อหาไฟล์ที่เข้าถึงได้แบบ streaming จนครบ จะแสดงว่าครบเมื่อจำนวนไบต์ที่อ่านตรงกับที่คาดเท่านั้น',
    },
    ja: {
      title: 'スキャンの証拠', files: '確認済みファイル', folders: '確認済みフォルダ',
      data: '読み取りデータ', duration: '所要時間', coverage: 'カバレッジ', hashed: 'ハッシュ対象',
      full: '検証済み', partial: '一部のみ', metadata: 'メタデータのみ', issues: 'アクセス/読み取り問題',
      quick: 'Quick はアクセス可能な共有ストレージ全体のメタデータを確認し、見せかけの待ち時間は追加しません。',
      smart: 'Smart は読み取り可能な各ファイルから最大 256 KB をサンプルし、重要な重複候補を検証します。',
      deep: 'Deep は読み取り可能な非空ファイルを最後までストリーム読み取りし、想定バイト数と実読取数が一致した場合のみ FULL とします。',
    },
  };
  const text = (key) => COPY[language()]?.[key] || COPY.en[key] || key;

  function formatBytes(value) {
    const bytes = number(value);
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let n = bytes / 1024;
    let i = 0;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return `${n >= 100 ? n.toFixed(0) : n >= 10 ? n.toFixed(1) : n.toFixed(2)} ${units[i]}`;
  }

  function formatDuration(value) {
    const ms = number(value);
    if (ms < 1000) return `${Math.round(ms)} ms`;
    if (ms < 60_000) return `${(ms / 1000).toFixed(ms < 10_000 ? 1 : 0)} s`;
    const min = Math.floor(ms / 60_000);
    const sec = Math.round((ms % 60_000) / 1000);
    return `${min}m ${sec}s`;
  }

  function evidenceComplete(result) {
    const mode = String(result.contentReadMode || 'none').toLowerCase();
    const expected = number(result.contentExpectedBytes);
    const actual = number(result.contentProbeBytes);
    const commonOk =
      number(result.inaccessibleFolders) === 0 &&
      number(result.missingDuringScan) === 0 &&
      number(result.contentProbeFailures) === 0 &&
      number(result.hashReadFailures) === 0;

    let contentOk = true;
    if (mode === 'sample' || mode === 'full') contentOk = actual === expected;
    if (mode === 'full') {
      contentOk = contentOk &&
        number(result.contentPartialReadFiles) === 0 &&
        number(result.contentFullyReadFiles) === number(result.contentProbedFiles);
    }

    return String(result.coverageStatus || '').toLowerCase() === 'complete_accessible_scope' && commonOk && contentOk;
  }

  function issueCount(result) {
    return number(result.inaccessibleFolders) +
      number(result.unreadableFiles) +
      number(result.missingDuringScan) +
      number(result.contentProbeFailures) +
      number(result.hashReadFailures);
  }

  function dataReadValue(result) {
    const mode = String(result.contentReadMode || 'none').toLowerCase();
    if (mode === 'none') return text('metadata');
    const actual = number(result.contentProbeBytes);
    const expected = number(result.contentExpectedBytes);
    if (expected <= 0) return formatBytes(actual);
    return `${formatBytes(actual)} / ${formatBytes(expected)}`;
  }

  function modeNote(result) {
    const mode = String(result.scanMode || '').toLowerCase();
    if (mode === 'deep') return text('deep');
    if (mode === 'smart') return text('smart');
    return text('quick');
  }

  function ensureReadabilityStyle() {
    let style = byId('androidReadabilityStyle');
    if (!style) {
      style = document.createElement('style');
      style.id = 'androidReadabilityStyle';
      style.textContent = `
        .native-mode-eyebrow{font-size:10px!important;color:#507894!important}
        .native-mode-lead{font-size:13px!important;line-height:1.5!important;color:#52677b!important}
        .native-mode-option strong{font-size:15px!important;color:#1c3046!important}
        .native-mode-option small{font-size:11.5px!important;line-height:1.42!important;color:#5c7084!important}
        .native-mode-badge{font-size:9px!important;color:#0878bf!important}
        .native-pref-card__head strong{font-size:14px!important;color:#1b3148!important}
        .native-pref-card__head small{font-size:11px!important;line-height:1.42!important;color:#5e7184!important}
        .native-pref-row span{font-size:12px!important;color:#40566c!important}
        .native-pref-row b{font-size:11.5px!important}.native-pref-row b.slate{color:#536b80!important}
        .native-sheet-head p{font-size:12.5px!important;color:#596f84!important}
        .native-results-eyebrow{font-size:10px!important;color:#347faa!important}
        .native-results-header p{font-size:12.5px!important;line-height:1.48!important;color:#566b7f!important;max-width:320px!important}
        .native-result-kicker{font-size:9.5px!important;color:#53748f!important}
        .native-result-hero p{font-size:12.5px!important;line-height:1.5!important;color:#51697f!important}
        .native-hero-metric span{font-size:10.5px!important;color:#5a6f83!important}
        .native-primary-action small{font-size:11.5px!important;line-height:1.38!important;color:rgba(255,255,255,.95)!important}
        .native-results-section-head strong{font-size:14px!important;color:#1f354b!important}
        .native-results-section-head small{font-size:10.5px!important;color:#607487!important}
        .native-result-action strong{font-size:13px!important;color:#193047!important}
        .native-result-action small{font-size:11px!important;line-height:1.35!important;color:#5b6f82!important}
        .native-facts-title{font-size:12px!important;color:#263f56!important}
        .native-fact b{font-size:14px!important;color:#18334d!important}
        .native-fact span{font-size:10.5px!important;color:#5f7183!important}
        .native-session-card strong,.native-safety-card strong{font-size:12.5px!important;color:#1f374e!important}
        .native-session-card small,.native-safety-card small{font-size:10.5px!important;line-height:1.45!important;color:#5b6f82!important}
        .native-secondary{font-size:13px!important;color:#425a70!important}.native-secondary--blue{color:#066ebc!important}
        .native-review-summary{font-size:12px!important;color:#536b80!important}
        .native-file-copy strong{font-size:13.5px!important;color:#1b3148!important}
        .native-file-copy small{font-size:11px!important;color:#5b6f82!important}
        .native-file-meta b{font-size:12px!important;color:#1f374e!important}
        .native-risk{font-size:10px!important;color:#50657a!important}
        .native-selection-copy small{font-size:11px!important;color:#5d7083!important}
        .native-confirm-panel p{font-size:12.5px!important;color:#566d82!important}
        .native-confirm-note{font-size:11px!important;line-height:1.5!important;color:#755619!important}
        .native-clean-card p{font-size:12.5px!important;line-height:1.5!important;color:#596e82!important}
        .native-mode-guide strong{font-size:12px!important;color:#203a52!important}
        .native-mode-guide small{font-size:10.5px!important;line-height:1.45!important;color:#5c7084!important}
        .native-trust-copy b{font-size:9.5px!important}
        .native-trust-copy strong{font-size:12.5px!important;line-height:1.3!important;color:#20384f!important}
        .native-trust-copy small{font-size:10.5px!important;line-height:1.48!important;color:#596e82!important}
        .native-review-advice b{font-size:11.5px!important;color:#20384f!important}
        .native-review-advice small{font-size:10.5px!important;line-height:1.48!important;color:#596e82!important}
        .native-impact-kicker{font-size:9px!important;color:#397c68!important}
        .native-impact-copy small{font-size:10.5px!important;line-height:1.48!important;color:#596e82!important}
        .native-impact-item span{font-size:10px!important;color:#5c7084!important}
        .native-impact-proof{font-size:10.5px!important;line-height:1.48!important;color:#566d82!important}
        .native-more-sub{font-size:12px!important;color:#5a7084!important}

        .native-scan-evidence{margin:10px 0 0;padding:12px;border-radius:20px;background:linear-gradient(145deg,#f4f9fc,#eef7fb);border:1px solid rgba(77,116,151,.10);box-shadow:inset 0 1px 0 rgba(255,255,255,.92)}
        .native-scan-evidence__head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}
        .native-scan-evidence__head strong{font-size:12.5px;color:#1f3a52}.native-scan-evidence__badge{font-size:10px;font-weight:800;border-radius:99px;padding:4px 8px;background:#e5f7f1;color:#187d68}.native-scan-evidence__badge.partial{background:#fff2df;color:#94651c}
        .native-scan-evidence__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
        .native-scan-evidence__metric{min-width:0;border-radius:14px;padding:9px 10px;background:rgba(255,255,255,.82);border:1px solid rgba(255,255,255,.95)}
        .native-scan-evidence__metric b{display:block;font-size:13px;line-height:1.15;color:#17334d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.native-scan-evidence__metric span{display:block;font-size:10px;line-height:1.3;color:#5e7184;margin-top:4px}
        .native-scan-evidence__note{font-size:10.5px;line-height:1.48;color:#536a7f;margin:9px 1px 0}
        .native-scan-evidence__issues{font-size:10px;color:#667b8f;margin-top:6px}
        @media(max-width:360px){.native-scan-evidence__metric b{font-size:12px}.native-scan-evidence__metric span{font-size:9.5px}}
      `;
    }
    document.head.appendChild(style);
  }

  function ensureEvidenceCard() {
    const hero = document.querySelector('.native-result-hero');
    if (!hero) return null;
    let card = byId('nativeScanEvidence');
    if (!card) {
      card = document.createElement('section');
      card.id = 'nativeScanEvidence';
      card.className = 'native-scan-evidence';
      card.innerHTML = `
        <div class="native-scan-evidence__head"><strong id="nativeScanEvidenceTitle"></strong><span class="native-scan-evidence__badge" id="nativeScanEvidenceBadge"></span></div>
        <div class="native-scan-evidence__grid">
          <div class="native-scan-evidence__metric"><b id="nativeEvidenceFiles"></b><span id="nativeEvidenceFilesLabel"></span></div>
          <div class="native-scan-evidence__metric"><b id="nativeEvidenceFolders"></b><span id="nativeEvidenceFoldersLabel"></span></div>
          <div class="native-scan-evidence__metric"><b id="nativeEvidenceRead"></b><span id="nativeEvidenceReadLabel"></span></div>
          <div class="native-scan-evidence__metric"><b id="nativeEvidenceDuration"></b><span id="nativeEvidenceDurationLabel"></span></div>
        </div>
        <p class="native-scan-evidence__note" id="nativeEvidenceNote"></p>
        <div class="native-scan-evidence__issues" id="nativeEvidenceIssues"></div>`;
      hero.insertAdjacentElement('afterend', card);
    }
    return card;
  }

  function setText(id, value) {
    const el = byId(id);
    if (el && el.textContent !== String(value)) el.textContent = String(value);
  }

  function renderEvidence(result=lastComplete) {
    if (!result) return;
    lastComplete = result;
    ensureReadabilityStyle();
    const card = ensureEvidenceCard();
    if (!card) return;

    const complete = evidenceComplete(result);
    const badge = byId('nativeScanEvidenceBadge');
    if (badge) {
      badge.classList.toggle('partial', !complete);
      badge.textContent = complete ? text('full') : text('partial');
    }

    setText('nativeScanEvidenceTitle', text('title'));
    setText('nativeEvidenceFiles', number(result.reviewedFiles));
    setText('nativeEvidenceFilesLabel', text('files'));
    setText('nativeEvidenceFolders', number(result.directoriesVisited));
    setText('nativeEvidenceFoldersLabel', text('folders'));
    setText('nativeEvidenceRead', dataReadValue(result));
    setText('nativeEvidenceReadLabel', text('data'));
    setText('nativeEvidenceDuration', formatDuration(result.durationMs));
    setText('nativeEvidenceDurationLabel', text('duration'));
    setText('nativeEvidenceNote', modeNote(result));

    const hashed = number(result.hashedBytes);
    const issues = issueCount(result);
    setText('nativeEvidenceIssues', `${text('hashed')}: ${formatBytes(hashed)} · ${text('issues')}: ${issues}`);

    const coverage = byId('nativeCoverageFact');
    if (coverage) {
      coverage.textContent = complete ? 'FULL' : 'PARTIAL';
      coverage.style.color = complete ? '#1c806b' : '#94651c';
    }
  }

  function patchBuildLabels() {
    const state = parseJson(NATIVE.getNativeState?.(), {});
    const version = String(state.versionName || '0.19.1-alpha20').replace('-debug', '');
    const footer = document.querySelector('.app-footer__build');
    if (footer) footer.textContent = `v0.19.1 · B${BUILD}`;

    document.querySelectorAll('.native-pref-row b.slate,[data-open="about"] small').forEach((el) => {
      const value = String(el.textContent || '');
      if (/B1[89]\b/.test(value) || /0\.18\.0-alpha18/.test(value)) {
        if (el.matches('.native-pref-row b.slate')) el.textContent = `${version} · B${BUILD}`;
        else el.textContent = `Benedict Interactive · ${version} · B${BUILD}`;
      }
    });
  }

  function wrapNativeCallbacks() {
    const base = window.BearagnosticAndroid;
    if (!base || base.__scanTrustWrapped) return;

    window.BearagnosticAndroid = Object.freeze({
      __scanTrustWrapped: true,
      onNativeStateChanged(raw) {
        base.onNativeStateChanged?.(raw);
        setTimeout(patchBuildLabels, 0);
      },
      onScanProgress(raw) {
        base.onScanProgress?.(raw);
      },
      onScanComplete(raw) {
        const result = parseJson(raw, {});
        lastComplete = result;
        base.onScanComplete?.(raw);
        setTimeout(() => renderEvidence(result), 340);
      },
      onScanCancelled(raw) { base.onScanCancelled?.(raw); },
      onScanError(raw) { base.onScanError?.(raw); },
    });
  }

  ensureReadabilityStyle();
  wrapNativeCallbacks();

  document.addEventListener('DOMContentLoaded', () => {
    ensureReadabilityStyle();
    patchBuildLabels();
    wrapNativeCallbacks();
    setTimeout(patchBuildLabels, 80);
  }, { once: true });

  window.addEventListener('bearagnostic:languagechange', () => {
    ensureReadabilityStyle();
    patchBuildLabels();
    if (lastComplete) setTimeout(() => renderEvidence(lastComplete), 0);
  });
})();
