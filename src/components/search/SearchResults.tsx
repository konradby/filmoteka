import { MovieList } from "@/components/search/MovieList";
import { Pagination } from "@/components/search/Pagination";
import { SearchResultsSort } from "@/components/search/SearchResultsSort";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { Locale } from "@/i18n/config";
import { formatMessage, type Dictionary } from "@/i18n/get-dictionary";
import { searchMovies, enrichSearchItemsWithRatings } from "@/lib/omdb/client";
import { isOmdbMediaType } from "@/lib/omdb/constants";
import { getErrorMessage } from "@/lib/omdb/get-error-message";
import {
  getSearchFetchQuery,
  hasUserSearchQuery,
} from "@/lib/search/defaults";
import { parseSearchSort } from "@/lib/search/sort";

interface SearchResultsProps {
  locale: Locale;
  dictionary: Dictionary;
  searchParams: {
    q?: string;
    year?: string;
    type?: string;
    page?: string;
    sort?: string;
  };
}

export const SearchResults = async ({
  locale,
  dictionary,
  searchParams,
}: SearchResultsProps) => {
  const displayQuery = searchParams.q?.trim() ?? "";
  const fetchQuery = getSearchFetchQuery(searchParams.q);
  const isUserSearch = hasUserSearchQuery(searchParams.q);
  const year = searchParams.year?.trim() ?? "";
  const typeParam = searchParams.type?.trim() ?? "";
  const type = isOmdbMediaType(typeParam) ? typeParam : undefined;
  const sort = parseSearchSort(searchParams.sort);
  const page = Math.max(
    1,
    Number.parseInt(searchParams.page ?? "1", 10) || 1,
  );

  let searchResult = null;
  let searchError: string | null = null;

  try {
    const result = await searchMovies({
      query: fetchQuery,
      page,
      year: year || undefined,
      type,
      sort,
    });

    searchResult = {
      ...result,
      items:
        sort === "rating"
          ? result.items
          : await enrichSearchItemsWithRatings(result.items),
    };
  } catch (error) {
    searchError = getErrorMessage(error, dictionary);
  }

  return (
    <section
      className="mt-10"
      aria-labelledby="search-results-heading"
      aria-busy={false}
    >
      {searchError && (
        <div className="mb-6">
          <ErrorMessage message={searchError} />
        </div>
      )}

      {searchResult && searchResult.items.length === 0 && !searchError && (
        <>
          <h2 id="search-results-heading" className="sr-only">
            {dictionary.a11y.searchResults}
          </h2>
          <EmptyState message={dictionary.search.noResults} />
        </>
      )}

      {searchResult && searchResult.items.length > 0 && (
        <div className="space-y-8">
          <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="search-results-heading"
                className="text-xl font-semibold text-foreground"
              >
                {isUserSearch
                  ? formatMessage(dictionary.search.resultsFor, {
                      query: displayQuery,
                    })
                  : dictionary.search.browseResults}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {formatMessage(dictionary.search.resultsCount, {
                  count: searchResult.totalResults,
                })}
              </p>
            </div>
            <SearchResultsSort
              locale={locale}
              dictionary={dictionary}
              query={displayQuery}
              year={year || undefined}
              type={type}
              currentSort={sort}
            />
          </div>
          <MovieList
            movies={searchResult.items}
            locale={locale}
            dictionary={dictionary}
          />
          <Pagination
            locale={locale}
            dictionary={dictionary}
            currentPage={searchResult.page}
            totalPages={searchResult.totalPages}
            query={displayQuery}
            year={year || undefined}
            type={type}
            sort={sort}
          />
        </div>
      )}
    </section>
  );
}
