# Stack Research

**Domain:** Interactive Industry Intelligence Dashboard / Report Platform
**Researched:** 2026-02-15
**Confidence:** HIGH (core stack constrained + versions verified via npm registry)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | ^19.2.4 | UI framework | Constrained by project requirements. React 19 stable with use() hook, Actions, and improved Suspense -- all useful for async data loading in dashboard modules. Verified: all recommended libraries support React 19 peer dependency. |
| TypeScript | ^5.9.3 | Type safety | Constrained. Critical for a data-heavy product: typed JSON data contracts prevent runtime errors when backend schema changes. Use strict mode. |
| Vite | ^7.3.1 | Build tool | Constrained. Vite 7 is current stable. Use with `@vitejs/plugin-react` v5.1.4 and `@tailwindcss/vite` v4.1.18 (verified: supports Vite 5/6/7). Fast HMR essential for iterating on 10+ dashboard modules. |
| Tailwind CSS | ^4.1.18 | Styling | Constrained. v4 uses CSS-first configuration (no tailwind.config.js). CSS custom properties (`@theme`) are the theming mechanism -- this is the foundation for multi-tenant white-labeling. |
| React Router | ^7.13.0 | Routing | Stratist uses v7. Data router APIs (loaders, actions) useful for pre-fetching module data. Supports React 19 (peer dep: >=18). |

### Data Visualization

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| Recharts | ^3.7.0 | Charts (line, bar, area, pie, radar, scatter, treemap) | Proven in Stratist. Declarative React components, built on D3. Supports React 19 explicitly (`^19.0.0` in peer deps). Best developer experience for the chart types this product needs: financial trend lines, margin comparisons, market share pie charts, revenue bar charts. Composable -- custom tooltips, reference lines, and brush zoom are straightforward. |

**Why Recharts over alternatives:**

| Library | Why Not for This Project |
|---------|------------------------|
| Nivo (@nivo/core v0.99.0) | Better for statistical/scientific viz. Heavier bundle. Pre-styled components clash with Tailwind + white-label theming. |
| Victory | Smaller ecosystem, less community momentum. Recharts has more examples for financial dashboards. |
| D3 (raw) | Too low-level for a 10-module dashboard. Recharts wraps D3 with React components -- use D3 directly only if you need a custom viz Recharts cannot do. |
| Tremor | Opinionated UI kit, not just charts. Fights with custom design system. Good for internal tools, wrong for branded client-facing reports. |
| Chart.js / react-chartjs-2 | Canvas-based, not SVG. Harder to style consistently with CSS variables for white-labeling. Less composable than Recharts. |
| Apache ECharts | Powerful but imperative API. React wrappers are thin. Overkill unless you need 3D or geographic maps. |

### Data Tables

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| @tanstack/react-table | ^8.21.3 | Headless data tables | Financial Performance Tracker needs sortable, filterable tables for 15-20 companies with 10+ metrics each. Headless = full Tailwind styling control. Supports sorting, filtering, pagination, column pinning, row expansion. React >=16.8 peer dep. Bring your own UI -- pairs perfectly with white-label theming. |

**Why headless over pre-styled:**
Ant Design Tables (used in Stratist) come with built-in styles that fight Tailwind and make white-labeling harder. TanStack Table gives you the logic (sorting, filtering, column management) with zero UI opinions -- you build the `<table>` with Tailwind classes that respond to CSS custom properties per tenant.

### State Management & Data Fetching

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| @tanstack/react-query | ^5.90.21 | Server state / data fetching | This product fetches JSON data from Express/Supabase backend. TanStack Query handles caching, stale-while-revalidate, background refetch, and loading/error states. Eliminates hand-rolled useEffect fetch patterns. Supports React 19 (`^18 \|\| ^19`). |
| Zustand | ^5.0.11 | Client state | Lightweight (1.1KB). For UI state: active filters, selected company, current time period, sidebar state. NOT for server data (that belongs in TanStack Query). Supports React >=18.0.0. Simpler than Redux, more predictable than Context for shared state. |

**Why not Redux Toolkit:** Overkill for this product. The server state is handled by TanStack Query. The remaining client state (filters, selections, UI toggles) is small enough for Zustand. Redux adds ceremony (slices, dispatch, selectors) without proportional benefit here.

**Why not Context API alone:** Context triggers full subtree re-renders on state change. With 10+ modules reading filter state, this becomes a performance issue. Zustand uses external stores with selective subscriptions -- only components reading changed state re-render.

