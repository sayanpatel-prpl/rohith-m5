---
phase: 02-report-shell-and-data-layer
plan: 01
subsystem: api
tags: [tanstack-query-v5, zustand-v5, mock-data, api-client, filter-store, url-sync, usememo-derived-data, queryoptions-factory]

# Dependency graph
requires:
  - phase: 01-02
    provides: TypeScript data contracts (SectionData discriminated union, FinancialMetrics, Company, SectionId, common types)
provides:
  - TanStack Query v5 QueryClient singleton with Infinity staleTime for static mock data
  - Generic fetchSectionData API client mapping SectionId to dynamic mock imports (swappable to real API)
  - queryOptions factories for all 10 sections with co-located queryKey + queryFn
  - 16 real Indian Consumer Durables companies with sub-sectors in companies.ts
  - 10 mock data fixture files with plausible financial metrics, deals, leadership, and competitive data
  - Zustand v5 filter store managing companies, subCategory, performanceTier, timePeriod
  - Bidirectional URL <-> filter store sync via useFilterUrlSync hook
  - useFilteredData generic hook deriving filtered data via useMemo without API refetch
affects: [02-02-report-shell-ui, all-content-phases-3-through-9]

# Tech tracking
tech-stack:
  added: [@tanstack/react-query@5.90.21, @tanstack/react-query-devtools@5.91.3, zustand@5.0.11]
  patterns: [queryoptions-factory-pattern, zustand-v5-double-parens-typescript, subscribeWithSelector-url-sync, ref-based-infinite-loop-guards, individual-primitive-selectors, usememo-client-side-filtering]

key-files:
  created:
    - src/api/query-client.ts
    - src/api/client.ts
    - src/api/queries.ts
    - src/types/filters.ts
    - src/stores/filter-store.ts
    - src/stores/url-sync.ts
    - src/hooks/use-filtered-data.ts
    - src/data/mock/companies.ts
    - src/data/mock/executive.ts
    - src/data/mock/financial.ts
    - src/data/mock/market-pulse.ts
    - src/data/mock/deals.ts
    - src/data/mock/operations.ts
    - src/data/mock/leadership.ts
    - src/data/mock/competitive.ts
    - src/data/mock/deep-dive.ts
    - src/data/mock/action-lens.ts
    - src/data/mock/watchlist.ts
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "queryKeys exclude filter state -- data fetched once, filtered client-side via useMemo (FOUND-14 compliance)"
  - "Individual primitive Zustand selectors (s => s.companies) prevent v5 infinite re-render loops vs object selectors"
  - "URL params use short keys (subcat, tier, period) and omit defaults for clean shareable URLs"
  - "Ref-based guards (isUpdatingFromUrl, isUpdatingFromStore) prevent bidirectional URL sync infinite loops"
  - "Mock data uses real Indian Consumer Durables company names with plausible Q3 FY25 metrics for compelling demo"

patterns-established:
  - "Pattern: queryOptions factory -- sectionQueries.financial() returns typed queryOptions with co-located key + fn"
  - "Pattern: fetchSectionData<T>(sectionId) -- generic API client reads from mock imports, swappable to real API by changing one file"
  - "Pattern: useFilteredData<T>(sectionId) -- combines TanStack Query cache + Zustand filters via useMemo"
  - "Pattern: useFilterUrlSync() -- call once at report shell level for bidirectional URL <-> store sync"
  - "Pattern: DEFAULT_FILTERS constant as reset target and URL param default comparison"
  - "Pattern: subscribeWithSelector middleware enables efficient partial-state subscriptions for URL sync"

# Metrics
duration: 54min
completed: 2026-02-15
---

# Phase 2 Plan 01: API Client and Filter Store Summary

**TanStack Query v5 API client with 10 typed mock data fixtures for Indian Consumer Durables, Zustand v5 filter store with bidirectional URL sync, and useFilteredData hook for client-side derived filtering**

## Performance

- **Duration:** 54 min
- **Started:** 2026-02-15T19:01:43Z
- **Completed:** 2026-02-15T19:56:24Z
- **Tasks:** 2
- **Files modified:** 20

## Accomplishments
- TanStack Query v5 and Zustand v5 installed and configured with QueryClient singleton optimized for static mock data (Infinity staleTime, no refetch)
- 16 real Indian Consumer Durables companies defined (Voltas, Blue Star, Havells, Crompton, Whirlpool, Symphony, Orient Electric, Bajaj Electricals, V-Guard, TTK Prestige, Butterfly Gandhimathi, Amber Enterprises, Dixon Technologies, Johnson Controls-Hitachi, Daikin India, IFB Industries) across 5 sub-sectors
- 10 mock data fixtures with detailed, plausible Q3 FY25 data -- financial metrics, executive bullets with red flags, market pulse signals, 8 deals with AI patterns, operational intelligence, leadership changes, competitive moves with cluster analysis, deep-dive cost breakdowns, action lens for PE/investors, and watchlist with stress indicators
- Generic fetchSectionData API client with dynamic imports and simulated dev latency, designed for easy swap to real API
- queryOptions factories for all 10 sections with FOUND-14 compliance (no filter state in queryKeys)
- Zustand filter store with 4 dimensions (companies, subCategory, performanceTier, timePeriod) and subscribeWithSelector middleware
- Bidirectional URL sync hook with ref-based infinite loop prevention -- shareable URLs like `?companies=voltas,bluestar&tier=outperform`
- useFilteredData generic hook deriving filtered results via useMemo, zero extra API calls on filter change

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies, create API client with TanStack Query, and mock data fixtures** - `18f6821` (feat)
2. **Task 2: Zustand filter store with URL sync and useFilteredData hook** - `b838cda` (feat)

