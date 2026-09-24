import type { SchemaTypeDefinition } from "sanity";

import { about } from "./about";
import { game } from "./game";
import { settings } from "./settings";
import { storyImage } from "./storyImage";
import { storyVideo } from "./storyVideo";

export const schemaTypes: SchemaTypeDefinition[] = [
  game,
  about,
  settings,
  storyImage,
  storyVideo,
];
