// ===== Signature-Based Behavioral Memory System =====
// Notes are keyed by day signature (干支), not calendar date.
// The same signature repeats every 60 days, allowing pattern recall.
// Database dependent

import { HEAVENLY_STEMS, EARTHLY_BRANCHES, BaZiProfile, DEFAULT_PROFILE } from './chinese-calendar';

export interface AppStoreData {
  signatures: Record<string, DaySignatureData>;
  profile: BaZiProfile | null;
  customTags?: string[]; // Dynamic behavioral patterns
}

export const MISTAKE_TAGS = [
  'Self-Punishment',
  'Hidden-Intellect',
  'Spent money emotionally',
  'Trusted too fast',
  'Conflict',
  'Impulsive decision',
  'Social approval seeking',
  'Avoided responsibility',
] as const;

export type MistakeTag = string;

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

// Load the entire app store
export function loadAppStore(): AppStoreData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    let store: AppStoreData;

    if (!data) {
      store = { signatures: {}, profile: null };
    } else {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object' && !parsed.signatures && !parsed.profile) {
        // Old format: parsed is Record<string, DaySignatureData>
        store = { signatures: parsed, profile: null, customTags: [...MISTAKE_TAGS] };
      } else {
        store = {
          signatures: parsed.signatures || {},
          profile: parsed.profile || null,
          customTags: parsed.customTags || [...MISTAKE_TAGS]
        };
      }
    }

    // Migration from old separate profile key
    if (store.profile === null) {
      const oldProfileData = localStorage.getItem('bazi-profile');
      if (oldProfileData && oldProfileData !== 'null') {
        try {
          const oldProfile = JSON.parse(oldProfileData);
          if (oldProfile && oldProfile.yearPillar) {
            store.profile = oldProfile;
            // Optionally save it now to the new location
            saveAppStore(store);
            // localStorage.removeItem('bazi-profile'); // Better to wait or leave it for safety
          }
        } catch (e) {
          console.error('Failed to migrate old profile:', e);
        }
      }
    }

    return store;
  } catch {
    return { signatures: {}, profile: null };
  }
}

// Save the entire app store
export function saveAppStore(store: AppStoreData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// Load all signature data (Backward compatibility wrapper)
export function loadSignatureStore(): Record<string, DaySignatureData> {
  return loadAppStore().signatures;
}

// Save store (Backward compatibility wrapper)
export function saveSignatureStore(signatures: Record<string, DaySignatureData>) {
  const store = loadAppStore();
  store.signatures = signatures;
  saveAppStore(store);
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

// --- Custom Tag Management ---

export function loadCustomTags(): string[] {
  const store = loadAppStore();
  if (!store.customTags || store.customTags.length === 0) {
    return [...MISTAKE_TAGS];
  }
  return store.customTags;
}

export function saveCustomTags(tags: string[]) {
  const store = loadAppStore();
  store.customTags = tags;
  saveAppStore(store);
}

export function addCustomTag(tag: string): boolean {
  const tags = loadCustomTags();
  const trimmed = tag.trim();
  if (!trimmed || tags.includes(trimmed)) return false;

  saveCustomTags([...tags, trimmed]);
  return true;
}

export function deleteCustomTag(tag: string) {
  const tags = loadCustomTags();
  saveCustomTags(tags.filter(t => t !== tag));
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

// Export the entire store as a JSON string
export function exportAppStoreJson(): string {
  const store = loadAppStore();
  return JSON.stringify(store, null, 2);
}

// Import data into the app store
export function importAppStoreJson(json: string): boolean {
  try {
    const parsed = JSON.parse(json);

    // 1. Reject if not an object or if it's an array/null
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return false;
    }

    // 2. Validate signatures (must be a plain object if it exists)
    const sigs = parsed.signatures;
    const hasValidSigs = !sigs || (typeof sigs === 'object' && sigs !== null && !Array.isArray(sigs));

    // 3. Validate profile shape (must be null or have the expected pillar structure)
    const prof = parsed.profile;
    let hasValidProf = prof === null || prof === undefined;

    if (prof && typeof prof === 'object' && !Array.isArray(prof)) {
      // Basic shape check for BaZiProfile pillars
      const pillars = ['yearPillar', 'monthPillar', 'dayPillar', 'hourPillar'];
      hasValidProf = pillars.every(p =>
        prof[p] && typeof prof[p] === 'object' &&
        typeof prof[p].stem === 'string' &&
        typeof prof[p].branch === 'string'
      );
    }

    // 4. Validate customTags (must be array of strings if it exists)
    const customTags = parsed.customTags;
    let hasValidTags = !customTags || Array.isArray(customTags);
    if (Array.isArray(customTags)) {
      hasValidTags = customTags.every(t => typeof t === 'string');
    }

    if (hasValidSigs && hasValidProf && hasValidTags) {
      const newStore: AppStoreData = {
        signatures: sigs || {},
        profile: prof || null,
        customTags: customTags || [...MISTAKE_TAGS]
      };

      saveAppStore(newStore);
      return true;
    }

    return false;
  } catch (e) {
    console.error('Failed to import data:', e);
    return false;
  }
}
