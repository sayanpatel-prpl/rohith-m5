# Technology Stack

**Analysis Date:** 2026-02-20

## Languages

**Primary:**
- TypeScript 5.9.3 - React SPA frontend and Express backend
- JavaScript/JSX - React component definitions with JSX syntax

**Secondary:**
- SQL - SQLite database queries in backend server
- CSS - Tailwind CSS with custom properties for theming

## Runtime

**Environment:**
- Node.js (version not pinned - no .nvmrc file present)
- ESM modules (package.json `"type": "module"`)

**Package Manager:**
- npm (version specified in package-lock.json)
- Lockfile: Present (`package-lock.json`)

## Frameworks

**Core:**
- React 19.2.4 - UI library and component framework
- React Router 7.13.0 - Client-side routing with lazy-loaded sections
- Express 5.2.1 - Backend API server

**State Management:**
- TanStack Query (React Query) 5.90.21 - Server state management with stale-time-infinity caching
- Zustand 5.0.11 - Client-side filter state (companies, subCategory, performanceTier, timePeriod)

**UI Components:**
- Radix UI 1.4.3 - Headless component primitives (Select, Popover, Checkbox, Dialog, Tabs, Collapsible, DropdownMenu)

**Data Visualization:**
- Recharts 3.7.0 - Composable charting library (BarChart, LineChart, custom tooltips)

**Error Handling:**
- react-error-boundary 6.1.1 - Error boundary wrapper for section components

**Styling:**
- Tailwind CSS 4.1.18 - Utility-first CSS framework
- @tailwindcss/vite 4.1.18 - Vite integration for Tailwind processing

**Testing:**
- Vitest 4.0.18 - Unit test runner (globals: true, environment: node)

**Build & Dev:**
- Vite 7.3.1 - Fast module bundler and dev server
- @vitejs/plugin-react 5.1.4 - React JSX transformation plugin
- vite-plugin-singlefile 2.3.0 - Bundles output into single HTML file
- TypeScript - tsc for type checking before build

**Database:**
- SQLite 5.1.1 - File-based relational database client
- sqlite3 5.1.7 - Native SQLite bindings for Node.js

**Server Utilities:**
- cors 2.8.6 - CORS middleware for Express

**Utilities:**
- clsx 2.1.1 - Utility for conditional className construction

## Key Dependencies

**Critical:**
- @tanstack/react-query 5.90.21 - Why it matters: Handles all server state fetching with fallback to mock data; staleTime: Infinity prevents unnecessary refetches
- react-router 7.13.0 - Why it matters: Powers multi-tenant routing (/:tenantSlug/report) and lazy-loads 10 section components
- recharts 3.7.0 - Why it matters: Provides all data visualization across financial, market, and performance dashboards
- zustand 5.0.11 - Why it matters: Lightweight global state for 4-filter system with URL sync

**Infrastructure:**
- express 5.2.1 - Backend API server for section endpoints and company data
- sqlite/sqlite3 5.1.1/5.1.7 - Persistent storage for 16-company dataset with 6 tables (companies, quarterly_results, deals, concall_highlights, growth_triggers, shareholding)
- cors 2.8.6 - Enables cross-origin requests from SPA to backend

**Devtools:**
- @tanstack/react-query-devtools 5.91.3 - React Query debugging panel (initialIsOpen: false)

## Configuration

**Environment Variables:**
- `VITE_API_URL` - Backend base URL (default: `http://localhost:3001`)
  - Location: `src/api/client.ts` line 7
  - Used to override localhost fallback when backend server runs elsewhere
- `VITE_USE_REAL_API` - Set to "false" to skip real API and use mock data directly
  - Location: `src/api/client.ts` line 8
  - Default behavior: true (tries real API, falls back to mock on failure)

**Build Configuration:**
- `vite.config.ts` - Plugin setup (React, Tailwind, SingleFile bundler)
- `tsconfig.app.json` - TypeScript compilation with ES2020 target, strict mode, JSX react-jsx
- `tsconfig.node.json` - Separate config for Node-based build tooling
- `vitest.config.ts` - Vitest with globals enabled and node environment
- `tailwind.config.js` - Not present; tokens defined via @theme directive in `src/theme/tokens.css`

**Design Tokens:**
- CSS custom properties in `src/theme/tokens.css`
- Color palette: brand colors (primary, secondary, accent), semantic colors (positive, negative, neutral), surfaces
- Dark mode via `documentElement.classList.add('dark')` stored in localStorage

## Platform Requirements

**Development:**
- Node.js runtime
- npm package manager
- Modern browser (ES2020 features)

**Production:**
- Single HTML file (via vite-plugin-singlefile)
- Static file hosting (CDN or web server)
- Optional: Express backend on Node.js listening on port 3001 for live data

**Database:**
- SQLite 3 database file at `database/industry-landscape.db`
- No external database required; file-based persistence

---

*Stack analysis: 2026-02-20*
