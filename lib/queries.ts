import { defineQuery } from "next-sanity";

import { SPORTS } from "./types";

/**
 * `hidden != true` rather than `!hidden`: GROQ's `!` yields null on a missing
 * field, and a filter keeps only true, so `!hidden` would drop every game
 * created outside the Studio — where `initialValue` never runs.
 */
const VISIBLE = `_type == "game" && hidden != true`;

/** Singles, under the same `hidden != true` rule. */
const VISIBLE_SINGLE = `_type == "photo" && hidden != true`;

/** Ties break on `_id` so display order always agrees with the codes below. */
const ORDER = `order(date desc, _id asc)`;

/** Every image the site renders comes back in this shape. See `toContentImage`. */
const IMAGE = `{
  "alt": coalesce(alt, ""),
  "hotspot": hotspot{x, y},
  "crop": crop{top, bottom, left, right},
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
    "url": file.asset->url,
    "poster": poster${IMAGE}
  }
}`;

/** A label in full, for the pages that print and link it. */
const LABEL = `{"slug": slug.current, title, kind}`;

/** Unpublished or deleted labels drop out rather than arriving as nulls. */
const LABELS = `"labels": coalesce(labels[defined(@->slug.current)]->${LABEL}, [])`;

/** Just the slugs, which is all a Work card needs to be filtered. */
const LABEL_SLUGS = `"labels": coalesce(labels[]->slug.current, [])`;

const FULL_GAME = `${SUMMARY}, date, statLine, blurb, ${LABELS}, ${STORIES}`;

const SINGLE = `_id, title, "slug": slug.current, sport, date, caption, "image": image${IMAGE}`;

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
    "seo": {
      "title": coalesce(seo.title, null),
      "description": coalesce(seo.description, null),
      "shareImage": seo.shareImage${IMAGE}
    }
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
    name,
    headline,
    portrait${IMAGE},
    services[]{_key, title, description},
    "clients": coalesce(clients, [])
  }
}`);

/**
 * Games and singles come back separately and are merged by date in
 * `getWork`, so a single never shifts the games' 01A codes. Labels are only
 * the ones something visible carries, so no chip ever filters to nothing.
 */
export const WORK_QUERY = defineQuery(`{
  "games": *[${VISIBLE}] | ${ORDER}{
    ${SUMMARY},
    date,
    statLine,
    "hasVideo": count(stories[_type == "storyVideo"]) > 0,
    ${LABEL_SLUGS}
  },
  "singles": *[${VISIBLE_SINGLE}] | ${ORDER}{
    ${SINGLE},
    ${LABEL_SLUGS}
  },
  "labels": *[
    _type == "label" && defined(slug.current) &&
    count(*[((${VISIBLE}) || (${VISIBLE_SINGLE})) && references(^._id)]) > 0
  ] | order(kind desc, lower(title) asc)${LABEL}
}`);

export const ABOUT_QUERY = defineQuery(`
  *[_type == "about"][0]{
    name,
    quote,
    "bio": bio[]{"text": pt::text(@)}.text,
    portrait${IMAGE},
    services[]{_key, title, description},
    "clients": coalesce(clients, []),
    photos[0...3]${IMAGE}
  }
`);

/** Every field coalesced, so an unwritten one arrives as null, not missing. */
export const CONTACT_QUERY = defineQuery(`
  *[_type == "contact"][0]{
    "eyebrow": coalesce(eyebrow, null),
    "headline": coalesce(headline, null),
    "intro": coalesce(intro, null),
    "emailLabel": coalesce(emailLabel, null),
    "emailNote": coalesce(emailNote, null),
    "instagramLabel": coalesce(instagramLabel, null),
    "instagramNote": coalesce(instagramNote, null),
    "locationLabel": coalesce(locationLabel, null),
    "locationNote": coalesce(locationNote, null),
    "seo": {
      "title": coalesce(seo.title, null),
      "description": coalesce(seo.description, null)
    }
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

export const SINGLE_SLUGS_QUERY = defineQuery(`
  *[${VISIBLE_SINGLE}].slug.current
`);

export const SINGLE_QUERY = defineQuery(`
  *[${VISIBLE_SINGLE} && slug.current == $slug][0]{
    ${SINGLE},
    ${LABELS}
  }
`);
