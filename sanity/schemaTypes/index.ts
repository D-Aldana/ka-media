import type { SchemaTypeDefinition } from "sanity";

import { about } from "./about";
import { contact } from "./contact";
import { game } from "./game";
import { settings } from "./settings";
import { storyImage } from "./storyImage";
import { storyVideo } from "./storyVideo";

export const schemaTypes: SchemaTypeDefinition[] = [
  game,
  about,
  contact,
  settings,
  storyImage,
  storyVideo,
];
