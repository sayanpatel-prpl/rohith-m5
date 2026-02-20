import { queryOptions } from "@tanstack/react-query";
import { getFinancialApiData } from "../data/loaders/financial-api";
import { buildExecutiveData } from "../data/adapters/executive-adapter";
import { buildFinancialData } from "../data/adapters/financial-adapter";
import { buildWatchlistData } from "../data/adapters/watchlist-adapter";
import type { SectionId } from "../types/common";
import type { SectionData } from "../types/sections";

/**
 * Build generic section data from static JSON loaders.
 *
 * Fallback for sections that do not yet have dedicated adapters.
 * Returns data from the financial-api loader (closest to section shape).
 * Section-specific adapters will be built in later Phase 2 plans.
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
 * Priority sections (executive, financial, watchlist) use dedicated adapters
 * that combine multiple data sources into rich typed payloads.
 * Remaining sections use the generic buildSectionData fallback.
 *
 * Usage: const { data } = useQuery(sectionQueries.executive());
 *
 * IMPORTANT: queryKeys do NOT include filter state.
 * Data is fetched once and filtered client-side via useMemo.
 */
export const sectionQueries = {
  executive: () =>
    queryOptions({
      queryKey: ["section", "executive"] as const,
      queryFn: () => buildExecutiveData(),
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
      queryFn: () => buildFinancialData(),
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
      queryFn: () => buildWatchlistData(),
    }),
} satisfies Record<SectionId, () => unknown>;
