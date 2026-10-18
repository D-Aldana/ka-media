import { ViewTransition } from "react";

/**
 * Maps each navigation type to the animation class of the same name in
 * `globals.css`. `default: "none"` keeps an untyped navigation — browser back,
 * a refresh — from picking up a direction it has no basis for.
 */
const DIRECTION = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  "nav-page": "nav-page",
  "nav-advance": "nav-advance",
  default: "none",
};

/**
 * Wraps a page so it enters and leaves in the direction the link asked for.
 * This belongs in each `page.tsx`, not the layout: a layout persists across
 * navigations, so enter and exit would never fire there.
 *
 * `default="none"` stops the page from animating during unrelated transitions,
 * such as a cover morphing into its story.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={DIRECTION} exit={DIRECTION} default="none">
      {children}
    </ViewTransition>
  );
}
