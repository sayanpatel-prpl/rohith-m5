/**
 * Data loader for trendlyne-summary.json
 *
 * Imports the Trendlyne aggregated summary at build time via @data alias.
 * Data has extraction summary metadata and company-level financial summaries.
 * Exports typed accessor functions with graceful degradation (DATA-04).
 */

import rawData from "@data/trendlyne-summary.json";

// ---------------------------------------------------------------------------
// Interfaces matching the JSON shape
// ---------------------------------------------------------------------------

export interface TrendlyneExtractionSummary {
  extractedDate: string;
  method: string;
  note: string;
  totalCompanies: number;
  dataQuality: string;
  recommendedDirectSources: string[];
}

export interface TrendlyneCompany {
  companyId: string;
  companyName: string;
  nseSymbol: string;
  sector: string;
  dataFile: string;
  latestQuarter: string;
  latestRevenue_cr: number | null;
  latestNetProfit_cr: number | null;
  latestEBITDA_cr?: number | null;
  latestEBITDA_consolidated_cr?: number | null;
  fy2025Revenue_cr?: number | null;
  pe: number | null;
  pb: number | null;
  roe_pct?: number | null;
  roce_pct?: number | null;
  debtToEquity: number | null;
  quartersCovered: string[];
  dataCompleteness: string;
  [key: string]: unknown;
}

export interface TrendlyneComparativeAnalysis {
  [key: string]: unknown;
}

export interface TrendlyneData {
  extractionSummary: TrendlyneExtractionSummary;
  companies: TrendlyneCompany[];
  comparativeAnalysis?: TrendlyneComparativeAnalysis;
}

// ---------------------------------------------------------------------------
// Type-cast the imported JSON
// ---------------------------------------------------------------------------

const data = rawData as unknown as TrendlyneData;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Get the full Trendlyne data set */
export function getTrendlyneData(): TrendlyneData {
  return {
    ...data,
    companies: data.companies ?? [],
  };
}

/** Get a single company by canonical ID */
export function getTrendlyneCompany(
  id: string,
): TrendlyneCompany | undefined {
  return (data.companies ?? []).find(
    (c) => c.companyId.toLowerCase() === id.toLowerCase(),
  );
}
