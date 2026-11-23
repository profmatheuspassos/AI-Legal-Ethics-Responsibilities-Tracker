import { useMemo, useState } from 'react';
import { ANALYTICS_STRINGS } from '../../i18n/analyticsTranslations';
import {
  ALL_RESOURCE_STATUSES,
  REGION_LABELS,
  STATUS_LABELS,
} from '../../i18n/translations';
import type { Language, ResourceStatus, TrackerEntry } from '../../types/tracker';
import {
  computeGlobalJurisdictionBars,
  computeRegionalSummary,
  computeUsSubdivisionBars,
  STATUS_CHART_COLORS,
  US_FEDERAL_NULL_KEY,
  type DrillDownPayload,
  type StackedJurisdictionRow,
} from '../../utils/analyticsData';
import { countryCodeToFlag } from '../../utils/trackerFilters';

interface GeographicChartProps {
  entries: TrackerEntry[];
  language: Language;
  baseExplorerPatch: Partial<import('../../types/tracker').ExplorerFilterState>;
  onDrillDown: (payload: DrillDownPayload) => void;
}

export function GeographicChart({
  entries,
  language,
  baseExplorerPatch,
  onDrillDown,
}: GeographicChartProps) {
  const [mode, setMode] = useState<'global' | 'us'>('global');
  const [excludeUs, setExcludeUs] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState<{
    rowLabel: string;
    status: ResourceStatus | null;
    count: number;
    rowTotal: number;
  } | null>(null);

  const t = ANALYTICS_STRINGS[language].geo;

  const regionalSummary = useMemo(() => computeRegionalSummary(entries), [entries]);

  const rows: StackedJurisdictionRow[] = useMemo(() => {
    if (mode === 'global') {
      return computeGlobalJurisdictionBars(entries, language, excludeUs);
    }
    return computeUsSubdivisionBars(entries, language, t.federalUnspecifiedLabel);
  }, [entries, language, mode, excludeUs, t.federalUnspecifiedLabel]);

  const maxRowTotal = useMemo(
    () => Math.max(...rows.map((r) => r.total), 1),
    [rows]
  );

  const handleRowClick = (row: StackedJurisdictionRow, status?: ResourceStatus) => {
    const filteredEntries = status
      ? row.entries.filter((e) => e.resource.status === status)
      : row.entries;
    if (filteredEntries.length === 0) return;

    const ptLabel =
      mode === 'global'
        ? row.entries[0]?.jurisdiction.country.pt ?? row.label
        : row.entries[0]?.jurisdiction.subdivision?.pt ??
          ANALYTICS_STRINGS.pt.geo.federalUnspecifiedLabel;
    const enLabel =
      mode === 'global'
        ? row.entries[0]?.jurisdiction.country.en ?? row.label
        : row.entries[0]?.jurisdiction.subdivision?.en ??
          ANALYTICS_STRINGS.en.geo.federalUnspecifiedLabel;

    const ptStatus = status ? ` × ${STATUS_LABELS[status].pt}` : '';
    const enStatus = status ? ` × ${STATUS_LABELS[status].en}` : '';

    const patch: Partial<import('../../types/tracker').ExplorerFilterState> = {
      ...baseExplorerPatch,
      ...(status ? { status } : {}),
    };

    if (mode === 'global') {
      patch.countryCode = row.code;
      patch.subdivision = 'all';
    } else {
      patch.countryCode = 'US';
      patch.subdivision =
        row.key === US_FEDERAL_NULL_KEY ? 'all' : row.subdivisionEn ?? 'all';
    }

    onDrillDown({
      title: { pt: `${ptLabel}${ptStatus}`, en: `${enLabel}${enStatus}` },
      entries: filteredEntries,
      explorerPatch: patch,
    });
  };

  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{t.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div
            role="group"
            aria-label="Geographic view mode"
            className="inline-flex bg-slate-100 border border-slate-200 rounded-md p-0.5"
          >
            <button
              type="button"
              onClick={() => setMode('global')}
              aria-pressed={mode === 'global'}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                mode === 'global'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.modeGlobal}
            </button>
            <button
              type="button"
              onClick={() => setMode('us')}
              aria-pressed={mode === 'us'}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                mode === 'us'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.modeUs}
            </button>
          </div>

          {mode === 'global' && (
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 cursor-pointer select-none hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={excludeUs}
                onChange={(e) => setExcludeUs(e.target.checked)}
                className="rounded border-slate-300 text-indigo-700 focus:ring-indigo-600 cursor-pointer"
              />
              <span className="whitespace-nowrap">{t.excludeUsToggle}</span>
            </label>
          )}
        </div>
      </div>

      {/* Mode 1 Regional Summary Strip */}
      {mode === 'global' && (
        <div className="mt-4">
          <div className="text-[11px] font-semibold text-slate-500 mb-2">
            {t.regionalSummaryLabel}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-200 rounded-md divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-slate-50/50">
            {regionalSummary.map((reg) => {
              const label = REGION_LABELS[reg.regionEn]?.[language] ?? reg.regionEn;
              const disabled = reg.count === 0;
              return (
                <button
                  key={reg.regionEn}
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    onDrillDown({
                      title: {
                        pt: REGION_LABELS[reg.regionEn]?.pt ?? reg.regionEn,
                        en: REGION_LABELS[reg.regionEn]?.en ?? reg.regionEn,
                      },
                      entries: reg.entries,
                      explorerPatch: { ...baseExplorerPatch, region: reg.regionEn },
                    })
                  }
                  className={`px-3.5 py-2.5 text-left transition-colors ${
                    disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-indigo-50/50 cursor-pointer'
                  }`}
                >
                  <div className="text-xs font-medium text-slate-600 truncate">{label}</div>
                  <div className="mt-0.5 flex items-baseline gap-1.5 font-mono tabular-nums">
                    <span className="text-base font-bold text-slate-900">{reg.count}</span>
                    <span className="text-[11px] text-slate-500">
                      ({reg.pct.toFixed(1)}%)
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Status Legend & Live Hover Readout */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
          {ALL_RESOURCE_STATUSES.map((status) => (
            <span key={status} className="inline-flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-xs shrink-0"
                style={{ backgroundColor: STATUS_CHART_COLORS[status] }}
                aria-hidden="true"
              />
              <span>{STATUS_LABELS[status][language]}</span>
            </span>
          ))}
        </div>

        <div className="text-xs font-mono tabular-nums text-slate-600 min-h-[18px]">
          {hoveredInfo && (
            <span>
              <strong className="text-slate-900">{hoveredInfo.rowLabel}</strong>
              {hoveredInfo.status && (
                <span> · {STATUS_LABELS[hoveredInfo.status][language]}</span>
              )}
              :{' '}
              <strong className="text-indigo-800">{hoveredInfo.count}</strong>
              {hoveredInfo.status && (
                <span>
                  {' '}
                  ({((hoveredInfo.count / hoveredInfo.rowTotal) * 100).toFixed(0)}%)
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Horizontal Stacked Bars */}
      {rows.length === 0 ? (
        <div className="mt-6 py-10 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-md">
          {mode === 'us' ? t.emptyUsSlice : t.emptySlice}
        </div>
      ) : (
        <div className="mt-4 space-y-2 max-h-[540px] overflow-y-auto pr-1">
          {rows.map((row) => {
            const barTotalWidthPct = (row.total / maxRowTotal) * 100;
            return (
              <div
                key={row.key}
                className="group grid grid-cols-[170px_1fr_84px] sm:grid-cols-[210px_1fr_96px] items-center gap-3 py-1 rounded hover:bg-slate-50 px-1.5 -mx-1.5 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => handleRowClick(row)}
                  onMouseEnter={() =>
                    setHoveredInfo({
                      rowLabel: row.label,
                      status: null,
                      count: row.total,
                      rowTotal: row.total,
                    })
                  }
                  onMouseLeave={() => setHoveredInfo(null)}
                  title={`${row.label} (${row.total}) — ${t.clickHint}`}
                  className="flex items-center gap-2 text-left text-xs font-medium text-slate-800 hover:text-indigo-800 truncate cursor-pointer"
                >
                  {mode === 'global' && (
                    <span className="font-mono text-[11px] text-slate-500 shrink-0 w-9">
                      {countryCodeToFlag(row.code)} {row.code}
                    </span>
                  )}
                  <span className="truncate">{row.label}</span>
                </button>

                <div className="h-5 bg-slate-100 rounded-xs overflow-hidden flex items-center">
                  <div
                    className="h-full flex overflow-hidden rounded-xs transition-all duration-150"
                    style={{ width: `${Math.max(barTotalWidthPct, 2)}%` }}
                  >
                    {ALL_RESOURCE_STATUSES.map((status) => {
                      const segCount = row.byStatus[status];
                      if (segCount === 0) return null;
                      const segPctOfRow = (segCount / row.total) * 100;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleRowClick(row, status)}
                          onMouseEnter={() =>
                            setHoveredInfo({
                              rowLabel: row.label,
                              status,
                              count: segCount,
                              rowTotal: row.total,
                            })
                          }
                          onMouseLeave={() => setHoveredInfo(null)}
                          aria-label={`${row.label} — ${STATUS_LABELS[status][language]}: ${segCount}`}
                          title={`${row.label} · ${STATUS_LABELS[status][language]}: ${segCount}`}
                          className="h-full cursor-pointer hover:opacity-85 transition-opacity border-r border-white/30 last:border-r-0"
                          style={{
                            width: `${segPctOfRow}%`,
                            backgroundColor: STATUS_CHART_COLORS[status],
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRowClick(row)}
                  className="text-right font-mono tabular-nums text-xs text-slate-700 hover:text-indigo-800 cursor-pointer whitespace-nowrap"
                >
                  <span className="font-bold text-slate-900">{row.total}</span>
                  <span className="text-slate-400 ml-1">
                    ({row.sharePct.toFixed(1)}%)
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
