# Phase 5: Market Context and Operations - Context

**Gathered:** 2026-02-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Market Pulse macro view and Operational Intelligence signals. Macro industry context (demand, costs, margins, channels) and micro operational signals (supply chain, capacity, procurement, retail footprint).

Requirements: MRKT-01 through MRKT-04, OPER-01 through OPER-04 (8 total).
</domain>

<decisions>
## Implementation Decisions

### Market Pulse
- Demand signals with TrendIndicator showing direction
- Input cost trends (steel, copper, plastics) with QoQ/YoY movement — use TrendLineChart
- Margin outlook with visual trend indicators
- Channel mix shifts (offline vs online vs D2C) with percentage breakdown — use BarComparisonChart
- Sector-wide view, not per-company (macro context)

### Operational Intelligence
- Supply chain signals (sourcing shifts, logistics disruptions) as signal cards
- Manufacturing capacity changes with expansion/closure/utilization data
- Procurement shifts (vendor changes, import/export patterns)
- Retail expansion/rationalization data (store openings, closures, channel shifts)
- Per-company data, filterable via useFilteredData from Phase 2
- Compact card-based layout with company grouping

### Claude's Discretion
- Market Pulse section layout (dashboard grid vs. stacked sections)
- Input cost chart configuration (multi-line overlay vs. separate charts)
- Channel mix visualization style (stacked bar vs. donut vs. horizontal bar)
- Operational signal card design and grouping strategy
- Manufacturing capacity visualization (table vs. cards vs. timeline)
</decisions>

<deferred>
## Deferred Ideas
None
</deferred>

---
*Phase: 05-market-context-and-operations*
*Context gathered: 2026-02-16*
