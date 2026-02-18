# Phase 2: Report Shell and Data Layer - Research

**Researched:** 2026-02-15
**Domain:** React data layer (TanStack Query, Zustand, React.lazy, Radix UI filtering)
**Confidence:** HIGH

## Summary

Phase 2 converts the placeholder-based report shell from Phase 1 into a fully operational data-driven container. The phase adds four capabilities: (1) a typed API client backed by static JSON fixtures with TanStack Query caching, (2) a Zustand filter store with bidirectional URL search param synchronization, (3) lazy-loaded section rendering via React.lazy/Suspense replacing inline placeholders, and (4) a compact FilterBar UI using Radix UI primitives.

The existing codebase (React 19, Vite 7, TypeScript 5, React Router v7, Radix UI 1.4.3) is fully compatible with TanStack Query v5 and Zustand v5. The `radix-ui` unified package already installed supports all needed primitives (Select, Popover, Checkbox). The 10 section type contracts in `src/types/sections.ts` provide the typed foundations for mock data fixtures and query hooks.

**Primary recommendation:** Use TanStack Query v5 with `queryOptions` factory pattern for typed data fetching, Zustand v5 with a custom `searchParamsStorage` adapter (not the persist middleware) for clean bidirectional URL sync, and React.lazy with the existing SectionSkeleton as Suspense fallback.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Static JSON fixtures as mock data in `/src/data/mock/` directory
- Realistic sample data using real Indian Consumer Durables companies (Voltas, Blue Star, Havells, Crompton, Whirlpool India, Symphony, Orient Electric, Bajaj Electricals, V-Guard, TTK Prestige, Butterfly Gandhimathi, Amber Enterprises, Dixon Technologies, Johnson Controls-Hitachi, Daikin India, etc.)
- Plausible financial metrics, deals, and leadership data -- makes the demo compelling
- API client reads from these fixtures, structured to be easily swapped for real API later
- No backend dependency during development
- FilterBar: horizontal strip below the TopBar spanning the full content area width
- Always visible (not collapsible), compact single row with dropdowns
- Filters: company selector (multi-select), sub-category, performance tier, time period
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

### Deferred Ideas (OUT OF SCOPE)
None -- all decisions are within phase scope
</user_constraints>

## Standard Stack

### Core (New Dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @tanstack/react-query | ^5.90 | Server state management, caching, typed data fetching | De facto standard for React data fetching; supports queryOptions factory, staleTime/gcTime |
| zustand | ^5.0 | Client state management for filters with URL sync | Minimal boilerplate, first-class TypeScript, middleware system for URL persistence |
| @tanstack/react-query-devtools | ^5.90 | Dev-only query inspector | Essential for debugging cache, stale states during development |

### Already Installed (Phase 1)
| Library | Version | Purpose | Relevant to Phase 2 |
|---------|---------|---------|---------------------|
| radix-ui | 1.4.3 | UI primitives (Select, Popover, Checkbox) | FilterBar dropdowns and multi-select |
| react-router | ^7.13 | Routing, useSearchParams | URL sync for filters, section navigation |
| react-error-boundary | ^6.1 | Error boundaries around sections | Already wrapping sections via SectionWrapper |
| react | ^19.2 | Core framework | React.lazy, Suspense, useMemo for derived data |
| clsx | ^2.1 | Conditional classNames | FilterBar active states |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zustand | URL-only state (useSearchParams) | Zustand gives external subscribe, derived state, middleware; useSearchParams alone lacks computed values and is verbose for multi-filter logic |
| Custom URL sync | zustand-querystring (npm) | Third-party has 40 weekly downloads; custom is ~30 lines and more controllable for this use case |
| Radix Popover+Checkbox | cmdk or downshift for multi-select | Extra dependency; Radix Popover+Checkbox already installed and sufficient |
| TanStack Query | SWR | TanStack Query has queryOptions factory, better TypeScript inference, select transform |

