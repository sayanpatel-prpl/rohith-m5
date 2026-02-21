# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-20)

**Core value:** Every section answers "where's the BD opportunity?" — sourced signals that help A&M partners identify which companies need help, what kind, and when to reach out.
**Current focus:** Phase 4 - Section Group B

## Current Position

Phase: 4 of 6 (Section Group B)
Plan: 4 of 4 in current phase
Status: Phase Complete
Last activity: 2026-02-21 — Completed 04-04-PLAN.md (Sub-Sector Deep Dive Section)

Progress: [█████████████████░░░] 86% (19 of 22 plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 19
- Average duration: 4.42 min
- Total execution time: 1.40 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 6 | 25min | 4.17min |
| 02-priority-sections | 4 | 17min | 4.25min |
| 03-section-group-a | 4 | 18min | 4.50min |
| 04-section-group-b | 4 | 22min | 5.50min |

**Recent Trend:**
- Last 5 plans: 04-04 (2min), 04-03 (2min), 04-02 (2min), 04-01 (16min), 03-04 (5min)
- Trend: Fast execution for UI-only section plans after data layer established

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
- **Input costs from OPM delta** (03-02): No direct commodity price data; input cost trends inferred from sector OPM changes across quarters
- **Concall highlights field fallback** (03-02): JSON uses 'points' but type has 'keyPoints'; adapter handles both via index signature cast
- **A&M thought leadership static** (03-02): No live API; hardcoded with link to alvarezandmarsal.com insights page
- **BIS policy default entry** (03-02): Added as known active policy even if not found in data extraction
- **Governance risk from real shareholding** (03-04): Derived from Screener.in data; red at >5pp decline or <30% with decline, amber at >2pp or >3pp FII exit
- **Concall highlight field fallback** (03-04): JSON 'points' vs typed 'keyPoints'; runtime fallback with cast
- **Combined commit for v2 build** (03-04): Plan tasks designed for v1 enhancement; single atomic commit for v2 ground-up build
- **Quarterly results filtered from deals** (03-03): Sovrenn dealActivity entries tagged GOOD/POOR/EXCELLENT RESULTS are quarterly data, not real deals; filtered out
- **Deal-keyword gate for other type** (03-03): "other" entries only kept if description contains deal keywords (acquisition, invest, stake, land allotment, etc.)
- **AM angle from deal type+description** (03-03): acquisition->CDD/Integration, qip/fundraise->Valuation, land-allotment->CDD, rating->Valuation/Restructuring
- **5 pattern detectors** (03-03): Serial Acquisition, Capital Mobilization, Vertical Integration, International Expansion, Capacity Expansion with deal count thresholds
- **ConfidenceIcon = SourceConfidence** (04-01): Reused existing type alias for per-metric confidence indicators rather than defining a duplicate
- **5 diagnostic trigger rules** (04-01): OPM<5% (Operations), WC>120d (CPI), D/E>1.5 (Restructuring), ROCE<8% (CPI), RevGrowth<-10% (Restructuring)
- **Competitive moves from triggers+deals** (04-01): Growth triggers provide strategic intent; deal activity provides concrete actions; quarterly results filtered out
- **Quartile linear interpolation** (04-01): Standard P25/median/P75 computation for sub-sector breakdowns
- **Static A&M benchmarks** (04-01): 2 case studies (European White Goods 20%+ EBITDA, US Consumer Durables $150M EBITDA) for SSDD-02
- **Native HTML table over DataTable** (04-02): DataTable generic does not support per-cell confidence icons; used standard HTML table with custom sorting
- **Inline StatCard pattern** (04-02): Section-specific lightweight StatCard matching leadership section pattern for self-containment
- **group-hover MethodologyTooltip** (04-02): Reused Tailwind group/group-hover absolute positioning from Executive Snapshot for derived metric tooltips
- **color-mix for diagnostic triggers** (04-02): oklch color-mix for trigger severity badge backgrounds matching AMServiceLineTag pattern
- **Sub-sector sort order** (04-04): AC, Kitchen, Electrical, EMS, Mixed, Cooler for logical A&M consulting context grouping
- **HTML table for margin levers** (04-04): Consistent with operations section table pattern; sub-sector badge pills for compact multi-value display
- **color-mix for AM benchmark callout** (04-04): Native CSS color-mix(in oklch) via inline style for A&M branded background tint

### Pending Todos

None yet.

### Blockers/Concerns

**Timeline Risk**: Feb 21 presentation deadline requires aggressive execution. All phases must complete in sequence with no delays. Mitigation: Phase structure optimized for parallelization within each phase.

**Data Availability**: Some requirements reference data that may not exist in data_sources. Mitigation: Display "-" for unavailable data per strict requirements.

**News Data Refresh**: News data arrives Sunday morning (Feb 21) requiring zero-code-change integration. Mitigation: Phase 1 builds NewsItem interface and graceful degradation patterns.

## Session Continuity

Last session: 2026-02-21
Stopped at: Completed 04-04-PLAN.md (Sub-Sector Deep Dive Section) -- Phase 4 complete
Resume file: None
