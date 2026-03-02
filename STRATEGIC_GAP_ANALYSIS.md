# Strategic Gap Analysis — rohith-m5 Dashboard Project
**Created**: February 28, 2026
**Last Updated**: March 2, 2026
**Status**: Phase 1 substantially complete; remaining gaps identified
**Scope**: Dashboard architecture, intelligence pipeline, backend data, coverage

---

## Executive Summary

The rohith-m5 dashboard is a **single-file static HTML intelligence platform** (index_v4.html, 869KB) designed as a consulting advisory PoC for A&M (Alvarez & Marsal) analyzing the Indian Consumer Durables sector.

**Current State**: The Phase 1 "knowledge repo → insight layer" transformation is **~85% complete**. The 8-step PLAN.md has been executed through Steps 1-6 and Step 8. The dashboard now functions as an **opportunity register** with signal-driven cards, SCI engagement theses, and product-market peer groups. Three gaps remain:

1. ~~**Architecture gap**~~ — **CLOSED**. Dashboard defaults to Executive Snapshot with signal-driven opportunity pipeline
2. **Pipeline execution gap** — Cross-company synthesis skill defined but never executed; no `Cross_Company_Synthesis.md` generated
3. **Backend gap** — UNCHANGED. Data pipeline remains disconnected; dashboard uses hardcoded arrays
4. **Coverage gap** — 8/16 companies have deep intelligence reports; all 16 have dashboard-level data (signalTaxonomy, SCI thesis, financials)

---

## Phase 1 Implementation Status (PLAN.md — 8 Steps)

| Step | Description | Status | Evidence |
|------|-------------|--------|----------|
| 1 | Fix intel skill file references | ✅ Done | Both intel.md files now reference `index_v4.html` |
| 2 | Change default view to Executive Snapshot | ✅ Done | `nav-item active` on executive section; `renderSignalPipeline()` runs on load |
| 3 | Add signal taxonomy to COMPANY_META | ✅ Done | 16/16 companies have full `signalTaxonomy` objects |
| 4 | Restructure Executive Snapshot as Opportunity Register | ✅ Done | `renderSignalPipeline(filter)` renders SCI cards with badges, urgency, confidence |
| 5 | Add engagement thesis to intel skill | ✅ Done | Phase 3.5 exists in both intel.md files |
| 6 | Add cross-company synthesis to intel skill | ⚠️ Defined, not executed | Phase 6.5 exists in both intel.md files; `Cross_Company_Synthesis.md` never generated |
| 7 | Update Advisory Pipeline with taxonomy | ✅ Done (as table) | `renderOppPipeline()` shows signal badges + urgency on 12 accounts, 41 sub-opportunities. Delivered as filterable table, not visual kanban |
| 8 | Product-market peer groups | ✅ Done | `renderPeerGroups()` with 7 peer groups (Room AC, Fans, Kitchen, Washing, Wires, EMS, Water Purification) |

---

## What's Been Built

### Dashboard Features (index_v4.html)
- **Executive Snapshot as default view** — users land on opportunity cards, not a data table
- **Signal-driven opportunity pipeline** — filterable by Performance / Transition / Friction / Ecosystem
- **SCI framework on every company** — 16/16 have Situation / Complication / Implication thesis
- **Signal taxonomy** — all 16 companies classified with primary signal, sub-signals, matched A&M service lines, urgency level
- **Confidence indicators** — evidence chain with Verified / Calculated / Inferred tiers
- **Advisory Pipeline** — 12 accounts across 3 stages (Identified / Qualified / Outreach) with signal badges
- **Product-market peer groups** — 7 groups allowing cross-category comparison (e.g., Voltas AC vs Blue Star AC)
- **SIGNAL_DATA evidence vault** — structured quote storage with `conf` and `ev` fields (6+ companies populated)
- **OPPORTUNITY_DATA** — 12 accounts, 41 sub-opportunities with source tier attribution

### Intelligence Pipeline (/intel skill)
- **Phases 1-6 operational** — Document ingestion → Intelligence extraction → Report → Engagement thesis → Pain points → Dashboard population → Verification
- **Phase 3.5 (Engagement Thesis)** — Generates SCI framework + signal classification per company
- **Phase 6.5 (Cross-Company Synthesis)** — Fully defined in both intel.md files but never executed

