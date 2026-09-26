export type Sport = "basketball" | "soccer" | "football";

export const SPORTS: Sport[] = ["basketball", "soccer", "football"];

/**
 * An image ready to render: the Sanity asset projection after it has been run
 * through `lib/image.ts` (URL built with @sanity/image-url, LQIP from
 * `asset->metadata.lqip`, hotspot kept for object-position).
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

/** A card in the Work grid: the summary plus what the card labels. */
export type WorkGame = GameSummary & {
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  statLine: string | null;
  hasVideo: boolean;
};

export type LatestGame = GameSummary & {
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  statLine: string | null;
  blurb: string | null;
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
  headline: string;
  portrait: ContentImage | null;
  services: Service[];
};

export type AboutPage = {
  name: string;
  /** The pull quote under the name. Longer than the home `headline`. */
  quote: string;
  /** Paragraphs. `getAboutPage` flattens the portable text into these. */
  bio: string[];
  portrait: ContentImage | null;
  services: Service[];
  /** Three 4:5 frames under "What I shoot". */
  photos: (ContentImage | null)[];
};

export type Settings = {
  email: string;
  instagramUrl: string;
  instagramHandle: string;
  location: string;
  /** The paragraph under the Contact heading; null keeps the built-in copy. */
  contactIntro: string | null;
  /** The lines under each contact detail; null keeps the built-in copy. */
  emailNote: string | null;
  instagramNote: string | null;
  locationNote: string | null;
};

export type HomeData = {
  featured: GameSummary[];
  sports: SportSummary[];
  latest: LatestGame | null;
  about: AboutSummary;
};
