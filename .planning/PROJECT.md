# Kompete v2 — A&M Consumer Durables Intelligence Dashboard

## What This Is

A presentation-grade intelligence dashboard for the Indian Consumer Durables sector, built specifically for Alvarez & Marsal (A&M). It transforms raw financial filings, alternative data, and company research into consulting-grade BD intelligence — scoring companies on distress signals, classifying engagement opportunities by A&M service line, and answering "which company should A&M call on Monday, and with what pitch?" across 11 interconnected sections covering 15 tracked companies. Built as a single-file HTML output in `dashboard_build_v2/`.

## Core Value

Every section answers "where's the BD opportunity?" — not just industry data, but specific, sourced signals that help A&M partners identify which companies need help, what kind (Turnaround, CPI, Transaction Advisory, PE Services), and when to reach out.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 11 sections: Executive Snapshot, A&M Value-Add (position 2), Market Pulse, Financial Tracker, Deals & Transactions, Operational Intelligence, Leadership & Governance, Competitive Moves, Sub-Sector Deep Dive, What This Means For..., Watchlist & Forward Indicators
- [ ] Strictly real data only — every displayed value traces to a source file in `data_sources/`; unavailable data shows "-"
- [ ] 4-tier source attribution on every card, chart, and table (T1 Hard Financial, T2 Verified Alternative, T3 Curated Intelligence, T4 News & Sentiment)
- [ ] A&M action-type triage across Financial Tracker and Watchlist (Turnaround/CPI/Transaction Advisory color coding)
- [ ] A&M Value-Add Opportunities section as pipeline view (Identified/Qualified/Outreach-Ready) at nav position 2
- [ ] Talk vs Walk verification system — management claims vs hard data with disconnect/stealth signal flagging
- [ ] News data architecture — NewsItem interface with credibility scoring, graceful degradation when news is empty
- [ ] Anti-clickbait filtering — low-credibility sources never reach UI, corroboration upgrades confidence
- [ ] Derived market intelligence — intra-universe market share, pricing power proxy, competitive intensity index
- [ ] Intelligence Grade (letter grade) replacing confidence meter in Executive Snapshot
- [ ] A&M Opportunity Summary card at top of Executive Snapshot (total advisory opportunity, distress count, top action)
- [ ] Sparklines in Financial Tracker for revenue and EBITDA% trend
- [ ] Company modal with A&M engagement suggestion + Talk vs Walk tab
- [ ] Stress indicators scoring model with clear thresholds for Watchlist
- [ ] Governance risk scoring per company (auditor flags, promoter decline, board changes)
- [ ] Cross-section navigation — insights reference and link to source sections
- [ ] Progress tracking files (PROGRESS.md, DECISIONS.md, DATA_CATALOG.md, SOURCE_REFERENCE.md)
- [ ] Single-file HTML output via vite-plugin-singlefile
- [ ] Dark mode support for all new components and tokens
- [ ] Multi-tenant branding preserved (data-tenant theming)

### Out of Scope

- Backend data collection pipelines — separate workstream
- News scraping/refreshing — data arrives as JSON file drop before presentation
- Export/sharing functionality — out of scope for v2
- Mobile responsive — desktop-first for consulting partner presentation
- User auth / billing — developer handles separately
- Categories beyond Consumer Durables — future expansion
- Modifying the existing v1.0 codebase — untouched, v2 builds in `dashboard_build_v2/`

## Context

This is a v2 rebuild of the Kompete Industry Intel dashboard, built in a separate `dashboard_build_v2/` directory. The existing v1.0 codebase in the project root remains untouched.

**Target audience:** Alvarez & Marsal (A&M) — global professional services firm specializing in turnaround management, corporate performance improvement (CPI), restructuring, PE advisory, and operational transformation. Their consumer products practice covers growth strategy, operations, analytics, digital, and marketing across appliances/white goods.

**Presentation deadline:** Internal team review Feb 21 (tomorrow), presenter walkthrough Feb 22 (Sunday).

**Data sources available (in `consumer-durables-intelligence/data_sources/`):**
- `consolidated-dashboard-data.json` (401KB) — pre-aggregated dashboard data
- `screener-all-companies.json` (348KB) — Screener.in financials for all companies
- Per-company extracted data (15 companies): `consolidated.json`, `screener-financials.json`, `trendlyne-data.json`
- `sovrenn-intelligence.json` — earnings quality tags
- `deals-transactions-capital-movements.csv` — deal tracker
- `operational-intelligence-data.md` (60KB) — operational signals
- 14 company research markdown files (dated Feb 14, 2026) with sourced analysis
- Company PDFs: annual reports, investor presentations, earnings transcripts, quarterly results

**Architecture reuse from v1.0:**
- React 19 + Vite + TypeScript 5 + Tailwind CSS v4
- TanStack Query for data caching, Zustand for filters
- Recharts for charts, Radix UI for accessible components
- Lazy-loaded sections, single-file HTML build output
- URL-based multi-tenant branding via BrandProvider

**Key specification document:** `consumer-durables-intelligence/claude-code-prompt.md` — contains full section-by-section execution plan with 26 ordered steps.

## Constraints

- **Build location**: All v2 code in `dashboard_build_v2/` — do not modify files outside this directory
- **Data integrity**: Strictly real data from `data_sources/`; show "-" where unavailable; never fabricate
- **Source tracing**: Every data point must trace to original source (not the research file containing it)
- **Timeline**: Must be presentation-ready by Feb 21 evening
- **Tech stack**: React 19 + Vite + TypeScript 5 + Tailwind CSS v4 (open to library changes if they serve the spec better)
- **Output**: Single-file HTML via vite-plugin-singlefile
- **News slots**: Build component structure for news integration but leave content empty until final data refresh
- **Section count**: Strictly 11 sections — do not merge or remove any

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fresh build in dashboard_build_v2/ | Keep v1.0 untouched; clean separation of concerns | -- Pending |
| A&M Value-Add at nav position 2 | This is the punchline — A&M leadership skims 2 sections max | -- Pending |
| 4-tier source attribution system | A&M will ask "where did this number come from?" — must answer in 5 seconds | -- Pending |
| News as pluggable JSON | News refreshed Sunday morning; zero code changes on refresh, only data swap | -- Pending |
| Talk vs Walk verification | Differentiator over filing-only analysis — flags narrative disconnects | -- Pending |
| Anti-clickbait filtering at data layer | Low-credibility sources filtered before reaching UI; protects dashboard credibility | -- Pending |

---
*Last updated: 2026-02-20 after initialization*
