/**
 * Compute real Market Pulse data from actual company financials.
 * Reads data from the current data.js financial arrays.
 * Outputs: EBITDA bands (avg/P75/P25 per quarter), revenue growth per quarter.
 */

// Hardcode the real EBITDA margins and revenues from data.js
// 15 companies, 15 quarters each (indices 0-14)
const financials = {
  whirlpool:    { ebitda: [null,null,6.84,9.44,8.58,8.02,7.16,11.88,10.69,8.11,7.04,11.82,10.9,6.68,8], revenue: [null,null,1302,1673,2039,1522,1536,1734,2497,1713,1705,2005,2432,1647,1774] },
  voltas:       { ebitda: [null,null,2.74,6.76,4.91,2.14,0.19,3.9,8.27,5.57,5.89,6.61,4.34,2.47,5.41], revenue: [null,null,2006,2957,3360,2293,2626,4203,4921,2619,3105,4768,3939,2347,3071] },
  bluestar:     { ebitda: [null,null,6.69,7.7,7.55,7.72,7.94,8.11,9.28,7.86,8.69,7.81,8.05,9.29,9.09], revenue: [null,null,1794,2624,2226,1890,2241,3328,2865,2276,2807,4019,2982,2422,2925] },
  crompton:     { ebitda: [null,null,12.01,13.46,11.45,11.62,10.75,12.19,12.58,12.76,12.78,14.75,11.61,10.54,12.59], revenue: [null,null,1516,1791,1877,1782,1693,1961,2138,1896,1769,2061,1998,1916,1898] },
  bajaj_elec:   { ebitda: [null,null,9.4,9.06,8.18,9.16,7.17,6.73,9.26,7.78,9.53,10.59,6.57,8.49,4.09], revenue: [null,null,1309,1292,1112,1113,1228,1188,1155,1118,1290,1265,1065,1107,1051] },
  vguard:       { ebitda: [null,null,8.55,10.18,10.29,9.88,10.39,11.17,12.05,10.2,10.17,11.05,10.23,10.14,10.68], revenue: [null,null,982,1139,1215,1134,1165,1343,1477,1294,1269,1538,1466,1341,1404] },
  ifb:          { ebitda: [null,null,6.01,5.94,5.52,8.45,7.75,6.79,8.59,7.96,9.53,6.75,6.95,9.34,7.43], revenue: [null,null,999,1010,1086,1101,1161,1090,1269,1219,1270,1334,1338,1370,1413] },
  havells:      { ebitda: [null,null,12.09,12.43,9.89,11.64,11.8,13.38,11.44,10.35,10.84,13.25,11.4,11.38,11.18], revenue: [null,null,4128,4859,4834,3900,4414,5442,5806,4539,4889,6544,5455,4779,5588] },
  symphony:     { ebitda: [null,null,18.41,9.74,10.93,17.45,20.24,18.98,22.65,27.34,14.46,26.51,11.16,16.56,17.32], revenue: [null,null,277,308,302,275,247,332,393,289,242,381,251,163,179] },
  orient:       { ebitda: [null,null,9.34,9.12,8.22,6.17,8.51,5.84,7.68,8.48,9.91,10.32,8.45,8.11,9.6], revenue: [null,null,739,658,706,567,752,788,755,660,817,862,769,703,906] },
  dixon:        { ebitda: [null,null,5.82,6.13,5.07,4.75,4.67,5.0,4.6,4.27,4.46,5.14,4.48,4.42,4.81], revenue: [null,null,2405,3065,3272,4943,4818,4658,6580,11534,10454,10293,12836,14855,10672] },
  amber:        { ebitda: [null,null,8.52,8.07,10.29,11.3,9.66,9.66,10.22,9.95,9.77,9.06,9.03,9.35,11.17], revenue: [null,null,1348,3003,1702,927,1295,2805,2401,1685,2133,3754,3449,1647,2943] },
  ttk_prestige: { ebitda: [null,null,13.38,15.71,12.93,13.31,13.82,15.09,12.07,11.87,13.2,10.77,9.69,13.79,11.49], revenue: [null,null,695,611,588,729,738,623,588,750,727,650,609,834,801] },
  butterfly:    { ebitda: [null,null,10.48,6.42,10.96,9.74,2.94,-9.04,8.24,11.24,9.66,11.23,9.63,11.6,10.61], revenue: [null,null,248,187,219,308,238,166,182,258,238,187,187,293,245] },
};