**Installation:**
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools zustand
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── App.tsx               # Updated: QueryClientProvider wrapper, lazy routes
│   └── routes.tsx            # Existing: SECTION_ROUTES constant
├── data/
│   └── mock/
│       ├── companies.ts      # Company universe (id, name, ticker, subSector)
│       ├── executive.ts      # ExecutiveSnapshotData fixture
│       ├── financial.ts      # FinancialPerformanceData fixture
│       ├── market-pulse.ts   # MarketPulseData fixture
│       ├── deals.ts          # DealsTransactionsData fixture
│       ├── operations.ts     # OperationalIntelligenceData fixture
│       ├── leadership.ts     # LeadershipGovernanceData fixture
│       ├── competitive.ts    # CompetitiveMovesData fixture
│       ├── deep-dive.ts      # SubSectorDeepDiveData fixture
│       ├── action-lens.ts    # ActionLensData fixture
│       └── watchlist.ts      # WatchlistData fixture
├── api/
│   ├── client.ts             # Fetch abstraction (reads from mock, swappable to real API)
│   └── queries.ts            # queryOptions factories for each section
├── stores/
│   ├── filter-store.ts       # Zustand filter store with URL sync
│   └── url-sync.ts           # Custom searchParams storage adapter
├── hooks/
│   └── use-filtered-data.ts  # Combines TanStack Query data + Zustand filters -> filtered result
├── components/
│   ├── filters/
│   │   ├── FilterBar.tsx     # Horizontal filter strip
│   │   ├── CompanyPicker.tsx  # Multi-select company dropdown (Radix Popover+Checkbox)
│   │   ├── SelectFilter.tsx  # Single-select filter (Radix Select, reusable)
│   │   └── filter-options.ts # Static filter option lists derived from mock data
│   ├── layout/
│   │   ├── AppShell.tsx      # Updated: FilterBar slot between TopBar and content
│   │   ├── ReportShell.tsx   # New: wraps Outlet with QueryClientProvider scope
│   │   └── ...existing...
│   └── sections/
│       ├── index.ts          # Lazy import map: SectionId -> React.lazy(() => import(...))
│       └── SectionRouter.tsx # Maps current route to lazy-loaded section component
└── types/
    ├── sections.ts           # Existing: all 10 section data contracts
    ├── filters.ts            # New: FilterState type, filter option types
    └── ...existing...
```

### Pattern 1: queryOptions Factory (TanStack Query v5)
**What:** Co-locate queryKey and queryFn in a single typed object using the `queryOptions` helper.
**When to use:** Every section data fetch.
**Example:**
```typescript
// src/api/queries.ts
import { queryOptions } from '@tanstack/react-query';
import { fetchSectionData } from './client';
import type { SectionId } from '../types/common';
import type { FinancialPerformanceData } from '../types/sections';

// Factory pattern: one function per section
export const sectionQueries = {
  financial: () =>
    queryOptions({
      queryKey: ['section', 'financial'] as const,
      queryFn: () => fetchSectionData<FinancialPerformanceData>('financial'),
      staleTime: Infinity,  // Static mock data never goes stale
      gcTime: Infinity,     // Keep in cache forever (mock data)
    }),

  executive: () =>
    queryOptions({
      queryKey: ['section', 'executive'] as const,
      queryFn: () => fetchSectionData<ExecutiveSnapshotData>('executive'),
      staleTime: Infinity,
      gcTime: Infinity,
    }),

  // ... one per section
};

// Usage in component:
// const { data } = useQuery(sectionQueries.financial());
```
**Source:** [TanStack Query v5 Query Options docs](https://tanstack.com/query/v5/docs/react/guides/query-options), [TkDodo blog](https://tkdodo.eu/blog/the-query-options-api)

### Pattern 2: Zustand Filter Store with URL Bidirectional Sync
**What:** Zustand store whose state is the single source of truth for filters, syncing bidirectionally with URL search params.
**When to use:** Global filter state management.
**Example:**
```typescript
// src/stores/filter-store.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface FilterState {
  companies: string[];      // Company IDs (multi-select)
  subCategory: string;      // Sub-sector filter ("all" = no filter)
  performanceTier: string;  // "all" | "outperform" | "inline" | "underperform"
  timePeriod: string;       // "QoQ" | "YoY" | "MoM"
}

