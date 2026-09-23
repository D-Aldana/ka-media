"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { CoverImage } from "@/components/ui/CoverImage";
import type { ContentImage, StoryItem } from "@/lib/types";

import deck from "./deck.module.css";
import styles from "./StoryDeck.module.css";

/** Mux only loads for games that actually have a reel in them. */
const StoryVideo = dynamic(() => import("./StoryVideo"), { ssr: false });

const IMAGE_DURATION = 5000;
/** Minimum horizontal travel, in px, before a drag counts as a swipe. */
const SWIPE = 40;

type Props = {
  stories: StoryItem[];
  /** The game title; names the deck and each stream. */
  title: string;
  handle: string;
  /** Sits in the top row beside the play control — the mobile close button. */
  actions?: React.ReactNode;
  /** Overlaid on the shade below the caption: stat line, game info, next game. */
  children?: React.ReactNode;
  /** Offered once the last item has played out. */
  endPrompt?: React.ReactNode;
  /** Where Escape leaves the story. */
  closeHref: string;
  className?: string;
  sizes: string;
};

/**
 * The full deck: tap zones, arrow keys, swipe, and real Mux playback for reels.
 * Images run on a fixed timer; a video drives its own bar from `timeupdate`.
 * Under reduced motion nothing advances on its own — the tap zones, arrow keys
 * and the play control are the only way through.
 */
