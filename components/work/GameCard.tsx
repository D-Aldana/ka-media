import Link from "next/link";
import { ViewTransition } from "react";

import { splitStatLine } from "@/components/story/statLine";
import { CoverImage } from "@/components/ui/CoverImage";
import { formatDate } from "@/lib/format";
import { NAV, coverName } from "@/lib/transitions";
import type { WorkGame } from "@/lib/types";

import styles from "./GameCard.module.css";

type Props = {
  game: WorkGame;
  /** Set on the first row, which holds the LCP image. */
  priority?: boolean;
};

export function GameCard({ game, priority = false }: Props) {
  return (
    <Link
      href={`/work/${game.slug}`}
      className={styles.card}
      transitionTypes={NAV.forward}
    >
      {/* Paired with the story deck this opens, so the cover flies into the
          frame rather than the two swapping. `default="none"` keeps it still
          during navigations that have nothing to do with this card. */}
      <ViewTransition
        name={coverName("game", game.slug)}
        share="morph"
        default="none"
      >
        <span className={styles.frame}>
          <CoverImage
            image={game.cover}
            className={styles.cover}
            sizes="(max-width: 860px) 45vw, 26vw"
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
      </ViewTransition>

      <span className={styles.text}>
        <span className={styles.meta}>
          {game.code} · {game.sport} · {formatDate(game.date)}
        </span>
        <span className={styles.title}>{game.title}</span>
      </span>
    </Link>
  );
}
