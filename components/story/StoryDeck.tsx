"use client";

import dynamic from "next/dynamic";
import { ViewTransition, useCallback, useEffect, useRef, useState } from "react";

import { CoverImage } from "@/components/ui/CoverImage";
import type { ContentImage, StoryItem } from "@/lib/types";

import deck from "./deck.module.css";
import { useCloseStory } from "./useCloseStory";
import styles from "./StoryDeck.module.css";

/** The player only loads for games that actually have a reel in them. */
const StoryVideo = dynamic(() => import("./StoryVideo"), { ssr: false });

const IMAGE_DURATION = 5000;
/** Minimum horizontal travel, in px, before a drag counts as a swipe. */
const SWIPE = 40;
/** Per-tab, so sound never carries over into a fresh visit. */
const SOUND_KEY = "ka:story-sound";

/** Muted whenever storage is unavailable — private mode, or turned off. */
function stored(): boolean {
  try {
    return sessionStorage.getItem(SOUND_KEY) === "on";
  } catch {
    return false;
  }
}

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
  /** Pairs the frame with the Work cover that opened it; see `lib/transitions`. */
  viewTransitionName: string;
  className?: string;
  sizes: string;
};

/**
 * The full deck: tap zones, arrow keys, swipe, and real playback for reels.
 * Images run on a fixed timer; a video drives its own bar from `timeupdate`.
 * A resting cursor doesn't stop the deck — only a press, keyboard focus or the
 * play control does. Reels start muted, since no browser will autoplay sound
 * unprompted; the speaker control turns it on and the choice sticks for the
 * rest of the tab. Under reduced motion nothing advances on its own — on
 * image slides the tap zones and arrow keys are the only way through; reels
 * still get a play control.
 */
