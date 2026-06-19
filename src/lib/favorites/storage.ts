import type { FavoriteMovie } from "@/lib/favorites/types";
import { normalizeOmdbField, normalizeOmdbPoster } from "@/lib/omdb/map-response";

export const FAVORITES_STORAGE_KEY = "imdb-movies-favorites";

function mapFavoriteMovie(raw: Partial<FavoriteMovie>): FavoriteMovie | null {
  const imdbID = normalizeOmdbField(raw.imdbID);

  if (!imdbID) {
    return null;
  }

  return {
    imdbID,
    Title: normalizeOmdbField(raw.Title),
    Year: normalizeOmdbField(raw.Year),
    Poster: normalizeOmdbPoster(raw.Poster),
    Type: normalizeOmdbField(raw.Type),
  };
}

export function getFavorites(): FavoriteMovie[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteMovie[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => mapFavoriteMovie(item))
      .filter((item): item is FavoriteMovie => item !== null);
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FavoriteMovie[]): void {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

export function addFavorite(movie: FavoriteMovie): FavoriteMovie[] {
  const favorites = getFavorites();
  const normalizedMovie = mapFavoriteMovie(movie);

  if (!normalizedMovie) {
    return favorites;
  }

  if (favorites.some((item) => item.imdbID === normalizedMovie.imdbID)) {
    return favorites;
  }
  const updated = [...favorites, normalizedMovie];
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
