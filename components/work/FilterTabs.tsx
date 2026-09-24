import Link from "next/link";

import { sportLabel } from "@/lib/format";
import { SPORTS, type Sport } from "@/lib/types";

import styles from "./FilterTabs.module.css";

type Props = {
  active: Sport | "all";
  counts: Record<Sport, number>;
  total: number;
};

/**
 * Links, not buttons: the filter lives in the URL so sport tiles and shared
 * links land pre-filtered, and the chips still work without JS.
 */
export function FilterTabs({ active, counts, total }: Props) {
  const tabs: { key: Sport | "all"; label: string; href: string; count: number }[] = [
    { key: "all", label: "All", href: "/work", count: total },
    ...SPORTS.map((sport) => ({
      key: sport,
      label: sportLabel(sport),
      href: `/work?sport=${sport}`,
      count: counts[sport],
    })),
  ];

  return (
    <div className={styles.tabs} role="group" aria-label="Filter by sport">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          replace
          scroll={false}
          className={[styles.chip, tab.key === active && styles.on]
            .filter(Boolean)
            .join(" ")}
          aria-current={tab.key === active ? "page" : undefined}
        >
          {tab.label} {tab.count}
        </Link>
      ))}
    </div>
  );
}
