(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const MODE_CAPABILITY = Object.freeze({ deep: 'deep_scan', custom: 'custom_scan' });
  const FALLBACK = Object.freeze({
    tier:'free', isPro:false, source:'fallback', debugControlsAvailable:false, billingReady:false,
    canPurchase:false, purchaseModel:'one_time_lifetime', productId:'bearagnostic_pro_lifetime',
    formattedPrice:null, noAccountRequired:true, ads:false, safetyAlwaysFree:true,
    capabilities:{ quick_scan:true, smart_scan:true, basic_cleanup:true, safety_guidance:true,
      basic_review:true, scan_evidence:true, share_result:true, deep_scan:false, custom_scan:false,
      advanced_exact_duplicates:false }
  });
  let state={...FALLBACK,capabilities:{...FALLBACK.capabilities}};
  function parse(value,fallback={}){try{return typeof value==='string'?JSON.parse(value):(value||fallback)}catch(_){return fallback}}
  function normalize(raw){const next=raw&&typeof raw==='object'?raw:{};return {...FALLBACK,...next,tier:next.tier==='pro'?'pro':'free',isPro:next.tier==='pro'||next.isPro===true,capabilities:{...FALLBACK.capabilities,...(next.capabilities&&typeof next.capabilities==='object'?next.capabilities:{})}}}
  function emit(){window.dispatchEvent(new CustomEvent('bearagnostic:entitlementchange',{detail:{state:snapshot()}}))}
  function refresh({notify=false}={}){const before=JSON.stringify(state);const raw=typeof NATIVE.getEntitlementState==='function'?parse(NATIVE.getEntitlementState(),FALLBACK):FALLBACK;state=normalize(raw);if(notify&&JSON.stringify(state)!==before)emit();return snapshot()}
  function snapshot(){return JSON.parse(JSON.stringify(state))}
  function can(capability){refresh();return state.capabilities?.[capability]===true}
  function requestPro(source,capability=null){refresh();window.dispatchEvent(new CustomEvent('bearagnostic:prorequest',{detail:{source:source||'unknown',capability,state:snapshot()}}))}
  function setDebugTier(tier){if(typeof NATIVE.setDebugEntitlement!=='function')return {accepted:false,reason:'bridge_unavailable'};const result=parse(NATIVE.setDebugEntitlement(tier),{accepted:false});refresh({notify:true});return result}
  function clearDebugTier(){if(typeof NATIVE.clearDebugEntitlement!=='function')return {accepted:false,reason:'bridge_unavailable'};const result=parse(NATIVE.clearDebugEntitlement(),{accepted:false});refresh({notify:true});return result}

  document.addEventListener('click',(event)=>{
    const target=event.target;if(!target?.closest)return;
    const proEntry=target.closest('[data-pro-entry],#supportProjectRow');
    if(proEntry){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();requestPro('more');return}
    const modeButton=target.closest('[data-native-mode]');
    if(modeButton){const mode=String(modeButton.dataset.nativeMode||'').toLowerCase();const capability=MODE_CAPABILITY[mode];if(capability&&!can(capability)){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();requestPro(`scan_${mode}`,capability);return}}
    if(target.closest('#nativeCustomStart')&&!can('custom_scan')){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();requestPro('custom_start','custom_scan')}
  },true);
  window.addEventListener('focus',()=>refresh({notify:true}));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh({notify:true})});
  refresh();
  window.BearagnosticEntitlement=Object.freeze({getState:()=>snapshot(),refresh:()=>refresh({notify:true}),isPro:()=>{refresh();return state.isPro===true},can,requestPro,setDebugTier,clearDebugTier});
})();


/* K3 — Benedict server entitlement / Ko-fi purchase + restore surface.
   Google Play remains intact and is shown whenever server commerce is not configured. */
