---
phase: 05-cross-cutting-features
plan: 01
subsystem: data-adapters
tags: [cross-referencing, pipeline, stakeholder-insights, am-value-add, what-this-means, talk-vs-walk, typescript]

requires:
  - phase: 01-foundation
    provides: "Type system, section data interfaces, query factories"
  - phase: 02-priority-sections
    provides: "Executive, Financial, Watchlist adapters with cross-source data bundles"
  - phase: 03-section-group-a
    provides: "Deals, Market Pulse adapters with A&M angle tagging"
  - phase: 04-section-group-b
    provides: "Operations, Competitive, Deep Dive adapters with diagnostic triggers"
provides:
  - "AMValueAddData type with Opportunity pipeline (3 stages)"
  - "WhatThisMeansData type with StakeholderInsight for 4 tabs"
  - "TalkVsWalk standalone interface for management claim verification"
  - "buildAMValueAddData adapter cross-referencing 6 section adapters"
  - "buildWhatThisMeansData adapter cross-referencing 5 section adapters"
  - "All 11 query factories wired to dedicated adapters (no fallback)"
affects: [05-02-PLAN, 05-03-PLAN, 05-04-PLAN]

tech-stack:
  added: []
  patterns:
    - "Cross-referencing adapter pattern: import and call other build functions rather than re-reading raw loaders"
    - "Pipeline dedup by companyId+practiceArea with stage priority merge"
    - "Stakeholder tab insight generation from multi-section signals"

key-files:
  created:
    - dashboard_build_v2/src/types/am-value-add.ts
    - dashboard_build_v2/src/types/what-this-means.ts
    - dashboard_build_v2/src/types/talk-vs-walk.ts
    - dashboard_build_v2/src/data/adapters/am-value-add-adapter.ts
    - dashboard_build_v2/src/data/adapters/what-this-means-adapter.ts
  modified:
    - dashboard_build_v2/src/api/queries.ts

key-decisions:
  - "Cross-referencing adapters call other build functions not raw loaders for data consistency"
  - "Pipeline dedup merges keyDataPoints and keeps highest stage when same company+practiceArea"
  - "Estimated size uses 2% of latest revenue as fee proxy when market cap unavailable"
  - "buildSectionData fallback removed -- all 11 sections now use dedicated adapters"

patterns-established:
  - "Cross-section adapter: import buildXxxData() from sibling adapters to compose higher-order section data"
  - "Pipeline stage ordering: outreach-ready > qualified > identified for dedup priority"
  - "Section label mapping: SECTION_LABELS record for human-readable cross-navigation"

duration: 4min
completed: 2026-02-21
---

# Phase 5 Plan 1: Cross-Cutting Data Types & Adapters Summary

**3 type files + 2 cross-referencing adapters generating advisory pipeline and stakeholder insights from all existing section data**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-21T03:06:20Z
- **Completed:** 2026-02-21T03:10:23Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Created AMValueAddData types with PipelineStage, Opportunity, and PipelineSummary for advisory engagement tracking
- Created WhatThisMeansData types with StakeholderInsight and 4 StakeholderTab definitions
- Created TalkVsWalk standalone interface for management claim cross-verification
- Built am-value-add-adapter that scans executive, financial, deals, watchlist, operations, and competitive data to auto-generate pipeline opportunities
- Built what-this-means-adapter that generates insights for PE/Investors, Founders, COOs/CFOs, and Supply Chain Heads from 5 section adapters
- Updated queries.ts to wire both new adapters, removing the buildSectionData fallback entirely

## Task Commits

Each task was committed atomically:

1. **Task 1: Type definitions for both new sections + TalkVsWalk standalone** - `a4a7c46` (feat)
2. **Task 2: Cross-referencing adapters for both new sections + query wiring** - `f7299c5` (feat)

## Files Created/Modified
- `dashboard_build_v2/src/types/am-value-add.ts` - AMValueAddData, Opportunity, PipelineStage, PipelineSummary types
- `dashboard_build_v2/src/types/what-this-means.ts` - WhatThisMeansData, StakeholderInsight, StakeholderTab types
- `dashboard_build_v2/src/types/talk-vs-walk.ts` - TalkVsWalk standalone interface per TVW-01
- `dashboard_build_v2/src/data/adapters/am-value-add-adapter.ts` - Cross-referencing adapter scanning 6 sections for advisory opportunities
- `dashboard_build_v2/src/data/adapters/what-this-means-adapter.ts` - Cross-referencing adapter generating insights for 4 stakeholder tabs
- `dashboard_build_v2/src/api/queries.ts` - Wired both new adapters, removed buildSectionData fallback

## Decisions Made
- Cross-referencing adapters call sibling build functions rather than re-reading raw data loaders, ensuring consistent data transformations
- Pipeline dedup merges keyDataPoints and keeps the highest pipeline stage when the same companyId+practiceArea appears from multiple sections
- Estimated engagement size uses 2% of latest quarterly revenue as a fee proxy when direct market cap is unavailable from the adapter
- Removed the buildSectionData fallback function since all 11 sections now have dedicated adapters

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- AMValueAddData and WhatThisMeansData are available via useFilteredData("am-value-add") and useFilteredData("what-this-means")
- Plans 05-02 and 05-03 can build UI sections consuming these typed data payloads
- TalkVsWalk type is ready for Plan 05-04 to consume

## Self-Check: PASSED

All 6 files verified present. Both commit hashes (a4a7c46, f7299c5) found in git log.

---
*Phase: 05-cross-cutting-features*
*Completed: 2026-02-21*
