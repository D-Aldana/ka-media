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
| `NEXT_PUBLIC_SITE_URL` | The site's own origin, e.g. `https://kamedia.ca` — canonical tags, the sitemap and share image URLs are built from it. Unset, Vercel's production URL stands in, which is right for previews and before the domain is connected. Locally it falls back to `http://localhost:3000`. |
| `SANITY_REVALIDATE_SECRET` | Shared with the publish webhook below. Unset means the webhook 401s, so publishes won't go live until the hourly revalidate catches up. |

Set all three in Vercel. A configured project with an empty dataset renders
empty sections — it never falls back to placeholder content.

**Fill in Settings first.** It drives the email, Instagram and location shown
in the footer, the mobile menu, the home CTA and `/contact`. Until it exists,
those elements are omitted rather than rendered blank, which leaves `/contact`
with a heading and no way to make contact.

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

After the domain is connected, set `NEXT_PUBLIC_SITE_URL` and submit
`https://<site>/sitemap.xml` in Google Search Console.

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
