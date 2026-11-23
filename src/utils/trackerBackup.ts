import { EXPECTED_INITIAL_COUNT, INITIAL_TRACKER_ENTRIES } from '../data';
import {
  ALL_ISSUER_CATEGORIES,
  ALL_RESOURCE_STATUSES,
  ALL_RISK_CODES,
  RISK_LABELS,
  STATUS_LABELS,
} from '../i18n/translations';
import type {
  AuditLogEntry,
  IssuerCategory,
  LocalizedText,
  ResourceStatus,
  RiskCode,
  TrackerBackupPayload,
  TrackerEntry,
} from '../types/tracker';

const BASELINE_BY_ID = new Map<string, TrackerEntry>(
  INITIAL_TRACKER_ENTRIES.map((e) => [e.id, e])
);

const BASELINE_SERIALIZED = new Map<string, string>(
  INITIAL_TRACKER_ENTRIES.map((e) => [e.id, canonicalizeEntry(e)])
);

function canonicalizeEntry(entry: TrackerEntry): string {
  return JSON.stringify({
    id: entry.id,
    sourcePage: entry.sourcePage,
    jurisdiction: entry.jurisdiction,
    issuer: entry.issuer,
    resource: entry.resource,
    risks: entry.risks.map((r) => r.code).sort(),
    recommendations: entry.recommendations,
  });
}

export interface BaselineDiffStats {
  baselineCount: number;
  totalActive: number;
  customAddedCount: number;
  modifiedBaselineCount: number;
  totalLocalModifications: number;
  addedIds: Set<string>;
  modifiedIds: Set<string>;
}

export function computeBaselineDiffStats(entries: TrackerEntry[]): BaselineDiffStats {
  const addedIds = new Set<string>();
  const modifiedIds = new Set<string>();

  for (const entry of entries) {
    const baseStr = BASELINE_SERIALIZED.get(entry.id);
    if (!baseStr) {
      addedIds.add(entry.id);
    } else if (canonicalizeEntry(entry) !== baseStr) {
      modifiedIds.add(entry.id);
    }
  }

  return {
    baselineCount: EXPECTED_INITIAL_COUNT,
    totalActive: entries.length,
    customAddedCount: addedIds.size,
    modifiedBaselineCount: modifiedIds.size,
    totalLocalModifications: addedIds.size + modifiedIds.size,
    addedIds,
    modifiedIds,
  };
}

export function getBaselineEntryById(id: string): TrackerEntry | undefined {
  return BASELINE_BY_ID.get(id);
}

export function summarizeEntryChanges(
  previous: TrackerEntry | null,
  next: TrackerEntry
): LocalizedText {
  if (!previous) {
    return {
      pt: `Novo registro adicionado (${STATUS_LABELS[next.resource.status].pt})`,
      en: `New record added (${STATUS_LABELS[next.resource.status].en})`,
    };
  }

  const ptParts: string[] = [];
  const enParts: string[] = [];

  if (previous.resource.status !== next.resource.status) {
    ptParts.push(`${previous.resource.status} -> ${next.resource.status}`);
    enParts.push(`${previous.resource.status} -> ${next.resource.status}`);
  }
  if (
    previous.resource.dateDisplay.pt !== next.resource.dateDisplay.pt ||
    previous.resource.dateDisplay.en !== next.resource.dateDisplay.en ||
    previous.resource.year !== next.resource.year
  ) {
    ptParts.push(`Data: ${next.resource.dateDisplay.pt}`);
    enParts.push(`Date: ${next.resource.dateDisplay.en}`);
  }
  if (
    previous.resource.title.pt !== next.resource.title.pt ||
    previous.resource.title.en !== next.resource.title.en
  ) {
    ptParts.push('Título atualizado');
    enParts.push('Title updated');
  }
  const prevRiskCodes = previous.risks.map((r) => r.code).sort().join(',');
  const nextRiskCodes = next.risks.map((r) => r.code).sort().join(',');
  if (prevRiskCodes !== nextRiskCodes) {
    ptParts.push(`Riscos (${next.risks.length})`);
    enParts.push(`Risks (${next.risks.length})`);
  }
  if (
    JSON.stringify(previous.recommendations) !== JSON.stringify(next.recommendations)
  ) {
    ptParts.push(`Recomendações (${next.recommendations.pt.length})`);
    enParts.push(`Recommendations (${next.recommendations.en.length})`);
  }

  if (ptParts.length === 0) {
    return {
      pt: 'Metadados atualizados',
      en: 'Metadata updated',
    };
  }

  return {
    pt: ptParts.join(' · '),
    en: enParts.join(' · '),
  };
}

