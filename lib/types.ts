export type Sport = "basketball" | "soccer" | "football" | "other";

/** Must match `SPORT_OPTIONS` in `sanity/schemaTypes/sports.ts`. */
export const SPORTS: Sport[] = ["basketball", "soccer", "football", "other"];

/**
 * The sports proper, without `other`: what the home tiles and the site's
 * structured data advertise.
 */
export const GAME_SPORTS: Sport[] = SPORTS.filter((sport) => sport !== "other");

/** A filter label from the Studio — a team, or anything else. */
export type Label = {
  slug: string;
  title: string;
  kind: "team" | "other";
};

/**
 * An image ready to render: the Sanity asset projection after it has been run
 * through `lib/image.ts`. The editor's crop is already baked into the URL as a
 * `rect`, so width, height and hotspot all describe the cropped frame.
 */
export type ContentImage = {
  url: string;
  alt: string;
  /** Null when the asset has no dimension metadata. */
  width: number | null;
  height: number | null;
  lqip: string | null;
  hotspot: { x: number; y: number } | null;
};

export type StoryItem =
  | {
      _key: string;
      _type: "storyImage";
      image: ContentImage | null;
      caption: string | null;
    }
  | {
      _key: string;
      _type: "storyVideo";
      /** The MP4 on Sanity's asset CDN. */
      url: string;
      poster: ContentImage | null;
      caption: string | null;
    };

export type GameSummary = {
  _id: string;
  title: string;
  slug: string;
  sport: Sport;
  /** Derived from date order at query time (01A, 02A …), never stored. */
  code: string;
  cover: ContentImage | null;
};

/**
 * A filmstrip frame: the summary plus the reel its cover plays on hover. Null
 * when the game has no reel — that frame stays a still.
 */
export type FeaturedGame = GameSummary & {
  reel: string | null;
};

/** A card in the Work grid: the summary plus what the card labels. */
export type WorkGame = GameSummary & {
  kind: "game";
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  statLine: string | null;
  hasVideo: boolean;
  /** Slugs of its labels, for the label filter. */
  labels: string[];
};

/** A single photo, outside any game. Opens at `/work/photo/<slug>`. */
export type Single = {
  _id: string;
  title: string;
  slug: string;
  sport: Sport;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  caption: string | null;
  image: ContentImage | null;
  labels: Label[];
};

/** A single as a Work card; labels are slugs, like a game's. */
export type WorkSingle = Omit<Single, "labels"> & {
  kind: "single";
  labels: string[];
};

export type WorkItem = WorkGame | WorkSingle;

export type WorkData = {
  /** Games and singles together, newest first. */
  items: WorkItem[];
  /** Only labels something visible carries: teams first, then by name. */
  labels: Label[];
};

export type LatestGame = GameSummary & {
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  statLine: string | null;
  blurb: string | null;
  labels: Label[];
  stories: StoryItem[];
};

export type GamePage = {
  game: LatestGame;
  /** The next game in date order, wrapping to the newest at the end. */
  next: GameSummary | null;
};

export type SportSummary = {
  sport: Sport;
  count: number;
  cover: ContentImage | null;
};

export type Service = {
  _key: string;
  title: string;
  /** Only the About page shows this; the home summary lists titles alone. */
  description: string;
};

export type AboutSummary = {
  /** Krystien's name, which only the home page's JSON-LD reads. */
  name: string;
  headline: string;
  portrait: ContentImage | null;
  services: Service[];
  /** Teams and schools, as written. Empty hides the line. */
  clients: string[];
};

export type AboutPage = {
  name: string;
  /** The pull quote under the name. Longer than the home `headline`. */
  quote: string;
  /** Paragraphs. `getAboutPage` flattens the portable text into these. */
  bio: string[];
  portrait: ContentImage | null;
  services: Service[];
  clients: string[];
  /** Three 4:5 frames under "What I shoot". */
  photos: (ContentImage | null)[];
};

/**
 * The Contact page's copy. Null anywhere keeps the built-in line, so the page
 * still reads properly before anything is written in the Studio. The email,
 * handle and location themselves come from `Settings`.
 */
export type ContactPage = {
  eyebrow: string | null;
  /** Line breaks are kept when this renders. */
  headline: string | null;
  intro: string | null;
  emailLabel: string | null;
  emailNote: string | null;
  instagramLabel: string | null;
  instagramNote: string | null;
  locationLabel: string | null;
  locationNote: string | null;
  /** Overrides for this page's title and description. */
  seo: {
    title: string | null;
    description: string | null;
  };
};

export type Settings = {
  email: string;
  instagramUrl: string;
  instagramHandle: string;
  location: string;
  /** Overrides for the site-wide title, description and share image. */
  seo: {
    title: string | null;
    description: string | null;
    shareImage: ContentImage | null;
  };
};

export type HomeData = {
  featured: FeaturedGame[];
  sports: SportSummary[];
  latest: LatestGame | null;
  about: AboutSummary;
};
