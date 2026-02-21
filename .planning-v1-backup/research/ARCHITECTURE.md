# Architecture Research

**Domain:** Interactive Industry Intelligence Dashboard (Multi-tenant SaaS)
**Researched:** 2026-02-15
**Confidence:** HIGH

Architecture recommendations are grounded in direct examination of the existing Kompete codebase (`/frontend/src/`), the consumer-durables-intelligence prototype (`/consumer-durables-intelligence/`), the project brief, and established React frontend architecture patterns for data-heavy dashboards. The stack is constrained (React 19 + Vite + TypeScript 5 + Tailwind CSS v4) and the backend is out of scope (Express/Supabase delivers JSON).

---

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                                │
│                                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐    │
│  │ App Shell│  │ Report Shell │  │  Section     │  │  Brand Theme  │    │
│  │ (Router) │  │ (Layout+Nav) │  │  Modules x10 │  │  (Provider)   │    │
│  └────┬─────┘  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘    │
│       │               │                 │                   │            │
├───────┴───────────────┴─────────────────┴───────────────────┴────────────┤
│                        COMPOSITION LAYER                                 │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                    │
│  │ Section      │  │ Visualization│  │ UI Primitives│                    │
│  │ Renderer     │  │ Components   │  │ (Cards, Tags,│                    │
│  │ (JSON→UI)    │  │ (Charts,     │  │  Tables,     │                    │
│  │              │  │  Tables,     │  │  Badges)     │                    │
│  │              │  │  Heatmaps)   │  │              │                    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                    │
│         │                 │                  │                            │
├─────────┴─────────────────┴──────────────────┴───────────────────────────┤
│                        DATA LAYER                                        │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                    │
│  │ API Client   │  │ Report Store │  │ Brand Config │                    │
│  │ (fetch       │  │ (Zustand     │  │ Store        │                    │
│  │  wrappers)   │  │  or Context) │  │ (Context)    │                    │
│  └──────────────┘  └──────────────┘  └──────────────┘                    │
└──────────────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │  Express/Supabase   │
                    │  Backend (JSON API) │
                    └────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **App Shell** | Routing, tenant resolution, auth gate, global error boundary | React Router v7, `<BrandProvider>` wrapper at root |
| **Report Shell** | Sidebar navigation across 10 sections, header with branding, breadcrumbs, print/export | Layout component with section-based navigation (mirrors prototype `App.navigateTo()`) |
| **Section Modules (x10)** | Each report section as a self-contained module receiving typed JSON data | One component per section: `ExecutiveSnapshot`, `MarketPulse`, `FinancialTracker`, etc. |
| **Brand Theme Provider** | Tenant-specific colors, logo, fonts, accent tokens injected via CSS custom properties | React Context providing brand config; Tailwind v4 CSS variables for theming |
| **Section Renderer** | Maps JSON data contract to section components; handles loading/error states | Generic wrapper that receives section ID + data, renders the matching module |
| **Visualization Components** | Reusable chart/table/heatmap primitives consuming typed data props | Recharts for charts (consistent with Kompete), custom SVG where needed |
| **UI Primitives** | Design system atoms: cards, badges, stat boxes, trend indicators, status tags | Tailwind-styled components; no Ant Design dependency (unlike Kompete) |
| **API Client** | Typed fetch wrapper for all backend endpoints; error handling, auth headers | Single `api.ts` module with namespaced methods (pattern proven in Kompete `services/api.js`) |
| **Report Store** | Caches fetched report data; manages active section, filter state, company selection | Zustand store (lightweight, no boilerplate); or React Context for simpler v1 |
| **Brand Config Store** | Holds tenant brand tokens resolved at app init from URL slug or API | React Context set once at mount; drives CSS custom properties |

---

## Recommended Project Structure

