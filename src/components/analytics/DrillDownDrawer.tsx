import { ArrowUpRight, X } from 'lucide-react';
import { useEffect } from 'react';
import { ANALYTICS_STRINGS } from '../../i18n/analyticsTranslations';
import { ISSUER_CATEGORY_LABELS, STATUS_LABELS } from '../../i18n/translations';
import type { Language } from '../../types/tracker';
import type { DrillDownPayload } from '../../utils/analyticsData';
import {
  countryCodeToFlag,
  RISK_CHIP_STYLES,
  STATUS_STYLES,
} from '../../utils/trackerFilters';

interface DrillDownDrawerProps {
  payload: DrillDownPayload | null;
  language: Language;
  onClose: () => void;
  onInspectInExplorer: (payload: DrillDownPayload) => void;
}

export function DrillDownDrawer({
  payload,
  language,
  onClose,
  onInspectInExplorer,
}: DrillDownDrawerProps) {
  useEffect(() => {
    if (!payload) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [payload, onClose]);

  if (!payload) return null;

  const t = ANALYTICS_STRINGS[language].drawer;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drilldown-drawer-title"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[1px] flex justify-end"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-2xl h-full flex flex-col shadow-2xl border-l border-slate-200">
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="min-w-0">
            <h2
              id="drilldown-drawer-title"
              className="text-base font-semibold leading-snug text-white"
            >
              {payload.title[language]}
            </h2>
            <p className="mt-1 text-xs font-mono tabular-nums text-indigo-200">
              {t.matchingRecords(payload.entries.length)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-600 truncate">
            {t.matchingRecords(payload.entries.length)}
          </span>
          <button
            type="button"
            onClick={() => onInspectInExplorer(payload)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-indigo-700 hover:bg-indigo-800 text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{t.inspectInExplorer}</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Compact Entry Cards */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50/50">
          {payload.entries.map((entry) => (
            <article
              key={entry.id}
              className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                    {countryCodeToFlag(entry.jurisdiction.countryCode)}{' '}
                    {entry.jurisdiction.countryCode}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {entry.jurisdiction.country[language]}
                    {entry.jurisdiction.subdivision && (
                      <span className="font-normal text-slate-600">
                        {' — '}
                        {entry.jurisdiction.subdivision[language]}
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                      STATUS_STYLES[entry.resource.status]
                    }`}
                  >
                    {STATUS_LABELS[entry.resource.status][language]}
                  </span>
                  <span className="font-mono tabular-nums text-[11px] text-slate-500">
                    {t.sourcePage(entry.sourcePage)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                  {entry.resource.title[language]}
                </h3>
                <div className="mt-1 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">
                    {entry.issuer.name[language]}
                  </span>{' '}
                  · {ISSUER_CATEGORY_LABELS[entry.issuer.category][language]} ·{' '}
                  <span>{entry.resource.dateDisplay[language]}</span>
                </div>
              </div>

              {/* Risks */}
              <div className="flex flex-wrap gap-1">
                {entry.risks.length === 0 ? (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {t.risksNa}
                  </span>
                ) : (
                  entry.risks.map((risk) => (
                    <span
                      key={risk.code}
                      className={`text-[11px] px-2 py-0.5 rounded border font-medium ${
                        RISK_CHIP_STYLES[risk.code]
                      }`}
                    >
                      {risk.label[language]}
                    </span>
                  ))
                )}
              </div>

              {/* Recommendations */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 mb-1">
                  {t.recommendationsLabel} ({entry.recommendations[language].length})
                </div>
                <ul className="space-y-1 text-xs text-slate-700 leading-relaxed list-disc pl-4 marker:text-slate-400">
                  {entry.recommendations[language].map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
