import { SearchResultsSkeleton } from "@/components/search/SearchResultsSkeleton";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

const HomeLoading = () => {
  const dictionary = getDictionary(defaultLocale);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-8 space-y-3">
        <div className="h-9 w-72 max-w-full animate-pulse rounded-lg bg-surface-elevated" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded-lg bg-surface-elevated" />
      </div>
      <div className="mb-0 h-44 animate-pulse rounded-xl border border-border bg-surface" />
      <SearchResultsSkeleton dictionary={dictionary} />
    </main>
  );
};

export default HomeLoading;
