"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./HoverReel.module.css";

/** Long enough for the cover to fade back before the player is torn down. */
const FADE = 350;

type Props = {
  url: string;
  /** Names the reel for assistive tech. */
  title: string;
  className?: string;
  /** The cover, which stays put underneath and shows through until playback. */
  children: React.ReactNode;
};

/**
 * A filmstrip cover that plays its game's reel while the pointer rests on it.
 * Nothing is fetched until then, and the player is torn down on the way out:
 * these are full-size MP4s with no transcoding behind them, so the strip must
 * never pull one in on its own. Mouse only — a tap belongs to the link.
 */
export function HoverReel({ url, title, className, children }: Props) {
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const fade = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setEnabled(!query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => () => window.clearTimeout(fade.current), []);

  // Mounted only once armed, so this runs as the player appears. Muted is set
  // on the element rather than left to the attribute: without it the browser
  // can weigh up autoplay before React has applied the prop.
  useEffect(() => {
    const player = video.current;
    if (!player) return;
    player.muted = true;
    player.play().catch(() => {});
  }, [armed]);

  const enter = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse" || !enabled) return;
    window.clearTimeout(fade.current);
    setArmed(true);
  };

  const leave = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    video.current?.pause();
    setPlaying(false);
    fade.current = window.setTimeout(() => setArmed(false), FADE);
  };

  return (
    <span className={className} onPointerEnter={enter} onPointerLeave={leave}>
      {children}
      {armed && (
        <video
          ref={video}
          className={[styles.reel, playing && styles.on].filter(Boolean).join(" ")}
          src={url}
          aria-label={title}
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
        />
      )}
    </span>
  );
}
