# Pitfalls Research

**Domain:** AI-driven Industry Intelligence Dashboard / Multi-Tenant Consulting BD Platform
**Researched:** 2026-02-15
**Confidence:** MEDIUM-HIGH (React/Tailwind pitfalls verified via official docs; dashboard UX and multi-tenant patterns from established domain knowledge; consulting-specific UX from training data)

---

## Critical Pitfalls

### Pitfall 1: Storing Derived Financial Metrics in Component State

**What goes wrong:**
Developers store computed values (YoY growth percentages, EBITDA margins, variance-vs-segment-average) in React state, then use `useEffect` to keep them in sync when the underlying data changes. This creates cascading re-render chains: raw data updates trigger effect, effect sets derived state, derived state triggers child re-renders, children's effects fire -- the entire dashboard flickers and lags.

With 10 report modules each containing multiple computed metrics (Revenue growth YoY/QoQ, EBITDA margin, working capital days, inventory days, Net Debt/EBITDA, Capex intensity, ROCE trend, plus variance analysis and outperform/inline/underperform tagging), the cascading effect chains multiply into hundreds of unnecessary renders per data update.

**Why it happens:**
Developers treat React like an imperative system -- "when X changes, update Y." The brief specifies computed layers on top of raw data (variance analysis vs. last quarter, vs. segment average, AI-generated confidence scores), which feels like "derived state that needs syncing." React's mental model for this is different: compute during render, memoize if expensive.

**How to avoid:**
- Compute derived metrics inline during render. A function like `calculateEBITDAMargin(revenue, costs)` called during render is cheaper than a state/effect chain.
- Use `useMemo` with dependency arrays for genuinely expensive computations (e.g., sorting 50 companies by multiple financial metrics, calculating quartile benchmarks across the universe).
- Only `useMemo` if the computation takes >1ms in production mode. Profile with `console.time()` on realistic data (30-50 company universe).
- Never chain effects: if module A's filter change should update module B's aggregation, handle it in the event handler or lift the state properly.

**Warning signs:**
- Multiple `useEffect` hooks that call `setState` based on other state values.
- Flickering or stale data when switching between report modules.
- React DevTools Profiler showing >2 renders per user interaction.
- Components re-rendering when unrelated filters change.

**Phase to address:** Phase 1 (Foundation) -- establish the data flow pattern before building any modules. Create a `useFinancialMetrics(rawData, filters)` hook pattern that computes derivations via `useMemo` and returns ready-to-render objects.

**Confidence:** HIGH -- verified against React official documentation (react.dev).

---

### Pitfall 2: Hardcoded Brand Identity Instead of Theme-Token Architecture

**What goes wrong:**
Colors, fonts, logos, and spacing get scattered across component files as literal values or even as specific Tailwind utility classes. When the second consulting firm (say A&M after BCG) needs their branded instance, you face one of two terrible options: (a) fork the entire frontend, or (b) find-and-replace hundreds of color references. Both lead to unmaintainable code.

The brief describes multi-tenant SaaS where BCG, A&M, and similar firms each get branded instances. This is not a cosmetic feature -- it is a core architectural requirement that must be designed in from day one.

**Why it happens:**
White-labeling feels like a "later" feature. Developers build the first tenant's look-and-feel directly, thinking "we'll abstract it when we need to." By then, brand assumptions are baked into component logic (not just styles -- conditional logic like "show BCG logo here," hardcoded chart color palettes, PDF export templates with embedded colors).

**How to avoid:**
- Use Tailwind v4's `@theme` directive with CSS custom properties from the start. Define a semantic token layer: `--color-brand-primary`, `--color-brand-accent`, `--color-chart-series-1` through `--color-chart-series-6`, `--color-signal-positive`, `--color-signal-negative`, `--color-signal-neutral`.
- Create a tenant theme file pattern. Each tenant gets a CSS file that overrides `@theme` variables:
  ```css
  /* themes/bcg-theme.css */
  @theme {
    --color-brand-primary: oklch(0.45 0.12 250);
    --color-brand-accent: oklch(0.65 0.15 145);
  }
  ```
