(() => {
  'use strict';

  const SCRIPT_STATE = '__bearagnosticShareCard62';
  if (window[SCRIPT_STATE]) return;
  window[SCRIPT_STATE] = true;

  const ACCENT = '#17aee8';
  const ACCENT_DEEP = '#0d7fd9';
  const TEXT = '#14334b';
  const SUBTLE = '#5e7b8e';
  const PANEL = '#ffffff';
  const BORDER = 'rgba(17, 58, 94, 0.08)';
  const SOFT_BG = '#f3f7fb';
  const STATUS = {
    success: { label: 'Healthy', color: '#1c9b5f', mascot: './assets/native/mascot/drbear-success.png' },
    inspect: { label: 'In Review', color: '#2084d8', mascot: './assets/native/mascot/drbear-inspect.png' },
    review: { label: 'Needs Review', color: '#ff9a2f', mascot: './assets/native/mascot/drbear-review.png' },
    caution: { label: 'Attention Needed', color: '#ee6a4d', mascot: './assets/native/mascot/drbear-caution.png' },
  };

  const METRIC_RULES = [
    { key: 'filesScanned', label: 'Files scanned', patterns: [/files? scanned/i, /scanned files?/i, /items? scanned/i, /scan total/i] },
    { key: 'issuesFound', label: 'Issues found', patterns: [/issues? found/i, /problems? found/i, /items? found/i, /results? found/i] },
    { key: 'duplicates', label: 'Duplicates', patterns: [/duplicates?/i, /duplicate files?/i] },
    { key: 'largeFiles', label: 'Large files', patterns: [/large files?/i] },
    { key: 'olderFiles', label: 'Older files', patterns: [/older files?/i, /old files?/i] },
    { key: 'emptyFolders', label: 'Empty folders', patterns: [/empty folders?/i] },
    { key: 'zeroByte', label: 'Zero-byte files', patterns: [/zero[- ]byte/i] },
    { key: 'installers', label: 'Installers', patterns: [/installers?/i, /apks?/i] },
    { key: 'archives', label: 'Archives', patterns: [/archives?/i, /zip files?/i] },
    { key: 'downloads', label: 'Downloads', patterns: [/downloads?/i] },
    { key: 'recoverableSpace', label: 'Recoverable space', patterns: [/recoverable space/i, /space to recover/i, /space can be recovered/i, /can be recovered/i, /you can recover/i, /junk size/i] },
    { key: 'spaceRecovered', label: 'Space recovered', patterns: [/space recovered/i, /recovered space/i, /freed up/i] },
  ];

  function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

  function isVisible(element) {
    if (!(element instanceof Element)) return false;
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function normalizeSpaces(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function formatTitleCase(text) {
    return normalizeSpaces(text)
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function findAllVisibleTextElements() {
    return Array.from(document.querySelectorAll('h1,h2,h3,h4,p,span,div,li,strong,dt,dd,button'))
      .filter(isVisible)
      .map((element) => ({ element, text: normalizeSpaces(element.textContent) }))
      .filter((entry) => entry.text && entry.text.length >= 2);
  }

  function pickHeading(entries) {
    const candidates = entries.filter(({ element, text }) => {
      const tag = element.tagName.toLowerCase();
      return (tag.startsWith('h') || /title|heading|result|summary|score|status/i.test(element.className))
        && text.length >= 4 && text.length <= 80
        && !/^share$/i.test(text)
        && !/^back$/i.test(text);
    });
    return (candidates[0]?.text) || 'Result Summary';
  }

  function findNearbyValue(labelElement) {
    const siblings = [];
    if (labelElement.parentElement) {
      siblings.push(...Array.from(labelElement.parentElement.children));
    }
    for (const sibling of siblings) {
      const text = normalizeSpaces(sibling.textContent);
      if (!text || text === normalizeSpaces(labelElement.textContent)) continue;
      const numeric = extractMetricValue(text);
      if (numeric) return numeric;
    }
    return null;
  }

  function extractMetricValue(text) {
    const normalized = normalizeSpaces(text);
    const sizeMatch = normalized.match(/\b\d+(?:[.,]\d+)?\s?(?:TB|GB|MB|KB)\b/i);
    if (sizeMatch) return sizeMatch[0];
    const numberMatch = normalized.match(/\b\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?\b/);
    if (numberMatch) return numberMatch[0];
    return '';
  }

  function collectMetrics(entries) {
    const metrics = new Map();
    const usedLabels = new Set();

    for (const rule of METRIC_RULES) {
      for (const entry of entries) {
        const text = entry.text;
        if (!rule.patterns.some((pattern) => pattern.test(text))) continue;
        let value = '';
        const direct = extractMetricValue(text);
        const cleanedLower = text.toLowerCase();
        if (direct && !rule.patterns.some((pattern) => pattern.test(direct))) {
          value = direct;
        }
        if (!value) value = findNearbyValue(entry.element) || '';
        if (!value) continue;
        metrics.set(rule.key, { label: rule.label, value });
        usedLabels.add(rule.label);
        break;
      }
    }

    if (!metrics.size) {
      const cards = Array.from(document.querySelectorAll('[class*="card"], [class*="metric"], [class*="stat"], [class*="summary"], [class*="tile"]'))
        .filter(isVisible);
      for (const card of cards) {
        const text = normalizeSpaces(card.textContent);
        if (!text) continue;
        const lines = text.split(/\s{2,}|\n/).map(normalizeSpaces).filter(Boolean);
        if (lines.length < 2) continue;
        const maybeLabel = formatTitleCase(lines[0].slice(0, 28));
        const maybeValue = extractMetricValue(lines.slice(1).join(' '));
        if (!maybeValue || usedLabels.has(maybeLabel)) continue;
        metrics.set(maybeLabel.toLowerCase().replace(/\s+/g, ''), { label: maybeLabel, value: maybeValue });
        usedLabels.add(maybeLabel);
        if (metrics.size >= 6) break;
      }
    }

    return Array.from(metrics.values());
  }

  function numericValue(raw) {
    if (!raw) return 0;
    const cleaned = String(raw).replace(/,/g, '').match(/\d+(?:\.\d+)?/);
    return cleaned ? Number(cleaned[0]) : 0;
  }

  function visiblePageText() {
    const root = document.querySelector('main') || document.body;
    return normalizeSpaces(root?.innerText || root?.textContent || '');
  }

  function collectCleanupImpactMetrics(pageText) {
    if (!/cleanup impact|verified cleanup|cleanup complete|space reclaimed|files? removed/i.test(pageText)) return [];

    const results = [];
    const seen = new Set();
    const add = (label, value) => {
      const cleanValue = normalizeSpaces(value);
      if (!cleanValue || seen.has(label)) return;
      seen.add(label);
      results.push({ label, value: cleanValue });
    };

    const reclaimed = pageText.match(/(?:cleanup impact|space reclaimed|verified space reclaimed)[^0-9]{0,90}(\d+(?:[.,]\d+)?\s?(?:TB|GB|MB|KB))/i)
      || pageText.match(/\b(\d+(?:[.,]\d+)?\s?(?:TB|GB|MB|KB))\b/i);
    if (reclaimed) add('Space reclaimed', reclaimed[1]);

    const removed = pageText.match(/\b(\d+)\s+files?\s+removed\b/i)
      || pageText.match(/files?\s+removed[^0-9]{0,24}(\d+)/i);
    if (removed) add('Files removed', removed[1]);

    const freeStorage = pageText.match(/(\d+(?:[.,]\d+)?%\s*(?:→|->|to)\s*\d+(?:[.,]\d+)?%)\s*free storage/i)
      || pageText.match(/free storage[^0-9]{0,28}(\d+(?:[.,]\d+)?%\s*(?:→|->|to)\s*\d+(?:[.,]\d+)?%)/i);
    if (freeStorage) add('Free storage', freeStorage[1]);

    const duplicateResolved = pageText.match(/\b(\d+)\s+duplicate copies resolved\b/i)
      || pageText.match(/duplicate copies resolved[^0-9]{0,24}(\d+)/i);
    if (duplicateResolved) add('Duplicate copies resolved', duplicateResolved[1]);

    const reviewMode = pageText.match(/\b(Manual review|Automatic cleanup|Auto cleanup)\b[^.]{0,80}low-risk cleanup resolved/i)
      || pageText.match(/low-risk cleanup resolved[^.]{0,80}\b(Manual review|Automatic cleanup|Auto cleanup)\b/i);
    if (reviewMode) add('Cleanup resolution', reviewMode[1]);

    return results.slice(0, 5);
  }

  function chooseTone(heading, metrics) {
    const text = `${heading} ${metrics.map((item) => `${item.label} ${item.value}`).join(' ')}`.toLowerCase();
    const issues = metrics.find((item) => /issues? found/i.test(item.label));
    const issuesValue = numericValue(issues?.value);
    if (/excellent|all clear|clean|healthy|success|recovered/i.test(text) && issuesValue === 0) return 'success';
    if (/attention|warning|caution|risk/i.test(text) || issuesValue >= 25) return 'caution';
    if (/review|duplicates|large files|older files|empty folders|zero-byte/i.test(text) || issuesValue > 0) return 'review';
    return 'inspect';
  }

  function buildInsights(metrics, tone) {
    const insights = [];
    const files = metrics.find((item) => /Files scanned/i.test(item.label));
    const recoverable = metrics.find((item) => /Recoverable space|Space recovered/i.test(item.label));
    const issues = metrics.find((item) => /Issues found/i.test(item.label));
    if (files) insights.push(`${files.value} files were included in this checkup.`);
    if (issues) {
      const count = numericValue(issues.value);
      if (count === 0) insights.push('No major file-health issues were detected in the visible summary.');
      else insights.push(`${issues.value} issues were highlighted in the current result summary.`);
    }
    if (recoverable) insights.push(`${recoverable.value} is the headline space impact shown on screen.`);
    if (!insights.length) {
      insights.push('This card was generated directly from the visible Bearagnostic result summary.');
      insights.push(tone === 'success' ? 'The device looks healthy overall.' : 'Bearagnostic recommends a closer review of the highlighted items.');
    }
    return insights.slice(0, 3);
  }

  function gatherResultModel() {
    const entries = findAllVisibleTextElements();
    const pageText = visiblePageText();
    const heading = pickHeading(entries);
    const cleanupMetrics = collectCleanupImpactMetrics(pageText);
    const genericMetrics = collectMetrics(entries);
    const merged = [...cleanupMetrics];
    const used = new Set(merged.map((item) => item.label.toLowerCase()));
    genericMetrics.forEach((item) => {
      if (merged.length >= 6) return;
      const key = item.label.toLowerCase();
      if (!used.has(key)) {
        used.add(key);
        merged.push(item);
      }
    });
    const tone = /cleanup impact|verified cleanup|cleanup complete|verified space reclaimed/i.test(pageText)
      ? 'success'
      : chooseTone(heading, merged);
    const status = STATUS[tone];
    return {
      heading,
      tone,
      status,
      metrics: merged.slice(0, 6),
      insights: buildInsights(merged, tone),
      generatedAt: new Date(),
    };
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  function roundRectPath(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  async function renderCard(model) {
    const canvas = document.createElement('canvas');
    canvas.width = 1440;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#fbfdff');
    gradient.addColorStop(1, SOFT_BG);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(23, 174, 232, 0.08)';
    ctx.beginPath();
    ctx.arc(1180, 240, 210, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(13, 127, 217, 0.06)';
    ctx.beginPath();
    ctx.arc(230, 1760, 260, 0, Math.PI * 2);
    ctx.fill();

    roundRectPath(ctx, 72, 72, 1296, 1776, 42);
    ctx.fillStyle = PANEL;
    ctx.shadowColor = 'rgba(17, 46, 74, 0.10)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 18;
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = BORDER;
    ctx.lineWidth = 2;
    roundRectPath(ctx, 72, 72, 1296, 1776, 42);
    ctx.stroke();

    ctx.fillStyle = TEXT;
    ctx.font = '700 58px sans-serif';
    ctx.fillText('Bear', 132, 180);
    const bearWidth = ctx.measureText('Bear').width;
    ctx.fillStyle = ACCENT_DEEP;
    ctx.fillText('agnostic', 132 + bearWidth + 6, 180);

    ctx.fillStyle = SUBTLE;
    ctx.font = '500 28px sans-serif';
    ctx.fillText('Premium Result Card', 136, 224);

    roundRectPath(ctx, 1038, 132, 222, 74, 37);
    ctx.fillStyle = model.status.color + '15';
    ctx.fill();
    ctx.fillStyle = model.status.color;
    ctx.font = '700 28px sans-serif';
    const pillText = model.status.label;
    const pillWidth = ctx.measureText(pillText).width;
    ctx.fillText(pillText, 1149 - pillWidth / 2, 179);

    ctx.fillStyle = TEXT;
    ctx.font = '700 72px sans-serif';
    wrapText(ctx, model.heading, 132, 330, 900, 86);

    ctx.fillStyle = SUBTLE;
    ctx.font = '500 28px sans-serif';
    const dateText = model.generatedAt.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    ctx.fillText(dateText, 132, 476);

    roundRectPath(ctx, 132, 530, 736, 248, 34);
    ctx.fillStyle = '#f8fbfe';
    ctx.fill();
    ctx.strokeStyle = 'rgba(23, 174, 232, 0.14)';
    ctx.lineWidth = 2;
    roundRectPath(ctx, 132, 530, 736, 248, 34);
    ctx.stroke();

    const heroMetric = model.metrics[0] || { label: 'Summary', value: model.status.label };
    ctx.fillStyle = ACCENT_DEEP;
    ctx.font = '700 92px sans-serif';
    ctx.fillText(String(heroMetric.value), 178, 650);
    ctx.fillStyle = TEXT;
    ctx.font = '700 34px sans-serif';
    ctx.fillText(heroMetric.label, 182, 708);
    ctx.fillStyle = SUBTLE;
    ctx.font = '500 26px sans-serif';
    ctx.fillText('Generated from the current visible result screen', 182, 752);

    const mascot = await loadImage(model.status.mascot).catch(() => null);
    if (mascot) {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.drawImage(mascot, 902, 390, 380, 540);
      ctx.restore();
    }

    ctx.fillStyle = TEXT;
    ctx.font = '700 36px sans-serif';
    ctx.fillText('Key findings', 132, 892);

    const metricItems = model.metrics.slice(0, 4);
    metricItems.forEach((metric, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 132 + col * 378;
      const y = 934 + row * 198;
      roundRectPath(ctx, x, y, 338, 158, 28);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = BORDER;
      ctx.lineWidth = 2;
      roundRectPath(ctx, x, y, 338, 158, 28);
      ctx.stroke();

      ctx.fillStyle = ACCENT_DEEP;
      ctx.font = '700 54px sans-serif';
      ctx.fillText(String(metric.value), x + 36, y + 76);
      ctx.fillStyle = SUBTLE;
      ctx.font = '600 24px sans-serif';
      wrapText(ctx, metric.label, x + 36, y + 114, 270, 30);
    });

    ctx.fillStyle = TEXT;
    ctx.font = '700 36px sans-serif';
    ctx.fillText('What this means', 132, 1374);

    let bulletY = 1424;
    model.insights.forEach((insight) => {
      ctx.fillStyle = ACCENT;
      ctx.beginPath();
      ctx.arc(150, bulletY - 10, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = TEXT;
      ctx.font = '500 28px sans-serif';
      bulletY = wrapText(ctx, insight, 172, bulletY, 1080, 40) + 24;
    });

    ctx.fillStyle = 'rgba(20, 51, 75, 0.06)';
    ctx.fillRect(132, 1690, 1100, 2);

    ctx.fillStyle = TEXT;
    ctx.font = '600 30px sans-serif';
    ctx.fillText('DEVICE HEALTH • BETTER DAYS', 132, 1754);
    ctx.fillStyle = SUBTLE;
    ctx.font = '500 24px sans-serif';
    ctx.fillText('Shared from Bearagnostic on Android', 132, 1800);

    return canvas.toDataURL('image/png');
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = normalizeSpaces(text).split(' ');
    let line = '';
    let currentY = y;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, currentY);
        line = word;
        currentY += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, currentY);
    return currentY;
  }

  function buildPlainText(model) {
    const lines = [
      `Bearagnostic — ${model.heading}`,
      `Status: ${model.status.label}`,
      ...model.metrics.map((item) => `${item.label}: ${item.value}`),
      '',
      'Shared from Bearagnostic on Android',
    ];
    return lines.join('\n');
  }

  async function shareCurrentResultCard() {
    const model = gatherResultModel();
    try {
      const dataUrl = await renderCard(model);
      if (window.BearagnosticShareBridge && typeof window.BearagnosticShareBridge.shareImage === 'function') {
        window.BearagnosticShareBridge.shareImage(`Bearagnostic ${model.status.label} Result`, dataUrl);
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: `Bearagnostic ${model.status.label} Result`, text: buildPlainText(model) });
        return;
      }
      const anchor = document.createElement('a');
      anchor.href = dataUrl;
      anchor.download = `bearagnostic-result-${Date.now()}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (error) {
      console.warn('Bearagnostic share card failed', error);
      if (navigator.share) {
        const fallback = buildPlainText(gatherResultModel());
        navigator.share({ title: 'Bearagnostic Result', text: fallback }).catch(() => {});
      }
    }
  }

  function isShareButton(element) {
    if (!(element instanceof Element)) return false;
    const text = normalizeSpaces(element.textContent).toLowerCase();
    const aria = normalizeSpaces(element.getAttribute('aria-label')).toLowerCase();
    const cls = String(element.className || '').toLowerCase();
    const action = `${element.getAttribute('data-action') || ''} ${element.getAttribute('data-share') || ''}`.toLowerCase();

    const explicitResultShare = /^(share result|share results|share summary|share cleanup result)$/i.test(text)
      || /share result|share summary|share cleanup/i.test(aria)
      || /share[-_ ]?result|result[-_ ]?share/.test(`${cls} ${action}`);
    if (explicitResultShare) return true;

    const looksLikeShare = /\bshare\b/.test(text) || /\bshare\b/.test(aria) || /share/.test(`${cls} ${action}`);
    if (!looksLikeShare) return false;

    const pageText = visiblePageText().toLowerCase();
    return /cleanup impact|cleanup complete|verified cleanup|result summary|checkup complete|file health result|scan result/.test(pageText);
  }

  let shareBusy = false;

  async function interceptResultShare(event) {
    const origin = event.target instanceof Element ? event.target : null;
    const control = origin?.closest?.('button, [role="button"], a');
    if (!control || !isShareButton(control)) return;

    // Capture before the legacy text-share handler reaches the control.
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (shareBusy) return;
    shareBusy = true;
    if (control instanceof HTMLButtonElement) control.disabled = true;
    try {
      await shareCurrentResultCard();
    } finally {
      window.setTimeout(() => {
        shareBusy = false;
        if (control instanceof HTMLButtonElement) control.disabled = false;
      }, 650);
    }
  }

  // Delegation is intentional: Result panels are commonly created hidden and revealed later
  // without inserting a new Share button. Binding only currently-visible buttons misses that case.
  window.addEventListener('click', interceptResultShare, true);
})();
