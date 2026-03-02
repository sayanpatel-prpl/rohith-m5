# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kompete - Industry Intel is a **single-file static HTML dashboard** (`index_v4.html`) for analyzing the Indian Consumer Durables sector. It provides 12 interconnected intelligence sections covering 16 major companies. Built as a consulting advisory PoC for A&M (Alvarez & Marsal).

## Working File

**`index_v4.html`** — The only working file. Self-contained single-page app with inline CSS + JS. No build step required — open directly in a browser.

Previous versions (`index.html`, `index_v2.html`, `index_v3.html`) are superseded — do NOT edit them.

## Architecture

- **Vanilla HTML/CSS/JS** — No frameworks, no build tools, no dependencies
- **~8,300 lines** — All styles, markup, and logic in one file
- **Dark/light theme** — Toggle via `.dark` class on `<html>`, stored in localStorage
- **16 companies** in `COMPANY_META` + `FINANCIAL_DATA` arrays (FY25 annual + Q4 FY25–Q3 FY26 quarterly)
- **`COMPANIES` array** derived at runtime from `FINANCIAL_DATA` + `COMPANY_META`
- **12 sections** navigated via sidebar click handlers that show/hide `.section-panel` divs
- **Default section**: Executive Snapshot (signal-driven opportunity pipeline)

### Data Model

| Array/Object | Purpose |
|-------------|---------|
| `FINANCIAL_DATA[]` | Quarterly + annual financial rows per company (rev, ebitda_pct, pat, rev_growth, roce, de, pe, wc_days, etc.) |
| `COMPANY_META{}` | Non-financial fields: name, ticker, subSector, amSignal, perf, signalTaxonomy, variance, source, productMix, premiumMix |
| `SIGNAL_DATA{}` | Transcript intel signals with `conf` (direct/calculated/inferred) and `ev` (evidence array with q/src/ref) |
| `OPPORTUNITY_DATA[]` | Advisory pipeline: 12 accounts, 41 sub-opportunities across 3 stages |
| `NARRATIVE_DRIFT{}` | Drift detection data for 7 companies (voltas, orient, vguard, bajaj, symphony, crompton, havells) |
| `COMPANIES[]` | Derived at runtime — merges meta + latest financials |

### Signal Taxonomy

Every company has `signalTaxonomy` in COMPANY_META:
- **performance** — margin deterioration, cost escalation, revenue decline
- **transition** — leadership change, M&A, restructuring, IPO
- **friction** — narrative drift, undisclosed metrics, analyst skepticism
- **ecosystem** — regulatory change, channel disruption, commodity shock

Each includes: `primary`, `signals[]`, `serviceLines[]`, `urgency`, and `thesis` (SCI: Situation/Complication/Implication).

### Sections

| # | Section ID | Description |
|---|-----------|-------------|
| 1 | `section-executive` | Executive Snapshot — Signal-driven opportunity pipeline, Big Themes, Red Flags, Talk vs Walk, Earnings Grid |
| 2 | `section-market-pulse` | Market Pulse — Demand signals, input costs, margin outlook, channel mix |
| 3 | `section-financial` | Financial Performance — Sortable 17-company table, sparklines, derived columns toggle |
| 4 | `section-transcript-intel` | Transcript Intel — CoSTAR signal table with evidence vault |
| 5 | `section-deals` | Deals & Transactions — Card grid with type filter |
| 6 | `section-operations` | Operational Intelligence — Ops metrics table with cross-link badges |
| 7 | `section-leadership` | Leadership & Governance — Alerts, risk scoring |
| 8 | `section-competitive` | Competitive Moves — Move cards with type filter |
| 9 | `section-deep-dive` | Sub-Sector Deep Dive — Product-market peer groups (7 groups), subsector breakdown, product mix, premium mix, scale matrix |
| 10 | `section-am-value-add` | Advisory Pipeline — Signal-driven opportunity table (12 accounts, 3 stages) |
| 11 | `section-action-lens` | Action Lens — 4 persona tabs (PE/Investors, Founders, COOs/CFOs, Supply Chain) |
| 12 | `section-watchlist` | Watchlist — Quadrant cards, forward signals |

### Key JS Functions

| Function | Purpose |
|----------|---------|
| `renderSignalPipeline(filter)` | Signal-taxonomy opportunity cards in Executive Snapshot |
| `renderPeerGroups()` | Product-market peer comparison tables in Deep Dive |
| `renderTable()` | Financial table with sort, filter, derived columns |
| `renderOppPipeline()` | Advisory Pipeline opportunity table with signal badges |
| `renderOpsTable()` | Operations metrics with confidence icons and cross-links |
| `renderSubSectorCards()` | Dynamic sub-sector breakdown cards |
| `renderEarningsSnapshot()` | Q3 FY26 earnings grid |
| `filterDeals(type)` | Deal card type filtering |
| `filterMoves(type)` | Competitive move card filtering |
| `switchActionTab(tabId)` | Action Lens tab switching |
| `openCompanyModal(company)` | Company detail modal |
| `toggleDerived()` | Show/hide market intelligence columns |
| `toggleTheme()` | Dark/light mode toggle |

### CSS Design System — "Intelligence Blue"

- **Display/Body font**: Inter (300–800)
- **Mono font**: IBM Plex Mono
- **Primary accent**: Intelligence Blue `#3B82F6`
- **Semantic colors**: Green `#22C55E`, Red `#EF4444`, Amber `#F59E0B`, Purple `#7C3AED`
- **Neutrals**: Slate scale (50–900)
- **Signal badges**: Performance (red), Transition (purple), Friction (amber), Ecosystem (blue)
- Dark mode via `.dark` class overrides
- Key patterns: `.card`, `.stat-row`, `.alert-card`, `.signal-card`, `.persona-card`, `.quadrant-card`

## Intelligence Reports

14/16 companies have full intelligence reports + pain point CSVs in `rohith-m5/[Company]/` folders:
- **Primary (8)**: Havells, Bajaj, Amber, Crompton, Butterfly, Symphony, TTK Prestige, IFB
- **From archive (6)**: Blue Star, Voltas, Whirlpool, Dixon, Orient, V-Guard
- **No source docs (2)**: Eureka Forbes, LG Electronics India

Cross-company synthesis: `Cross_Company_Synthesis.md`

## Intel Skill (`/intel`)

Located at `.claude/commands/intel.md` (root and project level). Phases:
1. Document Ingestion (read PDFs)
2. Intelligence Extraction (11 sections)
3. Write Intelligence Report
4. (3.5) Engagement Thesis (SCI framework + signal classification)
5. Pain Point CSV + SIGNAL_DATA evidence vault population
6. Dashboard Population (COMPANY_META, Talk vs Walk, Scale Matrix, Watchlist)
7. Verification Checklist
8. (6.5) Cross-Company Synthesis

Gold standard report: `rohith-m5/Havells/Havells_Intelligence_Report.md`

## Archive

The `archive/` folder contains previous versions and source data:
- `consumer-durables-intelligence/data_sources/Reports/` — Source PDFs and original intelligence reports for all companies
- `dashboard_build_v2/` — React + TypeScript version (used as reference for v1 features)
- `src/`, `server/`, `database/` — React app source, Express API, SQLite DB (disconnected)
- Research docs, CSVs, planning files, data pipeline scripts
