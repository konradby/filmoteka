import { MovieCard } from "@/components/search/MovieCard";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { OmdbSearchItem } from "@/lib/omdb/types";

interface MovieListProps {
  movies: OmdbSearchItem[];
  locale: Locale;
  dictionary: Dictionary;
}

export function MovieList({ movies, locale, dictionary }: MovieListProps) {
  return (
    <ul
      aria-label={dictionary.a11y.searchResults}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {movies.map((movie) => (
        <li key={movie.imdbID}>
          <MovieCard movie={movie} locale={locale} dictionary={dictionary} />
        </li>
      ))}
    </ul>
  );
}
