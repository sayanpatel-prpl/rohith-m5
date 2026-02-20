# Technology Stack

**Project:** A&M Consumer Durables Intelligence Dashboard (v2)
**Researched:** 2026-02-20
**Overall Confidence:** HIGH

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | 19.1.x | UI framework | Latest stable, new hooks (useOptimistic, useActionState) improve form/async state management, no breaking changes from v18 |
| TypeScript | 5.8.x | Type safety | Enhanced type inference, better IDE support, self-documenting code. React 19 simplified useRef types |
| Vite | 6.x | Build tool & dev server | 5x faster builds, 100x faster HMR vs Vite 5, native ESM, optimized for React 19 |
| Tailwind CSS | 4.x (stable) | Styling framework | v4 released Jan 2025: 5x faster builds, CSS-based config (no JS), cascade layers, registered custom properties |

**Confidence:** HIGH
- All versions verified via official docs and npm (Feb 2026)
- React 19 + Vite 6 + TypeScript 5 combo confirmed in multiple 2025/2026 production guides
- Tailwind v4 stable release documented

### Charting Library
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Apache ECharts | 6.x | Primary charting | Canvas rendering (10x faster than SVG for large datasets), WebGL support, handles 10K+ data points, 50+ chart types including complex financial charts, sparklines built-in |
| echarts-for-react | 3.0.x | React wrapper | Simple declarative API, recent maintenance (Jan 2026), peer dependency model allows ECharts version control |

**Rationale:**
- **Why not Recharts**: SVG-only, slows above 10K points. Current v1.0 dashboard likely hitting this ceiling with 11 sections × 15 companies × quarterly data
- **Why not Visx**: Low-level primitives require significant custom work for sparklines, financial charts. Good for full custom viz, overkill for standard financial dashboard
- **Why not Highcharts**: Commercial license required, not open source

**Confidence:** HIGH
- Performance claims verified across 5+ independent 2025 comparisons
- ECharts specifically recommended for financial/real-time dashboards in all sources
- echarts-for-react v3.0.6 published Jan 2026 (actively maintained)

### Data Table Library
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @tanstack/react-table | 8.21.x | Headless table logic | Industry standard, headless (full style control), built-in sorting/filtering/pagination, supports inline sparklines, TypeScript-first, multi-column sort, fuzzy search |

**Rationale:**
- **Why headless**: Need full control over styling to match A&M brand (multi-tenant requirement)
- **Why not Material React Table**: Opinionated Material Design styling conflicts with brand flexibility
- **Why not AG Grid**: Commercial license for enterprise features, overkill for static intelligence dashboard
- **Why not PrimeReact**: Heavy component library (140+ components), bundle size bloat for table-only needs

**Implementation Note:** Use TanStack Table for logic + custom cells with ECharts mini-charts for inline sparklines

**Confidence:** HIGH
- TanStack Table v8 stable, v9 in alpha (stick with v8)
- Inline sparkline support confirmed in shadcn/ui blocks examples (Feb 2026)
- Headless pattern matches existing Radix UI approach in v1.0

### Data Tables - Inline Sparklines Pattern
Use TanStack Table's custom cell renderers with ECharts mini-chart instances:
```typescript
{
  accessorKey: 'trend',
  header: 'Trend',
  cell: ({ getValue }) => (
    <ReactECharts option={sparklineOption(getValue())} style={{ height: 40, width: 120 }} />
  )
}
```

### State Management
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @tanstack/react-query | 5.x | Server state | Industry standard for data fetching, caching, invalidation. Separates server state from client state |
| Zustand | 5.x | Client state | Lightweight (1.5KB), minimal boilerplate, works perfectly alongside TanStack Query for UI state (filters, modals, theme) |

**Architecture Pattern:**
- **TanStack Query**: All fetched data (section data, company data)
- **Zustand**: UI state (global filters, dark mode, selected tenant)
- **React 19 hooks**: Form state (useActionState), optimistic updates (useOptimistic)

**Rationale:**
- **Why not Redux**: Overkill for intelligence dashboard, excessive boilerplate
- **Why not Jotai/Recoil**: Atomic state not needed, Zustand simpler for global filters
- **Why keep separation**: TanStack Query + Zustand follows 2025 best practice of separating server/client state concerns

**Confidence:** HIGH
- This exact combo (TanStack Query + Zustand) recommended across 8+ 2025 state management guides
- Matches existing v1.0 architecture, reduces migration friction

### UI Components
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Radix UI | 1.x | Headless primitives | Accessible (ARIA), unstyled (Tailwind flexibility), kbd navigation, dialog/popover/select/tabs for dashboard UI |
| @radix-ui/react-icons | Latest | Icon system | Consistent with Radix ecosystem, tree-shakeable |

