export const DEFAULT_SEARCH_QUERY = "titanic";

export function getEffectiveSearchQuery(query: string | undefined): string {
  return query?.trim() || DEFAULT_SEARCH_QUERY;
}

export function shouldApplyDefaultSearchQuery(query: string | undefined): boolean {
  return !query?.trim();
}
