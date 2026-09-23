"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { CoverImage } from "@/components/ui/CoverImage";
import type { ContentImage, StoryItem } from "@/lib/types";

import deck from "./deck.module.css";
import styles from "./MiniStory.module.css";
import { splitStatLine } from "./statLine";

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
 * while hovered or focused. Video items show their poster — the full deck on
 * the game page is the only place a stream is allowed to start.
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
  const slides = useMemo(
    () => stories.map((item) => ({ key: item._key, image: posterOf(item) })),
    [stories],
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const remaining = useRef(IMAGE_DURATION);
  const startedAt = useRef(0);

  useEffect(() => {
    setAutoplay(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    remaining.current = IMAGE_DURATION;
  }, [index]);

  useEffect(() => {
    if (!autoplay || slides.length < 2) return;

    if (paused) {
      remaining.current -= Date.now() - startedAt.current;
      return;
    }

    startedAt.current = Date.now();
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % slides.length),
      Math.max(remaining.current, 300),
    );
    return () => window.clearTimeout(timer);
  }, [autoplay, paused, index, slides.length]);

  const deckClasses = [deck.deck, paused && deck.paused]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={href}
      aria-label={label}
      className={[styles.mini, className].filter(Boolean).join(" ")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span
        className={deckClasses}
        style={{ "--dur": `${IMAGE_DURATION}ms` } as React.CSSProperties}
      >
        {slides.map((slide, i) => (
          <span
            key={slide.key}
            className={`${deck.slide} ${i === index ? deck.on : ""}`}
          >
            <CoverImage
              image={slide.image}
              className={deck.media}
              sizes={sizes}
              decorative
            />
          </span>
        ))}

        <span className={deck.bars} aria-hidden="true">
          {slides.map((slide, i) => (
            <span
              key={`bar-${slide.key}`}
              className={[
                deck.bar,
                i < index && deck.done,
                autoplay && i === index && deck.now,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <i />
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

