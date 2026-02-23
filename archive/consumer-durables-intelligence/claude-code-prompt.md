# Claude Code Prompt — A&M Dashboard Optimization

> **Context for Claude Code:** You are optimizing a React + TypeScript Consumer Durables Intelligence Dashboard (Kompete) that will be presented to **Alvarez & Marsal (A&M)** — a global professional services firm specializing in turnaround management, corporate performance improvement (CPI), restructuring, PE advisory, and operational transformation. Their consumer products practice focuses on: growth strategy, operations, organization, analytics, digital, and marketing — across categories including appliances/white goods, home furnishings, and consumer electronics.

> **Codebase:** Refer to `CLAUDE.md` at project root for architecture, commands, routing, state management, and data flow patterns.

---

## GUIDING PRINCIPLES (Apply Everywhere)

### A&M Lens
A&M's audience cares about **intervention signals**, not market research. Every section must answer: *"Which company should A&M call on Monday, and with what pitch?"*. Frame data around: distress detection, margin improvement levers, working capital optimization, restructuring triggers, and PE deal support.

### Source Attribution (MANDATORY)
Every data card, chart, table, and insight MUST display a source line in the format:
```
Source: [Source Name] | Confidence: Verified/Derived/Estimated | Last Updated: [Date]
```
- **Verified** = directly from Screener.in, BSE/NSE filings, company annual reports, Sovrenn tags
- **Derived** = calculated from verified data (e.g., Net Debt/EBITDA from Balance Sheet ÷ P&L)
- **Estimated** = industry reports, earnings call interpretation, analyst estimates

**Do NOT display "Estimated" data without a traceable source.** If a data point cannot be tied to a specific source document, publication, or filing, display `"-"` instead. If a data point is derived from a sourced estimate (e.g., an analyst report with a named author and date), it may be shown but MUST carry its source and a `Tier 3` or `Tier 4` badge. No anonymous estimates.

### Data Directory
All sourced data files are in:
```
C:\Users\rohit\OneDrive\Documents\Kompete\rohith-m5\consumer-durables-intelligence\data_sources\
```
Additional research and compiled data is in the parent:
```
C:\Users\rohit\OneDrive\Documents\Kompete\rohith-m5\
```
Scan these directories first. **STRICTLY USE only real data from these files. ALL data must come with sources. Where data is not available, display `"-"` (a dash) in the UI — never fabricate, estimate, or use placeholder values. No exceptions.**

**Research file source tracing (MANDATORY):**
Many files in `data_sources/` and the parent directory are broader research/compiled files (markdown reports, CSVs aggregating multiple publications, Deep Dive documents). These files often contain data pulled from multiple original sources. You MUST:
1. Open each research file and read it
2. For each data point you extract, find the **original source cited inside that file** (e.g., "Source: Mead Metals 2026 Outlook" or a URL reference)
3. Propagate that **original source** into the dashboard's `<SourceAttribution>` — NOT the research file name
4. If a research file contains a data point with **no traceable original source**, mark it as `"-"` in the UI and log it in the sourcing doc (see G7)
5. Make necessary changes to data structures to accommodate source metadata if the original files don't carry it

Example — WRONG: `Source: deep-dive-feb-2026.md | Confidence: Verified`
Example — RIGHT: `Source: Mead Metals Procurement Guide 2026 (cited in deep-dive-feb-2026.md) | T2 Verified | Updated: Feb 2026`

---

## DATA PHILOSOPHY — GO BEYOND FILINGS (CRITICAL — READ BEFORE BUILDING)

### The Problem with Filing-Only Analysis
Limiting intelligence to company filings (Screener.in, annual reports, earnings calls) is **table stakes, not a differentiator**. Serious advisory clients like A&M already have access to filings. What they pay for is the layer on top — the signal that filings don't reveal.

Examples of what filings miss:
- Stocks move up **before** management mentions a hot trend (market is pricing in alternative signals)
- Stocks don't move **even as** management keeps hyping a theme (market sees through the narrative)
- Concall transcripts are unreliable for trend detection — management talks their book

### Data Source Hierarchy (4 Tiers)
Build the dashboard's credibility model around this hierarchy. Each data point should be tagged with its tier:

**Tier 1 — Hard Financial Data (Highest credibility)**
- Screener.in quarterly results, ratios, cash flows
- BSE/NSE filings (shareholding, board resolutions, XBRL)
- Audited annual reports
- RBI/government statistical releases
- **Use for:** Revenue, margins, WC days, debt, ROCE, capex, promoter holding

**Tier 2 — Verified Alternative & Economic Data (High credibility)**
- Commodity price indices (LME, MCX, Mead Metals — with date stamps)
- BEE / BIS regulatory notifications (gazette references)
- PLI scheme disbursement data (DPIIT/ministry releases)
- Import/export data (DGFT, Zauba — with HS code references)
- Industry body reports (CEAMA, ICEA — with publication dates)
- Google Trends / search volume data (verifiable, reproducible)
- Job posting data (LinkedIn, Naukri — for org expansion signals)
- Trademark/patent filings (IP India — verifiable public records)
- Real estate/warehouse lease registrations (for capacity expansion signals)
- **Use for:** Market share estimation, demand signals, pricing power, supply chain shifts, capacity moves

**Tier 3 — Curated Intelligence (Medium credibility — requires cross-validation)**
- Analyst reports (with analyst name, firm, date — not anonymous)
- Industry reports (Gartner, Euromonitor, IBEF — with publication reference)
- A&M's own thought leadership (alvarezandmarsal.com — verified)
- Sovrenn quarterly result tags (proprietary but methodology-transparent)
- Channel checks / dealer surveys (if methodology is stated)
- **Use for:** Market sizing, competitive positioning, strategic interpretation
- **Rule:** Never cite a Tier 3 source alone. Always pair with Tier 1 or Tier 2 data that corroborates.

**Tier 4 — News & Sentiment (Lowest credibility — treat as leads, not facts)**
- News articles (ET, Mint, BS, Moneycontrol, etc.)
- Management interviews / media quotes
- Social media signals
- Broker/influencer commentary
- **Use for:** Event alerts, rumor tracking, sentiment shifts
- **Rule:** NEVER present Tier 4 data as fact. Always frame as: "As reported by [Source] on [Date]" and flag with a visual "unverified signal" indicator
- **Anti-clickbait filter:** See section below

### Anti-Clickbait / Authenticity Framework
AI-sourced news will always mix genuine signals with noise. The dashboard must **never amplify unverified claims**. Apply these rules at the data layer:

