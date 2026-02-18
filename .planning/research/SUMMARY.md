# Project Research Summary

**Project:** AI-driven Industry Intelligence Dashboard / Consulting BD Radar
**Domain:** Multi-tenant SaaS intelligence platform for consulting firms (Consumer Durables mid-market India)
**Researched:** 2026-02-15
**Confidence:** MEDIUM-HIGH

## Executive Summary

This is an interactive industry intelligence dashboard built as a multi-tenant SaaS product for consulting firms (BCG, A&M, etc.) conducting business development in India's Consumer Durables sector. Unlike traditional analytics dashboards, this is a monthly curated briefing that answers "which companies need consulting help and why?" The buyer persona is time-poor MDs/Partners who need 5-minute actionable intelligence, not self-service BI.

The recommended stack is constrained (React 19 + Vite 7 + TypeScript 5 + Tailwind CSS v4) with a strong emphasis on headless UI components for white-label theming. Recharts handles visualization, TanStack libraries provide data management and tables, and the architecture centers on a JSON-driven section-module pattern where each of 10 report modules is self-contained. The backend (Express/Supabase) delivers shaped JSON data via REST APIs.

Critical risks include: (1) treating this as a dashboard instead of a briefing document (wrong information hierarchy), (2) hardcoding brand identity instead of using theme tokens (blocks multi-tenant scaling), (3) uncontrolled chart re-rendering on filter changes (performance collapse), and (4) derived financial metrics stored in effect chains (cascading re-render bugs). All four risks must be addressed in Phase 1 architecture or recovery becomes expensive. The white space this product occupies—India mid-market intelligence with AI-driven BD signals for consulting firms—has no direct competitor, making feature focus and UX execution more important than technical sophistication.

## Key Findings

### Recommended Stack

The stack is heavily constrained by project requirements (React 19, TypeScript 5, Vite 7, Tailwind CSS v4) and informed by the existing Kompete codebase. The core shift from Kompete is eliminating Ant Design in favor of headless UI primitives (Radix UI) to enable proper multi-tenant white-labeling.

**Core technologies:**
- **React 19 + Vite 7** — constrained by project. React 19's use() hook and improved Suspense are useful for async data loading. Vite 7 provides fast HMR essential for iterating on 10+ dashboard modules.
- **Tailwind CSS v4** — constrained. v4's @theme directive with CSS custom properties is the foundation for multi-tenant white-labeling. Each tenant gets a CSS file overriding theme variables; no JS-based theming.
- **Recharts 3.7** — proven in Kompete. Declarative React components for financial charts (line, bar, area, pie, treemap). SVG-based means CSS-styleable for white-labeling. Supports React 19 explicitly.
- **Radix UI primitives** — headless accessible components (dialog, popover, tooltip, select). Fully styled via Tailwind. Replaces Ant Design to avoid CSS-in-JS conflicts.
- **TanStack Query** — server state management. Handles caching, stale-while-revalidate, background refetch for JSON data from Express/Supabase. Eliminates useEffect fetch patterns.
- **Zustand** — lightweight client state (filters, UI toggles). For data that stays client-side only. Simpler than Redux, more performant than Context for shared state.

**What NOT to use:**
- Ant Design (used in Kompete) — CSS-in-JS conflicts with Tailwind v4's CSS-first theming. Bundle bloat. Fights white-label requirements.
- Redux Toolkit — ceremony overhead for simple client state. Server state belongs in TanStack Query.
- Next.js/Remix — this is a SPA dashboard for authenticated users, not an SEO site. SSR adds complexity without benefit.

### Expected Features

Research identifies 3 feature categories: table stakes (expected by users), differentiators (competitive advantage), and anti-features (commonly requested but problematic).

