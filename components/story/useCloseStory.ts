"use client";

import { useRouter } from "next/navigation";
import { addTransitionType, startTransition, useCallback } from "react";
import type { MouseEvent } from "react";

import { previousPath } from "@/components/site/RouteMemory";
import { NAV } from "@/lib/transitions";

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

  /* `router.back()` takes no transition types of its own, so the type is
     added to the transition it runs inside. */
  const back = useCallback(() => {
    startTransition(() => {
      addTransitionType(NAV.back[0]);
      router.back();
    });
  }, [router]);

  const close = useCallback(() => {
    const from = previousPath();
    if (returnable(from)) back();
    else router.push(FALLBACK, { transitionTypes: NAV.back });
  }, [router, back]);

  const onClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey) return;
      if (event.shiftKey || event.altKey) return;
      if (!returnable(previousPath())) return;

      event.preventDefault();
      back();
    },
    [back],
  );

  return { href: FALLBACK, onClick, close };
}
