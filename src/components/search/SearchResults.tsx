import { MovieList } from "@/components/search/MovieList";
import { Pagination } from "@/components/search/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { Locale } from "@/i18n/config";
import { formatMessage, type Dictionary } from "@/i18n/get-dictionary";
import { searchMovies } from "@/lib/omdb/client";
import { isOmdbMediaType } from "@/lib/omdb/constants";
import { getErrorMessage } from "@/lib/omdb/get-error-message";

interface SearchResultsProps {
  locale: Locale;
  dictionary: Dictionary;
  searchParams: {
    q?: string;
    year?: string;
    type?: string;
    page?: string;
  };
}

export async function SearchResults({
  locale,
  dictionary,
  searchParams,
}: SearchResultsProps) {
  const query = searchParams.q?.trim() ?? "";
  const year = searchParams.year?.trim() ?? "";
  const typeParam = searchParams.type?.trim() ?? "";
  const type = isOmdbMediaType(typeParam) ? typeParam : undefined;
  const page = Math.max(
    1,
    Number.parseInt(searchParams.page ?? "1", 10) || 1,
  );

  if (!query) {
    return (
      <section className="mt-10" aria-labelledby="search-results-heading">
        <h2 id="search-results-heading" className="sr-only">
          {dictionary.a11y.searchResults}
        </h2>
        <EmptyState message={dictionary.search.emptyPrompt} />
      </section>
    );
  }

  let searchResult = null;
  let searchError: string | null = null;

  try {
    searchResult = await searchMovies({
      query,
      page,
      year: year || undefined,
      type,
    });
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
          <div>
            <h2
              id="search-results-heading"
              className="text-xl font-semibold text-foreground"
            >
              {formatMessage(dictionary.search.resultsFor, { query })}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {formatMessage(dictionary.search.resultsCount, {
                count: searchResult.totalResults,
              })}
            </p>
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
            query={query}
            year={year || undefined}
            type={type}
          />
        </div>
      )}
    </section>
  );
}
