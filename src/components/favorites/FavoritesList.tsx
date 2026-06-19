"use client";

import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { useFavorites } from "@/lib/favorites/context";
import { isValidPosterUrl } from "@/lib/omdb/constants";

interface FavoritesListProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function FavoritesList({ locale, dictionary }: FavoritesListProps) {
  const { favorites, isHydrated, remove } = useFavorites();

  if (!isHydrated) {
    return (
      <p className="text-center text-zinc-600 dark:text-zinc-400">…</p>
    );
  }

  if (favorites.length === 0) {
    return (
      <p
        aria-live="polite"
        className="rounded-lg border border-dashed border-zinc-300 px-6 py-12 text-center text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
      >
        {dictionary.favorites.empty}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((movie) => {
        const hasPoster = isValidPosterUrl(movie.Poster);

        return (
          <li
            key={movie.imdbID}
            className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          >
            <Link
              href={`/${locale}/movie/${movie.imdbID}`}
              className="relative aspect-[2/3] bg-zinc-100 dark:bg-zinc-800"
            >
              {hasPoster ? (
                <Image
                  src={movie.Poster}
                  alt={movie.Title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-sm text-zinc-500">
                  {dictionary.movie.noPoster}
                </div>
              )}
            </Link>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <h2 className="font-semibold">
                  <Link href={`/${locale}/movie/${movie.imdbID}`}>
                    {movie.Title}
                  </Link>
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {movie.Year}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(movie.imdbID)}
                className="mt-auto rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
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
