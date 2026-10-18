import { defineField, defineType } from "sanity";

const KINDS = [
  { title: "Team", value: "team" },
  { title: "Other", value: "other" },
];

/**
 * A label anything on the Work grid can carry: a team ("Senior Boys"), or
 * anything else ("Headshots", a player's name). Each one becomes a filter chip,
 * so it is a document with one spelling rather than a free-typed tag.
 */
export const label = defineType({
  name: "label",
  title: "Label",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: 'Shown on the filter chip, e.g. "Senior Boys" or "Headshots".',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "The label's part of the filter link, e.g. /work?label=senior-boys.",
      options: { source: "title", maxLength: 48 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      type: "string",
      description: "Teams are listed first in the filter.",
      options: { list: KINDS, layout: "radio", direction: "horizontal" },
      initialValue: "team",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Kind, then name",
      name: "kindTitle",
      by: [
        { field: "kind", direction: "desc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", kind: "kind" },
    prepare: ({ title, kind }) => ({ title, subtitle: kind === "team" ? "Team" : "Other" }),
  },
});
