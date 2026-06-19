import { describe, expect, it } from "vitest";

import type { OmdbSearchItem } from "@/lib/omdb/types";
import { sortMoviesByRating } from "@/lib/search/sort";

function createItem(title: string, rating: string): OmdbSearchItem {
  return {
    Title: title,
    Year: "2000",
    imdbID: `tt-${title}`,
    Type: "movie",
    Poster: "",
    imdbRating: rating,
  };
}

describe("sortMoviesByRating", () => {
  it("sorts movies by imdb rating descending", () => {
    const items = [
      createItem("Low", "6.1"),
      createItem("High", "9.2"),
      createItem("Mid", "7.5"),
      createItem("Unknown", ""),
    ];

    expect(sortMoviesByRating(items).map((item) => item.Title)).toEqual([
      "High",
      "Mid",
      "Low",
      "Unknown",
    ]);
  });
});
