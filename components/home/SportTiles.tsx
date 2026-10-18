import Link from "next/link";

import { CoverImage } from "@/components/ui/CoverImage";
import { Reveal } from "@/components/ui/Reveal";
import { sportLabel } from "@/lib/format";
import { NAV } from "@/lib/transitions";
import type { SportSummary } from "@/lib/types";

import styles from "./SportTiles.module.css";

export function SportTiles({ sports }: { sports: SportSummary[] }) {
  /* A tile reading "0 games" advertises what isn't there yet. */
  const shot = sports.filter((tile) => tile.count > 0);
  if (shot.length === 0) return null;

  return (
    <section className={styles.section}>
      <Reveal className={styles.head}>
        <h2 className={styles.heading}>Work</h2>
        <span className={styles.label}>
          {String(shot.length).padStart(2, "0")}{" "}
          {shot.length === 1 ? "sport" : "sports"}
        </span>
      </Reveal>

      <Reveal className={styles.tiles}>
        {shot.map((tile) => (
          <Link
            key={tile.sport}
            href={`/work?sport=${tile.sport}`}
            className={styles.tile}
            transitionTypes={NAV.forward}
          >
            <CoverImage
              image={tile.cover}
              className={styles.media}
              sizes="(max-width: 860px) 270px, (max-width: 1440px) 30vw, 432px"
            />
            <span className={styles.row}>
              <span className={styles.name}>{sportLabel(tile.sport)}</span>
              <span className={styles.count}>
                {tile.count} {tile.count === 1 ? "game" : "games"} →
              </span>
            </span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
