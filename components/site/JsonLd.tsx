import { siteUrl } from "@/lib/site";
import type { Settings } from "@/lib/types";

/**
 * Person + LocalBusiness for the home page, which is the one page search
 * engines read as "who is this site". Every field comes from Settings and
 * About, so an unfilled Studio omits it rather than publishing blanks.
 */
export function JsonLd({ settings, name }: { settings: Settings; name: string }) {
  if (!name) return null;

  const sameAs = settings.instagramUrl ? [settings.instagramUrl] : undefined;
  const email = settings.email || undefined;

  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name,
    url: siteUrl,
    jobTitle: "Sports photographer and filmmaker",
    email,
    sameAs,
  };

  const business = {
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: "ka-media",
    url: siteUrl,
    image: settings.seo.shareImage?.url,
    description: settings.seo.description || undefined,
    email,
    sameAs,
    founder: { "@id": person["@id"] },
    areaServed: settings.location || undefined,
    address: settings.location
      ? { "@type": "PostalAddress", addressLocality: settings.location }
      : undefined,
  };

  const graph = { "@context": "https://schema.org", "@graph": [person, business] };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify drops the undefined fields above, so nothing renders empty.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
