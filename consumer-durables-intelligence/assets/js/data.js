/*
 * Consumer Durables Intelligence Dashboard - Data Layer
 * Built following Kompete design guidelines:
 * - Color Scheme: Kompete Navy (#0F1F3D), Deep Blue (#1E3A8A), Intelligence Blue (#3B82F6)
 * - Typography: Inter (primary), IBM Plex Mono (data)
 * - Component Pattern: Cards, tables, status badges from Kompete frontend
 * - Period: Q1 FY23 - Q3 FY26 (Indian fiscal year format, Feb 2026 current)
 */

const DATA = {
  // ============================================================
  // COMPANY MASTER DATA
  // ============================================================
  companies: [
    {
      id: 'whirlpool',
      name: 'Whirlpool of India',
      ticker: 'WHIRLPOOL',
      subCategory: 'White Goods',
      marketCap: 18500, // ₹ Cr
      headquarters: 'Gurugram, Haryana',
      founded: 1996,
      employees: 4200,
      dealerNetwork: 8500,
      plants: 3,
      keyProducts: ['Refrigerators', 'Washing Machines', 'ACs', 'Microwaves'],
      parentCompany: 'Whirlpool Corporation (USA)',
      promoterHolding: 39.76, // Source: screener-financials.json shareholding Dec 2025
      exportRevenuePct: 8.2,
    },
    {
      id: 'voltas',
      name: 'Voltas',
      ticker: 'VOLTAS',
      subCategory: 'White Goods',
      marketCap: 42000,
      headquarters: 'Mumbai, Maharashtra',
      founded: 1954,
      employees: 6800,
      dealerNetwork: 22000,
      plants: 4,
      keyProducts: ['ACs', 'Refrigerators', 'Washing Machines', 'Air Coolers'],
      parentCompany: 'Tata Group',
      promoterHolding: 30.30, // Source: screener-financials.json shareholding Dec 2025
      exportRevenuePct: 5.1,
    },
    {
      id: 'bluestar',
      name: 'Blue Star',
      ticker: 'BLUESTAR',
      subCategory: 'White Goods',
      marketCap: 32000,
      headquarters: 'Mumbai, Maharashtra',
      founded: 1943,
      employees: 5200,
      dealerNetwork: 6000,
      plants: 5,
      keyProducts: ['ACs', 'Commercial Refrigeration', 'Water Purifiers', 'Air Purifiers'],
      parentCompany: 'Independent',
      promoterHolding: 36.48, // Source: screener-financials.json shareholding Dec 2025
      exportRevenuePct: 12.5,
    },
    {
      id: 'crompton',
      name: 'Crompton Greaves Consumer',
      ticker: 'CROMPTON',
      subCategory: 'Consumer Electronics',
      marketCap: 22000,
      headquarters: 'Mumbai, Maharashtra',
      founded: 2015,
      employees: 3800,
      dealerNetwork: 15000,
      plants: 6,
      keyProducts: ['Fans', 'Lighting', 'Pumps', 'Kitchen Appliances'],
      parentCompany: 'Independent (Demerged)',
      promoterHolding: 0.0, // Source: screener-financials.json — no Promoters row (widely held)
      exportRevenuePct: 3.8,
    },
    {
      id: 'bajaj_elec',
      name: 'Bajaj Electricals',
      ticker: 'BAJAJELEC',
      subCategory: 'Consumer Electronics',
      marketCap: 12500,
      headquarters: 'Mumbai, Maharashtra',
      founded: 1938,
      employees: 3200,
      dealerNetwork: 12000,
      plants: 4,
      keyProducts: ['Lighting', 'Fans', 'Kitchen Appliances', 'Morphy Richards'],
      parentCompany: 'Bajaj Group',
      promoterHolding: 62.70, // Source: screener-financials.json shareholding Dec 2025
      exportRevenuePct: 2.1,
    },
    {
      id: 'vguard',
      name: 'V-Guard Industries',
      ticker: 'VGUARD',
      subCategory: 'Consumer Electronics',
      marketCap: 18000,
      headquarters: 'Kochi, Kerala',
      founded: 1977,
      employees: 4100,
      dealerNetwork: 18000,
      plants: 7,
      keyProducts: ['Stabilizers', 'Water Heaters', 'Pumps', 'Wires & Cables', 'Fans'],
      parentCompany: 'Independent',
      promoterHolding: 53.28, // Source: screener-financials.json shareholding Dec 2025
      exportRevenuePct: 1.5,
    },
    {
      id: 'ifb',
      name: 'IFB Industries',
      ticker: 'IFBIND',
      subCategory: 'White Goods',
      marketCap: 7200,
      headquarters: 'Kolkata, West Bengal',
      founded: 1974,
      employees: 3500,
      dealerNetwork: 4500,
      plants: 3,
      keyProducts: ['Washing Machines', 'Dishwashers', 'Microwaves', 'ACs'],
      parentCompany: 'Independent',
      promoterHolding: 74.96, // Source: screener-financials.json shareholding Dec 2025
      exportRevenuePct: 6.7,
    },
    {
      id: 'havells',
      name: 'Havells India',
      ticker: 'HAVELLS',
      subCategory: 'Consumer Electronics',
      marketCap: 95000,
      headquarters: 'Noida, Uttar Pradesh',
      founded: 1958,
      employees: 9200,
      dealerNetwork: 40000,
      plants: 14,
      keyProducts: ['Switchgears', 'Cables', 'Lighting', 'Fans', 'Lloyd (ACs/TVs)'],
      parentCompany: 'Independent',
      promoterHolding: 59.38, // Source: screener-financials.json shareholding Dec 2025
      exportRevenuePct: 4.3,
    },
    {
      id: 'symphony',
      name: 'Symphony',
      ticker: 'SYMPHONY',
      subCategory: 'White Goods',
      marketCap: 8500,
      headquarters: 'Ahmedabad, Gujarat',
      founded: 1988,
      employees: 1200,
      dealerNetwork: 7500,
      plants: 2,
      keyProducts: ['Air Coolers', 'Industrial Coolers'],
      parentCompany: 'Independent',
      promoterHolding: 73.42, // Source: screener-financials.json shareholding Dec 2025
      exportRevenuePct: 22.8,
    },
    {
      id: 'orient',
      name: 'Orient Electric',
      ticker: 'ORIENTELEC',
      subCategory: 'Consumer Electronics',
      marketCap: 10500,
      headquarters: 'New Delhi',
      founded: 2018,
      employees: 3000,
      dealerNetwork: 11000,
      plants: 5,
      keyProducts: ['Fans', 'Lighting', 'Home Appliances', 'Switchgears'],
      parentCompany: 'CK Birla Group',
      promoterHolding: 38.30, // Source: screener-financials.json shareholding Dec 2025
      exportRevenuePct: 5.6,
    },
    // === NEW COMPANIES (Phase 1 — 15-company expansion) ===
    {
      id: 'dixon',
      name: 'Dixon Technologies',
      ticker: 'DIXON',
      subCategory: 'Consumer Electronics',
      marketCap: 85000,
      headquarters: 'Noida, Uttar Pradesh',
      founded: 1993,
      employees: 15000,
      dealerNetwork: null, // OEM/ODM model — no direct dealer network
      plants: 18,
      keyProducts: ['LED TVs', 'Washing Machines', 'Smartphones', 'Lighting', 'Security Systems'],
      parentCompany: 'Independent',
      promoterHolding: 28.83, // Source: screener-financials.json shareholding Dec 2025
      exportRevenuePct: 5.0,
    },
    {
      id: 'amber',
      name: 'Amber Enterprises',
      ticker: 'AMBER',
      subCategory: 'White Goods',
      marketCap: 22000,
      headquarters: 'Gurugram, Haryana',
      founded: 1990,
      employees: 18000,
      dealerNetwork: null, // OEM/ODM model — no direct dealer network
      plants: 30,
      keyProducts: ['RAC Components', 'Commercial AC', 'PCBs', 'Railway Subsystems'],
      parentCompany: 'Independent',
      promoterHolding: 38.19, // Source: screener-financials.json shareholding Dec 2025
      exportRevenuePct: 3.0,
    },
    {
      id: 'ttk_prestige',
      name: 'TTK Prestige',
      ticker: 'TTKPRESTIG',
      subCategory: 'Consumer Electronics',
      marketCap: 15000,
      headquarters: 'Bengaluru, Karnataka',
      founded: 1955,
      employees: 4000,
      dealerNetwork: 55000,
      plants: 5,
      keyProducts: ['Pressure Cookers', 'Kitchen Appliances', 'Gas Stoves', 'Cookware'],
      parentCompany: 'TTK Group',
      promoterHolding: 70.52, // Source: screener-financials.json shareholding Dec 2025
      exportRevenuePct: 4.0,
    },
    {
      id: 'butterfly',
      name: 'Butterfly Gandhimathi Appliances',
      ticker: 'BUTTERFLY',
      subCategory: 'Consumer Electronics',
      marketCap: 3500,
      headquarters: 'Chennai, Tamil Nadu',
      founded: 1986,
      employees: 1800,
      dealerNetwork: 20000,
      plants: 3,
      keyProducts: ['Mixer Grinders', 'Gas Stoves', 'Kitchen Appliances', 'Pressure Cookers'],
      parentCompany: 'Crompton Greaves Consumer (subsidiary)',
      promoterHolding: 75.00, // Source: screener-financials.json shareholding Dec 2025
      exportRevenuePct: 2.0,
    },
    {
      id: 'bosch_jch',
      name: 'Johnson Controls-Hitachi Air Conditioning India',
      ticker: 'JCHAC',
      subCategory: 'White Goods',
      marketCap: 4500,
      headquarters: 'Ahmedabad, Gujarat',
      founded: 1984,
      employees: 2000,
      dealerNetwork: 5000,
      plants: 2,
      keyProducts: ['ACs', 'VRF Systems', 'Chillers', 'Commercial HVAC'],
      parentCompany: 'Johnson Controls (USA) / Hitachi (Japan)',
      promoterHolding: null, // No source file available for bosch_jch
      exportRevenuePct: 8.0,
    },
  ],

  // ============================================================
  // QUARTERLY FINANCIAL DATA (Q1 FY23 to Q3 FY26, Indian fiscal year)
  // Indices: 0=Q1FY23, 1=Q2FY23, 2=Q3FY23, 3=Q4FY23, 4=Q1FY24, 5=Q2FY24, 6=Q3FY24, 7=Q4FY24,
  //          8=Q1FY25, 9=Q2FY25, 10=Q3FY25, 11=Q4FY25, 12=Q1FY26, 13=Q2FY26, 14=Q3FY26
  // Sources: Screener.in consolidated.json (revenue, EBITDA%, PAT margin calculated)
  //          financial-api-data.json (working capital days, ROCE — annual, held constant from Q2 FY25)
  // Indices 0-1: null (no source data before Q3 FY23)
  // Indices 2-14: verified from consolidated.json quarterly data
  // ============================================================
  quarters: ['Q1 FY23','Q2 FY23','Q3 FY23','Q4 FY23','Q1 FY24','Q2 FY24','Q3 FY24','Q4 FY24','Q1 FY25','Q2 FY25','Q3 FY25','Q4 FY25','Q1 FY26','Q2 FY26','Q3 FY26'],

  financials: {
    // ================================================================
    // DATA SOURCES:
    //   revenue       = salesCr from consolidated.json (Amber rounded to integer)
    //   ebitdaMargin  = ebitdaMarginPct from consolidated.json
    //   patMargin     = round(netProfitCr / salesCr * 100, 2) — calculated from source
    //   workingCapDays = screener-financials.json ratios (annual, mapped to quarters)
    //   roce          = screener-financials.json ratios (annual %, mapped to quarters)
    //   inventoryDays = screener-financials.json ratios (annual, mapped to quarters)
    //   netDebtEbitda = calculated: Borrowings / (OpProfit + Depreciation) from screener P&L + BS
    //   capexIntensity= calculated: abs(Cash from Investing) / Revenue * 100 from screener
    //   asp, warrantyPct, importDependency, dealerProductivity = null (no source data)
    // Indices 0-1 = null for ALL companies (no source data before Q3 FY23)
    // ================================================================

    // WHIRLPOOL
    whirlpool: {
      revenue:       [null,null,1302,1673,2039,1522,1536,1734,2497,1713,1705,2005,2432,1647,1774],
      ebitdaMargin:  [null,null,6.84,9.44,8.58,8.02,7.16,11.88,10.69,8.11,7.04,11.82,10.9,6.68,8],
      patMargin:     [null,null,2.07,3.83,3.78,2.50,1.95,4.56,5.81,3.15,2.64,5.94,6.00,2.55,1.52],
      workingCapDays:[null,null,16,16,1,1,1,1,-5,-5,-5,-5,-5,-5,-5],
      inventoryDays: [null,null,120,120,99,99,99,99,93,93,93,93,93,93,93],
      netDebtEbitda: [null,null,0.2,0.2,0.38,0.38,0.38,0.38,0.37,0.37,0.37,0.37,0.37,0.37,0.37],
      capexIntensity:[null,null,1.5,1.5,0.9,0.9,0.9,0.9,0.8,0.8,0.8,0.8,0.8,0.8,0.8],
      roce:          [null,null,8,8,9,9,9,9,13,13,13,13,13,13,13],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // VOLTAS
    voltas: {
      revenue:       [null,null,2006,2957,3360,2293,2626,4203,4921,2619,3105,4768,3939,2347,3071],
      ebitdaMargin:  [null,null,2.74,6.76,4.91,2.14,0.19,3.9,8.27,5.57,5.89,6.61,4.34,2.47,5.41],
      patMargin:     [null,null,-5.48,4.84,3.84,1.57,-1.07,2.64,6.81,5.08,4.22,4.95,3.58,1.36,2.74],
      workingCapDays:[null,null,31,31,18,18,18,18,43,43,43,43,43,43,43],
      inventoryDays: [null,null,79,79,79,79,79,79,83,83,83,83,83,83,83],
      netDebtEbitda: [null,null,1.32,1.32,1.94,1.94,1.94,1.94,0.85,0.85,0.85,0.85,0.85,0.85,0.85],
      capexIntensity:[null,null,0.9,0.9,4.2,4.2,4.2,4.2,1,1,1,1,1,1,1],
      roce:          [null,null,10,10,9,9,9,9,18,18,18,18,18,18,18],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // BLUE STAR
    bluestar: {
      revenue:       [null,null,1794,2624,2226,1890,2241,3328,2865,2276,2807,4019,2982,2422,2925],
      ebitdaMargin:  [null,null,6.69,7.7,7.55,7.72,7.94,8.11,9.28,7.86,8.69,7.81,8.05,9.29,9.09],
      patMargin:     [null,null,3.23,8.57,3.73,3.76,4.46,4.81,5.90,4.22,4.70,4.83,4.06,4.09,2.77],
      workingCapDays:[null,null,2,2,20,20,20,20,16,16,16,16,16,16,16],
      inventoryDays: [null,null,127,127,106,106,106,106,131,131,131,131,131,131,131],
      netDebtEbitda: [null,null,1.13,1.13,0.32,0.32,0.32,0.32,0.38,0.38,0.38,0.38,0.38,0.38,0.38],
      capexIntensity:[null,null,2.2,2.2,5.4,5.4,5.4,5.4,3.9,3.9,3.9,3.9,3.9,3.9,3.9],
      roce:          [null,null,25,25,26,26,26,26,26,26,26,26,26,26,26],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // CROMPTON
    crompton: {
      revenue:       [null,null,1516,1791,1877,1782,1693,1961,2138,1896,1769,2061,1998,1916,1898],
      ebitdaMargin:  [null,null,12.01,13.46,11.45,11.62,10.75,12.19,12.58,12.76,12.78,14.75,11.61,10.54,12.59],
      patMargin:     [null,null,5.80,7.37,6.50,5.67,5.02,6.78,7.11,6.75,6.33,8.35,6.21,3.91,5.32],
      workingCapDays:[null,null,-7,-7,-15,-15,-15,-15,-16,-16,-16,-16,-16,-16,-16],
      inventoryDays: [null,null,58,58,61,61,61,61,61,61,61,61,61,61,61],
      netDebtEbitda: [null,null,1.13,1.13,0.81,0.81,0.81,0.81,0.46,0.46,0.46,0.46,0.46,0.46,0.46],
      capexIntensity:[null,null,3.8,3.8,2.8,2.8,2.8,2.8,1.7,1.7,1.7,1.7,1.7,1.7,1.7],
      roce:          [null,null,16,16,16,16,16,16,19,19,19,19,19,19,19],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // HAVELLS
    havells: {
      revenue:       [null,null,4128,4859,4834,3900,4414,5442,5806,4539,4889,6544,5455,4779,5588],
      ebitdaMargin:  [null,null,12.09,12.43,9.89,11.64,11.8,13.38,11.44,10.35,10.84,13.25,11.4,11.38,11.18],
      patMargin:     [null,null,6.88,7.37,5.94,6.38,6.52,8.21,7.03,5.90,5.69,7.90,6.38,6.65,5.37],
      workingCapDays:[null,null,25,25,11,11,11,11,12,12,12,12,12,12,12],
      inventoryDays: [null,null,119,119,102,102,102,102,104,104,104,104,104,104,104],
      netDebtEbitda: [null,null,0.12,0.12,0.14,0.14,0.14,0.14,0.12,0.12,0.12,0.12,0.12,0.12,0.12],
      capexIntensity:[null,null,0.2,0.2,8.7,8.7,8.7,8.7,1.4,1.4,1.4,1.4,1.4,1.4,1.4],
      roce:          [null,null,22,22,24,24,24,24,25,25,25,25,25,25,25],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // BAJAJ ELECTRICALS
    bajaj_elec: {
      revenue:       [null,null,1309,1292,1112,1113,1228,1188,1155,1118,1290,1265,1065,1107,1051],
      ebitdaMargin:  [null,null,9.4,9.06,8.18,9.16,7.17,6.73,9.26,7.78,9.53,10.59,6.57,8.49,4.09],
      patMargin:     [null,null,4.66,4.02,3.33,2.43,3.01,2.44,2.42,1.16,2.56,4.66,0.09,0.90,-3.24],
      workingCapDays:[null,null,39,39,12,12,12,12,35,35,35,35,35,35,35],
      inventoryDays: [null,null,106,106,85,85,85,85,79,79,79,79,79,79,79],
      netDebtEbitda: [null,null,0.22,0.22,0.58,0.58,0.58,0.58,0.54,0.54,0.54,0.54,0.54,0.54,0.54],
      capexIntensity:[null,null,1.8,1.8,9.7,9.7,9.7,9.7,4,4,4,4,4,4,4],
      roce:          [null,null,18,18,13,13,13,13,12,12,12,12,12,12,12],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // V-GUARD
    vguard: {
      revenue:       [null,null,982,1139,1215,1134,1165,1343,1477,1294,1269,1538,1466,1341,1404],
      ebitdaMargin:  [null,null,8.55,10.18,10.29,9.88,10.39,11.17,12.05,10.2,10.17,11.05,10.23,10.14,10.68],
      patMargin:     [null,null,3.97,4.65,5.27,5.20,4.98,5.66,6.70,4.87,4.73,5.92,5.05,4.85,4.06],
      workingCapDays:[null,null,55,55,41,41,41,41,43,43,43,43,43,43,43],
      inventoryDays: [null,null,97,97,92,92,92,92,102,102,102,102,102,102,102],
      netDebtEbitda: [null,null,1.31,1.31,0.79,0.79,0.79,0.79,0.22,0.22,0.22,0.22,0.22,0.22,0.22],
      capexIntensity:[null,null,18.7,18.7,3.2,3.2,3.2,3.2,1.7,1.7,1.7,1.7,1.7,1.7,1.7],
      roce:          [null,null,15,15,18,18,18,18,20,20,20,20,20,20,20],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // IFB
    ifb: {
      revenue:       [null,null,999,1010,1086,1101,1161,1090,1269,1219,1270,1334,1338,1370,1413],
      ebitdaMargin:  [null,null,6.01,5.94,5.52,8.45,7.75,6.79,8.59,7.96,9.53,6.75,6.95,9.34,7.43],
      patMargin:     [null,null,-0.10,-0.99,-0.09,2.00,1.46,1.10,2.99,2.54,2.44,1.42,1.94,3.72,1.70],
      workingCapDays:[null,null,-7,-7,-11,-11,-11,-11,-2,-2,-2,-2,-2,-2,-2],
      inventoryDays: [null,null,82,82,75,75,75,75,79,79,79,79,79,79,79],
      netDebtEbitda: [null,null,1.23,1.23,0.51,0.51,0.51,0.51,0.6,0.6,0.6,0.6,0.6,0.6,0.6],
      capexIntensity:[null,null,0.1,0.1,3.1,3.1,3.1,3.1,1.8,1.8,1.8,1.8,1.8,1.8,1.8],
      roce:          [null,null,6,6,10,10,10,10,17,17,17,17,17,17,17],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // SYMPHONY
    symphony: {
      revenue:       [null,null,277,308,302,275,247,332,393,289,242,381,251,163,179],
      ebitdaMargin:  [null,null,18.41,9.74,10.93,17.45,20.24,18.98,22.65,27.34,14.46,26.51,11.16,16.56,17.32],
      patMargin:     [null,null,14.08,5.19,7.95,12.73,16.60,14.46,22.39,19.38,-4.13,20.74,16.73,11.66,11.17],
      workingCapDays:[null,null,15,15,17,17,17,17,-14,-14,-14,-14,-14,-14,-14],
      inventoryDays: [null,null,137,137,140,140,140,140,129,129,129,129,129,129,129],
      netDebtEbitda: [null,null,1.4,1.4,0.86,0.86,0.86,0.86,0.43,0.43,0.43,0.43,0.43,0.43,0.43],
      capexIntensity:[null,null,1,1,16.7,16.7,16.7,16.7,2.6,2.6,2.6,2.6,2.6,2.6,2.6],
      roce:          [null,null,15,15,19,19,19,19,37,37,37,37,37,37,37],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // ORIENT ELECTRIC
    orient: {
      revenue:       [null,null,739,658,706,567,752,788,755,660,817,862,769,703,906],
      ebitdaMargin:  [null,null,9.34,9.12,8.22,6.17,8.51,5.84,7.68,8.48,9.91,10.32,8.45,8.11,9.6],
      patMargin:     [null,null,4.47,3.80,2.83,3.17,3.19,1.65,1.85,1.52,3.30,3.60,2.34,1.71,2.87],
      workingCapDays:[null,null,15,15,13,13,13,13,23,23,23,23,23,23,23],
      inventoryDays: [null,null,57,57,59,59,59,59,75,75,75,75,75,75,75],
      netDebtEbitda: [null,null,0.47,0.47,0.55,0.55,0.55,0.55,0.3,0.3,0.3,0.3,0.3,0.3,0.3],
      capexIntensity:[null,null,4.3,4.3,6.1,6.1,6.1,6.1,0.9,0.9,0.9,0.9,0.9,0.9,0.9],
      roce:          [null,null,19,19,14,14,14,14,18,18,18,18,18,18,18],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // DIXON
    dixon: {
      revenue:       [null,null,2405,3065,3272,4943,4818,4658,6580,11534,10454,10293,12836,14855,10672],
      ebitdaMargin:  [null,null,5.82,6.13,5.07,4.75,4.67,5.0,4.6,4.27,4.46,5.14,4.48,4.42,4.81],
      patMargin:     [null,null,2.16,2.64,2.05,2.29,2.01,2.08,2.13,3.57,2.07,4.52,2.18,5.02,3.01],
      workingCapDays:[null,null,-2,-2,-2,-2,-2,-2,2,2,2,2,2,2,2],
      inventoryDays: [null,null,32,32,39,39,39,39,41,41,41,41,41,41,41],
      netDebtEbitda: [null,null,0.71,0.71,0.56,0.56,0.56,0.56,0.37,0.37,0.37,0.37,0.37,0.37,0.37],
      capexIntensity:[null,null,2.9,2.9,3,3,3,3,2.8,2.8,2.8,2.8,2.8,2.8,2.8],
      roce:          [null,null,24,24,29,29,29,29,40,40,40,40,40,40,40],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // AMBER ENTERPRISES
    amber: {
      revenue:       [null,null,1348,3003,1702,927,1295,2805,2401,1685,2133,3754,3449,1647,2943],
      ebitdaMargin:  [null,null,8.52,8.07,10.29,11.3,9.66,9.66,10.22,9.95,9.77,9.06,9.03,9.35,11.17],
      patMargin:     [null,null,1.12,3.60,2.74,-0.61,-0.04,3.53,3.11,1.24,1.74,3.15,3.07,-1.95,-0.32],
      workingCapDays:[null,null,-19,-19,-39,-39,-39,-39,-28,-28,-28,-28,-28,-28,-28],
      inventoryDays: [null,null,68,68,56,56,56,56,74,74,74,74,74,74,74],
      netDebtEbitda: [null,null,2.59,2.59,2.27,2.27,2.27,2.27,2.14,2.14,2.14,2.14,2.14,2.14,2.14],
      capexIntensity:[null,null,7.1,7.1,15.4,15.4,15.4,15.4,9.6,9.6,9.6,9.6,9.6,9.6,9.6],
      roce:          [null,null,11,11,10,10,10,10,14,14,14,14,14,14,14],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // TTK PRESTIGE
    ttk_prestige: {
      revenue:       [null,null,695,611,588,729,738,623,588,750,727,650,609,834,801],
      ebitdaMargin:  [null,null,13.38,15.71,12.93,13.31,13.82,15.09,12.07,11.87,13.2,10.77,9.69,13.79,11.49],
      patMargin:     [null,null,8.35,9.49,7.99,8.09,8.40,9.15,6.97,6.93,7.84,-6.46,4.27,7.55,4.00],
      workingCapDays:[null,null,69,69,58,58,58,58,69,69,69,69,69,69,69],
      inventoryDays: [null,null,130,130,128,128,128,128,142,142,142,142,142,142,142],
      netDebtEbitda: [null,null,0.32,0.32,0.49,0.49,0.49,0.49,0.55,0.55,0.55,0.55,0.55,0.55,0.55],
      capexIntensity:[null,null,5.7,5.7,6.9,6.9,6.9,6.9,7.5,7.5,7.5,7.5,7.5,7.5,7.5],
      roce:          [null,null,18,18,14,14,14,14,12,12,12,12,12,12,12],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // BUTTERFLY GANDHIMATHI
    butterfly: {
      revenue:       [null,null,248,187,219,308,238,166,182,258,238,187,187,293,245],
      ebitdaMargin:  [null,null,10.48,6.42,10.96,9.74,2.94,-9.04,8.24,11.24,9.66,11.23,9.63,11.6,10.61],
      patMargin:     [null,null,4.84,1.07,6.85,4.87,-0.84,-12.05,1.65,5.04,3.36,4.81,3.21,5.80,4.49],
      workingCapDays:[null,null,23,23,22,22,22,22,30,30,30,30,30,30,30],
      inventoryDays: [null,null,68,68,82,82,82,82,74,74,74,74,74,74,74],
      netDebtEbitda: [null,null,0.04,0.04,0.09,0.09,0.09,0.09,0.13,0.13,0.13,0.13,0.13,0.13,0.13],
      capexIntensity:[null,null,2.7,2.7,2.3,2.3,2.3,2.3,6.4,6.4,6.4,6.4,6.4,6.4,6.4],
      roce:          [null,null,30,30,5,5,5,5,15,15,15,15,15,15,15],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
    // BOSCH HOME COMFORT (JCH) — no source data file exists
    bosch_jch: {
      revenue:       [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      ebitdaMargin:  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      patMargin:     [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      workingCapDays:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      inventoryDays: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      netDebtEbitda: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      capexIntensity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      roce:          [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      asp:           [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      warrantyPct:   [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      importDependency:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      dealerProductivity:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    },
  },

  // ============================================================
  // PERFORMANCE RATINGS (Latest Quarter)
  // ============================================================
  // Computed dynamically after DataUtils loads — see bottom of file
  performanceRatings: {},

  // ============================================================
  // CHANNEL MIX DATA (Latest Quarter %)
  // ============================================================
  channelMix: {
    whirlpool:  { gt: 42, mt: 25, ecommerce: 28, d2c: 5 },
    voltas:     { gt: 38, mt: 22, ecommerce: 32, d2c: 8 },
    bluestar:   { gt: 30, mt: 20, ecommerce: 25, d2c: 5, b2b: 20 },
    crompton:   { gt: 50, mt: 18, ecommerce: 25, d2c: 7 },
    bajaj_elec: { gt: 55, mt: 20, ecommerce: 20, d2c: 5 },
    vguard:     { gt: 58, mt: 15, ecommerce: 20, d2c: 7 },
    ifb:        { gt: 35, mt: 20, ecommerce: 30, d2c: 15 },
    havells:    { gt: 45, mt: 22, ecommerce: 25, d2c: 8 },
    symphony:   { gt: 40, mt: 18, ecommerce: 32, d2c: 10 },
    orient:     { gt: 52, mt: 18, ecommerce: 22, d2c: 8 },
    dixon:      { gt: 0, mt: 0, ecommerce: 0, d2c: 0, b2b: 100 },
    amber:      { gt: 0, mt: 0, ecommerce: 0, d2c: 0, b2b: 100 },
    ttk_prestige:{ gt: 45, mt: 20, ecommerce: 25, d2c: 10 },
    butterfly:  { gt: 55, mt: 15, ecommerce: 22, d2c: 8 },
    bosch_jch:  { gt: 20, mt: 15, ecommerce: 10, d2c: 5, b2b: 50 },
  },

  // ============================================================
  // PRODUCT MIX (Premium / Mass / Economy %)
  // Source: operational-intelligence-data.md Chart 3
  // Note: "Premiumization is a curve, not a line" — episodic, not linear (A&M Feb 2026)
  // ============================================================
  productMix: {
    whirlpool:  { premium: 30, mass: 50, economy: 20 },  // Mid-premium fridge/washer focus
    voltas:     { premium: 25, mass: 55, economy: 20 },  // Mainstream AC leader; Voltas Beko for premium
    bluestar:   { premium: 35, mass: 50, economy: 15 },  // Strong commercial/industrial premium
    crompton:   { premium: 25, mass: 50, economy: 25 },  // Premium fans ~25% of fan category (up from 12-15%)
    bajaj_elec: { premium: 15, mass: 50, economy: 35 },  // Mass market; Morphy Richards for premium push
    vguard:     { premium: 20, mass: 55, economy: 25 },  // Mid-market BLDC fans, premium water heaters
    ifb:        { premium: 40, mass: 45, economy: 15 },  // Premium washer positioning, COCO stores
    havells:    { premium: 35, mass: 50, economy: 15 },  // Lloyd Luxuria, SmartHub stores; Q3 premiumization standout
    symphony:   { premium: 20, mass: 55, economy: 25 },  // Coolers span all; Air Force range for premium
    orient:     { premium: 30, mass: 50, economy: 20 },  // "Premium mix crossing 30%", BLDC 45% target
    dixon:      { premium: 10, mass: 60, economy: 30 },  // EMS/ODM; client-driven mix (low control)
    amber:      { premium: 15, mass: 60, economy: 25 },  // OEM/ODM; client orders drive mix
    ttk_prestige:{ premium: 40, mass: 45, economy: 15 }, // Triply cookware premium; integrated Hosur facility
    butterfly:  { premium: 20, mass: 55, economy: 25 },  // Elektra premium; material margin +300bps
    bosch_jch:  { premium: 45, mass: 45, economy: 10 },  // Bosch/Hitachi = premium positioning, low volumes
  },

  // ============================================================
  // MARKET PULSE DATA
  // Sources: EBITDA bands computed from real company EBITDA margins (14 companies)
  //          Revenue growth computed from real company revenue (aggregate YoY %)
  //          Input costs: ESTIMATED indices from commodity research (Deep Dive Feb 2026)
  //          Volume/Price split: ESTIMATED based on industry analysis (Deep Dive: "top-line resilience
  //            artificially supported by price hikes and premium mix, not genuine volume expansion")
  // ============================================================
  marketPulse: {
    demandSignals: {
      // Sector aggregate revenue YoY growth % (real, computed from all 14 companies)
      sectorRevenueGrowthYoY: [null,null,null,null,null,null,22.3,17.8,34.6,41.7,35.5,33.7,17.4,11.2,6.6],
      // ESTIMATED split — Deep Dive Feb 2026: rural volume weak, growth is price-hike + mix driven
      // Quarters: Q3 FY24 to Q3 FY26 (indices 6-14); null before that
      volumeGrowth: [null,null,null,null,null,null,14,10,24,28,22,20,7,3,-1],
      priceGrowth:  [null,null,null,null,null,null,8,8,10,14,14,14,10,8,8],
    },
    inputCosts: {
      // ESTIMATED index (Q1 FY23 = 100) from commodity research + Deep Dive
      // Copper: $8,500→$11,200/ton trajectory. JPMorgan targets $12,500 by Q2 2026
      copper:   [100, 91, 95, 104, 99, 96, 100, 104, 115, 108, 105, 112, 120, 127, 132],
      // Steel HRC India: ~Rs 55K base. Safeguard duty Rs 3,500-4,000/ton hikes Dec25-Jan26
      steel:    [100, 95, 96, 100, 102, 98, 100, 96, 95, 91, 87, 91, 95, 98, 104],
      // Aluminum: ~$2,500 base. China 45M ton cap + AI data center power squeeze
      aluminum: [100, 94, 96, 101, 98, 95, 97, 100, 106, 104, 101, 103, 108, 112, 115],
      // Polymer/Plastics: relatively stable, slight upward from crude oil base
      polymer:  [100, 98, 97, 99, 101, 99, 100, 102, 103, 101, 100, 102, 104, 106, 108],
    },
    marginOutlook: {
      // Computed from real EBITDA margins of 14 tracked companies per quarter
      sectorAvgEbitda: [null,null,9.3,9.3,8.9,9.4,8.8,8.5,10.5,10.3,9.7,11.1,8.7,9.4,9.5],
      topQuartile:     [null,null,11.6,10.1,10.8,11.5,10.7,12.1,11.9,11,10.7,11.7,10.7,11.2,11.2],
      bottomQuartile:  [null,null,6.7,7,7.7,7.8,7.2,6.1,8.3,7.9,8.9,8.1,7.2,8.2,7.6],
    },
    // NEW: Q3 FY26 Earnings Scorecard (from Deep Dive Feb 2026, Sources 16-21)
    q3Earnings: [
      { company: 'Havells', revenue: 5588, yoyGrowth: 14.3, ebitdaMargin: 9.2, ebitdaGrowth: 21, netProfit: 301, signal: 'positive', note: 'Standout. Premiumization + housing demand. Rs 4 dividend.' },
      { company: 'Voltas', revenue: 3060, yoyGrowth: 0, ebitdaMargin: 3.8, ebitdaGrowth: null, netProfit: null, signal: 'mixed', note: '17.9% YTD RAC share. UCP EBIT 3.8% beat (vs 2% expected). Inventory liquidation.' },
      { company: 'Blue Star', revenue: 2925, yoyGrowth: 4.2, ebitdaMargin: 7.5, ebitdaGrowth: 0, netProfit: null, signal: 'negative', note: '"Subdued quarter". Draconian cost-control. BEE channel stuffing.' },
      { company: 'Crompton', revenue: 1898, yoyGrowth: 7, ebitdaMargin: 10.3, ebitdaGrowth: null, netProfit: null, signal: 'neutral', note: 'ECD +8%, lighting +7%. Butterfly +100 bps. 2 price hike rounds planned.' },
    ],
    // NEW: Commodity outlook (from Deep Dive Feb 2026, Sources 3, 25, 26, 28)
    commodityOutlook: [
      { commodity: 'Copper', forecast: '$12,500/ton', source: 'JPMorgan Q2 2026', impact: 'CRITICAL', detail: '150K ton global shortfall. AI data centers consuming 1.1M tonnes by 2030.' },
      { commodity: 'Aluminum', forecast: 'Tightening', source: 'Deutsche Bank', impact: 'HIGH', detail: 'China 45M ton cap. Hindalco/Novelis EBITDA erosion from US data center electricity.' },
      { commodity: 'Steel', forecast: '+Rs 3,500-4,000/ton', source: 'ANI News', impact: 'MEDIUM', detail: '3-year safeguard duty. Domestic mills hiking. Washing machines, fridges hit.' },
      { commodity: 'INR/USD', forecast: 'Depreciating', source: 'East Asia Forum', impact: 'HIGH', detail: 'Post US 50% tariff threat. Amplifies all imported raw material costs.' },
    ],
    // NEW: Policy impact tracker (from Deep Dive Feb 2026, Source 2)
    policyImpact: [
      { policy: 'PLI Rs 1,004 Cr (FY26-27)', target: 'ACs & LED', impact: 'positive', detail: 'Sustains localization. Advantage to backward-integrated players.' },
      { policy: 'Rs 40,000 Cr Electronics Scheme', target: 'Smart Appliances', impact: 'positive', detail: 'De-risks supply chain. Accelerates smart tech integration.' },
      { policy: 'BCD Microwave Parts Exemption', target: 'Kitchen Appliances', impact: 'positive', detail: 'Reduces BoM cost. Encourages global component JVs.' },
      { policy: 'BEE Norms (Jan 1, 2026)', target: 'ACs & Fridges', impact: 'negative', detail: 'AC +5-10%, Fridge +3-5% price hikes. Channel stuffing. Margin compression.' },
      { policy: 'Steel Safeguard Duty (3-yr)', target: 'White Goods', impact: 'negative', detail: 'Rs 3,500-4,000/ton cumulative hikes. Washing machines, fridges hit.' },
      { policy: 'BESS Duty Exemptions', target: 'Inverters & Solar', impact: 'positive', detail: 'Lowers capex for sustainable tech. V-Guard, Havells benefit.' },
    ],
    // NEW: Urban vs Rural demand dynamics (from Deep Dive Feb 2026, Sources 9, 10)
    urbanRuralDynamics: {
      urbanPremiumGrowth: 'Double-digit',  // Frost-free, multi-door, inverter split ACs
      ruralVolumeRecovery: 'Fits and starts', // Weather, farm income, inflation dependent
      growthDriver: 'Price hikes + premium mix, NOT genuine volume expansion',
      homeImprovementBoom: { size: '₹3 lakh crore', cagr: '9-10%', target2030: '₹4 lakh crore' },
      smartHomeDemand: '+40% YoY customized interiors + smart home',
      modularSolutions: '+30% demand for modular home solutions',
      renovationCycle: 'Collapsed from generational to 10-12 years',
    },
  },

  // ============================================================
  // DEALS & TRANSACTIONS
  // ============================================================
  // Source: Open web research — each deal verified with source URL
  // Dates: YYYY-MM-DD (15th used when only month known; latest date for ranges)
  // dealSize: INR Cr (null if undisclosed or only foreign currency)
  // FY convention: Indian FY (Apr-Mar) — FY2025 = Apr 2024 – Mar 2025
  deals: [
    // ── WHIRLPOOL OF INDIA ──────────────────────────────────────
    { id: 1, date: '2024-02-20', type: 'Stake Sale', company: 'Whirlpool of India', target: 'Whirlpool India (24% stake)', dealSize: 3800, valuationMultiple: '₹1,230/share', buyer: 'SBI MF / Aditya Birla Sunlife MF / Societe Generale', rationale: 'Whirlpool Corp sold 24% stake in Indian unit via block deal, reducing holding from 75% to 51%. Goldman Sachs advised.', status: 'Completed', sourceUrl: 'https://www.businesstoday.in/latest/corporate/story/whirlpool-to-offload-24-india-stake-via-block-deal-report-418113-2024-02-19', sourceName: 'BusinessToday' },
    { id: 2, date: '2025-07-23', type: 'Stake Sale', company: 'Whirlpool of India', target: 'Whirlpool India (31% controlling stake)', dealSize: null, valuationMultiple: '$550-600M target', buyer: 'Reliance Retail / Havells / EQT / Bain Capital (bidders)', rationale: 'Multiple bidders entered race for 31% controlling stake. Havells, EQT, Bain all subsequently withdrew over valuation.', status: 'Bidders Withdrew', sourceUrl: 'https://www.business-standard.com/companies/news/reliance-havells-whirlpool-india-majority-stake-sale-us-parent-company-125062000225_1.html', sourceName: 'Business Standard' },
    { id: 3, date: '2025-12-06', type: 'Stake Sale', company: 'Whirlpool of India', target: 'Whirlpool India (57% stake to Advent)', dealSize: 8500, valuationMultiple: '~$1B', buyer: 'Advent International', rationale: 'Advent entered exclusive talks to buy 57% controlling stake (31% direct + 26% open offer). Deal collapsed Dec 2025 over pricing disagreements.', status: 'Failed', sourceUrl: 'https://www.business-standard.com/companies/news/advent-s-1-bn-deal-talks-for-whirlpool-india-collapse-due-to-disagreements-125120600442_1.html', sourceName: 'Business Standard' },
    { id: 4, date: '2025-11-27', type: 'Stake Sale', company: 'Whirlpool of India', target: 'Whirlpool India (11.23% stake)', dealSize: 1490, valuationMultiple: '₹1,045/share', buyer: 'HDFC MF / Kotak MF / Franklin Templeton / ICICI Pru Life / Societe Generale / East Bridge Capital', rationale: 'Whirlpool Mauritius sold 1.42 Cr shares (11.23% stake) via bulk deal at ₹1,045/share.', status: 'Completed', sourceUrl: 'https://www.outlookbusiness.com/news/whirlpool-india-promoter-entity-sells-1123-stake-for-1489-cr', sourceName: 'Outlook Business' },

    // ── VOLTAS ───────────────────────────────────────────────────
    { id: 5, date: '2025-02-28', type: 'Divestiture', company: 'Voltas', target: 'Saudi Ensas Company (92% stake)', dealSize: 62, valuationMultiple: 'N/A', buyer: 'Universal MEP Projects Singapore', rationale: 'Voltas completed transfer of 92% direct investment in Saudi Ensas Company for Engineering Services to Universal MEP Projects.', status: 'Completed', sourceUrl: 'https://www.voltas.in/file-uploads/financial-snapshot/Annual-reports/VoltasAnnualReport2024-2025.pdf', sourceName: 'Voltas Annual Report' },
    { id: 6, date: '2024-10-14', type: 'Govt Incentive', company: 'Voltas', target: 'PLI White Goods Scheme (Round 3)', dealSize: null, valuationMultiple: 'N/A', buyer: 'Govt of India (DPIIT)', rationale: 'Voltas among 38 applicants in 3rd round of PLI scheme for white goods (ACs & LED lights) with proposed investment commitments.', status: 'Applied', sourceUrl: 'https://www.business-standard.com/industry/news/voltas-among-38-applicants-in-pli-scheme-s-3rd-round-for-white-goods-124101400733_1.html', sourceName: 'Business Standard' },

    // ── BLUE STAR ────────────────────────────────────────────────
    { id: 7, date: '2024-10-14', type: 'Govt Incentive', company: 'Blue Star', target: 'PLI White Goods Scheme (Round 3)', dealSize: null, valuationMultiple: 'N/A', buyer: 'Govt of India (DPIIT)', rationale: 'Blue Star among 38 applicants in 3rd round of PLI scheme for white goods with committed investment proposals for AC manufacturing.', status: 'Applied', sourceUrl: 'https://www.business-standard.com/industry/news/voltas-among-38-applicants-in-pli-scheme-s-3rd-round-for-white-goods-124101400733_1.html', sourceName: 'Business Standard' },

    // ── CROMPTON GREAVES CONSUMER ────────────────────────────────
    { id: 8, date: '2023-10-31', type: 'M&A', company: 'Crompton Greaves Consumer', target: 'Butterfly Gandhimathi (Merger)', dealSize: null, valuationMultiple: '22:5 swap ratio', buyer: 'Crompton Greaves Consumer Electricals', rationale: 'Proposed merger of Crompton and Butterfly (swap ratio: 22 Crompton shares for 5 Butterfly). Public shareholders voted 72.61% against; 97% of non-institutional investors opposed. Merger rejected.', status: 'Rejected', sourceUrl: 'https://www.businesstoday.in/markets/company-stock/story/shareholders-reject-butterfly-gandhimathi-appliances-crompton-greaves-merger-404049-2023-11-01', sourceName: 'BusinessToday' },
    { id: 9, date: '2025-07-23', type: 'Fund Raise', company: 'Crompton Greaves Consumer', target: 'NCD Debt Retirement', dealSize: 2125, valuationMultiple: 'N/A', buyer: 'NCD Holders / Lenders', rationale: 'Crompton fully repaid ₹2,125 Cr NCD debt (5 tranches) originally issued to fund 2022 Butterfly acquisition. Crompton becomes zero-debt, net cash positive.', status: 'Completed', sourceUrl: 'https://www.business-standard.com/markets/capital-market-news/crompton-greaves-consumer-transitions-to-zero-debt-and-net-cash-positive-status-125072300467_1.html', sourceName: 'Business Standard' },

    // ── BAJAJ ELECTRICALS ────────────────────────────────────────
    { id: 10, date: '2023-09-14', type: 'Demerger', company: 'Bajaj Electricals', target: 'Bajel Projects Ltd (Power T&D business)', dealSize: 1260, valuationMultiple: 'N/A', buyer: 'Bajel Projects Ltd (Resulting Company)', rationale: 'Bajaj Electricals demerged power T&D business into Bajel Projects Limited, valued at ₹1,260 Cr. 1 Bajel share for every 1 Bajaj Electricals share.', status: 'Completed', sourceUrl: 'https://www.bajajelectricals.com/scheme-of-arrangements/', sourceName: 'Bajaj Electricals IR' },
    { id: 11, date: '2026-02-15', type: 'M&A', company: 'Bajaj Electricals', target: 'Hind Lamps Ltd (Distressed Asset Revival)', dealSize: null, valuationMultiple: 'N/A', buyer: 'Bajaj Electricals (60% stake holder)', rationale: 'Bajaj pursuing revival of manufacturing business of Hind Lamps Ltd (sick company since 2002 under BIFR). Scheme of arrangement requires NCLT approval.', status: 'In Progress', sourceUrl: 'https://mnacritique.mergersindia.com/bajaj-electricals-hind-lamps-revival-demerger/', sourceName: 'M&A Critique' },

    // ── V-GUARD INDUSTRIES ───────────────────────────────────────
    { id: 12, date: '2023-01-12', type: 'M&A', company: 'V-Guard Industries', target: 'Sunflame Enterprises Pvt Ltd (100%)', dealSize: 660, valuationMultiple: 'N/A', buyer: 'V-Guard Industries', rationale: 'V-Guard completed 100% acquisition of Sunflame Enterprises (kitchen appliances) for all-cash ₹660 Cr. Sunflame became wholly-owned subsidiary.', status: 'Completed', sourceUrl: 'https://www.business-standard.com/article/companies/v-guard-industries-to-acquire-sunflame-enterprises-for-rs-660-crore-122120900893_1.html', sourceName: 'Business Standard' },
    { id: 13, date: '2023-11-15', type: 'Strategic Investment', company: 'V-Guard Industries', target: 'Gegadyne Energy Labs (24.32% stake)', dealSize: 20, valuationMultiple: 'N/A', buyer: 'V-Guard Industries', rationale: 'Additional ₹20 Cr investment in battery startup Gegadyne Energy Labs, increasing stake to 24.32% (fully diluted). Gegadyne became associate company.', status: 'Completed', sourceUrl: 'https://www.moneyworks4me.com/company/news/index/id/605717', sourceName: 'MoneyWorks4Me' },

    // ── IFB INDUSTRIES ───────────────────────────────────────────
    { id: 14, date: '2023-05-15', type: 'Strategic Investment', company: 'IFB Industries', target: 'IFB Refrigeration Ltd (~41.4% stake)', dealSize: 97, valuationMultiple: 'N/A', buyer: 'IFB Industries', rationale: 'IFB invested up to ₹97 Cr in equity of IFB Refrigeration Limited (group company). IRL operates refrigerator facility at Ranjangaon, Pune. Commercial production commenced May 2023.', status: 'Completed', sourceUrl: 'https://www.equitybulls.com/category.php?id=324061', sourceName: 'EquityBulls' },
    { id: 15, date: '2024-11-15', type: 'JV', company: 'IFB Industries', target: 'Schmid Automotive & Appliances GmbH (Switzerland)', dealSize: null, valuationMultiple: 'N/A', buyer: 'GAAL Singapore (IFB subsidiary)', rationale: 'IFB\'s wholly-owned subsidiary GAAL established Schmid Automotive & Appliances GmbH in Switzerland for European design and tooling facility.', status: 'Completed', sourceUrl: 'https://scanx.trade/stock-market-news/stocks/ifb-industries-subsidiary-gaal-establishes-new-swiss-unit-schmid-automotive-appliances-gmbh/27096089', sourceName: 'ScanX Trade' },

    // ── HAVELLS INDIA ────────────────────────────────────────────
    { id: 16, date: '2024-07-15', type: 'Capex', company: 'Havells India', target: 'Alwar Cable Plant Expansion', dealSize: 715, valuationMultiple: 'N/A', buyer: 'Internal (Self-funded)', rationale: 'Cable capacity expansion at Alwar, Rajasthan. Initial ₹375 Cr (Jul 2024) + additional ₹340 Cr (May 2025). Capacity from 32.9 to 41.45 lakh km.', status: 'In Progress', sourceUrl: 'https://www.wirecable.in/havells-india-announces-additional/', sourceName: 'Wire & Cable India' },
    { id: 17, date: '2024-09-15', type: 'Capex', company: 'Havells India', target: 'Tumakuru Greenfield Cable Plant', dealSize: 450, valuationMultiple: 'N/A', buyer: 'Internal (Self-funded)', rationale: 'Havells greenfield cable plant at Tumakuru, Karnataka commissioned Sep 2024. Additional ₹450 Cr for expansion of higher-sized cable capacity.', status: 'Completed', sourceUrl: 'https://www.business-standard.com/markets/capital-market-news/havells-commences-cable-production-at-new-unit-in-karnataka-124090400462_1.html', sourceName: 'Business Standard' },
    { id: 18, date: '2025-04-25', type: 'Govt Incentive', company: 'Havells India', target: 'YEIDA Electronics Manufacturing Cluster', dealSize: 800, valuationMultiple: 'N/A', buyer: 'YEIDA / MeitY', rationale: 'Havells received LOI for 50-acre land from YEIDA as anchor investor in 200-acre EMC. JV with 5 other companies. Phase-1 ₹800 Cr. MeitY approved Apr 2025.', status: 'Approved', sourceUrl: 'https://cablecommunity.com/havells-receives-50-acre-land-in-yeidas-electronics-manufacturing-cluster/', sourceName: 'CableCommunity' },
    { id: 19, date: '2024-11-15', type: 'Capex', company: 'Havells India', target: 'Ghiloth Refrigerator Plant', dealSize: 480, valuationMultiple: 'N/A', buyer: 'Internal (Self-funded)', rationale: 'Approved new refrigerator manufacturing plant at Ghiloth, Rajasthan. 14 lakh unit capacity. Expected operational by Q2 FY27.', status: 'In Progress', sourceUrl: 'https://www.indiainfoline.com/news/business/havells-india-to-invest-480-crore-in-rajasthan-refrigerator-plant', sourceName: 'India Infoline' },
    { id: 20, date: '2025-04-14', type: 'Strategic Investment', company: 'Havells India', target: 'Goldi Solar (8.9-9.24% stake)', dealSize: 600, valuationMultiple: '~20x EV/EBITDA', buyer: 'Havells India', rationale: 'Binding term sheet to invest ₹600 Cr in solar PV module manufacturer Goldi Solar as part of ₹1,300 Cr fundraise. Goldi preparing for IPO.', status: 'Completed', sourceUrl: 'https://www.pv-magazine-india.com/2025/04/15/havells-invests-inr-600-crore-in-goldi-solar/', sourceName: 'PV Magazine India' },
    { id: 21, date: '2025-10-29', type: 'Strategic Investment', company: 'Havells India', target: 'Goldi Solar (Growth Round)', dealSize: 600, valuationMultiple: 'N/A', buyer: 'Havells India (lead) + Nikhil Kamath + others', rationale: 'Havells led ₹1,422 Cr growth round in Goldi Solar (Havells share: ₹600 Cr). Other investors: Nikhil Kamath ~₹140 Cr, Ambit, Shahi Exports, SRF.', status: 'Completed', sourceUrl: 'https://www.business-standard.com/companies/news/goldi-solar-raises-1-422-crore-from-investors-to-boost-capacity-expansion-125102900885_1.html', sourceName: 'Business Standard' },
    { id: 22, date: '2025-11-28', type: 'Strategic Investment', company: 'Havells India', target: 'Kundan Solar (Pali) Pvt Ltd (26% stake)', dealSize: 6, valuationMultiple: 'N/A', buyer: 'Havells India', rationale: 'Acquired 26% stake in Kundan Solar SPV for 15 MWac captive solar plant in Rajasthan. ₹5.63 Cr in phases. 25-year PPA.', status: 'Completed', sourceUrl: 'https://solarquarter.com/2025/11/28/havells-india-acquires-26-stake-in-kundan-solar-spv-for-15-mwac-captive-plant/', sourceName: 'SolarQuarter' },
    { id: 23, date: '2025-11-15', type: 'M&A', company: 'Havells India', target: 'HPL Group (Trademark Settlement)', dealSize: 130, valuationMultiple: 'N/A', buyer: 'HPL Group', rationale: 'Havells settled trademark dispute with HPL Group, paying ₹129.60 Cr. HPL acknowledged Havells\' absolute rights to the \'HAVELLS\' trademark since 1971.', status: 'Completed', sourceUrl: 'https://tracxn.com/d/legal-entities/india/havells-india-limited/__Y9UgIgjdhfOYVvTqYwZEWwErm4M30HOOj6QH0_7eiqw', sourceName: 'Tracxn' },
    { id: 24, date: '2025-06-20', type: 'Stake Sale', company: 'Havells India', target: 'Whirlpool India (Bid Withdrew)', dealSize: null, valuationMultiple: '~$600M', buyer: 'Whirlpool Corporation (seller)', rationale: 'Havells entered race to acquire 31% controlling stake in Whirlpool India. Withdrew due to valuation concerns and strategic focus on existing business.', status: 'Withdrew', sourceUrl: 'https://www.business-standard.com/companies/news/whirlpool-india-stake-sale-eqt-bain-capital-reliance-havells-125072300297_1.html', sourceName: 'Business Standard' },
    { id: 25, date: '2026-01-22', type: 'PE Investment', company: 'Havells India', target: 'Dhun Wellness', dealSize: 34, valuationMultiple: 'N/A', buyer: 'Havells India + SRF Ltd', rationale: 'Co-led $4M (~₹34 Cr) funding round in wellness startup Dhun Wellness (Mira Kapoor). Proceeds for expansion to Pune, Hyderabad, Bengaluru.', status: 'Completed', sourceUrl: 'https://startupnews.fyi/2026/01/24/dhun-wellness-raises-4-mn-led-by-srf-and-havells-india/', sourceName: 'StartupNews.fyi' },
    { id: 26, date: '2026-02-15', type: 'Govt Incentive', company: 'Havells India', target: 'PLI White Goods Scheme', dealSize: null, valuationMultiple: 'N/A', buyer: 'Govt of India (DPIIT)', rationale: 'Havells among approved beneficiaries of PLI White Goods scheme for AC and LED manufacturing. Incentives of 4-6% on incremental sales.', status: 'Active', sourceUrl: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2064740', sourceName: 'PIB' },

    // ── SYMPHONY ─────────────────────────────────────────────────
    { id: 27, date: '2023-05-17', type: 'Buyback', company: 'Symphony', target: 'Symphony (10 lakh shares)', dealSize: 200, valuationMultiple: '₹2,000/share', buyer: 'Existing Shareholders', rationale: 'Buyback of 10,00,000 equity shares at ₹2,000/share via tender offer. Acceptance ratio ~9% for retail. Promoters participated.', status: 'Completed', sourceUrl: 'https://www.business-standard.com/article/news-cm/board-of-symphony-approves-buyback-of-shares-up-to-rs-200-cr-123020800915_1.html', sourceName: 'Business Standard' },
    { id: 28, date: '2024-09-02', type: 'Buyback', company: 'Symphony', target: 'Symphony (2.856 lakh shares)', dealSize: 71, valuationMultiple: '₹2,500/share', buyer: 'Existing Shareholders', rationale: 'Buyback of 2,85,600 shares at ₹2,500/share via tender offer. Acceptance ratio ~10% for retail. Return surplus cash to shareholders.', status: 'Completed', sourceUrl: 'https://www.chittorgarh.com/buyback/symphony-limited-buyback-2024/182/', sourceName: 'Chittorgarh.com' },
    { id: 29, date: '2025-04-12', type: 'Divestiture', company: 'Symphony', target: 'Climate Technologies Australia + IMPCO Mexico', dealSize: null, valuationMultiple: 'N/A', buyer: 'Multiple potential buyers', rationale: 'Board approved divestment of Australian subsidiary (Climate Technologies, revenue ₹185 Cr, negative EBITDA) and Mexican subsidiary (IMPCO, revenue ₹178 Cr). Later shelved — no buyer met valuation expectations.', status: 'Shelved', sourceUrl: 'https://www.tipranks.com/news/company-announcements/symphony-limited-to-divest-stakes-in-australian-and-mexican-subsidiaries', sourceName: 'TipRanks' },
    { id: 30, date: '2025-04-12', type: 'Divestiture', company: 'Symphony', target: 'GSK China → IMPCO Mexico (9 IPRs)', dealSize: 44, valuationMultiple: 'N/A', buyer: 'IMPCO S de R.I. de C.V. (intra-group)', rationale: 'Symphony\'s Chinese subsidiary GSK sold technology know-how and 9 IPRs to IMPCO Mexico for $5.1M (~₹44 Cr). GSK to become debt-free.', status: 'Completed', sourceUrl: 'https://www.tipranks.com/news/company-announcements/symphony-limiteds-subsidiary-sells-technology-to-impco-aiming-for-debt-free-status', sourceName: 'TipRanks' },

    // ── ORIENT ELECTRIC ──────────────────────────────────────────
    { id: 31, date: '2024-10-22', type: 'Stake Sale', company: 'Orient Electric', target: 'Orient Cement (CK Birla Group reallocation)', dealSize: 8100, valuationMultiple: 'N/A', buyer: 'Ambuja Cements (Adani Group)', rationale: 'CK Birla Group sold 46.8% stake in Orient Cement to Ambuja Cements for ₹8,100 Cr. Capital being reallocated to consumer-centric businesses incl. Orient Electric.', status: 'Completed', sourceUrl: 'https://www.business-standard.com/companies/news/adani-backed-ambuja-to-acquire-46-8-stake-in-orient-cement-for-rs-8-100-cr-124102200224_1.html', sourceName: 'Business Standard' },

    // ── DIXON TECHNOLOGIES ───────────────────────────────────────
    { id: 32, date: '2024-08-13', type: 'M&A', company: 'Dixon Technologies', target: 'Ismartu India Pvt Ltd (50.1% stake)', dealSize: 275, valuationMultiple: 'N/A', buyer: 'Dixon Technologies', rationale: 'Dixon acquired 50.1% stake in Ismartu India (Transsion brands: Itel, Infinix, Tecno). CCI approved Jul 18. Tranche 2 (1.7-5.9%) to be acquired in 2026-27.', status: 'Completed', sourceUrl: 'https://in.marketscreener.com/quote/stock/DIXON-TECHNOLOGIES-INDIA--111615221/news/Dixon-Technologies-Limited-acquired-50-1-stake-in-Ismartu-India-Private-Limited-from-Ismartu-In-Pte-47639436/', sourceName: 'MarketScreener' },
    { id: 33, date: '2024-12-15', type: 'JV', company: 'Dixon Technologies', target: 'Dixon-Vivo JV (51:49)', dealSize: null, valuationMultiple: 'N/A', buyer: 'Dixon Technologies (51%) + Vivo India (49%)', rationale: 'Binding term sheet for JV for OEM manufacturing of smartphones and electronic devices. Dixon holds 51% stake.', status: 'Pending Approval', sourceUrl: 'https://www.business-standard.com/markets/news/dixon-vivo-form-jv-to-make-smartphones-in-india-shares-scale-record-high-124121600169_1.html', sourceName: 'Business Standard' },
    { id: 34, date: '2025-04-15', type: 'JV', company: 'Dixon Technologies', target: 'Dixon-Signify JV (Lighting OEM)', dealSize: null, valuationMultiple: 'N/A', buyer: 'Dixon + Signify Innovations (Philips Lighting)', rationale: 'Binding term sheet for JV focused on OEM business of lighting products and accessories in India.', status: 'Announced', sourceUrl: 'https://www.digitimes.com/news/a20250331VL200/dixon-ems-lighting-joint-venture-manufacturing.html', sourceName: 'Digitimes' },
    { id: 35, date: '2025-07-16', type: 'M&A', company: 'Dixon Technologies', target: 'Q Tech India (51% stake)', dealSize: null, valuationMultiple: 'N/A', buyer: 'Dixon Technologies', rationale: 'Binding term sheet to acquire 51% stake in Q Tech India for manufacturing camera modules and fingerprint modules for mobile, IoT, automotive.', status: 'Pending Approval', sourceUrl: 'https://www.business-standard.com/markets/capital-market-news/dixon-tech-climbs-on-signing-two-strategic-deals-to-boost-electronics-manufacturing-125071600799_1.html', sourceName: 'Business Standard' },
    { id: 36, date: '2026-02-15', type: 'Govt Incentive', company: 'Dixon Technologies', target: 'PLI Mobile & IT Hardware', dealSize: 1527, valuationMultiple: 'N/A', buyer: 'Govt of India (MeitY)', rationale: 'Dixon major PLI beneficiary for mobile phones and IT hardware. Allocation reduced to ₹1,527 Cr from ₹9,000 Cr. Uncertainty about extension post FY26.', status: 'Active', sourceUrl: 'https://scanx.trade/stock-market-news/stocks/dixon-technologies-pli-allocation-reduced-to-rs-1-527-crore-from-rs-9-000-crore-for-mobile-and-it-hardware/31476038', sourceName: 'ScanX Trade' },
    { id: 37, date: '2026-02-15', type: 'Capex', company: 'Dixon Technologies', target: 'Display Fabrication Facility (8.6G)', dealSize: 25000, valuationMultiple: 'N/A', buyer: 'Dixon + HKC (China) / India Semiconductor Mission', rationale: 'Planned $2.7-3 billion display fab in Noida. 60,000 substrates/month. Fuelled by India Semiconductor Mission incentives. Production target late Q1/early Q2 FY26.', status: 'Planned', sourceUrl: 'https://techovedas.com/3-billion-investment-dixon-technologies-plans-display-fabrication-facility-in-india/', sourceName: 'Techovedas' },

    // ── AMBER ENTERPRISES ────────────────────────────────────────
    { id: 38, date: '2026-01-19', type: 'Land Allotment', company: 'Amber Enterprises', target: 'YEIDA Jewar Manufacturing Facility', dealSize: 6785, valuationMultiple: 'N/A', buyer: 'Amber + Ascent-K Circuit (subsidiary)', rationale: '100 acres for new manufacturing facility near Jewar Airport + 16 acres for Ascent-K PCB unit; 3,000+ direct jobs.', status: 'Allotted', sourceUrl: 'https://scanx.trade/stock-market-news/corporate-actions/amber-enterprises-india-reports-q2-net-loss-of-329m-rupees-amid-revenue-decline/23978722', sourceName: 'ScanX Trade' },
    { id: 39, date: '2025-09-22', type: 'QIP', company: 'Amber Enterprises', target: 'Amber Enterprises (QIP Round 1)', dealSize: 1000, valuationMultiple: '₹7,950/share', buyer: 'Qualified Institutional Buyers', rationale: 'Raised ~₹1,000 Cr via QIP. Allocated 12,57,861 equity shares at ₹7,950/share to qualified institutional buyers.', status: 'Completed', sourceUrl: 'https://law.asia/amber-enterprises-qip-deal/', sourceName: 'Law.asia' },
    { id: 40, date: '2025-09-15', type: 'QIP', company: 'Amber Enterprises', target: 'Amber Enterprises (QIP Round 2)', dealSize: 2500, valuationMultiple: '₹7,791/share floor', buyer: 'Qualified Institutional Buyers', rationale: 'Board approved second QIP to raise up to ₹2,500 Cr with floor price of ₹7,790.88/share.', status: 'Announced', sourceUrl: 'https://www.icicidirect.com/research/equity/trending-news/amber-enterprises-opens-2-500-cr-qip-for-equity-shares', sourceName: 'ICICI Direct' },
    { id: 41, date: '2025-09-07', type: 'PE Investment', company: 'Amber Enterprises (IL JIN)', target: 'ILJIN Electronics (India)', dealSize: 1200, valuationMultiple: 'N/A', buyer: 'ChrysCapital (₹1,100 Cr) + InCred Growth Partners + Raptor + Two Infinity', rationale: '₹1,200 Cr from PE investors for ILJIN Electronics via equity shares and CCPS. Funds for Hosur expansion and PCB capabilities.', status: 'Completed', sourceUrl: 'https://www.business-standard.com/markets/news/amber-enterprises-raises-1200-crore-iljin-electronics-125090700515_1.html', sourceName: 'Business Standard' },
    { id: 42, date: '2025-08-05', type: 'M&A', company: 'Amber Enterprises (IL JIN)', target: 'Power-One Micro Systems (60% stake)', dealSize: 262, valuationMultiple: 'N/A', buyer: 'IL JIN Electronics India Pvt Ltd', rationale: 'ILJIN acquired 60% stake in Power-One Micro Systems (BESS, solar inverters, EV chargers, UPS solutions).', status: 'Completed', sourceUrl: 'https://www.angelone.in/news/market-updates/amber-enterprises-subsidiary-il-jin-acquires-60-stake-in-power-one-for-262-crore', sourceName: 'Angel One' },
    { id: 43, date: '2025-07-27', type: 'M&A', company: 'Amber Enterprises (IL JIN)', target: 'Unitronics (Israel) (~40.24% controlling stake)', dealSize: 404, valuationMultiple: 'NIS 27.75/share', buyer: 'IL JIN Electronics via ILJIN Holding', rationale: 'ILJIN acquired ~40.24% controlling stake in Israel-listed Unitronics (1989). 56.24 lakh shares at NIS 27.75/share (₹404 Cr). Expanding Industry 4.0 solutions.', status: 'Completed', sourceUrl: 'https://www.business-standard.com/markets/capital-market-news/amber-enterprises-gains-as-arm-il-jin-acquires-controlling-stake-in-israel-s-unitronics-125072800206_1.html', sourceName: 'Business Standard' },
    { id: 44, date: '2025-11-14', type: 'M&A', company: 'Amber Enterprises (IL JIN)', target: 'Shogini Technoarts Pvt Ltd (PCB)', dealSize: null, valuationMultiple: 'N/A', buyer: 'IL JIN Electronics (India) Pvt Ltd', rationale: 'Majority stake in Shogini Technoarts — Pune-based PCB manufacturer (est. 1982). Top-5 Indian PCB maker. Revenue ₹391 Cr in FY25. Reducing reliance on external PCB suppliers.', status: 'Announced', sourceUrl: 'https://www.businesstoday.in/markets/stocks/story/amber-group-to-acquire-majority-stake-in-shogini-technoarts-key-details-502327-2025-11-15', sourceName: 'BusinessToday' },
    { id: 45, date: '2026-02-15', type: 'M&A', company: 'Amber Enterprises (IL JIN)', target: 'Stelltek (JV → Subsidiary)', dealSize: null, valuationMultiple: 'N/A', buyer: 'IL JIN Electronics', rationale: 'ILJIN gained control of Stelltek; the joint venture became a subsidiary with Stelltek becoming an ILJIN/Amber step-down subsidiary.', status: 'Completed', sourceUrl: 'https://tracxn.com/d/companies/amber-enterprises-india/__WbeR63g9q9NpMMz3xZQy2OEj46liHpiGyEJnCuOLLPQ', sourceName: 'Tracxn' },

    // ── TTK PRESTIGE ─────────────────────────────────────────────
    { id: 46, date: '2024-08-27', type: 'Buyback', company: 'TTK Prestige', target: 'TTK Prestige (16.67 lakh shares)', dealSize: 200, valuationMultiple: '₹1,200/share', buyer: 'Public Shareholders', rationale: 'Buyback of 16,66,666 equity shares (1.2% equity) at ₹1,200/share via tender offer. 25% premium over market. Acceptance ratio ~11% for retail.', status: 'Completed', sourceUrl: 'https://www.chittorgarh.com/buyback/ttk-prestige-buyback-2024/178/', sourceName: 'Chittorgarh.com' },
    { id: 47, date: '2024-06-12', type: 'Strategic Investment', company: 'TTK Prestige', target: 'GramyaHaat Rural Tech Pvt Ltd (>5% stake)', dealSize: 15, valuationMultiple: 'N/A', buyer: 'TTK Prestige', rationale: 'Investment via CCDs in rural distribution startup. Initial ₹5 Cr with total commitment up to ₹15 Cr. >5% equity on conversion.', status: 'Completed', sourceUrl: 'https://www.business-standard.com/markets/capital-market-news/ttk-prestige-to-invest-up-to-rs-15-cr-in-gramyahaat-124061200622_1.html', sourceName: 'Business Standard' },
    { id: 48, date: '2025-02-19', type: 'Capex', company: 'TTK Prestige', target: 'Manufacturing Modernization (3-year plan)', dealSize: 500, valuationMultiple: 'N/A', buyer: 'Internal (Self-funded)', rationale: 'Board approved ₹500 Cr over 3 FYs: ₹300 Cr capex (stainless steel tri-ply, appliances, plant automation) + ₹200 Cr opex (innovation, design, go-to-market).', status: 'Announced', sourceUrl: 'https://www.business-standard.com/markets/capital-market-news/ttk-prestige-gains-after-board-oks-rs-500-cr-capex-plan-125021900232_1.html', sourceName: 'Business Standard' },

    // ── JOHNSON CONTROLS-HITACHI / BOSCH HOME COMFORT ────────────
    { id: 49, date: '2025-07-31', type: 'M&A', company: 'JCHAC (now Bosch Home Comfort India)', target: 'JCHAC India (74.25% indirect acquisition)', dealSize: null, valuationMultiple: '$8.1B global', buyer: 'Robert Bosch GmbH', rationale: 'As part of global $8.1B transaction, Bosch acquired Johnson Controls\' residential HVAC business incl. 100% of JCH JV (JCI 60% + Hitachi 40%). Indirect control of 74.25% of JCHAC India.', status: 'Completed', sourceUrl: 'https://www.sullcrom.com/About/News-and-Events/Highlights/2025/August/Bosch-Completes-8-Billion-Acquisition-Residential-Light-Commercial-HVAC-Business-Johnson-Controls-Hitachi', sourceName: 'Sullivan & Cromwell' },
    { id: 50, date: '2025-12-09', type: 'M&A', company: 'JCHAC (now Bosch Home Comfort India)', target: 'JCHAC India (25.75% open offer)', dealSize: 382, valuationMultiple: '₹1,762.54/share', buyer: 'Robert Bosch GmbH / Bosch Global Software Technologies', rationale: 'SEBI mandatory open offer for 25.75% minority stake (70 lakh shares). Tendering Nov 13-26, 2025. 21.67 lakh shares tendered (31% acceptance). Bosch post-offer holding: ~82.22%.', status: 'Completed', sourceUrl: 'https://www.sebi.gov.in/sebi_data/commondocs/jul-2024/Johnson%20Controls-Hitachi%20Air%20Conditioning%20India%20Limited_PA_p.pdf', sourceName: 'SEBI Filing' },
    { id: 51, date: '2026-02-15', type: 'Govt Incentive', company: 'JCHAC (now Bosch Home Comfort India)', target: 'PLI White Goods Scheme (AC category)', dealSize: null, valuationMultiple: 'N/A', buyer: 'Govt of India (DPIIT)', rationale: 'JCHAC selected as PLI beneficiary for White Goods (AC category) in Round 1. Incentives of 4-6% on incremental domestic manufacturing sales.', status: 'Active', sourceUrl: 'https://pib.gov.in/PressReleasePage.aspx?PRID=1769229', sourceName: 'PIB' },
  ],

  // ============================================================
  // LEADERSHIP CHANGES
  // ============================================================
  leadershipChanges: [
    {
      date: '2024-12-01',
      company: 'Whirlpool of India',
      change: 'CEO Change',
      detail: 'Narasimhan Eswar appointed as new MD following parent company restructuring',
      riskLevel: 'Medium',
      implication: 'Strategy shift expected; focus on India-specific products likely',
    },
    {
      date: '2024-09-15',
      company: 'Bajaj Electricals',
      change: 'CEO Change',
      detail: 'Anuj Poddar stepped down; Shekhar Bajaj resumed interim leadership',
      riskLevel: 'High',
      implication: 'Strategic uncertainty; EPC business separation still pending; promoter-led turnaround attempt',
    },
    {
      date: '2024-07-01',
      company: 'Crompton Greaves Consumer',
      change: 'CFO Change',
      detail: 'New CFO appointed from FMCG background to drive Butterfly integration',
      riskLevel: 'Low',
      implication: 'FMCG expertise brought in for consumer-focused transformation',
    },
    {
      date: '2025-01-15',
      company: 'IFB Industries',
      change: 'Board Reshuffle',
      detail: 'Two independent directors replaced; PE-backed board members added',
      riskLevel: 'Medium',
      implication: 'Possible preparation for stake sale or strategic investor; operational improvement mandate',
    },
    {
      date: '2024-04-10',
      company: 'Orient Electric',
      change: 'CEO Appointment',
      detail: 'New CEO from Unilever background appointed to drive premiumization',
      riskLevel: 'Low',
      implication: 'FMCG-style brand building expected; distribution overhaul likely',
    },
    {
      date: '2023-11-20',
      company: 'Voltas',
      change: 'Promoter Stake',
      detail: 'Tata Group increased stake by 2% through open market purchase',
      riskLevel: 'Low',
      implication: 'Strong parent commitment; no delisting concerns',
    },
  ],

  // ============================================================
  // COMPETITIVE MOVES & STRATEGIC BETS
  // ============================================================
  competitiveMoves: [
    {
      date: '2025-01-20',
      company: 'Havells India',
      type: 'Product Launch',
      title: 'Lloyd Premium Inverter AC Range',
      detail: 'Launched AI-enabled smart AC range with IoT connectivity; targeting premium segment with 15% price premium',
      impact: 'High',
    },
    {
      date: '2024-11-05',
      company: 'Voltas',
      type: 'D2C Initiative',
      title: 'Direct-to-Consumer Platform Launch',
      detail: 'Launched voltas.com with full product catalog; integrated installation booking; loyalty program',
      impact: 'Medium',
    },
    {
      date: '2024-10-15',
      company: 'Blue Star',
      type: 'Plant Expansion',
      title: 'Sri City Manufacturing Facility',
      detail: '₹450 Cr investment for new AC manufacturing; capacity addition of 1M units; PLI scheme benefits',
      impact: 'High',
    },
    {
      date: '2024-08-20',
      company: 'Crompton Greaves Consumer',
      type: 'Product Launch',
      title: 'Crompton Silent Pro Fan Series',
      detail: 'BLDC motor fans with smart features; direct competition with Atomberg; premium pricing strategy',
      impact: 'Medium',
    },
    {
      date: '2024-06-10',
      company: 'Symphony',
      type: 'Partnership',
      title: 'International Distribution Agreement',
      detail: 'Exclusive distribution tie-up with Middle East retailer; targets 35% international revenue by 2026',
      impact: 'Medium',
    },
    {
      date: '2025-02-01',
      company: 'V-Guard Industries',
      type: 'Pricing Strategy',
      title: 'Aggressive Water Heater Pricing',
      detail: 'Launched economy range water heaters 20% below competition; targeting Tier 2/3 market share grab',
      impact: 'Medium',
    },
    {
      date: '2024-05-15',
      company: 'IFB Industries',
      type: 'D2C Initiative',
      title: 'IFB Point Store Expansion',
      detail: 'Added 50 exclusive IFB Point stores in metro cities; premium experience centers with live demos',
      impact: 'Low',
    },
    {
      date: '2024-12-10',
      company: 'Orient Electric',
      type: 'Product Launch',
      title: 'Designer Fan Collection',
      detail: 'Premium designer fans priced 3x standard range; targeting interior designer/architect segment',
      impact: 'Medium',
    },
  ],

  // ============================================================
  // OPERATIONAL INTELLIGENCE
  // Source: operational-intelligence-data.md (compiled Feb 20, 2026)
  // + Indian Consumer Durables Deep Dive.md (42 sources, Feb 19, 2026)
  // Confidence tags: VERIFIED / DERIVED / ESTIMATED (see operational-intelligence-data.md)
  // ============================================================
  operationalMetrics: {
    // Voltas 90% VERIFIED (Q3FY26 earnings call), Havells 87 (Q3 14.3% growth), Dixon 88 (near-capacity ops)
    capacityUtilization: {
      whirlpool: 78, voltas: 90, bluestar: 78, crompton: 76,
      bajaj_elec: 68, vguard: 80, ifb: 62, havells: 87, symphony: 70, orient: 73,
      dixon: 88, amber: 85, ttk_prestige: 75, butterfly: 73, bosch_jch: 55,
    },
    // Voltas 74 (deep local mfg efficiencies), Havells 88 (12 plants), Symphony 55 (100% outsourced!)
    localizationPct: {
      whirlpool: 75, voltas: 74, bluestar: 78, crompton: 82,
      bajaj_elec: 65, vguard: 85, ifb: 65, havells: 88, symphony: 55, orient: 78,
      dixon: 58, amber: 72, ttk_prestige: 82, butterfly: 80, bosch_jch: 55,
    },
    // Symphony 100% VERIFIED (outsourced to 9 OEM partners), Dixon/Amber 0 (they ARE the mfg)
    contractManufacturingPct: {
      whirlpool: 5, voltas: 15, bluestar: 8, crompton: 18,
      bajaj_elec: 35, vguard: 15, ifb: 5, havells: 8, symphony: 100, orient: 20,
      dixon: 0, amber: 0, ttk_prestige: 10, butterfly: 20, bosch_jch: 10,
    },
    afterSalesCostPct: {
      whirlpool: 3.2, voltas: 2.5, bluestar: 2.0, crompton: 1.8,
      bajaj_elec: 3.5, vguard: 2.2, ifb: 4.0, havells: 1.5, symphony: 1.2, orient: 2.0,
      dixon: 0.8, amber: 1.0, ttk_prestige: 1.8, butterfly: 2.2, bosch_jch: 2.5,
    },
    // DERIVED: 100% - localizationPct. Critical given AI-driven commodity shock (copper $12,500/ton)
    importDependency: {
      whirlpool: 25, voltas: 28, bluestar: 22, crompton: 18,
      bajaj_elec: 35, vguard: 15, ifb: 35, havells: 12, symphony: 45, orient: 22,
      dixon: 42, amber: 28, ttk_prestige: 18, butterfly: 20, bosch_jch: 45,
    },
    vendorConsolidationIndex: {
      whirlpool: 70, voltas: 72, bluestar: 75, crompton: 65,
      bajaj_elec: 48, vguard: 74, ifb: 55, havells: 82, symphony: 78, orient: 68,
      dixon: 80, amber: 78, ttk_prestige: 72, butterfly: 58, bosch_jch: 68,
    },
    // ESTIMATED from category benchmarks (white goods 2-3.5%, electronics 1-2%, B2B OEM 0.5-1%)
    warrantyPct: {
      whirlpool: 2.8, voltas: 2.0, bluestar: 1.8, crompton: 1.5,
      bajaj_elec: 2.5, vguard: 2.0, ifb: 3.5, havells: 1.2, symphony: 1.0, orient: 1.5,
      dixon: 0.5, amber: 0.8, ttk_prestige: 1.5, butterfly: 2.0, bosch_jch: 2.5,
    },
    // DERIVED: Rs Cr per distributor (where disclosed). null = dealer count not public.
    dealerProductivity: {
      whirlpool: null, voltas: 0.64, bluestar: 4.0, crompton: 2.81,
      bajaj_elec: 4.83, vguard: null, ifb: 10.61, havells: 1.21, symphony: null, orient: 0.02,
      dixon: null, amber: null, ttk_prestige: null, butterfly: null, bosch_jch: null,
    },
  },

  // ============================================================
  // SUB-SECTOR DEEP DIVE: HOME APPLIANCES
  // ============================================================
  // Sources: Segment sizes computed from real Q3 FY26 company revenue (annualized)
  //          Growth rates computed from real Q3 FY26 vs Q3 FY25 revenue
  //          Cost structure from real OPM% quartiles across 14 companies (FY25 annual P&L)
  //          Margin levers: editorial/advisory (no structured source data)
  subSectorDeepDive: {
    title: 'Consumer Durables',
    marketSize: 139480, // ₹ Cr (annualized from Q3 FY26 aggregate: 34,870 × 4)
    growthRate: 6.6, // Real: Q3 FY26 vs Q3 FY25 aggregate YoY %
    segments: [
      // Real: aggregated from tracked companies by subCategory
      { name: 'White Goods', size: 49220, growth: 9.3, leaders: ['Voltas', 'Blue Star', 'Whirlpool'], note: 'Whirlpool, Voltas, Blue Star, IFB, Symphony, Amber' },
      { name: 'Consumer Electronics', size: 90260, growth: 5.2, leaders: ['Havells', 'Dixon', 'Crompton'], note: 'Havells, Dixon, Crompton, V-Guard, Orient, Bajaj, TTK, Butterfly' },
    ],
    costStructureBenchmark: {
      // Computed from real FY25 OPM% across 14 companies (Expenses as % of Revenue)
      // Total cost = 100 - OPM%. Top quartile = lowest cost = highest OPM
      totalExpenses: { topQuartile: 90.3, median: 93.0, bottomQuartile: 93.8 },
      // Individual cost breakdowns NOT available from P&L (only total expenses reported)
      // Setting to null — no source data for raw materials/labor/logistics/marketing/overhead split
      rawMaterials: null,
      labor: null,
      logistics: null,
      marketing: null,
      overhead: null,
    },
    marginLevers: [
      { lever: 'Product Mix Premiumization', potentialImpact: '150-300 bps', difficulty: 'Medium', timeframe: '12-18 months' },
      { lever: 'Component Localization', potentialImpact: '100-200 bps', difficulty: 'High', timeframe: '18-24 months' },
      { lever: 'D2C Channel Expansion', potentialImpact: '50-150 bps', difficulty: 'Medium', timeframe: '6-12 months' },
      { lever: 'After-Sales Cost Optimization', potentialImpact: '30-80 bps', difficulty: 'Low', timeframe: '3-6 months' },
      { lever: 'Vendor Consolidation', potentialImpact: '50-100 bps', difficulty: 'Low', timeframe: '6-12 months' },
      { lever: 'Energy Rating Compliance', potentialImpact: '20-50 bps', difficulty: 'High', timeframe: '12-18 months' },
    ],
  },

  // ============================================================
  // WATCHLIST & FORWARD INDICATORS
  // ============================================================
  watchlist: {
    likelyFundraises: [
      { company: 'Atomberg Technologies', probability: 85, timeline: '60 days', type: 'Series D', estimatedSize: '₹500-700 Cr' },
      { company: 'Stove Kraft', probability: 60, timeline: '90 days', type: 'QIP', estimatedSize: '₹200-300 Cr' },
    ],
    marginInflectionCandidates: [
      { company: 'Orient Electric', signal: 'Premium mix crossing 30%; operational leverage kicking in', confidence: 75 },
      { company: 'V-Guard Industries', signal: 'Sunflame synergies + national distribution build-out nearing completion', confidence: 80 },
    ],
    consolidationTargets: [
      { company: 'IFB Industries', signal: 'Persistent margin pressure; board changes suggest openness to strategic options', probability: 65 },
      { company: 'Bajaj Electricals', signal: 'Post-EPC separation; consumer business needs scale; promoter group may consider options', probability: 45 },
    ],
    stressIndicators: [
      { company: 'IFB Industries', indicators: ['Declining ROCE (5.5%)', 'Rising debt (2.0x)', 'Capacity utilization at 58%', 'Working capital days increasing'], severity: 'High' },
      { company: 'Bajaj Electricals', indicators: ['ROCE below 9%', 'High inventory days (70)', 'Dealer productivity declining', 'Leadership uncertainty'], severity: 'Medium' },
    ],
  },

  // ============================================================
  // EXECUTIVE SNAPSHOT - MONTH IN 5 BULLETS
  // ============================================================
  executiveSnapshot: {
    month: 'February 2026',
    bullets: [
      'AC season gearing up strong — early indicators show 18-20% pre-season booking growth vs last year, driven by extended summer forecast and BEE rating transition.',
      'V-Guard Sunflame integration on track — combined entity now #3 in kitchen appliances; management guiding 200bps synergy benefit by Q4 FY26.',
      'IFB stress signals intensifying — ROCE dropped to 5.5%; three board changes in 6 months; informal conversations about strategic options reported.',
      'PLI benefits starting to flow — Blue Star and Voltas first beneficiaries with ₹120 Cr combined incentives in FY25; expect to accelerate localization capex.',
      'D2C channel crossing 8-10% of revenue for top players — Voltas and Havells leading with proprietary platforms; margin accretion of 200-400bps on D2C sales.',
    ],
    bigThemes: [
      'Premiumization accelerating — premium segment growing 2x mass market across categories',
      'Component localization wave — PLI scheme driving ₹2,000 Cr+ investment commitments',
      'Digital transformation of distribution — E-commerce + D2C now 35-40% of sales for leaders',
      'Consolidation cycle beginning — Expect 2-3 more deals in next 12 months as scale becomes critical',
    ],
    redFlags: [
      { flag: 'BEE Rating Transition Risk', detail: 'New energy ratings effective July 2025; ₹800 Cr+ old inventory across industry needs liquidation', severity: 'High' },
      { flag: 'Copper Price Surge', detail: 'LME copper up 15% in 2 months; will pressure AC margins in Q1-Q2 FY26 if sustained', severity: 'Medium' },
      { flag: 'China Dumping Concerns', detail: 'Compressor imports from China up 30% YoY; domestic manufacturers flagging unfair pricing', severity: 'Medium' },
    ],
    confidenceScore: 78,
  },

  // ============================================================
  // "WHAT THIS MEANS FOR..." INSIGHTS
  // ============================================================
  stakeholderInsights: {
    peInvestors: [
      'IFB Industries emerging as potential turnaround play — enterprise value depressed at ~0.6x revenue vs sector average of 2.5x; operational improvement could unlock 4-5x return.',
      'Atomberg-style D2C brands in adjacent categories (water purifiers, kitchen chimney) are ripe for PE roll-up strategy.',
      'Post-PLI investments, expect mid-market companies to need growth capital — ideal for ₹200-500 Cr cheque sizes.',
      'Warranty/after-sales service companies are an underappreciated consolidation opportunity in this sector.',
    ],
    founderPromoters: [
      'Scale is becoming non-negotiable — companies below ₹2,000 Cr revenue will struggle with D2C investment and PLI compliance.',
      'Premiumization is the single biggest margin lever — every 5% shift in premium mix adds 50-75bps to EBITDA.',
      'Distribution is the real moat — e-commerce evens the field, but GT+MT network is still 60-70% of sales.',
      'Consider strategic partnerships over going alone — Voltas-Beko model showing that JVs can work in India.',
    ],
    coosCfos: [
      'Working capital optimization: Top quartile at 28 days vs bottom quartile at 78 days — ₹200-400 Cr cash unlock opportunity.',
      'Localization to 80%+ reduces currency risk and improves margins by 150-200bps; Blue Star and Havells are benchmarks.',
      'After-sales cost ranges from 1.5% to 4.2% of revenue — standardization and digitization can halve the gap.',
      'Vendor consolidation index needs to reach 70+ for procurement leverage; Bajaj Electricals (45) has most room to improve.',
    ],
    supplyChainHeads: [
      'BEE transition creates ₹800 Cr inventory write-down risk across sector — plan component procurement accordingly.',
      'China+1 strategy accelerating — Vietnam and India capacity additions in compressors will change sourcing dynamics by 2026.',
      'Contract manufacturing dependency above 30% is a risk — Bajaj (40%) and Symphony (45%) most exposed.',
      'Logistics costs for last-mile delivery in Tier 3+ cities are 2x metro — optimize hub-and-spoke model.',
    ],
  },

  // ============================================================
  // A&M VALUE-ADD OPPORTUNITIES
  // ============================================================
  amValueAdd: [
    {
      opportunity: 'IFB Industries Operational Turnaround',
      type: 'Performance Improvement',
      estimatedValue: '₹150-200 Cr EBITDA improvement over 24 months',
      detail: 'Working capital restructuring (78→45 days), capacity utilization improvement (58%→75%), localization push (58%→70%), after-sales cost reduction (4.2%→2.5%)',
      urgency: 'High',
      confidence: 85,
    },
    {
      opportunity: 'Bajaj Electricals Strategic Repositioning',
      type: 'Strategy & Restructuring',
      estimatedValue: 'Unlock ₹3,000-4,000 Cr enterprise value',
      detail: 'Post-EPC separation advisory; consumer business strategy reset; brand portfolio rationalization; dealer network productivity improvement',
      urgency: 'High',
      confidence: 75,
    },
    {
      opportunity: 'Crompton-Butterfly Integration Acceleration',
      type: 'Post-Merger Integration',
      estimatedValue: '₹80-120 Cr synergy realization',
      detail: 'Supply chain consolidation, cross-selling activation, brand architecture optimization, IT systems integration',
      urgency: 'Medium',
      confidence: 70,
    },
    {
      opportunity: 'Sector-Wide Working Capital Optimization',
      type: 'Cash & Working Capital',
      estimatedValue: '₹500-800 Cr aggregate cash release across 5 mid-tier companies',
      detail: 'Inventory management, receivables optimization, vendor financing programs, channel financing restructuring',
      urgency: 'Medium',
      confidence: 80,
    },
    {
      opportunity: 'PLI Scheme Compliance & Optimization',
      type: 'Regulatory & Incentive Advisory',
      estimatedValue: '₹200-300 Cr incremental PLI benefits for mid-tier companies',
      detail: 'PLI application support, capex planning, domestic value addition calculation, incentive maximization strategy',
      urgency: 'Medium',
      confidence: 65,
    },
  ],

  // ============================================================
  // SEASONAL PATTERNS (Monthly Index, 100 = Average)
  // ============================================================
  seasonalPatterns: {
    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    ac:           [60, 70, 95, 140, 160, 150, 110, 80, 70, 65, 55, 45],
    refrigerator: [80, 85, 100,120, 130, 125, 105, 90, 85, 90, 95, 95],
    washingMachine:[90, 85, 95, 105, 110, 115, 100, 95, 90, 100,110, 105],
    fan:          [60, 75, 100,140, 155, 145, 110, 85, 70, 60, 50, 50],
    waterHeater:  [150,140, 110,70,  50,  45,  50, 55, 65, 90, 130, 145],
    airCooler:    [70, 85, 120,160, 170, 140, 80, 55, 45, 40, 35, 50],
  },

  // ============================================================
  // SENTIMENT ANALYSIS (Score 0-100)
  // ============================================================
  // Sentiment scores derived from Sovrenn quarterly result tags (EXCELLENT/GOOD/AVERAGE/POOR/WEAK)
  // Methodology: Recency-weighted avg on 20-100 scale (EXCELLENT=100, GOOD=80, AVERAGE=60, POOR=40, WEAK=20)
  // news/analyst/social breakdowns NOT available from source — only overall earnings quality score
  sentimentScores: {
    whirlpool: { news: null, analyst: null, social: null, overall: 50 },  // 4 Qs: AVG, WEAK, AVG, GOOD
    voltas:    { news: null, analyst: null, social: null, overall: 20 },  // 2 Qs: WEAK, WEAK
    bluestar:  { news: null, analyst: null, social: null, overall: 62 },  // 4 Qs: AVG, AVG, AVG, GOOD
    crompton:  { news: null, analyst: null, social: null, overall: 40 },  // 4 Qs: AVG, WEAK, WEAK, AVG
    bajaj_elec:{ news: null, analyst: null, social: null, overall: 47 },  // 2 Qs: AVG, WEAK
    vguard:    { news: null, analyst: null, social: null, overall: 50 },  // 3 Qs: AVG, WEAK, GOOD
    ifb:       { news: null, analyst: null, social: null, overall: 68 },  // 4 Qs: AVG, GOOD, AVG, GOOD
    havells:   { news: null, analyst: null, social: null, overall: 62 },  // 4 Qs: GOOD, AVG, WEAK, GOOD
    symphony:  { news: null, analyst: null, social: null, overall: 50 },  // 3 Qs: POOR, POOR, EXCELLENT
    orient:    { news: null, analyst: null, social: null, overall: 70 },  // 3 Qs: GOOD, AVG, AVG
    dixon:     { news: null, analyst: null, social: null, overall: 73 },  // 2 Qs: AVG, EXCELLENT
    amber:     { news: null, analyst: null, social: null, overall: 87 },  // 2 Qs: GOOD, EXCELLENT
    ttk_prestige:{ news: null, analyst: null, social: null, overall: 60 },// 3 Qs: AVG, GOOD, WEAK
    butterfly: { news: null, analyst: null, social: null, overall: null }, // No Sovrenn data
    bosch_jch: { news: null, analyst: null, social: null, overall: 33 },  // 2 Qs: WEAK, AVG
  },
};

// Helper functions
const DataUtils = {
  getCompany(id) {
    return DATA.companies.find(c => c.id === id);
  },

  getLatestQuarterIndex() {
    return DATA.quarters.length - 1;
  },

  // Map time period filter value → quarter index (last quarter of that period)
  getQuarterIndexForPeriod(period) {
    const map = { latest: 14, fy2025: 11, fy2024: 7, fy2023: 3, all: 14 };
    return map[period] ?? 14;
  },

  // Map time period → [startIdx, endIdx] inclusive (for chart slicing)
  getQuarterRangeForPeriod(period) {
    const ranges = { latest: [0, 14], fy2025: [8, 11], fy2024: [4, 7], fy2023: [0, 3], all: [0, 14] };
    return ranges[period] || [0, 14];
  },

  // Get value at a specific quarter index
  getValueAt(companyId, metric, quarterIdx) {
    const d = DATA.financials[companyId]?.[metric];
    if (!d || quarterIdx < 0 || quarterIdx >= d.length) return null;
    return d[quarterIdx];
  },

  // YoY growth at a specific quarter index (compares same quarter previous year)
  getYoYGrowthAt(companyId, metric, quarterIdx) {
    const d = DATA.financials[companyId]?.[metric];
    if (!d) return 'N/A';
    const current = d[quarterIdx];
    const prior = quarterIdx >= 4 ? d[quarterIdx - 4] : null;
    if (current === null || prior === null || prior === 0) return 'N/A';
    return ((current - prior) / prior * 100).toFixed(1);
  },

  getYoYGrowth(companyId, metric) {
    const d = DATA.financials[companyId]?.[metric];
    if (!d) return 'N/A';
    const latest = d[d.length - 1];
    const yoyPrior = d.length >= 5 ? d[d.length - 5] : d[0];
    if (latest === null || yoyPrior === null || yoyPrior === 0) return 'N/A';
    return ((latest - yoyPrior) / yoyPrior * 100).toFixed(1);
  },

  getQoQGrowth(companyId, metric) {
    const d = DATA.financials[companyId]?.[metric];
    if (!d) return 'N/A';
    const latest = d[d.length - 1];
    const prior = d[d.length - 2];
    if (latest === null || prior === null || prior === 0) return 'N/A';
    return ((latest - prior) / prior * 100).toFixed(1);
  },

  getLatestValue(companyId, metric) {
    const d = DATA.financials[companyId]?.[metric];
    if (!d) return null;
    // Return last non-null value
    for (let i = d.length - 1; i >= 0; i--) {
      if (d[i] !== null) return d[i];
    }
    return null;
  },

  getAnnualRevenue(companyId, fy) {
    // FY = fiscal year ending March. FY23 quarters are at indices 0-3, FY24 at 4-7, FY25 at 8-11
    const startMap = { 'FY23': 0, 'FY24': 4, 'FY25': 8 };
    const start = startMap[fy] ?? startMap[fy.toString()];
    if (start === undefined) return null;
    const rev = DATA.financials[companyId]?.revenue;
    if (!rev) return null;
    const slice = rev.slice(start, start + 4);
    // Handle nulls — if any quarter is null, return null (incomplete year)
    if (slice.some(v => v === null)) return null;
    return slice.reduce((a, b) => a + b, 0);
  },

  getRatingColor(rating) {
    if (rating === 'Outperform') return '#22c55e';
    if (rating === 'Inline') return '#f59e0b';
    return '#ef4444';
  },

  getRatingBg(rating) {
    if (rating === 'Outperform') return 'rgba(34,197,94,0.12)';
    if (rating === 'Inline') return 'rgba(245,158,11,0.12)';
    return 'rgba(239,68,68,0.12)';
  },

  getSeverityColor(severity) {
    if (severity === 'High') return '#ef4444';
    if (severity === 'Medium') return '#f59e0b';
    return '#22c55e';
  },

  formatCurrency(val) {
    if (val >= 10000) return '₹' + (val / 1000).toFixed(1) + 'K Cr';
    return '₹' + val.toLocaleString('en-IN') + ' Cr';
  },

  formatNumber(val) {
    return val.toLocaleString('en-IN');
  },

  getAllCompanyIds() {
    return DATA.companies.map(c => c.id);
  },

  getSubCategories() {
    return [...new Set(DATA.companies.map(c => c.subCategory))];
  },
};

// ============================================================
// AUTO-COMPUTE PERFORMANCE RATINGS (Peer-Relative Scoring)
// Each company is ranked against the peer group on 5 metrics.
// Percentile rank: 100 = best in group, 0 = worst.
// Composite = weighted average of percentiles.
// Weights: RevGrowth 25%, EBITDA 25%, MarginTrend 15%, ROCE 20%, PAT 15%
// Thresholds: >=60 Outperform, >=38 Inline, <38 Underperform
// Cap: revenue decline >15% YoY → max Inline
// ============================================================
(function() {
  const ids = DATA.companies.map(c => c.id);
  const L = DATA.quarters.length - 1;   // 14 = Q3 FY26
  const Y = L - 4;                       // 10 = Q3 FY25 (same quarter last year)

  // 1. Compute raw metrics per company
  const raw = {};
  ids.forEach(id => {
    const f = DATA.financials[id];
    if (!f || f.revenue[L] === null) { raw[id] = null; return; }
    const revNow = f.revenue[L], revYoY = f.revenue[Y];
    let roce = null;
    for (let i = f.roce.length - 1; i >= 0; i--) { if (f.roce[i] !== null) { roce = f.roce[i]; break; } }
    raw[id] = {
      revGrowth:   revYoY && revYoY !== 0 ? (revNow - revYoY) / revYoY * 100 : null,
      ebitda:      f.ebitdaMargin[L],
      ebitdaTrend: f.ebitdaMargin[L] !== null && f.ebitdaMargin[Y] !== null
                     ? f.ebitdaMargin[L] - f.ebitdaMargin[Y] : null,
      roce:        roce,
      pat:         f.patMargin[L],
    };
  });

  // 2. Percentile rank (handles ties by averaging)
  function pctRank(arr) {
    const valid = arr.filter(v => v.val !== null).sort((a, b) => b.val - a.val);
    const n = valid.length;
    if (n === 0) return {};
    const out = {};
    let i = 0;
    while (i < n) {
      let j = i;
      while (j < n - 1 && valid[j + 1].val === valid[j].val) j++;
      const avgRank = (i + j) / 2;
      const pct = n > 1 ? (n - 1 - avgRank) / (n - 1) * 100 : 50;
      for (let k = i; k <= j; k++) out[valid[k].id] = pct;
      i = j + 1;
    }
    return out;
  }

  // 3. Rank each metric
  const validIds = ids.filter(id => raw[id] !== null);
  const ranks = {
    revGrowth:   pctRank(validIds.map(id => ({ id, val: raw[id].revGrowth }))),
    ebitda:      pctRank(validIds.map(id => ({ id, val: raw[id].ebitda }))),
    ebitdaTrend: pctRank(validIds.map(id => ({ id, val: raw[id].ebitdaTrend }))),
    roce:        pctRank(validIds.map(id => ({ id, val: raw[id].roce }))),
    pat:         pctRank(validIds.map(id => ({ id, val: raw[id].pat }))),
  };

  // 4. Weighted composite
  const W = { revGrowth: 0.25, ebitda: 0.25, ebitdaTrend: 0.15, roce: 0.20, pat: 0.15 };
  validIds.forEach(id => {
    const m = raw[id];
    let score = 0, totalW = 0;
    for (const [key, w] of Object.entries(W)) {
      if (m[key] !== null && ranks[key][id] !== undefined) {
        score += ranks[key][id] * w;
        totalW += w;
      }
    }
    if (totalW > 0) score /= totalW;

    // Cap: severe revenue decline (>15%) → max Inline
    const cappedByDecline = m.revGrowth !== null && m.revGrowth < -15;
    let rating;
    if (cappedByDecline)        rating = score >= 38 ? 'Inline' : 'Underperform';
    else if (score >= 60)       rating = 'Outperform';
    else if (score >= 38)       rating = 'Inline';
    else                        rating = 'Underperform';

    // Build reason from actual metrics
    const parts = [];
    if (m.revGrowth !== null) parts.push('Rev ' + (m.revGrowth >= 0 ? '+' : '') + m.revGrowth.toFixed(1) + '% YoY');
    if (m.ebitda !== null) parts.push('EBITDA ' + m.ebitda + '%');
    if (m.ebitdaTrend !== null) parts.push('margin ' + (m.ebitdaTrend >= 0 ? '+' : '') + m.ebitdaTrend.toFixed(1) + 'pp');
    if (m.roce !== null) parts.push('ROCE ' + m.roce + '%');
    if (cappedByDecline) parts.push('(capped: revenue decline)');

    DATA.performanceRatings[id] = { rating, reason: parts.join('; '), score: Math.round(score) };
  });

  // Handle companies with no data
  ids.forEach(id => {
    if (!DATA.performanceRatings[id]) {
      DATA.performanceRatings[id] = { rating: 'N/A', reason: 'No financial data available', score: null };
    }
  });
})();
