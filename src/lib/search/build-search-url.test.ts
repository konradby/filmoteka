import { describe, expect, it } from "vitest";

import { buildSearchUrl } from "@/lib/search/build-search-url";

describe("buildSearchUrl", () => {
  it("builds a query-only search url", () => {
    expect(buildSearchUrl("pl", { q: "batman" })).toBe("/pl?q=batman");
  });

  it("includes filters and pagination", () => {
    expect(
      buildSearchUrl("en", {
        q: "batman",
        year: "2008",
        type: "movie",
        page: 2,
      }),
    ).toBe("/en?q=batman&year=2008&type=movie&page=2");
  });

  it("returns locale path when query is empty", () => {
    expect(buildSearchUrl("pl", { q: "   " })).toBe("/pl");
  });
});
