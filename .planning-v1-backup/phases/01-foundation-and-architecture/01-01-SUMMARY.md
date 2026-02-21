---
phase: 01-foundation-and-architecture
plan: 01
subsystem: ui
tags: [vite, react-19, typescript, tailwind-v4, react-router-v7, multi-tenant, dark-mode, error-boundary, css-custom-properties]

# Dependency graph
requires:
  - phase: none
    provides: first phase -- no dependencies
provides:
  - Vite 7 + React 19 + TypeScript 5 project scaffold
  - Tailwind v4 @theme design token system with CSS custom properties
  - Multi-tenant brand theming via [data-tenant] CSS selectors (kompete, bcg, am)
  - BrandProvider with URL-slug tenant resolution and runtime switching
  - React Router v7 app shell with 10 section routes
  - Dark mode three-way toggle (light/dark/system) with localStorage persistence
  - SectionWrapper with error boundary isolation and fade-in transitions
  - AppShell layout (TopBar + Sidebar + content area)
  - Brand config registry with Kompete fallback for unknown slugs
affects: [01-02, 02-report-shell, all-subsequent-phases]

# Tech tracking
tech-stack:
  added: [vite@7, react@19, react-dom@19, typescript@5, tailwindcss@4, @tailwindcss/vite, react-router@7, react-error-boundary@6.1.1, recharts@3.7, radix-ui, clsx]
  patterns: [tailwind-v4-theme-tokens, data-tenant-css-cascade, react-19-context-use-hook, react-router-v7-declarative, blocking-dark-mode-script]

key-files:
  created:
    - src/theme/tokens.css
    - src/theme/dark-mode.ts
    - src/brands/types.ts
    - src/brands/kompete.ts
    - src/brands/bcg.ts
    - src/brands/am.ts
    - src/brands/index.ts
    - src/components/brand/BrandProvider.tsx
    - src/components/brand/useBrand.ts
    - src/app/App.tsx
    - src/app/routes.tsx
    - src/components/layout/AppShell.tsx
    - src/components/layout/TopBar.tsx
    - src/components/layout/Sidebar.tsx
    - src/components/layout/SectionWrapper.tsx
    - src/components/errors/SectionErrorFallback.tsx
    - index.html
    - vite.config.ts
    - package.json
    - tsconfig.json
    - tsconfig.app.json
  modified: []

key-decisions:
  - "Static TypeScript brand configs over API-delivered -- no backend dependency, type-safe, trivial to add tenants"
  - "Inline error cards over toasts for section failures -- stays visible, shows which section failed, matches Bloomberg panel independence"
  - "React 19 use() hook for context consumption instead of useContext"
  - "Blocking inline script in index.html for dark mode to prevent white flash"
  - "oklch color format for all brand and design tokens -- perceptual uniformity"

patterns-established:
  - "Pattern: @theme for token definition, @layer base for tenant/dark overrides"
  - "Pattern: [data-tenant] attribute on documentElement for CSS variable cascade"
  - "Pattern: BrandProvider wraps route, reads :tenantSlug, sets context + DOM attributes"
  - "Pattern: SectionWrapper = ErrorBoundary + fade-in animation wrapper"
  - "Pattern: Three-way theme toggle (light/dark/system) with localStorage persistence"
  - "Pattern: React Router v7 declarative mode -- import from 'react-router' not 'react-router-dom'"

# Metrics
duration: 7min
completed: 2026-02-15
---

# Phase 1 Plan 01: Project Scaffold Summary

**Vite + React 19 + Tailwind v4 scaffold with multi-tenant BrandProvider, 10-section React Router shell, dark mode toggle, and error-isolated section wrappers**

## Performance

- **Duration:** 7 min
- **Started:** 2026-02-15T16:32:18Z
- **Completed:** 2026-02-15T16:39:28Z
- **Tasks:** 2
- **Files modified:** 31

## Accomplishments
- Full Vite 7 + React 19 + TypeScript project with Tailwind CSS v4 @theme design tokens (high-density 11-13px text scale, compact 2-16px spacing, oklch color system)
- Multi-tenant branding system: 3 brand configs (Kompete, BCG, A&M) with runtime switching via URL slug and CSS custom property cascade through [data-tenant] selectors
- App shell layout with slim TopBar (tenant logo, edition badge, dark mode toggle), left Sidebar (10 section NavLinks with active state), and routed content area
- Dark mode from day one: three-way toggle (light/dark/system), localStorage persistence, blocking script prevents flash, @custom-variant dark for Tailwind
- Error boundaries isolate each section via SectionWrapper with react-error-boundary, inline error card with retry button

## Task Commits

Each task was committed atomically:

1. **Task 1: Project scaffold, dependencies, Tailwind v4 theme system, and brand configs** - `5157173` (feat)
2. **Task 2: BrandProvider, React Router shell, app layout, and error boundaries** - `cddf748` (feat)

## Files Created/Modified

