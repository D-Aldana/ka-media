import type { Metadata } from "next";

import { PageTransition } from "@/components/site/PageTransition";
import { ClientList } from "@/components/ui/ClientList";
import { CoverImage } from "@/components/ui/CoverImage";
import { Pill } from "@/components/ui/Pill";
import { NAV } from "@/lib/transitions";
import { Reveal } from "@/components/ui/Reveal";
import { getAboutPage, getSettings } from "@/lib/content";
import { ogImage } from "@/lib/image";

import styles from "./page.module.css";

const TITLE = "About Krystien Aldana";
const DESCRIPTION =
  "Krystien Aldana shoots game-day photography, highlight and recruiting films, and social-ready edits for teams in Prince George, BC.";

/**
 * Explicit openGraph/twitter so this doesn't silently inherit the root
 * layout's homepage share copy — Next only merges metadata per top-level key.
 * Async so the portrait can back the share image instead of shares going out
 * with no preview photo.
 */
export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  const share = ogImage(about.portrait);

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/about" },
    openGraph: {
      type: "website",
      url: "/about",
      title: TITLE,
      description: DESCRIPTION,
      images: share ? [share] : [],
    },
    twitter: {
      card: share ? "summary_large_image" : "summary",
      title: TITLE,
      description: DESCRIPTION,
      images: share ? [share.url] : [],
    },
  };
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAboutPage(), getSettings()]);

  return (
    <PageTransition>
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
            {about.clients.length > 0 && (
              <p className={`${styles.clients} ${styles.rise} ${styles.d3}`}>
                <span className={styles.label}>shot for</span>
                <ClientList clients={about.clients} />
              </p>
            )}
          </div>
        </section>

        <section className={styles.services}>
          <Reveal>
            <h2 className={styles.heading}>What I shoot</h2>
          </Reveal>
          <Reveal className={styles.serviceList} stagger>
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

        <Reveal className={styles.photos} stagger>
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
            <h2 className={styles.ctaHeading}>Say hello.</h2>
          </Reveal>
          <Reveal className={styles.ctaAction}>
            <Pill href="/contact" transitionTypes={NAV.page}>
              Get in touch
            </Pill>
          </Reveal>
        </section>
      </div>
    </PageTransition>
  );
}
