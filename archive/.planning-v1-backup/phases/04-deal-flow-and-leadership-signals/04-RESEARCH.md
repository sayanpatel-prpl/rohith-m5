# Phase 4: Deal Flow and Leadership Signals - Research

**Researched:** 2026-02-16
**Domain:** Financial transaction timeline visualization, deal card UI, leadership change tables with risk indicators, AI pattern/insight cards
**Confidence:** HIGH

## Summary

This phase builds two event-based signal modules -- Deals & Transactions and Leadership & Governance -- on top of the existing Phase 2 infrastructure (useFilteredData, SectionSkeleton, DataRecencyTag, TrendIndicator, StatCard, design tokens). Both modules consume typed mock data already defined in Phase 2 and render rich, interactive views.

The Deals module centers on a vertical timeline visualization built with pure CSS (Tailwind `border-l` + absolute-positioned dots) showing deal cards chronologically, with Radix UI Tabs for deal type filtering (M&A / PE/VC / IPO / Distressed). The Leadership module uses compact data tables with expandable rows (Radix Collapsible), the existing TrendIndicator for promoter stake changes, and highlighted warning cards for auditor flags. Both modules include AI insight cards -- pattern recognition summaries for deals and risk flag cards for leadership.

No new dependencies are needed. Everything builds on the existing stack: React 19, Tailwind CSS v4, Radix UI (unified `radix-ui` package v1.4.3), Recharts 3.7, clsx, and the established design token system. The vertical timeline, deal cards, tab switching, leadership tables, and AI insight cards are all implementable with Tailwind utilities and existing Radix primitives.

**Primary recommendation:** Build the vertical timeline as a pure CSS component (no external timeline library). Use Radix Tabs for deal type filtering. Use Radix Collapsible for expandable table rows in leadership changes. Reuse existing TrendIndicator, StatCard, and formatters extensively. Create reusable AI InsightCard and ConfidenceBadge components that will be used across Phase 4 and future phases (7, 8).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Display M&A, PE/VC, IPO, and distressed asset activity
- Each deal shows parties, value (formatted INR), rationale, date
- Chronological timeline visualization (vertical timeline with deal cards)
- AI pattern recognition highlighting deal clusters and investor themes
- Filter integration via useFilteredData from Phase 2
- Deal type tabs or filter to switch between M&A / PE/VC / IPO / Distressed
- CXO changes with company, role, person, direction (appointed/departed)
- Board reshuffles and committee changes
- Promoter stake changes with TrendIndicator (up/down/flat)
- Auditor resignation flags as highlighted warning cards
- AI risk flags on governance events signaling stress or opportunity
- Compact table layout for changes, expandable for details

### Claude's Discretion
- Timeline visualization style (vertical timeline vs. horizontal) -- RECOMMENDATION: Vertical, per locked decision
- Deal card layout and information hierarchy
- AI pattern display format (summary cards vs. inline annotations)
- Leadership change grouping (by company vs. by type vs. chronological)
- Risk flag severity visualization

### Deferred Ideas (OUT OF SCOPE)
None
</user_constraints>

## Standard Stack

### Core (already installed -- no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19 | UI framework | Already in project |
| Tailwind CSS | v4 | Styling + design tokens | `@theme` tokens, utility-first, high-density layout |
| Radix UI | 1.4.3 (unified) | Tabs, Collapsible, Tooltip | WAI-ARIA compliant headless primitives, already in project |
| Recharts | 3.7 | Charts (if needed for promoter stake trends) | Already in project |
| clsx | 2.1.1 | Conditional classnames | Already in project |

### Radix UI Components Used in This Phase
| Component | Import | Purpose |
|-----------|--------|---------|
| Tabs | `import { Tabs } from "radix-ui"` | Deal type switching (M&A / PE/VC / IPO / Distressed / All) |
| Collapsible | `import { Collapsible } from "radix-ui"` | Expandable rows in leadership change tables |
| Tooltip | `import { Tooltip } from "radix-ui"` | Hover details on confidence badges, deal values |
| Separator | `import { Separator } from "radix-ui"` | Visual dividers between sections |

