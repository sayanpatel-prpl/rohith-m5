# Requirements: Kompete v2 — A&M Consumer Durables Intelligence Dashboard

**Defined:** 2026-02-20
**Core Value:** Every section answers "where's the BD opportunity?" — sourced signals that help A&M partners identify which companies need help, what kind, and when to reach out.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [ ] **FOUND-01**: Dashboard built in `dashboard_build_v2/` as independent React+Vite+TS project
- [ ] **FOUND-02**: Single-file HTML output via vite-plugin-singlefile
- [ ] **FOUND-03**: Dark mode support with all new tokens having dark variants
- [ ] **FOUND-04**: Multi-tenant branding preserved via `data-tenant` CSS variable theming
- [ ] **FOUND-05**: Progress tracking files created at project root (PROGRESS.md, DECISIONS.md, DATA_CATALOG.md, SOURCE_REFERENCE.md)

### Data Layer

- [ ] **DATA-01**: Data layer consumes JSON files from `consumer-durables-intelligence/data_sources/`
- [ ] **DATA-02**: Client-side filtering via Zustand store (companies, sub-category, performance tier, time period)
- [ ] **DATA-03**: TanStack Query caching with staleTime: Infinity (no refetch on focus/reconnect)
- [ ] **DATA-04**: Graceful degradation — unavailable data shows "-" with tooltip, no broken layouts
- [ ] **DATA-05**: DATA_CATALOG.md created mapping every data file to sections it serves

### Source Attribution

- [ ] **SRCA-01**: Reusable `<SourceAttribution>` component with source, confidence (verified/derived/estimated), tier (1-4), lastUpdated, and optional URL
- [ ] **SRCA-02**: Tier badge styling — T1 solid green, T2 solid blue, T3 outline amber, T4 outline red with warning icon
- [ ] **SRCA-03**: Every card, chart, table, and insight displays source attribution
- [ ] **SRCA-04**: Source tracing from research files to original sources (not citing the research file itself)
- [ ] **SRCA-05**: SOURCE_REFERENCE.md maintained as presenter's cheat sheet — every data point traceable in 5 seconds

### News & Credibility

- [ ] **NEWS-01**: NewsItem TypeScript interface with sourceTier, sourceCredibility, corroboratedBy, contradictedBy, isVerifiedByFiling
- [ ] **NEWS-02**: Anti-clickbait filtering — low credibility sources filtered at data layer, never reach UI
- [ ] **NEWS-03**: Corroborated signals (2+ sources) display with elevated confidence styling
- [ ] **NEWS-04**: Contradicted signals show "Conflicting Reports" tag with both sides
- [ ] **NEWS-05**: NEWS_DATA_SLOT code comments in all 14 news-dependent components
- [ ] **NEWS-06**: News-dependent components degrade gracefully when news array is empty — no empty states visible
- [ ] **NEWS-07**: src/api/news.ts module reads from news data file and merges into section displays

### A&M Theming

- [ ] **AMTH-01**: A&M action-type color tokens in CSS (turnaround red, improvement amber, transaction green, neutral slate)
- [ ] **AMTH-02**: A&M service line tags on insights (CPI, Restructuring, Transaction Advisory, PE Services, Digital, Operations)

### Section 1 — Executive Snapshot

- [ ] **EXEC-01**: Intelligence Grade letter badge (A/B+/C) replacing confidence meter, with hover tooltip explaining methodology
- [ ] **EXEC-02**: A&M Opportunity Summary card at top — total advisory opportunity (₹Cr), companies in distress zone count, top recommended action
- [ ] **EXEC-03**: Big Themes populated from real data (remove mock-data class), each citing source
- [ ] **EXEC-04**: Red Flags populated from real data, mapped to A&M service lines (Turnaround, CPI, Transaction Advisory, Interim Management)
- [ ] **EXEC-05**: Narrative Risks surfacing top Talk vs Walk disconnects alongside Red Flags

### Section 11 → 2 — A&M Value-Add Opportunities

