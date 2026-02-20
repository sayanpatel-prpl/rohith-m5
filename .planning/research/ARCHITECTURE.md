# Architecture Patterns

**Domain:** Financial Intelligence React SPA Dashboard
**Researched:** 2026-02-20

## Recommended Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Single HTML File               │
├─────────────────────────────────────────────────────────────┤
│  Application Shell (Routing, Layout, Global State)          │
│  ┌─────────────┬─────────────┬──────────────────────────┐   │
│  │   TopBar    │  Sidebar    │   Main Content Area      │   │
│  │  (Branding) │  (Nav)      │                          │   │
│  │             │             │   ┌──────────────────┐   │   │
│  │             │             │   │  FilterBar       │   │   │
│  │             │             │   ├──────────────────┤   │   │
│  │             │             │   │  Section Outlet  │   │   │
│  │             │             │   │  (Lazy-loaded)   │   │   │
│  │             │             │   └──────────────────┘   │   │
│  └─────────────┴─────────────┴──────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (TanStack Query Cache + Client-side Filtering)  │
├─────────────────────────────────────────────────────────────┤
│  API Client (Fetch from Server OR Fallback to Mock Data)    │
└─────────────────────────────────────────────────────────────┘
```

### Component Boundaries

| Component | Responsibility | Communicates With | Lifecycle |
|-----------|---------------|-------------------|-----------|
| **Application Root** | Initialize providers, routing, dark mode | All children via context | Mounts once |
| **QueryClientProvider** | Manage server data cache (TanStack Query) | All components via useQuery | Mounts once |
| **BrandProvider** | Multi-tenant theming, set CSS variables | All styled components | Mounts once per tenant |
| **Router** | URL routing, lazy loading sections | AppShell, Section components | Mounts once |
| **AppShell** | Layout container, URL ↔ state sync | TopBar, Sidebar, FilterBar, Outlet | Per route |
| **FilterBar** | Global filter controls (companies, categories, tiers) | Zustand filter store, URL params | Per route |
| **Section Components** | Domain-specific views (11 sections) | useFilteredData hook | Lazy-loaded per route |
| **Error Boundaries** | Catch rendering errors per section | Section components | Per section |
| **Suspense Boundaries** | Loading states during lazy load | Section components | Per section |
| **API Client** | Fetch data from server or mock files | TanStack Query queryFn | Called per section |
| **Zustand Store** | Global filter state with URL sync | FilterBar, url-sync hook, useFilteredData | Singleton |

### Data Flow

**Section Data Retrieval:**

```
User navigates to /tenant/report/financial
    ↓
React Router loads route
    ↓
Suspense + lazy() fetch section component code
    ↓
Section component renders, calls useFilteredData("financial")
    ↓
TanStack Query checks cache for ["section", "financial"]
    ├─ Cache hit (staleTime: Infinity) → Return cached data
    └─ Cache miss → Call fetchSectionData("financial")
        ├─ VITE_USE_REAL_API = true → fetch(API_URL/api/financial)
        │   ├─ Success (status 200) → Return JSON
        │   └─ Fail (4xx/5xx/network error) → Fall back to mock
        └─ VITE_USE_REAL_API = false → Direct mock data import
            ↓
        Dynamic import("../data/mock/financial.ts")
            ↓
        Return SectionData object
            ↓
    TanStack Query caches result
        ↓
useFilteredData receives rawData
    ↓
useMemo applies client-side filters (companies, subCategory, tier)
    ↓
Return { data: filteredData, rawData, isPending, error }
    ↓
Section component renders filtered data
```

**Filter State Update Flow:**

```
User clicks "Voltas" company filter
    ↓
FilterBar calls setFilterStore({ companies: ["voltas"] })
    ↓
Zustand store updates state
    ├─ Notify all subscribers (url-sync hook, useFilteredData selectors)
    │   ↓
    │ url-sync hook reads new state via subscribeWithSelector
    │   ↓
    │ Calls setSearchParams({ companies: "voltas" })
    │   ↓
    │ URL updates: ?companies=voltas
    │   ↓
    │ Browser back/forward triggers useSearchParams change
    │   ↓
    │ url-sync detects URL change (ref guards prevent loop)
    │   ↓
    │ Updates Zustand store from URL params
    │
    └─ useFilteredData receives new filter state
        ↓
    useMemo re-runs with new filters (NO API CALL)
        ↓
    Filter already-cached data in memory
        ↓
    Component re-renders with filtered subset
