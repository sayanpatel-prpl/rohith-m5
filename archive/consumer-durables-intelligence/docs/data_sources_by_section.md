# Data Sources by Dashboard Section
## Consumer Durables Intelligence Dashboard

This document maps specific data sources to each of the 10 sections in your dashboard frontend.

---

## Section 1: Cover & Executive Snapshot

### What You Need:
- Month in 5 Bullets (financial shifts, operational signals)
- Big Themes Emerging
- Red Flags / Watchlist

### Data Sources:

#### Financial Data (for bullets)
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **BSE/NSE** | Quarterly results, revenue/margin trends | Quarterly | Free |
| **Screener.in** | Quick financial ratios, QoQ changes | Real-time | ₹3,600/year |
| **MoneyControl** | Quick market updates, company news | Daily | Free |

#### Operational Signals
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **Company Investor Presentations** | Management commentary on capacity, expansion | Quarterly | Free |
| **CEAMA Reports** | Industry-wide demand trends | Quarterly | Member access |
| **Economic Times** | Plant expansion, production news | Daily | Free |

#### Red Flags
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **Tofler** | Director resignations, auditor changes | Real-time | ₹5,999/year |
| **MCA21** | Delayed filings, statutory notices | Weekly check | Free |
| **BSE Corporate Announcements** | Defaults, regulatory actions | Real-time | Free |

#### Big Themes (Auto-Generated)
- Use AI to analyze: News aggregation + Financial trends + Deal activity
- Sources: Combine data from NewsAPI + Screener + VCCEdge

---

## Section 2: Market Pulse – Consumer Durables

### What You Need:
- Demand Signals (Volume vs Price growth)
- Input Cost Trends
- Margin Outlook
- Channel Mix Shifts

### Data Sources:

#### Demand Signals
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **CEAMA (Consumer Electronics and Appliances Manufacturers Association)** | Industry volume data, market size | Quarterly | Member reports |
| **IBEF (India Brand Equity Foundation)** | Sector growth rates, consumption trends | Annual/Quarterly | Free |
| **Company Results** | Revenue growth, volume vs price mix (if disclosed) | Quarterly | Free (BSE/NSE) |
| **GfK India** | Retail sales tracking, volume data | Monthly | Very expensive |
| **Nielsen** | Category-wise sales volume | Monthly | Very expensive |

#### Input Cost Trends
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **Metal Bulletin / Fastmarkets** | Aluminum, copper, steel prices | Daily | Subscription |
| **Polymer Price Index** | Plastics (ABS, PP, HDPE) pricing | Weekly | Varies |
| **PPAC (Petroleum Planning & Analysis Cell)** | Logistics cost proxy (diesel prices) | Daily | Free |
| **Company Annual Reports** | Raw material cost as % of sales (historical) | Annual | Free |

#### Margin Outlook
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **Screener.in** | Gross margin trends across companies | Quarterly | ₹3,600/year |
| **Trendlyne** | Operating margin forecasts | Quarterly | Free basic |
| **Analyst Reports** | Margin guidance and outlook | Quarterly | Expensive |

#### Channel Mix Shifts
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **Company Investor Presentations** | GT vs MT vs Online split (when disclosed) | Quarterly | Free |
| **RedSeer Consulting** | E-commerce penetration data | Quarterly reports | Some free |
| **Amazon/Flipkart Seller Data** | Online sales proxies (manual tracking) | Monthly | Free (manual) |
| **CEAMA** | Channel-wise industry trends | Annual | Member reports |

---

## Section 3: Financial Performance Tracker (Company-Level)

### What You Need:
- Revenue Growth (YoY / QoQ)
- EBITDA Margin
- Working Capital Days
- Inventory Days
- Net Debt / EBITDA
- Capex Intensity
- ROCE Trend

### Data Sources:

#### For Listed Companies (Primary Source)
| Source | Metrics Available | Update Frequency | Cost |
|--------|-------------------|------------------|------|
| **BSE/NSE** | Revenue, EBITDA, PAT, Debt, Equity | Quarterly | Free |
| **Screener.in** | All ratios pre-calculated, 10-year history | Real-time | ₹3,600/year |
| **Trendlyne** | Financial ratios, peer comparison | Daily | Free basic |
| **MoneyControl** | Quarterly results, ratio analysis | Quarterly | Free |
| **CMIE Prowess** | Comprehensive financials, custom ratios | Quarterly | ₹2-5L/year |

**Best Approach for Listed Companies:**
- Primary: **Screener.in** (easiest, all ratios ready)
- Backup: **BSE/NSE** (official source)
- Deep analysis: **CMIE Prowess** (if budget allows)