**Must have (table stakes):**
- **Company profiles with standardized financials** — every competitor (PitchBook, Capitaline) has this. Users expect revenue, EBITDA, margins in consistent format.
- **Time-series financial comparison** — compare Company A vs Company B across quarters. Chart-driven, QoQ/YoY views.
- **Deal & transaction tracker** — M&A, PE investments, IPO filings. Core signal for consulting BD.
- **Executive summary/snapshot** — AI-generated monthly brief. 5 bullets, big themes, red flags. This is the landing page.
- **Competitive benchmarking view** — side-by-side comparison of 3-5 companies on key metrics. Used in every consulting pitch.
- **Export/download** — PDF/CSV minimum. Partners take intelligence into their own decks.
- **Multi-tenant branding** — each consulting firm expects their instance with their logo and colors.
- **Monthly cadence content** — clear "February 2026 edition" framing. Not real-time alerting.

**Should have (competitive differentiators):**
- **BD Signal Scoring** — composite "who needs help?" scoring from financial stress + leadership changes + operational disruption. This is THE core differentiator. No existing platform does this.
- **Action Lens** — persona-based interpretation. "What this means for PE investors" vs "for COOs." Pre-interpreted intelligence saves analyst hours.
- **AI variance analysis** — not just "EBITDA margin: 8.2%" but "EBITDA margin declined 180bps QoQ, driven by raw material cost inflation, 230bps below segment average."
- **Meeting prep mode** — 1-click company brief for BD meetings. Pulls from all modules into a structured 1-pager.
- **90-day forward indicators** — predictive signals (likely fundraise, margin inflection, consolidation target). Forward-looking vs backward-looking competitors.

**Defer (v2+):**
- Real-time alerting — destroys monthly cadence value prop. Consulting Partners want curated briefings, not 50 alerts/week.
- Build-your-own-dashboard — massive complexity. Value is editorial curation, not self-service BI.
- Social media monitoring — noisy signal for BD intelligence. Track management commentary and filings instead.
- Automated client-facing PDF reports — conflates internal BD tool with client deliverables. Different quality bars and liability.

**Anti-features (avoid):**
- Real-time push notifications (explicitly out of scope per PROJECT.md)
- Comprehensive news feed aggregation (becomes noise machine; Google Alerts already exists)
- Covering 50+ companies day one (data quality collapses at scale without mature pipelines)

### Architecture Approach

The architecture centers on a **JSON-driven section-module pattern** where each of 10 report sections is self-contained. Backend shapes data to match frontend type contracts; sections render the data they receive without fetching or transforming.

**Major components:**
1. **BrandProvider (Context)** — resolves tenant from URL slug, injects brand tokens as CSS custom properties. All components consume via Tailwind classes. Zero prop drilling. This is the multi-tenant architecture foundation.
2. **Report Shell** — sidebar navigation across 10 sections, header with branding, layout container. Uses React Router v7 data router APIs.
3. **Section Modules (x10)** — self-contained folders for Executive Snapshot, Market Pulse, Financial Tracker, Deals, Operational Intelligence, Leadership Watch, Competitive Moves, Sub-Sector Deep Dive, Action Lens, Watchlist. Each receives typed JSON props, renders itself, never fetches data.
4. **SectionRenderer** — maps section ID to component, handles loading/error states, lazy-loads modules via React.lazy() for code splitting. Only active section's code is loaded.
5. **Filter Store (Zustand)** — global state for company selection, sub-category, performance rating, time period. Sections subscribe via hooks. Filter changes trigger client-side data re-filtering without API calls.
6. **Shared UI Primitives** — chart wrappers (TrendLineChart, BarComparisonChart), data display (StatCard, TrendIndicator, PerformanceTag), all consuming brand CSS variables automatically.

**Data flow:** User hits URL → tenant resolution → brand CSS injection → report metadata fetch → section lazy-load on navigation → section data fetch (cached) → render. Filters update Zustand store → subscribed sections re-render with filtered data.

**Critical pattern: Theme tokens via CSS custom properties.** Each tenant has a CSS file:
```css
@theme {
  --color-brand-primary: #1e40af;
  --color-brand-accent: #0d9488;
}
```
Charts, components, and Tailwind utilities consume these. Switching tenants = swapping one CSS import. No React re-renders.

### Critical Pitfalls

**Top 5 pitfalls (all must be prevented in Phase 1):**

1. **Storing derived financial metrics in component state** — with 10 modules and dozens of computed metrics (YoY growth, variance-vs-average, QoQ deltas), effect chains create cascading re-render bugs and flicker. **Solution:** Compute inline during render or use useMemo with proper dependencies. Never useEffect + setState for calculations.