### UI Primitives (Headless)

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| Radix UI (primitives) | ^1.x-2.x | Accessible headless components | Use individual packages: `@radix-ui/react-dialog` (v1.1.15), `@radix-ui/react-popover` (v1.1.15), `@radix-ui/react-tooltip` (v1.2.8), `@radix-ui/react-select` (v2.2.6). Fully accessible, unstyled, composable. Style with Tailwind. All support React 19. |

**Why Radix over Headless UI:** Radix has broader component coverage (dialog, popover, tooltip, select, dropdown-menu, tabs, accordion, hover-card). Headless UI covers fewer primitives. Both are headless and Tailwind-compatible, but Radix gives you more components you will need across 10 dashboard modules.

**Why NOT Ant Design (antd) for this project:** Stratist uses antd v6.3.0 but this project should NOT. Reasons:
1. **White-label theming:** antd uses CSS-in-JS (cssinjs) with its own token system. Layering Tailwind + antd tokens + per-tenant CSS variables creates three competing style systems.
2. **Bundle size:** antd imports pull in significant JS even with tree-shaking.
3. **Design consistency:** antd has strong visual opinions. Consulting firm branding requires full visual control -- headless primitives + Tailwind give that.

### Icons

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| Lucide React | ^0.564.0 | Icon library | Already used in Stratist. Tree-shakeable, consistent style, 1500+ icons covering business/financial domain well. Each icon is an individual ESM import -- no bundle bloat. |

### Animations

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| Motion (framer-motion) | ^12.34.0 | Layout animations, transitions | Use for module transitions, chart entry animations, expandable sections. `motion` is the current package name (framer-motion renamed). Supports React 19 (`^18.0.0 \|\| ^19.0.0`). Use sparingly -- this is a data-dense product, not a marketing site. |

