import { useMemo, useState } from 'react';
import { ANALYTICS_STRINGS } from '../../i18n/analyticsTranslations';
import {
  ALL_ISSUER_CATEGORIES,
  ALL_RESOURCE_STATUSES,
  ISSUER_CATEGORY_LABELS,
  STATUS_LABELS,
} from '../../i18n/translations';
import type {
  ExplorerFilterState,
  IssuerCategory,
  Language,
  ResourceStatus,
  TrackerEntry,
} from '../../types/tracker';
import {
  computeChronologicalSeries,
  ISSUER_CHART_COLORS,
  STATUS_CHART_COLORS,
  type DrillDownPayload,
  type TimelineBucket,
  type TimelineStackBy,
} from '../../utils/analyticsData';

interface ChronologicalChartProps {
  entries: TrackerEntry[];
  language: Language;
  baseExplorerPatch: Partial<ExplorerFilterState>;
  onDrillDown: (payload: DrillDownPayload) => void;
}

export function ChronologicalChart({
  entries,
  language,
  baseExplorerPatch,
  onDrillDown,
}: ChronologicalChartProps) {
  const [stackBy, setStackBy] = useState<TimelineStackBy>('status');
  const [hovered, setHovered] = useState<{
    bucketLabel: string;
    segmentLabel?: string;
    count: number;
    bucketTotal: number;
    xPct: number;
  } | null>(null);

  const t = ANALYTICS_STRINGS[language].timeline;

  const buckets = useMemo(
    () => computeChronologicalSeries(entries, stackBy),
    [entries, stackBy]
  );

  const maxTotal = useMemo(
    () => Math.max(...buckets.map((b) => b.total), 4),
    [buckets]
  );

  // Nice Y-axis ceiling
  const yCeiling = useMemo(() => {
    if (maxTotal <= 5) return 5;
    if (maxTotal <= 10) return 10;
    const step = maxTotal <= 25 ? 5 : 10;
    return Math.ceil(maxTotal / step) * step;
  }, [maxTotal]);

  const yTicks = useMemo(() => {
    const steps = 4;
    const arr: number[] = [];
    for (let i = 0; i <= steps; i += 1) {
      arr.push(Math.round((yCeiling / steps) * i));
    }
    return arr;
  }, [yCeiling]);

  const legendKeys =
    stackBy === 'status' ? ALL_RESOURCE_STATUSES : ALL_ISSUER_CATEGORIES;

  const getSegmentColor = (key: ResourceStatus | IssuerCategory) =>
    stackBy === 'status'
      ? STATUS_CHART_COLORS[key as ResourceStatus]
      : ISSUER_CHART_COLORS[key as IssuerCategory];

  const getSegmentLabel = (key: ResourceStatus | IssuerCategory) =>
    stackBy === 'status'
      ? STATUS_LABELS[key as ResourceStatus][language]
      : ISSUER_CATEGORY_LABELS[key as IssuerCategory][language];

  const handleClick = (
    bucket: TimelineBucket,
    segmentKey?: ResourceStatus | IssuerCategory
  ) => {
    const matching = segmentKey
      ? bucket.segments.find((s) => s.key === segmentKey)?.entries ?? []
      : bucket.entries;
    if (matching.length === 0) return;

    const ptYear = bucket.isUndated
      ? ANALYTICS_STRINGS.pt.timeline.undatedLabel
      : String(bucket.year);
    const enYear = bucket.isUndated
      ? ANALYTICS_STRINGS.en.timeline.undatedLabel
      : String(bucket.year);

    const ptSeg = segmentKey
      ? ` × ${
          stackBy === 'status'
            ? STATUS_LABELS[segmentKey as ResourceStatus].pt
            : ISSUER_CATEGORY_LABELS[segmentKey as IssuerCategory].pt
        }`
      : '';
    const enSeg = segmentKey
      ? ` × ${
          stackBy === 'status'
            ? STATUS_LABELS[segmentKey as ResourceStatus].en
            : ISSUER_CATEGORY_LABELS[segmentKey as IssuerCategory].en
        }`
      : '';

    const patch: Partial<ExplorerFilterState> = {
      ...baseExplorerPatch,
      year: bucket.isUndated ? 'not_specified' : String(bucket.year),
    };

    if (segmentKey) {
      if (stackBy === 'status') {
        patch.status = segmentKey as ResourceStatus;
      } else {
        patch.issuerCategory = segmentKey as IssuerCategory;
      }
    }

    onDrillDown({
      title: { pt: `${ptYear}${ptSeg}`, en: `${enYear}${enSeg}` },
      entries: matching,
      explorerPatch: patch,
    });
  };

  // SVG Coordinate geometry
  const svgWidth = 680;
  const svgHeight = 290;
  const padLeft = 38;
  const padRight = 20;
  const padTop = 26;
  const padBottom = 46;
  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  // Give extra gap before the rightmost Undated column
  const undatedGap = 24;
  const slotWidth = (chartW - undatedGap) / buckets.length;
  const barWidth = Math.min(48, Math.max(24, slotWidth * 0.56));

  const getColumnX = (idx: number, isUndated: boolean) =>
    padLeft + idx * slotWidth + (isUndated ? undatedGap : 0) + (slotWidth - barWidth) / 2;

  const dividerX =
    padLeft + (buckets.length - 1) * slotWidth + undatedGap / 2;

  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 flex flex-col">
      {/* Header & Stack Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{t.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            {t.stackByLabel}
          </span>
          <div
            role="group"
            aria-label="Stack timeline by"
            className="inline-flex bg-slate-100 border border-slate-200 rounded-md p-0.5"
          >
            <button
              type="button"
              onClick={() => setStackBy('status')}
              aria-pressed={stackBy === 'status'}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                stackBy === 'status'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.stackByStatus}
            </button>
            <button
              type="button"
              onClick={() => setStackBy('issuer')}
              aria-pressed={stackBy === 'issuer'}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                stackBy === 'issuer'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.stackByIssuer}
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
        {legendKeys.map((key) => (
          <span key={key} className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-xs shrink-0"
              style={{ backgroundColor: getSegmentColor(key) }}
              aria-hidden="true"
            />
            <span>{getSegmentLabel(key)}</span>
          </span>
        ))}
      </div>

      {/* SVG Vertical Stacked Column Chart */}
      <div className="relative mt-4 flex-1">
        {hovered && (
          <div
            className="pointer-events-none absolute top-0 z-10 bg-slate-900 text-white text-xs rounded-md px-3 py-1.5 shadow-md whitespace-nowrap font-mono tabular-nums"
            style={{
              left: `${Math.min(Math.max(hovered.xPct, 14), 86)}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <span className="font-sans font-semibold">{hovered.bucketLabel}</span>
            {hovered.segmentLabel && (
              <span className="font-sans text-slate-300"> · {hovered.segmentLabel}</span>
            )}
            <span>: </span>
            <strong className="text-indigo-300">{hovered.count}</strong>
            {hovered.segmentLabel && hovered.bucketTotal > 0 && (
              <span className="text-slate-300">
                {' '}
                ({((hovered.count / hovered.bucketTotal) * 100).toFixed(0)}%)
              </span>
            )}
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
          role="img"
          aria-label={t.title}
        >
          {/* Horizontal gridlines & Y ticks */}
          {yTicks.map((tick) => {
            const y = padTop + chartH - (tick / yCeiling) * chartH;
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  x2={svgWidth - padRight}
                  y1={y}
                  y2={y}
                  stroke={tick === 0 ? '#cbd5e1' : '#f1f5f9'}
                  strokeWidth={1}
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-500 text-[11px] font-mono"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Separator before Undated column */}
          <line
            x1={dividerX}
            x2={dividerX}
            y1={padTop}
            y2={padTop + chartH + 26}
            stroke="#cbd5e1"
            strokeDasharray="4 4"
            strokeWidth={1}
          />

          {/* Columns */}
          {buckets.map((bucket, idx) => {
            const x = getColumnX(idx, bucket.isUndated);
            const centerX = x + barWidth / 2;
            const xPct = (centerX / svgWidth) * 100;
            const bucketLabel = bucket.isUndated ? t.undatedLabel : String(bucket.year);
            const axisLabel = bucket.isUndated ? t.undatedShort : String(bucket.year);

            let currentBottomY = padTop + chartH;

            return (
              <g key={bucket.key}>
                {bucket.segments.map((seg) => {
                  if (seg.count === 0) return null;
                  const segHeight = Math.max((seg.count / yCeiling) * chartH, 2);
                  const segY = currentBottomY - segHeight;
                  currentBottomY = segY;
                  const segLabel = getSegmentLabel(seg.key);

                  return (
                    <rect
                      key={seg.key}
                      x={x}
                      y={segY}
                      width={barWidth}
                      height={segHeight}
                      fill={getSegmentColor(seg.key)}
                      stroke="#ffffff"
                      strokeWidth={0.75}
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                      onClick={() => handleClick(bucket, seg.key)}
                      onMouseEnter={() =>
                        setHovered({
                          bucketLabel,
                          segmentLabel: segLabel,
                          count: seg.count,
                          bucketTotal: bucket.total,
                          xPct,
                        })
                      }
                      onMouseLeave={() => setHovered(null)}
                    />
                  );
                })}

                {/* Column Total Label */}
                {bucket.total > 0 && (
                  <text
                    x={centerX}
                    y={currentBottomY - 6}
                    textAnchor="middle"
                    onClick={() => handleClick(bucket)}
                    onMouseEnter={() =>
                      setHovered({
                        bucketLabel,
                        count: bucket.total,
                        bucketTotal: bucket.total,
                        xPct,
                      })
                    }
                    onMouseLeave={() => setHovered(null)}
                    className="fill-slate-800 text-[11px] font-bold font-mono cursor-pointer hover:fill-indigo-700"
                  >
                    {bucket.total}
                  </text>
                )}

                {/* X-Axis Year / Undated Label */}
                <text
                  x={centerX}
                  y={padTop + chartH + 20}
                  textAnchor="middle"
                  onClick={() => handleClick(bucket)}
                  className={`text-[11px] font-medium cursor-pointer ${
                    bucket.isUndated
                      ? 'fill-slate-500 italic'
                      : 'fill-slate-700 font-mono'
                  }`}
                >
                  {axisLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-1 text-[11px] text-slate-400">{t.clickHint}</div>
    </section>
  );
}