- Never reference concrete colors in components. Use semantic tokens everywhere: `bg-brand-primary`, `text-signal-negative`, `border-chart-series-1`.
- Chart libraries must consume theme tokens, not hardcoded hex values. Build a `useChartColors()` hook that reads CSS custom properties and returns the palette.
- Logo, company name, and tenant-specific copy must come from a tenant configuration object, never hardcoded.

**Warning signs:**
- Any hex/rgb/oklch value in a component file (should only be in theme files).
- The word "BCG" or any client name appearing in component code.
- Chart components with inline color arrays.
- Difficulty answering "how long to add a new tenant?" (answer should be: "create one CSS file and one config JSON, deploy").

**Phase to address:** Phase 1 (Foundation) -- the theme token system must exist before any component is built. This is a non-negotiable architectural decision.

**Confidence:** HIGH -- Tailwind v4 `@theme` with CSS custom properties verified via official docs. The pattern of semantic tokens for white-labeling is well-established.

---

### Pitfall 3: Building a "Dashboard" When the User Needs a "Briefing"

**What goes wrong:**
The team builds a traditional analytics dashboard with filters, drill-downs, and interactive charts. The MD/Partner at BCG opens it, sees 10 modules worth of charts and tables, and closes it. They needed a 5-minute briefing document that tells them what changed and why it matters -- not an analytics workbench they have to explore themselves.

The brief explicitly states: "5-minute skim that answers 'What changed this month and why should I care?'" and the buyer persona is "time-poor, needs instant signal-to-noise, walks into meetings with this tool." A traditional dashboard violates every one of these requirements.

**Why it happens:**
Engineering teams default to building dashboards because that is what data visualization libraries are designed for. The mental model is "present data, let users explore." But consulting MDs are not analysts -- they do not explore data. They consume conclusions and need supporting evidence on-demand. The correct mental model is closer to a McKinsey slide deck or a Bloomberg terminal's "top stories" than a Tableau dashboard.

**How to avoid:**
- Design the primary view as a **narrative flow**, not a dashboard grid. The "Cover & Executive Snapshot" module is the landing page. It reads like a document, not a control panel.
- Use progressive disclosure: headline insight first, then supporting chart/table on click/expand. Never show the chart first.
- Every data visualization must have a text headline above it that states the conclusion: "EBITDA margins contracted 180bps QoQ, driven by input cost inflation in Q3" -- not just "EBITDA Margin Trend."
- Build the "Red Flags / Watchlist" as the primary navigation mechanism. MDs care about exceptions, not normal operations.
- Test the "meeting-ready" scenario: can the user open this on their iPad 5 minutes before a client meeting and extract 3 talking points? If not, the UX has failed.

**Warning signs:**
- The landing page has more than 2-3 charts visible above the fold.
- Users need to click filters before seeing any useful information.
- Chart titles are metric names ("Revenue Growth YoY") rather than insight statements ("Revenue growth accelerating across consumer durables").
- No one is reading the AI-generated summaries because they are buried below the charts.

**Phase to address:** Phase 1 (UX Design) and Phase 2 (Module Build). The narrative-first information architecture must be established before building individual modules. Each module's component hierarchy should be: Insight Headline > Supporting Evidence > Interactive Detail.

**Confidence:** HIGH -- NNGroup research and consulting industry UX patterns are well-established. The brief itself provides strong signal about user needs.

---

### Pitfall 4: Uncontrolled Chart Re-rendering on Filter/Tab Changes

**What goes wrong:**
Every time a user changes a filter (e.g., switching from QoQ to YoY view, selecting a different company subset, changing the time period), all chart components on the page re-render. With SVG-based charting libraries rendering 50-company comparison charts, this causes 500ms+ frame drops. The app feels sluggish precisely at the moment the user is trying to interact with it.

For this project specifically: the Financial Performance Tracker covers 30-50 companies with 7+ standardized metrics each. The Competitive Moves module shows cluster analysis. The Deals module shows transaction timelines. All of these are heavy SVG renders.

**Why it happens:**
- Chart data objects are recreated on every render (new array/object reference = chart thinks data changed = full SVG re-render).
- Parent component state changes (like a global filter) propagate to all children.
- Chart libraries like Recharts, Nivo, or Victory re-render their entire SVG tree on any prop change because they do not do granular DOM diffing on SVG elements.

