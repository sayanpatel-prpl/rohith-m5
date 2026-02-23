# Feature Research: Industry Intelligence for Consulting BD

**Domain:** AI-driven industry intelligence / consulting BD radar (Consumer Durables mid-market India)
**Researched:** 2026-02-15
**Confidence:** MEDIUM (based on extensive training data knowledge of CB Insights, PitchBook, AlphaSense, Tegus, Gartner, McKinsey industry dashboards, Bain industry briefs; web verification tools unavailable -- feature patterns in this space are mature and stable but current 2026 product updates could not be verified)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features that MDs/Partners at consulting firms will expect from any paid industry intelligence product. Missing these and they revert to their analyst manually compiling decks from MCA filings and Capitaline.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Company profiles with standardized financials** | Every competitor (PitchBook, Capitaline, CMIE Prowess) has this. A consulting Partner expects to click a company and see revenue, EBITDA, margins, working capital in a consistent format. Without this, the product is a newsletter, not a platform. | HIGH | Need clean data ingestion from BSE/NSE filings, MCA data. 15-20 companies for v1 but data normalization across Indian GAAP vs Ind AS is non-trivial. |
| **Executive summary / snapshot** | CB Insights, AlphaSense, Bain briefs all lead with "here is what matters this month." Busy Partners will not dig through raw data. They need the 5-bullet summary first. | MEDIUM | AI-generated. Quality depends on signal-vs-noise filtering. The brief already specifies this as Module 1. |
| **Time-series financial comparison** | Partners expect to compare Company A vs Company B across quarters on any metric (revenue growth, EBITDA margin, ROCE). PitchBook, Capitaline, Bloomberg all offer this. | MEDIUM | Charting with Recharts. Requires clean quarterly data going back 8-12 quarters minimum for trend visibility. |
| **Search and filtering** | Users expect to search by company name, filter by metric thresholds (e.g., "show me companies with EBITDA margin below 8%"), filter by sub-segment within Consumer Durables. | MEDIUM | Needs indexed company universe and parameterized filters. Start simple: company search + metric range filters + sub-segment filters. |
| **Data recency indicator** | Users need to know "as of which quarter" or "as of which date" the data reflects. CB Insights shows "last updated." PitchBook shows filing dates. Without this, credibility collapses. | LOW | Metadata on every data point. Simple but essential. Display "Q3 FY25 results" or "Data as of Jan 2026" prominently. |
| **Export / download** | Partners take intelligence into their own decks (PowerPoint, PDF). Every serious platform (PitchBook, AlphaSense, CB Insights) offers export. A Partner who cannot copy a chart into a client deck will stop using the product. | MEDIUM | PDF export of views, PNG export of charts, CSV export of data tables. PowerPoint export is a differentiator (see below), but basic PDF/CSV is table stakes. |
| **Deal / transaction tracker** | Tracking M&A, PE investments, IPO filings in the sector. PitchBook's entire business model is built on this. For a BD radar, knowing "who just raised money" or "who just got acquired" is essential signal. | HIGH | Requires deal data sourcing (VCCEdge, Venture Intelligence, news parsing). Structured fields: deal type, size, valuation multiple, buyer/investor, date. |
| **Competitive benchmarking view** | Side-by-side comparison of 3-5 companies on key metrics. Every industry report from McKinsey/Bain includes benchmark tables. Partners use these in client pitches. | MEDIUM | Pre-built benchmark views (margin comparison, growth comparison, working capital comparison). Powered by the same financial data as company profiles. |
| **Source attribution / citations** | Partners cannot walk into a client meeting citing data without knowing the source. AlphaSense, Tegus, and every credible intelligence platform shows source documents. | LOW | Link every data point to its source (filing, transcript, news article). Even a simple "Source: Q3 FY25 Annual Report" line item suffices for v1. |
| **Multi-tenant branding** | The brief specifies this. Each consulting firm expects "their" instance with their logo and colors. This is how enterprise SaaS is sold to consulting firms -- white-label is table stakes for B2B intelligence products serving consulting. | MEDIUM | BrandProvider pattern. Logo, primary/secondary colors, fonts. Already planned in PROJECT.md. |
| **Monthly cadence content** | The product is a monthly intelligence report, not a real-time feed. Partners expect a clear "February 2026 edition" with what changed since January. This cadence framing is how McKinsey Quarterly, Bain briefs, and consulting-grade intelligence products work. | LOW | Edition-based navigation. "Current month" prominent, archive of past months accessible. |
| **Responsive dashboard layout** | Partners access this on laptops during meetings, occasionally on tablets. The dashboard must be clean, professional-grade, not cluttered. Think Bloomberg Terminal aesthetic meets McKinsey deck clarity. | MEDIUM | React component architecture with responsive grid. Desktop-first per PROJECT.md constraints but tablet-friendly. |

