(() => {
  'use strict';

  const COPY = {
    en: {
      kicker: 'ANDROID FOUNDATION', headline: 'One tap.<br><em>A real file checkup.</em>', intro: "The native foundation is ready for Bearagnostic's device-level file-health engine.",
      systemStatus: 'SYSTEM STATUS', foundationReady: 'Foundation ready', nativeBridge: 'Native bridge', nativeBridgeSub: 'Secure local UI ↔ Android communication', ready: 'Ready',
      storageAccess: 'Storage access', storageAccessSub: 'User-controlled permission for accessible files', notGranted: 'Not granted', granted: 'Granted',
      scannerEngine: 'Scanner engine', scannerEngineSub: 'Native one-tap analysis arrives in the next batch', next: 'Next', privacyTitle: 'Local by design',
      privacyBody: 'This foundation does not scan, upload, or delete files. Android remains in control of protected storage.', prepareAccess: 'Prepare device access',
      prepareAccessSub: 'Android will show the system permission screen', accessReady: 'Device access ready', accessReadySub: 'The native scanner can use this permission in the next batch'
    },
    ja: {
      kicker: 'ANDROID FOUNDATION', headline: 'ワンタップで。<br><em>本物のファイル診断。</em>', intro: 'Bearagnostic の端末レベル・ファイル診断エンジンを支えるネイティブ基盤が整いました。',
      systemStatus: 'SYSTEM STATUS', foundationReady: '基盤の準備完了', nativeBridge: 'ネイティブブリッジ', nativeBridgeSub: 'ローカルUIとAndroidを安全に接続', ready: '準備完了',
      storageAccess: 'ストレージアクセス', storageAccessSub: 'ユーザーが管理するファイルアクセス権限', notGranted: '未許可', granted: '許可済み',
      scannerEngine: 'スキャンエンジン', scannerEngineSub: 'ネイティブのワンタップ解析は次のバッチで実装', next: '次へ', privacyTitle: 'ローカル設計',
      privacyBody: 'この基盤ビルドはファイルをスキャン、アップロード、削除しません。保護領域はAndroidが管理します。', prepareAccess: '端末アクセスを準備',
      prepareAccessSub: 'Androidのシステム権限画面を開きます', accessReady: '端末アクセス準備完了', accessReadySub: '次のバッチでネイティブスキャナーがこの権限を使用できます'
    },
    th: {
      kicker: 'ANDROID FOUNDATION', headline: 'แตะครั้งเดียว<br><em>ตรวจไฟล์จริงทั้งระบบที่เข้าถึงได้</em>', intro: 'ฐาน Native พร้อมแล้วสำหรับระบบตรวจสุขภาพไฟล์ระดับอุปกรณ์ของ Bearagnostic',
      systemStatus: 'SYSTEM STATUS', foundationReady: 'ฐานระบบพร้อมใช้งาน', nativeBridge: 'Native bridge', nativeBridgeSub: 'เชื่อม UI ในเครื่อง ↔ Android อย่างปลอดภัย', ready: 'พร้อม',
      storageAccess: 'สิทธิ์เข้าถึงไฟล์', storageAccessSub: 'ผู้ใช้เป็นผู้อนุญาตการเข้าถึงไฟล์ที่ Android เปิดให้', notGranted: 'ยังไม่อนุญาต', granted: 'อนุญาตแล้ว',
      scannerEngine: 'Scanner engine', scannerEngineSub: 'ระบบวิเคราะห์ Native แบบ One-Tap จะมาในชุดถัดไป', next: 'ถัดไป', privacyTitle: 'ออกแบบให้ทำงานในเครื่อง',
      privacyBody: 'Foundation ชุดนี้ยังไม่สแกน อัปโหลด หรือลบไฟล์ และ Android ยังคงป้องกันพื้นที่ส่วนตัวของระบบและแอพอื่น', prepareAccess: 'เตรียมสิทธิ์เข้าถึงไฟล์',
      prepareAccessSub: 'Android จะเปิดหน้าสิทธิ์ของระบบให้คุณอนุญาต', accessReady: 'สิทธิ์อุปกรณ์พร้อมแล้ว', accessReadySub: 'Scanner Native จะใช้สิทธิ์นี้ในชุดถัดไป'
    }
  };

  const lang = (() => {
    const raw = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
    if (raw.startsWith('th')) return 'th';
    if (raw.startsWith('ja')) return 'ja';
    return 'en';
  })();
  document.documentElement.lang = lang;

  const t = (key) => COPY[lang][key] ?? COPY.en[key] ?? key;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });

  const storageState = document.getElementById('storageState');
  const accessButton = document.getElementById('accessButton');
  const buildLabel = document.getElementById('buildLabel');

  function setState(state) {
    const granted = Boolean(state?.broadStorageAccess);
    storageState.textContent = granted ? t('granted') : t('notGranted');
    storageState.classList.toggle('good', granted);
    accessButton.classList.toggle('is-ready', granted);
    accessButton.querySelector('strong').textContent = granted ? t('accessReady') : t('prepareAccess');
    accessButton.querySelector('small').textContent = granted ? t('accessReadySub') : t('prepareAccessSub');
    if (state?.versionName) buildLabel.textContent = `Bearagnostic for Android · ${state.versionName} · Bridge ${state.bridgeVersion ?? 1}`;
  }

  function readNativeState() {
    try {
      const raw = window.BearagnosticNative?.getNativeState?.();
      if (raw) setState(JSON.parse(raw));
    } catch (_) {
      setState({ broadStorageAccess: false });
    }
  }

  window.BearagnosticAndroid = Object.freeze({
    onNativeStateChanged(state) {
      if (typeof state === 'string') {
        try { setState(JSON.parse(state)); } catch (_) {}
      } else {
        setState(state);
      }
    }
  });

  accessButton.addEventListener('click', () => {
    try {
      if (window.BearagnosticNative?.requestBroadStorageAccess) {
        window.BearagnosticNative.requestBroadStorageAccess();
      }
    } catch (_) {}
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) readNativeState();
  });

  readNativeState();
})();
