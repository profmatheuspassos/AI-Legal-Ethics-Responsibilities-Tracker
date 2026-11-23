import type { TrackerEntry } from '../types/tracker';
import lote1NaoEua from './lote-1-nao-eua.json';
import lote2EuaParte1 from './lote-2-eua-parte1.json';
import lote3EuaParte2 from './lote-3-eua-parte2.json';

export const EXPECTED_INITIAL_COUNT = 119;

export const INITIAL_TRACKER_ENTRIES: TrackerEntry[] = [
  ...(lote1NaoEua as TrackerEntry[]),
  ...(lote2EuaParte1 as TrackerEntry[]),
  ...(lote3EuaParte2 as TrackerEntry[]),
];

export const DATASET_BATCH_COUNTS = {
  nonUs: (lote1NaoEua as TrackerEntry[]).length,
  usPart1: (lote2EuaParte1 as TrackerEntry[]).length,
  usPart2: (lote3EuaParte2 as TrackerEntry[]).length,
  total: INITIAL_TRACKER_ENTRIES.length,
} as const;
