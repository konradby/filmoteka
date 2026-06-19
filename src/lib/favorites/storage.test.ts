import { beforeEach, describe, expect, it } from "vitest";

import {
  FAVORITES_STORAGE_KEY,
  addFavorite,
  getFavorites,
  isFavorite,
  removeFavorite,
  toggleFavorite,
} from "@/lib/favorites/storage";

const sampleMovie = {
  imdbID: "tt0372784",
  Title: "Batman Begins",
  Year: "2005",
  Poster: "N/A",
  Type: "movie",
};

describe("favorites storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty list by default", () => {
    expect(getFavorites()).toEqual([]);
  });

  it("adds and reads favorites", () => {
    const favorites = addFavorite(sampleMovie);

    expect(favorites).toHaveLength(1);
    expect(favorites[0]?.Poster).toBe("");
    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toContain("Batman Begins");
  });

  it("does not add duplicates", () => {
    addFavorite(sampleMovie);
    const favorites = addFavorite(sampleMovie);

    expect(favorites).toHaveLength(1);
  });

  it("removes favorites by imdb id", () => {
    addFavorite(sampleMovie);
    const favorites = removeFavorite(sampleMovie.imdbID);

    expect(favorites).toEqual([]);
    expect(isFavorite(sampleMovie.imdbID)).toBe(false);
  });

  it("toggles favorite state", () => {
    const added = toggleFavorite(sampleMovie);
    expect(added.isFavorite).toBe(true);

    const removed = toggleFavorite(sampleMovie);
    expect(removed.isFavorite).toBe(false);
    expect(removed.favorites).toEqual([]);
  });
});
