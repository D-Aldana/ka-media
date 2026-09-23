import { AboutSummary } from "@/components/home/AboutSummary";
import { ContactCta } from "@/components/home/ContactCta";
import { Hero } from "@/components/home/Hero";
import { LatestGame } from "@/components/home/LatestGame";
import { SportTiles } from "@/components/home/SportTiles";
import { getHomeData, getSettings } from "@/lib/content";

import styles from "./page.module.css";

export default async function HomePage() {
  const [home, settings] = await Promise.all([getHomeData(), getSettings()]);

  return (
    <div className={styles.page} data-route="home">
      <Hero featured={home.featured} settings={settings} />
      <SportTiles sports={home.sports} />
      {home.latest && <LatestGame game={home.latest} settings={settings} />}
      <AboutSummary about={home.about} />
      <ContactCta settings={settings} />
    </div>
  );
}
