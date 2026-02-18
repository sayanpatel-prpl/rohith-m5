# Phase 1: Foundation and Architecture - Research

**Researched:** 2026-02-15
**Domain:** Multi-tenant React application scaffold with branding, TypeScript contracts, formatting, shared UI primitives, and chart wrappers
**Confidence:** HIGH

## Summary

This phase creates the foundational infrastructure for a multi-tenant industry intelligence report. The core technical challenge is building a runtime-switchable brand theming system using Tailwind CSS v4's `@theme` directive and CSS custom properties, consumed by React components and Recharts chart wrappers. Every subsequent phase depends on this infrastructure being correct.

Tailwind CSS v4 is purpose-built for this use case: its `@theme` directive generates CSS custom properties that map directly to utility classes, and those properties can be overridden at any DOM scope via tenant-specific selectors. Recharts 3.7 accepts CSS `var()` values for `stroke` and `fill` props, making chart theming straightforward. React Router v7 in declarative mode provides the `/:tenantSlug` dynamic segment needed to resolve tenant identity from the URL. The `react-error-boundary` library (v6.1.1) provides section-level error isolation without writing class components.

**Primary recommendation:** Use Tailwind v4 `@theme` for design token definition + `@layer base` with `[data-tenant]` selectors for runtime brand switching + `@custom-variant dark` for dark mode. Define brand configs as static JSON files imported at build time (simplest for adding new tenants). Use React Router v7 declarative mode with `<BrowserRouter>` for the SPA shell.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Full brand kit per tenant: logo, primary/secondary/accent colors, font family, custom favicon -- each instance should feel like the consulting firm's own product
- Dark mode support from day one -- build the light/dark toggle into the theme system architecture
- Kompete-branded default used for development and demo/preview tenant
- Aesthetic: "Bloomberg terminal meets consulting" -- data-dense but polished, professional financial tool with consulting presentation quality
- Information density: HIGH -- minimal padding, compact tables, smaller text. Partners scan fast and want maximum data on screen.
- Section layout: Full-page sections -- each of the 10 modules gets a full page/view, sidebar nav switches between them (not long-scroll single page)
- Navigation: Slim top bar with tenant logo + left sidebar for section navigation. Maximize content area.
- Color palette: Fixed professional palette across all tenants (e.g., blue-teal-gray professional scheme) -- only accent color changes with tenant brand
- Chart annotations: Inline annotations on key data points -- events marked directly on the chart with callout arrows (e.g., "Q3: raw material spike")
- Chart interaction: Hover tooltips + click to drill down into detailed view for a company or metric
- Loading states: Skeleton screens -- content-shaped placeholders that shimmer while loading, reduces layout shift
- Section transitions: Subtle fade-out/fade-in when switching between sections via sidebar nav
- Data recency: Edition badge in header ("February 2026 Edition") + per-section "Data as of Q3 FY25" indicators

### Claude's Discretion
- Brand config storage mechanism (JSON files vs API-delivered)
- Performance indicator visual style (color tags vs directional arrows)
- Error presentation pattern (inline card vs toast + fallback)
- Exact spacing, padding, and typography scale within the high-density constraint
- Skeleton screen shapes and shimmer implementation
- Drill-down view layout when clicking chart elements

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19 | UI framework | Latest stable; `use()` hook enables flexible context consumption |
| Vite | 7 | Build tool + dev server | Sub-second HMR, native ESM, `@tailwindcss/vite` plugin integration |
| TypeScript | 5.x | Type safety | Strict mode for data contracts; discriminated unions for section payloads |
| Tailwind CSS | v4 | Utility CSS + design tokens | `@theme` directive generates CSS custom properties + utilities simultaneously |
| React Router | v7 | Client-side routing | Declarative mode for SPA; `/:tenantSlug` dynamic segments |
| Recharts | 3.7 | Charts | SVG-based; accepts `var()` CSS variables for `stroke`/`fill`; built-in `ReferenceLine`/`ReferenceDot` for annotations |
| Radix UI | latest | Headless primitives | WAI-ARIA compliant; unstyled; tree-shakeable via `radix-ui` package |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-error-boundary | 6.1.1 | Error boundaries | Section-level error isolation; `FallbackComponent` + `resetErrorBoundary` |
| clsx | latest | Conditional classnames | Combining Tailwind classes conditionally |
| @tailwindcss/vite | latest | Vite plugin for Tailwind v4 | Replaces PostCSS setup; auto-detects CSS changes |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Radix UI | shadcn/ui | shadcn adds opinionated styling on top of Radix; we need full brand control, so use Radix directly |
| Recharts | Victory / Nivo | Recharts is simpler API, smaller bundle, accepts CSS vars natively for theming |
| React Router declarative | React Router framework mode | Framework mode adds SSR/file-routing we do not need; declarative is leaner for SPA |
| JSON brand configs | API-delivered configs | JSON files are simpler, no backend dependency, sufficient for <50 tenants |

