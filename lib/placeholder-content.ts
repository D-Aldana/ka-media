/**
 * PLACEHOLDER CONTENT — not shipped.
 *
 * Stand-in for Sanity. Every value here is shaped exactly like the GROQ
 * projection that will replace it (see `lib/content.ts`), so the queries drop
 * in without touching components. Photos are the generated stand-ins from the
 * design canvas, served from `public/placeholder/`.
 */
import type {
  AboutSummary,
  ContentImage,
  GameSummary,
  LatestGame,
  Settings,
  SportSummary,
  StoryItem,
} from "./types";

type Frame = { n: string; alt: string; hotspot?: { x: number; y: number } };

const LQIP: Record<string, string> = {
  "01":
    "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAZABQDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAMBAgQF/8QAHxAAAgICAwEBAQAAAAAAAAAAAQIAEQMxBBIhQTLw/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgAD/8QAFxEBAQEBAAAAAAAAAAAAAAAAAAERAv/aAAwDAQACEQMRAD8A5HFwlVVm6lWsenRjmogdQxcar5/ezBx+XkB6d6VvCKGo/mucCIq2VJ/R2DMbzdbTqYTe6Xy/guEytkLMST6dwjwNKDEegy2TNkyCndmrVmUhGKbhKwkn/9k=",
  "02":
    "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAZABQDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAUBAgME/8QAJRAAAgICAQEJAQAAAAAAAAAAAQIAAxEhMUEEEhMiI1FhcbGB/8QAFwEAAwEAAAAAAAAAAAAAAAAAAAECA//EABYRAQEBAAAAAAAAAAAAAAAAAAABEv/aAAwDAQACEQMRAD8ATHs6hae6GbRZvDYLrGtHrO0I1l9WKDStg0S4yR7nejFNo9Q6HT8EjOJUqDu2tAwVuVGPIwKn6hFlRzUv9/YQ0GAIdsseeTLWKquyqwcA4DAEZ+ZismZJXFhUYB1CZHmEZv/Z",
  "03":
    "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAZABQDASIAAhEBAxEB/8QAGQAAAwADAAAAAAAAAAAAAAAAAAMEAQIF/8QAJBABAAEDAgcAAwAAAAAAAAAAAQIAAxEEIRITMTJBYXFCUbH/xAAWAQEBAQAAAAAAAAAAAAAAAAABAAL/xAAVEQEBAAAAAAAAAAAAAAAAAAAAEf/aAAwDAQACEQMRAD8A4duEyzGMkuRwIeT1WIcsXNs9cUtijTEE4rctwy5cL+8UvU6ZlYdSfi4wf31WlSNTNuX5SQPAHiitLjlFAyD9opB1iOB3U6ZOjVly8cuceWBMIy27cVDp+h9p93tl9ayUlu5CMeGURR64opU+6ihP/9k=",
  "04":
    "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAZABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAEDAgX/xAAiEAACAgIBAwUAAAAAAAAAAAABAgARAyExBDJREkFxkaH/xAAWAQEBAQAAAAAAAAAAAAAAAAABAwD/xAAXEQEBAQEAAAAAAAAAAAAAAAAAARIR/9oADAMBAAIRAxEAPwDkdOcRx5dqCNrYNtv8lHbEMQ0S/v4kExIOGM2UUjbGbcT1CTqMaA2RbGyPSNQkzgx3yfuENQ6iqsa7h4jFLwQLG9yS9omm4HxJJdBYg0SDCTfuMIl//9k=",
  "05":
    "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAZABQDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAMBAgQF/8QAIhAAAgEEAQQDAAAAAAAAAAAAAAECAwQREiETFCJCIzFh/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAMC/8QAGREBAQEBAQEAAAAAAAAAAAAAAQARAjFR/9oADAMBAAIRAxEAPwBELyh9dRF+8oPHyLk5StZP2iabq0WKejS8cPI2Bo9fJ8rujs1uuAOeraS9ogNgzoyG1Kqkmv3KM6JZKgdIJTsBQBaPL//Z",
  "06":
    "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAZABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAIDBAX/xAAdEAADAAMBAQEBAAAAAAAAAAAAAQIDITERYRKB/8QAFgEBAQEAAAAAAAAAAAAAAAAAAwEE/8QAGBEBAQEBAQAAAAAAAAAAAAAAABEBAiH/2gAMAwEAAhEDEQA/AODiw+lKwa4asGG/E3DS+6K1jdy/zOzNvXsac4uVx6w7A2XitU04pfwBKOKRT622x2350lA74GQjulpVSXxgJXQKj//Z",
  "07":
    "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAZABQDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAIDAQb/xAAgEAACAgIBBQEAAAAAAAAAAAABAgARAxIhEzFRYXFB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAVEQEBAAAAAAAAAAAAAAAAAAAAIf/aAAwDAQACEQMRAD8A8tjI0fYWW4+eDKJej1Q9a0CeamXVZAwU9+AfHyRjyPicOjEMIVuAWAOgN+FiTjYhe9X6iCMWINGuf33OA0YiEUzbMSBQiTED/9k=",
  "08":
    "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAZABQDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAMBAgUE/8QAIRABAAICAQMFAAAAAAAAAAAAAQACAxEhBBIxBUFRcZH/xAAXAQADAQAAAAAAAAAAAAAAAAAAAQQD/8QAFhEBAQEAAAAAAAAAAAAAAAAAABES/9oADAMBAAIRAxEAPwAxs7KdM2rtNcbmRXqq1sjvYh+zSx+o1xFK2ebPaSPKnReXDq6QirddXK99fDCOFpiiPL7o+fiWtfaKvDs5iqyZsiqS/aaFD7hKMIQ3/9k=",
};

