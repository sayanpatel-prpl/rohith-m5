# Codebase Concerns

**Analysis Date:** 2026-02-20

## Tech Debt

**Client-side filtering performance with large datasets:**
- Issue: All data filtering happens in `useMemo` in the browser. With 16 companies and 10 sections, filtering is currently fast, but this approach will degrade significantly as dataset size grows.
- Files: `src/hooks/use-filtered-data.ts`
- Impact: Once dataset exceeds thousands of entries per section, filtering in useMemo will cause noticeable lag and client-side memory bloat. No server-side pagination or filtering exists.
- Fix approach: Implement server-side filtering and pagination in the Express API (`server/index.mjs`). Move filter dimensions into query parameters sent to the backend. Keep client-side filtering as a fallback for mock data only.

**Shallow object cloning in filtering:**
- Issue: `use-filtered-data.ts` line 32 does `const result = { ...data }` which only creates a shallow clone. Nested arrays are still references to the original cache.
- Files: `src/hooks/use-filtered-data.ts:32`
- Impact: While the top-level object is new, the filtered arrays are reassignments to cache references. This works because TanStack Query treats data as immutable, but mutations to these arrays post-filter could theoretically affect cached data if not careful.
- Fix approach: Use deep clone library (like `structuredClone()` or lodash `cloneDeep`) when mutations are made, or document the immutability contract more explicitly.

**JSON.stringify equality check in URL sync:**
- Issue: `url-sync.ts:92` uses `JSON.stringify(a) === JSON.stringify(b)` for filter comparison. This is a synchronous, string-based comparison that runs on every filter change.
- Files: `src/stores/url-sync.ts:92`
- Impact: With 4 filter dimensions, this is fine now. But if filters expand significantly, string serialization becomes inefficient. Also, field ordering in object serialization could cause false negatives if order varies.
- Fix approach: Implement a custom equality function that compares filter arrays and values directly, or use a library like `fast-deep-equal`.

**Mock data with inconsistent company references:**
- Issue: Mock data uses varied company name formats (uppercase, title case, company IDs). `company-matching.ts` implements fuzzy matching by first-word-of-name, but this is fragile across sections.
- Files: `src/lib/company-matching.ts`, all files in `src/data/mock/`
- Impact: If mock data changes naming conventions, filters may silently stop working for specific sections. No schema validation ensures consistency.
- Fix approach: Normalize all mock data to use lowercase company IDs (e.g., "amber", "voltas"). Create a schema validation layer that runs at import time, or migrate to a database with referential integrity (SQLite is set up but unused in the browser).

**Console warnings in production:**
- Issue: `src/api/client.ts:40,49` logs to `console.warn` when API fails. In production, this exposes network errors to users who open devtools.
- Files: `src/api/client.ts:40`, `src/api/client.ts:49`
- Impact: Information disclosure (API URL, error details). Users may see "API failed" messages that aren't actionable.
- Fix approach: Replace console.warn with a centralized error logging system (e.g., Sentry, LogRocket). Only log non-sensitive error metadata (section ID, timestamp). Show user-friendly messages in UI via error boundaries.

**Hard-coded API URL and fallback logic:**
- Issue: `src/api/client.ts` has `VITE_API_URL` defaulting to `http://localhost:3001` and `VITE_USE_REAL_API` defaulting to true. If API server is not running, every fetch silently falls back to mock data without clear user indication.
- Files: `src/api/client.ts:7-8`
- Impact: Users don't know if they're viewing real or mock data. In a live environment with an actual backend, silent fallback to stale mock data could confuse users.
- Fix approach: Add a "Data Source" indicator in the UI (showing "Live API" vs "Demo Data"). Add a startup health check that explicitly warns if API is unavailable.

**No error boundary at app root:**
- Issue: The only error boundary is `SectionErrorFallback` in `SectionWrapper` (section-level). If errors occur in layout components or above, they crash the entire app.
- Files: `src/app/App.tsx` (missing error boundary), `src/components/layout/SectionWrapper.tsx`
- Impact: Errors in route handlers, brand provider, or app shell kill the entire SPA. No graceful fallback for top-level errors.
- Fix approach: Wrap the entire `App` or root `<QueryClientProvider>` in an `<ErrorBoundary>` with a full-app fallback UI.

## Known Bugs

**Filter state loss on page reload:**
- Symptoms: URL sync works for navigation, but filters are not persisted. If a user sets filters and reloads the page, filters reset to defaults even though URL params show the correct filters.
- Files: `src/stores/url-sync.ts`, `src/stores/filter-store.ts`
- Trigger: Set filters → Check URL (correct) → Refresh page → Filters reset to defaults
- Root cause: `useFilterUrlSync` reads URL params in useEffect only on mount and URL change. On reload, the URL params exist but are read after `DEFAULT_FILTERS` has already been applied to the Zustand store.
- Workaround: Manually set filters again or use browser back button
- Fix approach: Move URL -> filter sync to synchronous initialization before React renders (in `main.tsx` or during store setup), or use localStorage as a secondary fallback.

