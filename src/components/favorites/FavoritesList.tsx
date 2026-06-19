"use client";

import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { formatMessage, type Dictionary } from "@/i18n/get-dictionary";
import { useFavorites } from "@/lib/favorites/context";
import { isValidPosterUrl } from "@/lib/omdb/constants";
import {
  interactiveButtonClassName,
  interactiveLinkClassName,
} from "@/lib/ui/classes";

interface FavoritesListProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function FavoritesList({ locale, dictionary }: FavoritesListProps) {
  const { favorites, isHydrated, remove } = useFavorites();

  if (!isHydrated) {
    return (
      <div
        className="flex justify-center py-16"
        role="status"
        aria-live="polite"
        aria-label={dictionary.a11y.loadingResults}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-accent" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <p
        aria-live="polite"
        className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-muted"
      >
        {dictionary.favorites.empty}
      </p>
    );
  }

  return (
    <ul
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-label={dictionary.favorites.title}
    >
      {favorites.map((movie) => {
        const hasPoster = isValidPosterUrl(movie.Poster);
        const detailsLabel = formatMessage(dictionary.a11y.openMovieDetails, {
          title: movie.Title,
        });
        const removeLabel = formatMessage(dictionary.a11y.removeFavoriteFor, {
          title: movie.Title,
        });

        return (
          <li
            key={movie.imdbID}
            className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
          >
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
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center px-4 text-center text-sm text-muted">
                  {dictionary.movie.noPoster}
                </div>
              )}
            </Link>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="space-y-1">
                <h2 className="line-clamp-2 font-semibold leading-snug">
                  <Link
                    href={`/${locale}/movie/${movie.imdbID}`}
                    className={`${interactiveLinkClassName} text-foreground transition-colors hover:text-accent`}
                  >
                    {movie.Title}
                  </Link>
                </h2>
                <p className="text-sm text-muted">{movie.Year}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(movie.imdbID)}
                aria-label={removeLabel}
                className={`${interactiveButtonClassName} mt-auto inline-flex w-full items-center justify-center rounded-lg border border-red-900/60 bg-surface-elevated px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:border-red-500 hover:bg-red-950/40 focus-visible:ring-red-500`}
              >
                {dictionary.favorites.remove}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