### Differentiators (Competitive Advantage)

Features that existing platforms either do not offer or do poorly. These are where Kompete wins the consulting BD use case.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **BD Signal Scoring ("Who Needs Help?")** | This is THE core differentiator. No existing platform explicitly answers "which company needs consulting help right now?" CB Insights tracks startups. PitchBook tracks deals. Neither synthesizes financial stress + leadership change + operational disruption into a "this company likely needs a turnaround engagement" signal. This maps to the Watchlist & Forward Indicators module. | HIGH | Composite scoring model: financial deterioration signals (margin compression, working capital bloat, debt-to-EBITDA spike) + governance signals (CXO exits, auditor changes) + operational signals (capacity shutdowns, store closures). Needs calibration with real consulting engagement data over time. |
| **Action Lens / Persona-based interpretation** | "What This Means For PE investors" vs "What This Means For a COO" on the same data. Neither CB Insights nor PitchBook does this. They present raw intelligence and leave interpretation to the user. For a consulting Partner, pre-interpreted intelligence saves hours of analyst time. | MEDIUM | AI-generated interpretive commentary per persona. 4 personas initially: PE/Investors, Founders/Promoters, COOs/CFOs, Procurement Heads. The Partner selects the lens relevant to the prospect they are meeting. |
| **Meeting prep mode / company brief generator** | A Partner clicks "Prepare for meeting with Voltas CFO" and gets a 1-page brief: recent financials, stock price, recent news, leadership changes, competitive position, potential pain points, suggested talking points. No existing platform does this in one click for Indian mid-market companies. | HIGH | Pulls from all modules, synthesized by AI into a structured 1-pager. Requires all data modules to be operational. This is the "killer feature" for daily usage. |
| **AI-generated variance analysis** | Instead of just showing "EBITDA margin: 8.2%", the system says "EBITDA margin declined 180bps QoQ, driven by raw material cost inflation (+12% YoY) partially offset by price hikes. This is 230bps below segment average." PitchBook shows the number. AlphaSense might surface the transcript quote. Neither generates the analytical narrative. | HIGH | Requires financial modeling logic + AI narrative generation. This is the "analyst in a box" value prop. Each company-quarter combination needs variance decomposition. |
| **Engagement opportunity classification** | Tag each BD signal with engagement type: "Turnaround / Restructuring", "Growth Strategy", "Cost Optimization", "Digital Transformation", "M&A Advisory", "Organization Design". This directly maps to consulting service lines. No intelligence platform does this because they do not serve consulting firms specifically. | MEDIUM | Classification model mapping signal patterns to engagement types. Rule-based initially (margin compression + leadership change = turnaround), ML-enhanced later. |
| **Sub-sector deep dive with rotation** | Monthly rotating deep dive (Consumer Durables sub-segments: ACs, refrigerators, washing machines, small appliances, lighting, cables & wires). With cost structure benchmarks, margin levers, top-quartile analysis. McKinsey and Bain produce these as one-off reports costing lakhs. Having them monthly at SaaS pricing is differentiated. | HIGH | Requires deep sub-segment data and AI analysis. Content-intensive. Start with quarterly rotation in v1, move to monthly as data pipelines mature. |
| **90-day forward indicators** | Predictive signals: "likely fundraise coming" (based on management commentary + financial patterns), "margin inflection candidate" (cost tailwinds + operational improvements), "consolidation target" (sub-scale, promoter fatigue signals). Existing platforms are backward-looking. Forward-looking signals are genuinely differentiated. | HIGH | Requires time-series pattern recognition, management commentary NLP, financial projection models. High value but also highest risk of being wrong. Needs confidence scoring and careful framing as "indicators" not "predictions." |
| **PowerPoint export** | Partners live in PowerPoint. Being able to export a company profile, competitive benchmark, or sector overview as a deck-ready slide (not just a PDF) saves the 2-3 hours an analyst spends reformatting data into slides. AlphaSense has added this recently; PitchBook has basic export. For Indian mid-market, nobody does this well. | HIGH | Requires PPTX generation (e.g., PptxGenJS). Template-driven slide creation. High-value but significant engineering effort. Defer to v1.x. |
| **Management commentary sentiment tracking** | NLP analysis of earnings call transcripts and investor presentations. Track tone shifts: "management turned cautious on margins" or "first mention of cost restructuring." Tegus and AlphaSense do this for US large-cap. Nobody does this systematically for Indian mid-market companies. | HIGH | Requires transcript ingestion (typically from BSE filings or earnings call recordings), NLP sentiment analysis, temporal tracking. |
| **Competitive cluster mapping** | Visual map showing which companies are pursuing similar strategies (e.g., "D2C push cluster: Godrej, Crompton, Bajaj Electricals" vs "Distribution depth cluster: V-Guard, Havells"). Shows who is copying whom and identifies strategic white spaces. | MEDIUM | Clustering algorithm on strategy signals (product launches, channel investments, partnership announcements). Visualization as a 2D map or grouped matrix. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem valuable but would damage the product, distract from core value, or create unsustainable complexity.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Real-time alerting / push notifications** | "I want to know immediately when a CEO resigns." Sounds urgent and valuable. | Destroys the monthly cadence value proposition. Real-time alerts require always-on data pipelines, notification infrastructure, and create information overload. The buyer persona (MD/Partner) does NOT want 50 alerts/week -- they want a curated monthly brief. Real-time is a different product (and CB Insights already does it). Also explicitly out of scope per PROJECT.md. | Monthly cadence with a "Breaking signals since last edition" callout at the top. If a genuinely market-moving event occurs mid-month, handle via manual email to subscribers, not automated real-time alerting. |
| **Build-your-own-dashboard / widget customization** | "Let me drag and drop to create my own view." Every enterprise SaaS buyer asks for this. | Massive engineering complexity (drag-and-drop builders, layout persistence, widget APIs). Consulting Partners do not want to configure dashboards -- they want opinionated, pre-built views that surface what matters. The value is editorial curation, not self-service BI. Tableau/Power BI already exist for self-service analytics. | Pre-built, opinionated module views with sensible defaults. Let users choose which modules to pin/hide, but do not let them rebuild the layout. |
| **Full financial modeling / DCF / valuation tools** | "Can I build a DCF model in the platform?" PitchBook has some of this. | This is a different product category (financial modeling tools like Finbox, Valutico). Building even a basic DCF interface requires extensive financial engineering, and consulting firms already have their own models in Excel. | Provide standardized financial metrics and ratios. Export to CSV/Excel so analysts can plug into their own models. |
| **Social media monitoring** | "Track what people say about these brands on Twitter/Instagram." | Noisy signal for BD intelligence. Social sentiment is consumer-facing, not BD-facing. A Partner does not care what consumers tweet about Voltas -- they care about financial stress, leadership changes, and deal flow. Social monitoring adds data cost and processing overhead with minimal BD signal value. | Track management commentary and official communications (earnings calls, press releases, regulatory filings). These are the signals that matter for BD. |
| **Comprehensive news feed / aggregation** | "Show me all news about these 15 companies." | Becomes a noise machine. Google Alerts already does this for free. A raw news feed is not intelligence -- it is information overload. The value proposition is curated, analyzed intelligence, not "here are 200 articles." | AI-curated "signals that matter" -- only surface news items that represent a genuine change in company trajectory (management change, deal announcement, regulatory action, strategy pivot). 3-5 items per company per month, not 50. |
| **Covering 50+ companies from day one** | "Can we track all Consumer & Retail companies, not just 15?" Natural desire to expand universe. | Data quality collapses at scale without mature pipelines. Better to have excellent coverage of 15-20 companies than mediocre coverage of 60. Partners will forgive a small universe if the depth is exceptional. They will not forgive shallow coverage of a large universe. | Start with 15-20 companies (already defined). Add companies only when data quality for existing universe is consistently high. Expansion is a v2 decision. |
| **User-generated content / annotations / collaboration** | "Let Partners add their own notes on companies, share insights with colleagues." | Collaboration features are a product category unto themselves (Notion, Confluence). Building annotation, sharing, permissions, and collaboration UX is a massive scope expansion. The product is a READ experience for Partners, not a WRITE experience. | Simple "Add to my watchlist" and "Share this view via link" functionality. No in-product collaboration. Partners will discuss intelligence in their own tools (email, Slack, meetings). |
| **Mobile-native app** | "Partners check this on their phones." | Explicitly out of scope per PROJECT.md. The data density of financial benchmarks, competitive comparisons, and sector deep dives is not suited to mobile screens. Consulting Partners review intelligence at their desks or on laptops during travel. | Responsive web that does not break on mobile, but optimized for desktop/laptop. The Meeting Prep brief (1-pager) should render well on tablets for in-meeting reference. |
| **Automated PDF report generation for clients** | "Generate a branded report I can send to a prospect." | Conflates the BD radar (internal tool) with client deliverables (external). If Partners send AI-generated reports to clients, quality expectations are different, liability issues arise, and the product scope explodes. | Export raw data and charts. The Partner or their analyst assembles the client deliverable. The product informs BD, it does not replace the consulting engagement. |

