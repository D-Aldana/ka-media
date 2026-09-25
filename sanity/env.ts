export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-09-24";

/** With no project id the content layer falls back to placeholder content. */
export const isSanityConfigured = projectId.length > 0;