interface FilterActions {
  setCompanies: (companies: string[]) => void;
  setSubCategory: (subCategory: string) => void;
  setPerformanceTier: (tier: string) => void;
  setTimePeriod: (period: string) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  companies: [],
  subCategory: 'all',
  performanceTier: 'all',
  timePeriod: 'YoY',
};

export const useFilterStore = create<FilterState & FilterActions>()(
  subscribeWithSelector((set) => ({
    ...DEFAULT_FILTERS,
    setCompanies: (companies) => set({ companies }),
    setSubCategory: (subCategory) => set({ subCategory }),
    setPerformanceTier: (tier) => set({ performanceTier: tier }),
    setTimePeriod: (period) => set({ timePeriod: period }),
    resetFilters: () => set(DEFAULT_FILTERS),
  }))
);
```

```typescript
// src/stores/url-sync.ts
// Bidirectional sync hook -- used once at the report shell level
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { useFilterStore, type FilterState } from './filter-store';

const PARAM_KEYS: Record<keyof FilterState, string> = {
  companies: 'companies',
  subCategory: 'subcat',
  performanceTier: 'tier',
  timePeriod: 'period',
};

function filtersToParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.companies.length > 0) params.set('companies', filters.companies.join(','));
  if (filters.subCategory !== 'all') params.set('subcat', filters.subCategory);
  if (filters.performanceTier !== 'all') params.set('tier', filters.performanceTier);
  if (filters.timePeriod !== 'YoY') params.set('period', filters.timePeriod);
  return params;
}

function paramsToFilters(params: URLSearchParams): Partial<FilterState> {
  const filters: Partial<FilterState> = {};
  const companies = params.get('companies');
  if (companies) filters.companies = companies.split(',');
  const subcat = params.get('subcat');
  if (subcat) filters.subCategory = subcat;
  const tier = params.get('tier');
  if (tier) filters.performanceTier = tier;
  const period = params.get('period');
  if (period) filters.timePeriod = period;
  return filters;
}

export function useFilterUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isUpdatingFromUrl = useRef(false);
  const isUpdatingFromStore = useRef(false);

  // URL -> Store (on mount and browser back/forward)
  useEffect(() => {
    if (isUpdatingFromStore.current) return;
    isUpdatingFromUrl.current = true;
    const filtersFromUrl = paramsToFilters(searchParams);
    useFilterStore.setState(filtersFromUrl);
    isUpdatingFromUrl.current = false;
  }, [searchParams]);

  // Store -> URL (on filter changes)
  useEffect(() => {
    const unsub = useFilterStore.subscribe(
      (state) => ({
        companies: state.companies,
        subCategory: state.subCategory,
        performanceTier: state.performanceTier,
        timePeriod: state.timePeriod,
      }),
      (filters) => {
        if (isUpdatingFromUrl.current) return;
        isUpdatingFromStore.current = true;
        setSearchParams(filtersToParams(filters as FilterState), { replace: true });
        isUpdatingFromStore.current = false;
      },
      { equalityFn: (a, b) => JSON.stringify(a) === JSON.stringify(b) }
    );
    return unsub;
  }, [setSearchParams]);
}
```
**Source:** [Zustand docs: Connect to state with URL](https://zustand.docs.pmnd.rs/guides/connect-to-state-with-url-hash), [React Router useSearchParams](https://reactrouter.com/api/hooks/useSearchParams)

### Pattern 3: React.lazy Section Loading with SectionSkeleton Fallback
**What:** Replace inline PlaceholderContent with React.lazy imports per section, using Suspense with SectionSkeleton.
**When to use:** Every section route.
**Example:**
```typescript
// src/components/sections/index.ts
import { lazy } from 'react';
import type { SectionId } from '../../types/common';

