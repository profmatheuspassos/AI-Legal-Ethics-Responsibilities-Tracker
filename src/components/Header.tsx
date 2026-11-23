import { BarChart3, Download, FileSearch, Loader2, Scale, ScrollText } from 'lucide-react';
import { UI_STRINGS } from '../i18n/translations';
import type { ActiveTab, Language } from '../types/tracker';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onExportOfflineHtml: () => void;
  isExporting?: boolean;
}

export function Header({
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
  onExportOfflineHtml,
  isExporting = false,
}: HeaderProps) {
  const t = UI_STRINGS[language];

  const tabs: { id: ActiveTab; label: string; icon: typeof FileSearch }[] = [
    { id: 'explorer', label: t.tabs.explorer, icon: FileSearch },
    { id: 'analytics', label: t.tabs.analytics, icon: BarChart3 },
    { id: 'monitor', label: t.tabs.monitor, icon: ScrollText },
  ];

  return (
    <div className="sticky top-0 z-30">
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-md bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4 text-indigo-300" aria-hidden="true" />
            </div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white truncate">
              {t.appTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onExportOfflineHtml}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-wait text-slate-100 border border-slate-700 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 text-indigo-300 shrink-0 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="w-3.5 h-3.5 text-indigo-300 shrink-0" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {isExporting ? t.exportingOfflineHtml : t.exportOfflineHtml}
              </span>
              <span className="sm:hidden">HTML</span>
            </button>

            <div
              role="group"
              aria-label="Language selector"
              className="inline-flex items-center bg-slate-800 border border-slate-700 rounded-md p-0.5 shrink-0"
            >
              <button
                type="button"
                onClick={() => onLanguageChange('pt')}
                aria-pressed={language === 'pt'}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                  language === 'pt'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                aria-pressed={language === 'en'}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                  language === 'en'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav
        aria-label="Primary navigation"
        className="bg-white border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-2 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                  isActive
                    ? 'border-indigo-700 text-indigo-800'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
