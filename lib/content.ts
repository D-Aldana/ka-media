import { client, freshClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";

import { toContentImage, type RawImage } from "./image";
import * as placeholder from "./placeholder-content";
import {
  ABOUT_QUERY,
  GAME_QUERY,
  HOME_QUERY,
  SETTINGS_QUERY,
  SLUGS_QUERY,
  WORK_QUERY,
} from "./queries";
import type {
  AboutPage,
  GamePage,
  GameSummary,
  HomeData,
  LatestGame,
  Service,
  Settings,
  Sport,
  SportSummary,
  StoryItem,
  WorkGame,
} from "./types";
import { SPORTS } from "./types";

/**
 * The only seam between the UI and the CMS. Each function reads Sanity and
 * maps the projection onto the types the components already take.
 *
 * One rule about placeholders: `placeholder-content.ts` stands in only when no
 * project is configured, which is a local convenience. Once a project is set,
 * the site shows what is actually in the dataset — an empty dataset renders
 * empty sections rather than games that link nowhere.
 *
 * Reads are not caught. A failure during the build fails it loudly, and a
 * failure while revalidating leaves the last good page in place, both of which
 * beat quietly publishing an empty site.
 *
 * Two things are computed here rather than in GROQ: the `code` (01A, 02A …)
 * from each game's `rank` in date order, and images mapped to `ContentImage`.
 */

/** Cache tags let the publish webhook revalidate without a redeploy. */
const TAGS = { game: "game", about: "about", settings: "settings" };

/**
 * An hour is the backstop; the webhook is what makes a publish appear. The
 * revalidate is what puts these reads in the data cache at all — without it
 * `/work`, which is dynamic, would hit Sanity on every request and ignore the
 * tags entirely.
 */
const REVALIDATE = 3600;

/**
 * In development nothing invalidates the tags — the publish webhook points at
 * the deployed site — so reads go straight to Sanity and an edit shows up on
 * the next refresh.
 */
const isDev = process.env.NODE_ENV === "development";

/**
 * Matches a blank settings document exactly: `SETTINGS_QUERY` coalesces every
 * field, because GROQ omits unset keys rather than projecting null — without
 * that, `Settings` would promise `string` and hand back `undefined`.
 */
const EMPTY_SETTINGS: Settings = {
  email: "",
  instagramUrl: "",
  instagramHandle: "",
  location: "",
  contactIntro: null,
  emailNote: null,
  instagramNote: null,
  locationNote: null,
  seo: { title: null, description: null, shareImage: null },
};

const EMPTY_ABOUT: AboutPage = {
  name: "",
  quote: "",
  bio: [],
  portrait: null,
  services: [],
  photos: [],
};

function fetchFrom<T>(
  query: string,
  params: Record<string, unknown>,
  tags: string[],
  fresh = false,
): Promise<T> {
  const live = fresh || isDev;
  return (live ? freshClient : client).fetch<T>(query, params, {
    next: live ? { revalidate: 0 } : { revalidate: REVALIDATE, tags },
  });
}

/** Position in date-desc order becomes the 01A code the design prints. */
function codeFor(rank: number | null | undefined): string {
  return `${String((rank ?? 0) + 1).padStart(2, "0")}A`;
}

type RawSummary = {
  _id: string;
  title: string;
  slug: string;
  sport: Sport;
  rank: number | null;
  cover: RawImage | null;
};

function toSummary(raw: RawSummary): GameSummary {
  return {
    _id: raw._id,
    title: raw.title,
    slug: raw.slug,
    sport: raw.sport,
    code: codeFor(raw.rank),
    cover: toContentImage(raw.cover),
  };
}

type RawStory = {
  _key: string;
  _type: "storyImage" | "storyVideo";
  caption: string | null;
  image?: RawImage | null;
  playbackId?: string | null;
  duration?: number | null;
  poster?: RawImage | null;
};

/** A reel with no playback id is still encoding, so it is left out. */
function toStories(raw: RawStory[] | null | undefined): StoryItem[] {
  return (raw ?? []).flatMap((item): StoryItem[] => {
    if (item._type === "storyImage") {
      return [
        {
          _key: item._key,
          _type: "storyImage",
          image: toContentImage(item.image),
          caption: item.caption ?? null,
        },
      ];
    }

    if (!item.playbackId) return [];
    return [
      {
        _key: item._key,
        _type: "storyVideo",
        playbackId: item.playbackId,
        poster: toContentImage(item.poster),
        duration: item.duration ?? null,
        caption: item.caption ?? null,
      },
    ];
  });
}

type RawGame = RawSummary & {
  date: string;
  statLine: string | null;
  blurb: string | null;
  stories: RawStory[] | null;
};

function toGame(raw: RawGame): LatestGame {
  return {
    ...toSummary(raw),
    date: raw.date,
    statLine: raw.statLine ?? null,
    blurb: raw.blurb ?? null,
    stories: toStories(raw.stories),
  };
}

type RawService = { _key: string; title: string; description: string | null };

function toServices(raw: RawService[] | null | undefined): Service[] {
  return (raw ?? []).map((service) => ({
    _key: service._key,
    title: service.title,
    description: service.description ?? "",
  }));
}

export async function getSettings(): Promise<Settings> {
  if (!isSanityConfigured) return placeholder.settings;

  type RawSettings = Omit<Settings, "seo"> & {
    seo: { title: string | null; description: string | null; shareImage: RawImage | null };
  };

  const raw = await fetchFrom<RawSettings | null>(SETTINGS_QUERY, {}, [TAGS.settings]);
  if (!raw) return EMPTY_SETTINGS;

  return {
    ...raw,
    seo: {
      title: raw.seo?.title ?? null,
      description: raw.seo?.description ?? null,
      shareImage: toContentImage(raw.seo?.shareImage),
    },
  };
}

export async function getHomeData(): Promise<HomeData> {
  if (!isSanityConfigured) {
    return {
      featured: placeholder.featured,
      sports: placeholder.sports,
      latest: placeholder.latest,
      about: placeholder.about,
    };
  }

  const raw = await fetchFrom<{
    featured: RawSummary[] | null;
    sports: { sport: Sport; count: number; cover: RawImage | null }[] | null;
    latest: RawGame | null;
    about: {
      name: string | null;
      headline: string | null;
      portrait: RawImage | null;
      services: RawService[] | null;
    } | null;
  }>(HOME_QUERY, {}, [TAGS.game, TAGS.about, TAGS.settings]);

  const sports: SportSummary[] = SPORTS.map((sport) => {
    const match = raw.sports?.find((entry) => entry.sport === sport);
    return {
      sport,
      count: match?.count ?? 0,
      cover: toContentImage(match?.cover),
    };
  });

  return {
    featured: (raw.featured ?? []).map(toSummary),
    sports,
    latest: raw.latest ? toGame(raw.latest) : null,
    about: {
      name: raw.about?.name ?? "",
      headline: raw.about?.headline ?? "",
      portrait: toContentImage(raw.about?.portrait),
      services: toServices(raw.about?.services),
    },
  };
}

export async function getAboutPage(): Promise<AboutPage> {
  if (!isSanityConfigured) return placeholder.aboutPage;

  const raw = await fetchFrom<{
    name: string | null;
    quote: string | null;
    bio: string[] | null;
    portrait: RawImage | null;
    services: RawService[] | null;
    photos: (RawImage | null)[] | null;
  } | null>(ABOUT_QUERY, {}, [TAGS.about]);

  if (!raw) return EMPTY_ABOUT;

  return {
    name: raw.name ?? "",
    quote: raw.quote ?? "",
    bio: raw.bio ?? [],
    portrait: toContentImage(raw.portrait),
    services: toServices(raw.services),
    photos: (raw.photos ?? []).map(toContentImage),
  };
}

export async function getWorkGames(): Promise<WorkGame[]> {
  if (!isSanityConfigured) return placeholder.workGames;

  const raw = await fetchFrom<
    (RawSummary & { date: string; statLine: string | null; hasVideo: boolean })[]
  >(WORK_QUERY, {}, [TAGS.game]);

  return raw.map((game) => ({
    ...toSummary(game),
    date: game.date,
    statLine: game.statLine ?? null,
    hasVideo: game.hasVideo,
  }));
}

export async function getGameSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return placeholder.games.map((game) => game.slug);

  return fetchFrom<string[]>(SLUGS_QUERY, {}, [TAGS.game], true);
}

export async function getGame(slug: string): Promise<GamePage | null> {
  if (!isSanityConfigured) {
    const games = placeholder.games;
    const at = games.findIndex((game) => game.slug === slug);
    if (at === -1) return null;

    const next = games.length > 1 ? games[(at + 1) % games.length] : null;
    return {
      game: games[at],
      next: next ? placeholder.toSummary(next) : null,
    };
  }

  const raw = await fetchFrom<(RawGame & { next: RawSummary | null }) | null>(
    GAME_QUERY,
    { slug },
    [TAGS.game],
  );

  if (!raw) return null;
  return {
    game: toGame(raw),
    next: raw.next ? toSummary(raw.next) : null,
  };
}