- [ ] **AMVA-01**: Section positioned at nav position 2 (right after Executive Snapshot)
- [ ] **AMVA-02**: Pipeline/kanban layout — Identified, Qualified, Outreach-Ready columns
- [ ] **AMVA-03**: Each opportunity card: Company, Engagement Type, Est. Size (₹Cr), Key Data Points, Sources
- [ ] **AMVA-04**: Every opportunity tagged by A&M practice area (CPI, Restructuring, PE Services, Corporate Transactions, Digital, Operations)
- [ ] **AMVA-05**: Opportunities auto-generated from cross-referencing Sections 3, 5, 6, 10 data

### Section 2 → 3 — Market Pulse

- [ ] **MRKT-01**: Reduce ESTIMATED labels — source from earnings calls or relabel as "Management Guidance Interpretation"
- [ ] **MRKT-02**: A&M implication column in Commodity Outlook table (cross-reference commodity data with import dependency)
- [ ] **MRKT-03**: A&M thought leadership callout box referencing alvarezandmarsal.com consumer economy report
- [ ] **MRKT-04**: Keep verified data: demand signals, input costs (Mead Metals), commodity outlook, margin bands, policy tracker, seasonal patterns

### Section 3 → 4 — Financial Performance Tracker

- [ ] **FINP-01**: A&M Signal triage column — red (turnaround), amber (performance improvement), green (transaction advisory) with classification logic tooltip
- [ ] **FINP-02**: Sparklines (50px) next to Revenue and EBITDA% showing last 4-6 quarters
- [ ] **FINP-03**: Company modal with "Potential A&M Engagement" auto-generated from peer-relative metrics
- [ ] **FINP-04**: Talk vs Walk tab in company modal — 2-3 management claims vs hard data with disconnect (red) and stealth signal (green) flags
- [ ] **FINP-05**: Derived market intelligence columns (toggleable): Mkt Share %, Pricing Power, Competitive Intensity — each with methodology tooltip
- [ ] **FINP-06**: Sortable, filterable metrics table for 15 companies with source attribution per column

### Section 4 → 5 — Deals, Transactions & Capital Movements

- [ ] **DEAL-01**: A&M Angle tag on each deal card (CDD Opportunity, Integration Support, Carve-out Advisory, Valuation, Restructuring)
- [ ] **DEAL-02**: Pattern recognition summary card at top (AI-interpreted deal clusters, promoter dilution trends)
- [ ] **DEAL-03**: All deals from data_sources/ loaded and cross-referenced with data.js

### Section 5 → 6 — Operational Intelligence

- [ ] **OPER-01**: Per-cell confidence icons in ops table (✓ verified, ~ derived, ? estimated) with tooltips
- [ ] **OPER-02**: A&M Operations Diagnostic Triggers card (capacity util < 70%, import dep > 50% + commodity headwind, after-sales cost > 3%)
- [ ] **OPER-03**: Cross-links between Operational Intelligence and Competitive Moves sections

### Section 6 → 7 — Leadership, Org & Governance Watch

- [ ] **LEAD-01**: Leadership timeline populated from real data (remove mock-data), each entry sourced
- [ ] **LEAD-02**: Governance risk scoring per company (auditor resignation = red, promoter decline > 2% QoQ = amber, board reconstitution = amber, stable = green)
- [ ] **LEAD-03**: Promoter holding chart annotated with A&M service line implications (declining + stress = turnaround, rising institutional = PE advisory)

### Section 7 → 8 — Competitive Moves & Strategic Bets

- [ ] **COMP-01**: Populated from real data in data_sources/ (remove mock-data), every entry sourced
- [ ] **COMP-02**: Competitive Intensity Heatmap — Company x Move Type matrix, color by frequency
- [ ] **COMP-03**: Cross-links to Operational Intelligence for moves with operational implications

### Section 8 → 9 — Sub-Sector Deep Dive

- [ ] **SSDD-01**: Margin Levers Analysis table populated from real data (premiumization, backward integration, distribution rationalization, vendor consolidation, SKU rationalization)
- [ ] **SSDD-02**: A&M Benchmark Comparison callout referencing A&M case studies (European white goods 20%+ uplift, US consumer $150M EBITDA improvement)
- [ ] **SSDD-03**: Chart sources standardized and visible (Screener.in revenue, OPM% quartiles, ROCE)

