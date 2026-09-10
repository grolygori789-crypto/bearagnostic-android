(() => {
  'use strict';

  const ENT = window.BearagnosticEntitlement;
  if (!ENT) return;
  const BUILD = 30;
  const byId = (id) => document.getElementById(id);

  const COPY = {
    en:{free:'FREE',pro:'PRO',proLifetime:'PRO · LIFETIME',current:'Current plan',open:'View Bearagnostic Pro',dupTitle:'Advanced Duplicates',dupBody:'Full-scope verification with Deep Scan plus one-tap recommended selection across duplicate groups.',plannedDup:'Advanced exact duplicate workflow'},
    th:{free:'FREE',pro:'PRO',proLifetime:'PRO · ตลอดชีพ',current:'แผนปัจจุบัน',open:'ดู Bearagnostic Pro',dupTitle:'จัดการไฟล์ซ้ำขั้นสูง',dupBody:'ตรวจไฟล์ซ้ำเต็มขอบเขตด้วย Deep Scan และเลือกสำเนาส่วนเกินตามคำแนะนำทุกกลุ่มได้ในครั้งเดียว',plannedDup:'ระบบจัดการไฟล์ซ้ำแบบ exact ขั้นสูง'},
    ja:{free:'FREE',pro:'PRO',proLifetime:'PRO · 買い切り',current:'現在のプラン',open:'Bearagnostic Pro を見る',dupTitle:'高度な重複整理',dupBody:'Deep Scan の全範囲検証と、全重複グループの推奨コピー一括選択が利用できます。',plannedDup:'高度な完全一致重複ワークフロー'}
  };
  function lang(){const v=(document.documentElement.lang||'en').toLowerCase();return v.startsWith('th')?'th':v.startsWith('ja')?'ja':'en';}
  function t(){return COPY[lang()]||COPY.en;}
  const dupIcon='<rect x="4" y="6" width="11" height="13" rx="2"/><rect x="9" y="3" width="11" height="13" rx="2"/><path d="m11.5 10.5 1.6 1.6 3.4-3.4"/>';

  function ensureStyle(){
    if(byId('androidPlanStatus30Style'))return;
    const style=document.createElement('style');style.id='androidPlanStatus30Style';style.textContent=`
      .ba-header-pro-status{display:inline-flex;align-items:center;justify-content:center;min-height:24px;padding:0 9px;border-radius:999px;margin-left:auto;margin-right:3px;background:linear-gradient(145deg,rgba(242,238,255,.96),rgba(235,247,255,.96));border:1px solid rgba(102,91,190,.10);color:#6259b0;box-shadow:0 6px 16px rgba(73,74,137,.07),inset 0 1px rgba(255,255,255,.96);font-size:8.5px;font-weight:850;letter-spacing:.10em;line-height:1;white-space:nowrap}.ba-header-pro-status[hidden]{display:none!important}
      #moreScreen .panel-head{position:relative;padding-right:112px}.ba-more-plan-status{position:absolute;right:0;top:2px;display:inline-flex;align-items:center;min-height:27px;padding:0 10px;border-radius:999px;background:#f0f4f8;border:1px solid rgba(91,119,151,.08);color:#738398;font-size:9px;font-weight:820;letter-spacing:.065em;white-space:nowrap}.ba-more-plan-status.is-pro{background:linear-gradient(145deg,#eeeaff,#edf7ff);border-color:rgba(103,91,190,.10);color:#635ab4;box-shadow:0 5px 14px rgba(78,74,145,.06)}
      .ba-pro-feature[data-b30-duplicates]{grid-column:1/-1;display:grid;grid-template-columns:31px minmax(0,1fr);column-gap:10px;align-items:center;background:linear-gradient(145deg,#fff,#f4f1ff)!important}.ba-pro-feature[data-b30-duplicates] .ba-pro-feature__icon{grid-column:1;grid-row:1/3;margin-bottom:0!important;background:linear-gradient(145deg,#eee9ff,#edf6ff)!important;color:#655bc2!important}.ba-pro-feature[data-b30-duplicates]>strong,.ba-pro-feature[data-b30-duplicates]>small{grid-column:2}.ba-pro-feature[data-b30-duplicates] .ba-pro-feature__icon svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
      @media(max-width:360px){.ba-header-pro-status{padding:0 7px;font-size:7.8px;margin-right:0}#moreScreen .panel-head{padding-right:96px}.ba-more-plan-status{padding:0 8px;font-size:8px}}
    `;document.head.appendChild(style);
  }
  function ensureHeaderIndicator(){
    const header=document.querySelector('.app-header');const settings=byId('settingsButton');if(!header||!settings)return null;let badge=byId('baHeaderProStatus');if(!badge){badge=document.createElement('span');badge.id='baHeaderProStatus';badge.className='ba-header-pro-status';badge.setAttribute('aria-hidden','true');settings.insertAdjacentElement('beforebegin',badge);}return badge;
  }
  function ensureMoreIndicator(){
    const head=document.querySelector('#moreScreen .panel-head');if(!head)return null;let badge=byId('baMorePlanStatus');if(!badge){badge=document.createElement('button');badge.type='button';badge.id='baMorePlanStatus';badge.className='ba-more-plan-status';badge.addEventListener('click',()=>ENT.requestPro?.('more_plan_status'));head.appendChild(badge);}return badge;
  }
  function patchProSheet(){
    const copy=t();const grid=document.querySelector('.ba-pro-feature-grid');if(grid&&!grid.querySelector('[data-b30-duplicates]')){
      const article=document.createElement('article');article.className='ba-pro-feature';article.dataset.b30Duplicates='1';article.innerHTML=`<span class="ba-pro-feature__icon"><svg viewBox="0 0 24 24" aria-hidden="true">${dupIcon}</svg></span><strong></strong><small></small>`;article.querySelector('strong').textContent=copy.dupTitle;article.querySelector('small').textContent=copy.dupBody;grid.appendChild(article);
    } else if(grid){const article=grid.querySelector('[data-b30-duplicates]');if(article){article.querySelector('strong').textContent=copy.dupTitle;article.querySelector('small').textContent=copy.dupBody;}}
    document.querySelectorAll('.ba-pro-roadmap__chips span').forEach((chip)=>{if((chip.textContent||'').trim()===copy.plannedDup)chip.remove();});
  }
  function refresh(){
    ensureStyle();const copy=t();const state=ENT.getState?.()||{};const isPro=state.isPro===true;const header=ensureHeaderIndicator();if(header){header.textContent=copy.pro;header.hidden=!isPro;}
    const more=ensureMoreIndicator();if(more){more.textContent=isPro?copy.proLifetime:copy.free;more.classList.toggle('is-pro',isPro);more.setAttribute('aria-label',`${copy.current}: ${isPro?copy.proLifetime:copy.free}. ${copy.open}`);}
    patchProSheet();
  }
  function refreshAfterProRender(){window.requestAnimationFrame(()=>refresh());}
  ensureStyle();refresh();
  window.addEventListener('bearagnostic:prorequest',refreshAfterProRender);
  window.addEventListener('bearagnostic:entitlementchange',refreshAfterProRender);
  window.addEventListener('bearagnostic:languagechange',refreshAfterProRender);
  document.addEventListener('DOMContentLoaded',refresh,{once:true});
  window.BearagnosticPlanStatus=Object.freeze({build:BUILD,refresh});
})();
