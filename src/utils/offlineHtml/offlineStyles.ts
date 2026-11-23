/**
 * Self-contained CSS stylesheet embedded into the single-file offline HTML export.
 * Zero external font/CDN imports — 100% compatible with offline file:// execution.
 */
export const OFFLINE_EXPORT_CSS = `
:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface-muted: #f1f5f9;
  --border: #e2e8f0;
  --border-strong: #cbd5e1;
  --text: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --indigo: #4338ca;
  --indigo-dark: #312e81;
  --indigo-bg: #eef2ff;
  --indigo-border: #c7d2fe;
  --emerald: #059669;
  --emerald-bg: #ecfdf5;
  --emerald-border: #a7f3d0;
  --amber: #d97706;
  --amber-bg: #fffbeb;
  --amber-border: #fde68a;
  --rose: #e11d48;
  --rose-bg: #fff1f2;
  --rose-border: #fecdd3;
  --slate-dark: #0f172a;
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.16);
  --radius: 12px;
  --radius-sm: 8px;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

button, input, select {
  font-family: inherit;
  font-size: inherit;
}

button { cursor: pointer; }

.tabular-nums { font-variant-numeric: tabular-nums; }

/* Layout Shell */
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0 10px;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #0f172a;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}

.brand-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
}

.brand-sub {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--text-muted);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.offline-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 8px;
  background: var(--emerald-bg);
  border: 1px solid var(--emerald-border);
  color: #065f46;
  font-size: 11px;
  font-weight: 600;
}

.lang-switch {
  display: inline-flex;
  background: var(--surface-muted);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 2px;
}

.lang-btn {
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
}

.lang-btn.active {
  background: #0f172a;
  color: #ffffff;
}

.nav-tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding-top: 2px;
}

.tab-btn {
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 14px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: color 0.15s, border-color 0.15s;
}

.tab-btn:hover { color: var(--text); }

.tab-btn.active {
  color: var(--indigo);
  border-bottom-color: var(--indigo);
}

/* Main */
.main-content {
  flex: 1;
  padding: 24px 0 40px;
}

.section-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Cards & Surfaces */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}

.card-pad { padding: 18px 20px; }

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.kpi-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  box-shadow: var(--shadow-sm);
}

.kpi-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.kpi-value {
  margin-top: 6px;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  line-height: 1.15;
}

.kpi-value-sm {
  font-size: 17px;
  line-height: 1.25;
}

.kpi-sub {
  margin-top: 5px;
  font-size: 12px;
  color: var(--text-muted);
}

.split-bar {
  display: flex;
  height: 7px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--surface-muted);
  margin-top: 8px;
}

/* Filter Bar & Controls */
.scope-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.scope-pill {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}

.scope-pill:hover {
  border-color: var(--border-strong);
  color: var(--text);
}

.scope-pill.active {
  background: #0f172a;
  border-color: #0f172a;
  color: #ffffff;
}

.scope-count {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.2);
}

.scope-pill.active .scope-count {
  background: rgba(255, 255, 255, 0.18);
  color: #f8fafc;
}

.search-wrap {
  position: relative;
  margin-top: 12px;
}

.search-input {
  width: 100%;
  padding: 10px 38px 10px 14px;
  border: 1px solid var(--border-strong);
  border-radius: 9px;
  background: var(--surface);
  color: var(--text);
  font-size: 13.5px;
  outline: none;
}

.search-input:focus {
  border-color: var(--indigo);
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.12);
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: var(--surface-muted);
  color: var(--text-secondary);
  border-radius: 6px;
  width: 24px;
  height: 24px;
  font-weight: 700;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.filter-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
}

.select-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-size: 12.5px;
}

.select-input:focus {
  outline: none;
  border-color: var(--indigo);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  padding: 7px 12px;
  border: 1px solid var(--border-strong);
  background: var(--surface);
  color: var(--text-secondary);
  transition: all 0.15s;
}

.btn:hover {
  background: var(--surface-muted);
  color: var(--text);
}

.btn-primary {
  background: var(--indigo);
  border-color: var(--indigo);
  color: #ffffff;
}

.btn-primary:hover {
  background: var(--indigo-dark);
  color: #ffffff;
}

.btn-dark {
  background: #0f172a;
  border-color: #0f172a;
  color: #ffffff;
}

.btn-dark:hover {
  background: #1e293b;
  color: #ffffff;
}

.btn-sm {
  font-size: 12px;
  padding: 5px 10px;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.results-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary);
}

/* Resource Cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.res-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.res-card.selected {
  border-color: var(--indigo);
  box-shadow: 0 0 0 2px rgba(67, 56, 202, 0.15);
}

.res-meta-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.jurisdiction-line {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.country-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  font-weight: 700;
  background: var(--surface-muted);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 1px 6px;
  border-radius: 5px;
}

.res-title {
  margin: 0;
  font-size: 15.5px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text);
}

.res-issuer {
  font-size: 12.5px;
  color: var(--text-secondary);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

/* Status & Risk Chips */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  white-space: nowrap;
}

.st-active_guidance { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
.st-court_rule_order { background: #eef2ff; color: #3730a3; border-color: #c7d2fe; }
.st-enacted_law { background: #1e293b; color: #ffffff; border-color: #0f172a; }
.st-pending_bill { background: #fffbeb; color: #92400e; border-color: #fde68a; }
.st-died_bill { background: #fff1f2; color: #9f1239; border-color: #fecdd3; }

.badge-muted {
  background: var(--surface-muted);
  color: var(--text-secondary);
  border-color: var(--border);
}

.badge-mt {
  background: #fefce8;
  color: #854d0e;
  border-color: #fef08a;
}

.risk-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.risk-chip {
  border: 1px solid var(--border);
  background: #f8fafc;
  color: #334155;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  transition: background 0.12s;
}

.risk-chip:hover { filter: brightness(0.95); }

.rc-hallucinations { background: #fff1f2; color: #9f1239; border-color: #fecdd3; }
.rc-confidentiality_leakage { background: #fffbeb; color: #92400e; border-color: #fde68a; }
.rc-bias_perpetuation { background: #faf5ff; color: #6b21a8; border-color: #e9d5ff; }
.rc-absence_transparency_trust { background: #f0f9ff; color: #075985; border-color: #bae6fd; }
.rc-diminished_human_judgment { background: #eef2ff; color: #3730a3; border-color: #c7d2fe; }
.rc-problematic_billing { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
.rc-ip_infringement { background: #fdf4ff; color: #86198f; border-color: #f5d0fe; }
.rc-rapid_tech_change { background: #f1f5f9; color: #334155; border-color: #cbd5e1; }
.rc-cybersecurity_risks { background: #fef2f2; color: #991b1b; border-color: #fecaca; }
.rc-ai_fabricated_evidence { background: #fff7ed; color: #9a3412; border-color: #fed7aa; }
.rc-lack_data_oversight { background: #ecfeff; color: #155e75; border-color: #a5f3fc; }
.rc-inaccurate_misleading_info { background: #fefce8; color: #854d0e; border-color: #fef08a; }
.rc-ambiguous_regulatory_landscape { background: #f4f4f5; color: #3f3f46; border-color: #d4d4d8; }
.rc-manipulation { background: #fdf2f8; color: #9d174d; border-color: #fbcfe8; }
.rc-environmental_degradation { background: #f0fdfa; color: #115e59; border-color: #99f6e4; }

.section-mini-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  margin: 0 0 6px;
}

.rec-list {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12.8px;
  color: #334155;
}

.card-footer {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--surface-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.link-btn {
  border: 0;
  background: transparent;
  color: var(--indigo);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 0;
}

.link-btn:hover { text-decoration: underline; }

/* Compare Dock & Modal */
.compare-dock {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  background: #0f172a;
  color: #ffffff;
  border-top: 1px solid #334155;
  box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.25);
  padding: 12px 20px;
}

.dock-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.dock-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.dock-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #f8fafc;
  padding: 4px 8px;
  border-radius: 7px;
  font-size: 12px;
  max-width: 240px;
}

.dock-chip-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dock-chip-x {
  border: 0;
  background: transparent;
  color: #94a3b8;
  font-weight: 700;
  padding: 0 2px;
}

.dock-chip-x:hover { color: #ffffff; }

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-panel {
  background: var(--surface);
  border-radius: 14px;
  width: 100%;
  max-width: 1180px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.modal-body {
  padding: 18px 20px;
  overflow: auto;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.compare-table th, .compare-table td {
  border: 1px solid var(--border);
  padding: 12px;
  vertical-align: top;
  text-align: left;
}

.compare-table th {
  background: #f8fafc;
  font-weight: 700;
}

.compare-row-label {
  width: 170px;
  font-weight: 700;
  color: var(--text-secondary);
  background: #f8fafc;
}

.shared-tag {
  font-size: 10px;
  font-weight: 700;
  background: var(--indigo);
  color: #ffffff;
  padding: 1px 5px;
  border-radius: 4px;
  margin-left: 4px;
}

/* Tab 2 Analytics */
.caveat-banner {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: var(--radius);
  padding: 16px 20px;
}

.caveat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.caveat-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #78350f;
}

.caveat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 12px;
}

.caveat-box {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #fde68a;
  border-radius: 9px;
  padding: 12px 14px;
}

.caveat-box h4 {
  margin: 0 0 5px;
  font-size: 12.5px;
  font-weight: 700;
  color: #78350f;
}

.caveat-box p {
  margin: 0;
  font-size: 12.2px;
  color: #451a03;
  line-height: 1.5;
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.chart-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

.chart-sub {
  margin: 3px 0 0;
  font-size: 12.5px;
  color: var(--text-muted);
}

.seg-toggle {
  display: inline-flex;
  background: var(--surface-muted);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 2px;
  flex-wrap: wrap;
}

.seg-btn {
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 6px;
}

.seg-btn.active {
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-sm);
}

.legend-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
  font-size: 11.5px;
  color: var(--text-secondary);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

/* Regional Summary Strip */
.region-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.region-card {
  border: 1px solid var(--border);
  background: #f8fafc;
  border-radius: 9px;
  padding: 10px 12px;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
}

.region-card:hover {
  border-color: var(--indigo);
  background: var(--indigo-bg);
}

.region-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.region-val {
  margin-top: 3px;
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}

/* Horizontal Stacked Bars (Geo & Risks) */
.hbar-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hbar-row {
  display: grid;
  grid-template-columns: 220px 1fr 90px;
  align-items: center;
  gap: 12px;
  padding: 4px 6px;
  border-radius: 7px;
  transition: background 0.12s;
}

.hbar-row:hover { background: #f8fafc; }

.hbar-label-btn {
  border: 0;
  background: transparent;
  text-align: left;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
  padding: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hbar-label-btn:hover { color: var(--indigo); }

.hbar-track {
  height: 20px;
  background: var(--surface-muted);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  width: 100%;
}

.hbar-seg {
  height: 100%;
  border: 0;
  padding: 0;
  transition: opacity 0.12s;
}

.hbar-seg:hover { opacity: 0.82; }

.hbar-val {
  text-align: right;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.na-divider {
  margin: 14px 0 10px;
  padding-top: 12px;
  border-top: 1px dashed var(--border-strong);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

/* SVG Timeline Chart */
.svg-wrap {
  width: 100%;
  overflow-x: auto;
}

.timeline-svg {
  width: 100%;
  min-width: 600px;
  height: auto;
  display: block;
}

.svg-bar-rect {
  cursor: pointer;
  transition: opacity 0.12s;
}

.svg-bar-rect:hover { opacity: 0.82; }

/* Heatmap Matrix */
.heatmap-scroll {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 10px;
}

.heatmap-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 11.5px;
}

.heatmap-table th, .heatmap-table td {
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  padding: 6px 5px;
  text-align: center;
}

.heatmap-table th {
  background: #f8fafc;
  color: var(--text-secondary);
  font-weight: 700;
  vertical-align: bottom;
}

.hm-sticky {
  position: sticky;
  left: 0;
  z-index: 2;
  background: #ffffff;
  text-align: left !important;
  padding: 7px 10px !important;
  min-width: 165px;
  max-width: 210px;
  font-weight: 600;
  border-right: 2px solid var(--border-strong) !important;
}

.heatmap-table thead .hm-sticky {
  background: #f8fafc;
  z-index: 3;
}

.hm-na-col {
  border-left: 2px dashed var(--border-strong) !important;
}

.hm-cell-btn {
  width: 100%;
  min-width: 38px;
  height: 30px;
  border: 0;
  border-radius: 5px;
  font-size: 11.5px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s;
}

.hm-cell-btn:hover { transform: scale(1.06); }

.hm-cell-zero {
  color: #cbd5e1;
  font-size: 11px;
}

.hm-col-head {
  font-size: 10.5px;
  line-height: 1.25;
  min-width: 58px;
  max-width: 78px;
  word-break: break-word;
}

.hm-col-total {
  display: inline-block;
  margin-top: 3px;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--surface-muted);
  color: var(--text-secondary);
}

/* Floating Tooltip */
.floating-tooltip {
  position: fixed;
  z-index: 70;
  pointer-events: none;
  background: #0f172a;
  color: #f8fafc;
  border: 1px solid #334155;
  border-radius: 9px;
  padding: 9px 12px;
  font-size: 12px;
  box-shadow: var(--shadow-lg);
  max-width: 290px;
  display: none;
}

/* Slide-Over Drill-Down Drawer */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 55;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  width: 100%;
  max-width: 560px;
  height: 100%;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
}

.drawer-header {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drawer-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.drawer-item {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Stage 3 Legislative Monitor */
.stage3-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.btn-danger {
  background: var(--rose-bg);
  border-color: var(--rose-border);
  color: #9f1239;
}

.btn-danger:hover {
  background: #ffe4e6;
  color: #881337;
}

.btn-danger-solid {
  background: #e11d48;
  border-color: #e11d48;
  color: #ffffff;
}

.btn-danger-solid:hover {
  background: #be123c;
  color: #ffffff;
}

.watchlist-items {
  max-height: 520px;
  overflow-y: auto;
  border-top: 1px solid var(--border);
}

.watchlist-row {
  padding: 14px 18px;
  border-bottom: 1px solid var(--surface-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.watchlist-row:hover { background: #f8fafc; }

.watchlist-main {
  flex: 1;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.form-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.text-input, .textarea-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-size: 13px;
}

.text-input:focus, .textarea-input:focus {
  outline: none;
  border-color: var(--indigo);
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.12);
}

.fieldset-block {
  border: 0;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fieldset-legend {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
  padding-bottom: 4px;
  width: 100%;
}

.risk-check-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
}

.risk-check-item {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 7px 9px;
  font-size: 11.5px;
  cursor: pointer;
  background: #ffffff;
}

.risk-check-item.checked {
  background: var(--indigo-bg);
  border-color: var(--indigo-border);
  color: var(--indigo-dark);
  font-weight: 600;
}

.rec-pair-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid var(--border);
}

.audit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.audit-table th, .audit-table td {
  padding: 9px 12px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  vertical-align: top;
}

.audit-table th {
  background: #f8fafc;
  color: var(--text-secondary);
  font-weight: 700;
}

.act-created { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
.act-updated { background: #eef2ff; color: #3730a3; border-color: #c7d2fe; }
.act-imported { background: #f0f9ff; color: #075985; border-color: #bae6fd; }
.act-reset { background: #fffbeb; color: #92400e; border-color: #fde68a; }

.offline-notice-box {
  background: var(--amber-bg);
  border: 1px solid var(--amber-border);
  border-radius: 10px;
  padding: 14px 16px;
  color: #78350f;
  font-size: 12.5px;
}

.alert-error {
  background: var(--rose-bg);
  border: 1px solid var(--rose-border);
  color: #9f1239;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12.5px;
  font-weight: 600;
}

/* Footer */
.site-footer {
  border-top: 1px solid var(--border);
  background: var(--surface);
  padding: 16px 0;
  margin-top: auto;
}

.site-footer.has-dock { padding-bottom: 84px; }

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--text-muted);
}

.count-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 8px;
  background: var(--emerald-bg);
  border: 1px solid var(--emerald-border);
  color: #065f46;
}

/* Toast */
.toast {
  position: fixed;
  top: 76px;
  right: 20px;
  z-index: 80;
  background: #0f172a;
  color: #ffffff;
  border: 1px solid #334155;
  border-radius: 9px;
  padding: 10px 14px;
  font-size: 12.5px;
  font-weight: 600;
  box-shadow: var(--shadow-lg);
}

/* Error Fallback */
.error-panel {
  max-width: 720px;
  margin: 40px auto;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 12px;
  padding: 20px;
  color: #881337;
}

.error-panel pre {
  background: #ffffff;
  border: 1px solid #fecdd3;
  padding: 12px;
  border-radius: 8px;
  overflow: auto;
  font-size: 12px;
}

@media (max-width: 960px) {
  .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .filter-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .filter-grid-3 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .cards-grid { grid-template-columns: 1fr; }
  .caveat-grid { grid-template-columns: 1fr; }
  .region-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .stage3-grid { grid-template-columns: 1fr; }
  .hbar-row { grid-template-columns: 150px 1fr 78px; }
  .form-grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .form-grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .risk-check-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 600px) {
  .kpi-grid { grid-template-columns: 1fr; }
  .filter-grid { grid-template-columns: 1fr; }
  .region-strip { grid-template-columns: 1fr; }
  .hbar-row { grid-template-columns: 125px 1fr 70px; }
  .form-grid-4, .form-grid-3, .form-grid-2 { grid-template-columns: 1fr; }
  .risk-check-grid { grid-template-columns: 1fr; }
  .rec-pair-row { grid-template-columns: 1fr; }
}
`;
