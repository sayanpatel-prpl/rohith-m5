# Memory — Consumer Durables Intelligence Dashboard

## Session History (newest first)

### Session 7 (current) — Market Pulse + Operational Intelligence tabs

**Status: COMPLETE — Market Pulse and Operational Intelligence tabs fully populated with real/researched data.**

**Data source**: `operational-intelligence-data.md` (591 lines, compiled Feb 20 2026) + `Indian Consumer Durables Deep Dive.md` (42 cited sources, Feb 19 2026)

**Changes this session**:

- **Operational Intelligence — data.js**:
  - `operationalMetrics.capacityUtilization`: Updated ALL 15 values from operational-intelligence-data.md (e.g., Voltas 82→90 VERIFIED, Havells 85→87, Blue Star 80→78, Symphony 70→70, IFB 58→62, Bosch 65→55)
  - `operationalMetrics.localizationPct`: Updated ALL 15 values (e.g., Voltas 70→74, Havells 87→88, Symphony 88→55 — corrected for 100% outsourced model, Dixon 55→58)
  - `operationalMetrics.contractManufacturingPct`: Corrected Symphony 45→100, Dixon/Amber already 0, Bajaj 40→35, Crompton 30→18
  - `operationalMetrics.afterSalesCostPct`: Updated all from research (IFB 4.2→4.0, Havells 1.8→1.5, Symphony 1.5→1.2)
  - `operationalMetrics.vendorConsolidationIndex`: Updated all (Havells 80→82, Bajaj 45→48, Symphony 82→78)
  - **NEW**: `operationalMetrics.importDependency` — 15 companies, DERIVED from localization %
  - **NEW**: `operationalMetrics.warrantyPct` — 15 companies, ESTIMATED from category benchmarks
  - **NEW**: `operationalMetrics.dealerProductivity` — 7 companies with data, 8 null (no disclosure)
  - `productMix`: Updated ALL 15 companies from research (Whirlpool 35→30, Bluestar 45→35, IFB 50→40, Havells 40→35, Bosch 60→45)

- **Market Pulse — data.js**:
  - `marketPulse.inputCosts`: Populated copper/steel/aluminum/polymer indices (Q1 FY23=100 base)
  - `marketPulse.demandSignals.volumeGrowth`: ESTIMATED split from total revenue growth
  - `marketPulse.demandSignals.priceGrowth`: ESTIMATED split from total revenue growth
  - **NEW**: `marketPulse.commodityOutlook` — Copper, aluminum, steel 2026 forecasts with source
  - **NEW**: `marketPulse.policyImpact` — Budget 2026 + BEE norms impact data
  - **NEW**: `marketPulse.q3Earnings` — Q3 FY26 scorecard (Havells, Voltas, Blue Star, Crompton)
  - **NEW**: `marketPulse.urbanRuralSplit` — Urban premium growth vs rural volume weakness

- **Operational Intelligence — index.html**:
  - Removed `mock-data` class from Operational Metrics table and both charts
  - Added source attributions on card headers
  - Added new cards: Supply Chain Risk Matrix, Manufacturing Capacity Tracker, Retail Footprint
  - Added Q3 FY26 Earnings context cards

- **Market Pulse — index.html**:
  - Removed `mock-data` class from Input Cost Trends and Channel Mix (now populated)
  - Added new cards: Q3 FY26 Earnings Summary, Commodity & Cost Outlook, Policy Impact, Urban vs Rural
  - Added source attributions

- **charts.js**:
  - Updated capacity scatter chart y-axis min from 50→45 (Bosch/JCH at 55)
  - Updated `renderInputCostsChart` keys: `plastic`/`logistics` → `aluminum`/`polymer`; added axis title "Index (Q1 FY23 = 100)"
  - **NEW**: `renderImportRiskChart` — horizontal bar chart with color-coded risk thresholds (>35% red, >25% amber, ≤25% green)
  - Added `renderImportRiskChart` to both `renderAll` and `updateFiltered`
