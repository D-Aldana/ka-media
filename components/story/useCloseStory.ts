"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { MouseEvent } from "react";

import { previousPath } from "@/components/site/RouteMemory";

/** Where a story closes to when there is no in-app page to return to. */
const FALLBACK = "/work";

/** A story reached from another story: stepping back is not "close". */
function returnable(path: string | null): path is string {
  return path !== null && !path.startsWith("/work/");
}

/**
 * Closing returns to whatever opened the story — the home filmstrip, or the
 * Work grid with its filter intact. `href` stays on Work so the link still
 * means something to a new tab, a crawler, or a visitor who landed here cold.
 */
export function useCloseStory() {
  const router = useRouter();

  const close = useCallback(() => {
    const from = previousPath();
    if (returnable(from)) router.back();
    else router.push(FALLBACK);
  }, [router]);

  const onClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey) return;
      if (event.shiftKey || event.altKey) return;
      if (!returnable(previousPath())) return;

      event.preventDefault();
      router.back();
    },
    [router],
  );

  return { href: FALLBACK, onClick, close };
}
