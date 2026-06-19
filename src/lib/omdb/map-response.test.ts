import { describe, expect, it } from "vitest";

import {
  mapMovieDetails,
  mapSearchItem,
  normalizeOmdbField,
  normalizeOmdbPoster,
} from "@/lib/omdb/map-response";

describe("omdb map-response", () => {
  it("normalizes missing and N/A values to empty strings", () => {
    expect(normalizeOmdbField(undefined)).toBe("");
    expect(normalizeOmdbField(null)).toBe("");
    expect(normalizeOmdbField("")).toBe("");
    expect(normalizeOmdbField("   ")).toBe("");
    expect(normalizeOmdbField("N/A")).toBe("");
    expect(normalizeOmdbField("n/a")).toBe("");
    expect(normalizeOmdbField("Batman")).toBe("Batman");
  });

  it("normalizes invalid posters to empty strings", () => {
    expect(normalizeOmdbPoster("N/A")).toBe("");
    expect(normalizeOmdbPoster("not-a-url")).toBe("");
    expect(normalizeOmdbPoster("https://example.com/poster.jpg")).toBe(
      "https://example.com/poster.jpg",
    );
  });

  it("maps search items with defaults", () => {
    expect(
      mapSearchItem({
        Title: "Batman Begins",
        Year: "N/A",
        imdbID: "tt0372784",
        Type: "movie",
        Poster: "N/A",
      }),
    ).toEqual({
      Title: "Batman Begins",
      Year: "",
      imdbID: "tt0372784",
      Type: "movie",
      Poster: "",
    });
  });

  it("maps movie details and ratings", () => {
    expect(
      mapMovieDetails({
        Response: "True",
        imdbID: "tt0372784",
        Title: "Batman Begins",
        Year: "2005",
        Plot: "N/A",
        Poster: "N/A",
        Ratings: [
          { Source: "Internet Movie Database", Value: "8.2/10" },
          { Source: "N/A", Value: "N/A" },
        ],
      }),
    ).toEqual(
      expect.objectContaining({
        Title: "Batman Begins",
        Plot: "",
        Poster: "",
        Ratings: [{ Source: "Internet Movie Database", Value: "8.2/10" }],
      }),
    );
  });
});