```

**Multi-Tenant Branding Flow:**

```
User navigates to /bcg/report/executive
    ↓
BrandProvider extracts tenantSlug from route params
    ↓
Loads brand config from src/brands/bcg.ts
    ↓
Sets data-tenant="bcg" on documentElement
    ↓
Updates document.title and favicon
    ↓
CSS custom properties scoped to [data-tenant="bcg"]
    ↓
All components reference CSS variables (--color-primary, etc.)
    ↓
Visual theme updates without code changes
```

## Patterns to Follow

### Pattern 1: Client-Side Filtering with useMemo

**What:** All filtering happens in React's useMemo against already-fetched data. Filter state is NOT part of query keys.

**When:** You have static/semi-static datasets (refreshed daily/weekly) and need shareable filtered views via URL.

**Why:**
- **Instant filter response** — No network round-trips
- **Shareable URLs** — Filters encoded in URL params
- **Reduced API load** — Fetch once per section, filter in browser
- **Simpler backend** — No need for complex filter query APIs

**Example:**

```typescript
export function useFilteredData<T extends SectionData>(sectionId: SectionId) {
  // Fetch once, cache forever (staleTime: Infinity)
  const { data: rawData, isPending, error } = useQuery(
    sectionQueries[sectionId]()
  );

  // Individual primitive selectors prevent re-render loops
  const companies = useFilterStore((s) => s.companies);
  const subCategory = useFilterStore((s) => s.subCategory);

  // Filter in useMemo (synchronous, derived data)
  const filteredData = useMemo(() => {
    if (!rawData) return undefined;

    const result = { ...rawData };
    for (const [key, value] of Object.entries(result)) {
      if (!Array.isArray(value)) continue;

      let filtered = value;

      // Apply company filter
      if (companies.length > 0) {
        filtered = filtered.filter(entry =>
          companies.includes(entry.companyId)
        );
      }

      // Apply subcategory filter
      if (subCategory !== "all") {
        filtered = filtered.filter(entry =>
          entry.subCategory === subCategory
        );
      }

      result[key] = filtered;
    }

    return result as T;
  }, [rawData, companies, subCategory]);

  return { data: filteredData, rawData, isPending, error };
}
```

**Confidence:** HIGH — TanStack Query documentation recommends this for static/semi-static data (see [TanStack Query Caching Guide](https://tanstack.com/query/v4/docs/framework/react/guides/caching))

---

### Pattern 2: Bidirectional URL State Synchronization

**What:** Keep Zustand store and URL search params in sync with ref-based loop guards.

**When:** You want shareable filter states and browser back/forward support.

**Why:**
- **Shareable links** — Copy URL with filters applied
- **Browser navigation** — Back/forward works with filter history
- **Persistence** — Refresh page maintains filter state
- **No external deps** — Uses built-in useSearchParams + Zustand

**Example:**

```typescript
export function useFilterUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isUpdatingFromUrl = useRef(false);
  const isUpdatingFromStore = useRef(false);

  // Sync URL → Store on mount and URL changes
  useEffect(() => {
    if (isUpdatingFromStore.current) return; // Prevent loop

    isUpdatingFromUrl.current = true;

    const companies = searchParams.get("companies")?.split(",") || [];
    const subcat = searchParams.get("subcat") || "all";

    useFilterStore.setState({
      companies,
      subCategory: subcat
    });

    isUpdatingFromUrl.current = false;
  }, [searchParams]);

  // Sync Store → URL on filter changes
  useEffect(() => {
    const unsubscribe = useFilterStore.subscribe(
      (state) => ({ companies: state.companies, subCategory: state.subCategory }),
      (filters) => {
        if (isUpdatingFromUrl.current) return; // Prevent loop

        isUpdatingFromStore.current = true;

        const params = new URLSearchParams();
        if (filters.companies.length > 0) {
          params.set("companies", filters.companies.join(","));
        }
        if (filters.subCategory !== "all") {
          params.set("subcat", filters.subCategory);
        }

        setSearchParams(params, { replace: true });

        isUpdatingFromStore.current = false;
      },
      { equalityFn: shallow }
    );

    return unsubscribe;
  }, [setSearchParams]);
}
```

**Confidence:** HIGH — This pattern is validated by [nuqs library](https://nuqs.dev) and recommended in [React Router state management docs](https://reactrouter.com/explanation/state-management)

---

### Pattern 3: Lazy-Loaded Section Components with Suspense + Error Boundaries

**What:** Each section is code-split, lazy-loaded, wrapped in error boundary + Suspense.

**When:** You have 5+ independent views/sections with heavy sub-components.

**Why:**
- **Faster initial load** — Load only landing section
- **Isolated failures** — One section error doesn't crash app
- **Better UX** — Loading skeletons per section
- **Parallel loading** — Router can prefetch routes

**Example:**

```typescript
// src/components/sections/index.ts
export const ExecutiveSnapshot = lazy(() =>
  import("../../sections/executive/ExecutiveSnapshot")
);
export const FinancialPerformance = lazy(() =>
  import("../../sections/financial/FinancialPerformance")
);
// ... 9 more sections

