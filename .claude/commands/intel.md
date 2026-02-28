Gather intelligence from company documents and populate the dashboard.

**Argument**: `{{arg1}}` — Path to a company folder containing PDF source documents (earnings call transcripts, annual reports).

---

## Overview

This skill reads source documents (quarterly earnings transcripts + annual reports) from a company folder, generates a structured intelligence report, produces a severity-ranked pain point CSV for A&M turnaround consulting evaluation, and then populates the corresponding company's data in the dashboard (`/Users/prateekkurkanji/Kompete/rohith-m5/index_v3.html`).

---

## Phase 1: Document Ingestion

1. **List all PDFs** in the folder at `{{arg1}}` using `ls`
2. **Read each PDF** using the Read tool — classify each as:
   - `QUARTERLY_TRANSCRIPT` — earnings call transcript (look for Q&A, analyst names, "earnings call")
   - `ANNUAL_REPORT` — integrated annual report (look for "annual report", board of directors, financial statements)
   - `OTHER` — any other document type
3. **Log the document inventory** — record document name, date, type, and classification for the report header

**IMPORTANT**: Read ALL documents thoroughly. Do not skim. The quality of intelligence depends on exhaustive extraction.

---

## Phase 2: Intelligence Extraction

For each document, extract intelligence into these 11 sections. Use direct quotes as evidence. Note the source document for every data point.

### Section 1: Industry Volume Growth vs Company Growth
- Company revenue growth vs industry growth rates
- Segment-wise growth rates (which segments outperform/underperform)
- Market share signals (gained/lost/maintained)
- Volume vs value growth dynamics

### Section 2: Operational Intelligence from Management Commentary
- Strategic initiatives mentioned across quarterly calls
- Capacity expansion plans
- New business verticals or investments
- M&A appetite
- Margin guidance (specific bps targets)
- B2B vs B2C demand signals
- Operating leverage signals

### Section 3: Capacity Utilization / Plant Utilization
- Utilization rates by segment/plant
- Capacity expansion capex (current and planned)
- Supply constraints or headroom
- New land/facility acquisitions

### Section 4: Pricing Strategy and Commodity Cost Impact
- Commodity pass-through approach (immediate vs lagged)
- Key commodity exposures and current prices
- BEE/regulatory pricing impacts
- Premium vs mass pricing dynamics
- Deflationary or inflationary category trends

### Section 5: Cost Structure Strategy
Extract sub-sections:
- **5a. Direct vs Indirect Costs** — segment margins, EBITDA bridge, unallocated overheads
- **5b. Commodity Dependency** — key raw material exposures, import dependency %, localization
- **5c. Employee Cost** — quarterly trend, headcount, attrition, R&D team size, operating leverage signals
- **5d. Process Cost** — supply chain optimization, SKU rationalization, backward integration
- **5e. Field Force / Sales Productivity** — distribution network size (dealers, retailers), rural vs urban, modern retail
- **5f. Sustainability Cost** — renewable energy, patents, ESG-linked cost initiatives

### Section 6: Gross Margin Strategy and Trade-offs
- **6a. Volume vs Margin** — segment-differentiated strategy (which segments prioritize volume vs margin)
- **6b. Sales Schemes** — promotional spend discipline, inventory clearance tactics
- **6c. Channel Architecture** — multi-brand, multi-tier distribution structure, channel inventory
- **6d. Revenue Management** — revenue mix diversification, fastest-growing segments, new revenue streams

### Section 7: Localization Strategy (Import vs Domestic)
- Import dependency percentage
- Key localization initiatives (component tie-ups, backward integration)
- Manufacturing unit count
- Currency/tariff risk insulation

### Section 8: Market Share Gain/Loss Trends
- Explicit management claims on market share
- Category-level share signals
- Competitive dynamics (regional brands, price wars)

### Section 9: Contract Manufacturing Strategy
- % of production outsourced
- Key contract manufacturing partners
- Mark as "NOT DISCLOSED" if not mentioned

### Section 10: After-Sales Service Cost Signals
- Service resolution metrics
- NPS or customer satisfaction scores
- Service cost data (if available)
- Mark undisclosed metrics explicitly

### Section 11: Retail Footprint / Distribution / Manpower Scale
- Dealer/retailer/channel partner counts
- Brand portfolio and SKU count
- Warehousing footprint
- Rural penetration
- International presence

