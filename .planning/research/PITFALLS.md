# Domain Pitfalls: Consulting Intelligence Dashboard

**Domain:** Financial/Consulting Intelligence Dashboard (React SPA)
**Researched:** 2026-02-20
**Context:** High-stakes presentation (24-48hr deadline), 11 sections, 15 companies, single-file HTML output

---

## Critical Pitfalls

Mistakes that cause presentation-day failures or require major rewrites.

### Pitfall 1: Presentation-Day Demo Failures (The "81% Rule")

**What goes wrong:** Dashboard works in development but fails during live presentation due to runtime errors, network dependencies, or visual regressions. Research shows 81% of salespeople have lost deals due to bad demos.

**Why it happens:**
- Lack of redundancy testing 10 minutes before presentation (not 1 hour before)
- Reliance on external API endpoints without fallback data
- Untested error boundaries allowing catastrophic UI crashes
- Missing graceful degradation when data unavailable

**Consequences:**
- Lost client confidence and deal termination
- Visible panic erodes presenter credibility (the anxiety kills deals more than the technical issue)
- No recovery path during live demo

**Prevention:**
1. **Implement fail-safe data strategy:**
   - Primary: Real API with `VITE_USE_REAL_API=true`
   - Secondary: Automatic fallback to mock data on API failure
   - Tertiary: Static fallback JSON bundled with build
2. **Test complete flow 10 minutes before presentation:**
   - Fresh browser session, all tabs refreshed
   - Click through every section navigation
   - Verify filters apply correctly
   - Check dark mode toggle
3. **Error boundaries at section level:**
   - Wrap each section with `SectionErrorFallback`
   - Display graceful error message, not blank screen
   - Allow navigation to other sections even if one fails
4. **Backup plan:**
   - Pre-recorded demo video cued and ready
   - PDF export of dashboard available
   - Backup presenter familiar with recovery procedures

**Detection:**
- Run pre-flight checklist 10 min before demo
- Monitor browser console for ANY warnings/errors
- Test on presentation laptop, not development machine
- Verify build artifact is single-file HTML with all assets inlined

**Phase:** Pre-Launch Hardening (Phase 9)

---

### Pitfall 2: Source Attribution Failures (Compliance & Credibility Crisis)

**What goes wrong:** Data presented without clear attribution, mixing mock/real data without labels, or displaying "Sample Data" warnings in production. Violates consulting standards and client trust.

**Why it happens:**
- Mock data scaffolding code left in production build
- Inconsistent source metadata across sections
- No visual distinction between real vs fallback data
- Source tracking not built into data model from day one

**Consequences:**
- Client questions data credibility during Q&A
- Regulatory/compliance issues for financial consulting
- Inability to trace data lineage when numbers challenged
- Loss of professional reputation

**Prevention:**
1. **Embed source metadata in data model:**
   ```typescript
   interface BaseData {
     metadata: {
       source: string;           // "Company Filings", "BSE Data", etc.
       lastUpdated: string;      // ISO date
       dataType: "real" | "mock" | "hybrid";
       coverage: string;         // "Q3 FY24", "Full Year 2023"
     }
   }
   ```
2. **Visual attribution in UI:**
   - Footnote on every visualization: "Source: {metadata.source} | Updated: {metadata.lastUpdated}"
   - Distinct styling for mock vs real data (e.g., dashed borders for mock)
   - Banner warning if any section uses fallback data
3. **Build-time validation:**
   - CI check fails if `dataType: "mock"` found in production JSON
   - Enforce source field presence in TypeScript types
   - Generate source summary report during build
4. **Data governance dashboard:**
   - Admin view showing data freshness per section
   - Lineage tracking from source → transformation → display
   - Consumption metrics (which sections most viewed)

**Detection:**
- Search codebase for "mock", "sample", "test data" labels
- Verify every chart/table has source attribution
- Review JSON files for complete metadata
- Stakeholder review of data sources document

**Phase:** Data Quality Assurance (Phase 4) + Pre-Launch Hardening (Phase 9)

---

### Pitfall 3: Single-File HTML Build Failures (Inlining Gotchas)

**What goes wrong:** Vite plugin inlines most assets but silently fails on SVGs, favicon, or unrecognized file types. Deployed HTML references broken external paths.

