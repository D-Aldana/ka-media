/** Matches the `data-route` each page sets, so the nav can underline it. */
export type RouteKey = "home" | "work" | "story" | "about" | "contact";

export const NAV_LINKS: { key: RouteKey; label: string; href: string }[] = [
  { key: "work", label: "Work", href: "/work" },
  { key: "story", label: "Stories", href: "/#latest" },
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export const MENU_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Stories", href: "/#latest" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