**Installation:**
```bash
npm create vite@latest industry-landscape -- --template react-ts
cd industry-landscape
npm install react-router react-error-boundary recharts radix-ui clsx
npm install -D @tailwindcss/vite tailwindcss
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  brands/                    # Tenant brand configurations
    types.ts                 # BrandConfig TypeScript interface
    kompete.ts                # Default/demo brand config
    bcg.ts                   # Example tenant config
    index.ts                 # Brand registry (slug -> config map)
  theme/
    tokens.css               # @theme + @layer base tenant overrides + dark mode
    dark-mode.ts             # Dark mode toggle logic (localStorage + system pref)
  types/
    sections.ts              # Discriminated union for all 10 section payloads
    financial.ts             # INR amounts, percentages, basis points types
    company.ts               # Company entity types
    common.ts                # Shared types (TimeRange, DataRecency, etc.)
  lib/
    formatters.ts            # INR Cr/Lakh, percentages, basis points, growth rates
    formatters.test.ts       # Unit tests for formatters
  components/
    brand/
      BrandProvider.tsx      # Context provider; reads URL slug, sets data-tenant attribute
      useBrand.ts            # Hook to access current brand config
    ui/
      StatCard.tsx           # Metric display card with label, value, trend
      TrendIndicator.tsx     # Up/down/flat arrow with color
      PerformanceTag.tsx     # Outperform/Inline/Underperform badge
      SectionSkeleton.tsx    # Shimmer loading placeholder
      EditionBadge.tsx       # "February 2026 Edition" header badge
      DataRecencyTag.tsx     # "Data as of Q3 FY25" indicator
    charts/
      TrendLineChart.tsx     # Line chart wrapper consuming brand tokens
      BarComparisonChart.tsx # Bar chart wrapper consuming brand tokens
      ChartAnnotation.tsx    # Inline annotation with callout arrow (ReferenceDot + custom Label)
      ChartTooltip.tsx       # Custom tooltip component
    layout/
      AppShell.tsx           # Top bar + sidebar + content area
      TopBar.tsx             # Slim header with tenant logo + edition badge
      Sidebar.tsx            # Section navigation with active state
      SectionWrapper.tsx     # Fade transition + error boundary wrapper
    errors/
      SectionErrorFallback.tsx  # Error fallback UI for section boundaries
  app/
    App.tsx                  # BrowserRouter + route definitions
    routes.tsx               # Route config with /:tenantSlug/report nesting
  main.tsx                   # Entry point
```

### Pattern 1: Multi-Tenant Brand Resolution via URL + CSS Custom Properties

**What:** BrandProvider reads `:tenantSlug` from the URL, looks up brand config from a static registry, and sets a `data-tenant` attribute on a wrapper div. Tailwind CSS variables defined in `@layer base` under `[data-tenant="bcg"]` selectors automatically cascade to all children.

**When to use:** Every page render -- BrandProvider wraps the entire app.

**Example:**

```css
/* src/theme/tokens.css */
@import "tailwindcss";

/* Define design tokens as CSS custom properties via @theme */
@theme {
  --color-brand-primary: oklch(0.55 0.15 250);
  --color-brand-secondary: oklch(0.65 0.10 250);
  --color-brand-accent: oklch(0.70 0.12 45);
  --color-surface: oklch(0.99 0 0);
  --color-surface-raised: oklch(0.97 0 0);
  --color-surface-overlay: oklch(0.95 0 0);
  --color-text-primary: oklch(0.15 0 0);
  --color-text-secondary: oklch(0.40 0 0);
  --color-text-muted: oklch(0.55 0 0);
  --color-chart-1: oklch(0.55 0.15 250);
  --color-chart-2: oklch(0.60 0.12 190);
  --color-chart-3: oklch(0.50 0.08 160);
  --color-chart-4: oklch(0.65 0.10 280);
  --color-chart-5: oklch(0.58 0.06 230);
  --color-positive: oklch(0.55 0.15 155);
  --color-negative: oklch(0.55 0.18 25);
  --color-neutral: oklch(0.55 0.02 250);
  --font-body: "Inter", system-ui, sans-serif;
  --font-display: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --text-xs: 0.6875rem;    /* 11px -- high density */
  --text-sm: 0.75rem;      /* 12px */
  --text-base: 0.8125rem;  /* 13px */
  --text-lg: 0.9375rem;    /* 15px */
  --text-xl: 1.125rem;     /* 18px */
  --spacing-xs: 0.125rem;  /* 2px */
  --spacing-sm: 0.25rem;   /* 4px */
  --spacing-md: 0.5rem;    /* 8px */
  --spacing-lg: 0.75rem;   /* 12px */
  --spacing-xl: 1rem;      /* 16px */
}

/* Dark mode variant */
@custom-variant dark (&:where(.dark, .dark *));

/* Dark mode overrides */
@layer base {
  .dark {
    --color-surface: oklch(0.15 0.01 250);
    --color-surface-raised: oklch(0.18 0.01 250);
    --color-surface-overlay: oklch(0.22 0.01 250);
    --color-text-primary: oklch(0.93 0 0);
    --color-text-secondary: oklch(0.70 0 0);
    --color-text-muted: oklch(0.55 0 0);
  }

  /* Tenant overrides -- only accent color changes per brand */
  [data-tenant="bcg"] {
    --color-brand-accent: oklch(0.55 0.18 145);  /* BCG green */
    --font-display: "Georgia", serif;
  }

  [data-tenant="am"] {
    --color-brand-accent: oklch(0.50 0.20 25);   /* A&M red-orange */
    --font-display: "Helvetica Neue", sans-serif;
  }

  [data-tenant="kompete"] {
    --color-brand-accent: oklch(0.60 0.15 260);  /* Kompete blue-purple */
  }
}
```

