# Requirements: Industry Landscape Intelligence

**Defined:** 2026-02-15
**Core Value:** Every section answers "where's the BD opportunity?" — signals that help consulting partners identify which companies need help, what kind, and when to reach out.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [ ] **FOUND-01**: App renders with React Router navigation between 10 report sections
- [ ] **FOUND-02**: BrandProvider resolves tenant from URL slug and injects brand tokens (logo, colors, fonts) as CSS custom properties
- [ ] **FOUND-03**: Switching tenant URL updates all branding (header, charts, typography) without page reload
- [ ] **FOUND-04**: Centralized formatters handle INR Cr/Lakh, percentages, basis points, and growth rates consistently across all modules
- [ ] **FOUND-05**: TypeScript data contracts define JSON shape for all 10 section data payloads
- [ ] **FOUND-06**: Shared UI primitives (StatCard, TrendIndicator, PerformanceTag, SectionSkeleton) render with brand tokens
- [ ] **FOUND-07**: Chart wrappers (TrendLineChart, BarComparisonChart) consume brand CSS variables for colors
- [ ] **FOUND-08**: Error boundaries catch and display section-level errors without crashing other sections
- [ ] **FOUND-09**: API client fetches typed JSON from Express/Supabase backend with TanStack Query caching
- [ ] **FOUND-10**: Report shell displays section navigation sidebar with active state indication
- [ ] **FOUND-11**: SectionRenderer lazy-loads each module via React.lazy() — only active section's code is loaded
- [ ] **FOUND-12**: Zustand filter store manages company selection, sub-category, performance rating, and time period filters across sections
- [ ] **FOUND-13**: FilterBar UI lets user select companies (multi-select), sub-category, performance tier, and time period
- [ ] **FOUND-14**: Filter changes update visible data without triggering API refetch (client-side filtering)

### Executive Snapshot

- [ ] **EXEC-01**: User sees monthly summary in 5-bullet format covering big themes for the month
- [ ] **EXEC-02**: User sees red flags/watchlist with AI confidence scores (high/medium/low)
- [ ] **EXEC-03**: User sees data recency indicator ("as of [month] [year]" or "Q3 FY25")
- [ ] **EXEC-04**: AI-generated narrative explains why each theme matters for BD opportunities

### Market Pulse

- [ ] **MRKT-01**: User sees demand signals for Consumer Durables mid-market with trend direction
- [ ] **MRKT-02**: User sees input cost trends (steel, copper, plastics, etc.) with QoQ/YoY movement
- [ ] **MRKT-03**: User sees margin outlook across the sector with visual trend indicators
- [ ] **MRKT-04**: User sees channel mix shifts (offline retail vs online vs D2C) with percentage breakdown

### Financial Performance

- [ ] **FINP-01**: User sees standardized financial metrics table for 15-20 Consumer Durables companies (revenue growth, EBITDA margin, working capital days, ROCE, debt/equity)
- [ ] **FINP-02**: User can compare any 2-5 companies side-by-side on selected metrics
- [ ] **FINP-03**: User sees time-series charts showing QoQ and YoY trends per company per metric
- [ ] **FINP-04**: Each company is tagged as outperform/inline/underperform relative to sector average
- [ ] **FINP-05**: Source attribution appears on every metric ("BSE filing Q3 FY25", "Earnings transcript")
- [ ] **FINP-06**: AI variance analysis explains metric changes in narrative form ("EBITDA margin declined 180bps QoQ, driven by raw material cost inflation, 230bps below segment average")
- [ ] **FINP-07**: User can sort and filter the financial metrics table by any column

### Deals & Transactions

- [ ] **DEAL-01**: User sees M&A transactions with acquirer, target, deal value, and strategic rationale
- [ ] **DEAL-02**: User sees PE/VC investments with investor, company, amount, and stage
- [ ] **DEAL-03**: User sees IPO filings and capital market activity
- [ ] **DEAL-04**: User sees distressed asset activity and stressed company signals
- [ ] **DEAL-05**: Timeline visualization shows deal flow chronologically
- [ ] **DEAL-06**: AI pattern recognition highlights deal clusters and recurring investor themes

### Operational Intelligence

- [ ] **OPER-01**: User sees supply chain signals (raw material sourcing shifts, logistics disruptions)
- [ ] **OPER-02**: User sees manufacturing capacity changes (plant expansions, closures, utilization rates)
- [ ] **OPER-03**: User sees procurement shifts (vendor changes, import/export pattern changes)
- [ ] **OPER-04**: User sees retail expansion/rationalization data (store openings, closures, channel shifts)

### Leadership & Governance

- [ ] **LEAD-01**: User sees CXO changes (new appointments, departures) with company and role
- [ ] **LEAD-02**: User sees board reshuffles and committee changes
- [ ] **LEAD-03**: User sees promoter stake changes (increases, pledges, dilutions) with trend
- [ ] **LEAD-04**: User sees auditor resignations and statutory audit flags
- [ ] **LEAD-05**: AI risk flags highlight governance events that signal company stress or opportunity

