import { defineQuery } from "next-sanity";

import { SPORTS } from "./types";

/**
 * `hidden != true` rather than `!hidden`: GROQ's `!` yields null on a missing
 * field, and a filter keeps only true, so `!hidden` would drop every game
 * created outside the Studio — where `initialValue` never runs.
 */
const VISIBLE = `_type == "game" && hidden != true`;

/** Ties break on `_id` so display order always agrees with the codes below. */
const ORDER = `order(date desc, _id asc)`;

/** Every image the site renders comes back in this shape. See `toContentImage`. */
const IMAGE = `{
  "alt": coalesce(alt, ""),
  "hotspot": hotspot{x, y},
  "asset": asset->{
    url,
    "lqip": metadata.lqip,
    "width": metadata.dimensions.width,
    "height": metadata.dimensions.height
  }
}`;

/** Position in the site-wide date order, which is what the 01A codes count. */
const RANK = `count(*[${VISIBLE} && (date > ^.date || (date == ^.date && _id < ^._id))])`;

const SUMMARY = `_id, title, "slug": slug.current, sport, "rank": ${RANK}, cover${IMAGE}`;

const STORIES = `stories[]{
  _key,
  _type,
  caption,
  _type == "storyImage" => {"image": image${IMAGE}},
  _type == "storyVideo" => {
    "playbackId": video.asset->playbackId,
    "duration": video.asset->data.duration,
    "poster": poster${IMAGE}
  }
}`;

const FULL_GAME = `${SUMMARY}, date, statLine, blurb, ${STORIES}`;

/** Built from SPORTS so a new sport can never silently report a zero count. */
const SPORT_COUNTS = SPORTS.map(
  (sport) => `{
    "sport": "${sport}",
    "count": count(*[${VISIBLE} && sport == "${sport}"]),
    "cover": *[${VISIBLE} && sport == "${sport}"] | ${ORDER}[0].cover${IMAGE}
  }`,
).join(",\n  ");

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "settings"][0]{
    "email": coalesce(email, ""),
    "instagramHandle": coalesce(instagramHandle, ""),
    "instagramUrl": coalesce(instagramUrl, ""),
    "location": coalesce(location, ""),
    "contactIntro": coalesce(contactIntro, null),
    "emailNote": coalesce(emailNote, null),
    "instagramNote": coalesce(instagramNote, null),
    "locationNote": coalesce(locationNote, null)
  }
`);

export const HOME_QUERY = defineQuery(`{
  "featured": *[${VISIBLE} && featured == true] | ${ORDER}[0...10]{${SUMMARY}},
  "sports": [
  ${SPORT_COUNTS}
  ],
  "latest": coalesce(
    *[${VISIBLE} && _id == *[_type == "settings"][0].latestGame._ref][0]{${FULL_GAME}},
    *[${VISIBLE}] | ${ORDER}[0]{${FULL_GAME}}
  ),
  "about": *[_type == "about"][0]{
    headline,
    portrait${IMAGE},
    services[]{_key, title, description}
  }
}`);

export const WORK_QUERY = defineQuery(`
  *[${VISIBLE}] | ${ORDER}{
    ${SUMMARY},
    date,
    statLine,
    "hasVideo": count(stories[_type == "storyVideo"]) > 0
  }
`);

export const ABOUT_QUERY = defineQuery(`
  *[_type == "about"][0]{
    name,
    quote,
    "bio": bio[]{"text": pt::text(@)}.text,
    portrait${IMAGE},
    services[]{_key, title, description},
    photos[0...3]${IMAGE}
  }
`);

export const SLUGS_QUERY = defineQuery(`
  *[${VISIBLE}].slug.current
`);

/** The game, plus the next one in date order wrapping back to the newest. */
export const GAME_QUERY = defineQuery(`
  *[${VISIBLE} && slug.current == $slug][0]{
    ${FULL_GAME},
    "next": coalesce(
      *[${VISIBLE} && (date < ^.date || (date == ^.date && _id > ^._id))]
        | ${ORDER}[0]{${SUMMARY}},
      *[${VISIBLE} && _id != ^._id] | ${ORDER}[0]{${SUMMARY}}
    )
  }
`);
