---
phase: 08-forward-looking-signals
plan: 01
subsystem: ui
tags: [react, radix-tabs, radix-collapsible, watchlist, forward-indicators, confidence-badge, severity-badge]

# Dependency graph
requires:
  - phase: 02-report-shell
    provides: Section lazy-loading, FilterBar, useFilteredData hook, StatCard, ConfidenceBadge
provides:
  - Watchlist & Forward Indicators section with 4 signal categories
  - Tabbed navigation across fundraise, margin inflection, consolidation, and stress signals
  - Severity badge config-record pattern for stress indicators
  - Expandable detail cards via Radix Collapsible
affects: [09-export-and-meeting-prep]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Severity badge config-record pattern (critical/warning/watch) for stress indicators"
    - "Forward signal cards with confidence badges and expandable Radix Collapsible details"
    - "Display names (not company IDs) for AI-generated signals -- not company-filterable"

key-files:
  created:
    - src/sections/watchlist/WatchlistSummaryStats.tsx
    - src/sections/watchlist/FundraiseSignals.tsx
    - src/sections/watchlist/MarginInflection.tsx
    - src/sections/watchlist/ConsolidationTargets.tsx
    - src/sections/watchlist/StressIndicators.tsx
  modified:
    - src/sections/watchlist/Watchlist.tsx

key-decisions:
  - "Severity badge config-record pattern for StressIndicators matching ConfidenceBadge approach (critical=negative, warning=brand-accent, watch=neutral)"
  - "Display company names (not IDs) for forward signals -- AI-generated predictions not filterable by company"
  - "TabTrigger helper with count badges following CompetitiveMoves pattern (brand-primary active state)"

patterns-established:
  - "Severity config-record: critical/warning/watch badge + left border coloring for stress visualization"
  - "Forward signal card layout: company + badge header, signal text, expandable details"

# Metrics
duration: 2min
completed: 2026-02-16
---

# Phase 8 Plan 01: Watchlist & Forward Indicators Summary

**90-day predictive intelligence section with 4 tabbed signal categories -- fundraise signals, margin inflection, consolidation targets, and stress indicators with severity badges and expandable details**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-16T06:07:19Z
- **Completed:** 2026-02-16T06:09:17Z
- **Tasks:** 1
- **Files modified:** 6

## Accomplishments
- Replaced Phase 2 placeholder with full Watchlist & Forward Indicators section
- 4-column StatCard summary grid showing counts per signal category
- Radix Tabs navigation filtering between All, Fundraise, Margin Inflection, Consolidation, and Stress
- Fundraise signals with ConfidenceBadge, timeframe display, and Radix Collapsible expandable details
- Margin inflection candidates with current vs projected margin, improvement calculation, and green positive text
- Consolidation targets with rationale and likely acquirer pills
- Stress indicators with severity badges (critical/warning/watch), left border coloring, and expandable details

## Task Commits

Each task was committed atomically:

1. **Task 1: Build Watchlist section with 4 signal categories in tabbed layout** - `674b6ea` (feat)

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified
- `src/sections/watchlist/Watchlist.tsx` - Main orchestrator with Radix Tabs, TabTrigger helper, and header
- `src/sections/watchlist/WatchlistSummaryStats.tsx` - 4-column StatCard grid for signal counts
- `src/sections/watchlist/FundraiseSignals.tsx` - Fundraise signal cards with confidence, timeframe, and Collapsible details
- `src/sections/watchlist/MarginInflection.tsx` - Margin inflection cards with current vs projected margin display
- `src/sections/watchlist/ConsolidationTargets.tsx` - Consolidation target cards with acquirer pills
- `src/sections/watchlist/StressIndicators.tsx` - Stress indicator cards with severity badges and left border coloring

## Decisions Made
- Severity badge config-record pattern for StressIndicators: critical = negative colors, warning = brand-accent, watch = neutral -- matches ConfidenceBadge approach but with different semantic levels
- Display company names (not IDs) for forward signals -- these are AI-generated 90-day predictions, not company-filterable data
- TabTrigger helper with optional count badges following CompetitiveMoves pattern with brand-primary active state

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Watchlist section complete, all 4 signal categories rendering with WTCH-01 through WTCH-04 satisfied
- Ready for Phase 7 (AI-Powered Intelligence), Phase 9 (Export), or any remaining independent phase

## Self-Check: PASSED

All 6 files verified present:
- FOUND: src/sections/watchlist/Watchlist.tsx (121 lines, min 40)
- FOUND: src/sections/watchlist/WatchlistSummaryStats.tsx (29 lines, min 15)
- FOUND: src/sections/watchlist/FundraiseSignals.tsx (58 lines, min 25)
- FOUND: src/sections/watchlist/MarginInflection.tsx (54 lines, min 25)
- FOUND: src/sections/watchlist/ConsolidationTargets.tsx (43 lines, min 25)
- FOUND: src/sections/watchlist/StressIndicators.tsx (84 lines, min 25)

Commit verified: 674b6ea (feat 08-01)
TypeScript: npx tsc --noEmit passed with zero errors

---
*Phase: 08-forward-looking-signals*
*Completed: 2026-02-16*
