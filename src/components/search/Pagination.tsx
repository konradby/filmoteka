import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { formatMessage, type Dictionary } from "@/i18n/get-dictionary";

interface PaginationProps {
  locale: Locale;
  dictionary: Dictionary;
  currentPage: number;
  totalPages: number;
  query: string;
  year?: string;
  type?: string;
}

function buildPageHref(
  locale: Locale,
  page: number,
  query: string,
  year?: string,
  type?: string,
): string {
  const params = new URLSearchParams();
  params.set("q", query);

  if (year) {
    params.set("year", year);
  }
  if (type) {
    params.set("type", type);
  }
  if (page > 1) {
    params.set("page", String(page));
  }

  return `/${locale}?${params.toString()}`;
}

export function Pagination({
  locale,
  dictionary,
  currentPage,
  totalPages,
  query,
  year,
  type,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <nav
      aria-label={dictionary.pagination.label}
      className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {formatMessage(dictionary.pagination.pageInfo, {
          current: currentPage,
          total: totalPages,
        })}
      </p>
      <div className="flex gap-2">
        {currentPage <= 1 ? (
          <span
            aria-disabled="true"
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-400 dark:border-zinc-700"
          >
            {dictionary.pagination.previous}
          </span>
        ) : (
          <Link
            href={buildPageHref(locale, previousPage, query, year, type)}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800"
            rel="prev"
          >
            {dictionary.pagination.previous}
          </Link>
        )}
        {currentPage >= totalPages ? (
          <span
            aria-disabled="true"
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-400 dark:border-zinc-700"
          >
            {dictionary.pagination.next}
          </span>
        ) : (
          <Link
            href={buildPageHref(locale, nextPage, query, year, type)}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800"
            rel="next"
          >
            {dictionary.pagination.next}
          </Link>
        )}
      </div>
    </nav>
  );
}

export { buildPageHref };
