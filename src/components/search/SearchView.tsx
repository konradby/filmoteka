"use client";

import { ReactNode, useEffect, useState } from "react";

import { SearchForm } from "@/components/search/SearchForm";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { SearchSort } from "@/lib/search/sort";

interface SearchViewProps {
  locale: Locale;
  dictionary: Dictionary;
  initialQuery: string;
  initialYear: string;
  initialType: string;
  currentSort: SearchSort;
  results: ReactNode;
}

export function SearchView({
  locale,
  dictionary,
  initialQuery,
  initialYear,
  initialType,
  currentSort,
  results,
}: SearchViewProps) {
  const [queryCleared, setQueryCleared] = useState(false);

  useEffect(() => {
    setQueryCleared(false);
  }, [initialQuery, initialYear, initialType, currentSort]);

  return (
    <>
      <SearchForm
        locale={locale}
        dictionary={dictionary}
        initialQuery={initialQuery}
        initialYear={initialYear}
        initialType={initialType}
        currentSort={currentSort}
        onQueryCleared={() => setQueryCleared(true)}
      />

      {queryCleared ? (
        <section className="mt-10" aria-labelledby="search-results-heading">
          <h2 id="search-results-heading" className="sr-only">
            {dictionary.a11y.searchResults}
          </h2>
          <EmptyState message={dictionary.search.emptyPrompt} />
        </section>
      ) : (
        results
      )}
    </>
  );
}
