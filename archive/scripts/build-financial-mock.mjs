/**
 * Build real financial data for the Financial Tracker tab.
 * Reads Screener.in JSON files and outputs src/data/mock/financial.ts
 *
 * Every number is traceable to: data-sources/extracted/{company}/screener-financials.json
 * Source: https://www.screener.in/company/{TICKER}/consolidated/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const EXTRACTED = path.join(ROOT, 'data-sources', 'extracted');

const COMPANIES = [
  { id: 'voltas', name: 'Voltas Limited', ticker: 'VOLTAS' },
  { id: 'bluestar', name: 'Blue Star Limited', ticker: 'BLUESTARCO' },
  { id: 'havells', name: 'Havells India Limited', ticker: 'HAVELLS' },
  { id: 'crompton', name: 'Crompton Greaves Consumer Electricals', ticker: 'CROMPTON' },
  { id: 'whirlpool', name: 'Whirlpool of India Limited', ticker: 'WHIRLPOOL' },
  { id: 'symphony', name: 'Symphony Limited', ticker: 'SYMPHONY' },
  { id: 'orient', name: 'Orient Electric Limited', ticker: 'ORIENTELEC' },
  { id: 'bajaj', name: 'Bajaj Electricals Limited', ticker: 'BAJAJELEC' },
  { id: 'vguard', name: 'V-Guard Industries Limited', ticker: 'VGUARD' },
  { id: 'ttk', name: 'TTK Prestige Limited', ticker: 'TTKPRESTIG' },
  { id: 'butterfly', name: 'Butterfly Gandhimathi Appliances', ticker: 'BUTTERFLY' },
  { id: 'amber', name: 'Amber Enterprises India Limited', ticker: 'AMBER' },
  { id: 'dixon', name: 'Dixon Technologies (India) Limited', ticker: 'DIXON' },
  { id: 'ifb', name: 'IFB Industries Limited', ticker: 'IFBIND' },
];

/** Parse Screener number strings like "1,542" or "-110" */
function parseNum(val) {
  if (val === undefined || val === null || val === '' || val === '-') return null;
  const cleaned = String(val).replace(/,/g, '').replace('%', '').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

/** Convert "Dec 2025" to "Q3 FY26" format */
function monthToQuarter(monthStr) {
  const parts = monthStr.split(' ');
  if (parts.length !== 2) return monthStr;
  const month = parts[0];
  const year = parseInt(parts[1]);

  // Indian FY: Apr-Mar
  // Q1 = Apr-Jun, Q2 = Jul-Sep, Q3 = Oct-Dec, Q4 = Jan-Mar
  const quarterMap = {
    'Jun': { q: 'Q1', fyOffset: 1 },
    'Sep': { q: 'Q2', fyOffset: 1 },
    'Dec': { q: 'Q3', fyOffset: 1 },
    'Mar': { q: 'Q4', fyOffset: 0 },
  };

  const mapping = quarterMap[month];
  if (!mapping) return monthStr;

  const fy = year + mapping.fyOffset;
  const fyShort = String(fy).slice(-2);
  return `${mapping.q} FY${fyShort}`;
}

/** Get a row from Screener data by col_0 label */
function getRow(section, label) {
  if (!section || !section.data) return null;
  return section.data.find(r => r.col_0 === label || r.col_0.startsWith(label));
}

/** Get latest annual value from ratios section */
function getLatestRatio(ratios, label) {
  const row = getRow(ratios, label);
  if (!row) return null;
  // Get the last available header (most recent year)
  const headers = Object.keys(row).filter(k => k !== 'col_0').sort();
  for (let i = headers.length - 1; i >= 0; i--) {
    const val = parseNum(row[headers[i]]);
    if (val !== null) return { value: val, period: headers[i] };
  }
  return null;
}

function processCompany(companyDef) {
  const filePath = path.join(EXTRACTED, companyDef.id, 'screener-financials.json');
  if (!fs.existsSync(filePath)) {
    console.error(`  SKIP ${companyDef.id}: no screener-financials.json`);
    return null;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const qr = data.quarterly_results;
  const ratios = data.ratios;

  if (!qr || !qr.headers || !qr.data) {
    console.error(`  SKIP ${companyDef.id}: no quarterly_results`);
    return null;
  }

  // Get row data
  const salesRow = getRow(qr, 'Sales');
  const opmRow = getRow(qr, 'OPM %');
  const netProfitRow = getRow(qr, 'Net Profit');
  const opProfitRow = getRow(qr, 'Operating Profit');

  if (!salesRow || !opmRow) {
    console.error(`  SKIP ${companyDef.id}: missing Sales or OPM rows`);
    return null;
  }

  // Get quarter headers (skip col_0)
  const quarters = qr.headers.filter(h => h !== '' && h !== 'col_0');

  // Build quarterly data with YoY revenue growth
  const quarterlyData = [];
  for (const q of quarters) {
    const sales = parseNum(salesRow[q]);
    const opm = parseNum(opmRow[q]);
    const netProfit = netProfitRow ? parseNum(netProfitRow[q]) : null;
    const opProfit = opProfitRow ? parseNum(opProfitRow[q]) : null;

    if (sales === null) continue;

    // Compute EBITDA margin from Operating Profit / Sales (more precise than rounded OPM%)
    let ebitdaMargin = null;
    if (opProfit !== null && sales !== 0) {
      ebitdaMargin = opProfit / sales; // as decimal
    } else if (opm !== null) {
      ebitdaMargin = opm / 100; // fallback to OPM%
    }

    // Find same quarter last year for YoY growth
    const parts = q.split(' ');
    const month = parts[0];
    const year = parseInt(parts[1]);
    const yoyQuarter = `${month} ${year - 1}`;
    const yoySales = parseNum(salesRow[yoyQuarter]);

    let revenueGrowthYoY = null;
    if (yoySales !== null && yoySales !== 0) {
      revenueGrowthYoY = (sales - yoySales) / Math.abs(yoySales); // as decimal
    }

    quarterlyData.push({
      monthKey: q,
      period: monthToQuarter(q),
      sales,
      revenueGrowthYoY,
      ebitdaMargin,
      netProfit,
    });
  }

  // Include ALL quarters from 2022 forward that have YoY growth data
  // (2022 quarters serve as YoY base, so first available YoY is from 2023)
  const withGrowth = quarterlyData.filter(q => q.revenueGrowthYoY !== null);

  if (withGrowth.length === 0) {
    console.error(`  SKIP ${companyDef.id}: no quarters with YoY data`);
    return null;
  }

  const latest = withGrowth[withGrowth.length - 1];

  // Get annual ratios (latest available)
  const roceData = getLatestRatio(ratios, 'ROCE %');
  const wcDaysData = getLatestRatio(ratios, 'Working Capital Days');

  // Compute D/E from balance sheet: Borrowings / (Equity Capital + Reserves)
  let debtEquity = null;
  let dePeriod = null;
  if (data.balance_sheet && data.balance_sheet.data) {
    const borrowingsRow = getRow(data.balance_sheet, 'Borrowings');
    const equityRow = getRow(data.balance_sheet, 'Equity Capital');
    const reservesRow = getRow(data.balance_sheet, 'Reserves');

    if (borrowingsRow && equityRow && reservesRow) {
      const bsHeaders = data.balance_sheet.headers.filter(h => h !== '' && h !== 'col_0');
      // Get latest period
      for (let i = bsHeaders.length - 1; i >= 0; i--) {
        const h = bsHeaders[i];
        const borrowings = parseNum(borrowingsRow[h]);
        const equity = parseNum(equityRow[h]);
        const reserves = parseNum(reservesRow[h]);
        if (borrowings !== null && equity !== null && reserves !== null && (equity + reserves) > 0) {
          debtEquity = Math.round((borrowings / (equity + reserves)) * 100) / 100;
          dePeriod = h;
          break;
        }
      }
    }
  }

  // Determine performance tier from latest revenue growth
  let performance = 'inline';
  if (latest.revenueGrowthYoY !== null) {
    if (latest.revenueGrowthYoY > 0.15) performance = 'outperform';
    else if (latest.revenueGrowthYoY < 0) performance = 'underperform';
  }

  // Build factual variance analysis from actual numbers
  const revGrowthPct = latest.revenueGrowthYoY !== null
    ? (latest.revenueGrowthYoY * 100).toFixed(1)
    : 'N/A';
  const ebitdaPct = latest.ebitdaMargin !== null
    ? (latest.ebitdaMargin * 100).toFixed(1)
    : 'N/A';
  const revDir = latest.revenueGrowthYoY >= 0 ? 'grew' : 'declined';

  let varianceAnalysis = `Revenue ${revDir} ${Math.abs(parseFloat(revGrowthPct)).toFixed(1)}% YoY to INR ${latest.sales} Cr in ${latest.period}. Operating margin at ${ebitdaPct}%.`;
  if (latest.netProfit !== null) {
    varianceAnalysis += ` Net profit: INR ${latest.netProfit} Cr.`;
  }

  // Source attribution
  const sourceUrl = data.company?.source_url || `https://www.screener.in/company/${companyDef.ticker}/consolidated/`;
  const source = `Screener.in (${sourceUrl}), scraped ${data.company?.scraped_at?.split('T')[0] || '2026-02-18'}`;

  // Build history array (only revenueGrowthYoY and ebitdaMargin are real per-quarter)
  const history = withGrowth.map(q => ({
    period: q.period,
    revenueGrowthYoY: q.revenueGrowthYoY !== null ? Math.round(q.revenueGrowthYoY * 10000) / 10000 : 0,
    ebitdaMargin: q.ebitdaMargin !== null ? Math.round(q.ebitdaMargin * 10000) / 10000 : 0,
  }));

  // Build metrics (latest quarter + annual ratios)
  const metrics = {
    revenueGrowthYoY: latest.revenueGrowthYoY !== null ? Math.round(latest.revenueGrowthYoY * 10000) / 10000 : 0,
    ebitdaMargin: latest.ebitdaMargin !== null ? Math.round(latest.ebitdaMargin * 10000) / 10000 : 0,
    workingCapitalDays: wcDaysData ? wcDaysData.value : null,
    roce: roceData ? Math.round(roceData.value / 100 * 10000) / 10000 : null, // convert % to decimal
    debtEquity: debtEquity,
  };

  console.log(`  ${companyDef.id.padEnd(12)} | rev=${(metrics.revenueGrowthYoY*100).toFixed(1)}% | ebitda=${(metrics.ebitdaMargin*100).toFixed(1)}% | wc=${metrics.workingCapitalDays || 'N/A'} | roce=${metrics.roce !== null ? (metrics.roce*100).toFixed(1)+'%' : 'N/A'} | de=${metrics.debtEquity ?? 'N/A'} | ${withGrowth.length}q`);

  return {
    id: companyDef.id,
    name: companyDef.name,
    ticker: companyDef.ticker,
    metrics,
    performance,
    varianceAnalysis,
    source,
    history,
  };
}

function generateTypeScript(companies) {
  const lines = [];

  lines.push(`import type { FinancialPerformanceData } from "../../types/sections";`);
  lines.push(``);
  lines.push(`// ============================================================================`);
  lines.push(`// REAL DATA — sourced from Screener.in (scraped 2026-02-18)`);
  lines.push(`// Every number traceable to: data-sources/extracted/{company}/screener-financials.json`);
  lines.push(`// Source URLs: https://www.screener.in/company/{TICKER}/consolidated/`);
  lines.push(`//`);
  lines.push(`// Metrics table: revenueGrowthYoY and ebitdaMargin from latest quarter.`);
  lines.push(`//   workingCapitalDays, roce, debtEquity from latest annual ratios/balance sheet.`);
  lines.push(`// History: Only revenueGrowthYoY and ebitdaMargin are real per-quarter values.`);
  lines.push(`//   workingCapitalDays, roce, debtEquity are NOT available per quarter.`);
  lines.push(`// ============================================================================`);
  lines.push(``);

  lines.push(`const data: FinancialPerformanceData = {`);
  lines.push(`  section: "financial-performance",`);
  lines.push(`  dataAsOf: "${companies[0]?.history?.slice(-1)[0]?.period || 'Q3 FY26'}",`);
  lines.push(`  lastUpdated: "2026-02-18T00:00:00Z",`);
  lines.push(`  companies: [`);

  for (const c of companies) {
    lines.push(`    {`);
    lines.push(`      id: "${c.id}",`);
    lines.push(`      name: "${c.name}",`);
    lines.push(`      ticker: "${c.ticker}",`);
    lines.push(`      metrics: {`);
    lines.push(`        revenueGrowthYoY: ${c.metrics.revenueGrowthYoY},`);
    lines.push(`        ebitdaMargin: ${c.metrics.ebitdaMargin},`);
    lines.push(`        workingCapitalDays: ${c.metrics.workingCapitalDays !== null ? c.metrics.workingCapitalDays : 'null'},`);
    lines.push(`        roce: ${c.metrics.roce !== null ? c.metrics.roce : 'null'},`);
    lines.push(`        debtEquity: ${c.metrics.debtEquity !== null ? c.metrics.debtEquity : 'null'},`);
    lines.push(`      },`);
    lines.push(`      performance: "${c.performance}",`);
    lines.push(`      varianceAnalysis:`);
    lines.push(`        "${c.varianceAnalysis.replace(/"/g, '\\"')}",`);
    lines.push(`      source: "${c.source.replace(/"/g, '\\"')}",`);
    lines.push(`      history: [`);
    for (const h of c.history) {
      lines.push(`        { period: "${h.period}", revenueGrowthYoY: ${h.revenueGrowthYoY}, ebitdaMargin: ${h.ebitdaMargin} },`);
    }
    lines.push(`      ],`);
    lines.push(`    },`);
  }

  lines.push(`  ],`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export default data;`);
  lines.push(``);

  return lines.join('\n');
}

// Main
console.log('Building Financial Tracker data from Screener.in sources...\n');

const results = [];
for (const company of COMPANIES) {
  const result = processCompany(company);
  if (result) results.push(result);
}

console.log(`\nProcessed ${results.length} of ${COMPANIES.length} companies`);

// Generate TypeScript
const tsContent = generateTypeScript(results);
const outPath = path.join(ROOT, 'src', 'data', 'mock', 'financial.ts');
fs.writeFileSync(outPath, tsContent);
console.log(`\nWritten: ${outPath}`);
console.log(`Size: ${(tsContent.length / 1024).toFixed(1)} KB`);
