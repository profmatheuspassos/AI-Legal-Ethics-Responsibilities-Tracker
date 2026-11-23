import { useCallback, useEffect, useMemo, useState } from 'react';
import { EXPECTED_INITIAL_COUNT, INITIAL_TRACKER_ENTRIES } from '../data';
import type { ActiveTab, AuditLogEntry, Language, TrackerEntry } from '../types/tracker';
import { computeBaselineDiffStats, summarizeEntryChanges } from '../utils/trackerBackup';

export const STORAGE_KEY_ENTRIES = 'ai_legal_ethics_tracker_v1';
export const STORAGE_KEY_LANGUAGE = 'ai_legal_ethics_tracker_lang_v1';
export const STORAGE_KEY_AUDIT = 'ai_legal_ethics_audit_v1';

declare global {
  interface Window {
    __EMBEDDED_TRACKER_DATA__?: TrackerEntry[];
    __EMBEDDED_TRACKER_LANG__?: Language;
    __EMBEDDED_TRACKER_AUDIT__?: AuditLogEntry[];
  }
}

function safeReadLocalStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWriteLocalStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or strict file:// security errors gracefully
  }
}

function createAuditId(): string {
  return `aud_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function loadInitialEntries(): TrackerEntry[] {
  const storedRaw = safeReadLocalStorage(STORAGE_KEY_ENTRIES);
  if (storedRaw) {
    try {
      const parsed = JSON.parse(storedRaw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id && parsed[0]?.jurisdiction) {
        return parsed as TrackerEntry[];
      }
    } catch {
      // Fall back to embedded or bundled initial entries
    }
  }

  if (
    typeof window !== 'undefined' &&
    Array.isArray(window.__EMBEDDED_TRACKER_DATA__) &&
    window.__EMBEDDED_TRACKER_DATA__.length > 0
  ) {
    return window.__EMBEDDED_TRACKER_DATA__;
  }

  return INITIAL_TRACKER_ENTRIES;
}

function loadInitialAuditLog(): AuditLogEntry[] {
  const storedRaw = safeReadLocalStorage(STORAGE_KEY_AUDIT);
  if (storedRaw) {
    try {
      const parsed = JSON.parse(storedRaw);
      if (Array.isArray(parsed)) {
        return parsed as AuditLogEntry[];
      }
    } catch {
      // Fall back cleanly
    }
  }

  if (typeof window !== 'undefined' && Array.isArray(window.__EMBEDDED_TRACKER_AUDIT__)) {
    return window.__EMBEDDED_TRACKER_AUDIT__;
  }

  return [];
}

function loadInitialLanguage(): Language {
  const stored = safeReadLocalStorage(STORAGE_KEY_LANGUAGE);
  if (stored === 'pt' || stored === 'en') {
    return stored;
  }
  if (
    typeof window !== 'undefined' &&
    (window.__EMBEDDED_TRACKER_LANG__ === 'pt' || window.__EMBEDDED_TRACKER_LANG__ === 'en')
  ) {
    return window.__EMBEDDED_TRACKER_LANG__;
  }
  return 'pt';
}

export function useTrackerStore() {
  const [entries, setEntriesState] = useState<TrackerEntry[]>(loadInitialEntries);
  const [auditLog, setAuditLogState] = useState<AuditLogEntry[]>(loadInitialAuditLog);
  const [language, setLanguageState] = useState<Language>(loadInitialLanguage);
  const [activeTab, setActiveTab] = useState<ActiveTab>('explorer');
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);

  useEffect(() => {
    document.documentElement.lang = language;
    safeWriteLocalStorage(STORAGE_KEY_LANGUAGE, language);
  }, [language]);

  const baselineStats = useMemo(() => computeBaselineDiffStats(entries), [entries]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const appendAudit = useCallback((entry: AuditLogEntry) => {
    setAuditLogState((prev) => {
      const next = [entry, ...prev].slice(0, 200);
      safeWriteLocalStorage(STORAGE_KEY_AUDIT, JSON.stringify(next));
      return next;
    });
  }, []);

  const setEntries = useCallback(
    (updater: TrackerEntry[] | ((prev: TrackerEntry[]) => TrackerEntry[])) => {
      setEntriesState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        safeWriteLocalStorage(STORAGE_KEY_ENTRIES, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const upsertEntry = useCallback(
    (saved: TrackerEntry): 'created' | 'updated' => {
      let actionType: 'created' | 'updated' = 'created';
      let previousEntry: TrackerEntry | null = null;

      setEntriesState((prev) => {
        const existingIdx = prev.findIndex((item) => item.id === saved.id);
        let next: TrackerEntry[];
        if (existingIdx !== -1) {
          actionType = 'updated';
          previousEntry = prev[existingIdx];
          next = [...prev];
          next[existingIdx] = saved;
        } else {
          actionType = 'created';
          next = [saved, ...prev];
        }
        safeWriteLocalStorage(STORAGE_KEY_ENTRIES, JSON.stringify(next));
        return next;
      });

      const jurisdictionLabel = {
        pt: saved.jurisdiction.subdivision
          ? `${saved.jurisdiction.country.pt} · ${saved.jurisdiction.subdivision.pt}`
          : saved.jurisdiction.country.pt,
        en: saved.jurisdiction.subdivision
          ? `${saved.jurisdiction.country.en} · ${saved.jurisdiction.subdivision.en}`
          : saved.jurisdiction.country.en,
      };

      appendAudit({
        id: createAuditId(),
        timestamp: new Date().toISOString(),
        action: actionType,
        entryId: saved.id,
        jurisdiction: jurisdictionLabel,
        entryTitle: { pt: saved.resource.title.pt, en: saved.resource.title.en },
        summary: summarizeEntryChanges(previousEntry, saved),
      });

      return actionType;
    },
    [appendAudit]
  );

  const importBackup = useCallback(
    (
      importedEntries: TrackerEntry[],
      importedAuditLog: AuditLogEntry[],
      addedCount: number,
      updatedCount: number
    ) => {
      setEntriesState(importedEntries);
      safeWriteLocalStorage(STORAGE_KEY_ENTRIES, JSON.stringify(importedEntries));

      const importRecord: AuditLogEntry = {
        id: createAuditId(),
        timestamp: new Date().toISOString(),
        action: 'imported',
        entryId: 'backup_import',
        jurisdiction: { pt: 'Base Global', en: 'Global Dataset' },
        entryTitle: {
          pt: `Importação JSON (${importedEntries.length} registros)`,
          en: `JSON Backup Import (${importedEntries.length} records)`,
        },
        summary: {
          pt: `+${addedCount} adicionados · ${updatedCount} atualizados`,
          en: `+${addedCount} added · ${updatedCount} updated`,
        },
      };

      setAuditLogState((prev) => {
        const merged = [importRecord, ...importedAuditLog, ...prev];
        const seen = new Set<string>();
        const deduped: AuditLogEntry[] = [];
        for (const item of merged) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            deduped.push(item);
          }
          if (deduped.length >= 200) break;
        }
        safeWriteLocalStorage(STORAGE_KEY_AUDIT, JSON.stringify(deduped));
        return deduped;
      });
    },
    []
  );

  const resetEntries = useCallback(() => {
    setEntriesState(INITIAL_TRACKER_ENTRIES);
    try {
      window.localStorage.removeItem(STORAGE_KEY_ENTRIES);
    } catch {
      // Ignore
    }
    setSelectedCompareIds([]);

    appendAudit({
      id: createAuditId(),
      timestamp: new Date().toISOString(),
      action: 'reset',
      entryId: 'baseline_119',
      jurisdiction: { pt: 'Base Global', en: 'Global Dataset' },
      entryTitle: {
        pt: `Restauração da Base Original (${EXPECTED_INITIAL_COUNT} registros)`,
        en: `Reset to Original Baseline (${EXPECTED_INITIAL_COUNT} records)`,
      },
      summary: {
        pt: 'Edições locais removidas; base IAPP Out/2026 restaurada',
        en: 'Local edits cleared; IAPP Oct 2026 baseline restored',
      },
    });
  }, [appendAudit]);

  const toggleCompare = useCallback((id: string) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const removeCompare = useCallback((id: string) => {
    setSelectedCompareIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setSelectedCompareIds([]);
  }, []);

  return {
    entries,
    setEntries,
    upsertEntry,
    importBackup,
    resetEntries,
    auditLog,
    baselineStats,
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    selectedCompareIds,
    toggleCompare,
    removeCompare,
    clearCompare,
  };
}
