# Feature Landscape

**Domain:** Consulting-Grade Sector Intelligence Dashboards
**Researched:** 2026-02-20
**Confidence:** MEDIUM

## Table Stakes

Features users expect. Missing = product feels incomplete or unprofessional.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Multi-level drill-down** | Users expect to navigate from summary KPIs to transaction-level details. Standard in all modern BI tools. | Medium | Hierarchical data structures allowing progressive disclosure from annual → quarterly → monthly → transaction level. |
| **Export to PDF/PowerPoint** | Consulting deliverables are traditionally deck-based. Clients expect offline viewing capability. | Low | Support both portrait/landscape, include filter parameters, maintain visual fidelity. Single-file HTML already provides offline viewing but PDF still expected. |
| **Real-time data refresh** | 2026 expectation is automatic sync from data sources without manual uploads. | Medium | Continuous refresh from ERP/CRM/cloud systems. For A&M use case, may be scheduled rather than streaming. |
| **Multi-company comparison views** | Benchmarking is core to consulting intelligence. Side-by-side comparison is minimum viable. | Medium | Horizontally scrollable comparison tables, visual leaderboards, normalized metrics for apples-to-apples comparison. |
| **Customizable filters** | Users need to slice data by company, time period, geography, metric type without rebuilding dashboards. | Low | Current implementation (company, sub-category, performance tier, time period) covers basics. |
| **Source attribution on every metric** | Professional credibility requires visible sourcing. Regulatory/compliance may require audit trails. | Low | Already implemented with 4-tier confidence system. Must be consistently applied to every data point. |
| **Executive summary slide/view** | Decision-makers expect high-level overview before diving into details. McKinsey/BCG standard. | Low | Single-screen snapshot of key findings, trends, and recommendations using Situation-Complication-Resolution framework. |
| **Presentation mode** | Consultants present dashboards in client meetings. Clean, distraction-free view is expected. | Low | Hide filters/controls, optimize for projection, keyboard navigation between sections. |
| **Mobile/tablet responsiveness** | Executives review on iPads during travel. Non-responsive = unusable for key audience. | Medium | Not just layout adaptation but interaction model (touch vs mouse, simplified filters). |

## Differentiators

Features that set product apart. Not expected, but valued for competitive positioning.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **"Beyond filings" alternative data integration** | Alternative data (transaction data, web scraping, social sentiment) reflects real-time market reality vs backward-looking filings. Differentiates from public filings databases. | High | Integrate transaction data, job postings, pricing data, reviews. Requires data partnerships or web scraping infrastructure. Aligns with A&M's "beyond filings" positioning. |
| **Talk vs Walk verification** | Cross-validates company statements (earnings calls, press releases) against operational data (hiring freezes, capex cuts). Surfaces discrepancies that signal distress or opportunity. | High | NLP on qualitative sources + quantitative metric correlation. Example: "announced expansion" but "job postings down 40%". Strong fit for turnaround/restructuring focus. |
| **AI-powered signal detection & early warnings** | Proactive alerts when patterns indicate inflection points (deteriorating liquidity, market share shifts, leadership churn). Moves from reactive reporting to predictive intelligence. | High | ML models trained on historical distress signals. Real-time monitoring with configurable thresholds. Risk: false positives erode trust. |
| **Automated battlecards for deal pipeline** | For each pipeline opportunity, auto-generate competitive position summary, valuation benchmarks, key risks. Saves 10+ hours per deal. | High | Requires structured deal data + templates + data enrichment APIs. High value for PE/transaction advisory focus. |
| **Dynamic confidence scoring** | Visual indicators (color coding, icons) show data reliability at metric level. Updates as new sources confirm/contradict. Transparent about uncertainty. | Medium | Current 4-tier system is foundation. Enhancement: show multiple sources in tooltip, flag conflicting data, decay confidence over time. |
| **Embedded expert commentary** | Section-specific insights from A&M practitioners (e.g., "In our restructuring experience, this pattern indicates..."). Adds consulting judgment, not just data. | Medium | Requires content management workflow for practitioners to contribute. Blend of canned insights + dynamic based on current data. |
| **Scenario modeling interface** | "What if capex increases 20%?" or "What if top customer churns?" Interactive forecasting within dashboard context. | High | Requires financial modeling engine. May be better as linked tool than embedded feature for v1. |
| **Collaborative annotations** | Team members can flag data points, add notes, @mention colleagues. Transforms dashboard from static report to workspace. | Medium | Requires user accounts, permissions, notification system. Lower priority if primary use is client-facing vs internal. |
| **Automated insight generation** | AI-generated narrative summaries: "Revenue grew 12% QoQ but margin compressed due to input cost inflation." Saves analysis time. | Medium | NLP templates + metric change detection. Risk: generic insights add noise. Must be highly relevant or skippable. |
| **Customizable alert rules** | Users define thresholds ("alert me when debt/EBITDA > 4x" or "RSI overbought"). Personalized early warning system. | Medium | Notification infrastructure + user-defined rule builder. Requires email/Slack integration. |
| **Cross-sector pattern matching** | "Companies with similar profiles experienced X outcome 70% of the time." Leverage historical data across sectors for pattern recognition. | Very High | Requires large historical dataset + ML similarity models. Long-term differentiator, not MVP. |

