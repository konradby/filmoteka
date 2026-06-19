import "server-only";

import { cache } from "react";

import {
  FETCH_TIMEOUT_MS,
  OMDB_API_PAGE_SIZE,
  OMDB_BASE_URL,
  OMDB_CACHE_REVALIDATE_SECONDS,
  RATING_SORT_FETCH_LIMIT,
  RESULTS_PER_PAGE,
} from "@/lib/omdb/constants";
import { sortMoviesByRating } from "@/lib/search/sort";
import {
  OmdbApiError,
  OmdbConfigError,
  OmdbNetworkError,
  OmdbNotFoundError,
  OmdbTooManyResultsError,
} from "@/lib/omdb/errors";
import { mapMovieDetails, mapSearchItem } from "@/lib/omdb/map-response";
import {
  isDetailsSuccess,
  isOmdbError,
  isSearchSuccess,
  type OmdbDetailsResponse,
  type OmdbSearchItem,
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
      next: { revalidate: OMDB_CACHE_REVALIDATE_SECONDS },
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
  if (normalized.includes("too many results")) {
    throw new OmdbTooManyResultsError(errorMessage);
  }
  throw new OmdbApiError(errorMessage);
}

type SearchPageFetchResult =
  | {
      items: OmdbSearchItem[];
      totalResults: number;
    }
  | "not_found";

async function fetchSearchPage(
  params: Omit<SearchMoviesParams, "page">,
  omdbPage: number,
): Promise<SearchPageFetchResult> {
  const queryParams: Record<string, string> = {
    s: params.query.trim(),
    page: String(omdbPage),
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
      return "not_found";
    }
    handleOmdbError(data.Error);
  }

  if (!isSearchSuccess(data)) {
    throw new OmdbApiError("Unexpected search response format");
  }

  return {
    items: data.Search.map(mapSearchItem),
    totalResults: Number.parseInt(data.totalResults, 10),
  };
}

function getOmdbPageRange(uiPage: number) {
  const startIndex = (uiPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const firstOmdbPage = Math.floor(startIndex / OMDB_API_PAGE_SIZE) + 1;
  const lastOmdbPage = Math.floor((endIndex - 1) / OMDB_API_PAGE_SIZE) + 1;

  return {
    startIndex,
    firstOmdbPage,
    omdbPages: Array.from(
      { length: lastOmdbPage - firstOmdbPage + 1 },
      (_, index) => firstOmdbPage + index,
    ),
  };
}

function dedupeSearchItems(items: OmdbSearchItem[]): OmdbSearchItem[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (!item.imdbID || seen.has(item.imdbID)) {
      return false;
    }

    seen.add(item.imdbID);
    return true;
  });
}

async function searchMoviesByRating(
  params: SearchMoviesParams,
): Promise<SearchMoviesResult> {
  const page = params.page ?? 1;
  const firstPage = await fetchSearchPage(params, 1);

  if (firstPage === "not_found") {
    return {
      items: [],
      totalResults: 0,
      page,
      totalPages: 0,
    };
  }

  const apiTotalResults = firstPage.totalResults;
  const fetchLimit = Math.min(apiTotalResults, RATING_SORT_FETCH_LIMIT);
  const omdbPagesNeeded = Math.ceil(fetchLimit / OMDB_API_PAGE_SIZE);

  const pageResults = await Promise.all(
    Array.from({ length: omdbPagesNeeded }, (_, index) =>
      index === 0
        ? Promise.resolve(firstPage)
        : fetchSearchPage(params, index + 1),
    ),
  );

  const mergedItems = dedupeSearchItems(
    pageResults.flatMap((result) =>
      result === "not_found" ? [] : result.items,
    ),
  ).slice(0, fetchLimit);

  const enrichedItems = await enrichSearchItemsWithRatings(mergedItems);
  const sortedItems = sortMoviesByRating(enrichedItems);
  const startIndex = (page - 1) * RESULTS_PER_PAGE;
  const items = sortedItems.slice(startIndex, startIndex + RESULTS_PER_PAGE);
  const totalPages =
    sortedItems.length > 0
      ? Math.ceil(sortedItems.length / RESULTS_PER_PAGE)
      : 0;

  return {
    items,
    totalResults: sortedItems.length,
    page,
    totalPages,
  };
}

export async function searchMovies(
  params: SearchMoviesParams,
): Promise<SearchMoviesResult> {
  if (params.sort === "rating") {
    return searchMoviesByRating(params);
  }

  const page = params.page ?? 1;
  const { startIndex, firstOmdbPage, omdbPages } = getOmdbPageRange(page);

  const pageResults = await Promise.all(
    omdbPages.map((omdbPage) => fetchSearchPage(params, omdbPage)),
  );

  const firstResult = pageResults[0];
  if (!firstResult || firstResult === "not_found") {
    return {
      items: [],
      totalResults: 0,
      page,
      totalPages: 0,
    };
  }

  const totalResults = firstResult.totalResults;
  const mergedItems = pageResults.flatMap((result) =>
    result === "not_found" ? [] : result.items,
  );
  const offsetInMerged = startIndex - (firstOmdbPage - 1) * OMDB_API_PAGE_SIZE;
  const items = mergedItems.slice(
    offsetInMerged,
    offsetInMerged + RESULTS_PER_PAGE,
  );
  const totalPages =
    totalResults > 0 ? Math.ceil(totalResults / RESULTS_PER_PAGE) : 0;

  return {
    items,
    totalResults,
    page,
    totalPages,
  };
}

const getMovieRating = cache(async (imdbId: string): Promise<string> => {
  if (!imdbId) {
    return "";
  }

  try {
    const data = await fetchOmdb<OmdbDetailsResponse>({ i: imdbId });

    if (isOmdbError(data) || !isDetailsSuccess(data)) {
      return "";
    }

    return mapMovieDetails(data).imdbRating;
  } catch {
    return "";
  }
});

export async function enrichSearchItemsWithRatings(
  items: OmdbSearchItem[],
): Promise<OmdbSearchItem[]> {
  const ratings = await Promise.all(
    items.map((item) => getMovieRating(item.imdbID)),
  );

  return items.map((item, index) => ({
    ...item,
    imdbRating: ratings[index] ?? "",
  }));
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

  return mapMovieDetails(data);
}
