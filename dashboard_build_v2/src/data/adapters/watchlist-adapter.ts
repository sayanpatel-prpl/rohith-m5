/**
 * Watchlist section data adapter.
 *
 * Builds WatchlistData by cross-referencing ALL data sources:
 * - consolidated: cash flow, balance sheet, shareholding, quarterly results
 * - financial-api: performance tiers, metrics, history
 * - sovrenn: growth triggers (capex signals), deal activity
 * - trendlyne: PE, market cap, valuations
 *
 * Populates 4 quadrants: stressIndicators, likelyFundraises, marginInflection, consolidationTargets.
 * Each entry gets severity 1-5, source attribution, and AMServiceLine tag.
 * Never fabricates data. Missing values are null or entries are skipped.
 */

import { getConsolidatedData } from "../loaders/consolidated";
import type { ConsolidatedCompany } from "../loaders/consolidated";
import { getFinancialApiData } from "../loaders/financial-api";
import type { FinancialApiCompany } from "../loaders/financial-api";
import { getSovrennData } from "../loaders/sovrenn";
import type { SovrennCompany } from "../loaders/sovrenn";
import { getTrendlyneData } from "../loaders/trendlyne";
import type { TrendlyneCompany } from "../loaders/trendlyne";
import { getCompanyById } from "../companies";

import type {
  WatchlistData,
  WatchlistEntry,
  WatchlistQuadrant,
  StressModel,
  StressThresholds,
} from "../../types/watchlist";
import type { SourceInfo } from "../../types/source";

// ---------------------------------------------------------------------------
// Helper: create SourceInfo objects
// ---------------------------------------------------------------------------

function screenerSource(lastUpdated: string): SourceInfo {
  return {
    source: "Screener.in consolidated financial data",
    confidence: "verified",
    tier: 1,
    lastUpdated,
  };
}

function financialApiSource(lastUpdated: string): SourceInfo {
  return {
    source: "Screener.in + Trendlyne aggregated metrics",
    confidence: "verified",
    tier: 1,
    lastUpdated,
  };
}

function derivedSource(lastUpdated: string): SourceInfo {
  return {
    source: "Cross-source derived analysis",
    confidence: "derived",
    tier: 4,
    lastUpdated,
  };
}

// ---------------------------------------------------------------------------
// Helper: bundled company data
// ---------------------------------------------------------------------------

type CompanyBundle = {
  id: string;
  name: string;
  consolidated: ConsolidatedCompany | undefined;
  financial: FinancialApiCompany | undefined;
  sovrenn: SovrennCompany | undefined;
  trendlyne: TrendlyneCompany | undefined;
};

function buildBundles(): CompanyBundle[] {
  const consolidated = getConsolidatedData();
  const financial = getFinancialApiData();
  const sovrenn = getSovrennData();
  const trendlyne = getTrendlyneData();

  const idSet = new Set<string>();
  consolidated.companies.forEach((c) => idSet.add(c.id.toLowerCase()));
  financial.companies.forEach((c) => idSet.add(c.id.toLowerCase()));

  return Array.from(idSet).map((id) => {
    const company = getCompanyById(id);
    const fin = financial.companies.find((c) => c.id.toLowerCase() === id);
    return {
      id,
      name: company?.name ?? fin?.name ?? id,
      consolidated: consolidated.companies.find(
        (c) => c.id.toLowerCase() === id,
      ),
      financial: fin,
      sovrenn: sovrenn.find((c) => c.companyId.toLowerCase() === id),
      trendlyne: trendlyne.companies.find(
        (c) => c.companyId.toLowerCase() === id,
      ),
    };
  });
}

// ---------------------------------------------------------------------------
// Compute stress thresholds
// ---------------------------------------------------------------------------

function computeStressThresholds(bundles: CompanyBundle[]): StressThresholds {
  // Compute 25th percentile EBITDA margin
  const margins = bundles
    .map((b) => b.financial?.metrics.ebitdaMargin ?? null)
    .filter((v): v is number => v !== null);
  margins.sort((a, b) => a - b);
  const p25Index = Math.floor(margins.length * 0.25);
  const ebitdaMarginP25 = margins.length > 0 ? margins[p25Index] : 5;

  return {
    cashBurnQuarters: 2,
    debtMaturityMonths: 12,
    revenueDeclineQuarters: 2,
    ebitdaMarginP25,
  };
}