## Anti-Features

Features to explicitly NOT build. Common in BI tools but wrong for this use case.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **User-editable dashboards** | Consultant-designed structure is the product. Ad-hoc dashboard builders create inconsistency and dilute expertise. | Provide pre-built views optimized for each persona (CFO, operational leader, deal team). Allow filter customization only. |
| **Data entry forms** | Dashboard is intelligence delivery, not data collection. Adding CRUD operations creates maintenance burden and confuses purpose. | Keep read-only. If data contribution needed, use separate intake process (API, structured uploads). |
| **Social features (likes, comments in feed style)** | Dashboard is professional deliverable, not social platform. Feature bloat reduces credibility. | Use annotations sparingly for collaboration. No gamification or engagement metrics. |
| **Public sharing/embedding** | Sensitive competitive intelligence and client data. Security risk outweighs convenience. | Authenticated access only. PDF export for controlled external sharing. |
| **Real-time chat/messaging** | Scope creep into collaboration platform. Dilutes focus on intelligence delivery. | Integrate with existing tools (Slack, Teams) via notifications rather than building chat. |
| **Workflow automation (approvals, task assignment)** | Dashboard shows intelligence; workflow happens in other systems (CRM, project management). Avoid becoming project management tool. | Link to pipeline/CRM for next actions rather than embedding workflow. |
| **Data marketplace/third-party integrations** | Maintaining connector ecosystem is resource-intensive. Focus on core consulting datasets. | Partner with established data providers; integrate select high-value sources rather than building connector library. |

## Feature Dependencies

```
Executive Summary → All section data (aggregation dependency)
Drill-down → Hierarchical data structure + URL routing
Alert System → Real-time refresh + Threshold rules + Notification infrastructure
Talk vs Walk → NLP processing + Metric correlation engine
Multi-company Comparison → Normalized metrics + Aligned taxonomies
Presentation Mode → Clean URL state + Print stylesheets
PDF Export → Server-side rendering (or client-side print optimization)
Battlecards → Deal pipeline data + Template engine + Data enrichment
Scenario Modeling → Financial modeling engine + Input validation
Collaborative Annotations → User auth + Permissions + Comments data model
```

## Feature Complexity Matrix

### Low Complexity (0-2 weeks)
- Presentation mode UI toggle
- Executive summary static template
- PDF export via browser print
- Filter persistence in URL
- Source attribution tooltips

### Medium Complexity (2-6 weeks)
- Multi-level drill-down with routing
- Mobile responsive layouts
- Dynamic confidence scoring UI
- Alert rule builder interface
- Embedded commentary CMS
- Collaborative annotations

### High Complexity (6-12 weeks)
- Alternative data integration
- Talk vs Walk verification engine
- AI signal detection models
- Automated battlecard generation
- Real-time data pipeline

### Very High Complexity (3+ months)
- Scenario modeling engine
- Cross-sector pattern matching ML
- Full workflow automation

## MVP Recommendation

Prioritize for **Phase 1 (Foundation)**:
1. **Executive summary view** — Table stakes, validates product concept
2. **Enhanced source attribution** — Core differentiator, builds trust
3. **Presentation mode** — Consulting delivery requirement
4. **PDF export** — Client deliverable format
5. **Multi-company comparison** — Core use case for sector intelligence

Prioritize for **Phase 2 (Intelligence)**:
1. **Alert system foundation** — Differentiator, requires data pipeline maturity
2. **Dynamic confidence scoring** — Enhances existing 4-tier system
3. **Drill-down navigation** — Expected by sophisticated users

Prioritize for **Phase 3 (Advanced Intelligence)**:
1. **Talk vs Walk verification** — Unique differentiator for A&M positioning
2. **Alternative data integration** — "Beyond filings" promise delivery
3. **AI signal detection** — Competitive moat if done well

Defer to **Post-MVP**:
- Scenario modeling (requires separate modeling engine)
- Cross-sector pattern matching (requires large historical dataset)
- Collaborative annotations (higher value for internal tools vs client deliverables)
- Automated battlecards (requires structured pipeline data first)

## Feature-Driven Phasing Rationale

### Why this order?

**Foundation features first** because consulting dashboards live or die on credibility. Source attribution, professional presentation mode, and exportability establish baseline trustworthiness before adding intelligence layers.

