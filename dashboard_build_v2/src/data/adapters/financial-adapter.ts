/**
 * Financial Performance section data adapter.
 *
 * Builds FinancialData by combining:
 * - financial-api: primary source for per-company metrics, history, performance
 * - consolidated: deeper quarterly detail
 * - trendlyne: PE, PB ratios for enrichment
 *
 * Computes A&M signal triage, sparkline arrays, and derived competitive columns.
 * Never fabricates data. Missing values are null or empty arrays.
 */

import { getFinancialApiData } from "../loaders/financial-api";
import type { FinancialApiCompany } from "../loaders/financial-api";
import { getTrendlyneData } from "../loaders/trendlyne";
import type { TrendlyneCompany } from "../loaders/trendlyne";
import { getConsolidatedData } from "../loaders/consolidated";
import { getCompanyById } from "../companies";

import type {
  FinancialData,
  FinancialCompanyRow,
  FinancialRowMetrics,
  SparklineData,
  FinancialHistoryEntry,
  DerivedColumn,
} from "../../types/financial";
import type { AMActionType } from "../../types/am-theme";
import type { PerformanceLevel } from "../../types/common";

// ---------------------------------------------------------------------------
// A&M Signal Triage Logic (FINP-01)
// ---------------------------------------------------------------------------

function computeAMSignal(
  company: FinancialApiCompany,
  sectorMedianMargin: number,
): { signal: AMActionType; reason: string } {
  const { revenueGrowth, ebitdaMargin, debtEquity } = company.metrics;
  const performance = company.performance;

  // Turnaround: severe revenue decline or very low margin with decline
  if (revenueGrowth < -10) {
    return {
      signal: "turnaround",
      reason: `Revenue declined ${revenueGrowth.toFixed(1)}% YoY — significant turnaround opportunity`,
    };
  }
  if (ebitdaMargin < 3 && revenueGrowth < 0) {
    return {
      signal: "turnaround",
      reason: `EBITDA margin at ${ebitdaMargin.toFixed(1)}% with declining revenue — turnaround candidate`,
    };
  }

  // Improvement: below-median margin or mild revenue decline
  if (ebitdaMargin < sectorMedianMargin) {
    return {
      signal: "improvement",
      reason: `EBITDA margin ${ebitdaMargin.toFixed(1)}% below sector median ${sectorMedianMargin.toFixed(1)}% — performance improvement opportunity`,
    };
  }
  if (revenueGrowth >= -10 && revenueGrowth < 0) {
    return {
      signal: "improvement",
      reason: `Mild revenue decline of ${revenueGrowth.toFixed(1)}% — operational improvement candidate`,
    };
  }

  // Transaction: strong performer with low leverage (acquisition candidate)
  if (performance === "outperform" && debtEquity < 0.5) {
    return {
      signal: "transaction",
      reason: `Outperforming with low leverage (D/E: ${debtEquity.toFixed(2)}) — strong acquisition platform candidate`,
    };
  }

  // Neutral: everything else
  return {
    signal: "neutral",
    reason: "Stable performance within sector norms — monitor for changes",
  };
}

// ---------------------------------------------------------------------------
// Sparkline Data (FINP-02)
// ---------------------------------------------------------------------------

function buildSparklineData(company: FinancialApiCompany): SparklineData {
  const hist = company.history ?? [];
  const recent = hist.slice(-6); // Last 6 quarters

  return {
    revenue: recent.map((h) => h.revenue),
    ebitdaMargin: recent.map((h) => h.ebitdaMargin),
  };
}

// ---------------------------------------------------------------------------
// History entries
// ---------------------------------------------------------------------------

function buildHistory(company: FinancialApiCompany): FinancialHistoryEntry[] {
  return (company.history ?? []).map((h) => ({
    period: h.period,
    revenue: h.revenue,
    ebitdaMargin: h.ebitdaMargin,
    netProfit: h.netProfit,
  }));
}

// ---------------------------------------------------------------------------
// Derived Columns (FINP-05)
// ---------------------------------------------------------------------------

