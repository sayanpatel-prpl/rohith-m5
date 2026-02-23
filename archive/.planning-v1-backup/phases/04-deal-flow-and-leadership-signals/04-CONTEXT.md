# Phase 4: Deal Flow and Leadership Signals - Context

**Gathered:** 2026-02-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Deals & Transactions tracker and Leadership & Governance watch. Event-based signals that directly trigger BD outreach — money movements and people changes.

Requirements: DEAL-01 through DEAL-06, LEAD-01 through LEAD-05 (11 total).
</domain>

<decisions>
## Implementation Decisions

### Deals & Transactions
- Display M&A, PE/VC, IPO, and distressed asset activity
- Each deal shows parties, value (formatted INR), rationale, date
- Chronological timeline visualization (vertical timeline with deal cards)
- AI pattern recognition highlighting deal clusters and investor themes
- Filter integration via useFilteredData from Phase 2
- Deal type tabs or filter to switch between M&A / PE/VC / IPO / Distressed

### Leadership & Governance
- CXO changes with company, role, person, direction (appointed/departed)
- Board reshuffles and committee changes
- Promoter stake changes with TrendIndicator (up/down/flat)
- Auditor resignation flags as highlighted warning cards
- AI risk flags on governance events signaling stress or opportunity
- Compact table layout for changes, expandable for details

### Claude's Discretion
- Timeline visualization style (vertical timeline vs. horizontal)
- Deal card layout and information hierarchy
- AI pattern display format (summary cards vs. inline annotations)
- Leadership change grouping (by company vs. by type vs. chronological)
- Risk flag severity visualization
</decisions>

<deferred>
## Deferred Ideas
None
</deferred>

---
*Phase: 04-deal-flow-and-leadership-signals*
*Context gathered: 2026-02-16*
