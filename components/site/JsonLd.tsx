import { sportLabel } from "@/lib/format";
import { videoThumbnail } from "@/lib/image";
import { siteUrl } from "@/lib/site";
import { GAME_SPORTS, type AboutSummary, type Settings, type StoryItem } from "@/lib/types";

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
 * Person + WebSite for the home page, which is the one
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
    knowsAbout: [
      "Sports photography",
      ...GAME_SPORTS.map((sport) => `${sportLabel(sport)} photography`),
      "Highlight films",
    ],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "ka-media",
    inLanguage: "en-CA",
    description: settings.seo.description || undefined,
    publisher: { "@id": person["@id"] },
  };

  // Declares ka-media as a local service business with a service area —
  // Person + WebSite alone say who runs the site, not what it offers or where.
  const business = {
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#business`,
    name: "ka-media",
    url: siteUrl,
    image: about.portrait?.url,
    email,
    address,
    areaServed: locality ? `${locality}, ${region}` : undefined,
    sameAs,
    founder: { "@id": person["@id"] },
  };

  return (
    <LdScript
      graph={{ "@context": "https://schema.org", "@graph": [person, website, business] }}
    />
  );
}

/**
 * Breadcrumbs for a game or single page, so results show
 * `ka-media › Work › <title>` instead of a bare URL.
 */
export function Breadcrumbs({ title, path }: { title: string; path: string }) {
  const trail = [
    { name: "Home", item: siteUrl },
    { name: "Work", item: `${siteUrl}/work` },
    { name: title, item: `${siteUrl}${path}` },
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

/**
 * One `VideoObject` per reel in a game's story, so each has a real shot at a
 * video thumbnail in search results — Google requires `thumbnailUrl` and
 * `contentUrl` for that, and the reel's poster (already required in the
 * Studio) is what backs it.
 */
export function VideoSchema({
  stories,
  title,
  uploadDate,
  path,
}: {
  stories: StoryItem[];
  title: string;
  /** `game.date`, already `YYYY-MM-DD` — valid ISO 8601 on its own. */
  uploadDate: string;
  path: string;
}) {
  const videos = stories.flatMap((item, index) => {
    if (item._type !== "storyVideo") return [];
    const thumbnailUrl = videoThumbnail(item.poster);
    if (!thumbnailUrl) return [];

    return [
      {
        "@type": "VideoObject",
        "@id": `${siteUrl}${path}#video-${index + 1}`,
        name: item.caption || `${title} — reel ${index + 1}`,
        description: item.caption || `${title} highlight film.`,
        thumbnailUrl: [thumbnailUrl],
        contentUrl: item.url,
        uploadDate,
      },
    ];
  });

  if (videos.length === 0) return null;

  return <LdScript graph={{ "@context": "https://schema.org", "@graph": videos }} />;
}

/** FAQPage schema for the Contact page's FAQ section. */
export function FaqSchema({ items }: { items: { question: string; answer: string }[] }) {
  if (items.length === 0) return null;

  return (
    <LdScript
      graph={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}