### Competitive Moves

- [ ] **COMP-01**: User sees product launches and new SKU introductions across the sector
- [ ] **COMP-02**: User sees pricing actions (price wars, premium positioning shifts)
- [ ] **COMP-03**: User sees D2C initiatives and quick commerce partnerships
- [ ] **COMP-04**: Cluster analysis groups companies by competitive strategy (cost leader vs premium vs niche)

### Sub-Sector Deep Dive

- [ ] **SSDD-01**: User sees rotating monthly deep dive into one sub-segment (AC, refrigerator, washing machine, etc.)
- [ ] **SSDD-02**: Cost structure benchmarks compare COGS breakdown across companies in the sub-segment
- [ ] **SSDD-03**: Margin levers analysis identifies what drives profitability differences
- [ ] **SSDD-04**: Top-quartile analysis highlights best-performing companies and what they do differently

### Action Lens

- [ ] **ACTN-01**: User can switch between persona views: PE/Investors, Founders, COOs/CFOs, Procurement Heads
- [ ] **ACTN-02**: Each persona view tailors the interpretation of the same data to that audience's priorities
- [ ] **ACTN-03**: AI generates actionable takeaways specific to each persona ("For PE investors: Blue Star's margin compression + promoter stake pledge = potential distressed acquisition target")

### Watchlist & Forward Indicators

- [ ] **WTCH-01**: User sees 90-day forward-looking signals: likely fundraises based on financial trajectory
- [ ] **WTCH-02**: User sees margin inflection candidates (companies approaching profitability turning points)
- [ ] **WTCH-03**: User sees consolidation targets (companies likely to be acquired based on market position + financial stress)
- [ ] **WTCH-04**: User sees stress indicators (companies showing multiple distress signals simultaneously)

### AI Intelligence

- [ ] **AINL-01**: BD Signal Scoring assigns a composite "needs consulting help" score to each company from financial stress + leadership changes + operational disruption signals
- [ ] **AINL-02**: Engagement Opportunity Classification tags each signal with likely service line (Turnaround, Growth Strategy, Cost Optimization, M&A Advisory)
- [ ] **AINL-03**: AI confidence scores appear on all AI-generated insights (high/medium/low with reasoning)

### Export & Meeting Prep

- [ ] **EXPT-01**: User can export full report or selected sections as PDF with print-optimized layout
- [ ] **EXPT-02**: User can export data tables as CSV
- [ ] **EXPT-03**: Meeting Prep Brief generates 1-click company brief pulling key data from all modules into a structured 1-pager
- [ ] **EXPT-04**: User can export report sections as branded PowerPoint slides

### Multi-Tenant Branding

- [ ] **BRND-01**: Each consulting firm instance displays their logo in header and export outputs
- [ ] **BRND-02**: Each instance uses the firm's color palette across all UI elements and charts
- [ ] **BRND-03**: Each instance uses the firm's typography (font family, weights)
- [ ] **BRND-04**: Tenant resolution from URL slug loads correct brand configuration without rebuild

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Notifications

- **NOTF-01**: User receives email digest when new monthly report is published
- **NOTF-02**: User receives alert when high-priority BD signal detected (real-time)

### Advanced Analytics

- **ADVN-01**: Management commentary sentiment analysis (NLP on earnings transcripts, tone shift tracking)
- **ADVN-02**: Competitive cluster mapping visualization (strategy white space identification)
- **ADVN-03**: Custom company watchlists with user-defined alert thresholds

### Multi-Category Expansion

- **MCAT-01**: FMCG category with sector-specific modules
- **MCAT-02**: QSR category with sector-specific modules
- **MCAT-03**: Apparel category with sector-specific modules
- **MCAT-04**: Beauty category with sector-specific modules

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend data collection pipelines | Separate workstream per PROJECT.md |
| FMCG, QSR, Apparel, Beauty categories | Future expansion after Consumer Durables proves out |
| Mobile app | Desktop-first for consulting partners |
| Real-time push notifications | Monthly cadence for v1; destroys curated briefing value |
| User auth / billing / subscription | Developer handles separately |
| Build-your-own-dashboard | Value is editorial curation, not self-service BI |
| Social media monitoring | Noisy signal for BD intelligence; track filings instead |
| News feed aggregation | Becomes noise machine; Google Alerts exists |
| 50+ company coverage | Data quality collapses without mature pipelines; 15-20 is the right scope |
| Automated client-facing reports | Conflates internal BD tool with client deliverables; different quality bars |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (populated during roadmap creation) | | |

**Coverage:**
- v1 requirements: 58 total
- Mapped to phases: 0
- Unmapped: 58

---
*Requirements defined: 2026-02-15*
*Last updated: 2026-02-15 after initial definition*
