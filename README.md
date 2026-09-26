This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/(site)/page.tsx`. The page auto-updates as you edit the file.

Fonts are Hanken Grotesk and Courier Prime, loaded through [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Sanity

Content lives in Sanity; the Studio is embedded at `/studio`. `lib/content.ts`
is the only module that talks to it — components take plain types from
`lib/types.ts`.

### Environment

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | The project to read — the id in the project URL at [sanity.io/manage](https://www.sanity.io/manage), or from `npx sanity projects list`. Unset means the site renders `lib/placeholder-content.ts` instead, which is a local convenience only. |
| `NEXT_PUBLIC_SANITY_DATASET` | Defaults to `production`. |
| `SANITY_REVALIDATE_SECRET` | Shared with the publish webhook below. Unset means the webhook 401s, so publishes won't go live until the hourly revalidate catches up. |

Set all three in Vercel. A configured project with an empty dataset renders
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

### Publish webhook

`/api/revalidate` revalidates by cache tag, so publishing doesn't need a
redeploy. Create the webhook in Sanity Manage (API → Webhooks) with:

- **URL** — `https://<site>/api/revalidate`
- **Trigger on** — create, update, delete
- **Filter** — `_type in ["game", "about", "settings"]`
- **Projection** — `{"tags": [_type]}`
- **Secret** — the same value as `SANITY_REVALIDATE_SECRET`

The tags match the ones `lib/content.ts` attaches to each query. Reads also
carry a one-hour `revalidate` as a backstop, so a missed webhook self-heals.