#### For Unlisted Companies
| Source | Metrics Available | Update Frequency | Cost |
|--------|-------------------|------------------|------|
| **Tofler** | Annual financials from MCA | 6-12 month lag | ₹14,999/year |
| **MCA21** | Annual filings (Balance Sheet, P&L) | Annual | ₹50-500 per doc |
| **CMIE Prowess** | Financials for 40,000+ companies | Annual/Quarterly | ₹2-5L/year |

**Calculation Required:**
You'll need to calculate ratios from raw data:
- Working Capital Days = (Current Assets - Current Liabilities) / (Revenue/365)
- Inventory Days = Inventory / (COGS/365)
- ROCE = EBIT / Capital Employed
- Capex Intensity = Capex / Revenue

#### Variance Analysis & Tagging
- Compare each company's metrics vs:
  - Their own last quarter (QoQ)
  - Same quarter last year (YoY)
  - Sector median (calculate from all 10 companies)
- Auto-tag as: **Outperform** (top 3), **Inline** (middle 4), **Underperform** (bottom 3)

---

## Section 4: Deals, Transactions & Capital Movements

### What You Need:
- M&A (majority & minority)
- PE/VC investments
- Strategic stake sales
- Fund raises, IPO filings, QIPs
- Distressed asset activity

### Data Sources:

#### Comprehensive Deal Databases
| Source | Coverage | Update Frequency | Cost |
|--------|----------|------------------|------|
| **VCCEdge** | PE/VC deals, M&A, valuations, buyer profiles | Real-time | ₹30K-1L/year |
| **Venture Intelligence** | PE, M&A, deal multiples | Real-time | Subscription |
| **Tracxn** | Startup funding, company profiles | Real-time | Expensive |

**Best for PoC:** VCCEdge (most comprehensive for Indian market)

#### Free/Low-Cost Alternatives
| Source | Coverage | Update Frequency | Cost |
|--------|----------|------------------|------|
| **SEBI Filings** | IPO filings, QIPs, stake changes >1% | Real-time | Free |
| **BSE Corporate Announcements** | M&A announcements, fundraises | Real-time | Free |
| **Economic Times Deals Section** | Major deal announcements | Daily | Free |
| **Inc42** | Startup/tech deals | Daily | Free basic |
| **VCCircle (website)** | Deal news (limited free access) | Daily | Free basic |

#### Strategic Rationale (AI-Interpreted)
- **Source**: Combine deal announcement text + company strategy docs
- Extract from: Press releases, management quotes in news articles
- Use: NewsAPI to aggregate announcements, then AI to summarize rationale

#### Deal Details to Track:
For each deal, capture:
```
- Company name
- Sub-segment (White Goods, Electronics, etc.)
- Deal type (M&A, PE, VC, Strategic)
- Deal size (₹ Cr)
- Valuation multiple (if disclosed): EV/EBITDA, P/E
- Buyer/Investor name and profile
- Strategic rationale (AI-extracted from press release)
- Date
- Source URL
```

---

## Section 5: Operational Intelligence & Efficiency Signals

### What You Need:
- Supply Chain (localization, logistics costs)
- Manufacturing (capacity, contract manufacturing)
- Procurement (vendor consolidation, cost initiatives)
- Retail Operations (store expansion, same-store sales)

### Data Sources:

#### Supply Chain Data
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **DGFT (Directorate General of Foreign Trade)** | Import data by HS code | Monthly | Free basic |
| **Company Annual Reports** | Import dependency disclosures | Annual | Free |
| **Zauba / Import Genius** | Company-specific import data | Monthly | Paid subscription |
| **PPAC** | Logistics cost proxy (fuel prices) | Daily | Free |

#### Manufacturing Data
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **Company Investor Presentations** | Plant capacity, utilization %, expansions | Quarterly | Free |
| **Annual Reports** | Manufacturing facilities, capacity additions | Annual | Free |
| **Economic Times / News** | Plant expansion announcements, closures | Real-time | Free |
| **Ministry of Electronics & IT** | PLI beneficiaries, approved capacities | Updated | Free |

#### Procurement Data
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **Annual Reports** | Related party transactions (contract manufacturing) | Annual | Free |
| **Tofler** | Vendor relationships (from director networks) | Real-time | ₹14,999/year |
| **Company Presentations** | Cost reduction initiatives mentioned | Quarterly | Free |

#### Retail Operations
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **Company Investor Presentations** | Store count, expansion plans | Quarterly | Free |
| **Annual Reports** | Store productivity metrics (sometimes disclosed) | Annual | Free |
| **Economic Times Retail Section** | Store opening/closing announcements | Daily | Free |
| **LinkedIn Company Pages** | Employee count by location (proxy for expansion) | Monthly check | Free |

