import { describe, expect, it } from "vitest";

import {
  DEFAULT_SEARCH_QUERY,
  getEffectiveSearchQuery,
  shouldApplyDefaultSearchQuery,
} from "@/lib/search/defaults";

describe("search defaults", () => {
  it("uses titanic as the default query", () => {
    expect(DEFAULT_SEARCH_QUERY).toBe("titanic");
    expect(getEffectiveSearchQuery(undefined)).toBe("titanic");
    expect(getEffectiveSearchQuery("   ")).toBe("titanic");
    expect(getEffectiveSearchQuery("batman")).toBe("batman");
  });

  it("detects when default query should be applied", () => {
    expect(shouldApplyDefaultSearchQuery(undefined)).toBe(true);
    expect(shouldApplyDefaultSearchQuery("")).toBe(false);
    expect(shouldApplyDefaultSearchQuery("   ")).toBe(false);
    expect(shouldApplyDefaultSearchQuery("batman")).toBe(false);
  });
});
