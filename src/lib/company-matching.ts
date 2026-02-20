/**
 * Fuzzy company match: returns true if `field` contains
 * either the first word of `companyName` or the `companyId` (case-insensitive).
 *
 * Used for data sources that store display names (leadership, watchlist, deals).
 */
export function matchesCompany(
  field: string,
  companyName: string,
  companyId: string,
): boolean {
  const lower = field.toLowerCase();
  return (
    lower.includes(companyName.split(" ")[0].toLowerCase()) ||
    lower.includes(companyId.toLowerCase())
  );
}

/**
 * Exact company match on lowercase ID.
 *
 * Used for data sources that store lowercase IDs (operations, financial).
 */
export function matchesCompanyId(field: string, companyId: string): boolean {
  return field.toLowerCase() === companyId.toLowerCase();
}

/**
 * Filter an array by fuzzy company match on an extracted field.
 */
export function filterByCompany<T>(
  items: T[],
  accessor: (item: T) => string,
  companyName: string,
  companyId: string,
): T[] {
  return items.filter((item) =>
    matchesCompany(accessor(item), companyName, companyId),
  );
}

/**
 * Filter an array by exact company ID match on an extracted field.
 */
export function filterByCompanyId<T>(
  items: T[],
  accessor: (item: T) => string,
  companyId: string,
): T[] {
  return items.filter((item) =>
    matchesCompanyId(accessor(item), companyId),
  );
}
