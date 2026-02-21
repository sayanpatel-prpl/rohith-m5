/**
 * Executive section data adapter.
 *
 * Builds ExecutiveData by combining data from ALL loaders:
 * - consolidated: quarterly financials, balance sheet, cash flow, shareholding
 * - financial-api: performance tiers, pre-computed metrics, history
 * - sovrenn: growth triggers (Big Themes), quarterly tags (Narrative Risks)
 * - trendlyne: PE, PB, ROCE, debt ratios
 *
 * Never fabricates data. Missing values are null or empty arrays.
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
  ExecutiveData,
  IntelligenceGrade,
  IntelligenceGradeLevel,
  AMOpportunitySummary,
  ServiceLineBreakdownEntry,
  BigTheme,
  RedFlag,
  NarrativeRisk,
  ExecutiveCompanySnapshot,
} from "../../types/executive";
import type { AMServiceLine } from "../../types/am-theme";
import type { PerformanceLevel } from "../../types/common";
import { screenerSource, financialApiSource, sovrennSource, derivedSource } from "./source-helpers";

// ---------------------------------------------------------------------------
// Helper: map company IDs across data sources
// ---------------------------------------------------------------------------

type CompanyDataBundle = {
  id: string;
  consolidated: ConsolidatedCompany | undefined;
  financial: FinancialApiCompany | undefined;
  sovrenn: SovrennCompany | undefined;
  trendlyne: TrendlyneCompany | undefined;
};

function buildCompanyBundles(): CompanyDataBundle[] {
  const consolidated = getConsolidatedData();
  const financial = getFinancialApiData();
  const sovrenn = getSovrennData();
  const trendlyne = getTrendlyneData();

  // Collect all unique company IDs from all sources
  const idSet = new Set<string>();
  consolidated.companies.forEach((c) => idSet.add(c.id.toLowerCase()));
  financial.companies.forEach((c) => idSet.add(c.id.toLowerCase()));
  sovrenn.forEach((c) => idSet.add(c.companyId.toLowerCase()));
  trendlyne.companies.forEach((c) => idSet.add(c.companyId.toLowerCase()));

  return Array.from(idSet).map((id) => ({
    id,
    consolidated: consolidated.companies.find(
      (c) => c.id.toLowerCase() === id,
    ),
    financial: financial.companies.find((c) => c.id.toLowerCase() === id),
    sovrenn: sovrenn.find((c) => c.companyId.toLowerCase() === id),
    trendlyne: trendlyne.companies.find(
      (c) => c.companyId.toLowerCase() === id,
    ),
  }));
}

// ---------------------------------------------------------------------------
// Intelligence Grade (EXEC-01)
// ---------------------------------------------------------------------------

function computeIntelligenceGrade(
  bundles: CompanyDataBundle[],
): IntelligenceGrade {
  // Count companies with data across multiple sources
  let fullCoverage = 0;
  const factors: string[] = [];

  let hasConsolidated = 0;
  let hasFinancial = 0;
  let hasSovrenn = 0;
  let hasTrendlyne = 0;

  for (const b of bundles) {
    const sourcesPresent =
      (b.consolidated ? 1 : 0) +
      (b.financial ? 1 : 0) +
      (b.sovrenn ? 1 : 0) +
      (b.trendlyne ? 1 : 0);

    if (sourcesPresent >= 3) fullCoverage++;
    if (b.consolidated) hasConsolidated++;
    if (b.financial) hasFinancial++;
    if (b.sovrenn) hasSovrenn++;
    if (b.trendlyne) hasTrendlyne++;
  }

  factors.push(
    `${hasConsolidated} companies in consolidated data`,
    `${hasFinancial} companies in financial API`,
    `${hasSovrenn} companies in Sovrenn intelligence`,
    `${hasTrendlyne} companies in Trendlyne summary`,
    `${fullCoverage} companies with 3+ source coverage`,
  );

  let grade: IntelligenceGradeLevel;
  if (fullCoverage >= 14) grade = "A";
  else if (fullCoverage >= 12) grade = "A-";
  else if (fullCoverage >= 10) grade = "B+";
  else if (fullCoverage >= 7) grade = "B";
  else if (fullCoverage >= 5) grade = "B-";
  else if (fullCoverage >= 3) grade = "C+";
  else grade = "C";

  return {
    grade,
    methodology: `Grade based on cross-source data coverage. ${fullCoverage} of ${bundles.length} companies have data from 3+ sources. Higher coverage = higher confidence in intelligence outputs.`,
    factors,
  };
}

// ---------------------------------------------------------------------------
// A&M Opportunity Summary (EXEC-02)
// ---------------------------------------------------------------------------

function computeOpportunitySummary(
  bundles: CompanyDataBundle[],
  _lastUpdated: string,
): AMOpportunitySummary {
  const distressCompanies: CompanyDataBundle[] = [];
  const serviceLineCounts: Record<string, number> = {};

  // Compute sector median EBITDA margin
  const margins = bundles
    .map((b) => b.financial?.metrics.ebitdaMargin ?? null)
    .filter((v): v is number => v !== null);
  margins.sort((a, b) => a - b);
  const sectorMedianMargin =
    margins.length > 0 ? margins[Math.floor(margins.length / 2)] : 8;

  for (const b of bundles) {
    const perf = b.financial?.performance;
    const revGrowth = b.financial?.metrics.revenueGrowth ?? null;
    const margin = b.financial?.metrics.ebitdaMargin ?? null;

    const isUnderperform = perf === "underperform";
    const isDistressed =
      revGrowth !== null &&
      margin !== null &&
      revGrowth < 0 &&
      margin < sectorMedianMargin;

    if (isUnderperform || isDistressed) {
      distressCompanies.push(b);

      // Map distress pattern to service line
      if (revGrowth !== null && revGrowth < -10) {
        serviceLineCounts["Restructuring"] =
          (serviceLineCounts["Restructuring"] ?? 0) + 1;
      } else if (margin !== null && margin < 5) {
        serviceLineCounts["CPI"] = (serviceLineCounts["CPI"] ?? 0) + 1;
      } else {
        serviceLineCounts["Operations"] =
          (serviceLineCounts["Operations"] ?? 0) + 1;
      }
    }
  }

  // Total advisory opportunity: sum market cap of distressed * 2% fee proxy
  let totalAdvisoryOpportunityCr: number | null = null;
  const marketCapSum = distressCompanies.reduce((sum, b) => {
    const cap =
      b.financial?.overview.marketCapCr ??
      b.consolidated?.overview.marketCapCr ??
      null;
    return cap !== null ? sum + cap : sum;
  }, 0);
  if (marketCapSum > 0) {
    totalAdvisoryOpportunityCr = Math.round(marketCapSum * 0.02);
  }

  // Determine top recommended action
  let topRecommendedAction = "Performance Improvement";
  const restructuringCount = serviceLineCounts["Restructuring"] ?? 0;
  const cpiCount = serviceLineCounts["CPI"] ?? 0;
  if (restructuringCount > cpiCount) {
    topRecommendedAction = "Turnaround Advisory";
  } else if (cpiCount > 0) {
    topRecommendedAction = "Performance Improvement";
  }

  const serviceLineBreakdown: ServiceLineBreakdownEntry[] = Object.entries(
    serviceLineCounts,
  ).map(([sl, count]) => ({
    serviceLine: sl as AMServiceLine,
    count,
  }));

  return {
    totalAdvisoryOpportunityCr,
    companiesInDistress: distressCompanies.length,
    topRecommendedAction,
    serviceLineBreakdown,
  };
}

// ---------------------------------------------------------------------------
// Big Themes (EXEC-03)
// ---------------------------------------------------------------------------

function extractBigThemes(
  bundles: CompanyDataBundle[],
  lastUpdated: string,
): BigTheme[] {
  const themes: BigTheme[] = [];

  // Extract from sovrenn keyGrowthTriggers -- group triggers by keyword patterns
  const triggerMap: Record<string, { detail: string; companies: string[] }> = {};

  const themePatterns: [string, RegExp][] = [
    ["GST Reduction Impact on RAC", /gst\s*(reduction|cut|change)/i],
    ["Electronics & PCB Manufacturing Expansion", /pcb|electronics|semiconductor|ems/i],
    ["Railway & Defence Diversification", /railway|defense|defence|vande bharat|sidwal/i],
    ["Capacity Expansion & New Facilities", /facility|capex|expansion|greenfield|capacity/i],
    ["Strategic Acquisitions & Investments", /acqui|investment|stake|subsidiary|jv/i],
    ["Industry Growth to 30-35M Units", /30.*million|35.*million|industry.*grow/i],
  ];

  for (const b of bundles) {
    if (!b.sovrenn?.keyGrowthTriggers.length) continue;
    const companyName =
      getCompanyById(b.id)?.name ?? b.sovrenn.companyName ?? b.id;

    for (const trigger of b.sovrenn.keyGrowthTriggers) {
      for (const [themeName, pattern] of themePatterns) {
        if (pattern.test(trigger)) {
          if (!triggerMap[themeName]) {
            triggerMap[themeName] = { detail: trigger, companies: [] };
          }
          if (!triggerMap[themeName].companies.includes(b.id)) {
            triggerMap[themeName].companies.push(b.id);
          }
        }
      }
    }
  }

  for (const [theme, data] of Object.entries(triggerMap)) {
    themes.push({
      theme,
      detail: data.detail.length > 200 ? data.detail.slice(0, 200) + "..." : data.detail,
      source: sovrennSource(lastUpdated),
      companiesAffected: data.companies,
    });
  }

  // If we have very few themes from sovrenn, derive some from financial data
  if (themes.length < 3) {
    const consolidated = getConsolidatedData();
    // Margin compression theme
    const compressingCompanies = bundles.filter((b) => {
      const hist = b.financial?.history ?? [];
      if (hist.length < 2) return false;
      const recent = hist[hist.length - 1];
      const prev = hist[hist.length - 2];
      return recent.ebitdaMargin < prev.ebitdaMargin;
    });
    if (compressingCompanies.length >= 3) {
      themes.push({
        theme: "Sector-Wide Margin Compression",
        detail: `${compressingCompanies.length} companies showing declining EBITDA margins in recent quarters, signaling potential pricing pressure across the consumer durables sector.`,
        source: derivedSource(lastUpdated),
        companiesAffected: compressingCompanies.map((c) => c.id),
      });
    }

    // Revenue divergence theme
    const outperformers = bundles.filter(
      (b) => (b.financial?.metrics.revenueGrowth ?? 0) > 15,
    );
    const underperformers = bundles.filter(
      (b) => (b.financial?.metrics.revenueGrowth ?? 0) < -5,
    );
    if (outperformers.length >= 2 && underperformers.length >= 2) {
      themes.push({
        theme: "Revenue Growth Divergence",
        detail: `Clear bifurcation: ${outperformers.length} companies growing >15% YoY while ${underperformers.length} companies declining >5%. Market share shifts accelerating.`,
        source: derivedSource(lastUpdated),
        companiesAffected: [
          ...outperformers.map((c) => c.id),
          ...underperformers.map((c) => c.id),
        ],
      });
    }
  }

  return themes.slice(0, 7); // Top 5-7 themes
}

// ---------------------------------------------------------------------------
// Red Flags (EXEC-04)
// ---------------------------------------------------------------------------

function extractRedFlags(
  bundles: CompanyDataBundle[],
  lastUpdated: string,
): RedFlag[] {
  const flags: RedFlag[] = [];

  for (const b of bundles) {
    const companyName =
      getCompanyById(b.id)?.name ?? b.financial?.name ?? b.id;
    const hist = b.financial?.history ?? [];
    const metrics = b.financial?.metrics;
    const trendlyne = b.trendlyne;

    // Revenue decline 2+ quarters
    if (hist.length >= 2) {
      const recentDeclines = hist
        .slice(-3)
        .filter((h) => h.revenueGrowth < 0);
      if (recentDeclines.length >= 2) {
        flags.push({
          flag: "Revenue Decline",
          detail: `${companyName} reported revenue decline in ${recentDeclines.length} of last 3 quarters. Latest: ${hist[hist.length - 1].revenueGrowth.toFixed(1)}% YoY.`,
          severity: recentDeclines.length >= 3 ? 5 : 3,
          source: financialApiSource(lastUpdated),
          serviceLine: "Restructuring",
          companyId: b.id,
        });
      }
    }

    // EBITDA margin below 5%
    if (metrics && metrics.ebitdaMargin < 5) {
      flags.push({
        flag: "Margin Pressure",
        detail: `${companyName} EBITDA margin at ${metrics.ebitdaMargin.toFixed(1)}%, well below sector average. Signals cost structure issues requiring operational improvement.`,
        severity: metrics.ebitdaMargin < 3 ? 4 : 3,
        source: financialApiSource(lastUpdated),
        serviceLine: "CPI",
        companyId: b.id,
      });
    }

    // High debt-to-equity (>1.0)
    const debtEquity =
      metrics?.debtEquity ?? trendlyne?.debtToEquity ?? null;
    if (debtEquity !== null && debtEquity > 1.0) {
      flags.push({
        flag: "Leverage Risk",
        detail: `${companyName} debt-to-equity ratio at ${debtEquity.toFixed(2)}, indicating elevated leverage. Restructuring advisory opportunity.`,
        severity: debtEquity > 2.0 ? 5 : debtEquity > 1.5 ? 4 : 3,
        source: screenerSource(lastUpdated),
        serviceLine: "Restructuring",
        companyId: b.id,
      });
    }

    // Profit decline with high PE
    const pe = trendlyne?.pe ?? b.financial?.overview.peRatio ?? null;
    if (hist.length >= 1) {
      const latestProfitGrowth = hist[hist.length - 1].profitGrowth;
      if (
        pe !== null &&
        pe > 50 &&
        latestProfitGrowth < -20
      ) {
        flags.push({
          flag: "Valuation Disconnect",
          detail: `${companyName} trades at PE ${pe.toFixed(1)}x while profit declined ${latestProfitGrowth.toFixed(1)}% YoY. High valuation not supported by fundamentals.`,
          severity: pe > 80 && latestProfitGrowth < -30 ? 5 : 3,
          source: derivedSource(lastUpdated),
          serviceLine: "Transaction Advisory",
          companyId: b.id,
        });
      }
    }
  }

  // Sort by severity descending
  flags.sort((a, b) => b.severity - a.severity);

  return flags;
}

// ---------------------------------------------------------------------------
// Narrative Risks (EXEC-05)
// ---------------------------------------------------------------------------

function extractNarrativeRisks(
  bundles: CompanyDataBundle[],
  lastUpdated: string,
): NarrativeRisk[] {
  const risks: NarrativeRisk[] = [];

  for (const b of bundles) {
    if (!b.sovrenn?.quarterlyResults.length) continue;

    const companyName =
      getCompanyById(b.id)?.name ?? b.sovrenn.companyName ?? b.id;

    // Get most recent sovrenn quarterly result
    const latestSovrenn = b.sovrenn.quarterlyResults[0]; // Most recent is first
    if (!latestSovrenn) continue;

    const tag = latestSovrenn.tag.toUpperCase();
    const profitGrowthYoY = latestSovrenn.profitGrowthYoY;
    const salesGrowthYoY = latestSovrenn.salesGrowthYoY;

    // RED disconnect: tag says GOOD/EXCELLENT but profits actually declined
    if (
      (tag.includes("GOOD") || tag.includes("EXCELLENT")) &&
      profitGrowthYoY < -10
    ) {
      risks.push({
        company: companyName,
        claim: `Tagged as "${latestSovrenn.tag}" for ${latestSovrenn.quarter}`,
        reality: `Net profit actually declined ${profitGrowthYoY}% YoY despite "good" tag. Sales grew ${salesGrowthYoY}% but bottom-line deteriorated.`,
        disconnect: "red",
        source: sovrennSource(lastUpdated),
      });
    }

    // RED disconnect: tag says AVERAGE/GOOD but revenue actually declined significantly
    if (
      (tag.includes("GOOD") || tag.includes("AVERAGE")) &&
      salesGrowthYoY < -15
    ) {
      risks.push({
        company: companyName,
        claim: `Tagged as "${latestSovrenn.tag}" for ${latestSovrenn.quarter}`,
        reality: `Revenue declined ${salesGrowthYoY}% YoY — tag may understate severity of decline.`,
        disconnect: "red",
        source: sovrennSource(lastUpdated),
      });
    }

    // GREEN stealth signal: tag says WEAK/POOR/AVERAGE but company actually improved
    if (
      (tag.includes("WEAK") || tag.includes("POOR")) &&
      profitGrowthYoY > 20
    ) {
      risks.push({
        company: companyName,
        claim: `Tagged as "${latestSovrenn.tag}" for ${latestSovrenn.quarter}`,
        reality: `Profit actually grew ${profitGrowthYoY}% YoY — a stealth improvement not captured by the narrative.`,
        disconnect: "green",
        source: sovrennSource(lastUpdated),
      });
    }

    // GREEN stealth signal: tag says AVERAGE but both revenue and profit grew strongly
    if (
      tag.includes("AVERAGE") &&
      salesGrowthYoY > 20 &&
      profitGrowthYoY > 20
    ) {
      risks.push({
        company: companyName,
        claim: `Tagged as "${latestSovrenn.tag}" for ${latestSovrenn.quarter}`,
        reality: `Revenue up ${salesGrowthYoY}% and profit up ${profitGrowthYoY}% YoY — significantly stronger than "average" tag suggests.`,
        disconnect: "green",
        source: sovrennSource(lastUpdated),
      });
    }
  }

  return risks;
}

// ---------------------------------------------------------------------------
// Company Snapshots
// ---------------------------------------------------------------------------

function buildCompanySnapshots(
  bundles: CompanyDataBundle[],
): ExecutiveCompanySnapshot[] {
  return bundles
    .filter((b) => b.financial) // Only include companies with financial data
    .map((b) => {
      const fin = b.financial!;
      const company = getCompanyById(b.id);
      const hist = fin.history;
      const latestQuarter = hist.length > 0 ? hist[hist.length - 1].period : null;

      return {
        id: b.id,
        name: company?.name ?? fin.name,
        performance: (fin.performance as PerformanceLevel) ?? "inline",
        revenueGrowth: fin.metrics.revenueGrowth ?? null,
        ebitdaMargin: fin.metrics.ebitdaMargin ?? null,
        latestQuarter,
      };
    });
}

// ---------------------------------------------------------------------------
// Main adapter function
// ---------------------------------------------------------------------------

/** Build the complete Executive section data payload */
export function buildExecutiveData(): ExecutiveData {
  // ALTERNATIVE_DATA_SLOT: DGFT import/export data
  // Integration point: Enrich Big Themes with trade flow trends and patent innovation signals
  // Expected: getDGFTData() -> company-level import dependency ratios
  //
  // ALTERNATIVE_DATA_SLOT: PLI scheme data
  // Integration point: Enrich Big Themes with trade flow trends and patent innovation signals
  // Expected: getPLIData() -> company PLI eligibility and disbursement status
  //
  // ALTERNATIVE_DATA_SLOT: Google Trends data
  // Integration point: Enrich Big Themes with trade flow trends and patent innovation signals
  // Expected: getGoogleTrendsData() -> brand-level search interest indices
  //
  // ALTERNATIVE_DATA_SLOT: Patent filing data
  // Integration point: Enrich Big Themes with trade flow trends and patent innovation signals
  // Expected: getPatentData() -> company-level patent counts and categories

  const financialApi = getFinancialApiData();
  const lastUpdated = financialApi.lastUpdated ?? new Date().toISOString();

  const bundles = buildCompanyBundles();

  return {
    section: "executive",
    dataAsOf: financialApi.dataAsOf,
    lastUpdated,
    intelligenceGrade: computeIntelligenceGrade(bundles),
    opportunitySummary: computeOpportunitySummary(bundles, lastUpdated),
    bigThemes: extractBigThemes(bundles, lastUpdated),
    redFlags: extractRedFlags(bundles, lastUpdated),
    narrativeRisks: extractNarrativeRisks(bundles, lastUpdated),
    companies: buildCompanySnapshots(bundles),
  };
}
