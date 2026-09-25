import Link from "next/link";

import { CoverImage } from "@/components/ui/CoverImage";
import type { GameSummary } from "@/lib/types";

import styles from "./Filmstrip.module.css";

/**
 * Below this the strip cannot fill a wide screen, so the duplicate copy would
 * read as the same game twice rather than as a loop. 300px frames + 20px gap.
 */
const MIN_TO_LOOP = 6;

/**
 * CSS-only marquee: the covers are rendered twice and the row slides half its
 * width, so the loop is seamless. The second copy is hidden from assistive
 * tech and the tab order. Too few games and it becomes a plain scroller.
 */
export function Filmstrip({ games }: { games: GameSummary[] }) {
  const looping = games.length >= MIN_TO_LOOP;

  return (
    <div className={styles.track} data-looping={looping || undefined}>
      <div className={styles.strip}>
        {(looping ? [0, 1] : [0]).map((copy) =>
          games.map((game, index) => (
            <Link
              key={`${copy}-${game._id}`}
              href={`/work/${game.slug}`}
              className={styles.frame}
              aria-hidden={copy === 1 || undefined}
              tabIndex={copy === 1 ? -1 : undefined}
            >
              <span className={styles.cap}>
                <span>{game.code}</span>
                <span>{game.sport}</span>
              </span>
              <CoverImage
                image={game.cover}
                className={styles.media}
                sizes="(max-width: 860px) 220px, 300px"
                priority={copy === 0 && index < 4}
                decorative={copy === 1}
              />
            </Link>
          )),
        )}
      </div>
    </div>
  );
}
