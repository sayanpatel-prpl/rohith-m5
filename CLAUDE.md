# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kompete - Industry Intel is a React + TypeScript SPA for analyzing the Indian Consumer Durables sector. It provides 10 interconnected intelligence sections (executive snapshot, financials, deals, leadership, competitive moves, etc.) covering 16 major companies. Built as a consulting advisory PoC with multi-tenant branding support.

## Commands

```bash
npm run dev          # Vite dev server with HMR
npm run build        # TypeScript typecheck (tsc -b) then Vite build
npm run lint         # ESLint
npm run test         # Vitest single run
npm run test:watch   # Vitest watch mode
npm run preview      # Preview production build
```

Backend API server (optional, app falls back to mock data):
```bash
node server/index.mjs   # Express + SQLite on http://localhost:3001
```

Build output is a single HTML file via `vite-plugin-singlefile`.

## Architecture

### Data Flow

1. **API layer** (`src/api/client.ts`) — `fetchSectionData(sectionId)` tries the real API (`VITE_API_URL`, default `localhost:3001`), falls back to mock data on failure. Controlled by `VITE_USE_REAL_API` env var.
2. **TanStack Query** (`src/api/query-client.ts`) — `staleTime: Infinity`, no refetch on focus/reconnect. Query option factories in `src/api/queries.ts`.
3. **Zustand filter store** (`src/stores/filter-store.ts`) — 4 filters (companies, subCategory, performanceTier, timePeriod) with `subscribeWithSelector`. Filters are NOT in query keys — data is fetched once and filtered client-side.
4. **URL sync** (`src/stores/url-sync.ts`) — Bidirectional URL ↔ filter store sync with ref guards to prevent loops. Compact params: `?companies=amber,voltas&subcat=AC&tier=outperform&period=QoQ`.
5. **`useFilteredData` hook** (`src/hooks/use-filtered-data.ts`) — Combines `useQuery()` + Zustand selectors, applies filters via `useMemo`, returns `data` (filtered), `rawData` (unfiltered), `isPending`, `error`.

### Routing

- Base path: `/:tenantSlug/report` (e.g., `/kompete/report`, `/bcg/report`, `/am/report`)
- 10 section routes defined in `src/app/routes.tsx`, each lazy-loaded via `React.lazy()`
- Default redirect: `/` → `/kompete/report/executive`

### Key Architectural Patterns

- **Section components** (`src/sections/{name}/`) accept no props, call `useFilteredData<DataType>(sectionId)`, export default for lazy loading. Errors are caught by `SectionErrorFallback` error boundary.
- **Client-side filtering only** — filters applied in `useMemo` against fetched data. Only `data.companies` arrays are filtered; metadata fields pass through unchanged.
- **Fuzzy company matching** (`src/lib/company-matching.ts`) — mock data uses varied display names across sections, so matching uses first-word-of-name OR company ID.
- **Multi-tenant branding** — `BrandProvider` sets `data-tenant` attribute on root element; CSS custom property overrides per tenant in `src/theme/tokens.css`. Brand configs in `src/brands/`.
- **Formatters** (`src/lib/formatters.ts`) — INR currency (Cr/L), percentages, basis points, Indian number grouping. Uses `Intl.NumberFormat` instances at module scope for performance.

### State Management

| Concern | Tool | Location |
|---------|------|----------|
| Server/section data | TanStack Query | `src/api/` |
| Global filters | Zustand | `src/stores/filter-store.ts` |
| URL params | React Router `useSearchParams` | `src/stores/url-sync.ts` |
| Branding/tenant | React Context | `src/components/brand/` |
| Theme (dark/light) | localStorage + CSS classes | `src/theme/dark-mode.ts` |

### Styling

- **Tailwind CSS 4** with `@tailwindcss/vite` plugin — no `tailwind.config.js`, tokens defined via `@theme` directive in `src/theme/tokens.css`
- CSS custom properties for all design tokens (colors, spacing, chart palette of 5 colors)
- Dark mode via `documentElement.classList` toggle, stored in localStorage
- Print styles use `[data-print-hide]` and `[data-print-content]` attributes

## Testing

Vitest with `globals: true` and `environment: node`. Tests colocated with source:
- `src/lib/formatters.test.ts` — currency/percentage formatter tests
- `src/lib/company-matching.test.ts` — fuzzy/exact company matching tests

Run a single test file: `npx vitest run src/lib/formatters.test.ts`

## Database

SQLite database at `database/industry-landscape.db`, schema in `database/schema.sql`. Tables: companies, quarterly_results, deals, concall_highlights, growth_triggers, shareholding. Express server in `server/index.mjs` serves API endpoints.

## Environment Variables

- `VITE_API_URL` — Backend base URL (default: `http://localhost:3001`)
- `VITE_USE_REAL_API` — Set to `"false"` to skip real API and use mock data directly (default: `true`)
