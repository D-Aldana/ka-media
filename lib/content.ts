import * as placeholder from "./placeholder-content";
import type { AboutPage, GamePage, HomeData, Settings, WorkGame } from "./types";

/**
 * The only seam between the UI and the CMS. Sanity is not wired up yet, so
 * these read from `placeholder-content.ts`. Swapping in `next-sanity` means
 * replacing the bodies — the returned shapes stay as they are.
 *
 * getSettings():
 *   *[_type=="settings"][0]{email, instagram, location}
 *
 * getHomeData():
 *   {
 *     "featured": *[_type=="game" && featured && !hidden]
 *       | order(date desc)[0...10]{_id,title,"slug":slug.current,sport,cover},
 *     "sports": [
 *       {"sport":"basketball",
 *        "count": count(*[_type=="game" && sport=="basketball" && !hidden]),
 *        "cover": *[_type=="game" && sport=="basketball" && !hidden]
 *                 | order(date desc)[0].cover}, ...
 *     ],
 *     "latest": coalesce(*[_type=="settings"][0].latestGame->,
 *                        *[_type=="game" && !hidden] | order(date desc)[0]){...},
 *     "about": *[_type=="about"][0]{headline, portrait, services}
 *   }
 *
 * getWorkGames():
 *   *[_type=="game" && !hidden] | order(date desc){
 *     _id, title, "slug": slug.current, sport, date, statLine, cover,
 *     "hasVideo": count(stories[_type=="storyVideo"]) > 0
 *   }
 *
 * getAboutPage():
 *   *[_type=="about"][0]{name, quote, bio, portrait,
 *                        services[]{_key, title, description}, photos[]}
 *
 * The About page needs three fields the PRD's `about` singleton does not list:
 * `name` for the heading, `quote` for the pull quote (the home summary keeps
 * the shorter `headline`), and a description per service.
 *
 * Two things are computed after the query rather than in it: the `code`
 * (01A, 02A…) comes from each game's position in date order, and images are
 * mapped to `ContentImage` by `lib/image.ts`.
 */
export async function getSettings(): Promise<Settings> {
  return placeholder.settings;
}

export async function getHomeData(): Promise<HomeData> {
  return {
    featured: placeholder.featured,
    sports: placeholder.sports,
    latest: placeholder.latest,
    about: placeholder.about,
  };
}

export async function getAboutPage(): Promise<AboutPage> {
  return placeholder.aboutPage;
}

export async function getWorkGames(): Promise<WorkGame[]> {
  return placeholder.workGames;
}

export async function getGameSlugs(): Promise<string[]> {
  return placeholder.games.map((game) => game.slug);
}

/**
 * The next game is the one after this in date order, wrapping to the newest so
 * the oldest game still has somewhere to send a visitor.
 */
export async function getGame(slug: string): Promise<GamePage | null> {
  const games = placeholder.games;
  const at = games.findIndex((game) => game.slug === slug);
  if (at === -1) return null;

  const next = games.length > 1 ? games[(at + 1) % games.length] : null;
  return {
    game: games[at],
    next: next ? placeholder.toSummary(next) : null,
  };
}
