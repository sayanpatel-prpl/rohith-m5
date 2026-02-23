/**
 * Alpha Vantage Financial Data Fetcher
 * Fetches ALL available financial data for Indian consumer durables companies
 * from Alpha Vantage API and saves to data-sources/ for the Industry Intel dashboard.
 *
 * Data fetched (post-2020):
 *   - Global Quote (current market data)
 *   - Daily Time Series (full history, filtered post-2020)
 *   - Weekly Time Series (full history, filtered post-2020)
 *   - Monthly Time Series (full history, filtered post-2020)
 *   - Income Statement (annual + quarterly)
 *   - Balance Sheet (annual + quarterly)
 *   - Cash Flow Statement (annual + quarterly)
 *   - Company Overview (key ratios, market cap, etc.)
 *   - Earnings (EPS data)
 *
 * Note: Fundamental data endpoints may return empty for Indian BSE stocks
 *       on the free tier. Price data is always available.
 *
 * Rate limit: Free tier = 25 calls/day, ~5/min
 * Resume: Skips companies already fetched (checks for existing files)
 *
 * Usage: node scripts/fetch-alphavantage.mjs [--resume] [--company=voltas]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data-sources', 'extracted');
const API_KEY = '4ESL9UXT4NK7183N';
const BASE_URL = 'https://www.alphavantage.co/query';
const CUTOFF_DATE = '2020-01-01';

// Delay between API calls (15s for free tier safety)
const DELAY_MS = 15000;

const COMPANIES = [
  { id: 'voltas',    symbol: 'VOLTAS.BSE',     name: 'Voltas Limited' },
  { id: 'bluestar',  symbol: 'BLUESTARCO.BSE', name: 'Blue Star Limited' },
  { id: 'havells',   symbol: 'HAVELLS.BSE',    name: 'Havells India Limited' },
  { id: 'crompton',  symbol: 'CROMPTON.BSE',   name: 'Crompton Greaves Consumer Electricals' },
  { id: 'whirlpool', symbol: 'WHIRLPOOL.BSE',  name: 'Whirlpool of India Limited' },
  { id: 'symphony',  symbol: 'SYMPHONY.BSE',   name: 'Symphony Limited' },
  { id: 'orient',    symbol: 'ORIENTELEC.BSE', name: 'Orient Electric Limited' },
  { id: 'bajaj',     symbol: 'BAJAJELEC.BSE',  name: 'Bajaj Electricals Limited' },
  { id: 'vguard',    symbol: 'VGUARD.BSE',     name: 'V-Guard Industries Limited' },
  { id: 'ttk',       symbol: 'TTKPRESTIG.BSE', name: 'TTK Prestige Limited' },
  { id: 'butterfly', symbol: 'BUTTERFLY.BSE',  name: 'Butterfly Gandhimathi Appliances' },
  { id: 'amber',     symbol: 'AMBER.BSE',      name: 'Amber Enterprises India Limited' },
  { id: 'dixon',     symbol: 'DIXON.BSE',      name: 'Dixon Technologies (India) Limited' },
  { id: 'ifb',       symbol: 'IFBIND.BSE',     name: 'IFB Industries Limited' },
];

// All endpoints to fetch per company
const ENDPOINTS = [
  { fn: 'GLOBAL_QUOTE',       key: 'currentQuote',    extra: {} },
  { fn: 'TIME_SERIES_DAILY',  key: 'dailyPrices',     extra: { outputsize: 'full' } },
  { fn: 'TIME_SERIES_WEEKLY', key: 'weeklyPrices',    extra: {} },
  { fn: 'TIME_SERIES_MONTHLY',key: 'monthlyPrices',   extra: {} },
  { fn: 'OVERVIEW',           key: 'companyOverview',  extra: {} },
  { fn: 'INCOME_STATEMENT',   key: 'incomeStatement', extra: {} },
  { fn: 'BALANCE_SHEET',      key: 'balanceSheet',    extra: {} },
  { fn: 'CASH_FLOW',          key: 'cashFlow',        extra: {} },
  { fn: 'EARNINGS',           key: 'earnings',        extra: {} },
];

let apiCallCount = 0;
let rateLimited = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAPI(fn, symbol, extra = {}) {
  if (rateLimited) return null;

  const params = new URLSearchParams({ function: fn, symbol, apikey: API_KEY, ...extra });
  const url = `${BASE_URL}?${params}`;

  apiCallCount++;
  console.log(`    [API call #${apiCallCount}] ${fn}...`);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Check for rate limiting
    if (data['Note'] || data['Information']) {
      const msg = data['Note'] || data['Information'];
      if (msg.includes('rate limit') || msg.includes('25 requests') || msg.includes('spreading out')) {
        console.warn(`    ⚠ RATE LIMITED after ${apiCallCount} calls. Saving progress...`);
        rateLimited = true;
        return null;
      }
    }

    // Check for empty response
    if (Object.keys(data).length === 0) {
      console.log(`    → Empty (not available for this stock)`);
      return { _empty: true };
    }

    return data;
  } catch (e) {
    console.error(`    ✗ Error: ${e.message}`);
    return null;
  }
}

function filterPost2020(entries) {
  if (!entries || !Array.isArray(entries)) return entries;
  return entries.filter(e => e.date >= CUTOFF_DATE);
}

function parseTimeSeriesData(data, seriesKey) {
  const series = data[seriesKey];
  if (!series) return [];

  return Object.entries(series)
    .filter(([date]) => date >= CUTOFF_DATE)
    .map(([date, vals]) => ({
      date,
      open: parseFloat(vals['1. open']),
      high: parseFloat(vals['2. high']),
      low: parseFloat(vals['3. low']),
      close: parseFloat(vals['4. close']),
      volume: parseInt(vals['5. volume']),
    }))
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first
}

function parseGlobalQuote(data) {
  const q = data['Global Quote'];
  if (!q) return null;
  return {
    symbol: q['01. symbol'],
    open: parseFloat(q['02. open']),
    high: parseFloat(q['03. high']),
    low: parseFloat(q['04. low']),
    price: parseFloat(q['05. price']),
    volume: parseInt(q['06. volume']),
    latestTradingDay: q['07. latest trading day'],
    previousClose: parseFloat(q['08. previous close']),
    change: parseFloat(q['09. change']),
    changePercent: q['10. change percent'],
  };
}

function computeDerivedMetrics(data) {
  const metrics = {};

  // From daily prices
  if (data.dailyPrices && data.dailyPrices.length > 0) {
    const prices = data.dailyPrices;
    const latest = prices[0];

    // 52-week high/low (approx 252 trading days)
    const last252 = prices.slice(0, 252);
    metrics.high52Week = Math.max(...last252.map(p => p.high));
    metrics.low52Week = Math.min(...last252.map(p => p.low));

    // Average volumes
    metrics.avgVolume10D = Math.round(prices.slice(0, 10).reduce((s, p) => s + p.volume, 0) / Math.min(10, prices.length));
    metrics.avgVolume30D = Math.round(prices.slice(0, 30).reduce((s, p) => s + p.volume, 0) / Math.min(30, prices.length));
    metrics.avgVolume90D = Math.round(prices.slice(0, 90).reduce((s, p) => s + p.volume, 0) / Math.min(90, prices.length));

    // Price changes
    if (prices.length >= 5)   metrics.priceChange1W  = pctChange(latest.close, prices[4].close);
    if (prices.length >= 22)  metrics.priceChange1M  = pctChange(latest.close, prices[21].close);
    if (prices.length >= 66)  metrics.priceChange3M  = pctChange(latest.close, prices[65].close);
    if (prices.length >= 132) metrics.priceChange6M  = pctChange(latest.close, prices[131].close);
    if (prices.length >= 252) metrics.priceChange1Y  = pctChange(latest.close, prices[251].close);

    // Volatility (30-day annualized)
    metrics.volatility30D = calculateVolatility(prices.slice(0, 30));

    // Moving averages
    metrics.sma20 = sma(prices, 20);
    metrics.sma50 = sma(prices, 50);
    metrics.sma200 = sma(prices, 200);

    // RSI (14-day)
    metrics.rsi14 = calculateRSI(prices.slice(0, 15));

    // Price vs moving averages
    if (metrics.sma50) metrics.priceVsSma50 = pctChange(latest.close, metrics.sma50);
    if (metrics.sma200) metrics.priceVsSma200 = pctChange(latest.close, metrics.sma200);
  }

  // From monthly prices: annual returns
  if (data.monthlyPrices && data.monthlyPrices.length > 0) {
    const monthly = data.monthlyPrices;
    const currentYear = new Date().getFullYear();

    // YTD return
    const ytdStart = monthly.find(m => m.date.startsWith(`${currentYear - 1}-12`) || m.date.startsWith(`${currentYear}-01`));
    if (ytdStart) metrics.returnYTD = pctChange(monthly[0].close, ytdStart.close);

    // Annual returns for each year since 2020
    for (let year = 2020; year <= currentYear; year++) {
      const yearStart = monthly.find(m => m.date.startsWith(`${year - 1}-12`) || m.date.startsWith(`${year}-01`));
      const yearEnd = monthly.find(m => m.date.startsWith(`${year}-12`));
      if (yearStart && yearEnd) {
        metrics[`return${year}`] = pctChange(yearEnd.close, yearStart.close);
      }
    }

    // All-time high/low (post 2020)
    metrics.allTimeHighPost2020 = Math.max(...monthly.map(m => m.high));
    metrics.allTimeLowPost2020 = Math.min(...monthly.map(m => m.low));
  }

  return metrics;
}

function pctChange(current, previous) {
  return ((current - previous) / previous * 100).toFixed(2) + '%';
}

function sma(prices, period) {
  if (prices.length < period) return null;
  return parseFloat((prices.slice(0, period).reduce((s, p) => s + p.close, 0) / period).toFixed(2));
}

function calculateVolatility(prices) {
  if (prices.length < 2) return null;
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i - 1].close / prices[i].close));
  }
  const mean = returns.reduce((s, r) => s + r, 0) / returns.length;
  const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / (returns.length - 1);
  return (Math.sqrt(variance) * Math.sqrt(252) * 100).toFixed(2) + '%';
}

function calculateRSI(prices) {
  if (prices.length < 15) return null;
  let gains = 0, losses = 0;
  for (let i = 1; i < Math.min(15, prices.length); i++) {
    const diff = prices[i - 1].close - prices[i].close;
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / 14;
  const avgLoss = losses / 14;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return parseFloat((100 - (100 / (1 + rs))).toFixed(2));
}

async function fetchCompanyData(company) {
  console.log(`\n📊 ${company.name} (${company.symbol})`);
  const result = {
    companyId: company.id,
    symbol: company.symbol,
    companyName: company.name,
    fetchedAt: new Date().toISOString(),
    dataPostCutoff: CUTOFF_DATE,
  };

  // 1. Global Quote
  const quoteData = await fetchAPI('GLOBAL_QUOTE', company.symbol);
  if (quoteData && !quoteData._empty) {
    result.currentQuote = parseGlobalQuote(quoteData);
    if (result.currentQuote) console.log(`    ✓ Price: ₹${result.currentQuote.price} (${result.currentQuote.changePercent})`);
  }
  await sleep(DELAY_MS);
  if (rateLimited) return result;

  // 2. Daily Time Series (full, filtered post-2020)
  const dailyData = await fetchAPI('TIME_SERIES_DAILY', company.symbol, { outputsize: 'full' });
  if (dailyData && !dailyData._empty) {
    result.dailyPrices = parseTimeSeriesData(dailyData, 'Time Series (Daily)');
    console.log(`    ✓ ${result.dailyPrices.length} daily data points (post-2020)`);
  }
  await sleep(DELAY_MS);
  if (rateLimited) return result;

  // 3. Weekly Time Series
  const weeklyData = await fetchAPI('TIME_SERIES_WEEKLY', company.symbol);
  if (weeklyData && !weeklyData._empty) {
    result.weeklyPrices = parseTimeSeriesData(weeklyData, 'Weekly Time Series');
    console.log(`    ✓ ${result.weeklyPrices.length} weekly data points (post-2020)`);
  }
  await sleep(DELAY_MS);
  if (rateLimited) return result;

  // 4. Monthly Time Series
  const monthlyData = await fetchAPI('TIME_SERIES_MONTHLY', company.symbol);
  if (monthlyData && !monthlyData._empty) {
    result.monthlyPrices = parseTimeSeriesData(monthlyData, 'Monthly Time Series');
    console.log(`    ✓ ${result.monthlyPrices.length} monthly data points (post-2020)`);
  }
  await sleep(DELAY_MS);
  if (rateLimited) return result;

  // 5. Company Overview
  const overviewData = await fetchAPI('OVERVIEW', company.symbol);
  if (overviewData && !overviewData._empty) {
    result.companyOverview = overviewData;
    console.log(`    ✓ Company overview loaded`);
  }
  await sleep(DELAY_MS);
  if (rateLimited) return result;

  // 6. Income Statement
  const incomeData = await fetchAPI('INCOME_STATEMENT', company.symbol);
  if (incomeData && !incomeData._empty) {
    result.incomeStatement = {
      annual: (incomeData.annualReports || []).filter(r => r.fiscalDateEnding >= CUTOFF_DATE),
      quarterly: (incomeData.quarterlyReports || []).filter(r => r.fiscalDateEnding >= CUTOFF_DATE),
    };
    console.log(`    ✓ Income statement: ${result.incomeStatement.annual.length} annual, ${result.incomeStatement.quarterly.length} quarterly`);
  }
  await sleep(DELAY_MS);
  if (rateLimited) return result;

  // 7. Balance Sheet
  const balanceData = await fetchAPI('BALANCE_SHEET', company.symbol);
  if (balanceData && !balanceData._empty) {
    result.balanceSheet = {
      annual: (balanceData.annualReports || []).filter(r => r.fiscalDateEnding >= CUTOFF_DATE),
      quarterly: (balanceData.quarterlyReports || []).filter(r => r.fiscalDateEnding >= CUTOFF_DATE),
    };
    console.log(`    ✓ Balance sheet: ${result.balanceSheet.annual.length} annual, ${result.balanceSheet.quarterly.length} quarterly`);
  }
  await sleep(DELAY_MS);
  if (rateLimited) return result;

  // 8. Cash Flow
  const cashData = await fetchAPI('CASH_FLOW', company.symbol);
  if (cashData && !cashData._empty) {
    result.cashFlow = {
      annual: (cashData.annualReports || []).filter(r => r.fiscalDateEnding >= CUTOFF_DATE),
      quarterly: (cashData.quarterlyReports || []).filter(r => r.fiscalDateEnding >= CUTOFF_DATE),
    };
    console.log(`    ✓ Cash flow: ${result.cashFlow.annual.length} annual, ${result.cashFlow.quarterly.length} quarterly`);
  }
  await sleep(DELAY_MS);
  if (rateLimited) return result;

  // 9. Earnings
  const earningsData = await fetchAPI('EARNINGS', company.symbol);
  if (earningsData && !earningsData._empty) {
    result.earnings = {
      annual: (earningsData.annualEarnings || []).filter(r => r.fiscalDateEnding >= CUTOFF_DATE),
      quarterly: (earningsData.quarterlyEarnings || []).filter(r => r.fiscalDateEnding >= CUTOFF_DATE),
    };
    console.log(`    ✓ Earnings: ${result.earnings.annual.length} annual, ${result.earnings.quarterly.length} quarterly`);
  }
  await sleep(DELAY_MS);

  // Compute derived metrics
  result.derivedMetrics = computeDerivedMetrics(result);
  console.log(`    ✓ Derived metrics computed`);

  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const resumeMode = args.includes('--resume');
  const singleCompany = args.find(a => a.startsWith('--company='))?.split('=')[1];

  let companies = COMPANIES;
  if (singleCompany) {
    companies = COMPANIES.filter(c => c.id === singleCompany);
    if (companies.length === 0) {
      console.error(`Company "${singleCompany}" not found. Available: ${COMPANIES.map(c => c.id).join(', ')}`);
      process.exit(1);
    }
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Alpha Vantage Data Fetcher - Kompete Industry Intel');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Companies: ${companies.length}`);
  console.log(`  Endpoints per company: ${ENDPOINTS.length}`);
  console.log(`  Total API calls needed: ${companies.length * ENDPOINTS.length}`);
  console.log(`  Data cutoff: Post ${CUTOFF_DATE}`);
  console.log(`  Resume mode: ${resumeMode ? 'ON (skipping already fetched)' : 'OFF'}`);
  console.log(`  Delay between calls: ${DELAY_MS / 1000}s`);
  console.log('═══════════════════════════════════════════════════════════════');

  fs.mkdirSync(DATA_DIR, { recursive: true });

  const allData = [];
  const skipped = [];
  const errors = [];

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    const outFile = path.join(DATA_DIR, company.id, 'alphavantage-market-data.json');

    // Resume: skip if already fetched
    if (resumeMode && fs.existsSync(outFile)) {
      console.log(`\n⏭  [${i + 1}/${companies.length}] Skipping ${company.name} (already fetched)`);
      try {
        const existing = JSON.parse(fs.readFileSync(outFile, 'utf8'));
        allData.push(existing);
        skipped.push(company.name);
      } catch (e) {
        console.warn(`  ⚠ Couldn't read existing file, re-fetching...`);
      }
      continue;
    }

    console.log(`\n[${i + 1}/${companies.length}] Processing ${company.name}...`);

    if (rateLimited) {
      console.log(`  ⚠ Rate limited — stopping. Run again with --resume to continue.`);
      break;
    }

    try {
      const data = await fetchCompanyData(company);
      allData.push(data);

      // Save individual company file immediately (in case of rate limit)
      const companyDir = path.join(DATA_DIR, company.id);
      fs.mkdirSync(companyDir, { recursive: true });
      fs.writeFileSync(outFile, JSON.stringify(data, null, 2));
      console.log(`  💾 Saved → data-sources/extracted/${company.id}/alphavantage-market-data.json`);
    } catch (e) {
      console.error(`  ✗ Failed: ${e.message}`);
      errors.push({ company: company.name, error: e.message });
    }
  }

  // Save consolidated file with all data
  const consolidated = {
    fetchedAt: new Date().toISOString(),
    source: 'Alpha Vantage (alphavantage.co)',
    apiKey: 'Financial_API_Key',
    dataCutoff: CUTOFF_DATE,
    companiesTotal: COMPANIES.length,
    companiesFetched: allData.length,
    companiesSkipped: skipped.length,
    apiCallsMade: apiCallCount,
    rateLimited,
    companies: allData,
  };

  fs.writeFileSync(
    path.join(DATA_DIR, 'alphavantage-all-companies.json'),
    JSON.stringify(consolidated, null, 2)
  );

  // Save lightweight summary for dashboard
  const summary = allData.map(c => ({
    companyId: c.companyId,
    symbol: c.symbol,
    companyName: c.companyName,
    // Current market data
    currentPrice: c.currentQuote?.price,
    change: c.currentQuote?.change,
    changePercent: c.currentQuote?.changePercent,
    volume: c.currentQuote?.volume,
    latestTradingDay: c.currentQuote?.latestTradingDay,
    previousClose: c.currentQuote?.previousClose,
    dayHigh: c.currentQuote?.high,
    dayLow: c.currentQuote?.low,
    // Derived metrics
    ...c.derivedMetrics,
    // Data availability
    hasDailyPrices: (c.dailyPrices?.length || 0) > 0,
    hasWeeklyPrices: (c.weeklyPrices?.length || 0) > 0,
    hasMonthlyPrices: (c.monthlyPrices?.length || 0) > 0,
    hasOverview: !!c.companyOverview && !c.companyOverview._empty,
    hasIncomeStatement: (c.incomeStatement?.quarterly?.length || 0) > 0,
    hasBalanceSheet: (c.balanceSheet?.quarterly?.length || 0) > 0,
    hasCashFlow: (c.cashFlow?.quarterly?.length || 0) > 0,
    hasEarnings: (c.earnings?.quarterly?.length || 0) > 0,
  }));

  fs.writeFileSync(
    path.join(DATA_DIR, 'alphavantage-summary.json'),
    JSON.stringify({ fetchedAt: new Date().toISOString(), dataCutoff: CUTOFF_DATE, companies: summary }, null, 2)
  );

  // Print report
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  REPORT');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  API calls made: ${apiCallCount}`);
  console.log(`  Companies fetched: ${allData.length - skipped.length} (new) + ${skipped.length} (cached)`);
  if (errors.length > 0) {
    console.log(`  Errors: ${errors.length}`);
    errors.forEach(e => console.log(`    ✗ ${e.company}: ${e.error}`));
  }
  if (rateLimited) {
    console.log(`\n  ⚠ RATE LIMITED — Run again with --resume to continue:`);
    console.log(`    node scripts/fetch-alphavantage.mjs --resume`);
  }
  console.log(`\n  📁 Output files:`);
  console.log(`    data-sources/extracted/<company>/alphavantage-market-data.json`);
  console.log(`    data-sources/extracted/alphavantage-all-companies.json`);
  console.log(`    data-sources/extracted/alphavantage-summary.json`);
  console.log('═══════════════════════════════════════════════════════════════');
}

main().catch(console.error);
