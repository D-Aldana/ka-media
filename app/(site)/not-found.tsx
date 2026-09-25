import Link from "next/link";

import styles from "./not-found.module.css";

/** Catches notFound() thrown inside the site group, with the chrome intact. */
export default function NotFound() {
  return (
    <div className={styles.page}>
      <span className={styles.code}>404</span>
      <h1 className={styles.headline}>
        That page
        <br />
        isn&rsquo;t here.
      </h1>
      <p className={styles.blurb}>
        The game may have been taken down, or the link may be wrong.
      </p>
      <Link href="/work" className={styles.link}>
        See all games →
      </Link>
    </div>
  );
}
