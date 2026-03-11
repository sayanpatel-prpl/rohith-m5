# Data Architecture — Page-by-Page Data Flow

> What data is shown on each page, where it comes from, and what transformations happen before rendering.

---

## Data Sources (inline JS objects in `index_v5.html`)

| Object | Line | What it holds | Original source |
|--------|------|---------------|-----------------|
| `FINANCIAL_DATA` | 4207 | 80 rows — quarterly + annual financials (rev, ebitda_pct, pat, rev_growth, roce, de, pe, wc_days, inv_days, debtor_days, ccc) for 16 companies | Screener.in (consolidated financials), BSE/NSE filings, company quarterly results |
| `COMPANY_META` | 4306 | 16 company entries — name, ticker, subSector, amSignal, perf, signalTaxonomy (primary/signals/serviceLines/urgency/thesis/leverMapping/keyMetricGaps), variance (analyst commentary), source, productMix, premiumMix, pitch (engagement brief data) | Intelligence Reports in `rohith-m5/[Company]/` folders, earnings call transcripts, annual reports, pain point CSVs |
| `NEWS_INTELLIGENCE` | 4606 | 3 categories: regulatory (8 items), industry (7), macro (4), companyNews (12), caseStudies (6) | Business Standard, PIB, Statista, J.P. Morgan, Goldman Sachs, IMARC, A&M practice materials, company filings |
| `SIGNAL_DATA` | 5982 | Transcript intel signals per company — each signal has rank, indicator, signal text, status, time period, severity, rationale, confidence tier (direct/calculated/inferred), evidence array [{quote, source doc, reference}] | Company earnings call transcripts, annual reports (governance sections), investor presentations — extracted via `/intel` skill |
| `NARRATIVE_DRIFT` | 6511 | Drift detection for 10 companies — each drift has topic, before narrative (q1), after narrative (q2), shift type (retreat/pivot/silence/reframe/stall/contradiction/escalation), severity, evidence, implication | Cross-quarter earnings call transcript comparison — synthesized from Q1-Q3 FY25 vs FY26 transcripts |
| `ABSENCE_SIGNALS` | 6593 | What companies are NOT disclosing — per company: topic, category, significance (critical/high/medium), context, implication | Identified gaps from intelligence report analysis — what was expected but not found in public disclosures |
| `COMP_MOVES` | 7347 | ~70 competitive moves — company, type (M&A/Product/Capacity/Distribution/Partnership/PLI-Govt/Pricing/Digital/Leadership/Risk), description, impact (High/Medium/Low), source, tier (verified/guidance/estimated), date | BSE/NSE filings, Business Standard, company investor presentations, sector news (each move individually sourced) |
| `OPPORTUNITY_DATA` | 7793 | 12 accounts, ~41 sub-opportunities — each with account, stage (Identified/Qualified/Qualify/Outreach), and subs: opp name, service line, signal evidence, source, tier | Derived/synthesized from SIGNAL_DATA + COMPANY_META + COMP_MOVES — cross-referenced intelligence |
| `THEME_EVIDENCE` | 8848 | 6 sector themes — each with company-level evidence: name, metric, evidence HTML, source, url | Synthesized from all other data objects — cross-company pattern detection |
| `SOURCE_METHODOLOGY` | 8802 | 4 reliability tiers: verified, guidance, estimated, derived — label, reliability level, description, examples | Static methodology framework |

### Derived Objects (computed at runtime)

| Object | Line | Derived from | Transformation |
|--------|------|-------------|----------------|
| `COMPANIES` | 5119 | `COMPANY_META` + `FINANCIAL_DATA` | For each company: merge meta fields + latest quarter financials (via `getLatestQ()`) + 4-quarter trend (via `getTrend()`). Sorted alphabetically. Adds computed fields: `revGrowth`, `ebitdaMargin`, `netProfit`, `qSales`, `latestQ`, `revTrend[]`, `ebitdaTrend[]` |
| `BENCHMARK_DATA` | 5141 | `COMPANIES` | Computes sector-level and sub-sector-level statistics for 9 metrics (ebitdaMargin, roce, de, wcDays, revGrowth, pe, invDays, debtorDays, ccc). Outputs: min, max, median, mean, Q1, Q3, best/worst company, and per-company gap analysis (gapToBest, gapToMedian, percentile) |

