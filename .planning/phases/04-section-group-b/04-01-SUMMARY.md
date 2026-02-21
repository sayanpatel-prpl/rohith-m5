---
phase: 04-section-group-b
plan: 01
subsystem: data-layer
tags: [types, adapters, operations, competitive, deep-dive]
dependency_graph:
  requires: [01-02, 01-05]
  provides: [operations-data, competitive-data, deep-dive-data]
  affects: [04-02, 04-03, 04-04]
tech_stack:
  added: []
  patterns: [adapter-pattern, diagnostic-triggers, intensity-matrix, quartile-stats]
key_files:
  created:
    - dashboard_build_v2/src/types/operations.ts
    - dashboard_build_v2/src/types/competitive.ts
    - dashboard_build_v2/src/types/deep-dive.ts
    - dashboard_build_v2/src/data/adapters/operations-adapter.ts
    - dashboard_build_v2/src/data/adapters/competitive-adapter.ts
    - dashboard_build_v2/src/data/adapters/deep-dive-adapter.ts
  modified:
    - dashboard_build_v2/src/api/queries.ts
decisions:
  - "ConfidenceIcon reuses SourceConfidence type alias for consistency"
  - "5 diagnostic trigger rules with threshold-based A&M service line mapping"
  - "Competitive moves from both growth triggers and deal activity (filtered quarterly results)"
  - "Quartile computation via linear interpolation for sub-sector breakdowns"
  - "2 static A&M benchmark case studies for SSDD-02"
metrics:
  duration: 16min
  completed: 2026-02-21
---

# Phase 04 Plan 01: Section Group B Data Layer Summary

Complete typed data layer for Operations, Competitive Landscape, and Sub-Sector Deep Dive sections with adapters wired into the query factory registry.

## What Was Built

### Type Definitions (3 files)

**operations.ts**: OperationsData extending SectionData with OpsMetricRow (9 numeric fields each with parallel ConfidenceIcon field), DiagnosticTrigger (A&M service line mapped), and OperationsSummaryStats.

**competitive.ts**: CompetitiveData with CompetitiveMove (8-value MoveType union), CompetitiveIntensityRow for heatmap visualization, and CompetitiveSummaryStats.

**deep-dive.ts**: DeepDiveData with SubSectorBreakdown (QuartileStats for OPM and revenue), MarginLever with real-data evidence, and AMBenchmark case studies.

### Data Adapters (3 files)

**operations-adapter.ts**: Builds OpsMetricRow for all 16 companies combining financial-api (revenue growth, EBITDA margin, working capital, D/E), consolidated (OPM from quarterly results, ratios for inventory/debtor/CCC days), and trendlyne (ROCE fallback). 5 diagnostic trigger rules scan for OPM<5%, Working Capital>120d, D/E>1.5, ROCE<8%, Revenue Growth<-10% with A&M service line mapping (Operations, CPI, Restructuring).

**competitive-adapter.ts**: Extracts competitive moves from Sovrenn growth triggers classified by regex into 8 MoveType categories, plus deal activity (acquisitions, land allotments). Builds intensity matrix for heatmap. Cross-links companies with operational implications (capacity-expansion, technology moves).

**deep-dive-adapter.ts**: Groups 16 companies by sub-sector, computes aggregate stats (avg revenue growth, EBITDA margin, ROCE, quartiles). 5 margin levers (premiumization, backward-integration, distribution-rationalization, vendor-consolidation, sku-rationalization) with evidence scanned from Sovrenn triggers. 2 static A&M benchmark case studies.

### Query Wiring

All 3 sections in queries.ts now call their dedicated adapter functions instead of the generic buildSectionData fallback. Only am-value-add and what-this-means still use the fallback.

## Decisions Made

1. **ConfidenceIcon = SourceConfidence**: Reused existing type alias ("verified" | "derived" | "estimated") rather than defining a duplicate, keeping the type system consistent.

2. **5 diagnostic trigger rules**: OPM<5% (Operations), Working Capital>120d (CPI), D/E>1.5 (Restructuring), ROCE<8% (CPI), Revenue Growth<-10% (Restructuring). Each maps to an A&M service line for actionable advisory targeting.

3. **Competitive moves from both triggers and deals**: Growth triggers provide strategic intent signals; deal activity provides concrete actions. Quarterly results filtered out same as deals-adapter.

4. **Quartile computation via linear interpolation**: Standard statistical method for P25/median/P75 computation across sub-sector companies.

5. **2 static A&M benchmarks**: European White Goods Restructuring (20%+ EBITDA margin uplift) and US Consumer Durables Turnaround ($150M EBITDA improvement) as reference case studies for SSDD-02.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed unused parameter in competitive-adapter.ts**
- **Found during:** Task 2
- **Issue:** TypeScript strict mode flagged `description` parameter in `getOperationalImplication()` as unused (TS6133)
- **Fix:** Prefixed with underscore (`_description`) to indicate intentionally unused parameter reserved for future expansion
- **Files modified:** `dashboard_build_v2/src/data/adapters/competitive-adapter.ts`
- **Commit:** 3c2a2ac

## Verification Results

- TypeScript compilation: PASSED (zero errors)
- Production build: PASSED (dist/index.html 1,503.78 kB, gzip 437.76 kB)
- All 3 type files export main interfaces
- All 3 adapters export build functions
- queries.ts references all 3 adapter build functions
- No buildSectionData calls for operations, competitive, or deep-dive
- No mock data references in adapters -- all from loaders

## Self-Check: PASSED

All 6 created files verified on disk. Both task commits (22b41d6, 3c2a2ac) verified in git log.
