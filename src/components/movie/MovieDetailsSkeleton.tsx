import type { Dictionary } from "@/i18n/get-dictionary";

export const MovieDetailsSkeleton = ({
  dictionary,
}: {
  dictionary: Dictionary;
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-start"
    >
      <div className="mx-auto w-full max-w-[280px] space-y-4 lg:mx-0">
        <div className="aspect-[2/3] animate-pulse rounded-xl bg-surface-elevated" />
        <div className="h-11 animate-pulse rounded-lg bg-surface-elevated" />
      </div>
      <div className="min-w-0 space-y-6">
        <div className="h-4 w-32 animate-pulse rounded bg-surface-elevated" />
        <div className="h-10 w-[66%] max-w-md animate-pulse rounded-lg bg-surface-elevated" />
        <div className="h-5 w-40 animate-pulse rounded bg-surface-elevated" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-surface-elevated" />
          <div className="h-4 w-full animate-pulse rounded bg-surface-elevated" />
          <div className="h-4 w-[80%] animate-pulse rounded bg-surface-elevated" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-surface-elevated" />
              <div className="h-5 w-full animate-pulse rounded bg-surface-elevated" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">{dictionary.a11y.loadingMovie}</span>
    </div>
  );
}
