import Link from "next/link";

import { CoverImage } from "@/components/ui/CoverImage";
import { Reveal } from "@/components/ui/Reveal";
import type { SportSummary } from "@/lib/types";

import styles from "./SportTiles.module.css";

export function SportTiles({ sports }: { sports: SportSummary[] }) {
  return (
    <section className={styles.section}>
      <Reveal className={styles.head}>
        <h2 className={styles.heading}>Work</h2>
        <span className={styles.label}>
          {String(sports.length).padStart(2, "0")} sports
        </span>
      </Reveal>

      <Reveal className={styles.tiles}>
        {sports.map((tile) => (
          <Link
            key={tile.sport}
            href={`/work?sport=${tile.sport}`}
            className={styles.tile}
          >
            {tile.cover && (
              <CoverImage
                image={tile.cover}
                className={styles.media}
                sizes="(max-width: 860px) 270px, (max-width: 1440px) 30vw, 432px"
              />
            )}
            <span className={styles.row}>
              <span className={styles.name}>
                {tile.sport[0].toUpperCase() + tile.sport.slice(1)}
              </span>
              <span className={styles.count}>{tile.count} games →</span>
            </span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
