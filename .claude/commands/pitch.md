Generate a comprehensive A&M Engagement Brief (target pitch) for a company.

**Argument**: `{{arg1}}` — Company name (e.g., "Havells", "Bajaj") or "top5" to generate for the 5 highest-urgency targets.

---

## Overview

This skill generates a **comprehensive, multi-section engagement brief** for a target company. It synthesizes intelligence reports, financial data, narrative drift analysis, signal taxonomy, news/regulatory context, and A&M case studies into a single, actionable document that an A&M Managing Director can use for both internal pursuit decisions and client outreach.

The output is two-fold:
1. **Shareable markdown file** — `{Company}/{CompanyName}_AM_Pitch.md` — printable, externally shareable
2. **Dashboard-ready pitch data** — `pitch` field in `COMPANY_META` — powers the Engagement Brief drawer in the dashboard

---

## Prerequisites

Before running this skill, the company must have:
1. An existing intelligence report (`{Company}/{CompanyName}_Intelligence_Report.md`)
2. A populated `signalTaxonomy` with `leverMapping` in `COMPANY_META` (in `index_v5.html`)
3. A pain points CSV (`{Company}/{CompanyName}_Pain_Points_Ranked.csv` or similar)

If these don't exist, run `/intel {folder_path}` first.

---

## Phase 1: Data Gathering

Read ALL of the following sources — the pitch must synthesize everything available:

1. **Intelligence report** — `rohith-m5/{CompanyFolder}/{CompanyName}_Intelligence_Report.md`
2. **Pain points CSV** — `rohith-m5/{CompanyFolder}/{CompanyName}_*_ranking.csv` or `*_Pain_Points_Ranked.csv`
3. **COMPANY_META** from `index_v5.html` — extract:
   - `signalTaxonomy` (leverMapping, engagementType, keyMetricGaps, thesis)
   - `productMix`, `premiumMix`, `variance`, `source`
4. **FINANCIAL_DATA** from `index_v5.html` — extract ALL rows for this company (annual + quarterly) to build trend
5. **FINANCIAL_DATA for peer companies** — extract latest rows for 3-5 named peers in the same sub-sector
6. **NARRATIVE_DRIFT** from `index_v5.html` — if this company has drift data, extract all drift items
7. **NEWS_INTELLIGENCE** from `index_v5.html` — filter for news/regulatory/catalyst items affecting this company
8. **Case studies** from `NEWS_INTELLIGENCE.caseStudies` — filter by `relevantCompanies` including this company's ID
9. **Talk vs Walk card** — find the company's `tvw-card` HTML in the Executive Snapshot section
10. **Kanban card** — find the company's advisory angle from the A&M Value-Add section
11. If `{{arg1}}` is "top5", identify the 5 companies with highest `urgency` (high first) and most STRONG evidence levers, then generate pitches for each sequentially.

---

## Phase 2: Generate Pitch Markdown

Write to `rohith-m5/{CompanyFolder}/{CompanyName}_AM_Pitch.md`:

```markdown
# {Company Name} — A&M Engagement Brief
## Consumer Durables | {Sub-Sector} | {Engagement Type} | {Date}

---

### Executive Summary

{3-5 sentence executive summary that answers: (1) What does this company do and at what scale? (2) What is the core performance issue? (3) Why is the timing right for advisory engagement? (4) What is the headline advisory thesis? Include the company's latest revenue, EBITDA %, and the key metric that signals advisory opportunity.}

---

### Company Snapshot

| Attribute | Detail |
|-----------|--------|
| **Revenue** | Rs {XX,XXX} Cr ({period}) |
| **EBITDA Margin** | {X.X}% ({source}) |
| **Sub-Sector** | {Sub-Sector} |
| **Key Segments** | {Segment 1 (XX%), Segment 2 (XX%), ...} |
| **Market Position** | {Brief — market share claims, competitive standing} |
| **Leadership** | {CEO/MD name, tenure, recent changes} |
| **Signal Classification** | {Primary signal type: performance/transition/friction/ecosystem} |
| **Urgency** | {High / Medium / Watch} |
| **Engagement Type** | {Rapid Results / PEPI / PEPI-PE / Turnaround / CDD / Transaction} |
| **Documents Analyzed** | {N documents — list types} |

---

### EBITDA Position vs Named Peers

| Company | EBITDA % | Period | Source |
|---------|----------|--------|--------|
| **{Company}** | **{X.X}%** | {Period} | {Source document} |
| {Named Peer 1} | {X.X}% | {Period} | {Source} |
| {Named Peer 2} | {X.X}% | {Period} | {Source} |
| {Named Peer 3} | {X.X}% | {Period} | {Source} |

{1-2 sentence interpretation — what does this positioning mean for advisory opportunity?}

---

### Financial Performance Trend

| Period | Revenue (Rs Cr) | EBITDA % | ROCE | D/E | WC Days |
|--------|-----------------|----------|------|-----|---------|
| FY25 (Annual) | {XX,XXX} | {X.X}% | {X.X}% | {X.XX} | {XX} |
| Q4 FY25 | {X,XXX} | {X.X}% | — | — | — |
| Q1 FY26 | {X,XXX} | {X.X}% | — | — | — |
| Q2 FY26 | {X,XXX} | {X.X}% | — | — | — |
| Q3 FY26 | {X,XXX} | {X.X}% | — | — | — |

**Trend Analysis**: {2-3 sentences analyzing the trajectory — is it improving, deteriorating, volatile? What's the quarterly pattern revealing? Include revenue growth rates, margin movement, any inflection points.}

---

### Why Now — Timing & Catalysts

{4-6 sentences synthesizing the Complication from the engagement thesis with specific catalysts that create urgency. This must answer: why is THIS quarter the right time to approach this company? Include:}

- **Structural catalyst**: {Leadership change, regulatory shift, M&A event, etc.}
- **Performance trigger**: {Margin compression, revenue decline, guidance miss, etc.}
- **Window of opportunity**: {BEE transition, budget cycle, board meeting, AGM, etc.}

---

### Engagement Thesis (SCI Framework)

**Situation**: {What is happening — factual, from the data. 3-4 sentences with specific numbers. Pull from signalTaxonomy.thesis.situation.}

**Complication**: {Why this matters now — what makes the timing critical. 3-4 sentences. Pull from signalTaxonomy.thesis.complication.}

**Implication for Advisory**: {What specific A&M service lines apply and why. 3-4 sentences. Pull from signalTaxonomy.thesis.implication.}

---

### Investigation Areas (Evidence-Graded)

These are the specific operational areas where A&M can investigate value creation opportunities. Each area is graded by the strength of available evidence — STRONG areas can be discussed with confidence in a first meeting; MODERATE areas warrant deeper probing; DIRECTIONAL areas indicate patterns worth exploring.

| # | Investigation Area | Evidence | Strength | Data Needed for Quantification |
|---|-------------------|----------|----------|-------------------------------|
| 1 | **{Area Name}** | {Specific evidence with numbers from intelligence report} | STRONG | {What operational data A&M needs to quantify the opportunity} |
| 2 | **{Area Name}** | {Evidence} | STRONG | {Data needed} |
| 3 | **{Area Name}** | {Evidence} | MODERATE | {Data needed} |
| 4 | **{Area Name}** | {Evidence} | MODERATE | {Data needed} |
| 5 | **{Area Name}** | {Evidence} | DIRECTIONAL | {Data needed} |
{4-8 areas, ordered by evidence strength (STRONG first)}

**Evidence Strength Key**: STRONG = direct financial data or management quotes (usable in first meeting) | MODERATE = partial data, magnitude needs validation | DIRECTIONAL = pattern inferred, needs operational deep-dive

---

### Segment Performance Breakdown

| Segment | Revenue Share | Trend | Key Signal |
|---------|--------------|-------|------------|
| {Segment 1} | {XX}% | {Growing/Declining/Flat} | {One-line signal from intelligence report} |
| {Segment 2} | {XX}% | {Trend} | {Signal} |
| ... | ... | ... | ... |

**Premium Mix**: Premium {XX}% / Mass {XX}% / Economy {XX}%

{1-2 sentences on what the segment mix reveals — cross-subsidy risks, margin dilution from growth segments, concentration risk, etc.}

---

### Management Credibility Assessment

#### Narrative Drift Detection
{If NARRATIVE_DRIFT data exists for this company, include each drift item. If not, note "No narrative drift data available — to be assessed in engagement."}

| Topic | Initial Guidance | Current Position | Drift Type | Severity |
|-------|-----------------|------------------|-----------|----------|
| {Topic 1} | {What they said initially} | {What the data/later statements show} | {retreat/pivot/silence/contradiction/stall/reframe} | {critical/high/medium} |
| {Topic 2} | ... | ... | ... | ... |

**Assessment**: {2-3 sentences on management credibility — are they over-promising? Selectively disclosing? Consistent? This is critical for engagement strategy — it determines whether to lead with data confrontation or collaborative framing.}

#### Talk vs Walk Summary

| Management Says | Data Shows |
|----------------|-----------|
| {Key claim 1} | {Contradicting/confirming data point} |
| {Key claim 2} | {Data point} |
| {Key claim 3} | {Data point} |

**Verdict**: {Disconnect / Stealth Signal / Aligned} — {1 sentence explanation}

---

### Peer Gap Analysis

| Metric | {Company} | {Named Peer 1} | {Named Peer 2} | {Named Peer 3} | Gap Significance |
|--------|-----------|-----------------|-----------------|-----------------|-----------------|
| EBITDA % | {X.X}% | {X.X}% | {X.X}% | {X.X}% | {1-line interpretation} |
| ROCE | {X.X}% | {X.X}% | {X.X}% | {X.X}% | {interpretation} |
| WC Days | {XX} | {XX} | {XX} | {XX} | {interpretation} |
| D/E | {X.XX} | {X.XX} | {X.XX} | {X.XX} | {interpretation} |
| Rev Growth | {X.X}% | {X.X}% | {X.X}% | {X.X}% | {interpretation} |

{Include only metrics where the company underperforms at least one named peer. Always name peers and cite sources.}

**Sources**: {Company}: {source + period}; {Peer 1}: {source}; {Peer 2}: {source}

---

### Market Context & External Factors

#### Regulatory Environment
{List relevant regulatory items from NEWS_INTELLIGENCE affecting this company. Include status, timeline, and company-specific impact.}

| Regulation/Policy | Status | Impact | Company Exposure |
|-------------------|--------|--------|-----------------|
| {e.g., BEE star rating revision} | {Implemented/Upcoming/Proposed} | {Tailwind/Headwind/Neutral} | {Specific impact on this company} |
| ... | ... | ... | ... |

#### Industry Catalysts
{List industry trends and macro factors from NEWS_INTELLIGENCE relevant to this company.}

- **{Catalyst 1}**: {Summary + A&M implication}
- **{Catalyst 2}**: {Summary + A&M implication}

#### Company-Specific News
{Any company-specific news items from NEWS_INTELLIGENCE.}

---

### Entry Strategy

| Element | Detail |
|---------|--------|
| **Lead Contact** | {Full name, Title, context (e.g., "appointed March 2025, 11 months in role")} |
| **Opening Message** | "{One-sentence pitch tailored to their specific pain — concrete enough that an MD could use this verbatim in an email or call. Reference a specific data point they'd recognize.}" |
| **Reference Point** | {Comparable A&M engagement, sector expertise, or evidence that builds credibility} |
| **Alternative Contact** | {If primary is new/unavailable — Board member, PE sponsor, CFO} |
| **Engagement Hook** | {What specific deliverable can A&M offer in a 2-week diagnostic that would demonstrate value?} |

**Approach Recommendation**: {2-3 sentences on HOW to approach — should A&M lead with data confrontation (showing management the gaps they're not seeing), collaborative framing (helping them solve a problem they've acknowledged), or opportunistic timing (regulatory/leadership change creates a natural entry point)?}

---

### Key Evidence (Verbatim Quotes)

> "{Direct quote from management — the most damning or most actionable}" — {Speaker Name, Title}, {Document}, {Date}

> "{Direct quote}" — {Speaker}, {Document}, {Date}

> "{Direct quote}" — {Speaker}, {Document}, {Date}

> "{Direct quote}" — {Speaker}, {Document}, {Date}

{4-6 quotes, selected for: (1) acknowledgement of a problem A&M can solve, (2) guidance that contradicts data, (3) specific numbers that reveal opportunity}

---

### A&M Track Record — Relevant Precedents

{If case studies exist for this company from NEWS_INTELLIGENCE.caseStudies, include them. If none match, write "No directly relevant case studies in current database."}

| Precedent | Type | Sector | Key Results | Relevance |
|-----------|------|--------|-------------|-----------|
| {Case study title} | {PEPI/Turnaround/etc.} | {Sector} | {Top 2-3 results} | {Why this is relevant to this target} |
| ... | ... | ... | ... | ... |

---

### Risk Factors & Mitigants

| # | Risk | Severity | Mitigant |
|---|------|----------|---------|
| 1 | {Specific risk — e.g., "New MD still in first year, may resist external advisory"} | High/Medium/Low | {How A&M can address this — e.g., "Position as supporting MD's mandate, not competing"} |
| 2 | {Risk} | {Severity} | {Mitigant} |
| 3 | {Risk} | {Severity} | {Mitigant} |
{3-5 risks, each with a specific mitigant}

---

### Recommended Engagement Scope

| Phase | Duration | Focus | Key Deliverables |
|-------|----------|-------|-----------------|
| **Phase 1: Diagnostic** | {2-4 weeks} | {Rapid assessment of top 2-3 investigation areas} | {Specific deliverables — e.g., "Cost structure benchmarking, make-vs-buy analysis, capacity optimization model"} |
| **Phase 2: Design** | {4-8 weeks} | {Solution design for validated opportunities} | {Deliverables} |
| **Phase 3: Implementation** | {3-6 months} | {Execution support} | {Deliverables} |

**Estimated Team**: {Team composition — e.g., "1 MD, 1 Director, 2 Associates for Phase 1; scale to 4-6 for implementation"}

**Success Metrics**: {What measurable outcomes would define success — framed around the investigation areas identified above}

---

### Appendix: Source Documents

| # | Document | Type | Period | Key Extractions |
|---|----------|------|--------|-----------------|
| 1 | {Document name} | {Transcript/Annual Report/Presentation} | {Period} | {What was extracted from this document} |
| 2 | ... | ... | ... | ... |

---

*Generated: {YYYY-MM-DD} | Confidence: {High/Medium/Low} | Documents: {N} | Signals: {N from pain points CSV}*
*Classification: {Signal Type} | Urgency: {High/Medium/Watch} | Engagement Type: {Type}*
*Intelligence Platform: Kompete Industry Intel v5*
```

