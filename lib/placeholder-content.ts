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

/** Mux's own public demo asset, so the deck has something real to play. */
const DEMO_PLAYBACK_ID = "DS00Spx1CV902MCtPj5WknGlR102V5HFkDe";

export const settings: Settings = {
  email: "hello@kamedia.ca",
  instagramUrl: "https://www.instagram.com/kamedia._/",
  instagramHandle: "@kamedia._",
  location: "Prince George, BC",
};

function storiesFor(gameIndex: number): StoryItem[] {
  const items: StoryItem[] = [
    {
      _key: `g${gameIndex}-s1`,
      _type: "storyImage",
      image: null,
      caption: "[First frame — the tip-off, the walk-out, the warm-up.]",
    },
    {
      _key: `g${gameIndex}-s2`,
      _type: "storyImage",
      image: null,
      caption: null,
    },
    {
      _key: `g${gameIndex}-s3`,
      _type: "storyImage",
      image: null,
      caption: "[Last frame — the bench, the scoreboard, the walk off.]",
    },
  ];

  // Only some games have a reel, the way `hasVideo` varies in the Work grid.
  if (gameIndex % 3 === 0) {
    items.splice(1, 0, {
      _key: `g${gameIndex}-reel`,
      _type: "storyVideo",
      playbackId: DEMO_PLAYBACK_ID,
      poster: null,
      duration: 15,
      caption: "[Highlight reel — the play that decided it.]",
    });
  }

  return items;
}

/** Newest first, the order every query returns games in. */
export const games: LatestGame[] = sportOrder.map((sport, i) => {
  const first = i === 0;
  const date = new Date(Date.UTC(2026, 0, 14));
  date.setUTCDate(date.getUTCDate() - i * 11);

  return {
    _id: `game-${i + 1}`,
    title: first ? "[Team] vs Lord Tweedsmuir" : "[Team] vs [Opponent]",
    slug: first ? "senior-boys-vs-lord-tweedsmuir-2026-01-14" : `game-${i + 1}`,
    sport,
    code: `${String(i + 1).padStart(2, "0")}A`,
    date: date.toISOString().slice(0, 10),
    statLine: first ? "52pts/10reb vs lord tweedsmuir" : "[stat] vs [opponent]",
    blurb: first
      ? "[One line about the game — the moment, the rivalry, what was on the line.]"
      : "[One line about the game.]",
    cover: null,
    stories: storiesFor(i),
  };
});

export function toSummary({
  _id,
  title,
  slug,
  sport,
  code,
  cover,
}: LatestGame): GameSummary {
  return { _id, title, slug, sport, code, cover };
}

export const featured: GameSummary[] = games.map(toSummary);

export const latest: LatestGame = games[0];

export const sports: SportSummary[] = [
  { sport: "basketball", count: 5, cover: null },
  { sport: "soccer", count: 4, cover: null },
  { sport: "football", count: 3, cover: null },
];

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
