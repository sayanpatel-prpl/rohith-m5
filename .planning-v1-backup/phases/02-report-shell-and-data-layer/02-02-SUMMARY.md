---
phase: 02-report-shell-and-data-layer
plan: 02
subsystem: ui
tags: [react-lazy, code-splitting, radix-select, radix-popover, radix-checkbox, filterbar, zustand-url-sync, suspense, query-client-provider]

# Dependency graph
requires:
  - phase: 02-01
    provides: TanStack Query client, Zustand filter store, URL sync hook, useFilteredData hook, 10 mock data fixtures, queryOptions factories
  - phase: 01-01
    provides: AppShell layout, TopBar, Sidebar, SectionWrapper with ErrorBoundary, route config
  - phase: 01-02
    provides: SectionSkeleton, DataRecencyTag, TypeScript section data contracts
provides:
  - FilterBar horizontal strip with CompanyPicker multi-select and 3 SelectFilter single-select dropdowns
  - 10 lazy-loaded placeholder section components proving fetch->cache->filter->render pipeline
  - lazySections Record<SectionId, React.LazyExoticComponent> map for code-split section routing
  - QueryClientProvider at app root wrapping BrowserRouter (prevents "No QueryClient set" errors)
  - ReactQueryDevtools for dev-only query cache inspection
  - App.tsx with Suspense + SectionSkeleton fallback per lazy-loaded section route
  - AppShell.tsx with FilterBar between TopBar and content, useFilterUrlSync activation
  - filter-options.ts deriving company, sub-category, performance, time period options from mock data
affects: [all-content-phases-3-through-9, phase-03-core-financial-intelligence]

# Tech tracking
tech-stack:
  added: []
  patterns: [react-lazy-default-export-per-section, suspense-with-skeleton-fallback, radix-popover-checkbox-multi-select, radix-select-single-select, compact-bloomberg-filter-strip, filter-options-derived-from-mock-data]

key-files:
  created:
    - src/components/filters/FilterBar.tsx
    - src/components/filters/CompanyPicker.tsx
    - src/components/filters/SelectFilter.tsx
    - src/components/filters/filter-options.ts
    - src/components/sections/index.ts
    - src/sections/executive/ExecutiveSnapshot.tsx
    - src/sections/financial/FinancialPerformance.tsx
    - src/sections/market-pulse/MarketPulse.tsx
    - src/sections/deals/DealsTransactions.tsx
    - src/sections/operations/OperationalIntelligence.tsx
    - src/sections/leadership/LeadershipGovernance.tsx
    - src/sections/competitive/CompetitiveMoves.tsx
    - src/sections/deep-dive/SubSectorDeepDive.tsx
    - src/sections/action-lens/ActionLens.tsx
    - src/sections/watchlist/Watchlist.tsx
  modified:
    - src/app/App.tsx
    - src/components/layout/AppShell.tsx
    - src/components/charts/ChartTooltip.tsx
    - src/components/errors/SectionErrorFallback.tsx
    - src/data/mock/executive.ts
    - src/hooks/use-filtered-data.ts

key-decisions:
  - "QueryClientProvider placed at app root above BrowserRouter -- prevents 'No QueryClient set' errors on navigation (per RESEARCH.md pitfall 5)"
  - "Each section uses export default function (React.lazy requires default exports per RESEARCH.md pitfall 3)"
  - "CompanyPicker uses Radix Popover + Checkbox for multi-select since Radix Select does not support multiple selection"
  - "FilterBar always visible (not collapsible) per user decision -- compact single row preserving Bloomberg terminal density"
  - "Each placeholder section counts records specific to its data shape proving the full filtering pipeline works"

patterns-established:
  - "Pattern: lazySections map -- Record<SectionId, React.LazyExoticComponent> in src/components/sections/index.ts enables code-split routing"
  - "Pattern: Suspense + SectionSkeleton -- each section route wrapped in Suspense with SectionSkeleton variant='mixed' as fallback"
  - "Pattern: placeholder section structure -- useFilteredData hook -> loading/error/data states -> section name + DataRecencyTag + filtered record counts"
  - "Pattern: FilterBar layout -- compact horizontal strip between TopBar and content, 4 controls in a row with conditional Reset button"
  - "Pattern: filter-options derived from mock data -- COMPANY_OPTIONS from COMPANIES array, SUB_CATEGORY_OPTIONS from SUB_SECTORS"

