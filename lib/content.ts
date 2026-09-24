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
  AboutSummary,
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
 * With no `NEXT_PUBLIC_SANITY_PROJECT_ID` set these fall back to
 * `placeholder-content.ts`, so the site still renders against an empty or
 * unreachable dataset.
 *
 * Two things are computed here rather than in GROQ: the `code` (01A, 02A …)
 * from each game's `rank` in date order, and images mapped to `ContentImage`.
 */

/** Cache tags let the publish webhook revalidate without a redeploy. */
const TAGS = { game: "game", about: "about", settings: "settings" };

function fetchFrom<T>(
  query: string,
  params: Record<string, unknown>,
  tags: string[],
  fresh = false,
): Promise<T> {
  return (fresh ? freshClient : client).fetch<T>(query, params, {
    next: { tags },
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

  const raw = await fetchFrom<Settings | null>(SETTINGS_QUERY, {}, [TAGS.settings]);
  return raw ?? placeholder.settings;
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

  const about: AboutSummary = {
    headline: raw.about?.headline ?? "",
    portrait: toContentImage(raw.about?.portrait),
    services: toServices(raw.about?.services),
  };

  return {
    featured: (raw.featured ?? []).map(toSummary),
    sports,
    latest: raw.latest ? toGame(raw.latest) : null,
    about,
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

  if (!raw) return placeholder.aboutPage;

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
