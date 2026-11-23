import { Check, ChevronDown, ChevronUp, GitCompareArrows, Languages } from 'lucide-react';
import {
  ISSUER_CATEGORY_LABELS,
  STATUS_LABELS,
  UI_STRINGS,
} from '../i18n/translations';
import type { Language, RiskCode, TrackerEntry } from '../types/tracker';
import {
  countryCodeToFlag,
  RISK_CHIP_STYLES,
  STATUS_STYLES,
} from '../utils/trackerFilters';

interface ResourceCardProps {
  entry: TrackerEntry;
  language: Language;
  isSelectedForCompare: boolean;
  compareDisabled: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleCompare: () => void;
  onSelectRiskFilter: (riskCode: RiskCode) => void;
}

export function ResourceCard({
  entry,
  language,
  isSelectedForCompare,
  compareDisabled,
  isExpanded,
  onToggleExpand,
  onToggleCompare,
  onSelectRiskFilter,
}: ResourceCardProps) {
  const t = UI_STRINGS[language];
  const recs = entry.recommendations[language];
  const hasMoreRecs = recs.length > 3;
  const visibleRecs = hasMoreRecs && !isExpanded ? recs.slice(0, 3) : recs;
  const hiddenCount = recs.length - 3;
  const flag = countryCodeToFlag(entry.jurisdiction.countryCode);

  return (
    <article
      className={`bg-white rounded-lg border transition-colors ${
        isSelectedForCompare
          ? 'border-indigo-600 ring-1 ring-indigo-600/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="p-5 sm:p-6">
        {/* Top Metadata & Action Row */}
        <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              <span aria-hidden="true">{flag}</span>
              <span>{entry.jurisdiction.countryCode}</span>
            </span>

            <span className="font-semibold text-slate-900">
              {entry.jurisdiction.country[language]}
              {entry.jurisdiction.subdivision && (
                <span className="font-normal text-slate-700">
                  {' — '}
                  {entry.jurisdiction.subdivision[language]}
                </span>
              )}
            </span>

            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span>{entry.jurisdiction.region[language]}</span>

            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                STATUS_STYLES[entry.resource.status]
              }`}
            >
              {STATUS_LABELS[entry.resource.status][language]}
            </span>

            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span>{entry.resource.dateDisplay[language]}</span>

            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="font-mono tabular-nums text-slate-500">
              {t.card.sourcePage(entry.sourcePage)}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleCompare}
            disabled={compareDisabled && !isSelectedForCompare}
            title={
              compareDisabled && !isSelectedForCompare
                ? t.card.maxCompareReached
                : undefined
            }
            aria-pressed={isSelectedForCompare}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
              isSelectedForCompare
                ? 'bg-indigo-700 text-white border-indigo-700 hover:bg-indigo-800 cursor-pointer'
                : compareDisabled
                  ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 cursor-pointer'
            }`}
          >
            {isSelectedForCompare ? (
              <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <GitCompareArrows className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>
              {isSelectedForCompare ? t.card.selectedForCompare : t.card.compare}
            </span>
          </button>
        </div>

        {/* Title, Issuer & Machine Translation Notice */}
        <div className="mt-3.5">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
            {entry.resource.title[language]}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
            <span className="font-medium text-slate-800">
              {entry.issuer.name[language]}
            </span>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="text-slate-500">
              {ISSUER_CATEGORY_LABELS[entry.issuer.category][language]}
            </span>
          </div>

          {entry.resource.isMachineTranslated && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
              <Languages className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
              <span>{t.card.machineTranslatedNotice}</span>
            </div>
          )}
        </div>

        {/* Identified Risks */}
        <div className="mt-4">
          <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
            {t.card.risksHeading}
          </div>
          {entry.risks.length === 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {t.card.risksNaInSource}
            </span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {entry.risks.map((risk) => (
                <button
                  key={risk.code}
                  type="button"
                  onClick={() => onSelectRiskFilter(risk.code)}
                  title={t.card.filterByRiskHint}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
                    RISK_CHIP_STYLES[risk.code]
                  }`}
                >
                  {risk.label[language]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Practical Recommendations */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 mb-2">
            {t.card.recommendationsHeading} ({recs.length})
          </div>
          <ul className="space-y-1.5 text-sm text-slate-700 leading-relaxed list-disc pl-5 marker:text-slate-400">
            {visibleRecs.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>

          {hasMoreRecs && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.card.showLessRecs}</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.card.showMoreRecs(hiddenCount)}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