### Existing Components to Reuse
| Component | Location | Use In This Phase |
|-----------|----------|-------------------|
| TrendIndicator | `src/components/ui/TrendIndicator.tsx` | Promoter stake change direction (up/down/flat) |
| StatCard | `src/components/ui/StatCard.tsx` | Summary stats (total deal value, deal count, CXO change count) |
| DataRecencyTag | `src/components/ui/DataRecencyTag.tsx` | Section header "Data as of Q3 FY25" |
| SectionSkeleton | `src/components/ui/SectionSkeleton.tsx` | Loading state |
| PerformanceTag | `src/components/ui/PerformanceTag.tsx` | Potential reuse for severity/confidence display |
| formatINRCr / formatINRAuto | `src/lib/formatters.ts` | Deal value formatting (INR Cr) |
| formatPercent | `src/lib/formatters.ts` | Promoter stake percentage changes |
| useFilteredData | `src/hooks/use-filtered-data.ts` | Data fetching + client-side filtering |

### New Shared Components to Create
| Component | Purpose | Reuse Potential |
|-----------|---------|----------------|
| ConfidenceBadge | Display AI confidence level (high/medium/low) with color | Phases 3, 4, 5, 6, 7, 8 |
| InsightCard | AI-generated insight display with confidence, icon, explanation | Phases 4, 7, 8 |
| DealTypeBadge | Color-coded badge for deal type (M&A, PE/VC, IPO, distressed) | Phase 4 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure CSS timeline | react-vertical-timeline-component (npm) | External lib adds 15KB+ bundle, locked styling; pure CSS with Tailwind is simpler, brand-consistent, and zero added weight |
| Radix Tabs | Custom button group | Radix provides keyboard navigation, WAI-ARIA roles, focus management for free; use it |
| Radix Collapsible | Details/summary HTML | Radix provides animation CSS vars, controlled state, and consistent behavior across browsers |
| Recharts for promoter trends | Pure number display | Promoter stake changes are simple percentage diffs; TrendIndicator + formatted numbers are sufficient. No chart needed. |

**Installation:**
```bash
# No new packages needed -- all dependencies already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  sections/
    deals/
      DealsTransactions.tsx       # Main section component (replace placeholder)
      DealTimeline.tsx            # Vertical timeline with deal cards
      DealCard.tsx                # Individual deal card
      DealSummaryStats.tsx        # Top-level stat cards (total value, count, etc.)
      DealPatterns.tsx            # AI pattern recognition cards
    leadership/
      LeadershipGovernance.tsx    # Main section component (replace placeholder)
      CxoChangesTable.tsx         # CXO changes table with expandable rows
      BoardReshuffles.tsx         # Board changes list
      PromoterStakes.tsx          # Promoter stake changes with TrendIndicator
      AuditorFlags.tsx            # Auditor warning cards
      LeadershipRiskFlags.tsx     # AI risk flag cards
  components/
    ui/
      ConfidenceBadge.tsx         # NEW: AI confidence level badge
      InsightCard.tsx             # NEW: AI insight/pattern card
      DealTypeBadge.tsx           # NEW: Deal type color badge
```

### Pattern 1: Vertical Timeline (Pure CSS + Tailwind)
**What:** A vertical line with chronologically ordered deal cards branching off it.
**When to use:** DEAL-05 timeline visualization requirement.
**Why pure CSS:** No external dependency. The timeline is a `border-l` on a container with absolutely-positioned dot markers. Each card is a flex row with consistent spacing. Tailwind's `before:` and `after:` pseudo-element variants handle the line and dots.

```tsx
// DealTimeline.tsx
// The vertical line is the container's left border.
// Each item has a dot (pseudo-element) and a card.

interface DealTimelineProps {
  deals: Array<{
    id: string;
    type: "M&A" | "PE/VC" | "IPO" | "distressed";
    parties: string[];
    valueCr: number | null;
    rationale: string;
    date: string;
    source: string;
  }>;
}

function DealTimeline({ deals }: DealTimelineProps) {
  // Sort chronologically (newest first)
  const sorted = [...deals].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="relative ml-md">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-surface-overlay" />

      <div className="space-y-md">
        {sorted.map((deal) => (
          <div key={deal.id} className="relative pl-lg">
            {/* Timeline dot */}
            <div className="absolute left-0 top-md -translate-x-1/2 w-2 h-2 rounded-full bg-brand-accent border-2 border-surface" />
            {/* Deal card */}
            <DealCard deal={deal} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Pattern 2: Radix Tabs for Deal Type Filtering
**What:** Tab bar that filters deals by type (All / M&A / PE/VC / IPO / Distressed).
**When to use:** DEAL-01 through DEAL-04 type-specific views.
**API pattern from existing codebase:**

```tsx
// Matches existing project pattern from SelectFilter.tsx / CompanyPicker.tsx
import { Tabs } from "radix-ui";

