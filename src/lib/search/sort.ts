import type { OmdbSearchItem } from "@/lib/omdb/types";
import { parseImdbRating } from "@/lib/movie/rating";

export const SEARCH_SORT_OPTIONS = ["relevance", "rating"] as const;
export type SearchSort = (typeof SEARCH_SORT_OPTIONS)[number];

export const DEFAULT_SEARCH_SORT: SearchSort = "relevance";

export const isSearchSort = (value: string): value is SearchSort => {
  return SEARCH_SORT_OPTIONS.includes(value as SearchSort);
};

export const parseSearchSort = (value: string | undefined): SearchSort => {
  if (value && isSearchSort(value)) {
    return value;
  }

  return DEFAULT_SEARCH_SORT;
}

export const sortMoviesByRating = (items: OmdbSearchItem[]): OmdbSearchItem[] => {
  return [...items].sort((first, second) => {
    const firstRating = parseImdbRating(first.imdbRating) ?? -1;
    const secondRating = parseImdbRating(second.imdbRating) ?? -1;

    if (secondRating !== firstRating) {
      return secondRating - firstRating;
    }

    return first.Title.localeCompare(second.Title, undefined, {
      sensitivity: "base",
    });
  });
}
