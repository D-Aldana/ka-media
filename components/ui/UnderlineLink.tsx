import Link from "next/link";

import styles from "./UnderlineLink.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** How the page should animate on the way out; see `lib/transitions`. */
  transitionTypes?: string[];
} & Omit<React.ComponentPropsWithoutRef<"a">, "href" | "className">;

export function UnderlineLink({
  href,
  children,
  className,
  transitionTypes,
  ...rest
}: Props) {
  const classes = [styles.link, className].filter(Boolean).join(" ");
  const external = href.startsWith("http") || href.startsWith("mailto:");

  // An external link leaves the app, so there is no transition to type.
  if (external) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      transitionTypes={transitionTypes}
      {...rest}
    >
      {children}
    </Link>
  );
}
