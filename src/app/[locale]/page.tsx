import type { Metadata } from "next";

import { MovieList } from "@/components/search/MovieList";
import { Pagination } from "@/components/search/Pagination";
import { SearchForm } from "@/components/search/SearchForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { Locale } from "@/i18n/config";
import { formatMessage, getDictionary } from "@/i18n/get-dictionary";
import { searchMovies } from "@/lib/omdb/client";
import { isOmdbMediaType } from "@/lib/omdb/constants";
import { getErrorMessage } from "@/lib/omdb/get-error-message";

export const dynamic = "force-dynamic";

interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    year?: string;
    type?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: HomePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);
  const { q } = await searchParams;

  if (q?.trim()) {
    return {
      title: formatMessage(dictionary.meta.searchTitle, { query: q.trim() }),
      description: dictionary.meta.defaultDescription,
    };
  }

  return {
    title: dictionary.meta.defaultTitle,
    description: dictionary.meta.defaultDescription,
  };
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);
  const resolvedSearchParams = await searchParams;

  const query = resolvedSearchParams.q?.trim() ?? "";
  const year = resolvedSearchParams.year?.trim() ?? "";
  const typeParam = resolvedSearchParams.type?.trim() ?? "";
  const type = isOmdbMediaType(typeParam) ? typeParam : undefined;
  const page = Math.max(
    1,
    Number.parseInt(resolvedSearchParams.page ?? "1", 10) || 1,
  );

  let searchResult = null;
  let searchError: string | null = null;

  if (query) {
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
  }

  return (
    <main
      id={`main-content-${locale}`}
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {dictionary.search.title}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {dictionary.search.subtitle}
        </p>
      </div>

      <SearchForm
        locale={locale}
        dictionary={dictionary}
        initialQuery={query}
        initialYear={year}
        initialType={typeParam}
      />

      <section className="mt-10">
        {!query && <EmptyState message={dictionary.search.emptyPrompt} />}

        {searchError && (
          <div className="mt-6">
            <ErrorMessage message={searchError} />
          </div>
        )}

        {searchResult && searchResult.items.length === 0 && !searchError && (
          <div className="mt-6">
            <EmptyState message={dictionary.search.noResults} />
          </div>
        )}

        {searchResult && searchResult.items.length > 0 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold">
                {formatMessage(dictionary.search.resultsFor, { query })}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
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
    </main>
  );
}