### Section 9 → 10 — "What This Means For..."

- [ ] **WTMF-01**: All 4 tabs (PE/Investors, Founders, COOs/CFOs, Supply Chain Heads) populated with real sourced insights from other sections
- [ ] **WTMF-02**: Recommended A&M Service tag per insight (CPI, Restructuring, Transaction Advisory, Digital, Operations)
- [ ] **WTMF-03**: Cross-navigable insights — each referencing another section has clickable link to that section + card

### Section 10 → 11 — Watchlist & Forward Indicators

- [ ] **WTCH-01**: All 4 watchlist quadrants populated from real data (Likely Fundraises, Margin Inflection, Consolidation Targets, Stress Indicators)
- [ ] **WTCH-02**: Each entry: company, signal detail, severity 1-5, days to event, source, A&M service line
- [ ] **WTCH-03**: Stress Indicators scoring model with clear thresholds (cash burn 2+ quarters, debt maturity 12 months, revenue decline 2+ quarters, EBITDA% below P25)
- [ ] **WTCH-04**: Likely Fundraise signals (low promoter + high capex plans + declining cash + board approvals)

### Talk vs Walk

- [ ] **TVW-01**: TalkVsWalk TypeScript interface (company, claim, claimSource, dataVerification, verificationData, verificationSource)
- [ ] **TVW-02**: Detection patterns flagging: premiumization (ASP vs revenue/volume), backward integration (import dependency), expansion (capex-to-revenue), rural penetration (dealer count)
- [ ] **TVW-03**: Stealth Signals (green flag) — numbers show trend management hasn't discussed yet
- [ ] **TVW-04**: Narrative Disconnects (red flag) — management claims contradicted by filed data
- [ ] **TVW-05**: Talk vs Walk surfaced in: company modal (S4), Executive Snapshot narrative risks (S1), PE/Investors tab (S10)

### Derived Intelligence

- [ ] **DRVI-01**: Intra-universe market share by sub-category (revenue / total sub-category revenue × 100) with methodology caveat
- [ ] **DRVI-02**: Pricing Power Proxy (Revenue Growth % minus sector volume growth %)
- [ ] **DRVI-03**: Competitive Intensity Index (event count per ₹1000Cr revenue)
- [ ] **DRVI-04**: Derived metrics visually distinguished (italic + "Derived" badge) from filed metrics
- [ ] **DRVI-05**: ALTERNATIVE_DATA_SLOT code comments for Tier 2 data slots (DGFT imports, PLI, Google Trends, patent filings)

### Global

- [ ] **GLBL-01**: All mock-data CSS class instances removed — replaced with real sourced data or "-"
- [ ] **GLBL-02**: Navigation order: Executive Snapshot, A&M Value-Add, Market Pulse, Financial Tracker, Deals, Operational Intelligence, Leadership, Competitive Moves, Sub-Sector, What This Means For, Watchlist
- [ ] **GLBL-03**: Build tested with empty news JSON + empty alt-data — no broken layouts
- [ ] **GLBL-04**: Every card has source attribution with tier badge (final audit)

## v2 Requirements

Deferred to future release.

### Advanced Intelligence

- **ADVN-01**: Real-time customizable alert rules with email/Slack integration
- **ADVN-02**: Scenario modeling interface (what-if capex/revenue changes)
- **ADVN-03**: Automated battlecards for deal pipeline
- **ADVN-04**: Collaborative annotations (team notes on data points)
- **ADVN-05**: Cross-sector pattern matching with ML similarity models

### Mobile & Distribution