- **app.js**:
  - Updated `renderOperationalTable` to read importDependency/warrantyPct/dealerProductivity from `operationalMetrics` instead of `financials`
  - **NEW**: `renderMfgFootprint` — manufacturing footprint table (plants, capex, expansion signals)
  - **NEW**: `renderRetailFootprint` — retail distribution table (dealers, productivity, expansion signals)
  - **NEW**: `renderQ3EarningsCards` — Q3 FY26 earnings stat cards with color signals
  - **NEW**: `renderCommodityOutlook` — commodity outlook table with impact badges
  - **NEW**: `renderPolicyImpact` — policy impact table with tailwind/headwind indicators
  - **NEW**: `renderUrbanRural` — urban/rural dynamics with home improvement boom metrics
  - Added all new functions to `renderAllSections`
- **filters.js**: Added `renderMfgFootprint` and `renderRetailFootprint` to `applyFilters`

### Session 6 — Financial Tracker tab PAUSED

**Status: All Financial Tracker tab work complete. Paused here — moving to other tabs next.**

- **Financial Tracker — Modal Removed & Missing Data Cleanup (app.js)**:
  - Removed click-to-open modal from Financial Performance Tracker table rows (removed `class="clickable"` and click event binding)
  - All missing/null data now shows `-` consistently instead of `N/A`:
    - YoY Growth column: `N/A` → `-`
    - Trend icon column: flat arrow → `-` when no YoY data
    - Rating badge: `N/A` → `-`
    - Summary cards (Avg ROCE, Avg EBITDA): `N/A` → `-`
  - `showCompanyModal()` function retained in code (may be used by other sections) but no longer triggered from Financial Tracker table

- **Revenue Trend & EBITDA Trend Charts — Readability Overhaul (charts.js)**:
  - **X-axis shortened**: "Q1 FY23" → "Q1'23" via ticks callback (`.replace(' FY', "'")`)
  - **X-axis horizontal**: `maxRotation: 0`, `autoSkip: true` — no angled labels
  - **FY boundary markers**: subtle vertical grid lines at Q1 of each fiscal year (`rgba(0,0,0,0.08)`)
  - **Spaghetti → scannable**: lines start at 60% opacity (`color + '99'`), no point dots (`pointRadius: 0`)
  - **Hover-to-highlight**: `trendChartHoverHandler` function — hovering a line makes it bold (3px, 100% opacity), dims all others to 33% opacity (`'55'`). Mouse out restores default state.
  - **Hover dimming tuned**: originally 12% opacity was too aggressive — raised to 33% (`'55'`) with borderWidth 1.2 so non-hovered lines remain visible as context
  - **Better targeting**: `interaction: { mode: 'nearest', intersect: false }` — tooltip snaps to nearest line without needing exact hit
  - Each dataset stores `baseColor` property for the hover system to reference
  - Applied identically to both `renderRevenueTrendChart` and `renderEbitdaTrendChart`

- **Chart Layout & X-axis Trimming (index.html + charts.js + main.css)**:
  - **Full-width stacking**: Revenue Trend and EBITDA Trend charts moved from `grid-2` (side by side) to stacked vertically — each gets full horizontal width
  - **X-axis trimming**: `trimLeadingNulls(companies, metric, start, end)` helper function skips quarters where NO company has data. E.g., if data starts at Q3 FY23 (index 2), x-axis starts there instead of showing blank Q1/Q2 FY23
  - Applied to both `renderRevenueTrendChart` (trims on `revenue`) and `renderEbitdaTrendChart` (trims on `ebitdaMargin`)

