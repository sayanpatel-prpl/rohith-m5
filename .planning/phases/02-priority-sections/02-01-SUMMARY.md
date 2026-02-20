---
phase: 02-priority-sections
plan: 01
subsystem: data-layer
tags: [typescript, adapters, tanstack-query, executive, financial, watchlist, am-triage]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "SectionData base type, loaders (consolidated, financial-api, sovrenn, trendlyne), company registry, query factories, SectionId union"
provides:
  - "ExecutiveData typed interface with IntelligenceGrade, AMOpportunitySummary, BigTheme, RedFlag, NarrativeRisk"
  - "FinancialData typed interface with FinancialCompanyRow, AMActionType signal triage, SparklineData, DerivedColumn"
  - "WatchlistData typed interface with 4-quadrant WatchlistEntry, StressModel thresholds"
  - "buildExecutiveData() adapter combining all 4 data sources"
  - "buildFinancialData() adapter with AM signal triage and sparkline extraction"
  - "buildWatchlistData() adapter with stress indicators, fundraise detection, margin inflection, consolidation targets"
  - "Updated queries.ts wiring 3 priority sections to dedicated adapters"
affects: [02-02 executive-section-ui, 02-03 financial-section-ui, 02-04 watchlist-section-ui, 05-cross-cutting]

# Tech tracking
tech-stack:
  added: []
  patterns: [adapter-pattern, cross-source-data-bundling, am-signal-triage, stress-threshold-model]

key-files:
  created:
    - dashboard_build_v2/src/types/executive.ts
    - dashboard_build_v2/src/types/financial.ts
    - dashboard_build_v2/src/types/watchlist.ts
    - dashboard_build_v2/src/data/adapters/executive-adapter.ts
    - dashboard_build_v2/src/data/adapters/financial-adapter.ts
    - dashboard_build_v2/src/data/adapters/watchlist-adapter.ts
  modified:
    - dashboard_build_v2/src/api/queries.ts

key-decisions:
  - "Cross-source CompanyDataBundle pattern: bundle all 4 loader results per company ID for unified access"
  - "Intelligence Grade from source coverage count: 14+ companies with 3+ sources = A grade"
  - "AM Signal triage thresholds: turnaround at -10% revenue or <3% margin, improvement below sector median, transaction for outperformers with low D/E"
  - "Stress P25 threshold: dynamic 25th percentile EBITDA margin computed from actual data"
  - "Narrative Risk detection: cross-reference Sovrenn quarterly tags vs actual profit growth"
  - "Fundraise detection: multi-signal scoring (capex triggers + deal activity + promoter decline + cash decline, need 2+ of 4)"

patterns-established:
  - "Adapter pattern: each section has build{Section}Data() returning typed SectionData extension"
  - "Cross-source bundling: collect all company IDs from all sources, create unified lookup bundles"
  - "Severity scoring: 1-5 scale with threshold-distance-based escalation"
  - "Source attribution: every data point traces back to SourceInfo with tier and confidence"

# Metrics
duration: 7min
completed: 2026-02-21
---

# Phase 2 Plan 1: Section Types & Data Adapters Summary

**Typed interfaces and cross-source data adapters for Executive, Financial, and Watchlist sections with A&M signal triage, stress model thresholds, and narrative risk detection**

## Performance

- **Duration:** 7 min
- **Started:** 2026-02-20T20:17:12Z
- **Completed:** 2026-02-20T20:23:52Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- Three typed section interfaces (ExecutiveData, FinancialData, WatchlistData) extending SectionData with full A&M advisory typing
- Executive adapter combining all 4 data sources: intelligence grade scoring, A&M opportunity summary with distress counting, big themes from Sovrenn triggers, red flags from financial thresholds, narrative risk detection comparing Sovrenn tags vs actual performance
- Financial adapter with A&M signal triage (turnaround/improvement/transaction/neutral), sparkline data extraction from last 6 quarters, derived competitive columns (market share, pricing power, competitive intensity)
- Watchlist adapter with 4-quadrant classification: stress indicators (cash burn, debt service, margin below P25, sustained revenue decline), likely fundraises (multi-signal scoring), margin inflection (trend reversal detection), consolidation targets (small cap + underperformance)
- Query layer wired to call dedicated adapters for 3 priority sections instead of generic fallback