2. **Hardcoded brand identity** — colors, fonts, logos scattered across files as literal values. Second tenant requires forking the codebase. **Solution:** Tailwind v4 @theme with CSS custom properties from day one. Zero hex values in component files. Brand config in tenant CSS files only.

3. **Building a dashboard instead of a briefing** — traditional analytics dashboard with filters/drill-downs fails the user need. MDs need a 5-minute document, not an exploration workbench. **Solution:** Narrative-first information architecture. Executive Snapshot is landing page. Every chart has an insight headline above it. Progressive disclosure (headline first, chart on expand).

4. **Uncontrolled chart re-rendering** — filter changes trigger full SVG re-renders across all charts. With 50-company comparison charts, this causes 500ms frame drops. **Solution:** React.memo on chart wrappers, useMemo for data transformations, isolate filter state so Module 3 filters don't re-render Modules 1, 2, 4-10.

5. **Financial number formatting inconsistency** — same revenue shows as "Rs 2,345 Cr" in one module, "INR 2345 Crore" in another. Indian numbering (lakhs/crores) is non-standard. **Solution:** Centralized formatters.ts with formatCurrency(), formatPercentage(), formatBasisPoints() built in Phase 1. Zero raw .toFixed() in component files. 100% test coverage.

**Other key pitfalls:**
- PDF/export as afterthought — design components with `mode: 'interactive' | 'static'` prop from start
- Data loading waterfall — use TanStack Query for deduplication and caching, prefetch adjacent modules
- Tenant data bleeding — tenant isolation at every layer, test with multi-tenant QA scenarios

## Implications for Roadmap

Based on combined research, suggested phase structure prioritizes foundation → data infrastructure → modules → AI layers → polish.

### Phase 1: Foundation & Architecture
**Rationale:** Theme tokens, formatting utilities, typed data contracts, and component isolation patterns MUST exist before building any modules. These are the non-negotiable architectural decisions that become expensive to retrofit. ARCHITECTURE.md explicitly maps "Foundation" as the first build phase.

**Delivers:**
- BrandProvider with CSS custom properties for multi-tenant theming
- formatters.ts library (INR/Cr/%, basis points, growth rates)
- TypeScript data contract interfaces for all 10 section JSON shapes
- Shared UI primitives (SectionCard, StatCard, TrendIndicator, ErrorCard, SectionSkeleton)
- Chart wrappers consuming brand tokens (TrendLineChart, BarComparisonChart base implementations)
- App shell with React Router v7, error boundaries, tenant resolution

**Addresses pitfalls:**
- Hardcoded brand identity (Pitfall 2) — prevented via theme token architecture
- Number formatting inconsistency (Pitfall 5) — prevented via centralized formatters
- Derived state in effects (Pitfall 1) — established pattern: compute inline or useMemo

**Research needs:** STANDARD PATTERNS — React, Tailwind v4, TypeScript project setup is well-documented. Skip /gsd:research-phase.

---

### Phase 2: Data Layer & Report Shell
**Rationale:** Data fetching, state management, and the report container must be operational before building content modules. This establishes how sections load data, how filters work, and how navigation between modules behaves. Dependency: Phase 1 types define API contracts.

**Delivers:**
- API client with typed endpoints (data/api-client.ts, data/report-api.ts)
- TanStack Query integration for server state caching
- Zustand filter store (company selection, sub-category, performance, time period)
- Report Shell with section navigation sidebar
- SectionRenderer with React.lazy() code splitting
- FilterBar UI with company selector, filters

**Uses (from STACK.md):**
- TanStack Query for server state caching and background refetch
- Zustand for client-side filter state
- React Router v7 data router APIs

**Implements (from ARCHITECTURE.md):**
- Filter-Store Pattern (cross-section filtering without API refetch)
- Section Module Pattern (lazy-loaded, data-as-props)
- Data prefetching strategy (above-fold immediate, below-fold on scroll-near)

**Addresses pitfalls:**
- Data loading waterfall (Pitfall from PITFALLS.md) — TanStack Query deduplicates requests
- Chart re-rendering (Pitfall 4) — filter store isolates state, prevents cascade

