import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

interface SearchFormProps {
  locale: Locale;
  dictionary: Dictionary;
  initialQuery?: string;
  initialYear?: string;
  initialType?: string;
}

export function SearchForm({
  locale,
  dictionary,
  initialQuery = "",
  initialYear = "",
  initialType = "",
}: SearchFormProps) {
  return (
    <form
      action={`/${locale}`}
      method="GET"
      className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="search-query" className="sr-only">
            {dictionary.search.placeholder}
          </label>
          <input
            id="search-query"
            name="q"
            type="search"
            defaultValue={initialQuery}
            placeholder={dictionary.search.placeholder}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:ring-zinc-100"
            autoComplete="off"
            required
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {dictionary.search.submit}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="search-year"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {dictionary.filters.year}
          </label>
          <input
            id="search-year"
            name="year"
            type="number"
            min="1888"
            max="2099"
            defaultValue={initialYear}
            placeholder={dictionary.filters.yearPlaceholder}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:ring-zinc-100"
          />
        </div>
        <div>
          <label
            htmlFor="search-type"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {dictionary.filters.type}
          </label>
          <select
            id="search-type"
            name="type"
            defaultValue={initialType}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:ring-zinc-100"
          >
            <option value="">{dictionary.filters.typeAll}</option>
            <option value="movie">{dictionary.filters.typeMovie}</option>
            <option value="series">{dictionary.filters.typeSeries}</option>
            <option value="episode">{dictionary.filters.typeEpisode}</option>
          </select>
        </div>
      </div>
    </form>
  );
}