// ---------------------------------------------------------------------------
// Stress Indicators (WTCH-03)
// ---------------------------------------------------------------------------

function buildStressIndicators(
  bundles: CompanyBundle[],
  thresholds: StressThresholds,
  lastUpdated: string,
): WatchlistEntry[] {
  const entries: WatchlistEntry[] = [];

  for (const b of bundles) {
    const con = b.consolidated;
    const fin = b.financial;
    if (!con && !fin) continue;

    // 1. Revenue decline for 2+ consecutive quarters
    const hist = fin?.history ?? [];
    if (hist.length >= 2) {
      const recentQuarters = hist.slice(-3);
      const declineCount = recentQuarters.filter(
        (h) => h.revenueGrowth < 0,
      ).length;
      if (declineCount >= thresholds.revenueDeclineQuarters) {
        const latestGrowth = hist[hist.length - 1].revenueGrowth;
        const severity: 1 | 2 | 3 | 4 | 5 =
          declineCount >= 3 ? 4 : latestGrowth < -15 ? 4 : 3;
        entries.push({
          companyId: b.id,
          companyName: b.name,
          signal: "Sustained Revenue Decline",
          detail: `Revenue declined in ${declineCount} of last ${recentQuarters.length} quarters. Latest: ${latestGrowth.toFixed(1)}% YoY.`,
          severity,
          daysToEvent: null,
          source: financialApiSource(lastUpdated),
          serviceLine: "Restructuring",
        });
      }
    }

    // 2. EBITDA margin below P25
    const margin = fin?.metrics.ebitdaMargin ?? null;
    if (margin !== null && margin < thresholds.ebitdaMarginP25) {
      const gap = thresholds.ebitdaMarginP25 - margin;
      const severity: 1 | 2 | 3 | 4 | 5 = gap > 5 ? 4 : gap > 3 ? 3 : 2;
      entries.push({
        companyId: b.id,
        companyName: b.name,
        signal: "Below-Sector Margin",
        detail: `EBITDA margin at ${margin.toFixed(1)}% vs sector P25 of ${thresholds.ebitdaMarginP25.toFixed(1)}%. ${gap.toFixed(0)}ppt gap signals structural cost issue.`,
        severity,
        daysToEvent: null,
        source: financialApiSource(lastUpdated),
        serviceLine: "CPI",
      });
    }

    // 3. Cash burn: negative operating cash flow in recent annual periods
    if (con?.cashFlow && con.cashFlow.length >= 2) {
      const recentCF = con.cashFlow.slice(-3);
      const negativeCFCount = recentCF.filter(
        (cf) => cf["Cash from Operating Activity"] < 0,
      ).length;
      if (negativeCFCount >= thresholds.cashBurnQuarters) {
        entries.push({
          companyId: b.id,
          companyName: b.name,
          signal: "Cash Burn Warning",
          detail: `Negative operating cash flow in ${negativeCFCount} of last ${recentCF.length} annual periods. Operating viability risk.`,
          severity: negativeCFCount >= 3 ? 5 : 3,
          daysToEvent: null,
          source: screenerSource(lastUpdated),
          serviceLine: "Restructuring",
        });
      }
    }

    // 4. Debt maturity: borrowings growing with low operating cash
    if (con?.balanceSheet && con.balanceSheet.length >= 2 && con?.cashFlow) {
      const latestBS = con.balanceSheet[con.balanceSheet.length - 1];
      const prevBS = con.balanceSheet[con.balanceSheet.length - 2];
      const latestCF = con.cashFlow[con.cashFlow.length - 1];

      const borrowingsGrowth =
        prevBS.Borrowings > 0
          ? ((latestBS.Borrowings - prevBS.Borrowings) / prevBS.Borrowings) *
            100
          : 0;
      const operatingCash = latestCF?.["Cash from Operating Activity"] ?? 0;

      if (borrowingsGrowth > 20 && operatingCash < latestBS.Borrowings * 0.3) {
        entries.push({
          companyId: b.id,
          companyName: b.name,
          signal: "Debt Service Pressure",
          detail: `Borrowings grew ${borrowingsGrowth.toFixed(0)}% while operating cash covers only ${((operatingCash / latestBS.Borrowings) * 100).toFixed(0)}% of debt. Refinancing risk.`,
          severity: borrowingsGrowth > 50 ? 4 : 3,
          daysToEvent: null,
          source: screenerSource(lastUpdated),
          serviceLine: "Restructuring",
        });
      }
    }
  }

  // Sort by severity descending
  entries.sort((a, b) => b.severity - a.severity);
  return entries;
}