// src/app/App.tsx
<Route path=":tenantSlug/report" element={<AppShell />}>
  <Route
    path="executive"
    element={
      <ErrorBoundary FallbackComponent={SectionErrorFallback}>
        <Suspense fallback={<SectionSkeleton />}>
          <ExecutiveSnapshot />
        </Suspense>
      </ErrorBoundary>
    }
  />
  {/* ... 10 more section routes */}
</Route>
```

**Confidence:** HIGH — React official docs recommend this pattern ([Code Splitting](https://legacy.reactjs.org/docs/code-splitting.html), [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary))

---

### Pattern 4: Multi-Tenant Theming via CSS Variables + data-* Attributes

**What:** Set `data-tenant` attribute on root element, scope CSS variables per tenant.

**When:** You need white-label branding for multiple clients.

**Why:**
- **No rebuild needed** — Theme changes are CSS-only
- **Type-safe config** — Brand configs in TypeScript
- **Performance** — CSS variables update instantly
- **Maintainable** — Single source of truth per brand

**Example:**

```typescript
// src/brands/bcg.ts
export const bcgBrand: BrandConfig = {
  slug: "bcg",
  name: "BCG Intelligence",
  colors: {
    primary: "#0D47A1",
    secondary: "#1976D2",
    accent: "#FFD700",
  },
  favicon: "/bcg-favicon.ico",
};

