"use client";

import { useRouter } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { buildSearchUrl } from "@/lib/search/build-search-url";
import { DEFAULT_SEARCH_SORT, type SearchSort } from "@/lib/search/sort";
import {
  interactiveInputClassName,
  interactiveSelectClassName,
} from "@/lib/ui/classes";

interface SearchFormProps {
  locale: Locale;
  dictionary: Dictionary;
  initialQuery?: string;
  initialYear?: string;
  initialType?: string;
  currentSort?: SearchSort;
  onQueryCleared?: () => void;
}

const DEBOUNCE_MS = 500;

export function SearchForm({
  locale,
  dictionary,
  initialQuery = "",
  initialYear = "",
  initialType = "",
  currentSort = DEFAULT_SEARCH_SORT,
  onQueryCleared,
}: SearchFormProps) {
  const router = useRouter();
  const statusId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [year, setYear] = useState(initialYear);
  const [type, setType] = useState(initialType);
  const [isPending, setIsPending] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipDebounceRef = useRef(true);

  useEffect(() => {
    setQuery(initialQuery);
    setYear(initialYear);
    setType(initialType);
    setIsPending(false);
  }, [initialQuery, initialYear, initialType]);

  const navigate = useCallback(
    (nextQuery: string, nextYear: string, nextType: string) => {
      if (!nextQuery.trim()) {
        onQueryCleared?.();
        setIsPending(false);
        return;
      }

      const url = buildSearchUrl(locale, {
        q: nextQuery,
        year: nextYear,
        type: nextType,
        sort: currentSort,
        page: 1,
      });

      const currentUrl = buildSearchUrl(locale, {
        q: initialQuery,
        year: initialYear,
        type: initialType,
        sort: currentSort,
        page: 1,
      });

      if (url === currentUrl) {
        setIsPending(false);
        return;
      }

      setIsPending(true);
      router.push(url);
    },
    [locale, router, initialQuery, initialYear, initialType, currentSort, onQueryCleared],
  );

  const scheduleSearch = useCallback(
    (nextQuery: string, nextYear: string, nextType: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        navigate(nextQuery, nextYear, nextType);
      }, DEBOUNCE_MS);
    },
    [navigate],
  );

  useEffect(() => {
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }

    scheduleSearch(query, year, type);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, year, type, scheduleSearch]);

  function searchImmediately(
    nextQuery: string,
    nextYear: string,
    nextType: string,
  ) {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    navigate(nextQuery, nextYear, nextType);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    searchImmediately(query, year, type);
  }

  return (
    <form
      role="search"
      aria-label={dictionary.a11y.searchForm}
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-6"
    >
      <div className="relative min-w-0 flex-1">
        <label htmlFor="search-query" className="mb-1.5 block text-sm font-medium text-foreground">
          {dictionary.search.placeholder}
        </label>
        <input
          id="search-query"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={dictionary.search.placeholder}
          className={interactiveInputClassName + " w-full rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-base text-foreground placeholder:text-muted"}
          autoComplete="off"
          aria-busy={isPending}
          aria-describedby={statusId}
        />
        {isPending && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-[2.65rem] h-4 w-4 animate-spin rounded-full border-2 border-border border-t-accent"
          />
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="search-year"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {dictionary.filters.year}
          </label>
          <input
            id="search-year"
            name="year"
            type="number"
            min="1888"
            max="2099"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            placeholder={dictionary.filters.yearPlaceholder}
            className={interactiveInputClassName + " w-full rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-base text-foreground placeholder:text-muted"}
          />
        </div>
        <div>
          <label
            htmlFor="search-type"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {dictionary.filters.type}
          </label>
          <select
            id="search-type"
            name="type"
            value={type}
            onChange={(event) => setType(event.target.value)}
            className={interactiveSelectClassName + " w-full rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-base text-foreground"}
          >
            <option value="">{dictionary.filters.typeAll}</option>
            <option value="movie">{dictionary.filters.typeMovie}</option>
            <option value="series">{dictionary.filters.typeSeries}</option>
            <option value="episode">{dictionary.filters.typeEpisode}</option>
          </select>
        </div>
      </div>

      <p
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isPending ? dictionary.search.loading : dictionary.a11y.searchStatus}
      </p>
    </form>
  );
}