### Intelligence Reports (8/16 companies)
Full reports with pain point analysis:
1. Havells — Gold standard (full transcripts, financial analysis, strategic moves)
2. Bajaj Electricals — Complete with turnaround signals
3. Amber Enterprises — Complete with transition/M&A signals
4. Crompton Greaves — Complete with GTM strategy signals
5. Butterfly Gandhimathi — Full margin analysis and cost strategy
6. Symphony — Strategic pivot signals identified
7. TTK Prestige — Comprehensive 25-point pain-point ranking
8. IFB Industries — Complete with performance signals

**Dashboard-only coverage** (signalTaxonomy + SCI thesis + financials, but no deep report):
Blue Star, Voltas, Whirlpool, Dixon, Orient, V-Guard, Eureka Forbes, LG Electronics India

---

## Remaining Gaps

### Gap 1: Cross-Company Synthesis
**Status**: ✅ **CLOSED** (March 2, 2026)

`Cross_Company_Synthesis.md` generated from 14 intelligence reports (8 primary + 6 archived). Covers:
- 7 product-market peer comparisons (AC, Fans, Kitchen, Washing, Wires, EMS, Water Purification)
- 5 cross-company signal patterns (Capacity, Margins, Channels, Commodity, Operating Leverage)
- Sector-level engagement map by A&M service line and urgency tier
- Competitive share flow map
- Missing intelligence inventory

---

### Gap 2: SIGNAL_DATA Sparsity
**Status**: ⚠️ Partially populated
**Priority**: Medium

SIGNAL_DATA (the structured evidence vault with verbatim quotes, confidence levels, and source references) is only richly populated for ~6 companies. The remaining companies have empty or fallback-initialized signal arrays. This means the "View Evidence" button on opportunity cards shows nothing for ~10 companies.

**Action**: Run `/intel` for remaining companies, or backfill SIGNAL_DATA from existing intelligence reports for the 8 companies that have reports.

---

### Gap 3: Pain Point CSV Coverage
**Status**: ⚠️ 2/8 companies
**Priority**: Low

Only Havells and TTK Prestige have `*_Pain_Points_Ranked.csv` files. The other 6 companies with intelligence reports are missing this deliverable.

**Action**: Re-run Phase 4 of `/intel` for Bajaj, Amber, Crompton, Butterfly, Symphony, IFB.

---

### Gap 4: Intelligence Report Coverage
**Status**: ⚠️ 8/16 companies
**Priority**: Medium

8 companies lack deep intelligence reports. Their dashboard data (signalTaxonomy, SCI thesis, financials) was populated from lighter analysis, not full document ingestion.

**Missing reports**: Blue Star, Voltas, Whirlpool, Dixon, Orient, V-Guard, Eureka Forbes, LG Electronics India

**Dependency**: Requires source documents (transcripts, annual reports) for each company. Some (LG) may have limited publicly available data.

---

### Gap 5: Backend Data Pipeline
**Status**: ❌ Not started — unchanged from Feb 28
**Priority**: Low (for PoC phase) / High (for production)

The backend infrastructure is fully archived in `/archive/` and completely disconnected:
- Express server + SQLite DB + Sovrenn parser exist but unused
- Dashboard uses hardcoded `FINANCIAL_DATA` and `COMPANY_META` arrays
- No API integration, no real-time data refresh capability

This gap is **acceptable for the PoC** (static data is sufficient for A&M demo) but blocks any path to a live intelligence product.

---

### Gap 6: Advanced Features (Phase 2+)
**Status**: Not started
**Priority**: Future

| Feature | Status | Notes |
|---------|--------|-------|
| Narrative drift detection | ❌ | Requires 6+ quarter transcript history per company |
| Absence detection | ❌ | Cross-company disclosure benchmarking |
| Buyer-configurable matching | ❌ | Flexible service-line taxonomy mapping |
| Multi-tier views (Partner/Director/Analyst) | ❌ | Separate dashboard modes |
| Sector-agnostic framework | ❌ | Abstract beyond Consumer Durables |
| Unlisted competitor tracking | ❌ | Godrej, Haier, Samsung require alternative data sources |

---

## Requirements vs Delivery

### 10 Intelligence Layers (from requirements-consumer-durables-v2.md)

