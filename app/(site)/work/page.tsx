import type { Metadata } from "next";

import { PageTransition } from "@/components/site/PageTransition";
import { FilterTabs, type FilterTab } from "@/components/work/FilterTabs";
import { GameCard } from "@/components/work/GameCard";
import { SingleCard } from "@/components/work/SingleCard";
import { getWork } from "@/lib/content";
import { sportLabel } from "@/lib/format";
import { SPORTS, type Label, type Sport, type WorkItem } from "@/lib/types";

import styles from "./page.module.css";

type Props = { searchParams: Promise<{ sport?: string; label?: string }> };

/**
 * Shared filter links describe what they open, not just "Work". Each one
 * canonicalises to `/work`, since the filter is the same work re-sorted.
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const [params, { labels }] = await Promise.all([searchParams, getWork()]);
  const sport = activeSport(params.sport);
  const label = activeLabel(params.label, labels);
  const alternates = { canonical: "/work" };

  if (label) {
    return {
      title: `${label.title} — Prince George sports photography`,
      description:
        label.kind === "team"
          ? `Every ${label.title} game and photo, shot in Prince George, BC.`
          : `${label.title} — photos shot in Prince George, BC.`,
      alternates,
    };
  }

  if (sport === "all") {
    return {
      title: "Work — Prince George sports photography",
      description:
        "Every game and photo — basketball, soccer and football in Prince George, BC. Tap through any game as a story.",
      alternates,
    };
  }

  if (sport === "other") {
    return {
      title: "Headshots, team photos and more — Prince George",
      description:
        "Headshots, team photos and everything that isn't game action, shot in Prince George, BC.",
      alternates,
    };
  }

  return {
    title: `${sportLabel(sport)} photography in Prince George`,
    description: `Every ${sport} game and photo shot in Prince George, BC. Tap through any game as a story.`,
    alternates,
  };
}

function activeSport(sport: string | undefined): Sport | "all" {
  return SPORTS.includes(sport as Sport) ? (sport as Sport) : "all";
}

/** An unknown or retired label slug is ignored, not an empty grid. */
function activeLabel(slug: string | undefined, labels: Label[]): Label | null {
  return labels.find((label) => label.slug === slug) ?? null;
}

/** Both filters live in the URL; each chip keeps the other one set. */
function workHref(sport: Sport | "all", label: string | null): string {
  const params = new URLSearchParams();
  if (sport !== "all") params.set("sport", sport);
  if (label) params.set("label", label);
  const query = params.toString();
  return query ? `/work?${query}` : "/work";
}

function matches(item: WorkItem, sport: Sport | "all", label: string | null): boolean {
  return (sport === "all" || item.sport === sport) && (!label || item.labels.includes(label));
}

function plural(count: number, word: string): string {
  return `${count} ${count === 1 ? word : `${word}s`}`;
}

/**
 * The filter lives in the URL, so this renders per request rather than
 * statically. Reading `?sport` and `?label` on the server keeps the grid in
 * the HTML and working without JS; the dimming still animates because a soft
 * navigation only swaps the card classNames.
 *
 * Each row's counts are taken within the other row's filter, so a chip always
 * says how many cards it would leave lit.
 */
export default async function WorkPage({ searchParams }: Props) {
  const [params, { items, labels }] = await Promise.all([searchParams, getWork()]);

  const sport = activeSport(params.sport);
  const label = activeLabel(params.label, labels);
  const labelSlug = label?.slug ?? null;

  const inLabel = items.filter((item) => matches(item, "all", labelSlug));
  const inSport = items.filter((item) => matches(item, sport, null));
  const shown = items.filter((item) => matches(item, sport, labelSlug));

  const sportTabs: FilterTab[] = [
    {
      key: "all",
      label: "All",
      href: workHref("all", labelSlug),
      count: inLabel.length,
      on: sport === "all",
    },
    ...SPORTS.map((s) => ({
      key: s,
      label: sportLabel(s),
      href: workHref(s, labelSlug),
      count: inLabel.filter((item) => item.sport === s).length,
      on: s === sport,
    })).filter((tab) => tab.count > 0 || tab.on),
  ];

  const labelTabs: FilterTab[] = labels
    .map((l) => ({
      key: l.slug,
      label: l.title,
      // The lit chip clears itself, so the row needs no "all" of its own.
      href: workHref(sport, l.slug === labelSlug ? null : l.slug),
      count: inSport.filter((item) => item.labels.includes(l.slug)).length,
      on: l.slug === labelSlug,
    }))
    .filter((tab) => tab.count > 0 || tab.on);

  const games = shown.filter((item) => item.kind === "game").length;
  const singles = shown.length - games;
  const summary = [
    sport === "all" ? "all sports" : sport,
    label?.title.toLowerCase(),
    games > 0 || singles === 0 ? plural(games, "game") : null,
    singles > 0 ? plural(singles, "single") : null,
  ]
    .filter(Boolean)
    .join(" · ");

  /* The first cards the visitor actually reads, which is not the first four
     grid positions once a filter dims the top of the list. */
  const eager = new Set(shown.slice(0, 4).map((item) => item._id));
  const filtered = sport !== "all" || label !== null;

  return (
    <PageTransition>
      <section className={styles.page} data-route="work">
        <div className={[styles.head, labelTabs.length > 0 && styles.headTight].filter(Boolean).join(" ")}>
          <div className={styles.headText}>
            <span className={styles.label} aria-live="polite">
              {summary}
            </span>
            <h1 className={styles.title}>Work</h1>
          </div>
          <FilterTabs tabs={sportTabs} label="Filter by sport" />
        </div>

        {labelTabs.length > 0 && (
          <FilterTabs tabs={labelTabs} label="Filter by label" small className={styles.labels} />
        )}

        {shown.length === 0 && (
          <p className={styles.empty}>
            {filtered ? "Nothing here yet." : "No work yet."}
          </p>
        )}

        <div className={styles.grid}>
          {items.map((item) => {
            const dimmed = !matches(item, sport, labelSlug);
            const priority = eager.has(item._id);

            return item.kind === "game" ? (
              <GameCard key={item._id} game={item} dimmed={dimmed} priority={priority} />
            ) : (
              <SingleCard key={item._id} single={item} dimmed={dimmed} priority={priority} />
            );
          })}
        </div>
      </section>
    </PageTransition>
  );
}