// ---------------------------------------------------------------------------
// Likely Fundraises (WTCH-04)
// ---------------------------------------------------------------------------

function buildLikelyFundraises(
  bundles: CompanyBundle[],
  lastUpdated: string,
): WatchlistEntry[] {
  const entries: WatchlistEntry[] = [];

  for (const b of bundles) {
    const con = b.consolidated;
    const sov = b.sovrenn;

    // Check for capex signals in sovrenn growth triggers
    const capexKeywords = /capex|investment|facility|expansion|greenfield|capacity|plant/i;
    const hasCapexSignal =
      sov?.keyGrowthTriggers.some((t) => capexKeywords.test(t)) ?? false;

    // Check for fundraising in sovrenn deal activity
    const hasFundraisingDeal =
      sov?.dealActivity.some(
        (d) =>
          d.type === "qip" ||
          d.type === "investment" ||
          d.description.toLowerCase().includes("raise") ||
          d.description.toLowerCase().includes("qip") ||
          d.description.toLowerCase().includes("ccps"),
      ) ?? false;

    // Check declining promoter holding from consolidated shareholding
    let promoterDeclining = false;
    if (con?.shareholding && con.shareholding.length >= 2) {
      const recent = con.shareholding.slice(-2);
      if (recent[1].Promoters < recent[0].Promoters) {
        promoterDeclining = true;
      }
    }

    // Check declining operating cash flow
    let cashDeclining = false;
    if (con?.cashFlow && con.cashFlow.length >= 2) {
      const recentCF = con.cashFlow.slice(-2);
      if (
        recentCF[1]["Cash from Operating Activity"] <
        recentCF[0]["Cash from Operating Activity"]
      ) {
        cashDeclining = true;
      }
    }

    // Score signals: need at least 2 of 4 indicators
    const signalCount =
      (hasCapexSignal ? 1 : 0) +
      (hasFundraisingDeal ? 1 : 0) +
      (promoterDeclining ? 1 : 0) +
      (cashDeclining ? 1 : 0);

    if (signalCount >= 2) {
      const reasons: string[] = [];
      if (hasCapexSignal) reasons.push("capex expansion signals");
      if (hasFundraisingDeal) reasons.push("recent fundraising activity");
      if (promoterDeclining) reasons.push("declining promoter holding");
      if (cashDeclining) reasons.push("declining operating cash flow");

      const severity: 1 | 2 | 3 | 4 | 5 =
        signalCount >= 4 ? 4 : signalCount >= 3 ? 3 : 2;

      entries.push({
        companyId: b.id,
        companyName: b.name,
        signal: "Likely Fundraise",
        detail: `${signalCount} of 4 fundraise indicators triggered: ${reasons.join(", ")}.`,
        severity,
        daysToEvent: hasFundraisingDeal ? 90 : null,
        source: derivedSource(lastUpdated),
        serviceLine: "Transaction Advisory",
      });
    }
  }

  entries.sort((a, b) => b.severity - a.severity);
  return entries;
}

// ---------------------------------------------------------------------------
// Margin Inflection
// ---------------------------------------------------------------------------

