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
  /** 0–1 of the capped length, on every timeupdate. */
  onProgress: (fraction: number) => void;
  onDone: () => void;
};

/**
 * The only place a reel is allowed to start. Mounted by StoryDeck for the
 * active item alone and unmounted the moment the deck moves on, so nothing
 * buffers in the background. The slide underneath stays visible as the poster
 * until the first frame is actually playing.
 */
export default function StoryVideo({ src, title, playing, onProgress, onDone }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const done = useRef(false);

  const sync = useCallback(() => {
    const player = ref.current;
    if (!player) return;
    if (playing) player.play().catch(() => {});
    else player.pause();
  }, [playing]);

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
      muted
      playsInline
      preload="auto"
      onCanPlay={sync}
      onPlaying={() => setStarted(true)}
      onTimeUpdate={tick}
      onEnded={finish}
    />
  );
}
