/**
 * A&M Value-Add section data adapter.
 *
 * Builds AMValueAddData by cross-referencing ALL existing section adapters:
 * - executive: red flags, opportunity summary
 * - financial: A&M signal triage (turnaround/improvement/transaction)
 * - deals: active deals with A&M angles
 * - watchlist: stress indicators, consolidation targets
 * - operations: diagnostic triggers
 * - competitive: moves with operational implications
 *
 * Auto-generates advisory engagement opportunities with pipeline staging,
 * practice area tagging, and evidence data points. Deduplicates by
 * companyId + practiceArea, keeping the highest pipeline stage.
 *
 * Never fabricates data. All opportunities traced to real section outputs.
 */

import { buildExecutiveData } from "./executive-adapter";
import { buildFinancialData } from "./financial-adapter";
import { buildDealsData } from "./deals-adapter";
import { buildWatchlistData } from "./watchlist-adapter";
import { buildOperationsData } from "./operations-adapter";
import { buildCompetitiveData } from "./competitive-adapter";

import type {
  AMValueAddData,
  Opportunity,
  PipelineStage,
  PipelineSummary,
} from "../../types/am-value-add";
import type { AMServiceLine } from "../../types/am-theme";
import type { SourceInfo } from "../../types/source";

// ---------------------------------------------------------------------------
// Source helpers
// ---------------------------------------------------------------------------

function crossRefSource(lastUpdated: string): SourceInfo {
  return {
    source: "Cross-section derived analysis",
    confidence: "derived",
    tier: 4,
    lastUpdated,
  };
}

// ---------------------------------------------------------------------------
// Pipeline stage ordering (for dedup: higher = stronger signal)
// ---------------------------------------------------------------------------

const STAGE_ORDER: Record<PipelineStage, number> = {
  identified: 0,
  qualified: 1,
  "outreach-ready": 2,
};

// ---------------------------------------------------------------------------
// Opportunity extraction from each section
// ---------------------------------------------------------------------------

function extractFromExecutive(lastUpdated: string): Opportunity[] {
  const exec = buildExecutiveData();
  const opps: Opportunity[] = [];

  // Red flags with severity >= 3 map to opportunities
  for (const flag of exec.redFlags) {
    if (flag.severity >= 3) {
      const companyName =
        exec.companies.find((c) => c.id === flag.companyId)?.name ??
        flag.companyId;

      opps.push({
        id: `exec-rf-${flag.companyId}-${flag.serviceLine}`,
        companyId: flag.companyId,
        companyName,
        engagementType: `${flag.serviceLine} Advisory`,
        estimatedSizeCr: null,
        practiceArea: flag.serviceLine,
        pipelineStage: "identified",
        keyDataPoints: [
          `Red flag: ${flag.flag} (severity ${flag.severity}/5)`,
          flag.detail,
        ],
        sourceSection: "Executive Snapshot",
        source: crossRefSource(lastUpdated),
      });
    }
  }

  return opps;
}

function extractFromFinancial(lastUpdated: string): Opportunity[] {
  const fin = buildFinancialData();
  const opps: Opportunity[] = [];

  for (const company of fin.companies) {
    if (company.amSignal === "turnaround") {
      opps.push({
        id: `fin-turnaround-${company.id}`,
        companyId: company.id,
        companyName: company.name,
        engagementType: "Turnaround Advisory",
        estimatedSizeCr: null, // Will be enriched during dedup
        practiceArea: "Restructuring",
        pipelineStage: "qualified", // Stronger financial signal
        keyDataPoints: [
          `A&M signal: turnaround`,
          company.amSignalReason,
          `Revenue growth: ${company.metrics.revenueGrowth?.toFixed(1) ?? "-"}%`,
          `EBITDA margin: ${company.metrics.ebitdaMargin?.toFixed(1) ?? "-"}%`,
        ],
        sourceSection: "Financial Performance",
        source: crossRefSource(lastUpdated),
      });
    } else if (company.amSignal === "improvement") {
      opps.push({
        id: `fin-improvement-${company.id}`,
        companyId: company.id,
        companyName: company.name,
        engagementType: "CPI Assessment",
        estimatedSizeCr: null,
        practiceArea: "CPI",
        pipelineStage: "identified",
        keyDataPoints: [
          `A&M signal: improvement`,
          company.amSignalReason,
          `EBITDA margin: ${company.metrics.ebitdaMargin?.toFixed(1) ?? "-"}%`,
        ],
        sourceSection: "Financial Performance",
        source: crossRefSource(lastUpdated),
      });
    }
  }

  return opps;
}

