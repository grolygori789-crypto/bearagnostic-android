(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const BUILD = 24;
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
      types: 'File types reviewed', photo: 'Photos', video: 'Videos', audio: 'Audio', document: 'Documents', apk: 'APK', archive: 'Archives',
      quick: 'Quick checks metadata across accessible shared storage. Bearagnostic never adds fake waiting.',
      smart: 'Smart samples up to 256 KB from each readable non-empty file and verifies focused duplicate candidates.',
      deep: 'Deep streams every readable non-empty file. FULL is shown only when the expected bytes match the bytes actually read.',
      custom: 'Custom checks only the locations you selected and verifies exact duplicates only when that option is enabled.',
      truthTitle: 'Fast by design. Never padded.',
      truthBody: 'No artificial waiting: each mode finishes when its real work is complete. Results show what was actually checked.',
      whyTitle: 'Why did this finish so fast?', truthFooter: 'Time is not proof. The work actually performed is.',
      whyQuick: 'Quick scans metadata across accessible shared storage and intentionally skips content reads and duplicate hashing. Very short runtimes are normal.',
      whySmart: 'Smart reads a real bounded sample—up to 256 KB from each readable non-empty file—and hashes only relevant duplicate candidates. It keeps the promised scan depth without wasting time.',
      whyDeepFull: 'This Deep scan did not stop early. Its intended readable content completed and the read evidence matched. Storage speed and the number and layout of files can make a full scan finish much sooner than expected.',
      whyDeepPartial: 'This Deep scan finished quickly, but some intended work was not fully verified. The result remains PARTIAL; review the access/read evidence above.',
      whyCustom: 'Custom checks the locations you selected with metadata analysis and performs exact duplicate verification only when you enabled it. Runtime depends strongly on the scope you chose.',
    },
    th: {
      title: 'หลักฐานการสแกน', files: 'ไฟล์ที่ตรวจ', folders: 'โฟลเดอร์ที่ตรวจ',
      data: 'ข้อมูลที่อ่าน', duration: 'ระยะเวลา', coverage: 'ความครอบคลุม', hashed: 'ข้อมูลที่แฮช',
      full: 'ยืนยันครบ', partial: 'ไม่ครบ', metadata: 'ตรวจ Metadata', issues: 'ปัญหาการเข้าถึง/อ่าน',
      types: 'ประเภทไฟล์ที่ตรวจ', photo: 'รูปภาพ', video: 'วิดีโอ', audio: 'เสียง', document: 'เอกสาร', apk: 'APK', archive: 'ไฟล์บีบอัด',
      quick: 'Quick ตรวจ metadata ทั่ว shared storage ที่เข้าถึงได้ และไม่มีการหน่วงเวลาให้ดูนาน',
      smart: 'Smart อ่านตัวอย่างสูงสุด 256 KB ต่อไฟล์ที่อ่านได้ และยืนยันไฟล์ซ้ำในตำแหน่งสำคัญ',
      deep: 'Deep อ่านเนื้อหาไฟล์ที่เข้าถึงได้แบบ streaming จนครบ จะแสดงว่าครบเมื่อจำนวนไบต์ที่อ่านตรงกับที่คาดเท่านั้น',
      custom: 'Custom ตรวจเฉพาะตำแหน่งที่เลือก และยืนยันไฟล์ซ้ำแบบ exact เฉพาะเมื่อเปิดตัวเลือกนี้ไว้',
      truthTitle: 'เร็วเพราะออกแบบให้เร็ว ไม่ได้ตัดขั้นตอน',
      truthBody: 'ไม่มีเวลารอปลอม: แต่ละโหมดจบเมื่อการตรวจจริงเสร็จ และหน้าผลลัพธ์จะแสดงหลักฐานว่าได้ตรวจอะไรไปจริง',
      whyTitle: 'ทำไมสแกนครั้งนี้จบเร็ว?', truthFooter: 'เราไม่ใช้เวลาที่นานเป็นหลักฐาน — ใช้งานที่ตรวจจริงเป็นหลักฐาน',
      whyQuick: 'Quick ตรวจ metadata ทั่ว shared storage ที่เข้าถึงได้ โดยตั้งใจไม่อ่านเนื้อหาไฟล์และไม่ทำ duplicate hashing จึงสามารถจบได้เร็วมากเป็นปกติ',
      whySmart: 'Smart อ่านตัวอย่างจริงสูงสุด 256 KB จากทุกไฟล์ที่อ่านได้และไม่ว่าง แล้วแฮชเฉพาะไฟล์ที่เข้าเงื่อนไขตรวจซ้ำ จึงรักษาความละเอียดตามระดับที่สัญญาไว้โดยไม่เสียเวลาเกินจำเป็น',
      whyDeepFull: 'Deep ครั้งนี้ไม่ได้หยุดก่อนกำหนด ระบบอ่านเนื้อหาที่ตั้งใจตรวจจนครบและหลักฐานจำนวนไบต์ตรงกัน ความเร็วของหน่วยความจำและจำนวนหรือลักษณะไฟล์จึงอาจทำให้สแกนเต็มจบเร็วกว่าที่คาดมาก',
      whyDeepPartial: 'Deep ครั้งนี้จบเร็ว แต่มีงานบางส่วนที่ยังยืนยันไม่ครบ ระบบจึงแสดง PARTIAL ตามจริง ควรดูปัญหาการเข้าถึงหรืออ่านด้านบน',
      whyCustom: 'Custom ตรวจเฉพาะตำแหน่งที่คุณเลือกด้วย metadata และจะยืนยันไฟล์ซ้ำแบบ exact เฉพาะเมื่อเปิดตัวเลือกนี้ไว้ ระยะเวลาจึงขึ้นกับขอบเขตที่เลือก',
    },
    ja: {
      title: 'スキャンの証拠', files: '確認済みファイル', folders: '確認済みフォルダ',
      data: '読み取りデータ', duration: '所要時間', coverage: 'カバレッジ', hashed: 'ハッシュ対象',
      full: '検証済み', partial: '一部のみ', metadata: 'メタデータのみ', issues: 'アクセス/読み取り問題',
      types: '確認したファイル種類', photo: '写真', video: '動画', audio: '音声', document: '書類', apk: 'APK', archive: 'アーカイブ',
      quick: 'Quick はアクセス可能な共有ストレージ全体のメタデータを確認し、見せかけの待ち時間は追加しません。',
      smart: 'Smart は読み取り可能な各ファイルから最大 256 KB をサンプルし、重要な重複候補を検証します。',
      deep: 'Deep は読み取り可能な非空ファイルを最後までストリーム読み取りし、想定バイト数と実読取数が一致した場合のみ FULL とします。',
      custom: 'Custom は選択した場所だけを確認し、重複検証を有効にした場合のみ完全一致を検証します。',
      truthTitle: '速さは設計。待ち時間は足しません。',
      truthBody: '見せかけの待ち時間は追加しません。各モードは実作業が終わると完了し、結果画面で実際に行った処理を確認できます。',
      whyTitle: 'なぜこんなに早く終わった？', truthFooter: '時間ではなく、実際に行った作業を証拠にします。',
      whyQuick: 'Quick はアクセス可能な共有ストレージ全体のメタデータを確認し、内容の読み取りや重複ハッシュを行わないため、短時間で終わるのが正常です。',
      whySmart: 'Smart は読み取り可能な非空ファイルごとに最大 256 KB を実際に読み、必要な重複候補だけをハッシュします。約束した深さを保ちながら無駄な処理をしません。',
      whyDeepFull: 'この Deep は早期終了していません。対象となる読み取り可能な内容を完了し、実際の読み取りバイト数も一致しました。ストレージ速度やファイル数・構成によって、全読取でも予想より短時間で終わることがあります。',
      whyDeepPartial: 'この Deep は短時間で終了しましたが、一部の作業を完全には検証できませんでした。そのため結果は PARTIAL のままです。上のアクセス・読み取り証拠を確認してください。',
      whyCustom: 'Custom は選択した場所だけをメタデータで確認し、重複検証を有効にした場合のみ完全一致を検証します。所要時間は選択範囲に大きく左右されます。',
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
    if (mode === 'custom') return text('custom');
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
        .native-scan-evidence__types{margin-top:9px;padding-top:9px;border-top:1px solid rgba(76,113,146,.08)}.native-scan-evidence__types>strong{display:block;font-size:10.5px;color:#38536b;margin-bottom:6px}.native-scan-evidence__typechips{display:flex;flex-wrap:wrap;gap:5px}.native-scan-evidence__typechip{display:inline-flex;align-items:center;gap:4px;padding:4px 7px;border-radius:99px;background:rgba(255,255,255,.82);border:1px solid rgba(76,113,146,.08);font-size:9.5px;color:#526b80}.native-scan-evidence__typechip b{font-size:10px;color:#183a55;font-variant-numeric:tabular-nums}
        .native-scan-speed-details{margin-top:9px;padding-top:9px;border-top:1px solid rgba(76,113,146,.08)}.native-scan-speed-details summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer;color:#176f9f;font-size:10.5px;font-weight:780;line-height:1.35;user-select:none}.native-scan-speed-details summary::-webkit-details-marker{display:none}.native-scan-speed-details__plus{width:22px;height:22px;display:grid;place-items:center;flex:0 0 auto;border-radius:8px;background:rgba(255,255,255,.84);border:1px solid rgba(71,119,152,.09);font-size:15px;font-weight:500;transition:transform .16s ease}.native-scan-speed-details[open] .native-scan-speed-details__plus{transform:rotate(45deg)}.native-scan-speed-details__body{margin:8px 0 0;padding:9px 10px;border-radius:13px;background:rgba(255,255,255,.68);font-size:10.5px;line-height:1.5;color:#4f667a}.native-scan-speed-details__footer{display:block;margin-top:6px;font-size:9.5px;font-weight:760;color:#688093}
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
        <div class="native-scan-evidence__issues" id="nativeEvidenceIssues"></div>
        <details class="native-scan-speed-details" id="nativeScanSpeedDetails"><summary><span id="nativeScanSpeedTitle"></span><span class="native-scan-speed-details__plus" aria-hidden="true">+</span></summary><p class="native-scan-speed-details__body" id="nativeScanSpeedBody"></p><small class="native-scan-speed-details__footer" id="nativeScanSpeedFooter"></small></details>
        <div class="native-scan-evidence__types" id="nativeEvidenceTypes"><strong id="nativeEvidenceTypesTitle"></strong><div class="native-scan-evidence__typechips" id="nativeEvidenceTypeChips"></div></div>`;
      hero.insertAdjacentElement('afterend', card);
    }
    return card;
  }

  function refreshModeTrustGuide() {
    const guide = byId('nativeModeGuide');
    if (!guide) return;
    const title = guide.querySelector('strong');
    const body = guide.querySelector('small');
    if (title) title.textContent = text('truthTitle');
    if (body) body.textContent = text('truthBody');
    guide.dataset.scanTruth = '1';
  }

  function speedExplanation(result, complete) {
    const mode = String(result?.scanMode || '').toLowerCase();
    if (mode === 'deep') return text(complete ? 'whyDeepFull' : 'whyDeepPartial');
    if (mode === 'smart') return text('whySmart');
    if (mode === 'custom') return text('whyCustom');
    return text('whyQuick');
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

    setText('nativeScanSpeedTitle', text('whyTitle'));
    setText('nativeScanSpeedBody', speedExplanation(result, complete));
    setText('nativeScanSpeedFooter', text('truthFooter'));

    const typeEntries = [
      ['photo', number(result.imageFiles)], ['video', number(result.videoFiles)],
      ['audio', number(result.audioFiles)], ['document', number(result.documentFiles)],
      ['apk', number(result.apkInstallerFiles)], ['archive', number(result.archiveFiles)],
    ].filter(([, count]) => count > 0);
    const types = byId('nativeEvidenceTypes');
    if (types) types.hidden = typeEntries.length === 0;
    setText('nativeEvidenceTypesTitle', text('types'));
    const chips = byId('nativeEvidenceTypeChips');
    if (chips) chips.innerHTML = typeEntries.map(([key,count]) => `<span class="native-scan-evidence__typechip">${text(key)} <b>${count}</b></span>`).join('');

    const coverage = byId('nativeCoverageFact');
    if (coverage) {
      coverage.textContent = complete ? 'FULL' : 'PARTIAL';
      coverage.style.color = complete ? '#1c806b' : '#94651c';
    }
  }

  function patchBuildLabels() {
    const state = parseJson(NATIVE.getNativeState?.(), {});
    const version = String(state.versionName || '0.20.3-alpha24').replace('-debug', '');
    const footer = document.querySelector('.app-footer__build');
    if (footer) footer.textContent = `v0.20.3 · B${BUILD}`;

    document.querySelectorAll('.native-pref-row b.slate,[data-open="about"] small').forEach((el) => {
      const value = String(el.textContent || '');
      if (/B(?:18|19|20|21|22)\b/.test(value) || /0\.(?:18|19|20)\.[^ ]*/.test(value)) {
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
        setTimeout(() => { patchBuildLabels(); refreshModeTrustGuide(); }, 0);
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
    refreshModeTrustGuide();
    wrapNativeCallbacks();
    setTimeout(() => { patchBuildLabels(); refreshModeTrustGuide(); }, 80);
  }, { once: true });

  window.addEventListener('bearagnostic:languagechange', () => {
    ensureReadabilityStyle();
    patchBuildLabels();
    refreshModeTrustGuide();
    if (lastComplete) setTimeout(() => renderEvidence(lastComplete), 0);
  });
})();
