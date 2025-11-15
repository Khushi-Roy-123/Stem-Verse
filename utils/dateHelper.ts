
const monthMap: { [key: string]: number } = {
    'january': 0, 'jan': 0,
    'february': 1, 'feb': 1,
    'march': 2, 'mar': 2,
    'april': 3, 'apr': 3,
    'may': 4,
    'june': 5, 'jun': 5,
    'july': 6, 'jul': 6,
    'august': 7, 'aug': 7,
    'september': 8, 'sep': 8, 'sept': 8,
    'october': 9, 'oct': 9,
    'november': 10, 'nov': 10,
    'december': 11, 'dec': 11,
};

/**
 * Parses a deadline string into a Date object.
 * Returns null for non-specific deadlines like "Rolling" or "Varies".
 * Tries to be smart about dates in the past (assumes next year).
 * @param deadlineStr - The string to parse (e.g., "April 15th, 2025", "Typically December", "Varies")
 * @returns A Date object or null.
 */
export const parseDeadline = (deadlineStr: string): Date | null => {
    const lowerCaseStr = deadlineStr.toLowerCase();

    if (['rolling', 'varies'].some(keyword => lowerCaseStr.includes(keyword))) {
        return null; // Represents an ongoing or non-specific deadline
    }

    // Try direct parsing first for formats like "April 15, 2025"
    let date = new Date(deadlineStr);
    if (!isNaN(date.getTime())) {
        return date;
    }
    
    // Manual parsing for formats like "Typically December" or "Registration opens March 2025"
    const words = lowerCaseStr.replace(/[^a-z0-9\s]/gi, '').split(/\s+/);
    const now = new Date();
    const currentYear = now.getFullYear();

    let month: number | undefined = undefined;
    let day: number | undefined = undefined;
    let year: number | undefined = undefined;

    for (const word of words) {
        if (monthMap[word] !== undefined) {
            month = monthMap[word];
        }
        const num = parseInt(word, 10);
        if (!isNaN(num)) {
            if (num > 31) { // It's likely a year
                year = num;
            } else if (day === undefined) { // It's likely a day
                day = num;
            }
        }
    }

    if (month !== undefined) {
        year = year || currentYear;
        day = day || 1; // Default to the first of the month if no day is specified

        let potentialDate = new Date(year, month, day);

        // If the date is in the past for the current year, assume it's for the next year
        if (potentialDate < now && year === currentYear) {
            potentialDate.setFullYear(currentYear + 1);
        }
        
        return potentialDate;
    }

    return null;
};
