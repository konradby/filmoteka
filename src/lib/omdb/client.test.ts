import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getMovieDetails, searchMovies } from "@/lib/omdb/client";
import {
  OmdbApiError,
  OmdbConfigError,
} from "@/lib/omdb/errors";

describe("omdb client", () => {
  beforeEach(() => {
    vi.stubEnv("OMDB_API_KEY", "test-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("throws when API key is missing", async () => {
    vi.unstubAllEnvs();

    await expect(searchMovies({ query: "batman" })).rejects.toBeInstanceOf(
      OmdbConfigError,
    );
  });

  it("parses successful search responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          Response: "True",
          Search: [
            {
              Title: "Batman Begins",
              Year: "2005",
              imdbID: "tt0372784",
              Type: "movie",
              Poster: "N/A",
            },
          ],
          totalResults: "15",
        }),
      }),
    );

    const result = await searchMovies({ query: "batman", page: 1 });

    expect(result.items).toHaveLength(1);
    expect(result.totalResults).toBe(15);
    expect(result.totalPages).toBe(2);
    expect(result.page).toBe(1);
    expect(result.items[0]?.Poster).toBe("");
  });

  it("maps not found search errors to empty results", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          Response: "False",
          Error: "Movie not found!",
        }),
      }),
    );

    const result = await searchMovies({ query: "zzzznotfound" });

    expect(result.items).toEqual([]);
    expect(result.totalResults).toBe(0);
  });

  it("maps generic API errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          Response: "False",
          Error: "Invalid API key",
        }),
      }),
    );

    await expect(searchMovies({ query: "batman" })).rejects.toBeInstanceOf(
      OmdbApiError,
    );
  });

  it("fetches movie details", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          Response: "True",
          imdbID: "tt0372784",
          Title: "Batman Begins",
          Year: "2005",
          Plot: "After training with his mentor, Batman begins his fight against crime.",
        }),
      }),
    );

    const movie = await getMovieDetails("tt0372784");

    expect(movie.Title).toBe("Batman Begins");
    expect(movie.imdbID).toBe("tt0372784");
    expect(movie.Plot).toBe(
      "After training with his mentor, Batman begins his fight against crime.",
    );
  });

  it("normalizes N/A movie detail fields", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          Response: "True",
          imdbID: "tt0372784",
          Title: "Batman Begins",
          Year: "2005",
          Plot: "N/A",
          Poster: "N/A",
          Director: "N/A",
        }),
      }),
    );

    const movie = await getMovieDetails("tt0372784");

    expect(movie.Plot).toBe("");
    expect(movie.Poster).toBe("");
    expect(movie.Director).toBe("");
  });
});
