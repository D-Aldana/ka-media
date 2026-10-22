import Link from "next/link";

import { NAV } from "@/lib/transitions";

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
  className?: string;
};

/**
 * Links, not buttons: the filter lives in the URL so sport tiles and shared
 * links land pre-filtered, and the chips still work without JS.
 */
export function FilterTabs({ tabs, label, className }: Props) {
  return (
    <div
      className={[styles.tabs, className].filter(Boolean).join(" ")}
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
          transitionTypes={NAV.filter}
        >
          {tab.label} {tab.count}
        </Link>
      ))}
    </div>
  );
}
