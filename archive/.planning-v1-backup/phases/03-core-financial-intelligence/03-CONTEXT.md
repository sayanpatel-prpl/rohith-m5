# Phase 3: Core Financial Intelligence - Context

**Gathered:** 2026-02-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Executive Snapshot landing page and Financial Performance Tracker. Users land on an AI-generated briefing and can drill into standardized financial data for 15-20 Consumer Durables companies.

Requirements: EXEC-01 through EXEC-04, FINP-01 through FINP-07 (11 total).
</domain>

<decisions>
## Implementation Decisions

### Executive Snapshot
- Landing page — first thing users see when entering a tenant's report
- 5-bullet monthly summary with theme significance (high/medium/low)
- Red flags with AI confidence scores displayed as colored badges
- AI narrative per theme explaining BD relevance
- Data recency indicator using DataRecencyTag from Phase 1
- Bloomberg-dense layout: bullets as compact cards, red flags as a tight table

### Financial Performance Tracker
- Sortable, filterable metrics table for all companies in mock data
- Columns: Company, Revenue Growth YoY, EBITDA Margin, Working Capital Days, ROCE, Debt/Equity
- Each company tagged with PerformanceTag (outperform/inline/underperform) from Phase 1
- Side-by-side comparison: user selects 2-5 companies, sees time-series charts (TrendLineChart from Phase 1)
- Source attribution on every metric (e.g., "BSE filing Q3 FY25")
- AI variance analysis narrative per company
- Uses useFilteredData hook from Phase 2 for filter integration

### Claude's Discretion
- Table sorting implementation (client-side with state)
- Company comparison selection UX (checkboxes in table vs. separate picker)
- Variance analysis layout (expandable rows vs. side panel)
- Chart period toggle (QoQ vs YoY) implementation
- Executive Snapshot card layout and visual hierarchy
</decisions>

<deferred>
## Deferred Ideas
None
</deferred>

---
*Phase: 03-core-financial-intelligence*
*Context gathered: 2026-02-16*
