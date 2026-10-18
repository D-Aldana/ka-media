import styles from "./Reveal.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Bring the direct children in one after another, rather than the block
      as a single piece. For rows and grids. */
  stagger?: boolean;
};

/**
 * Rises its contents into place as they scroll in, scrubbed by the scroll
 * itself. Pure CSS, so this stays on the server and ships no JS; a browser
 * without view timelines just shows the content.
 */
export function Reveal({ children, className, stagger = false }: Props) {
  const classes = [stagger ? styles.stagger : styles.reveal, className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
