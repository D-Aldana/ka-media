import Link from "next/link";

import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { NAV_LINKS } from "@/lib/nav";
import { NAV } from "@/lib/transitions";
import type { Settings } from "@/lib/types";

import { MobileMenu } from "./MobileMenu";
import styles from "./Header.module.css";

export function Header({ settings }: { settings: Settings }) {
  return (
    // Anchored during page transitions, so the content moves and the nav
    // doesn't. Inline rather than in the module: a `view-transition-name` is a
    // global ident, and nothing should be able to scope or hash it.
    <header
      className={styles.nav}
      id="top"
      style={{ viewTransitionName: "site-header" }}
    >
      <Link href="/" className={styles.wordmark} transitionTypes={NAV.page}>
        ka-media
      </Link>

      <nav className={styles.links} aria-label="Main">
        {NAV_LINKS.map((link) => (
          <UnderlineLink
            key={link.key}
            href={link.href}
            className={styles.link}
            data-nav={link.key}
            transitionTypes={NAV.page}
          >
            {link.label}
          </UnderlineLink>
        ))}
      </nav>

      <MobileMenu settings={settings} />
    </header>
  );
}
