---
phase: 01-foundation-and-architecture
plan: 02
subsystem: ui
tags: [typescript, vitest, discriminated-unions, intl-numberformat, recharts, css-custom-properties, formatters, ui-primitives, chart-wrappers]

# Dependency graph
requires:
  - phase: 01-01
    provides: Vite + React 19 + Tailwind v4 scaffold, brand theming system, React Router shell, tokens.css
provides:
  - Discriminated union SectionData type covering all 10 section JSON payloads
  - TypeScript data contracts for financial metrics, companies, and common types
  - 7 Indian financial formatter functions (INR Cr/Lakh/Auto, percent, bps, growth rate, Indian number)
  - 21 unit tests for all formatters via Vitest
  - 6 shared UI primitives (StatCard, TrendIndicator, PerformanceTag, SectionSkeleton, EditionBadge, DataRecencyTag)
  - 4 chart components (TrendLineChart, BarComparisonChart, ChartAnnotation helper, ChartTooltip)
  - Charts consume var(--color-chart-N) CSS custom properties for automatic tenant-aware theming
  - ReferenceDot annotation system for inline chart callouts via createAnnotation helper
affects: [02-report-shell, all-content-phases-3-through-9]

# Tech tracking
tech-stack:
  added: [vitest@4]
  patterns: [discriminated-union-on-section-field, module-scope-intl-numberformat, css-var-chart-theming, createAnnotation-helper-pattern, unicode-trend-arrows]

key-files:
  created:
    - src/types/common.ts
    - src/types/financial.ts
    - src/types/company.ts
    - src/types/sections.ts
    - src/lib/formatters.ts
    - src/lib/formatters.test.ts
    - src/components/ui/StatCard.tsx
    - src/components/ui/TrendIndicator.tsx
    - src/components/ui/PerformanceTag.tsx
    - src/components/ui/SectionSkeleton.tsx
    - src/components/ui/EditionBadge.tsx
    - src/components/ui/DataRecencyTag.tsx
    - src/components/charts/TrendLineChart.tsx
    - src/components/charts/BarComparisonChart.tsx
    - src/components/charts/ChartAnnotation.tsx
    - src/components/charts/ChartTooltip.tsx
    - vitest.config.ts
  modified:
    - package.json
    - src/components/layout/TopBar.tsx

key-decisions:
  - "Module-scope Intl.NumberFormat instances for performance -- constructed once, reused across all formatter calls"
  - "Separate indianIntegerFormatter (0 decimals) and indianNumberFormatter (2 decimals) for clean large vs small number display"
  - "createAnnotation as a config helper function (not a component) -- returns props to spread on ReferenceDot"
  - "Unicode characters for trend arrows (U+25B2 up, U+25BC down, U+25C6 flat) -- renders consistently across platforms"
  - "Bullet prefix (U+25CF) for DataRecencyTag instead of clock icon -- simpler, no icon dependency"

patterns-established:
  - "Pattern: Discriminated union on `section` field -- narrow SectionData via section === 'xyz' for type-safe field access"
  - "Pattern: formatINRAuto selects Cr/Lakh based on magnitude -- < 1 Cr shows in Lakh"
  - "Pattern: Chart colors always via var(--color-chart-N) prop -- NEVER hardcoded hex"
  - "Pattern: createAnnotation(key, x, y, label) returns ReferenceDot props for inline chart annotations"
  - "Pattern: ChartTooltip implements Recharts TooltipProps interface with brand CSS variables"
  - "Pattern: StatCard accepts pre-formatted value string -- formatting logic stays in caller, not in component"

# Metrics
duration: 5min
completed: 2026-02-15
---

# Phase 1 Plan 02: Types, Formatters, and UI Primitives Summary

**Discriminated union data contracts for 10 sections, 7 Indian financial formatters with 21 Vitest tests, 6 UI primitives, and 4 Recharts chart wrappers consuming CSS custom properties for tenant-aware theming**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-15T16:43:03Z
- **Completed:** 2026-02-15T16:47:45Z
- **Tasks:** 2
- **Files modified:** 19

