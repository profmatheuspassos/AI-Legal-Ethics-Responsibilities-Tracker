import { ChevronDown, ChevronUp, History } from 'lucide-react';
import { useState } from 'react';
import { MONITOR_STRINGS } from '../../i18n/monitorTranslations';
import type { AuditAction, AuditLogEntry, Language } from '../../types/tracker';

interface AuditLogSectionProps {
  auditLog: AuditLogEntry[];
  language: Language;
}

const ACTION_BADGE_STYLES: Record<AuditAction, string> = {
  created: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  updated: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  imported: 'bg-sky-50 text-sky-800 border-sky-200',
  reset: 'bg-amber-50 text-amber-900 border-amber-200',
};

function formatAuditTimestamp(iso: string, language: Language): string {
  try {
    const dt = new Date(iso);
    return dt.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function AuditLogSection({ auditLog, language }: AuditLogSectionProps) {
  const t = MONITOR_STRINGS[language].audit;
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <History className="w-4 h-4 text-slate-600" aria-hidden="true" />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              {t.title}{' '}
              <span className="ml-1.5 text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 tabular-nums">
                {auditLog.length}
              </span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">{t.subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
        >
          <span>{expanded ? t.hideLog : t.showLog}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="overflow-x-auto">
          {auditLog.length === 0 ? (
            <div className="px-5 py-8 text-center text-xs text-slate-500">{t.emptyLog}</div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="px-4 py-2.5 whitespace-nowrap">{t.colTimestamp}</th>
                  <th className="px-4 py-2.5 whitespace-nowrap">{t.colAction}</th>
                  <th className="px-4 py-2.5 whitespace-nowrap">{t.colJurisdiction}</th>
                  <th className="px-4 py-2.5">{t.colRecord}</th>
                  <th className="px-4 py-2.5">{t.colSummary}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLog.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-600 whitespace-nowrap tabular-nums">
                      {formatAuditTimestamp(item.timestamp, language)}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md border text-[11px] font-semibold ${
                          ACTION_BADGE_STYLES[item.action]
                        }`}
                      >
                        {t.actions[item.action]}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-700 font-medium whitespace-nowrap">
                      {item.jurisdiction[language]}
                    </td>
                    <td className="px-4 py-2.5 text-slate-900 font-semibold max-w-xs truncate">
                      {item.entryTitle[language]}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 font-mono text-[11px]">
                      {item.summary[language]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}