**Intelligence features second** because A&M's value proposition is insight, not just data visualization. Alert systems and dynamic confidence scoring transform static dashboard into active intelligence tool.

**Advanced intelligence features third** because Talk vs Walk verification and alternative data integration require both technical maturity (robust data pipeline, NLP capability) and domain expertise (knowing which signals matter for turnaround/restructuring context).

### Dependencies inform sequencing

- **Presentation mode before alerts** — Alerts generate noise without clean delivery mechanism
- **Dynamic confidence before alternative data** — Need framework to communicate varying data quality before introducing less reliable sources
- **Drill-down before scenario modeling** — Users must understand current state hierarchy before manipulating future scenarios

### Risk-adjusted prioritization

**High-risk features deferred:**
- Scenario modeling (scope creep into financial planning tool)
- Social features (credibility risk)
- User-editable dashboards (maintenance burden)

**Low-risk, high-impact features prioritized:**
- Executive summary (leverages existing data)
- Source attribution (builds on current system)
- Presentation mode (CSS/UX enhancement)

## Competitive Feature Analysis

### What McKinsey/BCG/Bain have (per research):

| Feature | Status | Implementation Notes |
|---------|--------|----------------------|
| Lilli-style conversational agent | Future consideration | McKinsey's tool searches 100K+ documents, finds experts. High complexity, may not fit MVP. |
| Presentation deck export | Table stakes | PowerPoint/PDF export with branded templates, one chart per slide. |
| Executive summary frameworks | Table stakes | SCR (Situation-Complication-Resolution) or Pyramid Principle structure. |
| Real-time portfolio heatmaps | Differentiator | Diligence Activity Dashboard showing trends, conviction, confidence shifts at portfolio level. |
| Glass-box attribution | Differentiator | Fospha-style visibility into model layers, validation metrics, decision rules. |

### What A&M specializes in (turnaround/restructuring focus):

| Domain Expertise | Dashboard Implication |
|------------------|----------------------|
| Operational performance during distress | KPIs: inventory turnover, employee productivity, customer satisfaction, operational efficiency |
| Liquidity monitoring | Real-time cash position, debt covenants, working capital trends |
| Talk vs Walk credibility checks | Cross-validate management statements against operational reality |
| PE deal support | Pipeline views, valuation benchmarks, risk flags |

### Feature gaps to avoid:

Based on research, consulting-grade dashboards in 2026 have these features that **generic BI tools lack**:

1. **Confidence/source transparency** — Business dashboards show metrics; consulting dashboards show metric + provenance + reliability
2. **Presentation optimization** — BI tools optimize for monitoring; consulting tools optimize for storytelling and client delivery
3. **Beyond-filings intelligence** — BI tools aggregate reported data; consulting tools synthesize reported + alternative + proprietary sources
4. **Action orientation** — BI dashboards are passive; consulting dashboards recommend next moves

Current Kompete dashboard has **#1 and #2** foundations in place. **#3 and #4** are Phase 2+ differentiators.

## Sources

