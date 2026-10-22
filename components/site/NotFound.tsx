import Link from "next/link";
import type { CSSProperties } from "react";

import { NAV } from "@/lib/transitions";

import styles from "./NotFound.module.css";

/** Ways back in. A 404 with one link is a dead end; these are the three
    places someone who mistyped a URL actually wanted. */
const EXITS = [
  {
    label: "work",
    value: "All games",
    note: "Every game-day set and highlight film.",
    href: "/work",
  },
  {
    label: "home",
    value: "Start from the top",
    note: "The latest work, front page.",
    href: "/",
  },
  {
    label: "contact",
    value: "Get in touch",
    note: "If you were after something specific.",
    href: "/contact",
  },
];

type Props = {
  /** Replaces the default line under the headline — the site group knows a
      missing game is the likely cause. */
  blurb?: string;
  /** Outside the site group there is no nav, so the page carries the wordmark
      itself rather than leaving the visitor with no way home and no idea
      whose site they landed on. */
  bare?: boolean;
};

const DEFAULT_BLURB =
  "The link may be wrong, or the frame may have come off the sheet.";

export function NotFound({ blurb = DEFAULT_BLURB, bare = false }: Props) {
  const classes = [styles.page, bare && styles.bare].filter(Boolean).join(" ");

  return (
    <div className={classes} data-route="not-found">
      {bare && (
        <Link href="/" className={styles.wordmark}>
          ka-media
        </Link>
      )}

      <header className={styles.intro}>
        <span className={styles.eyebrow}>404 · frame not found</span>
        <h1 className={styles.headline}>
          That page
          <br />
          isn&rsquo;t here.
        </h1>
        <p className={styles.blurb}>{blurb}</p>
      </header>

      <ul className={styles.strip}>
        {EXITS.map((exit, index) => (
          <li
            key={exit.href}
            className={styles.cell}
            style={{ "--i": index } as CSSProperties}
          >
            <Link
              href={exit.href}
              className={styles.frame}
              transitionTypes={NAV.page}
            >
              <span className={styles.label}>{exit.label}</span>
              <span className={styles.value}>{exit.value}</span>
              <span className={styles.note}>{exit.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
