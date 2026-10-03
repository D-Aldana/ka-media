# ka-media

Portfolio site for Krystien Aldana, a sports photographer and filmmaker in
Prince George, BC. His basketball, soccer and football work is organised by
game and plays like Instagram stories.

**Live at [www.ka-media.ca](https://www.ka-media.ca)** — the apex redirects to
`www`, which is the canonical host.

Next.js (App Router) and React with CSS Modules and styled-components, content
in Sanity, deployed on Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the Sanity project id
npm run dev
```

[http://localhost:3000](http://localhost:3000) serves the site and
`/studio` the embedded Sanity Studio. Without `NEXT_PUBLIC_SANITY_PROJECT_ID`
the site renders `lib/placeholder-content.ts`, so it runs before Sanity is set
up — see [Environment](#environment).

| Script | |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run usage` | Dataset storage and oversized reels — see [Video](#video) |

Fonts are Hanken Grotesk and Courier Prime, loaded through
[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts).

## Layout

| Path | |
| --- | --- |
| `app/(site)` | The four pages — home, `work`, `work/[slug]`, `about`, `contact` |
| `app/(studio)/studio` | Embedded Sanity Studio |
| `app/api/revalidate` | Publish webhook — see [Publish webhook](#publish-webhook) |
| `components/` | `home`, `work`, `story` (the deck and its player), `site` (header, footer, menu), `ui` |
| `lib/` | `content.ts` and `queries.ts` for reads, `types.ts` for the shapes components take |
| `sanity/schemaTypes` | `game`, `about`, `settings`, `storyImage`, `storyVideo` |
| `docs/` | The PRD and the design references |

## Sanity

Content lives in Sanity; the Studio is embedded at `/studio`. `lib/content.ts`
is the only module that talks to it — components take plain types from
`lib/types.ts`.

### Environment

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | The project to read — the id in the project URL at [sanity.io/manage](https://www.sanity.io/manage), or from `npx sanity projects list`. Unset means the site renders `lib/placeholder-content.ts` instead, which is a local convenience only. |
| `NEXT_PUBLIC_SANITY_DATASET` | Defaults to `production`. |
| `NEXT_PUBLIC_SITE_URL` | The site's own origin — canonical tags, the sitemap and share image URLs are built from it. Set to `https://www.ka-media.ca` in production. Leave it unset everywhere else: previews then point at their own deployment URL rather than putting production URLs in a preview sitemap, and locally it falls back to `http://localhost:3000`. |
| `SANITY_REVALIDATE_SECRET` | Shared with the publish webhook below. Unset means the webhook 401s, so publishes won't go live until the hourly revalidate catches up. |

Set all four in Vercel. A configured project with an empty dataset renders
empty sections — it never falls back to placeholder content.

**Fill in Settings first.** It drives the email, Instagram and location shown
in the footer, the mobile menu, the home CTA and `/contact`. Until it exists,
those elements are omitted rather than rendered blank, which leaves `/contact`
with a heading and no way to make contact.

### Video

Reels are plain MP4 files uploaded to Sanity alongside the photos, played with a
native `<video>`. There is no video host and no transcoding, so **the file you
upload is the file every visitor downloads** — compress before uploading:

```bash
ffmpeg -i in.mov -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
  -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -movflags +faststart out.mp4
```

`+faststart` moves the index to the front of the file; without it playback waits
for the whole download. Aim for under 10 MB per reel — a 20-second clip lands
around 6 MB at these settings.

Use the original video, not an Instagram download: re-encoding an export that
was already re-encoded is what makes clips look mushy.

Sanity's free plan allows 100 GB of bandwidth a month and **does not permit
overages** — it blocks instead. Images come out of the same allowance, so a reel
left uncompressed spends the whole site's budget, not just its own. Each reel
only loads when a visitor reaches its slide, which is what keeps that number
comfortable.

Two things watch that for you. The Studio refuses a reel over 12 MB at publish
time, so an uncompressed file never reaches the dataset. And:

```bash
npm run usage
```

prints what the dataset stores, its share of the 100 GB, and any reel over the
10 MB budget. Worth running after loading a batch of games.

Storage is the half that lives in the dataset. **Bandwidth is not** — read that
in [Sanity Manage](https://www.sanity.io/manage) → the project → Usage, which is
also the only place that shows how close the month is to blocking. Check it
after anything that sends real traffic, like a story link from his Instagram.
If it ever gets tight, the fix is to move the MP4s to a bucket with free egress
(Cloudflare R2) and store the URL instead of the file — the player takes a plain
`src`, so nothing else changes.

### Search and sharing

`/sitemap.xml` and `/robots.txt` are generated at `app/sitemap.ts` and
`app/robots.ts` — the sitemap lists the four pages plus every visible game, so
hiding a game removes it from both the site and the sitemap. The home page also
carries JSON-LD (`Person` + `LocalBusiness`) built from Settings and About;
unfilled fields are dropped rather than published empty.

Titles, descriptions and share images come from the page, falling back to the
copy in `app/(site)/layout.tsx`. **Settings → Search and sharing** overrides the
site-wide three. Each game uses its own cover, cropped to 1200×630 through the
hotspot, so set the hotspot on covers whose subject is off-centre.

Submit `https://www.ka-media.ca/sitemap.xml` in Google Search Console —
resubmitting isn't needed after a publish, the sitemap regenerates on its own.

### Publish webhook

`/api/revalidate` revalidates by cache tag, so publishing doesn't need a
redeploy. Create the webhook in Sanity Manage (API → Webhooks) with:

- **URL** — `https://www.ka-media.ca/api/revalidate`
- **Trigger on** — create, update, delete
- **Filter** — `_type in ["game", "about", "settings"]`
- **Projection** — `{"tags": [_type]}`
- **Secret** — the same value as `SANITY_REVALIDATE_SECRET`

The tags match the ones `lib/content.ts` attaches to each query. Reads also
carry a one-hour `revalidate` as a backstop, so a missed webhook self-heals.
