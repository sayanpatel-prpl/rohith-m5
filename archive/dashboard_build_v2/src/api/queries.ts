import { queryOptions } from "@tanstack/react-query";
import { buildExecutiveData } from "../data/adapters/executive-adapter";
import { buildFinancialData } from "../data/adapters/financial-adapter";
import { buildWatchlistData } from "../data/adapters/watchlist-adapter";
import { buildMarketPulseData } from "../data/adapters/market-pulse-adapter";
import { buildDealsData } from "../data/adapters/deals-adapter";
import { buildLeadershipData } from "../data/adapters/leadership-adapter";
import { buildOperationsData } from "../data/adapters/operations-adapter";
import { buildCompetitiveData } from "../data/adapters/competitive-adapter";
import { buildDeepDiveData } from "../data/adapters/deep-dive-adapter";
import { buildAMValueAddData } from "../data/adapters/am-value-add-adapter";
import { buildWhatThisMeansData } from "../data/adapters/what-this-means-adapter";
import type { SectionId } from "../types/common";

/**
 * Query option factories for all 11 sections.
 *
 * Each co-locates queryKey + queryFn for type-safe reuse.
 * Data is fetched once (static JSON) and filtered client-side (FOUND-14).
 *
 * All sections use dedicated adapters with rich typed payloads.
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
      queryFn: () => buildAMValueAddData(),
    }),

  "market-pulse": () =>
    queryOptions({
      queryKey: ["section", "market-pulse"] as const,
      queryFn: () => buildMarketPulseData(),
    }),

  financial: () =>
    queryOptions({
      queryKey: ["section", "financial"] as const,
      queryFn: () => buildFinancialData(),
    }),

  deals: () =>
    queryOptions({
      queryKey: ["section", "deals"] as const,
      queryFn: () => buildDealsData(),
    }),

  operations: () =>
    queryOptions({
      queryKey: ["section", "operations"] as const,
      queryFn: () => buildOperationsData(),
    }),

  leadership: () =>
    queryOptions({
      queryKey: ["section", "leadership"] as const,
      queryFn: () => buildLeadershipData(),
    }),

  competitive: () =>
    queryOptions({
      queryKey: ["section", "competitive"] as const,
      queryFn: () => buildCompetitiveData(),
    }),

  "deep-dive": () =>
    queryOptions({
      queryKey: ["section", "deep-dive"] as const,
      queryFn: () => buildDeepDiveData(),
    }),

  "what-this-means": () =>
    queryOptions({
      queryKey: ["section", "what-this-means"] as const,
      queryFn: () => buildWhatThisMeansData(),
    }),

  watchlist: () =>
    queryOptions({
      queryKey: ["section", "watchlist"] as const,
      queryFn: () => buildWatchlistData(),
    }),
} satisfies Record<SectionId, () => unknown>;
