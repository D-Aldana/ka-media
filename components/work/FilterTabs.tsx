import Link from "next/link";

import styles from "./FilterTabs.module.css";

export type FilterTab = {
  key: string;
  label: string;
  href: string;
  count: number;
  on: boolean;
};

type Props = {
  tabs: FilterTab[];
  /** Names the group for screen readers, e.g. "Filter by sport". */
  label: string;
  /** The smaller, wrapping row the labels use under the sport chips. */
  small?: boolean;
  className?: string;
};

/**
 * Links, not buttons: the filter lives in the URL so sport tiles and shared
 * links land pre-filtered, and the chips still work without JS.
 */
export function FilterTabs({ tabs, label, small = false, className }: Props) {
  return (
    <div
      className={[styles.tabs, small && styles.small, className].filter(Boolean).join(" ")}
      role="group"
      aria-label={label}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          replace
          scroll={false}
          className={[styles.chip, tab.on && styles.on].filter(Boolean).join(" ")}
          aria-current={tab.on ? "page" : undefined}
        >
          {tab.label} {tab.count}
        </Link>
      ))}
    </div>
  );
}
