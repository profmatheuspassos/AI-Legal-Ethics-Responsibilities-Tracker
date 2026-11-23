import {
  AlertTriangle,
  Download,
  Edit3,
  FileJson,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { MONITOR_STRINGS } from '../../i18n/monitorTranslations';
import { ISSUER_CATEGORY_LABELS, STATUS_LABELS } from '../../i18n/translations';
import type {
  AuditLogEntry,
  GeminiLegislativeCheckResult,
  Language,
  TrackerEntry,
} from '../../types/tracker';
import {
  type BackupParseResult,
  type BaselineDiffStats,
  downloadJsonBackup,
  parseAndValidateBackupJson,
} from '../../utils/trackerBackup';
import {
  countryCodeToFlag,
  isLegislationEntry,
  STATUS_STYLES,
} from '../../utils/trackerFilters';
import { AuditLogSection } from './AuditLogSection';
import { GeminiVerificationPanel } from './GeminiVerificationPanel';
import {
  createBlankEntry,
  type EditorDraft,
  NormativeEditorModal,
} from './NormativeEditorModal';

type WatchlistMode = 'pending' | 'all_bills' | 'all_records';

interface LegislativeMonitorProps {
  entries: TrackerEntry[];
  auditLog: AuditLogEntry[];
  baselineStats: BaselineDiffStats;
  language: Language;
  onUpsertEntry: (entry: TrackerEntry) => 'created' | 'updated';
  onImportBackup: (
    entries: TrackerEntry[],
    auditLog: AuditLogEntry[],
    addedCount: number,
    updatedCount: number
  ) => void;
  onResetBaseline: () => void;
  onNotify: (msg: string) => void;
}

export function LegislativeMonitor({
  entries,
  auditLog,
  baselineStats,
  language,
  onUpsertEntry,
  onImportBackup,
  onResetBaseline,
  onNotify,
}: LegislativeMonitorProps) {
  const t = MONITOR_STRINGS[language];
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [watchlistMode, setWatchlistMode] = useState<WatchlistMode>('pending');
  const [watchlistSearch, setWatchlistSearch] = useState('');
  const [editorDraft, setEditorDraft] = useState<EditorDraft | null>(null);
  const [focusedGeminiEntry, setFocusedGeminiEntry] = useState<TrackerEntry | null>(null);

  const [pendingImport, setPendingImport] = useState<Extract<
    BackupParseResult,
    { ok: true }
  > | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const isFileProtocol =
    typeof window !== 'undefined' && window.location.protocol === 'file:';

  // KPI metrics
  const kpiCounts = useMemo(() => {
    let pendingBills = 0;
    let bindingRules = 0;
    let allBills = 0;
    for (const e of entries) {
      if (e.resource.status === 'pending_bill') pendingBills += 1;
      if (e.resource.status === 'enacted_law' || e.resource.status === 'court_rule_order') {
        bindingRules += 1;
      }
      if (isLegislationEntry(e)) allBills += 1;
    }
    return { pendingBills, bindingRules, allBills };
  }, [entries]);

  const filteredWatchlist = useMemo(() => {
    const q = watchlistSearch.trim().toLowerCase();
    return entries.filter((entry) => {
      if (watchlistMode === 'pending' && entry.resource.status !== 'pending_bill') {
        return false;
      }
      if (watchlistMode === 'all_bills' && !isLegislationEntry(entry)) {
        return false;
      }
      if (q) {
        const hay = [
          entry.resource.title.en,
          entry.resource.title.pt,
          entry.jurisdiction.country.en,
          entry.jurisdiction.country.pt,
          entry.jurisdiction.subdivision?.en ?? '',
          entry.jurisdiction.subdivision?.pt ?? '',
          entry.issuer.name.en,
          entry.issuer.name.pt,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [entries, watchlistMode, watchlistSearch]);

  const handleExportJson = () => {
    downloadJsonBackup(entries, auditLog, language);
    onNotify(t.toolbar.exportSuccess);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const result = parseAndValidateBackupJson(text, entries);
      if (!result.ok) {
        setImportError(language === 'pt' ? result.errorPt : result.errorEn);
      } else {
        setPendingImport(result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (!pendingImport) return;
    onImportBackup(
      pendingImport.entries,
      pendingImport.auditLog,
      pendingImport.addedCount,
      pendingImport.updatedCount
    );
    onNotify(t.toolbar.importSuccess(pendingImport.addedCount, pendingImport.updatedCount));
    setPendingImport(null);
  };

  const handleConfirmReset = () => {
    onResetBaseline();
    setResetConfirmOpen(false);
    onNotify(t.toolbar.resetSuccess);
  };

  const handleSaveEntry = (saved: TrackerEntry) => {
    const action = onUpsertEntry(saved);
    setEditorDraft(null);
    onNotify(action === 'created' ? t.editor.saveCreatedToast : t.editor.saveUpdatedToast);
  };

  const handleLoadGeminiProposal = (
    targetEntry: TrackerEntry | null,
    proposal: GeminiLegislativeCheckResult
  ) => {
    const base: TrackerEntry = targetEntry
      ? {
          ...targetEntry,
          jurisdiction: {
            ...targetEntry.jurisdiction,
            country: { ...targetEntry.jurisdiction.country },
            subdivision: targetEntry.jurisdiction.subdivision
              ? { ...targetEntry.jurisdiction.subdivision }
              : null,
            region: { ...targetEntry.jurisdiction.region },
          },
          issuer: { ...targetEntry.issuer, name: { ...targetEntry.issuer.name } },
          resource: {
            ...targetEntry.resource,
            title: { ...targetEntry.resource.title },
            dateDisplay: {
              en: proposal.suggestedDateEn || targetEntry.resource.dateDisplay.en,
              pt: proposal.suggestedDatePt || targetEntry.resource.dateDisplay.pt,
            },
            year: proposal.suggestedYear ?? targetEntry.resource.year,
            status: proposal.suggestedStatus ?? targetEntry.resource.status,
          },
          risks: targetEntry.risks.map((r) => ({ ...r, label: { ...r.label } })),
          recommendations: {
            en: [
              ...targetEntry.recommendations.en,
              ...(proposal.suggestedNoteEn ? [proposal.suggestedNoteEn] : []),
            ],
            pt: [
              ...targetEntry.recommendations.pt,
              ...(proposal.suggestedNotePt ? [proposal.suggestedNotePt] : []),
            ],
          },
        }
      : {
          ...createBlankEntry(),
          resource: {
            ...createBlankEntry().resource,
            status: proposal.suggestedStatus ?? 'pending_bill',
            dateDisplay: {
              en: proposal.suggestedDateEn,
              pt: proposal.suggestedDatePt,
            },
            year: proposal.suggestedYear ?? new Date().getFullYear(),
          },
          recommendations: {
            en: proposal.suggestedNoteEn ? [proposal.suggestedNoteEn] : [''],
            pt: proposal.suggestedNotePt ? [proposal.suggestedNotePt] : [''],
          },
        };

    setEditorDraft({
      mode: targetEntry ? 'edit' : 'create',
      entry: base,
      fromGemini: true,
    });
  };

  const handleTriggerWatchlistGemini = (entry: TrackerEntry) => {
    setFocusedGeminiEntry(entry);
    const el = document.getElementById('gemini-verification-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Strip (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {t.kpi.totalActive}
          </div>
          <div className="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums">
            {baselineStats.totalActive}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {t.kpi.totalActiveSub(baselineStats.baselineCount, baselineStats.customAddedCount)}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            {t.kpi.pendingBills}
          </div>
          <div className="mt-1.5 text-2xl font-bold text-amber-700 tabular-nums">
            {kpiCounts.pendingBills}
          </div>
          <div className="mt-1 text-xs text-slate-500">{t.kpi.pendingBillsSub}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            {t.kpi.bindingRules}
          </div>
          <div className="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums">
            {kpiCounts.bindingRules}
          </div>
          <div className="mt-1 text-xs text-slate-500">{t.kpi.bindingRulesSub}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            {t.kpi.localMods}
          </div>
          <div className="mt-1.5 text-2xl font-bold text-emerald-700 tabular-nums">
            {baselineStats.totalLocalModifications}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {t.kpi.localModsSub(
              baselineStats.modifiedBaselineCount,
              baselineStats.customAddedCount
            )}
          </div>
        </div>
      </div>

      {/* Data Governance & JSON Portability Toolbar */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-2.5">
            <FileJson className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">{t.toolbar.title}</h2>
              <p className="text-xs text-slate-600 mt-0.5">{t.toolbar.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setEditorDraft({ mode: 'create', entry: createBlankEntry(), fromGemini: false })
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-700 text-white text-xs font-semibold hover:bg-indigo-800 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t.toolbar.addNew}</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.toolbar.exportJson}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t.toolbar.importJson}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 text-xs font-semibold hover:bg-rose-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.toolbar.resetBaseline}</span>
            </button>
          </div>
        </div>

        {importError && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs text-rose-800">
            <span className="font-medium">{importError}</span>
            <button
              type="button"
              onClick={() => setImportError(null)}
              className="text-rose-600 hover:text-rose-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* 2. Section A — Legislative Watchlist & Quick Status Updater */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.watchlist.title}</h2>
              <p className="text-xs text-slate-600 mt-0.5">{t.watchlist.subtitle}</p>
            </div>
            <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5 self-start">
              <button
                type="button"
                onClick={() => setWatchlistMode('pending')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  watchlistMode === 'pending'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.watchlist.modePending} ({kpiCounts.pendingBills})
              </button>
              <button
                type="button"
                onClick={() => setWatchlistMode('all_bills')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  watchlistMode === 'all_bills'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.watchlist.modeAllBills} ({kpiCounts.allBills})
              </button>
              <button
                type="button"
                onClick={() => setWatchlistMode('all_records')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  watchlistMode === 'all_records'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.watchlist.modeAllRecords} ({entries.length})
              </button>
            </div>
          </div>

          <div className="relative">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={watchlistSearch}
              onChange={(e) => setWatchlistSearch(e.target.value)}
              placeholder={t.watchlist.searchPlaceholder}
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-8 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            {watchlistSearch && (
              <button
                type="button"
                onClick={() => setWatchlistSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
          {filteredWatchlist.length === 0 ? (
            <div className="px-5 py-10 text-center text-xs text-slate-500">
              {watchlistSearch.trim() ? t.watchlist.emptySearch : t.watchlist.emptyPending}
            </div>
          ) : (
            filteredWatchlist.map((entry) => {
              const isAdded = baselineStats.addedIds.has(entry.id);
              const isModified = baselineStats.modifiedIds.has(entry.id);
              return (
                <div
                  key={entry.id}
                  className="px-5 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                        {entry.jurisdiction.countryCode}
                      </span>
                      <span className="font-semibold text-slate-700">
                        {countryCodeToFlag(entry.jurisdiction.countryCode)}{' '}
                        {entry.jurisdiction.country[language]}
                        {entry.jurisdiction.subdivision
                          ? ` · ${entry.jurisdiction.subdivision[language]}`
                          : ''}
                      </span>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          STATUS_STYLES[entry.resource.status]
                        }`}
                      >
                        {STATUS_LABELS[entry.resource.status][language]}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {entry.resource.dateDisplay[language]}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {entry.sourcePage > 0
                          ? t.watchlist.sourcePage(entry.sourcePage)
                          : t.watchlist.customPostTracker}
                      </span>
                      {isAdded && (
                        <span className="inline-flex px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                          {t.watchlist.customTag}
                        </span>
                      )}
                      {isModified && (
                        <span className="inline-flex px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-bold">
                          {t.watchlist.modifiedTag}
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-bold text-slate-900 leading-snug">
                      {entry.resource.title[language]}
                    </div>
                    <div className="text-xs text-slate-500">
                      {entry.issuer.name[language]} ·{' '}
                      {ISSUER_CATEGORY_LABELS[entry.issuer.category][language]}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setEditorDraft({ mode: 'edit', entry, fromGemini: false })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{t.watchlist.editButton}</span>
                    </button>

                    {!isFileProtocol && (
                      <button
                        type="button"
                        onClick={() => handleTriggerWatchlistGemini(entry)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-xs font-semibold text-indigo-800 hover:bg-indigo-100 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t.watchlist.checkOnlineButton}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 3. Section C — Optional Online Verification via Gemini API + Google Search Grounding */}
      <GeminiVerificationPanel
        entries={entries}
        language={language}
        focusedEntry={focusedGeminiEntry}
        onLoadProposalIntoEditor={handleLoadGeminiProposal}
      />

      {/* 4. Section D — Local Audit Log */}
      <AuditLogSection auditLog={auditLog} language={language} />

      {/* Section B — Bilingual Normative Editor Modal */}
      {editorDraft && (
        <NormativeEditorModal
          draft={editorDraft}
          language={language}
          onSave={handleSaveEntry}
          onClose={() => setEditorDraft(null)}
        />
      )}

      {/* Import Preview Confirmation Modal */}
      {pendingImport && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">{t.modals.importTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.modals.importSummary(
                pendingImport.totalImported,
                pendingImport.addedCount,
                pendingImport.updatedCount,
                pendingImport.unchangedCount
              )}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingImport(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                {t.modals.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-3.5 py-2 rounded-lg bg-indigo-700 text-white text-xs font-semibold hover:bg-indigo-800"
              >
                {t.modals.importConfirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Baseline Confirmation Modal */}
      {resetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.modals.resetTitle}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {t.modals.resetBody}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                {t.modals.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-3.5 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                {t.modals.resetConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
