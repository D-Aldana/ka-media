"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

import { MENU_LINKS } from "@/lib/nav";
import { NAV } from "@/lib/transitions";
import type { Settings } from "@/lib/types";

import styles from "./MobileMenu.module.css";

/* False on the server and through hydration, true once mounted: the panel
   portals into the body, which only exists on the client. */
const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function MobileMenu({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, onClient, onServer);
  const panelRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    burgerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  const panel = (
    <div
      ref={panelRef}
      id="mobile-menu"
      className={`${styles.panel} ${open ? styles.open : ""}`}
      inert={!open}
    >
      <div className={styles.top}>
        <span className={styles.wordmark}>ka-media</span>
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          aria-label="Close menu"
          onClick={close}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        </button>
      </div>

      <nav className={styles.links} aria-label="Menu">
        {MENU_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={close}
            transitionTypes={NAV.page}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className={styles.foot}>
        {settings.instagramUrl && (
          <a href={settings.instagramUrl}>{settings.instagramHandle}</a>
        )}
        {settings.location && <span>{settings.location.toLowerCase()}</span>}
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        className={styles.burger}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <svg
          width="22"
          height="14"
          viewBox="0 0 22 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M0 1h22M6 13h16" />
        </svg>
      </button>

      {/* The header's view-transition-name makes it the containing block for
          its fixed children, which would size the panel to the nav bar. It has
          to hang off the body to cover the viewport. */}
      {mounted && createPortal(panel, document.body)}
    </>
  );
}
