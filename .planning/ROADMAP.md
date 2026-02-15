# Roadmap: Industry Landscape Intelligence

## Overview

This roadmap delivers an AI-driven interactive industry intelligence report for Indian Consumer Durables mid-market, built as a multi-tenant SaaS product for consulting firms. The journey moves from architectural foundation (branding, types, formatters) through the report shell and data layer, into 10 content modules grouped by natural dependency order, then layers on AI-powered intelligence and predictive signals, and culminates with export and meeting prep tools. Every phase delivers a coherent, verifiable capability that consulting partners can observe.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation and Architecture** - Multi-tenant scaffold with branding, types, formatters, and shared UI primitives
- [ ] **Phase 2: Report Shell and Data Layer** - Navigation, API client, filter store, and section rendering infrastructure
- [ ] **Phase 3: Core Financial Intelligence** - Executive Snapshot landing page and Financial Performance Tracker
- [ ] **Phase 4: Deal Flow and Leadership Signals** - Deals & Transactions tracker and Leadership & Governance watch
- [ ] **Phase 5: Market Context and Operations** - Market Pulse macro view and Operational Intelligence signals
- [ ] **Phase 6: Competitive Landscape and Sub-Sector Analysis** - Competitive Moves tracker and Sub-Sector Deep Dive
- [ ] **Phase 7: AI-Powered Intelligence** - BD Signal Scoring, Engagement Classification, Action Lens persona views
- [ ] **Phase 8: Forward-Looking Signals** - Watchlist with 90-day predictive indicators
- [ ] **Phase 9: Export and Meeting Prep** - PDF, CSV, PowerPoint export and 1-click Meeting Prep Brief

## Phase Details

### Phase 1: Foundation and Architecture
**Goal**: The multi-tenant application scaffold exists with branding, type contracts, formatting utilities, and shared UI primitives -- so that every subsequent module builds on proven, brand-aware infrastructure
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07, FOUND-08, BRND-01, BRND-02, BRND-03, BRND-04
**Success Criteria** (what must be TRUE):
  1. User navigating to a tenant URL (e.g., /bcg/report) sees that firm's logo, color palette, and typography applied across all visible UI elements
  2. Switching the tenant URL slug changes all branding (header, chart colors, typography) without a page reload
  3. Shared UI primitives (StatCard, TrendIndicator, PerformanceTag) render with brand tokens and display formatted Indian financial numbers (INR Cr/Lakh, percentages, basis points)
  4. Chart wrappers (TrendLineChart, BarComparisonChart) render using the active tenant's brand colors from CSS custom properties
  5. An error in one section displays a section-level error boundary message without crashing the rest of the application
**Plans**: TBD

Plans:
- [ ] 01-01: Project scaffold, routing, and multi-tenant BrandProvider
- [ ] 01-02: TypeScript data contracts, formatters, shared UI primitives, and chart wrappers

### Phase 2: Report Shell and Data Layer
**Goal**: The report container is operational with section navigation, data fetching, client-side filtering, and lazy-loaded section rendering -- so that content modules can plug in and receive typed, filtered data
**Depends on**: Phase 1
**Requirements**: FOUND-09, FOUND-10, FOUND-11, FOUND-12, FOUND-13, FOUND-14
**Success Criteria** (what must be TRUE):
  1. Report shell displays a sidebar with navigation across 10 section names, with the active section visually indicated
  2. Clicking a section in the sidebar lazy-loads only that section's code (visible in network tab: no upfront bundle for inactive sections)
  3. FilterBar lets user select companies (multi-select), sub-category, performance tier, and time period -- and filter changes update visible data without triggering new API requests
  4. API client fetches typed JSON from the backend with TanStack Query caching (repeat navigation to a section does not re-fetch)
**Plans**: TBD

Plans:
- [ ] 02-01: API client, TanStack Query integration, and Zustand filter store
- [ ] 02-02: Report shell layout, section navigation sidebar, SectionRenderer with lazy loading, and FilterBar UI

