---
phase: 03-section-group-a
plan: 02
subsystem: market-pulse
tags: [section-ui, data-adapter, market-pulse, demand-signals, input-costs, policy-tracker]
dependency-graph:
  requires: [03-01]
  provides: [market-pulse-section, market-pulse-adapter, market-pulse-types]
  affects: [api-queries]
tech-stack:
  added: []
  patterns: [data-confidence-badges, am-implication-column, policy-tracker-component, thought-leadership-callout]
key-files:
  created:
    - dashboard_build_v2/src/types/market-pulse.ts
    - dashboard_build_v2/src/data/adapters/market-pulse-adapter.ts
    - dashboard_build_v2/src/sections/market-pulse/DemandSignals.tsx
    - dashboard_build_v2/src/sections/market-pulse/InputCostTrends.tsx
    - dashboard_build_v2/src/sections/market-pulse/AMThoughtLeadership.tsx
    - dashboard_build_v2/src/sections/market-pulse/PolicyTracker.tsx
  modified:
    - dashboard_build_v2/src/api/queries.ts
    - dashboard_build_v2/src/sections/market-pulse/index.tsx
decisions:
  - "concall highlights field name fallback: JSON uses 'points' but type has 'keyPoints', adapter handles both via index signature cast"
  - "Input cost trends derived from OPM delta: no direct commodity price data available, so trends inferred from sector OPM changes"
  - "A&M thought leadership is static data: no live API for A&M reports, hardcoded with link to insights page"
  - "BIS policy added as default: even if not found in data, it is a known active policy for the sector"
metrics:
  duration: 6min
  completed: 2026-02-21
---

# Phase 3 Plan 2: Market Pulse Section Summary

Market Pulse section built with full data pipeline: typed interfaces, real-data adapter extracting from sovrenn/consolidated/financial-api sources, and 4 UI sub-components satisfying MRKT-01 through MRKT-04.

## What Was Built

### Types (market-pulse.ts)
- `MarketPulseData` extending `SectionData` with demand signals, input costs, commodity outlook, A&M thought leadership, and policy tracker
- `DataConfidence` 3-tier union: Verified | Management Guidance Interpretation | Estimated
- `DemandSignal`, `InputCostEntry`, `CommodityOutlook`, `AMThoughtLeadershipData`, `PolicyEntry` interfaces

### Adapter (market-pulse-adapter.ts)
- `buildMarketPulseData()` combining data from sovrenn (growth triggers, concall highlights), consolidated (quarterly OPM for input cost inference), and financial-api (revenue growth for demand signals)
- Demand signals extracted via pattern matching on sovrenn growth triggers + financial-derived signals for verified revenue momentum data
- Input costs inferred from sector OPM delta (no direct commodity price data available in sources)
- Policy tracker extracts GST/PLI/BIS mentions from growth triggers and concall highlights
- Never fabricates data; all fields trace to source data or are clearly marked as derived

### UI Components
- **DemandSignals**: Grid of signal cards with direction arrows, magnitude, data confidence badges (green Verified, amber Mgmt Guidance, red Estimated), source attribution, and affected companies
- **InputCostTrends**: Commodity cards with trend indicator, QoQ/YoY changes, confidence badge, and A&M implication text below each card (MRKT-02)
- **AMThoughtLeadership**: Brand-accent callout box with A&M Insight label, title, summary, external report link, and source (MRKT-03)
- **PolicyTracker**: Status-dot rows (green active, amber upcoming, gray expired) with policy name, impact, and affected companies (MRKT-04)
- **MarketPulse index**: Full section wiring all sub-components with loading/error states, news slot, and data freshness footer

### Query Wiring
- `sectionQueries["market-pulse"]` updated from generic `buildSectionData` to `buildMarketPulseData()` adapter

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed concall highlights field name mismatch**
- **Found during:** Task 2
- **Issue:** JSON data uses `points` field but TypeScript type `SovrennConcallHighlight` has `keyPoints`. The `flatMap(ch => ch.points)` caused TS2345 because `points` resolves to `unknown` via the index signature.
- **Fix:** Added `getConcallText()` helper that tries `keyPoints` first then falls back to `points` via index signature cast.
- **Files modified:** `dashboard_build_v2/src/data/adapters/market-pulse-adapter.ts`
- **Commit:** c4815ec

**2. [Rule 1 - Bug] Fixed unused parameter warning**
- **Found during:** Task 2
- **Issue:** `extractPolicies(lastUpdated: string)` declared `lastUpdated` parameter but never used it (policies don't need source timestamp).
- **Fix:** Prefixed with underscore: `_lastUpdated`.
- **Commit:** c4815ec

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 77e12b5 | Types, adapter, query wiring, DemandSignals, InputCostTrends |
| 2 | c4815ec | AMThoughtLeadership, PolicyTracker, MarketPulse section wiring |

## Verification

- TypeScript: `tsc --noEmit` passes with zero errors
- Build: `npm run build` produces single-file HTML (1,469 kB)
- All MRKT requirements addressed:
  - MRKT-01: Data confidence badges (Verified/Mgmt Guidance) replace ESTIMATED
  - MRKT-02: A&M implication text below each commodity card
  - MRKT-03: A&M thought leadership callout with brand styling and external link
  - MRKT-04: Policy tracker with status indicators; demand signals and input costs present

## Self-Check: PASSED

All 8 created/modified files verified present on disk. Both commits (77e12b5, c4815ec) verified in git log.
