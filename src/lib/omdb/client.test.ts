import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getMovieDetails, searchMovies } from "@/lib/omdb/client";
import {
  OmdbApiError,
  OmdbConfigError,
  OmdbTooManyResultsError,
} from "@/lib/omdb/errors";
import { getDictionary } from "@/i18n/get-dictionary";
import { getErrorMessage } from "@/lib/omdb/get-error-message";

function createSearchItem(index: number) {
  return {
    Title: `Movie ${index}`,
    Year: "2000",
    imdbID: `tt${String(index).padStart(7, "0")}`,
    Type: "movie",
    Poster: "N/A",
  };
}

function createSearchResponse(items: ReturnType<typeof createSearchItem>[], totalResults: number) {
  return {
    Response: "True",
    Search: items,
    totalResults: String(totalResults),
  };
}

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

  it("returns 12 mapped results for a full 4x3 grid page", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async (url: string) => {
        const omdbPage = new URL(url).searchParams.get("page");

        if (omdbPage === "1") {
          return {
            ok: true,
            json: async () =>
              createSearchResponse(
                Array.from({ length: 10 }, (_, index) => createSearchItem(index + 1)),
                25,
              ),
          };
        }

        if (omdbPage === "2") {
          return {
            ok: true,
            json: async () =>
              createSearchResponse(
                Array.from({ length: 10 }, (_, index) => createSearchItem(index + 11)),
                25,
              ),
          };
        }

        return {
          ok: true,
          json: async () => ({
            Response: "False",
            Error: "Movie not found!",
          }),
        };
      }),
    );

    const result = await searchMovies({ query: "batman", page: 1 });

    expect(result.items).toHaveLength(12);
    expect(result.items[0]?.Title).toBe("Movie 1");
    expect(result.items[11]?.Title).toBe("Movie 12");
    expect(result.items[0]?.Poster).toBe("");
    expect(result.totalResults).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.page).toBe(1);
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

  it("maps too many results errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          Response: "False",
          Error: "Too many results.",
        }),
      }),
    );

    await expect(searchMovies({ query: "a" })).rejects.toBeInstanceOf(
      OmdbTooManyResultsError,
    );

    const dictionary = getDictionary("pl");
    await expect(
      searchMovies({ query: "a" }).catch((error) =>
        getErrorMessage(error, dictionary),
      ),
    ).resolves.toBe("Zbyt wiele wyników. Doprecyzuj wyszukiwanie.");
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
