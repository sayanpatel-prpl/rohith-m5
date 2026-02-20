---
phase: 02-priority-sections
plan: 03
subsystem: ui
tags: [react, tanstack-table, echarts, sparklines, am-triage, financial-table]

# Dependency graph
requires:
  - phase: 02-priority-sections/01
    provides: "FinancialData typed interface, FinancialCompanyRow, DerivedColumn, buildFinancialData() adapter with AM signal triage and sparkline extraction"
  - phase: 01-foundation
    provides: "BaseChart, DataTable, DataValue, SourceAttribution, formatINRCr/formatPercent, AM_ACTION_COLORS, echarts-core"
provides:
  - "Financial Performance section with sortable 15-company table, A&M Signal triage badges, inline sparklines, and derived intelligence columns"
  - "Sparkline component: inline 50x20 ECharts line chart for table cell embedding"
  - "AMSignalBadge component: color-coded triage pill (turnaround/CPI/TA/neutral) with tooltip"
  - "DerivedColumnsToggle component: show/hide button for Market Intelligence derived columns"
  - "FinancialTable component: standalone TanStack Table with 9 core + 3 derived columns, row click support"
affects: [02-04 financial-modal, 05-cross-cutting, 06-production-hardening]

# Tech tracking
tech-stack:
  added: []
  patterns: [standalone-table-with-row-click, inline-sparkline-chart, color-mix-triage-badge, derived-column-computation]

key-files:
  created:
    - dashboard_build_v2/src/sections/financial/Sparkline.tsx
    - dashboard_build_v2/src/sections/financial/AMSignalBadge.tsx
    - dashboard_build_v2/src/sections/financial/DerivedColumnsToggle.tsx
    - dashboard_build_v2/src/sections/financial/FinancialTable.tsx
  modified:
    - dashboard_build_v2/src/sections/financial/index.tsx
    - dashboard_build_v2/vite.config.ts

key-decisions:
  - "Standalone FinancialTable over DataTable wrapper: needed row click support for Plan 04 modal without modifying shared DataTable component"
  - "Derived values computed at render time: market share, pricing power (bps vs median), competitive intensity (inverse HHI) calculated in useMemo from company data"
  - "ColumnDef typed as any for mixed column arrays: TanStack Table v8 ColumnDef generics require `any` for arrays mixing accessor and display columns"
  - "Vite alias for echarts-for-react/core: fixed pre-existing subpath resolution failure for packages without exports field"

patterns-established:
  - "Inline sparkline: 50x20px BaseChart with no axes/tooltips, last-point dot marker, for table cell embedding"
  - "AM triage badge: color-mix(in oklch, color 12%, transparent) for tinted backgrounds matching AMServiceLineTag pattern"
  - "Derived column computation: compute market intelligence metrics from row data in useMemo, not in adapter"

# Metrics
duration: 5min
completed: 2026-02-21
---

# Phase 2 Plan 3: Financial Performance Section Summary

**Sortable financial table with A&M triage badges, inline sparklines, and toggleable derived intelligence columns (Market Share, Pricing Power, Competitive Intensity)**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-20T20:27:21Z
- **Completed:** 2026-02-20T20:32:17Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Financial Performance section replaces Phase 1 stub with full-featured sortable/filterable table showing all tracked companies
- A&M Signal column provides immediate triage classification with colored pill badges (Turnaround=red, CPI=amber, TA=green, Neutral=slate) and tooltip explanations
- Revenue and EBITDA% columns embed inline 50x20px sparkline charts showing 4-6 quarter trends
- "Show Market Intelligence" toggle reveals 3 derived competitive columns computed from the data: Market Share %, Pricing Power (bps), Competitive Intensity (inverse HHI)
- Row click handler stores selected company ID for the drill-down modal (Plan 04 ready)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Sparkline, AMSignalBadge, and DerivedColumnsToggle components** - `3a65813` (feat)
2. **Task 2: Build FinancialTable with sortable columns and assemble section** - `87861d1` (feat)

## Files Created/Modified
- `dashboard_build_v2/src/sections/financial/Sparkline.tsx` - Inline 50x20 line chart using BaseChart with minimal ECharts config
- `dashboard_build_v2/src/sections/financial/AMSignalBadge.tsx` - Colored triage pill with color-mix backgrounds and hover tooltip
- `dashboard_build_v2/src/sections/financial/DerivedColumnsToggle.tsx` - Toggle button for Market Intelligence derived columns
- `dashboard_build_v2/src/sections/financial/FinancialTable.tsx` - Standalone TanStack Table with 9+3 columns, sorting, filtering, row click
- `dashboard_build_v2/src/sections/financial/index.tsx` - Section assembly replacing Phase 1 stub
- `dashboard_build_v2/vite.config.ts` - Added resolve aliases for echarts-for-react subpath imports

## Decisions Made
- **Standalone FinancialTable over DataTable wrapper**: The existing DataTable component doesn't support row click handlers. Rather than modifying the shared component (which could impact other sections), FinancialTable uses TanStack Table directly with the same styling patterns but adds onClick support per row.
- **Derived values computed at render**: Market share (revenue / total revenue), pricing power (margin - median margin in bps), and competitive intensity (inverse HHI per sub-sector) are computed in the table component's useMemo, not in the adapter. This keeps the adapter focused on data extraction while the table handles presentation-layer computations.
- **ColumnDef typed as any**: TanStack Table v8's ColumnDef generic is strict about value types -- mixing accessor columns (typed values) with display columns (no accessor) in one array requires `any` for the value type parameter. This is the standard documented approach.
- **Vite alias for echarts-for-react subpaths**: echarts-for-react v3 lacks a package.json `exports` field, causing Vite/Rollup to fail resolving `/core` and `/lib/types` subpath imports. Added explicit resolve aliases in vite.config.ts pointing to the ESM builds.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TanStack Table ColumnDef type mismatch for mixed column arrays**
- **Found during:** Task 2 (FinancialTable.tsx)
- **Issue:** `columnHelper.display()` returns `DisplayColumnDef<T>` which TypeScript won't accept in an array inferred from `columnHelper.accessor()` calls (different generic value types)
- **Fix:** Explicitly typed the columns array as `ColumnDef<FinancialCompanyRow, any>[]` with eslint-disable comment
- **Files modified:** dashboard_build_v2/src/sections/financial/FinancialTable.tsx
- **Verification:** `npm run build` passes
- **Committed in:** 87861d1 (Task 2 commit)

**2. [Rule 3 - Blocking] Fixed pre-existing echarts-for-react subpath resolution in Vite**
- **Found during:** Task 2 (npm run build verification)
- **Issue:** `echarts-for-react/core` and `echarts-for-react/lib/types` imports fail in Vite Rollup because the package lacks an `exports` field in its package.json
- **Fix:** Added explicit resolve aliases in vite.config.ts mapping subpaths to the ESM build files
- **Files modified:** dashboard_build_v2/vite.config.ts
- **Verification:** `npm run build` produces 1,430 KB single-file output
- **Committed in:** 87861d1 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug fix, 1 blocking issue)
**Impact on plan:** Both fixes necessary for build success. The echarts fix resolves a pre-existing issue. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Financial Performance section fully renders with real data from the financial adapter
- Row click stores `selectedCompanyId` state ready for Plan 04's company drill-down modal
- DerivedColumnsToggle and derived value computation ready for cross-cutting intelligence features
- Build passes at 1,430 KB single-file output

## Self-Check: PASSED

All 6 files verified present. Both task commit hashes verified in git log (3a65813, 87861d1).

---
*Phase: 02-priority-sections*
*Completed: 2026-02-21*
