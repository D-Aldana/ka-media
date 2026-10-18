import type { Metadata } from "next";
import { Fragment, type CSSProperties } from "react";

import { instagramDm } from "@/lib/contact";
import { getContactPage, getSettings } from "@/lib/content";

import styles from "./page.module.css";

/** Used until Krystien writes his own copy in the Studio. */
const DEFAULTS = {
  eyebrow: "contact",
  headline: "Shoot me\na message.",
  intro:
    "A question about a photo, or just want to talk shop — always happy to hear from people.",
  emailLabel: "email",
  emailNote: "The fastest way to reach me — I usually reply within a day.",
  instagramLabel: "instagram",
  instagramNote: "DMs are open, and new work lands here first.",
  locationLabel: "based in",
  locationNote: "Where most of the games happen.",
  seoTitle: "Contact Krystien Aldana",
  seoDescription:
    "Get in touch with Krystien Aldana, a sports photographer and filmmaker in Prince George, BC.",
};

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactPage();

  return {
    title: contact.seo.title || DEFAULTS.seoTitle,
    description: contact.seo.description || DEFAULTS.seoDescription,
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const [contact, settings] = await Promise.all([getContactPage(), getSettings()]);

  const frames = [
    {
      label: contact.emailLabel ?? DEFAULTS.emailLabel,
      value: settings.email,
      note: contact.emailNote ?? DEFAULTS.emailNote,
      href: `mailto:${settings.email}`,
    },
    {
      label: contact.instagramLabel ?? DEFAULTS.instagramLabel,
      value: settings.instagramHandle,
      note: contact.instagramNote ?? DEFAULTS.instagramNote,
      href: instagramDm(settings.instagramHandle, settings.instagramUrl),
    },
    {
      label: contact.locationLabel ?? DEFAULTS.locationLabel,
      value: settings.location,
      note: contact.locationNote ?? DEFAULTS.locationNote,
      href: null,
    },
  ];

  return (
    <div className={styles.page} data-route="contact">
      <header className={styles.intro}>
        <span className={styles.eyebrow}>
          {contact.eyebrow ?? DEFAULTS.eyebrow}
        </span>
        <h1 className={styles.headline}>
          <Headline text={contact.headline ?? DEFAULTS.headline} />
        </h1>
        <p className={styles.blurb}>{contact.intro ?? DEFAULTS.intro}</p>
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

/** The editor's line breaks are the design's: "Shoot me / a message." */
function Headline({ text }: { text: string }) {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line, index) => (
      <Fragment key={index}>
        {index > 0 && <br />}
        {line}
      </Fragment>
    ));
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
