import { describe, expect, it } from "vitest";

import { getDictionary } from "@/i18n/get-dictionary";
import { formatMediaType } from "@/lib/omdb/format-media-type";

describe("formatMediaType", () => {
  it("translates known media types", () => {
    const pl = getDictionary("pl");
    const en = getDictionary("en");

    expect(formatMediaType("series", pl)).toBe("Serial");
    expect(formatMediaType("movie", pl)).toBe("Film");
    expect(formatMediaType("episode", pl)).toBe("Odcinek");
    expect(formatMediaType("series", en)).toBe("Series");
  });
});
