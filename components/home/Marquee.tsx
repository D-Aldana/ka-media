"use client";

import { useEffect, useRef } from "react";

import styles from "./Filmstrip.module.css";

/** Long enough to read as the strip settling rather than stopping. */
const RAMP = 420;

const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Below this a press reads as a tap on a frame, not a pan of the strip. */
const DRAG_THRESHOLD = 4;

type Props = {
  looping: boolean;
  /** The frames, rendered on the server. */
  children: React.ReactNode;
};

/**
 * The strip's moving parts, and the one sliver of it that needs the client.
 * The marquee is still the CSS animation on `.strip`; this only reaches for it
 * to ease the playback rate down and back up, because
 * `animation-play-state: paused` stops a 60s-wide row dead on whichever frame
 * the pointer happened to cross.
 *
 * Shares Filmstrip's stylesheet: the track, the row and the frames are one
 * component, split only where the client boundary falls.
 */
export function Marquee({ looping, children }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const drag = useRef<{ x: number; scrollLeft: number } | null>(null);
  /** Outlives the drag itself, so the click it suppresses can still read it. */
  const dragged = useRef(false);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const rateTo = (target: number) => {
    // Read late: the animation only exists once styles have resolved, and
    // under reduced motion it never does.
    const marquee = strip.current?.getAnimations()[0];
    if (!marquee) return;

    cancelAnimationFrame(raf.current);
    // From wherever the rate is now, so a reversal mid-ramp stays smooth.
    const from = marquee.playbackRate;
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / RAMP);
      marquee.playbackRate = from + (target - from) * easeOut(t);
      if (t < 1) raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
  };

  /* Mouse only: a tap belongs to the frame's link, and a touch hover never
     ends. */
  const enter = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") rateTo(0);
  };

  const leave = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse" && !drag.current) rateTo(1);
  };

  // Touch only: desktop keeps plain scrolling (and the hover-to-pause above);
  // a mouse already has a scrollbar and a wheel, it doesn't need a grab.
  const down = (event: React.PointerEvent) => {
    if (event.pointerType !== "touch") return;

    // Each press is its own gesture — don't inherit a flag a prior one left
    // pending cleanup for.
    dragged.current = false;
    drag.current = { x: event.clientX, scrollLeft: track.current?.scrollLeft ?? 0 };
    // Frozen, not eased down: a grab is a direct hold on the strip, not a hover.
    strip.current?.getAnimations()[0]?.pause();
    track.current?.setPointerCapture(event.pointerId);
  };

  const move = (event: React.PointerEvent) => {
    const state = drag.current;
    if (!state || !track.current) return;

    const dx = event.clientX - state.x;
    if (!dragged.current && Math.abs(dx) <= DRAG_THRESHOLD) return;

    dragged.current = true;
    // Still a scroll container with overflow hidden — it just has no scrollbar.
    track.current.scrollLeft = state.scrollLeft - dx;
  };

  const up = (event: React.PointerEvent) => {
    if (!drag.current) return;

    drag.current = null;
    track.current?.releasePointerCapture(event.pointerId);
    // `pause()` in `down` left the animation in the paused play-state, which a
    // playbackRate ramp alone can't lift it out of — it needs an explicit
    // `play()` to start running again before `rateTo` can ease it back up.
    const marquee = strip.current?.getAnimations()[0];
    if (marquee) {
      marquee.playbackRate = 0;
      marquee.play();
    }
    rateTo(1);
    // The click that follows a drag is what clears `dragged` — but a release
    // outside the element, or a captured pointer, can end the gesture without
    // one. Clear it on the next tick so a later, unrelated tap isn't eaten.
    if (dragged.current) setTimeout(() => (dragged.current = false), 0);
  };

  const click = (event: React.MouseEvent) => {
    // A drag that ends over a frame would otherwise open it as a click.
    if (dragged.current) {
      event.preventDefault();
      dragged.current = false;
    }
  };

  return (
    <div
      className={styles.track}
      data-looping={looping || undefined}
      ref={track}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onClickCapture={click}
    >
      <div className={styles.strip} ref={strip}>
        <div className={styles.lane}>{children}</div>
      </div>
    </div>
  );
}
