# Codebase Structure

**Analysis Date:** 2026-02-20

## Directory Layout

```
project-root/
├── src/                           # React source code (TypeScript)
│   ├── main.tsx                   # React root entry point
│   ├── app/
│   │   ├── App.tsx                # Root component with routing
│   │   └── routes.tsx             # SECTION_ROUTES constant (10 sections)
│   ├── api/
│   │   ├── client.ts              # fetchSectionData() with API/mock fallback
│   │   ├── query-client.ts        # TanStack Query configuration
│   │   └── queries.ts             # Query option factories per section
│   ├── stores/
│   │   ├── filter-store.ts        # Zustand global filter state
│   │   └── url-sync.ts            # Bidirectional URL ↔ store sync
│   ├── hooks/
│   │   └── use-filtered-data.ts   # Generic hook: useQuery + filter + useMemo
│   ├── components/
│   │   ├── brand/
│   │   │   ├── BrandProvider.tsx  # Multi-tenant context provider
│   │   │   └── useBrand.ts        # useContext(BrandContext) hook
│   │   ├── layout/
│   │   │   ├── AppShell.tsx       # Main layout container (TopBar, FilterBar, Sidebar, Outlet)
│   │   │   ├── TopBar.tsx         # Header with branding
│   │   │   ├── Sidebar.tsx        # Section navigation menu
│   │   │   └── SectionWrapper.tsx # Error boundary + Suspense wrapper
│   │   ├── filters/
│   │   │   └── FilterBar.tsx      # Company, subCategory, performanceTier, timePeriod filters
│   │   ├── ui/
│   │   │   ├── SectionSkeleton.tsx      # Loading placeholder
│   │   │   ├── DataRecencyTag.tsx       # "Last updated" badge
│   │   │   ├── Button.tsx               # Common button
│   │   │   └── [other UI primitives]
│   │   ├── charts/
│   │   │   ├── LineChart.tsx      # Recharts wrapper
│   │   │   ├── BarChart.tsx       # Recharts wrapper
│   │   │   └── [domain charts]
│   │   ├── errors/
│   │   │   └── SectionErrorFallback.tsx # Error boundary fallback UI
│   │   ├── export/
│   │   │   └── [print/export utilities]
│   │   └── sections/
│   │       └── index.ts           # lazySections map (React.lazy() per section)
│   ├── sections/                  # 10 section implementations
│   │   ├── executive/
│   │   │   ├── ExecutiveSnapshot.tsx # Default export (lazy-loaded)
│   │   │   ├── BulletSummary.tsx
│   │   │   ├── RedFlagsTable.tsx
│   │   │   └── [other sub-components]
│   │   ├── financial/
│   │   │   ├── FinancialPerformance.tsx
│   │   │   └── [sub-components]
│   │   ├── market-pulse/
│   │   ├── deals/
│   │   ├── operations/
│   │   ├── leadership/
│   │   ├── competitive/
│   │   ├── deep-dive/
│   │   ├── action-lens/
│   │   └── watchlist/
│   ├── data/
│   │   └── mock/
│   │       ├── executive.ts       # Mock data for Executive section
│   │       ├── financial.ts
│   │       ├── companies.ts       # Company master list with subSector mapping
│   │       ├── [9 more section data]
│   │       └── [index.ts if barrel]
│   ├── lib/
│   │   ├── formatters.ts          # INR, percent, basis points, date formatting
│   │   ├── formatters.test.ts     # Vitest tests
│   │   ├── company-matching.ts    # Fuzzy company ID matching
│   │   └── company-matching.test.ts
│   ├── types/
│   │   ├── common.ts              # SectionId, ConfidenceLevel, TrendDirection, DataRecency, ChartAnnotation
│   │   ├── filters.ts             # FilterState, FilterActions, DEFAULT_FILTERS
│   │   ├── sections.ts            # ExecutiveSnapshotData, FinancialPerformanceData, ... (10 section types)
│   │   ├── company.ts             # Company interface
│   │   └── [other domain types]
│   ├── theme/
│   │   ├── tokens.css             # Tailwind @theme directive, CSS custom properties per tenant
│   │   ├── dark-mode.ts           # initTheme(), applyTheme(), getStoredTheme()
│   │   └── dark-mode.test.ts
│   └── brands/
│       ├── index.ts               # getBrandConfig() router
│       ├── kompete.ts             # Kompete brand config
│       ├── bcg.ts                 # BCG brand config
│       ├── am.ts                  # AM brand config
│       └── types.ts               # BrandConfig interface
│
├── server/
│   └── index.mjs                  # Express API server (optional, for real data)
│
├── database/
│   ├── industry-landscape.db      # SQLite database
│   └── schema.sql                 # Schema definition
│
├── src/index.html                 # HTML entry point with root element
├── vite.config.ts                 # Vite build config (vite-plugin-singlefile)
├── vitest.config.ts               # Vitest test runner config
├── tsconfig.json                  # Base TypeScript config
├── tsconfig.app.json              # App-specific TypeScript config
├── tsconfig.node.json             # Node-specific TypeScript config
├── package.json                   # Dependencies and scripts
├── .eslintrc.*                    # ESLint config
└── .prettierrc                    # Prettier formatting config
```