### Helper Functions

| Function | Line | Purpose |
|----------|------|---------|
| `getLatestQ(id)` | 5580 | Returns the most recent quarterly row from `FINANCIAL_DATA` for a company |
| `getAnnual(id)` | 5590 | Returns the annual (quarter=null) row from `FINANCIAL_DATA` |
| `getTrend(id)` | 5594 | Returns last 4 quarterly rows sorted chronologically — used for sparkline charts |
| `sparklineSVG(data, color)` | 5216 | Generates inline SVG sparkline from an array of numbers |

---

## Page-by-Page Data Flow

### 1. Executive Snapshot (`section-executive`)

**What's shown:**
- Signal Pipeline cards (companies grouped by urgency: high/medium/watch)
- Big Themes grid (6 sector themes with company evidence)
- Red Flags / Early Warnings
- Talk vs Walk comparison cards
- Earnings Grid (Q3 FY26 snapshot)
- Market Pulse summary signals

**Data sources → transforms → display:**

| Component | Data Source | Transform | What renders |
|-----------|-----------|-----------|-------------|
| Signal Pipeline cards | `COMPANIES` (which includes `signalTaxonomy` from `COMPANY_META`) | `renderSignalPipeline()` filters by `signalTaxonomy.urgency` (high/medium/watch), paginates 6 per page | Company cards showing: name, engagement type badge, thesis implication, "View intel brief" button (opens SIGNAL_DATA), "Pitch Deck" button (opens COMPANY_META.pitch) |
| Urgency tabs | `COMPANIES` → `signalTaxonomy.urgency` | `renderUrgencyTabs()` counts companies per urgency level | Tab buttons: High Priority (count), Medium (count), Watch (count) |
| Big Themes | `THEME_EVIDENCE` | Hardcoded HTML grid in markup (lines ~2070-2180), evidence drawer opened via `openEvidenceDrawer()` reading `THEME_EVIDENCE[themeId].companies[index]` | 6 theme cards; clicking opens evidence drawer with company-level metric + evidence text + source URL |
| Red Flags section | **Hardcoded HTML** (lines ~2200-2500) | No JS rendering — static HTML cards | Alert cards for copper, aluminum, BEE, GST, BLDC transition, PLI — with cross-links to other sections |
| Talk vs Walk | `COMPANY_META` (via `COMPANIES`) — specifically the `variance` and `signalTaxonomy` fields | `initTvwPagination()` — reads hardcoded HTML cards in DOM, paginates them | Company cards showing: management says (from `variance`), data shows (from `signalTaxonomy` or hardcoded evidence), badge (disconnect/stealth/aligned) |
| Earnings Grid | **Hardcoded HTML** (lines ~3580-3700) | Static markup — no JS data binding | Q3 FY26 earnings cards for each company with key metrics |
| Market context signals | `NEWS_INTELLIGENCE` rendered in sidebar references, but mostly **hardcoded HTML** in the executive section | Static cross-reference links | Links to Market Pulse and other sections |

**Key insight:** The Talk vs Walk cards and Earnings Grid are **hardcoded HTML**, not rendered from data. Big Themes are hardcoded in HTML but use `THEME_EVIDENCE` for the evidence drawer. Only the Signal Pipeline is fully JS-driven.

---

### 2. Market Pulse (`section-market-pulse`)

**What's shown:**
- Demand signals, input cost trends, regulatory changes
- EBITDA margin band visualization
- News Intelligence grid (regulatory, industry, macro, company news, case studies)
- Regulatory timeline
- Catalyst grid
- Macro backdrop

**Data sources → transforms → display:**

