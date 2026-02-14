// ===== Signature-Based Behavioral Memory System =====
// Notes are keyed by day signature (干支), not calendar date.
// The same signature repeats every 60 days, allowing pattern recall.

import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './chinese-calendar';

export const MISTAKE_TAGS = [
  'Self-Punishment',
  'Spent money emotionally',
  'Trusted too fast',
  'Conflict',
  'Impulsive decision',
  'Social approval seeking',
  'Avoided responsibility',
] as const;

export type MistakeTag = typeof MISTAKE_TAGS[number];

export interface SignatureEntry {
  id: string;
  date: string; // YYYY-MM-DD when logged
  tag: MistakeTag;
  text?: string;
  createdAt: number;
}

export interface DaySignatureData {
  id: string; // e.g. "戊午"
  entries: SignatureEntry[];
}

// Calculate day signature (干支) from a Date
export function getDaySignature(date: Date): string {
  const ref = new Date(2000, 0, 1);
  const diff = Math.floor((date.getTime() - ref.getTime()) / 86400000);
  const cycle = (((diff % 60) + 60) % 60 + 54) % 60; // Jan 1, 2000 = 戊午 (index 54)
  const stem = HEAVENLY_STEMS[cycle % 10];
  const branch = EARTHLY_BRANCHES[cycle % 12];
  return `${stem}${branch}`;
}

// Storage key
const STORAGE_KEY = 'zodiac-signature-store';

// Load all signature data
export function loadSignatureStore(): Record<string, DaySignatureData> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Save store
export function saveSignatureStore(store: Record<string, DaySignatureData>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// Get entries for a specific signature
export function getSignatureEntries(signature: string): SignatureEntry[] {
  const store = loadSignatureStore();
  return store[signature]?.entries || [];
}

// Add entry to a signature
export function addSignatureEntry(signature: string, tag: MistakeTag, text?: string, date?: string): SignatureEntry {
  const store = loadSignatureStore();
  if (!store[signature]) {
    store[signature] = { id: signature, entries: [] };
  }
  const entry: SignatureEntry = {
    id: Date.now().toString(),
    date: date || new Date().toISOString().slice(0, 10),
    tag,
    text: text?.trim() || undefined,
    createdAt: Date.now(),
  };
  store[signature].entries.push(entry);
  saveSignatureStore(store);
  return entry;
}

// Delete an entry
export function deleteSignatureEntry(signature: string, entryId: string) {
  const store = loadSignatureStore();
  if (store[signature]) {
    store[signature].entries = store[signature].entries.filter(e => e.id !== entryId);
    if (store[signature].entries.length === 0) {
      delete store[signature];
    }
    saveSignatureStore(store);
  }
}

// Analyze pattern for a signature
export function analyzeSignature(entries: SignatureEntry[]) {
  if (entries.length === 0) return null;

  // Count tags
  const tagCounts: Record<string, number> = {};
  entries.forEach(e => {
    tagCounts[e.tag] = (tagCounts[e.tag] || 0) + 1;
  });

  // Most common tag
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const topTag = sortedTags[0]?.[0] || '';

  // Count negative logs (all entries are behavioral logs)
  const totalLogs = entries.length;

  // Last 3 entries
  const lastThree = [...entries].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);

  return {
    totalLogs,
    topTag,
    tagCounts: sortedTags,
    lastThree,
  };
}

// Check if a signature has any entries (for dot indicator on calendar)
export function signatureHasEntries(signature: string): boolean {
  const store = loadSignatureStore();
  return (store[signature]?.entries.length || 0) > 0;
}
