/**
 * Operations section type definitions.
 *
 * Extends SectionData with per-company operational metrics, confidence
 * indicators, and A&M diagnostic triggers for identifying companies
 * needing operational improvement advisory.
 * Used by the Operations section (OPER-01, OPER-02).
 */

import type { SectionData } from "./sections";
import type { SourceInfo, SourceConfidence } from "./source";
import type { AMServiceLine } from "./am-theme";

// ---------------------------------------------------------------------------
// Confidence Icon (OPER-01)
// ---------------------------------------------------------------------------

/**
 * Per-metric confidence indicator mapped to UI icons:
 * - "verified": checkmark (data from Screener/filings)
 * - "derived": tilde (computed from multiple sources)
 * - "estimated": question mark (inferred/fallback)
 */
export type ConfidenceIcon = SourceConfidence;

// ---------------------------------------------------------------------------
// Operations Metric Row (OPER-01)
// ---------------------------------------------------------------------------

/** Per-company operational metrics with per-field confidence levels */
export interface OpsMetricRow {
  /** Canonical company ID */
  companyId: string;
  /** Company display name */
  company: string;
  /** Sub-sector classification */
  subSector: string;

  /** Revenue growth YoY percentage */
  revenueGrowthPct: number;
  revenueGrowthPctConfidence: ConfidenceIcon;

  /** EBITDA margin percentage */
  ebitdaMarginPct: number;
  ebitdaMarginPctConfidence: ConfidenceIcon;

  /** Operating profit margin percentage */
  opmPct: number;
  opmPctConfidence: ConfidenceIcon;

  /** Return on capital employed percentage */
  rocePct: number;
  rocePctConfidence: ConfidenceIcon;

  /** Working capital days */
  workingCapitalDays: number;
  workingCapitalDaysConfidence: ConfidenceIcon;

  /** Debt to equity ratio */
  debtEquity: number;
  debtEquityConfidence: ConfidenceIcon;

  /** Inventory days (from ratios) */
  inventoryDays: number;
  inventoryDaysConfidence: ConfidenceIcon;

  /** Debtor days (from ratios) */
  debtorDays: number;
  debtorDaysConfidence: ConfidenceIcon;

  /** Cash conversion cycle days */
  cashConversionCycle: number;
  cashConversionCycleConfidence: ConfidenceIcon;

  /** Source attribution for the row */
  source: SourceInfo;
}

// ---------------------------------------------------------------------------
// Diagnostic Triggers (OPER-02)
// ---------------------------------------------------------------------------

/** A&M Operations Diagnostic Trigger -- flags companies needing attention */
export interface DiagnosticTrigger {
  /** Canonical company ID */
  companyId: string;
  /** Company display name */
  company: string;
  /** Human-readable trigger description */
  trigger: string;
  /** Metric that triggered the diagnostic */
  metric: string;
  /** Actual metric value */
  value: number;
  /** Threshold that was breached */
  threshold: number;
  /** Recommended A&M service line */
  amServiceLine: AMServiceLine;
  /** Source attribution */
  source: SourceInfo;
}

// ---------------------------------------------------------------------------
// Summary Stats
// ---------------------------------------------------------------------------

/** Summary statistics for the operations section header */
export interface OperationsSummaryStats {
  /** Total companies tracked */
  companiesTracked: number;
  /** Sector average EBITDA margin */
  avgEbitdaMargin: number;
  /** Sector average ROCE */
  avgROCE: number;
  /** Number of diagnostic triggers fired */
  diagnosticTriggerCount: number;
}

// ---------------------------------------------------------------------------
// Operations Section Data
// ---------------------------------------------------------------------------

/** Complete data payload for the Operations section */
export interface OperationsData extends SectionData {
  /** Summary stats for header display */
  summaryStats: OperationsSummaryStats;
  /** Per-company operational metrics with confidence levels (OPER-01) */
  metrics: OpsMetricRow[];
  /** A&M diagnostic triggers for flagged companies (OPER-02) */
  diagnosticTriggers: DiagnosticTrigger[];
  /** Company IDs cross-linked to competitive section */
  crossLinkCompetitiveIds: string[];
}
