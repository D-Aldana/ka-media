import { defineField, defineType } from "sanity";

export const storyVideo = defineType({
  name: "storyVideo",
  title: "Reel",
  type: "object",
  fields: [
    defineField({
      name: "video",
      type: "mux.video",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "poster",
      type: "image",
      options: { hotspot: true },
      description: "Optional still shown before the reel plays.",
    }),
    defineField({
      name: "posterAlt",
      title: "Poster alt text",
      type: "string",
      hidden: ({ parent }) => !parent?.poster,
      validation: (rule) =>
        rule.max(160).custom((value, context) => {
          const parent = context.parent as { poster?: unknown } | undefined;
          if (parent?.poster && !value) return "Add alt text for the poster.";
          return true;
        }),
    }),
    defineField({ name: "caption", type: "string", validation: (rule) => rule.max(80) }),
  ],
  preview: {
    select: { title: "caption", media: "poster" },
    prepare: ({ title, media }) => ({ title: title || "Reel", media }),
  },
});
