"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Resizing happens on Sanity's CDN rather than Vercel's optimizer: the assets
 * are already there, and it keeps image transforms off the hosting bill.
 * Non-Sanity sources are returned untouched.
 */
export default function sanityLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.href;
}