export function buildBackupPayload(
  entries: TrackerEntry[],
  auditLog: AuditLogEntry[]
): TrackerBackupPayload {
  return {
    metadata: {
      exportedAt: new Date().toISOString(),
      baseEdition: 'IAPP Oct 2026',
      totalEntries: entries.length,
    },
    entries,
    auditLog,
  };
}

export function downloadJsonBackup(
  entries: TrackerEntry[],
  auditLog: AuditLogEntry[]
): void {
  const payload = buildBackupPayload(entries, auditLog);
  const json = JSON.stringify(payload, null, 2);
  const today = new Date().toISOString().slice(0, 10);
  const filename = `ai-legal-ethics-tracker-backup-${today}.json`;
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function isLocalizedText(value: unknown): value is LocalizedText {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.en === 'string' && typeof v.pt === 'string';
}

function isValidStatus(value: unknown): value is ResourceStatus {
  return typeof value === 'string' && (ALL_RESOURCE_STATUSES as string[]).includes(value);
}

function isValidIssuerCategory(value: unknown): value is IssuerCategory {
  return typeof value === 'string' && (ALL_ISSUER_CATEGORIES as string[]).includes(value);
}

function isValidRiskCode(value: unknown): value is RiskCode {
  return typeof value === 'string' && (ALL_RISK_CODES as string[]).includes(value);
}

function validateAndNormalizeEntry(raw: unknown): TrackerEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.id !== 'string' || !obj.id.trim()) return null;
  if (typeof obj.sourcePage !== 'number' || !Number.isFinite(obj.sourcePage)) return null;

  const jur = obj.jurisdiction as Record<string, unknown> | undefined;
  if (!jur || typeof jur !== 'object') return null;
  if (typeof jur.countryCode !== 'string' || !jur.countryCode.trim()) return null;
  if (!isLocalizedText(jur.country) || !isLocalizedText(jur.region)) return null;
  if (jur.subdivision !== null && jur.subdivision !== undefined && !isLocalizedText(jur.subdivision)) {
    return null;
  }

  const iss = obj.issuer as Record<string, unknown> | undefined;
  if (!iss || typeof iss !== 'object') return null;
  if (!isLocalizedText(iss.name) || !isValidIssuerCategory(iss.category)) return null;

  const res = obj.resource as Record<string, unknown> | undefined;
  if (!res || typeof res !== 'object') return null;
  if (!isLocalizedText(res.title) || !isLocalizedText(res.dateDisplay)) return null;
  if (res.year !== null && (typeof res.year !== 'number' || !Number.isFinite(res.year))) {
    return null;
  }
  if (!isValidStatus(res.status)) return null;

  if (!Array.isArray(obj.risks)) return null;
  const normalizedRisks: TrackerEntry['risks'] = [];
  for (const r of obj.risks) {
    if (!r || typeof r !== 'object') return null;
    const ro = r as Record<string, unknown>;
    if (!isValidRiskCode(ro.code)) return null;
    const label = isLocalizedText(ro.label) ? ro.label : RISK_LABELS[ro.code];
    normalizedRisks.push({ code: ro.code, label: { en: label.en, pt: label.pt } });
  }

  const recs = obj.recommendations as Record<string, unknown> | undefined;
  if (!recs || typeof recs !== 'object') return null;
  if (!Array.isArray(recs.en) || !Array.isArray(recs.pt)) return null;
  if (
    !recs.en.every((x) => typeof x === 'string') ||
    !recs.pt.every((x) => typeof x === 'string')
  ) {
    return null;
  }

  return {
    id: obj.id.trim(),
    sourcePage: obj.sourcePage,
    jurisdiction: {
      countryCode: jur.countryCode.trim().toUpperCase(),
      country: { en: jur.country.en.trim(), pt: jur.country.pt.trim() },
      subdivision: jur.subdivision
        ? { en: jur.subdivision.en.trim(), pt: jur.subdivision.pt.trim() }
        : null,
      region: { en: jur.region.en.trim(), pt: jur.region.pt.trim() },
    },
    issuer: {
      name: { en: iss.name.en.trim(), pt: iss.name.pt.trim() },
      category: iss.category,
    },
    resource: {
      title: { en: res.title.en.trim(), pt: res.title.pt.trim() },
      dateDisplay: { en: res.dateDisplay.en.trim(), pt: res.dateDisplay.pt.trim() },
      year: res.year,
      status: res.status,
      isMachineTranslated: Boolean(res.isMachineTranslated),
    },
    risks: normalizedRisks,
    recommendations: {
      en: recs.en.map((s) => s.trim()).filter(Boolean),
      pt: recs.pt.map((s) => s.trim()).filter(Boolean),
    },
  };
}

