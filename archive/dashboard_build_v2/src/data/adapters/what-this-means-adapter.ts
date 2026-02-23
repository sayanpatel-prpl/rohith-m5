/**
 * What This Means For section data adapter.
 *
 * Builds WhatThisMeansData by cross-referencing existing section adapters:
 * - executive: big themes, narrative risks
 * - financial: A&M signals, EBITDA margins
 * - watchlist: stress indicators, consolidation targets, margin inflection
 * - operations: diagnostic triggers, metrics
 * - competitive: moves with capacity-expansion
 *
 * Generates stakeholder-specific insights for 4 tabs:
 * PE/Investors, Founders, COOs/CFOs, Supply Chain Heads.
 *
 * Each insight links to a source section and recommends an A&M service.
 * Never fabricates data. All insights traced to real section outputs.
 */

import { buildExecutiveData } from "./executive-adapter";
import { buildFinancialData } from "./financial-adapter";
import { buildWatchlistData } from "./watchlist-adapter";
import { buildOperationsData } from "./operations-adapter";
import { buildCompetitiveData } from "./competitive-adapter";

import type {
  WhatThisMeansData,
  StakeholderInsight,
  StakeholderTab,
  StakeholderTabSummary,
} from "../../types/what-this-means";
import type { SectionId } from "../../types/common";
import { crossRefSource } from "./source-helpers";

// ---------------------------------------------------------------------------
// Section label mapping
// ---------------------------------------------------------------------------

const SECTION_LABELS: Record<SectionId, string> = {
  executive: "Executive Snapshot",
  "am-value-add": "A&M Value-Add Opportunities",
  "market-pulse": "Market Pulse",
  financial: "Financial Performance",
  deals: "Deals & Transactions",
  operations: "Operational Intelligence",
  leadership: "Leadership & Governance",
  competitive: "Competitive Moves",
  "deep-dive": "Sub-Sector Deep Dive",
  "what-this-means": "What This Means For...",
  watchlist: "Watchlist & Forward Indicators",
};

// ---------------------------------------------------------------------------
// PE/Investors tab insights
// ---------------------------------------------------------------------------

function buildPEInsights(lastUpdated: string): StakeholderInsight[] {
  const insights: StakeholderInsight[] = [];
  const watchlist = buildWatchlistData();
  const exec = buildExecutiveData();
  const fin = buildFinancialData();
  let counter = 0;

  // From watchlist stressIndicators: distress creates entry opportunity
  for (const entry of watchlist.quadrants.stressIndicators) {
    if (entry.severity >= 3) {
      counter++;
      insights.push({
        id: `pe-stress-${counter}`,
        stakeholderTab: "pe-investors",
        headline: `Distress creates entry opportunity for ${entry.companyName}`,
        detail: `${entry.signal}: ${entry.detail} Potential opportunity to acquire position at distressed valuation.`,
        recommendedService: "Transaction Advisory",
        linkedSectionId: "watchlist",
        linkedSectionLabel: SECTION_LABELS.watchlist,
        companyIds: [entry.companyId],
        source: crossRefSource(lastUpdated),
      });
    }
  }

  // From watchlist consolidationTargets
  for (const entry of watchlist.quadrants.consolidationTargets) {
    counter++;
    insights.push({
      id: `pe-consol-${counter}`,
      stakeholderTab: "pe-investors",
      headline: `Consolidation target: ${entry.companyName} valued below sector`,
      detail: `${entry.detail} Potential PE acquisition or platform investment opportunity.`,
      recommendedService: "PE Services",
      linkedSectionId: "watchlist",
      linkedSectionLabel: SECTION_LABELS.watchlist,
      companyIds: [entry.companyId],
      source: crossRefSource(lastUpdated),
    });
  }

  // From executive narrativeRisks (disconnect = "red")
  for (const risk of exec.narrativeRisks) {
    if (risk.disconnect === "red") {
      const companySnapshot = exec.companies.find(
        (c) => c.name === risk.company,
      );
      const companyId = companySnapshot?.id ?? risk.company.toLowerCase().replace(/\s+/g, "-");
      counter++;
      insights.push({
        id: `pe-narrative-${counter}`,
        stakeholderTab: "pe-investors",
        headline: `Narrative disconnect at ${risk.company} -- verify before investment`,
        detail: `Claim: ${risk.claim}. Reality: ${risk.reality}. Due diligence critical before deploying capital.`,
        recommendedService: "Transaction Advisory",
        linkedSectionId: "executive",
        linkedSectionLabel: SECTION_LABELS.executive,
        companyIds: [companyId],
        source: crossRefSource(lastUpdated),
      });
    }
  }

  // From financial companies with amSignal = "transaction"
  for (const company of fin.companies) {
    if (company.amSignal === "transaction") {
      counter++;
      insights.push({
        id: `pe-transaction-${counter}`,
        stakeholderTab: "pe-investors",
        headline: `Transaction activity signals potential PE exit/entry for ${company.name}`,
        detail: `${company.amSignalReason} Strong financials with low leverage may attract PE interest.`,
        recommendedService: "PE Services",
        linkedSectionId: "financial",
        linkedSectionLabel: SECTION_LABELS.financial,
        companyIds: [company.id],
        source: crossRefSource(lastUpdated),
      });
    }
  }

  return insights;
}