**Why it happens:**
- `vite-plugin-singlefile` has known limitations with SVG/static assets
- Inline script tags removed during build, converted to external scripts
- CSS custom properties in `:root` not inlined correctly
- Public folder assets not automatically bundled

**Consequences:**
- Missing icons/logos on deployed page
- Broken favicon in browser tab
- External script dependencies fail when served from different domain
- Dark mode tokens missing due to CSS extraction issues

**Prevention:**
1. **Test single-file output before presentation:**
   ```bash
   npm run build
   # Open dist/index.html directly in browser (file:// protocol)
   # Verify all images, icons, styles render correctly
   ```
2. **Use data URIs for critical assets:**
   - Convert logo SVG to data URI in source
   - Inline favicon as base64 in HTML template
   - Avoid relying on `/public` folder for essential assets
3. **Check build warnings:**
   - Monitor Vite output for "asset not inlined" messages
   - Verify final bundle size matches expectations (large = good for single file)
4. **Alternative: Use Base64 plugin:**
   - For SVG logos, use `vite-plugin-svg-loader` to import as React components
   - Ensures SVGs are compiled into JS bundle, not referenced externally

**Detection:**
- Build artifact is >2MB (indicates successful inlining)
- No external `<link>` or `<script src=` tags in built HTML
- Network tab shows zero requests when opening file locally
- SVG logos render when offline

**Phase:** Build & Deployment Infrastructure (Phase 8)

---

### Pitfall 4: Dark Mode Token Failures at Runtime

**What goes wrong:** Dark mode works in development but breaks in production due to CSS custom property timing issues, incompatible fallback values, or token sync failures.

**Why it happens:**
- CSS custom properties evaluated at runtime, not build time
- IACVT (Invalid At Computed Value Time) behavior when property has incompatible value type
- Token overrides don't reflect when design tokens updated
- Fallback values `var(--name, fallback)` don't work as expected for type mismatches

**Consequences:**
- White text on white background in dark mode
- Chart colors invisible or clashing
- Flash of unstyled content on load
- Inconsistent theming across sections

**Prevention:**
1. **Use data-attribute pattern:**
   ```css
   :root {
     --bg-primary: white;
     --text-primary: black;
   }
   :root[data-theme="dark"] {
     --bg-primary: #1a1a1a;
     --text-primary: white;
   }
   ```
2. **Test both modes systematically:**
   - Automated visual regression tests for light/dark
   - Check every section in both modes before presentation
   - Verify chart colors from design token palette work in both themes
3. **Avoid runtime token calculation:**
   - Don't use JavaScript to calculate token values dynamically
   - Define all tokens statically in CSS
   - Use browser DevTools to verify computed values
4. **Fallback strategy:**
   - Always provide fallback: `color: var(--text-primary, black);`
   - Test with custom properties disabled to verify graceful degradation
   - Use semantic tokens (not primitive colors) for theme switching

**Detection:**
- Toggle dark mode in every section
- Check console for CSS warnings about invalid custom properties
- Verify localStorage persists theme correctly on reload
- Test on fresh browser profile (no cached styles)

**Phase:** UI/UX & Theming (Phase 2)

---

### Pitfall 5: Data Integrity Corruption During Client-Side Filtering

**What goes wrong:** Filters applied incorrectly, causing data mismatches between sections, empty states shown when data exists, or stale data displayed after filter changes.

**Why it happens:**
- Filter state stored in URL but not synced with Zustand store (or vice versa)
- Infinite loops between URL sync and store updates
- Fuzzy company matching fails when display names inconsistent across sections
- `useMemo` dependencies missing, causing stale filtered data

**Consequences:**
- Executive says "Show me only Voltas" but Competitive Moves shows all companies
- Dashboard shows "No data available" when switching from 3 companies to 1 company
- Filters reset unexpectedly during navigation
- Client questions data accuracy when numbers don't match across sections

**Prevention:**
1. **Bidirectional URL sync with guards:**
   ```typescript
   // Use ref to prevent sync loops
   const isInternalUpdate = useRef(false);

   useEffect(() => {
     if (isInternalUpdate.current) return;
     isInternalUpdate.current = true;
     // Update store from URL
     isInternalUpdate.current = false;
   }, [searchParams]);
   ```
