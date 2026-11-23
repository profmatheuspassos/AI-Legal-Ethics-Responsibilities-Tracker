import { ChevronDown, ChevronUp, Info, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ANALYTICS_STRINGS } from '../../i18n/analyticsTranslations';
import {
  ALL_ISSUER_CATEGORIES,
  ALL_RESOURCE_STATUSES,
  ISSUER_CATEGORY_LABELS,
  REGION_LABELS,
  RISK_LABELS,
  STATUS_LABELS,
} from '../../i18n/translations';
import type {
  ExplorerFilterState,
  IssuerCategory,
  Language,
  ResourceStatus,
  TrackerEntry,
} from '../../types/tracker';
import {
  computeAnalyticsKpis,
  countActiveAnalyticsFilters,
  DEFAULT_ANALYTICS_FILTERS,
  filterAnalyticsEntries,
  type AnalyticsFilterState,
  type AnalyticsScope,
  type DrillDownPayload,
} from '../../utils/analyticsData';
import { ChronologicalChart } from './ChronologicalChart';
import { DrillDownDrawer } from './DrillDownDrawer';
import { GeographicChart } from './GeographicChart';
import { RegulatoryHeatmap } from './RegulatoryHeatmap';
import { RiskIncidenceChart } from './RiskIncidenceChart';

interface AnalyticsDashboardProps {
  entries: TrackerEntry[];
  language: Language;
  onInspectInExplorer: (patch: Partial<ExplorerFilterState>) => void;
}

const REGION_KEYS = ['North America', 'Europe', 'Asia-Pacific', 'Latin America'] as const;

