# API Integration Plan — Consumer Durables Intelligence

Production roadmap for transitioning from dummy data to automated data pipelines.

## Phase 1: Manual Data Entry Workflow (Weeks 1-4)

### Objective
Enable analysts to manually input and update data through structured workflows.

### Deliverables
1. **Google Sheets Template** — Structured data entry templates mirroring dashboard data schema
2. **CSV Import Pipeline** — Upload CSVs to populate dashboard data
3. **Validation Layer** — Data quality checks on manual entries
4. **Change Log** — Track who changed what and when

### Data Entry Cadence
- Financial data: Quarterly (within 48 hours of results announcement)
- Deals/transactions: Within 24 hours of announcement
- Leadership changes: Within 24 hours
- News/sentiment: Weekly manual scoring
- Operational metrics: Quarterly (from annual reports/presentations)

### Effort: 2-3 weeks development

---

## Phase 2: Semi-Automated (CSV + API Hybrid) (Weeks 5-10)

### Objective
Automate high-frequency data sources while keeping manual input for complex analysis.

### Automated Sources
1. **BSE/NSE API Integration**
   - Daily: Stock prices, market cap
   - Quarterly: Financial results (auto-parsed from XBRL filings)
   - Event-driven: Corporate actions, shareholding changes

2. **News Aggregation**
   - Google News API: Daily news scraping for tracked companies
   - Auto-tagging: Category (M&A, product launch, leadership, etc.)
   - Sentiment scoring: Claude API for NLP sentiment analysis

3. **Screener.in API**
   - Quarterly financial ratios (automated pull)
   - Peer comparison data
   - Historical time series

### Semi-Automated Sources
- **Investor Presentations**: Auto-download, manual extraction
- **Deal Data**: VCCEdge API feed + manual enrichment
- **Operational Metrics**: Template-based extraction from annual reports

### Architecture
```
[BSE/NSE API] ──→ [Ingestion Service] ──→ [Data Store (Supabase)]
[News APIs]   ──→ [NLP Pipeline]     ──→ [Sentiment Scores]
[Screener]    ──→ [Ratio Calculator]  ──→ [Financial Metrics]
                                          ↓
                                    [Dashboard API]
                                          ↓
                                    [Frontend Dashboard]
```

### Effort: 4-6 weeks development

---

## Phase 3: Fully Automated Pipeline (Weeks 11-20)

### Objective
End-to-end automated intelligence gathering, analysis, and alerting.

### Components

#### 3.1 Data Ingestion Service
- **Scheduler**: Cron-based jobs for each data source
- **Rate Limiting**: Respect API limits across all sources
- **Error Handling**: Retry logic, fallback sources, alert on failures
- **Deduplication**: Prevent duplicate entries from overlapping sources

#### 3.2 NLP & Analysis Pipeline
- **News Summarization**: Claude API for monthly intelligence briefs
- **Sentiment Analysis**: Multi-dimensional scoring (news, analyst, social)
- **Pattern Detection**: Identify emerging themes across companies
- **Anomaly Detection**: Flag unusual metrics (e.g., sudden margin drop)
- **Auto-Rating**: Generate Outperform/Inline/Underperform ratings

#### 3.3 Real-Time Alerting
- **Threshold Alerts**: Notify when metrics breach defined thresholds
- **Event Alerts**: Immediate notification for deals, leadership changes
- **Weekly Digest**: Automated email with key changes and insights
- **Slack Integration**: Real-time alerts to designated channels

#### 3.4 API Endpoints
```
GET  /api/intelligence/dashboard          # Full dashboard data
GET  /api/intelligence/companies          # Company list with filters
GET  /api/intelligence/companies/:id      # Company detail
GET  /api/intelligence/financials/:id     # Financial time series
GET  /api/intelligence/deals              # Deals & transactions
GET  /api/intelligence/news               # News & sentiment
GET  /api/intelligence/watchlist          # Forward indicators
GET  /api/intelligence/export/pdf         # Generated PDF report
GET  /api/intelligence/export/excel       # Generated Excel workbook
POST /api/intelligence/alerts/configure   # Alert configuration
```

#### 3.5 Data Quality & Monitoring
- **Freshness Dashboard**: Monitor data age for each source
- **Completeness Checks**: Alert on missing data points
- **Cross-Validation**: Compare overlapping sources for consistency
- **Audit Trail**: Full history of data changes and sources

### Tech Stack (Recommended)
- **Backend**: Node.js/Express (matching Kompete backend)
- **Database**: Supabase/PostgreSQL (matching Kompete)
- **Queue**: BullMQ for job scheduling
- **AI/NLP**: Claude API for analysis and summarization
- **Scraping**: Apify (already in Kompete stack)
- **Hosting**: Vercel/Railway for serverless deployment

### Effort: 8-10 weeks development

---

## API-Specific Integration Details

### BSE India API
```
Base URL: https://api.bseindia.com/
Endpoints:
  /BseIndiaAPI/api/getScripHeaderData/   # Company header data
  /BseIndiaAPI/api/FinancialResult/      # Quarterly results
  /BseIndiaAPI/api/ShareHoldingPattern/  # Shareholding
Rate Limit: ~100 req/min
Auth: None (public API)
```

### NSE India
```
Base URL: https://www.nseindia.com/api/
Endpoints:
  /quote-equity?symbol=SYMBOL           # Current quote
  /corp-info?symbol=SYMBOL              # Corporate information
  /chart-databyindex?index=SYMBOL       # Historical data
Rate Limit: Aggressive throttling
Auth: Session cookie required
Note: Requires browser-like headers
```

### Screener.in
```
Base URL: https://www.screener.in/api/
Endpoints:
  /company/SYMBOL/                      # Company overview
  /company/SYMBOL/quarterly/            # Quarterly data
  /company/SYMBOL/peers/                # Peer comparison
Auth: API key (paid plan)
```

### NewsAPI
```
Base URL: https://newsapi.org/v2/
Endpoints:
  /everything?q=company+name            # Search news
  /top-headlines?country=in&category=business # Business headlines
Rate Limit: 100 req/day (free), 250K req/mo (paid)
Auth: API key
```

---

## Data Update Schedule (Production)

| Time | Action |
|------|--------|
| 6:00 AM | Fetch overnight news, update sentiment scores |
| 9:15 AM | Fetch opening stock prices, update market caps |
| 3:45 PM | Fetch closing prices, end-of-day updates |
| 6:00 PM | Process analyst reports published during the day |
| Weekly (Mon) | Generate weekly digest email |
| Quarterly +2d | Process financial results as they're announced |
| Monthly (1st) | Generate monthly intelligence report (Executive Snapshot) |

---

## Cost Projections (Monthly)

| Component | Estimated Cost |
|-----------|---------------|
| API subscriptions (Screener, VCCEdge, NewsAPI) | ₹15,000-25,000 |
| Claude API (NLP/analysis) | ₹5,000-15,000 |
| Hosting (serverless) | ₹2,000-5,000 |
| Apify (scraping credits) | ₹3,000-8,000 |
| **Total** | **₹25,000-53,000/mo** |

---

## Success Metrics

1. **Data Freshness**: 95% of data points updated within defined SLA
2. **Accuracy**: <5% variance vs manually verified data
3. **Uptime**: 99.5% dashboard availability
4. **Alert Latency**: <30 minutes for event-driven alerts
5. **Report Generation**: <60 seconds for PDF/Excel export
6. **User Satisfaction**: NPS >70 from A&M users
