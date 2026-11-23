import { GitCompareArrows, X } from 'lucide-react';
import { UI_STRINGS } from '../i18n/translations';
import type { Language, TrackerEntry } from '../types/tracker';

interface CompareDockProps {
  selectedEntries: TrackerEntry[];
  language: Language;
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpenComparator: () => void;
}

export function CompareDock({
  selectedEntries,
  language,
  onRemove,
  onClear,
  onOpenComparator,
}: CompareDockProps) {
  if (selectedEntries.length === 0) return null;

  const t = UI_STRINGS[language];
  const canCompare = selectedEntries.length >= 2;

  return (
    <div
      role="region"
      aria-label="Jurisdictional comparison dock"
      className="fixed bottom-0 inset-x-0 z-40 bg-slate-900 text-white border-t border-slate-700 shadow-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-slate-300 font-mono tabular-nums mr-1 whitespace-nowrap">
            {t.comparator.dockSelected(selectedEntries.length)}
          </span>

          {selectedEntries.map((entry) => (
            <span
              key={entry.id}
              className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-600 rounded-md px-2.5 py-1 text-xs text-slate-100 max-w-[260px]"
            >
              <span className="font-mono font-bold text-indigo-300 shrink-0">
                {entry.jurisdiction.countryCode}
              </span>
              <span className="truncate">{entry.resource.title[language]}</span>
              <button
                type="button"
                onClick={() => onRemove(entry.id)}
                aria-label={`${t.comparator.removeColumn}: ${entry.resource.title[language]}`}
                className="p-0.5 text-slate-400 hover:text-white rounded cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {!canCompare && (
            <span className="text-xs text-slate-400">{t.comparator.dockHint}</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 justify-end">
          <button
            type="button"
            onClick={onClear}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            {t.comparator.clear}
          </button>

          <button
            type="button"
            onClick={onOpenComparator}
            disabled={!canCompare}
            className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              canCompare
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            <GitCompareArrows className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{t.comparator.compareAction(selectedEntries.length)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
