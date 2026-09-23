"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./Reveal.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Fade + 40px rise the first time the element crosses into view.
 * `className` carries the layout so the wrapper can sit directly in a grid.
 */
export function Reveal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.12 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = [styles.reveal, shown && styles.in, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}
