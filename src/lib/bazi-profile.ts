import { BaZiProfile, DEFAULT_PROFILE } from './chinese-calendar';
import { loadAppStore, saveAppStore } from './signature-store';

// ===== BaZi Profile Storage =====
// Stores user's Four Pillars for personalized risk analysis
// Database dependent because customize.

export { type BaZiPillar, type BaZiProfile, DEFAULT_PROFILE } from './chinese-calendar';

// Load profile using the shared app store
export function loadProfile(): BaZiProfile | null {
    return loadAppStore().profile;
}

// Save profile to the shared app store
export function saveProfile(profile: BaZiProfile): void {
    const store = loadAppStore();
    store.profile = profile;
    saveAppStore(store);
}

// Get all branches from profile (for risk calculation)
export function getProfileBranches(profile: BaZiProfile | null): string[] {
    if (!profile) return [];
    return [profile.yearPillar.branch, profile.monthPillar.branch, profile.dayPillar.branch, profile.hourPillar.branch];
}
