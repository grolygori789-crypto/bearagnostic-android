(() => {
  'use strict';

  const BUILD = 32;
  const STORAGE_KEY = 'bearagnostic.includeHiddenItems.v1';
  const PRIVATE_LABELS = new Set([
    'private','hidden','secret','secretalbum','hiddenalbum','privatealbum','vault','locked','secure'
  ]);

  const lang = () => {
    const value=(document.documentElement.lang||'en').toLowerCase();
    return value.startsWith('th')?'th':value.startsWith('ja')?'ja':'en';
  };
  const COPY = {
    en:{title:'Include hidden items',body:'Show accessible filesystem-hidden items and common private-folder labels in review lists. Off by default; protected app storage and vaults are never bypassed.',on:'ON',off:'OFF'},
    th:{title:'รวมรายการที่ซ่อนไว้',body:'แสดงรายการที่ระบบไฟล์ซ่อนไว้และโฟลเดอร์ที่มีชื่อสื่อถึงความเป็นส่วนตัว เฉพาะส่วนที่ Android อนุญาตให้เข้าถึง ปิดไว้เป็นค่าเริ่มต้น และไม่ข้ามระบบป้องกันหรือห้องนิรภัยของแอป',on:'เปิด',off:'ปิด'},
    ja:{title:'非表示項目を含める',body:'Android がアクセスを許可している範囲で、ファイルシステム上の非表示項目や一般的なプライベートフォルダー名をレビュー一覧に表示します。初期設定はオフで、保護領域や保管庫を回避しません。',on:'オン',off:'オフ'}
  };
  const c = () => COPY[lang()] || COPY.en;
  const esc=(value)=>String(value??'').replace(/[&<>"']/g,(ch)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function readEnabled(){
    try{return localStorage.getItem(STORAGE_KEY)==='1';}catch(_){return false;}
  }
  let enabled=readEnabled();

  function normalizeSegment(value){return String(value||'').trim().toLowerCase().replace(/[\s_-]+/g,'');}
  function segmentsFor(item){
    const out=[];
    const name=String(item?.name||'').trim();
    if(name) out.push(name);
    String(item?.location||'').split(/[\\/]+/).forEach((part)=>{if(part.trim())out.push(part.trim());});
    return out;
  }
  function isHiddenCandidate(item){
    return segmentsFor(item).some((segment)=>{
      const raw=segment.trim();
      if(raw.length>1 && raw.startsWith('.')) return true;
      return PRIVATE_LABELS.has(normalizeSegment(raw));
    });
  }
  function filter(items){
    const list=Array.isArray(items)?items:[];
    return enabled?list:list.filter((item)=>!isHiddenCandidate(item));
  }
  function hiddenOnly(items){return (Array.isArray(items)?items:[]).filter(isHiddenCandidate);}
  function hiddenStats(items){
    const hidden=hiddenOnly(items);
    return {count:hidden.length,bytes:hidden.reduce((sum,item)=>sum+Math.max(0,Number(item?.sizeBytes)||0),0)};
  }
  function setEnabled(next,{silent=false}={}){
    const value=Boolean(next);
    if(enabled===value){refreshDecorations();return enabled;}
    enabled=value;
    try{localStorage.setItem(STORAGE_KEY,enabled?'1':'0');}catch(_){}
    refreshDecorations();
    if(!silent) window.dispatchEvent(new CustomEvent('bearagnostic:hiddenitemschange',{detail:{enabled}}));
    return enabled;
  }
  function toggle(){return setEnabled(!enabled);}
  function isEnabled(){return enabled;}

  function ensureStyle(){
    if(document.getElementById('androidHiddenItemsStyle'))return;
    const style=document.createElement('style');style.id='androidHiddenItemsStyle';style.textContent=`
      .ba-hidden-pref{margin-top:10px;padding:12px 13px;border-radius:18px;background:linear-gradient(135deg,#f7f7ff,#f5fbff);border:1px solid rgba(99,105,176,.09);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:11px;align-items:center}
      .ba-hidden-pref strong{display:block;font-size:12.5px;line-height:1.3;color:#314056}.ba-hidden-pref small{display:block;margin-top:4px;font-size:10.8px;line-height:1.48;color:#748295}
      .ba-hidden-switch{min-width:58px;height:34px;border-radius:999px;padding:3px;background:#e9edf4;border:1px solid rgba(93,108,132,.10);display:flex;align-items:center;justify-content:flex-start;transition:.18s ease}.ba-hidden-switch:before{content:'';width:26px;height:26px;border-radius:50%;background:#fff;box-shadow:0 4px 10px rgba(35,54,79,.13);transition:.18s ease}.ba-hidden-switch[aria-pressed='true']{justify-content:flex-end;background:linear-gradient(135deg,#ddd8ff,#d9f0ff);border-color:rgba(108,89,205,.15)}.ba-hidden-switch[aria-pressed='true']:before{background:linear-gradient(145deg,#8f73ea,#5d9fe9)}
      @media(prefers-reduced-motion:reduce){.ba-hidden-switch,.ba-hidden-switch:before{transition:none!important}}html[data-motion='reduced'] .ba-hidden-switch,html[data-motion='reduced'] .ba-hidden-switch:before{transition:none!important}
    `;document.head.appendChild(style);
  }
  function decoratePreferences(){
    const host=document.getElementById('nativePreferencesExtension');
    if(!host)return;
    let row=document.getElementById('baHiddenPreference');
    if(!row){
      row=document.createElement('div');row.id='baHiddenPreference';row.className='ba-hidden-pref';
      host.appendChild(row);
    }
    const copy=c();
    const signature=`${lang()}|${enabled?'1':'0'}`;
    if(row.dataset.signature===signature) return;
    row.dataset.signature=signature;
    row.innerHTML=`<div><strong>${esc(copy.title)}</strong><small>${esc(copy.body)}</small></div><button class="ba-hidden-switch" id="baHiddenSwitch" type="button" aria-pressed="${enabled?'true':'false'}" aria-label="${esc(copy.title)}"></button>`;
    document.getElementById('baHiddenSwitch')?.addEventListener('click',()=>toggle(),{once:true});
  }
  function refreshDecorations(){decoratePreferences();}
  let decorateStarted=false;
  function scheduleDecorate(){
    if(decorateStarted)return;decorateStarted=true;ensureStyle();decoratePreferences();
    const observer=new MutationObserver(()=>decoratePreferences());
    observer.observe(document.body,{childList:true,subtree:true});
  }

  window.addEventListener('bearagnostic:languagechange',refreshDecorations);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scheduleDecorate,{once:true});else scheduleDecorate();
  window.BearagnosticHiddenItems=Object.freeze({
    build:BUILD,isEnabled,setEnabled,toggle,isHiddenCandidate,filter,hiddenOnly,hiddenStats,labels:()=>({...c()})
  });
})();