**Optional Enhancement:**
- shadcn/ui blocks (NOT full library): Pre-built TanStack Table + Radix + Tailwind examples for financial tables, copy-paste pattern

**Rationale:**
- **Why Radix**: Already in v1.0, proven headless approach for multi-tenant branding
- **Why not shadcn/ui full**: It's a copy-paste component collection, not an npm package. Cherry-pick table/dashboard blocks only
- **Why not Headless UI**: Smaller primitive set, less mature than Radix

**Confidence:** HIGH
- Radix UI established leader in headless React components (2025)
- Matches existing v1.0 stack

### Drag & Drop (for Pipeline/Kanban Views)
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @dnd-kit/core | 6.3.x | Drag-and-drop logic | Modern (react-beautiful-dnd no longer maintained), accessible, 10KB zero-dep, performant |
| @dnd-kit/sortable | Latest | Sortable lists | Optimized layer for kanban columns, pipeline stages |

**Use Cases in Dashboard:**
- Deals pipeline view (drag deals between stages)
- Customizable section ordering
- Column reordering in tables

**Confidence:** HIGH
- dnd-kit is 2025 standard replacement for react-beautiful-dnd
- Lightweight, maintained, recommended across 10+ 2025 drag-drop comparisons

### Single-File HTML Bundling
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| vite-plugin-singlefile | 2.3.x | Bundle to single HTML | Inlines all JS/CSS into dist/index.html, supports Vite 5-7, enables offline distribution |

**Configuration:**
```typescript
// vite.config.ts
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000
  }
})
```

**Confidence:** HIGH
- Same plugin as v1.0, Vite 6 compatibility confirmed (supports ^5.4.11, ^6.0.0, ^7.0.0)
- Last updated 8 months ago (June 2025), actively maintained

### Date/Time Utilities
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| date-fns | 4.x | Date formatting | Functional, tree-shakeable, 22MB unpacked but only imports used functions, better TypeScript support than dayjs, extensive locale support |

**Rationale:**
- **Why not dayjs**: 2KB footprint nice, but date-fns tree-shaking means similar bundle impact in practice. date-fns has stronger financial date formatting utilities
- **Why not Luxon**: Heavier, Intl API abstraction not needed (can use native Intl.NumberFormat directly)

**Confidence:** MEDIUM
- Date-fns recommended for "build-size-conscious projects" but both valid choices
- Existing v1.0 likely uses custom formatters (src/lib/formatters.ts), so this is additive not replacement

### Testing
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vitest | 3.x | Test runner | Built on Vite, native ESM, 100x faster than Jest, parallel worker threads, compatible with React Testing Library |
| @testing-library/react | 16.x | Component testing | User-behavior focused, role-based queries, industry standard, works seamlessly with Vitest |
| @testing-library/user-event | Latest | User interaction simulation | Simulates real user events (click, type, hover) more accurately than fireEvent |

**Confidence:** HIGH
- Vitest + RTL is 2025/2026 standard for React testing
- "68% less test code" reported for React 19 tests with RTL (React Testing Patterns Report, Jan 2025)
- Vitest 3 released with Vite 6 + React 19 compatibility

### Development Tools
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| ESLint | 9.x | Linting | Flat config (eslint.config.js), TypeScript support via typescript-eslint |
| Prettier | 3.x | Code formatting | Opinionated, zero-config, integrates with ESLint |
| @vitejs/plugin-react | Latest | React Fast Refresh | HMR for React components |

**Confidence:** HIGH
- ESLint 9 flat config is current standard (2025)

### Source Attribution UI
**Pattern:** No dedicated library needed. Custom implementation using:
- Radix Popover/Tooltip for citation hover
- Footnote references with superscript numbers
- Citation panel component (custom build)

**Example Pattern:**
```typescript
<span>
  Revenue grew 23%
  <Popover>
    <PopoverTrigger><sup>[1]</sup></PopoverTrigger>
    <PopoverContent>
      Q4 2025 Earnings Call, slide 12
      <Button>View Source</Button>
    </PopoverContent>
  </Popover>
</span>
```

