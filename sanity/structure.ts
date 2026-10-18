import type { StructureResolver } from "sanity/structure";

/** About, Contact and Settings are one document each, pinned above the games, singles and labels. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Settings")
        .id("settings")
        .child(S.document().schemaType("settings").documentId("settings")),
      S.listItem()
        .title("About")
        .id("about")
        .child(S.document().schemaType("about").documentId("about")),
      S.listItem()
        .title("Contact")
        .id("contact")
        .child(S.document().schemaType("contact").documentId("contact")),
      S.divider(),
      S.documentTypeListItem("game").title("Games"),
      S.documentTypeListItem("photo").title("Singles"),
      S.documentTypeListItem("label").title("Labels"),
    ]);
