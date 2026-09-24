import { Pill } from "@/components/ui/Pill";
import type { GameSummary, Settings } from "@/lib/types";

import { Filmstrip } from "./Filmstrip";
import styles from "./Hero.module.css";

type Props = {
  featured: GameSummary[];
  settings: Settings;
};

export function Hero({ featured, settings }: Props) {
  return (
    <section className={styles.hero}>
      <Filmstrip games={featured} />

      <div className={styles.text}>
        <h1 className={`${styles.title} ${styles.rise}`}>
          Game-day photo &amp; film.
        </h1>
        <p className={`${styles.meta} ${styles.rise} ${styles.delayed}`}>
          <span>Basketball, soccer, football</span>
          <span>{settings.location}</span>
        </p>
        <Pill href="/contact" variant="solid" className={styles.cta}>
          Get in touch
        </Pill>
      </div>
    </section>
  );
}
