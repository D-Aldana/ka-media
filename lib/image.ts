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
  crop?: RawCrop | null;
  asset?: {
    url?: string | null;
    lqip?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
};

/** Sanity stores the crop as the fraction trimmed off each edge. */
type RawCrop = { top: number; bottom: number; left: number; right: number };

/** Ignores the zeroed crop the Studio writes alongside every hotspot. */
function trimmed(crop: RawCrop | null | undefined): RawCrop | null {
  if (!crop) return null;
  const { top, bottom, left, right } = crop;
  return top || bottom || left || right ? crop : null;
}

/**
 * `rect` is in source pixels, so a crop can only be applied to an asset whose
 * dimension metadata came back. Everything downstream — srcset widths, the OG
 * crop — then works from the cropped frame rather than the original.
 */
function cropped(url: string, crop: RawCrop, width: number, height: number) {
  const w = Math.max(1, Math.round(width * (1 - crop.left - crop.right)));
  const h = Math.max(1, Math.round(height * (1 - crop.top - crop.bottom)));
  const next = new URL(url);
  next.searchParams.set("rect", [
    Math.round(width * crop.left),
    Math.round(height * crop.top),
    w,
    h,
  ].join(","));
  return { url: next.href, width: w, height: h };
}

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** The hotspot re-expressed in the cropped frame's own coordinates. */
function insideCrop(hotspot: { x: number; y: number }, crop: RawCrop) {
  const spanX = 1 - crop.left - crop.right;
  const spanY = 1 - crop.top - crop.bottom;
  if (spanX <= 0 || spanY <= 0) return null;
  return { x: clamp((hotspot.x - crop.left) / spanX), y: clamp((hotspot.y - crop.top) / spanY) };
}

/** Null whenever the field is empty, which every image slot already handles. */
export function toContentImage(raw: RawImage | null | undefined): ContentImage | null {
  const source = raw?.asset?.url;
  if (!source) return null;

  const width = raw?.asset?.width ?? null;
  const height = raw?.asset?.height ?? null;
  const crop = trimmed(raw?.crop);
  const frame = crop && width && height ? cropped(source, crop, width, height) : null;
  const hotspot = raw?.hotspot ?? null;

  return {
    url: frame?.url ?? source,
    alt: raw?.alt ?? "",
    width: frame?.width ?? width,
    height: frame?.height ?? height,
    lqip: raw?.asset?.lqip ?? null,
    hotspot: hotspot && crop ? insideCrop(hotspot, crop) : hotspot,
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
