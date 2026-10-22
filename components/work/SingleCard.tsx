import Link from "next/link";
import { ViewTransition } from "react";

import { CoverImage } from "@/components/ui/CoverImage";
import { formatDate } from "@/lib/format";
import { NAV, coverName } from "@/lib/transitions";
import type { WorkSingle } from "@/lib/types";

import styles from "./GameCard.module.css";

type Props = {
  single: WorkSingle;
  /** Set on the first row, which holds the LCP image. */
  priority?: boolean;
};

/** A single photo in the Work grid: a game card's frame, labelled `single`. */
export function SingleCard({ single, priority = false }: Props) {
  return (
    <Link
      href={`/work/photo/${single.slug}`}
      className={styles.card}
      transitionTypes={NAV.forward}
    >
      <ViewTransition
        name={coverName("single", single.slug)}
        share="morph"
        default="none"
      >
        <span className={styles.frame}>
          <CoverImage
            image={single.image}
            className={styles.cover}
            sizes="(max-width: 860px) 45vw, 22vw"
            priority={priority}
            decorative
          />
          {single.caption && (
            <span className={styles.stat}>
              <span>{single.caption}</span>
            </span>
          )}
        </span>
      </ViewTransition>

      <span className={styles.text}>
        <span className={styles.meta}>
          single · {single.sport} · {formatDate(single.date)}
        </span>
        <span className={styles.title}>{single.title}</span>
      </span>
    </Link>
  );
}
