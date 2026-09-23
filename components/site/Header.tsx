import Link from "next/link";

import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { NAV_LINKS } from "@/lib/nav";
import type { Settings } from "@/lib/types";

import { MobileMenu } from "./MobileMenu";
import styles from "./Header.module.css";

export function Header({ settings }: { settings: Settings }) {
  return (
    <header className={styles.nav} id="top">
      <Link href="/" className={styles.wordmark}>
        kamedia
      </Link>

      <nav className={styles.links} aria-label="Main">
        {NAV_LINKS.map((link) => (
          <UnderlineLink
            key={link.key}
            href={link.href}
            className={styles.link}
            data-nav={link.key}
          >
            {link.label}
          </UnderlineLink>
        ))}
      </nav>

      <MobileMenu settings={settings} />
    </header>
  );
}