**Source Credibility Scoring (build into the `NewsItem` interface):**
```tsx
interface NewsItem {
  // ... existing fields ...
  sourceTier: 1 | 2 | 3 | 4;
  sourceCredibility: 'high' | 'medium' | 'low';  // based on publication track record
  corroboratedBy?: string[];    // other sources confirming the same signal
  contradictedBy?: string[];    // sources contradicting — flag conflicts explicitly
  isVerifiedByFiling?: boolean; // true if a BSE/NSE filing confirms the news
}
```

**Display rules based on credibility:**
- `high` credibility (ET, Mint, BS, Reuters, company PR) → show normally with source citation
- `medium` credibility (industry blogs, regional papers, analyst notes) → show with a subtle "⚠ Unconfirmed" badge
- `low` credibility (social media, anonymous tips, clickbait outlets) → **DO NOT DISPLAY.** Filter out at the data layer. These never reach the UI.
- If a signal is corroborated by 2+ independent sources → upgrade its display confidence
- If a signal is contradicted → show both sides with a "Conflicting Reports" tag

**What NOT to include in any section, regardless of source:**
- Unattributed "market rumors" without a named publication
- Speculative price targets from anonymous accounts
- Rehashed PR releases dressed up as "analysis"
- News older than 90 days unless it's a structural/regulatory event still in effect

### Management "Talk vs Walk" Verification (Apply to EVERY company insight)

Transcripts and management commentary are **lagging and often misleading**. The dashboard must systematically verify management claims against hard data. Build this as a reusable check:

**For each company, maintain a Talk vs Walk scorecard:**
```tsx
interface TalkVsWalk {
  company: string;
  claim: string;                    // what management said (from concall/interview)
  claimSource: string;              // concall date, interview publication
  dataVerification: 'confirmed' | 'contradicted' | 'unverifiable' | 'too_early';
  verificationData: string;         // the Tier 1/2 data point that confirms or contradicts
  verificationSource: string;       // where the verification data comes from
}
```

**Detection patterns to flag:**
- **"Premiumization drive"** claimed → check: is ASP actually rising? (revenue growth minus volume growth). If ASP flat/declining while management claims premiumization → flag as `🔴 Narrative Disconnect`
- **"Backward integration / localization"** claimed → check: import dependency % from DGFT data, BoM disclosures. If import % unchanged → flag as `🔴 Narrative Disconnect`
- **"Aggressive expansion"** claimed → check: actual capex-to-revenue ratio, new plant commissioning dates. If capex intensity declining → flag
- **"Rural penetration"** claimed → check: dealer count growth, distribution footprint data. If flat → flag
- **Stealth Signals (highest value):** Numbers show a clear trend that management hasn't discussed yet → flag as `🟢 Stealth Signal — Not Yet in Narrative`. These are the most valuable insights for A&M because they indicate either an unrecognized opportunity or a hidden risk.

**Display in dashboard:**
- In the company detail modal (Section 3), add a "Talk vs Walk" mini-section showing 2-3 top claims with verification status
- In Section 1 (Executive Snapshot), surface the most material disconnects as "Narrative Risks" alongside Red Flags
- In Section 9 (What This Means For → PE/Investors), explicitly call out companies where the narrative doesn't match the data

### Derived Market Intelligence Methods (How to Estimate What Isn't Filed)

A&M cares about market share, pricing power, and brand strength — none of which appear in filings. Use these derivation methods and ALWAYS state the methodology:

**Market Share Estimation:**
- Method: Within our 15-company tracked universe, calculate each company's revenue as % of total universe revenue for its sub-category (AC, refrigerator, washing machine, etc.)
- Track QoQ and YoY share shifts
- Caveat clearly: "Share within tracked universe of 15 companies (est. ~65-70% of organized market)" — NOT "market share" without qualification
- Source: `Derived from Screener.in quarterly revenue | Methodology: intra-universe share calculation`

**Pricing Power Proxy:**
- Method: Revenue Growth % minus estimated Volume Growth %  = implied ASP change
- Where volume data isn't directly available, use industry volume data from CEAMA/IBEF as the sector baseline and attribute variance to company-specific factors
- A company growing revenue 15% in a segment growing volume 8% has ~7% pricing power
- Source: `Revenue: Screener.in | Volume baseline: CEAMA/IBEF | ASP change: Derived`

**Brand Strength Indicators (composite):**
- Premium mix % (from investor presentations where disclosed)
- Gross margin relative to peers (higher = more pricing power = stronger brand)
- D2C revenue share (direct consumer relationship = brand pull vs push)
- Return on advertising spend (ad expense growth vs revenue growth)
- Source each component separately; present as a composite index with methodology visible

**Competitive Intensity Index:**
- Count of: new product launches + pricing actions + channel expansions + partnership announcements per company per quarter
- Normalize by company size (revenue)
- A small company with high activity = aggressive challenger; a large company with low activity = complacent incumbent
- Source: `Compiled from news scraping + investor presentations | Methodology: event count per ₹1000Cr revenue`

**Implementation:** These derived metrics should live alongside filed metrics in the Financial Tracker (Section 3) and Sub-Sector Deep Dive (Section 8). Always use a distinct visual treatment (e.g., italic font, "Derived" badge) to distinguish them from filed numbers.

### Practical Application — What "Beyond Filings" Looks Like Per Section

| Section | Filing-Only (Table Stakes) | Beyond Filings (Differentiator) |
|---------|---------------------------|--------------------------------|
| S1 Executive | Revenue/margin summary | Alternative signal convergence — e.g., "Google Trends for AC brands surging 40% ahead of season vs flat last year" |
| S2 Market Pulse | Commodity price tables | PLI disbursement data cross-referenced with capex announcements — who's actually building vs who's just talking |
| S3 Financial | Screener.in metrics | Pricing power proxy — track MRP changes via e-commerce scraping vs cost inflation to estimate real margin trajectory |
| S4 Deals | Announced deals from filings | Trademark filings + warehouse leases as pre-announcement deal signals |
| S5 Operations | Reported capacity util % | Import data (DGFT) showing actual component import volumes vs stated localization % — verify claims |
| S6 Leadership | Board resolution filings | LinkedIn job postings surge at a company = org restructuring signal before it's announced |
| S7 Competitive | PR-announced launches | Patent/design filings as leading indicators of product pipeline 6-12 months ahead |
| S8 Sub-Sector | Industry size from reports | BEE star rating database — actual energy efficiency compliance rates as premiumization proxy |
| S10 Watchlist | Debt maturity from B/S | NCLT case filings, CIRP triggers from IBBI database as early distress signals |

