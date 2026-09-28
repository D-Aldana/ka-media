/**
 * The absolute origin metadata, the sitemap and robots.txt all need.
 *
 * `NEXT_PUBLIC_SITE_URL` wins once the domain is connected. Until then Vercel's
 * production URL keeps the deployed site pointing at itself rather than at a
 * domain that does not resolve yet, which would put wrong URLs in the sitemap.
 */
function origin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const siteUrl = origin();

export const canonical = (path: string) => new URL(path, siteUrl).href;
