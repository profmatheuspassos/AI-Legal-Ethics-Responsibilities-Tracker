import {
  ISSUER_CATEGORY_LABELS,
  RISK_LABELS,
  STATUS_LABELS,
  UI_STRINGS,
} from '../i18n/translations';
import type {
  ExplorerFilterState,
  Language,
  ResourceStatus,
  RiskCode,
  TrackerEntry,
} from '../types/tracker';

export const DEFAULT_FILTERS: ExplorerFilterState = {
  search: '',
  scope: 'all',
  region: 'all',
  countryCode: 'all',
  subdivision: 'all',
  issuerCategory: 'all',
  status: 'all',
  risk: 'all',
  year: 'all',
  sort: 'country_asc',
};

export const LEGISLATION_STATUSES: ResourceStatus[] = [
  'enacted_law',
  'pending_bill',
  'died_bill',
];

export function isLegislationEntry(entry: TrackerEntry): boolean {
  return LEGISLATION_STATUSES.includes(entry.resource.status);
}

/**
 * Accent- and case-insensitive normalization for bilingual PT/EN search.
 */
function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function matchesFullTextSearch(entry: TrackerEntry, rawQuery: string): boolean {
  const trimmed = rawQuery.trim();
  if (!trimmed) return true;

  const tokens = normalizeText(trimmed).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  const haystackParts: string[] = [
    entry.resource.title.en,
    entry.resource.title.pt,
    entry.issuer.name.en,
    entry.issuer.name.pt,
    entry.jurisdiction.country.en,
    entry.jurisdiction.country.pt,
    entry.jurisdiction.countryCode,
    entry.jurisdiction.region.en,
    entry.jurisdiction.region.pt,
    entry.resource.dateDisplay.en,
    entry.resource.dateDisplay.pt,
    ...entry.risks.flatMap((r) => [r.label.en, r.label.pt, r.code]),
    ...entry.recommendations.en,
    ...entry.recommendations.pt,
  ];

  if (entry.jurisdiction.subdivision) {
    haystackParts.push(entry.jurisdiction.subdivision.en, entry.jurisdiction.subdivision.pt);
  }

  const haystack = normalizeText(haystackParts.join(' '));
  return tokens.every((token) => haystack.includes(token));
}

export function filterAndSortEntries(
  entries: TrackerEntry[],
  filters: ExplorerFilterState,
  language: Language
): TrackerEntry[] {
  const filtered = entries.filter((entry) => {
    // Quick Scope
    if (filters.scope === 'non_us' && entry.jurisdiction.countryCode === 'US') {
      return false;
    }
    if (filters.scope === 'us' && entry.jurisdiction.countryCode !== 'US') {
      return false;
    }
    if (filters.scope === 'europe' && entry.jurisdiction.region.en !== 'Europe') {
      return false;
    }
    if (filters.scope === 'legislation' && !isLegislationEntry(entry)) {
      return false;
    }

    // Region
    if (filters.region !== 'all' && entry.jurisdiction.region.en !== filters.region) {
      return false;
    }

    // Country / Jurisdiction
    if (
      filters.countryCode !== 'all' &&
      entry.jurisdiction.countryCode !== filters.countryCode
    ) {
      return false;
    }

    // Subdivision
    if (filters.subdivision !== 'all') {
      if (!entry.jurisdiction.subdivision) return false;
      if (entry.jurisdiction.subdivision.en !== filters.subdivision) return false;
    }

    // Issuer Category
    if (
      filters.issuerCategory !== 'all' &&
      entry.issuer.category !== filters.issuerCategory
    ) {
      return false;
    }

    // Normative Status
    if (filters.status !== 'all' && entry.resource.status !== filters.status) {
      return false;
    }

    // Risk Category (N/A entries are never hidden unless user explicitly chooses a specific RiskCode)
    if (filters.risk === 'na_no_risks') {
      if (entry.risks.length !== 0) return false;
    } else if (filters.risk !== 'all') {
      if (!entry.risks.some((r) => r.code === filters.risk)) return false;
    }

    // Year
    if (filters.year === 'not_specified') {
      if (entry.resource.year !== null) return false;
    } else if (filters.year !== 'all') {
      const targetYear = Number(filters.year);
      if (entry.resource.year !== targetYear) return false;
    }

    // Full-Text Bilingual Search
    if (!matchesFullTextSearch(entry, filters.search)) {
      return false;
    }

    return true;
  });

  const locale = language === 'pt' ? 'pt-BR' : 'en-US';
  const collator = new Intl.Collator(locale, { sensitivity: 'base', numeric: true });

  return [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case 'country_asc': {
        const c = collator.compare(
          a.jurisdiction.country[language],
          b.jurisdiction.country[language]
        );
        if (c !== 0) return c;
        const subA = a.jurisdiction.subdivision?.[language] ?? '';
        const subB = b.jurisdiction.subdivision?.[language] ?? '';
        const s = collator.compare(subA, subB);
        if (s !== 0) return s;
        return collator.compare(a.resource.title[language], b.resource.title[language]);
      }
      case 'year_desc': {
        const yA = a.resource.year;
        const yB = b.resource.year;
        if (yA === null && yB === null) {
          return collator.compare(
            a.jurisdiction.country[language],
            b.jurisdiction.country[language]
          );
        }
        if (yA === null) return 1;
        if (yB === null) return -1;
        if (yB !== yA) return yB - yA;
        return collator.compare(
          a.jurisdiction.country[language],
          b.jurisdiction.country[language]
        );
      }
      case 'year_asc': {
        const yA = a.resource.year;
        const yB = b.resource.year;
        if (yA === null && yB === null) {
          return collator.compare(
            a.jurisdiction.country[language],
            b.jurisdiction.country[language]
          );
        }
        if (yA === null) return 1;
        if (yB === null) return -1;
        if (yA !== yB) return yA - yB;
        return collator.compare(
          a.jurisdiction.country[language],
          b.jurisdiction.country[language]
        );
      }
      case 'source_page_asc': {
        if (a.sourcePage !== b.sourcePage) return a.sourcePage - b.sourcePage;
        return collator.compare(
          a.jurisdiction.country[language],
          b.jurisdiction.country[language]
        );
      }
      default:
        return 0;
    }
  });
}

