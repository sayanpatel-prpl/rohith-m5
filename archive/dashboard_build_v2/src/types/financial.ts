/**
 * Financial Performance section type definitions.
 *
 * Extends SectionData with per-company financial rows including
 * A&M signal triage, sparkline data, and derived competitive columns.
 * Used by the Financial Performance section (FINP-01 through FINP-06).
 */

import type { SectionData } from "./sections";
import type { AMActionType } from "./am-theme";
import type { PerformanceLevel } from "./common";

// ---------------------------------------------------------------------------
// Sparkline Data (FINP-02)
// ---------------------------------------------------------------------------

/** Inline chart data arrays for revenue and EBITDA margin sparklines */
export interface SparklineData {
  /** Revenue values for last 4-6 quarters (in Cr) */
  revenue: number[];
  /** EBITDA margin values for last 4-6 quarters (in %) */
  ebitdaMargin: number[];
}

// ---------------------------------------------------------------------------
// Financial Metrics
// ---------------------------------------------------------------------------

/** Core financial metrics for a company row */
export interface FinancialRowMetrics {
  /** Revenue in INR Crore (latest quarter) */
  revenue: number | null;
  /** Revenue growth YoY percentage */
  revenueGrowth: number | null;
  /** EBITDA margin percentage */
  ebitdaMargin: number | null;
  /** Net profit in INR Crore */
  netProfit: number | null;
  /** Net profit growth YoY percentage */
  profitGrowth: number | null;
  /** Return on Capital Employed percentage */
  roce: number | null;
  /** Debt-to-equity ratio */
  debtEquity: number | null;
  /** Working capital days */
  workingCapitalDays: number | null;
  /** Price-to-earnings ratio */
  peRatio: number | null;
}

// ---------------------------------------------------------------------------
// Quarterly History
// ---------------------------------------------------------------------------

/** A single quarterly data point for history arrays */
export interface FinancialHistoryEntry {
  /** Quarter label (e.g., "Q3 FY2026") */
  period: string;
  /** Revenue in INR Crore */
  revenue: number;
  /** EBITDA margin percentage */
  ebitdaMargin: number;
  /** Net profit in INR Crore */
  netProfit: number;
}

// ---------------------------------------------------------------------------
// Company Row (FINP-01)
// ---------------------------------------------------------------------------

/** A single company row in the financial performance table */
export interface FinancialCompanyRow {
  /** Canonical company ID */
  id: string;
  /** Display name */
  name: string;
  /** BSE/NSE ticker symbol */
  ticker: string;
  /** Sub-sector classification */
  subSector: string;
  /** A&M action type triage signal */
  amSignal: AMActionType;
  /** Human-readable explanation for A&M signal (tooltip text) */
  amSignalReason: string;
  /** Core financial metrics */
  metrics: FinancialRowMetrics;
  /** Inline sparkline data for revenue and EBITDA margin */
  sparklineData: SparklineData;
  /** Performance tier relative to peers */
  performance: PerformanceLevel;
  /** Quarterly history entries for drill-down */
  history: FinancialHistoryEntry[];
  /** Primary data source identifier */
  source: string;
}

// ---------------------------------------------------------------------------
// Derived Columns (FINP-05)
// ---------------------------------------------------------------------------

/** Computed competitive metric column definition */
export interface DerivedColumn {
  /** Unique column identifier */
  id: "mktShare" | "pricingPower" | "competitiveIntensity";
  /** Human-readable column label */
  label: string;
  /** Methodology description for tooltip */
  methodology: string;
}

// ---------------------------------------------------------------------------
// Financial Section Data
// ---------------------------------------------------------------------------

/** Complete data payload for the Financial Performance section */
export interface FinancialData extends SectionData {
  /** Per-company financial rows with A&M signals and sparklines */
  companies: FinancialCompanyRow[];
  /** Derived competitive analysis columns (FINP-05) */
  derivedColumns: DerivedColumn[];
}
