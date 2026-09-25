import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { splitStatLine } from "@/components/story/statLine";
import { StoryCloseButton, StoryCloseLink } from "@/components/story/StoryClose";
import { StoryDeck } from "@/components/story/StoryDeck";
import { CoverImage } from "@/components/ui/CoverImage";
import { getGame, getGameSlugs, getSettings } from "@/lib/content";
import { formatDate } from "@/lib/format";
import type { GameSummary } from "@/lib/types";

import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getGameSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getGame(slug);
  if (!page) return {};

  const { game } = page;
  return {
    title: game.title,
    description: game.blurb ?? `${game.sport} · ${formatDate(game.date)}`,
    openGraph: {
      title: game.title,
      description: game.blurb ?? undefined,
      images: game.cover ? [{ url: game.cover.url, alt: game.cover.alt }] : [],
    },
  };
}

export default async function GameStoryPage({ params }: Props) {
  const { slug } = await params;
  const [page, settings] = await Promise.all([getGame(slug), getSettings()]);
  if (!page) notFound();

  const { game, next } = page;
  const count = game.stories.length;
  const kinds = game.stories.some((item) => item._type === "storyVideo")
    ? "photo + film"
    : "photo";
  const meta = `${game.code} · ${game.sport} · ${formatDate(game.date)}`;

  return (
    <section className={styles.page} data-route="story">
      <StoryCloseLink className={styles.close} />

      <div className={styles.left}>
        <span className={styles.label}>{meta}</span>
        <h1 className={styles.title}>{game.title}</h1>
        {game.blurb && <p className={styles.blurb}>{game.blurb}</p>}
        <span className={styles.label}>
          {count} {count === 1 ? "story" : "stories"} · {kinds} · tap to skip
        </span>
      </div>

      <StoryDeck
        stories={game.stories}
        title={game.title}
        handle={settings.instagramHandle}
        className={styles.stage}
        sizes="(max-width: 860px) 100vw, 420px"
        actions={<StoryCloseButton className={styles.mobileClose} />}
        endPrompt={next && <NextGameLink game={next} className={styles.endNext} />}
      >
        {game.statLine && (
          <span className={styles.statLine}>
            {splitStatLine(game.statLine).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
        )}

        <div className={styles.mobileInfo}>
          <span className={styles.label}>
            {game.code} · {game.sport} · {count}{" "}
            {count === 1 ? "story" : "stories"}
          </span>
          {game.statLine && (
            <span className={styles.mobileStat}>
              {splitStatLine(game.statLine).map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          )}
          {game.blurb && <p className={styles.mobileBlurb}>{game.blurb}</p>}
          {next && <MobileNextCard game={next} />}
        </div>
      </StoryDeck>

      {next && (
        <div className={styles.right}>
          <span className={styles.label}>next game</span>
          <NextGameLink game={next} className={styles.nextCard} />
        </div>
      )}
    </section>
  );
}

function NextGameLink({
  game,
  className,
}: {
  game: GameSummary;
  className: string;
}) {
  return (
    <Link href={`/work/${game.slug}`} className={className}>
      <span className={styles.nextText}>
        <span className={styles.nextTitle}>{game.title}</span>
        <span className={styles.nextMeta}>
          {game.code} · {game.sport} →
        </span>
      </span>
      <CoverImage
        image={game.cover}
        className={styles.nextCover}
        sizes="120px"
        decorative
      />
    </Link>
  );
}

function MobileNextCard({ game }: { game: GameSummary }) {
  return (
    <Link href={`/work/${game.slug}`} className={styles.mobileNext}>
      <CoverImage
        image={game.cover}
        className={styles.mobileNextCover}
        sizes="44px"
        decorative
      />
      <span className={styles.nextText}>
        <span className={styles.label}>next game</span>
        <span className={styles.mobileNextTitle}>
          {game.title} · {game.code}
        </span>
      </span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}