export interface KpiMetrics {
  filteredCount: number;
  totalCount: number;
  jurisdictionsCount: number;
  subdivisionsCount: number;
  legislationCount: number;
}

export function computeKpiMetrics(
  filteredEntries: TrackerEntry[],
  totalCount: number
): KpiMetrics {
  const countryCodes = new Set<string>();
  const subdivisions = new Set<string>();
  let legislationCount = 0;

  for (const entry of filteredEntries) {
    countryCodes.add(entry.jurisdiction.countryCode);
    if (entry.jurisdiction.subdivision?.en) {
      subdivisions.add(`${entry.jurisdiction.countryCode}::${entry.jurisdiction.subdivision.en}`);
    }
    if (isLegislationEntry(entry)) {
      legislationCount += 1;
    }
  }

  return {
    filteredCount: filteredEntries.length,
    totalCount,
    jurisdictionsCount: countryCodes.size,
    subdivisionsCount: subdivisions.size,
    legislationCount,
  };
}

export interface CountryOption {
  code: string;
  label: string;
  count: number;
}

export function getCountryOptions(entries: TrackerEntry[], language: Language): CountryOption[] {
  const map = new Map<string, { label: string; count: number }>();
  for (const entry of entries) {
    const code = entry.jurisdiction.countryCode;
    const existing = map.get(code);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(code, { label: entry.jurisdiction.country[language], count: 1 });
    }
  }

  const locale = language === 'pt' ? 'pt-BR' : 'en-US';
  const collator = new Intl.Collator(locale, { sensitivity: 'base' });

  return Array.from(map.entries())
    .map(([code, data]) => ({ code, label: data.label, count: data.count }))
    .sort((a, b) => collator.compare(a.label, b.label));
}

export interface SubdivisionOption {
  valueEn: string;
  label: string;
  count: number;
}

export function getSubdivisionOptions(
  entries: TrackerEntry[],
  countryCode: string,
  language: Language
): SubdivisionOption[] {
  const source =
    countryCode === 'all'
      ? entries
      : entries.filter((e) => e.jurisdiction.countryCode === countryCode);

  const map = new Map<string, { label: string; count: number }>();
  for (const entry of source) {
    const sub = entry.jurisdiction.subdivision;
    if (!sub) continue;
    const existing = map.get(sub.en);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(sub.en, { label: sub[language], count: 1 });
    }
  }

  const locale = language === 'pt' ? 'pt-BR' : 'en-US';
  const collator = new Intl.Collator(locale, { sensitivity: 'base' });

  return Array.from(map.entries())
    .map(([valueEn, data]) => ({ valueEn, label: data.label, count: data.count }))
    .sort((a, b) => collator.compare(a.label, b.label));
}

export function getScopeCounts(entries: TrackerEntry[]) {
  return {
    all: entries.length,
    non_us: entries.filter((e) => e.jurisdiction.countryCode !== 'US').length,
    us: entries.filter((e) => e.jurisdiction.countryCode === 'US').length,
    europe: entries.filter((e) => e.jurisdiction.region.en === 'Europe').length,
    legislation: entries.filter(isLegislationEntry).length,
  };
}

export function countActiveFilters(filters: ExplorerFilterState): number {
  let count = 0;
  if (filters.search.trim()) count += 1;
  if (filters.scope !== 'all') count += 1;
  if (filters.region !== 'all') count += 1;
  if (filters.countryCode !== 'all') count += 1;
  if (filters.subdivision !== 'all') count += 1;
  if (filters.issuerCategory !== 'all') count += 1;
  if (filters.status !== 'all') count += 1;
  if (filters.risk !== 'all') count += 1;
  if (filters.year !== 'all') count += 1;
  return count;
}

export function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) return '';
  const upper = code.toUpperCase();
  const points = [...upper].map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...points);
}