const DEAL_TYPES = [
  { value: "all", label: "All Deals" },
  { value: "M&A", label: "M&A" },
  { value: "PE/VC", label: "PE/VC" },
  { value: "IPO", label: "IPO" },
  { value: "distressed", label: "Distressed" },
] as const;

function DealsWithTabs({ deals }: { deals: Deal[] }) {
  return (
    <Tabs.Root defaultValue="all">
      <Tabs.List className="flex gap-xs border-b border-surface-overlay mb-md">
        {DEAL_TYPES.map((type) => (
          <Tabs.Trigger
            key={type.value}
            value={type.value}
            className="px-sm py-xs text-xs text-text-secondary
              data-[state=active]:text-brand-accent
              data-[state=active]:border-b-2
              data-[state=active]:border-brand-accent
              hover:text-text-primary transition-colors"
          >
            {type.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value="all">
        <DealTimeline deals={deals} />
      </Tabs.Content>
      {/* Each type filters the deals array */}
      <Tabs.Content value="M&A">
        <DealTimeline deals={deals.filter((d) => d.type === "M&A")} />
      </Tabs.Content>
      {/* ... etc */}
    </Tabs.Root>
  );
}
```

**Key Radix Tabs API:**
- `Tabs.Root`: Container. Props: `defaultValue` (uncontrolled) or `value` + `onValueChange` (controlled).
- `Tabs.List`: Groups triggers. Has `aria-label` support.
- `Tabs.Trigger`: Button that activates content. Props: `value` (string). Data attribute `data-state="active"` for styling.
- `Tabs.Content`: Panel shown when trigger is active. Props: `value` (string). Uses `forceMount` to keep content mounted (optional).

### Pattern 3: Expandable Table Rows with Radix Collapsible
**What:** Compact row showing key info, expandable to show full context/details.
**When to use:** CXO changes, board reshuffles -- show company + role + person in compact view, click to expand context narrative.

```tsx
import { Collapsible } from "radix-ui";

function CxoChangeRow({ change }: { change: CxoChange }) {
  return (
    <Collapsible.Root>
      <div className="flex items-center justify-between py-sm px-md border-b border-surface-overlay hover:bg-surface-raised transition-colors">
        <div className="flex items-center gap-md flex-1 min-w-0">
          <span className="text-xs font-medium text-text-primary truncate w-28">
            {change.company}
          </span>
          <span className="text-xs text-text-secondary truncate w-36">
            {change.role}
          </span>
          <DirectionBadge incoming={change.incoming} outgoing={change.outgoing} />
          <span className="text-xs text-text-muted">{formatDate(change.effectiveDate)}</span>
        </div>
        <Collapsible.Trigger className="text-text-muted hover:text-text-primary text-xs cursor-pointer">
          {/* Chevron rotates via data-state */}
          <span className="data-[state=open]:rotate-180 transition-transform inline-block">
            {"\u25BE"}
          </span>
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content className="px-md py-sm bg-surface-raised text-xs text-text-secondary border-b border-surface-overlay">
        <p>{change.context}</p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
```

### Pattern 4: AI Insight Card (Reusable)
**What:** A card displaying an AI-generated pattern/risk flag with confidence level, explanation, and supporting evidence.
**When to use:** DEAL-06 (deal patterns), LEAD-05 (risk flags), and future phases 7/8.

```tsx
// InsightCard.tsx -- new shared component
import { ConfidenceBadge } from "./ConfidenceBadge";
import type { ConfidenceLevel } from "../../types/common";

interface InsightCardProps {
  icon?: string;         // Emoji or symbol for visual scanning
  title: string;
  confidence: ConfidenceLevel;
  explanation: string;
  variant?: "pattern" | "risk" | "opportunity";
  className?: string;
}

function InsightCard({ icon, title, confidence, explanation, variant = "pattern", className }: InsightCardProps) {
  const borderColor = {
    pattern: "border-l-chart-1",
    risk: "border-l-negative",
    opportunity: "border-l-positive",
  }[variant];

  return (
    <div className={clsx(
      "bg-surface-raised border border-surface-overlay rounded p-md border-l-2",
      borderColor,
      className,
    )}>
      <div className="flex items-start justify-between gap-sm mb-xs">
        <div className="flex items-center gap-xs">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="text-xs font-medium text-text-primary">{title}</span>
        </div>
        <ConfidenceBadge level={confidence} />
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{explanation}</p>
    </div>
  );
}
```

### Pattern 5: Confidence Badge
**What:** Color-coded pill showing AI confidence level.
**When to use:** Every AI-generated insight across the application.

```tsx
// ConfidenceBadge.tsx -- new shared component
import clsx from "clsx";
import type { ConfidenceLevel } from "../../types/common";

const config: Record<ConfidenceLevel, { label: string; className: string }> = {
  high: {
    label: "High",
    className: "bg-positive/10 text-positive border-positive/20",
  },
  medium: {
    label: "Medium",
    className: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  },
  low: {
    label: "Low",
    className: "bg-neutral/10 text-neutral border-neutral/20",
  },
};

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const { label, className } = config[level];
  return (
    <span className={clsx(
      "inline-flex items-center px-sm py-xs rounded border text-[10px] font-medium whitespace-nowrap",
      className,
    )}>
      {label}
    </span>
  );
}
```

### Pattern 6: Deal Card for Financial Transactions
**What:** Individual deal card within the timeline showing type badge, parties, value, rationale, date, and source.
**When to use:** Each deal in the vertical timeline.

```tsx
// DealCard.tsx
import { DealTypeBadge } from "../../components/ui/DealTypeBadge";
import { formatINRCr } from "../../lib/formatters";

interface DealCardProps {
  deal: {
    type: "M&A" | "PE/VC" | "IPO" | "distressed";
    parties: string[];
    valueCr: number | null;
    rationale: string;
    date: string;
    source: string;
  };
}

function DealCard({ deal }: DealCardProps) {
  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-md space-y-xs">
      {/* Header row: type badge + date */}
      <div className="flex items-center justify-between">
        <DealTypeBadge type={deal.type} />
        <span className="text-[10px] text-text-muted">{formatDealDate(deal.date)}</span>
      </div>

      {/* Parties */}
      <p className="text-xs font-medium text-text-primary">
        {formatParties(deal.type, deal.parties)}
      </p>

      {/* Value (if available) */}
      {deal.valueCr !== null && (
        <p className="text-sm font-semibold text-text-primary">
          {formatINRCr(deal.valueCr)}
        </p>
      )}

      {/* Rationale */}
      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
        {deal.rationale}
      </p>

      {/* Source attribution */}
      <p className="text-[10px] text-text-muted">
        Source: {deal.source}
      </p>
    </div>
  );
}

// Format parties based on deal type
function formatParties(type: string, parties: string[]): string {
  if (type === "M&A" && parties.length >= 2) {
    return `${parties[0]} \u2192 ${parties[1]}`; // Acquirer -> Target
  }
  if (type === "PE/VC" && parties.length >= 2) {
    return `${parties[1]} invests in ${parties[0]}`;
  }
  return parties.join(", ");
}
```

### Pattern 7: Promoter Stake Change Display
**What:** Show promoter stake percentage with TrendIndicator direction and formatted change.
**When to use:** LEAD-03 promoter stake changes.

```tsx
import { TrendIndicator } from "../../components/ui/TrendIndicator";
import { formatPercent } from "../../lib/formatters";
import type { TrendDirection } from "../../types/common";

function PromoterStakeRow({ stake }: { stake: PromoterStakeChange }) {
  const direction: TrendDirection =
    stake.changePct > 0 ? "up" : stake.changePct < 0 ? "down" : "flat";

  return (
    <div className="flex items-center justify-between py-sm px-md border-b border-surface-overlay">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-text-primary truncate">{stake.company}</p>
        <p className="text-[10px] text-text-muted truncate">{stake.promoterGroup}</p>
      </div>
      <div className="flex items-center gap-md">
        <span className="text-xs text-text-secondary font-mono">
          {stake.currentPct.toFixed(1)}%
        </span>
        <div className="flex items-center gap-xs">
          <TrendIndicator direction={direction} size="sm" />
          <span className={clsx(
            "text-xs font-mono",
            direction === "up" ? "text-positive" : direction === "down" ? "text-negative" : "text-neutral"
          )}>
            {formatPercent(stake.changePct)}
          </span>
        </div>
      </div>
    </div>
  );
}
```

### Pattern 8: Auditor Flag Warning Card
**What:** Visually distinct warning card for auditor resignations and flags.
**When to use:** LEAD-04 auditor flags.

```tsx
function AuditorFlagCard({ flag }: { flag: AuditorFlag }) {
  const severityStyles = {
    high: "border-l-negative bg-negative/5",
    medium: "border-l-brand-accent bg-brand-accent/5",
    low: "border-l-neutral bg-neutral/5",
  };

  return (
    <div className={clsx(
      "border border-surface-overlay rounded p-md border-l-2",
      severityStyles[flag.severity],
    )}>
      <div className="flex items-center justify-between mb-xs">
        <span className="text-xs font-medium text-text-primary">{flag.company}</span>
        <ConfidenceBadge level={flag.severity} />
      </div>
      <p className="text-xs text-text-secondary font-medium mb-xs">{flag.flag}</p>
      <p className="text-xs text-text-muted leading-relaxed">{flag.details}</p>
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **External timeline library:** Do not install react-vertical-timeline-component or similar. The visual is simple enough for Tailwind CSS. External libs add bundle weight and fight the design system.
- **Separate API calls per tab:** Do not fetch deal data per-type. Fetch once via useFilteredData, filter client-side per tab. This matches FOUND-14 (no refetch on filter change).
- **Controlled Radix Tabs with URL state:** Do not sync tab state to URL. These are local UI state within the section, not a navigation concern. Use `defaultValue` (uncontrolled).
- **Hand-rolled accordion/collapsible:** Do not build expand/collapse from scratch. Radix Collapsible handles accessibility, keyboard navigation, and animation CSS vars.
- **Charts for simple metrics:** Do not use Recharts for single-number promoter stake changes. TrendIndicator + formatted percentage is more information-dense and faster to scan.
- **Mixing filter levels:** The deal type tab filter is LOCAL to the Deals section. The useFilteredData company/sub-category filters are GLOBAL. Do not conflate them. Apply global filters first (via useFilteredData), then local tab filter on the result.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tab switching with keyboard nav | Custom tab state + button group | `Radix Tabs` | Arrow keys, Home/End, WAI-ARIA roles handled automatically |
| Expandable content sections | useState + conditional rendering | `Radix Collapsible` | Animation CSS vars (`--radix-collapsible-content-height`), accessibility, data-state styling |
| INR value formatting | Template literals with toLocaleString | `formatINRCr` / `formatINRAuto` from `src/lib/formatters.ts` | Indian number grouping (##,##,###), Cr/Lakh auto-switching, reused Intl.NumberFormat instances |
| Trend direction indicators | Custom span + conditional color | `TrendIndicator` from `src/components/ui/TrendIndicator.tsx` | Consistent arrows, colors, aria-labels across entire app |
| Percentage change formatting | Manual string concatenation | `formatPercent` from `src/lib/formatters.ts` | Explicit sign (+/-), consistent decimal places |
| Confidence level display | Inline conditional classes | New `ConfidenceBadge` component | Standardized across all AI features (this phase + future) |
| Data loading states | Inline skeleton divs | `SectionSkeleton` from `src/components/ui/SectionSkeleton.tsx` | Consistent shimmer + layout shapes |
| Client-side filtering | Manual useQuery + filter | `useFilteredData` hook | Handles query + Zustand filter state + memoized filtering |

**Key insight:** Phase 2 established a comprehensive UI primitive library and data pipeline. Phase 4 should compose these primitives extensively rather than creating parallel systems. The only new shared components needed are ConfidenceBadge and InsightCard, which fill genuinely new semantic needs (AI confidence display and AI insight formatting).

## Common Pitfalls

### Pitfall 1: Timeline Rendering with Filtered Empty State
**What goes wrong:** When filters reduce deals to zero, the timeline shows an empty vertical line with no cards.
**Why it happens:** The timeline container renders its vertical line regardless of child count.
**How to avoid:** Check filtered deal count before rendering timeline. Show an explicit empty state message: "No {dealType} deals match current filters."
**Warning signs:** Visual testing with aggressive filters (single company + specific deal type) returns empty timeline.

### Pitfall 2: Deal Value Null Handling
**What goes wrong:** Rendering `formatINRCr(null)` throws or shows "INR NaN Cr".
**Why it happens:** Some deals (especially distressed, IPO speculation) have `valueCr: null` in the data contract.
**How to avoid:** Always guard with `deal.valueCr !== null` before formatting. Show "Undisclosed" or omit the value line entirely.
**Warning signs:** The mock data already has two null-value deals (deal-005, deal-006).

### Pitfall 3: useFilteredData Company Matching for Deal Parties
**What goes wrong:** Global company filter does not filter deals because deal records use `parties: string[]` not `company: string`.
**Why it happens:** The useFilteredData hook filters on `entry.company` or `entry.id` fields. Deal entries have `parties` (an array of company names), not a single `company` field.
**How to avoid:** The useFilteredData hook's fallback behavior (`if (!companyId) return true`) means deals without a `company` field pass through all filters. This is actually acceptable -- deals are sector-level events that involve multiple companies. If company-level filtering is needed later, extend the filter logic to check if any element of `parties` matches the selected companies.
**Warning signs:** Selecting a single company in the global filter shows all deals (because the `parties` field is not checked).

### Pitfall 4: Radix Tabs Content Mounting
**What goes wrong:** All tab content panels are mounted simultaneously, causing unnecessary DOM nodes.
**Why it happens:** Radix Tabs Content components are mounted by default but hidden via `data-state="inactive"`.
**How to avoid:** This is actually fine for small datasets (8 deals in mock). The DOM cost is trivial. Do NOT add `forceMount` unless there's a specific animation need. The default behavior is correct.
**Warning signs:** Performance profiling shows excessive DOM nodes (unlikely with this data size).

### Pitfall 5: Date Formatting Inconsistency
**What goes wrong:** Deal dates display as raw ISO strings ("2024-11-15") instead of human-readable format.
**Why it happens:** No date formatter exists in the formatters module yet.
**How to avoid:** Create a simple date formatter for this phase. Use `Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" })` for "15 Nov 2024" format. Add to `src/lib/formatters.ts`.
**Warning signs:** Raw ISO dates appearing in the UI.

### Pitfall 6: Promoter Stake TrendDirection Derivation
**What goes wrong:** Hard-coding TrendDirection when the data provides `changePct` as a number.
**Why it happens:** The LeadershipGovernanceData type stores `changePct: number` but TrendIndicator expects `TrendDirection` ("up" | "down" | "flat").
**How to avoid:** Derive direction from `changePct`: positive = "up", negative = "down", zero = "flat". This is a presentation concern, not a data concern -- derive in the component.
**Warning signs:** Incorrect arrow direction for zero-change entries (Havells in mock data has changePct: 0).

### Pitfall 7: AI Risk Flag Severity vs Confidence Type Mismatch
**What goes wrong:** Using different visual treatments for `severity: ConfidenceLevel` on auditor flags vs `confidence: ConfidenceLevel` on AI risk flags.
**Why it happens:** Both use the same `ConfidenceLevel` type ("high" | "medium" | "low") but with different semantic meaning (severity = how bad, confidence = how sure).
**How to avoid:** Use the same ConfidenceBadge component for both, but be aware of the semantic difference. For auditor flags, "high" severity means the flag is serious (negative). For AI patterns, "high" confidence means the AI is confident (positive). The visual treatment (ConfidenceBadge) stays the same -- the surrounding card variant (risk vs pattern) communicates the semantic context.
**Warning signs:** Users confusing "high confidence" AI insight with "high severity" auditor flag.

## Code Examples

### Example 1: Main DealsTransactions Section Component
```tsx
// src/sections/deals/DealsTransactions.tsx
import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import { StatCard } from "../../components/ui/StatCard";
import type { DealsTransactionsData } from "../../types/sections";
import { formatINRCr } from "../../lib/formatters";
import { Tabs } from "radix-ui";

export default function DealsTransactions() {
  const { data, isPending, error } =
    useFilteredData<DealsTransactionsData>("deals");

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data) return null;

  const totalValue = data.deals
    .filter((d) => d.valueCr !== null)
    .reduce((sum, d) => sum + (d.valueCr ?? 0), 0);

  return (
    <div className="p-md space-y-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Deals & Transactions
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-md">
        <StatCard label="Total Deals" value={String(data.deals.length)} />
        <StatCard label="Total Value" value={formatINRCr(totalValue)} />
        <StatCard label="M&A" value={String(data.deals.filter(d => d.type === "M&A").length)} />
        <StatCard label="AI Patterns" value={String(data.aiPatterns.length)} />
      </div>

      {/* Tabbed Timeline */}
      <Tabs.Root defaultValue="all">
        <Tabs.List className="flex gap-xs border-b border-surface-overlay">
          {/* Tab triggers */}
        </Tabs.List>
        <Tabs.Content value="all">
          <DealTimeline deals={data.deals} />
        </Tabs.Content>
        {/* ... per-type tabs */}
      </Tabs.Root>

      {/* AI Patterns */}
      <div className="space-y-sm">
        <h3 className="text-xs font-semibold text-text-primary">AI Pattern Recognition</h3>
        {data.aiPatterns.map((pattern) => (
          <InsightCard
            key={pattern.pattern}
            title={pattern.pattern}
            confidence={pattern.confidence}
            explanation={pattern.explanation}
            variant="pattern"
          />
        ))}
      </div>
    </div>
  );
}
```

### Example 2: Leadership Section with Sub-sections
```tsx
// src/sections/leadership/LeadershipGovernance.tsx
import { useFilteredData } from "../../hooks/use-filtered-data";
import type { LeadershipGovernanceData } from "../../types/sections";

export default function LeadershipGovernance() {
  const { data, isPending, error } =
    useFilteredData<LeadershipGovernanceData>("leadership");

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data) return null;

  return (
    <div className="p-md space-y-md">
      <Header dataAsOf={data.dataAsOf} />

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-md">
        <StatCard label="CXO Changes" value={String(data.cxoChanges.length)} />
        <StatCard label="Board Changes" value={String(data.boardReshuffles.length)} />
        <StatCard label="Promoter Moves" value={String(data.promoterStakeChanges.length)} />
        <StatCard label="Auditor Flags" value={String(data.auditorFlags.length)} />
      </div>

      {/* AI Risk Flags -- shown first for immediate attention */}
      {data.aiRiskFlags.length > 0 && (
        <LeadershipRiskFlags flags={data.aiRiskFlags} />
      )}

      {/* CXO Changes Table */}
      <CxoChangesTable changes={data.cxoChanges} />

      {/* Board Reshuffles */}
      <BoardReshuffles reshuffles={data.boardReshuffles} />

      {/* Promoter Stakes */}
      <PromoterStakes stakes={data.promoterStakeChanges} />

      {/* Auditor Flags */}
      <AuditorFlags flags={data.auditorFlags} />
    </div>
  );
}
```

### Example 3: Date Formatter Addition
```tsx
// Add to src/lib/formatters.ts

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const monthYearFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  year: "numeric",
});

/**
 * Format ISO date string to Indian display format.
 * @example formatDate("2024-11-15") => "15 Nov 2024"
 */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

/**
 * Format ISO date string to month-year only.
 * @example formatMonthYear("2024-11-15") => "Nov 2024"
 */
export function formatMonthYear(isoDate: string): string {
  return monthYearFormatter.format(new Date(isoDate));
}
```

### Example 4: DealTypeBadge Component
```tsx
// src/components/ui/DealTypeBadge.tsx
import clsx from "clsx";

type DealType = "M&A" | "PE/VC" | "IPO" | "distressed";

const config: Record<DealType, { label: string; className: string }> = {
  "M&A": {
    label: "M&A",
    className: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  },
  "PE/VC": {
    label: "PE/VC",
    className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  },
  IPO: {
    label: "IPO",
    className: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  },
  distressed: {
    label: "Distressed",
    className: "bg-negative/10 text-negative border-negative/20",
  },
};

export function DealTypeBadge({ type }: { type: DealType }) {
  const { label, className } = config[type];
  return (
    <span className={clsx(
      "inline-flex items-center px-sm py-xs rounded border text-[10px] font-medium whitespace-nowrap",
      className,
    )}>
      {label}
    </span>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Individual @radix-ui/react-* packages | Unified `radix-ui` package | Late 2025 | Single import source; already adopted in this project |
| react-vertical-timeline-component | Pure CSS / Tailwind | Ongoing | No external dependency; full design control |
| Controlled tabs with URL sync | Uncontrolled Radix Tabs | N/A | Simpler; section-local state, not navigation |
| Custom accordion with useState | Radix Collapsible | N/A | Built-in animation, accessibility, data-state styling |

**Deprecated/outdated:**
- `react-vertical-timeline-component`: Last npm publish was over a year ago. Locked visual styling. Not recommended when Tailwind provides full control.
- Individual `@radix-ui/react-tabs`, `@radix-ui/react-collapsible` packages: Still work but unified `radix-ui` package is the current recommended approach.

## Open Questions

1. **Company filtering for deal records**
   - What we know: The useFilteredData hook filters on `entry.company` field. Deal records use `parties: string[]` instead.
   - What's unclear: Should global company filters apply to deals (matching any party)?
   - Recommendation: For now, accept the default behavior (deals pass through company filter unfiltered). If needed later, extend useFilteredData to check `parties` arrays. Document this as a known limitation.

2. **Deal card expansion/detail view**
   - What we know: Deal cards show rationale truncated to 2 lines (`line-clamp-2`).
   - What's unclear: Should clicking a deal card expand to show full rationale, or is the truncated version sufficient?
   - Recommendation: Use Radix Collapsible on the rationale text. Click to show full text. Minimal implementation cost.

3. **Leadership change grouping**
   - What we know: Context says "compact table layout" and Claude has discretion on grouping.
   - What's unclear: Group by company (all changes for Voltas together) vs. by type (all CXO changes, then all board changes) vs. chronological.
   - Recommendation: Group by type (CXO, Board, Promoter, Auditor as separate sub-sections). This matches the data contract shape (separate arrays per type) and makes scanning easier for consulting partners who care about specific signal types.

## Sources

### Primary (HIGH confidence)
- Project codebase: `src/types/sections.ts` -- DealsTransactionsData, LeadershipGovernanceData type contracts
- Project codebase: `src/data/mock/deals.ts` -- 8 deal records with 3 AI patterns
- Project codebase: `src/data/mock/leadership.ts` -- 4 CXO changes, 3 board reshuffles, 4 promoter stakes, 2 auditor flags, 3 AI risk flags
- Project codebase: `src/components/ui/TrendIndicator.tsx` -- Existing trend direction display
- Project codebase: `src/components/ui/StatCard.tsx` -- Existing stat display card
- Project codebase: `src/hooks/use-filtered-data.ts` -- Existing data fetching + filtering hook
- Project codebase: `src/lib/formatters.ts` -- Existing INR/percentage formatters
- Project codebase: `node_modules/radix-ui/dist/index.d.ts` -- Verified Tabs, Collapsible, Tooltip, Separator exports
- Project codebase: `src/components/filters/SelectFilter.tsx` -- Established Radix import pattern `import { Select } from "radix-ui"`

### Secondary (MEDIUM confidence)
- [Radix Primitives Tabs docs](https://www.radix-ui.com/primitives/docs/components/tabs) -- Tabs API: Root, List, Trigger, Content; defaultValue for uncontrolled mode
- [Radix Primitives Collapsible docs](https://www.radix-ui.com/primitives/docs/components/collapsible) -- Collapsible API: Root, Trigger, Content; `--radix-collapsible-content-height` CSS var
- [Flowbite Tailwind Timeline](https://flowbite.com/docs/components/timeline/) -- `border-l` vertical timeline pattern with Tailwind
- [Cruip Tailwind Timelines](https://cruip.com/3-examples-of-brilliant-vertical-timelines-with-tailwind-css/) -- Pure CSS timeline patterns using pseudo-elements and absolute positioning

### Tertiary (LOW confidence)
- None. All findings verified against codebase or official documentation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- All libraries already installed and proven in Phase 1/2. No new dependencies.
- Architecture: HIGH -- Patterns derived directly from existing codebase conventions (Radix import style, Tailwind utility patterns, component structure).
- Pitfalls: HIGH -- Verified against actual mock data and existing hook implementation. Null value handling confirmed in mock data. Filter behavior confirmed by reading useFilteredData source.

**Research date:** 2026-02-16
**Valid until:** 2026-03-16 (30 days -- stable stack, no moving targets)