export function StoryDeck({
  stories,
  title,
  handle,
  actions,
  children,
  endPrompt,
  viewTransitionName,
  className,
  sizes,
}: Props) {
  const { close } = useCloseStory();
  const count = stories.length;

  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  // False through SSR, so the active bar stays blank rather than flashing full.
  const [motionKnown, setMotionKnown] = useState(false);
  const [wantPlay, setWantPlay] = useState(false);
  // Muted through SSR and the first paint; a stored choice is restored below.
  const [sound, setSound] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  const active = stories[index];
  const isVideo = active?._type === "storyVideo";
  const running = wantPlay && !focused && !pressed && !finished;

  const bar = useRef<HTMLElement>(null);
  const remaining = useRef(IMAGE_DURATION);
  const startedAt = useRef(0);
  const swipedAt = useRef(0);
  /** The slide the reset effect below last ran for. */
  const resetAt = useRef(0);
  const press = useRef<{ x: number; y: number } | null>(null);

  // One pass over everything the deck can only know in the browser: the motion
  // preference, and whether sound was turned on earlier in this tab.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setAutoAdvance(!query.matches);
      setWantPlay(!query.matches);
      setMotionKnown(true);
      setSound(stored());
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  const toggleSound = useCallback(() => {
    setSound((on) => {
      try {
        sessionStorage.setItem(SOUND_KEY, on ? "off" : "on");
      } catch {}
      return !on;
    });
  }, []);

  /**
   * Unmuted playback needs a gesture behind it, and a restored choice has none
   * on a fresh load. Drop back to muted so the reel plays rather than stalling
   * silently, and forget the choice so the next load doesn't fail the same way.
   */
  const onBlocked = useCallback(() => {
    setSound(false);
    try {
      sessionStorage.removeItem(SOUND_KEY);
    } catch {}
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
    // A one-story deck is already at 0, so the reset effect below won't fire.
    remaining.current = IMAGE_DURATION;
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    remaining.current = IMAGE_DURATION;
    startedAt.current = Date.now();
    // A reel the visitor chose to play doesn't license the next one to start.
    // Only a real slide change counts: on mount this effect still sees the
    // first render's `autoAdvance`, and clearing then would undo the play the
    // media-query effect just asked for in the same commit.
    if (resetAt.current !== index && !autoAdvance) setWantPlay(false);
    resetAt.current = index;
  }, [index, autoAdvance]);

  // Only a reel drives its bar inline; drop that width on the way out so the
  // `.done`/`.full` class rules aren't outranked by a stale value.
  useEffect(() => {
    const segment = bar.current;
    return () => {
      segment?.style.removeProperty("width");
    };
  }, [index, finished]);

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
          // Space belongs to whatever control is focused, if any.
          if (target?.closest("button, a, summary")) return;
          setWantPlay((playing) => !playing);
          break;
        case "m":
        case "M":
          toggleSound();
          break;
        case "Escape":
          close();
          break;
        default:
          return;
      }
      event.preventDefault();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, previous, close, toggleSound]);

  const onProgress = useCallback((fraction: number) => {
    if (bar.current) bar.current.style.width = `${fraction * 100}%`;
  }, []);

  const onPointerDown = (event: React.PointerEvent) => {
    press.current = { x: event.clientX, y: event.clientY };
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
    swipedAt.current = Date.now();
    if (dx < 0) next();
    else previous();
  };

  const release = () => {
    press.current = null;
    setPressed(false);
  };

  const tap = (move: () => void) => () => {
    if (Date.now() - swipedAt.current < 300) return;
    move();
  };

  const barClass = (i: number) => {
    if (finished || i < index) return `${deck.bar} ${deck.done}`;
    if (i > index) return deck.bar;
    if (isVideo) return `${deck.bar} ${deck.streamed}`;
    if (!motionKnown) return deck.bar;
    return `${deck.bar} ${autoAdvance ? deck.now : deck.full}`;
  };

  return (
    <div className={[styles.stage, className].filter(Boolean).join(" ")}>
      <div className={styles.glow} aria-hidden="true">
        {stories.map((item, i) =>
          Math.abs(i - index) > 1 ? null : (
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
          ),
        )}
      </div>

      {/* The cover that opened this deck morphs into the frame, so the
          square card and the tall story read as one object. */}
      <ViewTransition name={viewTransitionName} share="morph" default="none">
        <section
          className={[deck.deck, styles.frame, !running && deck.paused]
            .filter(Boolean)
            .join(" ")}
          style={{ "--dur": `${IMAGE_DURATION}ms` } as React.CSSProperties}
          aria-roledescription="story deck"
          aria-label={`${title} — ${count} ${count === 1 ? "story" : "stories"}`}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") release();
          }}
          onFocusCapture={(event) => {
            // Clicking a tap zone focuses it too, and that must not stop the
            // deck — only keyboard focus should.
            if (!event.target.matches(":focus-visible")) return;
            // Reaching for a control must not stop what the control adjusts —
            // tabbing to "Unmute" would otherwise pause the reel being unmuted.
            if (event.target.closest("[data-control]")) return;
            setFocused(true);
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
                    src={item.url}
                    title={`${title} — story ${i + 1}`}
                    playing={running}
                    muted={!sound}
                    onBlocked={onBlocked}
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

            <span className={styles.actions} data-control>
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
              {isVideo && !finished && (
                <button
                  type="button"
                  className={styles.control}
                  onClick={toggleSound}
                >
                  <span className="sr-only">
                    {sound ? "Mute story" : "Unmute story"}
                  </span>
                  {sound ? <SoundOnIcon /> : <SoundOffIcon />}
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
      </ViewTransition>
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

function SoundOnIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
      <path d="M7 1.5L3.5 4.5H1.5v5h2L7 12.5z" fill="currentColor" />
      <path
        d="M10 4.5a3.5 3.5 0 010 5M12.3 2.2a7 7 0 010 9.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
      <path d="M7 1.5L3.5 4.5H1.5v5h2L7 12.5z" fill="currentColor" />
      <path
        d="M10.2 5.2l4 3.6M14.2 5.2l-4 3.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
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
