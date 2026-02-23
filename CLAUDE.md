# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kompete - Industry Intel is a **single-file static HTML dashboard** (`index.html`) for analyzing the Indian Consumer Durables sector. It provides 12 interconnected intelligence sections covering 16 major companies. Built as a consulting advisory PoC for A&M (Alvarez & Marsal).

## Working File

**`index.html`** — The only working file. Self-contained single-page app with inline CSS + JS. No build step required — open directly in a browser.

## Architecture

- **Vanilla HTML/CSS/JS** — No frameworks, no build tools, no dependencies
- **~4,000 lines** — All styles, markup, and logic in one file
- **Dark/light theme** — Toggle via `.dark` class on `<html>`, stored in localStorage
- **16 companies** hardcoded in `COMPANIES` array with Q3 FY2026 data
- **12 sections** navigated via sidebar click handlers that show/hide `.section-panel` divs

### Sections

| # | Section ID | Description |
|---|-----------|-------------|
| 1 | `section-executive` | Executive Snapshot — OpportunitySummary, Big Themes, Red Flags, Talk vs Walk |
| 2 | `section-market-pulse` | Market Pulse — Demand signals, input costs, margin outlook, policy tracker |
| 3 | `section-financial` | Financial Performance — Sortable 16-company table, sparklines, derived columns toggle, company modal |
| 4 | `section-transcript-intel` | Transcript Intel — CoSTAR signal table from AM analysis |
| 5 | `section-deals` | Deals & Transactions — Filterable deal cards, tech contracts, AI pattern detection |
| 6 | `section-operations` | Operational Intelligence — Supply chain, PLI, ops metrics table with confidence icons |
| 7 | `section-leadership` | Leadership & Governance — Alerts, timeline, risk scoring, promoter holdings SVGs |
| 8 | `section-competitive` | Competitive Moves — Filterable move cards, heatmap, cross-link to Operations |
| 9 | `section-deep-dive` | Sub-Sector Deep Dive — Cost benchmark, margin levers, A&M benchmarks, scale matrix |
| 10 | `section-am-value-add` | A&M Value-Add — 3-column kanban pipeline (Identified/Qualified/Outreach) |
| 11 | `section-action-lens` | Action Lens — 4 stakeholder tabs with cross-navigation |
| 12 | `section-watchlist` | Watchlist — 2x2 quadrant cards, forward signals |

### Interactive Features

- **Financial table**: Sortable columns, text filter, derived columns toggle, row-click modal
- **Ops metrics table**: Independent sort state, confidence icons (verified/derived/estimated), cross-link (C) badges
- **Deal cards**: Type filter (All/M&A/QIP/PE/VC/Investment)
- **Move cards**: Type filter (All/Product/Pricing/Partnership/Capacity/Distribution/Technology)
- **Action Lens**: 4-tab navigation (PE/Investors, Founders, COOs/CFOs, Supply Chain)
- **Sub-sector cards**: Dynamically computed from COMPANIES array
- **Summary stats**: Computed for Operations and Leadership sections
- **Theme toggle**: Dark/light mode persisted in localStorage
- **Expandable sections**: Watchlist stress methodology, promoter holdings charts

### Key JS Functions

| Function | Purpose |
|----------|---------|
| `renderTable()` | Financial table with sort, filter, derived columns |
| `renderOpsTable()` | Operations metrics with confidence icons and cross-links |
| `renderSubSectorCards()` | Dynamic sub-sector breakdown cards |
| `renderSummaryStats()` | Computed stat rows for Ops and Leadership |
| `filterDeals(type)` | Deal card type filtering |
| `filterMoves(type)` | Competitive move card filtering |
| `switchActionTab(tabId)` | Action Lens tab switching |
| `openCompanyModal(company)` | Company detail modal |
| `toggleDerived()` | Show/hide market intelligence columns |
| `toggleTheme()` | Dark/light mode toggle |

### CSS Design System

- CSS custom properties for all tokens (colors, fonts, spacing)
- Dark mode via `.dark` class overrides
- Key patterns: `.card`, `.stat-row`, `.alert-card`, `.signal-card`, `.persona-card`, `.quadrant-card`
- Interactive: `.filter-bar`, `.tab-bar`, `.type-filter`, `.move-card-item`

## Archive

The `archive/` folder contains previous versions and source data:
- `dashboard_build_v2/` — React + TypeScript version (used as reference for v1 features)
- `consumer-durables-intelligence/` — Original multi-file HTML version
- `src/`, `server/`, `database/` — React app source, Express API, SQLite DB
- Research docs, CSVs, planning files, data pipeline scripts