| # | Intelligence Layer | Dashboard Status |
|---|-------------------|-----------------|
| 1 | Profitability & Commodity Movement | ✅ Financial Performance table with margins, EBITDA%, ROCE |
| 2 | Transcript Insights | ✅ Transcript Intel section + SIGNAL_DATA evidence vault |
| 3 | Market Signals | ⚠️ Competitive Moves section exists; no automated news feed |
| 4 | Sales Intelligence | ⚠️ Covered in intelligence reports; not surfaced as dedicated section |
| 5 | Operational Metrics | ✅ Operational Intelligence table with confidence icons |
| 6 | Pricing Strategy | ⚠️ Covered in SCI theses; no dedicated tracking view |
| 7 | Cost Structure Breakdown | ❌ Not implemented as dashboard feature |
| 8 | Gross Margin Dynamics | ⚠️ Margin data in financials; no volume/margin tradeoff view |
| 9 | Localization Index | ❌ Not implemented |
| 10 | Market Share Trajectory | ⚠️ Talk vs Walk section partially covers this |

**Score: 3 fully delivered, 5 partially covered, 2 missing**

### Dashboard Delivers (current)
- ✅ 16-company sortable financial table with sparklines and derived columns
- ✅ Signal-driven opportunity pipeline (Executive Snapshot)
- ✅ SCI engagement thesis for all 16 companies
- ✅ Transcript Intel with evidence vault
- ✅ Deals & Transactions (M&A, QIP, PE/VC)
- ✅ Operational Intelligence with confidence indicators
- ✅ Leadership & Governance alerts with source links
- ✅ Competitive Moves with type filtering
- ✅ Product-market peer groups (7 groups)
- ✅ Advisory Pipeline (12 accounts, 41 sub-opportunities)
- ✅ Action Lens (4 stakeholder personas)
- ✅ Watchlist with forward signals
- ✅ Talk vs Walk verification

### Dashboard Still Missing
- ❌ Structured commodity-profitability correlation view
- ❌ Dynamic cross-company synthesis (static insights only)
- ❌ Localization index benchmarking
- ❌ Cost structure breakdown visualization
- ❌ Multi-quarter trend analysis (only latest quarter + annual)
- ❌ Narrative drift detection
- ❌ Automated news/signal ingestion

---

## Key Documents & Locations

| Document | Location | Status |
|----------|----------|--------|
| **index_v4.html** | `rohith-m5/index_v4.html` | Active dashboard (869KB) |
| **index_v3.html** | `rohith-m5/index_v3.html` | Previous version (682KB) — superseded |
| **PLAN.md** | `rohith-m5/PLAN.md` | Phase 1 implementation roadmap — mostly complete |
| **CLAUDE.md** | `rohith-m5/CLAUDE.md` | Architecture reference — **OUTDATED**, references index.html |
| **intel.md** (root) | `.claude/commands/intel.md` | Intel skill — references index_v4.html |
| **intel.md** (project) | `rohith-m5/.claude/commands/intel.md` | Intel skill — references index_v4.html |
| **Intelligence Reports** | `rohith-m5/[Company]/` | 8 companies have full reports |
| **requirements-v2.md** | `rohith-m5/../` | Strategic requirements & 10 KPIs |

---

## Recommended Next Actions (Priority Order)

1. **Run Cross-Company Synthesis** (Gap 1) — Execute Phase 6.5 of `/intel` to generate `Cross_Company_Synthesis.md`. High impact, low effort.

2. **Backfill SIGNAL_DATA** (Gap 2) — Populate evidence vault for the 8 companies that have intelligence reports but sparse SIGNAL_DATA.

3. **Generate remaining intelligence reports** (Gap 4) — Run `/intel` for Blue Star, Voltas, Whirlpool, Dixon, Orient, V-Guard (source documents permitting).

4. **Update CLAUDE.md** — Currently references `index.html` (v1). Should reference `index_v4.html`.

5. **Backend integration** (Gap 5) — Only if moving beyond PoC to production.

---

## Summary

The dashboard has successfully transformed from a **knowledge repository** to an **insight-first engagement discovery tool**. The A&M feedback that triggered the 8-step plan has been substantially addressed:

- Users now land on signal-driven opportunity cards (not a data table)
- Every company has a structured SCI engagement thesis
- Signal taxonomy maps companies to A&M service lines
- Product-market peer groups enable cross-category comparison

**Remaining work is incremental**: executing the cross-company synthesis, filling data gaps, and expanding company coverage. The core architectural transformation is complete.