2. **Consistent company matching:**
   - Use company ID as source of truth, not display name
   - Implement fuzzy matching for legacy mock data (first-word matching)
   - Log mismatches during development
3. **Explicit filter dependencies:**
   ```typescript
   const filteredData = useMemo(() => {
     return applyFilters(rawData, companies, tier, period);
   }, [rawData, companies, tier, period]); // All dependencies listed
   ```
4. **Filter state validation:**
   - Reset invalid filter combinations (e.g., company not in dataset)
   - Show clear feedback when filters result in empty state
   - Preserve filter state across section navigation

**Detection:**
- Test all filter combinations systematically
- Verify URL params match Zustand store state
- Check that navigation preserves filters
- Monitor for "No data" states that shouldn't be empty

**Phase:** Global State & Filtering (Phase 3)

---

## Moderate Pitfalls

Significant issues that degrade UX or require rework, but don't cause catastrophic failures.

### Pitfall 6: Performance Degradation with Large Data Tables

**What goes wrong:** Dashboard renders thousands of rows causing slow page loads, laggy scrolling, and browser freezes. Charts with 100+ data points render slowly.

**Why it happens:**
- Rendering all rows simultaneously instead of virtualizing
- Re-rendering entire table on every filter change
- Expensive calculations not memoized
- Chart libraries processing full dataset even when zoomed

**Prevention:**
1. **Virtualize large lists:**
   - Use `react-window` or `@tanstack/react-virtual`
   - Render only visible rows + buffer
   - Expected performance: 10,000 rows with 60fps scrolling
