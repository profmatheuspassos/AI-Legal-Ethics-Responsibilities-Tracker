import { useMemo, useState } from 'react';
import { ANALYTICS_STRINGS } from '../../i18n/analyticsTranslations';
import {
  ALL_RISK_CODES,
  REGION_LABELS,
  RISK_LABELS,
  RISK_SHORT_LABELS,
} from '../../i18n/translations';
import type { ExplorerFilterState, Language, TrackerEntry } from '../../types/tracker';
import {
  computeHeatmapMatrix,
  type DrillDownPayload,
  type HeatmapColumnKey,
  type HeatmapRowMode,
} from '../../utils/analyticsData';
import { countryCodeToFlag } from '../../utils/trackerFilters';

interface RegulatoryHeatmapProps {
  entries: TrackerEntry[];
  language: Language;
  baseExplorerPatch: Partial<ExplorerFilterState>;
  onDrillDown: (payload: DrillDownPayload) => void;
}

function getCellStyle(
  count: number,
  maxCount: number,
  isNaColumn: boolean
): { bg: string; text: string } {
  if (count === 0) {
    return { bg: 'bg-slate-50', text: 'text-slate-300' };
  }
  const ratio = count / Math.max(maxCount, 1);
  if (isNaColumn) {
    if (ratio >= 0.75) return { bg: 'bg-slate-700', text: 'text-white' };
    if (ratio >= 0.5) return { bg: 'bg-slate-500', text: 'text-white' };
    if (ratio >= 0.25) return { bg: 'bg-slate-300', text: 'text-slate-900' };
    return { bg: 'bg-slate-200', text: 'text-slate-800' };
  }
  if (ratio >= 0.8) return { bg: 'bg-indigo-900', text: 'text-white' };
  if (ratio >= 0.55) return { bg: 'bg-indigo-700', text: 'text-white' };
  if (ratio >= 0.3) return { bg: 'bg-indigo-500', text: 'text-white' };
  if (ratio >= 0.12) return { bg: 'bg-indigo-200', text: 'text-indigo-950' };
  return { bg: 'bg-indigo-100', text: 'text-indigo-900' };
}

