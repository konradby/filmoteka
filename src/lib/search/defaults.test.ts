import { describe, expect, it } from "vitest";

import {
  getSearchFetchQuery,
  hasUserSearchQuery,
  INITIAL_BROWSE_QUERY,
} from "@/lib/search/defaults";

describe("search defaults", () => {
  it("uses an internal browse query when the user has not searched", () => {
    expect(INITIAL_BROWSE_QUERY).toBe("movie");
    expect(getSearchFetchQuery(undefined)).toBe("movie");
    expect(getSearchFetchQuery("   ")).toBe("movie");
    expect(getSearchFetchQuery("batman")).toBe("batman");
  });

  it("detects when the user entered a search phrase", () => {
    expect(hasUserSearchQuery(undefined)).toBe(false);
    expect(hasUserSearchQuery("")).toBe(false);
    expect(hasUserSearchQuery("   ")).toBe(false);
    expect(hasUserSearchQuery("batman")).toBe(true);
  });
});
