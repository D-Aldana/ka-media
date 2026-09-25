import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/** Fresh reads for generateStaticParams and anything that must not lag. */
export const freshClient = client.withConfig({ useCdn: false });
