# Phase 5: Market Context and Operations - Research

**Researched:** 2026-02-16
**Domain:** Dashboard data visualization (macro market signals, operational intelligence cards, Recharts multi-line/stacked bar, CSS gauge patterns)
**Confidence:** HIGH

## Summary

Phase 5 builds two distinct section modules on top of the Phase 2 infrastructure: **Market Pulse** (sector-wide macro context) and **Operational Intelligence** (per-company micro signals). The macro view requires four sub-sections -- demand signals, input cost trends, margin outlook, and channel mix -- rendered as a dashboard grid with StatCards, TrendLineChart, and BarComparisonChart. The micro view requires four sub-sections -- supply chain, manufacturing capacity, procurement shifts, and retail footprint -- rendered as filterable, company-grouped signal cards.

Both modules already have placeholder components (`MarketPulse.tsx`, `OperationalIntelligence.tsx`) wired into the `useFilteredData` hook from Phase 2, typed data contracts in `sections.ts`, and mock data fixtures in `market-pulse.ts` and `operations.ts`. The existing chart components (`TrendLineChart`, `BarComparisonChart`) support multi-line overlays and stacked bars out of the box. The mock data shapes match the TypeScript contracts exactly. The primary work is replacing placeholder UI with rich dashboard layouts using the established design system.

**Primary recommendation:** Use a CSS Grid dashboard layout for Market Pulse (2-column for charts, 4-column for StatCards), grouped Radix Accordion for Operational Intelligence company sections, and keep all visualizations within the existing Recharts + Tailwind CSS design system -- no new dependencies needed.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Demand signals with TrendIndicator showing direction
- Input cost trends (steel, copper, plastics) with QoQ/YoY movement -- use TrendLineChart
- Margin outlook with visual trend indicators
- Channel mix shifts (offline vs online vs D2C) with percentage breakdown -- use BarComparisonChart
- Sector-wide view, not per-company (macro context)
- Supply chain signals (sourcing shifts, logistics disruptions) as signal cards
- Manufacturing capacity changes with expansion/closure/utilization data
- Procurement shifts (vendor changes, import/export patterns)
- Retail expansion/rationalization data (store openings, closures, channel shifts)
- Per-company data, filterable via useFilteredData from Phase 2
- Compact card-based layout with company grouping

### Claude's Discretion
- Market Pulse section layout (dashboard grid vs. stacked sections)
- Input cost chart configuration (multi-line overlay vs. separate charts)
- Channel mix visualization style (stacked bar vs. donut vs. horizontal bar)
- Operational signal card design and grouping strategy
- Manufacturing capacity visualization (table vs. cards vs. timeline)

### Deferred Ideas (OUT OF SCOPE)
None
</user_constraints>

## Standard Stack

### Core (Already Installed -- No New Dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| recharts | ^3.7.0 | TrendLineChart (multi-line input costs), BarComparisonChart (stacked channel mix) | Already installed; chart wrappers built in Phase 1 |
| radix-ui | ^1.4.3 | Accordion/Collapsible for company grouping in Operational Intelligence | Unified package already installed; tree-shakeable, includes Accordion primitive |
| clsx | ^2.1.1 | Conditional CSS class composition | Already used across all UI components |
| tailwindcss | ^4.1.18 | CSS Grid layout, spacing, colors from design tokens | Already configured with design tokens in `tokens.css` |

### Supporting (Already Available)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tanstack/react-query | ^5.90.21 | Data fetching/caching via `useFilteredData` | Both sections already wired to query pipeline |
| zustand | ^5.0.11 | Filter state via `useFilterStore` | Company/time-period filtering for Operational Intelligence |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Radix Accordion | Manual toggle state | Radix handles accessibility (keyboard nav, ARIA) for free; no reason to hand-roll |
| CSS conic-gradient gauge | react-gauge-component library | CSS gauge is ~10 lines, avoids new dependency; no interactivity needed for static utilization display |
| Recharts stacked bar | Recharts horizontal bar | Vertical stacked bar is more natural for comparing channel shares across periods; existing BarComparisonChart supports `stacked` prop |

