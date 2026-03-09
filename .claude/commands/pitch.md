Generate an A&M Engagement Brief (target pitch) for a company.

**Argument**: `{{arg1}}` — Company name (e.g., "Havells", "Bajaj") or "top5" to generate for the 5 highest-urgency targets.

---

## Overview

This skill generates a concise, 1-2 page executive pitch document for a target company. It reads existing intelligence data and produces both a shareable markdown file and dashboard-ready pitch data. The output is designed to be scannable by an A&M Managing Director in under 2 minutes.

---

## Prerequisites

Before running this skill, the company must have:
1. An existing intelligence report (`{Company}/{CompanyName}_Intelligence_Report.md`)
2. A populated `signalTaxonomy` with `leverMapping` in `COMPANY_META` (in `index_v5.html`)

If these don't exist, run `/intel {folder_path}` first.

---

## Phase 1: Data Gathering

1. **Read the intelligence report** from the company's folder in `rohith-m5/`
2. **Read the pain points CSV** from the same folder
3. **Read `COMPANY_META`** from `index_v5.html` — extract: `signalTaxonomy` (leverMapping, totalImpactBps, engagementType, keyMetricGaps, thesis)
4. **Read `FINANCIAL_DATA`** from `index_v5.html` — extract latest quarterly data for the company
5. **Read `BENCHMARK_DATA` computation** — get sector medians for context
6. If `{{arg1}}` is "top5", identify the 5 companies with highest `urgency` (high first) and largest `totalImpactBps`, then generate pitches for each sequentially.

---

## Phase 2: Generate Pitch Markdown

Write to `rohith-m5/{CompanyFolder}/{CompanyName}_AM_Pitch.md`:

```markdown
# {Company Name} — A&M Engagement Brief
## Consumer Durables | {Sub-Sector} | {Date}

---

### EBITDA Improvement Waterfall

| Lever | Impact |
|-------|--------|
| Starting Point | Current EBITDA {X.X}% |
| {Lever 1} | +{XX} bps |
| {Lever 2} | +{XX} bps |
| {Lever 3} | +{XX} bps |
| ... | ... |
| **Target EBITDA** | **{X.X}% (+{XXX} bps)** |
| **Annual Run-Rate** | **Rs {XX} Cr** |

### Why Now

{2-3 sentences from the Complication section of the engagement thesis. Must explain why the timing creates urgency for advisory engagement. Include specific numbers and catalysts.}

### Top A&M Levers

1. **{Lever Name}** — {Specific finding from the intelligence report with numbers}. Estimated impact: +{XX} bps ({Rs XX Cr}).
2. **{Lever Name}** — {Specific finding}. Estimated impact: +{XX} bps ({Rs XX Cr}).
3. **{Lever Name}** — {Specific finding}. Estimated impact: +{XX} bps ({Rs XX Cr}).
{Up to 5 levers, ranked by impact}

### Entry Strategy

- **Lead Contact**: {CEO / CFO / Board / PE Sponsor — based on engagement type}
- **Opening Message**: "{One sentence pitched to their specific pain — what would make this person take a meeting}"
- **Reference Point**: {Comparable sector engagement or A&M capability that builds credibility}

### Key Evidence

> "{Direct quote from management}" — {Speaker}, {Document}, {Date}

> "{Direct quote}" — {Speaker}, {Document}, {Date}

> "{Direct quote}" — {Speaker}, {Document}, {Date}

### Benchmark Position

| Metric | {Company} | Sector Median | Best-in-Class | Gap |
|--------|-----------|---------------|---------------|-----|
| EBITDA % | {X.X}% | {X.X}% | {X.X}% | {XX} bps |
| ROCE | {X.X}% | {X.X}% | {X.X}% | {XX} bps |
| WC Days | {XX} | {XX} | {XX} | {XX} days |
{Include only metrics where the company is below median}

### Risk Factors

1. {Key risk that could derail the engagement or reduce impact}
2. {Second risk factor}

---

*Source: {N} documents analyzed | Confidence: {High/Medium/Low} | Generated: {Date}*
*Engagement Type: {Rapid Results / PEPI / Turnaround / CDD / Transaction}*
```

### Rules
- Every claim must trace to the intelligence report — no external knowledge
- Quotes must be verbatim from the intelligence report
- EBITDA impact estimates must match the leverMapping in signalTaxonomy
- The "Opening Message" should be specific enough that the MD could use it in an actual outreach
- Keep it under 2 pages when rendered — prioritize density over completeness

---

## Phase 3: Dashboard Integration

After generating the markdown, update `COMPANY_META` in `index_v5.html` to add a `pitch` field for the company:

```js
pitch: {
  waterfall: [
    {lever:"{Lever Name}", impactBps:{XX}},
    // ... one per lever, ordered by impact
  ],
  targetEbitda: {X.X},
  runRateCrores: {XX},
  whyNow: "{2-3 sentences from Complication}",
  topLevers: [
    {name:"{Lever}", finding:"{Specific finding with numbers}", impact:"+{XX} bps (Rs {XX} Cr)"},
    // ... up to 5
  ],
  entry: {
    contact: "{CEO|CFO|Board|PE Sponsor}",
    message: "{One-sentence opening pitch}",
    reference: "{Comparable engagement or capability}"
  },
  evidence: [
    {quote:"{Verbatim quote max 150 chars}", speaker:"{Name}", source:"{Document}", date:"{Date}"},
    // ... 2-3 quotes
  ],
  risks: ["{Risk 1}", "{Risk 2}"],
  generatedDate: "{YYYY-MM-DD}"
}
```

---

## Phase 4: Verification

Report to the user:
1. **Pitch file path**: `{Company}/{CompanyName}_AM_Pitch.md`
2. **EBITDA waterfall**: Starting % -> Target % (+XXX bps = Rs XX Cr/yr)
3. **Engagement type**: {type}
4. **Top 3 levers**: Quick summary
5. **Dashboard updated**: pitch field added to COMPANY_META
6. **Verify in browser**: Click company in any section -> Engagement Brief tab should render

---

## Important Rules

- **No fabrication** — all data must come from existing intelligence reports and dashboard data
- **Conservative estimates** — use 50% gap closure as the improvement target
- **Professional tone** — this is for a Managing Director, not a data dump
- **Actionable** — the entry strategy must be specific enough to act on immediately
- **Evidence-backed** — every lever must reference specific data from the intelligence report
