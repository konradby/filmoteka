/** Internal OMDb query for browse mode when the user has not entered a phrase. Not shown in the UI. */
export const INITIAL_BROWSE_QUERY = "movie";

export const hasUserSearchQuery = (query: string | undefined): boolean => {
  return Boolean(query?.trim());
};

export const getSearchFetchQuery = (query: string | undefined): string => {
  return query?.trim() || INITIAL_BROWSE_QUERY;
};