```
src/
├── app/                        # Application shell
│   ├── App.tsx                 # Root: router + providers
│   ├── routes.tsx              # Route definitions
│   └── error-boundary.tsx      # Global error boundary
│
├── brand/                      # Multi-tenant theming
│   ├── BrandProvider.tsx       # Context provider + CSS var injection
│   ├── brand.types.ts          # BrandConfig type definition
│   ├── brand-registry.ts       # Tenant slug → brand config map
│   └── use-brand.ts            # useBrand() hook
│
├── report/                     # Report shell + section modules
│   ├── ReportShell.tsx         # Layout: sidebar nav + content area
│   ├── ReportHeader.tsx        # Branded header with logo, title, date
│   ├── SectionNav.tsx          # Left sidebar navigation (10 sections)
│   ├── SectionRenderer.tsx     # Maps section ID → module component
│   │
│   └── sections/               # One folder per report section
│       ├── executive-snapshot/
│       │   ├── ExecutiveSnapshot.tsx
│       │   ├── executive-snapshot.types.ts
│       │   └── components/     # Section-specific sub-components
│       │       ├── MonthBullets.tsx
│       │       ├── BigThemes.tsx
│       │       └── RedFlagWatchlist.tsx
│       │
│       ├── market-pulse/
│       │   ├── MarketPulse.tsx
│       │   ├── market-pulse.types.ts
│       │   └── components/
│       │       ├── DemandSignals.tsx
│       │       ├── InputCostTrends.tsx
│       │       ├── MarginOutlook.tsx
│       │       └── ChannelMixShifts.tsx
│       │
│       ├── financial-tracker/
│       │   ├── FinancialTracker.tsx
│       │   ├── financial-tracker.types.ts
│       │   └── components/
│       │       ├── CompanyFinancialTable.tsx
│       │       ├── MetricSparkline.tsx
│       │       ├── PerformanceTag.tsx
│       │       └── VarianceAnalysis.tsx
│       │
│       ├── deals-transactions/
│       │   ├── DealsTransactions.tsx
│       │   └── ...
│       │
│       ├── operational-intelligence/
│       │   ├── OperationalIntelligence.tsx
│       │   └── ...
│       │
│       ├── leadership-watch/
│       │   ├── LeadershipWatch.tsx
│       │   └── ...
│       │
│       ├── competitive-moves/
│       │   ├── CompetitiveMoves.tsx
│       │   └── ...
│       │
│       ├── sub-sector-deep-dive/
│       │   ├── SubSectorDeepDive.tsx
│       │   └── ...
│       │
│       ├── action-lens/
│       │   ├── ActionLens.tsx
│       │   └── ...
│       │
│       └── watchlist-indicators/
│           ├── WatchlistIndicators.tsx
│           └── ...
│
├── components/                 # Shared UI primitives
│   ├── charts/                 # Recharts wrappers
│   │   ├── TrendLineChart.tsx
│   │   ├── BarComparisonChart.tsx
│   │   ├── HeatmapGrid.tsx
│   │   ├── SparklineInline.tsx
│   │   └── chart-theme.ts     # Brand-aware chart colors
│   │
│   ├── data-display/          # Data presentation primitives
│   │   ├── StatCard.tsx
│   │   ├── MetricBadge.tsx
│   │   ├── TrendIndicator.tsx
│   │   ├── PerformanceTag.tsx
│   │   ├── ConfidenceBadge.tsx
│   │   ├── CompanyAvatar.tsx
│   │   └── DataTable.tsx
│   │
│   ├── layout/                # Structural primitives
│   │   ├── SectionCard.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── GridRow.tsx
│   │   └── Divider.tsx
│   │
│   └── feedback/              # Loading, error, empty states
│       ├── SectionSkeleton.tsx
│       ├── ErrorCard.tsx
│       └── EmptyState.tsx
│
├── data/                       # Data layer
│   ├── api-client.ts           # Typed fetch wrapper
│   ├── report-api.ts           # Report-specific API methods
│   ├── use-report-data.ts      # Hook: fetches + caches report data
│   ├── use-section-data.ts     # Hook: fetches individual section
│   └── types/                  # JSON data contract types
│       ├── report.types.ts     # Top-level report shape
│       ├── company.types.ts    # Company entity
│       ├── financial.types.ts  # Financial metrics
│       ├── deal.types.ts       # Deal/transaction
│       ├── leadership.types.ts # Leadership event
│       └── signal.types.ts     # Watchlist/forward indicator
│
├── filters/                    # Company + metric filtering
│   ├── FilterBar.tsx           # Top-level filter controls
│   ├── CompanySelector.tsx     # Multi-select company dropdown
│   ├── SubCategoryFilter.tsx   # White Goods / Consumer Electronics
│   ├── PerformanceFilter.tsx   # Outperform / Inline / Underperform
│   ├── filter-store.ts         # Zustand store for filter state
│   └── use-filtered-data.ts    # Hook: applies filters to report data
│
├── export/                     # Print / PDF / Excel export
│   ├── PrintableReport.tsx     # Print-optimized layout
│   ├── use-print.ts            # react-to-print hook wrapper
│   └── export-utils.ts         # Excel/CSV helpers
│
└── lib/                        # Utilities
    ├── format.ts               # Number formatting (INR, %, delta)
    ├── color.ts                # Conditional coloring (red/amber/green)
    ├── date.ts                 # Quarter/period formatting
    └── cn.ts                   # Tailwind class merge utility
```

