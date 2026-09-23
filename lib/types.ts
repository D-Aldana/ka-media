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
  width: number;
  height: number;
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
      playbackId: string;
      poster: ContentImage | null;
      /** Seconds, from Mux. Capped at 60 when it drives a progress bar. */
      duration: number | null;
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

export type LatestGame = GameSummary & {
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  statLine: string | null;
  blurb: string | null;
  stories: StoryItem[];
};

export type SportSummary = {
  sport: Sport;
  count: number;
  cover: ContentImage | null;
};

export type Service = {
  _key: string;
  title: string;
};

export type AboutSummary = {
  headline: string;
  portrait: ContentImage | null;
  services: Service[];
};

export type Settings = {
  email: string;
  instagramUrl: string;
  instagramHandle: string;
  location: string;
};

export type HomeData = {
  featured: GameSummary[];
  sports: SportSummary[];
  latest: LatestGame | null;
  about: AboutSummary;
};
