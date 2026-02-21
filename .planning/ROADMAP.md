# Roadmap: Kompete v2 — A&M Consumer Durables Intelligence Dashboard

## Overview

This roadmap delivers a consulting-grade intelligence dashboard for Alvarez & Marsal's Consumer Durables practice in time for the Feb 21 presentation deadline. The journey starts with foundation infrastructure (project setup, data layer, source attribution), then builds all 11 sections in parallel execution groups optimized for speed, and concludes with production hardening and validation. Every phase is designed to minimize context switching and maximize parallelization given the tight timeline.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Infrastructure** - Project setup, data layer, global components
- [x] **Phase 2: Priority Sections (Executive + Financial + Watchlist)** - Highest-value sections for presentation
- [x] **Phase 3: Section Group A (Market + Deals + Leadership)** - Market context and deal intelligence
- [x] **Phase 4: Section Group B (Operations + Competitive + Sub-Sector)** - Operational and competitive intelligence
- [x] **Phase 5: Cross-Cutting Features** - A&M Value-Add section, What This Means For section, Talk vs Walk
- [ ] **Phase 6: Production Hardening** - Validation, testing, presentation readiness

## Phase Details

### Phase 1: Foundation & Infrastructure
**Goal**: Establish working dashboard shell with data layer, global components, and source attribution system
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, SRCA-01, SRCA-02, SRCA-03, SRCA-04, SRCA-05, NEWS-01, NEWS-02, NEWS-03, NEWS-04, NEWS-05, NEWS-06, NEWS-07, AMTH-01, AMTH-02
**Success Criteria** (what must be TRUE):
  1. Dashboard builds successfully to single-file HTML output with dark mode support
  2. Data layer loads from data_sources directory with graceful degradation to mock data
  3. Source attribution component displays on all test sections with tier badges (T1-T4)
  4. Filter system persists state to URL and applies filters across sections
  5. Progress tracking files (PROGRESS.md, DECISIONS.md, DATA_CATALOG.md, SOURCE_REFERENCE.md) exist and are populated
**Plans:** 6 plans

Plans:
- [x] 01-01-PLAN.md — Project scaffolding and utility libraries
- [x] 01-05-PLAN.md — TypeScript type definitions and theme tokens
- [x] 01-02-PLAN.md — Data loaders, company registry, news API, state management, and data hooks
- [x] 01-03-PLAN.md — Source attribution, news credibility indicators, A&M service line tags, chart/table wrappers, UI primitives
- [x] 01-04-PLAN.md — App shell, routing, branding, layout components, and tracking files
- [x] 01-06-PLAN.md — Section stubs and lazy-loading registry

### Phase 2: Priority Sections (Executive + Financial + Watchlist)
**Goal**: Deliver the three highest-impact sections that answer "where's the BD opportunity?"
**Depends on**: Phase 1
**Requirements**: EXEC-01, EXEC-02, EXEC-03, EXEC-04, EXEC-05, FINP-01, FINP-02, FINP-03, FINP-04, FINP-05, FINP-06, WTCH-01, WTCH-02, WTCH-03, WTCH-04
**Success Criteria** (what must be TRUE):
  1. Executive Snapshot displays Intelligence Grade, A&M Opportunity Summary, and real-data Big Themes and Red Flags
  2. Financial Performance Tracker shows all 15 companies with A&M Signal triage, sparklines, and sortable/filterable metrics
  3. Company modal opens with financial details, Talk vs Walk tab, and A&M engagement suggestions
  4. Watchlist displays all 4 quadrants with stress scoring, severity indicators, and A&M service line tags
  5. All sections show only real data from data_sources or "-" for unavailable data (no mock-data classes)
**Plans:** 5 plans

Plans:
- [x] 02-01-PLAN.md — Section types, data adapters, and query wiring
- [x] 02-02-PLAN.md — Executive Snapshot section UI
- [x] 02-03-PLAN.md — Financial Performance table with sparklines and A&M Signal
- [x] 02-04-PLAN.md — Company Modal with Talk vs Walk and engagement suggestions
- [x] 02-05-PLAN.md — Watchlist & Forward Indicators with 4-quadrant layout

### Phase 3: Section Group A (Market + Deals + Leadership)
**Goal**: Add market context, deal intelligence, and governance insights
**Depends on**: Phase 2
**Requirements**: MRKT-01, MRKT-02, MRKT-03, MRKT-04, DEAL-01, DEAL-02, DEAL-03, LEAD-01, LEAD-02, LEAD-03
**Success Criteria** (what must be TRUE):
  1. Market Pulse displays verified demand signals, commodity outlook with A&M implications, and policy tracker
  2. Deals & Transactions section shows all deals with A&M Angle tags and pattern recognition summary
  3. Leadership & Governance section displays real leadership timeline and governance risk scoring per company
  4. All charts and tables in these sections have source attribution with tier badges
  5. News-dependent slots are structurally ready but show graceful empty states (no broken layouts)
