import {
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Globe,
  Loader2,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { MONITOR_STRINGS } from '../../i18n/monitorTranslations';
import { STATUS_LABELS } from '../../i18n/translations';
import type {
  GeminiLegislativeCheckResult,
  Language,
  TrackerEntry,
} from '../../types/tracker';
import { STATUS_STYLES } from '../../utils/trackerFilters';

interface GeminiVerificationPanelProps {
  entries: TrackerEntry[];
  language: Language;
  focusedEntry: TrackerEntry | null;
  onLoadProposalIntoEditor: (
    targetEntry: TrackerEntry | null,
    proposal: GeminiLegislativeCheckResult
  ) => void;
}

export function GeminiVerificationPanel({
  entries,
  language,
  focusedEntry,
  onLoadProposalIntoEditor,
}: GeminiVerificationPanelProps) {
  const t = MONITOR_STRINGS[language].gemini;

  const isFileProtocol =
    typeof window !== 'undefined' && window.location.protocol === 'file:';

  const [apiAvailable, setApiAvailable] = useState<boolean | null>(
    isFileProtocol ? false : null
  );
  const [selectedId, setSelectedId] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<GeminiLegislativeCheckResult | null>(null);

  const pendingEntries = entries.filter((e) => e.resource.status === 'pending_bill');
  const otherEntries = entries.filter((e) => e.resource.status !== 'pending_bill');

  // Check server-side Gemini availability once on mount (never runs under file://)
  useEffect(() => {
    if (isFileProtocol) {
      setApiAvailable(false);
      return;
    }
    let cancelled = false;
    fetch('/api/legislative-check/status')
      .then((res) => (res.ok ? res.json() : { available: false }))
      .then((data: { available?: boolean }) => {
        if (!cancelled) setApiAvailable(Boolean(data?.available));
      })
      .catch(() => {
        if (!cancelled) setApiAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isFileProtocol]);

  // Sync when user clicks "Check Online (Gemini Grounding)" on a specific Watchlist row
  useEffect(() => {
    if (!focusedEntry) return;
    setSelectedId(focusedEntry.id);
    const sub = focusedEntry.jurisdiction.subdivision?.en
      ? `${focusedEntry.jurisdiction.subdivision.en} `
      : '';
    setQuery(
      `${sub}${focusedEntry.jurisdiction.country.en} ${focusedEntry.resource.title.en} legislative status update`.trim()
    );
    setResult(null);
    setErrorMsg(null);
  }, [focusedEntry]);

  const selectedEntry = entries.find((e) => e.id === selectedId) ?? null;

  const handleSelectChange = (val: string) => {
    setSelectedId(val);
    setResult(null);
    setErrorMsg(null);
    const found = entries.find((e) => e.id === val);
    if (found) {
      const sub = found.jurisdiction.subdivision?.en
        ? `${found.jurisdiction.subdivision.en} `
        : '';
      setQuery(
        `${sub}${found.jurisdiction.country.en} ${found.resource.title.en} legislative status update`.trim()
      );
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 3 || isLoading) return;
    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch('/api/legislative-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: trimmed,
          currentTitle: selectedEntry?.resource.title.en ?? '',
          currentStatus: selectedEntry?.resource.status ?? '',
          jurisdiction: selectedEntry
            ? `${selectedEntry.jurisdiction.country.en}${
                selectedEntry.jurisdiction.subdivision
                  ? ` - ${selectedEntry.jurisdiction.subdivision.en}`
                  : ''
              }`
            : '',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      setResult(data as GeminiLegislativeCheckResult);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const isOfflineOrUnavailable =
    isFileProtocol || apiAvailable === false || (typeof navigator !== 'undefined' && !navigator.onLine);

  return (
    <section
      id="gemini-verification-section"
      className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            <h2 className="text-base font-bold text-slate-900">{t.title}</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-semibold">
              <ShieldCheck className="w-3 h-3" />
              {t.badge}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">{t.subtitle}</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {isOfflineOrUnavailable ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3.5 flex items-start gap-3">
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-0.5">
              <div className="font-bold">{t.offlineNoticeTitle}</div>
              <p className="leading-relaxed">{t.offlineNoticeBody}</p>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleVerify} className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.selectBillLabel}
                  </label>
                  <select
                    value={selectedId}
                    onChange={(e) => handleSelectChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">{t.customQueryOption}</option>
                    {pendingEntries.length > 0 && (
                      <optgroup label={language === 'pt' ? 'Projetos Pendentes (pending_bill)' : 'Pending Bills (pending_bill)'}>
                        {pendingEntries.map((entry) => (
                          <option key={entry.id} value={entry.id}>
                            [{entry.jurisdiction.countryCode}
                            {entry.jurisdiction.subdivision
                              ? ` · ${entry.jurisdiction.subdivision[language]}`
                              : ''}
                            ] {entry.resource.title[language]}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label={language === 'pt' ? 'Demais Registros' : 'Other Records'}>
                      {otherEntries.map((entry) => (
                        <option key={entry.id} value={entry.id}>
                          [{entry.jurisdiction.countryCode}
                          {entry.jurisdiction.subdivision
                            ? ` · ${entry.jurisdiction.subdivision[language]}`
                            : ''}
                          ] {entry.resource.title[language]}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.queryLabel}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t.queryPlaceholder}
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || query.trim().length < 3 || apiAvailable === null}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Globe className="w-4 h-4" />
                      )}
                      <span>{isLoading ? t.runningButton : t.runButton}</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {errorMsg && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{t.errorPrefix}</strong> {errorMsg}
                </span>
              </div>
            )}

            {result && (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1.5">
                    {t.summaryHeading}
                  </h3>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {language === 'pt' ? result.summaryPt : result.summaryEn}
                  </p>
                </div>

                {/* Proposed Diff */}
                <div className="rounded-lg bg-white border border-slate-200 p-3.5 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t.proposedDiffHeading}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 font-semibold mb-1">
                        {t.currentStatusLabel}
                      </div>
                      {selectedEntry ? (
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-md font-semibold ${
                            STATUS_STYLES[selectedEntry.resource.status]
                          }`}
                        >
                          {STATUS_LABELS[selectedEntry.resource.status][language]}
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium">
                          {language === 'pt' ? 'Novo registro' : 'New record'}
                        </span>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-200">
                      <div className="text-indigo-700 font-semibold mb-1">
                        {t.suggestedStatusLabel}
                      </div>
                      {result.suggestedStatus ? (
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-md font-semibold ${
                            STATUS_STYLES[result.suggestedStatus]
                          }`}
                        >
                          {STATUS_LABELS[result.suggestedStatus][language]}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 font-semibold mb-1">
                        {t.suggestedDateLabel}
                      </div>
                      <div className="font-semibold text-slate-800">
                        {(language === 'pt' ? result.suggestedDatePt : result.suggestedDateEn) ||
                          '—'}
                      </div>
                    </div>
                  </div>

                  {(result.suggestedNotePt || result.suggestedNoteEn) && (
                    <div className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                      <span className="font-semibold text-slate-600 block mb-1">
                        {t.suggestedNoteLabel}:
                      </span>
                      <p className="text-slate-800">
                        {language === 'pt' ? result.suggestedNotePt : result.suggestedNoteEn}
                      </p>
                    </div>
                  )}
                </div>

                {/* Verifiable Sources */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    {t.sourcesHeading} ({result.sources.length})
                  </h4>
                  {result.sources.length === 0 ? (
                    <p className="text-xs text-slate-500">{t.noSources}</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {result.sources.map((src) => (
                        <li key={src.uri}>
                          <a
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-900 hover:underline break-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            <span>{src.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Human-in-the-Loop Gate */}
                <div className="pt-3 border-t border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.humanGateNote}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => onLoadProposalIntoEditor(selectedEntry, result)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-700 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-800 transition-colors shrink-0"
                  >
                    <span>{t.reviewLoadButton}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
