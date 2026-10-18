import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/site/JsonLd";
import { PageTransition } from "@/components/site/PageTransition";
import { StoryCloseButton, StoryCloseLink } from "@/components/story/StoryClose";
import { StoryDeck } from "@/components/story/StoryDeck";
import { LabelLinks } from "@/components/work/LabelLinks";
import { getSettings, getSingle, getSingleSlugs } from "@/lib/content";
import { formatDate, sportLabel } from "@/lib/format";
import { ogImage } from "@/lib/image";
import { coverName } from "@/lib/transitions";
import type { StoryItem } from "@/lib/types";

// The game page's layout, so a single reads as a one-frame story.
import styles from "../../[slug]/page.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getSingleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const single = await getSingle(slug);
  if (!single) return {};

  const description = single.caption ?? `${single.sport} · ${formatDate(single.date)}`;
  const share = ogImage(single.image);
  const path = `/work/photo/${single.slug}`;
  const topic = single.sport === "other" ? "Photography" : `${sportLabel(single.sport)} photography`;

  return {
    title: `${single.title} — ${topic} in Prince George`,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: single.title,
      description,
      images: share ? [share] : [],
    },
    twitter: {
      card: share ? "summary_large_image" : "summary",
      title: single.title,
      description,
      images: share ? [share.url] : [],
    },
  };
}

export default async function SinglePage({ params }: Props) {
  const { slug } = await params;
  const [single, settings] = await Promise.all([getSingle(slug), getSettings()]);
  if (!single) notFound();

  const stories: StoryItem[] = [
    { _key: single._id, _type: "storyImage", image: single.image, caption: null },
  ];
  const meta = `single · ${single.sport} · ${formatDate(single.date)}`;

  return (
    <PageTransition>
      <section className={styles.page} data-route="story">
        <Breadcrumbs title={single.title} path={`/work/photo/${single.slug}`} />
        <StoryCloseLink className={styles.close} />

        <div className={styles.left}>
          <span className={styles.label}>{meta}</span>
          <h1 className={styles.title}>{single.title}</h1>
          <LabelLinks labels={single.labels} />
        </div>

        <StoryDeck
          stories={stories}
          title={single.title}
          handle={settings.instagramHandle}
          className={styles.stage}
          sizes="(max-width: 860px) 100vw, 420px"
          actions={<StoryCloseButton className={styles.mobileClose} />}
          viewTransitionName={coverName("single", single.slug)}
        >
          {single.caption && (
            <span className={styles.statLine}>
              <span>{single.caption}</span>
            </span>
          )}

          <div className={styles.mobileInfo}>
            <span className={styles.label}>{meta}</span>
            {single.caption && <span className={styles.mobileStat}>{single.caption}</span>}
            <p className={styles.mobileBlurb}>{single.title}</p>
            <LabelLinks labels={single.labels} />
          </div>
        </StoryDeck>
      </section>
    </PageTransition>
  );
}
