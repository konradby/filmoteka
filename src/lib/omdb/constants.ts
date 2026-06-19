export const OMDB_BASE_URL = "https://www.omdbapi.com/";
export const RESULTS_PER_PAGE = 10;
export const FETCH_TIMEOUT_MS = 10_000;

export const OMDB_MEDIA_TYPES = ["movie", "series", "episode"] as const;
export type OmdbMediaType = (typeof OMDB_MEDIA_TYPES)[number];

export function isOmdbMediaType(value: string): value is OmdbMediaType {
  return OMDB_MEDIA_TYPES.includes(value as OmdbMediaType);
}

export function isValidPosterUrl(poster: string): boolean {
  return poster !== "N/A" && poster.startsWith("http");
}
