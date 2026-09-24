import { defineQuery } from "next-sanity";

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

/**
 * Position in the site-wide date-desc order, which is what the 01A codes
 * count. Ties break on `_id` so a code never depends on query order.
 */
const RANK = `count(*[_type == "game" && !hidden && (date > ^.date || (date == ^.date && _id < ^._id))])`;

const SUMMARY = `_id, title, "slug": slug.current, sport, "rank": ${RANK}, cover${IMAGE}`;

const STORIES = `stories[]{
  _key,
  _type,
  caption,
  _type == "storyImage" => {
    "image": {
      "alt": coalesce(alt, ""),
      "hotspot": image.hotspot{x, y},
      "asset": image.asset->{
        url,
        "lqip": metadata.lqip,
        "width": metadata.dimensions.width,
        "height": metadata.dimensions.height
      }
    }
  },
  _type == "storyVideo" => {
    "playbackId": video.asset->playbackId,
    "duration": video.asset->data.duration,
    "poster": {
      "alt": coalesce(posterAlt, ""),
      "hotspot": poster.hotspot{x, y},
      "asset": poster.asset->{
        url,
        "lqip": metadata.lqip,
        "width": metadata.dimensions.width,
        "height": metadata.dimensions.height
      }
    }
  }
}`;

const FULL_GAME = `${SUMMARY}, date, statLine, blurb, ${STORIES}`;

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "settings"][0]{email, instagramHandle, instagramUrl, location}
`);

export const HOME_QUERY = defineQuery(`{
  "featured": *[_type == "game" && featured == true && !hidden]
    | order(date desc)[0...10]{${SUMMARY}},
  "sports": [
    {"sport": "basketball",
     "count": count(*[_type == "game" && sport == "basketball" && !hidden]),
     "cover": *[_type == "game" && sport == "basketball" && !hidden]
       | order(date desc)[0].cover${IMAGE}},
    {"sport": "soccer",
     "count": count(*[_type == "game" && sport == "soccer" && !hidden]),
     "cover": *[_type == "game" && sport == "soccer" && !hidden]
       | order(date desc)[0].cover${IMAGE}},
    {"sport": "football",
     "count": count(*[_type == "game" && sport == "football" && !hidden]),
     "cover": *[_type == "game" && sport == "football" && !hidden]
       | order(date desc)[0].cover${IMAGE}}
  ],
  "latest": coalesce(
    *[_type == "settings"][0].latestGame->{${FULL_GAME}},
    *[_type == "game" && !hidden] | order(date desc)[0]{${FULL_GAME}}
  ),
  "about": *[_type == "about"][0]{
    headline,
    portrait${IMAGE},
    services[]{_key, title, description}
  }
}`);

export const WORK_QUERY = defineQuery(`
  *[_type == "game" && !hidden] | order(date desc){
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
    "bio": bio[].children[].text,
    portrait${IMAGE},
    services[]{_key, title, description},
    photos[0...3]${IMAGE}
  }
`);

export const SLUGS_QUERY = defineQuery(`
  *[_type == "game" && !hidden].slug.current
`);

/** The game, plus the next one in date order wrapping back to the newest. */
export const GAME_QUERY = defineQuery(`
  *[_type == "game" && !hidden && slug.current == $slug][0]{
    ${FULL_GAME},
    "next": coalesce(
      *[_type == "game" && !hidden &&
        (date < ^.date || (date == ^.date && _id > ^._id))]
        | order(date desc, _id asc)[0]{${SUMMARY}},
      *[_type == "game" && !hidden && _id != ^._id]
        | order(date desc, _id asc)[0]{${SUMMARY}}
    )
  }
`);
