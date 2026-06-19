import { describe, expect, it } from "vitest";

import {
  isDetailsSuccess,
  isOmdbError,
  isSearchSuccess,
  type OmdbErrorResponse,
  type OmdbSearchSuccessResponse,
} from "@/lib/omdb/types";

describe("omdb type guards", () => {
  it("detects API error responses", () => {
    const error: OmdbErrorResponse = {
      Response: "False",
      Error: "Movie not found!",
    };

    expect(isOmdbError(error)).toBe(true);
    expect(isSearchSuccess(error as unknown as OmdbSearchSuccessResponse)).toBe(
      false,
    );
  });

  it("detects successful search responses", () => {
    const success: OmdbSearchSuccessResponse = {
      Response: "True",
      Search: [
        {
          Title: "Batman Begins",
          Year: "2005",
          imdbID: "tt0372784",
          Type: "movie",
          Poster: "https://example.com/poster.jpg",
        },
      ],
      totalResults: "1",
    };

    expect(isSearchSuccess(success)).toBe(true);
    expect(isOmdbError(success)).toBe(false);
  });

  it("detects successful details responses", () => {
    expect(
      isDetailsSuccess({
        Response: "True",
        imdbID: "tt0372784",
        Title: "Batman Begins",
        Year: "2005",
      } as never),
    ).toBe(true);
  });
});