### Strategic Signals Summary
After extracting all 11 sections, synthesize:
- **Key Opportunities** (numbered, 5-10 items)
- **Key Risks** (numbered, 5-10 items)
- **Cost Strategy Direction** (1 paragraph)
- **Market Position Direction** (1 paragraph)

### Evidence Gaps
List all indicators that are NOT DISCLOSED in the source documents as a table.

### JSON Metadata Block
End the report with a ```json block containing structured data:
- `report_metadata` (company, date, documents analyzed)
- `financial_summary` (key financial metrics)
- `segment_performance` (array of segments with revenue, growth, margins)
- `intelligence_sections` (condensed insights per section with confidence levels)
- `strategic_signals` (opportunities, risks, cost/market direction)
- `evidence_gaps` (array of undisclosed indicators)

---

## Phase 3: Write Intelligence Report

Write the complete report to `{{arg1}}/{CompanyName}_Intelligence_Report.md` following the exact structure above. Use the Havells report as the gold-standard reference: `/Users/prateekkurkanji/Kompete/rohith-m5/Havells/Havells_Intelligence_Report.md`

Each section MUST have:
- **Insight**: Dense paragraph with specific numbers and quotes
- **Evidence**: Bulleted list of direct quotes with source attribution
- **Source**: Document names
- **Confidence**: High / Medium / Low

---

## Phase 3.5: Engagement Thesis

After writing the intelligence report, generate a structured engagement thesis at the end of the report file. This is the "so what" — it translates intelligence into an actionable advisory perspective.

### Structure

Append the following to the intelligence report file:

```markdown
---

## Engagement Thesis

### Situation
{What is happening — factual, from the data. 2-3 sentences with specific numbers.}

### Complication
{Why this matters now — what makes the timing critical. 2-3 sentences.}

### Implication for Advisory
{What specific advisory service lines apply and why. 2-3 sentences. Reference A&M service lines: Turnaround, PEPI, CDD, Transaction Advisory, Interim Management, Disputes.}

### Recommended Approach
{Specific entry point — who to talk to (CFO, CEO, PE sponsor), what to lead with. 2-3 sentences.}

### Key Evidence
{3-5 strongest data points with direct quotes from the intelligence report}

### Signal Classification
- **Primary Signal Type**: {performance | transition | friction | ecosystem}
  - performance = margin deterioration, cost escalation, revenue decline
  - transition = leadership change, M&A, restructuring, IPO
  - friction = narrative drift, undisclosed metrics, analyst skepticism
  - ecosystem = regulatory change, channel disruption, commodity shock