**How to avoid:**
- Memoize chart data transformations with `useMemo`, keyed to the actual dependencies (not the entire data object).
- Wrap chart components in `React.memo()` with custom comparison functions that do shallow equality on the data array's length and key identifiers, not deep equality.
- Isolate filter state: use a module-level context or state so that changing a filter in Module 3 does not trigger re-renders in Modules 1, 2, 4-10.
- For the 50-company comparison table/chart: virtualize the rendering. Only render companies visible in the viewport. Libraries like TanStack Virtual handle this.
- Consider canvas-based rendering for charts with >20 data series. SVG performance degrades linearly with element count; canvas does not.

**Warning signs:**
- Visible jank when changing filters or tabs.
- React DevTools shows chart components re-rendering when their data has not actually changed.
- Browser Performance tab shows long "Recalculate Style" or "Layout" tasks (>50ms) on interaction.
- Scroll stuttering on the Financial Performance Tracker page.

**Phase to address:** Phase 2 (Module Build) -- but the memoization patterns and component isolation architecture must be established in Phase 1. Create a `<ChartContainer>` wrapper in Phase 1 that handles memoization, loading states, and error boundaries.

**Confidence:** HIGH -- React rendering behavior is well-documented. SVG performance characteristics are well-established.

---

### Pitfall 5: Financial Number Formatting Inconsistency

**What goes wrong:**
Indian financial data has unique formatting requirements that get botched across different modules. The same company's revenue shows as "Rs 2,345 Cr" in one module, "INR 2345 Crore" in another, "2.3K Cr" in a chart tooltip, and "23.45B" (US billions) in an exported PDF. Percentages appear as "12.5%" in one place and "0.125" in another. Negative values show as "-180bps" in text but as red "(180)" in a table.

For a consulting intelligence tool, inconsistent number formatting destroys credibility. If an MD sees conflicting representations of the same metric, they lose trust in the entire platform.

**Why it happens:**
- No centralized formatting layer. Each component does its own `toLocaleString()` or string interpolation.
- Indian numbering system (lakhs/crores) is not the default in any JavaScript locale. `Intl.NumberFormat('en-IN')` gives you lakhs/crores separators but not the "Cr" suffix.
- Different contexts need different precision: chart axes need abbreviated values ("2.3K Cr"), tables need full precision ("2,345.67 Cr"), tooltips need contextual precision.
- Basis points (bps), percentage points, and percentages are three different things that get conflated.

**How to avoid:**
- Build a `formatters.ts` utility module in Phase 1 with these functions:
  - `formatCurrency(value, { unit: 'cr' | 'lakh', precision: number, abbreviated: boolean })`
  - `formatPercentage(value, { precision: number, showSign: boolean })`
  - `formatBasisPoints(value)`
  - `formatMultiple(value)` (for valuation multiples like EV/EBITDA)
  - `formatGrowth(value)` (always shows +/- sign)
  - `formatDelta(current, previous)` (returns formatted change with direction indicator)
- Define formatting presets: `CHART_AXIS`, `TABLE_CELL`, `TOOLTIP`, `HEADLINE`, `EXPORT`.
- Every number in the UI must go through a formatter. Never use raw `.toFixed()` or template literals for financial numbers.
- Write unit tests for edge cases: zero values, negative values, very large numbers (>10,000 Cr), very small numbers (<1 Cr), null/undefined/NaN.

**Warning signs:**
- Any raw number rendering without a formatter function.
- The string "toFixed" appearing in component files.
- Different modules showing different representations of the same metric for the same company.
- Users reporting "the numbers don't match" between modules.

**Phase to address:** Phase 1 (Foundation) -- the formatting library must be the first utility built, before any data display component. It should have 100% unit test coverage.

**Confidence:** HIGH -- Indian number formatting challenges are well-documented. Financial data display standards are established in the consulting industry.

---

### Pitfall 6: PDF/Export as an Afterthought

**What goes wrong:**
The team builds beautiful interactive charts using SVG-based libraries, then discovers in month 3 that the MD wants to "download this as a PDF" to email before a board meeting, or "export to PowerPoint" for a pitch deck. SVG charts do not render correctly in server-side PDF generation. Interactive elements (tooltips, drill-downs, animations) disappear. The layout that works at 1440px browser width does not work at A4/Letter PDF dimensions. Chart colors that look great on screen are illegible when printed in grayscale.

