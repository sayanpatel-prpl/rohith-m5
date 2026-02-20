# Project Research Summary

**Project:** A&M Consumer Durables Intelligence Dashboard (v2)
**Domain:** Consulting-Grade Sector Intelligence Dashboard
**Researched:** 2026-02-20
**Confidence:** HIGH

## Executive Summary

This is a React + TypeScript SPA providing 10 interconnected intelligence sections covering the Indian Consumer Durables sector with 16 major companies. Research shows that consulting-grade intelligence dashboards require three critical differentiators beyond standard BI tools: transparent source attribution, presentation-optimized delivery, and "beyond filings" alternative data integration.

The recommended approach builds on v1.0's proven foundation (React 19, TanStack Query, Zustand, Radix UI, Tailwind 4) while addressing performance bottlenecks through charting library migration (Recharts to Apache ECharts for 10x faster rendering) and introducing advanced intelligence features like Talk vs Walk verification and AI-powered signal detection. The architecture leverages client-side filtering with infinite cache for instant responses, multi-tenant theming via CSS custom properties, and single-file HTML distribution for offline capability.

The primary risk is presentation-day demo failures (research shows 81% of salespeople lose deals to bad demos). Mitigation requires fail-safe data strategy with automatic fallback to mock data, section-level error boundaries, and a 10-minute pre-flight checklist. Secondary risks include source attribution gaps (credibility crisis), dark mode token failures, and data integrity corruption during client-side filtering—all preventable through systematic validation and testing.

## Key Findings

### Recommended Stack

The v2 stack upgrades performance-critical components while maintaining proven architecture patterns. React 19 brings improved async state management (useActionState, useOptimistic), Vite 6 delivers 5x faster builds, and Tailwind CSS 4's CSS-based configuration eliminates JS config complexity.

**Core technologies:**
- **Apache ECharts 6** + **echarts-for-react 3**: Canvas rendering handles 10K+ data points (10x faster than Recharts SVG), 50+ chart types including financial charts and sparklines. Addresses current performance ceiling with 11 sections × 15 companies × quarterly data.
- **TanStack Table 8**: Headless table logic with full style control for multi-tenant branding, built-in sorting/filtering/pagination, supports inline sparklines via custom cell renderers.
- **TanStack Query 5** + **Zustand 5**: Proven state separation pattern (server state vs client state). Query handles data caching with `staleTime: Infinity` for daily-updated data, Zustand manages global filters with URL sync.
- **Radix UI 1.x**: Accessible headless primitives for dialog/popover/select/tabs. Matches existing v1.0 architecture, supports multi-tenant theming requirements.
- **@dnd-kit/core 6**: Modern drag-and-drop for pipeline views, kanban boards, column reordering. Replaces archived react-beautiful-dnd.
- **vite-plugin-singlefile 2**: Single HTML file output for offline distribution. Vite 6 compatibility confirmed, enables email/embed deployment.

**Migration considerations:**
- Keep: React, Vite, TypeScript 5, TanStack Query, Zustand, Radix UI (upgrade versions)
- Replace: Recharts → Apache ECharts (medium effort, well-documented migration)
- New: TanStack Table, dnd-kit, date-fns (if standardizing date formatting)

### Expected Features

Research identifies clear tier separation between table stakes, differentiators, and anti-features.

**Must have (table stakes):**
- **Multi-level drill-down**: Annual → quarterly → monthly → transaction level navigation. Standard in all modern BI tools.
- **Export to PDF/PowerPoint**: Consulting deliverables are deck-based. Clients expect offline viewing.
- **Multi-company comparison views**: Benchmarking is core to consulting intelligence. Side-by-side comparison minimum viable.
- **Source attribution on every metric**: Professional credibility requires visible sourcing. 4-tier confidence system already implemented.
- **Executive summary view**: Decision-makers expect high-level overview before details. McKinsey/BCG standard.
- **Presentation mode**: Clean, distraction-free view for client meetings. Hide filters/controls, keyboard navigation.
- **Mobile/tablet responsiveness**: Executives review on iPads during travel. Non-responsive = unusable.

