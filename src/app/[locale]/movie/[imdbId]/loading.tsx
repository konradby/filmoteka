import { MovieDetailsSkeleton } from "@/components/movie/MovieDetailsSkeleton";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

const MovieLoading = () => {
  const dictionary = getDictionary(defaultLocale);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <MovieDetailsSkeleton dictionary={dictionary} />
    </main>
  );
};

export default MovieLoading;
