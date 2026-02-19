/**
 * Consolidate All Data Sources into SQLite Database
 *
 * Merges data from:
 *   1. Sovrenn Intelligence (existing quarterly results, deals, concalls, growth triggers)
 *   2. Screener.in (full P&L, Balance Sheet, Cash Flow, Ratios, Shareholding)
 *   3. Trendlyne (key ratios, EBITDA, earnings summaries)
 *
 * Updates:
 *   - quarterly_results with real EBITDA margins from Screener
 *   - companies table with ticker, sub_sector
 *   - shareholding table with Screener shareholding data
 *   - New: financial_metrics table for Balance Sheet / Cash Flow / Ratios
 */

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const DB_PATH = path.join(ROOT, 'database', 'industry-landscape.db');
const EXTRACTED_DIR = path.join(ROOT, 'data-sources', 'extracted');

const COMPANIES = [
  'voltas', 'bluestar', 'havells', 'crompton', 'whirlpool',
  'symphony', 'orient', 'bajaj', 'vguard', 'ttk',
  'butterfly', 'amber', 'dixon', 'ifb'
];

const TICKER_MAP = {
  voltas: 'VOLTAS', bluestar: 'BLUESTARCO', havells: 'HAVELLS',
  crompton: 'CROMPTON', whirlpool: 'WHIRLPOOL', symphony: 'SYMPHONY',
  orient: 'ORIENTELEC', bajaj: 'BAJAJELEC', vguard: 'VGUARD',
  ttk: 'TTKPRESTIG', butterfly: 'BUTTERFLY', amber: 'AMBER',
  dixon: 'DIXON', ifb: 'IFBIND'
};

function parseNum(val) {
  if (!val || val === '' || val === 'None') return null;
  const cleaned = String(val).replace(/,/g, '').replace(/%/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

// Map Screener quarter header to a standard quarter label
// e.g., "Dec 2025" -> "Q3 FY2026", "Mar 2025" -> "Q4 FY2025"
function screenerQuarterToFY(header) {
  const [month, year] = header.split(' ');
  const y = parseInt(year);
  const map = {
    'Jun': { q: 'Q1', fy: y + 1 },
    'Sep': { q: 'Q2', fy: y + 1 },
    'Dec': { q: 'Q3', fy: y + 1 },
    'Mar': { q: 'Q4', fy: y },
  };
  const m = map[month];
  if (!m) return header;
  return `${m.q} FY${m.fy}`;
}

function getRowByLabel(data, label) {
  return data.find(r => r.col_0 && r.col_0.replace(/\s*\+\s*$/, '').trim() === label);
}

async function initDB() {
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });

  // Add new columns if they don't exist
  const columns = await db.all(`PRAGMA table_info(quarterly_results)`);
  const colNames = columns.map(c => c.name);

  if (!colNames.includes('operating_profit_cr'))
    await db.run('ALTER TABLE quarterly_results ADD COLUMN operating_profit_cr REAL');
  if (!colNames.includes('opm_pct'))
    await db.run('ALTER TABLE quarterly_results ADD COLUMN opm_pct REAL');
  if (!colNames.includes('other_income_cr'))
    await db.run('ALTER TABLE quarterly_results ADD COLUMN other_income_cr REAL');
  if (!colNames.includes('interest_cr'))
    await db.run('ALTER TABLE quarterly_results ADD COLUMN interest_cr REAL');
  if (!colNames.includes('depreciation_cr'))
    await db.run('ALTER TABLE quarterly_results ADD COLUMN depreciation_cr REAL');
  if (!colNames.includes('pbt_cr'))
    await db.run('ALTER TABLE quarterly_results ADD COLUMN pbt_cr REAL');
  if (!colNames.includes('tax_pct'))
    await db.run('ALTER TABLE quarterly_results ADD COLUMN tax_pct REAL');
  if (!colNames.includes('eps'))
    await db.run('ALTER TABLE quarterly_results ADD COLUMN eps REAL');

  // Create financial_metrics table for annual + ratio data
  await db.exec(`
    CREATE TABLE IF NOT EXISTS financial_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id TEXT NOT NULL,
      period TEXT NOT NULL,
      metric_type TEXT NOT NULL,
      metric_name TEXT NOT NULL,
      value REAL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id),
      UNIQUE(company_id, period, metric_type, metric_name)
    );
    CREATE INDEX IF NOT EXISTS idx_financial_metrics_company ON financial_metrics(company_id);
    CREATE INDEX IF NOT EXISTS idx_financial_metrics_period ON financial_metrics(period);

    CREATE TABLE IF NOT EXISTS company_overview (
      company_id TEXT PRIMARY KEY,
      ticker TEXT,
      bse_symbol TEXT,
      market_cap_cr REAL,
      current_price REAL,
      pe_ratio REAL,
      book_value REAL,
      dividend_yield REAL,
      roce REAL,
      roe REAL,
      face_value REAL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    );
  `);

  console.log('✓ Database schema updated');
  return db;
}

