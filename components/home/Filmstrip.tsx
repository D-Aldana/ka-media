import Link from "next/link";

import { CoverImage } from "@/components/ui/CoverImage";
import type { GameSummary } from "@/lib/types";

import styles from "./Filmstrip.module.css";

/**
 * CSS-only marquee: the covers are rendered twice and the row slides half its
 * width, so the loop is seamless. The second copy is hidden from assistive
 * tech and the tab order.
 */
export function Filmstrip({ games }: { games: GameSummary[] }) {
  return (
    <div className={styles.track}>
      <div className={styles.strip}>
        {[0, 1].map((copy) =>
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
