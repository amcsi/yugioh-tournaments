/**
 * Formats a date as YYYY-MM-DD using local time (not UTC)
 * This prevents timezone issues where the date might shift by one day
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Gets today's date as YYYY-MM-DD using local time
 */
export function getTodayDateKey(): string {
  return formatDateKey(new Date());
}
