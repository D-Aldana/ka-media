import { defineArrayMember, defineField } from "sanity";

/** The same labels field on games and singles. */
export const labelsField = defineField({
  name: "labels",
  type: "array",
  description:
    "Teams and anything else to filter by. Add new ones under Labels in the sidebar.",
  of: [defineArrayMember({ type: "reference", to: [{ type: "label" }] })],
  validation: (rule) => rule.unique().max(8),
});