// ---------------------------------------------------------------------------
// Founders tab insights
// ---------------------------------------------------------------------------

function buildFounderInsights(lastUpdated: string): StakeholderInsight[] {
  const insights: StakeholderInsight[] = [];
  const ops = buildOperationsData();
  const exec = buildExecutiveData();
  const fin = buildFinancialData();
  let counter = 0;

  // From operations diagnosticTriggers
  for (const trigger of ops.diagnosticTriggers) {
    counter++;
    insights.push({
      id: `founder-ops-${counter}`,
      stakeholderTab: "founders",
      headline: `Operational inefficiency flagged at ${trigger.company}: ${trigger.metric}`,
      detail: `${trigger.trigger}. ${trigger.metric} at ${trigger.value.toFixed(1)} (threshold: ${trigger.threshold}). Founder attention needed on operational fundamentals.`,
      recommendedService: trigger.amServiceLine,
      linkedSectionId: "operations",
      linkedSectionLabel: SECTION_LABELS.operations,
      companyIds: [trigger.companyId],
      source: crossRefSource(lastUpdated),
    });
  }

  // From executive bigThemes
  for (const theme of exec.bigThemes) {
    counter++;
    // Map theme to service line based on keywords
    const isDigital = /technology|digital|iot|automation/i.test(theme.theme);
    const recommendedService = isDigital ? "Digital" : "Operations";

    insights.push({
      id: `founder-theme-${counter}`,
      stakeholderTab: "founders",
      headline: `Sector theme "${theme.theme}" affects your company`,
      detail: `${theme.detail} Founders should assess strategic positioning relative to this sector-wide trend.`,
      recommendedService,
      linkedSectionId: "executive",
      linkedSectionLabel: SECTION_LABELS.executive,
      companyIds: theme.companiesAffected,
      source: crossRefSource(lastUpdated),
    });
  }

  // From financial companies with amSignal = "improvement"
  for (const company of fin.companies) {
    if (company.amSignal === "improvement") {
      counter++;
      insights.push({
        id: `founder-improve-${counter}`,
        stakeholderTab: "founders",
        headline: `Performance improvement needed at ${company.name}`,
        detail: `${company.amSignalReason} Founder-led performance improvement initiative recommended.`,
        recommendedService: "CPI",
        linkedSectionId: "financial",
        linkedSectionLabel: SECTION_LABELS.financial,
        companyIds: [company.id],
        source: crossRefSource(lastUpdated),
      });
    }
  }

  return insights;
}

// ---------------------------------------------------------------------------
// COOs/CFOs tab insights
// ---------------------------------------------------------------------------