---

## Feature Dependencies

```
[Company Data Model / Universe]
    |
    +--requires--> [Standardized Financial Metrics]
    |                   |
    |                   +--requires--> [Time-Series Comparison Views]
    |                   +--requires--> [Competitive Benchmarking]
    |                   +--requires--> [AI Variance Analysis]
    |                   +--requires--> [Financial Performance Tracker Module]
    |
    +--requires--> [Deal / Transaction Data]
    |                   |
    |                   +--requires--> [Deal Tracker Module]
    |
    +--requires--> [Leadership / Governance Data]
    |                   |
    |                   +--requires--> [Leadership Watch Module]
    |
    +--requires--> [Operational Signals Data]
                        |
                        +--requires--> [Operational Intelligence Module]

[Executive Snapshot]
    |
    +--requires--> [All Data Modules Operational]
    +--requires--> [AI Summarization Layer]

[BD Signal Scoring]
    |
    +--requires--> [Financial Performance Tracker]
    +--requires--> [Leadership Watch]
    +--requires--> [Operational Intelligence]
    +--requires--> [AI Scoring Model]

[Meeting Prep Brief]
    |
    +--requires--> [Company Profiles]
    +--requires--> [Financial Performance Tracker]
    +--requires--> [Leadership Watch]
    +--requires--> [Deal Tracker]
    +--requires--> [Competitive Moves]
    +--requires--> [BD Signal Scoring]
    +--requires--> [AI Generation Layer]

[Action Lens]
    |
    +--requires--> [All Content Modules]
    +--requires--> [Persona Classification]

[90-Day Forward Indicators]
    |
    +--requires--> [Financial Performance Tracker] (trend data)
    +--requires--> [Management Commentary Sentiment] (optional but enhancing)
    +--requires--> [AI Prediction Model]

[PowerPoint Export]
    |
    +--requires--> [All Visualization Components Stable]
    +--requires--> [Template System]

[Multi-Tenant Branding]
    |
    +--independent-- (can be built at any phase)
    +--enhances--> [Export Features] (branded exports)

[Search & Filtering]
    |
    +--requires--> [Company Data Model]
    +--enhances--> [Every Module]
```

