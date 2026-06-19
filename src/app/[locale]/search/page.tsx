import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchView } from "@/components/search/SearchView";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchResultsSkeleton } from "@/components/search/SearchResultsSkeleton";
import type { Locale } from "@/i18n/config";
import { formatMessage, getDictionary } from "@/i18n/get-dictionary";
import { buildPageMetadata, getSearchUrl } from "@/lib/seo/site";
import { hasUserSearchQuery } from "@/lib/search/defaults";
import { parseSearchSort } from "@/lib/search/sort";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    year?: string;
    type?: string;
    page?: string;
    sort?: string;
  }>;
}

export const generateMetadata = async ({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> => {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);
  const resolvedSearchParams = await searchParams;
  const displayQuery = resolvedSearchParams.q?.trim() ?? "";
  const hasQuery = hasUserSearchQuery(resolvedSearchParams.q);

  return buildPageMetadata({
    locale,
    title: hasQuery
      ? formatMessage(dictionary.meta.searchTitle, { query: displayQuery })
      : `${dictionary.search.title} — Filmoteka`,
    description: hasQuery
      ? formatMessage(dictionary.search.resultsFor, { query: displayQuery })
      : dictionary.meta.defaultDescription,
    path: "/search",
    canonicalUrl: getSearchUrl(locale, {
      q: displayQuery,
      year: resolvedSearchParams.year,
      type: resolvedSearchParams.type,
      page: resolvedSearchParams.page,
      sort: resolvedSearchParams.sort,
    }),
  });
}

const getSearchKey = (searchParams: {
  q?: string;
  year?: string;
  type?: string;
  page?: string;
  sort?: string;
}) => {
  return [
    searchParams.q ?? "",
    searchParams.year ?? "",
    searchParams.type ?? "",
    searchParams.sort ?? "",
    searchParams.page ?? "1",
  ].join("|");
};

const SearchPage = async ({
  params,
  searchParams,
}: SearchPageProps) => {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);
  const resolvedSearchParams = await searchParams;

  const query = resolvedSearchParams.q?.trim() ?? "";
  const year = resolvedSearchParams.year?.trim() ?? "";
  const typeParam = resolvedSearchParams.type?.trim() ?? "";
  const sort = parseSearchSort(resolvedSearchParams.sort);

  return (
    <main
      id={`main-content-${locale}`}
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {dictionary.search.title}
        </h1>
        <p className="mt-2 text-muted">{dictionary.search.subtitle}</p>
      </div>

      <SearchView
        locale={locale}
        dictionary={dictionary}
        initialQuery={query}
        initialYear={year}
        initialType={typeParam}
        currentSort={sort}
        results={
          <Suspense
            key={getSearchKey(resolvedSearchParams)}
            fallback={<SearchResultsSkeleton dictionary={dictionary} />}
          >
            <SearchResults
              locale={locale}
              dictionary={dictionary}
              searchParams={resolvedSearchParams}
            />
          </Suspense>
        }
      />
    </main>
  );
};

export default SearchPage;
