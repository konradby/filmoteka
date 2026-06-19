import type { FavoriteMovie } from "@/lib/favorites/types";

export const FAVORITES_STORAGE_KEY = "imdb-movies-favorites";

export function getFavorites(): FavoriteMovie[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteMovie[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FavoriteMovie[]): void {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

export function addFavorite(movie: FavoriteMovie): FavoriteMovie[] {
  const favorites = getFavorites();
  if (favorites.some((item) => item.imdbID === movie.imdbID)) {
    return favorites;
  }
  const updated = [...favorites, movie];
  saveFavorites(updated);
  return updated;
}

export function removeFavorite(imdbId: string): FavoriteMovie[] {
  const updated = getFavorites().filter((item) => item.imdbID !== imdbId);
  saveFavorites(updated);
  return updated;
}

export function isFavorite(imdbId: string): boolean {
  return getFavorites().some((item) => item.imdbID === imdbId);
}

export function toggleFavorite(movie: FavoriteMovie): {
  favorites: FavoriteMovie[];
  isFavorite: boolean;
} {
  if (isFavorite(movie.imdbID)) {
    const favorites = removeFavorite(movie.imdbID);
    return { favorites, isFavorite: false };
  }
  const favorites = addFavorite(movie);
  return { favorites, isFavorite: true };
}