**Installation:**
```bash
# No new packages needed -- all dependencies are already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── sections/
│   ├── market-pulse/
│   │   ├── MarketPulse.tsx              # Main section component (replace placeholder)
│   │   ├── DemandSignals.tsx            # Demand signals sub-section
│   │   ├── InputCostTrends.tsx          # Multi-line TrendLineChart for commodities
│   │   ├── MarginOutlook.tsx            # Margin narrative with TrendIndicators
│   │   └── ChannelMix.tsx              # BarComparisonChart stacked + data table
│   ├── operations/
│   │   ├── OperationalIntelligence.tsx  # Main section component (replace placeholder)
│   │   ├── SupplyChainSignals.tsx       # Signal cards grouped by company
│   │   ├── ManufacturingCapacity.tsx    # Capacity cards with status badges
│   │   ├── ProcurementShifts.tsx        # Procurement signal cards
│   │   └── RetailFootprint.tsx         # Retail expansion/rationalization cards
├── components/
│   ├── ui/
│   │   ├── SignalCard.tsx              # NEW: Reusable operational signal card
│   │   ├── ImpactBadge.tsx            # NEW: positive/negative/neutral impact indicator
│   │   └── CapacityBadge.tsx          # NEW: expansion/rationalization/greenfield badge
│   ├── charts/
│   │   └── ChartLegend.tsx            # NEW: Custom Recharts legend component
```

### Pattern 1: Dashboard Grid Layout for Market Pulse

**What:** CSS Grid with responsive columns for the macro dashboard view.
**When to use:** When displaying multiple chart/card widgets that need to fill available space evenly.

**Recommendation:** Use a 2-column grid for chart panels (Input Costs + Channel Mix) and a 4-column grid row for StatCards (demand signals summary). This creates a Bloomberg-terminal-style dense information display that matches the existing design system's high-density philosophy.

```typescript
// Market Pulse layout structure
<div className="p-md space-y-md">
  {/* Header row */}
  <div className="flex items-center justify-between">
    <h2 className="text-sm font-semibold font-display text-text-primary">Market Pulse</h2>
    <DataRecencyTag dataAsOf={data.dataAsOf} />
  </div>

  {/* Demand Signals row: 4-column StatCard grid */}
  <div className="grid grid-cols-4 gap-md">
    {data.demandSignals.map((signal) => (
      <StatCard
        key={signal.channel}
        label={signal.channel}
        value={signal.magnitude}
        trend={{ direction: signal.direction, label: signal.signal }}
      />
    ))}
  </div>

  {/* Charts row: 2-column grid */}
  <div className="grid grid-cols-2 gap-md">
    <InputCostTrends costs={data.inputCosts} />
    <ChannelMix channels={data.channelMix} />
  </div>

  {/* Margin Outlook: full-width narrative */}
  <MarginOutlook outlook={data.marginOutlook} />
</div>
```

### Pattern 2: Multi-Line TrendLineChart for Input Costs

**What:** Overlay multiple commodity price lines on a single TrendLineChart with a custom legend.
**When to use:** Comparing trends of 3-5 related metrics over the same time axis.

The existing `TrendLineChart` component already supports multi-line via the `lines: LineConfig[]` prop. Each line gets a `dataKey`, `colorVar` (CSS custom property), and `label`. The data must be reshaped from the per-commodity array format into a single array of time-period objects.

```typescript
// Transform inputCosts data for TrendLineChart
// Mock data has per-commodity records; chart needs per-period records with commodity columns
const inputCostChartData = [
  { period: "Q1 FY25", steel: 100, copper: 100, plastics: 100, aluminium: 100 },
  { period: "Q2 FY25", steel: 103, copper: 105, plastics: 98,  aluminium: 104 },
  { period: "Q3 FY25", steel: 108, copper: 113, plastics: 97,  aluminium: 110 },
];

const inputCostLines: LineConfig[] = [
  { dataKey: "steel",     colorVar: "--color-chart-1", label: "Steel (HR Coil)" },
  { dataKey: "copper",    colorVar: "--color-chart-2", label: "Copper (LME)" },
  { dataKey: "plastics",  colorVar: "--color-chart-3", label: "Plastics (ABS)" },
  { dataKey: "aluminium", colorVar: "--color-chart-4", label: "Aluminium (LME)" },
];

<TrendLineChart data={inputCostChartData} lines={inputCostLines} xDataKey="period" />
```

