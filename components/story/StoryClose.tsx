"use client";

import Link from "next/link";

import { UnderlineLink } from "@/components/ui/UnderlineLink";

import { useCloseStory } from "./useCloseStory";

export function StoryCloseLink({ className }: { className?: string }) {
  const { href, onClick } = useCloseStory();

  return (
    <UnderlineLink href={href} className={className} onClick={onClick}>
      <span aria-hidden="true">×</span> close
    </UnderlineLink>
  );
}

export function StoryCloseButton({ className }: { className?: string }) {
  const { href, onClick } = useCloseStory();

  return (
    <Link href={href} className={className} onClick={onClick}>
      <span className="sr-only">Close story</span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M4 4l12 12M16 4L4 16" />
      </svg>
    </Link>
  );
}
