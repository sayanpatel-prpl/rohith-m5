# Phase 3: Core Financial Intelligence - Research

**Researched:** 2026-02-16
**Domain:** Financial data tables, executive briefing layouts, sortable tables, expandable rows, multi-company comparison charts
**Confidence:** HIGH

## Summary

Phase 3 transforms two placeholder sections (ExecutiveSnapshot and FinancialPerformance) into fully-functional consulting-grade modules. The Executive Snapshot becomes the landing page with 5-bullet monthly summary cards, a red flags table with AI confidence badges, and AI narrative blocks. The Financial Performance Tracker becomes a sortable/filterable metrics table for 16 companies with expandable variance analysis rows, a company comparison selector, and time-series trend charts with QoQ/YoY toggle.

The existing codebase provides strong foundations: typed data contracts (`ExecutiveSnapshotData`, `FinancialPerformanceData` in `src/types/sections.ts`), rich mock data for 16 companies (`src/data/mock/financial.ts`) and 5 bullets + 5 red flags (`src/data/mock/executive.ts`), Phase 1 UI primitives (`StatCard`, `TrendIndicator`, `PerformanceTag`, `DataRecencyTag`), chart wrappers (`TrendLineChart`, `BarComparisonChart` using Recharts 3.7), and the `useFilteredData` hook with Zustand filter store from Phase 2. All Radix UI primitives needed (Collapsible, Tabs, Tooltip, Checkbox) are already available via the installed `radix-ui@1.4.3` unified package.

**Primary recommendation:** Build all new components as compositions of existing primitives. Sorting is pure `useMemo` with `useState` for sort config. Expandable rows use `Collapsible` from radix-ui. Comparison selection uses checkboxes inline in table rows (same pattern as `CompanyPicker`). Chart period toggle uses `Tabs` from radix-ui. No new dependencies needed.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Executive Snapshot is the landing page -- first thing users see when entering a tenant's report
- 5-bullet monthly summary with theme significance (high/medium/low)
- Red flags with AI confidence scores displayed as colored badges
- AI narrative per theme explaining BD relevance
- Data recency indicator using DataRecencyTag from Phase 1
- Bloomberg-dense layout: bullets as compact cards, red flags as a tight table
- Sortable, filterable metrics table for all companies in mock data
- Columns: Company, Revenue Growth YoY, EBITDA Margin, Working Capital Days, ROCE, Debt/Equity
- Each company tagged with PerformanceTag (outperform/inline/underperform) from Phase 1
- Side-by-side comparison: user selects 2-5 companies, sees time-series charts (TrendLineChart from Phase 1)
- Source attribution on every metric (e.g., "BSE filing Q3 FY25")
- AI variance analysis narrative per company
- Uses useFilteredData hook from Phase 2 for filter integration

### Claude's Discretion
- Table sorting implementation (client-side with state)
- Company comparison selection UX (checkboxes in table vs. separate picker)
- Variance analysis layout (expandable rows vs. side panel)
- Chart period toggle (QoQ vs YoY) implementation
- Executive Snapshot card layout and visual hierarchy

### Deferred Ideas (OUT OF SCOPE)
None
</user_constraints>

## Standard Stack

### Core (Already Installed -- No New Dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^19.2.4 | Component framework | Already installed |
| Recharts | ^3.7.0 | TrendLineChart, BarComparisonChart wrappers | Already installed; wrappers exist in `src/components/charts/` |
| radix-ui | 1.4.3 | Collapsible (expandable rows), Tabs (period toggle), Tooltip (source attribution) | Already installed; unified package exports all primitives |
| Zustand | ^5.0.11 | Filter store, comparison selection state | Already installed; `useFilterStore` in `src/stores/filter-store.ts` |
| TanStack Query | ^5.90.21 | Data fetching and caching | Already installed; `useFilteredData` hook wraps it |
| clsx | ^2.1.1 | Conditional class composition | Already installed; used throughout UI primitives |
| Tailwind CSS | ^4.1.18 | Utility-first styling with custom design tokens | Already installed; tokens in `src/theme/tokens.css` |

