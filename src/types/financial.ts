import type { TrendDirection, TimeRange } from "./common";

/** Amount denominated in INR Crore */
export interface INRAmount {
  /** Value in Crore (e.g. 1500 = INR 1,500 Cr) */
  valueCr: number;
  /** Pre-formatted display string, if available */
  formatted?: string;
}

/** Percentage metric with direction and comparison period */
export interface PercentageMetric {
  /** Percentage value (e.g. 12.5 = 12.5%) */
  value: number;
  /** Directional trend */
  direction: TrendDirection;
  /** Comparison period */
  period: TimeRange;
}

/** Basis points metric with direction */
export interface BasisPointsMetric {
  /** Value in basis points (e.g. 180 = 180 bps) */
  bps: number;
  /** Directional trend */
  direction: TrendDirection;
}

/** Standard financial metrics tracked per company */
export interface FinancialMetrics {
  /** Revenue growth year-over-year as decimal (0.125 = 12.5%) */
  revenueGrowthYoY: number;
  /** EBITDA margin as decimal (0.18 = 18%) */
  ebitdaMargin: number;
  /** Working capital cycle in days (annual — not available per quarter) */
  workingCapitalDays: number | null;
  /** Return on capital employed as decimal (annual — not available per quarter) */
  roce: number | null;
  /** Debt-to-equity ratio (annual — not available per quarter) */
  debtEquity: number | null;
}

/** Historical quarterly data point for trend charts */
export interface QuarterlySnapshot {
  /** Quarter label, e.g. "Q2 FY24" */
  period: string;
  /** Revenue growth year-over-year as decimal (0.125 = 12.5%) */
  revenueGrowthYoY: number;
  /** EBITDA margin as decimal (0.18 = 18%) */
  ebitdaMargin: number;
  /** Working capital cycle in days (only available annually, not per quarter) */
  workingCapitalDays?: number;
  /** Return on capital employed as decimal (only available annually, not per quarter) */
  roce?: number;
  /** Debt-to-equity ratio (only available annually, not per quarter) */
  debtEquity?: number;
}