---

### Phase 2 Rules

- Every claim must trace to the intelligence report or dashboard data — **no external knowledge**
- Quotes must be **verbatim** from the intelligence report
- **NEVER fabricate bps estimates** — use evidence strength grading (STRONG/MODERATE/DIRECTIONAL) instead
- **NEVER use anonymous "sector median" or "best-in-class"** — always name the peer company and cite source
- Investigation areas must match the `leverMapping` in signalTaxonomy (evidence-graded, not bps)
- The "Opening Message" should be **specific enough that the MD could use it verbatim** in an outreach
- Narrative drift section should only include drift items where evidence exists — don't invent drift
- Financial trend table should use actual FINANCIAL_DATA rows — don't interpolate missing quarters
- If any section has no data, write "{Section title}: Data not available — to be assessed in engagement" rather than omitting

---

## Phase 3: Dashboard Integration

After generating the markdown, update `COMPANY_META` in `index_v5.html` to add/update the `pitch` field for the company:

```js
pitch: {
  currentEbitda: {X.X},
  currentEbitdaSource: "{source document and period}",
  peerComparison: [
    {name:"{Named Peer}", ebitda:{X.X}, source:"{source document}"},
    // 2-4 named peers with sourced EBITDA %
  ],
  whyNow: "{3-6 sentences from Complication + catalysts — specific numbers, timing urgency}",
  investigationAreas: [
    {name:"{Area Name}", evidence:"{specific evidence with numbers}", evidenceStrength:"STRONG|MODERATE|DIRECTIONAL", dataNeeded:"{what operational data is needed}", mgmtAcknowledgement:"{verbatim quote or null}"},
    // 4-8 areas, ordered by evidence strength
  ],
  segmentBreakdown: [
    {segment:"{Name}", share:{XX}, trend:"{growing|declining|flat}", signal:"{one-line signal}"},
    // one per segment
  ],
  narrativeDrift: [
    {topic:"{Topic}", initialClaim:"{What they said}", currentReality:"{What data shows}", driftType:"{retreat|pivot|silence|contradiction|stall|reframe}", severity:"{critical|high|medium}"},
    // only if NARRATIVE_DRIFT data exists for this company
  ],
  financialTrend: [
    {period:"{FY25}", rev:{XXXX}, ebitda:{X.X}, roce:{X.X}},
    {period:"{Q1 FY26}", rev:{XXXX}, ebitda:{X.X}},
    // from FINANCIAL_DATA rows
  ],
  entry: {
    contact: "{Name, Title (context)}",
    message: "{One-sentence opening pitch}",
    reference: "{Comparable engagement or evidence point}",
    alternativeContact: "{Name, Title — if primary unavailable}",
    approachType: "{data-confrontation|collaborative|opportunistic}",
    diagnosticHook: "{What 2-week diagnostic deliverable demonstrates value}"
  },
  evidence: [
    {quote:"{Verbatim quote max 150 chars}", speaker:"{Name/Title}", source:"{Document}", date:"{Date}"},
    // 4-6 quotes
  ],
  risks: [
    {risk:"{Specific risk}", severity:"{high|medium|low}", mitigant:"{How to address}"},
    // 3-5 risks with mitigants
  ],
  engagementScope: {
    phase1: {duration:"{2-4 weeks}", focus:"{focus area}", deliverables:"{key deliverables}"},
    phase2: {duration:"{4-8 weeks}", focus:"{focus}", deliverables:"{deliverables}"},
    phase3: {duration:"{3-6 months}", focus:"{focus}", deliverables:"{deliverables}"},
    team: "{team composition}",
    successMetrics: "{measurable outcomes}"
  },
  generatedDate: "{YYYY-MM-DD}"
}
```