**Company filtering ignores non-company fields:**
- Symptoms: Sub-category and performance tier filters work correctly, but if data entries don't have a `company` or `id` field, the company filter silently skips them (returns `true` for no-company entries).
- Files: `src/hooks/use-filtered-data.ts:49`, line 70
- Trigger: Filter by company, view a section with metadata or summary stats (not company-specific)
- Impact: Meta entries like "sector totals" or "market summary" always appear regardless of company filter, which may confuse users.
- Fix approach: Clarify which entries are company-specific vs. global in data types. Add a field to entries (e.g., `isGlobal: boolean`) and handle filtering differently for global entries (either always include or always exclude).

**CSVExport uses dynamic imports with hardcoded section logic:**
- Symptoms: Adding a new section requires manually updating the switch statement in `CSVExport.tsx`. If a section is added to routes but not CSVExport, the export will show an alert instead of data.
- Files: `src/components/export/CSVExport.tsx:54`
- Trigger: Add a new section to `src/app/routes.tsx`, try to export → "No tabular data available"
- Impact: Easy to accidentally break export functionality when adding sections.
- Fix approach: Generate CSVExport cases from a config or use a plugin system where each section exports a CSV handler. Or consolidate tabular data into a generic format that CSVExport can introspect.

## Security Considerations

**Unsafe localStorage usage:**
- Risk: Theme preference is stored in localStorage without validation. If an attacker injects a malicious value (e.g., `<script>...</script>`), it could be written to localStorage.
- Files: `src/theme/dark-mode.ts:4`, `src/theme/dark-mode.ts:16`
- Current mitigation: Whitelist validation in `getStoredTheme()` (line 5-6) checks for "light", "dark", or "system" only.
- Recommendations: The existing whitelist is sufficient. Continue validating all localStorage reads. Add TypeScript type guards to prevent invalid values from ever being set.

**No CSRF protection on backend API:**
- Risk: If a real backend exists at `VITE_API_URL`, it likely has no CSRF tokens. A malicious site could forge requests to the API if endpoints modify data.
- Files: `src/api/client.ts` (fetch calls), `server/index.mjs`
- Current mitigation: None. The API is read-only (no POST/PUT/DELETE), so CSRF impact is limited.
- Recommendations: If endpoints that modify data are added, implement SameSite cookies or CSRF token headers. Document that the API is read-only.

**Mock data stored in client-side bundles:**
- Risk: All mock data (company names, financials, leadership changes) is bundled in the JavaScript. Sensitive information could be extracted from the built bundle via source maps or minification reversal.
- Files: All files in `src/data/mock/`
- Current mitigation: Source maps are not mentioned in build config, but `vite-plugin-singlefile` produces a single HTML file without external dependencies.
- Recommendations: Ensure `vite.config.ts` disables source maps in production (`sourcemap: false` in build.rollupOptions). Add a note in CLAUDE.md that mock data should be replaced with real API calls before production deployment.

**No input validation on filter parameters:**
- Risk: URL parameters are parsed in `url-sync.ts` without validation. Invalid filter values (e.g., `?tier=malicious_value`) are silently ignored.
- Files: `src/stores/url-sync.ts:32-47`
- Current mitigation: Invalid values don't match any option in the UI, so no harm occurs. But there's no explicit validation.
- Recommendations: Add a validation/whitelist step in `paramsToFilters` to reject unknown filter values and log warnings.

## Performance Bottlenecks

**Chart rendering in competitive moves and deep-dive sections:**
- Problem: Recharts charts are re-rendered on every filter change. With multiple charts per section and 16 companies, this could be expensive.
- Files: `src/sections/competitive/CompetitiveMoves.tsx`, `src/sections/deep-dive/TopQuartileAnalysis.tsx`, and other sections with charts
- Cause: Charts are derived from filtered data in useMemo, but Recharts re-renders if props change. No memoization of chart components themselves.
- Improvement path: Wrap chart components in `React.memo()` to prevent re-renders when data shape is the same. Use `useMemo` for derived chart data (e.g., transformed data for specific chart types).

**MetricsTable re-render on every selection change:**
- Problem: When a user selects a company in the financial comparison table, the entire table re-renders.
- Files: `src/sections/financial/MetricsTable.tsx`, `src/sections/financial/MetricsTableRow.tsx`
- Cause: No memoization of table rows. Parent table state drives all children.
- Improvement path: Move selection state into Zustand or Context. Memoize `MetricsTableRow` with a custom equality function that ignores unrelated filter changes.

