import { Check, Copy, Languages, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  ISSUER_CATEGORY_LABELS,
  STATUS_LABELS,
  UI_STRINGS,
} from '../i18n/translations';
import type { Language, RiskCode, TrackerEntry } from '../types/tracker';
import {
  buildComparisonMarkdown,
  countryCodeToFlag,
  RISK_CHIP_STYLES,
  STATUS_STYLES,
} from '../utils/trackerFilters';

interface ComparatorModalProps {
  entries: TrackerEntry[];
  language: Language;
  onRemoveEntry: (id: string) => void;
  onClose: () => void;
  onNotify: (message: string) => void;
}

export function ComparatorModal({
  entries,
  language,
  onRemoveEntry,
  onClose,
  onNotify,
}: ComparatorModalProps) {
  const [bilingualMode, setBilingualMode] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const t = UI_STRINGS[language];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const sharedRiskCodes = useMemo(() => {
    const counts = new Map<RiskCode, number>();
    for (const entry of entries) {
      const seenInEntry = new Set<RiskCode>();
      for (const risk of entry.risks) {
        if (!seenInEntry.has(risk.code)) {
          seenInEntry.add(risk.code);
          counts.set(risk.code, (counts.get(risk.code) ?? 0) + 1);
        }
      }
    }
    const shared = new Set<RiskCode>();
    for (const [code, count] of counts.entries()) {
      if (count >= 2) shared.add(code);
    }
    return shared;
  }, [entries]);

  const handleCopyMarkdown = async () => {
    const markdown = buildComparisonMarkdown(entries, language, bilingualMode);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(markdown);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = markdown;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setJustCopied(true);
      onNotify(t.comparator.copiedToast);
      setTimeout(() => setJustCopied(false), 2000);
    } catch {
      onNotify(t.comparator.copyErrorToast);
    }
  };

  if (entries.length < 2) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparator-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-[1360px] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
          <div className="min-w-0">
            <h2
              id="comparator-modal-title"
              className="text-base sm:text-lg font-semibold tracking-tight"
            >
              {t.comparator.modalTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{t.comparator.modalSubtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setBilingualMode((prev) => !prev)}
              aria-pressed={bilingualMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                bilingualMode
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Languages className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t.comparator.bilingualToggle}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              {justCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              )}
              <span>{t.comparator.copyMarkdown}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.comparator.close}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table Body */}
        <div className="overflow-auto flex-1 bg-slate-50 p-4 sm:p-5">
          <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
            <table className="w-full border-collapse min-w-[760px] table-fixed">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="w-44 p-4 text-left text-xs font-semibold text-slate-500 align-top">
                    &nbsp;
                  </th>
                  {entries.map((entry) => (
                    <th
                      key={entry.id}
                      className="p-4 text-left align-top border-l border-slate-200"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 leading-snug">
                            {entry.resource.title[language]}
                          </div>
                          {bilingualMode && (
                            <div className="mt-1 text-xs font-medium text-slate-500 leading-snug">
                              {entry.resource.title[language === 'pt' ? 'en' : 'pt']}
                            </div>
                          )}
                        </div>
                        {entries.length > 2 && (
                          <button
                            type="button"
                            onClick={() => onRemoveEntry(entry.id)}
                            title={t.comparator.removeColumn}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-sm">
                {/* Jurisdiction & Subdivision */}
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-slate-600 bg-slate-50/60 align-top">
                    {t.comparator.rowJurisdiction}
                  </th>
                  {entries.map((entry) => (
                    <td
                      key={entry.id}
                      className="p-4 align-top border-l border-slate-200 text-slate-800"
                    >
                      <div className="flex items-center gap-2 font-semibold text-slate-900">
                        <span className="font-mono text-xs bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                          {countryCodeToFlag(entry.jurisdiction.countryCode)}{' '}
                          {entry.jurisdiction.countryCode}
                        </span>
                        <span>{entry.jurisdiction.country[language]}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        {entry.jurisdiction.subdivision
                          ? entry.jurisdiction.subdivision[language]
                          : t.comparator.noSubdivision}{' '}
                        · {entry.jurisdiction.region[language]}
                      </div>
                      {bilingualMode && (
                        <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-xs text-slate-500">
                          {entry.jurisdiction.country[language === 'pt' ? 'en' : 'pt']}
                          {entry.jurisdiction.subdivision
                            ? ` — ${entry.jurisdiction.subdivision[language === 'pt' ? 'en' : 'pt']}`
                            : ''}{' '}
                          ({entry.jurisdiction.region[language === 'pt' ? 'en' : 'pt']})
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Issuing Body & Category */}
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-slate-600 bg-slate-50/60 align-top">
                    {t.comparator.rowIssuer}
                  </th>
                  {entries.map((entry) => (
                    <td
                      key={entry.id}
                      className="p-4 align-top border-l border-slate-200 text-slate-800"
                    >
                      <div className="font-medium text-slate-900">
                        {entry.issuer.name[language]}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {ISSUER_CATEGORY_LABELS[entry.issuer.category][language]}
                      </div>
                      {bilingualMode && (
                        <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-xs text-slate-500">
                          <div>{entry.issuer.name[language === 'pt' ? 'en' : 'pt']}</div>
                          <div className="text-[11px] text-slate-400">
                            {
                              ISSUER_CATEGORY_LABELS[entry.issuer.category][
                                language === 'pt' ? 'en' : 'pt'
                              ]
                            }
                          </div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Normative Status & Date */}
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-slate-600 bg-slate-50/60 align-top">
                    {t.comparator.rowStatusDate}
                  </th>
                  {entries.map((entry) => (
                    <td
                      key={entry.id}
                      className="p-4 align-top border-l border-slate-200 text-slate-800"
                    >
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          STATUS_STYLES[entry.resource.status]
                        }`}
                      >
                        {STATUS_LABELS[entry.resource.status][language]}
                      </span>
                      <div className="mt-2 text-xs text-slate-700">
                        {entry.resource.dateDisplay[language]} ·{' '}
                        <span className="font-mono tabular-nums text-slate-500">
                          {t.card.sourcePage(entry.sourcePage)}
                        </span>
                      </div>
                      {bilingualMode && (
                        <div className="mt-1 text-xs text-slate-500">
                          {
                            STATUS_LABELS[entry.resource.status][
                              language === 'pt' ? 'en' : 'pt'
                            ]
                          }{' '}
                          · {entry.resource.dateDisplay[language === 'pt' ? 'en' : 'pt']}
                        </div>
                      )}
                      {entry.resource.isMachineTranslated && (
                        <div className="mt-1.5 text-[11px] text-slate-500 italic">
                          {t.card.machineTranslatedNotice}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Identified Risks */}
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-slate-600 bg-slate-50/60 align-top">
                    {t.comparator.rowRisks}
                  </th>
                  {entries.map((entry) => (
                    <td
                      key={entry.id}
                      className="p-4 align-top border-l border-slate-200"
                    >
                      {entry.risks.length === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          {t.card.risksNaInSource}
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.risks.map((risk) => {
                            const isShared = sharedRiskCodes.has(risk.code);
                            return (
                              <span
                                key={risk.code}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
                                  RISK_CHIP_STYLES[risk.code]
                                }`}
                              >
                                <span>{risk.label[language]}</span>
                                {isShared && (
                                  <span className="text-[10px] font-semibold opacity-75">
                                    ({t.comparator.sharedRiskTag})
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Full Practical Recommendations */}
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-slate-600 bg-slate-50/60 align-top">
                    {t.comparator.rowRecommendations}
                  </th>
                  {entries.map((entry) => (
                    <td
                      key={entry.id}
                      className="p-4 align-top border-l border-slate-200 text-slate-700"
                    >
                      {!bilingualMode ? (
                        <ul className="space-y-2 text-xs sm:text-sm leading-relaxed list-disc pl-4 marker:text-slate-400">
                          {entry.recommendations[language].map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <div className="text-[11px] font-bold text-indigo-800 mb-1.5">
                              {t.comparator.portugueseLabel}
                            </div>
                            <ul className="space-y-1.5 text-xs leading-relaxed list-disc pl-4 marker:text-slate-400">
                              {entry.recommendations.pt.map((rec, idx) => (
                                <li key={idx}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="pt-3 border-t border-slate-200">
                            <div className="text-[11px] font-bold text-slate-700 mb-1.5">
                              {t.comparator.englishLabel}
                            </div>
                            <ul className="space-y-1.5 text-xs leading-relaxed list-disc pl-4 marker:text-slate-400">
                              {entry.recommendations.en.map((rec, idx) => (
                                <li key={idx}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
