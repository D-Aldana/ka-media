import type { Metadata } from "next";
import type { CSSProperties } from "react";

import { getSettings } from "@/lib/content";

import styles from "./page.module.css";

/** Used until Krystien writes his own intro in the Studio. */
const DEFAULT_INTRO =
  "A game coming up, a question about a photo, or just want to talk shop. Teams, schools, clubs, athletes and parents all welcome.";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Krystien Aldana about game-day photography and film in Prince George, BC.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  const frames = [
    {
      label: "email",
      value: settings.email,
      note: "The fastest way to reach me — I usually reply within a day.",
      href: `mailto:${settings.email}`,
    },
    {
      label: "instagram",
      value: settings.instagramHandle,
      note: "DMs are open, and new work lands here first.",
      href: settings.instagramUrl,
    },
    {
      label: "based in",
      value: settings.location,
      note: "Travelling for a tournament is no problem — just ask.",
      href: null,
    },
  ];

  return (
    <div className={styles.page} data-route="contact">
      <header className={styles.intro}>
        <span className={styles.eyebrow}>contact</span>
        <h1 className={styles.headline}>
          Shoot me
          <br />a message.
        </h1>
        <p className={styles.blurb}>{settings.contactIntro ?? DEFAULT_INTRO}</p>
      </header>

      <ul className={styles.strip}>
        {frames
          .filter((frame) => frame.value)
          .map((frame, index) => (
            <li
              key={frame.label}
              className={styles.cell}
              style={{ "--i": index } as CSSProperties}
            >
              <Frame {...frame} />
            </li>
          ))}
      </ul>
    </div>
  );
}

type FrameProps = {
  label: string;
  value: string;
  note: string;
  href: string | null;
};

function Frame({ label, value, note, href }: FrameProps) {
  const body = (
    <>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      <span className={styles.note}>{note}</span>
    </>
  );

  return href ? (
    <a href={href} className={styles.frame}>
      {body}
    </a>
  ) : (
    <div className={styles.frame}>{body}</div>
  );
}