### Structure Rationale

- **`report/sections/`:** Each of the 10 report sections is a self-contained folder with its own types and sub-components. This enforces module boundaries -- a section's internal components are never imported by other sections. This is the single most important organizational decision. The prototype (`app.js`) already uses this pattern conceptually with `renderExecutiveSection()`, `renderFinancialTable()`, etc.

- **`components/`:** Shared primitives used across multiple sections. These are the building blocks. A `StatCard` appears in Executive Snapshot, Financial Tracker, and Market Pulse -- so it lives here, not inside any section. Mirrors Kompete's `StatBox.jsx` pattern but expanded.

- **`brand/`:** Isolated from everything else. The `BrandProvider` sets CSS custom properties at the root; all other components consume them via Tailwind classes. No component ever imports brand config directly -- they use CSS variables or the `useBrand()` hook.

- **`data/`:** Clean separation between API communication and UI. The `types/` subfolder defines the JSON data contracts. These types are the contract between frontend and backend -- they get defined early and rarely change.

- **`filters/`:** Separate from sections because filters affect multiple sections simultaneously. The filter store is global; sections subscribe to filtered data via hooks. This mirrors the prototype's `Filters` module.

---

## Architectural Patterns

### Pattern 1: BrandProvider with CSS Custom Properties

**What:** A React Context provider that resolves the current tenant (from URL slug, subdomain, or API) and injects brand tokens as CSS custom properties on the root element. All components consume brand values through Tailwind classes or CSS variables -- never through direct prop drilling.

**When to use:** At app initialization. Every render after that automatically uses the correct brand.

**Trade-offs:** Elegant and performant (CSS variables cascade natively). Limitation: cannot do conditional logic based on brand identity inside components (but you should not need to -- brand differences should be purely visual).

**Example:**
```typescript
// brand/brand.types.ts
interface BrandConfig {
  slug: string;
  name: string;           // "Alvarez & Marsal"
  logoUrl: string;
  colors: {
    primary: string;      // "#1E3A8A"
    primaryLight: string;  // "#3B82F6"
    accent: string;       // "#0D9488"
    surface: string;      // "#0F1F3D"
    surfaceAlt: string;   // "#1A2744"
    text: string;         // "#F1F5F9"
    textMuted: string;    // "#94A3B8"
    positive: string;     // "#22C55E"
    negative: string;     // "#EF4444"
    warning: string;      // "#F59E0B"
  };
  fonts: {
    heading: string;      // "'Inter', system-ui, sans-serif"
    body: string;         // "'Inter', system-ui, sans-serif"
    mono: string;         // "'IBM Plex Mono', monospace"
  };
  reportTitle: string;    // "Consumer Durables Intelligence"
}

// brand/BrandProvider.tsx
function BrandProvider({ children }: { children: React.ReactNode }) {
  const tenantSlug = useTenantSlug(); // from URL or subdomain
  const brand = BRAND_REGISTRY[tenantSlug] ?? DEFAULT_BRAND;

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(brand.colors).forEach(([key, value]) => {
      root.style.setProperty(`--brand-${kebabCase(key)}`, value);
    });
    root.style.setProperty('--font-heading', brand.fonts.heading);
    root.style.setProperty('--font-body', brand.fonts.body);
    root.style.setProperty('--font-mono', brand.fonts.mono);
  }, [brand]);

  return (
    <BrandContext.Provider value={brand}>
      {children}
    </BrandContext.Provider>
  );
}
```

```css
/* In Tailwind v4 CSS (using @theme) */
@theme {
  --color-brand-primary: var(--brand-primary);
  --color-brand-accent: var(--brand-accent);
  --color-brand-surface: var(--brand-surface);
  --color-brand-positive: var(--brand-positive);
  --color-brand-negative: var(--brand-negative);
  --font-heading: var(--font-heading);
  --font-mono: var(--font-mono);
}
```