**Research needs:** STANDARD PATTERNS — TanStack Query and Zustand patterns well-documented. Skip research-phase.

---

### Phase 3: Core Content Modules (Financial Foundation)
**Rationale:** Build the 4 data-heavy modules that form the intelligence foundation. Financial Tracker is most complex (15-20 companies x 7 metrics x 13 quarters) and will stress-test chart/table primitives. Other modules depend on financial data existing. From FEATURES.md priority matrix: all P1 table stakes features.

**Delivers:**
- Financial Performance Tracker (company financials table + time-series comparison charts)
- Deal & Transaction Tracker (M&A, PE/VC, IPO events with timeline visualization)
- Leadership Watch (CXO changes, board reshuffles, promoter stake changes)
- Executive Snapshot (AI-generated monthly summary, red flags, watchlist)

**Features (from FEATURES.md P1):**
- Company profiles with standardized financials
- Time-series financial comparison (QoQ/YoY)
- Deal tracking with strategic rationale annotations
- Executive summary with 5-bullet format
- Data recency indicators ("as of Q3 FY25")
- Source attribution on every metric

**Implements (from ARCHITECTURE.md):**
- Typed data contracts for CompanyFinancials, DealTransaction, LeadershipEvent, ExecutiveSnapshot
- Composable chart wrappers (TrendLineChart, BarComparisonChart used in Financial Tracker)
- DataTable primitive (TanStack Table, headless styling) for financial metrics table

**Addresses pitfalls:**
- Dashboard-vs-briefing UX (Pitfall 3) — Executive Snapshot is narrative landing page
- Financial number formatting (Pitfall 5) — all metrics use formatters.ts

**Research needs:** MINOR RESEARCH for Financial Tracker — TanStack Table configuration for 15-20 companies x 7 metrics with virtualization. Rest is standard.

---

### Phase 4: Operational & Competitive Intelligence Modules
**Rationale:** Add the modules that track operational signals and competitive moves. These build on the company universe and financial data from Phase 3 but add new data dimensions (supply chain, capacity, product launches). From FEATURES.md: P1-P2 table stakes to differentiators transition.

**Delivers:**
- Operational Intelligence (supply chain signals, capacity changes, retail expansion/closures)
- Competitive Moves (product launches, pricing actions, D2C initiatives, partnerships)
- Market Pulse (macro demand signals, input cost trends, margin outlook, channel mix shifts)
- Sub-Sector Deep Dive (rotating monthly deep dive into AC, refrigerator, washing machine, etc. sub-segments)

**Features (from FEATURES.md):**
- Operational signal tracking (table stakes per competitor parity)
- Competitive benchmarking view (table stakes)
- Macro context layer (Market Pulse adds sector-level signals)
- Sub-segment cost structure benchmarks (differentiator)

**Uses (from STACK.md):**
- Recharts treemap for sub-sector market share visualization
- Recharts heatmap (or Nivo heatmap if Recharts insufficient) for cost structure comparison
- TanStack Table for operational events timeline

**Addresses pitfalls:**
- None specific — builds on foundation from Phases 1-2

**Research needs:** MODERATE RESEARCH for Sub-Sector Deep Dive — cost structure data models and heatmap visualization for margin levers need domain validation. Consider /gsd:research-phase.

---

### Phase 5: AI-Powered Intelligence Layers
**Rationale:** Add the AI-generated analysis features that transform raw data into consulting-grade intelligence. These require all data modules (Phases 3-4) to be operational because they synthesize across modules. From FEATURES.md: these are the P2 differentiators that create competitive moats.

**Delivers:**
- AI Variance Analysis (narrative on every financial metric: "why the change, vs. segment")
- BD Signal Scoring (composite "who needs help" scoring from financial stress + leadership + operational signals)
- Engagement Opportunity Classification (tag signals with service line: Turnaround, Growth Strategy, Cost Optimization, M&A Advisory)
- Action Lens module (persona-based interpretation: "What this means for PE investors" vs "for COOs")