The brief says the user "walks into meetings with this tool." That means offline access or at minimum PDF export of key pages is a day-one requirement, not a nice-to-have.

**Why it happens:**
- Web-first development assumes screen rendering. PDF is a fundamentally different rendering context (fixed dimensions, no interactivity, different color space, pagination).
- Chart libraries are designed for interactive web use. Their SVG output may not be compatible with PDF renderers (e.g., CSS-based styling, embedded fonts, gradients).
- Layout assumptions (responsive, scroll-based) do not translate to fixed-page documents.

**How to avoid:**
- Design components with a "print/export" mode from the start. Every chart component should accept a `mode: 'interactive' | 'static'` prop that controls whether animations, tooltips, and hover effects are included.
- Use a headless browser approach (Puppeteer/Playwright running server-side) for PDF generation rather than trying to convert DOM to PDF client-side. This preserves visual fidelity.
- Create a separate "report layout" CSS that targets print dimensions. Use `@media print` and export-specific Tailwind classes.
- Design chart color palettes that work in both color and grayscale. Test by printing. Add pattern fills or labels as fallbacks for color-only differentiation.
- Build the "Executive Snapshot" page as a single A4-friendly layout from the start. This is the page they will print most often.

**Warning signs:**
- No `@media print` styles in the codebase.
- Chart components have no concept of static vs. interactive rendering.
- The team has never printed a page from the app.
- Export discussions keep getting pushed to "later phases."

**Phase to address:** Phase 1 (Architecture) must define the dual-mode component pattern. Phase 2 (Module Build) must implement static rendering for each chart. Phase 3 or 4 should implement the actual PDF pipeline. But the architecture must support it from day one.

**Confidence:** MEDIUM -- PDF generation approaches evolve frequently. The architectural principle (design for it early) is HIGH confidence; specific library recommendations would need phase-specific research.

---

### Pitfall 7: Data Loading Waterfall Across 10 Report Modules

**What goes wrong:**
The dashboard loads Module 1's data, then Module 2's, then Module 3's -- sequentially. Each module makes its own API call, waits for the response, parses it, then renders. With 10 modules, the page takes 8-12 seconds to fully populate. The user sees a cascade of loading spinners, which feels broken even if each individual module loads quickly.

Alternatively, the team tries to load all data upfront in a single massive API call. Now the initial load takes 4-5 seconds with a blank screen, and any filter change requires re-fetching everything.

**Why it happens:**
- Each module is built independently with its own data fetching logic.
- No shared data layer or query coordination.
- No distinction between "data needed for initial view" and "data needed on demand."

**How to avoid:**
- Implement a data prefetching strategy based on module visibility:
  - **Above-the-fold modules** (Executive Snapshot, Market Pulse): fetch immediately, show skeleton loaders.
  - **Below-the-fold modules**: fetch when the user scrolls near them (Intersection Observer) or prefetch after above-the-fold completes.
  - **Detail/drill-down data**: fetch on interaction only.
- Use a query library (TanStack Query) to deduplicate requests, cache responses, and coordinate refetching. If Module 1 and Module 3 both need the company financial dataset, it should be fetched once.
- Design the API to support partial responses: the Executive Snapshot should not require the full 50-company detailed dataset -- it needs aggregated signals only.
- Show meaningful skeleton loaders, not spinners. Skeleton loaders that match the actual content layout feel faster than a spinning circle.

**Warning signs:**
- Multiple API calls for the same underlying data.
- Page load time >3 seconds for the initial meaningful paint.
- Users complaining the app is "slow" even though individual module response times are acceptable.
- Network tab showing 10+ parallel or sequential API requests on page load.

**Phase to address:** Phase 1 (Architecture) -- define the data layer and query strategy. This determines how every module fetches and shares data.