**Key insight:** The mock data structure (`inputCosts` array) stores QoQ/YoY percentage changes per commodity, not historical time-series. To populate a multi-line chart, the mock data needs to be extended with a `historicalData` array or the chart should show the current QoQ/YoY changes as a grouped bar comparison rather than a time series. The recommendation is to **add a `historicalIndex` field** to the mock data that provides 4-6 quarters of indexed values (base 100) for each commodity, enabling a proper multi-line trend chart.

### Pattern 3: Stacked Bar Chart for Channel Mix

**What:** Use the existing `BarComparisonChart` with `stacked={true}` to show channel share breakdown.
**When to use:** Comparing composition (parts of a whole) across two periods.

```typescript
// Transform channelMix data for BarComparisonChart
const channelMixData = data.channelMix.map((ch) => ({
  channel: ch.channel,
  current: ch.currentSharePct,
  previous: ch.previousSharePct,
}));

const channelMixBars: BarConfig[] = [
  { dataKey: "previous", colorVar: "--color-chart-5", label: "Previous Period" },
  { dataKey: "current",  colorVar: "--color-chart-1", label: "Current Period" },
];

// NOT stacked -- side-by-side comparison is clearer for channel mix shift
<BarComparisonChart data={channelMixData} bars={channelMixBars} xDataKey="channel" />
```

**Recommendation:** Use **side-by-side bars** (not stacked) for channel mix. The data shows current vs previous share percentages per channel. Side-by-side makes the shift magnitude visually obvious. Stacked would obscure which channel grew or shrank. The `stacked` prop should be `false` (default).

### Pattern 4: Company-Grouped Signal Cards for Operational Intelligence

**What:** Group operational signals by company using Radix Accordion, with signal cards inside each group.
**When to use:** Per-company data that users want to scan quickly and drill into.

```typescript
import { Accordion } from "radix-ui";

// Group signals by company
const companiesWithSignals = groupSignalsByCompany(data);

<Accordion.Root type="multiple" defaultValue={companiesWithSignals.map(c => c.id)}>
  {companiesWithSignals.map((company) => (
    <Accordion.Item key={company.id} value={company.id}>
      <Accordion.Header>
        <Accordion.Trigger className="flex items-center justify-between w-full p-md text-sm font-medium text-text-primary">
          <span>{company.name}</span>
          <span className="text-xs text-text-muted">{company.signalCount} signals</span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>
        <div className="space-y-sm px-md pb-md">
          {company.signals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  ))}
</Accordion.Root>
```

### Pattern 5: Signal Card Component

**What:** A compact card displaying an operational signal with impact indicator, company context, and detail text.
**When to use:** Supply chain signals, procurement shifts, retail footprint changes.

```typescript
interface SignalCardProps {
  title: string;
  detail: string;
  impact: "positive" | "negative" | "neutral";
  metadata?: string; // e.g., "INR 450 Cr investment" or "85 stores"
}

function SignalCard({ title, detail, impact, metadata }: SignalCardProps) {
  const impactColors = {
    positive: "border-l-positive bg-positive/5",
    negative: "border-l-negative bg-negative/5",
    neutral:  "border-l-neutral bg-neutral/5",
  };

  return (
    <div className={clsx(
      "border-l-2 rounded p-md space-y-xs",
      impactColors[impact],
    )}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <ImpactBadge impact={impact} />
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{detail}</p>
      {metadata && (
        <p className="text-xs text-text-muted font-mono">{metadata}</p>
      )}
    </div>
  );
}
```

### Pattern 6: Manufacturing Capacity Card

**What:** A specialized card for capacity changes showing facility, action type badge, investment amount, and timeline.
**When to use:** `manufacturingCapacity` array items.