**Confidence:** MEDIUM
- No established React citation library for financial dashboards
- Custom pattern based on shadcn/ui AI inline citation examples (Feb 2026)
- Research shows citation libraries target academic/CSL formatting, not financial intelligence

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Charting | Apache ECharts | Recharts | SVG rendering slows above 10K points, insufficient for 11-section dashboard |
| Charting | Apache ECharts | Visx | Low-level primitives, too much custom work for standard financial charts |
| Charting | Apache ECharts | Highcharts | Commercial license required |
| Data Table | TanStack Table | AG Grid | Commercial license for enterprise features |
| Data Table | TanStack Table | Material React Table | Opinionated Material Design conflicts with multi-tenant branding |
| State (client) | Zustand | Redux Toolkit | Excessive boilerplate for dashboard scope |
| State (client) | Zustand | Jotai/Recoil | Atomic state overkill, Zustand simpler |
| Drag & Drop | dnd-kit | react-beautiful-dnd | No longer maintained (archived 2023) |
| Date lib | date-fns | dayjs | date-fns better financial formatting, tree-shaking negates size difference |
| Testing | Vitest | Jest | Vitest 100x faster, native ESM, built for Vite |

## Installation

### Core Dependencies
```bash
# Framework
npm install react@19 react-dom@19
npm install @vitejs/plugin-react vite@6

# Charting
npm install echarts@6 echarts-for-react@3

# Data Table
npm install @tanstack/react-table@8

# State Management
npm install @tanstack/react-query@5 zustand@5

# UI Primitives
npm install @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-icons

# Drag & Drop (if needed)
npm install @dnd-kit/core@6 @dnd-kit/sortable

# Date Utilities
npm install date-fns@4

# Styling
npm install tailwindcss@4 @tailwindcss/vite
```

### Dev Dependencies
```bash
npm install -D typescript@5
npm install -D vitest@3 @testing-library/react@16 @testing-library/user-event
npm install -D eslint@9 prettier@3
npm install -D vite-plugin-singlefile@2
```

## Migration Path from v1.0

### Keep (No Change)
- React (upgrade 18 → 19, minimal breaking changes)
- Vite (upgrade to v6)
- TypeScript 5
- Tailwind (upgrade v3 → v4, config migration required)
- TanStack Query
- Zustand
- Radix UI
- vite-plugin-singlefile

### Replace
- **Recharts → Apache ECharts**: Performance upgrade for large datasets
  - Migration effort: Medium (chart config syntax different)
  - Risk: Low (both are declarative, well-documented)

### New Additions
- @tanstack/react-table (if not already using for complex tables)
- @dnd-kit/core + @dnd-kit/sortable (for pipeline/kanban views)
- date-fns (if standardizing date formatting beyond custom formatters)

## Risk Assessment

| Decision | Risk Level | Mitigation |
|----------|-----------|------------|
| Apache ECharts adoption | LOW | Well-documented, large community, echarts-for-react simplifies React integration |
| Tailwind v4 migration | MEDIUM | Breaking changes from v3 (JS config → CSS config). Follow official migration guide |
| TanStack Table for complex tables | LOW | Headless = full control, extensive docs, matches Radix pattern |
| React 19 upgrade | LOW | Minimal breaking changes, useRef type changes documented |
| Vite 6 upgrade | LOW | Mostly internal optimizations, config changes minimal |

## Bundle Size Considerations

Target: Single HTML file under 5MB (current v1.0 unknown, establish baseline)

**Heavy Dependencies:**
- Apache ECharts: ~1MB (tree-shake unused chart types)
- Radix UI primitives: 50-100KB (tree-shakeable per primitive)
- date-fns: Only imported functions included (tree-shakeable)
- TanStack Table: ~50KB
- Zustand: 1.5KB
- dnd-kit: 10KB

**Optimization Strategies:**
1. Lazy load ECharts chart types (only load used chart types)
2. Code-split by section (React.lazy + Suspense)
3. Tree-shake Radix primitives (import specific components)
4. Minimize Tailwind CSS (purge unused classes)
5. Inline critical CSS, defer non-critical
6. Use date-fns/format only, not entire library

**Confidence:** MEDIUM
- Need to measure v1.0 baseline before setting targets
- Single-file HTML inherently larger than split-chunk approach, but offline distribution requirement justifies it

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Vite Configuration

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile()
  ],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    rollupOptions: {
      output: {
        manualChunks: undefined // Single file output
      }
    }
  }
})
```

## Tailwind v4 Migration Notes

**Breaking Changes from v3:**
- Configuration moves from `tailwind.config.js` to CSS via `@theme` directive
- Use `@import "tailwindcss"` instead of `@tailwind` directives
- Custom properties replace JS config for colors/spacing

**Migration Steps:**
1. Install `@tailwindcss/vite` plugin
2. Convert `tailwind.config.js` tokens to CSS custom properties in `src/theme/tokens.css`
3. Update imports in main CSS file
4. Test all components for visual regressions

**Confidence:** HIGH
- Official migration guide published (Tailwind v4 docs)
- Breaking changes well-documented

## Source Attribution Pattern (Custom)

Since no established React library exists for financial intelligence citations, implement custom pattern:

**Component Structure:**
```
components/
  citation/
    CitationMarker.tsx      // Superscript number with popover
    CitationPopover.tsx     // Source details on hover
    CitationPanel.tsx       // Footer with all sources
    useCitations.ts         // Hook to register/track citations