**Sidebar navigation doesn't lazy-load styling:**
- Problem: The sidebar in `Sidebar.tsx` renders all 10 section links, each with styles. With large CSS files per section, this adds to initial paint time.
- Files: `src/components/layout/Sidebar.tsx`
- Cause: All sections are imported in routing config, so lazy-loading component code doesn't prevent style loading.
- Improvement path: Use CSS code-splitting or dynamic style imports. Many build tools support this automatically, but verify that `vite.config.ts` enables CSS code-splitting.

**No debouncing on URL sync:**
- Problem: Every filter change immediately updates the URL (line 87-89 in `url-sync.ts`). With rapid filter interactions (e.g., clicking multiple companies fast), this could create a long undo/redo history.
- Files: `src/stores/url-sync.ts:76-95`
- Cause: No throttle or debounce on the store subscription.
- Improvement path: Add a debounce (e.g., 300ms) before calling `setSearchParams` to batch URL updates.

## Fragile Areas

**Company matching logic:**
- Files: `src/lib/company-matching.ts`, `src/hooks/use-filtered-data.ts:40-59`
- Why fragile: Depends on consistent company name formatting across all mock data sources. The `matchesCompany` function uses first-word matching, which breaks if two companies share the same first word (e.g., "Amber" vs "Ambuja"). Also, company ID normalization (lowercase, hyphen replacement) is inconsistent.
- Safe modification: Before changing company names in mock data, run a lint/audit script that validates all company references are unique and consistently formatted. Add a type-safe approach: create a `CompanyId` branded type to prevent string mistakes.
- Test coverage: No tests for company-matching across all sections. Existing test file (`src/lib/company-matching.test.ts`) tests the utility functions but not integration with sections.

**Filter store with no persistence:**
- Files: `src/stores/filter-store.ts`, `src/stores/url-sync.ts`
- Why fragile: Filter state is ephemeral. If URL sync fails (due to a React Router bug or timing issue), filters are lost on page reload. No fallback to localStorage.
- Safe modification: Add localStorage-backed persistence using Zustand's `persist` middleware. Test reload scenarios thoroughly.
- Test coverage: `useFilterUrlSync` has no unit tests. Edge cases like rapid filter changes, browser back/forward, and route changes are untested.

**CompanyBrief export component:**
- Files: `src/components/export/CompanyBrief.tsx`
- Why fragile: Component imports directly from all mock data modules and applies company-matching logic internally. If a section's data structure changes (e.g., renaming `company` field to `companyName`), the component breaks silently.
- Safe modification: Create a data adapter layer that normalizes all section data to a common schema before passing to CompanyBrief. Use runtime type validation (e.g., Zod) to catch schema mismatches.
- Test coverage: No tests for CompanyBrief rendering or data aggregation across sections.

**URL parameter parsing:**
- Files: `src/stores/url-sync.ts:32-47`
- Why fragile: Assumes filter values in URL are valid. If URL is manually edited with invalid values (e.g., `?tier=invalid_tier`), those values are silently accepted and either ignored or passed to the store unchecked.
- Safe modification: Add a validation schema (e.g., Zod or io-ts) that validates all URL parameters before storing them. Log warnings for invalid values.
- Test coverage: No tests for invalid URL parameters or edge cases like empty strings, special characters, or excessively long values.

## Scaling Limits

**Single-page bundle size:**
- Current capacity: Single HTML file (`vite-plugin-singlefile`) bundles all code, styles, and mock data. Current estimated size is ~500KB (uncompressed), mostly from Recharts and Radix UI.
- Limit: Browser download time becomes noticeable >1-2MB. Mobile users may experience slow initial load.
- Scaling path: Implement lazy-loading for charts and UI components (already done for sections). Split mock data into separate JSON files loaded on demand. Enable gzip compression on the server.

**Mock data in memory:**
- Current capacity: All 12 mock data modules (executive, financial, competitive, etc.) are loaded into TanStack Query cache. Total data size is ~2-3MB in development.
- Limit: Once dataset grows to 50+ companies or 100+ data points per section, memory usage could exceed 10-20MB.
- Scaling path: Implement pagination and lazy-loading of historical data. Archive old data. Consider moving to IndexedDB for client-side storage if offline-first is a goal.

**CSVExport hardcoded section handling:**
- Current capacity: 10 sections with export logic manually implemented. Each section adds ~20 lines of code.
- Limit: If more than 20 sections are added, the switch statement becomes unmaintainable.
- Scaling path: Create a generic data-driven export system where each section defines a `getExportData()` function. Use a registry pattern to dynamically look up export handlers.

