(() => {
  'use strict';

  // B76: extend the approved PWA localization table before js/core/app.js captures it.
  const BASE = window.BEARAGNOSTIC_I18N || {};
  const ES = Object.freeze({
  "doctorIn": "Dr. Bear está listo.",
  "portraitTitle": "Solo en modo vertical",
  "portraitBody": "Pon el teléfono en posición vertical para continuar.",
  "settingsAria": "Ajustes",
  "backAria": "Atrás",
  "brandFileHealth": "SALUD DE ARCHIVOS",
  "brandBrighterDays": "DÍAS MÁS LIGEROS",
  "heroTitle": "<em>Un dispositivo más limpio</em><br><em>para que todo fluya mejor.</em>",
  "startCheckup": "Iniciar revisión",
  "startCheckupBody": "Elige archivos o una carpeta para analizar.",
  "cleanup": "Limpieza",
  "cleanupSub": "Revisar candidatos",
  "duplicates": "Duplicados",
  "duplicatesSub": "Buscar repeticiones",
  "largeFiles": "Archivos grandes",
  "largeFilesSub": "Los que más ocupan",
  "olderFiles": "Archivos antiguos",
  "olderFilesSub": "Revisar fechas antiguas",
  "fileHealth": "Salud de archivos",
  "fileHealthSub": "El resumen de tu revisión aparecerá aquí.",
  "editorialQuote": "Un dispositivo más limpio deja un poco más de calma.",
  "navHome": "Inicio",
  "navCheckup": "Revisión",
  "navTools": "Herramientas",
  "navInsights": "Insights",
  "navMore": "Más",
  "checkupKicker": "REVISIÓN",
  "checkupTitle": "Tu próxima revisión de archivos",
  "checkupBody": "El motor de análisis real llega en la próxima versión. Nada aquí finge haber analizado todo el dispositivo.",
  "checkupReady": "Dr. Bear está listo.",
  "checkupReadySub": "La selección de archivos y el análisis real son el siguiente paso de producción.",
  "toolsKicker": "HERRAMIENTAS",
  "toolsTitle": "Revisión enfocada de archivos",
  "toolsBody": "Cada herramienta trabajará únicamente con los archivos que elijas explícitamente.",
  "insightsKicker": "INSIGHTS",
  "insightsTitle": "Patrones útiles, cuando existan",
  "insightsBody": "Insights permanece vacío hasta que las revisiones reales creen un historial local fiable.",
  "noInsights": "Todavía no hay Insights",
  "noInsightsSub": "Ejecuta primero una revisión real. Bearagnostic nunca inventará una puntuación.",
  "moreKicker": "MÁS",
  "moreTitle": "Bearagnostic",
  "moreSub": "Preferencias, privacidad, ayuda e información de la app.",
  "preferences": "Preferencias",
  "preferencesSub": "Idioma, movimiento y comportamiento de pantalla completa",
  "privacyLocal": "Privacidad y datos locales",
  "privacyLocalSub": "Qué permanece en tu dispositivo",
  "helpFeedback": "Ayuda y comentarios",
  "helpFeedbackSub": "Informa de un problema o envía comentarios",
  "aboutBearagnostic": "Acerca de Bearagnostic",
  "closeBearagnostic": "Cerrar Bearagnostic",
  "closeBearagnosticSub": "Finalizar esta sesión de la app",
  "preferencesKicker": "PREFERENCIAS",
  "settings": "Ajustes",
  "experience": "Experiencia",
  "language": "Idioma",
  "languageSub": "Elige el idioma de la interfaz",
  "motion": "Movimiento",
  "motionSub": "Elige cuánto movimiento quieres en la interfaz",
  "motionSystem": "Sistema",
  "motionFull": "Completo",
  "motionReduced": "Reducido",
  "browserFullscreen": "Pantalla completa del navegador",
  "browserFullscreenSub": "Solicitar pantalla completa después de tu próximo toque",
  "localAnalysis": "Análisis local",
  "localAnalysisSub": "La app no sube los archivos seleccionados en esta versión",
  "clearLocalData": "Borrar datos locales de la app",
  "clearLocalDataSub": "Restablecer preferencias e historial local",
  "reportProblem": "Informar de un problema",
  "reportProblemSub": "Abrir tu app de correo con diagnósticos seguros",
  "sendFeedback": "Enviar comentarios",
  "sendFeedbackSub": "Cuéntale a Benedict Interactive qué opinas",
  "copyDiagnostics": "Copiar información de diagnóstico",
  "copyDiagnosticsSub": "Solo datos de compilación y capacidades",
  "aboutPrivacyNote": "Los archivos seleccionados se analizan localmente con Bearagnostic y la app no los sube en la versión actual.",
  "installBadge": "EXPERIENCIA DE APP",
  "installTitle": "Pon a Dr. Bear en tu pantalla de inicio.",
  "installBody": "Instala Bearagnostic para abrirlo a pantalla completa y acceder con un toque.",
  "yourFilesChoice": "Tus archivos. Tu decisión.",
  "installPrivacy": "Los archivos seleccionados permanecen localmente en esta app en la versión actual.",
  "iosStep1": "Toca Compartir en Safari.",
  "iosStep2": "Elige “Añadir a pantalla de inicio”.",
  "iosStep3": "Toca Añadir y abre Bearagnostic desde su icono.",
  "installButton": "Instalar Bearagnostic",
  "gotIt": "Entendido",
  "notNow": "Ahora no",
  "cancel": "Cancelar",
  "closeConfirmTitle": "¿Cerrar Bearagnostic?",
  "closeConfirmBody": "La sesión actual de la app finalizará.",
  "closeConfirmButton": "Cerrar app",
  "clearConfirmTitle": "¿Borrar los datos locales de la app?",
  "clearConfirmBody": "Esto restablece las preferencias de Bearagnostic y cualquier historial local de este dispositivo.",
  "clearConfirmButton": "Borrar datos",
  "clearedToast": "Datos locales de la app borrados.",
  "diagnosticsCopied": "Información de diagnóstico copiada.",
  "emailUnavailable": "No se pudo abrir tu app de correo.",
  "installUnavailableTitle": "Instala desde el menú del navegador",
  "installUnavailableBody": "Elige “Instalar app” o “Añadir a pantalla de inicio” en el menú del navegador.",
  "privacyTitle": "Privacidad y datos locales",
  "privacyKicker": "PRIVACIDAD",
  "privacyBodyHtml": "<p><strong>Los archivos seleccionados se analizan localmente.</strong> Bearagnostic no sube el contenido de los archivos seleccionados en la versión actual.</p><p>No se necesita ninguna cuenta. Las preferencias y el historial futuro de revisiones se guardan localmente en este dispositivo hasta que los borres.</p>",
  "helpTitle": "Ayuda y comentarios",
  "helpKicker": "AYUDA",
  "helpBodyHtml": "<p>Usa Ajustes para informar de un problema, enviar comentarios o copiar información de diagnóstico segura. El texto de diagnóstico nunca incluye nombres de archivo, rutas, contenido, hashes, capturas de pantalla, datos del portapapeles ni ubicación.</p><p><strong>benedict.support@gmail.com</strong></p>",
  "aboutTitle": "Acerca de Bearagnostic",
  "aboutKicker": "ACERCA DE",
  "aboutBodyHtml": "<p><strong>Bearagnostic</strong> es un asistente de salud de archivos local-first de Benedict Interactive.</p><p>Versión 0.1.2 · Build 3<br>Benedict Interactive · Bangkok, Tailandia</p>",
  "toolComingTitle": "El análisis real es el siguiente paso",
  "toolComingBody": "Esta herramienta analizará únicamente los archivos o carpetas que elijas explícitamente.",
  "exitReadyTitle": "Bearagnostic está listo para cerrarse.",
  "exitReadyBody": "Usa el control Inicio o Atrás de tu dispositivo para salir de la app.",
  "returnToApp": "Volver a Bearagnostic"
});
  const PT_BR = Object.freeze({
  "doctorIn": "Dr. Bear está pronto.",
  "portraitTitle": "Somente no modo vertical",
  "portraitBody": "Coloque o celular na posição vertical para continuar.",
  "settingsAria": "Configurações",
  "backAria": "Voltar",
  "brandFileHealth": "SAÚDE DOS ARQUIVOS",
  "brandBrighterDays": "DIAS MAIS LEVES",
  "heroTitle": "<em>Um dispositivo mais limpo</em><br><em>para tudo fluir melhor.</em>",
  "startCheckup": "Iniciar verificação",
  "startCheckupBody": "Escolha arquivos ou uma pasta para analisar.",
  "cleanup": "Limpeza",
  "cleanupSub": "Revisar candidatos",
  "duplicates": "Duplicados",
  "duplicatesSub": "Encontrar repetições",
  "largeFiles": "Arquivos grandes",
  "largeFilesSub": "Os que mais ocupam espaço",
  "olderFiles": "Arquivos antigos",
  "olderFilesSub": "Revisar datas antigas",
  "fileHealth": "Saúde dos arquivos",
  "fileHealthSub": "O resumo da sua verificação aparecerá aqui.",
  "editorialQuote": "Um dispositivo mais limpo traz um pouco mais de calma.",
  "navHome": "Início",
  "navCheckup": "Verificação",
  "navTools": "Ferramentas",
  "navInsights": "Insights",
  "navMore": "Mais",
  "checkupKicker": "VERIFICAÇÃO",
  "checkupTitle": "Sua próxima verificação de arquivos",
  "checkupBody": "O mecanismo de análise real chega na próxima versão. Nada aqui finge ter verificado o dispositivo inteiro.",
  "checkupReady": "Dr. Bear está pronto.",
  "checkupReadySub": "A seleção de arquivos e a análise real são o próximo passo de produção.",
  "toolsKicker": "FERRAMENTAS",
  "toolsTitle": "Revisão focada de arquivos",
  "toolsBody": "Cada ferramenta trabalhará apenas com os arquivos que você escolher explicitamente.",
  "insightsKicker": "INSIGHTS",
  "insightsTitle": "Padrões úteis, quando existirem",
  "insightsBody": "Insights permanece vazio até que verificações reais criem um histórico local confiável.",
  "noInsights": "Ainda não há Insights",
  "noInsightsSub": "Execute primeiro uma verificação real. O Bearagnostic nunca inventará uma pontuação.",
  "moreKicker": "MAIS",
  "moreTitle": "Bearagnostic",
  "moreSub": "Preferências, privacidade, ajuda e informações do app.",
  "preferences": "Preferências",
  "preferencesSub": "Idioma, movimento e comportamento em tela cheia",
  "privacyLocal": "Privacidade e dados locais",
  "privacyLocalSub": "O que permanece no seu dispositivo",
  "helpFeedback": "Ajuda e feedback",
  "helpFeedbackSub": "Relate um problema ou envie feedback",
  "aboutBearagnostic": "Sobre o Bearagnostic",
  "closeBearagnostic": "Fechar o Bearagnostic",
  "closeBearagnosticSub": "Encerrar esta sessão do app",
  "preferencesKicker": "PREFERÊNCIAS",
  "settings": "Configurações",
  "experience": "Experiência",
  "language": "Idioma",
  "languageSub": "Escolha o idioma da interface",
  "motion": "Movimento",
  "motionSub": "Escolha quanto movimento deseja na interface",
  "motionSystem": "Sistema",
  "motionFull": "Completo",
  "motionReduced": "Reduzido",
  "browserFullscreen": "Tela cheia do navegador",
  "browserFullscreenSub": "Solicitar tela cheia depois do próximo toque",
  "localAnalysis": "Análise local",
  "localAnalysisSub": "O app não envia os arquivos selecionados nesta versão",
  "clearLocalData": "Limpar dados locais do app",
  "clearLocalDataSub": "Redefinir preferências e histórico local",
  "reportProblem": "Relatar um problema",
  "reportProblemSub": "Abrir seu app de e-mail com diagnósticos seguros",
  "sendFeedback": "Enviar feedback",
  "sendFeedbackSub": "Conte à Benedict Interactive o que você achou",
  "copyDiagnostics": "Copiar informações de diagnóstico",
  "copyDiagnosticsSub": "Somente detalhes da build e dos recursos",
  "aboutPrivacyNote": "Os arquivos selecionados são analisados localmente pelo Bearagnostic e não são enviados pelo app na versão atual.",
  "installBadge": "EXPERIÊNCIA DO APP",
  "installTitle": "Coloque o Dr. Bear na sua tela inicial.",
  "installBody": "Instale o Bearagnostic para abrir em tela cheia e acessar com um toque.",
  "yourFilesChoice": "Seus arquivos. Sua escolha.",
  "installPrivacy": "Os arquivos selecionados permanecem locais neste app na versão atual.",
  "iosStep1": "Toque em Compartilhar no Safari.",
  "iosStep2": "Escolha “Adicionar à Tela de Início”.",
  "iosStep3": "Toque em Adicionar e abra o Bearagnostic pelo ícone.",
  "installButton": "Instalar Bearagnostic",
  "gotIt": "Entendi",
  "notNow": "Agora não",
  "cancel": "Cancelar",
  "closeConfirmTitle": "Fechar o Bearagnostic?",
  "closeConfirmBody": "A sessão atual do app será encerrada.",
  "closeConfirmButton": "Fechar app",
  "clearConfirmTitle": "Limpar os dados locais do app?",
  "clearConfirmBody": "Isso redefine as preferências do Bearagnostic e todo o histórico local neste dispositivo.",
  "clearConfirmButton": "Limpar dados",
  "clearedToast": "Dados locais do app apagados.",
  "diagnosticsCopied": "Informações de diagnóstico copiadas.",
  "emailUnavailable": "Não foi possível abrir seu app de e-mail.",
  "installUnavailableTitle": "Instale pelo menu do navegador",
  "installUnavailableBody": "Escolha “Instalar app” ou “Adicionar à Tela de Início” no menu do navegador.",
  "privacyTitle": "Privacidade e dados locais",
  "privacyKicker": "PRIVACIDADE",
  "privacyBodyHtml": "<p><strong>Os arquivos selecionados são analisados localmente.</strong> O Bearagnostic não envia o conteúdo dos arquivos selecionados na versão atual.</p><p>Nenhuma conta é necessária. As preferências e o futuro histórico de verificações ficam armazenados localmente neste dispositivo até você apagá-los.</p>",
  "helpTitle": "Ajuda e feedback",
  "helpKicker": "SUPORTE",
  "helpBodyHtml": "<p>Use Configurações para relatar um problema, enviar feedback ou copiar informações de diagnóstico seguras. O texto de diagnóstico nunca inclui nomes de arquivos, caminhos, conteúdo, hashes, capturas de tela, dados da área de transferência ou localização.</p><p><strong>benedict.support@gmail.com</strong></p>",
  "aboutTitle": "Sobre o Bearagnostic",
  "aboutKicker": "SOBRE",
  "aboutBodyHtml": "<p><strong>Bearagnostic</strong> é um assistente local-first de saúde dos arquivos da Benedict Interactive.</p><p>Versão 0.1.2 · Build 3<br>Benedict Interactive · Bangkok, Tailândia</p>",
  "toolComingTitle": "A análise real é o próximo passo",
  "toolComingBody": "Esta ferramenta analisará apenas os arquivos ou pastas que você escolher explicitamente.",
  "exitReadyTitle": "O Bearagnostic está pronto para fechar.",
  "exitReadyBody": "Use o controle Início ou Voltar do dispositivo para sair do app.",
  "returnToApp": "Voltar ao Bearagnostic"
});
  window.BEARAGNOSTIC_I18N = Object.freeze({ ...BASE, es: ES, 'pt-BR': PT_BR });

  const LANG_KEY = 'bearagnostic.language';
  const LOCALES = Object.freeze(['en', 'th', 'ja', 'es', 'pt-BR']);
  const A11Y = Object.freeze({
    en: Object.freeze({ close:'Close', filter:'Filter', sort:'Sort', display:'Review display' }),
    th: Object.freeze({ close:'ปิด', filter:'ตัวกรอง', sort:'เรียงลำดับ', display:'รูปแบบการแสดงผล' }),
    ja: Object.freeze({ close:'閉じる', filter:'フィルター', sort:'並べ替え', display:'表示方法' }),
    es: Object.freeze({ close:'Cerrar', filter:'Filtro', sort:'Ordenar', display:'Vista de revisión' }),
    'pt-BR': Object.freeze({ close:'Fechar', filter:'Filtro', sort:'Ordenar', display:'Exibição da revisão' }),
  });

  function normalize(value) {
    const v = String(value || 'en').trim().toLowerCase();
    if (v.startsWith('th')) return 'th';
    if (v.startsWith('ja')) return 'ja';
    if (v.startsWith('es')) return 'es';
    if (v === 'pt-br' || v.startsWith('pt-br') || v.startsWith('pt_')) return 'pt-BR';
    return 'en';
  }

  function a11y(key, value = document.documentElement.lang || 'en') {
    const locale = normalize(value);
    return A11Y[locale]?.[key] || A11Y.en[key] || key;
  }

  function ensureLanguageButtons() {
    const group = document.querySelector('[data-language-group]');
    if (!group) return;
    const items = [
      ['en', 'EN', 'English'],
      ['th', 'ไทย', 'ไทย'],
      ['ja', '日本語', '日本語'],
      ['es', 'ES', 'Español'],
      ['pt-BR', 'PT-BR', 'Português (Brasil)'],
    ];
    const existing = new Map([...group.querySelectorAll('[data-lang]')].map((button) => [button.dataset.lang, button]));
    for (const [code, label, aria] of items) {
      let button = existing.get(code);
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.dataset.lang = code;
      }
      button.textContent = label;
      button.setAttribute('aria-label', aria);
      group.appendChild(button);
    }
  }

  function ensureStyles() {
    if (document.getElementById('baFiveLocaleStyles')) return;
    const style = document.createElement('style');
    style.id = 'baFiveLocaleStyles';
    style.textContent = `
      [data-language-group]{
        display:grid!important;
        grid-template-columns:repeat(5,minmax(0,1fr))!important;
        gap:3px!important;
        width:min(100%,310px)!important;
        min-width:min(62vw,280px)!important;
      }
      [data-language-group] button{
        min-width:0!important;
        padding:7px 4px!important;
        font-size:8.7px!important;
        line-height:1.15!important;
        white-space:nowrap!important;
        letter-spacing:0!important;
      }
      @media(max-width:390px){
        #preferencesScreen .setting-row:has([data-language-group]){
          grid-template-columns:1fr!important;
          align-items:start!important;
          gap:9px!important;
        }
        #preferencesScreen [data-language-group]{width:100%!important;min-width:0!important}
      }
      html[lang^="es"]{
        --ba-display-heading-size:clamp(27px,7.25vw,37px);
        --ba-section-heading-size:clamp(23px,6.1vw,29px);
        --ba-workspace-heading-size:clamp(21px,5.5vw,25px);
      }
      html[lang^="pt"]{
        --ba-display-heading-size:clamp(27px,7.15vw,36px);
        --ba-section-heading-size:clamp(23px,6vw,29px);
        --ba-workspace-heading-size:clamp(21px,5.45vw,25px);
      }
      html[lang^="es"] h1,html[lang^="es"] h2,html[lang^="es"] h3,
      html[lang^="pt"] h1,html[lang^="pt"] h2,html[lang^="pt"] h3{
        overflow-wrap:break-word;
        word-break:normal;
      }
    `;
    document.head.appendChild(style);
  }

  function detectFirstLocale() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved && LOCALES.includes(normalize(saved))) return;
      const preferred = navigator.languages?.[0] || navigator.language || 'en';
      const locale = normalize(preferred);
      if (locale === 'es' || locale === 'pt-BR') localStorage.setItem(LANG_KEY, locale);
    } catch (_) {}
  }

  function syncNative(value) {
    const locale = normalize(value);
    try { window.BearagnosticNative?.setAppLanguage?.(locale); } catch (_) {}
  }

  detectFirstLocale();
  ensureStyles();
  ensureLanguageButtons();

  window.addEventListener('bearagnostic:languagechange', (event) => {
    syncNative(event?.detail?.language || document.documentElement.lang);
  });
  document.addEventListener('DOMContentLoaded', () => {
    ensureLanguageButtons();
    syncNative(document.documentElement.lang || localStorage.getItem(LANG_KEY) || navigator.language);
  }, { once: true });

  window.BearagnosticLaunchLocales = Object.freeze({
    locales: LOCALES,
    normalize,
    a11y,
    coverage: Object.freeze({ en: 111, th: 111, ja: 111, es: 111, 'pt-BR': 111 })
  });
})();
