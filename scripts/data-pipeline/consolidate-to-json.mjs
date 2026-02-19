/**
 * Consolidate All Data Sources into JSON files for the dashboard
 * No native dependencies required — pure Node.js
 *
 * Reads: screener-financials.json, trendlyne-data.json, sovrenn-intelligence.json
 * Writes: data-sources/extracted/consolidated-dashboard-data.json
 *         data-sources/extracted/{companyId}/consolidated.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const EXTRACTED_DIR = path.join(ROOT, 'data-sources', 'extracted');

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

function parseNum(val) {
  if (!val || val === '' || val === 'None') return null;
  const cleaned = String(val).replace(/,/g, '').replace(/%/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function getRow(data, label) {
  if (!data) return null;
  return data.find(r => r.col_0 && r.col_0.replace(/\s*\+\s*$/, '').trim() === label);
}

function screenerQuarterToFY(header) {
  const parts = header.split(' ');
  if (parts.length !== 2) return header;
  const [month, year] = parts;
  const y = parseInt(year);
  const map = { 'Jun': { q: 'Q1', fy: y + 1 }, 'Sep': { q: 'Q2', fy: y + 1 }, 'Dec': { q: 'Q3', fy: y + 1 }, 'Mar': { q: 'Q4', fy: y } };
  const m = map[month];
  return m ? `${m.q} FY${m.fy}` : header;
}

function processCompany(companyInfo) {
  const { id, name, ticker } = companyInfo;

  // Load Screener data
  const screenerPath = path.join(EXTRACTED_DIR, id, 'screener-financials.json');
  const trendlynePath = path.join(EXTRACTED_DIR, id, 'trendlyne-data.json');

  let screener = null, trendlyne = null;
  if (fs.existsSync(screenerPath)) screener = JSON.parse(fs.readFileSync(screenerPath, 'utf8'));
  if (fs.existsSync(trendlynePath)) trendlyne = JSON.parse(fs.readFileSync(trendlynePath, 'utf8'));

  if (!screener) return null;

  const result = {
    id, name, ticker,
    bseSymbol: `${ticker}.BSE`,
  };

  // 1. Key Metrics (overview)
  const km = screener.key_metrics || {};
  result.overview = {
    marketCapCr: parseNum(km['Market Cap']),
    currentPrice: parseNum(km['Current Price']),
    peRatio: parseNum(km['Stock P/E']),
    bookValue: parseNum(km['Book Value']),
    dividendYield: parseNum(km['Dividend Yield']),
    roce: parseNum(km['ROCE']),
    roe: parseNum(km['ROE']),
    faceValue: parseNum(km['Face Value']),
  };

  // 2. Quarterly Results (structured)
  const qr = screener.quarterly_results;
  if (qr && qr.headers && qr.data) {
    const headers = qr.headers.filter(h => h !== '');
    const salesRow = getRow(qr.data, 'Sales');
    const expRow = getRow(qr.data, 'Expenses');
    const opRow = getRow(qr.data, 'Operating Profit');
    const opmRow = getRow(qr.data, 'OPM %');
    const otherRow = getRow(qr.data, 'Other Income');
    const intRow = getRow(qr.data, 'Interest');
    const depRow = getRow(qr.data, 'Depreciation');
    const pbtRow = getRow(qr.data, 'Profit before tax');
    const taxRow = getRow(qr.data, 'Tax %');
    const npRow = getRow(qr.data, 'Net Profit');
    const epsRow = getRow(qr.data, 'EPS in Rs');

    result.quarterlyResults = headers.map(h => {
      const sales = parseNum(salesRow?.[h]);
      const opProfit = parseNum(opRow?.[h]);
      const dep = parseNum(depRow?.[h]);
      const np = parseNum(npRow?.[h]);
      const ebitda = (opProfit !== null && dep !== null) ? opProfit + dep : null;
      const ebitdaMargin = (ebitda !== null && sales && sales > 0) ? parseFloat((ebitda / sales * 100).toFixed(2)) : null;

      // YoY: find same quarter previous year
      const [month, year] = h.split(' ');
      const prevH = `${month} ${parseInt(year) - 1}`;
      const prevSales = headers.includes(prevH) ? parseNum(salesRow?.[prevH]) : null;
      const prevNP = headers.includes(prevH) ? parseNum(npRow?.[prevH]) : null;

      return {
        period: h,
        quarterFY: screenerQuarterToFY(h),
        salesCr: sales,
        expensesCr: parseNum(expRow?.[h]),
        operatingProfitCr: opProfit,
        opmPct: parseNum(opmRow?.[h]),
        otherIncomeCr: parseNum(otherRow?.[h]),
        interestCr: parseNum(intRow?.[h]),
        depreciationCr: dep,
        ebitdaCr: ebitda,
        ebitdaMarginPct: ebitdaMargin,
        pbtCr: parseNum(pbtRow?.[h]),
        taxPct: parseNum(taxRow?.[h]),
        netProfitCr: np,
        epsDiluted: parseNum(epsRow?.[h]),
        salesGrowthYoY: (sales !== null && prevSales !== null && prevSales > 0)
          ? parseFloat(((sales - prevSales) / prevSales * 100).toFixed(1)) : null,
        profitGrowthYoY: (np !== null && prevNP !== null && prevNP !== 0)
          ? parseFloat(((np - prevNP) / Math.abs(prevNP) * 100).toFixed(1)) : null,
      };
    });
  }

  // 3. Annual P&L
  const pnl = screener.profit_and_loss;
  if (pnl && pnl.headers && pnl.data) {
    const headers = pnl.headers.filter(h => h !== '');
    result.annualPnL = headers.map(h => {
      const sales = parseNum(getRow(pnl.data, 'Sales')?.[h]);
      const opProfit = parseNum(getRow(pnl.data, 'Operating Profit')?.[h]);
      const dep = parseNum(getRow(pnl.data, 'Depreciation')?.[h]);
      const np = parseNum(getRow(pnl.data, 'Net Profit')?.[h]);
      const ebitda = (opProfit !== null && dep !== null) ? opProfit + dep : null;

      return {
        period: h,
        salesCr: sales,
        expensesCr: parseNum(getRow(pnl.data, 'Expenses')?.[h]),
        operatingProfitCr: opProfit,
        opmPct: parseNum(getRow(pnl.data, 'OPM %')?.[h]),
        otherIncomeCr: parseNum(getRow(pnl.data, 'Other Income')?.[h]),
        interestCr: parseNum(getRow(pnl.data, 'Interest')?.[h]),
        depreciationCr: dep,
        ebitdaCr: ebitda,
        ebitdaMarginPct: (ebitda !== null && sales && sales > 0) ? parseFloat((ebitda / sales * 100).toFixed(2)) : null,
        pbtCr: parseNum(getRow(pnl.data, 'Profit before tax')?.[h]),
        taxPct: parseNum(getRow(pnl.data, 'Tax %')?.[h]),
        netProfitCr: np,
        epsDiluted: parseNum(getRow(pnl.data, 'EPS in Rs')?.[h]),
        dividendPayoutPct: parseNum(getRow(pnl.data, 'Dividend Payout')?.[h]),
      };
    });
  }

  // 4. Balance Sheet
  const bs = screener.balance_sheet;
  if (bs && bs.headers && bs.data) {
    const headers = bs.headers.filter(h => h !== '');
    result.balanceSheet = headers.map(h => {
      const obj = { period: h };
      for (const row of bs.data) {
        const key = row.col_0?.replace(/\s*\+\s*$/, '').trim();
        if (key) obj[key] = parseNum(row[h]);
      }
      return obj;
    });
  }

  // 5. Cash Flow
  const cf = screener.cash_flow;
  if (cf && cf.headers && cf.data) {
    const headers = cf.headers.filter(h => h !== '');
    result.cashFlow = headers.map(h => {
      const obj = { period: h };
      for (const row of cf.data) {
        const key = row.col_0?.replace(/\s*\+\s*$/, '').trim();
        if (key) obj[key] = parseNum(row[h]);
      }
      return obj;
    });
  }

  // 6. Ratios
  const ratios = screener.ratios;
  if (ratios && ratios.headers && ratios.data) {
    const headers = ratios.headers.filter(h => h !== '');
    result.ratios = headers.map(h => {
      const obj = { period: h };
      for (const row of ratios.data) {
        const key = row.col_0?.replace(/\s*\+\s*$/, '').replace(/%$/, '').trim();
        if (key) obj[key] = parseNum(row[h]);
      }
      return obj;
    });
  }

  // 7. Shareholding
  const sh = screener.shareholding;
  if (sh && sh.headers && sh.data) {
    const headers = sh.headers.filter(h => h !== '');
    result.shareholding = headers.map(h => {
      const obj = { period: h };
      for (const row of sh.data) {
        const key = row.col_0?.replace(/\s*\+\s*$/, '').replace(/%$/, '').trim();
        if (key) obj[key] = parseNum(row[h]);
      }
      return obj;
    });
  }

  // 8. Derived dashboard metrics (for /api/financial endpoint)
  if (result.quarterlyResults && result.quarterlyResults.length > 0) {
    const latest = result.quarterlyResults[result.quarterlyResults.length - 1];
    const latestRatios = result.ratios?.[result.ratios.length - 2]; // TTM-1

    // Working capital days from ratios
    const workingCapDays = latestRatios?.['Working Capital Days'] ?? null;

    // Debt/Equity from balance sheet
    let debtEquity = null;
    if (result.balanceSheet && result.balanceSheet.length > 0) {
      const latestBS = result.balanceSheet[result.balanceSheet.length - 2]; // latest non-TTM
      const borrowings = latestBS?.['Borrowings'];
      const equity = (latestBS?.['Equity Capital'] || 0) + (latestBS?.['Reserves'] || 0);
      if (borrowings !== null && equity > 0) debtEquity = parseFloat((borrowings / equity).toFixed(2));
    }

    result.dashboardMetrics = {
      revenueGrowthYoY: latest.salesGrowthYoY,
      ebitdaMargin: latest.ebitdaMarginPct,
      workingCapitalDays: workingCapDays,
      roce: result.overview.roce,
      debtEquity,
      performance: latest.salesGrowthYoY > 15 ? 'outperform' :
                   latest.salesGrowthYoY > 0 ? 'inline' : 'underperform',
    };

    // Build 6-quarter history for trend charts
    const recentQtrs = result.quarterlyResults.slice(-6);
    result.dashboardHistory = recentQtrs.map((q, i) => {
      const ratioForPeriod = result.ratios?.find(r => {
        const rYear = r.period?.split(' ')?.[1];
        const qYear = q.period?.split(' ')?.[1];
        return rYear === qYear;
      });

      return {
        period: q.quarterFY,
        revenue: q.salesCr,
        revenueGrowth: q.salesGrowthYoY,
        ebitdaMargin: q.ebitdaMarginPct,
        netProfit: q.netProfitCr,
        profitGrowth: q.profitGrowthYoY,
        workingCapitalDays: ratioForPeriod?.['Working Capital Days'] ?? null,
        roce: result.overview.roce,
        debtEquity: result.dashboardMetrics.debtEquity,
      };
    });
  }

  // 9. Trendlyne enrichment
  if (trendlyne) {
    result.trendlyneInsights = {
      keyRatios: trendlyne.keyRatios || null,
      earningsSummary: trendlyne.earningsTranscriptSummary || trendlyne.earningsSummary || null,
      segmentPerformance: trendlyne.segmentPerformance || null,
    };
  }

  return result;
}

function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  JSON Consolidation Pipeline - Kompete Industry Intel');
  console.log('═══════════════════════════════════════════════════════════════');

  const allCompanies = [];

  for (const company of COMPANIES) {
    console.log(`\n📊 Processing ${company.name}...`);
    const consolidated = processCompany(company);

    if (consolidated) {
      allCompanies.push(consolidated);

      // Save individual file
      const outPath = path.join(EXTRACTED_DIR, company.id, 'consolidated.json');
      fs.writeFileSync(outPath, JSON.stringify(consolidated, null, 2));
      console.log(`  ✓ Saved consolidated.json`);
      console.log(`    Overview: Mkt Cap ₹${consolidated.overview.marketCapCr} Cr, PE ${consolidated.overview.peRatio}, ROCE ${consolidated.overview.roce}%`);
      console.log(`    Quarters: ${consolidated.quarterlyResults?.length || 0}`);
      console.log(`    Annual P&L: ${consolidated.annualPnL?.length || 0} years`);
      console.log(`    Balance Sheet: ${consolidated.balanceSheet?.length || 0} periods`);
      console.log(`    Cash Flow: ${consolidated.cashFlow?.length || 0} periods`);
      console.log(`    Ratios: ${consolidated.ratios?.length || 0} periods`);
      console.log(`    Shareholding: ${consolidated.shareholding?.length || 0} periods`);
      if (consolidated.dashboardMetrics) {
        const dm = consolidated.dashboardMetrics;
        console.log(`    Dashboard: Rev Growth ${dm.revenueGrowthYoY}%, EBITDA Margin ${dm.ebitdaMargin}%, ROCE ${dm.roce}%, D/E ${dm.debtEquity}`);
      }
    } else {
      console.log(`  ⚠ No data available`);
    }
  }

  // Save master consolidated file
  const masterOutput = {
    generatedAt: new Date().toISOString(),
    sources: ['screener.in', 'trendlyne.com', 'sovrenn-intelligence'],
    companiesCount: allCompanies.length,
    companies: allCompanies,
  };

  fs.writeFileSync(
    path.join(EXTRACTED_DIR, 'consolidated-dashboard-data.json'),
    JSON.stringify(masterOutput, null, 2)
  );

  // Also write a compact version the server can directly serve
  const financialApiData = {
    section: 'financial-performance',
    dataAsOf: 'Q3 FY26',
    lastUpdated: new Date().toISOString(),
    companies: allCompanies.map(c => ({
      id: c.id,
      name: c.name,
      ticker: c.ticker,
      metrics: {
        revenueGrowth: c.dashboardMetrics?.revenueGrowthYoY || 0,
        ebitdaMargin: c.dashboardMetrics?.ebitdaMargin || 0,
        workingCapitalDays: c.dashboardMetrics?.workingCapitalDays || 0,
        roce: c.dashboardMetrics?.roce || 0,
        debtEquity: c.dashboardMetrics?.debtEquity || 0,
      },
      performance: c.dashboardMetrics?.performance || 'inline',
      varianceAnalysis: `Revenue ${(c.dashboardMetrics?.revenueGrowthYoY || 0) > 0 ? 'grew' : 'declined'} ${Math.abs(c.dashboardMetrics?.revenueGrowthYoY || 0).toFixed(1)}% YoY. EBITDA margin at ${c.dashboardMetrics?.ebitdaMargin || 0}%. ROCE: ${c.dashboardMetrics?.roce || 0}%.`,
      source: 'Screener.in + Trendlyne',
      overview: c.overview,
      history: c.dashboardHistory || [],
    })),
  };

  fs.writeFileSync(
    path.join(EXTRACTED_DIR, 'financial-api-data.json'),
    JSON.stringify(financialApiData, null, 2)
  );

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  CONSOLIDATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Companies processed: ${allCompanies.length}`);
  console.log(`\n  Output files:`);
  console.log(`    📁 Per-company: data-sources/extracted/{id}/consolidated.json`);
  console.log(`    📁 Master: data-sources/extracted/consolidated-dashboard-data.json`);
  console.log(`    📁 API-ready: data-sources/extracted/financial-api-data.json`);
  console.log('═══════════════════════════════════════════════════════════════');
}

main();