**Features (from FEATURES.md P2):**
- AI variance analysis (HIGH value, HIGH complexity) — differentiator
- BD signal scoring (THE core differentiator per FEATURES.md)
- Engagement opportunity classification (directly maps to consulting service lines)
- Action Lens persona views (genuinely novel per competitor analysis)

**Implements (from ARCHITECTURE.md):**
- AI content as data layer (backend pre-generates, frontend renders)
- Section modules consume AI-generated text via JSON props
- Scoring model UI (composite score breakdown, confidence indicators)

**Addresses pitfalls:**
- AI-generated text directly in JSX (technical debt pattern from PITFALLS.md) — prevented via data-layer approach
- Edge case handling for no-change periods (from PITFALLS.md "Looks Done But Isn't") — requires fallback messages

**Research needs:** SIGNIFICANT RESEARCH — AI signal scoring calibration, composite metric design, persona classification taxonomy need domain expertise. REQUIRES /gsd:research-phase for BD scoring model design.

---

### Phase 6: Export & Meeting Prep Tools
**Rationale:** Build the output features that let MDs take intelligence into meetings and presentations. These are high-value but require all content modules to be stable. From FEATURES.md: these turn "useful tool" into "must-have platform."

**Delivers:**
- PDF export (full report or selected modules, print-optimized layout)
- CSV export of data tables
- Meeting Prep Brief Generator (1-click company brief pulling from all modules)
- PowerPoint export (deck-ready slides)

**Features (from FEATURES.md):**
- Basic export (PDF, CSV) — P1 table stakes
- Meeting Prep Brief — P3 high-value differentiator
- PowerPoint export — P2 high-value differentiator (Partners live in PowerPoint)

**Uses (from STACK.md):**
- react-to-print for browser-native PDF generation
- html-to-image for individual chart PNG export
- PptxGenJS (future) for PowerPoint generation

**Implements (from ARCHITECTURE.md):**
- PrintableReport.tsx with all sections rendered sequentially
- Component dual-mode (interactive vs static) per PITFALLS.md recommendation
- Export-specific layouts via @media print

**Addresses pitfalls:**
- PDF export as afterthought (Pitfall 6) — architecture designed for it from Phase 1, implementation in Phase 6
- Chart components have static mode prop
- Print-friendly layouts tested

**Research needs:** MODERATE RESEARCH for PowerPoint export — PptxGenJS template design, branded slide layouts. Consider /gsd:research-phase.

---

### Phase 7: Advanced Intelligence (Forward-Looking)
**Rationale:** Add the predictive and deep-analysis features that are highest risk but highest value. These require historical calibration data and quality benchmarks from real usage. Defer until product-market fit established. From FEATURES.md: v2+ future consideration.

**Delivers:**
- 90-Day Forward Indicators (predictive signals: likely fundraise, margin inflection, consolidation target)
- Management Commentary Sentiment (NLP on earnings transcripts, tone shift tracking)
- Competitive Cluster Mapping (visual strategy clustering)

**Features (from FEATURES.md P3):**
- 90-day forward indicators (high value but high credibility risk)
- Management commentary sentiment (differentiator for Indian mid-market)
- Competitive cluster mapping (strategy white space identification)

**Addresses features:**
- Forward-looking signals (genuinely differentiated per FEATURES.md competitor analysis)
- But deferred to v2+ due to accuracy risk and need for calibration data

**Research needs:** SIGNIFICANT RESEARCH — time-series pattern recognition, financial projection models, NLP sentiment models, clustering algorithms. REQUIRES /gsd:research-phase for predictive modeling approach.

---

### Phase Ordering Rationale

**Why this order:**
1. **Foundation first (Phase 1)** — theme tokens, formatters, types are architectural decisions that become expensive to retrofit. From PITFALLS.md: hardcoded brand identity and number formatting are HIGH recovery cost.
2. **Data layer before content (Phase 2)** — establishes how all modules fetch and filter data. From ARCHITECTURE.md build order: data layer precedes sections.
3. **Financial modules first (Phase 3)** — Financial Tracker is most complex and will stress-test primitives. Executive Snapshot needs company data to exist. From FEATURES.md dependency graph: company data model is the foundation.
4. **Operational/competitive second (Phase 4)** — build on company universe from Phase 3, add new data dimensions.
5. **AI layers after data stable (Phase 5)** — AI features synthesize across modules. From FEATURES.md: AI variance analysis requires Financial Performance Tracker operational. BD scoring requires Financial + Leadership + Operational modules.
6. **Export after content stable (Phase 6)** — cannot export unstable layouts. From PITFALLS.md: export features need stable UI.
7. **Predictive features last (Phase 7)** — highest risk, needs real-world calibration. From FEATURES.md: defer to v2+ until product-market fit.