```typescript
const actionConfig = {
  expansion:       { label: "Expansion",       className: "bg-positive/10 text-positive" },
  greenfield:      { label: "Greenfield",      className: "bg-chart-1/10 text-chart-1" },
  rationalization: { label: "Rationalization",  className: "bg-negative/10 text-negative" },
  maintenance:     { label: "Maintenance",      className: "bg-neutral/10 text-neutral" },
};

function CapacityCard({ item }: { item: ManufacturingCapacityItem }) {
  const config = actionConfig[item.action];
  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-md space-y-xs">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-primary">{item.facility}</p>
        <span className={clsx("text-xs px-sm py-xs rounded font-medium", config.className)}>
          {config.label}
        </span>
      </div>
      <p className="text-xs text-text-secondary">{item.company}</p>
      <div className="flex gap-md text-xs text-text-muted">
        {item.investmentCr && (
          <span className="font-mono">{formatINRCr(item.investmentCr)}</span>
        )}
        <span>{item.timeline}</span>
      </div>
    </div>
  );
}
```

**Recommendation for capacity visualization:** Use **card layout** (not table, not timeline). Cards align with the "compact card-based layout" decision from CONTEXT.md, show the key fields (facility, action badge, investment, timeline) at a glance, and group naturally under company accordion headers. A table would be denser but loses the visual impact of action-type color coding.

### Anti-Patterns to Avoid

- **Separate API calls per sub-section:** Both Market Pulse and Operational Intelligence fetch a single payload via `useFilteredData`. Do NOT create separate queries for demand signals, input costs, etc. -- they all come from one `market-pulse` or `operations` query.

- **Filtering macro data by company:** Market Pulse is sector-wide (locked decision). The company filter should NOT affect Market Pulse data. The `useFilteredData` hook filters arrays with `company` fields; since Market Pulse arrays use `channel`/`commodity` keys (not `company`), filtering naturally passes through. But verify this assumption in tests.

- **Over-engineering the legend:** Recharts `Legend` is sufficient. Do not build a custom interactive legend with toggle-visibility unless needed. The default legend with `content` render prop for styling is enough.

