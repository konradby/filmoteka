import type {
  OmdbMovieDetails,
  OmdbRating,
  OmdbSearchItem,
} from "@/lib/omdb/types";

const OMDB_MISSING = "N/A";

export function normalizeOmdbField(value: unknown): string {
  if (value == null) {
    return "";
  }

  const normalized = String(value).trim();

  if (!normalized || normalized.toUpperCase() === OMDB_MISSING) {
    return "";
  }

  return normalized;
}

export function normalizeOmdbPoster(value: unknown): string {
  const poster = normalizeOmdbField(value);

  if (!poster.startsWith("http")) {
    return "";
  }

  return poster;
}

function normalizeRatings(value: unknown): OmdbRating[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((rating) => ({
      Source: normalizeOmdbField(rating?.Source),
      Value: normalizeOmdbField(rating?.Value),
    }))
    .filter((rating) => rating.Source && rating.Value);
}

export function mapSearchItem(raw: Partial<OmdbSearchItem>): OmdbSearchItem {
  return {
    Title: normalizeOmdbField(raw.Title),
    Year: normalizeOmdbField(raw.Year),
    imdbID: normalizeOmdbField(raw.imdbID),
    Type: normalizeOmdbField(raw.Type),
    Poster: normalizeOmdbPoster(raw.Poster),
    imdbRating: normalizeOmdbField(raw.imdbRating),
  };
}

export function mapMovieDetails(raw: Partial<OmdbMovieDetails>): OmdbMovieDetails {
  return {
    Title: normalizeOmdbField(raw.Title),
    Year: normalizeOmdbField(raw.Year),
    Rated: normalizeOmdbField(raw.Rated),
    Released: normalizeOmdbField(raw.Released),
    Runtime: normalizeOmdbField(raw.Runtime),
    Genre: normalizeOmdbField(raw.Genre),
    Director: normalizeOmdbField(raw.Director),
    Writer: normalizeOmdbField(raw.Writer),
    Actors: normalizeOmdbField(raw.Actors),
    Plot: normalizeOmdbField(raw.Plot),
    Language: normalizeOmdbField(raw.Language),
    Country: normalizeOmdbField(raw.Country),
    Awards: normalizeOmdbField(raw.Awards),
    Poster: normalizeOmdbPoster(raw.Poster),
    Ratings: normalizeRatings(raw.Ratings),
    Metascore: normalizeOmdbField(raw.Metascore),
    imdbRating: normalizeOmdbField(raw.imdbRating),
    imdbVotes: normalizeOmdbField(raw.imdbVotes),
    imdbID: normalizeOmdbField(raw.imdbID),
    Type: normalizeOmdbField(raw.Type),
    DVD: normalizeOmdbField(raw.DVD),
    BoxOffice: normalizeOmdbField(raw.BoxOffice),
    Production: normalizeOmdbField(raw.Production),
    Website: normalizeOmdbField(raw.Website),
    Response: "True",
  };
}
