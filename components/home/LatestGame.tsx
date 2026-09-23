import { MiniStory } from "@/components/story/MiniStory";
import { Reveal } from "@/components/ui/Reveal";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import type { LatestGame as LatestGameType, Settings } from "@/lib/types";

import styles from "./LatestGame.module.css";

type Props = {
  game: LatestGameType;
  settings: Settings;
};

export function LatestGame({ game, settings }: Props) {
  const href = `/work/${game.slug}`;

  return (
    <section className={styles.section} id="latest">
      <div className={styles.inner}>
        <Reveal className={styles.text}>
          <span className={styles.label}>
            latest · {game.code} · {game.sport} · {formatDate(game.date)}
          </span>
          <h2 className={styles.title}>{game.title}</h2>
          {game.blurb && <p className={styles.blurb}>{game.blurb}</p>}
          <UnderlineLink href={href} className={styles.watch}>
            Watch the story →
          </UnderlineLink>
        </Reveal>

        <Reveal className={styles.mini}>
          <MiniStory
            stories={game.stories}
            statLine={game.statLine}
            href={href}
            label={`Watch the story from ${game.title}`}
            handle={settings.instagramHandle}
            className={styles.fill}
            sizes="(max-width: 860px) calc(100vw - 32px), 360px"
          />
        </Reveal>
      </div>
    </section>
  );
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(iso))
    .toLowerCase();
}