// Map of section ID to lazy-loaded component
// Each section is a separate chunk that loads only on first visit
export const lazySections: Record<SectionId, React.LazyExoticComponent<React.ComponentType>> = {
  'executive':    lazy(() => import('../../sections/executive/ExecutiveSnapshot')),
  'market-pulse': lazy(() => import('../../sections/market-pulse/MarketPulse')),
  'financial':    lazy(() => import('../../sections/financial/FinancialPerformance')),
  'deals':        lazy(() => import('../../sections/deals/DealsTransactions')),
  'operations':   lazy(() => import('../../sections/operations/OperationalIntelligence')),
  'leadership':   lazy(() => import('../../sections/leadership/LeadershipGovernance')),
  'competitive':  lazy(() => import('../../sections/competitive/CompetitiveMoves')),
  'deep-dive':    lazy(() => import('../../sections/deep-dive/SubSectorDeepDive')),
  'action-lens':  lazy(() => import('../../sections/action-lens/ActionLens')),
  'watchlist':    lazy(() => import('../../sections/watchlist/Watchlist')),
};

// In App.tsx route rendering:
// <Suspense fallback={<SectionSkeleton variant="mixed" />}>
//   <LazySection />
// </Suspense>
```
**Source:** [React docs on code splitting](https://legacy.reactjs.org/docs/code-splitting.html), [web.dev code splitting guide](https://web.dev/code-splitting-suspense/)

### Pattern 4: Client-Side Filtering (Derived Data)
**What:** Filter data client-side by combining TanStack Query cached data with Zustand filter state using `useMemo`.
**When to use:** Every section that displays filterable company data.
**Example:**
```typescript
// src/hooks/use-filtered-data.ts
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFilterStore } from '../stores/filter-store';
import { sectionQueries } from '../api/queries';
import type { FinancialPerformanceData } from '../types/sections';

export function useFilteredFinancialData() {
  const { data, isPending, error } = useQuery(sectionQueries.financial());

  const companies = useFilterStore((s) => s.companies);
  const subCategory = useFilterStore((s) => s.subCategory);
  const performanceTier = useFilterStore((s) => s.performanceTier);

  const filtered = useMemo(() => {
    if (!data) return undefined;

    let result = data.companies;

    if (companies.length > 0) {
      result = result.filter((c) => companies.includes(c.id));
    }
    if (subCategory !== 'all') {
      // subCategory filtering depends on section structure
    }
    if (performanceTier !== 'all') {
      result = result.filter((c) => c.performance === performanceTier);
    }

    return { ...data, companies: result };
  }, [data, companies, subCategory, performanceTier]);

  return { data: filtered, isPending, error };
}
```
**Source:** [TanStack Query discussions on useMemo](https://github.com/TanStack/query/discussions/1641)

### Pattern 5: Multi-Select Company Picker (Radix Popover + Checkbox)
**What:** Radix Popover containing a scrollable list of Checkboxes for multi-company selection.
**When to use:** The company filter in FilterBar.
**Why not Radix Select:** Radix Select does not natively support multiple selection ([GitHub issue #1270](https://github.com/radix-ui/primitives/issues/1270)). The standard pattern is Popover + Checkbox list.
**Example:**
```typescript
// src/components/filters/CompanyPicker.tsx
import { Popover, Checkbox } from 'radix-ui';
import { useFilterStore } from '../../stores/filter-store';

interface CompanyOption {
  id: string;
  name: string;
}