### Supporting (Already Available)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `src/lib/formatters.ts` | N/A | `formatPercent`, `formatGrowthRate`, `formatBps`, `formatINRCr`, `formatIndianNumber` | All financial metric display |
| `src/components/ui/*` | N/A | StatCard, TrendIndicator, PerformanceTag, DataRecencyTag, SectionSkeleton | Executive Snapshot and Financial Performance rendering |
| `src/components/charts/*` | N/A | TrendLineChart, BarComparisonChart, ChartTooltip | Company comparison charts |
| `src/hooks/use-filtered-data.ts` | N/A | `useFilteredData<T>` hook | Both sections use this for data fetching + filter integration |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom `useMemo` sorting | TanStack Table | TanStack Table is powerful but adds a dependency for 16-row table; `useMemo` sorting is trivial for this dataset size |
| Radix Collapsible (expandable rows) | CSS `<details>` element | `<details>` lacks animation support and consistent cross-browser styling; Collapsible provides data-state for Tailwind transitions |
| Radix Tabs (period toggle) | Custom toggle buttons | Tabs handles ARIA, keyboard navigation, and active state out of the box |
| Inline checkboxes for comparison | Separate multi-select picker | Checkboxes in table rows reduce context switching; user sees data while selecting |

**Installation:** No new packages required. All dependencies are already installed.

## Architecture Patterns

### Recommended Project Structure

```
src/
├── sections/
│   ├── executive/
│   │   ├── ExecutiveSnapshot.tsx        # Main section (replace placeholder)
│   │   ├── BulletSummary.tsx            # 5-bullet monthly summary grid
│   │   ├── RedFlagsTable.tsx            # Red flags with confidence badges
│   │   └── ThemeNarrative.tsx           # AI narrative per theme
│   └── financial/
│       ├── FinancialPerformance.tsx      # Main section (replace placeholder)
│       ├── MetricsTable.tsx             # Sortable table with expandable rows
│       ├── MetricsTableRow.tsx          # Single company row with checkbox + expand
│       ├── VarianceAnalysis.tsx         # Expandable row content (AI narrative)
│       ├── ComparisonView.tsx           # 2-5 company side-by-side charts
│       ├── ComparisonChart.tsx          # Single metric chart for selected companies
│       └── useSortedData.ts            # Sorting hook (useMemo + useState)
├── data/mock/
│   ├── executive.ts                     # Enrich: add AI narrative per theme
│   └── financial.ts                     # Enrich: add time-series history per company
└── types/
    └── sections.ts                      # May need to extend for time-series data
```

### Pattern 1: Client-Side Sorting with useMemo

**What:** Sort state managed by `useState`, sorted data derived via `useMemo`. No external library needed for 16-row tables.
**When to use:** Any table with fewer than 1000 rows where all data is already client-side.

```typescript
// src/sections/financial/useSortedData.ts
import { useState, useMemo } from "react";
import type { FinancialPerformanceData } from "../../types/sections";

type SortField = "name" | "revenueGrowthYoY" | "ebitdaMargin" | "workingCapitalDays" | "roce" | "debtEquity";
type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function useSortedData(companies: FinancialPerformanceData["companies"]) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "name",
    direction: "asc",
  });

  const sorted = useMemo(() => {
    const copy = [...companies];
    copy.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      if (sortConfig.field === "name") {
        aVal = a.name;
        bVal = b.name;
      } else {
        aVal = a.metrics[sortConfig.field];
        bVal = b.metrics[sortConfig.field];
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [companies, sortConfig]);

  function toggleSort(field: SortField) {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  return { sorted, sortConfig, toggleSort };
}
```

### Pattern 2: Expandable Table Rows with Radix Collapsible

**What:** Each table row wraps its variance analysis in a `Collapsible` from radix-ui. Clicking a chevron expands the row to show AI narrative inline.
**When to use:** When detail content belongs to a specific row and the user needs table context while reading details.

**Recommendation: Expandable rows (not side panel).** Reasons:
1. Bloomberg-dense layout directive means maximizing information density
2. Variance analysis is company-specific -- showing it inline under the row keeps context
3. Side panel would obscure the table on the compact viewport this design targets
4. Radix Collapsible provides accessible expand/collapse with animation support

