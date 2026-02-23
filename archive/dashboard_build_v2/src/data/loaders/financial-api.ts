/**
 * Data loader for financial-api-data.json
 *
 * Imports the pre-built financial API data at build time via @data alias.
 * This is the closest to v1's section data shape -- each company has
 * metrics, performance tier, overview, and quarterly history.
 * Exports typed accessor functions with graceful degradation (DATA-04).
 */

import rawData from "@data/financial-api-data.json";

// ---------------------------------------------------------------------------
// Interfaces matching the JSON shape
// ---------------------------------------------------------------------------

export interface FinancialMetrics {
  revenueGrowth: number;
  ebitdaMargin: number;
  workingCapitalDays: number;
  roce: number;
  debtEquity: number;
}

export interface FinancialOverview {
  marketCapCr: number;
  currentPrice: number;
  peRatio: number;
  bookValue: number;
  dividendYield: number;
  roce: number;
  roe: number;
  faceValue: number;
}

export interface FinancialHistoryEntry {
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

export interface FinancialApiCompany {
  id: string;
  name: string;
  ticker: string;
  metrics: FinancialMetrics;
  performance: string;
  varianceAnalysis: string;
  source: string;
  overview: FinancialOverview;
  history: FinancialHistoryEntry[];
}

export interface FinancialApiData {
  section: string;
  dataAsOf: string;
  lastUpdated: string;
  companies: FinancialApiCompany[];
}

// ---------------------------------------------------------------------------
// Type-cast the imported JSON
// ---------------------------------------------------------------------------

const data = rawData as unknown as FinancialApiData;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Get the full financial API data set */
export function getFinancialApiData(): FinancialApiData {
  return {
    ...data,
    companies: data.companies ?? [],
  };
}

/** Get a single company by canonical ID */
export function getFinancialApiCompany(
  id: string,
): FinancialApiCompany | undefined {
  return (data.companies ?? []).find(
    (c) => c.id.toLowerCase() === id.toLowerCase(),
  );
}