- **ROCE Chart — Stable Sizing & Readable Labels (charts.js + main.css)**:
  - **Dynamic height**: `36px × number_of_bars + 60px` padding, set on container via JS. No more aspect ratio jumps when filters change company count
  - **CSS**: removed fixed `max-height: 480px` on `.chart-container--roce canvas`, set `max-height: none` so JS-driven height is respected
  - **Y-axis labels**: `font.weight: 500`, `padding: 6`, `crossAlign: 'far'` — company names are bolder, better spaced, right-aligned to bars
  - **Bar sizing**: `barPercentage: 0.7`, `categoryPercentage: 0.8` — slightly tighter bars for cleaner look
  - **Layout padding**: `right: 40, left: 4` — more room for datalabel percentages on the right

### Session 5
- **Data Source Attribution — Inline on All Tabs**: Added source hyperlinks directly inline on each chart card header and below the financial table. Replaced large attribution table blocks with compact inline `Source: [Link]` annotations in card headers (right-aligned). All links open in new tab.

- **Financial Tracker**:
  - Below financial table: one-line source bar mapping each metric → Screener.in section (Quarterly Results, Ratios, Balance Sheet, Cash Flow) + Trendlyne cross-validation link
  - Revenue Trend chart header → `Source: Screener.in Quarterly Results`
  - EBITDA Margin Trend chart header → `Source: Screener.in Quarterly Results`
  - ROCE Comparison chart header → `Source: Screener.in Ratios (Annual)`
  - WC vs Inv Days Heatmap header → `Source: Screener.in Ratios (Annual)`
  - Per-company source links: 14 Screener.in consolidated page hyperlinks (compact inline)

- **Market Pulse**:
  - Demand Signals chart header → `Source: Screener.in — aggregate of 14 companies`
  - EBITDA Margin Bands chart header → `Source: Screener.in — P75/mean/P25 of 14 companies`

- **Deals & Transactions**:
  - Section description → `Source: Sovrenn Deal Activity (Jun 2025 – Feb 2026)`

- **Leadership & Governance**:
  - Earnings Quality chart header → `Source: Sovrenn Quarterly Result Tags`

- **Sub-Sector Deep Dive**:
  - Segment Size & Growth chart header → `Source: Screener.in — revenue by sub-category`
  - Cost Structure Benchmarks chart header → `Source: Screener.in — OPM% quartiles`
  - Scale vs Profitability chart header → `Source: Screener.in — Revenue, EBITDA %, ROCE`

- **Watchlist & Forward Indicators**:
  - Earnings Quality Ranking chart header → `Source: Sovrenn Quarterly Result Tags`

- **Tabs NOT attributed** (all mock/editorial): Executive Snapshot, Operational Intelligence, Competitive Moves, Stakeholder Insights, A&M Value-Add

### Session 4
- **ROCE chart**: Made full-width, horizontal bars sorted desc, 5-tier colors, datalabels plugin
- **Financial Tracker**: Filled inventoryDays, netDebtEbitda, capexIntensity, workingCapDays, roce with REAL data from screener-financials.json (annual values mapped to quarters)
- **Market Pulse**: Replaced mock demand signals with real sectorRevenueGrowthYoY (computed from 14 companies). Set volumeGrowth/priceGrowth/inputCosts to null (no source). Real EBITDA bands (mean/P75/P25) computed from quarterly margins
- **Sub-Sector Deep Dive**: Real segment aggregation (White Goods 49,220 Cr, Consumer Electronics 90,260 Cr). Cost structure: only totalExpenses quartiles available (individual breakdowns null)
- **Deals**: Replaced 6 mock deals with 7 real Sovrenn deals (Amber Enterprises 2025-2026)
- **Sentiment**: Replaced mock news/analyst/social scores with real Sovrenn quarterly result tag scores. Only "overall" score available (news/analyst/social = null). Chart changed from grouped bars to color-coded single bar. Radar changed to horizontal bar ranking.
- **UI updates**: Chart titles updated (Demand, Sentiment, Radar). Financial Tracker headers show "(Ann.)" for annual metrics. Charts handle null data gracefully (show "No data" messages instead of crashing)
- **Added**: chartjs-plugin-datalabels CDN, extract-all-data.cjs script, compute-market-pulse.cjs script