function buildMarginInflection(
  bundles: CompanyBundle[],
  lastUpdated: string,
): WatchlistEntry[] {
  const entries: WatchlistEntry[] = [];

  for (const b of bundles) {
    const hist = b.financial?.history ?? [];
    if (hist.length < 3) continue;

    const recent3 = hist.slice(-3);
    const m0 = recent3[0].ebitdaMargin;
    const m1 = recent3[1].ebitdaMargin;
    const m2 = recent3[2].ebitdaMargin;

    // Check for inflection: was declining, now improving
    const wasDeclining = m1 < m0;
    const nowImproving = m2 > m1;
    const positiveInflection = wasDeclining && nowImproving;

    // Check for negative inflection: was improving, now declining
    const wasImproving = m1 > m0;
    const nowDeclining = m2 < m1;
    const negativeInflection = wasImproving && nowDeclining;

    if (positiveInflection) {
      const improvement = m2 - m1;
      const severity: 1 | 2 | 3 | 4 | 5 = improvement > 3 ? 3 : 2;
      entries.push({
        companyId: b.id,
        companyName: b.name,
        signal: "Positive Margin Inflection",
        detail: `EBITDA margin reversed from declining (${m0.toFixed(1)}% -> ${m1.toFixed(1)}%) to improving (${m1.toFixed(1)}% -> ${m2.toFixed(1)}%). Potential turnaround signal.`,
        severity,
        daysToEvent: null,
        source: financialApiSource(lastUpdated),
        serviceLine: "CPI",
      });
    }

    if (negativeInflection) {
      const decline = m1 - m2;
      const severity: 1 | 2 | 3 | 4 | 5 = decline > 3 ? 4 : 3;
      entries.push({
        companyId: b.id,
        companyName: b.name,
        signal: "Negative Margin Inflection",
        detail: `EBITDA margin reversed from improving (${m0.toFixed(1)}% -> ${m1.toFixed(1)}%) to declining (${m1.toFixed(1)}% -> ${m2.toFixed(1)}%). Emerging margin risk.`,
        severity,
        daysToEvent: null,
        source: financialApiSource(lastUpdated),
        serviceLine: "CPI",
      });
    }
  }

  entries.sort((a, b) => b.severity - a.severity);
  return entries;
}

// ---------------------------------------------------------------------------
// Consolidation Targets
// ---------------------------------------------------------------------------

function buildConsolidationTargets(
  bundles: CompanyBundle[],
  lastUpdated: string,
): WatchlistEntry[] {
  const entries: WatchlistEntry[] = [];

  // Get market caps for relative comparison
  const marketCaps = bundles
    .map((b) => ({
      id: b.id,
      cap:
        b.financial?.overview.marketCapCr ??
        b.consolidated?.overview.marketCapCr ??
        null,
    }))
    .filter((c): c is { id: string; cap: number } => c.cap !== null);

  if (marketCaps.length === 0) return entries;

  // Sort by market cap to find relative positioning
  marketCaps.sort((a, b) => a.cap - b.cap);
  const medianCap = marketCaps[Math.floor(marketCaps.length / 2)].cap;

  for (const b of bundles) {
    const cap =
      b.financial?.overview.marketCapCr ??
      b.consolidated?.overview.marketCapCr ??
      null;
    if (cap === null) continue;

    const performance = b.financial?.performance;
    const isSmall = cap < medianCap * 0.5; // Below 50% of median market cap
    const isUnderperforming =
      performance === "underperform" ||
      (b.financial?.metrics.revenueGrowth ?? 0) < -5;

    if (isSmall && isUnderperforming) {
      const subSector = getCompanyById(b.id)?.subSector ?? "Mixed";
      const severity: 1 | 2 | 3 | 4 | 5 =
        performance === "underperform" ? 3 : 2;

      entries.push({
        companyId: b.id,
        companyName: b.name,
        signal: "Consolidation Target",
        detail: `Market cap INR ${cap.toLocaleString("en-IN")} Cr (below sector median of ${medianCap.toLocaleString("en-IN")} Cr) with underperformance in ${subSector} segment. Potential acquisition target for larger players.`,
        severity,
        daysToEvent: null,
        source: derivedSource(lastUpdated),
        serviceLine: "Transaction Advisory",
      });
    }
  }

  entries.sort((a, b) => b.severity - a.severity);
  return entries;
}

// ---------------------------------------------------------------------------
// Main adapter function
// ---------------------------------------------------------------------------

/** Build the complete Watchlist section data payload */
export function buildWatchlistData(): WatchlistData {
  const financialApi = getFinancialApiData();
  const lastUpdated = financialApi.lastUpdated ?? new Date().toISOString();

  const bundles = buildBundles();
  const thresholds = computeStressThresholds(bundles);

  const quadrants: Record<WatchlistQuadrant, WatchlistEntry[]> = {
    stressIndicators: buildStressIndicators(bundles, thresholds, lastUpdated),
    likelyFundraises: buildLikelyFundraises(bundles, lastUpdated),
    marginInflection: buildMarginInflection(bundles, lastUpdated),
    consolidationTargets: buildConsolidationTargets(bundles, lastUpdated),
  };

  return {
    section: "watchlist",
    dataAsOf: financialApi.dataAsOf,
    lastUpdated,
    quadrants,
    stressModel: { thresholds },
  };
}