## Task Commits

Each task was committed atomically:

1. **Task 1: Create section type definitions** - `2d9794d` (feat)
2. **Task 2: Create data adapters for all three sections** - `72fe748` (feat)
3. **Task 3: Wire adapters into query layer** - `3461127` (feat)

## Files Created/Modified
- `dashboard_build_v2/src/types/executive.ts` - ExecutiveData interface with IntelligenceGrade, AMOpportunitySummary, BigTheme, RedFlag, NarrativeRisk, ExecutiveCompanySnapshot
- `dashboard_build_v2/src/types/financial.ts` - FinancialData interface with FinancialCompanyRow, SparklineData, FinancialRowMetrics, DerivedColumn
- `dashboard_build_v2/src/types/watchlist.ts` - WatchlistData interface with WatchlistQuadrant, WatchlistEntry, StressModel, StressThresholds
- `dashboard_build_v2/src/data/adapters/executive-adapter.ts` - buildExecutiveData() combining consolidated + financial-api + sovrenn + trendlyne
- `dashboard_build_v2/src/data/adapters/financial-adapter.ts` - buildFinancialData() with AM signal triage and sparkline extraction
- `dashboard_build_v2/src/data/adapters/watchlist-adapter.ts` - buildWatchlistData() with 4-quadrant stress/fundraise/inflection/consolidation
- `dashboard_build_v2/src/api/queries.ts` - Updated to import and call section-specific adapters

## Decisions Made
- **Cross-source CompanyDataBundle pattern**: Rather than calling loaders independently per function, bundle all 4 loader results per company ID into a single lookup object. Enables efficient cross-referencing without repeated find() calls.
- **Intelligence Grade from coverage**: Chose source-coverage count as the grading metric (how many companies have 3+ data sources). With 14 companies all in 3+ sources, the current grade is high. This will self-adjust if data sources become incomplete.
- **AM Signal triage thresholds**: turnaround at -10% revenue OR (<3% margin AND negative growth), improvement below sector median margin, transaction for outperformers with D/E < 0.5. These align with standard A&M engagement criteria.
- **Dynamic P25 threshold**: The stress model computes the 25th percentile EBITDA margin from actual data rather than using a hardcoded value. This adapts automatically as the data updates.
- **Narrative Risk cross-referencing**: Compares Sovrenn quarterly "tag" (GOOD/EXCELLENT/WEAK/POOR) against actual YoY profit growth. Flags red disconnects (positive tag, negative reality) and green stealth signals (negative tag, positive reality).
- **Fundraise multi-signal scoring**: Requires 2+ of 4 indicators (capex triggers, fundraising deal activity, declining promoter holding, declining operating cash) to avoid false positives from single-signal detection.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed unused parameter TypeScript strict error**
- **Found during:** Task 2 (executive-adapter.ts)
- **Issue:** `lastUpdated` parameter in `computeOpportunitySummary` was declared but never used, causing `tsc -b` strict mode error TS6133
- **Fix:** Prefixed with underscore (`_lastUpdated`) to satisfy noUnusedParameters while keeping function signature consistent
- **Files modified:** dashboard_build_v2/src/data/adapters/executive-adapter.ts
- **Verification:** `npm run build` passes
- **Committed in:** 72fe748 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Trivial naming fix for TypeScript strict mode. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All three priority section data adapters produce typed, populated data from real JSON sources
- Query layer is wired and build passes (628KB output, up from 341KB due to full data source inclusion)
- Ready for Phase 2 Plans 2-4: UI component implementation for executive, financial, and watchlist sections
- Each UI component can call `useQuery(sectionQueries.executive())` and get fully typed ExecutiveData back

## Self-Check: PASSED

All 7 files verified present. All 3 task commit hashes verified in git log.

---
*Phase: 02-priority-sections*
*Completed: 2026-02-21*
