# Data Catalog

## Data File to Section Mapping

| # | File | Size | Shape | Sections | Tier | Last Updated |
|---|------|------|-------|----------|------|--------------|
| 1 | consolidated-dashboard-data.json | 401KB | Array of 14 companies with quarterly_results[], annual_results[], balance_sheet, ratios | Executive, Financial, Watchlist, Operations | T1 | 2026-02-18 |
| 2 | screener-all-companies.json | 348KB | Tabular: { headers: string[], data: any[][] } with 15+ companies | Financial, Executive | T1 | 2026-02-18 |
| 3 | sovrenn-intelligence.json | 41KB | { deal_activity: [], growth_triggers: [], concall_highlights: [] } | Executive, Watchlist, Deals | T3 | 2026-02-17 |
| 4 | trendlyne-summary.json | 12KB | { extraction_summary: {}, company_financials: {} } | Executive, Market Pulse | T1/T2 | 2026-02-18 |
| 5 | financial-api-data.json | 36KB | { metrics: {}, performance_tiers: {}, quarterly_history: [] } | Financial | T1 | 2026-02-18 |
| 6 | company-ir-documents.json | 32KB | { companies: { [id]: { annual_reports: [], investor_presentations: [] } } } | Reference links | Reference | 2026-02-15 |
| 7 | deals-transactions-capital-movements.csv | 28KB | CSV with columns: date, company, type, counterparty, value, status | Deals | T2-T4 | 2026-02-17 |
| 8 | Per-company directories (amber/, bajaj/, etc.) | Varies | Company-specific JSON files with detailed metrics | All sections | T1 | Varies |

## Data Shape Details

### consolidated-dashboard-data.json
```
Array<{
  company_name: string
  company_id: string
  quarterly_results: { quarter: string, revenue: number, ebitda: number, ... }[]
  annual_results: { year: string, revenue: number, ... }[]
  balance_sheet: { ... }
  ratios: { roce: number, roe: number, de_ratio: number, ... }
}>
```

### screener-all-companies.json
```
{
  headers: ["Company Name", "Market Cap", "Revenue", "EBITDA Margin", ...]
  data: [["Voltas Ltd", 45200, 12300, 12.5, ...], ...]
}
```

### sovrenn-intelligence.json
```
{
  deal_activity: [{ company: string, type: string, details: string, date: string }]
  growth_triggers: [{ company: string, trigger: string, confidence: string }]
  concall_highlights: [{ company: string, quarter: string, highlights: string[] }]
}
```

## Company ID Normalization

Different data files refer to the same company using different identifiers. The `normalizeCompanyId()` function in `src/lib/company-matching.ts` maps all variants to canonical IDs.

| Canonical ID | Consolidated | Screener | Sovrenn | Trendlyne |
|-------------|-------------|----------|---------|-----------|
| voltas | voltas | Voltas Ltd | Voltas | VOLTAS |
| bluestar | bluestar | Blue Star Ltd | Blue Star Limited | BLUESTARCO |
| havells | havells | Havells India Ltd | Havells | HAVELLS |
| crompton | crompton | Crompton Greaves CE | Crompton | CROMPTON |
| amber | amber | Amber Enterprises | Amber Enterprises India | AMBER |
| dixon | dixon | Dixon Technologies | Dixon Technologies (India) | DIXON |
| symphony | symphony | Symphony Ltd | Symphony | SYMPHONY |
| bajaj | bajaj | Bajaj Electricals | Bajaj Electricals | BAJAJELEC |
| orient | orient | Orient Electric | Orient Electric Limited | ORIENTELEC |
| ttk | ttk | TTK Prestige Ltd | TTK Prestige | TTKPRESTIG |
| vguard | vguard | V-Guard Industries | V-Guard | VGUARD |
| whirlpool | whirlpool | Whirlpool India | Whirlpool of India | WHIRLPOOL |
| ifb | ifb | IFB Industries | IFB Industries | IFBIND |
| butterfly | butterfly | Butterfly Gandhimathi | Butterfly | BUTTERFLY |
| daikin | daikin | - | Daikin India | - |
| jch | jch | - | Johnson Controls-Hitachi | JCHAC |

The VARIANT_MAP in `company-matching.ts` contains 50+ variant mappings covering tickers, display names, and abbreviated forms.
