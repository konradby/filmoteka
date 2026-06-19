"use client";

import { useRouter } from "next/navigation";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { buildSearchUrl } from "@/lib/search/build-search-url";
import type { SearchSort } from "@/lib/search/sort";
import { interactiveSelectClassName } from "@/lib/ui/classes";

interface SearchResultsSortProps {
  locale: Locale;
  dictionary: Dictionary;
  query: string;
  year?: string;
  type?: string;
  currentSort: SearchSort;
}

export const SearchResultsSort = ({
  locale,
  dictionary,
  query,
  year,
  type,
  currentSort,
}: SearchResultsSortProps) => {
  const router = useRouter();

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextSort = event.target.value as SearchSort;

    router.push(
      buildSearchUrl(locale, {
        q: query,
        year,
        type,
        sort: nextSort,
        page: 1,
      }),
    );
  }

  return (
    <div className="flex w-full flex-col gap-1.5 sm:w-auto sm:min-w-[14rem]">
      <label
        htmlFor="results-sort"
        className="text-sm font-medium text-foreground"
      >
        {dictionary.sort.label}
      </label>
      <select
        id="results-sort"
        name="sort"
        value={currentSort}
        onChange={handleSortChange}
        className={
          interactiveSelectClassName +
          " min-h-10 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground"
        }
      >
        <option value="relevance">{dictionary.sort.relevance}</option>
        <option value="rating">{dictionary.sort.rating}</option>
      </select>
    </div>
  );
}
