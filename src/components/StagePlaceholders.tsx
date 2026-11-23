import { BarChart3, Database, Info, ScrollText } from 'lucide-react';
import { STORAGE_KEY_ENTRIES } from '../hooks/useTrackerStore';
import { UI_STRINGS } from '../i18n/translations';
import type { Language, TrackerEntry } from '../types/tracker';

interface StagePlaceholderProps {
  entries: TrackerEntry[];
  language: Language;
}

export function AnalyticsPlaceholder({ entries, language }: StagePlaceholderProps) {
  const t = UI_STRINGS[language].stage2;
  const total = entries.length;
  const usCount = entries.filter((e) => e.jurisdiction.countryCode === 'US').length;
  const nonUsCount = total - usCount;
  const naRiskCount = entries.filter((e) => e.risks.length === 0).length;
  const explicitRiskCount = total - naRiskCount;

  const pct = (value: number) =>
    total > 0 ? `${((value / total) * 100).toFixed(1)}%` : '0.0%';

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
          <BarChart3 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t.badge}</span>
        </div>
        <h2 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {t.title}
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          {t.description}
        </p>

        {/* Live Shared-Dataset Structural Preview */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-3">
            {t.livePreviewLabel}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-200 rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-slate-50/50">
            <div className="p-4">
              <div className="text-xs text-slate-500">{t.usShareLabel}</div>
              <div className="mt-1 font-mono tabular-nums text-xl font-bold text-slate-900">
                {usCount}{' '}
                <span className="text-xs font-medium text-slate-500">({pct(usCount)})</span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-slate-500">{t.nonUsShareLabel}</div>
              <div className="mt-1 font-mono tabular-nums text-xl font-bold text-slate-900">
                {nonUsCount}{' '}
                <span className="text-xs font-medium text-slate-500">({pct(nonUsCount)})</span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-slate-500">{t.explicitRiskShareLabel}</div>
              <div className="mt-1 font-mono tabular-nums text-xl font-bold text-indigo-800">
                {explicitRiskCount}{' '}
                <span className="text-xs font-medium text-slate-500">
                  ({pct(explicitRiskCount)})
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-slate-500">{t.naRiskShareLabel}</div>
              <div className="mt-1 font-mono tabular-nums text-xl font-bold text-slate-700">
                {naRiskCount}{' '}
                <span className="text-xs font-medium text-slate-500">({pct(naRiskCount)})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Planned Modules */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            {t.plannedModulesTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.modules.map((mod, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/40"
              >
                <div className="font-mono text-xs font-semibold text-indigo-700">
                  0{idx + 1}.
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {mod.title}
                </div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {mod.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Methodological Notes */}
        <div className="mt-8 p-5 rounded-lg border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Info className="w-4 h-4 text-indigo-700 shrink-0" aria-hidden="true" />
            <span>{t.methodologyTitle}</span>
          </div>
          <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed list-disc pl-5 marker:text-slate-400">
            {t.methodologyPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export function MonitorPlaceholder({ entries, language }: StagePlaceholderProps) {
  const t = UI_STRINGS[language].stage3;
  const enacted = entries.filter((e) => e.resource.status === 'enacted_law').length;
  const pending = entries.filter((e) => e.resource.status === 'pending_bill').length;
  const died = entries.filter((e) => e.resource.status === 'died_bill').length;
  const guidanceAndRules = entries.length - (enacted + pending + died);

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
          <ScrollText className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t.badge}</span>
        </div>
        <h2 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {t.title}
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          {t.description}
        </p>

        {/* Current Legislative Breakdown */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-3">
            {t.billsBreakdownTitle}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-200 rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-slate-50/50">
            <div className="p-4">
              <div className="text-xs text-slate-500">{t.enactedCount}</div>
              <div className="mt-1 font-mono tabular-nums text-xl font-bold text-slate-900">
                {enacted}
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-slate-500">{t.pendingCount}</div>
              <div className="mt-1 font-mono tabular-nums text-xl font-bold text-amber-800">
                {pending}
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-slate-500">{t.diedCount}</div>
              <div className="mt-1 font-mono tabular-nums text-xl font-bold text-rose-800">
                {died}
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-slate-500">{t.guidanceRulesCount}</div>
              <div className="mt-1 font-mono tabular-nums text-xl font-bold text-indigo-800">
                {guidanceAndRules}
              </div>
            </div>
          </div>
        </div>

        {/* Planned Capabilities */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            {t.plannedCapabilitiesTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.capabilities.map((cap, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/40"
              >
                <div className="font-mono text-xs font-semibold text-indigo-700">
                  0{idx + 1}.
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {cap.title}
                </div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {cap.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Persistence Wiring Note */}
        <div className="mt-8 p-5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-900">
            <Database className="w-4 h-4 text-indigo-700 shrink-0" aria-hidden="true" />
            <span>{t.storageStatusTitle}</span>
          </div>
          <div className="text-xs text-slate-600">
            {t.storageKeyLabel}:{' '}
            <code className="font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800">
              {STORAGE_KEY_ENTRIES}
            </code>
          </div>
        </div>
      </section>
    </div>
  );
}
