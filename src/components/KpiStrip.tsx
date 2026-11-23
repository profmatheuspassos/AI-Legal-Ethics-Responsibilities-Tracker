import { UI_STRINGS } from '../i18n/translations';
import type { Language } from '../types/tracker';
import type { KpiMetrics } from '../utils/trackerFilters';

interface KpiStripProps {
  metrics: KpiMetrics;
  language: Language;
}

export function KpiStrip({ metrics, language }: KpiStripProps) {
  const t = UI_STRINGS[language];

  return (
    <section
      aria-label="Dataset summary metrics"
      className="bg-white border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200"
    >
      <div className="px-5 py-4">
        <div className="text-xs font-medium text-slate-500">{t.kpi.filteredEntries}</div>
        <div className="mt-1.5 flex items-baseline gap-1.5 font-mono tabular-nums">
          <span className="text-2xl font-bold text-slate-900">{metrics.filteredCount}</span>
          <span className="text-sm font-medium text-slate-400">
            / {metrics.totalCount}
          </span>
        </div>
        <div className="mt-1 text-xs text-slate-500">
          {metrics.filteredCount === metrics.totalCount
            ? t.appSubtitle
            : `${metrics.filteredCount} ${t.kpi.ofTotal} ${metrics.totalCount}`}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="text-xs font-medium text-slate-500">{t.kpi.jurisdictions}</div>
        <div className="mt-1.5 font-mono tabular-nums text-2xl font-bold text-slate-900">
          {metrics.jurisdictionsCount}
        </div>
        <div className="mt-1 text-xs text-slate-500">{t.kpi.jurisdictionsSub}</div>
      </div>

      <div className="px-5 py-4">
        <div className="text-xs font-medium text-slate-500">{t.kpi.subdivisions}</div>
        <div className="mt-1.5 font-mono tabular-nums text-2xl font-bold text-slate-900">
          {metrics.subdivisionsCount}
        </div>
        <div className="mt-1 text-xs text-slate-500">{t.kpi.subdivisionsSub}</div>
      </div>

      <div className="px-5 py-4">
        <div className="text-xs font-medium text-slate-500">{t.kpi.legislation}</div>
        <div className="mt-1.5 font-mono tabular-nums text-2xl font-bold text-indigo-800">
          {metrics.legislationCount}
        </div>
        <div className="mt-1 text-xs text-slate-500">{t.kpi.legislationSub}</div>
      </div>
    </section>
  );
}