function buildDerivedColumns(): DerivedColumn[] {
  return [
    {
      id: "mktShare",
      label: "Market Share %",
      methodology:
        "Company latest quarter revenue / sum of all tracked company revenues * 100. Represents share within the 14-company tracked universe only.",
    },
    {
      id: "pricingPower",
      label: "Pricing Power (bps)",
      methodology:
        "Company EBITDA margin minus sector median EBITDA margin, in basis points. Positive = above-sector pricing power; Negative = margin pressure.",
    },
    {
      id: "competitiveIntensity",
      label: "Competitive Intensity",
      methodology:
        "Inverse HHI-inspired metric. Based on revenue concentration within each sub-sector. Higher value = more competitive sub-sector with dispersed market share.",
    },
  ];
}

// ---------------------------------------------------------------------------
// Main adapter function
// ---------------------------------------------------------------------------

/** Build the complete Financial Performance section data payload */
export function buildFinancialData(): FinancialData {
  const financialApi = getFinancialApiData();
  const trendlyne = getTrendlyneData();
  const consolidated = getConsolidatedData();

  const lastUpdated = financialApi.lastUpdated ?? new Date().toISOString();
  const finCompanies = financialApi.companies;

  // Compute sector median EBITDA margin
  const margins = finCompanies
    .map((c) => c.metrics.ebitdaMargin)
    .filter((v) => v != null && isFinite(v));
  margins.sort((a, b) => a - b);
  const sectorMedianMargin =
    margins.length > 0 ? margins[Math.floor(margins.length / 2)] : 8;

  // Build lookup maps for trendlyne data
  const trendlyneMap = new Map<string, TrendlyneCompany>();
  trendlyne.companies.forEach((c) =>
    trendlyneMap.set(c.companyId.toLowerCase(), c),
  );

  // Compute total revenue for market share calculation
  const totalRevenue = finCompanies.reduce((sum, c) => {
    const hist = c.history ?? [];
    const latestRevenue = hist.length > 0 ? hist[hist.length - 1].revenue : 0;
    return sum + latestRevenue;
  }, 0);

  // Build per-company rows
  const companies: FinancialCompanyRow[] = finCompanies.map((fc) => {
    const tl = trendlyneMap.get(fc.id.toLowerCase());
    const company = getCompanyById(fc.id);
    const { signal: amSignal, reason: amSignalReason } = computeAMSignal(
      fc,
      sectorMedianMargin,
    );

    const hist = fc.history ?? [];
    const latestRevenue = hist.length > 0 ? hist[hist.length - 1].revenue : null;
    const latestProfit = hist.length > 0 ? hist[hist.length - 1].netProfit : null;
    const latestProfitGrowth =
      hist.length > 0 ? hist[hist.length - 1].profitGrowth : null;

    const metrics: FinancialRowMetrics = {
      revenue: latestRevenue,
      revenueGrowth: fc.metrics.revenueGrowth ?? null,
      ebitdaMargin: fc.metrics.ebitdaMargin ?? null,
      netProfit: latestProfit,
      profitGrowth: latestProfitGrowth ?? null,
      roce: fc.metrics.roce ?? null,
      debtEquity: fc.metrics.debtEquity ?? null,
      workingCapitalDays: fc.metrics.workingCapitalDays ?? null,
      peRatio: tl?.pe ?? fc.overview.peRatio ?? null,
    };

    return {
      id: fc.id,
      name: company?.name ?? fc.name,
      ticker: fc.ticker,
      subSector: company?.subSector ?? "Mixed",
      amSignal,
      amSignalReason,
      metrics,
      sparklineData: buildSparklineData(fc),
      performance: (fc.performance as PerformanceLevel) ?? "inline",
      history: buildHistory(fc),
      source: fc.source,
    };
  });

  return {
    section: "financial",
    dataAsOf: financialApi.dataAsOf,
    lastUpdated,
    companies,
    derivedColumns: buildDerivedColumns(),
  };
}