### Session 3
- Wired up Time Period filter (was dead — stored value but nothing read it)
- Replaced static editorial ratings with peer-relative auto-computed scoring
- Verified all 4 Financial Tracker charts already use real data (no separate update needed)

### Sessions 1-2
- Populated Financial Tracker with REAL verified data from source files
- Replaced all mock/dummy data in data.js financials section (lines 258-507)
- 15 companies, 14 with source data, 1 (bosch_jch) all-null

---

## Data Architecture

### Source Files
- `data_sources/extracted/<company>/consolidated.json` — revenue (salesCr), EBITDA margin (ebitdaMarginPct), PAT margin (calculated: netProfitCr/salesCr*100)
- `data_sources/extracted/financial-api-data.json` — Working Capital Days (history array), ROCE (metrics)

### Quarter Index Mapping (15 slots, Indian FY = Apr-Mar)
| Index | Quarter  | Calendar   | Data Available? |
|-------|----------|------------|-----------------|
| 0     | Q1 FY23  | Jun 2022   | null (no source) |
| 1     | Q2 FY23  | Sep 2022   | null (no source) |
| 2     | Q3 FY23  | Dec 2022   | Yes (start of consolidated.json) |
| 3     | Q4 FY23  | Mar 2023   | Yes |
| 4     | Q1 FY24  | Jun 2023   | Yes |
| 5     | Q2 FY24  | Sep 2023   | Yes |
| 6     | Q3 FY24  | Dec 2023   | Yes |
| 7     | Q4 FY24  | Mar 2024   | Yes |
| 8     | Q1 FY25  | Jun 2024   | Yes |
| 9     | Q2 FY25  | Sep 2024   | Yes + WC Days + ROCE start |
| 10    | Q3 FY25  | Dec 2024   | Yes + WC Days + ROCE |
| 11    | Q4 FY25  | Mar 2025   | Yes + WC Days + ROCE |
| 12    | Q1 FY26  | Jun 2025   | Yes + WC Days + ROCE |
| 13    | Q2 FY26  | Sep 2025   | Yes + WC Days + ROCE |
| 14    | Q3 FY26  | Dec 2025   | Yes + WC Days + ROCE |

### Company ID Mapping (data.js → source folder)
- `bajaj_elec` → `bajaj`
- `ttk_prestige` → `ttk`
- `bosch_jch` → NO source file (all fields null)
- All others: same ID as folder name

### Additional Source Files (Session 4)
- `data_sources/extracted/<company>/screener-financials.json` — balance_sheet (Borrowings), cash_flow (Cash from Investing), ratios (Inventory Days, Working Capital Days, ROCE), profit_and_loss (Revenue, Operating Profit, Depreciation)
- `data_sources/extracted/sovrenn-intelligence.json` — quarterlyResults (tags: EXCELLENT/GOOD/AVERAGE/POOR/WEAK), dealActivity (dates, types, values)

### Annual-to-Quarterly Mapping (Session 4)
For metrics only available as annual (Inventory Days, ROCE, Net Debt/EBITDA, Capex Intensity, Working Capital Days):
- FY23 annual → repeated at indices 0-3 (Q1-Q4 FY23)
- FY24 annual → repeated at indices 4-7
- FY25 annual → repeated at indices 8-11
- FY26 (not yet available) → indices 12-14 use FY25 values as latest

### Metrics with NO Source Data (still null)
asp (average selling price — not available for most companies)

### Metrics Now ESTIMATED/DERIVED (Session 7)
warrantyPct (ESTIMATED from category benchmarks), importDependency (DERIVED from localization %), dealerProductivity (7 companies VERIFIED, 8 null), volumeGrowth/priceGrowth (ESTIMATED split), inputCosts copper/steel/aluminum/polymer (ESTIMATED from commodity research)

### Data Source URLs (used in inline UI attributions)