**Confidence:** MEDIUM-HIGH -- TanStack Query patterns are well-established. The specific API design requires coordination with the backend team (which is separate per the brief).

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding tenant config in environment variables | Fast first-tenant setup | Cannot scale beyond 3-4 tenants; deploy-per-tenant instead of config-per-tenant | Never -- use a tenant config service from day one |
| Using `any` type for financial data objects | Faster initial development | Every module interprets data differently; bugs from accessing wrong fields; impossible to refactor safely | Never -- define TypeScript interfaces for every financial data shape on day one |
| Skipping responsive design for mobile | MDs use laptops, focus on desktop | iPad usage in meetings is common; presentation mode fails; demo scenarios break | Acceptable for MVP if tablet breakpoint is included; skip phone only |
| Inline chart configuration | Each chart is self-contained and easy to understand | 10 modules x 3 charts = 30 chart configs to update when changing the brand palette or adding a new metric | Never -- extract chart config factories |
| Mock data as static JSON files | Fast prototyping without backend | Mock data shape drifts from real API; edge cases (null values, empty datasets, very large numbers) are never tested | Acceptable in Phase 1 only if mock data matches the agreed API contract exactly |
| Putting AI-generated text directly in component JSX | Quick to show the AI insight feature | Cannot update AI prompt/model without changing components; no separation between content generation and presentation | Never -- AI content should be a data layer concern, not a component concern |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Backend API (financial data) | Building frontend against assumed API shape, then discovering the real API returns different structures | Define TypeScript API contracts (interfaces) first; use them to generate both mock data and API client. Backend team validates against the same contract |
| AI/LLM integration (insight generation) | Calling AI APIs from the frontend, creating latency and exposing API keys | AI-generated insights should be pre-computed by the backend and served as data. The frontend renders text, not generates it |
| Authentication/tenant resolution | Using a single auth flow and bolting on tenant awareness later | Tenant must be resolved at auth time (from subdomain, login flow, or token claims). Every API call must carry tenant context. Build this into the auth wrapper from Phase 1 |
| Third-party financial data sources | Assuming data is clean and complete; building UI that breaks on missing values | Defensive data layer: every field has a fallback, every chart handles empty/partial data gracefully, every metric shows "Data unavailable" rather than NaN or blank |
| PDF export service | Trying to do PDF generation client-side with libraries like jsPDF or html2canvas | Use server-side headless browser (Puppeteer/Playwright) for visual fidelity. Client-side PDF generation cannot reliably reproduce complex SVG charts |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Rendering all 50 companies in a comparison table without virtualization | Smooth at 10 companies; janky scroll at 30+; unusable at 50+ with multiple metric columns | Use TanStack Virtual or similar row virtualization. Only render rows in the viewport | >25 companies with >5 metric columns |
| SVG charts with one path per data point in time series | Fine for 12-month data; slow for 5-year weekly data | Downsample data for chart rendering (show monthly aggregates on wide zoom, weekly on narrow). Keep full-resolution data for tooltips/export | >200 data points per series, or >5 series |
| Unthrottled filter interactions (typing in search, sliding date range) | Each keystroke or slider position triggers a full data re-filter and chart re-render | Debounce filter inputs (300ms for text, 150ms for sliders). Use `useDeferredValue` for non-urgent filter updates | Any interactive filter connected to a chart with >100 data points |
| Loading all 10 modules' data on initial page render | Acceptable at fast connection speeds; terrible on hotel/conference WiFi (where MDs often use the tool) | Lazy-load below-fold modules. Prefetch on hover/scroll-near. Cache aggressively (financial data changes monthly, not in real-time) | >500KB total API response size or >3 concurrent API calls |
| Storing full company profiles in React context for "global access" | Works for prototype; causes entire app to re-render when any company data updates | Use a proper state management approach: TanStack Query for server state, component-local state for UI state. Context only for truly global, rarely-changing values (tenant config, auth) | >10 components consuming the context |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Tenant data bleeding across instances | BCG sees A&M's deal pipeline or proprietary analysis. This is a company-ending trust violation for a consulting intelligence tool | Tenant isolation at every layer: API calls scoped by tenant ID from auth token, frontend state cleared on tenant switch, no cross-tenant data in cache. Test with multi-tenant QA scenarios |
| Exposing financial data source identifiers in frontend code | Competitors or companies being analyzed could identify data sources, creating legal/relationship risk | All data source attribution should be server-side only. Frontend receives processed data without source metadata |
| Client-side API key storage for AI/data services | API keys in environment variables are bundled into the JS and visible in browser DevTools | All third-party API calls must go through the backend. Frontend never holds API keys for AI, financial data, or any external service |
| Caching sensitive deal data in browser storage | Deal intelligence (M&A, PE investments) is highly sensitive. Browser localStorage/sessionStorage persists across sessions and is accessible via DevTools | Use in-memory state only for deal data. If caching is needed, use encrypted session storage with short TTLs. Clear on logout |
| Unprotected PDF export endpoint | Anyone with the URL can download full reports without authentication | PDF generation must require valid auth token. Generated PDFs should include tenant watermark and access timestamp |

