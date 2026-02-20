# Source Reference -- Presenter's Cheat Sheet

**Purpose:** Every data point traceable in 5 seconds.

## Confidence Tiers

| Tier | Label | What It Means | Examples |
|------|-------|---------------|----------|
| T1 | Hard financial filings | Audited/reviewed quarterly numbers from regulatory filings | Screener.in, BSE/NSE filings, Annual Reports |
| T2 | Verified alternative data | Structured data from established platforms, cross-validated | Trendlyne metrics, market cap data, shareholding patterns |
| T3 | Curated intelligence | Analyst research, curated briefings, expert assessments | Sovrenn Intelligence, growth triggers, concall highlights |
| T4 | News & sentiment | Filtered news with credibility scoring (anti-clickbait filtering applied) | Press releases, verified news articles |

## Data Categories

### 1. Financial Data (Revenue, EBITDA, ROCE, D/E, Working Capital Days)

| Data Point | Source | Tier | How to Verify |
|-----------|--------|------|---------------|
| Quarterly Revenue | Screener.in quarterly filings | T1 | https://www.screener.in/company/{TICKER}/consolidated/ |
| EBITDA / EBITDA Margin | Screener.in quarterly filings | T1 | Same as above, "Quarterly Results" section |
| ROCE, ROE | Screener.in ratios | T1 | https://www.screener.in/company/{TICKER}/consolidated/#ratios |
| Debt-to-Equity Ratio | Screener.in balance sheet | T1 | https://www.screener.in/company/{TICKER}/consolidated/#balance-sheet |
| Working Capital Days | Derived from quarterly data | T1 | Receivable + Inventory - Payable days from quarterly filings |
| Net Profit / PAT | Screener.in quarterly results | T1 | Same quarterly results page |

### 2. Company Overview (Market Cap, Current Price, Promoter Holding)

| Data Point | Source | Tier | How to Verify |
|-----------|--------|------|---------------|
| Market Cap | Screener.in / Trendlyne | T1 | https://www.screener.in/company/{TICKER}/ |
| Current Price | Trendlyne | T2 | https://trendlyne.com/equity/{TICKER}/ |
| Promoter Holding % | Screener.in shareholding | T1 | BSE/NSE quarterly shareholding filings |
| FII/DII Holding % | Trendlyne summary | T2 | Trendlyne shareholding page |

### 3. Growth Triggers & Concall Highlights

| Data Point | Source | Tier | How to Verify |
|-----------|--------|------|---------------|
| Growth triggers | Sovrenn Intelligence | T3 | Sovrenn company briefing page |
| Concall highlights | Sovrenn Intelligence | T3 | Cross-reference with actual concall transcripts on BSE |
| Management guidance | Concall transcripts | T1 | BSE filing search: https://www.bseindia.com/corporates |

### 4. Market Metrics (Stock Performance, Momentum, Relative Strength)

| Data Point | Source | Tier | How to Verify |
|-----------|--------|------|---------------|
| Stock price change (1M/3M/1Y) | Trendlyne | T2 | Trendlyne price history chart |
| Relative strength vs Nifty | Trendlyne | T2 | Trendlyne peer comparison |
| 52-week high/low | Trendlyne summary | T1 | Any financial portal |
| Volume trends | Trendlyne | T2 | NSE historical data |

### 5. Deals & Transactions (M&A, Capex, JVs)

| Data Point | Source | Tier | How to Verify |
|-----------|--------|------|---------------|
| M&A activity | Annual Reports, Press Releases | T2-T3 | Company IR page / BSE announcements |
| Capex announcements | Concall transcripts, Press Releases | T2-T3 | BSE corporate announcements |
| JV/Partnerships | Press Releases, Sovrenn | T3-T4 | Company press release archives |
| Fundraising activity | BSE filings | T1-T2 | BSE corporate actions |

### 6. Operational Intelligence (Capacity, Efficiency, Supply Chain)

| Data Point | Source | Tier | How to Verify |
|-----------|--------|------|---------------|
| Capacity utilization | Concall transcripts | T1-T2 | Company concall filings |
| Inventory turnover | Derived from financials | T1 | Screener.in balance sheet + P&L |
| Plant expansions | Press Releases, Annual Reports | T2-T3 | Company IR page |
| Working capital metrics | Screener.in balance sheet | T1 | Quarterly filing data |

### 7. News & Sentiment

| Data Point | Source | Tier | How to Verify |
|-----------|--------|------|---------------|
| Company news | TBD (arriving Sunday) | T2-T4 | Original source URL in news item |
| Sentiment scoring | Derived from news content | T4 | Cross-reference with multiple sources |
| Corroboration | Multi-source validation | Varies | Check if 2+ independent sources report same fact |

## Quick Verification Protocol

1. **Financial claim?** Go to Screener.in -> Company -> Consolidated -> Quarterly Results
2. **Market data claim?** Go to Trendlyne -> Equity -> Company name
3. **Growth trigger?** Check Sovrenn -> Cross-reference with latest concall transcript
4. **Deal claim?** Check BSE corporate announcements -> Company press release
5. **Disputed/conflicting?** Look for ConflictingReportsTag in the UI -> Check both cited sources