const FRAMES: Frame[] = [
  { n: "01", alt: "Basketball dropping through the net under arena lights" },
  { n: "02", alt: "Empty soccer net at dusk with the ball on the line" },
  { n: "03", alt: "Player silhouetted against the rim as the crowd lights blur" },
  { n: "04", alt: "Football on the fifty yard line under the stadium lights" },
  { n: "05", alt: "Winger breaking down the touchline in a pink kit" },
  { n: "06", alt: "Jump shot released over a defender at the top of the key" },
  { n: "07", alt: "Receiver tracking the ball down the sideline" },
  { n: "08", alt: "Corner kick swinging in as the keeper sets" },
];

function frame(index: number, alt?: string): ContentImage {
  const f = FRAMES[index];
  return {
    url: `/placeholder/${f.n}.jpg`,
    alt: alt ?? f.alt,
    width: 600,
    height: 750,
    lqip: LQIP[f.n] ?? null,
    hotspot: f.hotspot ?? null,
  };
}

const sportOrder = [
  "basketball",
  "soccer",
  "basketball",
  "football",
  "soccer",
  "basketball",
  "football",
  "soccer",
] as const;

export const settings: Settings = {
  email: "hello@kamedia.ca",
  instagramUrl: "https://www.instagram.com/kamedia._/",
  instagramHandle: "@kamedia._",
  location: "Prince George, BC",
};

export const featured: GameSummary[] = sportOrder.map((sport, i) => ({
  _id: `featured-${i + 1}`,
  title: i === 0 ? "[Team] vs Lord Tweedsmuir" : "[Team] vs [Opponent]",
  slug: i === 0 ? "senior-boys-vs-lord-tweedsmuir-2026-01-14" : `game-${i + 1}`,
  sport,
  code: `${String(i + 1).padStart(2, "0")}A`,
  cover: frame(i),
}));

export const sports: SportSummary[] = [
  { sport: "basketball", count: 5, cover: frame(2) },
  { sport: "soccer", count: 4, cover: frame(1) },
  { sport: "football", count: 3, cover: frame(3) },
];

const latestStories: StoryItem[] = [0, 5, 2].map((i, k) => ({
  _key: `story-${k + 1}`,
  _type: "storyImage",
  image: frame(i),
  caption: null,
}));

export const latest: LatestGame = {
  _id: "latest",
  title: "[Team] vs Lord Tweedsmuir",
  slug: "senior-boys-vs-lord-tweedsmuir-2026-01-14",
  sport: "basketball",
  code: "01A",
  date: "2026-01-14",
  statLine: "52pts/10reb vs lord tweedsmuir",
  blurb:
    "[One line about the game — the moment, the rivalry, what was on the line.]",
  cover: frame(0),
  stories: latestStories,
};

export const about: AboutSummary = {
  headline:
    "kamedia is Krystien Aldana — a sports photographer and filmmaker in Prince George, BC, shooting the raw seconds after the whistle.",
  portrait: null,
  services: [
    { _key: "svc-1", title: "Game-day photography" },
    { _key: "svc-2", title: "Highlight & recruiting films" },
    { _key: "svc-3", title: "Social-ready edits" },
  ],
};
