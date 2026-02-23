# Phase 1: Foundation and Architecture - Context

**Gathered:** 2026-02-15
**Status:** Ready for planning

<domain>
## Phase Boundary

The multi-tenant application scaffold: BrandProvider with CSS custom properties, TypeScript data contracts for all 10 section JSON shapes, centralized Indian financial formatters, shared UI primitives (StatCard, TrendIndicator, PerformanceTag, SectionSkeleton), chart wrappers consuming brand tokens, error boundaries, and the React Router app shell. This is infrastructure that every subsequent module builds on.

Requirements: FOUND-01 through FOUND-08, BRND-01 through BRND-04 (12 total).

</domain>

<decisions>
## Implementation Decisions

### Branding & Theming
- Full brand kit per tenant: logo, primary/secondary/accent colors, font family, custom favicon — each instance should feel like the consulting firm's own product
- Dark mode support from day one — build the light/dark toggle into the theme system architecture
- Kompete-branded default used for development and demo/preview tenant
- Brand config storage approach: Claude's discretion (JSON config files vs backend API — pick what's simplest to add new tenants)

### Report Visual Style
- Aesthetic: "Bloomberg terminal meets consulting" — data-dense but polished, professional financial tool with consulting presentation quality
- Information density: HIGH — minimal padding, compact tables, smaller text. Partners scan fast and want maximum data on screen.
- Section layout: Full-page sections — each of the 10 modules gets a full page/view, sidebar nav switches between them (not long-scroll single page)
- Navigation: Slim top bar with tenant logo + left sidebar for section navigation. Maximize content area.

### Chart & Data Visualization
- Color palette: Fixed professional palette across all tenants (e.g., blue-teal-gray professional scheme) — only accent color changes with tenant brand
- Chart annotations: Inline annotations on key data points — events marked directly on the chart with callout arrows (e.g., "Q3: raw material spike")
- Performance indicators (outperform/underperform): Claude's discretion on indicator style
- Chart interaction: Hover tooltips + click to drill down into detailed view for a company or metric

### Component Behavior Patterns
- Loading states: Skeleton screens — content-shaped placeholders that shimmer while loading, reduces layout shift
- Error presentation: Claude's discretion on error UX approach
- Section transitions: Subtle fade-out/fade-in when switching between sections via sidebar nav
- Data recency: Edition badge in header ("February 2026 Edition") + per-section "Data as of Q3 FY25" indicators

### Claude's Discretion
- Brand config storage mechanism (JSON files vs API-delivered)
- Performance indicator visual style (color tags vs directional arrows)
- Error presentation pattern (inline card vs toast + fallback)
- Exact spacing, padding, and typography scale within the high-density constraint
- Skeleton screen shapes and shimmer implementation
- Drill-down view layout when clicking chart elements

</decisions>

<specifics>
## Specific Ideas

- "Bloomberg terminal meets consulting" is the north star — think data density of Bloomberg with the polish of a McKinsey deliverable
- High density is critical: partners are scanning 15-20 companies quickly, not reading leisurely
- Inline chart annotations (not headline above chart) — the insight lives ON the data, not separate from it
- Full brand kit means the consulting firm's instance should be indistinguishable from a product they built themselves
- Dark mode from day one means the CSS custom property system must support light/dark from the start

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-and-architecture*
*Context gathered: 2026-02-15*
