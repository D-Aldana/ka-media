import { KaMark } from "@/components/site/Wordmark";
import { ClientList } from "@/components/ui/ClientList";
import { CoverImage } from "@/components/ui/CoverImage";
import { Reveal } from "@/components/ui/Reveal";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { NAV } from "@/lib/transitions";
import type { AboutSummary, Settings } from "@/lib/types";

import styles from "./AboutCredential.module.css";
import { CredentialTilt } from "./CredentialTilt";

type Props = { about: AboutSummary; settings: Settings };

/** The season the pass is issued for: September rolls it over, like a school year. */
function season(now = new Date()) {
  const start = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  return `${start}–${String(start + 1).slice(2)}`;
}

/**
 * Bar widths for the barcode, derived from the name so the pattern is stable
 * between renders and looks like it encodes something. Not a scannable
 * symbology — just the right rhythm of thick and thin.
 */
function bars(seed: string) {
  const out: { x: number; w: number }[] = [];
  let x = 0;
  const source = `*${seed.toUpperCase() || "KA-MEDIA"}*`;
  for (const char of source) {
    const code = char.charCodeAt(0);
    for (let bit = 0; bit < 5; bit++) {
      const w = (code >> bit) & 1 ? 3 : 1;
      out.push({ x, w });
      x += w + ((code >> (bit + 2)) & 1 ? 2 : 1);
    }
    x += 2;
  }
  return { out, width: x };
}

/** Lanyard: two woven straps falling in a V to a swivel clip. */
function Lanyard() {
  const strap = "KA-MEDIA   ·   ".repeat(6);
  return (
    <svg
      className={styles.lanyard}
      viewBox="0 0 200 260"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="weave" width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill="#b3301b" />
          <rect width="3" height="1" fill="#c63a22" />
        </pattern>
        <linearGradient id="strapShade" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="0.3" stopColor="#000" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f2ef" />
          <stop offset="0.45" stopColor="#9a9a96" />
          <stop offset="0.55" stopColor="#d8d8d4" />
          <stop offset="1" stopColor="#6d6d69" />
        </linearGradient>
        <path id="strapL" d="M30 -10 L94 196" />
        <path id="strapR" d="M106 196 L170 -10" />
      </defs>

      {/* Back strap is a shade darker: it sits behind the fold. */}
      <path d="M156 -10 L184 -10 L112 200 L98 200 Z" fill="url(#weave)" />
      <path d="M156 -10 L184 -10 L112 200 L98 200 Z" fill="#000" opacity="0.28" />
      <path d="M16 -10 L44 -10 L102 200 L88 200 Z" fill="url(#weave)" />
      <path d="M16 -10 L44 -10 L102 200 L88 200 Z" fill="url(#strapShade)" />
      <text className={styles.strapText}>
        <textPath href="#strapL">{strap}</textPath>
      </text>
      <text className={`${styles.strapText} ${styles.strapBack}`}>
        <textPath href="#strapR">{strap}</textPath>
      </text>

      {/* Crimp where the straps are stitched into the clip. */}
      <rect x="86" y="194" width="28" height="14" rx="2" fill="url(#metal)" />
      {/* Swivel and lobster clasp. */}
      <circle cx="100" cy="214" r="5" fill="none" stroke="url(#metal)" strokeWidth="3" />
      <path
        d="M100 219 C 86 222, 86 246, 100 250 C 112 252, 116 240, 110 232"
        fill="none"
        stroke="url(#metal)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path d="M106 226 L112 236" stroke="#8a8a86" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The About summary as a sideline media credential: a printed PVC pass in a
 * clear sleeve, hung from a woven lanyard. Services read as the zones it
 * grants access to.
 */
export function AboutCredential({ about, settings }: Props) {
  const firstName = about.name.split(" ")[0];
  const code = bars(about.name);

  return (
    <section className={styles.section}>
      <Reveal className={styles.copy}>
        <span className={styles.label}>about</span>
        <h2 className={styles.heading}>
          All access,
          <br />
          every game.
        </h2>
        <p className={styles.headline}>{about.headline}</p>
        {about.clients.length > 0 && (
          <p className={styles.clients}>
            <span className={styles.label}>shot for</span>
            <ClientList clients={about.clients} />
          </p>
        )}
        <UnderlineLink href="/about" transitionTypes={NAV.page}>
          More about {firstName || "me"}
        </UnderlineLink>
      </Reveal>

      <Reveal className={styles.stage}>
        <div className={styles.swing}>
          <Lanyard />

          <CredentialTilt className={styles.tilt}>
            <div className={styles.sleeve}>
              <span className={styles.slot} aria-hidden="true" />

              <div className={styles.card}>
                <div className={styles.top}>
                  <span className={styles.brand} role="img" aria-label="ka-media">
                    <KaMark />
                  </span>
                  <span className={styles.fine}>{season()} season</span>
                </div>

                <div className={styles.band}>
                  <span className={styles.bandTitle}>Media</span>
                  <span className={styles.bandSub}>photo · film</span>
                </div>

                <div className={styles.idRow}>
                  <div className={styles.photoWrap}>
                    <CoverImage
                      image={about.portrait}
                      className={styles.photo}
                      sizes="(max-width: 860px) 100px, 120px"
                      decorative
                    />
                    <span className={styles.holo} aria-hidden="true" />
                  </div>
                  <div className={styles.who}>
                    <span className={styles.fine}>name</span>
                    <span className={styles.name}>{about.name}</span>
                    <span className={styles.fine}>role</span>
                    <span className={styles.role}>Photographer / Filmmaker</span>
                    {settings.location && (
                      <>
                        <span className={styles.fine}>based</span>
                        <span className={styles.role}>{settings.location}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.zones}>
                  <span className={styles.fine}>access</span>
                  <ul>
                    {about.services.map((service, index) => (
                      <li key={service._key}>
                        <span className={styles.zoneCode}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{service.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.areas}>
                  <span className={styles.fine}>zones</span>
                  <div className={styles.grid} aria-hidden="true">
                    {["field", "court", "bench", "tunnel", "press", "all"].map(
                      (zone, index) => (
                        <span key={zone} className={styles.cell}>
                          <b>{index + 1}</b>
                          {zone}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className={styles.foot}>
                  <svg
                    className={styles.barcode}
                    viewBox={`0 0 ${code.width} 30`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    {code.out.map((bar, index) => (
                      <rect key={index} x={bar.x} width={bar.w} height="30" />
                    ))}
                  </svg>
                  <div className={styles.serial}>
                    <span className={styles.fine}>no.</span>
                    <span className={styles.serialNo}>KA-0001</span>
                  </div>
                </div>

                <p className={styles.legal}>
                  Non-transferable · Must be worn visibly at all times
                </p>
              </div>
            </div>
          </CredentialTilt>
        </div>
      </Reveal>
    </section>
  );
}
