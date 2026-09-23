import Link from "next/link";

import styles from "./Pill.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "outline" | "solid";
  className?: string;
};

export function Pill({ href, children, variant = "outline", className }: Props) {
  const classes = [styles.pill, variant === "solid" && styles.solid, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
