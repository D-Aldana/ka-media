/**
 * PLACEHOLDER CONTENT — not shipped.
 *
 * Stand-in for Sanity. Every value here is shaped exactly like the GROQ
 * projection that will replace it (see `lib/content.ts`), so the queries drop
 * in without touching components. Every image is `null` for now, so each media
 * slot renders as an empty tile at its real size.
 */
import type {
  AboutPage,
  AboutSummary,
  ContactPage,
  FeaturedGame,
  GameSummary,
  Label,
  LatestGame,
  Service,
  Settings,
  SportSummary,
  Single,
  StoryItem,
  WorkData,
  WorkGame,
  WorkItem,
  WorkSingle,
} from "./types";
import { GAME_SPORTS } from "./types";

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

export const labels: Label[] = [
  { slug: "senior-boys", title: "[Senior Boys]", kind: "team" },
  { slug: "junior-girls", title: "[Junior Girls]", kind: "team" },
  { slug: "headshots", title: "[Headshots]", kind: "other" },
];

const [seniorBoys, juniorGirls, headshots] = labels;

/** Which team each placeholder game is for, alternating so both chips filter. */
function labelsFor(gameIndex: number): Label[] {
  return [gameIndex % 2 === 0 ? seniorBoys : juniorGirls];
}

/** A public sample clip, so the deck has something real to play. */
const DEMO_VIDEO_URL =
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4";

export const settings: Settings = {
  email: "aldanakrystien@gmail.com",
  instagramUrl: "https://www.instagram.com/kamedia._/",
  instagramHandle: "@kamedia._",
  location: "Prince George, BC",
  seo: { title: null, description: null, shareImage: null },
};

/** All null, so the Contact page shows its own built-in copy. */
export const contactPage: ContactPage = {
  eyebrow: null,
  headline: null,
  intro: null,
  emailLabel: null,
  emailNote: null,
  instagramLabel: null,
  instagramNote: null,
  locationLabel: null,
  locationNote: null,
  seo: { title: null, description: null },
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
      url: DEMO_VIDEO_URL,
      poster: null,
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
    labels: labelsFor(i),
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

/** Singles, newest first, dated between the games so the grid interleaves. */
export const singles: Single[] = [
  {
    _id: "photo-1",
    title: "[Senior night]",
    slug: "senior-night",
    sport: "basketball",
    date: "2026-01-09",
    caption: "[senior night · #23]",
    image: null,
    labels: [seniorBoys],
  },
  {
    _id: "photo-2",
    title: "[Media day headshots]",
    slug: "media-day-headshots",
    sport: "other",
    date: "2025-12-20",
    caption: null,
    image: null,
    labels: [headshots, juniorGirls],
  },
  {
    _id: "photo-3",
    title: "[Corner kick]",
    slug: "corner-kick",
    sport: "soccer",
    date: "2025-11-30",
    caption: "[the equaliser]",
    image: null,
    labels: [juniorGirls],
  },
];

const workGames: WorkGame[] = games.map((game) => ({
  ...toSummary(game),
  kind: "game",
  date: game.date,
  statLine: game.statLine,
  hasVideo: game.stories.some((item) => item._type === "storyVideo"),
  labels: game.labels.map((label) => label.slug),
}));

const workSingles: WorkSingle[] = singles.map((single) => ({
  ...single,
  kind: "single",
  labels: single.labels.map((label) => label.slug),
}));

export const work: WorkData = {
  items: ([...workGames, ...workSingles] as WorkItem[]).sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  ),
  labels,
};

export const featured: FeaturedGame[] = games.map((game) => ({
  ...toSummary(game),
  reel: null,
}));

export const latest: LatestGame = games[0];

export const sports: SportSummary[] = GAME_SPORTS.map((sport) => ({
  sport,
  count: games.filter((game) => game.sport === sport).length,
  cover: null,
}));

const services: Service[] = [
  {
    _key: "svc-1",
    title: "Game-day photography",
    description:
      "Action, emotion and sideline moments — edited and ready to post, print or send to press.",
  },
  {
    _key: "svc-2",
    title: "Highlight & recruiting films",
    description:
      "Game films, season mixtapes and recruiting reels cut to put an athlete’s best plays up front.",
  },
  {
    _key: "svc-3",
    title: "Social-ready edits",
    description:
      "Vertical cuts and photo sets sized for Instagram, TikTok and team pages — so the moment lands the same night.",
  },
];

export const about: AboutSummary = {
  name: "Krystien Aldana",
  headline:
    "ka-media is Krystien Aldana — a sports photographer and filmmaker in Prince George, BC, shooting the raw seconds after the whistle.",
  portrait: null,
  services,
  clients: [],
};

export const aboutPage: AboutPage = {
  name: "Krystien Aldana",
  quote:
    "I shoot the raw seconds after the whistle — the celebrations, the heartbreak, the nets coming down.",
  bio: [
    "[A few sentences in his own words: how he got into sports photography, who he shoots for — schools, clubs, athletes, families — and what he looks for on game day.]",
  ],
  portrait: null,
  services,
  clients: [],
  photos: [null, null, null],
};
