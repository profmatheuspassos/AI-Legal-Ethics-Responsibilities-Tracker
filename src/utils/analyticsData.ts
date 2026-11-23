import {
  ALL_ISSUER_CATEGORIES,
  ALL_RESOURCE_STATUSES,
  ALL_RISK_CODES,
} from '../i18n/translations';
import type {
  ExplorerFilterState,
  IssuerCategory,
  Language,
  ResourceStatus,
  RiskCode,
  TrackerEntry,
} from '../types/tracker';

export type AnalyticsScope = 'all' | 'non_us' | 'us' | 'europe';

export interface AnalyticsFilterState {
  scope: AnalyticsScope;
  region: string;
  status: 'all' | ResourceStatus;
  issuerCategory: 'all' | IssuerCategory;
}

export const DEFAULT_ANALYTICS_FILTERS: AnalyticsFilterState = {
  scope: 'all',
  region: 'all',
  status: 'all',
  issuerCategory: 'all',
};

export const STATUS_CHART_COLORS: Record<ResourceStatus, string> = {
  active_guidance: '#059669', // emerald-600
  court_rule_order: '#4338ca', // indigo-700
  enacted_law: '#0f172a', // slate-900
  pending_bill: '#d97706', // amber-600
  died_bill: '#e11d48', // rose-600
};

export const ISSUER_CHART_COLORS: Record<IssuerCategory, string> = {
  bar_association: '#3730a3', // indigo-800
  court_judiciary: '#0284c7', // sky-600
  legislature: '#d97706', // amber-600
  government_agency: '#059669', // emerald-600
  international_body: '#7c3aed', // violet-600
  research_institute: '#64748b', // slate-500
};

export const US_FEDERAL_NULL_KEY = '__US_FEDERAL_NULL__';

export interface DrillDownPayload {
  title: { pt: string; en: string };
  entries: TrackerEntry[];
  explorerPatch: Partial<ExplorerFilterState>;
}

export function filterAnalyticsEntries(
  entries: TrackerEntry[],
  filters: AnalyticsFilterState
): TrackerEntry[] {
  return entries.filter((entry) => {
    if (filters.scope === 'non_us' && entry.jurisdiction.countryCode === 'US') {
      return false;
    }
    if (filters.scope === 'us' && entry.jurisdiction.countryCode !== 'US') {
      return false;
    }
    if (filters.scope === 'europe' && entry.jurisdiction.region.en !== 'Europe') {
      return false;
    }
    if (filters.region !== 'all' && entry.jurisdiction.region.en !== filters.region) {
      return false;
    }
    if (filters.status !== 'all' && entry.resource.status !== filters.status) {
      return false;
    }
    if (
      filters.issuerCategory !== 'all' &&
      entry.issuer.category !== filters.issuerCategory
    ) {
      return false;
    }
    return true;
  });
}

export function countActiveAnalyticsFilters(filters: AnalyticsFilterState): number {
  let n = 0;
  if (filters.scope !== 'all') n += 1;
  if (filters.region !== 'all') n += 1;
  if (filters.status !== 'all') n += 1;
  if (filters.issuerCategory !== 'all') n += 1;
  return n;
}

export interface AnalyticsKpis {
  analyzedCount: number;
  totalCount: number;
  analyzedSharePct: number;
  jurisdictionsCount: number;
  subdivisionsCount: number;
  topRiskCode: RiskCode | null;
  topRiskCount: number;
  classifiedRiskCount: number;
  classifiedRiskPct: number;
  naRiskCount: number;
  naRiskPct: number;
}