export function StoryDeck({
  stories,
  title,
  handle,
  actions,
  children,
  endPrompt,
  closeHref,
  className,
  sizes,
}: Props) {
  const router = useRouter();
  const count = stories.length;

  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [wantPlay, setWantPlay] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  const active = stories[index];
  const isVideo = active?._type === "storyVideo";
  const running =
    wantPlay && !hovered && !focused && !pressed && !finished;

  const bar = useRef<HTMLElement>(null);
  const remaining = useRef(IMAGE_DURATION);
  const startedAt = useRef(0);
  const swiped = useRef(false);
  const press = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setAutoAdvance(!query.matches);
      setWantPlay(!query.matches);
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  const next = useCallback(() => {
    if (index >= count - 1) setFinished(true);
    else setIndex(index + 1);
  }, [index, count]);

  const previous = useCallback(() => {
    // From the end card, step back onto the last slide rather than past it.
    if (finished) {
      setFinished(false);
      return;
    }
    setIndex((at) => Math.max(at - 1, 0));
  }, [finished]);

  const restart = useCallback(() => {
    setFinished(false);
    setIndex(0);
  }, []);

  useEffect(() => {
    remaining.current = IMAGE_DURATION;
    startedAt.current = Date.now();
    if (bar.current) bar.current.style.width = "0%";
    // A reel the visitor chose to play doesn't license the next one to start.
    if (!autoAdvance) setWantPlay(false);
  }, [index, autoAdvance]);

  // Images only: a video advances itself when it reaches its capped length.
  useEffect(() => {
    if (!autoAdvance || isVideo || finished) return;

    if (!running) {
      remaining.current -= Date.now() - startedAt.current;
      // Stamped again so a second pause pass can't bill the same seconds twice.
      startedAt.current = Date.now();
      return;
    }

    startedAt.current = Date.now();
    const timer = window.setTimeout(next, Math.max(remaining.current, 300));
    return () => window.clearTimeout(timer);
  }, [autoAdvance, isVideo, finished, running, next]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;

      switch (event.key) {
        case "ArrowRight":
          next();
          break;
        case "ArrowLeft":
          previous();
          break;
        case " ":
          setWantPlay((playing) => !playing);
          break;
        case "Escape":
          router.push(closeHref);
          break;
        default:
          return;
      }
      event.preventDefault();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, previous, router, closeHref]);

  const onProgress = useCallback((fraction: number) => {
    if (bar.current) bar.current.style.width = `${fraction * 100}%`;
  }, []);

  const onPointerDown = (event: React.PointerEvent) => {
    press.current = { x: event.clientX, y: event.clientY };
    swiped.current = false;
    setPressed(true);
  };

  const onPointerUp = (event: React.PointerEvent) => {
    setPressed(false);
    const from = press.current;
    press.current = null;
    if (!from) return;

    const dx = event.clientX - from.x;
    const dy = event.clientY - from.y;
    if (Math.abs(dx) < SWIPE || Math.abs(dx) <= Math.abs(dy)) return;

    // Keeps the tap zone under the finger from firing a second move.
    swiped.current = true;
    if (dx < 0) next();
    else previous();
  };

  const release = () => {
    press.current = null;
    setPressed(false);
  };

  const tap = (move: () => void) => () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    move();
  };

  const barClass = (i: number) => {
    if (finished || i < index) return `${deck.bar} ${deck.done}`;
    if (i > index) return deck.bar;
    if (isVideo) return `${deck.bar} ${styles.streamed}`;
    return `${deck.bar} ${autoAdvance ? deck.now : deck.full}`;
  };

  return (
    <div className={[styles.stage, className].filter(Boolean).join(" ")}>
      <div className={styles.glow} aria-hidden="true">
        {stories.map((item, i) => (
          <span
            key={`glow-${item._key}`}
            className={`${styles.glowSlide} ${i === index ? styles.glowOn : ""}`}
          >
            <CoverImage
              image={posterOf(item)}
              className={styles.glowImage}
              sizes="120px"
              decorative
            />
          </span>
        ))}
      </div>

      <section
        className={[deck.deck, styles.frame, !running && deck.paused]
          .filter(Boolean)
          .join(" ")}
        style={{ "--dur": `${IMAGE_DURATION}ms` } as React.CSSProperties}
        aria-roledescription="story deck"
        aria-label={`${title} — ${count} ${count === 1 ? "story" : "stories"}`}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "mouse") return;
          setHovered(false);
          release();
        }}
        onFocusCapture={(event) => {
          // Clicking a tap zone focuses it too, and that must not stop the
          // deck — only keyboard focus should.
          if (event.target.matches(":focus-visible")) setFocused(true);
        }}
        onBlurCapture={() => setFocused(false)}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={release}
      >
        {stories.map((item, i) =>
          // Only the slide either side of the current one is mounted, so a
          // twenty-frame game never downloads twenty frames.
          Math.abs(i - index) > 1 ? null : (
            <div
              key={item._key}
              className={`${deck.slide} ${i === index ? deck.on : ""}`}
            >
              <CoverImage
                image={posterOf(item)}
                className={deck.media}
                sizes={sizes}
                priority={i === 0}
                decorative
              />
              {i === index && item._type === "storyVideo" && (
                <StoryVideo
                  playbackId={item.playbackId}
                  title={`${title} — story ${i + 1}`}
                  playing={running}
                  onProgress={onProgress}
                  onDone={next}
                />
              )}
            </div>
          ),
        )}

        <button
          type="button"
          className={`${styles.tap} ${styles.previous}`}
          onClick={tap(previous)}
          disabled={index === 0 && !finished}
        >
          <span className="sr-only">Previous story</span>
        </button>
        <button
          type="button"
          className={`${styles.tap} ${styles.next}`}
          onClick={tap(next)}
          disabled={finished}
        >
          <span className="sr-only">Next story</span>
        </button>

        <div className={deck.bars} aria-hidden="true">
          {stories.map((item, i) => (
            <span key={`bar-${item._key}`} className={barClass(i)}>
              <i ref={i === index ? bar : undefined} />
            </span>
          ))}
        </div>

        <div className={styles.top}>
          <span className={deck.who}>
            <span className={deck.avatar} aria-hidden="true">
              ka
            </span>
            {handle.replace(/^@/, "")}
          </span>

          <span className={styles.actions}>
            {(autoAdvance || isVideo) && !finished && (
              <button
                type="button"
                className={styles.control}
                onClick={() => setWantPlay((playing) => !playing)}
              >
                <span className="sr-only">
                  {wantPlay ? "Pause story" : "Play story"}
                </span>
                {wantPlay ? <PauseIcon /> : <PlayIcon />}
              </button>
            )}
            {actions}
          </span>
        </div>

        <div className={`${deck.shade} ${styles.bottom}`}>
          {active?.caption && <p className={styles.caption}>{active.caption}</p>}
          {children}
        </div>

        {finished && (
          <div className={styles.end}>
            <p className={styles.endLabel}>End of story</p>
            <button type="button" className={styles.replay} onClick={restart}>
              ↻ Replay
            </button>
            {endPrompt}
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {finished
            ? `End of ${title}`
            : `Story ${index + 1} of ${count}${active?.caption ? ` — ${active.caption}` : ""}`}
        </p>
      </section>
    </div>
  );
}

function PauseIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
      <rect x="1" y="1" width="3.5" height="12" rx="1" />
      <rect x="7.5" y="1" width="3.5" height="12" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
      <path d="M2 1.5l8.5 5.5L2 12.5z" />
    </svg>
  );
}

function posterOf(item: StoryItem): ContentImage | null {
  return item._type === "storyImage" ? item.image : item.poster;
}