**Screener.in** — Primary financial data source
| Company | Screener URL |
|---------|-------------|
| Whirlpool | https://www.screener.in/company/WHIRLPOOL/consolidated/ |
| Voltas | https://www.screener.in/company/VOLTAS/consolidated/ |
| Blue Star | https://www.screener.in/company/BLUESTARCO/consolidated/ |
| Crompton | https://www.screener.in/company/CROMPTON/consolidated/ |
| Bajaj Electricals | https://www.screener.in/company/BAJAJELEC/consolidated/ |
| V-Guard | https://www.screener.in/company/VGUARD/consolidated/ |
| IFB Industries | https://www.screener.in/company/IFBIND/consolidated/ |
| Havells | https://www.screener.in/company/HAVELLS/consolidated/ |
| Symphony | https://www.screener.in/company/SYMPHONY/consolidated/ |
| Orient Electric | https://www.screener.in/company/ORIENTELEC/consolidated/ |
| Dixon Technologies | https://www.screener.in/company/DIXON/consolidated/ |
| Amber Enterprises | https://www.screener.in/company/AMBER/consolidated/ |
| TTK Prestige | https://www.screener.in/company/TTKPRESTIG/consolidated/ |
| Butterfly | https://www.screener.in/company/BUTTERFLY/consolidated/ |
| Bosch/JCHAC | No data available |

**Sovrenn** — Earnings quality tags & deal activity
- Platform: https://www.sovrenn.com/
- Source file: `data_sources/extracted/sovrenn-intelligence.json`
- Used for: Earnings Quality scores (quarterlyResults → tag), Deal cards (dealActivity)

**Trendlyne** — Supplementary cross-validation
- Platform: https://trendlyne.com/fundamentals/stock-screener/
- Source file: `data_sources/extracted/trendlyne-summary.json`

### Metric-to-Source Mapping (what feeds each UI element)

| UI Element | Metric | Source | Screener Section |
|-----------|--------|--------|-----------------|
| Financial Table | Revenue (₹Cr) | Screener.in | Quarterly Results → Sales |
| Financial Table | YoY Growth | Derived | Calculated from revenue |
| Financial Table | EBITDA % | Screener.in | Quarterly Results → EBITDA Margin % |
| Financial Table | WC Days (Ann.) | Screener.in | Ratios → Working Capital Days |
| Financial Table | Inv. Days (Ann.) | Screener.in | Ratios → Inventory Days |
| Financial Table | Net Debt/EBITDA (Ann.) | Screener.in (derived) | Balance Sheet (Borrowings) ÷ P&L (OpProfit + Depreciation) |
| Financial Table | ROCE % (Ann.) | Screener.in | Ratios → ROCE % |
| Financial Table | Capex % (Ann.) | Screener.in (derived) | Cash Flow (|Investing|) ÷ Revenue |
| Financial Table | Rating | Derived | Peer-relative percentile model |
| Revenue Trend chart | Revenue per quarter | Screener.in | Quarterly Results → Sales |
| EBITDA Trend chart | EBITDA margin per quarter | Screener.in | Quarterly Results → EBITDA Margin % |
| ROCE Comparison chart | ROCE % | Screener.in | Ratios → ROCE % |
| WC/Inv Heatmap | WC Days, Inv. Days | Screener.in | Ratios (Annual) |
| Demand Signals chart | Sector Revenue Growth YoY | Screener.in (derived) | Aggregate of 14 companies' quarterly revenue |
| EBITDA Bands chart | P75/Mean/P25 EBITDA | Screener.in (derived) | Quartiles of 14 companies' EBITDA margins |
| Deal Cards (7) | Dates, types, values | Sovrenn | dealActivity |
| Earnings Quality chart | Score 0-100 | Sovrenn | quarterlyResults → tag (weighted) |
| Earnings Quality Ranking | Score 0-100 ranked | Sovrenn | quarterlyResults → tag (weighted) |
| Segment Size & Growth | Revenue by sub-category | Screener.in (derived) | Quarterly Results → Sales (annualized) |
| Cost Structure Benchmarks | Total Expenses quartiles | Screener.in (derived) | P&L → OPM% across 14 companies |
| Scale vs Profitability bubble | Revenue, EBITDA %, ROCE | Screener.in | Quarterly Results + Ratios |

