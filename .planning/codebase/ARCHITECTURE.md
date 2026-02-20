# Architecture

**Analysis Date:** 2026-02-20

## Pattern Overview

**Overall:** Layered SPA (Single Page Application) with client-side filtering, lazy-loaded sections, and bidirectional URL state synchronization.

**Key Characteristics:**
- React 19 + TypeScript with Vite single-file build output
- TanStack Query v5 for static data caching (staleTime: Infinity)
- Zustand for global filter state with bidirectional URL synchronization
- Multi-tenant branding via React Context and CSS custom properties
- Lazy-loaded section components with Suspense boundaries and error boundaries
- Client-side filtering only — filters applied in useMemo against already-fetched data
- Fallback to mock data when real API is unavailable

## Layers

**API Client Layer:**
- Purpose: Fetch section data from backend API or fall back to bundled mock data
- Location: `src/api/client.ts`
- Contains: `fetchSectionData()` function with fallback logic, mock data loaders
- Depends on: Environment variables (VITE_API_URL, VITE_USE_REAL_API), mock data modules in `src/data/mock/`
- Used by: TanStack Query queryFn in `src/api/queries.ts`

**Query/State Management Layer:**
- Purpose: Manage server data caching, global filter state, and URL synchronization
- Location:
  - `src/api/query-client.ts` — TanStack Query configuration
  - `src/api/queries.ts` — Query option factories for all 10 sections
  - `src/stores/filter-store.ts` — Zustand filter store with subscribeWithSelector
  - `src/stores/url-sync.ts` — Bidirectional URL ↔ store sync
- Contains: Query configuration, query factories, filter state, URL parameter encoding/decoding
- Depends on: TanStack Query, Zustand, React Router, mock data types
- Used by: Section components and hooks

**UI/Presentation Layer:**
- Purpose: Render user interface with filtering, layout, and branding
- Location: `src/components/` (subdivided by function: brand, charts, errors, export, filters, layout, sections, ui)
- Contains: Layout shells (AppShell, SectionWrapper), filter controls (FilterBar), charts, UI primitives
- Depends on: State management layer, utilities, theme tokens
- Used by: App routing layer

**Section Components Layer:**
- Purpose: Display 10 intelligence sections with domain-specific visualizations
- Location: `src/sections/{section-name}/` (10 directories for each section)
- Contains: Section root component (e.g., ExecutiveSnapshot.tsx), domain-specific sub-components, section-specific utilities
- Depends on: useFilteredData hook, section data types, formatters, charts
- Used by: Lazy loading in `src/components/sections/index.ts`

**Utilities & Helpers Layer:**
- Purpose: Cross-cutting formatting, company matching, validation
- Location: `src/lib/`
- Contains:
  - `formatters.ts` — INR currency, percentages, basis points, dates (Intl.NumberFormat instances at module scope)
  - `company-matching.ts` — Fuzzy company ID matching across sections
- Depends on: Types
- Used by: All presentation and section layers

**Data Layer:**
- Purpose: Provide mock data for development/fallback and type definitions
- Location:
  - `src/data/mock/` — Mock data modules for each section + companies reference
  - `src/types/` — TypeScript type definitions
- Contains: Section data structures, company reference, filter types, common types
- Depends on: Nothing (bottom of dependency chain)
- Used by: API client, utilities, components

## Data Flow

**Initial Page Load:**

1. User navigates to `/:tenantSlug/report/executive` (or any section)
2. BrowserRouter renders App → QueryClientProvider → BrandProvider → AppShell
3. AppShell invokes `useFilterUrlSync()` which syncs URL params to Zustand store
4. SectionWrapper → Suspense loads section component via React.lazy()
5. Section component calls `useFilteredData<SectionData>(sectionId)`
6. useFilteredData invokes useQuery(sectionQueries.executive())
7. TanStack Query checks cache:
   - If cached and stale time not expired: return cached data
   - If not cached: call fetchSectionData("executive")
8. fetchSectionData tries real API (if VITE_USE_REAL_API === true) or directly loads mock
9. Data arrives, useMemo applies filter state (companies, subCategory, performanceTier, timePeriod)
10. Section renders filtered data

**Filter State Update:**

1. User clicks filter (e.g., selects "Voltas" company)
2. Filter component calls `useFilterStore.setState({ companies: [...] })`
3. Zustand notifies all subscribers including url-sync hook
4. url-sync reads new state via subscribeWithSelector, calls setSearchParams()
5. URL updates to `?companies=voltas&subcat=...`
6. Browser back/forward triggers URL change
7. url-sync detects URL change via useSearchParams, updates store (prevents loop via ref guards)
8. useFilteredData receives new filter state via Zustand selectors
9. useMemo re-runs with new filter state, filters already-cached data
10. Component re-renders with filtered data (NO new API call)

**State Management:**

- **Server data:** TanStack Query `useQuery()` per section, queryKey is `["section", sectionId]` (immutable, no filter keys)
- **Filter state:** Zustand store with 4 fields: companies, subCategory, performanceTier, timePeriod
- **URL state:** React Router search params, synced bidirectionally
- **Branding:** React Context (BrandContext) + data-tenant attribute on documentElement
- **Theme:** localStorage + documentElement.classList.toggle("dark")

## Key Abstractions