export function RegulatoryHeatmap({
  entries,
  language,
  baseExplorerPatch,
  onDrillDown,
}: RegulatoryHeatmapProps) {
  const [rowMode, setRowMode] = useState<HeatmapRowMode>('region');
  const [hoveredCell, setHoveredCell] = useState<{
    rowLabel: string;
    colLabel: string;
    count: number;
    rowPct: number;
    colPct: number;
  } | null>(null);

  const t = ANALYTICS_STRINGS[language].heatmap;
  const geoT = ANALYTICS_STRINGS[language].geo;

  const matrix = useMemo(
    () =>
      computeHeatmapMatrix(
        entries,
        rowMode,
        language,
        REGION_LABELS,
        geoT.federalUnspecifiedLabel
      ),
    [entries, rowMode, language, geoT.federalUnspecifiedLabel]
  );

  const columns: HeatmapColumnKey[] = useMemo(
    () => [...ALL_RISK_CODES, 'na_no_risks'],
    []
  );

  const getColShort = (col: HeatmapColumnKey) =>
    col === 'na_no_risks' ? t.naColumnShort : RISK_SHORT_LABELS[col][language];

  const getColFull = (col: HeatmapColumnKey) =>
    col === 'na_no_risks' ? t.naColumnFull : RISK_LABELS[col][language];

  const rowModeOptions: { id: HeatmapRowMode; label: string }[] = [
    { id: 'region', label: t.rowModeRegion },
    { id: 'countries', label: t.rowModeCountries },
    { id: 'us_states', label: t.rowModeUsStates },
  ];

  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6">
      {/* Header & Row Mode Selector */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{t.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{t.subtitle}</p>
        </div>

        <div
          role="group"
          aria-label="Heatmap row grouping"
          className="inline-flex flex-wrap bg-slate-100 border border-slate-200 rounded-md p-0.5 shrink-0"
        >
          {rowModeOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setRowMode(opt.id)}
              aria-pressed={rowMode === opt.id}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                rowMode === opt.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Intensity Scale Legend + Rich Hover Status Readout */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-mono">{t.intensityLow}</span>
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="w-4 h-3.5 rounded-xs bg-slate-50 border border-slate-200" />
            <span className="w-4 h-3.5 rounded-xs bg-indigo-100" />
            <span className="w-4 h-3.5 rounded-xs bg-indigo-200" />
            <span className="w-4 h-3.5 rounded-xs bg-indigo-500" />
            <span className="w-4 h-3.5 rounded-xs bg-indigo-700" />
            <span className="w-4 h-3.5 rounded-xs bg-indigo-900" />
          </div>
          <span className="font-mono">
            {t.intensityHigh} ({matrix.maxCellCount})
          </span>
        </div>

        <div className="min-h-[24px] text-xs">
          {hoveredCell ? (
            <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 bg-slate-900 text-white px-3 py-1 rounded-md font-mono tabular-nums">
              <span className="font-sans font-semibold">{hoveredCell.rowLabel}</span>
              <span className="text-slate-400">×</span>
              <span className="font-sans text-indigo-200">{hoveredCell.colLabel}:</span>
              <strong className="text-white">{hoveredCell.count}</strong>
              <span className="text-slate-300 text-[11px]">
                ({t.rowShareLabel}: {hoveredCell.rowPct.toFixed(1)}% / {t.colShareLabel}:{' '}
                {hoveredCell.colPct.toFixed(1)}%)
              </span>
            </div>
          ) : (
            <span className="text-slate-400">{t.clickCellHint}</span>
          )}
        </div>
      </div>

      {/* Matrix Table */}
      {matrix.rows.length === 0 ? (
        <div className="mt-5 py-10 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-md">
          {t.emptyMatrix}
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto border border-slate-200 rounded-md">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-left font-semibold text-slate-600 min-w-[168px] border-r border-slate-200 align-bottom">
                  {rowMode === 'region'
                    ? t.rowModeRegion
                    : rowMode === 'countries'
                      ? t.rowModeCountries
                      : t.rowModeUsStates}
                </th>
                <th className="px-2 py-2 text-center font-semibold text-slate-500 border-r border-slate-200 align-bottom whitespace-nowrap">
                  {t.totalColumn}
                </th>
                {columns.map((col) => {
                  const isNa = col === 'na_no_risks';
                  return (
                    <th
                      key={col}
                      title={getColFull(col)}
                      className={`px-1 py-2 align-bottom text-center font-medium text-slate-700 min-w-[46px] ${
                        isNa
                          ? 'border-l-2 border-slate-300 bg-slate-100/80 text-slate-800 font-bold'
                          : 'border-l border-slate-100'
                      }`}
                    >
                      <div className="h-24 flex items-end justify-center pb-1">
                        <span
                          className="inline-block whitespace-nowrap text-[11px] leading-none"
                          style={{
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                          }}
                        >
                          {getColShort(col)}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {matrix.rows.map((row) => (
                <tr key={row.rowKey} className="hover:bg-slate-50/50">
                  <th className="sticky left-0 z-10 bg-white px-3 py-2 text-left font-medium text-slate-800 border-r border-slate-200 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      {rowMode === 'countries' && row.code && (
                        <span className="font-mono text-[11px] text-slate-500">
                          {countryCodeToFlag(row.code)} {row.code}
                        </span>
                      )}
                      <span className="truncate max-w-[155px]" title={row.label}>
                        {row.label}
                      </span>
                    </span>
                  </th>

                  <td className="px-2 py-2 text-center font-mono tabular-nums font-semibold text-slate-700 bg-slate-50/40 border-r border-slate-200">
                    {row.totalEntries}
                  </td>

                  {columns.map((col) => {
                    const cell = row.cells[col];
                    const isNa = col === 'na_no_risks';
                    const style = getCellStyle(cell.count, matrix.maxCellCount, isNa);
                    const colFull = getColFull(col);
                    const clickable = cell.count > 0;

                    return (
                      <td
                        key={col}
                        className={`p-1 text-center ${
                          isNa
                            ? 'border-l-2 border-slate-300 bg-slate-50/40'
                            : 'border-l border-slate-100'
                        }`}
                      >
                        <button
                          type="button"
                          disabled={!clickable}
                          onClick={() => {
                            if (!clickable) return;
                            const firstEntry = cell.entries[0];
                            const ptRow =
                              rowMode === 'region'
                                ? REGION_LABELS[row.rowKey]?.pt ?? row.label
                                : rowMode === 'countries'
                                  ? firstEntry?.jurisdiction.country.pt ?? row.label
                                  : firstEntry?.jurisdiction.subdivision?.pt ??
                                    ANALYTICS_STRINGS.pt.geo.federalUnspecifiedLabel;
                            const enRow =
                              rowMode === 'region'
                                ? REGION_LABELS[row.rowKey]?.en ?? row.label
                                : rowMode === 'countries'
                                  ? firstEntry?.jurisdiction.country.en ?? row.label
                                  : firstEntry?.jurisdiction.subdivision?.en ??
                                    ANALYTICS_STRINGS.en.geo.federalUnspecifiedLabel;
                            const ptCol =
                              col === 'na_no_risks'
                                ? ANALYTICS_STRINGS.pt.heatmap.naColumnFull
                                : RISK_LABELS[col].pt;
                            const enCol =
                              col === 'na_no_risks'
                                ? ANALYTICS_STRINGS.en.heatmap.naColumnFull
                                : RISK_LABELS[col].en;
                            onDrillDown({
                              title: {
                                pt: `${ptRow} × ${ptCol}`,
                                en: `${enRow} × ${enCol}`,
                              },
                              entries: cell.entries,
                              explorerPatch: {
                                ...baseExplorerPatch,
                                ...row.explorerPatch,
                                risk: col,
                              },
                            });
                          }}
                          onMouseEnter={() =>
                            setHoveredCell({
                              rowLabel: row.label,
                              colLabel: colFull,
                              count: cell.count,
                              rowPct: cell.rowPct,
                              colPct: cell.colPct,
                            })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                          title={`${row.label} × ${colFull}: ${cell.count} (${t.rowShareLabel}: ${cell.rowPct.toFixed(1)}% / ${t.colShareLabel}: ${cell.colPct.toFixed(1)}%)`}
                          className={`w-full h-7 rounded-xs font-mono tabular-nums text-xs font-semibold flex items-center justify-center transition-all ${style.bg} ${style.text} ${
                            clickable
                              ? 'cursor-pointer hover:ring-2 hover:ring-indigo-600/60'
                              : 'cursor-default'
                          }`}
                        >
                          {cell.count > 0 ? cell.count : '·'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
