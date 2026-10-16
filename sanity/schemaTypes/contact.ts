import { defineField, defineType } from "sanity";

/**
 * The Contact page's copy. The email, handle and location themselves stay in
 * Settings, since the header, footer and JSON-LD read them too — this document
 * is only what the page says around them.
 */
export const contact = defineType({
  name: "contact",
  title: "Contact",
  type: "document",
  fieldsets: [
    {
      name: "frames",
      title: "The three frames",
      description:
        "The label and the line under each detail. The details themselves — email, Instagram, location — are in Settings.",
      options: { collapsible: true },
    },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      description: "The small label above the heading.",
      initialValue: "contact",
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: "headline",
      type: "text",
      rows: 2,
      description: "The big heading. A line break here is kept on the page.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "intro",
      type: "text",
      rows: 3,
      description: "The paragraph under the heading.",
    }),
    defineField({
      name: "emailLabel",
      title: "Email label",
      type: "string",
      fieldset: "frames",
      initialValue: "email",
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: "emailNote",
      title: "Email note",
      type: "string",
      fieldset: "frames",
    }),
    defineField({
      name: "instagramLabel",
      title: "Instagram label",
      type: "string",
      fieldset: "frames",
      initialValue: "instagram",
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: "instagramNote",
      title: "Instagram note",
      type: "string",
      fieldset: "frames",
    }),
    defineField({
      name: "locationLabel",
      title: "Location label",
      type: "string",
      fieldset: "frames",
      initialValue: "based in",
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: "locationNote",
      title: "Location note",
      type: "string",
      fieldset: "frames",
    }),
    defineField({
      name: "seo",
      title: "Search and sharing",
      type: "object",
      description: "What search engines and link previews show for this page.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "title",
          type: "string",
          description: "Overrides the built-in Contact page title.",
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: "description",
          type: "text",
          rows: 3,
          description: "The sentence under the title in search results.",
          validation: (rule) => rule.max(160),
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Contact" }) },
});
