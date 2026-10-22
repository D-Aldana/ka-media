"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { CoverImage } from "@/components/ui/CoverImage";
import { NAV } from "@/lib/transitions";
import type { ContentImage, StoryItem } from "@/lib/types";

import deck from "./deck.module.css";
import styles from "./MiniStory.module.css";
import { splitStatLine } from "./statLine";

/** Only pulled in once a reel is actually about to play. */
const StoryVideo = dynamic(() => import("./StoryVideo"), { ssr: false });

const IMAGE_DURATION = 5000;

type Props = {
  stories: StoryItem[];
  statLine: string | null;
  href: string;
  label: string;
  handle: string;
  /** Rendered size; the deck fills it. */
  className?: string;
  sizes: string;
};

/**
 * The story deck in autoplay-only mode: no tap zones, loops forever, pauses
 * while hovered or focused. Reels play muted and inline and set the length of
 * their own slide; nothing loads or advances while the tile is off screen.
 */
export function MiniStory({
  stories,
  statLine,
  href,
  label,
  handle,
  className,
  sizes,
}: Props) {
  const count = stories.length;

  const [index, setIndex] = useState(0);
  // Bumped on every advance so a one-reel deck gets a fresh player on loop.
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [onScreen, setOnScreen] = useState(false);

  const tile = useRef<HTMLAnchorElement>(null);
  const bar = useRef<HTMLElement>(null);
  const remaining = useRef(IMAGE_DURATION);
  const startedAt = useRef(0);

  const active = stories[index];
  const isVideo = active?._type === "storyVideo";
  const running = autoplay && onScreen && !paused;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setAutoplay(!query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const node = tile.current;
    if (!node) return;
    const watch = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    watch.observe(node);
    return () => watch.disconnect();
  }, []);

  const advance = useCallback(() => {
    setIndex((at) => (at + 1) % count);
    setCycle((turn) => turn + 1);
  }, [count]);

  useEffect(() => {
    remaining.current = IMAGE_DURATION;
    startedAt.current = Date.now();
  }, [index, cycle]);

  // Only a reel drives its bar inline; drop that width on the way out so the
  // `.done`/`.now` rules aren't outranked by a stale value.
  useEffect(() => {
    const segment = bar.current;
    return () => {
      segment?.style.removeProperty("width");
    };
  }, [index, cycle]);

  // Images only: a reel advances the deck when it reaches its capped length.
  useEffect(() => {
    if (!autoplay || isVideo || count < 2) return;

    if (!running) {
      remaining.current -= Date.now() - startedAt.current;
      // Stamped again so a second pause pass can't bill the same seconds twice.
      startedAt.current = Date.now();
      return;
    }

    startedAt.current = Date.now();
    const timer = window.setTimeout(advance, Math.max(remaining.current, 300));
    return () => window.clearTimeout(timer);
  }, [autoplay, isVideo, count, running, advance]);

  const onProgress = useCallback((fraction: number) => {
    if (bar.current) bar.current.style.width = `${fraction * 100}%`;
  }, []);

  const barClass = (i: number) => {
    if (i < index) return `${deck.bar} ${deck.done}`;
    if (i > index) return deck.bar;
    if (isVideo) return `${deck.bar} ${deck.streamed}`;
    return autoplay ? `${deck.bar} ${deck.now}` : deck.bar;
  };

  return (
    <Link
      ref={tile}
      href={href}
      transitionTypes={NAV.forward}
      aria-label={label}
      className={[styles.mini, className].filter(Boolean).join(" ")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span
        className={[deck.deck, !running && deck.paused].filter(Boolean).join(" ")}
        style={{ "--dur": `${IMAGE_DURATION}ms` } as React.CSSProperties}
      >
        {stories.map((item, i) => (
          <span
            key={item._key}
            className={`${deck.slide} ${i === index ? deck.on : ""}`}
          >
            <CoverImage
              image={posterOf(item)}
              className={deck.media}
              sizes={sizes}
              decorative
            />
            {i === index && item._type === "storyVideo" && autoplay && onScreen && (
              <StoryVideo
                key={cycle}
                src={item.url}
                title={`${label} — story ${i + 1}`}
                playing={running}
                onProgress={onProgress}
                onDone={advance}
              />
            )}
          </span>
        ))}

        <span className={deck.bars} aria-hidden="true">
          {stories.map((item, i) => (
            <span key={`bar-${item._key}`} className={barClass(i)}>
              <i ref={i === index ? bar : undefined} />
            </span>
          ))}
        </span>

        <span className={`${deck.who} ${styles.handle}`} aria-hidden="true">
          <span className={deck.avatar}>ka</span>
          {handle.replace(/^@/, "")}
        </span>

        {statLine && (
          <span
            className={`${deck.shade} ${styles.statLine}`}
            aria-hidden="true"
          >
            {splitStatLine(statLine).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
        )}
      </span>
    </Link>
  );
}

function posterOf(item: StoryItem): ContentImage | null {
  return item._type === "storyImage" ? item.image : item.poster;
}
