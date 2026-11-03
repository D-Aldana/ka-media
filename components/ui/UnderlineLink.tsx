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
  const web = href.startsWith("http");
  const external = web || href.startsWith("mailto:");

  // An external link leaves the app, so there is no transition to type. A web
  // link (Instagram) opens in a new tab so the visitor never fully leaves the
  // site; mailto hands off to the mail client instead, so it stays in place.
  if (external) {
    return (
      <a
        href={href}
        className={classes}
        {...(web ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
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
