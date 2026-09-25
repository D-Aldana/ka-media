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