### Phase 3: Core Financial Intelligence
**Goal**: Users land on an AI-generated executive briefing and can drill into standardized financial performance data for 15-20 Consumer Durables companies -- the intelligence foundation that all other modules build upon
**Depends on**: Phase 2
**Requirements**: EXEC-01, EXEC-02, EXEC-03, EXEC-04, FINP-01, FINP-02, FINP-03, FINP-04, FINP-05, FINP-06, FINP-07
**Success Criteria** (what must be TRUE):
  1. Executive Snapshot displays the month's 5-bullet summary, red flags with AI confidence scores, a data recency indicator, and AI narrative explaining BD relevance of each theme
  2. Financial Performance Tracker shows a sortable, filterable metrics table for 15-20 companies with revenue growth, EBITDA margin, working capital days, ROCE, and debt/equity -- each tagged as outperform/inline/underperform
  3. User can select 2-5 companies for side-by-side metric comparison with time-series QoQ and YoY trend charts
  4. Every financial metric displays source attribution (e.g., "BSE filing Q3 FY25") and AI variance analysis narrative explaining what changed and why
**Plans**: TBD

Plans:
- [ ] 03-01: Executive Snapshot module (monthly summary, red flags, AI narratives)
- [ ] 03-02: Financial Performance Tracker (metrics table, comparison view, trend charts, variance analysis)

### Phase 4: Deal Flow and Leadership Signals
**Goal**: Users can track money movements (M&A, PE/VC, IPOs, distressed assets) and leadership changes (CXO, board, promoter stakes, auditor flags) -- the event-based signals that directly trigger BD outreach
**Depends on**: Phase 2
**Requirements**: DEAL-01, DEAL-02, DEAL-03, DEAL-04, DEAL-05, DEAL-06, LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05
**Success Criteria** (what must be TRUE):
  1. Deals section displays M&A transactions, PE/VC investments, IPO filings, and distressed asset activity -- each with relevant details (parties, values, rationale) and a chronological timeline visualization
  2. AI pattern recognition highlights deal clusters and recurring investor themes across the displayed transactions
  3. Leadership section displays CXO changes, board reshuffles, promoter stake changes (with trend direction), and auditor resignation flags
  4. AI risk flags appear on governance events that signal company stress or BD opportunity
**Plans**: TBD

Plans:
- [ ] 04-01: Deals & Transactions module (M&A, PE/VC, IPO, distressed assets, timeline, AI patterns)
- [ ] 04-02: Leadership & Governance module (CXO changes, board, promoter stakes, auditor flags, AI risk flags)

### Phase 5: Market Context and Operations
**Goal**: Users see both the macro industry context (demand, costs, margins, channels) and micro operational signals (supply chain, capacity, procurement, retail footprint) -- framing what is happening in the sector and inside individual companies
**Depends on**: Phase 2
**Requirements**: MRKT-01, MRKT-02, MRKT-03, MRKT-04, OPER-01, OPER-02, OPER-03, OPER-04
**Success Criteria** (what must be TRUE):
  1. Market Pulse displays demand signals with trend direction, input cost trends (steel, copper, plastics) with QoQ/YoY movement, margin outlook with visual trend indicators, and channel mix shifts with percentage breakdown
  2. Operational Intelligence displays supply chain signals, manufacturing capacity changes (expansions, closures, utilization), procurement shifts, and retail expansion/rationalization data
  3. Both modules respond to the global company and time period filters from Phase 2
**Plans**: TBD

Plans:
- [ ] 05-01: Market Pulse module (demand signals, input costs, margin outlook, channel mix)
- [ ] 05-02: Operational Intelligence module (supply chain, manufacturing, procurement, retail footprint)

### Phase 6: Competitive Landscape and Sub-Sector Analysis
**Goal**: Users see competitive strategic moves across the sector and can deep-dive into rotating monthly sub-segment analysis with cost structure benchmarks -- the analytical layer that reveals competitive positioning and margin drivers
**Depends on**: Phase 3 (needs financial data context)
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, SSDD-01, SSDD-02, SSDD-03, SSDD-04
**Success Criteria** (what must be TRUE):
  1. Competitive Moves displays product launches, pricing actions, D2C initiatives, and quick commerce partnerships across the sector
  2. Cluster analysis groups companies by competitive strategy (cost leader vs premium vs niche) with visual representation
  3. Sub-Sector Deep Dive shows a rotating monthly deep dive into one sub-segment (AC, refrigerator, washing machine, etc.) with cost structure benchmarks comparing COGS breakdown across companies
  4. Margin levers analysis and top-quartile analysis identify what drives profitability differences and what best performers do differently
**Plans**: TBD