```tsx
// src/components/brand/BrandProvider.tsx
import { createContext, useEffect, type ReactNode } from "react";
import { useParams } from "react-router";
import { getBrandConfig, type BrandConfig } from "../../brands";

const BrandContext = createContext<BrandConfig | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const brand = getBrandConfig(tenantSlug ?? "kompete");

  useEffect(() => {
    // Set data-tenant attribute for CSS variable cascade
    document.documentElement.setAttribute("data-tenant", brand.slug);
    // Set favicon
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (link) link.href = brand.faviconUrl;
    // Set document title
    document.title = `${brand.displayName} | Industry Landscape`;
  }, [brand]);

  return (
    <div data-tenant={brand.slug}>
      <BrandContext value={brand}>
        {children}
      </BrandContext>
    </div>
  );
}

export { BrandContext };
```

```tsx
// src/components/brand/useBrand.ts
import { use } from "react";
import { BrandContext } from "./BrandProvider";
import type { BrandConfig } from "../../brands/types";

export function useBrand(): BrandConfig {
  const brand = use(BrandContext);
  if (!brand) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return brand;
}
```

### Pattern 2: Brand Config as Static JSON/TypeScript Objects

**What:** Each tenant's brand configuration is a TypeScript object with logo URL, color overrides, font family, display name, and favicon. A registry maps slug to config. No backend needed.

**When to use:** When adding a new tenant (add a file + registry entry).

