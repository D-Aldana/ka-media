import * as placeholder from "./placeholder-content";
import type { HomeData, Settings } from "./types";

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
 *       | order(date desc)[0...10]{title,"slug":slug.current,sport,cover},
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