---

## Key Files & What They Do

| File | Purpose | Key Sections |
|------|---------|-------------|
| `index.html` | Dashboard layout (~590 lines) | Filter bar (lines 102-150), section panels, inline `Source:` annotations on chart card headers |
| `assets/js/data.js` | All data + helpers | Company master (14-256), financials (258-507), ratings (auto-computed IIFE at bottom), DataUtils |
| `assets/js/app.js` | Rendering logic | renderFinancialTable, renderHeatmap, showCompanyModal, renderQuickStats |
| `assets/js/charts.js` | Chart.js visualizations | Revenue Trend, EBITDA Trend, ROCE bar, Scale-Profit bubble, + Market/Operational charts |
| `assets/js/filters.js` | Filter system | Company multi-select, sub-category, performance, time period, revenue range |

---

## Changes Made This Session

### 1. Performance Ratings — Auto-Computed from Data
**Problem**: Static editorial ratings (Outperform/Inline/Underperform) with hand-written reasons — not from source data.
**Fix**: IIFE at bottom of data.js that computes peer-relative ratings.
- Percentile ranks each company on 5 metrics vs peer group
- Weights: RevGrowth 25%, EBITDA Margin 25%, Margin Trend 15%, ROCE 20%, PAT Margin 15%
- Thresholds: >=60 Outperform, >=38 Inline, <38 Underperform
- Cap: revenue decline >15% YoY → max Inline (prevents shrinking companies from rating Outperform)
- Auto-generates reason strings: "Rev +14.3% YoY; EBITDA 11.18%; margin +0.3pp; ROCE 25.3%"
- app.js updated to handle 'N/A' rating badge for bosch_jch

**Current ratings** (computed from Q3 FY26 data):
- Outperform: Havells(78), Crompton(67), V-Guard(67), Amber(62)
- Inline: Symphony(73 capped), Blue Star(53), Orient(53), Butterfly(50), TTK(49), Dixon(44), IFB(39)
- Underperform: Whirlpool(35), Voltas(25), Bajaj Elec(3)
- N/A: Bosch JCH

### 2. Time Period Filter — Wired Up
**Problem**: Filter captured dropdown value in `Filters.timePeriod` but NO rendering function read it. Table/charts/heatmap always showed latest data regardless.
**Fix**: Added DataUtils helpers and wired filter across all Financial Tracker components.

**New DataUtils functions** (data.js):
- `getQuarterIndexForPeriod(period)` — maps filter value to quarter index
- `getQuarterRangeForPeriod(period)` — maps to [startIdx, endIdx] for chart slicing
- `getValueAt(companyId, metric, quarterIdx)` — value at specific index
- `getYoYGrowthAt(companyId, metric, quarterIdx)` — YoY at specific index

**Period → Quarter Index mapping:**
| Filter Value | Quarter Index | Quarter Name | Chart Range |
|-------------|--------------|-------------|-------------|
| `latest`    | 14           | Q3 FY26     | [0, 14] (all) |
| `fy2025`    | 11           | Q4 FY25     | [8, 11] |
| `fy2024`    | 7            | Q4 FY24     | [4, 7] |
| `fy2023`    | 3            | Q4 FY23     | [0, 3] |
| `all`       | 14           | Q3 FY26     | [0, 14] (all) |

