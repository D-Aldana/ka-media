import { Courier_Prime, Hanken_Grotesk } from "next/font/google";

import { NotFound } from "@/components/site/NotFound";

import "./globals.css";

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
 *
 * `not-found.tsx` takes no `metadata` export, so the title is a hoisted tag —
 * without one the tab shows the URL that just failed.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${hanken.variable} ${courier.variable}`}>
      <body>
        <title>Page not found · ka-media</title>
        <main>
          <NotFound bare />
        </main>
      </body>
    </html>
  );
}
