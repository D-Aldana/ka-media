import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import type { Settings } from "@/lib/types";

import styles from "./ContactCta.module.css";

export function ContactCta({ settings }: { settings: Settings }) {
  return (
    <section className={styles.section}>
      <Reveal>
        <span className={styles.label}>contact</span>
      </Reveal>
      <Reveal>
        <h2 className={styles.heading}>Let&rsquo;s work together.</h2>
      </Reveal>
      <Reveal className={styles.row}>
        <Pill href="/contact">Get in touch</Pill>
        <UnderlineLink href={`mailto:${settings.email}`}>
          {settings.email}
        </UnderlineLink>
        <UnderlineLink href={settings.instagramUrl}>
          {settings.instagramHandle}
        </UnderlineLink>
      </Reveal>
    </section>
  );
}