function extractFromDeals(lastUpdated: string): Opportunity[] {
  const deals = buildDealsData();
  const opps: Opportunity[] = [];

  for (const deal of deals.deals) {
    // Only deals with clear advisory angles
    if (deal.dealType === "acquisition" || deal.dealType === "investment") {
      const estimatedSizeCr =
        deal.valueCr != null ? Math.round(deal.valueCr * 0.02) : null;

      opps.push({
        id: `deal-${deal.id}-${deal.companyId}`,
        companyId: deal.companyId,
        companyName: deal.companyName,
        engagementType: "Transaction Advisory",
        estimatedSizeCr,
        practiceArea: "Transaction Advisory",
        pipelineStage: "qualified", // Active deal = stronger signal
        keyDataPoints: [
          `Deal: ${deal.dealTypeLabel} -- ${deal.description.slice(0, 120)}`,
          `A&M angle: ${deal.amAngle}`,
          deal.valueCr
            ? `Deal value: INR ${deal.valueCr.toLocaleString("en-IN")} Cr`
            : "Deal value: Undisclosed",
        ],
        sourceSection: "Deals & Transactions",
        source: crossRefSource(lastUpdated),
      });
    }
  }

  return opps;
}

function extractFromWatchlist(lastUpdated: string): Opportunity[] {
  const watchlist = buildWatchlistData();
  const opps: Opportunity[] = [];

  // Stress indicators with severity >= 3
  for (const entry of watchlist.quadrants.stressIndicators) {
    if (entry.severity >= 3) {
      const stage: PipelineStage =
        entry.severity >= 4 ? "outreach-ready" : "qualified";

      opps.push({
        id: `watch-stress-${entry.companyId}-${entry.serviceLine}`,
        companyId: entry.companyId,
        companyName: entry.companyName,
        engagementType: `${entry.serviceLine} Engagement`,
        estimatedSizeCr: null,
        practiceArea: entry.serviceLine,
        pipelineStage: stage,
        keyDataPoints: [
          `Stress signal: ${entry.signal} (severity ${entry.severity}/5)`,
          entry.detail,
        ],
        sourceSection: "Watchlist & Forward Indicators",
        source: crossRefSource(lastUpdated),
      });
    }
  }

  // Consolidation targets
  for (const entry of watchlist.quadrants.consolidationTargets) {
    opps.push({
      id: `watch-consol-${entry.companyId}`,
      companyId: entry.companyId,
      companyName: entry.companyName,
      engagementType: "Transaction Advisory",
      estimatedSizeCr: null,
      practiceArea: "Transaction Advisory",
      pipelineStage: "identified",
      keyDataPoints: [
        `Consolidation target: ${entry.signal}`,
        entry.detail,
      ],
      sourceSection: "Watchlist & Forward Indicators",
      source: crossRefSource(lastUpdated),
    });
  }

  return opps;
}

function extractFromOperations(lastUpdated: string): Opportunity[] {
  const ops = buildOperationsData();
  const opps: Opportunity[] = [];

  for (const trigger of ops.diagnosticTriggers) {
    opps.push({
      id: `ops-trigger-${trigger.companyId}-${trigger.metric}`,
      companyId: trigger.companyId,
      companyName: trigger.company,
      engagementType: `${trigger.amServiceLine} Assessment`,
      estimatedSizeCr: null,
      practiceArea: trigger.amServiceLine,
      pipelineStage: "identified",
      keyDataPoints: [
        `Diagnostic trigger: ${trigger.trigger}`,
        `${trigger.metric}: ${trigger.value.toFixed(1)} (threshold: ${trigger.threshold})`,
      ],
      sourceSection: "Operational Intelligence",
      source: crossRefSource(lastUpdated),
    });
  }

  return opps;
}

function extractFromCompetitive(lastUpdated: string): Opportunity[] {
  const comp = buildCompetitiveData();
  const opps: Opportunity[] = [];

  // Companies with 3+ competitive moves -> operations assessment
  for (const row of comp.intensityMatrix) {
    if (row.totalMoves >= 3) {
      opps.push({
        id: `comp-intensity-${row.companyId}`,
        companyId: row.companyId,
        companyName: row.company,
        engagementType: "Operations Assessment",
        estimatedSizeCr: null,
        practiceArea: "Operations",
        pipelineStage: "identified",
        keyDataPoints: [
          `${row.totalMoves} competitive moves detected`,
          `High activity suggests operational complexity and advisory opportunity`,
        ],
        sourceSection: "Competitive Moves",
        source: crossRefSource(lastUpdated),
      });
    }
  }

  return opps;
}

// ---------------------------------------------------------------------------
// Deduplication: companyId + practiceArea
// ---------------------------------------------------------------------------

