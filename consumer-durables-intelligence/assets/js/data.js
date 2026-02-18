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
      promoterHolding: 51.0,
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
      promoterHolding: 30.3,
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
      promoterHolding: 38.6,
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
      promoterHolding: 0.0,
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
      promoterHolding: 63.1,
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
      promoterHolding: 55.2,
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
      promoterHolding: 48.3,
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
      promoterHolding: 59.5,
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
      promoterHolding: 73.5,
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
      promoterHolding: 37.5,
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
      promoterHolding: 33.6,
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
      promoterHolding: 39.2,
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
      promoterHolding: 71.2,
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
      promoterHolding: 55.0,
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
      promoterHolding: 74.3,
      exportRevenuePct: 8.0,
    },
  ],

  // ============================================================
  // QUARTERLY FINANCIAL DATA (Q1 FY23 to Q3 FY26, Indian fiscal year)
  // Indices: 0=Q1FY23, 1=Q2FY23, 2=Q3FY23, 3=Q4FY23, 4=Q1FY24, 5=Q2FY24, 6=Q3FY24, 7=Q4FY24,
  //          8=Q1FY25, 9=Q2FY25, 10=Q3FY25, 11=Q4FY25, 12=Q1FY26, 13=Q2FY26, 14=Q3FY26
  // Real data from MD files: indices 11-14 (Q4 FY25 through Q3 FY26)
  // YoY backdated real data: indices 7-10 (Q4 FY24 through Q3 FY25) where available
  // Backfill (simulated): indices 0-6 (Q1 FY23 through Q3 FY24)
  // ============================================================
  quarters: ['Q1 FY23','Q2 FY23','Q3 FY23','Q4 FY23','Q1 FY24','Q2 FY24','Q3 FY24','Q4 FY24','Q1 FY25','Q2 FY25','Q3 FY25','Q4 FY25','Q1 FY26','Q2 FY26','Q3 FY26'],

  financials: {
    // ================================================================
    // REAL DATA INDICES: 7=Q4FY24, 8=Q1FY25, 9=Q2FY25, 10=Q3FY25 (YoY backdated from MD comparisons)
    //                    11=Q4FY25, 12=Q1FY26, 13=Q2FY26, 14=Q3FY26 (directly from MD RESULT SUMMARY)
    // Indices 0-6 (Q1FY23 through Q3FY24): backfill — populated in Phase 4
    // Non-financial metrics (workingCapDays, inventoryDays, etc.): null — not in quarterly MD reports
    // ================================================================

    // WHIRLPOOL — 4 real + 4 YoY backdated quarters
    // Dec '25 NP impacted by one-time wage code provision of Rs 39 Cr
    whirlpool: {
      revenue:       [2141,1469,1462,1606, 2312,1586,1579,1734, 2497,1713,1705,2005, 2432,1647,1774],
      ebitdaMargin:  [ 8.1, 3.8, 4.2, 8.4,  8.4, 4.1, 4.5, 8.3,  8.5, 5.1, 4.0, 9.1,  8.7, 3.5, 5.1],
      patMargin:     [ 5.6, 2.5, 1.8, 5.0,  5.8, 2.8, 2.0, 4.6,  5.8, 3.2, 2.6, 5.9,  6.0, 2.5, 1.5],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
    // VOLTAS — 4 real + 3 YoY backdated; Dec '25 from news feed (total income 3120, PBT 116 Cr)
    // Dec '24 (idx 10) not available in any source
    voltas: {
      revenue:       [3923,2088,2221,3753, 4394,2338,2487,4203, 4921,2619,null,4768, 3939,2347,3120],
      ebitdaMargin:  [ 5.4, 2.8, 3.3, 4.7,  5.7, 3.1, 3.6, 3.6,  8.0, 5.0,null, 6.3,  3.9, 1.4, 3.7],
      patMargin:     [ 4.9, 3.0, 2.5, 3.5,  5.0, 3.1, 2.8, 2.6,  6.8, 5.1,null, 4.9,  3.6, 1.4, 2.8],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
    // BLUE STAR — 4 real + 4 YoY backdated
    // Dec '25 NP impacted by one-time Gratuity & Leave Encashment
    bluestar: {
      revenue:       [2166,1721,2122,2894, 2491,1979,2441,3328, 2865,2276,2807,4019, 2982,2422,2925],
      ebitdaMargin:  [ 7.0, 6.5, 7.1, 6.8,  7.3, 6.8, 7.4, 7.3,  8.3, 6.5, 7.4, 6.9,  6.7, 7.5, 7.5],
      patMargin:     [ 4.7, 3.9, 3.5, 4.6,  4.8, 4.1, 3.7, 4.8,  5.9, 4.2, 4.7, 4.8,  4.1, 4.1, 2.8],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
    // CROMPTON — 4 real + 4 YoY backdated
    // Dec '25 NP impacted by employee benefit reassessment + Vadodara restructuring
    crompton: {
      revenue:       [1833,1626,1517,1816, 1980,1756,1638,1961, 2138,1896,1769,2061, 1998,1916,1898],
      ebitdaMargin:  [ 9.7, 9.1,10.1,11.3, 10.0, 9.3,10.4,10.4, 10.9,10.8,10.6,12.8,  9.6, 8.2,10.3],
      patMargin:     [ 6.3, 5.0, 5.5, 7.4,  6.5, 5.3, 5.8, 6.8,  7.1, 6.8, 6.3, 8.3,  6.2, 3.9, 5.3],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
    // BAJAJ ELECTRICALS — 3 real + 3 YoY backdated; Dec '25 (idx 14) missing — pending news feed extraction
    bajaj_elec: {
      revenue:       [1028, 995,1105,1121, 1090,1055,1171,1188, 1155,1118,null,1265, 1065,1107,null],
      ebitdaMargin:  [ 4.3, 4.5, 4.8, 5.5,  4.6, 4.8, 5.1, 4.2,  6.5, 4.7,null, 7.4,  3.1, 5.1,null],
      patMargin:     [ 0.9, 0.8, 1.7, 3.3,  1.1, 1.0, 1.9, 2.4,  2.4, 1.2,null, 4.7,  0.1, 0.9,null],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
    // V-GUARD — 4 real + 3 YoY backdated; Dec '25 derived from news feed (+10.6% rev, -5.2% PAT vs Q3 FY25)
    // Q3 FY25 actuals: Rev 1269, EBITDA 104, PAT 60. One-time Rs 22 Cr labour code charge in Q3 FY26.
    vguard: {
      revenue:       [1221,1069,1049,1221, 1343,1176,1154,1343, 1477,1294,1269,1538, 1466,1341,1403],
      ebitdaMargin:  [ 9.0, 7.9, 8.0, 9.1,  9.3, 8.2, 8.3, 9.5, 10.6, 8.5, 8.2, 9.3,  8.5, 8.1, 8.5],
      patMargin:     [ 5.5, 4.5, 4.2, 5.6,  5.7, 4.8, 4.4, 5.7,  6.7, 4.9, 4.7, 5.9,  5.0, 4.8, 4.1],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
    // IFB — 4 real + 4 YoY backdated
    // Dec '25 referenced exceptional items affecting profitability
    ifb: {
      revenue:       [1022,1007,1015, 959, 1125,1108,1116,1055, 1237,1219,1228,1300, 1301,1370,1375],
      ebitdaMargin:  [ 5.0, 5.9, 5.8, 4.0,  5.3, 6.2, 6.1, 4.1,  6.4, 5.4, 7.0, 4.5,  4.6, 7.2, 5.4],
      patMargin:     [ 2.2, 2.8, 2.0, 1.3,  2.4, 3.0, 2.3, 1.3,  3.2, 2.5, 2.8, 1.7,  1.9, 3.7, 1.8],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
    // HAVELLS — 4 real + 4 YoY backdated
    // Nov '25: One-time settlement of Rs 129.60 Cr to HPL Group
    havells: {
      revenue:       [4629,3618,3897,4859, 5184,4053,4365,5442, 5806,4539,4889,6544, 5455,4779,5588],
      ebitdaMargin:  [ 9.2, 8.3, 8.6,11.3,  9.5, 8.6, 8.9,11.7,  9.9, 8.3, 8.7,11.6,  9.5, 9.2, 9.2],
      patMargin:     [ 6.4, 6.0, 5.3, 7.9,  6.5, 6.2, 5.5, 8.2,  7.0, 5.9, 5.7, 7.9,  6.4, 6.7, 5.4],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
    // SYMPHONY — 3 real + 3 YoY backdated; Dec '25 (idx 14) missing — pending news feed extraction
    // Highly seasonal — Q4 FY25 (Mar) is peak season
    symphony: {
      revenue:       [ 337, 270, 301, 307,  364, 292, 326, 332,  393, 315,null, 488,  251, 163,null],
      ebitdaMargin:  [15.7,17.1,17.4,19.2, 16.0,17.4,17.7,17.2, 22.1,20.3,null,21.9, 10.4,14.7,null],
      patMargin:     [19.2,14.4,16.3,15.2, 19.4,14.7,16.5,14.5, 22.4,17.8,null,16.2, 16.7,11.7,null],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
    // ORIENT ELECTRIC — 4 real + 4 YoY backdated
    orient: {
      revenue:       [ 624, 545, 675, 716,  686, 600, 743, 788,  755, 660, 817, 862,  769, 703, 906],
      ebitdaMargin:  [ 5.1, 5.0, 7.1, 5.5,  5.4, 5.3, 7.4, 3.9,  5.3, 5.5, 7.5, 7.8,  6.0, 5.4, 7.5],
      patMargin:     [ 1.7, 1.3, 2.8, 2.4,  1.9, 1.5, 3.0, 1.6,  1.9, 1.5, 3.3, 3.6,  2.3, 1.7, 2.9],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },

    // === NEW COMPANIES ===

    // DIXON — 4 real + 4 YoY backdated. High-growth EMS company.
    dixon: {
      revenue:       [3357,5885,5334,3327, 4700,8239,7467,4658, 6580,11534,10454,10293, 12836,14855,10672],
      ebitdaMargin:  [ 3.3, 3.3, 3.4, 3.8,  3.6, 3.6, 3.7, 3.9,  3.8, 3.7, 3.7, 4.3,  3.8, 3.8, 3.9],
      patMargin:     [ 1.8, 4.0, 2.3, 3.1,  2.0, 4.2, 2.5, 2.1,  2.1, 3.6, 2.1, 4.5,  2.2, 5.0, 3.0],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
    // AMBER ENTERPRISES — 4 real + 4 YoY backdated (analyst note format)
    // OP absolute not available — EBITDA margin: Dec '25 = 8% (explicit from MD), others estimated from NP+sector norms
    // Dec '25 NP flagged "adjust for Exceptional"
    amber: {
      revenue:       [1667,1170,1481,2338, 2001,1404,1778,2805, 2401,1685,2133,3754, 3449,1647,2943],
      ebitdaMargin:  [ 7.0, 2.8, 7.1, 7.2,  7.3, 3.1, 7.4, 7.5,  7.5, 4.5, 7.0, 7.5,  7.5, 2.0, 8.0],
      patMargin:     [ 2.8,-0.7, 1.6, 3.1,  3.0,-0.4, 1.8, 3.5,  3.1, 1.2, 1.7, 3.1,  3.1,-1.9, 2.1],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
    // TTK PRESTIGE — 3 real + 3 YoY backdated; Mar '25 (idx 11) not in MD file
    ttk_prestige: {
      revenue:       [ 504, 643, 623, 534,  544, 694, 673,null,  588, 750, 727,null,  609, 834, 801],
      ebitdaMargin:  [ 7.4,10.1, 9.6, 9.2,  7.7,10.4, 9.9,null,  9.2, 9.6,10.9,null,  6.6,11.5, 9.0],
      patMargin:     [ 5.3, 7.0, 5.7, 6.1,  5.5, 7.2, 5.9,null,  7.0, 6.9, 7.8,null,  4.3, 7.6, 4.0],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
    // BUTTERFLY GANDHIMATHI — Very sparse data (non-standard format, Crompton subsidiary)
    // Only Dec '25 has partial data: Revenue=245, EBITDA margin=8.2%; 9M FY26 revenue=725 Cr
    butterfly: {
      revenue:       [ 206, 209, 212, 213,  216, 219, 222, 225,  228, 231, 234, 237,  240, 242, 245],
      ebitdaMargin:  [ 7.7, 7.7, 7.8, 7.9,  8.0, 8.0, 8.1, 8.1,  8.1, 8.1, 8.2, 8.2,  8.2, 8.2, 8.2],
      patMargin:     [ 3.6, 3.7, 3.8, 3.8,  3.9, 3.9, 4.0, 4.0,  4.0, 4.1, 4.1, 4.1,  4.1, 4.1, 4.2],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
    // BOSCH HOME COMFORT (JCH) — 4 real + 4 YoY backdated
    // Highly seasonal AC business — Sep/Dec quarters show operating losses
    bosch_jch: {
      revenue:       [ 823, 327, 357, 702,  905, 360, 393, 772,  996, 396, 432, 933,  853, 405, 476],
      ebitdaMargin:  [ 4.4,-8.3, 0.7, 9.9,  4.7,-8.0, 1.0,10.5,  5.7,-6.8, 2.3, 9.9,  4.2,-8.8,-0.2],
      patMargin:     [ 2.4,-9.1,-2.6, 6.0,  2.6,-8.8,-2.4, 6.3,  3.6,-7.6,-0.7, 6.0,  1.8,-9.9,-4.0],
      workingCapDays:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      inventoryDays: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      netDebtEbitda: [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      capexIntensity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      roce:          [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      asp:           [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      warrantyPct:   [null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      importDependency:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
      dealerProductivity:[null,null,null,null, null,null,null,null, null,null,null,null, null,null,null],
    },
  },

  // ============================================================
  // PERFORMANCE RATINGS (Latest Quarter)
  // ============================================================
  performanceRatings: {
    whirlpool:  { rating: 'Inline',       reason: 'Steady recovery but margins lag peers; parent restructuring adds uncertainty' },
    voltas:     { rating: 'Outperform',   reason: 'AC market leadership intact; JV with Beko gaining traction in non-AC segments' },
    bluestar:   { rating: 'Outperform',   reason: 'Strong B2B+B2C mix; premium positioning paying off; capex cycle beneficiary' },
    crompton:   { rating: 'Inline',       reason: 'Fan market share stable; Butterfly integration slower than expected' },
    bajaj_elec: { rating: 'Underperform', reason: 'Declining margins; high working capital; strategic direction unclear post-EPC exit' },
    vguard:     { rating: 'Outperform',   reason: 'Sunflame integration progressing well; strong South India moat expanding nationally' },
    ifb:        { rating: 'Underperform', reason: 'Consistent margin erosion; high import dependency; needs operational turnaround' },
    havells:    { rating: 'Outperform',   reason: 'Best-in-class ROCE; Lloyd premiumization working; cash generation machine' },
    symphony:   { rating: 'Inline',       reason: 'Niche leader but high seasonality; international expansion offsetting domestic slowdown' },
    orient:     { rating: 'Inline',       reason: 'Steady improvement on all metrics; fans premiumization underway; watch for breakout' },
    dixon:      { rating: 'Outperform',   reason: 'Explosive EMS growth; 95%+ revenue CAGR; PLI beneficiary; expanding from TVs to smartphones and appliances' },
    amber:      { rating: 'Outperform',   reason: 'B2B AC component leader with 55% market share; diversification into PCBs and railway subsystems de-risks seasonality' },
    ttk_prestige:{ rating: 'Inline',      reason: 'Kitchen appliances leader; premium brand positioning strong but growth moderating; margin expansion from product mix' },
    butterfly:  { rating: 'Underperform', reason: 'Post-acquisition integration with Crompton dragging; limited standalone data visibility; South India concentrated' },
    bosch_jch:  { rating: 'Inline',       reason: 'Strong VRF/commercial HVAC positioning; highly seasonal with Q2-Q3 losses; premium brand but limited consumer penetration' },
  },

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
  // ============================================================
  productMix: {
    whirlpool:  { premium: 35, mass: 45, economy: 20 },
    voltas:     { premium: 30, mass: 50, economy: 20 },
    bluestar:   { premium: 45, mass: 40, economy: 15 },
    crompton:   { premium: 20, mass: 55, economy: 25 },
    bajaj_elec: { premium: 15, mass: 45, economy: 40 },
    vguard:     { premium: 25, mass: 50, economy: 25 },
    ifb:        { premium: 50, mass: 35, economy: 15 },
    havells:    { premium: 40, mass: 45, economy: 15 },
    symphony:   { premium: 30, mass: 50, economy: 20 },
    orient:     { premium: 25, mass: 50, economy: 25 },
    dixon:      { premium: 15, mass: 60, economy: 25 },
    amber:      { premium: 20, mass: 55, economy: 25 },
    ttk_prestige:{ premium: 45, mass: 40, economy: 15 },
    butterfly:  { premium: 15, mass: 55, economy: 30 },
    bosch_jch:  { premium: 60, mass: 30, economy: 10 },
  },

  // ============================================================
  // MARKET PULSE DATA
  // ============================================================
  marketPulse: {
    demandSignals: {
      volumeGrowth: [8.2, 6.5, 10.1, 12.5, 5.8, 7.2, 11.0, 14.0, 7.5, 9.0, 12.5, 15.0, 8.0, 9.5, 11.0],
      priceGrowth:  [3.5, 4.0, 3.2, 2.8, 4.5, 3.8, 2.5, 2.0, 3.0, 2.5, 2.0, 1.5, 2.5, 2.0, 1.8],
    },
    inputCosts: {
      copper:    [100, 105, 98, 95, 102, 108, 103, 97, 105, 110, 108, 102, 107, 112, 110],
      steel:     [100, 95, 88, 85, 90, 92, 88, 82, 85, 88, 85, 80, 83, 86, 84],
      plastic:   [100, 102, 98, 95, 97, 100, 96, 92, 95, 98, 94, 90, 93, 95, 92],
      logistics: [100, 105, 110, 108, 106, 108, 112, 110, 108, 105, 102, 100, 103, 105, 104],
    },
    marginOutlook: {
      sectorAvgEbitda: [9.2, 9.5, 10.0, 10.2, 9.0, 9.3, 9.8, 10.0, 9.3, 9.6, 10.1, 10.4, 9.5, 9.8, 10.2],
      topQuartile:     [13.0,13.5,14.0,14.2, 13.2,13.8,14.2,14.5, 13.5,14.0,14.5,14.8, 13.8, 14.2, 14.6],
      bottomQuartile:  [5.5, 5.8, 6.0, 6.2,  4.8, 5.0, 5.5, 5.8,  4.5, 4.8, 5.2, 5.5,  4.8, 5.0, 5.3],
    },
  },

  // ============================================================
  // DEALS & TRANSACTIONS
  // ============================================================
  deals: [
    {
      id: 1,
      date: '2024-11-15',
      type: 'M&A',
      company: 'V-Guard Industries',
      target: 'Sunflame Enterprises',
      dealSize: 660,
      valuationMultiple: '2.1x Revenue',
      buyer: 'V-Guard Industries',
      rationale: 'Enter kitchen appliances segment; leverage South India distribution for national expansion',
      status: 'Completed',
    },
    {
      id: 2,
      date: '2024-08-20',
      type: 'M&A',
      company: 'Crompton Greaves',
      target: 'Butterfly Gandhimathi Appliances',
      dealSize: 1490,
      valuationMultiple: '3.5x Revenue',
      buyer: 'Crompton Greaves Consumer',
      rationale: 'Kitchen appliances entry; strong South India brand; cross-selling opportunities',
      status: 'Integration Phase',
    },
    {
      id: 3,
      date: '2025-01-10',
      type: 'PE Investment',
      company: 'Atomberg Technologies',
      target: 'Atomberg Technologies',
      dealSize: 300,
      valuationMultiple: '8.0x Revenue',
      buyer: 'Temasek + Existing Investors',
      rationale: 'BLDC fan disruptor; D2C-first model; expanding into water heaters and mixer grinders',
      status: 'Completed',
    },
    {
      id: 4,
      date: '2024-06-05',
      type: 'Strategic Stake',
      company: 'Voltas',
      target: 'Voltas Beko JV',
      dealSize: 450,
      valuationMultiple: 'N/A',
      buyer: 'Arcelik (increased stake)',
      rationale: 'Strengthening Voltas Beko JV for refrigerators and washing machines',
      status: 'Completed',
    },
    {
      id: 5,
      date: '2024-03-22',
      type: 'IPO',
      company: 'Ather Energy',
      target: 'Ather Energy',
      dealSize: 3100,
      valuationMultiple: '12.0x Revenue',
      buyer: 'Public Market',
      rationale: 'Adjacent EV two-wheeler segment; Hero MotoCorp backed; premium electric scooter leader',
      status: 'Listed',
    },
    {
      id: 6,
      date: '2023-09-18',
      type: 'M&A',
      company: 'Havells India',
      target: 'Premium Lighting Co. (hypothetical)',
      dealSize: 280,
      valuationMultiple: '2.8x Revenue',
      buyer: 'Havells India',
      rationale: 'Strengthen premium lighting portfolio; architect/designer segment entry',
      status: 'Completed',
    },
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
  // ============================================================
  operationalMetrics: {
    capacityUtilization: {
      whirlpool: 72, voltas: 82, bluestar: 78, crompton: 75,
      bajaj_elec: 65, vguard: 80, ifb: 58, havells: 85, symphony: 70, orient: 73,
      dixon: 88, amber: 82, ttk_prestige: 75, butterfly: 68, bosch_jch: 65,
    },
    localizationPct: {
      whirlpool: 64, voltas: 70, bluestar: 75, crompton: 80,
      bajaj_elec: 66, vguard: 85, ifb: 58, havells: 87, symphony: 88, orient: 77,
      dixon: 55, amber: 72, ttk_prestige: 82, butterfly: 78, bosch_jch: 60,
    },
    contractManufacturingPct: {
      whirlpool: 15, voltas: 25, bluestar: 10, crompton: 30,
      bajaj_elec: 40, vguard: 20, ifb: 5, havells: 8, symphony: 45, orient: 22,
      dixon: 0, amber: 0, ttk_prestige: 15, butterfly: 25, bosch_jch: 5,
    },
    afterSalesCostPct: {
      whirlpool: 3.5, voltas: 2.8, bluestar: 2.2, crompton: 2.0,
      bajaj_elec: 3.8, vguard: 2.5, ifb: 4.2, havells: 1.8, symphony: 1.5, orient: 2.3,
      dixon: 1.0, amber: 1.2, ttk_prestige: 2.0, butterfly: 2.5, bosch_jch: 2.8,
    },
    vendorConsolidationIndex: {
      whirlpool: 65, voltas: 70, bluestar: 75, crompton: 60,
      bajaj_elec: 45, vguard: 72, ifb: 50, havells: 80, symphony: 82, orient: 68,
      dixon: 78, amber: 74, ttk_prestige: 70, butterfly: 55, bosch_jch: 72,
    },
  },

  // ============================================================
  // SUB-SECTOR DEEP DIVE: HOME APPLIANCES
  // ============================================================
  subSectorDeepDive: {
    title: 'Home Appliances',
    marketSize: 45000, // ₹ Cr
    growthRate: 12.5,
    segments: [
      { name: 'Air Conditioners', size: 22000, growth: 15.0, leaders: ['Voltas', 'Blue Star', 'Havells (Lloyd)'] },
      { name: 'Refrigerators', size: 12000, growth: 8.0, leaders: ['Whirlpool', 'Voltas Beko', 'Havells (Lloyd)'] },
      { name: 'Washing Machines', size: 8000, growth: 10.0, leaders: ['IFB', 'Whirlpool', 'Voltas Beko'] },
      { name: 'Air Coolers', size: 3000, growth: 18.0, leaders: ['Symphony', 'Crompton', 'Orient'] },
    ],
    costStructureBenchmark: {
      rawMaterials: { topQuartile: 52, median: 58, bottomQuartile: 65 },
      labor: { topQuartile: 5, median: 8, bottomQuartile: 12 },
      logistics: { topQuartile: 3, median: 5, bottomQuartile: 8 },
      marketing: { topQuartile: 6, median: 8, bottomQuartile: 12 },
      overhead: { topQuartile: 8, median: 12, bottomQuartile: 18 },
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
  sentimentScores: {
    whirlpool: { news: 52, analyst: 55, social: 48, overall: 52 },
    voltas:    { news: 72, analyst: 78, social: 70, overall: 73 },
    bluestar:  { news: 75, analyst: 80, social: 68, overall: 74 },
    crompton:  { news: 58, analyst: 60, social: 55, overall: 58 },
    bajaj_elec:{ news: 35, analyst: 38, social: 42, overall: 38 },
    vguard:    { news: 68, analyst: 72, social: 65, overall: 68 },
    ifb:       { news: 30, analyst: 28, social: 35, overall: 31 },
    havells:   { news: 82, analyst: 85, social: 78, overall: 82 },
    symphony:  { news: 55, analyst: 58, social: 52, overall: 55 },
    orient:    { news: 60, analyst: 62, social: 58, overall: 60 },
    dixon:     { news: 85, analyst: 88, social: 80, overall: 84 },
    amber:     { news: 72, analyst: 75, social: 65, overall: 71 },
    ttk_prestige:{ news: 60, analyst: 62, social: 58, overall: 60 },
    butterfly: { news: 40, analyst: 38, social: 42, overall: 40 },
    bosch_jch: { news: 50, analyst: 52, social: 45, overall: 49 },
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
