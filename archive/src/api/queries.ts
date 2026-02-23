import { queryOptions } from "@tanstack/react-query";
import { fetchSectionData } from "./client";
import type {
  ExecutiveSnapshotData,
  FinancialPerformanceData,
  MarketPulseData,
  DealsTransactionsData,
  OperationalIntelligenceData,
  LeadershipGovernanceData,
  CompetitiveMovesData,
  SubSectorDeepDiveData,
  ActionLensData,
  WatchlistData,
} from "../types/sections";

/**
 * queryOptions factories for all 10 sections.
 * Each co-locates queryKey + queryFn for type-safe reuse.
 *
 * Usage: const { data } = useQuery(sectionQueries.financial());
 *
 * IMPORTANT: queryKeys do NOT include filter state.
 * Data is fetched once and filtered client-side via useMemo (FOUND-14).
 */
export const sectionQueries = {
  executive: () =>
    queryOptions({
      queryKey: ["section", "executive"] as const,
      queryFn: () => fetchSectionData<ExecutiveSnapshotData>("executive"),
      staleTime: Infinity,
      gcTime: Infinity,
    }),

  financial: () =>
    queryOptions({
      queryKey: ["section", "financial"] as const,
      queryFn: () => fetchSectionData<FinancialPerformanceData>("financial"),
      staleTime: Infinity,
      gcTime: Infinity,
    }),

  "market-pulse": () =>
    queryOptions({
      queryKey: ["section", "market-pulse"] as const,
      queryFn: () => fetchSectionData<MarketPulseData>("market-pulse"),
      staleTime: Infinity,
      gcTime: Infinity,
    }),

  deals: () =>
    queryOptions({
      queryKey: ["section", "deals"] as const,
      queryFn: () => fetchSectionData<DealsTransactionsData>("deals"),
      staleTime: Infinity,
      gcTime: Infinity,
    }),

  operations: () =>
    queryOptions({
      queryKey: ["section", "operations"] as const,
      queryFn: () =>
        fetchSectionData<OperationalIntelligenceData>("operations"),
      staleTime: Infinity,
      gcTime: Infinity,
    }),

  leadership: () =>
    queryOptions({
      queryKey: ["section", "leadership"] as const,
      queryFn: () => fetchSectionData<LeadershipGovernanceData>("leadership"),
      staleTime: Infinity,
      gcTime: Infinity,
    }),

  competitive: () =>
    queryOptions({
      queryKey: ["section", "competitive"] as const,
      queryFn: () => fetchSectionData<CompetitiveMovesData>("competitive"),
      staleTime: Infinity,
      gcTime: Infinity,
    }),

  "deep-dive": () =>
    queryOptions({
      queryKey: ["section", "deep-dive"] as const,
      queryFn: () => fetchSectionData<SubSectorDeepDiveData>("deep-dive"),
      staleTime: Infinity,
      gcTime: Infinity,
    }),

  "action-lens": () =>
    queryOptions({
      queryKey: ["section", "action-lens"] as const,
      queryFn: () => fetchSectionData<ActionLensData>("action-lens"),
      staleTime: Infinity,
      gcTime: Infinity,
    }),

  watchlist: () =>
    queryOptions({
      queryKey: ["section", "watchlist"] as const,
      queryFn: () => fetchSectionData<WatchlistData>("watchlist"),
      staleTime: Infinity,
      gcTime: Infinity,
    }),
};