function percentile(arr, pct) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (pct / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

const companies = Object.keys(financials);

// Compute EBITDA bands per quarter
console.log('// === MARGIN OUTLOOK (computed from real company EBITDA margins) ===');
const sectorAvg = [];
const topQ = [];
const botQ = [];

for (let q = 0; q < 15; q++) {
  const vals = companies.map(c => financials[c].ebitda[q]).filter(v => v !== null);
  if (vals.length === 0) {
    sectorAvg.push(null);
    topQ.push(null);
    botQ.push(null);
  } else {
    sectorAvg.push(+(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1));
    topQ.push(+percentile(vals, 75).toFixed(1));
    botQ.push(+percentile(vals, 25).toFixed(1));
  }
}
console.log('sectorAvgEbitda:', JSON.stringify(sectorAvg));
console.log('topQuartile:    ', JSON.stringify(topQ));
console.log('bottomQuartile: ', JSON.stringify(botQ));

// Compute sector revenue growth (YoY %)
// Quarter q vs quarter q-4 (same quarter previous year)
console.log('\n// === DEMAND SIGNALS (sector aggregate revenue YoY growth %) ===');
const revenueGrowth = [];
for (let q = 0; q < 15; q++) {
  if (q < 6) { // Need q-4 which starts at idx 2, so growth starts at idx 6
    revenueGrowth.push(null);
    continue;
  }
  const currTotal = companies.reduce((s, c) => {
    const v = financials[c].revenue[q];
    return v !== null ? s + v : s;
  }, 0);
  const prevTotal = companies.reduce((s, c) => {
    const v = financials[c].revenue[q - 4];
    return v !== null ? s + v : s;
  }, 0);
  if (prevTotal > 0) {
    revenueGrowth.push(+((currTotal - prevTotal) / prevTotal * 100).toFixed(1));
  } else {
    revenueGrowth.push(null);
  }
}
console.log('sectorRevenueGrowthYoY:', JSON.stringify(revenueGrowth));

// Compute per-company revenue growth for "price growth" proxy
// We can't split volume vs price, so we'll just show total sector revenue growth
// and note that volume/price split is not available

// Sub-Sector aggregations
console.log('\n// === SUB-SECTOR AGGREGATIONS ===');

// Company subCategories (from data.js companies array)
const subCats = {
  whirlpool: 'White Goods', voltas: 'White Goods', bluestar: 'White Goods',
  crompton: 'Consumer Electronics', bajaj_elec: 'Consumer Electronics',
  vguard: 'Consumer Electronics', ifb: 'White Goods', havells: 'Consumer Electronics',
  symphony: 'White Goods', orient: 'Consumer Electronics',
  dixon: 'Consumer Electronics', amber: 'White Goods',
  ttk_prestige: 'Consumer Electronics', butterfly: 'Consumer Electronics',
};

// Compute aggregate revenue by sub-category for latest quarter (idx 14 = Q3 FY26)
// and same quarter last year (idx 10 = Q3 FY25)
const cats = ['White Goods', 'Consumer Electronics'];
for (const cat of cats) {
  const ids = Object.entries(subCats).filter(([_, c]) => c === cat).map(([id]) => id);
  const latestRev = ids.reduce((s, id) => s + (financials[id].revenue[14] || 0), 0);
  const lastYearRev = ids.reduce((s, id) => s + (financials[id].revenue[10] || 0), 0);
  const annualizedSize = Math.round(latestRev * 4); // Annualize quarterly
  const growth = lastYearRev > 0 ? +((latestRev - lastYearRev) / lastYearRev * 100).toFixed(1) : null;
  console.log(`${cat}: Q3 FY26 revenue = ${latestRev} Cr, annualized ~${annualizedSize} Cr, YoY growth = ${growth}%`);
  console.log(`  Companies: ${ids.join(', ')}`);
}

// Total market
const totalLatest = companies.reduce((s, c) => s + (financials[c].revenue[14] || 0), 0);
const totalLastYear = companies.reduce((s, c) => s + (financials[c].revenue[10] || 0), 0);
console.log(`\nTotal sector: Q3 FY26 = ${totalLatest} Cr, annualized ~${totalLatest * 4} Cr, YoY = ${((totalLatest - totalLastYear) / totalLastYear * 100).toFixed(1)}%`);

// Cost structure - OPM quartiles across companies (FY25 data)
console.log('\n// === COST STRUCTURE (OPM % = proxy for cost efficiency) ===');
const opmFY25 = {
  whirlpool: 7, voltas: 6, bluestar: 7, crompton: 11,
  bajaj_elec: 6, vguard: 9, ifb: 6, havells: 10,
  symphony: 20, orient: 7, dixon: 4, amber: 7,
  ttk_prestige: 10, butterfly: 8
};
const opmVals = Object.values(opmFY25).sort((a, b) => a - b);
console.log('OPM values sorted:', opmVals);
console.log('Expenses/Sales range: ' + (100 - Math.max(...opmVals)) + '% to ' + (100 - Math.min(...opmVals)) + '%');
console.log('Top quartile OPM:', percentile(opmVals, 75).toFixed(1));
console.log('Median OPM:', percentile(opmVals, 50).toFixed(1));
console.log('Bottom quartile OPM:', percentile(opmVals, 25).toFixed(1));
// Therefore: raw materials + expenses as % of revenue:
console.log('Cost structure (Expenses/Revenue):');
console.log('  Top quartile (best): ' + (100 - percentile(opmVals, 75)).toFixed(1) + '%');
console.log('  Median: ' + (100 - percentile(opmVals, 50)).toFixed(1) + '%');
console.log('  Bottom quartile (worst): ' + (100 - percentile(opmVals, 25)).toFixed(1) + '%');