**Recommendation (Claude's Discretion):** Use static TypeScript files over API-delivered configs. Rationale: no backend dependency during this phase, type safety at compile time, trivial to add new tenants (copy a file, change values, add to registry), and can always migrate to API-delivered later without changing the BrandProvider interface.

```typescript
// src/brands/types.ts
export interface BrandConfig {
  slug: string;
  displayName: string;
  logoUrl: string;
  faviconUrl: string;
  accentColor: string;       // oklch value for CSS override
  fontDisplay: string;        // Font family for headings
  fontBody: string;           // Font family for body text
}
```

```typescript
// src/brands/kompete.ts
import type { BrandConfig } from "./types";

export const kompeteBrand: BrandConfig = {
  slug: "kompete",
  displayName: "Kompete Intelligence",
  logoUrl: "/brands/kompete/logo.svg",
  faviconUrl: "/brands/kompete/favicon.ico",
  accentColor: "oklch(0.60 0.15 260)",
  fontDisplay: "Inter",
  fontBody: "Inter",
};
```

```typescript
// src/brands/index.ts
import { kompeteBrand } from "./kompete";
import type { BrandConfig } from "./types";

const brandRegistry: Record<string, BrandConfig> = {
  kompete: kompeteBrand,
  // Add new tenants here:
  // bcg: bcgBrand,
  // am: amBrand,
};

export function getBrandConfig(slug: string): BrandConfig {
  return brandRegistry[slug] ?? kompeteBrand; // Fallback to Kompete
}

export type { BrandConfig };
```

### Pattern 3: Section-Level Error Boundaries

**What:** Each report section is wrapped in an `ErrorBoundary` from `react-error-boundary`. If a section throws, the error is caught and a fallback UI displays without crashing other sections.

**Recommendation (Claude's Discretion -- Error Presentation):** Use inline error card (not toast). Rationale: for a data-dense dashboard, a toast disappears and the user loses context about which section failed. An inline card stays visible, shows what went wrong, and offers a retry button. This matches the "Bloomberg terminal" aesthetic where each panel is independent.

```tsx
// src/components/errors/SectionErrorFallback.tsx
import type { FallbackProps } from "react-error-boundary";

export function SectionErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-48
                    bg-surface-raised rounded border border-negative/20 p-lg">
      <p className="text-text-secondary text-sm font-medium mb-sm">
        Unable to load this section
      </p>
      <p className="text-text-muted text-xs mb-md font-mono">
        {error.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="text-xs px-md py-xs rounded bg-brand-primary text-white
                   hover:opacity-90 transition-opacity"
      >
        Retry
      </button>
    </div>
  );
}
```

```tsx
// src/components/layout/SectionWrapper.tsx
import { ErrorBoundary } from "react-error-boundary";
import { SectionErrorFallback } from "../errors/SectionErrorFallback";
import type { ReactNode } from "react";

interface SectionWrapperProps {
  sectionKey: string;
  children: ReactNode;
}

export function SectionWrapper({ sectionKey, children }: SectionWrapperProps) {
  return (
    <ErrorBoundary
      FallbackComponent={SectionErrorFallback}
      resetKeys={[sectionKey]}
    >
      <div className="animate-fade-in h-full overflow-auto">
        {children}
      </div>
    </ErrorBoundary>
  );
}
```

### Pattern 4: Recharts Chart Wrappers Consuming Brand Tokens

**What:** Thin wrapper components around Recharts that read CSS custom properties via `var()` for all colors. Charts automatically re-theme when the tenant changes.

```tsx
// src/components/charts/TrendLineChart.tsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceDot,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import type { ChartAnnotation } from "../../types/common";

interface TrendLineChartProps {
  data: Array<Record<string, unknown>>;
  lines: Array<{ dataKey: string; colorVar: string; label: string }>;
  xDataKey: string;
  annotations?: ChartAnnotation[];
  onPointClick?: (dataKey: string, payload: Record<string, unknown>) => void;
}

export function TrendLineChart({
  data, lines, xDataKey, annotations, onPointClick
}: TrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-text-muted)"
          opacity={0.15}
        />
        <XAxis
          dataKey={xDataKey}
          tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
          axisLine={{ stroke: "var(--color-text-muted)", opacity: 0.3 }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
          axisLine={{ stroke: "var(--color-text-muted)", opacity: 0.3 }}
        />
        <Tooltip content={<ChartTooltip />} />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.label}
            stroke={`var(${line.colorVar})`}
            strokeWidth={2}
            dot={{ r: 3, fill: `var(${line.colorVar})` }}
            activeDot={{
              r: 5,
              onClick: (_e: unknown, payload: unknown) =>
                onPointClick?.(line.dataKey, payload as Record<string, unknown>),
            }}
          />
        ))}
        {annotations?.map((ann) => (
          <ReferenceDot
            key={ann.key}
            x={ann.x}
            y={ann.y}
            r={4}
            fill="var(--color-brand-accent)"
            stroke="var(--color-surface)"
            strokeWidth={2}
            label={{
              value: ann.label,
              position: "top",
              fill: "var(--color-text-primary)",
              fontSize: 10,
              fontWeight: 600,
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### Pattern 5: Dark Mode Toggle with localStorage Persistence

**What:** Three-way toggle (light / dark / system) stored in localStorage. On load, determine preference and set `.dark` class on `<html>`. Tailwind's `@custom-variant dark` activates the dark overrides.

```typescript
// src/theme/dark-mode.ts
type ThemePreference = "light" | "dark" | "system";

export function getStoredTheme(): ThemePreference {
  const stored = localStorage.getItem("theme-preference");
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

export function applyTheme(preference: ThemePreference): void {
  const isDark =
    preference === "dark" ||
    (preference === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem("theme-preference", preference);
}

export function initTheme(): void {
  applyTheme(getStoredTheme());

  // Listen for system preference changes when in "system" mode
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getStoredTheme() === "system") {
      applyTheme("system");
    }
  });
}
```

### Pattern 6: Indian Financial Number Formatters

**What:** Centralized formatters using `Intl.NumberFormat` with `en-IN` locale for Indian grouping (##,##,###). Custom logic for Crore/Lakh abbreviation, basis points, and growth rates.

```typescript
// src/lib/formatters.ts
const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const indianNumberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

/** Format amount in INR Crore (e.g., 1500 Cr -> "INR 1,500 Cr") */
export function formatINRCr(amountInCr: number): string {
  if (Math.abs(amountInCr) >= 100) {
    return `INR ${indianNumberFormatter.format(Math.round(amountInCr))} Cr`;
  }
  return `INR ${indianNumberFormatter.format(amountInCr)} Cr`;
}

/** Format amount in INR Lakh (e.g., 45.2 -> "INR 45.2 L") */
export function formatINRLakh(amountInLakh: number): string {
  return `INR ${indianNumberFormatter.format(amountInLakh)} L`;
}

/** Auto-format: picks Cr or L based on magnitude (input in Cr) */
export function formatINRAuto(amountInCr: number): string {
  if (Math.abs(amountInCr) < 1) {
    return formatINRLakh(amountInCr * 100);
  }
  return formatINRCr(amountInCr);
}

/** Format percentage with sign (e.g., 12.5 -> "+12.5%", -3.2 -> "-3.2%") */
export function formatPercent(value: number, decimals = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/** Format basis points (e.g., 180 -> "+180 bps", -50 -> "-50 bps") */
export function formatBps(bps: number): string {
  const sign = bps > 0 ? "+" : "";
  return `${sign}${Math.round(bps)} bps`;
}

/** Format growth rate (e.g., 0.125 -> "+12.5% YoY") */
export function formatGrowthRate(rate: number, period: "QoQ" | "YoY" = "YoY"): string {
  return `${formatPercent(rate * 100)} ${period}`;
}

/** Format large numbers with Indian grouping (no currency symbol) */
export function formatIndianNumber(value: number): string {
  return indianNumberFormatter.format(value);
}
```

### Anti-Patterns to Avoid
- **Hardcoded colors in chart components:** Never use hex values directly. Always reference `var(--color-*)` so tenant switching works.
- **Global CSS overrides for tenant branding:** Do not use `!important` or global selectors. The `data-tenant` scoped approach cascades naturally.
- **Inline dark mode checks in components:** Do not write `isDark ? 'bg-black' : 'bg-white'` in component code. Use Tailwind's `dark:` variant exclusively so the toggle just adds/removes the `.dark` class.
- **Mutable formatter instances:** Create `Intl.NumberFormat` instances once at module scope, not inside render functions (they are expensive to construct).
- **Putting brand config in React state:** Brand config should live in context, not in useState/Zustand. It changes rarely (only on URL navigation) and should not trigger unnecessary re-renders.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Error boundaries | Class component ErrorBoundary | `react-error-boundary` v6.1.1 | Provides `resetErrorBoundary`, `resetKeys`, `onError` callback; avoids class components |
| INR grouping (lakhs/crores) | Custom regex for Indian comma placement | `Intl.NumberFormat("en-IN")` | Browser-native, handles edge cases, locale-aware |
| Dark mode toggle | Custom CSS class management | Tailwind `@custom-variant dark` + localStorage pattern | Standard pattern, no flash on load, system preference detection |
| Headless UI primitives | Custom accessible tooltip/dropdown | Radix UI primitives | WAI-ARIA compliance is extremely hard to get right; Radix handles focus management, keyboard navigation, screen readers |
| Conditional classnames | Template literal concatenation | `clsx` | Handles falsy values, arrays, objects cleanly |
| Chart SVG rendering | Custom D3-based charts | Recharts 3.7 wrappers | Recharts handles responsive containers, animations, tooltips; layer our brand tokens on top |
| CSS design tokens | JavaScript theme objects applied via style prop | Tailwind `@theme` directive | Generates both CSS variables AND utility classes; single source of truth |

**Key insight:** The Tailwind v4 `@theme` directive is the critical enabler. It creates CSS custom properties that are simultaneously available as utility classes (e.g., `bg-brand-primary`) and as `var()` references for Recharts. This means one token definition serves both Tailwind utilities and SVG chart styling.

## Common Pitfalls

### Pitfall 1: Tailwind @theme Variables Cannot Be Nested Under Selectors
**What goes wrong:** Attempting to define tenant-specific tokens inside `@theme` under a `[data-tenant]` selector. The `@theme` directive is top-level only.
**Why it happens:** Confusion between `@theme` (token definition) and `@layer base` (variable overrides).
**How to avoid:** Define ALL tokens once in `@theme`. Override their values in `@layer base` under scoped selectors.
**Warning signs:** Build error: "@theme rules must be at the top level".

### Pitfall 2: Recharts SVG Does Not Inherit CSS `color` Property
**What goes wrong:** Setting `color: var(--color-brand-primary)` on a parent div expecting Recharts to inherit it.
**Why it happens:** SVG uses `fill` and `stroke`, not CSS `color`. Recharts components are SVG elements.
**How to avoid:** Pass `var()` values explicitly to `stroke`, `fill`, and `tick.fill` props on each Recharts component.
**Warning signs:** Charts render in black regardless of theme.

### Pitfall 3: CSS Custom Property Values Are Strings in JavaScript
**What goes wrong:** Trying to do arithmetic with `getComputedStyle().getPropertyValue()` results.
**Why it happens:** CSS custom properties return string values.
**How to avoid:** For formatters and logic, use TypeScript values directly. CSS variables are for styling only, not computation.
**Warning signs:** `NaN` in calculations involving theme values.

### Pitfall 4: Dark Mode Flash on Page Load
**What goes wrong:** Page briefly renders in light mode before JavaScript toggles the `.dark` class.
**Why it happens:** JavaScript runs after initial render.
**How to avoid:** Add a blocking `<script>` in `index.html` `<head>` that reads localStorage and sets `.dark` class before React hydrates.
**Warning signs:** Brief white flash when loading in dark mode.

### Pitfall 5: Indian Number Formatting Browser Inconsistencies
**What goes wrong:** Some older browsers do not correctly apply Indian grouping (3,2,2 pattern) with `en-IN`.
**Why it happens:** ICU data completeness varies.
**How to avoid:** Test with a fixed set of known values. The project targets modern browsers (consulting firm desktops), so this is low risk. Add a unit test that verifies `formatINRCr(1500)` outputs `"INR 1,500 Cr"`.
**Warning signs:** Numbers showing 3-digit grouping (1,500) instead of Indian grouping (only visible with larger numbers like 1,50,000).

### Pitfall 6: React Router Tenant Slug Mismatch
**What goes wrong:** User navigates to `/unknown-slug/report` and the app crashes because no brand config exists.
**Why it happens:** No fallback in brand registry lookup.
**How to avoid:** `getBrandConfig()` returns Kompete default for unknown slugs. Never throw on missing tenant.
**Warning signs:** White screen on unknown URLs.

### Pitfall 7: Recharts ResponsiveContainer Height
**What goes wrong:** Chart renders with zero height in flex layouts.
**Why it happens:** `ResponsiveContainer` needs an explicit height or a parent with defined height.
**How to avoid:** Always set `height` prop on `ResponsiveContainer` (e.g., `height={240}`) OR ensure the parent has `h-[value]`.
**Warning signs:** Chart area is invisible but tooltip cursor moves when hovering.

## Code Examples

### Vite Configuration with Tailwind v4
```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
});
```

### App Shell with React Router (Declarative Mode)
```tsx
// src/app/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { BrandProvider } from "../components/brand/BrandProvider";
import { AppShell } from "../components/layout/AppShell";