- **Creating new chart components:** Do NOT create new chart wrappers. Use `TrendLineChart` and `BarComparisonChart` from Phase 1 with their existing props. If a chart need cannot be met, extend the existing component -- do not create a parallel implementation.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accordion keyboard navigation | Custom toggle with state management | Radix `Accordion` primitive | Handles ARIA roles, keyboard nav (ArrowUp/Down/Home/End), focus management |
| Chart tooltip formatting | Custom hover listener + positioned div | Recharts `ChartTooltip` (existing) | Already built with brand tokens, Indian number formatting |
| Data freshness display | Custom date formatter | `DataRecencyTag` component (existing) | Already built, consistent across all sections |
| Trend direction arrows | Custom SVG icons | `TrendIndicator` component (existing) | Handles up/down/flat with semantic colors, accessible labels |
| Impact sentiment colors | Inline color logic | Centralized `impactColors` config object | Prevents color inconsistency across 4 sub-sections |
| Company-to-ID resolution | String matching in components | `getCompanyById()` from `companies.ts` | Canonical company lookup used by `useFilteredData` |
| Number formatting (INR) | Template literals with toFixed | `formatINRCr`, `formatINRAuto`, `formatPercent` from `formatters.ts` | Handles Indian grouping (##,##,###), magnitude detection, sign display |

**Key insight:** Phase 5 should create zero new utility functions. All formatting, theming, data fetching, and filtering infrastructure exists from Phases 1-2. The work is purely compositional -- assembling existing primitives into section-specific layouts.

## Common Pitfalls

### Pitfall 1: Market Pulse Data Does Not Filter by Company
**What goes wrong:** Developer adds company filter support to Market Pulse, contradicting the "sector-wide view, not per-company" locked decision.
**Why it happens:** The `useFilteredData` hook automatically filters any array field that has a `company` property. Market Pulse arrays use `channel` and `commodity` as keys, so filtering naturally passes through -- but a developer might add `company` fields thinking it's needed.
**How to avoid:** Do NOT add `company` fields to Market Pulse data arrays. The demand signals use `channel`, input costs use `commodity`, and channel mix uses `channel`. This ensures `useFilteredData` filtering is a no-op for Market Pulse.
**Warning signs:** Market Pulse showing empty/filtered data when a company filter is active.

### Pitfall 2: Input Cost Mock Data Lacks Time Series
**What goes wrong:** TrendLineChart expects an array of time-period objects with all commodity values as columns. The current mock data (`inputCosts` array) has per-commodity records with only QoQ/YoY percentage changes -- no historical series.
**Why it happens:** The TypeScript contract was designed for a summary view, but a multi-line trend chart needs historical data points.
**How to avoid:** Extend the mock data with a `historicalIndex` array (4-6 quarterly data points, indexed to base 100) for each commodity, OR change the visualization to a grouped bar chart showing QoQ/YoY changes per commodity (which matches the existing data shape).
**Warning signs:** Unable to populate TrendLineChart with more than one data point.

### Pitfall 3: Operational Intelligence Filtering Edge Cases
**What goes wrong:** `useFilteredData` matches `entry.company` as a string against filter IDs. The mock data uses full company names (e.g., "Amber Enterprises") not IDs (e.g., "amber"). The hook has a `toLowerCase().replace(/\s+/g, "-")` fallback, but "Amber Enterprises" becomes "amber-enterprises" which does NOT match the company ID "amber".
**Why it happens:** The mock data uses display names, not IDs, in the `company` field.
**How to avoid:** Either (a) change mock data `company` fields to use IDs ("amber", "dixon", etc.) matching `COMPANIES[].id`, or (b) enhance the filter hook to do fuzzy/partial matching on company names. Option (a) is simpler and more reliable.
**Warning signs:** Company filter not filtering operational data, or filtering out everything.

### Pitfall 4: Procurement Shifts Use `affectedCompanies` Array, Not `company` String
**What goes wrong:** The `useFilteredData` hook checks `entry.company` for filtering. But `procurementShifts` items have `affectedCompanies: string[]` (an array), not a `company` field. This means procurement data is never filtered.
**Why it happens:** The procurement data model is category-centric (e.g., "Compressors") not company-centric, with multiple companies affected.
**How to avoid:** Add a custom filter function for procurement shifts that checks if any `affectedCompanies` entry matches the active company filter. This requires either (a) post-processing the `useFilteredData` result for procurement, or (b) pre-processing procurement data to duplicate entries per company.
**Warning signs:** Procurement shifts section shows all data regardless of company filter.

### Pitfall 5: Tailwind v4 Grid Utility Differences
**What goes wrong:** Using Tailwind v3 grid syntax that doesn't work in v4.
**Why it happens:** Tailwind v4 changed some utility class names and configuration approach.
**How to avoid:** The project already uses Tailwind v4 classes successfully (e.g., `grid-cols-4`, `gap-md` with custom spacing tokens). Stick to the patterns visible in `SectionSkeleton.tsx` and `StatCard.tsx`. The `grid-cols-2` and `grid-cols-4` classes work identically in v4.
**Warning signs:** Grid not rendering; check browser DevTools for missing CSS rules.

### Pitfall 6: Recharts Legend TypeScript Typing
**What goes wrong:** TypeScript errors when using custom `content` render function on Recharts `Legend`.
**Why it happens:** Recharts v3 has known issues with Legend content prop TypeScript types (GitHub issues #2909, #4443). The `payload` in the render function may need a custom type definition.
**How to avoid:** Define a local `LegendPayload` type for the content render function. Cast props as needed. Use the pattern:
```typescript
interface LegendPayload {
  value: string;
  color: string;
  dataKey?: string;
}
const renderLegend = (props: { payload?: LegendPayload[] }) => { ... };
<Legend content={renderLegend as any} />
```
**Warning signs:** TypeScript errors on `<Legend content={...} />`.

## Code Examples

Verified patterns from the existing codebase:

### Extending Mock Data with Historical Input Cost Series

The current `inputCosts` array only has QoQ/YoY percentage changes. For a proper multi-line TrendLineChart, extend the mock data:

```typescript
// In src/data/mock/market-pulse.ts -- extend MarketPulseData type or add to mock
// Option A: Add historicalIndex to existing inputCosts items
inputCosts: [
  {
    commodity: "Steel (HR Coil)",
    trend: "up",
    qoqChange: 0.045,
    yoyChange: 0.082,
    // NEW: indexed quarterly values (base = 100 at Q1 FY24)
    history: [
      { period: "Q1 FY24", index: 100 },
      { period: "Q2 FY24", index: 102 },
      { period: "Q3 FY24", index: 99 },
      { period: "Q4 FY24", index: 104 },
      { period: "Q1 FY25", index: 106 },
      { period: "Q2 FY25", index: 104 },
      { period: "Q3 FY25", index: 108 },
    ],
  },
  // ... other commodities
],
```

```typescript
// Option B: Add a separate inputCostHistory field to MarketPulseData
inputCostHistory: [
  { period: "Q1 FY24", steel: 100, copper: 100, plastics: 100, aluminium: 100 },
  { period: "Q2 FY24", steel: 102, copper: 105, plastics: 101, aluminium: 103 },
  { period: "Q3 FY24", steel: 99,  copper: 108, plastics: 98,  aluminium: 106 },
  { period: "Q4 FY24", steel: 104, copper: 110, plastics: 96,  aluminium: 108 },
  { period: "Q1 FY25", steel: 106, copper: 112, plastics: 97,  aluminium: 111 },
  { period: "Q2 FY25", steel: 104, copper: 106, plastics: 99,  aluminium: 107 },
  { period: "Q3 FY25", steel: 108, copper: 113, plastics: 97,  aluminium: 110 },
],
```

**Recommendation:** Use Option B (separate `inputCostHistory` field). It matches the TrendLineChart data shape directly (array of period objects with commodity columns), avoiding runtime transformation. This requires updating the `MarketPulseData` type in `sections.ts`.

### Custom Chart Legend Matching Design System

```typescript
// src/components/charts/ChartLegend.tsx
interface LegendPayload {
  value: string;
  color?: string;
}

interface ChartLegendProps {
  payload?: LegendPayload[];
}

export function ChartLegend({ payload }: ChartLegendProps) {
  if (!payload?.length) return null;
  return (
    <div className="flex flex-wrap gap-md justify-center mt-sm">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-xs">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-text-secondary">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
```

### ImpactBadge Component

```typescript
// src/components/ui/ImpactBadge.tsx
import clsx from "clsx";

const config = {
  positive: { label: "Positive", className: "bg-positive/10 text-positive border-positive/20" },
  negative: { label: "Negative", className: "bg-negative/10 text-negative border-negative/20" },
  neutral:  { label: "Neutral",  className: "bg-neutral/10 text-neutral border-neutral/20" },
} as const;

interface ImpactBadgeProps {
  impact: "positive" | "negative" | "neutral";
  compact?: boolean;
}

export function ImpactBadge({ impact, compact }: ImpactBadgeProps) {
  const { label, className } = config[impact];
  return (
    <span className={clsx(
      "inline-flex items-center rounded border px-sm py-xs text-xs font-medium whitespace-nowrap",
      className,
    )}>
      {compact ? impact[0].toUpperCase() : label}
    </span>
  );
}
```

### Radix Accordion Import Pattern (Unified Package)

```typescript
// With the unified radix-ui@1.4.3 package, import directly:
import { Accordion } from "radix-ui";

// Usage:
<Accordion.Root type="multiple" defaultValue={["amber", "dixon"]}>
  <Accordion.Item value="amber">
    <Accordion.Header>
      <Accordion.Trigger>Amber Enterprises</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      {/* Signal cards */}
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Grouping Operational Data by Company

```typescript
// Utility function to group all operational signals by company
interface CompanySignalGroup {
  id: string;
  name: string;
  supplyChain: OperationalIntelligenceData["supplyChainSignals"];
  manufacturing: OperationalIntelligenceData["manufacturingCapacity"];
  procurement: OperationalIntelligenceData["procurementShifts"];
  retail: OperationalIntelligenceData["retailFootprint"];
  totalSignals: number;
}

function groupByCompany(data: OperationalIntelligenceData): CompanySignalGroup[] {
  const groups = new Map<string, CompanySignalGroup>();

  // Supply chain signals have `company` field
  for (const signal of data.supplyChainSignals) {
    const id = signal.company.toLowerCase().replace(/\s+/g, "-");
    if (!groups.has(id)) {
      groups.set(id, {
        id, name: signal.company,
        supplyChain: [], manufacturing: [], procurement: [], retail: [],
        totalSignals: 0,
      });
    }
    groups.get(id)!.supplyChain.push(signal);
    groups.get(id)!.totalSignals++;
  }

  // Manufacturing capacity has `company` field
  for (const item of data.manufacturingCapacity) {
    const id = item.company.toLowerCase().replace(/\s+/g, "-");
    if (!groups.has(id)) {
      groups.set(id, {
        id, name: item.company,
        supplyChain: [], manufacturing: [], procurement: [], retail: [],
        totalSignals: 0,
      });
    }
    groups.get(id)!.manufacturing.push(item);
    groups.get(id)!.totalSignals++;
  }

  // Procurement shifts have `affectedCompanies[]` -- fan out
  for (const shift of data.procurementShifts) {
    for (const companyName of shift.affectedCompanies) {
      const id = companyName.toLowerCase().replace(/\s+/g, "-");
      if (!groups.has(id)) {
        groups.set(id, {
          id, name: companyName,
          supplyChain: [], manufacturing: [], procurement: [], retail: [],
          totalSignals: 0,
        });
      }
      groups.get(id)!.procurement.push(shift);
      groups.get(id)!.totalSignals++;
    }
  }

  // Retail footprint has `company` field
  for (const item of data.retailFootprint) {
    const id = item.company.toLowerCase().replace(/\s+/g, "-");
    if (!groups.has(id)) {
      groups.set(id, {
        id, name: item.company,
        supplyChain: [], manufacturing: [], procurement: [], retail: [],
        totalSignals: 0,
      });
    }
    groups.get(id)!.retail.push(item);
    groups.get(id)!.totalSignals++;
  }

  return Array.from(groups.values()).sort((a, b) => b.totalSignals - a.totalSignals);
}
```

### Retail Footprint Action Badge

```typescript
// Reuse the pattern from PerformanceTag for retail actions
const retailActionConfig = {
  expansion:       { label: "Expanding",       icon: "+", className: "bg-positive/10 text-positive border-positive/20" },
  rationalization: { label: "Rationalizing",   icon: "-", className: "bg-negative/10 text-negative border-negative/20" },
  reformat:        { label: "Reformatting",    icon: "~", className: "bg-neutral/10 text-neutral border-neutral/20" },
} as const;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate `@radix-ui/react-accordion` package | Unified `radix-ui` package (tree-shakeable) | Feb 2025 | Single dependency, simpler imports: `import { Accordion } from "radix-ui"` |
| Recharts v2 Legend typing | Recharts v3.7 with improved but still partial Legend types | Late 2024 | Need local type definitions for `content` render prop; cast as `any` for TypeScript workaround |
| Tailwind v3 `theme.extend` configuration | Tailwind v4 `@theme` CSS-native tokens | Early 2025 | Design tokens defined in `tokens.css` via `@theme` directive, not `tailwind.config.js` |
| D3.js manual chart construction | Recharts declarative components | Stable | Project uses Recharts wrappers from Phase 1; no raw D3 needed |

**Deprecated/outdated:**
- Individual `@radix-ui/react-*` packages: Replaced by unified `radix-ui` package
- Tailwind `tailwind.config.js` theme extension: Replaced by CSS `@theme` in v4

## Discretion Recommendations

Based on research findings, here are recommendations for the areas left to Claude's discretion:

### Market Pulse Section Layout
**Recommendation: Dashboard grid (not stacked sections).** A 2-column CSS grid for the two chart panels (input costs, channel mix) with a 4-column row above for demand signal StatCards creates the Bloomberg-terminal density expected by consulting users. Stacked vertical sections waste horizontal space and require more scrolling.

### Input Cost Chart Configuration
**Recommendation: Multi-line overlay on a single TrendLineChart.** Overlaying 4 commodity lines enables visual correlation (e.g., steel and aluminium moving together while plastics diverges). Separate charts would require 4x vertical space and lose the comparison value. Requires extending mock data with `inputCostHistory` time series.

### Channel Mix Visualization Style
**Recommendation: Side-by-side grouped bar chart (not stacked, not donut).** The data shows `currentSharePct` vs `previousSharePct` per channel -- a natural before/after comparison. Side-by-side bars using the existing `BarComparisonChart` (with `stacked={false}`) show shift magnitude clearly. A donut would only show current state without comparison. A horizontal bar adds no value over vertical.

### Operational Signal Card Design and Grouping Strategy
**Recommendation: Radix Accordion grouped by company, default-expanded, with sub-sections by signal type.** Within each company accordion, show signal cards organized by type (supply chain > manufacturing > procurement > retail), each with a left-border color indicating impact (positive=green, negative=red, neutral=gray). Cards should be compact (title + 1-2 line detail + metadata tag).

### Manufacturing Capacity Visualization
**Recommendation: Card layout with action-type color-coded badges.** Cards (not table) because: (a) matches locked "card-based layout" decision, (b) action-type badges (Expansion/Greenfield/Rationalization/Maintenance) are more scannable as colored tags than table cells, (c) investment amounts and timelines display naturally as card metadata. Cards should show facility name, company, action badge, investment (INR Cr), and timeline.

## Open Questions

1. **Mock data company name vs. ID mismatch**
   - What we know: Operational mock data uses full company names ("Amber Enterprises", "Dixon Technologies") in the `company` field. The `useFilteredData` hook compares against company IDs ("amber", "dixon") from the filter store.
   - What's unclear: Whether the existing `toLowerCase().replace(/\s+/g, "-")` normalization in the hook produces matches (e.g., "Amber Enterprises" becomes "amber-enterprises" which does NOT match "amber").
   - Recommendation: Update mock data `company` fields to use canonical company IDs. Test with active company filters to verify. This is a data fix, not a code change.

2. **MarketPulseData type extension for historical input costs**
   - What we know: The current TypeScript type has `inputCosts` with QoQ/YoY changes but no time series. A TrendLineChart needs multiple data points.
   - What's unclear: Whether to modify the existing `inputCosts` type (add `history` array per commodity) or add a new top-level field `inputCostHistory`.
   - Recommendation: Add `inputCostHistory` as a new optional field on `MarketPulseData`. This preserves backward compatibility and cleanly separates summary data from chart data.

3. **Radix Accordion animation in Tailwind v4**
   - What we know: Radix Accordion.Content needs CSS animations for open/close transitions. The project uses Tailwind v4's `@theme` for animation tokens.
   - What's unclear: Exact CSS needed for Radix `data-[state=open]` / `data-[state=closed]` animation with Tailwind v4's approach.
   - Recommendation: Add keyframes for `accordion-open` and `accordion-close` in `tokens.css` and apply via Tailwind utility classes or inline styles on Accordion.Content.

## Sources

### Primary (HIGH confidence)
- **Codebase inspection** -- `src/types/sections.ts` (MarketPulseData, OperationalIntelligenceData contracts), `src/data/mock/market-pulse.ts` and `operations.ts` (mock data shapes), `src/components/charts/TrendLineChart.tsx` and `BarComparisonChart.tsx` (chart wrapper APIs), `src/hooks/use-filtered-data.ts` (filtering behavior), `src/theme/tokens.css` (design tokens), `package.json` (dependency versions)
- **Recharts official API** -- Bar `stackId` prop, LineChart multi-line pattern, Legend `content` render prop
- **Radix UI unified package** -- `radix-ui@1.4.3` includes Accordion primitive with full accessibility

### Secondary (MEDIUM confidence)
- [Recharts stacked bar chart examples](https://recharts.github.io/en-US/examples/StackedBarChart/) -- Verified stacked bar pattern
- [Radix UI Accordion docs](https://www.radix-ui.com/primitives/docs/components/accordion) -- Accordion API, keyboard navigation
- [Tailwind CSS grid-template-columns](https://tailwindcss.com/docs/grid-template-columns) -- Grid utilities confirmed compatible with v4
- [CSS conic-gradient MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/conic-gradient) -- Pure CSS gauge technique (available but not recommended for this use case)
- [Recharts Legend TypeScript issues](https://github.com/recharts/recharts/issues/2909) -- Known typing gaps in Legend content prop

### Tertiary (LOW confidence)
- None -- all findings verified against codebase or official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all dependencies already installed, APIs verified in codebase
- Architecture: HIGH -- patterns derived from existing codebase conventions and design system
- Pitfalls: HIGH -- identified through code inspection of `useFilteredData`, mock data, and TypeScript types
- Chart patterns: HIGH -- verified TrendLineChart and BarComparisonChart APIs match proposed usage
- Radix Accordion: MEDIUM -- unified package import confirmed, but animation pattern needs testing in Tailwind v4

**Research date:** 2026-02-16
**Valid until:** 2026-03-16 (stable stack, no fast-moving dependencies)
