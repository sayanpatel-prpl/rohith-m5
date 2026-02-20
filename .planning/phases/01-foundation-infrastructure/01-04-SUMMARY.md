---
phase: 01-foundation-infrastructure
plan: 04
subsystem: app-shell, routing, layout, branding
tags: [react-router, zustand, multi-tenant, brand-provider, sidebar, filter-bar, dark-mode, app-shell]

# Dependency graph
requires:
  - phase: 01-foundation-infrastructure
    provides: "Project scaffold, query client, filter store, URL sync, useFilteredData hook (plans 01, 02)"
  - phase: 01-foundation-infrastructure
    provides: "Shared UI components: SectionSkeleton, SectionErrorFallback, source attribution (plan 03)"
  - phase: 01-foundation-infrastructure
    provides: "Type definitions: SectionId, FilterState, Company, BrandConfig, design tokens (plan 05)"
provides:
  - "11 section routes with A&M Value-Add at position 2 (SECTION_ROUTES + SectionRoute interface)"
  - "BrandProvider with data-tenant attribute on documentElement for CSS cascade"
  - "useBrand hook for consuming brand config (slug, displayName, accentColor, fonts)"
  - "Multi-tenant brand registry (am, kompete, bcg) with am as default"
  - "App.tsx root: QueryClientProvider -> BrowserRouter -> BrandProvider -> AppShell"
  - "AppShell layout: Sidebar (260px) + TopBar + FilterBar + Outlet"
  - "FilterBar with 4 filter controls using individual primitive Zustand selectors"
  - "Dark mode toggle (light/dark/system cycle) and print button in TopBar"
  - "4 tracking files: PROGRESS.md, DECISIONS.md, DATA_CATALOG.md, SOURCE_REFERENCE.md"
affects: [01-06, 02-priority-sections, 03-remaining-sections, 04-cross-cutting, 05-am-value-add, 06-production]

# Tech tracking
tech-stack:
  added: []
  patterns: [multi-tenant-branding-via-data-tenant-attribute, app-shell-layout-with-sidebar, filter-bar-primitive-selectors, theme-cycle-toggle, lazy-section-routing-with-error-boundary]

key-files:
  created:
    - "dashboard_build_v2/src/app/App.tsx"
    - "dashboard_build_v2/src/app/routes.tsx"
    - "dashboard_build_v2/src/brands/types.ts"
    - "dashboard_build_v2/src/brands/am.ts"
    - "dashboard_build_v2/src/brands/kompete.ts"
    - "dashboard_build_v2/src/brands/bcg.ts"
    - "dashboard_build_v2/src/brands/index.ts"
    - "dashboard_build_v2/src/components/brand/BrandProvider.tsx"
    - "dashboard_build_v2/src/components/brand/useBrand.ts"
    - "dashboard_build_v2/src/components/layout/AppShell.tsx"
    - "dashboard_build_v2/src/components/layout/Sidebar.tsx"
    - "dashboard_build_v2/src/components/layout/TopBar.tsx"
    - "dashboard_build_v2/src/components/layout/FilterBar.tsx"
    - "dashboard_build_v2/PROGRESS.md"
    - "dashboard_build_v2/DECISIONS.md"
    - "dashboard_build_v2/DATA_CATALOG.md"
    - "dashboard_build_v2/SOURCE_REFERENCE.md"
  modified:
    - "dashboard_build_v2/src/main.tsx"
    - "dashboard_build_v2/src/sections/index.ts"

key-decisions:
  - "A&M as default tenant: getBrandConfig falls back to amBrand, default redirect /am/report"
  - "No ReactQueryDevtools in production presentation build"
  - "Native HTML select and checkbox for FilterBar instead of Radix -- simpler for deadline"
  - "Company multi-select uses simple dropdown with checkboxes, outside-click-to-close"
  - "Theme toggle cycles light -> dark -> system with single button"

patterns-established:
  - "BrandProvider sets data-tenant on documentElement for CSS variable cascade from tokens.css"
  - "AppShell calls useFilterUrlSync() at top level for bidirectional URL sync"
  - "FilterBar uses individual primitive selectors from Zustand for each filter dimension"
  - "Section routes: lazy-loaded via lazySections record, wrapped in ErrorBoundary + Suspense"
  - "Sidebar NavLink with isActive callback for brand-accent left-border styling"

# Metrics
duration: 5min
completed: 2026-02-21
---

# Phase 1 Plan 4: App Shell & Layout Integration Summary

**App shell with 260px sidebar navigation (11 sections, A&M Value-Add at position 2), multi-tenant branding via data-tenant attribute (am/kompete/bcg), 4-filter FilterBar with primitive Zustand selectors, dark mode toggle, and 4 tracking files (PROGRESS, DECISIONS, DATA_CATALOG, SOURCE_REFERENCE)**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-21T01:13:00Z
- **Completed:** 2026-02-21T01:19:00Z
- **Tasks:** 3
- **Files modified:** 19 (17 created, 2 modified)