```typescript
// Expandable row pattern using Radix Collapsible
import { Collapsible } from "radix-ui";

function MetricsTableRow({ company, isSelected, onToggleSelect }) {
  return (
    <Collapsible.Root>
      <tr className="border-b border-surface-overlay hover:bg-surface-raised/50">
        <td>
          <Checkbox.Root
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(company.id)}
            className="..."
          >
            <Checkbox.Indicator>...</Checkbox.Indicator>
          </Checkbox.Root>
        </td>
        <td>{company.name}</td>
        {/* ...metric cells... */}
        <td>
          <Collapsible.Trigger className="text-text-muted hover:text-text-primary">
            {/* Chevron icon rotates on open via data-[state=open] */}
            <span className="transition-transform data-[state=open]:rotate-90">
              {"\u25B6"}
            </span>
          </Collapsible.Trigger>
        </td>
      </tr>
      <Collapsible.Content>
        <tr>
          <td colSpan={8} className="p-md bg-surface-raised/30">
            <VarianceAnalysis
              narrative={company.varianceAnalysis}
              source={company.source}
            />
          </td>
        </tr>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
```

**Important note on Collapsible + table semantics:** Radix Collapsible renders a `div` by default, which is invalid inside `<tbody>`. The implementation must use `asChild` on `Collapsible.Root` (renders no wrapper) and manage the open/closed state via Collapsible's controlled props (`open`, `onOpenChange`). Alternatively, use Collapsible's controlled API with `useState` to toggle visibility of the detail `<tr>` manually while still getting the accessible `data-state` attributes. The key insight is: use Collapsible for its state management and accessibility, but handle the DOM structure manually to keep valid HTML table semantics.

### Pattern 3: Company Comparison Selection via Inline Checkboxes

**What:** First column of the metrics table has checkboxes. Selected companies (2-5) appear in a comparison view below the table.
**When to use:** When selection context (seeing the data rows) matters for the selection decision.

**Recommendation: Inline checkboxes in table rows.** Reasons:
1. User sees financial data while deciding which companies to compare
2. Consistent with the existing `CompanyPicker` checkbox pattern from Phase 2
3. Selection state is local to FinancialPerformance (not in global filter store)
4. Simpler UX than a separate picker that duplicates the company list

```typescript
// Comparison selection state - local to FinancialPerformance
const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

function toggleComparison(companyId: string) {
  setSelectedForComparison((prev) => {
    if (prev.includes(companyId)) {
      return prev.filter((id) => id !== companyId);
    }
    if (prev.length >= 5) return prev; // Max 5
    return [...prev, companyId];
  });
}

// Show comparison view when 2+ companies selected
{selectedForComparison.length >= 2 && (
  <ComparisonView
    companies={data.companies.filter((c) => selectedForComparison.includes(c.id))}
    timePeriod={filters.timePeriod}
  />
)}
```

### Pattern 4: Chart Period Toggle with Radix Tabs

**What:** QoQ vs YoY toggle above comparison charts using Radix Tabs primitive.
**When to use:** Binary or small-set toggle between data views of the same chart.

**Recommendation: Radix Tabs** rather than custom toggle buttons. Tabs handles ARIA roles, keyboard navigation (arrow keys), and provides `data-state` for styling.

```typescript
import { Tabs } from "radix-ui";

function ComparisonView({ companies, timePeriod }) {
  return (
    <div>
      <Tabs.Root defaultValue="YoY">
        <Tabs.List className="flex gap-xs mb-md border-b border-surface-overlay">
          <Tabs.Trigger
            value="YoY"
            className="px-md py-xs text-xs text-text-muted data-[state=active]:text-brand-accent data-[state=active]:border-b-2 data-[state=active]:border-brand-accent"
          >
            Year over Year
          </Tabs.Trigger>
          <Tabs.Trigger
            value="QoQ"
            className="px-md py-xs text-xs text-text-muted data-[state=active]:text-brand-accent data-[state=active]:border-b-2 data-[state=active]:border-brand-accent"
          >
            Quarter over Quarter
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="YoY">
          {/* TrendLineChart with YoY data */}
        </Tabs.Content>
        <Tabs.Content value="QoQ">
          {/* TrendLineChart with QoQ data */}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
```