## Directory Purposes

**src/:**
- Purpose: All React application source code
- Contains: Components, hooks, state management, utilities, types, data, theme

**src/app/:**
- Purpose: Application routing and top-level structure
- Contains: App.tsx (root component with BrowserRouter), routes.tsx (section route definitions)
- Key files: `routes.tsx` defines all 10 SECTION_ROUTES

**src/api/:**
- Purpose: Data fetching and query management
- Contains: API client with fallback logic, TanStack Query setup, query factories
- Key pattern: fetchSectionData tries real API, falls back to mock data dynamically

**src/stores/:**
- Purpose: Global state management
- Contains: Zustand filter store, URL synchronization
- Key files: `filter-store.ts` (4-field filter state), `url-sync.ts` (bidirectional URL sync)

**src/hooks/:**
- Purpose: Custom React hooks for data and state logic
- Contains: useFilteredData (main hook combining query + filtering)
- Exported for use in section components

**src/components/:**
- Purpose: All presentational React components organized by function
- Subdivisions:
  - `brand/` — Multi-tenant branding context and utilities
  - `layout/` — Layout shells (AppShell, SectionWrapper, TopBar, Sidebar)
  - `filters/` — Filter UI controls
  - `ui/` — Reusable UI primitives (buttons, badges, skeletons)
  - `charts/` — Recharts wrappers and chart components
  - `errors/` — Error boundary fallback UI
  - `export/` — Print/export functionality
  - `sections/` — Lazy loading map (index.ts)

**src/sections/:**
- Purpose: 10 independent intelligence section implementations
- Contains: One directory per section (executive, financial, market-pulse, deals, operations, leadership, competitive, deep-dive, action-lens, watchlist)
- Pattern: Each section has a root component (e.g., ExecutiveSnapshot.tsx) exported as default for lazy loading
- Sub-components: Domain-specific components supporting the root (e.g., BulletSummary.tsx, RedFlagsTable.tsx for executive)

**src/data/mock/:**
- Purpose: Mock section data for development and fallback
- Contains: One module per section (executive.ts, financial.ts, etc.) + companies.ts master reference
- Pattern: Each module exports default SectionData
- Used by: API client when real API unavailable or in fallback mode

**src/lib/:**
- Purpose: Utilities and helpers used across layers
- Contains:
  - `formatters.ts` — Currency, percentage, date formatting with Intl API
  - `company-matching.ts` — Fuzzy company ID resolution across sections
- Includes: Test files colocated (.test.ts)

**src/types/:**
- Purpose: TypeScript type definitions and interfaces
- Contains:
  - `common.ts` — SectionId union, ConfidenceLevel, TrendDirection, DataRecency
  - `filters.ts` — FilterState, FilterActions, DEFAULT_FILTERS
  - `sections.ts` — All 10 section data types (ExecutiveSnapshotData, etc.)
  - `company.ts` — Company interface
  - Domain-specific types

**src/theme/:**
- Purpose: Design tokens, dark mode, and styling configuration
- Contains:
  - `tokens.css` — Tailwind @theme directive with CSS custom properties, brand token overrides
  - `dark-mode.ts` — Theme initialization and toggle logic
  - Tests for dark mode

**src/brands/:**
- Purpose: Multi-tenant brand configurations
- Contains: Brand configs per tenant (kompete.ts, bcg.ts, am.ts) + getBrandConfig router
- Pattern: Each brand config exports BrandConfig object with colors, fonts, favicon, display name

**server/:**
- Purpose: Optional Express backend for real data
- Contains: REST API endpoints serving SQLite data
- Note: Frontend works without this — falls back to mock data

**database/:**
- Purpose: SQLite database and schema
- Contains: industry-landscape.db (data file), schema.sql (DDL)
- Used by: Optional Express server

## Key File Locations

**Entry Points:**
- `index.html` — HTML root with script import
- `src/main.tsx` — React root initialization
- `src/app/App.tsx` — Top-level component with routing

**Configuration:**
- `vite.config.ts` — Vite bundler config
- `tsconfig.json` — TypeScript root config
- `tsconfig.app.json` — App TypeScript config
- `.eslintrc.*` — ESLint linting rules
- `.prettierrc` — Code formatting rules

**Core Logic:**
- `src/api/client.ts` — API/mock data fetching
- `src/stores/filter-store.ts` — Global filter state (Zustand)
- `src/stores/url-sync.ts` — URL parameter synchronization
- `src/hooks/use-filtered-data.ts` — Main data + filter hook

**Routing & Layout:**
- `src/app/routes.tsx` — Section route definitions (10 routes)
- `src/components/layout/AppShell.tsx` — Main layout shell
- `src/components/sections/index.ts` — Lazy-loaded section map

