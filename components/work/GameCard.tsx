import Link from "next/link";

import { splitStatLine } from "@/components/story/statLine";
import { CoverImage } from "@/components/ui/CoverImage";
import { formatDate } from "@/lib/format";
import type { WorkGame } from "@/lib/types";

import styles from "./GameCard.module.css";

type Props = {
  game: WorkGame;
  /** Filtered out: the card stays in place and fades back rather than moving. */
  dimmed?: boolean;
  /** Set on the first row, which holds the LCP image. */
  priority?: boolean;
};

export function GameCard({ game, dimmed = false, priority = false }: Props) {
  return (
    <Link
      href={`/work/${game.slug}`}
      className={[styles.card, dimmed && styles.off].filter(Boolean).join(" ")}
      tabIndex={dimmed ? -1 : undefined}
      aria-hidden={dimmed || undefined}
    >
      <span className={styles.frame}>
        <CoverImage
          image={game.cover}
          className={styles.cover}
          sizes="(max-width: 860px) 45vw, 22vw"
          priority={priority}
          decorative
        />
        {game.hasVideo && (
          <span className={styles.play}>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M4 2l8 5-8 5z" />
            </svg>
            <span className="sr-only">Includes film</span>
          </span>
        )}
        {game.statLine && (
          <span className={styles.stat}>
            {splitStatLine(game.statLine).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
        )}
      </span>

      <span className={styles.text}>
        <span className={styles.meta}>
          {game.code} · {game.sport} · {formatDate(game.date)}
        </span>
        <span className={styles.title}>{game.title}</span>
      </span>
    </Link>
  );
}