### Pattern 5: Executive Snapshot Bloomberg-Dense Layout

**What:** High-density information display using compact card grid for bullets, tight table for red flags, and narrative blocks for AI analysis.
**When to use:** Landing page where user needs maximum signal density in first viewport.

Layout structure:
```
+---------------------------------------------+
| Executive Snapshot          [DataRecencyTag] |
+---------------------------------------------+
| [Bullet 1: Demand]    [Bullet 2: Cost]      |
| [Bullet 3: Policy]    [Bullet 4: Channel]   |
| [Bullet 5: WC Stress]                       |
+---------------------------------------------+
| RED FLAGS                                    |
| Company | Signal | Confidence | Explanation  |
| Orient  | ...    | [HIGH]     | Expand >     |
| Butterfly| ...   | [HIGH]     | Expand >     |
| ...                                         |
+---------------------------------------------+
```

Each bullet is a compact `StatCard`-like card showing: theme name (bold), significance badge (high/medium/low using existing ConfidenceLevel colors), and bullet text. Red flags are a tight table with the company name, signal text, a confidence badge (colored like PerformanceTag), and an expandable explanation.

### Anti-Patterns to Avoid

- **Over-engineering the table with TanStack Table:** For 16 rows with 6 columns, a headless table library adds complexity without benefit. Pure `useMemo` sorting is 20 lines of code.
- **Putting comparison selection in global Zustand store:** Comparison is section-local state, not a global filter. Putting it in the filter store would trigger re-renders in other sections and pollute the URL.
- **Using `<details>`/`<summary>` for expandable rows:** No animation support, inconsistent styling, and poor control over open/close state for "close others" behavior.
- **Rendering chart data inline in JSX:** Time-series data should be prepared in a `useMemo` before passing to `TrendLineChart`. Avoid computing chart data arrays inside JSX.
- **Using `onClick` on table header without keyboard support:** Sortable headers must be `<button>` elements inside `<th>` for keyboard accessibility.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Collapsible/expandable rows | Custom show/hide with useState | `Collapsible` from radix-ui | Handles ARIA disclosure pattern, focus management, data-state for CSS animations |
| Tab toggle (QoQ/YoY) | Custom radio buttons | `Tabs` from radix-ui | Handles ARIA tablist/tab/tabpanel roles, arrow key navigation, active state |
| Source attribution tooltips | Custom hover div | `Tooltip` from radix-ui | Handles delay, positioning, portal rendering, ARIA describedby |
| Number formatting | Custom toFixed/regex | `src/lib/formatters.ts` | `formatPercent`, `formatGrowthRate`, `formatBps` already handle signs, decimals, Indian notation |
| Performance badges | Custom colored spans | `PerformanceTag` from Phase 1 | Already has outperform/inline/underperform with correct colors and icons |
| Trend arrows | Custom SVG | `TrendIndicator` from Phase 1 | Already handles up/down/flat with semantic colors |
| Data recency display | Custom text | `DataRecencyTag` from Phase 1 | Already formatted with dot indicator |
| Loading states | Custom skeletons | `SectionSkeleton` from Phase 1 | Already has table, chart, cards, mixed variants |
| Client-side filtering | Custom filter logic | `useFilteredData` hook from Phase 2 | Already integrates TanStack Query + Zustand filters + company/sub-category/performance tier filtering |

**Key insight:** Phase 3 should compose existing primitives, not create new infrastructure. Every UI primitive, formatter, chart wrapper, and data hook needed already exists. The work is assembling them into the two section layouts.

## Common Pitfalls

### Pitfall 1: Collapsible Inside HTML Table Semantics
**What goes wrong:** Wrapping `<tr>` elements in `<Collapsible.Root>` introduces invalid `<div>` elements inside `<tbody>`.
**Why it happens:** Radix Collapsible renders a wrapper div by default. HTML spec requires `<tbody>` to contain only `<tr>` elements.
**How to avoid:** Use Collapsible in controlled mode with `open` and `onOpenChange` props. Manage the actual DOM visibility with conditional rendering or CSS, while using Collapsible's state management for accessibility attributes. Alternatively, break the table into a CSS grid (not HTML `<table>`) so wrapper divs are valid.
**Warning signs:** React hydration warnings, browser DevTools "nesting violation" errors.

