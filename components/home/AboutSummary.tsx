import { CoverImage } from "@/components/ui/CoverImage";
import { Reveal } from "@/components/ui/Reveal";
import type { AboutSummary as AboutSummaryType } from "@/lib/types";

import styles from "./AboutSummary.module.css";

export function AboutSummary({ about }: { about: AboutSummaryType }) {
  return (
    <section className={styles.section}>
      <div className={styles.split}>
        {about.portrait ? (
          <Reveal className={styles.portrait}>
            <CoverImage
              image={about.portrait}
              className={styles.fill}
              sizes="(max-width: 860px) calc(100vw - 32px), 45vw"
            />
          </Reveal>
        ) : (
          <Reveal className={`${styles.portrait} ${styles.portraitEmpty}`}>
            <span>[portrait of Krystien on the sideline]</span>
          </Reveal>
        )}

        <Reveal className={styles.copy}>
          <div className={styles.intro}>
            <span className={styles.label}>about</span>
            <p className={styles.headline}>{about.headline}</p>
          </div>

          <div>
            {about.services.map((service, index) => (
              <div key={service._key} className={styles.service}>
                <span>{service.title}</span>
                <span className={styles.label}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
