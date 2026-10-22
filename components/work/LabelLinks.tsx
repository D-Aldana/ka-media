import Link from "next/link";

import { NAV } from "@/lib/transitions";
import type { Label } from "@/lib/types";

import styles from "./LabelLinks.module.css";

/** A game's or single's labels, each opening the Work grid filtered to it. */
export function LabelLinks({ labels, className }: { labels: Label[]; className?: string }) {
  if (labels.length === 0) return null;

  return (
    <ul className={[styles.list, className].filter(Boolean).join(" ")} aria-label="Labels">
      {labels.map((label) => (
        <li key={label.slug}>
          <Link
            href={`/work?label=${label.slug}`}
            className={styles.link}
            transitionTypes={NAV.back}
          >
            {label.title.toLowerCase()}
          </Link>
        </li>
      ))}
    </ul>
  );
}
