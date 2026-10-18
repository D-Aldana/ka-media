import type { SchemaTypeDefinition } from "sanity";

import { about } from "./about";
import { contact } from "./contact";
import { game } from "./game";
import { label } from "./label";
import { photo } from "./photo";
import { settings } from "./settings";
import { storyImage } from "./storyImage";
import { storyVideo } from "./storyVideo";

export const schemaTypes: SchemaTypeDefinition[] = [
  game,
  photo,
  label,
  about,
  contact,
  settings,
  storyImage,
  storyVideo,
];
