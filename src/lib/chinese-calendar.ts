// ===== Chinese Zodiac Calendar Utilities =====
// Contains zodiac animals, heavenly stems, earthly branches, solar terms, and lunar calendar data

// 12 Zodiac animals with emoji and Chinese name
export const ZODIAC_ANIMALS = [
  { emoji: '🐀', name: 'Rat', cn: '鼠' },
  { emoji: '🐂', name: 'Ox', cn: '牛' },
  { emoji: '🐅', name: 'Tiger', cn: '虎' },
  { emoji: '🐇', name: 'Rabbit', cn: '兔' },
  { emoji: '🐉', name: 'Dragon', cn: '龙' },
  { emoji: '🐍', name: 'Snake', cn: '蛇' },
  { emoji: '🐴', name: 'Horse', cn: '马' },
  { emoji: '🐐', name: 'Goat', cn: '羊' },
  { emoji: '🐵', name: 'Monkey', cn: '猴' },
  { emoji: '🐔', name: 'Rooster', cn: '鸡' },
  { emoji: '🐶', name: 'Dog', cn: '狗' },
  { emoji: '🐷', name: 'Pig', cn: '猪' },
];

// 10 Heavenly Stems (天干)
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 12 Earthly Branches (地支)
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Five Elements for Heavenly Stems
export const STEM_ELEMENTS = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
export const STEM_ELEMENTS_CN = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];

// Get zodiac animal for a given year
export function getYearZodiac(year: number) {
  const index = (year - 4) % 12;
  return ZODIAC_ANIMALS[index >= 0 ? index : index + 12];
}

// Get heavenly stem and earthly branch for a year (天干地支)
export function getYearStemBranch(year: number) {
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  const si = stemIndex >= 0 ? stemIndex : stemIndex + 10;
  const bi = branchIndex >= 0 ? branchIndex : branchIndex + 12;
  return {
    stem: HEAVENLY_STEMS[si],
    branch: EARTHLY_BRANCHES[bi],
    element: STEM_ELEMENTS_CN[si],
    elementEn: STEM_ELEMENTS[si],
    full: `${HEAVENLY_STEMS[si]}${EARTHLY_BRANCHES[bi]}`,
  };
}

// 12 two-hour periods (时辰) with zodiac animals
export const SHICHEN = [
  { branch: '子', name: '子时', time: '23:00-01:00', animal: 0 },
  { branch: '丑', name: '丑时', time: '01:00-03:00', animal: 1 },
  { branch: '寅', name: '寅时', time: '03:00-05:00', animal: 2 },
  { branch: '卯', name: '卯时', time: '05:00-07:00', animal: 3 },
  { branch: '辰', name: '辰时', time: '07:00-09:00', animal: 4 },
  { branch: '巳', name: '巳时', time: '09:00-11:00', animal: 5 },
  { branch: '午', name: '午时', time: '11:00-13:00', animal: 6 },
  { branch: '未', name: '未时', time: '13:00-15:00', animal: 7 },
  { branch: '申', name: '申时', time: '15:00-17:00', animal: 8 },
  { branch: '酉', name: '酉时', time: '17:00-19:00', animal: 9 },
  { branch: '戌', name: '戌时', time: '19:00-21:00', animal: 10 },
  { branch: '亥', name: '亥时', time: '21:00-23:00', animal: 11 },
];

// 24 Solar Terms (节气) with approximate month/day
export const SOLAR_TERMS = [
  { name: '立春', en: 'Start of Spring', month: 2, day: 4 },
  { name: '雨水', en: 'Rain Water', month: 2, day: 19 },
  { name: '惊蛰', en: 'Awakening of Insects', month: 3, day: 6 },
  { name: '春分', en: 'Spring Equinox', month: 3, day: 21 },
  { name: '清明', en: 'Clear and Bright', month: 4, day: 5 },
  { name: '谷雨', en: 'Grain Rain', month: 4, day: 20 },
  { name: '立夏', en: 'Start of Summer', month: 5, day: 6 },
  { name: '小满', en: 'Grain Buds', month: 5, day: 21 },
  { name: '芒种', en: 'Grain in Ear', month: 6, day: 6 },
  { name: '夏至', en: 'Summer Solstice', month: 6, day: 21 },
  { name: '小暑', en: 'Minor Heat', month: 7, day: 7 },
  { name: '大暑', en: 'Major Heat', month: 7, day: 23 },
  { name: '立秋', en: 'Start of Autumn', month: 8, day: 7 },
  { name: '处暑', en: 'End of Heat', month: 8, day: 23 },
  { name: '白露', en: 'White Dew', month: 9, day: 8 },
  { name: '秋分', en: 'Autumn Equinox', month: 9, day: 23 },
  { name: '寒露', en: 'Cold Dew', month: 10, day: 8 },
  { name: '霜降', en: 'Frost Descent', month: 10, day: 23 },
  { name: '立冬', en: 'Start of Winter', month: 11, day: 7 },
  { name: '小雪', en: 'Minor Snow', month: 11, day: 22 },
  { name: '大雪', en: 'Major Snow', month: 12, day: 7 },
  { name: '冬至', en: 'Winter Solstice', month: 12, day: 22 },
  { name: '小寒', en: 'Minor Cold', month: 1, day: 6 },
  { name: '大寒', en: 'Major Cold', month: 1, day: 20 },
];