- **Sub-signals**: {comma-separated list of specific signals detected}
- **Matched Service Lines**: {which A&M service lines this maps to}
- **Urgency**: {high | medium | watch}
- **Confidence**: {High | Medium | Low}
```

### Rules
- Every claim must trace back to the intelligence report — no external knowledge
- The thesis should be professional and evidence-grounded, not alarmist
- Use Situation-Complication-Implication structure (standard consulting framework)
- The signal classification will be used to populate the dashboard's `signalTaxonomy` field in `COMPANY_META`

### Dashboard Integration

After generating the thesis, update the company's `signalTaxonomy` field in `COMPANY_META` (in `index_v3.html`):

```js
signalTaxonomy: {
  primary: "{primary signal type from thesis}",
  signals: ["{sub-signal-1}", "{sub-signal-2}", ...],
  serviceLines: ["{matched-service-line-1}", ...],
  urgency: "{urgency from thesis}",
  thesis: {
    situation: "{situation text}",
    complication: "{complication text}",
    implication: "{implication text}"
  }
}
```

---

## Phase 4: Pain Point Severity Ranking (CSV)

After writing the intelligence report, generate a severity-ranked CSV of all signals for A&M turnaround consulting evaluation.

### Input
Use the intelligence report generated in Phase 3 as the sole input. Extract every discrete signal from all 11 sections + Strategic Signals Summary. Each insight, evidence bullet, risk, and opportunity is a signal.

### Evaluation Criteria
Assess each signal through A&M's turnaround consulting lens across these dimensions:
- Financial impact (margin, cost, profitability)
- Operational risk
- Structural business risk
- Strategic risk
- Governance risk
- Growth risk
- Market competitiveness
- Sustainability of performance

### Severity Priority Order (highest to lowest)
1. Structural risks (ownership, technology dependency, governance)
2. Margin deterioration or cost escalation
3. Operational disruptions
4. Industry underperformance vs company
5. Strategic execution gaps
6. Watch signals
7. Positive signals
8. Informational signals

### CSV Output Format

Write to `{{arg1}}/{CompanyName}_Pain_Points_Ranked.csv` with these columns:

```
Rank,Indicator,Signal,Status,Time Period,Severity Level,Severity Rationale,Evidence (Verbatim),Source Document,Line Reference
```

Column rules:
- **Rank**: 1 = highest severity (strongest A&M consulting opportunity)
- **Indicator**: Section name or sub-section from the intelligence report (e.g., "Capacity Utilization", "Cost Structure — Employee Cost", "Market Share")
- **Signal**: The business signal — use original wording from the intelligence report
- **Status**: `positive` / `negative` / `watch` / `structural_risk` / `informational` / `not_disclosed`
- **Time Period**: The fiscal period the signal refers to (e.g., "Q3 FY26", "FY25", "FY24-FY27")
- **Severity Level**: `Critical` / `High` / `Medium` / `Low` / `Informational`
- **Severity Rationale**: 1-2 lines explaining why this matters from a turnaround consulting perspective
- **Evidence (Verbatim)**: Exact quotes from the intelligence report evidence bullets. Copy verbatim — do NOT summarize, paraphrase, shorten, or modify. If multiple evidence lines exist, join with ` | `. If no evidence was provided, write `Not Provided`
- **Source Document**: Exact source document name as written in the intelligence report
- **Line Reference**: Section number from the intelligence report (e.g., "Section 3", "Section 5c", "Strategic Signals — Key Risks #2")

### Strict Rules
- **One row per signal** — do not merge signals
- **Every signal from the report must appear** — no omissions
- **No external knowledge** — use ONLY data from the intelligence report
- **No fabrication** — if data was "NOT DISCLOSED", still include and rank it (typically Low/Informational severity)
- **Evidence must be verbatim** — this is non-negotiable
- **Positive signals get ranked too** — but lower severity (they indicate less A&M opportunity)
- Structural risks outrank short-term fluctuations
- Escape commas in CSV fields with double quotes

### Self-Verification (before writing CSV)
Before producing the final file, internally verify:
- All signals from all 11 sections + Strategic Signals are included
- No duplicates
- Ranking order follows severity priority logic
- Sources preserved exactly
- Evidence is verbatim (not summarized)
- No hallucinated signals

---

## Phase 5: Dashboard Population

Read the dashboard file: `/Users/prateekkurkanji/Kompete/rohith-m5/index_v3.html`

Find the company in the COMPANIES JavaScript array and in each HTML section below. Use the Edit tool for all updates.

### 4.0: SIGNAL_DATA — Evidence Vault Fields

When generating each signal object in the `SIGNAL_DATA` entry for this company, include `conf` and `ev` fields alongside the existing `r`, `ind`, `sig`, `st`, `per`, `sev`, `rat` fields:

```js
{r:1, ind:"...", sig:"...", st:"...", per:"...", sev:"...", rat:"...",
 conf:"direct",
 ev:[{q:"Verbatim quote from transcript or report", src:"Q3 FY26 Transcript", ref:"Section 3"}]}
```

**Mapping from CSV columns:**
- `Evidence (Verbatim)` → `ev[].q` — If multiple quotes separated by ` | `, create multiple `ev` entries
- `Source Document` → `ev[].src`
- `Line Reference` → `ev[].ref`

**Confidence classification (`conf`):**
- `"direct"` — Verbatim management quotes (contains quotation marks, "said", "stated", or direct dialogue attribution)
- `"calculated"` — Derived from disclosed financials (contains percentages, growth rates, Rs/INR amounts, computed ratios)
- `"inferred"` — Synthesized across multiple sources, or evidence is "Not Provided"

**Rules:**
- Every signal MUST have `conf` and `ev` fields
- Truncate `ev[].q` to 200 characters max (add "..." if truncated)
- If no verbatim evidence exists for a signal, use the signal text as the quote and set `conf:"inferred"`
- Escape single quotes in strings with `\'`

### 4.1: COMPANIES Array Updates

Locate the company object in the `COMPANIES` array (search for its `id` or `name`).

Update these fields using intelligence report data:

**productMix** — Use segment revenue shares from the annual report:
```js
productMix: [{segment:"SegmentName",pct:XX}, ...]
```
Percentages must sum to ~100. Use segment names as the company reports them.

**premiumMix** — Estimate premium/mass/economy split from transcript intelligence:
```js
premiumMix: {premium:XX,mass:XX,economy:XX}
```
Look for BLDC penetration, premium product mentions, mass-market brand share. Must sum to 100.

**variance** — Enrich with specific intelligence from transcripts:
- Keep existing financial metrics (revenue growth, EBITDA margin, net profit)
- ADD: operating leverage signals, margin guidance (bps), capacity utilization, key turnaround metrics, employee cost trends
- Keep it dense but factual — every claim must come from the report

**source** — Add transcript and annual report sources:
```js
source: "Company Filings (TICKER/consolidated/) | Q1-Q3 FYXX Earnings Transcripts | Annual Report FYXX | WC Days: ratios Mar 2025 | D/E: balance sheet Sep 2025"
```

### 4.2: Talk vs Walk Card

Find the company's `<div class="tvw-card">` in the Executive Snapshot section (search for the company name inside a tvw-card).

Update:
- **Management Says**: Use 3-4 direct management quotes/claims from transcripts showing their narrative. Use `&ldquo;` and `&rdquo;` for quotes.
- **Data Shows**: Contrast with actual data points that reveal the reality. Include specific numbers (revenue growth, margin trends, cost stability, capacity constraints, cash reserves). Use `&rarr;` for trend arrows, `&lt;` for less-than.
- **Source attribution**: Change tier to `tier-verified` and source to transcript + annual report references.
- **Badge**: Keep existing badge (Disconnect/Stealth Signal/Aligned) or update based on the gap between management narrative and data reality:
  - `tvw-badge-disconnect` — Management overpromises vs data underdelivers
  - `tvw-badge-stealth` — Management is conservative but data shows outperformance
  - `tvw-badge-aligned` — Management claims match data closely

### 4.3: Scale vs Profitability Matrix Row

Find the company's `<tr>` in the Scale Matrix table (search for the company name in a `<strong>` tag near the matrix).

Update the last `<td>` (description column) with verified business model data:
- Distribution scale (dealers, retailers, channel partners)
- Brand/SKU count
- Import dependency
- Cash reserves
- Key capacity or strategic signals
- Use `&lt;` for less-than in HTML

### 4.4: A&M Value-Add Kanban Card

Find the company's `<div class="kanban-card">` in the A&M Value-Add section.

Update:
- **kanban-card-type**: Change from generic to specific advisory angle (e.g., "Multi-Front Growth Advisory", "Margin Turnaround Play", "Capacity Unlock Strategy")
- **kanban-card-points**: Replace with 3-4 specific, actionable advisory angles derived from the intelligence report. Each `<li>` should be a concrete opportunity with numbers.
- **Source**: Change tier to `tier-verified` with transcript + annual report references.

### 4.5: Watchlist Entry

Find the company's `<div class="q-entry">` in the Watchlist section.

Update:
- **q-entry-signal**: Replace with specific margin/growth thesis from transcripts. Include management guidance, operating leverage evidence, key financial metrics. Change source tier badge to `tier-verified`.
- **q-entry-detail**: Replace with specific catalysts (capacity, margin normalization, premium mix, new revenue streams) with numbers.
- **severity-dots**: Upgrade to 5/5 if transcript evidence is direct and strong. Use this HTML for 5/5:
  ```html
  <span class="severity-dots" title="Severity: 5/5"><span class="dot filled high"></span><span class="dot filled high"></span><span class="dot filled high"></span><span class="dot filled high"></span><span class="dot filled high"></span></span>
  ```
- **Source**: Change to `tier-verified` with transcript + annual report references.

---

## Phase 6: Verification Checklist

After all edits, report to the user:

1. **Intelligence Report**: Path to the generated report, document count, section count
2. **Pain Points CSV**: Path to the ranked CSV, total signal count, critical/high/medium/low breakdown
3. **Dashboard Updates Made**:
   - COMPANIES array: productMix, premiumMix, variance, source
   - Talk vs Walk card: management says / data shows
   - Scale Matrix row: description
   - Kanban card: type + advisory points
   - Watchlist entry: signal + catalysts + severity