### Dependency Notes

- **Company Data Model is the foundation:** Every feature depends on a clean, structured company data model with standardized financials. Build this first or everything else is built on sand.
- **AI layers sit on top of data layers:** AI variance analysis, BD signal scoring, and executive summaries all require the underlying data modules to be functional. Do not attempt AI features until the data rendering is solid.
- **Meeting Prep is a capstone feature:** It pulls from every module. It cannot be built until all core modules exist. But it is also the highest-value differentiator for daily usage. Plan for it early, build it last.
- **Multi-tenant branding is orthogonal:** Can be implemented at any phase as it wraps the entire application. Implement early to enable demo instances for sales.
- **Export features need stable UI:** Do not invest in PDF/PPTX export until the views they export are finalized. Exporting unstable layouts wastes engineering effort.

---

## MVP Definition

### Launch With (v1.0)

Minimum viable product -- what is needed for a consulting firm Partner to find value in a first demo.

- [ ] **Company Universe with profiles** -- 15-20 Consumer Durables companies with basic info (name, segment, revenue band, listed/unlisted, promoter group)
- [ ] **Financial Performance Tracker** -- standardized metrics for each company (revenue growth, EBITDA margin, working capital days, ROCE) with QoQ and YoY views. This is the bedrock that everything else builds on.
- [ ] **Executive Snapshot** -- AI-generated monthly summary: 5 bullets, big themes, red flags. This is the "open the product" moment.
- [ ] **Competitive Benchmarking** -- side-by-side comparison of 3-5 companies on key metrics. Partners use this in every BD meeting.
- [ ] **Deal & Transaction Tracker** -- M&A, PE/VC investments, IPO filings for the universe. Even a manually curated initial dataset proves the concept.
- [ ] **Leadership Watch** -- CXO changes, board reshuffles, promoter stake changes. High-signal, low-data-volume, easy to populate.
- [ ] **Search & basic filtering** -- find a company, filter by metric threshold.
- [ ] **Data recency indicators** -- "as of Q3 FY25" on every data point.
- [ ] **Source attribution** -- source citation on every metric and claim.
- [ ] **Basic export** -- PDF of current view, CSV of data tables.
- [ ] **Multi-tenant branding shell** -- BrandProvider with configurable logo, colors. Even if only one tenant at launch, architecture must support multi-tenant from day one.
- [ ] **Monthly edition navigation** -- clear "February 2026 Edition" framing with archive access.

