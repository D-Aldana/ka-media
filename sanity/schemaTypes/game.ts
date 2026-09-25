import { defineArrayMember, defineField, defineType } from "sanity";

const SPORTS = [
  { title: "Basketball", value: "basketball" },
  { title: "Soccer", value: "soccer" },
  { title: "Football", value: "football" },
];

export const game = defineType({
  name: "game",
  title: "Game",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: 'The matchup, e.g. "Senior Boys vs Lord Tweedsmuir".',
      validation: (rule) => rule.required(),
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
      name: "sport",
      type: "string",
      options: { list: SPORTS, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "statLine",
      title: "Stat line",
      type: "string",
      description: 'Typewriter caption, e.g. "52pts/10reb vs lord tweedsmuir".',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "blurb",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "cover",
      type: "image",
      options: { hotspot: true },
      description: "The 4:5 frame used on cards, tiles and the filmstrip.",
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
    defineField({
      name: "stories",
      type: "array",
      description: "Photos and reels, in the order they play.",
      of: [defineArrayMember({ type: "storyImage" }), defineArrayMember({ type: "storyVideo" })],
      validation: (rule) => rule.required().min(1).max(20),
    }),
    defineField({
      name: "featured",
      type: "boolean",
      description: "Show this game in the homepage filmstrip.",
      initialValue: false,
    }),
    defineField({
      name: "hidden",
      type: "boolean",
      description: "Take the game off the site without deleting it.",
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
    select: { title: "title", sport: "sport", date: "date", hidden: "hidden", media: "cover" },
    prepare: ({ title, sport, date, hidden, media }) => ({
      title: hidden ? `${title} (hidden)` : title,
      subtitle: [sport, date].filter(Boolean).join(" · "),
      media,
    }),
  },
});
