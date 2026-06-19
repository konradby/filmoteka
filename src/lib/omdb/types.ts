import type { OmdbMediaType } from "@/lib/omdb/constants";
import {
  normalizeOmdbField,
  normalizeOmdbPoster,
} from "@/lib/omdb/map-response";

export interface OmdbSearchItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OmdbSearchSuccessResponse {
  Search: OmdbSearchItem[];
  totalResults: string;
  Response: "True";
}

export interface OmdbErrorResponse {
  Response: "False";
  Error: string;
}

export type OmdbSearchResponse = OmdbSearchSuccessResponse | OmdbErrorResponse;

export interface OmdbRating {
  Source: string;
  Value: string;
}

export interface OmdbMovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OmdbRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: "True";
}

export type OmdbDetailsResponse = OmdbMovieDetails | OmdbErrorResponse;

export interface SearchMoviesParams {
  query: string;
  page?: number;
  year?: string;
  type?: OmdbMediaType;
}

export interface SearchMoviesResult {
  items: OmdbSearchItem[];
  totalResults: number;
  page: number;
  totalPages: number;
}

export function isOmdbError(
  response: OmdbSearchResponse | OmdbDetailsResponse,
): response is OmdbErrorResponse {
  return response.Response === "False";
}

export function isSearchSuccess(
  response: OmdbSearchResponse,
): response is OmdbSearchSuccessResponse {
  return response.Response === "True" && Array.isArray(response.Search);
}

export function isDetailsSuccess(
  response: OmdbDetailsResponse,
): response is OmdbMovieDetails {
  return response.Response === "True" && "imdbID" in response;
}

export function toFavoriteMovie(item: OmdbSearchItem | OmdbMovieDetails) {
  return {
    imdbID: normalizeOmdbField(item.imdbID),
    Title: normalizeOmdbField(item.Title),
    Year: normalizeOmdbField(item.Year),
    Poster: normalizeOmdbPoster(item.Poster),
    Type: normalizeOmdbField(item.Type),
  };
}