// Get solar term for a given date (approximate)
export function getSolarTerm(month: number, day: number) {
  return SOLAR_TERMS.find(t => t.month === month && Math.abs(t.day - day) <= 1);
}

// Chinese lunar day names
const LUNAR_DAYS = [
  '', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];

const LUNAR_MONTHS = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];

// Simplified lunar date approximation (offset from Gregorian)
// For a real app, you'd use a proper lunar calendar library
export function getLunarDate(date: Date): { month: number; day: number; monthName: string; dayName: string } {
  // Simple approximation: lunar calendar is ~21-50 days behind Gregorian
  const year = date.getFullYear();
  const lunarNewYearDates: Record<number, [number, number]> = {
    2020: [1, 25], 2021: [2, 12], 2022: [2, 1], 2023: [1, 22],
    2024: [2, 10], 2025: [1, 29], 2026: [2, 17], 2027: [2, 6],
    2028: [1, 26], 2029: [2, 13],
  };

  const lny = lunarNewYearDates[year] || [2, 1];
  const lnyDate = new Date(year, lny[0] - 1, lny[1]);
  let diffDays = Math.floor((date.getTime() - lnyDate.getTime()) / 86400000);

  if (diffDays < 0) {
    // Before lunar new year, use previous year's calendar
    const prevLny = lunarNewYearDates[year - 1] || [2, 1];
    const prevLnyDate = new Date(year - 1, prevLny[0] - 1, prevLny[1]);
    diffDays = Math.floor((date.getTime() - prevLnyDate.getTime()) / 86400000);
  }

  // Approximate: alternate 29/30 day months
  let month = 1;
  let remaining = diffDays;
  while (remaining >= 30 && month < 12) {
    remaining -= (month % 2 === 1 ? 30 : 29);
    month++;
  }
  const day = Math.max(1, Math.min(30, remaining + 1));

  return {
    month,
    day,
    monthName: LUNAR_MONTHS[month - 1] + '月',
    dayName: LUNAR_DAYS[day] || `${day}`,
  };
}

// Lunar year range labels for yearly view
export const LUNAR_YEAR_RANGES: Record<number, string> = {
  2020: 'L.Jan-25 — Feb-11 \'21',
  2021: 'L.Feb-12 — Jan-31 \'22',
  2022: 'L.Feb-01 — Jan-21 \'23',
  2023: 'L.Jan-22 — Feb-09 \'24',
  2024: 'L.Feb-10 — Jan-28 \'25',
  2025: 'L.Jan-29 — Feb-16 \'26',
  2026: 'L.Feb-17 — Feb-05 \'27',
  2027: 'L.Feb-06 — Jan-25 \'28',
  2028: 'L.Jan-26 — Feb-12 \'29',
  2029: 'L.Feb-13 — Feb-02 \'30',
};

// Get current shichen (two-hour period) based on hour
export function getCurrentShichen(hour: number): number {
  if (hour >= 23 || hour < 1) return 0;
  if (hour < 3) return 1;
  if (hour < 5) return 2;
  if (hour < 7) return 3;
  if (hour < 9) return 4;
  if (hour < 11) return 5;
  if (hour < 13) return 6;
  if (hour < 15) return 7;
  if (hour < 17) return 8;
  if (hour < 19) return 9;
  if (hour < 21) return 10;
  return 11;
}

// Notes/memos storage helpers
export interface CalendarNote {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  text: string;
  reminder?: boolean;
  createdAt: number;
}

export function loadNotes(): CalendarNote[] {
  try {
    const data = localStorage.getItem('zodiac-calendar-notes');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: CalendarNote[]) {
  localStorage.setItem('zodiac-calendar-notes', JSON.stringify(notes));
}

export function getNotesForDate(notes: CalendarNote[], date: string): CalendarNote[] {
  return notes.filter(n => n.date === date);
}