**Guidance:** Prefer CSS transitions (Tailwind's `transition-*` classes) for simple hover/focus effects. Reserve Motion for: layout animations (AnimatePresence for module switching), staggered chart entry, expandable card reveals.

### Utility Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | ^2.1.1 | Conditional class names | Every component. `clsx('base', isActive && 'active-class')`. Tiny (< 1KB). |
| tailwind-merge | ^3.4.1 | Merge conflicting Tailwind classes | Component props that accept className overrides. Prevents `p-4 p-2` conflicts. Use via a `cn()` helper combining clsx + tailwind-merge. |
| date-fns | ^4.1.0 | Date formatting/manipulation | Monthly report dates, time period labels, "last updated" timestamps. Tree-shakeable (import only functions you use). |
| numeral | ^2.0.6 | Number formatting | Financial metrics: revenue (INR Cr), margins (%), growth rates. Format: `numeral(12345.67).format('0,0.00')`. Handles Indian numbering with custom locale. |

### Export / Print

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-to-print | ^3.2.0 | Print-friendly report export | Already in Stratist. Triggers browser print dialog for any React component tree. Use for "Download as PDF" via browser print-to-PDF. Supports React 19 (`~19` in peer deps). |
| html-to-image | ^1.11.13 | Screenshot individual charts/modules | "Export chart as PNG" feature. Better maintained than html2canvas. Uses modern APIs (foreignObject SVG rendering). |

**Why not jsPDF + html2canvas:** react-to-print leverages native browser print, which produces higher quality PDFs with proper pagination. jsPDF + html2canvas renders to canvas then to PDF -- lower quality, font issues, and SVG chart rendering problems. Use native print path.

### Development Tools

| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| @vitejs/plugin-react | ^5.1.4 | Vite React integration | Fast Refresh, JSX transform |
| @tailwindcss/vite | ^4.1.18 | Tailwind CSS Vite plugin | v4 uses this instead of PostCSS plugin. Verified: supports Vite 7. |
| ESLint | ^9.39+ | Linting | Use flat config (eslint.config.js). Stratist already on ESLint 9. |
| @eslint/js | ^9.39+ | ESLint core rules | Flat config base |
| typescript-eslint | ^8.55.0 | TypeScript ESLint rules | Type-aware linting for strict TS |
| Prettier | ^3.8.1 | Code formatting | Consistent formatting across team |

## Installation

```bash
# Core framework (constrained)
npm install react@^19.2.4 react-dom@^19.2.4 react-router-dom@^7.13.0

# Data visualization
npm install recharts@^3.7.0

# Data tables
npm install @tanstack/react-table@^8.21.3

# State management & data fetching
npm install @tanstack/react-query@^5.90.21 zustand@^5.0.11

# UI primitives (install only what you need per module)
npm install @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-tooltip @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-accordion

# Icons
npm install lucide-react@^0.564.0

# Animations (add when needed, not day 1)
npm install motion@^12.34.0

# Utilities
npm install clsx@^2.1.1 tailwind-merge@^3.4.1 date-fns@^4.1.0 numeral@^2.0.6

# Export
npm install react-to-print@^3.2.0 html-to-image@^1.11.13

# Dev dependencies
npm install -D typescript@^5.9.3 vite@^7.3.1 @vitejs/plugin-react@^5.1.4 tailwindcss@^4.1.18 @tailwindcss/vite@^4.1.18

# Dev tooling
npm install -D eslint@^9.39.1 @eslint/js@^9.39.1 typescript-eslint@^8.55.0 prettier@^3.8.1 @types/react@^19.2.5 @types/react-dom@^19.2.3
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Recharts | @nivo/bar, @nivo/line | If you need heatmaps or calendar charts that Recharts lacks natively. Nivo has excellent heatmap support. Consider for Sub-Sector Deep Dive heatmap if Recharts treemap is insufficient. |
| @tanstack/react-table | AG Grid Community | If you need Excel-like grid features (inline editing, cell ranges, clipboard). Overkill for read-only financial tables in this product. |
| Zustand | Jotai | If state becomes heavily interdependent atoms. Jotai's atom model is better for many small independent states. Zustand is better for a few coherent stores (filters, UI state). |
| Radix UI | Headless UI | If you want fewer dependencies. Headless UI covers dialog, popover, menu, listbox, combobox, tabs, disclosure. Enough for many projects, but Radix gives tooltip, hover-card, and accordion out of the box. |
| react-to-print | @react-pdf/renderer (v4.3.2) | If you need pixel-perfect branded PDF layouts different from screen layout. react-to-print prints what's on screen; @react-pdf/renderer builds PDFs from scratch with its own layout engine. Adds significant complexity. Only if consulting clients demand specific PDF formatting. |
| numeral | Intl.NumberFormat (built-in) | If you want zero-dependency number formatting. `Intl.NumberFormat('en-IN')` handles Indian numbering natively. Numeral adds custom format strings and is more ergonomic for varied financial formats, but Intl is built-in and sufficient for basic INR formatting. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Ant Design (antd) | Three competing style systems (antd tokens + Tailwind + tenant CSS vars). Bundle bloat. Fights white-label theming. Stratist uses it but this project has different requirements. | Radix UI primitives + Tailwind CSS. Full visual control for branded instances. |
| Redux Toolkit | Ceremony overhead (slices, dispatch, selectors) for simple client state. Server state belongs in TanStack Query, not Redux. | Zustand for client state, TanStack Query for server state. |
| Styled Components / Emotion | CSS-in-JS adds runtime cost and conflicts with Tailwind v4's CSS-first approach. Cannot leverage Tailwind's `@theme` for white-labeling. | Tailwind CSS v4 with CSS custom properties for theming. |
| Material UI (MUI) | Same problem as antd -- opinionated visual system that fights custom branding. Even heavier bundle. | Radix UI + Tailwind. |
| Chart.js / react-chartjs-2 | Canvas-based rendering. Cannot style chart elements with CSS variables for white-labeling. SVG (Recharts) allows CSS-driven theming. | Recharts (SVG-based, CSS-styleable). |
| Moment.js | Deprecated by its own maintainers. Massive bundle (330KB). | date-fns (tree-shakeable, ~5KB for typical usage). |
| Axios | Unnecessary dependency when fetch() is built into all target browsers. TanStack Query wraps fetch beautifully. | Native fetch() + TanStack Query. |
| html2canvas + jsPDF | html2canvas has known SVG rendering issues (fails on Recharts charts). Font embedding is buggy. | react-to-print (native browser print) + html-to-image (for individual chart exports). |
| Next.js / Remix | This is a SPA dashboard, not an SEO-driven website. SSR adds complexity without benefit -- consulting partners access via authenticated sessions. Vite SPA is the right choice. | Vite SPA with React Router. |
| Storybook (day 1) | Premature for a 10-module report product. Adds build complexity and maintenance overhead before you have enough shared components to justify it. Add in Phase 3+ if component library grows. | Build components inline, extract shared ones when patterns emerge. |

## Stack Patterns by Variant

**If a module needs a chart type Recharts does not support well (e.g., complex heatmap):**
- Use Nivo for that specific chart only (`@nivo/heatmap`)
- Keep Recharts as primary. Mixing chart libraries is fine for 1-2 edge cases.
- Because Nivo also supports React 19 and renders SVG.

**If PDF export requirements become strict (consulting firm demands specific PDF layout):**
- Add `@react-pdf/renderer` v4.3.2 for custom PDF generation
- Keep react-to-print for quick "print this page" functionality
- Because some consulting firms have specific report format requirements for client deliverables.

**If the product needs real-time data in a future version:**
- Add WebSocket support via native WebSocket API or socket.io-client
- TanStack Query supports WebSocket-triggered invalidation patterns
- Because monthly cadence is v1, but v2 may need live signals.

**If Indian number formatting is insufficient with numeral:**
- Use `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`
- numeral's Indian locale needs custom configuration
- Because INR formatting with lakhs/crores is a common edge case.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| react@^19.2.4 | All recommended libraries | Verified: recharts, @tanstack/react-table, @tanstack/react-query, zustand, radix-ui, motion, react-to-print, sonner all list React 19 in peer deps. |
| vite@^7.3.1 | @tailwindcss/vite@^4.1.18 | Verified: @tailwindcss/vite peer dep is `vite ^5.2.0 \|\| ^6 \|\| ^7`. |
| vite@^7.3.1 | @vitejs/plugin-react@^5.1.4 | Stratist runs this combination successfully. |
| tailwindcss@^4.1.18 | @tailwindcss/vite@^4.1.18 | Same version -- Tailwind v4 plugin is part of the tailwindcss package ecosystem. |
| typescript@^5.9.3 | All recommended libraries | TS 5.x is universally supported. @types/react@^19.2.5 provides React 19 type definitions. |
| eslint@^9.39.1 | typescript-eslint@^8.55.0 | Both use flat config. ESLint 9 + typescript-eslint 8 is the current standard combination. |

## Key Architecture Decision: White-Label Theming via Tailwind v4

Tailwind CSS v4 introduces `@theme` in CSS (not JS config). This is the foundation for multi-tenant white-labeling:

```css
/* base-theme.css */
@import "tailwindcss";

@theme {
  --color-primary: #1e40af;
  --color-secondary: #7c3aed;
  --font-family-heading: 'Inter', sans-serif;
  --font-family-body: 'Inter', sans-serif;
}
```

```css
/* tenant-bcg.css -- loaded dynamically */
@theme {
  --color-primary: #00a651;   /* BCG green */
  --color-secondary: #003d20;
  --font-family-heading: 'BCG Henderson Sans', sans-serif;
}
```

Recharts SVG elements can consume these CSS variables:
```tsx
<Bar fill="var(--color-primary)" />
<Line stroke="var(--color-secondary)" />
```

This creates a single rendering pipeline where switching tenants = swapping a CSS file. No React re-render, no prop drilling, no runtime theme provider overhead.

## Sources

All versions verified via `npm view [package] version` and `npm view [package] peerDependencies` against the npm registry on 2026-02-15:

- React 19.2.4 -- peer dep compatibility confirmed for all libraries
- Recharts 3.7.0 -- peer dep: `react ^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`
- @tanstack/react-table 8.21.3 -- peer dep: `react >=16.8`
- @tanstack/react-query 5.90.21 -- peer dep: `react ^18 || ^19`
- Zustand 5.0.11 -- peer dep: `react >=18.0.0`
- Tailwind CSS 4.1.18 -- no React peer dep (CSS tool)
- @tailwindcss/vite 4.1.18 -- peer dep: `vite ^5.2.0 || ^6 || ^7`
- Radix UI components -- peer dep: `react ^16.8 || ^17.0 || ^18.0 || ^19.0`
- Motion 12.34.0 -- peer dep: `react ^18.0.0 || ^19.0.0`
- react-to-print 3.2.0 -- peer dep: `react ~19`
- Stratist frontend package.json -- confirms React 19 + Vite 7 + Lucide + react-router-dom 7 pattern works in production

---
*Stack research for: Industry Landscape Intelligence Platform*
*Researched: 2026-02-15*
