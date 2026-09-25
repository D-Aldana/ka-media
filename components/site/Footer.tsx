import { UnderlineLink } from "@/components/ui/UnderlineLink";
import type { Settings } from "@/lib/types";

import styles from "./Footer.module.css";

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className={styles.footer}>
      <span>
        © {new Date().getFullYear()} ka-media
        {settings.location && ` · ${settings.location}`}
      </span>
      <div className={styles.links}>
        {settings.instagramUrl && (
          <UnderlineLink href={settings.instagramUrl}>Instagram</UnderlineLink>
        )}
        <UnderlineLink href="#top">Back to top ↑</UnderlineLink>
      </div>
    </footer>
  );
}