export function computeAnalyticsKpis(
  slice: TrackerEntry[],
  totalCount: number
): AnalyticsKpis {
  const countries = new Set<string>();
  const subdivisions = new Set<string>();
  const riskCounts = new Map<RiskCode, number>();
  let naRiskCount = 0;

  for (const entry of slice) {
    countries.add(entry.jurisdiction.countryCode);
    if (entry.jurisdiction.subdivision?.en) {
      subdivisions.add(`${entry.jurisdiction.countryCode}::${entry.jurisdiction.subdivision.en}`);
    }
    if (entry.risks.length === 0) {
      naRiskCount += 1;
    } else {
      const seen = new Set<RiskCode>();
      for (const r of entry.risks) {
        if (!seen.has(r.code)) {
          seen.add(r.code);
          riskCounts.set(r.code, (riskCounts.get(r.code) ?? 0) + 1);
        }
      }
    }
  }

  let topRiskCode: RiskCode | null = null;
  let topRiskCount = 0;
  for (const code of ALL_RISK_CODES) {
    const c = riskCounts.get(code) ?? 0;
    if (c > topRiskCount) {
      topRiskCount = c;
      topRiskCode = code;
    }
  }

  const analyzedCount = slice.length;
  const classifiedRiskCount = analyzedCount - naRiskCount;

  return {
    analyzedCount,
    totalCount,
    analyzedSharePct: totalCount > 0 ? (analyzedCount / totalCount) * 100 : 0,
    jurisdictionsCount: countries.size,
    subdivisionsCount: subdivisions.size,
    topRiskCode,
    topRiskCount,
    classifiedRiskCount,
    classifiedRiskPct: analyzedCount > 0 ? (classifiedRiskCount / analyzedCount) * 100 : 0,
    naRiskCount,
    naRiskPct: analyzedCount > 0 ? (naRiskCount / analyzedCount) * 100 : 0,
  };
}

export interface RegionalSummaryItem {
  regionEn: string;
  count: number;
  pct: number;
  entries: TrackerEntry[];
}

export function computeRegionalSummary(slice: TrackerEntry[]): RegionalSummaryItem[] {
  const regions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America'];
  const total = slice.length;
  return regions.map((regionEn) => {
    const matching = slice.filter((e) => e.jurisdiction.region.en === regionEn);
    return {
      regionEn,
      count: matching.length,
      pct: total > 0 ? (matching.length / total) * 100 : 0,
      entries: matching,
    };
  });
}

export interface StackedJurisdictionRow {
  key: string;
  code: string;
  label: string;
  total: number;
  sharePct: number;
  byStatus: Record<ResourceStatus, number>;
  entries: TrackerEntry[];
  subdivisionEn?: string | null;
}

function emptyStatusCounts(): Record<ResourceStatus, number> {
  return {
    active_guidance: 0,
    court_rule_order: 0,
    enacted_law: 0,
    pending_bill: 0,
    died_bill: 0,
  };
}

export function computeGlobalJurisdictionBars(
  slice: TrackerEntry[],
  language: Language,
  excludeUs: boolean
): StackedJurisdictionRow[] {
  const working = excludeUs
    ? slice.filter((e) => e.jurisdiction.countryCode !== 'US')
    : slice;
  const denom = working.length;
  const map = new Map<string, StackedJurisdictionRow>();

  for (const entry of working) {
    const code = entry.jurisdiction.countryCode;
    let row = map.get(code);
    if (!row) {
      row = {
        key: code,
        code,
        label: entry.jurisdiction.country[language],
        total: 0,
        sharePct: 0,
        byStatus: emptyStatusCounts(),
        entries: [],
      };
      map.set(code, row);
    }
    row.total += 1;
    row.byStatus[entry.resource.status] += 1;
    row.entries.push(entry);
  }

  const locale = language === 'pt' ? 'pt-BR' : 'en-US';
  const collator = new Intl.Collator(locale, { sensitivity: 'base' });

  return Array.from(map.values())
    .map((row) => ({
      ...row,
      sharePct: denom > 0 ? (row.total / denom) * 100 : 0,
    }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return collator.compare(a.label, b.label);
    });
}

export function computeUsSubdivisionBars(
  slice: TrackerEntry[],
  language: Language,
  federalNullLabel: string
): StackedJurisdictionRow[] {
  const usEntries = slice.filter((e) => e.jurisdiction.countryCode === 'US');
  const denom = usEntries.length;
  const map = new Map<string, StackedJurisdictionRow>();

  for (const entry of usEntries) {
    const sub = entry.jurisdiction.subdivision;
    const key = sub ? sub.en : US_FEDERAL_NULL_KEY;
    let row = map.get(key);
    if (!row) {
      row = {
        key,
        code: 'US',
        label: sub ? sub[language] : federalNullLabel,
        total: 0,
        sharePct: 0,
        byStatus: emptyStatusCounts(),
        entries: [],
        subdivisionEn: sub ? sub.en : null,
      };
      map.set(key, row);
    }
    row.total += 1;
    row.byStatus[entry.resource.status] += 1;
    row.entries.push(entry);
  }

  const locale = language === 'pt' ? 'pt-BR' : 'en-US';
  const collator = new Intl.Collator(locale, { sensitivity: 'base' });

  return Array.from(map.values())
    .map((row) => ({
      ...row,
      sharePct: denom > 0 ? (row.total / denom) * 100 : 0,
    }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return collator.compare(a.label, b.label);
    });
}

