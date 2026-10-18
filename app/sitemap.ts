import type { MetadataRoute } from "next";

import { getWork } from "@/lib/content";
import { canonical } from "@/lib/site";

/**
 * Hidden games and singles are already filtered out by the query, so taking
 * them off the site takes them out of the sitemap too. Label filters aren't
 * listed: each one canonicalises to `/work`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { items } = await getWork();
  const newest = items[0]?.date;

  return [
    { url: canonical("/"), lastModified: newest, priority: 1 },
    { url: canonical("/work"), lastModified: newest, priority: 0.8 },
    { url: canonical("/about"), priority: 0.5 },
    { url: canonical("/contact"), priority: 0.5 },
    ...items.map((item) => ({
      url: canonical(item.kind === "game" ? `/work/${item.slug}` : `/work/photo/${item.slug}`),
      lastModified: item.date,
      priority: item.kind === "game" ? 0.7 : 0.6,
    })),
  ];
}
