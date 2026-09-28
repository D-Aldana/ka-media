import type { MetadataRoute } from "next";

import { canonical } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The Studio is behind Sanity's own login, and has nothing to index.
      disallow: "/studio",
    },
    sitemap: canonical("/sitemap.xml"),
  };
}
