import { ChevronsDownUp, ChevronsUpDown, FileX2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { UI_STRINGS } from '../i18n/translations';
import type {
  ExplorerFilterState,
  Language,
  RiskCode,
  TrackerEntry,
} from '../types/tracker';
import {
  computeKpiMetrics,
  countActiveFilters,
  filterAndSortEntries,
  getCountryOptions,
  getScopeCounts,
  getSubdivisionOptions,
} from '../utils/trackerFilters';
import { FilterBar } from './FilterBar';
import { KpiStrip } from './KpiStrip';
import { ResourceCard } from './ResourceCard';

interface ExplorerViewProps {
  entries: TrackerEntry[];
  language: Language;
  filters: ExplorerFilterState;
  onFilterChange: (patch: Partial<ExplorerFilterState>) => void;
  onResetFilters: () => void;
  selectedCompareIds: string[];
  onToggleCompare: (id: string) => void;
}

export function ExplorerView({
  entries,
  language,
  filters,
  onFilterChange,
  onResetFilters,
  selectedCompareIds,
  onToggleCompare,
}: ExplorerViewProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const t = UI_STRINGS[language];

  const handleFilterChange = onFilterChange;
  const handleResetFilters = onResetFilters;

  const scopeCounts = useMemo(() => getScopeCounts(entries), [entries]);

  const countryOptions = useMemo(
    () => getCountryOptions(entries, language),
    [entries, language]
  );

  const subdivisionOptions = useMemo(
    () => getSubdivisionOptions(entries, filters.countryCode, language),
    [entries, filters.countryCode, language]
  );

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const entry of entries) {
      if (entry.resource.year !== null) years.add(entry.resource.year);
    }
    return Array.from(years).sort((a, b) => a - b);
  }, [entries]);

  const filteredEntries = useMemo(
    () => filterAndSortEntries(entries, filters, language),
    [entries, filters, language]
  );

  const kpiMetrics = useMemo(
    () => computeKpiMetrics(filteredEntries, entries.length),
    [filteredEntries, entries.length]
  );

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const expandableIds = useMemo(
    () =>
      filteredEntries
        .filter((e) => e.recommendations[language].length > 3)
        .map((e) => e.id),
    [filteredEntries, language]
  );

  const allExpanded =
    expandableIds.length > 0 && expandableIds.every((id) => Boolean(expandedIds[id]));

  const handleToggleAllExpanded = () => {
    if (allExpanded) {
      setExpandedIds({});
    } else {
      const next: Record<string, boolean> = {};
      for (const id of expandableIds) next[id] = true;
      setExpandedIds(next);
    }
  };

  const handleToggleSingleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectRiskFilter = (riskCode: RiskCode) => {
    onFilterChange({
      risk: filters.risk === riskCode ? 'all' : riskCode,
    });
  };

  const compareLimitReached = selectedCompareIds.length >= 3;

  return (
    <div className="space-y-5">
      <KpiStrip metrics={kpiMetrics} language={language} />

      <FilterBar
        filters={filters}
        language={language}
        scopeCounts={scopeCounts}
        countryOptions={countryOptions}
        subdivisionOptions={subdivisionOptions}
        availableYears={availableYears}
        activeFilterCount={activeFilterCount}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Results Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-0.5">
        <div className="text-xs sm:text-sm font-medium text-slate-600 tabular-nums">
          {t.filters.resultsSummary(filteredEntries.length, entries.length)}
          {activeFilterCount > 0 && (
            <span className="ml-2 text-indigo-700 font-semibold">
              · {t.filters.activeFiltersCount(activeFilterCount)}
            </span>
          )}
        </div>

        {expandableIds.length > 0 && (
          <button
            type="button"
            onClick={handleToggleAllExpanded}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            {allExpanded ? (
              <>
                <ChevronsDownUp className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.filters.collapseAll}</span>
              </>
            ) : (
              <>
                <ChevronsUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.filters.expandAll}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Results List or Empty State */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg px-6 py-14 text-center">
          <FileX2 className="w-10 h-10 text-slate-300 mx-auto" aria-hidden="true" />
          <h3 className="mt-3 text-base font-semibold text-slate-900">
            {t.emptyState.title}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto">
            {t.emptyState.description}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-5 inline-flex items-center px-4 py-2 rounded-md text-xs font-semibold bg-indigo-700 text-white hover:bg-indigo-800 transition-colors cursor-pointer"
          >
            {t.emptyState.resetButton}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <ResourceCard
              key={entry.id}
              entry={entry}
              language={language}
              isSelectedForCompare={selectedCompareIds.includes(entry.id)}
              compareDisabled={compareLimitReached}
              isExpanded={Boolean(expandedIds[entry.id])}
              onToggleExpand={() => handleToggleSingleExpand(entry.id)}
              onToggleCompare={() => onToggleCompare(entry.id)}
              onSelectRiskFilter={handleSelectRiskFilter}
            />
          ))}
        </div>
      )}
    </div>
  );
}