export function CompanyPicker({ options }: { options: CompanyOption[] }) {
  const companies = useFilterStore((s) => s.companies);
  const setCompanies = useFilterStore((s) => s.setCompanies);

  const toggle = (id: string) => {
    setCompanies(
      companies.includes(id)
        ? companies.filter((c) => c !== id)
        : [...companies, id]
    );
  };

  const label = companies.length === 0
    ? 'All companies'
    : `${companies.length} selected`;

  return (
    <Popover.Root>
      <Popover.Trigger className="...compact trigger styles...">
        {label}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="...dropdown content styles..." sideOffset={4}>
          <div className="max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <label key={opt.id} className="flex items-center gap-sm px-sm py-xs text-xs cursor-pointer hover:bg-surface-raised">
                <Checkbox.Root
                  checked={companies.includes(opt.id)}
                  onCheckedChange={() => toggle(opt.id)}
                  className="..."
                >
                  <Checkbox.Indicator>
                    {/* checkmark icon */}
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span>{opt.name}</span>
              </label>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
```
**Source:** [Radix Popover docs](https://www.radix-ui.com/primitives/docs/components/popover), [Radix Checkbox docs](https://www.radix-ui.com/primitives/docs/components/checkbox), [Multi-select Radix gist](https://gist.github.com/Mrtly/2b3bc1a3cf42d267c1ee9451c928737e)

### Anti-Patterns to Avoid
- **Refetching on filter change:** Filters are client-side only (FOUND-14). Never include filter state in queryKeys -- data is fetched once, filtered via useMemo.
- **Zustand persist middleware for URL sync:** The persist middleware serializes the entire state slice as JSON under a single key. URL params need individual keys (`?companies=x&tier=y`). Use a custom sync hook instead.
- **Eager-loading all sections:** Each section must be a separate chunk via React.lazy. Do not import section components at the top level of App.tsx.
- **useEffect for derived data:** Never put filtering logic in useEffect + setState. Use useMemo for synchronous derived data.
- **Unstable selector references in Zustand:** In Zustand v5, if a selector returns a new object reference each render, it causes infinite re-renders. Use individual primitive selectors (`s => s.companies`) or `useShallow` for object selectors.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Data caching + deduplication | Custom cache with Map/WeakMap | TanStack Query v5 | Handles stale-while-revalidate, gc, dedup, devtools |
| Multi-select dropdown (a11y) | Custom div+click handlers | Radix Popover + Checkbox | Keyboard nav, focus management, screen reader, portal |
| Single-select dropdown (a11y) | Custom select element | Radix Select | WAI-ARIA combobox pattern, keyboard, portal |
| URL serialization | Manual window.location parsing | useSearchParams (react-router) | Integrates with router history, avoids stale closures |
| Loading states during lazy load | Custom loading spinner | Suspense + SectionSkeleton | React-native boundary, concurrent-ready |

**Key insight:** The Radix UI unified package already installed provides all UI primitives needed for the FilterBar (Select for single-select, Popover+Checkbox for multi-select). No additional UI library needed.

## Common Pitfalls

### Pitfall 1: URL Sync Infinite Loop
**What goes wrong:** Zustand filter change triggers URL update, URL change triggers Zustand update, creating an infinite loop.
**Why it happens:** Bidirectional sync without guards.
**How to avoid:** Use ref-based guards (`isUpdatingFromUrl`, `isUpdatingFromStore`) to break the cycle. The URL sync hook must skip store updates when it is the source of the URL change, and vice versa.
**Warning signs:** Browser freezing, console flooded with setState calls.

### Pitfall 2: Zustand v5 Selector Stability
**What goes wrong:** Component re-renders infinitely when using object-returning selectors.
**Why it happens:** Zustand v5 changed default behavior to match React -- new object references trigger re-render.
**How to avoid:** Select individual primitives (`s => s.companies`) or use `useShallow` from `zustand/shallow` for object selectors. Never return `{ ...state }` from a selector.
**Warning signs:** "Maximum update depth exceeded" error.

### Pitfall 3: React.lazy Only Supports Default Exports
**What goes wrong:** `React.lazy(() => import('./Component'))` fails with named exports.
**Why it happens:** React.lazy expects the module to have a `default` export.
**How to avoid:** Either use `export default function Component()` in section files, or create an intermediate re-export: `lazy(() => import('./Component').then(m => ({ default: m.Component })))`.
**Warning signs:** "Element type is invalid" error at runtime.

### Pitfall 4: Filter State in Query Keys
**What goes wrong:** Changing a filter triggers a new API request even though data should be filtered client-side.
**Why it happens:** Developer includes filter values in the queryKey array.
**How to avoid:** queryKeys should only contain section identifiers, never filter state. Filtering happens via useMemo after data is fetched.
**Warning signs:** Network tab shows requests on every filter click.

### Pitfall 5: QueryClientProvider Placement
**What goes wrong:** "No QueryClient set" error when navigating to report routes.
**Why it happens:** QueryClientProvider is placed inside a route component that unmounts on navigation.
**How to avoid:** Place QueryClientProvider at the app root level (in App.tsx or main.tsx), above BrowserRouter or at the same level. It must wrap the entire app, not just the report routes.
**Warning signs:** Error appears on initial navigation to any report section.

### Pitfall 6: Stale Closures in URL Sync
**What goes wrong:** `setSearchParams` captures stale URL state, clobbering other params.
**Why it happens:** React Router's setSearchParams replaces all params by default.
**How to avoid:** When updating search params, always merge with existing params. Use the functional form: `setSearchParams(prev => { const next = new URLSearchParams(prev); next.set('key', 'val'); return next; })` or build params from store state (single source of truth).
**Warning signs:** Navigating between sections loses filter params.

## Code Examples

### QueryClient Configuration (for monthly report with static mock data)
```typescript
// src/api/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,       // Mock data never goes stale
      gcTime: 1000 * 60 * 30,   // Keep unused data for 30 min (prevents memory leaks in dev)
      refetchOnWindowFocus: false, // No refetch on focus (static data)
      refetchOnReconnect: false,   // No refetch on reconnect
      retry: 1,                    // One retry for loading failures
    },
  },
});
```

### API Client Abstraction (swappable mock -> real)
```typescript
// src/api/client.ts
import type { SectionData } from '../types/sections';
import type { SectionId } from '../types/common';

