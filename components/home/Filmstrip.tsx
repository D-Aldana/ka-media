import Link from "next/link";
import { ViewTransition } from "react";

import { CoverImage } from "@/components/ui/CoverImage";
import { NAV, coverName } from "@/lib/transitions";
import type { FeaturedGame } from "@/lib/types";

import styles from "./Filmstrip.module.css";
import { HoverReel } from "./HoverReel";

/**
 * Below this the strip cannot fill a wide screen, so the duplicate copy would
 * read as the same game twice rather than as a loop. 300px frames + 20px gap.
 */
const MIN_TO_LOOP = 6;

/**
 * CSS-only marquee: the covers are rendered twice and the row slides half its
 * width, so the loop is seamless. The second copy is hidden from assistive
 * tech and the tab order. Too few games and it becomes a plain scroller.
 *
 * The strip stays a server component; only a frame that actually has a reel
 * gets the sliver of client code that plays it on hover.
 */
export function Filmstrip({ games }: { games: FeaturedGame[] }) {
  const looping = games.length >= MIN_TO_LOOP;

  return (
    <div className={styles.track} data-looping={looping || undefined}>
      <div className={styles.strip}>
        {(looping ? [0, 1] : [0]).map((copy) =>
          games.map((game, index) => {
            const cover = (
              <CoverImage
                image={game.cover}
                className={styles.media}
                sizes="(max-width: 860px) 220px, 300px"
                priority={copy === 0 && index < 4}
                decorative={copy === 1}
              />
            );

            const shot =
              /* Only the first copy pairs with the story it opens: two
                 elements sharing a `view-transition-name` make the browser
                 drop the whole transition, and the loop's second copy is
                 the same game over again. */
              copy === 0 ? (
                <ViewTransition
                  name={coverName("game", game.slug)}
                  share="morph"
                  default="none"
                >
                  {cover}
                </ViewTransition>
              ) : (
                cover
              );

            return (
              <Link
                key={`${copy}-${game._id}`}
                href={`/work/${game.slug}`}
                className={styles.frame}
                aria-hidden={copy === 1 || undefined}
                tabIndex={copy === 1 ? -1 : undefined}
                transitionTypes={NAV.forward}
              >
                <span className={styles.cap}>
                  <span>{game.code}</span>
                  <span>{game.sport}</span>
                </span>
                {game.reel ? (
                  <HoverReel
                    url={game.reel}
                    title={`${game.title} — reel`}
                    className={styles.shot}
                  >
                    {shot}
                  </HoverReel>
                ) : (
                  <span className={styles.shot}>{shot}</span>
                )}
              </Link>
            );
          }),
        )}
      </div>
    </div>
  );
}
