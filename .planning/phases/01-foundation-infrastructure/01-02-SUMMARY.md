---
phase: 01-foundation-infrastructure
plan: 02
subsystem: data-layer, state-management
tags: [zustand, tanstack-query, json-loaders, filter-store, url-sync, news-api, company-registry]

# Dependency graph
requires:
  - phase: 01-foundation-infrastructure
    provides: "Project scaffold with @data alias, company-matching.ts, and type definitions (plans 01, 05)"
provides:
  - "5 data loaders importing JSON via @data alias (consolidated, screener, sovrenn, trendlyne, financial-api)"
  - "News loader with anti-clickbait filtering and graceful degradation (NEWS-02)"
  - "Company registry with 16 companies and lookup by ID, ticker, or name"
  - "src/api/news.ts public API surface re-exporting from data/loaders/news.ts (NEWS-07)"
  - "Zustand v5 filter store with subscribeWithSelector for 4 filter dimensions"
  - "Bidirectional URL sync with ref guards preventing infinite loops"
  - "TanStack Query client with staleTime:Infinity for static data"
  - "Query option factories for all 11 sections"
  - "useFilteredData hook with individual primitive selectors and useMemo filtering"
affects: [01-03, 01-04, 01-06, 02-priority-sections, 03-remaining-sections, 04-cross-cutting, 05-am-value-add, 06-production]

# Tech tracking
tech-stack:
  added: []
  patterns: [static-json-import-via-data-alias, zustand-subscribeWithSelector, individual-primitive-selectors, ref-guard-bidirectional-sync, anti-clickbait-data-filtering, graceful-empty-array-degradation]

key-files:
  created:
    - dashboard_build_v2/src/data/loaders/consolidated.ts
    - dashboard_build_v2/src/data/loaders/screener.ts
    - dashboard_build_v2/src/data/loaders/sovrenn.ts
    - dashboard_build_v2/src/data/loaders/trendlyne.ts
    - dashboard_build_v2/src/data/loaders/financial-api.ts
    - dashboard_build_v2/src/data/loaders/news.ts
    - dashboard_build_v2/src/data/companies.ts
    - dashboard_build_v2/src/api/news.ts
    - dashboard_build_v2/src/stores/filter-store.ts
    - dashboard_build_v2/src/stores/url-sync.ts
    - dashboard_build_v2/src/api/query-client.ts
    - dashboard_build_v2/src/api/queries.ts
    - dashboard_build_v2/src/hooks/use-filtered-data.ts
  modified: []

key-decisions:
  - "buildSectionData placeholder uses financial-api loader as closest to section shape; section-specific adapters deferred to Phase 2"
  - "Company registry includes daikin and jch with inferred metadata despite absence from most data files"
  - "News loader returns cached empty array with anti-clickbait filter ready for when news JSON drops in"
  - "Query factories cover all 11 sections (including am-value-add and what-this-means added in 01-05)"

patterns-established:
  - "Data loaders: import rawData from @data, type-cast as unknown, export typed accessor with graceful null coalescing"
  - "Filter store: create<State & Actions>()(subscribeWithSelector(set => ...)) Zustand v5 pattern"
  - "URL sync: ref-based guards (isUpdatingFromUrl, isUpdatingFromStore) for bidirectional sync without loops"
  - "useFilteredData: individual primitive selectors for each filter dimension to prevent v5 re-render loops"
  - "sectionQueries: record keyed by SectionId, each returning queryOptions with ['section', sectionId] queryKey"

# Metrics
duration: 4min
completed: 2026-02-21
---

# Phase 1 Plan 2: Data Layer & State Management Summary

**5 JSON data loaders via @data alias, 16-company registry, Zustand v5 filter store with subscribeWithSelector, bidirectional URL sync with ref guards, TanStack Query with staleTime:Infinity, and useFilteredData hook using individual primitive selectors**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-20T19:34:30Z
- **Completed:** 2026-02-20T19:38:44Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- Created 5 typed data loaders (consolidated, screener, sovrenn, trendlyne, financial-api) importing JSON at build time via @data Vite alias with full TypeScript interfaces matching each JSON shape
- Built company registry covering all 16 tracked companies (including daikin and jch) with lookup by ID, ticker, or display name
- Created news loader with NEWS-02 anti-clickbait filtering at data layer and graceful empty-array degradation for missing news data, plus src/api/news.ts as public API surface (NEWS-07)
- Ported Zustand v5 filter store with subscribeWithSelector middleware, bidirectional URL sync with ref guards, and TanStack Query client configured for static presentation data
- Built useFilteredData hook combining query cache with Zustand filters using individual primitive selectors and useMemo for client-side filtering

