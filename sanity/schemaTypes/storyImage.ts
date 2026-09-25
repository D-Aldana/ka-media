import { defineField, defineType } from "sanity";

export const storyImage = defineType({
  name: "storyImage",
  title: "Photo",
  type: "object",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "What the photo shows, for screen readers.",
          validation: (rule) => rule.required().max(160),
        }),
      ],
    }),
    defineField({ name: "caption", type: "string", validation: (rule) => rule.max(80) }),
  ],
  preview: {
    select: { title: "image.alt", subtitle: "caption", media: "image" },
    prepare: ({ title, subtitle, media }) => ({ title: title || "Photo", subtitle, media }),
  },
});
