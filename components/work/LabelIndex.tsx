import Link from "next/link";

import { NAV } from "@/lib/transitions";

import styles from "./LabelIndex.module.css";

export type IndexEntry = {
  slug: string;
  title: string;
  kind: "team" | "other";
  href: string;
  count: number;
  on: boolean;
};

type Props = {
  entries: IndexEntry[];
  /** Clears the label filter. Lit when no label is set. */
  allHref: string;
  allCount: number;
  anyOn: boolean;
};

/**
 * The label filter as a running index beside the grid rather than a row of
 * chips above it: a sticky column of mono lines, teams first. Links, not
 * buttons, so the filter stays in the URL and works without JS.
 */
export function LabelIndex({ entries, allHref, allCount, anyOn }: Props) {
  const groups = [
    { kind: "team" as const, heading: "Teams" },
    { kind: "other" as const, heading: "Other" },
  ].map((group) => ({
    ...group,
    entries: entries.filter((entry) => entry.kind === group.kind),
  }));

  return (
    <nav className={styles.index} aria-label="Filter by label">
      <ul className={styles.list}>
        <Row title="Everything" href={allHref} count={allCount} on={!anyOn} />
      </ul>

      {groups.map(
        (group) =>
          group.entries.length > 0 && (
            <div key={group.kind} className={styles.group}>
              <h2 className={styles.heading}>{group.heading}</h2>
              <ul className={styles.list}>
                {group.entries.map((entry) => (
                  <Row key={entry.slug} {...entry} />
                ))}
              </ul>
            </div>
          ),
      )}
    </nav>
  );
}

function Row({
  title,
  href,
  count,
  on,
}: {
  title: string;
  href: string;
  count: number;
  on: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        replace
        scroll={false}
        className={[styles.row, on && styles.on].filter(Boolean).join(" ")}
        aria-current={on ? "true" : undefined}
        transitionTypes={NAV.filter}
      >
        <span className={styles.name}>{title.toLowerCase()}</span>
        <span className={styles.count}>{count}</span>
      </Link>
    </li>
  );
}