### Pattern 2: Section Module Pattern (JSON-Driven Rendering)

**What:** Each report section is a self-contained module that receives a typed data prop matching its JSON contract and renders itself. The parent `SectionRenderer` is responsible for fetching data and passing it down. Sections never fetch their own data.

**When to use:** For every one of the 10 report sections.

**Trade-offs:** Sections are trivially testable (pass mock data, assert output). They are also trivially reorderable -- the report shell just changes which section IDs to render. The cost is that data must be pre-shaped by the backend to match each section's contract. This is the right trade-off for a frontend-only product with a separate backend team.

**Example:**
```typescript
// report/SectionRenderer.tsx
const SECTION_COMPONENTS: Record<SectionId, React.LazyExoticComponent<any>> = {
  'executive-snapshot': lazy(() => import('./sections/executive-snapshot/ExecutiveSnapshot')),
  'market-pulse': lazy(() => import('./sections/market-pulse/MarketPulse')),
  'financial-tracker': lazy(() => import('./sections/financial-tracker/FinancialTracker')),
  'deals-transactions': lazy(() => import('./sections/deals-transactions/DealsTransactions')),
  'operational-intelligence': lazy(() => import('./sections/operational-intelligence/OperationalIntelligence')),
  'leadership-watch': lazy(() => import('./sections/leadership-watch/LeadershipWatch')),
  'competitive-moves': lazy(() => import('./sections/competitive-moves/CompetitiveMoves')),
  'sub-sector-deep-dive': lazy(() => import('./sections/sub-sector-deep-dive/SubSectorDeepDive')),
  'action-lens': lazy(() => import('./sections/action-lens/ActionLens')),
  'watchlist-indicators': lazy(() => import('./sections/watchlist-indicators/WatchlistIndicators')),
};

function SectionRenderer({ sectionId }: { sectionId: SectionId }) {
  const { data, isLoading, error } = useSectionData(sectionId);
  const SectionComponent = SECTION_COMPONENTS[sectionId];

  if (isLoading) return <SectionSkeleton />;
  if (error) return <ErrorCard message={error.message} />;
  if (!data) return <EmptyState />;

  return (
    <Suspense fallback={<SectionSkeleton />}>
      <SectionComponent data={data} />
    </Suspense>
  );
}
```

### Pattern 3: Typed Data Contracts as the Source of Truth

**What:** TypeScript interfaces define the exact shape of JSON the backend must deliver for each section. These types are defined once in `data/types/` and imported by both the API layer and the section components. The backend team gets a copy of these types as their API contract.

**When to use:** From day one. Define the types before building UI. This is the handshake between frontend and backend.

**Trade-offs:** Requires discipline to keep types and backend in sync. Worth it because it catches contract violations at compile time rather than runtime. For a monthly cadence product, data shape stability is high.

**Example:**
```typescript
// data/types/financial.types.ts
interface CompanyFinancials {
  companyId: string;
  companyName: string;
  ticker: string;
  subCategory: 'White Goods' | 'Consumer Electronics';
  quarters: string[];     // ["Q1 2024", "Q2 2024", ...]
  metrics: {
    revenue: number[];          // ₹ Cr per quarter
    ebitdaMargin: number[];     // % per quarter
    patMargin: number[];        // % per quarter
    workingCapDays: number[];   // days per quarter
    inventoryDays: number[];    // days per quarter
    netDebtEbitda: number[];    // ratio per quarter
    capexIntensity: number[];   // % per quarter
    roce: number[];             // % per quarter
  };
  performanceRating: 'outperform' | 'inline' | 'underperform';
  aiVarianceAnalysis: string;   // 2-3 line AI-generated explanation
}

interface FinancialTrackerData {
  reportPeriod: string;       // "January 2026"
  companies: CompanyFinancials[];
  sectorAverages: Record<keyof CompanyFinancials['metrics'], number>;
}
```

### Pattern 4: Filter-Store Pattern (Cross-Section Filtering)

**What:** A global Zustand store holds filter state (selected companies, sub-category, performance rating, time period). Sections subscribe to filtered data via a `useFilteredData()` hook that applies the current filters to the raw report data. Filter changes re-render affected sections without re-fetching data.

**When to use:** For sections that display company-level data (Financial Tracker, Operational Intelligence, Competitive Moves, etc.). Executive Snapshot and Action Lens are less affected by company filters.