function buildCOOCFOInsights(lastUpdated: string): StakeholderInsight[] {
  const insights: StakeholderInsight[] = [];
  const ops = buildOperationsData();
  const watchlist = buildWatchlistData();
  const fin = buildFinancialData();
  let counter = 0;

  // From operations diagnosticTriggers (WC, ROCE, D/E triggers)
  const wcRoceDeTriggers = ops.diagnosticTriggers.filter(
    (t) =>
      t.metric === "Working Capital Days" ||
      t.metric === "ROCE" ||
      t.metric === "Debt/Equity",
  );
  for (const trigger of wcRoceDeTriggers) {
    counter++;
    const headline =
      trigger.metric === "Working Capital Days"
        ? `Working capital optimization needed at ${trigger.company}`
        : trigger.metric === "ROCE"
          ? `Low ROCE at ${trigger.company} -- capital allocation review needed`
          : `High leverage at ${trigger.company} -- balance sheet optimization needed`;

    insights.push({
      id: `coo-ops-${counter}`,
      stakeholderTab: "coo-cfo",
      headline,
      detail: `${trigger.trigger}. ${trigger.metric} at ${trigger.value.toFixed(1)} vs threshold ${trigger.threshold}. CFO/COO action required.`,
      recommendedService: trigger.amServiceLine,
      linkedSectionId: "operations",
      linkedSectionLabel: SECTION_LABELS.operations,
      companyIds: [trigger.companyId],
      source: crossRefSource(lastUpdated),
    });
  }

  // From watchlist marginInflection (negative)
  for (const entry of watchlist.quadrants.marginInflection) {
    if (entry.signal.includes("Negative")) {
      counter++;
      insights.push({
        id: `coo-margin-${counter}`,
        stakeholderTab: "coo-cfo",
        headline: `Margin inflection warning at ${entry.companyName}`,
        detail: `${entry.detail} CFO should investigate cost structure and pricing power erosion.`,
        recommendedService: "CPI",
        linkedSectionId: "watchlist",
        linkedSectionLabel: SECTION_LABELS.watchlist,
        companyIds: [entry.companyId],
        source: crossRefSource(lastUpdated),
      });
    }
  }

  // From financial companies with low EBITDA margin (< sector median)
  // Compute sector median
  const margins = fin.companies
    .map((c) => c.metrics.ebitdaMargin)
    .filter((v): v is number => v != null && isFinite(v));
  margins.sort((a, b) => a - b);
  const sectorMedianMargin =
    margins.length > 0 ? margins[Math.floor(margins.length / 2)] : 8;

  for (const company of fin.companies) {
    if (
      company.metrics.ebitdaMargin != null &&
      company.metrics.ebitdaMargin < sectorMedianMargin
    ) {
      counter++;
      insights.push({
        id: `coo-belowmedian-${counter}`,
        stakeholderTab: "coo-cfo",
        headline: `Below-median margin at ${company.name} requires operational focus`,
        detail: `EBITDA margin ${company.metrics.ebitdaMargin.toFixed(1)}% vs sector median ${sectorMedianMargin.toFixed(1)}%. COO should drive cost optimization and process efficiency.`,
        recommendedService: "Operations",
        linkedSectionId: "financial",
        linkedSectionLabel: SECTION_LABELS.financial,
        companyIds: [company.id],
        source: crossRefSource(lastUpdated),
      });
    }
  }

  return insights;
}

// ---------------------------------------------------------------------------
// Supply Chain Heads tab insights
// ---------------------------------------------------------------------------

