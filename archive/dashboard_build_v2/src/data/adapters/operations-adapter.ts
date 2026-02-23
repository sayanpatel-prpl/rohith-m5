/**
 * Operations section data adapter.
 *
 * Builds OperationsData by combining data from:
 * - consolidated: quarterly results (OPM), ratios (inventory/debtor/CCC days)
 * - financial-api: revenue growth, EBITDA margin, working capital, D/E, ROCE
 * - trendlyne: ROCE fallback
 *
 * Generates A&M diagnostic triggers by scanning each company for threshold
 * breaches across key operational metrics (OPER-02).
 *
 * Never fabricates data. Missing values produce 0 with "estimated" confidence.
 */

import { getConsolidatedData } from "../loaders/consolidated";
import type { ConsolidatedCompany, RatiosEntry } from "../loaders/consolidated";
import { getFinancialApiData } from "../loaders/financial-api";
import type { FinancialApiCompany } from "../loaders/financial-api";
import { getTrendlyneData } from "../loaders/trendlyne";
import type { TrendlyneCompany } from "../loaders/trendlyne";
import { getCompanyById, COMPANIES } from "../companies";

import type {
  OperationsData,
  OpsMetricRow,
  ConfidenceIcon,
  DiagnosticTrigger,
  OperationsSummaryStats,
} from "../../types/operations";
import type { AMServiceLine } from "../../types/am-theme";
import { screenerSource } from "./source-helpers";

// ---------------------------------------------------------------------------
// Company data bundle (local to this adapter)
// ---------------------------------------------------------------------------

interface OpsBundle {
  id: string;
  name: string;
  subSector: string;
  consolidated: ConsolidatedCompany | undefined;
  financial: FinancialApiCompany | undefined;
  trendlyne: TrendlyneCompany | undefined;
}

function buildBundles(): OpsBundle[] {
  const consolidated = getConsolidatedData();
  const financial = getFinancialApiData();
  const trendlyne = getTrendlyneData();

  return COMPANIES.map((company) => ({
    id: company.id,
    name: company.name,
    subSector: company.subSector,
    consolidated: consolidated.companies.find(
      (c) => c.id.toLowerCase() === company.id,
    ),
    financial: financial.companies.find(
      (c) => c.id.toLowerCase() === company.id,
    ),
    trendlyne: trendlyne.companies.find(
      (c) => c.companyId.toLowerCase() === company.id,
    ),
  }));
}

// ---------------------------------------------------------------------------
// Ratio extraction helpers
// ---------------------------------------------------------------------------

/** Get the latest ratios entry from consolidated data */
function getLatestRatios(c: ConsolidatedCompany | undefined): RatiosEntry | null {
  if (!c || !c.ratios || c.ratios.length === 0) return null;
  return c.ratios[c.ratios.length - 1];
}

/** Get latest OPM from quarterly results */
function getLatestOpm(c: ConsolidatedCompany | undefined): number | null {
  if (!c || !c.quarterlyResults || c.quarterlyResults.length === 0) return null;
  return c.quarterlyResults[c.quarterlyResults.length - 1].opmPct;
}

// ---------------------------------------------------------------------------
// Metric Row Builder
// ---------------------------------------------------------------------------

