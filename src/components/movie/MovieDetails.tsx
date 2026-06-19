import Image from "next/image";
import Link from "next/link";

import { FavoriteButton } from "@/components/movie/FavoriteButton";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { isValidPosterUrl } from "@/lib/omdb/constants";
import { toFavoriteMovie, type OmdbMovieDetails } from "@/lib/omdb/types";

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
  if (!value || value === "N/A") return null;

  return (
    <div>
      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 text-base">{value}</dd>
    </div>
  );
}

export function MovieDetails({ movie, locale, dictionary }: MovieDetailsProps) {
  const hasPoster = isValidPosterUrl(movie.Poster);

  return (
    <article className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div className="mx-auto w-full max-w-[280px]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
          {hasPoster ? (
            <Image
              src={movie.Poster}
              alt={movie.Title}
              fill
              sizes="280px"
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-zinc-500">
              {dictionary.movie.noPoster}
            </div>
          )}
        </div>
        <FavoriteButton
          movie={toFavoriteMovie(movie)}
          dictionary={dictionary}
        />
      </div>

      <div>
        <Link
          href={`/${locale}`}
          className="mb-4 inline-block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          ← {dictionary.movie.backToSearch}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{movie.Title}</h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          {movie.Year} · {movie.Type}
        </p>

        {movie.Plot && movie.Plot !== "N/A" && (
          <p className="mt-6 leading-relaxed text-zinc-800 dark:text-zinc-200">
            {movie.Plot}
          </p>
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
          <section className="mt-8">
            <h2 className="text-lg font-semibold">{dictionary.movie.ratings}</h2>
            <ul className="mt-3 flex flex-wrap gap-3">
              {movie.Ratings.map((rating) => (
                <li
                  key={`${rating.Source}-${rating.Value}`}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700"
                >
                  <span className="font-medium">{rating.Source}:</span>{" "}
                  {rating.Value}
                </li>
              ))}
            </ul>
            {movie.imdbRating && movie.imdbRating !== "N/A" && (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                IMDb: {movie.imdbRating}/10 ({movie.imdbVotes} votes)
              </p>
            )}
          </section>
        )}
      </div>
    </article>
  );
}

export function buildMovieJsonLd(movie: OmdbMovieDetails) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.Title,
    datePublished: movie.Released !== "N/A" ? movie.Released : movie.Year,
    genre: movie.Genre !== "N/A" ? movie.Genre.split(", ") : undefined,
    director: movie.Director !== "N/A" ? movie.Director : undefined,
    actor: movie.Actors !== "N/A" ? movie.Actors.split(", ") : undefined,
    description: movie.Plot !== "N/A" ? movie.Plot : undefined,
    image: isValidPosterUrl(movie.Poster) ? movie.Poster : undefined,
    aggregateRating:
      movie.imdbRating && movie.imdbRating !== "N/A"
        ? {
            "@type": "AggregateRating",
            ratingValue: movie.imdbRating,
            bestRating: "10",
            ratingCount: movie.imdbVotes,
          }
        : undefined,
  };
}