export type TimelineStackBy = 'status' | 'issuer';

export interface TimelineBucket {
  key: string; // '2020' ... '2027' or 'not_specified'
  year: number | null;
  isUndated: boolean;
  total: number;
  segments: {
    key: ResourceStatus | IssuerCategory;
    count: number;
    pctOfBucket: number;
    entries: TrackerEntry[];
  }[];
  entries: TrackerEntry[];
}

const CANONICAL_YEARS = [2020, 2023, 2024, 2025, 2026, 2027];

export function computeChronologicalSeries(
  slice: TrackerEntry[],
  stackBy: TimelineStackBy
): TimelineBucket[] {
  const yearSet = new Set<number>(CANONICAL_YEARS);
  for (const entry of slice) {
    if (entry.resource.year !== null) {
      yearSet.add(entry.resource.year);
    }
  }
  const sortedYears = Array.from(yearSet).sort((a, b) => a - b);

  const buildBucket = (
    key: string,
    year: number | null,
    isUndated: boolean,
    bucketEntries: TrackerEntry[]
  ): TimelineBucket => {
    const segKeys =
      stackBy === 'status' ? ALL_RESOURCE_STATUSES : ALL_ISSUER_CATEGORIES;
    const total = bucketEntries.length;

    const segments = segKeys.map((segKey) => {
      const matching = bucketEntries.filter((e) =>
        stackBy === 'status'
          ? e.resource.status === segKey
          : e.issuer.category === segKey
      );
      return {
        key: segKey,
        count: matching.length,
        pctOfBucket: total > 0 ? (matching.length / total) * 100 : 0,
        entries: matching,
      };
    });

    return {
      key,
      year,
      isUndated,
      total,
      segments,
      entries: bucketEntries,
    };
  };

  const buckets: TimelineBucket[] = sortedYears.map((yr) =>
    buildBucket(
      String(yr),
      yr,
      false,
      slice.filter((e) => e.resource.year === yr)
    )
  );

  buckets.push(
    buildBucket(
      'not_specified',
      null,
      true,
      slice.filter((e) => e.resource.year === null)
    )
  );

  return buckets;
}

export interface RiskIncidenceItem {
  code: RiskCode;
  count: number;
  pct: number;
  entries: TrackerEntry[];
}

export interface RiskIncidenceResult {
  items: RiskIncidenceItem[];
  naCount: number;
  naPct: number;
  naEntries: TrackerEntry[];
  maxCount: number;
}

export function computeRiskIncidence(slice: TrackerEntry[]): RiskIncidenceResult {
  const total = slice.length;
  const map = new Map<RiskCode, TrackerEntry[]>();
  for (const code of ALL_RISK_CODES) {
    map.set(code, []);
  }

  const naEntries: TrackerEntry[] = [];
  for (const entry of slice) {
    if (entry.risks.length === 0) {
      naEntries.push(entry);
    } else {
      const seen = new Set<RiskCode>();
      for (const r of entry.risks) {
        if (!seen.has(r.code)) {
          seen.add(r.code);
          map.get(r.code)?.push(entry);
        }
      }
    }
  }

  const items: RiskIncidenceItem[] = ALL_RISK_CODES.map((code) => {
    const matching = map.get(code) ?? [];
    return {
      code,
      count: matching.length,
      pct: total > 0 ? (matching.length / total) * 100 : 0,
      entries: matching,
    };
  }).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(
    naEntries.length,
    ...items.map((item) => item.count),
    1
  );

  return {
    items,
    naCount: naEntries.length,
    naPct: total > 0 ? (naEntries.length / total) * 100 : 0,
    naEntries,
    maxCount,
  };
}

export type HeatmapRowMode = 'region' | 'countries' | 'us_states';
export type HeatmapColumnKey = RiskCode | 'na_no_risks';

export interface HeatmapCell {
  colKey: HeatmapColumnKey;
  count: number;
  rowPct: number;
  colPct: number;
  entries: TrackerEntry[];
}

export interface HeatmapRow {
  rowKey: string;
  label: string;
  code?: string;
  totalEntries: number;
  explorerPatch: Partial<ExplorerFilterState>;
  cells: Record<HeatmapColumnKey, HeatmapCell>;
}