**Should have (competitive differentiators):**
- **Talk vs Walk verification**: Cross-validate company statements (earnings calls) against operational data (hiring, capex). Surfaces discrepancies signaling distress/opportunity. Strong fit for A&M's turnaround/restructuring focus.
- **Beyond filings alternative data**: Integrate transaction data, web scraping, social sentiment. Reflects real-time market reality vs backward-looking filings.
- **AI-powered signal detection**: Proactive alerts when patterns indicate inflection points (deteriorating liquidity, market share shifts). Moves from reactive reporting to predictive intelligence.
- **Dynamic confidence scoring**: Visual indicators (color coding) show data reliability at metric level. Enhances existing 4-tier system with multi-source validation.
- **Automated battlecards**: Auto-generate competitive position summary, valuation benchmarks, key risks per pipeline opportunity. Saves 10+ hours per deal.

**Defer (v2+):**
- Scenario modeling (requires separate financial modeling engine)
- Cross-sector pattern matching (requires large historical dataset + ML models)
- Collaborative annotations (higher value for internal tools vs client deliverables)
- User-editable dashboards (consultant-designed structure is the product)

### Architecture Approach

The architecture follows proven React SPA patterns optimized for consulting intelligence delivery: client-side filtering with infinite cache, lazy-loaded sections with Suspense + error boundaries, bidirectional URL state sync, and multi-tenant theming via CSS custom properties.

**Major components:**

1. **Application Shell** — Routing, layout, global providers (BrandProvider, QueryClientProvider). Initializes TanStack Query with `staleTime: Infinity` for static data, sets up URL ↔ Zustand sync with ref guards to prevent loops.

2. **Data Layer** — API client with graceful degradation: tries real API (`VITE_API_URL`), falls back to mock data on failure. TanStack Query caches with infinite stale time, no refetch on focus/reconnect. Client-side filtering in `useMemo` (no filters in query keys).

3. **Section Components** — 10 lazy-loaded sections (executive, financial, deals, etc.) call `useFilteredData<T>(sectionId)` hook, export default for lazy loading. Wrapped in section-level error boundaries for isolated failures.

4. **Filter System** — Zustand store (companies, subCategory, performanceTier, timePeriod) synced bidirectionally with URL params. Filters applied client-side via `useMemo`, not server-side. Fuzzy company matching handles inconsistent display names.

5. **Multi-Tenant Branding** — `BrandProvider` extracts `tenantSlug` from route params, sets `data-tenant` attribute on root element. CSS custom properties scoped per tenant in `tokens.css`. Brand configs in TypeScript for type safety.

6. **Charting & Visualization** — Apache ECharts for performance (Canvas rendering, WebGL support). TanStack Table for data tables with custom cell renderers for inline sparklines. Chart theming via design token palette (5 colors).

### Critical Pitfalls

Research identified 13 pitfalls across critical/moderate/minor severity. Top 5 require proactive prevention:

1. **Presentation-Day Demo Failures** — 81% of salespeople lose deals to bad demos. Fail-safe data strategy (real API → mock fallback → static JSON), section-level error boundaries, 10-minute pre-flight checklist, backup video cued. Test on presentation laptop, not dev machine.

2. **Source Attribution Failures** — Data without clear attribution violates consulting standards, causes credibility crisis. Embed source metadata in data model (`provider`, `confidence`, `extractedAt`), visual attribution on every chart/table, build-time validation that `dataType: "mock"` blocked in production.

