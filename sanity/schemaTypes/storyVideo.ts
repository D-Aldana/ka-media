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
