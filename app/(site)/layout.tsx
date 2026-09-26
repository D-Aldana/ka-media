import { Analytics } from "@vercel/analytics/next";

import type { Metadata } from "next";
import { Courier_Prime, Hanken_Grotesk } from "next/font/google";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { RouteMemory } from "@/components/site/RouteMemory";
import { getSettings } from "@/lib/content";
import { ogImage } from "@/lib/image";
import { siteUrl } from "@/lib/site";

import "../globals.css";

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

const FALLBACK_TITLE = "ka-media — game-day photo & film";
const FALLBACK_DESCRIPTION =
  "Krystien Aldana shoots basketball, soccer and football in Prince George, BC — game-day photography, highlight films and social-ready edits.";

/**
 * Async so the Studio's `seo` fields can override the copy below. Everything
 * here is inherited by the pages, which set only what differs — `metadataBase`
 * is what lets them give relative URLs.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.seo.title || FALLBACK_TITLE;
  const description = settings.seo.description || FALLBACK_DESCRIPTION;
  const share = ogImage(settings.seo.shareImage);

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: "%s · ka-media" },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: "ka-media",
      locale: "en_CA",
      url: "/",
      title,
      description,
      images: share ? [share] : [],
    },
    twitter: {
      card: share ? "summary_large_image" : "summary",
      title,
      description,
      images: share ? [share.url] : [],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();

  return (
    <html lang="en" className={`${hanken.variable} ${courier.variable}`}>
      <body>
        <RouteMemory />
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
        <Analytics />
      </body>
    </html>
  );
}