3. **Single-File HTML Build Failures** — vite-plugin-singlefile silently fails on SVGs/static assets. Test `dist/index.html` directly in browser (file:// protocol), use data URIs for critical assets, verify no external `<link>` or `<script src=` tags in built HTML.

4. **Dark Mode Token Failures** — CSS custom properties fail at runtime due to IACVT (Invalid At Computed Value Time). Use data-attribute pattern (`[data-theme="dark"]`), test both modes in every section, always provide fallbacks (`var(--text-primary, black)`).

5. **Data Integrity Corruption** — Filters applied incorrectly cause section mismatches, empty states when data exists. Bidirectional URL sync with ref guards, company ID matching (not display names), explicit `useMemo` dependencies, filter state validation.

## Implications for Roadmap

Based on research, suggested phase structure prioritizes foundation → intelligence → advanced features with systematic risk mitigation.

### Phase 1: Foundation & Core Infrastructure
**Rationale:** Solid data layer and filter system are prerequisites for all sections. Mock data enables parallel UI development. Source attribution must be baked into data model from day one (pitfall #2).

**Delivers:**
- Project setup (Vite 6 + React 19 + TypeScript 5 + Tailwind 4)
- Data layer with API client + fallback logic (pitfall #1 mitigation)
- TanStack Query configuration (`staleTime: Infinity`)
- Mock data files with source metadata for 1-2 sections
- Application shell (routing, layout, error boundaries, Suspense)

**Stack elements:** React 19, Vite 6, TypeScript 5, TanStack Query 5, vite-plugin-singlefile

**Avoids:** Source attribution gaps, build failures, API dependency blocking UI work

**Research needs:** Standard patterns, skip `/gsd:research-phase`

---

### Phase 2: Filter System & Theming
**Rationale:** Global filters are dependency for all sections. Multi-tenant theming affects every component, must be established before UI scaling. Dark mode testing now prevents phase 9 surprises (pitfall #4).

**Delivers:**
- Zustand filter store (companies, subCategory, performanceTier, timePeriod)
- URL sync hook with ref guards (pitfall #5 mitigation)
- `useFilteredData<T>` custom hook
- FilterBar component with Radix UI primitives
- Multi-tenant BrandProvider with CSS custom properties
- Dark mode support with theme validation

**Stack elements:** Zustand 5, Radix UI 1.x, Tailwind CSS 4 tokens

**Implements:** Filter System + Multi-Tenant Branding architecture components

**Avoids:** Data integrity corruption, dark mode token failures, global CSS conflicts

**Research needs:** Standard patterns, skip `/gsd:research-phase`

---

### Phase 3: MVP Section (Executive Snapshot)
**Rationale:** One complete section validates architecture before scaling. Executive summary is table-stakes feature and most-viewed section. Pattern established here replicates across remaining sections.

**Delivers:**
- Executive Snapshot section (lazy-loaded)
- Section-specific sub-components (BulletSummary, ThemeNarrative, RedFlagsTable)
- Loading skeletons matching content structure
- Section error boundary fallback UI
- Chart components (bar, line, scatter) with Apache ECharts
- CSV export functionality

**Features:** Executive summary view, presentation mode foundation, source attribution UI

**Stack elements:** Apache ECharts 6, echarts-for-react 3, Radix UI

**Avoids:** Inconsistent loading states, missing empty states, presentation-day failures

**Research needs:** Standard section patterns, skip `/gsd:research-phase`

---

### Phase 4: Section Scaling (Sections 2-6)
**Rationale:** Proven patterns accelerate development. Build 2-3 sections per week reusing MVP components. Extract common components to `src/components/` for reusability.

**Delivers:**
- Financial Performance section (TanStack Table with inline sparklines)
- Deals & Transactions section (DealCard, DealTimeline)
- Leadership Intelligence section
- Competitive Moves section
- Growth Triggers section
- Data table components with TanStack Table
- Reusable chart components (legend, tooltip, annotations)

**Features:** Multi-company comparison views, multi-level drill-down navigation

**Stack elements:** TanStack Table 8, Apache ECharts

**Avoids:** Performance degradation (virtualize large tables proactively), copy-paste errors

**Research needs:** Standard patterns, skip `/gsd:research-phase`

---

### Phase 5: Section Completion (Sections 7-10)
**Rationale:** Complete remaining sections with established patterns. Focus shifts to performance optimization and edge cases.

**Delivers:**
- Shareholding Pattern section
- Concall Highlights section
- Red Flags section
- Industry Trends section
- Performance optimization (virtualization for large tables, lazy loading audit)
- Mobile/tablet responsive layouts
- Print styles with page break logic

**Features:** Mobile/tablet responsiveness, print/export optimization

**Avoids:** Print layout breakage, performance issues with large datasets

**Research needs:** Standard patterns, skip `/gsd:research-phase`

---

### Phase 6: Export & Presentation Features
**Rationale:** Consulting deliverable requirements (PDF/PowerPoint export, presentation mode) are table stakes but not blocking for core functionality.

**Delivers:**
- Presentation mode UI toggle (hide filters, optimize for projection)
- PDF export via browser print (with print-specific CSS)
- PowerPoint export (optional, if high-value)
- Meeting prep brief generation (synthesized insights)
- Chart export to PNG/SVG

**Features:** Export to PDF/PowerPoint, presentation mode

**Stack elements:** Existing React components

**Avoids:** Print layout breakage, export failures during demos

**Research needs:** PDF export libraries if programmatic generation needed. Consider `/gsd:research-phase` if PowerPoint export required.

---

### Phase 7: Advanced Intelligence Features
**Rationale:** A&M differentiators (Talk vs Walk, alternative data, AI signals) require robust data pipeline + NLP capability. Build after core dashboard proves value.

**Delivers:**
- Talk vs Walk verification engine (NLP on qualitative sources + metric correlation)
- Alternative data integration (transaction data, job postings, pricing data)
- AI-powered signal detection (early warning alerts for distress signals)
- Dynamic confidence scoring enhancements (multi-source validation, decay over time)
- Alert system foundation (threshold rules, notification infrastructure)

**Features:** Talk vs Walk verification, beyond filings alternative data, AI signal detection

**Stack elements:** NLP libraries (if needed), alert notification system

**Avoids:** Feature complexity without validation, false positives eroding trust

**Research needs:** NLP integration, alternative data APIs, ML model selection. **Flag for `/gsd:research-phase`** during planning.

---

### Phase 8: Advanced UI Features
**Rationale:** Pipeline views, battlecards, customizable alerts are high-value but complex. Requires structured deal data and workflow integration.

**Delivers:**
- Deals pipeline kanban view (drag deals between stages)
- Automated battlecard generation (per pipeline opportunity)
- Customizable alert rules (user-defined thresholds)
- Collaborative annotations (if internal tool use case)
- Embedded expert commentary CMS

**Features:** Automated battlecards, customizable alerts, drag-and-drop pipeline

**Stack elements:** @dnd-kit/core 6, @dnd-kit/sortable

**Avoids:** Scope creep into project management tool, workflow automation complexity

**Research needs:** Deal pipeline data structure, CRM integration. Consider `/gsd:research-phase` for battlecard generation.

---

### Phase 9: Production Hardening
**Rationale:** Pre-launch validation catches presentation-day failures. Error tracking, monitoring, performance profiling prevent live issues.

**Delivers:**
- 10-minute pre-flight checklist execution
- Error tracking integration (Sentry)
- Performance profiling (Lighthouse score >90)
- Single-file build validation (test offline, verify inlining)
- Source attribution validation across all sections
- Browser console warning cleanup
- Backup video/PDF preparation
- Indian currency formatting validation (lakhs/crores)

**Features:** Production readiness, demo failure prevention

**Avoids:** All 13 pitfalls via systematic testing

**Research needs:** Standard production practices, skip `/gsd:research-phase`

---

### Phase Ordering Rationale

**Foundation first** because filtering, theming, and data layer are dependencies for all sections. Building one complete section (Phase 3) validates architecture patterns before scaling to 10 sections (Phases 4-5).

**Intelligence features later** (Phase 7) because Talk vs Walk verification and AI signal detection require both technical maturity (NLP, ML) and domain expertise. Deferring until core dashboard proves value reduces risk of over-engineering.

**Advanced UI features last** (Phase 8) because pipeline views and battlecards depend on structured deal data and workflow integration. These are high-complexity, medium-risk features better addressed after core intelligence delivery works.

**Hardening continuous** with dedicated phase (Phase 9) before launch. Research shows 81% of salespeople lose deals to bad demos—systematic pre-flight validation is non-negotiable.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 7 (Advanced Intelligence):** NLP libraries for Talk vs Walk verification, alternative data provider APIs, ML model selection for signal detection. Complex domain requiring specialized research.
- **Phase 8 (Advanced UI):** Deal pipeline data structures, CRM integration patterns, battlecard template engines. May need vendor/API research.

Phases with standard patterns (skip research-phase):

- **Phases 1-6:** React SPA, TanStack Query, Zustand, Radix UI, Apache ECharts all have well-documented patterns. Established best practices cover 90% of implementation.
- **Phase 9:** Production hardening uses standard monitoring/profiling tools. Error tracking (Sentry) and performance audits (Lighthouse) are commodity tooling.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified via official docs and npm (Feb 2026). React 19 + Vite 6 + TypeScript 5 combo confirmed in multiple production guides. Apache ECharts performance claims verified across 5+ independent comparisons. |
| Features | MEDIUM | Table stakes features confirmed across 10+ consulting dashboard sources. Differentiators based on McKinsey/BCG/Bain patterns but limited public documentation on proprietary intelligence features. Anti-features validated against BI tool bloat patterns. |
| Architecture | HIGH | Core patterns (client-side filtering, lazy loading, URL state sync, multi-tenant theming) are established React SPA best practices. TanStack Query + Zustand separation widely recommended in 2025/2026 state management guides. Single-file HTML pattern validated by plugin documentation. |
| Pitfalls | HIGH | Presentation-day failure statistics (81%) from credible sales research. Source attribution requirements based on consulting standards. Technical pitfalls (dark mode tokens, build failures, TanStack Query error boundaries) verified through issue trackers and documentation. |

**Overall confidence:** HIGH

Research draws from official documentation, verified npm packages, and established consulting practices. Medium confidence areas (feature differentiation, advanced intelligence) require validation during implementation but don't block initial phases.

### Gaps to Address

**Alternative data integration specifics:** Research identifies value proposition and use cases but lacks vendor-specific API documentation. Resolution: Defer detailed research to Phase 7 planning. Consider `/gsd:research-phase` for alternative data provider evaluation.

**PowerPoint export implementation:** Research confirms table-stakes requirement but library comparisons incomplete. Resolution: Validate browser print → PDF satisfies requirement in Phase 6. If programmatic PowerPoint generation needed, research @react-pdf/renderer alternatives.

**NLP library selection for Talk vs Walk:** Research confirms feature value but doesn't recommend specific NLP libraries (Compromise.js, natural, OpenAI API). Resolution: Defer to Phase 7 planning with dedicated NLP research.

**Indian number formatting edge cases:** Research confirms en-IN locale and lakhs/crores convention but lacks guidance on mixed-unit displays (e.g., "₹1.5Cr or ₹150L?"). Resolution: Validate formatting preferences with stakeholders in Phase 1, codify in formatters.

**Battlecard template structure:** Research identifies feature value for PE/transaction advisory but lacks template content specifics. Resolution: Defer to Phase 8 with stakeholder interviews on existing battlecard content/format.

## Sources

### Primary (HIGH confidence)

**Stack & Technology:**
- Apache ECharts Official Documentation — https://echarts.apache.org/
- TanStack Query v5 Documentation — https://tanstack.com/query/latest
- TanStack Table v8 Documentation — https://tanstack.com/table/latest
- React 19 Official Documentation — https://react.dev/
- Vite 6 Official Documentation — https://vitejs.dev/
- Tailwind CSS v4 Official Documentation — https://tailwindcss.com/blog/tailwindcss-v4
- Radix UI Official Documentation — https://www.radix-ui.com/
- dnd-kit Official Documentation — https://dndkit.com/
- vite-plugin-singlefile npm package — https://www.npmjs.com/package/vite-plugin-singlefile

**Consulting Intelligence:**
- McKinsey Presentation Structure Guide — https://slidemodel.com/mckinsey-presentation-structure/
- Executive Dashboard Best Practices 2025 — https://improvado.io/blog/executive-dashboards
- Financial Dashboard Design Guide 2026 — https://zebrabi.com/power-bi-financial-dashboards/

**Pitfalls & Demo Failures:**
- The Art of Failing Forward: Demo Lessons Learned — https://www.reprise.com/resources/blog/the-art-of-failing-forward-demo-lessons-learned
- Why Dashboards Fail: Top Mistakes — https://www.sapbwconsulting.com/blog/why-dashboards-fail
- TanStack Query Error Boundaries — https://app.studyraid.com/en/read/11355/355098/managing-query-error-states

### Secondary (MEDIUM confidence)

**Feature Research:**
- Competitive Intelligence Dashboards 2026 — https://valonaintelligence.com/market-intelligence-software/competitive-intelligence-dashboard
- Alternative Data Trends 2026 — https://www.kadoa.com/blog/alternative-data-trends-2026
- Private Equity Deal Flow AI Strategies — https://grata.com/resources/private-equity-deal-flow
- Signal Detection AI Guide 2026 — https://www.dip-ai.com/use-cases/en/the-best-signal-detection-AI

**Architecture Patterns:**
- React SPA Architecture Patterns 2026 — https://www.patterns.dev/react/react-2026/
- Zustand Architecture Patterns at Scale — https://brainhub.eu/library/zustand-architecture-patterns-at-scale
- Multi-Tenant Theming with Tailwind — https://medium.com/@aimanfaruk98/multi-tenant-theming-with-nextjs-app-router-tailwind-6a5a4195ed70
- React Custom Hooks Guide 2026 — https://oneuptime.com/blog/post/2026-02-02-react-custom-hooks/view

### Tertiary (LOW confidence)

**Domain-Specific:**
- Indian Rupee Formatting (Lakhs/Crores) — https://www.daytradeindia.in/decoding-inr-thousands-k-lakhs-l-and-crores-cr/
- Data Governance Dashboard Best Practices — https://diggrowth.com/blogs/data-management/data-governance-dashboard/
- AI-Powered Diligence Dashboards 2026 — https://diligencevault.com/5-ai-powered-diligence-dashboards-2026/

---

**Research completed:** 2026-02-20
**Ready for roadmap:** Yes
