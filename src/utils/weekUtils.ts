/**
 * Get the week number and year for a date (ISO week, Monday as first day)
 * Returns format: "2026. 3. hét" (Year. Week. week)
 */
export function getWeekInfo(dateString: string): { week: number; year: number; display: string } {
  try {
    // Parse date string "2026/01/15 15:00"
    const [datePart] = dateString.split(" ");
    const [year, month, day] = datePart.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    
    // Get ISO week number (Monday as first day of week)
    const weekInfo = getISOWeek(date);
    
    return {
      week: weekInfo.week,
      year: weekInfo.year,
      display: `${weekInfo.year}. ${weekInfo.week}. hét`,
    };
  } catch (error) {
    // Fallback
    return { week: 0, year: 0, display: "" };
  }
}

/**
 * Get the current week info
 */
export function getCurrentWeekInfo(): { week: number; year: number } {
  const now = new Date();
  return getISOWeek(now);
}

/**
 * Check if a week is the current week
 */
export function isCurrentWeek(week: number, year: number): boolean {
  const currentWeek = getCurrentWeekInfo();
  return currentWeek.week === week && currentWeek.year === year;
}

/**
 * Get ISO week number for a date (Monday as first day)
 * Based on ISO 8601 standard
 */
function getISOWeek(date: Date): { week: number; year: number } {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  
  // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  // Convert to Monday = 0, Tuesday = 1, ..., Sunday = 6
  const dayOfWeek = (d.getDay() + 6) % 7;
  
  // Find the Monday of the current week
  const monday = new Date(d);
  monday.setDate(d.getDate() - dayOfWeek);
  
  // Get January 1st of the year containing the Monday
  const jan1 = new Date(monday.getFullYear(), 0, 1);
  
  // Find the Monday of the week containing January 1st
  const jan1DayOfWeek = (jan1.getDay() + 6) % 7;
  const firstMonday = new Date(jan1);
  firstMonday.setDate(jan1.getDate() - jan1DayOfWeek);
  
  // Calculate week number
  const diffTime = monday.getTime() - firstMonday.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekNo = Math.floor(diffDays / 7) + 1;
  
  // If the Monday is in the previous year, it's week 52 or 53 of that year
  if (monday.getFullYear() < d.getFullYear()) {
    return { week: weekNo, year: monday.getFullYear() };
  }
  
  // If the Monday is in the next year, it's week 1 of that year
  if (monday.getFullYear() > d.getFullYear()) {
    return { week: 1, year: monday.getFullYear() };
  }
  
  return { week: weekNo, year: monday.getFullYear() };
}

/**
 * Group tournaments by week
 */
export function groupTournamentsByWeek<T extends { localTournamentDate: string }>(
  tournaments: T[],
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  
  tournaments.forEach((tournament) => {
    const weekInfo = getWeekInfo(tournament.localTournamentDate);
    const weekKey = `${weekInfo.year}-W${weekInfo.week.toString().padStart(2, "0")}`;
    
    if (!grouped.has(weekKey)) {
      grouped.set(weekKey, []);
    }
    grouped.get(weekKey)!.push(tournament);
  });
  
  // Sort by week key (year-week)
  const sorted = new Map([...grouped.entries()].sort());
  
  return sorted;
}
