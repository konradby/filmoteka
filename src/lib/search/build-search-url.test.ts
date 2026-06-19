import { describe, expect, it } from "vitest";

import { buildSearchUrl } from "@/lib/search/build-search-url";

describe("buildSearchUrl", () => {
  it("builds a query-only search url", () => {
    expect(buildSearchUrl("pl", { q: "batman" })).toBe("/pl/search?q=batman");
  });

  it("includes filters, sort, and pagination", () => {
    expect(
      buildSearchUrl("en", {
        q: "batman",
        year: "2008",
        type: "movie",
        sort: "rating",
        page: 2,
      }),
    ).toBe("/en/search?q=batman&year=2008&type=movie&sort=rating&page=2");
  });

  it("returns search page path when query is empty", () => {
    expect(buildSearchUrl("pl", { q: "   " })).toBe("/pl/search");
  });
});
