import { defineField, defineType } from "sanity";

export const settings = defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  fields: [
    defineField({
      name: "email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "emailNote",
      type: "string",
      description: "The line under the email on the Contact page.",
    }),
    defineField({
      name: "instagramHandle",
      type: "string",
      description: "Shown as text, e.g. @kamedia._",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "instagramUrl",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "instagramNote",
      type: "string",
      description: "The line under the Instagram handle on the Contact page.",
    }),
    defineField({
      name: "location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "locationNote",
      type: "string",
      description: "The line under the location on the Contact page.",
    }),
    defineField({
      name: "contactIntro",
      type: "text",
      rows: 3,
      description: "The paragraph under the Contact heading.",
    }),
    defineField({
      name: "seo",
      title: "Search and sharing",
      type: "object",
      description: "What search engines and link previews show for the site itself.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "title",
          type: "string",
          description: "Overrides the built-in home page title.",
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: "description",
          type: "text",
          rows: 3,
          description: "The sentence under the title in search results.",
          validation: (rule) => rule.max(160),
        }),
        defineField({
          name: "shareImage",
          type: "image",
          description:
            "The preview when the site is linked anywhere. Cropped to 1200×630 — set the hotspot so the crop keeps the subject.",
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
    }),
    defineField({
      name: "latestGame",
      type: "reference",
      to: [{ type: "game" }],
      description: "Pins the home page's latest game. Empty means the newest one.",
    }),
  ],
  preview: { prepare: () => ({ title: "Settings" }) },
});