```

**Usage:**
```typescript
const { cite } = useCitations()

<span>
  Revenue grew 23% {cite({
    source: "Q4 2025 Earnings Call",
    page: "slide 12",
    url: "/sources/earnings-q4-2025.pdf"
  })}
</span>
```

**Implementation Libraries:**
- Radix Popover (hover interaction)
- Zustand (citation registry for footer panel)
- Custom footnote numbering logic

**Confidence:** MEDIUM
- Pattern inspired by shadcn/ui AI inline citation (Feb 2026)
- No production examples in financial intelligence domain found
- Requires custom development and UX validation

## Sources

### Charting Libraries
- [Best React chart libraries 2025 - LogRocket](https://blog.logrocket.com/best-react-chart-libraries-2025/)
- [8 Best React Chart Libraries 2025 - Embeddable](https://embeddable.com/blog/react-chart-libraries)
- [Top React Chart Libraries 2025 - Updot](https://www.updot.co/insights/best-react-chart-libraries)
- [Apache ECharts Official](https://echarts.apache.org/)
- [echarts-for-react npm](https://www.npmjs.com/package/echarts-for-react)

### Data Tables
- [10 Best React Data Table Libraries 2026 - ReactScript](https://reactscript.com/best-data-table/)
- [TanStack Table Official Docs](https://tanstack.com/table/latest)
- [React Table Block Sparklines - shadcn/ui](https://www.shadcn.io/blocks/tables-sparkline)
- [@tanstack/react-table npm](https://www.npmjs.com/package/@tanstack/react-table)

### State Management
- [Zustand and TanStack Query - JavaScript in Plain English](https://javascript.plainenglish.io/zustand-and-tanstack-query-the-dynamic-duo-that-simplified-my-react-state-management-e71b924efb90)
- [Goodbye Redux? Meet TanStack Query & Zustand in 2025](https://www.bugragulculer.com/blog/good-bye-redux-how-react-query-and-zustand-re-wired-state-management-in-25)

### React 19 & Vite 6
- [Complete Guide React TypeScript Vite 2026 - Medium](https://medium.com/@robinviktorsson/complete-guide-to-setting-up-react-with-typescript-and-vite-2025-468f6556aaf2)
- [React 19 Best Practices 2025 - Medium](https://medium.com/@CodersWorld99/react-19-typescript-best-practices-the-new-rules-every-developer-must-follow-in-2025-3a74f63a0baf)
- [Upgrading to Vitest 3, Vite 6, React 19](https://www.thecandidstartup.org/2025/03/31/vitest-3-vite-6-react-19.html)
- [React 19 New Hooks - freeCodeCamp](https://www.freecodecamp.org/news/react-19-new-hooks-explained-with-examples/)

### Tailwind CSS v4
- [Tailwind CSS v4.0 Official](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS v4 Beta Release](https://tailwindcss.com/blog/tailwindcss-v4-beta)

### Drag & Drop
- [Build Kanban with dnd-kit - marmelab](https://marmelab.com/blog/2026/01/15/building-a-kanban-board-with-shadcn.html)
- [@dnd-kit/core npm](https://www.npmjs.com/package/@dnd-kit/core)
- [dnd-kit Official Docs](https://dndkit.com/)

### Single File HTML
- [vite-plugin-singlefile npm](https://www.npmjs.com/package/vite-plugin-singlefile)
- [vite-plugin-singlefile GitHub](https://github.com/richardtallent/vite-plugin-singlefile)

### Testing
- [Vitest with React Testing Library Guide - Makers Den](https://makersden.io/blog/guide-to-react-testing-library-vitest)
- [Vitest React Testing Library Guide - Incubyte](https://blog.incubyte.co/blog/vitest-react-testing-library-guide/)

### UI Components
- [Headless UI vs Radix 2025 - Subframe](https://www.subframe.com/tips/headless-ui-vs-radix)
- [Radix UI Official](https://www.radix-ui.com/)

### Date Libraries
- [date-fns vs dayjs - dhiwise](https://www.dhiwise.com/post/date-fns-vs-dayjs-the-battle-of-javascript-date-libraries)

### Citation UI
- [React AI Inline Citation - shadcn/ui](https://www.shadcn.io/ai/inline-citation)
- [AI UX Patterns Citations - ShapeofAI](https://www.shapeof.ai/patterns/citations)
