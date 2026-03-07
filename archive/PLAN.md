# Phase 1: Advisory Intelligence Platform — Implementation Plan

## Context

The dashboard was demoed and feedback was: "looks like a knowledge repository, not an insight generation tool for leadership-level BD." After extensive analysis, we identified the root causes:

1. **Default view is Financial Performance** (a data table) — buries the synthesis sections
2. **Intel extraction is single-company** — no cross-company comparison or synthesis
3. **No signal taxonomy** — signals aren't classified by engagement type (turnaround, transaction, growth, etc.)
4. **No matching layer** — signals aren't mapped to specific A&M service lines
5. **Intel skill references index_v2.html** but index_v3.html is the latest version
6. **Peer comparisons are by subSector** (Cooling, Electrical) not by product-market overlap (e.g., Voltas AC vs Blue Star AC)

## Source of Truth

**`index_v3.html`** is the latest dashboard (682KB, Feb 26 17:49). All changes target this file.

The intel skill exists in two places:
- `/Users/prateekkurkanji/Kompete/.claude/commands/intel.md` (root)
- `/Users/prateekkurkanji/Kompete/rohith-m5/.claude/commands/intel.md` (project)

Both will be updated. The project-level one already has SIGNAL_DATA evidence vault fields (Phase 5.0 section with `conf` and `ev` fields).

---

## Step 1: Fix Intel Skill File Reference

**Files**: Both `intel.md` files
**Change**: Replace all `index_v2.html` references with `index_v3.html`

---

## Step 2: Change Default Dashboard View

**File**: `index_v3.html` (line 1619)
**Change**: Move `active` class from `financial` nav-item to `executive` nav-item

**Current**:
```html
<a class="nav-item" data-section="executive" data-icon="ES">Executive Snapshot</a>
<a class="nav-item active" data-section="financial" data-icon="FP">Financial Performance</a>
```

**New**:
```html
<a class="nav-item active" data-section="executive" data-icon="ES">Executive Snapshot</a>
<a class="nav-item" data-section="financial" data-icon="FP">Financial Performance</a>
```

Also update the JS initialization to show the `executive` section panel by default instead of `financial`.

---

## Step 3: Add Signal Taxonomy to COMPANY_META

**File**: `index_v3.html`
**Change**: Expand the `amSignal` field in each COMPANY_META entry from a single string to a structured object.

**Current**: `amSignal:"turnaround"` (single label)

**New structure**:
```js
amSignal: {
  primary: "turnaround",     // Primary engagement type
  signals: ["margin-compress", "leadership-change", "channel-erosion"],
  serviceLines: ["PEPI", "CDD"],  // A&M service lines matched
  urgency: "high"            // high / medium / watch
}
```

**Signal types** (the 4-category taxonomy from our discussion):
- `performance` — Margin deterioration, cost escalation, revenue decline
- `transition` — Leadership change, M&A, restructuring, IPO
- `friction` — Narrative drift, undisclosed metrics, analyst skepticism
- `ecosystem` — Regulatory change, channel disruption, commodity shock

**A&M service lines** to match against:
- `turnaround` — Restructuring & turnaround
- `PEPI` — Private Equity Performance Improvement
- `CDD` — Commercial Due Diligence
- `transaction` — Transaction Advisory
- `interim-mgmt` — Interim Management
- `disputes` — Disputes & Investigations

Apply to all 17 companies based on existing intelligence reports and COMPANY_META.variance data.

---

## Step 4: Restructure Executive Snapshot as Opportunity Register

**File**: `index_v3.html`
**Change**: Redesign the Executive Snapshot section to lead with engagement opportunities, not company summaries.

**New layout**:

### 4a. Opportunity Pipeline Header
Show aggregate stats:
- `X companies with active signals` / `Y engagement-ready` / `Z on watch`
- Grouped by signal type (Performance: N, Transition: N, Friction: N, Ecosystem: N)

### 4b. Opportunity Cards (replace or augment existing content)
Each card shows:
- **Company name + signal type badge**
- **Situation**: 1-2 lines — what's happening (from variance data)
- **Complication**: 1-2 lines — why it matters now
- **Implication**: 1-2 lines — what A&M can do (mapped service line)
- **Evidence strength**: confidence indicator (verified/derived/estimated)
- **Urgency**: high/medium/watch

Sort by urgency (high first), then by evidence strength.

### 4c. Keep existing Talk vs Walk cards
These are already good synthesis — they stay. Move them below the opportunity cards.

---

## Step 5: Add Engagement Thesis Generation to Intel Skill

**Files**: Both `intel.md` files
**Change**: Add a new Phase 3.5 between the Intelligence Report and Pain Points CSV.

### New Phase 3.5: Engagement Thesis

After writing the intelligence report, generate a structured engagement thesis:

```markdown
## Engagement Thesis: {CompanyName}

### Situation
{What is happening — factual, from the data. 2-3 sentences.}

### Complication
{Why this matters now — what makes the timing critical. 2-3 sentences.}

### Implication for Advisory
{What specific A&M service lines apply and why. 2-3 sentences.}

### Recommended Approach
{Specific entry point — who to talk to, what to lead with. 2-3 sentences.}

### Key Evidence
{3-5 strongest data points with direct quotes}

### Signal Classification
- Primary: {performance|transition|friction|ecosystem}
- Sub-signals: {comma-separated list}
- Matched Service Lines: {A&M service lines}
- Urgency: {high|medium|watch}
- Confidence: {High|Medium|Low}
```

This thesis gets embedded in the dashboard's Executive Snapshot opportunity card for the company.

---

## Step 6: Add Cross-Company Synthesis to Intel Skill

**Files**: Both `intel.md` files
**Change**: Add a new Phase 6.5 (or separate skill) that runs AFTER individual company reports exist.

### New Phase: Cross-Company Synthesis

This phase reads ALL existing intelligence reports in the `rohith-m5/` subfolders and produces:

1. **Peer Comparison by Product-Market** (not by subSector):
   - AC segment: Voltas vs Blue Star vs Havells (Lloyd) vs LG vs Crompton (coolers)
   - Kitchen: Butterfly vs TTK Prestige vs Crompton (SDA)
   - Washing/Appliances: IFB vs Whirlpool vs LG
   - EMS/OEM: Amber vs Dixon
   - Electrical: Havells vs Crompton vs Orient vs V-Guard

2. **Cross-Company Signal Patterns**:
   - Which companies are expanding capacity while others are underutilized?
   - Where is margin compressing across the sector vs company-specific?
   - Channel disruption signals (modern trade, e-commerce, quick commerce)
   - Common commodity exposure patterns

3. **Sector-Level Engagement Map**:
   - Total addressable opportunity by service line
   - Cluster companies by urgency and engagement type

This generates a `Cross_Company_Synthesis.md` file in the `rohith-m5/` root.

---

## Step 7: Update Advisory Pipeline Section (renamed from A&M Value-Add)

**File**: `index_v3.html`
**Change**: The kanban in the A&M Value-Add section (already renamed "Advisory Pipeline" in sidebar nav) should be driven by the signal taxonomy data.

- Kanban columns map to urgency: `Active Signals` → `Qualified` → `Engagement-Ready`
- Each card pulls from `COMPANY_META[id].amSignal` for service line tags
- Add signal type badges to kanban cards

---

## Step 8: Update Product-Market Peer Groups in Deep Dive

**File**: `index_v3.html`
**Change**: In the Sub-Sector Deep Dive section, add a "Product-Market View" toggle alongside the existing subSector view.

When toggled, group companies by overlapping product categories:
- **Room AC**: Voltas, Blue Star, Havells (Lloyd), LG, Crompton (marginal)
- **Fans**: Crompton, Havells, Orient, Bajaj
- **Kitchen Appliances**: TTK Prestige, Butterfly, Crompton (SDA)
- **Washing/Laundry**: IFB, Whirlpool, LG
- **Wires & Cables**: Havells, V-Guard, Crompton
- **EMS/OEM**: Amber, Dixon
- **Water Purification**: Eureka Forbes

A company can appear in multiple groups (e.g., Havells in AC, Fans, Wires, Switchgears).

---

## Execution Order

1. **Step 1** — Fix file reference (trivial, 2 edits)
2. **Step 2** — Change default view (trivial, 2-3 edits)
3. **Step 3** — Signal taxonomy in COMPANY_META (moderate, 17 company entries)
4. **Step 4** — Opportunity Register in Executive Snapshot (significant, new HTML/CSS/JS)
5. **Step 5** — Engagement thesis in intel skill (moderate, new section in both files)
6. **Step 6** — Cross-company synthesis in intel skill (moderate, new phase in both files)
7. **Step 7** — Advisory Pipeline kanban update (moderate, HTML/JS changes)
8. **Step 8** — Product-market peer groups (moderate, new JS logic + HTML)

Steps 1-2 are quick fixes. Steps 3-4 are the core value — they transform the dashboard from data repository to opportunity register. Steps 5-6 upgrade the extraction pipeline. Steps 7-8 strengthen the downstream presentation.

---

## What This Does NOT Cover (Future Phases)

- Narrative drift detection (requires multi-quarter transcript history per company)
- Absence detection (what companies don't disclose that peers do)
- Buyer-configurable matching (different advisory firm service line mappings)
- Unlisted competitor tracking (Daikin, Samsung, Godrej, Haier — needs separate data sourcing)
- 3-tier output (Partner/Director/Analyst views — separate dashboard modes)
- Sector-agnostic framework (making this work beyond Consumer Durables)