function deduplicateOpportunities(opps: Opportunity[]): Opportunity[] {
  const map = new Map<string, Opportunity>();

  for (const opp of opps) {
    const key = `${opp.companyId}::${opp.practiceArea}`;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, opp);
    } else {
      // Keep the one with the highest pipeline stage
      const existingRank = STAGE_ORDER[existing.pipelineStage];
      const newRank = STAGE_ORDER[opp.pipelineStage];

      if (newRank > existingRank) {
        // New has higher stage -- use it but merge keyDataPoints
        const merged = {
          ...opp,
          keyDataPoints: [
            ...opp.keyDataPoints,
            ...existing.keyDataPoints.filter(
              (dp) => !opp.keyDataPoints.includes(dp),
            ),
          ],
          sourceSection: `${opp.sourceSection}, ${existing.sourceSection}`,
          estimatedSizeCr:
            opp.estimatedSizeCr ?? existing.estimatedSizeCr,
        };
        map.set(key, merged);
      } else {
        // Existing has higher or equal stage -- merge data points into it
        existing.keyDataPoints = [
          ...existing.keyDataPoints,
          ...opp.keyDataPoints.filter(
            (dp) => !existing.keyDataPoints.includes(dp),
          ),
        ];
        existing.sourceSection = `${existing.sourceSection}, ${opp.sourceSection}`;
        if (existing.estimatedSizeCr == null && opp.estimatedSizeCr != null) {
          existing.estimatedSizeCr = opp.estimatedSizeCr;
        }
      }
    }
  }

  return Array.from(map.values());
}

// ---------------------------------------------------------------------------
// Enrich with market cap estimate
// ---------------------------------------------------------------------------

function enrichEstimatedSize(opps: Opportunity[]): void {
  const fin = buildFinancialData();

  for (const opp of opps) {
    if (opp.estimatedSizeCr != null) continue;

    const company = fin.companies.find((c) => c.id === opp.companyId);
    if (!company) continue;

    // Look up market cap from financial history (latest revenue as proxy when no market cap)
    // The financial adapter has overview via the loader which includes marketCapCr
    // We use a 2% fee proxy of company revenue as an estimate
    const latestRevenue = company.metrics.revenue;
    if (latestRevenue != null && latestRevenue > 0) {
      opp.estimatedSizeCr = Math.round(latestRevenue * 0.02);
    }
  }
}

// ---------------------------------------------------------------------------
// Pipeline Summary
// ---------------------------------------------------------------------------

function buildPipelineSummary(opps: Opportunity[]): PipelineSummary {
  let identified = 0;
  let qualified = 0;
  let outreachReady = 0;
  let totalValue = 0;
  let hasAnyValue = false;
  const practiceAreaCounts: Record<string, number> = {};

  for (const opp of opps) {
    switch (opp.pipelineStage) {
      case "identified":
        identified++;
        break;
      case "qualified":
        qualified++;
        break;
      case "outreach-ready":
        outreachReady++;
        break;
    }

    if (opp.estimatedSizeCr != null) {
      totalValue += opp.estimatedSizeCr;
      hasAnyValue = true;
    }

    practiceAreaCounts[opp.practiceArea] =
      (practiceAreaCounts[opp.practiceArea] ?? 0) + 1;
  }

  const byPracticeArea = Object.entries(practiceAreaCounts).map(
    ([area, count]) => ({
      practiceArea: area as AMServiceLine,
      count,
    }),
  );

  // Sort by count descending
  byPracticeArea.sort((a, b) => b.count - a.count);

  return {
    identified,
    qualified,
    outreachReady,
    totalEstimatedValueCr: hasAnyValue ? totalValue : null,
    byPracticeArea,
  };
}

// ---------------------------------------------------------------------------
// Main adapter function
// ---------------------------------------------------------------------------

/** Build the complete A&M Value-Add section data payload */
export function buildAMValueAddData(): AMValueAddData {
  const now = new Date().toISOString();

  // Extract opportunities from all sections
  const rawOpps: Opportunity[] = [
    ...extractFromExecutive(now),
    ...extractFromFinancial(now),
    ...extractFromDeals(now),
    ...extractFromWatchlist(now),
    ...extractFromOperations(now),
    ...extractFromCompetitive(now),
  ];

  // Deduplicate by companyId + practiceArea
  const deduped = deduplicateOpportunities(rawOpps);

  // Enrich with estimated size from financial data
  enrichEstimatedSize(deduped);

  // Sort: outreach-ready first, then qualified, then identified
  deduped.sort(
    (a, b) =>
      STAGE_ORDER[b.pipelineStage] - STAGE_ORDER[a.pipelineStage],
  );

  // Build pipeline summary
  const pipeline = buildPipelineSummary(deduped);

  return {
    section: "am-value-add",
    dataAsOf: "FY2026",
    lastUpdated: now,
    opportunities: deduped,
    pipeline,
  };
}
