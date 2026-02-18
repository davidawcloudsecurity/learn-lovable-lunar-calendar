// ===== BaZi Interaction Calculator =====
// Calculates risk levels based on daily stem-branch interactions with user's chart

export type RiskLevel = 'high' | 'medium' | 'low';

export interface RiskInfo {
    level: RiskLevel;
    emoji: string;
    reason: string;
}

// 冲 (Clash) - Direct opposition
const CLASHES: Record<string, string> = {
    '子': '午', '午': '子',
    '丑': '未', '未': '丑',
    '寅': '申', '申': '寅',
    '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰',
    '巳': '亥', '亥': '巳'
};

// 自刑 (Self-Punishment) - Only these four branches self-punish
const SELF_PUNISHMENTS = ['午', '辰', '酉', '亥'];

// 子卯刑 (Ungrateful Punishment)
const UNGRATEFUL_PUNISHMENT: Record<string, string> = {
    '子': '卯',
    '卯': '子'
};

// 寅巳申刑 (Power Struggle Punishment)
const POWER_PUNISHMENT = ['寅', '巳', '申'];

// 丑未戌刑 (Bullying Punishment)
const BULLYING_PUNISHMENT = ['丑', '未', '戌'];

// 害 (Harm) - Indirect conflict
const HARMS: Record<string, string> = {
    '子': '未', '未': '子',
    '丑': '午', '午': '丑',
    '寅': '巳', '巳': '寅',
    '卯': '辰', '辰': '卯',
    '申': '亥', '亥': '申',
    '酉': '戌', '戌': '酉'
};

// 六合 (Six Harmonies)
const SIX_HARMONIES: Record<string, string> = {
    '子': '丑', '丑': '子',
    '寅': '亥', '亥': '寅',
    '卯': '戌', '戌': '卯',
    '辰': '酉', '酉': '辰',
    '巳': '申', '申': '巳',
    '午': '未', '未': '午'
};

// 三合 (Three Harmonies)
const WOOD_TRIO = ['亥', '卯', '未'];
const FIRE_TRIO = ['寅', '午', '戌'];
const METAL_TRIO = ['巳', '酉', '丑'];
const WATER_TRIO = ['申', '子', '辰'];

// 破 (Breaking/Destruction) - Disruptive relationship
const BREAKING: Record<string, string> = {
    '子': '酉', '酉': '子',
    '丑': '辰', '辰': '丑',
    '寅': '亥', '亥': '寅',
    '卯': '午', '午': '卯',
    '巳': '申', '申': '巳',
    '未': '戌', '戌': '未'
};

// Check if daily branch clashes with any user branch
function hasClash(dailyBranch: string, userBranches: string[]): boolean {
    return userBranches.some(b => CLASHES[dailyBranch] === b);
}

// Check if daily branch causes self-punishment
function hasSelfPunishment(dailyBranch: string, userBranches: string[]): boolean {
    return SELF_PUNISHMENTS.includes(dailyBranch) && userBranches.includes(dailyBranch);
}

// Check if daily branch causes ungrateful punishment
function hasUngratefulPunishment(dailyBranch: string, userBranches: string[]): boolean {
    const target = UNGRATEFUL_PUNISHMENT[dailyBranch];
    return target ? userBranches.includes(target) : false;
}

// Check if daily branch causes power punishment (寅巳申)
function hasPowerPunishment(dailyBranch: string, userBranches: string[]): boolean {
    if (!POWER_PUNISHMENT.includes(dailyBranch)) return false;
    const otherTwo = POWER_PUNISHMENT.filter(b => b !== dailyBranch);
    return userBranches.some(b => otherTwo.includes(b));
}

// Check if daily branch causes bullying punishment (丑未戌)
function hasBullyingPunishment(dailyBranch: string, userBranches: string[]): boolean {
    if (!BULLYING_PUNISHMENT.includes(dailyBranch)) return false;
    const otherTwo = BULLYING_PUNISHMENT.filter(b => b !== dailyBranch);
    return userBranches.some(b => otherTwo.includes(b));
}

// Check if daily branch harms any user branch
function hasHarm(dailyBranch: string, userBranches: string[]): boolean {
    return userBranches.some(b => HARMS[dailyBranch] === b);
}

// Check if daily branch breaks any user branch
function hasBreaking(dailyBranch: string, userBranches: string[]): boolean {
    return userBranches.some(b => BREAKING[dailyBranch] === b);
}

// Check if daily branch harmonizes with any user branch
function hasSixHarmony(dailyBranch: string, userBranches: string[]): boolean {
    return userBranches.some(b => SIX_HARMONIES[dailyBranch] === b);
}

// Check if daily branch forms trio harmony
function hasTrioHarmony(dailyBranch: string, userBranches: string[]): boolean {
    const trios = [WOOD_TRIO, FIRE_TRIO, METAL_TRIO, WATER_TRIO];
    return trios.some(trio =>
        trio.includes(dailyBranch) && userBranches.some(b => trio.includes(b))
    );
}

// Calculate risk level for a given daily branch
export function calculateRiskLevel(dailyBranch: string, userBranches: string[]): RiskInfo {
    // HIGH RISK: Clash or any Punishment
    if (hasClash(dailyBranch, userBranches)) {
        return { level: 'high', emoji: '🔴', reason: 'Clash (冲)' };
    }
    if (hasSelfPunishment(dailyBranch, userBranches)) {
        return { level: 'high', emoji: '🔴', reason: 'Self-Punishment (自刑)' };
    }
    if (hasUngratefulPunishment(dailyBranch, userBranches)) {
        return { level: 'high', emoji: '🔴', reason: 'Ungrateful Punishment (子卯刑)' };
    }
    if (hasPowerPunishment(dailyBranch, userBranches)) {
        return { level: 'high', emoji: '🔴', reason: 'Power Punishment (寅巳申刑)' };
    }
    if (hasBullyingPunishment(dailyBranch, userBranches)) {
        return { level: 'high', emoji: '🔴', reason: 'Bullying Punishment (丑未戌刑)' };
    }

    // LOW RISK: Harmony (checked before Breaking to prioritize positive relationships)
    if (hasSixHarmony(dailyBranch, userBranches)) {
        return { level: 'low', emoji: '🟢', reason: 'Six Harmony (六合)' };
    }
    if (hasTrioHarmony(dailyBranch, userBranches)) {
        return { level: 'low', emoji: '🟢', reason: 'Trio Harmony (三合)' };
    }

    // MEDIUM RISK: Harm or Breaking
    if (hasHarm(dailyBranch, userBranches)) {
        return { level: 'medium', emoji: '🟡', reason: 'Harm (害)' };
    }
    if (hasBreaking(dailyBranch, userBranches)) {
        return { level: 'medium', emoji: '🟡', reason: 'Breaking (破)' };
    }

    // NEUTRAL: No significant interaction
    return { level: 'medium', emoji: '⚪', reason: 'Neutral' };
}
