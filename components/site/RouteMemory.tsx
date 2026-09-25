"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

let current: string | null = null;
let previous: string | null = null;

/** Where the last in-app navigation came from; null on a cold load. */
export function previousPath() {
  return previous;
}

/**
 * A story's close link has to know which page opened it, which the URL cannot
 * say. Module state rather than a store: it only needs to outlive a client
 * navigation, and a hard reload should forget it.
 */
export function RouteMemory() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === current) return;
    previous = current;
    current = pathname;
  }, [pathname]);

  return null;
}
