/**
 * Navigation intent, passed to `<Link transitionTypes>` and matched in
 * `PageTransition` to an animation. Only the link knows which it is, so the
 * type is set per link rather than derived from the two paths.
 *
 * An untyped navigation — the browser's back button, a swipe gesture,
 * `router.refresh()` — carries no type and animates nothing.
 */
export const NAV = {
  /** Deeper in: the grid into a story, home into a filtered grid. */
  forward: ["nav-forward"],
  /** Back out to the page that opened this one. */
  back: ["nav-back"],
  /** Sideways between top-level pages, which have no depth between them. */
  page: ["nav-page"],
  /** Along to the next story — the same depth, one frame over. */
  advance: ["nav-advance"],
  /** Not a trip at all: the Work grid re-sorting under a filter. */
  filter: ["nav-filter"],
};

/**
 * Pairs a Work card's cover with the story deck it opens, so the two animate
 * as one object. Both sides are built from the slug, the only identity they
 * share; a `view-transition-name` has to be a CSS ident, which a slug is not
 * guaranteed to be.
 */
export function coverName(kind: "game" | "single", slug: string): string {
  return `cover-${kind}-${slug.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

/**
 * Names a Work card so the browser can follow it across a filter change. A
 * card that survives the filter is the same photo in a new slot, and only a
 * shared name tells the browser that.
 */
export function cardName(kind: "game" | "single", slug: string): string {
  return `card-${kind}-${slug.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
