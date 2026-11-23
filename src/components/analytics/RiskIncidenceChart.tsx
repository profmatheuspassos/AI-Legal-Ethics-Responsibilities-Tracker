import { useMemo } from 'react';
import { ANALYTICS_STRINGS } from '../../i18n/analyticsTranslations';
import { RISK_LABELS } from '../../i18n/translations';
import type { ExplorerFilterState, Language, TrackerEntry } from '../../types/tracker';
import {
  computeRiskIncidence,
  type DrillDownPayload,
} from '../../utils/analyticsData';

interface RiskIncidenceChartProps {
  entries: TrackerEntry[];
  language: Language;
  baseExplorerPatch: Partial<ExplorerFilterState>;
  onDrillDown: (payload: DrillDownPayload) => void;
}

export function RiskIncidenceChart({
  entries,
  language,
  baseExplorerPatch,
  onDrillDown,
}: RiskIncidenceChartProps) {
  const t = ANALYTICS_STRINGS[language].risks;
  const data = useMemo(() => computeRiskIncidence(entries), [entries]);

  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 flex flex-col">
      <div className="pb-4 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-900">{t.title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{t.subtitle}</p>
        <p className="text-[11px] text-slate-400 mt-1">{t.multiRiskNote}</p>
      </div>

      <div className="mt-4 space-y-2 flex-1">
        {data.items.map((item) => {
          const widthPct = item.count > 0 ? (item.count / data.maxCount) * 100 : 0;
          const label = RISK_LABELS[item.code][language];
          const disabled = item.count === 0;

          return (
            <button
              key={item.code}
              type="button"
              disabled={disabled}
              onClick={() =>
                onDrillDown({
                  title: RISK_LABELS[item.code],
                  entries: item.entries,
                  explorerPatch: { ...baseExplorerPatch, risk: item.code },
                })
              }
              title={disabled ? undefined : `${label}: ${item.count} (${item.pct.toFixed(1)}%) — ${t.clickHint}`}
              className={`w-full grid grid-cols-[170px_1fr_84px] sm:grid-cols-[240px_1fr_94px] items-center gap-3 py-1 px-1.5 -mx-1.5 rounded text-left transition-colors ${
                disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-50 cursor-pointer group'
              }`}
            >
              <span className="text-xs font-medium text-slate-800 group-hover:text-indigo-800 truncate">
                {label}
              </span>

              <div className="h-4 bg-slate-100 rounded-xs overflow-hidden">
                {item.count > 0 && (
                  <div
                    className="h-full bg-indigo-700 group-hover:bg-indigo-600 rounded-xs transition-all duration-150"
                    style={{ width: `${Math.max(widthPct, 2)}%` }}
                  />
                )}
              </div>

              <span className="text-right font-mono tabular-nums text-xs text-slate-700 whitespace-nowrap">
                <strong className="text-slate-900">{item.count}</strong>
                <span className="text-slate-400 ml-1">({item.pct.toFixed(1)}%)</span>
              </span>
            </button>
          );
        })}

        {/* Separated Explicit N/A Row */}
        <div className="pt-3 mt-3 border-t border-slate-200">
          <div className="text-[11px] font-medium text-slate-500 mb-1.5">
            {t.naDividerLabel}
          </div>
          <button
            type="button"
            disabled={data.naCount === 0}
            onClick={() =>
              onDrillDown({
                title: {
                  pt: ANALYTICS_STRINGS.pt.risks.naBarLabel,
                  en: ANALYTICS_STRINGS.en.risks.naBarLabel,
                },
                entries: data.naEntries,
                explorerPatch: { ...baseExplorerPatch, risk: 'na_no_risks' },
              })
            }
            className={`w-full grid grid-cols-[170px_1fr_84px] sm:grid-cols-[240px_1fr_94px] items-center gap-3 py-1.5 px-2 -mx-2 rounded bg-slate-50 border border-slate-200/80 text-left transition-colors ${
              data.naCount === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-slate-100 cursor-pointer group'
            }`}
          >
            <span className="text-xs font-semibold text-slate-700 truncate" title={t.naBarLabel}>
              {t.naBarLabel}
            </span>

            <div className="h-4 bg-white border border-slate-200 rounded-xs overflow-hidden">
              {data.naCount > 0 && (
                <div
                  className="h-full bg-slate-500 group-hover:bg-slate-600 rounded-xs transition-all duration-150"
                  style={{
                    width: `${Math.max((data.naCount / data.maxCount) * 100, 2)}%`,
                  }}
                />
              )}
            </div>

            <span className="text-right font-mono tabular-nums text-xs text-slate-700 whitespace-nowrap">
              <strong className="text-slate-900">{data.naCount}</strong>
              <span className="text-slate-500 ml-1">({data.naPct.toFixed(1)}%)</span>
            </span>
          </button>
        </div>
      </div>

      <div className="mt-3 text-[11px] text-slate-400">{t.clickHint}</div>
    </section>
  );
}
