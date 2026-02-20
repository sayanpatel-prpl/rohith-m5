# External Integrations

**Analysis Date:** 2026-02-20

## APIs & External Services

**Backend API (Internal, Optional):**
- Express server on localhost:3001 provides 10 section endpoints
  - Endpoints: `/api/executive`, `/api/financial`, `/api/market-pulse`, `/api/deals`, `/api/operations`, `/api/leadership`, `/api/competitive`, `/api/deep-dive`, `/api/action-lens`, `/api/watchlist`
  - Client: Fetch API (native browser)
  - Configuration: `VITE_API_URL` environment variable
  - Fallback: All endpoints have static mock data in `src/data/mock/` for offline use

**Company Data Endpoints (Backend):**
- `/api/companies` - List all 16 companies
- `/api/companies/:id/quarterly-results` - Historical financial results
- `/api/companies/:id/deals` - M&A and transaction history
- `/api/companies/:id/growth-triggers` - Key growth catalysts
- `/api/companies/:id/concalls` - Quarterly earnings call highlights
- `/api/companies/:id/shareholding` - Promoter and investor holdings

**Health Check:**
- `/api/health` - Service status endpoint (returns database path and status)

## Data Storage

**Databases:**
- SQLite 5.1.1 (file-based)
  - Location: `database/industry-landscape.db`
  - Connection: Initialized in `server/index.mjs` via sqlite and sqlite3 packages
  - Client: Open library wrapping sqlite3 driver
  - Schema: `database/schema.sql` with 6 tables (companies, quarterly_results, deals, concall_highlights, growth_triggers, shareholding)

**File Storage:**
- Local filesystem only
  - SQLite database file stored on disk
  - Mock data loaded from JavaScript modules in `src/data/mock/`
  - No cloud storage integration (S3, Google Cloud Storage, etc.)

**Caching:**
- TanStack Query client-side cache with `staleTime: Infinity`
  - Location: `src/api/query-client.ts`
  - Behavior: Data fetched once per section and never refetches (no `refetchOnWindowFocus` or `refetchOnReconnect`)
  - GC time: 30 minutes before unused queries are removed from memory

## Authentication & Identity

**Auth Provider:**
- None - application is unauthenticated
- No login system, API key validation, or session management
- Multi-tenant branding support via URL parameter (`:tenantSlug` in routes)
- No OAuth, JWT tokens, or credential storage

**Branding/Tenant:**
- Tenant identification via URL path: `/:tenantSlug/report`
- Supported tenants: kompete, bcg, am (configured in `src/brands/`)
- Brand context passed via React Context (`BrandProvider`)
- CSS custom property overrides per tenant in `src/theme/tokens.css`

## Monitoring & Observability

**Error Tracking:**
- None - no Sentry, LogRocket, or error reporting service
- Console warnings logged for API fallbacks in `src/api/client.ts`
- React error boundaries catch section-level errors in `src/components/layout/SectionWrapper.tsx`

**Logs:**
- Browser console logs (development only)
- Backend console logs in Express server (`server/index.mjs`) for database and API events
- No log aggregation service (ELK, Datadog, CloudWatch, etc.)

## CI/CD & Deployment

**Hosting:**
- Static hosting required for built HTML file
- Optional: Node.js server on localhost:3001 for backend API
- No cloud platform specified (AWS, Vercel, Netlify, etc.)

**CI Pipeline:**
- None detected - no GitHub Actions, GitLab CI, or other CI configuration files

**Build Process:**
- `npm run build` - TypeScript type check (`tsc -b`) then Vite bundle to single HTML file
- Output: Single `dist/index.html` file via vite-plugin-singlefile
- Base path: configured as `./` (relative) for flexible hosting

## Environment Configuration

**Required Environment Variables:**
- None are strictly required; all have safe defaults
- `VITE_API_URL` (optional) - Backend API base URL; defaults to `http://localhost:3001`
- `VITE_USE_REAL_API` (optional) - Force mock data by setting to "false"; defaults to "true"

**Secrets Location:**
- No secrets detected in codebase
- `.env` files not checked into git (listed in `.gitignore`)
- No API keys, database credentials, or auth tokens in source code

**Mock Data:**
- Static JSON data in `src/data/mock/` modules (10 files, one per section)
- Provides full functionality without backend when `VITE_USE_REAL_API=false` or backend is unavailable
- Used for development, testing, and offline fallback

## Webhooks & Callbacks

**Incoming:**
- None - application does not expose webhook endpoints

**Outgoing:**
- None - application does not send webhooks to external systems

## Browser APIs & Features

**Storage:**
- localStorage - Stores theme preference (`theme-preference` key) for dark/light mode persistence
- SessionStorage - Not used

**Fonts:**
- Google Fonts (Inter, JetBrains Mono) loaded from fonts.googleapis.com
  - Links defined in `index.html` with preconnect for performance

**Performance:**
- Preconnect directives to Google Fonts CDN in `index.html`
- Vite HMR (Hot Module Replacement) for development

## Data Sources

**Live Data:**
- Express backend queries SQLite database populated with:
  - Company master data (16 major Indian consumer durables firms)
  - Quarterly financial results
  - Deal activity (M&A, QIP, investments)
  - Leadership changes and shareholding
  - Operational signals and competitive moves

**Mock Data:**
- Colocated in `src/data/mock/` as TypeScript modules
- Used as fallback when backend unavailable or offline
- Simulates 200-500ms latency in DEV mode for realistic UX testing
- Covers all 10 sections: executive, financial, market-pulse, deals, operations, leadership, competitive, deep-dive, action-lens, watchlist

**Data Freshness:**
- Mock data timestamp: Fixed at "Q3 FY25"
- Live API updates: Synced with database contents (backend serves current data)
- URL sync with filters applied client-side (no server-side filtering)

---

*Integration audit: 2026-02-20*
