import type { MetadataRoute } from "next";

import { getWorkGames } from "@/lib/content";
import { canonical } from "@/lib/site";

/**
 * Hidden games are already filtered out by the query, so taking games off the
 * site takes them out of the sitemap too.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await getWorkGames();
  const newest = games[0]?.date;

  return [
    { url: canonical("/"), lastModified: newest, priority: 1 },
    { url: canonical("/work"), lastModified: newest, priority: 0.8 },
    { url: canonical("/about"), priority: 0.5 },
    { url: canonical("/contact"), priority: 0.5 },
    ...games.map((game) => ({
      url: canonical(`/work/${game.slug}`),
      lastModified: game.date,
      priority: 0.7,
    })),
  ];
}
