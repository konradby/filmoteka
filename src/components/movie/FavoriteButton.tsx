"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import { formatMessage } from "@/i18n/get-dictionary";
import { useFavorites } from "@/lib/favorites/context";
import type { FavoriteMovie } from "@/lib/favorites/types";

interface FavoriteButtonProps {
  movie: FavoriteMovie;
  dictionary: Dictionary;
  variant?: "compact" | "default";
}

export function FavoriteButton({
  movie,
  dictionary,
  variant = "default",
}: FavoriteButtonProps) {
  const { isHydrated, isFavorite, toggle } = useFavorites();
  const active = isHydrated && isFavorite(movie.imdbID);

  const label = active
    ? dictionary.movie.removeFavorite
    : dictionary.movie.addFavorite;

  const ariaLabel = formatMessage(dictionary.a11y.favoriteToggle, {
    title: movie.Title,
  });

  return (
    <button
      type="button"
      onClick={() => toggle(movie)}
      aria-pressed={active}
      aria-label={ariaLabel}
      disabled={!isHydrated}
      className={
        variant === "compact"
          ? "mt-auto w-full rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:opacity-50 dark:focus-visible:ring-zinc-100"
          : "rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:opacity-50 dark:focus-visible:ring-zinc-100"
      }
      data-active={active ? "true" : "false"}
    >
      {label}
    </button>
  );
}