# Metrics
duration: 25min
completed: 2026-02-16
---

# Phase 2 Plan 02: FilterBar and Lazy-Loaded Sections Summary

**FilterBar with Radix Popover multi-select CompanyPicker and 3 SelectFilter dropdowns, 10 lazy-loaded placeholder sections proving full fetch->cache->filter->render pipeline, QueryClientProvider at root with code-split routing producing 20+ separate chunks**

## Performance

- **Duration:** 25 min (active execution)
- **Started:** 2026-02-16T01:31:00+05:30
- **Completed:** 2026-02-16T10:17:34+05:30
- **Tasks:** 2
- **Files modified:** 21 (15 created, 6 modified)

## Accomplishments
- FilterBar with 4 filter controls (CompanyPicker multi-select, Sub-category, Performance, Period single-selects) connected to Zustand filter store with bidirectional URL sync
- 10 placeholder section components each proving the full data pipeline: fetch from TanStack Query cache, filter via useFilteredData useMemo, render section-specific record counts
- Code splitting verified: Vite build produces 10 separate section chunks + 10 separate data chunks (each section loads on first visit only)
- QueryClientProvider and ReactQueryDevtools integrated at app root, Suspense + SectionSkeleton fallback on every section route
- Fixed 4 pre-existing build-mode TypeScript errors (executive.ts string literal, ChartTooltip dataKey types, SectionErrorFallback unknown error, useFilteredData union overload)

## Task Commits

Each task was committed atomically:

1. **Task 1: FilterBar UI components (CompanyPicker, SelectFilter, FilterBar)** - `69e0650` (feat)
2. **Task 2: Lazy-loaded section placeholders, updated App.tsx, and updated AppShell** - `cea3f5c` (feat)

## Files Created/Modified

- `src/components/filters/filter-options.ts` - Derives filter option arrays from mock data (companies, sub-sectors, performance tiers, time periods)
- `src/components/filters/SelectFilter.tsx` - Reusable single-select dropdown using Radix Select with compact Bloomberg styling
- `src/components/filters/CompanyPicker.tsx` - Multi-select company dropdown using Radix Popover + Checkbox with label logic and clear all
- `src/components/filters/FilterBar.tsx` - Horizontal filter strip with 4 controls and conditional Reset button
- `src/components/sections/index.ts` - lazySections map: Record<SectionId, React.LazyExoticComponent> with 10 React.lazy imports
- `src/sections/executive/ExecutiveSnapshot.tsx` - Placeholder showing bullet count and red flag count
- `src/sections/financial/FinancialPerformance.tsx` - Placeholder showing company count
- `src/sections/market-pulse/MarketPulse.tsx` - Placeholder showing signal count and input cost count
- `src/sections/deals/DealsTransactions.tsx` - Placeholder showing deal count
- `src/sections/operations/OperationalIntelligence.tsx` - Placeholder showing total across 4 operational arrays
- `src/sections/leadership/LeadershipGovernance.tsx` - Placeholder showing total across CXO, board, promoter, auditor arrays
- `src/sections/competitive/CompetitiveMoves.tsx` - Placeholder showing total across 5 competitive arrays
- `src/sections/deep-dive/SubSectorDeepDive.tsx` - Placeholder showing sub-sector name and cost item count
- `src/sections/action-lens/ActionLens.tsx` - Placeholder showing persona and takeaway count
- `src/sections/watchlist/Watchlist.tsx` - Placeholder showing total across 4 signal arrays
- `src/app/App.tsx` - Removed PlaceholderContent; added QueryClientProvider, ReactQueryDevtools, Suspense with lazySections routing
- `src/components/layout/AppShell.tsx` - Added FilterBar between TopBar and content, activated useFilterUrlSync
- `src/components/charts/ChartTooltip.tsx` - Fixed dataKey type for React key/node compatibility (Rule 1)
- `src/components/errors/SectionErrorFallback.tsx` - Fixed unknown error type guard (Rule 1)
- `src/data/mock/executive.ts` - Fixed string literal with nested quotes (Rule 1)
- `src/hooks/use-filtered-data.ts` - Fixed union type assertion for useQuery overloads (Rule 3)

## Decisions Made

