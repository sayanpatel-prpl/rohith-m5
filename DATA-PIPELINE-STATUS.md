# Data Pipeline Status

**Last Updated:** February 16, 2026
**Status:** ✅ WORKING - Backend API serving real data from Sovrenn

---

## What's Built

### 1. Sovrenn Parser ✅
**File:** `scripts/data-pipeline/parse-sovrenn.mjs`

Extracts structured intelligence from Sovrenn markdown files:
- Company descriptions and client lists
- Quarterly financial results (revenue, profit, growth rates)
- Deal activity (M&A, investments, QIP, partnerships)
- Concall highlights with management commentary
- Key growth triggers
- Shareholding data

**Usage:**
```bash
node scripts/data-pipeline/parse-sovrenn.mjs
```

**Output:** `data-sources/extracted/sovrenn-intelligence.json`

### 2. Database Schema ✅
**File:** `database/schema.sql`

SQLite database with 6 tables:
- `companies` - Master company list
- `quarterly_results` - Financial metrics by quarter
- `deals` - Deal activity timeline
- `concall_highlights` - Management commentary
- `growth_triggers` - Key growth drivers
- `shareholding` - Institutional holdings

**Database:** `database/industry-landscape.db`

### 3. Import Script ✅
**File:** `scripts/data-pipeline/import-to-db.mjs`

Loads extracted JSON into SQLite database.

**Usage:**
```bash
node scripts/data-pipeline/import-to-db.mjs
```

### 4. Backend API ✅
**File:** `server/index.mjs`

Express server serving real data from database on port 3001.

**Start server:**
```bash
node server/index.mjs
```

**Available Endpoints:**
- `GET /api/health` - Health check
- `GET /api/companies` - All companies
- `GET /api/companies/:id/quarterly-results` - Quarterly results for a company
- `GET /api/companies/:id/deals` - Deals for a company
- `GET /api/companies/:id/growth-triggers` - Growth triggers for a company
- `GET /api/companies/:id/concalls` - Concall highlights for a company
- `GET /api/companies/:id/shareholding` - Shareholding for a company
- `GET /api/deals` - All deals across companies
- `GET /api/financial` - Aggregated financial data for Financial Performance section

---

## Current Data

**Companies with data:** 2
- ✅ **Amber Enterprises** - Full data (2 quarters, 17 deals, 1 concall, 4 growth triggers)
- ⚠️ **Bajaj Electricals** - Partial data (different format, needs parser update)

**Missing:** 14 companies (waiting for Sovrenn markdown files)

---

## Next Steps

### For You:
1. **Upload Sovrenn data** for the remaining 14 companies to their folders:
   - `data-sources/quarterly-reports/voltas/`
   - `data-sources/quarterly-reports/bluestar/`
   - `data-sources/quarterly-reports/havells/`
   - `data-sources/quarterly-reports/crompton/`
   - `data-sources/quarterly-reports/whirlpool/`
   - `data-sources/quarterly-reports/symphony/`
   - `data-sources/quarterly-reports/orient/`
   - `data-sources/quarterly-reports/vguard/`
   - `data-sources/quarterly-reports/ttk/`
   - `data-sources/quarterly-reports/butterfly/`
   - `data-sources/quarterly-reports/dixon/`
   - `data-sources/quarterly-reports/jch/`
   - `data-sources/quarterly-reports/daikin/`
   - `data-sources/quarterly-reports/ifb/`

2. **After uploading**, run these three commands:
   ```bash
   # 1. Extract data from markdown files
   node scripts/data-pipeline/parse-sovrenn.mjs

   # 2. Import into database
   node scripts/data-pipeline/import-to-db.mjs

   # 3. Restart API server (if not running)
   node server/index.mjs
   ```

### For Claude (Next):
1. **Fix Bajaj parser** - Handle different Sovrenn format
2. **Connect frontend to real API** - Update API client to use `http://localhost:3001` instead of mock data
3. **Add missing financial metrics** - Calculate EBITDA margin, ROCE, Working Capital Days from raw data
4. **Test with all 16 companies** once you upload their data

---

## How to Test

### Check what's in the database:
```bash
sqlite3 database/industry-landscape.db "SELECT name FROM companies;"
sqlite3 database/industry-landscape.db "SELECT company_id, quarter, sales_cr, sales_growth_yoy FROM quarterly_results;"
```

### Test API endpoints:
```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/companies
curl http://localhost:3001/api/financial
curl http://localhost:3001/api/deals
```

### Check parser output:
```bash
cat data-sources/extracted/sovrenn-intelligence.json | head -100
```

---

## Data Flow

```
Sovrenn .md files
    ↓
[Parser] parse-sovrenn.mjs
    ↓
sovrenn-intelligence.json
    ↓
[Import] import-to-db.mjs
    ↓
industry-landscape.db (SQLite)
    ↓
[API] server/index.mjs (Express)
    ↓
Frontend (React app on port 5173)
```

---

## Known Issues

1. **Bajaj format** - Different from Amber, parser needs update
2. **Missing financial metrics** - EBITDA margin, ROCE, Working Capital Days not calculated yet (using placeholder values)
3. **Company name extraction** - Sovrenn uses "Company" instead of actual name for Amber (needs manual fix or better parsing)
4. **Historical time-series** - Currently only latest quarter, need 6 quarters for trend charts

---

## Performance

- **Parser:** ~1 second for all companies
- **Import:** ~1 second for full dataset
- **API response time:** <10ms for most endpoints
- **Database size:** ~100KB (will grow to ~5-10MB with all 16 companies and 6 quarters each)

---

## Files Created

```
scripts/data-pipeline/
├── parse-sovrenn.mjs       # Sovrenn markdown parser
└── import-to-db.mjs        # Database import script

database/
├── schema.sql              # Database schema
└── industry-landscape.db   # SQLite database (auto-created)

server/
└── index.mjs               # Express API server

data-sources/
├── quarterly-reports/      # Raw Sovrenn markdown files
│   ├── amber/
│   │   └── Amber Enterprises.md
│   ├── bajaj/
│   │   └── Bajaj -14022026.md
│   └── [14 more folders waiting for data]
└── extracted/
    └── sovrenn-intelligence.json  # Parsed JSON output
```

---

**🚀 Ready to connect frontend once all 16 companies' data is uploaded!**