function buildMetricRow(
  bundle: OpsBundle,
  lastUpdated: string,
): OpsMetricRow {
  const fin = bundle.financial;
  const con = bundle.consolidated;
  const tl = bundle.trendlyne;

  // Revenue Growth
  const revenueGrowthPct = fin?.metrics.revenueGrowth ?? 0;
  const revenueGrowthPctConfidence: ConfidenceIcon = fin ? "verified" : "estimated";

  // EBITDA Margin
  const ebitdaMarginPct = fin?.metrics.ebitdaMargin ?? 0;
  const ebitdaMarginPctConfidence: ConfidenceIcon = fin ? "verified" : "estimated";

  // OPM from latest quarterly result
  const latestOpm = getLatestOpm(con);
  const opmPct = latestOpm ?? 0;
  const opmPctConfidence: ConfidenceIcon = latestOpm != null ? "verified" : "estimated";

  // ROCE: prefer consolidated overview, fallback to trendlyne
  let rocePct = 0;
  let rocePctConfidence: ConfidenceIcon = "estimated";
  if (con?.overview.roce != null && con.overview.roce !== 0) {
    rocePct = con.overview.roce;
    rocePctConfidence = "verified";
  } else if (tl?.roce_pct != null) {
    rocePct = tl.roce_pct;
    rocePctConfidence = "derived";
  } else if (fin?.metrics.roce != null) {
    rocePct = fin.metrics.roce;
    rocePctConfidence = "derived";
  }

  // Working Capital Days
  const workingCapitalDays = fin?.metrics.workingCapitalDays ?? 0;
  const workingCapitalDaysConfidence: ConfidenceIcon = fin ? "verified" : "estimated";

  // Debt/Equity
  const debtEquity = fin?.metrics.debtEquity ?? 0;
  const debtEquityConfidence: ConfidenceIcon = fin ? "verified" : "estimated";

  // Ratios from consolidated
  const latestRatios = getLatestRatios(con);

  const inventoryDays = latestRatios?.["Inventory Days"] ?? 0;
  const inventoryDaysConfidence: ConfidenceIcon = latestRatios ? "verified" : "estimated";

  const debtorDays = latestRatios?.["Debtor Days"] ?? 0;
  const debtorDaysConfidence: ConfidenceIcon = latestRatios ? "verified" : "estimated";

  const cashConversionCycle = latestRatios?.["Cash Conversion Cycle"] ?? 0;
  const cashConversionCycleConfidence: ConfidenceIcon = latestRatios ? "verified" : "estimated";

  return {
    companyId: bundle.id,
    company: bundle.name,
    subSector: bundle.subSector,
    revenueGrowthPct,
    revenueGrowthPctConfidence,
    ebitdaMarginPct,
    ebitdaMarginPctConfidence,
    opmPct,
    opmPctConfidence,
    rocePct,
    rocePctConfidence,
    workingCapitalDays,
    workingCapitalDaysConfidence,
    debtEquity,
    debtEquityConfidence,
    inventoryDays,
    inventoryDaysConfidence,
    debtorDays,
    debtorDaysConfidence,
    cashConversionCycle,
    cashConversionCycleConfidence,
    source: screenerSource(lastUpdated),
  };
}

// ---------------------------------------------------------------------------
// Diagnostic Triggers (OPER-02)
// ---------------------------------------------------------------------------

interface TriggerRule {
  metric: string;
  field: keyof OpsMetricRow;
  test: (value: number) => boolean;
  trigger: string;
  threshold: number;
  amServiceLine: AMServiceLine;
}

const TRIGGER_RULES: TriggerRule[] = [
  {
    metric: "OPM",
    field: "opmPct",
    test: (v) => v < 5 && v !== 0,
    trigger:
      "Low operating margin indicates potential operational inefficiency",
    threshold: 5,
    amServiceLine: "Operations",
  },
  {
    metric: "Working Capital Days",
    field: "workingCapitalDays",
    test: (v) => v > 120,
    trigger:
      "High working capital days suggest cash conversion cycle issues",
    threshold: 120,
    amServiceLine: "CPI",
  },
  {
    metric: "Debt/Equity",
    field: "debtEquity",
    test: (v) => v > 1.5,
    trigger:
      "Elevated leverage may constrain operational flexibility",
    threshold: 1.5,
    amServiceLine: "Restructuring",
  },
  {
    metric: "ROCE",
    field: "rocePct",
    test: (v) => v < 8 && v !== 0,
    trigger:
      "Low ROCE signals poor capital allocation efficiency",
    threshold: 8,
    amServiceLine: "CPI",
  },
  {
    metric: "Revenue Growth",
    field: "revenueGrowthPct",
    test: (v) => v < -10,
    trigger:
      "Significant revenue decline warrants turnaround assessment",
    threshold: -10,
    amServiceLine: "Restructuring",
  },
];

