import type { VisitEntry } from "../store/useVisitedCountries";

/**
 * Formats an ISO date string ("YYYY-MM-DD") into a human-readable date.
 * Appends "T00:00:00" to avoid UTC-offset shifts during parsing.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats a VisitEntry's date range as a single human-readable string.
 * Returns "Date unknown" when startDate is empty.
 */
export function formatVisitRange(entry: VisitEntry): string {
  if (!entry.startDate) return "Date unknown";
  const start = formatDate(entry.startDate);
  if (entry.endDate && entry.endDate !== entry.startDate) {
    return `${start} – ${formatDate(entry.endDate)}`;
  }
  return start;
}

/**
 * Returns today's date as an ISO string ("YYYY-MM-DD").
 */
export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}