**Dependency chain (from ARCHITECTURE.md and FEATURES.md):**
```
Foundation (types, theme, formatters)
  → Data Layer (API client, stores)
    → Company Data Model
      → Financial Tracker
        → AI Variance Analysis
          → BD Scoring
            → Meeting Prep
      → Deals Tracker
      → Leadership Watch
      → Operational Intelligence
        → (feeds BD Scoring)
```

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 5 (AI Intelligence)** — BD signal scoring model design, composite scoring methodology, calibration approach. Domain-specific, no standard patterns. REQUIRES /gsd:research-phase.
- **Phase 7 (Forward Indicators)** — predictive modeling approach, confidence scoring, time-series pattern libraries. Complex, risk of credibility damage. REQUIRES /gsd:research-phase.
- **Phase 6 (PowerPoint Export)** — PptxGenJS integration, template design, branded slide generation. Moderate complexity. CONSIDER /gsd:research-phase.

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation)** — React + TypeScript + Tailwind v4 project setup is well-documented. Standard primitives.
- **Phase 2 (Data Layer)** — TanStack Query and Zustand patterns are mature and documented.
- **Phase 3 (Core Modules)** — Recharts, TanStack Table, data display components use established patterns. Minor research for virtualization only.
- **Phase 4 (Operational Modules)** — extends Phase 3 patterns. Sub-Sector Deep Dive needs moderate research for cost structure data models.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | **HIGH** | Core technologies verified via npm registry, peer dependencies checked. React 19 + Vite 7 + Tailwind v4 combination proven in Kompete. Recharts, TanStack libraries have explicit React 19 support. |
| Features | **MEDIUM** | Feature categories based on training data knowledge of CB Insights, PitchBook, AlphaSense, consulting industry practices. No web verification available. Core feature patterns (company profiles, financial data, deal tracking) are stable. AI-powered features (BD scoring, variance analysis) are novel and need validation. |
| Architecture | **HIGH** | Direct code examination of Kompete frontend and consumer-durables-intelligence prototype. Section-module pattern proven in prototype. BrandProvider with CSS custom properties verified against Tailwind v4 docs. React patterns (lazy, Suspense, memo) are official APIs. |
| Pitfalls | **MEDIUM-HIGH** | React rendering pitfalls verified against official React docs (HIGH). Multi-tenant theming verified against Tailwind v4 docs (HIGH). Dashboard UX and consulting-specific pitfalls based on domain knowledge and NNGroup research (MEDIUM). Indian financial formatting pitfalls based on established domain knowledge (HIGH). |

**Overall confidence:** MEDIUM-HIGH

Research is solid on technical stack (verified), architecture patterns (proven in codebase), and React best practices (official docs). Medium confidence on feature prioritization (based on competitor knowledge from training data, not current web research) and consulting BD use case specifics (domain expertise from training, not direct user research).

### Gaps to Address

**Gap 1: Indian financial data sourcing specifics**
- **Issue:** Research identifies MCA filings, BSE/NSE filings as data sources, but exact API integration patterns for Indian company data are not detailed.
- **Impact:** Affects Phase 3 (Financial Tracker) data pipeline design.
- **Mitigation:** Phase 3 planning should include backend API contract definition session. Frontend research focused on rendering; backend data sourcing is separate team concern per PROJECT.md.

**Gap 2: AI signal scoring calibration methodology**
- **Issue:** Research recommends BD signal scoring as core differentiator but does not specify the scoring algorithm or composite metric weights.
- **Impact:** Phase 5 cannot proceed without scoring model design.
- **Mitigation:** REQUIRES /gsd:research-phase before Phase 5. Need domain expertise on financial stress signals, consulting engagement triggers, and calibration approaches.

