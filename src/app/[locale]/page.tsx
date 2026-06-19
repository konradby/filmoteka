import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchForm } from "@/components/search/SearchForm";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchResultsSkeleton } from "@/components/search/SearchResultsSkeleton";
import type { Locale } from "@/i18n/config";
import { formatMessage, getDictionary } from "@/i18n/get-dictionary";
import { buildPageMetadata, getSearchUrl } from "@/lib/seo/site";

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
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.trim() ?? "";

  if (query) {
    return buildPageMetadata({
      locale,
      title: formatMessage(dictionary.meta.searchTitle, { query }),
      description: formatMessage(dictionary.search.resultsFor, { query }),
      canonicalUrl: getSearchUrl(locale, {
        q: query,
        year: resolvedSearchParams.year,
        type: resolvedSearchParams.type,
        page: resolvedSearchParams.page,
      }),
    });
  }

  return buildPageMetadata({
    locale,
    title: dictionary.meta.defaultTitle,
    description: dictionary.meta.defaultDescription,
  });
}

function getSearchKey(searchParams: {
  q?: string;
  year?: string;
  type?: string;
  page?: string;
}) {
  return [
    searchParams.q ?? "",
    searchParams.year ?? "",
    searchParams.type ?? "",
    searchParams.page ?? "1",
  ].join("|");
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);
  const resolvedSearchParams = await searchParams;

  const query = resolvedSearchParams.q?.trim() ?? "";
  const year = resolvedSearchParams.year?.trim() ?? "";
  const typeParam = resolvedSearchParams.type?.trim() ?? "";

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

      <SearchForm
        locale={locale}
        dictionary={dictionary}
        initialQuery={query}
        initialYear={year}
        initialType={typeParam}
      />

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
    </main>
  );
}
