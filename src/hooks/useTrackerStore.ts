import { useCallback, useEffect, useState } from 'react';
import { INITIAL_TRACKER_ENTRIES } from '../data';
import type { ActiveTab, Language, TrackerEntry } from '../types/tracker';

export const STORAGE_KEY_ENTRIES = 'ai_legal_ethics_tracker_v1';
export const STORAGE_KEY_LANGUAGE = 'ai_legal_ethics_tracker_lang_v1';

declare global {
  interface Window {
    __EMBEDDED_TRACKER_DATA__?: TrackerEntry[];
    __EMBEDDED_TRACKER_LANG__?: Language;
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
  const [language, setLanguageState] = useState<Language>(loadInitialLanguage);
  const [activeTab, setActiveTab] = useState<ActiveTab>('explorer');
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);

  useEffect(() => {
    document.documentElement.lang = language;
    safeWriteLocalStorage(STORAGE_KEY_LANGUAGE, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const setEntries = useCallback((updater: TrackerEntry[] | ((prev: TrackerEntry[]) => TrackerEntry[])) => {
    setEntriesState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      safeWriteLocalStorage(STORAGE_KEY_ENTRIES, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetEntries = useCallback(() => {
    setEntriesState(INITIAL_TRACKER_ENTRIES);
    try {
      window.localStorage.removeItem(STORAGE_KEY_ENTRIES);
    } catch {
      // Ignore
    }
  }, []);

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
    resetEntries,
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