**Trade-offs:** Global filter state means any section can react to filter changes. The prototype already uses this pattern (`Filters.applyFilters()` re-renders tables and charts). The React version is cleaner because Zustand selectors only re-render components that use the changed slice.

**Example:**
```typescript
// filters/filter-store.ts
import { create } from 'zustand';

interface FilterState {
  selectedCompanyIds: Set<string>;
  subCategory: 'all' | 'White Goods' | 'Consumer Electronics';
  performance: 'all' | 'outperform' | 'inline' | 'underperform';
  timePeriod: 'latest' | 'trailing-4q' | 'trailing-8q' | 'all';
  // Actions
  toggleCompany: (id: string) => void;
  selectAllCompanies: (ids: string[]) => void;
  setSubCategory: (cat: FilterState['subCategory']) => void;
  setPerformance: (perf: FilterState['performance']) => void;
  setTimePeriod: (period: FilterState['timePeriod']) => void;
  resetFilters: (allCompanyIds: string[]) => void;
}
```

### Pattern 5: Composable Chart Wrappers (Brand-Aware)

**What:** Thin wrapper components around Recharts that automatically consume brand colors from CSS custom properties and apply consistent styling (font, grid lines, tooltip format). Each wrapper handles a specific chart type: `TrendLineChart`, `BarComparisonChart`, `HeatmapGrid`.

**When to use:** Every time a chart appears in any section. Never use raw Recharts components directly in section code.

**Trade-offs:** Small overhead per chart type, but massive consistency gain. When a brand changes its accent color, every chart updates automatically. The prototype uses Chart.js; switching to Recharts aligns with Kompete and gives a React-native API.

**Example:**
```typescript
// components/charts/TrendLineChart.tsx
interface TrendLineChartProps {
  data: Array<Record<string, number | string>>;
  xKey: string;
  lines: Array<{
    dataKey: string;
    label: string;
    color?: string;       // Override brand color if needed
    strokeWidth?: number;
  }>;
  yFormatter?: (value: number) => string;  // e.g., v => `${v}%`
  height?: number;
}

function TrendLineChart({ data, xKey, lines, yFormatter, height = 300 }: TrendLineChartProps) {
  const brand = useBrand();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-surface-alt)" />
        <XAxis dataKey={xKey} style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
        <YAxis tickFormatter={yFormatter} style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-primary)' }}
          formatter={yFormatter ? (v: number) => yFormatter(v) : undefined}
        />
        {lines.map((line, i) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.label}
            stroke={line.color ?? CHART_PALETTE[i]}
            strokeWidth={line.strokeWidth ?? 2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## Data Flow

### Primary Data Flow: Report Load

```
1. User navigates to /:tenantSlug/report/:reportId
                    │
2. App resolves tenant → BrandProvider sets CSS vars
                    │
3. ReportShell mounts → fetches report metadata
                    │
4. SectionNav renders → user sees sidebar with 10 sections
                    │
5. SectionRenderer (active section) →
       useSectionData(sectionId) →
           api-client.ts → GET /api/reports/:id/sections/:sectionId →
               Backend returns JSON →
                   Data cached in store →
                       Section component renders
                    │
6. User clicks different section → step 5 repeats
   (previously loaded sections are cached, instant render)
```

### Filter Data Flow

```
User interacts with FilterBar
        │
        ▼
filter-store.ts (Zustand) updates filter state
        │
        ▼
Sections subscribed via useFilteredData()
re-render with filtered subset
        │
        ▼
Charts + Tables update (no API call — client-side filtering)
```

### Brand Resolution Flow

```
URL: https://app.kompete.com/am/report/jan-2026
                    │
                    ▼
Route param :tenantSlug = "am"
                    │
                    ▼
brand-registry.ts → BrandConfig for "Alvarez & Marsal"
                    │
                    ▼
BrandProvider → sets CSS custom properties:
  --brand-primary: #1E3A8A
  --brand-accent: #0D9488
  --brand-surface: #0F1F3D
  ...
                    │
                    ▼
