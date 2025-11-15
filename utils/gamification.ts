// XP thresholds for each level. Index 0 is for level 1, index 1 for level 2, etc.
// A user is level X if their XP is >= LEVEL_THRESHOLDS[X-1] and < LEVEL_THRESHOLDS[X]
export const LEVEL_THRESHOLDS = [
    0,    // Level 1
    100,  // Level 2
    250,  // Level 3
    500,  // Level 4
    800,  // Level 5
    1200, // Level 6
    1700, // Level 7
    2300, // Level 8
    3000, // Level 9
    4000  // Level 10
];

/**
 * Calculates the user's level based on their total XP.
 * @param xp The user's total experience points.
 * @returns The user's current level number.
 */
export const getLevelFromXp = (xp: number): number => {
    // Find the highest level threshold the user has surpassed
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            return i + 1; // Levels are 1-based, indices are 0-based
        }
    }
    return 1; // Default to level 1
};

/**
 * Gets the total XP required to reach the next level.
 * @param currentLevel The user's current level.
 * @returns The XP value for the next level's threshold.
 */
export const getXpForNextLevel = (currentLevel: number): number => {
    if (currentLevel >= LEVEL_THRESHOLDS.length) {
        // User is at max level
        return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    }
    return LEVEL_THRESHOLDS[currentLevel];
};

/**
 * Calculates the user's XP progress within their current level.
 * @param xp The user's total experience points.
 * @returns A percentage (0-100) representing progress to the next level.
 */
export const getCurrentLevelProgress = (xp: number): number => {
    const currentLevel = getLevelFromXp(xp);
    if (currentLevel >= LEVEL_THRESHOLDS.length) {
        return 100; // Max level
    }

    const xpForCurrentLevel = LEVEL_THRESHOLDS[currentLevel - 1];
    const xpForNextLevel = LEVEL_THRESHOLDS[currentLevel];

    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
    const xpGainedInLevel = xp - xpForCurrentLevel;

    if (xpNeededForLevel === 0) return 100; // Avoid division by zero

    const progress = (xpGainedInLevel / xpNeededForLevel) * 100;
    return Math.min(progress, 100); // Cap at 100%
};