3. **Sections to verify in browser**:
   - Financial Performance table (click company row)
   - Executive Snapshot > Talk vs Walk
   - Sub-Sector Deep Dive > Product Mix chart
   - Sub-Sector Deep Dive > Premiumization chart
   - Sub-Sector Deep Dive > Scale Matrix
   - A&M Value-Add kanban
   - Watchlist quadrant

---

## Phase 6.5: Cross-Company Synthesis (Run After Multiple Companies Processed)

This phase is NOT run during individual company processing. It runs separately after intelligence reports exist for multiple companies. Invoke it manually when 3+ company reports are available.

### Trigger

Run this phase when the user asks for cross-company analysis, sector-level synthesis, or when processing the last company in a batch.

### Input

Read ALL existing intelligence reports in the `rohith-m5/` company subfolders:
- Look for `*_Intelligence_Report.md` files in each company folder
- Also check `Kompete - Industry Intel 2/` subfolder

### Output

Write to `/Users/prateekkurkanji/Kompete/rohith-m5/Cross_Company_Synthesis.md`

### Structure

```markdown
# Cross-Company Synthesis — Consumer Durables Sector
*Generated: {date} | Companies Analyzed: {count} | Source: Individual Intelligence Reports*

## 1. Product-Market Peer Comparison

### Room AC
| Company | Revenue | EBITDA % | Market Share Signal | Key Differentiator |
(Compare: Voltas, Blue Star, Havells Lloyd, LG, Crompton coolers)

### Fans
(Compare: Crompton, Havells, Orient, Bajaj)

### Kitchen Appliances
(Compare: TTK Prestige, Butterfly, Crompton SDA)

### Washing/Laundry
(Compare: IFB, Whirlpool, LG)

### Wires & Cables
(Compare: Havells, V-Guard, Crompton)

### EMS/OEM
(Compare: Amber, Dixon)

## 2. Cross-Company Signal Patterns

### Capacity Signals
Which companies expanding vs underutilized? Map capacity utilization across sector.

### Margin Convergence/Divergence
Are margins compressing sector-wide or company-specific? Identify outliers.

### Channel Disruption
Modern trade, e-commerce, quick commerce impact across companies.

### Commodity Exposure
Common raw material risks (copper, aluminum, steel) — who is hedged vs exposed.

### Operating Leverage
Employee cost vs revenue growth ratio across companies.

## 3. Sector-Level Engagement Map

### By Service Line
- **Turnaround**: {companies with active turnaround signals}
- **PEPI**: {companies where performance improvement is viable}
- **CDD**: {companies likely to be PE/M&A targets}
- **Transaction Advisory**: {companies with active deal signals}
- **Disputes**: {companies with governance/fraud signals}

### By Urgency
- **Engage Now**: {high urgency companies with strong evidence}
- **Qualify Further**: {medium urgency — need more data}
- **Monitor**: {watch list — signals emerging but not actionable yet}

## 4. Competitive Dynamics
Which companies are winning share from which? Map the competitive flows.

## 5. Missing Intelligence
What do we NOT know? List companies with thin reports, undisclosed segments, or limited transcript access.
```

### Rules
- Use ONLY data from existing intelligence reports — no external research
- Mark confidence level for each comparison (High if both companies have verified data, Medium if one is derived)
- This synthesis should surface insights that are invisible in individual reports
- Focus on patterns that create advisory opportunities

---

## Important Rules

- **Never fabricate data**. If something is not in the source documents, mark it as "NOT DISCLOSED" in the report and do not put it in the dashboard.
- **Use direct quotes** as evidence. Wrap management quotes in proper HTML entities (&ldquo; &rdquo;) in the dashboard.
- **Preserve existing financial metrics** in the COMPANIES array (revGrowth, ebitdaMargin, wcDays, roce, de, pe, netProfit, etc.) — only update the narrative/mix fields.
- **Source tier**: Use `tier-verified` for data directly from transcripts/annual reports. Use `tier-derived` only for calculated/inferred data.
- **HTML entities**: Use `&rarr;` for arrows, `&lt;` for less-than, `&mdash;` for em-dash, `&ndash;` for en-dash, `&ldquo;`/`&rdquo;` for smart quotes in HTML sections. In JavaScript strings, use regular characters.
- If the company does NOT exist in the dashboard yet, inform the user — do not add new companies to the COMPANIES array without explicit instruction.
