import type { Sport } from "./types";

/** Dates read as "mar 14, 2025" everywhere they surface. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(iso))
    .toLowerCase();
}

/** Sports are stored lowercase and shown capitalised in chips and tiles. */
export function sportLabel(sport: Sport): string {
  return sport[0].toUpperCase() + sport.slice(1);
}
