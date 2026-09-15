(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const BUILD = 40;
  const PAGE_SIZE = 250;
  const RENDER_BATCH = 80;
  const MAX_SELECTION = 100;
  const STALE_MS = 15 * 60 * 1000;
  const POLL_MS = 350;

  const byId = (id) => document.getElementById(id);
  const parse = (value, fallback = {}) => {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  };
  const n = (value) => Math.max(0, Number(value) || 0);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const language = () => {
    const lang = (document.documentElement.lang || 'en').toLowerCase();
    return lang.startsWith('th') ? 'th' : lang.startsWith('ja') ? 'ja' : 'en';
  };

  const COPY = {
    en: {
      title:'Empty Folders', sub:'Review unused empty folders', kicker:'EMPTY FOLDERS',
      hero:'Review empty folders without guessing.',
      lead:'An empty folder uses almost no meaningful storage, and some apps create empty folders intentionally. Bearagnostic never treats empty as junk.',
      source:'SOURCE', sourceValue:'Live folder check', coverage:'COVERAGE', coverageValue:'Accessible storage', safety:'SAFETY', safetyValue:'Review first',
      accessTitle:'Storage access is needed', accessBody:'Android must allow shared-storage access before Bearagnostic can review empty folders.', permission:'Open Android settings',
      startTitle:'Check empty folders', startBody:'This performs a dedicated local folder check. It does not delete anything.', start:'Scan empty folders',
      runningTitle:'Checking empty folders', runningBody:'Bearagnostic is walking accessible folders locally. No fake delay or cosmetic progress is added.', checkedFolders:'folders checked',
      emptyTitle:'No removable empty folders surfaced', emptyBody:'Protected, hidden, top-level, Android system, and non-empty folders are not offered for deletion.', refresh:'Check again',
      folders:'Empty folders', protected:'Protected empty', checked:'Checked', justNow:'just now', minAgo:'min ago',
      cautionTitle:'Empty does not mean disposable', cautionBody:'Apps may recreate or expect placeholder folders. Nothing is selected automatically, and protected/system locations stay out of this list.',
      verifyTitle:'Rechecked at deletion time', verifyBody:'Every selected folder must still be empty immediately before deletion. If a file appears, Bearagnostic refuses to remove that folder.',
      partialTitle:'Review list is partial', partialBody:'The dedicated folder snapshot reached its detail limit. Only folders represented here can be selected.',
      sortName:'Name A–Z', sortNewest:'Newest first', sortOldest:'Oldest first', sortLocation:'Location A–Z',
      choose:'Choose only folders you recognize and no longer need', showing:'Showing {shown} of {total}', dateUnknown:'Date unavailable',
      selected:'{count} selected', clear:'Clear', review:'Review selected', limit:'Up to 100 folders can be removed in one verified batch.', limitReached:'The 100-folder safety limit has been reached.',
      staleTitle:'Check again before deleting', staleBody:'This folder snapshot is more than 15 minutes old.',
      finalKicker:'FINAL REVIEW', finalTitle:'Remove the selected empty folders?',
      finalBody:'Bearagnostic will permanently remove only the selected folders that are still empty and still pass the native safety checks.',
      noSpace:'No reclaimed-space estimate is shown because empty folders normally use negligible storage.',
      back:'Back', deleteVerify:'Delete & verify', deleting:'Rechecking and deleting…',
      resultKicker:'VERIFIED CLEANUP', resultTitle:'Empty-folder review complete', removed:'folders removed', changed:'became non-empty', notRemoved:'not removed',
      resultBody:'Only folders Android confirmed as gone are counted as removed. No storage-savings claim is added.', remaining:'Review remaining', done:'Done',
      errorTitle:'Empty-folder review could not continue', retry:'Try again', busy:'Another storage check is running. Finish it before scanning empty folders.',
      noFilter:'No folders to show.'
    },
    th: {
      title:'โฟลเดอร์ว่าง', sub:'ตรวจโฟลเดอร์ว่างก่อนลบ', kicker:'โฟลเดอร์ว่าง',
      hero:'ดูโฟลเดอร์ว่างให้ชัดก่อนตัดสินใจลบ',
      lead:'โฟลเดอร์ว่างแทบไม่คืนพื้นที่ที่มีนัยสำคัญ และบางแอปสร้างโฟลเดอร์ว่างไว้โดยตั้งใจ Bearagnostic จึงไม่ถือว่า “ว่าง” เท่ากับ “ขยะ”',
      source:'แหล่งข้อมูล', sourceValue:'ตรวจโฟลเดอร์สด', coverage:'ขอบเขต', coverageValue:'พื้นที่ที่เข้าถึงได้', safety:'ความปลอดภัย', safetyValue:'ตรวจดูก่อน',
      accessTitle:'ต้องอนุญาตการเข้าถึงพื้นที่จัดเก็บ', accessBody:'Android ต้องอนุญาต shared storage ก่อนที่ Bearagnostic จะตรวจโฟลเดอร์ว่างได้', permission:'เปิดการตั้งค่า Android',
      startTitle:'ตรวจหาโฟลเดอร์ว่าง', startBody:'เป็นการตรวจโฟลเดอร์ภายในเครื่องโดยเฉพาะ และจะไม่ลบอะไร', start:'ตรวจโฟลเดอร์ว่าง',
      runningTitle:'กำลังตรวจโฟลเดอร์ว่าง', runningBody:'Bearagnostic กำลังเดินตรวจโฟลเดอร์ที่เข้าถึงได้จริง ไม่มีการหน่วงเวลาหรือสร้าง progress ปลอม', checkedFolders:'โฟลเดอร์ที่ตรวจแล้ว',
      emptyTitle:'ไม่พบโฟลเดอร์ว่างที่เหมาะให้ตรวจลบ', emptyBody:'โฟลเดอร์ระบบ โฟลเดอร์ซ่อน โฟลเดอร์ระดับบน และโฟลเดอร์ที่ไม่ว่างจะไม่ถูกเสนอให้ลบ', refresh:'ตรวจอีกครั้ง',
      folders:'โฟลเดอร์ว่าง', protected:'โฟลเดอร์ว่างที่ป้องกัน', checked:'ตรวจเมื่อ', justNow:'เมื่อสักครู่', minAgo:'นาทีที่แล้ว',
      cautionTitle:'ว่างไม่ได้แปลว่าควรลบ', cautionBody:'บางแอปอาจสร้างหรือคาดหวัง placeholder folder ไว้ ระบบจะไม่เลือกให้อัตโนมัติ และจะไม่แสดงตำแหน่งระบบ/ที่ป้องกันไว้',
      verifyTitle:'ตรวจซ้ำตอนลบจริง', verifyBody:'ทุกโฟลเดอร์ต้องยังว่างอยู่ทันทีตอนลบ ถ้ามีไฟล์เกิดขึ้นภายหลัง Bearagnostic จะปฏิเสธการลบโฟลเดอร์นั้น',
      partialTitle:'รายการตรวจแสดงได้ไม่ครบทั้งหมด', partialBody:'snapshot การตรวจโฟลเดอร์ถึงขีดจำกัดรายละเอียด เลือกได้เฉพาะโฟลเดอร์ที่อยู่ในรายการนี้',
      sortName:'ชื่อ A–Z', sortNewest:'ใหม่สุดก่อน', sortOldest:'เก่าสุดก่อน', sortLocation:'ตำแหน่ง A–Z',
      choose:'เลือกเฉพาะโฟลเดอร์ที่รู้จักและไม่ต้องการแล้ว', showing:'แสดง {shown} จาก {total}', dateUnknown:'ไม่มีข้อมูลวันที่',
      selected:'เลือก {count} โฟลเดอร์', clear:'ล้างที่เลือก', review:'ตรวจรายการที่เลือก', limit:'ลบได้สูงสุด 100 โฟลเดอร์ต่อหนึ่ง batch ที่มีการตรวจยืนยัน', limitReached:'เลือกครบขีดจำกัดความปลอดภัย 100 โฟลเดอร์แล้ว',
      staleTitle:'ตรวจใหม่ก่อนลบ', staleBody:'snapshot โฟลเดอร์นี้เก่ากว่า 15 นาทีแล้ว',
      finalKicker:'ตรวจครั้งสุดท้าย', finalTitle:'ลบโฟลเดอร์ว่างที่เลือกหรือไม่',
      finalBody:'Bearagnostic จะลบถาวรเฉพาะโฟลเดอร์ที่เลือก ซึ่งยังว่างจริงและผ่านเงื่อนไขความปลอดภัย Native อีกครั้ง',
      noSpace:'ไม่แสดงพื้นที่ที่คาดว่าจะคืนได้ เพราะโฟลเดอร์ว่างโดยทั่วไปใช้พื้นที่น้อยมากจนไม่มีนัยสำคัญ',
      back:'ย้อนกลับ', deleteVerify:'ลบและตรวจยืนยัน', deleting:'กำลังตรวจซ้ำและลบ…',
      resultKicker:'ยืนยันผลแล้ว', resultTitle:'ตรวจโฟลเดอร์ว่างเรียบร้อย', removed:'โฟลเดอร์ที่ลบแล้ว', changed:'มีข้อมูลเพิ่มภายหลัง', notRemoved:'ไม่ได้ลบ',
      resultBody:'นับเฉพาะโฟลเดอร์ที่ Android ยืนยันว่าหายไปแล้วเท่านั้น และไม่มีการอ้างพื้นที่คืนเกินจริง', remaining:'ตรวจรายการที่เหลือ', done:'เสร็จสิ้น',
      errorTitle:'ไม่สามารถดำเนินการตรวจโฟลเดอร์ว่างต่อได้', retry:'ลองอีกครั้ง', busy:'มีการตรวจพื้นที่อื่นกำลังทำงานอยู่ กรุณารอให้เสร็จก่อน',
      noFilter:'ไม่มีโฟลเดอร์ให้แสดง'
    },
    ja: {
      title:'空フォルダー', sub:'空フォルダーを確認', kicker:'空フォルダー',
      hero:'空だからと決めつけず、削除前に確認。',
      lead:'空フォルダーが使う容量は通常ごくわずかで、アプリが意図的に作ることもあります。Bearagnostic は「空＝不要」と判断しません。',
      source:'ソース', sourceValue:'ライブフォルダーチェック', coverage:'範囲', coverageValue:'アクセス可能な領域', safety:'安全性', safetyValue:'要確認',
      accessTitle:'ストレージへのアクセスが必要です', accessBody:'空フォルダーを確認するには Android の共有ストレージアクセスが必要です。', permission:'Android 設定を開く',
      startTitle:'空フォルダーを確認', startBody:'端末内でフォルダーだけを確認します。削除は行いません。', start:'空フォルダーをスキャン',
      runningTitle:'空フォルダーを確認中', runningBody:'アクセス可能なフォルダーを実際に確認しています。偽の待ち時間や進捗は追加しません。', checkedFolders:'確認済みフォルダー',
      emptyTitle:'削除候補の空フォルダーはありません', emptyBody:'保護・非表示・最上位・Android システム・空でないフォルダーは削除候補にしません。', refresh:'もう一度確認',
      folders:'空フォルダー', protected:'保護された空フォルダー', checked:'確認', justNow:'たった今', minAgo:'分前',
      cautionTitle:'空でも不要とは限りません', cautionBody:'アプリがプレースホルダーとして必要とする場合があります。自動選択せず、保護領域は一覧に出しません。',
      verifyTitle:'削除直前に再確認', verifyBody:'削除直前にも空であることを確認します。ファイルが追加されていれば削除を拒否します。',
      partialTitle:'一覧は一部のみです', partialBody:'フォルダー snapshot の詳細上限に達しました。この一覧にあるものだけ選択できます。',
      sortName:'名前 A–Z', sortNewest:'新しい順', sortOldest:'古い順', sortLocation:'場所 A–Z',
      choose:'内容を把握し、不要だと判断したフォルダーだけを選択してください', showing:'{total} 件中 {shown} 件', dateUnknown:'日付情報なし',
      selected:'{count} 件選択', clear:'選択解除', review:'選択内容を確認', limit:'1 回の検証済みバッチで最大 100 フォルダーです。', limitReached:'100 フォルダーの安全上限に達しました。',
      staleTitle:'削除前に再確認', staleBody:'このフォルダー snapshot は 15 分以上前のものです。',
      finalKicker:'最終確認', finalTitle:'選択した空フォルダーを削除しますか？',
      finalBody:'選択したフォルダーのうち、削除直前にも空で Native の安全条件を満たすものだけを完全に削除します。',
      noSpace:'空フォルダーの容量は通常ごくわずかなため、回収容量の見積もりは表示しません。',
      back:'戻る', deleteVerify:'削除して確認', deleting:'再確認して削除中…',
      resultKicker:'検証済み', resultTitle:'空フォルダーの確認が完了しました', removed:'削除済み', changed:'空でなくなった', notRemoved:'未削除',
      resultBody:'Android が消えたと確認したフォルダーだけを削除件数に数え、容量節約の誇張はしません。', remaining:'残りを確認', done:'完了',
      errorTitle:'空フォルダーの確認を続行できません', retry:'再試行', busy:'別のストレージチェックが実行中です。完了してから再試行してください。',
      noFilter:'表示するフォルダーはありません'
    }
  };
  const c = () => COPY[language()] || COPY.en;

  const ICONS = {
    folder:'<path d="M3.5 7h6l2-2H20a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V8A1 1 0 0 1 3.5 7Z"/><path d="M8 13h8"/>',
    shield:'<path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6Z"/><path d="m9 12 2 2 4-4"/>',
    refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>',
    warning:'<path d="M12 4 21 20H3Z"/><path d="M12 9v5M12 17h.01"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.folder}</svg>`;
  function badge(header = false) {
    return `<span class="ba-empty-badge${header ? ' ba-empty-badge--header' : ''}" aria-hidden="true"><i></i>${icon('folder')}</span>`;
  }

  const state = {
    open:false, native:null, summary:null, items:[], selected:new Set(), sort:'location', renderLimit:RENDER_BATCH,
    view:'results', error:'', message:'', result:null, poll:null, token:0
  };

  function ageLabel(ms) {
    if (!n(ms)) return c().dateUnknown;
    try {
      const locale = language()==='th'?'th-TH':language()==='ja'?'ja-JP':'en-US';
      return new Intl.DateTimeFormat(locale,{year:'numeric',month:'short',day:'numeric'}).format(new Date(n(ms)));
    } catch (_) { return c().dateUnknown; }
  }
  function checkedLabel(ms) {
    if (!n(ms)) return '—';
    const minutes = Math.max(0, Math.floor((Date.now() - n(ms)) / 60000));
    return minutes < 1 ? c().justNow : `${minutes} ${c().minAgo}`;
  }
  function fresh() {
    const at = n(state.summary?.generatedAtMs);
    return at > 0 && Date.now() >= at && Date.now() - at <= STALE_MS;
  }
  function sortedItems() {
    return state.items.slice().sort((a,b) => {
      if (state.sort === 'newest') return n(b.modifiedMs)-n(a.modifiedMs);
      if (state.sort === 'oldest') return n(a.modifiedMs)-n(b.modifiedMs);
      if (state.sort === 'name') return String(a.name||'').localeCompare(String(b.name||''),undefined,{sensitivity:'base'});
      return `${a.location||''}/${a.name||''}`.localeCompare(`${b.location||''}/${b.name||''}`,undefined,{sensitivity:'base'});
    });
  }
  function selectedItems() { return state.items.filter((item) => state.selected.has(item.id)); }

  function ensureStyle() {
    if (byId('androidEmptyFoldersStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidEmptyFoldersStyle';
    style.textContent = `
      body.ba-empty-open{overflow:hidden!important}
      .ba-empty-entry{--tone:104,132,155!important}.ba-empty-entry .mini-icon{background:transparent!important;border:0!important;box-shadow:none!important;padding:0;display:grid;place-items:center}
      .ba-empty-badge{width:38px;height:38px;border-radius:13px;position:relative;display:grid;place-items:center;background:linear-gradient(180deg,#f6fbff,#dce9f3 25%,#acc4d7 63%,#7f9db7);border:1px solid rgba(210,225,236,.95);box-shadow:0 8px 18px rgba(73,103,127,.16),inset 0 1px rgba(255,255,255,.95);overflow:hidden}.ba-empty-badge i{position:absolute;inset:3px 4px auto;height:12px;border-radius:8px;background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(255,255,255,.05))}.ba-empty-badge svg{position:relative;width:19px;height:19px;fill:none;stroke:#5f7e98;stroke-width:1.85;stroke-linecap:round;stroke-linejoin:round}.ba-empty-badge--header{width:25px;height:25px;border-radius:9px}.ba-empty-badge--header svg{width:13px;height:13px}
      .ba-empty-surface{position:fixed;z-index:128;inset:0;background:linear-gradient(180deg,#f8fbfd,#f2f7fb);color:#2b4052;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);font-family:inherit}.ba-empty-surface[hidden]{display:none!important}
      .ba-empty-head{min-height:60px;padding:10px 15px;display:grid;grid-template-columns:42px minmax(0,1fr) 42px;align-items:center;gap:8px;background:rgba(251,253,255,.97);border-bottom:1px solid rgba(70,105,130,.08)}.ba-empty-head__icon,.ba-empty-close{width:40px;height:40px;border-radius:14px;border:1px solid rgba(63,104,134,.09);background:#fff;display:grid;place-items:center;box-shadow:0 5px 16px rgba(54,83,108,.06)}.ba-empty-close{font-size:24px;color:#637789}.ba-empty-head__copy{text-align:center;min-width:0}.ba-empty-head__copy strong{display:block;font-size:14px;color:#2c4052}.ba-empty-head__copy small{display:block;margin-top:2px;font-size:10px;color:#81909d;letter-spacing:.04em}
      .ba-empty-scroll{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:18px 15px 112px}.ba-empty-wrap{max-width:720px;margin:0 auto}.ba-empty-kicker{font-size:10px;font-weight:820;letter-spacing:.14em;color:#6d8498;text-transform:uppercase}.ba-empty-title{margin:6px 0 7px;font-size:24px;line-height:1.16;letter-spacing:-.025em;color:#243a4c;font-weight:760}.ba-empty-lead{margin:0;color:#687e90;font-size:12.5px;line-height:1.55}
      .ba-empty-triad{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:15px 0 12px}.ba-empty-chip{padding:9px;border-radius:14px;background:#fff;border:1px solid rgba(70,113,145,.08);box-shadow:0 5px 16px rgba(57,90,116,.04)}.ba-empty-chip small{display:block;font-size:8.5px;font-weight:820;letter-spacing:.10em;color:#8b9aa7}.ba-empty-chip strong{display:block;margin-top:3px;font-size:10.5px;line-height:1.24;color:#455e71;min-height:2.48em}
      .ba-empty-state{padding:30px 18px;margin-top:16px;border-radius:23px;background:#fff;border:1px solid rgba(67,108,139,.07);text-align:center;box-shadow:0 10px 28px rgba(52,84,108,.045)}.ba-empty-state__icon{width:56px;height:56px;border-radius:19px;margin:0 auto 13px;background:linear-gradient(145deg,#f1f7fb,#e2edf5);color:#66849c;display:grid;place-items:center}.ba-empty-state__icon svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ba-empty-state h3{margin:0;font-size:17px;color:#314a5d}.ba-empty-state p{max-width:530px;margin:8px auto 0;font-size:11.5px;line-height:1.55;color:#788b9a}.ba-empty-spinner{width:35px;height:35px;margin:0 auto 13px;border-radius:50%;border:3px solid #e8f0f6;border-top-color:#708da7;animation:baEmptySpin .8s linear infinite}.ba-empty-live{margin-top:11px;font-size:10.5px;color:#70889d;font-variant-numeric:tabular-nums}
      .ba-empty-primary,.ba-empty-secondary{min-height:44px;border-radius:14px;padding:0 16px;font:inherit;font-size:11.5px;font-weight:760}.ba-empty-primary{background:linear-gradient(135deg,#7f9eb8,#647f99);color:#fff;box-shadow:0 8px 20px rgba(79,105,129,.16)}.ba-empty-primary:disabled{opacity:.45;box-shadow:none}.ba-empty-secondary{background:#fff;color:#557084;border:1px solid rgba(69,111,143,.12)}.ba-empty-actions{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:15px}
      .ba-empty-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:13px 0}.ba-empty-stat{padding:10px 8px;border-radius:15px;background:#fff;border:1px solid rgba(66,107,137,.07);min-width:0}.ba-empty-stat b{display:block;font-size:13px;color:#36546b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-empty-stat span{display:block;margin-top:3px;font-size:9px;color:#8796a3}
      .ba-empty-notice{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;padding:11px 12px;margin:10px 0;border-radius:17px;background:linear-gradient(135deg,#f3f8fb,#fbfdff);border:1px solid rgba(93,127,154,.10)}.ba-empty-notice--warn{background:linear-gradient(135deg,#fff9ef,#fffdf9);border-color:rgba(194,145,75,.12)}.ba-empty-notice__icon{width:34px;height:34px;border-radius:12px;background:#eaf3f8;color:#66849b;display:grid;place-items:center}.ba-empty-notice--warn .ba-empty-notice__icon{background:#fff4df;color:#9c753e}.ba-empty-notice__icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ba-empty-notice strong{display:block;font-size:11.8px;color:#4b5d6d}.ba-empty-notice small{display:block;margin-top:3px;font-size:10.7px;line-height:1.48;color:#7a8792}
      .ba-empty-controls{display:flex;justify-content:flex-end;margin:13px 0 8px}.ba-empty-select{height:40px;min-width:150px;border-radius:13px;border:1px solid rgba(69,111,143,.10);background:#fff;color:#465f73;padding:0 30px 0 11px;font:inherit;font-size:11px;font-weight:680}.ba-empty-sectionhead{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;margin:10px 1px 8px}.ba-empty-sectionhead strong{font-size:12.5px;color:#40586b}.ba-empty-sectionhead small{font-size:10px;color:#8997a3;white-space:nowrap}
      .ba-empty-list{display:grid;gap:7px}.ba-empty-row{display:grid;grid-template-columns:24px 42px minmax(0,1fr) auto;gap:9px;align-items:center;min-height:68px;padding:9px 10px;border-radius:17px;background:#fff;border:1px solid rgba(70,111,142,.075);box-shadow:0 5px 18px rgba(52,86,111,.035)}.ba-empty-row.is-selected{border-color:rgba(98,130,155,.25);box-shadow:0 7px 20px rgba(70,100,124,.08)}.ba-empty-row input{width:19px;height:19px;accent-color:#6a879f}.ba-empty-row__icon{width:42px;height:42px;border-radius:13px;background:linear-gradient(145deg,#f4f9fc,#e7f0f6);color:#67869e;display:grid;place-items:center}.ba-empty-row__icon svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ba-empty-row__copy{min-width:0}.ba-empty-row__copy strong{display:block;font-size:11.7px;color:#354b5c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-empty-row__copy small{display:block;margin-top:4px;font-size:9.7px;color:#8795a1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-empty-row__meta{text-align:right;min-width:82px}.ba-empty-row__meta b{display:block;font-size:9px;color:#718597;text-transform:uppercase;letter-spacing:.06em}.ba-empty-row__meta small{display:block;margin-top:4px;font-size:9px;color:#939faa;white-space:nowrap}
      .ba-empty-selection{position:fixed;z-index:130;left:0;right:0;bottom:0;padding:9px 14px calc(9px + env(safe-area-inset-bottom));background:rgba(249,252,254,.97);border-top:1px solid rgba(63,104,134,.09);backdrop-filter:blur(18px)}.ba-empty-selection__inner{max-width:720px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center}.ba-empty-selection strong{display:block;font-size:11.7px;color:#40596c}.ba-empty-selection small{display:block;margin-top:2px;font-size:9.3px;color:#8a98a4}.ba-empty-confirm-list{display:grid;gap:6px;margin:13px 0}.ba-empty-confirm-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;padding:9px 11px;border-radius:13px;background:#f8fbfd;border:1px solid rgba(68,108,139,.06)}.ba-empty-confirm-item strong{font-size:10.8px;color:#455d70;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-empty-confirm-item span{font-size:9.5px;color:#778a99}.ba-empty-result-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:16px 0}.ba-empty-result-card{padding:12px 8px;border-radius:16px;background:#f7fbfd;border:1px solid rgba(65,111,143,.07)}.ba-empty-result-card b{display:block;font-size:15px;color:#365f78}.ba-empty-result-card span{display:block;margin-top:3px;font-size:9.5px;line-height:1.3;color:#7f909e}
      @keyframes baEmptySpin{to{transform:rotate(360deg)}}
      @media(max-width:390px){.ba-empty-scroll{padding-left:12px;padding-right:12px}.ba-empty-title{font-size:21px}.ba-empty-row{grid-template-columns:22px 38px minmax(0,1fr)}.ba-empty-row__icon{width:38px;height:38px}.ba-empty-row__meta{grid-column:3;text-align:left;display:flex;gap:8px;align-items:center}.ba-empty-row__meta small{margin-top:0}.ba-empty-selection__inner{grid-template-columns:minmax(0,1fr) auto}.ba-empty-selection .ba-empty-secondary{display:none}}
      @media(prefers-reduced-motion:reduce){.ba-empty-spinner{animation:none!important}}
    `;
    document.head.appendChild(style);
  }

  function ensureEntry() {
    const tools = byId('toolsScreen');
    if (tools) tools.classList.add('ba-tools-expandable');
    const list = document.querySelector('#toolsScreen .utility-list');
    if (!list) return null;
    let entry = list.querySelector('[data-tool="empty-folders"]');
    if (!entry) {
      entry = document.createElement('button');
      entry.type = 'button'; entry.dataset.tool = 'empty-folders'; entry.className = 'ba-empty-entry';
      list.appendChild(entry);
    }
    const anchor = list.querySelector('[data-tool="zero"]') || list.querySelector('[data-tool="archives"]');
    if (anchor && anchor.nextElementSibling !== entry) anchor.insertAdjacentElement('afterend', entry);
    updateEntry(entry);
    return entry;
  }
  function updateEntry(entry = document.querySelector('#toolsScreen [data-tool="empty-folders"]')) {
    if (!entry) return;
    const summary = parse(NATIVE.getEmptyFolderSummary?.(), {});
    const status = summary.available ? `${n(summary.candidateCount)} ${c().folders}` : c().sub;
    const signature = `${language()}|${status}`;
    if (entry.dataset.emptySignature === signature) return;
    entry.dataset.emptySignature = signature;
    entry.innerHTML = `<span class="mini-icon">${badge()}</span><span><strong>${esc(c().title)}</strong><small>${esc(status)}</small></span><b>›</b>`;
    entry.setAttribute('aria-label', `${c().title}. ${status}`);
  }

  function ensureSurface() {
    ensureStyle();
    let surface = byId('baEmptySurface');
    if (surface) return surface;
    surface = document.createElement('section');
    surface.id = 'baEmptySurface'; surface.className = 'ba-empty-surface'; surface.hidden = true;
    surface.setAttribute('role','dialog'); surface.setAttribute('aria-modal','true'); surface.setAttribute('aria-labelledby','baEmptySurfaceTitle');
    surface.innerHTML = `<header class="ba-empty-head"><span class="ba-empty-head__icon">${badge(true)}</span><div class="ba-empty-head__copy"><strong id="baEmptySurfaceTitle"></strong><small>BEARAGNOSTIC · LOCAL REVIEW</small></div><button class="ba-empty-close" type="button" data-empty-action="close" aria-label="Close">×</button></header><div class="ba-empty-scroll"><div class="ba-empty-wrap" id="baEmptyContent"></div></div><div id="baEmptySelection"></div>`;
    document.body.appendChild(surface);
    bind(surface);
    return surface;
  }

  const intro = () => `<div class="ba-empty-kicker">${esc(c().kicker)}</div><h2 class="ba-empty-title">${esc(c().hero)}</h2><p class="ba-empty-lead">${esc(c().lead)}</p>`;
  const triad = () => `<div class="ba-empty-triad"><div class="ba-empty-chip"><small>${esc(c().source)}</small><strong>${esc(c().sourceValue)}</strong></div><div class="ba-empty-chip"><small>${esc(c().coverage)}</small><strong>${esc(c().coverageValue)}</strong></div><div class="ba-empty-chip"><small>${esc(c().safety)}</small><strong>${esc(c().safetyValue)}</strong></div></div>`;
  const stateCard = (iconName,title,body,actions='') => `<div class="ba-empty-state"><span class="ba-empty-state__icon">${icon(iconName)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p>${actions?`<div class="ba-empty-actions">${actions}</div>`:''}</div>`;

  function renderStart() {
    if (!state.native?.broadStorageAccess) return `${intro()}${stateCard('shield',c().accessTitle,c().accessBody,`<button class="ba-empty-primary" data-empty-action="permission" type="button">${esc(c().permission)}</button>`)}`;
    return `${intro()}${triad()}${stateCard('folder',c().startTitle,c().startBody,`<button class="ba-empty-primary" data-empty-action="scan" type="button">${esc(c().start)}</button>`)}`;
  }
  function renderRunning() {
    return `${intro()}${triad()}<div class="ba-empty-state"><div class="ba-empty-spinner" aria-hidden="true"></div><h3>${esc(c().runningTitle)}</h3><p>${esc(c().runningBody)}</p><div class="ba-empty-live">${n(state.summary?.visitedFolders)} ${esc(c().checkedFolders)}</div></div>`;
  }
  function renderEmpty() {
    return `${intro()}${triad()}${stateCard('folder',c().emptyTitle,c().emptyBody,`<button class="ba-empty-secondary" data-empty-action="scan" type="button">${esc(c().refresh)}</button>`)}`;
  }
  function renderError() {
    return `${intro()}${stateCard('warning',c().errorTitle,state.error || c().busy,`<button class="ba-empty-primary" data-empty-action="retry" type="button">${esc(c().retry)}</button>`)}`;
  }
  function renderResults() {
    const items = sortedItems();
    const visible = items.slice(0,state.renderLimit);
    const stale = !fresh();
    const rows = visible.length ? visible.map((item) => {
      const checked = state.selected.has(item.id);
      return `<label class="ba-empty-row${checked?' is-selected':''}"><input type="checkbox" data-empty-id="${esc(item.id)}"${checked?' checked':''}><span class="ba-empty-row__icon">${icon('folder')}</span><span class="ba-empty-row__copy"><strong>${esc(item.name||'(unnamed folder)')}</strong><small>${esc(item.location||'Shared storage')}</small></span><span class="ba-empty-row__meta"><b>EMPTY</b><small>${esc(ageLabel(item.modifiedMs))}</small></span></label>`;
    }).join('') : `<div class="ba-empty-state"><h3>${esc(c().noFilter)}</h3></div>`;
    return `${intro()}${triad()}<div class="ba-empty-stats"><div class="ba-empty-stat"><b>${n(state.summary?.candidateCount)}</b><span>${esc(c().folders)}</span></div><div class="ba-empty-stat"><b>${n(state.summary?.protectedEmptyFolders)}</b><span>${esc(c().protected)}</span></div><div class="ba-empty-stat"><b>${esc(checkedLabel(state.summary?.generatedAtMs))}</b><span>${esc(c().checked)}</span></div></div><div class="ba-empty-notice ba-empty-notice--warn"><span class="ba-empty-notice__icon">${icon('warning')}</span><div><strong>${esc(c().cautionTitle)}</strong><small>${esc(c().cautionBody)}</small></div></div><div class="ba-empty-notice"><span class="ba-empty-notice__icon">${icon('shield')}</span><div><strong>${esc(c().verifyTitle)}</strong><small>${esc(c().verifyBody)}</small></div></div>${state.summary?.detailsTruncated?`<div class="ba-empty-notice ba-empty-notice--warn"><span class="ba-empty-notice__icon">${icon('warning')}</span><div><strong>${esc(c().partialTitle)}</strong><small>${esc(c().partialBody)}</small></div></div>`:''}${stale?`<div class="ba-empty-notice ba-empty-notice--warn"><span class="ba-empty-notice__icon">${icon('refresh')}</span><div><strong>${esc(c().staleTitle)}</strong><small>${esc(c().staleBody)}</small></div></div>`:''}<div class="ba-empty-controls"><select class="ba-empty-select" data-empty-sort aria-label="Sort"><option value="location"${state.sort==='location'?' selected':''}>${esc(c().sortLocation)}</option><option value="name"${state.sort==='name'?' selected':''}>${esc(c().sortName)}</option><option value="newest"${state.sort==='newest'?' selected':''}>${esc(c().sortNewest)}</option><option value="oldest"${state.sort==='oldest'?' selected':''}>${esc(c().sortOldest)}</option></select></div><div class="ba-empty-sectionhead"><strong>${esc(c().choose)}</strong><small>${esc(c().showing.replace('{shown}',visible.length).replace('{total}',items.length))}</small></div><div class="ba-empty-list">${rows}</div>${visible.length<items.length?`<div class="ba-empty-actions"><button class="ba-empty-secondary" data-empty-action="more" type="button">+ ${items.length-visible.length}</button></div>`:''}`;
  }
  function renderConfirm() {
    const chosen = selectedItems();
    const preview = chosen.slice(0,8).map((item)=>`<div class="ba-empty-confirm-item"><strong>${esc(item.name)}</strong><span>${esc(item.location||'')}</span></div>`).join('');
    return `<div class="ba-empty-kicker">${esc(c().finalKicker)}</div><h2 class="ba-empty-title">${esc(c().finalTitle)}</h2><p class="ba-empty-lead">${esc(c().finalBody)}</p><div class="ba-empty-notice"><span class="ba-empty-notice__icon">${icon('shield')}</span><div><strong>${esc(c().verifyTitle)}</strong><small>${esc(c().verifyBody)}</small></div></div><div class="ba-empty-notice"><span class="ba-empty-notice__icon">${icon('folder')}</span><div><strong>${chosen.length} ${esc(c().folders)}</strong><small>${esc(c().noSpace)}</small></div></div><div class="ba-empty-confirm-list">${preview}</div>${chosen.length>8?`<div style="font-size:10px;color:#81909d">+${chosen.length-8}</div>`:''}<div class="ba-empty-actions"><button class="ba-empty-secondary" data-empty-action="back" type="button">${esc(c().back)}</button><button class="ba-empty-primary" data-empty-action="delete" type="button"${chosen.length&&fresh()?'':' disabled'}>${esc(c().deleteVerify)}</button></div>`;
  }
  function renderDeleting() { return `<div class="ba-empty-state"><div class="ba-empty-spinner"></div><h3>${esc(c().deleting)}</h3><p>${esc(c().verifyBody)}</p></div>`; }
  function renderResult() {
    const r = state.result || {};
    const notRemoved = n(r.failedCount);
    return `<div class="ba-empty-kicker">${esc(c().resultKicker)}</div><h2 class="ba-empty-title">${esc(c().resultTitle)}</h2><p class="ba-empty-lead">${esc(c().resultBody)}</p><div class="ba-empty-result-grid"><div class="ba-empty-result-card"><b>${n(r.deletedCount)}</b><span>${esc(c().removed)}</span></div><div class="ba-empty-result-card"><b>${n(r.becameNonEmptyCount)}</b><span>${esc(c().changed)}</span></div><div class="ba-empty-result-card"><b>${notRemoved}</b><span>${esc(c().notRemoved)}</span></div></div><div class="ba-empty-notice"><span class="ba-empty-notice__icon">${icon('shield')}</span><div><strong>${esc(c().verifyTitle)}</strong><small>${esc(c().noSpace)}</small></div></div><div class="ba-empty-actions"><button class="ba-empty-secondary" data-empty-action="remaining" type="button">${esc(c().remaining)}</button><button class="ba-empty-primary" data-empty-action="close" type="button">${esc(c().done)}</button></div>`;
  }

  function renderSelection() {
    const host = byId('baEmptySelection'); if (!host) return;
    if (!state.open || state.view!=='results' || !state.summary?.available || !state.items.length || state.summary?.running) { host.innerHTML=''; return; }
    const chosen = selectedItems();
    host.innerHTML = `<div class="ba-empty-selection"><div class="ba-empty-selection__inner"><div><strong>${esc(c().selected.replace('{count}',chosen.length))}</strong><small>${esc(c().limit)}</small></div><button class="ba-empty-secondary" data-empty-action="clear" type="button"${chosen.length?'':' disabled'}>${esc(c().clear)}</button><button class="ba-empty-primary" data-empty-action="review" type="button"${chosen.length&&fresh()?'':' disabled'}>${esc(c().review)}</button></div></div>`;
  }
  function render() {
    const surface = ensureSurface(); const host = byId('baEmptyContent'); if (!host) return;
    byId('baEmptySurfaceTitle').textContent = c().title;
    if (state.error) host.innerHTML = renderError();
    else if (state.view==='deleting') host.innerHTML = renderDeleting();
    else if (state.view==='result') host.innerHTML = renderResult();
    else if (state.view==='confirm') host.innerHTML = renderConfirm();
    else if (state.summary?.running) host.innerHTML = renderRunning();
    else if (!state.summary?.available) host.innerHTML = renderStart();
    else if (!state.items.length) host.innerHTML = renderEmpty();
    else host.innerHTML = renderResults();
    renderSelection();
  }

  function readState() {
    state.native = parse(NATIVE.getNativeState?.(), {});
    state.summary = parse(NATIVE.getEmptyFolderSummary?.(), {});
  }
  async function loadItems() {
    const token = ++state.token; const output=[]; const seen=new Set(); let offset=0;
    for (let page=0; page<16; page++) {
      const result = parse(NATIVE.getEmptyFolderCandidates?.(offset,PAGE_SIZE), {});
      if (token!==state.token) return;
      if (!result.available) break;
      const items = Array.isArray(result.items)?result.items:[];
      for (const item of items) if (item?.id && !seen.has(item.id)) {seen.add(item.id);output.push(item);}
      const returned=n(result.returnedCount||items.length); if (!result.hasMore || !returned) break; offset+=returned;
    }
    if (token===state.token) state.items=output;
  }
  async function refresh() {
    state.error=''; readState();
    if (state.summary?.available) await loadItems(); else if (!state.summary?.running) state.items=[];
    render(); updateEntry();
    if (state.summary?.running) startPolling(); else stopPolling();
  }
  function startPolling() {
    if (state.poll) return;
    state.poll = setInterval(async()=>{
      if (!state.open) { stopPolling(); return; }
      const summary=parse(NATIVE.getEmptyFolderSummary?.(),{}); state.summary=summary; render();
      if (!summary.running) { stopPolling(); await refresh(); }
    },POLL_MS);
  }
  function stopPolling(){ if(state.poll){clearInterval(state.poll);state.poll=null;} }
  function startScan() {
    state.error=''; state.message='';
    const result=parse(NATIVE.startEmptyFolderScan?.(),{});
    if (result.accepted) { state.summary={running:true,available:false,visitedFolders:0}; state.items=[]; state.selected.clear(); state.view='results'; render(); startPolling(); return; }
    if (result.reason==='storage_access_required') { try{NATIVE.requestBroadStorageAccess?.();}catch(_){} return; }
    state.error = result.reason==='scan_running' || result.reason==='folder_scan_running' ? c().busy : `${c().errorTitle}${result.reason?` (${result.reason})`:''}`;
    render();
  }
  async function performDelete() {
    const chosen=selectedItems(); if(!chosen.length || chosen.length>MAX_SELECTION || !fresh()) return;
    state.view='deleting'; render();
    const result=parse(NATIVE.deleteEmptyFolderCandidates?.(JSON.stringify(chosen.map((i)=>i.id))),{});
    if (!result.accepted) {
      state.view='results';
      if (result.reason==='stale_review_snapshot') { state.error=c().staleBody; } else { state.error=result.reason||c().errorTitle; }
      render(); return;
    }
    state.result=result; state.selected.clear(); state.summary=result.reviewSummary||parse(NATIVE.getEmptyFolderSummary?.(),{}); await loadItems(); state.view='result'; render(); updateEntry();
  }
  function toggle(id,checked) {
    if (checked && !state.selected.has(id) && state.selected.size>=MAX_SELECTION) { state.message=c().limitReached; return; }
    checked?state.selected.add(id):state.selected.delete(id); render();
  }

  function bind(surface) {
    surface.addEventListener('change',(event)=>{
      const t=event.target;
      if(t?.matches?.('[data-empty-sort]')){state.sort=t.value||'location';state.renderLimit=RENDER_BATCH;render();return;}
      if(t?.matches?.('[data-empty-id]')) toggle(t.dataset.emptyId,Boolean(t.checked));
    });
    surface.addEventListener('click',async(event)=>{
      const b=event.target?.closest?.('[data-empty-action]'); if(!b)return;
      const action=b.dataset.emptyAction;
      if(action==='close') close();
      else if(action==='permission'){try{NATIVE.requestBroadStorageAccess?.();}catch(_){}}
      else if(action==='scan') startScan();
      else if(action==='retry') await refresh();
      else if(action==='clear'){state.selected.clear();render();}
      else if(action==='more'){state.renderLimit+=RENDER_BATCH;render();}
      else if(action==='review'){if(selectedItems().length&&fresh()){state.view='confirm';render();surface.querySelector('.ba-empty-scroll')?.scrollTo?.({top:0});}}
      else if(action==='back'){state.view='results';render();}
      else if(action==='delete') await performDelete();
      else if(action==='remaining'){state.view='results';state.result=null;render();}
    });
  }
  async function open() {
    ensureEntry(); const surface=ensureSurface(); state.open=true; state.view='results'; state.error=''; state.result=null; state.renderLimit=RENDER_BATCH; surface.hidden=false; document.body.classList.add('ba-empty-open'); await refresh(); requestAnimationFrame(()=>surface.querySelector('[data-empty-action="close"]')?.focus?.());
  }
  function close() {
    state.open=false; stopPolling(); const surface=byId('baEmptySurface'); if(surface)surface.hidden=true; document.body.classList.remove('ba-empty-open'); state.selected.clear(); updateEntry(); document.querySelector('#toolsScreen [data-tool="empty-folders"]')?.focus?.();
  }
  function initialize(){ensureStyle();ensureEntry();updateEntry();}

  document.addEventListener('click',(event)=>{const trigger=event.target?.closest?.('[data-tool="empty-folders"]');if(!trigger||trigger.closest('#baEmptySurface'))return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();open();},true);
  window.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&state.open&&state.view!=='deleting')close();});
  window.addEventListener('bearagnostic:languagechange',()=>{updateEntry();if(state.open)render();});
  window.addEventListener('focus',()=>{if(state.open)refresh();else updateEntry();});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();

  window.BearagnosticEmptyFolders=Object.freeze({build:BUILD,open,close,refresh});
})();
