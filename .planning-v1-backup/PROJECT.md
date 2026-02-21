# Kompete - Industry Intel

## What This Is

An AI-driven interactive industry intelligence report for the Indian Consumer & Retail mid-market, starting with the Consumer Durables category. Built as a multi-tenant SaaS product where each consulting firm (BCG, Alvarez & Marsal, etc.) gets their own branded instance. Partners and MDs use it as a business development radar — spotting engagement opportunities, tracking which companies are under stress or expanding, and walking into prospect meetings already informed.

## Core Value

Every section answers "where's the BD opportunity?" — not just industry data, but specific signals that help consulting partners identify which companies need help, what kind of help, and when to reach out.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Executive Snapshot — month in 5 bullets, big themes, red flags/watchlist with AI confidence scores
- [ ] Market Pulse — demand signals, input cost trends, margin outlook, channel mix shifts for Consumer Durables mid-market
- [ ] Financial Performance Tracker — standardized metrics (revenue growth, EBITDA margin, working capital days, ROCE, etc.) for 15-20 Consumer Durables companies with AI variance analysis and outperform/inline/underperform tagging
- [ ] Deals, Transactions & Capital Movements — M&A, PE/VC investments, IPO filings, distressed asset activity with AI pattern recognition
- [ ] Operational Intelligence — supply chain signals, manufacturing capacity, procurement shifts, retail expansion/rationalization
- [ ] Leadership & Governance Watch — CXO changes, board reshuffles, promoter stake changes, auditor resignations with AI risk flags
- [ ] Competitive Moves & Strategic Bets — product launches, pricing wars, D2C initiatives, quick commerce partnerships with cluster analysis
- [ ] Sub-Sector Deep Dive — rotating monthly deep dive with cost structure benchmarks, margin levers, top-quartile analysis
- [ ] "What This Means For..." Action Lens — tailored interpretations for PE/investors, founders, COOs/CFOs, procurement heads
- [ ] Watchlist & Forward Indicators — 90-day forward-looking signals: likely fundraises, margin inflection candidates, consolidation targets, stress indicators
- [ ] Multi-tenant white-label branding — each consulting firm gets branded instance with their logo, colors, fonts
- [ ] Company universe — Consumer Durables: Whirlpool, Haier, Samsung, LG, Godrej, Blue Star, Kelvinator, Electrolux, Amber, Croma, PG, IFB, Voltas, Crompton Greaves, Bajaj Electricals, V-Guard Industries

### Out of Scope

- Backend data collection pipelines — separate workstream
- FMCG, QSR, Apparel, Beauty categories — future expansion after Consumer Durables proves out
- Mobile app — desktop-first for consulting partners
- Real-time alerting — monthly cadence for v1
- User auth / billing / subscription management — developer handles this

## Context

Kompete is building AI-powered intelligence products for professional services firms. Kompete (the first product) targets B2B SaaS companies with competitive intelligence. This is the second product — targeting consulting firms with industry landscape intelligence.

The Consumer Durables category includes ~15-20 Indian entities in the ₹1,000-10,000 Cr revenue range. Data sources include public filings (BSE/NSE), earnings transcripts, news feeds, industry reports, and management commentary.

The buyer persona is an MD or Partner at a consulting firm who needs to:
1. Spot companies that need consulting help (margin pressure, leadership changes, expansion stress)
2. Prepare for BD meetings with current, relevant intelligence
3. Track deal flow and capital movements for M&A advisory opportunities
4. Understand competitive dynamics to advise clients

Architecture can reuse patterns from Kompete (React 19 + Vite + TypeScript + Tailwind v4 + Recharts) but the data contract and module structure will differ significantly.

## Constraints

- **Tech stack**: React 19 + Vite + TypeScript 5 + Tailwind CSS v4 (consistent with Kompete for shared learnings)
- **Category scope**: Consumer Durables only for v1 (not all 6 sub-sectors from the brief)
- **Data format**: JSON data contracts compatible with Express/Supabase backend
- **Cadence**: Monthly report generation (not real-time)
- **Multi-tenant**: Each consulting firm gets branded instance via BrandProvider pattern

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Interactive web report over static PDF | Consulting partners expect interactivity; drill-down into company data is core UX | -- Pending |
| Consumer Durables first, other categories later | Prove the model with one focused category before expanding | -- Pending |
| Multi-tenant from day one | Each consulting firm is a separate customer needing branded experience | -- Pending |
| Reuse Kompete frontend architecture | Proven stack, shared component patterns, faster development | -- Pending |

---
*Last updated: 2026-02-15 after project initialization*
