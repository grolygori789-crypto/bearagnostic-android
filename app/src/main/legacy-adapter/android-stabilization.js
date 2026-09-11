(() => {
  'use strict';

  const NATIVE = window.BearagnosticNative;
  const byId = (id) => document.getElementById(id);
  let observerQueued = false;
  let healthClickBound = false;

  // B45 localization contract. Only fully translated locales are exposed in the UI.
  // ES and PT-BR are launch targets, but remain intentionally hidden until every
  // first-class Android adapter has native-quality copy and regression coverage.
  const LAUNCH_LOCALES = Object.freeze(['en', 'th', 'ja', 'es', 'pt-BR']);
  const SHIPPING_LOCALES = Object.freeze(['en', 'th', 'ja']);

  function normalizeLanguage(value = document.documentElement.lang || 'en') {
    const v = String(value).trim().toLowerCase();
    if (v.startsWith('th')) return 'th';
    if (v.startsWith('ja')) return 'ja';
    if (v === 'pt-br' || v.startsWith('pt_') || v.startsWith('pt-br')) return 'pt-BR';
    if (v.startsWith('es')) return 'es';
    return 'en';
  }

  function activeLanguage() {
    const normalized = normalizeLanguage();
    return SHIPPING_LOCALES.includes(normalized) ? normalized : 'en';
  }

  const COPY = Object.freeze({
    en: {
      healthEmpty: 'Run a checkup to see a factual file-health summary.',
      healthSummary: '{mode} · {files} files · {review} to review',
      modeQuick: 'Quick', modeSmart: 'Smart', modeDeep: 'Deep', modeCustom: 'Custom',
      legalRow: 'Legal & Licenses', legalRowSub: 'Copyright, terms, privacy and third-party notices',
      legalKicker: 'LEGAL', legalTitle: 'Legal & Licenses', legalLead: 'Clear ownership, permitted use and privacy terms for Bearagnostic.',
      copyrightTitle: 'Copyright & Intellectual Property',
      copyrightBody: '© 2026 Benedict Interactive and the applicable legal rights holder(s). All rights reserved. Bearagnostic is proprietary software. Original source code, protectable UI/UX expression, Dr. Bear and brand presentation, original graphics, product copy, localisation, documentation and other protectable original contributions are reserved except where a component states otherwise. Public or technical access to a build, repository, cache or resource does not by itself grant permission to copy, republish, redistribute, sell, sublicense, commercially exploit, scrape, bulk-extract, remove origin notices, bypass Pro entitlement, or create a substantially copied competing product. Restrictions apply only to the extent permitted by law and do not remove non-waivable rights, lawful interoperability, legitimate security research, fair use/fair dealing or statutory exceptions.',
      termsTitle: 'Terms of Use',
      termsBody: 'You may use the released Bearagnostic app for ordinary personal or organisational file-health checking. Deletion remains your choice and Bearagnostic does not guarantee that every file is accessible, safe to remove, or recoverable after deletion. Do not impersonate Benedict Interactive, misrepresent Bearagnostic results, bypass access or purchase controls, distribute cracked or modified entitlement builds, or use protected source/assets outside rights granted by law or written permission.',
      privacyTitle: 'Privacy',
      privacyBody: 'Bearagnostic is local-first. File analysis, previews and aggregate Insights history are designed to remain on your device. The current app does not upload selected file contents or maintain a remote filename inventory. Google Play Billing may process purchase metadata required for ownership and transaction handling under Google Play terms. User-requested support links may use the network.',
      thirdPartyTitle: 'Third-Party Notices',
      thirdPartyBody: 'Android, Google Play, Google Play Billing and other third-party components, services, fonts, libraries, marks and materials remain subject to their own licences and terms. Bearagnostic does not claim ownership of third-party or public-domain material. A valid third-party licence controls for its component where applicable.',
      legalFooter: 'Proprietary — All Rights Reserved · Legal documents in docs/legal/',
      close: 'Close',
      availableMedia: 'Advanced Media Review',
      availableMediaSub: 'Review surfaced photos, videos and audio with richer local previews and filters.',
      availableInsights: 'Insights & Local History',
      availableInsightsSub: 'Historical checkups, What Changed, real storage trends and local patterns from completed scans.',
      availableCleanup: 'Verified Cleanup History',
      availableCleanupSub: 'A local history built only from deletions that Bearagnostic verified as completed.',
      plannedTitle: 'Still planned',
      plannedSub: 'These capabilities remain on the roadmap and are not presented as finished.'
    },
    th: {
      healthEmpty: 'ตรวจเครื่องหนึ่งครั้งเพื่อดูสรุป File Health จากข้อมูลจริง',
      healthSummary: '{mode} · {files} ไฟล์ · รอตรวจ {review} รายการ',
      modeQuick: 'Quick', modeSmart: 'Smart', modeDeep: 'Deep', modeCustom: 'Custom',
      legalRow: 'กฎหมายและสิทธิ์การใช้งาน', legalRowSub: 'ลิขสิทธิ์ เงื่อนไข ความเป็นส่วนตัว และสิทธิ์ของบุคคลที่สาม',
      legalKicker: 'LEGAL', legalTitle: 'กฎหมายและสิทธิ์การใช้งาน', legalLead: 'ระบุสิทธิ์ ความเป็นเจ้าของ การใช้งานที่อนุญาต และความเป็นส่วนตัวของ Bearagnostic อย่างชัดเจน',
      copyrightTitle: 'ลิขสิทธิ์และทรัพย์สินทางปัญญา',
      copyrightBody: '© 2026 Benedict Interactive และผู้ทรงสิทธิตามกฎหมายที่เกี่ยวข้อง สงวนสิทธิ์ทั้งหมด Bearagnostic เป็นซอฟต์แวร์ proprietary งานต้นฉบับที่กฎหมายคุ้มครองได้ เช่น ซอร์สโค้ด การแสดงออกด้าน UI/UX ตัวตนและการนำเสนอ Dr. Bear งานกราฟิก ข้อความผลิตภัณฑ์ งานแปล เอกสาร และผลงานต้นฉบับอื่น ถูกสงวนสิทธิ์ เว้นแต่ component นั้นระบุเงื่อนไขไว้ต่างหาก การที่ build, repository, cache หรือ resource เข้าถึงได้ทางเทคนิค ไม่ได้ให้สิทธิ์โดยอัตโนมัติในการคัดลอก ตีพิมพ์ซ้ำ แจกจ่าย ขาย อนุญาตช่วง ใช้เชิงพาณิชย์ scrape ดึงข้อมูลจำนวนมาก ลบข้อความแสดงที่มา หลบระบบสิทธิ์ Pro หรือสร้างผลิตภัณฑ์คู่แข่งที่คัดลอกในสาระสำคัญ ข้อจำกัดทั้งหมดมีผลเท่าที่กฎหมายอนุญาต และไม่ตัดสิทธิ์ที่กฎหมายห้ามสละ interoperability ที่ชอบด้วยกฎหมาย งานวิจัยความปลอดภัยที่ชอบด้วยกฎหมาย fair use/fair dealing หรือข้อยกเว้นตามกฎหมาย',
      termsTitle: 'เงื่อนไขการใช้งาน',
      termsBody: 'ผู้ใช้สามารถใช้ Bearagnostic ที่เผยแพร่แล้วเพื่อดูแล File Health ของตนเองหรือองค์กรตามปกติ การลบไฟล์เป็นการตัดสินใจของผู้ใช้ และ Bearagnostic ไม่รับประกันว่าแอปจะเข้าถึงไฟล์ได้ทุกไฟล์ ทุกไฟล์จะปลอดภัยต่อการลบ หรือไฟล์ที่ลบแล้วจะกู้คืนได้ ห้ามแอบอ้างเป็น Benedict Interactive บิดเบือนผลลัพธ์ของ Bearagnostic หลบมาตรการเข้าถึงหรือการซื้อ แจก build ที่ crack หรือดัดแปลงระบบสิทธิ์ หรือนำซอร์ส/asset ที่ได้รับความคุ้มครองไปใช้นอกเหนือจากสิทธิ์ที่กฎหมายหรือหนังสืออนุญาตให้ไว้',
      privacyTitle: 'ความเป็นส่วนตัว',
      privacyBody: 'Bearagnostic ออกแบบแบบ local-first การวิเคราะห์ไฟล์ preview และประวัติ Insights แบบสรุปถูกออกแบบให้เก็บบนอุปกรณ์ เวอร์ชันปัจจุบันไม่อัปโหลดเนื้อหาไฟล์ที่เลือกและไม่สร้างคลังชื่อไฟล์ระยะไกล Google Play Billing อาจประมวลผลข้อมูลการซื้อที่จำเป็นต่อการยืนยันสิทธิ์และธุรกรรมตามเงื่อนไขของ Google Play ส่วนลิงก์ช่วยเหลือจะใช้อินเทอร์เน็ตเมื่อผู้ใช้เป็นฝ่ายเลือกเปิดเอง',
      thirdPartyTitle: 'ประกาศเกี่ยวกับบุคคลที่สาม',
      thirdPartyBody: 'Android, Google Play, Google Play Billing รวมถึง component บริการ ฟอนต์ ไลบรารี เครื่องหมาย และวัสดุของบุคคลที่สาม อยู่ภายใต้ licence และเงื่อนไขของเจ้าของแต่ละราย Bearagnostic ไม่อ้างกรรมสิทธิ์เหนือวัสดุของบุคคลที่สามหรือสาธารณสมบัติ และ licence ของบุคคลที่สามที่มีผลใช้บังคับย่อมมีผลกับ component นั้น',
      legalFooter: 'Proprietary — All Rights Reserved · เอกสารฉบับเต็มอยู่ใน docs/legal/',
      close: 'ปิด',
      availableMedia: 'Advanced Media Review',
      availableMediaSub: 'ตรวจรูป วิดีโอ และเสียงที่ถูกคัดขึ้นมาจาก Checkup พร้อม preview และตัวกรองบนเครื่องที่ละเอียดขึ้น',
      availableInsights: 'Insights และ Local History',
      availableInsightsSub: 'ดูประวัติ Checkup, What Changed, แนวโน้มพื้นที่จริง และรูปแบบที่สรุปจากการตรวจที่เสร็จสมบูรณ์',
      availableCleanup: 'ประวัติการลบที่ยืนยันแล้ว',
      availableCleanupSub: 'เก็บประวัติบนเครื่องเฉพาะรายการที่ Bearagnostic ตรวจยืนยันแล้วว่าลบสำเร็จจริง',
      plannedTitle: 'ยังอยู่ในแผนพัฒนา',
      plannedSub: 'ความสามารถต่อไปนี้ยังเป็น roadmap และจะไม่ถูกแสดงว่าเสร็จแล้วก่อนใช้งานได้จริง'
    },
    ja: {
      healthEmpty: 'チェックを実行すると、実データに基づくファイル状態の要約を確認できます。',
      healthSummary: '{mode} · {files}件 · 要確認 {review}件',
      modeQuick: 'Quick', modeSmart: 'Smart', modeDeep: 'Deep', modeCustom: 'Custom',
      legalRow: '法的情報とライセンス', legalRowSub: '著作権、利用条件、プライバシー、第三者ライセンス',
      legalKicker: 'LEGAL', legalTitle: '法的情報とライセンス', legalLead: 'Bearagnostic の権利、許可される利用、プライバシー条件を分かりやすく確認できます。',
      copyrightTitle: '著作権と知的財産',
      copyrightBody: '© 2026 Benedict Interactive および該当する法的権利者。無断転載・複製を禁じます。Bearagnostic はプロプライエタリソフトウェアです。適用法で保護される範囲において、オリジナルのソースコード、UI/UX の表現、Dr. Bear とブランド表現、グラフィック、製品内テキスト、ローカライズ、文書などの独自成果物に関する権利を留保します。ビルド、リポジトリ、キャッシュ、リソースを技術的に閲覧できること自体は、複製、再配布、販売、サブライセンス、商用利用、スクレイピング、大量抽出、出所表示の削除、Pro 権限の回避、実質的にコピーした競合製品の作成を許可するものではありません。法令上放棄できない権利、適法な相互運用、正当なセキュリティ研究、フェアユース等の例外は制限しません。',
      termsTitle: '利用条件',
      termsBody: '公開版 Bearagnostic は、個人または組織の通常のファイル状態確認に利用できます。削除は利用者自身の判断で行うもので、すべてのファイルにアクセスできること、すべての削除が安全であること、削除後に復元できることを保証するものではありません。Benedict Interactive へのなりすまし、結果の虚偽表示、アクセス・購入制御の回避、Pro 権限を不正改変したビルドの配布、法令または書面で許可されていない保護対象ソース・アセットの利用は禁止されます。',
      privacyTitle: 'プライバシー',
      privacyBody: 'Bearagnostic はローカル優先で設計されています。ファイル解析、プレビュー、集計された Insights 履歴は端末内で扱うことを基本とします。現在のアプリは、選択したファイル内容をアップロードせず、ファイル名のリモート一覧も保持しません。Google Play Billing は、Google Play の条件に基づき、所有権や取引処理に必要な購入情報を扱う場合があります。サポート用リンクは、利用者が明示的に開いた場合にのみネットワークを利用します。',
      thirdPartyTitle: '第三者ライセンス',
      thirdPartyBody: 'Android、Google Play、Google Play Billing、および第三者のコンポーネント、サービス、フォント、ライブラリ、商標、素材には、それぞれのライセンスと利用条件が適用されます。Bearagnostic は第三者素材やパブリックドメイン素材の所有権を主張しません。該当コンポーネントについて有効な第三者ライセンスがある場合は、その条件が優先されます。',
      legalFooter: 'Proprietary — All Rights Reserved · 完全な文書は docs/legal/ に収録',
      close: '閉じる',
      availableMedia: '高度なメディアレビュー',
      availableMediaSub: 'チェックで抽出された写真・動画・音声を、端末内の詳細プレビューとフィルターで確認できます。',
      availableInsights: 'Insights とローカル履歴',
      availableInsightsSub: '過去のチェック、What Changed、実ストレージ推移、完了したチェックから得たローカル傾向を確認できます。',
      availableCleanup: '検証済みクリーンアップ履歴',
      availableCleanupSub: 'Bearagnostic が削除完了を確認できた操作だけを端末内履歴として記録します。',
      plannedTitle: '今後の予定',
      plannedSub: '以下はロードマップ項目です。実際に利用可能になるまでは完成済みとして表示しません。'
    },
    es: {
      healthEmpty: 'Haz un análisis para ver un resumen real del estado de tus archivos.',
      healthSummary: '{mode} · {files} archivos · {review} por revisar',
      modeQuick: 'Quick', modeSmart: 'Smart', modeDeep: 'Deep', modeCustom: 'Custom',
      legalRow: 'Avisos legales y licencias', legalRowSub: 'Derechos de autor, condiciones, privacidad y licencias de terceros',
      legalKicker: 'LEGAL', legalTitle: 'Avisos legales y licencias', legalLead: 'Información clara sobre propiedad, uso permitido y privacidad en Bearagnostic.',
      copyrightTitle: 'Derechos de autor y propiedad intelectual',
      copyrightBody: '© 2026 Benedict Interactive y los titulares legales que correspondan. Todos los derechos reservados. Bearagnostic es software propietario. Se reservan, en la medida reconocida por la ley, los derechos sobre el código fuente original, la expresión protegible de la interfaz y la experiencia de usuario, Dr. Bear y la identidad visual, los gráficos originales, los textos del producto, la localización, la documentación y otras aportaciones originales protegibles. El acceso técnico a una compilación, repositorio, caché o recurso no concede por sí mismo permiso para copiar, volver a publicar, redistribuir, vender, sublicenciar, explotar comercialmente, extraer de forma masiva, eliminar avisos de origen, eludir el acceso Pro ni crear un producto competidor sustancialmente copiado. Estas limitaciones se aplican solo en la medida permitida por la ley y no eliminan derechos irrenunciables, interoperabilidad lícita, investigación de seguridad legítima, uso legítimo u otras excepciones legales.',
      termsTitle: 'Condiciones de uso',
      termsBody: 'Puedes usar la versión distribuida legítimamente de Bearagnostic para revisar el estado de los archivos de forma personal o dentro de una organización. Tú decides qué eliminar. Bearagnostic no garantiza que todos los archivos sean accesibles, innecesarios, seguros de borrar o recuperables después de eliminarlos. No suplantes a Benedict Interactive, no tergiverses los resultados, no eludas controles de acceso o compra, no distribuyas compilaciones modificadas o pirateadas que falseen el estado Pro y no uses código o recursos protegidos fuera de los derechos que concedan la ley o un permiso escrito.',
      privacyTitle: 'Privacidad',
      privacyBody: 'Bearagnostic está diseñado con un enfoque local. El análisis de archivos, las vistas previas y el historial agregado de Insights se procesan y guardan en el dispositivo. La versión actual no sube el contenido de los archivos seleccionados ni mantiene un inventario remoto de nombres de archivo. Google Play Billing puede tratar los datos de compra necesarios para gestionar transacciones y derechos de uso conforme a las condiciones de Google Play. Los enlaces de soporte solo usan la red cuando tú decides abrirlos.',
      thirdPartyTitle: 'Avisos de terceros',
      thirdPartyBody: 'Android, Google Play, Google Play Billing y otros componentes, servicios, fuentes, bibliotecas, marcas y materiales de terceros se rigen por sus propias licencias y condiciones. Bearagnostic no reclama la propiedad de materiales de terceros ni de dominio público. Cuando corresponda, la licencia válida del tercero prevalece para ese componente.',
      legalFooter: 'Proprietary — All Rights Reserved · Documentos completos en docs/legal/',
      close: 'Cerrar',
      availableMedia: 'Revisión avanzada de contenido multimedia',
      availableMediaSub: 'Revisa fotos, vídeos y audio detectados en el análisis con vistas previas locales y filtros más útiles.',
      availableInsights: 'Insights e historial local',
      availableInsightsSub: 'Consulta análisis anteriores, What Changed, tendencias reales de almacenamiento y patrones locales basados en análisis completados.',
      availableCleanup: 'Historial de limpiezas verificadas',
      availableCleanupSub: 'Historial local creado solo con eliminaciones que Bearagnostic confirmó como completadas.',
      plannedTitle: 'Aún en desarrollo',
      plannedSub: 'Estas funciones siguen en la hoja de ruta y no se mostrarán como terminadas hasta que estén realmente disponibles.'
    },
    'pt-BR': {
      healthEmpty: 'Faça uma verificação para ver um resumo real da saúde dos seus arquivos.',
      healthSummary: '{mode} · {files} arquivos · {review} para revisar',
      modeQuick: 'Quick', modeSmart: 'Smart', modeDeep: 'Deep', modeCustom: 'Custom',
      legalRow: 'Informações legais e licenças', legalRowSub: 'Direitos autorais, termos, privacidade e licenças de terceiros',
      legalKicker: 'LEGAL', legalTitle: 'Informações legais e licenças', legalLead: 'Informações claras sobre propriedade, uso permitido e privacidade no Bearagnostic.',
      copyrightTitle: 'Direitos autorais e propriedade intelectual',
      copyrightBody: '© 2026 Benedict Interactive e os titulares legais aplicáveis. Todos os direitos reservados. Bearagnostic é software proprietário. Na medida reconhecida pela lei, ficam reservados os direitos sobre o código-fonte original, a expressão protegível de UI/UX, Dr. Bear e a identidade visual, gráficos originais, textos do produto, localização, documentação e outras contribuições originais protegíveis. O acesso técnico a um build, repositório, cache ou recurso não concede, por si só, permissão para copiar, republicar, redistribuir, vender, sublicenciar, explorar comercialmente, extrair em massa, remover avisos de origem, contornar o acesso Pro ou criar um produto concorrente substancialmente copiado. As restrições valem apenas até onde a lei permitir e não eliminam direitos irrenunciáveis, interoperabilidade legítima, pesquisa de segurança legítima, uso justo ou outras exceções legais.',
      termsTitle: 'Termos de uso',
      termsBody: 'Você pode usar uma versão legitimamente distribuída do Bearagnostic para verificar a saúde dos arquivos em uso pessoal ou organizacional. A decisão de excluir arquivos é sua. O Bearagnostic não garante que todos os arquivos sejam acessíveis, desnecessários, seguros para excluir ou recuperáveis depois da exclusão. Não se passe pela Benedict Interactive, não deturpe os resultados, não contorne controles de acesso ou compra, não distribua builds crackeados ou modificados que falsifiquem o status Pro e não use código ou recursos protegidos fora dos direitos concedidos por lei ou autorização por escrito.',
      privacyTitle: 'Privacidade',
      privacyBody: 'O Bearagnostic foi projetado com foco local. A análise de arquivos, as prévias e o histórico agregado do Insights são processados e armazenados no dispositivo. A versão atual não envia o conteúdo dos arquivos selecionados nem mantém um inventário remoto de nomes de arquivos. O Google Play Billing pode processar os dados de compra necessários para gerenciar transações e direitos de uso conforme os termos do Google Play. Links de suporte só usam a rede quando você decide abri-los.',
      thirdPartyTitle: 'Avisos de terceiros',
      thirdPartyBody: 'Android, Google Play, Google Play Billing e outros componentes, serviços, fontes, bibliotecas, marcas e materiais de terceiros continuam sujeitos às próprias licenças e termos. O Bearagnostic não reivindica propriedade sobre materiais de terceiros ou de domínio público. Quando aplicável, a licença válida do terceiro prevalece para aquele componente.',
      legalFooter: 'Proprietary — All Rights Reserved · Documentos completos em docs/legal/',
      close: 'Fechar',
      availableMedia: 'Revisão avançada de mídia',
      availableMediaSub: 'Revise fotos, vídeos e áudios encontrados na verificação com prévias locais e filtros mais úteis.',
      availableInsights: 'Insights e histórico local',
      availableInsightsSub: 'Veja verificações anteriores, What Changed, tendências reais de armazenamento e padrões locais baseados em verificações concluídas.',
      availableCleanup: 'Histórico de limpezas verificadas',
      availableCleanupSub: 'Histórico local criado apenas com exclusões que o Bearagnostic confirmou como concluídas.',
      plannedTitle: 'Ainda planejado',
      plannedSub: 'Esses recursos continuam no roadmap e não serão apresentados como concluídos até estarem realmente disponíveis.'
    }
  });

  function c() { return COPY[activeLanguage()] || COPY.en; }
  function parseJson(value) {
    try { return typeof value === 'string' ? JSON.parse(value) : (value || {}); }
    catch (_) { return {}; }
  }
  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function formatNumber(value) {
    const locale = activeLanguage() === 'th' ? 'th-TH' : activeLanguage() === 'ja' ? 'ja-JP' : 'en-US';
    try { return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.max(0, Number(value) || 0)); }
    catch (_) { return String(Math.max(0, Number(value) || 0)); }
  }
  function modeLabel(mode) {
    const t = c();
    const key = String(mode || '').toLowerCase();
    if (key === 'quick') return t.modeQuick;
    if (key === 'deep') return t.modeDeep;
    if (key === 'custom') return t.modeCustom;
    return t.modeSmart;
  }

  function ensureStyle() {
    if (byId('androidStabilization45Style')) return;
    const style = document.createElement('style');
    style.id = 'androidStabilization45Style';
    style.textContent = `
      /* B45 Pro restraint: one global PRO indicator + one Pro entry, no repeated status ribbons. */
      #baMorePlanStatus,.ba-pro-row-badge{display:none!important}
      #moreScreen .panel-head{padding-right:3px!important}
      #moreScreen.is-active{overflow-y:auto!important;overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch;padding-bottom:24px!important;scrollbar-width:none}
      #moreScreen.is-active::-webkit-scrollbar{display:none}

      /* Preferences subtitle belongs to scrolling content, never to fixed title geometry. */
      #preferencesScreen .settings-title-row{align-items:center!important}
      #preferencesScreen .ba-preferences-scroll-intro{display:block;margin:2px 4px 11px;padding:0;color:#7f8d9c;font-size:12.5px;line-height:1.48}

      /* File Health remains factual: no percentage score, no decorative health grade. */
      #healthCard[data-b45-health-ready="true"] .health-card__copy small{color:#6f8193}

      /* Legal entry and sheet. */
      #baLegalRow{--tone:91,116,145;background:linear-gradient(112deg,#fff 34%,rgba(86,116,145,.055) 100%)}
      #baLegalRow .soft-icon{color:#55738f!important;background:linear-gradient(145deg,#edf4f9,#f7fbfd)!important}
      .ba-legal-overlay{position:fixed;inset:0;z-index:2350;display:grid;align-items:end;padding:0 10px max(10px,env(safe-area-inset-bottom));background:rgba(14,25,44,.34);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}
      .ba-legal-overlay[hidden]{display:none!important}.ba-legal-panel{width:min(100%,560px);max-height:min(91vh,880px);margin:0 auto;overflow:auto;overscroll-behavior:contain;border-radius:31px 31px 24px 24px;background:linear-gradient(180deg,#fff,#f6f9fc);border:1px solid rgba(255,255,255,.98);box-shadow:0 -24px 70px rgba(24,48,78,.25),inset 0 1px 0 #fff;padding:11px 15px 18px;color:#172a40}
      .ba-legal-handle{width:43px;height:4px;margin:0 auto 12px;border-radius:999px;background:#d6e0e9}.ba-legal-head{display:grid;grid-template-columns:minmax(0,1fr) 40px;gap:10px;align-items:start}.ba-legal-kicker{display:block;font-size:8px;letter-spacing:.19em;color:#647d97;font-weight:850}.ba-legal-title{margin:4px 0 0;font-family:"Iowan Old Style",Baskerville,Georgia,serif;font-size:24px;font-weight:500;letter-spacing:-.035em}.ba-legal-close{width:40px;height:40px;border-radius:14px;background:#edf3f8;color:#718294;font-size:21px}.ba-legal-lead{margin:9px 1px 13px;color:#6f7f90;font-size:11.5px;line-height:1.5}
      .ba-legal-stack{display:grid;gap:9px}.ba-legal-card{padding:13px 14px;border-radius:19px;background:#fff;border:1px solid rgba(80,112,146,.10);box-shadow:0 7px 18px rgba(67,98,133,.055)}.ba-legal-card strong{display:block;color:#243b52;font-size:12px}.ba-legal-card p{margin:6px 0 0;color:#6f7f8f;font-size:10.5px;line-height:1.55;white-space:normal}.ba-legal-footer{margin:12px 2px 0;color:#8a97a5;font-size:9px;line-height:1.45;text-align:center}

      /* Implemented Pro capabilities are presented as current, not roadmap. */
      .ba-pro-feature[data-b45-feature]{display:grid;grid-template-columns:31px minmax(0,1fr);column-gap:10px;align-items:center}.ba-pro-feature[data-b45-feature] .ba-pro-feature__icon{grid-column:1;grid-row:1/3;margin-bottom:0!important}.ba-pro-feature[data-b45-feature]>strong,.ba-pro-feature[data-b45-feature]>small{grid-column:2}
      @media(max-width:360px){.ba-pro-feature[data-b45-feature]{grid-template-columns:28px minmax(0,1fr)}.ba-legal-panel{padding-left:12px;padding-right:12px}}
      @media(prefers-reduced-motion:reduce){.ba-legal-overlay *{scroll-behavior:auto!important}}
    `;
    document.head.appendChild(style);
  }

  function fixPreferencesHeader() {
    const screen = byId('preferencesScreen');
    const intro = screen?.querySelector('.preferences-intro');
    const scroll = screen?.querySelector('.preferences-scroll');
    if (!intro || !scroll) return;
    if (intro.parentElement !== scroll) scroll.insertAdjacentElement('afterbegin', intro);
    intro.classList.add('ba-preferences-scroll-intro');
  }

  const implementedRoadmapLabels = new Set([
    'Advanced exact duplicate workflow','Advanced media review & filters','Historical Insights & What Changed','Full cleanup history',
    'ระบบจัดการไฟล์ซ้ำแบบ exact ขั้นสูง','Media Review และตัวกรองขั้นสูง','Insights ย้อนหลังและ What Changed','ประวัติการทำความสะอาดแบบเต็ม',
    '高度な完全一致重複ワークフロー','高度なメディアレビューとフィルター','履歴 Insights と What Changed','完全なクリーンアップ履歴'
  ]);

  function addProFeature(grid, key, title, body, path) {
    let card = grid.querySelector(`[data-b45-feature="${key}"]`);
    if (!card) {
      card = document.createElement('article');
      card.className = 'ba-pro-feature';
      card.dataset.b45Feature = key;
      card.innerHTML = `<span class="ba-pro-feature__icon"><svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg></span><strong></strong><small></small>`;
      grid.appendChild(card);
    }
    const strong = card.querySelector('strong');
    const small = card.querySelector('small');
    if (strong && strong.textContent !== title) strong.textContent = title;
    if (small && small.textContent !== body) small.textContent = body;
  }

  function patchProTruth() {
    const grid = document.querySelector('.ba-pro-feature-grid');
    if (!grid) return;
    const t = c();
    addProFeature(grid, 'media', t.availableMedia, t.availableMediaSub, '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m6 17 4-4 3 3 2-2 3 3"/>');
    addProFeature(grid, 'insights', t.availableInsights, t.availableInsightsSub, '<path d="M5 18V9M12 18V5M19 18v-6"/><path d="M3 20h18"/>');
    addProFeature(grid, 'cleanup-history', t.availableCleanup, t.availableCleanupSub, '<path d="M5 7h14M9 7V4h6v3M8 10v7M12 10v7M16 10v7"/><path d="M6 7l1 13h10l1-13"/>');

    document.querySelectorAll('.ba-pro-roadmap__chips span').forEach((chip) => {
      if (implementedRoadmapLabels.has((chip.textContent || '').trim())) chip.remove();
    });
    const roadmap = document.querySelector('.ba-pro-roadmap');
    const plannedSection = roadmap?.closest('.ba-pro-section');
    const heading = plannedSection?.querySelector('.ba-pro-section-head strong');
    const paragraph = roadmap?.querySelector('p');
    if (heading && heading.textContent !== t.plannedTitle) heading.textContent = t.plannedTitle;
    if (paragraph && paragraph.textContent !== t.plannedSub) paragraph.textContent = t.plannedSub;
  }

  function refreshFileHealth() {
    const summaryNode = byId('healthSummary');
    const card = byId('healthCard');
    if (!summaryNode || !card) return;
    summaryNode.removeAttribute('data-i18n');
    let history = {};
    try { history = parseJson(NATIVE?.getInsightsHistory?.()); } catch (_) { history = {}; }
    const latest = history?.available === true && history?.latest && typeof history.latest === 'object' ? history.latest : null;
    if (!latest) {
      const value = c().healthEmpty;
      if (summaryNode.textContent !== value) summaryNode.textContent = value;
      card.dataset.b45HealthReady = 'false';
    } else {
      const value = c().healthSummary
        .replace('{mode}', modeLabel(latest.scanMode))
        .replace('{files}', formatNumber(latest.reviewedFiles))
        .replace('{review}', formatNumber(latest.reviewCandidateCount));
      if (summaryNode.textContent !== value) summaryNode.textContent = value;
      card.dataset.b45HealthReady = 'true';
    }
    if (!healthClickBound) {
      healthClickBound = true;
      card.addEventListener('click', (event) => {
        const target = document.querySelector('.bottom-nav [data-nav="insights"]');
        if (!target) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        target.click();
      }, true);
    }
  }

  function legalIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h6"/></svg>';
  }

  function ensureLegalRow() {
    const list = document.querySelector('#moreScreen .settings-list');
    if (!list) return;
    let row = byId('baLegalRow');
    if (!row) {
      row = document.createElement('button');
      row.type = 'button';
      row.className = 'setting-link';
      row.id = 'baLegalRow';
      row.innerHTML = `<span class="soft-icon">${legalIcon()}</span><span><strong></strong><small></small></span><b>›</b>`;
      const about = list.querySelector('[data-open="about"]');
      if (about) about.insertAdjacentElement('beforebegin', row); else list.appendChild(row);
      row.addEventListener('click', openLegal);
    }
    const t = c();
    const strong = row.querySelector('strong');
    const small = row.querySelector('small');
    if (strong) strong.textContent = t.legalRow;
    if (small) small.textContent = t.legalRowSub;
  }

  function ensureLegalOverlay() {
    let overlay = byId('baLegalOverlay');
    if (overlay) return overlay;
    overlay = document.createElement('section');
    overlay.id = 'baLegalOverlay';
    overlay.className = 'ba-legal-overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay || event.target.closest?.('[data-legal-close]')) closeLegal();
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  function renderLegal() {
    const overlay = ensureLegalOverlay();
    const t = c();
    overlay.innerHTML = `<div class="ba-legal-panel"><div class="ba-legal-handle"></div><header class="ba-legal-head"><div><span class="ba-legal-kicker">${esc(t.legalKicker)}</span><h2 class="ba-legal-title">${esc(t.legalTitle)}</h2></div><button class="ba-legal-close" type="button" data-legal-close aria-label="${esc(t.close)}">×</button></header><p class="ba-legal-lead">${esc(t.legalLead)}</p><div class="ba-legal-stack"><article class="ba-legal-card"><strong>${esc(t.copyrightTitle)}</strong><p>${esc(t.copyrightBody)}</p></article><article class="ba-legal-card"><strong>${esc(t.termsTitle)}</strong><p>${esc(t.termsBody)}</p></article><article class="ba-legal-card"><strong>${esc(t.privacyTitle)}</strong><p>${esc(t.privacyBody)}</p></article><article class="ba-legal-card"><strong>${esc(t.thirdPartyTitle)}</strong><p>${esc(t.thirdPartyBody)}</p></article></div><p class="ba-legal-footer">${esc(t.legalFooter)}</p></div>`;
  }

  function openLegal() {
    renderLegal();
    const overlay = byId('baLegalOverlay');
    if (!overlay) return;
    overlay.hidden = false;
    document.body.classList.add('modal-open');
    overlay.querySelector('.ba-legal-panel')?.scrollTo?.({ top: 0, behavior: 'auto' });
  }
  function closeLegal() {
    const overlay = byId('baLegalOverlay');
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove('modal-open');
  }

  function refresh() {
    ensureStyle();
    fixPreferencesHeader();
    ensureLegalRow();
    patchProTruth();
    refreshFileHealth();
  }

  function queueRefresh() {
    if (observerQueued) return;
    observerQueued = true;
    requestAnimationFrame(() => {
      observerQueued = false;
      refresh();
    });
  }

  window.addEventListener('bearagnostic:languagechange', () => { queueRefresh(); if (!byId('baLegalOverlay')?.hidden) renderLegal(); });
  window.addEventListener('bearagnostic:screenchange', queueRefresh);
  window.addEventListener('bearagnostic:entitlementchange', queueRefresh);
  window.addEventListener('bearagnostic:scancomplete', queueRefresh);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !byId('baLegalOverlay')?.hidden) closeLegal(); });

  const observer = new MutationObserver(queueRefresh);
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, { once: true });
  else refresh();

  window.BearagnosticLocalization = Object.freeze({
    launchLocales: LAUNCH_LOCALES,
    shippingLocales: SHIPPING_LOCALES,
    normalizeLanguage,
    activeLanguage,
    isFullyLocalized: (locale) => SHIPPING_LOCALES.includes(normalizeLanguage(locale))
  });
  window.BearagnosticStabilization = Object.freeze({ refresh, openLegal, closeLegal, build: 45 });
})();
