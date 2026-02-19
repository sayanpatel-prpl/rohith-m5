/**
 * Extract all available data from source files for dashboard population.
 * Reads screener-financials.json for each company + sovrenn-intelligence.json
 * Outputs structured data ready for data.js integration.
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'data_sources', 'extracted');

// Company ID → source folder mapping (from memory.md)
const COMPANY_MAP = {
  whirlpool: 'whirlpool',
  voltas: 'voltas',
  bluestar: 'bluestar',
  crompton: 'crompton',
  bajaj_elec: 'bajaj',
  vguard: 'vguard',
  ifb: 'ifb',
  havells: 'havells',
  symphony: 'symphony',
  orient: 'orient',
  dixon: 'dixon',
  amber: 'amber',
  ttk_prestige: 'ttk',
  butterfly: 'butterfly',
  // bosch_jch has NO source files
};

// Quarter index mapping: 15 slots
// idx 0 = Q1 FY23 (Jun 2022), idx 1 = Q2 FY23 (Sep 2022)
// idx 2 = Q3 FY23 (Dec 2022), idx 3 = Q4 FY23 (Mar 2023)
// idx 4-7 = FY24, idx 8-11 = FY25, idx 12-14 = Q1-Q3 FY26
// Annual data maps: FY23=Mar2023 → idx 2-3, FY24=Mar2024 → idx 4-7, FY25=Mar2025 → idx 8-14

function parseNum(val) {
  if (val === null || val === undefined || val === '' || val === '-') return null;
  const s = String(val).replace(/,/g, '').replace(/%/g, '').trim();
  if (s === '' || s === '-') return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function getRowValue(data, rowName, colHeader) {
  const row = data.find(r => r.col_0 === rowName);
  if (!row) return null;
  return parseNum(row[colHeader]);
}

// Map annual FY data to 15-quarter array
// For annual metrics, same value for all quarters in that FY
function mapAnnualToQuarters(annualValues) {
  // annualValues: { 'Mar 2023': val, 'Mar 2024': val, 'Mar 2025': val }
  const arr = new Array(15).fill(null);

  const fy23 = annualValues['Mar 2023'];
  const fy24 = annualValues['Mar 2024'];
  const fy25 = annualValues['Mar 2025'];

  // FY23: idx 0-3 (but idx 0-1 may not have quarterly financials)
  // Use FY23 annual for idx 2-3 (Q3-Q4 FY23)
  if (fy23 !== null) { arr[2] = fy23; arr[3] = fy23; }

  // FY24: idx 4-7
  if (fy24 !== null) { arr[4] = fy24; arr[5] = fy24; arr[6] = fy24; arr[7] = fy24; }

  // FY25: idx 8-11
  if (fy25 !== null) { arr[8] = fy25; arr[9] = fy25; arr[10] = fy25; arr[11] = fy25; }

  // FY26: idx 12-14 → use FY25 (latest available annual)
  if (fy25 !== null) { arr[12] = fy25; arr[13] = fy25; arr[14] = fy25; }

  return arr;
}

function extractCompanyData(companyId, folder) {
  const screenerPath = path.join(BASE, folder, 'screener-financials.json');
  if (!fs.existsSync(screenerPath)) {
    console.error(`  [SKIP] No screener-financials.json for ${companyId}`);
    return null;
  }

  const screener = JSON.parse(fs.readFileSync(screenerPath, 'utf8'));
  const result = { companyId, folder };

  // === RATIOS ===
  if (screener.ratios && screener.ratios.data) {
    const rd = screener.ratios.data;
    const rh = screener.ratios.headers;

    // Extract annual values for FY23, FY24, FY25
    const annualCols = ['Mar 2023', 'Mar 2024', 'Mar 2025'];

    // Inventory Days
    const invDays = {};
    annualCols.forEach(col => { invDays[col] = getRowValue(rd, 'Inventory Days', col); });
    result.inventoryDays = mapAnnualToQuarters(invDays);
    result.inventoryDays_annual = invDays;

    // Working Capital Days
    const wcDays = {};
    annualCols.forEach(col => { wcDays[col] = getRowValue(rd, 'Working Capital Days', col); });
    result.workingCapDays = mapAnnualToQuarters(wcDays);
    result.workingCapDays_annual = wcDays;

    // ROCE %
    const roce = {};
    annualCols.forEach(col => { roce[col] = getRowValue(rd, 'ROCE %', col); });
    result.roce = mapAnnualToQuarters(roce);
    result.roce_annual = roce;

    // Debtor Days
    const debtorDays = {};
    annualCols.forEach(col => { debtorDays[col] = getRowValue(rd, 'Debtor Days', col); });
    result.debtorDays_annual = debtorDays;

    // Days Payable
    const daysPayable = {};
    annualCols.forEach(col => { daysPayable[col] = getRowValue(rd, 'Days Payable', col); });
    result.daysPayable_annual = daysPayable;

    // Cash Conversion Cycle
    const ccc = {};
    annualCols.forEach(col => { ccc[col] = getRowValue(rd, 'Cash Conversion Cycle', col); });
    result.cashConversionCycle_annual = ccc;
  }

  // === BALANCE SHEET ===
  if (screener.balance_sheet && screener.balance_sheet.data) {
    const bd = screener.balance_sheet.data;
    const annualCols = ['Mar 2023', 'Mar 2024', 'Mar 2025'];

    const borrowings = {};
    annualCols.forEach(col => { borrowings[col] = getRowValue(bd, 'Borrowings +', col); });
    result.borrowings_annual = borrowings;

    // Other Assets includes cash — but we need a better proxy
    // Total Liabilities and Total Assets for context
    const totalAssets = {};
    annualCols.forEach(col => { totalAssets[col] = getRowValue(bd, 'Total Assets', col); });
    result.totalAssets_annual = totalAssets;
  }

  // === CASH FLOW ===
  if (screener.cash_flow && screener.cash_flow.data) {
    const cd = screener.cash_flow.data;
    const annualCols = ['Mar 2023', 'Mar 2024', 'Mar 2025'];

    const cfi = {};
    annualCols.forEach(col => { cfi[col] = getRowValue(cd, 'Cash from Investing Activity +', col); });
    result.cashFromInvesting_annual = cfi;

    const cfo = {};
    annualCols.forEach(col => { cfo[col] = getRowValue(cd, 'Cash from Operating Activity +', col); });
    result.cashFromOperating_annual = cfo;
  }

  // === ANNUAL P&L (for cost structure) ===
  if (screener.profit_and_loss && screener.profit_and_loss.data) {
    const pd = screener.profit_and_loss.data;
    const annualCols = ['Mar 2023', 'Mar 2024', 'Mar 2025'];

    const annualSales = {};
    annualCols.forEach(col => { annualSales[col] = getRowValue(pd, 'Sales +', col); });
    result.annualSales = annualSales;

    const annualExpenses = {};
    annualCols.forEach(col => { annualExpenses[col] = getRowValue(pd, 'Expenses +', col); });
    result.annualExpenses = annualExpenses;

    const annualOpProfit = {};
    annualCols.forEach(col => { annualOpProfit[col] = getRowValue(pd, 'Operating Profit', col); });
    result.annualOpProfit = annualOpProfit;

    const annualOPM = {};
    annualCols.forEach(col => { annualOPM[col] = getRowValue(pd, 'OPM %', col); });
    result.annualOPM = annualOPM;

    const annualInterest = {};
    annualCols.forEach(col => { annualInterest[col] = getRowValue(pd, 'Interest', col); });
    result.annualInterest = annualInterest;

    const annualDepr = {};
    annualCols.forEach(col => { annualDepr[col] = getRowValue(pd, 'Depreciation', col); });
    result.annualDepreciation = annualDepr;

    const annualNetProfit = {};
    annualCols.forEach(col => { annualNetProfit[col] = getRowValue(pd, 'Net Profit +', col); });
    result.annualNetProfit = annualNetProfit;
  }

  // === COMPUTE DERIVED METRICS ===

  // Net Debt/EBITDA = (Borrowings) / (Operating Profit + Depreciation)
  // Note: We don't have cash separately, so use Borrowings as gross debt proxy
  // EBITDA = Operating Profit + Depreciation (from annual P&L)
  const ndEbitda = {};
  ['Mar 2023', 'Mar 2024', 'Mar 2025'].forEach(col => {
    const borr = result.borrowings_annual ? result.borrowings_annual[col] : null;
    const opProfit = result.annualOpProfit ? result.annualOpProfit[col] : null;
    const depr = result.annualDepreciation ? result.annualDepreciation[col] : null;
    if (borr !== null && opProfit !== null && depr !== null) {
      const ebitda = opProfit + depr;
      ndEbitda[col] = ebitda > 0 ? +(borr / ebitda).toFixed(2) : null;
    } else {
      ndEbitda[col] = null;
    }
  });
  result.netDebtEbitda = mapAnnualToQuarters(ndEbitda);
  result.netDebtEbitda_annual = ndEbitda;

  // Capex Intensity = abs(Cash from Investing) / Annual Sales * 100
  const capex = {};
  ['Mar 2023', 'Mar 2024', 'Mar 2025'].forEach(col => {
    const cfi = result.cashFromInvesting_annual ? result.cashFromInvesting_annual[col] : null;
    const sales = result.annualSales ? result.annualSales[col] : null;
    if (cfi !== null && sales !== null && sales > 0) {
      capex[col] = +(Math.abs(cfi) / sales * 100).toFixed(1);
    } else {
      capex[col] = null;
    }
  });
  result.capexIntensity = mapAnnualToQuarters(capex);
  result.capexIntensity_annual = capex;

  return result;
}

// === MAIN ===
console.log('=== EXTRACTING DATA FROM ALL COMPANIES ===\n');

const allCompanyData = {};
for (const [companyId, folder] of Object.entries(COMPANY_MAP)) {
  console.log(`Processing ${companyId} (folder: ${folder})...`);
  const data = extractCompanyData(companyId, folder);
  if (data) {
    allCompanyData[companyId] = data;
    console.log(`  ✓ Inventory Days FY25: ${data.inventoryDays_annual['Mar 2025']}`);
    console.log(`  ✓ WC Days FY25: ${data.workingCapDays_annual['Mar 2025']}`);
    console.log(`  ✓ ROCE FY25: ${data.roce_annual['Mar 2025']}%`);
    console.log(`  ✓ Net Debt/EBITDA FY25: ${data.netDebtEbitda_annual['Mar 2025']}`);
    console.log(`  ✓ Capex Intensity FY25: ${data.capexIntensity_annual['Mar 2025']}%`);
  }
}

// === OUTPUT FOR DATA.JS ===
console.log('\n\n=== DATA.JS ARRAYS (copy-paste ready) ===\n');

// Output each metric as arrays
const metrics = ['inventoryDays', 'workingCapDays', 'roce', 'netDebtEbitda', 'capexIntensity'];
const allIds = Object.keys(COMPANY_MAP).concat(['bosch_jch']);

for (const metric of metrics) {
  console.log(`\n// --- ${metric} ---`);
  for (const id of allIds) {
    const d = allCompanyData[id];
    if (!d) {
      const nullArr = new Array(15).fill(null);
      console.log(`// ${id}: ${metric}: [${nullArr.join(',')}],`);
    } else {
      const arr = d[metric];
      const formatted = arr.map(v => v === null ? 'null' : v).join(',');
      console.log(`// ${id}: ${metric}: [${formatted}],`);
    }
  }
}

// === ANNUAL SUMMARIES ===
console.log('\n\n=== ANNUAL SUMMARY TABLE ===\n');
console.log('Company | Inv Days FY25 | WC Days FY25 | ROCE FY25 | Debt/EBITDA FY25 | Capex% FY25 | Annual Sales FY25');
console.log('--------|--------------|-------------|-----------|-----------------|------------|------------------');
for (const id of allIds) {
  const d = allCompanyData[id];
  if (!d) {
    console.log(`${id} | N/A | N/A | N/A | N/A | N/A | N/A`);
    continue;
  }
  console.log(`${id} | ${d.inventoryDays_annual['Mar 2025']} | ${d.workingCapDays_annual['Mar 2025']} | ${d.roce_annual['Mar 2025']}% | ${d.netDebtEbitda_annual['Mar 2025']} | ${d.capexIntensity_annual['Mar 2025']}% | ${d.annualSales ? d.annualSales['Mar 2025'] : 'N/A'}`);
}

// === COST STRUCTURE FOR SUB-SECTOR ===
console.log('\n\n=== COST STRUCTURE (OPM% = 100 - Expenses/Sales*100) ===\n');
console.log('Company | OPM FY23 | OPM FY24 | OPM FY25 | Expenses/Sales FY25');
for (const id of allIds) {
  const d = allCompanyData[id];
  if (!d || !d.annualOPM) { console.log(`${id} | N/A`); continue; }
  const opm23 = d.annualOPM['Mar 2023'];
  const opm24 = d.annualOPM['Mar 2024'];
  const opm25 = d.annualOPM['Mar 2025'];
  const exp25 = d.annualExpenses ? d.annualExpenses['Mar 2025'] : null;
  const sal25 = d.annualSales ? d.annualSales['Mar 2025'] : null;
  const ratio = (exp25 && sal25) ? (exp25/sal25*100).toFixed(1) : 'N/A';
  console.log(`${id} | ${opm23}% | ${opm24}% | ${opm25}% | ${ratio}%`);
}

// === SOVRENN DEALS ===
console.log('\n\n=== SOVRENN DEALS (2025-2026 only) ===\n');
try {
  const sovrenn = JSON.parse(fs.readFileSync(path.join(BASE, 'sovrenn-intelligence.json'), 'utf8'));
  let allDeals = [];
  for (const company of sovrenn) {
    if (company.dealActivity) {
      for (const deal of company.dealActivity) {
        // Parse date — format varies: "9th Feb 2026", "1st Dec 2025"
        const dateStr = deal.date || '';
        const year = dateStr.match(/20\d{2}/);
        if (year && (year[0] === '2025' || year[0] === '2026')) {
          allDeals.push({
            companyId: company.companyId,
            date: deal.date,
            type: deal.type,
            description: deal.description ? deal.description.substring(0, 200) : '',
            valueCr: deal.valueCr,
          });
        }
      }
    }
  }
  // Sort by date (most recent first)
  allDeals.sort((a, b) => {
    const parseDate = (d) => {
      const m = d.match(/(\d+)\w*\s+(\w+)\s+(\d{4})/);
      if (!m) return 0;
      const months = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
      return new Date(parseInt(m[3]), months[m[2]] || 0, parseInt(m[1])).getTime();
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  console.log(`Total 2025-2026 deals found: ${allDeals.length}`);
  allDeals.forEach((d, i) => {
    console.log(`${i+1}. [${d.companyId}] ${d.date} | ${d.type} | ₹${d.valueCr || '?'} Cr | ${d.description}`);
  });
} catch (e) {
  console.error('Error reading sovrenn:', e.message);
}

// === SOVRENN SENTIMENT ===
console.log('\n\n=== SOVRENN QUARTERLY SENTIMENT (FY25-FY26) ===\n');
try {
  const sovrenn = JSON.parse(fs.readFileSync(path.join(BASE, 'sovrenn-intelligence.json'), 'utf8'));
  const tagScores = { 'EXCELLENT RESULTS': 90, 'GOOD RESULTS': 70, 'AVERAGE RESULTS': 50, 'POOR RESULTS': 25 };

  for (const company of sovrenn) {
    if (!company.quarterlyResults || company.quarterlyResults.length === 0) continue;
    // Get last 4 quarters
    const recent = company.quarterlyResults.slice(0, 4);
    const scores = recent.map(q => ({
      quarter: q.quarter,
      tag: q.tag,
      score: tagScores[q.tag] || 50,
      salesGrowth: q.salesGrowthYoY,
      profitGrowth: q.profitGrowthYoY,
    }));
    // Weighted avg: most recent gets higher weight
    const weights = [4, 3, 2, 1];
    let totalW = 0, weightedSum = 0;
    scores.forEach((s, i) => {
      if (i < weights.length) {
        weightedSum += s.score * weights[i];
        totalW += weights[i];
      }
    });
    const avgScore = totalW > 0 ? Math.round(weightedSum / totalW) : 50;
    console.log(`${company.companyId}: Overall=${avgScore} | ${scores.map(s => `${s.quarter}:${s.tag}(${s.score})`).join(', ')}`);
  }
} catch (e) {
  console.error('Error reading sovrenn for sentiment:', e.message);
}

// Write full JSON output for programmatic use
const output = {
  companies: allCompanyData,
  timestamp: new Date().toISOString(),
};
const outPath = path.join(__dirname, '..', 'data_sources', 'extracted', 'dashboard-extraction.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`\n\nFull extraction saved to: ${outPath}`);