## Accomplishments
- Created complete app shell integrating Plans 01-03 outputs into a running application frame with sidebar navigation, filter bar, and lazy-loaded section routing
- Built multi-tenant branding system (am, kompete, bcg) with BrandProvider setting data-tenant on documentElement for CSS variable cascade from tokens.css
- Created 4 tracking files: PROGRESS.md (build phases + 11 section checklist), DECISIONS.md (10 architecture decisions), DATA_CATALOG.md (7+ data files mapped to sections with company ID normalization table), SOURCE_REFERENCE.md (presenter's 5-second data traceability cheat sheet)
- Wired App.tsx root with QueryClientProvider, BrowserRouter, BrandProvider, and 11 lazy-loaded section routes with ErrorBoundary + Suspense fallbacks

## Task Commits

Each task was committed atomically:

1. **Task 1: Create branding, routing, and App.tsx root component** - `0217fbc` (feat)
2. **Task 2: Create layout components (AppShell, Sidebar, TopBar, FilterBar)** - `7d015ea` (feat)
3. **Task 3: Create tracking files and data catalog** - `c77cb1e` (docs)

## Files Created/Modified
- `dashboard_build_v2/src/app/routes.tsx` - 11 SECTION_ROUTES with SectionRoute interface, A&M Value-Add at position 2
- `dashboard_build_v2/src/app/App.tsx` - Root component: QueryClientProvider + BrowserRouter + BrandProvider + section routes
- `dashboard_build_v2/src/brands/types.ts` - BrandConfig interface (slug, displayName, logoUrl, accentColor, fonts)
- `dashboard_build_v2/src/brands/am.ts` - A&M brand config with oklch accent color
- `dashboard_build_v2/src/brands/kompete.ts` - Kompete brand config
- `dashboard_build_v2/src/brands/bcg.ts` - BCG brand config
- `dashboard_build_v2/src/brands/index.ts` - Brand registry with getBrandConfig() falling back to amBrand
- `dashboard_build_v2/src/components/brand/BrandProvider.tsx` - Context provider setting data-tenant attribute on documentElement
- `dashboard_build_v2/src/components/brand/useBrand.ts` - Hook consuming BrandContext with error if used outside provider
- `dashboard_build_v2/src/components/layout/AppShell.tsx` - Dashboard shell: Sidebar + TopBar + FilterBar + Outlet, calls useFilterUrlSync
- `dashboard_build_v2/src/components/layout/Sidebar.tsx` - 260px nav sidebar with SECTION_ROUTES NavLinks and brand header
- `dashboard_build_v2/src/components/layout/TopBar.tsx` - Section title, data recency, dark mode toggle (light/dark/system), print button
- `dashboard_build_v2/src/components/layout/FilterBar.tsx` - 4 filter controls (company multi-select, sub-category, performance tier, time period) + reset
- `dashboard_build_v2/src/main.tsx` - Updated to import and render App instead of placeholder
- `dashboard_build_v2/src/sections/index.ts` - Linter auto-modified to use actual lazy() imports for all 11 sections
- `dashboard_build_v2/PROGRESS.md` - Build phase tracking with 11 section completion checklist
- `dashboard_build_v2/DECISIONS.md` - 10 architecture decisions with date, rationale, and outcome
- `dashboard_build_v2/DATA_CATALOG.md` - 7+ data files mapped to sections with company ID normalization table
- `dashboard_build_v2/SOURCE_REFERENCE.md` - Presenter's cheat sheet with 4-tier confidence system and verification URLs

## Decisions Made
- A&M is default tenant (getBrandConfig fallback, default redirect to /am/report) since this is an A&M presentation build
- No ReactQueryDevtools included -- this is a production presentation build
- Used native HTML select/checkbox for FilterBar instead of Radix Select/Checkbox -- simpler and faster for deadline, avoids extra bundle size
- Company multi-select uses a simple dropdown with outside-click-to-close instead of Radix Popover
- Theme toggle cycles through light -> dark -> system in a single button click

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Linter auto-modified sections/index.ts**
- **Found during:** Task 1 (creating sections placeholder)
- **Issue:** A linter modified the placeholder sections/index.ts to use actual lazy() imports pointing to section module directories
- **Fix:** Section stubs already existed from a prior plan execution, so the lazy imports resolved correctly. No manual intervention needed.
- **Files modified:** dashboard_build_v2/src/sections/index.ts
- **Verification:** tsc --noEmit passes, all 11 section lazy imports resolve
- **Committed in:** 0217fbc (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Linter modification was beneficial -- section stubs already existed, so actual lazy imports are cleaner than the placeholder approach.

## Issues Encountered
None -- all files type-checked cleanly and 66 existing tests continue to pass.

## User Setup Required
None -- no external service configuration required.

## Next Phase Readiness
- Complete app shell ready: dev server will show working navigation with sidebar, filter bar, and dark mode toggle
- All 11 section stubs render placeholder content via lazy loading
- Filter bar connected to Zustand store with bidirectional URL sync active
- Brand system supports am/kompete/bcg tenants with CSS variable cascade
- Tracking files provide full project visibility for build progress, decisions, data mapping, and source traceability
- Ready for Plan 01-06 (section stubs) if not already complete, then Phase 2 priority sections

---
## Self-Check: PASSED

- All 17 created files verified present on disk
- Commit 0217fbc (Task 1) verified in git log
- Commit 7d015ea (Task 2) verified in git log
- Commit c77cb1e (Task 3) verified in git log
- TypeScript type-check: zero errors
- Test suite: 66/66 passing (no regressions)
- SECTION_ROUTES has 11 entries with am-value-add at index 1
- BrandProvider sets data-tenant on documentElement
- AppShell calls useFilterUrlSync()
- FilterBar uses individual primitive selectors

---
*Phase: 01-foundation-infrastructure*
*Completed: 2026-02-21*
