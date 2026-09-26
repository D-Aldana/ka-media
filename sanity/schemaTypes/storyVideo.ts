import { defineField, defineType } from "sanity";

const MAX_BYTES = 12 * 1024 * 1024;

export const storyVideo = defineType({
  name: "storyVideo",
  title: "Reel",
  type: "object",
  fields: [
    defineField({
      name: "file",
      title: "Video file",
      type: "file",
      options: { accept: "video/mp4" },
      description:
        "A 9:16 MP4, compressed before upload — see the README. Nothing else streams well.",
      validation: (rule) =>
        rule.required().custom(async (value, context) => {
          const ref = (value as { asset?: { _ref?: string } } | undefined)?.asset?._ref;
          if (!ref) return true;

          // The site has no transcoding, so an uncompressed upload is served
          // as-is to every visitor and spends bandwidth the whole site shares.
          const size = await context
            .getClient({ apiVersion: "2026-09-24" })
            .fetch<number | null>(`*[_id == $ref][0].size`, { ref });
          if (typeof size !== "number" || size <= MAX_BYTES) return true;

          const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
          return `${mb(size)} is too big — re-encode it under ${mb(MAX_BYTES)} first (see the README).`;
        }),
    }),
    defineField({
      name: "poster",
      type: "image",
      options: { hotspot: true },
      description: "The still shown before the reel plays, and in the mini story.",
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required().max(160),
        }),
      ],
    }),
    defineField({ name: "caption", type: "string", validation: (rule) => rule.max(80) }),
  ],
  preview: {
    select: { title: "caption", media: "poster" },
    prepare: ({ title, media }) => ({ title: title || "Reel", media }),
  },
});
