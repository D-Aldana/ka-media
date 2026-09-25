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
      name: "location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactIntro",
      type: "text",
      rows: 3,
      description: "The paragraph under the Contact heading.",
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
