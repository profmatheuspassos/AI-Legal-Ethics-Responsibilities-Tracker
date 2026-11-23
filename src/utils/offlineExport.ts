import type { Language, TrackerEntry } from '../types/tracker';
import { OFFLINE_EXPORT_SCRIPT } from './offlineHtml/offlineScript';
import { OFFLINE_EXPORT_CSS } from './offlineHtml/offlineStyles';

/**
 * Safely serializes arbitrary JSON data for embedding inside a classic HTML <script> tag.
 * Escapes <, >, &, and JS line separators (U+2028, U+2029) so no record text can ever
 * terminate the script tag early or cause a parse error under file://.
 */
export function escapeJsonForClassicScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * Builds a 100% self-contained, zero-dependency, classic-script HTML document
 * directly from the current in-memory dataset and active language.
 * Guaranteed to execute locally via file:// in Chrome, Edge, and Safari.
 */
export function buildOfflineHtmlDocument(
  entries: TrackerEntry[],
  language: Language
): string {
  const safeEntriesJson = escapeJsonForClassicScript(entries);
  const safeLangJson = escapeJsonForClassicScript(language);

  return [
    '<!doctype html>',
    `<html lang="${language}">`,
    '<head>',
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  <title>AI Legal Ethics &amp; Responsibilities Tracker</title>',
    '  <meta name="description" content="IAPP October 2026 AI Legal Ethics and Responsibilities Tracker — Standalone Offline Edition" />',
    `  <style>${OFFLINE_EXPORT_CSS}</style>`,
    '</head>',
    '<body>',
    '  <div id="app-root">',
    '    <noscript><div class="error-panel">JavaScript is required to view this standalone tracker.</div></noscript>',
    '  </div>',
    '  <script>',
    `    window.__TRACKER_OFFLINE_ENTRIES__ = ${safeEntriesJson};`,
    `    window.__TRACKER_OFFLINE_LANG__ = ${safeLangJson};`,
    '  </script>',
    '  <script>',
    OFFLINE_EXPORT_SCRIPT,
    '  </script>',
    '</body>',
    '</html>',
  ].join('\n');
}

/**
 * Pre-download self-assertion check to guarantee strict file:// compatibility
 * and prevent blank-screen regressions.
 */
export function assertSafeOfflineHtml(html: string): void {
  if (/type\s*=\s*["']module["']/i.test(html)) {
    throw new Error('Offline HTML assertion failed: contains forbidden module script tag.');
  }
  if (/src\s*=\s*["']\//i.test(html)) {
    throw new Error('Offline HTML assertion failed: contains root-relative src="/ path.');
  }
  if (/<script\b[^>]*\bsrc\s*=/i.test(html)) {
    throw new Error('Offline HTML assertion failed: contains external script src.');
  }
  if (/<link\b[^>]*rel\s*=\s*["']stylesheet["']/i.test(html)) {
    throw new Error('Offline HTML assertion failed: contains external stylesheet link.');
  }
  if (!html.includes('</html>')) {
    throw new Error('Offline HTML assertion failed: missing closing </html> tag.');
  }
  const openScriptMatches = html.match(/<script\b[^>]*>/gi) ?? [];
  const closeScriptMatches = html.match(/<\/script>/gi) ?? [];
  if (openScriptMatches.length !== 2 || closeScriptMatches.length !== 2) {
    throw new Error(
      `Offline HTML assertion failed: expected 2 balanced <script> tags, found ${openScriptMatches.length} open / ${closeScriptMatches.length} close.`
    );
  }
}

function triggerHtmlDownload(htmlContent: string, filename: string): void {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates, validates, and downloads `ai-legal-ethics-tracker.html`.
 */
export function exportOfflineHtml(
  entries: TrackerEntry[],
  language: Language
): boolean {
  try {
    const html = buildOfflineHtmlDocument(entries, language);
    assertSafeOfflineHtml(html);
    triggerHtmlDownload(html, 'ai-legal-ethics-tracker.html');
    return true;
  } catch (err) {
    console.error('[exportOfflineHtml]', err);
    return false;
  }
}

export async function exportOfflineHtmlSnapshot(
  entries: TrackerEntry[],
  language: Language
): Promise<boolean> {
  return exportOfflineHtml(entries, language);
}