**Components updated:**
- `renderFinancialTable` (app.js) — uses getValueAt/getYoYGrowthAt with qIdx
- `renderHeatmap` (app.js) — same
- `showCompanyModal` (app.js) — shows period-specific financials, header shows quarter name
- `renderQuickStats` (app.js) — avg ROCE/EBITDA period-aware
- `renderRevenueTrendChart` (charts.js) — slices data to chart range
- `renderEbitdaTrendChart` (charts.js) — same
- `renderRoceChart` (charts.js) — uses getValueAt with period index
- `renderScaleProfitChart` (charts.js) — uses period-specific values

**Note**: "Latest Quarter" and "All Periods" both map to index 14 — they show identical data for the table. This is correct since a single-row-per-company table can't show "all periods." FY-specific options (FY2025/2024/2023) show that year's Q4 data.

### 3. Charts Already Use Real Data
All 4 Financial Tracker charts read directly from DATA.financials (which was populated in sessions 1-2):
1. Revenue Trend (line) — `.revenue.slice(start, end+1)`
2. EBITDA Margin Trend (line) — `.ebitdaMargin.slice(start, end+1)`
3. ROCE Comparison (bar) — `getValueAt(id, 'roce', qIdx)`
4. WC/Inv Heatmap (table) — `getValueAt(id, 'workingCapDays', qIdx)`

---

## Known Limitations / Future Work

### Data Gaps
- FY2023 table: Q1/Q2 are null (no source data), Q3/Q4 have data. YoY = `-` (no FY22 data)
- FY2024 ROCE: null (ROCE data only starts at index 9 = Q2 FY25)
- Metrics without source data show "-" in table: asp (dealer productivity has partial data for 7 companies)
- Annual metrics (Inv Days, WC Days, ROCE, Net Debt/EBITDA, Capex%) repeated across quarters — shown with "(Ann.)" in table headers
- Market Pulse: volumeGrowth and priceGrowth are ESTIMATED splits (not from source). Input cost indices are ESTIMATED from commodity research (not live market data).
- Sub-Sector: Only 2 segments (White Goods, Consumer Electronics) from tracked companies. Individual cost breakdowns (raw materials/labor/logistics/marketing/overhead) null — only totalExpenses quartiles available
- Deals: Only Amber Enterprises deals from Sovrenn (most active deal-maker). Other companies show no deals.
- Sentiment: Only "overall" earnings quality score from Sovrenn tags. No news/analyst/social breakdown available. Butterfly has no Sovrenn data (null).

### Filter Issues
- Revenue Range filter is hardcoded to FY25 — doesn't change with time period filter

### Tabs Still with Mock Data (no source attribution needed)
- Competitive Moves (real event dates, but details are editorial — marked with mock-data class)
- Leadership Timeline (real dates from press releases, but implications are editorial)
- Stakeholder Insights (all editorial/advisory)
- A&M Value-Add (advisory — references real metrics but estimated values)
- Seasonal Patterns (industry knowledge estimates)

### Tabs Now with Research-Backed Data (Session 7)
- Operational Intelligence: capacity, localization, contract mfg, after-sales, vendor consolidation, import dependency, warranty, dealer productivity, product mix — all from operational-intelligence-data.md + Deep Dive
- Market Pulse: input cost indices, volume/price split, commodity outlook, policy impact, Q3 earnings, urban/rural dynamics — from Deep Dive + commodity research
- Channel Mix: research-refined estimates (marked ESTIMATED)

### Source Attribution Status (Session 5)
- **Done — inline in UI**: Financial Tracker, Market Pulse, Deals, Leadership (Earnings Quality), Sub-Sector Deep Dive, Watchlist (Earnings Quality Ranking)
- All real-data charts/tables have `Source: [hyperlink]` in card header (right-aligned)
- Financial table has one-line source bar below it with all metric → source mappings
- 14 per-company Screener.in hyperlinks shown below Financial Tracker section

## Troubleshooting
- If filters seem stuck: `localStorage.removeItem('cdi_filters')` in browser console, then refresh
- If data looks stale: Hard refresh with Ctrl+Shift+R to bypass JS cache