**IMPORTANT**: This format uses `investigationAreas` with evidence grading (STRONG/MODERATE/DIRECTIONAL), NOT `waterfall`/`topLevers` with fabricated bps numbers. The old format (`waterfall`, `targetEbitda`, `runRateCrores`, `topLevers`) is deprecated.

---

## Phase 3.5: Dashboard Rendering Enhancement

After updating the pitch data, check if the `openPitchDeck()` function in `index_v5.html` renders the new fields. If new fields (like `segmentBreakdown`, `narrativeDrift`, `financialTrend`, `engagementScope`) are not rendered, add rendering blocks for them in the function.

**New rendering sections to add** (if not already present):

1. **Financial Trend** — small inline trend chart or table showing revenue + EBITDA % across available quarters
2. **Segment Breakdown** — horizontal stacked bar or pill badges showing segment shares + trend indicators
3. **Narrative Drift** — color-coded drift cards (red=retreat, amber=pivot, grey=silence) with initial vs current positions
4. **Engagement Scope** — phase timeline visualization with duration bars
5. **Risks with Mitigants** — risk cards showing severity + mitigant side by side (not just bullet list)

**Style**: Follow existing design system — Intelligence Blue accent, dark/light theme compatible, `var(--card-bg)`, `var(--card-border)`, `var(--radius)`, Inter + IBM Plex Mono fonts.

