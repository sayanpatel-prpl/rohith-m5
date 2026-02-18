# Consumer Durables Intelligence Dashboard

**Kompete by Kompete** — Strategic Intelligence Module for Consumer Durables Sector (India)

## Overview

This dashboard provides comprehensive financial, operational, and competitive intelligence for mid-market consumer durables companies in India. Built as a PoC for Alvarez & Marsal's MD, it demonstrates the power of automated intelligence aggregation and analysis for the consulting advisory use case.

### Audience
- **Primary**: Alvarez & Marsal Managing Directors and Partners
- **Secondary**: PE/VC investors, company founders/promoters, COOs/CFOs

### Scope
- **Companies Tracked**: 10 (Whirlpool, Voltas, Blue Star, Crompton, Bajaj Electricals, V-Guard, IFB, Havells, Symphony, Orient Electric)
- **Data Period**: Q1 2022 — Q1 2025 (February 2025 current)
- **Sections**: 11 interactive dashboard sections
- **Data**: Realistic dummy data for demonstration purposes

## How to Use

### Opening the Dashboard
Simply open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari). No server required.

```
Open: consumer-durables-intelligence/index.html
```

### Navigation
Use the **left sidebar** to switch between sections:
1. **Executive Snapshot** — Monthly intelligence brief with key insights
2. **Market Pulse** — Demand signals, input costs, margin outlook, channel dynamics
3. **Financial Tracker** — Comprehensive metrics table with charts (click any row for detail)
4. **Deals & Transactions** — M&A, PE/VC, strategic stakes, IPOs
5. **Operational Intelligence** — Supply chain, manufacturing, procurement metrics
6. **Leadership & Governance** — CEO changes, board reshuffles, promoter movements
7. **Competitive Moves** — Product launches, pricing strategies, D2C initiatives
8. **Sub-Sector Deep Dive** — Home appliances market analysis
9. **What This Means For...** — Tailored insights by stakeholder type
10. **Watchlist & Signals** — Forward indicators and stress signals
11. **A&M Value-Add** — Specific advisory opportunities

### Filters
The **filters bar** at the top provides:
- **Company multi-select** — Choose specific companies to analyze
- **Sub-Category** — Filter by White Goods or Consumer Electronics
- **Performance rating** — Outperform / Inline / Underperform
- **Time Period** — Quarter/year selection
- **Revenue Range** — Filter by revenue band
- **Reset All** — Return to default view

Filter preferences are saved to localStorage automatically.

### Drill-Down
- Click any row in the **Financial Tracker** table to open a detailed company modal
- Modal shows complete company profile, financials, operational metrics, channel mix, and sentiment

### Export
- **Export PDF** — Generates a formatted PDF report with executive summary, financials, and A&M opportunities
- **Export Excel** — Generates a multi-sheet Excel workbook with all data tables

## Data Sources (Recommendations for Production)

| Section | Recommended Sources |
|---------|-------------------|
| Financial Data (Listed) | BSE/NSE APIs, Screener.in, Trendlyne, CMIE Prowess |
| Financial Data (Unlisted) | MCA filings, Tofler, Zaubacorp |
| Deals & Transactions | VCCEdge, Tracxn, Crunchbase |
| News & Sentiment | Google News API, NewsAPI, Twitter/X API |
| Operational Metrics | Company investor presentations, annual reports |
| Industry Benchmarks | CEAMA, Frost & Sullivan, Euromonitor |
| Channel Data | Industry associations, retail audits (Nielsen) |

See [docs/data-sources.md](docs/data-sources.md) for detailed breakdown.

## Current Data Status

**This PoC uses realistic dummy data for demonstration.** All financial figures, operational metrics, and events are simulated but designed to reflect:
- Actual market dynamics (post-COVID recovery, normalization, current trends)
- Realistic financial ratios for the consumer durables sector
- Seasonal patterns typical of the industry
- Plausible M&A activity and leadership changes

## Technical Details

### File Structure
```
consumer-durables-intelligence/
├── index.html                    # Main dashboard (open this)
├── README.md                     # This file
├── assets/
│   ├── css/main.css             # Stylesheet (Kompete design system)
│   ├── js/
│   │   ├── data.js              # All dummy data and helper utilities
│   │   ├── app.js               # Main app logic, navigation, rendering
│   │   ├── charts.js            # Chart.js visualization module
│   │   ├── filters.js           # Interactive filtering system
│   │   └── export.js            # PDF/Excel export module
│   └── images/                  # Reserved for icons/logos
└── docs/
    ├── data-sources.md          # Detailed data source recommendations
    └── api-integration-plan.md  # Production API integration roadmap
```

### Dependencies (CDN-loaded)
- **Chart.js 4.4.1** — Interactive charts and visualizations
- **jsPDF 2.5.1** — PDF report generation
- **SheetJS (xlsx) 0.18.5** — Excel export
- **Google Fonts** — Inter (primary) and IBM Plex Mono (data)

### Browser Compatibility
- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

### Design System
Follows the Kompete/Kompete design system:
- **Colors**: Kompete Navy (#0F1F3D), Deep Blue (#1E3A8A), Intelligence Blue (#3B82F6), Teal (#0D9488), Amber (#F59E0B)
- **Typography**: Inter (primary), IBM Plex Mono (data/numbers)
- **Spacing**: 4px base unit system
- **Components**: Cards, tables, badges, modals matching Kompete patterns

## Customization Guide

### Adding/Removing Companies
Edit `assets/js/data.js`:
1. Add entry to `DATA.companies` array
2. Add corresponding financial data to `DATA.financials`
3. Add entries to `performanceRatings`, `channelMix`, `productMix`, `operationalMetrics`, `sentimentScores`

### Adding New Metrics
1. Add data arrays in `DATA.financials[companyId]`
2. Update table rendering in `app.js` (renderFinancialTable)
3. Add chart if needed in `charts.js`

### Modifying Filters
Edit `assets/js/filters.js` — add new filter groups and update `getFilteredCompanyIds()` method.

### Changing Time Periods
Update `DATA.quarters` array in `data.js` and extend all data arrays accordingly.

## Future API Integration
See [docs/api-integration-plan.md](docs/api-integration-plan.md) for the production roadmap covering:
- Phase 1: Manual data entry workflow
- Phase 2: Semi-automated CSV imports
- Phase 3: Fully automated API integration

---

*Built as part of the Kompete Intelligence Platform by Kompete. Data is for demonstration purposes only.*
