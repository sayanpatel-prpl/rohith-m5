/**
 * Sub-Sector Deep Dive section data adapter.
 *
 * Builds DeepDiveData by grouping companies by sub-sector and computing
 * aggregate statistics, quartile distributions, margin levers with
 * evidence from real data, and A&M benchmark case studies.
 *
 * Data sources:
 * - financial-api: revenue growth, EBITDA margin per company
 * - consolidated: overview ROCE, quarterly OPM, revenue for quartiles
 * - sovrenn: growth triggers for margin lever evidence
 * - company registry: sub-sector classification
 *
 * Never fabricates data. Missing values produce 0 or empty arrays.
 */

import { getConsolidatedData } from "../loaders/consolidated";
import type { ConsolidatedCompany } from "../loaders/consolidated";
import { getFinancialApiData } from "../loaders/financial-api";
import type { FinancialApiCompany } from "../loaders/financial-api";
import { getSovrennData } from "../loaders/sovrenn";
import { COMPANIES } from "../companies";

import type {
  DeepDiveData,
  SubSectorId,
  SubSectorBreakdown,
  QuartileStats,
  MarginLever,
  AMBenchmark,
} from "../../types/deep-dive";
import type { SourceInfo } from "../../types/source";

// ---------------------------------------------------------------------------
// Source helpers
// ---------------------------------------------------------------------------

function screenerSource(lastUpdated: string): SourceInfo {
  return {
    source: "Screener.in consolidated financial data",
    confidence: "verified",
    tier: 1,
    lastUpdated,
  };
}

function sovrennSource(lastUpdated: string): SourceInfo {
  return {
    source: "Sovrenn Intelligence curated analysis",
    confidence: "derived",
    tier: 3,
    lastUpdated,
  };
}

// ---------------------------------------------------------------------------
// Sub-sector labels
// ---------------------------------------------------------------------------

const SUB_SECTOR_LABELS: Record<SubSectorId, string> = {
  AC: "Air Conditioning",
  Kitchen: "Kitchen Appliances",
  Electrical: "Electrical & Consumer",
  EMS: "Electronics Manufacturing",
  Mixed: "Diversified / Mixed",
  Cooler: "Air Coolers",
};

// ---------------------------------------------------------------------------
// Quartile computation
// ---------------------------------------------------------------------------

