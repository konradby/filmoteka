"use client";

import Image from "next/image";
import Link from "next/link";

import { FavoriteButton } from "@/components/movie/FavoriteButton";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { isValidPosterUrl } from "@/lib/omdb/constants";
import { toFavoriteMovie, type OmdbSearchItem } from "@/lib/omdb/types";

interface MovieCardProps {
  movie: OmdbSearchItem;
  locale: Locale;
  dictionary: Dictionary;
}

export function MovieCard({ movie, locale, dictionary }: MovieCardProps) {
  const hasPoster = isValidPosterUrl(movie.Poster);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link
        href={`/${locale}/movie/${movie.imdbID}`}
        className="relative aspect-[2/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800"
      >
        {hasPoster ? (
          <Image
            src={movie.Poster}
            alt={movie.Title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-zinc-500">
            {dictionary.movie.noPoster}
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h2 className="text-base font-semibold leading-snug">
            <Link
              href={`/${locale}/movie/${movie.imdbID}`}
              className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
            >
              {movie.Title}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
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