### Consulting Intelligence & Competitive Analysis
- [How a Competitive Intelligence Dashboard Enabled Real-Time Market Monitoring](https://www.globenewswire.com/news-release/2026/02/10/3235734/0/en/How-a-Competitive-Intelligence-Dashboard-Enabled-Real-Time-Market-Monitoring-for-a-Global-Enterprise-Astute-Analytica.html)
- [Tech Tuesday: 2026's essential market & competitive intelligence platforms](https://dynamicbusiness.com/featured/tech-tuesday/tech-tuesday-2026s-essential-market-competitive-intelligence-platforms.html)
- [Competitive Intelligence Dashboards - Valona Intelligence](https://valonaintelligence.com/market-intelligence-software/competitive-intelligence-dashboard)
- [What Is Competitive Intelligence in 2026?](https://www.stravito.com/resources/competitive-intelligence)

### Dashboard Design & Best Practices
- [Business Intelligence Dashboard in 2026: What Is It & How to Use](https://www.yellowfinbi.com/blog/business-intelligence-dashboard-what-is-it-how-to-use)
- [26 Business Intelligence Dashboard Design Best Practices 2025](https://julius.ai/articles/business-intelligence-dashboard-design-best-practices)
- [Learn 25 Dashboard Design Principles & BI Best Practices](https://www.rib-software.com/en/blogs/bi-dashboard-design-principles-best-practices)
- [Everything an FP&A leader should have on their finance dashboard](https://www.cubesoftware.com/blog/finance-dashboard)

### Consulting Presentation Standards
- [Building Consulting Slide Decks: The Complete Guide](https://slidescience.co/strategy-presentations/)
- [McKinsey Presentation Structure (A Guide for Consultants)](https://slidemodel.com/mckinsey-presentation-structure/)
- [30 Consulting Presentation Examples for 2026](https://www.contentbeta.com/blog/consulting-presentation/)
- [How McKinsey Consultants Make Presentations](https://slideworks.io/resources/how-mckinsey-consultants-make-presentations)

### Private Equity & Deal Intelligence
- [How to Win Deals in 2026: AI and Strategies for Private Equity Deal Flow](https://grata.com/resources/private-equity-deal-flow)
- [Deal Pipeline Software for Private Equity](https://pefrontoffice.com/deal-pipeline/deal-pipeline-for-private-equity/)
- [Private Equity Pipeline Management Software](https://www.allvuesystems.com/solutions/pipeline-management/)
- [Best Private Equity CRM Tools 2025](https://www.meridian-ai.com/blog/best-private-equity-crm)

### Alternative Data & Signal Detection
- [Alternative Data Sources for Investment & Market Research](https://www.alpha-sense.com/solutions/alternative-data/)
- [Alternative Data and AI Trends in 2026](https://www.kadoa.com/blog/alternative-data-trends-2026)
- [Best Alternative Data Providers 2026](https://brightdata.com/blog/web-data/best-alternative-data-providers)
- [Ultimate Guide – The Top and Best Signal Detection AI of 2026](https://www.dip-ai.com/use-cases/en/the-best-signal-detection-AI)

### Alert Systems & Monitoring
- [AI-driven transaction monitoring: The future of AML, fraud detection, and risk management](https://roboticsandautomationnews.com/2026/02/19/ai-driven-transaction-monitoring-the-future-of-fraud-and-risk-management-in-global-banking/98981/)
- [Introducing Personal Watchlist: Daily Technical Analysis](https://www.marketdly.com/blog/personal-watchlist-feature.html)
- [Early Warning Indicators - AnalystPrep](https://analystprep.com/study-notes/frm/early-warning-indicators/)

### Dashboard Export & Presentation Features
- [Working with Dashboard - Zoho Analytics](https://www.zoho.com/analytics/help/dashboard/working-with-dashboard.html)
- [Exporting Dashboards as PowerPoint Presentations](https://www.slingshotapp.io/en/help/docs/analytics/dashboards/exporting-dashboards/export-as-powerpoint-presentation)
- [Print View - DashboardFox](https://dashboardfox.com/features/print-view/)
- [How to Export Power BI Dashboard to PDF](https://www.graphed.com/blog/how-to-export-power-bi-dashboard-to-pdf)

### Data Transparency & Confidence
- [The 5 AI-Powered Dashboards Every Diligence Team Needs Going Into 2026](https://diligencevault.com/5-ai-powered-diligence-dashboards-2026/)
- [Fospha - Full-funnel measurement for eCommerce](https://www.fospha.com/)
- [AI Transparency & Data Privacy: 2026 Compliance Guide](https://www.roboticmarketer.com/ethical-ai-marketing-regulatory-compliance-for-2026-best-practices-for-professionals/)

### Drill-Down & Hierarchical Navigation
- [Power BI Financial Dashboards: A Simplified Guide (2026)](https://zebrabi.com/power-bi-financial-dashboards/)
- [What is Drill-Down and Drill-Up in Dashboards](https://www.boldbi.com/blog/what-is-drill-down-and-drill-up-in-dashboards/)
- [Define Data Drill Down Analysis & Reports](https://insightsoftware.com/encyclopedia/drill-down/)

### Benchmarking & Multi-Company Comparison
- [Marketing Analytics Dashboard Features Comparison 2026](https://www.cometly.com/post/marketing-analytics-dashboard-features-comparison)
- [The Top 10 Competitor Benchmarking Tools for 2026](https://www.brandwatch.com/blog/best-competitor-benchmarking-tools/)
- [New Competitive Analysis Dashboard - Mentionlytics](https://www.mentionlytics.com/blog/competitive-analysis-dashboard/)

### Turnaround & Restructuring KPIs
- [How do you measure the success of a turnaround strategy](https://flevy.com/topic/turnaround/question/measuring-turnaround-strategy-success-key-kpis-companies)
- [What is a KPI Dashboard? Complete Guide 2026](https://improvado.io/blog/kpi-dashboard)
- [A Comprehensive Guide to Operational Metrics & KPIs](https://www.netsuite.com/portal/resource/articles/erp/operational-kpis-metrics.shtml)

### Leadership & Executive Intelligence
- [Executive Dashboards: 13+ Examples, Templates & Best Practices](https://improvado.io/blog/executive-dashboards)
- [Executive Hiring Trends for 2026: What's Next?](https://novoexec.com/insights/executive-hiring-trends-for-2026-whats-next/)
- [6 Executive Search Trends Shaping Leadership in 2026](https://huntscanlon.com/6-executive-search-trends-shaping-leadership-in-2026/)