export type BackupParseResult =
  | {
      ok: true;
      entries: TrackerEntry[];
      auditLog: AuditLogEntry[];
      addedCount: number;
      updatedCount: number;
      unchangedCount: number;
      totalImported: number;
    }
  | {
      ok: false;
      errorPt: string;
      errorEn: string;
    };

export function parseAndValidateBackupJson(
  rawText: string,
  currentEntries: TrackerEntry[]
): BackupParseResult {
  if (rawText.length > 10 * 1024 * 1024) {
    return {
      ok: false,
      errorPt: 'Arquivo JSON excede o limite de 10 MB.',
      errorEn: 'JSON file exceeds the 10 MB size limit.',
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return {
      ok: false,
      errorPt: 'JSON inválido: não foi possível analisar o arquivo selecionado.',
      errorEn: 'Invalid JSON: could not parse the selected file.',
    };
  }

  let rawEntries: unknown[] | null = null;
  let rawAudit: unknown[] = [];

  if (Array.isArray(parsed)) {
    rawEntries = parsed;
  } else if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.entries)) {
      rawEntries = obj.entries;
    }
    if (Array.isArray(obj.auditLog)) {
      rawAudit = obj.auditLog;
    }
  }

  if (!rawEntries || rawEntries.length === 0) {
    return {
      ok: false,
      errorPt: 'Estrutura inválida: o arquivo deve conter um array não vazio em "entries".',
      errorEn: 'Invalid schema: file must contain a non-empty "entries" array.',
    };
  }

  const validEntries: TrackerEntry[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < rawEntries.length; i++) {
    const normalized = validateAndNormalizeEntry(rawEntries[i]);
    if (!normalized) {
      return {
        ok: false,
        errorPt: `Registro #${i + 1} inválido: verifique os campos obrigatórios (id, jurisdiction, issuer, resource, risks, recommendations em PT e EN).`,
        errorEn: `Invalid record #${i + 1}: check required schema fields (id, jurisdiction, issuer, resource, risks, recommendations in EN and PT).`,
      };
    }
    if (!seenIds.has(normalized.id)) {
      seenIds.add(normalized.id);
      validEntries.push(normalized);
    }
  }

  const currentMap = new Map(currentEntries.map((e) => [e.id, canonicalizeEntry(e)]));
  let addedCount = 0;
  let updatedCount = 0;
  let unchangedCount = 0;

  for (const entry of validEntries) {
    const prev = currentMap.get(entry.id);
    if (!prev) {
      addedCount += 1;
    } else if (prev !== canonicalizeEntry(entry)) {
      updatedCount += 1;
    } else {
      unchangedCount += 1;
    }
  }

  const validAudit: AuditLogEntry[] = rawAudit
    .filter((item): item is AuditLogEntry => {
      if (!item || typeof item !== 'object') return false;
      const a = item as Record<string, unknown>;
      return (
        typeof a.id === 'string' &&
        typeof a.timestamp === 'string' &&
        (a.action === 'created' ||
          a.action === 'updated' ||
          a.action === 'imported' ||
          a.action === 'reset') &&
        typeof a.entryId === 'string' &&
        isLocalizedText(a.jurisdiction) &&
        isLocalizedText(a.entryTitle) &&
        isLocalizedText(a.summary)
      );
    })
    .slice(0, 200);

  return {
    ok: true,
    entries: validEntries,
    auditLog: validAudit,
    addedCount,
    updatedCount,
    unchangedCount,
    totalImported: validEntries.length,
  };
}
