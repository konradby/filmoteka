import {
  OmdbApiError,
  OmdbConfigError,
  OmdbNetworkError,
  OmdbNotFoundError,
  OmdbTooManyResultsError,
} from "@/lib/omdb/errors";
import type { Dictionary } from "@/i18n/get-dictionary";

export function getErrorMessage(error: unknown, dictionary: Dictionary): string {
  if (error instanceof OmdbConfigError) {
    return dictionary.errors.config;
  }
  if (error instanceof OmdbNetworkError) {
    return dictionary.errors.network;
  }
  if (error instanceof OmdbNotFoundError) {
    return dictionary.errors.notFound;
  }
  if (error instanceof OmdbTooManyResultsError) {
    return dictionary.errors.tooManyResults;
  }
  if (error instanceof OmdbApiError) {
    return error.message || dictionary.errors.generic;
  }
  return dictionary.errors.generic;
}