// src/components/brand/BrandProvider.tsx
export function BrandProvider({ children }: { children: ReactNode }) {
  const { tenantSlug } = useParams();
  const brand = BRANDS[tenantSlug] || BRANDS.kompete;

  useEffect(() => {
    document.documentElement.setAttribute("data-tenant", brand.slug);
    document.title = `${brand.name} - Industry Intel`;

    // Update favicon
    const link = document.querySelector("link[rel='icon']");
    if (link) link.setAttribute("href", brand.favicon);
  }, [brand]);

  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

// src/theme/tokens.css
[data-tenant="bcg"] {
  --color-primary: #0D47A1;
  --color-secondary: #1976D2;
  --color-accent: #FFD700;
}

[data-tenant="kompete"] {
  --color-primary: #1E3A8A;
  --color-secondary: #3B82F6;
  --color-accent: #10B981;
}

/* Components reference variables */
.button-primary {
  background-color: var(--color-primary);
  color: white;
}
```

**Confidence:** MEDIUM — This is a well-documented pattern ([shadcn/ui theming](https://designrevision.com/blog/shadcn-ui-guide), [multi-tenant theming articles](https://medium.com/@aimanfaruk98/multi-tenant-theming-with-nextjs-app-router-tailwind-6a5a4195ed70)), but less common than single-tenant apps.

---

### Pattern 5: Source Attribution Threading via Metadata Fields

**What:** Every data point carries source metadata (provider, confidence, date).

**When:** You need audit trails or data lineage for compliance/transparency.

**Why:**
- **Transparency** — Users know data origin
- **Compliance** — Audit trail for regulated industries
- **Trust** — Confidence scores guide decision-making
- **Debugging** — Trace bad data to source

**Example:**

```typescript
// Type definition
interface SourceAttribution {
  provider: "Screener.in" | "Trendlyne" | "Sovrenn" | "Manual";
  confidence: "high" | "medium" | "low";
  extractedAt: string; // ISO date
  url?: string; // Optional source URL
}

interface DataPoint {
  value: number;
  label: string;
  source: SourceAttribution;
}

// Component rendering
function MetricCard({ metric }: { metric: DataPoint }) {
  return (
    <div className="metric-card">
      <span className="value">{metric.value}</span>
      <span className="label">{metric.label}</span>
      <SourceBadge source={metric.source} />
    </div>
  );
}

function SourceBadge({ source }: { source: SourceAttribution }) {
  return (
    <div className="source-badge" data-confidence={source.confidence}>
      <span className="provider">{source.provider}</span>
      <span className="date">{formatDate(source.extractedAt)}</span>
      {source.url && (
        <a href={source.url} target="_blank" rel="noopener">
          View Source
        </a>
      )}
    </div>
  );
}
```

**Confidence:** LOW — This is domain-specific pattern. No widely-adopted standards found, but conceptually similar to [data attribution in GA4](https://www.cometly.com/post/marketing-attribution-ga4) and [BigQuery attribution models](https://www.owox.com/blog/articles/build-attribution-model-bigquery).

---

### Pattern 6: Graceful Degradation with Fallback Mock Data

**What:** API client tries real backend, falls back to bundled mock data on failure.

**When:** You deploy frontend before backend is ready, or need offline capability.

**Why:**
- **Parallel development** — Frontend works without backend
- **Demo capability** — Show UI with realistic data offline
- **Resilience** — Partial outage doesn't brick app
- **Testing** — E2E tests use deterministic mock data

**Example:**

```typescript
export async function fetchSectionData<T>(sectionId: SectionId): Promise<T> {
  const USE_REAL_API = import.meta.env.VITE_USE_REAL_API !== "false";

  if (USE_REAL_API) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${sectionId}`);

      if (!response.ok) {
        console.warn(`API ${response.status}, falling back to mock`);
        return fetchMockData(sectionId) as Promise<T>;
      }

      return await response.json();
    } catch (error) {
      console.warn(`API failed, falling back to mock:`, error);
      return fetchMockData(sectionId) as Promise<T>;
    }
  }

  return fetchMockData(sectionId) as Promise<T>;
}

async function fetchMockData(sectionId: SectionId): Promise<SectionData> {
  // Dynamic import for code splitting
  const mockModules = {
    executive: () => import("../data/mock/executive"),
    financial: () => import("../data/mock/financial"),
    // ... 9 more sections
  };

  const loader = mockModules[sectionId];
  if (!loader) throw new Error(`Unknown section: ${sectionId}`);

  return loader().then(m => m.default);
}
```

**Confidence:** HIGH — This is a standard resilience pattern, commonly used in TanStack Query applications ([TanStack Query SSR docs](https://tanstack.com/query/v4/docs/framework/react/guides/ssr))

---

### Pattern 7: Single Custom Hook for Data + Filtering

**What:** One hook (`useFilteredData`) encapsulates fetching + filtering + error handling.

**When:** Multiple components need the same data with filters applied.

**Why:**
- **DRY** — Avoid repeating query + filter logic
- **Consistency** — All components filter the same way
- **Type safety** — Generic hook with section-specific types
- **Testability** — Mock hook once, test components easily

**Example:**

```typescript
// Hook definition
export function useFilteredData<T extends SectionData>(sectionId: SectionId) {
  const { data: rawData, isPending, error } = useQuery(
    sectionQueries[sectionId]()
  );

  const companies = useFilterStore(s => s.companies);
  const subCategory = useFilterStore(s => s.subCategory);

  const filteredData = useMemo(() => {
    if (!rawData) return undefined;
    // Apply filters...
    return filteredResult as T;
  }, [rawData, companies, subCategory]);

  return { data: filteredData, rawData, isPending, error };
}

// Usage in component
export default function FinancialPerformance() {
  const { data, isPending, error } = useFilteredData<FinancialData>("financial");

  if (isPending) return <SectionSkeleton />;
  if (error) throw error; // Caught by error boundary

  return <div>{/* Render filtered data */}</div>;
}
```

**Confidence:** HIGH — Custom hooks for data fetching are a React best practice ([React custom hooks docs](https://react.dev/learn/reusing-logic-with-custom-hooks), [2026 custom hooks guide](https://oneuptime.com/blog/post/2026-02-02-react-custom-hooks/view))

---

### Pattern 8: Section-Specific Sub-Components in Feature Folders

**What:** Each section has its own folder with root component + domain-specific sub-components.

**When:** Sections have 3+ unique components not reused elsewhere.

**Why:**
- **Locality** — Related code stays together
- **Ownership** — Clear boundaries for teams
- **Code splitting** — Lazy load pulls in whole section bundle
- **Discoverability** — Easy to find section-specific logic

**Example:**

```
src/sections/
├── financial/
│   ├── FinancialPerformance.tsx    # Default export (lazy-loaded)
│   ├── MetricsTable.tsx             # Section-specific table
│   ├── ComparisonChart.tsx          # Section-specific chart
│   ├── VarianceAnalysis.tsx         # Domain logic component
│   └── useSortedData.ts             # Section-specific hook
├── executive/
│   ├── ExecutiveSnapshot.tsx        # Default export
│   ├── BulletSummary.tsx
│   ├── ThemeNarrative.tsx
│   └── RedFlagsTable.tsx
└── deals/
    ├── DealsTransactions.tsx        # Default export
    ├── DealCard.tsx
    ├── DealTimeline.tsx
    └── DealPatterns.tsx
```

**Confidence:** HIGH — This is a widely-adopted pattern ([Feature-Sliced Design](https://feature-sliced.design/blog/zustand-simple-state-guide), [React project structure 2026](https://medium.com/@romko.kozak/building-reusable-react-components-in-2026-a461d30f8ce4))

---

### Pattern 9: TanStack Query with Infinite staleTime

**What:** Set `staleTime: Infinity` for static/daily-updated data.

**When:** Data changes infrequently (daily, weekly) and you control refresh timing.

**Why:**
- **No background refetches** — Reduce server load
- **Predictable behavior** — Data only fetches once per session
- **Offline-first** — Works without network after initial load
- **Performance** — No unnecessary network requests

**Example:**

```typescript
// src/api/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,           // Data never goes stale
      gcTime: 1000 * 60 * 60 * 24,   // Keep in cache for 24 hours
      refetchOnWindowFocus: false,   // No refetch on tab switch
      refetchOnReconnect: false,     // No refetch on network reconnect
      retry: 1,                      // Retry once on failure
    },
  },
});

// Per-section query options
export const sectionQueries = {
  executive: () => queryOptions({
    queryKey: ["section", "executive"],
    queryFn: () => fetchSectionData<ExecutiveData>("executive"),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  }),
  // ... more sections
};
```

**Confidence:** HIGH — TanStack Query documentation covers this pattern ([Caching guide](https://tanstack.com/query/v4/docs/framework/react/guides/caching), [staleTime vs gcTime discussion](https://github.com/TanStack/query/discussions/1685))

---

### Pattern 10: vite-plugin-singlefile for Portable Distribution

**What:** Bundle entire SPA (HTML, CSS, JS) into one HTML file.

**When:** You need offline-capable files or embed in systems without static hosting.

**Why:**
- **Portability** — Email a single file
- **Offline capability** — Double-click to open, no server needed
- **Simple deployment** — No CDN/hosting config
- **Embed-friendly** — Drop into CMS or knowledge base

**Example:**

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile(), // Inline all assets into HTML
  ],
  build: {
    assetsInlineLimit: 100000000, // Inline everything
    cssCodeSplit: false,          // Single CSS bundle
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // Flatten code splits
      },
    },
  },
});
```

**Trade-offs:**
- ✅ Single file output
- ✅ Works offline
- ❌ Large file size (5-10MB typical for data-heavy apps)
- ❌ No HTTP/2 multiplexing benefits
- ❌ No incremental loading

**Confidence:** MEDIUM — Plugin is well-maintained ([npm package](https://www.npmjs.com/package/vite-plugin-singlefile), [GitHub](https://github.com/richardtallent/vite-plugin-singlefile)), but use case is niche (not recommended for performance-critical web hosting).

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Putting Filters in Query Keys

**What:** Including filter state in TanStack Query keys like `["section", "financial", { companies: ["voltas"] }]`

**Why bad:**
- **Cache explosion** — Every filter combo creates new cache entry
- **Wasted API calls** — Refetch same data with different filters
- **Slow filtering** — Network latency instead of instant client-side
- **Complex invalidation** — Hard to invalidate related queries

**Instead:** Fetch once with static query key, filter in `useMemo`

**Confidence:** HIGH — TanStack Query docs recommend this for static data ([Caching guide](https://tanstack.com/query/v4/docs/framework/react/guides/caching))

---

### Anti-Pattern 2: Inline Lazy Imports in Route Definitions

**What:** Using `lazy(() => import('./Section'))` directly in route objects

**Why bad:**
- **Non-deterministic query keys** — React Router v6.9+ can't prefetch
- **Serial loading** — Component code loads before data fetching starts
- **Type inference issues** — Harder to type-check route components

**Instead:** Extract lazy imports to separate file, use static references

**Example (BAD):**
```typescript
<Route
  path="financial"
  element={<Suspense><lazy(() => import('./Financial')) /></Suspense>}
/>
```

**Example (GOOD):**
```typescript
// src/components/sections/index.ts
export const Financial = lazy(() => import('../../sections/financial/Financial'));

// src/app/routes.tsx
<Route path="financial" element={<Suspense><Financial /></Suspense>} />
```

**Confidence:** MEDIUM — Based on React Router lazy loading docs ([Lazy Loading Routes](https://remix.run/blog/lazy-loading-routes), [SPA pitfalls](https://reacttraining.com/blog/spa-lazy-loading-pitfalls))

---

### Anti-Pattern 3: Prop Drilling Filter State

**What:** Passing filter state through multiple component layers as props

**Why bad:**
- **Brittle** — Refactoring breaks all intermediate components
- **Verbose** — 5+ props per component
- **Re-renders** — Intermediate components re-render on filter change
- **Hard to test** — Mock 5+ props per test

**Instead:** Use Zustand store + selectors, components subscribe directly

**Confidence:** HIGH — Zustand and React Context are designed to solve this ([Zustand architecture patterns](https://brainhub.eu/library/zustand-architecture-patterns-at-scale))

---

### Anti-Pattern 4: Separate Mock Files Per Environment

**What:** Maintaining `data.mock.ts`, `data.staging.ts`, `data.prod.ts`

**Why bad:**
- **Duplication** — Same structure repeated 3x
- **Drift** — Mock gets out of sync with real API
- **Harder testing** — Tests use different data than dev

**Instead:** Single mock data source, environment variable controls real API usage

**Confidence:** HIGH — Standard practice in API client design

---

### Anti-Pattern 5: Global CSS for Multi-Tenant Theming

**What:** Using class-based theming like `.theme-bcg { color: blue; }`

**Why bad:**
- **Specificity wars** — Hard to override styles
- **Namespace pollution** — Class name conflicts
- **Runtime overhead** — Toggling classes on every element
- **Poor DX** — Can't see theme in DevTools easily

**Instead:** Use `data-*` attributes on root + CSS variables

**Confidence:** HIGH — Modern CSS architecture best practice ([CSS custom properties guide](https://medium.com/@aimanfaruk98/multi-tenant-theming-with-nextjs-app-router-tailwind-6a5a4195ed70))

---

### Anti-Pattern 6: Over-Normalized Data Structures

**What:** Storing data like `{ companies: [...], metrics: [...], companyMetrics: [{ companyId, metricId }] }`

**Why bad:**
- **Complex joins** — Client-side joins for every render
- **Performance** — useMemo runs expensive operations
- **Hard to filter** — Can't filter arrays independently
- **Type complexity** — Relationships not explicit

**Instead:** Denormalize for UI — embed metrics in company objects

**Example (BAD):**
```typescript
{
  companies: [{ id: "voltas", name: "Voltas Ltd" }],
  metrics: [{ id: "revenue", label: "Revenue" }],
  companyMetrics: [{ companyId: "voltas", metricId: "revenue", value: 1000 }]
}
```

**Example (GOOD):**
```typescript
{
  companies: [
    {
      id: "voltas",
      name: "Voltas Ltd",
      metrics: { revenue: 1000, margin: 15.2 }
    }
  ]
}
```

**Confidence:** MEDIUM — UI data structures should optimize for rendering, not storage ([React architecture patterns](https://profy.dev/article/react-architecture-api-layer-and-data-transformations))

---

## Scalability Considerations

| Concern | At 100 Users | At 10K Users | At 1M Users |
|---------|--------------|--------------|-------------|
| **Data Size** | Mock data in bundle (5MB) | API + aggressive caching | CDN + edge caching |
| **Filter Performance** | Client-side useMemo | Client-side useMemo | Consider server-side filtering for 10K+ rows |
| **Section Loading** | Lazy loading sufficient | Route-based prefetching | Predictive prefetching |
| **State Management** | Zustand store | Zustand store | Consider splitting stores by domain |
| **Multi-Tenancy** | CSS variables | CSS variables | Consider tenant subdomains for CDN efficiency |
| **Deployment** | Single HTML file | Traditional SPA hosting | CDN with edge workers |
| **Monitoring** | Console logs | Console logs + error tracking (Sentry) | Full observability (Sentry, LogRocket) |
| **Caching** | Browser cache only | Browser + service worker | Browser + service worker + CDN edge cache |

**Progressive Enhancement Path:**

1. **Phase 1 (MVP):** Single HTML file, mock data, client-side filtering
2. **Phase 2 (Production):** API backend, error tracking, traditional SPA hosting
3. **Phase 3 (Scale):** CDN hosting, service worker caching, server-side filtering for large datasets
4. **Phase 4 (Optimize):** Edge workers, predictive prefetching, domain sharding for multi-tenant

**Confidence:** MEDIUM — Scaling strategies are application-specific, but this path aligns with general SPA scaling best practices ([Next.js SaaS best practices](https://www.ksolves.com/blog/next-js/best-practices-for-saas-dashboards))

---

## Build Order & Dependencies

### Recommended Build Sequence

**Phase 1: Foundation (Week 1-2)**

1. **Project Setup**
   - Initialize Vite + React + TypeScript
   - Configure TanStack Query, React Router, Zustand
   - Set up Tailwind CSS 4 with tokens
   - Add vite-plugin-singlefile

2. **Data Layer**
   - Define TypeScript types for all sections
   - Create mock data files (1 section minimum)
   - Implement API client with fallback logic
   - Write TanStack Query option factories

3. **Application Shell**
   - Create basic routing structure
   - Implement AppShell layout (TopBar, Sidebar, Outlet)
   - Add error boundaries and Suspense

**Why this order:** Foundation must be solid before adding features. Mock data enables parallel UI development.

---

**Phase 2: Core Features (Week 3-4)**

4. **Filter System**
   - Implement Zustand filter store
   - Create FilterBar component
   - Build URL sync hook with ref guards
   - Add `useFilteredData` custom hook

5. **First Section (MVP)**
   - Build one complete section (e.g., Executive Snapshot)
   - Implement section-specific components
   - Add loading skeletons and error handling
   - Test lazy loading

**Why this order:** Filter system is needed before sections. One complete section validates architecture before scaling.

---

**Phase 3: Section Scaling (Week 5-8)**

6. **Remaining Sections**
   - Build 2-3 sections per week
   - Reuse patterns from first section
   - Extract common components to `src/components/`
   - Write tests for utilities (formatters, matchers)

7. **Charts & Visualizations**
   - Implement chart components (bar, line, scatter)
   - Add chart defaults and theming
   - Create reusable legend, tooltip, annotation components

**Why this order:** Proven patterns accelerate development. Charts needed by multiple sections.

---

**Phase 4: Polish (Week 9-10)**

8. **Multi-Tenancy**
   - Create brand configs (3+ tenants)
   - Implement BrandProvider context
   - Add CSS variable scoping
   - Test tenant switching

9. **Export Features**
   - Build CSV export functionality
   - Add PDF export (if required)
   - Implement meeting prep brief generation

10. **Production Readiness**
    - Add dark mode support
    - Implement print styles
    - Performance optimization (lazy loading audit)
    - Error tracking integration (Sentry)

**Why this order:** Multi-tenancy and export are value-adds, not blockers. Polish happens after core features work.

---

### Dependency Graph

```
┌─────────────────────────────────────────────────────────┐
│ Phase 1: Foundation                                     │
│  ├─ Project Setup (no dependencies)                     │
│  ├─ Data Layer (depends: Project Setup)                 │
│  └─ Application Shell (depends: Project Setup)          │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 2: Core Features                                  │
│  ├─ Filter System (depends: Data Layer, App Shell)      │
│  └─ First Section (depends: Filter System, Data Layer)  │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 3: Section Scaling                                │
│  ├─ Remaining Sections (depends: First Section)         │
│  └─ Charts (depends: Data Layer, can parallelize)       │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 4: Polish                                         │
│  ├─ Multi-Tenancy (depends: App Shell)                  │
│  ├─ Export Features (depends: Sections, Charts)         │
│  └─ Production Readiness (depends: All features)        │
└─────────────────────────────────────────────────────────┘
```

### Critical Path Items

1. **TanStack Query setup** — Blocks all data fetching
2. **useFilteredData hook** — Blocks section development
3. **First section complete** — Validates architecture before scaling
4. **Mock data for all sections** — Unblocks parallel UI work

### Parallelizable Work

- Charts can be developed alongside sections 6-10
- Multi-tenancy can start after AppShell is stable
- Tests can be written continuously, not blocking features
- Export features are independent of core functionality

**Confidence:** HIGH — Build order based on dependency analysis and standard React application development practices

---

## Sources

### React SPA Architecture
- [React SPA architecture patterns 2026](https://www.patterns.dev/react/react-2026/)
- [React architecture tradeoffs (SPA, SSR, RSC)](https://reacttraining.com/blog/react-architecture-spa-ssr-rsc)
- [SPA lazy loading pitfalls](https://reacttraining.com/blog/spa-lazy-loading-pitfalls)
- [Building modern web apps with React SPAs](https://bix-tech.com/building-modern-web-apps-react-spa-guide/)

### Data Layer & State Management
- [Path to clean React architecture - API layer](https://profy.dev/article/react-architecture-api-layer-and-data-transformations)
- [TanStack Query caching guide](https://tanstack.com/query/v4/docs/framework/react/guides/caching)
- [staleTime vs cacheTime discussion](https://github.com/TanStack/query/discussions/1685)
- [Zustand architecture patterns at scale](https://brainhub.eu/library/zustand-architecture-patterns-at-scale)
- [Zustand middleware for scalable state management](https://beyondthecode.medium.com/zustand-middleware-the-architectural-core-of-scalable-state-management-d8d1053489ac)

### Component Architecture & Patterns
- [React dashboard architecture best practices 2026](https://medium.com/@katr.zaks/building-a-react-dashboard-with-zustand-custom-hooks-and-error-boundaries-c8e01c70bdc0)
- [React custom hooks complete guide 2026](https://oneuptime.com/blog/post/2026-02-02-react-custom-hooks/view)
- [Error boundaries in React production apps](https://oneuptime.com/blog/post/2026-01-15-react-error-boundaries/view)
- [React error boundary safety net](https://saraswathi-mac.medium.com/error-boundaries-in-react-the-safety-net-every-production-app-needs-f85809bd5563)

### Routing & Code Splitting
- [React Router lazy loading (React Router 7)](https://www.robinwieruch.de/react-router-lazy-loading/)
- [Code splitting with React.lazy and React Router](https://fireship.dev/react-router-code-splitting)
- [Automatic code splitting in React Router](https://reactrouter.com/explanation/code-splitting)
- [Optimizing React apps with code splitting](https://medium.com/@ignatovich.dm/optimizing-react-apps-with-code-splitting-and-lazy-loading-e8c8791006e3)

### URL State Management
- [nuqs - Type-safe search params state management](https://nuqs.dev)
- [URL state with useSearchParams in React](https://blog.logrocket.com/url-state-usesearchparams/)
- [Advanced React state management using URL parameters](https://blog.logrocket.com/advanced-react-state-management-using-url-parameters/)
- [React Router state management guide](https://reactrouter.com/explanation/state-management)

### Multi-Tenant Theming
- [Multi-tenant theming with Next.js & Tailwind](https://medium.com/@aimanfaruk98/multi-tenant-theming-with-nextjs-app-router-tailwind-6a5a4195ed70)
- [Metadata-driven UI customization for multi-tenant SaaS](https://sollybombe.medium.com/designing-metadata-driven-ui-customization-for-multi-tenant-saas-b13140221e5c)
- [Multi-tenant architecture in React JS](https://naveenda.medium.com/multi-tenant-architecture-in-react-js-daaee782020d)
- [shadcn UI complete guide 2026](https://designrevision.com/blog/shadcn-ui-guide)

### Build Tools & Distribution
- [vite-plugin-singlefile npm package](https://www.npmjs.com/package/vite-plugin-singlefile)
- [vite-plugin-singlefile GitHub repository](https://github.com/richardtallent/vite-plugin-singlefile)
- [Vite complete guide 2026](https://devtoolbox.dedyn.io/blog/vite-complete-guide)

### Source Attribution & Analytics
- [Data attribution guide 2026](https://www.redtrack.io/blog/guide-to-data-attribution/)
- [Marketing attribution GA4 complete guide](https://www.cometly.com/post/marketing-attribution-ga4)
- [Build attribution model in BigQuery](https://www.owox.com/blog/articles/build-attribution-model-bigquery)

---

**Research Date:** 2026-02-20
**Overall Confidence:** HIGH for core patterns, MEDIUM for domain-specific features (source attribution, single-file distribution)
