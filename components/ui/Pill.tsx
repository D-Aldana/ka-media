import Link from "next/link";

import styles from "./Pill.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "outline" | "solid";
  className?: string;
  /** How the page should animate on the way out; see `lib/transitions`. */
  transitionTypes?: string[];
};

export function Pill({
  href,
  children,
  variant = "outline",
  className,
  transitionTypes,
}: Props) {
  const classes = [styles.pill, variant === "solid" && styles.solid, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={classes} transitionTypes={transitionTypes}>
      {children}
    </Link>
  );
}
