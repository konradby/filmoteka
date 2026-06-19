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
import type { FavoriteMovie } from "@/lib/favorites/types";

interface FavoritesContextValue {
  favorites: FavoriteMovie[];
  isHydrated: boolean;
  isFavorite: (imdbId: string) => boolean;
  add: (movie: FavoriteMovie) => void;
  remove: (imdbId: string) => void;
  toggle: (movie: FavoriteMovie) => boolean;
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

function persistFavorites(next: FavoriteMovie[]) {
  favoritesCache = next;
  saveFavorites(next);
  emitChange();
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

  const add = useCallback((movie: FavoriteMovie) => {
    if (favoritesCache.some((item) => item.imdbID === movie.imdbID)) {
      return;
    }
    persistFavorites([...favoritesCache, movie]);
  }, []);

  const remove = useCallback((imdbId: string) => {
    persistFavorites(favoritesCache.filter((item) => item.imdbID !== imdbId));
  }, []);

  const toggle = useCallback((movie: FavoriteMovie) => {
    const exists = favoritesCache.some((item) => item.imdbID === movie.imdbID);
    const updated = exists
      ? favoritesCache.filter((item) => item.imdbID !== movie.imdbID)
      : [...favoritesCache, movie];

    persistFavorites(updated);
    return !exists;
  }, []);

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
