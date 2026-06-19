import type { Dictionary } from "@/i18n/get-dictionary";

export function formatMediaType(type: string, dictionary: Dictionary): string {
  switch (type.toLowerCase()) {
    case "movie":
      return dictionary.filters.typeMovie;
    case "series":
      return dictionary.filters.typeSeries;
    case "episode":
      return dictionary.filters.typeEpisode;
    default:
      return type;
  }
}
