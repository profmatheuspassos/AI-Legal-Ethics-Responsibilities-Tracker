/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle2 } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { ComparatorModal } from './components/ComparatorModal';
import { CompareDock } from './components/CompareDock';
import { ExplorerView } from './components/ExplorerView';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { LegislativeMonitor } from './components/monitor/LegislativeMonitor';
import { useTrackerStore } from './hooks/useTrackerStore';
import { UI_STRINGS } from './i18n/translations';
import type { ExplorerFilterState } from './types/tracker';
import { exportOfflineHtmlSnapshot } from './utils/offlineExport';
import { DEFAULT_FILTERS } from './utils/trackerFilters';

export default function App() {
  const {
    entries,
    upsertEntry,
    importBackup,
    resetEntries,
    auditLog,
    baselineStats,
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    selectedCompareIds,
    toggleCompare,
    removeCompare,
    clearCompare,
  } = useTrackerStore();

  const [explorerFilters, setExplorerFilters] =
    useState<ExplorerFilterState>(DEFAULT_FILTERS);
  const [comparatorOpen, setComparatorOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const handleExplorerFilterChange = useCallback(
    (patch: Partial<ExplorerFilterState>) => {
      setExplorerFilters((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const handleExplorerResetFilters = useCallback(() => {
    setExplorerFilters(DEFAULT_FILTERS);
  }, []);

  const handleInspectInExplorer = useCallback(
    (patch: Partial<ExplorerFilterState>) => {
      setExplorerFilters({ ...DEFAULT_FILTERS, ...patch });
      setActiveTab('explorer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setActiveTab]
  );

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3200);
  }, []);

  const selectedCompareEntries = useMemo(() => {
    const byId = new Map(entries.map((entry) => [entry.id, entry]));
    return selectedCompareIds
      .map((id) => byId.get(id))
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  }, [entries, selectedCompareIds]);

  const handleRemoveCompare = useCallback(
    (id: string) => {
      removeCompare(id);
      if (selectedCompareIds.length <= 2) {
        setComparatorOpen(false);
      }
    },
    [removeCompare, selectedCompareIds.length]
  );

  const handleClearCompare = useCallback(() => {
    clearCompare();
    setComparatorOpen(false);
  }, [clearCompare]);

  const handleExportOfflineHtml = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const t = UI_STRINGS[language];
      const ok = await exportOfflineHtmlSnapshot(entries, language, auditLog);
      showToast(ok ? t.exportSuccessToast : t.exportErrorToast);
    } finally {
      setIsExporting(false);
    }
  }, [auditLog, entries, isExporting, language, showToast]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        language={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExportOfflineHtml={handleExportOfflineHtml}
        isExporting={isExporting}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'explorer' && (
          <ExplorerView
            entries={entries}
            language={language}
            filters={explorerFilters}
            onFilterChange={handleExplorerFilterChange}
            onResetFilters={handleExplorerResetFilters}
            selectedCompareIds={selectedCompareIds}
            onToggleCompare={toggleCompare}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            entries={entries}
            language={language}
            onInspectInExplorer={handleInspectInExplorer}
          />
        )}

        {activeTab === 'monitor' && (
          <LegislativeMonitor
            entries={entries}
            auditLog={auditLog}
            baselineStats={baselineStats}
            language={language}
            onUpsertEntry={upsertEntry}
            onImportBackup={importBackup}
            onResetBaseline={resetEntries}
            onNotify={showToast}
          />
        )}
      </main>

      <Footer
        loadedCount={entries.length}
        customAddedCount={baselineStats.customAddedCount}
        modifiedBaselineCount={baselineStats.modifiedBaselineCount}
        language={language}
        hasBottomDock={selectedCompareEntries.length > 0}
      />

      <CompareDock
        selectedEntries={selectedCompareEntries}
        language={language}
        onRemove={handleRemoveCompare}
        onClear={handleClearCompare}
        onOpenComparator={() => {
          if (selectedCompareEntries.length >= 2) {
            setComparatorOpen(true);
          }
        }}
      />

      {comparatorOpen && selectedCompareEntries.length >= 2 && (
        <ComparatorModal
          entries={selectedCompareEntries}
          language={language}
          onRemoveEntry={handleRemoveCompare}
          onClose={() => setComparatorOpen(false)}
          onNotify={showToast}
        />
      )}

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 sm:right-6 z-50 bg-slate-900 text-white border border-slate-700 rounded-lg shadow-lg px-4 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-medium max-w-md"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
