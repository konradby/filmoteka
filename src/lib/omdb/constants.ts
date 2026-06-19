export const OMDB_BASE_URL = "https://www.omdbapi.com/";
export const OMDB_API_PAGE_SIZE = 10;
export const RESULTS_PER_PAGE = 12;
export const RATING_SORT_FETCH_LIMIT = 60;
export const FETCH_TIMEOUT_MS = 10_000;
export const OMDB_CACHE_REVALIDATE_SECONDS = 30 * 60;
export const POSTER_PLACEHOLDER_SRC = "/poster-placeholder.svg";

export const OMDB_MEDIA_TYPES = ["movie", "series", "episode"] as const;
export type OmdbMediaType = (typeof OMDB_MEDIA_TYPES)[number];

export const isOmdbMediaType = (value: string): value is OmdbMediaType => {
  return OMDB_MEDIA_TYPES.includes(value as OmdbMediaType);
};

export const isValidPosterUrl = (poster: string): boolean => {
  return poster.length > 0 && poster.startsWith("http");
};