- `package.json` - Project manifest with React 19, Tailwind v4, React Router v7, Recharts 3.7, react-error-boundary 6.1.1
- `vite.config.ts` - Vite 7 config with @tailwindcss/vite and @vitejs/plugin-react
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` - TypeScript strict mode configuration
- `index.html` - Entry HTML with blocking dark mode script, font preloads, favicon link
- `src/main.tsx` - Entry point importing tokens.css, calling initTheme()
- `src/theme/tokens.css` - Tailwind v4 @theme with all design tokens, dark mode overrides, tenant overrides, fade-in keyframes
- `src/theme/dark-mode.ts` - Three-way toggle: getStoredTheme, applyTheme, initTheme with system preference listener
- `src/brands/types.ts` - BrandConfig interface (slug, displayName, logoUrl, faviconUrl, accentColor, fontDisplay, fontBody)
- `src/brands/kompete.ts` - Kompete Intelligence brand config (blue-purple accent, Inter font)
- `src/brands/bcg.ts` - BCG brand config (green accent, Georgia font)
- `src/brands/am.ts` - Alvarez & Marsal brand config (red-orange accent, Helvetica Neue font)
- `src/brands/index.ts` - Brand registry with getBrandConfig() and Kompete fallback
- `src/components/brand/BrandProvider.tsx` - Context provider: URL slug resolution, data-tenant attribute, favicon/title updates
- `src/components/brand/useBrand.ts` - Custom hook using React 19 use() for brand context
- `src/app/App.tsx` - BrowserRouter with tenant-aware routing, 10 section routes, redirects
- `src/app/routes.tsx` - SECTION_ROUTES constant array (10 sections with path and label)
- `src/components/layout/AppShell.tsx` - TopBar + Sidebar + Outlet layout
- `src/components/layout/TopBar.tsx` - Tenant logo, edition badge, dark mode toggle button
- `src/components/layout/Sidebar.tsx` - NavLink list for 10 sections with active state styling
- `src/components/layout/SectionWrapper.tsx` - ErrorBoundary + fade-in wrapper for each section
- `src/components/errors/SectionErrorFallback.tsx` - Inline error card with retry button
- `public/brands/kompete/logo.svg` - Placeholder Kompete logo
- `public/brands/kompete/favicon.ico` - 16x16 blue-purple favicon
- `public/brands/bcg/logo.svg` - Placeholder BCG logo (green)
- `public/brands/am/logo.svg` - Placeholder A&M logo (red-orange)

## Decisions Made

- **Static TypeScript brand configs** - No backend dependency for brand resolution; getBrandConfig reads from an in-memory registry. Can migrate to API-delivered later without changing BrandProvider interface.
- **Inline error card for section failures** - Stays visible in the section area, shows which module failed, matches Bloomberg terminal panel independence. Toasts disappear and lose context.
- **React 19 use() hook** - Preferred over useContext for brand context consumption, following React 19 patterns.
- **oklch color format** - All brand and design tokens use oklch for perceptual uniformity and Tailwind v4 compatibility.
- **High-density typography scale** - 11px xs, 12px sm, 13px base, 15px lg, 18px xl -- partners scan fast and want maximum data density.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] npm cache permissions error**
- **Found during:** Task 1 (dependency installation)
- **Issue:** npm cache at ~/.npm had root-owned files, causing EACCES error
- **Fix:** Used --cache /tmp/npm-cache flag to bypass the broken cache directory
- **Files modified:** None (runtime workaround)
- **Verification:** All dependencies installed successfully
- **Committed in:** Part of Task 1 commit

**2. [Rule 3 - Blocking] create-vite CLI interactive prompt blocked in non-TTY**
- **Found during:** Task 1 (project scaffolding)
- **Issue:** npm create vite@latest cancelled due to interactive prompts in non-terminal environment
- **Fix:** Manually created all project files (package.json, tsconfig, vite.config.ts, index.html) instead of relying on the Vite CLI scaffold
- **Files modified:** All Task 1 config files created manually
- **Verification:** TypeScript compiles, Vite dev server starts, production build succeeds
- **Committed in:** 5157173

**3. [Rule 2 - Missing Critical] Added .gitignore**
- **Found during:** Task 1 (commit preparation)
- **Issue:** No .gitignore existed, node_modules and OS files would be committed
- **Fix:** Created .gitignore with standard patterns (node_modules, dist, .DS_Store, .env, IDE files)
- **Files modified:** .gitignore
- **Verification:** git status no longer shows node_modules or OS files
- **Committed in:** 5157173

---

**Total deviations:** 3 auto-fixed (2 blocking, 1 missing critical)
**Impact on plan:** All auto-fixes necessary for correct operation. No scope creep.

## Issues Encountered
None beyond the deviations documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Project scaffold is complete and running
- Brand theming system is fully operational for all 3 tenants
- App shell with routing and error boundaries is ready for content modules
- Plan 01-02 can now build TypeScript data contracts, formatters, shared UI primitives, and chart wrappers on this foundation

## Self-Check: PASSED

- All 28 created files verified present on disk
- Commit 5157173 (Task 1) verified in git log
- Commit cddf748 (Task 2) verified in git log
- TypeScript compiles with zero errors (npx tsc --noEmit)
- Vite dev server starts and returns HTTP 200
- Production build succeeds (52 modules, 1.17s)

---
*Phase: 01-foundation-and-architecture*
*Completed: 2026-02-15*
