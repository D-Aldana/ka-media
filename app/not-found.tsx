import { Courier_Prime, Hanken_Grotesk } from "next/font/google";
import Link from "next/link";

import "./globals.css";
import styles from "./not-found.module.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-hanken",
  display: "swap",
});

const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier",
  display: "swap",
});

/**
 * Unmatched URLs land outside both route groups, so this one brings its own
 * document. Anything thrown by a page inside the site group gets
 * `(site)/not-found.tsx` and the full header and footer instead.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${hanken.variable} ${courier.variable}`}>
      <body>
        <main className={styles.page}>
          <span className={styles.code}>404</span>
          <h1 className={styles.headline}>
            That page
            <br />
            isn&rsquo;t here.
          </h1>
          <Link href="/" className={styles.link}>
            Back home →
          </Link>
        </main>
      </body>
    </html>
  );
}