### Implementation Note
You do NOT need to build scrapers or data pipelines for all of the above. The purpose is:
1. **Structure the data model** to accept these richer data types when they arrive
2. **Where data already exists in `data_sources/`**, use it — some of this alternative data has already been sourced
3. **For data not yet available**, add `// ALTERNATIVE_DATA_SLOT: [description]` code comments alongside the `// NEWS_DATA_SLOT` markers
4. **In source attributions**, cite the actual source tier so the viewer immediately knows the evidentiary weight of what they're seeing

---

## SECTION-BY-SECTION EXECUTION PLAN

### SECTION 1 — Executive Snapshot (Priority: 🔴 P0)

**Current state:** Generic sector summary with a confidence meter, bullet points, themes grid, and red flags. Multiple elements tagged `mock-data`.

**Changes required:**

**1.1 — Replace confidence meter with "Intelligence Grade"**
- Remove the progress-bar style `confidence-fill` meter
- Replace with a letter grade badge (e.g., `A / B+ / C`) with hover tooltip explaining the grading methodology
- Rationale: A progress bar reads as "loading indicator" not quality signal

**1.2 — Add "A&M Opportunity Summary" card at the TOP of this section**
- 3 stat cards in a row:
  - `Total Advisory Opportunity` → estimated ₹Cr addressable engagement value
  - `Companies in Distress Zone` → count of companies with stress indicators (net debt/EBITDA > 3x, declining ROCE, negative WC trend)
  - `Top Recommended Action` → single most urgent action (e.g., "Approach Butterfly Gandhimathi for turnaround assessment")
- Source each stat. E.g., `Source: Screener.in Q3 FY26 + internal scoring model | Confidence: Derived`
- This card replaces the generic "Key Insights" summary or sits above it

**1.3 — Populate "Big Themes" and "Red Flags" from real data**
- Scan `data_sources/` for theme/signal data
- Remove `mock-data` class from these cards
- Each theme card must cite source. Each red flag must link to the specific financial metric triggering it
- Red flags should map to A&M service lines: `Turnaround`, `CPI`, `Transaction Advisory`, `Interim Management`

---

### SECTION 2 — Market Pulse (Priority: 🟡 P1)

**Current state:** Good structure. Has Q3 earnings snapshot, demand signals, input costs, commodity outlook, margin bands, channel mix, policy tracker, urban/rural, seasonal patterns.

**Changes required:**

**2.1 — Reduce "ESTIMATED" labels**
- Volume/Price split chart: either source from earnings calls in `data_sources/` or relabel as "Management Guidance Interpretation" with the specific concall date
- Channel mix: source from company investor presentations or remove and replace with a "Channel Shift Signals" qualitative card sourced from earnings calls
- Keep: demand signals (Screener.in verified), input costs (Mead Metals sourced), commodity outlook (multi-source verified), margin bands (Screener.in), policy tracker (DSIJ/Croma sourced), seasonal patterns (industry standard)

**2.2 — Add A&M-relevant framing to commodity outlook**
- Add a column to the Commodity Outlook table: `A&M Implication` — e.g., "Copper +15% → procurement advisory opportunity for high-import companies (Whirlpool, IFB)"
- Source: cross-reference commodity data with operational intelligence import dependency data

**2.3 — Urban vs Rural card already cites A&M source — strengthen this**
- Ensure the A&M thought leadership link (alvarezandmarsal.com) is prominently cited
- Add a "What A&M Published" callout box referencing their own consumer economy reality check report

---

### SECTION 3 — Financial Performance Tracker (Priority: 🔴 P0)

**Current state:** Comprehensive table with Revenue, Growth, EBITDA%, WC Days, Inv Days, Net Debt/EBITDA, ROCE%, Capex%, Rating, Trend. Well-sourced from Screener.in.

**Changes required:**

**3.1 — Add visual triage layer**
- Color-code rows by A&M action type:
  - 🔴 Red border/tag = Turnaround candidate (negative growth + declining margins + high leverage)
  - 🟡 Amber = Performance improvement target (inline but margin compression or WC bloat)
  - 🟢 Green = Transaction advisory / CDD target (strong growth, potential PE interest)
- Add this as a new first column: `A&M Signal` with icon + tooltip explaining the classification logic
- Source: `Rating: Auto-computed (peer-relative model) | Classification: Derived from Screener.in metrics`

**3.2 — Add sparklines to Revenue and EBITDA% columns**
- Use the quarterly trend data already available in `data.js`
- Small inline sparkline (50px wide) next to the number showing last 4-6 quarters
- Makes the static table immediately scannable for trajectory

**3.3 — Enhance company modal with A&M value-add suggestion**
- When clicking a company row, the existing modal should include a new section: "Potential A&M Engagement"
- Auto-generate based on metrics: if WC Days > sector P75 → "Working Capital Optimization", if EBITDA < sector P25 → "Cost Transformation Program", etc.
- Source: state clearly `Engagement suggestion auto-generated from peer-relative financial positioning`