#### Key Metrics to Calculate:
```
- Inventory Turnover = COGS / Average Inventory
- Logistics Cost % = (from annual report notes)
- Capex per Store = Total Capex / # of new stores
- Import Dependency % = Imports / Total Raw Material Cost
```

---

## Section 6: Leadership, Org & Governance Watch

### What You Need:
- CEO/CXO changes
- Board reshuffles
- Promoter stake changes
- Auditor resignations
- Governance red flags

### Data Sources:

#### Leadership Changes
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **BSE/NSE Corporate Announcements** | CEO/CFO/Director appointments & resignations | Real-time | Free |
| **Tofler** | Director appointments, DIN status | Real-time | ₹14,999/year |
| **MCA21** | Director appointments/resignations (official) | Real-time | Free |
| **LinkedIn** | Job changes, C-suite movements | Weekly monitoring | Free |
| **Economic Times** | Major appointment news | Daily | Free |

#### Board & Governance
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **BSE/NSE Announcements** | Board meeting outcomes, committee changes | Real-time | Free |
| **SEBI Filings** | Related party transactions, corporate governance report | Quarterly/Annual | Free |
| **Annual Reports** | Board composition, committee details | Annual | Free |

#### Promoter Stake Changes
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **BSE/NSE Shareholding Pattern** | Promoter holding % changes | Quarterly | Free |
| **SEBI** | Bulk/block deals, open market purchases | Daily | Free |
| **Screener.in** | Promoter pledge data, historical trends | Real-time | ₹3,600/year |

#### Governance Red Flags
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **SEBI Orders** | Regulatory actions, penalties | As issued | Free |
| **MCA21** | Delayed filings, strike-off notices | Monthly check | Free |
| **Annual Reports** | Auditor qualifications, related party issues | Annual | Free |
| **News Monitoring** | Investigations, legal issues | Daily | Free (NewsAPI) |

#### AI Flags to Generate:
Based on patterns:
- Multiple CXO exits in 12 months → "Execution risk increasing"
- Promoter stake down >5% in 6 months → "Promoter exit probability – medium"
- Auditor resignation + delayed filing → "Governance concern – high"
- Professional CEO hired (from MNC) → "Professionalization phase likely"

---

## Section 7: Competitive Moves & Strategic Bets

### What You Need:
- New product launches
- Private label strategies
- Pricing wars/premiumization
- Digital/D2C initiatives
- Partnerships with quick commerce/marketplaces

### Data Sources:

#### Product Launches
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **Company Press Releases** | New product announcements | Real-time | Free |
| **Company Websites** | Product catalog updates | Monthly check | Free |
| **Economic Times / Business Standard** | Launch coverage | Daily | Free |
| **Amazon/Flipkart** | New product listings | Weekly check | Free (manual) |
| **YouTube** | Product launch videos, demos | Weekly | Free |

#### Pricing & Strategy
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **Amazon/Flipkart/Croma** | Pricing data, discounts | Weekly scraping | Free (manual) or scraping API |
| **Company Investor Presentations** | ASP (Average Selling Price) trends | Quarterly | Free |
| **GfK** | Market pricing trends | Monthly | Very expensive |

#### Digital & D2C Initiatives
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **Company Websites** | D2C platform launches | Monthly check | Free |
| **SimilarWeb** | Website traffic trends | Monthly | Free basic |
| **App Annie / Sensor Tower** | Mobile app downloads | Monthly | Paid |
| **Economic Times Tech** | D2C announcements | Daily | Free |

#### Partnerships & Collaborations
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **BSE/NSE Announcements** | Material contracts, partnerships | Real-time | Free |
| **Company Press Releases** | Marketplace partnerships, tie-ups | Real-time | Free |
| **Blinkit/Swiggy Instamart** | Quick commerce availability | Weekly check | Free (manual) |
| **News** | Strategic partnership announcements | Daily | Free (NewsAPI) |

#### Pattern Detection:
Track across all 10 companies:
- Who launched in premium segment? → "Premiumization trend"
- Who expanded to quick commerce? → "Quick commerce push"
- Who increased discounting? → "Pricing pressure"
- Similar features across brands? → "Copy-cat behavior"

---

## Section 8: Sub-Sector Deep Dive (Rotating Monthly)

### Focus for PoC: Home Appliances

### What You Need:
- Cost structure benchmark
- Margin levers
- Scale vs profitability trade-offs
- Top quartile performer analysis

### Data Sources:

