# Phase 2: Report Shell and Data Layer - Context

**Gathered:** 2026-02-16
**Status:** Ready for planning

<domain>
## Phase Boundary

The report container infrastructure: API client with TanStack Query caching, Zustand filter store with URL sync, lazy-loaded section rendering via React.lazy(), and FilterBar UI. This phase makes the report shell operational so content modules (Phases 3-9) can plug in and receive typed, filtered data.

Requirements: FOUND-09 through FOUND-14 (6 total).

</domain>

<decisions>
## Implementation Decisions

### Data Source Strategy
- Static JSON fixtures as mock data in `/src/data/mock/` directory
- Realistic sample data using real Indian Consumer Durables companies (Voltas, Blue Star, Havells, Crompton, Whirlpool India, Symphony, Orient Electric, Bajaj Electricals, V-Guard, TTK Prestige, Butterfly Gandhimathi, Amber Enterprises, Dixon Technologies, Johnson Controls-Hitachi, Daikin India, etc.)
- Plausible financial metrics, deals, and leadership data -- makes the demo compelling
- API client reads from these fixtures, structured to be easily swapped for real API later
- No backend dependency during development

### FilterBar Layout
- Horizontal strip below the TopBar spanning the full content area width
- Always visible (not collapsible)
- Compact single row with dropdowns
- Maximizes content area below
- Filters: company selector (multi-select), sub-category, performance tier, time period

### Filter URL Sync
- Active filters encoded as URL query params (e.g., `?companies=voltas,bluestar&period=YoY`)
- Shareable/bookmarkable filtered views
- Browser back/forward works with filter state
- Zustand store syncs bidirectionally with URL search params

### Claude's Discretion
- TanStack Query stale time and cache configuration
- Zustand store structure and slice pattern
- Lazy loading fallback component (likely SectionSkeleton from Phase 1)
- FilterBar dropdown component implementation (Radix UI Select/Popover or custom)
- Mock data file organization and naming
- API client abstraction layer design

</decisions>

<specifics>
## Specific Ideas

- Mock data should feel like a real consulting demo -- partners should see familiar company names and plausible numbers
- FilterBar must be compact (single row) to preserve the high-density "Bloomberg terminal" feel from Phase 1
- URL sync means a partner can send a colleague a link like `/bcg/report/financial?companies=voltas,bluestar&period=YoY` and they see the same filtered view
- Lazy loading means the initial bundle only includes the app shell -- each section's code loads on first visit

</specifics>

<deferred>
## Deferred Ideas

None -- all decisions are within phase scope

</deferred>

---

*Phase: 02-report-shell-and-data-layer*
*Context gathered: 2026-02-16*
