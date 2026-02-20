# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-20)

**Core value:** Every section answers "where's the BD opportunity?" — sourced signals that help A&M partners identify which companies need help, what kind, and when to reach out.
**Current focus:** Phase 2 - Priority Sections

## Current Position

Phase: 2 of 6 (Priority Sections)
Plan: 1 of 5 in current phase
Status: In Progress
Last activity: 2026-02-21 — Completed 02-01-PLAN.md (Section Types & Data Adapters)

Progress: [███████████░░░░░░░░░] 32% (7 of 22 plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 7
- Average duration: 4.57 min
- Total execution time: 0.53 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 6 | 25min | 4.17min |
| 02-priority-sections | 1 | 7min | 7min |

**Recent Trend:**
- Last 5 plans: 02-01 (7min), 01-06 (3min), 01-04 (3min), 01-02 (4min), 01-03 (4min)
- Trend: Stable

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

### Pending Todos

None yet.

### Blockers/Concerns

**Timeline Risk**: Feb 21 presentation deadline requires aggressive execution. All phases must complete in sequence with no delays. Mitigation: Phase structure optimized for parallelization within each phase.

**Data Availability**: Some requirements reference data that may not exist in data_sources. Mitigation: Display "-" for unavailable data per strict requirements.

**News Data Refresh**: News data arrives Sunday morning (Feb 21) requiring zero-code-change integration. Mitigation: Phase 1 builds NewsItem interface and graceful degradation patterns.

## Session Continuity

Last session: 2026-02-21
Stopped at: Completed 02-01-PLAN.md (Section Types & Data Adapters)
Resume file: None
