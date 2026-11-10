import Link from "next/link";
import { ViewTransition } from "react";

import { CoverImage } from "@/components/ui/CoverImage";
import { NAV, coverName } from "@/lib/transitions";
import type { FeaturedGame } from "@/lib/types";

import styles from "./Filmstrip.module.css";
import { HoverReel } from "./HoverReel";
import { Marquee } from "./Marquee";

/**
 * Below this the strip cannot fill a wide screen, so a duplicate copy would
 * read as the same game twice rather than as a loop. 300px frames + 20px gap.
 */
const MIN_TO_LOOP = 6;

/**
 * Three copies, not two: the scroll-linked drift carries the row far enough
 * left that two would run out of frames at the right edge.
 */
const COPIES = [0, 1, 2];

/**
 * CSS-only marquee: the covers are rendered three times and the row slides a
 * third of its width, so the loop is seamless. Only the first copy is real —
 * the rest are hidden from assistive tech and the tab order, and are what the
 * `data-lead` attribute separates it from in CSS. Too few games and the strip
 * becomes a plain scroller.
 *
 * The strip stays a server component; the row's motion and a frame that
 * actually has a reel are the only slivers of client code.
 */
export function Filmstrip({ games }: { games: FeaturedGame[] }) {
  const looping = games.length >= MIN_TO_LOOP;

  return (
    <Marquee looping={looping}>
      {(looping ? COPIES : [0]).map((copy) =>
        games.map((game, index) => {
          const lead = copy === 0;

          const cover = (
            <CoverImage
              image={game.cover}
              className={styles.media}
              sizes="(max-width: 860px) 220px, 300px"
              priority={lead && index < 4}
              decorative={!lead}
            />
          );

          const shot =
            /* Only the first copy pairs with the story it opens: two
               elements sharing a `view-transition-name` make the browser
               drop the whole transition, and the loop's later copies are
               the same game over again. */
            lead ? (
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
              data-lead={lead || undefined}
              /* Position in the row, which paces its arrival. */
              style={lead ? ({ "--i": index } as React.CSSProperties) : undefined}
              aria-hidden={!lead || undefined}
              tabIndex={lead ? undefined : -1}
              transitionTypes={NAV.forward}
            >
              <span className={styles.cap}>
                <span>{game.code}</span>
                <span>{game.sport}</span>
              </span>
              {game.reel ? (
                <HoverReel
                  url={game.reel}
                  poster={game.cover?.url}
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
    </Marquee>
  );
}