export const STATUS_STYLES: Record<ResourceStatus, string> = {
  active_guidance: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  court_rule_order: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
  enacted_law: 'bg-slate-800 text-white border border-slate-800',
  pending_bill: 'bg-amber-50 text-amber-900 border border-amber-200',
  died_bill: 'bg-rose-50 text-rose-800 border border-rose-200',
};

export const RISK_CHIP_STYLES: Record<RiskCode, string> = {
  hallucinations: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
  confidentiality_leakage: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
  bias_perpetuation: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  absence_transparency_trust: 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100',
  diminished_human_judgment: 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100',
  problematic_billing: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
  ip_infringement: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200 hover:bg-fuchsia-100',
  rapid_tech_change: 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200',
  cybersecurity_risks: 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100',
  ai_fabricated_evidence: 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100',
  lack_data_oversight: 'bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100',
  inaccurate_misleading_info: 'bg-yellow-50 text-yellow-900 border-yellow-200 hover:bg-yellow-100',
  ambiguous_regulatory_landscape: 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200',
  manipulation: 'bg-pink-50 text-pink-800 border-pink-200 hover:bg-pink-100',
  environmental_degradation: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
};

function escapeMarkdownCell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

export function buildComparisonMarkdown(
  entries: TrackerEntry[],
  language: Language,
  bilingualMode: boolean
): string {
  const t = UI_STRINGS[language];
  const headerCols = [
    language === 'pt' ? 'Dimensão' : 'Dimension',
    ...entries.map((e) => escapeMarkdownCell(e.resource.title[language])),
  ];

  const sepRow = headerCols.map(() => '---');

  const formatLoc = (loc: { en: string; pt: string }): string => {
    if (!bilingualMode) return escapeMarkdownCell(loc[language]);
    return `${escapeMarkdownCell(loc.pt)} / ${escapeMarkdownCell(loc.en)}`;
  };

  const jurisdictionRow = [
    `**${t.comparator.rowJurisdiction}**`,
    ...entries.map((e) => {
      const country = formatLoc(e.jurisdiction.country);
      const sub = e.jurisdiction.subdivision ? ` — ${formatLoc(e.jurisdiction.subdivision)}` : '';
      const region = formatLoc(e.jurisdiction.region);
      return `[${e.jurisdiction.countryCode}] ${country}${sub} (${region})`;
    }),
  ];

  const issuerRow = [
    `**${t.comparator.rowIssuer}**`,
    ...entries.map((e) => {
      const name = formatLoc(e.issuer.name);
      const cat = bilingualMode
        ? `${ISSUER_CATEGORY_LABELS[e.issuer.category].pt} / ${ISSUER_CATEGORY_LABELS[e.issuer.category].en}`
        : ISSUER_CATEGORY_LABELS[e.issuer.category][language];
      return `${name} (${cat})`;
    }),
  ];

  const statusDateRow = [
    `**${t.comparator.rowStatusDate}**`,
    ...entries.map((e) => {
      const st = bilingualMode
        ? `${STATUS_LABELS[e.resource.status].pt} / ${STATUS_LABELS[e.resource.status].en}`
        : STATUS_LABELS[e.resource.status][language];
      const dt = formatLoc(e.resource.dateDisplay);
      return `${st} · ${dt} (IAPP p. ${e.sourcePage})`;
    }),
  ];

  const risksRow = [
    `**${t.comparator.rowRisks}**`,
    ...entries.map((e) => {
      if (e.risks.length === 0) return t.card.risksNaInSource;
      return e.risks
        .map((r) =>
          bilingualMode
            ? `${RISK_LABELS[r.code].pt} / ${RISK_LABELS[r.code].en}`
            : r.label[language]
        )
        .map(escapeMarkdownCell)
        .join('; ');
    }),
  ];

  const recsRow = [
    `**${t.comparator.rowRecommendations}**`,
    ...entries.map((e) => {
      if (!bilingualMode) {
        return e.recommendations[language]
          .map((rec, idx) => `${idx + 1}. ${escapeMarkdownCell(rec)}`)
          .join('<br>');
      }
      const ptList = e.recommendations.pt
        .map((rec, idx) => `${idx + 1}. ${escapeMarkdownCell(rec)}`)
        .join('<br>');
      const enList = e.recommendations.en
        .map((rec, idx) => `${idx + 1}. ${escapeMarkdownCell(rec)}`)
        .join('<br>');
      return `**PT:**<br>${ptList}<br><br>**EN:**<br>${enList}`;
    }),
  ];

  const rows = [
    headerCols,
    sepRow,
    jurisdictionRow,
    issuerRow,
    statusDateRow,
    risksRow,
    recsRow,
  ];

  const footerNote =
    language === 'pt'
      ? `\n\n_${UI_STRINGS.pt.footer.attribution}_`
      : `\n\n_${UI_STRINGS.en.footer.attribution}_`;

  return rows.map((row) => `| ${row.join(' | ')} |`).join('\n') + footerNote;
}