function buildDiagnosticTriggers(
  metrics: OpsMetricRow[],
  lastUpdated: string,
): DiagnosticTrigger[] {
  const triggers: DiagnosticTrigger[] = [];

  for (const row of metrics) {
    for (const rule of TRIGGER_RULES) {
      const value = row[rule.field] as number;
      if (rule.test(value)) {
        triggers.push({
          companyId: row.companyId,
          company: row.company,
          trigger: rule.trigger,
          metric: rule.metric,
          value,
          threshold: rule.threshold,
          amServiceLine: rule.amServiceLine,
          source: screenerSource(lastUpdated),
        });
      }
    }
  }

  return triggers;
}

// ---------------------------------------------------------------------------
// Summary Stats
// ---------------------------------------------------------------------------

function computeSummaryStats(
  metrics: OpsMetricRow[],
  triggerCount: number,
): OperationsSummaryStats {
  const ebitdaValues = metrics
    .map((m) => m.ebitdaMarginPct)
    .filter((v) => v !== 0);
  const avgEbitdaMargin =
    ebitdaValues.length > 0
      ? ebitdaValues.reduce((a, b) => a + b, 0) / ebitdaValues.length
      : 0;

  const roceValues = metrics
    .map((m) => m.rocePct)
    .filter((v) => v !== 0);
  const avgROCE =
    roceValues.length > 0
      ? roceValues.reduce((a, b) => a + b, 0) / roceValues.length
      : 0;

  return {
    companiesTracked: metrics.length,
    avgEbitdaMargin: Math.round(avgEbitdaMargin * 10) / 10,
    avgROCE: Math.round(avgROCE * 10) / 10,
    diagnosticTriggerCount: triggerCount,
  };
}

// ---------------------------------------------------------------------------
// Main adapter function
// ---------------------------------------------------------------------------

/** Build the complete Operations section data payload */
export function buildOperationsData(): OperationsData {
  // ALTERNATIVE_DATA_SLOT: DGFT import/export data
  // Integration point: DGFT data for backward integration verification, PLI for capex ROI
  // Expected: getDGFTData() -> company-level import dependency ratios
  //
  // ALTERNATIVE_DATA_SLOT: PLI scheme data
  // Integration point: DGFT data for backward integration verification, PLI for capex ROI
  // Expected: getPLIData() -> company PLI eligibility and disbursement status
  //
  // ALTERNATIVE_DATA_SLOT: Google Trends data
  // Integration point: DGFT data for backward integration verification, PLI for capex ROI
  // Expected: getGoogleTrendsData() -> brand-level search interest indices
  //
  // ALTERNATIVE_DATA_SLOT: Patent filing data
  // Integration point: DGFT data for backward integration verification, PLI for capex ROI
  // Expected: getPatentData() -> company-level patent counts and categories

  const financialApi = getFinancialApiData();
  const lastUpdated = financialApi.lastUpdated ?? new Date().toISOString();

  const bundles = buildBundles();

  // Build metric rows for all companies
  const metrics = bundles.map((b) => buildMetricRow(b, lastUpdated));

  // Build diagnostic triggers
  const diagnosticTriggers = buildDiagnosticTriggers(metrics, lastUpdated);

  // Cross-link: companies from diagnostic triggers
  const crossLinkCompetitiveIds = [
    ...new Set(diagnosticTriggers.map((t) => t.companyId)),
  ];

  // Summary stats
  const summaryStats = computeSummaryStats(
    metrics,
    diagnosticTriggers.length,
  );

  return {
    section: "operations",
    dataAsOf: financialApi.dataAsOf,
    lastUpdated,
    summaryStats,
    metrics,
    diagnosticTriggers,
    crossLinkCompetitiveIds,
  };
}