All components render with A&M branding
(no conditional logic in components)
```

### Key Data Flows

1. **Report Load:** User hits URL -> tenant resolution -> brand injection -> report metadata fetch -> section lazy-load on navigation. Each section fetches its own data slice on first view, then caches. This is section-level code splitting.

2. **Cross-Section Filtering:** User selects/deselects companies in FilterBar -> Zustand store updates -> all visible sections re-render with filtered company list. Data is not re-fetched; filtering is client-side against cached data.

3. **Print/Export:** User clicks Print -> `PrintableReport.tsx` renders all 10 sections sequentially (not lazy-loaded) with print-optimized styles. `react-to-print` handles the browser print dialog. This matches the Kompete pattern (`useReactToPrint`).

4. **Section Internal Drill-Down:** Some sections have expandable company cards or toggleable metrics. This state is local to the section component (useState), never stored globally. If the user navigates away and back, the section resets to default view but data is still cached.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 1-5 tenants (current) | Static `brand-registry.ts` with hardcoded configs. Manual deployment per tenant. All report data in a single JSON payload per section. |
| 5-50 tenants | Brand config moves to Supabase table, fetched at runtime. Tenant resolution via subdomain (`am.kompete.com`). Consider separate Vercel deployments per tenant or a single deployment with tenant routing. |
| 50+ tenants | Brand config API with caching. Section data endpoints paginated. Consider ISR (Incremental Static Regeneration) for monthly reports that rarely change. Reports could be pre-rendered as static HTML per tenant per month. |

### Scaling Priorities

1. **First bottleneck: Initial load time.** 10 section modules is a lot of JavaScript. Code splitting via `React.lazy()` is essential from day one. Only the active section should be loaded.

2. **Second bottleneck: Financial Tracker rendering.** 15-20 companies x 7 metrics x 13 quarters = ~1,800 data cells. This is manageable but must use virtualized tables if the company universe grows beyond 30. For v1 with 15-20 companies, standard table rendering is fine.

3. **Third bottleneck: Chart re-renders on filter change.** Recharts re-renders the full chart on any data change. For sparklines in tables (15-20 rows x 3-4 sparklines), this is a lot of SVG work. Memoize chart components aggressively with `React.memo()` and ensure filter changes only touch affected components.

---

## Anti-Patterns

### Anti-Pattern 1: Fat Report Component

**What people do:** Put all 10 sections in a single `Report.tsx` component with conditional rendering (`{activeSection === 'market-pulse' && <MarketPulse />}`). This is what Kompete's `Report.jsx` does with its Tabs approach.
**Why it's wrong:** All section code loads upfront. No code splitting. For Kompete with 3 tabs this was fine. For 10 sections with heavy chart libraries, this kills initial load.
**Do this instead:** Use `React.lazy()` + `Suspense` via the `SectionRenderer` pattern. Each section is a separate chunk loaded on demand.

### Anti-Pattern 2: Prop Drilling Brand Config

**What people do:** Pass `brandConfig` as a prop through every component: `<ReportShell brand={brand}>` -> `<SectionNav brand={brand}>` -> `<StatCard brand={brand}>`.
**Why it's wrong:** Every component re-renders when brand changes (rare), and the API surface of every component grows unnecessarily.
**Do this instead:** CSS custom properties set once at root. Components use `bg-brand-primary`, `text-brand-accent` Tailwind classes. Zero prop drilling.

### Anti-Pattern 3: Global Data Fetch

**What people do:** Fetch all report data (all 10 sections) in a single massive API call at mount time.
**Why it's wrong:** Slow initial load. User may only view 2-3 sections per session. Wastes bandwidth and backend processing.
**Do this instead:** Fetch section data on demand when the user navigates to that section. Cache it so subsequent visits are instant. This matches the lazy-loading pattern.

### Anti-Pattern 4: Direct Ant Design Import

**What people do:** Import `antd` components (Table, Card, Tag, etc.) because Kompete uses them. Ant Design is 200KB+ gzipped.
**Why it's wrong:** This project uses Tailwind CSS v4 as its design system. Ant Design's CSS-in-JS conflicts with Tailwind's utility-first approach. The prototype already uses vanilla HTML/CSS for everything.
**Do this instead:** Build lightweight Tailwind-styled primitives (`StatCard`, `DataTable`, `PerformanceTag`). These will be smaller, faster, and fully brand-themed. Invest the upfront time in a small component library.

### Anti-Pattern 5: Section Components Fetching Their Own Data

**What people do:** Each section has `useEffect` with fetch calls inside it.
**Why it's wrong:** Scattered data logic, hard to cache, hard to test, impossible to prefetch adjacent sections.
**Do this instead:** Centralize data fetching in `useSectionData()` hook or `SectionRenderer`. Sections receive data as props. Sections are pure rendering functions.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Express/Supabase Backend | REST API via `api-client.ts` | All data arrives as JSON. Frontend never talks to Supabase directly. Backend shapes data to match frontend type contracts. |
| Recharts | React component library | Import chart components in `components/charts/` wrappers only. Never use raw Recharts in section code. |
| react-to-print | Print/export | Used in `export/use-print.ts`. Wraps the full report for print layout. Proven pattern from Kompete. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Brand -> Everything | CSS custom properties | One-way. Brand sets vars, everything reads them. No imports of brand module from section code. |
| Report Shell -> Section Modules | Props (data) via SectionRenderer | One-way. Shell passes data down. Sections never call up to shell. |
| Filter Store -> Sections | Zustand subscription via hooks | Reactive. Filter changes propagate to subscribed sections automatically. |
| Section -> Shared Components | Direct import | Sections import from `components/` but never from other sections. |
| API Client -> Store | Function calls | API client returns typed data. Store caches it. Components read from store via hooks. |

---

## Build Order (Dependency Chain)

The following build order respects component dependencies. Each phase can be built and visually tested before the next begins.

```
Phase 1: Foundation
├── lib/              (utilities: format, color, cn)
├── data/types/       (JSON contract types)
├── brand/            (BrandProvider + registry)
└── app/              (App shell, router, error boundary)