(() => {
  'use strict';
  const NATIVE=window.BearagnosticNative, ENT=window.BearagnosticEntitlement;
  if(!NATIVE||!ENT||typeof NATIVE.getServerCommerceState!=='function')return;
  const $=(s,r=document)=>r.querySelector(s);
  const parse=(v,f={})=>{try{return typeof v==='string'?JSON.parse(v):(v||f)}catch(_){return f}};
  const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const lang=()=>{const v=(document.documentElement.lang||'en').toLowerCase();return v.startsWith('th')?'th':v.startsWith('ja')?'ja':'en'};
  const COPY={
    en:{active:'Bearagnostic Pro is active',activeSub:'Your Benedict lifetime entitlement is verified for this device.',ready:'Unlock Bearagnostic Pro',readySub:"Verify the email you'll use on Ko-fi. After Ko-fi confirms payment, Pro unlocks automatically.",email:'Email used on Ko-fi',buy:'Continue with Ko-fi',restore:'Restore Pro',sending:'Sending verification code…',otp:'Check your email',otpSub:'Enter the 6-digit code we sent. It expires in 10 minutes.',code:'6-digit code',verify:'Verify',waiting:'Waiting for Ko-fi confirmation',waitingSub:'Complete payment on Ko-fi, then return here. Bearagnostic will check automatically.',refresh:'Check again',offline:'Pro active · offline cache',offlineSub:'Your last server-verified Pro lease is still valid. We will refresh it when the network returns.',error:'We could not complete that step',retry:'Start again',secure:'Payment happens securely on Ko-fi. Bearagnostic never sees your card details.'},
    th:{active:'Bearagnostic Pro เปิดใช้งานแล้ว',activeSub:'อุปกรณ์นี้ได้รับการยืนยันสิทธิ์ Pro ตลอดชีพจากระบบ Benedict แล้ว',ready:'ปลดล็อก Bearagnostic Pro',readySub:'ยืนยันอีเมลที่จะใช้กับ Ko-fi เมื่อ Ko-fi ยืนยันการชำระเงิน Pro จะเปิดให้อัตโนมัติ',email:'อีเมลที่ใช้บน Ko-fi',buy:'ดำเนินการต่อด้วย Ko-fi',restore:'กู้คืน Pro',sending:'กำลังส่งรหัสยืนยัน…',otp:'ตรวจสอบอีเมลของคุณ',otpSub:'กรอกรหัส 6 หลักที่เราส่งให้ รหัสมีอายุ 10 นาที',code:'รหัส 6 หลัก',verify:'ยืนยัน',waiting:'กำลังรอการยืนยันจาก Ko-fi',waitingSub:'ชำระเงินบน Ko-fi ให้เสร็จแล้วกลับมาที่แอป Bearagnostic จะตรวจให้อัตโนมัติ',refresh:'ตรวจอีกครั้ง',offline:'Pro เปิดอยู่ · ใช้สิทธิ์ออฟไลน์',offlineSub:'สิทธิ์ Pro ที่เซิร์ฟเวอร์ยืนยันล่าสุดยังอยู่ในช่วงใช้งาน ระบบจะตรวจใหม่เมื่ออินเทอร์เน็ตกลับมา',error:'ยังดำเนินการขั้นตอนนี้ไม่สำเร็จ',retry:'เริ่มใหม่',secure:'การชำระเงินเกิดขึ้นบน Ko-fi อย่างปลอดภัย Bearagnostic ไม่เห็นข้อมูลบัตรของคุณ'},
    ja:{active:'Bearagnostic Pro は有効です',activeSub:'この端末の Benedict 買い切り Pro 権限を確認済みです。',ready:'Bearagnostic Pro を解除',readySub:'Ko-fi で使うメールを確認します。Ko-fi が支払いを確認すると Pro は自動で有効になります。',email:'Ko-fi で使うメール',buy:'Ko-fi で続ける',restore:'Pro を復元',sending:'確認コードを送信中…',otp:'メールを確認してください',otpSub:'送信した6桁コードを入力してください。10分で期限切れになります。',code:'6桁コード',verify:'確認',waiting:'Ko-fi の確認を待っています',waitingSub:'Ko-fi で支払いを完了してアプリに戻ってください。自動で確認します。',refresh:'もう一度確認',offline:'Pro 有効 · オフライン',offlineSub:'前回サーバー確認済みの Pro 権限が有効です。ネット接続時に更新します。',error:'処理を完了できませんでした',retry:'最初からやり直す',secure:'支払いは Ko-fi 上で安全に行われます。Bearagnostic はカード情報を受け取りません。'}
  };
  const c=()=>COPY[lang()]||COPY.en;
  let emailDraft='',codeDraft='',poll=null,observerQueued=false;
  function state(){return parse(NATIVE.getServerCommerceState?.(),{configured:false,phase:'unconfigured'})}
  function sandboxEnabled(){const s=parse(NATIVE.getDebugBillingSandboxState?.(),{});return s.available===true&&s.enabled===true}
  function ensureStyle(){if($('#baKofiStyle'))return;const s=document.createElement('style');s.id='baKofiStyle';s.textContent=`
    html[data-server-commerce="true"] .ba-pro-purchase{display:none!important}.ba-kofi-purchase{margin-top:10px;padding:14px;border-radius:21px;background:linear-gradient(145deg,#fff 20%,#f4f8ff 72%,#f4f2ff);border:1px solid rgba(78,91,165,.10);box-shadow:0 13px 34px rgba(44,58,112,.08),inset 0 1px #fff}.ba-kofi-purchase strong{display:block;color:#25394f;font-size:12px;line-height:1.35}.ba-kofi-purchase>small{display:block;margin-top:5px;color:#738297;font-size:8.8px;line-height:1.55}.ba-kofi-form{display:grid;gap:7px;margin-top:11px}.ba-kofi-input{width:100%;height:43px;padding:0 12px;border-radius:14px;border:1px solid rgba(76,96,144,.13);background:#fff;color:#25394f;font-size:10px;outline:none;box-sizing:border-box}.ba-kofi-input:focus{border-color:rgba(84,89,202,.38);box-shadow:0 0 0 3px rgba(93,89,205,.08)}.ba-kofi-actions{display:grid;grid-template-columns:1fr auto;gap:7px}.ba-kofi-button{min-height:43px;padding:0 13px;border:0;border-radius:14px;font-size:9px;font-weight:800}.ba-kofi-primary{background:linear-gradient(118deg,#7665d5,#268fdc);color:#fff;box-shadow:0 10px 22px rgba(78,78,180,.16)}.ba-kofi-secondary{background:#eef3f8;color:#596f84;border:1px solid rgba(73,105,135,.08)}.ba-kofi-secure{display:flex;gap:7px;align-items:flex-start;margin-top:9px;color:#8492a2;font-size:7.5px;line-height:1.45}.ba-kofi-dot{flex:0 0 auto;width:7px;height:7px;margin-top:2px;border-radius:50%;background:#66c3a5;box-shadow:0 0 0 4px rgba(102,195,165,.10)}.ba-kofi-wait{display:flex;align-items:center;gap:8px;margin-top:10px;padding:10px;border-radius:14px;background:#f4f7ff;color:#5e6f89;font-size:8.5px}.ba-kofi-spinner{width:14px;height:14px;border:2px solid rgba(93,91,190,.18);border-top-color:#6861c6;border-radius:50%;animation:baKofiSpin .8s linear infinite}@keyframes baKofiSpin{to{transform:rotate(360deg)}}@media(max-width:360px){.ba-kofi-actions{grid-template-columns:1fr}.ba-kofi-button{width:100%}}@media(prefers-reduced-motion:reduce){.ba-kofi-spinner{animation:none}}`;
    document.head.appendChild(s)}
  function block(){const play=$('.ba-pro-purchase');if(!play)return null;let b=$('#baKofiPurchase');if(!b){b=document.createElement('section');b.id='baKofiPurchase';b.className='ba-kofi-purchase';play.insertAdjacentElement('afterend',b)}return b}
  function render(){ensureStyle();const st=state();const enabled=st.configured===true&&!sandboxEnabled();document.documentElement.dataset.serverCommerce=enabled?'true':'false';const b=$('#baKofiPurchase');if(!enabled){b?.remove();return}const el=block();if(!el)return;const t=c(),ent=ENT.getState?.()||{},phase=String(st.phase||'ready');
    if(ent.isPro===true||phase==='active'){el.innerHTML=`<strong>${esc(t.active)}</strong><small>${esc(t.activeSub)}</small>`;stopPoll();return}
    if(phase==='offline_cached'){el.innerHTML=`<strong>${esc(t.offline)}</strong><small>${esc(t.offlineSub)}</small>`;return}
    if(phase==='sending_code'||phase==='verifying_code'||phase==='opening_kofi'){el.innerHTML=`<strong>${esc(phase==='opening_kofi'?t.waiting:t.sending)}</strong><small>${esc(phase==='opening_kofi'?t.waitingSub:t.secure)}</small><div class="ba-kofi-wait"><span class="ba-kofi-spinner"></span>${esc(phase==='opening_kofi'?t.waiting:t.sending)}</div>`;startPoll();return}
    if(phase==='otp_required'){el.innerHTML=`<strong>${esc(t.otp)}</strong><small>${esc(t.otpSub)}</small><div class="ba-kofi-form"><input class="ba-kofi-input" id="baKofiCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="${esc(t.code)}" value="${esc(codeDraft)}"><div class="ba-kofi-actions"><button class="ba-kofi-button ba-kofi-primary" data-kofi-action="verify">${esc(t.verify)}</button><button class="ba-kofi-button ba-kofi-secondary" data-kofi-action="reset">${esc(t.retry)}</button></div></div>`;return}
    if(phase==='waiting_payment'){el.innerHTML=`<strong>${esc(t.waiting)}</strong><small>${esc(t.waitingSub)}</small><div class="ba-kofi-wait"><span class="ba-kofi-spinner"></span>${esc(t.waiting)}</div><div class="ba-kofi-form"><button class="ba-kofi-button ba-kofi-secondary" data-kofi-action="refresh">${esc(t.refresh)}</button></div>`;startPoll();return}
    if(phase==='error'){el.innerHTML=`<strong>${esc(t.error)}</strong><small>${esc(st.lastError||'')}</small><div class="ba-kofi-form"><button class="ba-kofi-button ba-kofi-secondary" data-kofi-action="reset">${esc(t.retry)}</button></div>`;return}
    el.innerHTML=`<strong>${esc(t.ready)}</strong><small>${esc(t.readySub)}</small><div class="ba-kofi-form"><input class="ba-kofi-input" id="baKofiEmail" type="email" autocomplete="email" placeholder="${esc(t.email)}" value="${esc(emailDraft)}"><div class="ba-kofi-actions"><button class="ba-kofi-button ba-kofi-primary" data-kofi-action="purchase">${esc(t.buy)}</button><button class="ba-kofi-button ba-kofi-secondary" data-kofi-action="restore">${esc(t.restore)}</button></div></div><div class="ba-kofi-secure"><span class="ba-kofi-dot"></span><span>${esc(t.secure)}</span></div>`;stopPoll()}
  function call(action){if(action==='purchase'||action==='restore'){const email=$('#baKofiEmail')?.value?.trim()||emailDraft;emailDraft=email;if(!email)return;if(action==='purchase')NATIVE.startKoFiPurchase?.(email);else NATIVE.startKoFiRestore?.(email)}else if(action==='verify'){codeDraft=$('#baKofiCode')?.value?.trim()||codeDraft;NATIVE.verifyKoFiCode?.(codeDraft)}else if(action==='refresh')NATIVE.refreshServerEntitlement?.();else if(action==='reset'){codeDraft='';NATIVE.resetServerCommerce?.()}setTimeout(render,80);startPoll()}
  function startPoll(){if(poll!=null)return;poll=setInterval(()=>{try{ENT.refresh?.()}catch(_){}render()},800)}function stopPoll(){if(poll!=null){clearInterval(poll);poll=null}}
  document.addEventListener('input',e=>{if(e.target?.id==='baKofiEmail')emailDraft=e.target.value;if(e.target?.id==='baKofiCode')codeDraft=e.target.value.replace(/\D/g,'').slice(0,6)},true);
  document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-kofi-action]');if(!b)return;e.preventDefault();e.stopPropagation();call(b.dataset.kofiAction)},true);
  window.addEventListener('focus',()=>{try{NATIVE.refreshServerEntitlement?.()}catch(_){}setTimeout(render,120)});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){try{NATIVE.refreshServerEntitlement?.()}catch(_){}setTimeout(render,120)}});
  window.addEventListener('bearagnostic:entitlementchange',render);
  const o=new MutationObserver(()=>{if(observerQueued)return;observerQueued=true;queueMicrotask(()=>{observerQueued=false;render()})});o.observe(document.body,{childList:true,subtree:true});
  setTimeout(render,220);
})();
