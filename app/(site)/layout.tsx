import { Analytics } from "@vercel/analytics/next";

import type { Metadata } from "next";
import { Courier_Prime, Hanken_Grotesk } from "next/font/google";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { RouteMemory } from "@/components/site/RouteMemory";
import { getSettings } from "@/lib/content";

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

export const metadata: Metadata = {
  title: {
    default: "ka-media — game-day photo & film",
    template: "%s · ka-media",
  },
  description:
    "Krystien Aldana shoots basketball, soccer and football in Prince George, BC — game-day photography, highlight films and social-ready edits.",
};

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