| Component | Data Source | Transform | What renders |
|-----------|-----------|-----------|-------------|
| Margin Bands | `COMPANIES` → `ebitdaMargin` | `renderMarginBands()` — sorts all margins, computes P25/median/P75, plots company markers on track. Groups by sub-sector | Visual distribution strip showing where each company's EBITDA margin falls vs sector |
| Regulatory Grid | `NEWS_INTELLIGENCE.regulatory` | `renderRegulatoryGrid()` — iterates regulatory items, renders cards with status/impact/affected companies | Cards with: title, status badge (active/upcoming/expiring), impact (headwind/tailwind), affected companies, date |
| Catalyst Grid | `NEWS_INTELLIGENCE.industry` + `NEWS_INTELLIGENCE.companyNews` | `renderCatalystGrid()` — combines industry trends and company-specific news into cards | Industry trend cards + company news cards with impact badges |
| Macro Backdrop | `NEWS_INTELLIGENCE.macro` | `renderMacroBackdrop()` — renders macro signals | Cards: copper, aluminum, RBI rate, real estate cycle with affected companies and segments |
| Case Studies | `NEWS_INTELLIGENCE.caseStudies` | Rendered in catalyst grid area | A&M engagement precedents with results, relevance to tracked companies |
| Top-level signal cards | **Hardcoded HTML** (lines ~2100-2500 area) | Static demand signal cards, input cost cards | BEE Star, GST changes, copper/aluminum trends, PLI/ECMS |

**Key insight:** The summary signal cards at the top of Market Pulse are **hardcoded HTML**. The dynamic content comes from `NEWS_INTELLIGENCE` for regulatory/industry/macro and from `COMPANIES` for the margin band chart.

---

### 3. Financial Performance (`section-financial`)

**What's shown:**
- Sortable 16-company financial table with sparklines
- Derived columns toggle (benchmark gaps, percentiles)
- Company account filter dropdown

**Data sources → transforms → display:**

| Component | Data Source | Transform | What renders |
|-----------|-----------|-----------|-------------|
| Main table | `COMPANIES` (derived from `FINANCIAL_DATA` + `COMPANY_META`) | `renderTable()` — sorts by `currentSort.field/dir`, filters by `ACCT_SEL['financial']`, renders each company row | Row per company: name/ticker, sub-sector, latest quarter, revenue, EBITDA%, PAT, rev growth, ROCE, D/E, P/E, sparkline (from `revTrend`/`ebitdaTrend` via `sparklineSVG()`) |
| Derived columns | `BENCHMARK_DATA` + `COMPANIES` | `toggleDerived()` shows/hides columns that display `BENCHMARK_DATA.companyGaps[id]` — gap to median, percentile rank, best-in-class comparison | Extra columns: sector median, gap to best, percentile badge |
| Sort behavior | `currentSort` state | `sortData(field)` toggles asc/desc, calls `renderTable()` | Arrow indicators on column headers |
| Account filter | `ACCT_SEL['financial']` | `renderAcctList('financial')` — checkbox dropdown to show/hide companies | Multi-select dropdown |
| Sub-sector cards | `COMPANIES` grouped by `subSector` | `renderSubSectorCards()` — groups companies by sub-sector, computes group averages | Cards per sub-sector: avg revenue, avg EBITDA margin, company count |

**Real data sources:** All financial numbers (rev, ebitda_pct, pat, rev_growth, roce, de, pe, wc_days, etc.) come from `FINANCIAL_DATA` which is sourced from **Screener.in consolidated financials** and **BSE/NSE quarterly filings**.

---

### 4. Transcript Intel (`section-transcript-intel`)