Plans:
- [ ] 06-01: Competitive Moves module (launches, pricing, D2C, partnerships, cluster analysis)
- [ ] 06-02: Sub-Sector Deep Dive module (rotating deep dive, cost benchmarks, margin levers, top-quartile)

### Phase 7: AI-Powered Intelligence
**Goal**: The platform transforms raw data into consulting-grade BD intelligence -- scoring companies on "needs help" signals, classifying engagement opportunities by service line, and tailoring interpretations for different personas
**Depends on**: Phases 3, 4, 5, 6 (synthesizes across all content modules)
**Requirements**: AINL-01, AINL-02, AINL-03, ACTN-01, ACTN-02, ACTN-03
**Success Criteria** (what must be TRUE):
  1. Each company displays a composite BD Signal Score derived from financial stress, leadership changes, and operational disruption -- with score breakdown visible
  2. Each signal is tagged with a likely consulting service line (Turnaround, Growth Strategy, Cost Optimization, M&A Advisory)
  3. AI confidence scores (high/medium/low with reasoning) appear on all AI-generated insights across the platform
  4. User can switch between persona views (PE/Investors, Founders, COOs/CFOs, Procurement Heads) and each view tailors data interpretation with actionable, persona-specific takeaways
**Plans**: TBD

Plans:
- [ ] 07-01: BD Signal Scoring and Engagement Opportunity Classification
- [ ] 07-02: Action Lens module (persona switching, tailored interpretations, AI takeaways)

### Phase 8: Forward-Looking Signals
**Goal**: Users see 90-day predictive intelligence -- which companies are likely to fundraise, hit margin inflection points, become acquisition targets, or show compounding stress signals
**Depends on**: Phases 3, 4, 5 (needs financial, leadership, and operational data for predictions)
**Requirements**: WTCH-01, WTCH-02, WTCH-03, WTCH-04
**Success Criteria** (what must be TRUE):
  1. User sees forward-looking signals for likely fundraises based on financial trajectory analysis
  2. User sees margin inflection candidates -- companies approaching profitability turning points with supporting evidence
  3. User sees consolidation targets -- companies likely to be acquired based on market position combined with financial stress
  4. User sees stress indicators -- companies showing multiple simultaneous distress signals with composite view
**Plans**: TBD

Plans:
- [ ] 08-01: Watchlist & Forward Indicators module (fundraise signals, margin inflection, consolidation targets, stress indicators)

### Phase 9: Export and Meeting Prep
**Goal**: Users can take intelligence out of the platform into meetings and presentations -- as PDFs, CSVs, PowerPoint slides, and structured 1-click company briefs
**Depends on**: Phases 3-8 (exports require stable content modules)
**Requirements**: EXPT-01, EXPT-02, EXPT-03, EXPT-04
**Success Criteria** (what must be TRUE):
  1. User can export the full report or selected sections as a PDF with print-optimized layout preserving brand identity
  2. User can export any data table as a CSV file
  3. Meeting Prep Brief generates a structured 1-page company brief pulling key data from all modules with one click
  4. User can export report sections as branded PowerPoint slides
**Plans**: TBD

Plans:
- [ ] 09-01: PDF and CSV export (print layout, section selection, data table export)
- [ ] 09-02: Meeting Prep Brief generator and PowerPoint slide export

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9

Note: Phases 3, 4, and 5 depend only on Phase 2 (not on each other) and could theoretically be parallelized if needed. Phase 6 depends on Phase 3. Phase 7 depends on Phases 3-6. Phase 8 depends on Phases 3-5. Phase 9 depends on all content phases.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation and Architecture | 0/2 | Not started | - |
| 2. Report Shell and Data Layer | 0/2 | Not started | - |
| 3. Core Financial Intelligence | 0/2 | Not started | - |
| 4. Deal Flow and Leadership Signals | 0/2 | Not started | - |
| 5. Market Context and Operations | 0/2 | Not started | - |
| 6. Competitive Landscape and Sub-Sector Analysis | 0/2 | Not started | - |
| 7. AI-Powered Intelligence | 0/2 | Not started | - |
| 8. Forward-Looking Signals | 0/1 | Not started | - |
| 9. Export and Meeting Prep | 0/2 | Not started | - |

---
*Roadmap created: 2026-02-15*
*Last updated: 2026-02-15*
