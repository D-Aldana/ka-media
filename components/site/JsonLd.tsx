import { sportLabel } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import { SPORTS, type AboutSummary, type Settings } from "@/lib/types";

/**
 * `Prince George, BC` → the two address parts schema.org wants separately.
 * Settings stores the display string, so this is the only place that splits it.
 */
function splitLocation(location: string) {
  const [locality, region] = location.split(",").map((part) => part.trim());
  return { locality: locality || undefined, region: region || undefined };
}

function LdScript({ graph }: { graph: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify drops undefined fields, so an unfilled one never renders empty.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

/**
 * Person + ProfessionalService + WebSite for the home page, which is the one
 * page search engines read as "who is this site". Every field comes from
 * Settings and About, so an unfilled Studio omits it rather than publishing
 * blanks.
 */
export function JsonLd({
  settings,
  about,
}: {
  settings: Settings;
  about: AboutSummary;
}) {
  if (!about.name) return null;

  const sameAs = settings.instagramUrl ? [settings.instagramUrl] : undefined;
  const email = settings.email || undefined;
  const { locality, region } = splitLocation(settings.location || "");

  // The site is en_CA and the region is a province, so the country is implied.
  const address = locality
    ? {
        "@type": "PostalAddress",
        addressLocality: locality,
        addressRegion: region,
        addressCountry: "CA",
      }
    : undefined;

  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: about.name,
    url: siteUrl,
    jobTitle: "Sports photographer and filmmaker",
    image: about.portrait?.url,
    email,
    sameAs,
    address,
    worksFor: { "@id": `${siteUrl}/#business` },
    knowsAbout: [
      "Sports photography",
      ...SPORTS.map((sport) => `${sportLabel(sport)} photography`),
      "Highlight films",
    ],
  };

  const services = about.services.length
    ? {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: about.services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.description || undefined,
          },
        })),
      }
    : undefined;

  // ProfessionalService rather than plain LocalBusiness: same fields, but it
  // tells Google this is a service without a storefront to walk into.
  const business = {
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#business`,
    name: "ka-media",
    url: siteUrl,
    image: settings.seo.shareImage?.url,
    description: settings.seo.description || undefined,
    email,
    sameAs,
    founder: { "@id": person["@id"] },
    address,
    areaServed: locality ? { "@type": "City", name: locality } : undefined,
    hasOfferCatalog: services,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "ka-media",
    inLanguage: "en-CA",
    publisher: { "@id": business["@id"] },
  };

  return (
    <LdScript
      graph={{ "@context": "https://schema.org", "@graph": [person, business, website] }}
    />
  );
}

/**
 * Breadcrumbs for a game page, so results show `ka-media › Work › <game>`
 * instead of a bare URL.
 */
export function GameBreadcrumbs({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const trail = [
    { name: "Home", item: siteUrl },
    { name: "Work", item: `${siteUrl}/work` },
    { name: title, item: `${siteUrl}/work/${slug}` },
  ];

  return (
    <LdScript
      graph={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: entry.name,
          item: entry.item,
        })),
      }}
    />
  );
}
