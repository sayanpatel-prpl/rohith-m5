/**
 * Data loader for sovrenn-intelligence.json
 *
 * Imports the Sovrenn intelligence data at build time via @data alias.
 * Data is an array of company intelligence records.
 * Exports typed accessor functions with graceful degradation (DATA-04).
 */

import rawData from "@data/sovrenn-intelligence.json";

// ---------------------------------------------------------------------------
// Interfaces matching the JSON shape
// ---------------------------------------------------------------------------

export interface SovrennQuarterlyResult {
  date: string;
  quarter: string;
  salesCr: number;
  salesGrowthYoY: number;
  salesGrowthQoQ: number;
  netProfitCr: number;
  profitGrowthYoY: number;
  profitGrowthQoQ: number;
  tag: string;
  rawText: string;
}

export interface SovrennDealActivity {
  date: string;
  type: string;
  description: string;
  valueCr: number | null;
}

export interface SovrennConcallHighlight {
  date: string;
  quarter: string;
  keyPoints: string[];
  [key: string]: unknown;
}

export interface SovrennShareholding {
  date: string;
  [key: string]: unknown;
}

export interface SovrennCompany {
  companyId: string;
  companyName: string;
  description: string;
  clients: string[];
  keyGrowthTriggers: string[];
  quarterlyResults: SovrennQuarterlyResult[];
  dealActivity: SovrennDealActivity[];
  concallHighlights?: SovrennConcallHighlight[];
  shareholding?: SovrennShareholding[];
}

// ---------------------------------------------------------------------------
// Type-cast the imported JSON
// ---------------------------------------------------------------------------

const data = (rawData ?? []) as unknown as SovrennCompany[];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Get the full Sovrenn intelligence data set */
export function getSovrennData(): SovrennCompany[] {
  return data;
}

/** Get a single company by canonical ID */
export function getSovrennCompany(
  id: string,
): SovrennCompany | undefined {
  return data.find(
    (c) => c.companyId.toLowerCase() === id.toLowerCase(),
  );
}
