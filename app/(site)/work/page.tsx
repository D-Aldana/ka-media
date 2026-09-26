import type { Metadata } from "next";

import { FilterTabs } from "@/components/work/FilterTabs";
import { GameCard } from "@/components/work/GameCard";
import { getWorkGames } from "@/lib/content";
import { sportLabel } from "@/lib/format";
import { SPORTS, type Sport } from "@/lib/types";

import styles from "./page.module.css";

type Props = { searchParams: Promise<{ sport?: string }> };

/**
 * Shared filter links describe what they open, not just "Work". Each one
 * canonicalises to `/work`, since the filter is the same games re-sorted.
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sport = activeSport((await searchParams).sport);

  if (sport === "all") {
    return {
      title: "Work",
      description:
        "Every game — basketball, soccer and football in Prince George, BC. Tap through any game as a story.",
      alternates: { canonical: "/work" },
    };
  }

  return {
    title: `${sportLabel(sport)} · Work`,
    description: `Every ${sport} game shot in Prince George, BC. Tap through any game as a story.`,
    alternates: { canonical: "/work" },
  };
}

function activeSport(sport: string | undefined): Sport | "all" {
  return SPORTS.includes(sport as Sport) ? (sport as Sport) : "all";
}

/**
 * The filter lives in the URL, so this renders per request rather than
 * statically. Reading `?sport` on the server keeps the grid in the HTML and
 * working without JS; the dimming still animates because a soft navigation
 * only swaps the card classNames.
 */
export default async function WorkPage({ searchParams }: Props) {
  const [{ sport }, games] = await Promise.all([searchParams, getWorkGames()]);

  const active = activeSport(sport);

  const counts = Object.fromEntries(
    SPORTS.map((s) => [s, games.filter((game) => game.sport === s).length]),
  ) as Record<Sport, number>;

  const shown = active === "all" ? games.length : counts[active];

  /* The first cards the visitor actually reads, which is not the first four
     grid positions once a filter dims the top of the list. */
  const eager = new Set(
    games
      .filter((game) => active === "all" || game.sport === active)
      .slice(0, 4)
      .map((game) => game._id),
  );

  return (
    <section className={styles.page} data-route="work">
      <div className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.label} aria-live="polite">
            {active === "all" ? "all sports" : active} · {shown}{" "}
            {shown === 1 ? "game" : "games"}
          </span>
          <h1 className={styles.title}>Work</h1>
        </div>
        <FilterTabs active={active} counts={counts} total={games.length} />
      </div>

      {shown === 0 && (
        <p className={styles.empty}>
          {active === "all" ? "No games yet." : `No ${active} games yet.`}
        </p>
      )}

      <div className={styles.grid}>
        {games.map((game) => (
          <GameCard
            key={game._id}
            game={game}
            dimmed={active !== "all" && game.sport !== active}
            priority={eager.has(game._id)}
          />
        ))}
      </div>
    </section>
  );
}
