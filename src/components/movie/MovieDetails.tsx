import Link from "next/link";

import { FavoriteButton } from "@/components/movie/FavoriteButton";
import { MoviePoster } from "@/components/movie/MoviePoster";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { formatMediaType } from "@/lib/omdb/format-media-type";
import { isValidPosterUrl } from "@/lib/omdb/constants";
import { toFavoriteMovie, type OmdbMovieDetails } from "@/lib/omdb/types";
import { getSearchBasePath } from "@/lib/search/build-search-url";
import { interactiveLinkClassName } from "@/lib/ui/classes";

interface MovieDetailsProps {
  movie: OmdbMovieDetails;
  locale: Locale;
  dictionary: Dictionary;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  if (!value) return null;

  return (
    <div className="min-w-0">
      <dt className="text-sm font-medium text-accent">{label}</dt>
      <dd className="mt-1 break-words text-base text-foreground">{value}</dd>
    </div>
  );
}

export function MovieDetails({ movie, locale, dictionary }: MovieDetailsProps) {
  return (
    <article className="grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-start">
      <div className="mx-auto w-full max-w-[280px] lg:mx-0">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border bg-surface-elevated">
          <MoviePoster
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            sizes="280px"
            placeholderLabel={dictionary.movie.noPoster}
            priority
          />
        </div>
        <FavoriteButton
          movie={toFavoriteMovie(movie)}
          dictionary={dictionary}
        />
      </div>

      <div className="min-w-0">
        <Link
          href={getSearchBasePath(locale)}
          className={`${interactiveLinkClassName} mb-4 inline-flex items-center text-sm text-muted transition-colors hover:text-accent`}
        >
          ← {dictionary.movie.backToSearch}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-balance text-foreground">
          {movie.Title}
        </h1>
        <p className="mt-2 text-lg text-muted">
          {movie.Year} · {formatMediaType(movie.Type, dictionary)}
        </p>

        {movie.Plot && (
          <p className="mt-6 leading-relaxed text-foreground/90">{movie.Plot}</p>
        )}

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <DetailRow label={dictionary.movie.director} value={movie.Director} />
          <DetailRow label={dictionary.movie.writers} value={movie.Writer} />
          <DetailRow label={dictionary.movie.actors} value={movie.Actors} />
          <DetailRow label={dictionary.movie.genre} value={movie.Genre} />
          <DetailRow label={dictionary.movie.runtime} value={movie.Runtime} />
          <DetailRow label={dictionary.movie.released} value={movie.Released} />
          <DetailRow label={dictionary.movie.rated} value={movie.Rated} />
          <DetailRow label={dictionary.movie.language} value={movie.Language} />
          <DetailRow label={dictionary.movie.country} value={movie.Country} />
          <DetailRow label={dictionary.movie.awards} value={movie.Awards} />
          <DetailRow
            label={dictionary.movie.boxOffice}
            value={movie.BoxOffice}
          />
          <DetailRow
            label={dictionary.movie.production}
            value={movie.Production}
          />
        </dl>

        {movie.Ratings?.length > 0 && (
          <section className="mt-8" aria-labelledby="movie-ratings-heading">
            <h2 id="movie-ratings-heading" className="text-lg font-semibold text-accent">
              {dictionary.movie.ratings}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-3">
              {movie.Ratings.map((rating) => (
                <li
                  key={`${rating.Source}-${rating.Value}`}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  <span className="font-medium text-accent">{rating.Source}:</span>{" "}
                  <span className="text-foreground">{rating.Value}</span>
                </li>
              ))}
            </ul>
            {movie.imdbRating && (
              <p className="mt-3 text-sm text-muted">
                IMDb: {movie.imdbRating}/10 ({movie.imdbVotes} votes)
              </p>
            )}
          </section>
        )}
      </div>
    </article>
  );
}

export function buildMovieJsonLd(movie: OmdbMovieDetails, url?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.Title,
    url,
    datePublished: movie.Released || movie.Year || undefined,
    genre: movie.Genre ? movie.Genre.split(", ") : undefined,
    director: movie.Director || undefined,
    actor: movie.Actors ? movie.Actors.split(", ") : undefined,
    description: movie.Plot || undefined,
    image: isValidPosterUrl(movie.Poster) ? movie.Poster : undefined,
    aggregateRating: movie.imdbRating
        ? {
            "@type": "AggregateRating",
            ratingValue: movie.imdbRating,
            bestRating: "10",
            ratingCount: movie.imdbVotes,
          }
        : undefined,
  };
}
