import type { StructureResolver } from "sanity/structure";

/** About and Settings are one document each, pinned above the game list. */
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
      S.divider(),
      S.documentTypeListItem("game").title("Games"),
    ]);
