# Data Sources — Consumer Durables Intelligence

Detailed breakdown of recommended data sources for production deployment.

## 1. Financial Data (Listed Companies)

| Source | Data Available | Cost | Reliability |
|--------|---------------|------|-------------|
| **BSE/NSE APIs** | Quarterly financials, shareholding, corporate actions | Free (with limits) | High |
| **Screener.in API** | Financial ratios, historical data, peer comparison | ₹3,000-5,000/yr | High |
| **Trendlyne** | Analyst estimates, momentum, technicals | ₹5,000-15,000/yr | High |
| **CMIE Prowess** | Deep financials, industry data, time series | ₹50,000+/yr | Very High |
| **Capitaline/Ace Equity** | Comprehensive financial database | Enterprise pricing | Very High |
| **Company IR Websites** | Investor presentations, annual reports | Free | High |

### Recommended Approach
- **Primary**: BSE/NSE APIs for real-time financial data
- **Supplementary**: Screener.in for ratio analysis and historical trends
- **Deep Analysis**: CMIE Prowess for industry benchmarking (if budget allows)

## 2. Financial Data (Unlisted Companies)

| Source | Data Available | Cost | Reliability |
|--------|---------------|------|-------------|
| **MCA (Ministry of Corporate Affairs)** | Annual filings, board composition | Per-filing fee | High |
| **Tofler** | MCA filings aggregated, financial summaries | ₹10,000-30,000/yr | Medium-High |
| **Zaubacorp** | Basic financials, director info | Free (limited) | Medium |
| **PrivateCircle** | Unlisted company valuations, transactions | Enterprise pricing | Medium |

## 3. Deals & Transactions

| Source | Data Available | Cost | Reliability |
|--------|---------------|------|-------------|
| **VCCEdge** | M&A, PE/VC, IPO deals for India | ₹1-3 Lakh/yr | Very High |
| **Tracxn** | Startup/PE deals, company profiles | ₹50,000+/yr | High |
| **Crunchbase** | Global deal database | $29-49/mo | Medium |
| **PitchBook** | Comprehensive deal data | Enterprise pricing | Very High |
| **BSE/NSE Filings** | Open offers, block deals, bulk deals | Free | High |

### Recommended Approach
- **Primary**: VCCEdge for India-specific deal intelligence
- **Supplementary**: BSE/NSE filings for listed company transactions
- **Global Context**: Crunchbase for international deals

## 4. News & Sentiment

| Source | Data Available | Cost | Reliability |
|--------|---------------|------|-------------|
| **Google News API** | News aggregation, search | Free (limited) | High |
| **NewsAPI** | Multi-source news aggregation | Free tier + paid | High |
| **Twitter/X API** | Social sentiment, real-time signals | ₹8,000+/mo | Medium |
| **Meltwater/Cision** | Enterprise media monitoring | Enterprise pricing | Very High |
| **Economic Times API** | India business news | Custom pricing | High |

### Sentiment Analysis Approach
1. Aggregate news from 3-4 sources daily
2. Apply NLP sentiment scoring (can use Claude API)
3. Weight by source credibility and recency
4. Track 7-day and 30-day rolling averages

## 5. Operational Metrics

| Source | Data Available | Cost | Reliability |
|--------|---------------|------|-------------|
| **Company Annual Reports** | Capacity, plants, employees, strategy | Free | Very High |
| **Investor Presentations** | Quarterly operational updates | Free | Very High |
| **Industry Reports (CEAMA)** | Industry-wide operational benchmarks | Membership fee | High |
| **Frost & Sullivan** | Industry analysis, benchmarks | Enterprise pricing | Very High |
| **RoC Filings** | Factory locations, capacity declarations | Per-filing fee | High |

### Data Collection Strategy
- Automated scraping of investor presentations (quarterly)
- Annual report parsing for operational metrics
- Industry report subscription for benchmarking data

## 6. Channel & Distribution Data

| Source | Data Available | Cost | Reliability |
|--------|---------------|------|-------------|
| **Nielsen Retail Audit** | Channel-wise sales data, market share | Enterprise pricing | Very High |
| **Euromonitor** | Category size, channel mix, forecasts | Enterprise pricing | High |
| **RedSeer** | E-commerce specific data for India | Custom pricing | High |
| **Company Disclosures** | Direct channel data from quarterly calls | Free | High |

## 7. Pricing & Product Data

| Source | Data Available | Cost | Reliability |
|--------|---------------|------|-------------|
| **Amazon/Flipkart APIs** | Product pricing, reviews, ratings | Free (scraping) | High |
| **Price tracking tools** | Historical pricing data | ₹5,000-20,000/yr | High |
| **BEE (Bureau of Energy Efficiency)** | Energy ratings, product registrations | Free | Very High |
| **Company Websites** | Current product portfolio and pricing | Free | High |

## Data Refresh Frequency

| Data Type | Recommended Frequency |
|-----------|---------------------|
| Stock prices/market cap | Daily |
| News/sentiment | Daily |
| Financial results | Quarterly |
| Operational metrics | Quarterly |
| Deal activity | Weekly |
| Leadership changes | Weekly |
| Channel mix | Quarterly |
| Industry benchmarks | Semi-annually |

## Cost Estimates (Annual)

| Tier | Sources Included | Estimated Cost |
|------|-----------------|---------------|
| **Basic** | Free APIs + Screener + VCCEdge | ₹2-3 Lakh/yr |
| **Standard** | Basic + Trendlyne + News APIs + Tofler | ₹5-8 Lakh/yr |
| **Enterprise** | Standard + CMIE + Nielsen + Frost & Sullivan | ₹15-25 Lakh/yr |

## Data Quality Framework

For each data source, maintain:
1. **Freshness Score** — How recent is the data?
2. **Completeness Score** — Are all fields populated?
3. **Accuracy Score** — Cross-validated against other sources?
4. **Source Reliability** — Historical accuracy of the source

Apply confidence weighting when multiple sources disagree.
