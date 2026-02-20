---
phase: 02-priority-sections
plan: 05
subsystem: ui
tags: [react, tailwind, watchlist, severity-indicators, stress-model, quadrant-layout]

# Dependency graph
requires:
  - phase: 02-priority-sections
    plan: 01
    provides: "WatchlistData typed interface, buildWatchlistData() adapter with 4-quadrant entries, StressModel thresholds"
  - phase: 01-foundation
    provides: "SectionSkeleton, SourceAttribution, AMServiceLineTag, Badge, useFilteredData hook, formatters, SectionData base type"
provides:
  - "Full Watchlist section with 4-quadrant layout (Stress, Fundraises, Inflection, Consolidation)"
  - "WatchlistEntryRow component with severity dots, service line tags, source attribution"
  - "QuadrantCard container with accent borders, sorted entries, empty states"
  - "StressModelInfo expandable panel with threshold definitions"
affects: [06-production-hardening, 05-cross-cutting]

# Tech tracking
tech-stack:
  added: []
  patterns: [quadrant-card-layout, severity-dot-indicator, expandable-info-panel, type-alias-for-name-conflict]

key-files:
  created:
    - dashboard_build_v2/src/sections/watchlist/WatchlistEntry.tsx
    - dashboard_build_v2/src/sections/watchlist/QuadrantCard.tsx
    - dashboard_build_v2/src/sections/watchlist/StressModelInfo.tsx
  modified:
    - dashboard_build_v2/src/sections/watchlist/index.tsx

key-decisions:
  - "Type alias WatchlistEntryData to avoid name collision with WatchlistEntryRow component"
  - "Text icons instead of emojis for quadrant headers (!! $ ~ +) per project convention"
  - "Accent color passed as prop to QuadrantCard rather than derived from title string"
  - "Severity dot colors via CSS custom properties with Tailwind arbitrary value syntax"

patterns-established:
  - "Type alias pattern: import type { X as XData } when component name collides with type name"
  - "Accent border via inline style on borderTopColor for CSS variable support"
  - "Severity dots: 5 fixed circles with conditional fill based on level thresholds"

# Metrics
duration: 2min
completed: 2026-02-21
---

# Phase 2 Plan 5: Watchlist Section Summary

**4-quadrant watchlist UI with severity dot indicators, stress model methodology panel, and A&M service line tags on every entry**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-20T20:27:28Z
- **Completed:** 2026-02-20T20:29:39Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- WatchlistEntryRow component rendering company name, signal text, detail, severity dots (1-5 scale with color thresholds), days-to-event badge, AMServiceLineTag pill, and compact SourceAttribution
- QuadrantCard container with color-coded top border accent (red/green/amber/blue), entry count badge, sorted entries by severity, and graceful empty state message
- StressModelInfo expandable panel with chevron toggle showing cash burn, debt maturity, revenue decline, and EBITDA P25 threshold definitions
- Full section index with 2x2 responsive grid, data freshness footer, news slot preservation, and loading/error states

## Task Commits

Each task was committed atomically:

1. **Task 1: Create watchlist sub-components** - `204eab7` (feat)
2. **Task 2: Assemble Watchlist section** - `3b2ccb6` (feat)

## Files Created/Modified
- `dashboard_build_v2/src/sections/watchlist/WatchlistEntry.tsx` - Single entry row with severity dots, company info, signal, service line tag, source attribution
- `dashboard_build_v2/src/sections/watchlist/QuadrantCard.tsx` - Quadrant card container with accent border, sorted entries, count badge, empty state
- `dashboard_build_v2/src/sections/watchlist/StressModelInfo.tsx` - Expandable panel explaining stress scoring model thresholds
- `dashboard_build_v2/src/sections/watchlist/index.tsx` - Full section replacing Phase 1 stub with 4-quadrant grid layout

## Decisions Made
- **Type alias for name collision**: Imported `WatchlistEntry` type as `WatchlistEntryData` to avoid collision with the `WatchlistEntryRow` component name. This keeps both the type and component clearly named.
- **Text icons over emojis**: Used plain text characters (`!!`, `$`, `~`, `+`) as quadrant icons per the project convention of no emojis in code.
- **Accent color as prop**: Passed `accentColor` as a string prop to QuadrantCard rather than deriving from title, keeping the component generic and avoiding fragile string matching.
- **CSS variable severity colors**: Used `bg-[var(--color-negative)]` Tailwind arbitrary value syntax for severity dot fills, ensuring theme consistency across light/dark modes.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Watchlist section fully renders 4 quadrants with real data from the watchlist adapter
- All entries display severity indicators, A&M service line tags, and source attribution
- Stress model methodology is documented in the expandable panel
- Section integrates with existing filter store via useFilteredData hook
- Ready for cross-cutting features in Phase 5 (A&M Value-Add, Talk vs Walk)

## Self-Check: PASSED

All 4 files verified present. Both task commit hashes (204eab7, 3b2ccb6) verified in git log.

---
*Phase: 02-priority-sections*
*Completed: 2026-02-21*
