# Data Sources Directory

This directory contains raw data sources that will be processed to populate the Kompete - Industry Intel platform.

## Structure

```
data-sources/
├── quarterly-reports/          # Company quarterly/annual reports (PDFs, Excel)
│   ├── voltas/                 # Voltas Limited
│   ├── bluestar/               # Blue Star Limited
│   ├── havells/                # Havells India Limited
│   ├── crompton/               # Crompton Greaves Consumer Electricals
│   ├── whirlpool/              # Whirlpool of India Limited
│   ├── symphony/               # Symphony Limited
│   ├── orient/                 # Orient Electric Limited
│   ├── bajaj/                  # Bajaj Electricals Limited
│   ├── vguard/                 # V-Guard Industries Limited
│   ├── ttk/                    # TTK Prestige Limited
│   ├── butterfly/              # Butterfly Gandhimathi Appliances
│   ├── amber/                  # Amber Enterprises India Limited
│   ├── dixon/                  # Dixon Technologies (India) Limited
│   ├── jch/                    # Johnson Controls-Hitachi Air Conditioning
│   ├── daikin/                 # Daikin Airconditioning India
│   └── ifb/                    # IFB Industries Limited
├── news-articles/              # News clippings, press releases (coming soon)
├── deal-activity/              # M&A, PE/VC, IPO documents (coming soon)
└── leadership-changes/         # Leadership announcements (coming soon)
```

## Quarterly Reports - What to Upload

For each company folder, please add quarterly/annual financial reports:

### File Naming Convention
```
{COMPANY_ID}_{QUARTER}_{FY}.pdf
```

**Examples:**
- `voltas_Q3_FY25.pdf` - Voltas Q3 FY2025 results
- `havells_Q2_FY25.pdf` - Havells Q2 FY2025 results
- `bluestar_Q4_FY24.pdf` - Blue Star Q4 FY2024 results
- `symphony_Annual_FY24.pdf` - Symphony Annual Report FY2024

### What We Need from Each Report

The extraction script will look for these key financial metrics:

**Income Statement:**
- Revenue (Net Sales)
- EBITDA
- EBIT
- Net Profit

**Balance Sheet:**
- Total Assets
- Total Debt
- Shareholders' Equity
- Current Assets
- Current Liabilities

**Cash Flow:**
- Operating Cash Flow
- Free Cash Flow
- Capex

**Key Ratios (if not stated, we'll calculate):**
- Revenue Growth (YoY, QoQ)
- EBITDA Margin
- Working Capital Days
- ROCE (Return on Capital Employed)
- Debt/Equity Ratio

### Ideal Coverage

We need **6 quarters** of data for time-series charts:
- Q2 FY24, Q3 FY24, Q4 FY24
- Q1 FY25, Q2 FY25, Q3 FY25

If you have more recent quarters, even better!

### Supported File Formats

- ✅ **PDF** - Quarterly result PDFs from BSE/NSE
- ✅ **Excel/CSV** - Investor presentations with data tables
- ✅ **HTML** - BSE/NSE filing pages (saved as HTML)

## Next Steps

Once you've uploaded the quarterly reports:

1. Run the extraction script: `npm run extract-financials`
2. Review extracted data in `data-sources/extracted/financials.json`
3. Run the import script: `npm run import-financials`
4. Data will populate the database

## Notes

- PDFs must be text-based (not scanned images) for extraction to work
- If extraction fails, we'll build a manual CSV import tool as fallback
- Claude Code will handle all the parsing/extraction logic