### Add After Validation (v1.x)

Features to add once the core is working and first consulting firm customers are providing feedback.

- [ ] **AI Variance Analysis** -- "EBITDA declined 180bps because..." narrative on every metric. Add when financial data quality is proven stable.
- [ ] **BD Signal Scoring** -- composite "who needs help" scoring. Add when Partners confirm the signal types that matter. Needs real-world calibration.
- [ ] **Engagement Opportunity Classification** -- tag signals with consulting service line (Turnaround, Growth Strategy, Cost Optimization). Add when BD scoring is validated.
- [ ] **Action Lens (persona-based views)** -- "What this means for a PE investor" vs "What this means for a COO." Add when content modules are producing reliable intelligence.
- [ ] **Operational Intelligence module** -- supply chain signals, capacity changes, retail expansion/rationalization. Add when operational data sourcing is established (this data is harder to get than financial data).
- [ ] **Market Pulse module** -- macro demand signals, input cost trends, margin outlook. Add as a context layer after company-level data is solid.
- [ ] **Competitive Moves tracker** -- product launches, pricing actions, D2C initiatives. Add when news/announcement data pipeline is reliable.
- [ ] **Management Commentary Sentiment** -- NLP on earnings transcripts. Add when transcript ingestion pipeline exists.
- [ ] **PowerPoint export** -- deck-ready slide generation. Add when visualization components are stable and template design is finalized.

### Future Consideration (v2+)

Features to defer until product-market fit is established with Consumer Durables and the first 2-3 consulting firm clients.

- [ ] **Meeting Prep Brief Generator** -- 1-click company brief for BD meetings. Defer because it requires ALL modules to be operational and high-quality. This is the ultimate capstone.
- [ ] **90-Day Forward Indicators** -- predictive signals. Defer because prediction accuracy requires historical calibration data and high risk of credibility damage if wrong.
- [ ] **Sub-Sector Deep Dive (rotating)** -- monthly rotating deep dives into AC, refrigerator, washing machine, etc. sub-segments. Defer because content-intensive and requires deep sub-segment data that takes time to build.
- [ ] **Competitive Cluster Mapping** -- visual strategy clustering. Defer because requires accumulated strategy signal data over multiple months.
- [ ] **Category expansion** -- FMCG, QSR, Apparel, Beauty beyond Consumer Durables. Defer until the Consumer Durables playbook is proven and repeatable.
- [ ] **Watchlist personalization** -- Partner-specific watchlists and notification preferences. Defer until user base is large enough to warrant personalization investment.

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Company profiles + standardized financials | HIGH | HIGH | P1 |
| Executive Snapshot (AI summary) | HIGH | MEDIUM | P1 |
| Financial Performance Tracker | HIGH | HIGH | P1 |
| Competitive Benchmarking view | HIGH | MEDIUM | P1 |
| Deal & Transaction Tracker | HIGH | HIGH | P1 |
| Leadership Watch | HIGH | LOW | P1 |
| Search & filtering | MEDIUM | MEDIUM | P1 |
| Data recency indicators | HIGH | LOW | P1 |
| Source attribution | HIGH | LOW | P1 |
| Basic export (PDF, CSV) | MEDIUM | MEDIUM | P1 |
| Multi-tenant branding | HIGH | MEDIUM | P1 |
| Monthly edition framing | MEDIUM | LOW | P1 |
| AI Variance Analysis | HIGH | HIGH | P2 |
| BD Signal Scoring | HIGH | HIGH | P2 |
| Engagement Opportunity Classification | HIGH | MEDIUM | P2 |
| Action Lens (persona views) | MEDIUM | MEDIUM | P2 |
| Operational Intelligence | MEDIUM | HIGH | P2 |
| Market Pulse | MEDIUM | MEDIUM | P2 |
| Competitive Moves tracker | MEDIUM | MEDIUM | P2 |
| Management Commentary Sentiment | MEDIUM | HIGH | P2 |
| PowerPoint export | HIGH | HIGH | P2 |
| Meeting Prep Brief Generator | HIGH | HIGH | P3 |
| 90-Day Forward Indicators | HIGH | HIGH | P3 |
| Sub-Sector Deep Dive | MEDIUM | HIGH | P3 |
| Competitive Cluster Mapping | MEDIUM | MEDIUM | P3 |
| Category expansion (FMCG, QSR, etc.) | HIGH | HIGH | P3 |

