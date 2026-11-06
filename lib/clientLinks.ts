/**
 * Outbound links for names in Settings/About's `clients` list, keyed by the
 * exact string as entered in the Studio. An unmapped name just renders as
 * plain text — add an entry here once a client's site is confirmed rather
 * than guessing a URL.
 */
export const CLIENT_LINKS: Record<string, string> = {
  "UNBC Athletics": "https://unbctimberwolves.com",
  "PG Cougars": "https://chl.ca/whl-cougars",
  "PG Kodiaks": "https://kodiaksfootball.com",
};
