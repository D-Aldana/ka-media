import { defineArrayMember, defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "headline",
      type: "string",
      description: "The short line on the home page summary.",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "quote",
      type: "text",
      rows: 2,
      description: "The longer pull quote under the name on the About page.",
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "bio",
      type: "array",
      of: [defineArrayMember({ type: "block", styles: [], lists: [] })],
    }),
    defineField({
      name: "portrait",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required().max(160),
        }),
      ],
    }),
    defineField({
      name: "services",
      title: "What I shoot",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "service",
          fields: [
            defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", type: "text", rows: 2 }),
          ],
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "photos",
      type: "array",
      description: "Three frames under the services.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required().max(160),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: { prepare: () => ({ title: "About" }) },
});
