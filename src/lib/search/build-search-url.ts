import { isOmdbMediaType } from "@/lib/omdb/constants";
import {
  DEFAULT_SEARCH_SORT,
  isSearchSort,
  type SearchSort,
} from "@/lib/search/sort";

export interface SearchUrlParams {
  q: string;
  year?: string;
  type?: string;
  page?: number;
  sort?: SearchSort;
}

export function getSearchBasePath(locale: string): string {
  return `/${locale}/search`;
}

export function buildSearchUrl(
  locale: string,
  { q, year, type, page = 1, sort = DEFAULT_SEARCH_SORT }: SearchUrlParams,
): string {
  const params = new URLSearchParams();
  const trimmedQuery = q.trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }
  if (year?.trim()) {
    params.set("year", year.trim());
  }
  if (type && isOmdbMediaType(type)) {
    params.set("type", type);
  }
  if (sort !== DEFAULT_SEARCH_SORT) {
    params.set("sort", sort);
  }
  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();
  return `${getSearchBasePath(locale)}${queryString ? `?${queryString}` : ""}`;
}