## Accomplishments
- All 10 section data type interfaces defined with realistic field shapes -- discriminated union narrows on `section` field for type-safe payload access
- 7 Indian financial formatters using module-scope Intl.NumberFormat instances with 21 passing unit tests
- 6 shared UI primitives (StatCard, TrendIndicator, PerformanceTag, SectionSkeleton, EditionBadge, DataRecencyTag) with high-density styling and brand token consumption
- 4 chart components (TrendLineChart, BarComparisonChart, ChartAnnotation helper, ChartTooltip) using CSS custom property colors that auto-theme with tenant switch
- TopBar updated to use EditionBadge component instead of inline styled span

## Task Commits

Each task was committed atomically:

1. **Task 1: TypeScript data contracts and Indian financial formatters with tests** - `372eb0f` (feat)
2. **Task 2: Shared UI primitives and chart wrappers consuming brand tokens** - `e9d97dd` (feat)

## Files Created/Modified

- `vitest.config.ts` - Vitest config merging with vite.config.ts
- `package.json` - Added vitest dev dependency, test/test:watch scripts
- `src/types/common.ts` - TrendDirection, PerformanceLevel, ConfidenceLevel, ChartAnnotation, SectionId, DataRecency, TimeRange
- `src/types/financial.ts` - INRAmount, PercentageMetric, BasisPointsMetric, FinancialMetrics
- `src/types/company.ts` - Company and CompanyMetric interfaces
- `src/types/sections.ts` - All 10 section data interfaces with discriminated union SectionData type
- `src/lib/formatters.ts` - formatINRCr, formatINRLakh, formatINRAuto, formatPercent, formatBps, formatGrowthRate, formatIndianNumber
- `src/lib/formatters.test.ts` - 21 unit tests covering all formatter functions and edge cases
- `src/components/ui/StatCard.tsx` - Metric display card with label, formatted value, and optional trend
- `src/components/ui/TrendIndicator.tsx` - Directional arrow with semantic coloring (up=green, down=red, flat=neutral)
- `src/components/ui/PerformanceTag.tsx` - Color-coded badge with icon + label for outperform/inline/underperform
- `src/components/ui/SectionSkeleton.tsx` - Shimmer loading placeholders in 4 variants (table, chart, cards, mixed)
- `src/components/ui/EditionBadge.tsx` - Header pill badge showing "{edition} Edition" with brand accent
- `src/components/ui/DataRecencyTag.tsx` - Muted text tag showing "Data as of {dataAsOf}" with bullet prefix
- `src/components/charts/ChartTooltip.tsx` - Custom Recharts tooltip with Bloomberg-style overlay aesthetic
- `src/components/charts/ChartAnnotation.tsx` - createAnnotation helper returning ReferenceDot props
- `src/components/charts/TrendLineChart.tsx` - Recharts LineChart wrapper with CSS variable theming and annotation support
- `src/components/charts/BarComparisonChart.tsx` - Recharts BarChart wrapper with CSS variable theming, stacking, and annotation support
- `src/components/layout/TopBar.tsx` - Updated to import and use EditionBadge component

## Decisions Made

- **Module-scope Intl.NumberFormat instances** - Two separate formatters (integer and 2-decimal) at module scope for performance; avoids constructing expensive Intl objects inside render functions.
- **createAnnotation as helper function, not component** - Returns a props object to spread on ReferenceDot; keeps annotation rendering inside the parent chart component where Recharts expects it.
- **Unicode trend arrows** - U+25B2 (triangle up), U+25BC (triangle down), U+25C6 (diamond for flat); renders consistently across platforms without icon library dependency.
- **DataRecencyTag uses bullet prefix** - Simple filled circle (U+25CF) instead of a clock icon; avoids icon library dependency for a simple indicator.
- **StatCard accepts pre-formatted value** - The component does not call formatters itself; callers provide the formatted string. This keeps the component generic and testable.

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All TypeScript data contracts, formatters, UI primitives, and chart wrappers are ready
- Phase 1 (Foundation and Architecture) is now complete
- Phase 2 (Report Shell) can begin building on this foundation
- Content phases 3-9 can import types from src/types/sections.ts and use formatters + UI primitives directly

## Self-Check: PASSED

- All 19 created/modified files verified present on disk
- Commit 372eb0f (Task 1) verified in git log
- Commit e9d97dd (Task 2) verified in git log
- TypeScript compiles with zero errors (npx tsc --noEmit)
- All 21 Vitest tests pass (npx vitest run)

---
*Phase: 01-foundation-and-architecture*
*Completed: 2026-02-15*
