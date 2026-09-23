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
