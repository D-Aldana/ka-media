import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

/* createClient throws on an empty id, which would take down the placeholder
   fallback the content layer promises. Nothing reads through this client
   until a real id is set. */
export const client = createClient({
  projectId: projectId || "unconfigured",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/** Fresh reads for generateStaticParams and anything that must not lag. */
export const freshClient = client.withConfig({ useCdn: false });
