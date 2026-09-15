(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  const ENT = window.BearagnosticEntitlement;
  const HIDDEN = window.BearagnosticHiddenItems;
  if (!NATIVE || !ENT) return;

  const BUILD = 43;
  const CAPABILITY = 'advanced_media_review';
  const CATEGORY = 'all';
  const PAGE_SIZE = 250;
  const RENDER_BATCH = 60;
  const MAX_DELETE_SELECTION = 500;
  const STALE_REVIEW_MS = 15 * 60 * 1000;
  const POLL_MS = 350;
  const MB = 1024 * 1024;
  const DAY_MS = 24 * 60 * 60 * 1000;

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
      title:'Media Review', subFree:'PRO · Advanced review filters', subPro:'Advanced review filters · Pro active', kicker:'ADVANCED MEDIA REVIEW',
      hero:'See review-worthy media with more context.',
      lead:'This is not a full gallery. It shows photos, videos, and audio already surfaced by your latest checkup, then adds richer local previews and filters.',
      pro:'PRO', local:'LOCAL ONLY', source:'SOURCE', sourceValue:'Current review snapshot', coverage:'COVERAGE', coverageValue:'Surfaced media only', safety:'SAFETY', safetyValue:'Review first',
      noSnapshotTitle:'Run a checkup first', noSnapshotBody:'A Quick Scan can create a fresh review snapshot. It reads filesystem metadata only and does not delete anything.', quick:'Run Quick Scan',
      scanningTitle:'Checking for review-worthy media', scanningBody:'Bearagnostic is using real filesystem work. No fake delay or cosmetic progress is added.',
      emptyTitle:'No media surfaced for review', emptyBody:'The current review snapshot contains no photo, video, or audio candidates. This does not mean the device has no media.', refresh:'Refresh snapshot',
      scopeTitle:'Review-set scope', scopeBody:'Only media already surfaced by the current checkup appears here. Bearagnostic does not claim this is your complete photo, video, or music library.',
      autoTitle:'Nothing is selected automatically', autoBody:'Media is personal. Size, age, or file type never becomes a junk verdict on its own.',
      partialTitle:'Review details are partial', partialBody:'The current safety snapshot reached its detail limit. Filters apply only to media represented in this snapshot.',
      staleTitle:'Check again before deleting', staleBody:'This review snapshot is more than 15 minutes old. Run a fresh checkup before removal.',
      media:'Media surfaced', photos:'Photos', videos:'Videos', audio:'Audio', size:'Total size',
      all:'All', screenshots:'Screenshots', type:'Type', sizeFilter:'Size', age:'Age', sort:'Sort', any:'Any', over10:'10 MB+', over100:'100 MB+', recent30:'Last 30 days', olderYear:'1 year+', largest:'Largest first', newest:'Newest first', oldest:'Oldest first', name:'Name A–Z',
      showing:'Showing {shown} of {total}', choose:'Choose only media you recognize and no longer need', more:'Show more', noMatch:'No surfaced media matches these filters.',
      selected:'{count} selected · {size}', clear:'Clear', review:'Review selected', limit:'Up to 500 files can be removed in one verified batch.', limitReached:'The 500-file safety limit has been reached.',
      finalKicker:'FINAL REVIEW', finalTitle:'Remove the selected media files?', finalBody:'Only the files you selected will be permanently removed. Bearagnostic verifies deletion and counts reclaimed bytes only after Android confirms the files are gone.',
      back:'Back', deleteVerify:'Delete & verify', deleting:'Deleting and verifying…',
      resultKicker:'VERIFIED CLEANUP', resultTitle:'Media review complete', reclaimed:'Reclaimed', removed:'Removed', protected:'Protected', failed:'Failed', resultBody:'Only files Android confirmed as gone are counted as removed or reclaimed.', remaining:'Review remaining', done:'Done',
      checked:'Checked', justNow:'just now', minAgo:'min ago', dateUnknown:'Date unavailable', locationUnknown:'Shared storage', metadata:'Local preview',
      errorTitle:'Media Review could not continue', retry:'Try again', scanBusy:'Another checkup is already running. Media Review will refresh when it finishes.',
      available:'Available in the current app', featureTitle:'Advanced Media Review', featureBody:'Review surfaced photos, videos, and audio with local previews, type/size/age filters, and verified deletion.'
    },
    th: {
      title:'Media Review', subFree:'PRO · ตัวกรองสื่อขั้นสูง', subPro:'ตัวกรองสื่อขั้นสูง · Pro เปิดใช้งาน', kicker:'MEDIA REVIEW ขั้นสูง',
      hero:'ดูไฟล์สื่อที่ควรตรวจด้วยบริบทที่ชัดขึ้น',
      lead:'หน้านี้ไม่ใช่แกลเลอรีทั้งหมด แต่แสดงรูป วิดีโอ และเสียงที่การตรวจล่าสุดเสนอให้ Review อยู่แล้ว พร้อมตัวอย่างภายในเครื่องและตัวกรองที่ละเอียดขึ้น',
      pro:'PRO', local:'เฉพาะในเครื่อง', source:'แหล่งข้อมูล', sourceValue:'Review snapshot ปัจจุบัน', coverage:'ขอบเขต', coverageValue:'เฉพาะสื่อที่ถูกเสนอให้ตรวจ', safety:'ความปลอดภัย', safetyValue:'ตรวจดูก่อน',
      noSnapshotTitle:'ตรวจเครื่องก่อน', noSnapshotBody:'Quick Scan สามารถสร้าง review snapshot ใหม่ได้ โดยอ่านเฉพาะ metadata ของระบบไฟล์และไม่ลบอะไร', quick:'เริ่ม Quick Scan',
      scanningTitle:'กำลังตรวจหาไฟล์สื่อที่ควร Review', scanningBody:'Bearagnostic กำลังทำงานกับระบบไฟล์จริง ไม่มีการหน่วงเวลาหรือสร้าง progress ปลอม',
      emptyTitle:'ไม่พบไฟล์สื่อที่ถูกเสนอให้ Review', emptyBody:'review snapshot ปัจจุบันไม่มี candidate ประเภทรูป วิดีโอ หรือเสียง ซึ่งไม่ได้หมายความว่าเครื่องไม่มีไฟล์สื่อ', refresh:'อัปเดต snapshot',
      scopeTitle:'ขอบเขตของ Review set', scopeBody:'แสดงเฉพาะสื่อที่ checkup ปัจจุบันเสนอให้ Review อยู่แล้ว Bearagnostic จะไม่อ้างว่านี่คือคลังรูป วิดีโอ หรือเพลงทั้งหมดในเครื่อง',
      autoTitle:'ไม่มีการเลือกให้อัตโนมัติ', autoBody:'ไฟล์สื่อเป็นข้อมูลส่วนบุคคล ขนาด อายุ หรือชนิดไฟล์เพียงอย่างเดียวไม่ถูกตีความว่าเป็นขยะ',
      partialTitle:'รายละเอียด Review แสดงได้ไม่ครบทั้งหมด', partialBody:'safety snapshot ปัจจุบันถึงขีดจำกัดรายละเอียด ตัวกรองจึงใช้กับสื่อที่มีตัวตนอยู่ใน snapshot นี้เท่านั้น',
      staleTitle:'ตรวจใหม่ก่อนลบ', staleBody:'review snapshot นี้เก่ากว่า 15 นาทีแล้ว กรุณาตรวจใหม่ก่อนลบไฟล์',
      media:'สื่อที่พบ', photos:'รูปภาพ', videos:'วิดีโอ', audio:'เสียง', size:'ขนาดรวม',
      all:'ทั้งหมด', screenshots:'ภาพหน้าจอ', type:'ชนิด', sizeFilter:'ขนาด', age:'อายุไฟล์', sort:'เรียง', any:'ทั้งหมด', over10:'10 MB+', over100:'100 MB+', recent30:'30 วันล่าสุด', olderYear:'1 ปีขึ้นไป', largest:'ใหญ่สุดก่อน', newest:'ใหม่สุดก่อน', oldest:'เก่าสุดก่อน', name:'ชื่อ A–Z',
      showing:'แสดง {shown} จาก {total}', choose:'เลือกเฉพาะไฟล์สื่อที่รู้จักและไม่ต้องการแล้ว', more:'แสดงเพิ่ม', noMatch:'ไม่มีไฟล์สื่อที่ตรงกับตัวกรองนี้',
      selected:'เลือก {count} ไฟล์ · {size}', clear:'ล้างที่เลือก', review:'ตรวจรายการที่เลือก', limit:'ลบได้สูงสุด 500 ไฟล์ต่อหนึ่ง batch ที่มีการตรวจยืนยัน', limitReached:'เลือกครบขีดจำกัดความปลอดภัย 500 ไฟล์แล้ว',
      finalKicker:'ตรวจครั้งสุดท้าย', finalTitle:'ลบไฟล์สื่อที่เลือกหรือไม่', finalBody:'ระบบจะลบถาวรเฉพาะไฟล์ที่เลือกไว้ และนับพื้นที่คืนได้ก็ต่อเมื่อ Android ยืนยันว่าไฟล์หายไปจริงแล้วเท่านั้น',
      back:'ย้อนกลับ', deleteVerify:'ลบและตรวจยืนยัน', deleting:'กำลังลบและตรวจยืนยัน…',
      resultKicker:'ยืนยันผลแล้ว', resultTitle:'Media Review เรียบร้อย', reclaimed:'พื้นที่คืนได้', removed:'ลบแล้ว', protected:'ป้องกันไว้', failed:'ไม่สำเร็จ', resultBody:'นับเฉพาะไฟล์ที่ Android ยืนยันว่าหายไปแล้วเป็นจำนวนที่ลบและพื้นที่คืนได้', remaining:'ตรวจรายการที่เหลือ', done:'เสร็จสิ้น',
      checked:'ตรวจเมื่อ', justNow:'เมื่อสักครู่', minAgo:'นาทีที่แล้ว', dateUnknown:'ไม่มีข้อมูลวันที่', locationUnknown:'Shared storage', metadata:'ตัวอย่างภายในเครื่อง',
      errorTitle:'ไม่สามารถดำเนิน Media Review ต่อได้', retry:'ลองอีกครั้ง', scanBusy:'มี checkup อื่นกำลังทำงานอยู่ Media Review จะอัปเดตเมื่อการตรวจนั้นเสร็จ',
      available:'ความสามารถที่มีอยู่ในแอปตอนนี้', featureTitle:'Media Review ขั้นสูง', featureBody:'ตรวจรูป วิดีโอ และเสียงที่ถูกเสนอให้ Review ด้วยตัวอย่างภายในเครื่อง ตัวกรองชนิด/ขนาด/อายุ และการลบที่ตรวจยืนยันจริง'
    },
    ja: {
      title:'Media Review', subFree:'PRO · 高度なメディアフィルター', subPro:'高度なメディアフィルター · Pro 有効', kicker:'高度な MEDIA REVIEW',
      hero:'確認すべきメディアを、より詳しい情報と一緒に。',
      lead:'これは端末全体のギャラリーではありません。最新のチェックで確認対象として表示された写真・動画・音声に、ローカルプレビューと高度なフィルターを追加します。',
      pro:'PRO', local:'端末内のみ', source:'ソース', sourceValue:'現在の review snapshot', coverage:'範囲', coverageValue:'表示済みメディアのみ', safety:'安全性', safetyValue:'要確認',
      noSnapshotTitle:'まずチェックを実行', noSnapshotBody:'Quick Scan で新しい review snapshot を作成できます。ファイルシステムのメタデータのみを読み取り、削除は行いません。', quick:'Quick Scan を実行',
      scanningTitle:'確認対象のメディアをチェック中', scanningBody:'実際のファイルシステム処理を行っています。偽の待ち時間や進捗は追加しません。',
      emptyTitle:'確認対象のメディアはありません', emptyBody:'現在の review snapshot に写真・動画・音声の候補はありません。端末にメディアがないという意味ではありません。', refresh:'snapshot を更新',
      scopeTitle:'Review set の範囲', scopeBody:'現在の checkup ですでに確認対象になったメディアだけを表示します。端末全体の写真・動画・音楽ライブラリだとは表示しません。',
      autoTitle:'自動選択は行いません', autoBody:'メディアは個人的なデータです。サイズ・経過日数・種類だけで不要とは判断しません。',
      partialTitle:'Review 詳細は一部のみです', partialBody:'現在の safety snapshot は詳細上限に達しています。フィルターは snapshot に含まれるメディアだけに適用されます。',
      staleTitle:'削除前に再チェック', staleBody:'この review snapshot は 15 分以上前のものです。削除前に新しいチェックを実行してください。',
      media:'表示メディア', photos:'写真', videos:'動画', audio:'音声', size:'合計サイズ',
      all:'すべて', screenshots:'スクリーンショット', type:'種類', sizeFilter:'サイズ', age:'期間', sort:'並び順', any:'すべて', over10:'10 MB+', over100:'100 MB+', recent30:'30 日以内', olderYear:'1 年以上', largest:'サイズが大きい順', newest:'新しい順', oldest:'古い順', name:'名前 A–Z',
      showing:'{total} 件中 {shown} 件', choose:'内容を把握し、不要だと判断したメディアだけを選択してください', more:'さらに表示', noMatch:'このフィルターに一致するメディアはありません。',
      selected:'{count} 件選択 · {size}', clear:'選択解除', review:'選択内容を確認', limit:'1 回の検証済みバッチで最大 500 ファイルです。', limitReached:'500 ファイルの安全上限に達しました。',
      finalKicker:'最終確認', finalTitle:'選択したメディアを削除しますか？', finalBody:'選択したファイルだけを完全に削除します。回収容量は Android がファイルの消失を確認した後だけ計上します。',
      back:'戻る', deleteVerify:'削除して確認', deleting:'削除して確認中…',
      resultKicker:'検証済み', resultTitle:'Media Review が完了しました', reclaimed:'回収容量', removed:'削除済み', protected:'保護', failed:'失敗', resultBody:'Android が消えたと確認したファイルだけを削除件数と回収容量に数えます。', remaining:'残りを確認', done:'完了',
      checked:'確認', justNow:'たった今', minAgo:'分前', dateUnknown:'日付情報なし', locationUnknown:'共有ストレージ', metadata:'端末内プレビュー',
      errorTitle:'Media Review を続行できません', retry:'再試行', scanBusy:'別の checkup が実行中です。完了後に Media Review を更新します。',
      available:'現在のアプリで利用できる機能', featureTitle:'高度な Media Review', featureBody:'表示された写真・動画・音声を、ローカルプレビュー、種類・サイズ・期間フィルター、検証済み削除で確認できます。'
    }
  };
  const c = () => COPY[language()] || COPY.en;

  const ICONS = {
    media:'<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.35"/><path d="m6 17 4-4 3 3 2-2 3 3"/>',
    image:'<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.35"/><path d="m6 17 4-4 3 3 2-2 3 3"/>',
    video:'<rect x="4" y="6" width="16" height="12" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    audio:'<path d="M9 18V7l9-2v11"/><circle cx="6.5" cy="18" r="2.3"/><circle cx="15.5" cy="16" r="2.3"/>',
    shield:'<path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6Z"/><path d="m9 12 2 2 4-4"/>',
    warning:'<path d="M12 4 3 20h18L12 4Z"/><path d="M12 9v5M12 17h.01"/>',
    refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.media}</svg>`;
  const badge = (large = false) => `<span class="ba-media-badge${large?' is-large':''}" aria-hidden="true"><span></span>${icon('media')}</span>`;

  const state = {
    open:false, view:'results', native:{}, summary:{}, items:[], selected:new Set(), result:null, error:'', message:'',
    type:'all', size:'any', age:'any', sort:'largest', renderLimit:RENDER_BATCH, token:0, poll:null,
  };

  let previewSeq = 0;
  let previewPending = null;
  const previewQueue = [];
  const previewQueued = new Set();
  const previewCache = new Map();
  let previewObserver = null;

  function canUse() { try { return ENT.can?.(CAPABILITY) === true; } catch (_) { return false; } }
  function formatBytes(value) {
    const bytes = n(value);
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    const units = ['KB','MB','GB','TB']; let v = bytes / 1024; let i = 0;
    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
    return `${v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)} ${units[i]}`;
  }
  function ageText(ms) {
    const value = n(ms); if (!value) return c().dateUnknown;
    try { return new Intl.DateTimeFormat(language()==='th'?'th-TH':language()==='ja'?'ja-JP':'en-US',{year:'numeric',month:'short',day:'numeric'}).format(new Date(value)); }
    catch (_) { return c().dateUnknown; }
  }
  function checkedLabel(ms) {
    const delta = Date.now() - n(ms); if (delta < 60_000) return c().justNow;
    if (delta < 60 * 60_000) return `${Math.max(1,Math.floor(delta/60_000))} ${c().minAgo}`;
    return ageText(ms);
  }
  function fresh() {
    const generated = n(state.summary?.generatedAtMs);
    return generated > 0 && Date.now() >= generated && Date.now() - generated <= STALE_REVIEW_MS;
  }
  function mediaKind(item) {
    const direct = String(item?.fileKind || '').toLowerCase();
    if (['image','video','audio'].includes(direct)) return direct;
    const ext = String(item?.extension || item?.name?.split('.').pop() || '').toLowerCase();
    if (['jpg','jpeg','png','webp','gif','bmp','heic','heif','avif','dng'].includes(ext)) return 'image';
    if (['mp4','mkv','mov','avi','webm','m4v','3gp','ts','mts','m2ts'].includes(ext)) return 'video';
    if (['mp3','m4a','aac','wav','flac','ogg','opus','wma','amr'].includes(ext)) return 'audio';
    return 'other';
  }
  function isScreenshot(item) {
    if (mediaKind(item) !== 'image') return false;
    const text = `${item?.name||''} ${item?.location||''}`.toLowerCase().replace(/[\\]/g,'/');
    return text.includes('screenshot') || text.includes('screen_shot') || text.includes('/screenshots') || text.includes('screenshots/');
  }
  function privacyItems() {
    const source = state.items.filter((item) => ['image','video','audio'].includes(mediaKind(item)));
    try { return HIDDEN?.filter ? HIDDEN.filter(source) : source; } catch (_) { return source; }
  }
  function filteredItems() {
    const now = Date.now();
    return privacyItems().filter((item) => {
      const kind = mediaKind(item);
      if (state.type === 'photos' && kind !== 'image') return false;
      if (state.type === 'videos' && kind !== 'video') return false;
      if (state.type === 'audio' && kind !== 'audio') return false;
      if (state.type === 'screenshots' && !isScreenshot(item)) return false;
      if (state.size === 'over10' && n(item.sizeBytes) < 10 * MB) return false;
      if (state.size === 'over100' && n(item.sizeBytes) < 100 * MB) return false;
      const modified = n(item.modifiedMs);
      if (state.age === 'recent30' && (!modified || now - modified > 30 * DAY_MS)) return false;
      if (state.age === 'olderYear' && (!modified || now - modified < 365 * DAY_MS)) return false;
      return true;
    }).sort((a,b) => {
      if (state.sort === 'newest') return n(b.modifiedMs)-n(a.modifiedMs);
      if (state.sort === 'oldest') return (n(a.modifiedMs)||Number.MAX_SAFE_INTEGER)-(n(b.modifiedMs)||Number.MAX_SAFE_INTEGER);
      if (state.sort === 'name') return String(a.name||'').localeCompare(String(b.name||''),undefined,{sensitivity:'base'});
      return n(b.sizeBytes)-n(a.sizeBytes);
    });
  }
  function selectedItems() {
    const allowed = new Map(privacyItems().map((item)=>[item.id,item]));
    for (const id of [...state.selected]) if (!allowed.has(id)) state.selected.delete(id);
    return [...state.selected].map((id)=>allowed.get(id)).filter(Boolean);
  }

  function ensureStyle() {
    if (byId('androidAdvancedMediaStyle')) return;
    const style = document.createElement('style'); style.id = 'androidAdvancedMediaStyle';
    style.textContent = `
      .ba-media-entry{--tone:104,94,205!important}.ba-media-entry .mini-icon{overflow:visible!important}.ba-media-entry .ba-media-entry-pro{display:inline-flex;align-items:center;height:18px;margin-left:6px;padding:0 6px;border-radius:999px;background:linear-gradient(145deg,#eeeaff,#edf7ff);border:1px solid rgba(103,91,190,.10);color:#645bb4;font-size:7.5px;font-weight:850;letter-spacing:.08em;vertical-align:2px}
      .ba-media-badge{position:relative;width:38px;height:38px;display:grid;place-items:center;border-radius:13px;background:linear-gradient(145deg,#f1efff 0%,#dbecff 33%,#8cc9ef 69%,#6a62c8 100%);border:1px solid rgba(255,255,255,.84);box-shadow:0 8px 17px rgba(83,91,171,.16),inset 0 1px 1px rgba(255,255,255,.98),inset 0 -5px 10px rgba(78,74,171,.16);color:#fff;overflow:hidden}.ba-media-badge>span{position:absolute;inset:3px 4px auto;height:14px;border-radius:9px;background:linear-gradient(180deg,rgba(255,255,255,.82),rgba(255,255,255,.07));filter:blur(.2px)}.ba-media-badge svg{position:relative;width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 1px rgba(49,50,115,.22))}.ba-media-badge.is-large{width:44px;height:44px;border-radius:15px}.ba-media-badge.is-large svg{width:23px;height:23px}
      .ba-media-surface[hidden]{display:none!important}.ba-media-surface{position:fixed;z-index:2900;inset:0;background:linear-gradient(180deg,#fbfdff 0%,#f2f8fc 66%,#eef5fa 100%);display:grid;grid-template-rows:auto minmax(0,1fr) auto;color:#1d3448}.ba-media-head{min-height:78px;padding:calc(14px + env(safe-area-inset-top)) 18px 12px;display:grid;grid-template-columns:48px minmax(0,1fr) 48px;gap:10px;align-items:center;border-bottom:1px solid rgba(66,106,137,.07);background:rgba(252,254,255,.94);backdrop-filter:blur(18px)}.ba-media-head__copy{text-align:center;min-width:0}.ba-media-head__copy strong{display:block;font-size:15px;color:#2b4358}.ba-media-head__copy small{display:block;margin-top:3px;font-size:9px;letter-spacing:.07em;color:#8b98a3}.ba-media-close{width:46px;height:46px;border-radius:15px;background:#fff;color:#677c8d;border:1px solid rgba(72,112,144,.08);font-size:27px;font-weight:300;box-shadow:0 6px 18px rgba(56,87,112,.055)}
      .ba-media-scroll{overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:18px 16px 112px;scrollbar-width:none}.ba-media-scroll::-webkit-scrollbar{display:none}.ba-media-wrap{max-width:720px;margin:0 auto}.ba-media-kicker{font-size:9.5px;font-weight:850;letter-spacing:.16em;color:#665fc0}.ba-media-title{margin:7px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:1.07;font-weight:500;letter-spacing:-.025em;color:#1c3145}.ba-media-lead{margin:10px 0 0;font-size:12.5px;line-height:1.55;color:#748494}.ba-media-local{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 10px;border-radius:999px;background:rgba(237,250,246,.95);border:1px solid rgba(45,168,135,.09);color:#338d75;font-size:8.5px;font-weight:820;letter-spacing:.09em}.ba-media-local:before{content:'';width:7px;height:7px;border-radius:50%;background:#38bf95;box-shadow:0 0 0 4px rgba(56,191,149,.10)}
      .ba-media-triad{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:16px}.ba-media-chip{padding:10px 9px;border-radius:15px;background:rgba(255,255,255,.92);border:1px solid rgba(68,108,139,.07);min-width:0}.ba-media-chip small{display:block;font-size:8.2px;font-weight:820;letter-spacing:.10em;color:#8b9aa7}.ba-media-chip strong{display:block;margin-top:3px;font-size:10.5px;line-height:1.3;color:#455e71;min-height:2.6em}
      .ba-media-state{padding:30px 18px;margin-top:16px;border-radius:24px;background:#fff;border:1px solid rgba(67,108,139,.07);text-align:center;box-shadow:0 12px 30px rgba(52,84,108,.05)}.ba-media-state__icon{width:60px;height:60px;border-radius:20px;margin:0 auto 13px;background:linear-gradient(145deg,#f1efff,#e7f4ff);color:#6560bb;display:grid;place-items:center}.ba-media-state__icon svg{width:29px;height:29px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ba-media-state h3{margin:0;font-size:17px;color:#314a5d}.ba-media-state p{max-width:540px;margin:8px auto 0;font-size:11.7px;line-height:1.56;color:#788b9a}.ba-media-spinner{width:36px;height:36px;margin:0 auto 13px;border-radius:50%;border:3px solid #e8edf7;border-top-color:#675fc0;animation:baMediaSpin .8s linear infinite}
      .ba-media-primary,.ba-media-secondary{min-height:44px;border-radius:14px;padding:0 16px;font:inherit;font-size:11.5px;font-weight:760}.ba-media-primary{background:linear-gradient(135deg,#5d63d3,#269ed8);color:#fff;box-shadow:0 9px 22px rgba(64,85,180,.18)}.ba-media-primary:disabled{opacity:.42;box-shadow:none}.ba-media-secondary{background:#fff;color:#557084;border:1px solid rgba(69,111,143,.12)}.ba-media-actions{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:15px}
      .ba-media-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:14px 0}.ba-media-stat{padding:10px 7px;border-radius:15px;background:rgba(255,255,255,.94);border:1px solid rgba(66,107,137,.07);min-width:0}.ba-media-stat b{display:block;font-size:13px;color:#36546b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-media-stat span{display:block;margin-top:3px;font-size:8.7px;color:#8796a3}.ba-media-notice{display:grid;grid-template-columns:35px minmax(0,1fr);gap:10px;padding:11px 12px;margin:10px 0;border-radius:17px;background:linear-gradient(135deg,#f4f8ff,#fbfdff);border:1px solid rgba(98,94,192,.09)}.ba-media-notice--warn{background:linear-gradient(135deg,#fff9ef,#fffdf9);border-color:rgba(194,145,75,.12)}.ba-media-notice__icon{width:35px;height:35px;border-radius:12px;background:#eef0ff;color:#6660bc;display:grid;place-items:center}.ba-media-notice--warn .ba-media-notice__icon{background:#fff4df;color:#9c753e}.ba-media-notice__icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ba-media-notice strong{display:block;font-size:11.8px;color:#4b5d6d}.ba-media-notice small{display:block;margin-top:3px;font-size:10.7px;line-height:1.48;color:#7a8792}
      .ba-media-filterbox{margin:14px 0 10px;padding:12px;border-radius:20px;background:rgba(255,255,255,.94);border:1px solid rgba(75,108,150,.07);box-shadow:0 7px 22px rgba(56,83,118,.035)}.ba-media-typebar{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}.ba-media-typebar::-webkit-scrollbar{display:none}.ba-media-type{flex:0 0 auto;min-height:34px;padding:0 11px;border-radius:11px;background:#f0f4f8;color:#62778a;font-size:10.5px;font-weight:730;border:1px solid transparent}.ba-media-type.is-active{background:linear-gradient(145deg,#eeeaff,#edf7ff);border-color:rgba(103,91,190,.10);color:#635ab4;box-shadow:0 4px 12px rgba(78,74,145,.06)}.ba-media-filtergrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:9px}.ba-media-select{width:100%;height:39px;border-radius:12px;border:1px solid rgba(69,111,143,.10);background:#f9fbfd;color:#465f73;padding:0 26px 0 9px;font:inherit;font-size:10.5px;font-weight:680;min-width:0}
      .ba-media-sectionhead{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;margin:11px 1px 8px}.ba-media-sectionhead strong{font-size:12.5px;color:#40586b}.ba-media-sectionhead small{font-size:10px;color:#8997a3;white-space:nowrap}.ba-media-list{display:grid;gap:8px}.ba-media-row{display:grid;grid-template-columns:23px 64px minmax(0,1fr) auto;gap:9px;align-items:center;min-height:82px;padding:9px 10px;border-radius:18px;background:#fff;border:1px solid rgba(70,111,142,.075);box-shadow:0 5px 18px rgba(52,86,111,.035)}.ba-media-row.is-selected{border-color:rgba(99,93,193,.24);box-shadow:0 8px 22px rgba(81,82,161,.08),inset 3px 0 0 rgba(91,96,201,.42)}.ba-media-row input{width:19px;height:19px;accent-color:#625fc4}.ba-media-thumb{width:64px;height:64px;border-radius:16px;overflow:hidden;background:linear-gradient(145deg,#eff4ff,#e5f2fa);color:#6264bd;display:grid;place-items:center;border:1px solid rgba(96,95,188,.07);position:relative}.ba-media-thumb svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ba-media-thumb img{width:100%;height:100%;object-fit:cover;display:block}.ba-media-copy{min-width:0}.ba-media-copy__badge{display:inline-flex;align-items:center;min-height:19px;padding:0 6px;border-radius:999px;background:#eef3ff;color:#6661b8;font-size:8px;font-weight:820;letter-spacing:.055em;text-transform:uppercase}.ba-media-copy strong{display:block;margin-top:4px;font-size:11.8px;color:#344b5e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-media-copy small{display:block;margin-top:3px;font-size:9.6px;line-height:1.35;color:#8795a1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-media-detail{color:#667e91!important}.ba-media-meta{text-align:right;min-width:74px}.ba-media-meta b{display:block;font-size:11.5px;color:#425b70}.ba-media-meta small{display:block;margin-top:4px;font-size:8.8px;color:#939faa;white-space:nowrap}
      .ba-media-selection{position:fixed;z-index:2950;left:0;right:0;bottom:0;padding:9px 14px calc(9px + env(safe-area-inset-bottom));background:rgba(249,252,254,.97);border-top:1px solid rgba(63,104,134,.09);backdrop-filter:blur(18px)}.ba-media-selection__inner{max-width:720px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center}.ba-media-selection strong{display:block;font-size:11.7px;color:#40596c}.ba-media-selection small{display:block;margin-top:2px;font-size:9.3px;color:#8a98a4}.ba-media-confirm-list{display:grid;gap:6px;margin:13px 0}.ba-media-confirm-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;padding:9px 11px;border-radius:13px;background:#f8fbfd;border:1px solid rgba(68,108,139,.06)}.ba-media-confirm-item strong{font-size:10.8px;color:#455d70;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-media-confirm-item span{font-size:9.5px;color:#778a99}.ba-media-result-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:16px 0}.ba-media-result-card{padding:11px 7px;border-radius:16px;background:#f7fbfd;border:1px solid rgba(65,111,143,.07)}.ba-media-result-card b{display:block;font-size:14px;color:#365f78}.ba-media-result-card span{display:block;margin-top:3px;font-size:9px;line-height:1.3;color:#7f909e}.ba-media-pro-feature{grid-column:1/-1;display:grid!important;grid-template-columns:31px minmax(0,1fr);column-gap:10px;align-items:center;background:linear-gradient(145deg,#fff,#f4f1ff)!important}.ba-media-pro-feature .ba-pro-feature__icon{grid-column:1;grid-row:1/3;margin-bottom:0!important;background:linear-gradient(145deg,#eee9ff,#edf6ff)!important;color:#655bc2!important}.ba-media-pro-feature .ba-pro-feature__icon svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.ba-media-pro-feature>strong,.ba-media-pro-feature>small{grid-column:2}
      @keyframes baMediaSpin{to{transform:rotate(360deg)}}
      @media(max-width:390px){.ba-media-scroll{padding-left:12px;padding-right:12px}.ba-media-title{font-size:24px}.ba-media-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.ba-media-filtergrid{grid-template-columns:1fr}.ba-media-row{grid-template-columns:22px 54px minmax(0,1fr)}.ba-media-thumb{width:54px;height:54px}.ba-media-meta{grid-column:3;text-align:left;display:flex;gap:9px;align-items:center}.ba-media-meta small{margin-top:0}.ba-media-selection__inner{grid-template-columns:minmax(0,1fr) auto}.ba-media-selection .ba-media-secondary{display:none}.ba-media-result-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(prefers-reduced-motion:reduce){.ba-media-spinner{animation:none!important}}
    `;
    document.head.appendChild(style);
  }

  function ensureEntry() {
    ensureStyle();
    const tools = byId('toolsScreen'); if (tools) tools.classList.add('ba-tools-expandable');
    const list = document.querySelector('#toolsScreen .utility-list'); if (!list) return null;
    let entry = list.querySelector('[data-tool="advanced-media"]');
    if (!entry) { entry = document.createElement('button'); entry.type='button'; entry.dataset.tool='advanced-media'; entry.className='ba-media-entry'; list.appendChild(entry); }
    const anchor = list.querySelector('[data-tool="empty-folders"]') || list.querySelector('[data-tool="zero"]');
    if (anchor && anchor.nextElementSibling !== entry) anchor.insertAdjacentElement('afterend', entry);
    updateEntry(entry); return entry;
  }
  function updateEntry(entry = document.querySelector('#toolsScreen [data-tool="advanced-media"]')) {
    if (!entry) return;
    const pro = canUse(); const sub = pro ? c().subPro : c().subFree;
    entry.innerHTML = `<span class="mini-icon">${badge()}</span><span><strong>${esc(c().title)}<em class="ba-media-entry-pro">${esc(c().pro)}</em></strong><small>${esc(sub)}</small></span><b>›</b>`;
    entry.setAttribute('aria-label', `${c().title}. ${sub}`);
  }
  function ensureSurface() {
    ensureStyle(); let surface = byId('baMediaSurface'); if (surface) return surface;
    surface = document.createElement('section'); surface.id='baMediaSurface'; surface.className='ba-media-surface'; surface.hidden=true;
    surface.setAttribute('role','dialog'); surface.setAttribute('aria-modal','true'); surface.setAttribute('aria-labelledby','baMediaSurfaceTitle');
    surface.innerHTML = `<header class="ba-media-head"><span>${badge(true)}</span><div class="ba-media-head__copy"><strong id="baMediaSurfaceTitle"></strong><small>BEARAGNOSTIC · LOCAL REVIEW · PRO</small></div><button class="ba-media-close" type="button" data-media-action="close" aria-label="Close">×</button></header><div class="ba-media-scroll"><div class="ba-media-wrap" id="baMediaContent"></div></div><div id="baMediaSelection"></div>`;
    document.body.appendChild(surface); bind(surface); surface.querySelector('.ba-media-scroll')?.addEventListener('scroll', requestVisiblePreviews, {passive:true}); return surface;
  }

  const intro = () => `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div class="ba-media-kicker">${esc(c().kicker)}</div><span class="ba-media-local">${esc(c().local)}</span></div><h2 class="ba-media-title">${esc(c().hero)}</h2><p class="ba-media-lead">${esc(c().lead)}</p>`;
  const triad = () => `<div class="ba-media-triad"><div class="ba-media-chip"><small>${esc(c().source)}</small><strong>${esc(c().sourceValue)}</strong></div><div class="ba-media-chip"><small>${esc(c().coverage)}</small><strong>${esc(c().coverageValue)}</strong></div><div class="ba-media-chip"><small>${esc(c().safety)}</small><strong>${esc(c().safetyValue)}</strong></div></div>`;
  const stateCard = (iconName,title,body,actions='') => `<div class="ba-media-state"><span class="ba-media-state__icon">${icon(iconName)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p>${actions?`<div class="ba-media-actions">${actions}</div>`:''}</div>`;

  function renderStart() { return `${intro()}${triad()}${stateCard('media',c().noSnapshotTitle,c().noSnapshotBody,`<button class="ba-media-primary" data-media-action="scan" type="button">${esc(c().quick)}</button>`)}`; }
  function renderRunning() { return `${intro()}${triad()}<div class="ba-media-state"><div class="ba-media-spinner"></div><h3>${esc(c().scanningTitle)}</h3><p>${esc(c().scanningBody)}</p></div>`; }
  function renderEmpty() { return `${intro()}${triad()}${stateCard('media',c().emptyTitle,c().emptyBody,`<button class="ba-media-secondary" data-media-action="scan" type="button">${esc(c().refresh)}</button>`)}`; }
  function renderError() { return `${intro()}${stateCard('warning',c().errorTitle,state.error||'',`<button class="ba-media-primary" data-media-action="retry" type="button">${esc(c().retry)}</button>`)}`; }

  function renderResults() {
    const base = privacyItems();
    const items = filteredItems();
    const visible = items.slice(0,state.renderLimit);
    const photos = base.filter((i)=>mediaKind(i)==='image').length;
    const videos = base.filter((i)=>mediaKind(i)==='video').length;
    const audio = base.filter((i)=>mediaKind(i)==='audio').length;
    const totalBytes = base.reduce((sum,i)=>sum+n(i.sizeBytes),0);
    const rows = visible.length ? visible.map((item)=>{
      const kind=mediaKind(item); const checked=state.selected.has(item.id); const cached=previewCache.get(item.id); const detail=cached?mediaDetail(cached):'';
      const visual = cached?.previewDataUrl && safePreviewUrl(cached.previewDataUrl) ? `<img src="${cached.previewDataUrl}" alt="">` : icon(kind);
      return `<label class="ba-media-row${checked?' is-selected':''}" data-media-row="${esc(item.id)}"><input type="checkbox" data-media-id="${esc(item.id)}"${checked?' checked':''}><span class="ba-media-thumb" data-media-thumb="${esc(item.id)}">${visual}</span><span class="ba-media-copy"><span class="ba-media-copy__badge">${esc(kind==='image'?c().photos:kind==='video'?c().videos:c().audio)}</span><strong>${esc(item.name||'(unnamed)')}</strong><small>${esc(item.location||c().locationUnknown)}</small><small class="ba-media-detail"${detail?'':' hidden'}>${esc(detail)}</small></span><span class="ba-media-meta"><b>${esc(formatBytes(item.sizeBytes))}</b><small>${esc(ageText(item.modifiedMs))}</small></span></label>`;
    }).join('') : `<div class="ba-media-state"><h3>${esc(c().noMatch)}</h3></div>`;
    const stale = !fresh();
    return `${intro()}${triad()}<div class="ba-media-stats"><div class="ba-media-stat"><b>${base.length}</b><span>${esc(c().media)}</span></div><div class="ba-media-stat"><b>${photos} / ${videos} / ${audio}</b><span>${esc(c().photos)} · ${esc(c().videos)} · ${esc(c().audio)}</span></div><div class="ba-media-stat"><b>${esc(formatBytes(totalBytes))}</b><span>${esc(c().size)}</span></div><div class="ba-media-stat"><b>${esc(checkedLabel(state.summary?.generatedAtMs))}</b><span>${esc(c().checked)}</span></div></div><div class="ba-media-notice"><span class="ba-media-notice__icon">${icon('shield')}</span><div><strong>${esc(c().scopeTitle)}</strong><small>${esc(c().scopeBody)}</small></div></div><div class="ba-media-notice"><span class="ba-media-notice__icon">${icon('media')}</span><div><strong>${esc(c().autoTitle)}</strong><small>${esc(c().autoBody)}</small></div></div>${state.summary?.detailsTruncated?`<div class="ba-media-notice ba-media-notice--warn"><span class="ba-media-notice__icon">${icon('warning')}</span><div><strong>${esc(c().partialTitle)}</strong><small>${esc(c().partialBody)}</small></div></div>`:''}${stale?`<div class="ba-media-notice ba-media-notice--warn"><span class="ba-media-notice__icon">${icon('refresh')}</span><div><strong>${esc(c().staleTitle)}</strong><small>${esc(c().staleBody)}</small></div></div>`:''}<div class="ba-media-filterbox"><div class="ba-media-typebar" role="group" aria-label="${esc(c().type)}">${[['all',c().all],['photos',c().photos],['videos',c().videos],['audio',c().audio],['screenshots',c().screenshots]].map(([v,l])=>`<button type="button" class="ba-media-type${state.type===v?' is-active':''}" data-media-type="${v}" aria-pressed="${state.type===v?'true':'false'}">${esc(l)}</button>`).join('')}</div><div class="ba-media-filtergrid"><select class="ba-media-select" data-media-filter="size" aria-label="${esc(c().sizeFilter)}"><option value="any"${state.size==='any'?' selected':''}>${esc(c().sizeFilter)} · ${esc(c().any)}</option><option value="over10"${state.size==='over10'?' selected':''}>${esc(c().over10)}</option><option value="over100"${state.size==='over100'?' selected':''}>${esc(c().over100)}</option></select><select class="ba-media-select" data-media-filter="age" aria-label="${esc(c().age)}"><option value="any"${state.age==='any'?' selected':''}>${esc(c().age)} · ${esc(c().any)}</option><option value="recent30"${state.age==='recent30'?' selected':''}>${esc(c().recent30)}</option><option value="olderYear"${state.age==='olderYear'?' selected':''}>${esc(c().olderYear)}</option></select><select class="ba-media-select" data-media-filter="sort" aria-label="${esc(c().sort)}"><option value="largest"${state.sort==='largest'?' selected':''}>${esc(c().largest)}</option><option value="newest"${state.sort==='newest'?' selected':''}>${esc(c().newest)}</option><option value="oldest"${state.sort==='oldest'?' selected':''}>${esc(c().oldest)}</option><option value="name"${state.sort==='name'?' selected':''}>${esc(c().name)}</option></select></div></div><div class="ba-media-sectionhead"><strong>${esc(c().choose)}</strong><small>${esc(c().showing.replace('{shown}',visible.length).replace('{total}',items.length))}</small></div><div class="ba-media-list">${rows}</div>${visible.length<items.length?`<div class="ba-media-actions"><button class="ba-media-secondary" data-media-action="more" type="button">${esc(c().more)} · +${items.length-visible.length}</button></div>`:''}`;
  }

  function renderConfirm() {
    const chosen=selectedItems(); const bytes=chosen.reduce((sum,i)=>sum+n(i.sizeBytes),0);
    const preview=chosen.slice(0,8).map((i)=>`<div class="ba-media-confirm-item"><strong>${esc(i.name)}</strong><span>${esc(formatBytes(i.sizeBytes))}</span></div>`).join('');
    return `<div class="ba-media-kicker">${esc(c().finalKicker)}</div><h2 class="ba-media-title">${esc(c().finalTitle)}</h2><p class="ba-media-lead">${esc(c().finalBody)}</p><div class="ba-media-notice"><span class="ba-media-notice__icon">${icon('shield')}</span><div><strong>${chosen.length} ${esc(c().media)} · ${esc(formatBytes(bytes))}</strong><small>${esc(c().autoBody)}</small></div></div><div class="ba-media-confirm-list">${preview}</div>${chosen.length>8?`<div style="font-size:10px;color:#81909d">+${chosen.length-8}</div>`:''}<div class="ba-media-actions"><button class="ba-media-secondary" data-media-action="back" type="button">${esc(c().back)}</button><button class="ba-media-primary" data-media-action="delete" type="button"${chosen.length&&fresh()?'':' disabled'}>${esc(c().deleteVerify)}</button></div>`;
  }
  function renderDeleting(){return `<div class="ba-media-state"><div class="ba-media-spinner"></div><h3>${esc(c().deleting)}</h3><p>${esc(c().finalBody)}</p></div>`;}
  function renderResult(){const r=state.result||{};const protectedCount=Array.isArray(r.protectedIds)?r.protectedIds.length:0;const failedCount=Array.isArray(r.failed)?r.failed.length:0;return `<div class="ba-media-kicker">${esc(c().resultKicker)}</div><h2 class="ba-media-title">${esc(c().resultTitle)}</h2><p class="ba-media-lead">${esc(c().resultBody)}</p><div class="ba-media-result-grid"><div class="ba-media-result-card"><b>${esc(formatBytes(r.reclaimedBytes))}</b><span>${esc(c().reclaimed)}</span></div><div class="ba-media-result-card"><b>${n(r.deletedCount)}</b><span>${esc(c().removed)}</span></div><div class="ba-media-result-card"><b>${protectedCount}</b><span>${esc(c().protected)}</span></div><div class="ba-media-result-card"><b>${failedCount}</b><span>${esc(c().failed)}</span></div></div><div class="ba-media-actions"><button class="ba-media-secondary" data-media-action="remaining" type="button">${esc(c().remaining)}</button><button class="ba-media-primary" data-media-action="close" type="button">${esc(c().done)}</button></div>`;}

  function renderSelection(){const host=byId('baMediaSelection');if(!host)return;if(!state.open||state.view!=='results'||!state.summary?.available||!privacyItems().length){host.innerHTML='';return;}const chosen=selectedItems();const bytes=chosen.reduce((sum,i)=>sum+n(i.sizeBytes),0);host.innerHTML=`<div class="ba-media-selection"><div class="ba-media-selection__inner"><div><strong>${esc(c().selected.replace('{count}',chosen.length).replace('{size}',formatBytes(bytes)))}</strong><small>${esc(c().limit)}</small></div><button class="ba-media-secondary" data-media-action="clear" type="button"${chosen.length?'':' disabled'}>${esc(c().clear)}</button><button class="ba-media-primary" data-media-action="review" type="button"${chosen.length&&fresh()?'':' disabled'}>${esc(c().review)}</button></div></div>`;}
  function render(){const surface=ensureSurface();const host=byId('baMediaContent');if(!host)return;byId('baMediaSurfaceTitle').textContent=c().title;if(state.error)host.innerHTML=renderError();else if(state.view==='deleting')host.innerHTML=renderDeleting();else if(state.view==='result')host.innerHTML=renderResult();else if(state.view==='confirm')host.innerHTML=renderConfirm();else if(state.native?.scannerRunning)host.innerHTML=renderRunning();else if(!state.summary?.available)host.innerHTML=renderStart();else if(!privacyItems().length)host.innerHTML=renderEmpty();else host.innerHTML=renderResults();renderSelection();if(state.view==='results'&&state.summary?.available)requestVisiblePreviews();}

  async function loadItems(){const token=++state.token;const output=[];const seen=new Set();let offset=0;for(let page=0;page<40;page++){const result=parse(NATIVE.getReviewCandidates?.(CATEGORY,offset,PAGE_SIZE),{});if(token!==state.token)return;if(!result.available)break;const items=Array.isArray(result.items)?result.items:[];for(const item of items){if(item?.id&&!seen.has(item.id)&&['image','video','audio'].includes(mediaKind(item))){seen.add(item.id);output.push(item);}}const returned=n(result.returnedCount||items.length);if(!result.hasMore||!returned)break;offset+=returned;}if(token===state.token){state.items=output;const valid=new Set(privacyItems().map(i=>i.id));for(const id of [...state.selected])if(!valid.has(id))state.selected.delete(id);}}
  async function refresh(){state.error='';state.native=parse(NATIVE.getNativeState?.(),{});state.summary=parse(NATIVE.getReviewSummary?.(),{});if(state.summary?.available)await loadItems();else if(!state.native?.scannerRunning)state.items=[];render();updateEntry();if(state.native?.scannerRunning)startPolling();else stopPolling();}
  function startPolling(){if(state.poll)return;state.poll=setInterval(async()=>{if(!state.open){stopPolling();return;}state.native=parse(NATIVE.getNativeState?.(),{});render();if(!state.native?.scannerRunning){stopPolling();await refresh();}},POLL_MS);}
  function stopPolling(){if(state.poll){clearInterval(state.poll);state.poll=null;}}
  function startScan(){state.error='';const result=parse(NATIVE.startScan?.('quick','[]',false),{});if(result.accepted){state.native={...state.native,scannerRunning:true};state.summary={available:false};state.items=[];state.selected.clear();state.view='results';render();startPolling();return;}if(result.reason==='storage_access_required'){try{NATIVE.requestBroadStorageAccess?.();}catch(_){}return;}if(result.reason==='scan_already_running'){state.native={...state.native,scannerRunning:true};state.error='';render();startPolling();return;}state.error=`${c().errorTitle}${result.reason?` (${result.reason})`:''}`;render();}
  async function performDelete(){const chosen=selectedItems();if(!chosen.length||chosen.length>MAX_DELETE_SELECTION||!fresh())return;state.view='deleting';render();const result=parse(NATIVE.deleteReviewCandidates?.(JSON.stringify(chosen.map(i=>i.id))),{});if(!result.accepted){state.view='results';state.error=result.reason==='stale_review_snapshot'?c().staleBody:(result.reason||c().errorTitle);render();return;}state.result=result;state.selected.clear();state.summary=result.reviewSummary||parse(NATIVE.getReviewSummary?.(),{});await loadItems();state.view='result';render();updateEntry();}
  function toggle(id,checked){if(checked&&!state.selected.has(id)&&state.selected.size>=MAX_DELETE_SELECTION){state.message=c().limitReached;return;}checked?state.selected.add(id):state.selected.delete(id);render();}

  function safePreviewUrl(value){const url=String(value||'');return /^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(url)?url:'';}
  function duration(value){const total=Math.max(0,Math.round(n(value)/1000));if(!total)return'';const h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=total%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${m}:${String(s).padStart(2,'0')}`;}
  function mediaDetail(media){const parts=[];if(media?.kind==='image'&&media.width&&media.height)parts.push(`${media.width} × ${media.height}`);if(media?.kind==='video'){const d=duration(media.durationMs);if(d)parts.push(d);if(media.width&&media.height)parts.push(`${media.width} × ${media.height}`);}if(media?.kind==='audio'){if(media.title)parts.push(String(media.title));if(media.artist)parts.push(String(media.artist));const d=duration(media.durationMs);if(d)parts.push(d);}return parts.slice(0,3).join(' · ');}
  function cachePreview(id,media){if(!media?.available)return;previewCache.delete(id);previewCache.set(id,media);while(previewCache.size>80)previewCache.delete(previewCache.keys().next().value);applyPreview(id,media);}
  function applyPreview(id,media){document.querySelectorAll('[data-media-row]').forEach((row)=>{if(row.dataset.mediaRow!==String(id))return;const thumb=row.querySelector('[data-media-thumb]');const detail=row.querySelector('.ba-media-detail');const url=safePreviewUrl(media.previewDataUrl);if(thumb&&url)thumb.innerHTML=`<img src="${url}" alt="">`;const value=mediaDetail(media);if(detail){detail.textContent=value;detail.hidden=!value;}});}
  function requestPreview(id){if(!id||previewCache.has(id)||previewQueued.has(id)||(previewPending&&previewPending.id===id))return;previewQueued.add(id);previewQueue.push(id);pumpPreview();}
  function pumpPreview(){if(previewPending)return;const id=previewQueue.shift();if(!id)return;previewQueued.delete(id);const token=`am${++previewSeq}`;previewPending={id,token};let accepted={};try{accepted=parse(NATIVE.requestReviewMedia?.(id,'preview',token),{});}catch(_){accepted={};}if(!accepted.accepted){previewPending=null;pumpPreview();return;}setTimeout(()=>{if(previewPending?.token===token){previewPending=null;pumpPreview();}},10000);}
  function onMediaReady(token,raw){if(!String(token||'').startsWith('am'))return false;const media=parse(raw,{});if(previewPending?.token===token){const id=previewPending.id;previewPending=null;cachePreview(id,media);pumpPreview();}return true;}
  function installMediaCallback(){const base=window.BearagnosticReviewMedia;if(base?.__advancedMediaWrapped)return;if(!base?.onMediaReady)return;window.BearagnosticReviewMedia=Object.freeze({__advancedMediaWrapped:true,onMediaReady(token,raw){try{base.onMediaReady?.(token,raw);}catch(_){}onMediaReady(token,raw);}});}
  function requestVisiblePreviews(){installMediaCallback();requestAnimationFrame(()=>{document.querySelectorAll('#baMediaSurface:not([hidden]) [data-media-row]').forEach((row)=>{const rect=row.getBoundingClientRect();if(rect.bottom>-120&&rect.top<window.innerHeight+180)requestPreview(row.dataset.mediaRow);});});}

  function patchProPresentation(){const grid=document.querySelector('.ba-pro-feature-grid');if(grid&&!grid.querySelector('[data-b43-media]')){const article=document.createElement('article');article.className='ba-pro-feature ba-media-pro-feature';article.dataset.b43Media='1';article.innerHTML=`<span class="ba-pro-feature__icon">${icon('media')}</span><strong>${esc(c().featureTitle)}</strong><small>${esc(c().featureBody)}</small>`;grid.appendChild(article);}else if(grid){const card=grid.querySelector('[data-b43-media]');if(card){card.querySelector('strong').textContent=c().featureTitle;card.querySelector('small').textContent=c().featureBody;}}const planned=['Advanced media review & filters','Media Review และตัวกรองขั้นสูง','高度なメディアレビューとフィルター'];document.querySelectorAll('.ba-pro-roadmap__chips span').forEach((chip)=>{if(planned.includes((chip.textContent||'').trim()))chip.remove();});}
  function scheduleProPatch(){requestAnimationFrame(()=>setTimeout(patchProPresentation,0));}

  function bind(surface){surface.addEventListener('change',(event)=>{const t=event.target;if(t?.matches?.('[data-media-id]')){toggle(t.dataset.mediaId,Boolean(t.checked));return;}if(t?.matches?.('[data-media-filter]')){const key=t.dataset.mediaFilter;if(key==='size')state.size=t.value||'any';else if(key==='age')state.age=t.value||'any';else if(key==='sort')state.sort=t.value||'largest';state.renderLimit=RENDER_BATCH;render();}});surface.addEventListener('click',async(event)=>{const type=event.target?.closest?.('[data-media-type]');if(type){state.type=type.dataset.mediaType||'all';state.renderLimit=RENDER_BATCH;render();return;}const b=event.target?.closest?.('[data-media-action]');if(!b)return;const action=b.dataset.mediaAction;if(action==='close')close();else if(action==='scan')startScan();else if(action==='retry')await refresh();else if(action==='clear'){state.selected.clear();render();}else if(action==='more'){state.renderLimit+=RENDER_BATCH;render();}else if(action==='review'){if(selectedItems().length&&fresh()){state.view='confirm';render();surface.querySelector('.ba-media-scroll')?.scrollTo?.({top:0});}}else if(action==='back'){state.view='results';render();}else if(action==='delete')await performDelete();else if(action==='remaining'){state.view='results';state.result=null;render();}});}
  async function open(){if(!canUse()){ENT.requestPro?.('advanced_media_review',CAPABILITY);scheduleProPatch();return;}ensureEntry();const surface=ensureSurface();state.open=true;state.view='results';state.error='';state.result=null;state.renderLimit=RENDER_BATCH;surface.hidden=false;document.body.classList.add('ba-media-open');await refresh();requestAnimationFrame(()=>surface.querySelector('[data-media-action="close"]')?.focus?.());}
  function close(){state.open=false;stopPolling();const surface=byId('baMediaSurface');if(surface)surface.hidden=true;document.body.classList.remove('ba-media-open');state.selected.clear();previewQueue.length=0;previewQueued.clear();previewPending=null;updateEntry();document.querySelector('#toolsScreen [data-tool="advanced-media"]')?.focus?.();}
  function initialize(){ensureStyle();ensureEntry();updateEntry();installMediaCallback();}

  document.addEventListener('click',(event)=>{const trigger=event.target?.closest?.('[data-tool="advanced-media"]');if(!trigger||trigger.closest('#baMediaSurface'))return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();open();},true);
  window.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&state.open&&state.view!=='deleting')close();});
  window.addEventListener('bearagnostic:languagechange',()=>{updateEntry();if(state.open)render();scheduleProPatch();});
  window.addEventListener('bearagnostic:entitlementchange',()=>{updateEntry();if(state.open&&!canUse())close();scheduleProPatch();});
  window.addEventListener('bearagnostic:prorequest',scheduleProPatch);
  window.addEventListener('bearagnostic:hiddenitemschange',()=>{if(state.open)render();});
  window.addEventListener('focus',()=>{if(state.open)refresh();else updateEntry();});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();

  window.BearagnosticAdvancedMedia=Object.freeze({build:BUILD,open,close,refresh});
})();
