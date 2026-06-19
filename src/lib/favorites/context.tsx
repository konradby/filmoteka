"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { getFavorites, saveFavorites } from "@/lib/favorites/storage";
import type {
  FavoriteActionResult,
  FavoriteMovie,
} from "@/lib/favorites/types";

interface FavoritesContextValue {
  favorites: FavoriteMovie[];
  isHydrated: boolean;
  isFavorite: (imdbId: string) => boolean;
  add: (movie: FavoriteMovie) => FavoriteActionResult;
  remove: (imdbId: string) => FavoriteActionResult;
  toggle: (movie: FavoriteMovie) => FavoriteActionResult;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const listeners = new Set<() => void>();
const SERVER_SNAPSHOT: FavoriteMovie[] = [];
let favoritesCache: FavoriteMovie[] = [];

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  favoritesCache = getFavorites();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): FavoriteMovie[] {
  return favoritesCache;
}

function getServerSnapshot(): FavoriteMovie[] {
  return SERVER_SNAPSHOT;
}

function subscribeHydration() {
  return () => {};
}

function getHydratedSnapshot(): boolean {
  return true;
}

function getServerHydrationSnapshot(): boolean {
  return false;
}

function persistFavorites(next: FavoriteMovie[]): boolean {
  try {
    saveFavorites(next);
    favoritesCache = next;
    emitChange();
    return true;
  } catch {
    return false;
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favorites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isHydrated = useSyncExternalStore(
    subscribeHydration,
    getHydratedSnapshot,
    getServerHydrationSnapshot,
  );

  const isFavoriteFn = useCallback(
    (imdbId: string) => favorites.some((item) => item.imdbID === imdbId),
    [favorites],
  );

  const add = useCallback((movie: FavoriteMovie): FavoriteActionResult => {
    if (!movie.imdbID) {
      return { ok: false, action: "add" };
    }

    if (favoritesCache.some((item) => item.imdbID === movie.imdbID)) {
      return { ok: true, action: "add" };
    }

    const updated = [...favoritesCache, movie];
    return persistFavorites(updated)
      ? { ok: true, action: "add" }
      : { ok: false, action: "add" };
  }, []);

  const remove = useCallback((imdbId: string): FavoriteActionResult => {
    if (!imdbId) {
      return { ok: false, action: "remove" };
    }

    if (!favoritesCache.some((item) => item.imdbID === imdbId)) {
      return { ok: true, action: "remove" };
    }

    const updated = favoritesCache.filter((item) => item.imdbID !== imdbId);
    return persistFavorites(updated)
      ? { ok: true, action: "remove" }
      : { ok: false, action: "remove" };
  }, []);

  const toggle = useCallback((movie: FavoriteMovie): FavoriteActionResult => {
    const exists = favoritesCache.some((item) => item.imdbID === movie.imdbID);

    if (exists) {
      return remove(movie.imdbID);
    }

    return add(movie);
  }, [add, remove]);

  const value = useMemo(
    () => ({
      favorites,
      isHydrated,
      isFavorite: isFavoriteFn,
      add,
      remove,
      toggle,
    }),
    [favorites, isHydrated, isFavoriteFn, add, remove, toggle],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}

export function resetFavoritesStoreForTests() {
  favoritesCache = [];
  listeners.clear();
}