**Testing:**
- `src/lib/formatters.test.ts` — Currency/percentage formatter tests
- `src/lib/company-matching.test.ts` — Company matching tests
- `vitest.config.ts` — Test runner configuration

## Naming Conventions

**Files:**

- **Section roots:** PascalCase matching section name + "Snapshot"/"Performance"/etc.
  - Example: `ExecutiveSnapshot.tsx` (src/sections/executive/)
  - Pattern: One default export per section for lazy loading

- **Components:** PascalCase, descriptive name
  - Example: `SectionSkeleton.tsx`, `FilterBar.tsx`, `BulletSummary.tsx`

- **Utilities/Hooks:** camelCase with type prefix where applicable
  - Example: `formatters.ts`, `use-filtered-data.ts`, `company-matching.ts`

- **Types:** PascalCase + "Data" or domain suffix
  - Example: `ExecutiveSnapshotData`, `FilterState`, `Company`

- **Tests:** Colocated with source, `.test.ts` or `.spec.ts` suffix
  - Example: `formatters.test.ts` alongside `formatters.ts`

- **Config files:** lowercase with dots
  - Example: `vite.config.ts`, `tsconfig.json`, `.eslintrc.json`

**Directories:**

- **Feature/domain directories:** kebab-case (lowercase with hyphens)
  - Example: `src/sections/market-pulse/`, `src/components/ui/`

- **Internal organization:** Flat where possible, nested only for logical grouping
  - Example: `src/components/brand/`, `src/components/layout/`

- **Index files:** Barrel exports in `index.ts` when needed (e.g., `src/components/sections/index.ts`)

## Where to Add New Code

**New Section (Intelligence Report):**

1. Create directory: `src/sections/{section-kebab-name}/`
2. Create root component: `src/sections/{section-kebab-name}/{SectionName}.tsx`
   - Import: `useFilteredData<SectionData>` from `src/hooks/use-filtered-data.ts`
   - Call: `const { data, isPending, error } = useFilteredData(sectionId)`
   - Export: `export default function SectionName() { ... }`
3. Add type: `src/types/sections.ts` → new interface extending SectionData
4. Add query factory: `src/api/queries.ts` → new sectionQueries entry
5. Add route: `src/app/routes.tsx` → new SECTION_ROUTES entry
6. Add lazy load: `src/components/sections/index.ts` → lazySections entry
7. Add mock data: `src/data/mock/{section-kebab-name}.ts` → default export SectionData
8. Tests: `src/sections/{section-kebab-name}/*.test.ts`

**New Filter Type:**

1. Update: `src/types/filters.ts` → add field to FilterState + DEFAULT_FILTERS
2. Update: `src/stores/filter-store.ts` → add setter action
3. Update: `src/stores/url-sync.ts` → add to PARAM_MAP, filtersToParams(), paramsToFilters()
4. Add UI: `src/components/filters/FilterBar.tsx` → add new filter control

**New Component:**

- Presentational: `src/components/{category}/{ComponentName}.tsx`
- UI primitive: `src/components/ui/{PrimitiveName}.tsx`
- Chart wrapper: `src/components/charts/{ChartName}.tsx`
- Error/state UI: `src/components/{purpose}/{ComponentName}.tsx`

**New Utility/Formatter:**

1. Add function: `src/lib/{utility-name}.ts`
2. Tests: `src/lib/{utility-name}.test.ts`
3. Exports: Named exports (avoid default) for tree-shaking
4. Module scope: Expensive constructors (Intl.NumberFormat, regex) at module scope

**New Type Definition:**

1. Location: `src/types/{domain}.ts` (e.g., types/company.ts, types/common.ts)
2. Pattern: Interfaces and type unions
3. Related exports together (e.g., FilterState + FilterActions in types/filters.ts)

**New Query/Hook:**

1. Location: `src/hooks/{use-name}.ts`
2. Pattern: Named export function `export function useHookName() { ... }`
3. Tests: Colocated `src/hooks/{use-name}.test.ts` (if applicable)

## Special Directories

**`.planning/`:**
- Purpose: GSD (Goal-Source-Direction) planning documents
- Generated: Yes (by GSD commands)
- Committed: Yes
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, STACK.md, INTEGRATIONS.md, CONCERNS.md

**`node_modules/`:**
- Purpose: Installed npm dependencies
- Generated: Yes (npm install from package.json)
- Committed: No (.gitignore)

**`dist/`:**
- Purpose: Production build output (single HTML file via vite-plugin-singlefile)
- Generated: Yes (npm run build)
- Committed: No (.gitignore)

**`database/`:**
- Purpose: SQLite database and schema
- Generated: No (checked in)
- Committed: Yes

**`.vscode/`:**
- Purpose: VS Code project settings (if present)
- Generated: No
- Committed: Conditionally (usually in .gitignore, add if team needs shared settings)

---

*Structure analysis: 2026-02-20*
