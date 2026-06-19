import { describe, expect, it } from "vitest";

import { getStarFillStates, parseImdbRating } from "@/lib/movie/rating";

describe("movie rating", () => {
  it("parses valid imdb ratings", () => {
    expect(parseImdbRating("8.5")).toBe(8.5);
    expect(parseImdbRating("10")).toBe(10);
  });

  it("returns null for missing or invalid ratings", () => {
    expect(parseImdbRating("")).toBeNull();
    expect(parseImdbRating("N/A")).toBeNull();
    expect(parseImdbRating("invalid")).toBeNull();
  });

  it("maps a 10-point score to five star states", () => {
    expect(getStarFillStates(10)).toEqual([
      "full",
      "full",
      "full",
      "full",
      "full",
    ]);
    expect(getStarFillStates(9)).toEqual([
      "full",
      "full",
      "full",
      "full",
      "half",
    ]);
    expect(getStarFillStates(4)).toEqual([
      "full",
      "full",
      "empty",
      "empty",
      "empty",
    ]);
  });
});
