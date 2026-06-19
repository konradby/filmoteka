import { buildSearchUrl } from "@/lib/search/build-search-url";

interface BuildPageHrefParams {
  locale: string;
  page: number;
  query: string;
  year?: string;
  type?: string;
}

export function buildPageHref({
  locale,
  page,
  query,
  year,
  type,
}: BuildPageHrefParams): string {
  return buildSearchUrl(locale, { q: query, year, type, page });
}
