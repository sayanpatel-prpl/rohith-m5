import { queryOptions } from "@tanstack/react-query";
import { getFinancialApiData } from "../data/loaders/financial-api";
import type { SectionId } from "../types/common";
import type { SectionData } from "../types/sections";

/**
 * Build section data from static JSON loaders.
 *
 * Unlike v1 which fetched from an API, v2 loads data synchronously
 * from imported JSON via loaders. For now, this returns data from
 * the financial-api loader (closest to section shape).
 *
 * Section-specific adapters will be built in Phase 2 plans to
 * transform raw loader data into each section's typed shape.
 */
function buildSectionData(sectionId: SectionId): SectionData & Record<string, unknown> {
  const financialData = getFinancialApiData();

  return {
    section: sectionId,
    dataAsOf: financialData.dataAsOf,
    lastUpdated: financialData.lastUpdated,
    companies: financialData.companies,
  };
}

/**
 * Query option factories for all sections.
 *
 * Each co-locates queryKey + queryFn for type-safe reuse.
 * Data is fetched once (static JSON) and filtered client-side (FOUND-14).
 *
 * Usage: const { data } = useQuery(sectionQueries.executive());
 *
 * IMPORTANT: queryKeys do NOT include filter state.
 * Data is fetched once and filtered client-side via useMemo.
 */
export const sectionQueries: Record<
  SectionId,
  () => ReturnType<typeof queryOptions>
> = {
  executive: () =>
    queryOptions({
      queryKey: ["section", "executive"] as const,
      queryFn: () => buildSectionData("executive"),
    }),

  "am-value-add": () =>
    queryOptions({
      queryKey: ["section", "am-value-add"] as const,
      queryFn: () => buildSectionData("am-value-add"),
    }),

  "market-pulse": () =>
    queryOptions({
      queryKey: ["section", "market-pulse"] as const,
      queryFn: () => buildSectionData("market-pulse"),
    }),

  financial: () =>
    queryOptions({
      queryKey: ["section", "financial"] as const,
      queryFn: () => buildSectionData("financial"),
    }),

  deals: () =>
    queryOptions({
      queryKey: ["section", "deals"] as const,
      queryFn: () => buildSectionData("deals"),
    }),

  operations: () =>
    queryOptions({
      queryKey: ["section", "operations"] as const,
      queryFn: () => buildSectionData("operations"),
    }),

  leadership: () =>
    queryOptions({
      queryKey: ["section", "leadership"] as const,
      queryFn: () => buildSectionData("leadership"),
    }),

  competitive: () =>
    queryOptions({
      queryKey: ["section", "competitive"] as const,
      queryFn: () => buildSectionData("competitive"),
    }),

  "deep-dive": () =>
    queryOptions({
      queryKey: ["section", "deep-dive"] as const,
      queryFn: () => buildSectionData("deep-dive"),
    }),

  "what-this-means": () =>
    queryOptions({
      queryKey: ["section", "what-this-means"] as const,
      queryFn: () => buildSectionData("what-this-means"),
    }),

  watchlist: () =>
    queryOptions({
      queryKey: ["section", "watchlist"] as const,
      queryFn: () => buildSectionData("watchlist"),
    }),
};