**Gap 3: Meeting Prep Brief content structure**
- **Issue:** Feature identified as "killer feature" but exact 1-pager format, content sections, and data extraction logic not specified.
- **Impact:** Phase 6 Meeting Prep feature.
- **Mitigation:** Prototype the 1-pager format in Phase 3-4 as modules stabilize. Gather samples from actual consulting firm briefing documents.

**Gap 4: Current state of competitor features (2026)**
- **Issue:** Competitor analysis (CB Insights, PitchBook, AlphaSense) based on training data; products may have evolved. Specifically: AI-powered features are rapidly evolving space.
- **Impact:** Feature differentiation assumptions may be outdated.
- **Mitigation:** During Phase 5 planning, validate competitor capabilities via demos/trial accounts. Does not block earlier phases.

**Gap 5: Sub-sector cost structure data model**
- **Issue:** Sub-Sector Deep Dive requires detailed cost structure benchmarks (COGS breakdown, margin levers). Data model not defined.
- **Impact:** Phase 4 Sub-Sector Deep Dive module.
- **Mitigation:** This may warrant /gsd:research-phase for Phase 4 specifically for cost structure data model design and visualization approach.

## Sources

### Primary (HIGH confidence)
- **Kompete frontend codebase** (`/frontend/src/`) — App.jsx, Report.jsx, MarketOverview.jsx, ComparisonMatrix.jsx, QuarterlyTrendChart.jsx, StatBox.jsx, api.js. Direct code examination. Validates React patterns, chart library usage, component structure, API integration approach.
- **Consumer Durables Intelligence prototype** (`/consumer-durables-intelligence/`) — app.js, data.js, charts.js, filters.js. Direct code examination. Proves section-module pattern, data shapes, filter interactions.
- **React 19 official documentation** (react.dev) — use() hook, Suspense, useMemo, useEffect best practices. Verified for Pitfall 1 (derived state), Pitfall 4 (re-rendering).
- **Tailwind CSS v4 official documentation** (tailwindcss.com) — @theme directive, CSS custom properties. Verified for Pitfall 2 (white-labeling architecture).
- **npm registry** (npmjs.com via `npm view`) — peer dependency verification for all recommended libraries (Recharts, TanStack Query, TanStack Table, Zustand, Radix UI, Motion, react-to-print). Confirms React 19 compatibility.

### Secondary (MEDIUM confidence)
- **CB Insights platform features** — training data knowledge. Company profiles, market intelligence, M&A tracking, AI-generated market maps. Confidence: MEDIUM (product features as of training cutoff May 2025; may have evolved).
- **PitchBook platform features** — training data knowledge. Deal database, PE/VC intelligence, company financials. Industry-standard reference. Confidence: MEDIUM.
- **AlphaSense platform features** — training data knowledge. AI-powered search, Smart Summaries, sentiment analysis. Confidence: MEDIUM.
- **Bain/McKinsey industry report structures** — training data knowledge. Executive summary → benchmarking → strategic themes format. Consulting-grade intelligence structure is stable. Confidence: HIGH.
- **NNGroup dashboard design research** — training data knowledge. Dashboard vs. briefing UX, progressive disclosure, narrative information architecture. Confidence: MEDIUM.
- **Multi-tenant SaaS architecture patterns** — training data knowledge. CSS custom properties for theming, tenant isolation, brand token systems. Confidence: MEDIUM (patterns are stable, but specific implementation varies).

### Tertiary (LOW confidence, requires validation)
- **Indian financial data APIs** (MCA, BSE/NSE) — training data knowledge. Filing structures, data lag, API patterns. Confidence: LOW (backend integration concern, not frontend research scope).
- **AI signal scoring for consulting BD** — inferred from training data on financial distress signals, but no direct examples of "BD radar scoring" products. Confidence: LOW (novel feature, needs domain validation).
- **Current 2026 state of competitor AI features** — training data cutoff May 2025. AI landscape evolves quickly. Confidence: LOW (validate during Phase 5 planning).

---
*Research completed: 2026-02-15*
*Ready for roadmap: YES*