#### Cost Structure
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **Annual Reports (Notes to Accounts)** | COGS breakdown, employee costs, other expenses | Annual | Free |
| **CEAMA Industry Reports** | Industry average cost structures | Annual | Member reports |
| **Company Investor Presentations** | Cost reduction initiatives, margin drivers | Quarterly | Free |

#### Benchmarking
| Source | What to Extract | Frequency | Cost |
|--------|----------------|-----------|------|
| **Screener.in** | Compare all metrics across companies | Real-time | ₹3,600/year |
| **CMIE Prowess** | Industry benchmarks, percentile rankings | Quarterly | ₹2-5L/year |
| **Trendlyne** | Peer comparison charts | Real-time | Free basic |

#### Deep Analysis
For PoC, manually analyze:
1. **Top Quartile** (e.g., Voltas, Blue Star): What makes them better?
   - Higher ROCE? Better working capital? Premium mix?
2. **Median** (e.g., IFB, Symphony): What holds them back?
3. **Bottom Quartile**: What are the stress points?

Sources:
- Annual reports for detailed notes
- Concall transcripts for management commentary
- Screener for quick ratio comparison

---

## Section 9: "What This Means For..." Section

### Tailored Insights for Different Stakeholders

This section is **AI-generated** based on data from all previous sections.

### Input Data Sources:
- Financial performance (Section 3)
- Deals & transactions (Section 4)
- Operational intelligence (Section 5)
- Competitive moves (Section 7)
- Red flags (Section 1, 6)

### Generation Logic:

#### For PE/Investors:
**Template**: "Company X shows [metric trend] + [operational signal] → [investment thesis]"

Example:
- Input: Voltas showing inventory buildup + margin compression
- Output: "Voltas: Short-term margin pressure but market leader in AC segment. Wait for inventory correction before entry."

#### For Founders/Promoters:
**Template**: "Competitive landscape shows [trend] → [strategic implication] for your positioning"

Example:
- Input: Multiple competitors launching in premium segment
- Output: "Premiumization wave ongoing. Consider brand repositioning or acquisitions to play in high-margin segment."

#### For COOs/CFOs:
**Template**: "Operational efficiency gap identified: [specific metric] → [action item]"

Example:
- Input: Company has 85 inventory days vs sector average of 65
- Output: "Working capital optimization opportunity: Reducing inventory to sector average would release ₹50 Cr cash."

#### For Procurement & Supply Chain Heads:
**Template**: "[Input cost trend] + [localization opportunity] → [action]"

Example:
- Input: Aluminum prices up 15% + PLI incentives available
- Output: "Explore localization of compressor manufacturing to benefit from PLI and hedge forex risk."

---

## Section 10: Watchlist & Forward Indicators (Next 90 Days)

### What You Need:
- Likely fundraises
- Margin inflection candidates
- Potential consolidation targets
- Stress indicators

### Data Sources:

#### Predictive Signals (AI-Generated)
**Input**: Combine multiple data points to predict outcomes

##### Likely Fundraises
Signals:
- Debt/EBITDA >3x (from Section 3)
- Negative operating cash flow (from financial data)
- Promoter stake dilution trend (from Section 6)
- Expansion capex announced (from Section 5)

**Data Sources**:
- Screener.in (financial metrics)
- BSE shareholding (promoter stake)
- News (expansion announcements)

##### Margin Inflection Candidates
Signals:
- Input costs declining (from Section 2)
- Capacity utilization improving (from Section 5)
- Premium product launches (from Section 7)
- Operational efficiency initiatives (from management commentary)

**Data Sources**:
- Commodity prices (Metal Bulletin, Polymer Index)
- Company presentations
- Product launch tracking

##### Consolidation Targets
Signals:
- Below-median ROCE + high debt (stressed but good assets)
- Promoter stake reducing (exit interest)
- Family succession issues (from governance tracking)
- Sub-scale operations (small revenue in competitive segment)

**Data Sources**:
- Financial ratios (Screener)
- Promoter stake trends (BSE)
- News on family disputes (NewsAPI)

##### Stress Indicators
Track these red flags:
- Working capital >100 days (cash crunch)
- Interest coverage <2x (debt stress)
- Consecutive quarters of margin decline
- Inventory/receivables spiking
- Auditor/CFO resignation
- Delayed regulatory filings

**Data Sources**:
- Financial metrics (Screener, BSE)
- Governance tracking (MCA, SEBI)
- News monitoring (NewsAPI)

#### News Velocity Tracking
Count mentions of each company in news:
- Sudden spike in news mentions → Something brewing
- Negative sentiment increase → Stress possible

**Source**: NewsAPI with sentiment analysis