## Task Commits

Each task was committed atomically:

1. **Task 1: Create data loaders, company registry, and news API module** - `b60c347` (feat)
2. **Task 2: Create state management and data hooks** - `ce6864f` (feat)

## Files Created/Modified
- `dashboard_build_v2/src/data/loaders/consolidated.ts` - Typed loader for consolidated-dashboard-data.json with ConsolidatedCompany interface (14 companies, quarterly/annual/balance/ratio data)
- `dashboard_build_v2/src/data/loaders/screener.ts` - Typed loader for screener-all-companies.json with tabular data structure (headers + data arrays)
- `dashboard_build_v2/src/data/loaders/sovrenn.ts` - Typed loader for sovrenn-intelligence.json with deal activity, growth triggers, concall highlights
- `dashboard_build_v2/src/data/loaders/trendlyne.ts` - Typed loader for trendlyne-summary.json with extraction summary and company financial snapshots
- `dashboard_build_v2/src/data/loaders/financial-api.ts` - Typed loader for financial-api-data.json with metrics, performance tiers, and quarterly history
- `dashboard_build_v2/src/data/loaders/news.ts` - News loader with anti-clickbait filtering, section/company filtering, corroboration/contradiction helpers
- `dashboard_build_v2/src/data/companies.ts` - Master registry of 16 companies with getCompanyById, getCompanyByTicker, getCompanyByName
- `dashboard_build_v2/src/api/news.ts` - Public API surface re-exporting all news functions from data/loaders/news.ts (NEWS-07)
- `dashboard_build_v2/src/stores/filter-store.ts` - Zustand v5 filter store with subscribeWithSelector, 4 filter dimensions, 5 actions
- `dashboard_build_v2/src/stores/url-sync.ts` - Bidirectional URL sync with ref guards, compact param keys, JSON.stringify equality
- `dashboard_build_v2/src/api/query-client.ts` - TanStack Query client with staleTime:Infinity, gcTime:30min, no refetch
- `dashboard_build_v2/src/api/queries.ts` - Query option factories for all 11 sections using buildSectionData placeholder
- `dashboard_build_v2/src/hooks/use-filtered-data.ts` - Generic hook combining query cache with Zustand filters via individual primitive selectors

## Decisions Made
- buildSectionData uses financial-api loader data as placeholder; section-specific adapters will be built in Phase 2 plans when each section gets its own typed data shape
- Company registry includes daikin (unlisted) and jch (Johnson Controls-Hitachi) with inferred ticker/nseSymbol values since they appear in sovrenn data but not other sources
- News loader architecture uses a cached empty array pattern ready for zero-code-change integration when news JSON drops in Sunday morning
- Query factories cover all 11 SectionIds including the two v2 additions (am-value-add, what-this-means)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - all files type-checked on first attempt with `tsc --noEmit`.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Complete data pipeline ready: JSON files -> loaders -> query cache -> filter store -> useFilteredData hook
- All section components can now call useFilteredData(sectionId) to get filtered, cached data
- Company registry ready for use by components, filters, and data adapters
- News infrastructure ready for zero-code-change news JSON integration
- Ready for Plan 01-03 (report shell) and Plan 01-04 (components)

---
## Self-Check: PASSED

- All 13 created files verified present on disk
- Commit b60c347 (Task 1) verified in git log
- Commit ce6864f (Task 2) verified in git log
- TypeScript type-check: zero errors
- subscribeWithSelector used in filter-store.ts
- Ref guards (isUpdatingFromUrl, isUpdatingFromStore) present in url-sync.ts
- Individual primitive selectors used in use-filtered-data.ts
- staleTime: Infinity set in query-client.ts
- src/api/news.ts re-exports all 5 functions from data/loaders/news.ts

---
*Phase: 01-foundation-infrastructure*
*Completed: 2026-02-21*
