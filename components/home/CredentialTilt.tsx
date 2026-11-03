"use client";

import { useRef } from "react";

type Props = { className?: string; children: React.ReactNode };

/**
 * The one piece of the credential that needs the client: it tilts the pass
 * toward the pointer and moves the light across the laminate with it, the
 * way a real card catches the room as it turns. Writes CSS variables only —
 * the stylesheet decides what they do — and stands down for touch and for
 * reduced motion, where the pass just hangs and sways.
 */
export function CredentialTilt({ className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || event.pointerType !== "mouse") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${(0.5 - y) * 14}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * 18}deg`);
      el.dataset.active = "";
    });
  }

  function leave() {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
    delete el.dataset.active;
  }

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {children}
    </div>
  );
}