- **QueryClientProvider at app root above BrowserRouter** -- Prevents "No QueryClient set" errors on navigation. TanStack Query context must wrap the entire component tree including the router (per RESEARCH.md pitfall 5).
- **export default function for all section components** -- React.lazy requires default exports. Named exports would cause "Element type is invalid" runtime errors (per RESEARCH.md pitfall 3).
- **Radix Popover + Checkbox for CompanyPicker** -- Radix Select does not support multiple selection natively (GitHub issue #1270). Popover + Checkbox provides accessible multi-select with keyboard navigation.
- **Section-specific record counting in placeholders** -- Each section counts records differently based on its data shape (bullets for executive, companies for financial, totals across arrays for operations). Proves the full filtering pipeline is working correctly.
- **Conditional Reset button** -- Only visible when filters differ from DEFAULT_FILTERS. Keeps the compact bar clean when no filters are active.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed executive.ts string literal with nested quotes**
- **Found during:** Task 2 (Build verification)
- **Issue:** Line 58 contained `(?"Climate Technologies)` which terminated the string literal due to `?"` sequence
- **Fix:** Changed to single-quoted string with escaped double quotes: `'International subsidiary ("Climate Technologies") ...'`
- **Files modified:** src/data/mock/executive.ts
- **Verification:** `npm run build` passes
- **Committed in:** cea3f5c (Task 2 commit)

**2. [Rule 1 - Bug] Fixed ChartTooltip dataKey type for React compatibility**
- **Found during:** Task 2 (Build verification -- `tsc -b` stricter than `tsc --noEmit`)
- **Issue:** Recharts `Payload.dataKey` can be a function, which is not valid as React key or ReactNode
- **Fix:** Wrapped dataKey references with `String()` cast for key prop and display
- **Files modified:** src/components/charts/ChartTooltip.tsx
- **Verification:** `npm run build` passes
- **Committed in:** cea3f5c (Task 2 commit)

**3. [Rule 1 - Bug] Fixed SectionErrorFallback unknown error type**
- **Found during:** Task 2 (Build verification)
- **Issue:** `error` parameter from FallbackProps is typed as `unknown`, accessing `.message` directly fails under strict mode
- **Fix:** Added instanceof Error type guard with fallback message
- **Files modified:** src/components/errors/SectionErrorFallback.tsx
- **Verification:** `npm run build` passes
- **Committed in:** cea3f5c (Task 2 commit)

**4. [Rule 3 - Blocking] Fixed useFilteredData union type for useQuery overloads**
- **Found during:** Task 2 (Build verification)
- **Issue:** `sectionQueries[sectionId]()` returns union of 10 different queryOptions types; useQuery overload resolution fails on union
- **Fix:** Added `as any` type assertion with eslint-disable comment explaining rationale (each factory is individually type-safe)
- **Files modified:** src/hooks/use-filtered-data.ts
- **Verification:** `npm run build` passes, runtime behavior unchanged
- **Committed in:** cea3f5c (Task 2 commit)

---

**Total deviations:** 4 auto-fixed (3 bugs from Rule 1, 1 blocking from Rule 3)
**Impact on plan:** All auto-fixes were pre-existing issues exposed by stricter `tsc -b` build mode vs `tsc --noEmit`. No scope creep. Build now passes cleanly.

## Issues Encountered

- `npm run build` (which uses `tsc -b`) is stricter than `npx tsc --noEmit`. The build-mode TypeScript checks uncovered 4 pre-existing type issues from Phase 1 and Plan 02-01 that were not caught during those phases. All fixed inline.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 2 is fully complete: report shell with navigation, data fetching, caching, filtering, lazy loading, and URL sync all operational
- Content phases 3-9 can now replace placeholder section bodies with real UI -- the infrastructure is proven
- Each section component pattern is established: `useFilteredData<SectionDataType>(sectionId)` -> loading/error/data states -> section-specific rendering
- Filter controls update URL params and visible data simultaneously without API refetch (FOUND-14 verified)
- Code splitting produces separate chunks per section (FOUND-11 verified)
- All 21 existing tests pass, TypeScript compiles cleanly, Vite build succeeds

## Self-Check: PASSED

- All 15 created files verified present on disk
- All 6 modified files verified committed
- Commit 69e0650 (Task 1) verified in git log
- Commit cea3f5c (Task 2) verified in git log
- TypeScript compiles with zero errors (`npx tsc --noEmit` and `npm run build`)
- Vite build produces 20+ separate chunks (10 section + 10 data + shared)
- All 21 existing formatter tests pass

---
*Phase: 02-report-shell-and-data-layer*
*Completed: 2026-02-16*
