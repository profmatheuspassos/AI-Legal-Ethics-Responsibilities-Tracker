import { CheckCircle2, AlertCircle } from 'lucide-react';
import { EXPECTED_INITIAL_COUNT } from '../data';
import { UI_STRINGS } from '../i18n/translations';
import type { Language } from '../types/tracker';

interface FooterProps {
  loadedCount: number;
  customAddedCount: number;
  modifiedBaselineCount: number;
  language: Language;
  hasBottomDock: boolean;
}

export function Footer({
  loadedCount,
  customAddedCount,
  modifiedBaselineCount,
  language,
  hasBottomDock,
}: FooterProps) {
  const t = UI_STRINGS[language].footer;
  const isComplete = loadedCount >= EXPECTED_INITIAL_COUNT;
  const hasMods = customAddedCount > 0 || modifiedBaselineCount > 0;

  let countDisplay: string;
  if (!hasMods) {
    countDisplay = `${loadedCount} / ${EXPECTED_INITIAL_COUNT}`;
  } else {
    const parts: string[] = [
      `${EXPECTED_INITIAL_COUNT} base`,
    ];
    if (customAddedCount > 0) {
      parts.push(
        language === 'pt'
          ? `+ ${customAddedCount} ${customAddedCount === 1 ? 'customizado' : 'customizados'}`
          : `+ ${customAddedCount} custom`
      );
    }
    if (modifiedBaselineCount > 0) {
      parts.push(
        language === 'pt'
          ? `${modifiedBaselineCount} ${modifiedBaselineCount === 1 ? 'editado' : 'editados'}`
          : `${modifiedBaselineCount} edited`
      );
    }
    countDisplay = `${loadedCount} (${parts.join(' · ')})`;
  }

  return (
    <footer
      className={`bg-white border-t border-slate-200 mt-12 ${
        hasBottomDock ? 'pb-24' : 'pb-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
        <p className="leading-relaxed max-w-3xl">{t.attribution}</p>

        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border font-mono tabular-nums text-xs font-semibold shrink-0 ${
            isComplete
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}
        >
          {isComplete ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
          )}
          <span>
            {t.loadedRecordsLabel}: {countDisplay}
          </span>
        </div>
      </div>
    </footer>
  );
}
