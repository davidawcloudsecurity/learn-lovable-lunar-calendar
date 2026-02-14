// ===== BaZi Profile Storage =====
// Stores user's Four Pillars for personalized risk analysis

export interface BaZiPillar {
    stem: string;  // 天干 (Heavenly Stem)
    branch: string; // 地支 (Earthly Branch)
}

export interface BaZiProfile {
    yearPillar: BaZiPillar;   // 年柱 - Year Pillar (Roots/Ancestors)
    monthPillar: BaZiPillar;  // 月柱 - Career/Authority
    dayPillar: BaZiPillar;    // 日柱 - Day Pillar (Self/Day Master)
    hourPillar: BaZiPillar;   // 时柱 - Work/Output
}

// Default profile - User's chart
//export const DEFAULT_PROFILE: BaZiProfile = {
//};
export const DEFAULT_PROFILE: BaZiProfile | null = null;

const STORAGE_KEY = 'bazi-profile';

// Load profile from localStorage
export function loadProfile(): BaZiProfile {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
        return DEFAULT_PROFILE;
    }
}

// Save profile to localStorage
export function saveProfile(profile: BaZiProfile): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

// Get all branches from profile (for risk calculation)
export function getProfileBranches(profile: BaZiProfile): string[] {
    return [profile.yearPillar.branch, profile.monthPillar.branch, profile.dayPillar.branch, profile.hourPillar.branch];
}
