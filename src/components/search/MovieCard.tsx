"use client";

import Image from "next/image";
import Link from "next/link";

import { FavoriteButton } from "@/components/movie/FavoriteButton";
import type { Locale } from "@/i18n/config";
import { formatMessage, type Dictionary } from "@/i18n/get-dictionary";
import { isValidPosterUrl } from "@/lib/omdb/constants";
import { toFavoriteMovie, type OmdbSearchItem } from "@/lib/omdb/types";
import { interactiveLinkClassName } from "@/lib/ui/classes";

interface MovieCardProps {
  movie: OmdbSearchItem;
  locale: Locale;
  dictionary: Dictionary;
}

export function MovieCard({ movie, locale, dictionary }: MovieCardProps) {
  const hasPoster = isValidPosterUrl(movie.Poster);
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
        {hasPoster ? (
          <Image
            src={movie.Poster}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full min-h-[280px] items-center justify-center px-4 text-center text-sm text-muted">
            {dictionary.movie.noPoster}
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
          <p className="text-sm capitalize text-muted">
            {movie.Year} · {movie.Type}
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