**What's shown:**
- Company sidebar list with signal counts
- Signal table per company (ranked, with severity/confidence badges)
- Evidence vault (expandable quotes with source/reference)
- Risk scorecard
- Signal distribution chart
- Narrative Drift detection
- Absence Signals (what they're not saying)
- EBITDA mini-chart per company

**Data sources → transforms → display:**

| Component | Data Source | Transform | What renders |
|-----------|-----------|-----------|-------------|
| Company sidebar | `SIGNAL_DATA` (keys = company IDs) | `renderIntelSidebar()` — lists companies with signal count | Sidebar links: company name + signal count badge |
| Signal table | `SIGNAL_DATA[companyId].signals` | `renderSignalTable()` — renders each signal row with severity/confidence coloring | Table: rank, indicator, signal text, status (Positive/Negative/Watch), severity (Critical→Informational), confidence tier (direct/calculated/inferred) |
| Evidence vault | `SIGNAL_DATA[companyId].signals[i].ev[]` | `renderIntelContent()` → expandable evidence rows | Evidence quotes with: quote text, source document, reference (page/line) |
| Risk scorecard | `SIGNAL_DATA[companyId].signals` | `renderRiskScorecard()` — counts signals by severity | Severity distribution: Critical, High, Medium, Low counts |
| Signal distribution | `SIGNAL_DATA[companyId].signals` | `renderSignalDistribution()` — counts by status | Positive/Negative/Watch signal distribution bar |
| Narrative Drift | `NARRATIVE_DRIFT[companyId].drifts` | `renderNarrativeDrift(companyFilter)` — renders drift cards | Cards: topic, before/after narrative, shift type badge (retreat/pivot/silence/etc.), severity, evidence text, implication |
| Absence Signals | `ABSENCE_SIGNALS[companyId].absences` | `renderAbsenceSignals(companyFilter)` — renders absence cards | Cards: topic, category, significance badge, context, implication |
| EBITDA mini-chart | `FINANCIAL_DATA` (via `getTrend()`) | `renderEbitdaMiniChart(companyId)` — sparkline of last 4 quarters | Small inline EBITDA trend chart |

**Real data sources:** `SIGNAL_DATA` signals are extracted from **earnings call transcripts** (BSE filings), **annual reports** (governance sections), **investor presentations** via the `/intel` skill. `NARRATIVE_DRIFT` is synthesized by comparing management statements across quarters. `ABSENCE_SIGNALS` are gaps identified during intelligence report creation.

---

### 5. Deals & Transactions (`section-deals`)

**What's shown:**
- Deal cards with type filter (M&A, Capacity, Product, Distribution, etc.)
- Date filter (by year)
- Company account filter

**Data sources → transforms → display:**

| Component | Data Source | Transform | What renders |
|-----------|-----------|-----------|-------------|
| Deal cards | **Hardcoded HTML** in markup (lines ~3350-3600) | `filterDeals(type)` — shows/hides cards by `data-deal-type` attribute; `filterDealsByDate(year)` — by `data-deal-year`; `filterDealsCompany()` — by account selection | Cards: company name, deal type badge, description, impact, source tier badge, date |
| Type filter buttons | **Hardcoded HTML** | `filterDeals(type)` toggles `.active` class on buttons | Filter bar: All, M&A, JV, Divestiture, Investment |
| Company filter | `ACCT_SEL['deals']` | `filterDealsCompany()` — filters hardcoded cards by company name matching | Dropdown multi-select |

**Key insight:** Deal cards are **hardcoded HTML**, not rendered from a JS data array. The JS only handles filtering/showing/hiding the static cards. Source data comes from **BSE/NSE filings, VCCEdge, Business Standard, company press releases**.

---

### 6. Operational Intelligence (`section-operations`)

**What's shown:**
- Summary stats (company count, avg EBITDA, avg ROCE, diagnostic triggers)
- Ops metrics table with confidence icons and cross-link badges
- Company account filter

**Data sources → transforms → display:**

| Component | Data Source | Transform | What renders |
|-----------|-----------|-----------|-------------|
| Summary stats | `COMPANIES` | `renderSummaryStats()` — computes avg EBITDA, avg ROCE across all companies | Stat boxes: companies tracked, avg EBITDA %, avg ROCE %, diagnostic trigger count |
| Ops table | **Hardcoded HTML** table (lines ~3820-4150) | `renderOpsTable()` applies account filtering; cross-link badges are static | Table rows: company, metric, value, trend arrow, confidence icon, cross-link badges to other sections |
| Company filter | `ACCT_SEL['ops']` | `filterCompanies('ops')` filters which companies appear | Dropdown multi-select |

**Key insight:** The ops metrics table is **hardcoded HTML**. JS only filters it by company. Source: **company annual reports, quarterly filings, earnings calls, Screener.in**.

---

### 7. Competitive Moves (`section-competitive`)

**What's shown:**
- Move cards with type filter (M&A, Capacity, Product, Partnership, PLI/Govt, Pricing)
- Scope filter (company-level vs industry-level)
- Competitive heatmap (company x move-type matrix)
- Company account filter

**Data sources → transforms → display:**

| Component | Data Source | Transform | What renders |
|-----------|-----------|-----------|-------------|
| Move cards | **Hardcoded HTML** in markup (lines ~2700-3200) | `filterMoves(type)` shows/hides by `data-move-type`; `filterMoveScope(scope)` by `data-move-scope`; `filterMovesCompany()` by account | Cards: company, move type badge, description, impact, source tier, date |
| Competitive heatmap | `COMP_MOVES` (JS array) | `renderCompHeatmap()` — builds company x type matrix from `COMP_MOVES[]`, counts moves per cell, sorts by total | Interactive heatmap grid: rows = companies, columns = move types. Cell intensity = move count. Clickable for drilldown |
| Heatmap drilldown | `COMP_MOVES` | `showHeatmapDrilldown(company, type)` — filters `COMP_MOVES` by company + type | List of matching moves with full details |
| Type/scope filters | **Hardcoded HTML** | Toggle button active state | Filter bar buttons |

**Key insight:** The individual move cards in the main grid are **hardcoded HTML** — JS only filters them. But the heatmap is **dynamically rendered from `COMP_MOVES` array**. Sources: **BSE/NSE filings, Business Standard, company investor presentations, Digitimes, sector news**.

---

### 8. Leadership & Governance (`section-leadership`)

**What's shown:**
- Leadership alert cards (changes, governance events, risk scoring)
- Company account filter

**Data sources → transforms → display:**

| Component | Data Source | Transform | What renders |
|-----------|-----------|-----------|-------------|
| Leadership cards | **Hardcoded HTML** (lines ~3250-3400) | `filterLeadershipCards()` — shows/hides by company account selection | Alert cards: company, alert type, title, description, risk score, date, source tier |
| Company filter | `ACCT_SEL['lead']` | Account filter applied | Dropdown |

**Key insight:** Entirely **hardcoded HTML**. JS only does company filtering. Sources: **BSE filings, company annual reports, Sovrenn MD compilations, BSE board meeting outcomes**.

---

### 9. Sub-Sector Deep Dive (`section-deep-dive`)

**What's shown:**
- Product-Market Peer Groups (7 groups with comparison tables)
- Benchmark comparison table (sector-wide + sub-sector stats)
- Product Mix grid per company
- Premium Mix chart
- Revenue trend chart + EBITDA trend chart + ROCE comparison
- Scale matrix
- Working capital heatmap

**Data sources → transforms → display:**

| Component | Data Source | Transform | What renders |
|-----------|-----------|-----------|-------------|
| Peer Groups | `PEER_GROUPS` (hardcoded array, line 8523) + `COMPANIES` | `renderPeerGroups()` — for each group, looks up companies from `COMPANIES[]`, renders comparison table | 7 peer group tables: Room AC, Fans & Coolers, Kitchen, Washing, Wires, EMS, Water Purification. Each shows: revenue, EBITDA%, ROCE, D/E, P/E per company |
| Benchmark table | `BENCHMARK_DATA` + `COMPANIES` | `renderBenchmarkTable()` — renders sector-wide and per-sub-sector stats for 9 metrics | Table: metric name, sector median, Q1/Q3 range, best/worst company, sub-sector breakdown |
| Product Mix grid | `COMPANIES` → `productMix` (from `COMPANY_META`) | `renderProductMixGrid()` — for each company, renders segment bars proportional to percentage | Stacked horizontal bars: segment name + percentage per company |
| Premium Mix chart | `COMPANIES` → `premiumMix` (from `COMPANY_META`) | `renderPremiumMixChart()` — for each company, renders premium/mass/economy split | Stacked bars: premium %, mass %, economy % per company |
| Revenue trend chart | `COMPANIES` → `revTrend` (from `FINANCIAL_DATA` via `getTrend()`) | `renderRevenueTrendChart()` — renders quarterly revenue trend lines | Multi-company line chart (last 4 quarters) |
| EBITDA trend chart | `COMPANIES` → `ebitdaTrend` | `renderEbitdaTrendChart()` — renders quarterly EBITDA margin trends | Multi-company line chart |
| ROCE comparison | `COMPANIES` → `roce` | `renderRoceComparison()` — horizontal bar chart sorted by ROCE | Bar chart: company name + ROCE value |
| WC heatmap | `COMPANIES` → `wcDays` | `renderWcHeatmap()` — color-coded cells by working capital days | Heatmap: company x metric (wc_days, inv_days, debtor_days, ccc) |

**Real data sources:** `productMix` and `premiumMix` from `COMPANY_META` (sourced from **annual reports, investor presentations**). Financial metrics from `FINANCIAL_DATA` (sourced from **Screener.in**). `PEER_GROUPS` is a manually curated grouping.

---

### 10. Advisory Pipeline (`section-am-value-add`)

**What's shown:**
- Signal-driven opportunity pipeline table (12 accounts, 41 sub-opportunities)
- Stage filter (Identified, Qualified, Qualify, Outreach)
- Account selection dropdown

**Data sources → transforms → display:**

| Component | Data Source | Transform | What renders |
|-----------|-----------|-----------|-------------|
| Pipeline table | `OPPORTUNITY_DATA` | `renderOppPipeline()` — sorts by account name, groups by account, renders sub-opportunities with signal badges and source tier pills | Table: account name, stage badge, sub-opportunity name, service line, signal evidence text, source attribution, tier badge (verified/guidance/estimated/derived) |
| Stage filter | `OPPORTUNITY_DATA` → unique stages | `toggleOppDropdown()` — filters accounts by stage | Dropdown or button group for stages |
| Source pills | Each sub-opportunity's `source` field | `renderSourcePills(sourceStr)` — splits source string by `|` or `,` and renders as individual pills | Small colored pills showing each source document |

**Real data sources:** `OPPORTUNITY_DATA` is **synthesized/derived** from all other data objects — it's the A&M advisory team's interpretation of which companies have actionable opportunities based on SIGNAL_DATA, COMPANY_META (signalTaxonomy), COMP_MOVES, and NARRATIVE_DRIFT.

---

### 11. Action Lens (`section-action-lens`)

**What's shown:**
- 4 persona tabs: PE/Investors, Founders, COOs/CFOs, Supply Chain
- Each tab has action cards with recommendations

**Data sources → transforms → display:**

| Component | Data Source | Transform | What renders |
|-----------|-----------|-----------|-------------|
| Persona tabs | **Hardcoded HTML** | `switchActionTab(tabId)` — shows/hides `.action-tab-panel` divs | Tab buttons: PE/Investors, Founders, COOs/CFOs, Supply Chain |
| Action cards | **Hardcoded HTML** (lines ~3750-4050 area) | No JS rendering — static HTML per persona | Cards: company name, recommendation title, description, action items, source attribution |

**Key insight:** Entirely **hardcoded HTML**. No JS data binding. Content is synthesized from intelligence reports — written once and directly placed in markup.

---

### 12. Watchlist & Forward Indicators (`section-watchlist`)

**What's shown:**
- Quadrant cards (company watchlist entries with severity scores)
- Forward signal indicators
- Company account filter

**Data sources → transforms → display:**

| Component | Data Source | Transform | What renders |
|-----------|-----------|-----------|-------------|
| Quadrant cards | **Hardcoded HTML** (lines ~4050-4200) | `filterWatchlistEntries()` — shows/hides by company account selection | Cards: company, signal text, detail, severity score (1-5), forward signals list, catalyst triggers |
| Company filter | `ACCT_SEL['watch']` | Account filter applied | Dropdown |

**Key insight:** **Hardcoded HTML**. JS only does company filtering. Content is derived from intelligence analysis across all data sources.

---

## Cross-Cutting Features

### Company Modal / Drawer
- **Triggered by:** Clicking company name or card in various sections
- **Data source:** `COMPANIES` (merged) + `COMPANY_META` (full details: variance, source, signalTaxonomy)
- **Function:** `openCompanyModal(c)` — renders a detail overlay with: financials, signal taxonomy, thesis (SCI), product mix, premium mix, variance commentary, source attribution

### Pitch Deck Modal
- **Triggered by:** "Pitch Deck" button on Executive Snapshot signal cards
- **Data source:** `COMPANY_META[id].pitch` — only exists for 5 companies (bajaj, bluestar, symphony, voltas, and partially others)
- **Function:** `openPitchDeck(companyId)` — renders: current EBITDA, peer comparison, "Why Now" narrative, investigation areas (with evidence strength + data needed + management quotes), entry strategy (contact + message), risks, evidence quotes
- **Real source:** Custom-written engagement briefs per company, referencing specific earnings call quotes and filing data

### Signal Evidence Modal
- **Triggered by:** "View intel brief" button on signal cards
- **Data source:** `SIGNAL_DATA[companyId]` + `NARRATIVE_DRIFT[companyId]` + `ABSENCE_SIGNALS[companyId]`
- **Function:** `openSignalEvidence(companyId)` — renders: top signals table, narrative drift cards, absence signals, EBITDA mini-chart

### Evidence Drawer (Big Themes)
- **Triggered by:** Clicking a company within a Big Theme card
- **Data source:** `THEME_EVIDENCE[themeId].companies[index]`
- **Function:** `openEvidenceDrawer(themeId, companyIndex)` — renders: company name, metric, evidence HTML, source, URL link

### Theme Toggle / Dark Mode
- **Data source:** `localStorage` for theme preference
- **Function:** `toggleTheme()` — toggles `.dark` class on `<html>`

### Source Methodology Tooltips
- **Data source:** `SOURCE_METHODOLOGY` — 4 tier definitions
- **Function:** Self-executing function (line 8834) that attaches tooltips to all `.source-tier` elements

---

## Summary: What's Dynamic vs Hardcoded

| Section | JS-Rendered (from data objects) | Hardcoded HTML |
|---------|-------------------------------|----------------|
| Executive Snapshot | Signal Pipeline cards, Urgency tabs | Big Themes grid, Red Flags, Talk vs Walk cards, Earnings Grid |
| Market Pulse | Margin Bands chart, Regulatory Grid, Catalyst Grid, Macro Backdrop | Top summary signal cards |
| Financial Performance | Full table, derived columns, sub-sector cards | Nothing — fully dynamic |
| Transcript Intel | Full sidebar, signal table, evidence vault, risk scorecard, drift, absence, mini-charts | Nothing — fully dynamic |
| Deals & Transactions | Nothing — only filtering | All deal cards are hardcoded |
| Operational Intelligence | Summary stats only | Ops metrics table is hardcoded |
| Competitive Moves | Heatmap only | Move cards are hardcoded |
| Leadership & Governance | Nothing — only filtering | All leadership cards are hardcoded |
| Sub-Sector Deep Dive | Peer groups, benchmarks, all charts, product/premium mix | Nothing — fully dynamic |
| Advisory Pipeline | Full pipeline table | Nothing — fully dynamic |
| Action Lens | Nothing | All persona cards are hardcoded |
| Watchlist | Nothing — only filtering | All watchlist cards are hardcoded |

---

## Data Provenance by Original Source Type

| Source Type | What it feeds | Examples |
|-------------|--------------|---------|
| **Screener.in** (consolidated financials) | `FINANCIAL_DATA` — all numerical financial metrics | Revenue, EBITDA %, PAT, ROCE, D/E, P/E, WC Days |
| **BSE/NSE quarterly filings** | `FINANCIAL_DATA` (Q3 FY26 actuals), `COMP_MOVES`, Leadership cards | Board meeting outcomes, quarterly results |
| **Earnings call transcripts** | `SIGNAL_DATA`, `NARRATIVE_DRIFT`, parts of `COMPANY_META.variance` | Management quotes, guidance changes, strategy commentary |
| **Annual reports** (governance sections) | `SIGNAL_DATA` evidence, `COMPANY_META` (signalTaxonomy, leverMapping) | Cost breakdowns, capacity data, workforce data, risk factors |
| **Investor presentations** | `COMPANY_META` (productMix, premiumMix, pitch), `COMP_MOVES` | Segment data, strategy updates, financial guidance |
| **Intelligence Reports** (`rohith-m5/[Company]/`) | `COMPANY_META` (signalTaxonomy, pitch), `OPPORTUNITY_DATA` | Full company intelligence synthesis |
| **Pain Point CSVs** (`rohith-m5/[Company]/`) | `SIGNAL_DATA`, `ABSENCE_SIGNALS` | Structured pain point extraction |
| **News / Research** (Business Standard, PIB, J.P. Morgan, etc.) | `NEWS_INTELLIGENCE`, `COMP_MOVES` | Regulatory changes, commodity prices, sector analysis |
| **A&M practice materials** | `NEWS_INTELLIGENCE.caseStudies`, `OPPORTUNITY_DATA` | Case study references, engagement types |
| **Cross-company synthesis** | `THEME_EVIDENCE`, `OPPORTUNITY_DATA`, `BENCHMARK_DATA` | Pattern detection across all 16 companies |
