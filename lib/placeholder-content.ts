/**
 * PLACEHOLDER CONTENT — not shipped.
 *
 * Stand-in for Sanity. Every value here is shaped exactly like the GROQ
 * projection that will replace it (see `lib/content.ts`), so the queries drop
 * in without touching components. Every image is `null` for now, so each media
 * slot renders as an empty tile at its real size.
 */
import type {
  AboutSummary,
  GameSummary,
  LatestGame,
  Settings,
  SportSummary,
  StoryItem,
} from "./types";

const sportOrder = [
  "basketball",
  "soccer",
  "basketball",
  "football",
  "soccer",
  "basketball",
  "football",
  "soccer",
] as const;

export const settings: Settings = {
  email: "hello@kamedia.ca",
  instagramUrl: "https://www.instagram.com/kamedia._/",
  instagramHandle: "@kamedia._",
  location: "Prince George, BC",
};

export const featured: GameSummary[] = sportOrder.map((sport, i) => ({
  _id: `featured-${i + 1}`,
  title: i === 0 ? "[Team] vs Lord Tweedsmuir" : "[Team] vs [Opponent]",
  slug: i === 0 ? "senior-boys-vs-lord-tweedsmuir-2026-01-14" : `game-${i + 1}`,
  sport,
  code: `${String(i + 1).padStart(2, "0")}A`,
  cover: null,
}));

export const sports: SportSummary[] = [
  { sport: "basketball", count: 5, cover: null },
  { sport: "soccer", count: 4, cover: null },
  { sport: "football", count: 3, cover: null },
];

const latestStories: StoryItem[] = [1, 2, 3].map((n) => ({
  _key: `story-${n}`,
  _type: "storyImage",
  image: null,
  caption: null,
}));

export const latest: LatestGame = {
  _id: "latest",
  title: "[Team] vs Lord Tweedsmuir",
  slug: "senior-boys-vs-lord-tweedsmuir-2026-01-14",
  sport: "basketball",
  code: "01A",
  date: "2026-01-14",
  statLine: "52pts/10reb vs lord tweedsmuir",
  blurb:
    "[One line about the game — the moment, the rivalry, what was on the line.]",
  cover: null,
  stories: latestStories,
};

export const about: AboutSummary = {
  headline:
    "kamedia is Krystien Aldana — a sports photographer and filmmaker in Prince George, BC, shooting the raw seconds after the whistle.",
  portrait: null,
  services: [
    { _key: "svc-1", title: "Game-day photography" },
    { _key: "svc-2", title: "Highlight & recruiting films" },
    { _key: "svc-3", title: "Social-ready edits" },
  ],
};