**Plans:** 4 plans

Plans:
- [x] 03-01-PLAN.md — Type extensions and mock data enrichment for all 3 sections
- [x] 03-02-PLAN.md — Market Pulse UI enhancements (A&M implications, thought leadership, policy tracker)
- [x] 03-03-PLAN.md — Deals UI enhancements (A&M Angle badges, pattern summary card)
- [x] 03-04-PLAN.md — Leadership UI enhancements (governance risk scoring, promoter annotations)

### Phase 4: Section Group B (Operations + Competitive + Sub-Sector)
**Goal**: Complete operational intelligence, competitive moves, and sub-sector analysis
**Depends on**: Phase 3
**Requirements**: OPER-01, OPER-02, OPER-03, COMP-01, COMP-02, COMP-03, SSDD-01, SSDD-02, SSDD-03
**Success Criteria** (what must be TRUE):
  1. Operational Intelligence displays metrics table with per-cell confidence indicators and A&M diagnostic triggers
  2. Competitive Moves section populated from real data with Competitive Intensity Heatmap
  3. Sub-Sector Deep Dive shows margin levers analysis and A&M benchmark comparisons
  4. Cross-links work between Operational Intelligence and Competitive Moves sections
  5. All derived metrics (market share, pricing power, competitive intensity) have methodology tooltips
**Plans:** 4 plans

Plans:
- [x] 04-01-PLAN.md — Types, adapters, and query wiring for all 3 sections
- [x] 04-02-PLAN.md — Operational Intelligence section UI (metrics table, confidence icons, diagnostic triggers)
- [x] 04-03-PLAN.md — Competitive Moves section UI (intensity heatmap, move cards, cross-links)
- [x] 04-04-PLAN.md — Sub-Sector Deep Dive section UI (sub-sector cards, margin levers, A&M benchmarks)

### Phase 5: Cross-Cutting Features
**Goal**: Deliver A&M Value-Add section, What This Means For stakeholder insights, and Talk vs Walk verification
**Depends on**: Phase 4
**Requirements**: AMVA-01, AMVA-02, AMVA-03, AMVA-04, AMVA-05, WTMF-01, WTMF-02, WTMF-03, TVW-01, TVW-02, TVW-03, TVW-04, TVW-05, DRVI-01, DRVI-02, DRVI-03, DRVI-04, DRVI-05
**Success Criteria** (what must be TRUE):
  1. A&M Value-Add Opportunities section positioned at nav position 2 with pipeline/kanban layout
  2. All opportunities tagged by A&M practice area and auto-generated from cross-section data
  3. What This Means For section has all 4 tabs populated with cross-navigable insights
  4. Talk vs Walk verification surfaced in company modal, Executive Snapshot, and PE/Investors tab
  5. Derived intelligence metrics (market share, pricing power, competitive intensity) visible in appropriate sections
**Plans:** 4 plans

Plans:
- [x] 05-01-PLAN.md — Types, cross-referencing adapters, and query wiring for A&M Value-Add + What This Means For
- [x] 05-02-PLAN.md — A&M Value-Add section UI (pipeline/kanban layout)
- [x] 05-03-PLAN.md — What This Means For section UI (4 stakeholder tabs with cross-navigation)
- [x] 05-04-PLAN.md — Derived metrics visual distinction (DRVI-04) and ALTERNATIVE_DATA_SLOT comments (DRVI-05)

### Phase 6: Production Hardening
**Goal**: Validate all requirements, test presentation readiness, ensure demo-proof delivery
**Depends on**: Phase 5
**Requirements**: GLBL-01, GLBL-02, GLBL-03, GLBL-04
**Success Criteria** (what must be TRUE):
  1. All mock-data CSS classes removed across entire codebase
  2. Build tested with empty news JSON and empty alt-data with no broken layouts
  3. Every card, chart, and table displays source attribution with tier badge
  4. Navigation follows correct order with A&M Value-Add at position 2
  5. Single-file HTML build loads offline with all assets inlined and dark mode functional
**Plans:** 2 plans

Plans:
- [ ] 06-01-PLAN.md — Codebase audit and source attribution remediation (GLBL-01, GLBL-02, GLBL-04)
- [ ] 06-02-PLAN.md — Build validation, empty data resilience, and presentation readiness (GLBL-03)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Infrastructure | 6/6 | Complete | 2026-02-21 |
| 2. Priority Sections (Executive + Financial + Watchlist) | 5/5 | Complete | 2026-02-21 |
| 3. Section Group A (Market + Deals + Leadership) | 4/4 | Complete | 2026-02-21 |
| 4. Section Group B (Operations + Competitive + Sub-Sector) | 4/4 | Complete | 2026-02-21 |
| 5. Cross-Cutting Features | 4/4 | Complete | 2026-02-21 |
| 6. Production Hardening | 0/2 | Not started | - |
