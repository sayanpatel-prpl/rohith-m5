---
phase: 04-section-group-b
plan: 04
subsystem: deep-dive-section
tags: [sub-sector, margin-levers, am-benchmarks, source-attribution]
dependency_graph:
  requires: [04-01]
  provides: [deep-dive-section-ui]
  affects: []
tech_stack:
  added: []
  patterns: [useFilteredData-hook, source-attribution, responsive-card-grid, branded-callout]
key_files:
  created:
    - dashboard_build_v2/src/sections/deep-dive/SubSectorCards.tsx
    - dashboard_build_v2/src/sections/deep-dive/MarginLeversTable.tsx
    - dashboard_build_v2/src/sections/deep-dive/AMBenchmarkCallout.tsx
  modified:
    - dashboard_build_v2/src/sections/deep-dive/index.tsx
decisions:
  - "Sub-sector sort order: AC, Kitchen, Electrical, EMS, Mixed, Cooler for logical grouping"
  - "MarginLeversTable uses HTML table with sub-sector badge pills matching operations section pattern"
  - "AMBenchmarkCallout uses color-mix(in oklch) for A&M branded background tint"
metrics:
  duration: 2min
  completed: 2026-02-21
---

# Phase 04 Plan 04: Sub-Sector Deep Dive Section Summary

Sub-sector breakdown cards with per-sector OPM quartiles, margin levers table with Sovrenn evidence, and A&M benchmark callouts with European/US case studies -- all with source attribution.

## What Was Built

### SubSectorCards.tsx (121 lines)

Responsive grid (1/2/3 columns) of sub-sector breakdown cards. Each card displays:
- Sub-sector label with company count badge
- 2x2 metrics grid: avg revenue growth (colored +/-), avg EBITDA margin, avg ROCE, OPM quartile range (P25/Med/P75)
- Top performer (green) and bottom performer (muted) labels
- SourceAttribution component in compact mode (SSDD-03)

Cards are sorted in logical order: AC, Kitchen, Electrical, EMS, Mixed, Cooler. Uses `formatPercent` from shared formatters for consistent sign display.

### MarginLeversTable.tsx (97 lines)

HTML table displaying 5 margin improvement levers with columns: Lever (title-cased from hyphenated IDs), Applicable Sub-Sectors (small badge pills), Potential Impact, Current Evidence (truncated to 150 chars), Active Companies (count + first 3 names with "+ N more" overflow).

Source attribution line below table: "Source: Sovrenn Intelligence growth triggers analysis | Tier 3" (SSDD-03).

### AMBenchmarkCallout.tsx (62 lines)

Two branded callout cards in responsive 1/2-column grid:
- Left accent border using `border-brand-primary`
- Background tint via `color-mix(in oklch, var(--color-brand-primary) 8%, transparent)` for A&M branding
- Title with geography badge pill
- Large metric highlight (e.g., "20%+" or "$150M") with label
- Detail paragraph and italic applicability note for Indian market context

### Section Index (87 lines)

Replaced placeholder stub with full section wired to `useFilteredData<DeepDiveData>("deep-dive")`. Layout:
1. Section header with subtitle
2. Sub-Sector Breakdown cards (SSDD-01, SSDD-03)
3. Margin Levers Analysis table (SSDD-01)
4. A&M Benchmark Comparisons callouts (SSDD-02)
5. Data freshness footer

Standard loading (SectionSkeleton variant="cards"), error, and empty states.

## Decisions Made

1. **Sub-sector sort order**: AC first, then Kitchen, Electrical, EMS, Mixed, Cooler. This follows product category importance for A&M consulting context rather than alphabetical.

2. **HTML table for margin levers**: Consistent with operations section table pattern. Uses sub-sector badge pills for compact multi-value display in the Applicable Sub-Sectors column.

3. **color-mix for A&M branding**: Native CSS `color-mix(in oklch)` applied via inline style for the benchmark callout background, matching the established pattern from AMServiceLineTag.

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

- TypeScript compilation: PASSED (zero errors for deep-dive/ files)
- Production build: PASSED (dist/index.html 1,525.40 kB, gzip 441.55 kB)
- SubSectorCards renders per-sub-sector metrics with OPM quartiles and source attribution
- MarginLeversTable shows levers with badge pills, evidence, and active company counts
- AMBenchmarkCallout renders 2 A&M branded cards with metric highlights
- All data displays have visible source attribution (SSDD-03)
- No mock data references -- all from adapter via useFilteredData hook

## Self-Check: PASSED