## Files Created/Modified

- `package.json` - Added @tanstack/react-query, @tanstack/react-query-devtools, zustand dependencies
- `src/api/query-client.ts` - QueryClient singleton with Infinity staleTime, 30min gcTime, no refetch on focus/reconnect
- `src/api/client.ts` - fetchSectionData generic function mapping SectionId to dynamic mock imports with dev latency simulation
- `src/api/queries.ts` - queryOptions factories for all 10 sections with co-located queryKey + queryFn
- `src/types/filters.ts` - FilterState interface, DEFAULT_FILTERS constant, FilterActions interface
- `src/stores/filter-store.ts` - Zustand v5 store with subscribeWithSelector middleware and typed filter actions
- `src/stores/url-sync.ts` - useFilterUrlSync hook for bidirectional URL <-> store sync with ref-based loop guards
- `src/hooks/use-filtered-data.ts` - Generic hook combining TanStack Query data + Zustand filters via useMemo
- `src/data/mock/companies.ts` - 16 companies with COMPANIES array, SUB_SECTORS derived array, getCompanyById helper
- `src/data/mock/executive.ts` - 5 executive bullets and 5 red flags with AI confidence scores
- `src/data/mock/financial.ts` - All 16 companies with FinancialMetrics, performance tags, variance analysis
- `src/data/mock/market-pulse.ts` - 4 demand signals, 4 input costs, margin outlook, 4 channel mix entries
- `src/data/mock/deals.ts` - 8 deals (M&A, PE/VC, IPO, distressed) and 3 AI patterns
- `src/data/mock/operations.ts` - 4 supply chain signals, 4 manufacturing capacity, 3 procurement shifts, 4 retail footprint
- `src/data/mock/leadership.ts` - 4 CXO changes, 3 board reshuffles, 4 promoter stake changes, 2 auditor flags, 3 AI risk flags
- `src/data/mock/competitive.ts` - 5 product launches, 4 pricing actions, 3 D2C initiatives, 3 QC partnerships, 3 cluster groups
- `src/data/mock/deep-dive.ts` - Air Conditioning sub-sector with 5 cost breakdown items, 4 margin levers, 3 top quartile metrics
- `src/data/mock/action-lens.ts` - PE/Investors persona with 4 takeaways and 4 signal scores
- `src/data/mock/watchlist.ts` - 3 fundraise signals, 3 margin inflection candidates, 3 consolidation targets, 4 stress indicators

## Decisions Made

- **queryKeys exclude filter state (FOUND-14)** -- Data is fetched once per section and cached forever. Filtering happens purely client-side via useMemo. Changing a filter never triggers a network request.
- **Individual primitive Zustand selectors** -- Using `s => s.companies` instead of `s => ({ companies: s.companies, ... })` prevents Zustand v5 from detecting a "new" object reference every render and causing infinite re-render loops.
- **Short URL param keys** -- `subcat` instead of `subCategory`, `tier` instead of `performanceTier`. Keeps shareable URLs compact. Default values omitted from URL entirely.
- **Ref-based sync guards** -- `isUpdatingFromUrl` and `isUpdatingFromStore` refs prevent the bidirectional URL <-> store sync from creating an infinite update loop.
- **Mock data with real company identities** -- Using actual Indian Consumer Durables company names, tickers, and plausible financial metrics makes the demo compelling for consulting partner audiences.

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Data layer is fully operational: fetch -> cache -> filter -> derive pipeline complete
- Any section component can call `useFilteredData('financial')` and receive typed, filtered data from cache
- Plan 02-02 can now build the FilterBar UI, lazy-loaded section routing, and QueryClientProvider integration
- Content phases 3-9 can import useFilteredData and sectionQueries directly

## Self-Check: PASSED

- All 18 created files verified present on disk
- Commit 18f6821 (Task 1) verified in git log
- Commit b838cda (Task 2) verified in git log
- TypeScript compiles with zero errors (npx tsc --noEmit)
- TanStack Query v5.90.21 and Zustand v5.0.11 installed
- DEFAULT_FILTERS: companies=[], subCategory='all', performanceTier='all', timePeriod='YoY'

---
*Phase: 02-report-shell-and-data-layer*
*Completed: 2026-02-15*