## UX Pitfalls

Common user experience mistakes specific to consulting intelligence tools.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Showing raw data tables first, insights second | MD has to scroll past a 50-row table to find the "so what." They leave before reaching the insight | Lead with the AI-generated insight or headline metric. Table is the supporting evidence, shown on demand (expand/click) |
| Requiring filter configuration before showing any data | "Select companies, select time period, select metrics" -- 3 clicks before seeing anything | Show a sensible default view (all tracked companies, latest quarter, key metrics). Allow refinement from there |
| Using chart types that require explanation | Scatter plots with unlabeled axes, radar charts with 8+ axes, heat maps with non-obvious color scales | Stick to bar charts (comparison), line charts (trends), and tables (detail). MDs know these instantly. If you must use an exotic chart, it needs a text annotation explaining what it shows |
| Cramming all 10 modules into a single scrollable page | Information overload. The MD cannot find the one module they need before their meeting | Use a tab/section navigation with clear labels matching the brief's module names. Let users bookmark/favorite specific modules. The Executive Snapshot is always the landing page |
| Tiny, dense typography optimized for pixel density | Looks impressive in a design review; illegible on a projector or iPad at arm's length | Minimum 14px body text, 18px for headline metrics. Test at 75% zoom and on a projector. The MD may be presenting this to their team |
| Interactive elements without clear affordance | Clickable cards that look like static text; expandable sections without expand indicators | Use obvious interactive cues: underlines for links, chevrons for expandable sections, hover states for clickable elements. MDs will not "discover" hidden interactions |
| No "last updated" timestamp | MD walks into a meeting citing stale data because they did not realize the report had not refreshed | Show "Data as of: [date]" prominently on every module. Color-code: green for current month, yellow for last month, red for older |
| Overwhelming color usage in charts | Rainbow charts with 15 colors for 15 companies make it impossible to identify any single company | Limit chart series to 5-7 companies per view. Use a "highlight + gray" pattern: selected company in brand color, others in muted gray. Let users select which companies to highlight |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Financial Performance Tracker:** Often missing handling for companies with non-standard fiscal years (e.g., March-end vs December-end) -- verify that YoY comparisons align fiscal periods, not calendar periods
- [ ] **Deal Tracker:** Often missing "rumored" vs "confirmed" status -- verify that deal pipeline shows confidence level and data source freshness
- [ ] **AI-Generated Insights:** Often missing edge case handling for months with no significant changes -- verify that the AI produces a "no major shifts this period" message rather than hallucinating trends
- [ ] **Company Comparison Charts:** Often missing handling for companies entering/exiting the tracked universe (IPO, delisting, acquisition) -- verify that historical charts handle companies that did not exist in earlier periods
- [ ] **Export/PDF:** Often missing page break logic -- verify that tables do not split rows across pages, charts do not get cut off
- [ ] **White-labeling:** Often missing email templates, PDF headers, and error pages -- verify that every user-facing surface carries tenant branding, not just the main dashboard
- [ ] **Number Formatting:** Often missing the edge case where a metric is "Not Applicable" vs "Data Not Available" vs "Zero" -- verify that each has distinct visual treatment
- [ ] **Responsive Layout:** Often missing tablet landscape mode (the most common iPad orientation for presentations) -- verify that the 1024px-1366px range renders correctly
- [ ] **Loading States:** Often missing skeleton loaders for chart components -- verify that every module has a meaningful loading state, not just a spinner
- [ ] **Error Boundaries:** Often missing per-module error isolation -- verify that one module's API failure does not crash the entire dashboard

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Derived state in effects | MEDIUM | 1. Audit all useEffect hooks for setState calls. 2. Extract computation into useMemo or inline calculations. 3. Test each module for render count regression. Typically 2-3 days for 10 modules |
| Hardcoded brand identity | HIGH | 1. Audit all color/font references across components. 2. Create semantic token map. 3. Replace literal values with tokens. 4. Extract tenant config. Typically 1-2 weeks. Riskiest recovery -- touches every component |
| Dashboard instead of briefing UX | HIGH | 1. Redesign information hierarchy (this is a UX rearchitecture, not a code fix). 2. Rebuild landing page and module entry points. 3. Add insight headlines to every chart. Typically 2-3 weeks. Requires UX design work, not just code |
| Chart re-rendering performance | LOW-MEDIUM | 1. Add React.memo to chart wrappers. 2. Memoize data transformations. 3. Profile and fix remaining hot spots. Typically 1-2 days per module |
| Number formatting inconsistency | MEDIUM | 1. Build centralized formatter. 2. Find-and-replace all number rendering. 3. Add visual regression tests. Typically 3-5 days for full app |
| PDF export retrofit | HIGH | 1. Add static mode to all chart components. 2. Build print-friendly layout. 3. Set up server-side rendering pipeline. Typically 2-3 weeks if not designed for from the start |
| Data loading waterfall | MEDIUM | 1. Introduce TanStack Query or similar. 2. Deduplicate data fetching. 3. Add prefetching and caching. Typically 3-5 days |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Derived state in effects | Phase 1: Foundation | Code review checklist: no useEffect + setState pairs for computed values. React DevTools render count < 3 per interaction |
| Hardcoded brand identity | Phase 1: Foundation | Can swap tenant theme by changing one CSS import. Zero hex values in component files. `grep -r '#[0-9a-fA-F]{6}' src/components/` returns zero results |
| Dashboard-vs-briefing UX | Phase 1: UX Design | User test with 3 people who match the MD persona. Success = extract 3 talking points in under 2 minutes without guidance |
| Chart re-rendering | Phase 2: Module Build | React DevTools Profiler: changing one module's filter causes zero re-renders in other modules. No interaction causes >16ms frame time |
| Number formatting | Phase 1: Foundation | 100% unit test coverage on formatters. Visual snapshot tests for every number format in every context (table, chart, tooltip, headline) |
| PDF export architecture | Phase 1: Architecture | Component API supports `mode: 'static'` prop. At least one module renders correctly in `@media print` by end of Phase 2 |
| Data loading waterfall | Phase 1: Architecture | Initial meaningful paint (Executive Snapshot visible) in <2 seconds on throttled 3G. Full page load <5 seconds on broadband |
| Tenant data isolation | Phase 1: Foundation | Automated test: two tenant sessions cannot access each other's data. Auth token carries tenant scope |
| Financial data edge cases | Phase 2: Module Build | Test matrix covering: null values, zero values, negative values, very large values, fiscal year misalignment, companies entering/exiting universe |
| AI insight quality | Phase 3: AI Integration | Defined fallback behavior for no-change periods, partial data, and AI service outages. Human review process for generated insights |

## Sources

- React official documentation -- "You Might Not Need an Effect" (react.dev) -- Verified HIGH confidence for derived state and effect chain pitfalls
- React official documentation -- "useMemo" (react.dev) -- Verified HIGH confidence for memoization guidelines
- Tailwind CSS v4 official documentation -- "@theme directive" (tailwindcss.com/docs/theme) -- Verified HIGH confidence for white-labeling architecture
- NNGroup dashboard design research (nngroup.com) -- training data, MEDIUM confidence for UX pitfalls
- Consulting industry UX patterns and financial data visualization conventions -- training data, MEDIUM confidence
- Multi-tenant SaaS architecture patterns -- training data, MEDIUM confidence for security and isolation patterns
- Indian financial data formatting (INR/Cr/Lakh system) -- training data, HIGH confidence (well-established domain knowledge)

---
*Pitfalls research for: AI-driven Industry Intelligence Dashboard / Multi-Tenant Consulting BD Platform*
*Researched: 2026-02-15*