---

## Phase 4: Verification

Report to the user:

1. **Pitch file path**: `{Company}/{CompanyName}_AM_Pitch.md`
2. **Document stats**: {N} sections generated, {N} source documents referenced
3. **EBITDA position**: Current % vs {N} named peers (with sources)
4. **Engagement type**: {type}
5. **Investigation areas**: {N} areas — {STRONG count} STRONG, {MODERATE count} MODERATE, {DIRECTIONAL count} DIRECTIONAL
6. **Narrative drift**: {N} drift items detected (or "No drift data available")
7. **Financial trend**: {N} quarters of data, trajectory = {improving/deteriorating/volatile/flat}
8. **Entry strategy**: {Lead contact name} via {approach type}
9. **Risks**: {N} risks identified with mitigants
10. **Engagement scope**: Phase 1 = {duration}, estimated team = {size}
11. **Dashboard updated**: pitch field added/updated in COMPANY_META
12. **Verify in browser**: Click company in any section -> Engagement Brief drawer should render all sections

---

## Important Rules

- **No fabrication** — all data must come from existing intelligence reports, FINANCIAL_DATA, and dashboard data
- **No bps estimates** — use evidence strength grading (STRONG/MODERATE/DIRECTIONAL) instead of fabricated impact numbers
- **Named peers only** — never use anonymous "sector median" or "best-in-class"
- **Professional tone** — this is for a Managing Director making pursuit decisions, not a data dump
- **Actionable** — the entry strategy must be specific enough to act on immediately
- **Evidence-backed** — every investigation area must reference specific data from the intelligence report
- **Comprehensive but scannable** — use tables, bullet points, and bold formatting for quick scanning. An MD should be able to get the key message in 60 seconds, but find depth on any point they want to dig into
- **Source everything** — every financial number, quote, and comparison must have a traceable source
- **Honest about gaps** — if data doesn't exist for a section, say so explicitly rather than omitting the section
- **Engagement scope must be realistic** — don't overcommit on timelines or underestimate team needs
