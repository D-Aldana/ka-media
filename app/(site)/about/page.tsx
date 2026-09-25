import type { Metadata } from "next";

import { CoverImage } from "@/components/ui/CoverImage";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";
import { getAboutPage, getSettings } from "@/lib/content";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Krystien Aldana shoots game-day photography, highlight and recruiting films, and social-ready edits for teams in Prince George, BC.",
};

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAboutPage(), getSettings()]);

  return (
    <div className={styles.page} data-route="about">
      <section className={styles.hero}>
        <CoverImage
          image={about.portrait}
          className={styles.portrait}
          sizes="(max-width: 860px) calc(100vw - 32px), 45vw"
          priority
        />

        <div className={styles.intro}>
          <span className={`${styles.label} ${styles.rise} ${styles.d1}`}>
            about{settings.location && ` · ${settings.location.toLowerCase()}`}
          </span>
          <h1 className={`${styles.name} ${styles.rise} ${styles.d1}`}>
            {about.name}
          </h1>
          <p className={`${styles.quote} ${styles.rise} ${styles.d2}`}>
            {about.quote}
          </p>
          <div className={`${styles.bio} ${styles.rise} ${styles.d3}`}>
            {about.bio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.services}>
        <Reveal>
          <h2 className={styles.heading}>What I shoot</h2>
        </Reveal>
        <Reveal className={styles.serviceList}>
          {about.services.map((service, index) => (
            <div key={service._key} className={styles.service}>
              <span className={styles.label}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceText}>{service.description}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <Reveal className={styles.photos}>
        {about.photos.slice(0, 3).map((photo, index) => (
          <CoverImage
            key={photo?.url ?? index}
            image={photo}
            className={styles.photo}
            sizes="(max-width: 860px) 260px, 30vw"
          />
        ))}
      </Reveal>

      <section className={styles.cta}>
        <Reveal>
          <h2 className={styles.ctaHeading}>Got a game coming up?</h2>
        </Reveal>
        <Reveal className={styles.ctaAction}>
          <Pill href="/contact">Get in touch →</Pill>
        </Reveal>
      </section>
    </div>
  );
}