Phase 2: UI Primitives
├── components/layout/     (SectionCard, GridRow, etc.)
├── components/data-display/  (StatCard, TrendIndicator, etc.)
├── components/feedback/   (Skeleton, ErrorCard)
└── components/charts/     (TrendLineChart, BarComparisonChart)

Phase 3: Data Layer
├── data/api-client.ts
├── data/report-api.ts
├── data/use-report-data.ts
├── data/use-section-data.ts
└── filters/filter-store.ts

Phase 4: Report Shell
├── report/ReportShell.tsx
├── report/ReportHeader.tsx
├── report/SectionNav.tsx
├── report/SectionRenderer.tsx
└── filters/FilterBar.tsx

Phase 5: Section Modules (can be built in parallel)
├── sections/executive-snapshot/
├── sections/market-pulse/
├── sections/financial-tracker/     (most complex — build first)
├── sections/deals-transactions/
├── sections/operational-intelligence/
├── sections/leadership-watch/
├── sections/competitive-moves/
├── sections/sub-sector-deep-dive/
├── sections/action-lens/
├── sections/watchlist-indicators/

Phase 6: Polish
├── export/PrintableReport.tsx
├── Responsive refinements
└── Performance optimization (memoization, bundle analysis)
```

**Why this order:**
- Foundation and types must come first because everything depends on them.
- UI primitives before sections because sections compose from primitives.
- Data layer before report shell because the shell orchestrates data fetching.
- Report shell before sections because it provides the container sections render within.
- Sections can be built in parallel once the shell exists. Financial Tracker should be built first because it is the most complex and will stress-test the chart wrappers and data table primitives.
- Export/polish is last because it requires all sections to exist.

---

## Sources

- Direct code examination: Kompete frontend (`/frontend/src/`) -- App.jsx, Report.jsx, MarketOverview.jsx, ComparisonMatrix.jsx, QuarterlyTrendChart.jsx, StatBox.jsx, api.js (HIGH confidence -- first-party codebase)
- Direct code examination: Consumer Durables Intelligence prototype (`/consumer-durables-intelligence/`) -- app.js, data.js, charts.js, filters.js (HIGH confidence -- first-party prototype with validated data shapes)
- Direct code examination: API integration plan (`/consumer-durables-intelligence/docs/api-integration-plan.md`) (HIGH confidence -- first-party architecture document)
- React lazy/Suspense patterns: React 19 official documentation (HIGH confidence -- well-established API)
- Zustand state management: Training data knowledge of Zustand API (MEDIUM confidence -- well-known library but version not verified against latest docs)
- Tailwind CSS v4 @theme directive: Training data knowledge (MEDIUM confidence -- v4 was released during training window but specific CSS variable integration syntax should be verified against current docs)
- Recharts component API: Training data knowledge (MEDIUM confidence -- stable library, patterns unlikely to have changed)

---
*Architecture research for: Kompete - Industry Intel Dashboard*
*Researched: 2026-02-15*
