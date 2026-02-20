/**
 * Data loader for screener-all-companies.json
 *
 * Imports the Screener.in scraped data at build time via @data alias.
 * Data is keyed by company ID with tabular quarterly/annual/ratio data.
 * Exports typed accessor functions with graceful degradation (DATA-04).
 */

import rawData from "@data/screener-all-companies.json";
import { normalizeCompanyId } from "../../lib/company-matching";

// ---------------------------------------------------------------------------
// Interfaces matching the JSON shape
// ---------------------------------------------------------------------------

export interface ScreenerCompanyInfo {
  ticker: string;
  id: string;
  name: string;
  report_type: string;
  source_url: string;
  scraped_at: string;
}

export interface ScreenerKeyMetrics {
  "Market Cap": string;
  "Current Price": string;
  "High / Low": string;
  "Stock P/E": string;
  "Book Value": string;
  "Dividend Yield": string;
  ROCE: string;
  ROE: string;
  "Face Value": string;
  company_name: string;
  [key: string]: string;
}

export interface ScreenerTableData {
  headers: string[];
  data: Record<string, string>[];
}

export interface ScreenerCompany {
  company: ScreenerCompanyInfo;
  key_metrics: ScreenerKeyMetrics;
  quarterly_results: ScreenerTableData;
  profit_and_loss: ScreenerTableData;
  balance_sheet: ScreenerTableData;
  cash_flow: ScreenerTableData;
  ratios: ScreenerTableData;
  shareholding: ScreenerTableData;
}

export interface ScreenerData {
  scraped_at: string;
  total_companies: number;
  companies: Record<string, ScreenerCompany>;
}

// ---------------------------------------------------------------------------
// Type-cast the imported JSON
// ---------------------------------------------------------------------------

const data = rawData as unknown as ScreenerData;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Get the full screener data set */
export function getScreenerData(): ScreenerData {
  return {
    ...data,
    companies: data.companies ?? {},
  };
}

/** Get a single company by canonical ID or variant name */
export function getScreenerCompany(
  id: string,
): ScreenerCompany | undefined {
  const companies = data.companies ?? {};

  // Direct key lookup
  if (companies[id]) return companies[id];

  // Normalize and try again
  const normalized = normalizeCompanyId(id);
  if (normalized && companies[normalized]) return companies[normalized];

  // Search by company.id field
  for (const company of Object.values(companies)) {
    if (company.company.id.toLowerCase() === id.toLowerCase()) {
      return company;
    }
  }

  return undefined;
}