**useFilteredData Hook:**
- Purpose: Encapsulate query fetching + client-side filtering in one hook
- Examples: Used in all 10 section components (Executive, Financial, MarketPulse, Deals, etc.)
- Pattern: Generic hook `useFilteredData<T extends SectionData>(sectionId)` returns `{ data, rawData, isPending, error, filters }`
- Implementation: Uses TanStack Query + Zustand selectors + useMemo for filtering
- File: `src/hooks/use-filtered-data.ts`

**sectionQueries Factory:**
- Purpose: Centralize query configuration and type safety per section
- Examples: `sectionQueries.executive()`, `sectionQueries.financial()`
- Pattern: Returns queryOptions with { queryKey, queryFn, staleTime, gcTime }
- Why: Avoids duplication, ensures queryKey consistency, enables type-safe reuse
- File: `src/api/queries.ts`

**useFilterUrlSync Hook:**
- Purpose: Bidirectional sync between Zustand store and URL params
- Pattern: Ref-based guards prevent infinite loops (isUpdatingFromUrl, isUpdatingFromStore)
- Called once at: `src/components/layout/AppShell.tsx`
- Uses: subscribeWithSelector for selective store subscriptions
- File: `src/stores/url-sync.ts`

**Section Components (Lazy-Loaded):**
- Purpose: Self-contained domain views (Executive Snapshot, Financial Performance, etc.)
- Pattern: Each exports default function, zero props, calls useFilteredData internally
- Why: Reduces prop drilling, enables code splitting via React.lazy()
- Locations: `src/sections/{section}/` with root file matching section name (e.g., ExecutiveSnapshot.tsx)
- Example: `src/sections/executive/ExecutiveSnapshot.tsx`

**BrandProvider Context:**
- Purpose: Multi-tenant branding (Kompete, BCG, AM brands)
- Pattern: Sets data-tenant on documentElement, updates favicon and page title
- Contains: Brand slug, display name, colors, favicon URL
- Uses: CSS custom properties scoped to data-tenant attribute
- File: `src/components/brand/BrandProvider.tsx`

**Formatters Module:**
- Purpose: Reusable formatting for currency, percentages, dates with Indian conventions
- Pattern: Intl.NumberFormat instances at module scope (expensive to construct)
- Exports: formatINRCr, formatINRLakh, formatINRAuto, formatPercent, formatBps, formatGrowthRate, formatDate, formatMonthYear
- File: `src/lib/formatters.ts`

## Entry Points

**HTML Entry:**
- Location: `index.html`
- Triggers: Browser load
- Responsibilities: Root element with id="root", imports main.tsx

**Main Entry (React):**
- Location: `src/main.tsx`
- Triggers: HTML script tag
- Responsibilities:
  - Initializes dark mode before rendering (prevent flash)
  - Creates React root
  - Renders App component with StrictMode

**App Component:**
- Location: `src/app/App.tsx`
- Triggers: React root render
- Responsibilities:
  - Sets up QueryClientProvider (TanStack Query)
  - Sets up BrowserRouter (React Router)
  - Defines all 10 section routes under /:tenantSlug/report
  - Each section route wraps component in SectionWrapper (error boundary) + Suspense

**AppShell Component:**
- Location: `src/components/layout/AppShell.tsx`
- Triggers: Route /:tenantSlug/report renders
- Responsibilities:
  - Invokes useFilterUrlSync() for bidirectional URL sync
  - Renders TopBar, FilterBar, Sidebar, Outlet
  - Layout container for all sections

## Error Handling

**Strategy:** Three-layer error containment via error boundaries.

**Patterns:**

- **Top-level (AppShell):** React.StrictMode in main catches development issues
- **Section-level (SectionWrapper):** `react-error-boundary` with SectionErrorFallback fallback
  - Wraps each lazy-loaded section component
  - Displays error message + "Retry" button
  - File: `src/components/layout/SectionWrapper.tsx`
- **Error fallback UI:** `SectionErrorFallback` component
  - Shows error message (if Error instance) or generic message
  - Provides "Retry" button that calls resetErrorBoundary
  - File: `src/components/errors/SectionErrorFallback.tsx`
- **Async errors:** Section components throw on error from useFilteredData
  - useFilteredData returns error object, section checks and throws
  - Caught by SectionWrapper boundary

**No global error handler:** Each section fails independently, others remain functional.

## Cross-Cutting Concerns

**Logging:**
- console.warn() in API client for fallback events
- No dedicated logging library

**Validation:**
- TypeScript types enforce shape of section data (SectionData union type)
- Company matching uses fuzzy matching to handle inconsistent naming across sections (`src/lib/company-matching.ts`)
- Query key consistency enforced by queryOptions factories

**Authentication:**
- Not applicable — public data, no auth required

**Dark Mode:**
- localStorage-based preference ("light" | "dark" | "system")
- documentElement.classList.toggle("dark", isDark)
- CSS custom properties adapt via dark: selector in Tailwind
- Initialized before React render to prevent flash (`src/theme/dark-mode.ts`)

**Multi-Tenancy:**
- Route parameter :tenantSlug drives BrandProvider
- data-tenant attribute on documentElement enables CSS scoping
- CSS custom properties override per tenant in `src/theme/tokens.css`
- Brand configs loaded from `src/brands/`

**Responsive Design:**
- Tailwind CSS 4 with no tailwind.config.js (uses @theme in tokens.css)
- Sidebar layout (flex column at root, flex row for main content)
- Print styles via [data-print-hide] and [data-print-content] attributes

---

*Architecture analysis: 2026-02-20*
