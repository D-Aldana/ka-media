import type { ContentImage } from "./types";

/** Sanity hotspot (0–1) as a CSS object-position; centred when unset. */
export function focalPoint(image: ContentImage): string {
  if (!image.hotspot) return "50% 50%";
  return `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`;
}

/** The image shape every GROQ projection returns. */
export type RawImage = {
  alt?: string | null;
  hotspot?: { x: number; y: number } | null;
  asset?: {
    url?: string | null;
    lqip?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
};

/** Null whenever the field is empty, which every image slot already handles. */
export function toContentImage(raw: RawImage | null | undefined): ContentImage | null {
  const url = raw?.asset?.url;
  if (!url) return null;

  return {
    url,
    alt: raw?.alt ?? "",
    width: raw?.asset?.width ?? null,
    height: raw?.asset?.height ?? null,
    lqip: raw?.asset?.lqip ?? null,
    hotspot: raw?.hotspot ?? null,
  };
}

/**
 * Open Graph wants a 1200×630 crop; the hotspot decides what survives it.
 * Explicitly JPEG rather than `auto=format`: link-preview scrapers are not
 * browsers, and several of them will not render the WebP that would negotiate.
 */
export function ogImage(image: ContentImage | null): {
  url: string;
  width: number;
  height: number;
  alt: string;
} | null {
  if (!image) return null;

  const url = new URL(image.url);
  url.searchParams.set("w", "1200");
  url.searchParams.set("h", "630");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("fm", "jpg");
  url.searchParams.set("q", "80");
  if (image.hotspot) {
    url.searchParams.set("crop", "focalpoint");
    url.searchParams.set("fp-x", String(image.hotspot.x));
    url.searchParams.set("fp-y", String(image.hotspot.y));
  }

  return { url: url.href, width: 1200, height: 630, alt: image.alt };
}
