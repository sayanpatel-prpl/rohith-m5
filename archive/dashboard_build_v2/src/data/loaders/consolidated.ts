/**
 * Data loader for consolidated-dashboard-data.json
 *
 * Imports the consolidated JSON at build time via @data alias.
 * Exports typed accessor functions with graceful degradation (DATA-04).
 */

import rawData from "@data/consolidated-dashboard-data.json";

// ---------------------------------------------------------------------------
// Interfaces matching the JSON shape
// ---------------------------------------------------------------------------

export interface ConsolidatedOverview {
  marketCapCr: number;
  currentPrice: number;
  peRatio: number;
  bookValue: number;
  dividendYield: number;
  roce: number;
  roe: number;
  faceValue: number;
}

export interface QuarterlyResult {
  period: string;
  quarterFY: string;
  salesCr: number;
  expensesCr: number;
  operatingProfitCr: number;
  opmPct: number;
  otherIncomeCr: number;
  interestCr: number;
  depreciationCr: number;
  ebitdaCr: number;
  ebitdaMarginPct: number;
  pbtCr: number;
  taxPct: number;
  netProfitCr: number;
  epsDiluted: number;
  salesGrowthYoY: number | null;
  profitGrowthYoY: number | null;
}

export interface AnnualPnL {
  period: string;
  salesCr: number;
  expensesCr: number;
  operatingProfitCr: number;
  opmPct: number;
  otherIncomeCr: number;
  interestCr: number;
  depreciationCr: number;
  ebitdaCr: number;
  ebitdaMarginPct: number;
  pbtCr: number;
  taxPct: number;
  netProfitCr: number;
  epsDiluted: number;
  dividendPayoutPct: number | null;
}

export interface BalanceSheetEntry {
  period: string;
  "Equity Capital": number;
  Reserves: number;
  Borrowings: number;
  "Other Liabilities": number;
  "Total Liabilities": number;
  "Fixed Assets": number;
  CWIP: number;
  Investments: number;
  "Other Assets": number;
  "Total Assets": number;
}

export interface CashFlowEntry {
  period: string;
  "Cash from Operating Activity": number;
  "Cash from Investing Activity": number;
  "Cash from Financing Activity": number;
  "Net Cash Flow": number;
}

export interface RatiosEntry {
  period: string;
  "Debtor Days": number;
  "Inventory Days": number;
  "Days Payable": number;
  "Cash Conversion Cycle": number;
  "Working Capital Days": number;
  ROCE: number;
}

export interface ShareholdingEntry {
  period: string;
  Promoters: number;
  FIIs: number;
  DIIs: number;
  Government: number;
  Public: number;
  "No. of Shareholders": number;
}

export interface DashboardMetrics {
  revenueGrowthYoY: number;
  ebitdaMargin: number;
  workingCapitalDays: number;
  roce: number;
  debtEquity: number;
  performance: string;
}

export interface DashboardHistoryEntry {
  period: string;
  revenue: number;
  revenueGrowth: number;
  ebitdaMargin: number;
  netProfit: number;
  profitGrowth: number;
  workingCapitalDays: number;
  roce: number;
  debtEquity: number;
}

export interface TrendlyneKeyRatios {
  asOfDate: string;
  pe: number | null;
  pb: number | null;
  evToEbitda: number | null;
  evToEbitda_3yrAvg: number | null;
  roe_pct: number | null;
  roic_pct: number | null;
  roce_pct: number | null;
  debtToEquity: number | null;
  currentRatio: number | null;
  dividendYield_pct: number | null;
}

export interface TrendlyneInsights {
  keyRatios: TrendlyneKeyRatios;
  earningsSummary?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ConsolidatedCompany {
  id: string;
  name: string;
  ticker: string;
  bseSymbol: string;
  overview: ConsolidatedOverview;
  quarterlyResults: QuarterlyResult[];
  annualPnL: AnnualPnL[];
  balanceSheet: BalanceSheetEntry[];
  cashFlow: CashFlowEntry[];
  ratios: RatiosEntry[];
  shareholding: ShareholdingEntry[];
  dashboardMetrics: DashboardMetrics;
  dashboardHistory: DashboardHistoryEntry[];
  trendlyneInsights: TrendlyneInsights;
}

export interface ConsolidatedData {
  generatedAt: string;
  sources: string[];
  companiesCount: number;
  companies: ConsolidatedCompany[];
}

// ---------------------------------------------------------------------------
// Type-cast the imported JSON
// ---------------------------------------------------------------------------

const data = rawData as unknown as ConsolidatedData;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Get the full consolidated data set */
export function getConsolidatedData(): ConsolidatedData {
  return {
    ...data,
    companies: data.companies ?? [],
  };
}

/** Get a single company by canonical ID */
export function getConsolidatedCompany(
  id: string,
): ConsolidatedCompany | undefined {
  return (data.companies ?? []).find(
    (c) => c.id.toLowerCase() === id.toLowerCase(),
  );
}
