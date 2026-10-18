import { defineField, defineType } from "sanity";

import { FRAMES } from "./frames";
import { labelsField } from "./labels";
import { SPORT_OPTIONS } from "./sports";

/**
 * A single photo on the Work grid, outside any game. It sorts by date among
 * the games and opens as a one-frame story at /work/photo/<slug>.
 */
export const photo = defineType({
  name: "photo",
  title: "Single",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: 'Shown under the card, e.g. "Senior night" or "Ethan Rivera".',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: (doc) => {
          const { title, date } = doc as { title?: string; date?: string };
          return [title, date].filter(Boolean).join(" ");
        },
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: { previews: FRAMES.single } },
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
    defineField({
      name: "sport",
      type: "string",
      description: "Other for anything that isn't game action — headshots, team photos.",
      options: { list: SPORT_OPTIONS, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    labelsField,
    defineField({
      name: "date",
      type: "date",
      description: "When it was shot. Places it among the games on the Work grid.",
      options: { dateFormat: "YYYY-MM-DD" },
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      type: "string",
      description: 'Typewriter line over the photo, e.g. "senior night · #23".',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "hidden",
      type: "boolean",
      description: "Take the photo off the site without deleting it.",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Date, newest first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", sport: "sport", date: "date", hidden: "hidden", media: "image" },
    prepare: ({ title, sport, date, hidden, media }) => ({
      title: hidden ? `${title} (hidden)` : title,
      subtitle: [sport, date].filter(Boolean).join(" · "),
      media,
    }),
  },
});