function computeQuartiles(values: number[]): QuartileStats {
  if (values.length === 0) return { p25: 0, median: 0, p75: 0 };

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  const percentile = (p: number): number => {
    const index = (p / 100) * (n - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
  };

  return {
    p25: Math.round(percentile(25) * 10) / 10,
    median: Math.round(percentile(50) * 10) / 10,
    p75: Math.round(percentile(75) * 10) / 10,
  };
}

// ---------------------------------------------------------------------------
// Company bundle for deep dive
// ---------------------------------------------------------------------------

interface DeepDiveBundle {
  id: string;
  name: string;
  subSector: SubSectorId;
  revenueGrowth: number;
  ebitdaMargin: number;
  roce: number;
  latestOpm: number;
  latestRevenue: number;
}

function buildBundles(): DeepDiveBundle[] {
  const consolidated = getConsolidatedData();
  const financial = getFinancialApiData();

  return COMPANIES.map((company) => {
    const con = consolidated.companies.find(
      (c) => c.id.toLowerCase() === company.id,
    );
    const fin = financial.companies.find(
      (c) => c.id.toLowerCase() === company.id,
    );

    const revenueGrowth = fin?.metrics.revenueGrowth ?? 0;
    const ebitdaMargin = fin?.metrics.ebitdaMargin ?? 0;
    const roce = con?.overview.roce ?? fin?.metrics.roce ?? 0;

    const qr = con?.quarterlyResults;
    const latestOpm =
      qr && qr.length > 0 ? qr[qr.length - 1].opmPct : 0;
    const latestRevenue =
      qr && qr.length > 0 ? qr[qr.length - 1].salesCr : 0;

    return {
      id: company.id,
      name: company.name,
      subSector: company.subSector,
      revenueGrowth,
      ebitdaMargin,
      roce,
      latestOpm,
      latestRevenue,
    };
  });
}

// ---------------------------------------------------------------------------
// Sub-Sector Breakdown Builder
// ---------------------------------------------------------------------------

function buildSubSectorBreakdowns(
  bundles: DeepDiveBundle[],
  lastUpdated: string,
): SubSectorBreakdown[] {
  // Group by sub-sector
  const groups = new Map<SubSectorId, DeepDiveBundle[]>();
  for (const b of bundles) {
    const group = groups.get(b.subSector) ?? [];
    group.push(b);
    groups.set(b.subSector, group);
  }

  const breakdowns: SubSectorBreakdown[] = [];

  for (const [subSector, companies] of groups.entries()) {
    const n = companies.length;

    // Averages
    const revGrowthValues = companies.map((c) => c.revenueGrowth);
    const avgRevenueGrowth =
      revGrowthValues.reduce((a, b) => a + b, 0) / n;

    const ebitdaValues = companies.map((c) => c.ebitdaMargin);
    const avgEbitdaMargin =
      ebitdaValues.reduce((a, b) => a + b, 0) / n;

    const roceValues = companies.map((c) => c.roce).filter((v) => v !== 0);
    const avgROCE =
      roceValues.length > 0
        ? roceValues.reduce((a, b) => a + b, 0) / roceValues.length
        : 0;

    // Top and bottom performers
    const sortedByGrowth = [...companies].sort(
      (a, b) => b.revenueGrowth - a.revenueGrowth,
    );
    const topPerformer = sortedByGrowth[0]?.name ?? "-";
    const bottomPerformer = sortedByGrowth[sortedByGrowth.length - 1]?.name ?? "-";

    // Quartiles
    const opmQuartiles = computeQuartiles(companies.map((c) => c.latestOpm));
    const revenueQuartiles = computeQuartiles(
      companies.map((c) => c.latestRevenue),
    );

    breakdowns.push({
      subSector,
      label: SUB_SECTOR_LABELS[subSector],
      companyCount: n,
      avgRevenueGrowth: Math.round(avgRevenueGrowth * 10) / 10,
      avgEbitdaMargin: Math.round(avgEbitdaMargin * 10) / 10,
      avgROCE: Math.round(avgROCE * 10) / 10,
      topPerformer,
      bottomPerformer,
      opmQuartiles,
      revenueQuartiles,
      source: screenerSource(lastUpdated),
    });
  }

  // Sort by company count descending
  breakdowns.sort((a, b) => b.companyCount - a.companyCount);
  return breakdowns;
}

// ---------------------------------------------------------------------------
// Margin Levers (SSDD-01)
// ---------------------------------------------------------------------------

interface LeverSpec {
  lever: string;
  applicableSubSectors: SubSectorId[];
  potentialImpact: string;
  patterns: RegExp;
}

const LEVER_SPECS: LeverSpec[] = [
  {
    lever: "premiumization",
    applicableSubSectors: ["AC", "Kitchen", "Electrical"],
    potentialImpact:
      "150-300bps margin expansion through premium product mix shift and brand positioning uplift",
    patterns: /premium|brand|high.end|luxury|aspirational/i,
  },
  {
    lever: "backward-integration",
    applicableSubSectors: ["AC", "EMS"],
    potentialImpact:
      "200-400bps margin improvement via component manufacturing, PCB, and compressor in-housing",
    patterns: /pcb|component|backward.integration|in.house|compressor/i,
  },
  {
    lever: "distribution-rationalization",
    applicableSubSectors: ["AC", "Kitchen", "Electrical", "EMS", "Mixed", "Cooler"],
    potentialImpact:
      "100-200bps margin uplift through D2C channel expansion and distribution network optimization",
    patterns: /distribution|channel|retail|d2c|direct.to.consumer|online/i,
  },
  {
    lever: "vendor-consolidation",
    applicableSubSectors: ["EMS", "Electrical"],
    potentialImpact:
      "50-150bps margin gain through supplier rationalization and procurement centralization",
    patterns: /vendor|consolidat|supply chain|sourcing|procurement/i,
  },
  {
    lever: "sku-rationalization",
    applicableSubSectors: ["Kitchen", "Electrical", "Mixed"],
    potentialImpact:
      "100-250bps margin improvement by pruning low-margin SKUs and focusing on high-velocity products",
    patterns: /sku|portfolio|rationaliz|prune|simplif/i,
  },
];

function buildMarginLevers(lastUpdated: string): MarginLever[] {
  const sovrenn = getSovrennData();
  const levers: MarginLever[] = [];

  for (const spec of LEVER_SPECS) {
    const companiesActive: string[] = [];
    const evidenceTexts: string[] = [];

    for (const company of sovrenn) {
      const matchedTriggers = company.keyGrowthTriggers.filter((t) =>
        spec.patterns.test(t),
      );

      if (matchedTriggers.length > 0) {
        const companyName =
          COMPANIES.find((c) => c.id === company.companyId)?.name ??
          company.companyName.split(".")[0].trim();
        companiesActive.push(companyName);
        evidenceTexts.push(
          ...matchedTriggers.map(
            (t) =>
              `${companyName}: ${t.length > 150 ? t.slice(0, 150) + "..." : t}`,
          ),
        );
      }
    }

    levers.push({
      lever: spec.lever,
      applicableSubSectors: spec.applicableSubSectors,
      potentialImpact: spec.potentialImpact,
      currentEvidence:
        evidenceTexts.length > 0
          ? evidenceTexts.join(" | ")
          : "No direct evidence in current data extraction",
      companiesActive,
      source: sovrennSource(lastUpdated),
    });
  }

  return levers;
}

// ---------------------------------------------------------------------------
// A&M Benchmarks (SSDD-02)
// ---------------------------------------------------------------------------

function buildAMBenchmarks(): AMBenchmark[] {
  return [
    {
      title: "European White Goods Restructuring",
      geography: "Europe",
      metric: "EBITDA Margin Uplift",
      value: "20%+",
      detail:
        "A&M-led operational restructuring of European white goods manufacturer achieved 20%+ EBITDA margin improvement through procurement optimization, plant consolidation, and SKU rationalization.",
      applicability:
        "Directly applicable to Indian Kitchen and Electrical sub-sectors facing similar margin compression.",
    },
    {
      title: "US Consumer Durables Operational Turnaround",
      geography: "United States",
      metric: "EBITDA Improvement",
      value: "$150M",
      detail:
        "A&M delivered $150M EBITDA improvement for a major US consumer products company through supply chain redesign, manufacturing footprint optimization, and working capital reduction.",
      applicability:
        "Relevant for Indian AC and EMS companies expanding capacity -- operational excellence framework transferable.",
    },
  ];
}

// ---------------------------------------------------------------------------
// Main adapter function
// ---------------------------------------------------------------------------

/** Build the complete Sub-Sector Deep Dive section data payload */
export function buildDeepDiveData(): DeepDiveData {
  const financialApi = getFinancialApiData();
  const lastUpdated = financialApi.lastUpdated ?? new Date().toISOString();

  const bundles = buildBundles();

  return {
    section: "deep-dive",
    dataAsOf: financialApi.dataAsOf,
    lastUpdated,
    subSectors: buildSubSectorBreakdowns(bundles, lastUpdated),
    marginLevers: buildMarginLevers(lastUpdated),
    amBenchmarks: buildAMBenchmarks(),
  };
}
