"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./StoryVideo.module.css";

/** A story segment is never longer than a minute, however long the asset is. */
export const STORY_CAP = 60;

type Props = {
  src: string;
  /** Names the reel for assistive tech. */
  title: string;
  playing: boolean;
  /** The deck owns the choice, so it carries from one reel to the next. */
  muted?: boolean;
  /**
   * The browser refused to play — almost always unmuted playback with no
   * gesture behind it. The deck drops back to muted and we retry.
   */
  onBlocked?: () => void;
  /** 0–1 of the capped length, on every timeupdate. */
  onProgress: (fraction: number) => void;
  onDone: () => void;
};

/**
 * Muted inline playback for one reel. Both decks mount it for the active item
 * alone and unmount it the moment they move on, so nothing buffers in the
 * background. The slide underneath stays visible as the poster until the first
 * frame is actually playing.
 */
export default function StoryVideo({
  src,
  title,
  playing,
  muted = true,
  onBlocked,
  onProgress,
  onDone,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const done = useRef(false);

  const sync = useCallback(() => {
    const player = ref.current;
    if (!player) return;
    // Set on the element rather than left to the attribute alone: Safari is
    // unreliable about honouring a re-rendered `muted` on a live player.
    player.muted = muted;
    if (!playing) {
      player.pause();
      return;
    }
    player.play().catch(() => onBlocked?.());
  }, [playing, muted, onBlocked]);

  useEffect(() => {
    sync();
  }, [sync]);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onProgress(1);
    onDone();
  }, [onDone, onProgress]);

  const tick = useCallback(() => {
    const player = ref.current;
    if (!player) return;
    const length = Math.min(player.duration || STORY_CAP, STORY_CAP);
    const at = Math.min(player.currentTime, length);
    onProgress(length > 0 ? at / length : 0);
    if (at >= length) finish();
  }, [finish, onProgress]);

  return (
    <video
      ref={ref}
      className={[styles.video, started && styles.on].filter(Boolean).join(" ")}
      src={src}
      aria-label={title}
      muted={muted}
      playsInline
      preload="auto"
      onCanPlay={sync}
      onPlaying={() => setStarted(true)}
      onTimeUpdate={tick}
      onEnded={finish}
    />
  );
}