**Recommended approach:** Use a CSS grid-based table layout (`display: grid` with `grid-template-columns`) instead of HTML `<table>`. This allows each "row" to be a `<div>` that can contain Collapsible without DOM nesting issues. The project's compact spacing tokens and monospace font already support this pattern.

### Pitfall 2: Time-Series Mock Data Gap
**What goes wrong:** The current `FinancialPerformanceData` type has only a single snapshot of metrics per company (no quarterly history). Comparison charts need time-series data.
**Why it happens:** The type was designed for the metrics table view, not the comparison chart view.
**How to avoid:** Extend the mock data to include quarterly history (4-6 quarters per company per metric). Either add a `history` array to each company entry, or create a separate time-series data structure.
**Warning signs:** Charts rendering with only 1 data point per company.

**Mock data extension needed:**
```typescript
// Add to FinancialPerformanceData company type or as separate data
interface QuarterlySnapshot {
  period: string;        // "Q1 FY24", "Q2 FY24", etc.
  revenueGrowthYoY: number;
  ebitdaMargin: number;
  workingCapitalDays: number;
  roce: number;
  debtEquity: number;
}

// Per company: history: QuarterlySnapshot[] (last 6 quarters)
```

### Pitfall 3: Sort Header Click Area Too Small
**What goes wrong:** Users click on the text in a `<th>` expecting it to sort, but only a small arrow icon is clickable.
**Why it happens:** The sort trigger is a small element rather than the full header cell.
**How to avoid:** Make the entire `<th>` content a `<button>` with `w-full text-left`. Include sort direction indicator (arrow/triangle) inline.
**Warning signs:** Users clicking headers with no response.

### Pitfall 4: Comparison Selection Not Clamped
**What goes wrong:** Users select 6+ companies and the comparison chart becomes unreadable (too many lines, colors become indistinguishable).
**Why it happens:** No max-selection enforcement.
**How to avoid:** Clamp at 5 companies (per requirement). Disable checkboxes when 5 are already selected (but still allow deselection). Show a subtle counter: "2 of 5 max selected".
**Warning signs:** Charts with 10+ overlapping lines.

### Pitfall 5: Recharts Re-Renders on Every Sort
**What goes wrong:** Sorting the table causes the comparison charts to re-render even though chart data has not changed.
**Why it happens:** Chart data array reference changes because it is derived from the sorted companies array.
**How to avoid:** Derive chart data from `selectedForComparison` IDs against the original (unsorted) data, not from the sorted array. Use a separate `useMemo` with `selectedForComparison` as the only dependency.
**Warning signs:** Chart flickers on every sort click.

### Pitfall 6: Executive Snapshot Bullets Not Filtered
**What goes wrong:** Bullets and red flags are not filtered by the global company filter because they are section-level insights, not per-company data.
**Why it happens:** The `useFilteredData` hook filters arrays by company ID, but bullets don't have a company field (they are theme-level).
**How to avoid:** Accept that bullets are always shown in full. Red flags already have a `company` field and will be filtered correctly by `useFilteredData`. Document this behavior.
**Warning signs:** User selects one company and sees 0 bullets.

## Code Examples

### Executive Snapshot Bullet Card

```typescript
// BulletSummary.tsx
import clsx from "clsx";
import type { ConfidenceLevel } from "../../types/common";

interface BulletCardProps {
  text: string;
  theme: string;
  significance: ConfidenceLevel;
}

const SIGNIFICANCE_STYLES: Record<ConfidenceLevel, string> = {
  high: "bg-negative/10 text-negative border-negative/20",
  medium: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  low: "bg-neutral/10 text-neutral border-neutral/20",
};

function BulletCard({ text, theme, significance }: BulletCardProps) {
  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-md space-y-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-primary">{theme}</span>
        <span
          className={clsx(
            "text-[10px] font-medium px-sm py-xs rounded border",
            SIGNIFICANCE_STYLES[significance]
          )}
        >
          {significance.toUpperCase()}
        </span>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{text}</p>
    </div>
  );
}
```

### Sortable Table Header