- **MOBL-01**: Mobile/tablet responsive layout
- **MOBL-02**: PowerPoint export (EXPT-04 from v1.0)
- **MOBL-03**: Presentation mode (hide filters, keyboard navigation)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend data pipelines | Separate workstream — data arrives as JSON files |
| News scraping/collection | Data arrives via JSON drop before presentation |
| User auth / billing | Developer handles separately |
| FMCG/QSR/Apparel categories | Future expansion after Consumer Durables |
| Modifying v1.0 codebase | Untouched; v2 is independent build |
| Export/sharing functionality | Deferred — not needed for presentation |
| Real-time data refresh | Monthly cadence, data is pre-extracted |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| DATA-03 | Phase 1 | Pending |
| DATA-04 | Phase 1 | Pending |
| DATA-05 | Phase 1 | Pending |
| SRCA-01 | Phase 1 | Pending |
| SRCA-02 | Phase 1 | Pending |
| SRCA-03 | Phase 1 | Pending |
| SRCA-04 | Phase 1 | Pending |
| SRCA-05 | Phase 1 | Pending |
| NEWS-01 | Phase 1 | Pending |
| NEWS-02 | Phase 1 | Pending |
| NEWS-03 | Phase 1 | Pending |
| NEWS-04 | Phase 1 | Pending |
| NEWS-05 | Phase 1 | Pending |
| NEWS-06 | Phase 1 | Pending |
| NEWS-07 | Phase 1 | Pending |
| AMTH-01 | Phase 1 | Pending |
| AMTH-02 | Phase 1 | Pending |
| EXEC-01 | Phase 2 | Pending |
| EXEC-02 | Phase 2 | Pending |
| EXEC-03 | Phase 2 | Pending |
| EXEC-04 | Phase 2 | Pending |
| EXEC-05 | Phase 2 | Pending |
| FINP-01 | Phase 2 | Pending |
| FINP-02 | Phase 2 | Pending |
| FINP-03 | Phase 2 | Pending |
| FINP-04 | Phase 2 | Pending |
| FINP-05 | Phase 2 | Pending |
| FINP-06 | Phase 2 | Pending |
| WTCH-01 | Phase 2 | Pending |
| WTCH-02 | Phase 2 | Pending |
| WTCH-03 | Phase 2 | Pending |
| WTCH-04 | Phase 2 | Pending |
| MRKT-01 | Phase 3 | Pending |
| MRKT-02 | Phase 3 | Pending |
| MRKT-03 | Phase 3 | Pending |
| MRKT-04 | Phase 3 | Pending |
| DEAL-01 | Phase 3 | Pending |
| DEAL-02 | Phase 3 | Pending |
| DEAL-03 | Phase 3 | Pending |
| LEAD-01 | Phase 3 | Pending |
| LEAD-02 | Phase 3 | Pending |
| LEAD-03 | Phase 3 | Pending |
| OPER-01 | Phase 4 | Pending |
| OPER-02 | Phase 4 | Pending |
| OPER-03 | Phase 4 | Pending |
| COMP-01 | Phase 4 | Pending |
| COMP-02 | Phase 4 | Pending |
| COMP-03 | Phase 4 | Pending |
| SSDD-01 | Phase 4 | Pending |
| SSDD-02 | Phase 4 | Pending |
| SSDD-03 | Phase 4 | Pending |
| AMVA-01 | Phase 5 | Pending |
| AMVA-02 | Phase 5 | Pending |
| AMVA-03 | Phase 5 | Pending |
| AMVA-04 | Phase 5 | Pending |
| AMVA-05 | Phase 5 | Pending |
| WTMF-01 | Phase 5 | Pending |
| WTMF-02 | Phase 5 | Pending |
| WTMF-03 | Phase 5 | Pending |
| TVW-01 | Phase 5 | Pending |
| TVW-02 | Phase 5 | Pending |
| TVW-03 | Phase 5 | Pending |
| TVW-04 | Phase 5 | Pending |
| TVW-05 | Phase 5 | Pending |
| DRVI-01 | Phase 5 | Pending |
| DRVI-02 | Phase 5 | Pending |
| DRVI-03 | Phase 5 | Pending |
| DRVI-04 | Phase 5 | Pending |
| DRVI-05 | Phase 5 | Pending |
| GLBL-01 | Phase 6 | Pending |
| GLBL-02 | Phase 6 | Pending |
| GLBL-03 | Phase 6 | Pending |
| GLBL-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 70 total
- Mapped to phases: 70/70 (100%)
- Unmapped: 0

---
*Requirements defined: 2026-02-20*
*Last updated: 2026-02-21 after roadmap creation*