function buildSupplyChainInsights(lastUpdated: string): StakeholderInsight[] {
  const insights: StakeholderInsight[] = [];
  const ops = buildOperationsData();
  const comp = buildCompetitiveData();
  const exec = buildExecutiveData();
  let counter = 0;

  // From operations metrics with high inventoryDays/debtorDays
  // Threshold: > sector median for these metrics
  const invDays = ops.metrics
    .map((m) => m.inventoryDays)
    .filter((v) => v > 0);
  const medianInvDays =
    invDays.length > 0
      ? invDays.sort((a, b) => a - b)[Math.floor(invDays.length / 2)]
      : 60;

  const debDays = ops.metrics
    .map((m) => m.debtorDays)
    .filter((v) => v > 0);
  const medianDebDays =
    debDays.length > 0
      ? debDays.sort((a, b) => a - b)[Math.floor(debDays.length / 2)]
      : 45;

  for (const row of ops.metrics) {
    if (row.inventoryDays > medianInvDays && row.inventoryDays > 0) {
      counter++;
      insights.push({
        id: `sc-inv-${counter}`,
        stakeholderTab: "supply-chain",
        headline: `Inventory efficiency gap at ${row.company}`,
        detail: `Inventory days at ${row.inventoryDays.toFixed(0)} vs sector median ${medianInvDays.toFixed(0)} days. Supply chain optimization can free working capital.`,
        recommendedService: "Operations",
        linkedSectionId: "operations",
        linkedSectionLabel: SECTION_LABELS.operations,
        companyIds: [row.companyId],
        source: crossRefSource(lastUpdated),
      });
    }

    if (row.debtorDays > medianDebDays && row.debtorDays > 0) {
      counter++;
      insights.push({
        id: `sc-deb-${counter}`,
        stakeholderTab: "supply-chain",
        headline: `High debtor days at ${row.company} -- collection cycle review`,
        detail: `Debtor days at ${row.debtorDays.toFixed(0)} vs sector median ${medianDebDays.toFixed(0)} days. Indicates potential channel/dealer payment issues.`,
        recommendedService: "Operations",
        linkedSectionId: "operations",
        linkedSectionLabel: SECTION_LABELS.operations,
        companyIds: [row.companyId],
        source: crossRefSource(lastUpdated),
      });
    }
  }

  // From competitive moves with moveType = "capacity-expansion"
  const capacityMoves = comp.moves.filter(
    (m) => m.moveType === "capacity-expansion",
  );
  if (capacityMoves.length > 0) {
    // Group by company
    const companyMoveMap = new Map<string, string[]>();
    for (const move of capacityMoves) {
      const existing = companyMoveMap.get(move.companyId) ?? [];
      existing.push(move.company);
      companyMoveMap.set(move.companyId, existing);
    }

    counter++;
    insights.push({
      id: `sc-capacity-${counter}`,
      stakeholderTab: "supply-chain",
      headline: `Competitor capacity expansion -- supply chain implications`,
      detail: `${capacityMoves.length} capacity expansion moves detected across ${companyMoveMap.size} companies. Existing supply chain heads should anticipate shifts in supplier bargaining power, logistics demand, and material pricing.`,
      recommendedService: "Operations",
      linkedSectionId: "competitive",
      linkedSectionLabel: SECTION_LABELS.competitive,
      companyIds: Array.from(companyMoveMap.keys()),
      source: crossRefSource(lastUpdated),
    });
  }

  // From executive bigThemes with expansion/capacity keywords
  const expansionThemes = exec.bigThemes.filter((t) =>
    /expansion|capacity|facility|manufacturing|growth/i.test(t.theme),
  );
  for (const theme of expansionThemes) {
    counter++;
    insights.push({
      id: `sc-theme-${counter}`,
      stakeholderTab: "supply-chain",
      headline: `Industry expansion creates supply chain opportunity`,
      detail: `Theme: "${theme.theme}" -- ${theme.detail} Supply chain leaders should prepare for demand ramp-up and logistics complexity.`,
      recommendedService: "Operations",
      linkedSectionId: "executive",
      linkedSectionLabel: SECTION_LABELS.executive,
      companyIds: theme.companiesAffected,
      source: crossRefSource(lastUpdated),
    });
  }

  return insights;
}

// ---------------------------------------------------------------------------
// Tab summary builder
// ---------------------------------------------------------------------------

const TAB_LABELS: Record<StakeholderTab, string> = {
  "pe-investors": "PE/Investors",
  founders: "Founders",
  "coo-cfo": "COOs/CFOs",
  "supply-chain": "Supply Chain Heads",
};

function buildTabSummaries(
  insights: StakeholderInsight[],
): StakeholderTabSummary[] {
  const tabs: StakeholderTab[] = [
    "pe-investors",
    "founders",
    "coo-cfo",
    "supply-chain",
  ];

  return tabs.map((tab) => ({
    tab,
    label: TAB_LABELS[tab],
    insightCount: insights.filter((i) => i.stakeholderTab === tab).length,
  }));
}

// ---------------------------------------------------------------------------
// Main adapter function
// ---------------------------------------------------------------------------

/** Build the complete What This Means For section data payload */
export function buildWhatThisMeansData(): WhatThisMeansData {
  const now = new Date().toISOString();

  // Build insights for all 4 tabs
  const allInsights: StakeholderInsight[] = [
    ...buildPEInsights(now),
    ...buildFounderInsights(now),
    ...buildCOOCFOInsights(now),
    ...buildSupplyChainInsights(now),
  ];

  // Build tab summaries
  const tabs = buildTabSummaries(allInsights);

  return {
    section: "what-this-means",
    dataAsOf: "FY2026",
    lastUpdated: now,
    insights: allInsights,
    tabs,
  };
}
