import type { HotspotPreview } from "sanity";

/**
 * The frames each image actually lands in. Passed to the crop tool as hotspot
 * previews, so an editor sees every ratio the photo will be cut to before
 * publishing instead of guessing from the full-bleed original.
 */
export const FRAMES: Record<string, HotspotPreview[]> = {
  /** Game covers: cards and tiles, the mobile home mini, and link previews. */
  cover: [
    { title: "Card 4:5", aspectRatio: 4 / 5 },
    { title: "Home mini", aspectRatio: 9 / 14 },
    { title: "Link preview", aspectRatio: 1200 / 630 },
  ],
  /** Story photos and reel posters: the stage, and the home mini on mobile. */
  story: [
    { title: "Stage 9:16", aspectRatio: 9 / 16 },
    { title: "Home mini", aspectRatio: 9 / 14 },
  ],
  portrait: [{ title: "Portrait 4:5", aspectRatio: 4 / 5 }],
  share: [{ title: "Link preview 1200×630", aspectRatio: 1200 / 630 }],
};
