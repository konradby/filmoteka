import { isOmdbMediaType } from "@/lib/omdb/constants";

export interface SearchUrlParams {
  q: string;
  year?: string;
  type?: string;
  page?: number;
}

export function buildSearchUrl(
  locale: string,
  { q, year, type, page = 1 }: SearchUrlParams,
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
  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();
  return `/${locale}${queryString ? `?${queryString}` : ""}`;
}