**3.4 — Add "Talk vs Walk" verification to company modal**
- New tab/section in the company detail modal: "Management Claims vs Data"
- Show 2-3 top management claims from recent concalls/interviews alongside the hard data that confirms or contradicts them
- Flag disconnects with 🔴 and stealth signals (data shows trend management hasn't discussed) with 🟢
- Source each claim: `Claim: Q3 FY26 Concall, [Date]` and each verification: `Data: Screener.in / CEAMA / DGFT`
- If concall data not yet available (pending news refresh), leave as `// NEWS_DATA_SLOT: Talk vs Walk claims from concall transcripts` — the verification data side should still work from financials

**3.5 — Add derived market intelligence columns to the table**
- New columns (visually distinguished with italic + "Derived" badge):
  - `Mkt Share %` — intra-universe share by sub-category (Revenue / Total sub-category revenue × 100)
  - `Pricing Power` — Revenue Growth % minus sector volume growth % (from CEAMA/IBEF). Positive = pricing power. Negative = volume-dependent
  - `Competitive Intensity` — event count (launches + expansions + partnerships from Section 7 data) per ₹1000Cr revenue
- These columns should be toggleable (show/hide) so the table isn't overwhelming on first load
- Source per column: clearly state derivation methodology in tooltip

---

### SECTION 4 — Deals, Transactions & Capital Movements (Priority: 🟡 P1)

**Current state:** FY filter, summary stats, deal grid. Well-structured.

**Changes required:**

**4.1 — Add "A&M Angle" tag to each deal card**
- For each deal, auto-classify: `CDD Opportunity`, `Integration Support`, `Carve-out Advisory`, `Valuation`, `Restructuring`
- Based on deal type: M&A → CDD/Integration, PE/VC → CDD, Distressed → Restructuring, Fundraise → Valuation
- Source each deal with the original filing/news source

**4.2 — Add pattern recognition summary card at top**
- AI-interpreted patterns: "3 PE investments in contract manufacturing in last 6 months", "Promoter stake dilution trend in mid-cap appliance companies"
- Source: `Pattern: Derived from deal database | Individual deals: BSE/NSE filings, news publications`

**4.3 — Ensure all deals from `data_sources/` are loaded**
- Scan the data directory for deal/transaction data files
- Cross-reference with what's currently in `data.js` and fill gaps

---

### SECTION 5 — Operational Intelligence (Priority: 🟡 P1)

**Current state:** Operational metrics table, capacity vs localization scatter, product mix, supply chain risk, manufacturing footprint, retail footprint. Mix of verified and estimated data.

**Changes required:**

**5.1 — Standardize confidence indicators on the ops table**
- The footer already has some confidence notes. Formalize this:
- Add a small icon per cell: ✓ (verified), ~ (derived), ? (estimated)
- Move the confidence notes from footer into tooltips on each cell
- Source format per metric: `Voltas Capacity 90% | Source: Q3 FY26 Earnings Call | Confidence: Verified`

**5.2 — Add "A&M Operations Diagnostic Triggers" card**
- New card above or below the ops table:
  - Companies with Capacity Util < 70% → "Asset utilization review"
  - Companies with Import Dep > 50% + commodity headwind → "Procurement transformation"
  - Companies with After-Sales Cost > 3% → "Service operations optimization"
- Source: `Triggers derived from operational metrics | Thresholds: A&M CPI benchmarks`

**5.3 — Merge Competitive Moves (Section 7) intelligence into this section**
- Product launches, D2C initiatives, plant expansions from Section 7 are operational signals
- Add a "Strategic Moves" tab or collapsible subsection within Operational Intelligence
- Remove Section 7 as standalone → reduces section count from 11 to 10
- **WAIT — per user instruction, strictly retain all sections. Keep Section 7 standalone but add cross-links between Section 5 and Section 7**

---

### SECTION 6 — Leadership, Org & Governance Watch (Priority: 🟡 P1)

**Current state:** Timeline (mock-data), promoter holding chart (mock-data), earnings quality from Sovrenn.

**Changes required:**

**6.1 — Populate leadership timeline from real data**
- Scan `data_sources/` for leadership change data
- Remove `mock-data` class
- Each timeline entry: `[Date] [Company] [Event] | Source: [BSE filing / News] | Signal: [Execution risk / Professionalization / Stability]`

**6.2 — Add governance risk scoring**
- For each company, compute a simple governance flag:
  - Auditor resignation in last 12 months → 🔴
  - Promoter stake decline > 2% QoQ → 🟡
  - Board reconstitution → 🟡
  - Stable → 🟢
- Source: `Shareholding: BSE/NSE quarterly filings | Auditor: Annual Report`

**6.3 — Connect promoter holding to A&M service line**
- Declining promoter holding + stress indicators → "Potential restructuring / turnaround engagement"
- Rising institutional holding → "PE advisory support opportunity"
- Add a small annotation on the promoter chart for companies crossing key thresholds

---

### SECTION 7 — Competitive Moves & Strategic Bets (Priority: 🟢 P2)

**Current state:** Grid layout, mock-data tagged.

**Changes required:**

**7.1 — Populate from real data in `data_sources/`**
- Remove `mock-data` class
- Structure: Company → Move Type (Product Launch / Pricing / D2C / Partnership / Expansion) → Detail → Source → Date
- Every entry must have a source citation

**7.2 — Add "Competitive Intensity Heatmap"**
- Matrix: Company × Move Type, color by frequency
- Quickly shows who's most active and in what areas
- Source: `Compiled from company disclosures, news, investor presentations`

**7.3 — Cross-link to Operational Intelligence**
- Where a competitive move has operational implications (e.g., new plant = capex, D2C = channel mix shift), add a clickable link/reference to Section 5

---

### SECTION 8 — Sub-Sector Deep Dive (Priority: 🟢 P2)

**Current state:** Home Appliances focused. Market size stats, segment charts, cost benchmarks, margin levers (mock), scale vs profitability bubble chart.

**Changes required:**

**8.1 — Populate margin levers table from real data**
- Remove `mock-data` from Margin Levers Analysis table
- Populate with actual levers: premiumization, backward integration, distribution rationalization, vendor consolidation, SKU rationalization
- Each lever: Impact estimate, Difficulty, Timeframe, Source

**8.2 — Add "A&M Benchmark Comparison" callout**
- Reference A&M's consumer products case studies (from their website):
  - "European white goods manufacturer: 20%+ sales uplift through value proposition transformation"
  - "US consumer products: $150M EBITDA improvement through full-scale transformation"
- Frame as: "Based on A&M's global experience, companies in the bottom quartile of this chart have 200-500 bps margin improvement potential"
- Source: `A&M Case Studies (alvarezandmarsal.com/industries/consumer-products)`

**8.3 — Ensure chart sources are visible and standardized**
- Segment Size & Growth → `Source: Screener.in revenue by sub-category | Confidence: Verified`
- Cost Structure Benchmarks → `Source: Screener.in OPM% quartiles | Confidence: Verified`
- Scale vs Profitability → `Source: Screener.in Revenue, EBITDA%, ROCE | Confidence: Verified`

---

### SECTION 9 — "What This Means For..." (Priority: 🟡 P1)

**Current state:** Tabs for PE/Investors, Founders, COOs/CFOs, Supply Chain Heads. All mock-data.

**Changes required:**

**9.1 — Populate all tabs with real, sourced insights**
- Remove `mock-data` class
- Each insight should reference specific data from other sections:
  - PE/Investors: "Amber Enterprises trading at 0.8x revenue with 93% ODM model — potential platform play" → `Source: Screener.in valuation + Section 5 operational data`
  - Founders: "BEE 2026 norms create compliance capex need of ₹50-100Cr for mid-tier players" → `Source: Section 2 Policy Tracker, Croma/DSIJ`
  - COOs/CFOs: "Working capital days spread of 40-120 days across sector — bottom quartile has ₹200Cr+ trapped capital" → `Source: Section 3 Financial Tracker, Screener.in`
  - Supply Chain: "Copper +15% forecast + 40%+ import dependency for 5 companies = ₹80-120Cr annual cost headwind" → `Source: Section 2 Commodity + Section 5 Import Risk`

**9.2 — Add "Recommended A&M Service" tag per insight**
- Map each insight to an A&M practice: CPI, Restructuring, Transaction Advisory, Digital, Operations

**9.3 — Make insights cross-navigable**
- Each insight that references another section should have a clickable link to jump to that section + specific card

---

### SECTION 10 — Watchlist & Forward Indicators (Priority: 🔴 P0)

**Current state:** Likely Fundraises, Margin Inflection, Consolidation Targets, Stress Indicators — all mock-data. Plus Earnings Quality radar from Sovrenn.

**Changes required:**

**10.1 — Populate all 4 watchlist quadrants from real data**
- Remove all `mock-data` classes
- Scan `data_sources/` for watchlist/signal data
- Each entry needs:
  - Company name
  - Signal detail (2 lines max)
  - Severity: 1-5 scale with visual indicator
  - Days to Event (if applicable) — countdown creates urgency
  - Source: specific filing, financial metric, or news item
  - A&M Service Line: which practice should pursue this

**10.2 — Add "Stress Indicators" scoring model**
- Define clear thresholds:
  - Cash burn: negative operating CF for 2+ quarters
  - Debt rollover: significant debt maturity in next 12 months
  - Revenue decline: 2+ consecutive quarters of YoY decline
  - Margin erosion: EBITDA% below sector P25 and declining
- Source: `Screener.in quarterly results + balance sheet | Thresholds: A&M turnaround assessment criteria`

**10.3 — Add "Likely Fundraise" signals**
- Low promoter holding + high capex plans + declining cash reserves
- Recent board approval for fundraise instruments
- Source: `BSE/NSE filings, board meeting outcomes, cash flow analysis from Screener.in`

---

### SECTION 11 — A&M Value-Add Opportunities (Priority: 🔴 P0)

**Current state:** Summary stats + opportunities list. Both mock-data. Currently LAST section in navigation.

**Changes required:**

**11.1 — MOVE THIS SECTION TO POSITION 2 (right after Executive Snapshot)**
- In sidebar nav (`sidebar-nav`), move `data-section="amvalue"` from "Advisory" group to directly after "Executive Snapshot" under "Overview"
- In routing (`src/app/routes.tsx`), adjust route order so `/am-value` or `/amvalue` loads as second section
- Rationale: This is the punchline. A&M leadership will skim 2 sections max. If this is section 11, it won't get read.

**11.2 — Structure as pipeline view**
- Replace flat list with a kanban/pipeline layout:
  - Column 1: `Identified` — raw signals from data
  - Column 2: `Qualified` — signals validated by multiple data points
  - Column 3: `Outreach-Ready` — clear engagement thesis with estimated deal size
- Each opportunity card: Company, Engagement Type, Est. Size (₹Cr), Key Data Points, Sources
- Source: `Opportunity pipeline auto-generated from Sections 3, 5, 6, 10 data cross-referencing`

**11.3 — Tag every opportunity by A&M practice area**
- Practice areas (from A&M website): 
  - Corporate Performance Improvement (CPI)
  - Restructuring & Turnaround
  - Private Equity Services (CDD, portfolio ops)
  - Corporate Transactions (M&A advisory)
  - Digital
  - Operations
- Use color-coded tags matching the financial tracker triage colors (🔴🟡🟢)

---

## GLOBAL / CROSS-CUTTING CHANGES

### G1 — Remove ALL `mock-data` CSS class instances
- Search entire codebase for `mock-data` class
- For each instance: populate with real sourced data from `data_sources/`. If real data is not available for a given field, display `"-"` with a tooltip "Data not yet available"
- **Do NOT use "Illustrative" labels or placeholder content** — either it's real and sourced, or it's a dash
- Log every `mock-data` removal in `PROGRESS.md` with what data replaced it (or that it shows `"-"`)

### G2 — Standardize source attribution component
- Create a reusable `<SourceAttribution>` component:
  ```tsx
  <SourceAttribution 
    source="Screener.in Quarterly Results"
    confidence="verified" // | "derived" | "estimated"
    tier={1}              // 1-4, maps to Data Philosophy tiers
    lastUpdated="2026-02-18"
    url="https://screener.in/..."
  />
  ```
- Use this on EVERY card, chart, and table across all sections
- Renders as a subtle footer line: `Source: Screener.in Quarterly Results | T1 ✓ Verified | Updated: 18 Feb 2026`
- Tier badge styling: T1 = solid green dot, T2 = solid blue dot, T3 = outline amber dot, T4 = outline red dot with "⚠"
- Hovering the tier badge shows a tooltip: "Tier 1: Hard financial data — audited filings & regulatory data"

### G3 — Add A&M action-type color system to CSS tokens
- In `src/theme/tokens.css`, add:
  ```css
  --signal-turnaround: #EF4444;    /* Red — restructuring/turnaround */
  --signal-improvement: #F59E0B;   /* Amber — performance improvement */
  --signal-transaction: #10B981;   /* Green — transaction advisory */
  --signal-neutral: #64748B;       /* Slate — monitoring */
  ```
- Apply these consistently across Financial Tracker rows, Watchlist severity, Deal tags, and A&M Value-Add cards

### G4 — Navigation restructuring
- Move "A&M Value-Add" from "Advisory" nav group → "Overview" group (position 2)
- Resulting nav order:
  1. Executive Snapshot
  2. A&M Value-Add Opportunities ← MOVED UP
  3. Market Pulse
  4. Financial Tracker
  5. Deals & Transactions
  6. Operational Intelligence
  7. Leadership & Governance
  8. Competitive Moves
  9. Sub-Sector Deep Dive
  10. What This Means For...
  11. Watchlist & Forward Indicators

### G5 — Data loading from local sources
- Before implementing any section changes, scan these directories and catalog available data:
  ```
  C:\Users\rohit\OneDrive\Documents\Kompete\rohith-m5\consumer-durables-intelligence\data_sources\
  C:\Users\rohit\OneDrive\Documents\Kompete\rohith-m5\
  ```
- Map each data file to the section(s) it serves
- Update mock data in `src/` with real data from these files — strictly sourced, show `"-"` where unavailable
- Log which data points remain unsourced after this pass → write to `SOURCE_REFERENCE.md`

### G6 — Project Memory / Progress Checkpoint Files (MANDATORY)

Task execution may fail or be interrupted. You MUST maintain progress files so work can resume from the last successful checkpoint without re-doing completed steps.

**Create these files at project root at the VERY START (Step 0a) and update them as you go:**

**`PROGRESS.md`** — Task execution log
```markdown
# Execution Progress

## Status: IN PROGRESS | Step X of 22

| Step | Task | Status | Notes | Timestamp |
|------|------|--------|-------|-----------|
| 0a | Create progress files | ✅ Done | Created PROGRESS.md, DECISIONS.md, SOURCE_REFERENCE.md | 2026-02-XX HH:MM |
| 1 | Scan data_sources/ | ✅ Done | Found 12 files, cataloged in DATA_CATALOG.md | ... |
| 2 | SourceAttribution component | ⏳ In Progress | Component created, integrating into S1 | ... |
| 3 | NewsItem interface | ⬜ Not Started | | |
...
```
- Update status AFTER completing each step
- If a step partially completes, note exactly what was done and what remains
- On failure/crash: the next session reads this file and picks up from the last ✅

**`DECISIONS.md`** — Architecture and judgment calls log
```markdown
# Decisions Log

## D001 — Mock data replacement strategy
**Context:** Section 1 Big Themes has mock-data class but no corresponding real data file found.
**Decision:** Marked as "-" pending news data refresh. Structural slot built.
**Rationale:** Cannot fabricate themes without source data.

## D002 — Commodity outlook source tracing
**Context:** deep-dive-feb-2026.md has copper forecast citing "Mead Metals + JPMorgan"
**Decision:** Split into two SourceAttribution entries — one per original source.
**Rationale:** A&M will ask "which analyst said this" — need granularity.
```
- Log every non-trivial decision: data interpretation, what was kept vs dropped, source tracing choices, UI layout judgments
- This is the "why did you do it this way" reference for the presenter

**`DATA_CATALOG.md`** — Created in Step 1
```markdown
# Data Catalog

| File | Path | Contents | Serves Sections | Data Points | Sources Traced |
|------|------|----------|-----------------|-------------|----------------|
| screener-quarterly.csv | data_sources/ | Q3 FY26 financials for 15 companies | S1, S3, S8, S10 | Revenue, EBITDA%, PAT% | Screener.in (T1) |
| deep-dive-feb-2026.md | rohith-m5/ | Macro + commodity + policy analysis | S2 | Commodity forecasts, BEE norms | Multiple (traced per data point) |
...
```

**Resume protocol:** If Claude Code starts a new session on this project:
1. Read `PROGRESS.md` first
2. Skip all steps marked ✅
3. Resume from the first ⬜ or ⏳ step
4. Append to existing logs, do not overwrite

### G7 — Source Reference Document for Presentation (MANDATORY)

Create and maintain `SOURCE_REFERENCE.md` at project root. This file is the **presenter's cheat sheet** — when an A&M MD asks "where did you get this number?", the presenter opens this file and has the answer instantly.

**Structure:**
```markdown
# Source Reference — Consumer Durables Intelligence Dashboard
> Last updated: [auto-timestamp on each build]
> For use during client presentation — maps every dashboard data point to its source

## Section 1: Executive Snapshot

### A&M Opportunity Summary Card
| Data Point | Value Shown | Source | Source URL | Tier | Confidence | Date Sourced |
|-----------|-------------|--------|-----------|------|------------|-------------|
| Total Advisory Opportunity | ₹850 Cr | Internal scoring model applied to Screener.in Q3 FY26 data | screener.in/... | T1+Derived | Derived | 18 Feb 2026 |
| Companies in Distress Zone | 3 | Net Debt/EBITDA > 3x from Screener.in Balance Sheet | screener.in/... | T1 | Verified | 18 Feb 2026 |
| Top Recommended Action | "Approach Butterfly..." | Composite signal: revenue decline + margin erosion + promoter exit | Multiple T1 | Derived | 18 Feb 2026 |

### Key Insights Bullets
| Bullet | Source | Tier | Notes |
|--------|--------|------|-------|
| "Gross margin pressure easing..." | Screener.in OPM% Q3 vs Q2 trend | T1 | Verified across 12/15 companies |
| "-" | No data available | - | Pending news data refresh |

## Section 2: Market Pulse
...

## Unsourced / Pending Data Points
| Section | Data Point | Reason | Expected Resolution |
|---------|-----------|--------|---------------------|
| S1 | Big Themes Emerging | News data not yet available | Sunday news refresh |
| S7 | Competitive Moves grid | Data file found but no inline source citations | Needs manual verification |
...
```

**Rules:**
- Every section of the dashboard gets a corresponding section in this file
- Every visible data point, chart value, table cell, and insight text must have a row
- Where data shows `"-"`, the reference doc must explain WHY (no data file, source untraceable, pending refresh)
- Update this file as each section is built — do not leave it to the end
- This file is NOT rendered in the dashboard. It lives at project root as a reference artifact.

---

## EXECUTION ORDER

| Step | Task | Sections | Priority |
|------|------|----------|----------|
| 0a | Create `PROGRESS.md`, `DECISIONS.md`, `SOURCE_REFERENCE.md` at project root | Global | 🔴 |
| 0b | Read `PROGRESS.md` — if resuming, skip to the step after last ✅ | Global | 🔴 |
| 1 | Scan `data_sources/` directory, catalog all files → write `DATA_CATALOG.md` | All | 🔴 |
| 2 | Create `<SourceAttribution>` component with tier badges (T1/T2/T3/T4) | Global | 🔴 |
| 3 | Create `NewsItem` interface (incl. `sourceTier`, `corroboratedBy`, `contradictedBy`) + `src/api/news.ts` loader with graceful empty handling | Global | 🔴 |
| 4 | Create `TalkVsWalk` interface + verification data structure | Global | 🔴 |
| 5 | Add A&M color tokens + signal tokens to theme | Global | 🔴 |
| 6 | Remove/replace all `mock-data` classes | Global | 🔴 |
| 7 | Move A&M Value-Add to nav position 2 | S11, Nav | 🔴 |
| 8 | Add A&M Opportunity Summary to Executive Snapshot | S1 | 🔴 |
| 9 | Add triage color-coding to Financial Tracker | S3 | 🔴 |
| 10 | Populate Watchlist with real data + severity scoring | S10 | 🔴 |
| 11 | Build A&M Value-Add pipeline view | S11 | 🔴 |
| 12 | Wire `NEWS_DATA_SLOT` markers into all 14 news-dependent components | All | 🔴 |
| 13 | Wire `ALTERNATIVE_DATA_SLOT` markers for Tier 2 data (DGFT imports, PLI, Google Trends, patent filings) | S2,S3,S5,S7,S10 | 🟡 |
| 14 | Build derived market intelligence metrics (intra-universe share, pricing power proxy, brand composite, competitive intensity) into data layer | S3, S8 | 🟡 |
| 15 | Add Talk vs Walk mini-section to company detail modal + populate from concall claims vs filed data | S3 | 🟡 |
| 16 | Populate all "What This Means For" tabs with cross-tier sourced insights | S9 | 🟡 |
| 17 | Add A&M angle tags to Deals section | S4 | 🟡 |
| 18 | Standardize ops table confidence indicators (per-cell tier icons) | S5 | 🟡 |
| 19 | Populate leadership timeline from real data | S6 | 🟡 |
| 20 | Reduce ESTIMATED labels in Market Pulse; add PLI/regulatory cross-refs | S2 | 🟡 |
| 21 | Populate Competitive Moves from real data + build competitive intensity heatmap | S7 | 🟢 |
| 22 | Populate Sub-Sector margin levers + A&M benchmarks + pricing power analysis | S8 | 🟢 |
| 23 | Add sparklines to Financial Tracker | S3 | 🟢 |
| 24 | Surface top Talk vs Walk disconnects + Stealth Signals in Executive Snapshot | S1 | 🟢 |
| 25 | Final audit: every card has source attribution with tier badge | All | 🟢 |
| 26 | Test: build with empty news JSON + empty alt-data → verify no broken layouts | All | 🟢 |

**⚠️ AFTER EVERY STEP:** Update `PROGRESS.md` with ✅/❌ status, timestamp, files touched. Update `SOURCE_REFERENCE.md` with sourcing details for any new data points added in that step. This is not optional.

---

## NEWS DATA STRATEGY (CRITICAL — READ BEFORE BUILDING)

News is being actively scraped for all 15 tracked companies + the broader Consumer Durables industry. This data will be refreshed **one final time before the Sunday client presentation**. 

### Rules:
1. **DO NOT populate any news-dependent fields with dummy/placeholder content.** Leave them structurally ready but empty.
2. **DO build the components, layouts, and data-binding logic** so that when news data lands, it plugs in with zero code changes — only a data file swap.
3. **Mark all news-dependent slots** with a code comment: `// NEWS_DATA_SLOT: [description of what goes here]`

### Sections where news data will feed in:

| Section | Component | What news data provides |
|---------|-----------|------------------------|
| S1 — Executive Snapshot | "Month in 5 Bullets" / Key Insights | Top sector-level headlines, management commentary shifts |
| S1 — Executive Snapshot | Big Themes Emerging | Theme clustering from news velocity across companies |
| S1 — Executive Snapshot | Red Flags / Watchlist | Breaking negative signals (auditor changes, regulatory actions, downgrades) |
| S2 — Market Pulse | Q3 FY26 Earnings Snapshot | Earnings call quotes, management guidance revisions |
| S2 — Market Pulse | Commodity & Cost Outlook | News confirming/contradicting commodity forecasts |
| S4 — Deals & Transactions | Deal cards | New deal announcements, rumored transactions |
| S4 — Deals & Transactions | Pattern recognition card | News-velocity based pattern detection |
| S6 — Leadership & Governance | Timeline | CXO appointment/exit news, board changes |
| S6 — Leadership & Governance | Governance flags | Auditor resignation news, regulatory notices |
| S7 — Competitive Moves | Move cards | Product launches, pricing announcements, partnership news |
| S9 — What This Means For | All tabs | News-driven implications per stakeholder group |
| S10 — Watchlist | Likely Fundraises | Board approval news, banker appointment signals |
| S10 — Watchlist | Stress Indicators | Negative news clustering, rating agency actions |
| S11 — A&M Value-Add | Pipeline items | News-triggered opportunity signals |

### Data contract for news integration:
Create a TypeScript interface that the news data will conform to:
```tsx
interface NewsItem {
  id: string;
  company: string;              // company slug matching existing company IDs
  headline: string;
  summary: string;              // 2-3 lines max
  source: string;               // publication name
  sourceUrl: string;
  publishedDate: string;        // ISO date
  category: 'earnings' | 'deal' | 'leadership' | 'operations' | 'regulatory' | 'competitive' | 'macro';
  sentiment: 'positive' | 'negative' | 'neutral';
  relevantSections: string[];   // section IDs where this news should surface
  isBreaking?: boolean;
  // Credibility fields (see Data Philosophy section)
  sourceTier: 1 | 2 | 3 | 4;
  sourceCredibility: 'high' | 'medium' | 'low';
  corroboratedBy?: string[];    // other sources confirming the same signal
  contradictedBy?: string[];    // sources contradicting — flag conflicts
  isVerifiedByFiling?: boolean; // true if a BSE/NSE filing backs this up
}
```
- **Credibility filtering at the data layer**: items with `sourceCredibility: 'low'` must NEVER render in any section. Filter them out in `src/api/news.ts` before they reach components.
- Items with `corroboratedBy.length >= 2` can be displayed with elevated confidence styling.
- Items with `contradictedBy.length > 0` must show a "Conflicting Reports" tag with both sides visible.
- Build a `src/api/news.ts` (or similar) module that reads from a news data file
- Each section's data loader should accept optional news items and merge them into the section's display
- When news data is empty/missing, sections should render cleanly with just the financial/operational data — **no empty states, no "no news available" messages, no broken layouts**

### Final refresh workflow (Sunday morning):
1. Drop updated news JSON into data directory
2. Run `npm run build`
3. Single-file HTML output is presentation-ready
4. No code changes needed — only data swap

---

## PROJECT MEMORY & PROGRESS TRACKING (MANDATORY)

### Checkpoint Files — Resume-Safe Execution
Claude Code MUST maintain progress files so that if execution fails, crashes, or is interrupted at any step, work can resume from the last completed checkpoint without redoing everything.

**Create and maintain these files at project root:**

**1. `PROGRESS.md` — Task execution log (update after EVERY step)**
```markdown
# Execution Progress

## Status: IN_PROGRESS | COMPLETED | FAILED_AT_STEP_X

### Step 1 — Scan data_sources/ ✅
- Completed: 2026-02-21 14:30
- Files cataloged: 23
- Notes: [any relevant observations]

### Step 2 — Create SourceAttribution component ✅
- Completed: 2026-02-21 14:45
- Files created: src/components/ui/SourceAttribution.tsx
- Notes: [any decisions made]

### Step 3 — Create NewsItem interface ⏳ IN PROGRESS
- Started: 2026-02-21 15:00
- Files touched: src/api/news.ts, src/types/news.ts
- Blockers: [if any]

### Step 4 — Not started ⬜
```
- Mark each step: ✅ Done | ⏳ In Progress | ❌ Failed | ⬜ Not Started
- Include: timestamp, files created/modified, any decisions or trade-offs made
- If a step fails, log the error message and what was attempted
- **On restart:** Claude Code must read `PROGRESS.md` first, identify the last ✅ step, and resume from the next one

**2. `DECISIONS.md` — Architecture and data decisions log**
```markdown
# Decisions Log

### D001 — Mock data replacement strategy
- Decision: Using "-" for all unavailable data points instead of estimates
- Reason: Client requirement — strict real data only
- Affected sections: S1, S6, S7, S9, S10, S11

### D002 — News data graceful degradation
- Decision: Components hide news subsections entirely when news array is empty
- Reason: No empty states, no "no data" messages
- Affected components: [list]
```
- Log every non-trivial decision (data mapping choices, component structure, source interpretation)
- This helps future sessions understand WHY something was built a certain way

**3. `DATA_CATALOG.md` — What data was found and where it went**
```markdown
# Data Catalog

## Files Scanned
| File | Path | Type | Sections Fed | Records |
|------|------|------|-------------|---------|
| quarterly-results.csv | data_sources/ | Financial | S3, S1 | 240 |
| deals-tracker.md | data_sources/ | Deals | S4 | 38 |
| ... | ... | ... | ... | ... |

## Unmapped Data Gaps
| Section | Data Point | Status | Notes |
|---------|-----------|--------|-------|
| S6 | Leadership timeline | NO DATA | Will show "-" |
| S7 | Competitive moves | PARTIAL | 8 of 15 companies covered |
```

### Source Documentation File — For Presentation Reference
**Create `SOURCE_REFERENCE.md` at project root — this is the presenter's cheat sheet.**

This file documents how EVERY piece of data in the dashboard is sourced. When presenting to A&M, the presenter needs to be able to answer "where did this number come from?" for any data point on screen — within 5 seconds.

Structure:
```markdown
# Source Reference Guide — Consumer Durables Intelligence Dashboard
> Use this document during the A&M presentation to quickly answer sourcing questions.
> Last updated: [auto-populate on build]

---

## Section 1 — Executive Snapshot

### A&M Opportunity Summary Card
| Data Point | Value Shown | Source | How It's Calculated | Confidence |
|-----------|------------|--------|---------------------|------------|
| Total Advisory Opportunity | ₹850 Cr | Internal scoring model | Sum of estimated engagement sizes for all Qualified + Outreach-Ready pipeline items in S11 | Derived |
| Companies in Distress Zone | 3 | Screener.in Q3 FY26 | Count where: Net Debt/EBITDA > 3x OR (ROCE declining 2+ qtrs AND EBITDA% < sector P25) | Derived from Verified |
| Top Recommended Action | "Approach Butterfly..." | Cross-section analysis | Highest-severity watchlist item (S10) with matching A&M service line | Derived |

### Key Insights Bullets
| Bullet | Source | Tier |
|--------|--------|------|
| "Gross margin pressure easing..." | Screener.in Q2→Q3 EBITDA% trend for 14 companies | T1 Verified |
| "AC demand surge ahead of season" | Google Trends data (if available) + Voltas Q3 concall | T2 + T3 |

---

## Section 2 — Market Pulse
[... same structure for every section ...]

---

## Section 3 — Financial Performance Tracker

### Main Table
| Column | Source | Methodology | Confidence |
|--------|--------|-------------|------------|
| Revenue (₹Cr) | Screener.in Quarterly Results | Direct scrape, TTM | T1 Verified |
| YoY Growth | Screener.in | (Current Q Rev / Same Q Prev Year Rev) - 1 | T1 Derived |
| EBITDA % | Screener.in Quarterly Results | OPM% from quarterly P&L | T1 Verified |
| WC Days | Screener.in Ratios (Annual) | Annual figure, not quarterly | T1 Verified |
| Net Debt/EBITDA | Screener.in Balance Sheet ÷ P&L | (Total Borrowings - Cash) / TTM EBITDA | T1 Derived |
| Rating | Auto-computed | Peer-relative z-score across 6 metrics | Internal Model |
| A&M Signal | Auto-computed | Rule-based: Red if (neg growth + margin decline + leverage > 3x) | Internal Model |

[... continue for ALL sections ...]

---

## Quick Lookup: "Where does [X] come from?"

| If they ask about... | Point them to... | Source |
|---------------------|-----------------|--------|
| Any revenue/margin number | Screener.in company page | T1 |
| Commodity price forecasts | Mead Metals 2026 Procurement Guide | T2 |
| BEE norms / policy impact | Croma article + DSIJ analysis | T3 |
| Deal/transaction details | BSE/NSE filings + news publications | T1 + T4 |
| Operational metrics (capacity, localization) | Company earnings calls + annual reports | T1/T3 |
| Market sizing (₹45K Cr) | IBEF + CEAMA industry reports | T3 |
| Promoter holding changes | BSE quarterly shareholding filings | T1 |
| Earnings quality tags | Sovrenn.com quarterly result tags | T3 |
```

**Rules for `SOURCE_REFERENCE.md`:**
- Cover EVERY section, EVERY card, EVERY column
- If a data point shows `"-"` (unavailable), document it here too: `"Data not available — will show dash"`
- Include the calculation methodology for any derived metric
- Flag where news data will plug in on Sunday: `"[PENDING NEWS REFRESH]"`
- This file must be updated as part of every execution step — not written once at the end

---

## CONSTRAINTS

- **STRICTLY real data only** — every displayed value must trace to a source. Where data is unavailable, show `"-"`. Never fabricate, estimate without source, or use placeholder values.
- **Progress files are MANDATORY** — update `PROGRESS.md` after completing EVERY step. Update `SOURCE_REFERENCE.md` as each section is built. Create `DATA_CATALOG.md` after Step 1 and update as data is consumed. Create `DECISIONS.md` and log every non-trivial choice.
- **On restart/resume:** ALWAYS read `PROGRESS.md` first. Resume from the step after the last ✅. Do not redo completed steps.
- **`SOURCE_REFERENCE.md` must be presentation-complete** — the presenter should be able to ctrl+F any metric name and find its source within 5 seconds
- **Broader research files:** Some files in `data_sources/` or the parent directory are compiled research (markdown reports, aggregated CSVs). These often cite their own sources inline. When using data from these files, trace to the ORIGINAL source cited within the file — do not cite the research file itself as the source. E.g., if `market-pulse-data.md` says "AC market size ₹22K Cr (IBEF 2025)", the source attribution should cite `IBEF 2025`, not `market-pulse-data.md`

- **NO dummy/placeholder news data anywhere** — build the slots, types, and rendering logic but leave news content empty until the final data refresh
- **News-dependent components must degrade gracefully** — if news array is empty, the component should either hide itself or show only the non-news data (financials, operational metrics) without any visual breakage
- **Strictly retain all 11 sections** — do not merge or remove any section
- **Do not touch export/sharing functionality** — out of scope
- **Build output remains single HTML** via `vite-plugin-singlefile`
- **Follow existing patterns**: `useFilteredData<T>(sectionId)`, lazy-loaded sections, Zustand filter store, TanStack Query
- **Tailwind CSS 4** with `@theme` tokens — no `tailwind.config.js`
- **Dark mode must continue to work** — all new color tokens need dark mode variants
- **Multi-tenant branding must be preserved** — new A&M-specific elements should respect `data-tenant` theming