**Priority key:**
- P1: Must have for launch -- without these, the product does not demonstrate enough value for a Partner demo
- P2: Should have, add after initial validation -- these turn a "useful tool" into a "must-have platform"
- P3: Future consideration -- these are the vision features that justify long-term subscription pricing

---

## Competitor Feature Analysis

| Feature | CB Insights | PitchBook | AlphaSense | Capitaline/CMIE | Our Approach |
|---------|-------------|-----------|------------|-----------------|--------------|
| Company profiles | Startup-focused, 1M+ companies, shallow depth | Comprehensive for PE/VC targets, deep financial data | Document-level, not profile-level | Indian company profiles, raw financial data | Deep profiles for 15-20 companies. Depth over breadth. |
| Financial data | Limited (startup metrics) | Extensive (US/global, standardized) | Via source documents, not structured | Raw financial data, download-oriented, poor UX | Standardized Indian GAAP/Ind AS metrics with QoQ/YoY. Clean visualization, not raw tables. |
| Deal tracking | M&A, VC deals globally | Best-in-class deal database globally | Via document search | Limited deal coverage | Curated M&A, PE/VC for Consumer Durables India. Every deal annotated with strategic rationale. |
| AI-generated insights | Market maps, trend analysis | Limited AI commentary | Smart Summaries on search results | None | AI variance analysis, BD signal scoring, executive summaries. AI is the product, not a feature. |
| Consulting BD focus | Not consulting-specific | Somewhat (due to PE/consulting client base) | Used by consulting for research | Not at all | Entire product oriented around "who needs consulting help and why." Every feature answers a BD question. |
| India mid-market depth | Minimal India coverage | Limited India coverage | Growing India coverage via broker reports | Strong India coverage, poor UX and analysis | This is the white space. Deep Indian mid-market coverage with consulting-grade analysis. |
| Export quality | PDF, Excel | Excel, PDF, basic PPT | PDF of search results | Excel downloads | PDF, CSV for v1. Deck-ready PPTX for v1.x. |
| Monthly cadence reporting | Weekly newsletter (different format) | No cadence reporting (always-on database) | No cadence reporting (search-based) | No cadence reporting (database) | Monthly edition model. Curated, not raw. This IS the product format. |
| Persona-based interpretation | None | None | None | None | "What this means for PE" vs "for COOs" -- genuinely novel for this category. |
| Forward-looking signals | Trend spotting but not predictive | None | None | None | 90-day forward indicators -- a genuine differentiator if executed with appropriate confidence framing. |
| Pricing | $50K-$100K+/year | $20K-$60K+/year per seat | $25K-$75K+/year per seat | ~2-5L INR/year | Multi-tenant SaaS. Priced for consulting firm budgets (likely 5-15L INR/year per firm). Value justified by analyst time saved. |

### Competitive Positioning Summary

The white space this product occupies:

1. **Geography:** India mid-market. CB Insights, PitchBook, AlphaSense all have weak India mid-market coverage. Capitaline/CMIE have the data but terrible UX and zero intelligence layer.
2. **Buyer persona:** Consulting BD. None of the existing platforms are built for the "spot companies that need consulting help" use case. They serve investors, research analysts, or corporate strategists -- not consulting Partners doing BD.
3. **Format:** Curated monthly intelligence. Existing platforms are either always-on databases (PitchBook, AlphaSense) or one-off reports. The monthly cadence with AI curation fills a gap between "daily data feed" and "annual industry report."
4. **Intelligence depth:** AI-generated analysis, not just data. The variance analysis, BD signal scoring, and persona-based interpretation layers transform raw data into actionable consulting intelligence.

