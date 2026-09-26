/**
 * What the dataset is storing, and which assets are worth compressing.
 *
 * Storage is only half the picture: Sanity's free plan also caps bandwidth at
 * 100 GB a month and blocks rather than bills when it runs out. Bandwidth is
 * not in the dataset, so read it in Sanity Manage → Usage. This script answers
 * the half that is: what is in there, and what is oversized.
 */
import { createClient } from "@sanity/client";

const REEL_BUDGET = 10 * 1024 * 1024;
const PLAN_STORAGE = 100 * 1024 * 1024 * 1024;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (!projectId) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID is unset. Run with: node --env-file=.env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-09-24",
  useCdn: false,
});

type Asset = { originalFilename: string | null; size: number; url: string };

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

async function main() {
  const [files, images] = await Promise.all([
    client.fetch<Asset[]>(
      `*[_type == "sanity.fileAsset"]{originalFilename, size, url} | order(size desc)`,
    ),
    client.fetch<Asset[]>(
      `*[_type == "sanity.imageAsset"]{originalFilename, size, url} | order(size desc)`,
    ),
  ]);

  const total = (list: Asset[]) => list.reduce((sum, item) => sum + item.size, 0);
  const videoBytes = total(files);
  const imageBytes = total(images);
  const all = videoBytes + imageBytes;

  console.log(`\nvideo   ${String(files.length).padStart(4)} files   ${mb(videoBytes)}`);
  console.log(`images  ${String(images.length).padStart(4)} files   ${mb(imageBytes)}`);
  console.log(
    `total                  ${mb(all)}  ` +
      `(${((all / PLAN_STORAGE) * 100).toFixed(2)}% of the free plan's 100 GB)\n`,
  );

  const heavy = files.filter((file) => file.size > REEL_BUDGET);
  if (heavy.length === 0) {
    console.log(`Every reel is under ${mb(REEL_BUDGET)}.\n`);
    return;
  }

  console.log(`Over the ${mb(REEL_BUDGET)} reel budget — re-encode these (README → Video):`);
  for (const file of heavy) {
    console.log(`  ${mb(file.size).padStart(9)}  ${file.originalFilename ?? file.url}`);
  }
  console.log();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
