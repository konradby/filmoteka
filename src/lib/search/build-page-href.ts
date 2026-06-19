import { buildSearchUrl } from "@/lib/search/build-search-url";
import type { SearchSort } from "@/lib/search/sort";

interface BuildPageHrefParams {
  locale: string;
  page: number;
  query: string;
  year?: string;
  type?: string;
  sort?: SearchSort;
}

export const buildPageHref = ({
  locale,
  page,
  query,
  year,
  type,
  sort,
}: BuildPageHrefParams): string => {
  return buildSearchUrl(locale, { q: query, year, type, page, sort });
};
