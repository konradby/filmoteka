"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import { formatMessage } from "@/i18n/get-dictionary";
import { useFavorites } from "@/lib/favorites/context";
import type { FavoriteMovie } from "@/lib/favorites/types";
import { interactiveButtonClassName } from "@/lib/ui/classes";

interface FavoriteButtonProps {
  movie: FavoriteMovie;
  dictionary: Dictionary;
  variant?: "compact" | "default";
}

const baseClassName = `${interactiveButtonClassName} inline-flex w-full items-center justify-center rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50`;

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
      className={variant === "compact" ? `${baseClassName} mt-auto` : `${baseClassName} mt-4`}
      data-active={active ? "true" : "false"}
    >
      {label}
    </button>
  );
}