async function enrichQuarterlyResults(db, companyId, screenerData) {
  const qr = screenerData.quarterly_results;
  if (!qr || !qr.headers || !qr.data) return 0;

  const headers = qr.headers.filter(h => h !== '');
  const salesRow = getRowByLabel(qr.data, 'Sales');
  const expensesRow = getRowByLabel(qr.data, 'Expenses');
  const opProfitRow = getRowByLabel(qr.data, 'Operating Profit');
  const opmRow = getRowByLabel(qr.data, 'OPM %');
  const otherIncRow = getRowByLabel(qr.data, 'Other Income');
  const interestRow = getRowByLabel(qr.data, 'Interest');
  const depRow = getRowByLabel(qr.data, 'Depreciation');
  const pbtRow = getRowByLabel(qr.data, 'Profit before tax');
  const taxRow = getRowByLabel(qr.data, 'Tax %');
  const npRow = getRowByLabel(qr.data, 'Net Profit');
  const epsRow = getRowByLabel(qr.data, 'EPS in Rs');

  let updated = 0;

  for (const header of headers) {
    const quarter = screenerQuarterToFY(header);
    const sales = parseNum(salesRow?.[header]);
    const opProfit = parseNum(opProfitRow?.[header]);
    const opm = parseNum(opmRow?.[header]);
    const otherIncome = parseNum(otherIncRow?.[header]);
    const interest = parseNum(interestRow?.[header]);
    const dep = parseNum(depRow?.[header]);
    const pbt = parseNum(pbtRow?.[header]);
    const tax = parseNum(taxRow?.[header]);
    const np = parseNum(npRow?.[header]);
    const eps = parseNum(epsRow?.[header]);

    // Calculate EBITDA = Operating Profit + Depreciation
    const ebitda = (opProfit !== null && dep !== null) ? opProfit + dep : null;
    const ebitdaMargin = (ebitda !== null && sales !== null && sales > 0)
      ? parseFloat((ebitda / sales * 100).toFixed(2)) : null;

    // Try to update existing row first
    const existing = await db.get(
      `SELECT id FROM quarterly_results WHERE company_id = ? AND quarter = ?`,
      [companyId, quarter]
    );

    if (existing) {
      await db.run(`
        UPDATE quarterly_results SET
          ebitda_margin = COALESCE(?, ebitda_margin),
          operating_profit_cr = ?,
          opm_pct = ?,
          other_income_cr = ?,
          interest_cr = ?,
          depreciation_cr = ?,
          pbt_cr = ?,
          tax_pct = ?,
          eps = ?
        WHERE id = ?
      `, [ebitdaMargin, opProfit, opm, otherIncome, interest, dep, pbt, tax, eps, existing.id]);
      updated++;
    } else {
      // Insert new row with Screener data
      // Calculate YoY growth if we have previous year data
      const prevHeader = getPreviousYearHeader(header, headers);
      const prevSales = prevHeader ? parseNum(salesRow?.[prevHeader]) : null;
      const prevNP = prevHeader ? parseNum(npRow?.[prevHeader]) : null;
      const salesGrowthYoY = (sales !== null && prevSales !== null && prevSales > 0)
        ? parseFloat(((sales - prevSales) / prevSales * 100).toFixed(1)) : null;
      const profitGrowthYoY = (np !== null && prevNP !== null && prevNP > 0)
        ? parseFloat(((np - prevNP) / prevNP * 100).toFixed(1)) : null;

      // Determine tag
      let tag = null;
      if (salesGrowthYoY !== null && profitGrowthYoY !== null) {
        if (salesGrowthYoY > 20 && profitGrowthYoY > 20) tag = 'EXCELLENT RESULTS';
        else if (salesGrowthYoY > 5 && profitGrowthYoY > 5) tag = 'GOOD RESULTS';
        else if (salesGrowthYoY < -5 || profitGrowthYoY < -10) tag = 'WEAK RESULTS';
      }

      await db.run(`
        INSERT OR IGNORE INTO quarterly_results
        (company_id, date, quarter, sales_cr, sales_growth_yoy, net_profit_cr, profit_growth_yoy,
         ebitda_margin, operating_profit_cr, opm_pct, other_income_cr, interest_cr,
         depreciation_cr, pbt_cr, tax_pct, eps, tag)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [companyId, header, quarter, sales, salesGrowthYoY, np, profitGrowthYoY,
          ebitdaMargin, opProfit, opm, otherIncome, interest, dep, pbt, tax, eps, tag]);
      updated++;
    }
  }

  return updated;
}

function getPreviousYearHeader(header, allHeaders) {
  const [month, year] = header.split(' ');
  const prevYear = String(parseInt(year) - 1);
  const prevHeader = `${month} ${prevYear}`;
  return allHeaders.includes(prevHeader) ? prevHeader : null;
}

async function importBalanceSheet(db, companyId, screenerData) {
  const bs = screenerData.balance_sheet;
  if (!bs || !bs.headers || !bs.data) return 0;

  const headers = bs.headers.filter(h => h !== '');
  let count = 0;

  for (const row of bs.data) {
    const metricName = row.col_0?.replace(/\s*\+\s*$/, '').trim();
    if (!metricName) continue;

    for (const period of headers) {
      const value = parseNum(row[period]);
      if (value === null) continue;

      await db.run(`
        INSERT OR REPLACE INTO financial_metrics (company_id, period, metric_type, metric_name, value)
        VALUES (?, ?, 'balance_sheet', ?, ?)
      `, [companyId, period, metricName, value]);
      count++;
    }
  }
  return count;
}

async function importCashFlow(db, companyId, screenerData) {
  const cf = screenerData.cash_flow;
  if (!cf || !cf.headers || !cf.data) return 0;

  const headers = cf.headers.filter(h => h !== '');
  let count = 0;

  for (const row of cf.data) {
    const metricName = row.col_0?.replace(/\s*\+\s*$/, '').trim();
    if (!metricName) continue;

    for (const period of headers) {
      const value = parseNum(row[period]);
      if (value === null) continue;

      await db.run(`
        INSERT OR REPLACE INTO financial_metrics (company_id, period, metric_type, metric_name, value)
        VALUES (?, ?, 'cash_flow', ?, ?)
      `, [companyId, period, metricName, value]);
      count++;
    }
  }
  return count;
}

async function importRatios(db, companyId, screenerData) {
  const ratios = screenerData.ratios;
  if (!ratios || !ratios.headers || !ratios.data) return 0;

  const headers = ratios.headers.filter(h => h !== '');
  let count = 0;

  for (const row of ratios.data) {
    const metricName = row.col_0?.replace(/\s*\+\s*$/, '').replace(/%$/, '').trim();
    if (!metricName) continue;

    for (const period of headers) {
      const value = parseNum(row[period]);
      if (value === null) continue;

      await db.run(`
        INSERT OR REPLACE INTO financial_metrics (company_id, period, metric_type, metric_name, value)
        VALUES (?, ?, 'ratio', ?, ?)
      `, [companyId, period, metricName, value]);
      count++;
    }
  }
  return count;
}

async function importAnnualPnL(db, companyId, screenerData) {
  const pnl = screenerData.profit_and_loss;
  if (!pnl || !pnl.headers || !pnl.data) return 0;

  const headers = pnl.headers.filter(h => h !== '');
  let count = 0;

  for (const row of pnl.data) {
    const metricName = row.col_0?.replace(/\s*\+\s*$/, '').replace(/%$/, '').trim();
    if (!metricName) continue;

    for (const period of headers) {
      const value = parseNum(row[period]);
      if (value === null) continue;

      await db.run(`
        INSERT OR REPLACE INTO financial_metrics (company_id, period, metric_type, metric_name, value)
        VALUES (?, ?, 'annual_pnl', ?, ?)
      `, [companyId, period, metricName, value]);
      count++;
    }
  }
  return count;
}

async function importShareholding(db, companyId, screenerData) {
  const sh = screenerData.shareholding;
  if (!sh || !sh.headers || !sh.data) return 0;

  const headers = sh.headers.filter(h => h !== '');
  let count = 0;

  for (const row of sh.data) {
    const holder = row.col_0?.replace(/\s*\+\s*$/, '').replace(/%$/, '').trim();
    if (!holder) continue;

    for (const period of headers) {
      const stake = parseNum(row[period]);
      if (stake === null) continue;

      await db.run(`
        INSERT OR REPLACE INTO shareholding (company_id, date, holder, stake)
        VALUES (?, ?, ?, ?)
      `, [companyId, period, holder, stake]);
      count++;
    }
  }
  return count;
}

async function importCompanyOverview(db, companyId, screenerData, trendlyneData) {
  const km = screenerData.key_metrics || {};
  const td = trendlyneData || {};

  const marketCap = parseNum(km['Market Cap']);
  const currentPrice = parseNum(km['Current Price']);
  const pe = parseNum(km['Stock P/E']) || parseNum(td.keyRatios?.PE);
  const bookValue = parseNum(km['Book Value']);
  const dividendYield = parseNum(km['Dividend Yield']);
  const roce = parseNum(km['ROCE']) || parseNum(td.keyRatios?.ROCE);
  const roe = parseNum(km['ROE']) || parseNum(td.keyRatios?.ROE);
  const faceValue = parseNum(km['Face Value']);

  await db.run(`
    INSERT OR REPLACE INTO company_overview
    (company_id, ticker, bse_symbol, market_cap_cr, current_price, pe_ratio,
     book_value, dividend_yield, roce, roe, face_value)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [companyId, TICKER_MAP[companyId], `${TICKER_MAP[companyId]}.BSE`,
      marketCap, currentPrice, pe, bookValue, dividendYield, roce, roe, faceValue]);

  // Update companies table with ticker
  await db.run(`UPDATE companies SET ticker = ? WHERE id = ?`, [TICKER_MAP[companyId], companyId]);
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Data Consolidation Pipeline - Kompete Industry Intel');
  console.log('═══════════════════════════════════════════════════════════════');

  const db = await initDB();

  const stats = {
    quarterlyUpdated: 0,
    balanceSheetRecords: 0,
    cashFlowRecords: 0,
    ratioRecords: 0,
    annualPnLRecords: 0,
    shareholdingRecords: 0,
    overviewRecords: 0,
  };

  for (const companyId of COMPANIES) {
    console.log(`\n📊 Processing ${companyId}...`);

    // Load Screener data
    const screenerPath = path.join(EXTRACTED_DIR, companyId, 'screener-financials.json');
    let screenerData = null;
    if (fs.existsSync(screenerPath)) {
      screenerData = JSON.parse(fs.readFileSync(screenerPath, 'utf8'));
      console.log(`  ✓ Loaded Screener.in data`);
    } else {
      console.log(`  ⚠ No Screener data found`);
    }

    // Load Trendlyne data
    const trendlynePath = path.join(EXTRACTED_DIR, companyId, 'trendlyne-data.json');
    let trendlyneData = null;
    if (fs.existsSync(trendlynePath)) {
      trendlyneData = JSON.parse(fs.readFileSync(trendlynePath, 'utf8'));
      console.log(`  ✓ Loaded Trendlyne data`);
    }

    if (!screenerData) continue;

    // 1. Enrich quarterly results with EBITDA, OPM, etc.
    const qUpdated = await enrichQuarterlyResults(db, companyId, screenerData);
    stats.quarterlyUpdated += qUpdated;
    console.log(`  → ${qUpdated} quarterly results enriched`);

    // 2. Import Balance Sheet
    const bsCount = await importBalanceSheet(db, companyId, screenerData);
    stats.balanceSheetRecords += bsCount;
    console.log(`  → ${bsCount} balance sheet records`);

    // 3. Import Cash Flow
    const cfCount = await importCashFlow(db, companyId, screenerData);
    stats.cashFlowRecords += cfCount;
    console.log(`  → ${cfCount} cash flow records`);

    // 4. Import Ratios (working capital days, ROCE, debtor days, etc.)
    const rCount = await importRatios(db, companyId, screenerData);
    stats.ratioRecords += rCount;
    console.log(`  → ${rCount} ratio records`);

    // 5. Import Annual P&L
    const plCount = await importAnnualPnL(db, companyId, screenerData);
    stats.annualPnLRecords += plCount;
    console.log(`  → ${plCount} annual P&L records`);

    // 6. Import/Update Shareholding
    const shCount = await importShareholding(db, companyId, screenerData);
    stats.shareholdingRecords += shCount;
    console.log(`  → ${shCount} shareholding records`);

    // 7. Import Company Overview (key metrics)
    await importCompanyOverview(db, companyId, screenerData, trendlyneData);
    stats.overviewRecords++;
    console.log(`  → Company overview updated`);
  }

  // Final DB stats
  const dbStats = await db.all(`
    SELECT
      (SELECT COUNT(*) FROM companies) as companies,
      (SELECT COUNT(*) FROM quarterly_results) as quarterly_results,
      (SELECT COUNT(*) FROM quarterly_results WHERE ebitda_margin IS NOT NULL) as with_ebitda,
      (SELECT COUNT(*) FROM deals) as deals,
      (SELECT COUNT(*) FROM financial_metrics) as financial_metrics,
      (SELECT COUNT(*) FROM financial_metrics WHERE metric_type = 'balance_sheet') as balance_sheet,
      (SELECT COUNT(*) FROM financial_metrics WHERE metric_type = 'cash_flow') as cash_flow,
      (SELECT COUNT(*) FROM financial_metrics WHERE metric_type = 'ratio') as ratios,
      (SELECT COUNT(*) FROM financial_metrics WHERE metric_type = 'annual_pnl') as annual_pnl,
      (SELECT COUNT(*) FROM shareholding) as shareholding,
      (SELECT COUNT(*) FROM company_overview) as company_overview,
      (SELECT COUNT(*) FROM concall_highlights) as concalls,
      (SELECT COUNT(*) FROM growth_triggers) as growth_triggers
  `);

  await db.close();

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  CONSOLIDATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Records processed:`);
  console.log(`    Quarterly results enriched: ${stats.quarterlyUpdated}`);
  console.log(`    Balance sheet records: ${stats.balanceSheetRecords}`);
  console.log(`    Cash flow records: ${stats.cashFlowRecords}`);
  console.log(`    Ratio records: ${stats.ratioRecords}`);
  console.log(`    Annual P&L records: ${stats.annualPnLRecords}`);
  console.log(`    Shareholding records: ${stats.shareholdingRecords}`);
  console.log(`    Company overviews: ${stats.overviewRecords}`);

  console.log(`\n  Database totals (${DB_PATH}):`);
  const s = dbStats[0];
  console.log(`    Companies: ${s.companies}`);
  console.log(`    Quarterly Results: ${s.quarterly_results} (${s.with_ebitda} with EBITDA margin)`);
  console.log(`    Deals: ${s.deals}`);
  console.log(`    Financial Metrics: ${s.financial_metrics}`);
  console.log(`      ├─ Balance Sheet: ${s.balance_sheet}`);
  console.log(`      ├─ Cash Flow: ${s.cash_flow}`);
  console.log(`      ├─ Ratios: ${s.ratios}`);
  console.log(`      └─ Annual P&L: ${s.annual_pnl}`);
  console.log(`    Shareholding: ${s.shareholding}`);
  console.log(`    Company Overviews: ${s.company_overview}`);
  console.log(`    Concall Highlights: ${s.concalls}`);
  console.log(`    Growth Triggers: ${s.growth_triggers}`);
  console.log('═══════════════════════════════════════════════════════════════');
}

main().catch(console.error);
