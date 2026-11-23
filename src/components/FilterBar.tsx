import { RotateCcw, Search, X } from 'lucide-react';
import {
  ALL_ISSUER_CATEGORIES,
  ALL_RESOURCE_STATUSES,
  ALL_RISK_CODES,
  ISSUER_CATEGORY_LABELS,
  REGION_LABELS,
  RISK_LABELS,
  SORT_LABELS,
  STATUS_LABELS,
  UI_STRINGS,
} from '../i18n/translations';
import type {
  ExplorerFilterState,
  IssuerCategory,
  Language,
  QuickScope,
  ResourceStatus,
  RiskFilterValue,
  SortOption,
} from '../types/tracker';
import type { CountryOption, SubdivisionOption } from '../utils/trackerFilters';

interface FilterBarProps {
  filters: ExplorerFilterState;
  language: Language;
  scopeCounts: {
    all: number;
    non_us: number;
    us: number;
    europe: number;
    legislation: number;
  };
  countryOptions: CountryOption[];
  subdivisionOptions: SubdivisionOption[];
  availableYears: number[];
  activeFilterCount: number;
  onChange: (patch: Partial<ExplorerFilterState>) => void;
  onReset: () => void;
}

const REGION_KEYS = ['North America', 'Europe', 'Asia-Pacific', 'Latin America'] as const;

export function FilterBar({
  filters,
  language,
  scopeCounts,
  countryOptions,
  subdivisionOptions,
  availableYears,
  activeFilterCount,
  onChange,
  onReset,
}: FilterBarProps) {
  const t = UI_STRINGS[language];

  const scopeButtons: { id: QuickScope; label: string; count: number }[] = [
    { id: 'all', label: t.scopes.all, count: scopeCounts.all },
    { id: 'non_us', label: t.scopes.nonUs, count: scopeCounts.non_us },
    { id: 'us', label: t.scopes.us, count: scopeCounts.us },
    { id: 'europe', label: t.scopes.europe, count: scopeCounts.europe },
    { id: 'legislation', label: t.scopes.legislation, count: scopeCounts.legislation },
  ];

  return (
    <section
      aria-label="Search and multi-faceted filters"
      className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 space-y-4"
    >
      {/* Row 1: Instant Full-Text Search + Reset */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder={t.filters.searchPlaceholder}
            aria-label={t.filters.searchAriaLabel}
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none transition-colors"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ search: '' })}
              aria-label={t.filters.clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={activeFilterCount === 0}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 ${
            activeFilterCount > 0
              ? 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer'
              : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{t.filters.clearAll}</span>
          {activeFilterCount > 0 && (
            <span className="font-mono tabular-nums text-indigo-700">({activeFilterCount})</span>
          )}
        </button>
      </div>

      {/* Row 2: Quick Scope Buttons */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Quick scope">
        {scopeButtons.map((scope) => {
          const isActive = filters.scope === scope.id;
          return (
            <button
              key={scope.id}
              type="button"
              onClick={() => onChange({ scope: scope.id })}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{scope.label}</span>
              <span
                className={`font-mono tabular-nums text-[11px] ${
                  isActive ? 'text-indigo-200' : 'text-slate-500'
                }`}
              >
                ({scope.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Row 3: Combinable Faceted Dropdowns + Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-slate-100">
        {/* Region */}
        <div>
          <label
            htmlFor="filter-region"
            className="block text-xs font-medium text-slate-600 mb-1"
          >
            {t.filters.region}
          </label>
          <select
            id="filter-region"
            value={filters.region}
            onChange={(e) => onChange({ region: e.target.value })}
            className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
          >
            <option value="all">{t.filters.allRegions}</option>
            {REGION_KEYS.map((regionKey) => (
              <option key={regionKey} value={regionKey}>
                {REGION_LABELS[regionKey][language]}
              </option>
            ))}
          </select>
        </div>

        {/* Country / Jurisdiction */}
        <div>
          <label
            htmlFor="filter-country"
            className="block text-xs font-medium text-slate-600 mb-1"
          >
            {t.filters.country}
          </label>
          <select
            id="filter-country"
            value={filters.countryCode}
            onChange={(e) =>
              onChange({ countryCode: e.target.value, subdivision: 'all' })
            }
            className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
          >
            <option value="all">{t.filters.allCountries}</option>
            {countryOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label} ({c.count})
              </option>
            ))}
          </select>
        </div>

        {/* State / Subdivision */}
        <div>
          <label
            htmlFor="filter-subdivision"
            className="block text-xs font-medium text-slate-600 mb-1"
          >
            {t.filters.subdivision}
          </label>
          <select
            id="filter-subdivision"
            value={filters.subdivision}
            onChange={(e) => onChange({ subdivision: e.target.value })}
            disabled={subdivisionOptions.length === 0}
            className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="all">{t.filters.allSubdivisions}</option>
            {subdivisionOptions.map((sub) => (
              <option key={sub.valueEn} value={sub.valueEn}>
                {sub.label} ({sub.count})
              </option>
            ))}
          </select>
        </div>

        {/* Issuer Category */}
        <div>
          <label
            htmlFor="filter-issuer"
            className="block text-xs font-medium text-slate-600 mb-1"
          >
            {t.filters.issuerCategory}
          </label>
          <select
            id="filter-issuer"
            value={filters.issuerCategory}
            onChange={(e) =>
              onChange({ issuerCategory: e.target.value as 'all' | IssuerCategory })
            }
            className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
          >
            <option value="all">{t.filters.allIssuerCategories}</option>
            {ALL_ISSUER_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {ISSUER_CATEGORY_LABELS[cat][language]}
              </option>
            ))}
          </select>
        </div>

        {/* Normative Status */}
        <div>
          <label
            htmlFor="filter-status"
            className="block text-xs font-medium text-slate-600 mb-1"
          >
            {t.filters.status}
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) =>
              onChange({ status: e.target.value as 'all' | ResourceStatus })
            }
            className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
          >
            <option value="all">{t.filters.allStatuses}</option>
            {ALL_RESOURCE_STATUSES.map((st) => (
              <option key={st} value={st}>
                {STATUS_LABELS[st][language]}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Category */}
        <div>
          <label
            htmlFor="filter-risk"
            className="block text-xs font-medium text-slate-600 mb-1"
          >
            {t.filters.risk}
          </label>
          <select
            id="filter-risk"
            value={filters.risk}
            onChange={(e) => onChange({ risk: e.target.value as RiskFilterValue })}
            className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
          >
            <option value="all">{t.filters.allRisks}</option>
            <option value="na_no_risks">{t.filters.naRisksOption}</option>
            {ALL_RISK_CODES.map((code) => (
              <option key={code} value={code}>
                {RISK_LABELS[code][language]}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label
            htmlFor="filter-year"
            className="block text-xs font-medium text-slate-600 mb-1"
          >
            {t.filters.year}
          </label>
          <select
            id="filter-year"
            value={filters.year}
            onChange={(e) => onChange({ year: e.target.value })}
            className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
          >
            <option value="all">{t.filters.allYears}</option>
            {availableYears.map((yr) => (
              <option key={yr} value={String(yr)}>
                {yr}
              </option>
            ))}
            <option value="not_specified">{t.filters.yearNotSpecified}</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label
            htmlFor="filter-sort"
            className="block text-xs font-medium text-slate-600 mb-1"
          >
            {t.filters.sortBy}
          </label>
          <select
            id="filter-sort"
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortOption })}
            className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
              <option key={opt} value={opt}>
                {SORT_LABELS[opt][language]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