```typescript
// SortableHeader component
import clsx from "clsx";

interface SortableHeaderProps {
  label: string;
  field: string;
  activeField: string;
  direction: "asc" | "desc";
  onSort: (field: string) => void;
  align?: "left" | "right";
}

function SortableHeader({
  label,
  field,
  activeField,
  direction,
  onSort,
  align = "right",
}: SortableHeaderProps) {
  const isActive = field === activeField;
  return (
    <th className={clsx("px-md py-xs", align === "right" ? "text-right" : "text-left")}>
      <button
        onClick={() => onSort(field)}
        className={clsx(
          "inline-flex items-center gap-xs text-xs font-medium cursor-pointer",
          "hover:text-text-primary transition-colors w-full",
          align === "right" ? "justify-end" : "justify-start",
          isActive ? "text-brand-accent" : "text-text-muted"
        )}
      >
        <span>{label}</span>
        <span className="text-[10px]">
          {isActive ? (direction === "asc" ? "\u25B2" : "\u25BC") : "\u25C6"}
        </span>
      </button>
    </th>
  );
}
```

### Source Attribution with Tooltip

```typescript
// Source attribution using Radix Tooltip
import { Tooltip } from "radix-ui";

function SourceAttribution({ source }: { source: string }) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="text-[10px] text-text-muted hover:text-text-secondary cursor-help underline decoration-dotted">
            Source
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-surface-overlay border border-surface-overlay rounded shadow-lg px-md py-sm text-xs text-text-primary"
            sideOffset={4}
          >
            {source}
            <Tooltip.Arrow className="fill-surface-overlay" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
```

### Time-Series Data Preparation for Charts

```typescript
// Preparing comparison chart data from company history
import { useMemo } from "react";

interface QuarterlySnapshot {
  period: string;
  revenueGrowthYoY: number;
  ebitdaMargin: number;
  workingCapitalDays: number;
  roce: number;
  debtEquity: number;
}

function useComparisonChartData(
  companies: Array<{ id: string; name: string; history: QuarterlySnapshot[] }>,
  metric: keyof Omit<QuarterlySnapshot, "period">
) {
  return useMemo(() => {
    if (companies.length === 0) return [];

    // Use first company's periods as x-axis
    const periods = companies[0].history.map((h) => h.period);

    return periods.map((period) => {
      const point: Record<string, unknown> = { period };
      companies.forEach((company) => {
        const snapshot = company.history.find((h) => h.period === period);
        point[company.id] = snapshot ? snapshot[metric] : null;
      });
      return point;
    });
  }, [companies, metric]);
}
```

### Confidence Badge (Reusable for Red Flags)

