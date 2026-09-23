import Link from "next/link";

import styles from "./UnderlineLink.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<"a">, "href" | "className">;

export function UnderlineLink({ href, children, className, ...rest }: Props) {
  const classes = [styles.link, className].filter(Boolean).join(" ");
  const external = href.startsWith("http") || href.startsWith("mailto:");

  if (external) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