export interface HeatmapData {
  rows: HeatmapRow[];
  colTotals: Record<HeatmapColumnKey, number>;
  maxCellCount: number;
}

export function computeHeatmapMatrix(
  slice: TrackerEntry[],
  mode: HeatmapRowMode,
  language: Language,
  regionLabels: Record<string, { en: string; pt: string }>,
  federalNullLabel: string
): HeatmapData {
  interface RowGroup {
    rowKey: string;
    label: string;
    code?: string;
    entries: TrackerEntry[];
    explorerPatch: Partial<ExplorerFilterState>;
  }

  let groups: RowGroup[] = [];

  if (mode === 'region') {
    const regions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America'];
    groups = regions.map((regionEn) => ({
      rowKey: regionEn,
      label: regionLabels[regionEn]?.[language] ?? regionEn,
      entries: slice.filter((e) => e.jurisdiction.region.en === regionEn),
      explorerPatch: { region: regionEn },
    }));
  } else if (mode === 'countries') {
    const map = new Map<string, RowGroup>();
    for (const entry of slice) {
      const code = entry.jurisdiction.countryCode;
      let grp = map.get(code);
      if (!grp) {
        grp = {
          rowKey: code,
          label: entry.jurisdiction.country[language],
          code,
          entries: [],
          explorerPatch: { countryCode: code },
        };
        map.set(code, grp);
      }
      grp.entries.push(entry);
    }
    groups = Array.from(map.values())
      .sort((a, b) => b.entries.length - a.entries.length || a.label.localeCompare(b.label))
      .slice(0, 15);
  } else {
    const usSlice = slice.filter((e) => e.jurisdiction.countryCode === 'US');
    const map = new Map<string, RowGroup>();
    for (const entry of usSlice) {
      const sub = entry.jurisdiction.subdivision;
      const key = sub ? sub.en : US_FEDERAL_NULL_KEY;
      let grp = map.get(key);
      if (!grp) {
        grp = {
          rowKey: key,
          label: sub ? sub[language] : federalNullLabel,
          code: 'US',
          entries: [],
          explorerPatch: sub
            ? { countryCode: 'US', subdivision: sub.en }
            : { countryCode: 'US' },
        };
        map.set(key, grp);
      }
      grp.entries.push(entry);
    }
    groups = Array.from(map.values())
      .sort((a, b) => b.entries.length - a.entries.length || a.label.localeCompare(b.label))
      .slice(0, 15);
  }

  const allCols: HeatmapColumnKey[] = [...ALL_RISK_CODES, 'na_no_risks'];
  const colTotals = {} as Record<HeatmapColumnKey, number>;
  for (const col of allCols) colTotals[col] = 0;

  // First pass: accumulate counts per row and column totals within displayed rows
  const intermediate = groups.map((grp) => {
    const cellEntries = {} as Record<HeatmapColumnKey, TrackerEntry[]>;
    for (const col of allCols) cellEntries[col] = [];

    for (const entry of grp.entries) {
      if (entry.risks.length === 0) {
        cellEntries.na_no_risks.push(entry);
        colTotals.na_no_risks += 1;
      } else {
        const seen = new Set<RiskCode>();
        for (const r of entry.risks) {
          if (!seen.has(r.code)) {
            seen.add(r.code);
            cellEntries[r.code].push(entry);
            colTotals[r.code] += 1;
          }
        }
      }
    }
    return { grp, cellEntries };
  });

  let maxCellCount = 0;
  const rows: HeatmapRow[] = intermediate.map(({ grp, cellEntries }) => {
    const totalEntries = grp.entries.length;
    const cells = {} as Record<HeatmapColumnKey, HeatmapCell>;
    for (const col of allCols) {
      const matching = cellEntries[col];
      const count = matching.length;
      if (count > maxCellCount) maxCellCount = count;
      cells[col] = {
        colKey: col,
        count,
        rowPct: totalEntries > 0 ? (count / totalEntries) * 100 : 0,
        colPct: colTotals[col] > 0 ? (count / colTotals[col]) * 100 : 0,
        entries: matching,
      };
    }
    return {
      rowKey: grp.rowKey,
      label: grp.label,
      code: grp.code,
      totalEntries,
      explorerPatch: grp.explorerPatch,
      cells,
    };
  });

  return {
    rows,
    colTotals,
    maxCellCount: Math.max(maxCellCount, 1),
  };
}
