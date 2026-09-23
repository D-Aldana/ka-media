import type { ContentImage } from "./types";

/** Sanity hotspot (0–1) as a CSS object-position; centred when unset. */
export function focalPoint(image: ContentImage): string {
  if (!image.hotspot) return "50% 50%";
  return `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`;
}