---

## India-Specific Feature Considerations

Features and design choices specific to the Consumer Durables mid-market India context.

| Consideration | Impact on Features | Notes |
|---------------|-------------------|-------|
| **Indian GAAP vs Ind AS reporting** | Financial data normalization is non-trivial | Some mid-market companies still report under Indian GAAP. Standardization layer must handle both. |
| **Promoter-driven companies** | Promoter stake tracking is a high-signal feature | Promoter pledge, stake sale, or dilution is often the first signal of financial stress in Indian mid-market. Make this prominent. |
| **Quarterly results season** | Content cadence aligns with quarterly results | February (Q3 results), May (Q4/annual), August (Q1), November (Q2). Monthly edition but quarterly results drive the most content. |
| **MCA filings as data source** | Non-listed company data available via MCA | For companies like Haier India (not listed), MCA filings are the primary financial data source. Filing lag is 6-12 months. |
| **BSE/NSE corporate filings** | Listed company data is relatively accessible | Listed companies (Voltas, Crompton, Bajaj Electricals, V-Guard, Blue Star) file quarterly results on BSE/NSE. More timely than MCA. |
| **INR denomination** | All financial data in INR Crores | This is non-negotiable for the India context. Conversion to USD is irrelevant for the buyer persona. |
| **India regulatory signals** | BIS standards, PLI scheme, import duty changes | Regulatory changes (e.g., energy efficiency norms for ACs, PLI incentives for electronics manufacturing) are material signals for Consumer Durables. Include in Market Pulse. |
| **Seasonality patterns** | Summer = AC/cooler demand, Diwali = durables demand | Seasonal patterns affect quarterly comparisons. The platform should normalize for seasonality or at least flag seasonal effects in variance analysis. |
| **Regional market dynamics** | South India vs North India penetration matters | Companies like Blue Star (strong in South) vs Voltas (pan-India) have different regional dynamics. Sub-regional analysis is a differentiator but adds data complexity. |

---

## Sources

- **CB Insights platform features:** Based on training data knowledge of CB Insights platform (cbinsights.com/platform). Confidence: MEDIUM. CB Insights is known for market intelligence, company profiles, M&A tracking, AI-generated market maps, and sector intelligence. Primarily US/global startup ecosystem focused.
- **PitchBook features:** Based on training data knowledge of PitchBook platform. Confidence: MEDIUM. PitchBook is the industry standard for deal data, PE/VC intelligence, company profiles, and financial data. Primarily US/global focus. Owned by Morningstar.
- **AlphaSense features:** Based on training data knowledge of AlphaSense platform. Confidence: MEDIUM. AlphaSense is known for AI-powered search across earnings transcripts, broker research, news, and filings. Smart Summaries and sentiment analysis are key features.
- **Capitaline/CMIE Prowess:** Based on training data knowledge of Indian financial databases. Confidence: MEDIUM. Capitaline (owned by Capital Market Publishers) and CMIE Prowess are the standard databases for Indian company financial data. Strong data, weak UX, no intelligence layer.
- **Bain/McKinsey industry reports:** Based on training data knowledge of consulting firm industry intelligence formats. Confidence: HIGH. The structure of consulting-grade industry reports is well-established: executive summary, market sizing, competitive landscape, financial benchmarking, strategic themes.
- **Tegus features:** Based on training data knowledge. Confidence: MEDIUM. Tegus is known for expert call transcripts and primary research, competing with AlphaSense in the expert intelligence space.

**Confidence note:** Web search and web fetch tools were unavailable during this research. All findings are based on training data knowledge (cutoff: May 2025). Feature sets of these platforms may have evolved since then. Core feature categories (company profiles, financial data, deal tracking, search, export) are stable and unlikely to have changed materially. AI-powered features (smart summaries, sentiment analysis) are the most likely area of evolution. Flag for re-verification if decisions hinge on specific competitor capabilities.

---
*Feature research for: AI-driven Industry Intelligence / Consulting BD Radar -- Consumer Durables Mid-Market India*
*Researched: 2026-02-15*
