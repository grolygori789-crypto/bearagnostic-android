(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  if (!NATIVE) return;

  const KOFI_URL = 'https://ko-fi.com/benedictinteractive';
  const QR_URL = 'https://raw.githubusercontent.com/grolygori789-crypto/little-ganesha-tarot/f21e6a4c81812276d661d6ebb0a3e6c86c6cf48b/assets/support/promptpay-qr.png';
  const toast = (message) => window.BearagnosticAppAPI?.showToast?.(message);

  function parse(value) {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || {}); }
    catch (_) { return {}; }
  }

  function lang() {
    const v = (document.documentElement.lang || 'en').toLowerCase();
    return v.startsWith('th') ? 'th' : v.startsWith('ja') ? 'ja' : 'en';
  }

  function copy(key) {
    const c = {
      en: {
        saving:'Saving the verified PromptPay QR to Downloads…',
        permission:'Allow file access so Bearagnostic can save the QR, then the download will continue.',
        saveFailed:'Bearagnostic could not start the QR download.',
        openFailed:'No compatible browser was available for this link.'
      },
      th: {
        saving:'กำลังบันทึก QR PromptPay ที่ตรวจสอบแล้วไปยัง Downloads…',
        permission:'อนุญาตสิทธิ์ไฟล์เพื่อให้ Bearagnostic บันทึก QR แล้วระบบจะดำเนินการต่อ',
        saveFailed:'Bearagnostic ไม่สามารถเริ่มบันทึก QR ได้',
        openFailed:'ไม่พบเบราว์เซอร์ที่รองรับสำหรับเปิดลิงก์นี้'
      },
      ja: {
        saving:'確認済み PromptPay QR を Downloads に保存しています…',
        permission:'QR を保存するためのファイル権限を許可してください。許可後に続行します。',
        saveFailed:'QR の保存を開始できませんでした。',
        openFailed:'このリンクを開けるブラウザが見つかりませんでした。'
      }
    };
    return (c[lang()] || c.en)[key];
  }

  function openExternal(url) {
    const result = parse(NATIVE.openExternalUrl(url));
    if (!result.accepted) toast(copy('openFailed'));
  }

  // Capture before the legacy PWA's window.open / fetch handlers. Those browser
  // flows are not reliable inside a native WebView; these actions are delegated
  // to Android instead.
  document.addEventListener('click', (event) => {
    const target = event.target?.closest?.('#savePromptPayQr,#openPromptPayQr,#openKofi');
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (target.id === 'openKofi') {
      openExternal(KOFI_URL);
      return;
    }

    if (target.id === 'openPromptPayQr') {
      openExternal(QR_URL);
      return;
    }

    const result = parse(NATIVE.saveSupportQr());
    if (result.accepted) {
      toast(result.permissionRequested ? copy('permission') : copy('saving'));
    } else {
      toast(copy('saveFailed'));
    }
  }, true);
})();