const SECTION_ROUTES = [
  { path: "executive", label: "Executive Snapshot" },
  { path: "market-pulse", label: "Market Pulse" },
  { path: "financial", label: "Financial Performance" },
  { path: "deals", label: "Deals & Transactions" },
  { path: "operations", label: "Operational Intelligence" },
  { path: "leadership", label: "Leadership & Governance" },
  { path: "competitive", label: "Competitive Moves" },
  { path: "deep-dive", label: "Sub-Sector Deep Dive" },
  { path: "action-lens", label: "Action Lens" },
  { path: "watchlist", label: "Watchlist & Forward Indicators" },
] as const;

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:tenantSlug/report" element={<BrandProvider><AppShell sections={SECTION_ROUTES} /></BrandProvider>}>
          {/* Section routes will be added in Phase 2+ */}
          <Route index element={<Navigate to="executive" replace />} />
          {/* Placeholder routes for each section */}
          {SECTION_ROUTES.map((s) => (
            <Route key={s.path} path={s.path} element={<div>Placeholder: {s.label}</div>} />
          ))}
        </Route>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/kompete/report" replace />} />
        <Route path="*" element={<Navigate to="/kompete/report" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Skeleton Shimmer Component
**Recommendation (Claude's Discretion):** Use Tailwind's built-in `animate-pulse` for the shimmer effect. It is simple, requires no custom CSS, and works well for content-shaped placeholders. Shape the skeletons to match each section's actual layout to minimize CLS.

```tsx
// src/components/ui/SectionSkeleton.tsx
interface SectionSkeletonProps {
  variant: "table" | "chart" | "cards" | "mixed";
}

export function SectionSkeleton({ variant }: SectionSkeletonProps) {
  if (variant === "table") {
    return (
      <div className="space-y-xs p-md animate-pulse">
        {/* Header row */}
        <div className="flex gap-md">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 bg-surface-overlay rounded flex-1" />
          ))}
        </div>
        {/* Data rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-md py-xs">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="h-2.5 bg-surface-overlay rounded flex-1 opacity-60" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className="p-md animate-pulse">
        <div className="h-3 w-32 bg-surface-overlay rounded mb-md" />
        <div className="h-60 bg-surface-overlay rounded" />
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="grid grid-cols-4 gap-md p-md animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-surface-overlay rounded" />
        ))}
      </div>
    );
  }

  // mixed
  return (
    <div className="p-md animate-pulse space-y-md">
      <div className="grid grid-cols-4 gap-md">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-surface-overlay rounded" />
        ))}
      </div>
      <div className="h-48 bg-surface-overlay rounded" />
      <div className="space-y-xs">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-2.5 bg-surface-overlay rounded" />
        ))}
      </div>
    </div>
  );
}
```

### Performance Indicator Component
**Recommendation (Claude's Discretion):** Use color-coded tags with directional arrows. Combine visual redundancy (color + icon + label) for quick scanning in a high-density layout. This matches consulting firm conventions and is accessible (not color-only).

```tsx
// src/components/ui/PerformanceTag.tsx
import clsx from "clsx";

type PerformanceLevel = "outperform" | "inline" | "underperform";

interface PerformanceTagProps {
  level: PerformanceLevel;
  compact?: boolean;
}

const config: Record<PerformanceLevel, { label: string; arrow: string; className: string }> = {
  outperform: {
    label: "Outperform",
    arrow: "\u25B2", // triangle up
    className: "bg-positive/10 text-positive border-positive/20",
  },
  inline: {
    label: "Inline",
    arrow: "\u25C6", // diamond
    className: "bg-neutral/10 text-neutral border-neutral/20",
  },
  underperform: {
    label: "Underperform",
    arrow: "\u25BC", // triangle down
    className: "bg-negative/10 text-negative border-negative/20",
  },
};

export function PerformanceTag({ level, compact }: PerformanceTagProps) {
  const { label, arrow, className } = config[level];
  return (
    <span className={clsx(
      "inline-flex items-center gap-xs rounded border px-sm py-xs text-xs font-medium whitespace-nowrap",
      className,
    )}>
      <span className="text-[10px]">{arrow}</span>
      {!compact && <span>{label}</span>}
    </span>
  );
}
```

### Dark Mode Prevention Script (in index.html)
```html
<!-- index.html -->
<head>
  <script>
    // Prevent dark mode flash: run before React renders
    (function() {
      var pref = localStorage.getItem('theme-preference');
      var isDark = pref === 'dark' ||
        (pref !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) document.documentElement.classList.add('dark');
    })();
  </script>
</head>
```

### Section Fade Transition CSS
```css
/* In tokens.css -- simple fade animation for section switching */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@theme {
  --animate-fade-in: fade-in 200ms ease-out;
}
```

### TypeScript Data Contract Structure (Discriminated Union)
```typescript
// src/types/sections.ts

/** Base for all section data payloads */
interface SectionDataBase {
  dataAsOf: string;           // "Q3 FY25"
  lastUpdated: string;        // ISO date
}

/** Executive Snapshot section payload */
export interface ExecutiveSnapshotData extends SectionDataBase {
  section: "executive-snapshot";
  bullets: Array<{
    text: string;
    theme: string;
    significance: "high" | "medium" | "low";
  }>;
  redFlags: Array<{
    company: string;
    signal: string;
    confidence: "high" | "medium" | "low";
    explanation: string;
  }>;
}

/** Financial Performance section payload */
export interface FinancialPerformanceData extends SectionDataBase {
  section: "financial-performance";
  companies: Array<{
    id: string;
    name: string;
    ticker: string;
    metrics: {
      revenueGrowthYoY: number;     // decimal (0.125 = 12.5%)
      ebitdaMargin: number;          // decimal
      workingCapitalDays: number;    // integer
      roce: number;                  // decimal
      debtEquity: number;            // decimal ratio
    };
    performance: "outperform" | "inline" | "underperform";
    varianceAnalysis: string;        // AI-generated narrative
    source: string;                  // "BSE filing Q3 FY25"
  }>;
}

// ... similar interfaces for all 10 sections

/** Discriminated union of all section data */
export type SectionData =
  | ExecutiveSnapshotData
  | FinancialPerformanceData
  // | MarketPulseData
  // | DealsTransactionsData
  // | OperationalIntelligenceData
  // | LeadershipGovernanceData
  // | CompetitiveMovesData
  // | SubSectorDeepDiveData
  // | ActionLensData
  // | WatchlistData
  ;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` (JavaScript) | `@theme` directive in CSS | Tailwind v4 (Jan 2025) | Theme tokens live in CSS, not JS; generates both utilities and CSS vars |
| PostCSS + autoprefixer for Tailwind | `@tailwindcss/vite` plugin | Tailwind v4 | No PostCSS config needed for Vite projects |
| `darkMode: 'selector'` in config | `@custom-variant dark (...)` in CSS | Tailwind v4 | Dark mode config moves to CSS alongside theme |
| `useContext(ThemeContext)` | `use(ThemeContext)` (React 19) | React 19 (Dec 2024) | Can be called conditionally; more flexible |
| `react-error-boundary` v4 | `react-error-boundary` v6.1.1 | Feb 2026 | Function component based; React 19 compatible |
| Recharts v2 `Customized` component | Direct children in chart tree (v3) | Recharts 3.0 (2024) | SVG children render directly, no wrapper needed |
| RGB channel trick for opacity | `oklch()` color format | Tailwind v4 | Any color format accepted; `oklch` gives perceptual uniformity |
| `react-router-dom` import | `react-router` import (v7) | React Router v7 | Single package; dom-specific entry auto-detected |

**Deprecated/outdated:**
- `tailwind.config.js`: Still supported in v4 but not recommended for new projects. Use CSS-first config.
- `react-router-dom`: Merged into `react-router` in v7. Import from `react-router` directly.
- Recharts `Customized` component: Removed in v3; render custom SVG elements directly as children.
- Recharts `alwaysShow` and `isFront` props on Reference components: Removed in v3.

## Open Questions

1. **Recharts CSS Variable Reactivity**
   - What we know: Recharts accepts `var()` values for `stroke` and `fill` props at render time.
   - What's unclear: Whether changing the CSS variable value at runtime (e.g., switching tenant) causes the SVG to repaint without a React re-render. Since `var()` is a CSS value, the browser should handle repaint, but SVG behavior may differ.
   - Recommendation: Verify with a test during implementation. If repainting does not occur, force a re-render by keying the chart component on `tenantSlug`.

2. **View Transitions API for Section Switching**
   - What we know: React 19 canary has `<ViewTransition>` component with built-in cross-fade. CSS View Transition API is supported in Chrome and Safari.
   - What's unclear: Whether this is stable enough for production use. The React API is in canary, not stable.
   - Recommendation: Use CSS `@keyframes fade-in` animation on section mount for now (proven, simple). Upgrade to View Transitions API when it reaches React stable release.

3. **Custom Fonts Loading Performance**
   - What we know: Each tenant may specify a different font family.
   - What's unclear: Optimal font loading strategy when fonts change on tenant switch.
   - Recommendation: Use `font-display: swap` and preload Kompete's default font. Tenant-specific fonts load on-demand. This is acceptable because tenant switches are rare (users stay in one tenant's instance).

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme) - `@theme` directive, CSS custom property namespaces, utility generation
- [Tailwind CSS v4 Dark Mode](https://tailwindcss.com/docs/dark-mode) - `@custom-variant dark` syntax, class-based toggle
- [Tailwind CSS v4 Announcement](https://tailwindcss.com/blog/tailwindcss-v4) - CSS-first config, Vite plugin, Lightning CSS engine
- [React Router v7 Modes](https://reactrouter.com/start/modes) - Declarative, Data, and Framework modes
- [React Router v7 SPA Setup](https://reactrouter.com/how-to/spa) - SPA mode configuration with Vite
- [React Router v7 Routing](https://reactrouter.com/start/framework/routing) - Nested routes, dynamic segments, layout routes
- [Recharts 3.0 Migration Guide](https://github.com/recharts/recharts/wiki/3.0-migration-guide) - Breaking changes from v2 to v3
- [react-error-boundary GitHub](https://github.com/bvaughn/react-error-boundary) - v6.1.1 API: FallbackComponent, resetErrorBoundary, resetKeys
- [Radix UI Primitives](https://www.radix-ui.com/primitives/docs/overview/getting-started) - Installation, compound component API
- [MDN Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) - `en-IN` locale for Indian number grouping
- [React 19 `use()` Hook](https://react.dev/reference/react/use) - Conditional context consumption

### Secondary (MEDIUM confidence)
- [Wawand.co Multi-Portal Tailwind v4](https://wawand.co/blog/posts/managing-multiple-portals-with-tailwind/) - `[data-tenant]` scoped CSS variable overrides pattern
- [Simon Swiss Tailwind v4 Multi-Theme](https://simonswiss.com/posts/tailwind-v4-multi-theme) - `data-theme` attribute + `@layer base` overrides
- [Recharts CSS Variable Integration](https://www.reshaped.so/docs/getting-started/guidelines/recharts) - Using `var()` for stroke/fill in Recharts
- [React View Transitions](https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more) - ViewTransition API status (canary)

### Tertiary (LOW confidence)
- Recharts `ReferenceDot` with custom Label for inline annotations - Multiple GitHub issues and CodeSandbox examples, but no official v3 guide specifically covering callout arrow pattern. Will need implementation testing.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified with official docs and npm; versions confirmed
- Architecture: HIGH - Multi-tenant theming pattern verified across multiple official and community sources; CSS variable approach is the documented Tailwind v4 way
- Pitfalls: HIGH - Each pitfall sourced from official docs or confirmed community issues
- Chart theming with CSS vars: MEDIUM - Confirmed `var()` works for stroke/fill but runtime reactivity on var change needs testing
- Inline chart annotations: MEDIUM - ReferenceDot + custom Label is the right API but callout arrow styling needs custom SVG work

**Research date:** 2026-02-15
**Valid until:** 2026-03-15 (stable ecosystem; 30-day validity)