export function AnalyticsDashboard({
  entries,
  language,
  onInspectInExplorer,
}: AnalyticsDashboardProps) {
  const [filters, setFilters] = useState<AnalyticsFilterState>(DEFAULT_ANALYTICS_FILTERS);
  const [caveatsOpen, setCaveatsOpen] = useState(true);
  const [drillDown, setDrillDown] = useState<DrillDownPayload | null>(null);

  const t = ANALYTICS_STRINGS[language];

  // Full-corpus methodological caveat counts
  const corpusStats = useMemo(() => {
    const total = entries.length;
    const usCount = entries.filter((e) => e.jurisdiction.countryCode === 'US').length;
    const nonUsCount = total - usCount;
    const europeCount = entries.filter((e) => e.jurisdiction.region.en === 'Europe').length;
    const naCount = entries.filter((e) => e.risks.length === 0).length;
    return { total, usCount, nonUsCount, europeCount, naCount };
  }, [entries]);

  const slicedEntries = useMemo(
    () => filterAnalyticsEntries(entries, filters),
    [entries, filters]
  );

  const kpis = useMemo(
    () => computeAnalyticsKpis(slicedEntries, entries.length),
    [slicedEntries, entries.length]
  );

  const activeFilterCount = useMemo(
    () => countActiveAnalyticsFilters(filters),
    [filters]
  );

  // Base Explorer filter patch representing the active Tab 2 slice so drill-down carries slice context into Tab 1
  const baseExplorerPatch = useMemo<Partial<ExplorerFilterState>>(() => {
    const patch: Partial<ExplorerFilterState> = {};
    if (filters.scope !== 'all') patch.scope = filters.scope;
    if (filters.region !== 'all') patch.region = filters.region;
    if (filters.status !== 'all') patch.status = filters.status;
    if (filters.issuerCategory !== 'all') patch.issuerCategory = filters.issuerCategory;
    return patch;
  }, [filters]);

  const scopeButtons: { id: AnalyticsScope; label: string; count: number }[] = [
    { id: 'all', label: t.filters.scopeAll, count: corpusStats.total },
    { id: 'non_us', label: t.filters.scopeNonUs, count: corpusStats.nonUsCount },
    { id: 'us', label: t.filters.scopeUs, count: corpusStats.usCount },
    { id: 'europe', label: t.filters.scopeEurope, count: corpusStats.europeCount },
  ];

  const handleInspect = (payload: DrillDownPayload) => {
    setDrillDown(null);
    onInspectInExplorer(payload.explorerPatch);
  };

  return (
    <div className="space-y-5">
      {/* 1. Mandatory Methodological Caveats Banner */}
      <section
        aria-label={t.caveats.title}
        className="bg-slate-900 text-slate-100 border border-slate-800 rounded-lg overflow-hidden"
      >
        <div className="px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <Info className="w-4 h-4 text-indigo-300 shrink-0" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-white truncate">
              {t.caveats.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setCaveatsOpen((prev) => !prev)}
            aria-expanded={caveatsOpen}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-200 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{caveatsOpen ? t.caveats.toggleHide : t.caveats.toggleShow}</span>
            {caveatsOpen ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {caveatsOpen && (
          <div className="px-5 pb-4 pt-1 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-md p-3.5">
              <div className="font-semibold text-indigo-200 mb-1">
                {t.caveats.usTitle}
              </div>
              <p className="text-slate-300">
                {t.caveats.usBody(
                  corpusStats.usCount,
                  corpusStats.total,
                  corpusStats.nonUsCount
                )}
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 rounded-md p-3.5">
              <div className="font-semibold text-indigo-200 mb-1">
                {t.caveats.naTitle}
              </div>
              <p className="text-slate-300">
                {t.caveats.naBody(corpusStats.naCount, corpusStats.total)}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 2. Interactive Analytics Slice Controls */}
      <section
        aria-label="Analytics slice filters"
        className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 space-y-3.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="group"
            aria-label="Analytics quick scope"
            className="flex flex-wrap items-center gap-2"
          >
            {scopeButtons.map((scope) => {
              const isActive = filters.scope === scope.id;
              return (
                <button
                  key={scope.id}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, scope: scope.id }))}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{scope.label}</span>
                  <span
                    className={`font-mono tabular-nums text-[11px] ${
                      isActive ? 'text-indigo-200' : 'text-slate-500'
                    }`}
                  >
                    ({scope.count})
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setFilters(DEFAULT_ANALYTICS_FILTERS)}
            disabled={activeFilterCount === 0}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 ${
              activeFilterCount > 0
                ? 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer'
                : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{t.filters.reset}</span>
            {activeFilterCount > 0 && (
              <span className="font-mono tabular-nums text-indigo-700">
                ({activeFilterCount})
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label
              htmlFor="analytics-region"
              className="block text-xs font-medium text-slate-600 mb-1"
            >
              {t.filters.region}
            </label>
            <select
              id="analytics-region"
              value={filters.region}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, region: e.target.value }))
              }
              className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
            >
              <option value="all">{t.filters.allRegions}</option>
              {REGION_KEYS.map((reg) => (
                <option key={reg} value={reg}>
                  {REGION_LABELS[reg][language]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="analytics-status"
              className="block text-xs font-medium text-slate-600 mb-1"
            >
              {t.filters.status}
            </label>
            <select
              id="analytics-status"
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value as 'all' | ResourceStatus,
                }))
              }
              className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
            >
              <option value="all">{t.filters.allStatuses}</option>
              {ALL_RESOURCE_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {STATUS_LABELS[st][language]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="analytics-issuer"
              className="block text-xs font-medium text-slate-600 mb-1"
            >
              {t.filters.issuer}
            </label>
            <select
              id="analytics-issuer"
              value={filters.issuerCategory}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  issuerCategory: e.target.value as 'all' | IssuerCategory,
                }))
              }
              className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
            >
              <option value="all">{t.filters.allIssuers}</option>
              {ALL_ISSUER_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {ISSUER_CATEGORY_LABELS[cat][language]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 3. Dynamic 4-Column KPI Strip */}
      <section
        aria-label="Analytics summary KPIs"
        className="bg-white border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200"
      >
        <div className="px-5 py-4">
          <div className="text-xs font-medium text-slate-500">
            {t.kpi.recordsAnalyzed}
          </div>
          <div className="mt-1.5 font-mono tabular-nums text-2xl font-bold text-slate-900">
            {kpis.analyzedCount}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-mono tabular-nums">
            {t.kpi.ofDataset(kpis.analyzedSharePct.toFixed(1), kpis.totalCount)}
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="text-xs font-medium text-slate-500">
            {t.kpi.jurisdictionsRepresented}
          </div>
          <div className="mt-1.5 font-mono tabular-nums text-2xl font-bold text-slate-900">
            {kpis.jurisdictionsCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {t.kpi.subdivisionsSub(kpis.subdivisionsCount)}
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="text-xs font-medium text-slate-500">{t.kpi.topRisk}</div>
          {kpis.topRiskCode ? (
            <>
              <div
                className="mt-1.5 text-base font-bold text-indigo-800 leading-snug truncate"
                title={RISK_LABELS[kpis.topRiskCode][language]}
              >
                {RISK_LABELS[kpis.topRiskCode][language]}
              </div>
              <div className="mt-1 text-xs text-slate-500 font-mono tabular-nums">
                {t.kpi.topRiskEntries(kpis.topRiskCount)}
              </div>
            </>
          ) : (
            <div className="mt-2 text-xs text-slate-400">{t.kpi.noRisksInSlice}</div>
          )}
        </div>

        <div className="px-5 py-4">
          <div className="text-xs font-medium text-slate-500">
            {t.kpi.riskCoverage}
          </div>
          <div className="mt-1.5 font-mono tabular-nums text-2xl font-bold text-slate-900">
            {kpis.classifiedRiskPct.toFixed(1)}%
          </div>
          <div className="mt-1 text-xs text-slate-500 font-mono tabular-nums">
            {t.kpi.riskCoverageSub(
              kpis.classifiedRiskCount,
              kpis.classifiedRiskPct.toFixed(1),
              kpis.naRiskCount,
              kpis.naRiskPct.toFixed(1)
            )}
          </div>
        </div>
      </section>

      {/* 4. Visualization A: Geographic & Sub-National Distribution */}
      <GeographicChart
        entries={slicedEntries}
        language={language}
        baseExplorerPatch={baseExplorerPatch}
        onDrillDown={setDrillDown}
      />

      {/* 5. Visualizations B & C Side-by-Side on Wide Desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-stretch">
        <ChronologicalChart
          entries={slicedEntries}
          language={language}
          baseExplorerPatch={baseExplorerPatch}
          onDrillDown={setDrillDown}
        />

        <RiskIncidenceChart
          entries={slicedEntries}
          language={language}
          baseExplorerPatch={baseExplorerPatch}
          onDrillDown={setDrillDown}
        />
      </div>

      {/* 6. Visualization D: Regulatory Heatmap Matrix */}
      <RegulatoryHeatmap
        entries={slicedEntries}
        language={language}
        baseExplorerPatch={baseExplorerPatch}
        onDrillDown={setDrillDown}
      />

      {/* 7. Slide-Over Drill-Down Drawer */}
      <DrillDownDrawer
        payload={drillDown}
        language={language}
        onClose={() => setDrillDown(null)}
        onInspectInExplorer={handleInspect}
      />
    </div>
  );
}