## Dependencies at Risk

**No explicit UI component validation:**
- Risk: Radix UI is used for components (Checkbox, Collapsible, Tooltip) but no prop validation or accessibility tests exist.
- Impact: If Radix UI breaks or is updated, components may silently lose functionality.
- Migration plan: If Radix UI is deprecated, replace with Headless UI or Shadcn/ui. Ensure all components have accessibility tests (`jest-axe` or similar).

**Recharts for charting:**
- Risk: Recharts is a heavy dependency (~200KB). If it becomes unmaintained or has breaking changes, no lightweight fallback exists.
- Impact: Chart rendering could break in future React versions. No fallback to Canvas or SVG-based charting library.
- Migration plan: Consider visx or Canvas-based charting if Recharts becomes a bottleneck. For now, keep Recharts but monitor for security updates.

**SQLite backend unused:**
- Risk: `server/index.mjs` sets up Express + SQLite, but it's optional and rarely used. Schema exists but may drift from mock data over time.
- Impact: If a real backend is needed, the schema and mock data could be out of sync.
- Migration plan: Document the schema clearly. Create a seed script that ensures mock data and SQLite match. If the app goes production, migrate to a real API and deprecate mock data.

## Missing Critical Features

**No offline support:**
- Problem: App requires internet connectivity to load from API. If API is down and `VITE_USE_REAL_API=false` is not set, the app fails.
- Blocks: Using the app on flights, in low-connectivity areas, or if backend is temporarily unavailable.
- Solution: Implement ServiceWorker caching or IndexedDB storage to cache section data on first load. Allow users to browse cached data offline.

**No data refresh mechanism:**
- Problem: With `staleTime: Infinity` in TanStack Query config, data is never refetched. Users don't know if they're viewing stale data.
- Blocks: Real-time updates, pushing critical information (e.g., breaking deal news).
- Solution: Add a "Refresh Data" button in the UI. Implement WebSocket subscriptions or polling (with exponential backoff) for live updates. Add a "Last Updated" timestamp to each section.

**No user authentication:**
- Problem: Multi-tenant branding (`BrandProvider`) exists but there's no way to restrict which tenants a user can access.
- Blocks: Using this in a real business setting where different teams need different views.
- Solution: Add login flow with JWT tokens. Restrict accessible tenants based on user roles. Hide/show sections based on user permissions.

**No mobile responsive design:**
- Problem: Sidebar takes up space, charts don't adapt to small screens, tables overflow horizontally.
- Blocks: Using the app on mobile or tablets.
- Solution: Implement mobile-first design. Collapsible sidebar, responsive grid layouts for charts, horizontal-scrollable tables with sticky headers.

## Test Coverage Gaps

**No integration tests for filtering:**
- What's not tested: Filtering works correctly across all sections. Company filter + sub-category filter + performance tier filter together. URL sync correctly updates filters on navigation.
- Files: `src/hooks/use-filtered-data.ts`, `src/stores/url-sync.ts`, all section files
- Risk: A change to filter logic could break filters silently for specific combinations (e.g., company filter + subCategory filter both applied).
- Priority: High — filtering is core functionality and has known edge cases.

**No tests for CSV export:**
- What's not tested: CSV export generates valid CSV. Special characters in data (commas, quotes) are escaped correctly. All sections export correct data.
- Files: `src/components/export/CSVExport.tsx`
- Risk: Users could export data with corrupted or missing fields and not realize it.
- Priority: Medium — export is less critical than viewing, but data integrity is important.

**No tests for error boundaries:**
- What's not tested: Section errors are caught and displayed correctly. App-level errors don't crash the entire app. Retry button works after an error.
- Files: `src/components/errors/SectionErrorFallback.tsx`, `src/components/layout/SectionWrapper.tsx`
- Risk: Error handling is untested, so bugs in error rendering could create double-failure scenarios.
- Priority: Medium — testing error paths is tricky but important.

**No tests for theme switching:**
- What's not tested: Dark mode toggle persists across page reloads. System preference detection works. CSS classes are correctly applied.
- Files: `src/theme/dark-mode.ts`, theme-related CSS in `src/theme/tokens.css`
- Risk: Theme switching could have race conditions (e.g., wrong theme flashes on load).
- Priority: Low — theme is cosmetic, but user experience is affected.

**No tests for company matching across sections:**
- What's not tested: Company filtering works identically across all 10 sections. Name variations are handled correctly (e.g., "Voltas" vs "VOLTAS" vs "voltas").
- Files: `src/lib/company-matching.ts` and all mock data modules
- Risk: A section could silently break company filtering if data format changes.
- Priority: High — filtering is critical and fragile.

---

*Concerns audit: 2026-02-20*
