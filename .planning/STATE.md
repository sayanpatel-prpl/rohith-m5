# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-20)

**Core value:** Every section answers "where's the BD opportunity?" — sourced signals that help A&M partners identify which companies need help, what kind, and when to reach out.
**Current focus:** Phase 3 - Section Group A

## Current Position

Phase: 3 of 6 (Section Group A)
Plan: 1 of 4 in current phase
Status: In Progress
Last activity: 2026-02-21 — Completed 03-01-PLAN.md (Type & Mock Data Extensions)

Progress: [██████████████████░░] 64% (14 of 22 plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 11
- Average duration: 3.82 min
- Total execution time: 0.70 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 6 | 25min | 4.17min |
| 02-priority-sections | 4 | 17min | 4.25min |
| 03-section-group-a | 1 | 4min | 4.00min |

**Recent Trend:**
- Last 5 plans: 03-01 (4min), 02-04 (6min), 02-02 (2min), 02-05 (2min), 02-01 (7min)
- Trend: Accelerating

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- **Roadmap Structure**: Optimized for TOMORROW deadline (Feb 21) by grouping sections into parallel execution phases to minimize context switching and maximize speed
- **Phase 1**: All global components and infrastructure built first to unblock parallel section development
- **Phase 2**: Priority sections (Executive, Financial, Watchlist) deliver highest BD value for A&M presentation
- **Phases 3-4**: Remaining sections grouped by data dependencies and thematic coherence
- **Phase 5**: Cross-cutting features (A&M Value-Add, Talk vs Walk) built after sections exist to cross-reference
- **Phase 6**: Production hardening validates all requirements before presentation
- **SectionId 11 members** (01-05): Added am-value-add and what-this-means vs v1's 10 sections
- **Source tier badge colors** (01-05): oklch values matching A&M action-type color approach (green T1, blue T2, amber T3, red T4)
- **Tokens aligned with v1** (01-05): Realigned scaffold tokens.css to match v1 brand colors, chart palette, and spacing
- **Company subSector typed** (01-05): Strict union of 6 categories (AC, Kitchen, Electrical, EMS, Mixed, Cooler)
- **ECharts v5 over v6** (01-01): Used ^5.5 for proven echarts-for-react v3 compatibility
- **VARIANT_MAP for company normalization** (01-01): 50+ variant mappings for cross-source ID normalization
- **Source registry pattern** (01-01): Known-source matching prevents filenames from leaking into UI
- **Inline style for tier colors** (01-03): var(--color-tier-X) via inline style for reliable rendering regardless of Tailwind v4 utility generation
- **color-mix for AM tints** (01-03): Native CSS color-mix(in oklch) for 10% tint backgrounds on service line tags
- **echarts-for-react/core** (01-03): Import from /core subpath to inject custom tree-shaken echarts instance
- **Generic DataTable** (01-03): <T> generic prop for type-safe column definitions across all section tables
- **buildSectionData placeholder** (01-02): Uses financial-api loader as closest to section shape; section adapters deferred to Phase 2
- **Company registry includes daikin/jch** (01-02): Included with inferred metadata despite absence from most data files
- **News loader cached empty array** (01-02): Ready for zero-code-change news JSON integration
- **Query factories for 11 sections** (01-02): Covers all SectionIds including am-value-add and what-this-means
- **lazySections typed as Record<SectionId>** (01-06): Compile-time completeness check ensures all 11 section IDs have lazy imports
- **Priority stubs wire useFilteredData** (01-06): Executive, financial, watchlist validate the full data pipeline end-to-end
- **SectionSkeleton variant per section** (01-06): Mixed for executive, table for financial, cards for watchlist
- **A&M as default tenant** (01-04): getBrandConfig falls back to amBrand, default redirect /am/report
- **No ReactQueryDevtools** (01-04): Production presentation build excludes devtools
- **Native HTML select for FilterBar** (01-04): Simpler than Radix for deadline, avoids extra bundle size
- **Theme toggle cycles** (01-04): light -> dark -> system single-button cycle
- **Cross-source CompanyDataBundle** (02-01): Bundle all 4 loader results per company ID for unified cross-referencing in adapters
- **Intelligence Grade from coverage** (02-01): Grade based on how many companies have 3+ source coverage (14+ = A, 10-13 = B+, etc.)
- **AM Signal triage thresholds** (02-01): turnaround at -10% rev or <3% margin, improvement below sector median, transaction for outperformers with low D/E
- **Dynamic P25 stress threshold** (02-01): 25th percentile EBITDA margin computed from actual data, not hardcoded
- **Narrative Risk detection** (02-01): Cross-reference Sovrenn quarterly tags vs actual profit growth for red/green disconnects
- **Fundraise multi-signal scoring** (02-01): Require 2+ of 4 indicators (capex, deal activity, promoter decline, cash decline) to avoid false positives
- **Type alias for name collision** (02-05): Import WatchlistEntry type as WatchlistEntryData to avoid collision with WatchlistEntryRow component
- **Text icons over emojis** (02-05): Used plain text characters for quadrant headers per project no-emoji convention
- **Accent color as prop** (02-05): Passed accentColor string to QuadrantCard rather than deriving from title
- **CSS variable severity colors** (02-05): Tailwind arbitrary value syntax bg-[var(--color-X)] for theme-consistent severity dots
- **CSS group-hover tooltip** (02-02): Rich multi-line tooltip for Intelligence Grade using Tailwind group/group-hover with absolute positioning
- **Severity dots pattern** (02-02): 5 filled/unfilled circles for red flag severity, compact and scannable
- **color-mix for severity tints** (02-02): Reused oklch color-mix pattern from AMServiceLineTag for severity background tints
- **Sort order for impact** (02-02): Red flags severity-descending, narrative risks red-first for immediate attention
- **Standalone FinancialTable** (02-03): Built standalone TanStack Table (not wrapping DataTable) to support row click for Plan 04 modal
- **Derived values at render** (02-03): Market share, pricing power, competitive intensity computed in table useMemo, not in adapter
- **Vite alias for echarts subpaths** (02-03): Fixed pre-existing echarts-for-react/core subpath resolution with vite.config.ts aliases
- **Native dialog element** (02-04): Used HTML <dialog> with showModal() API for company modal -- native Escape/focus with zero bundle cost
- **Sovrenn tag cross-referencing** (02-04): Compares quarterly result tags vs actual revenue growth for disconnect/stealth signal detection
- **Sector avg EBITDA ~10%** (02-04): Used as threshold for margin disconnect detection in Talk vs Walk
- **Signal-to-service-line mapping** (02-04): turnaround->Restructuring, improvement->CPI, transaction->Transaction Advisory, neutral->Operations
- **Phase 3 fields required not optional** (03-01): All new Phase 3 fields required (except policyTracker and seasonalPatterns) to ensure UI can rely on data presence
- **amAngle strict 5-value union** (03-01): CDD Opportunity | Integration Support | Carve-out Advisory | Valuation | Restructuring for compile-time safety
- **Traffic-light governance scoring** (03-01): red/amber/green with string[] factors array for flexible rendering
- **dataConfidence 3-tier system** (03-01): Verified | Management Guidance Interpretation | Estimated matching source reliability tiers

### Pending Todos

None yet.

### Blockers/Concerns

**Timeline Risk**: Feb 21 presentation deadline requires aggressive execution. All phases must complete in sequence with no delays. Mitigation: Phase structure optimized for parallelization within each phase.

**Data Availability**: Some requirements reference data that may not exist in data_sources. Mitigation: Display "-" for unavailable data per strict requirements.

**News Data Refresh**: News data arrives Sunday morning (Feb 21) requiring zero-code-change integration. Mitigation: Phase 1 builds NewsItem interface and graceful degradation patterns.

## Session Continuity

Last session: 2026-02-21
Stopped at: Completed 03-01-PLAN.md (Type & Mock Data Extensions)
Resume file: None
