import { PaginationLink } from "@/components/search/PaginationLink";
import type { Locale } from "@/i18n/config";
import { formatMessage, type Dictionary } from "@/i18n/get-dictionary";
import { buildPageHref } from "@/lib/search/build-page-href";
import type { SearchSort } from "@/lib/search/sort";

interface PaginationProps {
  locale: Locale;
  dictionary: Dictionary;
  currentPage: number;
  totalPages: number;
  query: string;
  year?: string;
  type?: string;
  sort?: SearchSort;
}

export const Pagination = ({
  locale,
  dictionary,
  currentPage,
  totalPages,
  query,
  year,
  type,
  sort,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);
  const disabledClassName =
    "inline-flex min-h-10 min-w-[7.5rem] items-center justify-center rounded-lg border border-border px-4 py-2 text-sm text-muted/50";

  return (
    <nav
      aria-label={dictionary.pagination.label}
      className="flex flex-col items-center gap-4 border-t border-border pt-6 sm:flex-row sm:justify-between"
    >
      <p className="text-sm text-muted" aria-live="polite">
        {formatMessage(dictionary.pagination.pageInfo, {
          current: currentPage,
          total: totalPages,
        })}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {currentPage <= 1 ? (
          <span aria-disabled="true" className={disabledClassName}>
            {dictionary.pagination.previous}
          </span>
        ) : (
          <PaginationLink
            href={buildPageHref({
              locale,
              page: previousPage,
              query,
              year,
              type,
              sort,
            })}
            dictionary={dictionary}
            rel="prev"
          >
            {dictionary.pagination.previous}
          </PaginationLink>
        )}
        {currentPage >= totalPages ? (
          <span aria-disabled="true" className={disabledClassName}>
            {dictionary.pagination.next}
          </span>
        ) : (
          <PaginationLink
            href={buildPageHref({
              locale,
              page: nextPage,
              query,
              year,
              type,
              sort,
            })}
            dictionary={dictionary}
            rel="next"
          >
            {dictionary.pagination.next}
          </PaginationLink>
        )}
      </div>
    </nav>
  );
}

export { buildPageHref };
