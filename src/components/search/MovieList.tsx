import { MovieCard } from "@/components/search/MovieCard";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { OmdbSearchItem } from "@/lib/omdb/types";
import { movieGridClassName } from "@/lib/ui/classes";

interface MovieListProps {
  movies: OmdbSearchItem[];
  locale: Locale;
  dictionary: Dictionary;
}

export const MovieList = ({ movies, locale, dictionary }: MovieListProps) => {
  return (
    <ul
      aria-label={dictionary.a11y.searchResults}
      className={movieGridClassName}
    >
      {movies.map((movie) => (
        <li key={movie.imdbID} className="h-full">
          <MovieCard movie={movie} locale={locale} dictionary={dictionary} />
        </li>
      ))}
    </ul>
  );
}
