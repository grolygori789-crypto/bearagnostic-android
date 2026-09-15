(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const BUILD = 42;
  const FULL_SCOPE = 'accessible_shared_storage';
  const COMPLETE_COVERAGE = 'complete_accessible_scope';
  const MAX_TREND_POINTS = 7;
  const MAX_TIMELINE_ITEMS = 6;

  const byId = (id) => document.getElementById(id);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const n = (value) => Math.max(0, Number(value) || 0);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const parse = (value, fallback = {}) => {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || fallback); }
    catch (_) { return fallback; }
  };

  let clearConfirm = false;

  const COPY = {
    en: {
      kicker:'INSIGHTS', title:'Your storage, explained over time.',
      lead:'Built only from completed checkups and verified cleanups on this device. No invented score.',
      local:'LOCAL ONLY', aggregate:'Aggregate history',
      noHistoryTitle:'History starts with your next checkup',
      noHistoryBody:'Run a real checkup and Bearagnostic will begin a private, aggregate-only timeline on this device.',
      goCheckup:'Go to Checkup', privacyLine:'No account · No cloud · No file names or paths stored',
      latest:'LATEST CHECKUP', latestTitle:'What Bearagnostic saw', files:'Files', scannedData:'Accessible data', reviewItems:'Review items', checked:'Checked',
      modeQuick:'Quick', modeSmart:'Smart', modeDeep:'Deep', modeCustom:'Custom', modeUnknown:'Checkup',
      deviceStorage:'DEVICE STORAGE', deviceTitle:'Space on this device', used:'Used', free:'Free', storageUnavailable:'Device storage snapshot unavailable',
      changed:'WHAT CHANGED', changedTitle:'Since the previous comparable checkup',
      needAnother:'One more full-scope checkup is needed before Bearagnostic can compare changes.',
      selectedScope:'The latest checkup used a selected scope. Run Quick, Smart, or Deep for a comparable full-scope change view.',
      partialScope:'The latest full-scope checkup was partial. Bearagnostic will not compare it as if coverage were complete.',
      accessibleData:'Accessible data', fileCount:'File count', downloads:'Downloads', noChange:'No measurable change',
      more:'more', less:'less', since:'since',
      trend:'STORAGE TREND', trendTitle:'Comparable checkups', trendBody:'Accessible-file totals from complete full-scope checkups only.',
      history:'CHECKUP HISTORY', historyTitle:'Recent completed checkups', complete:'Complete', partial:'Partial',
      cleanup:'VERIFIED CLEANUP', cleanupTitle:'What Bearagnostic actually removed', cleanups:'Cleanup events', removed:'Items removed', reclaimed:'Verified space', noCleanups:'No verified cleanup has been recorded yet.',
      fileCleanup:'Files cleaned', folderCleanup:'Empty folders removed', verified:'Verified',
      pattern:'PATTERN', patternTitle:'A useful signal, only when the data supports it',
      patternNeed:'Bearagnostic needs at least three comparable full-scope checkups before calling something a pattern.',
      steady:'Accessible storage has stayed fairly steady across your last three comparable checkups.',
      downloadsGrow:'Downloads grew by {value} across your last three comparable checkups.',
      downloadsShrink:'Downloads decreased by {value} across your last three comparable checkups.',
      largeGrow:'Large-file footprint grew by {value} across your last three comparable checkups.',
      largeShrink:'Large-file footprint decreased by {value} across your last three comparable checkups.',
      storageGrow:'Accessible data grew by {value} across your last three comparable checkups.',
      storageShrink:'Accessible data decreased by {value} across your last three comparable checkups.',
      proTitle:'Historical Insights are a Pro feature',
      proBody:'Latest checkup facts remain visible for everyone. Pro adds on-device history, What Changed, patterns, and full verified cleanup history.',
      privacy:'PRIVACY', privacyTitle:'History stays under your control',
      privacyBody:'Bearagnostic stores only aggregate totals on this device — never file names, paths, hashes, or file contents. History is bounded to 30 checkups and 50 cleanup events.',
      clear:'Clear local history', clearAsk:'Clear all local Insights history?', clearBody:'This removes saved checkup and cleanup aggregates from Bearagnostic. It does not delete any of your files.', cancel:'Cancel', clearNow:'Clear history',
      proFeatureTitle:'Insights & Local History', proFeatureBody:'Historical checkups, What Changed, real storage trends, patterns, and verified cleanup history — all kept on this device.', plannedInsights:'Historical Insights & What Changed', plannedCleanup:'Full cleanup history',
      justNow:'just now', minutesAgo:'{n} min ago', hoursAgo:'{n} hr ago', daysAgo:'{n} d ago',
    },
    th: {
      kicker:'ข้อมูลเชิงลึก', title:'มองพื้นที่จัดเก็บผ่านข้อมูลจริงตามเวลา',
      lead:'สร้างจากการตรวจที่เสร็จจริงและการลบที่ยืนยันแล้วบนเครื่องนี้เท่านั้น ไม่มีคะแนนที่แต่งขึ้น',
      local:'อยู่ในเครื่อง', aggregate:'ประวัติแบบสรุป',
      noHistoryTitle:'ประวัติจะเริ่มจากการตรวจครั้งถัดไป',
      noHistoryBody:'เริ่มตรวจเครื่องจริง แล้ว Bearagnostic จะสร้างไทม์ไลน์แบบสรุปและเป็นส่วนตัวไว้บนเครื่องนี้',
      goCheckup:'ไปที่ Checkup', privacyLine:'ไม่ต้องมีบัญชี · ไม่ขึ้นคลาวด์ · ไม่เก็บชื่อไฟล์หรือพาธ',
      latest:'การตรวจล่าสุด', latestTitle:'สิ่งที่ Bearagnostic พบ', files:'ไฟล์', scannedData:'ข้อมูลที่เข้าถึงได้', reviewItems:'รายการให้ตรวจ', checked:'ตรวจเมื่อ',
      modeQuick:'Quick', modeSmart:'Smart', modeDeep:'Deep', modeCustom:'Custom', modeUnknown:'Checkup',
      deviceStorage:'พื้นที่เครื่อง', deviceTitle:'พื้นที่จัดเก็บบนอุปกรณ์นี้', used:'ใช้แล้ว', free:'ว่าง', storageUnavailable:'ไม่มี snapshot พื้นที่เครื่องสำหรับรอบนี้',
      changed:'มีอะไรเปลี่ยนไป', changedTitle:'เทียบกับการตรวจครั้งก่อนที่ขอบเขตเทียบกันได้',
      needAnother:'ต้องมีการตรวจเต็มขอบเขตอีกหนึ่งครั้งก่อน Bearagnostic จะเปรียบเทียบการเปลี่ยนแปลงได้',
      selectedScope:'การตรวจล่าสุดใช้ขอบเขตที่เลือกไว้ ให้ใช้ Quick, Smart หรือ Deep เพื่อสร้างการเปรียบเทียบเต็มขอบเขตที่เทียบกันได้',
      partialScope:'การตรวจเต็มขอบเขตล่าสุดเป็นแบบไม่สมบูรณ์ Bearagnostic จะไม่เปรียบเทียบเหมือนข้อมูลครอบคลุมครบ',
      accessibleData:'ข้อมูลที่เข้าถึงได้', fileCount:'จำนวนไฟล์', downloads:'Downloads', noChange:'แทบไม่เปลี่ยน',
      more:'มากขึ้น', less:'น้อยลง', since:'จาก',
      trend:'แนวโน้มพื้นที่', trendTitle:'การตรวจที่เทียบกันได้', trendBody:'ใช้ยอดข้อมูลจากการตรวจเต็มขอบเขตที่ครอบคลุมสมบูรณ์เท่านั้น',
      history:'ประวัติการตรวจ', historyTitle:'การตรวจที่เสร็จล่าสุด', complete:'สมบูรณ์', partial:'บางส่วน',
      cleanup:'การลบที่ยืนยันแล้ว', cleanupTitle:'สิ่งที่ Bearagnostic ลบออกจริง', cleanups:'ครั้งที่ลบ', removed:'รายการที่ลบ', reclaimed:'พื้นที่ที่ยืนยัน', noCleanups:'ยังไม่มีประวัติการลบที่ยืนยันแล้ว',
      fileCleanup:'ลบไฟล์', folderCleanup:'ลบโฟลเดอร์ว่าง', verified:'ยืนยันแล้ว',
      pattern:'รูปแบบ', patternTitle:'แสดงเฉพาะสัญญาณที่ข้อมูลรองรับจริง',
      patternNeed:'Bearagnostic ต้องมีการตรวจเต็มขอบเขตที่เทียบกันได้อย่างน้อยสามครั้งก่อนเรียกสิ่งใดว่าเป็นรูปแบบ',
      steady:'ข้อมูลที่เข้าถึงได้ค่อนข้างคงที่ในการตรวจเต็มขอบเขตสามครั้งล่าสุด',
      downloadsGrow:'ข้อมูลใน Downloads เพิ่มขึ้น {value} ในการตรวจที่เทียบกันได้สามครั้งล่าสุด',
      downloadsShrink:'ข้อมูลใน Downloads ลดลง {value} ในการตรวจที่เทียบกันได้สามครั้งล่าสุด',
      largeGrow:'พื้นที่ของไฟล์ขนาดใหญ่เพิ่มขึ้น {value} ในการตรวจที่เทียบกันได้สามครั้งล่าสุด',
      largeShrink:'พื้นที่ของไฟล์ขนาดใหญ่ลดลง {value} ในการตรวจที่เทียบกันได้สามครั้งล่าสุด',
      storageGrow:'ข้อมูลที่เข้าถึงได้เพิ่มขึ้น {value} ในการตรวจที่เทียบกันได้สามครั้งล่าสุด',
      storageShrink:'ข้อมูลที่เข้าถึงได้ลดลง {value} ในการตรวจที่เทียบกันได้สามครั้งล่าสุด',
      proTitle:'Historical Insights เป็นฟีเจอร์ Pro',
      proBody:'ทุกคนยังเห็นข้อมูลการตรวจล่าสุดได้ ส่วน Pro เพิ่มประวัติบนเครื่อง What Changed รูปแบบ และประวัติการลบที่ยืนยันแล้วทั้งหมด',
      privacy:'ความเป็นส่วนตัว', privacyTitle:'ประวัติอยู่ภายใต้การควบคุมของคุณ',
      privacyBody:'Bearagnostic เก็บเฉพาะยอดรวมบนเครื่องนี้ ไม่เก็บชื่อไฟล์ พาธ แฮช หรือเนื้อหาไฟล์ และจำกัดไว้สูงสุด 30 การตรวจกับ 50 เหตุการณ์ลบ',
      clear:'ล้างประวัติในเครื่อง', clearAsk:'ล้างประวัติ Insights ทั้งหมดหรือไม่', clearBody:'ระบบจะลบเฉพาะข้อมูลสรุปการตรวจและการลบที่ Bearagnostic บันทึกไว้ ไม่ได้ลบไฟล์ของคุณ', cancel:'ยกเลิก', clearNow:'ล้างประวัติ',
      proFeatureTitle:'Insights และประวัติในเครื่อง', proFeatureBody:'ดูประวัติการตรวจ What Changed แนวโน้มพื้นที่ รูปแบบ และประวัติการลบที่ยืนยันแล้ว โดยเก็บไว้บนเครื่องนี้เท่านั้น', plannedInsights:'Insights ย้อนหลังและ What Changed', plannedCleanup:'ประวัติการทำความสะอาดแบบเต็ม',
      justNow:'เมื่อสักครู่', minutesAgo:'{n} นาทีที่แล้ว', hoursAgo:'{n} ชม.ที่แล้ว', daysAgo:'{n} วันที่แล้ว',
    },
    ja: {
      kicker:'インサイト', title:'ストレージの変化を、実データで。',
      lead:'この端末で完了したチェックと検証済みの削除だけから作成します。架空のスコアは使いません。',
      local:'端末内のみ', aggregate:'集計履歴',
      noHistoryTitle:'次のチェックから履歴が始まります',
      noHistoryBody:'実際のチェックを実行すると、集計のみのプライベートな履歴をこの端末に保存します。',
      goCheckup:'Checkup へ', privacyLine:'アカウント不要 · クラウドなし · ファイル名やパスは保存しません',
      latest:'最新のチェック', latestTitle:'Bearagnostic が確認した内容', files:'ファイル', scannedData:'アクセス可能データ', reviewItems:'確認項目', checked:'確認時刻',
      modeQuick:'Quick', modeSmart:'Smart', modeDeep:'Deep', modeCustom:'Custom', modeUnknown:'Checkup',
      deviceStorage:'端末ストレージ', deviceTitle:'この端末の空き容量', used:'使用済み', free:'空き', storageUnavailable:'このチェックには端末ストレージ snapshot がありません',
      changed:'変化', changedTitle:'比較可能な前回チェックとの差',
      needAnother:'比較するには、もう一度フルスコープのチェックが必要です。',
      selectedScope:'最新チェックは選択範囲のみです。Quick、Smart、Deep のいずれかでフルスコープ比較を作成してください。',
      partialScope:'最新のフルスコープチェックは部分的でした。完全な範囲として比較しません。',
      accessibleData:'アクセス可能データ', fileCount:'ファイル数', downloads:'Downloads', noChange:'大きな変化なし',
      more:'増加', less:'減少', since:'前回比',
      trend:'ストレージ推移', trendTitle:'比較可能なチェック', trendBody:'完全なフルスコープチェックのアクセス可能データだけを表示します。',
      history:'チェック履歴', historyTitle:'最近完了したチェック', complete:'完全', partial:'部分',
      cleanup:'検証済みクリーンアップ', cleanupTitle:'実際に削除されたもの', cleanups:'削除イベント', removed:'削除項目', reclaimed:'確認済み容量', noCleanups:'検証済みクリーンアップ履歴はまだありません。',
      fileCleanup:'ファイルを削除', folderCleanup:'空フォルダを削除', verified:'検証済み',
      pattern:'パターン', patternTitle:'データが裏付ける場合だけ表示',
      patternNeed:'パターンと呼ぶには、比較可能なフルスコープチェックが少なくとも 3 回必要です。',
      steady:'直近 3 回の比較可能なチェックでは、アクセス可能データはほぼ安定しています。',
      downloadsGrow:'直近 3 回で Downloads が {value} 増えました。', downloadsShrink:'直近 3 回で Downloads が {value} 減りました。',
      largeGrow:'直近 3 回で大容量ファイルが {value} 増えました。', largeShrink:'直近 3 回で大容量ファイルが {value} 減りました。',
      storageGrow:'直近 3 回でアクセス可能データが {value} 増えました。', storageShrink:'直近 3 回でアクセス可能データが {value} 減りました。',
      proTitle:'履歴インサイトは Pro 機能です',
      proBody:'最新チェックの事実は全ユーザーに表示されます。Pro では端末内履歴、What Changed、パターン、完全な検証済み削除履歴を利用できます。',
      privacy:'プライバシー', privacyTitle:'履歴はあなたの管理下にあります',
      privacyBody:'この端末に集計値だけを保存します。ファイル名、パス、ハッシュ、内容は保存しません。最大 30 回のチェックと 50 件の削除イベントに制限されます。',
      clear:'端末内履歴を消去', clearAsk:'Insights のローカル履歴をすべて消去しますか？', clearBody:'Bearagnostic が保存したチェックと削除の集計だけを消去します。ファイルは削除しません。', cancel:'キャンセル', clearNow:'履歴を消去',
      proFeatureTitle:'Insights とローカル履歴', proFeatureBody:'チェック履歴、What Changed、実データの推移、パターン、検証済み削除履歴をすべて端末内で利用できます。', plannedInsights:'履歴 Insights と What Changed', plannedCleanup:'完全なクリーンアップ履歴',
      justNow:'たった今', minutesAgo:'{n}分前', hoursAgo:'{n}時間前', daysAgo:'{n}日前',
    },
  };

  function language() {
    const lang = (document.documentElement.lang || 'en').toLowerCase();
    return lang.startsWith('th') ? 'th' : lang.startsWith('ja') ? 'ja' : 'en';
  }
  function c() { return COPY[language()] || COPY.en; }
  function fill(template, values) { return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? ''); }

  function formatBytes(value) {
    let bytes = n(value);
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    const units = ['KB','MB','GB','TB'];
    let index = -1;
    do { bytes /= 1024; index++; } while (bytes >= 1024 && index < units.length - 1);
    const digits = bytes >= 100 ? 0 : bytes >= 10 ? 1 : 2;
    return `${bytes.toFixed(digits)} ${units[index]}`;
  }

  function formatCount(value) {
    try { return new Intl.NumberFormat(language() === 'th' ? 'th-TH' : language() === 'ja' ? 'ja-JP' : 'en-US').format(n(value)); }
    catch (_) { return String(n(value)); }
  }

  function formatDate(ms, withTime = false) {
    const value = n(ms);
    if (!value) return '—';
    const locale = language() === 'th' ? 'th-TH' : language() === 'ja' ? 'ja-JP' : 'en-US';
    try {
      return new Intl.DateTimeFormat(locale, withTime
        ? {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}
        : {month:'short', day:'numeric'}).format(new Date(value));
    } catch (_) { return new Date(value).toLocaleString(); }
  }

  function relativeTime(ms) {
    const copy = c();
    const delta = Math.max(0, Date.now() - n(ms));
    const minutes = Math.floor(delta / 60000);
    if (minutes < 1) return copy.justNow;
    if (minutes < 60) return fill(copy.minutesAgo, {n: minutes});
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return fill(copy.hoursAgo, {n: hours});
    const days = Math.floor(hours / 24);
    if (days < 14) return fill(copy.daysAgo, {n: days});
    return formatDate(ms, false);
  }

  function modeLabel(mode) {
    const copy = c();
    return ({quick:copy.modeQuick,smart:copy.modeSmart,deep:copy.modeDeep,custom:copy.modeCustom})[String(mode || '').toLowerCase()] || copy.modeUnknown;
  }

  function ensureStyle() {
    if (byId('androidInsightsStyle')) return;
    const style = document.createElement('style');
    style.id = 'androidInsightsStyle';
    style.textContent = `
      #insightsScreen.ba-insights-screen{overflow-y:auto!important;overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch;padding-top:clamp(8px,1.2dvh,14px)!important;padding-bottom:24px!important;scrollbar-width:none}
      #insightsScreen.ba-insights-screen::-webkit-scrollbar{display:none}
      #insightsScreen.ba-insights-screen:before{display:none!important}
      .ba-insights{position:relative;max-width:620px;margin:0 auto;color:#1c3046}
      .ba-insights-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:start;padding:4px 4px 13px}
      .ba-insights-kicker{display:block;font-size:10px;letter-spacing:.24em;text-transform:uppercase;font-weight:850;color:#655dc0;margin-bottom:7px}
      .ba-insights-head h2{margin:0;font-family:var(--editorial);font-weight:400;font-size:clamp(31px,8.4vw,45px);line-height:1.04;letter-spacing:-.035em;color:#18283d;text-wrap:balance}
      .ba-insights-head p{margin:10px 0 0;max-width:43ch;font-size:13px;line-height:1.55;color:#66798c}
      .ba-insights-local{align-self:start;display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 9px;border-radius:999px;background:linear-gradient(145deg,#e8f8f4,#f4fbff);border:1px solid rgba(30,152,128,.10);color:#2a8877;font-size:8.5px;font-weight:850;letter-spacing:.10em;white-space:nowrap}.ba-insights-local:before{content:'';width:6px;height:6px;border-radius:50%;background:#29ae91;box-shadow:0 0 0 3px rgba(41,174,145,.09)}
      .ba-insights-card{margin-top:10px;border-radius:26px;background:rgba(255,255,255,.92);border:1px solid rgba(255,255,255,.98);box-shadow:0 12px 30px rgba(60,88,119,.075);overflow:hidden}
      .ba-insights-card-pad{padding:16px}
      .ba-insights-section-kicker{display:block;font-size:9px;letter-spacing:.18em;font-weight:850;text-transform:uppercase;color:#6d7f91;margin-bottom:5px}
      .ba-insights-title-row{display:flex;align-items:center;justify-content:space-between;gap:12px}.ba-insights-title-row h3{margin:0;font-size:19px;line-height:1.14;letter-spacing:-.025em;color:#1d3248}.ba-insights-title-row small{font-size:10px;color:#81909e;white-space:nowrap}
      .ba-insights-latest{display:grid;grid-template-columns:74px minmax(0,1fr);gap:14px;align-items:center;padding:15px;background:linear-gradient(135deg,#f2f7ff 0%,#f5fbff 49%,#eefaf7 100%)}
      .ba-insights-glass{width:74px;height:74px;border-radius:24px;display:grid;place-items:center;background:rgba(255,255,255,.82);box-shadow:0 11px 26px rgba(56,100,148,.10),inset 0 1px #fff;border:1px solid rgba(255,255,255,.98);overflow:hidden}.ba-insights-glass img{width:65px;height:65px;object-fit:contain}
      .ba-insights-latest h3{margin:4px 0 0;font-size:20px;line-height:1.12;letter-spacing:-.025em}.ba-insights-latest p{margin:6px 0 0;font-size:11.5px;line-height:1.45;color:#687d90}.ba-insights-mode{display:inline-flex;align-items:center;gap:5px;padding:4px 7px;border-radius:999px;background:#e9f3fe;color:#3f78a8;font-size:8.5px;font-weight:800;letter-spacing:.06em}
      .ba-insights-metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.ba-insights-metric{min-width:0;padding:12px;border-radius:18px;background:#f6f9fc;border:1px solid rgba(83,113,140,.06)}.ba-insights-metric:nth-child(2){background:#f1faf7}.ba-insights-metric:nth-child(3){background:#f7f5ff}.ba-insights-metric:nth-child(4){background:#fff8e9}.ba-insights-metric b{display:block;font-size:18px;line-height:1.05;color:#233b53;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-insights-metric span{display:block;margin-top:5px;font-size:10.5px;color:#758697}
      .ba-insights-storage{padding:15px 16px;background:linear-gradient(145deg,#f9fbfd,#f0f7fb)}.ba-insights-storage-row{display:flex;justify-content:space-between;gap:10px;align-items:end}.ba-insights-storage-row b{font-size:19px;color:#20364c}.ba-insights-storage-row span{font-size:10.5px;color:#748698}.ba-insights-bar{height:10px;margin-top:11px;border-radius:999px;background:#dfeaf2;overflow:hidden;box-shadow:inset 0 1px 2px rgba(53,80,106,.08)}.ba-insights-bar>i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#31bde8,#247fdf 67%,#6f66d3);min-width:2px}.ba-insights-storage-legend{display:flex;justify-content:space-between;margin-top:7px;font-size:10px;color:#758799}
      .ba-insights-delta-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:12px}.ba-insights-delta{min-width:0;padding:11px 9px;border-radius:17px;background:#f6f9fc;border:1px solid rgba(86,112,138,.06)}.ba-insights-delta b{display:block;font-size:14px;line-height:1.1;color:#253c54;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-insights-delta span{display:block;margin-top:5px;font-size:9.5px;line-height:1.3;color:#788999}.ba-insights-delta.is-up b{color:#53759a}.ba-insights-delta.is-down b{color:#258d78}
      .ba-insights-note{margin-top:12px;padding:12px 13px;border-radius:18px;background:linear-gradient(135deg,#f0f7fc,#f8fbfd);border:1px solid rgba(67,128,166,.07);font-size:11.5px;line-height:1.5;color:#597386}
      .ba-insights-chart-wrap{margin-top:12px;padding:12px;border-radius:19px;background:linear-gradient(160deg,#f7f5ff,#f1f9fd 62%,#f0faf7);border:1px solid rgba(97,93,172,.07)}.ba-insights-chart{display:block;width:100%;height:104px;overflow:visible}.ba-insights-chart .grid{stroke:rgba(82,107,133,.10);stroke-width:1}.ba-insights-chart .area{fill:url(#baInsightArea)}.ba-insights-chart .line{fill:none;stroke:#6673d4;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}.ba-insights-chart .dot{fill:#fff;stroke:#6170d3;stroke-width:2}.ba-insights-chart-labels{display:flex;justify-content:space-between;margin-top:3px;font-size:9.5px;color:#82909d}
      .ba-insights-list{display:grid;gap:7px;margin-top:11px}.ba-insights-row{display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 11px;border-radius:17px;background:#f7f9fc;border:1px solid rgba(90,113,137,.055)}.ba-insights-row-icon{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;background:#eaf4fb;color:#547d9e}.ba-insights-row-icon svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}.ba-insights-row-copy{min-width:0}.ba-insights-row-copy strong{display:block;font-size:12.5px;color:#2a4057;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-insights-row-copy small{display:block;margin-top:3px;font-size:10px;color:#7b8a99;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ba-insights-row-side{text-align:right}.ba-insights-row-side b{display:block;font-size:11px;color:#486a86}.ba-insights-row-side small{display:block;margin-top:3px;font-size:9px;color:#8a96a1}
      .ba-insights-pattern{display:grid;grid-template-columns:44px minmax(0,1fr);gap:12px;align-items:start;padding:15px;background:linear-gradient(135deg,#f4f1ff,#f2f9fd 55%,#eefaf6)}.ba-insights-pattern-icon{width:44px;height:44px;border-radius:15px;display:grid;place-items:center;background:#ebe7ff;color:#6a60c8}.ba-insights-pattern-icon svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ba-insights-pattern strong{display:block;font-size:13px;color:#34415b}.ba-insights-pattern p{margin:5px 0 0;font-size:11.5px;line-height:1.5;color:#617487}
      .ba-insights-pro{padding:15px;background:linear-gradient(135deg,#f5f2ff,#f7fbff);border-color:rgba(105,91,190,.08)}.ba-insights-pro-head{display:grid;grid-template-columns:40px minmax(0,1fr);gap:11px;align-items:center}.ba-insights-pro-icon{width:40px;height:40px;border-radius:14px;display:grid;place-items:center;background:#e9e4ff;color:#655bc2}.ba-insights-pro-icon svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8}.ba-insights-pro strong{display:block;font-size:13px;color:#3c4160}.ba-insights-pro p{margin:5px 0 0;font-size:11.5px;line-height:1.48;color:#6a7189}
      .ba-insights-privacy{padding:15px;background:linear-gradient(135deg,#eefaf6,#f7fbfd)}.ba-insights-privacy h3{margin:0;font-size:16px;color:#29463f}.ba-insights-privacy p{margin:7px 0 0;font-size:11.5px;line-height:1.52;color:#607d76}.ba-insights-privacy-line{display:block;margin-top:8px;font-size:9.5px;font-weight:750;color:#3f8d7c}.ba-insights-clear{margin-top:12px;min-height:38px;padding:0 12px;border-radius:13px;background:#f0f4f6;color:#687887;border:1px solid rgba(93,115,134,.08);font-size:10.5px;font-weight:780}.ba-insights-clear.is-danger{background:#fff0f1;color:#b44d57;border-color:rgba(190,74,84,.10)}.ba-insights-clear-actions{display:flex;gap:8px;margin-top:11px}.ba-insights-clear-actions button{min-height:39px;padding:0 13px;border-radius:13px;font-size:10.5px;font-weight:780}.ba-insights-clear-actions .cancel{background:#eef3f6;color:#617488}.ba-insights-clear-actions .danger{background:#c8525c;color:#fff}
      .ba-insights-empty{margin-top:8px;min-height:clamp(390px,56dvh,560px);display:grid;place-content:center;justify-items:center;text-align:center;padding:32px 20px;border-radius:30px;background:linear-gradient(145deg,rgba(255,255,255,.94),rgba(244,250,254,.94));border:1px solid rgba(255,255,255,.98);box-shadow:0 14px 34px rgba(62,90,120,.08)}.ba-insights-empty img{width:112px;height:112px;object-fit:contain;margin-bottom:18px;filter:drop-shadow(0 11px 20px rgba(42,105,161,.10))}.ba-insights-empty h3{margin:0;font-family:var(--editorial);font-weight:400;font-size:28px;line-height:1.08;color:#1b2e43}.ba-insights-empty p{max-width:36ch;margin:10px auto 0;font-size:12.5px;line-height:1.55;color:#708192}.ba-insights-primary{min-height:46px;margin-top:18px;padding:0 18px;border-radius:16px;color:#fff;background:linear-gradient(118deg,#26b8e9,#0a82e8);font-size:12px;font-weight:800;box-shadow:0 10px 22px rgba(14,133,220,.17)}

      .ba-pro-feature[data-b42-insights]{grid-column:1/-1;display:grid;grid-template-columns:31px minmax(0,1fr);column-gap:10px;align-items:center;background:linear-gradient(145deg,#f7f4ff,#f1f9fd)!important}.ba-pro-feature[data-b42-insights] .ba-pro-feature__icon{grid-column:1;grid-row:1/3;margin-bottom:0!important;background:linear-gradient(145deg,#ebe7ff,#e8f6ff)!important;color:#655bc2!important}.ba-pro-feature[data-b42-insights]>strong,.ba-pro-feature[data-b42-insights]>small{grid-column:2}.ba-pro-feature[data-b42-insights] .ba-pro-feature__icon svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
      @media(max-width:370px){.ba-insights-head{grid-template-columns:1fr}.ba-insights-local{justify-self:start}.ba-insights-delta-grid{grid-template-columns:1fr}.ba-insights-latest{grid-template-columns:62px minmax(0,1fr)}.ba-insights-glass{width:62px;height:62px;border-radius:20px}.ba-insights-glass img{width:55px;height:55px}}
    `;
    document.head.appendChild(style);
  }

  function icon(name) {
    const paths = {
      history:'<path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 5v7h7"/><path d="M12 8v4l3 2"/>',
      cleanup:'<path d="M5 7h14M9 7V4h6v3M8 10v7M12 10v7M16 10v7M7 7l1 13h8l1-13"/>',
      folder:'<path d="M4 7h7l2 2h7v10H4z"/>',
      spark:'<path d="m4 15 4-4 3 3 5-7 4 4"/><path d="M17 7h3v3"/>',
      lock:'<rect x="6" y="10" width="12" height="10" rx="2"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10"/>',
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.history}</svg>`;
  }

  function historyData() { return parse(NATIVE.getInsightsHistory?.(), {available:false, scans:[], cleanups:[], access:{}}); }

  function latestComparable(scans) {
    return (Array.isArray(scans) ? scans : []).filter((item) => item && item.scope === FULL_SCOPE && item.coverageStatus === COMPLETE_COVERAGE);
  }

  function deltaClass(delta) { return delta > 0 ? 'is-up' : delta < 0 ? 'is-down' : ''; }

  function deltaText(delta, kind = 'bytes') {
    const copy = c();
    const magnitude = Math.abs(delta);
    const tiny = kind === 'bytes' ? magnitude < 1024 : magnitude < 1;
    if (tiny) return copy.noChange;
    const value = kind === 'bytes' ? formatBytes(magnitude) : formatCount(magnitude);
    return `${delta > 0 ? '+' : '−'}${value}`;
  }

  function renderLatest(latest) {
    const copy = c();
    return `<section class="ba-insights-card ba-insights-latest">
      <div class="ba-insights-glass"><img src="./assets/ui/glass-icons/insights.webp" alt="" aria-hidden="true"></div>
      <div><span class="ba-insights-section-kicker">${esc(copy.latest)}</span><span class="ba-insights-mode">${esc(modeLabel(latest.scanMode))}</span><h3>${esc(copy.latestTitle)}</h3><p>${esc(relativeTime(latest.capturedAtMs))} · ${esc(latest.coverageStatus === COMPLETE_COVERAGE ? copy.complete : copy.partial)}</p></div>
      <div class="ba-insights-metrics" style="grid-column:1/-1">
        <div class="ba-insights-metric"><b>${esc(formatCount(latest.reviewedFiles))}</b><span>${esc(copy.files)}</span></div>
        <div class="ba-insights-metric"><b>${esc(formatBytes(latest.totalBytes))}</b><span>${esc(copy.scannedData)}</span></div>
        <div class="ba-insights-metric"><b>${esc(formatCount(latest.reviewCandidateCount))}</b><span>${esc(copy.reviewItems)}</span></div>
        <div class="ba-insights-metric"><b>${esc(relativeTime(latest.capturedAtMs))}</b><span>${esc(copy.checked)}</span></div>
      </div>
    </section>`;
  }

  function renderStorage(latest) {
    const copy = c();
    const storage = latest?.deviceStorage;
    if (!storage || !n(storage.totalBytes)) {
      return `<section class="ba-insights-card ba-insights-card-pad"><span class="ba-insights-section-kicker">${esc(copy.deviceStorage)}</span><div class="ba-insights-title-row"><h3>${esc(copy.deviceTitle)}</h3></div><div class="ba-insights-note">${esc(copy.storageUnavailable)}</div></section>`;
    }
    const total = n(storage.totalBytes), used = Math.min(total, n(storage.usedBytes)), free = Math.max(0, total - used);
    const usedPct = total > 0 ? Math.max(0, Math.min(100, used / total * 100)) : 0;
    return `<section class="ba-insights-card ba-insights-storage"><span class="ba-insights-section-kicker">${esc(copy.deviceStorage)}</span><div class="ba-insights-storage-row"><b>${esc(copy.deviceTitle)}</b><span>${esc(formatBytes(total))}</span></div><div class="ba-insights-bar" aria-hidden="true"><i style="width:${usedPct.toFixed(2)}%"></i></div><div class="ba-insights-storage-legend"><span>${esc(copy.used)} · ${esc(formatBytes(used))}</span><span>${esc(copy.free)} · ${esc(formatBytes(free))}</span></div></section>`;
  }

  function renderChanged(history, latest) {
    const copy = c();
    if (!history.access?.whatChanged) return renderProLock();
    if (latest.scope !== FULL_SCOPE) return sectionNote(copy.changed, copy.changedTitle, copy.selectedScope);
    if (latest.coverageStatus !== COMPLETE_COVERAGE) return sectionNote(copy.changed, copy.changedTitle, copy.partialScope);
    const comparable = latestComparable(history.scans);
    if (comparable.length < 2) return sectionNote(copy.changed, copy.changedTitle, copy.needAnother);
    const current = comparable[comparable.length - 1];
    const previous = comparable[comparable.length - 2];
    const values = [
      {label:copy.accessibleData, delta:n(current.totalBytes)-n(previous.totalBytes), kind:'bytes'},
      {label:copy.fileCount, delta:n(current.reviewedFiles)-n(previous.reviewedFiles), kind:'count'},
      {label:copy.downloads, delta:n(current.downloadBytes)-n(previous.downloadBytes), kind:'bytes'},
    ];
    return `<section class="ba-insights-card ba-insights-card-pad"><span class="ba-insights-section-kicker">${esc(copy.changed)}</span><div class="ba-insights-title-row"><h3>${esc(copy.changedTitle)}</h3><small>${esc(formatDate(previous.capturedAtMs))}</small></div><div class="ba-insights-delta-grid">${values.map((item)=>`<div class="ba-insights-delta ${deltaClass(item.delta)}"><b>${esc(deltaText(item.delta,item.kind))}</b><span>${esc(item.label)}</span></div>`).join('')}</div></section>`;
  }

  function sectionNote(kicker, title, body) {
    return `<section class="ba-insights-card ba-insights-card-pad"><span class="ba-insights-section-kicker">${esc(kicker)}</span><div class="ba-insights-title-row"><h3>${esc(title)}</h3></div><div class="ba-insights-note">${esc(body)}</div></section>`;
  }

  function chartMarkup(scans) {
    const points = scans.slice(-MAX_TREND_POINTS);
    if (points.length < 2) return '';
    const values = points.map((item) => n(item.totalBytes));
    const min = Math.min(...values), max = Math.max(...values), spread = Math.max(1, max - min);
    const width = 300, height = 92, px = 12, py = 12;
    const coords = values.map((value, index) => {
      const x = px + (index * ((width - px * 2) / Math.max(1, values.length - 1)));
      const normalized = (value - min) / spread;
      const y = height - py - normalized * (height - py * 2);
      return [x, y];
    });
    const line = coords.map(([x,y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    const area = `${px},${height-py} ${line} ${width-px},${height-py}`;
    return `<svg class="ba-insights-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="baInsightArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6c70d2" stop-opacity=".18"/><stop offset="1" stop-color="#40b7dc" stop-opacity=".02"/></linearGradient></defs><path class="grid" d="M12 24H288M12 46H288M12 68H288"/><polygon class="area" points="${area}"/><polyline class="line" points="${line}"/>${coords.map(([x,y])=>`<circle class="dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"/>`).join('')}</svg>`;
  }

  function renderTrend(history) {
    const copy = c();
    if (!history.access?.history) return '';
    const comparable = latestComparable(history.scans);
    if (comparable.length < 2) return '';
    const points = comparable.slice(-MAX_TREND_POINTS);
    return `<section class="ba-insights-card ba-insights-card-pad"><span class="ba-insights-section-kicker">${esc(copy.trend)}</span><div class="ba-insights-title-row"><h3>${esc(copy.trendTitle)}</h3><small>${points.length}</small></div><p style="margin:6px 0 0;font-size:11px;line-height:1.45;color:#718395">${esc(copy.trendBody)}</p><div class="ba-insights-chart-wrap">${chartMarkup(points)}<div class="ba-insights-chart-labels"><span>${esc(formatDate(points[0].capturedAtMs))}</span><span>${esc(formatDate(points[points.length-1].capturedAtMs))}</span></div></div></section>`;
  }

  function renderHistory(history) {
    const copy = c();
    if (!history.access?.history) return '';
    const scans = (Array.isArray(history.scans) ? history.scans : []).slice(-MAX_TIMELINE_ITEMS).reverse();
    if (!scans.length) return '';
    return `<section class="ba-insights-card ba-insights-card-pad"><span class="ba-insights-section-kicker">${esc(copy.history)}</span><div class="ba-insights-title-row"><h3>${esc(copy.historyTitle)}</h3><small>${esc(formatCount(history.scanCount))}</small></div><div class="ba-insights-list">${scans.map((item)=>`<div class="ba-insights-row"><div class="ba-insights-row-icon">${icon('history')}</div><div class="ba-insights-row-copy"><strong>${esc(modeLabel(item.scanMode))} · ${esc(formatBytes(item.totalBytes))}</strong><small>${esc(formatCount(item.reviewedFiles))} ${esc(copy.files)} · ${esc(formatDate(item.capturedAtMs,true))}</small></div><div class="ba-insights-row-side"><b>${esc(item.coverageStatus===COMPLETE_COVERAGE?copy.complete:copy.partial)}</b><small>${esc(relativeTime(item.capturedAtMs))}</small></div></div>`).join('')}</div></section>`;
  }

  function renderCleanup(history) {
    const copy = c();
    if (!history.access?.cleanupHistory) return '';
    const events = Array.isArray(history.cleanups) ? history.cleanups : [];
    return `<section class="ba-insights-card ba-insights-card-pad"><span class="ba-insights-section-kicker">${esc(copy.cleanup)}</span><div class="ba-insights-title-row"><h3>${esc(copy.cleanupTitle)}</h3><small>${esc(copy.verified)}</small></div><div class="ba-insights-metrics"><div class="ba-insights-metric"><b>${esc(formatCount(history.cleanupEventCount))}</b><span>${esc(copy.cleanups)}</span></div><div class="ba-insights-metric"><b>${esc(formatCount(history.verifiedCleanupCount))}</b><span>${esc(copy.removed)}</span></div><div class="ba-insights-metric" style="grid-column:1/-1"><b>${esc(formatBytes(history.verifiedCleanupBytes))}</b><span>${esc(copy.reclaimed)}</span></div></div>${events.length?`<div class="ba-insights-list">${events.slice(-5).reverse().map((event)=>`<div class="ba-insights-row"><div class="ba-insights-row-icon">${icon(event.kind==='empty_folders'?'folder':'cleanup')}</div><div class="ba-insights-row-copy"><strong>${esc(event.kind==='empty_folders'?copy.folderCleanup:copy.fileCleanup)}</strong><small>${esc(formatCount(event.deletedCount))} ${esc(copy.removed)}${n(event.reclaimedBytes)>0?` · ${esc(formatBytes(event.reclaimedBytes))}`:''}</small></div><div class="ba-insights-row-side"><b>${esc(copy.verified)}</b><small>${esc(relativeTime(event.capturedAtMs))}</small></div></div>`).join('')}</div>`:`<div class="ba-insights-note">${esc(copy.noCleanups)}</div>`}</section>`;
  }

  function renderPattern(history) {
    const copy = c();
    if (!history.access?.history) return '';
    const comparable = latestComparable(history.scans).slice(-3);
    let body = copy.patternNeed;
    if (comparable.length >= 3) {
      const first = comparable[0], last = comparable[comparable.length - 1];
      const totalDelta = n(last.totalBytes) - n(first.totalBytes);
      const downloadDelta = n(last.downloadBytes) - n(first.downloadBytes);
      const largeDelta = n(last.largeFileBytes) - n(first.largeFileBytes);
      const stableThreshold = Math.max(5*1024*1024, n(first.totalBytes)*0.01);
      if (Math.abs(downloadDelta) >= 20*1024*1024) body = fill(downloadDelta>0?copy.downloadsGrow:copy.downloadsShrink,{value:formatBytes(Math.abs(downloadDelta))});
      else if (Math.abs(largeDelta) >= 50*1024*1024) body = fill(largeDelta>0?copy.largeGrow:copy.largeShrink,{value:formatBytes(Math.abs(largeDelta))});
      else if (Math.abs(totalDelta) >= stableThreshold) body = fill(totalDelta>0?copy.storageGrow:copy.storageShrink,{value:formatBytes(Math.abs(totalDelta))});
      else body = copy.steady;
    }
    return `<section class="ba-insights-card ba-insights-pattern"><div class="ba-insights-pattern-icon">${icon('spark')}</div><div><span class="ba-insights-section-kicker">${esc(copy.pattern)}</span><strong>${esc(copy.patternTitle)}</strong><p>${esc(body)}</p></div></section>`;
  }

  function renderProLock() {
    const copy = c();
    return `<section class="ba-insights-card ba-insights-pro"><div class="ba-insights-pro-head"><div class="ba-insights-pro-icon">${icon('lock')}</div><div><strong>${esc(copy.proTitle)}</strong><p>${esc(copy.proBody)}</p></div></div></section>`;
  }

  function renderPrivacy(history) {
    const copy = c();
    const hasAny = n(history.scanCount) > 0 || n(history.cleanupEventCount) > 0;
    return `<section class="ba-insights-card ba-insights-privacy"><span class="ba-insights-section-kicker">${esc(copy.privacy)}</span><h3>${esc(clearConfirm?copy.clearAsk:copy.privacyTitle)}</h3><p>${esc(clearConfirm?copy.clearBody:copy.privacyBody)}</p><span class="ba-insights-privacy-line">${esc(copy.privacyLine)}</span>${hasAny?(clearConfirm?`<div class="ba-insights-clear-actions"><button class="cancel" type="button" data-insights-action="cancel-clear">${esc(copy.cancel)}</button><button class="danger" type="button" data-insights-action="confirm-clear">${esc(copy.clearNow)}</button></div>`:`<button class="ba-insights-clear is-danger" type="button" data-insights-action="ask-clear">${esc(copy.clear)}</button>`):''}</section>`;
  }

  function renderEmpty(screen) {
    const copy = c();
    screen.innerHTML = `<div class="ba-insights"><div class="ba-insights-head"><div><span class="ba-insights-kicker">${esc(copy.kicker)}</span><h2>${esc(copy.title)}</h2><p>${esc(copy.lead)}</p></div><span class="ba-insights-local">${esc(copy.local)}</span></div><section class="ba-insights-empty"><img src="./assets/ui/glass-icons/insights.webp" alt="" aria-hidden="true"><h3>${esc(copy.noHistoryTitle)}</h3><p>${esc(copy.noHistoryBody)}</p><button class="ba-insights-primary" type="button" data-insights-action="checkup">${esc(copy.goCheckup)}</button><span class="ba-insights-privacy-line" style="margin-top:14px">${esc(copy.privacyLine)}</span></section></div>`;
  }

  function render() {
    ensureStyle();
    const screen = byId('insightsScreen');
    if (!screen) return;
    screen.classList.add('ba-insights-screen');
    const history = historyData();
    if (!history.available || !history.latest) {
      renderEmpty(screen);
      window.BearagnosticShellUx?.refresh?.();
      return;
    }
    const copy = c(), latest = history.latest;
    const proSections = history.access?.history ? `${renderChanged(history,latest)}${renderTrend(history)}${renderPattern(history)}${renderHistory(history)}${renderCleanup(history)}` : renderProLock();
    screen.innerHTML = `<div class="ba-insights"><div class="ba-insights-head"><div><span class="ba-insights-kicker">${esc(copy.kicker)}</span><h2>${esc(copy.title)}</h2><p>${esc(copy.lead)}</p></div><span class="ba-insights-local">${esc(copy.local)}</span></div>${renderLatest(latest)}${renderStorage(latest)}${proSections}${renderPrivacy(history)}</div>`;
    window.BearagnosticShellUx?.refresh?.();
  }

  function serializeScan(raw) {
    if (typeof raw === 'string') return raw;
    try { return JSON.stringify(raw || {}); } catch (_) { return '{}'; }
  }

  function wrapCallbacks() {
    const base = window.BearagnosticAndroid;
    if (!base || base.__insightsHistoryWrapped) return false;
    window.BearagnosticAndroid = Object.freeze({
      ...base,
      __insightsHistoryWrapped: true,
      onScanComplete(raw) {
        try { base.onScanComplete?.(raw); } finally {
          try { NATIVE.recordInsightsScan?.(serializeScan(raw)); } catch (_) {}
          if (byId('insightsScreen')?.classList.contains('is-active')) render();
        }
      },
    });
    return true;
  }

  function handleAction(event) {
    const button = event.target.closest?.('[data-insights-action]');
    if (!button) return;
    const action = button.dataset.insightsAction;
    if (action === 'checkup') {
      window.BearagnosticAppAPI?.switchScreen?.('checkup');
      return;
    }
    if (action === 'ask-clear') { clearConfirm = true; render(); return; }
    if (action === 'cancel-clear') { clearConfirm = false; render(); return; }
    if (action === 'confirm-clear') {
      try { NATIVE.clearInsightsHistory?.(); } catch (_) {}
      clearConfirm = false;
      render();
    }
  }

  function patchProSheet() {
    const copy = c();
    const grid = document.querySelector('.ba-pro-feature-grid');
    if (grid) {
      let article = grid.querySelector('[data-b42-insights]');
      if (!article) {
        article = document.createElement('article');
        article.className = 'ba-pro-feature';
        article.dataset.b42Insights = '1';
        article.innerHTML = `<span class="ba-pro-feature__icon">${icon('spark')}</span><strong></strong><small></small>`;
        grid.appendChild(article);
      }
      article.querySelector('strong').textContent = copy.proFeatureTitle;
      article.querySelector('small').textContent = copy.proFeatureBody;
    }
    document.querySelectorAll('.ba-pro-roadmap__chips span').forEach((chip) => {
      const value = (chip.textContent || '').trim();
      if (value === copy.plannedInsights || value === copy.plannedCleanup) chip.remove();
    });
  }

  function initialize() {
    ensureStyle();
    wrapCallbacks();
    patchProSheet();
    document.addEventListener('click', handleAction, true);
    window.addEventListener('bearagnostic:screenchange', (event) => {
      if ((event.detail?.screen || '') === 'insights') render();
    });
    window.addEventListener('bearagnostic:languagechange', () => {
      patchProSheet();
      if (byId('insightsScreen')?.classList.contains('is-active')) render();
    });
    window.addEventListener('bearagnostic:entitlementchange', () => {
      requestAnimationFrame(patchProSheet);
      if (byId('insightsScreen')?.classList.contains('is-active')) render();
    });
    window.addEventListener('bearagnostic:prorequest', () => requestAnimationFrame(patchProSheet));
    if (byId('insightsScreen')?.classList.contains('is-active')) render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();

  window.BearagnosticInsights = Object.freeze({ build: BUILD, refresh: render });
})();
