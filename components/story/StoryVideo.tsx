"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./StoryVideo.module.css";

/** A story segment is never longer than a minute, however long the asset is. */
export const STORY_CAP = 60;

type Props = {
  playbackId: string;
  /** Names the stream for assistive tech and for Mux's own metadata. */
  title: string;
  playing: boolean;
  /** 0–1 of the capped length, on every timeupdate. */
  onProgress: (fraction: number) => void;
  onDone: () => void;
};

/**
 * The only place a stream is allowed to start. Mounted by StoryDeck for the
 * active item alone and unmounted the moment the deck moves on, so nothing
 * buffers in the background. The slide underneath stays visible as the poster
 * until the first frame is actually playing.
 */
export default function StoryVideo({
  playbackId,
  title,
  playing,
  onProgress,
  onDone,
}: Props) {
  const ref = useRef<React.ComponentRef<typeof MuxPlayer>>(null);
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
    <MuxPlayer
      ref={ref}
      className={[styles.video, started && styles.on].filter(Boolean).join(" ")}
      playbackId={playbackId}
      streamType="on-demand"
      title={title}
      muted
      playsInline
      nohotkeys
      /* The slide below is the poster; Mux's generated one would flash over it. */
      poster=""
      onCanPlay={sync}
      onPlaying={() => setStarted(true)}
      onTimeUpdate={tick}
      onEnded={finish}
      style={{
        "--controls": "none",
        "--media-object-fit": "cover",
      }}
    />
  );
}