// Mock data imports -- will be replaced with fetch() to real API
const mockModules: Record<SectionId, () => Promise<SectionData>> = {
  'executive':    () => import('../data/mock/executive').then(m => m.default),
  'financial':    () => import('../data/mock/financial').then(m => m.default),
  'market-pulse': () => import('../data/mock/market-pulse').then(m => m.default),
  'deals':        () => import('../data/mock/deals').then(m => m.default),
  'operations':   () => import('../data/mock/operations').then(m => m.default),
  'leadership':   () => import('../data/mock/leadership').then(m => m.default),
  'competitive':  () => import('../data/mock/competitive').then(m => m.default),
  'deep-dive':    () => import('../data/mock/deep-dive').then(m => m.default),
  'action-lens':  () => import('../data/mock/action-lens').then(m => m.default),
  'watchlist':    () => import('../data/mock/watchlist').then(m => m.default),
};

/**
 * Fetch section data. Currently reads from static JSON fixtures.
 * When real API is ready, replace with: fetch(`/api/sections/${sectionId}`).then(r => r.json())
 */
export async function fetchSectionData<T extends SectionData>(
  sectionId: SectionId
): Promise<T> {
  // Simulate network latency in development
  if (import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  }
  const loader = mockModules[sectionId];
  if (!loader) throw new Error(`Unknown section: ${sectionId}`);
  return loader() as Promise<T>;
}
```

### App.tsx Update (QueryClientProvider + Lazy Routes)
```typescript
// src/app/App.tsx - Updated structure
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../api/query-client';
import { BrandProvider } from '../components/brand/BrandProvider';
import { AppShell } from '../components/layout/AppShell';
import { SectionWrapper } from '../components/layout/SectionWrapper';
import { SectionSkeleton } from '../components/ui/SectionSkeleton';
import { lazySections } from '../components/sections';
import { SECTION_ROUTES } from './routes';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/:tenantSlug/report"
            element={
              <BrandProvider>
                <AppShell />
              </BrandProvider>
            }
          >
            <Route index element={<Navigate to="executive" replace />} />
            {SECTION_ROUTES.map((section) => {
              const LazySection = lazySections[section.path as keyof typeof lazySections];
              return (
                <Route
                  key={section.path}
                  path={section.path}
                  element={
                    <SectionWrapper sectionKey={section.path}>
                      <Suspense fallback={<SectionSkeleton variant="mixed" />}>
                        <LazySection />
                      </Suspense>
                    </SectionWrapper>
                  }
                />
              );
            })}
          </Route>
          <Route path="/" element={<Navigate to="/kompete/report" replace />} />
          <Route path="*" element={<Navigate to="/kompete/report" replace />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### FilterBar Layout Integration (AppShell Update)
```typescript
// src/components/layout/AppShell.tsx - Updated with FilterBar slot
import { Outlet } from 'react-router';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { FilterBar } from '../filters/FilterBar';
import { useFilterUrlSync } from '../../stores/url-sync';

export function AppShell() {
  // Activate bidirectional URL <-> store sync
  useFilterUrlSync();

  return (
    <div className="flex flex-col h-screen bg-surface text-text-primary font-body">
      <TopBar />
      <FilterBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-auto p-md">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

### Mock Data Fixture Example
```typescript
// src/data/mock/financial.ts
import type { FinancialPerformanceData } from '../../types/sections';

const data: FinancialPerformanceData = {
  section: 'financial-performance',
  dataAsOf: 'Q3 FY25',
  lastUpdated: '2025-01-15T00:00:00Z',
  companies: [
    {
      id: 'voltas',
      name: 'Voltas Limited',
      ticker: 'VOLTAS',
      metrics: {
        revenueGrowthYoY: 0.183,
        ebitdaMargin: 0.092,
        workingCapitalDays: 45,
        roce: 0.168,
        debtEquity: 0.12,
      },
      performance: 'outperform',
      varianceAnalysis: 'Strong AC season drove 18% revenue growth; margin expansion from operating leverage.',
      source: 'BSE filing Q3 FY25',
    },
    {
      id: 'bluestar',
      name: 'Blue Star Limited',
      ticker: 'BLUESTAR',
      metrics: {
        revenueGrowthYoY: 0.215,
        ebitdaMargin: 0.078,
        workingCapitalDays: 62,
        roce: 0.195,
        debtEquity: 0.08,
      },
      performance: 'outperform',
      varianceAnalysis: 'Highest revenue growth in coverage universe; commercial AC segment outperforming.',
      source: 'BSE filing Q3 FY25',
    },
    // ... 13-15 more companies with plausible data
  ],
};

export default data;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| cacheTime option | gcTime option | TanStack Query v5 (Oct 2023) | Renamed for clarity; same behavior |
| create(fn) | create<T>()(fn) | Zustand v5 (Oct 2024) | Double parentheses required for TypeScript |
| Individual @radix-ui/* packages | Unified `radix-ui` package | Radix UI 1.x (2024) | Single dependency, cleaner imports |
| useQuery({ queryKey, queryFn }) separate | queryOptions({ queryKey, queryFn }) factory | TanStack Query v5 | Co-located, type-safe, reusable |
| Zustand shallow import | useShallow from zustand/shallow | Zustand v5 | Hook-based shallow comparison for selectors |
| BrowserRouter from react-router-dom | BrowserRouter from react-router | React Router v7 | Unified package import |

**Deprecated/outdated:**
- `cacheTime` in TanStack Query: renamed to `gcTime` in v5. Using `cacheTime` will be ignored.
- Zustand `create(fn)` without double parens: works at runtime but loses TypeScript inference in v5.
- Individual `@radix-ui/react-select` etc. packages: still work but the unified `radix-ui` package is the modern approach and already installed.

## Open Questions

1. **Section placeholder components for Phase 2**
   - What we know: React.lazy requires actual component files to import. Phase 2 sets up lazy loading infrastructure, but full section content is Phases 3-9.
   - What's unclear: Should Phase 2 create minimal placeholder section components in `src/sections/*/` that just show section name + filtered data count, or reuse something simpler?
   - Recommendation: Create thin placeholder components per section that accept filtered data and render a basic "N companies, M records" summary. This proves the entire pipeline works (fetch -> cache -> filter -> render) while keeping section content for later phases.

2. **Filter options derivation**
   - What we know: Company list, sub-categories, and performance tiers should come from the mock data itself.
   - What's unclear: Should filter options be computed from mock data at build time, or derived at runtime?
   - Recommendation: Export a `companies.ts` fixture with the full company universe. Derive sub-category and performance tier options from the company list at import time (they are static). This avoids hardcoding filter options separately from data.

3. **React Router v7 useSearchParams and Zustand external subscribe**
   - What we know: `useSearchParams` is a React hook that must be called inside a component. Zustand's `subscribe` works outside React.
   - What's unclear: Whether the Zustand -> URL direction can use `subscribe` outside React or must go through a React effect.
   - Recommendation: Use `useEffect` with Zustand's `subscribe` inside the sync hook component. This keeps the sync within React's lifecycle and avoids stale `setSearchParams` references.

## Sources

### Primary (HIGH confidence)
- [TanStack Query v5 Quick Start](https://tanstack.com/query/v5/docs/framework/react/quick-start) - Setup, QueryClientProvider, useQuery
- [TanStack Query v5 Query Options](https://tanstack.com/query/v5/docs/react/guides/query-options) - queryOptions factory pattern
- [TanStack Query v5 useQuery Reference](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery) - staleTime, gcTime, select
- [TanStack Query v5 QueryClient Reference](https://tanstack.com/query/v5/docs/reference/QueryClient) - defaultOptions
- [@tanstack/react-query npm](https://www.npmjs.com/package/@tanstack/react-query) - v5.90.21 latest
- [Zustand npm](https://www.npmjs.com/package/zustand) - v5.0.11 latest
- [Zustand docs: Connect to state with URL](https://zustand.docs.pmnd.rs/guides/connect-to-state-with-url-hash) - URL sync pattern with custom storage
- [Zustand docs: subscribeWithSelector](https://zustand.docs.pmnd.rs/middlewares/subscribe-with-selector) - Selector-based subscriptions
- [Zustand docs: Migrating to v5](https://zustand.docs.pmnd.rs/migrations/migrating-to-v5) - Breaking changes, TypeScript patterns
- [Radix UI Select](https://www.radix-ui.com/primitives/docs/components/select) - Single-select dropdown
- [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover) - Container for multi-select
- [Radix UI Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox) - Checkboxes inside multi-select
- [React Router useSearchParams](https://reactrouter.com/api/hooks/useSearchParams) - URL param hook API
- [radix-ui npm](https://www.npmjs.com/package/radix-ui) - v1.4.3 unified package

### Secondary (MEDIUM confidence)
- [TkDodo: The Query Options API](https://tkdodo.eu/blog/the-query-options-api) - Factory pattern rationale
- [web.dev: Code splitting with React.lazy and Suspense](https://web.dev/code-splitting-suspense/) - Best practices
- [Radix multi-select GitHub issue #1270](https://github.com/radix-ui/primitives/issues/1270) - Confirms no native multi-select in Radix Select
- [Radix MultiSelect gist (Mrtly)](https://gist.github.com/Mrtly/2b3bc1a3cf42d267c1ee9451c928737e) - Popover+Checkbox pattern
- [LogRocket: URL state with useSearchParams](https://blog.logrocket.com/url-state-usesearchparams/) - Bidirectional sync patterns

### Tertiary (LOW confidence)
- [zustand-querystring npm](https://github.com/nitedani/zustand-querystring) - Third-party middleware (evaluated, not recommended due to low adoption)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified on npm with current versions, React 19 compatibility confirmed
- Architecture: HIGH - Patterns sourced from official docs and TkDodo (TanStack Query maintainer)
- Pitfalls: HIGH - Common issues well-documented in GitHub discussions and official migration guides
- URL sync pattern: MEDIUM - Custom implementation based on official Zustand guide; no single canonical pattern exists

**Research date:** 2026-02-15
**Valid until:** 2026-03-15 (stable ecosystem, 30-day validity)