```typescript
// Confidence badge component following PerformanceTag pattern
import clsx from "clsx";
import type { ConfidenceLevel } from "../../types/common";

const CONFIDENCE_STYLES: Record<ConfidenceLevel, string> = {
  high: "bg-negative/10 text-negative border-negative/20",
  medium: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  low: "bg-neutral/10 text-neutral border-neutral/20",
};

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-sm py-xs rounded border text-[10px] font-medium uppercase tracking-wide",
        CONFIDENCE_STYLES[level]
      )}
    >
      {level}
    </span>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| HTML `<table>` for complex interactive tables | CSS Grid-based table layouts | 2023+ | Allows wrapper divs for expandable rows, better responsive behavior |
| Individual `@radix-ui/react-*` packages | Unified `radix-ui` package | 2025 (v1.x) | Single import: `import { Collapsible, Tabs } from "radix-ui"` |
| Recharts v2 `<Tooltip>` component API | Recharts v3 improved TypeScript types | 2024-2025 | Better type safety on Tooltip content props (already handled by ChartTooltip wrapper) |
| `useReducer` for sort state | `useState` with derived `useMemo` | Standard React pattern | Simpler than reducer for single-concern sort state |

**Relevant to this project:**
- The project already uses the unified `radix-ui` package (v1.4.3). All new components (Collapsible, Tabs, Tooltip) import from `"radix-ui"` directly.
- Recharts v3.7.0 is installed. The existing `TrendLineChart` wrapper handles brand colors via CSS custom properties.

## Open Questions

1. **Time-Series Mock Data Structure**
   - What we know: Current `FinancialPerformanceData` has single-snapshot metrics per company. Comparison charts (FINP-03) need historical data.
   - What's unclear: Whether to extend the existing type with a `history` array per company, or create a separate data structure.
   - Recommendation: Add `history: QuarterlySnapshot[]` to the existing company entries in `FinancialPerformanceData`. This keeps the data co-located and makes the `useFilteredData` hook work without changes. Generate 6 quarters of mock history per company.

2. **Executive Snapshot AI Narrative Structure**
   - What we know: EXEC-04 requires "AI-generated narrative explains why each theme matters for BD opportunities." Current mock data has `bullets` with `text`, `theme`, `significance` -- but no separate narrative field.
   - What's unclear: Whether the narrative is a separate block per theme or an extension of the bullet text.
   - Recommendation: Add a `narrative` field to each bullet entry (separate from `text`). The `text` is the concise bullet; the `narrative` is the expanded AI explanation of BD relevance. This allows the UI to show bullets compactly with an expand-to-read-more pattern.

3. **CSS Grid vs HTML Table for Metrics Table**
   - What we know: HTML `<table>` has stricter DOM nesting rules that conflict with Radix Collapsible wrappers. CSS Grid has no such constraints.
   - What's unclear: Whether the performance tier and sorting behavior work correctly with CSS Grid.
   - Recommendation: Use CSS Grid. It avoids the Collapsible-in-table DOM nesting issue entirely and provides better control over column sizing. Define columns as `grid-template-columns: auto 1fr repeat(5, minmax(80px, 1fr)) auto` for checkbox, company name, 5 metrics, and expand trigger.

## Sources

### Primary (HIGH confidence)
- **Codebase analysis** - Direct reading of `src/types/sections.ts`, `src/types/financial.ts`, `src/types/common.ts`, `src/data/mock/executive.ts`, `src/data/mock/financial.ts`, `src/data/mock/companies.ts`, `src/components/ui/*.tsx`, `src/components/charts/*.tsx`, `src/hooks/use-filtered-data.ts`, `src/stores/filter-store.ts`, `src/theme/tokens.css`, `src/components/layout/AppShell.tsx`, `src/components/filters/CompanyPicker.tsx`, `src/lib/formatters.ts`
- **radix-ui@1.4.3 package.json** - Verified available components: Accordion, Collapsible, Tabs, Tooltip, Checkbox all exported from unified package
- **radix-ui/src/index.ts** - Confirmed import pattern: `import { Collapsible, Tabs, Tooltip } from "radix-ui"`

### Secondary (MEDIUM confidence)
- [Radix Primitives - Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible) - API structure, data-state attributes, animation CSS variables
- [Radix Primitives - Tabs](https://www.radix-ui.com/primitives/docs/components/tabs) - Tab API structure, ARIA compliance
- [Radix Primitives - Accordion](https://www.radix-ui.com/primitives/docs/components/accordion) - WAI-ARIA design pattern reference
- [Smashing Magazine - Sortable Tables in React](https://www.smashingmagazine.com/2020/03/sortable-tables-react/) - useMemo sorting pattern validation
- [LogRocket - Creating React Sortable Table](https://blog.logrocket.com/creating-react-sortable-table/) - Sort state management patterns
- [Pencil & Paper - Enterprise Data Table UX Patterns](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables) - Expandable row patterns, right-aligned numbers, consulting-grade formatting
- [Phoenix Strategy Group - Financial Dashboard Design](https://www.phoenixstrategy.group/blog/how-to-design-real-time-financial-dashboards) - Variance analysis presentation, CFO dashboard patterns

### Tertiary (LOW confidence)
- None. All findings verified against codebase or official documentation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and verified in package.json; no new dependencies
- Architecture: HIGH - All proposed patterns verified against existing codebase primitives; Radix exports confirmed in node_modules
- Pitfalls: HIGH - Collapsible/table DOM nesting issue verified by reading Radix source exports; time-series data gap confirmed by reading type definitions
- Code examples: HIGH - Based on existing project patterns (PerformanceTag, CompanyPicker, TrendLineChart, formatters)

**Research date:** 2026-02-16
**Valid until:** 2026-03-16 (stable -- no fast-moving dependencies)