2. **Server-side aggregation:**
   - Pre-calculate summaries in JSON (don't compute client-side)
   - Provide both detailed and aggregated views
   - Use backend endpoints for filtering when >1000 records
3. **Memoization strategy:**
   ```typescript
   const expensiveCalculation = useMemo(() => {
     return computeMetrics(rawData);
   }, [rawData]); // Only recalculate when rawData changes
   ```
4. **Progressive rendering:**
   - Show summary metrics immediately
   - Load detailed tables on demand (tab activation)
   - Lazy load charts below the fold

**Detection:**
- Lighthouse performance score <90
- React DevTools Profiler shows >16ms render times
- Browser freezes when applying filters
- High memory usage in Chrome Task Manager

**Phase:** Performance Optimization (Phase 7)

---

### Pitfall 7: Print/Export Layout Breakage

**What goes wrong:** Dashboard looks perfect on screen but breaks when printed or exported to PDF. Charts cut off, tables overflow, colors invisible.

**Why it happens:**
- `overflow: hidden` on `<html>` or `<body>` prevents multi-page printing
- CSS Grid/Flexbox doesn't respect page breaks
- Dark mode styles applied in print (white text on white paper)
- Chart libraries use pixel-based dimensions that don't scale

**Prevention:**
1. **Print-specific CSS:**
   ```css
   @media print {
     html, body { overflow: visible !important; height: auto !important; }
     .no-print { display: none; }
     .page-break { page-break-before: always; }
     :root[data-theme="dark"] { /* Override dark mode for print */ }
   }
   ```
2. **Test print preview:**
   - Check every section in print preview before presentation
   - Verify page breaks occur logically
   - Ensure source attributions visible on printed pages
3. **PDF export library:**
   - Use `@react-pdf/renderer` for programmatic PDF generation
   - Provides more control than browser print
   - Can apply different layouts for screen vs print

**Detection:**
- Print preview every section
- Export to PDF and verify formatting
- Check that multi-page content doesn't get cut off

**Phase:** Pre-Launch Hardening (Phase 9)

---

### Pitfall 8: Indian Currency Formatting Inconsistencies

**What goes wrong:** Financial data displays in millions (Western format) instead of lakhs/crores (Indian format). Decimal separators and grouping wrong for regional expectations.

**Why it happens:**
- Default `Intl.NumberFormat` uses Western grouping (1,000,000)
- Indian format requires custom grouping (10,00,000)
- Confusion between K (thousands), L (lakhs), Cr (crores)
- Regional settings not configured correctly

**Prevention:**
1. **Use Indian locale formatter:**
   ```typescript
   const indianCurrency = new Intl.NumberFormat('en-IN', {
     style: 'currency',
     currency: 'INR',
     notation: 'compact', // Shows 1L, 10Cr instead of full numbers
   });
   ```
2. **Consistent unit labeling:**
   - ₹1.5L (lakhs), ₹150Cr (crores), not ₹150000K
   - Tooltip shows full number: "₹1,50,00,000"
   - Avoid mixing formats across sections
3. **Unit conversion utilities:**
   ```typescript
   function formatIndianCurrency(value: number, unit: 'L' | 'Cr') {
     const formatted = unit === 'L' ? value / 100000 : value / 10000000;
     return `₹${formatted.toFixed(2)}${unit}`;
   }
   ```
4. **Validate against client expectations:**
   - Confirm preferred format with stakeholders early
   - Be consistent: all financials in Crores OR all in Lakhs (not mixed)

**Detection:**
- Review every financial figure for correct grouping
- Verify tooltips show full numbers correctly
- Check that "1.5Cr" doesn't display as "15L"

**Phase:** Data Formatting & Utilities (Phase 1 foundation)

---

### Pitfall 9: Tailwind CSS Purge Removing Production Styles

**What goes wrong:** Styles work in development but disappear in production build. Dynamically generated class names get purged.

**Why it happens:**
- Tailwind v4 uses JIT mode: only generates classes found in source files
- Dynamic class names (`text-${color}-500`) not detected by content scanner
- Glob patterns in config missing file extensions (e.g., `.tsx` files)
- Classes defined in JavaScript variables not safelisted

**Prevention:**
1. **Avoid dynamic class construction:**
   ```typescript
   // BAD: Tailwind can't detect this
   const color = isDanger ? 'red' : 'green';
   className={`text-${color}-500`}

   // GOOD: Explicit class names
   className={isDanger ? 'text-red-500' : 'text-green-500'}
   ```
2. **Configure content paths correctly:**
   ```css
   @theme {
     /* All tokens defined here */
   }
   /* Ensure Vite plugin scans .tsx, .jsx, .html files */
   ```
3. **Safelist dynamic classes:**
   - If dynamic classes necessary, use Tailwind safelist
   - Better: use CSS custom properties for dynamic values
4. **Test production build:**
   - Always verify `npm run build && npm run preview`
   - Check that chart colors, badges, status indicators render

**Detection:**
- Missing colors/spacing in production build
- Elements with no styling after deployment
- DevTools shows classes but no CSS rules

**Phase:** Styling System Setup (Phase 2)

---

### Pitfall 10: TanStack Query Error Boundaries Causing Infinite Loops

**What goes wrong:** Error boundaries trigger, reset, re-fetch data, error again, creating infinite loop. Or errors don't bubble to error boundary at all.

**Why it happens:**
- React error boundaries only catch render errors, not async errors
- TanStack Query errors happen asynchronously during data fetch
- `throwOnError` not set, so errors stay in query result object
- `QueryErrorResetBoundary` not wrapping error boundary correctly

**Prevention:**
1. **Proper error boundary integration:**
   ```typescript
   import { QueryErrorResetBoundary } from '@tanstack/react-query';
   import { ErrorBoundary } from 'react-error-boundary';

   <QueryErrorResetBoundary>
     {({ reset }) => (
       <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
         <Section />
       </ErrorBoundary>
     )}
   </QueryErrorResetBoundary>
   ```
2. **Use throwOnError for critical queries:**
   ```typescript
   useQuery({
     queryKey: ['section', sectionId],
     queryFn: fetchSectionData,
     throwOnError: true, // Errors bubble to error boundary
   });
   ```
3. **Implement retry logic:**
   ```typescript
   // Default: 3 retries with exponential backoff
   // Customize for specific error types
   retry: (failureCount, error) => {
     if (error.status === 404) return false; // Don't retry 404s
     return failureCount < 3;
   }
   ```
4. **Graceful error display:**
   - Show partial data if available (e.g., cached)
   - Provide actionable error message ("Data unavailable, showing cached version")
   - Allow manual retry button

**Detection:**
- Monitor for infinite re-render loops in DevTools
- Check that error boundary fallback UI displays
- Verify retry count doesn't exceed limit
- Test with network throttling/offline mode

**Phase:** API Integration & Data Fetching (Phase 3)

---

## Minor Pitfalls

Quality-of-life issues and polish concerns.

### Pitfall 11: Missing Empty States for Zero-Data Scenarios

**What goes wrong:** Dashboard shows blank sections, broken layouts, or misleading charts when filters result in no data.

**Prevention:**
- Implement `EmptyState` component with clear messaging
- Show "No companies match selected filters" vs "Data loading..."
- Provide actionable guidance (e.g., "Try selecting more companies")
- Preserve layout structure even when empty

**Phase:** UI Components (Phase 2)

---

### Pitfall 12: Inconsistent Loading States Across Sections

**What goes wrong:** Some sections show skeleton loaders, others show blank space, creating inconsistent UX.

**Prevention:**
- Standardize on skeleton UI pattern for all sections
- Use `Suspense` with fallback component
- Match skeleton layout to actual content structure
- Avoid "flash of loading state" for fast queries (delay showing loader 200ms)

**Phase:** UI Components (Phase 2)

---

### Pitfall 13: Browser Console Warnings in Production

**What goes wrong:** Hundreds of React warnings, TanStack Query deprecation notices, or accessibility warnings visible in client browser.

**Prevention:**
- Fix all warnings before presentation
- Configure production build to suppress development-only warnings
- Run Lighthouse audit to catch accessibility issues
- Test in incognito mode to simulate fresh user experience

**Phase:** Pre-Launch Hardening (Phase 9)

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Phase 1: Foundation** | Choosing wrong formatter library for Indian numbers | Use `Intl.NumberFormat('en-IN')` from day one |
| **Phase 2: UI/UX** | Dark mode tokens not tested until Phase 9 | Test both themes during initial styling |
| **Phase 3: Data Fetching** | Filter state not synced with URL from start | Implement URL sync immediately, not later |
| **Phase 4: Section Implementation** | Copy-paste code without updating data types | Use type-safe `useFilteredData<T>` hook |
| **Phase 5: Advanced Features** | Search/export added without performance testing | Profile before adding features, not after |
| **Phase 6: Multi-Tenancy** | CSS custom properties conflict with theming | Namespace tenant tokens: `--kompete-primary` |
| **Phase 7: Performance** | Virtualizing too late (after performance issues) | Profile early, virtualize proactively |
| **Phase 8: Build** | Testing single-file build day before presentation | Test build process weekly minimum |
| **Phase 9: Hardening** | Discovering source attribution gaps at final review | Validate data lineage in Phase 4 |

---

## Presentation-Day Failure Checklist

**10 Minutes Before Demo:**

- [ ] Open production build in fresh browser profile
- [ ] Navigate to ALL 11 sections (don't assume they work)
- [ ] Apply filters: single company, multiple companies, tier filters
- [ ] Toggle dark mode in 3 different sections
- [ ] Check browser console for ANY errors/warnings
- [ ] Verify source attributions visible on 3 random visualizations
- [ ] Test on presentation laptop (not dev machine)
- [ ] Have backup video cued in separate tab
- [ ] Confirm internet connection (if using real API) or verify fallback works
- [ ] Close all other browser tabs/apps (prevent memory issues)

**What to Say If Demo Fails:**
- "Can you still see my screen?" (calm, professional tone)
- "Let me show you our backup visualization" (switch to video/PDF)
- DO NOT: panic, apologize excessively, or make excuses

---

## Sources

**Dashboard Design & Failures:**
- [Why Dashboards Fail: Top Mistakes CEOs and CIOs Make](https://www.sapbwconsulting.com/blog/why-dashboards-fail)
- [Top 12 Business Intelligence Challenges to Manage](https://www.techtarget.com/searchbusinessanalytics/tip/Top-11-business-intelligence-challenges-and-how-to-overcome-them)
- [10 Common Mistakes in Creating an Effective Dashboard](https://www.limelight.consulting/hub/articles/10-common-mistakes-in-creating-an-effective-dashboard)
- [Top 10 dashboard design mistakes](https://www.domo.com/learn/article/top-10-dashboard-design-mistakes-and-what-to-do-about-them)

**Demo Failures & Prevention:**
- [The Art of Failing Forward: Demo Lessons Learned](https://www.reprise.com/resources/blog/the-art-of-failing-forward-demo-lessons-learned)
- [The Top 6 Live Product Demo Fails Of All Time](https://www.walnut.io/blog/product-demos/top-5-product-demo-fails/)
- [Top 5 Technical Problems for Presenters](https://www.presentation-guru.com/the-5-most-common-technical-problems-for-presenters-and-how-to-avoid-them/)

**React Performance & Large Datasets:**
- [Building High-Performance Financial Dashboards with React](https://olivertriunfo.com/react-financial-dashboards/)
- [How to optimize rendering performance with virtualization](https://www.zigpoll.com/content/how-can-i-optimize-the-rendering-performance-of-large-datasets-in-a-react-dashboard-using-virtualization-techniques)

**Error Handling & Graceful Degradation:**
- [UI best practices for loading, error, and empty states in React](https://blog.logrocket.com/ui-design-best-practices-loading-error-empty-state-react/)
- [Building Resilient REST API Integrations: Graceful Degradation](https://medium.com/@oshiryaeva/building-resilient-rest-api-integrations-graceful-degradation-and-combining-patterns-e8352d8e29c0)
- [The Static Fallback Architecture: A Blueprint for Graceful Degradation](https://medium.com/@bhargava.akki/the-static-fallback-architecture-a-blueprint-for-graceful-degradation-e114263a7b10)

**TanStack Query Error Boundaries:**
- [Managing query error states - Mastering Tanstack Query](https://app.studyraid.com/en/read/11355/355098/managing-query-error-states)
- [How to use Error Boundary with React Query and Router v6](https://amanexplains.com/error-boundary-react-query-and-router-v6/)
- [TanStack Query: The Data Fetching Solution You've Been Looking For](https://medium.com/simform-engineering/tanstack-query-the-data-fetching-solution-youve-been-looking-for-60e6e14261e6)

**Single-File HTML Build Issues:**
- [vite-plugin-singlefile GitHub](https://github.com/richardtallent/vite-plugin-singlefile)
- [Inlining CSS and JS in HTML does not work · Issue #8397](https://github.com/vitejs/vite/issues/8397)

**Dark Mode & CSS Custom Properties:**
- [CSS Custom Properties: The Complete Guide for 2026](https://devtoolbox.dedyn.io/blog/css-custom-properties-complete-guide)
- [Quick and Easy Dark Mode with CSS Custom Properties](https://css-irl.info/quick-and-easy-dark-mode-with-css-custom-properties/)

**Indian Currency Formatting:**
- [Decoding INR: Thousands (K), Lakhs (L), and Crores (Cr)](https://www.daytradeindia.in/decoding-inr-thousands-k-lakhs-l-and-crores-cr/)
- [Getting Indian rupee lakhs / crores formatting in Excel](https://acetechpro.wordpress.com/2018/03/15/getting-indian-rupee-lakhs-crores-formatting-in-excel/)

**Tailwind CSS Purge Issues:**
- [Troubleshooting Tailwind CSS: Build Errors, Missing Styles](https://www.mindfulchase.com/explore/troubleshooting-tips/front-end-frameworks/troubleshooting-tailwind-css-build-errors,-missing-styles,-and-configuration-pitfalls-in-front-end-projects.html)
- [Fixing Missing Styles in Tailwind CSS Due to Purging Issues](https://www.mindfulchase.com/explore/troubleshooting-tips/fixing-missing-styles-in-tailwind-css-due-to-purging-issues.html)
- [Understanding Tailwind CSS Safelist and How It Solves Purging Issues](https://franklam.hashnode.dev/understanding-tailwind-css-safelist-and-how-it-solves-purging-issues)

**Data Governance & Source Attribution:**
- [Mastering Oversight: How a Data Governance Dashboard](https://diggrowth.com/blogs/data-management/data-governance-dashboard/)
- [What Is In a Data Governance Dashboard?](https://www.inetsoft.com/info/what-is-in-data-governance-dashboards/)
- [Data Governance Best Practices for 2026](https://www.alation.com/blog/data-governance-best-practices/)

**Print/PDF Export:**
- [How to generate PDFs in React with React to PDF](https://www.nutrient.io/blog/how-to-create-pdfs-with-react-to-pdf/)
- [Generating PDFs in React with react-pdf](https://blog.logrocket.com/generating-pdfs-react/)

**Security & Data Integrity:**
- [A08 Software or Data Integrity Failures - OWASP Top 10:2025](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/)
