/**
 * The fixed sport list, kept in code: a new sport needs its own tile, filter
 * chip and page copy, so it is a developer change rather than a Studio one.
 * Must match `SPORTS` in `lib/types.ts`. `other` is for anything that isn't
 * game action — headshots, team photos, media days.
 */
export const SPORT_OPTIONS = [
  { title: "Basketball", value: "basketball" },
  { title: "Soccer", value: "soccer" },
  { title: "Football", value: "football" },
  { title: "Other", value: "other" },
];
