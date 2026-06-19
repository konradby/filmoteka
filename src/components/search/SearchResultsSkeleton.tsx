import type { Dictionary } from "@/i18n/get-dictionary";
import { MOVIE_GRID_SIZE, movieGridClassName } from "@/lib/ui/classes";

interface SearchResultsSkeletonProps {
  dictionary: Dictionary;
}

export function SearchResultsSkeleton({
  dictionary,
}: SearchResultsSkeletonProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="mt-10 space-y-8"
    >
      <div className="space-y-3">
        <div className="h-7 w-64 max-w-full animate-pulse rounded-lg bg-surface-elevated" />
        <div className="h-4 w-40 max-w-full animate-pulse rounded-lg bg-surface-elevated" />
      </div>
      <ul className={movieGridClassName}>
        {Array.from({ length: MOVIE_GRID_SIZE }).map((_, index) => (
          <li
            key={index}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <div className="aspect-[2/3] animate-pulse bg-surface-elevated" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-[75%] animate-pulse rounded bg-surface-elevated" />
              <div className="h-4 w-[35%] animate-pulse rounded bg-surface-elevated" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-surface-elevated" />
            </div>
          </li>
        ))}
      </ul>
      <span className="sr-only">{dictionary.a11y.loadingResults}</span>
    </section>
  );
}
