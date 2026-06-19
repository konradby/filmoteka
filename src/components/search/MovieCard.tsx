"use client";

import Link from "next/link";

import { FavoriteButton } from "@/components/movie/FavoriteButton";
import { MoviePoster } from "@/components/movie/MoviePoster";
import { StarRating } from "@/components/movie/StarRating";
import type { Locale } from "@/i18n/config";
import { formatMessage, type Dictionary } from "@/i18n/get-dictionary";
import { formatMediaType } from "@/lib/omdb/format-media-type";
import { parseImdbRating } from "@/lib/movie/rating";
import { toFavoriteMovie, type OmdbSearchItem } from "@/lib/omdb/types";
import { interactiveLinkClassName } from "@/lib/ui/classes";

interface MovieCardProps {
  movie: OmdbSearchItem;
  locale: Locale;
  dictionary: Dictionary;
}

export function MovieCard({ movie, locale, dictionary }: MovieCardProps) {
  const rating = parseImdbRating(movie.imdbRating);
  const detailsLabel = formatMessage(dictionary.a11y.openMovieDetails, {
    title: movie.Title,
  });

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:border-accent/40 hover:shadow-[0_0_0_1px_rgba(245,197,24,0.15)]">
      <Link
        href={`/${locale}/movie/${movie.imdbID}`}
        aria-label={detailsLabel}
        className={`${interactiveLinkClassName} relative block aspect-[2/3] w-full overflow-hidden bg-surface-elevated`}
      >
        <MoviePoster
          src={movie.Poster}
          alt={detailsLabel}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          placeholderLabel={dictionary.movie.noPoster}
          decorative
          imageClassName="object-cover transition-transform duration-300 hover:scale-[1.02]"
        />
        {rating !== null && (
          <div className="absolute bottom-2 left-2 rounded-md border border-border/60 bg-background/90 px-2 py-1 backdrop-blur-sm">
            <StarRating
              imdbRating={movie.imdbRating ?? ""}
              dictionary={dictionary}
              showValue
            />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">
            <Link
              href={`/${locale}/movie/${movie.imdbID}`}
              className={`${interactiveLinkClassName} text-foreground transition-colors hover:text-accent`}
            >
              {movie.Title}
            </Link>
          </h3>
          <p className="text-sm text-muted">
            {movie.Year} · {formatMediaType(movie.Type, dictionary)}
          </p>
        </div>
        <FavoriteButton
          movie={toFavoriteMovie(movie)}
          dictionary={dictionary}
          variant="compact"
        />
      </div>
    </article>
  );
}
