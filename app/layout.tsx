import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KAMedia | Portfolio",
  description:
    "KAMedia | Professional sports photography and videography specializing in cinematic storytelling. View photo galleries, highlight reels, and contact for bookings.",
  keywords: [
    "KAMedia",
    "UNBC",
    "Photography",
    "Basketball",
    "Hockey",
    "Football",
    "Volleyball",
    "Soccer",
    "Athletics",
    "Videography",
    "Prince George",
    "Sports Photography",
    "Videography",
    "Cinematic Storytelling",
    "Photo Galleries",
    "Highlight Reels",
    "Professional Photographer",
    "Sports Videographer",
    "Event Coverage",
    "Athlete Portraits",
    "Action Shots",
    "Sports Events",
    "Photography Services",
    "UNBC",
    "Prince George Photographer",
    "Sports Highlights",
    "Visual Storytelling",
    "KAMedia Portfolio",
    "Krystien Aldana",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