#### Management Commentary Sentiment
Analyze earnings call transcripts:
- Increasingly cautious language? → Concern
- Optimistic guidance? → Positive outlook

**Source**:
- Company websites (concall transcripts)
- BSE/NSE (presentations)
- AI sentiment analysis on text

---

## 🎯 Implementation Priority by Budget

### Budget Tier 1: Bootstrap (₹50,000/year)
**Essential sources only:**

| Section | Primary Source | Cost |
|---------|---------------|------|
| 1-3 (Executive + Market + Financials) | Screener.in | ₹3,600 |
| 4 (Deals) | BSE + ET (free) + VCCEdge basic | ₹30,000 |
| 5-7 (Ops + Governance + Competitive) | Company reports + News (free) | Free |
| 8-10 (Analysis sections) | AI-generated from above data | Free |
| News aggregation | NewsAPI.org | ₹449/month = ₹5,400 |

**Total: ~₹40,000/year**

### Budget Tier 2: Professional (₹2-3 Lakhs/year)
Add:
- CMIE Prowess (₹2L) - comprehensive financials
- Tofler Premium (₹15K) - unlisted companies + governance
- VCCEdge full (₹50K) - complete deal intelligence

**Total: ~₹2.7L/year**

### Budget Tier 3: Enterprise (₹10+ Lakhs/year)
Add:
- Capital IQ (₹8-10L) - global deal intelligence
- Nielsen/GfK (₹3-5L) - market data
- Bloomberg Terminal (₹20L+) - if needed for global comparisons

---

## 📊 Data Collection Workflow for PoC

Since you're doing a PoC with dummy data, here's the workflow to make it realistic:

### Step 1: Get Basic Financial Data (Free)
1. Visit Screener.in (even without subscription, you can view basic data)
2. For each of 10 companies, note down (latest quarter):
   - Revenue, EBITDA margin, PAT
   - Debt, working capital
   - Basic ratios

### Step 2: Get Recent News (Free)
1. Google News search for each company (past 3 months)
2. Note: Product launches, expansions, CXO changes
3. This gives you events for Sections 4, 6, 7

### Step 3: Use Company Websites (Free)
1. Investor presentations (quarterly)
2. Press releases
3. Annual reports

### Step 4: Generate Realistic Dummy Data
Based on patterns from real data:
- Apply realistic growth rates (5-20% range)
- Add seasonality (Q3 higher than Q2)
- Create variance (some companies doing better than others)
- Include 1-2 stress cases (declining margins, rising debt)

### Step 5: AI-Generate Insights
Use the dummy data to:
- Auto-generate Section 1 bullets
- Create Section 9 stakeholder insights
- Generate Section 10 forward indicators

---

## 🔄 Update Frequency by Section

| Section | Ideal Update | PoC Approach |
|---------|--------------|--------------|
| 1. Executive Snapshot | Monthly | Use latest quarter data |
| 2. Market Pulse | Monthly | Quarterly data + monthly commodity prices |
| 3. Financial Tracker | Quarterly | Quarterly results |
| 4. Deals | Real-time | Past 6 months of deals (manually researched) |
| 5. Operational Intelligence | Quarterly | Annual report + quarterly commentary |
| 6. Leadership & Governance | Real-time | Past 12 months of changes |
| 7. Competitive Moves | Monthly | Past 6 months of launches/initiatives |
| 8. Sub-Sector Deep Dive | Quarterly refresh | One-time analysis for PoC |
| 9. What This Means For | Monthly | AI-generated from other sections |
| 10. Watchlist | Monthly | Based on latest data trends |

---

## 📝 Summary: Minimum Data Needed for PoC

To build a convincing PoC, you need:

### Must Have (Core Data):
1. ✅ **Financial metrics** for 10 companies (3-4 quarters): Screener.in free tier
2. ✅ **2-3 recent deals** (2023-25): BSE announcements + Economic Times
3. ✅ **Basic company info**: Annual reports (free from company websites)
4. ✅ **Recent news** (past 6 months): Google News search

### Nice to Have (Enhanced):
5. ⭐ Screener.in premium (₹3,600) - much easier data extraction
6. ⭐ 1-2 industry reports from IBEF (free)
7. ⭐ Commodity price trends (free from various sources)

### AI-Generated:
8. 🤖 Insights and analysis (Sections 1, 9, 10)
9. 🤖 Pattern detection and themes

**Time Investment**: 2-3 days of manual research can give you enough real data points to create highly realistic dummy data for the PoC.

---

**This structure ensures your data sourcing directly maps to your frontend sections, making it easy to know exactly what to collect for each part of the dashboard!**
