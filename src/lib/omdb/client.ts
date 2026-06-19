import "server-only";

import {
  FETCH_TIMEOUT_MS,
  OMDB_BASE_URL,
  RESULTS_PER_PAGE,
} from "@/lib/omdb/constants";
import {
  OmdbApiError,
  OmdbConfigError,
  OmdbNetworkError,
  OmdbNotFoundError,
} from "@/lib/omdb/errors";
import {
  isDetailsSuccess,
  isOmdbError,
  isSearchSuccess,
  type OmdbDetailsResponse,
  type OmdbSearchResponse,
  type SearchMoviesParams,
  type SearchMoviesResult,
} from "@/lib/omdb/types";

function getApiKey(): string {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    throw new OmdbConfigError(
      "OMDB_API_KEY is not configured. Add it to .env.local",
    );
  }
  return apiKey;
}

async function fetchOmdb<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set("apikey", getApiKey());

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new OmdbNetworkError(`HTTP error: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof OmdbApiError || error instanceof OmdbConfigError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new OmdbNetworkError("Request timed out");
    }
    throw new OmdbNetworkError(
      error instanceof Error ? error.message : "Network request failed",
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

function handleOmdbError(errorMessage: string): never {
  const normalized = errorMessage.toLowerCase();
  if (
    normalized.includes("not found") ||
    normalized.includes("incorrect imdb id")
  ) {
    throw new OmdbNotFoundError(errorMessage);
  }
  throw new OmdbApiError(errorMessage);
}

export async function searchMovies(
  params: SearchMoviesParams,
): Promise<SearchMoviesResult> {
  const page = params.page ?? 1;
  const queryParams: Record<string, string> = {
    s: params.query.trim(),
    page: String(page),
  };

  if (params.year) {
    queryParams.y = params.year;
  }
  if (params.type) {
    queryParams.type = params.type;
  }

  const data = await fetchOmdb<OmdbSearchResponse>(queryParams);

  if (isOmdbError(data)) {
    if (data.Error.toLowerCase().includes("not found")) {
      return {
        items: [],
        totalResults: 0,
        page,
        totalPages: 0,
      };
    }
    handleOmdbError(data.Error);
  }

  if (!isSearchSuccess(data)) {
    throw new OmdbApiError("Unexpected search response format");
  }

  const totalResults = Number.parseInt(data.totalResults, 10);
  const totalPages = Math.max(1, Math.ceil(totalResults / RESULTS_PER_PAGE));

  return {
    items: data.Search,
    totalResults,
    page,
    totalPages,
  };
}

export async function getMovieDetails(imdbId: string) {
  const data = await fetchOmdb<OmdbDetailsResponse>({
    i: imdbId,
    plot: "full",
  });

  if (isOmdbError(data)) {
    handleOmdbError(data.Error);
  }

  if (!isDetailsSuccess(data)) {
    throw new OmdbApiError("Unexpected details response format");
  }

  return data;
}
